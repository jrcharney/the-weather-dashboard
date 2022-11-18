# ⛈️ The Weather Dashboard ⛈️

![The Weather Dashboard](./assets/images/The_Weather_Dashboard.png)
Network Decay? What Network Decay?

Homework Challenge 6, Due November 21.

I want to consider this homework assignment more than just a homework assignment as I found some things that are quite relatable.  But those things will be added later. For now, let's just focus on the requirements for this project.

## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

## Acceptable Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```

## TODO List
- [ ] Create a text form that searches for weather by City
  - [ ] TODO: What if there are cities with the same name in multiple locations? (e.g. how many states have a Springfield?)
    - We could add a `<datalist>` element with auto-generated `<options>`. But how would that work?
- [ ] Display the current conditions of the city searched
- [ ] Display the five day forecast that shows that displays the date, an icon representation of weather conditions, the temperature, wind speed, and humidity.
  - Not sure if it shows predicted humidity, but "percent of precipitation" ("POP") is more useful.
  - Also, see if we can download our own weather icons. (Might be some long-term plan. What would The Weather Chazz do?)
    - Turns out we don't have to! We can borrow the ones recreated by Charles Abel-Lear (1980-2019) and Nick Smith on the [TWCClassics website](https://twcclassics.com/downloads.html). And they have the fonts! Proper attribution will be provided!
