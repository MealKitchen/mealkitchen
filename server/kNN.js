var Promise = require('bluebird');

var kNN = function(matches, userPreferences){

  return new Promise(function(resolve, reject) {
    for (var i = 0; i < matches.length; i++) {
      var yummlyMatch = matches[i];
      var likelihood = 0;
      for (var j = 0; j < userPreferences.length; j++) {
        var sumOfSquares = 0;

        var userPreference = userPreferences[j];
        for (var key in yummlyMatch.flavors) {
          
          // if userPreference recipe does not have flavor profile
          if (userPreference.attributes[key] === null || userPreference.attributes[key] === undefined){
            break;
          }
          var base = yummlyMatch.flavors[key] - userPreference.attributes[key];
          sumOfSquares += Math.pow(base, 2);
        }
        var distance = Math.sqrt(sumOfSquares);
        // if distance === 0, do not factor that recipe into likelihood calculation
        likelihood += distance === 0 ? 0 : (1 / distance) * userPreference.attributes.preference;
      }
      yummlyMatch.likelihood = likelihood;

    }
    matches.sort(function (a, b) {
      if (a.likelihood > b.likelihood) {
        return 1;
      }
      if (a.likelihood < b.likelihood) {
        return -1;
      }
      // if a === b, leave in place
      return 0;
    });
    resolve(matches);    
  })
}  

module.exports = {
  runMachine: function (matches, preferences) {
    
    var breakfastMatches = matches.breakfastRecipes;
    var lunchMatches = matches.lunchRecipes;
    var dinnerMatches = matches.dinnerRecipes;

    var breakfastPrefs = [];
    var lunchPrefs = [];
    var dinnerPrefs = [];

    for (var i = 0; i < preferences.length; i++) {
      var course = preferences[i].attributes.course;
      if (course === "breakfast" || course === "Breakfast and Brunch") {
        breakfastPrefs.push(preferences[i]);
      } else if (course === "lunch" || course === "Lunch and Snacks") {
        lunchPrefs.push(preferences[i]);
      } else if (course === "dinner" || course === "Main Dishes") {
        dinnerPrefs.push(preferences[i]);
      }
    }

    return new Promise(function(resolve, reject){
      //if user has preferences then run knn
      if(preferences.length){ 
        Promise.all([
          kNN(breakfastMatches, breakfastPrefs),
          kNN(lunchMatches, lunchPrefs),
          kNN(dinnerMatches, dinnerPrefs)
           ])
        .then(function(results) {

          var matches = {
            "breakfastRecipes": results[0],
            "lunchRecipes": results[1],
            "dinnerRecipes": results[2]
          };
          resolve(matches);
        })
      } 
      //otherwise return matches in regular order
      else {
        resolve(matches);
      }     
    })
  }
}
