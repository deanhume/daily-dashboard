const trainTime = document.getElementById('trainTime');
const onTime = document.getElementById('onTime');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weatherIcon');

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
 * Checks the time of day and returns the 
 * appropriate URL to hit based on train station.
 */
function buildTrainApiURl() {
    const currentdate = new Date();

    if (currentdate.getHours() > 13) {
        return 'https://huxley.apphb.com/delays/gld/30?accessToken=b09cb836-f190-445d-8b96-372eb024141d&expand=true';
    } else {
        return 'https://huxley.apphb.com/delays/wby/30?accessToken=b09cb836-f190-445d-8b96-372eb024141d&expand=true';
    }

}

/**
 * Checks the time of day and
 * returns the appropriate station.
 */
function chooseCorrectStation() {
    const currentdate = new Date();

    // If we are in the afternoon look for return trip to Woking
    if (currentdate.getHours() > 13) {
        return 'Woking';
    } else {
        return 'Guildford';
    }

}

/**
 * Get the details of the next train.
 */
async function getTrainDetails() {

    // Hit the train API
    const trainApiUrl = buildTrainApiURl();
    const trainResult = await logFetch(trainApiUrl);

    // Loop & sort through the results
    if (trainResult.trainServices && trainResult.trainServices.length > 0) {

        // Loop through the results
        for (i = 0; i < trainResult.trainServices.length; i++) {

            // We've got a hit, return immediately.
            if (trainResult.trainServices[i].subsequentCallingPoints == null) {
                trainTime.innerHTML = trainResult.trainServices[i].sta + " to " + chooseCorrectStation() + "<br>" + trainResult.trainServices[i].eta;
            } else {
                // Loop through the subsequent calling points
                for (y = 0; y < trainResult.trainServices[i].subsequentCallingPoints[0].callingPoint.length; y++) {

                    if (trainResult.trainServices[i].subsequentCallingPoints[0].callingPoint[y].locationName === chooseCorrectStation()) {
                        trainTime.innerHTML = trainResult.trainServices[i].std + " to " + chooseCorrectStation() + "<br>" + trainResult.trainServices[i].eta;
                    }
                }
            }
        }
    }
}

/**
 * Mapped according to the codes on openweather map
 * https://openweathermap.org/weather-conditions
 * @param {int} weatherId 
 */
function mapWeatherIcon(weatherId) {
    if (weatherId >= 200 && weatherId <= 232) {
        return "<img src='img/weather/thunderstorm.svg' width='200px'>";
    } else if (weatherId >= 300 && weatherId <= 321) {
        return "<img src='img/weather/heavy-rain.svg' width='200px'>";
    } else if (weatherId >= 500 && weatherId <= 531) {
        return "<img src='img/weather/light-rain.svg' width='200px'>";
    } else if (weatherId >= 600 && weatherId <= 622) {
        return "<img src='img/weather/snow.svg' width='200px'>";
    } else if (weatherId === 800) {
        return "<img src='img/weather/clear.svg' width='200px'>";
    } else if (weatherId >= 801 && weatherId <= 804) {
        return "<img src='img/weather/cloud.svg' width='200px'>";
    } else {
        return "<img src='img/weather/clear.svg' width='200px'>";
    }
}

/**
 * Get the current weather for my location.
 * Uses https://openweathermap.org/current
 */
async function getWeatherDetails() {

    // Hit the weather API
    const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/forecast/daily?q=west%20byfleet&units=metric&cnt=1&appid=d94bcd435b62a031771c35633f9f310a';
    const weatherResult = await logFetch(weatherApiUrl);

    // Update the temp
    const weatherTemperature = weatherResult.list[0].temp;
    temperature.innerHTML = weatherTemperature.day + ' ° C';

    // Update the icon
    weatherIcon.innerHTML = mapWeatherIcon(weatherResult.list[0].weather[0].id);
}

/**
 * Initialise.
 */
function init() {
    getTrainDetails();
    getWeatherDetails();
}

init();