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
        const res = await fetch(url);
        const json = await res.json();
        console.log("jsonResponse");
        console.log(json);
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
        console.log("jsonString");
        console.log(data);
        if(readable){
            return JSON.stringify(data,null,2);
        }else{
            return JSON.stringify(data);
        }
    }
    
    getGeocodeURL(){
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
        console.log("getGeocodeURL");
        console.log(url);
        return url;
    }

    async getGeocode(readable=false){
        const url = this.getGeocodeURL();
        let data = await this.jsonResponse(url);
        if(Array.isArray(data)){
            //data = data[0];
            [data] = data;
        }
        localStorage.setItem('data',JSON.stringify(data));
        //const data = await this.jsonString(url,readable);
        //[lat, lon] = data;
        console.log("getGeocode");
        console.log(data);
        localStorage.setItem('geo',JSON.stringify({ "lat" : data.lat, "lon" : data.lon }));
        //localStorage.setItem('lat',data.lat);
        //localStorage.setItem('lon',data.lon);
        //console.log(data.lat);
        //console.log(data.lon);
        console.log(localStorage.getItem('location'));
        //console.log(localStorage.getItem('lat'));
        //console.log(localStorage.getItem('lon'));
        console.log(localStorage.getItem("data"));
        console.log(localStorage.getItem("geo"));
        //return data;
        const geo = JSON.parse(localStorage.getItem("geo"));
        return await `${geo.lat},${geo.lon}`;
    }

    async getWeatherURL(){
        const geo = await JSON.parse(localStorage.getItem("geo"));
        //console.log(geo.lat);
        //console.log(geo.lon);
        const str = Object.entries(geo).map(([k,v]) => `${k}=${v}`).join("&");
        const url = `${this.#base}/${this.#path.data.weather}?${str}&${this.getParams()}`;

        console.log("getWeatherURL");
        console.log(url);
        return url;
    }
    
    async getWeather(){
        console.log("getWeather");
        const url     = await this.getWeatherURL();
        const weather = await this.jsonResponse(url);
        return this.jsonString(weather,true);
    }

    async getForecastURL(){
        const geo = await JSON.parse(localStorage.getItem("geo"));
        console.log("getForecast");
        //console.log(geo.lat);
        //console.log(geo.lon);
        const str = Object.entries(geo).map(([k,v]) => `${k}=${v}`).join("&");
        const url = `${this.#base}/${this.#path.data.forecast}?${str}&${this.getParams()}`;
        console.log("getForecastURL");
        console.log(url);
        return url;
    }

    async getForecast(){
        console.log("getForecast");
        const url      = await this.getForecastURL();
        const forecast = await this.jsonResponse(url);
        return this.jsonString(forecast,true);

    }

    /* TODO: find out what the weather icons mean and see if we can name our weather icons that */
    async processWeather(){
        //let location = `Currently in ${weather.name}`;  // NOTE: weather.name has been deprecated. TODO: get it from our geo data
        // weather.dt   // current time un UNIX UTC. Convert from timestamp
        // weather.timezone : -21600
        // "weather" : [ { "id": 800, "main": "Clear", "description": "clear sky", "icon": "01n"} ]
        let timestamp  = weather.dt;            // timestamp of observation, unix UTC. Convert from timestamp
        let conditions = Object.values(weather.weather).map((wx) => `${wx.main}`).join(",");    // join multiple weather conditions if they exist.
        let temperature = weather.main.temp;        // degrees F
        let feels_like  = weather.main.feels_like;  // degrees F    TODO: is it always here?
        let temp_min    = weather.main.temp_min;    // degrees F    TODO: what is this?
        let temp_max    = weather.main.temp_max;    // degrees F    TODO: what is this?
        let pressure    = weather.main.pressure;    // NOTE: Pressure is in hPa (is that the same as millibars?). It needs to be converted to in Hg.
        let humidity    = weather.main.humidity;    // Humidity is in percent, so just add a % sign.
        // TODO: dewpoint
        let visibility  = weather.visibility;       // Measured in km. (10000) TODO: Convert to miles!
        let wind_speed  = weather.wind.speed;       // Measured in MPH
        let wind_gust   = weather.wind.gust;        // NOTE: This doesn't appear all the time
        let wind_dir    = weather.wind.deg;         // TODO: Convert degrees to cardinal direction
        let cloud_cover = weather.clouds.all;       // Cloudiness in percent, so just add a % sign.
        let sunrise     = weather.sys.sunrise;      // This is in unix UTC timestamp 1669035004
        let sunset      = weather.sys.sunset;       // This is in unix UTC timestamp 1669070679
        // NOTE: The variables below don't appear all the time
        let rain_1h     = weather.rain["1h"];       // Rain volume for the last hour, in mm (TODO: convert to inches)
        let rain_3h     = weather.rain["3h"];       // Rain volume for the last three hours, in mm (TODO: convert to inches)
        let snow_1h     = weather.snow["1h"];       // Snow volume for the last hour, in mm (TODO: convert to inches)
        let snow_3h     = weather.snow["3h"];       // Snow volume for the last three hours, in mm (TODO: convert to inches)
    }

    async processForecast(){
        // TODO: we will likely need a side column for the items below and a header that lists the day names.
        weather.list.forEach((item) => {
            let timestamp   = item.dt;            // timestamp of observation, unix UTC. Convert from timestamp
            let conditions = Object.values(item.weather).map((wx) => `${wx.main}`).join(",");    // join multiple weather conditions if they exist.
            let temperature = item.main.temp;        // degrees F
            let feels_like  = item.main.feels_like;  // degrees F    TODO: is it always here?
            let temp_min    = item.main.temp_min;    // degrees F    TODO: what is this?
            let temp_max    = item.main.temp_max;    // degrees F    TODO: what is this?
            let pressure    = item.main.pressure;    // NOTE: Pressure is in hPa (is that the same as millibars?). It needs to be converted to in Hg.
            let humidity    = item.main.humidity;    // Humidity is in percent, so just add a % sign.
            // TODO: dewpoint
            let visibility  = item.visibility;       // Measured in km. (10000) TODO: Convert to miles!
            let pop         = item.pop;              // Percent of precipitation, add a % sign.
            let pod         = item.sys.pod;          // Part of the Day. n = night, d = day
            let wind_speed  = item.wind.speed;       // Measured in MPH
            let wind_gust   = item.wind.gust;        // NOTE: This doesn't appear all the time
            let wind_dir    = item.wind.deg;         // TODO: Convert degrees to cardinal direction
            let cloud_cover = item.clouds.all;       // Cloudiness in percent, so just add a % sign.
            let sunrise     = item.sys.sunrise;      // This is in unix UTC timestamp 1669035004
            let sunset      = item.sys.sunset;       // This is in unix UTC timestamp 1669070679
            // NOTE: The variables below don't appear all the time
            //let rain_1h     = item.rain["1h"];       // Rain volume for the last hour, in mm (TODO: convert to inches)
            let rain_3h     = item.rain["3h"];       // Rain volume for the last three hours, in mm (TODO: convert to inches)
            //let snow_1h     = item.snow["1h"];       // Snow volume for the last hour, in mm (TODO: convert to inches)
            let snow_3h     = item.snow["3h"];       // Snow volume for the last three hours, in mm (TODO: convert to inches)
        });
    }
    
}
