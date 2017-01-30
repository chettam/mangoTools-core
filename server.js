/**
 * Created by jbblanc on 19/05/2016.
 */
 const async = require('async')
 const express = require('express')
 const app = express()
 const cors = require('cors');
 const bodyParser = require('body-parser');
 const config = require('./config');
 const http = require('http').Server(app);
 const recursive = require('recursive-readdir');
 const jsonfile = require('jsonfile');
 const requireApiKey = require('./policies/requireApiKey');
 const requireToken = require('./policies/requireToken');
 const requireSocket =  require('./policies/requireSocket');
 const image = require('./helpers/image');
 const ipc = require('./helpers/ipc');
 const processManager = require('./helpers/processManager');
 const log = require('./config/log').logger;
 const io = require('./helpers/io')(http)




/**
* Display  Splash Screen
*/

function splashScreen (){
log.info(' ');
log.info('███╗   ███╗ █████╗ ███╗   ██╗ ██████╗  ██████╗     ████████╗ ██████╗  ██████╗ ██╗     ███████╗');
log.info('████╗ ████║██╔══██╗████╗  ██║██╔════╝ ██╔═══██╗    ╚══██╔══╝██╔═══██╗██╔═══██╗██║     ██╔════╝');
log.info('██╔████╔██║███████║██╔██╗ ██║██║  ███╗██║   ██║       ██║   ██║   ██║██║   ██║██║     ███████╗');
log.info('██║╚██╔╝██║██╔══██║██║╚██╗██║██║   ██║██║   ██║       ██║   ██║   ██║██║   ██║██║     ╚════██║');
log.info('██║ ╚═╝ ██║██║  ██║██║ ╚████║╚██████╔╝╚██████╔╝       ██║   ╚██████╔╝╚██████╔╝███████╗███████║');
log.info('╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝        ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝╚══════╝');
log.info(' ');
log.info('======================================================');
log.info('Serial Number :   ' + config.serialNumber);
log.info('TCP PORT      :   ' + config.port);
log.info('Api Key       :   ' + config.apiKey);
log.info('Environment   :   ' + process.env.NODE_ENV || 'development');

// Display safety information on using default secrets in Prod
if(process.env.NODE_ENV === 'production' && config.serialNumber === '2b359efb-3a98-4c52-9e45-05553df4d65b' ) log.error('Do not used the  default serial number in production!')
if(process.env.NODE_ENV === 'production' && config.apiKey === 'H7F2vPZnCFLECLZQKF4z7bnvJqhk2VnkXcF9' ) log.error('Do not used the  default apiKey in production!')
}

/**
* Search for installed usable services
*/

function availableServices(cb){

  log.info('======================================================');
  log.info('Detecting available services                          ');
  log.info('======================================================');


  async.waterfall([
      function(callback){
          recursive(__dirname +'/services', ['*.js', 'node_modules','.*'], function (err, files) {
              callback(err,files)
          });
      },
      function(files,callback){
          async.each(files, function(file, cb) {
              if(file.match(/config.js/)){
                  jsonfile.readFile(file, function(err, serviceDefinition) {
                      if(serviceDefinition){
                          log.debug('New services found : '+ JSON.stringify(serviceDefinition));
                          config.services.push(serviceDefinition);
                      }
                      cb()
                  })
              } else {
                  cb()
              }

          }, function(err) {
              callback()
          });
      }], function () {
        cb()
  });
}

/**
 *  Handle cors and body parser request
 */

app.use(cors());
app.use(bodyParser.json());


/**
* Enable API security:
* Each /api/auth route requires a valid Web token to be access
*/
app.use('/api/auth/*',requireToken);


/**
*  Load express routing
*/

require('./config/router')(app);



app.use(express.static('www'));



http.listen(config.port, function() {
    splashScreen();
    availableServices(function(){
      image.start();
      ipc.start();
      processManager.start();
    });


});
