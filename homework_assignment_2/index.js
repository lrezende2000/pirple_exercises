var server = require('./modules/server');
// var workers = require('./modules/workers');

var app = {};

app.init = function () {

  server.init();
  // workers.init();

};

app.init();

module.exports = app;
