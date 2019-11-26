import React, { Component } from 'react';
import Titles from './components/Titles';
import Form from './components/Form';
import Weather from './components/Weather';
import axios from 'axios';
import Card from './components/Card';
import { tsMethodSignature, tsIndexSignature } from '@babel/types';

const API_KEY = "fe7dc6f5538ed939abf8ada8328338ef"

// axios.post('http://ironrest.herokuapp.com/vitalii', {age: 24}).then(res => {
//   console.log(res.data)
// })



export default class App extends Component {





  state = {
    temperature: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    error: undefined,
  };





  getWeather = async (e) => {
    e.preventDefault();

    let city = e.target.elements.city.value;
    let country = e.target.elements.country.value;

    

    function fToC(fahrenheit) {
      var fTemp = fahrenheit;
      var fToCel = (fTemp - 32) * 5 / 9;
      var message = fTemp + '\xB0F is ' + fToCel + '\xB0C.';
      console.log(message);


    }


    // axios.post('http://ironrest.herokuapp.com/winningTransit/vitalii').then(res => {
    //   console.log(res.data)
    // })



    // axios.get('https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/ORD/SFO/2019-11-21/2019-11-30')
    // .then(res => {
    //  console.log(res.data)
    // })


    const RAPIDAPI_API_URL = 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/ORD/LAX/2019-11-23/2019-11-26';

    const RAPIDAPI_REQUEST_HEADERS = {
      'X-RapidAPI-Host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
      , 'X-RapidAPI-Key': '959cf265cfmsh1aab6486c8416f4p18ac02jsn366013c65ef6'
      , 'Content-Type': 'application/json'
    };


    axios.get(RAPIDAPI_API_URL, { headers: RAPIDAPI_REQUEST_HEADERS })

      .then(response => {

        const data = response.data;
        console.log('data', data);


      })
      .catch(error => console.error('create student error', error));

    //   fetchFlights = async (dispatch) => {
    //       try {
    //         const flights = await axios({
    //           url: ``,
    //           method: 'GET',
    //           headers: {"X-RapidAPI-Key": "959cf265cfmsh1aab6486c8416f4p18ac02jsn366013c65ef6"}
    //         })
    //         dispatch(getFlights(flights.data))
    //       } catch (error) {
    //         console.log(error)
    //       }
    //     }
    // }


    //  const fetchFlights = (endAirport, startAirport, startDate, endDate) => {
    //     return async (dispatch) => {
    //       try {
    //         const flights = await axios({
    //           url: `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/${startAirport}/${endAirport}/${startDate}/${endDate}`,
    //           method: 'GET',
    //           headers: {"X-RapidAPI-Key": "Your api key"}
    //         })
    //         dispatch(getFlights(flights.data))
    //       } catch (error) {
    //         console.log(error)
    //       }
    //     }
    //   }


    //   var unirest = require("unirest");

    // var req = unirest("GET", "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/ORD/SFO/2019-11-21/2019-11-30");

    // req.headers({
    // 	"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
    // 	"x-rapidapi-key": "959cf265cfmsh1aab6486c8416f4p18ac02jsn366013c65ef6"
    // });


    // req.end(function (res) {
    // 	if (res.error) throw new Error(res.error);

    // 	console.log(res.body);
    // });




    if (city && country) {
      let response = axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`)
        .then((response) => {
          console.log(response)

          this.setState({
            temperature: (response.data.main.temp * 1.8 + 32).toFixed(0) + "F",
            city: response.data.name,
            country: response.data.sys.country,
            humidity: response.data.main.humidity,
            description: response.data.weather[0].description,
            error: '',

          }, () => {
            console.log(this.state)
          }
          )
        })

        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
        });
      console.log(response)







    } else {
      this.setState({
        temperature: undefined,
        city: undefined,
        country: undefined,
        humidity: undefined,
        description: undefined,
        error: 'Please enter the value',

      }, () => {
        console.log(this.state)
      }
      )
    }
  }

  render() {
    return (
      <div>
        <div className="wrapper">
          <div className="main">
            <div className="container">
              <div className="row">
                <div className="col-5 title-container">
                  <Titles />

                </div>
                <div className="col-7 form-container">
                  <Form getWeather={this.getWeather} />

                  <Weather
                    temperature={this.state.temperature}
                    humidity={this.state.humidity}
                    city={this.state.city}
                    country={this.state.country}
                    description={this.state.description}
                    error={this.state.error}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

