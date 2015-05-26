var appCodes = require('../config/config.js');
var http = require('http');
var Recipe = require('./recipeModel');

var allowedAllergyLibrary = {
  "Egg-Free": "397^Egg-Free",
  "Gluten-Free": "393^Gluten-Free",
  "Peanut-Free": "394^Peanut-Free",
  "Seafood-Free": "398^Seafood-Free",
  "Sesame-Free": "399^Sesame-Free",
  "Soy-Free": "400^Soy-Free",
  "Sulfite-Free": "401^Sulfite-Free",
  "Tree Nut-Free": "395^Tree Nut-Free",
  "Wheat-Free": "392^Wheat-Free"
};

var allowedCuisineLibrary = {
  "American": "cuisine^cuisine-american",
  "Italian": "cuisine^cuisine-italian",
  "Asian": "cuisine^cuisine-asian",
  "Mexican": "cuisine^cuisine-mexican",
  "Southern & Soul Food": "cuisine^cuisine-southern",
  "French": "cuisine^cuisine-french",
  "Indian": "cuisine^cuisine-indian",
  "Thai": "cuisine^cuisine-thai",
  "Japanese": "cuisine^cuisine-japanese",
  "Hawaiian": "cuisine^cuisine-hawaiian",
  "Swedish": "cuisine^cuisine-swedish",
};

var queryYummly = function (request, response) {
  //var allowedCuisine = request.body.allowedCuisine;
  var allowedAllergyList = request.body.allowedAllergy;
  var numResults = request.body.rejectedRecipeId ? 1 : request.body.numMeals;
  var start = request.body.rejectedRecipeId ? request.body.totalRecipesRequested : 0;
  var queryString = "";
  var results = {};
  // add each allowed allergy to query string
  for (var key in allowedAllergyList) {
    if (allowedAllergyList[key]) {
      queryString += "&allowedAllergy[]" + allowedAllergyLibrary[key];
    }
  }
  //var query = "&allowedCuisine[]" + allowedCuisineLibrary[allowedCuisine] + "&allowedAllergy[]" + allowedAllergyLibrary[allowedAllergy] +"&requirePictures=true";
  var query =
    "http://api.yummly.com/v1/api/recipes?_app_id=" + appCodes.APPLICATION_ID +
    "&_app_key=" + appCodes.APPLICATION_KEY +
    queryString + "&allowedCourse[]=course^course-Main Dishes" + "&requirePictures=true" +
    "&maxResult=" + numResults + "&start=" + start;

  http.get(query, function(yummlyResponse){
    var str = '';
    console.log('Response is '+yummlyResponse.statusCode);
    yummlyResponse.on('data', function (chunk) {
      str += chunk;
    });

    yummlyResponse.on('end', function () {
      console.log('here are recipes');
      results = JSON.parse(str);
      saveRecipeMatches(results);
      response.status(200).send(results);
    });
  });
};

var saveRecipeMatches = function(results){
  var matches = results.matches;
  for(var i = 0; i < matches.length; i++){
    var recipe = matches[i];
    console.log(recipe);
    new Recipe({'yumId': recipe.id}).fetch().then(function(found){
      if(!found){
        var newRecipe = new Recipe({
          
        })
      }
    })
  }
};

var saveRecipe = function(recipe){

}
module.exports = {
  createRecipes: function (request, response) {
    queryYummly(request, response);
  }
};

var requestFormat = {
  "numMeals": 3,
  "allowedAllergy": {
    "Egg-Free": false,
    "Gluten-Free": false,
    "Peanut-Free": true,
    "Seafood-Free": false,
    "Sesame-Free": false,
    "Soy-Free": false,
    "Sulfite-Free": false,
    "Tree Nut-Free": true,
    "Wheat-Free": false
  },
  "rejectedRecipeId": "902942",
  "totalRecipesRequested": 5
};
