var Promise = require('bluebird');
var http = require('http');
var Recipe = require('./recipeModel');
var RecipePreference = require('../recipePreference/recipePreferenceModel');
var db = require('../db');
var lib = require('../config/libraries');

var appId, apiKey;
try {
  appId = process.env.APPLICATION_ID || require('../config/config.js').APPLICATION_ID;
  apiKey = process.env.APPLICATION_KEY || require('../config/config.js').APPLICATION_KEY;
} 
catch (e) {
  appId = 12345;
  apiKey = 98765;
}

var writeQueries = function(queryModel){
  var allowedAllergyList = queryModel.allowedAllergy;
  var allowedCuisineList = queryModel.allowedCuisine;
  var allowedDietList = queryModel.allowedDiet;

  //handling stringified number values from client so as to not concatenate 10 
  queryModel.numBreakfasts *= 1;
  queryModel.numLunches *= 1;
  queryModel.numDinners *= 1;

  // If number of course meals specified, add 10 meals for queueing functionality
  var numBreakfasts = queryModel.numBreakfasts && queryModel.numBreakfasts + 10;
  var numLunches =  queryModel.numLunches && queryModel.numLunches + 10;
  var numDinners =  queryModel.numDinners && queryModel.numDinners + 10;


  //will likely have to track additional requests for each course
  var start = queryModel.additionalRequest ? queryModel.totalRecipesRequested : 0;

  var breakfastQueryString, lunchQueryString, dinnerQueryString;
  var queryString = ''; 

  // add each allowed allergy/cuisine/diet to query string
  for (var key in allowedAllergyList) {
    if (allowedAllergyList[key]) {
      queryString += "&allowedAllergy[]" + "=" + lib.allowedAllergyLibrary[key];
    }
  }
  for (key in allowedCuisineList) {
    if (allowedCuisineList[key]) {
      queryString += "&allowedCuisine[]" + "=" + lib.allowedCuisineLibrary[key];
    }
  }
  for (key in allowedDietList) {
    if (allowedDietList[key]) {
      queryString += "&allowedDiet[]" +  "=" + lib.allowedDietLibrary[key];
    }
  }

  breakfastQueryString = numBreakfasts > 0 ?
    "http://api.yummly.com/v1/api/recipes?_app_id=" + appId +
    "&_app_key=" + apiKey +
    queryString + "&allowedCourse[]=" + lib.course.Breakfast + "&requirePictures=true" +
    "&maxResult=" + numBreakfasts + "&start=" + start : "";

  lunchQueryString = numLunches > 0 ?
    "http://api.yummly.com/v1/api/recipes?_app_id=" + appId +
    "&_app_key=" + apiKey +
    queryString + "&allowedCourse[]=" + lib.course.Lunch + "&requirePictures=true" +
    "&maxResult=" + numLunches + "&start=" + start : "";

  dinnerQueryString = numDinners > 0 ?
    "http://api.yummly.com/v1/api/recipes?_app_id=" + appId +
    "&_app_key=" + apiKey +
    queryString + "&allowedCourse[]=" + lib.course.Dinner + "&requirePictures=true" +
    "&maxResult=" + numDinners + "&start=" + start : "";

  return {
    'breakfastQuery': breakfastQueryString, 
    'lunchQuery': lunchQueryString, 
    'dinnerQuery': dinnerQueryString
  };
};

var queryYummly = function(queryString){

  return new Promise(function(resolve, reject){
    var results;
    //no meals entered for param; query is empty string
    if(!queryString){
      console.log('hello error query');
      resolve([]);
    } else{

      http.get(queryString, function(yummlyResponse){
        var str = '';
        
        yummlyResponse.on('data', function (chunk) {
          str += chunk;
        });

        yummlyResponse.on('end', function () {
          results = JSON.parse(str);
          resolve(results.matches);

        });
        yummlyResponse.on('error', function(error){
          reject(error);

        })
      });
    }


  });
};

var getToYummly = function (recipeId, callback) {
  //var recipeId = request.header.recipeId;
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
      callback(results);
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

var handleMultipleRecipes = function (recipeIds) {

  var fnsToExecute = [];
  for (var i = 0; i < recipeIds.length; i++) {
    getToYummly(recipeId, function(results) {

    })   
  }

  return fnsToExecute;
}

var processIngredientsList = function (recipeIds, callback) {
  var ingredientsList = [];

  var functionsToRun = [];
  Promise.all(function(){
    for (var i = 0; i < recipeIds.length; i++) {
      functionsToRun.push(getToYummly(recipeIds[i], function(results) {
        return results;
      }));
    }
    return functionsToRun;
  }).then(function(results) {
    console.log(results);
    // change array of ingredients into a single array
    //callback(results);
  });
  // for every recipe in recipeIds, call getToYummly 
  // pull out the ingredients
  // save the ingredients and add to total ingredients array
  // send ingredients array back to 

};

var getRecipeId = function (request) {
  var recipeId = request.headers.recipeId || request.body.recipeIds;
  return recipeId;
}

module.exports = {

  createRecipes: function (queryModel) {

    return new Promise(function(resolve, reject){

      //queries takes form of 
      //{
      //  breakfastQuery: "...", 
      //  lunchQuery: "...", 
      //  dinnerQuery: "..."
      //}
      //if course has 0 meals, that query will result in empty string
      var queries = writeQueries(queryModel);

      console.log('queries', queries)

      Promise.all([
        queryYummly(queries.breakfastQuery),
        queryYummly(queries.lunchQuery),
        queryYummly(queries.dinnerQuery)
      ])
      .then(function(results){
        //resolved value will be empty array if empty string is passed in 
        var breakfasts = results[0] || results[0].matches;
        var lunches = results[1] || results[1].matches;
        var dinners = results[2] || results[2].matches;
        console.log(dinners);
        resolve({
          'breakfastRecipes': breakfasts,
          'lunchRecipes': lunches,
          'dinnerRecipes': dinners
        });

      })
      .catch(function(error){
        console.log('error in create recipes:', error);
        reject({'error': error});
      });
      
    });
  },

  getYummlyRecipe: function (request, response) {
    var recipeId = getRecipeId(request);
    getToYummly(recipeId, function(results) {
      response.status(200).send(results);
    })
  },
  createIngredientsList: function (request, response) {
    var recipeIds = getRecipeId(request);
    processIngredientsList(recipeIds, function(ingredientsList){
      response.status(200).send(ingredientsList);
    });
  }
};

