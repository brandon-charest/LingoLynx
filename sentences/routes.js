var router = function (app) {
    app.get('/sentences/search', app.controllers.sentences.searchSentences);

    app.get('/sentences/:sentence_id', app.controllers.sentences.getSentenceByIdSentence);

    app.post('/sentences', app.controllers.sentences.createSentence);

    app.put('/sentences/:sentence_id', app.controllers.sentences.updateSentence);

    app.get('/users/:user_id/sentences', app.controllers.sentences.getSentencesCreatedByUser);
};

module.exports = router;