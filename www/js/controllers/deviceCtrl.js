/**
 * Created by jbblanc on 09/01/2016.
 */

angular.module('homFi')
    .controller('deviceCtrl',[ '$rootScope','$scope','rest', function ($rootScope,$scope, rest) {

        $scope.device ={};
        $scope.selectedDevice = {};
        $scope.devices =[];

        rest.get('/api/auth/device',function(devices){
            $scope.devices = devices;
        });

        rest.get('/api/auth/room',function(rooms){
            $scope.rooms = rooms;
        });

        $scope.selectDevice = function (device) {
            $scope.idSelectedDevice = device._id;
            $scope.selectedDevice = device;
            $scope.$broadcast('selectedDevice', device);
        };

        $scope.updateDevice = function(device){
            device.lock = true
            rest.createOrUpdate('/api/auth/device',device,function(){
                rest.get('/api/auth/device',function(devices){
                    $scope.devices = devices;
                });
            });
        };
        $scope.pageNumber = {
            currentPage: 0,
            offset: 0,
            pageLimit: 10,
            pageLimits: ['20', '30', '100']
        };

    }]);
