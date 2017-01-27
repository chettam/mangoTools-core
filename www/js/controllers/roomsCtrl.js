/**
 * Created by jbblanc on 09/01/2016.
 */

angular.module('homFi')
  .controller('roomsCtrl',[ '$rootScope','$scope','rest',function ($rootScope,$scope,rest) {
      
    $scope.room ={};
    $scope.selectedRoom = {};
    $scope.rooms =[];
    $scope.showTileSizes = false;
      
    $scope.createRoom = function(isValid){
      if(isValid){
        rest.create('/api/auth/room',$scope.room,function(){
          rest.get('/api/auth/room',function(rooms){
            $scope.rooms = rooms
          });
        })
      }
    };

      $scope.updateRoom = function(connection){
          rest.createOrUpdate('/api/auth/room',connection,function(){
              rest.get('/api/auth/room',function(rooms){
                  $scope.rooms = rooms
              });
          });
      };

    rest.get('/api/auth/room',function(rooms){
      $scope.rooms = rooms
    });
      
    $scope.selectRoom = function(room){
      $scope.idSelectedRoom = room._id;
      $scope.selectedRoom = room;
      $scope.$broadcast('selectedRoom', room);
    };

    $scope.deleteRoom = function(connection){
      rest.delete('/api/auth/room',connection,function(){
        rest.get('/api/auth/room',function(rooms){
          $scope.rooms = rooms
        });
      });
    };
      
    // used to map the table row click with devices processed by the canvas
    $scope.setSelected = function() {
      $scope.selected = this.detail;
    };
      
    $scope.devices = [
      { name: 'hifi' ,style: 'btn-primary'},
      { name: 'blinds' , style: 'btn-primary'},
      { name: 'intercom', style: 'btn-primary' },
      { name: 'lights' , style: 'btn-primary'},
      { name: 'sonos' , style: 'btn-primary'},
      { name: 'oven', style: 'btn-primary' },
      { name: 'bulb' , style: 'btn-primary'},
      { name : 'other', style: 'btn-primary' },
      { name: 'other2', style: 'btn-primary' }
    ];
     $scope.tileSizes = [
         { name: 'small' },
         { name: 'medium'},
         { name: 'large' },
         { name: 'xlarge'}
     ];
      
      $scope.setClass = function(device){
          return  _.find($scope.devices, function(o) { return o.name === device; }).style;
      };

      $scope.changeButtonStyle = function(selectedDevice){
          $scope.$broadcast('setDevice', selectedDevice);
          $scope.devices.forEach(function(device){
              if(device.name === selectedDevice){
                  device.style = 'btn-warning';
              }else{
                  device.style = 'btn-primary';
              }

          });
          $scope.showTileSizes = true;
      };
      $scope.pageNumber = {
          currentPage: 0,
          offset: 0,
          pageLimit: 10,
          pageLimits: ['12', '25', '50']
      };


  }]);
