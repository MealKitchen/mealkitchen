var IngredientModel = Backbone.Model.extend({

  initialize: function(mealplan){
    this.url = '/mealplans/' + mealplan.id + '/ingredients'
  },

});
