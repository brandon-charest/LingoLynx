var es = require('elasticsearch');
var async = require('async');
var config = require('config');

//config
var esClientConfig = config.get('es.connectionSettings');

var indexName = config.get('es.indexNameStem');

var languages = config.get('supportedLanguages').map(function (a) {
    return a.englishName;
});
var specialLanguageAnalyzers = config.get('specialLanguageAnalyzers');
//end config

var client = new es.Client(esClientConfig);

client.ping({}, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log('Connected to ES');

        onESConnection();
    }
});

//main
function onESConnection() {
    var languageAnalyzers = {};
    languages.forEach(function (language) {
        if (specialLanguageAnalyzers[language]) {
            languageAnalyzers[language] = specialLanguageAnalyzers[language];
        } else {
            languageAnalyzers[language] = language;
        }
    });

    var mappings = {};
    languages.forEach(function (language) {
        mappings[language] = {
            properties: {
                text: {
                    type: 'string',
                    fields: {
                        stemmed: {
                            type: 'string'
                        }
                    }
                },
                idUser: {
                    type: 'long'
                },
                idLanguage: {
                    type: 'long'
                },
                isActive: {
                    type: 'boolean'
                },
                addedDate: {
                    type: 'date'
                },
                lastModifiedDate: {
                    type: 'date'
                }
            }

        };
        mappings[language].properties.text.fields.stemmed.analyzer = languageAnalyzers[language];
    });

    var indexExists = {};
    async.series([
            //check if indices exists
            function (callback) {
                async.each(languages,
                    //iterator
                    function (language, iteratorCallback) {
                        client.indices.exists({
                            index: indexName + language
                        }, function (err, exists) {
                            if (err) {
                                iteratorCallback(err);
                            } else {
                                indexExists[language] = exists;
                                iteratorCallback();
                            }
                        });
                    },
                    //final callback
                    function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback();
                        }
                    }
                );
            },
            //delete indices if they do
            function (callback) {
                async.each(languages,
                    //iterator
                    function (language, iteratorCallback) {
                        if (!indexExists[language]) {
                            iteratorCallback();
                            return;
                        }

                        client.indices.delete({
                            index: indexName + language
                        }, function (err) {
                            if (err) {
                                iteratorCallback(err);
                            } else {
                                iteratorCallback();
                            }
                        });
                    },
                    //final callback
                    function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback();
                        }
                    }
                );
            },
            //create new indices
            function (callback) {
                async.each(languages,
                    //iterator
                    function (language, iteratorCallback) {
                        client.indices.create({
                            index: indexName + language
                        }, function (err) {
                            if (err) {
                                iteratorCallback(err);
                            } else {
                                iteratorCallback();
                            }
                        });
                    },
                    //final callback
                    function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback();
                        }
                    }
                );
            },
            //update the mapping for each language
            function (callback) {
                async.each(languages,
                    //iterator
                    function (language, iteratorCallback) {
                        client.indices.putMapping({
                            index: indexName + language,
                            type: 'sentence',
                            body: mappings[language]
                        }, function (err) {
                            if (err) {
                                iteratorCallback(err);
                            } else {
                                iteratorCallback();
                            }
                        });
                    },
                    //final callback
                    function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback();
                        }
                    }
                );
            }
        ],
        function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log('Successfully created ', indexName, ' and updated all mappings');
            }
        }
    );
}