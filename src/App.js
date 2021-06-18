import './App.css';
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import { useEffect, useState } from 'react';
import axios from 'axios';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from './utils';
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('Worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [typeOfCase, setTypeOfCase] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapzoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getAllCountries = async () => {

      const { data } = await axios.get('https://disease.sh/v3/covid-19/countries');

      const countries = data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2
      }));

      const sortedData = sortData(data);
      setTableData(sortedData);
      setMapCountries(data);
      setCountries(countries);
    }

    getAllCountries();

  }, []);

  const onChangeCountry = async (e) => {

    const countryCode = e.target.value;
    setSelectedCountry(countryCode);

    const url = countryCode === 'Worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    const { data } = await axios.get(url);

    setCountryInfo(data);
    setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
    setMapzoom(4);
  }

  const renderedCountries = countries.map((country) => (
    <MenuItem value={country.value}>{country.name}</MenuItem>
  ));

  return (

    <div className="app">

      <div className="app__left">

        {/* Title + DropDown */}
        <div className="app__header">
          <h1>COVID 19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onChangeCountry} value={selectedCountry}>
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {renderedCountries}
            </Select>
          </FormControl>
        </div>


        {/* Box */}
        <div className="app__box">
          <InfoBox
            active={typeOfCase === "cases"}
            onClick={(e) => setTypeOfCase("cases")}
            title="Coronavirus Cases"
            isRed
            curCases={prettyPrintStat(countryInfo.todayCases)}
            totalCases={prettyPrintStat(countryInfo.cases)} />
          <InfoBox
            active={typeOfCase === "recovered"}
            onClick={(e) => setTypeOfCase("recovered")}
            title="Recovered Cases"
            curCases={prettyPrintStat(countryInfo.todayRecovered)}
            totalCases={prettyPrintStat(countryInfo.recovered)} />
          <InfoBox
            active={typeOfCase === "deaths"}
            onClick={(e) => setTypeOfCase("deaths")}
            isRed
            title="Deaths"
            curCases={prettyPrintStat(countryInfo.todayDeaths)}
            totalCases={prettyPrintStat(countryInfo.deaths)} />
        </div>

        {/* Map */}
        <Map
          countries={mapCountries}
          casesType={typeOfCase}
          center={mapCenter}
          zoom={mapZoom}
        />


      </div>

      <Card className="app__right">
        <CardContent>
          {/* Table */}
          <h3>Live Cases by Country</h3>
          <Table tableData={tableData} />

          {/* Graph */}
          <h3>Worldwide new {typeOfCase}</h3>
          <LineGraph casesType={typeOfCase} />

        </CardContent>
      </Card>

    </div>
  );
}

export default App;
