# backend/app.py
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from backend.db import init_db

# existing blueprints
from backend.routes.events import events_bp
from backend.routes.categories import categories_bp
from backend.routes.venues import venues_bp
from backend.routes.customers import customers_bp
from backend.routes.tickets import tickets_bp
from backend.routes.purchases import purchases_bp
from backend.routes.event_details import event_details_bp
from backend.routes.event_tickets import event_tickets_bp

# NEW: auth blueprint
from backend.routes.auth import auth_bp


def create_app():
    app = Flask(__name__)

    # CORS
    CORS(app)

    # DB
    init_db(app)

    # JWT config (you can move secret to env var later)
    app.config["JWT_SECRET_KEY"] = "super-secret-change-me"
    JWTManager(app)

    # ---- API blueprints ----
    # Auth-related (all start with /api/auth/...)
    app.register_blueprint(auth_bp, url_prefix="/api")

    # Public event details (for frontend cards)
    app.register_blueprint(event_details_bp, url_prefix="/api/events")
    app.register_blueprint(event_tickets_bp, url_prefix="/api")

    # Public REST API
    app.register_blueprint(events_bp, url_prefix="/api/events")
    app.register_blueprint(categories_bp, url_prefix="/api/categories")
    app.register_blueprint(venues_bp, url_prefix="/api/venues")
    app.register_blueprint(customers_bp, url_prefix="/api/customers")
    app.register_blueprint(tickets_bp, url_prefix="/api/tickets")
    app.register_blueprint(purchases_bp, url_prefix="/api/purchases")

    @app.route("/")
    def home():
        return "API is running"

    return app
