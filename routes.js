var logger = require('morgan');
var cookieParser = require('cookie-parser');
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

    //Error Handlers (must be last)
    app.use(function (err, req, res, next) {
        console.error(err);
        res.status(err.status || 500).send(err);
    });
};

module.exports = routes;
