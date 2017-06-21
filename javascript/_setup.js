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
    
    
    function _round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};


  function getTheStyle(){
    var elem = document.getElementById("placeholder"),
    tgt = window.getComputedStyle(elem, null),
        f = tgt.getPropertyValue("font-size"),
        w = tgt.getPropertyValue("width");
    document.querySelector("#header h2").innerHTML = _round(parseFloat(f),2) +' / '+_round(parseFloat(w),2);
            
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
        w = byId('content').offsetWidth,
        w = body.offsetWidth,
    
        heading = header('h2')[0],
        tgt = window.getComputedStyle(heading, null),
        f = tgt.getPropertyValue("font-size");
        
        _.each(body.style, function(a, b){
           
        });
        
        for(var o in body.style){
             console.log(o+': '+ body.style[o]);
        }
        
        var nav = byId("content"),
            a = nav.querySelector('a');
        
        tgt = window.getComputedStyle(footer, null),
        f = tgt.getPropertyValue("font-size");
        
    
        heading.innerHTML = _round(parseFloat(w),2) + ' /' + f;
   
        
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