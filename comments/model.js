var q = require('q');

var commentModel = function (app) {
    var returnObject = {
        //db queries
        getAllFromComment: "SELECT * FROM comment",
        getAllFromCommentWhereIdCommentMatches: "SELECT * FROM comment WHERE idComment= ?",
        createNewComment: "INSERT INTO comment SET ?",
        updateComment: "UPDATE comment SET ? WHERE idComment=?",
        getCommentByIdComment:getCommentIdByIdComment,
        //record properties
        propertiesThatCanBeSetWhenCreatingNewComment: ['idUser', 'idSentence', 'description'],
        propertiesRequiredToCreateNewComment: ['idUser', 'idSentence', 'description'],
        propertiesThatCanBSetWhenUpdatingComment: ['idUser', 'idSentence', 'description',
            'likes', 'dislikes', 'isActive'],
        propertiesRequiredToUpdateComment: [],


    };

    function getCommentIdByIdComment(commentId){
        var deferred= q.defer();
        app.db.query(returnObject.getAllFromCommentWhereIdCommentMatches, commentId, function(err, rows) {

            if(err){
                deferred.reject(err);
                return;
            }

            if(rows && rows[0] && rows[0].idUser && rows[0].idUser.toString() === commentId.toString()) {
               deferred.resolve(rows[0]);
                return;
            } else {
                deferred.reject('failure')
            }
        });

        return deferred.promise;
    }

    function getAllFromComment(comment) {
        var deferred= q.defer();
        app.db.query(returnObject.getAllFromComment, comment, function(err, rows){
            if(err){
                deferred.reject(err);
                return;
            }


        });
    }
    return returnObject;

};
module.exports = commentModel;