document.getElementById('getWeather').addEventListener('click', function() {
    const location = document.getElementById('location').value.trim();
    if (location) {
        getWeather(location);
    } else {
        alert('Please enter a valid location.');
    }
});

document.getElementById('useGeolocation').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByCoords(lat, lon);
        }, () => {
            alert('Geolocation is not enabled.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

function getWeather(location) {
    const apiKey = '5d29cfd6db3645aa9dd0edac00021139';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    showSpinner();

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            hideSpinner();
            if (data.cod === 200) {
                displayWeather(data);
                getForecast(data.coord.lat, data.coord.lon);
            } else {
                document.getElementById('weatherResult').innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => {
            hideSpinner();
            console.error('Error fetching weather data:', error);
            document.getElementById('weatherResult').innerHTML = '<p>Error fetching weather data. Please try again later.</p>';
        });
}

function getWeatherByCoords(lat, lon) {
    const apiKey = '5d29cfd6db3645aa9dd0edac00021139';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    showSpinner();

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            hideSpinner();
            if (data.cod === 200) {
                displayWeather(data);
                getForecast(lat, lon);
            } else {
                document.getElementById('weatherResult').innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => {
            hideSpinner();
            console.error('Error fetching weather data:', error);
            document.getElementById('weatherResult').innerHTML = '<p>Error fetching weather data. Please try again later.</p>';
        });
}

function displayWeather(data) {
    const weatherInfo = `
        <p><strong>Location:</strong> ${data.name}, ${data.sys.country}</p>
        <p><strong>Temperature:</strong> <span id="temp">${data.main.temp}</span> °C <button id="toggleTemp">°F</button></p>
        <p><strong>Weather:</strong> ${data.weather[0].description} <img class="weather-icon" src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" /></p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    `;
    document.getElementById('weatherResult').innerHTML = weatherInfo;

    document.getElementById('toggleTemp').addEventListener('click', function() {
        toggleTemperature(data.main.temp);
    });

    changeBackground(data.weather[0].main);
}

function getForecast(lat, lon) {
    const apiKey = '5d29cfd6db3645aa9dd0edac00021139';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                displayForecast(data);
            } else {
                document.getElementById('forecastResult').innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            document.getElementById('forecastResult').innerHTML = '<p>Error fetching forecast data. Please try again later.</p>';
        });
}

function displayForecast(data) {
    let forecastInfo = '';
    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        forecastInfo += `
            <div>
                <p><strong>${new Date(day.dt_txt).toDateString()}</strong></p>
                <p>Temp: ${day.main.temp} °C</p>
                <p>${day.weather[0].description} <img class="weather-icon" src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" /></p>
            </div>
        `;
    }
    document.getElementById('forecastResult').innerHTML = forecastInfo;
}

function toggleTemperature(celsius) {
    const tempElement = document.getElementById('temp');
    const currentTemp = tempElement.innerText;
    if (currentTemp.endsWith('C')) {
        const fahrenheit = (celsius * 9/5) + 32;
        tempElement.innerText = `${fahrenheit.toFixed(1)} °F`;
    } else {
        tempElement.innerText = `${celsius} °C`;
    }
}

function changeBackground(weather) {
    const weatherConditions = {
        Clear: '#FFD700',
        Rain: '#87CEEB',
        Clouds: '#B0C4DE',
        Snow: '#FFFFFF',
        Thunderstorm: '#778899',
        Drizzle: '#4682B4',
        Mist: '#F5F5F5'
    };
    document.body.style.backgroundColor = weatherConditions[weather] || '#f0f0f0';
}

function showSpinner() {
    document.getElementById('weatherResult').innerHTML = '<div class="spinner"></div>';
}

function hideSpinner() {
    document.querySelector('.spinner')?.remove();
}
