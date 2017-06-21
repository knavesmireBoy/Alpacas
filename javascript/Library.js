/* Reference Article: http://www.dustindiaz.com/top-ten-javascript/ */
/* Reference Article: http://www.dustindiaz.com/top-ten-javascript/ */
/*window.onload = function() { 

 document.addEventListener("DOMContentLoaded", function(event) {
  });

 */


var gAlp = gAlp || {};


gAlp.Core = (function () {

    var pub = gAlp.Observer,
        iterator = gAlp.Iterator,
        $ = this.$;


    return {

        $: function (node, tag) {
            var id = node || document,
                isDoc = function (arg) {
                    return arg === document;
                };
            id = (isDoc(id)) ? id : (typeof id === 'string') ? document.getElementById(id) : id;
            if (!tag && isDoc(id)) return null;
            if (id && tag) {
                return id.getElementsByTagName(tag);
            }
            return id;
        }
        ,
//slice??
        toArray: function (arg, callback) {
            var Els = [], i = 0, el;
            while (arg[i]) {
                el = arg[i];
                if (callback) {
                    el = callback(el);
                }
                Els.push(el);
                i++;
            }
            return Els;
        }
        ,

        makePub: function () {
            var i = 0, args = arguments;
            while (args[i]) {
                this.mix(pub, args[i]);
                //CRUCIAL break link to prototype as this needs to be an instance property
                args[i].subscribers = {  any: []/*, special: []*/ };
                i++;
            }
        }
        ,

        hasMethods: function () {
            if (!document.getElementById) return null;
            if (!document.getElementsByTagName) return null;
            return true;
        },


        toString: function () {
            return 'core blimey';
        },

        makeIterator: function (tags) {
            var arr = this.toArray(tags),
                that = this;

            arr = arr.map(function (el) {
                var t = that.clone(gAlp.$$);
                return t.init(el);
            });
            return iterator(arr);
        },

        Accessor: {
            visit: function (arg) {
                this.element = arg;
            }
            ,
            getElement: function () {
                return this.element;
            }
        }
        ,


        getTarget: function (srcnode, targetnode, direction) {
            if (!arguments[0]) {
                return;
            }
            if (!targetnode) {
                return srcnode;
            }
            if (direction) {
                var t = srcnode;
                while (t[direction]) {
                    if (t.nodeName.toLowerCase() === targetnode) {
                        break;
                    }
                    t = t[direction];
                }
            }
            return t;
        }
        ,


        Interface: function (name, methods) {
            //            if (arguments.length != 2) {
                throw new Error("Interface constructor called with " + arguments.length + "arguments, but expected exactly 2.");
            }
            this.name = name;
            this.methods = [];
            for (var i = 0, len = methods.length; i < len; i++) {
                if (typeof methods[i] !== 'string') {
                    throw new Error("Interface constructor expects method names to be " + "passed in as a string.");
                }
                this.methods.push(methods[i]);
            }
        }
        ,


        /* addEvent: simplified event attachment */
        addEvent: function (obj, type, fn) {
            if (obj.addEventListener) {
                obj.addEventListener(type, fn, false);
                EventCache.add(obj, type, fn);
            }
            else if (obj.attachEvent) {
                obj["e" + type + fn] = fn;
                obj[type + fn] = function () {
                    obj["e" + type + fn](window.event);
                };
                obj.attachEvent("on" + type, obj[type + fn]);
                EventCache.add(obj, type, fn);
            }
            else {
                obj["on" + type] = obj["e" + type + fn];
            }
        }
        ,

        /* window 'load' attachment */
        addLoadEvent: function (func) {
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
        ,

        /* grab Elements from the DOM by className */
        getElementsByClass: function (searchClass, node, tag) {

            try {
                return document.getElementsByClassName(searchClass);
            } catch (err) {

                var classElements = [];
                if (node == null)
                    node = document;
                if (tag == null)
                    tag = '*';
                var els = node.getElementsByTagName(tag);
                var elsLen = els.length;
                var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
                for (var i = 0, j = 0; i < elsLen; i++) {
                    if (pattern.test(els[i].className)) {
                        classElements[j] = els[i];
                        j++;
                    }
                }
                return classElements;
            }
        }
        ,

        /* insert an element after a particular node */
        insertAfter: function (parent, node, referenceNode) {
            parent.insertBefore(node, referenceNode.nextSibling);
        }
        ,


        /* get, set, and delete cookies */
        getCookie: function (name) {
            var start = document.cookie.indexOf(name + "=");
            var len = start + name.length + 1;
            if (( !start ) && ( name != document.cookie.substring(0, name.length) )) {
                return null;
            }
            if (start == -1) return null;
            var end = document.cookie.indexOf(";", len);
            if (end == -1) end = document.cookie.length;
            return ( document.cookie.substring(len, end) );
            /*unescape*/
        }
        ,

        setCookie: function (name, value, expires, path, domain, secure) {
            var today = new Date();
            today.setTime(today.getTime());
            if (expires) {
                expires = expires * 1000 * 60 * 60 * 24;
            }
            var expires_date = new Date(today.getTime() + (expires));
            document.cookie = name + "=" + ( value ) + /*escape value*/
            ( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
            ( ( path ) ? ";path=" + path : "" ) +
            ( ( domain ) ? ";domain=" + domain : "" ) +
            ( ( secure ) ? ";secure" : "" );
        }
        ,

        deleteCookie: function (name, path, domain) {
            if (getCookie(name)) document.cookie = name + "=" +
            ( ( path ) ? ";path=" + path : "") +
            ( ( domain ) ? ";domain=" + domain : "" ) +
            ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
        }
        ,
        /*
         //quick getElement reference
         $: function () {
         var elements = [], element, i = 0, n = arguments.length;
         for (; i < n; i++) {
         element = arguments[i];
         if (typeof element == 'string')
         element = document.getElementById(element);
         if (n === 1)
         return element;
         elements.push(element);
         }
         return elements;
         },
         */


//http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        invoke: function (constr, args) {
            function F() { // constructor returns **this**
                return constr.apply(this, args);
            }

            F.prototype = constr.prototype;
            var f = new F();
            f.constructor = constr; //reset constructor property
            return f; //returns instance
        }
        ,


        /* Object-oriented Helper functions. */

        //prototype inheritance
        clone: function (object) {
            function F() {
            }
            F.prototype = object;
            return new F;
        },

        cloneLoop: function (/*array of strings*/) {
            //called in context of current instance
            this.$els = {}, core = gAlp.Core;
            var i = 0, arg = arguments, str;
            while (arg[i]) {
                str = arg[i];
                this.$els[str] = core.clone(gAlp.$$);
                i++;
            }
        },

        mix: function (parent, child) {//shallow copy

            var i, child = child || {};
            for (i in parent) {
                //NOTE a cloned object of base prototype will NOT have any OWN properties
                //below will NOT overwrite an existing member
                if (!child.hasOwnProperty(i)) {
                    child[i] = parent[i];
                }
            }
            return child;
        },

        mixIn: function() {
            var arg = 0,
                prop, child = {},
                len = arguments.length;
            for (; arg < len; arg++) {
                for (prop in arguments[arg]) {
                    if (arguments[arg].hasOwnProperty(prop)) {
                        child[prop] = arguments[arg][prop];
                    }
                }
            }
            return child;
        },

        //http://yehudakatz.com/2011/08/12/understanding-prototypes-in-javascript/
        fromPrototype: function (prototype, object) {
            var newObject = Object.create(prototype),
                p, o = object || {};
            for (p in o) {
                if (o.hasOwnProperty(p)) { //important
                    if (typeof o[p] === 'object') { //with amend
                        this.fromPrototype(prototype, o[p])
                    }
                    newObject[p] = object[p];
                }
            }
            return newObject;
        },


        extend: (function () {
            var F = function () {
            };
            return function (C, P) {
                //                F.prototype = P.prototype;
                C.prototype = new F();
                C.prototype.constructor = C;
                C.uber = P.prototype;
                if (P.prototype.constructor === Object.prototype.constructor) {
                    P.prototype.constructor = P;
                }
            }
        }()),

        augment: function (receivingClass, givingClass) {
           var methodName, i = 2, args = arguments, len = args.length;
            if (arguments[2]) { // Only give certain methods.
                for (; i < len; i++) {
                    receivingClass.prototype[args[i]] = givingClass.prototype[args[i]];
                }
            }
            else { // Give all methods.
                for (methodName in givingClass.prototype) {
                    if (!receivingClass.prototype[methodName]) {
                        receivingClass.prototype[methodName] = givingClass.prototype[methodName];
                    }
                }
            }
        }

    };
}());
//function r(f){/in/(document.readyState)?setTimeout(r,9,f):f()}


