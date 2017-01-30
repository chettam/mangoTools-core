/**
 * Created by jbblanc on 14/01/2016.
 */
/**
 * jwToken
 *
 * @description :: JSON Webtoken Service for sails
 * @help        :: See https://github.com/auth0/node-jsonwebtoken & http://sailsjs.org/#!/documentation/concepts/Services
 */

var jwt = require('jsonwebtoken');
var config = require('../config');


/**
 *  Generate token from supplied payload ( aka user)
 * @param payload
 * @returns {*}
 */
module.exports.issue = function(payload) {
  return jwt.sign(
    payload,
    config.token, // Token Secret that we sign it with
    {
      expiresIn : 10800 // Token Expire time
    }
  );
};


/**
 *   Verify the validity of the provided token 
 * @param token
 * @param callback
 * @returns {*}
 */
module.exports.verify = function(token, callback) {
  return jwt.verify(
    token, // The token to be verified
   config.token, // Same token we used to sign
    {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    callback //Pass errors or decoded token to callback
  );
};
