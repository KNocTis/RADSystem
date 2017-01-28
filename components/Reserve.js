'use strict';

import React from 'react';
import { Link } from 'react-router';
import ReserveButton from './ReseveButton.js';

const waitingWords = {
	"waiting" : "Your request has been processing\nPlease wait and keep Teamviewer running",
	"home" : "Lets's get started",
	"sending" : "Sending test request"
}

export default class Reserve extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		 ticketStatus: 'home',
		 reserved: false
					  };
	  
	  this.reserveButtonHasBeenClicked = this.reserveButtonHasBeenClicked.bind(this);
  }
	
	tick(){
		this.setState((prevState) => ({
			ticketStatus: "waiting"
		 }));
	}
	
	reserveButtonHasBeenClicked(e) {
		//send out ajax request
		
		//Toolge
		//Just for testing
		this.setState((prevState) => ({
			reserved: !prevState.reserved
		}));
	}
	
  componentDidMount() {
//    this.interval = setInterval(() => this.tick(), 2000);
  }	 
	
	render () {
		return (
			<form id="reserve-request">
				<div className="id-password">
				  <div className="form-group">
					 <label htmlFor="teamviewer-id">TeamViewer ID</label>
					 <input type="number" className="form-control text-center" id="teamviewer-id" placeholder="ID"/>
				  </div>
				  <div className="form-group">
					 <label htmlFor="teamviewer-pw">Password</label>
					 <input type="text" className="form-control text-center" id="teamviewer-pw" placeholder="Password"/>
				  </div>
				</div>
			  <div className="form-group">
				 <p className="help-block">{waitingWords[this.state.ticketStatus]}</p>
			  </div>
			  <div>
				  <ReserveButton reserved={this.state.reserved} onClick={this.reserveButtonHasBeenClicked} />
			  </div>
			</form>
		);
	}
}


