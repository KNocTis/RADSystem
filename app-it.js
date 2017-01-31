import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from './components-it/AppRoutes.js';


window.onload = () => {
  ReactDOM.render(<AppRoutes/>, document.getElementById('main'));
};

