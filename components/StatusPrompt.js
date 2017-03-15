'use strict';

import React from 'react';
import { Link } from 'react-router';

const waitingWords = [
   "Please fill in 9 or 10-digit ID & the Password of TeamViewer, and click \"submit\" button", // ==> Ready to request for test
   "Sending out request ...", // ==> Request is sending to server
   "Your request has been processing\nPlease wait and keep Teamviewer running", // =====> Waiting to be taken by PMIT
   "Your IT Test with us has finished.", // ========> Test done
   "One of IT took the test, and you will be connected soon.",  // ======> IT took the test and is connnecting with Teamviewer
   "Test is cancelled",  // ==========> Test cancelled by Consultant
   "Canceling the test...", // =============> Cancellation request is sending to server
   "Please check ID & password and click update, and be sure to keep TeamViewer running at all time." // =============> 
];


export default class StatusPrompt extends React.Component {
   
   spinnerColor(){
      if (this.props.waitingCount < 3)
         return "#849b4d"; //银朱
     
      if (this.props.waitingCount < 6)
         return "#ccd18c"; //甘草黄
      
      if (this.props.waitingCount < 10)
         return "#e0b341"; //甘草黄
         
      return "#ef614f"; //三绿
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
         if (this.props.waitingCount < 3)
            return "Connecting, Please get ready. Feel free to let us know if you have any questions during the test";   // =========> Phrase to be shown when waiting tests less than 3

         if (this.props.waitingCount < 6)
            return "Please get ready for the test. PMIT will connect any time just now and make sure TeamViewer stays open!";   // =========> Phrase to be shown when waiting tests less than 6
        
        if (this.props.waitingCount < 10)
            return "We are checking your test record to process the request. We will start the remote process with you shortly!";   // =========> Phrase to be shown when waiting tests less than 10

         return "PMIT have received your request. We are processing your account history and will help you as soon as we can. This might take approximately 5-10minutes.";    // =========> Phrase to be shown when waiting tests greater than 10    
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


