var http = require('http');
var RecipePreference = require('./recipePreferenceModel');

var savePreference = function(preference){
  new RecipePreference({
    //'userId': preference.userId,
    'recipeId': preference.recipeId,
    'preference': preference.preference
  }).save().then(function(recipePreference){
    console.log('Saved recipe Preference to db');
  }).catch(function(err){
    console.error('error saving recipe preference: ', err);
  });
};

module.exports = {

  updatePreferences: function (request, response) {
    // update recipe like/dislike table in db 
    savePreference(request.body);
    response.status(200).send(request.body);
  }

};