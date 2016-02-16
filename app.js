var express = require('express');
var mysql = require('mysql');
var elasticsearch = require('elasticsearch');
var config = require('config');

var app = express();

//create connection to mysql database
app.db = mysql.createConnection(config.get('mysql.connectionSettings'));

//create connection to elasticsearch
app.es = elasticsearch.Client(config.get('es.connectionSettings'));

app.db.connect(function (err) {
    if (err) {
        console.error('could not connect to DB', err);
    } else {
        console.log('Successfully connect to DB');
    }
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