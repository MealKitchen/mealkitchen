var appCodes = require('../config/config.js');
var http = require('http');

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
  var numResults = request.body.numMeals * 4;
  var queryString = "";
  var results = {};
  var start = request.body.start || 0;
  // add each allowed allergy to query string
  for (var key in allowedAllergyList) {
    if (allowedAllergyList[key]) {
      queryString += "&allowedAllergy[]" + allowedAllergyLibrary[key];
    }
  }
  //var query = "&allowedCuisine[]" + allowedCuisineLibrary[allowedCuisine] + "&allowedAllergy[]" + allowedAllergyLibrary[allowedAllergy] +"&requirePictures=true";
  var yummlyQuery =
    "http://api.yummly.com/v1/api/recipes?_app_id=" + appCodes.APPLICATION_ID +
    "&_app_key=" + appCodes.APPLICATION_KEY +
    queryString + "&requirePictures=true" +
    "&maxResult=" + numResults + "&start=" + start;

  http.get(yummlyQuery, function(yummlyResponse){
    var str = '';
    console.log('Response is '+yummlyResponse.statusCode);
    yummlyResponse.on('data', function (chunk) {
      str += chunk;
    });

    yummlyResponse.on('end', function () {
      results = JSON.parse(str);
      response.status(200).send(results);
    });
  });
};

module.exports = {
  createRecipes: function (request, response) {
    queryYummly(request, response);
  },

  makeIngredientsList: function (request, response) {
    response.sendStatus(200);
  }
};
