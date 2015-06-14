var pg = require('pg');

var knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL || {
    host: '127.0.0.1',
    port: 5432,
    user: '',
    password: '',
    database: 'mealplan',
    charset: 'utf8'
  }
});

var db = require('bookshelf')(knex);


/*********************************************************
  Recipe Schema
*********************************************************/
db.knex.schema.hasTable('recipes').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('recipes', function (recipe) {
      //individual recipe get-request id
      recipe.string('id').primary();
      //search request id
      recipe.string('matchId');

      recipe.string('recipeName');
      recipe.string('sourceDisplayName');
      recipe.string('smallImgUrl');
      recipe.string('mediumImgUrl');
      recipe.string('largeImgUrl');
      recipe.string('cuisine');
      recipe.string('course');
      recipe.string('holiday');
      recipe.integer('totalTimeInSeconds');
      recipe.text('ingredients');
      recipe.float('rating');
      recipe.float('salty');
      recipe.float('sour');
      recipe.float('sweet');
      recipe.float('bitter');
      recipe.float('piquant');
      recipe.float('meaty');
      recipe.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);

      /*********************************************************
        Meal Plan Schema
      *********************************************************/
      db.knex.schema.hasTable('mealPlans').then(function(exists){
        if(!exists){
          db.knex.schema.createTable('mealPlans', function(mealPlan){
            mealPlan.increments('id').primary();
            mealPlan.integer('userId');
            mealPlan.string('title');
            mealPlan.timestamps();
          }).then(function(table){
            console.log('Created Table', table);

            /*********************************************************
              Meal Plan Recipes Schema
            *********************************************************/

            db.knex.schema.hasTable('mealPlans_recipes').then(function(exists){
              if(!exists){
                db.knex.schema.createTable('mealPlans_recipes', function(mealPlanRecipe){
                  mealPlanRecipe.integer('mealPlan_id').references('mealPlans.id');
                  mealPlanRecipe.string('recipe_id').references('recipes.id');
                  mealPlanRecipe.string('mealPlanCourse');
                }).then(function(table){
                  console.log('Created Table', table);
                });
              }
            });
          });
        }

      });
      /*********************************************************
        User Schema
      *********************************************************/
      db.knex.schema.hasTable('users').then(function(exists) {
        if (!exists) {
          db.knex.schema.createTable('users', function (user) {
            user.increments('id').primary();
            user.string('username').unique();
            user.string('password');
            user.float('salty');
            user.float('sour');
            user.float('sweet');
            user.float('bitter');
            user.float('piquant');
            user.float('meaty');
            user.timestamps();
          }).then(function (table) {
            console.log('Created Table', table);
            /*********************************************************
              Recipe Preference Schema
            *********************************************************/
            db.knex.schema.hasTable('recipePreferences').then(function(exists) {
              if (!exists) {
                db.knex.schema.createTable('recipePreferences', function (recipePreferences) {
                  recipePreferences.increments('id').primary();
                  recipePreferences.integer('userId').references('users.id');
                  recipePreferences.string('matchId');
                  recipePreferences.boolean('preference');
                  recipePreferences.float('salty');
                  recipePreferences.float('sour');
                  recipePreferences.float('sweet');
                  recipePreferences.float('bitter');
                  recipePreferences.float('piquant');
                  recipePreferences.float('meaty');
                  recipePreferences.string('course');
                }).then(function (table) {
                  console.log('Created Table', table);
                });
              }
            });
          });
        }
      });
    });
  }
});




module.exports = db;
