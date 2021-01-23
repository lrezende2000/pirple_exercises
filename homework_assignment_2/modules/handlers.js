var _data = require('./data');
var helpers = require('./helpers');

var handlers = {};
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

handlers.ping = function (_, callback) {
  callback(200);
};

handlers.notFound = function (_, callback) {
  callback(404);
};

// Users
handlers.users = function (data, callback) {

  var acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }

};

handlers._users = {};

handlers._users.post = function (data, callback) {

  var name = typeof (data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
  var email = typeof (data.payload.email) == 'string' && emailRegex.test(data.payload.email.trim()) ? data.payload.email.trim() : false;
  var adress = typeof (data.payload.adress) == 'string' && data.payload.adress.trim().length > 0 ? data.payload.adress.trim() : false;

  if (name && email && adress) {

    _data.read('users', email, function (err, _) {
      if (err) {

        var userObject = {
          name,
          email,
          adress
        };

        _data.create('users', email, userObject, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, { 'Error': 'Could not create the new user' });
          }
        });

      } else {
        callback(400, { 'Error': 'A user with that email already exists' });
      }
    });

  } else {
    callback(400, { 'Error': 'Missing required fields' });
  }

};

handlers._users.get = function (data, callback) {

  var email = typeof (data.queryStringObject.email) == 'string' && emailRegex.test(data.queryStringObject.email.trim()) ? data.queryStringObject.email.trim() : false;

  if (email) {

    var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

    handlers._tokens.verifyToken(token, email, function (tokenIsValid) {
      if (tokenIsValid) {
        _data.read('users', email, function (err, data) {
          if (!err && data) {
            callback(200, data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, { "Error": "Missing required token in header, or token is invalid." })
      }
    });
  } else {
    callback(400, { 'Error': 'Missing required field' })
  }

};

handlers._users.put = function (data, callback) {
  var email = typeof (data.payload.email) == 'string' && emailRegex.test(data.payload.email.trim()) ? data.payload.email.trim() : false;

  var name = typeof (data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
  var adress = typeof (data.payload.adress) == 'string' && data.payload.adress.trim().length > 0 ? data.payload.adress.trim() : false;

  if (email) {
    if (name || adress) {

      var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

      handlers._tokens.verifyToken(token, email, function (tokenIsValid) {
        if (tokenIsValid) {

          _data.read('users', email, function (err, userData) {
            if (!err && userData) {
              if (name) {
                userData.name = name;
              }
              if (adress) {
                userData.adress = adress;
              }
              _data.update('users', email, userData, function (err) {
                if (!err) {
                  callback(200);
                } else {
                  callback(500, { 'Error': 'Could not update the user.' });
                }
              });
            } else {
              callback(400, { 'Error': 'Specified user does not exist.' });
            }
          });
        } else {
          callback(403, { "Error": "Missing required token in header, or token is invalid." });
        }
      });
    } else {
      callback(400, { 'Error': 'Missing fields to update.' });
    }
  } else {
    callback(400, { 'Error': 'Missing required field.' });
  }

};

handlers._users.delete = function (data, callback) {

  var email = typeof (data.queryStringObject.email) == 'string' && emailRegex.test(data.queryStringObject.email.trim()) ? data.queryStringObject.email.trim() : false;

  if (email) {
    var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

    handlers._tokens.verifyToken(token, email, function (tokenIsValid) {

      if (tokenIsValid) {
        _data.read('users', email, function (err, userData) {
          if (!err && userData) {
            _data.delete('users', email, function (err) {
              if (!err) {
                callback(200);
              } else {
                callback(500, { 'Error': 'Could not delete the specified user' });
              }
            });
          } else {
            callback(400, { 'Error': 'Could not find the specified user.' });
          }
        });
      } else {
        callback(403, { "Error": "Missing required token in header, or token is invalid." });
      }
    });

  } else {
    callback(400, { 'Error': 'Missing required field' })
  }

};
// Users end

// Tokens
handlers.tokens = function (data, callback) {
  var acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }

};

handlers._tokens = {};

handlers._tokens.post = function (data, callback) {

  var email = typeof (data.payload.email) == 'string' && emailRegex.test(data.payload.email.trim()) ? data.payload.email.trim() : false;

  if (email) {
    _data.read('users', email, function (err, userData) {
      if (!err && userData) {

        var tokenId = helpers.createRandomString(20);
        var expires = Date.now() + 6000 * 60 * 60;
        var tokenObject = {
          email,
          'id': tokenId,
          expires
        };

        _data.create('tokens', tokenId, tokenObject, function (err) {
          if (!err) {
            callback(200, tokenObject);
          } else {
            callback(500, { 'Error': 'Could not create the new token' });
          }
        });

      } else {
        callback(400, { 'Error': 'Could not find the specified user.' });
      }
    });
  } else {
    callback(400, { 'Error': 'Missing required field(s).' });
  }

};

handlers._tokens.get = function (data, callback) {

  var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;

  if (id) {

    _data.read('tokens', id, function (err, tokenData) {
      if (!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404);
      }
    });

  } else {
    callback(400, { 'Error': 'Missing required field, or field invalid' })
  }

};

handlers._tokens.put = function (data, callback) {

  var id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
  var extend = typeof (data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;

  if (id && extend) {

    _data.read('tokens', id, function (err, tokenData) {

      if (!err && tokenData) {
        if (tokenData.expires > Date.now()) {

          tokenData.expires = Date.now() + 6000 * 60 * 60;

          _data.update('tokens', id, tokenData, function (err) {

            if (!err) {
              callback(200);
            } else {
              callback(500, { 'Error': 'Could not update the token\'s expiration.' });
            }

          });
        } else {
          callback(400, { "Error": "The token has already expired, and cannot be extended." });
        }
      } else {
        callback(400, { 'Error': 'Specified user does not exist.' });
      }
    });
  } else {
    callback(400, { "Error": "Missing required field(s) or field(s) are invalid." });
  }

};

handlers._tokens.delete = function (data, callback) {

  var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;

  if (id) {

    _data.read('tokens', id, function (err, tokenData) {

      if (!err && tokenData) {

        _data.delete('tokens', id, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, { 'Error': 'Could not delete the specified token' });
          }

        });
      } else {
        callback(400, { 'Error': 'Could not find the specified token.' });
      }

    });
  } else {
    callback(400, { 'Error': 'Missing required field' })
  }

};

handlers._tokens.verifyToken = function (id, email, callback) {

  _data.read('tokens', id, function (err, tokenData) {

    if (!err && tokenData) {
      if (tokenData.email == email && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }

  });

};
// Tokens end

module.exports = handlers;
