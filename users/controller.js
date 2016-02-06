var async = require('async');
var q = require('q');

var usersController = function (app) {
    function queryDBForUser(userId) {
        var deferred = q.defer();

        app.db.query(app.models.users.getAllFromUserWhereIdUserMatches, [userId], function (err, rows) {
            if (err) {
                deferred.reject(err);
                return;
            }

            if (rows && rows[0] && rows[0].idUser && rows[0].idUser.toString() === userId.toString()) {
                deferred.resolve(rows[0]);
                return;
            }

        });

        return deferred.promise;
    }

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

        queryDBForUser(idUserFromRequest)
            .then(function (user) {
                res.send(user);
            })
            .catch(function (err) {
                next(err);
            })
            .done();

    }

    function createUser(req, res, next) {
        var user = {};
        var newUser;
        var newUserId;

        async.series([
            //check if all required fields are present in request
            function (callback) {
                var missingRequiredPropertiesToCreateNewUser = [];

                app.models.users.propertiesRequiredToCreateNewUser.forEach(function (propertyRequiredToCreateNewUser) {
                    if (!req.body[propertyRequiredToCreateNewUser]) {
                        missingRequiredPropertiesToCreateNewUser.push(propertyRequiredToCreateNewUser);
                    }
                });

                if (missingRequiredPropertiesToCreateNewUser.length) {
                    callback('Missing the following required fields: ' + missingRequiredPropertiesToCreateNewUser);
                } else {
                    callback();
                }
            },
            //encrypt password if there is password in the body
            function (callback) {
                if (!req.body.password) {
                    callback();
                    return;
                }

                app.models.users.encryptPassword(req.body.password)
                    .then(function (encryptedPassword) {
                        req.body.password = encryptedPassword;
                        callback();
                    })
                    .catch(function (err) {
                        callback(err);
                    })
                    .done();
            },
            //create user object
            function (callback) {
                app.models.users.propertiesThatCanBeSetWhenCreatingNewUser.forEach(function (userProperty) {
                    if (req.body[userProperty]) {
                        user[userProperty] = req.body[userProperty];
                    }
                });

                callback();
            },
            //set user as active
            function (callback) {
                user.isActive = true;
                callback();
            },
            //insert user into db
            function (callback) {
                app.db.query(app.models.users.createNewUser, [user], function (err, results) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    newUserId = results.insertId;
                    callback();
                });
            },
            //todo: make insert user return user directly and remove extra call to db
            //get the user
            function (callback) {
                queryDBForUser(newUserId)
                    .then(function (user) {
                        newUser = user;
                        callback();
                    })
                    .catch(function (err) {
                        callback(err);
                    })
                    .done();
            }
        ], function (err) {
            if (err) {
                next(err);
            } else if (newUser) {
                res.send(newUser);
            } else {
                next('could not retrieve user');
            }
        });
    }

    function updateUser(req, res, next) {
        if (!req.params.user_id) {
            next('missing idUser in request params');
            return;
        }

        var idUser = req.params.user_id;
        var user = {};
        var updatedUser;

        async.series([
            //check if all required fields are present in request
            function (callback) {
                var missingRequiredPropertiesToUpdateUser = [];

                app.models.users.propertiesRequiredToUpdateUser.forEach(function (propertyRequiredToUpdateUser) {
                    if (!req.body[propertyRequiredToUpdateUser]) {
                        missingRequiredPropertiesToUpdateUser.push(propertyRequiredToUpdateUser);
                    }
                });

                if (missingRequiredPropertiesToUpdateUser.length) {
                    callback('Missing the following required fields: ' + missingRequiredPropertiesToUpdateUser);
                } else {
                    callback();
                }
            },
            //encrypt password if there is password in the body
            function (callback) {
                if (!req.body.password) {
                    callback();
                    return;
                }

                app.models.users.encryptPassword(req.body.password)
                    .then(function (encryptedPassword) {
                        req.body.password = encryptedPassword;
                        callback();
                    })
                    .catch(function (err) {
                        callback(err);
                    })
                    .done();
            },
            //create user object
            function (callback) {
                var thereExistsAPropertyThatWillBeUpdated;
                app.models.users.propertiesThatCanBeSetWhenUpdatingUser.forEach(function (userProperty) {
                    if (req.body[userProperty]) {
                        user[userProperty] = req.body[userProperty];
                        thereExistsAPropertyThatWillBeUpdated = true;
                    }
                });

                if (thereExistsAPropertyThatWillBeUpdated) {
                    callback()
                } else {
                    callback('There are no properties to update');
                }
            },
            //update user
            function (callback) {
                var idUserAsAnInt;
                try {
                    idUserAsAnInt = parseInt(idUser);
                } catch (exception) {
                    callback(exception);
                }

                app.db.query(app.models.users.updateUser, [user, idUserAsAnInt], function (err) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback();
                });
            },
            //todo: make update user return user directly and remove extra call to db
            //get the user
            function (callback) {
                queryDBForUser(idUser)
                    .then(function (user) {
                        updatedUser = user;
                        callback();
                    })
                    .catch(function (err) {
                        callback(err);
                    })
                    .done();
            }
        ], function (err) {
            if (err) {
                next(err);
            } else if (updatedUser) {
                res.send(updatedUser);
            } else {
                next('could not retrieve user');
            }
        });

    }

    return {
        getAllUsers: getAllUsers,
        getUserByIdUser: getUserByIdUser,
        createUser: createUser,
        updateUser: updateUser
    };
};

module.exports = usersController;
