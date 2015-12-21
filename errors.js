/* jshint node:true */
'use strict';

function makeError(name) {
  function ErrorType(message) {
    this.name = name;
    this.message = message;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  ErrorType.prototype = new Error();
  ErrorType.prototype.name = name;
  ErrorType.prototype.constructor = ErrorType;

  return ErrorType;
}

module.exports = {
  NetworkFailureError: makeError('NetworkFailureError'),
  HttpError: makeError('HttpError')
};
