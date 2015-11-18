/**
 * Use doing with params.
 * @returns {CoordinatesMatrix}
 * @constructor
 */
function CoordinatesMatrix (x, y){
  Matrix.bind(this)(1, 3);
  this.$[0][0] = x;
  this.$[0][1] = y;
  this.$[0][2] = 1;

  return this;
}

inherit(CoordinatesMatrix, Matrix);

CoordinatesMatrix.prototype.move = function(x, y){
  var transform = new TransformMatrix();
  return transform.move(x, y).apply(this);
};

CoordinatesMatrix.prototype.scale = function(x, y){
  var transform = new TransformMatrix();
  if (arguments.length === 1) return transform
    .scale(x)
    .apply(this);
  return transform
    .scale(x, y)
    .apply(this);
};

CoordinatesMatrix.prototype.rotate = function(deg, x, y){
  var transform = new TransformMatrix();
  if (arguments.length === 1) return transform
    .rotate(deg)
    .apply(this);
  return (function(self){
    var transformRotate = new TransformMatrix();
    var transformSecondMove = new TransformMatrix();
    return transformSecondMove
      .move(x,y)
      .apply(
      transformRotate
        .rotate(deg)
        .apply(
        transform
          .move(-x,-y)
          .apply(self)
      )
    );
  })(this);
};

CoordinatesMatrix.prototype.getCoordinates = function(){
  return [this.$[0][0], this.$[0][1]];
};

CoordinatesMatrix.get = function(matrix){
  return new CoordinatesMatrix(matrix.$[0][0], matrix.$[0][1]);
};