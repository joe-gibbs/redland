Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

Array.prototype.last = function(){
    return this[this.length - 1];
};

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
  };

function normalise(val, max, min) { return (val - min) / (max - min); }    

Object.prototype.forEach = function(func, context) {
    var value;
    context = context || this;  //apply the function to 'this' by default
    for (key in this) {
        if (this.hasOwnProperty(key)) {  //to rule out inherited properties
            value = this[key];
            func.call(context, key, value);
        }
    }    
};
