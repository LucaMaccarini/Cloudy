/*
//browser bug success case the success fuction is called twice
let first_geo = true;
if (navigator.geolocation) {
    
    navigator.geolocation.watchPosition(function(position) {
        if(first_geo){
            weather_request_worker.postMessage({lat: position.coords.latitude, lon:position.coords.longitude});
            first_geo=false;
        }
    },
    function(error) {
        document.getElementById("div-for-geolocation-denied").classList.remove("no-display");
    });

} else { 
    
}
*/


if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        weather_request_worker.postMessage({lat: position.coords.latitude, lon:position.coords.longitude});
    },
    function(error) {
        document.getElementById("div-for-geolocation-denied").classList.remove("no-display");
    });
} else {
    //Geolocation is not supported by this browser
}


