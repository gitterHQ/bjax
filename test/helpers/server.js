/* jshint node:true */
'use strict';

var http = require('http');
var express = require('express');
var webpack = require('webpack');
var webpackMiddleware = require("webpack-dev-middleware");
var PUBLIC_DIR = __dirname + '/public';
var debug = require('debug')('bjax:test:server');
var internalIp = require('internal-ip');
var testRoutes = require('./test-routes');
var localIp = process.env.BJAX_LOCAL_IP || internalIp.v4();
var enableDestroy = require('server-destroy');

var server;
var crossOriginServer;

var port = process.env.PORT || 8000;
var crossOriginPort = port + 1;

function listen(options, callback) {
  var app = express();
  server = http.createServer(app);
  enableDestroy(server);

  crossOriginServer = http.createServer(app);
  enableDestroy(crossOriginServer);

  var sameOriginUrl = 'http://' + localIp + ':' + port;
  var crossOriginUrl = 'http://' + localIp + ':' + crossOriginPort;

  if (options.webpack) {
    app.use(webpackMiddleware(webpack({
      context: __dirname + "/..",
      entry: "mocha!./test-suite-browser",
      output: {
        path: __dirname + "/",
        filename: "test-suite-browser.js"
      },
      devtool: "#eval",
      plugins:[
        new webpack.DefinePlugin({
          BJAX_TEST_SERVER_SAME_ORIGIN: JSON.stringify(sameOriginUrl),
          BJAX_TEST_SERVER_CROSS_ORIGIN: JSON.stringify(crossOriginUrl)
        })
      ]

    }), {
      noInfo: false,
      quiet: false,

      watchOptions: {
          aggregateTimeout: 300,
          poll: true
      },

      publicPath: "/",
      stats: { colors: true }
    }));

    app.use(express.static(PUBLIC_DIR));
  }

  app.use('/test', testRoutes);

  app.use(function(err, req, res, next) { // jshint ignore:line
    res.status(500).send(err.message);
  });

  app.get('*', function(req, res) {
    res.status(404).send('Not found');
  });

  server.listen(port, function(err) {
    if (err) return callback(err);

    crossOriginServer.listen(crossOriginPort, function(err) {
      if (err) return callback(err);

      callback(null, {
        sameOrigin: sameOriginUrl,
        crossOrigin: crossOriginUrl
      });

    });
  });
}

function unlisten(callback) {
  debug('Unlisten');
  server.destroy(function() {
    crossOriginServer.destroy(function() {
      callback();
    });
  });
}

exports.listen = listen;
exports.unlisten = unlisten;

if (require.main === module) {
  process.on('uncaughtException', function(e) {
    console.error(e.stack || e);
    process.exit(1);
  });

  listen({ webpack: true }, function(err) {

    if (err) {
      debug('Unable to start server: %s', err);
      return;
    }

    debug('Listening');
  });
}
