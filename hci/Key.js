//pauze
//refresh

//combine keys

var Key = {

	pressed : {},

	LEFT : 37,
	UP : 38,
	RIGHT : 39,
	DOWN : 40,

	check : function(key) {
		switch(key) {
			case 16 :
				console.log('Shift');
				break;
			case 17 :
				console.log('Ctrl');
				break;
			case 18 :
				console.log('Alt');
				break;
			case 19 :
				console.log('Pause');
				break;
			case 37 :
				console.log('Arrow Left');
				break;
			case 38 :
				console.log('Arrow Up');
				break;
			case 39 :
				console.log('Arrow Right');
				break;
			case 40 :
				console.log('Arrow Down');
				break;
		}
	},
	
	isDown : function(keyCode) {
		return this.pressed[keyCode];
	},
	
	onKeydown : function(event) {
		event = event || window.event;
		var charCode = (typeof event.which === "number") ? event.which : event.keyCode;

		// if (event.altKey || event.ctrlKey || event.shiftKey) {
		// console.log("you pressed one of the 'Alt', 'Ctrl', or 'Shift' keys", charCode);
		// };

		// if(event.keyCode === 27) { //esc
			// return false;
		// };

		if (charCode && !(charCode in this.pressed)) {
		// if (charCode) {
			this.check(charCode);
			console.log("Character typed: " + String.fromCharCode(charCode));
			this.pressed[event.keyCode] = true;
		};
		
		return false;
	},
	
	onKeyup : function(event) {
		event = event || window.event;
		var charCode = ( typeof event.which === "number") ? event.which : event.keyCode;
		if(charCode) {
			console.log("Character removed: " + String.fromCharCode(charCode));
			delete this.pressed[event.keyCode];
		};

	},
	
	combine : function () {
		// for (var i = 0, n = arguments.length; i < n; i += 1) {
// 			combine tha keys
		// };
	}, 
	
	/**
	 * translate a keyboard key description to a number
	 * @param 	{String} 	key 	The key to translate
	 * @returns {Number}	The associated number or 0 if undefined
	 */
	translate : function (key) {
		if (typeof key === 'string') {
			switch (key.toLowerCase()) {
				case 'shift': //key for combinations
					return 16;
				case 'p': //pause key
					return 80;
				case 'r': //refresh key
					return 82;
				case 'z': //action key 1
					return 90;
				case 'x	': //action key 2
					return 88;
				//etc...
				default:
					return 0;
			};
		};
	}
};

window.addEventListener('keyup', function(event) {
	Key.onKeyup(event);
	console.log(Key.pressed);
}, false);

window.addEventListener('keydown', function(event) {
	Key.onKeydown(event);
	console.log(Key.pressed);
}, false);
