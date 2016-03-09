var config = require('./config/development');
var app = require('express')();

app.log = console.log;
app.logError = console.error;
app.logWarning = console.warning;

//create connection to mysql database
app.db = require('mysql').createConnection(config.database.connectionSettings);
app.db.connect(function(err) {
    if (err) {
        app.logError('could not connect to DB', err);
        return;
    }
    app.log('Successfully connect to DB');
});

//create connection to elasticsearch
app.es = require('elasticsearch').Client(config.elasticsearch.connectionSettings);
app.es.ping({}, function(err) {
    if (err) {
        app.logError('could not connect to ES', err);
        return;
    }
    app.log('Successfully connect to ES');
});

/*
 * Routes
 */

var logger = require('morgan');
var bodyParser = require('body-parser');

//Route setup (must be first)
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//Users
require('./users/routes')(app);

//Languages
require('./languages/routes')(app);

//Sentences
require('./sentences/routes')(app);

//Error Handler (must be last)
app.use(function(err, req, res, next) {
    app.logError(err.stack || err);
    res.status(err.status || 500).send(err);
});

module.exports = app;
