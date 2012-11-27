
/**
 * 1. Begin gesture if you receive a touchstart event containing one target touch.
 * 2. Abort gesture if, at any time, you receive an event with >1 touches.
 * 3. Continue gesture if you receive a touchmove event mostly in the x-direction.
 * 4. Abort gesture if you receive a touchmove event mostly the y-direction.
 * 5. End gesture if you receive a touchend event.
 * 
 * TODO add multi-touch
 * TODO new Event.SwipeListener(element, listener);
 */

/**
 * To new or not to new
 * Custom events http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/
 * Event base class ( Object.extendClasses(Class1, Class2) ?)
 * MODULAR SINGLETON!!!!
 * 
 */

var SwipeListener = function (elem, listener, vt, ht) {
	
	this.elem 		= elem;
	this.listener 	= listener;
	
	this.startX		= null;
	this.startY		= null;
	this.dx			= null;
	this.direction	= null;
	
	this.verticalThreshold 		= vt || 100; 
	this.horizontalThreshold 	= ht || 100;
	
	this.elem.addEventListener('touchstart', this.onTouchStart, false);
};

SwipeListener.prototype.cancelTouch = function () {
	
	this.elem.removeEventListener('touchmove', this.onTouchMove);
	this.elem.removeEventListener('touchend', this.onTouchEnd);
	
	this.startX 	= null;
	this.startY 	= null;
	this.dx 		= null;
	this.direction 	= null;
};

SwipeListener.prototype.onTouchMove = function (event) {
	
	if (event.touches.length > 1) {
		this.cancelTouch();
		
	} else {
		this.dx = event.touches[0].pageX - this.startX;
		var dy = event.touches[0].pageY - this.startY;
		
		if (this.direction === null) {
			this.direction = this.dx;
			event.preventDefault();
			
		} else if ( (this.direction < 0 && this.dx > 0) || (this.direction > 0 && dthis.x < 0) || Math.abs(dy) > this.verticalThreshold ) {
			this.cancelTouch();
		};
	};
};

SwipeListener.prototype.onTouchEnd = function (event) {
	
	var dir = this.dx > 0 ? 'right' : 'left',
    	distance = Math.abs( this.dx );
    	
    this.cancelTouch();
    
    if ( distance > this.horizontalThreshold ) {
        listener({ target: this.elem, direction: dir});
    };
};

			
SwipeListener.prototype.onTouchStart = function (event) {
	alert('ontouchstart');
	if (event.touches.length === 1) {
		this.startX = event.touches[0].pageX;
		this.startY = event.touches[0].pageY;
		
		this.elem.addEventListener('touchmove', this.onTouchMove, false);
		this.elem.addEventListener('touchend', this.onTouchEnd, false);
	};
};

window.addEventListener('load', function () {
	if ('ontouchstart' in document.documentElement) {
		new SwipeListener(document.body, function (e) { 
			alert(e.direction); 
		});
	} else {
		alert('Swipe not supported');
	};
}, false);