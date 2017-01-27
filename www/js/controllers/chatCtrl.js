/**
 * Created by togunrek on 9/1/16.
 */

angular.module('homFi')
    .controller('chatCtrl',['$scope','currentUser','auth',function ($scope,currentUser,auth) {
        $scope.currentUser = currentUser.get();
        

    }]);