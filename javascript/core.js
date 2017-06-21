
/*jslint browser: true*/
/*global $, jQuery, alert*/
if (!window.gAlp) {
    window.gAlp = {};
}

//https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/lastElementChild
// Overwrites native 'lastElementChild' prototype.
// Adds Document & DocumentFragment support for IE9 & Safari.
// Returns array instead of HTMLCollection.
;(function(constructor) {
    if (constructor &&
        constructor.prototype &&
        constructor.prototype.lastElementChild == null) {
        Object.defineProperty(constructor.prototype, 'lastElementChild', {
            get: function() {
                var node, nodes = this.childNodes,
                    i = nodes.length - 1;
                while (node = nodes[i--]) {
                    if (node.nodeType === 1) {
                        return node;
                    }
                }
                return null;
            }
        });
    }
})(window.Node || window.Element);

gAlp.Core = (function($, _) {
    "use strict";
    /*
    //http://stackoverflow.com/questions/26461135/javascript-hasownproperty-vs-typeof
if (!Object.prototype.hasProperty) {//dirty check ;-P
    Object.prototype.hasProperty = (function(OP) {
        return function(name) {
            //typeof for speed: if value is not undefined, return true
            if (typeof this[name] !== 'undefined' || this.hasOwnProperty(name)) { return true; }
            //we've just checked the Object.prototype, found nothing, so return false
            if (this === OP) { return false; }
            return Object.getPrototypeOf(this).hasProperty(name);//check prototype
        };
    }(Object.prototype));//OP is object prototype
}
*/
    if (typeof Function.prototype.method === 'undefined') {
        Function.prototype.method = function(name, func) {
            this.prototype[name] = func;
            return this;
        };
    }

    if (typeof Function.prototype.wrap === 'undefined') {
        Function.prototype.wrap = function(wrapper) {
            var method = this;
            return function() {
                var args = [],
                    L = arguments.length;
                for (var i = 0; i < L; i++) {
                    args.push(arguments[i]);
                }
                return wrapper.apply(this, [method.bind(this)].concat(args));
            }
        };
    }

    var checkElementNode = function(node) {
        return node && node.nodeType === 1;
    },
        
        EventCache = function() {
            var listEvents = [];
            return {
                listEvents: listEvents,
                add: function(node, sEventName, fHandler) {
                    listEvents.push(arguments);
                },
                remove: function(i){
                   listEvents.splice(i, 1); 
                },
                 flush: function() {
                    var i = 0, item, L = listEvents.length;
                    while(L--){
                        item = listEvents[L];
                        if (item[0].removeEventListener) {
                            item[0].removeEventListener(item[1], item[2], item[3]);
                        }
                         if (item[1].substring(0, 2) !== "on") {
                            item[1] = "on" + item[1];
                        }
                        if (item[0].detachEvent) {
                            item[0].detachEvent(item[1], item[2]);
                        }
                         item[0][item[1]] = null;
                         this.remove(L);
                        }
                }
            };
        }();

    return {
        
        addEvent: function (obj, type, fn) {
            
            if(!obj || !type || !fn){
                return;
            }

        if (obj.addEventListener) {
            obj.addEventListener(type, fn, false);
            EventCache.add(obj, type, fn);
        } else if (obj.attachEvent) {
            obj["e" + type + fn] = fn;
            obj[type + fn] = function() {
                obj["e" + type + fn](window.event);
            };
            obj.attachEvent("on" + type, obj[type + fn]);
            EventCache.add(obj, type, fn);
        } else {
            obj["on" + type] = obj["e" + type + fn];
        }
    },
        
         isPrimitive: function(arg) {
            var type = typeof arg;
            return arg && type !== "object" && type !== "function";
        },
                
         isIndex: function(arg) {
           return typeof arg === "number" || typeof arg.toString() === "number";
        },

        isEmptyCollection: function(res) {
            return typeof res.length !== 'undefined' && !res.length;
        },
       
        fakeNodeMap: function(o) {
            var attrs = [],
                p;
            for (p in o) {
                attrs.push({
                    name: p,
                    value: o[p]
                });
            }
            return attrs;
        },
        
        indexOf: function(haystack, needle) {
            return haystack.toLowerCase().indexOf(needle) !== -1;
        },
        
        searchBy: function(term) {
            return function(tgt) {
                if (!tgt && !tgt.nodeName) return null;
                return tgt.getAttribute(term);
            }
        },

        getFirstValue: function(str, delimiter, int) {
            delimiter = delimiter || ' ';
            int = int || 0;
            if (!str) return;
            return str.split(delimiter)[int];
        },

        getInnerHTML: function(el) {
            if (!el) return null;
            //return firstChild.nodeValue;
            return el.innerHTML;
        },

        setInnerHTML: function(el, str) {
            if (!el) return null;
            el.innerHTML = str;
            return el;
        },
        
      
        removeWhiteSpace: function(el) {
            var gang = document.createDocumentFragment();
            while (el.hasChildNodes()) {
                if (el.firstChild.nodeType !== 1) {
                    el.removeChild(el.firstChild);
                } else {
                    gang.appendChild(el.firstChild);
                }
            }
            el.appendChild(gang);
            return el;
        },
        
        
          getNextElement: function(node) {
            if (node && node.nodeType === 1) {
                return node;
            }
            if (node && node.nextSibling) {
                return this.getNextElement(node.nextSibling);
            }
            return null;
        },

        
        //https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/previousElementSibling
        getPreviousElement: function(node) {
            if (node && node.nodeType === 1) {
                return node;
            }
            if (node && node.previousSibling) {
                return this.getPreviousElement(node.previousSibling);
            }
            return null;
        },

        getTarget: (function(doc) { //original
            if (doc.querySelector) {
                return function(node, sTgt) {
                    node = node || document;
                    return node.querySelector(sTgt);
                }
                return this.getMyTarget;
            }
        }(window.document)),

        getMyTarget: function(node, sTgt, trip, trav) {
            if(!sTgt || !trip) { return; }
            node = node || document.getElementsByTagName('body')[0];
            trav = trav || this.getNextElement;
            var t = trav(node);
            if(!t){ return; }
            if (t.nodeName.toLowerCase() === sTgt) {
                return t;
            } else {
                return this.getMyTarget(t[trip], sTgt, trip, trav);
            }
            return null;
        },

        isFirstItem: function(tgt, sNode, direction) {
            var el = this.getMyTarget(tgt, sNode, direction, this.getPreviousElement);
            return this.getPreviousElement(el.previousSibling);
        },

        prependChild: function(anchor, el) {
            return anchor.insertBefore(el, anchor.firstChild);
        },

        getElement: function($el, i) { //return jquery or native
            if (typeof i === 'undefined') {
                return $el;
            }
            if ($el[i].nodeType === 1) {
                return $el[i];
            }
            return $el;
        },

        wrapElement: function(container, el) {
            if (!container || typeof container !== 'string') {
                return null;
            }
            if (el && el.nodeType && el.nodeType !== 1) {
                return null;
            }
            var container = document.createElement(container);
            if (container.nodeType === 1) {
                if (el) {
                    container.appendChild(el);
                }
                return container;
            }
            return null;
        },

        unWrapElement: function(tgt, flag) {
            var temp = tgt.parentNode,
                home = temp.parentNode;
            home.appendChild(tgt);
            if (flag) home.removeChild(temp);
        },

        attributeSelector: function(tag, attr, val) {
            var tags = document.getElementsByTagName(tag),
                L = tags.length;
            while (L--) {
                if (tags[L].getAttribute(attr) === val) {
                    break;
                }
            }
            return tags[L];
        },

        create: function(object) {
            // return this.clone();
            return this.fromPrototype(object);
        },

        clone: function(object) {
            function F() {}
            F.prototype = object;
            return new F;
        },
        
          tagAll: function() {
                if (typeof document.all !== 'undefined') {
                        return document.all;
                } else {
                        return document.getElementsByTagName('*');
                }
        },

        getElementsByClass: function(klas) {
            try {
                return document.getElementsByClassName(klas);
            } catch (err) {
                var elementArray = this.tagAll(),
                    matchedArray = [],
                    i = 0,
                    l = elementArray.length,
                    pattern = new RegExp('(^| )' + klas + '( |$)');
                for (; i < l; i++) {
                    if (pattern.test(elementArray[i].className)) {
                        matchedArray[matchedArray.length] = elementArray[i];
                    }
                }
                return matchedArray;
            }
        },

        hasClass: function(target, klas) {
            if(!target || !klas){
                return false;
            }
            var pattern = new RegExp('(^| )' + klas + '( |$)');
            if (pattern.test(target.className)) {
                return true;
            }
            return false;
        },

        addClass: function(target, klas) {
            
            if(!target || !klas){
                return;
            }
            
            if (!this.hasClass(target, klas)) {
                if (target.className === '') {
                    target.className = klas;
                } else {
                    target.className += ' ' + klas;
                }
            }
        },

        removeClass: function(target, klas) {
            if (!target || !klas) { return; }
            var pattern = new RegExp('(^| )' + klas + '( |$)');
            target.className = target.className.replace(pattern, '$1');
            target.className = target.className.replace(/ $/, '');
        },

        show: function() {
            this.addClass.apply(this, arguments);
        },

        hide: function() {
            this.removeClass.apply(this, arguments);
        },
        
        Conf: function(conf) {
            var tag = conf.tag.split('_')[0],
                ix = conf.tag.split('_')[1] || 0;
            return {
                getTag: function() {
                    return tag;
                },

                setTag: function() {
                    conf.tag = tag;
                },

                getIndex: function() {
                    return ix;
                },
                getAttrs: function(str) {
                    if (str) {
                        return conf.attrs[str];
                    }
                    return conf.attrs;
                },
                getConf: function(flag) {
                    if (flag) {
                        this.setTag();
                    }
                    return conf;
                }
            };
        },

        //http://yehudakatz.com/2011/08/12/understanding-prototypes-in-javascript/
        fromPrototype: function(prototype, object) {
            var newObject = Object.create(prototype),
                p, o = object || {};
            
            
            for (p in o) {
                if (o.hasOwnProperty(p)) { //important
             if (typeof o[p] === 'object') { gAlp.Core.fromPrototype(prototype, o[p]) }
                    newObject[p] = object[p];
                }
            }
            return newObject;
        },       

        throwIt: function(type, msg) {
            return function(arg) {
                if (typeof arg !== type) {
                    msg = msg || " Must be A ";
                    arg = arg || "This argument";
                    throw new Error(arg + msg + type);
                }
            }
        },
        
        isArray: function (object) {
            return _.isArray(object);
        },

        isFunction: function (object) {
            return _.isFunction(object);
        },

        isString: function (arg) {
            return _.isString(arg);
        },
        
         checkNodeName: function(node, name) {
            if (checkElementNode(node)) {
                return function(named) {
                    name = named || name;
                    return name && node.nodeName === name;
                };
            }
        },

        plural: function(alg) {
            if (!this.isFunction(alg)) return;
            if (alg()) return 's';
            return '';
        },
        
        Command: {
            init: function(object) {
                this.object = object;
                return this;
            },
            execute: function(command) {
                var that = this,
                    args = _.rest(arguments);

                return function() {
                    if (command) { //allows for doNothing functions, that may  need to overwrite previous functionality
                        var newargs = args.concat(_.toArray(arguments));
                        return that.object[command].apply(that.object, newargs);
                    }
                }
            },

            undo: function(command) {
                var that = this,
                    args = _.rest(arguments);

                return function() {
                    if (command) {
                        var newargs = args.concat(_.toArray(arguments));
                        return that.object[command].apply(that.object, newargs);
                    }
                }
            }
        },

        makeCommand: {
            init: function(Command, object) {
                this.command = Command;
                this.command.init(object);
                return this;
            },
            setCommand: function(command) {
                var args = [command].concat(_.rest(arguments));
                this.command.execute = this.command.execute.apply(this.command, args);
            },

            setUndo: function(command) {
                var args = [command].concat(_.rest(arguments));
                this.command.undo = this.command.undo.apply(this.command, args);
            },

            getCommand: function() {
                return this.command;
            },

            execute: function() {
                return this.command.execute.apply(this.command, arguments);
            },

            undo: function() {
                return this.command.undo.apply(this.command, arguments);
            }
        },

        CommandFactory: function(object) {
            return this.create(this.makeCommand).init(this.create(this.Command), object);
        },

        State: {
            init: function() {
                this.states = [null];
                this.state = null;
            },
            addState: function(member) {
                this.states.push(member);
            },
            setState: function(arg) {
                this.state = this.states[arg];
            },

            getState: function(arg) {
                return this.state;
            },
            execute: function(method) {
                if (!method) {
                    return;
                }
                var state = this.state,
                    exec = state ? this.state[method] : null;
                if (exec) {
                    exec.apply(null, _.rest(arguments));
                }
            }
        },
        

        createComponent: (function() {  
            
        //utility functions          
        function isIndex(arg) {
            if(arg == null){
                return false;
            }
           return typeof arg === "number" || typeof arg.toString() === "number";
        }
            
        function isPrimitive(arg) {
            var type = typeof arg;
            return type !== "object" && type !== "function";
        }

            function getIndex(arg) {
                if(isPrimitive(arg)){//strings or numbers
                    return arg;
                }
                return find.apply(this, arguments);
            }

            function find(arg) {
                var kids = this.children;
                if(kids.push){//array 
                return kids.indexOf(arg);//indexOf only  es5+
                }
                return kids.find.apply(kids, arguments);
            }
            
            
            function iface(name, collection) {
                return new gAlp.Core.Inter_face(name, collection);
            }
            
            //Factory
            return function(arg) { //expects nothing, [] or {}
                //{} covenient shorthand for using an iterator object, the actual storage mechanism may be an array
                if (!arguments.length) {
                    return {
                        addChild: function() {},
                        getChild: function() {},
                        removeChild: function() {}
                    };
                    
                }
                else if(gAlp.Core.isArray(arg)) {

                    return {
                        init: function() {
                           // this.children = [];
                        },

                        //children: [],//NEVER DO THIS WITH PROTOTYPAL INHERITANCE
                        //you must create new copies of data types that are passed by reference
                        addChild: function(child) {
                            if (!this.children) {
                                this.init();
                            }
                            gAlp.Core.Inter_face.Ensures(child, iface('Composite', ['init', 'addChild', 'removeChild', 'getChild']));
                            this.children.push(child); //imp
                        },
                        getChild: function(arg) {
                            if (arg || isIndex(arg)) {
                                return this.children[getIndex.apply(this, arguments)];
                            }
                            return this.children;
                        },

                        //removeChild NOT remove which is a method of Observer so an obvious clash for objects that implements both API's
                        removeChild: function(child) {
                            this.children.splice(find.call(this, child));
                        }
                        
                    }; //ret

                } //default using array
                
                else {
                    return { //uses an iterator to wrap data

                        init: function(iterator) {
                            this.children = iterator || gAlp.Iterator();
                        },

                        addChild: function(child) {
                            if (!this.children) {
                                this.init();
                            }
                            gAlp.Core.Inter_face.Ensures(child, iface('Composite', ['init', 'addChild', 'removeChild', 'getChild']));
                            this.children.addItem(child);
                        },

                        getChild: function(arg) {
                             var i;
                            if (arg || isIndex(arg)) {
                                i = getIndex.apply(this, arguments);
                                return this.children.getData(i);
                            }
                            return this.children.getData(i);
                        },

                        removeChild: function(arg) {
                            var i;
                            if (arg || isIndex(arg)) {
                                i = getIndex.apply(this, arguments);
                            }
                            this.children.empty(i);
                        }
                        
                    };
                }
            } //factory


        })(),

        augment: function(C, P) {
            var i = 2,
                args = arguments,
                L = args.length,
                m;
            if (args[2]) { // Only give certain methods.
                for (; i < L; i++) {
                    C[args[i]] = P[args[i]];
                }
            } else { // Give all methods.
                for (m in P) {
                    if (!C[m]) {
                        C[m] = P[m];
                    }
                }
            }
        },

        publish: function(object) {
            var prop;
            if (object && object.subscribers) {
                return;
            }
            for (prop in this) {
                if (this.hasOwnProperty(prop)) {
                    object[prop] = this[prop];
                }
            }
        },

        decorator: function(dec, int) {
            return function(original) {
                //decorates the RESULT of calling the original
                return dec(original.apply(this, [].slice.call(arguments, int || 1)));
            }
        },

        // http://stackoverflow.com/questions/7459769/whats-the-purpose-of-using-function-call-apply-in-javascript
        unbound: function() { //it's a doozy!!
            
            var args = Array.prototype.slice.call(arguments),
                fn = typeof args[0] === 'function' ? args[0] : args[1] ? args[1][args[0]] : undefined;
            if (!fn) {
                return;
            }
            args = args.slice(1);
            //the call method of the supplied function to be run in the context of supplied object
            //Result of apply: fn.call(this, arg1,...argN)
            Function.call.apply(fn, args);
        },

        Base: {
            method: function(name, func) {

                var args = arguments,
                    test,
                    args2 = function() {
                        var a = "method called with ",
                            b = " argument"
                        c = ", but expected exactly 2."
                        return function(i, str) {
                            return a + i + b + str + c;
                        }
                    },
                    plural = args ? '' : 's';
                if (args.length !== 2) {
                    plural = args ? '' : 's';
                    throw new Error(args2(args, plural));
                }
                test = gAlp.Core.throwIt('string');
                test(name);
                test = gAlp.Core.throwIt('function');
                test(func);

                this[name] = func;
            }
        },

        Inter_face: function(name, methods) {

            if (this.Inter_face) {
                //called without new: this == Core.Interface
                return new this.Inter_face(name, methods);
            }

            var i = 0,
                L = methods && methods.length,
                args = arguments.length,
                plural,
                warnings = this.constructor.warnings,
                args2 = warnings.args2(),
                isEmpty = warnings.isEmpty,
                isString = this.constructor.getCore('isString');

            if (args !== 2) {
                plural = args ? '' : 's';
                throw new Error(args2(args, plural));
            }
            this.name = name;
            this.methods = [];
            if (!L) {
                throw new Error(warnings.isEmpty()());
            }

            for (; i < L; i++) {
                if (!isString(methods[i])) {
                    throw new Error(warnings.isString()());
                }
                this.methods.push(methods[i]);
            }
        }
    } //Core

}({}, _));


