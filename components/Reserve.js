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
];

const alertClassName = [
    "hide",
    "alert alert-warning",
    "alert alert-danger"
];

const alertText = [
    "",
    "We are currently cannot connect to your computer, and we will keep trying to connect. Please reluanch Teamviewer and keep it runnning.",
    "Sorry, the test is unexpectly terminated. Please request test again if need."
];

var socket;
let ticket;

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
	  
	  this.channel = "";
	  
	  this.reserveButtonHasBeenClicked = this.reserveButtonHasBeenClicked.bind(this);
     this.ticketHasBeenReserved = this.ticketHasBeenReserved.bind(this);
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
             let ticketHasBeenReserved = this.ticketHasBeenReserved;

             //send out request
      //                socket.emit('reserve', teamViewerDetail);

            this.setState((prevState) => ({
               reserved: 1
            }))

            $.ajax({
               type: "POST",
               url: "/api/create-ticket",
               data: {
                  tvID: document.getElementById('teamviewer-id').value,
                  tvPW: document.getElementById('teamviewer-pw').value
               },
               success: function( result ) {
                  console.log("Ticket ceated status: ", result);
                  ticketHasBeenReserved();
               }
            });

             break;

         case 2:
             socket.emit(this.channel, 'cancel');

             break;
      }

   }
	
  componentDidMount() {
//    this.interval = setInterval(() => this.tick(), 2000);
	  socket = io();
	  
	  socket.on('reserve', (msg) => {
		  
          if (!msg) {
              console.warn("Server can not create test request");
				 
                this.setState((prevState) => ({
                    reserved: 0
                }))
					 
              return false;
          } 
          
          //run it when response is correct
		  socket.on(msg, msg => {
			  // msg.reserved 
              // msg.alert
              if (msg == 'cancelled') {
					  this.setState((prevState) => ({
							reserved: 0
					  }));
					  
					  return;
				  }
			  
              this.setState((prevState) => ({
                  reserved: msg.reserved ? msg.reserved : prevState.reserved,
                  alert: msg.alert ? msg.alert : prevState.alert
              }));
              
		  })
		  
		  this.setState((prevState) => ({
			  reserved: 2
		  }));
          
          this.channel = msg;
		  
		  console.log("socket channel", msg, " is on");
	  })
//	  socket.on()
  }	 
   
   ticketHasBeenReserved() {
      this.setState((prevState) => ({
        reserved: 2
      }))
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
				 <p className="help-block">{waitingWords[this.state.reserved]}</p>
			  </div>
			  <div>
				  <ReserveButton reserved={this.state.reserved} onClick={this.reserveButtonHasBeenClicked} />
			  </div>
                
                <div className={alertClassName[this.state.alert]} role="alert">{alertText[this.state.alert]}</div>
                
			</form>
		);
	}
}


