/**
 * ObjectName is a Modular Singleton, providing mostly public and static methods
 * @author Tom Cool @ FrenzyMedia B.V. - http://frenzymedia.eu
 * @class Component
 * @package ARENA
 * 
 * @constructor
 */
;function Component() {
    this.interceptedProperties = {};
    return this;
};

Component.prototype = {
    /**
     * Array of properties intercepted, this is used when detaching the component
     * @type {Array}
     */
    interceptedProperties : null,
    /**
     * @type {GameEntity}
     */
    attachedEntity : null,
    /**
     * @type {Number}
     */
    detachTimeout : 0,
    /**
     * Unique name for this component
     * @type {String}
     */
    displayName : "BaseComponent",

    /**
     * If a component can stack, then it doesn't matter if it's already attached.
     * If it cannot stack, it is not applied if it's currently active.
     * For example, you can not be frozen after being frozen.
     * However you can be sped up multiple times.
     * @type {Boolean}
     */
    canStack : false,

    /**
     * Attach the component to the host object
     * @param {GameEntity} anEntity
     */
    attach: function(anEntity) {
        this.attachedEntity = anEntity;
    },

    /**
     * Execute the component
     * For example if you needed to cause an animation to start when a character is 'unfrozen', this is when you would do it
     */
    execute: function() {

    },

    /**
     * Detaches a component from an 'attachedEntity' and restores the properties
     */
    detach: function() {
        window.clearTimeout(this.detachTimeout);
        this.restore();

        this.interceptedProperties = null;
        this.attachedEntity = null;
    },

    /**
     * Detach after N milliseconds, for example freeze component might call this to unfreeze
     * @param {Number} aDelay
     */
    detachAfterDelay: function(aDelay) {
        var self = this;
        this.detachTimeout = window.setTimeout(function() {
            self.attachedEntity.removeComponentWithName(self.displayName);
        }, aDelay);
    },

    /**
     * Intercept properties from the entity we are attached to.
     * For example, if we intercept handleInput, then our own 'handleInput' function gets called.
     * We can reset all the properties by calling, this.restore();
     * @param {Array} arrayOfProperties
     */
    intercept: function(arrayOfProperties) {
        var len = arrayOfProperties.length;
        var that = this;
        while (len--) {
            var aKey = arrayOfProperties[len];
            this.interceptedProperties[aKey] = this.attachedEntity[aKey];

            // Wrap function calls in closure so that the 'this' object refers to the component, if not just overwrite
            if (this.attachedEntity[aKey] instanceof Function) {
                this.attachedEntity[aKey] = function() {
                    that[aKey].apply(that, arguments);
                };
            } else {
                this.attachedEntity[aKey] = this[aKey];
            };
        };
    },

    /**
     * Restores poperties that were intercepted.
     * Be sure to call this when removing the component!
     */
    restore: function() {
        for (var key in this.interceptedProperties) {
            if (this.interceptedProperties.hasOwnProperty(key)) {
                this.attachedEntity[key] = this.interceptedProperties[key];
            };
        };
    }
};