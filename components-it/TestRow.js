'use strict';

import React from 'react';

// Properties
// status ===> 0 ==> No one on it
//        ===> 1 ==> Some one is on it
//        ===> 2 ==> Ticket has been done
//        ===> 3 ==> I am on it
//        ===> 4 ==> TBD


export default class TestRow extends React.component {
    
    statusButton () {
        let classStr = "btn btn-xs";
        let text = "";
        
        switch (this.props.ticketStatus) {
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
    
    render () {
        return (
            <tr>
            <th scope="row">{this.props.ticketNo}</th>
            <td>{this.props.ticketRequestedTime}</td>
            <td>{this.props.id}</td>
            <td>{this.props.password}</td>
            <td><button class={this.statusButton.class} type="button">={this.statusButton.text}</button></td>
            <td>{this.props.handler}</td>
            </tr>
        );
}