import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import "./App.css";
// import axios from "axios";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import { sortData, prettyPrintStat } from "./utils";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css"; //  removes +/- Leaflet link

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(1);

  //  Fills InfoBoxes with default worldwide total numbers
  useEffect(() => {
    // console.log("1st use effect");
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCountryInfo(data);
      });
  }, []);

  //  WHEN THE USER SELECTS A COUNTRY FROM THE DROPDOWN...
  const onCountryChange = async (e) => {
    console.log("onCountryChange")
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/countries"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setCountry(countryCode);
        setCountryInfo(data);
        console.log("country selection =="+data.country)
        console.log("long=="+data.countryInfo.long)
        // setMapCenter(data.countryInfo.lat, data.countryInfo.long);
        setMapCenter({lat: data.countryInfo.lat, lng: data.countryInfo.long});
        setMapZoom(10);
      });
  };

  useEffect(() => {
    // console.log("2nd use effect");
    const getCountriesData = async () => {
      await fetch(`https://disease.sh/v3/covid-19/countries`)
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso3,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          console.log(data);
          // data.forEach((c) => {
          //   if (c.countryInfo.iso3 == null) {
          //     // console.log(c);
          //   }
          // });
          setMapCountries(data);
        });
    };
    getCountriesData();

    //   axios.get(`https://disease.sh/v3/covid-19/countries`)
    //   .then(res => {
    //     console.log(res)
    //     setCountries(res.data)
    // })
    // .catch(err => {
    //     console.log(err)
    // })
  }, []);

  return (
    <div>
      <div className="app">
        <div className="app__left">
          <div className="app__header">
            <div>
              <h1> COVID 19 Tracker</h1>
            </div>

            <FormControl className="app__dropdown">
              <Select
                variant="outlined"
                value={country}
                onChange={onCountryChange}
                // key={country.value}
              >
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {countries.map((country, index) => (
                  <MenuItem value={country.value} key={index}>
                    {country.name}
                  </MenuItem>
                ))}
                {/* {countries.map((country, index) => {
                // if (!country.iso2 == null) {    // disregard 2 objects in the data with null values
                  return (
                    <MenuItem value={country.iso2} key={index}>
                      {country.country}
                    </MenuItem>
                  );
                // }
              })} */}
              </Select>
            </FormControl>
          </div>

          <div className="app__stats">
            <InfoBox
            onClick={() => setCasesType('cases')}
            active={casesType === "cases"}
            isRed
              title="Coronavirus Cases"
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={prettyPrintStat(countryInfo.cases)}
            />
            <InfoBox
            onClick={() => setCasesType('recovered')}
            active={casesType === "recovered"}
              title="Recovered"
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={prettyPrintStat(countryInfo.recovered)}
            />
            <InfoBox
            onClick={() => setCasesType('deaths')}
            active={casesType === "deaths"}
            isRed
              title="Deaths"
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={prettyPrintStat(countryInfo.deaths)}
            />
          </div>

          <Map
            casesType={casesType}
            center={mapCenter}
            zoom={mapZoom}
            countries={mapCountries}
          ></Map>
        </div>

        <Card className="app__right">
          <CardContent>
            <h3> Live Cases By Country</h3>
            <Table countries={tableData}></Table>
            <h3 style={{marginTop: "15px"}}> Worldwide New {casesType.charAt(0).toUpperCase()+ casesType.slice(1)}</h3>
            <LineGraph casesType={casesType}/>
          </CardContent>
        </Card>
      </div>

      {/* <hr ></hr> */}
      <div style={{marginTop: "30px"}}>
        <footer className="footer">
          data sourced from Worldometers via disease.sh API, updated every 10
          minutes
        </footer>
      </div>
    </div>
  );
}

export default App;
