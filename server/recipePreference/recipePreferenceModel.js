var db = require('../db');

var recipePreferences = db.Model.extend({
  tableName: 'recipePreferences'
  
});

module.exports = recipePreferences;
