var bodyParser = require('body-parser');
var session = require('express-session');
var utils = require('./utility');
var recipeController = require('../recipe/recipeController.js');
var mealPlanController = require('../mealPlan/mealPlanController.js');
var userController = require('../user/userController.js');
var recipePreferenceController = require('../recipePreference/recipePreferenceController');
var appController = require('../app/appController');

module.exports = function(app, express) {

  var router = express.Router();

  app.use(bodyParser.json());

  app.use(express.static(__dirname + '/../../client'));

  app.use(session({
    secret: 'pizza boat with anchovies',
    resave: false,
    saveUninitialized: true
  }));


  // 'api/users' routing
  router.get('/api/users', utils.checkUser, utils.sendLoggedInStatus);
  router.get('/api/users/:id', appController.login)
  router.post('/api/users', appController.signup);

  // 'api/recipes' routing
  router.post('/api/recipes', appController.getUserRecipes);
  router.put('/api/recipes', appController.refillCourseQueue);
  //router.get('/api/recipes', utils.checkUser, recipeController.getYummlyRecipe);
  router.post('/api/recipes/ingredients', recipeController.createIngredientsList);
  // 'api/mealplan' routing
  router.post('/api/mealplan', utils.checkUser, appController.saveUserMealPlan);
  router.get('/api/mealplan', utils.checkUser, appController.getUserMealPlans);

  // 'api/preferences' routing
  router.post('/api/recipePreferences', recipePreferenceController.updatePreferences);
  router.put('/api/recipePreferences', recipePreferenceController.updatePreferences);


  router.get('/api/logout', utils.logout);
  // app.post('/api/users/signup', userController.signUp);
  // app.post('/api/users/signin', userController.signIn);
};
