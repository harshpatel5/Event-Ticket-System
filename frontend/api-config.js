// ============================================================
// API CONFIG - CENTRALIZED ENDPOINTS + FETCH WRAPPER
// ============================================================

// Your Flask backend is running on port 5000
const API_BASE_URL = "http://127.0.0.1:5000/api";

// Endpoints that reflect your actual Flask routes
const API_ENDPOINTS = {
  events: {
    list: `${API_BASE_URL}/events/`,          // GET /api/events/
    // We don't strictly need per-ID, but keep it for future use
    getById: (id) => `${API_BASE_URL}/events/${id}`, // Only if you later add that route
    search: `${API_BASE_URL}/events/search`  // If you later fix/use server-side search
  },
  categories: {
    list: `${API_BASE_URL}/categories/`       // GET /api/categories/
  },
  venues: {
    list: `${API_BASE_URL}/venues/`           // GET /api/venues/
  },
  tickets: {
    list: `${API_BASE_URL}/tickets/`          // GET /api/tickets/
  },
  customers: {
    list: `${API_BASE_URL}/customers/`        // GET /api/customers/
  },
  purchases: {
    list: `${API_BASE_URL}/purchases/`        // GET /api/purchases/
  }
};

// Generic fetch wrapper with JSON + error handling
async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });

    if (!response.ok) {
      console.error("API error response:", await response.text());
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Some endpoints might return no body (204), handle gracefully
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
}

// Convenience helpers (optional)
async function fetchAllEventsRaw() {
  return await apiRequest(API_ENDPOINTS.events.list);
}

async function fetchAllCategoriesRaw() {
  return await apiRequest(API_ENDPOINTS.categories.list);
}

async function fetchAllVenuesRaw() {
  return await apiRequest(API_ENDPOINTS.venues.list);
}

async function fetchAllTicketsRaw() {
  return await apiRequest(API_ENDPOINTS.tickets.list);
}
