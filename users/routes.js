var usersController = require("./controller");

var usersRoutes = function (app) {
    app.get('/users', usersController.getAllUsers);

    app.get('/users/:user_id', usersController.getUserByIdUser);

    app.post('/users', usersController.createUser);

    app.put('/users/:user_id', usersController.updateUser);
};

module.exports = usersRoutes;
