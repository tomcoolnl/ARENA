
EventPublisher = function EventPublisher() { };

EventPublisher.prototype.subscribers = {
	any : new Array()
};

EventPublisher.prototype.subscribe = function( fn, type ) {
	 type = type || 'any';
	  if (typeof this.subscribers[type] === "undefined") {
        this.subscribers[type] = new Array();
    }
    this.subscribers[ type ].push( fn );
};

EventPublisher.prototype.unsubscribe = function( fn, type ) {
	this.visitSubscribers('unsubscribe', fn, type);
};

EventPublisher.prototype.publish = function( publication, type ) {
	 this.visitSubscribers('publish', publication, type);
};

EventPublisher.prototype.visitSubscribers = function( action, arg, type ) {
   type = type || 'any';
   var subscribers = this.subscribers[ type ], 
       i, max = subscribers.length;

    for (i = 0; i < max; i += 1) {
        if (action === 'publish') {
            subscribers[i](arg);
        } else {
            if (subscribers[i] === arg) {
                subscribers.splice(i, 1);
            };
        };
    };
};
