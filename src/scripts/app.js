const apikey = "appid=3dcadafeade3c14467c5e00cecb41843";
const baseUrl = "https://api.openweathermap.org/data/2.5/";
const currentConditionsEle = document.querySelector('.current-conditions');
const forecastEle = document.querySelector('.forecast');
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

function printWeatherForCurrentPosition() {
  const geo = navigator.geolocation;
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
    <div class="temp">${Math.round(weatherResp.main.temp)}℃</div>
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

function getDaysDiff(d1, d2) {
  return Math.floor((Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate()) - Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate()) ) /(1000 * 60 * 60 * 24) );
} 

function collectForecastedWeatherData(weatherResp) {
  weatherResp.list.forEach(weatherInfo=> {
    const nextDate = new Date(weatherInfo.dt_txt);
    const difference = getDaysDiff(nextDate, todaysDate)
    if(weatherObj[difference] !== undefined) {
      weatherObj[difference]["day"] = nextDate.toLocaleString('en-us', {weekday: 'long'});
      weatherObj[difference]["low"].push(Math.round(weatherInfo.main.temp_min))
      weatherObj[difference]["high"].push(Math.round(weatherInfo.main.temp_max))
      if(nextDate.getHours() === 12) {
        weatherObj[difference]["icon"] = weatherInfo.weather[0].icon
        weatherObj[difference]["description"] = weatherInfo.weather[0].description
      }
    }
  }) 
}

function printForecastWeatherData() {
  forecastEle.innerHTML = "";
  for(let weatherData in weatherObj) {
    const data = weatherObj[weatherData];
    forecastEle.insertAdjacentHTML('beforeend', 
    `<div class="day">
    <h3>${data.day}</h3>
    <img src="http://openweathermap.org/img/wn/${data.icon}@2x.png" />
    <div class="description">${data.description}</div>
    <div class="temp">
      <span class="high">${Math.max(...data["high"])}℃</span>/<span class="low">${Math.min(...data["low"])}℃</span>
    </div>
  </div>`)
  }
}

printWeatherForCurrentPosition();