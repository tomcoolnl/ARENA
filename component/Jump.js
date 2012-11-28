;
Component.Jump = function JumpComponent() {
    Component.apply(this, arguments);
    return this;
};

Component.Jump.extends(Component);

// Unique string name for this Trait
Component.Jump.prototype.displayName = "JumpComponent";                   

//        Component.Jump.prototype._textureSource                  : "assets/images/game/jumppad.png",
//       Component.Jump.prototype. _restitution                    : 2,
//        _previousMaterial               : null,
//       Component.Jump.prototype. _previousRestitution            : 0,
//
//        /**
//         * @inheritDoc
//         */
//        attach: function(anEntity) {
//            ChuClone.components.JumpPadComponent.superclass.attach.call(this, anEntity);
//
//            var view = anEntity.getView();
//            var body = anEntity.getBody();
//
//            // Swap materials
//            this._previousMaterial = view.materials[0];
//            view.materials[0] = new THREE.MeshLambertMaterial( {
//                color: 0xFFFFFF, shading: THREE.SmoothShading,
//                map : THREE.ImageUtils.loadTexture( this._textureSource )
//            });
//
//            view.materials[0] = new THREE.MeshBasicMaterial( { color: 0x608090, opacity: 0.5, wireframe: true } );
//
//            // Swap restitution
//            this.swapRestitution( body );
//
//
//            // Listen for body change
//            this.intercept(['setBody', 'height']);
//        },
//
//        /**
//         * Sets the restitution level of  the provided body's fixtures to make it a jumppad
//         * @param {Box2D.Dynamics.b2Body} aBody
//         */
//        swapRestitution: function( aBody ) {
//            var node = aBody.GetFixtureList();
//            while(node) {
//                var fixture = node;
//                node = fixture.GetNext();
//
//                this._previousRestitution = fixture.GetRestitution();
//                fixture.SetRestitution( this._restitution );
//            }
//        },
//
//        /**
//         * Set the body
//         * @param {Box2D.Dynamics.b2Body} aBody
//         */
//        setBody: function( aBody ) {
//            this.interceptedProperties.setBody.call(this.attachedEntity, aBody );
//            if(aBody) // Sometimes setBody is called with null
//                this.swapRestitution( aBody )
//        },
//
//        /**
//         * Restore material and restitution
//         */
//        detach: function() {
//            this.attachedEntity.getView().materials[0] = this._previousMaterial;
//
//            var node = this.attachedEntity.getBody().GetFixtureList();
//            while(node) {
//                var fixture = node;
//                node = fixture.GetNext();
//                fixture.SetRestitution(this._previousRestitution);
//            }
//
//            ChuClone.components.JumpPadComponent.superclass.detach.call(this);
//        }
//
//    };
//
//    ChuClone.extend( ChuClone.components.JumpPadComponent, ChuClone.components.BaseComponent );
//})();