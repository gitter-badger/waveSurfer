var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', function(req, res) {
  var pathName = path.join(__dirname, 'views/index.html');
  console.log(pathName);
  return res.sendFile(pathName, function(err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    } else {
      return;
    }
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// // error handlers
// // will print stacktrace
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: err
//   });
// });

module.exports = app;
