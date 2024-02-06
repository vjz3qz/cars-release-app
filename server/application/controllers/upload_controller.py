from langchain_community.vectorstores import SupabaseVectorStore
from langchain_community.document_loaders import PyPDFLoader
import os
import requests
import tempfile

from application.services.database_service import vector_db
from application.services.nlp_service import embeddings
from application.services.blob_storage_service import upload_file_to_blob_storage
from application.utils.id_generator import generate_id
import logging
from mimetypes import guess_type


from typing import Any

from pydantic import BaseModel
from unstructured.partition.pdf import partition_pdf  # poppler and tessaract required


def process_file_upload(insurance_provider, file_object=None, file_url=""):
    try:
        if file_object:
            temp_file_path = upload_file_object(file_object)
            file_name = file_object.filename
        elif file_url:
            temp_file_path = upload_file_url(file_url)
            file_name = None
        else:
            logging.error("No file object or file URL provided")
            raise ValueError("No file object or file URL provided")

        file_id = generate_id()
        upload_file_to_blob_storage(temp_file_path, file_id, insurance_provider)
        process_uploaded_file(
            temp_file_path,
            file_id,
            insurance_provider,
            file_name=file_name,
            url=file_url,
        )
        os.remove(temp_file_path)
        return file_id
    except Exception as e:
        # Handle the exception here
        logging.error(f"An error occurred while processing file upload process: {e}")
        raise Exception(str(e))


def upload_file_url(file_url):
    try:
        # Download content from URL into a temporary file
        response = requests.get(file_url)
        response.raise_for_status()  # Ensure the request was successful

        # Check if the content type is PDF
        content_type = response.headers.get("Content-Type", "")
        if "application/pdf" not in content_type:
            # Fallback check by guessing the MIME type from the URL
            guessed_type, _ = guess_type(file_url)
            if guessed_type != "application/pdf":
                raise ValueError("The file from the URL is not a PDF")

        temp_file_path = save_file(response, is_response=True)
        return temp_file_path
    except Exception as e:
        # Handle the exception here
        logging.error(f"An error occurred while saving file from URL: {e}")
        raise Exception(str(e))


def upload_file_object(file_object):
    try:
        # Check if the uploaded file is a PDF
        file_name = file_object.filename
        guessed_type, _ = guess_type(file_name)
        if guessed_type != "application/pdf":
            raise ValueError("The uploaded file is not a PDF")

        # Save file to temporary file
        temp_file_path = save_file(file_object)
        return temp_file_path
    except Exception as e:
        # Handle the exception here
        logging.error(f"An error occurred while saving file object: {e}")
        raise Exception(str(e))


def save_file(file_object, is_response=False):
    with tempfile.NamedTemporaryFile(
        mode="wb", delete=False
    ) as temp_file:  # Note 'wb' mode for binary
        if is_response:
            temp_file.write(file_object.content)
        else:
            temp_file.write(file_object.read())  # Write binary content directly
        temp_file_path = temp_file.name
    return temp_file_path


def process_uploaded_file(
    file_path, file_id, insurance_provider, file_name=None, url=None
):
    try:  # TODO better chunking, parsing, extraction, processing, etc.
        # Extract elements from PDF
        raw_pdf_elements = extract_elements(file_path)
        # Count elements
        category_counts, unique_categories = count_elements(raw_pdf_elements)
        # Categorize elements
        table_elements, text_elements = categorize_elements(raw_pdf_elements)
        # Summarize elements
        text_summaries = summarize_elements(text_elements)
        table_summaries = summarize_elements(table_elements)
        # Store elements
        store_elements(
            text_elements,
            text_summaries,
            insurance_provider,
            file_id,
            file_name=file_name,
            url=url,
        )
        store_elements(
            table_elements,
            table_summaries,
            insurance_provider,
            file_id,
            is_table=True,
            file_name=file_name,
            url=url,
        )
    except Exception as e:
        # Handle the exception here
        logging.error(f"An error occurred while processing the uploaded file: {e}")
        raise Exception(str(e))


