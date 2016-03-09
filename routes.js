var logger = require('morgan');
var bodyParser = require('body-parser');

var routes = function (app) {
    //Route setup (must be first)
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    //Users
    require('./users/routes')(app);

    //Languages
    require('./languages/routes')(app);

    //Sentences
    require('./sentences/routes')(app);

    //Comments
    require('./comments/routes')(app);

    //Error Handler (must be last)
    app.use(function (err, req, res, next) {
        console.error(err.stack || err);
        res.status(err.status || 500).send(err);
    });
};

module.exports = routes;
