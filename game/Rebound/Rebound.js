
    
Rebound = (function (window, document, undefined) {
	
	var self,
	    ball,
	    paddle,
	    score,
	    //initial speeds
	    dx = 6,
	    dy = 6,
	    currentScore = 0,
	    timer,
	    //set initial conditions for ball and paddle
	    paddleLeft 	= 228,
	    ballLeft 	= 200,
	    ballTop 	= 4,
	
	DOM = {
		ball 	: 'ball',
		paddle	: 'paddle',
		score	: 'score'
	},

	_ = {

	
		start : function() {
			//game loop
			_.detectCollisions();
			_.render();
			_.difficulty();

			//end conditions
			if (ballTop < 470) {
				//still in play - keep the loop going
				timer = window.setTimeout(_.start, 50);
			} else {
				_.gameOver();
			}
		}, 
		
		keyListener : function(e) {
			if (e.keyCode === 37 && paddleLeft > 0) {
				//keyCode 37 is left arrow
				paddleLeft -= 4;
				paddle.style.left = paddleLeft + 'px';
			}
			if (e.keyCode === 39 && paddleLeft < 436) {
				//keyCode 39 is right arrow
				paddleLeft += 4;
				paddle.style.left = paddleLeft + 'px';
			}
			//FYI - keyCode 38 is up arrow, keyCode 40 is down arrow
		}, 
		
		detectCollisions : function() {
			//just reflect the ball on a collision
			//a more robust engine could change trajectory of ball based
			//on where the ball hits the paddle
			if (_.collisionX()) {
				dx = dx * -1;
			};
			if (_.collisionY()) {
				dy = dy * -1;
			};
		}, 
		
		collisionX : function() {
			//check left and right boundaries
			if (ballLeft < 4 || ballLeft > 480) {
				return true;
			};
			return false;
		}, 
		
		collisionY : function() {
			//check if at top of playing area
			if (ballTop < 4) {
				return true;
			};
			//check to see if ball collided with paddle
			if (ballTop > 450) {
				if (ballLeft > paddleLeft && ballLeft < paddleLeft + 64) {
					return true;
				};
			}
			return false;
		}, 
		
		render : function() {
			_.moveBall();
			_.updateScore();
		},
		
		moveBall : function() {
			ballLeft += dx;
			ballTop += dy;
			ball.style.left = ballLeft + 'px';
			ball.style.top = ballTop + 'px';
		}, 
		
		updateScore : function() {
			currentScore += 5;
			score.innerHTML = 'Score: ' + currentScore;
		}, 
		
		difficulty : function() {
			//as the game progresses, increase magnitude of the vertical speed
			if (currentScore % 1000 == 0) {
				if (dy > 0)
					dy += 1;
				else
					dy -= 1;
			}
		}, 
		
		gameOver : function() {
			//end the game by clearing the timer, modifying the score label
			window.clearTimeout(timer);
			score.innerHTML += "   Game Over";
			score.style.backgroundColor = 'rgb(128,0,0)';
		}

	}; 

	
	return {
		
		init : function () {
			self = this;
			//instantiate HTML object instance vars
	        ball 	= document.getElementById(DOM.ball);
	        paddle 	= document.getElementById(DOM.paddle);
	        score 	= document.getElementById(DOM.score);
	        //register key listener with document object
	        document.addEventListener('keydown', _.keyListener, false);
	        //start the game loop
	        _.start();
		}
	};
} (this, this.document));


