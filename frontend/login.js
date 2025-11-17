// frontend/login.js
const API_BASE = "http://127.0.0.1:5000/api";

async function loginUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorEl = document.getElementById("loginError");

  errorEl.style.display = "none";

  if (!email || !password) {
    errorEl.textContent = "Email and password are required.";
    errorEl.style.display = "block";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error || "Login failed.";
      errorEl.style.display = "block";
      return;
    }

    // Save token
    localStorage.setItem("authToken", data.token);

    // Redirect to homepage (or admin page)
    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
    errorEl.textContent = "An error occurred. Please try again.";
    errorEl.style.display = "block";
  }
}

// Simple logout helper for other pages
function logout() {
  localStorage.removeItem("authToken");
  window.location.reload();
}

// Optional: check user on load and adjust UI (can be used in other pages)
async function getCurrentUser() {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
