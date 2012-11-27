
this.requestAnimationFrame = (function(window){
	return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
           		window.setTimeout(callback, 1000 / 60);
         	};
})(this);
    
if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function() {
            var funcNameRegex = /function\s+(.{1,})\s*\(/;
            var results = (funcNameRegex).exec((this).toString());
            return (results && results.length > 1) ? results[1] : "";
        },
        set: function(value) {}
    });
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * <pre>
 * (x * 255).clamp(0, 255)
 * </pre>
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
if (typeof Number.prototype.clamp === 'undefined') {
	Object.defineProperty(Number.prototype, 'clamp', {
		value : function (min, max) {
			return Math.min(Math.max(this, min), max);
		},	
	    writable: false,
	    enumerable: false,
	    configurable: false
	});
};

if (typeof Object.prototype.extends === 'undefined') {
	Object.defineProperty(Object.prototype, 'extends', {
	    value: function(Parent) {
	    	var Fn = function() {};
	    	Fn.prototype = Parent.prototype;
	    	this.prototype = new Fn();
	    	this.prototype.constructor = this;
	    	this.parent = Parent.prototype;
	    },
	    writable: false,
	    enumerable: false,
	    configurable: false
	});
};

if (typeof Object.prototype.type === 'undefined') {
	Object.defineProperty(Object.prototype, 'type', {
		value : function() {
		    Object.prototype.toString.call(this).split(' ').pop().split(']').shift().toLowerCase();
		    return this;
		},
		writable : false,
		enumerable : false,
		configurable : false
	}); 
};

if (typeof Object.prototype.mergeWith === 'undefined') {
	Object.defineProperty(Object.prototype, 'mergeWith', {
		value : function(from) {
			var dest = this, props = Object.getOwnPropertyNames(from);
			props.forEach(function(name) {
				if ( name in dest) {
					var destination = Object.getOwnPropertyDescriptor(from, name);
					Object.defineProperty(dest, name, destination);
				};
			});
			return this;
		},
		writable : false,
		enumerable : false,
		configurable : false
	});
};


//copy

//deep copy


if (typeof Object.prototype.equals === 'undefined') {
	Object.defineProperty(Object.prototype, 'equals', {
		value :  function(x) {
			var p;
			for (p in this) {
				if ( typeof (x[p]) == 'undefined') {
					return false;
				};
			};
			for (p in this) {
				if (this[p]) {
					switch(typeof(this[p])) {
						case 'object':
							if (!this[p].equals(x[p])) {
								return false;
							};
							break;
						case 'function':
							if ( typeof (x[p]) == 'undefined' || (p != 'equals' && this[p].toString() != x[p].toString())) {
								return false;
							};
							break;
						default:
							if (this[p] != x[p]) {
								return false;
							};
					};
				} else {
					if (x[p]) {
						return false;
					};
				};
			};
		
			for (p in x) {
				if ( typeof (this[p]) == 'undefined') {
					return false;
				}
			};
		
			return true;
		},
		writable : false,
		enumerable : false,
		configurable : false
	}); 
};
