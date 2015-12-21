'use strict';

var assert = require('assert');
var bjax = require('../..');

module.exports = function() {
  describe('network-fail', function() {

    it('should throw a network error', function() {
      return bjax(this.baseUrl + '/test/network-fail')
        .then(function() {
          assert.ok(false);
        })
        .catch(bjax.NetworkFailureError, function() {
          // Good
        });
    });

  });

};
