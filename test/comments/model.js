var assert = require('assert');
var config = require('config');
var mysql = require('mysql');
var should = require('should');

var CommentModel;

describe('Comments', function () {
    describe('Model Functions', function () {
        describe('getCommentByIdComment', function () {
            before(function (done) {
                var app = {};

                app.db = mysql.createConnection(config.get('mysql.connectionSettings'));
                app.db.connect(function (err) {
                    assert.ifError(err);
                    CommentModel = new (require('../../comments/model'))(app);
                    done();
                });
            });

            it('should return Test1 with with an input of 1', function (done) {
                var expectedOutput = 'Test1'
                //console.log(CommentModel);
                return CommentModel.getCommentByIdComment(1)
                    .then(function (idComment) {

                        try {
                            should.deepEqual(idComment.description, expectedOutput);
                        } catch (err) {
                            done(err);
                        }
                        done();
                    });

            });


        });
    });
});