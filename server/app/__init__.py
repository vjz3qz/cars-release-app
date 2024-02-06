from flask import Flask
from flask_cors import CORS
from app.api.v1 import v1 as v1_blueprint
import logging
from app.services.database_service import init_db
from dotenv import load_dotenv


def create_app():
    app = Flask(
    __name__,
    static_url_path="",
    static_folder="../../client/build",
    template_folder="../../client/build",
    )
    CORS(app)  # if you're using Flask-CORS

    load_dotenv()

    # Configuration, blueprints registration, etc.
    logging.basicConfig(level=logging.DEBUG)
    # logging.basicConfig(level=logging.INFO)
    # Registering the v1 blueprint
    app.register_blueprint(v1_blueprint, url_prefix="/api/v1")

    return app
