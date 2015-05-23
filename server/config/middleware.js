var bodyParser = require('body-parser');
var recipeController = require('../recipe/recipeController.js');
var userController = require('../user/userController.js');

module.exports = function(app, express) {

  app.use(bodyParser.json());

  // '/' routing
  app.get('/', function(request, response) {
    response.send("Received GET request to homepage");
  });

  // 'api/recipes' routing
  app.post('/api/recipes/makeplan', recipeController.makePlan);
  app.post('/api/recipes/getplan', recipeController.getPlan);

  // 'api/users' routing
  app.post('/api/users/signup', userController.signUp);
  app.post('/api/users/signin', userController.signIn);

  console.log("middleware.js");
};