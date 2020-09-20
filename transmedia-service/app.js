var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressMongoDb = require('express-mongo-db');
var config = require('./config');

var homeRouter = require('./routes/home');
var mapRouter = require('./routes/map');
var rankingRouter = require('./routes/ranking');
var commandRouter = require('./routes/commands');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var db = expressMongoDb(config.db.url + config.db.port + config.db.path)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
app.use('/map', mapRouter);
app.use('/commands', commandRouter);
// This routes last so db errors does not propagates
app.use(db);
app.use('/ranking', rankingRouter);


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
  if(res.statusCode == 500){
    res.render('error', {message: "Internal Server Error", error: {status: 500}});
  }else {
    res.render('error');
  }
});

module.exports = app;
