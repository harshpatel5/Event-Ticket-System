from flask import Blueprint, jsonify
from backend.models.customer import Venue

venues_bp = Blueprint("venues", __name__, url_prefix="/venues")

@venues_bp.route("/", methods=["GET"])
def get_venues():
    venues = Venue.query.all()
    return jsonify([
        {
            "venue_id": v.venue_id,
            "venue_name": v.venue_name,
            "address": v.address,
            "city": v.city,
            "capacity": v.capacity,
            "phone": v.phone
        }
        for v in venues
    ])
