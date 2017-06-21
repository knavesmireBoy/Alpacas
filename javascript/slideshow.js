
if (!window.gAlp) {
    window.gAlp = {};
}

window.gAlp.SlideShow = (function(core, tagBuilder, gallery) {
    "use strict";


    var slides = document.getElementsByClassName('slides'),
        xOpacity = 1,
        nDelay = 2000,
        nPause = 100,
        nRate = 0.07,
        paused = 'paused',
        timer = null,
        height = null,

        conf = {
            tags: [{
                tag: 'img_0',
                attrs: {
                    alt: "",
                    src: "../images/0.jpg",
                    "class": "slides",
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
        };


    function validateNextPic(nextpic) {
        return checkHeight(nextpic);
    }

    function findHeight(el) {
        var img = new Image();
        img.src = el.src;
        img.onload = function() {
            height = img.height;
        };
    }

    function setHeight(el) {
        if (!el.naturalHeight) {
            return findHeight(el);
        }
        height = el.naturalHeight;
    }
    
    
     function isPortrait(el) {
       return el.naturalHeight > el.naturalWidth;
    }

    function clearHeight() {
        height = 0;
    }

    function getHeight() {
        return height;
    }

    function checkHeight(nextpic) {
        return !(getHeight() % nextpic.naturalHeight);
    }

    return {

        init: function() {
            this.hasNext();
            var el = this.getLast(); 
              setHeight(el);
            conf.tags[1].attrs.src = el.src;
            this.fire('diaporama', core.Conf(core.create(conf.tags[1])));
        },
        
         play: function() {
            this.init();
            this.show();
        },
        
         show: function() {
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
        },
        
         pause: function(){
            clearTimeout(this.timer);
             var i = isPortrait(this.getCurrent()) ? 3 : 2;
            this.fire('diaporama', core.Conf(core.create(conf.tags[i])));//create pause layer
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
            //index advanced by swap so check current pic that is to be applied to the base pic
            //why. because there are landscape and portrait pictrues and it's just plain ugly to transtion between em
            var nextpic = this.getCurrent();
            if (!validateNextPic(nextpic)) {
                this.getNext();
                return this.setNext();
            }
            this.fire('nouvelle', nextpic);
        },
        
        setOpacity: function(n) {
            xOpacity = n || xOpacity;
            var options = {
                opacity: xOpacity,
                filter: 'alpha(opacity=' + (xOpacity * 100) + ')'
            };
            this.fire('opacité', options);
            return this;
        }


    }; //returned
}(gAlp.Core, gAlp.tagBuilder, gAlp.Gallery));

gAlp.SlideShow = (function(slideshow, gallery, core) {

    core.augment(slideshow, gallery, 'setAttributes', 'getCollection');
    return slideshow;

}(gAlp.SlideShow, gAlp.Gallery, gAlp.Core));