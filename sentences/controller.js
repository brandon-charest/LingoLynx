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

                if (typeof req.query.languages === 'string' || typeof req.query.languages === 'number') {
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
        next('not yet implemented');
    }

    function createSentence(req, res, next) {
        next('not yet implemented');
    }

    function updateSentence(req, res, next) {
        next('not yet implemented');
    }

    return {
        searchSentences: searchSentences,
        getSentenceByIdSentence: getSentenceByIdSentence,
        createSentence: createSentence,
        updateSentence: updateSentence
    };
};

module.exports = sentencesController;
