import os

import time
import datetime
from celery import Celery

celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND")
celery.conf.task_default_queue = os.environ.get("CELERY_DEFAULT_QUEUE", "studyoracle")

import os
import json
import subprocess
import tempfile

@celery.task(name="doc")
def create_ticket(ticket_data):
    # Given the json
    sample_input_data = {
        "id": "5e976680-8b7a-4db6-a3b9-cd5c8161f305",
        "name": "Evan Hughes",
        "email": "example@uq.edu.au",
        "concert": {
            "id": "12345678-1234-1234-1234-123456789012",
            "name": "Phantom of the Opera",
            "date": "2023-06-07",
            "venue": "Sydney Opera House"
        }
    }

    # Convert the json to a string
    input_json = json.dumps(ticket_data)
    try:
        # Create a temporary file to store the input JSON
        with tempfile.NamedTemporaryFile(mode='w', delete=False) as temp_file:
            temp_file.write(input_json)
            temp_file_path = temp_file.name

        # Construct the command with the temporary file path as an argument
        command = [
            "./hamilton",
            "generate",
            "ticket",
            "--input",
            temp_file_path,
            "--output",
            "output"
        ]

        # Run the command
        proc = subprocess.run(command, check=True, capture_output=True, text=True)
        with open("output.svg", "r") as svg_file:
            svg_contents = svg_file.read()

        # Return the SVG contents
        return svg_contents

    except subprocess.CalledProcessError as e:
        print("Error executing the command:", e)

    finally:
        # Clean up the temporary file
        if temp_file_path:
            os.remove(temp_file_path)

@celery.task(name="ask")
def generate_seating(seating_plan_data):
    sample_data = {
        "id": "12345678-1234-1234-1234-123456789012",
        "name": "Phantom of the Opera",
        "date": "2023-06-07",
        "venue": "Sydney Opera House",
        "seats": {
            "max": 5738,
            "purchased": 2340
        }
    }

    # Convert the json to a string
    input_json = json.dumps(seating_plan_data)
    try:
        # Create a temporary file to store the input JSON
        with tempfile.NamedTemporaryFile(mode='w', delete=False) as temp_file:
            temp_file.write(input_json)
            temp_file_path = temp_file.name

        # Construct the command with the temporary file path as an argument
        command = [
            "./hamilton",
            "generate",
            "seating",
            "--input",
            temp_file_path,
            "--output",
            "output"
        ]

        # Run the command
        proc = subprocess.run(command, check=True, capture_output=True, text=True)
        with open("output.svg", "r") as svg_file:
            svg_contents = svg_file.read()

        # Return the SVG contents
        return svg_contents

    except subprocess.CalledProcessError as e:
        print("Error executing the command:", e)

    finally:
        # Clean up the temporary file
        if temp_file_path:
            os.remove(temp_file_path)

