
;var Canvas = function (id, type, width, height) {
	this.id 		= id;
	this.type		= type || '2d';
	this.canvas 	= document.getElementById(this.id);
	this.context 	= this.canvas.getContext ? this.canvas.getContext(this.type) : undefined;
	
	this.canvas.width	= width  || document.documentElement.clientWidth;
	this.canvas.height	= height || document.documentElement.clientHeight;
	//log message
	console.info('Canvas created: ', this);
};

Canvas.prototype.createGrid = function (columns, rows, margin, callback) {
	
	callback = callback || function () {};
	
	var row, column, width, height;
	
	this.columns 	= this.canvas.width / columns;
	this.rows 		= rows || Math.round(this.canvas.height / this.columns);
	this.margin 	= margin || 0;
	this.grid		= [];
	
	console.log(this.canvas.height);
	
	for (row = 0; row < this.rows; row += 1) {
		this.grid[row] = [];
		for (column = 0; column < this.columns; column += 1) {
			width = this.canvas.width / this.columns;
			height = this.canvas.height / this.rows;
			this.grid[row][column] = new Block(this.context, width, height, callback); 
		};
	};
	
	console.info('Grid created.');
};

Canvas.prototype.showGrid  = function () {
	var rows = this.rows;
	while (rows -= 1) {
		console.log(rows);
	}
};

var Block = function( context, x, y, callback) {
	callback = callback || function () {};
	this.x = x;
	this.y = y;
	this.neighbours = [];
	callback();
}
