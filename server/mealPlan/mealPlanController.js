var Promise = require('bluebird');
var http = require('http');
var utils = require('../config/utility');
var MealPlan = require('./mealPlanModel');


var processMealPlanInformation = function(mealPlansBookshelf){

  var mealPlansArray = [], mealPlan, mealPlanObject, recipe;

  for(var i = 0; i < mealPlansBookshelf.models.length; i++){

    mealPlan = mealPlansBookshelf.models[i];
    mealPlanObject = {
      breakfastRecipes: [],
      lunchRecipes: [],
      dinnerRecipes: [],
      title: mealPlan.attributes.title,
      userId: mealPlan.attributes.userId
    };

    mealPlanRecipes = mealPlan.relations.recipes.models;
    for(var j = 0; j < mealPlanRecipes.length; j++){
      recipe = mealPlanRecipes[j].attributes;
      switch(recipe.course){
        case 'breakfast':
          mealPlanObject.breakfastRecipes.push(recipe);
          break;
        case 'lunch':
          mealPlanObject.lunchRecipes.push(recipe);
          break;
        case 'dinner':
          mealPlanObject.dinnerRecipes.push(recipe);
          break;
        default:
          break;
      }
    }
    mealPlansArray.push(mealPlanObject);
  }
  return mealPlansArray;
}

module.exports = {

  createMealPlan: function (userId, title, recipes) {

    return new Promise(function(resolve, reject){
      new MealPlan({ 'userId': userId, 'title': title}).save({}, {method: 'insert'})
      .then(function(mealPlan){
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
          //resolve processed data
          resolve(processMealPlanInformation(mealPlans));

        }).catch(function(error) {
          console.error("Sorry, could not find any meal plans for that user. Error:", error);
          reject(error);
        });
    })
  }
};
