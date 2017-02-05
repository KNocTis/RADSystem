'use strict';

// set up ======================================================================
// get all the tools we need
//var express = require('express');
import Express from 'express';
var app      = new Express();
var port     = process.env.PORT || 8085;

var server = require('http').Server(app);

//import Realtime-Common modules
import SocketIO from 'socket.io';
var io = SocketIO(server);

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
app.use('/ts', Express.static(path.join(__dirname, 'private')));

app.get('/ittest',(req, res) => {
	
	app.render('consultant');
})

app.get('/',(req, res) => {
	
//	let markup = <NavBar/>;
		 
	res.render('consultant');
})

app.get('/ts',(req, res) => {
	
//	let markup = <NavBar/>;
		 
	res.render('ts');
})


//app.listen(port, function(){
//	console.log("magic happening on port:" + port);
//});

server.listen(port, () => {
	console.log("Magic happening on port:" + port);
})

//////////////////////////////////
//////////  Socket.io  ///////////
//////////////////////////////////

io.on("connection", socket => {
    
    //
	console.log("socket.io started");
	
    //Consultant end
	
	// msg object :
	// msg.type ====>
	//			0 ===> request for test
	//			1 ===> cancel test
	
	socket.on('reserve', teamviewerDetail => {
		
		console.log("Test request received", "id: ", teamviewerDetail.id, " pw: ", teamviewerDetail.password );
		
		socket.emit('reserve', teamviewerDetail.id);
		
		socket.on(teamviewerDetail.id, msg => {
			if (msg == 'cancel') {
				console.log("canceling test ticket: ", teamviewerDetail.id);
				// send database request
				
				//call back if success
				socket.emit(teamviewerDetail.id, 'cancelled');
			}
		});
				
	});
    
    
    //IT end
//    socket.on();
    
    socket.on('get ticket info', ticketNo => {
		 console.log("Being asked for ticket info of ", ticketNo)
        //get info of ticket from Datebase
        //
        //callback below
//        socket.emit(ticketNo, ticketInfo);
    });
	
	socket.on('disconnect', () => {
		console.log("A user disconnected");
	});
});















