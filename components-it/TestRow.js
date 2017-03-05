'use strict';

import React from 'react';
import io from 'socket.io-client';

// Properties//
// 1. ticketStatus ===> 0 ==> No one on it
//        ===> 1 ==> Some one is on it
//        ===> 2 ==> Ticket has been done
//        ===> 3 ==> I am on it
//        ===> 4 ==> TBD
//
// 2. ticketNo
// 3. ticketRequestedTime
// 4. id
// 5. password
// 6. handler

// Properties//
// 1. ticketStatus ===> 0 ==> Waiting
//        ===> 1 ==> Some one is on it
//        ===> 2 ==> Failed to connect, waiting for feedback from cnosultant
//        ===> 3 ==> Done
// Properties//
// 1. ticketStatus ===> 0 ==> Waiting
//        ===> 1 ==> Some one is on it
//        ===> 2 ==> Failed to connect, waiting for feedback from consultant
//        ===> 3 ==> Done
//        ===> 4 ==> Cancelled

const statusButtonClass = [
   "btn btn-xs btn-success",
   "btn btn-xs btn-danger",
   "btn btn-xs btn-warning",
   "btn btn-xs btn-default disabled",
   "btn btn-xs btn-warning disabled"
];

const statusButtonText = [
   "On it",
   "Done",
   "Resume",
   "=Done=",
   "Cancelled"
]


export default class TestRow extends React.Component {
   constructor (props) {
      super(props);

//      socket = io();

//      this.state = {
//         ticketRequestedTime: this.props.ticket.lastModifiedTime,
//         id: this.props.ticket.id,
//         password: this.props.ticket.password,
//         handler: this.props.ticket.handler,
//         ticketStatus: this.props.ticket.status
//      }

      this.handleProcessTestButton = this.handleProcessTestButton.bind(this);
      this.alert = this.alert.bind(this);
//      this.ticketHasBeenTakenOVer = this.ticketHasBeenTakenOVer.bind(this);
   }

    // "btn btn-success btn-xs disabled"
    
    componentDidMount() {
       
//       console.log("Ticket ", this.props.ticket.ticketNumber, " did mount");
       
//        if (this.props.ticket) {
//            socket.on(this.props.ticket.ticketNumber, msg => {
//               console.log("Socketio broadcast messgae received");
//               if (!msg)
//                  return false;
//               
//               this.setState((prevState) => ({
//                  ticketRequestedTime: msg.lastModifiedTime ? msg.lastModifiedTime : prevState.ticketRequestedTime,
//                  id: msg.id ? msg.id : prevState.id,
//                  password: msg.password ? msg.password : prevState.password,
//                  handler: msg.handler ? msg.handler : prevState.handler,
//                  ticketStatus: msg.status ? msg.status : prevState.ticketStatus
//               }))
//            });
//        }
    }
   
   componentWillUnmount() {
//       console.log("Ticket ", this.props.ticket.ticketNumber, " will unmount");
   }

    
    handleProcessTestButton(e) {
       
       e.preventDefault();
       
      switch (this.props.ticket.status) {
         case 0: // ============================>  Waiting for someone to take
             //handle it
            $.ajax({
               type: "POST",
               url: "/api/takeover-ticket",
               data: {
                  ticketNumber: this.props.ticket.ticketNumber
               },
               success: function( result ) {
                  
               }
            });
            break;
         case 1: // ============================>  Someone is on it
            $.ajax({
               type: "POST",
               url: "/api/finish-ticket",
               data: {
                  ticketNumber: this.props.ticket.ticketNumber
               },
               success: function( result ) {
                  console.log("Finish a ticket, result ==> ", result);
               }
            });
            break;
         case 3:
               
             //handle it
             break;
         default:
             console.warn("You can't go on with it\nTicket status: ", this.props.ticket.status);
             break;
      }
                        
        //Action code
        // 0 ===> take over
        // 1 ===> finish
    }
    
   hideAlertButton() {
      if (this.props.ticket.status == 1 || this.props.ticket.status == 2)
         return "";
      
      return "hide";
   }
   
   alert() {
      $.ajax({
         type: "POST",
         url: "/api/push-noti-for-ticket",
         data: {
            ticketNumber: this.props.ticket.ticketNumber,
            notification: "IT fails to connect to your computer"
         },
         success: function( result ) {
            console.log("Server is broadcast message ");
         }
      });
   }
   
    render () {
        return (
            <tr>
                <th scope="row">{this.props.ticket.ticketNumber}</th>
                <td>{this.props.ticket.lastModifiedTime}</td>
                <td>{this.props.ticket.id}</td>
                <td>{this.props.ticket.password}</td>
                <td><button className={statusButtonClass[this.props.ticket.status]} type="button" onClick={this.handleProcessTestButton}>{statusButtonText[this.props.ticket.status]}</button><button className={"btn btn-default btn-xs " + this.hideAlertButton()} type="button" onClick={this.alert}>Alert</button></td>
                <td>{this.props.ticket.handler}</td>
            </tr>
        );
	 }
}