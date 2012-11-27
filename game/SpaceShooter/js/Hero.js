
Hero = function Hero(canvas, context, active, posx, posy, width, height) {
	this.canvas 	= canvas;
	this.context 	= context;
	this.active 	= active || false; 
	this.posx 		= posx;
	this.posy 		= posy;
	this.width 		= width;
	this.height 	= height;
	this.bullets 	= [];
	this.sprite 	= new Sprite('images/player.png', this.width, this.height, 0, 0);
};

Hero.extends(Entity);

Hero.prototype.draw = function() {
	this.bullets.forEach(function(bullet) {
    	bullet.draw();
	});
	this.constructor.parent.draw.call(this);
};

Hero.prototype.update = function() {
	this.bullets.forEach(function(bullet) {
		bullet.update();
	});
};

Hero.prototype.moveLeft = function() {
	this.posx -= 8;
	this.posx = this.posx.clamp(0, this.canvas.width - this.width);
};

Hero.prototype.moveRight = function() {
	this.posx += 8;
	this.posx = this.posx.clamp(0, this.canvas.width - this.width);
};

Hero.prototype.shoot = function() {
	//Sound.play("shoot");
	var position = this.midpoint();
	this.bullets.push(
		new Hero.Bullet( this.canvas, this.context, true, 8, position.x, position.y, 7, 19 )
	);
};
    
Hero.prototype.midpoint = function() {
	return {
		x : this.posx + (this.width / 2),
		y : this.posy + (this.height / 2)
	};
};

Hero.Bullet = function Bullet(canvas, context, active, speed, posx, posy, width, height, color) {
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
	this.sprite 	= new Sprite('images/bullet.png', this.width, this.height, 0, 0);
};

Hero.Bullet.extends(Entity);

Hero.Bullet.prototype.update = function() {
	this.posx += this.xVelocity;
    this.posy += this.yVelocity;
    this.active = this.isAlive();
};
