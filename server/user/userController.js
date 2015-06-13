var Promise = require('bluebird');
var http = require('http');
var createSession = require('../config/utility').createSession;
var User = require('./userModel');

module.exports = {
  login: function(username, password) {
    console.log('login with', username, password);
    return new Promise(function(resolve, reject){
      new User({username: username}).fetch().then(function(user){
        if( !user ){
          reject({error: 'No such user.', status: 401});
        } else {
          user.comparePassword(password, function(match){
            if (match) {
              resolve(user);
            } else {
              reject({error: 'Incorrect password.', status: 401})
            }
          });
        }
      });
    })
  },
  signup: function(username, password) {

    return new Promise(function(resolve, reject){
      new User({username: username}).fetch().then(function(user) {
        if (!user) {
          new User({username: username, password: password}).save()
          .then(function(user) {
            resolve(user);
          })
          .catch(function(error){
            reject({'error saving new user to database ': error})
          })
        } else {
          reject({error: 'Account already exists.', status: 409});
        }
      });
    });
  }
};

