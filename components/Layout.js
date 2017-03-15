'use strict';

import React from 'react';
import { Link } from 'react-router';
import NavBar from './NavBar.js'

const navItems = [
    {link: "#", text: "Request Test"}
]

export default class Layout extends React.Component {
	render () {
		return (
			<div className="app-container">
			  <div className="header">
				 <NavBar list={navItems}/>
			  </div>
			  <div className="">{this.props.children}</div>
			  <footer>
				 <p className="text-center">
					This is an app of <strong>Remoting Assistant</strong> <strong></strong>.
				 </p>
			  </footer>
			</div>
		);
	}
}
