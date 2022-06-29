
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
} else { 
    //alert("Geolocation is not supported by this browser.");
}


function showPosition(position) {
    //alert( "Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude);
    weather_request_worker.postMessage({lat: position.coords.latitude, lon:position.coords.longitude});
}
