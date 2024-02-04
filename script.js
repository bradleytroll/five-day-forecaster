// Declarations: Grabs html and assigns variables or creates new elements.
var cityForm = document.getElementById('city-form');
var cityInput = document.getElementById('city-input');
var weatherData = document.getElementById('weather-data');
var forecast = document.getElementById('forecast');
var apiKey = "d7d2daaf620c75d9e65a81dfbee535d2"


// Adds an event listener to the form. Upon submit, a variable is created based on user input, which is then trimmed from spacing and altered to all lower case letters. 
cityForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var cityName = cityInput.value.trim().toLowerCase();
    if (cityName) {
        getWeatherData(cityName);
    }
})

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
}

// (in progress) Creates function to append the data to the DOM. 
function displayWeather(data) {
    //console.log(data)
    var currentWeather = data.list[0];
    //console.log(currentWeather)
    var cityName = data.city.name;
    var currentDate = new Date(currentWeather.dt * 1000);
    var iconCode = currentWeather.weather[0].icon;
    var temperature = currentWeather.main.temp;
    var humidity = currentWeather.main.humidity;
    var windSpeed = currentWeather.wind.speed;
    var currentWeatherHTML = `
        <h2>${cityName} (${currentDate}) <img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon"></h2>
        <p>Temperature: ${temperature} &deg;C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        `;
    weatherData.innerHTML = currentWeatherHTML;
    //console.log(weatherData)











    
}


