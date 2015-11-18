/**
 * Create matrix object. Every element is 0.
 * @param {number} h height of matrix
 * @param {number} w width of matrix
 * @returns {Matrix}
 * @constructor
 */
function Matrix(h, w){
    this.height = Number(h);
    this.width = Number(w);
    this.$ = (new Array(this.height));
    for(var i = 0; i < this.height; i++){
        this.$[i] = new Array(Number(w));
        for(var j = 0; j < this.width; j++){
            this.$[i][j] = 0;
        }
    }
    
    return this;
}

/**
 * 
 * @param {String} [splitter] some string that will be paste between elements.
 * @param {String} [lineSplitter] some string that will be paste between lines.
 * @returns {String}
 */
Matrix.prototype.toString = function(splitter, lineSplitter){
    splitter = splitter  || '\t';
    lineSplitter = lineSplitter  || '\n';
    return this.$.reduce(function(res,line){
        if (res) res += lineSplitter;
        res += line.join(splitter);
        return res;
    }, '');
};

/**
 * Get matrix element by array indexes.
 * @param {number} i i of matrix element decreased by one.
 * @param {number} j j of matrix element decreased by one.
 * @returns {number}
 * @private
 */
Matrix.prototype._getValue = function(i, j){
    return this.$[i][j];
};

/**
 * Set matrix element to value by indexes.
 * @param {number} i i of matrix element decreased by one.
 * @param {number} j j of matrix element decreased by one.
 * @param {number} value value, that matrix element will be set.
 * @returns {Matrix}
 * @private
 */
Matrix.prototype._setValue = function(i, j, value){
    this.$[i][j] = value;
    return this;
};

/**
 * Get matrix element by i and j.
 * @param {number} i i of matrix element.
 * @param {number} j j of matrix element.
 * @returns {number}
 */
Matrix.prototype.getValue = function(i, j){
    if (this.height < i) throw new Error('Out of limit.');
    if (this.width < j) throw new Error('Out of limit.');
    if (i < 1) throw new Error('Out of limit.');
    if (j < 1) throw new Error('Out of limit.');
    return this._getValue(i-1, j-1);
};

/**
 * Set matrix element to value by i and j.
 * @param {number} i i of matrix element.
 * @param {number} j j of matrix element.
 * @param {number} value value, that matrix element will be set.
 * @returns {Matrix}
 */
Matrix.prototype.setValue = function(i, j, value){
    if (this.height < i) throw new Error('Out of limit.');
    if (this.width < j) throw new Error('Out of limit.');
    if (i < 1) throw new Error('Out of limit.');
    if (j < 1) throw new Error('Out of limit.');
    return this._setValue(i-1, j-1, value);
};

/**
 * Multiply matrix to number of another matrix.
 * @param {Matrix|number} multiplier
 * @returns {Matrix} New Matrix object.
 */
Matrix.prototype.multiply = function(multiplier){
    if (multiplier instanceof Matrix) return this._multiplyMatrix(multiplier);
    if (typeof multiplier === 'number') return this._multiplyNumber(multiplier);
    throw new Error("Doesn't know such multiple.");
};

/**
 * Multiply matrix to another matrix.
 * @param {Matrix} multiplier
 * @returns {Matrix} New Matrix object.
 * @private
 */
Matrix.prototype._multiplyMatrix = function(multiplier){
    if (multiplier.height !== this.width) throw new Error('Not allowed.');
    var self = this;
    var res = new Matrix(this.height,multiplier.width);
    res.$ = res.$.map(function(line, i){
        return line.map(function(value, j){
            return self.$[i].reduce(function(res, value, index){
                res += value * multiplier._getValue(index, j);
                return res;
            },0);
        });
    });
    return res;
};

/**
 * Multiply matrix to number.
 * @param {number} multiplier
 * @returns {Matrix} New Matrix object.
 * @private
 */
Matrix.prototype._multiplyNumber = function(multiplier){
    var res = new Matrix(this.height, this.width);
    res.$ = this.$.map(function(line){
        return line.map(function(value){
            return value * multiplier;
        });
    });
    return res;
};



//
//var a = new Matrix(2,3);
//var b = new Matrix(3,1);
//a.setValue(1,1,1);
//a.setValue(1,2,2);
//a.setValue(1,3,3);
//a.setValue(2,3,10);
//b.setValue(1,1,1);
//b.setValue(2,1,10);
//b.setValue(3,1,100);
//console.log(a.toString());
//console.log(b.toString());
//
//var c = a.multiple(b);
//var d = a.multiple(100);
//
//console.log(c.toString());
//console.log(d.toString());
//console.log(d);
//console.log(a);