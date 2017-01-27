/**
 * Created by jbblanc on 20/05/2016.
 */

 const config = require('../config');

module.exports = function(app){

    app.get('/api/auth/state', function(req, res){
        return res.status(200).json(config.states);
    });


};


//execute : function(req,res){
//    console.log(req.body)
//    if(!req.isSocket) return res.badRequest('Websocket only');
//    if(req.body.hasOwnProperty('state')){
//        //Dispatcher.execute(req.body.state,req.body['value']);
//        return res.ok();
//    } else {
//        return res.badRequest();
//    }
//}
