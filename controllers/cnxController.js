/**
 * Created by jbblanc on 20/05/2016.
 */

const uuid = require('uuid')
const processManager = require('../helpers/processManager')
const ipc = require('../helpers/ipc')
const db = require('../config/db').db

module.exports = function(app){

    app.post('/api/auth/cnx', function(req, res){
        if (!req.body.name || !req.body.kind ) {
            return res.json(401, {error: 'Connexion characteristics required'});
        }
        delete req.body.token;
        req.body.uid = uuid.v4();
        req.body.enabled = true;
        req.body.connected = false;
        db.connections.insert(req.body,function(err,cnx){
            if (err) {
                return res.status(401).json({err: err});
            }
            if (cnx) {
                processManager.reStart();
                res.status(200).json(cnx);
            }
        });
    });

    app.post('/api/auth/cnx/auth', function(req, res){
        delete req.body.token;
        ipc.auth(req.body);
        res.status(200).json(req.body);
    });




    app.post('/api/auth/cnx/:id', function(req, res){
        delete req.body.token;
        if (!req.params['id']) {
            return res.status(401).json({error: 'id not provided, What a shame!'});
        }
        db.connections.update({_id : req.params['id'] },req.body,function(err,rowchange){
            if (err) {
                return res.status(401).json({err: err});
            }
            res.status(200).json(req.body);
        });
    });

    app.delete('/api/auth/cnx/:id', function(req, res){
        delete req.body.token;
        if (!req.params['id']) {
            return res.status(401).json({error: 'id not provided, What a shame!'});
        }

        db.connections.remove({ _id: req.params['id'] }, {}, function (err, numRemoved) {
            if (err) {
                return res.status(401).json({err: err});
            }
            processManager.reStart();
            res.status(200).json('ok');
        });
    });

    app.get('/api/auth/cnx', function(req, res){
        db.connections.find({},function(err,connections){
            if (err) {
                return res.status(401).json({err: err});
            }
            if (connections) return res.status(200).json(connections);
        });
    });

    app.get('/api/auth/cnx/:kind', function(req, res){
        if (!req.params['kind']) {
            return res.json(401, {error: 'id not provided, What a shame!'});
        }
        db.connections.find({kind : req.params['kind']},function(err,connections){
            if (err) {
                return res.status(401).json({err: err});
            }
            if (connections) return res.status(200).json(connections);
        });
    });
};
