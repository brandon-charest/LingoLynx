var q = require('q');

var languagesModel = function (app) {
    return {
        //db queries
        getAllFromLanguage: "SELECT * FROM language",
        getAllFromLanguageWhereIdLanguageMatches: "SELECT * FROM language WHERE idLanguage=?",
        createNewLanguage: "INSERT INTO language SET ?",
        updateLanguage: "UPDATE language SET ? WHERE idLanguage=?",

        //record properties
        propertiesThatCanBeSetWhenCreatingNewLanguage: ['englishName', 'name'],
        propertiesRequiredToCreateNewLanguage: ['englishName', 'name'],
        propertiesThatCanBeSetWhenUpdatingLanguage:['englishName', 'name', 'isActive'],
        propertiesRequiredToUpdateLanguage: []

    };
};

module.exports = languagesModel;
