var bodyParser = require('body-parser');
var recipeController = require('../recipe/recipeController.js');
var userController = require('../user/userController.js');

module.exports = function(app, express) {

  app.use(bodyParser.json());

  app.use(express.static(__dirname + '/../../client'));

  // 'api/recipes' routing
  app.post('/api/recipes/makeplan', recipeController.makePlan);
  app.post('/api/recipes/getingredients', recipeController.getIngredients);

  // 'api/users' routing
  app.post('/api/users/signup', userController.signUp);
  app.post('/api/users/signin', userController.signIn);

  console.log("middleware.js");
};
