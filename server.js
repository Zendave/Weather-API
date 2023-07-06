const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const app = express();

// Configure dotenv package
require("dotenv").config();

// Setup OpenWeatherMap API key
const apiKey = process.env.API_KEY;

// Setup Express app
app.use(express.static("public"));
// Setup body parser configurations.
app.use(bodyParser.urlencoded({ extended: true }));
// Setup EJS template view engine
app.set("view engine", "ejs");

// Setup default display on launch
app.get("/", function (req, res) {
  res.render("index", { weather: null, error: null });
});

// Handle post request to fetch data from OpenWeatherMap
app.post("/", function (req, res) {
  // Get the city name
  let city = req.body.city;
  // Use the city name to fetch data using the API key from .env file
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  // Request data from the API
  request(url, function (err, response, body) {
    // Check for errors
    if (err) {
      res.render("index", { weather: null, error: "Error! Please try again." });
    } else {
      let weather = JSON.parse(body);
      console.log(weather);

      if (weather.main === undefined) {
        res.render("index", { weather: null, error: "Error! Please try again." });
      } else {
        // Extract the required data
        let place = `${weather.name}, ${weather.sys.country}`;
        let weatherTimezone = new Date(
          (weather.dt + weather.timezone) * 1000
        ).toUTCString();
        let weatherTemp = weather.main.temp;
        let weatherPressure = weather.main.pressure;
        let weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
        let weatherDescription = weather.weather[0].description;
        let humidity = weather.main.humidity;
        let clouds = weather.clouds.all;
        let visibility = weather.visibility;
        let main = weather.weather[0].main;
        let weatherFahrenheit = (weatherTemp * 9) / 5 + 32;
        weatherFahrenheit = Math.round(weatherFahrenheit * 100) / 100;

        // Render the data to the page (index.ejs)
        res.render("index", {
          weather: weather,
          place: place,
          temp: weatherTemp,
          pressure: weatherPressure,
          icon: weatherIcon,
          description: weatherDescription,
          timezone: weatherTimezone,
          humidity: humidity,
          fahrenheit: weatherFahrenheit,
          clouds: clouds,
          visibility: visibility,
          main: main,
          error: null,
        });
      }
    }
  });
});

app.listen(5200, function () {
  console.log("Weather app listening on port 5200!");
});
