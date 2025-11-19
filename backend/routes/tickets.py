# backend/routes/tickets.py

from flask import Blueprint, jsonify
from backend.models.customer import Ticket
from flask import request
from backend.db import db
from backend.models.customer import Event

tickets_bp = Blueprint("tickets", __name__)


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


@tickets_bp.route("/", methods=["POST"])
def create_ticket():
    data = request.get_json()

    new_ticket = Ticket(
        event_id=data["event_id"],
        ticket_type=data["ticket_type"],
        price=data["price"],
        quantity_available=data["quantity_available"]
    )

    db.session.add(new_ticket)

    # auto-update total_tickets on event
    event = Event.query.get(data["event_id"])
    if event:
        event.total_tickets = (event.total_tickets or 0) + data["quantity_available"]

    db.session.commit()

    return jsonify({"message": "Ticket created"}), 201

