'use strict';

import React from 'react';
import { Link } from 'react-router';
import ReserveButton from './ReseveButton.js';
import StatusPrompt from './StatusPrompt.js';
import io from 'socket.io-client';


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

const optionsOfIssues = [
  "Others",
  "I am a new consultant",
  "I was switched out from session",
  "I can neither hear nor speak with my headset",
  "My webcam does not work in session",
  "I moved to another location",
  "I want to resume teaching from my long leave",
  "I have trouble entering the session",
  "我是奥数顾问"
];

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
   // 7 ===> Fails to connect, ticket needs to be updated
   
	// Alert state 
	// 0 ===> No alert
	// 1 ===> unable to connect
	// 2 ===> test terminated unexpectly
	// 3 ===> ticket done
    
	validTeamviewerDetail(){
//      console.log("length of tvID: ", document.getElementById('teamviewer-id').value.length);
      
      if (document.getElementById('teamviewer-id').value.length >= 9 && document.getElementById('teamviewer-id').value.length <= 10){
         if (document.getElementById('teamviewer-pw').value.length > 3 && document.getElementById('teamviewer-pw').value.length < 18) {
            if (document.getElementById('name-email').value.length > 0)
               return true;
         }
      }
      
      return false;
   }
   
   validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
   }
   
   optionElementForIssue(issueItem, index) {
      return <option value={issueItem} key={index}>{issueItem}</option>
   }
	
   reserveButtonHasBeenClicked(e) {

      switch(this.state.reserved) {

         case 0: // ===========================================================> Submit test request
            if(!this.validTeamviewerDetail()) {
               console.warn("Invalid teamviewer ID and password!");
               //Pop up warning
               alert("The ID and Password you entered is not correct, please double check and submit again.");
               break;
            }
            
            //Confirmation before request
            ////////////////////////
            let confirmation = confirm("By click \"ok\" to allow us remotely control your computer");
            if (confirmation == false) {
               console.warn("User doenst allow to control");
               return false;
            }
               
            
             
             let others = {
                issue: document.getElementById("issue").value
             };
             if (this.validateEmail(document.getElementById('name-email').value)){
                others.email = document.getElementById('name-email').value;
             } else {
                others.ctlName = document.getElementById('name-email').value;
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
                  tvPW: document.getElementById('teamviewer-pw').value,
                  others: others
               },
               success: function( result ) {
                  ticket = result;
                  console.log("Ticket ceated status: ", ticket);
                  ticketHasBeenReserved();
               }
            });

             break;

         case 2: // ======================================================================> Cancel test
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
         case 7: // ======================================================================> update ticket
            this.setState((prevState) => ({
               reserved: 1
            }));
            
            $.ajax({
               type: "POST",
               url: "/api/update-ticket",
               data: {
                  ticketNumber: ticket.ticketNumber,
                  id: document.getElementById('teamviewer-id').value,
                  passowrd: document.getElementById('teamviewer-pw').value
               },
               success: function( err ) {
                  console.log("Failed to update ticket");
//                  ticketHasBeenRCancelled();
               }
            });            
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
      
      if (("Notification" in window)) {
        Notification.requestPermission(function (permission) {
          if (permission === "granted") {
            console.log("Notification grant");
          }
        });
      }
      
      socket.on(ticket.ticketNumber, resultTicket => {
         
         console.log("Socketio broadcast messgae received", resultTicket);
         
         if (resultTicket.waitingCount != undefined) {
            
            //handle
            this.setState((prevState) => ({
               waitingCount: resultTicket.waitingCount
            }))
            
            return true;
         }
         
         //If IT fails to connect
         //pop up notification
         if (resultTicket.notification) {
           // Let's check if the browser supports notifications
           if (!("Notification" in window)) {
             conosle.warn("This browser does not support desktop notification");
             alert("Oops! We failed to connect to your computer");
           }

           // Let's check whether notification permissions have already been granted
           else if (Notification.permission === "granted") {
             // If it's okay let's create a notification
             var notification = new Notification("Oops! We failed to connect to your computer");
           }

           // Otherwise, we need to ask the user for permission
           else if (Notification.permission !== "denied") {
             Notification.requestPermission(function (permission) {
               // If the user accepts, let's create a notification
               if (permission === "granted") {
                 var notification = new Notification("Oops! We failed to connect to your computer");
               } else {
                 alert("Oops! We failed to connect to your computer");
               }
             });
           }
           
           else if (Notification.permission === "denied") {
             alert("Oops! We failed to connect to your computer");
           }

            this.setState((prevState) => ({
               reserved: 7
            }))
            
            return true;
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
                  reserved: 7
               }))
               break;
            case 3: //====================> Done
            case 7: //====================> Pass
            case 8: //====================> Fail
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
                 <div className="form-group">
                   <label htmlFor="name-email">Name/Email</label>
                   <input type="text" className="form-control text-center" id="name-email" placeholder="Name or Email"/>
                 </div>
                 <div className="form-group">
                   <label htmlFor="teamviewer-pw">Issue</label>
                   <select className="form-control" id="issue">
                     {optionsOfIssues.map(this.optionElementForIssue)}
                    </select>
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


