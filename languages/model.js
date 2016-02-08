var q = require('q');

var languagesModel = function (app) {
    var returnObject = {
        //db queries
        getAllFromLanguage: "SELECT * FROM language",
        getAllFromLanguageWhereIdLanguageMatches: "SELECT * FROM language WHERE idLanguage=?",
        createNewLanguage: "INSERT INTO language SET ?",
        updateLanguage: "UPDATE language SET ? WHERE idLanguage=?",

        //record properties
        propertiesThatCanBeSetWhenCreatingNewLanguage: ['englishName', 'name'],
        propertiesRequiredToCreateNewLanguage: ['englishName', 'name'],
        propertiesThatCanBeSetWhenUpdatingLanguage:['englishName', 'name', 'isActive'],
        propertiesRequiredToUpdateLanguage: [],

        //functions
        getLanguagesEnglishNameFromIdLanguage: getLanguagesEnglishNameFromIdLanguage
    };

    //todo: create function that takes in array of langId and makes one db call
    function getLanguagesEnglishNameFromIdLanguage(langId) {
        var deferred = q.defer();

        app.db.query(returnObject.getAllFromLanguageWhereIdLanguageMatches, langId, function(err, rows){
            if(err){
                deferred.reject(err);
                return;
            }

            if (rows && rows[0] && rows[0].idUser && rows[0].idUser.toString() === langId.toString()) {
                deferred.resolve(rows[0]);
                return;
            }
        });

        return deferred.promise;
    }

    return returnObject; //need to use properties of this object in the functions above
};

module.exports = languagesModel;
