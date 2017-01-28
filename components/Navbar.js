'use strict';

import React from 'react';
import { Link } from 'react-router';


export default class NavBar extends React.Component {
	render () {
		return (
			<nav className="navbar navbar-default">
			  <div className="container-fluid">
				 <div className="navbar-header">
					 <Link className="navbar-brand" to="/test">TutorABC</Link>
				 </div>
				 <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul className="nav navbar-nav">
					  <li><Link to="/reserve">Reserve Test</Link></li>
					  <li><Link to="/how-to-use">How to use</Link></li>
						<li><Link to="/downloads">Downloads</Link></li>
					</ul>
				 </div>
			  </div>
			</nav>
		);
	}
}

