// Set variables
var fullWeatherEl = document.querySelector('.weatherInfo');
var currWeatherEl = document.querySelector('.currWeather');
var forecastEl = document.querySelector('.weatherForecast');
var cityEl;
var tempEl;
var windEl;
var humidEl;
//Api Variables
var apiKey = '070384a38d716db50d230ee0807a81b5';
var baseUrl = 'https://api.openweathermap.org/';
var currWeatherStr = 'data/2.5/weather?';
var geocodeStr = 'geo/1.0/direct?';
var btnEl = document.querySelector('.btn');
var currCoords;
var currWeatherUrl;
// Geocoding API
function getLocation() {
    var userInputEl = document.querySelector('#userInput');
    var geocodeUrl = `${baseUrl}${geocodeStr}q=${userInputEl.value}&appId=${apiKey}`

    return fetch(geocodeUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                return response.json()
            } else {
                alert(`Error: ${response.statusText}`);
            }
        })
        .then(function (data) {
            currCoords = `lat=${data[0].lat}&lon=${data[0].lon}`;
            console.log(data);
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeatherMap');
        });
}

function getCurrentWeather() {
    getLocation()
        .then(function () {
            console.log(currCoords);
            currWeatherUrl = `${baseUrl}${currWeatherStr}${currCoords}&appId=${apiKey}&units=metric`;
            console.log(currWeatherUrl);

            return fetch(currWeatherUrl)
        })
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                return response.json()
            } else {
                alert(`Error: ${response.statusText}`);
            }
        })
        .then(function (data) {
            console.log(data);
            cityEl = data.name;
            console.log(cityEl);
            tempEl = data.main.temp
            console.log(tempEl);
            windEl = data.wind.speed
            console.log(windEl);
            humidEl = data.main.humidity
        })
        .catch(function (error) {
            alert(`Unable to connect to OpenWeatherMap`);
        });
};

function showCurrentWeather() {
    fullWeatherEl.setAttribute('class', 'col-8 col-md-9 py-2');
    currWeatherEl.setAttribute('class', 'row')
    var cityNameEl = document.createElement('h2');
    cityNameEl.setAttribute('class', 'row cityName py-2')
    cityNameEl.textContent = cityEl;
    forecastEl.setAttribute('class', 'row');

    cityNameEl.append(cityEl);
    console.log('working');
}


// Weather API
$(btnEl.addEventListener('click', function (event) {
    event.preventDefault();
    getCurrentWeather();
    showCurrentWeather();
}));
