from flask import Blueprint, jsonify
from backend.db import db
from backend.models.customer import Category

categories_bp = Blueprint("categories", __name__, url_prefix="/categories")

@categories_bp.route("/", methods=["GET"])
def get_categories():
    categories = Category.query.all()
    result = []
    for cat in categories:
        result.append({
            "category_id": cat.category_id,
            "category_name": cat.category_name,
            "description": cat.description
        })
    return jsonify(result)
