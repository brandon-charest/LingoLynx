var express = require('express');
var router= function(app){

  app.get('/users', function(req, res, next) {
    res.send('all users');
  });

  app.get('/users/:user_id', function(req, res, next) {
    res.send('single user');
  });

  app.post('/users', function(req, res, next) {
    res.send('created user');
  });

  app.put('/users/:user_id', function(req, res, next) {
    res.send('edited user');
  });

};





module.exports = router;
