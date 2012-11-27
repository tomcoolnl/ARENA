
;var WebSQL = function (name, version, description, size, callback) {
	this.db = null;
	this.name = name || undefined;
	this.version = version || '1.0';
	this.description = description || '';
	this.size = size || 2 * 1024 * 1024;
	this.callback = callback || function () {};
	
	this.create();
};

WebSQL.prototype.create = function () {
	if (typeof this.name !== 'undefined') {
		this.db = openDatabase(this.name, this.version, this.description, this.size);
	} else {
		throw new Error('Undefined DataBase name');
	};
};

WebSQL.prototype.transaction = function () {
	
};
