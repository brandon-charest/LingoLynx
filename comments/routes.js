var router = function (app) {

    app.get('/comments', app.controllers.comments.getAllComments);

    app.get('/comments/:comment_id', app.controllers.comments.getCommentByIdComment);

    app.post('/comments', app.controllers.comments.createComment);

    app.put('/comments/:comment_id', app.controllers.comments.updateComment);

};

module.exports=router;