'use strict';

import React from 'react';
import { Link } from 'react-router';
import ReserveButton from './ReseveButton.js';
import StatusPrompt from './StatusPrompt.js';
import io from 'socket.io-client';
import Push from 'push.js';



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

const hexColor = {
   red: "#e73e3a", //银朱
   green: '#e4cf8e', //甘草黄
   yellow: '#90caaf' //三绿
}

let socket;
let ticket;

// Properties
//  channel ==> the channel name of the socket.io

export default class Reserve extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         ticketStatus: 'home',
         reserved: 0,
         alert: 0,
         waitingCount: 9999
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
    
	validTeamviewerDetail(){
      console.log("length of tvID: ", document.getElementById('teamviewer-id').value.length);
      if (document.getElementById('teamviewer-id').value.length >= 9 && document.getElementById('teamviewer-id').value.length <= 10){
         return true;
      }
      
      return false;
   }
	
   reserveButtonHasBeenClicked(e) {

      switch(this.state.reserved) {

         case 0: // ======> Submit test request
            if(!this.validTeamviewerDetail()) {
               console.warn("Invalid teamviewer ID and password!");
               //Pop up warning
               alert("The ID and password you filled in may not be right, please check it again before submit, thanks.");
               break;
            }
            
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
               data: {
                  ticket: ticket,
                  type: 0
               },
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

  }
   
   ticketHasBeenReserved() {
      this.setState((prevState) => ({
        reserved: 2
      }))
      
      socket.on(ticket.ticketNumber, resultTicket => {
         
         console.log("Socketio broadcast messgae received", resultTicket);
         
         if (resultTicket.waitingCount) {
            
            //handle
            this.setState((prevState) => ({
               waitingCount: resultTicket.waitingCount
            }))
            
            return true;
         }
         
         if (resultTicket.notification) {
           // Let's check if the browser supports notifications
           if (!("Notification" in window)) {
             alert("This browser does not support desktop notification");
           }

           // Let's check whether notification permissions have already been granted
           else if (Notification.permission === "granted") {
             // If it's okay let's create a notification
             var notification = new Notification("Hi there!");
           }

           // Otherwise, we need to ask the user for permission
           else if (Notification.permission !== "denied") {
             Notification.requestPermission(function (permission) {
               // If the user accepts, let's create a notification
               if (permission === "granted") {
                 var notification = new Notification("Hi there!");
               }
             });
           }

           // At last, if the user has denied notifications, and you 
           // want to be respectful there is no need to bother them any more.
         }
         
         
         switch (resultTicket.status) {
            case 1: //====================> Some one is on it
               this.setState((prevState) => ({
                  reserved: 4,
                  alert: 0
               }))
               window.onbeforeunload = ()=>{};
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
      
      window.onbeforeunload = (e) => {
         if (ticket.status == 0 || ticket.status == 2) {
            window.onbeforeunload = (e) => {
               $.ajax({
                  type: "POST",
                  url: "/api/cancel-ticket",
                  data: {
                     ticket: ticket,
                     type: 1
                  }
               });
            }
         }
      }
      
      console.log("Socketio channel created ", ticket.ticketNumber);
   }
   
   ticketHasBeenRCancelled() {
      this.setState((prevState) => ({
        reserved: 0
      }))
   }
	
	render () {
		return (
         <div className="jumbotron text-center">
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
              <StatusPrompt reservationStatus={this.state.reserved} waitingCount={this.state.waitingCount}/>
              <div>
                 <ReserveButton reserved={this.state.reserved} onClick={this.reserveButtonHasBeenClicked} />
              </div>
                   <div className={alertClassName[this.state.alert]} role="alert">{alertText[this.state.alert]}</div>
            </form>
         </div>
		);
	}
}


