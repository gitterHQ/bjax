/* jshint node:true */
'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use('/ping',
  bodyParser.json(),
  function(req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.send({
      method: req.method,
      path: req.originalUrl,
      body: req.body
    });
  });

router.use('/ping-cors-limited',
  bodyParser.text(),
  function(req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    res.send({
      method: req.method,
      requestHeaders: req.headers,
      path: req.originalUrl,
      body: req.body
    });
  });

router.use('/network-fail',
  function(req) {
    req.socket.end();
  });

module.exports = router;
