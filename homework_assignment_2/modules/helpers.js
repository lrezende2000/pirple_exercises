const config = require('./config');
const https = require('https');
var querystring = require('querystring');

var helpers = {};

helpers.createRandomString = function (len) {

  len = typeof (len) == 'number' && len > 0 ? len : false;

  if (len) {

    var avaiableChars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var randomString = '';

    for (let i = 0; i < len; i++) {

      var randomNumber = Math.floor(Math.random() * avaiableChars.length);
      randomString += avaiableChars[randomNumber];

    }

    return randomString;
  } else {

    return false;
  }

}

helpers.paymentIntent = function (amount, currency, paymentMethod = 'pm_card_visa', callback) {

  amount = typeof (amount) === "number" && amount > 0 ? amount : false;
  currency = typeof (currency) === "string" && currency.trim().length > 0 ? currency.trim() : false;

  if (amount && currency) {

    var postData = querystring.stringify({
      amount,
      currency,
      'confirm': true,
      'payment_method': paymentMethod,
    });

    const options = {
      hostname: 'api.stripe.com',
      path: '/v1/payment_intents',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': ` Bearer ${config.strip_token}`
      }
    };

    const req = https.request(options, (res) => {
      const status = res.statusCode;
      res.on('data', (response) => {
        callback(status, JSON.parse(response));
      });
    });

    req.on('error', (e) => {
      callback(status, e);
    });

    req.write(postData);
    req.end();
  } else {
    callback(400, { "Error": "Missing required fields." })
  }
}

module.exports = helpers;
