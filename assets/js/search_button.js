let search_bar = document.getElementById("search-bar");
document.getElementById("search-button").addEventListener("click", function() {
    weather_request_worker.postMessage({city: search_bar.value});
    search_bar.value="";
    
});