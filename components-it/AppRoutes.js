import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Layout from '../components/Layout.js';
//import Howtouse from './Howtouse.js';
//import Reserve from './Reserve.js';

export default class AppRoutes extends React.Component {
	render () {
		return (
			<Router history={browserHistory}>
				<Route path="/" component={Layout}>
				</Route>
			</Router>
		);
	}
}

//
//<IndexRoute component={Reserve}></IndexRoute>
//<Route path="/how-to-use" component={Howtouse}></Route>
//<Route path="/reserve" component={Reserve}></Route>