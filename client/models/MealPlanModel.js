var MealPlanModel = Backbone.Model.extend({

  initialize: function(user){
    this.url = 'api/users/' + user.userId + '/mealplans';
  },

});
