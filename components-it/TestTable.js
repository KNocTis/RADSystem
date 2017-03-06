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
   
	validTeamviewerDetail(){
//      console.log("length of tvID: ", document.getElementById('teamviewer-id').value.length);
      
      if (document.getElementById('tv-id').value.length >= 9 && document.getElementById('tv-id').value.length <= 10){
         if (document.getElementById('tv-password').value.length > 3 && document.getElementById('tv-password').value.length < 18) {
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
      
      $('#new-ticket-btn').click((btn) => {
         $('#new-ticket-modal').modal('show');
      })
      
      $("#create-ticket").click((btn) => {
         
         if (this.validTeamviewerDetail()) {
             let others = {
                issue: document.getElementById("test-issue").value
             };
             if (this.validateEmail(document.getElementById('name-email').value)){
                others.email = document.getElementById('name-email').value;
             } else {
                others.ctlName = document.getElementById('name-email').value;
             }
            
            $.ajax({
               type: "POST",
               url: "/api/create-ticket",
               data: {
                  tvID: document.getElementById('tv-id').value,
                  tvPW: document.getElementById('tv-password').value,
                  others: others
               },
               success: function( result ) {
                  console.log("Ticket ceated");
               }
            });
            
            
         } else {
            alert("ID or password may input wrong");
         }
         
         $('#new-ticket-modal').modal('hide');
      })
      
      $('#search-btn').click((btn) => {
         this.searchTickets();
      })
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
   
   searchTickets() {
      let searchContent = document.getElementById("search-input").value
      
      if (!searchContent || searchContent == "") {
         console.warn("No search content found");
         return false;
      }
      
      let updateTestList = (list) => {
            this.state.testListArray = list;
            this.setState(this.state.testListArray);
      }
      
      $.ajax({
         url: "/api/search-tickets",
         data: {
            content: searchContent
         },
         success: function(result) {
            console.log("Ticket list got! \n", result);
            updateTestList(result);
         }
      });
   }
   
   updateTestList(list) {

   }
    
   render () {
      return (
         <div className="table-list-view">
            <div className="row table-nav">
               <div className="col-md-10 col-md-offset-1 form-inline">
                  <div className="col-md-3">
                     <button className="btn btn-xx" id="new-ticket-btn"><i className="fa fa-plus" aria-hidden="true"></i></button>
                  </div>
                  <div className="col-md-3 col-md-offset-6">
                     <div className="input-group">
                        <input type="text" className="form-control" placeholder="Search for..." id="search-input"/>
                        <span className="input-group-btn">
                           <button className="btn btn-xx" type="button" id="search-btn"><i className="fa fa-search" aria-hidden="true"></i></button>
                        </span>
                     </div>
                  </div>
               </div>
            </div>
            <br />
            <div className="row">
               <div className="table-container col-md-10 col-md-offset-1">
                  <table className="table table-borderless">
                     <thead>
                        <tr>
                           <th>#</th>
                           <th>Time</th>
                           <th>ID</th>
                           <th>Password</th>
                           <th>Name/Email</th>
                           <th>Issue</th>
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
            </div>
         </div>
      );
   }
}