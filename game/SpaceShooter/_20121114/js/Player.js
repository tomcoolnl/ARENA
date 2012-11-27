
Player = function Player(canvas, context, active, posx, posy, width, height) {
	this.canvas 	= canvas;
	this.context 	= context;
	this.active 	= active || false; 
	this.posx 		= posx;
	this.posy 		= posy;
	this.width 		= width;
	this.height 	= height;
	this.bullets 	= [];
	this.sprite 	= new Sprite('images/player.png', this.width, this.height, 0, 0);
}

Player.prototype.draw = function() {
	// this.context.fillStyle = '#00A';
	// this.context.fillRect( this.posx, this.posy, this.width, this.height );
	this.bullets.forEach(function(bullet) {
    	bullet.draw();
	});
	this.sprite.draw(this.context, this.posx, this.posy);
	// console.log(this.sprite)
};

Player.prototype.update = function() {
	this.bullets.forEach(function(bullet) {
		bullet.update();
	});
};

Player.prototype.moveLeft = function() {
	console.log('player moving left');
	this.posx -= 8;
	this.posx = this.posx.clamp(0, this.canvas.width - this.width);
};

Player.prototype.moveRight = function() {
	console.log('player moving right');
	this.posx += 8;
	this.posx = this.posx.clamp(0, this.canvas.width - this.width);
};

Player.prototype.shoot = function() {
	//Sound.play("shoot");
	console.log('player shooting');
	var position = this.midpoint();
	this.bullets.push(
		new Bullet(this.canvas, this.context, true, 5, position.x, position.y )
	);
};
    
Player.prototype.midpoint = function() {
	return {
		x : this.posx + (this.width / 2),
		y : this.posy + (this.height / 2)
	};
};

Player.prototype.explode = function() {
	this.active = false;
};
