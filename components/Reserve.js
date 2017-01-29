'use strict';

import React from 'react';
import { Link } from 'react-router';
import ReserveButton from './ReseveButton.js';
import io from 'socket.io-client';

const waitingWords = {
	"waiting" : "Your request has been processing\nPlease wait and keep Teamviewer running",
	"home" : "Lets's get started",
	"sending" : "Sending test request"
}

var socket;

export default class Reserve extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		 ticketStatus: 'home',
		 reserved: 0
					  };
	  
	  this.reserveButtonHasBeenClicked = this.reserveButtonHasBeenClicked.bind(this);
  }
	
	// Reserved state 
	// 0 ===> not reserved or reserving
	// 1 ===> wait for reserved
	// 2 ===> reserved, waiting to be tested
	// 3 ===> ticket done
	
	tick(){
		this.setState((prevState) => ({
			ticketStatus: "waiting"
		 }));
	}
	
	reserveButtonHasBeenClicked(e) {
		let teamViewerDetail = {
			'id': document.getElementById('teamviewer-id').value,
			'password': document.getElementById('teamviewer-pw').value
		}
		
		//send out request
		socket.emit('reserve test', teamViewerDetail);
		
		//Toolge
		//Just for testing
//		this.setState((prevState) => ({
//			reserved: !prevState.reserved
//		}));
	}
	
  componentDidMount() {
//    this.interval = setInterval(() => this.tick(), 2000);
	  socket = io();
	  
	  socket.on('reserve test', (msg) => {
		  
		  socket.on(msg, msg => {
			  
		  })
		  
		  this.setState((prevState) => ({
			  reserved: true
		  }));
		  
		  console.log("socket channel", msg, " is on");
	  })
//	  socket.on()
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


