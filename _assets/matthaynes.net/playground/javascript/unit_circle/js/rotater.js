// CIRCULAR MOVEMENT SCRIPT - BY MATT HAYNES, FEBRUARY 2006.
// ---------------------------------------------------------------------------------------------
// SCRIPT USES THE CREATION OF A UNIT CIRCLE AND TRIGONOMIC FUNCTIONS TO POSITION ELEMENTS
// IN A PERFECT(ISH) CIRCLE. ELEMENTS ARE ROTATED BY INCREMENTING THEIR ANGLE FROM POINT (0,0) 
// IN THE UNIT CIRCLE OVER TIME. ROTATION DIRECTION, SPEED AND THE RADIUS OF THE CIRCLE ARE 
// DEPENDANT ON THE MOUSE POSITION.
// ---------------------------------------------------------------------------------------------


// --------------------- GLOBAL VARIABLES 
var radius = 200;     // RADIUS OF CIRCLE IN PIXELS
var deg = 45;         // DEGREES THAT ELEMENTS ARE PLACED APART, CONTROLS AMOUNT OF ELEMENTS, LOWER = MORE
var Xcen = 249.5;     // THE X POSITION OF THE CIRCLE CENTER.
var Ycen = 249.5;     // THE Y POSITION OF THE CIRCLE CENTER.

var CenterLeft = 0;   // CIRCLE CENTER FOR TESTING AGAINST MOUSE POSITION
var CenterTop  = 0;   // CIRCLE CENTER FOR TESTING AGAINST MOUSE POSITION
var rotationDir = 0;  // ROTATION DIRECTION IN DEGREES - CONTROLLED BY MOUSE
var speed = 100;      // SPEED OF ANIMATION LOOP - CONTROLLED BY MOUSE

document.onmousemove=findMousePos; // DO THIS WHEN THE MOUSE MOVES

// ###############################################
// POSITIONS ELEMENTS IN A CIRCLE USING UNIT CIRCLE AND TRIGONOMIC FUNCTIONS
// SEE: http://en.wikipedia.org/wiki/Unit_circle
function moveElements(element, angle) {

    var radian = angle * 3.14159 / 180;   // CONVERTS DEGREES TO RADIANS, DEGREE TIMES PI DIVIDED BY 2
  
    var X = Math.cos(radian);             // FINDS X POSITION IN THE UNIT CIRCLE.
    X = X * radius;

    var Y = Math.sin(radian);             // FINDS Y POSITION IN THE UNIT CIRCLE
    Y = Y * radius;

    element.style.top  = Math.round(Ycen + Y) + "px"; // REPOSITION THE ELEMENT Y POSITION
    element.style.left = Math.round(Xcen + X) + "px"; // REPOSITION THE ELEMENT X POSITION
}

// LOOP A DE LOOP
function loop() {
    setTimeout("rotate()", speed);
}


// ROTATION SCRIPT, LOOPS THROUGH ALL IMAGES IN CIRCLE AND INCREASE THEIR ANGLES
function rotate() {

    var imgs = document.getElementsByTagName('img');

    for (var i= 0; i < imgs.length; i++) {
        if (imgs[i].className == "point") {

            var thisImg = imgs[i];
            
            // IF THE ANGLE GOES OVER 360 RESET IT, STOPS NUMEBR INCREASING FOR EVER.
            if (thisImg.angle > 360){thisImg.angle = rotationDir;} 
            
            // UPDATE THE ANGLE THEN MOVE IMAGE WITH THE moveElements() FUNCTION
            thisImg.angle += rotationDir;
            moveElements(imgs[i], thisImg.angle);
        }
    }
    
    loop(); // GO BACK TO LOOP
}



// ###############################################
function loadup() {

  // FIND CIRCLE CENTER FOR TESTING AGAINST MOUSE POSITION
  CenterLeft = findPosX(document.getElementById("center"));
  CenterTop = findPosY(document.getElementById("center"));

  makeElements();
    
  // START THE LOOP 
  setTimeout("loop()", 1000);  
    
} 

// MAKES ELEMENTS - SET ANGLE FOR POSITIONING
function makeElements() {
    for (var i= 0; i < 360; i+=deg) {  
        mynewImg = document.createElement('img');    
        mynewImg.className = "point";
        mynewImg.angle = i;
        mynewImg.src = "images/dots.gif";
        moveElements(mynewImg, mynewImg.angle);
        document.getElementById('holder').appendChild(mynewImg);  
    }
}

// ###############################################
// MOUSE POSITIONS, FIND X AND Y POSITION AND ALTER VARIABLES BASED ON THEM.
function findMousePos(e) {

    // MOUSE POSITIONS SCRIPT
    // FROM - http://www.quirksmode.org/js/events_properties.html
    var posx = 0;
    var posy = 0;
    
    if (!e) var e = window.event;
    
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft;
        posy = e.clientY + document.body.scrollTop;        
    }

    // SET ROTATION DIRECTION DEPENDANT ON HORIZONTAL MOUSE POSITION
    if (posx < CenterLeft - 10) {
        rotationDir = -3;  // ANTI-CLOCKWISE
    } else if (posx > CenterLeft + 10) {
        rotationDir = 3;   // CLOCKWISE
    } else {
        rotationDir = 0;   // STOP
    }        
    
    // SET SPEED AND RADIUS OF CIRCLE DEPENDING ON VERTICAL MOUSE POSITION
    speed = posy / 10;
    radius = posy / 2;
    
    // LIMIT SIZE OF RADIUS, NOT TOO SMALL NOT TOO BIG
    if (radius < 50) {
        radius = 50;
    } else if (radius > 200) {
        radius = 200;
    }
}

// ###############################################
// FIND POSITION FUNCTIONS
// FROM - http://blog.firetree.net/2005/07/04/javascript-find-position/
// BASED ON - http://www.quirksmode.org/js/findpos.html
 function findPosX(obj)  {
    var curleft = 0;
    if(obj.offsetParent)
        while(1) 
        {
          curleft += obj.offsetLeft;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    else if(obj.x)
        curleft += obj.x;
    return curleft;
  }

  function findPosY(obj)  {
    var curtop = 0;
    if(obj.offsetParent)
        while(1)
        {
          curtop += obj.offsetTop;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    else if(obj.y)
        curtop += obj.y;
    return curtop;
  }
// ###############################################  