/**
 * Created by jbblanc on 16/05/2016.
 */
const ipc = require('node-ipc')
const db = require('../config/db').db
const log = require('../config/log').logger
const states = require('../config').states
var clients = {};

ipc.config.id   = 'homfi';
ipc.config.retry= 1500;
ipc.config.silent = true ;


ipc.serve(
    function(){

      ipc['server'].on('register',function(data,socket){
        if(!clients[data.uid]) clients[data.uid] ={};
        clients[data.uid] = socket;
      });

      ipc['server'].on('message',function(data,socket){
        ipc['server'].emit(socket,'message',data+' world!');
      });


      ipc['server'].on('cnx:get',function(data,socket){
        db.connections.findOne({uid : data.uid },function(err,cnx){
          ipc['server'].emit(socket,'cnx:get',cnx);
        });
      });

      ipc['server'].on('cnx:update',function(data,socket){
        db.connections.update({uid : data.uid},data);
      });


      ipc['server'].on('category:set',function(category,socket){
        if (!category.name) category.name = 'discovered';
        db.categories.findOne({name: category.name}, function (err, existingCategory) {
          if (err) {
            log.error('Failed to find Category : ' + err);
            return callback(err);
          }
          if (!_.isEmpty(existingCategory)) {
            _.assign(existingCategory, category);
            io.sockets.emit('category', { verb :'updated', uid :existingCategory.uid , data : existingCategory});
            db.categories.update({uid : existingCategory.uid},existingCategory);
          } else {
            io.sockets.emit('category', { verb :'created', uid :category.uid , data : category});
            db.categories.insert(category);
          }
        });
      });

      ipc['server'].on('room:set',function(room,socket){
        if(room.uid)  delete room.uid;
        if(!room.name) room.name = 'discovered';

        db.rooms.findOne({name : room.name},function(err,existingRoom){
          if(err){
            log.error('Failed to find Room : ' + err);
            return callback(err);
          }
          if(!_.isEmpty(existingRoom)){
            _.assign(existingRoom, room);
            io.sockets.emit('room', { verb :'updated', uid :existingRoom.uid , data : existingRoom});
            db.rooms.update({uid : existingRoom.uid},existingRoom);
          }else {
            io.sockets.emit('room', { verb :'created', uid :room.uid , data : room});
            db.rooms.insert(room);
          }
        });
      });


      ipc['server'].on('device:set',function(device,socket) {

        db.devices.findOne({uid: device.uid}, function (err, existingDevice) {
          if (err) {
            log.error('Failed to find Room : ' + err);
            callback(err);
          }
          else if (!_.isEmpty(existingDevice)) {
            if (!existingDevice.lock && existingDevice.hasOwnProperty('room')) delete existingDevice.room;
            if (!existingDevice.lock &&existingDevice.hasOwnProperty('category')) delete existingDevice.category;
            _.assign(existingDevice, device);
            db.devices.update({uid : existingDevice.uid},existingDevice);
            io.sockets.emit('device', { verb :'updated', uid :existingDevice.uid , data : device});
          } else {
            db.devices.insert(device);
            io.sockets.emit('device', { verb :'created', uid :device.uid , data : device});
          }
        });
      });


      ipc['server'].on('state:set',function(newStates,socket) {

        _.forEach(newStates,function(state){
          states[state.uid] = state;
          io.sockets.emit('state', { verb :'created', uid :states[state.uid].uid , data : states[state.uid]});
        });
      });

      ipc['server'].on('state:update',function(update,socket) {
        if(states[update.uuid] && (update.hasOwnProperty('value')|| update.hasOwnProperty('text') || update.hasOwnProperty('uuidIcon'))){
          if(update.hasOwnProperty('value')) states[update.uuid].value = update.value;
          if(update.hasOwnProperty('text'))  states[update.uuid].text = update.text;
          if(update.hasOwnProperty('uuidIcon'))  states[update.uuid].uuidIcon = update.uuidIcon;
          io.sockets.emit('state', { verb :'updated', uid :states[update.uuid].uid , data : states[update.uuid]});
          //log.verbose(global.states[update.uuid].uid + ' -->' +global.states[update.uuid].value +':'+global.states[update.uuid].text +':'+global.states[update.uuid].uuidIcon);

        } else {
          //log.verbose('Unkown state : ' +JSON.stringify(update));
        }
      })
    }
);



module.exports ={
  start : function() {
    log.debug('Starting IPC server');
    ipc['server'].start();
  },
  send :function(msg){
    if(msg && msg.state && msg.state.cnx && [msg.state.cnx.uid]){
      log.debug('Sending for execusion');
      log.debug(JSON.stringify(msg));
      ipc.server.emit(clients[msg.state.cnx.uid],'state:update',msg)
    } else {
      log.error('Invalid Execute msg : ' + JSON.stringify(msg));
    }
    //console.log(state)

    //clients[msg.state.cnx.uid].emit('state:update',msg);
  },
  auth : function(cnx){
    ipc.server.emit(clients[cnx.uid],'cnx:auth',cnx)
  }

};
