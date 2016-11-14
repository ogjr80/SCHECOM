var passport = require('passport'); //authentication library
var LocalStrategy = require('passport-local').Strategy; //local login
var User = require('../models/user');

//serialze and deserialize 
passport.serializeUser(function(user, done){
	done(null, user._id);
});

passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	});
});

//middleware
passport.use('local-login', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email,password, done){
	User.findOne({email: email}, function(err, user){
		if(err) return done(err);

		if(!user){
			return done(null, false, req.flash('loginMessage', 'no user has been created'));
		}

		if(!user.comparePassword(password)){
			return done(null, false, req.flash('loginMessage', 'Oops! Wrong Password passport-local'));
		}
		return done(null, user);
	});
}));


//custom function to validate

exports.isAuthenticated = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	return res.redirect('/login');
}

