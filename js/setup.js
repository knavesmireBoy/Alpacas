/*nomen: true*/
if (!window.gAlp) {
    window.gAlp = {};
}

window.gAlp.bindEvents = (function(doc, core, config, presenter, gallery, slideshow, publisher){
 "use strict";
 
 
    function _round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
}


  function getTheStyle(elem){
    var tgt = window.getComputedStyle(elem, null),
        f = tgt.getPropertyValue("font-size"),
        w = tgt.getPropertyValue("width");
        
        function querySelector(){
        var el = document.querySelector("#header h2");
        el.innerHTML = _round(parseFloat(f),2) +' / '+_round(parseFloat(w),2);
        }
        querySelector();
            
window.addEventListener("orientationchange", function() { getTheStyle(); }, false);
   }
   
      
function supportsSvg() {
  return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
}

function highLightCurrentPage(){
function getContent(arg){
if(typeof arg !== 'string'){
arg = arg.textContent || arg.innerText;
}
if(!arg) { return false; }

if(arg.indexOf('_') !== -1){
return arg.replace('_', '').toLowerCase();
}

return arg.replace(/\s/g, '').toLowerCase();
}


var id = config.getTags('body')[0].getAttribute('id'),
ul = config.getId('sidebar'),
links = config.getFeature(byTags, ul)('a'),
L = links.length;

while(L--){
if(getContent(links[L]) === getContent(id)){ break;}
}
core.addClass(links[L], 'current');
}

function hasFeature(str){
var html = document.documentElement || document.getElementsByTagName('html')[0];
return core.hasClass(html, str);
}

var  root = document.documentElement,
     	  byId = config.getFeatures('id'),
          byTags = config.getFeatures('tags'),
          byClass = config.getFeatures('class'),
          svg = supportsSvg(),
          nativeClass = true,
          selectAll = true,
          wildCard = true,
          
             
         conf = {
            tags: {
                tag: 'img',
                attrs: {
                    alt: "",
                    src: "../images/upkeep.jpg",
                    'class': "slides",
                    id: "swap"
                }
            }
        };

                if (!config.getId) {
                    if(!doc[byId]){
                        return;
                    }
                    //config.getId(string) === document.getElementsById(string);
                    config.getId = config.getFeature(byId);
                }
                if (!config.getTags) {
                     if(!doc[byTags]){
                        return;
                    }
                    /*config.getFeature(byTags) is best called with two further arguments
                    an element to narrow the search and an optional integer to retrieve a single node from the nodeList*/
                    config.getTags = config.getFeature(byTags);
                   // wildCard = config.getTags('*').length;
                   // selectAll = document.all && document.all.length;
                }
                
                if (!config.getClass) {
                     if(!doc[byClass]){
                     doc[byClass] = core.getElementsByClassName;
                     nativeClass = false;
                    }
                    //config.getFeature(byClass) as above config.getFeature(byTags)
                    /*if !nativeClass  AND '*" is not supported
                    config.getClass REQUIRES a second argument to narrow the search by nodeName
                    a third argument specifies a node, defaults to document*/
                    config.getClass = config.getFeature(byClass);
                }
               /*
                if(!svg){
                var getImg = config.getFeature(byTags, config.getId('yag'), 0),
                yag = getImg('img'),
                logo = config.getId('ga_logo');
                logo.setAttribute('src', "../assets/logo_new_opt.svg");
               	yag.setAttribute('src', "../assets/yag.svg");
                }
                */
    			core.removeClass(root, 'no-js');
     			core.addClass(root, 'js');
                
                //"../assets/yag.svg"
                
               
     ////return function//// ////return function//// ////return function//// ////return function//// ////return function////           
    return function(){
        
   var el = config.getClass('wild', 'div')[0],
    getbyTag = config.getFeature(byTags, el, 0);
        
    if(!hasFeature('nthchild')){
    	highLightCurrentPage();
    }
   
   if(gAlp.masking){
      gAlp.masking.mask(getbyTag('img'));
      }

      var  Thumbs = {
       
                flag: false,    
                      
                  init: function(el){
                        this.el = el;
                     if(!this.flag){
                        core.addEvent(this.el, 'click', this.handler.bind(this));
                        this.flag = true;
                      }
                  },
                  
                handler: function(e){
                core.prevent(e);
               e = core.getEventObject(e);
                var node = core.getEventTarget(e);
                try{
            if(core.checkNodeName(node)("IMG")){
               this.fire('presenter', node, conf.tags);
                }
                }
                catch(er){
               // alert(er+'!!!');
                }
              
                
                }//fn

                
                },//obj
     thumbs = config.getContents('thumbnails'),
    list = config.getFeature(byTags, thumbs);
    
    slideshow = gAlp.SlideShow;
    
 if(!Function.call || !slideshow){ return; }
     
  	core.augment(gallery, gAlp.Iterator(list('img'), {rev: false, loop: true}));
  	
    core.publish.call(publisher, presenter);
    core.publish.call(publisher, gallery);
    core.publish.call(publisher, slideshow);
    core.publish.call(publisher, Thumbs);


    presenter.on('presenter', 'show', presenter);
    presenter.on('diaporama', 'addView', presenter);
    presenter.on('nouvelle', 'setBase', presenter);

 presenter.on('diapositive', 'setSlide', presenter);
   presenter.on('opacity', 'fadeView', presenter);
    presenter.on('exit', 'exit', slideshow);
    presenter.on('fin', 'init', gallery);
    presenter.on('clair', 'clearView', presenter);
    gallery.on('presenter', 'init', gallery);
	
    Thumbs.init(thumbs);

    /*    window.onresize = function(){
            var w = window.innerWidth, t = document.getElementById('placeholder');
    if(w <= 560){
            t.style.display = 'none';
        }
            else {
               t.style.display = 'block'; 
            }
};*/

    };
    
})(document, gAlp.Core, gAlp.Config, gAlp.Presenter, gAlp.Gallery, gAlp.SlideShow, gAlp.Publish);
function god(){
//gAlp.SlideShow is a function at this stage, only required for gallery page, so stub it
gAlp.SlideShow = gAlp.SlideShow || function(){ return null; };
setTimeout(function(){ gAlp.timeout = true; }, 0);
setTimeout("goDom()", 10);
}
function goDom(){
if(gAlp.timeout){
gAlp.SlideShow(gAlp.Core, gAlp.tagBuilder, gAlp.Gallery);
gAlp.bindEvents();
}
else {
gAlp.Core.sortTimeOut(15,
function(){ gAlp.SlideShow(gAlp.Core, gAlp.tagBuilder, gAlp.Gallery, true);}, gAlp.bindEvents)
}
}
gAlp.Core.addEvent(window, 'load', god);
//gAlp.Core.addEvent(window, 'DOMContentLoaded', window.gAlp.bindEvents);
