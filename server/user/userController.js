var Promise = require('bluebird');
var http = require('http');
var createSession = require('../config/utility').createSession;
var User = require('./userModel');

var ;

var 

module.exports = {
  login: function(email, password) {
    return new Promise(function(resolve, reject){
      new User({email: email}).fetch().then(function(user){
        if( !user ){
          reject({error: 'No such user.', status: 401});
        } else {
          user.comparePassword(password, function(match){
            if (match) {
              createSession(request, response, user);
              // response.status(200).send(user);
            } else {
              reject({error: 'Incorrect password.', status: 401})
              response.status().send();
            }
          });
        }
      });
    })
  },
  signUp: function(email, password) {

    return new Promise(function(resolve, reject){
      new User({email: email}).fetch().then(function(user) {
        if (!user) {
          new User({email: email, password: password}).save()
          .then(function(user) {
            resolve(user);
          })
          .catch(function(error){
            reject({error: error})
          })
        } else {
          reject({error: 'Account already exists.', status: 409});
        }
      });
    });
  }
};

