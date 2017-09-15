/*jslint browser: true*/
/*global $, jQuery, _, alert*/
if (!window.gAlp) {
    window.gAlp = {};
}
window.gAlp.tagBuilder = (function() {
    "use strict";
    
    function isSibling(tag) {
        return tag.split("_");
    }

    function makeTag(tag) {
        return document.createElement(tag);
    }
            
    function setAttrs(data){
        for(var prop in data){
        if(data.hasOwnProperty(prop) && data[prop]){
            this.setAttribute(prop, data[prop]);
            }
        }
        return this;
    }
    
    function setContent(data){
       this.innerHTML = data;
        return this;
    }

 
    function flush(collection) {
        var i = 0,
            c = collection,
            L = c.length;
        for (i; i < L; i++) {
            if (i) {//exclude first
                c[0] = c[0].wrap(c[i]);//recursivley decorating the initial method
            }
        }
        c.splice(1);
        return c[0]();
    }
    
    function qualifies(prop){
         var o = data.hasOwnProperty(prop),
           p = Object.getPrototypeOf(data).hasOwnProperty(prop);
           return (o || p);
    }

    return {
    
     build: function (data, anchor) {
      
        if(!data || !data.tag || !anchor){ return; }
       
         this.anchor = anchor;
                  
            function appendIt(anchor, el, flag){
                if(!flag) {
                return anchor.appendChild(el);
                }
       return anchor.insertBefore(el, anchor.firstChild);
    }
    
      function getAnchor(sibling) {
                var anc = sibling && parseFloat(sibling) ? that.anchor.parentNode : that.anchor;
                    return anc;
                }
                     
            var that = this,
                gang,
                prop,
                arg,
                method,
                 process = {
                    tag: function (tag) {
                          return function (fn) {
                            /*see config.contents.placeholder.children
                            We need to determine whether to append to current or parent tag, "_sibling" added to config: tag to indicate status. String.split returns an array at "_", if array has length of 2 we are dealing with a sibling tag and must reset current anchor to common parent*/
                            var tg = isSibling(tag);//anchor function will be called to determine the dom element to anchor to
                           //tg[1] will be a string or undefined
                          return appendIt(fn(tg[1]), makeTag(tg[0]), tg[2]);
                        };
                    },
                    attrs: function (attrs) {
                        return function (fn) {
                           return setAttrs.call(fn(), attrs);
                        };
                    },
                    content: function (content) {
                        return function (fn) {
                         return setContent.call(fn(), content);
                        };
                    },
                    children: function (kids) {
                        var i = 0;
                        that.anchor = flush(gang);
                        while (kids[i]) {
                            that.build(kids[i], that.anchor);
                            i++;
                        }
                    }
                };

            gang = [getAnchor];
            
            for (prop in data) {
              //var o = data.hasOwnProperty(prop);
                    //o = Object.getPrototypeOf(data).hasOwnProperty(prop);

         if(data.hasOwnProperty(prop)){
                    method = process[prop];
                    arg = data[prop];
                    if(method){
                     method = method.bind(this);
                    gang.push(method(arg));//returns closure
                    }
               }
            }//for in
           
           
           //ie if more than initial method 'getAnchor'
            if (gang[1]) {//children method flushes data and sets new anchor
                //elements with no children get flushed here
               flush(gang); 
            }
        }//build
    
   };
}());