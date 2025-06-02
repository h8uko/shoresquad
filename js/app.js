// Global Variables
let map;
let weatherData = {};

// Sample events data (to be replaced with actual backend data)
const events = [
    {
        id: 1,
        name: "Sunday Beach Cleanup",
        location: "Main Beach",
        date: "2025-06-09",
        participants: 15
    },
    {
        id: 2,
        name: "Coastal Warriors Meetup",
        location: "North Shore",
        date: "2025-06-16",
        participants: 8
    }
];

// Initialize Google Maps
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        styles: [
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#1CA3EC" }]
            }
        ]
    });

    // Get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(pos);
                new google.maps.Marker({
                    position: pos,
                    map: map,
                    title: "Your Location",
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: "#1CA3EC",
                        fillOpacity: 0.8,
                        strokeWeight: 1
                    }
                });
                fetchWeather(pos.lat, pos.lng);
            },
            () => {
                console.log("Error: The Geolocation service failed.");
            }
        );
    }
}

// Fetch weather data from OpenWeatherMap API
async function fetchWeather(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=YOUR_API_KEY&units=metric`
        );
        weatherData = await response.json();
        updateWeatherUI();
    } catch (error) {
        console.error("Error fetching weather:", error);
        document.getElementById("weather").innerHTML = `
            <h2>Weather</h2>
            <p>Unable to load weather data. Please try again later.</p>
        `;
    }
}

// Update weather section UI
function updateWeatherUI() {
    const weatherSection = document.getElementById("weather");
    if (weatherData.main) {
        const weatherIcon = weatherData.weather[0].icon;
        weatherSection.innerHTML = `
            <h2>Weather Conditions</h2>
            <div class="weather-info">
                <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather icon">
                <p class="temperature">${Math.round(weatherData.main.temp)}°C</p>
                <p class="conditions">${weatherData.weather[0].description}</p>
                <div class="weather-details">
                    <p>Wind: ${weatherData.wind.speed} m/s</p>
                    <p>Humidity: ${weatherData.main.humidity}%</p>
                </div>
            </div>
        `;
    }
}

// Display events in the events section
function displayEvents() {
    const eventsSection = document.getElementById("events");
    const eventsList = events
        .map(event => `
            <div class="event-card">
                <div class="event-info">
                    <h3>${event.name}</h3>
                    <p>${event.location} - ${formatDate(event.date)}</p>
                </div>
                <div class="event-stats">
                    <p>${event.participants} participants</p>
                    <button onclick="joinEvent(${event.id})" class="join-btn">
                        Join Cleanup
                    </button>
                </div>
            </div>
        `)
        .join("");
    
    eventsSection.innerHTML = `
        <h2>Upcoming Cleanups</h2>
        ${eventsList}
    `;
}

// Format date for better display
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Join event functionality
function joinEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        event.participants++;
        displayEvents();
        
        // Show success message
        const btn = document.querySelector(`button[onclick="joinEvent(${eventId})"]`);
        btn.textContent = "Joined!";
        btn.style.backgroundColor = "var(--color-success)";
        setTimeout(() => {
            btn.textContent = "Join Cleanup";
        }, 2000);
    }
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
    displayEvents();
    // Note: Add your Google Maps API key in index.html
    // and uncomment the following line:
    // initMap();
});