var environments = {};

environments.staging = {
  'port': 3000,
  'envName': 'staging',
  'strip_token': 'your_stripe_token'
};

environments.production = {
  'port': 5000,
  'envName': 'production',
  'strip_token': 'your_stripe_token'
};

var currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
var environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;
