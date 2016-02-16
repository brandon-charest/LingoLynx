var es = require('elasticsearch');
var async = require('async');

//data seed
var dataSeeds = {
    french: require('./french'),
    japanese: require('./japanese')
};

//config
var esClientConfig = config.get('es.connectionSettings');

var indexName = config.get('es.indexNameStem');

var languages = config.get('es.supportedLanguages').map(function (a) {
    return a.englishName;
});
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
    async.each(languages,
        function (language, callback) {
            if (dataSeeds[language] && dataSeeds[language].length) {
                async.each(dataSeeds[language],
                    function (dataSeed, innerCallback) {
                        client.index({
                                index: indexName + language,
                                type: 'sentence',
                                body: dataSeed
                            }, function (err) {
                                innerCallback(err);
                            }
                        )
                    }, function (err) {
                        callback(err);
                    }
                );
            }
        },
        function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log('Successfully created ', indexName, ' and updated all mappings');
            }
        }
    );
}