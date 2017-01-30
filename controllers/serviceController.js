/**
 * Created by jbblanc on 20/05/2016.
 */
const config = require('../config')
module.exports = function(app){


    /**
     *   return the list of usable services.
     */
    
    app.get('/api/auth/service/available', function(req, res){
        return res.status(200).json(config.services);
    });
};
