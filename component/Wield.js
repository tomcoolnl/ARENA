/**
 * ObjectName is a Modular Singleton, providing mostly public and static methods
 * @author Tom Cool @ FrenzyMedia B.V. - http://frenzymedia.eu
 * @class ObjectName object
 * @package Object Package
 * 
 * @param {window}      window      BOM
 * @param {document}    document    DOM
 * 
 * @constructor
 */
;ObjectName = (function(window, document, undefined) {
    'use strict';
    
    var self,
    
    DOM = {
        
    },
    
    _ = {
        
    };
    
    return {
      init : function() {
          self = this;
      }  
    };
    
} (this, this.document));