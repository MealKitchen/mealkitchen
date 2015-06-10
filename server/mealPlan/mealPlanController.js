var Promise = require('bluebird');
var http = require('http');
var MealPlan = require('./mealPlanModel');
var recipeController = require('../recipe/recipeController')
var utils = require('../config/utility');


module.exports = {

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
          reject({"On attaching recipes to meal plan got": error})
        });
      })
      .catch(function(error) {
        console.error("On associating recipes with meal plan got error:", error);
        reject({"On associating recipes with meal plan got error": error});
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
