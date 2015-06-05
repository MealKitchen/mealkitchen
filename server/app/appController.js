var Promise = require('bluebird');
var recipePreferenceController = require('../recipePreference/recipePreferenceController');
var recipeController = require('../recipe/recipeController');
var mealPlanController = require('../mealPlan/mealPlanController');
var userController = require('../user/userController');
var kNN = require('../kNN');


module.exports = {
  getUserRecipes: function(req, res){
    
    Promise.all([
      //get recipes from yummly
      recipeController.createRecipes(req.body),
      //get user recipe preferences
      recipePreferenceController.getUserPreferences(req.session.user.id)
    ])
    .then(function(results){
      
      //temporary solution
      var matches = results[0];
      var userPreferences = results[1];
      var seededPreferences = [];

      for(var i = 0; i < userPreferences.length; i++){
        var pref = userPreferences[i].attributes;
        
        pref.salty = Math.random();
        pref.sour = Math.random();
        pref.sweet = Math.random();
        pref.bitter = Math.random();
        pref.meaty = Math.random();
        pref.piquant = Math.random();
        seededPreferences.push(pref);        
      }

      kNN.runMachine(matches, seededPreferences).then(function(results){
        
        res.status(200).send(results);
      })
    })
    
    
  }
};

