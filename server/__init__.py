import os
from flask import Flask, send_from_directory

def create_app():
    app = Flask(__name__)

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_static(path):
        if path != '' and path[-1] != '/':
            return send_from_directory('frontend/build', path)
        else:
            return send_from_directory('frontend/build', 'index.html')

    from server.routes import api 
    app.register_blueprint(api) 

    return app