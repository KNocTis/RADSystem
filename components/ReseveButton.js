//Props 1: reserved
//Props 2: waiting

'use strict';

import React from 'react';

const buttonText = [
	"Reserve",
	"Cancel"
];

const buttonClass = [
	"btn btn-default",
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