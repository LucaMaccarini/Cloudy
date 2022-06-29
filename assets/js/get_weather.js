const weather_request_worker = new Worker('js/workers/weather_request_worker.js');

weather_request_worker.onmessage = function(e){
    parse_api_data(e.data);
}