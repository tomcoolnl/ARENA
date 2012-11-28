/**
 * @author Tom Cool
 * @version 0.1
 * 
 * Color is a Object literal containing only public static methods
 * @author Tom Cool
 * @class Color
 * @package ARENA
 * 
 * @constructor
 * @this {Color}
 */
;Color = {
    /**
     * Convert a RGB color value to a Hexidecimal value
     * @param {Int} r
     * @param {Int} g
     * @param {Int} b
     * @returns {String} The to hexidecimal converted RGB value
     */
    rgbToHex : function(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    /**
     * Convert a Hexidecimal color value to a RGB value
     * @param {String} hex
     * @returns {Object} A object literal containing RGB value || NULL
     */
    hexToRgb : function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
};