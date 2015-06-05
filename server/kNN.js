var Promise = require('bluebird');

/*
  user preference data now looks like
  {
    userId:
    recipeId:
    preference:
    salty:
    sour:
    sweet:
    bitter:
    meaty:
    piquant:
  }
 */
var kNN = function(matches, userPreferences, callback){

  for (var i = 0; i < matches.length; i++) {
    var yummlyMatch = matches[i];
    var likelihood = 0;
    for (var j = 0; j < userPreferences.length; j++) {
      var sumOfSquares = 0;

      var userPreference = userPreferences[j];
      for (var key in yummlyMatch.flavors) {
        
        //recipe does not have flavor profile
        if (userPreference[key] === null || userPreference[key] === undefined){
          break;
        }
        var base = yummlyMatch.flavors[key] - userPreference[key];
        sumOfSquares += Math.pow(base, 2);
      }
      var distance = Math.sqrt(sumOfSquares);

      //if distance === 0 don't use distance as weighting factor
      likelihood += distance === 0 ? 0:(1 / distance) * userPreference.preference;
    }
    yummlyMatch.likelihood = likelihood;
  }
  matches.sort(function (a, b) {
    if (a.likelihood > b.likelihood) {
      return -1;
    }
    if (a.likelihood < b.likelihood) {
      return 1;
    }
    // a must be equal to b
    return 0;
  });

  callback(matches);
}  

module.exports = {
  runMachine: function (matches, userPreferences) {
    
    return new Promise(function(resolve, reject){
      //if user has preferences then run knn
      if(userPreferences.length){  
        kNN( matches, userPreferences, function(results){
          resolve(results);
        });
        
      } 
      //otherwise return matches in regular order (maybe randomized in someway(?))
      else{

        resolve(matches)
      }     
    })
  }
}
