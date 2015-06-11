var Promise = require('bluebird');
var http = require('http');
var RecipePreference = require('./recipePreferenceModel');
var Recipe = require('../recipe/recipeModel');

module.exports = {

  savePreference: function(request){
    var preference = request.body;
    new RecipePreference({
      'userId': preference.userId,
      'preference': preference.preference,
      'salty': preference.salty,
      'sour': preference.sour,
      'sweet': preference.sweet,
      'bitter': preference.bitter,
      'meaty': preference.meaty,
      'piquant': preference.piquant,
      //'course': preference.course
    }).save().then(function(recipePreference){
      console.log('Saved recipe Preference to db');
    }).catch(function(err){
      console.error('error saving recipe preference: ', err);
    });
  },

  updatePreferences: function (request, response) {
    // update recipe like/dislike table in db
    module.exports.savePreference(request);
    response.status(200).send(request.body);
  },

  getUserPreferences: function (userId) {

    return new Promise(function(resolve, reject){

      RecipePreference.where({'userId': userId || 1})
      .fetchAll().then(function(preferences){
        if(preferences){
          resolve(preferences.models);
        }
        else{
          resolve([]);
        }
      });
    });
  }

};
