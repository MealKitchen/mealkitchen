var MealPlansCollection = Backbone.Collection.extend({

  url: function(){
    return 'api/mealplans/users/' + this.get('username');
  },

  model: MealPlanModel

});
