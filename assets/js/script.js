// Set variables
var historyEl = document.querySelector('.history');
var fullWeatherEl = document.querySelector('#weatherInfo');
var currWeatherEl = document.querySelector('#currWeather');
var forecastEl = document.querySelector('#weatherForecast');
var historyBtnEl = document.querySelector('.historyBtn');
var userInputEl = document.querySelector('#userInput');
var history = [];
//Api Variables
var apiKey = '070384a38d716db50d230ee0807a81b5';
var baseUrl = 'https://api.openweathermap.org/';
var currWeatherStr = 'data/2.5/weather?';
var geocodeStr = 'geo/1.0/direct?';
var btnEl = document.querySelector('.btn');
var currCoords;
var currWeatherUrl;
var weatherIconApi = `img/w/`;
var weatherIconUrl = `${baseUrl}${weatherIconApi}`;
// Geocoding API
function getLocation() {
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
            getCurrentWeather(data);
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeatherMap');
        });
}

function getCurrentWeather(currCoords) {
    var coordinates = `lat=${currCoords[0].lat}&lon=${currCoords[0].lon}`;
    currWeatherUrl = `${baseUrl}${currWeatherStr}${coordinates}&appId=${apiKey}&units=metric`;
    console.log(currWeatherUrl);

    return fetch(currWeatherUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                return response.json()
            } else {
                alert(`Error: ${response.statusText}`);
            }
        })
        .then(function (data) {
            showCurrentWeather(data);
            getDaysForecast(data);
        })
        .catch(function (error) {
            alert(`Unable to connect to OpenWeatherMap`);
        });
};

function showCurrentWeather(locationData) {
    var currDay = dayjs.unix(locationData.dt).format('D/MM/YYYY');
    console.log('LocationData: ', locationData);
    fullWeatherEl.setAttribute('class', 'col-8 weatherInfo mx-2');
    currWeatherEl.setAttribute('class', 'row currWeather p-2')
    var cityNameEl = document.createElement('h2');
    cityNameEl.setAttribute('class', 'row cityName');
    cityNameEl.textContent = `${locationData.name} - ${currDay}`;
    var tempEl = document.createElement('p');
    tempEl.setAttribute('class', 'row temp');
    tempEl.textContent = `Current Temperature: ${locationData.main.temp} ${String.fromCharCode(0x2103)}`;
    var windEl = document.createElement('p');
    windEl.setAttribute('class', 'row wind');
    windEl.textContent = `Wind Speed: ${locationData.wind.speed} KM/H`;
    var humidityEl = document.createElement('p');
    humidityEl.setAttribute('class', 'row humidity');
    humidityEl.textContent = `Humidity: ${locationData.main.humidity}%`;
    forecastEl.setAttribute('class', 'row weatherForecast');
    // forecastEl.textContent = locationData.



    currWeatherEl.appendChild(cityNameEl);
    currWeatherEl.appendChild(tempEl);
    currWeatherEl.appendChild(windEl);
    currWeatherEl.appendChild(humidityEl);
    fullWeatherEl.appendChild(forecastEl);
}

function getDaysForecast(currCoords) {
    var coordinates = `lat=${currCoords.coord.lat}&lon=${currCoords.coord.lon}`;
    console.log('Coords: ', coordinates);
    var daysForecast = `${baseUrl}data/2.5/forecast?${coordinates}&appid=${apiKey}&units=metric`
    fetch(daysForecast)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            console.log('data: ', data)
            showWeatherForecast(data);
        })
};

function showWeatherForecast(forecastData) {
    console.log(forecastData.list.length);
    var forecastTitle = document.createElement('h3');
    forecastTitle.setAttribute('class', 'row title py-2');
    forecastTitle.textContent = '5-Day Forecast:';
    forecastEl.appendChild(forecastTitle);
    for (i = 0; i < forecastData.list.length; i = i + 8) {
        console.log(forecastData.list[i].dt_txt);
        var currDay = dayjs.unix(forecastData.list[i].dt).format('D/MM/YYYY');
        var boxEl = document.createElement('div');
        boxEl.setAttribute('class', 'col weatherBox');
        var dayEl = document.createElement('h4');
        dayEl.setAttribute('class', 'row');
        dayEl.textContent = currDay;
        var iconEl = document.createElement('img');
        iconEl.setAttribute('class', 'row');
        iconEl.setAttribute('src', `${weatherIconUrl}${forecastData.list[i].weather[0].icon}.png`)
        var tempEl = document.createElement('p');
        tempEl.setAttribute('class', 'row temp');
        tempEl.textContent = `Temp: ${forecastData.list[i].main.temp} ${String.fromCharCode(0x2103)}`;
        var windEl = document.createElement('p');
        windEl.setAttribute('class', 'row wind');
        windEl.textContent = `Wind: ${forecastData.list[i].wind.speed}`;
        var humidityEl = document.createElement('p');
        humidityEl.setAttribute('class', 'row humidity');
        humidityEl.textContent = `Humidity: ${forecastData.list[i].main.humidity} %`;




        forecastEl.appendChild(boxEl);
        boxEl.appendChild(dayEl);
        boxEl.appendChild(iconEl);
        boxEl.appendChild(tempEl);
        boxEl.appendChild(windEl);
        boxEl.appendChild(humidityEl);
    }
}

function storeHistory() {
    var userInputEl = document.querySelector('#userInput');
    

    localStorage.setItem('history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyEl.innerHTML='';
    //render a button for each recent search
    for (var i = 0; i < history.length; i++){
        var historyList = history[i];

        var historyLi = document.createElement('button');
        historyLi.textContent = historyList;
        historyLi.setAttribute('class', 'row historyBtn')
        historyLi.setAttribute('data-index', i);

        historyEl.appendChild(historyLi);
    }
}

function init() {
    var storedHistory = JSON.parse(localStorage.getItem('history'));

    if (storedHistory !== null) {
        history = storedHistory;
    }

    renderHistory();
}

// Weather API
$(btnEl.addEventListener('click', function (event) {
    event.preventDefault();
    getLocation();
    var historyText = userInputEl.value.trim();
    if (historyText === '') {
        return;
    }
        history.push(historyText);
        userInputEl.value = '';
    
    storeHistory();
}));

//History Button listener
if (historyBtnEl !== null) {
    historyBtnEl.addEventListener('click', function(event) {
    var element = event.target;

    var index = element.parentElement.getAttribute('data-index');
    history.splice(index, 1);

    storeHistory();
    renderHistory();
})}



init();

