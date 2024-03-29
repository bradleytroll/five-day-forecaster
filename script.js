document.addEventListener('DOMContentLoaded', function() {


// Declarations: Grabs html and assigns variables or creates new elements.
var cityForm = document.getElementById('city-form');
var cityInput = document.getElementById('city-input');
var weatherData = document.getElementById('weather-data');
var forecast = document.getElementById('forecast');
var historyDiv = document.getElementById('history');
var apiKey = "d7d2daaf620c75d9e65a81dfbee535d2"
var cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];

// Creates a function to update the history, given the name of a searched city and adding it to the cityHistory array.
function updateHistory(cityName) {
    if (!cityHistory.includes(cityName)) {
        cityHistory.unshift(cityName); 
        displayHistory();
    }
}

// Creates function to get weather data. Makes request to the API and uses my apiKey to retrieve the data. The data is then set as an argument to the displayWeather function. 
function getWeatherData(city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found')
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            updateHistory(city);
            storeCityHistory();
            cityInput.value = "";
        })
        .catch(error => {
            alert('Error fetching weather data!');
        });
 
}

// Creates a function that updates the div with a list of previously-searched cities, which is immediately fired. This function itertes through the cith history and creates div elements for each city. Additionally, event listenters are added to each city that fire the function to retreive and post data for that city. 
function displayHistory() {
    historyDiv.innerHTML = "<h2>Search History</h2>"
    cityHistory.slice(0, 10).forEach(city => {
        var historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.textContent = city;
        historyItem.addEventListener('click', function() {
            getWeatherData(city);
        });
        historyDiv.appendChild(historyItem);
    });
}
displayHistory();

// Adds an event listener to the form. Upon submit, a variable is created based on user input, which is then trimmed from spacing and altered to all lower case letters. 
cityForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var cityName = cityInput.value.trim().toLowerCase();
    if (cityName) {
        getWeatherData(cityName);
    }
});

// Creates a function to store the previously searched cities in local storage. 
function storeCityHistory() {
    localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
}


// Creates function to append weather data to the DOM. Takes the data from the fetch request, creates various variables attached to data from the request results, and appends the data to the DOM, including a div for current weather adn a divs for the five day forecasts. 
function displayWeather(data) {
    //console.log(data)
    forecast.innerHTML = ""
    var currentWeather = data.list[0];
    var cityName = data.city.name;
    var currentDate = new Date(currentWeather.dt * 1000);
    var iconCode = currentWeather.weather[0].icon;
    var humidity = currentWeather.main.humidity;
    var windSpeed = currentWeather.wind.speed;
    var temperature = currentWeather.main.temp;
    weatherData.style.backgroundColor = '#3498db';
    var currentWeatherHTML = `
        <h1>Today's Weather</h1>
        <h2>${cityName} <br> ${currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} <br> <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon"></h2>
        <p>Temperature: ${temperature}&deg; F</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        `;
    weatherData.innerHTML = currentWeatherHTML;
        forecast.innerHTML = "<h2>Five-Day Forecast</h2>"
        var forecastHTML = data.list.slice(1, 6).map((forecast, index) => {
        var forecastDate = new Date(currentDate);
        forecastDate.setDate(forecastDate.getDate() + index + 1);
        var forecastIconCode = forecast.weather[0].icon;
        var forecastHumidity = forecast.main.humidity;
        var forecastWindSpeed = forecast.wind.speed;
        var forecastTemperature = forecast.main.temp;
        return `
        <div class="forecast-item">
                <p>${forecastDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p> <br>
            <img src="https://openweathermap.org/img/wn/${forecastIconCode}.png" alt="Weather Icon">
            <p>Temp: ${forecastTemperature}&deg; F</p>
                    <p>Humidity: ${forecastHumidity}%</p>
                    <p>Wind Speed: ${forecastWindSpeed} m/s</p>
            </div>`;
    }).join('');
    forecast.innerHTML += `<div class="forecast">${forecastHTML}</div>`
 }
});

