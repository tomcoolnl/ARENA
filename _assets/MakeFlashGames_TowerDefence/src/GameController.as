/*
-------------------------------------------------------------------------------------------------
All contents (including text, graphics, actionscript code, fla source files and all other original 
works), on MakeFlashGames.com website is licensed under a Creative Commons License.

Copyright: Joseph Tan
Location: Singapore
Website: http://www.makeflashgames.com
Email: joseph@makeflashgames.com
Licensing: http://creativecommons.org/licenses/by-nc/2.0/

None of the tutorials/codes/graphics here should be distributed or used for any commercial purposes 
without first seeking prior permission from the author.
Any use of the materials here must carry an acknowledgment of the original author as the sole 
owner to the rights of this document.

Kindly contact joseph@makeflashgames.com if you would like to use these materials for commercial
or educational purposes.
-------------------------------------------------------------------------------------------------
*/

package
{
	import flash.display.*;
	import flash.events.*;
	import flash.geom.*;
	import flash.text.*;
	import flash.utils.*;
	import flash.ui.*;
	
	import Game.*;
	
	public class GameController extends MovieClip
	{
		private var currTower;
		private var placings, towers:Array;
		public var monsters, bullets:Array;
		private var life, timer, waveStartTime:Number;
		private var currGold, currWave, maxWave:Number;
		private var hitEscape:Boolean;
		
		public function GameController()
		{
			
		}
		
		public function startMenu()
		{
			btnPlay.addEventListener(MouseEvent.CLICK, gotoGame);
		}
		
		private function gotoGame(evt:MouseEvent)
		{
			btnPlay.removeEventListener(MouseEvent.CLICK, gotoGame);
			gotoAndStop("game");
		}
		
		public function startGameWin()
		{
			btnRestart.addEventListener(MouseEvent.CLICK, gotoMenu);
		}
		
		public function startGameOver()
		{
			btnRestart.addEventListener(MouseEvent.CLICK, gotoMenu);
		}
		
		private function gotoMenu(evt:MouseEvent)
		{
			btnRestart.removeEventListener(MouseEvent.CLICK, gotoMenu);
			gotoAndStop("menu");
		}
		
		public function startGame()
		{
			currGold = C.START_GOLD;
			currWave = 0;
			maxWave = C.MAX_WAVE;
			
			placings = new Array();
			monsters = new Array();
			towers = new Array();
			bullets = new Array();
			
			timer = 0;
			life = C.PLAYER_START_LIFE;
			
			setupGame();
			
			//Initialise the UI event listeners
			mcGameUI.btnBuildFireTower.addEventListener(
					MouseEvent.CLICK, clickTowerFire);
			mcGameUI.btnBuildFireTower.addEventListener(
					MouseEvent.ROLL_OVER, showTowerFireHelp);
			mcGameUI.btnBuildFireTower.addEventListener(
					MouseEvent.ROLL_OUT, clearHelp);
			
			mcGameUI.btnBuildIceTower.addEventListener(
					MouseEvent.CLICK, clickTowerIce);
			mcGameUI.btnBuildIceTower.addEventListener(
					MouseEvent.ROLL_OVER, showTowerIceHelp);
			mcGameUI.btnBuildIceTower.addEventListener(
					MouseEvent.ROLL_OUT, clearHelp);
			
			mcGameUI.btnBuildLightningTower.addEventListener(
					MouseEvent.CLICK, clickTowerLightning);
			mcGameUI.btnBuildLightningTower.addEventListener(
					MouseEvent.ROLL_OVER, showTowerLightningHelp);
			mcGameUI.btnBuildLightningTower.addEventListener(
					MouseEvent.ROLL_OUT, clearHelp);
			
			mcGameUI.mouseEnabled = false;
			
			mcGameStage.addEventListener(Event.ENTER_FRAME,update);
			
			//Handle event when this game is being preloaded
			addEventListener(Event.ADDED_TO_STAGE, gameAddedToStage ); 
			
			//Handle situations when this game is being run directly
			if (stage != null)
			{
				stage.addEventListener(KeyboardEvent.KEY_DOWN,keyDownHandler);
			}
		}
		
		private function gameAddedToStage(evt: Event):void
		{
			stage.addEventListener(KeyboardEvent.KEY_DOWN,keyDownHandler);
		}  
		
		private function keyDownHandler(evt:KeyboardEvent):void
		{			
			if (evt.keyCode == 27) //ESC Key
			{
				hitEscape = true;
			}
		}
		
		private function setupGame()
		{
			//Loop through all items on stage
			for (var i=0; i< mcGameStage.numChildren; i++)
			{
				var currObject = mcGameStage.getChildAt(i);
			
				//Look through the objects to see if it is class Placing
				if (currObject is Placing)
				{
					placings.push(currObject);
					currObject.gotoAndStop("off");
					
					currObject.addEventListener(MouseEvent.ROLL_OVER, 
						turnOnPlacing);
					currObject.addEventListener(MouseEvent.ROLL_OUT, 
						turnOffPlacing);					
				}
			}
		}
		
		private function turnOnPlacing(evt:MouseEvent)
		{
			var currPlacing = evt.currentTarget as Placing;
			if (currPlacing.currentLabel == "possible")
				currPlacing.gotoAndStop("on");
		}
		
		private function turnOffPlacing(evt:MouseEvent)
		{
			var currPlacing = evt.currentTarget as Placing;
			if (currPlacing.currentLabel == "on")
				currPlacing.gotoAndStop("possible");
		}
		
		private function clickTowerFire(evt:MouseEvent)
		{
			//Check if the player has already clicked on a tower
			if (currTower != null)
			{
				mcGameUI.removeChild(currTower);
				currTower = null;
			}
			
			if (currGold >= C.TOWER_FIRE_COST)
			{
				currGold -= C.TOWER_FIRE_COST;
				
				//Create a Fire Tower now, referenced by the variable currTower
				currTower = new Tower_Fire();
				mcGameUI.addChild(currTower);
				
				//Turn on all placings
				for (var i in placings)
				{
					if (placings[i].canPlace)
						placings[i].gotoAndStop("possible");
				}
			}
		}
		
		private function clickTowerIce(evt:MouseEvent)
		{
			//Check if the player has already clicked on a tower
			if (currTower != null)
			{
				mcGameUI.removeChild(currTower);
				currTower = null;
			}
			
			if (currGold >= C.TOWER_ICE_COST)
			{
				currGold -= C.TOWER_ICE_COST;
				
				//Create a Fire Tower now, referenced by the variable currTower
				currTower = new Tower_Ice();
				mcGameUI.addChild(currTower);
				
				//Turn on all placings
				for (var i in placings)
				{
					if (placings[i].canPlace)
						placings[i].gotoAndStop("possible");
				}
			}
		}
		
		private function clickTowerLightning(evt:MouseEvent)
		{
			//Check if the player has already clicked on a tower
			if (currTower != null)
			{
				mcGameUI.removeChild(currTower);
				currTower = null;
			}
			
			if (currGold >= C.TOWER_LIGHTNING_COST)
			{
				currGold -= C.TOWER_LIGHTNING_COST;
				
				//Create a Fire Tower now, referenced by the variable currTower
				currTower = new Tower_Lightning();
				mcGameUI.addChild(currTower);
				
				//Turn on all placings
				for (var i in placings)
				{
					if (placings[i].canPlace)
						placings[i].gotoAndStop("possible");
				}
			}
		}
		
		private function showTowerFireHelp(evt:MouseEvent)
		{
			mcGameUI.txtHelp.text = C.TOWER_FIRE_HELP;			
		}
		
		private function showTowerIceHelp(evt:MouseEvent)
		{
			mcGameUI.txtHelp.text = C.TOWER_ICE_HELP;			
		}
		
		private function showTowerLightningHelp(evt:MouseEvent)
		{
			mcGameUI.txtHelp.text = C.TOWER_LIGHTNING_HELP;			
		}
		
		private function clearHelp(evt:MouseEvent)
		{
			mcGameUI.txtHelp.text = "";
		}
		
		public function update(evt:Event)
		{
			//******************			
			//Handle User Input
			//******************
			if (hitEscape)
			{
				if (currTower)
				{
					//cancel build
					if (currTower is Tower_Fire)
					{
						//refund gold
						currGold += C.TOWER_FIRE_COST;
					}
					else if (currTower is Tower_Ice)
					{
						//refund gold
						currGold += C.TOWER_ICE_COST;
					}
					else if (currTower is Tower_Lightning)
					{
						//refund gold
						currGold += C.TOWER_LIGHTNING_COST;
					}
					mcGameUI.removeChild(currTower);
					currTower = null;
			
					for (var i in placings)
					{
						placings[i].gotoAndStop("off");
					}
				}
			}
			hitEscape = false;
			
			if (currTower != null)
			{
				currTower.x = mouseX;
				currTower.y = mouseY;
			}
			
			//******************
			//Handle Game Logic
			//******************
			//Update the mobs
			if ((currWave < maxWave) && (monsters.length == 0))
			{
				currWave++;
				
				//spawn the monsters
				spawnWave(currWave);
			}
			
			for (var i=monsters.length - 1; i >= 0; i--)
			{
				if (monsters[i].currLife > 0)
				{
					monsters[i].update();
				}
				
				//Check if monster reaches the end of their path
				if (monsters[i].hasReachedDestination())
				{
					monsters[i].gotoAndStop("remove");
					life -= 1;
				}
				
				if (monsters[i].currentLabel == "remove")
				{
					mcGameStage.removeChild(monsters[i]);
					monsters.splice(i,1);
					
					//Award Gold
					currGold += C.MONSTER_GOLD;
				}
			}
			
			//Update all the towers
			for (var i in towers)
			{
				towers[i].update();
			}
			
			//Update all the bullets
			for (var i=bullets.length - 1; i >= 0; i--)
			{				
				bullets[i].update();
				
				if (bullets[i].currentLabel == "remove")
				{
					mcGameStage.removeChild(bullets[i]);
					bullets.splice(i,1);
				}
			}
			
			//Check for end game
			if (life <= 0)
			{
				gameOver();
				
				//stop all subsequent code in this update to run
				return;
			}
			else if ((currWave == maxWave) && (monsters.length == 0))
			{
				gameWin();
			}
			
			//******************
			//Handle Display
			//******************			
			//Display new Score
			mcGameUI.txtLife.text = String(life);
			mcGameUI.txtGold.text = String(currGold);
			mcGameUI.txtWave.text = String(currWave) + " / " + String(maxWave);
		}
		
		private function gameOver()
		{
			mcGameStage.removeEventListener(Event.ENTER_FRAME,update);
			stage.removeEventListener(KeyboardEvent.KEY_DOWN,keyDownHandler);
			
			for (var i in placings)
			{
				placings[i].removeEventListener(MouseEvent.ROLL_OVER, turnOnPlacing);
				placings[i].removeEventListener(MouseEvent.ROLL_OUT, turnOffPlacing);
			}
			
			gotoAndStop("gameOver");
		}
		
		private function gameWin()
		{
			mcGameStage.removeEventListener(Event.ENTER_FRAME,update);
			stage.removeEventListener(KeyboardEvent.KEY_DOWN,keyDownHandler);
			
			for (var i in placings)
			{
				placings[i].removeEventListener(MouseEvent.ROLL_OVER, turnOnPlacing);
				placings[i].removeEventListener(MouseEvent.ROLL_OUT, turnOffPlacing);
			}
			
			gotoAndStop("gameWin");
		}
		
		//public functions for children to invoke
		public function placeTowerAt(xPos,yPos)
		{
			currTower.x = xPos;
			currTower.y = yPos;
			mcGameStage.addChild(currTower);
			towers.push(currTower);
			currTower.setActive();
			
			currTower = null;			
			for (var i in placings)
			{
				placings[i].gotoAndStop("off");
			}
		}
		
		//Spawning of monsters
		private function spawnMonster(xPos, yPos)
		{
			var monsterToSpawn = new Monster();
			monsterToSpawn.x = xPos;
			monsterToSpawn.y = yPos;
			monsters.push(monsterToSpawn);
			mcGameStage.addChild(monsterToSpawn);
		}
		
		private function spawnWave(currWave)
		{
			if (currWave == 1)
			{
				spawnMonster(C.MONSTER_START_X, C.MONSTER_START_Y);
			}
			else if (currWave == 2)
			{
				for (var i = 0; i < 2; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
			else if (currWave == 3)
			{
				for (var i = 0; i < 4; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
			else if (currWave == 4)
			{
				for (var i = 0; i < 7; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
			else if (currWave == 5)
			{
				for (var i = 0; i < 9; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
			else if (currWave == 6)
			{
				for (var i = 0; i < 11; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
			else if (currWave == 7)
			{
				for (var i = 0; i < 14; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
			else if (currWave == 8)
			{
				for (var i = 0; i < 17; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
			else if (currWave == 9)
			{
				for (var i = 0; i < 20; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
			else if (currWave == 10)
			{
				for (var i = 0; i < 25; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
			else if (currWave == 11)
			{
				for (var i = 0; i < 30; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
			else if (currWave == 12)
			{
				for (var i = 0; i < 32; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
			else if (currWave == 13)
			{
				for (var i = 0; i < 35; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
			else if (currWave == 14)
			{
				for (var i = 0; i < 39; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
			else if (currWave == 15)
			{
				for (var i = 0; i < 50; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
			else if (currWave == 16)
			{
				for (var i = 0; i < 55; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
			else if (currWave == 17)
			{
				for (var i = 0; i < 61; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
			else if (currWave == 18)
			{
				for (var i = 0; i < 67; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
			else if (currWave == 19)
			{
				for (var i = 0; i < 75; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
			else if (currWave == 20)
			{
				for (var i = 0; i < 85; i++)
				{
					spawnMonster(C.MONSTER_START_X - 40*i, C.MONSTER_START_Y);
				}
			}
		}
	}	
}