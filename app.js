//  App middleware.
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


//  Router middleware.
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');

var app = express();

//  Setting up mySQL connection pool to 'pricosha' database.
var pool = require('./mysqlpool');

//  Getting connection from pool and making test query.
pool.getConnection(function (err, connection) {
  connection.query('SELECT * FROM Person', function (err, rows, fields) {
    if (err) throw err;
  
    //  TODO: Remove synchronous logging.
    console.log('Username: ' + rows[0].username);
    console.log('Password: ' + rows[0].password);
    console.log('First Name: ' + rows[0].first_name);
    console.log('Last Name: ' + rows[0].last_name);
  });

  connection.release();
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);

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
