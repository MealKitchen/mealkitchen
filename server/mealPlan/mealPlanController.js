// var appCodes = require('../config/config.js');
var http = require('http');
var MealPlan = require('./mealPlanModel');

var saveMealPlan = function(recipes){
  var recipeIds = [];
  for (var i = 0; i < recipes.length; i++) {
    recipeIds.push(recipes[i].id);
  }
  new MealPlan({
    'userId': 0
  }).save().then(function(mealPlan){
    return mealPlan.recipes().attach(recipeIds);
  }).catch(function(error) {
    console.error("On associating recipes with meal plan got error:", error);
  });
};


module.exports = {
  createMealPlan: function (request, response) {
    saveMealPlan(request.body.recipes);
    response.status(200).send({});
  },
};
