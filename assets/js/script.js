/* File: assets/js/script.js */
import { Weather } from "./weather.js";     // For some reason it needs the suffix

/**
 * @function qs
 * @param {string} str 
 * @returns {Element|NodeList}
 * In this version of qs, we can do one of three things:
 * 1. We can create an Element (like jQuery used to) by starting and ending a query with "<" and ">"
 * 2. We can fetch a NodeList of element with querySelectorAll by ending the query with "+"
 *      Note: Remember to convert a NodeList to an Array, you must put the NodeList in Array.from();
 *      We don't need to do this if we want to get the length or use the forEach function with are part of NodeList.
 * 3. We can fetch a single Element with querySelector
 * TODO: We should test to see if a query is valid by ending a query with "?". Ruby does something similar to test if things exist.
 * TODO: Emmet-style creation of a set of elements.
 */
const qs = (str) => {
    if(/^<[a-zA-Z][a-zA-Z0-9]*.*>$/.test(str)){
        // TODO: Fix this. We need to get the element
        let el = document.createElement(str.slice(1,-1).match(/^[a-zA-Z][a-zA-Z0-9]*.*$/)[0]);
        // TODO: Do something about attributes (Not now, but later)
        // #id                  (can only be used once)
        // .class               (can be used more than once)
        // [keys="values"]      (can be used more than once)
        // :pseudoclasses       (can be used more than once)
        // Don't assign events here!
        return el;
    } else {
        //return document[${/\+$/.test(str)}](str);
        // A querySelectorAll request will end with a "+".
        // In Regexp, "+" means "Look for 1 or more instances"
        if(/\+$/.test(str)){
            document.querySelectorAll(str.slice(-1).trimEnd());
        }else{
            return document.querySelector(str);
        }
    }
} 


let css = (el) => (prop, val) => (val === undefined) ? getComputedStyle(el).getPropertyValue(prop) : el.style.setProperty(prop,val);

// Borrowed this from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const wx = new Weather();

const query      = document.querySelector("#query");
const getWeather = document.querySelector("#getWeather");
const geo        = document.querySelector("#geo");
const weather    = document.querySelector("#weather");
const forecast   = document.querySelector("#forecast");

const current    = document.querySelector("#current");
//current.style.display = "none";

console.log(getWeather);
getWeather.disabled = true;

async function getWx(){
    await wx.getGeocode();  // Still need to calculate this
    //geo.innerHTML      = await wx.getGeocode();   // we just don't need to display it any more
    //weather.innerHTML  = await wx.getWeather();   // or this
    //current.style.display = "grid";
    await wx.processWeather("#current");
    // forecast.innerHTML = await wx.getForecast();
    await wx.processForecast("#soon");
}

/*
// 1. keydown
query.addEventListener("keydown",() => {
    console.log("keydown");
});

// 2. keypress
query.addEventListener("keypress",() => {
    console.log("keypress");
});
*/

// 3. keyup
// Count the number of characters in query
// If they length is greater than zero, enable the getWeather button
// Otherwise, disable the getWeather button.
// This is to prevent executing a request on an empty string.
query.addEventListener("keyup", async (ev) => {
    ev.preventDefault();
    //console.log("keyup");
    // Enable getWeather if query length greater than zero
    getWeather.disabled = (ev.target.value.length === 0); 
    // If we hit the enter key, do what the getWeather button would do.
    // but only do this if there is a value in the field.
    if(ev.target.value.length > 0 && ev.keyCode === 13){
        await getWx();
    };
});

getWeather.addEventListener("click", async (ev) => {
    ev.preventDefault();
    await getWx();
});
