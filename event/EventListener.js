/**
 * @author Tom Cool
 * @version 0.1
 * 
 * Alternative Event binding, flexible through inheritance 
 * @class EventListener
 * @constructor
 * @this {EventListener}
 * 
 * @param {Object}      elem        HTML DOM object to invoke the event upon
 * @param {String}      eventType   Event type to listen for
 * @param {Function}    listener    Function to execute if event is fired
 * @param {Boolean}     useCapture  Standard set to false
 * @returns {EventListener}
 */
;EventListener = function EventListener(elem, eventType, listener, useCapture) {
	if (typeof elem !== 'undefined') {
        /**
         * HTML DOM object to invoke the event upon
         * @property elem
         * @type object
         * @private
         */
        this.elem = elem;
	}else {
		throw new TypeError('No element specified...');
	};
    /**
     * Event type to listen for
     * @property eventType
     * @type string
     * @private
     */
	this.eventType = eventType;
    /**
     * Function to execute if event is fired
     * @property listener
     * @type function
     * @private
     */
	this.listener = listener || function () {};
    /**
     * Standard set to false
     * @property useCapture
     * @type boolean
     * @private
     */
	this.useCapture = useCapture || false;
    // The actual binding
	this.add(this.elem, this.eventType, this.listener, this.useCapture);
};
/**
 * The actual binding
 * @param {Object}      elem        HTML DOM object to invoke the event upon
 * @param {String}      eventType   Event type to listen for
 * @param {Function}    listener    Function to execute if event is fired
 * @param {Boolean}     useCapture  Standard set to false
 * @this {EventListener}
 * @return {Void}
 * @method add
 */
EventListener.add = EventListener.prototype.add = function(elem, eventType, listener, useCapture) {
	'use strict';
	// console.log(this);
	if (typeof elem !== 'undefined') {
		this.elem = elem;
	} else {
		throw new EventError('EventListener couldn\'t be bound to given element, or element is missing...');
	};
	this.eventType  = eventType;
	this.listener   = listener || function () {};
	this.useCapture = useCapture || false;
	this.elem.addEventListener(this.eventType, this.listener, this.useCapture);
};
/**
 * Remove Event Listener
 * @this {EventListener}
 * @return {Void}
 * @method remove
 */
EventListener.remove = EventListener.prototype.remove = function () {
	'use strict';
	this.elem.removeEventListener(this.eventType, this.listener, this.useCapture);
};
/**
 * Enable Event Listener
 * @this {EventListener}
 * @return {Void}
 * @method enable
 */
EventListener.enable = EventListener.prototype.enable = function () {
	'use strict';
	this.add(this.elem, this.eventType, this.listener, this.useCapture);
};
/**
 * Disable Event Listener
 * @this {EventListener}
 * @return {Void}
 * @method disable
 */
EventListener.disable = EventListener.prototype.disable = function () {
	'use strict';
	this.remove();
};
/**
 * Remove Event Listener
 * @param {Object}      event               HTML DOM object to invoke the event upon
 * @param {Boolean}     stopPropagation     Wether or not to stop event propagation
 * @this {EventListener}
 * @return {Void}
 * @method preventDefault
 */
EventListener.preventDefault = EventListener.prototype.preventDefault = function(event, stopPropagation) {
	'use strict';
	stopPropagation = stopPropagation || true;
	event.preventDefault();
	if (stopPropagation) event.stopPropagation();
};