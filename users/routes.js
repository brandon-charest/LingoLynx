var router = function (app) {
    app.get('/users', app.controllers.users.getAllUsers);

    app.get('/users/:user_id', app.controllers.users.getUserByIdUser);

    app.post('/users', app.controllers.users.createUser);

    app.put('/users/:user_id', app.controllers.users.updateUser);
};

module.exports = router;