//supply core to static methods
(function(core) {
    core.Inter_face.Lib = {
        Required: ['yes', 'no', 'query'],
        Page: ['setWidth', 'getWidth', 'setHeight', 'getHeight', 'setSize', 'getSize', 'fetchMethod'],
        Foldpage: ['setWidth', 'getWidth', 'setHeight', 'getHeight', 'setSize', 'getSize', 'fetchMethod'],
        Composite: ['add', 'getChild', 'getID', 'setID', 'sortSrc', 'getSrc', 'display', 'getElement' /*, 'goFetch'*/ ],
        Visitor: ['accept'],
        Element: ['getElement']
    };

    core.Inter_face.getCore = function(method) {
        if (method) {
            return core[method];
        }
        return core;
    };

    core.Inter_face.warnings = {

        isString: function() {
            return function() {
                return "Interface constructor expects method names to be passed in as a string."
            }
        },
        args2: function() {
            var a = "Interface constructor called with ",
                b = " argument"
            c = ", but expected exactly 2."
            return function(i, str) {
                return a + i + b + str + c;
            }
        },
        ensure2: function() {
            var a = "Function Interface.ensure called with ",
                b = " argument"
            c = ", but expected at least 2.";
            return function(i, str) {
                return a + i + b + str + c;
            }
        },
        isInstance: function() {
            return function() {
                return "Function Interface.ensure expects arguments two and above to be instances of Interface.";
            }
        },
        isMethod: function() {
            var a = "Function Interface.ensure: object does not implement the ",
                b = " interface. Method ",
                c = " was not found.";
            return function(name, method) {
                return a + name.toUpperCase() + b + method + c;
            }
        },
        isArray: function() {
            return function() {
                return "This argument must be defined and must be an Array";
            }
        },
        isEmpty: function() {
            return function() {
                return "An Array is supplied but it is empty. Cannot complete initialisation";
            }
        }

    };

    core.Inter_face.ensureImplements = function(object /*interface1, interface2...*/ ) {
        var i = 1,
            j,
            len = arguments.length,
            inter_face,
            mLen,
            method,
            methods,
            plural,
            warnings = this.warnings,
            isInstance = warnings.isInstance(),
            ensure2 = warnings.ensure2(),
            isMethod = warnings.isMethod(),
            isArray = warnings.isArray();
        if (len < 2) {
            plural = len ? '' : 's';
            throw new Error(ensure2(len, plural));
        }
        for (; i < len; i++) {
            inter_face = arguments[i]; //interface is an instance of Interface
            methods = inter_face.methods;
            if (!core.isArray(methods)) {
                throw new Error(isArray());
            }
            mLen = methods.length;
            if (inter_face.constructor !== this) {
                throw new Error(isInstance());
            }
            for (j = 0; j < mLen; j++) {
                method = methods[j];
                if (!core.isFunction(object[method])) {
                    throw new Error(isMethod(inter_face.name, method));
                }
            }
        }
    };

    core.Inter_face.Ensures = function() {
        try {
            this.ensureImplements.apply(this, arguments);
        } catch (e) {
            alert(e);
        }
    }


    //var Composite = new Interface('Composite', ['add', 'remove', 'getChild']);
}(gAlp.Core));

/*
     getHeight: function(path, prop){
                var that = this, img = $("<img />").attr('src', path).on('load', function() {
        if (!this.complete || typeof this.naturalWidth === "undefined" || this.naturalWidth === 0) {
            alert('broken image!');
        } else {
            that[prop] = img[0].height;
            if(!validate.call(that, img)){ that.getNext(); }
            if(prop === 'current_height') { that.fire('diapositive', that.getNext()); }
            else {}
        }
    });
            }
*/