'use strict';

import React from 'react';
import io from 'socket.io-client';
import TestRow from './TestRow.js';


// Properties
// testListArray ==> Array type, each item is the ticket number

export default class TestTable extends React.Component {
    
    constructor (props) {
        super(props);
        
		 this.socket = io();
		 
		 this.state = {
			 testListArray: ["3222344", "23422"],
			 hasNewTickets: false
		 }
		 
        this.handleNextTicketsButton = this.handleNextTicketsButton.bind(this);
    }
    
    createTestRows(item, index) {
        return <TestRow ticketNo={item} key={index}/>
//        return <TestRow ticketNo={item.ticketNo} ticketRequestedTime={item.ticketRequestedTime} id={item.id} password={item.password} ticketStatus={item.ticketStatus} handler={item.handler} />
    }
    
    componentDidMount() {
        this.socket.on("table list", msg => {
            if (!msg.type) {
                console.warn("No content transfered in channel 'table list'");
                return false;
            }
            
            //handle
            switch (msg.type) {
                case 'first page':
                    //handle
                    this.setState((prevState) => ({
                            testListArray: msg.content
                    }))
                    break;
                case 'next':
                    //handle
                    this.setState((prevState) => ({
                            testListArray: prevState.testListArray.concat(msg.content)
                    }))
                    break;
                case 'previous':
                    this.setState((prevState) => ({
                            testListArray: msg.content.concat(prevState.testListArray)
                    }))
                    break;
                case 'message':
                    this.setState((prevState) => ({
                            hasNewTickets: true
                    }))
                    break;
                default:
                    console.warn("Can't handle this type of messgae in Channel 'table list'");
                    break;
            }
        })
        
        this.socket.emit("table list", {
            type: 'first page'
        })
        
        this.getTableList();
    }
    
    handleNextTicketsButton () {
        this.socket.emit("table list", "next");
    }
    
    handleNewTicketsButton() {
        this.socket.emit("table list", "previous");
        
//        this.setState((prevState))
    }
   
   getTableList(number) {

      $.ajax({
        url: "/api/get-table-list",
        data: {
          
        },
        success: function(result) {
          console.log(result);
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