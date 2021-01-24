var http = require('http');
var url = require('url');
var config = require('./config');
var handlers = require('./handlers');

var server = {};

server.httpServer = http.createServer(function (req, res) {
  server.unifiedServer(req, res);
});

server.unifiedServer = function (req, res) {

  var parsedUrl = url.parse(req.url, true);

  var path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  var queryStringObject = parsedUrl.query;

  var method = req.method.toLowerCase();
  var headers = req.headers;

  // var decoder = new StringDecoder('utf-8');
  var payload = {};

  req.on('data', function (data) {
    payload = JSON.parse(data);
  });

  req.on('end', function () {
    var chosenHandler = typeof (server.router[path]) !== 'undefined' ? server.router[path] : handlers.notFound;

    var data = {
      path,
      queryStringObject,
      method,
      headers,
      payload
    };

    chosenHandler(data, function (statusCode, payload) {

      statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
      payload = typeof (payload) == 'object' ? payload : {};

      var payloadString = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      if (statusCode == 200) {
        console.log('\x1b[32m%s\x1b[0m', `[${method.toUpperCase()}] /${path} ${statusCode}`);
      } else {
        console.log('\x1b[31m%s\x1b[0m', `[${method.toUpperCase()}] /${path} ${statusCode} - ${payload.Error}`);
      }
    });

  });
};

server.router = {
  'ping': handlers.ping,
  'users': handlers.users,
  'tokens': handlers.tokens,
  'menu': handlers.menu,
  'cart': handlers.cart
};

server.init = function () {

  server.httpServer.listen(config.port, function () {
    console.log('\x1b[36m%s\x1b[0m', 'The HTTP server is running on port ' + config.port);
  });

};

module.exports = server;