def extract_elements(file_path):
    # Get the directory path of the temporary file
    # directory_path = os.path.dirname(file_path)

    raw_pdf_elements = partition_pdf(
        filename=file_path,
        # Unstructured first finds embedded image blocks
        extract_images_in_pdf=False,
        # Use layout model (YOLOX) to get bounding boxes (for tables) and find titles
        # Titles are any sub-section of the document
        infer_table_structure=True,
        # Post processing to aggregate text once we have the title
        chunking_strategy="by_title",
        # Chunking params to aggregate text blocks
        # Attempt to create a new chunk 3800 chars
        # Attempt to keep chunks > 2000 chars
        max_characters=4000,
        new_after_n_chars=3800,
        combine_text_under_n_chars=2000,
        # image_output_dir_path=directory_path,
    )
    return raw_pdf_elements


def count_elements(raw_pdf_elements):
    # Create a dictionary to store counts of each type
    category_counts = {}

    for element in raw_pdf_elements:
        category = str(type(element))
        if category in category_counts:
            category_counts[category] += 1
        else:
            category_counts[category] = 1

    # Unique_categories will have unique elements
    unique_categories = set(category_counts.keys())
    return category_counts, unique_categories


def categorize_elements(raw_pdf_elements):
    # Categorize by type
    categorized_elements = []
    for element in raw_pdf_elements:
        if "unstructured.documents.elements.Table" in str(type(element)):
            categorized_elements.append(Element(type="table", text=str(element)))
        elif "unstructured.documents.elements.CompositeElement" in str(type(element)):
            categorized_elements.append(Element(type="text", text=str(element)))

    # Tables
    table_elements = [e for e in categorized_elements if e.type == "table"]

    # Text
    text_elements = [e for e in categorized_elements if e.type == "text"]

    return table_elements, text_elements


from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI


def summarize_elements(raw_elements):
    # Prompt
    prompt_text = """You are an assistant tasked with summarizing tables and text. \ 
    Give a concise summary of the table or text. Table or text chunk: {element} """
    prompt = ChatPromptTemplate.from_template(prompt_text)

    # Summary chain
    model = ChatOpenAI(temperature=0, model="gpt-4")
    summarize_chain = {"element": lambda x: x} | prompt | model | StrOutputParser()
    # Apply to tables
    elements = [i.text for i in raw_elements]
    element_summaries = summarize_chain.batch(elements, {"max_concurrency": 5})
    return element_summaries


from langchain.retrievers import MultiVectorRetriever
from langchain.storage import InMemoryStore
from langchain_core.documents import Document

import uuid


def store_elements(
    elements,
    summaries,
    insurance_provider,
    file_id,
    is_table=False,
    file_name=None,
    url=None,
):
    # The vectorstore to use to index the child chunks
    vectorstore = SupabaseVectorStore(
        client=vector_db,
        embedding=embeddings,
        table_name=insurance_provider,
        query_name=f"match_{insurance_provider}_documents",
    )

    # The storage layer for the parent documents
    store = InMemoryStore()
    id_key = "doc_id"

    # The retriever
    retriever = MultiVectorRetriever(
        vectorstore=vectorstore, docstore=store, id_key=id_key
    )

    # Add elements
    doc_ids = [str(uuid.uuid4()) for _ in elements]
    summary_elements = []
    for i, s in enumerate(summaries):
        metadata = {
            "id_key": doc_ids[i],
            "file_id": file_id,
            "insurance_provider": insurance_provider,
        }
        if is_table:
            metadata["element_type"] = "table"
        else:
            metadata["element_type"] = "text"
        if file_name:
            metadata["document_name"] = file_name
        if url:
            metadata["original_source_url"] = url
        summary_elements.append(Document(page_content=s, metadata=metadata))

    retriever.vectorstore.add_documents(summary_elements)
    retriever.docstore.mset(list(zip(doc_ids, elements)))


# TODO refactor to separate files: handle_file_upload.py, database_service.py, maybe new langchain service, etc.
# TODO refactor imports
