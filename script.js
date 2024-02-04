// Declarations: Grabs html and assigns variables or creates new elements.
var cityForm = document.getElementById('city-form');
var cityInput = document.getElementById('city-input');
var weatherData = document.getElementById('weather-data');
var forecast = document.getElementById('forecast');

// Adds an event listener to the form. Upon submit, a variable is created based on user input, which is then trimmed from spacing and altered to all lower case letters. 
cityForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var cityName = cityInput.value.trim().toLowerCase();
    if (cityName) {
        getWeatherData(cityName);
    }
})

// (in progress) Creates function to get weather data.
function getWeatherData(city) {
    console.log("hi")
}
