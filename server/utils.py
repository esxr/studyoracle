from flask import Flask, request, jsonify
import boto3
import botocore
from botocore.exceptions import NoCredentialsError
import os
import io
import base64
from werkzeug.datastructures import FileStorage

# AWS credentials are automatically read from /root/.aws/credentials
s3_client = boto3.client('s3')
AWS_BUCKET_NAME = "studyoracle" # TODO: Remove hardcode

# INPUT: file object
# OUTPUT: URL of the uploaded file
def upload_file_to_aws_bucket(filename, file):
    if file:
        try:
            s3_client.upload_fileobj(file, AWS_BUCKET_NAME, filename)
            # Get the URL of the uploaded file
            file_url = f"https://{AWS_BUCKET_NAME}.s3.amazonaws.com/{filename}"
            return file_url
        except NoCredentialsError:
            print("Credentials not available")
            return False
        except botocore.exceptions.ClientError as e:
            print('error', f'An error occurred: {e}')
            return False
    else:
        print ("No file provided")
        return False

# INPUT: FileStorage object
# OUTPUT: base64encoded file
def encode_file(file):
    if isinstance(file, FileStorage):
        # Read the binary content of the FileStorage object
        binary_content = file.read()
        
        # Encode the binary content to base64
        encoded_data = base64.b64encode(binary_content)
    else:
        raise ValueError("Unsupported data type. Only FileStorage objects are supported.")
    
    return encoded_data.decode('utf-8')

# INPUT: base64encoded file, filename
# OUTPUT: FileStorage object
def decode_file(filename, encoded_data):
    decoded_data = base64.b64decode(encoded_data.encode('utf-8'))
    
    # Create a new FileStorage object with the decoded binary data
    decoded_file_storage = FileStorage(io.BytesIO(decoded_data), filename)
    
    return decoded_file_storage