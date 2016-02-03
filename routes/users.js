var express = require('express');
var router= function(app){

  app.get('/users', function(req, res, next) {
    app.db.query('SELECT * FROM user', function(err, rows, feilds){
      if (err) {
        next(err);
        return;
      }
      console.log(rows);
      res.send(rows);
    });

  });

  app.get('/users/:user_id', function(req, res, next) {
    if(!req.params.user_id){
      next('some error or somthing');
      return;
    }
    app.db.query("SELECT * FROM user WHERE idUser=?",[req.params.user_id], function(err, rows, feilds){

      if (err) {

        next(err);
        return;
      }

      if(rows && rows[0] && rows[0].idUser.toString()===req.params.user_id){

        res.send(rows[0]);
      }else{

        next('No user matches that id');
      }

    });

  });

  app.post('/users', function(req, res, next) {
    res.send('created user');
  });

  app.put('/users/:user_id', function(req, res, next) {
    res.send('edited user');
  });

};





module.exports = router;
