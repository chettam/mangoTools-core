/**
 * Created by jbblanc on 09/01/2016.
 */

angular.module('homFi')
    .controller('panelCtrl',[ '$rootScope','$scope','message','currentUser', '$timeout','ModalService','rest', function ($rootScope,$scope,message,currentUser, $timeout, ModalService,rest) {

        $scope.panel ={};
        $scope.selectedSwitch = {};
        $scope.switches =[];
        $scope.images ={};
        $scope.currentImage = 0;
        $scope.backgroundSel;


        rest.get('/api/auth/client',function(switches){
            $scope.switches = switches
        });

        rest.get('/api/auth/room',function(rooms){
            $scope.rooms = rooms
        });

        rest.get('/api/auth/image/background',function(backgroundImages){
            $scope.backgroundImages = backgroundImages;
        });

        $scope.toggleColors = function () {
            if ($scope.selectedSwitch.settings && $scope.selectedSwitch.settings.hexagon && $scope.selectedSwitch.settings.hexagon.color) {
                if (!$scope.selectedSwitch.settings.hexagon.color.r) $scope.selectedSwitch.settings.hexagon.color.r = 255;
                if (!$scope.selectedSwitch.settings.hexagon.color.r) $scope.selectedSwitch.settings.hexagon.color.g = 255;
                if (!$scope.selectedSwitch.settings.hexagon.color.r) $scope.selectedSwitch.settings.hexagon.color.b = 255;
                if (!$scope.selectedSwitch.settings.hexagon.opacity) $scope.selectedSwitch.settings.hexagon.opacity = 100;

                $scope.background = "rgba(" + $scope.selectedSwitch.settings.hexagon.color.r + ", "
                    + $scope.selectedSwitch.settings.hexagon.color.g + ", "
                    + $scope.selectedSwitch.settings.hexagon.color.b + ","
                    + $scope.selectedSwitch.settings.hexagon.opacity / 100 + ")";
                console.log($scope.background)
            }
            return $scope.background;
        };

        //update on changes
        $scope.$watch('selectedSwitch',function(){
            $scope.toggleColors();
            rest.update('/api/auth/client',$scope.selectedSwitch,function(){

            })

        },true);

        $scope.selectSwitch = function(panel){
            $scope.idSelectedSwitch = panel._id;
            $scope.selectedSwitch = panel;
        };

        $scope.deleteSwitch = function(panel){

            swal({
                title: "Are you sure?",
                text: "Your panel will be set to factory setting!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#8060a6",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel plx!",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm){
                if (isConfirm) {
                    rest.delete('/api/auth/client',panel,function(){
                        rest.get('/api/auth/client',function(switches){
                            $scope.switches = switches
                        });
                    });
                    swal("Deleted!",
                        "Your imaginary panel has been deleted.",
                        "success"
                    );
                } else {
                    swal("Cancelled",
                        "Your imaginary panel is safe :)",
                        "error"
                    );
                }
            });
        };

        $scope.deleteAccount = function(account) {
            swal({
                title: "Are you sure?",
                text: "We will miss you!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#8060a6",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel plx!",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm){
                if (isConfirm) {
                    rest.delete('/api/auth/user/member', account, function () {
                        rest.get('/api/auth/user', function (users) {
                            $scope.users = users;
                        });
                    });
                    swal("Deleted!",
                        "Your imaginary account has been deleted.",
                        "success"
                    );
                } else {
                    swal("Cancelled",
                        "Your imaginary account is safe :)",
                        "error"
                    );
                }
            });
        };

        //slider for border thickness
        $scope.borderWidth = {
            value: 3,
            options: {
                floor: 0,
                ceil: 7
            }
        };


        $scope.hexPicker = {
            color: ''
        };

        $scope.resetColor = function() {
            $scope.hexPicker = {
                color: '#3667c7'
            };
        };

        $scope.currentUser = currentUser.get();

        //slider for screensaver timeout
        $scope.timeOut = {
            value: 150,
            options: {
                floor: 30,
                ceil: 300,
                step: 20,
                showSelectionBar: true,
                getSelectionBarColor: function(value) {
                    if (value <= 60)
                        return 'red';
                    if (value <= 120)
                        return 'orange';
                    if (value <= 180)
                        return '#6cac8b';
                    return '#8060a6';
                }
            }
        };

        $scope.brightness = {
            value: 100,
            options: {
                floor: 0,
                ceil: 300,
                step: 10,
                showSelectionBar: true,
                getSelectionBarColor: function(value) {
                    if (value <= 50)
                        return 'red';
                    if (value <= 100)
                        return 'orange';
                    if (value <= 200)
                        return '#6cac8b';
                    return '#8060a6';
                }
            }
        };

        $scope.showColor = false;
        $scope.showBorderColor = false;

        $scope.backgroundColor = function() {
            $scope.showBorderColor = false;
            $scope.showColor = !$scope.showColor;
            $scope.colorType =  $scope.showColor ? 'color' : null;
        };
        $scope.borderColor = function() {
            $scope.showColor = false;
            $scope.showBorderColor = !$scope.showBorderColor;
            $scope.colorType =  $scope.showBorderColor ? 'borderColor' : null;
        };

       /* $scope.fontSize = {
            value: 5,
            options: {
                floor: 2,
                ceil: 10,
                step: 1
            }
        };*/


        $scope.colors = ['black','white','red','orange','yellow','green', 'blue','indigo','violet'];
        $scope.defaultColor = $scope.colors[0];
        $scope.fontSize = {
            options: {
                floor: 0,
                ceil: 200,
                step: 10
            }
        };

        $scope.nextButton = function() {
            $scope.currentImage++;
            $scope.backgroundSel = $scope.backgroundImages[$scope.currentImage];

            if ($scope.currentImage > ($scope.backgroundImages.length - 1)) {
                $scope.currentImage = 0;
            }
        };

        $scope.prevButton = function() {
            if ($scope.currentImage > 0) {
                $scope.currentImage--;
                $scope.backgroundSel = $scope.backgroundImages[$scope.currentImage];

                // $scope.currentImage = $scope.images.length - 1;
            }
        };

        $scope.backgroundPic = function () {
            if(!$scope.selectedSwitch.settings.hasOwnProperty('background'))$scope.selectedSwitch.settings.background ={};
            $scope.selectedSwitch.settings.background.path = $scope.backgroundImages[$scope.currentImage].path ;
            $scope.selectedSwitch.settings.background.rotation = $scope.backgroundImages[$scope.currentImage].rotation;
            swal("Good job!",
                "New Background Picture is : " + $scope.backgroundImages[$scope.currentImage].name,
                "success")
        };

        // device serial number
        $scope.serialNumber = function () {
            swal({
                    title: "Serial Number",
                    text: "Enter Serial Number Below :",
                    type: "input",
                    showCancelButton: true,
                    confirmButtonColor: "#8060a6",
                    closeOnConfirm: false,
                    animation: "slide-from-top",
                    inputPlaceholder: "Write something" },
                function(inputValue){
                    console.log(inputValue);
                    if (inputValue === false)
                        return false;
                    if (inputValue === "") {
                        swal.showInputError("Please enter your device serial number!");
                        return false
                    }
                    swal(
                        "Nice!",
                        "Number is : " + inputValue, "success");
                });
        };

        $scope.iconMapping = [
            { name : 'youtube', 'icon' : 'ion-social-youtube'},
            { name : 'twitter', 'icon': 'ion-social-twitter'},
            { name : 'facebook', 'icon': 'ion-social-facebook'},
            { name : 'google', 'icon': 'ion-social-google'},
            { name : 'instagram', 'icon': 'ion-social-instagram-outline'},
            { name : 'whatsapp', 'icon': 'ion-social-whatsapp'},
            { name : 'snapchat', 'icon': 'ion-social-snapchat-outline'},
            { name : 'pinterest', 'icon': 'ion-social-pinterest'},
            { name : 'dribbble', 'icon': 'ion-social-dribbble'},
            { name : 'octocat', 'icon': 'ion-social-octocat'},
            { name : 'github', 'icon': 'ion-social-github'},
            { name : 'rss', 'icon': 'ion-social-rss'},
            { name : 'tumblr', 'icon': 'ion-social-tumblr'},
            { name : 'wordpress', 'icon': 'ion-social-wordpress-outline'},
            { name : 'reddit', 'icon': 'ion-social-reddit-outline'},
            { name : 'skype', 'icon': 'ion-social-skype-outline'},
            { name : 'linkedin', 'icon': 'ion-social-linkedin-outline'},
            { name : 'vimeo', 'icon': 'ion-social-vimeo'},
            { name : 'twitch', 'icon': 'ion-social-twitch'},
            { name : 'buffer', 'icon': 'ion-social-buffer'},
            { name : 'hackernews', 'icon': 'ion-social-hackernews'},
            { name : 'designernews', 'icon': 'ion-social-designernews'},
            { name : 'dropbox', 'icon': 'ion-social-dropbox'},
            { name : 'apple', 'icon': 'ion-social-apple'},
        ];


        $scope.setFilter = function(index) {
            if(!$scope.selectedSwitch.settings.hasOwnProperty('lock') || !$scope.selectedSwitch.settings.lock.hasOwnProperty('selected') ){
                $scope.selectedSwitch.settings.lock ={};
                $scope.selectedSwitch.settings.lock.selected = [];
            }
            if($scope.selectedSwitch.settings.lock.selected.length < 4) {
                $scope.selectedSwitch.settings.lock.selected.push($scope.iconMapping[index].icon)
            }
            $scope.iconsNeeded = 4 - $scope.selectedSwitch.settings.lock.selected.length;
            console.log($scope.iconsNeeded);

        };

        $scope.deleteIcon = function() {
            if($scope.selectedSwitch.settings.lock['selected'].length > 0) {
                $scope.selectedSwitch.settings.lock['selected'].pop();
            }
        };


    }]);
