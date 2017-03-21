'use strict';

import React from 'react';

export default class FinishModal extends React.Component {
    
   constructor (props) {
      super(props);
     
     this.sendFinishPost = this.sendFinishPost.bind(this);
   }
  
  sendFinishPost (type) {
    
    let requestStatus;
    
    console.warn("Will finish a ticket, target id ", type.target.id);
    
    switch (type.target.id) {
      case "finish-pass":
        requestStatus = 7;
        break;
      case "finish-fail":
        requestStatus = 8;
        break;
      case "finish-terminate":
        requestStatus = 5;   
        break;
    }
    
    if (requestStatus == undefined) {
      console.warn("Button type is not definded", type.target.id);
      $('#finish-modal').modal('hide');
      return false;
    }
    
    console.warn("Will finish a ticket to ", requestStatus);
    
    $.ajax({
      type: "POST",
      url: "/api/finish-ticket",
      data: {
         ticketNumber: this.props.ticketNumber,
         status: requestStatus
      },
      success: function( result ) {
         console.log("Finish a ticket, result ==> ", result);
      }
    });
    
    $('#finish-modal').modal('hide');
  }
    
   render () {
      return (
        <div className="modal fade" tabIndex="-1" role="dialog" id="finish-modal">
          <div className="modal-dialog modal-sm" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title">Finish the test</h4>
              </div>
              <div className="modal-body">
                 <button type="button" className="btn btn-success" id="finish-pass" onClick={this.sendFinishPost}>Pass</button>
                 <button type="button" className="btn btn-danger" id="finish-fail" onClick={this.sendFinishPost}>Fail</button>
                 <button type="button" className="btn btn-warning" id="finish-terminate" onClick={this.sendFinishPost}>Terminate</button>
               </div>
             </div>
          </div>
        </div> 
      );
   }
}