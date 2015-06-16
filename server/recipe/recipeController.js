var Promise = require('bluebird');
var http = require('http');
var Recipe = require('./recipeModel');
var RecipePreference = require('../recipePreference/recipePreferenceModel');
var RecipePreferenceController = require('../recipePreference/recipePreferenceController');
var db = require('../db');
var lib = require('../config/libraries');
var MealPlan = require('../mealPlan/mealPlanModel');
var utils = require('../config/utility');



//GET to yummlySearchQuery
var queryYummly = function(queryString){

  return new Promise(function(resolve, reject){
    var results;
    //no meals entered for param; query is empty string
    if (!queryString) {
      resolve([]);
    } else {

      http.get(queryString, function(yummlyResponse){
        var str = '';

        yummlyResponse.on('data', function (chunk) {
          str += chunk;
        });

        yummlyResponse.on('end', function () {
          results = JSON.parse(str);

          //we first have the matches here
          resolve(results.matches);

        });
        yummlyResponse.on('error', function(error){
          reject(error);

        })
      });
    }
  });
};

//GET individual recipe from yummly
var getToYummlyById = function(recipeId){
  return new Promise(function(resolve, reject){
    var str = "";
    var recipe;

    var query =  utils.query.yummlyGetById(recipeId);

    http.get(query, function(yummlyResponse) {

      yummlyResponse.on('data', function (chunk) {
        str += chunk;
      });

      yummlyResponse.on('end', function () {
        recipe = JSON.parse(str);
        recipe.matchId = recipeId;
        resolve(recipe)
      });

      yummlyResponse.on('error', function(error) {
        reject({'error in fetchRecipeById': error});
      });
    });
  });
}

//fetch recipe information
// try database first
// else GETbyId to yummly
var fetchRecipeById = function (recipeId) {
  return new Promise(function(resolve, reject){
    new Recipe({matchId: recipeId}).fetch().then(function(found){
      if(!found){
        getToYummlyById(recipeId)
        .then(function(recipe){
          resolve(recipe);
        })
        .catch(function(error){
          reject({'error in getToYummlyById': error})
        })
      }
      else{
        //returned fetched recipe
        resolve(found);
      }
    });
  })
}

//takes an array of recipe ids and will make individual get requests from yummly
var fetchRecipesByIds = function(recipeIds){
  return new Promise(function(resolve, reject){
    var promises = [];
    for(var i = 0; i < recipeIds.length; i++){
      promises.push(fetchRecipeById(recipeIds[i]));
    }

    Promise.all(promises)
    .then(function(fetchedRecipes){
      resolve(fetchedRecipes);
    })
    .catch(function(error){
      console.log('error in array recipe', error);
      reject({'error in fetchRecipesByIds': error});
    })
  });
}



var saveRecipe = function(recipe, course){
  return new Promise(function(resolve, reject){
    new Recipe({'id': recipe.id}).fetch().then(function(found){
      if(!found){
        var newRecipe = new Recipe({
          'id': recipe.id,
          'matchId': recipe.matchId,
          'recipeName': recipe.name,
          'sourceDisplayName': recipe.sourceDisplayName,
          'smallImgUrl': recipe.images && recipe.images[0].hostedSmallUrl,
          'largeImgUrl': recipe.images && recipe.images[0].hostedLargeUrl,
          'cuisine': recipe.attributes.cuisine,
          'course': course,
          'holiday': recipe.attributes.holiday,
          'totalTimeInSeconds': recipe.totalTimeInSeconds,
          'ingredients':  recipe.ingredientLines.join('|'),
          'rating':recipe.rating,
          'salty': recipe.flavors && recipe.flavors.salty,
          'sour': recipe.flavors && recipe.flavors.sour,
          'sweet':recipe.flavors && recipe.flavors.sweet,
          'bitter':recipe.flavors && recipe.flavors.bitter,
          'piquant':recipe.flavors && recipe.flavors.piquant,
          'meaty': recipe.flavors && recipe.flavors.meaty
        }).save({}, {method: 'insert'})
        .then(function(){
          resolve()
        })
        .catch(function(error) {
          reject({'error': error});
        });
      } else {
        resolve()
      }
    });
  });
}



