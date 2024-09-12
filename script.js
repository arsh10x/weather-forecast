// State
let currCity = "Pune";
let units = "metric";

// Selectors
const cityElem = document.querySelector(".weather__city");
const temperatureElem = document.querySelector(".weather__temperature");
const iconElem = document.querySelector(".weather__icon");
const forecastContainer = document.querySelector(".forecast__cards");
const currentTimeElem = document.querySelector(".weather__current-time");

// API Key
const API_KEY = "9e5e2a1f1feb58307b5869b910308154";

// Search Form
document.querySelector(".weather__search").addEventListener("submit", (e) => {
  e.preventDefault();
  const searchInput = document.querySelector(".weather__searchform").value;
  currCity = searchInput.trim() || currCity; // Use trimmed value or default to current city
  getWeather();
  document.querySelector(".weather__searchform").value = "";
});

// Units Toggle
const setUnits = (unit) => {
  if (units !== unit) {
    units = unit;
    getWeather();
  }
};

document.querySelector(".weather_unit_celsius").addEventListener("click", () => setUnits("metric"));
document.querySelector(".weather_unit_farenheit").addEventListener("click", () => setUnits("imperial"));

// Convert timestamp to readable date/time
const formatDateTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return {
    date: date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }),
  };
};

// Update current time and date
const updateCurrentTime = () => {
  const now = new Date();
  const { date, time } = formatDateTime(now.getTime() / 1000);
  currentTimeElem.textContent = `${date} | ${time}`;
};

// Fetch weather data
const fetchWeatherData = async () => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&units=${units}&appid=${API_KEY}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

const fetchForecastData = async () => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${currCity}&units=${units}&appid=${API_KEY}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching forecast data:", error);
  }
};

// Get and display weather data
const getWeather = async () => {
  const weatherData = await fetchWeatherData();
  if (weatherData) {
    cityElem.innerHTML = `${weatherData.name}, ${weatherData.sys.country}`;
    temperatureElem.innerHTML = `${Math.round(weatherData.main.temp)}&#176;`;
    iconElem.innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png" alt="weather-icon">`;
  }

  const forecastData = await fetchForecastData();
  if (forecastData) {
    forecastContainer.innerHTML = "";
    const forecastList = forecastData.list.filter((item) => item.dt_txt.includes("12:00:00"));

    forecastList.forEach((forecast) => {
      const day = new Date(forecast.dt * 1000).toLocaleDateString("en-IN", { weekday: "long" });
      const temp = `${Math.round(forecast.main.temp)}&#176;`;
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
  }
};

// Initialize
window.addEventListener("load", () => {
  getWeather();
  setInterval(updateCurrentTime, 1000);
});
