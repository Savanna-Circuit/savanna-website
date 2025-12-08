import os

from flask import Flask
from flask_cors import CORS


def create_app() -> Flask:
    """
    Application factory to keep the entrypoint minimal.
    Registers blueprints and ensures the instance folder exists.
    """
    app = Flask(
        __name__,
        instance_relative_config=True,
        template_folder="templates",
        static_folder="static",
    )
    app.config.from_object("config")

    # Ensure the instance folder exists for the SQLite database.
    os.makedirs(app.instance_path, exist_ok=True)

    CORS(app)

    # Blueprint registration
    from blueprints.pages import pages_bp
    from blueprints.store import store_bp, init_db

    app.register_blueprint(pages_bp)
    app.register_blueprint(store_bp, url_prefix="/api")

    # Initialize database and seed products on startup.
    with app.app_context():
        init_db()

    return app


app = create_app()


if __name__ == "__main__":
    debug_mode = os.environ.get("FLASK_DEBUG", "1") == "1"
    app.run(debug=debug_mode, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))

