# backend/routes/tickets.py

from flask import Blueprint, jsonify
from backend.models.customer import Ticket

tickets_bp = Blueprint("tickets", __name__, url_prefix="/tickets")


@tickets_bp.route("/", methods=["GET"])
def get_tickets():
    tickets = Ticket.query.all()

    result = []
    for t in tickets:
        result.append({
            "ticket_id": t.ticket_id,
            "event_id": t.event_id,
            "ticket_type": t.ticket_type,
            "price": float(t.price),
            "quantity_available": t.quantity_available,
        })

    return jsonify(result)
