/**
 * Created by numminorihsf on 20.05.15.
 */

function Img (imgData){
  this.$ = imgData;
  this.width = imgData.width;
  this.height = imgData.height;
  this.timeout = null;
  this.callback = null;
  this.lastSize = 0;
  this.set = new Set();
  this.hash = {};
  return this;
}

Img.prototype.getColor = function(x,y){
  var base = (y*this.width+x)*4;
  return {
    r: this.$.data[base],
    g: this.$.data[base+1],
    b: this.$.data[base+2]
  };
};

Img.prototype._getKey = function(x, y){
	return x + '/' + y;
};

Img.prototype._getX = function(key){
	return parseInt(key);
}

Img.prototype._getY = function(key){
	return parseInt(key.replace(/.*\//, ''));
}

Img.prototype.setColor = function(x,y,color){
  var base = (y*this.width+x)*4;
  this.$.data[base] = color.r;
  this.$.data[base+1] = color.g;
  this.$.data[base+2] = color.b;
  return this;
};

Img.prototype.isTheSame = function(colorOne, colorTwo){
	if (colorOne.r !== colorTwo.r) return false;
	if (colorOne.b !== colorTwo.b) return false;
	if (colorOne.g !== colorTwo.g) return false;
	return true;
}

Img.prototype.isOutOfRange = function(x,y){
	if (x < 0) return true;
	if (y < 0) return true;
	if (x > this.$.width - 1) return true;
	if (y > this.$.height - 1) return true;
	return false;
}



Img.prototype._fill = function(x, y, colorOld, colorNew){
	if (this.isOutOfRange(x,y)) return this;
	var key = this._getKey(x,y);
	if (this.set.has(key)) return this;
	clearTimeout(this.timeout);
	var self = this;
	this.timeout = setTimeout(function(){
		self.set.forEach(function(v){
			self.setColor(self._getX(v),self._getY(v), colorNew);
		});
		return self.callback();
	},150);
  var before = this.getColor(x, y);
  if (this.isTheSame(before, colorOld)) {
    //console.log(x,y, before, colorOld, colorNew);
    this.set.add(key);
    setTimeout(function recursion(){
	//	console.log(self.set.size)
      self._fill(x - 1, y, colorOld, colorNew)
        ._fill(x + 1, y, colorOld, colorNew)
        ._fill(x, y - 1, colorOld, colorNew)
        //._fill(x+1, y +1, colorOld, colorNew)
        //._fill(x-1, y - 1, colorOld, colorNew)
        //._fill(x+1, y - 1, colorOld, colorNew)
        //._fill(x-1, y + 1, colorOld, colorNew)
        ._fill(x, y + 1, colorOld, colorNew);
    },0);
  }
  return this;
};

Img.prototype.fill = function(x,y,color, callback){
  this.callback = callback;
  var red,blue,green;
  if (typeof color === 'string'){
    red = parseInt(color.slice(0,2),16);
    green = parseInt(color.slice(2,4),16);
    blue = parseInt(color.slice(4,6),16);
  }
  this.set = new Set();
  var before = this.getColor(x,y);
  return this._fill(x, y, before, {r: red,b:blue,g:green}, 0);
};

