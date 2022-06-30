const weather_request_worker = new Worker('js/workers/weather_request_worker.js');

weather_request_worker.onmessage = function(e){
    if("ajax_error" in e.data){
        if(e.data.ajax_error.errore == "ricerca città")
            alert("la città inserita non è stata trovata");
        else{
            alert("latitudie o longitudine non valide");
        }
    } else {
        parse_api_data(e.data);
    }
}