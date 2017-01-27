/**
 * Created by jbblanc on 19/05/2016.
 */

const config = require('../config');

module.exports = function(app){
  /**
   * Send the apiKey to a UI before  encryption
   */
    app.get('/api/apiKey', function(req, res){
        res.status(200).send(config.apiKey);
    });
};
