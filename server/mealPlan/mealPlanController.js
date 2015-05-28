var appCodes = require('../config/config.js');
var http = require('http');
var MealPlan = require('./mealPlanModel');

var saveMealPlan = function(mealPlan){
  console.log(mealPlan);
  var newMealPlan = new MealPlan({
    'id': recipe.id
  }).save().then(function(recipe){
    console.log('saved recipe: ', recipe);
  });
};


module.exports = {
  createMealPlan: function (request, response) {
    saveMealPlan(request.body.mealPlan);
    response.sendStatus(200);
  },
};
