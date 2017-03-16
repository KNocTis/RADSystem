'use strict';

import React from 'react';
import { Link } from 'react-router';

const imgSrcForMac = {
  teamViewer: "imgsrc/MacTeamviewer.png",
  issueSelection: "imgsrc/MacIssueSelection.png",
  notification: "imgsrc/MacNotification.png",
  idPwCorrection: "imgsrc/MacAlert.png"
}

const imgSrcForWin = {
  teamViewer: "imgsrc/WinTeamviewer.jpg",
  issueSelection: "imgsrc/MacIssueSelection.png",
  notification: "imgsrc/MacNotification.png",
  idPwCorrection: "imgsrc/MacAlert.png"
}

const teamViewerOfficalSite = "https://www.teamviewer.com/"

export default class Howtouse extends React.Component {
   
   linkForTeamviewer(){
      
      let osInfo = window.navigator.userAgent;
//      console.log(window.navigator);
      
      if (!osInfo){
         console.warn("coundn't detect os version!");
         return "http://www.tutorabc.com/download/ConsultantRemoteSupport.exe";
      }
      
      if (osInfo.includes("Mac")) {
         return "http://www.tutorabc.com/download/TutorABCRemoteSupport.dmg";
      } else {
         return "http://www.tutorabc.com/download/ConsultantRemoteSupport.exe";
      }
   }
  
  imgSrcOf(imgName) {
      let osInfo = window.navigator.userAgent;
//      console.log(window.navigator);
      
      if (!osInfo){
         console.warn("coundn't detect os version!");
         return imgSrcForMac[imgName];
      }
      
      if (osInfo.includes("Mac")) {
         return imgSrcForMac[imgName];
      } else {
         return imgSrcForWin[imgName];
      }
  }
  
   
  render () {
    return (
      <div  href="how-to-use" className="jumbotron text-center jumbotron-trans">
        <h2>Instruction</h2>
        <p>1. Click <Link className="" href={this.linkForTeamviewer()}>here<i className="fa fa-link" aria-hidden="true"></i></Link> to downlaod <Link className="" href={teamViewerOfficalSite} target="_blank">TeamViewer<i className="fa fa-external-link" aria-hidden="true"></i></Link> into your computer.</p>
        <p>2. Run the downloaded file to open TeamViewer in your computer.</p>
        <p>3. Input TeamViewer ID & Password into test request column.</p>
        <img src={this.imgSrcOf("teamViewer")} className="img-responsive img-thumbnail" alt="Responsive image"></img>
        <p>4. Enter your full name and select category using the drop down menu.</p>
        <img src={this.imgSrcOf("issueSelection")} className="img-responsive img-thumbnail" alt="Responsive image"></img>
        <p>5. Click “Submit” and get ready for IT’s remote support!</p>
        <p>6. If IT cannot connect to your computer, we will send you a notification. Please follow the step listed above and provide correct ID & Password.</p>
        <img src={this.imgSrcOf("notification")} className="img-responsive img-thumbnail" alt="Responsive image"></img><img src={this.imgSrcOf("idPwCorrection")} className="img-responsive img-thumbnail" alt="Responsive image"></img>
        <h6>
          (*) TeamViewer is a program that allows us to remotely control your computer.<br/>
          You will be able to see everything that we do while we are in control,<br/>
          and you will be able to terminate the control by closing the program.<br/>
          TeamViewer Official Site address : https://www.teamviewer.com<br/>
        </h6>
            
      </div>
    );
  }
}


