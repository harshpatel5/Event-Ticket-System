# backend/routes/events.py
from flask import Blueprint, request, jsonify
from backend.models.customer import Event
from backend.models.customer import Ticket
from backend.models.customer import Venue
from backend.models.customer import Category

events_bp = Blueprint("events", __name__)

# ------------------------------------------------------------
# GET ALL EVENTS
# ------------------------------------------------------------
@events_bp.route("/", methods=["GET"])
def get_events():
    events = Event.query.all()

    output = []
    for e in events:
        output.append({
            "event_id": e.event_id,
            "event_name": e.event_name,
            "event_date": str(e.event_date),
            "description": e.description,
            "organizer_name": e.organizer_name,
            "organizer_email": e.organizer_email,
            "category_id": e.category_id,
            "venue_id": e.venue_id,
            "total_tickets": e.total_tickets,
            "tickets_sold": e.tickets_sold,
            "status": e.status
        })
    return jsonify(output)


# ------------------------------------------------------------
# SEARCH ENDPOINT  /api/events/search
# ------------------------------------------------------------
@events_bp.route("/search", methods=["GET"])
def search_events():
    q = request.args.get("q", "")

    results = Event.query.filter(Event.event_name.like(f"%{q}%")).all()

    return jsonify([
        {
            "event_id": e.event_id,
            "event_name": e.event_name,
            "event_date": str(e.event_date),
        }
        for e in results
    ])


# ------------------------------------------------------------
# *** MAIN FILTER ENDPOINT ***
# /api/events/filter?q=&location=&date=
# ------------------------------------------------------------
@events_bp.route("/filter", methods=["GET"])
def filter_events():
    q = request.args.get("q", "")
    location = request.args.get("location", "")
    date_range = request.args.get("date", "")

    query = Event.query

    # TEXT SEARCH
    if q:
        query = query.filter(Event.event_name.like(f"%{q}%"))

    # LOCATION FILTER
    if location:
        query = query.join(Venue).filter(Venue.city == location)

    # DATE RANGE FILTER
    from datetime import datetime, timedelta

    now = datetime.now()

    if date_range == "today":
        query = query.filter(
            Event.event_date >= now.replace(hour=0, minute=0),
            Event.event_date <= now.replace(hour=23, minute=59)
        )

    elif date_range == "week":
        future = now + timedelta(days=7)
        query = query.filter(Event.event_date <= future)

    elif date_range == "month":
        future = now + timedelta(days=30)
        query = query.filter(Event.event_date <= future)

    elif date_range == "year":
        future = now + timedelta(days=365)
        query = query.filter(Event.event_date <= future)

    events = query.all()

    # Attach category, venue, tickets
    output = []
    for e in events:
        venue = e.venue
        category = e.category
        tickets = Ticket.query.filter_by(event_id=e.event_id).all()

        output.append({
            "event_id": e.event_id,
            "event_name": e.event_name,
            "event_date": str(e.event_date),
            "venue": {
                "venue_name": venue.venue_name,
                "city": venue.city
            } if venue else None,
            "category": {
                "category_name": category.category_name
            } if category else None,
            "tickets": [
                {
                    "ticket_id": t.ticket_id,
                    "ticket_type": t.ticket_type,
                    "price": float(t.price),
                    "quantity_available": t.quantity_available
                }
                for t in tickets
            ]
        })

    return jsonify(output)
