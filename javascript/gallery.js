
if (!window.gAlp) {
    window.gAlp = {};
}

window.gAlp.Gallery = (function (core) {
    "use strict";

    var reversed = false;

    return {

        init: function (node, conf) {
            this.find(node);
            this.fire('diaporama', core.Conf(core.create(conf)));            
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

        element = {

            On: show,

            Off: hide,

            init: function (element) {
                if (!element) { return; }
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

            fetchElement: function (Conf, $anchor) {

                core.Inter_face.Ensures(Conf, this.iconf('Conf', ['getAttrs', 'getTag', 'setTag', 'getIndex', 'getConf']));

                function prepare(func, context) {
                    var i = 2,
                        args = [],
                        L = arguments.length;
                    for (i = 2; i < L; i++) {
                        args.push(arguments[i]);
                    }
                    return function () {
                        return func.apply(context, args);
                    };
                }

                var selectors = [],
                    index = 0,
                    byId = config.getFeature(config.getFeatures('id'));

                this.fetchElement = function (Conf, $anchor) {
                    var tag = Conf.getTag(),
                        i = Conf.getIndex().toString(),
                        byTags = config.getFeature(config.getFeatures('tags'), $anchor, i),
                        //a indexes can be strings. 0 === false, '0' === true which is crucial for byTags/byClass functions
                        byClass = config.getFeature(config.getFeatures('class'), $anchor, i);
                    if (!selectors.length) {
                        selectors.push(prepare(byId, this, Conf.getAttrs('id')));
                        selectors.push(prepare(byTags, this, tag));
                        selectors.push(prepare(byClass, this, Conf.getAttrs('class')));
                    }

                    this.init(selectors.splice(0, 1)[0]()); //discard failled attempts to getBy..
                    if (this.element) {
                        return this;
                    } else if (selectors.length) {
                        return this.fetchElement(Conf, $anchor);
                    } else {
                        
                        //tagBuilder requires tag to have this form (tag_n) when building trees, but this form (tag) for branches
                        //this.builder.build(Conf.getConf('_'), $anchor);
                        this.builder.build(Conf.getConf(i), $anchor);
                        this.built = true;

                        //run fetch after building to assign element find>init>element
                        //BUT make sure builder.build returns an element else infinite loop
                        return this.fetchElement(Conf, $anchor);
                    }
                };
                return this.fetchElement(Conf, $anchor);
            },

            removeElement: function () {
                var el = this.getElement();
                if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                    this.element = null;
                }
            },

            builder: tagBuilder,
            
            /*
            
              
            var attr = this.getNext().attributes,
                i = 0, p, res;
            while(res = attr.item(i)){
                for(p in res){
                    if(p === 'value'){
                        alert(res[p]);
                    }
                }
                i++;
            }
            
            
            */

            setAttributes: function (obj) {
                var p, o = obj && obj.hasAttributes && obj.hasAttributes() ? obj.attributes : obj ? obj : null;
                for (p in o) {
                    if (o.hasOwnProperty(p)) {
                        this.getElement().setAttribute(o[p].name, o[p].value);
                    }
                }
            },
            
            setAttributes: function (obj) {
            var p, o = obj && obj.hasAttributes && obj.hasAttributes() ? obj.attributes : obj ? obj : null;
if(!o)return;
                
                    var i = 0, L = o.length, gang = [];
                    for(; i < L; i++){
                  this.getElement().setAttribute(o[i].name, o[i].value);
                      alert(o[i].specified)
                    }
            alert(gang.length);
            },
            
            
            
            setStyle: function (options) {
                var p;
                //options.style instanceof CSSStyleDeclaration
                for (p in options) {
                    if (options.hasOwnProperty(p)) {
                        this.getElement().style[p] = options[p];
                    }
                }
            },

            setContent: function (content) {
                this.getElement().innerHTML = content;
            }
        };
    return element;

}(gAlp.Core, gAlp.tagBuilder, gAlp.Config, gAlp.Iterator));