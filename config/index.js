const crypto = require('crypto-js')
let apiKey = process.env.APIKEY || 'H7F2vPZnCFLECLZQKF4z7bnvJqhk2VnkXcF9';
module.exports = {
    apiKey : apiKey ,
    apiKeyEnc : crypto.HmacSHA256(apiKey,'Y9+q-Ths*6LdN-?*6#XJS^HfD6tp%u73V7+Uyk_k&').toString(),
    token : '4d5303ee636f374adbf7a0cb974ad0bb'+process.env.SERIALNUMBER || '2b359efb-3a98-4c52-9e45-05553df4d65b'.replace(/-/g, ''),
    log  : process.env.NODE_ENV  === 'production' ? 'error' : 'silly',
    port : 1410,
    serialNumber : process.env.SERIALNUMBER || '2b359efb-3a98-4c52-9e45-05553df4d65b',
    services : [],
    states : {}

};
