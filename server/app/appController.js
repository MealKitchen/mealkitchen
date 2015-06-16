var Promise = require('bluebird');
var recipePreferenceController = require('../recipePreference/recipePreferenceController');
var recipeController = require('../recipe/recipeController');
var mealPlanController = require('../mealPlan/mealPlanController');
var userController = require('../user/userController');
var kNN = require('../kNN');
var utils = require('../config/utility');

module.exports = {
  getUserRecipes: function(req, res){

    //retrieve user preferences
    recipePreferenceController.getUserPreferences(req.session.user.id)
    .then(function(userPreferences){

      //get user flavor profile from user preferences
      recipePreferenceController.userFlavorProfileFromPreferences(userPreferences)
      .then(function(userCourseFlavorProfile){

        //create recipes for our user
        recipeController.createRecipes(req.body, userCourseFlavorProfile)
        .then(function(courseMatches){
          //run k nearest neighbor sorting algorithm
          kNN.runMachine(courseMatches, userPreferences).then(function(results){
            res.status(200).send(results);
          })
          .catch(function(error){
            console.error({'error in createRecipes': error});
            res.status(error.status || 500).send({'error in knn': error});
          })
        })
        .catch(function(error){
          console.error({'error in createRecipes': error});
          res.status(error.status || 500).send({'error in createRecipes': error});
        })
      })
      .catch(function(error){
        console.error({'error in createRecipes': error});
        res.status(error.status || 500).send({'error getting userFlavor Profile': error});
      })
    })
    .catch(function(error){
      console.error({'error in createRecipes': error});
      res.status(error.status || 500).send({'error getting userPreferences': error});
    })

  },

  getUserMealPlans: function(req, res){
    mealPlanController.fetchMealPlans(req.session.user.id)
      .then(function(mealPlans){

        res.status(200).send(mealPlans);
      })
      .catch(function(error){
        res.status(500).send(error);
      })
  },
  saveUserMealPlan: function(req, res){
    var recipesPrefs = mealPlanController.saveMealPlanRecipePreferences(req);

    for (var i = 0; i < recipesPrefs.length; i++) {
      recipePreferenceController.savePreference(recipesPrefs[i]);
    }

    recipeController.getMealPlanRecipes(req.body)
    .then(function(recipesFromYummly){

      Promise.all([
        recipeController.saveRecipeArray(recipesFromYummly.breakfast, 'breakfast'),
        recipeController.saveRecipeArray(recipesFromYummly.lunch, 'lunch'),
        recipeController.saveRecipeArray(recipesFromYummly.dinner, 'dinner')
      ])
      .then(function(){

        mealPlanController.createMealPlan(req.session.user.id, req.body.title, utils.getObjectRecipeIds(recipesFromYummly))
        .then(function(mealPlanId){
          req.body.id = mealPlanId;
          res.status(200).send(req.body);
        })
        .catch(function(error){
          res.status(500).send({'error saving mealplan': error});
        })

      })
      .catch(function(error){
        res.status(500).send({'error saving recipes from yummly': error});
      })
    })
    .catch(function(error){
      res.status(500).send({'error saving user meal plan': error});
    })
  },
  refillCourseQueue: function(req, res){

    recipePreferenceController.getUserPreferences(req.session.user.id)
    .then(function(userPreferences){

      //get user flavor profile from user preferences
      recipePreferenceController.userFlavorProfileFromPreferences(userPreferences)
      .then(function(userCourseFlavorProfile){

        recipeController.courseRefillQuery(req.body, userCourseFlavorProfile)
        .spread(function(matches, returnKey){
          req.body[returnKey] = matches;
          res.status(200).send(req.body);
        })
        .catch(function(error){
          res.status(500).send({'error getting refill recipes': error});
        })
      })
    })
  },
  login: function(req, res){

    userController.login(req.body.username, req.body.password)
    .then(function(user){
      //create user session
      utils.createSession(user, req)
      .then(function(){

        res.status(200).send(user);
      })
      .catch(function(error){
        rest.status(500).send({'error creating session': error})
      })

    })
    .catch(function(error){
      res.status(error.status || 500).send({'login error': error});
    })
  },
  signup: function(req, res){

    //create new user
    userController.signup(req.body.username, req.body.password)
    .then(function(user){
      //create session for user
      utils.createSession(user, req)
      .then(function(){

        res.status(200).send(user);
      })
      .catch(function(error){
        res.status(500).send({'error creating session': error})
      })
    })
    .catch(function(error){
      res.status(error.status || 500).send({'signup error': error});
    })
  },

  createShoppingList: function(req, res){
    console.log('creating shopping list', req.params.id);
    mealPlanController.fetchMealPlanIngredients(req.params.id)
    .then(function(mealPlanShoppingList){
      res.status(200).send(mealPlanShoppingList);
    })
    .catch(function(error){
      res.status(error.status || 500).send({'error creating shoppingList': error})
    })
  }
};

