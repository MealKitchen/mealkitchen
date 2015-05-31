var bodyParser = require('body-parser');
var recipeController = require('../recipe/recipeController.js');
var mealPlanController = require('../mealPlan/mealPlanController.js');
var userController = require('../user/userController.js');
var recipePreferenceController = require('../recipePreference/recipePreferenceController');

module.exports = function(app, express) {

  app.use(bodyParser.json());

  app.use(express.static(__dirname + '/../../client'));

  // 'api/recipes' routing
  app.post('/api/recipes', recipeController.createRecipes);
  
  // 'api/mealplan' routing
  app.post('/api/mealplan', mealPlanController.createMealPlan);
  app.get('/api/mealplan', mealPlanController.fetchMealPlans);

  // 'api/preferences' routing
  app.post('/api/recipePreferences', recipePreferenceController.updatePreferences);

  // 'api/users' routing
  app.post('/api/user', userController.routeUser);
  // app.post('/api/users/signup', userController.signUp);
  // app.post('/api/users/signin', userController.signIn);
};

