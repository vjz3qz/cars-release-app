from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from supabase.client import Client, create_client
from langchain_community.document_loaders import PyPDFLoader
import os
import requests
import tempfile

# Environment setup
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    print("error openai key")
    exit(1)


def init_db():
    """
    Connect to Supabase project
    """
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_KEY")
    supabase: Client = create_client(supabase_url, supabase_key)
    return supabase


supabase = init_db()


def add_documents(url):
    # Download content from URL into a temporary file
    response = requests.get(url)
    response.raise_for_status()  # Ensure the request was successful

    with tempfile.NamedTemporaryFile(
        mode="wb", delete=False
    ) as temp_file:  # Note 'wb' mode for binary
        temp_file.write(response.content)  # Write binary content directly
        temp_file_path = temp_file.name
    loader = PyPDFLoader(temp_file_path)
    docs = loader.load_and_split()
    for doc in docs:
        doc.metadata = {"source": url}

    vector_store = SupabaseVectorStore.from_documents(
        docs,
        OpenAIEmbeddings(),
        client=supabase,
        table_name="documents",
        query_name="match_documents",
        chunk_size=500,
    )


# url = "https://trace-ai-demo.s3.amazonaws.com/cardiac_mri.pdf"
new_url = "https://www.uhcprovider.com/content/dam/provider/docs/public/policies/protocols/Medical-Record-Requirements-for-Pre-Service.pdf"
add_documents(new_url)

# add_documents()
# query = "What are the prior authorization requirements for cardiac mri?"

# {
#     "query": "My patient has congestive heart failure. What documentation, test, and patient data do I need to send in a prior authorization request to UnitedHealthCare to prove medical necessity for a cardiac mri? what are the indications? Please give me a specific list",
#     "insurance": "test",
#     "procedure_type": "test"
# }

# My patient has congestive heart failure. What documentation, test, and patient data do I need to send in a prior authorization request to UnitedHealthCare to prove medical necessity for a Cardiac magnetic resonance imaging for morphology and function without contrast 75557? what are the indications? Please give me a specific list

# Based on all of the above, what documentation, tests, and patient data do I need to send in a prior authorization request to the specified insurance to prove medical necessity for the specified procedure? what are the indications? Please give me a specific list


# My patient has congestive heart failure.
# UnitedHealthCare
# Cardiac magnetic resonance imaging for morphology and function without contrast
# 75557
