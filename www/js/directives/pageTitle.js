/**
 * Created by jbblanc on 11/01/2016.
 */


angular.module('homFi')
  .directive('pageTitle',['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
      link: function(scope, element) {
        var listener = function(event, toState, toParams, fromState, fromParams) {
          // Default title - load on Dashboard 1
          var title = 'Mango Tools | Simply Control';
          // Create your own title pattern
          if (toState.data && toState.data.pageTitle) title = 'Mango Tools | ' + toState.data.pageTitle;
          $timeout(function() {
            element.text(title);
          });
        };
        $rootScope.$on('$stateChangeStart', listener);
      }
    }
  }]);
