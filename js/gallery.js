if (!window.gAlp) {
    window.gAlp = {};
}


window.gAlp.Gallery = (function (core) {
    "use strict";

    var reversed = false,
    isPortrait = function(node){
    return core.hasClass(core.getMyTarget(node, 'li', 'parentNode'), 'portrait');
    },
    
    getPortrait = function(node){
    return isPortrait(node);
    },
    
     getLandscape = function(node){
    return !isPortrait(node);
    };
    

    return {

        init: function (node, conf) {
         	this.unfilter(); 
           	this.find(node);
           	this.fire('diaporama', core.Conf(conf));
         	this.fire('nouvelle', this.getNext());
        },
                
        forward: function () {
            if (reversed) {
                this.switchDirection();
                reversed = false;
            }
            this.fire('nouvelle', this.getNext());
        },

        switchDirection: function () {
            this.getData().reverse();
            var inx = this.getLength() - (this.getIndex() - 1);
            this.setIndex(inx);
            this.hasNext();
        },

        reverse: function () {
            if (!reversed) {
                this.switchDirection();
                reversed = true;
            }
            this.fire('nouvelle', this.getNext());
        },

        prepareNext: function (arg) {
            this.find(arg);
            this.getNext();
            this.hasNext();
        },

        getEx: function () {
            var ex = this.getLast();
            this.getNext();
            return ex;
        }

    };
}(window.gAlp.Core));


window.gAlp.Element = (function (core, tagBuilder, config, iterator) {
    "use strict";

    var show = function () {
            core.show.apply(core, arguments);
        },

        hide = function () {
            core.hide.apply(core, arguments);
        },

        element = {//return object

            On: show,

            Off: hide,

            init: function (element) {
             // if (!element || (element && !element.innerHTML)) { return null; }
                this.element = element;
                return this;
            },

            getChildren: function () {
                return this.children;
            },

            setChildren: function (data, options) {
                this.children = iterator(data, options);
            },

            built: false,

            iconf: function (name, collection) {
                return new core.Inter_face(name, collection);
            },

            getElement: function (n) {
                if (typeof n !== "undefined") { //could, most likely will, be 0
                    return this.element[n];
                }
                return this.element;
            },

            fetchElement: function (Conf, anchor) {
            
              //core.Inter_face.Ensures(Conf, this.iconf('Conf', ['getAttrs', 'getTag', 'setTag', 'getIndex', 'getConf']));

                function prepare(func, context) {
                    var i = 2,
                        args = [],
                        L = arguments.length;
                    for (; i < L; i++) {
                        args.push(arguments[i]);
                    }
                    return function () {
                        return func.apply(context, args);
                    };
                }

                var selectors = [],
                    index = 0,
                    count = 1,
                    byId = config.getFeature(config.getFeatures('id'));

                this.fetchElement = function (Conf, anchor) {
                   
                    var flag = false,
                    tag = Conf.getTag(),
                        i = Conf.getIndex().toString(),
                        id = Conf.getAttrs('id'),
                         //a indexes can be strings. 0 === false, '0' === true which is crucial for byTags/byClass functions
                        byTags = config.getFeature(config.getFeatures('tags'), anchor, i),
                       byClass = config.getFeature(config.getFeatures('class'), anchor, i);
                    if (!selectors.length) {
                       selectors.push(prepare(byId, this, id));
                     	//selectors.push(prepare(byTags, this, tag));
                     	//selectors.push(prepare(byClass, this, Conf.getAttrs('class'), tag));
                    }
                   this.init( selectors.shift()() ); //discard failled attempts to getBy..
                    if (this.element) {
                        return this;
                    } else if (selectors.length) {
                       return this.fetchElement(Conf, anchor);
                    } else {
                  
                  	if(count-- && !this.built) {

                        this.builder.build(Conf.getConf(i), anchor);
                        this.built = true;

                        //run fetch after building to assign element find>init>element
                        //BUT make sure builder.build returns an element else infinite loop
                        return this.fetchElement(Conf, anchor);
                        }
                    }
                };
                return this.fetchElement(Conf, anchor);
            },


            removeElement: function () {
                var el = this.getElement();
                if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                    this.element = null;
                }
            },
            
            updateElement: function(arg, content){
            if(!arguments[1]){
            var func = typeof arg === 'string' ? 'setContent' : 'setAttributesBridge';
            this[func](arg);
            }
            else{
            this.setAttributesBridge(arg);
            this.setContent(content);
            }
            },

            builder: tagBuilder,

            setStyle: function (options) {
                //options.style instanceof CSSStyleDeclaration
                for (var p in options) {
                    if (options.hasOwnProperty(p)) {
                        this.getElement().style[p] = options[p];
                    }
                }
            },

            setContent: function (content) {
                this.getElement().innerHTML = content;
            },

	 setAttributesBridge: function (arg) {


function specify(){
if(gAlp._shim){
if(attr.specified) { select.push(item); }
}
else{
select.push(item);
}
}

            if(!arg){ return null; }
            if(arg && arg.nodeName && arg.attributes){

            var select = [],
            attrs = arg.attributes,
            L = attrs.length,
           	item,
           	i = 0, attr, p;
		for(; i < L; i++) {
     		attr = attrs[i];
     		item = {};
		item.name = attr.name;
		item.value = attr.value;
		specify();
         	}
         	this.setAttributes(select); 
 		}
            else if (core.isArray(arg)){ this.setAttributes(arg);  }
            },

            setAttributes: function (gang) {
            var L = gang.length;
            while(L--){
            this.setAttribute(gang[L]);
            }
            },
             
             setAttribute: function (obj) {
           // alert('"'+obj.value+'"');
             this.getElement().setAttribute(obj.name, obj.value);
             },
            
            
             dummy: ''
       
        };
    return element;

}(gAlp.Core, gAlp.tagBuilder, gAlp.Config, gAlp.Iterator));