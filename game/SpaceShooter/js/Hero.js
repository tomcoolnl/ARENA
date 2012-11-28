
function Hero(canvas, context, active, posx, posy, width, height) {
	this.canvas 	= canvas;
	this.context 	= context;
	this.active 	= active || false; 
	this.posx 		= posx;
	this.posy 		= posy;
	this.width 		= width;
	this.height 	= height;
	this.bullets 	= [];
    
    this.defaultSpriteOffsetX = 40;
	this.sprite 	= new Sprite('images/game.png', this.width, this.height, this.defaultSpriteOffsetX, 0);
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
	this.posx -= 10;
	this.posx = this.posx.clamp(0, this.canvas.width - this.width);
    this.sprite.offsetX = 0;
};

Hero.prototype.moveRight = function() {
	this.posx += 10;
	this.posx = this.posx.clamp(0, this.canvas.width - this.width);
    this.sprite.offsetX = 80;
};

Hero.prototype.moveUp = function() {
	this.posy -= 10;
	this.posy = this.posy.clamp(0, this.canvas.height - this.height);
};

Hero.prototype.moveDown = function() {
	this.posy += 10;
	this.posy = this.posy.clamp(0, this.canvas.height - this.height);
};

Hero.prototype.shoot = function() {
	//Sound.play("shoot");
	var position = this.midpoint();
	this.bullets.push(
		new Hero.Bullet( this.canvas, this.context, true, 16, position.x, position.y, 7, 19 )
	);
};

Hero.prototype.resetSprite = function() {
	this.sprite.offsetX = this.defaultSpriteOffsetX;
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