// Static class method.
gAlp.Core.Interface.ensureImplements = function (object /*interface1, interface2...*/) {
    if (!object) {
        return;
        //throw new Error("Please supply some context!");
    }
    var i, j,
        len = arguments.length,
        inter_face, methodsLen, method;
    if (arguments.length < 2) {
        throw new Error("Function Interface.ensureImplements called with " + arguments.length + "arguments, but expected at least 2.");
    }
    for (i = 1; i < len; i++) {
        inter_face = arguments[i]; //interface is an instance of Interface
        methodsLen = inter_face.methods.length;
        if (inter_face.constructor !== gAlp.Core.Interface) {
            throw new Error("Function Interface.ensureImplements expects arguments " + "two and above to be instances of Interface.");
        }
        for (j = 0; j < methodsLen; j++) {
            method = inter_face.methods[j];
            if (!object[method] || typeof object[method] !== 'function') {
                throw new Error("Function Interface.ensureImplements: object " + "does not implement the " + inter_face.name + " interface. Method " + method + " was not found.");
            }
        }
    }
};


gAlp.Core.Interface.Lib = {
    Required: ['yes', 'no', 'query'],
    Page: ['setWidth', 'getWidth', 'setHeight', 'getHeight', 'setSize', 'getSize', 'fetchMethod'],
    Foldpage: ['setWidth', 'getWidth', 'setHeight', 'getHeight', 'setSize', 'getSize', 'fetchMethod'],
    Composite: ['add', 'getChild', 'getID', 'setID', 'sortSrc', 'getSrc', 'display', 'getElement'/*, 'goFetch'*/],
    Visitor: ['accept'],
    Element: ['getElement']
};

