
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
    //document.getElementById("out").textContent=JSON.stringify(parsed_data);
    update_forecast_buttons_data();
    update_table(0);
    if(first){
        show_forecast_and_table();
        first=false;
    }
}


function update_forecast_buttons_data(){
    //dopo le 23 bisogna nascondere l'ultimo giorno
    let data_e_media_temperature=parsed_data.giorno_media;
   
    forecast_buttons[0].getElementsByClassName("info_temp")[0].textContent="Temperatura media (tra le ore: " + data_e_media_temperature[0].data.ora +":00 - 23:00)";
    //document.getElementById("out").textContent=JSON.stringify(data_e_media_temperature);
    for(let i=0; i<data_e_media_temperature.length; i++){
        forecast_buttons[i].getElementsByClassName("day")[0].textContent=data_e_media_temperature[i].data.nome_giorno;
        forecast_buttons[i].getElementsByClassName("date")[0].textContent = data_e_media_temperature[i].data.giorno + " " + data_e_media_temperature[i].data.mese;
        forecast_buttons[i].getElementsByClassName("location")[0].textContent=parsed_data.citta;
        forecast_buttons[i].getElementsByClassName("num")[0].innerHTML=data_e_media_temperature[i].media_temp + "°C";

        let img1 = document.createElement('img');
        let img2 = document.createElement('img');
        
        img1.width=63;
        img1.height=51;

        img2.width=93;
        img2.height=64;


        img1.src= "images/icons/" + data_e_media_temperature[i].icona + ".svg";
        img2.src= "images/icons/" + data_e_media_temperature[i].icona + ".svg";
        
        //farle caricare dal worker
        forecast_buttons[i].getElementsByClassName("forecast-icon")[0].appendChild(img1);
        forecast_buttons[i].getElementsByClassName("forecast-icon")[1].appendChild(img2);
    }

    

    if(data_e_media_temperature.length == 4){
        forecast_buttons[i].setAttribute("hidden", true);
    }
}


function update_table(giorno){
    let giorno_dati_meteo = parsed_data.giorno_dati_meteo;
    corpo_tabella_dati.innerHTML="";
    
    for(let i=0; i<giorno_dati_meteo[giorno].dati_meteo.length; i++){
        let newRow = corpo_tabella_dati.insertRow(-1);
        newRow.insertCell(0).appendChild(document.createTextNode(giorno_dati_meteo[giorno].dati_meteo[i].ora + ":00"));
        newRow.insertCell(1).appendChild(document.createTextNode(giorno_dati_meteo[giorno].dati_meteo[i].temp));
        newRow.insertCell(2).appendChild(document.createTextNode(giorno_dati_meteo[giorno].dati_meteo[i].temp_percepita));
        newRow.insertCell(3).appendChild(document.createTextNode(giorno_dati_meteo[giorno].dati_meteo[i].temp_min));
        newRow.insertCell(4).appendChild(document.createTextNode(giorno_dati_meteo[giorno].dati_meteo[i].temp_max));
        
        //farle caricare dal worker
        let img = document.createElement('img');
        img.src= "images/icons/" + giorno_dati_meteo[giorno].dati_meteo[i].icona + ".svg";
        img.width=48;
        img.height=43;
        newRow.insertCell(5).appendChild(img);
        newRow.insertCell(6).appendChild(document.createTextNode(giorno_dati_meteo[giorno].dati_meteo[i].descrizione_tempo));
        newRow.insertCell(7).appendChild(document.createTextNode(giorno_dati_meteo[giorno].dati_meteo[i].umidita));
        newRow.insertCell(8).appendChild(document.createTextNode(giorno_dati_meteo[giorno].dati_meteo[i].velocita_vento));
    }
    
}

var selected_forecast=0;
function show_forecast_and_table(){
    for(let i=0; i<forecast_buttons.length; i++){
        forecast_buttons[i].addEventListener("click", function() {
            if(i != selected_forecast){
                forecast_buttons[selected_forecast].classList.remove("today");
                forecast_buttons[i].classList.add("today");
                selected_forecast=i;
                update_table(i);
            }
        });
    }
    document.getElementById("div-tabella_dati").style.backgroundColor = "#233f6f";
    document.getElementById("titolo_tabella").classList.remove("no-visibility");
    document.getElementById("forecast-container").classList.remove("no-visibility");
    document.getElementById("tabella_dati").classList.remove("no-visibility");

}
