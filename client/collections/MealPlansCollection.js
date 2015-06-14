var MealPlansCollection = Backbone.Collection.extend({

  initialize: function(user){
    this.url = 'api/users/' + user.id + '/mealplans';
  },

  model: MealPlanModel

});
