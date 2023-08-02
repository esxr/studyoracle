import os
from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy 

def create_app(config_overrides=None):
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///db.sqlite")
    if config_overrides: 
       app.config.update(config_overrides)

    from server.models import db 
    from server.models.user import User
    db.init_app(app) 
        
    # Create the database tables 
    with app.app_context(): 
      db.create_all() 
      db.session.commit()

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_static(path):
        if path != '' and path[-1] != '/':
            return send_from_directory('frontend/dist', path)
        else:
            return send_from_directory('frontend/dist', 'index.html')

    from server.routes import api 
    app.register_blueprint(api) 

    return app