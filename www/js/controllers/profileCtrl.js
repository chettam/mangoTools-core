/**
 * Created by jbblanc on 12/01/2016.
 */

angular.module('homFi')
  .controller('profileCtrl',[ '$rootScope','$scope','rest','currentUser', function ($rootScope,$scope,rest,currentUser) {

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


      $scope.contactUs = function () {

          swal("Good job!",
              "Yay! homFi Engineer would reach out to you soon!",
              "success")
      };

      

  }]);
