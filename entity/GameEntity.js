;/**
 * @author Tom Cool
 * @version 0.1
 * 
 * Object binding events to directional keypress input from a player
 * @class GameEntity
 * @package ARENA
 * @constructor
 * @this {GameEntity}
 *
 * @param {Object}  canvas
 * @param {Object}  context
 * @param {Boolean} active
 * @param {Int}     posx
 * @param {Int}     posy
 * @param {Int}     width
 * @param {Int}     height
 * @param {STring}  spriteSrc
 * @returns {GameEntity}
 */
function GameEntity(canvas, context, active, posx, posy, width, height, spriteSrc) {
	'use strict';
    /**
	 * Object refering to the Canvas API
	 * @property canvas
	 * @type object
	 * @private
	 */
	this.canvas = canvas;
    /**
	 * Object refering to the Canvas Context
	 * @property context
	 * @type object
	 * @private
	 */
	this.context = context;
    /**
	 * If entity is actively participating the game
	 * @property active
	 * @type boolean
	 * @private
	 */
	this.active = active || true;
    /**
	 * Entity's x position
	 * @property posx
	 * @type int
	 * @private
	 */
	this.posx = posx || 0;
    /**
	 * Entity's y position
	 * @property posy
	 * @type int
	 * @private
	 */
	this.posy = posy || 0;
    /**
	 * Entity's width
	 * @property width
	 * @type int
	 * @private
	 */
	this.width = width;
    /**
	 * Entity's height
	 * @property height
	 * @type int
	 * @private
	 */
	this.height = height;
	/**
	 * Optional image to display
	 * @property sprite
	 * @type int
	 * @private
	 */
    this.sprite = undefined;
	if (typeof spriteSrc === 'string' && spriteSrc.length > 0) {
		this.sprite = new Sprite(spriteSrc, this.width, this.height, 0, 0);
	};
	
	return this;
};
/**
 * Check if entity is alive
 * @this {GameEntity}
 * @return {Void}
 * @method isAlive
 */
GameEntity.prototype.isAlive = function() {
	'use strict';
	return this.active && this.inBounds();
};
/**
 * Check if entity is within canvas boundries
 * @this {GameEntity}
 * @return {Void}
 * @method inBounds
 */
GameEntity.prototype.inBounds = function() {
	'use strict';
	return this.posx >= 0 
		&& this.posx <= this.canvas.width 
		&& this.posy >= 0 
		&& this.posy <= this.canvas.height;
};
/**
 * Draw entity to canvas according to position and sprite
 * @this {GameEntity}
 * @return {Void}
 * @method draw
 */
GameEntity.prototype.draw = function() {
	'use strict';
	if (typeof this.sprite !== 'undefined') {
		this.sprite.draw(this.context, this.posx, this.posy);
	} else {
		throw new Error('Nothing to draw...');
	};
};
/**
 * Activate
 * @this {GameEntity}
 * @return {Void}
 * @method activate
 */
GameEntity.prototype.activate = function() {
	'use strict';
	this.active = true;
};
/**
 * Deactivate
 * @this {GameEntity}
 * @return {Void}
 * @method deactivate
 */
GameEntity.prototype.deactivate = function() {
	'use strict';
	this.active = false;
};
/**
 * Deactivate and show optional explosion
 * @this {GameEntity}
 * @return {Void}
 * @method explode
 */
GameEntity.prototype.explode = function() {
	'use strict';
	this.deactivate();
};
/**
 * Adds and attaches a component, to this entity
 * @param {Component}  component
 * @this {GameEntity}
 * @return {Component}
 * @method addComponent
 */
GameEntity.prototype.addComponent = function(component) {
   // Check if we already have this component, if we do - make sure the component allows stacking
   var existingVersionOfComponent = this.getComponentWithName(component.displayName);
   if (existingVersionOfComponent && !existingVersionOfComponent.canStack) {
       return false;
   };
   // Remove existing version
   if (existingVersionOfComponent) {
       this.removeComponentWithName(component.displayName);
   };
   //cross-attach component with entity
   this.components.push(component);
   component.attach(this);

   return component;
};
/**
* Convenience method that calls addComponent then calls execute on the newly created component
* @param {Component}  component
 * @this {GameEntity}
 * @return {Component}
 * @method addComponentAndExecute
*/
GameEntity.prototype.addComponentAndExecute = function(component) {
   var wasAdded = this.addComponent(component);
   if (wasAdded) {
       component.execute();
       return component;
   };
   return null;
};
/**
 * Returns a component with a matching .displayName property
 * @param componentName
 * @this {GameEntity}
 * @return {Component}
 * @method getComponentWithName
 */
GameEntity.prototype.getComponentWithName = function(componentName) {
   var len = this.components.length;
   var component = null;
   for (var i = 0; i < len; ++i) {
       if (this.components[i].displayName === componentName) {
           component = this.components[i];
           break;
       };
   };
   return component;
};
/**
 * Removes a component with a matching .displayName property
 * @param {String}  componentName
 * @this {GameEntity}
 * @return {Void}
 * @method removeComponentWithName
 */
GameEntity.prototype.removeComponentWithName = function(componentName) {
   var len = this.components.length;
   var removedComponents = [];
   for (var i = 0; i < len; ++i) {
       if (this.components[i].displayName === componentName) {
           removedComponents.push(this.components.splice(i, 1));
           break;
       };
   };
   // Detach removed components
   if (removedComponents) {
       i = removedComponents.length;
       while (i--) {
           removedComponents[i].detach();
       };
   };
};
/**
 * Removes all components contained in this entity
 * @this {GameEntity}
 * @return {Void}
 * @method removeAllComponents
 */
GameEntity.prototype.removeAllComponents = function() {
   var n = this.components.length;
   while (n--) {
       this.components[n].detach();
   };
   this.components = [];
};