var express = require('express');
var path = require('path');
var mysql = require('mysql');
var elasticsearch = require('elasticsearch');

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
//TODO: Move ES information to config file
app.es = elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

app.es.ping({}, function (err) {
    if (err) {
        console.error('could not connect to ES', err);
    } else {
        console.log('Successfully connect to ES');
    }
});

//setup controllers
app.controllers = {
    users: require('./users/controller')(app),
    languages: require('./languages/controller')(app),
    comments: require('./comments/controller')(app),
    sentences: require('./sentences/controller')(app)
};

//setup models
app.models = {
    users: require('./users/model')(app),
    languages: require('./languages/model')(app),
    comments: require('./comments/model')(app),
    sentences: require('./sentences/model')(app)
};

//include routes
require('./routes')(app);

module.exports = app;