from flask import Blueprint, jsonify, request 
from server.utils import convert_pdf_to_documents, init_vector_store, retrieve_info

api = Blueprint('api', __name__)

# Global variable to store the vector store
vectorstore = None

# feed documents into the database
@api.route('/doc', methods=['POST'])
def get_documents():
    # get the pdf file from the request
    pdf_file = request.files['file']
    # convert the pdf to a list of langchain.Document objects
    documents = convert_pdf_to_documents(pdf_file)

    global vectorstore
    vectorstore = init_vector_store(documents)

    return "ok", 200

# ask a question to the database
@api.route('/ask', methods=['POST'])
def search():
    if vectorstore is None:
        return "No documents have been uploaded yet", 400

    # get query from request json
    query = request.json['query']

    # get the answer
    answer = retrieve_info(query, vectorstore)
    return answer, 200


@api.route('/health', methods=['GET', 'POST'])
def get_health():
    return "ok", 200