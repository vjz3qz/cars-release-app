import os
import logging
from langchain_openai import OpenAIEmbeddings
from langchain_openai import ChatOpenAI

# Environment setup
try:
    openai_api_key = os.environ["OPENAI_API_KEY"]
except KeyError:
    logging.error("`OPENAI_API_KEY` environment variable required")
    raise EnvironmentError("[error]: `OPENAI_API_KEY` environment variable required")

try:
    bland_api_key = os.environ["BLAND_API_KEY"]
except KeyError:
    logging.error("`BLAND_API_KEY` environment variable required")
    raise EnvironmentError("[error]: `BLAND_API_KEY` environment variable required")


def init_embeddings():
    """
    Initialize embeddings
    """
    logging.info("Initializing embeddings")
    return OpenAIEmbeddings()


def init_chat_model():
    """
    Initialize chat model
    """
    logging.info("Initializing chat model")
    return ChatOpenAI(model_name="gpt-4-1106-preview", temperature=0)


embeddings = init_embeddings()
chat_model = init_chat_model()
