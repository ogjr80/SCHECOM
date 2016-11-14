//requires
var express= require('express'); 
var mongoose = require('mongoose');
var bodyParser = require('body-parser');  
var morgan = require('morgan');
var ejs = require('ejs'); 
var engine = require('ejs-mate');
var session = require('express-session'); 
var cookieParser = require('cookie-parser'); 
var flash = require('express-flash');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var secret = require('./config/secret');
var User = require('./models/user');
var Category = require('./models/category'); 

//executve the express appp
var app = express(); 

mongoose.connect(secret.database, function(err){
	if(err){
		console.log('error while connecting to the database');
	}
	else 
	{
		console.log('connection to mongo successfull'); 
	}
}); 


//middlesware 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(morgan('dev')); 
app.engine('ejs', engine); 
app.set('view engine', 'ejs'); 
app.use(express.static(__dirname + "/public")); 
app.use(cookieParser());
app.use(session({
	resave:true, 
	saveUninitialized: true,
	secret: secret.secretKey,
	store: new MongoStore({url:secret.database, autoReconnect:true})
}));
app.use(flash()); 
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.user= req.user;
	next();
});

app.use(function(req, res, next){
	Category.find({}, function(err, categories){
		if(err) return next(err);

		res.locals.categories = categories;
		next();
	});
});

//routes
var mainRoutes = require('./routes/main'); 
var userRoutes = require('./routes/user'); 
var categoryRoutes = require('./routes/add-category'); 
app.use(mainRoutes); 
app.use(userRoutes); 
app.use(categoryRoutes); 



app.listen(secret.port, function(){
	console.log('server now running on port'+ secret.port); 
}); 

