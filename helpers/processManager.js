/**
 * Created by jbblanc on 16/05/2016.
 */
const log = require('../config/log').logger
let processes = {}
const fork = require('child_process').fork
const config = require('../config/')
const db = require('../config/db').db
const async = require('async')
const _ = require('lodash')



/*
*  Start and handle services processes
*/

function startProcess(cnx){
  log.debug('Started connection : ' + cnx.uid + ' : ' + cnx.kind);
  cnx.port = config.port;
  //var service = {};
  _.forEach(config.services,function(service){
    if(service.kind === cnx.kind){
      //service = newService
      processes[cnx.uid] = fork(__dirname +'/../../modules/'+service.folder +'/index', { env: cnx });
    }
  });

  process.once("exit", function () {
    if(!_.isEmpty(processes)){
      _.forEach(processes,function(value,key){
        value.kill();
      });
    }

  });

  process.once("uncaughtException", function (error) {
    if (process.listeners("uncaughtException").length === 0 && !_.isEmpty(processes)) {
      _.forEach(processes,function(value,key){
        value.kill();
      });
      throw error;
    }
  });


  processes[cnx.uid].on('exit', function () {
    processes[cnx.uid].kill();
  });

  processes[cnx.uid].on("SIGTERM", function() {
    processes[cnx.uid].exit();
  });
}

/*
*  Start services is used to start every control modules for the platform in used
*/

function startServices(callback){
  async.each(config.services, function(service,cb) {
    if(service.autoStart){
      startProcess({uid : service.kind, kind : service.kind})
    }
    cb()
  }, function(err){
    callback(err);
  })
}

/*
*
*/

function start(){
  log.info('======================================================');
  log.info('         Starting processes integration               ');
  log.info('======================================================');
  async.waterfall([
    function(callback){
      startServices(function(){
        callback()
      })
    },
    function(callback) {
      db.connections.find({connected : true},function(err,connections){
        async.each(connections, function(connection, cb) {
          connection.connected =false;
          db.connections.update({_id : connection._id},connection,function(err,cnx){
            cb();
          });
        }, function(err){
          callback(err);
        })
      });

    },
    function(callback) {
      db.connections.find({},function(err,connections){
        if(err) log.error( 'Could not get enabled services' + err);
        _.forEach(connections,function(connection){
          if(connection.enabled){
            startProcess(connection);
          }
        });
        callback(err);
      });
    }
  ]);
};

module.exports = {
  reStart : function(){
    _.forEach(processes,function(value,key){
      value.kill();
    });
    start();
  },
  start : start
};
