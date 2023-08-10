from flask import Blueprint, jsonify, request 
from enum import Enum

from server.tasks import studyoracle
from server.tasks.studyoracle import celery
from server.models import db
from server.models.user import User
from server.utils import encode_file
from celery.result import AsyncResult

from server.models.user_session import UserSession
from server.new_core import PDFQA

import base64

# Enum to represent task TaskState
class TaskState(Enum):
    PENDING = 1
    STARTED = 2
    SUCCESS = 3
    FAILURE = 4
    UNKNOWN = 5

api = Blueprint('api', __name__, url_prefix='/api/v1/')

@api.route('/health', methods=['GET', 'POST'])
def get_health():
    return "ok", 200

# upload a file into the database
# Give a URL
@api.route('/upload_file', methods=['POST'])
def upload_document():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']        

        # encode the file into base64
        filename = file.filename
        file = encode_file(file)

        # Call the Celery task to handle the file upload asynchronously
        task = studyoracle.add_doc.apply_async(args=[filename, file])
        return jsonify({'task_id': task.id}), 202  # Accepted

    except Exception as e:
        return jsonify({'API route error': str(e)}), 500

# Add a document to the user's session
# Given a URL
@api.route('/add_doc', methods=['POST'])
def add_document():
    if 'url' not in request.json:
        return jsonify({'error': 'No file URL found'}), 400
    if 'user' not in request.json:
        return jsonify({'error': 'No user found'}), 400

    url = request.json['url']
    user = request.json['user']
    print(url)
    
    # if user is not found, throw error
    if user is None:
        raise Exception("User not found")

    # if no user session exists, create a new one
    if UserSession.query.get(user) is None:
        user = User.query.get(user)

        # If the user does not exist, throw error
        if user is None:
            raise Exception("User not found")
        
        user_session = UserSession(user=user.id, session_data=PDFQA())
    else:
        # retrieve user's session object from SQLAlchemy
        user_session = UserSession.query.get(user)
    
    # get the session_data object from the session object
    session_data = user_session.session_data
    # add the PDF to the session data
    session_data.add_pdf(url)
    # update the session object
    user_session.session_data = session_data

    db.session.add(user_session)
    db.session.commit()

    return jsonify({'user_session': 'Document added!'}), 201

# ask a question to the database
@api.route('/message', methods=['POST'])
def message():
    try:
        if 'query' not in request.json:
            return jsonify({'error': 'No query found'}), 400
        
        if 'user' not in request.json:
            return jsonify({'error': 'No user found'}), 400

        query = request.json['query']
        user = request.json['user']

        # Call the Celery task to handle the query asynchronously
        task = studyoracle.handle_message.apply_async(args=[user, query])

        return jsonify({'task_id': task.id}), 202  # Accepted

    except Exception as e:
        return jsonify({'error': str(e)}), 500

## Write all CRUD operations for user
# Create a new user
@api.route('/user', methods=['POST'])
def create_user():
    try:
        if 'name' not in request.json:
            return jsonify({'error': 'No name found'}), 400

        name = request.json['name']
        id = request.json.get('id', None)

        # Create a new user object
        user = User(id=id, name=name)
        db.session.add(user)
        db.session.commit()

        return jsonify({'user_id': user.id}), 201  # Created

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Read a user
@api.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = User.query.get(user_id)
        if user is None:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'user': user.to_dict()}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Update a user
@api.route('/user/<user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        if 'id' not in request.json:
            return jsonify({'error': 'No id found'}), 400

        id = request.json['id']
        name = request.json.get('name', None)

        user = User.query.get(user_id)
        if user is None:
            return jsonify({'error': 'User not found'}), 404

        user.name = name
        db.session.commit()

        return jsonify({'user': user.to_dict()}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Delete a user
@api.route('/user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if user is None:
            return jsonify({'error': 'User not found'}), 404

        db.session.delete(user)
        db.session.commit()

        return jsonify({'user': user.to_dict()}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to handle misc Celery tasks
@api.route('/task/<task_name>', methods=['POST'])
def handle_task(task_name):
    try:
        # Check if the task exists in Celery
        task_func = getattr(celery.tasks, task_name, None)
        if not task_func or not callable(task_func):
            return jsonify({'error': f'Task "{task_name}" not found.'}), 404

        # Get the request data (if any) to pass as arguments to the Celery task
        request_data = request.get_json() if request.is_json else {}
        task_args = request_data.get('args', [])
        task_kwargs = request_data.get('kwargs', {})

        # Call the Celery task to execute asynchronously
        task = task_func.apply_async(args=task_args, kwargs=task_kwargs)

        return jsonify({'task_id': task.id}), 202  # Accepted

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to check the status of any Celery task
@api.route('/task/<task_id>', methods=['GET'])
def get_task_status(task_id):
    task_result = AsyncResult(task_id)
    
    response = {
        'status': TaskState.UNKNOWN.name,
        'message': 'Task status is unknown.',
        'status': 404
    }

    if task_result.ready() and task_result.successful():
        response = {
            'status': TaskState.SUCCESS.name,
            'message': 'Task was executed successfully!',
            'status': 200
        }

    
    elif task_result.failed():
        response = {
            'status': TaskState.FAILURE.name,
            'message': 'Task has encountered an error.',
            'error': 'Task failed!',
            'status': 500
        }

    return jsonify(response), response['status']

# Route to get the result of any Celery task
@api.route('/task/<task_id>/result', methods=['GET'])
def get_task_result(task_id):

    try:
        result = AsyncResult(task_id)
        if not result.ready():
            return jsonify({'error': 'Task result not ready yet.'}), 404
        
        return jsonify({'result': result.get()}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
