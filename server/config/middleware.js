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


  /**** 'api/users' routing ****/
  //check if logged in
  router.get('/users/:id', utils.checkUser, utils.sendLoggedInStatus);
  //log in
  router.post('/users/login', appController.login);
  //sign up
  router.post('/users', appController.signup);

  // 'api/recipes' routing
  router.post('/queries', appController.getUserRecipes);
  router.put('/queries', appController.refillCourseQueue);

  router.post('/mealplans/:id/shoppinglist', appController.createShoppingList);

  // 'api/mealplan' routing
  router.post('/users/:id/mealplans', utils.checkUser, appController.saveUserMealPlan);
  router.get('/users/:id/mealplans', utils.checkUser, appController.getUserMealPlans);

  //router.get('/users/:id/mealplans/:id' )
  // 'api/preferences' routing
  router.post('/users/:id/preferences', recipePreferenceController.updatePreferences);
  router.put('/users/:id/preferences', recipePreferenceController.updatePreferences);


  router.get('/logout', utils.logout);

  app.use('/api', router);
};
