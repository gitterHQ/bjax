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

var kvStore = {};
router.post('/key-value',
  bodyParser.urlencoded({ type: 'text/plain' }),
  function(req, res) {
    var isClosed = false;
    req.on('close', function() {
      isClosed = true;
    });

    setTimeout(function() {
      if (isClosed) return;
      res.set('Access-Control-Allow-Origin', '*');
      kvStore[req.body.key] = req.body.value;
      res.send('OK');
    }, 100);
  });

router.get('/key-value',
  function(req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    res.send(kvStore[req.query.key]);
  });

router.use('/network-fail',
  function(req) {
    req.socket.end();
  });

module.exports = router;
