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

export default class TestRow extends React.Component {
    constructor (props) {
        super(props);
        
		 this.socket = io();
		 
		 this.state = {
			 ticketRequestedTime: "loading",
			 id: "loading",
			 password: "loading",
			 handler: "loading",
			 ticketStatus: 0
		 }
		 
        this.handleProcessTestButton = this.handleProcessTestButton.bind(this);
    }
    
    statusButton () {
        let classStr = "btn btn-xs ";
        let text = "";
        
        switch (this.state.ticketStatus) {
            case 0:
                classStr += "btn-success"
                text = "On it"
                break;
            case 1:
                classStr += "btn-success disabled"
                text = "On it"
                break;
            case 2:
                classStr += "btn-danger disabled"
                text = "Done"
                break;  
            case 3:
                classStr += "btn-danger"
                text = "Done"
                break;                  
        }
        
        return {class: classStr, text: text}
    }
    // "btn btn-success btn-xs disabled"
    
    componentDidMount() {
        if (this.props.ticketNo) {
            
            this.socket.emit('get ticket info', this.props.ticketNo);
            
            this.socket.on(this.props.ticketNo, msg => {
                this.setState((prevState) => ({
                    ticketStatus: msg.ticketStatus ? msg.ticketStatus : prevState.ticketStatus,
                    ticketNo: msg.ticketNo ? msg.ticketNo : prevState.ticketNo,
                    ticketRequestedTime: msg.ticketRequestedTime ? msg.ticketRequestedTime : prevState.ticketRequestedTime,
                    id: msg.id ? msg.id : prevState.id,
                    password: msg.password ? msg.password : prevState.password,
                    handler: msg.handler ? msg.handler : prevState.handler
                }));
            })
        }
    }
    
    handleProcessTestButton() {
        switch (this.state.ticketStatus) {
            case 0:
                //handle it
                this.socket.emit(this.props.ticketNo, {
                    action: 0
                })
                break;
            case 3:
                this.socket.emit(this.props.ticketNo, {
                    action: 1
                })
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
                <th scope="row">{this.props.ticketNo}</th>
                <td>{this.state.ticketRequestedTime}</td>
                <td>{this.state.id}</td>
                <td>{this.state.password}</td>
                <td><button className={this.statusButton().class} type="button" onClick={this.handleProcessTestButton}>{this.statusButton().text}</button></td>
                <td>{this.state.handler}</td>
            </tr>
        );
	 }
}