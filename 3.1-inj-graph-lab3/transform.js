/**
 * Use doing with params.
 * @returns {TransformMatrix}
 * @constructor
 */
function TransformMatrix (){
    Matrix.bind(this)(3, 3);
    this.$[0][0] = this.$[1][1] = this.$[2][2] = 1;
    return this;
}

inherit(TransformMatrix, Matrix);

TransformMatrix.prototype.scale = function(x, y){
    if (arguments.length === 1) return this._scaleBoth(x);
    return this._scaleOne(x, y);
};

TransformMatrix.prototype.rotate = function(deg){
    return this._rotate(deg);
};

TransformMatrix.prototype.move = function(x, y){
    return this.setValue(3, 1, x).setValue(3, 2, y);
};

TransformMatrix.prototype.apply = function(matrix){
    var m = matrix.multiply(this);
    return new CoordinatesMatrix(m.getValue(1,1), m.getValue(1,2));
};

TransformMatrix.prototype._scaleBoth = function(m){
    return this.setValue(1, 1, m).setValue(2, 2, m);
};

TransformMatrix.prototype._scaleOne = function(x, y){
    return this.setValue(1, 1, x).setValue(2, 2, y);
};

TransformMatrix.prototype._rotate = function(deg){
    var rad = deg * Math.PI / 180;
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    return this.setValue(1, 1, cos).setValue(2, 2, cos).setValue(2, 1, -sin).setValue(1, 2, sin);
};