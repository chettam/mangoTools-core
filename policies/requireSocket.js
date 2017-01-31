const jwToken = require('../helpers/jwToken')
const cryptiles = require('cryptiles')
const config = require('../config')


module.exports = function(socket, next) {

    if(socket.handshake.query.token && socket.handshake.query.apiKey ){
        if(cryptiles.fixedTimeComparison(config.apiKeyEnc,socket.handshake.query.apiKey)){
            jwToken.verify(socket.handshake.query.token, function (err, token) {
                if (err)  next(new Error("not authorized"));
                next();
            });
        }else {
            next(new Error("Wrong ApiKey"));
        }
    } else {
        next(new Error("Auth Missing"));
    }
};
