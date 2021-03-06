var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// Add passport
var passport = require('passport');
// Add connect flash
var flash = require('connect-flash');
// Add express session
var session = require('express-session');
var routes = require('./routes/index');
var users = require('./routes/users');
// var venues = require('.routes/venues');
var User = require('./models/user');
var Venue = require('./models/venue');
var Rate = require('./models/rate');

var mongoose = require('mongoose');

var venues = require('./routes/api/v1/venues');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./config/passport')(passport); 

// Mongoose connection
mongoose.connect(process.env.DB_CONN_SPORTY);

// routes
app.use('/', routes);
app.use('/api/v1/venues/', venues);

app.use('/users', users);
// app.use('/venues', venues);

// Required for passport
app.use(session({ secret: 'b1t3myshlnym3t@L@5s' })); // session secret
app.use(passport.initialize()); //initialize passport
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes 
require('./routes/passport.js')(app, passport); // load our routes and pass in our app 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
