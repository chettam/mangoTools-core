/**
 * Created by jbblanc on 09/01/2016.
 */

angular.module('homFi')
  .controller('coreCtrl',[ '$rootScope','$http', '$scope','rest','currentUser','message', function ($rootScope,$http,$scope,rest,currentUser,message) {
      $scope.core = {
        serialNumber : '',
        cloudAuth : ''
      };


    $scope.getCores = function(){
      $http.get(rest.parseEndPointUrl('api/core'))
        .success(function (cores) {
          $scope.cores = cores;
         
        }).error(function (error) {
        message.error(error);
      });
    };

    $scope.getCores();
    

    $scope.deleteDetail = function(info){
      //$http.post('',{"del_id":info.id}).success(function(data){
      };

    $scope.show_form = true;

    $scope.createCore = function(isValid){
      if(isValid && currentUser){
          $http.post(rest.parseEndPointUrl('api/core'), $scope.core)
            .success(function (response) {
              
             $scope.getCores();
            }).error(function (error) {
            message.error(error);
          });
      }
    };

    $scope.updateCore = function(isValid) {
      if (isValid && currentUser) {
        $http.post(rest.parseEndPointUrl('api/core') + '/'+ $scope.core.id, $scope.core)
          .success(function (response) {

          }).error(function (error) {
          message.error(error);
        });
      }
    }

  }]);
