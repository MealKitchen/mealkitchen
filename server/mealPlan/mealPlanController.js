var http = require('http');
var MealPlan = require('./mealPlanModel');

module.exports = {
  createMealPlan: function (request, response) {
    var recipeIds = [];
    for (var i = 0; i < request.body.recipes.length; i++) {
      recipeIds.push(request.body.recipes[i].id);
    }

    var userId = request.body.userId || 0;
    new MealPlan({
      'userId': userId
    }).save().then(function(mealPlan){
      response.status(200).send({});
      return mealPlan.recipes().attach(recipeIds);
    }).catch(function(error) {
      console.error("On associating recipes with meal plan got error:", error);
      response.status(404).send({error: error});
    });
  },
  fetchMealPlans: function (request, response) {
    new MealPlan().query({where: {userId: request.query.userId}}).fetchAll({withRelated: 'recipes'}).then(function(collection) {
      response.status(200).send(collection);
    }).catch(function(error) {
      console.log("Sorry, could not find any meal plans for that user. Error:", error);
      response.status(404).send({error: error});
    });
  }
};
