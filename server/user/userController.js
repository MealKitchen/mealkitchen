var appCodes = require('../config/config.js');
var http = require('http');
var User = require('./userModel');

var signup = function(email, password, response) {
  new User({email: email}).fetch().then(function(user) {
    if (!user) {
      new User({email: email, password: password}).save().then(function(user) {
        console.log("Created new account for", email);
      });
    } else {
      console.log('Account already exists');
    }
  });
};

var login = function(email, password, response) {
  new User({email: email}).fetch().then(function(user){
    if( !user ){
      console.log('no such user');
    } else {
      user.comparePassword(password, function(match){
        if (match) {
          console.log("you got logged in!");
        } else {
          console.log("wrong password!");
        }
      });
    }
  });
};

module.exports = {
  routeUser: function(request, response) {
    console.log("Request body is", request.body);
    if (request.body.login) {
      login(request.body.email, request.body.password, response);
    } else if (request.body.signup) {
      signup(request.body.email, request.body.password, response);
    }
    response.end();
  }
};

