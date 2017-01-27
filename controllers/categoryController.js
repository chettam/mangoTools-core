/**
 * Created by jbblanc on 20/05/2016.
 */
const uuid = require('uuid')
const db = require('../config/db').db
const _ = require('lodash')
const io = require('../helpers/io').io

module.exports = function(app){
  /**
   * return  a list of categories. Authentication required
   */
    app.get('/api/auth/category', function(req, res){
        db.categories.find({}, function (err, categories) {
            return res.status(200).json(categories);
        });
    });
    /**
     * return  a list of categories . Authentication required
     */
    app.get('/api/auth/category', function(req, res){
        db.categories.find({}, function (err, categories) {
            return res.status(200).json(categories);
        });
    });
    /**
     * return  a category . Authentication required
     */
    app.get('/api/auth/category/:id', function(req, res){
        db.categories.findOne({_id :req.params.id}, function (err, category) {
            if (err) {
                return res.status(401).json({err: err});
            }
            return res.status(200).json(category);
        });
    });
    /**
     * create  a category then return it . Authentication required
     */
    app.post('/api/auth/category', function(req, res){
        db.categories.insert(req.body, function (err, category) {
            if (err) {
                return res.status(401).json({err: err});
            }
            if (category) {
                return res.status(200).json(category);
            }
        });
    });
    /**
     * create or update  a category then return it . Authentication required
     */
    app.post('/api/auth/category/createUpdate', function(req, res){
        db.categories.findOne({_id : req.body._id},function(err,category){
            if (err) {
                return res.status(401).json({err: err});
            }
            if(category){
                _.merge(category, req.body);
                db.categories.update({_id : category._id},category,function(err,numupdated){
                    io.sockets.emit('category', { verb :'updated', uid :category.uid , data : category});
                    return res.status(200).json(category);
                })
            } else{
                req.body.uid = uuid.v4();
                db.categories.insert(req.query,function(err,category){
                    if (err) {
                        return res.json(err.status, {err: err});
                    }
                    if (category) {
                        io.sockets.emit('category', { verb :'created', uid :category.uid , data : category});
                        return res.status(200).json(category);
                    }
                })
            }
        })
    });
};
