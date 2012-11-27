
SpaceShooter = (function(window, document, undefined) {
	
	'use strict';
	
	var self, 
	
	canvas, context,
	
	player, enemies,
	
	events = {
		directionalKeys : null,
		shoot : null,
		pauze : null
	},
	
	STATE = {
		_current 	: null,
		WELCOME 	: 'WELCOME',
		PAUZED 		: 'PAUZED',
		PLAYING		: 'PLAYING',
		STOPPED		: 'STOPPED',
		GAMEOVER	: 'GAMEOVER'
	},
	
	_ = {
		
		bindKeyEvents : function() {
			var wasd = true;
			
			events.pauze = new KeyEventListener('p', KeyEventListener.eventType.DOWN, function() {
				if (STATE._current === STATE.PAUZED) {
					STATE._current = STATE.PLAYING;
					_.render();
				} else {
					STATE._current = STATE.PAUZED;
					SpaceShooter.pauze();
				};
			});
			
			events.hiddentab = new EventListener(window, 'onblur', function(event) {
				alert('window blurred');
			});
			
			if (window.onblur) {
				alert('window blurred');
			};
			
			events.directionalKeys = new DirectionalKeyEventListener({
				left : function () {
					player.moveLeft();
				},
				right : function() {
					player.moveRight();
				}
			}, wasd);
			
			events.shoot = new KeyEventListener('space', KeyEventListener.eventType.DOWN, function () {
				STATE._current = STATE.PLAYING;
				player.shoot();
			});
		},
		
	
		handleCollisions : function() {
	
			player.bullets.forEach(function(bullet) {
				enemies.forEach(function(enemy) {
					if ( _.collides(bullet, enemy) ) {
						enemy.explode();
						bullet.explode();
						// bullet.active = false;
					};
				});
			});

			enemies.forEach(function(enemy) {
				if ( _.collides(enemy, player) ) {
					enemy.explode();
					player.explode();
				};
			}); 
		},
		
		collides : function(a, b) {
			return a.posx < b.posx + b.width 
				&& a.posx + a.width > b.posx 
				&& a.posy < b.posy + b.height 
				&& a.posy + a.height > b.posy;
		},
		
		update : function() {
			//update player
			player.update();
			//update enemies
			enemies.forEach(function(enemy) {
				enemy.update();
			});
			//update enemies array
			enemies = enemies.filter(function(enemy) {
				return enemy.active;
			});
			//detect bullet impact or if any enemy hits player
			 _.handleCollisions();
			//TODO this can be more intelligent
			if (Math.random() < 0.02) {
				enemies.push( new Enemy(canvas, context, true) );
			};
			
			events.directionalKeys.handleMovement();
		},
		
		draw : function() {
			context.clearRect(0, 0, canvas.width, canvas.height);
		    player.draw();
		    enemies.forEach(function(enemy) {
				enemy.draw();
			});
		},
		
		render : function () {
			if (STATE._current === STATE.PLAYING) {
				window.requestAnimationFrame( _.render );
				_.update();
				_.draw();
			};
		}
	};
	
	return {
		
		pauze : function() {
			STATE._current = STATE.PAUZED;
			
			var x = canvas.width / 2;
			var y = canvas.height / 2;
			context.font = '30pt Calibri';
			context.textAlign = 'center';
			context.fillStyle = 'white';
			context.fillText('PAUZED', x, y);
		},
		
		init : function() {
			canvas 	= document.querySelector('#main');
			context = canvas.getContext('2d');
			player 	= new Hero(canvas, context, true, 50, 270, 32, 32);
			enemies = new Array();
			// console.dir(player);
			// bind keyboard
			_.bindKeyEvents();
			// start the game
			STATE._current = STATE.PLAYING;
			_.render();
		}
	};	
	
}(this, this.document));

new EventListener(this, 'load', SpaceShooter.init);
