function Player() {
	this.x = 0;
	this.y = 0;
}

Player.prototype.draw = function(context) {
	context.fillRect(this.x, this.y, 32, 32);
};

Player.prototype.moveLeft = function() {
	this.x -= 1;
};

Player.prototype.moveRight = function() {
	this.x += 1;
};

Player.prototype.moveUp = function() {
	this.y -= 1;
};

Player.prototype.moveRight = function() {
	this.y += 1;
};
Player.prototype.update = function() {
	if (Key.isDown(Key.UP)) {
		this.moveUp();
	};
	if (Key.isDown(Key.LEFT)) {
		this.moveLeft();
	};
	if (Key.isDown(Key.DOWN)) {
		this.moveDown();
	};
	if (Key.isDown(Key.RIGHT)) {
		this.moveRight();
	};
};

// Game.update = function() {
  // ...
  // Game.player.update();
  // ...
// };


