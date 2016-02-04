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

    //Error Handlers (must be last)
    app.use(function (err, req, res, next) {
        console.err(err);
        res.send(err.status || 500, err);
    });
};

module.exports = routes;
