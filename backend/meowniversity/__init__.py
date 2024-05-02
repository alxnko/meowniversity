from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_migrate import Migrate
from meowniversity.config import Config

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
login_manager = LoginManager()
login_manager.login_view = 'users.login'
login_manager.login_message_category = 'info'


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)

    from meowniversity.users.routes import users
    from meowniversity.classes.routes import classes
    from meowniversity.grades.routes import grades

    app.register_blueprint(users)
    app.register_blueprint(classes)
    app.register_blueprint(grades)

    with app.app_context():
        db.create_all()

    @app.errorhandler(404)
    def not_found(e):
        return app.send_static_file('index.html')

    return app
