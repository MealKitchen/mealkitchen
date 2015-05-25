//TODO: get queryObject from mealQuery view and store in QueryModel
var QueryModel = Backbone.Model.extend({

  url: 'api/recipes/makeplan',

  initialize: function(params){
    this.set({numMeals: params.numMeals, allowedAllergy: params.allowedAllergy});
  },
});
