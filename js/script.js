let weatherIcons = {}

fetch("./js/icons.json")
	.then(response => {
		return response.json();
	}).then(data => {
		weatherIcons = data;
	});

const cityLocation = document.getElementById("location");
const time = document.getElementById("time");
const weatherIcon = document.getElementById("weather-icon");
const weatherCondition = document.getElementById("weather-condition");
const wind = document.getElementById("wind");
const precipitation = document.getElementById("precipitation");
const sunlight = document.getElementById("sunlight");
const temperature = document.getElementById("temperature");

function getWeather() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getWeatherData);
	} else {
		console.log("Geolocation is not supported by this browser.");
	}
}

const getWeatherData = async (position) => {
	try {
		const config = {
			params: {
				lat: position.coords.latitude,
				lon: position.coords.longitude,
				units: "imperial",
				appid: appID
			}
		};
		const res = await axios.get("https://api.openweathermap.org/data/2.5/weather", config);
		console.log(res.request.response);
		showWeather(JSON.parse(res.request.response));
	} catch (e) {
		return "No weather data";
	}
}

function showWeather(res) {
	let currentTime = new Date(res.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
	let sunlightTime = Math.abs((res.sys.sunset - res.sys.sunrise) / 3600).toFixed(1);

	let prefix = 'wi wi-';
	let code = res.weather[0].id;
	let icon = weatherIcons[code].icon;

	// If we are not in the ranges mentioned above, add a day/night prefix.
	if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
		icon = 'day-' + icon;
	}

	// Finally tack on the prefix.
	icon = prefix + icon;

	cityLocation.innerHTML = res.name;
	time.innerHTML = currentTime;
	weatherIcon.className = icon;
	weatherCondition.innerHTML = `${res.weather[0].main} - ${res.weather[0].description}`;
	wind.innerHTML = Math.round(res.wind.speed) + " MPH" + ` <i class="wi wi-wind towards-${res.wind.deg}-deg"></i>`;
	precipitation.innerHTML = (res.rain ? res.rain["1h"] : 0) + "%";
	sunlight.innerHTML = sunlightTime;
	temperature.innerHTML = res.main.temp.toFixed(0) + "&#176;F";
}

window.onload = function () {
	console.log('pages is loaded');
	getWeather();
}