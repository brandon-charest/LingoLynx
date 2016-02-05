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
        var user = {};

        var allRequiredPropertiedToCreateNewUserArePresent = true;
        var missingRequiredPropertiesToCreateNewUser = [];
        app.models.users.propertiesRequiredToCreateNewUser.forEach(function (propertyRequiredToCreateNewUser) {
            if (!req.body[propertyRequiredToCreateNewUser]) {
                allRequiredPropertiedToCreateNewUserArePresent = false;
                missingRequiredPropertiesToCreateNewUser.push(propertyRequiredToCreateNewUser);
            }
        });

        if (!allRequiredPropertiedToCreateNewUserArePresent) {
            next('Missing the following required fields: ' + missingRequiredPropertiesToCreateNewUser);
        }

        //todo: make isActive default to true in schema-model
        if(!user.isActive){
            user.isActive = true;
        }

        app.models.users.encryptPassword(req.body.password)
            .then(function (encryptedPassword) {
                req.body.password = encryptedPassword;

                app.models.users.propertiesThatCanBeSetWhenCreatingNewUser.forEach(function (userProperty) {
                    if (req.body[userProperty]) {
                        user[userProperty] = req.body[userProperty]
                    }
                });

                app.db.query(app.models.users.createNewUser, [user], function (err, results) {
                    if (err) {
                        next(err);
                        return;
                    }
                    app.db.query(app.models.users.getAllFromUserWhereIdUserMatches, [results.insertId], function (err, rows) {
                        if (err) {
                            next(err);
                            return;
                        }

                        if (rows && rows[0] && rows[0].idUser && rows[0].idUser.toString() === results.insertId.toString()) {
                            res.send(rows[0]);
                            return;
                        }

                        next('Could not retrieve user after inserting it');
                    });
                });
            })
            .catch(function (err) {
                next(err);
            })
            .done();
    }

    function updateUser(req, res, next) {
        var tempUser= ()
    }



    return {
        getAllUsers: getAllUsers,
        getUserByIdUser: getUserByIdUser,
        createUser: createUser,
        updateUser: updateUser
    };
};

module.exports = usersController;
