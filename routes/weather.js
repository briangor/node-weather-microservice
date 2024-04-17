const express = require("express");
const https = require("https");

const weatherRoute = express.Router();

weatherRoute.get("/", (req, res) => {
    res.sendFile(__dirname, + "index.html");
});

weatherRoute.post("/", (req, res) => {
    const city = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const unit = req.body.unit || "metric";

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=" + unit + "";

    https.get(url, (result) => {
        result.on("data", (chunk) => {
            const responseData = JSON.parse(chunk);
            const temperature = responseData.main.temp;
            const weatherDes = responseData.weather[0].description;
            const icon = responseData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            const cityName = responseData.name;

            // console.log(responseData);

            res.write(`
            <h1>A basic Weather app microservice</h1>
            <p>Enter your details to get weather info</p>
            <form action="/weather" method="post">
                <label for="ityInput"> City name:</label>
                <input type="text" name="cityName" placeholder="Enter name of your city" id="cityInput">
                <label for="unitInput">Unit</label>
                <input type="text" name="unit" placeholder="Enter unit e.g. metric" id="unitInput">
                <button type="submit">submit</button>
            </form>
            `);
            res.write(`<h1>The weather is ${temperature} degree celsius in ${city}</h1>`);
            res.write("<img src=" + imageURL + ">");
            res.send();

        })
    })
})

module.exports = weatherRoute;