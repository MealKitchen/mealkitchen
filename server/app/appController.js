var Promise = require('bluebird');
var recipePreferenceController = require('../recipePreference/recipePreferenceController');
var recipeController = require('../recipe/recipeController');
var mealPlanController = require('../mealPlan/mealPlanController');
var userController = require('../user/userController');
var kNN = require('../kNN');
var utils = require('../config/utility');

module.exports = {
  getUserRecipes: function(req, res){
    Promise.all([
      //get recipes from yummly
      //will return in form of
      //{
      //  breakfastRecipes: [...],
      //  lunchRecipes: [...],
      //  dinnerRecipes: [...]
      //}
      //if query was empty value will be empty array
      recipeController.createRecipes(req.body),

      //get user recipe preferences
      recipePreferenceController.getUserPreferences(req.session.user.id)

    ])
    .then(function(results){

      var matches = results[0];
      
      var preferences = results[1];
      //console.log("original match recipes: ", matches);

      //res.status(200).send(matches);
      kNN.runMachine(matches, preferences).then(function(results){
        console.log("kNN results: ", results);
        res.status(200).send(results);
      })
    })
    .catch(function(error){
      res.status(500).send({'error': error});
    })
  },

  getUserMealPlans: function(req, res){
    mealPlanController.fetchMealPlans(req.session.user.id)
      .then(function(mealPlans){

        res.status(200).send(mealPlans);
      })
      .catch(function(error){
        res.status(500).send(error);
      })
  },
  saveUserMealPlan: function(req, res){
    var recipesPrefs = mealPlanController.saveMealPlanRecipePreferences(req);
   
    for (var i = 0; i < recipesPrefs.length; i++) {
      recipePreferenceController.savePreference(recipesPrefs[i]);
    }    

    recipeController.getMealPlanRecipes(req.body)
    .then(function(recipesFromYummly){

      Promise.all([
        recipeController.saveRecipeArray(recipesFromYummly.breakfast, 'breakfast'),
        recipeController.saveRecipeArray(recipesFromYummly.lunch, 'lunch'),
        recipeController.saveRecipeArray(recipesFromYummly.dinner, 'dinner')
      ])
      .then(function(){

        mealPlanController.createMealPlan(req.session.user.id, req.body.title, utils.getObjectRecipeIds(recipesFromYummly))
        .then(function(mealPlanId){
          res.status(200).send({mealPlanId: mealPlanId});
        })
        .catch(function(error){
          res.status(500).send({'error saving mealplan': error});
        })

      })
      .catch(function(error){
        res.status(500).send({'error saving recipes from yummly': error});
      })
    })
    .catch(function(error){
      res.status(500).send({'error saving user meal plan': error});
    })
  }

};

