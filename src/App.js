import React, { useState, useEffect } from "react";
import './App.css';

function RaceResults({ race }) {
  const constructorLogos = {
    "Alpine F1 Team": "/logos/alpine-f1-team.png",
    "Aston Martin": "/logos/aston-martin.png",
    "Ferrari": "/logos/ferrari.png",
    "Haas F1 Team": "/logos/haas-f1-team.png",
    "McLaren": "/logos/mclaren.png",
    "Mercedes": "/logos/mercedes.png",
    "RB F1 Team": "/logos/rb-f1-team.png",
    "Red Bull": "/logos/red-bull.png",
    "Sauber": "/logos/sauber.png",
    "Williams": "/logos/williams.png",
  };


  const [raceResults, setRaceResults] = useState([]);

  useEffect(() => {
    if (race) {
      setRaceResults(race.Results);
    }
  }, [race]);

  return (
    <div>
      <table>
        <tbody>
          {raceResults.map((result, index) => (
            <tr key={index}>
              <td className="position">{result.position}</td>
              <div className={result.Constructor.name.toLowerCase().replace(/\s+/g, "-")}>
                <td className="driverName">{result.Driver.givenName} <strong>{result.Driver.familyName.toUpperCase()}</strong></td>
                <td className="logos">
                  <img src={constructorLogos[result.Constructor.name]} alt={result.Constructor.name} />
                </td>
                <td className="teamName">{result.Constructor.name}</td>
              </div>
              <td className="time">{result.Time ? result.Time.time : result.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RaceHeader({ raceData, weatherInfo }) {
  return (
    <div className="race-header">
      <div className="raceInfo">
        <h2>{raceData.raceName}</h2>
        <p>{raceData.date}</p>
        <p>Round: {raceData.round}</p>
      </div>
      <div className="weatherBox">
        {weatherInfo && (
          <div>
            <h2>{weatherInfo.weather[0].main}</h2>
            <h2>{Math.round((weatherInfo.temp - 273.15) * 9 / 5 + 32)} °F</h2>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [raceData, setRaceData] = useState(null);
  const [weatherInfo, setWeatherInfo] = useState(null);

  useEffect(() => {
    fetchRaceResults();
  }, []);

  useEffect(() => {
    if (raceData) {
      fetchWeatherData(raceData.Circuit.Location.lat, raceData.Circuit.Location.long, new Date(raceData.date));
    }
  }, [raceData]);

  function fetchRaceResults() {
    fetch("http://ergast.com/api/f1/current/last/results.json")
      .then((response) => response.json())
      .then((data) => {
        const race = data.MRData.RaceTable.Races[0];
        setRaceData(race);
      });
  }

  function fetchWeatherData(latitude, longitude, date) {
    const apiKey = "92b1428d50f205626792593c7baddab5";
    const timestamp = Math.floor(date.getTime() / 1000);

    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${latitude}&lon=${longitude}&dt=${timestamp}&appid=${apiKey}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setWeatherInfo(data.data[0]);
      });
  }

  return (
    <div>
      {raceData && weatherInfo && (
        <RaceHeader raceData={raceData} weatherInfo={weatherInfo} />
      )}
      {raceData && (
        <RaceResults race={raceData} />
      )}
    </div>
  );
}

export default App;
