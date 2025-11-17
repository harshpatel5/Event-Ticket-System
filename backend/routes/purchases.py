from flask import Blueprint, jsonify
from backend.db import db
from backend.models.customer import Purchase, PurchaseTicket

purchases_bp = Blueprint("purchases", __name__, url_prefix="/purchases")

@purchases_bp.route("/", methods=["GET"])
def get_purchases():
    purchases = Purchase.query.all()
    result = []
    for p in purchases:
        result.append({
            "purchase_id": p.purchase_id,
            "customer_id": p.customer_id,
            "purchase_date": p.purchase_date,
            "total_amount": float(p.total_amount),
            "payment_method": p.payment_method,
            "payment_status": p.payment_status
        })
    return jsonify(result)
