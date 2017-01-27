/**
 * Created by jbblanc on 09/01/2016.
 */

angular.module('homFi')
  .controller('registerCtrl', ['$window','$scope', '$state', 'auth','message', function ($window,$scope, $state, auth,message) {
    if (auth.isAuthenticated()) {
      $state.go('user.main');
    }

      $scope.images = [
          "../images/panel.jpg"
      ];


    // Initialize User
    $scope.user = {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    };

    // Scope function to perform actual register request to server
    $scope.register = function (isValid) {
      if(isValid){
        auth
          .register($scope.user)
          .then(
            function() {
              $state.go('user.main');
            }
          );
      }

    };
  }]);
