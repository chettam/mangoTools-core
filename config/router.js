/**
 * Created by jbblanc on 19/05/2016.
 */


module.exports = function(app){
    require('../controllers/apiKeyController')(app);
    require('../controllers/categoryController')(app);
    require('../controllers/clientController')(app);
    require('../controllers/cnxController')(app);
    require('../controllers/deviceController')(app);
    require('../controllers/imageController')(app);
    require('../controllers/roomController')(app);
    require('../controllers/serviceController')(app);
    require('../controllers/stateController')(app);
    require('../controllers/userController')(app);
};