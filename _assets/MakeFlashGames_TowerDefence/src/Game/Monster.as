package Game
{
	import flash.display.MovieClip;
	import flash.events.*;
	import flash.geom.*;	
	
	public class Monster extends MovieClip
	{		
		public var currLife:Number;
		private var maxLife, gold, speed, currIndex, slowTimer:Number;
		private var checkPoints:Array;
		
		public function Monster()
		{
			maxLife = C.MONSTER_LIFE;
			currLife = maxLife;
			speed = C.MONSTER_SPEED;
			
			currIndex = 0;
			
			checkPoints = new Array();
			checkPoints.push(new Point(85,140));
			checkPoints.push(new Point(85,320));
			checkPoints.push(new Point(325,320));
			checkPoints.push(new Point(325,200));
			checkPoints.push(new Point(265,200));
			checkPoints.push(new Point(265,80));
			checkPoints.push(new Point(505,80));
			checkPoints.push(new Point(505,380));
			checkPoints.push(new Point(630,380));
		}
		
		public function update()
		{
			var finalSpeed:Number;
			
			if (slowTimer > 0)
			{
				finalSpeed = speed / 2;
				slowTimer--;
			}
			else
				finalSpeed = speed;
				
			if (currIndex < checkPoints.length)
			{
				//move in the direction of the checkpoint
				if (this.x < checkPoints[currIndex].x)
					this.x += Math.min(finalSpeed, Math.abs(this.x - 
												checkPoints[currIndex].x));
				else if (this.x > checkPoints[currIndex].x)
					this.x -= Math.min(finalSpeed, Math.abs(this.x - 
												checkPoints[currIndex].x));
					
				if (this.y < checkPoints[currIndex].y)
					this.y += Math.min(finalSpeed, Math.abs(this.y - 
												checkPoints[currIndex].y));
				else if (this.y > checkPoints[currIndex].y)
					this.y -= Math.min(finalSpeed, Math.abs(this.y - 
												checkPoints[currIndex].y));
				
				if ((this.x == checkPoints[currIndex].x) &&
					(this.y == checkPoints[currIndex].y))
				{
					currIndex += 1;
				}
			}
			
			//display
			if (currLife > 0)
				mcLifeBar.width = Math.floor((currLife/maxLife)*
													C.LIFEBAR_MAX_WIDTH);
			else
				mcLifeBar.width = 0;
		}
		
		public function takeDamage(amtDamage)
		{
			if (this.currLife <= 0)
				return;
				
			this.currLife -= amtDamage;
			
			if (this.currLife <= 0)
			{
				this.gotoAndPlay("death");
			}
		}
		
		public function slowDown(amt)
		{
			slowTimer = amt;
		}
		
		public function hasReachedDestination()
		{
			return (this.currIndex == checkPoints.length);
		}
	}
}