var es = require('elasticsearch');

var client = new es.Client({
    host: 'localhost:9200',
    log: 'trace'
});

client.ping({}, function(err){
    if(err){
        console.error(err);
    } else {
        onESConnection();
    }
});

//main
function onESConnection(){
    console.log('Connected to ES');
}