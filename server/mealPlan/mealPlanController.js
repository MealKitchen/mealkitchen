var Promise = require('bluebird');
var http = require('http');
var MealPlan = require('./mealPlanModel');
var recipeController = require('../recipe/recipeController')
var utils = require('../config/utility');


module.exports = {

  saveRecipes: function(userId, body) {
    return new Promise(function(resolve, reject) {
      var recipeObject = {
        "breakfast": parseRecipeIds(body.breakfastRecipes),
        "lunch": parseRecipeIds(body.lunchRecipes),
        "dinner": parseRecipeIds(body.dinnerRecipes)
      };

      //var recipes = [];
      var newRecipes = [];
      var counter = 0;

      // for (var meal in recipeObject) {
      //   recipes = recipes.concat(recipeObject[meal]);
      // }

      //for each course
      for (var course in recipeObject) {
        //for each recipe in course
        for (var i = 0; i < recipeObject[course].length; i++) {
          //get request to yummly for richer data
          recipeController.getToYummly(recipeObject[course][i], course, function(results, course){

            newRecipes.push(results.id);
            //save recipe data in db
            recipeController.saveRecipe(results, course, function(){

              counter++;
              //done
              if (counter === recipes.length) {
                resolve(newRecipes);
              }
            });
          });
        }
      }
    });
  },

  createMealPlan: function (userId, recipes) {

    return new Promise(function(resolve, reject){
      new MealPlan({ 'userId': userId }).save({}, {method: 'insert'})
      .then(function(mealPlan){
        console.log('recipes in create meal plan are', recipes);
        mealPlan.recipes().attach(recipes).then(function() {
          resolve(mealPlan.id);
        })
        .catch(function(error) {
          console.error("On attaching recipes to meal plan got:", error);
        });
      })
      .catch(function(error) {
        console.error("On associating recipes with meal plan got error:", error);
        reject(error);
      });
    });
  },
  fetchMealPlans: function (userId) {
    return new Promise(function(resolve, reject){

      new MealPlan().query({where: {userId: userId}})
        .fetchAll({withRelated: 'recipes'})
        .then(function(mealPlans) {
          resolve(mealPlans)
        }).catch(function(error) {
          console.log("Sorry, could not find any meal plans for that user. Error:", error);
          reject(error);
        });
    })
  }
};
