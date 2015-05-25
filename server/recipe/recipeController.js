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
  console.log("request.body:", request.body);

  //var allowedCuisine = request.body.allowedCuisine;
  var allowedAllergyList = request.body.allowedAllergy;
  var queryString = "";
  for (var key in allowedAllergyList) {
    if (allowedAllergyList[key]) {
      queryString += "&allowedAllergy[]" + allowedAllergyLibrary[key];
    }
  }

  //var query = "&allowedCuisine[]" + allowedCuisineLibrary[allowedCuisine] + "&allowedAllergy[]" + allowedAllergyLibrary[allowedAllergy] +"&requirePictures=true";
  var query = queryString +"&requirePictures=true";

  console.log("query:", query);

};

module.exports = {
  makePlan: function (request, response) {
    queryYummly(request, response);

    response.sendStatus(200);
  },
  

  getIngredients: function (request, response) {
    response.sendStatus(200);
  }
};
