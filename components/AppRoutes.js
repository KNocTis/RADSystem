import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import Layout from './Layout.js';
import Howtouse from './Howtouse.js';
import ReserveIndex from './ReserveIndex.js';

export default class AppRoutes extends React.Component {
	render () {
		return (
			<Router history={browserHistory}>
				<Route path="/" component={Layout}>
					<IndexRoute component={ReserveIndex}></IndexRoute>
               <Route path="/reserve" component={ReserveIndex}></Route>
				</Route>
			</Router>
		);
	}
}