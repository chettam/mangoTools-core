/**
 * Created by jbblanc on 20/05/2016.
 */
const config = require('../config')
module.exports = function(app){
    app.get('/api/auth/service/available', function(req, res){
        return res.status(200).json(config.services);
    });
};
