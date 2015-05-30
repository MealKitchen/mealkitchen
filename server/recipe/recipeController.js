var appId = process.env.APPLICATION_ID || require('../config/config.js').APPLICATION_ID;
var apiKey = process.env.APPLICATION_KEY || require('../config/config.js').APPLICATION_KEY;
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
    "http://api.yummly.com/v1/api/recipes?_app_id=" + appId +
    "&_app_key=" + apiKey +
    queryString + "&allowedCourse[]=course^course-Main Dishes" + "&requirePictures=true" +
    "&maxResult=" + numResults + "&start=" + start;

  http.get(query, function(yummlyResponse){
    var str = '';
    //console.log('Response is '+yummlyResponse.statusCode);
    yummlyResponse.on('data', function (chunk) {
      str += chunk;
    });

    yummlyResponse.on('end', function () {

      results = JSON.parse(str);
      //check acceptability of recipe before saving

      for(var i = 0; i < results.matches.length; i++){
        //had to make a call to a function to retain recipe info #async
        console.log(results.matches[i]);
        saveRecipe(results.matches[i]);
      }
      response.status(200).send(results);
    });
  });
};


var saveRecipe = function(recipe){
  new Recipe({'id': recipe.id}).fetch().then(function(found){
    if(!found){
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
        console.log('saved recipe: ', recipe);
      }).catch(function(error) {
        console.log('got error', error);
      });
    }
  });
};

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
