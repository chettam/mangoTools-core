const log = require('../config/log').logger;
const requireSocket = require('../policies/requireSocket');
const ipc = require('./ipc');
var io = {};



module.exports = function(http){

io = require('socket.io')(http);
io.use(requireSocket);


io.sockets.on('connection', function (socket) {
    socket.on('/api/auth/state/execute',function(data){
        ipc.send(data);
    });
});

};
module.exports.io = io;

