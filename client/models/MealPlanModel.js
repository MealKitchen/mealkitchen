var MealPlanModel = Backbone.Model.extend({

  initialize: function(userId){
    this.url = 'api/users/' + userId + '/mealplans';
  },

});
