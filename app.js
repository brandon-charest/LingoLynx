var express = require('express');
var path = require('path');
var mysql = require('mysql');

var app = express();

//create connection to mysql database
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

//create connection to elasticsearch
//todo: create connection to elasticsearch

//include routes
require('./routes')(app);

// error handlers
// development error handler
// will print stacktrace



module.exports = app;
