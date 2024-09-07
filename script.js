// State
let currCity = "Pune";
let units = "metric";

// Selectors
let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__minmax = document.querySelector(".weather__minmax");
let weather__realfeel = document.querySelector('.weather__realfeel');
let weather__humidity = document.querySelector('.weather__humidity');
let weather__wind = document.querySelector('.weather__wind');
let weather__pressure = document.querySelector('.weather__pressure');

// Search
document.querySelector(".weather__search").addEventListener('submit', e => {
    let search = document.querySelector(".weather__searchform");
    // Prevent default action
    e.preventDefault();
    // Change current city
    currCity = search.value;
    // Get weather forecast 
    getWeather();
    // Clear form
    search.value = "";
});

// Units
document.querySelector(".weather_unit_celsius").addEventListener('click', () => {
    if (units !== "metric") {
        // Change to metric
        units = "metric";
        // Get weather forecast 
        getWeather();
    }
});

document.querySelector(".weather_unit_farenheit").addEventListener('click', () => {
    if (units !== "imperial") {
        // Change to imperial
        units = "imperial";
        // Get weather forecast 
        getWeather();
    }
});

// Convert timestamp and timezone to readable date/time
function convertTimeStamp(timestamp, timezone) {
    // Convert timezone from seconds to hours
    const timezoneOffset = timezone / 3600;

    // Create a new Date object using the timestamp (in milliseconds)
    const date = new Date(timestamp * 1000);

    // Manually adjust the hours based on the timezone offset
    const adjustedTime = new Date(date.getTime() + timezone * 1000);

    // Format the date and time
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true
    };

    // Return the formatted date and time string
    return adjustedTime.toLocaleString("en-US", options);
}

// Convert country code to country name
function convertCountryCode(country) {
    let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    const countryName = regionNames.of(country);

    // Fallback if the country code is not recognized
    return countryName || 'Unknown Country';
}

// Fetch weather data
function getWeather() {
    const API_KEY = '9e5e2a1f1feb58307b5869b910308154';

    // Fetch location using city name
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${currCity}&limit=1&appid=${API_KEY}`)
        .then(res => res.json())
        .then(locationData => {
            if (locationData.length === 0) {
                city.innerHTML = "City not found.";
                throw new Error("City not found.");
            }

            const lat = locationData[0].lat;
            const lon = locationData[0].lon;

            // Fetch weather data using lat and lon
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
                    datetime.innerHTML = convertTimeStamp(data.dt, data.timezone); 
                    weather__forecast.innerHTML = `<p>${data.weather[0].main}</p>`;
                    weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176`;
                    weather__icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`;
                    weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`;
                    weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`;
                    weather__humidity.innerHTML = `${data.main.humidity}%`;
                    weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`; 
                    weather__pressure.innerHTML = `${data.main.pressure} hPa`;
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    city.innerHTML = "Weather data unavailable.";
                });
        })
        .catch(error => {
            console.error('Error fetching location:', error);
        });
}

// Fetch weather on page load
window.addEventListener('load', getWeather);
