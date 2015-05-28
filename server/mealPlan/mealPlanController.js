module.exports = {
  createMealPlan: function (request, response) {
    response.status(200).send(request.body);
  },
};
