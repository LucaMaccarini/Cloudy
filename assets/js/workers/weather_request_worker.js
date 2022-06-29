
/**
 * {
 *    city:.....
 * }
 * 
 * or
 * 
 * {
 *    lat:....
 *    lon:....
 * }
 */
self.onmessage= function(e){
  let xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  if('city' in e.data){
    var params = 'city=' + e.data.city;
    xhr.open('POST', 'http://localhost:3000/city_name_weather', true);
  }else{
    var params = 'lat=' + e.data.lat + "&lon=" + e.data.lon;
    xhr.open('POST', 'http://localhost:3000/lon_lat_weather', true);
  }
  
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhr.onload = function() {
      if(xhr.status == 200) {
          self.postMessage(this.response);
      }else{
        self.postMessage(JSON.stringify({ajax_error:this.response}));
      }
  }
  xhr.send(params);
}