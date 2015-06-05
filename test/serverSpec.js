var expect = require('../node_modules/chai/chai').expect;
var request = require('request');
var app = require('../server/server.js');

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
});
