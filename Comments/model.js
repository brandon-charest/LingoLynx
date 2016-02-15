var q= require('q');

var commentModel= function (app) {
    var returnObject = {
        //db queries
        getAllFromComment: "SELECT * FROM comment",
        getAllFromCommentWhereIdCommentMatches: "SELECT * FROM comment WHERE idComment=?",
        createNewComment: "INSERT INTO comment SET ?",
        updateComment: "UPDATE comment SET ? WHERE idComment=?",

        //record properties
        propertiesThatCanBeSetWhenCreatingNewComment: ['idComment', 'idUser', 'idSentence', 'description'],
        propertiesRequiredToCreateNewComment:['idComment', 'idUser', 'idSentence', 'descrption'],
        propertiesThatCanBSetWhenUpdatingComment: ['idComment', 'idUser', 'idSentence', 'description',
            'likes','dislikes', 'isActive'],
        propertiesRequiredToUpdateComment: [],

        //functions
        //todo find correct function name and finish function
        getCommentFromIdComment: getCommentFromIdComment
    };


};
module.exports=commentModel;