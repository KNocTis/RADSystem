//Props 1: reserved
//Props 2: waiting

'use strict';

import React from 'react';

	
	// Reserved state 
	// 0 ===> not reserved or reserving
	// 1 ===> waiting for reserved
	// 2 ===> reserved, waiting to be tested
	// 3 ===> ticket done
	// 4 ===> Someone took the test, and we will be connnected soon
	// 5 ===> Ticket is canncelled
   // 6 ===> Ticket is cancelling


const buttonText = [
	"Reserve",
	"Requesting",
	"Cancel",
	"Reserve again",
   "Cancel",
   "Reserve again",
   "Cancelling",
   "Update"
];

const buttonClass = [
	"btn btn-default",
	"btn btn-default disabled",
	"btn btn-danger",
   "btn btn-default",
   "btn btn-danger disabled",
   "btn btn-default",
   "btn btn-danger disabled",
   "btn btn-default"
];

export default class ReserveButton extends React.Component {
  constructor(props) {
    super(props);
	 
	 this.handleReserveButton = this.handleReserveButton.bind(this);
//	  this.buttonClass = this.buttonClass.bind(this);
  }

	
	handleReserveButton (e) {
		//Handle this event
		

		//Delegate to parent
		if (this.props.onClick) {
			this.props.onClick(e);
		}
		
	}
	
	buttonClass () {
		let classStr = this.props.reserved ? buttonClass[1] : buttonClass[0];
		if (this.props.waiting) {
			classStr += "disabled";
		}
		
		return classStr;
	}
	
	render () {
		return (
			<button type="button" className={buttonClass[this.props.reserved]} onClick={this.handleReserveButton}>{buttonText[this.props.reserved]}</button>
		);
	}
	
}