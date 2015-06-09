var Promise = require('bluebird');
var http = require('http');
var MealPlan = require('./mealPlanModel');
var recipeController = require('../recipe/recipeController')

//returns an array of recipe ids, necessary for relational bookshelf association 
// var parseRecipeIds = function(recipes){
//   var recipeIds = [];
//   for (var i = 0; i < recipes.length; i++) {
//     recipeIds.push(recipes[i].id);
//   }
//   return recipeIds;
// }

var parseRecipeIds = function (recipes) {
    var items = [];
    for (var i = 0; i < recipes.length; i++) {
      var item = recipes[i].id;
      items.push(item);
    }
    return items;
};

module.exports = {

  saveRecipes: function(userId, request) {
    return new Promise(function(resolve, reject) {
      var recipeObject = {
        "breakfast": parseRecipeIds(request.breakfastRecipes),
        "lunch": parseRecipeIds(request.lunchRecipes),
        "dinner": parseRecipeIds(request.dinnerRecipes)
      };

      var recipes = [];
      var counter = 0;
      for (var key in recipeObject) {
        recipes = recipes.concat(recipeObject[key]);
      }

      for (var key in recipeObject) {
        for (var i = 0; i < recipeObject[key].length; i++) {
          recipeController.getToYummly(recipeObject[key][i], function(results, key){
            recipeController.saveRecipe(results, key, function(){
              counter++;
              console.log("counter: ", counter);
              if (counter === recipes.length - 1) {
                resolve(recipes);
              }
            });
          }, key);
        }
      }
    });
  },

  
  createMealPlan: function (userId, recipes) {

    return new Promise(function(resolve, reject){
      new MealPlan({ 'userId': userId }).save()
      .then(function(mealPlan){
        mealPlan.recipes().attach(recipes);
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
