/*!
	Copyright 2010 British Broadcasting Corporation

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	   http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/
/**
	@name glow
	@namespace
	@version @VERSION@
	@description The glow library namespace
		The library can also be used as a function, which is a shortcut to
		{@link glow.NodeList}.
		
	@example
		var links = glow('a');
		// is the same as
		var links = new glow.NodeList('a');
*/
if (!window.Glow) { // loading packages via user SCRIPT tags?
	window.Glow = {
		provide: function(f) {
			f(glow);
		},
		complete: function(n, version) {
			glow.version = version;
		}
	};
	
	window.glow = function(nodeListContents) {
		return new glow.NodeList(nodeListContents);
	};
	
	glow.load = function() {
		throw new Error('Method load() is not available without glow.js');
	}
}


Glow.provide(function(glow) {
	/*!debug*/
	var glowbug = {
	errors: []
	,
	log: function(message, fileName, lineNumber) {
		this._add('Log', message, fileName, lineNumber);
	}
	,
	warn: function(message, fileName, lineNumber) {
		this._add('Warn', message, fileName, lineNumber);
	}
	,
	error: function(message, fileName, lineNumber) {
		this._add('Error', message, fileName, lineNumber);
	}
	,
	_add: function(level, message, fileName, lineNumber) {
		var e = new Error(message, fileName, lineNumber);
		
		e.message = message;
		e.name = 'Glow'+level;
		e.level = level.toLowerCase();
		
		var match = /\[([^\]]+)\]/.exec(message);
		if (match) e.type = match[1]; // may be undefined
		else e.type = 'message';
		
		this.errors.push(e);
		
		this.out(e);
	}
	,
	out: function(e) {
		var message = '['+e.level+'] '+e.message;
		
		if (window.console) {
			if (e.level === 'warn' && window.console.warn) {
				console.warn(message);
			}
			else if (e.level === 'error' && window.console.error) {
				console.error(message);
			}
			else if (window.console.log) {
				console.log(message);
			}
		}
		else if (window.opera && opera.postError) {
			opera.postError(message);
		}
		else { // use our own console
			glowbug.console.log(e.level, message);
		}
	}
};

glowbug.console = {
	messages: [],
	log: function(level, message) {
		if (!this._w) {
			try {
				this._w = window.open('', 'report', 'width=350,height=250,menubar=0,toolbar=0,location=no,status=0,scrollbars=1,resizable=1');
				this._w.document.write(
					'<html><head><title>Console<\/title><style>body{background-color: #ddd;} .message{background-color:#FFF;padding:4px;margin:0px;border-bottom:1px solid #ccc;} .warn {background-color: #E5E6B6;} .error{background-color: #D39C9E;}<\/style><\/head>'
					+ '<body style="font: 11px monaco"><code id="messages"><\/code><\/body><\/html>'
				)
				this._w.document.close();
			}
			catch(ignored) {
				this._w = null;
			}
		}
		
		if (this._w) {
			var p = this._w.document.createElement('P');
			p.className = 'message ' + level;
			p.innerHTML = message;
			this._w.document.getElementById('messages').appendChild(p);
			
			var dh = this._w.document.body.scrollHeight
			var ch = this._w.document.body.clientHeight
			if (dh > ch) { this._w.scrollTo(0, dh-ch); }
		}
	}
}
	if (typeof glowbug != 'undefined') { glow.debug = glowbug; }
	/*gubed!*/
});
Glow.provide(function(glow) {
	/**
		@name glow.env
		@namespace
		@description Information about the browser and characteristics
	*/
	
	// parse the useragent string, setting NaN if match isn't found
	var ua = navigator.userAgent.toLowerCase(),
		nanArray = [0, NaN],
		opera  = (/opera[\s\/]([\w\.]+)/.exec(ua) || nanArray)[1],
		ie     = opera ? NaN : (/msie ([\w\.]+)/.exec(ua) || nanArray)[1],
		gecko  = (/rv:([\w\.]+).*gecko\//.exec(ua) || nanArray)[1],
		webkit = (/applewebkit\/([\w\.]+)/.exec(ua) || nanArray)[1],
		khtml  = (/khtml\/([\w\.]+)/.exec(ua) || nanArray)[1],
		toNumber = parseFloat,
		env = {};
	
	/**
		@name glow.env.gecko
		@type number
		@description Gecko version number to one decimal place (eg 1.9) or NaN on non-gecko browsers.
			The most popular browser using the Gecko engine is Firefox.
		
		@see <a href="http://en.wikipedia.org/wiki/Gecko_(layout_engine)#Usage">Versions of Gecko used by browsers</a>
		
		@example
			if (glow.env.gecko < 1.9) {
				// runs in Firefox 2 and other browsers that use Gecko earlier than 1.9
			}
	*/
	env.gecko = toNumber(gecko);
	
	/**
		@name glow.env.ie
		@type number
		
		@description IE version number to one decimal place (eg 6.0) or NaN on non-IE browsers.
			This number will also be populated for browser based on IE's trident engine
			
		@example
			if (glow.env.ie < 9) {
				// runs in IE pre-9.0
				glow('#content').css('background', 'deadmoomin.png');
			}
	*/
	env.ie = toNumber(ie);
	
	/**
		@name glow.env.opera
		@type number
		
		@description Opera version number to one decimal place (eg 10.0) or NaN on non-Opera browsers.
		
		@example
			if (glow.env.opera < 10) {
				// runs in Opera pre-10.0
			}
	*/
	env.opera = toNumber(opera);
	
	/**
		@name glow.env.webkit
		@type number
		
		@description Webkit version number to one decimal place (eg 531.9) or NaN on non-Webkit browsers.
			Safari and Google Chrome are the most popular browsers using Webkit.
			
		@see <a href="http://en.wikipedia.org/wiki/Safari_version_history#Release_history">Versions of Webkit used by Safari</a>
		@see <a href="http://en.wikipedia.org/wiki/Google_Chrome#Release_history">Versions of Webkit used by Google Chrome</a>
			
		@example
			if (glow.env.webkit < 526) {
				// runs in Safari pre-4.0, and Chrome pre-1.0
			}
	*/
	env.webkit = toNumber(webkit);

	/**
		@name glow.env.khtml
		@type number
		
		@description KHTML version number to one decimal place or NaN on non-KHTML browsers.
			Konqueror is the most popular browsers using KHTML.
	*/
	env.khtml = toNumber(khtml);
	
	/**
		@name glow.env.standardsMode
		@type boolean
		@description True if the browser reports itself to be in 'standards mode'
			Otherwise, the browser is in 'quirks mode'
			
		@see <a href="http://en.wikipedia.org/wiki/Quirks_mode">Quirks Mode vs Standards Mode</a>
	*/
	env.standardsMode = document.compatMode != "BackCompat" && (!env.ie || env.ie >= 6);
	
	/**
		@name glow.env.version
		@type string
		@description Version number of the browser in use as a string.
			This caters for version numbers that aren't 'real' numbers, like "7b" or "1.9.1"
	*/
	env.version = ie || gecko || webkit || opera || khtml || '';
	
	// export
	glow.env = env;
});
// start-source: core/ready.js
/*debug*///log.info('executing core/ready.js');
Glow.provide(
	function(glow) {
		var readyQueue = [],
			domReadyQueue = [],
			blockersActive = 0,
			processingReadyQueue = false;
			
		glow._readyBlockers = {};
		
 		/*debug*///log.info('overwriting Glow ready with glow.ready');	
		glow.ready = function (f) { /*debug*///log.info('glow.ready()');
			if (this.isReady) {
				f();
			}
			else {
				readyQueue.push(f);
			}
			return glow;
		};
		
		glow.onDomReady = function(f) {
			//just run function if already ready
			if (glow.isDomReady) {
				f();
			}
			else {
				domReadyQueue.push(f);
			}
		};
		
		glow._addReadyBlock = function(name) { /*debug*///log.info('_addReadyBlock('+name+')');
			if (typeof glow._readyBlockers[name] === 'undefined') { glow._readyBlockers[name] = 0; }
			glow._readyBlockers[name]++;
			glow.isReady = false;
			blockersActive++; /*debug*///log.info('  &#187; blockersActive '+blockersActive+'.');
			return glow;
		}
			
		glow._removeReadyBlock = function(name) { /*debug*///log.info('_removeReadyBlock('+name+')');
			if (glow._readyBlockers[name]) {
				glow._readyBlockers[name]--;
				blockersActive--;  /*debug*///log.info('  &#187; blockersActive '+blockersActive+'.');
				// if we're out of blockers
				if (!blockersActive) {
					// call our queue
					glow.isReady = true;
					runReadyQueue();
				}
			}
			return glow;
		}
		
		// add blockers for any packages that started loading before core (this package) was built
		if (glow._build) { // only defined when using big Glow
			for (var i = 0, len = glow._build.loading.length; i < len; i++) {
				glow._addReadyBlock('glow_loading_'+glow._build.loading[i]);
			}
			
			for (var j = 0, lenj = glow._build.callbacks.length; j < lenj; j++) {
				if (glow._addReadyBlock) { glow._addReadyBlock('glow_loading_loadedcallback'); }
			}
		}
		
		function runDomReadyQueue() { /*debug*///log.info('runDomReadyQueue()');
			glow.isDomReady = true;
			// run all functions in the array
			for (var i = 0, len = domReadyQueue.length; i < len; i++) {
				domReadyQueue[i]();
			}
		}
	
		function runReadyQueue() { /*debug*///log.info('runReadyQueue()');
			// if we're already processing the queue, just exit, the other instance will take care of it
			if (processingReadyQueue) { return; }
			
			/*debug*///log.info('readyQueue: '+readyQueue.length);
			processingReadyQueue = true;
			while (readyQueue.length) {
				var callback = readyQueue.shift();
				/*debug*///log.info('callback: '+callback);
				callback(glow);
				
				// check if the previous function has created a blocker
				if (blockersActive) { break; }
			}
			processingReadyQueue = false;
		}
		
		/**
			@private
			@function
			@name bindReady
			@description Add listener to document to detect when page is ready.
		 */
		function bindReady() { /*debug*///log.info('bindReady()');
			//don't do this stuff if the dom is already ready
			if (glow.isDomReady) { return; }
			glow._addReadyBlock('glow_domReady'); // wait for dom to be ready
			
			function onReady() { /*debug*///log.info('onReady()');
				runReadyQueue();
				glow._removeReadyBlock('glow_domReady');
			}
					
			if (document.readyState == 'complete') { // already here!
				 /*debug*///log.info('already complete');
				onReady();
			}
			else if (glow.env.ie && document.attachEvent) { /*debug*///log.info('bindready() - document.attachEvent');
				// like IE
				
				// not an iframe...
				if (document.documentElement.doScroll && window == top) {
					(function() {  /*debug*///log.info('doScroll');
						try {
							document.documentElement.doScroll('left');
						}
						catch(error) {
							setTimeout(arguments.callee, 0);
							return;
						}
				
						// and execute any waiting functions
						onReady();
					})();
				}
				else {
					// an iframe...
					document.attachEvent(
						'onreadystatechange',
						function() { /*debug*///log.info('onreadystatechange');
							if (document.readyState == 'complete') {
								document.detachEvent('onreadystatechange', arguments.callee);
								onReady();
							}
						}
					);
				}
			}
			else if (document.readyState) { /*debug*///log.info('bindready() - document.readyState');
				// like pre Safari
				(function() { /*debug*///log.info('loaded|complete');
					if ( /loaded|complete/.test(document.readyState) ) {
						onReady();
					}
					else {
						setTimeout(arguments.callee, 0);
					}
				})();
			}
			else if (document.addEventListener) {/*debug*///log.info('bindready() - document.addEventListener');
				// like Mozilla, Opera and recent webkit
				document.addEventListener( 
					'DOMContentLoaded',
					function(){ /*debug*///log.info('glow DOMContentLoaded');
						document.removeEventListener('DOMContentLoaded', arguments.callee, false);
						onReady();
					},
					false
				);
			}
			else {
				throw new Error('Unable to bind glow ready listener to document.');
			}
		}
	
		glow.notSupported = ( // here are the browsers we don't support
			glow.env.ie < 6 ||
			(glow.env.gecko < 1.9 && !/^1\.8\.1/.test(env.version)) ||
			glow.env.opera < 9 ||
			glow.env.webkit < 412
		);
		// deprecated
		glow.isSupported = !glow.notSupported;
		
		// block 'ready' if browser isn't supported
		if (glow.notSupported) {
			glow._addReadyBlock('glow_browserSupport');
		}
		
		bindReady();
	}
);
// end-source: core/ready.js
/**
	@name glow.util
	@namespace
	@description Core JavaScript helpers
*/
Glow.provide(function(glow) {
	var util = {},
		undefined;
	
	/**
		@name glow.util.apply
		@function
		@description Copies properties from one object to another
			All properties from 'source' will be copied onto
			'destination', potentially overwriting existing properties
			on 'destination'.
			
			Properties from 'source's prototype chain will not be copied.
		
		@param {Object} destination Destination object
		
		@param {Object} source Properties of this object will be copied onto the destination
		
		@returns {Object} The destination object.
		
		@example
			var obj = glow.util.apply({foo: "hello", bar: "world"}, {bar: "everyone"});
			//results in {foo: "hello", bar: "everyone"}
	*/
	util.apply = function(destination, source) {
		/*!debug*/
			if (arguments.length != 2) {
				glow.debug.warn('[wrong count] glow.util.apply expects 2 arguments, not '+arguments.length+'.');
			}
			if (typeof destination != 'object') {
				glow.debug.warn('[wrong type] glow.util.apply expects argument "destination" to be of type object, not ' + typeof destination + '.');
			}
			if (typeof source != 'object') {
				glow.debug.warn('[wrong type] glow.util.apply expects argument "source" to be of type object, not ' + typeof source + '.');
			}
		/*gubed!*/
		for (var i in source) {
			if ( source.hasOwnProperty(i) ) {
				destination[i] = source[i];
			}
		}
		return destination;
	};
	
	/**
		@name glow.util.extend
		@function
		@description Copies the prototype of one object to another
			The 'subclass' can also access the 'base class' via subclass.base

		@param {Function} sub Class which inherits properties.
		@param {Function} base Class to inherit from.
		@param {Object} additionalProperties An object of properties and methods to add to the subclass.

		@example
			function MyClass(arg) {
				this.prop = arg;
			}
			MyClass.prototype.showProp = function() {
				alert(this.prop);
			};
			function MyOtherClass(arg) {
				//call the base class's constructor
				arguments.callee.base.apply(this, arguments);
			}
			glow.util.extend(MyOtherClass, MyClass, {
				setProp: function(newProp) {
					this.prop = newProp;
				}
			});

			var test = new MyOtherClass("hello");
			test.showProp(); // alerts "hello"
			test.setProp("world");
			test.showProp(); // alerts "world"
	*/
	util.extend = function(sub, base, additionalProperties) {
		/*!debug*/
			if (arguments.length < 2) {
				glow.debug.warn('[wrong count] glow.util.extend expects at least 2 arguments, not '+arguments.length+'.');
			}
			if (typeof sub != 'function') {
				glow.debug.error('[wrong type] glow.util.extend expects argument "sub" to be of type function, not ' + typeof sub + '.');
			}
			if (typeof base != 'function') {
				glow.debug.error('[wrong type] glow.util.extend expects argument "base" to be of type function, not ' + typeof base + '.');
			}
		/*gubed!*/
		var f = function () {}, p;
		f.prototype = base.prototype;
		p = new f();
		sub.prototype = p;
		p.constructor = sub;
		sub.base = base;
		if (additionalProperties) {
			util.apply(sub.prototype, additionalProperties);
		}
	};
	
	// export
	glow.util = util;
});
Glow.provide(function(glow) {
	/**
	@name glow.events
	@namespace
	@description Handling custom events
	*/
	var events = {};
		
	/* storage variables */
	
	var eventListeners = {}, 
		eventId = 1, /* TODO: camelCase */
		objIdCounter = 1, 
		eventKey = '__eventId' + glow.UID; 
		
	
	/**
	@name glow.events.addListeners
	@function
	@param {Object[]} attachTo Array of objects to add listeners to.
	@param {string} name Name of the event to listen for.
		Event names are case sensitive.
	@param {function} callback Function to call when the event is fired.
		The callback will be passed a single event object. The type of this
		object depends on the event (see documentation for the event
		you're listening to).
	@param {Object} [thisVal] Value of 'this' within the callback.
		By default, this is the object being listened to.
	@see glow.events.Target#fire
	@description Convenience method to add listeners to many objects at once.
		If you want to add a listener to a single object, use its
		'on' method.
	*/
	events.addListeners = function (attachTo, name, callback, thisVal) {
		var listenerIds = [],
			objIdent,
			listener,
			eventsOnObject,
			currentListeners;
	
		//attach the event for each element, return an array of listener ids
		var i = attachTo.length;
		while (i--) {
			objIdent = attachTo[i][eventKey];
			if (!objIdent){
				objIdent = attachTo[i][eventKey] = objIdCounter++;
			}
					
			listener = [ callback, thisVal ];
			eventsOnObject = eventListeners[objIdent];
			if(!eventsOnObject){
				eventsOnObject = eventListeners[objIdent] = {};
			}
					
			currentListeners = eventsOnObject[name];
			if(!currentListeners){
				eventsOnObject[name] = [listener];
			}
			else{
				currentListeners[currentListeners.length] = listener;
			}							
		}
		return events;
	};
	
	events._getPrivateEventKey = function(node) {
		if (!node[eventKey]) {
			node[eventKey] = objid++;
		}
		
		return node[eventKey];
	}
	
	/**
	@name glow.events.fire
	@function
	@param {Object[]} items      Array of objects to add listeners to
	@param {string}   eventName  Name of the event to fire
	@param {glow.events.Event|Object} [event] Event object to pass into listeners.
       You can provide a simple object of key-value pairs which will
       be added as properties on the glow.events.Event instance.
		
	@description Convenience method to fire events on multiple items at once.
		If you want to fire events on a single object, use its
		'fire' method.
	*/
		
	events.fire = function (items, eventName, event) {
		if (! event) {
			event = new events.Event();
		}
		else if ( event.constructor === Object ) {
			event = new events.Event( event )
		}
		
		// for loop, because order matters!
		for(var i = 0, len = items.length; i < len; i++) { 
			callListeners(items[i], eventName, event);
		}
			
		return event;
	};

	
	/**
	 @name glow.events-callListeners
	 @private
	*/
	function callListeners(item, eventName, event, thisVal) {
		var objIdent = item[eventKey],
			listenersForEvent,
			returnedVal;			

		if (!objIdent || !eventListeners[objIdent]) {
			return event;
		}
				
		listenersForEvent = eventListeners[objIdent][eventName];
			
		if (!listenersForEvent) {
			return event;
		}
		// Slice to make sure we get a unique copy.
		listenersForEvent = listenersForEvent.slice(0);
		for (var i = 0, len = listenersForEvent.length; i < len; i++){
			returnVal = listenersForEvent[i][0].call((listenersForEvent[i][1] || thisVal || item), event);
			if (returnVal === false){
				event.preventDefault();
			}
		}
			
		return event;
	}
	events._callListeners = callListeners;
		
		
	/**
	@name glow.events.removeAllListeners
	@function
	@param {Object[]} items Items to remove events from		    
	@description Removes all listeners attached to a given object.
		This removes not only listeners you added, but listeners others
		added too. For this reason it should only be used as part of a cleanup
		operation on objects that are about to be destroyed.
	*/
	
	events.removeAllListeners = function (items) {
		var objIdent,
		i = items.length;		
		
		while(i--){
			
			objIdent = items[i][eventKey];
			
			if (!objIdent) {
				return false;
			}
			else {
				delete eventListeners[objIdent];
			}
		}

		return true;
	};


	/**
	@name glow.events.removeListeners
	@function
	@param {Object[]} items Items to remove events from.
	@param {string} eventName Name of the event to remove.
	@param {function} callback A reference to the original callback used when the listener was added.
	@decription Removes listeners for an event.
	*/
	events.removeListeners = function (item, eventName, callback) { /* TODO: items! */
		var objIdent,
			listenersForEvent,
			i = item.length;
		
	
		while(i--){
			
			objIdent = item[i][eventKey];
				
			if(!objIdent || !eventListeners[objIdent]){
				return events;
			}
			
		
			listenersForEvent = eventListeners[objIdent][eventName];
			if(!listenersForEvent){
				return events;
			}
			
			// for loop, because order matters
			for(var j = 0, lenj = listenersForEvent.length; j < lenj; j++){						
				if (listenersForEvent[j][0] === callback){
					listenersForEvent.splice(j, 1);
					break;
				}
		
			}
		}
		
		return events;			
	};
	
	/**
		Copies the events from one nodelist to another
		@private
		@name glow.events._copyEvent
		@see glow.NodeList#clone
		@function
	*/
	events._copyEvent = function(from, to){
		var listenersToCopy,
		i = [from].length,
		listenersForEvent,
		name,
		callback,
		thisVal;
		
		while(i--){
			
			var objIdent = [from][i][eventKey];
			
			listenersForEvent = eventListeners[objIdent];
			
				
			if(!objIdent){
					
				return false;
			}
			else{
				for ( var eventName in eventListeners[objIdent] ) {
					name = eventName;
					callback = eventListeners[objIdent][eventName][0][0];
					thisVal = eventListeners[objIdent][eventName][0][1];
				}				
				events._addDomEventListener([to], name, callback, thisVal);
		}
	
		return;
		}
		
	}
	///**
	//@name glow.events.getListeners
	//@function
	//@param {Object[]} item Item to find events for
	//@decription Returns a list of listeners attached for the given item.
	//
	//*/	
	//glow.events.getListeners = function(item){
	//	var objIdent; 
	//	for (var i = 0, len = item.length; i < len; i++) {
	//		
	//		objIdent = item[i][eventKey];
	//		
	//		if (!objIdent) {
	//			return false;
	//		}
	//		else {
	//			// todo: need to return listeners in a sensible format
	//			return eventListeners[objIdent];
	//		}
	//	}
	//
	//
	//	return false;
	//};
	//
	///**
	//@name glow.events.hasListener
	//@function
	//@param {Object[]} item  Item to find events for
	//@param {String}   eventName  Name of the event to match
	//@decription Returns true if an event is found for the item supplied
	//
	//*/
	//
	//glow.events.hasListener = function (item, eventName) {
	//	var objIdent,
	//		listenersForEvent;
	//		
	//	for (var i = 0, len = item.length; i < len; i++) {	
	//		objIdent = item[i][eventKey];
	//			
	//		if (!objIdent || !eventListeners[objIdent]) {
	//			return false;
	//		}
	//				
	//		listenersForEvent = eventListeners[objIdent][eventName];
	//		if (!listenersForEvent) {
	//			return false;
	//		}
	//		else {
	//			return true;							
	//		}					
	//	}
	//	
	//	return false;			
	//};
	
	/**
	@name glow.events.Target
	@class
	@description An object that can have event listeners and fire events.
		Extend this class to make your own objects have 'on' and 'fire'
		methods.
		
	@example
		// Ball is our constructor
		function Ball() {
			// ...
		}
		       
		// make Ball inherit from Target
		glow.util.extend(Ball, glow.events.Target, {
			// additional methods for Ball here, eg:
			bowl: function() {
				// ...
			}
		});
		       
		// now instances of Ball can receive event listeners
		var myBall = new Ball();
		myBall.on('bounce', function() {
			alert('BOING!');
		});
		       
		// and events can be fired from Ball instances
		myBall.fire('bounce');
	*/
	
	events.Target = function () {
			
	};
	var targetProto = events.Target.prototype;
		
	/**
	@name glow.events.Target.extend
	@function
	@param {Object} obj Object to add Target instance methods to.
		
	@description Convenience method to add Target instance methods onto an object.
		If you want to add Target methods to a class, extend glow.events.Target instead.
		       
	@example
		var myApplication = {};
		       
		glow.events.Target.extend(myApplication);
		       
		// now myApplication can fire events...
		myApplication.fire('load');
		       
		// and other objects can listen for those events
		myApplication.on('load', function(e) {
			alert('App loaded');
		});
	*/
	
	events.Target.extend = function (obj) {
		glow.util.apply( obj, glow.events.Target.prototype );
	};
		
	/**
	@name glow.events.Target#on
	@function
	@param {string} eventName Name of the event to listen for.
	@param {function} callback Function to call when the event fires.
		The callback is passed a single event object. The type of this
		object depends on the event (see documentation for the event
		you're listening to).
	@param {Object} [thisVal] Value of 'this' within the callback.
		By default, this is the object being listened to.
		
	@description Listen for an event
		
	@returns this
		
	@example
		myObj.on('show', function() {
		    // do stuff
		});
	*/
	
	targetProto.on = function(eventName, callback, thisVal) {
		glow.events.addListeners([this], eventName, callback, thisVal);
		return this;
	}
		
	/**
	@name glow.events.Target#detach
	@function
	@param {string} eventName Name of the event to remove.
	@param {function} callback Callback to detach.
	@param {Object} [thisVal] Value of 'this' within the callback.
		By default, this is the object being listened to.
	@description Remove an event listener.
		
	@returns this Target object
		
	@example
		function showListener() {
		    // ...
		}
		       
		// add listener
		myObj.on('show', showListener);
		       
		// remove listener
		myObj.detach('show', showListener);
		       
	@example
		// note the following WILL NOT WORK
		       
		// add listener
		myObj.on('show', function() {
		    alert('hi');
		});
		       
		// remove listener
		myObj.detach('show', function() {
			alert('hi');
		});
		       
		// this is because both callbacks are different function instances
	
	*/
		
	targetProto.detach = function(eventName, callback) {
		glow.events.removeListeners(this, eventName, callback);
		return this;
	}
		
	/**
	@name glow.events.Target#fire
	@function
	@param {string} eventName Name of the event to fire.
	@param {glow.events.Event|Object} [event] Event object to pass into listeners.
		    You can provide a simple object of key-value pairs which will
		    be added as properties of a glow.events.Event instance.
		
	@description Fire an event.
		
	@returns glow.events.Event
		
	@example
		myObj.fire('show');
		       
	@example
		// adding properties to the event object
		myBall.fire('bounce', {
		    velocity: 30
		});
	       
	@example
		// BallBounceEvent extends glow.events.Event but has extra methods
		myBall.fire( 'bounce', new BallBounceEvent(myBall) );
	*/
	
	targetProto.fire = function(eventName, event) {			
		return callListeners(this, eventName, event);
	}
		
	/**
	@name glow.events.Event
	@class
	@param {Object} [properties] Properties to add to the Event instance.
		Each key-value pair in the object will be added to the Event as
		properties.
	       
	@description Describes an event that occurred.
		You don't need to create instances of this class if you're simply
		listening to events. One will be provided as the first argument
		in your callback.
	       
	@example
		// creating a simple event object
		var event = new glow.events.Event({
			velocity: 50,
			direction: 180
		});
		       
		// 'velocity' and 'direction' are simple made-up properties
		// you may want to add to your event object
		       
	@example
		// inheriting from glow.events.Event to make a more
		// specialised event object
		       
		function RocketEvent() {
			// ...
		}
		       
		// inherit from glow.events.Event
		glow.util.extend(RocketEvent, glow.events.Event, {
			getVector: function() {
				return // ...
			}
		});
		       
		// firing the event
		rocketInstance.fire( 'landingGearDown', new RocketEvent() );
		       
		// how a user would listen to the event
		rocketInstance.on('landingGearDown', function(rocketEvent) {
			var vector = rocketEvent.getVector();
		});
	*/
		
	events.Event = function(obj) {			
		if (obj) {
			glow.util.apply(this, obj);
		}
	};
	var eventProto = events.Event.prototype;
	/**
	@name glow.events.Event#attachedTo
	@type {Object}
	@description The object the listener was attached to.
		If null, this value will be populated by {@link glow.events.Target#fire}
	*/
		
	/**
	@name glow.events.Event#source
	@type Element
	@description The actual object/element that the event originated from.
			
		For example, you could attach a listener to an 'ol' element to 
		listen for clicks. If the user clicked on an 'li' the source property 
		would be the 'li' element, and 'attachedTo' would be the 'ol'.
	*/
		

		
	/**
	@name glow.events.Event#preventDefault
	@function
	@description Prevent the default action of the event.
		Eg, if the click event on a link is cancelled, the link
		is not followed.
		       
		Returning false from an event listener has the same effect
		as calling this function.
		       
		For custom events, it's down to whatever fired the event
		to decide what to do in this case. See {@link glow.events.Event#defaultPrevented defaultPrevented}
		       
	@example
		myLinks.on('click', function(event) {
			event.preventDefault();
		});
		       
		// same as...
		       
		myLinks.on('click', function(event) {
			return false;
		});
	*/
	
	eventProto.preventDefault = function () {	
		this._defaultPrevented = true;		
	};

		
	/**
	@name glow.events.Event#defaultPrevented
	@function
	@description Has the default been prevented for this event?
		This should be used by whatever fires the event to determine if it should
		carry out of the default action.
		
	@returns {Boolean} Returns true if {@link glow.events.Event#preventDefault preventDefault} has been called for this event.
		
	@example
		// fire the 'show' event
		// read if the default action has been prevented
		if ( overlayInstance.fire('show').defaultPrevented() == false ) {
		    // go ahead and show
		}
	*/
	
	eventProto.defaultPrevented = function () {
		return this._defaultPrevented;
	};

	
	/* Export */
	glow.events = events;
});
Glow.provide(function(glow) {
	var document = window.document,
		undef = undefined,
		domEventHandlers = []; // like: domEventHandlers[uniqueId][eventName].count, domEventHandlers[uniqueId][eventName].callback
	
	/** 
		@name glow.events.DomEvent
		@constructor
		@extends glow.events.Event
		
		@param {Event|string} nativeEvent A native browser event read properties from, or the name of a native event.
		
		@param {Object} [properties] Properties to add to the Event instance.
		   Each key-value pair in the object will be added to the Event as
		   properties
		
		@description Describes a DOM event that occurred
		   You don't need to create instances of this class if you're simply
		   listening to events. One will be provided as the first argument
		   in your callback.
	*/
	function DomEvent(e, properties) {
		/** 
			@name glow.events.DomEvent#nativeEvent
			@type {Event | MouseEvent | UIEvent}
			@description The native event object provided by the browser.
		 */
		 this.nativeEvent = e;
		
		/** 
			@name glow.events.DomEvent#type
			@type {string}
			@description The native type of the event, like 'click' or 'keydown'.
		 */
		this.type = e.type;
		
		/** 
			@name glow.events.DomEvent#source
			@type {HTMLElement}
			@description The element that the event originated from.
				For example, you could attach a listener to an <ol> element to listen for
				clicks. If the user clicked on an <li> the source property would be the
				<li> element, and {@link glow.DomEvent#attachedTo attachedTo} would be
				the <ol>.
		*/
		if (e.target) { this.source = e.target; } // like FF
		else if (e.srcElement) { this.source = e.srcElement; } // like IE
		if (this.source && this.source.nodeType !== 1) { // like a textNode
			this.source = this.source.parentNode;
		}
		
		/** 
			@name glow.events.DomEvent#related
			@type {HTMLElement}
			@description A related HTMLElement
				For mouseover / mouseenter events, this will refer to the previous element
				the mouse was over.
				
				For mouseout / mouseleave events, this will refer to the element the mouse
				is now over.
		*/
		this.related = e.relatedTarget || (this.type == 'mouseover' ? e.fromElement : e.toElement);
		
		/** 
			@name glow.events.DomEvent#shiftKey
			@type {boolean | undefined}
			@description Was the shift key pressed during the event?
		*/
		this.shiftKey = (e.shiftKey === undef)? undef : !!e.shiftKey;
		
		/** 
			@name glow.events.DomEvent#altKey
			@type {boolean | undefined}
			@description Was the alt key pressed during the event?
		*/
		this.altKey = (e.altKey === undef)? undef : !!e.altKey;
		
		/** 
			@name glow.events.DomEvent#ctrlKey
			@type {boolean | undefined}
			@description Was the ctrl key pressed during the event?
		*/
		this.ctrlKey = (e.ctrlKey === undef)? undef : !!e.ctrlKey;
		
		/**
			@name glow.events.DomEvent#button
			@type {number | undefined}
			@description A number representing which button was pressed.
				0 for the left button, 1 for the middle button or 2 for the right button.
		*/
		this.button = glow.env.ie ? (e.button & 1 ? 0 : e.button & 2 ? 2 : 1) : e.button;
		
		/** 
			@name glow.events.DomEvent#mouseTop
			@type {number}
			@description The vertical position of the mouse pointer in the page in pixels.
		*/
		/** 
			@name glow.events.DomEvent#mouseLeft
			@type {number}
			@description The horizontal position of the mouse pointer in the page in pixels.
		*/
		if (e.pageX !== undef || e.pageY !== undef) {
			this.mouseTop = e.pageY;
			this.mouseLeft = e.pageX;
		}
		else if (e.clientX !== undef || e.clientY !== undef) {
			this.mouseTop = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			this.mouseLeft = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		}
		
		/** 
			@name glow.events.DomEvent#wheelData
			@type {number}
			@description The number of clicks the mouse wheel moved.
				Up values are positive, down values are negative.
		*/
		if (this.type == 'mousewheel') {
			// this works in latest opera, but have read that it needs to be switched in direction
			// if there was an opera bug, I can't find which version it was fixed in
			this.wheelDelta =
				e.wheelDelta ? e.wheelDelta / 120 :
				e.detail ? - e.detail / 3 :
				0;
		}
		
		for (var key in properties) {
			this[key] = properties[key];
		}
	}
	
	glow.util.extend(DomEvent, glow.events.Event); // DomEvent extends Event

	
	/**
		Add listener for an event fired by the browser.
		@private
		@name glow.events._addDomEventListener
		@see glow.NodeList#on
		@function
	*/
	glow.events._addDomEventListener = function(nodeList, eventName, callback, thisVal, selector) {
		var i = nodeList.length, // TODO: should we check that this nodeList is deduped?
			attachTo,
			id,
			eId = eventName + (selector? '/'+selector : '');
	
		while (i-- && nodeList[i]) {
			attachTo = nodeList[i];

			// will add a unique id to this node, if there is not one already
			glow.events.addListeners([attachTo], eventName, callback, thisVal);
			id = glow.events._getPrivateEventKey(attachTo);

			// check if there is already a handler for this kind of event attached
			// to this node (which will run all associated callbacks in Glow)
			if (!domEventHandlers[id]) { domEventHandlers[id] = {}; }

			if (domEventHandlers[id][eId] && domEventHandlers[id][eId].count > 0) { // already have handler in place
				domEventHandlers[id][eId].count++;
				continue;
			}

			// no bridge in place yet
			domEventHandlers[id][eId] = { callback: null, count:1 };
			
			// attach a handler to tell Glow to run all the associated callbacks
			(function(attachTo) {
				var handler = domHandle(attachTo, eventName, selector);
				
				if (attachTo.addEventListener) { // like DOM2 browsers	
					attachTo.addEventListener(handler.domName, handler, (eventName === 'focus' || eventName === 'blur')); // run in bubbling phase except for focus and blur, see: http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
				}
				else if (attachTo.attachEvent) { // like IE
					if (eventName === 'focus')  attachTo.attachEvent('onfocusin', handler); // see: http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
					else if (eventName === 'blur') attachTo.attachEvent('onfocusout', handler); // cause that's how IE rolls...
					attachTo.attachEvent('on' + handler.domName, handler);
				}
				// older browsers?
				
				domEventHandlers[id][eId].callback = handler;
			})(attachTo);
		}
	}
	
	function domHandle(attachTo, eventName, selector) {
		var handler;
		
		if (eventName === 'mouseenter') {
			handler = function(nativeEvent, node) {
				var e = new glow.events.DomEvent(nativeEvent),
					container = node || attachTo;
				
				if (!new glow.NodeList(container).contains(e.related)) {
					var result = glow.events._callListeners(attachTo, eventName, e, node); // fire() returns result of callback
					
					if (typeof result === 'boolean') { return result; }
					else { return !e.defaultPrevented(); }
				}
			};
			
			if (selector) {
				handler = delegate(attachTo, eventName, selector, handler);
			}
			
			handler.domName = 'mouseover';
		}
		else if (eventName === 'mouseleave') {
			handler = function(nativeEvent, node) {
				var e = new glow.events.DomEvent(nativeEvent),
					container = node || attachTo;
					
				if (!new glow.NodeList(container).contains(e.related)) {
					var result = glow.events._callListeners(attachTo, eventName, e, node); // fire() returns result of callback
					
					if (typeof result === 'boolean') { return result; }
					else { return !e.defaultPrevented(); }
				}
			};
			
			if (selector) {
				handler = delegate(attachTo, eventName, selector, handler);
			}
			
			handler.domName = 'mouseout';
		}
		else {
			handler = function(nativeEvent, node) {
				var domEvent = new glow.events.DomEvent(nativeEvent);
				var result = glow.events._callListeners(attachTo, eventName, domEvent, node); // fire() returns result of callback
				
				if (typeof result === 'boolean') { return result; }
				else { return !domEvent.defaultPrevented(); }
			};
			
			if (selector) {
				handler = delegate(attachTo, eventName, selector, handler);
			}
			
			handler.domName = eventName;
		}
		
		return handler;
	}
	
	// wraps a handler in code to detect delegation
	function delegate(attachTo, eventName, selector, handler) {
	
		return function(nativeEvent) { //console.log('dispatched, selector is: '+selector);
			var e = new glow.events.DomEvent(nativeEvent);
				node = e.source;
			
			// if the source matches the selector
			while (node) {
				if (!!glow._sizzle.matches(selector, [node]).length) {
					// the wrapped handler is called here, pass in the node that matched so it can be used as `this`
					return handler(nativeEvent, node);
					//
				}
				
				if (node === attachTo) { break; } // don't check parents above the attachTo
				
				node = node.parentNode;
			}
		};
	}
	
	/**
		Remove listener for an event fired by the browser.
		@private
		@name glow.events._removeDomEventListener
		@see glow.NodeList#detach
		@function
	*/
	glow.events._removeDomEventListener = function(nodeList, eventName, callback, selector) {
		var i = nodeList.length, // TODO: should we check that this nodeList is deduped?
			attachTo,
			id,
			eId = eventName + (selector? '/'+selector : ''),
			bridge,
			handler;
			
		while (i-- && nodeList[i]) {
			attachTo = nodeList[i];
			
			// skip if there is no bridge for this kind of event attached
			id = glow.events._getPrivateEventKey(attachTo);
			if (!domEventHandlers[id] && !domEventHandlers[id][eId]) { continue; }
			
			glow.events.removeListeners([attachTo], eventName, callback);

			bridge = domEventHandlers[id][eId]
			
			if (bridge.count > 0) {
				bridge.count--; // one less listener associated with this event
		
				if (bridge.count === 0) {  // no more listeners associated with this event
					// detach bridge handler to tell Glow to run all the associated callbacks
					
					handler = bridge.callback;
														
					if (attachTo.removeEventListener) { // like DOM2 browsers	
						attachTo.removeEventListener(handler.domName, handler, (eventName === 'focus' || eventName === 'blur')); // run in bubbling phase except for focus and blur, see: http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
					}
					else if (attachTo.detachEvent) { // like IE
						if (eventName === 'focus')  attachTo.detachEvent('onfocusin', handler); // see: http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
						else if (eventName === 'blur') attachTo.detachEvent('onfocusout', handler); // cause that's how IE rolls...
						attachTo.detachEvent('on' + handler.domName, handler);
					}
				}
			}
		}
	}

// see: http://developer.yahoo.com/yui/3/event/#eventsimulation
// see: http://developer.yahoo.com/yui/docs/YAHOO.util.UserAction.html
// 	function simulateDomEvent(nodeList, domEvent) {
// 		var i = nodeList.length,
// 			eventName = domEvent.type,
// 			nativeEvent,
// 			node,
// 			fire;
// 		
// 		if (document.createEvent) {
// 			var nativeEvent = document.createEvent('MouseEvent'); // see: 
// 			nativeEvent.initEvent(eventName, true, true);
// 			
// 			fire = function(el) {
// 				return !el.dispatchEvent(nativeEvent);
// 			}
// 		}
// 		else {
// 			fire = function(el) {
// 				var nativeEvent = document.createEventObject(); 
// 				return el.fireEvent('on'+eventName, nativeEvent);
// 			}
// 		}
// 		
// 		while (i--) {
// 			node = nodeList[i];
// 			if (node.nodeType !== 1) { continue; }
// 			fire(node);
// 		}
// 	}
	
	// export
	glow.events.DomEvent = DomEvent;
});
Glow.provide(function(glow) {
	var document = window.document,
		undefined,
        keyboardEventProto,
		$env = glow.env,
		// the keyCode for the last keydown (returned to undefined on keyup)
		activeKey,
		// the charCode for the last keypress (returned to undefined on keyup & keydown)
		activeChar,
		DomEvent = glow.events.DomEvent,
		_callListeners = glow.events._callListeners,
		_getPrivateEventKey = glow.events._getPrivateEventKey,
		// object of event names & listeners, eg:
		// {
		//    eventId: [
		//        2, // the number of glow listeners added for this node
		//        keydownListener,
		//        keypressListener,
		//        keyupListener
		//    ]
		// }
		// This lets us remove these DOM listeners from the node when the glow listeners reaches zero
		eventKeysRegistered = {}; 
	
	/** 
		@name glow.events.KeyboardEvent
		@constructor
		@extends glow.events.DomEvent
		
		@param {Event} nativeEvent A native browser event read properties from
		
		@param {Object} [properties] Properties to add to the Event instance.
		   Each key-value pair in the object will be added to the Event as
		   properties
		
		@description Describes a keyboard event that occurred
		   You don't need to create instances of this class if you're simply
		   listening to events. One will be provided as the first argument
		   in your callback.
	*/
	function KeyboardEvent(nativeEvent) {
		if (activeKey) {
			this.key = keyCodeToId(activeKey);
		}
		if (activeChar) {
			this.keyChar = String.fromCharCode(activeChar);
		}
		DomEvent.call(this, nativeEvent);
	}
    
    glow.util.extend(KeyboardEvent, DomEvent, {
        /** 
            @name glow.events.KeyboardEvent#key
            @type {string}
            @description The key pressed
				This is a string representing the key pressed.
				
				Alphanumeric keys are represented by 0-9 and A-Z uppercase. Other safe cross-browser values are:
				
				<dl>
					<li>backspace</li>
					<li>tab</li>
					<li>return</li>
					<li>shift</li>
					<li>alt</li>
					<li>escape</li>
					<li>space</li>
					<li>pageup</li>
					<li>pagedown</li>
					<li>end</li>
					<li>home</li>
					<li>left</li>
					<li>up</li>
					<li>right</li>
					<li>down</li>
					<li>insert</li>
					<li>delete</li>
					<li>;</li>
					<li>=</li>
					<li>-</li>
					<li>f1</li>
					<li>f2</li>
					<li>f3</li>
					<li>f4</li>
					<li>f5</li>
					<li>f6</li>
					<li>f7</li>
					<li>f8</li>
					<li>f9</li>
					<li>f10</li>
					<li>f11</li>
					<li>f12</li>
					<li>numlock</li>
					<li>scrolllock</li>
					<li>pause</li>
					<li>,</li>
					<li>.</li>
					<li>/</li>
					<li>[</li>
					<li>\</li>
					<li>]</li>
				</dl>
				
				Some keys may trigger actions in your browser and operating system, some
				are not cancelable.
                
            @example
				glow(document).on('keypress', function(event) {
					switch (event.key) {
						case 'up':
							// do stuff
							break;
						case 'down':
							// do stuff
							break;
					}
				});
        */
        key: '',
        /** 
            @name glow.events.KeyboardEvent#keyChar
            @type {string}
            @description The character entered.
                This is only available during 'keypress' events.
                
                If the user presses shift and 1, event.key will be "1", but event.keyChar
                will be "!".
                
            @example
                // only allow numbers to be entered into the ageInput field
				glow('#ageInput').on('keypress', function(event) {
					return !isNaN( Number(event.keyChar) );
				});
        */
        keyChar: ''
    });
	
	// add a dom listener
	function addListener(elm, name, callback) {
		if (elm.addEventListener) { // like DOM2 browsers	
			elm.addEventListener(name, callback, false);
		}
		else if (elm.attachEvent) { // like IE
			elm.attachEvent('on' + name, callback);
		}
	}
	
	// remove a dom listener
	function removeListener(elm, name, callback) {
		if (elm.removeEventListener) { // like DOM2 browsers	
			elm.removeEventListener(name, callback, false);
		}
		else if (elm.detachEvent) { // like IE
			elm.detachEvent('on' + name, callback);
		}
	}
	
	// takes a keyCode from a keydown listener and returns true if the browser will also fire a keypress
	function expectKeypress(keyCode, defaultPrevented) {
		var keyName;
		
		// for browsers that fire keypress for the majority of keys
		if ($env.gecko || $env.opera) {
			return !noKeyPress[keyCode];
		}
		
		// for browsers that only fire keypress for printable chars
		keyName = keyCodeToId(keyCode);
		
		// is this a printable char?
		if (keyName.length === 1 && !noKeyPress[keyCode]) {
			// webkit doesn't fire keypress if the keydown has been prevented
			return !($env.webkit && defaultPrevented);
		}
		return false;
	}
	
	// Add the key listeners for firing glow's normalised key events.
	// returns an entry for eventKeysRegistered
	function addDomKeyListeners(attachTo) {
		var keydownHandler, keypressHandler, keyupHandler,
			// Even though the user may only be interested in one key event, we need all 3 listeners to normalise any of them
			// hash of which keys are down, keyed by keyCode
			keysDown = {};
		
		keydownHandler = function(nativeEvent) {
			var keyCode = nativeEvent.keyCode,
				preventDefault,
				preventDefaultKeyPress;
			
			// some browsers repeat this event while a key is held down, we don't want to do that
			if ( !keysDown[keyCode] ) {
				activeKey = keyCode;
				activeChar = undefined;
				preventDefault = _callListeners( attachTo, 'keydown', new KeyboardEvent(nativeEvent) ).defaultPrevented();
				keysDown[keyCode] = true;
			}
			// we want to fire a keyPress event here if the browser isn't going to fire one itself
			if ( !expectKeypress(keyCode, preventDefault) ) {
				preventDefaultKeyPress = _callListeners( attachTo, 'keypress', new KeyboardEvent(nativeEvent) ).defaultPrevented();
			}
			// return false if either the keydown or fake keypress event was cancelled
			return !(preventDefault || preventDefaultKeyPress);
		};
		
		keypressHandler = function(nativeEvent) {
			// some browsers store the charCode in .charCode, some in .keyCode
			activeChar = nativeEvent.charCode || nativeEvent.keyCode;
			// some browsers fire this event for non-printable chars, look at the previous keydown and see if we're expecting a printable char
			if ( keyCodeToId(activeKey).length > 1 ) {
				// non-printable chars have an ID length greater than 1
				activeChar = undefined;
			}
			var preventDefault = _callListeners( attachTo, 'keypress', new KeyboardEvent(nativeEvent) ).defaultPrevented();
			return !preventDefault;
		};
		
		keyupHandler = function(nativeEvent) {
			var keyCode = nativeEvent.keyCode,
				preventDefault;
				
			activeKey = keyCode;
			activeChar = undefined;
			preventDefault = _callListeners( attachTo, 'keyup', new KeyboardEvent(nativeEvent) ).defaultPrevented();
			keysDown[keyCode] = false;
			activeKey = undefined;
			return !preventDefault;
		};
		
		// add listeners to the dom
		addListener(attachTo, 'keydown',  keydownHandler);
		addListener(attachTo, 'keypress', keypressHandler);
		addListener(attachTo, 'keyup',    keyupHandler);
		
		return [1, keydownHandler, keypressHandler, keyupHandler];
	}
	
	/**
		@name glow.events._addKeyListener
		@private
		@function
		@description Add listener for a key event fired by the browser.
		@see glow.NodeList#on
	*/
	glow.events._addKeyListener = function(nodeList, name, callback, thisVal) {
		var i = nodeList.length,
			attachTo,
			eventKey;
		
		// will add a unique id to this node, if there is not one already
		glow.events.addListeners(nodeList, name, callback, thisVal);
	
		while (i--) {
			attachTo = nodeList[i];

			// get the ID for this event
			eventKey = _getPrivateEventKey(attachTo);
			
			// if we've already attached DOM listeners for this, don't add them again
			if ( eventKeysRegistered[eventKey] ) {
				eventKeysRegistered[eventKey][0]++;
				continue;
			}
			else {
				eventKeysRegistered[eventKey] = addDomKeyListeners(attachTo);
			}
		}
	}
	
	/**
		Remove listener for an event fired by the browser.
		@private
		@name glow.events._removeKeyListener
		@see glow.NodeList#detach
		@function
	*/
	glow.events._removeKeyListener = function(nodeList, name, callback) {
		var i = nodeList.length,
			attachTo,
			eventKey,
			eventRegistry;
		
		// remove the glow events
		glow.events.removeListeners(nodeList, name, callback);
		
		while (i--) {
			attachTo = nodeList[i];
			
			// get the ID for this event
			eventKey = _getPrivateEventKey(attachTo);
			eventRegistry = eventKeysRegistered[eventKey];
			// exist if there are no key events registered for this node
			if ( !eventRegistry ) {
				return;
			}
			if ( --eventRegistry[0] === 0 ) {
				// our glow listener count is zero, we have no need for the dom listeners anymore
				removeListener( attachTo, 'keydown',   eventRegistry[1] );
				removeListener( attachTo, 'keypress',  eventRegistry[2] );
				removeListener( attachTo, 'keyup',     eventRegistry[3] );
				eventKeysRegistered[eventKey] = undefined;
			}
		}
	}
	
	// convert a keyCode to a string name for that key
	function keyCodeToId(keyCode) {
		// key codes for 0-9 A-Z are the same as their char codes
		if ( (keyCode >= keyCodeA && keyCode <= keyCodeZ) || (keyCode >= keyCode0 && keyCode <= keyCode9) ) {
			return String.fromCharCode(keyCode).toLowerCase();
		}
		return keyIds[keyCode] || 'unknown' + keyCode;
	}
	
	// keyCode to key name translation
	var keyCodeA = 'A'.charCodeAt(0),
		keyCodeZ = 'Z'.charCodeAt(0),
		keyCode0 = '0'.charCodeAt(0),
		keyCode9 = '9'.charCodeAt(0),
		// key codes for non-alphanumeric keys
		keyIds = {
			8: 'backspace',
			9: 'tab',
			13: 'return',
			16: 'shift',
			17: 'control',
			18: 'alt',
			19: 'pause',
			27: 'escape',
			32: 'space',
			33: 'pageup',
			34: 'pagedown',
			35: 'end',
			36: 'home',
			37: 'left',
			38: 'up',
			39: 'right',
			40: 'down',
			44: 'printscreen', // Only fires keyup in firefox, IE. Doesn't fire in webkit, opera.
			45: 'insert',
			46: 'delete',
			59: ';',
			61: '=',
			91: 'meta',
			93: 'menu', // no keycode in opera, doesn't fire in Chrome
			
			// these are number pad numbers, but Opera doesn't distinguish them from normal number keys so we normalise on that
				96: '0', 
				97: '1',
				98: '2',
				99: '3',
				100: '4',
				101: '5',
				102: '6',
				103: '7',
				104: '8',
				105: '9',
				106: '*', // opera fires 2 keypress events
				107: '+', // opera fires 2 keypress events
				109: '-', // opera sees - as insert
				110: '.', // opera sees this as n
				111: '/',
			// end of numpad
			
			112: 'f1',
			113: 'f2',
			114: 'f3',
			115: 'f4',
			116: 'f5',
			117: 'f6',
			118: 'f7',
			119: 'f8',
			120: 'f9',
			121: 'f10',
			122: 'f11',
			123: 'f12',
			144: 'numlock',
			145: 'scrolllock',
			188: ',',
			189: '-',
			190: '.',
			191: '/',
			192: "'",
			219: '[',
			220: '\\',
			221: ']',
			222: '#', // opera sees # key as 3. Pah.
			223: '`',
			224: 'meta', // same as [ in opera
			226: '\\' // this key appears on a US layout in webkit windows
		},
		noKeyPress = {};
	
	// corrections for particular browsers :(
	if ($env.gecko) {
		keyIds[107] = '=';
		
		noKeyPress = {
			16: 1,  // shift
			17: 1,  // control
			18: 1,  // alt
			144: 1, // numlock
			145: 1  // scrolllock
		};
	}
	else if ($env.opera) {
		keyIds[42] = '*';
		keyIds[43] = '+';
		keyIds[47] = '/';
		keyIds[222] = "'";
		keyIds[192] = '`';
		
		noKeyPress = {
			16: 1,  // shift
			17: 1,  // control
			18: 1   // alt
		};
	}
	else if ($env.webkit || $env.ie) {
		keyIds[186] = ';';
		keyIds[187] = '=';
	}
	
	// export
	glow.events.KeyboardEvent = KeyboardEvent;
});
Glow.provide(function(glow) {
	var NodeListProto, undefined,
		// shortcuts to aid compression
		document = window.document,
		arraySlice = Array.prototype.slice,
		arrayPush = Array.prototype.push;
	
	/**
		@name glow.NodeList
		@constructor
		@description An array-like collection of DOM Nodes
			It is recommended to create a NodeList using the shortcut function {@link glow}.
			
		@param {string | glow.NodeList | Node | Node[] | Window} contents Items to populate the NodeList with.
			This parameter will be passed to {@link glow.NodeList#push}.
			
			Strings will be treated as CSS selectors unless they start with '<', in which
			case they'll be treated as an HTML string.
			
		@example
			// empty NodeList
			var myNodeList = glow();

		@example
			// using glow to return a NodeList then chaining methods
			glow('p').addClass('eg').append('<div>Hello!</div>');
			
		@example
			// creating an element from a string
			glow('<div>Hello!</div>').appendTo('body');
		
		@see <a href="http://wiki.github.com/jeresig/sizzle/">Supported CSS selectors</a>
	*/
	function NodeList(contents) {
		// call push if we've been given stuff to add
		contents && this.push(contents);
	}
	NodeListProto = NodeList.prototype;
	
	/**
		@name glow.NodeList#length
		@type Number
		@description Number of nodes in the NodeList
		@example
			// get the number of paragraphs on the page
			glow('p').length;
	*/
	NodeListProto.length = 0;
	
	/**
		@name glow.NodeList._strToNodes
		@private
		@function
		@description Converts a string to an array of nodes
		
		@param {string} str HTML string
		
		@returns {Node[]} Array of nodes (including text / comment nodes)
	*/
	NodeList._strToNodes = (function() {
		var	tmpDiv = document.createElement('div'),
			// these wraps are in the format [depth to children, opening html, closing html]
			tableWrap = [1, '<table>', '</table>'],
			emptyWrap = [0, '', ''],
			// webkit won't accept <link> elms to be the only child of an element,
			// it steals them and hides them in the head for some reason. Using
			// broken html fixes it for some reason
			paddingWrap = [1, 'b<div>', '</div>'],
			trWrap = [3, '<table><tbody><tr>', '</tr></tbody></table>'],
			wraps = {
				caption: tableWrap,
				thead: tableWrap,
				th: trWrap,
				colgroup: tableWrap,
				tbody: tableWrap,
				tr: [2, '<table><tbody>', '</tbody></table>'],
				td: trWrap,
				tfoot: tableWrap,
				option: [1, '<select multiple="multiple">', '</select>'],
				legend: [1, '<fieldset>', '</fieldset>'],
				link: paddingWrap,
				script: paddingWrap,
				style: paddingWrap,
				'!': paddingWrap
			};
		
		function strToNodes(str) {
			var r = [],
				tagName = ( /^<([\w!]+)/.exec(str) || [] )[1],
				// This matches str content with potential elements that cannot
				// be a child of <div>.  elmFilter declared at top of page.
				wrap = wraps[tagName] || emptyWrap, 
				nodeDepth = wrap[0],
				childElm = tmpDiv,
				exceptTbody,
				rLen = 0,
				firstChild;
			
			// Create the new element using the node tree contents available in filteredElm.
			childElm.innerHTML = (wrap[1] + str + wrap[2]);
			
			// Strip newElement down to just the required elements' parent
			while(nodeDepth--) {
				childElm = childElm.lastChild;
			}
			
			// pull nodes out of child
			if (wrap === tableWrap && str.indexOf('<tbody') === -1) {
				// IE7 (and earlier) sometimes gives us a <tbody> even though we didn't ask for one
				while (firstChild = childElm.firstChild) {
					if (firstChild.nodeName != 'TBODY') {
						r[rLen++] = firstChild;
					}
					childElm.removeChild(firstChild);
				}
			}
			else {
				while (firstChild = childElm.firstChild) {
					r[rLen++] = childElm.removeChild(firstChild);
				}
			}
			
			return r;
		}
		
		return strToNodes;
	})();
	
	// takes a collection and returns an array
	var collectionToArray = function(collection) {
		return arraySlice.call(collection, 0);
	};
	
	try {
		// look out for an IE bug
		arraySlice.call( document.documentElement.childNodes, 0 );
	}
	catch(e) {
		collectionToArray = function(collection) {
			// We can't use this trick on IE collections that are com-based, like HTMLCollections
			// Thankfully they don't have a constructor, so that's how we detect those
			if (collection instanceof Object) {
				return arraySlice.call(collection, 0);
			}
			var i   = collection.length,
				arr = [];
				
			while (i--) {
				arr[i] = collection[i];
			}
			return arr;
		}
	}
	
	/**
		@name glow.NodeList#push
		@function
		@description Adds nodes to the NodeList
		
		@param {string | Node | Node[] | glow.NodeList} nodes Node(s) to add to the NodeList
			Strings will be treated as CSS selectors or HTML strings.
		
		@returns {glow.NodeList}
		
		@example
			myNodeList.push('<div>Foo</div>').push('h1');
	*/
	NodeListProto.push = function(nodes) {
		/*!debug*/
			if (arguments.length !== 1) {
				glow.debug.warn('[wrong count] glow.NodeList#push expects 1 argument, not '+arguments.length+'.');
			}
		/*gubed!*/
		
		if (nodes) {
			if (typeof nodes === 'string') {
				// if the string begins <, treat it as html, otherwise it's a selector
				if (nodes.charAt(0) === '<') {
					nodes = NodeList._strToNodes(nodes);
				}
				else {
					nodes = glow._sizzle(nodes)
				}
				arrayPush.apply(this, nodes);
			}
			
			else if ( nodes.nodeType || nodes.window == nodes ) {
				if (this.length) {
					arrayPush.call(this, nodes);
				}
				else {
					this[0] = nodes;
					this.length = 1;
				}
			}
			else if (nodes.length !== undefined) {
				if (nodes.constructor != Array) {
					// convert array-like objects into an array
					nodes = collectionToArray(nodes);
				}
				arrayPush.apply(this, nodes);
			}
			/*!debug*/
			else {
				glow.debug.warn('[wrong type] glow.NodeList#push: Ignoring unexpected argument type, failing silently');
			}
			/*gubed!*/
		}
		/*!debug*/
		else {
			glow.debug.warn('[wrong type] glow.NodeList#push: Ignoring false argument type, failing silently');
		}
		/*gubed!*/
		return this;
	};
	
	/**
		@name glow.NodeList#eq
		@function
		@description Compares this NodeList to another
			Returns true if both NodeLists contain the same items in the same order
		
		@param {Node | Node[] | glow.NodeList} nodeList The NodeList to compare to.
		
		@returns {boolean}
		
		@see {@link glow.NodeList#is} for testing if a NodeList item matches a selector
		
		@example
			// the following returns true
			glow('#blah').eq( document.getElementById('blah') );
	*/
	NodeListProto.eq = function(nodeList) {
		/*!debug*/
			if (arguments.length !== 1) {
				glow.debug.warn('[wrong count] glow.NodeList#eq expects 1 argument, not ' + arguments.length + '.');
			}
			if (typeof nodeList !== 'object') {
				glow.debug.warn('[wrong type] glow.NodeList#eq expects object argument, not ' + typeof nodeList + '.');
			}
		/*gubed!*/
		
		var len = this.length,
			i = len;
		
		// normalise param to NodeList
		if ( !(nodeList instanceof NodeList) ) {
			nodeList = new NodeList(nodeList);
		}
		
		// quickly return false if lengths are different
		if (len != nodeList.length) {
			return false;
		}
		
		// loop through and return false on inequality
		while (i--) {
			if (this[i] !== nodeList[i]) {
				return false;
			}
		}
		
		return true;
	};
	
	/**
		@name glow.NodeList#slice
		@function
		@description Get a section of an NodeList
			Operates in the same way as an Array's slice method
		
		@param {number} start Start index
			If negative, it specifies a position measured from the end of the list
		
		@param {number} [end] End index
			By default, this is the end of the list. A negative end specifies
			a position measured from the end of the list.
		
		@returns {glow.NodeList} A new sliced NodeList
		
		@example
		var myNodeList = glow("<div></div><p></p>");
		myNodeList.slice(1, 2); // selects the paragraph
		myNodeList.slice(-1); // same thing, selects the paragraph
	*/
	NodeListProto.slice = function(/*start, end*/) {
		return new NodeList( arraySlice.apply(this, arguments) );
	};
	
	/**
		@name glow.NodeList#sort
		@function
		@description Sort the elements in the list.
			Items will already be in document order if a CSS selector
			was used to fetch them.
		
		@param {Function} [func] Function to determine sort order
			This function will be passed 2 elements (elementA, elementB). The function
			should return a number less than 0 to sort elementA lower than elementB
			and greater than 0 to sort elementA higher than elementB.
			
			If no function is provided, elements will be sorted in document order.
		
		@returns {glow.NodeList} A new sorted NodeList
		
		@example
			//get links in alphabetical (well, lexicographical) order
			var links = glow("a").sort(function(elementA, elementB) {
				return glow(elementA).text() < glow(elementB).text() ? -1 : 1;
			})
	*/
	NodeListProto.sort = function(func) {
		var items = collectionToArray(this),
			sortedElms = func ? items.sort(func) : glow._sizzle.uniqueSort(items);
		
		return new NodeList(sortedElms);
	};
	
	/**
		@name glow.NodeList#item
		@function
		@description Get a single item from the list as an NodeList
			Negative numbers can be used to get items from the end of the
			list.
		
		@param {number} index The numeric index of the node to return.
		
		@returns {glow.NodeList} A new NodeList containing a single item
		
		@example
			// get the html from the fourth element
			myNodeList.item(3).html();
			
		@example
			// add a class name to the last item
			myNodeList.item(-1).addClass('last');
	*/
	NodeListProto.item = function(index) {
		/*!debug*/
			if ( arguments.length !== 1 ) {
				glow.debug.warn('[wrong count] glow.NodeList#item expects 1 argument, got ' + arguments.length);
			}
		/*gubed!*/
		// TODO: test which of these methods is faster (use the current one unless significantly slower)
		return this.slice(index, (index + 1) || this.length);
		// return new NodeList( index < 0 ? this[this.length + index] : this[index] );
	};
	
	/**
		@name glow.NodeList#each
		@function
		@description Calls a function for each node in the list.
		
		@param {Function} callback The function to call for each node.
			The function will be passed 2 arguments, the index of the current item,
			and the NodeList being iterated over.
			
			Inside the function 'this' refers to the Node.
			
			Returning false from this function stops further iterations
		
		@returns {glow.NodeList}
		
		@example
			// add "link number: x" to each link, where x is the index of the link
			glow("a").each(function(i, nodeList) {
				glow(this).append(' link number: ' + i);
			});
		@example
			// breaking out of an each loop
			glow("a").each(function(i, nodeList) {
				// do stuff
				if ( glow(this).hasClass('whatever') ) {
					// we don't want to process any more links
					return false;
				}
			});
	*/
	NodeListProto.each = function(callback) {
		/*!debug*/
			if ( arguments.length !== 1 ) {
				glow.debug.warn('[wrong count] glow.NodeList#each expects 1 argument, got ' + arguments.length);
			}
			if (typeof callback != 'function') {
				glow.debug.warn('[wrong type] glow.NodeList#each expects "function", got ' + typeof callback);
			}
		/*gubed!*/
		for (var i = 0, len = this.length; i<len; i++) {
			if ( callback.call(this[i], i, this) === false ) {
				break;
			}
		}
		return this;
	};
	
	/**
		@name glow.NodeList#filter
		@function
		@description Filter the NodeList
		 
		@param {Function|string} test Filter test
			If a string is provided it's treated as a CSS selector. Elements
			which match the CSS selector are added to the new NodeList.
			
			If 'test' is a function, it will be called per node in the NodeList.
			
			The function is passed 2 arguments, the index of the current item,
			and the ElementList being itterated over.
			
			Inside the function 'this' refers to the node.
			Return true to add the element to the new NodeList.
		 
		@returns {glow.NodeList} A new NodeList containing the filtered nodes
		 
		@example
			// return images with a width greater than 320
			glow("img").filter(function () {
				return glow(this).width() > 320;
			});
		
		@example
			// Get items that don't have an alt attribute
			myElementList.filter(':not([alt])');
	*/
	NodeListProto.filter = function(test) {
		/*!debug*/
			if ( arguments.length !== 1 ) {
				glow.debug.warn('[wrong count] glow.NodeList#filter expects 1 argument, got ' + arguments.length);
			}
			if ( !/^(function|string)$/.test(typeof test) ) {
				glow.debug.warn('[wrong type] glow.NodeList#each expects function/string, got ' + typeof test);
			}
		/*gubed!*/
		var r = [],
			ri = 0;
		
		if (typeof test === 'string') {
			r = glow._sizzle.matches(test, this);
		}
		else {	
			for (var i = 0, len = this.length; i<len; i++) {
				if ( test.call(this[i], i, this) ) {
					r[ri++] = this[i];
				}
			}
		}
		
		return new NodeList(r);
	};

	
	/**
		@name glow.NodeList#is
		@function
		@description Tests if the first element matches a CSS selector

		@param {string} selector CSS selector
		
		@returns {boolean}
		
		@example
			if ( myNodeList.is(':visible') ) {
				// ...
			}
	*/
	NodeListProto.is = function(selector) {
		/*!debug*/
			if ( arguments.length !== 1 ) {
				glow.debug.warn('[wrong count] glow.NodeList#is expects 1 argument, got ' + arguments.length);
			}
			if ( typeof selector !== 'string' ) {
				glow.debug.warn('[wrong type] glow.NodeList#is expects string, got ' + typeof selector);
			}
		/*gubed!*/
		if ( !this[0] ) {
			return false;
		}
		return !!glow._sizzle.matches( selector, [ this[0] ] ).length;
	};
	
	// export
	glow.NodeList = NodeList;
});
Glow.provide(function(glow) {
	var undef
		, NodeListProto = glow.NodeList.prototype
	
		/**
			@private
			@name glow.NodeList-dom0PropertyMapping
			@description Mapping of HTML attribute names to DOM0 property names.
		*/
		, dom0PropertyMapping = { // keys must be lowercase
			'class'     : 'className',
			'for'       : 'htmlFor',
			'maxlength' : 'maxLength'
		}
		
		/**
			@private
			@name glow.NodeList-dataPropName
			@type String
			@description The property name added to the DomElement by the NodeList#data method.
		*/
		, dataPropName = '_uniqueData' + glow.UID
		
		/**
			@private
			@name glow.NodeList-dataIndex
			@type String
			@description The value of the dataPropName added by the NodeList#data method.
		*/
		, dataIndex = 1 // must be a truthy value
			
		/**
			@private
			@name glow.NodeList-dataCache
			@type Object
			@description Holds the data used by the NodeList#data method.
			
			The structure is like:
			[
				{
					myKey: "my data"
				}
			]
		*/
		, dataCache = [];
			
	/**
	@name glow.NodeList#addClass
	@function
	@description Adds a class to each node.

	@param {string} name The name of the class to add.

	@returns {glow.NodeList}

	@example
		glow("#login a").addClass("highlight");
	*/
	NodeListProto.addClass = function(name) {
		var i = this.length;
		
		/*!debug*/
			if (arguments.length !== 1) {
				glow.debug.warn('[wrong count] glow.NodeList#addClass expects 1 argument, not '+arguments.length+'.');
			}
			else if (typeof arguments[0] !== 'string') {
				glow.debug.warn('[wrong type] glow.NodeList#addClass expects argument 1 to be of type string, not '+typeof arguments[0]+'.');
			}
		/*gubed!*/
		
		while (i--) {
			if (this[i].nodeType === 1) {
				_addClass(this[i], name);
			}
		}
		
		return this;
	};
	
	function _addClass(node, name) { // TODO: handle classnames separated by non-space characters?
		if ( (' ' + node.className + ' ').indexOf(' ' + name + ' ') === -1 ) {
			node.className += (node.className? ' ' : '') + name;
		}
	}
	
	/**
	@name glow.NodeList#attr
	@function
	@description Gets or sets attributes.

		When getting an attribute, it is retrieved from the first
		node in this NodeList. Setting attributes applies the change
		to each element in this NodeList.

		To set an attribute, pass in the name as the first
		parameter and the value as a second parameter.

		To set multiple attributes in one call, pass in an object of
		name/value pairs as a single parameter.

		For browsers that don't support manipulating attributes
		using the DOM, this method will try to do the right thing
		(i.e. don't expect the semantics of this method to be
		consistent across browsers as this is not possible with
		currently supported browsers).

	@param {string | Object} name The name of the attribute, or an object of name/value pairs
	@param {string} [value] The value to set the attribute to.

	@returns {string | undefined | glow.NodeList}

		When setting attributes this method returns its own NodeList, otherwise
		returns the attribute value. The attribute name is always treated as
		case-insensitive. When getting, the returned value will be of type string unless
		that particular attribute was never set and there is no default value, in which
		case the returned value will be an empty string.

	@example
		var myNodeList = glow(".myImgClass");

		// get an attribute
		myNodeList.attr("class");

		// set an attribute
		myNodeList.attr("class", "anotherImgClass");

		// set multiple attributes
		myNodeList.attr({
		  src: "a.png",
		  alt: "Cat jumping through a field"
		});
	 */
	 // see: http://tobielangel.com/2007/1/11/attribute-nightmare-in-ie/
	NodeListProto.attr = function(/*arguments*/) {
		var args = arguments,
			argsLen = args.length,
			thisLen = this.length,
			name = keyvals = args[0], // using this API: attr(name) or attr({key: val}) ?
			dom0Property = '',
			node,
			attrNode;
		
		/*!debug*/
			if (arguments.length === 2 && typeof arguments[0] !== 'string') {glow.debug.warn('[wrong type] glow.NodeList#attr expects name to be of type string, not '+typeof arguments[0]+'.'); }
			else if (arguments.length === 1 && (typeof arguments[0] !== 'string' && arguments[0].constructor !== Object)) {glow.debug.warn('[wrong type] glow.NodeList#attr expects argument 1 to be of type string or an instance of Object.'); }
			else if (arguments.length === 0 ||  arguments.length > 2) { glow.debug.warn('[wrong count] glow.NodeList#attr expects 1 or 2 arguments, not '+arguments.length+'.'); }
		/*gubed!*/
		
		if (this.length === 0) { // is this an empty nodelist?
			return (argsLen > 1)? this : undef;
		}
		
		if (typeof keyvals === 'object') { // SETting value from {name: value} object
			for (name in keyvals) {
				if (!keyvals.hasOwnProperty(name)) { continue; }
				
				// in IE6 and IE7 the attribute name needs to be translated into dom property name
				if (glow.env.ie < 8) {
					dom0Property = dom0PropertyMapping[name.toLowerCase()];
				}
				
				var i = thisLen;
				while (i--) {
					node = this[i];
					
					if (node.nodeType !== 1) { continue; }
					
					if (dom0Property) {
						node[dom0Property] = keyvals[name];
					}
					else {
						node.setAttribute(name, keyvals[name], 0); // IE flags, 0: case-insensitive
					}
				}
			}
			
			return this;
		}
		else {
			node = this[0];
				
			if (node.nodeType !== 1) {
				return (argsLen > 1)? this : undef;
			}

			if (argsLen === 1) { // GETting value from name
				if (node.attributes[name]) { // in IE node.getAttributeNode sometimes returns unspecified default values so we look for specified attributes if we can
					return (!node.attributes[name].specified)? '' : node.attributes[name].value;
				}
				else if (node.getAttributeNode) { // in IE getAttribute() does not always work so we use getAttributeNode if we can
					attrNode = node.getAttributeNode(name, 0);
					return (attrNode === null)? '' : attrNode.value;
				}
				else {
					value = node.getAttribute(name, 0, 2); // IE flags, 0: case-insensitive, 2: as string
					return (value === null)? '' : value;
				}	
			}
			else { // SETting a single value like attr(name, value), normalize to an keyval object
				if (glow.env.ie < 8) {
					dom0Property = dom0PropertyMapping[name.toLowerCase()];
				}
				
				if (dom0Property) {
					node[dom0Property] = args[1];
				}
				else {
					node.setAttribute(name, args[1], 0); // IE flags, 0: case-insensitive
				}
				return this;
			}
		}
	};
	/**
		Copies the data from one nodelist to another
		@private
		@name glow.NodeList._copyData
		@see glow.NodeList#clone
		@function
	*/
	glow.NodeList._copyData = function(from, to){
		if ( !from[dataPropName] ){
			return;
		}
		else{			
			to = new glow.NodeList(to);
			to.data( dataCache[from[dataPropName]] );			
			return;
		}
		
	}
	/**
		Used to remove the data when a node is destroyed
		@private
		@name glow.NodeList._copyData
		@see glow.NodeList#destroy
		@function
	*/
	glow.NodeList._destroyData = function(removeFrom){
		if ( !removeFrom && !removeFrom[0][dataPropName] ){
			return;
		}
		else{
			removeFromNode = new glow.NodeList(removeFrom);
			removeFromNode.removeData();			
			return;
		}
		
	}
	/**
	@name glow.NodeList#data
	@function
	@description Use this to safely attach arbitrary data to any DOM Element.
	
	This method is useful when you wish to avoid memory leaks that are possible when adding your own data directly to DOM Elements.
	
	When called with no arguments, will return glow's entire data store for the first node in this NodeList.
	
	Otherwise, when given a name, will return the associated value from the first node in this NodeList.
	
	When given both a name and a value, will store that data on every node in this NodeList.
	
	Optionally you can pass in a single object composed of multiple name, value pairs.
	
	@param {string|Object} [key] The name of the value in glow's data store.
	@param {Object} [val] The value you wish to associate with the given name.
	@see glow.NodeList#removeData
	@example
	
	glow("p").data("tea", "milky");
	var colour = glow("p").data("tea"); // milky
	@returns {Object} When setting a value this method can be chained, as in that case it will return itself.
	@see glow.NodeList#removeData
	*/
	NodeListProto.data = function (key, val) { /*debug*///console.log("data("+key+", "+val+")");
		var args = arguments,
			argsLen = args.length,
			keyvals = key, // like: data({key: val}) or data(key, val)
			index,
			node;
		
		/*!debug*/
			if (arguments.length === 2 && typeof arguments[0] !== 'string') {glow.debug.warn('[wrong type] glow.NodeList#data expects name argument to be of type string.'); }
			else if (arguments.length === 1 && (typeof arguments[0] !== 'string' && arguments[0].constructor !== Object)) {glow.debug.warn('[wrong type] glow.NodeList#data expects argument 1 to be of type string or an instance of Object.'); }
			else if (arguments.length > 2) { glow.debug.warn('[wrong count] glow.NodeList#data expects 0, 1 or 2 arguments.'); }
		/*gubed!*/
		
		if (argsLen > 1) { // SET key, val on every node
			var i = this.length;
			while (i--) {
				node = this[i];
				if (node.nodeType !== 1) { continue; }
				
				index = node[dataPropName];
				if (!index) { // assumes index is always > 0
					index = dataIndex++;
					
					node[dataPropName] = index;
					dataCache[index] = {};
				}
				dataCache[index][key] = val;
			}
			
			return this; // chainable with (key, val) signature
		}
		else if (typeof keyvals === 'object') { // SET keyvals on every node
			var i = this.length;
			while (i--) {
				node = this[i];
				if (node.nodeType !== 1) { continue; }
				
				index = node[dataPropName];
				if (!index) { // assumes index is always > 0
					index = dataIndex++;
					
					node[dataPropName] = index;
					dataCache[index] = {};
				}
				for (key in keyvals) {
					dataCache[index][key] = keyvals[key];
				}
			}
			
			return this; // chainable with ({key, val}) signature
		}
		else { // GET from first node
			node = this[0];
			if (node === undef || node.nodeType !== 1) { return undef; }
				
			if ( !(index = node[dataPropName]) ) {
				return undef;
			}
			
			if (key) {
				return dataCache[index][key];
			}
			
			// get the entire data cache object for this node
			return dataCache[index];
		}
	};
	
	/**
	@name glow.NodeList#hasAttr
	@function
	@description Does the node have a particular attribute?
		
		The first node in this NodeList is tested.
		
	@param {string} name The name of the attribute to test for.

	@returns {boolean|undefined} Returns undefined if the first node is not an element,
	or if the NodeList is empty, otherwise returns true/false to indicate if that attribute exists
	on the first element.

	@example
		if ( glow("#myImg").hasAttr("alt") ){
			// ...
		}
	*/
	NodeListProto.hasAttr = function(name) {
		var node;
		
		/*!debug*/
			if (arguments.length !== 1) { glow.debug.warn('[wrong count] glow.NodeList#hasAttr expects 1 argument.'); }
			else if (typeof arguments[0] !== 'string') {glow.debug.warn('[wrong type] glow.NodeList#hasAttr expects argument 1 to be of type string.'); }
		/*gubed!*/
		
		node = this[0];
		
		if (this.length && node.nodeType === 1) {
			if (node.attributes[name]) { // is an object in  IE, or else: undefined in IE < 8, null in IE 8
				return !!node.attributes[name].specified;
			}
			
			if (node.hasAttribute) { return node.hasAttribute(name); } // like FF, Safari, etc
			else { return node.attributes[name] !== undef; } // like IE7
		}
	};
	
	/**
	@name glow.NodeList#hasClass
	@function
	@description Does the node have a particular class?

		The first node in this NodeList is tested.

	@param {string} name The name of the class to test for.

	@returns {boolean}

	@example
		if ( glow("#myInput").hasClass("errored") ){
			// ...
		}
	*/
	NodeListProto.hasClass = function (name) {
		/*!debug*/
			if (arguments.length !== 1) { glow.debug.warn('[wrong count] glow.NodeList#hasClass expects 1 argument.'); }
			else if (typeof arguments[0] !== 'string') {glow.debug.warn('[wrong type] glow.NodeList#hasClass expects argument 1 to be of type string.'); }
		/*gubed!*/
		
		if (this.length && this[0].nodeType === 1) {
			return ( (' ' + this[0].className + ' ').indexOf(' ' + name + ' ') > -1 );
		}
	};
	
	/**
	@name glow.NodeList#prop
	@function
	@description Gets or sets node properties.
	
		This function gets / sets node properties, to get attributes,
		see {@link glow.NodeList#attr NodeList#attr}.
		
		When getting a property, it is retrieved from the first
		node in this NodeList. Setting properties to each element in
		this NodeList.
		
		To set multiple properties in one call, pass in an object of
		name/value pairs.
		
	@param {string | Object} name The name of the property, or an object of name/value pairs
	@param {string} [value] The value to set the property to.

	@returns {string | glow.NodeList}

		When setting properties it returns the NodeList, otherwise
		returns the property value.

	@example
		var myNodeList = glow("#formElement");

		// get the node name
		myNodeList.prop("nodeName");

		// set a property
		myNodeList.prop("_secretValue", 10);

		// set multiple properties
		myNodeList.prop({
			checked: true,
			_secretValue: 10
		});
	*/
	NodeListProto.prop = function(name, val) {
		var hash = name,
			argsLen = arguments.length;
		
		/*!debug*/
			if (arguments.length === 1 && (typeof name !== 'string' && name.constructor !== Object)) {glow.debug.warn('[wrong type] glow.NodeList#prop expects argument 1 to be of type string or Object.'); }
			else if (arguments.length === 2 && typeof name !== 'string') {glow.debug.warn('[wrong type] glow.NodeList#prop expects name to be of type string.'); }
			else if (arguments.length === 0 || arguments.length > 2) { glow.debug.warn('[wrong count] glow.NodeList#prop expects 1 or 2 arguments.'); }
		/*gubed!*/
		
		if (this.length === 0) return;
		
		if (argsLen === 2 && typeof name === 'string') {
			for (var i = 0, ilen = this.length; i < ilen; i++) {
				if (this[i].nodeType === 1) { this[i][name] = val; }
			}
			return this;
		}
		else if (argsLen === 1 && hash.constructor === Object) {
			for (var key in hash) {
				for (var i = 0, ilen = this.length; i < ilen; i++) {
					if (this[i].nodeType === 1) { this[i][key] = hash[key]; }
				}
			}
			return this;
		}
		else if (argsLen === 1 && typeof name === 'string') {
			if (this[0].nodeType === 1) { return this[0][name]; }
		}
		else {
			throw new Error('Invalid parameters.');
		}
	};
	
	/**
	@name glow.NodeList#removeAttr
	@function
	@description Removes an attribute from each node.

	@param {string} name The name of the attribute to remove.

	@returns {glow.NodeList}

	@example
		glow("a").removeAttr("target");
	*/
	NodeListProto.removeAttr = function (name) {
		var dom0Property;
		
		/*!debug*/
			if (arguments.length !== 1) { glow.debug.warn('[wrong count] glow.NodeList#removeAttr expects 1 argument.'); }
			else if (typeof arguments[0] !== 'string') {glow.debug.warn('[wrong type] glow.NodeList#removeAttr expects argument 1 to be of type string.'); }
		/*gubed!*/
	
		for (var i = 0, leni = this.length; i < leni; i++) {
			if (this[i].nodeType === 1) {
				if (glow.env.ie < 8) {
					if ( (dom0Property = dom0PropertyMapping[name.toLowerCase()]) ) {
						this[i][dom0Property] = '';
					}
				}
				
				if (this[i].removeAttribute) this[i].removeAttribute(name);
			}
		}
		return this;
	};
	
	/**
	@name glow.NodeList#removeClass
	@function
	@description Removes a class from each node.

	@param {string} name The name of the class to remove.

	@returns {glow.NodeList}

	@example
		glow("#footer #login a").removeClass("highlight");
	*/
	NodeListProto.removeClass = function(name) {
		var node;
					
		/*!debug*/
			if (arguments.length !== 1) { glow.debug.warn('[wrong count] glow.NodeList#removeClass() expects 1 argument.'); }
			else if (typeof arguments[0] !== 'string') {glow.debug.warn('[wrong type] glow.NodeList#removeClass() expects argument 1 to be of type string.'); }
		/*gubed!*/
		
		var i = this.length;
		while (i--) {
			node = this[i];
			if (node.className) {
				_removeClass(node, name);
			}
		}
		return this;
	};
	
	function _removeClass(node, name) {
		var oldClasses = node.className.split(' '),
			newClasses = [];
			
		oldClasses = node.className.split(' ');
		newClasses = [];
		
		var i = oldClasses.length;
		while (i--) {
			if (oldClasses[i] !== name) {
				oldClasses[i] && newClasses.unshift(oldClasses[i]); // unshift to maintain original order
			}
		}
		node.className = (newClasses.length)? newClasses.join(' ') : '';
	}
	
	/**
	@name glow.NodeList#removeData
	@function
	@description Removes data previously added by {@link glow.NodeList#data} from each node in this NodeList.
	
	When called with no arguments, will delete glow's entire data store for each node in this NodeList.
	
	Otherwise, when given a name, will delete the associated value from each node in this NodeList.
	
	@param {string} [key] The name of the value in glow's data store.
	@see glow.NodeList#data
	*/
	NodeListProto.removeData = function(key) {
		var elm,
			i = this.length,
			index;
			// uses private scoped variables: dataCache, dataPropName
		
		/*!debug*/
			if (arguments.length > 1) { glow.debug.warn('[wrong count] glow.NodeList#removeData expects 0 or 1 arguments.'); }
			else if (arguments.length === 1 && typeof arguments[0] !== 'string') {glow.debug.warn('[wrong type] glow.NodeList#removeData expects argument 1 to be of type string.'); }
		/*gubed!*/
		
		while (i--) {
			elm = this[i];
			index = elm[dataPropName];
			
			if (index !== undef) {
				switch (arguments.length) {
					case 0:
						dataCache[index] = undef;
						elm[dataPropName] = undef;
						try {
							delete elm[dataPropName]; // IE 6 goes wobbly here
						}
						catch(e) { // remove expando from IE 6
							elm.removeAttribute && elm.removeAttribute(dataPropName);
						}
						break;
					case 1:
						dataCache[index][key] = undef;
						delete dataCache[index][key];
						break;
				}
			}
		}
		
		return this; // chainable
	};
	
	/**
	@name glow.NodeList#toggleClass
	@function
	@description Toggles a class on each node.

	@param {string} name The name of the class to toggle.

	@returns {glow.NodeList}

	@example
		glow(".onOffSwitch").toggleClass("on");
	 */
	NodeListProto.toggleClass = function(name) {
		var node;
		
		/*!debug*/
			if (arguments.length !== 1) { glow.debug.warn('[wrong count] glow.NodeList#toggleClass() expects 1 argument.'); }
			else if (typeof arguments[0] !== 'string') {glow.debug.warn('[wrong type] glow.NodeList#toggleClass() expects argument 1 to be of type string.'); }
		/*gubed!*/
		
		for (var i = 0, leni = this.length; i < leni; i++) {
			node = this[i];
			if (node.className) {
				if ( (' ' + node.className + ' ').indexOf(' ' + name + ' ') > -1 ) {
					_removeClass(node, name);
				}
				else {
					_addClass(node, name);
				}
			}
		}
		
		return this;
	};
	
	/**
	@name glow.NodeList#val
	@function
	@description Gets or sets form values for the first node.

		<p><em>This method is not applicable to XML NodeLists.</em></p>

		<p><em>Getting values from form elements</em></p>

		The returned value depends on the type of element, see below:

		<dl>
		<dt>Radio button or checkbox</dt>
		<dd>If checked, then the contents of the value attribute, otherwise an empty string.</dd>
		<dt>Select</dt>
		<dd>The contents of value attribute of the selected option</dd>
		<dt>Select (multiple)</dt>
		<dd>An array of selected option values.</dd>
		<dt>Other form element</dt>
		<dd>The value of the input.</dd>
		</dl>

		<p><em>Getting values from a form</em></p>

		If the first element in the NodeList is a form, then an
		object is returned containing the form data. Each item
		property of the object is a value as above, apart from when
		multiple elements of the same name exist, in which case the
		it will contain an array of values.

		<p><em>Setting values for form elements</em></p>

		If a value is passed and the first element of the NodeList
		is a form element, then the form element is given that value.
		For select elements, this means that the first option that
		matches the value will be selected. For selects that allow
		multiple selection, the options which have a value that
		exists in the array of values/match the value will be
		selected and others will be deselected.

		Currently checkboxes and radio buttons are not checked or
		unchecked, just their value is changed. This does mean that
		this does not do exactly the reverse of getting the value
		from the element (see above) and as such may be subject to
		change

		<p><em>Setting values for forms</em></p>

		If the first element in the NodeList is a form and the
		value is an object, then each element of the form has its
		value set to the corresponding property of the object, using
		the method described above.

	@param {String | Object} [value] The value to set the form element/elements to.

	@returns {glow.dom.NodeList | String | Object}

		When used to set a value it returns the NodeList, otherwise
		returns the value as described above.

	@example
		// get a value
		var username = glow.dom.get("input#username").val();

	@example			
		/ get values from a form
		var userDetails = glow.dom.get("form").val();

	@example
		// set a value
		glow.dom.get("input#username").val("example username");

	@example
		// set values in a form
		glow.dom.get("form").val({
			username : "another",
			name     : "A N Other"
		});
	*/
	NodeListProto.val = function(){
		/*
			PrivateFunction: elementValue
			Get a value for a form element.
		*/

		function elementValue (el) {
			var elType = el.type,
				elChecked = el.checked,
				elValue = el.value,
				vals = [],
				i = 0;

			if (elType == "radio") {
				return elChecked ? elValue : "";
			} else if (elType == "checkbox") {
				return elChecked ? elValue : "";
			} else if (elType == "select-one") {
				return el.selectedIndex > -1 ?
					el.options[el.selectedIndex].value : "";
				} else if (elType == "select-multiple") {
				for (var length = el.options.length; i < length; i++) {
					if (el.options[i].selected) {
						vals[vals.length] = el.options[i].value;
					}
				}
				return vals;
			} else {
				return elValue;
			}
		}

		/*
		PrivateMethod: formValues
			Get an object containing form data.
		*/
		function formValues (form) {
			var vals = {},
				radios = {},
				formElements = form.elements,
				i = 0,
				length = formElements.length,
				name,
				formElement,
				j,
				radio,
				nodeName;

			for (; i < length; i++) {
				formElement = formElements[i];
				nodeName = formElement.nodeName.toLowerCase();
				name = formElement.name;
				
				// fieldsets & objects come back as form elements, but we don't care about these
				// we don't bother with fields that don't have a name
				// switch to whitelist?
				if (
					nodeName == "fieldset" ||
					nodeName == "object" ||
					!name
				) { continue; }
				if (formElement.type == "checkbox" && ! formElement.checked) {
					if (! name in vals) {
						vals[name] = undefined;
					}
				} else if (formElement.type == "radio") {
					if (radios[name]) {
						radios[name][radios[name].length] = formElement;
					} else {
						radios[name] = [formElement];
					}
				} else {
					var value = elementValue(formElement);
					if (name in vals) {
						if (vals[name].push) {
							vals[name][vals[name].length] = value;
						} else {
							vals[name] = [vals[name], value];
						}
					} else {
						vals[name] = value;
					}
				}
			}
			for (i in radios) {
				j = 0;
				for (length = radios[i].length; j < length; j++) {
					radio = radios[i][j];
					name = radio.name;
					if (radio.checked) {
						vals[radio.name] = radio.value;
						break;
					}
				}
				if (! name in vals) { vals[name] = undefined; }
			}
			return vals;
		}

		/*
		PrivateFunction: setFormValues
			Set values of a form to those in passed in object.
		*/
		function setFormValues (form, vals) {
			var prop, currentField,
				fields = {},
				storeType, i = 0, n, len, foundOne, currentFieldType;

			for (prop in vals) {
				currentField = form[prop];
				if (currentField && currentField[0] && !currentField.options) { // is array of fields
					//normalise values to array of vals
					vals[prop] = vals[prop] && vals[prop].push ? vals[prop] : [vals[prop]];
					//order the fields by types that matter
					fields.radios = [];
					fields.checkboxesSelects = [];
					fields.multiSelects = [];
					fields.other = [];

					for (i = 0; currentField[i]; i++) {
						currentFieldType = currentField[i].type;
						if (currentFieldType == "radio") {
							storeType = "radios";
					} else if (currentFieldType == "select-one" || currentFieldType == "checkbox") {
							storeType = "checkboxesSelects";
						} else if (currentFieldType == "select-multiple") {
							storeType = "multiSelects";
						} else {
							storeType = "other";
						}
						//add it to the correct array
						fields[storeType][fields[storeType].length] = currentField[i];
					}

					for (i = 0; fields.multiSelects[i]; i++) {
						vals[prop] = setValue(fields.multiSelects[i], vals[prop]);
					}
					for (i = 0; fields.checkboxesSelects[i]; i++) {
						setValue(fields.checkboxesSelects[i], "");
						for (n = 0, len = vals[prop].length; n < len; n++) {
							if (setValue(fields.checkboxesSelects[i], vals[prop][n])) {
								vals[prop].slice(n, 1);
								break;
							}
						}
					}
					for (i = 0; fields.radios[i]; i++) {
						fields.radios[i].checked = false;
						foundOne = false;
						for (n = 0, len = vals[prop].length; n < len; n++) {
							if (setValue(fields.radios[i], vals[prop][n])) {
								vals[prop].slice(n, 1);
								foundOne = true;
								break;
							}
							if (foundOne) { break; }
						}
					}
					for (i = 0; fields.other[i] && vals[prop][i] !== undefined; i++) {
						setValue(fields.other[i], vals[prop][i]);
					}
				} else if (currentField && currentField.nodeName) { // is single field, easy
					setValue(currentField, vals[prop]);
				}
			}
		}

		/*
		PrivateFunction: setValue
			Set the value of a form element.
			Returns:
			values that weren't able to set if array of vals passed (for multi select). Otherwise true if val set, false if not
		*/
		function setValue (el, val) {
			var i = 0,
				length,
				n = 0,
				nlen,
				elOption,
				optionVal;

				if (el.type == "select-one") {
				for (length = el.options.length; i < length; i++) {
					if (el.options[i].value == val) {
						el.selectedIndex = i;
						return true;
					}
				}
				return false;
			} else if (el.type == "select-multiple") {
				var isArray = !!val.push;
				for (i = 0, length = el.options.length; i < length; i++) {
					elOption = el.options[i];
					optionVal = elOption.value;
					if (isArray) {
						elOption.selected = false;
						for (nlen = val.length; n < nlen; n++) {
							if (optionVal == val[n]) {
								elOption.selected = true;
								val.splice(n, 1);
								break;
							}
						}
					} else {
						return elOption.selected = val == optionVal;
					}
				}
				return false;
			} else if (el.type == "radio" || el.type == "checkbox") {
				el.checked = val == el.value;
				return val == el.value;
			} else {
				el.value = val;
				return true;
			}
		}

		// toplevel implementation
	
		var args = arguments,
			val = args[0],
			that = this,
			i = 0,
			length = that.length;

		if (args.length === 0) {
			return that[0].nodeName == 'FORM' ?
				formValues(that[0]) :
				elementValue(that[0]);
		}
		if (that[0].nodeName == 'FORM') {
			if (! typeof val == 'object') {
				throw 'value for FORM must be object';
			}
			setFormValues(that[0], val);
		} else {
			for (; i < length; i++) {
				setValue(that[i], val);
			}
		}
		return that;		
	};
});
/*!
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function(){
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function(selector, context, results, seed) {
	results = results || [];
	var origContext = context = context || document;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var parts = [], m, set, checkSet, extra, prune = true, contextXML = isXML(context),
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	while ( (chunker.exec(""), m = chunker.exec(soFar)) !== null ) {
		soFar = m[3];
		
		parts.push( m[1] );
		
		if ( m[2] ) {
			extra = m[3];
			break;
		}
	}

	if ( parts.length > 1 && origPOS.exec( selector ) ) {
		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );
		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}
	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {
			var ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ? Sizzle.filter( ret.expr, ret.set )[0] : ret.set[0];
		}

		if ( context ) {
			var ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );
			set = ret.expr ? Sizzle.filter( ret.expr, ret.set ) : ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray(set);
			} else {
				prune = false;
			}

			while ( parts.length ) {
				var cur = parts.pop(), pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}
		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		throw "Syntax error, unrecognized expression: " + (cur || selector);
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );
		} else if ( context && context.nodeType === 1 ) {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}
		} else {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}
	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function(results){
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort(sortOrder);

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[i-1] ) {
					results.splice(i--, 1);
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function(expr, set){
	return Sizzle(expr, null, null, set);
};

Sizzle.find = function(expr, context, isXML){
	var set, match;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var type = Expr.order[i], match;
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice(1,1);

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context, isXML );
				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = context.getElementsByTagName("*");
	}

	return {set: set, expr: expr};
};

Sizzle.filter = function(expr, set, inplace, not){
	var old = expr, result = [], curLoop = set, match, anyFound,
		isXMLFilter = set && set[0] && isXML(set[0]);

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.match[ type ].exec( expr )) != null ) {
				var filter = Expr.filter[ type ], found, item;
				anyFound = false;

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;
					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;
								} else {
									curLoop[i] = false;
								}
							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				throw "Syntax error, unrecognized expression: " + expr;
			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],
	match: {
		ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
	},
	leftMatch: {},
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	attrHandle: {
		href: function(elem){
			return elem.getAttribute("href");
		}
	},
	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !/\W/.test(part),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},
		">": function(checkSet, part){
			var isPartStr = typeof part === "string";

			if ( isPartStr && !/\W/.test(part) ) {
				part = part.toLowerCase();

				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}
			} else {
				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},
		"": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				var nodeCheck = part = part.toLowerCase();
				checkFn = dirNodeCheck;
			}

			checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
		},
		"~": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				var nodeCheck = part = part.toLowerCase();
				checkFn = dirNodeCheck;
			}

			checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
		}
	},
	find: {
		ID: function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? [m] : [];
			}
		},
		NAME: function(match, context){
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [], results = context.getElementsByName(match[1]);

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},
		TAG: function(match, context){
			return context.getElementsByTagName(match[1]);
		}
	},
	preFilter: {
		CLASS: function(match, curLoop, inplace, result, not, isXML){
			match = " " + match[1].replace(/\\/g, "") + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}
					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},
		ID: function(match){
			return match[1].replace(/\\/g, "");
		},
		TAG: function(match, curLoop){
			return match[1].toLowerCase();
		},
		CHILD: function(match){
			if ( match[1] === "nth" ) {
				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},
		ATTR: function(match, curLoop, inplace, result, not, isXML){
			var name = match[1].replace(/\\/g, "");
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},
		PSEUDO: function(match, curLoop, inplace, result, not){
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);
				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
					if ( !inplace ) {
						result.push.apply( result, ret );
					}
					return false;
				}
			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},
		POS: function(match){
			match.unshift( true );
			return match;
		}
	},
	filters: {
		enabled: function(elem){
			return elem.disabled === false && elem.type !== "hidden";
		},
		disabled: function(elem){
			return elem.disabled === true;
		},
		checked: function(elem){
			return elem.checked === true;
		},
		selected: function(elem){
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			elem.parentNode.selectedIndex;
			return elem.selected === true;
		},
		parent: function(elem){
			return !!elem.firstChild;
		},
		empty: function(elem){
			return !elem.firstChild;
		},
		has: function(elem, i, match){
			return !!Sizzle( match[3], elem ).length;
		},
		header: function(elem){
			return /h\d/i.test( elem.nodeName );
		},
		text: function(elem){
			return "text" === elem.type;
		},
		radio: function(elem){
			return "radio" === elem.type;
		},
		checkbox: function(elem){
			return "checkbox" === elem.type;
		},
		file: function(elem){
			return "file" === elem.type;
		},
		password: function(elem){
			return "password" === elem.type;
		},
		submit: function(elem){
			return "submit" === elem.type;
		},
		image: function(elem){
			return "image" === elem.type;
		},
		reset: function(elem){
			return "reset" === elem.type;
		},
		button: function(elem){
			return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
		},
		input: function(elem){
			return /input|select|textarea|button/i.test(elem.nodeName);
		}
	},
	setFilters: {
		first: function(elem, i){
			return i === 0;
		},
		last: function(elem, i, match, array){
			return i === array.length - 1;
		},
		even: function(elem, i){
			return i % 2 === 0;
		},
		odd: function(elem, i){
			return i % 2 === 1;
		},
		lt: function(elem, i, match){
			return i < match[3] - 0;
		},
		gt: function(elem, i, match){
			return i > match[3] - 0;
		},
		nth: function(elem, i, match){
			return match[3] - 0 === i;
		},
		eq: function(elem, i, match){
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function(elem, match, i, array){
			var name = match[1], filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;
			} else if ( name === "not" ) {
				var not = match[3];

				for ( var i = 0, l = not.length; i < l; i++ ) {
					if ( not[i] === elem ) {
						return false;
					}
				}

				return true;
			} else {
				throw "Syntax error, unrecognized expression: " + name;
			}
		},
		CHILD: function(elem, match){
			var type = match[1], node = elem;
			switch (type) {
				case 'only':
				case 'first':
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}
					if ( type === "first" ) { 
						return true; 
					}
					node = elem;
				case 'last':
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}
					return true;
				case 'nth':
					var first = match[2], last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 
						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;
					if ( first === 0 ) {
						return diff === 0;
					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},
		ID: function(elem, match){
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},
		TAG: function(elem, match){
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		CLASS: function(elem, match){
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},
		ATTR: function(elem, match){
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},
		POS: function(elem, match, i, array){
			var name = match[2], filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS;

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + /(?![^\[]*\])(?![^\(]*\))/.source );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source );
}

var makeArray = function(array, results) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 );

// Provide a fallback method if it does not work
} catch(e){
	makeArray = function(array, results) {
		var ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );
		} else {
			if ( typeof array.length === "number" ) {
				for ( var i = 0, l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}
			} else {
				for ( var i = 0; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.compareDocumentPosition ? -1 : 1;
		}

		var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( "sourceIndex" in document.documentElement ) {
	sortOrder = function( a, b ) {
		if ( !a.sourceIndex || !b.sourceIndex ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.sourceIndex ? -1 : 1;
		}

		var ret = a.sourceIndex - b.sourceIndex;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( document.createRange ) {
	sortOrder = function( a, b ) {
		if ( !a.ownerDocument || !b.ownerDocument ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.ownerDocument ? -1 : 1;
		}

		var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
		aRange.setStart(a, 0);
		aRange.setEnd(a, 0);
		bRange.setStart(b, 0);
		bRange.setEnd(b, 0);
		var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
function getText( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += getText( elem.childNodes );
		}
	}

	return ret;
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date).getTime();
	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	var root = document.documentElement;
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
			}
		};

		Expr.filter.ID = function(elem, match){
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );
	root = form = null; // release memory in IE
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function(match, context){
			var results = context.getElementsByTagName(match[1]);

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";
	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {
		Expr.attrHandle.href = function(elem){
			return elem.getAttribute("href", 2);
		};
	}

	div = null; // release memory in IE
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle, div = document.createElement("div");
		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function(query, context, extra, seed){
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && context.nodeType === 9 && !isXML(context) ) {
				try {
					return makeArray( context.querySelectorAll(query), extra );
				} catch(e){}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		div = null; // release memory in IE
	})();
}

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function(match, context, isXML) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	div = null; // release memory in IE
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}
					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

var contains = document.compareDocumentPosition ? function(a, b){
	return a.compareDocumentPosition(b) & 16;
} : function(a, b){
	return a !== b && (a.contains ? a.contains(b) : true);
};

var isXML = function(elem){
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function(selector, context){
	var tmpSet = [], later = "", match,
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// Add Sizzle to Glow
// This file is injected into sizzle.js by the ant "deps" target
Glow.provide(function(glow) {
	glow._sizzle = Sizzle;
});

return;


window.Sizzle = Sizzle;

})();
Glow.provide(function(glow) {
	var NodeListProto = glow.NodeList.prototype
	/*
		PrivateVar: ucheck
			Used by unique(), increased by 1 on each use
		*/
		,	ucheck = 1
	/*
		PrivateVar: ucheckPropName
			This is the property name used by unique checks
		*/

	, ucheckPropName = "_unique" + glow.UID;
	/*
		PrivateMethod: unique
			Get an array of nodes without duplicate nodes from an array of nodes.

		Arguments:
			aNodes - (Array|<NodeList>)

		Returns:
			An array of nodes without duplicates.
		*/
		//worth checking if it's an XML document?
		if (glow.env.ie) {
			var unique = function(aNodes) {
				if (aNodes.length == 1) { return aNodes; }

				//remove duplicates
				var r = [],
					ri = 0,
					i = 0;

				for (; aNodes[i]; i++) {
					if (aNodes[i].getAttribute(ucheckPropName) != ucheck && aNodes[i].nodeType == 1) {
						r[ri++] = aNodes[i];
					}
					aNodes[i].setAttribute(ucheckPropName, ucheck);
				}
				for (i=0; aNodes[i]; i++) {
					aNodes[i].removeAttribute(ucheckPropName);
				}
				ucheck++;
				return r;
			}
		} else {
			var unique = function(aNodes) {
				if (aNodes.length == 1) { return aNodes; }

				//remove duplicates
				var r = [],
					ri = 0,
					i = 0;

				for (; aNodes[i]; i++) {
					if (aNodes[i][ucheckPropName] != ucheck && aNodes[i].nodeType == 1) {
						r[ri++] = aNodes[i];
					}
					aNodes[i][ucheckPropName] = ucheck;
				}
				ucheck++;
				return r;
			}
		};
	/**
	@name glow.NodeList#parent
	@function
	@description Gets the unique parent nodes of each node as a new NodeList.
	@param {string | HTMLElement | NodeList} [search] Search value
		If provided, will seek the next parent element until a match is found
	@returns {glow.NodeList}

		Returns a new NodeList containing the parent nodes, with
		duplicates removed

	@example
		// elements which contain links
		var parents = glow.dom.get("a").parent();
	*/
	NodeListProto.parent = function(search) {
		var ret = [],
			ri = 0,
			i = this.length,
			node;
			
		while (i--) {				
			node = this[i];
			if (node.nodeType == 1) {
				if(search){						
					while(node = node.parentNode){											
						if (glow._sizzle.filter(search, [node]).length) {
							ret[ri++] = node;							
							break;
						}							
					}
				}
			
				else if(node = node.parentNode){
						ret[ri++] = node;						
				}

			}

		}
				
		return new glow.NodeList(unique(ret));			
	};
	
	/* Private method for prev() and next() */
	function getNextOrPrev(nodelist, dir, search) {
		var ret = [],
			ri = 0,
			node,
			i = 0,
			length = nodelist.length;

		while (i < length) {			
			node = nodelist[i];			
			if(search){
				while (node = node[dir + 'Sibling']) {					
					if (node.nodeType == 1 && node.nodeName != '!') {						
						if (glow._sizzle.filter(search, [node]).length) {
							ret[ri++] = node;							
							break;
						}					
					}					
				}
			}
			else{
				while (node = node[dir + 'Sibling']) {					
					if (node.nodeType == 1 && node.nodeName != '!') {
							ret[ri++] = node;							
							 break;					
					}					
				}	
			}
		i++;
		}
		return new glow.NodeList(ret);
	}
	
	/**
	@name glow.NodeList#prev
	@function
	@description Gets the previous sibling element for each node in the ElementList.
		If a filter is provided, the previous item that matches the filter is returned, or
		none if no match is found.
	@param {string | HTMLElement | NodeList} [search] Search value
		If provided, will seek the previous sibling element until a match is found
	@returns {glow.ElementList}
		A new ElementList containing the previous sibling elements that match the (optional)
		filter.
	@example
		// gets the element before #myLink (if there is one)
		var next = glow.get("#myLink").prev();
	@example
		// get the previous sibling link element before #skipLink
		glow.get('#skipLink').prev('a')
	*/
	NodeListProto.prev = function(search) {
		return getNextOrPrev(this, 'previous', search);
	};
	
	/**
	@name glow.NodeList#next
	@function
	@description Gets the next sibling element for each node in the ElementList.
		If a filter is provided, the next item that matches the filter is returned, or
		none if no match is found.
	@param {string | HTMLElement | NodeList} [search] Search value
		If provided, will seek the next sibling element until a match is found
	@returns {glow.ElementList}
		A new ElementList containing the next sibling elements that match the (optional)
		filter.
	@example
		// gets the element following #myLink (if there is one)
		var next = glow.get("#myLink").next();
	@example
		// get the next sibling link element after #skipLink
		glow.get('#skipLink').next('a')
	*/
	NodeListProto.next = function(search) {
		return getNextOrPrev(this, 'next', search);	
	};
	
	
	/**
	@name glow.NodeList#get
	@function
	@description Gets decendents of nodes that match a CSS selector.

	@param {String} selector CSS selector

	@returns {glow.NodeList}
		Returns a new NodeList containing matched elements

	@example
		// create a new NodeList
		var myNodeList = glow.dom.create("<div><a href='s.html'>Link</a></div>");

		// get 'a' tags that are decendants of the NodeList nodes
		myNewNodeList = myNodeList.get("a");
	*/
	NodeListProto.get = function(selector) {
		var ret = [],
			i = this.length;

		while (i--) {			
			glow._sizzle(selector, this[i], ret);
			
		}
		// need to remove uniqueSorts because they're slow. Replace with own method for unique.
		return new glow.NodeList(unique(ret));
	};
	
	
	
	/**
	@name glow.NodeList#ancestors
	@function
	@description Gets the unique ancestor nodes of each node as a new NodeList.
	@param {Function|string} [filter] Filter test
		If a string is provided, it is used in a call to {@link glow.ElementList#is ElementList#is}.
		If a function is provided it will be passed 2 arguments, the index of the current item,
		and the ElementList being itterated over.
		Inside the function 'this' refers to the HTMLElement.
		Return true to keep the node, or false to remove it.
	@returns {glow.dom.NodeList}
		Returns NodeList

		@example
		// get ancestor elements for anchor elements 
		var ancestors = glow.dom.get("a").ancestors();
	*/
	NodeListProto.ancestors = function(filter) {
		var ret = [],
			ri = 0,
			i = 0,
			length = this.length,
			node;
					
		while (i < length) {
			node = this[i].parentNode;
					
			while (node && node.nodeType == 1) {							
				ret[ri++] = node;
				node = node.parentNode;
			}								
		i++;
		}
		if(filter){
            ret = new glow.NodeList(ret);
			ret = ret.filter(filter);
		}
		return new glow.NodeList(unique(ret));
	};
	
	/*
		Private method to get the child elements for an html node (used by children())
	*/
		function getChildElms(node) {
			var r = [],
				childNodes = node.childNodes,
				i = 0,
				ri = 0;
			
			for (; childNodes[i]; i++) {
				if (childNodes[i].nodeType == 1 && childNodes[i].nodeName != '!') {
					r[ri++] = childNodes[i];
				}
			}
			return r;
		}
	
	/**
	@name glow.NodeList#children
	@function
	@description Gets the child elements of each node as a new NodeList.

	@returns {glow.dom.NodeList}

		Returns a new NodeList containing all the child nodes
				
	@example
		// get all list items
		var items = glow.dom.get("ul, ol").children();
	*/
	NodeListProto.children = function() {
		var ret = [],
			i = this.length;
				
		while(i--) {
			ret = ret.concat( getChildElms(this[i]) );
		}
		return new glow.NodeList(ret);	
	};
	
	/**
	@name glow.NodeList#contains
	@function
	@description Find if this NodeList contains the given element
		
	@param {string | HTMLELement | NodeList} Single element to check for

	@returns {boolean}
		myElementList.contains(elm)
		// Returns true if an element in myElementList contains elm, or IS elm.
	*/
	NodeListProto.contains = function(elm) {
		var i = 0,
			node = new glow.NodeList(elm)[0],
			length = this.length,
			newNodes,
			toTest;

		// missing some nodes? Return false
		if ( !node || !this.length ) {
			return false;
		}
	
		if (this[0].compareDocumentPosition) { //w3 method
			while (i < length) {
				//break out if the two are teh same
				if(this[i] == node){
					break;
				}
				//check against bitwise to see if node is contained in this
				else if (!(this[i].compareDocumentPosition(node) & 16)) {								
					return false;
				}
			i++;
			}
		}
		else if(node.contains){					
			for (; i < length; i++) {
				if ( !( this[i].contains( node  ) ) ) {
					return false;
				}
			}
		}				
		else { //manual method for last chance corale
			while (i < length) {
				toTest = node;
				while (toTest = toTest.parentNode) {
					if (this[i] == toTest) { break; }
				}
				if (!toTest) {
					return false;
				}
			i++;
			}
		}
			
		return true;
	};
});
Glow.provide(function(glow) {
	var NodeListProto = glow.NodeList.prototype,
		document = window.document,
		undefined;
	
	// create a fragment and insert a set of nodes into it
	function createFragment(nodes) {
		var fragment = document.createDocumentFragment(),
			i = 0,
			node;
		
		while ( node = nodes[i++] ) {
			fragment.appendChild(node);
		}
		
		return fragment;
	}
	
	// generate the #before and #after methods
	// after: 1 for #(insert)after, 0 for #(insert)before
	// insert: 1 for #insert(After|Before), 0 for #(after|before)
	function afterAndBefore(after, insert) {
		return function(elements) {
			var toAddList,
				toAddToList,
				fragmentToAdd,
				nextFragmentToAdd,
				item,
				itemParent;
			
			if (!this.length) { return this; }
			
			// normalise 'elements'
			// if we're dealing with append/prepend then strings are always treated as HTML strings
			if (!insert && typeof elements === 'string') {
				elements = new glow.NodeList( glow.NodeList._strToNodes(elements) );
			}
			else {
				elements = new glow.NodeList(elements);
			}
			
			// set the element we're going to add to, and the elements we're going to add
			if (insert) {
				toAddToList = elements;
				toAddList = new glow.NodeList(this);
			}
			else {
				toAddToList = this;
				toAddList = elements;
			}
			
			nextFragmentToAdd = createFragment(toAddList);
			
			for (var i = 0, leni = toAddToList.length, lasti = leni - 1; i < leni; i++) {
				item = toAddToList[i];
				fragmentToAdd = nextFragmentToAdd;
				
				// we can only append after if the element has a parent right?
				if (itemParent = item.parentNode) {
					if (i !== lasti) { // if not the last item
						nextFragmentToAdd = fragmentToAdd.cloneNode(true);
						insert && toAddList.push(nextFragmentToAdd.childNodes);
					}
					itemParent.insertBefore(fragmentToAdd, after ? item.nextSibling : item);
				}
			}
			
			return insert ? toAddList : toAddToList;
		}
	}
	
	// generate the #append, #appendTo, #prepend and #prependTo methods
	// append: 1 for #append(To), 0 for #prepend(To)
	// to: 1 for #(append|prepend)To, 0 for #(append|prepend)
	function appendAndPrepend(append, to) {
		return function(elements) {
			var toAddList,
				toAddToList,
				fragmentToAdd,
				nextFragmentToAdd,
				item;
			
			if (!this.length) { return this; }
			
			// normalise 'elements'
			// if we're dealing with append/prepend then strings are always treated as HTML strings
			if (!to && typeof elements === 'string') {
				elements = new glow.NodeList( glow.NodeList._strToNodes(elements) );
			}
			else {
				elements = new glow.NodeList(elements);
			}
				
			// set the element we're going to add to, and the elements we're going to add
			if (to) {
				toAddToList = elements;
				toAddList = new glow.NodeList(this);
			}
			else {
				toAddToList = this;
				toAddList = elements;
			}
			
			nextFragmentToAdd = createFragment(toAddList);
			
			for (var i = 0, leni = toAddToList.length, lasti = leni - 1; i < leni; i++) {
				item = toAddToList[i];
				fragmentToAdd = nextFragmentToAdd;
				
				// avoid trying to append to non-elements
				if (item.nodeType === 1) {
					if (i !== lasti) { // if not the last item
						nextFragmentToAdd = fragmentToAdd.cloneNode(true);
						// add the clones to the return element for appendTo / prependTo
						to && toAddList.push(nextFragmentToAdd.childNodes);
					}
					item.insertBefore(fragmentToAdd, append ? null : item.firstChild);
				}
			}
			
			return to ? toAddList : toAddToList;
		}
	}
	
	/**
		@name glow.NodeList#after
		@function
		@description Insert node(s) after each node in this NodeList.
			If there is more than one node in this NodeList, 'nodes'
			will be inserted after the first element and clones will be
			inserted after each subsequent element.
			
		@param {string | HTMLElement | HTMLElement[] | glow.NodeList} nodes Node(s) to insert
			Strings will be treated as HTML strings.
		
		@returns {glow.NodeList} Original NodeList
		
		@example
			// adds a paragraph after each heading
			glow('h1, h2, h3').after('<p>That was a nice heading.</p>');
	*/
	NodeListProto.after = afterAndBefore(1);
	
	/**
		@name glow.NodeList#before
		@function
		@description Insert node(s) before each node in this NodeList.
			If there is more than one node in this NodeList, 'nodes'
			will be inserted before the first element and clones will be
			inserted before each subsequent element.
			
		@param {string | HTMLElement | HTMLElement[] | glow.NodeList} nodes Node(s) to insert
			Strings will be treated as HTML strings.
		
		@returns {glow.NodeList} Original NodeList
		
		@example
			// adds a div before each paragraph
			glow('p').before('<div>Here comes a paragraph!</div>');
	*/
	NodeListProto.before = afterAndBefore(0);
	
	/**
		@name glow.NodeList#append
		@function
		@description Appends node to each node in this NodeList.
			If there is more than one node in this NodeList, then the given nodes
			are appended to the first node and clones are appended to the other
			nodes.
			
		@param {string | HTMLElement | HTMLElement[] | glow.NodeList} nodes Nodes(s) to append
			Strings will be treated as HTML strings.
		
		@returns {glow.NodeList} Original NodeList
		
		@example
			// ends every paragraph with '...'
			glow('p').append('<span>...</span>');
	*/
	NodeListProto.append = appendAndPrepend(1);
	
	/**
		@name glow.NodeList#prepend
		@function
		@description Prepends nodes to each node in this NodeList.
			If there is more than one node in this NodeList, then the given nodes
			are prepended to the first node and clones are prepended to the other
			nodes.
			
		@param {string | HTMLElement | HTMLElement[] | glow.NodeList} nodes Nodes(s) to prepend
			Strings will be treated as HTML strings.
		
		@returns {glow.NodeList} Original NodeList
		
		@example
			// prepends every paragraph with 'Paragraph: '
			glow('p').prepend('<span>Paragraph: </span>');
	*/
	NodeListProto.prepend = appendAndPrepend(0);
	
	/**
		@name glow.NodeList#appendTo
		@function
		@description Appends nodes in this NodeList to given node(s)
			If appending to more than one node, the NodeList is appended
			to the first node and clones are appended to the others.
			
		@param {string | HTMLElement | HTMLElement[] | glow.NodeList} node Node(s) to append to.
			Strings will be treated as CSS selectors or HTML strings.
		
		@returns {glow.NodeList} The appended nodes.
		
		@example
			// appends '...' to every paragraph
			glow('<span>...</span>').appendTo('p');
	*/
	NodeListProto.appendTo = appendAndPrepend(1, 1);

	/**
		@name glow.NodeList#prependTo
		@function
		@description Prepends nodes in this NodeList to given node(s)
			If prepending to more than one node, the NodeList is prepended
			to the first node and clones are prepended to the others.
			
		@param {string | HTMLElement | HTMLElement[] | glow.NodeList} node Node(s) to prepend to
			Strings will be treated as CSS selectors or HTML strings.
		
		@returns {glow.NodeList} The prepended nodes.
		
		@example
			// prepends 'Paragraph: ' to every paragraph
			glow('<span>Paragraph: </span>').prependTo('p');
	*/
	NodeListProto.prependTo = appendAndPrepend(0, 1);
	
	/**
		@name glow.NodeList#insertAfter
		@function
		@description Insert this NodeList after the given nodes
			If inserting after more than one node, the NodeList is inserted
			after the first node and clones are inserted after the others.
			
		@param {string | HTMLElement | HTMLElement[] | glow.NodeList} nodes Node(s) to insert after
			Strings will be treated as CSS selectors.
			
		@returns {glow.NodeList} Inserted nodes.
		
		@example
			// adds a paragraph after each heading
			glow('<p>HAI!</p>').insertAfter('h1, h2, h3');
	*/
	NodeListProto.insertAfter = afterAndBefore(1, 1);
	
	/**
		@name glow.NodeList#insertBefore
		@function
		@description Insert this NodeList before the given nodes
			If inserting before more than one node, the NodeList is inserted
			before the first node and clones are inserted before the others.
			
		@param {string | HTMLElement | HTMLElement[] | glow.NodeList} nodes Node(s) to insert before
			Strings will be treated as CSS selectors.
			
		@returns {glow.NodeList} Inserted nodes.
		
		@example
			// adds a div before each paragraph
			glow('<div>Here comes a paragraph!</div>').insertBefore('p');
	*/
	NodeListProto.insertBefore = afterAndBefore(0, 1);
	
	/**
		@name glow.NodeList#destroy
		@function
		@description Removes each element from the document
			The element, attached listeners & attached data will be
			destroyed to free up memory.
			
			Detroyed elements may not be reused in some browsers.
			
		@returns {glow.NodeList} An empty NodeList
		
		@example
			// destroy all links in the document
			glow("a").destroy();
	*/
	var tmpDiv = document.createElement('div');
	
	NodeListProto.destroy = function() {
		glow.NodeList._destroyData(this);
		this.appendTo(tmpDiv);
		tmpDiv.innerHTML = '';
		return new glow.NodeList();
	};
	
	/**
		@name glow.NodeList#remove
		@function
		@description Removes each element from the document
			If you no longer need the elements, consider using
			{@link glow.NodeList#destroy destroy}
			
		@returns {glow.NodeList} The removed elements

		@example
			// take all the links out of a document
			glow("a").remove();
	*/
	NodeListProto.remove = function() {
		var parent,
			node,
			i = this.length;
		
		while (i--) {
			node = this[i];
			if (parent = node.parentNode) {
				parent.removeChild(node);
			}
		}
		
		return this;
	};
	
	/**
		@name glow.NodeList#empty
		@function
		@description Removes the nodes' contents

		@returns {glow.NodeList} Original nodes

		@example
			// remove the contents of all textareas
			glow("textarea").empty();
	*/
	// TODO: is this shortcut worth doing?
	NodeListProto.empty = glow.env.ie ?
		// When you clean an element out using innerHTML it destroys its inner text nodes in IE8 and below
		// Here's an alternative method for IE:
		function() {
			var i = this.length, node, child;
			
			while (i--) {
				node = this[i];
				while (child = node.firstChild) {
					node.removeChild(child);
				}
			}
			
			return this;
		} :
		// method for most browsers
		function() {
			var i = this.length;
			
			while (i--) {
				this[i].innerHTML = '';
			}
			
			return this;
		}

	/**
		@name glow.NodeList#replaceWith
		@function
		@description Replace elements with another
		
		@param {string | HTMLElement | HTMLElement[] | glow.NodeList} elements Element(s) to insert into the document
			If there is more than one element in the NodeList, then the given elements
			replace the first element, clones are appended to the other	elements.
			
		@returns {glow.NodeList} The replaced elements
			Call {@link glow.NodeList#destroy destroy} on these if you
			no longer need them.
	*/
	NodeListProto.replaceWith = function(elements) {
		return this.after(elements).remove();
	};
	
	/**
		@name glow.NodeList#wrap
		@function
		@description Wraps the given NodeList with the specified element(s).
			The given NodeList items will always be placed in the first
			child element that contains no further elements.
			
			Each item in a given NodeList will be wrapped individually.
		
		@param {string | HTMLElement | HTMLElement[] | glow.NodeList} wrapper Element to use as a wrapper
			Strings will be treated as HTML strings if they begin with <, else
			they'll be treated as a CSS selector.
		
		@returns {glow.NodeList} The NodeList with new wrapper parents
			
		@example
			// <span id="mySpan">Hello</span>
			glow("#mySpan").wrap("<div><p></p></div>");
			// Makes:
			// <div>
			//     <p>
			//         <span id="mySpan">Hello</span>
			//     </p>
			// </div>
			
	*/
	// get first child element node of an element, otherwise undefined
	function getFirstChildElm(parent) {					
		for (var child = parent.firstChild; child; child = child.nextSibling) {
			if (child.nodeType == 1) {
				return child;
			}			
		}			
		return undefined;			
	}
	
	NodeListProto.wrap = function(wrapper) {
		// normalise input
		wrapper = new glow.NodeList(wrapper);
		
		// escape if the wraper is non-existant or not an element
		if (!wrapper[0] || wrapper[0].nodeType != 1) {
			return this;
		}
		
		var toWrap,
			toWrapTarget,
			firstChildElm;
		
		for (var i = 0, leni = this.length; i<leni; i++) {
			toWrap = this[i];
			// get target element to insert toWrap in
			toWrapTarget = wrapper[0];
			
			while (toWrapTarget) {
				firstChildElm = getFirstChildElm(toWrapTarget);
					
				if (!firstChildElm) {
					break;
				}
				toWrapTarget = firstChildElm;
			}
			
			if (toWrap.parentNode) {						
				wrapper.insertBefore(toWrap);													
			}
			
			// If wrapping multiple nodes, we need to take a clean copy of the wrapping nodes
			if (i != leni-1) {
				wrapper = wrapper.clone();
			}
			
			toWrapTarget.appendChild(toWrap);
		}
		
		return this;
	};
	
	/**
		@name glow.NodeList#unwrap
		@function
		@description Removes the parent of each item in the list
		
		@returns {glow.NodeList} The now unwrapped elements
		
		@example
			// Before: <div><p><span id="mySpan">Hello</span></p></div>
			// unwrap the given element
			glow("#mySpan").unwrap();
			// After: <div><span id="mySpan">Hello</span></div>
	*/
	NodeListProto.unwrap = function() {
		var parentToRemove,
			childNodes,
			// get unique parents
			parentsToRemove = this.parent();
		
		for (var i = 0, leni = parentsToRemove.length; i < leni; i++) {				
			parentToRemove = parentsToRemove.slice(i, i+1);
			// make sure we get all children, including text nodes
			childNodes = new glow.NodeList( parentToRemove[0].childNodes );
			
			// if the item we're removing has no new parent (i.e. is not in document), then we just remove the child and destroy the old parent
			if (!parentToRemove[0].parentNode){
				childNodes.remove();
				parentToRemove.destroy();
			}
			else {
				childNodes.insertBefore(parentToRemove);
				parentToRemove.destroy();							
			}
		}
		return this;
	};
	
	/**
		@name glow.NodeList#clone
		@function
		@description Clones each node in the NodeList, along with data & event listeners
		
		@returns {glow.NodeList}
			Returns a new NodeList containing clones of all the nodes in
			the NodeList
		
		@example
			// get a copy of all heading elements
			var myClones = glow.get("h1, h2, h3, h4, h5, h6").clone();
	*/
	NodeListProto.clone = function() {
		var nodes = [],
			eventIdProp = '__eventId' + glow.UID,
			i = this.length;
		
		
		while (i--) {
			nodes[i] = this[i].cloneNode(true);
			// some browsers (ie) also clone node properties as attributes
			// we need to get rid of the eventId.
			allCloneElms = new glow.NodeList( nodes ).get("*").push( nodes );
			j = allCloneElms.length;
				while(j--) {
					nodes[i][eventIdProp] = null;
					
					// now copy over the data and events
					glow.events._copyEvent(this[i], nodes[i]);
					glow.NodeList._copyData(this[i], nodes[i]);
				}
			
		}
		// some browsers (ie) also clone node properties as attributes
		// we need to get rid of the eventId.
		//allCloneElms = new glow.NodeList( nodes ).get("*").push( nodes );
		//j = allCloneElms.length;
		
		//while(j--) {
			//allCloneElms[j][eventIdProp] = null;
		//}
		
		
				
		// copy data from base elements to clone elements
		/*allBaseElms = this.get("*").push( this );
		i = allCloneElms.length;
		while (i--) {
			allCloneElms[i].removeAttribute(dataPropName);
			glow.dom.get(allCloneElms[i]).data(
			glow.dom.get(allBaseElms[i]).data()
			);
		}*/
		
		return new glow.NodeList(nodes);
	};
	
	
	/**
		@name glow.NodeList#copy
		@function
		@description Copies each node in the NodeList, excluding data & event listeners
		
		@returns {glow.NodeList}
			Returns a new NodeList containing copies of all the nodes in
			the NodeList
		
		@example
			// get a copy of all heading elements
			var myCopies = glow.get("h1, h2, h3, h4, h5, h6").copy();
	*/
	NodeListProto.copy = function() {
		var nodes = [],
			i = this.length;
		
		while (i--) {
			nodes[i] = this[i].cloneNode(true);
		}
		
		return new glow.NodeList(nodes);
	};
	
	/**
		@name glow.NodeList#html
		@function
		@description Gets / sets HTML content
			Either gets content of the first element, or sets the content
			for all elements in the list
			
		@param {String} [htmlString] String to set as the HTML of elements
			If omitted, the html for the first element in the list is
			returned.
		
		@returns {glow.NodeList | string}
			Returns the original NodeList when setting,
			or the HTML content when getting.
			
		@example
			// get the html in #footer
			var footerContents = glow("#footer").html();
			
		@example
			// set a new footer
			glow("#footer").html("<strong>Hello World!</strong>");
	*/
	NodeListProto.html = function(htmlString) {
		// getting
		if (!arguments.length) {
			return this[0] ? this[0].innerHTML : '';
		}
		
		// setting
		var i = this.length,
			node;
		
		// normalise the string
		htmlString = htmlString ? String(htmlString): '';
		
		while (i--) {
			node = this[i];
			if (node.nodeType == 1) {
				try {
					// this has a habit of failing in IE for some elements
					node.innerHTML = htmlString;
				}
				catch (e) {
					new glow.NodeList(node).empty().append(htmlString);
				}
			}
		}
		
		return this;
	};
	
	/**
		@name glow.NodeList#text
		@function
		@description Gets / set the text content
			Either gets content of the first element, or sets the content
			for all elements in the list
		
		@param {String} [text] String to set as the text of elements
			If omitted, the test for the first element in the list is
			returned.
		
		@returns {glow.NodeList | String}
			Returns the original NodeList when setting,
			or the text content when getting.

		@example
			// set text
			var div = glow("<div></div>").text("Fun & games!");
			// <div>Func &amp; games!</div>
			
		@example
			// get text
			var mainHeading = glow('#mainHeading').text();
	*/
	NodeListProto.text = function(textString) {
		var firstNode = this[0],
			i = this.length,
			node;
		
		// getting
		if (!arguments.length) {
			// get the text by checking a load of properties in priority order
			return firstNode ?
				firstNode.textContent ||
				firstNode.innerText ||
				firstNode.nodeValue || '' // nodeValue for comment & text nodes
				: '';
		}
		
		// setting
		// normalise the string
		textString = textString ? String(textString): '';
		
		this.empty();
		while (i--) {
			node = this[i];
			if (node.nodeType == 1) {
				node.appendChild( document.createTextNode(textString) );
			}
			else {
				node.nodeValue = textString;
			}
		}
		
		return this;
	};
});
Glow.provide(function(glow) {
	var NodeListProto = glow.NodeList.prototype,
		doc = document,	
		win = window;
			
	/********************************PRIVATE METHODS*****************************************/
		
	/*
	PrivateMethod: toStyleProp
		Converts a css property name into its javascript name, such as "background-color" to "backgroundColor".

	Arguments: prop - (String) CSS Property name

	Returns: String, javascript style property name
	*/
	
	function toStyleProp(prop) {
		if (prop == 'float') {
			return glow.env.ie ? 'styleFloat' : 'cssFloat';
		}
		return prop.replace(/-(\w)/g, function(match, p1) {
			return p1.toUpperCase();
		});
	}
	/*
	PrivateMethod: getCssValue
		Get a computed css property
		
	Arguments:
		elm - element
		prop - css property or array of properties to add together

	Returns:	String, value
	*/
	function getCssValue(elm, prop) {
		var r, //return value
			total = 0,
			i = 0,
			/*regex for detecting which css properties need to be calculated relative to the y axis*/
			usesYAxis = /height|top/,
			propLen = prop.length,
			cssPropRegex = /^(?:(width|height)|(border-(top|bottom|left|right)-width))$/,
			compStyle = doc.defaultView && (doc.defaultView.getComputedStyle(elm, null) || doc.defaultView.getComputedStyle),
			elmCurrentStyle = elm.currentStyle,
			oldDisplay,
			match,
			propTest = prop.push || cssPropRegex.exec(prop) || [];


		if (prop.push) { //multiple properties, add them up
			for (; i < propLen; i++) {
				total += parseInt( getCssValue(elm, prop[i]), 10 ) || 0;
			}
			return total + 'px';
		}
			
		if (propTest[1]) { // is width / height
			if (!isVisible(elm)) { //element may be display: none
				return tempBlock(elm, function() {
					return getElmDimension(elm, propTest[1]) + 'px';
				});
			}
			return getElmDimension(elm, propTest[1]) + 'px';
		}
		else if (propTest[2] //is border-*-width
			&& glow.env.ie
			&& getCssValue(elm, 'border-' + propTest[3] + '-style') == 'none'
		) {
			return '0';
		}
		else if (compStyle) { //W3 Method
			//this returns computed values
			if (typeof compStyle == 'function') {
			//safari returns null for compStyle when element is display:non
			oldDisplay = elm.style.display;
			r = tempBlock(elm, function() {
			if (prop == 'display') { //get true value for display, since we've just fudged it
				elm.style.display = oldDisplay;
				if (!doc.defaultView.getComputedStyle(elm, null)) {
					return 'none';
				}
				elm.style.display = 'block';
			}
			return getCssValue(elm, prop);
			});
			} else {
				// assume equal horizontal margins in safari 3
				// http://bugs.webkit.org/show_bug.cgi?id=13343
				// The above bug doesn't appear to be closed, but it works fine in Safari 4
				if (glow.env.webkit > 500 && glow.env.webkit < 526 && prop == 'margin-right' && compStyle.getPropertyValue('position') != 'absolute') {
					prop = 'margin-left';
				}
				r = compStyle.getPropertyValue(prop);
			}
		} else if (elmCurrentStyle) { //IE method
				if (prop == 'opacity') {
					match = /alpha\(opacity=([^\)]+)\)/.exec(elmCurrentStyle.filter);
					return match ? String(parseInt(match[1], 10) / 100) : '1';
				}
				//this returns cascaded values so needs fixing
				r = String(elmCurrentStyle[toStyleProp(prop)]);
				if (/^-?[\d\.]+(?!px)[%a-z]+$/i.test(r) && prop != 'font-size') {
					r = getPixelValue(elm, r, usesYAxis.test(prop)) + 'px';
				}
			}
			//some results need post processing
			if (prop.indexOf('color') != -1) { //deal with colour values
				r = normaliseCssColor(r).toString();
			} else if (r.indexOf('url') == 0) { //some browsers put quotes around the url, get rid
				r = r.replace(/\"/g,'');
			}
			return r;
		}
	/*
	PrivateMethod: isVisible
		Is the element visible?
	*/
	function isVisible(elm) {
		//this is a bit of a guess, if there's a better way to do this I'm interested!
		return elm.offsetWidth ||
			elm.offsetHeight;
	}
	/*
	PrivateMethod: normaliseCssColor
		Converts a CSS colour into "rgb(255, 255, 255)" or "transparent" format
	*/

	function normaliseCssColor(val) {
		if (/^(transparent|rgba\(0, ?0, ?0, ?0\))$/.test(val)) { return 'transparent'; }
			var match, //tmp regex match holder
				r, g, b, //final colour vals
				hex, //tmp hex holder
				mathRound = Math.round,
				parseIntFunc = parseInt,
				parseFloatFunc = parseFloat,
					htmlColorNames = {
					black: 0,
					silver: 0xc0c0c0,
					gray: 0x808080,
					white: 0xffffff,
					maroon: 0x800000,
					red: 0xff0000,
					purple: 0x800080,
					fuchsia: 0xff00ff,
					green: 0x8000,
					lime: 0xff00,
					olive: 0x808000,
					yellow: 0xffff00,
					navy: 128,
					blue: 255,
					teal: 0x8080,
					aqua: 0xffff,
					orange: 0xffa500
				},
				colorRegex = /^rgb\(([\d\.]+)(%?),\s*([\d\.]+)(%?),\s*([\d\.]+)(%?)/i;

			if (match = colorRegex.exec(val)) { //rgb() format, cater for percentages
				r = match[2] ? mathRound(((parseFloatFunc(match[1]) / 100) * 255)) : parseIntFunc(match[1]);
				g = match[4] ? mathRound(((parseFloatFunc(match[3]) / 100) * 255)) : parseIntFunc(match[3]);
				b = match[6] ? mathRound(((parseFloatFunc(match[5]) / 100) * 255)) : parseIntFunc(match[5]);
			} else {
				if (typeof val == 'number') {
					hex = val;
				} else if (val.charAt(0) == '#') {
					if (val.length == '4') { //deal with #fff shortcut
						val = '#' + val.charAt(1) + val.charAt(1) + val.charAt(2) + val.charAt(2) + val.charAt(3) + val.charAt(3);
					}
					hex = parseIntFunc(val.slice(1), 16);
				} else {
					hex = htmlColorNames[val];
				}

				r = (hex) >> 16;
				g = (hex & 0x00ff00) >> 8;
				b = (hex & 0x0000ff);
			}

			val = new String('rgb(' + r + ', ' + g + ', ' + b + ')');
			val.r = r;
			val.g = g;
			val.b = b;
			return val;
		}
	/*
	PrivateMethod: getElmDimension
		Gets the size of an element as an integer, not including padding or border
	*/
	var horizontalBorderPadding = [
				'border-left-width',
				'border-right-width',
				'padding-left',
				'padding-right'
			],
			verticalBorderPadding = [
				'border-top-width',
				'border-bottom-width',
				'padding-top',
				'padding-bottom'
			];
		function getElmDimension(elm, cssProp /* (width|height) */) {
			var r,
			doc = document,
			docElm = doc.documentElement,
			docBody = document.body,
			docElmOrBody = glow.env.standardsMode ? docElm : docBody,
			isWidth = (cssProp == 'width'),
			cssPropCaps = isWidth ? 'Width' : 'Height',
			cssBorderPadding;

			if (elm.window) { // is window
				r = glow.env.webkit < 522.11 ? (isWidth ? elm.innerWidth				: elm.innerHeight) :
					glow.env.webkit			? (isWidth ? docBody.clientWidth		: elm.innerHeight) :
					glow.env.opera < 9.5		? (isWidth ? docBody.clientWidth		: docBody.clientHeight) :
					/* else */			  (isWidth ? docElmOrBody.clientWidth	: docElmOrBody.clientHeight);

			}
			else if (elm.getElementById) { // is document
				// we previously checked offsetWidth & clientWidth here
				// but they returned values too large in IE6 scrollWidth seems enough
				r = Math.max(
					docBody['scroll' + cssPropCaps],
					docElm['scroll' + cssPropCaps]
				)
			}
			else {
				// get an array of css borders & padding
				cssBorderPadding = isWidth ? horizontalBorderPadding : verticalBorderPadding;
				r = elm['offset' + cssPropCaps] - parseInt( getCssValue(elm, cssBorderPadding) );
			}
			return r;
		}
		
	/*
	PrivateMethod: setElmsSize
		Set element's size

	Arguments:
		elms - (<NodeList>) Elements
		val - (Mixed) Set element height / width. In px unless stated
		type - (String) "height" or "width"

	Returns:
		Nowt.
	*/
	function setElmsSize(elms, val, type) {
		if (typeof val == 'number' || /\d$/.test(val)) {
			val += 'px';
		}
		for (var i = 0, len = elms.length; i < len; i++) {
			elms[i].style[type] = val;
		}
	}
	
	/*
	PrivateMethod: tempBlock
		Gives an element display:block (but keeps it hidden) and runs a function, then sets the element back how it was

	Arguments:
		elm - element
		func - function to run

	Returns:
		Return value of the function
	*/
	function tempBlock(elm, func) {
		//TODO: rather than recording individual style properties, just cache cssText? This was faster for getting the element size
		var r,
			elmStyle = elm.style,
			oldDisp = elmStyle.display,
			oldVis = elmStyle.visibility,
			oldPos = elmStyle.position;

			elmStyle.visibility = 'hidden';
			elmStyle.position = 'absolute';
			elmStyle.display = 'block';
		if (!isVisible(elm)) {
			elmStyle.position = oldPos;
			r = tempBlock(elm.parentNode, func);
			elmStyle.display = oldDisp;
			elmStyle.visibility = oldVis;
		} else {
			r = func();
			elmStyle.display = oldDisp;
			elmStyle.position = oldPos;
			elmStyle.visibility = oldVis;
		}
		return r;
	}
	
	/*
	PrivateMethod: getPixelValue
		Converts a relative value into an absolute pixel value. Only works in IE with Dimension value (not stuff like relative font-size).
		Based on some Dean Edwards' code

	Arguments:
		element - element used to calculate relative values
		value - (string) relative value
		useYAxis - (string) calulate relative values to the y axis rather than x

	Returns:
		Number
	*/
	function getPixelValue(element, value, useYAxis) {
		// Remember the original values
		var axisPos = useYAxis ? 'top' : 'left',
			axisPosUpper = useYAxis ? 'Top' : 'Left',
			elmStyle = element.style,
			positionVal = elmStyle[axisPos],
			runtimePositionVal = element.runtimeStyle[axisPos],
			r;
			
		// copy to the runtime type to prevent changes to the display
		element.runtimeStyle[axisPos] = element.currentStyle[axisPos];
			// set value to left / top
		elmStyle[axisPos] = value;
		// get the pixel value
		r = elmStyle['pixel' + axisPosUpper];
			
		// revert values
		elmStyle[axisPos] = positionVal;
		element.runtimeStyle[axisPos] = runtimePositionVal;
			
		return r;
	}
	
	/*************************************** API METHODS ******************************************/
	/**
	@name glow.NodeList#css
	@function
	@description Get / set a CSS property value
		
	@param {string | Object} property The CSS property name, or object of property-value pairs to set
		
	@param {string | number} [value] The value to apply
		Number values will be treated as 'px' unless the CSS property
		accepts a unitless value.
		
		If value is omitted, the value for the given property will be returned
			
	@returns {glow.NodeList | string} Returns the NodeList when setting value, or the CSS value when getting values.
		CSS values are strings. For instance, "height" will return
		"25px" for an element 25 pixels high. You can use
		parseInt to convert these values.
		
	@example
		// get value from first node
		glow("#subNav").css("display");
		
	@example
		// set left padding to 10px on all nodes
		glow("#subNav li").css("padding-left", "2em");
		
	@example
		// where appropriate, px is assumed when no unit is passed
		glow("#mainPromo").css("margin-top", 300);
		
	@example
		// set multiple CSS values at once
		// NOTE: Property names containing a hyphen such as font-weight must be quoted
		glow("#myDiv").css({
			'font-weight': 'bold',
			'padding'	 : '10px',
			'color'		 : '#00cc99'
		});
	*/
	
	
	NodeListProto.css = function(prop, val) {
		var thisStyle,
			i = this.length,
			len = this.length,
			originalProp = prop,
			hasUnits = /width|height|top$|bottom$|left$|right$|spacing$|indent$|font-size/,
			style;

			if (prop.constructor === Object) { // set multiple values
				for (style in prop) {
					this.css(style, prop[style]);
				}
				return this;
			}
			else if (val != undefined) { //set one CSS value
				prop = toStyleProp(prop);
				while (i--) {
					thisStyle = this[i].style;
						
					if (typeof val == 'number' && hasUnits.test(originalProp)) {
						val = val.toString() + 'px';
					}
					if (prop == 'opacity' && glow.env.ie) {
						//in IE the element needs hasLayout for opacity to work
						thisStyle.zoom = '1';
						if (val === '') {
							thisStyle.filter = '';
						} else {
							thisStyle.filter = 'alpha(opacity=' + Math.round(Number(val, 10) * 100) + ')';
						}
					} else {
						thisStyle[prop] = val;
					}
				}
					return this;
			} else { //getting stuff
				if (!len) { return; }
				return getCssValue(this[0], prop);
			}	
	};
	
	/**
	@name glow.NodeList#height
	@function
	@description Gets / set element height
		Return value does not include the padding or border of the element in
		browsers supporting the correct box model.
			
		You can use this to easily get the height of the document or
		window, see example below.
		
	@param {Number} [height] New height in pixels for each element in the list
		If ommited, the height of the first element is returned
		
	@returns {glow.NodeList | number}
		Height of first element, or original NodeList when setting heights.
		
	@example
		// get the height of #myDiv
		glow("#myDiv").height();
		
	@example
		// set the height of list items in #myList to 200 pixels
		glow("#myList > li").height(200);
		
	@example
		// get the height of the document
		glow(document).height();
		
	@example
		// get the height of the window
		glow(window).height();
	*/
	NodeListProto.height = function(height) {
		if (height == undefined) {
			return getElmDimension(this[0], 'height');
		}
		setElmsSize(this, height, 'height');
		return this;	
	};
	
	/**
	@name glow.NodeList#width
	@function
	@description Gets / set element width
		Return value does not include the padding or border of the element in
		browsers supporting the correct box model.
			
		You can use this to easily get the width of the document or
		window, see example below.
		
	@param {Number} [width] New width in pixels for each element in the list
		If ommited, the width of the first element is returned
		
	@returns {glow.NodeList | number}
		width of first element, or original NodeList when setting widths.
		
	@example
		// get the width of #myDiv
		glow("#myDiv").width();
		
	@example
		// set the width of list items in #myList to 200 pixels
		glow("#myList > li").width(200);
		
	@example
		// get the width of the document
		glow(document).width();
		
	@example
		// get the width of the window
		glow(window).width();
	*/
	NodeListProto.width = function(width) {
		if (width == undefined) {
			return getElmDimension(this[0], 'width');
		}
		setElmsSize(this, width, 'width');
		return this;
	};
	
	/**
	@name glow.NodeList#scrollLeft
	@function
	@description Gets/sets the number of pixels the element has scrolled horizontally
		To get/set the scroll position of the window, use this method on
		a nodelist containing the window object.
			
	@param {Number} [val] New left scroll position
		Omit this to get the current scroll position
			
	@returns {glow.NodeList | number}
		Current scrollLeft value, or NodeList when setting scroll position.
			
	@example
		// get the scroll left value of #myDiv
		var scrollPos = glow("#myDiv").scrollLeft();
		// scrollPos is a number, eg: 45

	@example
		// set the scroll left value of #myDiv to 20
		glow("#myDiv").scrollLeft(20);

	@example
		// get the scrollLeft of the window
		glow(window).scrollLeft();
		// scrollPos is a number, eg: 45
	*/
	NodeListProto.scrollLeft = function(val) {
		return scrollOffset(this, true, val);	
	};
	
	/**
	@name glow.NodeList#scrollTop
	@function
	@description Gets/sets the number of pixels the element has scrolled vertically
		To get/set the scroll position of the window, use this method on
		a nodelist containing the window object.
		
	@param {Number} [val] New top scroll position
		Omit this to get the current scroll position
			
	@returns {glow.NodeList | number}
		Current scrollTop value, or NodeList when setting scroll position.

	@example
		// get the scroll top value of #myDiv
		var scrollPos = glow("#myDiv").scrollTop();
		// scrollPos is a number, eg: 45

	@example
		// set the scroll top value of #myDiv to 20
		glow("#myDiv").scrollTop(20);

	@example
		// get the scrollTop of the window
		glow(window).scrollTop();
		// scrollPos is a number, eg: 45
	*/
	NodeListProto.scrollTop = function(val) {
		return scrollOffset(this, false, val);	
	};
	/**
	@name glow.dom-getScrollOffset
	@private
	@description Get the scrollTop / scrollLeft of a particular element
	@param {Element} elm Element (or window object) to get the scroll position of
	@param {Boolean} isLeft True if we're dealing with left scrolling, otherwise top
	*/
	function getScrollOffset(elm, isLeft) {
		var r,			
			scrollProp = 'scroll' + (isLeft ? 'Left' : 'Top');
			
		// are we dealing with the window object or the document object?
		if (elm.window) {
			// get the scroll of the documentElement or the pageX/Yoffset
			// - some browsers use one but not the other
			r = elm.document.documentElement[scrollProp]
				|| (isLeft ? elm.pageXOffset : elm.pageYOffset)
				|| 0;
		} else {
			r = elm[scrollProp];
		}
		return r;
	}
		
	/**
	@name glow.dom-setScrollOffset
	@private
	@description Set the scrollTop / scrollLeft of a particular element
	@param {Element} elm Element (or window object) to get the scroll position of
	@param {Boolean} isLeft True if we're dealing with left scrolling, otherwise top
	@param {Number} newVal New scroll value
	*/
	function setScrollOffset(elm, isLeft, newVal) {
	// are we dealing with the window object or the document object?
		if (elm.window) {
			// we need to get whichever value we're not setting
			elm.scrollTo(
				isLeft  ? newVal : getScrollOffset(elm, true),
				!isLeft ? newVal : getScrollOffset(elm, false)
			);
		} else {
			elm['scroll' + (isLeft ? 'Left' : 'Top')] = newVal;
		}
	}
	
	/**
	@name glow.dom-scrollOffset
	@private
	@description Set/get the scrollTop / scrollLeft of a NodeList
	@param {glow.dom.NodeList} nodeList Elements to get / set the position of
	@param {Boolean} isLeft True if we're dealing with left scrolling, otherwise top
	@param {Number} [val] Val to set (if not provided, we'll get the value)
	@returns NodeList for sets, Number for gets
	*/
	function scrollOffset(nodeList, isLeft, val) {
		var i = nodeList.length;
			
		if (val !== undefined) {
			while (i--) {
				setScrollOffset(nodeList[i], isLeft, val);
			}
			return nodeList;
		} else {
			return getScrollOffset(nodeList[0], isLeft);
		}
	}
	/**
	@name glow.NodeList#hide
	@function
	@description Hides all items in the NodeList.
		
	@returns {glow.NodeList}
		
	@example
		// Hides all list items within #myList
		glow("#myList li").hide();
	*/
	NodeListProto.hide = function() {
		return this.css('display', 'none').css('visibility', 'hidden');	
	};
	
	/**
	@name glow.NodeList#show
	@function
	@description Shows all hidden items in the NodeList.
		
	@returns {glow.NodeList}
		
	@example
		// Show element with ID myDiv
		glow("#myDiv").show();
			
	@example
		// Show all list items within #myList
		glow("#myList li").show();
	*/
	NodeListProto.show = function() {
		var i = this.length,
			len = this.length,
			currItem,
			itemStyle;
		while (i--) {
			/* Create a NodeList for the current item */
			currItem = new glow.NodeList(this[i]);
			itemStyle = currItem[0].style;
			if (currItem.css('display') == 'none') {
				itemStyle.display = '';
				itemStyle.visibility = 'visible';
			/* If display is still none, set to block */
			if (currItem.css('display') == 'none') {
				itemStyle.display = 'block';
				}
			}	
		}
		return this;	
	};

	/**
	@name glow.NodeList#offset
	@function
	@description Gets the offset from the top left of the document.
		If the NodeList contains multiple items, the offset of the
		first item is returned.
			
	@returns {Object}
		Returns an object with "top" & "left" properties in pixels
			
	@example
		glow("#myDiv").offset().top
	*/
	NodeListProto.offset = function() {
				// http://weblogs.asp.net/bleroy/archive/2008/01/29/getting-absolute-coordinates-from-a-dom-element.aspx - great bit of research, most bugfixes identified here (and also jquery trac)
		var elm = this[0],
		doc = document,
		docElm = doc.documentElement,
			docScrollPos = {
				x: getScrollOffset(window, true),
				y: getScrollOffset(window, false)
			}

		//this is simple(r) if we can use 'getBoundingClientRect'
		// Sorry but the sooper dooper simple(r) way is not accurate in Safari 4
		if (!glow.env.webkit && elm.getBoundingClientRect) {
			var rect = elm.getBoundingClientRect();
			return {
				top: Math.floor(rect.top)
				/*
				 getBoundingClientRect is realive to top left of
				 the viewport, so we need to sort out scrolling offset
				*/
				+ docScrollPos.y
				/*
				IE adds the html element's border to the value. We can
				deduct this value using client(Top|Left). However, if
				the user has done html{border:0} clientTop will still
				report a 2px border in IE quirksmode so offset will be off by 2.
				Hopefully this is an edge case but we may have to revisit this
				in future
				*/
				- docElm.clientTop,

				left: Math.floor(rect.left) //see above for docs on all this stuff
				+ docScrollPos.x
				- docElm.clientLeft
			};
		} else { //damnit, let's go the long way around
			var top = elm.offsetTop,
			left = elm.offsetLeft,
			originalElm = elm,
			nodeNameLower,
			docBody = document.body,
			//does the parent chain contain a position:fixed element
			involvesFixedElement = false,
			offsetParentBeforeBody = elm;

			//add up all the offset positions
			while (elm = elm.offsetParent) {
				left += elm.offsetLeft;
				top += elm.offsetTop;

				//if css position is fixed, we need to add in the scroll offset too, catch it here
				if (getCssValue(elm, 'position') == 'fixed') {
					involvesFixedElement = true;
				}

				//gecko & webkit (safari 3) don't add on the border for positioned items
				if (glow.env.gecko || glow.env.webkit > 500) {
					left += parseInt(getCssValue(elm, 'border-left-width')) || 0;
					top  += parseInt(getCssValue(elm, 'border-top-width'))  || 0;
				}
				
				//we need the offset parent (before body) later
				if (elm.nodeName.toLowerCase() != 'body') {
					offsetParentBeforeBody = elm;
				}
			}

			//deduct all the scroll offsets
			elm = originalElm;
			while ((elm = elm.parentNode) && (elm != docBody) && (elm != docElm)) {
				left -= elm.scrollLeft;
				top -= elm.scrollTop;

				//FIXES
				//gecko doesn't add the border of contained elements to the offset (overflow!=visible)
				if (glow.env.gecko && getCssValue(elm, 'overflow') != 'visible') {
					left += parseInt(getCssValue(elm, 'border-left-width'));
					top += parseInt(getCssValue(elm, 'border-top-width'));
				}
			}

			//if we found a fixed position element we need to add the scroll offsets
			if (involvesFixedElement) {
				left += docScrollPos.x;
				top += docScrollPos.y;
			}

			//FIXES
			// Webkit < 500 body's offset gets counted twice for absolutely-positioned elements (or if there's a fixed element)
			// Gecko - non-absolutely positioned elements that are direct children of body get the body offset counted twice
			if (
				(glow.env.webkit < 500 && (involvesFixedElement || getCssValue(offsetParentBeforeBody, 'position') == 'absolute')) ||
				(glow.env.gecko && getCssValue(offsetParentBeforeBody, 'position') != 'absolute')
			) {
				left -= docBody.offsetLeft;
				top -= docBody.offsetTop;
			}

			return {left:left, top:top};
		}
	};
	
	/**
	@name glow.NodeList#position
	@function
	@description Get the top & left position of an element relative to its positioned parent
		This is useful if you want to make a position:static element position:absolute
		and retain the original position of the element
			
	@returns {Object}
		An object with 'top' and 'left' number properties
		
	@example
		// get the top distance from the positioned parent
		glow("#elm").position().top
	*/
	NodeListProto.position = function() {
		var positionedParent = new glow.NodeList( getPositionedParent(this[0]) ),
			hasPositionedParent = !!positionedParent[0],
					
			// element margins to deduct
			marginLeft = parseInt( this.css('margin-left') ) || 0,
			marginTop  = parseInt( this.css('margin-top')  ) || 0,
					
			// offset parent borders to deduct, set to zero if there's no positioned parent
			positionedParentBorderLeft = ( hasPositionedParent && parseInt( positionedParent.css('border-left-width') ) ) || 0,
			positionedParentBorderTop  = ( hasPositionedParent && parseInt( positionedParent.css('border-top-width')  ) ) || 0,
					
			// element offsets
		elOffset = this.offset(),
		positionedParentOffset = hasPositionedParent ? positionedParent.offset() : {top: 0, left: 0};
				
		return {
			left: elOffset.left - positionedParentOffset.left - marginLeft - positionedParentBorderLeft,
			top:  elOffset.top  - positionedParentOffset.top  - marginTop  - positionedParentBorderTop
		}	
	};
	/*
		Get the 'real' positioned parent for an element, otherwise return null.
	*/
	function getPositionedParent(elm) {
		var offsetParent = elm.offsetParent,
		doc = document,
		docElm = doc.documentElement;
			
		// get the real positioned parent
		// IE places elements with hasLayout in the offsetParent chain even if they're position:static
		// Also, <body> and <html> can appear in the offsetParent chain, but we don't want to return them if they're position:static
		while (offsetParent && new glow.NodeList(offsetParent).css('position') == 'static') {	
			offsetParent = offsetParent.offsetParent;
		}
			
		// sometimes the <html> element doesn't appear in the offsetParent chain, even if it has position:relative
		if (!offsetParent && new glow.NodeList(docElm).css('position') != 'static') {
			offsetParent = docElm;
		}
			
		return offsetParent || null;
	}
});
Glow.provide(function(glow) {
	var NodeListProto = glow.NodeList.prototype,
		document = window.document,
		undefined,
		keyEventNames = ' keypress keydown keyup ';
	
	/**
		@name glow.NodeList#on
		@function
		@description Listen for an event.
		   This will listen for a particular event on each dom node
		   in the NodeList.
		   
		   If you're listening to many children of a particular item,
		   you may get better performance from {@link glow.NodeList#delegate}.
		
		@param {String} eventName Name of the event to listen for.
		   This can be any regular DOM event ('click', 'mouseover' etc) or
		   a special event of NodeList.
		   
		@param {Function} callback Function to call when the event fires.
		   The callback is passed a single event object. The type of this
		   object is {@link glow.DomEvent} unless otherwise stated.
		   
		@param {Object} [thisVal] Value of 'this' within the callback.
		   By default, this is the dom node being listened to.
		
		@returns this
		
		@example
		   glow.get('#testLink').on('click', function(domEvent) {
			   // do stuff
			   
			   // if you want to cancel the default action (following the link)...
			   return false;
		   });
	*/
	NodeListProto.on = function(eventName, callback, thisVal) {
		var isKeyEvent = (keyEventNames.indexOf(' ' + eventName + ' ') > -1);
			
		if (isKeyEvent) {
			glow.events._addKeyListener(this, eventName, callback, thisVal);
		}
		else { // assume it's a DOM event
			glow.events._addDomEventListener(this, eventName, callback, thisVal);
		}
		
		return this;
	}
	
	/**
		@name glow.NodeList#detach
		@function
		@description detach a listener from elements
		   This will detach the listener from each dom node in the NodeList.
		
		@param {String} eventName Name of the event to detach the listener from
		   
		@param {Function} callback Listener callback to detach
		
		@returns this
		
		@example
			function clickListener(domEvent) {
				// ...
			}
			
			// adding listeners
			glow.get('a').on('click', clickListener);
			
			// removing listeners
			glow.get('a').detach('click', clickListener);
	*/
	NodeListProto.detach = function(eventName, callback, thisVal) {
		var isKeyEvent = (keyEventNames.indexOf(' ' + eventName + ' ') > -1);
		if (isKeyEvent) {
			glow.events._removeKeyListener(this, eventName, callback);
		}
		else { // assume it's a DOM event
			glow.events._removeDomEventListener(this, eventName, callback, thisVal);
		}
		
		return this;
	}
	
	/**
		@name glow.NodeList#delegate
		@function
		@description Listen for an event occurring on child elements matching a selector.
			'delegate' will catch events which occur on matching items created after
			the listener was added. 
		
		@param {String} eventName Name of the event to listen for.
			This can be any regular DOM event ('click', 'mouseover' etc) or
			a special event of NodeList.
		
		@param {String} selector CSS selector of child elements to listen for events on
			For example, if you were wanting to hear events from links, this
			would be 'a'.
		
		@param {Function} callback Function to call when the event fires.
			The callback is passed a single event object. The type of this
			object is {@link glow.DomEvent} unless otherwise stated.
		
		@param {Object} [thisVal] Value of 'this' within the callback.
			By default, this is the dom node matched by 'selector'.
		
		@returns this
		
		@example
			// Using 'on' to catch clicks on links in a list
			glow.get('#nav a').on('click', function() {
				// do stuff
			});
			
			// The above adds a listener to each link, any links created later
			// will not have this listener, so we won't hear about them.
			
			// Using 'delegate' to catch clicks on links in a list
			glow.get('#nav').delegate('click', 'a', function() {
				// do stuff
			});
			
			// The above only adds one listener to #nav which tracks clicks
			// to any links within. This includes elements created after 'delegate'
			// was called.
		
		@example
			// Using delegate to change class names on table rows so :hover
			// behaviour can be emulated in IE6
			glow.get('#contactData').delegate('mouseover', 'tr', function() {
				glow.get(this).addClass('hover');
			});
			
			glow.get('#contactData').delegate('mouseout', 'tr', function() {
				glow.get(this).removeClass('hover');
			});
	*/
	NodeListProto.delegate = function(eventName, selector, callback, thisVal) {
		var i = this.length,
			attachTo,
			isKeyEvent = (keyEventNames.indexOf(' ' + eventName + ' ') > -1);
		
		while (i--) {
			attachTo = this[i];
			
			if (isKeyEvent) {
// 					glow.events._addKeyListener([attachTo], eventName, handler);
			}
			else { // assume it's a DOM event
				glow.events._addDomEventListener([attachTo], eventName, callback, thisVal, selector);
			}
		}
		
		return this;
	}
	
	/**
		@name glow.NodeList#detachDelegate
		@function
		@description detach a delegated listener from elements
		   This will detach the listener from each dom node in the NodeList.
		
		@param {String} eventName Name of the event to detach the listener from
		
		@param {String} selector CSS selector of child elements the listener is listening to
		
		@param {Function} callback Listener callback to detach
		
		@returns this
		
		@example
			function clickListener(domEvent) {
				// ...
			}
			
			// adding listeners
			glow.get('#nav').delegate('click', 'a', clickListener);
			
			// removing listeners
			glow.get('#nav').detachDelegate('click', 'a', clickListener);
	*/
	NodeListProto.detachDelegate = function(eventName, selector, callback, thisVal) {
		var i = this.length,
			attachTo,
			isKeyEvent = (keyEventNames.indexOf(' ' + eventName + ' ') > -1),
			handler;
		
		while (i--) {
			attachTo = this[i];
			
			if (isKeyEvent) {
// 				glow.events._removeKeyListener([attachTo], eventName, handler);
 			}
 			else {
 				glow.events._removeDomEventListener([attachTo], eventName, callback, selector);
 			}
		}
		
		return this;
	}
	
	/**
		@name glow.NodeList#fire
		@function
		@param {String} eventName Name of the event to fire
		@param {glow.events.Event} [event] Event object to pass into listeners.
		   You can provide a simple object of key / value pairs which will
		   be added as properties of a glow.events.Event instance.
		
		@description Fire an event on dom nodes within the NodeList
		   Note, this will only trigger event listeners to be called, it won't
		   for example, move the mouse or click a link on the page.
		
		@returns glow.events.Event
		
		@example
		   glow.get('#testLink').on('click', function() {
			   alert('Link clicked!');
		   });
		   
		   // The following causes 'Link clicked!' to be alerted, but doesn't
		   // cause the browser to follow the link
		   glow.get('#testLink').fire('click');
	*/
	NodeListProto.fire = function(eventName, event) {
		return glow.events.fire(this, eventName, event);
	}
	
	/**
		@name glow.NodeList#event:mouseenter
		@event
		@description Fires when the mouse enters the element specifically, does not bubble
		
		@param {glow.events.DomEvent} event Event Object
	*/
	
	/**
		@name glow.NodeList#event:mouseleave
		@event
		@description Fires when the mouse leaves the element specifically, does not bubble
		
		@param {glow.events.DomEvent} event Event Object
	*/
	
	/**
		@name glow.NodeList#event:keydown
		@event
		@description Fires when the user presses a key
			Only fires if the element has focus, listen for this event on
			the document to catch all keydowns.
			
			This event related to the user pressing a key on the keyboard,
			if you're more concerned about the character entered, see the
			{@link glow.NodeList#event:keypress keypress} event.
			
			keydown will only fire once, when the user presses the key.
			
			The order of events is keydown, keypress*, keyup. keypress may
			fire many times if the user holds the key down.
		
		@param {glow.events.KeyboardEvent} event Event Object
	*/
	
	/**
		@name glow.NodeList#event:keypress
		@event
		@description Fires when a key's command executes.
			For instance, if you hold down a key, it's action will occur many
			times. This event will fire on each action.
			
			This event is useful when you want to react to keyboard repeating, or
			to detect when a character is entered into a field.
			
			The order of events is keydown, keypress*, keyup. keypress may
			fire many times if the user holds the key down.
		
		@param {glow.events.KeyboardEvent} event Event Object
	*/
	
	/**
		@name glow.NodeList#event:keyup
		@event
		@description Fires when the user releases a key
			Only fires if the element has focus, listen for this event on
			the document to catch all keyups.
			
			This event related to the user pressing a key on the keyboard,
			if you're more concerned about the character entered, see the
			{@link glow.NodeList#event:keypress keypress} event.
			
			The order of events is keydown, keypress*, keyup. keypress may
			fire many times if the user holds the key down.
		
		@param {glow.events.KeyboardEvent} event Event Object
	*/
});
Glow.complete('core', '2.0.0-alpha1');
