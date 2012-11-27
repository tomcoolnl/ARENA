
function Bullet(canvas, context, active, speed, posx, posy, width, height, color) {
	this.canvas 	= canvas;
	this.context 	= context;
	this.active 	= active || true;
	this.posx 		= posx;
	this.posy 		= posy;
	this.xVelocity 	= 0;
	this.yVelocity 	= -speed;
	this.width 		= width || 3;
	this.height 	= height || 3;
	this.color 		= color || '#fff';
};

Bullet.prototype.inBounds = function() {
	 return this.posx >= 0 
	 	 && this.posx <= this.canvas.width 
	 	 && this.posy >= 0 
	 	 && this.posy <= this.canvas.height;
};

Bullet.prototype.draw = function() {
	this.context.fillStyle = this.color;
	this.context.fillRect( this.posx, this.posy, this.width, this.height );
};

Bullet.prototype.update = function() {
	this.posx += this.xVelocity;
    this.posy += this.yVelocity;
    this.active = this.active && this.inBounds();
};

Bullet.prototype.explode = function() {
	this.active = false;
	//TODO add explosion animation through sprites
};
