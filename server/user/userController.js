var http = require('http');
var User = require('./userModel');

var signup = function(email, password, response) {
  new User({email: email}).fetch().then(function(user) {
    if (!user) {
      new User({email: email, password: password}).save().then(function(user) {
        response.status(200).send(user);
      });
    } else {
      response.status(409).send({error: 'Account already exists.'});
    }
  });
};

var login = function(email, password, response) {
  new User({email: email}).fetch().then(function(user){
    if( !user ){
      response.status(401).send({error: 'No such user.'});
    } else {
      user.comparePassword(password, function(match){
        if (match) {
          response.status(200).send(user);
        } else {
          response.status(401).send({error: 'Incorrect password.'});
        }
      });
    }
  });
};

module.exports = {
  routeUser: function(request, response) {
    if (request.body.login) {
      login(request.body.email, request.body.password, response);
    } else if (request.body.signup) {
      signup(request.body.email, request.body.password, response);
    }
  }
};

