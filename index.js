/* jshint node:true */
'use strict';

var http     = require('http');
var https    = require('https');
var errors   = require('./errors');
var Promise  = require('bluebird');
var urlParse = require('url').parse;
var debug    = require('debug')('bjax:request');

var NetworkFailureError = errors.NetworkFailureError;
var HttpError = errors.HttpError;

function createRequest(url, options, method, jsonResponse) {
  var endpoint = urlParse(url);

  var headers = {
   'Host': endpoint.host
  };

  var hasContentTypeHeader = false;
  var hasAcceptHeader = false;
  var hasContentLengthHeader = false;

  if (options.headers) {
    Object.keys(options.headers).forEach(function(key) {
      var keyLower = key.toLowerCase();

      if (keyLower === 'content-type') hasContentTypeHeader = true;
      if (keyLower === 'content-length') hasContentLengthHeader = true;
      if (keyLower === 'accept') hasAcceptHeader = true;

      var value = options.headers[key];
      headers[key] = value;
    });
  }

  var body = options.body;
  var bodyEncoded;
  if (method !== 'get' && body) {
    if (typeof body === 'object') {
      bodyEncoded = JSON.stringify(body);

      if (!hasContentTypeHeader) {
        headers['Content-Type'] = 'application/json';
      }
    } else {
      bodyEncoded = body;
    }
  }

  // Setup the accepts
  if (jsonResponse && !hasAcceptHeader) {
    headers['Accept'] = 'application/json';
  }

  if (!hasContentLengthHeader && bodyEncoded) {
    headers['Content-Length'] = bodyEncoded.length;
  }

  var params = {
    method:   method,
    host:     endpoint.hostname,
    path:     endpoint.path,
    headers:  headers,
    port:     endpoint.port
  };

  var isSecure = endpoint.protocol === 'https:';

  var client = isSecure ? https : http;
  debug('Request: %j', params);
  var request = client.request(params);
  request.end(bodyEncoded);
  return request;
}

/**
 * @param  {String} url     URL
 * @param  {Object} options
 *    body: body of the message
 *    headers: header to send
 *    responseType: `json`: treat response as JSON
 */
function request(url, options) {
  if (!options) options = {};

  var promise = new Promise(function(resolve, reject, onCancel) {

    var method = options.method && options.method.toLowerCase() || 'get';
    var jsonResponse = !options.responseType || options.responseType === "json";

    function cleanup() {
      if (!request) return;
      request.removeAllListeners();
      request = null;
    }

    function makeHttpError(status, response, body) {
      var message = response.statusMessage || "HTTP " + status;

      var error = new HttpError(message);
      error.status = status;
      error.statusText = response.statusMessage;
      error.method = method;
      error.url = url;

      if (jsonResponse) {
        try {
          error.response = JSON.parse(body);
        } catch(e) {
          error.response = body;
        }
      } else {
        error.response = body;
      }

      return error;
    }

    var request = createRequest(url, options, method, jsonResponse);

    request.on('response', function(response) {
      var body    = '';

      response.setEncoding('utf8');
      response.on('data', function(chunk) { body += chunk; });

      response.on('end', function() {
        if (!request) return;

        cleanup();

        var status = response.statusCode;

        if (status >= 400) {
          var httpError = makeHttpError(status, response, body);
          return reject(httpError);
        }

        if (jsonResponse) {
          return parseJson(body, resolve, reject);
        }

        return resolve(body);
      });
    });

    request.on('error', function(error) {
      return reject(new NetworkFailureError(error.message));
    });

    onCancel(function() {
      request.abort();
      cleanup();
    });

  });

  if (options.timeout) {
    promise = promise.timeout(options.timeout);
  }

  return promise;
}

request.NetworkFailureError = NetworkFailureError;
request.HttpError = HttpError;

/* Helper methods */

function parseJson(text, resolve, reject) {
  try {
    resolve(JSON.parse(text));
  } catch(e) {
    reject(e);
  }
}


module.exports = request;
