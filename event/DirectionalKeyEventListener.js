/**
 * @author Tom Cool
 * @version 0.1
 * 
 * Object binding events to directional keypress input from a player
 * @class DirectionalKeyEventListener
 * @constructor
 * @this {DirectionalKeyEventListener}

 * @param {Object}  listeners   Object literal containing directional methods
 * @param {Boolean} wasd        Use W/A/S/D as optional second directional keys
 * @returns {DirectionalKeyEventListener}
 */
function DirectionalKeyEventListener(listeners, wasd) {
	'use strict';
	/**
	 * Object literal containing directional methods as instance property
	 * @property listeners
	 * @type object
	 * @private
	 */
    this.listeners = listeners;
    /**
	 * Use W/A/S/D as optional second directional keys
	 * @property wasd
	 * @type boolean
	 * @private
	 */
	this.wasd = wasd || false;
	/**
	 * keep track if additional directional keys are pressed or released
	 * @property pressed
	 * @type object
	 * @private
	 */
	this.pressed = {
		left 	: false,
		right 	: false,
		up 		: false,
		down 	: false
	};
	/**
	 * register when keydown events are happening
	 * @property keydown
	 * @type object
	 * @private
	 */
	this.keydown = this.setKeys(KeyEventListener.eventType.DOWN, true);
    /**
	 * register when keyup events are happening
	 * @property keyup
	 * @type object
	 * @private
	 */
	this.keyup = this.setKeys(KeyEventListener.eventType.UP, false);
};
/**
 * Inherit from KeyEventListener
 * @param {KeyEventListener} param
 */
DirectionalKeyEventListener.extends(KeyEventListener);
/**
 * Where keypress/up events are registered
 * @param {String}      key         The directional key to bind listener with
 * @param {String}      eventType   keydown || keyup
 * @param {String}      direction   The direction of the key that is pressed
 * @param {Boolean}     enable      According to eventType enable or disable event
 * @this {DirectionalKeyEventListener}
 * @return {KeyEventListener} or false
 * @method handleKey
 */
DirectionalKeyEventListener.prototype.handleKey = function(key, eventType, direction, enable) {
	'use strict';
	var self = this;
	return this.listeners[direction] 
			? new KeyEventListener(key, eventType, function () { self.pressed[direction] = enable; }) 	
			: function () { return false; };
};
/**
 * Bind event listeners to directional keys
 * @param {String}  eventType   keydown || keypress
 * @param {Boolean} enable      According to eventType enable or disable event
 * @this {DirectionalKeyEventListener}
 * @return {Object} Containing events bound to requested keys
 * @method setKeys
 */
DirectionalKeyEventListener.prototype.setKeys = function(eventType, enable) {
	'use strict';
    //bind default directional keys
	var keys = {
		left 	: this.handleKey('left', eventType, 'left', enable),
		right 	: this.handleKey('right', eventType, 'right', enable),
		up 		: this.handleKey('up', eventType, 'up', enable),
		down 	: this.handleKey('down', eventType, 'down', enable)
	};
	//optionaly bind W/A/S/D keys
	if (this.wasd) {
		keys.a = this.handleKey('a', eventType, 'left', enable);
		keys.d = this.handleKey('d', eventType, 'right', enable);
		keys.w = this.handleKey('w', eventType, 'up', enable);
		keys.s = this.handleKey('s', eventType, 'down', enable);
	};
	
	return keys;
};
/**
 * Executed listener when additional key is pressed, fired on frame rendering
 * @this {DirectionalKeyEventListener}
 * @return {Void}
 * @method handleMovement
 */
DirectionalKeyEventListener.prototype.handleMovement = function() {
	'use strict';
	
	if (this.listeners.left && this.pressed.left) {
		this.listeners.left();
	};
    if (this.listeners.right && this.pressed.right) {
		this.listeners.right();
	};
    if (this.listeners.up && this.pressed.up) {
		this.listeners.up();
	};
    if (this.listeners.down && this.pressed.down) {
		this.listeners.down();
	};
};
/**
 * Checks wether any directional key is pressed
 * @this {DirectionalKeyEventListener}
 * @return {Boolean}
 * @method noKeysArePressed
 */
DirectionalKeyEventListener.prototype.noKeysArePressed = function() {
	'use strict';
	var p = false;
    loop : for (var key in this.pressed) {
        if (this.pressed[key]) {
            p = true;
            break loop;
        };
    };
    return p;
};