
Entity = function Entity(canvas, context, active, posx, posy, width, height, spriteSrc) {
	
	this.canvas = canvas;
	this.context = context;
	this.active = active || true;
	this.posx = posx || 0;
	this.posy = posy || 0;
	this.width = width;
	this.height = height;
	
	if (typeof spriteSrc === 'string' &&  spriteSrclength > 0) {
		this.sprite = new Sprite(spriteSrc, this.width, this.height, 0, 0);
	} else {
		this.sprite = undefined;
	};
	
	return this;
};

Entity.prototype.isAlive = function() {
	'use strict';
	return this.active && this.inBounds();
};

Entity.prototype.inBounds = function() {
	'use strict';
	return this.posx >= 0 
		&& this.posx <= this.canvas.width 
		&& this.posy >= 0 
		&& this.posy <= this.canvas.height;
};

Entity.prototype.draw = function() {
	'use strict';
	if (typeof this.sprite !== 'undefined') {
		this.sprite.draw(this.context, this.posx, this.posy);
	} else {
		throw new Error('Nothing to draw...');
	};
};

Entity.prototype.activate = function() {
	'use strict';
	this.active = true;
};

Entity.prototype.deactivate = function() {
	'use strict';
	this.active = false;
};

Entity.prototype.explode = function() {
	'use strict';
	this.deactivate();
};
