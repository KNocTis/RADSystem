'use strict';

import React from 'react';
import { Link } from 'react-router';
import ReserveButton from './ReseveButton.js';
import io from 'socket.io-client';

const waitingWords = [
   "Fill in ID and Password of Teamviewer, and click \"submit\" button requesting for test",
   "Sending out request ...",
   "Your request has been processing\nPlease wait and keep Teamviewer running",
   "Test is finished",
   "One of IT took the test, and you will be connected soon.",
   "Test is cancelled",
   "Canceling the test..."
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

let socket;
let ticket

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
      this.ticketHasBeenRCancelled = this.ticketHasBeenRCancelled.bind(this);
   }
	
	// Reserved state 
	// 0 ===> not reserved or reserving
	// 1 ===> waiting for reserved
	// 2 ===> reserved, waiting to be tested
	// 3 ===> ticket done
	// 4 ===> Someone took the test, and we will be connnected soon
	// 5 ===> Ticket is canncelled
   // 6 ===> Ticket is cancelling

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

         case 0: // ======> Submit test request

             let teamViewerDetail = {
                 'id': document.getElementById('teamviewer-id').value,
                 'password': document.getElementById('teamviewer-pw').value
             }
             let ticketHasBeenReserved = this.ticketHasBeenReserved;

             //send out request
      //                socket.emit('reserve', teamViewerDetail);

            this.setState((prevState) => ({
               reserved: 1,
               alert: 0
            }))

            $.ajax({
               type: "POST",
               url: "/api/create-ticket",
               data: {
                  tvID: document.getElementById('teamviewer-id').value,
                  tvPW: document.getElementById('teamviewer-pw').value
               },
               success: function( result ) {
                  ticket = result;
                  console.log("Ticket ceated status: ", ticket);
                  ticketHasBeenReserved();
               }
            });

             break;

         case 2: // ==========> Cancel test
//             socket.emit(this.channel, 'cancel');
            let ticketHasBeenRCancelled = this.ticketHasBeenRCancelled;
            
            this.setState((prevState) => ({
              reserved: 4
            }));
            
            $.ajax({
               type: "POST",
               url: "/api/cancel-ticket",
               data: ticket,
               success: function( result ) {
                  console.log("Ticket ceated status: ", result);
                  ticketHasBeenRCancelled();
               }
            });
            
            break;
      }

   }
	
  componentDidMount() {
//    this.interval = setInterval(() => this.tick(), 2000);
	  socket = io();
	  
//	  socket.on('reserve', (msg) => {
//		  
//          if (!msg) {
//              console.warn("Server can not create test request");
//				 
//                this.setState((prevState) => ({
//                    reserved: 0
//                }))
//					 
//              return false;
//          } 
//          
//          //run it when response is correct
//		  socket.on(msg, msg => {
//			  // msg.reserved 
//              // msg.alert
//              if (msg == 'cancelled') {
//					  this.setState((prevState) => ({
//							reserved: 0
//					  }));
//					  
//					  return;
//				  }
//			  
//              this.setState((prevState) => ({
//                  reserved: msg.reserved ? msg.reserved : prevState.reserved,
//                  alert: msg.alert ? msg.alert : prevState.alert
//              }));
//              
//		  })
//		  
//		  this.setState((prevState) => ({
//			  reserved: 2
//		  }));
//          
//          this.channel = msg;
//		  
//		  console.log("socket channel", msg, " is on");
//	  })
////	  socket.on()
  }
   
   ticketHasBeenReserved() {
      this.setState((prevState) => ({
        reserved: 2
      }))
      
      socket.on(ticket.ticketNumber, resultTicket => {
         
         console.log("Socketio broadcast messgae received", resultTicket);
         
         switch (resultTicket.status) {
            case 1: //====================> Some one is on it
               this.setState((prevState) => ({
                  reserved: 4,
                  alert: 0
               }))
               break;
            case 2: //============> Failed to connect, waiting for feedback from cnosultant
               //Pop alert
               this.setState((prevState) => ({
                  alert: 1
               }))
               break;
            case 3: //====================> Done
               this.setState((prevState) => ({
                  reserved: 3,
                  alert: 0
               }))
               break; 
            case 5: //====================> Terminated by IT
               this.setState((prevState) => ({
                  reserved: 5,
                  alert: 2
               }))
               break; 
         }

      });
      
      console.log("Socketio channel created ", ticket.ticketNumber);
   }
   
   ticketHasBeenRCancelled() {
      this.setState((prevState) => ({
        reserved: 0
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


