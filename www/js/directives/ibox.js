/**
 * Created by jbblanc on 11/07/2016.
 */
angular.module('homFi')
  .directive('ibox', [function () {
    return {
      restrict: 'E',
      replace: true,
      link: function (scope, element, attrs) {
        angular.element(document.querySelector('.collapse-link')).click(function () {
          var ibox = angular.element(this).closest('div.ibox');
          var button = angular.element(this).find('i:first');
          var content = ibox.find('div.ibox-content');
          content.slideToggle(200);
          button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
          ibox.toggleClass('').toggleClass('border-bottom');
          setTimeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
          }, 50);
        });

        // Function for close ibox
         angular.element(document.querySelector('.close-link')).click(function () {
           var ibox = angular.element(this).closest('div.ibox');
           ibox.remove();
         });
        
      }
    }
  }]);
