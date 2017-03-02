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


let socket;

export default class TestRow extends React.Component {
   constructor (props) {
      super(props);

      socket = io();

      this.state = {
         ticketRequestedTime: this.props.ticket.lastModifiedTime,
         id: this.props.ticket.id,
         password: this.props.ticket.password,
         handler: this.props.ticket.handler,
         ticketStatus: this.props.ticket.status
      }

      this.handleProcessTestButton = this.handleProcessTestButton.bind(this);
      this.ticketHasBeenTakenOVer = this.ticketHasBeenTakenOVer.bind(this);
   }

    // "btn btn-success btn-xs disabled"
    
    componentDidMount() {
        if (this.props.ticket) {
            socket.on(this.props.ticket.ticketNumber, msg => {
               console.log("Socketio broadcast messgae received");
               if (!msg)
                  return false;
               
               this.setState((prevState) => ({
                  ticketRequestedTime: msg.lastModifiedTime ? msg.lastModifiedTime : prevState.ticketRequestedTime,
                  id: msg.id ? msg.id : prevState.id,
                  password: msg.password ? msg.password : prevState.password,
                  handler: msg.handler ? msg.handler : prevState.handler,
                  ticketStatus: msg.status ? msg.status : prevState.ticketStatus
               }))
            });
        }
    }
   
   ticketHasBeenTakenOVer(ticket) {
      
      this.setState((prevState) => ({
         handler: ticket.handler,
         ticketStatus: ticket.status
      }));
//      this.forceUpdate();
      console.log("Took over a ticket", ticket);
      console.log("Took over a ticket", this.state.handler, this.state.ticketStatus);
   }
    
    handleProcessTestButton(e) {
       
       e.preventDefault();
       
      switch (this.state.ticketStatus) {
         case 0: // ============================>  Waiting for someone to take
             //handle it
            $.ajax({
               type: "POST",
               url: "/api/takeover-ticket",
               data: {
                  ticketNo: this.props.ticket.ticketNumber
               },
               success: function( result ) {
                  
//                  ticketHasBeenTakenOVer(result);
               }
            });
            break;
         case 1: // ============================>  Someone is on it
            $.ajax({
               type: "POST",
               url: "/api/finish-ticket",
               data: {
                  ticketNo: this.props.ticket.ticketNumber
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
             console.warn("You can't go on with it\nTicket status: ", this.state.ticketStatus);
             break;
      }
                        
        //Action code
        // 0 ===> take over
        // 1 ===> finish
    }
    
    render () {
        return (
            <tr>
                <th scope="row">{this.props.ticket.ticketNumber}</th>
                <td>{this.state.ticketRequestedTime}</td>
                <td>{this.state.id}</td>
                <td>{this.state.password}</td>
                <td><button className={statusButtonClass[this.state.ticketStatus]} type="button" onClick={this.handleProcessTestButton}>{statusButtonText[this.state.ticketStatus]}</button></td>
                <td>{this.state.handler}</td>
            </tr>
        );
	 }
}