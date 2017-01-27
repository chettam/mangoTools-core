/**
 * Created by jbblanc on 20/05/2016.
 */

const db = require('../config/db').db
const fs = require('fs')
const dir = require('node-dir')
const log = require('../config/log').logger
const _ = require('lodash')

module.exports = {

    start : function(){
        log.info('======================================================')
        log.info('                 Image integration                    ')
        log.info('======================================================')
        fs.readdir(__dirname + '/../www/images', function(err,images){
            _.forEach(images,function(image){
                var imagePath ='/images/'+image;
                db.images.findOne({name : image},function(err,existingImage){
                    if(err) log.error( 'Could not get existing users' + err);
                    if(_.isEmpty(existingImage)){
                        db.images.insert({name : image , path : imagePath ,usage :'background' , rotation : 0},function(err,newImage){
                            if(err) log.error( 'Could not get existing images' + err);
                        })
                    }
                });
            });
        });

        fs.readdir(__dirname + '/../www/categories', function(err,images){
            _.forEach(images,function(image){
                var imagePath = '/categories/'+image;
                db.images.findOne({name : image},function(err,existingImage){
                    if(err) log.error( 'Could not get existing users' + err);
                    if(_.isEmpty(existingImage)){
                        db.images.insert({name : image , path : imagePath ,usage :'categories' , rotation : 0},function(err,newImage){
                            if(err) log.error( 'Could not get existing images' + err);
                        })
                    }
                });
            });

        });

        fs.readdir(__dirname + '/../www/rooms', function(err,images){
            _.forEach(images,function(image){
                var imagePath = '/rooms/'+image;
                db.images.findOne({name : image},function(err,existingImage){
                    if(err) log.error( 'Could not get existing users' + err);
                    if(_.isEmpty(existingImage)){
                        db.images.insert({name : image , path : imagePath ,usage :'rooms' , rotation : 0},function(err,newImage){
                            if(err) log.error( 'Could not get existing images' + err);
                        })
                    }
                });
            });
        });
    }

};
