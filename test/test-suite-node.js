'use strict';

var Promise = require('bluebird');
Promise.config({
  warnings: true,
  longStackTraces: true,
  cancellation: true
});

var server = require('./helpers/server');

describe('node-test-suite', function() {

  before(function(done) {
    var self = this;
    server.listen({}, function(err, urls) {
      if (err) return done(err);
      self.testUrls = urls;
      done();
    });
  });

  after(function(done) {
    server.unlisten(done);
  });

  describe('no-origin', function() {
    beforeEach(function() {
      this.baseUrl = this.testUrls.sameOrigin;
    });

    require('./specs/bjax-client-spec')();
    require('./specs/bjax-cancellation-spec')();
  });

});
