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
const todaysDate = new Date();
let weatherObj = {
  1:{
    "high" : [],
    "low" : [],
  },
  2:{
    "high" : [],
    "low" : [],
  },
  3:{
    "high" : [],
    "low" : [],
  },
  4:{
    "high" : [],
    "low" : [],
  },
  5:{
    "high" : [],
    "low" : [],
  }
};

function getCurrentPosition() {
  geo.getCurrentPosition((currLocation)=> {
    findCurrentWeather(currLocation.coords.latitude, currLocation.coords.longitude);
    findWeatherForecast(currLocation.coords.latitude, currLocation.coords.longitude);
  },
  (error) => {
    console.log(error);
  });
}

function findCurrentWeather(lat,long) {
  fetch(`${baseUrl}weather?lat=${lat}&lon=${long}&units=metric&${apikey}`)
    .then((data) => data.json())
    .then((weatherResp) => {
      printCurrentWeather(weatherResp)
    })
}

function printCurrentWeather(weatherResp) {
  currentConditionsEle.innerHTML = "";
  currentConditionsEle.insertAdjacentHTML('beforeend', 
  `<h2>Current Conditions</h2>
  <img src="http://openweathermap.org/img/wn/${weatherResp.weather[0].icon}@2x.png" />
  <div class="current">
    <div class="temp">${Math.floor(weatherResp.main.temp)}℃</div>
    <div class="condition">${weatherResp.weather[0].description}</div>
  </div>`)
}

function findWeatherForecast(lat,long) {
  fetch(`${baseUrl}forecast?lat=${lat}&lon=${long}&units=metric&${apikey}`)
  .then((data) => data.json())
  .then((weatherResp) => {
    collectForecastedWeatherData(weatherResp);
    printForecastWeatherData();
    
  })
}

function collectForecastedWeatherData(weather) {
  weather.list.forEach(weatherInfo=> {
    const currentDate = new Date(weatherInfo.dt_txt)
    const difference = Math.ceil(currentDate.getDate() - todaysDate.getDate())

    console.log(Math.ceil(currentDate.getDate() - todaysDate.getDate()))
    if(weatherObj[difference] !== undefined) {
      weatherObj[difference]["day"] = currentDate.getDay();
      weatherObj[difference]["low"].push(Math.floor(weatherInfo.main.temp_min))
      weatherObj[difference]["high"].push(Math.floor(weatherInfo.main.temp_max))
      if(currentDate.getHours() === 12) {
        weatherObj[difference]["icon"] = weatherInfo.weather[0].icon
        weatherObj[difference]["description"] = weatherInfo.weather[0].description
      }
    }
  }) 
}

function printForecastWeatherData() {
  forecastEle.innerHTML = "";
  for(let weatherData in weatherObj) {
    let day="";
    const data = weatherObj[weatherData];
    switch (data.day) {
      case 0:
        day = "Sunday";
        break;
      case 1:
        day = "Monday";
        break;
      case 2:
         day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
    }
    forecastEle.insertAdjacentHTML('beforeend', 
    `<div class="day">
    <h3>${day}</h3>
    <img src="http://openweathermap.org/img/wn/${data.icon}@2x.png" />
    <div class="description">${data.description}</div>
    <div class="temp">
      <span class="high">${Math.max(...data["high"])}℃</span>/<span class="low">${Math.min(...data["low"])}℃</span>
    </div>
  </div>`)

  }
}

getCurrentPosition();