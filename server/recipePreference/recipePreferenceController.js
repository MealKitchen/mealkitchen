var Promise = require('bluebird');
var http = require('http');
var RecipePreference = require('./recipePreferenceModel');
var Recipe = require('../recipe/recipeModel');



var createUserCourseFlavorProfile = function(preferences) {

  return new Promise(function(resolve, reject) {

    var saltyTotal = 0;
    var sourTotal = 0;
    var sweetTotal = 0;
    var bitterTotal = 0;
    var meatyTotal = 0;
    var piquantTotal = 0;
    var counter = 0;

    for (var i = 0; i < preferences.length; i++){
      var preferenceAttr = preferences[i].attributes;
      if (preferenceAttr.salty && preferenceAttr.sour && preferenceAttr.sweet && preferenceAttr.bitter && preferenceAttr.meaty && preferenceAttr.piquant) {

        saltyTotal += preferenceAttr.salty;
        sourTotal += preferenceAttr.sour;
        sweetTotal += preferenceAttr.sweet;
        bitterTotal += preferenceAttr.bitter;
        meatyTotal += preferenceAttr.meaty;
        piquantTotal += preferenceAttr.piquant;
        counter++;
      }
    }

    var saltyAvg = saltyTotal / counter;
    var sourAvg = sourTotal / counter;
    var sweetAvg = sweetTotal / counter;
    var bitterAvg = bitterTotal / counter;
    var meatyAvg = meatyTotal / counter;
    var piquantAvg = piquantTotal / counter;

    var TOLERANCE = 0.45;

    userFlavorPrefs = {
      "salty": [(saltyAvg - TOLERANCE) > 0 ? saltyAvg - TOLERANCE : 0, (saltyAvg + TOLERANCE) < 1 ? saltyAvg + TOLERANCE : 1],
      "sour": [(sourAvg - TOLERANCE) > 0 ? sourAvg - TOLERANCE : 0, (sourAvg + TOLERANCE) < 1 ? sourAvg + TOLERANCE : 1],
      "sweet": [(sweetAvg - TOLERANCE) > 0 ? sweetAvg - TOLERANCE : 0, (sweetAvg + TOLERANCE) < 1 ? sweetAvg + TOLERANCE : 1],
      "bitter": [(bitterAvg - TOLERANCE) > 0 ? bitterAvg - TOLERANCE : 0, (bitterAvg + TOLERANCE) < 1 ? bitterAvg + TOLERANCE : 1],
      "meaty": [(meatyAvg - TOLERANCE) > 0 ? meatyAvg - TOLERANCE : 0, (meatyAvg + TOLERANCE) < 1 ? meatyAvg + TOLERANCE : 1],
      "piquant": [(piquantAvg - TOLERANCE) > 0 ? piquantAvg - TOLERANCE : 0, (piquantAvg + TOLERANCE) < 1 ? piquantAvg + 0.15 : 1]
    };

    resolve(userFlavorPrefs);
  })

};

module.exports = {

  savePreference: function(request){
    var preference = request.body;

    switch(preference.course){
      case  "Breakfast and Brunch":
        preference.course = 'breakfast';
        break;
      case  "Lunch and Snacks":
        preference.course = 'lunch';
        break;
      case  "Main Dishes":
        preference.course = 'dinner';
        break;
      default:
        break;
    }

    new RecipePreference({
      'userId': preference.userId,
      'preference': preference.preference,
      'salty': preference.salty,
      'sour': preference.sour,
      'sweet': preference.sweet,
      'bitter': preference.bitter,
      'meaty': preference.meaty,
      'piquant': preference.piquant,
      'course': preference.course
    }).save().then(function(recipePreference){
      console.log('Saved recipe Preference to db');
    }).catch(function(err){
      console.error('error saving recipe preference: ', err);
    });
  },

  updatePreferences: function (request, response) {
    // update recipe like/dislike table in db
    module.exports.savePreference(request);
    response.status(200).send(request.body);
  },

  getUserPreferences: function (userId) {

    return new Promise(function(resolve, reject){

      RecipePreference.where({'userId': userId})
      .fetchAll().then(function(preferences){
        if(preferences){
          resolve(preferences.models);
        }
        else{
          resolve([]);
        }
      });
    });
  },

  userFlavorProfileFromPreferences: function (preferences) {

    return new Promise(function(resolve, reject) {
      var userFlavorPrefs = {};

      var breakfastPrefs = [];
      var lunchPrefs = [];
      var dinnerPrefs = [];

      for (var i = 0; i < preferences.length; i++) {
        var course = preferences[i].attributes.course;
        switch(course){
          case "breakfast":
            breakfastPrefs.push(preferences[i]);
            break;
          case "lunch":
            lunchPrefs.push(preferences[i]);
            break;
          case "dinner":
            dinnerPrefs.push(preferences[i]);
        }
      }

      Promise.all([
        createUserCourseFlavorProfile(breakfastPrefs),
        createUserCourseFlavorProfile(lunchPrefs),
        createUserCourseFlavorProfile(dinnerPrefs)
      ])
      .then(function(userMealFlavorProfile) {
        resolve(userMealFlavorProfile);
      })
    });
  }
};
