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
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';

// views settings ===============================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));

// define the folder that will be used for static assets
app.use(Express.static(path.join(__dirname, 'public')));
app.use('/ts', Express.static(path.join(__dirname, 'private')));

app.use(morgan('dev')); 
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
// required for passport
app.use(session({
    secret: 'fuuuuuuuuuullstackpmit', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//var configDB = require('./config/database.js');

// configuration ===============================================================
import configDB from './config/database.js';
mongoose.connect(configDB.url); // connect to our database

//require('./config/passport')(passport); // pass passport for configuration
require('./config/passport.js')(passport);

app.get('/ittest',(req, res) => {
	
	app.render('consultant');
});

app.get('/',(req, res) => {
	
//	let markup = <NavBar/>;
		 
	res.render('consultant');
});

let isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}

app.get('/ts', isLoggedIn, (req, res) => {
	
//	let markup = <NavBar/>;
	console.log(req.user);
	res.render('ts');
});


app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/signup', (req, res) => {
	res.render('signup');
});

app.post("/login", passport.authenticate('local-login', {
	successRedirect: '/ts',
	failureRedirect: '/login',
	failureFlash: false
	})
);

app.post("/signup", passport.authenticate('local-signup', {
	successRedirect: '/login',
	failureRedirect: '/signup',
	failureFlash: false
	})
);

// API ========================================================================
// API =========================API===========================================

app.get("/api/get-table-list", isLoggedIn, (req, res) => {
	console.log("User: ", req.user.local.username, " requseted for table list");
   
   configDB.getTicketsList(20, "", (err, data) => {
      if (err) {
         console.warn("Error occured when find tickets", err);
         return false;
      }
      
      res.json(data);
   })
//   res.json({message: "loaded"});
})

app.get("/api/get-tickets-from", isLoggedIn, (req, res) => {
	console.log("User: ", req.user.local.username, " requseted for tickets from ", req.query);
   
   configDB.getTicketsFrom(Number(req.query.from), 20, (err, tickets) => {
      if (err) {
         console.warn("Error occured when find tickets", err);
         res.json([]);
         return false;
      }
      
      console.log("Got ", tickets.length, " tickets from ", req.query.from);
      res.json(tickets);
   })
//   res.json({message: "loaded"});
})

app.get("/api/search-tickets", isLoggedIn, (req, res) => {
	console.log("User: ", req.user.local.username, " requseted for searching ", req.query);
   
   configDB.searchTickets(req.query.content, (err, tickets) => {
      if (err) {
         console.warn("Error occured when find tickets", err);
         res.json([]);
         return false;
      }
      
      res.json(tickets);
   })
//   res.json({message: "loaded"});
})

app.post("/api/change-ticket-status", isLoggedIn, (req, res) => {
	console.log("User: ", req.user, " requseted for ticket status changing");
   console.log("request: ", req);
   res.json({message: "loaded"});
})

app.post("/api/create-ticket", (req, res) => {
	console.log("ID: ", req.body.tvID, "PW: ", req.body.tvPW);
//   console.log(req.body);
   
   if(req.body.tvID){
      configDB.createNewTicketWithIDAndPw(req.body.tvID, req.body.tvPW, req.body.others, (err, ticket) => {
         broadcastWaitingStatus();
         
         io.emit('new-ticket-created', ticket);
         
         res.json(ticket);
      });
   }

})

app.post("/api/takeover-ticket", (req, res) => {
//	console.log("User: ", req.user.local.username, "request to take over the ticket", req.body.ticketNo);
//   console.log(req.body);
   
   let handler = req.user.local.firstname + " " + req.user.local.lastname;
	console.log("User: ", handler, "request to take over the ticket", req.body.ticketNumber);

   if(req.body.ticketNumber){
          
      configDB.takeOverTicket(req.body.ticketNumber, handler, (err, ticket) => {
         //If someone has taken over or other errors
         if (err){
            res.json(err);
            return false; //Break  ==========================
         }
         
         //Send broadcast
         ticketHasBeenModified(ticket);
         
         //Check waiting count and broadcast
         configDB.getWaitingTickets((err, tickets) => {
            if (err) {
               console.warn("Error occured when querying waiting tickets");
               return false;
            }
            
            broadcastWaitingStatus(tickets);
         });
         
      });
   }
})

app.post("/api/cancel-ticket", (req, res) => {
	console.log("Cancelling ticket: ", req.body.ticket.ticketNumber);
//   console.log(req.body);
   
   if(req.body){
      configDB.cancelTicket(req.body.ticket.ticketNumber, req.body.type, (err, ticket) => {
         ticketHasBeenModified(ticket);
         res.json("Cancelled");
      });
   }

})

app.post("/api/finish-ticket", (req, res) => {
//   console.log(req.body);
   let handler = req.user.local.firstname + " " + req.user.local.lastname;

   console.log("User ", handler, " is finishing ticket: ", req.body.ticketNumber, " will change to ", req.body.status);
   
   if(req.body){
      configDB.finishTicket(req.body.ticketNumber, req.body.status, handler, (err, ticket) => {
         if (err) {
            res.json(err);
            return false;
         }
         
         ticketHasBeenModified(ticket);
      });
   }

})

app.post("/api/update-ticket", (req, res) => {
	console.log("Updating ticket: ", req.body.ticketNumber);
//   console.log(req.body);
   
   if(req.body){
      configDB.updateTicket(req.body, (err, ticket) => {
         if (err) {
            res.send(err);
            return false;
         }
         
         ticketHasBeenModified(ticket);
         res.send('send');
      });
   }

})

app.post("/api/push-noti-for-ticket", (req, res) => {
	console.log("Pushing notification for ticket: ", req.body.ticketNumber);
//   console.log(req.body);
   
   if(req.body.ticketNumber){
      io.emit(req.body.ticketNumber, {notification: req.body.notification});
      res.send("um hum");
   }

})
// API ========================================================================
// API =========================API END===========================================


let ticketHasBeenModified = (ticket) => {
   console.log("Socketio broadcast in channel ", ticket.ticketNumber);
   io.emit(ticket.ticketNumber, ticket);
}


let broadcastWaitingStatus = () => {
   
   configDB.getWaitingTickets((err, tickets) => {
      let broadcastForTicket = (ticket, index) => {      
         io.emit(ticket.ticketNumber, {waitingCount: index});
      }

      tickets.map(broadcastForTicket);
   })

}

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
		 console.log("Being asked for ticket info of ", ticketNo);
        //get info of ticket from Datebase
        //
        //callback below
//        socket.emit(ticketNo, ticketInfo);
    });
	
	socket.on('disconnect', () => {
		console.log("A user disconnected");
	});
});


//Side methods










