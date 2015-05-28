var knex = require('knex')({
  client: 'pg',
  connection: {
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
  User Schema
*********************************************************/
db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('email');
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
    });
  }
});



/*********************************************************
  Recipe Schema
*********************************************************/
db.knex.schema.hasTable('recipes').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('recipes', function (recipe) {
      recipe.increments('id').primary();
      recipe.string('yumId');
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
    });
  }
});

/*********************************************************
  Meal Plan Schema
*********************************************************/
db.knex.schema.hasTable('mealPlans').then(function(exists){
  if(!exists){
    db.knex.schema.createTable('mealPlans', function(mealPlan){
      mealPlan.increments('id').primary();
      mealPlan.integer('userId');
    }).then(function(table){
      console.log('Created Table', table);
    });
  }
});

/*********************************************************
  Meal Plan Recipes Schema
*********************************************************/
// db.knex.schema.hasTable('mealPlanRecipes').then(function(exists){
//   if(!exists){
//     db.knex.schema.createTable('mealPlanRecipes', function(mealPlanRecipe){
//       mealPlanRecipe.integer('recipeId');
//       mealPlanRecipe.integer('mealPlanId');
//     }).then(function(table){
//       console.log('Created Table', table);
//     });
//   }
// });


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
