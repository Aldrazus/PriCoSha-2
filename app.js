//  App middleware.
var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var mysqlstore = require('express-mysql-session')(session);
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


//  Router middleware.
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var homeRouter = require('./routes/home');
var logoutRouter = require('./routes/logout');

var app = express();

//  MySQL connection pool
var pool = require('./mysqlpool');

//  Config
var config = require('./config');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//  other middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//  setting up session store
var sessionStore = new mysqlstore(config.pool);

//  setting up session config to include new session store
var sessionConfig = Object.assign({ store: sessionStore }, config.session);

//  session middleware
app.use(session(sessionConfig));

//  router middleware
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/home', homeRouter);
app.use('/logout', logoutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
