
;StaticEntity = function StaticEntity(canvas, context, active, posx, posy, width, height, spriteSrc) {
	'use strict';
    
	this.canvas = canvas;
	this.context = context;
	this.active = active || true;
	this.posx = posx || 0;
	this.posy = posy || 0;
	this.width = width;
	this.height = height;
	
	if (typeof spriteSrc === 'string' &&  spriteSrc.length > 0) {
		this.sprite = new Sprite(spriteSrc, this.width, this.height, 0, 0);
	} else {
		this.sprite = undefined;
	};
	
	return this;
};

StaticEntity.extends(GameEntity);
