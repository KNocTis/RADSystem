'use strict';

import React from 'react';
import { Link } from 'react-router';
import Reserve from './Reserve.js';
import Howtouse from './Howtouse.js';

export default class ReserveIndex extends React.Component {
   constructor(props) {
      super(props);
   }
  

	
   componentDidMount() {

   }

	render () {
		return (
         <div className="reserve-index">
            <Reserve />
            <Howtouse />
         </div>
		);
	}
}


