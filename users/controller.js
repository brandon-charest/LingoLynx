var usersController = function (app) {
    function getAllUsers(req, res, next) {
        app.db.query(app.models.users.getAllFromUser, function (err, rows) {
            if (err) {
                next(err);
                return;
            }

            res.send(rows);
        });
    }

    function getUserByIdUser(req, res, next) {
        var idUserFromRequest = req.params.user_id;

        if (!idUserFromRequest) {
            next('No idUser specified in request');
            return;
        }

        app.db.query(app.models.users.getAllFromUserWhereIdUserMatches, [idUserFromRequest], function (err, rows) {
            if (err) {
                next(err);
                return;
            }

            if (rows && rows[0] && rows[0].idUser && rows[0].idUser.toString() === idUserFromRequest) {
                res.send(rows[0]);
                return;
            }

            next('No user matches that id');
        });
    }

    function createUser(req, res, next) {
        next('Not yet implemented');
    }

    function updateUser(req, res, next) {
        next('Not yet implemented');
    }

    return {
        getAllUsers: getAllUsers,
        getUserByIdUser: getUserByIdUser,
        createUser: createUser,
        updateUser: updateUser
    };
};

module.exports = usersController;
