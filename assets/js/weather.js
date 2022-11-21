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
    
}