- [ ] Use `localStorage` to preserve a list of previous city searches that we can look up again. Clicking on those cities should show the current conditions and five day forecasts for those cities.
    - In faithfulness to the classic [WeatherStar 4000](https://twcclassics.com/collections/weatherstar-4000-simulator.html) display of cities nationwide, the following cities should be displayed, and perhaps a weather icon and forecasted high and low temperatures.
        - Atlanta
        - Boston
        - Chicago
        - Cleveland
        - Dallas
        - Denver
        - Detroit
        - Houston
        - Indianapolis
        - Los Angeles
        - Miami
        - Minneapolis
        - New York
        - Norfolk
        - Orlando
        - Philadelphia
        - Phoenix
        - Pittsburgh
        - St. Louis
        - San Francisco
        - Seattle
        - Syracuse
        - Tampa
        - Washington DC
- [ ] Github Pages
- [ ] Screenshot

> Note: I know the instructor probably want me to use Bootstrap for stylesheets on this project, however I seriously want to apply my own stylesheets here. It depends honestly. I want that 90s Weather Channel aesthetic.

## Disclaimer

> NOTE: This disclaimer has morphed into a list of links worth checking out. So I guess it will double as that too.

The Weather Dashboard is NOT affiliated with the following entities 

- [The Weather Channel](https://www.weather.com/)
- Landmark Communications
- The Weather Company
- IBM
- Weather Group, LLC a.k.a. Weather Group Television, LLC
- Allen Media Group a.k.a. Entertainment Studios, Inc.
- [Weather Underground](https://www.wunderground.com/)

- [The National Oceanic and Atmospheric Administration](https://www.noaa.gov/) (NOAA)
  - [The United States National Weather Service](https://www.weather.gov/) (NWS)
  - [The National Centers for Environmental Prediction](https://ncep.noaa.gov/) (NCEP)
    - [The Climate Prediction Center](https://cpc.ncep.noaa.gov/) (CPC)
    - [The National Hurricane Center](https://www.nhc.noaa.gov/) (NHC)
    - [The Storm Prediction Center](https://www.spc.noaa.gov/) (SPC)
    - [The Weather Prediction Center](https://www.wpc.necp.noaa.gov/) (WPC)
    - [The Ocean Prediction Center](https://ocean.weather.gov/) (OPC)
    - [The Space Weather Prediction Center](https://swpc.noaa.gov/) (SWPC)
    - [The Aviation Weather Center](https://www.aviationweather.gov/) (AWC)
  - [The National Severe Storms Laboratory](https://nssl.noaa.gov/) (NSSL)
  - [The National Tsunami Warning Center](https://www.tsunami.gov/) (NTWC)
  - NOAA Center for Operational Oceanographic Products and Services
    - [Tides and Currents](https://tidesandcurrents.noaa.gov/)
      - [Tide Predictions](https://tidesandcurrents.noaa.gov/tide_predictions.html)
  - [NOAA Center for Satellite Applications and Research](https://www.star.nesdis.noaa.gov/) (STAR)
    - [Geostationary Operational Environmental Satellite](https://www.star.nesdis.noaa.gov/GOES/) (GOES)
- [The National Aeronautics and Space Administration](https://www.nasa.gov/) (NASA)
  - [Global Hydrometeorology Resource Center (GHRC) Distributed Active Archive Center (DAAC)](https://ghrc.nsstc.nasa.gov/lightning/)
    - [GHRC DAAC Github](https://github.com/ghrcdaac)
  - [George C. Marshall Space Flight Center](https://www.nasa.gov/centers/marshall/)
    - [Marshall Space Flight Center - Earth Science Office](https://weather.msfc.nasa.gov/)
      - [More GOES images](https://weather.msfc.nasa.gov/GOES/)
- [The United States Geological Survey](https://www.usgs.gov/) (USGS)
  - The USGS [Earthquake Hazards Program](https://earthquake.usgs.gov/)
  - The USGS [Volcano Hazards Program](https://www.usgs.gov/programs/VHP)
  - [WaterWatch](https://waterwatch.usgs.gov/)
  - [Earth Resources Observation and Science Center](https://www.usgs.gov/centers/eros) (EROS)
- The United State Environmental Protection Agency (EPA)
- [The United States Department of Agriculture](https://www.usda.gov/) (USDA)
  - [The U.S. Forest Service](https://www.fs.usda.gov/) (USFS)
  - [Wildland Fire Assessment System](https://www.wfas.net/) (WFAS)
- [The Federal Emergency Management Agency](https://www.fema.gov) (FEMA)
  - [FEMA Flood Map Service Center](https://msc.fema.gov/portal/home)
- [National Geospatial-Intelligence Agency](https://www.nga.mil/) (NGA)
  - [NGA Office of Geomatics](https://earth-info.nga.mil/)
- [United States Naval Observatory](https://www.cnmoc.usff.navy.mil/usno/) (USNO)
  - [USNO Astronomical Applications Department](https://aa.usno.navy.mil/)
    - [Astronomical Applications API](https://aa.usno.navy.mil/data/api) - Sunrise, Sunset, Eclipses and Transits, Moon Phases
- [National Institute of Standards and Technology](https://www.nist.gov/) (NIST)
  - [Time.gov](https://www.time.gov/)

- The estate of Charles Abel-Lear a.k.a. [The Weather Chazz](https://www.youtube.com/user/theweatherchazz) (R.I.P., friend)
- [TWCClassics.com](https://www.twcclassics.com/)
- [Taiganet.com](https://www.taiganet.com/)
- [Blitzortung.org](https://www.blitzortung.org/)
- [Windy.com](https://www.windy.com/)
- [NullSchool](https://earth.nullschool.net/)
- [Michael Battaglia](https://github.com/vbguyny)
  - [Michael Battaglia's WeatherStar 4000+](https://battaglia.ddns.net/twc/)
- [Matt Walsh](https://github.com/netbymatt)
  - [Matt Walsh's WeatherStar 4000+](https://weatherstar.netbymatt.com/)
    - [Github](https://github.com/netbymatt/ws4kp) - Aw, heck! This is almost everything I want my project to be, except for the use of Luxon (If I ever fork this, I'll use Day.js)

This project and web site should NOT be used in life threatening weather situations, or be relied on to inform the public of such situations. The Internet is an unreliable network subject to server and network outages and by nature is not suitable for such mission critical use. If you require such access to NWS data, please consider one of their subscription services. The authors of this web site shall not be held liable in the event of injury, death or property damage that occur as a result of disregarding this warning.

The WeatherSTAR 4000 unit and technology is owned by The Weather Channel. This project is is a free, non-profit work by fans. The icons were created by Charles Abel and Nick Smith (http://twcclassics.com/downloads/icons.html) as well as by Malek Masoud. The fonts were originally created by Nick Smith (http://twcclassics.com/downloads/fonts.html).

**Learn how to set up Emergency Alerts on your phone. Visit https://www.weather.gov/wrn/ and be part of the Weather-Ready Nation!**