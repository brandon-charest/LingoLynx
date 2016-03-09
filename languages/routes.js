var languagesController = require("./controller");

var languageRoutes = function(app) {
    app.get('/languages', languagesController.getAllLanguages);

    app.get('/languages/:language_id', languagesController.getLanguageByIdLanguage);

    app.post('/languages', languagesController.createLanguage);

    app.put('/languages/:language_id', languagesController.updateLanguage);
};

module.exports = languageRoutes;
