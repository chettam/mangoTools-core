/**
 * Created by jbblanc on 19/05/2016.
 */
const Datastore = require('nedb');
var db = {};

db.categories   = new Datastore({ filename: __dirname +'/../db/categories.db'  , autoload: true });
db.clients      = new Datastore({ filename: __dirname +'/../db/clients.db'     , autoload: true });
db.connections  = new Datastore({ filename: __dirname +'/../db/connections.db' , autoload: true });
db.devices      = new Datastore({ filename: __dirname +'/../db/devices.db'     , autoload: true });
db.images       = new Datastore({ filename: __dirname +'/../db/images.db'      , autoload: true });
db.rooms        = new Datastore({ filename: __dirname +'/../db/rooms.db'       , autoload: true });
db.users        = new Datastore({ filename: __dirname +'/../db/users.db'       , autoload: true });


/**
 *  define NEDB indexes for faster queries 
 */
db.users.ensureIndex({ fieldName: 'email', unique :true }, function (err) {});
db.images.ensureIndex({ fieldName: 'name', unique :true }, function (err) {});
db.rooms.ensureIndex({ fieldName: 'name', unique :true }, function (err) {});
db.clients.ensureIndex({ fieldName: 'serial', unique :true }, function (err) {});



module.exports = {
    db : db
};
