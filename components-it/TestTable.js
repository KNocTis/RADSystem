'use strict';

import React from 'react';
import io from 'socket.io-client';
import TestRow from './TestRow.js';


// Properties
// testListArray ==> tickets
let socket;
//let countOfNewTickets = 0;

export default class TestTable extends React.Component {
    
   constructor (props) {
      super(props);

      socket = io();

      this.state = {
         testListArray: [],
         hasNewTickets: false
      }

      this.handleNextTicketsButton = this.handleNextTicketsButton.bind(this);
   }
    
    createTestRows(item, index) {
        return <TestRow ticket={item} key={index}/>

    }
    
   componentDidMount() {

      let ticketHasBeenUpdated = (ticket) => {
         
         //If the message is not about ticket modification
         if(!ticket.ticketNumber) {
            return false;
         }
         
         this.state.testListArray.map((ticketItem, index) => {
            if (ticketItem.ticketNumber == ticket.ticketNumber) {
               ticketItem.lastModifiedTime = ticket.lastModifiedTime;
               ticketItem.id = ticket.id;
               ticketItem.password = ticket.password;
               ticketItem.handler = ticket.handler;
               ticketItem.status = ticket.status;
            }
         });
         
         this.setState(this.state.testListArray);
      }

      this.getTableList(null, (tableList) => {
         this.setState((prevState) => ({
            testListArray: tableList
         }));
      //            console.log(tableList);
         socket.on('new-ticket-created', ticket => {
            socket.on(ticket.ticketNumber, ticketHasBeenUpdated);
            this.state.testListArray.unshift(ticket);
            this.setState(this.state.testListArray);
         })

         let openChannelForTicket = (ticket, index) => {
            socket.on(ticket.ticketNumber, ticketHasBeenUpdated);
//            console.log("socket channel opened on ", ticket.ticketNumber);
         }

         tableList.map(openChannelForTicket);
      });
   }
    
    handleNextTicketsButton () {
        this.socket.emit("table list", "next");
    }
    
    handleNewTicketsButton() {
        this.socket.emit("table list", "previous");
        
//        this.setState((prevState))
    }
   
   getTableList(number, done) {

      $.ajax({
         url: "/api/get-table-list",
         data: {

         },
         success: function(result) {
            console.log("Ticket list got! \n", result);
            done(result);
         }
      });

   }
    
    render () {
        return (
				 <div className="table-container">
					  <ul className={"nav nav-pills new-tabs ".concat(this.state.hasNewTickets ? "" : "hide")} role="tablist">
						 <li role="presentation"><a role="button" onClick={this.handleNewTicketsButton}>New <span className="badge">3</span></a></li>
					  </ul>
					  <table className="table table-borderless">
							<thead>
								 <tr>
									  <th>#</th>
									  <th>Time</th>
									  <th>ID</th>
									  <th>Password</th>
									  <th>Status</th>
									  <th>Handler</th>
								 </tr>
							</thead>
							<tbody>
								 {this.state.testListArray.map(this.createTestRows)}
							</tbody>
					  </table> 
					  <p className="text-center"><a onClick={this.handleNextTicketsButton}><span className="glyphicon glyphicon-menu-down"></span></a></p>
				 </div>
        );
	 }
}