/**
 * Created by temitope on 01/08/2016.
 */

angular.module('homFi')
    .controller('galleriesCtrl',[ '$rootScope','$scope','currentUser','rest','FileUploader','storage','$window',function ($rootScope,$scope,currentUser,rest,FileUploader,storage,$window) {

        $scope.currentUser = currentUser.get();

        $scope.uploadType = [
            {usage: 'background'},
            {usage: 'categories'},
            {usage: 'room'}
        ];

        $scope.images ={};

        rest.get('/api/auth/image/background',function(images){
            $scope.images = images;
        });

        $rootScope.$on('backgrounds:update',function(){
            $scope.images = {};
            rest.get('/api/auth/image/background',function(images){
                $scope.images = images;
            });
        });

        $scope.deleteImage = function(image){
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover " + image.name,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#8060a6",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel plx!",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm){
                if (isConfirm) {
                    rest.delete('/api/auth/image',image,function(){
                        rest.get('/api/auth/image/background',function(images){
                            $scope.images = images
                        });
                    });
                    swal("Deleted!",
                        "Your picture has been deleted.",
                        "success"
                    );
                } else {
                        swal("Cancelled",
                            "Your imaginary picture is safe :)",
                            "error");
                    }
            });
        };

        $scope.uploader = new FileUploader({
            url : 'http://mangotools.local:1410/api/auth/image',
            headers : {
                //apiKey : storage.get('apiKey'),
                Authorization : 'Bearer ' + angular.fromJson(storage.get('auth_token')).token
            }
        });

        $scope.uploader.removeAfterUpload = true;

        $scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

        $scope.uploader.onWhenAddingFileFailed = function(item, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        $scope.uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        $scope.uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        $scope.uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        $scope.uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        $scope.uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            swal({
                title: "Sweet!",
                text: "Upload successful",
                imageUrl: "images/thumbs-up.jpg",
                timer: 2500,
                showConfirmButton: false
            });
            setTimeout(function(){location.reload();},2500);
        };
        $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        $scope.uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        $scope.uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };


        $scope.rotatePicture = function(image,rotation){
            image.rotation = rotation;
            delete image.$$hashKey;
            rest.update('/api/auth/image',image,function(image){
                _.forEach($scope.images,function(currentImage){
                    if(currentImage.id === image.id){
                        currentImage = image;
                    }
                });
            })
        };
    }]);
