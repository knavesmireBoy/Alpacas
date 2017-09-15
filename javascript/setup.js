/*nomen: true*/
if (!window.gAlp) {
    window.gAlp = {};
}

/*
for(var p in gAlp){
    alert(p);
}
*/
window.gAlp.bindEvents = (function(doc, core, config, presenter, gallery, slideshow, publisher){
    "use strict";
    var a = document.createElement('a'),
        s = a.style;
   s.cssText = "margin: 5px 9px 4px 8px";
 
     
        var rule = "body{background-color:red; font-size:26px;}",
            pattern = /^[^\{]+\s+\{([^\}]+)}\s*/,
        
            style = doc.createElement('style');
    style.type = 'text/css';
    style.id = 'bongo';
    
    style.appendChild(document.createTextNode(rule));
    
      doc.body.appendChild(style); 
    

    
    

  
    
 function isNthChildSupported(){
     
   /*  https://stackoverflow.com/questions/21064101/understanding-offsetwidth-clientwidth-scrollwidth-and-height-respectively */
        function setAttr(context, key, value){
         context['setAttribute'](key, value);
     }
     
     function Parental(el){
         this.el = el;
     }
         
    Parental.prototype = {
        constructor: Parental,
        create: function(el){
            this.el.appendChild(el);
        },
        destroy: function(el){
           this.el.removeChild(el); 
        }
    };     
             
    var result = false,
    doc = document,
    test =  document.createElement('ul'),
    style = document.createElement('style'),
    $ = function(id){
        return doc.getElementById(id);
    },
    $$ = function(tag, container, index){
        var doc = container || document,
            res = doc.getElementsByTagName(tag);
        if(typeof index !== 'undefined'){
            return res[0];
        }
        return res;
    },
    getMethod = function(el, m){
        var methods = ['innerText','textContent','innerHTML'], L = methods.length;
        

            while(L--){
                if(typeof el[methods[L]] !== 'undefined'){
                    return methods[L];
                }
            }
                 return null;
    },
        
        elContent = function(el, content){
         var method = getMethod(el);
         if(!method){ return; }
         if(!content){
        return el[method];
         }
         else {
             el[method] = content;
         }
     },
    
    head = new Parental(doc.head),
    body = new Parental(doc.body),
    tester = new Parental(test);

     setAttr(test, 'id', 'nth-child-test');
     setAttr(style, 'type', 'text/css');
     setAttr(style, 'rel', 'stylesheet');
     setAttr(style, 'id', 'nth-child-test-style');
     elContent(style, "#nth-child-test li:nth-child(1){ height:10px; }" );
     
  
for(var i=0; i<3; i++){
    tester.create(doc.createElement('li'));   
}
     body.create(test);
     head.create(style);  

  if($$('li', test, 1).offsetHeight == 10) { result = true; }
     //body.destroy(test);
    // head.destroy(style);
    return result;
 }
    
    /*
    https://stackoverflow.com/questions/7630408/how-to-test-for-nth-child-using-modernizr
    function isNthChildSupported(){
var result = false,
    test =  document.createElement('ul'),
    style = document.createElement('style');
test.setAttribute('id', 'nth-child-test');
style.setAttribute('type', 'text/css');
style.setAttribute('rel', 'stylesheet');
style.setAttribute('id', 'nth-child-test-style');
style.innerHTML = "#nth-child-test li:nth-child(even){height:10px;}";
for(var i=0; i<3; i++){
    test.appendChild(document.createElement('li'));   
}
document.body.appendChild(test);
document.head.appendChild(style);
  if(document.getElementById('nth-child-test').getElementsByTagName('li')[1].offsetHeight == 10) {result = true;}
document.body.removeChild(document.getElementById('nth-child-test'));
document.head.removeChild(document.getElementById('nth-child-test-style'));
  return result;
}
*/

    
    function _round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
    }


  function getTheStyle(){
    var elem = document.getElementById("placeholder"),
    tgt = window.getComputedStyle(elem, null),
        f = tgt.getPropertyValue("font-size"),
        w = tgt.getPropertyValue("width"),
        h = document.getElementById("header").getElementsByTagName('h2')[0];
      h.innerHTML = _round(parseFloat(f),2) +' / '+_round(parseFloat(w),2);
            
window.addEventListener("orientationchange", function() { getTheStyle(); }, false);
      
  }
    
     var  byId = 'getElementById',
          byTags = 'getElementsByTagName',
          byClass = 'getElementsByClassName',
         
         Thumbs = {
       
                flag: false,    
                      
                  init: function(el){
                        this.el = el;
                     if(!this.flag){
                        core.addEvent(this.el, 'click', this.handler.bind(this));
                        this.flag = true;
                      }
                  },
       
                handler: function(e){
                e.preventDefault();
                var node = e.target;
                    
            if(core.checkNodeName(node)("IMG")){
                this.fire('présenter', node, conf.tags);
                }
                }
                },
         
         conf = {
            tags: {
                tag: 'img',
                attrs: {
                    alt: "",
                    src: "../images/0.jpg",
                    "class": "slides",
                    id: "swap"
                }
            }
        };
                
                if (!config.getId) {
                    if(!doc[byId]){
                        return;
                    }
                    config.getId = config.getFeature(byId);
                }
                if (!config.getTags) {
                     if(!doc[byTags]){
                        return;
                    }
                    config.getTags = config.getFeature(byTags);
                }
                
                if (!config.getClass) {
                    config.getClass = config.getFeature(byClass);
                     if(!doc[byClass]){
                        return;
                    }
                    config.getClass = config.getFeature(byClass);
                };
    
    
    return function(){
        
   
        
        
      /*  <script src="../javascript/modernizr-opacity.js">
</script>*/

        
        
                
    var thumbs = config.getContents('thumbnails'),
        list = config.getFeature(config.getFeatures('tags'), thumbs),
        options = {rev:false, loop: true},
        //list = config.getTags(thumbs),
        byId = config.getFeature(config.getFeatures('id')),
        header = config.getFeature(config.getFeatures('tags'), byId('header')),
        footer = config.getFeature(config.getFeatures('tags'), byId('footer')),
        footer = footer('ul')[0],
        body = config.getFeature(config.getFeatures('tags')),
         body = body('body')[0],
       w = byId('wrap').offsetWidth,

    
        heading = header('h2')[0],
        tgt = window.getComputedStyle(heading, null),
        f = tgt.getPropertyValue("font-size");
        
        _.each(body.style, function(a, b){
           
        });
        /*
        for(var o in body.style){
             console.log(o+': '+ body.style[o]);
        }*/
        
        var nav = byId("content"),
            a = nav.getElementsByTagName('a')[0];
        
        tgt = window.getComputedStyle(sidebar, null),
        f = tgt.getPropertyValue("font-size");
        
    
        heading.innerHTML = _round(parseFloat(w),2) + ' /' + _round(parseFloat(f),2);
        

        
           
        
    core.augment(gallery, gAlp.Iterator(list('img'), options));
    core.augment(slideshow, gallery);
    
    core.publish.call(publisher, presenter);
    core.publish.call(publisher, gallery);
    core.publish.call(publisher, slideshow);
    core.publish.call(publisher, Thumbs);
       
    presenter.on('présenter', 'show', presenter);
    presenter.on('diaporama', 'addView', presenter);
    presenter.on('nouvelle', 'setBase', presenter);
    presenter.on('diapositive', 'setSlide', presenter);
    presenter.on('opacité', 'fadeView', presenter);
    presenter.on('exit', 'exit', slideshow);
    presenter.on('fin', 'init', gallery);
    presenter.on('clair', 'clearView', presenter); 

    gallery.on('présenter', 'init', gallery);
        
    core.removeClass(body, 'no-js');
   
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

//gAlp.Core.addEvent(window, 'load', window.gAlp.bindEvents);
gAlp.Core.addEvent(window, 'DOMContentLoaded', window.gAlp.bindEvents);


//}(document, gAlp.Core, gAlp.Config, gAlp.Presenter, gAlp.Gallery, gAlp.SlideShow, gAlp.Publish)); //onload