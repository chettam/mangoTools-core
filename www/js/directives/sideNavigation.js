/**
 * Created by jbblanc on 11/01/2016.
 */

angular.module('homFi')
  .directive('sideNavigation',['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        // Call the metsiMenu plugin and plug it to sidebar navigation
        $timeout(function(){
          element.metisMenu();
        });
      }
    };
  }]);
