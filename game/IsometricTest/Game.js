
;var Game = (function (window, document, undefined) {
	
	'use strict';
	
	var canvas, ctx,
	
	DOM = {
		game : '#game'
	},
	
	STATE = { 
		_current: 0,
		INTRO: 0,
		LOADING: 1,
		LOADED: 2
	},
	
	_ = {
		
		setup : function () {
			canvas = document.querySelector(DOM.game);
			canvas.width = document.body.clientWidth;
			canvas.height = document.body.clientHeight;
			ctx = canvas.getContext('2d');
			console.info('Context (ctx) created');
		},
		
		handleClick : function () { 
			STATE._current = STATE.LOADING; 
			_.fadeToWhite();
		},
		
		doResize : function () {
			canvas.width = document.body.clientWidth; 
			canvas.height = document.body.clientHeight;
			
			switch (STATE._current) {
				case STATE.INTRO: 
					_.drawWelcomeScreen();
				break; 
			};
		},
		
		fadeToWhite : function (alphaVal) {
			// If the function hasn't received any parameters, start with 0.02
			var alphaVal = (alphaVal == undefined) ? 0.02 : (window.parseFloat(alphaVal) + 0.02);
			// Set the color to white 
			ctx.fillStyle = '#FFFFFF';
			// Set the Global Alpha 
			ctx.globalAlpha = alphaVal;
			// Make a rectangle as big as the canvas 
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			if (alphaVal < 1.0) { 
				window.setTimeout(function() {
					_.fadeToWhite(alphaVal);
				}, 30);
			};
		},
		
		drawWelcomeScreen : function () {
			var phrase 	= "Click or tap the screen to start the game",
				grd 	= ctx.createLinearGradient(0, 0, canvas.width, canvas.height),
				mt 		= ctx.measureText(phrase),
				xcoord 	= (canvas.width / 2) - (mt.width / 2);
			
			grd.addColorStop(0, '#ceefff');
			grd.addColorStop(1, '#52bcff');
			ctx.fillStyle = grd;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			ctx.font = 'bold 16px Arial, sans-serif';
			ctx.fillStyle = '#FFFFFF';
			ctx.fillText (phrase, xcoord, 30);

			console.info('Welcome screen drawn');
		}
		
	};
	
	return {
		
		init : function () {
			console.warn('Initialising.....');
			_.setup();
			_.drawWelcomeScreen();
			console.warn('Initialisation finished');
			
			document.addEventListener('click', _.handleClick, false);
			document.addEventListener('resize', _.doResize, false);
			_.doResize();
		}
	};
	
}(this, this.document));


window.addEventListener('load', Game.init, false);