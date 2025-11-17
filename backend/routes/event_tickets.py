from flask import Blueprint, jsonify
from backend.models.customer import Ticket

event_tickets_bp = Blueprint("event_tickets", __name__)

@event_tickets_bp.route("/event-tickets/<int:event_id>", methods=["GET"])
def get_tickets_by_event(event_id):
    tickets = Ticket.query.filter_by(event_id=event_id).all()

    return jsonify([
        {
            "ticket_id": t.ticket_id,
            "ticket_type": t.ticket_type,
            "price": float(t.price),
            "quantity_available": t.quantity_available
        }
        for t in tickets
    ])
