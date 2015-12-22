/* jshint browser:true */
'use strict';

var Promise = require('bluebird');
Promise.config({
  warnings: true,
  longStackTraces: !!window.localStorage.BLUEBIRD_LONG_STACK_TRACES,
  cancellation: true
});

describe('browser test suite', function() {
  this.timeout(30000);

  beforeEach(function() {
    this.testUrls =  {
      sameOrigin: window.location.protocol + '//' + window.location.host,
      crossOrigin: BJAX_TEST_SERVER_CROSS_ORIGIN
    }
  });

  describe('same-origin', function() {
    beforeEach(function() {
      this.baseUrl = this.testUrls.sameOrigin;
    });

    require('./specs/bjax-client-spec')();
    require('./specs/bjax-client-cors-limited-spec')();
    require('./specs/bjax-cancellation-spec')();
    require('./specs/bjax-network-fail-spec')();
    require('./specs/bjax-client-no-autoheaders-spec')();
  });

  describe('cross-origin', function() {
    beforeEach(function() {
      this.baseUrl = this.testUrls.crossOrigin;
    });

    require('./specs/bjax-client-spec')();
    require('./specs/bjax-client-cors-limited-spec')();
    require('./specs/bjax-cancellation-spec')();
    require('./specs/bjax-network-fail-spec')();
    require('./specs/bjax-client-no-autoheaders-spec')();

  });

});
