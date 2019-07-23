//  App middleware.
const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const mysqlstore = require('express-mysql-session')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


//  Router middleware.
const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const homeRouter = require('./routes/home');
const logoutRouter = require('./routes/logout');
const friendsRouter = require('./routes/friends');
const manageRouter = require('./routes/manage');

const app = express();

//  MySQL connection pool
const pool = require('./mysqlpool');

//  Config
const config = require('./config');

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
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/home', homeRouter);
app.use('/logout', logoutRouter);
app.use('/friends', friendsRouter);
app.use('/manage', manageRouter);

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
