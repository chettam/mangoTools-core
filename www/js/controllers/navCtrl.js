/**
 * Created by jbblanc on 11/01/2016.
 */
angular.module('homFi')
  .controller('navCtrl',['$scope','currentUser','auth',function ($scope,currentUser,auth) {
    $scope.currentUser = currentUser.get();

    $scope.logout = function(){
      auth.logout();
    }
    
  }]);
