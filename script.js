// State
let currCity = "Pune";
const units = "metric"; // Always use metric units (Celsius)
let isDarkMode = false; // Track dark mode state

// Selectors
const city = document.querySelector(".weather__city");
const temperature = document.querySelector(".weather__temperature");
const icon = document.querySelector(".weather__icon");
const forecastContainer = document.querySelector(".forecast__cards");
const hourlyContainer = document.querySelector(".hourly__cards");
const currentTimeElem = document.querySelector(".weather__current-time");
const darkModeSwitch = document.getElementById("dark-mode-switch");

// Search
document.querySelector(".weather__search").addEventListener("submit", (e) => {
  e.preventDefault();
  const search = document.querySelector(".weather__searchform");
  currCity = search.value;
  getWeather();
  search.value = "";
});

// Toggle Dark/Light Mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  isDarkMode = !isDarkMode;
}

// Handle toggle switch change
darkModeSwitch.addEventListener("change", toggleDarkMode);

// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    isDarkMode = !isDarkMode;
}

// Handle toggle switch change
darkModeSwitch.addEventListener("change", toggleDarkMode);


// Fetch and update current time
function updateCurrentTime() {
  const now = new Date();

  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const dateOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const currentTime = now.toLocaleTimeString("en-IN", timeOptions);
  const currentDate = now.toLocaleDateString("en-IN", dateOptions);

  currentTimeElem.textContent = `${currentDate} | ${currentTime}`;
}

// Fetch and update weather and forecasts
function getWeather() {
  const API_KEY = "9e5e2a1f1feb58307b5869b910308154";
  
  // Fetch current weather data
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${currCity}&units=${units}&appid=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      city.innerHTML = `${data.name}, ${data.sys.country}`;
      temperature.innerHTML = `${Math.round(data.main.temp)}&#176;C`; // Always in Celsius
      icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="weather-icon">`;
    });

  // Fetch daily forecast data
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${currCity}&units=${units}&appid=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      forecastContainer.innerHTML = "";
      const forecastList = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      ); // Get daily forecast at 12:00

      forecastList.forEach((forecast) => {
        const day = new Date(forecast.dt * 1000).toLocaleDateString("en-IN", {
          weekday: "long",
        });
        const temp = `${Math.round(forecast.main.temp)}&#176;C`; // Always in Celsius
        const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

        const forecastCard = `
          <div class="forecast__card">
            <h3>${day}</h3>
            <img src="${iconUrl}" alt="forecast-icon">
            <p>${temp}</p>
          </div>
        `;
        forecastContainer.insertAdjacentHTML("beforeend", forecastCard);
      });

      // Fetch hourly forecast data
      const hourlyForecastContainer = document.querySelector(".hourly__cards");
      hourlyForecastContainer.innerHTML = "";

      // Filter hourly data for every 3 hours and limit to 6-7 items
      const hourlyForecastList = data.list.filter((item, index) =>
        index % 3 === 0 // Show forecast every 3 hours
      ).slice(0, 7); // Limit to 7 items

      hourlyForecastList.forEach((forecast) => {
        const time = new Date(forecast.dt * 1000).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const temp = `${Math.round(forecast.main.temp)}&#176;C`; // Always in Celsius
        const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

        const hourlyCard = `
          <div class="hourly__card">
            <h3>${time}</h3>
            <img src="${iconUrl}" alt="hourly-icon">
            <p>${temp}</p>
          </div>
        `;
        hourlyForecastContainer.insertAdjacentHTML("beforeend", hourlyCard);
      });
    });
}

// Fetch weather and start time update on page load
window.addEventListener("load", () => {
  getWeather();
  setInterval(updateCurrentTime, 1000);
});
