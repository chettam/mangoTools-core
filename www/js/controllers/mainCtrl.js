/**
 * Created by jbblanc on 09/01/2016.
 */

angular.module('homFi')
  .controller('mainCtrl',[ '$rootScope','$scope','message','rest','currentUser', function ($rootScope,$scope,message,rest,currentUser) {

    $scope.currentUser = currentUser.get();

    rest.get('/api/auth/room',function(rooms){
      $scope.rooms = rooms
    });

    rest.get('/api/auth/category',function(category){
      $scope.category = category
    });

    rest.get('/api/auth/device',function(devices){
      $scope.devices = devices;
    });

      rest.get('/api/auth/client',function(switches){
          $scope.switches = switches
      });




  }]);
