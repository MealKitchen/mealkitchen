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
      //will return in form of 
      //{
      //  breakfastRecipes: [...],
      //  lunchRecipes: [...],
      //  dinnerRecipes: [...]
      //}
      //if query was empty value will be empty array
      recipeController.createRecipes(req.body)

      //get user recipe preferences
      //recipePreferenceController.getUserPreferences(req.session.user.id)

    ])
    .then(function(results){
      
      //temporary solution
      var matches = results[0];
      // var userPreferences = results[1];
      // var seededPreferences = [];

      // for(var i = 0; i < userPreferences.length; i++){
      //   var pref = userPreferences[i].attributes;
        
      //   pref.salty = Math.random();
      //   pref.sour = Math.random();
      //   pref.sweet = Math.random();
      //   pref.bitter = Math.random();
      //   pref.meaty = Math.random();
      //   pref.piquant = Math.random();
      //   seededPreferences.push(pref);        
      // }

      res.status(200).send(matches);
      // kNN.runMachine(matches, seededPreferences).then(function(results){
        
      //   res.status(200).send(results);
      // })
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
    mealPlanController.saveRecipes(req.session.user.id, req.body).then(function(recipes){
      console.log("just saved all recipes");
      mealPlanController.createMealPlan(req.session.user.id, recipes)
      .then(function(){
        console.log("just created the meal plan");
        //client side takes an empty object as a proper response. Will error without
        res.status(200).send({});
      })
      .catch(function(error){
        res.status(500).send(error);
      })
    }
  )}
};

