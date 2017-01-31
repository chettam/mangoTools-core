/**
 * Created by jbblanc on 20/05/2016.
 */

const uuid = require('uuid');
const db = require('../config/db').db;
const _ = require('lodash');

module.exports = function(app){

    /**
     *  Return a list of known devices
     */
    
    app.get('/api/anon/device', function(req, res){
        db.devices.find({}, function (err, devices) {
            return res.status(200).json(devices);
        });
    });

    /**
     *  Return a list of known devices. Authentication required
     */
    app.get('/api/auth/device', function(req, res){
        db.devices.find({}, function (err, devices) {
            return res.status(200).json(devices);
        });
    });

    /**
     *  Return a devices. Authentication required
     */
    app.get('/api/auth/device/:id', function(req, res){
        db.devices.findOne({_id :req.params['id']}, function (err, device) {
            if (err) {
                return res.status(401).json({err: err});
            }
            return res.status(200).json(device);
        });
    });



    /**
     *  Create or update a devices. then send the updates to the connected uis
     */
    app.post('/api/auth/device/createUpdate', function(req, res){
        if(req.body.kind === 'rgb'){
            console.log(req.body)
        }
        db.devices.findOne({_id : req.body._id},function(err,device){
            if (err) {
                return res.status(401).json({err: err});
            }
            if(device){
                _.merge(device, req.body);
                db.devices.update({_id : device._id},device,function(err,numupdated){
                    io.sockets.emit('device', { verb :'updated', uid :device.uid , data : device});
                    return res.status(200).json(device);
                })
            } else{
                req.body.uid = uuid.v4();
                db.devices.insert(req.body,function(err,device){
                    if (err) {
                        return res.status(401).json({err: err});
                    }
                    if (device) {
                        io.sockets.emit('device', { verb :'created', uid :device.uid , data : device});
                        return res.status(200).json(device);
                    }
                })
            }
        })
    });
};
