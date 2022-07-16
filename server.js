const express = require('express');
const path = require('path');
var compress = require('compression');
var bodyParser = require('body-parser');
const axios = require('axios');
const json = require('body-parser/lib/types/json');
const MongoClient = require("mongodb").MongoClient;
const schedule = require('node-schedule');
const send_email = require('./newsletter_email_sender/send_mail');
const ejs = require("ejs");
const email_validator = require('./assets/js/email_validator').validateEmail;

// Configure dotenv package
require("dotenv").config();

const mongo_db_url = process.env.mongo_db_url;

const app = express();
const port = process.env.PORT || 8080;

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//gzip compression
app.use(compress());

//Express static file module
app.use(express.static(__dirname + '/assets'));

app.set('view engine', 'ejs');


const apikey = "3b39382c30c048cc84c327275897c841";


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/index', function (req, res) {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});


app.post('/city_name_weather', urlencodedParser, function(req, res) {
    let city = req.body.city;
    axios.get('https://api.openweathermap.org/geo/1.0/direct?q='+ city +'&limit=1&appid=' + apikey)
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





app.post('/subscribe_to_newsletter', urlencodedParser, function(req, res) {
    let email = req.body.email;
    let city = req.body.city;

    if(!email_validator.validate(email)){
        res.render("subscribed_newsletter", {img_src: "not_ok", titolo:"Non è stato possibile registrarti", messaggio:"La email inserita non è una vera email"})
        return;
    }


    MongoClient.connect(
        mongo_db_url,
        
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, 
        
        (err, client) => {
            if(err) {
                res.render("subscribed_newsletter", {img_src: "not_ok", titolo:"Non è stato possibile registrarti", messaggio:"Errore durante la connessione al database"})
            }else{
                const db = client.db(process.env.db_name);
                const city_email_collection = db.collection("city_email");

                city_email_collection.findOne({email: email, city:city}, (err, result) =>{
                    if(err){
                        res.render("subscribed_newsletter", {img_src: "not_ok", titolo:"Non è stato possibile registrarti", messaggio:"Errore della collection"})
                    }else{
                        if(!result){
                            city_email_collection.insertOne({email: email, city: city}, (err, result) => {})
                            res.render("subscribed_newsletter", {img_src: "ok", titolo:"Email registrata con successo", messaggio:"Da oggi riceverai ogni mattina una email con il meteo di " + city})
                        }else{
                            res.render("subscribed_newsletter", {img_src: "ok", titolo:"La tua email è già registrata", messaggio:"Dovresti già ricevere le email inerenti al meteo di " + city})
                        }
                    }

                })
            }
        }
    )
});


var mailOptions = {
    from: 'iodbsdfhsrhn@zohomail.eu',
    to: "",
    subject: 'Cloudy: il meteo di oggi',
    html: ''
};



const job = schedule.scheduleJob('0 0 13 * * *', function(){       
    
    console.log("news_letter job started");

    MongoClient.connect(
        mongo_db_url,
        
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, 
        
        (err, client) => {
            if(err) {
                console.log("scheduled job - db conection error: \n" + Json.stringify(err));
                return 
            }else{
                const db = client.db(process.env.db_name);
                const city_email_collection = db.collection("city_email");
                //city_email_collection.deleteMany({})
                
                city_email_collection.find().sort( { city: 1 } ).toArray((err,result) => {

                    //console.log(result)
                    let old_city = null;
                    let html_rendered;
                    let weather_data;                 
                    
                    error=false;

                    (async () =>{
                        for(let i=0; i<result.length; i++){

                            let current_city=result[i].city
                            if(current_city != old_city){
                                if(error)
                                    error=false;

                                try{
                            
                                    let long_lat_res = await axios.get('http://api.openweathermap.org/geo/1.0/direct?q='+ current_city +'&limit=1&appid=' + apikey)
                                    weather_data = await axios.get('https://api.openweathermap.org/data/2.5/forecast?lat=' + long_lat_res.data[0].lat + '&lon=' + long_lat_res.data[0].lon + '&appid=' + apikey + '&units=metric&lang=it')
                                
                                }catch(err){
                                    console.log("scheduled job - get api data error: " + JSON.stringify(err));
                                    error=true;
                                }

                                if(!error){
                                    //offset used for debug
                                    let offset=0   
                                    let dati = {
                                        
                                        temp_mattina: Math.round(weather_data.data.list[2 + offset].main.temp),
                                        temp_pome: Math.round(weather_data.data.list[4 + offset].main.temp),
                                        temp_sera: Math.round(weather_data.data.list[6 + offset].main.temp),
                                        desc_mattina: weather_data.data.list[2 + offset].weather[0].description,
                                        desc_pome: weather_data.data.list[4 + offset].weather[0].description,
                                        desc_sera: weather_data.data.list[6 + offset].weather[0].description,
                                        citta: current_city
                
                                    };   
                                    try{
                                        html_rendered = await ejs.renderFile(path.join(__dirname, '/views/email_template.ejs'), dati)
                                    }catch(err){
                                        console.log("scheduled job - html render error: " + JSON.stringify(err));
                                        error=true; 
                                    }

                                }
                            }

                            if(!error){
                                mailOptions.to = result[i].email
                                mailOptions.html = html_rendered
                            
                                send_email.sendMail(mailOptions).then(result =>{
                                    console.log("mail sent to: " + result.accepted[0])
                                }).catch(err=>{
                                    console.log("mail error: " + JSON.stringify(err))
                                })                                
                            }
                            old_city=current_city;  
                        }  

                    })();
                });
                
                
            }
        } 
    )
});

app.get('/mail', function (req, res) {
    res.sendFile(path.join(__dirname, '/views/email_template.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);