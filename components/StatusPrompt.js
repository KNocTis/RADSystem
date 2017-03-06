'use strict';

import React from 'react';
import { Link } from 'react-router';

const waitingWords = [
   "Fill in ID and Password of Teamviewer, and click \"submit\" button requesting for test", // ==> Ready to request for test
   "Sending out request ...", // ==> Request is sending to server
   "Your request has been processing\nPlease wait and keep Teamviewer running", // =====> Waiting to be taken by PMIT
   "Test is finished", // ========> Test done
   "One of IT took the test, and you will be connected soon.",  // ======> IT took the test and is connnecting with Teamviewer
   "Test is cancelled",  // ==========> Test cancelled by Consultant
   "Canceling the test...", // =============> Cancellation request is sending to server
   "Oops, IT fails to connect to your computer. Please make sure Teamviewer is running and update detail." // =============> 
];


export default class StatusPrompt extends React.Component {
   
   spinnerColor(){
      if (this.props.waitingCount < 5)
         return "#90caaf"; //银朱
      
      if (this.props.waitingCount < 10)
         return "#e4cf8e"; //甘草黄
         
      return "#e73e3a"; //三绿
   }
   
   sizeOfWaitingWords(){
      if (this.props.reservationStatus == 2)
         return "12px";
      
      if (this.props.reservationStatus == 7) 
         return "20px";
      
      return "16px";
   }
   
   waitingWords(){
      if (this.props.reservationStatus == 2) {
         if (this.props.waitingCount < 5)
            return "Less than 5 tests waiting";   // =========> Phrase to be shown when waiting tests less than 5

         if (this.props.waitingCount < 10)
            return "More than 5 tests waiting";   // =========> Phrase to be shown when waiting tests less than 10

         return "More than 10 tests waiting";    // =========> Phrase to be shown when waiting tests greater than 10    
      }
      
      return waitingWords[this.props.reservationStatus];
   }
   
   classNameOfSpinner(){
      if(this.props.reservationStatus == 2) {
         return "fa fa-spinner fa-pulse fa-5x fa-fw";
      }
      
      return "fa fa-spinner fa-pulse fa-5x fa-fw hide";
   }
   
	render () {
		return (
         <div className="">
            <i className={this.classNameOfSpinner()} style={{color: this.spinnerColor()}}></i><span className="sr-only">Loading...</span>
            <p className="help-block"  style={{fontSize: this.sizeOfWaitingWords()}}>{this.waitingWords()}</p>
         </div>
		);
	}
}


