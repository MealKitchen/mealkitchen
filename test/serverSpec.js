var expect = require('../node_modules/chai/chai').expect;
var request = require('request');
var app = require('../server/server.js');
var User = require('../server/user/userModel');

var port = process.env.PORT || 3000;

describe('Node server basic functionality', function() {

  before(function() {
      app.listen(port);
  });

  it('Should respond with a 200 status code', function(done) {
    request
      .get('http://127.0.0.1:3000/')
      .on('response', function(response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  it('Should sign up a new user successfully', function(done) {
    request
      .post({url: 'http://127.0.0.1:3000/api/user', json: true, body: {signup: true, email: 'aoeui@aoeui.com', password: 'aoeui'}})
      .on('response', function(response) {
        expect(response.statusCode).to.equal(200);
        new User({email: 'aoeui@aoeui.com'}).fetch().then(function(user) {
          expect(user).to.exist;
          if (user) {
            user.destroy().then(function(model) {
              done();
            });
          }
        });
      });
  });
});
