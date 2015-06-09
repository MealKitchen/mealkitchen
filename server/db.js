var pg = require('pg');

var knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL || {
    host: '127.0.0.1',
    port: 5432,
    user: '',
    password: '',
    database: 'mealplan',
    charset: 'utf8',
    debug: true
  }
});

var db = require('bookshelf')(knex);


process.stderr.on('data', function(data) {
  console.log(data);
});
/*********************************************************
  Recipe Schema 
*********************************************************/
db.knex.schema.hasTable('recipes').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('recipes', function (recipe) {
      recipe.string('id').primary();
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

      knex.insert({
        'id': 'Vegetarian-Cabbage-Soup-Recipezaar',
        "salty": 0.6666666666666666,
        "sour": 0.8333333333333334,
        "sweet": 0.6666666666666666,
        "bitter": 0.5,
        "meaty": 0.16666666666666666,
        "piquant": 0.5}).into('recipes').then(function(column) {
          console.log('column: ', column);
        });

      /*********************************************************
        Meal Plan Schema
      *********************************************************/
      db.knex.schema.hasTable('mealPlans').then(function(exists){
        if(!exists){
          db.knex.schema.createTable('mealPlans', function(mealPlan){
            mealPlan.increments('id').primary();
            mealPlan.integer('userId');
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
            user.string('email').unique();
            user.string('first');
            user.string('last');
            user.string('username');
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
                  recipePreferences.string('recipeId').references('recipes.id');
                  recipePreferences.boolean('preference');
                  recipePreferences.float('salty');
                  recipePreferences.float('sour');
                  recipePreferences.float('sweet');
                  recipePreferences.float('bitter');
                  recipePreferences.float('piquant');
                  recipePreferences.float('meaty');
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


// db.knex.schema.hasTable('restrictions').then(function(exists){
//   if(!exists){
//     db.knex.schema.createTable('restrictions', function(restriction){
//       restriction.increments('id').primary();
//       restriction.string('name');
//     }).then(function(table){
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('userRestrictions').then(function(exists){
//   if(!exists){
//     db.knex.schema.createTable('userRestrictions', function(userRestriction){
//       userRestriction.increments('id').primary();
//       userRestriction.integer('userId');
//       userRestriction.integer('restrictionId');
//     }).then(function(table){
//       console.log('Created Table', table);
//     });
//   }
// });



module.exports = db;
