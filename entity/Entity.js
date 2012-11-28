;/**
 * @author Tom Cool
 * @version 0.1
 * 
 * Object binding events to directional keypress input from a player
 * @class Entity
 * @package ARENA
 * @constructor
 * @this {Entity}
 *
 * @param {Object}  canvas
 * @param {Object}  context
 * @param {Boolean} active
 * @param {Object}  position
 * @param {Object}     dimention
 * @param {String}  spriteSrc
 * @returns {Entity}
 */
function Entity(canvas, context, active, position, dimensions, sprite) {
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
	 * Entity's x and y position
	 * @property position.x
	 * @type object
	 * @private
	 */
	this.position = position || { x : 0, y : 0 };
    /**
	 * Entity's height and width
	 * @property dimensions
	 * @type object
	 * @private
	 */
	this.dimention = dimensions;
	/**
	 * Optional image to display
	 * @property sprite
	 * @type string
	 * @private
	 */
    this.sprite = undefined;
	if (typeof spriteSrc === 'string' && spriteSrc.length > 0) {
		this.sprite = new Sprite(sprite, this.width, this.height, 0, 0);
	};
	
	return this;
};
/**
 * Check if entity is alive
 * @this {Entity}
 * @return {Void}
 * @method isAlive
 */
Entity.prototype.isAlive = function() {
	'use strict';
	return this.active && this.inBounds();
};
/**
 * Check if entity is within canvas boundries
 * @this {Entity}
 * @return {Void}
 * @method inBounds
 */
Entity.prototype.inBounds = function() {
	'use strict';
	return this.position.x >= 0 
		&& this.position.x <= this.canvas.width 
		&& this.position.y >= 0 
		&& this.position.y <= this.canvas.height;
};
/**
 * Draw entity to canvas according to position and sprite
 * @this {Entity}
 * @return {Void}
 * @method draw
 */
Entity.prototype.draw = function() {
	'use strict';
	if (typeof this.sprite !== 'undefined') {
		this.sprite.draw(this.context, this.position.x, this.position.y);
	} else {
		throw new Error('Nothing to draw...');
	};
};
/**
 * Activate
 * @this {Entity}
 * @return {Void}
 * @method activate
 */
Entity.prototype.activate = function() {
	'use strict';
	this.active = true;
};
/**
 * Deactivate
 * @this {Entity}
 * @return {Void}
 * @method deactivate
 */
Entity.prototype.deactivate = function() {
	'use strict';
	this.active = false;
};
/**
 * Deactivate and show optional explosion
 * @this {Entity}
 * @return {Void}
 * @method explode
 */
Entity.prototype.explode = function() {
	'use strict';
	this.deactivate();
};
/**
 * Adds and attaches a component, to this entity
 * @param {Component}  component
 * @this {Entity}
 * @return {Component}
 * @method addComponent
 */
Entity.prototype.addComponent = function(component) {
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
 * @this {Entity}
 * @return {Component}
 * @method addComponentAndExecute
*/
Entity.prototype.addComponentAndExecute = function(component) {
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
 * @this {Entity}
 * @return {Component}
 * @method getComponentWithName
 */
Entity.prototype.getComponentWithName = function(componentName) {
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
 * @this {Entity}
 * @return {Void}
 * @method removeComponentWithName
 */
Entity.prototype.removeComponentWithName = function(componentName) {
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
       var n = removedComponents.length;
       while (n--) {
           removedComponents[i].detach();
       };
   };
};
/**
 * Removes all components contained in this entity
 * @this {Entity}
 * @return {Void}
 * @method removeAllComponents
 */
Entity.prototype.removeAllComponents = function() {
   var n = this.components.length;
   while (n--) {
       this.components[n].detach();
   };
   this.components = [];
};