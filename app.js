var express = require('express');
var path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//work area start
var app = express();
var mysql = require('mysql');
//TODO: Move DB information to config file
app.db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'LingoLynx'
});

app.db.connect(function (err) {
    if (err) {
        console.error('could not connect to DB', err);
    } else {
        console.log('Successfully connect to DB');
    }
});


//routes start


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//routes
require('./routes/users')(app);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {

    app.use(function (err, req, res, next) {
        console.log(err);
        res.sendStatus(err.status || 500);
        console.log('send error');
    });
}


// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.sendStatus(err.status || 500);

});


module.exports = app;
