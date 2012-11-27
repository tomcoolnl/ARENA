package Game
{
	import flash.display.MovieClip;
	import flash.events.*;
	import flash.geom.*;	
	
	public class Bullet extends MovieClip
	{
		private var speed,damage,targetX,targetY:Number;
		private var targetRef:Monster;
		
		public function Bullet(targetX,targetY,type,targetRef,damage,rotate)
		{
			this.targetX = targetX;
			this.targetY = targetY;
			this.gotoAndStop(type);
			this.targetRef = targetRef;
			this.damage = damage;
			this.rotation = rotate;
			this.speed = C.BULLET_SPEED;
		}
		
		public function update()
		{
			this.x += this.speed * Math.cos(Math.PI * this.rotation/180);
			this.y += this.speed * Math.sin(Math.PI * this.rotation/180);
			
			if (this.hitTestPoint(targetX,targetY))
			{
				//if this is a lightning bullet, 
				//it will damage all nearby monsters
				if (this.currentLabel == "lightning")
				{
					var monsters = GameController(root).monsters;
					for (var i = 0; i < monsters.length; i++)
					{
						var currMonster = monsters[i];
						
						if ((Math.pow((currMonster.x - this.x),2) 
								+ Math.pow((currMonster.y - this.y),2)) 
									< C.LIGHTNING_AOE_RANGE)
						{
							currMonster.takeDamage(this.damage);
						}
					}
				}
				else if (this.currentLabel == "ice")
				{
					//Add Slow Effect to monster
					this.targetRef.slowDown(C.TOWER_ICE_SLOW_AMOUNT);
					this.targetRef.takeDamage(this.damage);
				}
				else
				{
					this.targetRef.takeDamage(this.damage);
				}
				
				this.gotoAndStop("remove");
			}
		}
	}
}