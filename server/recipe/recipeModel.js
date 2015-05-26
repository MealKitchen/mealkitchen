var db = require('../db');


var Recipe = db.Model.extend({
  tableName: 'recipes',
  hasTimestamps: true
})

module.exports = Recipe;
