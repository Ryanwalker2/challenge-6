$(document).ready(function () {
    // Set variables
    var currentTimeEl = document.querySelector('.clock');
    currentTimeEl.textContent = dayjs().format('hh:mm a');
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
    
    function updateClock() {
        currentTimeEl.textContent = dayjs().format('hh:mm a');
    };
    // Geocoding API
    function getLocation(cityName) {
        if (cityName !== undefined) {
            var geocodeUrl = `${baseUrl}${geocodeStr}q=${cityName}&appId=${apiKey}`
        } else {
        var geocodeUrl = `${baseUrl}${geocodeStr}q=${userInputEl.value}&appId=${apiKey}`
        };

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
                console.log('Data2: ',data);
            })
            .catch(function (error) {
                alert('Unable to connect to OpenWeatherMap');
            });
    };
    
    function getCurrentWeather(locationData) {
        console.log(locationData);
        var coordinates = `lat=${locationData[0].lat}&lon=${locationData[0].lon}`;
        currWeatherUrl = `${baseUrl}${currWeatherStr}${coordinates}&appId=${apiKey}&units=metric`;

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
    };

    function showCurrentWeather(locationData) {
        currWeatherEl.innerHTML = ''; //clear data before new search
        var currDay = dayjs.unix(locationData.dt).format('D/MM/YYYY');
        console.log('LocationData: ', locationData);
        fullWeatherEl.setAttribute('class', 'col-8 weatherInfo');
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

        currWeatherEl.appendChild(cityNameEl);
        currWeatherEl.appendChild(tempEl);
        currWeatherEl.appendChild(windEl);
        currWeatherEl.appendChild(humidityEl);
        fullWeatherEl.appendChild(forecastEl);
    };

    function getDaysForecast(locationData) {
        var coordinates = `lat=${locationData[0].lat}&lon=${locationData[0].lon}`;
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
        forecastEl.innerHTML = ''; // Clear Forecast data before populating new search
        var forecastTitle = document.createElement('h3');
        forecastTitle.setAttribute('class', 'row title py-2');
        forecastTitle.textContent = '5-Day Forecast:';
        forecastEl.appendChild(forecastTitle);
        for (i = 0; i < forecastData.list.length; i = i + 8) {
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
    };

    function storeHistory(historyText) {
        var storedHistory = JSON.parse(localStorage.getItem('history')) || [];

        if (!Array.isArray(storedHistory)) {
            storedHistory = [];
        }

        var maxHistoryItems = 8; // Limit the amount of Recent search items

        if (storedHistory.length >= maxHistoryItems) {
            storedHistory.shift();
        }

        storedHistory = [...storedHistory, historyText];
        localStorage.setItem('history', JSON.stringify(storedHistory));

        renderHistory();
    };

    function renderHistory() {
        historyEl.innerHTML = '';

        var storedHistory = JSON.parse(localStorage.getItem('history')) || [];
        //render a button for each recent search
        for (var i = 0; i < storedHistory.length; i++) {
            var historyBtn = document.createElement('button');
            historyBtn.textContent = storedHistory[i];
            historyBtn.setAttribute('class', 'row historyBtn')
            historyBtn.setAttribute('data-index', i);

            historyBtn.addEventListener('click', function (event) {
                var index = event.target.getAttribute('data-index');
                var cityName = storedHistory[index];
                console.log('cityname:', cityName);
                fetchWeatherByCity(cityName);
            })

            historyEl.appendChild(historyBtn);
        }
    };
    
    function fetchWeatherByCity(cityName) {
        var geocodeUrl = `${baseUrl}${geocodeStr}q=${cityName}&appId=${apiKey}`;
    
        fetch(geocodeUrl)
            .then(function (response) {
                if (response.ok) {
                    console.log(response);
                    return response.json();
                } else {
                    alert(`Error: ${response.statusText}`);
                }
            })
            .then(function (data) {
                // Move the city to the top of the history array
                moveCityToTop(cityName);
                getLocation(cityName);
                getDaysForecast(data);
            })
            // .catch(function (error) {
            //     alert('Unable to connect to OpenWeatherMap - fetch WeatherByCity');
            //     console.error('error from byCity: ' + error);
            // });
    };
    
    function moveCityToTop(cityName) {
        var storedHistory = JSON.parse(localStorage.getItem('history')) || [];
        var index = storedHistory.indexOf(cityName);
    
        if (index !== -1) {
            // Remove the city from its current position
            storedHistory.splice(index, 1);
            // Add the city to the top of the array
            storedHistory.unshift(cityName);
            // Update the history in local storage
            localStorage.setItem('history', JSON.stringify(storedHistory));
            // Render the updated history
            renderHistory();
        }
    };

    function init() {
        var storedHistory = JSON.parse(localStorage.getItem('history')) || [];

        if (storedHistory !== null) {
            history = storedHistory;
        }
        renderHistory();
    };

    // Weather API
    $(btnEl).on('click', function (event) {
        event.preventDefault();
        getLocation();
        var historyText = userInputEl.value.trim();
        if (historyText !== '') {
            userInputEl.value = '';
            storeHistory(historyText);
        }
    });

    //History Button listener
    $(historyBtnEl).on('click', function (event) {
        var element = event.target;

        if ($(element).matches('.historyBtn')) {
            var index = $(element).getAttribute('data-index');
            var storedHistory = JSON.parse(localStorage.getItem('history'));
            storedHistory.splice(index, 1);
            localStorage.setItem('history', JSON.stringify(storedHistory));

            renderHistory();
        }
    });

    init();
    setInterval(updateClock, 1000);
});
