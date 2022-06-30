const express = require('express');
const path = require('path');
var compress = require('compression');
var bodyParser = require('body-parser');
const axios = require('axios');
const json = require('body-parser/lib/types/json');

// Configure dotenv package
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;
//const port = 9000;

// create application/json parser
//var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//gzip compression
app.use(compress());

//Express static file module
app.use(express.static(__dirname + '/assets'));


const apikey = "3b39382c30c048cc84c327275897c841";

// webWorker
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/index', function (req, res) {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});


app.post('/city_name_weather', urlencodedParser, function(req, res) {
    let city = req.body.city;
    axios.get('http://api.openweathermap.org/geo/1.0/direct?q='+ city +'&limit=1&appid=' + apikey)
    .then(axios_res => {
        let lat = axios_res.data[0].lat;
        let lon = axios_res.data[0].lon;
        axios.get('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apikey + '&units=metric&lang=it')
        .then(axios_res => {
            res.json(axios_res.data);
        })
        .catch(error => {
            //la richiesta api (con le coordinate) ha dato esito negativo
            res.status(500).send({errore: "meteo lon, lat", message: error.data});
        });
        
    })
    .catch(error => {
        //la richiesta api (ricerca città) ha dato esito negativo
        res.status(500).send({errore: "ricerca città", message: error.data});
        
    });
    
    
});

app.post('/lon_lat_weather', urlencodedParser, function(req, res) {
    let lat = req.body.lat;
    let lon = req.body.lon;
    axios.get('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apikey + '&units=metric&lang=it')
    .then(axios_res => {
        res.json(axios_res.data);
    })
    .catch(error => {
        res.status(500).send(JSON.stringify({errore_api_weather: error.data}));
    });

});

app.listen(port);
console.log('Server started at http://localhost:' + port);