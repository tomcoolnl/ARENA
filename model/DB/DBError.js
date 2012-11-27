
;var DBError = function(msg, type) {
    this.name = 'DBError';
    this.message = msg || 'undefiend DBError occured';
    this.type = type || 0; //TODO
    this.stack = (new Error()).stack;
};

DBError.prototype = new Error;

DBError.prototype.constructor = DBError;
