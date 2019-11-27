import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// export default React.PureComponent;
// export const pureComponentAvailable = true;

import registerServiceWorker from './registerServiceWorker';
// import logo from './images/vectorpaint.svg';
// import { Plane } from '@bit/mhnpd.react-loader-spinner.plane';
// import { getRandomColor } from '@bit/joshk.jotils.get-random-color'

import Loader from 'react-loader-spinner'
import Plane from 'react-loader-spinner'


import Flight from './Flight';
import Currency from './Currency';
import Form from './components/Form';
import Weather from './components/Weather';

import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment'


import './css/index.css';
import { tickets } from './data/tickets.json';
import airports from './data/airports.json';
import Calendar from 'react-calendar';
import axios from 'axios'
// const openflights = require("openflights-cached");

// console.log(openflights.findIATA("PEK").name);

const API_KEY = "fe7dc6f5538ed939abf8ada8328338ef"

console.log('hihihih')

Date.prototype.addDays = function (days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
}



var date = new Date();

let d = date.addDays(7)

console.log(date, d)
class Tickets extends Component {
	constructor() {
		super();

		this.state = {
			transfers: [true, true, true, true],
			exchange: ["USD", "EUR"],
			currencies: [{
				name: "Get Tickets",
				rate: 1,
				active: true,
			}],
			quotes: [],
			data: [],
			places: [],
			cityFrom: [],
			cityTo: [],
			carriers: [],
			loading: false,
			temperature: undefined,
			city: undefined,
			country: undefined,
			humidity: undefined,
			description: undefined,
			error: undefined,
			startDate: moment(),
			endDate: moment().add(3, 'days'),

			logos: [
				{ 'logo': './images/alaska.svg', carrierId: 851 },
				{ 'logo': './images/JetBlue.svg', carrierId: 870 },
				{ 'logo': './images/frontier.svg', carrierId: 1065 },
				{ 'logo': './images/spirit.svg', carrierId: 1467 },
				{ 'logo': './images/sun.png', carrierId: 1721 },
				{ 'logo': './images/united.svg', carrierId: 1793 },

			]

		}
	}

