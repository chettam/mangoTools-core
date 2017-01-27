/**
 * Created by jbblanc on 20/05/2016.
 */
const generatePassword = require('password-generator')
const jwToken          = require('../helpers/jwToken')
const db = require('../config/db').db
const io = require('../helpers/io').io

module.exports = function(app){

  /**
   * create  a new client / ui  then authenticate  it .  NO Authentication required
   */
    app.post('/api/anon/client',function(req,res){
        if (!req.body.serial) {
            return res.status(401).json({error: 'Serial not provided, What a shame!'})
        }

        // Default settings for Mango Tools UI.
        req.body.authToken =  generatePassword(24, false)
        req.body.intercom = false
        req.body.settings = {}
        req.body.settings.screenSaver = {}
        req.body.settings.screenSaver.timeout = 180
        req.body.settings.background = {}
        req.body.settings.background.path = '/images/origami.jpg'
        req.body.settings.background.rotation = 0
        req.body.settings.hexagon = {}
        req.body.settings.hexagon.color = '#307c80'
        req.body.settings.hexagon.borderColor = '#ffffff'
        req.body.settings.hexagon.borderWidth = 5
        req.body.settings.fonts = {}
        req.body.settings.fonts.factor = 1
        req.body.settings.fonts.color = '#ffffff'

        db.clients.findOne({serial : req.body.serial},function(err,client){
            if (err) {
                return res.status(401).json({err: err});
            }
            if(client){
                io.sockets.emit('client', { verb :'created', uid :client._id , data :client});
                return res.status(200).json({client: client, token: jwToken.issue({id: client._id})});
            } else {
                db.clients.insert(req.body,function(err,client){
                    console.log(client)
                    io.sockets.emit('client', { verb :'created', uid :client._id , data :client});
                    return res.status(200).json({client: client, token: jwToken.issue({id: client._id})});
                })
            }
        });
    });

    /**
     * Client Login .  NO Authentication required
     */

    app.post('/api/anon/client/login',function(req,res){
        var serial = req.body.serial;
        var authToken = req.body.authToken;

        if (!serial || !authToken) {
            return res.status(401).json({error: 'Missing parameters'});
        }
        db.clients.findOne({authToken: authToken, serial : serial}, function (err, client) {
            if (!client) {
                return res.status(401).json({error: 'login failed'});
            }
            res.status(200).json({client: client, token: jwToken.issue({id: client._id})});
        });
    });

    //login
    // app.post('/api/auth/client/peer',function(req,res){
    //     var serial = req.body.serial;
    //     var connected = req.body.connected;
    //     db.clients.findOne({ serial : serial}).exec(function(err,client){
    //         if(client){
    //             client.comServer.connected = connected;
    //             db.clients.update({_id : client._id},client,function(err,updated){
    //                 return res.status(200);
    //             })
    //         }
    //     })
    // });

    /**
     * Update a client . Authentication required
     */
    app.post('/api/auth/client/:id',function(req,res){
        db.clients.update({_id : req.params.id},req.body,function(err,client){
            if (err) {
                return res.status(401).json({err: err});
            }
            // If user created successfuly we return user and token as response
            io.sockets.emit('client', { verb :'updated', uid :client._id , data :req.body});
            if (client) return res.status(200).json(req.body);

        })
    });

    /**
     * Find a client . Authentication required
     */
    app.get('/api/auth/client/:id',function(req,res){
        db.clients.findOne({_id :req.params.id }).exec(function(err,client){
            if (err) {
                return res.status(401).json({err: err});
            }
            if (client) return res.status(200).json(client);
        });

    });

    //find
    app.get('/api/auth/client',function(req,res){
        db.clients.find({}).exec(function(err,clients){
            if (err) {
                return res.status(401).json({err: err});
            }
            if (clients) return res.status(200).json(clients);
        });
    })


    app.delete('/api/auth/client/:id', function(req, res){
        delete req.body.token;
        if (!req.params['id']) {
            return res.status(401).json({error: 'id not provided, What a shame!'});
        }

        db.clients.remove({ _id: req.params['id'] }, {}, function (err) {
            if (err) {
                return res.status(401).json({err: err});
            }
            res.status(200).json('ok');
        });
    });

};
