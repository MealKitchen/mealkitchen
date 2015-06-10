var QueryModel = Backbone.Model.extend({

  url: 'api/recipes',

  initialize: function(){
    this.set({
      allowedAllergies: {},
      allowedCuisines: {},
      allowedDiet: {}
    });
  }
});
