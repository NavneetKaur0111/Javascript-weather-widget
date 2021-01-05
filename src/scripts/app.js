//navigator.geolocation.getcurrentPosition(success, error);
//gives the long and latitude

//returns current weather conditions
//https://api.openweathermap.org/data/2.5/weather?lat=49.785175&lon=-97.169907&units=metric&appid=3dcadafeade3c14467c5e00cecb41843

//https://api.openweathermap.org/data/2.5/forecast?lat=49.785175&lon=-97.169907&units=metric&appid=3dcadafeade3c14467c5e00cecb41843
//gets weather forecast for next 5 days

const apikey = "appid=3dcadafeade3c14467c5e00cecb41843";
const baseUrl = "https://api.openweathermap.org/data/2.5/";
const currentConditionsEle = document.querySelector('.current-conditions');
const forecastEle = document.querySelector('.forecast');
const geo = navigator.geolocation;

function getCurrentPosition() {
  geo.getCurrentPosition((currLocation)=> {
    findCurrentWeather(currLocation.coords.latitude, currLocation.coords.longitude)
  },
  (error) => {
    console.log(error);
  });
}

function findCurrentWeather(lat,long) {
  fetch(`${baseUrl}weather?lat=${lat}&lon=${long}&units=metric&${apikey}`)
    .then((data) => data.json())
    .then((weather) => {
      printCurrentWeather(weather)
    })
}

function printCurrentWeather(weather) {
  currentConditionsEle.innerHTML = "";
  currentConditionsEle.insertAdjacentHTML('beforeend', 
  `<h2>Current Conditions</h2>
  <img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" />
  <div class="current">
    <div class="temp">${weather.main.temp}℃</div>
    <div class="condition">${weather.weather[0].description}</div>
  </div>`)
}

getCurrentPosition();