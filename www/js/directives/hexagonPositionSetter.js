/**
 * Created by tokwii on 7/29/16.
 */

angular.module('homFi')
    .directive('hexagonPositionSetter',['Hexagon','tileSize','$interval', function ( Hexagon, tileSize, $interval) {
        return {
            restrict: 'E',
            scope: false,
            link: function link(scope, element) {
                scope.stylePaddingLeft, scope.stylePaddingTop, scope.styleBorderLeft, scope.styleBorderTop
                scope.htmlTop, scope.htmlTop;
                scope.hexagons = [];
                scope.selection = null;
                scope.dragging = false;
                scope.isValid = false;
                scope.dragoffx = 0;
                scope.dragoffy = 0;
                scope.selectedDevice = null;
                scope.setDevice = null;
                scope.roomDevices = {'devices': {}};

                /* Retrieve Selected  Devices */
                scope.$parent.setSelectedDevice = function(selectedDevice){
                   scope.selectedDevice = selectedDevice.name;
                };

                /* Update Set Size */
                scope.$parent.updateDeviceSize = function(size){
                    console.log('Set Device ........!!!');
                    console.log(scope.setDevice)
                    if( scope.setDevice !== null){
                        scope.setDevice.hexSize = size.name;
                        scope.setDevice.curvedRadius = tileSize[size.name].curvedRadius;
                        scope.setDevice.size = tileSize[size.name].size;
                        scope.isValid = false;
                        
                    }
                };

                scope.$on('selectedRoom', function(event, data){
                    scope.roomDevices = data;
                    scope.roomDevices['devices'] = {};

                });
                scope.$on('setDevice', function(event, data){
                    _.find(scope.hexagons, function(o) {
                        if(o.device !== data ){
                            o.fillColor = '#8263a6';
                            o.strokeColor = '#8263a6';
                        }else{
                            o.fillColor = '#feaa56';
                            o.strokeColor = '#feaa56';
                            scope.setDevice = o;
                        }});
                    scope.isValid = false;
                });

                scope.createCanvas = function() {
                    element.find("canvas").remove();
                    scope.canvas = document.createElement('canvas');
                    scope.canvas.width = 1270*0.65;
                    scope.canvas.height = 720*0.65;
                    element[0].insertBefore(scope.canvas, element[0].firstChild);
                    scope.context = scope.canvas.getContext('2d');
                    scope.$canvas = element.find('canvas');
                    angular.element(scope.canvas).addClass('positionSetter');

                    // Get the exact area of the canvas for accurate mouse click events
                    if (document.defaultView && document.defaultView.getComputedStyle){
                        scope.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(scope.canvas, null)['paddingLeft'], 10)      || 0;
                        scope.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(scope.canvas, null)['paddingTop'], 10)       || 0;
                        scope.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(scope.canvas, null)['borderLeftWidth'], 10)  || 0;
                        scope.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(scope.canvas, null)['borderTopWidth'], 10)   || 0;
                        scope.htmlTop = document.body.parentNode.offsetTop;
                        scope.htmlLeft = document.body.parentNode.offsetLeft;
                    }
                };

                scope.clearCanvas = function (){
                    scope.context.clearRect(0,0, scope.canvas.width ,scope.canvas.height);
                };

               scope.getMouse = function(e) {
                   var element = scope.canvas, offsetX = 0, offsetY = 0, xCord, yCord;
                   // Iterates through elements adding offset
                   if (element.offsetParent !== undefined) {
                       do {
                           offsetX += element.offsetLeft;
                           offsetY += element.offsetTop;
                       } while ((element = element.offsetParent));
                   }
                   offsetX += scope.stylePaddingLeft + scope.styleBorderLeft + scope.htmlLeft;
                   offsetY += scope.stylePaddingTop + scope.styleBorderTop + scope.htmlTop;

                   xCord = e.pageX - offsetX;
                   yCord = e.pageY - offsetY;
                   return {x: xCord, y: yCord};

               };

                scope.createCanvas();
                scope.canvas.style.cursor = 'crosshair';
                // Ensure that this  Canvas is only selected
                scope.canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
                
                scope.canvas.addEventListener('dblclick', function(e) {
                    var x = scope.getMouse(e).x,
                        y = scope.getMouse(e).y,
                        removed = false,
                        deviceExists;
                    scope.hexagons.forEach(function(hexagon, index, hexagons){
                        if(hexagon.hasPoint([x,y])){
                            hexagons.splice(index, 1);
                            delete scope.roomDevices['devices'][hexagon.device];
                            removed = true;
                            scope.selection = null;
                            scope.isValid = false;
                            return;
                        }
                    });
                    deviceExists =  _.some(scope.hexagons, function(hexagon){
                        return hexagon.device === scope.selectedDevice;
                    });
                    if(!removed && !deviceExists && scope.selectedDevice !== null){
                        // TODO logic to check whether device is selected
                        var  hex = new Hexagon( scope.context, 'small', x,y, scope.selectedDevice);
                        hex.draw();
                        scope.hexagons.push(hex);
                    }
                    
                }, true);

                scope.canvas.addEventListener('mousedown', function(e) {
                    var mouse = scope.getMouse(e);
                    var mx = mouse.x;
                    var my = mouse.y;
                    var hexagonSelected = false;
                    scope.hexagons.forEach(function(hexagon){
                        if(hexagon.hasBorder){
                            hexagon.hasBorder = false;
                        }

                        if(hexagon.hasPoint([mx,my])){
                            scope.dragoffx = mx - hexagon.xCenter;
                            scope.dragoffy = my - hexagon.yCenter;
                            scope.dragging = true;
                            scope.selection = hexagon;
                            scope.selection.hasBorder = true;
                            hexagonSelected = true;
                            scope.isValid = false;
                            return;
                        }

                    });


                    if (!hexagonSelected && scope.selection !== null) {
                        scope.selection.hasBorder = false;
                        scope.isValid = false;
                    }
                }, true);

                scope.canvas.addEventListener('mousemove', function(e) {
                    //console.log("Mouse Moving .....");
                    //console.log(scope.dragging);
                    if(scope.dragging) {
                       var  mouse = scope.getMouse(e);
                        scope.selection.xCenter = mouse.x - scope.dragoffx;
                        scope.selection.yCenter = mouse.y - scope.dragoffy;
                        scope.isValid = false;
                    }
                    },true);

                scope.canvas.addEventListener('mouseup', function(e) {
                    scope.dragging = false;
                }, true);

                scope.init = function(){
                    var  hex = new Hexagon( scope.context, 'medium', scope.canvas.width/2 , scope.canvas.height/2, scope.selectedDevice);
                    hex.draw();
                    hex.device = 'hifi';
                    scope.hexagons.push(hex);

                };


                scope.draw = function() {
                    // Redraw the Canvas if state is invalid
                    if (!scope.isValid) {
                        scope.clearCanvas();
                        scope.hexagons.forEach(function (hexagon) {
                            hexagon.draw();
                        });
                        scope.isValid = true;
                    }
                };
                scope.init();
               $interval(function() {
                   console.log('Re drawing ..');
                   scope.draw();
                   scope.hexagons.forEach(function(hexagon){
                       scope.roomDevices['devices'][hexagon.device] = {   position :{x: hexagon.xCenter, y: hexagon.yCenter},
                                                           size: hexagon.hexSize }

                   });
                }, 30);


            }
        }
    }]);