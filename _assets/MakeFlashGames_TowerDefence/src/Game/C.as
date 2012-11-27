/*
-------------------------------------------------------------------------------------------------
All contents (including text, graphics, actionscript code, fla source files and all other original 
works), on MakeFlashGames.com website is licensed under a Creative Commons License.

Copyright: Joseph Tan
Location: Singapore
Website: http://www.makeflashgames.com
Email: admin@makeflashgames.com
Licensing: http://creativecommons.org/licenses/by-nc/2.0/

None of the tutorials/codes/graphics here should be distributed or used for any commercial purposes 
without first seeking prior permission from myself.
Any use of the materials here must carry an acknowledgment of the original author as the sole 
owner to the rights of this document.

Kindly contact admin@makeflashgames.com if you would like to use these materials for commercial
or educational purposes.
-------------------------------------------------------------------------------------------------
*/

package Game
{
	public class C
	{	
		//GENERAL
		public static const GAME_WIDTH:Number = 600;
		public static const GAME_HEIGHT:Number = 500;
		public static const GAME_FPS:Number = 30;
				
		//Game
		public static const PLAYER_START_LIFE:Number = 10;
		public static const START_GOLD:Number = 100;
		public static const MAX_WAVE:Number = 20;
		
		//Towers
		public static const TOWER_FIRE_COST:Number = 60;
		public static const TOWER_ICE_COST:Number = 80;
		public static const TOWER_LIGHTNING_COST:Number = 110;
		
		public static const TOWER_FIRE_HELP:String = "Fire Tower\nCost:"+TOWER_FIRE_COST+"\nThis tower deals high damage to a single target";
		public static const TOWER_ICE_HELP:String = "Ice Tower\nCost:"+TOWER_ICE_COST+"\nThis tower deals low damage, but slows a monster";
		public static const TOWER_LIGHTNING_HELP:String = "Lightning Tower\nCost:"+TOWER_LIGHTNING_COST+"\nThis tower deals splash lightning damage to a group of close enemies";

		public static const TOWER_FIRE_RANGE:Number = 10000;
		public static const TOWER_ICE_RANGE:Number = 10000;
		public static const TOWER_LIGHTNING_RANGE:Number = 10000;
		public static const LIGHTNING_AOE_RANGE:Number = 3500;
		
		public static const TOWER_FIRE_COOLDOWN:Number = 15;
		public static const TOWER_ICE_COOLDOWN:Number = 10;
		public static const TOWER_LIGHTNING_COOLDOWN:Number = 30;
		
		public static const TOWER_FIRE_DAMAGE:Number = 6;
		public static const TOWER_ICE_DAMAGE:Number = 3;
		public static const TOWER_LIGHTNING_DAMAGE:Number = 2;

		public static const TOWER_ICE_SLOW_AMOUNT:Number = 90;
		
		//Monsters
		public static const MONSTER_START_X:Number = -300;
		public static const MONSTER_START_Y:Number = 140;		
		public static const MONSTER_GOLD:Number = 15;
		public static const MONSTER_LIFE:Number = 30;
		public static const MONSTER_SPEED:Number = 2;
		public static const LIFEBAR_MAX_WIDTH:Number = 20;
		
		//Bullets
		public static const BULLET_SPEED:Number = 5;
	}
}