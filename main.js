const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weatherIcon');
const recycling = document.getElementById('recycling');
const kidsActivities = document.getElementById('kidsActivities');

/**
 * Make an HTTP request for the given URL.
 * @param {string} url 
 */
async function logFetch(url) {
    try {
        const response = await fetch(url);
        return response.json();
    }
    catch (err) {
        console.log('fetch failed', err);
    }
}

/**
 * Get and display kids activities for the day.
 */
async function getKidsActivities() {
    const activitiesResult = await logFetch('activities.json');
    
    if (activitiesResult && activitiesResult.activities) {
        let activitiesHtml = "<strong>Today's Activities</strong><ul>";
        
        // Display up to 5 random activities
        const shuffled = activitiesResult.activities.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        
        selected.forEach(activity => {
            activitiesHtml += `<li>${activity}</li>`;
        });
        
        activitiesHtml += "</ul>";
        kidsActivities.innerHTML = activitiesHtml;
    }
}

/**
 * Mapped according to the codes on openweather map
 * https://openweathermap.org/weather-conditions
 * @param {int} weatherId 
 */
function mapWeatherIcon(weatherId) {
    if (weatherId >= 200 && weatherId <= 232) {
        return "<img src='img/weather/thunderstorm.svg' width='100px'>";
    } else if (weatherId >= 300 && weatherId <= 321) {
        return "<img src='img/weather/heavy-rain.svg' width='100px'>";
    } else if (weatherId >= 500 && weatherId <= 531) {
        return "<img src='img/weather/light-rain.svg' width='100px'>";
    } else if (weatherId >= 600 && weatherId <= 622) {
        return "<img src='img/weather/snow.svg' width='100px'>";
    } else if (weatherId === 800) {
        return "<img src='img/weather/clear.svg' width='100px'>";
    } else if (weatherId >= 801 && weatherId <= 804) {
        return "<img src='img/weather/cloud.svg' width='100px'>";
    } else {
        return "<img src='img/weather/clear.svg' width='100px'>";
    }
}

/**
 * Get the current weather for my location.
 * Uses https://openweathermap.org/current
 */
async function getWeatherDetails() {

    // Hit the weather API - for Totnes, UK
    const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=totnes,uk&APPID=1683b9c2231b220ff03ebe900e6ccdc0&units=metric';
    const weatherResult = await logFetch(weatherApiUrl);

    // Update the temp
    const weatherTemperature = weatherResult.main.temp;
    temperature.innerHTML = weatherTemperature + ' ° C';
   
    // Update the icon
    weatherIcon.innerHTML = mapWeatherIcon(weatherResult.weather[0].id);
}

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    var today = new Date(this.getFullYear(),this.getMonth(),this.getDate());
    var dayOfYear = ((today - onejan + 86400000)/86400000);
    return Math.ceil(dayOfYear/7)
  };

/**
 * Determines the type of bin collection for this week.
 */
function determineBinCollection(){
    const today = new Date();

    // Every even week is rubbish
    if (today.getWeek() % 2 ==0){
        recycling.innerHTML = "<img src='img/trash.svg' width='70px'><br>Rubbish collection week<br>& Garden Waste collection week";
    } else {
        // every odd week is recycling
        recycling.innerHTML = "<img src='img/trash.svg' width='70px'><br>Recycling collection week";
    }
}

/**
 * Initialise.
 */
function init() {
    getWeatherDetails();
    determineBinCollection();
    getKidsActivities();
}

init();
setInterval(init, 60000); // reload every minute