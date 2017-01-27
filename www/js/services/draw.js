angular.module('homFi')
    .factory('Hexagon', [ 'tileSize', function (tileSize) {

        var getPoints =  function(canvas, curvedRadius, size, xCenter, yCenter, hasBorder, fillColor, strokeColor, callback){
            var numberOfSides = 6;
            var hexPoints = [];
            for (var i = 1; i <= numberOfSides; i++) {
                var x = xCenter + size * Math.cos(i * 2 * Math.PI / numberOfSides);
                var y = yCenter + size * Math.sin(i * 2 * Math.PI / numberOfSides);
                hexPoints.push(x,y)
            }
            callback(null, canvas, curvedRadius, hexPoints, hasBorder, fillColor, strokeColor);
        };

        var roundedPath = function (canvas, curvedRadius, points, hasBorder, fillColor, strokeColor, callback) {
            var deltaX = points[1] - points[3];
            var startX = points[0] - deltaX / 2 - curvedRadius / 2;
            var startY = points[1];
            canvas.beginPath();
            canvas.moveTo(startX, startY);

            var x1, y1, x2, y2;
            x2 = points[2];
            y2 = points[3];
            for (var i = 4; i < points.length; i = i + 2) {
                x1 = x2;
                y1 = y2;
                x2 = points[i];
                y2 = points[i + 1];
                canvas.arcTo(x1, y1, x2, y2, curvedRadius);
            }
            /* Close Path */
            canvas.arcTo(x2, y2, points[0], points[1], curvedRadius);
            canvas.arcTo(points[0], points[1], startX, startY, curvedRadius);

            /* Hexagon Styling */
            if(hasBorder){
                canvas.strokeStyle = '#9b9f78';
                canvas.lineWidth = 5;

            }else{
                canvas.strokeStyle = strokeColor;

            }
            canvas.fillStyle = fillColor;
            canvas.fill();
            canvas.stroke();
            canvas.closePath();
            callback(null, canvas);
        };

        function Hexagon (canvas, hexSize, xCenter, yCenter, device, fillColor, strokeColor){
            this.xCenter = xCenter;
            this.yCenter = yCenter;
            this.canvas = canvas;
            this.hexSize = hexSize;
            this.curvedRadius = tileSize[this.hexSize].curvedRadius;
            this.size = tileSize[this.hexSize].size;
            this.hexPoints = [];
            this.hasBorder = false;
            this.device = device;
            this.fillColor = fillColor;
            this.strokeColor = strokeColor;
        }


        Hexagon.prototype.draw = function(){
            var canvas = this.canvas, curvedRadius = this.curvedRadius, size = this.size,
                xCenter = this.xCenter, yCenter = this.yCenter, hasBorder = this.hasBorder,
                device = this.device, fillColor = this.fillColor || '#8263a6', strokeColor = this.strokeColor || '#8263a6';
               var points = [];
            async.waterfall([
                function(callback) {
                        getPoints(canvas, curvedRadius, size, xCenter, yCenter, hasBorder, fillColor, strokeColor,
                            function (err, canvas, curvedRadius, hexPoints) {
                                points = hexPoints;
                                callback(null, canvas, curvedRadius, hexPoints, hasBorder);
                        })
                },
                function(canvas, curvedRadius, hexPoints, hasBorder, callback) {
                    roundedPath(canvas, curvedRadius, hexPoints, hasBorder, fillColor, strokeColor, function (err, canvas) {
                        callback(null, canvas, hexPoints);
                    });
                },
               function(canvas, hexPoints, callback){
                   canvas.font = "15px Arial";
                   canvas.textAlign = 'center';
                   canvas.fillStyle = 'black';
                   canvas.fillText(device, xCenter, yCenter);
                   callback(null, canvas);

                }
            ], function (err, canvas) {

            });
            this.hexPoints = points;

        };

        Hexagon.prototype.hasPoint = function(point){
            var x = point[0], y = point[1];
            var polygon =_.chunk(this.hexPoints, 2);
            var inside = false;
            for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                var xi = polygon[i][0], yi = polygon[i][1];
                var xj = polygon[j][0], yj = polygon[j][1];

                var intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        };
        return Hexagon;

}]);
