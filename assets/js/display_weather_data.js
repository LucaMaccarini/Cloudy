
const api_data_parser = new Worker('js/workers/api_data_parser.js')
const forecast_buttons = document.getElementsByClassName("forecast");
const corpo_tabella_dati = document.getElementById("tabella_dati").getElementsByTagName('tbody')[0];

var parsed_data;

function parse_api_data(data){
    api_data_parser.postMessage(data);
}

var first=true;
api_data_parser.onmessage = function(e){
    parsed_data=e.data;
    update_forecast_buttons_data();
    update_table(0);
    update_footer();

    if(first){
        show_forecast_table_and_footer();
        first=false;
    }
}

function update_footer(){
    document.getElementById("footer_city").textContent = parsed_data.citta;
    update_newsletter_subscription_city();

    document.getElementById("iscriviti-button").addEventListener("click", function() {
        let email = document.getElementById("email-input").value
        if(validateEmail.validate(email)){
            document.getElementById("newsletter-form").submit();
        }else{
            alert("la email inserita non corrisponde ad una email realmente esistente");
        }
    });
    
}

function update_newsletter_subscription_city(){
    document.getElementById("footer_city-input").value = parsed_data.citta;
}

var selected_forecast=0;

function update_forecast_buttons_data(){
    let div_geolocation = document.getElementById("div-for-geolocation-denied");
    if(!div_geolocation.classList.contains("no-display")){
        div_geolocation.classList.add("no-display")
    }
    
    let data_e_media_temperature=parsed_data.giorno_media;
   
    forecast_buttons[0].getElementsByClassName("info_temp")[0].textContent="Temperatura media (tra le ore: " + data_e_media_temperature[0].data.ora +":00 - 23:00)";
    for(let i=0; i<data_e_media_temperature.length; i++){
        forecast_buttons[i].getElementsByClassName("day")[0].textContent=data_e_media_temperature[i].data.nome_giorno;
        forecast_buttons[i].getElementsByClassName("date")[0].textContent = data_e_media_temperature[i].data.giorno + " " + data_e_media_temperature[i].data.mese;
        forecast_buttons[i].getElementsByClassName("location")[0].textContent=parsed_data.citta;
        forecast_buttons[i].getElementsByClassName("num")[0].innerHTML=data_e_media_temperature[i].media_temp + "°C";

        let imageURL = "/images/icons/" + data_e_media_temperature[i].icona + ".svg";
        forecast_buttons[i].getElementsByClassName("forecast-icon-image")[0].setAttribute('data-src', imageURL);
        forecast_buttons[i].getElementsByClassName("forecast-icon-image")[1].setAttribute('data-src', imageURL);

        

    }

    load_images();

    if(selected_forecast != 0){
        forecast_buttons[selected_forecast].classList.remove("today");
        forecast_buttons[0].classList.add("today");
        selected_forecast=0;
    }

    if(data_e_media_temperature.length == 4){
        forecast_buttons[4].setAttribute("hidden", true);
    }

    update_newsletter_subscription_city()
}

var last_row_current_day;

function update_table(){
    let giorno_dati_meteo = parsed_data.giorno_dati_meteo;
    corpo_tabella_dati.innerHTML="";
    
    for(let j=0; j<giorno_dati_meteo.length; j++){
        for(let i=0; i<giorno_dati_meteo[j].dati_meteo.length; i++){
            let newRow = corpo_tabella_dati.insertRow(-1);
            newRow.insertCell(0).appendChild(document.createTextNode(giorno_dati_meteo[j].dati_meteo[i].ora + ":00"));
            newRow.insertCell(1).appendChild(document.createTextNode(giorno_dati_meteo[j].dati_meteo[i].temp));
            newRow.insertCell(2).appendChild(document.createTextNode(giorno_dati_meteo[j].dati_meteo[i].temp_percepita));
            newRow.insertCell(3).appendChild(document.createTextNode(giorno_dati_meteo[j].dati_meteo[i].temp_min));
            newRow.insertCell(4).appendChild(document.createTextNode(giorno_dati_meteo[j].dati_meteo[i].temp_max));
            
            let img = document.createElement('img');
            img.width=48;
            img.height=43;
            let imageURL = "/images/icons/" + giorno_dati_meteo[j].dati_meteo[i].icona + ".svg";
            img.src="data:,";
            //img.classList.add("show_after_load");
            img.setAttribute("data-src", imageURL);
            img.setAttribute("alt", giorno_dati_meteo[j].dati_meteo[i].descrizione_tempo);
            newRow.insertCell(5).appendChild(img);
            newRow.cells[5].classList.add("hide-text");

            newRow.insertCell(6).appendChild(document.createTextNode(giorno_dati_meteo[j].dati_meteo[i].descrizione_tempo));
            newRow.insertCell(7).appendChild(document.createTextNode(giorno_dati_meteo[j].dati_meteo[i].umidita));
            newRow.insertCell(8).appendChild(document.createTextNode(giorno_dati_meteo[j].dati_meteo[i].velocita_vento));

            if( j== 0 && i+1 >= giorno_dati_meteo[j].dati_meteo.length){
                last_row_current_day = i;
            }
        }

    }
    load_images();
    show_table_day(0);
}

const righe_di_un_giorno = 8;

function show_table_day(day){
    let righe = corpo_tabella_dati.rows;
    //alert(JSON.stringify(corpo_tabella_dati.rows[0].cells[0]));
    for(let i = 0; i< righe.length; i++){
        if(!righe[i].classList.contains("no-display"))
        righe[i].classList.add("no-display")
    }

    if(day == 0){
        for(let i = 0; i<= last_row_current_day; i++){
            righe[i].classList.remove("no-display")
        }
    }else{
        let offset = last_row_current_day + 1 + (day-1) * righe_di_un_giorno;
        for(let i = offset; i< offset + righe_di_un_giorno; i++){
            righe[i].classList.remove("no-display")
        }
    }
}

function show_forecast_table_and_footer(){
    for(let i=0; i<forecast_buttons.length; i++){
        forecast_buttons[i].addEventListener("click", function() {
            if(i != selected_forecast){
                forecast_buttons[selected_forecast].classList.remove("today");
                forecast_buttons[i].classList.add("today");
                selected_forecast=i;
                show_table_day(i);
            }
        });
    }
    document.getElementById("forecast-container").classList.remove("no-visibility");
    document.getElementById("titolo_tabella").classList.remove("no-visibility");
    document.getElementById("div-tabella_dati").classList.remove("no-visibility");

    document.getElementById("div-newsletter").classList.remove("no-display");
    document.getElementById("div-copyright").style.marginTop="42px";


}
