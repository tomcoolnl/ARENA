 
function Enemy(canvas, context, active, position, dimensions) {
	'use strict';
    
    Array.prototype.push.call(arguments, 'images/enemy.png');
    MovingEntity.apply(this, arguments);
    
	this.position.x	= this.setRandomPositionX();
    this.age = (Math.random() * 128) << 0;
    this.velocity = {x : 0, y : 2};
};
/**
 * 
 * @param {MovingEntity} param
 */
Enemy.extends(MovingEntity);
/**
 * @overwrite
 * @returns {undefined}
 */
Enemy.prototype.update = function() {
	'use strict';
	this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x = 3 * Math.sin(this.age * Math.PI / 64);
    this.age += 1;
    this.active = this.isAlive();
};

Enemy.prototype.setRandomPositionX = function() {
    return this.canvas.width / 4 + Math.random() * this.canvas.width / 2;
};