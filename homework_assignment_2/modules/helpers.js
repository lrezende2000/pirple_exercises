var helpers = {};

helpers.createRandomString = function(len) {

  len = typeof(len) == 'number' && len > 0 ? len : false;

  if (len) {

    var avaiableChars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var randomString = '';
  
    for(let i = 0; i < len; i++) {

      var randomNumber = Math.floor(Math.random() * avaiableChars.length);  
      randomString += avaiableChars[randomNumber];

    }
  
    return randomString;
  } else {

    return false;
  }

}

module.exports = helpers;
