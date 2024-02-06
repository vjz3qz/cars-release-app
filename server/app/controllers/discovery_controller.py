from langchain_community.vectorstores import SupabaseVectorStore
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.runnables import RunnableParallel
from langchain.prompts import PromptTemplate
from app.services.database_service import vector_db
from app.services.nlp_service import embeddings, chat_model
from app.services.blob_storage_service import get_file_url
import logging


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


def fetch_procedure_requirements_by_insurance(
    insurance_provider,
    procedure,
    cpt_code,
    history_of_present_illness,
    additional_information,
):
    """
    Semantically searches database for matching text based on embeddings

    Parameters:
    -----------
    insurance_provider : string
        insurance type
    procedure : string
        procedure
    cpt_code : string
        cpt code
    history_of_present_illness : string
        history of present illness
    additional_information : string

    Returns:
    --------
    List[Documents]
        Matched docs based on user query
    str
        Response text generated by GPT-4
    """
    try:
        vector_store = SupabaseVectorStore(
            embedding=embeddings,
            client=vector_db,
            table_name=insurance_provider,
            query_name=f"match_{insurance_provider}_documents",
        )
        retriever = vector_store.as_retriever()
        template = """You are a physicians assistant who is doing prior authorization work. 
                      You are given some context and procedure and you must determine whether or not the prior
                      authorization requirements for the procedure in question are met or not. If they are met,
                      explain how exactly they are met, referencing the context. If they are not met, explain 
                      what the requirements are and how the doctor could meet them. Use markdown to bold requirements
                      that are important and not being met.
                      Here is the context: {context} 
                      This is the patient's insurance provider: {insurance_provider} 
                      This is the requested procedure: {procedure}
                      Question: {question}
                      Helpful Answer:"""

        pass_through_question = f"what documentation, tests, and patient data do I need to send in a prior authorization request to {insurance_provider} to prove medical necessity for {procedure}?"
        if cpt_code:
            pass_through_question += f"\nThis is the CPT code: {cpt_code}"

        if history_of_present_illness:
            pass_through_question += f"\nThis is the history of present illness: {history_of_present_illness}"

        if additional_information:
            pass_through_question += (
                f"\nThis is the additional information: {additional_information}"
            )
        rag_prompt = PromptTemplate.from_template(template)
        rag_chain_from_docs = (
            RunnablePassthrough.assign(context=(lambda x: format_docs(x["context"])))
            | rag_prompt
            | chat_model
            | StrOutputParser()
        )
        rag_chain_with_source = RunnableParallel(
            {
                "context": retriever,
                "insurance_provider": RunnablePassthrough(value=insurance_provider),
                "procedure": RunnablePassthrough(value=procedure),
                "question": RunnablePassthrough(),
            }
        ).assign(answer=rag_chain_from_docs)
        response = rag_chain_with_source.invoke(pass_through_question)
        response_text, matched_docs = response["answer"], response["context"]
        sources = set()
        for doc in matched_docs:
            sources.add(
                get_file_url(
                    doc.metadata["file_id"], doc.metadata["insurance_provider"]
                )
            )
        sources = list(sources)
        return response_text, sources

    except Exception as e:
        logging.error(f"Error during requirements search: {e}")
        # Return a structured error message for the calling function to handle
        return "An error occurred while processing your request.", []
