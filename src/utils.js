import React from 'react';
import { Circle, Popup } from "react-leaflet";
import numeral from "numeral";

const casesTypeColors = {
    cases: {
      hex: "#CC1034",
      multiplier: 300,
    },
    recovered: {
      hex: "#7dd71d",
      multiplier: 500,
    },
    deaths: {
      hex: "#fb4443",
      multiplier: 900,
    },
  };

  export const sortData = (data) => {
      const sortedData = [...data];
  
      // sortedData.sort((a,b) => {
      //     if (a.cases > b.cases) {
      //         return -1;
      //     } else {
      //         return 1;
      //     }
      // })
      // return sortedData;
  
      return sortedData.sort((a,b) => a.cases > b.cases ? -1 : 1)
  }
  

  //  DRAW circles on map with interactive Tooltip
export const showDataOnMap = (data, casesType) => // NO CURLY BRACES!!!!
data.map((country, index) => (

  <Circle
    // key={country.countryInfo.iso3}
    key={index}
    center={[country.countryInfo.lat, country.countryInfo.long]}
    color={casesTypeColors[casesType].hex}
    fillColor={casesTypeColors[casesType].hex}
    fillOpacity={0.4}
    radius={
      Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
    }
  >
    <Popup>
      <div className="info-container">
        <div
          className="info-flag"
          style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
        ></div>
        <div className="info-name">{country.country}</div>
        <div className="info-confirmed">
          Cases: {numeral(country.cases).format("0,0")}
        </div>
        <div className="info-recovered">
          Recovered: {numeral(country.recovered).format("0,0")}
        </div>
        <div className="info-deaths">
          Deaths: {numeral(country.deaths).format("0,0")}
        </div>
      </div>
    </Popup>
  </Circle>
));

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";