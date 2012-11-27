
EventError = function EventError(message){
    this.name = 'EventError';
    this.message = message || 'Default Message';
};

EventError.prototype = new Error();
EventError.prototype.constructor = EventError;