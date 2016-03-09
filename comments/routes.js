var commentsController = require("./controller");

var commentsRoutes = function (app) {
    app.get('/comments', commentsController.getAllComments);

    app.get('/comments/:comment_id', commentsController.getCommentByIdComment);

<<<<<<< Updated upstream
    app.post('/comments', app.controllers.comments.createComment);

    app.put('/comments/:comment_id', app.controllers.comments.updateComment);
=======
    app.post('/comments', commentsController.creatComment);
>>>>>>> Stashed changes

    app.put('/comments/:comment_id', commentsController.updateComment);
};

module.exports = commentsRoutes;
