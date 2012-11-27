
EventListener = function EventListener(elem, eventType, listener, useCapture) {
	if (typeof elem !== 'undefined') {
		this.elem = elem;
	}else {
		throw new TypeError('No element specified...');
	};
	this.eventType = eventType;
	this.listener = listener || function () {};
	this.useCapture = useCapture || false;
	this.add(this.elem, this.eventType, this.listener, this.useCapture);
};

EventListener.add = EventListener.prototype.add = function(elem, eventType, listener, useCapture) {
	'use strict';
	// console.log(this);
	if (typeof elem !== 'undefined') {
		this.elem = elem;
	} else {
		throw new EventError('EventListener couldn\'t be bound to given element, or element is missing...');
	};
	this.eventType = eventType;
	this.listener = listener || function () {};
	this.useCapture = useCapture || false;
	this.elem.addEventListener(this.eventType, this.listener, this.useCapture);
};

EventListener.remove = EventListener.prototype.remove = function () {
	'use strict';
	// console.log(this);
	this.elem.removeEventListener(this.eventType, this.listener, this.useCapture);
	//return this;
};

EventListener.enable = EventListener.prototype.enable = function () {
	'use strict';
	// console.log(this);
	this.add(this.elem, this.eventType, this.listener, this.useCapture);
	//return this;
};

EventListener.disable = EventListener.prototype.disable = function () {
	'use strict';
	// console.log(this);
	this.remove();
	//return this;
};

EventListener.preventDefault = EventListener.prototype.preventDefault = function(event, stopPropagation) {
	'use strict';
	stopPropagation = stopPropagation || true;
	event.preventDefault();
	if (stopPropagation) event.stopPropagation();
};
