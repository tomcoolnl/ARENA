/**
 * A way to use Enums within JavaScript
 * @class Enum
 * @constructor
 * 
 * @param {Object} obj The object to enumerate
 */
function Enum(obj) {
	'use strict';
	if (typeof obj === 'object' && obj.constructor === Object && Object.keys(obj).length > 0) {
		for (var prop in obj) {
			this[prop] = obj[prop];
		};
		return Object.freeze(this);
	} else {
		throw new TypeError('Plain object expected...');
	};
};

/**
 * A way to use Enums as Arrays within JavaScript
 * @class EnumAsArray
 * @constructor
 * 
 * @param {Array} arr The array to enumerate
 */
function EnumAsArray(arr) {
	'use strict';
	if (Array.isArray(arr) && arr.length > 0) {
		return Object.freeze(arr);
	} else {
		throw new TypeError('Plain Array object expected...');
	};
};