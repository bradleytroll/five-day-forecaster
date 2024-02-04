document.addEventListener('DOMContentLoaded', function() {


// Declarations: Grabs html and assigns variables or creates new elements.
var cityForm = document.getElementById('city-form');
var cityInput = document.getElementById('city-input');
var weatherData = document.getElementById('weather-data');
var forecast = document.getElementById('forecast');
var historyDiv = document.getElementById('history');
var apiKey = "d7d2daaf620c75d9e65a81dfbee535d2"
var cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];


// INCOMPLETE ADD NOTES
function displayHistory() {
    historyDiv.innerHTML = '';
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


// Creates function to get weather data. Makes request to the API and uses my apiKey to retrieve the data. The data is then set as an argument to the displayWeather function. 
function getWeatherData(city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.log('Error fetching weather data:', error);
        });
    updateHistory(city);
    storeCityHistory();
}

  



function updateHistory(cityName) {
    if (!cityHistory.includes(cityName)) {
        cityHistory.unshift(cityName); 
        displayHistory();
    }
}

function storeCityHistory() {
    localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
}
});

// (in progress) Creates function to append the data to the DOM. 
function displayWeather(data) {
    console.log(data)
    forecast.innerHTML = ""
    var currentWeather = data.list[0];
    var cityName = data.city.name;
    var currentDate = new Date(currentWeather.dt * 1000);
    var iconCode = currentWeather.weather[0].icon;
    var humidity = currentWeather.main.humidity;
    var windSpeed = currentWeather.wind.speed;
    var temperatureValue = currentWeather.main.temp_max;
    var temperatureUnit = data.list[0].main.temp_max >= 100 ? 'F' : 'C';
    if (temperatureUnit === 'C') {
        temperatureValue = (temperatureValue * 9/5) + 32;
    }
    var currentWeatherHTML = `
        <h1>Today's Weather</h1>
        <h2>${cityName} (${currentDate.toLocaleDateString()}) <img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon"></h2>
        <p>Temperature: ${temperatureValue.toFixed(2)} &deg;${temperatureUnit}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        `;
    weatherData.innerHTML = currentWeatherHTML;
    //console.log(weatherData)

    var forecastHTML = data.list.slice(1, 6).map((forecast, index) => {
        var forecastDate = new Date(currentDate);
        forecastDate.setDate(forecastDate.getDate() + index + 1);
        var forecastIconCode = forecast.weather[0].icon;
        var forecastHumidity = forecast.main.humidity;
        var forecastWindSpeed = forecast.wind.speed;
        var forecastTemperatureValue = forecast.main.temp_max;
        console.log(forecastTemperatureValue)
        var forecastTemperatureUnit = data.list[0].main.temp_max >= 100 ? 'F' : 'C';
        if (forecastTemperatureUnit === 'C') {
            forecastTemperatureValue = (forecastTemperatureValue * 9/5) + 32;
        }
        return `
        <div class="forecast-item">
            <p>${forecastDate.toLocaleDateString()}</p>
            <img src="http://openweathermap.org/img/wn/${forecastIconCode}.png" alt="Weather Icon">
            <p>Temp: ${forecastTemperatureValue.toFixed(2)} &deg;F</p>
                    <p>Humidity: ${forecastHumidity}%</p>
                    <p>Wind Speed: ${forecastWindSpeed} m/s</p>
            </div>`;
    }).join('');

    forecast.innerHTML += `<div class="forecast">${forecastHTML}</div>`
    

}
});

