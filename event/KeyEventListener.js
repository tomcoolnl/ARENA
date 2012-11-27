
/**
 * TODO create presets like 'stearingwheel' (left, right, up, down / w a s d) 
 * 
 * @param {Object} key
 */

KeyEventListener = function KeyEventListener(key, type, callback) {
	'use strict';
	
	var self 		= this;
	this.elem 		= document;
	this.key 		= key;
	this.evtType 	= type || this.eventType.DOWN;
	this.callback 	= callback || function () {};
	this.pressed	= false;
	
	this.add( this.elem, this.evtType, function (event) { self.validate(event) });
	return this;
};

KeyEventListener.extends(EventListener);

KeyEventListener.eventType = KeyEventListener.prototype.eventType = new Enum({
	UP 		: 'keyup',
	DOWN 	: 'keydown',
	PRESS 	: 'keypress'
});

KeyEventListener.specialKeys = KeyEventListener.prototype.specialKeys = new Enum({
	'esc':27, 'escape':27, 'tab':9, 'space':32, 'return':13, 'enter':13, 'backspace':8,
	'scrolllock':145, 'scroll_lock':145, 'scroll':145, 'capslock':20, 'caps_lock':20, 'caps':20, 'numlock':144, 'num_lock':144, 'num':144,
	'pause':19, 'break':19, 'insert':45, 'home':36, 'delete':46, 'end':35,
	'pageup':33, 'page_up':33, 'pu':33, 'pagedown':34, 'page_down':34, 'pd':34,
	'left':37, 'up':38, 'right':39, 'down':40,
	'f1':112,'f2':113, 'f3':114, 'f4':115, 'f5':116, 'f6':117, 'f7':118, 'f8':119, 'f9':120, 'f10':121, 'f11':122, 'f12':123
});

KeyEventListener.prototype.targetIsTextInputElement = function(target) {
	'use strict';
	return (target.tagName.toLowerCase() == 'input' || target.tagName.toLowerCase() == 'textarea');
};

KeyEventListener.prototype.validate = function (event) {
	'use strict';
	
	var target 		= event.target;
	var code 		= event.keyCode;
	var character 	= String.fromCharCode(code).toLowerCase();
	//handle text nodes
	if (target.nodeType == 3) {
		target = target.parentNode;
	};
	//Skip additional textual elements within forms
	if( this.targetIsTextInputElement(target) ) {
		return;
	};

	if (code == 188) character = ','; //If the user presses , when the type is onkeydown	
	if (code == 190) character = '.'; //If the user presses , when the type is onkeydown
		
	if (code === this.specialKeys[this.key] || character === this.key) {
		// prevent default key behavior
		this.preventDefault(event);
		//call attached listener
		this.callback(event);
	};
};