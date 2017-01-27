/**
 * Created by jbblanc on 09/01/2016.
 */

angular.module('homFi')
  .controller('categoriesCtrl',[ '$rootScope','$scope','currentUser','rest', function ($rootScope,$scope,currentUser,rest) {


      $scope.category ={};
      $scope.selectedCategory = {};
      $scope.categories =[];

      rest.get('/api/auth/category',function(category){
          $scope.category = category
      });

      $scope.selectCategory = function(Category){
          $scope.idSelectedCategory = Category._id;
          $scope.selectedCategory = Category;
          $scope.$broadcast('selectedCategory', Category);
      };

      $scope.deleteCategory = function(connection){
          rest.delete('/api/auth/category',connection,function(){
              rest.get('/api/auth/category',function(category){
                  $scope.category = category
              });
          });
      };

      $scope.updateCategory = function(connection){
          rest.createOrUpdate('/api/auth/category',connection,function(){
              rest.get('/api/auth/category',function(category){
                  $scope.category = category
              });
          });
      };

      $scope.pageNumber = {
          currentPage: 0,
          offset: 0,
          pageLimit: 10,
          pageLimits: ['15', '25', '50']
      };


   /* $scope.updateCategories = function(isValid){
      if(isValid && currentUser){
              $http.post(rest.parseEndPointUrl('api/category') + '/'+ $scope.category.Name, $scope.category.catId)
                  .success(function (response) {
                  }).error(function (error) {
                  message.error(error);
              });
      }
    };*/
  }]);
