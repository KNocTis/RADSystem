'use strict';

import React from 'react';
import { Link } from 'react-router';
import NavBar from './NavBar.js'


export default class Layout extends React.Component {
	render () {
		return (
			<div className="app-container">
			  <header>
				 <NavBar/>
			  </header>
			  <div className="jumbotron text-center">{this.props.children}</div>
			  <footer>
				 <p className="text-center">
					This is a demo app of <strong>Remoting Assistant</strong> <strong></strong>.
				 </p>
			  </footer>
			</div>
		);
	}
}
