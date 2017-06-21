
    function addEvent(obj, type, fn) {
            
            if(!obj || !type || !fn){
                return;
            }

        if (obj.addEventListener) {
            obj.addEventListener(type, fn, false);
           // EventCache.add(obj, type, fn);
        } else if (obj.attachEvent) {
            obj["e" + type + fn] = fn;
            obj[type + fn] = function() {
                obj["e" + type + fn](window.event);
            };
            obj.attachEvent("on" + type, obj[type + fn]);
           // EventCache.add(obj, type, fn);
        } else {
            obj["on" + type] = obj["e" + type + fn];
        }
    }
    

function  addLoadEvent(func) {
            var oldonload = window.onload;
            if (typeof window.onload !== 'function') {
                window.onload = func;
            }
            else {
                window.onload = function () {
                    oldonload();
                    func();
                }
            }
        }
function shout(){
  var s = document.querySelector('#header h2'),
c = document.querySelector('#carlos'),
  w = s.style;

    s.innerHTML = w;
    
   // s.setAttribute('title', 'shout');   
}



function canvassing(){
    
    
    var ctx = document.createElement('canvas');
    document.querySelector('body').appendChild(ctx);
    
    ctx = ctx.getContext('2d');
var img = new Image;
img.onload = function(){
  // Make the canvas the same size as the image
  var w = ctx.canvas.width  = img.width;
  var h = ctx.canvas.height = img.height;

  // Fill it with (fully-opaque) white
  ctx.fillStyle = '#fff'; ctx.fillRect(0,0,w,h);

  // Draw the image in a special blend mode that forces its opacity on the result
  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(img,0,0);

  // Set an image on the page to use this canvas data
  // The data URI can also be copy/pasted and used inline in HTML or CSS
  document.getElementById('_carlos2').src=ctx.canvas.toDataURL();
}//onload

// Load the image to use _after_ setting the onload handler
img.src = '../assets/alphaball.png';
    img.src = '../images/carlos.png';

    
}

function _round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};



function dumpComputedStyles(elem,prop) {

  var cs = window.getComputedStyle(elem,null);
  if (prop) {
        return;
  }
  var len = cs.length;
  for (var i=0;i<len;i++) {
 
    var style = cs[i];
      console.log(style)
      }

}

 function findHeight(el) {
     return;
        var img = new Image();
        img.src = el.src;
        img.onload = function() {
            height = img.height;
        };
     return img.height;
    }


  function getTheStyle(id){
          

    var elem = document.querySelector('#content p');
      

      
    var hh =  findHeight(elem),
        tgt = document.defaultView.getComputedStyle(elem, null),
        f = tgt.getPropertyValue("font-size"),
        w = tgt.getPropertyValue("width"),
        h = tgt.getPropertyValue("naturalHeight");
      
      
      
    document.querySelector("#header h2").innerHTML = _round(parseFloat(f),2) +' / '+_round(parseFloat(w),2);
      
      window.addEventListener("orientationchange", function() {
getTheStyle();
}, false);
      
   }
//addLoadEvent(getTheStyle);

addEvent(window, "DOMContentLoaded", getTheStyle);
