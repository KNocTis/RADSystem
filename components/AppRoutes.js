import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import Layout from './Layout.js';
import Howtouse from './Howtouse.js';
import Reserve from './Reserve.js';

export default class AppRoutes extends React.Component {
	render () {
		return (
			<Router history={browserHistory}>
				<Route path="/" component={Layout}>
					<IndexRoute component={Reserve}></IndexRoute>
					<Route path="/how-to-use" component={Howtouse}></Route>
					<Route path="/reserve" component={Reserve}></Route>
				</Route>
			</Router>
		);
	}
}