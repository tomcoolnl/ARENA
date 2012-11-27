
;var Set = function () {
	this.rawArray = new Array();
};

Set.prototype = {
	
	/**
	 * Add object to the Set
	 * @param {Object} object The object to add
	 * @returns void
	 */
	add : function (object) {
		if (this.contains(object) == undefined) {
			this.rawArray.push(object);
		};
	},
	
	/**
	 * Accessor to get an object from the set
	 * @param {Number} index The index within the Set
	 * @return void
	 */
	get : function (index) {
		return this.rawArray[index];
	},
	
	/**
	 * Remove object from the set
	 * @param {Object} object The object to remove
	 * @returns void
	 */
	remove : function (object) {
		var index = this.contains(object);
		if (index != undefined) {
			this.rawArray.remove(index);
		};
	},
	
	/**
	 * Check if object exists within this Set
	 * @param {Object} object The object to look-up
	 * @returns Number || undefined
	 */
	contains : function (object) {
		for (var i = 0, n = this.rawArray.length; i < n; i += 1) {
			var obj2 = this.rawArray[i];
			if (object.equals(obj2)) {
				return i;
			};
		};
		return undefined;
	}
};
/**
 * ?
 */
Number.prototype.equals = function(number) {
	return this == number;
}