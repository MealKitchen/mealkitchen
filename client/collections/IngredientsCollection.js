var IngredientsCollection = Backbone.Collection.extend({

  url: 'api/recipes/collection',

  model: IngredientModel

});
