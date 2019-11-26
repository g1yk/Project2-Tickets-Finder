import React, { Component } from 'react'

export default class getWeather extends Component {

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
                
            </div>
        )
    }
}
