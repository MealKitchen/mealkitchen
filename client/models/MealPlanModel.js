var MealPlanModel = Backbone.Model.extend({

  initialize: function(){
    this.url = 'api/users/' + this.userId + '/mealplans';
  },

});
