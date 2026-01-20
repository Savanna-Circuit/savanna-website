import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    DATA_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'app', 'data')
