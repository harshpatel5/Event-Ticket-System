// ============================================================
// API Configuration
// ============================================================
// Replace with your actual API base URL
const API_BASE_URL = 'http://localhost:3000/api'; // or your backend URL

// API Endpoints matching your database structure
const API_ENDPOINTS = {
  // Event endpoints
  events: {
    getAll: `${API_BASE_URL}/events`,
    getById: (id) => `${API_BASE_URL}/events/${id}`,
    getByCategory: (categoryId) => `${API_BASE_URL}/events/category/${categoryId}`,
    getByStatus: (status) => `${API_BASE_URL}/events/status/${status}`,
    search: `${API_BASE_URL}/events/search`
  },
  
  // Ticket endpoints
  tickets: {
    getByEvent: (eventId) => `${API_BASE_URL}/tickets/event/${eventId}`,
    getById: (id) => `${API_BASE_URL}/tickets/${id}`
  },
  
  // Category endpoints
  categories: {
    getAll: `${API_BASE_URL}/categories`,
    getById: (id) => `${API_BASE_URL}/categories/${id}`
  },
  
  // Venue endpoints
  venues: {
    getAll: `${API_BASE_URL}/venues`,
    getById: (id) => `${API_BASE_URL}/venues/${id}`,
    getByCity: (city) => `${API_BASE_URL}/venues/city/${city}`
  },
  
  // Customer/Authentication endpoints
  customers: {
    register: `${API_BASE_URL}/customers/register`,
    login: `${API_BASE_URL}/customers/login`,
    getProfile: (id) => `${API_BASE_URL}/customers/${id}`
  },
  
  // Purchase endpoints
  purchases: {
    create: `${API_BASE_URL}/purchases`,
    getById: (id) => `${API_BASE_URL}/purchases/${id}`,
    getByCustomer: (customerId) => `${API_BASE_URL}/purchases/customer/${customerId}`
  }
};

// ============================================================
// API Helper Functions
// ============================================================

// Generic fetch wrapper with error handling
async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

// ============================================================
// Event API Functions
// ============================================================

async function fetchAllEvents() {
  return await apiRequest(API_ENDPOINTS.events.getAll);
}

async function fetchEventById(eventId) {
  return await apiRequest(API_ENDPOINTS.events.getById(eventId));
}

async function fetchEventsByCategory(categoryId) {
  return await apiRequest(API_ENDPOINTS.events.getByCategory(categoryId));
}

async function fetchUpcomingEvents() {
  return await apiRequest(API_ENDPOINTS.events.getByStatus('Upcoming'));
}

async function searchEvents(searchTerm, city = '', dateFilter = '') {
  const params = new URLSearchParams({
    q: searchTerm,
    city: city,
    date: dateFilter
  });
  return await apiRequest(`${API_ENDPOINTS.events.search}?${params}`);
}

// ============================================================
// Ticket API Functions
// ============================================================

async function fetchTicketsByEvent(eventId) {
  return await apiRequest(API_ENDPOINTS.tickets.getByEvent(eventId));
}

// ============================================================
// Category API Functions
// ============================================================

async function fetchAllCategories() {
  return await apiRequest(API_ENDPOINTS.categories.getAll);
}

// ============================================================
// Venue API Functions
// ============================================================

async function fetchAllVenues() {
  return await apiRequest(API_ENDPOINTS.venues.getAll);
}

async function fetchVenuesByCity(city) {
  return await apiRequest(API_ENDPOINTS.venues.getByCity(city));
}

// ============================================================
// Purchase API Functions
// ============================================================

async function createPurchase(purchaseData) {
  return await apiRequest(API_ENDPOINTS.purchases.create, {
    method: 'POST',
    body: JSON.stringify(purchaseData)
  });
}

async function fetchCustomerPurchases(customerId) {
  return await apiRequest(API_ENDPOINTS.purchases.getByCustomer(customerId));
}

// ============================================================
// Customer/Auth API Functions
// ============================================================

async function registerCustomer(customerData) {
  return await apiRequest(API_ENDPOINTS.customers.register, {
    method: 'POST',
    body: JSON.stringify(customerData)
  });
}

async function loginCustomer(email, password) {
  return await apiRequest(API_ENDPOINTS.customers.login, {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}
