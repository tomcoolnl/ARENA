package Game
{
	import flash.display.MovieClip;
	import flash.events.*;
	import flash.geom.*;	
	
	public class Placing extends MovieClip
	{
		public var canPlace:Boolean;
		
		public function Placing()
		{
			canPlace = true;
			this.addEventListener(MouseEvent.CLICK, placeTower);
		}
		
		public function placeTower(evt:MouseEvent)
		{
			this.removeEventListener(MouseEvent.CLICK,placeTower);
			canPlace = false;
			
			GameController(root).placeTowerAt(this.x, this.y);
		}
	}
}