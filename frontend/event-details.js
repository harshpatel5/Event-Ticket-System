// ============================================================
// EVENT DETAILS PAGE - FULL DB INTEGRATION
// ============================================================

// Get event ID from URL
function getEventId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Local cache for this page
let EVENT_DETAILS_CACHE = null;

// Join data similarly
function joinEventDataDetails(events, categories, venues, tickets) {
  const categoryById = {};
  const venueById = {};
  const ticketsByEventId = {};

  (categories || []).forEach((c) => {
    categoryById[c.category_id] = c;
  });

  (venues || []).forEach((v) => {
    venueById[v.venue_id] = v;
  });

  (tickets || []).forEach((t) => {
    if (!ticketsByEventId[t.event_id]) {
      ticketsByEventId[t.event_id] = [];
    }
    ticketsByEventId[t.event_id].push(t);
  });

  return (events || []).map((e) => ({
    ...e,
    category: categoryById[e.category_id] || null,
    venue: venueById[e.venue_id] || null,
    tickets: ticketsByEventId[e.event_id] || []
  }));
}

// Load event details from API
async function loadEventDetails() {
  const eventId = parseInt(getEventId(), 10);

  if (!eventId) {
    alert("Event not found!");
    window.location.href = "index.html";
    return;
  }

  try {
    // Fetch all relevant data (for a small project, this is fine)
    const [events, categories, venues, tickets] = await Promise.all([
      fetchAllEventsRaw(),
      fetchAllCategoriesRaw(),
      fetchAllVenuesRaw(),
      fetchAllTicketsRaw()
    ]);

    const joined = joinEventDataDetails(events, categories, venues, tickets);

    const event = joined.find((e) => e.event_id === eventId);

    if (!event) {
      alert("Event not found!");
      window.location.href = "index.html";
      return;
    }

    EVENT_DETAILS_CACHE = event;

    displayEventDetails(event);
    loadTicketOptions(event.tickets);
  } catch (error) {
    console.error("Error loading event:", error);
    alert("Failed to load event details.");
    window.location.href = "index.html";
  }
}

// Display event information
function displayEventDetails(event) {
  document.title = `${event.event_name} - TixMaster`;

  const imgEl = document.getElementById("eventImage");
  if (imgEl) {
    imgEl.src =
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop";
    imgEl.alt = event.event_name;
  }

  const categoryEl = document.getElementById("eventCategory");
  if (categoryEl) {
    categoryEl.textContent = event.category?.category_name || "Event";
  }

  const nameEl = document.getElementById("eventName");
  if (nameEl) {
    nameEl.textContent = event.event_name;
  }

  const descEl = document.getElementById("eventDescription");
  if (descEl) {
    descEl.textContent = event.description || "";
  }

  const dateTimeEl = document.getElementById("eventDateTime");
  if (dateTimeEl) {
    const eventDate = new Date(event.event_date);
    if (!isNaN(eventDate.getTime())) {
      const dateOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      };
      const timeOptions = {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      };
      const formattedDate = eventDate.toLocaleDateString(
        "en-US",
        dateOptions
      );
      const formattedTime = eventDate.toLocaleTimeString(
        "en-US",
        timeOptions
      );
      dateTimeEl.textContent = `${formattedDate} at ${formattedTime}`;
    } else {
      dateTimeEl.textContent = event.event_date || "";
    }
  }

  const venueEl = document.getElementById("eventVenue");
  if (venueEl) {
    if (event.venue) {
      venueEl.textContent = `${event.venue.venue_name}\n${event.venue.address || ""
        }`;
    } else {
      venueEl.textContent = "Venue details coming soon.";
    }
  }

  const organizerEl = document.getElementById("eventOrganizer");
  if (organizerEl) {
    organizerEl.textContent = event.organizer_name || "Organizer";
  }
}

// Load available ticket options
function loadTicketOptions(tickets) {
  const ticketOptionsContainer = document.getElementById("ticketOptions");

  if (!ticketOptionsContainer) return;

  if (!tickets || tickets.length === 0) {
    ticketOptionsContainer.innerHTML =
      '<p style="color: var(--text-secondary);">No tickets available at this time.</p>';
    return;
  }

  ticketOptionsContainer.innerHTML = tickets
    .map((ticket) => {
      const price = parseFloat(ticket.price);
      return `
      <div class="ticket-option">
        <div class="ticket-info">
          <h4>${ticket.ticket_type}</h4>
          <p>${ticket.quantity_available} tickets available</p>
        </div>
        <div class="ticket-price">
          <div class="price">$${price.toFixed(2)}</div>
          <button class="btn-primary" onclick="purchaseTicket(${ticket.ticket_id}, '${ticket.ticket_type}', ${price})" style="margin-top: 8px;">
            Select
          </button>
        </div>
      </div>
    `;
    })
    .join("");
}

// Purchase ticket (still just a stub popup)
function purchaseTicket(ticketId, ticketType, price) {
  const confirmed = confirm(
    `Purchase Ticket?\n\n` +
      `Type: ${ticketType}\n` +
      `Price: $${price.toFixed(2)}\n\n` +
      `This will redirect to a checkout page once the purchase API is wired up.`
  );

  if (confirmed) {
    alert(
      "Connect your purchase / payment API routes to complete this flow!"
    );
    // Example future behavior:
    // window.location.href = `checkout.html?ticketId=${ticketId}`;
  }
}

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  loadEventDetails();
});
