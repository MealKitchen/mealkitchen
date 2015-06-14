var RecipesCollection = Backbone.Collection.extend({
  url: 'api/recipes',
  model: RecipeModel

});