	getWeather = async (e) => {
		e.preventDefault();
		console.log('calling the get weather function')

		let cityTo = e.target.elements.cityTo.value;
		console.log(cityTo)
		// let country = e.target.elements.country.value;


		function fToC(fahrenheit) {
			var fTemp = fahrenheit;
			var fToCel = (fTemp - 32) * 5 / 9;
			var message = fTemp + '\xB0F is ' + fToCel + '\xB0C.';
			console.log(message);

		}



		if (cityTo) {
			let response = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityTo},us&appid=${API_KEY}&units=metric`)
				.then((response) => {
					console.log(response)

					this.setState({
						cityTo: response.data.name,
						temperature: "It's " + (response.data.main.temp * 1.8 + 32).toFixed(0) + `F` + ` in ${cityTo}`,
						// country: response.data.sys.country,
						humidity: response.data.main.humidity,
						description: response.data.weather[0].description,
						error: '',

					}, () => {

						axios.post('https://ironrest.herokuapp.com/tickets-app',
							{
								temperature: this.state.temperature,
								city: this.state.cityTo,
								description: this.state.description,
								humidity: this.state.humidity,
							}
						).then(res => {
							console.log(res.data)
						})


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
				cityTo: undefined,
				// country: undefined,
				humidity: undefined,
				description: undefined,
				error: 'Please enter the value',

			}, () => {
				console.log(this.state)
			}
			)
		}
	}

	getCities = async (e) => {
		e.preventDefault();
		console.log('calling get cities function')

		this.setState({ loading: true })

		let cityTo = e.target.elements.cityTo.value;
		// let endDate = e.target.elements.endDate.value;
		// let startDate = e.target.elements.startDate.value;
		let endDate = this.state.endDate.format('YYYY-MM-DD')
		let startDate = this.state.startDate.format('YYYY-MM-DD')
		console.log(endDate, startDate)
		//2019-09-01


		console.log(cityTo)

		let cityFrom = e.target.elements.cityFrom.value;


		let airportTo = airports.find(airport => {
			return (airport.city == cityTo || airport.code == cityTo)
		})

		let airportFrom = airports.find(airport => {
			return (airport.city == cityFrom || airport.code == cityFrom) // airport.state == cityFrom ||
		})


		console.log(airportTo, airportFrom)
		let to = airportTo ? airportTo.code : cityTo
		let from = airportFrom ? airportFrom.code : cityFrom


		if (cityTo && cityFrom && endDate && startDate) {

			const RAPIDAPI_API_URL = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/${to}/${from}/${startDate}/${endDate}`;

			const RAPIDAPI_REQUEST_HEADERS = {
				'X-RapidAPI-Host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
				, 'X-RapidAPI-Key': '959cf265cfmsh1aab6486c8416f4p18ac02jsn366013c65ef6'
				, 'Content-Type': 'application/json'
			};

			let request = axios.get(RAPIDAPI_API_URL, { headers: RAPIDAPI_REQUEST_HEADERS })

				.then(response => {

					const data = response.data;
					console.log('data', data, cityTo, cityFrom);
					let firstCity = data.Places.find(eachPlace => {
						return eachPlace.CityId.includes(cityTo) || eachPlace.CityName.includes(cityTo);
					})
					let secondCity = data.Places.find(eachPlace => {
						return eachPlace.CityId.includes(cityFrom) || eachPlace.CityName.includes(cityFrom);;
					})


					this.setState({
						quotes: data.Quotes,
						data: data,
						places: data.Places,
						cityFrom: firstCity.CityName,
						cityTo: secondCity.CityName,
						carriers: data.Carriers,
						loading: false
					})

				})
				.catch(error => {
					console.error('create student error', error.response)
					alert(JSON.stringify(error.response.data))
				})
		}
	}


	getCarriers = (e) => {
		let copyCarriers = [...this.state.carriers]
		if (copyCarriers.length > 0) {
			// console.log(copyCarriers)

			return (copyCarriers.map((keyName, i) => (
				<li className="travelcompany-input" key={i}>
					<span className="input-label">
						Id: {keyName.CarrierId} <br />
						Name: {keyName.Name}
					</span>
					{/* {this.showPlaces()} */}
				</li>
			)
			))
		}
	}




	showPrices = (e) => {

		// e.preventDefault()

		// let cityFrom = e.target.elements.cityFrom.value;
		// let cityTo = e.target.elements.cityTo.value;

		// console.log(cityFrom)
		// console.log(cityTo)







		//Form component
		// class ContactForm extends React.Component {
		// 	constructor(props) {
		// 	  super(props);
		// 	  this.state = {
		// 		name: '',
		// 		email:''
		// 	  };

		// 	  this.handleChange = this.handleInputChange.bind(this);
		// 	  this.handleSubmit = this.handleSubmit.bind(this);
		// 	}

		// 	handleInputChange(event) {
		// 	  const target = event.target;
		// 	  const value = target.type === 'checkbox' ? target.checked : target.value;
		// 	  const name = target.name;

		// 	  this.setState({
		// 		[name]: value
		// 	  });
		// 	  console.log('Change detected. State updated' + name + ' = ' + value);
		// 	}

		// 	handleSubmit(event) {
		// 	  alert('A form was submitted: ' + this.state.name + ' // ' + this.state.email);
		// 	  event.preventDefault();
		// 	}

		// 	render() {
		// 	  return (
		// 		<div>
		// 		  <form onSubmit={this.handleSubmit} >
		// 			<div className="form-group">
		// 			  <label for="nameImput">Name</label>
		// 			  <input type="text" name="name" value={this.state.name} onChange={this.handleChange} className="form-control" id="nameImput" placeholder="Name" />
		// 			</div>
		// 			<div className="form-group">
		// 			  <label for="emailImput">Name</label>
		// 			  <input name="email" type="email" value={this.state.email} onChange={this.handleChange} className="form-control" id="emailImput" placeholder="email@domain.com" />
		// 			</div>
		// 			<input type="submit" value="Submit" className="btn btn-primary" />
		// 		  </form>
		// 		</div>
		// 	  )
		// 	}
		//   }


		// Places.PlaceId

		// [2].InboundLeg.DestinationId



		let copyQuotes = [...this.state.quotes]
		if (copyQuotes.length > 0) {
			console.log(copyQuotes)
			return (copyQuotes.map((keyName, i) => {
				let logo = this.state.logos.filter(eachCompany => {
					return eachCompany.carrierId === keyName.InboundLeg.CarrierIds[0]
				})
				// console.log(logo[0].logo, '90909090')

				return (





					<div className="flight flex">

						<div className="flight-buy">
							{logo[0] ?
								<img src={logo[0].logo} className="airline-logo" alt="Turkish airlines" />
								:
								<img src='./images/alaska.svg' className="airline-logo" alt="Alaska airlines" />

							}
							<button>

								{keyName.MinPrice} USD
					  </button>
						</div>
						<div className="flight-info flex">
							<div>
								{/* <h3></h3> */}
								<span>{this.state.cityTo}</span>
								<span className="gray">
									{/* { departure } */}
									Inbound
						  </span>
							</div>
							<div>
								<span className="gray">
									{/* {keyName.MinPrice} */}
									🛫
						  </span>
							</div>
							<div>
								{/* <h3></h3> */}
								<span>{this.state.cityFrom}</span>
								<span className="gray">
									Inbound
						  </span>
							</div>
						</div>

						<div className="flight-info2 flex2">
							<div>
								{/* <h3></h3> */}
								<span>{this.state.cityFrom}</span>
								<span className="gray">
									{/* { departure } */}
									Outbound
						  </span>
							</div>
							<div>
								<span className="gray">
									{/* {keyName.MinPrice} USD */}
									🛬
						  </span>
							</div>
							<div>
								{/* <h3></h3> */}
								<span>{this.state.cityTo}</span>
								<span className="gray">
									Outbound
						  </span>
							</div>
						</div>


					</div>











					// <div className="flight flex">
					// 	<div className="flight-buy" key={i}>

					// 		{/* <li className="travelcompany-input" > */}
					// 		<span className="input-label">
					// 			<img src={logo} className="airline-logo" alt="Turkish airlines" />


					// 			<button>
					// 			{keyName.MinPrice} 
					// 			</button>


					// 			<div className="flight-info flex">
					// 				<div>
					// 					<h3> 2</h3>
					// 					<span>{this.state.cityFrom}</span>
					// 					<span className="gray">

					// 					</span>
					// 				</div>
					// 				<div>
					// 					<span className="gray">
					// 						{/* {transfers(tickets.stops)} */}
					// 					</span>
					// 				</div>
					// 				<div>
					// 					<h3> 2</h3>
					// 					<span>{this.state.cityTo}</span>
					// 					<span className="gray">

					// 					</span>
					// 				</div>
					// 			</div>



					// 			{/* From: {this.state.cityFrom} <br />
					// 			To: {this.state.cityTo} <br />
					// 			Min price: {keyName.MinPrice} <br />
					// 			Carrier: {keyName.InboundLeg.CarrierIds[0]} <br />
					// 			Airplane: {airplane.Name} <br />
					// 			key: {i} */}
					// 		</span>
					// 		{/* {this.showPlaces()} */}
					// 		{/* </li> */}
					// 	</div>
					// </div>
				)
			}
			))
		}
	}

	showPlaces = (e) => {


		let copyPlaces = [...this.state.places]
		if (copyPlaces.length > 0) {
			// console.log(copyPlaces[0])
			console.log('log ' + this.state.places)
			// console.log('fdsf', this.state.data.Places[0].CityName)

			return (copyPlaces.map((keyName, i) => (
				<li className="travelcompany-input" key={i}>
					<span className="input-label">

						From: {this.state.cityFrom} <br />
						Places: {keyName.CityName} <br />
						Place: {this.state.places.CityName} <br />

						key: {i}
					</span>
				</li>

			)
			))
		}
	}





	setTransfers(value) {
		this.setState((prevState) => {
			prevState.transfers[value] = !prevState.transfers[value];

			return ({
				transfers: prevState.transfers,
			})
		});
	}

	setCurrency(currency) {
		let currencies = this.state.currencies.map(({ ...item }) => {
			item.active = (item.name === currency) ? true : false;
			return item;
		});

		this.setState({
			currencies: currencies
		});
	}


	setDate = ({ startDate, endDate }) => {
		this.setState({ startDate, endDate })


	}

	render() {


		return (




			<div className="flex">
				<div className="select">
					<span>Find the Tickets</span>





					<form onSubmit={(e) => { this.getCities(e); this.getWeather(e) }}>
						{/* <Calendar name='dateStart' onChange={this.onChange} value={this.state.date} />
						<Calendar name='endDate' onChange={this.onChange} value={this.state.date} /> */}




						<div class="booking-form">




							<div class="form-group">
								<span class="form-label">Flying from</span>
								<input className="form-control" type="text" name='cityFrom' placeholder="From..." />
							</div>

							<div class="form-group">
								<span class="form-label">Flying to</span>
								<input className="form-control" type="text" name='cityTo' placeholder="To..." />
							</div>






						




						<DateRangePicker className='dateForm'
							startDate={this.state.startDate} // momentPropTypes.momentObj or null,
							startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
							endDate={this.state.endDate} // momentPropTypes.momentObj or null,
							endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
							onDatesChange={({ startDate, endDate }) => this.setDate({ startDate, endDate })}//this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
							focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
							onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
						/>



						<div className="form-btn">
							<button className="submit-btn">Show flights 
							 </button>
						</div>

						{/* <button></button> */}



						</div>

					</form>
					
					{/* <Currency currencies={this.state.currencies} handler={this.setCurrency.bind(this)} /> */}





					<Weather
						temperature={this.state.temperature}
						humidity={this.state.humidity}
						city={this.state.cityFrom}
						// country={this.state.country}
						description={this.state.description}
						error={this.state.error}
					/>



					{/* <span>Transfers</span> */}

					{/* {this.getCarriers()} */}
					{/* 
					{this.showData()}
					{this.showPlaces()} */}
					{/* <hr /> */}
					{/* {this.showPrices()} */}

					{/* {
						this.state.transfers.map((item, i) =>
							<div className="transfers" key={i}>
								<input
									id={`ch-${i}`}
									type="checkbox"
									checked={this.state.transfers[i]}
									onChange={() => this.setTransfers(i)}
								/>
								<label htmlFor={`ch-${i}`}>
									{
										` ${(!i) ? "Without" : i} Transfer${(i > 1 || !i) ? "s" : ""}`
									}
								</label>
							</div>
						)
					} */}


				</div>

				<div className="tickets">


					{this.state.loading ?
						<Loader
							type="Plane"
							color="#00BFFF"
							height={100}
							width={100}
							timeout={5000} //5 secs

						/>
						: ''
					}
					{this.showPrices()}



				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<Tickets />,
	document.getElementById('root')
);

registerServiceWorker();
