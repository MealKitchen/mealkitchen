var QueryModel = Backbone.Model.extend({
  initialize: function(params){
    this.set({numMeals: params.numMeals, restrictions: params.restrictions});
  }
});
