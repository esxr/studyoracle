import datetime 
from . import db
 
# define a model UserSessionSession, with the following criteria:

# columns:
# id: integer, primary key, foreign key to users.id
# session_data: PickleType

# methods:
# to_dict: returns a dictionary representation of the model
# (override) __repr__: returns a string representation of the model

class UserSession(db.Model): 
    __tablename__ = 'user_session' 

    # foreign key to users.id
    user = db.Column(db.String(80), db.ForeignKey('users.id'), primary_key=True) 
    # This is the serialized session object
    session_data = db.Column(db.PickleType) 

    # This is a helper method to convert the model to a dictionary 
    # convert the date to a string YYYY-MM-DD
    def to_dict(self): 
        return { 
            'id': self.id, 
            'session_data': self.session_data, 
        }

    def __repr__(self): 
        return f'<UserSession {self.id} {self.session_data} >'