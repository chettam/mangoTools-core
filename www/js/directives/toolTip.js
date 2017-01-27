/**
 * Created by temii on 09/12/2016.
 */
angular.module('homFi')
  .directive('tooltip', [function () {
    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        $(element).hover(function(){
          // on mouseenter
          $(element).tooltip('show');
        }, function(){
          // on mouseleave
          $(element).tooltip('hide');
        });
      }
    };
  }]);
