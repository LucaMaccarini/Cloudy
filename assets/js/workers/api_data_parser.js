function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    var months = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
    var dayNumber = a.getDate();
    var dayName = days[a.getDay()];
    var month = months[a.getMonth()];
    var hour = a.getHours();
    return {nome_giorno: dayName, giorno: dayNumber, mese: month, ora: hour};       
};

const forecast_days = 5;
const ora_inizio_calcolo=8;
const ora_fine_calcolo = 20;

self.addEventListener('message', async function(e){
    var giorno_media = new Array();
    var giorno_dati_meteo = new Array();
    var ora_dati_meteo = new Array();
    var icon_freq = new Map(); 
    
    var old_data = null;
    var somma = 0;
    var elementi=0;
    let primo_giorno = true;

    for(let i=0; i<e.data.list.length && giorno_media.length<=forecast_days; i++){
        let current_data = timeConverter(e.data.list[i].dt)
        let icon = e.data.list[i].weather[0].icon;
        if( old_data == null || old_data.giorno == current_data.giorno){

            if(!primo_giorno){
                if (parseInt(current_data.ora) >= ora_inizio_calcolo && parseInt(current_data.ora) <= ora_fine_calcolo){           
                    somma+=e.data.list[i].main.temp;
                    elementi++;

                    if (icon_freq.has(icon)) {
                        icon_freq.set(icon, icon_freq.get(icon) + 1)
                    } else {
                        icon_freq.set(icon, 1)
                    }
                }
            }else{
                somma+=e.data.list[i].main.temp;
                elementi++;
                
                if (icon_freq.has(icon)) {
                    icon_freq.set(icon, icon_freq.get(icon) + 1)
                } else {
                    icon_freq.set(icon, 1)
                }

            }

            ora_dati_meteo.push(
                {
                    ora: current_data.ora, 
                    temp: Math.round(e.data.list[i].main.temp), 
                    temp_percepita: Math.round(e.data.list[i].main.feels_like), 
                    temp_min: Math.round(e.data.list[i].main.temp_min),
                    temp_max: Math.round(e.data.list[i].main.temp_max),            
                    umidita: e.data.list[i].main.humidity,
                    descrizione_tempo: e.data.list[i].weather[0].description,
                    icona: e.data.list[i].weather[0].icon,
                    velocita_vento: e.data.list[i].wind.speed,        
                }
            )

        }else{

            let list = [...icon_freq];
            list.sort((o1, o2) => {
                if (o1[1] == o2[1])
                    return o2[0] - o1[0];
                else
                    return o2[1] - o1[1];
            })

            let max_icon = list[0][0];

            icon_freq= new Map();

           
            if(primo_giorno){
                primo_giorno=false;
                giorno_media.push({data: timeConverter(e.data.list[0].dt), media_temp: Math.round(somma/elementi), icona:max_icon});
                
                
            }else{
                giorno_media.push({data: old_data, media_temp: Math.round(somma/elementi), icona: max_icon});
            }


            if (parseInt(current_data.ora) >= ora_inizio_calcolo && parseInt(current_data.ora) <= ora_fine_calcolo){           
                somma+=e.data.list[i].main.temp;
                elementi++;

                if (icon_freq.has(icon)) {
                    icon_freq.set(icon, icon_freq.get(icon) + 1)
                } else {
                    icon_freq.set(icon, 1)
                }

            }else{
                somma = 0
                elementi=0;
            }
            
            giorno_dati_meteo.push({giorno: old_data.giorno, dati_meteo: ora_dati_meteo});

            ora_dati_meteo = [];
            ora_dati_meteo.push(
                {
                    ora: current_data.ora, 
                    temp: Math.round(e.data.list[i].main.temp), 
                    temp_percepita: Math.round(e.data.list[i].main.feels_like), 
                    temp_min: Math.round(e.data.list[i].main.temp_min),
                    temp_max: Math.round(e.data.list[i].main.temp_max),            
                    umidita: e.data.list[i].main.humidity,
                    descrizione_tempo: e.data.list[i].weather[0].description,
                    icona: e.data.list[i].weather[0].icon,
                    velocita_vento: e.data.list[i].wind.speed,        
                }
            )
            
        }
        old_data=current_data;
    }
    self.postMessage({citta: e.data.city.name,giorno_media:giorno_media, giorno_dati_meteo: giorno_dati_meteo});
    
})