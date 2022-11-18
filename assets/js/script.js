/* File: assets/js/script.js */

let qs = (str) => {
    if(/^<[a-zA-Z][a-zA-Z0-9]*.*>$/.test(str)){
        let el = document.createElement(str.slice(1,-1).match()[0]);
        // TODO: Do something about attributes (Not now, but later)
        // #id                  (can only be used once)
        // .class               (can be used more than once)
        // [keys="values"]      (can be used more than once)
        // :pseudoclasses       (can be used more than once)
        // Don't assign events here!

    } else {
        return document[${/\+$/.test(str)}](str);
        if(/\+$/.test(str)){
            document.querySelectorAll(str);
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