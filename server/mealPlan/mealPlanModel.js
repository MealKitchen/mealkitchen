var db = require('../db');
var Recipe = require("../recipe/recipeModel")

var MealPlan = db.Model.extend({
  tableName: 'mealPlans',
  hasTimestamps: true,
  recipes: function() {
    return this.belongsToMany(Recipe);
  }
})

module.exports = MealPlan;