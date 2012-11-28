
;SpaceShooter = (function(window, document, undefined) {
	
	'use strict';
	
	var self, 
	
	canvas, context,
	
	hero, enemies,
	
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
			
			events.directionalKeys = new DirectionalKeyEventListener({
				left : function() {
					hero.moveLeft();
				},
				right : function() {
					hero.moveRight();
				},
                up : function() {
                    hero.moveUp();
                },
                down : function() {
                    hero.moveDown();
                }
			}, wasd);
			
			events.shoot = new KeyEventListener('space', KeyEventListener.eventType.DOWN, function () {
				STATE._current = STATE.PLAYING;
				hero.shoot();
			});
		},
		
	
		handleCollisions : function() {
	
			hero.bullets.forEach(function(bullet) {
				enemies.forEach(function(enemy) {
					if ( _.collides(bullet, enemy) ) {
						enemy.explode();
						bullet.explode();
					};
				});
			});

			enemies.forEach(function(enemy) {
				if ( _.collides(enemy, hero) ) {
					enemy.explode();
					hero.explode();
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
			//update hero
			hero.update();
			//update enemies
			enemies.forEach(function(enemy) {
				enemy.update();
			});
			//update enemies array
			enemies = enemies.filter(function(enemy) {
				return enemy.active;
			});
			//detect bullet impact or if any enemy hits hero
			 _.handleCollisions();
			//TODO this can be more intelligent
			if (Math.random() < 0.02) {
				enemies.push( new Enemy(canvas, context, true) );
			};
			
			events.directionalKeys.handleMovement();
            
            if (events.directionalKeys.noKeysArePressed()) {
                hero.resetSprite();
            };
		},
		
		draw : function() {
			context.clearRect(0, 0, canvas.width, canvas.height);
		    hero.draw();
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
            self    = this;
            
			canvas 	= document.querySelector('#main');
//            canvas.width = document.body.clientWidth - (canvas.style.paddingLeft + canvas.style.paddingRight);
//            canvas.height = document.body.clientHeight - (canvas.style.paddingTop + canvas.style.paddingBottom);
			context = canvas.getContext('2d');
			
            hero 	= new Hero(canvas, context, true, 50, 270, 40, 40);
			enemies = new Array();
			// console.dir(hero);
			// bind keyboard
			_.bindKeyEvents();
			// start the game
			STATE._current = STATE.PLAYING;
			_.render();
		}
	};	
	
}(this, this.document));

new EventListener(this, 'load', SpaceShooter.init);