Function.prototype.method = function (name, fn, _static, override) {
    if (_static) {
        if (!this[name]) {
            this[name] = fn;
        }
    } else {
        if (!override && !this.prototype[name]) {
            this.prototype[name] = fn;
        }
    }
    return this;
};


if (typeof Function.prototype.bind === 'undefined') {
    Function.prototype.bind = function (thisArg) {
        var fn = this,
            slice = Array.prototype.slice,
            args = slice.call(arguments, 1);
        return function () {
            return fn.apply(thisArg, args.concat(slice.call(arguments)));
        };
    };
}
;

/*
 function Publisher() {
 this.subscribers = [];
 }

 Publisher.prototype.fire = function(data) {
 this.subscribers.forEach(
 function(fn) {
 fn(data);
 }
 );
 return this;
 };

 Function.prototype.subscribe = function(publisher) {
 var that = this;
 var alreadyExists = publisher.subscribers.some(
 function(el) {
 if ( el === that ) {
 return;
 }
 }
 );
 if ( !alreadyExists ) {
 publisher.subscribers.push(this);
 }
 return this;
 };

 Function.prototype.unsubscribe = function(publisher) {
 var that = this;
 publisher.subscribers = publisher.subscribers.filter(
 function(el) {
 if ( el !== that ) {
 return el;
 }
 }
 );
 return this;
 };
 */

var EventCache = function () {
    var listEvents = [];
    return {
        listEvents: listEvents,
        add: function (node, sEventName, fHandler) {
            listEvents.push(arguments);
        },
        flush: function () {
            var i, item;
            for (i = listEvents.length - 1; i >= 0; i = i - 1) {
                item = listEvents[i];
                if (item[0].removeEventListener) {
                    item[0].removeEventListener(item[1], item[2], item[3]);
                }
                if (item[1].substring(0, 2) != "on") {
                    item[1] = "on" + item[1];
                }
                if (item[0].detachEvent) {
                    item[0].detachEvent(item[1], item[2]);
                }
                item[0][item[1]] = null;
            }
        }
    };
}();
gAlp.Core.addEvent(window, 'unload', EventCache.flush);


/*var a = {}, b = Object.create(Object.prototype);
 return /*  function F(){} |  F = function(){};
 if unNamed function (for examp) F.uber.constructor.apply(this, arguments);
 this.constructor.uber.constructor.apply(this, arguments);*/