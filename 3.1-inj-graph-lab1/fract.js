/**
 * Created by numminorihsf on 20.05.15.
 */

(function(){

    function Drawler (context){
        this.context = context;
        context.fillStyle='#fff';
        this.pointArr = [];
        this.iteration = 1;
        this.callbacks = [];
        this.step = 1;
        this.timeout = 2000;
    }

    Drawler.prototype.addPoint = function(x, y){
        this.pointArr.push({x: x, y: y});
    };
    Drawler.prototype.draw = function(callback){
        this.callbacks.push(callback);
        if (this.callbacks.length == this.iteration){
            if (this.iteration === 1) {
                setTimeout(function () {
                    this.__draw();
                    this.spawnCallbacks();
                }.bind(this), 10);
            }
            else {
                var timeout = this.timeout;
                setTimeout(function () {
                    this.__draw();
                    this.spawnCallbacks();
                }.bind(this), timeout);
            }
        }
    };
    Drawler.prototype.spawnCallbacks = function(){
        var cb = this.callbacks;
        this.callbacks = [];
        this.pointArr = [];
        this.newIteration();
        for(var i = 0; i < cb.length; i++){
            cb[i]();
        }
    };
    Drawler.prototype.newIteration = function(multiplier){
        this.iteration *= multiplier || 8;
    };
    Drawler.prototype.__draw = function(){
        if (!this.pointArr.length) return;
        console.log('STEP:', this.step++);

        var mixX = this.pointArr.reduce(function(res,v){
            if (v.x < res) return v.x;
            return res;
        },this.pointArr[0].x);
        var maxX = this.pointArr.reduce(function(res,v){
            if (v.x > res) return v.x;
            return res;
        },this.pointArr[0].x);
        var minY = this.pointArr.reduce(function(res,v){
            if (v.y < res) return v.y;
            return res;
        },this.pointArr[0].y);
        var maxY = this.pointArr.reduce(function(res,v){
            if (v.y > res) return v.y;
            return res;
        },this.pointArr[0].y);

        this.context.fillRect(mixX, minY, Math.abs(maxX - mixX), Math.abs(maxY - minY));
        this.context.beginPath();
        this.context.moveTo(this.pointArr[0].x, this.pointArr[0].y);
        for(var i = 1; i < this.pointArr.length; i++){
            this.context.lineTo(this.pointArr[i].x, this.pointArr[i].y);
        }
        this.context.stroke();
        this.context.closePath();
    };
    Drawler.prototype.setTimeout = function(t){
        this.timeout = t;
    };
    var drawler;

    function Fract(canvasContext, iterationCount, points){
        drawler = drawler || new Drawler(canvasContext);
        this.iterationCount = iterationCount || 10;
        this.canvasContext = canvasContext;
        this.points = points;
        return this;
    }

    Fract.prototype.setTimeout = function(t){
        drawler.setTimeout(t);
    };

    Fract.prototype.draw = function(newIter){
        if (newIter) {
            drawler.iteration = 1;
            drawler.step = 1;
        }
        var x1 = this.points[0].x;
        var y1 = this.points[0].y;
        var x2 = this.points[1].x;
        var y2 = this.points[1].y;
        var xb = x1 + (x2 - x1)/4;
        var yb = y1 + (y2 - y1)/4;
        var xe = x1 + (x2 - x1)*2/4;
        var ye = y1 + (y2 - y1)*2/4;
        var xh = x1 + (x2 - x1)*3/4;
        var yh = y1 + (y2 - y1)*3/4;
        var cos = 0; //90
        var sin = -1;
        var xc = xb + (xe - xb) * cos - sin * (ye - yb);
        var yc = yb + (xe - xb) * sin + cos * (ye - yb);

        var xd = xc + xe - xb;
        var yd = yc + ye - yb;


        sin = 1;
        var xf = xe + (xh - xe) * cos - sin * (yh - ye);
        var yf = ye + (xh - xe) * sin + cos * (yh - ye);
        var xg = xf + xh - xe;
        var yg = yf + yh - ye;

        drawler.addPoint(x1, y1);
        drawler.addPoint(xb, yb);
        drawler.addPoint(xc, yc);
        drawler.addPoint(xd, yd);
        drawler.addPoint(xe, ye);
        drawler.addPoint(xf, yf);
        drawler.addPoint(xg, yg);
        drawler.addPoint(xh, yh);
        drawler.addPoint(x2, y2);
        drawler.draw(function(){
            if (--this.iterationCount > 0){
                var newPoint =  [
                    [{x: x1, y: y1}, {x: xb, y: yb}],
                    [{x: xb, y: yb}, {x: xc, y: yc}],
                    [{x: xc, y: yc}, {x: xd, y: yd}],
                    [{x: xd, y: yd}, {x: xe, y: ye}],
                    [{x: xe, y: ye}, {x: xf, y: yf}],
                    [{x: xf, y: yf}, {x: xg, y: yg}],
                    [{x: xg, y: yg}, {x: xh, y: yh}],
                    [{x: xh, y: yh}, {x: x2, y: y2}]
                ];
                for(var i = 0; i < newPoint.length; i++){
                    (function(points) {
                        var a = new Fract(this.canvasContext, this.iterationCount, points);
                        a.draw();
                    }.bind(this))(newPoint[i]);
                }
            }
            else drawler = null;
        }.bind(this));

    };
    window.Fract = Fract;
    return Fract;
})();