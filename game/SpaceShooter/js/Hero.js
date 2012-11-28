
function Hero(canvas, context, active, position, dimensions) {
    'use strict';
    Array.prototype.push.call(arguments, 'images/game.png');
    MovingEntity.apply(this, arguments);
	this.bullets = [];
    this.defaultSpriteOffsetX = 40;
};

Hero.extends(MovingEntity);
/**
 * @overwrites
 * @returns {undefined}
 */
Hero.prototype.draw = function() {
    'use strict';
	this.bullets.forEach(function(bullet) {
    	bullet.draw();
	});
	this.constructor.parent.draw.call(this);
};

Hero.prototype.update = function() {
    'use strict';
	this.bullets.forEach(function(bullet) {
		bullet.update();
	});
};

Hero.prototype.moveLeft = function() {
    'use strict';
	this.position.x -= 10;
	this.position.x = this.position.x.clamp(0, this.canvas.width - this.dimensions.width);
    this.sprite.offsetX = 0;
};

Hero.prototype.moveRight = function() {
    'use strict';
	this.position.x += 10;
	this.position.x = this.position.x.clamp(0, this.canvas.width - this.dimensions.width);
    this.sprite.offsetX = 80;
};

Hero.prototype.moveUp = function() {
    'use strict';
	this.position.y -= 10;
	this.position.y = this.position.y.clamp(0, this.canvas.height - this.dimensions.height);
};

Hero.prototype.moveDown = function() {
    'use strict';
	this.position.y += 10;
	this.position.y = this.position.y.clamp(0, this.canvas.height - this.dimensions.height);
};

Hero.prototype.shoot = function() {
    'use strict';
	//Sound.play("shoot");
	var position = this.midpoint();
	this.bullets.push(
		new Hero.Bullet( this.canvas, this.context, true, 16, position.x, position.y, 7, 19 )
	);
};

Hero.prototype.resetSprite = function() {
    'use strict';
	this.sprite.offsetX = this.defaultSpriteOffsetX;
};
    
Hero.prototype.midpoint = function() {
    'use strict';
	return {
		x : this.position.x + (this.dimensions.width / 2),
		y : this.position.y + (this.dimensions.height / 2)
	};
};

Hero.Bullet = function Bullet(canvas, context, active, position, dimensions, speed) {
    'use strict';
     
	this.velocity = {x : 0, y : -speed};
	arguments.pop();
    arguments.push('images/bullet.png');
    MovingEntity.apply(this, arguments);
};

Hero.Bullet.extends(MovingEntity);

Hero.Bullet.prototype.update = function() {
    'use strict';
	this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.active = this.isAlive();
};