module.exports = {

  createRecipes: function (queryModel, userCourseFlavorPreferences, attempts) {

    return new Promise(function(resolve, reject) {
      attempts = attempts || 0;
      attempts++;

      if (attempts > 2) {
        console.log('not valid query results')
        reject({'error': 'not valid query results', 'status': 406})
      } else {
        var queries = utils.query.createInitialCourseQueries(queryModel, userCourseFlavorPreferences);
        //if course has 0 meals, that query will result in empty string

        var numBreakfastsExpected = queryModel.numBreakfasts*1 && queryModel.numBreakfasts*1 + 10,
          numLunchesExpected = queryModel.numLunches*1 && queryModel.numLunches*1 + 10,
          numDinnersExpected = queryModel.numDinners*1 && queryModel.numDinners*1 + 10;

        Promise.all([
          queryYummly(queries.breakfastQuery),
          queryYummly(queries.lunchQuery),
          queryYummly(queries.dinnerQuery)
        ])
        .then(function(results) {
          //resolved value will be empty array if empty string is passed in
          var breakfasts = results[0] || results[0].matches,
          lunches = results[1] || results[1].matches,
          dinners = results[2] || results[2].matches;

          var expected = [numBreakfastsExpected, numLunchesExpected, numDinnersExpected];
          var recieved = [breakfasts.length, lunches.length, dinners.length];

          //checking if we have enough results to fulfil user request
          if (utils.resultsLengthValid(expected, recieved)) {
            resolve({
              'breakfastRecipes': breakfasts,
              'lunchRecipes': lunches,
              'dinnerRecipes': dinners
            });
          } else {
            //if not, recursively call this function
            module.exports.createRecipes(queryModel, null, attempts).then(function(results) {
              resolve(results);
            }).catch(function(error) {
              reject(error);
            });
          }
        })
        .catch(function(error) {
          reject({'error': error});
        }); 
      }

    });
  },

  courseRefillQuery: function(queryModel, userCourseFlavorPreferences, attempts){

    return new Promise(function(resolve, reject){
      attempts = attempts || 0;
      attempts++;

      var course, userFlavorPrefs, numMeals, offset, returnKey;

      if (attempts > 2) {
        console.log('not valid query results')
        reject({'error': 'not valid query results', 'status': 406})
      } else {
        if(queryModel.offsetB > 0 && queryModel.breakfastRecipes.length === 0){

          course = "Breakfast";
          numMeals = queryModel.numBreakfasts;
          userFlavorPrefs = userCourseFlavorPreferences && userCourseFlavorPreferences[0];
          offset = queryModel.offsetB;
          returnKey = 'breakfastRecipes';

        } else if(queryModel.offsetL > 0 && queryModel.lunchRecipes.length === 0){

          course = "Lunch";
          numMeals = queryModel.numLunches;
          userFlavorPrefs = userCourseFlavorPreferences && userCourseFlavorPreferences[1];
          offset = queryModel.offsetL;
          returnKey = 'lunchRecipes';

        } else if(queryModel.offsetD > 0 && queryModel.dinnerRecipes.length === 0){

          course = "Dinner";
          numMeals = queryModel.numDinners;
          userFlavorPrefs = userCourseFlavorPreferences && userCourseFlavorPreferences[2];
          offset = queryModel.offsetD;
          returnKey = 'dinnerRecipes';

        }
      }

      var refillQueryString = utils.query.createRefillCourseQuery(queryModel, course, userFlavorPrefs, numMeals*1 + 10, offset);

      queryYummly(refillQueryString)
      .then(function(matches){
        if (matches.length >= numMeals*1 + 10) {
          resolve([matches, returnKey]);
        } else {
          //if not, recursively call this function
          module.exports.courseRefillQuery(queryModel, null, attempts).spread(function(matches, returnKey) {
            resolve([matches, returnKey]);
          }).catch(function(error) {
            reject({'error in courseRefillQuery': error});
          });
        }
      })
      .catch(function(error){
        reject({'error in courseRefillQuery': error})
      })

    });

  },
  //optimization note: lookup in database for preexisting recipes
  //potentially save two separate ids for recipes
  //matchId -> id from yummly match
  //getId -> id from individual get request
  getMealPlanRecipes: function(body){

    var recipeObject = {
      "breakfast": utils.parseRecipeIds(body.breakfastRecipes),
      "lunch": utils.parseRecipeIds(body.lunchRecipes),
      "dinner": utils.parseRecipeIds(body.dinnerRecipes)
    };

    return new Promise(function(resolve, reject){

      Promise.props({
        'breakfast': fetchRecipesByIds(recipeObject.breakfast),
        'lunch': fetchRecipesByIds(recipeObject.lunch),
        'dinner': fetchRecipesByIds(recipeObject.dinner)
      })
      .then(function(mealPlanRecipes){
        resolve(mealPlanRecipes);
      })
      .catch(function(error){
        reject({'error in getMealPlanRecipes': error});
      })
    })
  },
  saveRecipeArray: function(recipeArray, course){
    return new Promise(function(resolve, reject){
      var promises = [];
      for(var i = 0; i < recipeArray.length; i++){
        promises.push(saveRecipe(recipeArray[i], course))
      }

      Promise.all(promises)
      .then(function(){
        resolve();
      })
      .catch(function(error){
        reject({'error saving recipe array': error});
      })
    });
  }
};

