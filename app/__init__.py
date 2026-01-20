from flask import Flask, send_from_directory
from config import Config
import os

def create_app(config_class=Config):
    app = Flask(__name__, template_folder='shared/templates')
    app.config.from_object(config_class)

    # Register Blueprints
    from app.website.routes import website_bp
    from app.store.routes import store_bp

    # Register Blueprints with their respective template and static folders
    app.register_blueprint(website_bp)
    app.register_blueprint(store_bp, url_prefix='/store')

    # Handle shared static files (Truly global assets)
    @app.route('/shared/<path:filename>')
    def shared_static(filename):
        shared_dir = os.path.join(app.root_path, 'shared', 'static')
        return send_from_directory(shared_dir, filename)

    return app
