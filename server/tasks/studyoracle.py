import os
import time
import datetime
from celery import Celery
from langchain.text_splitter import TextSplitter, RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from langchain import OpenAI, VectorDBQA
import io

from server.utils import convert_pdf_to_documents, init_vector_store, retrieve_info

celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND")
celery.conf.task_default_queue = os.environ.get("CELERY_DEFAULT_QUEUE", "studyoracle")

# Global variable to store the vector store
vectorstore = None

@celery.task(name="doc")
def add_doc(file_content):
    try:
        file_stream = io.BytesIO(file_content)
        documents = convert_pdf_to_documents(file_stream)

        global vectorstore
        vectorstore = init_vector_store(documents)

        return "File uploaded successfully"
    except Exception as e:
        # print the error
        print("Error uploading file: ", e)
        
    
@celery.task(name="ask")
def handle_message(query):
    if vectorstore is None:
        return "No documents have been uploaded yet", 400

    # get the answer
    answer = retrieve_info(query, vectorstore)
    return answer