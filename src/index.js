import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
// import logo from './images/vectorpaint.svg';

import Flight from './Flight';
import Currency from './Currency';

import './css/index.css';
import { tickets } from './data/tickets.json';
import axios from 'axios'

class Tickets extends Component {
	constructor() {
		super();

		this.state = {
			transfers: [true, true, true, true],
			exchange: ["USD", "EUR"],
			currencies: [{
				name: "USD",
				rate: 1,
				active: true,
			}],
			quotes: [],
			data: [],
			places: [],
			cityFrom: [],
			cityTo: [],
			carriers: [],

			logos : [
				{'logo':'./images/united.svg', carrierId: 1793},
				// {'American':'./images/american.svg'},
				{'logo':'./images/alaska.svg', carrierId: 851},
				{'logo':'./images/frontier.svg', carrierId: 1065},
				{'logo':'./images/spirit.svg', carrierId: 1467},




			]

		}
	}

	componentDidMount() {


		const RAPIDAPI_API_URL = 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/MIA/ORD/2019-11-26/2019-12-01';

		const RAPIDAPI_REQUEST_HEADERS = {
			'X-RapidAPI-Host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
			, 'X-RapidAPI-Key': '959cf265cfmsh1aab6486c8416f4p18ac02jsn366013c65ef6'
			, 'Content-Type': 'application/json'
		};


		axios.get(RAPIDAPI_API_URL, { headers: RAPIDAPI_REQUEST_HEADERS })

			.then(response => {

				const data = response.data;
				console.log('data', data);

				this.setState({
					quotes: data.Quotes,
					data: data,


				}, () => {
					console.log('state', this.state)
				}
				)

				this.setState({
					places: data.Places,
					data: data,

				},
				)

				this.setState({
					data: data,
					cityFrom: this.state.data.Places[0].CityName,
					cityTo: this.state.data.Places[1].CityName,

				},
				)

				this.setState({
					carriers: data.Carriers,
				}, () => {
					console.log('carriers', this.state.carriers)
				}
				)

			})
			.catch(error => console.error('create student error', error));
	}


	getCarriers = (e) => {
		let copyCarriers = [...this.state.carriers]
		if (copyCarriers.length > 0) {
			console.log(copyCarriers)

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
  
  






		let copyQuotes = [...this.state.quotes]
		if (copyQuotes.length > 0) {
			console.log(copyQuotes)
			return (copyQuotes.map((keyName, i) => {
					let logo = this.state.logos.filter(eachCompany => {
						return eachCompany.carrierId === keyName.InboundLeg.CarrierIds[0]
					})
				console.log(logo[0].logo, '90909090')
				return (





					<div className="flight flex">
						<div className="flight-buy">
							<img src={logo[0].logo} className="airline-logo" alt="Turkish airlines" />
							<button>

								{keyName.MinPrice} USD
					  </button>
						</div>
						<div className="flight-info flex">
							<div>
								{/* <h3></h3> */}
								<span>{this.state.cityFrom}</span>
								<span className="gray">
									{/* { departure } */}
									Inbound
						  </span>
							</div>
							<div>
								<span className="gray">
									{keyName.MinPrice} USD
						  </span>
							</div>
							<div>
								{/* <h3></h3> */}
								<span>{this.state.cityTo}</span>
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
									{keyName.MinPrice} USD
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
			console.log(copyPlaces[0])
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



	render() {
		const currency = this.state.currencies.find(({ active }) => active);

		const sortedTickets = tickets.sort((a, b) => {
			const val1 = parseInt(a.departure_time.replace(":", ""), 10);
			const val2 = parseInt(b.departure_time.replace(":", ""), 10);

			return val1 - val2;
		});

		return (











			<div className="flex">
				<div className="select">
					<span>Find the Tickets</span>

					<form onSubmit={this.props.getWeather}>
                <input type="text" name='city' placeholder="From..."/>
                <input type="text"  name='country' placeholder="To..." />
                <button>Get Tickets</button>
                
            </form>
					<Currency currencies={this.state.currencies} handler={this.setCurrency.bind(this)} />
					<span>Transfers</span>

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

					{this.showPrices()}
					{
						sortedTickets.map((item, i) => {
							if (this.state.transfers[item.stops]) {
								return <Flight key={i} tickets={item} currency={currency} />
							}

							return null;
						})
					}
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
