;

if(!window.requestAnimationFrame) {
	window.requestAnimationFrame = (
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame ||
		function(callback) {
			return window.setTimeout(callback, 1000 / 60);
		}
	);
};

var Animation = function (id, context, fullscreen, debug) {
	
	context = context || '2d';
	fullscreen = fullscreen || false;
	
	this.canvas 		= document.querySelector(id);
	this.context 		= this.canvas.getContext(context);
	this.time	 		= 0;
	this.timeInterval 	= 0;
	this.startTime 		= 0;
	this.lastTime 		= 0;
	this.frame 			= 0;
	this.animating 		= false;
	this.fps 			= 0;
	this.debug			= debug;
	
	if (fullscreen) {
		this.canvas.width 	= document.documentElement.clientWidth;
		this.canvas.height 	= document.documentElement.clientHeight;
		document.body.style.overflow = 'hidden';
	};
};

Animation.prototype.getContext = function () {
	return this.context;
};

Animation.prototype.getCanvas = function () {
	return this.canvas;
};

Animation.prototype.clear = function () {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};
/**
 * This function will execute for each animation frame
 */
Animation.prototype.setStage = function (func) {
	this.stage = func;
};

Animation.prototype.isAnimating = function () {
	return this.animating;
};

Animation.prototype.getFrame = function () {
	return this.frame;
};

Animation.prototype.start = function () {
	console.info('Animation started!');
	this.animating = true;
	this.startTime = new Date().getTime();
	this.lastTime = this.startTime;
	if (this.stage !== undefined) {
		this.stage();
	};
	this.animationLoop();
};

Animation.prototype.stop = function () {
	console.info('Animation stopped!');
	this.animating = false;
};

Animation.prototype.getTimeInterval = function () {
	return this.timeInterval;
};

Animation.prototype.getTime = function () {
	return this.time;
};

Animation.prototype.animationLoop = function () {
	var that = this, 
		thisTime = new Date().getTime();
	this.timeInterval = thisTime - this.lastTime;
	this.time += this.timeInterval;
	this.frame += 1;
	this.lastTime = thisTime;
	if (this.stage !== undefined) {
		this.stage();
	};
	if (this.animating) {
		window.requestAnimationFrame( function () {
			that.animationLoop();
		});
		if (this.debug) this.drawFps();
	};
};

//to base class
Animation.prototype.setRandomInterval = function (from, to) {
	return window.parseInt((Math.random() * ((to - from) + 1) + (from - 1)).toFixed(3) * 1000);
},

Animation.prototype.getFps = function () {
	return this.timeInterval > 0 ? (1000 / this.timeInterval) : 0;
};

Animation.prototype.drawFps = function () {
	if (this.getFrame() % 10 === 0) {
		this.fps = this.getFps();
	};
	this.context.fillStyle = '#222';
	this.context.fillRect(this.canvas.width - 100, 0, 100, 30);
	this.context.font = '15px Arial';
	this.context.fillStyle = '#fff';
	this.context.fillText('fps: ' + this.fps.toFixed(1), this.canvas.width - 93, 22);
}

