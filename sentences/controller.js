var async = require('async');
var q = require('q');

var sentencesController = function (app) {
    function searchSentences(req, res, next) {
        if (!req.query.query) {
            next('missing query');
            return;
        }

        var languagesEnglishNames = [];
        async.series([
            //convert languages into languagesEnglishName
            function (callback) {
                if (!req.query.languages) {
                    callback();
                    return;
                }

                if (typeof req.query.languages === 'string') {
                    try {
                        req.query.languages = parseInt(req.query.languages);
                    } catch (exception) {
                        callback(exception);
                        return;
                    }
                }

                if (typeof req.query.languages === 'number') {
                    req.query.languages = [req.query.languages];
                }

                if (typeof req.query.languages !== 'object' || !Array.isArray(req.query.languages)) {
                    callback('bad type for languages');
                }

                async.each(req.query.languages,
                    function (languageId, iteratorCallback) {
                        try {
                            app.models.languages.getLanguagesEnglishNameFromIdLanguage(languageId)
                                .then(function (languageEnglishName) {
                                    languageEnglishNames.push(languageEnglishName);
                                    iteratorCallback();
                                })
                                .catch(function (err) {
                                    iteratorCallback(err);
                                })
                                .done();
                        } catch (exception) {
                            iteratorCallback(exception);
                        }
                    }, function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback();
                        }
                    });
            }
        ], function (err) {
            if (err) {
                next(err);
                return;
            }

            if (!languagesEnglishNames.length) {
                languagesEnglishNames = null;
            }

            var possibleSearchOptions = ['query', 'sort', 'limit', 'page'];
            var searchOptions = {};
            possibleSearchOptions.forEach(function (possibleSearchOption) {
                if (req.query[possibleSearchOption]) {
                    searchOptions[possibleSearchOption] = req.query[possibleSearchOption];
                }
            });

            app.models.sentences.searchSentences(languagesEnglishNames, searchOptions)
                .then(function (sentences) {
                    console.log('got these sentences from es', sentences);
                    res.send(sentences);
                })
                .catch(function (err) {
                    next(err);
                })
                .done();
        });
    }

    function getSentenceByIdSentence(req, res, next) {
        if (!req.params.sentence_id) {
            next('missing sentence_id');
            return;
        }

        app.models.sentences.getSentenceByIdSentence(req.params.sentence_id)
            .then(function (sentence) {
                console.log('got these sentences from es', sentence);
                res.send(sentence);
            })
            .catch(function (err) {
                next(err);
            })
            .done();
    }

    function getSentencesCreatedByUser(req, res, next) {
        next('not yet implemented');
    }

    function createSentence(req, res, next) {
        var sentence = {};
        var newSentence;
        var languageEnglishName;
        var userId;
        var propertiesRequiredToCreateNewSentence;

        async.series([
            //get userId
            function (callback) {
                //todo: make userId come from jwt
                userId = 1;
                callback();
            },
            //remove idUser from propertiesRequiredToCreateNewSentence
            function (callback) {
                propertiesRequiredToCreateNewSentence = app.models.sentences.propertiesRequiredToCreateNewSentence;

                if (!userId) {
                    callback();
                    return;
                }

                var userIdIndex = propertiesRequiredToCreateNewSentence.indexOf('idUser');
                if (userIdIndex > -1) {
                    propertiesRequiredToCreateNewSentence.splice(userIdIndex, 1);
                }

                callback();
            },
            //get the language that this sentence is in
            function (callback) {
                if (!req.query.language) {
                    callback();
                    return;
                }

                if (typeof req.query.language === 'string') {
                    try {
                        req.query.language = parseInt(req.query.languages);
                    } catch (exception) {
                        callback(exception);
                        return;
                    }
                }

                if (typeof req.query.language !== 'number') {
                    callback('bad type for languages');
                }


                app.models.languages.getLanguagesEnglishNameFromIdLanguage(req.query.language)
                    .then(function (langEnglishName) {
                        languageEnglishName = langEnglishName;
                        callback();
                    })
                    .catch(function (err) {
                        callback(err);
                    })
                    .done();

            },
            //check if all required fields are present in request
            function (callback) {
                var missingRequiredPropertiesToCreateNewSentence = [];

                propertiesRequiredToCreateNewSentence.forEach(function (propertyRequiredToCreateNewSentence) {
                    if (!req.body[propertyRequiredToCreateNewSentence]) {
                        missingRequiredPropertiesToCreateNewSentence.push(propertyRequiredToCreateNewSentence);
                    }
                });

                if (missingRequiredPropertiesToCreateNewSentence.length) {
                    callback('Missing the following required fields: ' + missingRequiredPropertiesToCreateNewSentence);
                } else {
                    callback();
                }
            },
            //create sentence object
            function (callback) {
                app.models.sentences.propertiesThatCanBeSetWhenCreatingNewSentence.forEach(function (sentenceProperty) {
                    if (req.body[sentenceProperty]) {
                        sentence[sentenceProperty] = req.body[sentenceProperty];
                    }
                });

                callback();
            },
            //set idUser in sentence if possible
            function (callback) {
                var idUserIndex = app.models.sentences.propertiesThatCanBeSetWhenCreatingNewSentence.indexOf(idUser);
                if (userId && idUserIndex > -1) {
                    sentence.idUser = userId;
                }

                callback();
            },
            //set sentence as active
            function (callback) {
                sentence.isActive = true;
                callback();
            },
            //insert sentence into db
            function (callback) {
                app.models.sentences.indexNewSentence(languageEnglishName, sentence)
                    .then(function (results) {
                        newSentence = results;
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
            } else {
                res.send(newSentence);
            }
        });
    }

    function updateSentence(req, res, next) {
        next('not yet implemented');
    }

    return {
        searchSentences: searchSentences,
        getSentenceByIdSentence: getSentenceByIdSentence,
        getSentencesCreatedByUser: getSentencesCreatedByUser,
        createSentence: createSentence,
        updateSentence: updateSentence
    };
};

module.exports = sentencesController;
