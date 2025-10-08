const cityInput = document.querySelector("input");
const searchBtn = document.querySelector(".search-btn");

const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".weather-info");

const countryTxt = document.querySelector(".country-text");
const  tempTxt = document.querySelector(".temp-txt");
const  conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-txt");
const windValueTxt = document.querySelector(".wind-value-txt");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const currentDateTxt = document.querySelector(".current-date-txt");

const forecastItemsContainer = document.querySelector(".forecast-items-container");

const apiKey = "57cc8a074cbe22c08fb071c3fc782a81"

searchBtn.addEventListener("click", () => {
    if(cityInput.value.trim() !="") {
        updateWeatherInfo(cityInput.value)
        cityInput.value = "";
        cityInput.blur();

    } 
});
cityInput.addEventListener("keydown", (e) => {
    if(e.key == "Enter" && 
        cityInput.value.trim() != ""
    ) {
        updateWeatherInfo(cityInput.value)
        cityInput.value = "";
        cityInput.blur();
        
    }
});

async function getFetchData(endpoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl)

    return response.json();
}
function getWeatherIcon(id) {
    if (id <= 232) return "thunderstorm.svg"
    if (id <= 321) return "drizzle.svg"
    if (id <= 531) return "rain.svg"
    if (id <= 622) return "snow.svg"
    if (id <= 781) return "mist.svg"
    if (id <= 800) return "clear.svg"
    else return "cloudy.svg"
  
}

function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit', 
        month: 'short'
         
    }
    return currentDate.toLocaleDateString("en-US", options);
}
    
    
 
async function updateWeatherInfo(city) {
    const weatherData = await getFetchData("weather", city);

    if(weatherData.cod != "200") {
        showDisplaySection(notFoundSection);
        return;
    }
    console.log(weatherData);

    const {
        name: country,
        main: { temp, humidity },
        weather: [{id, main}],
        wind: { speed },
    } = weatherData;

    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + '°C' 
    conditionTxt.textContent = main  
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + 'M/s'

    currentDateTxt.textContent = getCurrentDate();
    weatherSummaryImg.src = `./images/${getWeatherIcon(id)}`;
    
    await updateForecastInfo(city)
    showDisplaySection(weatherInfoSection);
}
async function updateForecastInfo(city) {
    const forecastData = await getFetchData("forecast", city);
    
    const timeTaken = "12:00:00";
    const todayDate = new Date().toISOString().split("T")[0];
    
    forecastItemsContainer.innerHTML = ""
    forecastData.list.forEach(forecastWeather => {
        if (
            forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)
        ) {
            updateForecastItem(forecastWeather);
        }
    })
}

function updateForecastItem(weatherData) {
    console.log(weatherData);
    const {
        dt_txt: date,
        main: { temp  },
        weather: [{ id, main }],
    } = weatherData

    const dateTaken = new Date(date)
    const dateOptions = {
        day: '2-digit', 
        month: 'short' 
    }
    const dataResult = dateTaken.toLocaleDateString("en-US", dateOptions);


    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dataResult}</h5>
            <img src="./images/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `

    forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);


   
}

function showDisplaySection(section) {
    [weatherInfoSection, notFoundSection, searchCitySection]
       .forEach( section => section.style.display = "none");

    section.style.display = "flex";
}