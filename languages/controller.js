var async = require('async');
var q = require('q');

var languagesController = function (app) {
    function queryDBForLanguage(languageId) {
        var deferred = q.defer();

        app.db.query(app.models.languages.getAllFromLanguageWhereIdLanguageMatches, [languageId], function (err, rows) {
            if (err) {
                deferred.reject(err);
                return;
            }

            if (rows && rows[0] && rows[0].idLanguage && rows[0].idLanguage.toString() === languageId.toString()) {
                deferred.resolve(rows[0]);
                return;
            }

        });

        return deferred.promise;
    }

    function getAllLanguages(req, res, next) {
        app.db.query(app.models.languages.getAllFromLanguage, function (err, rows) {
            if (err) {
                next(err);
                return;
            }

            res.send(rows);
        });
    }

    function getLanguageByIdLanguage(req, res, next) {
        var idLanguageFromRequest = req.params.language_id;

        if (!idLanguageFromRequest) {
            next('No idLanguage specified in request');
            return;
        }

        queryDBForLanguage(idLanguageFromRequest)
            .then(function (language) {
                res.send(language);
            })
            .catch(function (err) {
                next(err);
            })
            .done();

    }

    function createLanguage(req, res, next) {
        var language = {};
        var newLanguage;
        var newLanguageId;

        async.series([
            //check if all required fields are present in request
            function (callback) {
                var missingRequiredPropertiesToCreateNewLanguage = [];

                app.models.languages.propertiesRequiredToCreateNewLanguage.forEach(function (propertyRequiredToCreateNewLanguage) {
                    if (!req.body[propertyRequiredToCreateNewLanguage]) {
                        missingRequiredPropertiesToCreateNewLanguage.push(propertyRequiredToCreateNewLanguage);
                    }
                });

                if (missingRequiredPropertiesToCreateNewLanguage.length) {
                    callback('Missing the following required fields: ' + missingRequiredPropertiesToCreateNewLanguage);
                } else {
                    callback();
                }
            },
            //create language object
            function (callback) {
                app.models.languages.propertiesThatCanBeSetWhenCreatingNewLanguage.forEach(function (languageProperty) {
                    if (req.body[languageProperty]) {
                        language[languageProperty] = req.body[languageProperty];
                    }
                });

                callback();
            },
            //set language as active
            function (callback) {
                language.isActive = true;
                callback();
            },
            //insert language into db
            function (callback) {
                app.db.query(app.models.languages.createNewLanguage, [language], function (err, results) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    newLanguageId = results.insertId;
                    callback();
                });
            },
            //todo: make insert language return language directly and remove extra call to db
            //get the language
            function (callback) {
                queryDBForLanguage(newLanguageId)
                    .then(function (language) {
                        newLanguage = language;
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
            } else if (newLanguage) {
                res.send(newLanguage);
            } else {
                next('could not retrieve language');
            }
        });
    }

    function updateLanguage(req, res, next) {
        if (!req.params.language_id) {
            next('missing idLanguage in request params');
            return;
        }

        var idLanguage = req.params.language_id;
        var language = {};
        var updatedLanguage;

        async.series([
            //check if all required fields are present in request
            function (callback) {
                var missingRequiredPropertiesToUpdateLanguage = [];

                app.models.languages.propertiesRequiredToUpdateLanguage.forEach(function (propertyRequiredToUpdateLanguage) {
                    if (!req.body[propertyRequiredToUpdateLanguage]) {
                        missingRequiredPropertiesToUpdateLanguage.push(propertyRequiredToUpdateLanguage);
                    }
                });

                if (missingRequiredPropertiesToUpdateLanguage.length) {
                    callback('Missing the following required fields: ' + missingRequiredPropertiesToUpdateLanguage);
                } else {
                    callback();
                }
            },
            //create language object
            function (callback) {
                var thereExistsAPropertyThatWillBeUpdated;
                app.models.languages.propertiesThatCanBeSetWhenUpdatingLanguage.forEach(function (languageProperty) {
                    if (req.body[languageProperty]) {
                        language[languageProperty] = req.body[languageProperty]
                        thereExistsAPropertyThatWillBeUpdated = true;
                    }
                });

                if (thereExistsAPropertyThatWillBeUpdated) {
                    callback()
                } else {
                    callback('There are no properties to update');
                }
            },
            //update language
            function (callback) {
                var idLanguageAsAnInt;
                try {
                    idLanguageAsAnInt = parseInt(idLanguage);
                } catch (exception) {
                    callback(exception);
                }


                app.db.query(app.models.languages.updateLanguage, [language, idLanguageAsAnInt], function (err) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback();
                });
            },
            //todo: make update language return language directly and remove extra call to db
            //get the language
            function (callback) {
                queryDBForLanguage(idLanguage)
                    .then(function (language) {
                        updatedLanguage = language;
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
            } else if (updatedLanguage) {
                res.send(updatedLanguage);
            } else {
                next('could not retrieve language');
            }
        });

    }

    return {
        getAllLanguages: getAllLanguages,
        getLanguageByIdLanguage: getLanguageByIdLanguage,
        createLanguage: createLanguage,
        updateLanguage: updateLanguage
    };
};

module.exports = languagesController;
