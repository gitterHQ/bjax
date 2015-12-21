/* jshint node:true, browser:true */
'use strict';

var errors = require('./errors');
var Promise = require('bluebird');
var WindowXMLHttpRequest = window.XMLHttpRequest;
var XML_HTTP_DONE = 4;

var NetworkFailureError = errors.NetworkFailureError;
var HttpError = errors.HttpError;

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
    var xhr = new WindowXMLHttpRequest();
    var bodyEncoded;

    xhr.open(method, url);

    var hasContentTypeHeader = false;
    var hasAcceptHeader = false;

    if (options.headers) {
      Object.keys(options.headers).forEach(function(key) {
        var keyLower = key.toLowerCase();

        if (keyLower === 'content-type') hasContentTypeHeader = true;
        if (keyLower === 'accept') hasAcceptHeader = true;

        var value = options.headers[key];
        xhr.setRequestHeader(key, value);
      });
    }

    // Setup the content-type
    var body = options.body;
    if (method !== 'get' && body) {
      if (typeof body === 'object') {
        bodyEncoded = JSON.stringify(body);

        if (!hasContentTypeHeader) {
          xhr.setRequestHeader('Content-Type', 'application/json');
        }
      } else {
        bodyEncoded = body;
      }
    }

    // Setup the accepts
    if (jsonResponse && !hasAcceptHeader) {
      xhr.setRequestHeader('Accept', 'application/json');
    }

    if (options.credentials === 'include') {
      xhr.withCredentials = true;
    }

    function cleanup() {
      if (!xhr) return;
      xhr.onreadystatechange = null;
      xhr.ontimeout = null;
      xhr = null;
    }

    function makeHttpError(status, xhr) {
      var message = xhr.statusText || "HTTP " + status;

      var error = new HttpError(message);
      error.status = status;
      error.statusText = xhr.statusText;
      error.method = method;
      error.url = url;

      if (jsonResponse) {
        try {
          error.response = JSON.parse(xhr.responseText);
        } catch(e) {
          error.response = xhr.responseText;
        }
      } else {
        error.response = xhr.responseText;
      }

      return error;
    }

    xhr.onreadystatechange = function() {
      if (!xhr || xhr.readyState !== XML_HTTP_DONE) return;

      var xhrCopy = xhr;
      cleanup();

      var status = (xhrCopy.status === 1223) ? 204 : xhrCopy.status;

      if (status < 100 || status > 599) {
        return reject(new NetworkFailureError(xhrCopy.statusText));
      }

      if (status >= 400) {
        var httpError = makeHttpError(status, xhrCopy);
        return reject(httpError);
      }

      if (jsonResponse) {
        return parseJson(xhrCopy.responseText, resolve, reject);
      }

      return resolve(xhrCopy.responseText);
    };

    xhr.send(bodyEncoded);

    /* Cancel the XHR request */
    if (onCancel) {
      onCancel(function() {
        if (!xhr || xhr.readyState === XML_HTTP_DONE) return;
        xhr.onreadystatechange = null;
        xhr.ontimeout = null;
        xhr.abort();
        cleanup();
      });
    }

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
