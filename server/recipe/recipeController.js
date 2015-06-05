var Promise = require('bluebird');

var appId, apiKey;

try {
  appId = process.env.APPLICATION_ID || require('../config/config.js').APPLICATION_ID
  apiKey = process.env.APPLICATION_KEY || require('../config/config.js').APPLICATION_KEY;
} 
catch (e) {
  appId = 12345;
  apiKey = 98765;
}
var http = require('http');
var Recipe = require('./recipeModel');
var RecipePreference = require('../recipePreference/recipePreferenceModel');
var db = require('../db');
var lib = require('../config/libraries');


var writeQuery = function(queryModel){
  var allowedAllergyList = queryModel.allowedAllergy;
  // generate query for 10x meals requested by user in order to handle batch request
  var numResults = 10 * queryModel.numMeals;

  var start = queryModel.additionalRequest ? queryModel.totalRecipesRequested : 0;
  var queryString = "";
  var results = {};
  
  // add each allowed allergy to query string
  for (var key in allowedAllergyList) {
    if (allowedAllergyList[key]) {
      queryString += "&allowedAllergy[]" + lib.allowedAllergyLibrary[key];
    }
  }
  //var query = "&allowedCuisine[]" + allowedCuisineLibrary[allowedCuisine] + "&allowedAllergy[]" + allowedAllergyLibrary[allowedAllergy] +"&requirePictures=true";
  var query =
    "http://api.yummly.com/v1/api/recipes?_app_id=" + appId +
    "&_app_key=" + apiKey +
    queryString + "&allowedCourse[]=course^course-Main Dishes" + "&requirePictures=true" +
    "&maxResult=" + numResults + "&start=" + start;

  return query;
};

var getToYummly = function (request, response) {
  //var recipeId = request.header.recipeId;
  var recipeId = request.header.recipeId;
  var str = "";
  var results;

  var query = "http://api.yummly.com/v1/api/recipe/" + recipeId + 
  "?_app_id=" + appId + "&_app_key=" + apiKey;

  http.get(query, function(yummlyResponse) {

    yummlyResponse.on('data', function (chunk) {
      str += chunk;
    });

    yummlyResponse.on('end', function () {
      results = JSON.parse(str);
      response.status(200).send(results);    
    });

  });
};


var saveRecipe = function(recipe){
  new Recipe({'id': recipe.id}).fetch().then(function(found){
    if(!found){
      //console.log(recipe);
      var newRecipe = new Recipe({
        'id': recipe.id,
        'recipeName': recipe.recipeName,
        'sourceDisplayName': recipe.sourceDisplayName,
        'smallImgUrl': recipe.smallImageUrls && recipe.smallImageUrls[0],
        'mediumImgUrl': recipe.mediumImageUrls && recipe.mediumImageUrls[0],
        'largeImgUrl': recipe.largeImageUrls && recipe.largeImageUrls[0],
        'cuisine': recipe.attributes.cuisine,
        'course': recipe.attributes.course,
        'holiday': recipe.attributes.holiday,
        'totalTimeInSeconds': recipe.totalTimeInSeconds,
        'ingredients':  recipe.ingredients,
        'rating':recipe.rating,
        'salty': recipe.flavors && recipe.flavors.salty,
        'sour': recipe.flavors && recipe.flavors.sour,
        'sweet':recipe.flavors && recipe.flavors.sweet,
        'bitter':recipe.flavors && recipe.flavors.bitter,
        'piquant':recipe.flavors && recipe.flavors.piquant,
        'meaty': recipe.flavors && recipe.flavors.meaty
      }).save({}, {method: 'insert'}).then(function(recipe){
        // console.log('saved recipe: ', recipe);
      }).catch(function(error) {
        console.log('got error', error);
      });
    }
  });
};

var processIngredients = function (request, response) {
  var recipes = request.body.recipes;
  console.log("process Ingredients: ", request.body.recipes);
};

module.exports = {

  createRecipes: function (queryModel) {

    return new Promise(function(resolve, reject){

      var query = writeQuery(queryModel);

      http.get(query, function(yummlyResponse){
        var str = '';
        
        yummlyResponse.on('data', function (chunk) {
          str += chunk;
        });

        yummlyResponse.on('end', function () {

          var results = JSON.parse(str);

          for(var i = 0; i < results.matches.length; i++){
            //had to make a call to a function to retain recipe info #async
            saveRecipe(results.matches[i]);
          }

          resolve(results.matches);

        });
        yummlyResponse.on('error', function(error){

          reject(error);

        })
      });
    })
  },

  getYummlyRecipe: function (request, response) {
    getToYummly(request, response);
  },
  createIngredientsList: function (request, response) {
    processIngredients(request, response);
  }
};

