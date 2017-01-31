'use strict';

import React from 'react';
import { Link } from 'react-router';
import ReserveButton from './ReseveButton.js';
import io from 'socket.io-client';

const waitingWords = [
    "Fill in ID and Password of Teamviewer, and click \"submit\" button requesting for test",
    "Sending out request ...",
	"Your request has been processing\nPlease wait and keep Teamviewer running",
	"Lets's get started"
]

const alertClassName = [
    "hide",
    "alert alert-warning",
    "alert alert-danger"
]

const alertText = [
    "",
    "We are currently cannot connect to your computer, and we will keep trying to connect. Please reluanch Teamviewer and keep it runnning.",
    "Sorry, the test is unexpectly terminated. Please request test again if need."
]

var socket;

// Properties
//  channel ==> the channel name of the socket.io

export default class Reserve extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        ticketStatus: 'home',
        reserved: 0,
        alert: 0
    };
	  
	  this.reserveButtonHasBeenClicked = this.reserveButtonHasBeenClicked.bind(this);
  }
	
	// Reserved state 
	// 0 ===> not reserved or reserving
	// 1 ===> waiting for reserved
	// 2 ===> reserved, waiting to be tested
	// 3 ===> ticket done
    
	// Alert state 
	// 0 ===> No alert
	// 1 ===> unable to connect
	// 2 ===> test terminated unexpectly
	// 3 ===> ticket done
    
	tick(){
		this.setState((prevState) => ({
			ticketStatus: "waiting"
		 }));
	}
	
	reserveButtonHasBeenClicked(e) {
        
        switch(this.state.reserved) {
            case 0: 
                let teamViewerDetail = {
                    'id': document.getElementById('teamviewer-id').value,
                    'password': document.getElementById('teamviewer-pw').value
                }

                //send out request
                socket.emit('reserve test', teamViewerDetail);

                //Change UI
                this.setState((prevState) => ({
                    reserved: 1;
                }))
                break;
                
            case 2:
                
                
                break;
        }

		
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
		  
          if (!msg) {
              console.warn("Server can not create test request");
              return false;
          } 
          
          //run it when response is correct
		  socket.on(msg, msg => {
			  // msg.reserved 
              // msg.alert
              
              this.setState((prevState) => ({
                  reserved: msg.reserved ? msg.reserved : prevState.reserved,
                  alert: msg.alert ? msg.alert : prevState.alert
              }));
              
		  })
		  
		  this.setState((prevState) => ({
			  reserved: 2
		  }));
          
          this.props.channel = msg;
		  
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
                
                <div className="alert alert-success" role="alert">test test test</div>
                
			</form>
		);
	}
}


