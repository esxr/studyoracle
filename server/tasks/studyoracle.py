import os
from celery import Celery
from langchain.text_splitter import TextSplitter, RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from langchain import OpenAI, VectorDBQA
from server.utils import upload_file_to_aws_bucket, decode_file

from server.models import db
from server.models.user import User
from server.models.user_session import UserSession
from server.new_core import PDFQA

celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND")
celery.conf.task_default_queue = os.environ.get("CELERY_DEFAULT_QUEUE", "studyoracle")

@celery.task(name="doc")
def add_doc(filename, file):
    try:
        # decode the file from base64
        file = decode_file(filename, file)
        # upload the file to the AWS bucket
        file_url = upload_file_to_aws_bucket(filename, file)
        return file_url
    except Exception as e:
        print("Error uploading file: ", e)
        return False
        
    
@celery.task(name="ask")
def handle_message(user, query):
    if user is None:
        raise Exception("User not found")
    
    # retrieve user's session object from SQLAlchemy
    user_session = UserSession.query.get(user)
    # get the session_dta object from the session object
    session_data = user_session.session_data
    # run the query
    answer = session_data.query(query)
    return answer