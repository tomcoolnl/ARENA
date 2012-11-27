package Game
{
	import flash.display.MovieClip;
	import flash.events.*;
	import flash.geom.*;	
	
	public class Tower_Lightning extends MovieClip
	{		
		private var isActive:Boolean;
		private var range,cooldown,damage:Number;
		
		public function Tower_Lightning()
		{
			isActive = false;
			range = C.TOWER_LIGHTNING_RANGE;
			cooldown = C.TOWER_LIGHTNING_COOLDOWN;
			damage = C.TOWER_LIGHTNING_DAMAGE;
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
										"lightning",currMonster,this.damage,bulletRotation);
							newBullet.x = this.x;
							newBullet.y = this.y;
							
							GameController(root).bullets.push(newBullet);
							GameController(root).mcGameStage.addChild(newBullet);
							
							this.cooldown = C.TOWER_LIGHTNING_COOLDOWN;
							
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