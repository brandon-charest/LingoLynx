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

    //todo: redo this function and make it use async
    function createLanguage(req, res, next) {
        var language = {};

        var allRequiredPropertiedToCreateNewLanguageArePresent = true;
        var missingRequiredPropertiesToCreateNewLanguage = [];
        app.models.languages.propertiesRequiredToCreateNewLanguage.forEach(function (propertyRequiredToCreateNewLanguage) {
            if (!req.body[propertyRequiredToCreateNewLanguage]) {
                allRequiredPropertiedToCreateNewLanguageArePresent = false;
                missingRequiredPropertiesToCreateNewLanguage.push(propertyRequiredToCreateNewLanguage);
            }
        });

        if (!allRequiredPropertiedToCreateNewLanguageArePresent) {
            next('Missing the following required fields: ' + missingRequiredPropertiesToCreateNewLanguage);
            return;
        }

        //todo: make isActive default to true in schema-model
        if (!language.isActive) {
            language.isActive = true;
        }


        app.models.languages.propertiesThatCanBeSetWhenCreatingNewLanguage.forEach(function (languageProperty) {
            if (req.body[languageProperty]) {
                language[languageProperty] = req.body[languageProperty]
            }
        });

        app.db.query(app.models.languages.createNewLanguage, [language], function (err, results) {
            if (err) {
                next(err);
                return;
            }
            queryDBForLanguage(results.insertId)
                .then(function (language) {
                    res.send(language);
                })
                .catch(function (err) {
                    next(err);
                })
                .done();
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
                    callback(missingRequiredPropertiesToUpdateLanguage);
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
