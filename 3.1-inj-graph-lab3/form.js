/**
 * Created by numminorihsf on 20.07.15.
 */
function Form(data){
  this.type = data.type;
  this.coordinates = data.coordinates;

  return this;
}

Form.prototype._drawPolygon = function(canvasContext){
  canvasContext.beginPath();
  canvasContext.moveTo(this.coordinates[0][0], this.coordinates[0][1]);
  for(var i = 1; i < this.coordinates.length; i++){
    canvasContext.lineTo(this.coordinates[i][0], this.coordinates[i][1]);
  }
  canvasContext.lineTo(this.coordinates[0][0], this.coordinates[0][1]);
  canvasContext.stroke();
  canvasContext.closePath();
  return this;
};

Form.prototype._drawDot = function(canvasContext){
  canvasContext.fillRect(this.coordinates[0][0], this.coordinates[0][1],1,1);
  return this;
};

Form.prototype.getCoordinates = function(){
  return this.coordinates.map(function(v){
    return [v[0], v[1]];
  });
};

Form.prototype.setCoordinate = function(dotIndex, x, y){
  this.coordinates[dotIndex] = [x, y];
  return this;
};

Form.prototype.draw = function(canvasContext){
  if (this.type === 'polygon') return this._drawPolygon(canvasContext);
  return this._drawDot(canvasContext);
};


Form.prototype._coordinatesMap = function(callback){
  var f = new Form({type: this.type, coordinates: this.coordinates});
  f.coordinates = f.coordinates.map(function(value){
    return callback(new CoordinatesMatrix(value[0], value[1]));
  });
  return f;
};

Form.prototype.rotate = function(deg, x, y){
  return this._coordinatesMap(function(matrix){
    return matrix.rotate(deg, x, y).getCoordinates();
  })
};

Form.prototype.move = function(x, y){
  return this._coordinatesMap(function(matrix){
    return matrix.move(x, y).getCoordinates();
  });
};

Form.prototype.scale = function(x, y){
  if (arguments.length === 1) return this._coordinatesMap(function(matrix){
    return matrix.scale(x).getCoordinates();
  });
  return this._coordinatesMap(function(matrix){
    return matrix.scale(x, y).getCoordinates();
  });
};

Form.prototype.coordinatesMap = function(callback){
  var f = new Form({type: this.type, coordinates: this.coordinates});
  var c = f.coordinates.map(function(value){
    return callback(new CoordinatesMatrix(value[0], value[1]));
  });

  f.coordinates = c.map(function(v){
    return v.$[0];
  });
  return f;
};