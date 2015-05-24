var QueryModel = Backbone.Model.extend({
  initialize: function(params){
    this.set({numMeals: params.numMeals, allowedAllergy: params.allowedAllergy});
  }
});
