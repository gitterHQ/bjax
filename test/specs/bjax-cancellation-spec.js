'use strict';

var assert  = require('assert');
var bjax    = require('../..');
var Promise = require('bluebird');

var uniqueId = Math.floor(Math.random() * 100000000);

module.exports = function() {
  describe('bjax-cancellation', function() {

    it('should abort on cancellation', function() {
      return bjax(this.baseUrl + '/test/key-value', { method: 'post', body: 'key=' + uniqueId + '&value=1', responseType: 'text' })
        .bind(this)
        .then(function() {
          var promise = bjax(this.baseUrl + '/test/key-value', { method: 'post', body: 'key=' + uniqueId + '&value=2', responseType: 'text' });
          promise.cancel();

          return Promise.delay(100);
        })
        .then(function() {
          return bjax(this.baseUrl + '/test/key-value?key=' + uniqueId, { method: 'get', responseType: 'text' });
        })
        .then(function(response) {
          assert.strictEqual(response, '1');
        });

    });

  });

};
