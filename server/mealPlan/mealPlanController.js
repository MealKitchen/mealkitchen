var http = require('http');
var MealPlan = require('./mealPlanModel');

var saveMealPlan = function(requestBody){
  var recipeIds = [];
  for (var i = 0; i < requestBody.recipes.length; i++) {
    recipeIds.push(requestBody.recipes[i].id);
  }

  var userId = requestBody.userId || 0;
  new MealPlan({
    'userId': userId
  }).save().then(function(mealPlan){
    return mealPlan.recipes().attach(recipeIds);
  }).catch(function(error) {
    console.error("On associating recipes with meal plan got error:", error);
  });
};


module.exports = {
  createMealPlan: function (request, response) {
    saveMealPlan(request.body);
    response.status(200).send({});
  },
};
