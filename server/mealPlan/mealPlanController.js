module.exports = {
  createMealPlan: function (request, response) {
    console.log("request.body.recipes: ", request.body.recipes);
    response.status(200).send(request.body.recipes);
  },
};