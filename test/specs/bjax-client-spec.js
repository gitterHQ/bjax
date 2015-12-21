'use strict';

var assert = require('assert');
var Promise = require('bluebird');
var bjax = require('../..');

module.exports = function() {
  describe('bjax-client', function() {

    it('should perform a GET by default', function() {
      return bjax(this.baseUrl + '/test/ping')
        .then(function(response) {
          assert.strictEqual(response.method, 'GET');
          assert.strictEqual(response.path, '/test/ping');
          assert.deepEqual(response.body, {});
        });
    });

    it('should perform a GET', function() {
      return bjax(this.baseUrl + '/test/ping', { method: 'get' })
        .then(function(response) {
          assert.strictEqual(response.method, 'GET');
          assert.strictEqual(response.path, '/test/ping');
          assert.deepEqual(response.body, {});

        });
    });

    it('should perform a POST', function() {
      return bjax(this.baseUrl + '/test/ping', { method: 'post', body: { hello: 1 } })
        .then(function(response) {
          assert.strictEqual(response.method, 'POST');
          assert.strictEqual(response.path, '/test/ping');
          assert.deepEqual(response.body, { hello: 1 });
        });
    });

    it('should perform a PUT', function() {
      return bjax(this.baseUrl + '/test/ping', { method: 'put', body: { hello: 1 } })
        .then(function(response) {
          assert.strictEqual(response.method, 'PUT');
          assert.strictEqual(response.path, '/test/ping');
          assert.deepEqual(response.body, { hello: 1 });
        });
    });

    it('should perform a DELETE without a body', function() {
      return bjax(this.baseUrl + '/test/ping', { method: 'delete' })
        .then(function(response) {
          assert.strictEqual(response.method, 'DELETE');
          assert.strictEqual(response.path, '/test/ping');
          assert.deepEqual(response.body, { });
        });
    });

    it('should perform a DELETE with a body', function() {
      return bjax(this.baseUrl + '/test/ping', { method: 'delete', body: { hello: 1 } })
        .then(function(response) {
          assert.strictEqual(response.method, 'DELETE');
          assert.strictEqual(response.path, '/test/ping');
          assert.deepEqual(response.body, { hello: 1 });
        });
    });

  });

};
