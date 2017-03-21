'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import moment from "moment";
import FinishModal from './FinishModal.js';
import AlertModal from './AlertModal.js';

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
   "btn btn-xs btn-warning disabled",
   "btn btn-xs btn-warning disabled",
   "btn btn-xs btn-warning disabled",
   "btn btn-xs btn-success disabled",
   "btn btn-xs btn-danger disabled"
];

const statusButtonText = [
   "On it",
   "Done",
   "Resume",
   "=Done=",
   "Cancelled",
   "Terminated",
   "Cancelled",
   "=Pass=",
   "=Fail="
]


export default class TestRow extends React.Component {
   constructor (props) {
      super(props);

      this.handleProcessTestButton = this.handleProcessTestButton.bind(this);
      this.alert = this.alert.bind(this);
//      this.ticketHasBeenTakenOVer = this.ticketHasBeenTakenOVer.bind(this);
   }
    
    componentDidMount() {

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
            $('#modals').html('');
            ReactDOM.render(<FinishModal ticketNumber={this.props.ticket.ticketNumber}/>, document.getElementById('modals'));
            $('#finish-modal').modal('show');
            
//            let ticketNumber = this.props.ticket.ticketNumber;
//            let sendFinishPost = (type) => {
//               $.ajax({
//                  type: "POST",
//                  url: "/api/finish-ticket",
//                  data: {
//                     ticketNumber: ticketNumber,
//                     status: type
//                  },
//                  success: function( result ) {
//                     console.log("Finish a ticket, result ==> ", result);
//                  }
//               });
//            }
//            
//            $('#finish-pass-' + this.props.ticket.ticketNumber).click(() => {
//               sendFinishPost(7);
//               $('#finish-modal-' + this.props.ticket.ticketNumber).modal('hide');
//            });
//            $('#finish-fail-' + this.props.ticket.ticketNumber).click(() => {
//               sendFinishPost(8);
//               $('#finish-modal-' + this.props.ticket.ticketNumber).modal('hide');
//            });
//            $('#finish-terminate-' + this.props.ticket.ticketNumber).click(() => {
//               sendFinishPost(5);
//               $('#finish-modal-' + this.props.ticket.ticketNumber).modal('hide');
//            });

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
   
   nameOrEmail() {
      return this.props.ticket.ctlName ? this.props.ticket.ctlName : this.props.ticket.email;
   }
   
  alert() {

    $('#modals').html('');
    ReactDOM.render(<AlertModal ticketNumber={this.props.ticket.ticketNumber}/>, document.getElementById('modals'));
    
//    $('#alert-modal-' + this.props.ticket.ticketNumber).modal('hide');
    $('#alert-modal').modal('show');

//    $('#send-alert').click(() => {
//      $.ajax({
//        type: "POST",
//        url: "/api/push-noti-for-ticket",
//        data: {
//          ticketNumber: this.props.ticket.ticketNumber,
//          notification: $('#alert-textarea-' + this.props.ticket.ticketNumber).val()
//        },
//        success: function( result ) {
//          console.log("Server is broadcast message ");
//        }
//      });
//      
//      $('#alert-modal-' + this.props.ticket.ticketNumber).modal('hide');
//    })
    
    
  }
   
    render () {
        return (
            <tr>
                <th scope="row">{this.props.ticket.ticketNumber}</th>
                <td>{moment(this.props.ticket.lastModifiedTime).format('MMMM Do, HH:mm:ss')}</td>
                <td>{this.props.ticket.id}</td>
                <td>{this.props.ticket.password}</td>
                 <td>{this.nameOrEmail()}</td>
                 <td>{this.props.ticket.issue}</td>
                <td><button className={statusButtonClass[this.props.ticket.status]} type="button" onClick={this.handleProcessTestButton}>{statusButtonText[this.props.ticket.status]}</button><button className={"btn btn-default btn-xs " + this.hideAlertButton()} type="button" onClick={this.alert}>Alert</button></td>
                <td>{this.props.ticket.handler}</td>
            </tr>
        );
	 }
}