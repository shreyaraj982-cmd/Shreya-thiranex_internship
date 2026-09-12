// Thiranex Weather Dashboard

const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const statusMessage = document.getElementById("status");
const weatherResult = document.getElementById("weatherResult");

// Get coordinates for a city
async function getCityCoordinates(city) {
  const url =
    "https://geocoding-api.open-meteo.com/v1/search" +
    "?name=" +
    encodeURIComponent(city) +
    "&count=1&language=en&format=json";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to search for the city.");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("City not found. Please try another city.");
  }

  return data.results[0];
}

// Get weather data
async function getWeather(latitude, longitude) {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=" +
    latitude +
    "&longitude=" +
    longitude +
    "&current=temperature_2m,relative_humidity_2m,wind_speed_10m" +
    "&timezone=auto";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to fetch weather data.");
  }

  return await response.json();
}

// Display weather
function displayWeather(city, weather) {
  const current = weather.current;

  weatherResult.innerHTML = `
    <article class="weather-card">

      <h3>
        ${city.name}, ${city.country}
      </h3>

      <p>
        <strong>🌡️ Temperature:</strong>
        ${current.temperature_2m} °C
      </p>

      <p>
        <strong>💧 Humidity:</strong>
        ${current.relative_humidity_2m} %
      </p>

      <p>
        <strong>💨 Wind Speed:</strong>
        ${current.wind_speed_10m} km/h
      </p>

      <p>
        <strong>🕐 Updated:</strong>
        ${current.time}
      </p>

    </article>
  `;
}

// Search weather
async function searchWeather(city) {

  statusMessage.textContent = "Loading weather data...";
  weatherResult.innerHTML = "";

  try {

    const location = await getCityCoordinates(city);

    const weather = await getWeather(
      location.latitude,
      location.longitude
    );

    displayWeather(location, weather);

    statusMessage.textContent =
      "Weather data loaded successfully.";

  } catch (error) {

    statusMessage.textContent =
      "Error: " + error.message;

  }
}

// Form submission
weatherForm.addEventListener("submit", async function(event) {

  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    statusMessage.textContent =
      "Please enter a city name.";
    return;
  }

  await searchWeather(city);
});
