/**
 * Created by jbblanc on 20/05/2016.
 */
const fs = require('fs-extra') //File System - for file manipulation
const path = require("path")
const busboy = require('connect-busboy')		//middleware for form/file upload
const util = require('util')					//for stream
const sizeOf = require('image-size')
const db = require('../config/db').db


module.exports = function(app){

    /**
     * get images .  NO Authentication required
     */
    app.get('/api/auth/image/',function(req,res){
        db.images.find({},function(err,images){
            if(err) return res.status(401).json({err: err});
            if(images){
                return res.status(200).json(images)
            }
        })
    });

    /**
     *get background image only. Authentication required
     */
    app.get('/api/auth/image/background',function(req,res){
        db.images.find({usage:'background'},function(err,images){
            if(err) return res.status(401).json({err: err});
            if(images){
                return res.status(200).json(images)
            }
        })
    });

    /**
     * get icons only . Authentication required
     */
    app.get('/api/auth/image/icons',function(req,res){
        db.images.find({usage:'icon'},function(err,images){
            if(err) return res.status(401).json({err: err});
            if(images){
                return res.status(200).json(images)
            }
        })
    });

    /**
     * update image parameters . Authentication required
     */
    app.post('/api/auth/image/:id',function(req,res){
        db.images.update({ _id : req.params.id},req.body , function(err,updated){
            if(err) return res.status(401).json({err: err});
            return res.status(200).json(req.body)
        })
    });


    /**
     * Delete image  .Authentication required
     */
    app.delete('/api/auth/image/:id', function(req, res){
        delete req.body.token;
        if (!req.params.id) {
            return res.status(401).json({error: 'id not provided, What a shame!'});
        }

        db.images.remove({ _id: req.params.id }, {}, function (err, numRemoved) {
            if (err) {
                return res.status(401).json({err: err});
            }
            res.status(200).json('ok');
        });
    });


    /* ==========================================================
     Use busboy middleware
     ============================================================ */
    app.use(busboy());


    /**
     *  Image uploader
     */
    app.post('/api/auth/image', function (req, res, next) {
        var fieldParameter;
        var fstream;
        var filesize = 0;
        req.pipe(req.busboy);

        //--------------------------------------------------------------------------
        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            file.on('data', function (data) {
                fileSize = data.length;
            });
            file.on('end', function () {
                var dimensions = sizeOf(path.join(__dirname, '../www/images/' + filename));
                var usage = dimensions.width < 250 && dimensions.height < 250 ? 'icon' : 'background';
                db.images.insert({
                    name: filename,
                    path: config.appUrl + '/images/' + filename,
                    rotation: 0,
                    usage: usage
                }, function (err) {
                    if (err)
                        return console.log(err);
                });
            });

            fieldParameter = [{fieldname: fieldname, filename: filename, encoding: encoding, MIMEtype: mimetype}];

            //Path where image will be uploaded
            fstream = fs.createWriteStream(path.join(__dirname, '../www/images/') + filename);	//create a writable stream

            file.pipe(fstream);
            req.on('end', function () {
                res.end(JSON.stringify(fieldParameter));							//http response body - send json data
            });
            //Finished writing to stream
            fstream.on('finish', function () {
                //Get file stats (including size) for file saved to server
                fs.stat(path.join(__dirname, '../www/images/' + filename) , function (err, stats) {
                    if (err)
                        throw err;
                    //if a file
                    if (stats.isFile()) {
                    }
                });
            });
            fstream.on('error', function (err) {
                return 'error';
            });
        });

        req.busboy.on('finish', function () {
            next();
        });
    });
};
