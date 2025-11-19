document.addEventListener("DOMContentLoaded", async () => {
    const authButtons = document.getElementById("authButtons");

    let user = null;

    try {
        user = await fetchCurrentUser();   // may fail with 401
    } catch (err) {
        console.warn("User not logged in, showing default navbar.");
    }

    // NOT LOGGED IN
    if (!user || user.error || user.msg) {
        authButtons.innerHTML = `
            <button class="btn-secondary" onclick="window.location.href='login.html'">Sign In</button>
        `;
        return;
    }

    // LOGGED IN
    authButtons.innerHTML = `
        <span class="user-greeting">Hello, ${user.first_name} ${user.last_name}</span>
        <button class="btn-secondary" onclick="logout()">Logout</button>
        ${
            user.role === "admin"
            ? `<button class="btn-primary" onclick="window.location.href='admin-dashboard.html'">Admin Panel</button>`
            : `<button class="btn-primary" onclick="window.location.href='customer-dashboard.html'">My Tickets</button>`
        }
    `;
});

function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    localStorage.removeItem("authEmail");
    window.location.reload();
}

// WEATHER
async function loadNavbarWeather() {
    const API_KEY = "bb82621cf968e35ce7553f9735f9a69c";
    const city = "Toronto";

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        const data = await res.json();

        document.getElementById("weatherCity").textContent = city;
        document.getElementById("weatherTemp").textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    } catch (err) {
        document.getElementById("weatherCity").textContent = "Weather N/A";
    }
}

document.addEventListener("DOMContentLoaded", loadNavbarWeather);
