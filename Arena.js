/**
 * class ARENA is a Modular Singleton, providing mostly public and static methods
 * @author Tom Cool @ FrenzyMedia B.V. - http://frenzymedia.eu
 * @class ARENA object
 * @package ARENA
 * 
 * @param {window} win BOM
 * @param {document} doc DOM
 * 
 * @constructor
 */
;var ARENA = (function (window, document) {
	
	'use strict';
	
	/**
	 * @namespace Public methods
     * @scope SYSTION
     */
	return {
		
		/**
		 * Load additional JavaScript or CSS files (like plugins that enhance modules)
		 * @param {String} ns_string The namespace to look for, and add if not found
		 * @returns SYSTION
		 */
		namespace : function (ns_string) {
			var parts = ns_string.split('.'), parent = ARENA, i, n;
			// strip redundant leading global 
			if (parts[0] === 'ARENA') {
				parts = parts.slice(1);
			};			
			for (i = 0, n = parts.length; i < n; i += 1) {
				// create a property if it doesn't exist
				if (typeof parent[parts[i]] === 'undefined') {
					parent[parts[i]] = {};
				};
				parent = parent[parts[i]]; 
			};
			return parent;
		},
		
		/**
		 * Add additional methos to the window.onload event
		 * @param {Function} callback The method to call on window.onload
		 * @returns void
		 */
		addLoadEvent : function (callback) {
			var oldonload = window.onload;
			if (typeof window.onload !== 'function') {
				window.onload = callback;
			} else {
				window.onload = function() {
					if (oldonload) {
						oldonload();
					};
					callback();
				};
			};
		},
		
		/**
		 * Load additional JavaScript or CSS files (like plugins that enhance modules)
		 * @param {String} filename The relative path to the JavaScript or CSS file
		 * @param {String} filetype The type of file
		 * @param {String} id A id to chec wether the requestedfile is already loaded
		 * @param {Function} callback A function to call after loading
		 * @returns void
		 * 
		 * TODO use combine.php script
		 * TODO input files as array and trigger callback after last file has completely loaded
		 */
		loadFile : function (filename, filetype, id, callback) {
			
			id = id || '';
			callback = callback || function () {};
			
			if (document.getElementById(id) === (undefined || null)) {
				 var fileref = '';
				 if (filetype === 'js') {
					 fileref		= document.createElement('script');
					 fileref.type 	= 'text/javascript';
					 fileref.src 	= filename;
				 } else if (filetype === 'css') {
					 fileref 		= document.createElement('link');
					 fileref.rel 	= 'stylesheet';
					 fileref.type 	='text/css';
					 fileref.href 	= filename;
				 };
				 
				 fileref.onload = callback();
				 fileref.id 	= id;
				 
				 if (fileref !== '') {
				 	document.getElementsByTagName('head')[0].appendChild(fileref);
				 };
			} else {
				callback();
			};
		},
		
		/**
		 * Autoload Namespace-classes
		 * @returns void
		 */
		autoload : function (namespace) {
			for (var i in namespace) {
				if (typeof namespace[i].init !== 'undefined') {
					namespace[i].init();
				};
			};
		},
		
		/**
		 * 
 		 * @param {Object} node
 		 * @returns Boolean
		 */
		isNull : function (node) {
			return (node.toString() === ('undefined' || 'NULL'));
		}

	};
	
}(this, this.document));

//create additional namespaces
ARENA.namespace('ARENA.Game');


