var PreferenceModel = Backbone.Model.extend({

  defaults: {
    'preference': null,
    'recipeId': null,
    'userId': null,
    'salty': null,
    'sour': null,
    'sweet': null,
    'bitter': null,
    'meaty': null,
    'piquant': null
  },

  url: 'api/recipePreferences'

});
