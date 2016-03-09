/**
 * Created by Brandon on 2/13/2016.
 */
var async = require('async');
var q = require('q');
var commentsModel = require("./model");

var commentsController = function(app){
    function queryDBForComments(commentId){
        var deferred = q.defer();

<<<<<<< Updated upstream
       app.db.query(app.models.comments.getAllFromCommentWhereIdCommentMatches, [commentId], function (err, rows){
=======
        app.db.query(commentsModel.getAllFromCommentsWhereIdCommentMatches, [commentId], function (err, rows){
>>>>>>> Stashed changes
            if(err){
                deferred.reject(err);
                return;
            }

            if(rows && rows[0] && rows[0].idComment && rows[0].idComment.toString() === commentId.toString()){
                deferred.resolve(rows[0]);
                return;
            }
        });

        return deferred.promise;

    }

    function getAllComments(req, res, next){
<<<<<<< Updated upstream
        app.db.query(app.models.comments.getAllFromComment, function(err, rows){
=======
        app.db.query(commentsModel.getAllFromComments, function(err, rows){
>>>>>>> Stashed changes
            if(err){
                next(err);
                return;
            }
            res.send(rows);
        });
    }

    function getCommentByIdComment(req, res, next){
        var idCommentFromRequest=req.params.comment_id;

        if(!idCommentFromRequest){
            next('No idComment specified in request');
            return;
        }

        queryDBForComments(idCommentFromRequest)
            .then(function(comment){
                res.send(comment);
            })
            .catch(function(err){
                next(err);
            })
            .done();
    }

    function createComment(req, res, next){
        var comment={};
        var newComment;
        var newCommentId;

        async.series([
            function(callback){
                var missingRequiredProptertiesToCreateNewComment=[];

                commentsModel.propertiesRequiredToCreateNewComment.forEach(function (propertyRequiredToCreateNewComment){
                    if(!req.body[propertyRequiredToCreateNewComment]) {
                        missingRequiredProptertiesToCreateNewComment.push(propertyRequiredToCreateNewComment);
                    }
                });

                if(missingRequiredProptertiesToCreateNewComment.length){
                    callback('Missing the following required fields: '+missingRequiredProptertiesToCreateNewComment);
                }else{
                    callback();
                }
            },
            //create comment object
            function(callback){
                commentsModel.propertiesThatCanBeSetWhenCreatingNewComment.forEach(function (commentProperty){
                    if(req.body [commentProperty]) {
                        comment[commentProperty]=req.body[commentProperty];
                    }
                });

                callback();
            },
            //set comment as active
            function(callback) {
                comment.isHidden=true;
                callback();
            },
            //instert comment into db
            function(callback){
                app.db.query(commentsModel.createNewComment, [comment], function(err, results) {
                    if(err){
                        callback(err);
                        return;
                    }

                    newCommentId=results.insertId;
                    callback();
                });
            },
            //todo: make insert comment return comment directly
            //get the comment
            function (callback) {
                queryDBForComments(newCommentId)
                    .then(function (comment){
                        newComment=comment;
                        callback();
                    })
                    .catch(function (err) {
                        callback(err);
                    })
                    .done();
            }

        ], function(err) {
            if(err) {
                next(err);
            } else if (newComment){
                res.send(newComment);
            } else {
                next('could not retrieve comment');
            }
        });
    }


    function updateComment(req, res, next){
        if(!req.params.comment_id) {
            next('missing idComment in request params');
            return;
        }

        var idComment=req.params.comment_id;
        var comment={};
        var updateComment;

        async.series([
            //check if all required feilds are present in request
            function(callback){
                var missingRequiredPropertiesToUpdateComment=[];

<<<<<<< Updated upstream
                app.models.comments.propertiesRequiredToUpdateComment.forEach(function (propertiesRequiredToUpdateComment) {
=======
                commentsModel.propertiesRequiredtoUpdateComment.forEach(function (propertiesRequiredToUpdateComment) {
>>>>>>> Stashed changes
                    if(!req.body[propertiesRequiredToUpdateComment]) {
                        missingRequiredPropertiesToUpdateComment.push(propertiesRequiredToUpdateComment);
                    }
                });

                if(missingRequiredPropertiesToUpdateComment.length){
                    callback('Missing the following required fields: '+missingRequiredPropertiesToUpdateComment);
                } else {
                    callback();
                }
            },
            //create comment object
            function(callback) {
                var thereExsistsAPropertyThatWillBeUpdated;
<<<<<<< Updated upstream
                app.models.comments.propertiesThatCanBSetWhenUpdatingComment.forEach(function (commentProperty) {
=======
                commentsModel.propertiesThatCanBeSetWhenUpdatingComment.forEach(function (commentProperty) {
>>>>>>> Stashed changes
                    if(req.body[commentProperty]) {
                        comment[commentProperty]=req.body[commentProperty]
                        thereExsistsAPropertyThatWillBeUpdated=true;
                    }
                });

                if(thereExsistsAPropertyThatWillBeUpdated){
                    callback();
                } else {
                    callback('There are no properties to update');
                }
            },
            //update comment
            function(callback){
                var idCommentAsInt;
                try{
                    idCommentAsInt = parseInt(idComment, 10);
                } catch (exception) {
                    callback(exception);
                }

                app.db.query(commentsModel.updateComment, [comment, idCommentAsInt], function (err) {
                    if(err) {
                        callback(err);
                        return;
                    }
                    callback();
                });
            },
            //todo: make update comment return comment directly and remove extra call to db
            //get the comment
            function(callback) {
                queryDBForComments(idComment)
                    .then(function (comment) {
                        updateComment=comment;
                        callback();
                    })
                    .catch(function (err) {
                        callback(err);
                    })
                    .done();
            }
        ], function(err){
            if(err) {
                next(err);
            } else if (updateComment){
                res.send(updateComment);
            } else {
                next('Could not retrieve comment');
            }
        });
    }

    return {
        getAllComments: getAllComments,
        getCommentByIdComment: getCommentByIdComment,
        createComment: createComment,
        updateComment: updateComment
    };
};

module.exports=commentsController;
