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

exports.createSession = function(req, res, newUser) {
  return req.session.regenerate(function() {
      req.session.user = newUser;
      // res.redirect('/');
      res.status(200).send(newUser);
    });
};

exports.isLoggedIn = function(req) {
  return req.session ? !!req.session.user : false;
};

exports.checkUser = function(req, res, next) {
  // console.log("checking user", req.session);
  if (!exports.isLoggedIn(req)){
    res.status(401).send({loggedIn: false});
  } else {
    next();
  }
};

exports.sendLoggedInStatus = function(req, res) {
  res.status(200).send({loggedIn: true});
};

exports.logout = function(req, res) {
  req.session.destroy(function(){
      res.status(200).send({loggedIn: false});
    });
};

//takes an array of recipe matches from yummly
//returns an array of recipe ids, necessary for relational bookshelf association
exports.parseRecipeIds = function(recipes){
  var recipeIds = [];
  for (var i = 0; i < recipes.length; i++) {
    recipeIds.push(recipes[i].id);
  }
  return recipeIds;
}

//returns a single array of recipe ids
exports.getObjectRecipeIds = function(obj){
  var results = [];
  for(var key in obj){
    //if file changes be mindful of this dependency on parseRecipeIds
    var temp = exports.parseRecipeIds(obj[key]);
    results = results.concat(temp);
  }
  return results
}


//check if results from yummly are valid
exports.resultsLengthValid = function(expected, recieved){
  for(var i = 0; i < 3; i++){
    if(recieved[i] !== expected[i])
      return false;
  }
  return true;
}

//Yummly API Queries
exports.query = {

  //gets initial recipes for potential 3 course mealPlan
  createInitialCourseQueries: function(queryModel, userFlavorPrefs){

    var numCourseMeals = [
      queryModel.numBreakfasts*1 && queryModel.numBreakfasts*1 + 10,
      queryModel.numLunches*1 && queryModel.numLunches*1 + 10,
      queryModel.numDinners*1 && queryModel.numDinners*1 + 10
    ];

    var coursesForQuery = [
      'Breakfast',
      'Lunch',
      'Dinner'
    ];

    var filterQueryString = exports.query.filterForCourses(queryModel);
    var courseStrings = [];
    var courseQueryString;

    //iterates through and creates 3 queries
    //0 -> Breakfast
    //1 -> Lunch
    //2 -> Dinner
    for(var i = 0; i < coursesForQuery.length; i++){

      if(numCourseMeals[i]){
        //course has meals
        courseQueryString =

          exports.query.yummlySearchValidation() +

          filterQueryString +

          exports.query.courseFlavorRange( userFlavorPrefs[i]) +

          "&allowedCourse[]=" + lib.course[coursesForQuery[i]] + "&requirePictures=true" +

          "&maxResult=" + numCourseMeals[i] + "&start=" + 0;
      }
      else
        courseQueryString = "";

      courseStrings.push(courseQueryString);
    }

    console.log('BFAST', courseStrings[0], 'LUNCH', courseStrings[1], 'DINNER', courseStrings[2]);

    return {
      "breakfastQuery": courseStrings[0],
      "lunchQuery": courseStrings[1],
      "dinnerQuery": courseStrings[2]
    }

  },
  createRefillCourseQuery: function(queryModel, course, userFlavorPrefs, numMeals, offset){

    var filterQueryString = exports.query.filterForCourses(queryModel);

    var courseQueryString =

      exports.query.yummlySearchValidation() +

      filterQueryString +

      exports.query.courseFlavorRange(userFlavorPrefs) +

      "&allowedCourse[]=" + lib.course[course] + "&requirePictures=true" +

      "&maxResult=" + numMeals + "&start=" + offset;

    return courseQueryString;

  },
  //creates filter query from query Model
  //allergy, diet, cuisine settings
  filterForCourses: function(queryModel){

      //if value is present
    var allergyQuery =  queryModel.allowedAllergies ?
                          exports.query.filterValue( queryModel.allowedAllergies, 'Allergy' )
                          : "";

    var dietQuery = queryModel.allowedCuisines ?
                          exports.query.filterValue( queryModel.allowedCuisines, 'Cuisine' )
                          : "";
    var cuisineQuery = queryModel.allowedDiet  ?
                          exports.query.filterValue( queryModel.allowedDiet, 'Diet' )
                          : "";

    return allergyQuery + dietQuery + cuisineQuery;
  },

  //start of yummly search Query
  yummlySearchValidation: function(){
    return "http://api.yummly.com/v1/api/recipes?_app_id=" + appId +
    "&_app_key=" + apiKey;
  },

  //get query for individual recipes
  yummlyGetById: function(recipeId){
    return  "http://api.yummly.com/v1/api/recipe/" + recipeId +
    "?_app_id=" + appId + "&_app_key=" + apiKey;
  },

  //compute query flavor range
  courseFlavorRange: function(range){
    var queryStr = '', profile = ['salty', 'sour', 'sweet', 'bitter', 'meaty', 'piquant'];

    for(var flavor = 0; flavor < profile.length; flavor++){
        queryStr += '&flavor.' + profile[flavor] +'.min=' + range[profile[flavor]][0] + '&flavor.'
          + profile[flavor] + '.max=' + range[profile[flavor]][1];
    }

    return queryStr;
  },
  //figure out filter query
  filterValue: function(allowedValueList, filterValue){
    var filterQueryString = '';
    var baseUnit = '&allowed' + filterValue + '%5B%5D=';
    var libraryName = 'allowed' + filterValue + 'Library';
    var keys = Object.keys(allowedValueList)

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if(allowedValueList[key]){
        filterQueryString += baseUnit + lib[libraryName][key];
        if(i < keys.length - 1){
          filterQueryString += '&';
        }
      }
    }

    return keys.length > 0 ? filterQueryString : '';
  }

}

