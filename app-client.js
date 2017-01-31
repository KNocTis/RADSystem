import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router';
import AppRoutes from './components/AppRoutes.js';


window.onload = () => {
  ReactDOM.render(<AppRoutes/>, document.getElementById('main'));
};

