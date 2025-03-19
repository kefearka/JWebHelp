from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
import os

db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    
    # Конфигурация
    app.config.from_mapping(
        SECRET_KEY='dev-key-123',
        SQLALCHEMY_DATABASE_URI='sqlite:///' + os.path.join(app.instance_path, 'service.db'),
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )
    
    # Инициализация расширений
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
    
    # Регистрация маршрутов
    from .routes.auth import auth_bp
    from .routes.tasks import tasks_bp
    from .routes.points import points_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(points_bp)
    
    # Создание папки instance
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
        
    return app