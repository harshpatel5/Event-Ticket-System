from flask import Blueprint, jsonify, request
from backend.models.customer import Event, Venue, Category, Ticket
from backend.db import db
from sqlalchemy import and_, or_
from datetime import datetime, timedelta

search_bp = Blueprint("search", __name__, url_prefix="/events")


@search_bp.route("/filter", methods=["GET"])
def filter_events():
    keyword = request.args.get("q", "").strip().lower()
    city = request.args.get("location", "")
    date_filter = request.args.get("date", "")

    # Base query
    query = db.session.query(Event, Venue, Category).join(Venue).join(Category)

    # Keyword search
    if keyword:
        query = query.filter(
            or_(
                Event.event_name.ilike(f"%{keyword}%"),
                Event.description.ilike(f"%{keyword}%")
            )
        )

    # Location filter
    if city:
        query = query.filter(Venue.city == city)

    # Date filter
    now = datetime.now()

    if date_filter == "today":
        start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end = start + timedelta(days=1)
        query = query.filter(Event.event_date.between(start, end))

    elif date_filter == "week":
        end = now + timedelta(days=7)
        query = query.filter(Event.event_date <= end)

    elif date_filter == "month":
        end = now + timedelta(days=30)
        query = query.filter(Event.event_date <= end)

    elif date_filter == "year":
        end = now + timedelta(days=365)
        query = query.filter(Event.event_date <= end)

    events = query.all()

    results = []
    for event, venue, category in events:

        # Get min ticket price
        min_price = db.session.query(db.func.min(Ticket.price)).filter(
            Ticket.event_id == event.event_id
        ).scalar()

        results.append({
            "event_id": event.event_id,
            "event_name": event.event_name,
            "event_date": event.event_date,
            "description": event.description,
            "status": event.status,
            "category": {
                "category_id": category.category_id,
                "category_name": category.category_name
            },
            "venue": {
                "venue_name": venue.venue_name,
                "city": venue.city,
                "address": venue.address
            },
            "min_price": float(min_price) if min_price else None,
        })

    return jsonify(results)
