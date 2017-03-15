'use strict';

import React from 'react';
import { Link } from 'react-router';
import NavBar from '../components/NavBar.js'

const navItems = [
    {link: "testlist", text: "Test List"}
]

export default class Layout extends React.Component {
	render () {
		return (
			<div className="app-container">
			  <div className="header">
				 <NavBar list={navItems}/>
			  </div>
			  <div className="jumbotron">{this.props.children}</div>
			  <footer>
				 <p className="text-center">
					This is a demo app of <strong>Remoting Assistant</strong> <strong></strong>.
				 </p>
			  </footer>
			</div>
		);
	}
}