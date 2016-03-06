module.exports = function() {
  return {
    security: {
      authentication: {
        //used in signing and authenticating jwts 
        secret: "k@ny0uKe3pas3CrE+" //development only
      }
    },

    database: {
      //used by 'mysql' to connect to our database; objects structure id defined by 
      connectionSettings: { //development only
        host: 'localhost',
        user: 'root',
        password: 'database',
        database: 'LingoLynx' //rename to LingoZen
      }
    },

    elasticsearch: {
      connectionSettings: {
        host: 'localhost' + ':' + '9200',
        // log: trace //used for debugging, 
      },
      indicesStem: 'lingo-lynx-sentences-' //change to lingo-zen-sentences-
    },

    languages: {
      supported: [{
        "name": "français",
        "englishName": "french"
      }, {
        "name": "日本語",
        "englishName": "japanese"
      }],
      //these are only for languages that use analyzers that are not that language's english name
      analyzers: {
        "japanese": "kuromoji"
      }
    }
  }
}
