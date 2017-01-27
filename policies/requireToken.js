const jwToken = require('../helpers/jwToken');

/**
 * isAuthorized
 *
 * @description :: Policy to check if user is authorized with JSON web token
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

module.exports = function (req, res, next) {
  var token;
  if (req.headers && req.headers['authorization']) {
    var parts = req.headers['authorization'].split(' ');
    if (parts.length == 2) {
      var scheme = parts[0],
        credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      log.error('Format is Authorization: Bearer [token]');
      return res.status(401).json({err: 'Format is Authorization: Bearer [token]'});
    }
  } else if (req.query.token) {
    token = req.query.token;
  } else {
    log.error('No Authorization header was found');
    return res.status(401).json({err: 'No Authorization header was found'});
  }
  jwToken.verify(token, function (err, token) {
    if (err) return res.status(403).json({err: 'Invalid Token!'});
    req.token = token; // This is the decrypted token or the payload you provided
    next();
  });
};
