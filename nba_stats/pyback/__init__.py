from flask import Flask
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config
from flask_login import LoginManager

db = SQLAlchemy()
migrate = Migrate()
login = LoginManager()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    migrate.init_app(app,db)
    login.init_app(app)
    jwt.init_app(app)
    CORS(app)

    return app
