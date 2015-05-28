var db = require('../db');
var MealPlan = require('../mealPlan/mealPlanModel');


var Recipe = db.Model.extend({
  tableName: 'recipes',
  hasTimestamps: true
})

module.exports = Recipe;
