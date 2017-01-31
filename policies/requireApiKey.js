const cryptiles = require('cryptiles')
const config = require('../config')

/**
 * Created by jbblanc on 20/05/2016.
 */

module.exports = function (req, res, next) {
    let apiKey;
    if (req.headers && ( req.headers.apiKey|| req.headers.apikey)) {
        apiKey =  req.headers.apiKey || req.headers.apikey;
        if (cryptiles.fixedTimeComparison(config.apiKeyEnc,apiKey)) {
            return next()
        } else {
            log.error('Invalid Api Key !');
            return res.status(401).json({err: 'Invalid Api Key !'})
        }
    } else {
        log.error('No Api Key header was found');
        return res.status(401).json({err: 'No Api Key header was found'})
    }
};


    
