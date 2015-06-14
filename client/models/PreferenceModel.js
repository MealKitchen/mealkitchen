var PreferenceModel = Backbone.Model.extend({

  initialize: function(user){
    this.url = 'api/users/' + user.id + '/preferences';
  },

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

});
