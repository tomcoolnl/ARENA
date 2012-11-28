;
var Sprite = function Sprite(src, width, height, offsetX, offsetY, frames, duration) {

	this.spritesheet 	= null;
	this.offsetX 		= offsetX || 0;
	this.offsetY 		= offsetY || 0;
	this.width 			= width;
	this.height 		= height;
	this.frames 		= 1;
	this.currentFrame 	= 0;
	this.duration 		= 1;
	this.posx 			= 0;
	this.posy 			= 0;
	this.shown 			= true;
	this.zoomLevel 		= 1;
	
	this.setSpritesheet(src);
	this.setOffset(offsetX, offsetY);
	this.setFrames(frames);
	this.setDuration(duration);
	
	if (this.duration > 0 && this.frames > 0) {
		this.ftime = new Date().getTime() + (this.duration / this.frames);
	} else {
		this.ftime = 0;
	};
};
Sprite.prototype.setSpritesheet = function (src) {
	if (src instanceof Image) {
		this.spritesheet = src;
	} else {
		this.spritesheet = new Image();
		this.spritesheet.src = src;
	};
};
Sprite.prototype.setPosition = function (x, y) {
	this.posx = x;
	this.posy = y;
};
Sprite.prototype.setOffset = function (x, y) {
	this.offsetX = x;
	this.offsetY = y;
};
Sprite.prototype.setFrames = function (fcount) {
	this.currentFrame = 0;
	this.frames = fcount;
};
Sprite.prototype.setDuration = function (duration) {
	this.duration = duration;
};
Sprite.prototype.animate = function (ctx, time) {
	if (time.getMilliseconds() > this.ftime) {
		this.nextFrame();
	};
	this.draw(ctx);
};
Sprite.prototype.nextFrame = function () {
	if (this.duration > 0) {
		if (this.duration > 0 && this.frames > 0) {
			this.ftime =  new Date().getTime() + (this.duration / this.frames);
		} else {
			this.ftime = 0;
		};
		this.offsetX = this.width * this.currentFrame;
		if (this.currentFrame === (this.frames - 1)) {
			this.currentFrame = 0;
		} else {
			this.currentFrame++;
		};
	};
};
Sprite.prototype.draw = function(context, x, y) {
	if (this.shown) {
		context.drawImage(this.spritesheet, 
					this.offsetX, 
					this.offsetY, 
					this.width, 
					this.height, 
					x, 
					y, 
					this.width * this.zoomLevel, 
					this.height * this.zoomLevel
				);
	};
};
