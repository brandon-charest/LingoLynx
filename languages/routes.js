var router = function (app) {
    app.get('/languages', app.controllers.languages.getAllLanguages);

    app.get('/languages/:language_id', app.controllers.languages.getLanguageByIdLanguage);

    app.post('/languages', app.controllers.languages.createLanguage);

    app.put('/languages/:language_id', app.controllers.languages.updateLanguage);
};

module.exports = router;
