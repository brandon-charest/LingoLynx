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
                    languageModel = require('../../languages/model')(app);
                    done();
                });
            });

            //todo: Error: timeout of 2000ms exceeded. Ensure the done() callback is being called in this test
            it('should return "spanish" with an input of 1', function (done) {
                var expectedOutput = 'spanish';
                console.log('first')
                languageModel.getLanguagesEnglishNameFromIdLanguage(1)

                    .then(function (languageEnglishName) {
                        console.log('second')
                        assert.equal(languageEnglishName, expectedOutput);

                        done();
                    }).catch(function (err) {
                        console.log('third')
                        assert.ifError(err);
                        done();
                    });
            });
        });

    });
});