/*jslint browser: true*/
/*global $, jQuery, alert*/

if (!window.gAlp) {
    window.gAlp = {};
   
  gAlp._clone = function(object) {
           function F() {}
           F.prototype = object;
         	//F.prototype.constructor = F;
           return new F();
        };
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

     

if ( typeof Object.getPrototypeOf !== "function" ) {
  if ( typeof "test".__proto__ === "object" ) {
    Object.getPrototypeOf = function(object){
      return object.__proto__;
    };
  } else {
    Object.getPrototypeOf = function(object){
      // May break if the constructor has been tampered with
      return object.constructor.prototype;
    };
  }
}
/*
if (!Object.prototype.create) {
  Object.prototype.create = function (proto, props) {
 var t = typeof(proto), p;
    if (t !== 'null' && t !=='object') {
      throw TypeError('Object prototype may only be an Object or null');
    }
    function F(){}
    F.prototype = proto;
    t = new F();
   t.prototype.constructor = F;
    if(proto.prototype.constructor === Object.prototype.constructor){
    proto.prototype.constructor = proto;
    }
       if (props) {
      for (p in props) {
        if (props.hasOwnProperty(p)) {
          t[p] = props[p]
        }
      }
    }
    return t;
  };
  

}
 */
    if (typeof Function.prototype.method === 'undefined') {
        Function.prototype.method = function(name, func) {
            this.prototype[name] = func;
            return this;
        };
    }
    
      if (typeof Function.prototype.bind === 'undefined') {
        Function.prototype.bind = function(thisArg) {
            var fn = this,
            slice = Array.prototype.slice,
              args = slice.call(arguments, 1);
            return function() {
                return fn.apply(thisArg, args.concat(slice.call(arguments)));
            };
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
                if(wrapper){
                return wrapper.apply(this, [method.bind(this)].concat(args));
                }
            }
        };
    }
    
    /**
 * Shim for "fixing" IE's lack of support (IE < 9) for applying slice
 * on host objects like NamedNodeMap, NodeList, and HTMLCollection
 * (technically, since host objects have been implementation-dependent,
 * at least before ES2015, IE hasn't needed to work this way).
 * Also works on strings, fixes IE < 9 to allow an explicit undefined
 * for the 2nd argument (as in Firefox), and prevents errors when
 * called on other DOM objects.
 */

(function () {
  'use strict';
  var _slice = Array.prototype.slice; 

  try {
    // Can't be used with DOM elements in IE < 9
    _slice.call(document.documentElement);
  } catch (e) { // Fails in IE < 9
  
gAlp._shim = true;
    gAlp._clone = function(object) {
           function F() {}
           F.prototype = object;
         F.prototype.constructor = F;
           return new F();
        };

    // This will work for genuine arrays, array-like objects, 
    // NamedNodeMap (attributes, entities, notations),
    // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
    // and will not fail on other DOM objects (as do DOM elements in IE < 9)
    Array.prototype.slice = function(begin, end) {
      // IE < 9 gets unhappy with an undefined end argument
      end = (typeof end !== 'undefined') ? end : this.length;


      // For native Array objects, we use the native slice function
      if (Object.prototype.toString.call(this) === '[object Array]'){
        return _slice.call(this, begin, end); 
      }
      
      // For array like object we handle it ourselves.
      var i, cloned = [],
        size, len = this.length, start, upTo;

      // Handle negative value for "begin"
    start = begin || 0;
      start = (start >= 0) ? start : Math.max(0, len + start);

      // Handle negative value for "end"
      upTo = (typeof end == 'number') ? Math.min(end, len) : len;
      if (end < 0) {
        upTo = len + end;
      }

      // Actual expected size of the slice
      size = upTo - start;

      if (size > 0) {
        cloned = new Array(size);
        if (this.charAt) {
          for (i = 0; i < size; i++) {
            cloned[i] = this.charAt(start + i);
          }
        } else {
          for (i = 0; i < size; i++) {
            cloned[i] = this[start + i];
          }
        }
      }

      return cloned;
    };
  }
}());

 if (!Array.prototype.push) {
Array.prototype.push = function(){
for(var i = this.length, L = arguments.length; i < L; i++){
this[i] = arguments[i];
}
}
}
 if (!Array.prototype.pop) {
Array.prototype.pop = function(){
var n = this.length-1, item = this[n];
this.length = n;
return item;
}
}
    
       if ( !Array.prototype.filter ) {
 Array.method('filter', function(fn, thisObj) {
   var scope = thisObj || window;
   var a = [];
   for ( var i = 0, len = this.length; i < len; ++i ) {
     if ( !fn.call(scope, this[i], i, this) ) {
       continue;
     }
     a.push(this[i]);
   }
   return a;
 });
}

        
/*      
 // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
    _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
        _['is' + name] = function(obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    }),
    */
