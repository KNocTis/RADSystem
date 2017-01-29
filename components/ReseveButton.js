//Props 1: reserved
//Props 2: waiting

'use strict';

import React from 'react';

	
	// Reserved state 
	// 0 ===> not reserved or reserving
	// 1 ===> wait for reserved
	// 2 ===> reserved, waiting to be tested
	// 3 ===> ticket done

const buttonText = [
	"Reserve",
	"Reserving",
	"Cancel",
	"Reserve"
];

const buttonClass = [
	"btn btn-default",
	"btn btn-default disabled",
	"btn btn-danger"
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
			<button type="button" className={this.buttonClass()} onClick={this.handleReserveButton}>{this.props.reserved ? buttonText[1] : buttonText[0]}</button>
		);
	}
	
}