
// 1. API KEY
const API_KEY = "1bd2b6b49f82b451afa8e492e8c2950c";

// 2. SELECT HTML ELEMENTS
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const locationBtn = document.getElementById("location-btn");

const weatherCard = document.getElementById("weather-card");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");

// 3. FETCH WEATHER DATA
async function fetchWeather(url) {

    loading.hidden = false;
    weatherCard.hidden = true;
    errorMessage.textContent = "";

    try {

        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to fetch weather"
            );
        }

        displayWeather(data);

    } catch (error) {

        errorMessage.textContent = error.message;

    } finally {

        loading.hidden = true;

    }
}

// 4. DISPLAY WEATHER INFORMATION
function displayWeather(data) {

    document.getElementById("city-name").textContent =
        data.name + ", " + data.sys.country;

    document.getElementById("temperature").textContent =
        Math.round(data.main.temp) + "°C";

    document.getElementById("weather-condition").textContent =
        data.weather[0].description;

    document.getElementById("feels-like").textContent =
        "Feels like " + Math.round(data.main.feels_like) + "°C";

    document.getElementById("humidity").textContent =
        data.main.humidity + "%";

    document.getElementById("wind-speed").textContent =
        data.wind.speed + " m/s";

    document.getElementById("pressure").textContent =
        data.main.pressure + " hPa";

    document.getElementById("weather-icon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    document.getElementById("weather-icon").alt =
        data.weather[0].description;

    weatherCard.hidden = false;
}

// 5. SEARCH WEATHER BY CITY
function searchWeather(city) {

    if (!city.trim()) {
        errorMessage.textContent = "Please enter a city name";
        return;
    }

    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;

    fetchWeather(url);
}

// 6. SEARCH BUTTON EVENT
searchForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const city = cityInput.value.trim();

    searchWeather(city);

});

// 7. GET CURRENT LOCATION
function getLocation() {

    if (!navigator.geolocation) {

        errorMessage.textContent =
            "Geolocation is not supported by your browser";

        return;
    }

    loading.hidden = false;
    weatherCard.hidden = true;
    errorMessage.textContent = "";

    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const url =
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

            fetchWeather(url);

        },

        function(error) {

            loading.hidden = true;

            errorMessage.textContent =
                "Unable to access location. Please allow permission.";

        }

    );

}

// 8. LOCATION BUTTON EVENT
locationBtn.addEventListener("click", getLocation);
