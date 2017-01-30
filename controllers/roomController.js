/**
 * Created by jbblanc on 20/05/2016.
 */

const uuid = require('uuid')
const db = require('../config/db').db
const _ = require('lodash')
const io = require('../helpers/io').io

module.exports = function(app){

    /**
     * find all rooms. NO Authentication required
     */
    
    
    app.get('/api/auth/room', function(req, res){
        db.rooms.find({}, function (err, rooms) {
            return res.status(200).json(rooms);
        });
    });

    /**
     *find all rooms .Authentication required
     */
    
    
    app.get('/api/anon/room', function(req, res){
        db.rooms.find({}, function (err, rooms) {
            return res.status(200).json(rooms);
        });
    });


    /**
     * find a room .Authentication required
     */
    
    app.get('/api/auth/room/:id', function(req, res){
        db.rooms.findOne({_id :req.params.id}, function (err, room) {
            if (err) {
                return res.status(401).json({err: err});
            }
            return res.status(200).json(room);
        });
    });


    /**
     * Delete room .Authentication required
     */
    
    
    app.delete('/api/auth/room/:id', function(req, res){
        delete req.body.token;
        if (!req.params['id']) {
            return res.status(401).json({error: 'id not provided, What a shame!'});
        }

        db.rooms.remove({ _id: req.params['id'] }, {}, function (err, numRemoved) {
            if (err) {
                return res.status(401).json({err: err});
            }
            res.status(200).json('ok');
        });
    });


    /**
     * create  a new room from the config tool . Authentication required
     */
    
    
    app.post('/api/auth/room', function(req, res){
        db.rooms.insert(req.body, function (err, room) {
            if (err) {
                return res.status(401).json({err: err});
            }
            if (room) return res.status(200).json(room);
        });
    });


    /**
     * create or update room . Authentication required
     */
    
    
    app.post('/api/auth/room/createUpdate', function(req, res){
        db.rooms.findOne({ _id : req.body._id},function(err,room){
            if (err) {
                return res.status(401).json({err: err});
            }
            if(room){
                _.merge(room, req.body);
                db.rooms.update({_id : room._id},room,function(err,numupdated){
                    io.sockets.emit('room', { verb :'updated', uid :room.uid , data : room});
                    return res.status(200).json(room);
                })
            } else{
                req.body.uid = uuid.v4();
                db.rooms.insert(req.body,function(err,room){
                    if (err) {
                        return res.status(401).json({err: err});
                    }
                    if (room) {
                        io.sockets.emit('room', { verb :'created', uid :room.uid , data : room});
                        return res.status(200).json(room);
                    }
                })
            }
        })
    });

    /**
     * create  or update room by name .  Authentication required
     */

    app.post('/api/anon/room/createUpdateByName/:name', function(req, res){
        db.rooms.findOne({name : req.params.name},function(err,room){
            if (err) {
                return res.status(401).json({err: err});
            }
            if(room){
                io.sockets.emit('room', { verb :'updated', uid :room.uid , data : room});
                return res.status(200).json(room);
            } else{
                var room = {}
                room.name = req.params.name;
                room.uid = uuid.v4();
                db.rooms.insert(room,function(err,room){
                    if (err) {
                        return res.status(401).json({err: err});
                    }
                    if (room) {
                        io.sockets.emit('room', { verb :'created', uid :room.uid , data : room});
                        return res.status(200).json(room);
                    }
                })
            }
        })
    });
};
