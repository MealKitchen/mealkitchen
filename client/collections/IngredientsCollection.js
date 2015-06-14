var IngredientsCollection = Backbone.Collection.extend({

  initialize: function(mealplan){
    this.url = '/mealplans/' + mealplan.id + '/ingredients'
  },

  model: IngredientModel

});
