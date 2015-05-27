//TODO: get queryObject from mealQuery view and store in QueryModel
var QueryModel = Backbone.Model.extend({

  url: 'api/recipes',

  initialize: function(){
    this.set( {numMeals: null, allowedAllergy: {}, rejectedRecipeId: null, totalRecipesRequested: 0} );
  },
});
