/**
 * Created by jbblanc on 09/01/2016.
 */

angular.module('homFi')
  .controller('forgotPasswordCtrl',['$window','$scope', '$state', 'auth','message','currentUser',function ($window,$scope, $state, auth,message,currentUser) {
    // Already authenticated so redirect back to books list
    if (auth.isAuthenticated()) {
      $state.go('user.main');
    }

      $scope.images = [
          "../images/panel.jpg",
          "../images/spiceLivingRoom.jpg",
          "../images/spiceRoom.jpg"
      ];

    // Initialize credentials
    $scope.credentials = {
      email: ''
    };

    // Scope function to perform actual login request to server
    // $scope.login = function(isValid) {
    //   if(isValid){
    //     auth
    //       .login($scope.credentials)
    //       .then(
    //         function() {
    //           $state.go('user.main');
    //         }
    //       );
    //   }
    //
    // };
  }]);
