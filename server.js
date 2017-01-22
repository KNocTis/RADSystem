'use strict';

// set up ======================================================================
// get all the tools we need
//var express = require('express');
import Express from 'express';
var app      = new Express();
var port     = process.env.PORT || 8085;

import path from 'path';

import mongoose from 'mongoose';
import passport from 'passport';
import flash from 'connect-flash';

import morgan from 'morgan';
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser';
import session from 'express-session';

//import navBar from './components/Navbar.js';

//var configDB = require('./config/database.js');
import configDB from './config/database.js';

// configuration ===============================================================
//mongoose.connect(configDB.url); // connect to our database

//require('./config/passport')(passport); // pass passport for configuration

// views settings ===============================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));

// define the folder that will be used for static assets
app.use(Express.static(path.join(__dirname, 'public')));

app.get('/ittest',(req, res) => {
	
	app.render('consultant');
})

app.get('/',(req, res) => {
	
//	let markup = <NavBar/>;
		 
	res.render('consultant');
})


app.listen(port);
console.log("magic happening on port:" + port);

