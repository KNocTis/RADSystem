'use strict';

import React from 'react';

const alertOptions = [
  "Oops! We failed to connect to your computer",
  "The ID and Password you entered may not be correct, please double check and update.",
  "Your TeamViewer may not be running on your computer, please relaunch it and update details.",
  "The version of the TeamViewer is too high, please downlaod Teamviewer again from the instruction on the page and update details."
]

export default class AlertModalModal extends React.Component {
    
  constructor (props) {
    super(props);
    
    this.sendAlert = this.sendAlert.bind(this);
  }
  
  componentDidMount() {
    $('#alert-options').change((e) => {
      $('#alert-textarea').val(alertOptions[e.target.value]);
    })
    
    $('#alert-textarea').val(alertOptions[0]);
  }
  
  createOption(item, index) {
    return <option key={index} value={index}>{item}</option>;
  }
  
  sendAlert () {
    $.ajax({
      type: "POST",
      url: "/api/push-noti-for-ticket",
      data: {
        ticketNumber: this.props.ticketNumber,
        notification: $('#alert-textarea').val()
      },
      success: function( result ) {
        console.log("Server is broadcast message ");
      }
    });
    
    $('#alert-modal').modal('hide');
  }
    
   render () {
      return (
        <div className="modal fade" tabIndex="-1" role="dialog" id={"alert-modal"}>
          <div className="modal-dialog modal-sm" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title">Send alert-messgae</h4>
              </div>
              <div className="modal-body">
                 <select className="form-control" id={"alert-options"}>
                   {alertOptions.map(this.createOption)}
                </select>
                <textarea className="form-control" id={"alert-textarea"} placeholder="Please type alert-message"></textarea>
               </div>
              <div className="modal-footer">
                 <button type="button" className="btn btn-" id={"send-alert"} onClick={this.sendAlert}>Send</button>
               </div>
             </div>
          </div>
        </div> 
      );
   }
}