/**
 * Created by jbblanc on 11/01/2016.
 */

angular.module('homFi')
    .directive('colorPicker',function () {
      return {
        restrict: 'E',
        template : '<canvas id="picker" width="350" height="350"></canvas>' +
        '<rzslider rz-slider-model="$parent.selectedSwitch.settings.hexagon.opacity" rz-slider-options="sliderObj.options"></rzslider>',
        scope: {
          colorType : '@',
          color: '=',
          borderColor :'='
        },
        link: function link(scope, element) {
          function rgb2hex(rgb){
            rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
          }

          scope.canvas = document.getElementById('picker');
          scope.context= scope.canvas.getContext('2d');
          var image = new Image();
          image.src='images/shadesOfGrey.png';
          image.width =330;
          image.height =330;
          image.onload = function () {
            scope.context.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
          };


          scope.sliderObj = {
            value:  scope.$parent.selectedSwitch && scope.$parent.selectedSwitch.settings && scope.$parent.selectedSwitch.settings.hexagon ?  scope.$parent.selectedSwitch.settings.hexagon.opacity : 100,
            options: {
              floor: 1,
              ceil: 100,
              step: 1,
              id: 'sliderA'
            },
            style: {
              opacity: 0.6
            }
          };


          scope.canvas.addEventListener('click',function(event){
            scope.pixel =  scope.context.getImageData(event.offsetX, event.offsetY, 1, 1).data;
            if(scope.$parent.colorType === 'background'){
              scope.$parent.selectedSwitch.settings.hexagon.color = {'r' :scope.pixel[0],'g' : scope.pixel[1],'b' : scope.pixel[2] };
            } else  if(scope.$parent.colorType === 'border'){
              scope.$parent.selectedSwitch.settings.hexagon.borderColor = {'r' :scope.pixel[0],'g' : scope.pixel[1],'b' : scope.pixel[2]};
            }
            scope.$apply();
          })
        }
      };
    });