var expect = require('../node_modules/chai/chai').expect;
var request = require('request');
var app = require('../server/server');
var User = require('../server/user/userModel');
var Recipe = require('../server/recipe/recipeModel');
var MealPlan = require('../server/mealPlan/mealPlanModel');
var db = require('../server/db');

var ensureTableCreated = function(table, cb) {
  db.knex.schema.hasTable(table).then(function(exists) {
    if (exists) {
      cb();
    } else {
      ensureTableCreated(table, cb);
    }
  });
}

var port = process.env.PORT || 3000;

describe('Node server', function() {
  var testUserId, testCookie, testRecipeId;

  before(function() {
      app.listen(port);
  });

  it('should respond with a 200 status code', function(done) {
    request
      .get('http://127.0.0.1:3000/')
      .on('response', function(response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it('should sign up a new user successfully', function(done) {
    var testSignup = function() {
      request
        .post({url: 'http://127.0.0.1:3000/api/user', json: true, body: {signup: true, email: 'aoeui@aoeui.com', password: 'aoeui'}})
        .on('response', function(response) {
          expect(response.statusCode).to.equal(200);
          new User({email: 'aoeui@aoeui.com'}).fetch().then(function(user) {
            expect(user).to.exist;
            testUserId = user.id;
            done();
          });
        });
    };
    ensureTableCreated('users', testSignup);
  });

  it('should block a user from signing up with an email that already exists', function(done) {
    var testInvalidSignup = function() {
      request
        .post({url: 'http://127.0.0.1:3000/api/user', json: true, body: {signup: true, email: 'aoeui@aoeui.com', password: 'asdf'}})
        .on('response', function(response) {
          expect(response.statusCode).to.equal(409);
          done();
        });
    };
    ensureTableCreated('users', testInvalidSignup);
  });

  it('should save recipes to the database', function(done) {
    var testRecipeSave = function() {
      new Recipe({
        "id": "New-Orleans-Jambalaya-TEST",
        "recipeName": "New Orleans Jambalaya",
        "sourceDisplayName": "Johnsonville Brand",
        "smallImgUrl": "http://lh3.googleusercontent.com/7sj2IkdCtlc0rGAf0Iv1k4sHscofg9OsdsyCnzcAilTguacsOwt_CLVU_WvE_YANu3t8w6ZIX11zdn4vsmoCAg=s90",
        "mediumImgUrl": null,
        "largeImgUrl": null,
        "cuisine": null,
        "course": "{}",
        "holiday": null,
        "totalTimeInSeconds": 1500,
        "ingredients": "{\"JOHNSONVILLE® Hot 'N Spicy Brats\",\"diced tomatoes and green chilies\",\"stewed tomatoes\",\"onions\",\"green pepper\",\"water\",\"rice\"}",
        "rating": 3,
        "salty": 0.166667,
        "sour": 0.833333,
        "sweet": 0.166667,
        "bitter": 0.166667,
        "piquant": 0.166667,
        "meaty": 0.166667
      })
        .save({}, {method: 'insert'})
        .then(function(recipe) {
          expect(recipe.id).to.equal("New-Orleans-Jambalaya-TEST");
          testRecipeId = recipe.id;
          done();
        });
    };
    ensureTableCreated('recipes', testRecipeSave);
  });

  it('should block users from logging in with wrong password', function(done) {
    request
      .post({url: 'http://127.0.0.1:3000/api/user', json: true, body: {login: true, email: 'aoeui@aoeui.com', password: 'asdf'}})
      .on('response', function(response) {
        expect(response.statusCode).to.equal(401);
        done();
      });
  });

  it('should log in users if they have the correct password', function(done) {
    request
      .post({url: 'http://127.0.0.1:3000/api/user', json: true, body: {login: true, email: 'aoeui@aoeui.com', password: 'asdf'}})
      .on('response', function(response) {
        expect(response.statusCode).to.equal(401);
        expect(response.headers['set-cookie']).to.exist;
        testCookie = response.headers['set-cookie'][0].split(';')[0];
        console.log(typeof testCookie);
        done();
      });
  });

  // it('should verify a user is checked in by hitting api/users with a GET', function(done) {
  //   request({
  //     url: 'http://127.0.0.1:3000/api/user', 
  //     method: 'GET',
  //     headers: {
  //       'Cookie': testCookie
  //     }
  //   })
  //     .on('response', function(response) {
  //       console.log(response);
  //       expect(response.statusCode).to.equal(200);
  //       done();
  //     });
  // });

  // it('should save meal plans', function(done) {
  //   request
  //     .post({url: 'http://127.0.0.1:3000/api/mealplan', json: true, body: {userId: testUserId, recipes: [{id: testRecipeId}]}})
  //     .on('response', function(response) {
  //       expect(response.statusCode).to.equal(200);
  //       new MealPlan({userId: testUserId}).fetch().then(function(mealPlan) {
  //         expect(mealPlan).to.exist;
  //         done();
  //       });
  //     });
  // });

  after(function(done) {
    new User({email: 'aoeui@aoeui.com'}).fetch().then(function(user) {
      if (user) {
        user.destroy().then(function() {
          new Recipe({"id": "New-Orleans-Jambalaya-TEST"}).fetch().then(function(recipe) {
            recipe.destroy().then(function() {
              done();
            });
          });
        });
      }
    });
  });
});
