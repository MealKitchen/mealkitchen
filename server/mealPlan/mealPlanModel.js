var db = require('../db');


var MealPlan = db.Model.extend({
  tableName: 'mealPlans',
  hasTimestamps: true
})

module.exports = MealPlan;
