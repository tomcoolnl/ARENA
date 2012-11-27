
DirectionalKeyEventListener = function DirectionalKeyEventListener(listeners, wasd) {
	'use strict';
	
	var self = this;
		
	this.listeners = listeners;
	this.wasd = wasd || false;
	
	this.pressed = {
		left 	: false,
		right 	: false,
		up 		: false,
		down 	: false
	};
	
	this.keydown = this.setKeys(KeyEventListener.eventType.DOWN, true);
	this.keyup	 = this.setKeys(KeyEventListener.eventType.UP, false);
};

DirectionalKeyEventListener.extends(KeyEventListener);


DirectionalKeyEventListener.prototype.handleKey = function(key, eventType, direction, enable) {
	'use strict';
	var self = this;
	return this.listeners[direction] 
			? new KeyEventListener(key, eventType, function () { self.pressed[direction] = enable; }) 	
			: function () { return false; };
};

DirectionalKeyEventListener.prototype.setKeys = function(eventType, enable) {
	'use strict';

	var keys = {
		left 	: this.handleKey('left', eventType, 'left', enable),
		right 	: this.handleKey('right', eventType, 'right', enable),
		up 		: this.handleKey('up', eventType, 'up', enable),
		down 	: this.handleKey('down', eventType, 'down', enable),
	};
	
	if (this.wasd) {
		keys.a = this.handleKey('a', eventType, 'left', enable);
		keys.d = this.handleKey('d', eventType, 'right', enable);
		keys.w = this.handleKey('w', eventType, 'up', enable);
		keys.s = this.handleKey('s', eventType, 'down', enable);
	};
	
	return keys;
};
 
DirectionalKeyEventListener.prototype.handleMovement = function() {
	'use strict';
	
	if (this.listeners.left && this.pressed.left) {
		this.listeners.left();
	} else if (this.listeners.right && this.pressed.right) {
		this.listeners.right();
	} else if (this.listeners.up && this.pressed.up) {
		this.listeners.up();
	} else if (this.listeners.down && this.pressed.down) {
		this.listeners.down();
	};
};