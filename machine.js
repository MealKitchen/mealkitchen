//Cajun-Caesar-Grilled-Chicken-1142401
var recipe1 = [
  { id: 'Cajun-Caesar-Grilled-Chicken-1142401' },
  {
    piquant: 0.16666666666666666,
    meaty: 0.3333333333333333,
    bitter: 0.16666666666666666,
    sweet: 0.5,
    sour: 0.6666666666666666,
    salty: 0.16666666666666666
  }
];

//Grilled-Guava-Shrimp-1162799
var recipe2 = [
  { id: 'Grilled-Guava-Shrimp-1162799' },
  {
    piquant: 0,
    meaty: 0.6666666666666666,
    bitter: 0.16666666666666666,
    sweet: 0.6666666666666666,
    sour: 0.16666666666666666,
    salty: 0.8333333333333334
  }
];

//Garlic-Shrimp-1135772
var recipe3 = [
  { id: 'Garlic-Shrimp-1135772' },
  {
    piquant: 0.16666666666666666,
    meaty: 0.8333333333333334,
    bitter: 0.16666666666666666,
    sweet: 0,
    sour: 0.6666666666666666,
    salty: 0.16666666666666666
  }
];



// Open questions
// - How are we going to input data into the algorithm? We likely need id and flavor profile for each recipe, and will need to construct the data properly

// for a given new recipe, predict user's preference (on a scale of 0 to 1) 
  // tolerance is a value between 0 and 1 that delineates the sphere of recipes in which to begin calculating Euclidean distance
var predictPreference = function (newRecipe, tolerance) {
  // create array to store id, distance, and outcome (0 or 1) of each recipe
  var outcomeRecipes = [];
  // create variable to identify k
  var k = 10;
  // conduct database search for all recipes with taste properties of +- tolerance
  var sphereRecipes = findSphere(newRecipe, tolerance);
  // calculate Euclidean distance for all recipes in sphere
  for (var i = 0; i < sphereRecipes.length; i++) {
    outcomeRecipes.push({
      id: sphereRecipes[i]['id'],
      distance: euclideanDistance(newRecipe, sphereRecipes[i]),
      outcome: 0 || 1 // lookup recipe by id in recipeUser table and identify outcome
    });
  }
  // TO-DO: sort recipe objects in outcomeRecipes array by distance, and select k closest

  // calculate preference (on a scale of 0 to 1)
  var newRecipePreference = 0;
  for (var j = 0; j < k; j++) {
    newRecipePreference += (1 / outcomeRecipes['distance'])*(outcomeRecipes['outcome']);
  }

};

// Identify recipes in sphere

var findSphere = function (newRecipe, tolerance) {


};


// Euclidean distance calculation

var euclideanDistance = function (flavors1, flavors2) {
  var sumOfSquares = 0;
  for (var key in flavors1[1]) {
    var base = (flavors1[1][key] - flavors2[1][key]);
    sumOfSquares += Math.pow(base, 2);
  }
  var distance = Math.sqrt(sumOfSquares);
  return distance;
};

// 


