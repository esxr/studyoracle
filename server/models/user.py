import datetime 
from . import db 
 
# define a model User, with the following criteria:

# columns:
# id: integer, primary key
# name: string, mandatory, max length 80

# methods:
# to_dict: returns a dictionary representation of the model
# (override) __repr__: returns a string representation of the model

class User(db.Model): 
   __tablename__ = 'users' 
 
   # This is how we define a column, this is also the primary key 
   id = db.Column(db.String(80), primary_key=True) 
   # This is a manadatory column of 80 characters 
   name = db.Column(db.String(80), nullable=False) 

   # This is a helper method to convert the model to a dictionary 
   # convert the date to a string YYYY-MM-DD
   def to_dict(self): 
      return { 
         'id': self.id, 
         'name': self.name, 
      }

   def __repr__(self): 
      return f'<User {self.id} {self.name} >'