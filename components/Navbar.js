'use strict';

import React from 'react';
import { Link } from 'react-router';


export default class NavBar extends React.Component {
	render () {
		return (
			<nav className="navbar navbar-default navbar-fixed-top">

			  <div className="container-fluid">
				 <!-- Brand and toggle get grouped for better mobile display -->
				 <div claclassNamess="navbar-header">
					 <Link className="navbar-brand" to="/">TutorABC</link>
				 </div>

				 <!-- Collect the nav links, forms, and other content for toggling -->
				 <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul className="nav navbar-nav">
					  <li><Link to="/reserve">Reserve Test</link></li>
					  <li><Link to="/how-to-use">How to use</link></li>
						<li><Link to="/downloads">Downloads</link></li>
					</ul>
				 </div><!-- /.navbar-collapse -->

			  </div><!-- /.container-fluid -->
			</nav>
		);
	}
}

window.onload = () => {
  ReactDOM.render(<NavBar/>, document.getElementById('main'));
};
