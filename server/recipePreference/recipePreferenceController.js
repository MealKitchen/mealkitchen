var Promise = require('bluebird');
var http = require('http');
var RecipePreference = require('./recipePreferenceModel');
var Recipe = require('../recipe/recipeModel');

var savePreference = function(request){
  var preference = request.body;
  new RecipePreference({
    'userId': request.session.user.id,
    'recipeId': preference.recipeId,
    'preference': preference.preference
  }).save().then(function(recipePreference){
    console.log('Saved recipe Preference to db');
  }).catch(function(err){
    console.error('error saving recipe preference: ', err);
  });
}


module.exports = {

  updatePreferences: function (request, response) {
    // update recipe like/dislike table in db
    savePreference(request);
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
  // mapUserPreferences: function(userId){
  //   return new Promise(function(resolve, reject){

  //     module.exports.getUserPreferences(userId).then(function(userPreferences){

  //       userPreferences.map(function(val, index, array){

  //         Recipe.where({id: val.recipeId}).fetch().then(function(recipe){
  //           var attr = recipe.attributes;
  //           val.flavors = attr.salty !== null ? {
  //             'salty':attr.salty,
  //             'sour':attr.sour,
  //             'sweet':attr.sweet,
  //             'bitter':attr.bitter,
  //             'piquant':attr.piquant,
  //             'meaty': attr.meaty
  //           } : null;
  //           if (index === array.length - 1) {
  //             kNearestNeighbors(array, results, request, response);
  //           }
  //         });
  //     })
  //   });
  // }

};
