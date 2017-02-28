// load all the things we need
//import User from '../model/user';
var User       = require('../model/user');
var LocalStrategy   = require('passport-local').Strategy;


module.exports = (passport) => {
	
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
	
	
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, (req, username, password, done) => {
		console.log("password is ", password);
		process.nextTick(() => {
			User.findOne({'local.username': username}, (err, user) => {
				if (err){
					console.log("Error ocurs when reading database");
					return done(err);
				}	
				if (!user) {
					console.log("Can't find the user \"", user, "\"");
					return done(null, false, {});
				}
				if (password !== user.local.password) {
					console.warn("Wrong password");
					return done(null, false, {});
				}

				console.log("login success");
				done(null, user);

			});
		})

	}));
	
	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
	}, (req, username, password, done) => {
		
		process.nextTick(() => {
			User.findOne({'local.username': username}, (err, user) => {
				if(err){
					console.log("Error ocurs when reading database");
					return done(err);
				}
				if (user){
					console.log("The user \"", user, "\" already exists");
					return done(null, false, {});
				} else {
					let newUser = new User;

					newUser.local.username = username;
					newUser.local.password = password;

					newUser.save((err) => {
						if(err){
							return done(err);
						}

						done(null, newUser);
					});
				}
			});
		})

	}));
}





















