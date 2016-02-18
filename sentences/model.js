var q = require('q');

var sentencesModel = function (app) {
    //construct query
    function constructSearchSentencesTextQuery(options) {
        if (!options.query) {
            return;
        }

        var queryString = options.query,
            sort = options.sort || [{field: "text", type: "asc"}],
            limit = options.limit || 10,
            page = options.page || 1,
            skip = (page - 1) * limit;

        var query = {};

        //define query
        query.query = {
            match: {}
        };
        query.query.match.text = queryString;


        //define sort
        query.sort = [];
        sort.forEach(function (sortElement) {
            if (sortElement.field && sortElement.type) {
                var sortObject = {};
                sortObject[sortElement.field] = {order: sortElement.type};
                query.sort.push(sortObject);
            }
        });
        if (!query.sort.length) {
            delete query.sort;
        }

        return query;
    }

    function constructSearchSentencesByUserQuery(options) {
        if (!options.idUser) {
            return;
        }

        var idUser = options.idUser,
            sort = options.sort || [{field: "text", type: "asc"}],
            limit = options.limit || 10,
            page = options.page || 1,
            skip = (page - 1) * limit;

        var query = {};

        //define query
        query.query = {
            match: {}
        };
        query.query.match.idUser = idUser;


        //define sort
        query.sort = [];
        sort.forEach(function (sortElement) {
            if (sortElement.field && sortElement.type) {
                var sortObject = {};
                sortObject[sortElement.field] = {order: sortElement.type};
                query.sort.push(sortObject);
            }
        });
        if (!query.sort.length) {
            delete query.sort;
        }

        return query;
    }

    //search es
    function searchSentences(languagesEnglishNames, queryOptions) {
        var deferred = q.defer();

        var query;
        switch (queryOptions.typeOfSearch) {
            case 'user':
                query = constructSearchSentencesByUserQuery(queryOptions);
                break;
            case 'general':
            default:
                query = constructSearchSentencesTextQuery(queryOptions);
                break;
        }

        if (!query) {
            deferred.reject('could not construct es dsl query');
            return;
        }

        var searchOption = {
            type: 'sentence',
            body: query
        };

        if (languagesEnglishNames) {
            searchOption.index = 'lingo-lynx-sentences-' + languagesEnglishNames.toLowerCase();
        }

        app.es.search(searchOption, function (err, response) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(response);
            }
        });

        return deferred.promise;
    }

    //expects sentenceId to looks like: langEnglishName-esIndex
    function getSentenceByIdSentence(sentenceId) {
        var deferred = q.defer();

        var sentenceIdArray = sentenceId.split('-');
        var languageName = sentenceIdArray[0];
        sentenceIdArray.splice(0, 1);
        var esId = sentenceIdArray.join('');

        if (!esId || esId === '') {
            deferred.reject('bad sentenceId');
            return deferred.promise;
        }

        var searchOption = {
            index: 'lingo-lynx-sentences-' + languageName.toLowerCase(),
            type: 'sentence',
            id: esId
        };

        app.es.get(searchOption, function (err, response) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(response);
            }
        });

        return deferred.promise;
    }

    function indexNewSentence(languageEnglishName, sentenceObject) {
        var deferred = q.defer();

        var indexOption = {
            index: 'lingo-lynx-sentences-' + languageEnglishName.toLowerCase(),
            type: 'sentence',
            body: sentenceObject
        };

        app.es.index(indexOption, function (err, response) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(response);
            }
        });

        return deferred.promise;
    }

    function updateSentence(sentenceId, sentenceObject) {
        var deferred = q.defer();

        var sentenceIdArray = sentenceId.split('-');
        var languageName = sentenceIdArray[0];
        sentenceIdArray.splice(0, 1);
        var esId = sentenceIdArray.join('');

        if (!esId || esId === '') {
            deferred.reject('bad sentenceId');
            return deferred.promise;
        }

        var updateOption = {
            index: 'lingo-lynx-sentences-' + languageName.toLowerCase(),
            type: 'sentence',
            id: esId,
            body: {
                doc: sentenceObject
            }
        };

        app.es.update(updateOption, function (err, response) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(response);
            }
        });

        return deferred.promise;
    }

    return {
        //public query functions
        searchSentences: searchSentences,
        getSentenceByIdSentence: getSentenceByIdSentence,
        indexNewSentence: indexNewSentence,
        updateSentence: updateSentence,

        //record properties
        propertiesThatCanBeSetWhenCreatingNewSentence: ['text', 'idUser', 'isActive'],
        propertiesRequiredToCreateNewSentence: ['text', 'idUser', 'isActive'],
        propertiesThatCanBeSetWhenUpdatingSentence: ['text', 'isActive'],
        propertiesRequiredToUpdateSentence: []
    };
};

module.exports = sentencesModel;
