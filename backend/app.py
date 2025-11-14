from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from backend.config import Config
from sqlalchemy import text
from flask_jwt_extended import JWTManager
from backend.routes.auth import auth_bp
from backend.db import db



def create_app():
    app = Flask(__name__)
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.config.from_object(Config)
    CORS(app)
    jwt = JWTManager(app)
    db.init_app(app)

    @app.route("/health")
    def health():
        return jsonify({"status": "ok"})

    @app.route("/health/db")
    def health_db():
        try:
            db.session.execute(text("SELECT 1"))
            return jsonify({"db": "connected"})
        except Exception as e:
            return jsonify({"db_error": str(e)}), 500

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
