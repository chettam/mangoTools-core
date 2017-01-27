/**
 * Created by jbblanc on 11/01/2016.
 */
angular.module('homFi')
  .controller('topNavCtrl',['$scope','auth',function ($scope,auth) {
    $scope.logout = function(){
      auth.logout();
    };

    $scope.inviteFriends = function () {

        swal({
            title: "Invite friends!",
            text: "Enter email address:",
            type: "input",
            showCancelButton: true,
            confirmButtonColor: "#8060a6",
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Email"
        }, function(inputValue){
            if (inputValue === false)
                return false;
            if (inputValue === "") {
                swal.showInputError("You need to enter an email!");
                return false
            }
            swal({
                title: "Sweet!",
                text: "Invitation sent to : " + inputValue + ", thanks :) ",
                confirmButtonColor: "#8060a6",
                imageUrl: "images/thumbs-up.jpg" });
        });



    };

  }]);
