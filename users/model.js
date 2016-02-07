var q = require('q');

var usersModel = function (app) {
    function encryptPassword(unencryptedPassword) {
        var deferred = q.defer();

        //todo: encrypt password
        var encryptedPassword = unencryptedPassword;

        deferred.resolve(encryptedPassword);
        return deferred.promise;
    }

    return {
        //db queries
        getAllFromUser: "SELECT * FROM user",
        getAllFromUserWhereIdUserMatches: "SELECT * FROM user WHERE idUser=?",
        createNewUser: "INSERT INTO user SET ?",
        updateUser: "UPDATE user SET ? WHERE idUser=?",

        //record properties
        propertiesThatCanBeSetWhenCreatingNewUser: ['username', 'password', 'email'],
        propertiesRequiredToCreateNewUser: ['username', 'password', 'email'],
        propertiesThatCanBeSetWhenUpdatingUser:['username', 'password', 'email', 'isActive'],
        propertiesRequiredToUpdateUser: [],

        //functions
        encryptPassword: encryptPassword
    };
};

module.exports = usersModel;
