from flask import Blueprint, jsonify, request 
from enum import Enum
from server.tasks.studyoracle import add_doc, handle_message
from server.utils import convert_pdf_to_documents, init_vector_store, retrieve_info

from server.tasks import studyoracle
from server.tasks.studyoracle import celery

# Enum to represent task TaskState
class TaskState(Enum):
    PENDING = 1
    STARTED = 2
    SUCCESS = 3
    FAILURE = 4
    UNKNOWN = 5

api = Blueprint('api', __name__)

@api.route('/health', methods=['GET', 'POST'])
def get_health():
    return "ok", 200

# feed documents into the database
@api.route('/doc', methods=['POST'])
def get_documents():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        file_content = file.read()

        # Call the Celery task to handle the file upload asynchronously
        task = studyoracle.add_doc.apply_async(args=[file_content])
        print ("task id: ", task.id)

        return jsonify({'task_id': task.id}), 202  # Accepted

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # return "ok", 200

# ask a question to the database
@api.route('/ask', methods=['POST'])
def search():
    try:
        if 'query' not in request.json:
            return jsonify({'error': 'No query found'}), 400

        query = request.json['query']

        # Call the Celery task to handle the query asynchronously
        task = studyoracle.handle_message.apply_async(args=[query])

        return jsonify({'task_id': task.id}), 202  # Accepted

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
    task = celery.AsyncResult(task_id)
    if task.state == TaskState.PENDING:
        response = {
            'status': TaskState.PENDING.name,
            'message': 'Task is waiting for execution.'
        }
    elif task.state == TaskState.STARTED:
        response = {
            'status': TaskState.STARTED.name,
            'message': 'Task is currently being executed.'
        }
    elif task.state == TaskState.SUCCESS:
        response = {
            'status': TaskState.SUCCESS.name,
            'message': 'Task has been completed successfully.',
            'result': task.get()  # Get the task result
        }
    elif task.state == TaskState.FAILURE:
        response = {
            'status': TaskState.FAILURE.name,
            'message': 'Task has encountered an error.',
            'error': str(task.info)  # Get the task error message
        }
    else:
        response = {
            'status': TaskState.UNKNOWN.name,
            'message': 'Task status is unknown.'
        }

    return jsonify(response), 200

