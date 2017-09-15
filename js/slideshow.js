
if (!window.gAlp) {
    window.gAlp = {};
}

window.gAlp.SlideShow = function(core, tagBuilder, gallery, FLAG) {
    "use strict";
    
    
      //original KEEP!!!
       function showByFunction() {
            //recursion...
            var that = this;
            xOpacity -= nRate;
            this.setOpacity(); //sets ACTUAL opacity will call until..
            if (xOpacity <= 0) {
                //moves bottom pic to top WHILE TOP PIC IS 0% OPACITY, then sets new bottom pic while top is 100% opacity
                this.swap().setOpacity(1).setNext();
                this.timer = setTimeout(function() {
                    that.show();
                }, nDelay);
            } else {
                this.timer = setTimeout(function() {
                    that.show();
                }, nPause);
            }
        }
        
         //older browsers
         function showByString() {
            var that = this;
            //note GLOBAL function
            showtime = showtime || function(){
            that.show();
            }
            xOpacity -= nRate;
            this.setOpacity(); 
            if (xOpacity <= 0) {
                this.swap().setOpacity(1).setNext();
                this.timer = setTimeout("showtime()", nDelay);
            } else {
                this.timer = setTimeout("showtime()", nPause);
            }
        }
        
                 
        
   function INIT(){
    var augmenter = FLAG ? sub : main;
   gAlp.SlideShow = core.create(gAlp.Gallery);
   //gAlp.SlideShow = core.extend(gAlp.Gallery);
    core.augment(gAlp.SlideShow, uber, true);
    core.augment(gAlp.SlideShow, augmenter);
    }
    
    var xOpacity = 1,
        nDelay = 2000,
        nPause = 100,
        nRate = 0.07,
        paused = 'paused',
        timer = null,
        _height = null,
        height = null,
        uber = {},
        main = {
        show: showByFunction
        },
        sub = {
        show: showByString
        },
       
        conf = {
            tags: [{
            
            
            tag: 'img_0',
                attrs: {
                    alt: "",
                    src: "../images/0.jpg",
                    "class": "slides",
		id: "swap"
                }
            },
                   {
                    tag: 'img_1',
                    attrs: {
                        alt: '',
                        id: 'slidepic',
                        src: "",
                        "class": 'slides',
                        height: "500px"
                    }
                },
                {
                    tag: 'img_2',
                    attrs: {
                        alt: '',
                        id: 'overlay',
                        src: '../assets/pause_.png',
                        "class": 'slides'
                    }
                },
                   
                    {
                    tag: 'img_2',
                    attrs: {
                        alt: '',
                        id: 'overlay',
                        src: '../assets/pause_long.png',
                        "class": 'slides'
                    }
                }
            ]
        },
        
       reversed = false,
        
    isPortrait = function(node){
    //return core.hasClass(core.getMyTarget(node, 'li', 'parentNode'), 'portrait');
        return node.clientHeight > node.clientWidth;
    },
    
    getPortrait = function(node){
    return isPortrait(node);
    },
    
     getLandscape = function(node){
    return !isPortrait(node);
    },
        

    uber = {

        init: function() {
            this.hasNext();
            var el = this.getLast();
               var cb = isPortrait(el) ? getPortrait : getLandscape;
         		this.filter(cb);
        		this.find(el);
            conf.tags[1].attrs.src = el.src;
             this.fire('diaporama', core.Conf(conf.tags[1]));
        },
        
         play: function() {
          this.init();
          this.show();
        },
     
         pause: function(){
            clearTimeout(this.timer);
             var i = isPortrait(this.getCurrent()) ? 3 : 2;
            this.fire('diaporama', core.Conf(conf.tags[i]));//create pause layer
        },
        
         resume: function(){
            this.fire('clair', this.timer);//clears pause layer, timer has a value which is a signal to clear top layer only
            this.show();
        },
        
        exit: function(){
            clearTimeout(this.timer);
            this.timer = null;
            this.fire('clair', this.timer);  //timer is null which is a signal to clear all layers
        },
        
         hide: function(){
            this.exit();
           this.prepareNext(this.getLast());
           this.fire('fin', this.getCurrent(), conf.tags[0]);
        },
        
        swap: function() {
            this.fire('diapositive', this.getNext());
            return this;
        },
        
          setNext: function() {
            this.hasNext(); //modulo
            this.fire('nouvelle', this.getCurrent());
        },
        
         setOpacity: function(n) {
            xOpacity = n || xOpacity;
            var options = {
            "-moz-opacity": xOpacity,
            "-webkit-opacity": xOpacity,
            "-khtml-opacity": xOpacity,
            "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha="+ (xOpacity * 100) + ')',
                opacity: xOpacity,
                filter: 'alpha(opacity=' + (xOpacity * 100) + ')'
            };
options = {
filter: 'alpha(opacity=' + (xOpacity * 100) + ')'
};
            this.fire('opacity', options);
            return this;
        }
        

    }; //uber
    
   INIT();
    
};