// State
let currCity = "Pune";
let units = "metric";

// Selectors
const city = document.querySelector(".weather__city");
const datetime = document.querySelector(".weather__datetime");
const temperature = document.querySelector(".weather__temperature");
const icon = document.querySelector(".weather__icon");
const forecastContainer = document.querySelector(".forecast__cards");

// Search
document.querySelector(".weather__search").addEventListener('submit', e => {
    e.preventDefault();
    const search = document.querySelector(".weather__searchform");
    currCity = search.value;
    getWeather();
    search.value = "";
});

// Units
document.querySelector(".weather_unit_celsius").addEventListener('click', () => {
    if (units !== "metric") {
        units = "metric";
        getWeather();
    }
});

document.querySelector(".weather_unit_farenheit").addEventListener('click', () => {
    if (units !== "imperial") {
        units = "imperial";
        getWeather();
    }
});

// Convert timestamp to readable date/time
function convertTimeStamp(timestamp) {
    const date = new Date(timestamp * 1000);
    const dateOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    };
  
    const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
        // second: "2-digit",
        hour12: true, 
    };
  
    const formattedDate = date.toLocaleDateString("en-IN", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-IN", timeOptions);
  
    return `${formattedDate} at ${formattedTime}`;
}

// Fetch weather data
function getWeather() {
    const API_KEY = '9e5e2a1f1feb58307b5869b910308154';

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&units=${units}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            city.innerHTML = `${data.name}, ${data.sys.country}`;
            datetime.innerHTML = convertTimeStamp(data.dt); // Use converted timestamp
            temperature.innerHTML = `${Math.round(data.main.temp)}&#176;`;
            icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="weather-icon">`;
        });

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${currCity}&units=${units}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            forecastContainer.innerHTML = '';
            const forecastList = data.list.filter(item => item.dt_txt.includes("12:00:00")); // Get daily forecast at 12:00
            
            forecastList.forEach(forecast => {
                const day = new Date(forecast.dt * 1000).toLocaleDateString("en-IN", { weekday: 'long' });
                const temp = `${Math.round(forecast.main.temp)}&#176;`;
                const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

                const forecastCard = `
                    <div class="forecast__card">
                        <h3>${day}</h3>
                        <img src="${iconUrl}" alt="forecast-icon">
                        <p>${temp}</p>
                    </div>
                `;
                forecastContainer.insertAdjacentHTML('beforeend', forecastCard);
            });
        });
}

// Fetch weather on page load
window.addEventListener('load', () => {
    getWeather();
    
});
