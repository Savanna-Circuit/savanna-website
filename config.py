import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Security
SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key")
SESSION_COOKIE_NAME = "savanna_session"

# Database
DATABASE = os.path.join(BASE_DIR, "instance", "app.db")

# CORS / client
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*")

# Debug toggle
DEBUG = os.environ.get("FLASK_DEBUG", "1") == "1"

