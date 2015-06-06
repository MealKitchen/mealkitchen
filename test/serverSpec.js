var expect = require('../node_modules/chai/chai').expect;
var request = require('request');
var app = require('../server/server');
var User = require('../server/user/userModel');
var Recipe = require('../server/recipe/recipeModel');
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
            done();
          });
        });
    };
    ensureTableCreated('users', testSignup);


  });

  it('should save recipes to the database', function(done) {
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
        done();
      });
  });

  after(function(done) {
    new User({email: 'aoeui@aoeui.com'}).fetch().then(function(user) {
      if (user) {
        user.destroy().then(function() {
          done();
        });
      }
    });
  });
});
