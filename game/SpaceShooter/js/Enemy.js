 
Enemy = function Enemy(canvas, context, active, posx, posy, width, height) {
	'use strict';
	this.canvas 	= canvas;
	this.context 	= context;
	
	this.active 	= active || true;
	this.posx 		= posx || canvas.width / 4 + Math.random() * canvas.width / 2;
	this.posy 		= posy || 0;
	this.width 		= width || 32;
    this.height 	= height || 32;
    
    this.age = (Math.random() * 128) << 0;
    this.xVelocity 	= 0;
    this.yVelocity 	= 2;
    
    this.sprite 	= new Sprite('images/enemy.png', this.width, this.height, 0, 0);
};

Enemy.extends(MovingEntity);

Enemy.prototype.update = function() {
	'use strict';
	
	this.posx += this.xVelocity;
    this.posy += this.yVelocity;

    this.xVelocity = 3 * Math.sin(this.age * Math.PI / 64);
    this.age += 1;

    this.active = this.isAlive();
};