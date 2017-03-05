'use strict';

import React from 'react';
import { Link } from 'react-router';


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
   
	render () {
		return (
			<div  href="how-to-use" className="jumbotron text-center jumbotron-trans">
				<p>1. Click <Link className="" to={this.linkForTeamviewer()}>here</Link> to downlaod TeamViewer into your computer.</p>
				<p>2. Install and keep it runnning on your computer</p>
				<p>3. Go to <Link className="" to="/reserve">Reserve Test Page</Link> requesting test</p>
				<p>4. XXXXXXXXXX XXXXXXXXXX XXXXXXXXXX XXXXXXXXXX </p>
				<p>5. ASFDAS FGASG EGRDGESGSE G ES G </p>
				<p>6. dgs ds ge ge grs gdf gsd gregrshbdghdsghrs er </p>
			</div>
		);
	}
}


