var sentencesController = require("./controller");

var sentenceRoutes = function (app) {
    app.get('/sentences/search', sentencesController.searchSentences);

    app.get('/sentences/:sentence_id', sentencesController.getSentenceByIdSentence);

    app.post('/sentences', sentencesController.createSentence);

    app.put('/sentences/:sentence_id', sentencesController.updateSentence);

    app.get('/users/:user_id/sentences', sentencesController.getSentencesCreatedByUser);
};

module.exports = sentenceRoutes;
