var http = require('http');
var url = require('url');
var config = require('./config');

var server = http.createServer(function (req, res) {
  var parsedUrl = url.parse(req.url, true);
  var route = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  var queryStringObject = parsedUrl.query;
  var method = req.method.toLowerCase();
  var headers = req.headers;
  var payload = {};

  req.on('data', function (data) {
    payload = JSON.parse(data);
  });

  req.on('end', function () {
    var chosenHandler = typeof (routes[route]) !== 'undefined' ? routes[route] : controllers.pageNotFound;

    var data = {
      queryStringObject,
      method,
      headers,
      route,
      body: payload
    };

    chosenHandler(data, function (statusCode, payload) {
      statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
      payload = typeof (payload) == 'object' ? payload : {};
      
      var payloadString = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    });

  });
});

server.listen(config.port, function () {
  console.log(`Server running on port ${config.port} in ${config.envName} mode 🔥`);
});

var controllers = {};

controllers.healthCheck = function (_, callback) {
  let message = "API is alive!";
  callback(200, { message });
}

controllers.pageNotFound = function (data, callback) {
  let message = "This requested route doesn't exist";
  callback(404, { message, unknownRoute: data.route });
};

controllers.hello = function (data, callback) {
  callback(200, data);
};

var routes = {
  'hello': controllers.hello,
  'healthcheck': controllers.healthCheck,
};
