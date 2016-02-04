var usersModel = function (app) {
    return {
        //db queries
        getAllFromUser: "SELECT * FROM user",
        getAllFromUserWhereIdUserMatches: "SELECT * FROM user WHERE idUser=?"
    };
};

module.exports = usersModel;
