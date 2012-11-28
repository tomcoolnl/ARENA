
;
function MovingEntity(canvas, context, active, position, dimensions, sprite) {
	'use strict';
    Entity.apply(this, arguments);
};

MovingEntity.extends(Entity);