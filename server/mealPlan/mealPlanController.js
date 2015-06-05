var Promise = require('bluebird');
var http = require('http');
var MealPlan = require('./mealPlanModel');

//returns an array of recipe ids, necessary for relational bookshelf association 
var parseRecipeIds = function(recipes){
  var recipeIds = [];
  for (var i = 0; i < recipes.length; i++) {
    recipeIds.push(recipes[i].id);
  }
  return recipeIds;
}

module.exports = {
  
  createMealPlan: function (userId, recipes) {

    var recipeIds = parseRecipeIds(recipes);

    return new Promise(function(resolve, reject){
      new MealPlan({ 'userId': userId }).save()
      .then(function(mealPlan){
        mealPlan.recipes().attach(recipeIds);
        resolve();
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
