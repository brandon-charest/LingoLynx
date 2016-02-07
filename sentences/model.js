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

    //search es
    function searchSentences(languagesEnglishNames, queryOptions) {
        var deferred = q.defer();

        var query = constructSearchSentencesTextQuery(queryOptions);
        if (!query) {
            deferred.reject('could not construct es dsl query');
            return;
        }

        var searchOption = {
            type: 'sentence',
            body: query
        };

        if (languagesEnglishNames) {
            searchOption.index = languagesEnglishNames;
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

    return {
        //public query functions
        //getAllFromSentenceWhereIdSentenceMatches: getAllFromSentenceWhereIdSentenceMatches,
        //createNewSentence: createNewSentence,
        //updateSentence: updateSentence,
        searchSentences: searchSentences,

        //record properties
        propertiesThatCanBeSetWhenCreatingNewSentence: ['text', 'idUser', 'idLanguage', 'isActive'],
        propertiesRequiredToCreateNewSentence: ['text', 'idUser', 'idLanguage', 'isActive'],
        propertiesThatCanBeSetWhenUpdatingSentence: ['text', 'isActive'],
        propertiesRequiredToUpdateSentence: []
    };
};

module.exports = sentencesModel;
