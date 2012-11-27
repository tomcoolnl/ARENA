
ShortcutKeyEventListener = function ShortcutKeyEventListener(combination, callback) {
	'use strict';
	
	var self 			= this;
	this.elem 			= document;
	this.keycode 		= false;
	this.combination 	= combination.toLowerCase().split('+') || undefined;
	this.callback 		= callback || function () {};
	
	this.modifiers = {
		shift: { wanted : false, pressed : false },
		ctrl : { wanted : false, pressed : false },
		alt  : { wanted : false, pressed : false },
		meta : { wanted : false, pressed : false }	//Meta is Mac specific
	};
	
	if (typeof this.combination !== 'undefined' && this.combination.length === 2) {
		this.add( this.elem, 'keydown', function(event) { 
			self.validate(event);
		});
	} else {
		throw new TypeError('Key combination is undefined or not limited to 2...');
	};
	
	return this;
};

ShortcutKeyEventListener.extends(KeyEventListener);


ShortcutKeyEventListener.prototype.shiftNums = new Enum({
	"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", 
	"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<", 
	".": ">",  "/": "?",  "\\" : "|"
});

ShortcutKeyEventListener.prototype.validate = function(event) {
	'use strict';
	
	//event.preventDefault();

	var target	 	= event.target;
	var code 		= event.keyCode;
	var character 	= String.fromCharCode(code).toLowerCase();
	
	if (target.nodeType == 3) { //Skip text nodes
		target = target.parentNode;
	};
	
	if ( this.targetIsInputElement(target) ) {
		return;
	};
	
	if (code == 188) character = ","; //If the user presses , when the type is onkeydown	
	if (code == 190) character = "."; //If the user presses , when the type is onkeydown

	//Key Pressed - counts the number of valid keypresses
	//if it is same as the number of keys, the shortcut function is invoked
	var pressedKeys = 0;
	
	if (event.ctrlKey)	this.modifiers.ctrl.pressed  = true;
	if (event.shiftKey)	this.modifiers.shift.pressed = true;
	if (event.altKey)	this.modifiers.alt.pressed   = true;
	if (event.metaKey)  this.modifiers.meta.pressed  = true;
    
    var i, key, n = this.combination.length;
	for (i = 0; key = this.combination[i], i < n; i += 1) {
		//Modifiers
		if (key == 'ctrl' || key == 'control') {
			pressedKeys += 1;
			this.modifiers.ctrl.wanted = true;

		} else if (key == 'shift') {
			pressedKeys += 1;
			this.modifiers.shift.wanted = true;

		} else if (key == 'alt') {
			pressedKeys += 1;
			this.modifiers.alt.wanted = true;
			
		} else if (key == 'meta') {
			pressedKeys += 1;
			this.modifiers.meta.wanted = true;
			
		} else if (key.length > 1) { //If it is a special key
			if (this.specialKeys[key] == code) {
				pressedKeys += 1;
			};
		} else if (this.keycode) {
			if (this.keycode == code) {
				pressedKeys += 1;
			};
		} else { //The special keys did not match
			if (character == key) {
				pressedKeys += 1;
			} else {
				//Stupid Shift key bug created by using lowercase
				if (this.shiftNums[character] && event.shiftKey) { 
					character = this.shiftNums[character];
					if (character == key) {
						pressedKeys += 1;
					};
				};
			};
		};
	};

	if (pressedKeys == keys.length &&
			this.modifiers.ctrl.pressed === this.modifiers.ctrl.wanted &&
			this.modifiers.shift.pressed === this.modifiers.shift.wanted &&
			this.modifiers.alt.pressed === this.modifiers.alt.wanted &&
			this.modifiers.meta.pressed === this.modifiers.meta.wanted) {
		
		this.callback(event);
	};
	
	return this;
};
