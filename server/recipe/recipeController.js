var Promise = require('bluebird');
var http = require('http');
var Recipe = require('./recipeModel');
var RecipePreference = require('../recipePreference/recipePreferenceModel');
var RecipePreferenceController = require('../recipePreference/recipePreferenceController');
var db = require('../db');
var lib = require('../config/libraries');
var MealPlan = require('../mealPlan/mealPlanModel');
var utils = require('../config/utility');

var appId, apiKey;
try {
  appId = process.env.APPLICATION_ID || require('../config/config.js').APPLICATION_ID;
  apiKey = process.env.APPLICATION_KEY || require('../config/config.js').APPLICATION_KEY;
} 
catch (e) {
  appId = 12345;
  apiKey = 98765;
}

var writeQueries = function(queryModel, userFlavorPrefs){


// refer to as initial data

// Query Data extraction
var filterQueryString = utils.query.filter()

  var start = queryModel.additionalRequest ? queryModel.totalRecipesRequested : 0;

  var amoutOfCourse = {
    'Breakfast': queryModel.numBreakfasts*1 && queryModel*1.numBreakfasts + 10,
    'Lunch': queryModel.numLunches*1 && queryModel.numLunches*1 + 10,
    'Dinner': queryModel.numDinners*1 && queryModel.numDinners*1 + 10  
  }

    //if value is present
  var allergyQuery =  queryModel.allowedAllergies ?
                                utils.query.filterValue( queryModel.allowedAllergies, 'Allergy' )
                                : "";

  var dietQuery = queryModel.allowedCuisines ?
                                utils.query.filterValue( queryModel.allowedCuisines, 'Cuisine' )
                                : "";
  var cuisineQuery = queryModel.allowedDiet  ?
                                utils.query.filterValue( queryModel.allowedDiet, 'Diet' )
    : "";

  var filterQueryString = allergyQuery + dietQuery + cuisineQuery;

  var courseStrings = [];

  var coursesForQuery = ['Breakfast', 'Lunch', 'Dinner']

  for(var i = 0; i < course.length; i++){
    var courseQueryString = utils.query.course()

      filterQueryStr +

      utils.query.courseflavorRange( userFlavorPrefs[i])

      + "&allowedCourse[]=" + lib.course.[coursesForQuery[i]] + "&requirePictures=true" +
      "&maxResult=" + numBreakfasts + "&start=" + start;
    courseStrings.push(courseString);
  }

  return {
    "breakfastRecipes": courseStrings[0]
  }

};

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

var getToYummlyById = function(recipeId){
  return new Promise(function(resolve, reject){
    var str = "";
    var recipe;

    var query = "http://api.yummly.com/v1/api/recipe/" + recipeId +
    "?_app_id=" + appId + "&_app_key=" + apiKey;

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

//fetch recipe from database first or from yummly if not found
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

  createRecipes: function (queryModel, userCourseFlavorPreferences) {

    return new Promise(function(resolve, reject){

      var queries = writeQueries(queryModel, userCourseFlavorPreferences);

      //if course has 0 meals, that query will result in empty string

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
        resolve({
          'breakfastRecipes': breakfasts,
          'lunchRecipes': lunches,
          'dinnerRecipes': dinners
        });

      })
      .catch(function(error){
        reject({'error': error});
      });

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
  },
  createIngredientsList: function (request, response) {
    if (!request.body.mealPlanId) {
      response.status(404).send({error: "Meal plan not found!"});
    }
    var mealPlanId = request.body.mealPlanId;

    new MealPlan({id: mealPlanId}).fetch({withRelated: 'recipes'}).then(function(model){
      var ingredients = [];
      model.related('recipes').forEach(function(item){
        var recipeIngredients = item.get('ingredients');
        recipeIngredients = recipeIngredients.split('|');
        console.log('recipe ingredients after split', recipeIngredients);
        ingredients = ingredients.concat(recipeIngredients);
      });
      response.status(200).send(ingredients);
    })
    .catch(function(error) {
      response.status(404).send({error: "Meal plan not found!"});
    });
  }
};

