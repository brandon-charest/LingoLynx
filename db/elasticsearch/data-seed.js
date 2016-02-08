var es = require('elasticsearch');
var async = require('async');

process.stdin.setEncoding('utf8');
process.stdout.setEncoding('utf8');

//config
esClientConfig = {
    host: 'localhost:9200',
    //log: 'trace'
};

var indexName = 'lingo-lynx-sentences-';

var languages = ['japanese', 'french'];
//end config

var client = new es.Client(esClientConfig);

client.ping({}, function (err) {
    if (err) {
        console.error(err);
    } else {
        onESConnection();
    }
});

var dataSeeds = {
    french: [
        {
            idUser: 1,
            idLanguage: 2,
            isActive: true,
            text: "Bonjour le monde"
        }
    ],
    japanese: [
        {
            idUser: 1,
            idLanguage: 3,
            isActive: true,
            text: "こんにちは世界"
        }
    ]
};

//main
function onESConnection() {
    console.log('Connected to ES');

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