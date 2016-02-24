var assert = require('assert');
var config = require('config');
var mysql = require('mysql');
var should=require('should');

var languageModel;

describe('Languages', function () {
    describe('Model Functions', function () {

        describe('getLanguagesEnglishNameFromIdLanguage', function () {
            before(function (done) {
                var app = {};

                //create connection to mysql database
                app.db = mysql.createConnection(config.get('mysql.connectionSettings'));

                app.db.connect(function (err) {
                    assert.ifError(err);
                    languageModel = new require('../../languages/model')(app);
                    done();
                });
            });

            it('should return "spanish" with an input of 1', function (done) {
                var expectedOutput = 'spanish';

                return languageModel.getLanguagesEnglishNameFromIdLanguage(1)
                    .then(function (languageEnglishName) {
                       try {
                           should.deepEqual(languageEnglishName.name, expectedOutput);
                       } catch(err){
                           done(err);
                       }
                        done();
                    });

                    });

            });
        });


});