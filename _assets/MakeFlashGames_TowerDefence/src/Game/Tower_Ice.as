package Game
{
	import flash.display.MovieClip;
	import flash.events.*;
	import flash.geom.*;	
	
	public class Tower_Ice extends MovieClip
	{		
		private var isActive:Boolean;
		private var range,cooldown,damage:Number;
		
		public function Tower_Ice()
		{
			isActive = false;
			range = C.TOWER_ICE_RANGE;
			cooldown = C.TOWER_ICE_COOLDOWN;
			damage = C.TOWER_ICE_DAMAGE;
			this.mouseEnabled = false;
		}
		
		public function setActive()
		{
			isActive = true;
		}
		
		public function update()
		{
			if (isActive)
			{
				var monsters = GameController(root).monsters;
				if (cooldown <= 0)
				{
					for (var j = 0; j < monsters.length; j++)
					{
						var currMonster = monsters[j];
						
						if ((Math.pow((currMonster.x - this.x),2) 
							+ Math.pow((currMonster.y - this.y),2)) < this.range)
						{
							//spawn new bullet
							var bulletRotation = (180/Math.PI)*
										Math.atan2((currMonster.y - this.y), 
												(currMonster.x - this.x));
							var newBullet = new Bullet(currMonster.x,currMonster.y,
										"ice",currMonster,this.damage,bulletRotation);
							newBullet.x = this.x;
							newBullet.y = this.y;
							
							GameController(root).bullets.push(newBullet);
							GameController(root).mcGameStage.addChild(newBullet);
							
							this.cooldown = C.TOWER_ICE_COOLDOWN;
							
							break;
						}
					}
				}
				else
				{
					this.cooldown -= 1;
				}
			}
		}
	}
}