/*
	Developed by Robert Nyman, http://www.robertnyman.com
	Code/licensing: http://code.google.com/p/getelementsbyclassname/
*/
var getElementsByClassName = function (){
	if (document.getElementsByClassName) {
		return function (className, tag, elm) {
			elm = elm || document;
			var elements = elm.getElementsByClassName(className),
				nodeName = (tag) ? new RegExp("\\b" + tag + "\\b", "i") : null,
				returnElements = [],
				current;
			for(var i=0, il=elements.length; i<il; i+=1){
				current = elements[i];
				if(!nodeName || nodeName.test(current.nodeName)) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	else if (document.evaluate) {
		return function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = "",
				xhtmlNamespace = "http://www.w3.org/1999/xhtml",
				namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
				returnElements = [],
				elements,
				node;
			for(var j=0, jl=classes.length; j<jl; j+=1){
				classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
			}
			try	{
				elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
			}
			catch (e) {
				elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
			}
			while ((node = elements.iterateNext())) {
				returnElements.push(node);
			}
			return returnElements;
		};
	}
	else {
		return function (className, tag, elm) {
		
		if(!className) { return; }
				
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = [],
				elements = (tag === "*" && elm.all) ? elm.all : elm.getElementsByTagName(tag),
				current,
				returnElements = [],
				match;
				
			for(var k=0, kl=classes.length; k < kl; k++){
				classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
			}

			for(var l=0, ll=elements.length; l < ll; l++){
				current = elements[l];
				match = false;
				for(var m=0, ml=classesToCheck.length; m < ml; m++){
					match = classesToCheck[m].test(current.className);
					if (!match) {
						break;
					}
				}
				if (match) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
},

slice = Array.prototype.slice,
   checkElementNode = function(node) {
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


gAlp.Core = (function($, _) {

return {
/*
domReady: function () {
  document.body.className += " javascript";
  // ...
}

// Mozilla, Opera, Webkit 
if ( document.addEventListener ) {
  document.addEventListener( "DOMContentLoaded", function(){
    document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
    this.domReady();
  }, false );

// If IE event model is used
} else if ( document.attachEvent ) {
  // ensure firing before onload
  document.attachEvent("onreadystatechange", function(){
    if ( document.readyState === "complete" ) {
      document.detachEvent( "onreadystatechange", arguments.callee );
      this.domReady();
    }
  });
},
*/
 getElementsByClassName: getElementsByClassName(),

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
 
 toTitleCase: function (str){
    return str.replace(/\w\S*/,
    function(txt){
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
    );
},
        
        addEvent: function (obj, type, fn) {
            if(!obj || !type || !fn){
                return;
            }

        if (obj.addEventListener && window.eventTarget) {
            obj.addEventListener(type, fn, false);
            EventCache.add(obj, type, fn);
        } else if (obj.attachEvent) {
            /*obj["e" + type + fn] = fn;
            obj[type + fn] = function() {
                obj["e" + type + fn](window.event);
            };*/
           // obj.attachEvent("on" + type, obj[type + fn]);
             obj.attachEvent("on" + type, fn);
            EventCache.add(obj, type, fn);
        } else {
         obj["on" + type] = fn;
          EventCache.add(obj, type, fn);
         //obj["on" + type] = obj["e" + type + fn];
        }
    },
    
     prevent: function(e){
                      
                  if(e && e.preventDefault) {
                  	e.preventDefault();
              		e.stopPropagation();
              		}
              		else{
              		e.returnValue = false;
              		e.cancelBubble = true;
              		}
                  },
                  
           getEventTarget: function(e){
           return e.target || e.srcElement;
           }, 
           
            getEventObject: function(e){
            return e && e.target ? e : window.event;
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
            if(o.hasOwnProperty && o.hasOwnProperty(p)){
                attrs.push({
                    name: p,
                    value: o[p]
                });
                }
            }
            return attrs;
        },
        
        Fake: function(){
              this.attrs = [];
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
        //ie5.x mac friendly which doesn't support Function.call
	return !!object && object.constructor === Array;
     //return Object.prototype.toString.call(object) === '[object Array]';
        },
        
        inArray: function(haystack, needle) {
                        if (!this.isArray(haystack)) return false;
                        needle = needle || null;
                        for (var i = 0, max = haystack.length; i < max; i++) {
                                if (haystack[i] === needle) {
                                        return i;
                                }
                        }
                        return -1;
                },

        isFunction: function (object) {
            //return _.isFunction(object);
            return typeof object === 'function';
        },
        
        
        isString: function (arg) {
           // return _.isString(arg);
            return typeof object === 'string';
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
        
        rest: function(){
        return slice.call(arguments, 1);
        },
        
        toArray: function(){
       return slice.call(arguments);
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
         getFirstValue: function(str, delimiter, intg) {
            delimiter = delimiter || ' ';
            intg = intg || 0;
            if (!str) return;
            return str.split(delimiter)[intg];
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
        
            tagAll: function() {
                if (typeof document.all !== 'undefined') {
                        return document.all;
                } else {
                        return document.getElementsByTagName('*');
                }
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
            sTgt = sTgt.toLowerCase();
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
            if (flag) {
            home.removeChild(temp);
            }
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
        
              augment: function(C, P) {
            var i = 2,
                args = arguments,
                L = args.length,
                flag = args[2] && typeof args[2] === 'boolean',
                m;
            if(!C) return;
            if (args[2] && !flag) { // Only give certain methods.
                for (; i < L; i++) {
                // if (P.hasOwnProperty(m)) {
                    C[args[i]] = P[args[i]];
                  //  }
                }
            } else { // Give all methods.
                for (m in P) {
                    if (flag || !C[m]/* && P.hasOwnProperty(m)*/) {
                        C[m] = P[m];
                    }
                }
            }
        },
        
        clone: gAlp._clone,

        create: function(object, props) {
            try {
            return this.fromPrototype(object, props);
            }
            catch(e){
            try{
            var neu = this.clone(object);
            //var neu = this.extend(object);
            if(props){
            this.augment(neu, props);
            }
            return neu;
            }
            catch(e){
            }
            }
            
        },
        
        extend: function(P, C){
        var i;
        C = C || {};
        for (i in P){
        if(P.hasOwnProperty(i)){
        C[i] = P[i];
        }
        }
        return C;
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
        
       
      
                Command: (function(){
                
                function prepCommand(command){
                 var that = this,
                 core = gAlp.Core,
                    args = core.rest.apply(core, arguments);

                return function() {
                    if (command) {
                        var newargs = args.concat(core.toArray.apply(core, arguments));
                        return that.object[command].apply(that.object, newargs);
                    }
                    }
                    }
                
                return {
                
            init: function(object) {
                this.object = object;
                return this;
            },
            execute: function(command) {
               return prepCommand.apply(this, arguments);
            },

            undo: function(command) {
               		return prepCommand.apply(this, arguments);
            },
            
            toString: function(){
            return 'A Command Object';
            }
            
        }}()),
        
           CommandDecorator: {
            init: function(command) {
                this.command = command;
                this.stack = this.stack || [];
                return this;
            },
            execute: function() {
            	this.stack.push(this.command);
              this.command.execute();
            },

            undo: function() {
               this.command.undo();
            },
            
            toString: function(){
            return 'A CommandDecorator Object';
            }
        },
        
        
        makeCommand: {
            init: function(object) {
                this.command = gAlp.Core.create(gAlp.Core.Command);
                this.command.init(object);
                return this;
            },
            
            setCommands: function(stack) {
            this.stack = stack;
            },

            getCommand: function() {
                return this.command;
            },
          
            execute: function() {
            var stack = this.stack, L = stack.length
            while(L--){
            stack[L].execute()
            }
            },
            
            undo: function(bool) {
            var stack = this.stack, L = stack.length
            while(L--){
            stack[L].undo()
            }
            },

            toString: function(){
            return 'A Make Command Object';
            }
        },
        
        
        CommandFactory: function(object) {
          return this.create(this.makeCommand).init(object);
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
                var exec = this.state ? this.state[method] : null;
                if (exec) {
                    exec.apply(null, gAlp.Core.rest.apply(gAlp.Core, arguments));
                }
            }
        },
        
         createComponent: (function() {  
            
        //utility functions          
        function isIndex(arg) {
            if(typeof arg === 'undefined' || arg === null){
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
            
            //alert(this.isArray+'!')
                //{} covenient shorthand for using an iterator object, the actual storage mechanism may be an array
                if (!arguments.length) {
                    return {
                        addChild: function() {},
                        getChild: function() {},
                        removeChild: function() {}
                    };
                    
                }
                else if(gAlp.Core.isArray(arg)) {
				//else if(1 === 2) {
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
                            //gAlp.Core.Inter_face.Ensures(child, iface('Composite', ['init', 'addChild', 'removeChild', 'getChild']));
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
                           // gAlp.Core.Inter_face.Ensures(child, iface('Composite', ['init', 'addChild', 'removeChild', 'getChild']));
                            this.children.addItem(child);
                        },

                        getChild: function(arg) {
                             var i;
                            if (arg || isIndex(arg)) {
                                i = getIndex.apply(this, arguments);
                                return this.children.getData(i);
                            }
                            return this.children.getData();
                        },

                        removeChild: function(arg) {
                            var i;
                            if (arg || isIndex(arg)) {
                                i = getIndex.apply(this, arguments);
                            }
                            this.children.empty(i);
                        }
                        
                    };
                }//else iterator
            } //factory


        }()),
        
   

        publish: function(object) {
            var prop;
            if (!object || (object && object.subscribers)) {
                return;
            }

            for (prop in this) {
                if (this.hasOwnProperty(prop)) {
               object[prop] = this[prop];
                }
            }
        },
        
             decorator: function(dec, intg) {
            return function(original) {
                //decorates the RESULT of calling the original
                return dec(original.apply(this, [].slice.call(arguments, intg || 1)));
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
        
         Conf: function(conf) {
            var tag = conf.tag.split('_')[0],
                ix = conf.tag.split('_')[1] || 0,
                that = this;
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
        
                
        sortTimeOut: function(delay){
        var i = 1, j = 0, L = arguments.length, func, args = [], gang = [];
        //sortTimeOut runs on page load, supporting ie5 mac by not using Function.apply
        for(; i < L; j++){
        args[j] = arguments[i++];
        }
        L = args.length;
		while(L--){ gang.push(args[L]); }
		func = function(){
		L = gang.length;
		while(L--){ gang[L]();}
		}
		window.func = func;
		setTimeout("func()", delay);
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
        },
        

          
          getComputedStyle: function(element, styleProperty) {
                var computedStyle = null;
                if (typeof element.currentStyle !== 'undefined') {
                        computedStyle = element.currentStyle;
                } else if (typeof document.defaultView.getComputedStyle !== 'undefined'){
                        computedStyle = document.defaultView.getComputedStyle(element, null);
                }
                if(computedStyle) {
                return computedStyle[styleProperty];
                }
        }
        
        
        };//end
        

        
}({}, {}));


//supply core to static methods
(function(core) {

    core.Inter_face.Lib = {
        Required: ['yes', 'no', 'query'],
        Page: ['setWidth', 'getWidth', 'setHeight', 'getHeight', 'setSize', 'getSize', 'fetchMethod'],
        Foldpage: ['setWidth', 'getWidth', 'setHeight', 'getHeight', 'setSize', 'getSize', 'fetchMethod'],
        Composite: ['add', 'getChild', 'getID', 'setID', 'sortSrc', 'getSrc', 'display', 'getElement' /*, 'goFetch'*/ ],
        Visitor: ['accept'],
        Element: ['getElement'],
        Command: ['execute', 'undo']
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
    };
    
    core.Fake.prototype.process = function(o) {
            for (var p in o) {
            if(o.hasOwnProperty && o.hasOwnProperty(p)){
                this.attrs.push({
                    name: p,
                    value: o[p]
                });
                }
            }
        };
        
        core.Fake.prototype.getAttrs = function(o) {
        return this.attrs;
        };


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