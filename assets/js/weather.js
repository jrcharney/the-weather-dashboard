/**
 * File: assets/js/weather.js
 * Info: An object-oriented version of our weather data.
 */

export class Weather {
    // Private
    #country = "us";
    #base    = "https://api.openweathermap.org";
    #path    = {
        "geo" : {
            "direct" : "geo/1.0/direct",
            "zip"    : "geo/1.0/zip"
        },
        "data" : {
            "weather"  : "data/2.5/weather",
            "forecast" : "data/2.5/forecast"
        }
    };
    #params  = {
        "appid"  : "",             // set in Constructor
        "units"  : "imperial",     // "'Merica Units!"
        "lang"   : "en"
    }
    // Public
    constructor(){
        this.#params.appid = document.querySelector("#api_key").value;
    }

    /**
     * @function getParams get the typical parameters as a string
     * @returns {string}
     */
    getParams(){
        return Object.entries(this.#params).map(([k,v]) => `${k}=${v}`).join("&");
    }

    /**
     * @function jsonResponse get a JSON response
     * @param {string} url The URL to fetch
     * @returns {object}
     */
    async jsonResponse(url){
        //console.log("jsonResponse");
        const res = await fetch(url);
        const json = await res.json();
        //console.log(json);
        return json;
    }

    /**
     * @function jsonString get a JSON response as a string
     * @param {string} url The URL to fetch
     * @param {boolean} readable format the data to be more readable
     * @returns {string}
     */
    async jsonString(data,readable=false){
        //const data = await this.jsonResponse(url);
        //console.log("jsonString");
        //console.log(data);
        if(readable){
            return JSON.stringify(data,null,2);
        }else{
            return JSON.stringify(data);
        }
    }

    /**
     * @function getGeocodeURL
     * @description Using a search query field, build a URL to get our geocode data from the OpenWeatherData API.
     * @returns {string}
     */
    getGeocodeURL(){
        // Because this happens first, this function is not asynchronous
        //console.log("getGeocodeURL");
        // TODO: We should probably write this line better
        const query = document.querySelector("#query").value.split(/\s*,\s*/);
        let str;
        let q_params;
        switch(query.length){
            case 1:
                if(/^\d{5}$/.test(query[0])){
                    // Get geodata based on US zip code
                    localStorage.setItem('location',`${query[0]},${this.#country}`);
                    str=`${this.#path.geo.zip}?zip=${localStorage.getItem('location')}`;
                }else{
                    // Get geodata based on a place name
                    localStorage.setItem('location',`${encodeURIComponent(query[0])}`);
                    str=`${this.#path.geo.direct}?q=${localStorage.getItem('location')}`;
                }
                break;
            case 2:
                // City and State search of US only
                q_params = {
                    city    : query[0],
                    state   : query[1],       // Hopefully I won't need to convert the state to an abbreviation
                    country : this.#country
                };
                q_params = Object.values(q_params).map((v) => encodeURIComponent(v)).join(",");
                localStorage.setItem('location',q_params);
                str = `${this.#path.geo.direct}?q=${localStorage.getItem('location')}`;
                break;
            case 3:
            default:        // TODO: Try-catch-finally block later
                // City, state, and countrysearch for US only
                q_params = {
                    city    : query[0],
                    state   : query[1],      // Hopefully I won't need to convert the state to an abbreviation
                    country : query[2]       // Same here too
                };
                q_params = Object.values(q_params).map((v) => encodeURIComponent(v)).join(",");
                localStorage.setItem('location',q_params);
                str = `${this.#path.geo.direct}?q=${localStorage.getItem('location')}`;
                break;
        }
        let url = `${this.#base}/${str}&appid=${this.#params.appid}`;
        //console.log(url);
        return url;
    }

    /**
     * @function getGeocode
     * @async
     * @description Get our geocode data from the OpenWeatherMap API.
     * @returns {string}
     */
    async getGeocode(){
        const url = this.getGeocodeURL();
        let data = await this.jsonResponse(url);
        if(Array.isArray(data)){
            //data = data[0];
            [data] = data;
        }
        localStorage.setItem('data',JSON.stringify(data));
        //const data = await this.jsonString(url,readable);
        //[lat, lon] = data;
        //console.log("getGeocode");
        //console.log(data);
        // TODO: Exception needed. If data.name is undefined because of a typo, a "TypeError: Cannot read properties of undefined (reading 'name')" will occur!
        // This program need exception handling anyway, but when we get around tit it, here is a good place to start.
        localStorage.setItem('name',data.name);
        localStorage.setItem('geo',JSON.stringify({ "lat" : data.lat, "lon" : data.lon }));
        //localStorage.setItem('lat',data.lat);
        //localStorage.setItem('lon',data.lon);
        //console.log(data.lat);
        //console.log(data.lon);
        //console.log(localStorage.getItem('location'));
        //console.log(localStorage.getItem('lat'));
        //console.log(localStorage.getItem('lon'));
        //console.log(localStorage.getItem("data"));
        //console.log(localStorage.getItem("name"));
        //console.log(localStorage.getItem("geo"));
        //return data;
        const geo = JSON.parse(localStorage.getItem("geo"));
        return await `${geo.lat},${geo.lon}`;
    }

    /**
     * @function getWeatherURL
     * @async
     * @description using geo coordinates stored from localStorage, build the URL string to get the current conditions from the OpenWeatherMap API.
     * @returns {string}
     */
    async getWeatherURL(){
        //console.log("getWeatherURL");
        const geo = await JSON.parse(localStorage.getItem("geo"));
        //console.log(geo.lat);
        //console.log(geo.lon);
        const str = Object.entries(geo).map(([k,v]) => `${k}=${v}`).join("&");
        const url = `${this.#base}/${this.#path.data.weather}?${str}&${this.getParams()}`;
        //console.log(url);
        return url;
    }

    /**
     * @function getWeather
     * @async
     * @description get the current conditions data as a JSON string
     * @returns {string}
     */
    async getWeather(){
        // TODO: Do we sill need this?
        //console.log("getWeather");
        const url     = await this.getWeatherURL();
        const weather = await this.jsonResponse(url);
        return this.jsonString(weather,true);
    }

    /**
     * @function getForecastURL
     * @async
     * @description using geo cooridinates from localStorage, build the URL string to get the forecast from the OpenWeatherMap API.
     * @returns {string}
     */
    async getForecastURL(){
        //console.log("getForecastURL");
        const geo = await JSON.parse(localStorage.getItem("geo"));
        //console.log(geo.lat);
        //console.log(geo.lon);
        const str = Object.entries(geo).map(([k,v]) => `${k}=${v}`).join("&");
        const url = `${this.#base}/${this.#path.data.forecast}?${str}&${this.getParams()}`;
        //console.log(url);
        return url;
    }

    /**
     * @function getForecast
     * @async
     * @description Get the forecast data as a JSON string
     * @returns {string}
     */
    async getForecast(){
        // TODO: Can we still use this?
        //console.log("getForecast");
        const url      = await this.getForecastURL();
        const forecast = await this.jsonResponse(url);
        return this.jsonString(forecast,true);

    }

    /**
     * @function direction
     * @description Get the cardinal wind direction
     * @param {number} angle 
     * @returns {string}
     */
    direction(angle){
        /* Fun fact: I actually pulled this block of code from an old Ruby program I wrote about a decade ago. */
        let dir;
        //if(    angle >= 348.75 || angle < 11.25  ) then "N"
        if(      angle >=  11.25 && angle <  33.75 ){ dir = "NNE"; }
        else if( angle >=  33.75 && angle <  56.25 ){ dir = "NE";  }
        else if( angle >=  56.25 && angle <  78.75 ){ dir = "ENE"; }
        else if( angle >=  78.75 && angle < 101.25 ){ dir = "E";   }
        else if( angle >= 101.25 && angle < 123.75 ){ dir = "ESE"; }
        else if( angle >= 123.75 && angle < 146.25 ){ dir = "SE";  }
        else if( angle >= 146.25 && angle < 168.75 ){ dir = "SSE"; }
        else if( angle >= 168.75 && angle < 191.25 ){ dir = "S";   }
        else if( angle >= 191.25 && angle < 213.75 ){ dir = "SSW"; }
        else if( angle >= 213.75 && angle < 236.25 ){ dir = "SW";  }
        else if( angle >= 236.25 && angle < 258.75 ){ dir = "WSW"; }
        else if( angle >= 258.75 && angle < 281.25 ){ dir = "W";   }
        else if( angle >= 281.25 && angle < 303.75 ){ dir = "WNW"; }
        else if( angle >= 303.75 && angle < 326.25 ){ dir = "NW";  }
        else if( angle >= 326.25 && angle < 348.75 ){ dir = "NNW"; }
        else{ dir = "N"; }
        return dir;
    }

    /**
     * @function temp_f_to_c
     * @description Convert temperature from Fahrenheit to Celsius
     * @param {number} temp_f 
     * @returns {number}
     */
    temp_f_to_c(temp_f){
        return (temp_f - 32) * (5.0/9.0);
    }

    /**
     * @function temp_c_to_f
     * @description Convert temperature from Celsius to Fahrenheit
     * @param {number} temp_c 
     * @returns {number}
     */
    temp_c_to_f(temp_c){
        return (temp_c * (9.0 / 5.0)) + 32;
    }

    /**
     * @function dewpoint Calculate the dewpoint temperature from the air temperature and relative humidity
     * @param {*} temp temperature
     * @param {*} rh relative humidity
     * @return {number} temp_dp;
     * What is the dewpoint?
     * The dewpoint is the temperature to which the air must be cooled to reach saturation (assuming air pressure remains the same).
     * When the temperature cools to the dewpoint, fog or dew can occur, and the relative humidity becomes 100%.
     * Borrowed this formula from http://irtfweb.ifa.hawaii.edu/~tcs3/tcs3/Misc/Dewpoint_Calculation_Humidity_Sensor_E.pdf 
     */
    dewpoint(temp_f,rh){
        //console.log("dewpoint")
        // We need to convert our fahrenheit temperature to celsius for this formula to work.
        let temp_c = this.temp_f_to_c(temp_f);
        //console.log(temp_f);
        //console.log(rh);
        //console.log(temp_c);
        /*
        // The Magnus formula relates the saturation vapor pressure and dewpoint.
        // For the range from -45 to 60 degrees C, the Magnus parameters are
        let alpha  = 6.112;  // in hPa
        let beta   = 17.62;  // in celsius?
        let lambda = 243.12; // in celsius
        // At the temperature temp_c, the saturation vapor pressure (EW in hPa) over liquid water is the following formula
        let ew = alpha * Math.exp(beta * temp_c / (lambda + temp_c));
        let e = rh * ew / 100;
        // You think the guy who wrote this paper I got this formula from would not write things out of order.
        // This next term doesn't hav a variable represeting it, but it should because the calculations are used twice
        // We'll just call it "f"
        let f = Math.log(e/alpha);
        let temp_dp = (lambda * f) / (beta - f);
        */

        let beta   = 17.625;  // in celsius?
        let lambda = 243.04; // in celsius
        let gamma  = Math.log(rh/100) + ((beta * temp_c) / (lambda + temp_c));  // hPa?
        let temp_dp = (lambda * gamma) / (beta - gamma); 

        // Back to "'Merica Units".
        //console.log(temp_dp);
        let temp_dp_f = this.temp_c_to_f(temp_dp);
        //console.log(temp_dp_f);
        return temp_dp_f;
    }

    /**
     * @function pressure_to_inHg
     * @description Convert barometric pressure from hectopascals to inches of mercury
     * @param {number} pressure_hPa 
     * @returns {number}
     */
    pressure_to_inHg(pressure_hPa){
        return pressure_hPa / 33.864;   // 1 hPa = 1 / 33.86388667 inHg = 0.02953 inHg
    }

    /**
     * @function precip_to_in
     * @description Convert precipitation amounts from millimeters to inches
     * @param {number} precip_mm 
     * @returns {number}
     */
    precip_to_in(precip_mm){
        return precip_mm / 25.4;        // 1 inch = 25.4 mm exactly!
    }

    // There are 5280 feet in 1 mile (1 mi = 5280 ft = 63360 in = 1609344 mm = 1609.344 m = 1.609344 km)
    // There are 12 inches in 1 foot (1 ft = 12 in )
    // There are exactly 25.4 millimeters in 1 inch (1 in = 25.4 mm)
    // 1 meter has 1000 millimeters (1 mm = 0.001 m)
    // 1 kilometer has 1000 meters (1 m = 0.001 km)
    // It turns out visibility was in meters, so we need to divide by 1609.344
    /**
     * @function vis_to_mi
     * @description Convert visibility distance from meters to miles
     * @param {number} vis_m 
     * @returns {number}
     */
    vis_to_mi(vis_m){
        return vis_m / 1609.344;
    }

    /**
     * @function time_to_hhmm
     * @description Covert a timestamp in seconds to hours and minutes. (Note: all times will return the local time of the end user not of the location of the time.)
     * @param {number} stamp 
     * @returns {string}
     */
    time_to_hhmm(stamp){
        // Note: We don't need to add the timezone to our timestamp. Temporal can't get the JavaScript soon enough!
        const date = new Date(stamp * 1000);
        let h = date.getHours()%12;
        if(h === 0){h = 12;}
        const hh = String(h).padStart(2,' ');
        const mm = String(date.getMinutes()).padStart(2,'0');
        const ap = date.getHours() < 12 ? "am" : "pm";
        return `${hh}:${mm}${ap}`;
    }

    /**
     * @function getDotW
     * @description Get the day of the week
     * @param {number} stamp 
     * @returns {string}
     */
    getDotW(stamp){
        const date = new Date(stamp * 1000);
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const dotw = days[date.getDay()];
        return dotw;
    }

    /**
     * @function temperatureFormat
     * @description Format our temperature
     * @param {number} temp 
     * @returns {string}
     */
    temperatureFormat(temp){
        // TODO: This function should go in a locale class
        return `${temp.toFixed(1)}<abbr title="degrees Fahrenheit">&deg;F</abbr>`;
    }

    /**
     * @function pressure_inHgFormat
     * @description Barometric pressure format when presented with inches of mercury
     * @param {number} pressure_inHg 
     * @returns {string}
     */
    pressure_inHgFormat(pressure_inHg){
        // TODO: This function should go in a locale class
        return `${pressure_inHg.toFixed(2)}<abbr title="inches of mercury">in. Hg</abbr>`;
    }

    /**
     * @function pressure_hPaFormat
     * @description Barometric pressure format when presented with hectopascals/millibars
     * @param {number} pressure_hPa 
     * @returns {string}
     */
    pressure_hPaFormat(pressure_hPa){
        // TODO: This function should go in a locale class
        return `${pressure_hPa} <abbr title="millibars">mbar</abbr>`;
    }

    /**
     * @function percentFormat
     * @description Percent format
     * @param {number} num 
     * @returns {string}
     */
    percentFormat(num){
        // Note: made this function in case I needed to apply .toFixed to a number
        return `${num}%`;
    }

    /**
     * @function distanceFormat
     * @description Format for distances in miles.
     * @param {number} num 
     * @returns {string}
     */
    distanceFormat(num){
        // TODO: This function should go in a locale class
        return `${num.toFixed(2)} <abbr title="Miles">mi.</abbr>`;
    }

    /**
     * @function precipFormat
     * @description Format precipitation amounts in inches.
     * @param {number} num 
     * @returns {string}
     */
    precipFormat(num){
        // TODO: This function should go in a locale class
        return `${num.toFixed(2)}<abbr title="inches">in.</abbr>`;
    }

    /**
     * @function fieldName
     * @description Format a field_name cell for our grid
     * @param {string} name 
     * @param {string} title 
     * @returns {HTMLDivElement}
     */
    fieldName(name,title){
        // TODO: Put this in a grid module eventually
        const field_name = document.createElement("div");
        field_name.innerHTML = name;
        field_name.classList.add("field_name");
        if(title){
            field_name.setAttribute("title",title);
        }
        return field_name;
    }

    /**
     * @function fieldValue
     * @description Format a field value cell that could be used as a header or data cell for our grid
     * @param {*} value 
     * @param {string} classes 
     * @param {string} title 
     * @returns {HTMLDivElement}
     */
    fieldValue(value,classes,title){
        // TODO: Put this in a grid module eventually
        const field_value = document.createElement("div");
        field_value.innerHTML = value;
        field_value.classList.add("field_value");
        if(classes){
            //console.log(classes);
            field_value.classList.add(classes);
        }
        if(title){
            field_value.setAttribute("title",title);
        }
        return field_value;
    }

    /**
     * @function removeChildren
     * @description Remove any child nodes of an element
     * @param {HTMLElement} el 
     */
    removeChildren(el){
        // TODO: Put this in a grid module eventually
        /* We need to do this everytime we do a new search request */
        //console.log("removeChildren");
        while(el.lastElementChild){
            el.removeChild(el.lastElementChild);
        }
        //console.log(el.hasChildNodes());
    }

    /**
     * @function processWeather
     * @async
     * @description Process our weather data.
     * @param {HTMLElement} where In what element should we put this data?
     */
    async processWeather(where){
        // TODO: Rewrite this function to be more elegant
        // TODO: Rewrite this method to use the same flow style that processForecast uses
        // TODO: Extract any grid stuff to be in its own function that can be reusable.
        // TODO: find out what the weather icons mean and see if we can name our weather icons that
        // TODO: windchill
        // TODO: heat index
        //console.log("processWeather");
        const url     = await this.getWeatherURL();
        const weather = await this.jsonResponse(url);
        //let location = `Currently in ${weather.name}`;  // NOTE: weather.name has been deprecated. TODO: get it from our geo data
        // weather.dt   // current time un UNIX UTC. Convert from timestamp
        // weather.timezone : -21600
        // "weather" : [ { "id": 800, "main": "Clear", "description": "clear sky", "icon": "01n"} ]
        let name       = localStorage.getItem("name");
        let timestamp  = weather.dt;            // timestamp of observation, unix UTC. Convert from timestamp
        let timezone   = weather.timezone;
        localStorage.setItem("timezone",timezone);
        let obs_time   = this.time_to_hhmm(timestamp);
        // TODO: Use .match() instead of .join() so we can use "with" and "and" to describe weather condtions.
        //console.log(weather.weather);
        let conditions = Object.values(weather.weather).map((wx) => `${wx.main}`).join(",");    // join multiple weather conditions if they exist.
        let icon = weather.weather[0].icon;
        let icon_file = `https://openweathermap.org/img/wn/${icon}.png`;
        let icon_alt  = weather.weather[0].description;
        let temperature = weather.main.temp;        // degrees F
        let feels_like  = weather.main.feels_like;  // degrees F    TODO: is it always here?
        let temp_min    = weather.main.temp_min;    // degrees F    TODO: what is this?
        let temp_max    = weather.main.temp_max;    // degrees F    TODO: what is this?
        // 1 hPa = 100 Pa = 1mb, so 1 hectopascal = 1 millibar
        // 100 Pa = 1 hPA = 0.1 kPA
        let pressure_hPa = weather.main.pressure;    // NOTE: Pressure is in hPa (is that the same as millibars?). It needs to be converted to in Hg.
        let pressure_inHg = this.pressure_to_inHg(pressure_hPa);
        let humidity    = weather.main.humidity;    // Humidity is in percent, so just add a % sign.
        let temp_dp     = this.dewpoint(temperature,humidity);  // "LOOK AT THAT DEW POINT!"
        let visibility  = this.vis_to_mi(weather.visibility);       // Measured in km, converted to miles
        // TODO: What if the winds are calm?
        let wind_deg    = weather.wind.deg;
        let wind_dir    = this.direction(wind_deg);    // shows wind in cardinal directions
        let wind_speed  = Math.round(weather.wind.speed);       // Measured in MPH
        let wind_gust   = (Object.keys(weather.wind).includes("gust")) ? weather.wind.gust : ""; // NOTE: This doesn't appear all the time
        let cloud_cover = weather.clouds.all;       // Cloudiness in percent, so just add a % sign.
        let sunrise     = this.time_to_hhmm(weather.sys.sunrise);      // This is in unix UTC timestamp 1669035004
        let sunset      = this.time_to_hhmm(weather.sys.sunset);       // This is in unix UTC timestamp 1669070679

        // Let's format the background like with the five day.
        // Since there is no Part of the day (POD) variable, let's use whatever our observation time is and see if it is between sunrise and sunset.
        let pod = (weather.dt > weather.sys.sunrise && weather.dt < weather.sys.sunset ) ? "d" : "n";

        // NOTE: The variables below don't appear all the time
        let precip = {
            rain_1h : 0,
            rain_3h : 0,
            snow_1h : 0,
            snow_3h : 0
        };
        if(Object.keys(weather).includes("rain")){
            if(Object.keys(weather.rain).includes("1h")){
                precip.rain_1h = this.precip_to_in(weather.rain["1h"]);       // Rain volume for the last hour, in mm, converted to inches
            }
            if(Object.keys(weather.rain).includes("3h")){
                precip.rain_3h = this.precip_to_in(weather.rain["3h"]);       // Rain volume for the last three hours, in mm, converted to inches
            }
        }
        if(Object.keys(weather).includes("snow")){
            if(Object.keys(weather.snow).includes("1h")){
                precip.snow_1h = this.precip_to_in(weather.snow["1h"]);       // Snow volume for the last hour, in mm, converted to inches
            }
            if(Object.keys(weather.snow).includes("3h")){
                precip.snow_3h = this.precip_to_in(weather.snow["3h"]);       // Snow volume for the last three hours, in mm, converted to inches
            }
        }

        let current = document.querySelector(where);
        let geo     = JSON.parse(localStorage.getItem("geo"));
        let fields = [
            {
                "name"  : "Location",
                "title" : "Observation location",
                "class" : "header",
                "value" : `<span title="[${geo.lat},${geo.lon}]">${name}</span>`
            },
            {
                "name"  : "Time",
                "title" : "Time of observation",
                "class" : "header",
                "value" : obs_time      // TODO: Time Zone
            },
            // TODO: need to get GOOD weather icon!
            {
                "name"  : "Conditions",
                "title" : "The observed weather conditions",
                "class" : "data",
                "value" : `<img src="${icon_file}" alt="${icon_alt}"><br>${conditions}`
            },
            {
                "name"  : "Temperature",
                "title" : "Air temperature",
                "class" : "data",
                "value" : this.temperatureFormat(temperature)
            },
            {
                "name"  : "Feels Like",
                "title" : "The 'feels like' temperature; it should factor in wind chill and heat index",
                "class" : "data",
                "value" : this.temperatureFormat(feels_like)
            },
            {
                "name"  : "Barometric Pressure",
                "title" : "The amount of atmospheric pressure",
                "class" : "data",
                "value" : `${this.pressure_inHgFormat(pressure_inHg)}<br/><small>(${this.pressure_hPaFormat(pressure_hPa)})</small>`
            },
            {
                "name"  : "Relative Humidity",
                "title" : "The amount of moisture in the air",
                "class" : "data",
                "value" : this.percentFormat(humidity)
            },
            {
                "name"  : "Dewpoint Temperature",
                "title" : "The temperature at which dew forms; also determines outdoor comfort",
                "class" : "data",
                "value" : `<span title="LOOK AT THAT DEWPOINT!">${this.temperatureFormat(temp_dp)}</span>`
            },
            {
                "name"  : "Wind Direction and Speed",
                "title" : "The direction where the wind is coming from and how fast it is going. Wind gusts will appear in parenthesis if observed.",
                "class" : "data",
                "value" : `<span title="${wind_deg}&deg;">${wind_dir}</span> <span>${wind_speed}</span> <abbr title="miles per hour">MPH</abbr>`
                        + ((wind_gust !== "") ? `<br>(<abbr title="gusting">G</abbr><span>${wind_gust}</span> <abbr title="miles per hour">MPH</abbr>)` : "")
            },
            {
                "name"  : "Cloud Cover",
                "title" : "a.k.a. Cloudiness; How much of the sky was covered in clouds at time of observation",
                "class" : "data",
                "value" : this.percentFormat(cloud_cover)
            },
            {
                "name"  : "Visibility",
                "title" : "The farthest distance that can be seen",
                "class" : "data",
                "value" : this.distanceFormat(visibility)
            },
            {
                // TODO: Should report "None" if no precip fell.
                "name"  : "Precipitation",
                "title" : "Recorded rain or snow within the last hour or three hours.",
                "class" : "data",
                "value" : Object.entries(precip).filter(([k,v]) => v !== 0).map(([k,v]) => {
                        let label = "";
                        if(k.startsWith("rain")){label += "💧";}
                        if(k.startsWith("snow")){label += "❄️";}
                        label += " ";
                        if(k.endsWith("1h")){label += "last hour";}
                        if(k.endsWith("3h")){label += "last 3 hours";}
                        return `<strong>${label}:</strong> ${v.toFixed(2)}<abbr title="inches">in.</abbr>`;
                    }).join("<br>")
            },
            {
                "name"  : "🌅Sunrise",
                "title" : "Time of sunrise",
                "class" : "data",
                "value" : sunrise
            },
            {
                "name"  : "🌇Sunset",
                "title" : "Time of sunset",
                "class" : "data",
                "value" : sunset
            },
        ];

        if(current.hasChildNodes()){
            this.removeChildren(current);
        }

        fields.forEach((field) => {
            let classes = "";   // add classes to our field value cells
            if(field.class === "header"){
                classes += "col_name";
            }
            else if(field.class === "data"){
                if(pod === "d"){
                    classes += "pod_day";
                }else if(pod === "n"){
                    classes += "pod_night";
                }
            }
            current.append(
                this.fieldName(field.name,field.title),
                this.fieldValue(field.value,classes)
            );
        });

        
    }

    /**
     * @processForecast
     * @async
     * @description Process our 5-day, 3-hour forecast and put in someplace.
     * @param {HTMLElement} el In what element should we process this data? 
     */
    async processForecast(el){
        // TODO: See if we can extract any grid stuff and see if we can make it reusable.
        //console.log("processForecast");
        const url     = await this.getForecastURL();
        const weather = await this.jsonResponse(url);

        let name     = localStorage.getItem("name");
        let timezone = localStorage.getItem("timezone");

        let soon = document.querySelector(el);
        /* This time around we just use this to get our fields.
         * Values will need to entered in another array for each day.
         */
        const fields = [
            {
                "name"  : "Day",
                "title" : "Day of the week of forecast"
            },
            {
                "name"  : "Time",
                "title" : "Time of the forecast"
            },
            // TODO: need to get GOOD weather icon!
            {
                "name"  : "Conditions",
                "title" : "Forecasted conditions"
            },
            {
                "name"  : "Temperature",
                "title" : "Air temperature"
            },
            {
                "name": "Feels Like",
                "title": "The 'feels like' temperature; it should factor in wind chill and heat index"
            },
            {
                "name"  : "Barometric Pressure",
                "title" : "The amount of atmospheric pressure"
            },
            {
                "name"  : "Relative Humidity",
                "title" : "The amount of moisture in the air"
            },
            {
                "name"  : "Dewpoint Temperature",
                "title" : "The temperature at which dew forms; also determines outdoor comfort"
            },
            {
                "name"  : "Wind Direction and Speed",
                "title" : "The direction where the wind is coming from and how fast it is going. Wind gusts will appear in parenthesis if observed."
            },
            {
                "name"  : "Cloud Cover",
                "title" : "a.k.a. Cloudiness; How much of the sky was covered in clouds at time of observation"
            },
            {
                "name"  : "Visibility",
                "title" : "The farthest distance that can be seen",
            },
            {
                "name"  : "P.O.P.",
                "title" : "Percent of Precipitation, the chance of precipitation"
            },
            /*
            {
                "name"  : "🌅Sunrise",
                "title" : "Time of sunrise"
            },
            {
                "name"  : "🌇Sunset",
                "title" : "Time of sunset"
            },
            */
            {
                "name"  : "Precipitation",
                "title" : "Recorded rain or snow within the last hour or three hours."
            },
        ];

        if(soon.hasChildNodes()){
            this.removeChildren(soon);
        }

        fields.forEach((field) => {
            soon.append(
                this.fieldName(field.name,field.title)
                //this.fieldValue(field.value)
            );
        });

        //console.log(weather);
        //console.log(Array.isArray(weather.list));
        //console.log(weather.list);
        weather.list.forEach((item) => {
            let timestamp     = item.dt;            // timestamp of observation, unix UTC. Convert from timestamp
            let dotw          = this.getDotW(timestamp);
            let time          = this.time_to_hhmm(timestamp);
            
            // TODO: Use .match() instead of .join() so we can use "with" and "and" to describe weather condtions.
            //console.log(item.weather);
            let conditions    = Object.values(item.weather).map((wx) => `${wx.main}`).join(",");    // join multiple weather conditions if they exist.
            let icon          = item.weather[0].icon;
            let icon_file     = `https://openweathermap.org/img/wn/${icon}.png`;
            let icon_alt      = item.weather[0].description;
            let temperature   = item.main.temp;        // degrees F
            let feels_like    = item.main.feels_like;  // degrees F    TODO: is it always here?
            let temp_min      = item.main.temp_min;    // degrees F    TODO: what is this?
            let temp_max      = item.main.temp_max;    // degrees F    TODO: what is this?
            // 1 hPa = 100 Pa = 1mb, so 1 hectopascal = 1 millibar
            // 100 Pa = 1 hPA = 0.1 kPA
            let pressure_hPa  = item.main.pressure;    // NOTE: Pressure is in hPa (is that the same as millibars?). It needs to be converted to in Hg.
            let pressure_inHg = this.pressure_to_inHg(pressure_hPa);
            let humidity      = item.main.humidity;    // Humidity is in percent, so just add a % sign.
            let temp_dp       = this.dewpoint(temperature,humidity);  // "LOOK AT THAT DEW POINT!"
            let visibility    = this.vis_to_mi(item.visibility);       // Measured in km, converted to miles
            // TODO: What if the winds are calm?
            let wind_deg      = item.wind.deg;
            let wind_dir      = this.direction(wind_deg);    // shows wind in cardinal directions
            let wind_speed    = Math.round(item.wind.speed);       // Measured in MPH
            let wind_gust     = (Object.keys(item.wind).includes("gust")) ? Math.round(item.wind.gust) : ""; // NOTE: This doesn't appear all the time
            let cloud_cover   = item.clouds.all;       // Cloudiness in percent, so just add a % sign.
            let pop           = item.pop;              // Percent of precipitation, add a % sign.
            let pod           = item.sys.pod;          // Part of the Day. n = night, d = day
            
            // TODO: Get sunrise and sunset calculation. (IDK that wasn't part of this API!)
            //let sunrise     = this.time_to_hhmm(weather.sys.sunrise);      // This is in unix UTC timestamp 1669035004
            //let sunset      = this.time_to_hhmm(weather.sys.sunset);       // This is in unix UTC timestamp 1669070679
            // NOTE: The variables below don't appear all the time
            
            // NOTE: The variables below don't appear all the time
            let precip = {
                //rain_1h : 0,
                rain_3h : 0,
                //snow_1h : 0,
                snow_3h : 0
            };
            if(Object.keys(item).includes("rain")){
                if(Object.keys(item.rain).includes("3h")){
                    precip.rain_3h = this.precip_to_in(item.rain["3h"]);       // Rain volume for the last three hours, in mm, converted to inches
                }
            }
            if(Object.keys(item).includes("snow")){
                if(Object.keys(item.snow).includes("3h")){
                    precip.snow_3h = this.precip_to_in(item.snow["3h"]);       // Snow volume for the last three hours, in mm, converted to inches
                }
            }

            let values = [
                {
                    "name"  : "Day",
                    "class" : "header",
                    "value" : dotw
                },
                {
                    "name"  : "Time",
                    "class" : "header",
                    "value" : time
                },
                {
                    "name"  : "Conditions",
                    "class" : "data",
                    "value" : `<img src="${icon_file}" alt="${icon_alt}"><br>${conditions}`
                },
                {
                    "name"  : "Temperature",
                    "class" : "data",
                    "value" : this.temperatureFormat(temperature)
                },
                {
                    "name"  : "Feels Like",
                    "class" : "data",
                    "value" : this.temperatureFormat(feels_like)
                },
                {
                    "name"  : "Pressure",
                    "class" : "data",
                    "value" : `${this.pressure_inHgFormat(pressure_inHg)}<br/><small>(${this.pressure_hPaFormat(pressure_hPa)})</small>`
                },
                {
                    "name"  : "Humidity",
                    "class" : "data",
                    "value" : this.percentFormat(humidity)
                },
                {
                    "name"  : "Dewpoint Temperature",
                    "class" : "data",
                    "value" : this.temperatureFormat(temp_dp)
                },
                {
                    "name"  : "Wind Direction and Speed",
                    "class" : "data",
                    "value" : `<span title="${wind_deg}&deg;">${wind_dir}</span> <span>${wind_speed}</span> <abbr title="miles per hour">MPH</abbr>`
                                + ((wind_gust !== "") ? `<br>(<abbr title="gusting">G</abbr><span>${wind_gust}</span> <abbr title="miles per hour">MPH</abbr>)` : "")
                },
                {
                    "name"  : "Cloud Cover",
                    "class" : "data",
                    "value" : this.percentFormat(cloud_cover)
                },
                {
                    "name"  : "Visibility",
                    "class" : "data",
                    "value" : this.distanceFormat(visibility)
                },
                {
                    "name"  : "P.O.P.",
                    "class" : "data",
                    "value" : this.percentFormat(pop)
                },
                {
                    "name"  : "Precipitation",
                    "class" : "data",
                    "value" : Object.entries(precip).filter(([k,v]) => v !== 0).map(([k,v]) => {
                                let label = "";
                                if(k.startsWith("rain")){label += "💧";}
                                if(k.startsWith("snow")){label += "❄️";}
                                return `<strong>${label} expected:</strong> ${this.precipFormat(v)}`;
                            }).join("<br>")
                }
            ];

            values.forEach((value) => {
                let classes = "";   // add classes to our field value cells
                if(value.class === "header"){
                    classes += "col_name";
                }
                else if(value.class === "data"){
                    if(pod === "d"){
                        classes += "pod_day";
                    }else if(pod === "n"){
                        classes += "pod_night";
                    }
                }
                soon.append(
                    //this.fieldName(field.name,field.title)
                    this.fieldValue(value.value,classes)
                );
            });
        });
    }
}
