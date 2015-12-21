'use strict';

var assert = require('assert');
var bjax = require('../..');

module.exports = function() {
  describe('cors-limited', function() {

    it('should perform a GET', function() {
      return bjax(this.baseUrl + '/test/ping-cors-limited', { method: 'get', responseType: 'text' })
        .then(function(response) {
          response = JSON.parse(response);
          assert.strictEqual(response.method, 'GET');
          assert.strictEqual(response.path, '/test/ping-cors-limited');
          assert.deepEqual(response.body, {});

        });
    });

    it('should perform a POST', function() {
      return bjax(this.baseUrl + '/test/ping-cors-limited', { method: 'post', body: 'hello=1', responseType: 'text' })
        .then(function(response) {
          response = JSON.parse(response);

          assert.strictEqual(response.method, 'POST');
          assert.strictEqual(response.path, '/test/ping-cors-limited');
          assert.deepEqual(response.body, 'hello=1');
        });
    });

  });

};
