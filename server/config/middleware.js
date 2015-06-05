var bodyParser = require('body-parser');
var session = require('express-session');
var utils = require('./utility');
var recipeController = require('../recipe/recipeController.js');
var mealPlanController = require('../mealPlan/mealPlanController.js');
var userController = require('../user/userController.js');
var recipePreferenceController = require('../recipePreference/recipePreferenceController');
var appController = require('../app/appController');

module.exports = function(app, express) {

  app.use(bodyParser.json());

  app.use(express.static(__dirname + '/../../client'));

  app.use(session({
    secret: 'pizza boat with anchovies',
    resave: false,
    saveUninitialized: true
  }));

  // 'api/recipes' routing
  app.post('/api/recipes', utils.checkUser, appController.getUserRecipes);
  app.get('/api/recipes', utils.checkUser, recipeController.getYummlyRecipe);
  app.post('/api/recipes/ingredients', recipeController.createIngredientsList);
  
  // 'api/mealplan' routing
  app.post('/api/mealplan', utils.checkUser, appController.saveUserMealPlan);
  app.get('/api/mealplan', utils.checkUser, appController.getUserMealPlans);

  // 'api/preferences' routing
  app.post('/api/recipePreferences', recipePreferenceController.updatePreferences);
  app.put('/api/recipePreferences', recipePreferenceController.updatePreferences);

  // 'api/users' routing
  app.get('/api/user', utils.checkUser, utils.sendLoggedInStatus);
  app.post('/api/user', userController.routeUser);

  app.get('/api/logout', utils.logout);
  
  // app.post('/api/users/signup', userController.signUp);
  // app.post('/api/users/signin', userController.signIn);
};
