/*jslint nomen: true */
/*global window: false */
/*global gAlp: false */
/*global document: false */
/*global _: false */
if (!window.gAlp) {
	window.gAlp = {};
}

function doHandler(){
        function Handler(thunk) {
		// the cached instance
		var instance;
		// rewrite the constructor
		Handler = function Handler() {
            con(99)
			return instance;
		};
            con(11)
		// carry over the prototype properties
		Handler.prototype = this;
		// the instance
		instance = new Handler();
		// reset the constructor pointer
		instance.constructor = Handler;
		// all the functionality
		instance.handler = thunk();
		return instance;
	}
        return Handler;
        
    }


gAlp.Util = (function() {
    //https://stackoverflow.com/questions/7068967/css-how-to-make-ie7-respect-min-width
    function fixMinWidthForIE(){
   try{
      if(!document.body.currentStyle){return} //IE only
   }catch(e){return}
   var elems=document.getElementsByTagName("*");
   for(e=0; e<elems.length; e++){
      var eCurStyle = elems[e].currentStyle;
      var l_minWidth = (eCurStyle.minWidth) ? eCurStyle.minWidth : eCurStyle.getAttribute("min-width"); //IE7 : IE6
      if(l_minWidth && l_minWidth != 'auto'){
         var shim = document.createElement("DIV");
         shim.style.cssText = 'margin:0 !important; padding:0 !important; border:0 !important; line-height:0 !important; height:0 !important; BACKGROUND:RED;';
         shim.style.width = l_minWidth;
         shim.appendChild(document.createElement("&nbsp;"));
         if(elems[e].canHaveChildren){
            elems[e].appendChild(shim);
         }else{
            //??
         }
      }
   }
}
    
    String.prototype.abbreviate = function(token) {
	"use strict";
	var split = this.split(token || " "),
		res = '',
		i = 0;
	while (split[i]) {
		res += split[i].charAt(0).toUpperCase();
		i += 1;
	}
	return res;
};
    
    
    String.prototype.honor = function() {
	"use strict";
        var str;
        if(this.constructor.prototype.saved){
            str = this.constructor.prototype.saved.join(' ');
            this.constructor.prototype.saved = null;
        }
        else {
         this.constructor.prototype.saved = this.split(' '); 
            str = this.constructor.prototype.saved[1];
        }
        console.log(str);
        return str;
    }
    
	//https://stackoverflow.com/questions/7715562/css-style-property-names-going-from-the-regular-version-to-the-js-property-ca    
	function cssNameToJsName(name) {
		var split = name.split("-");
		var output = "";
		for (var i = 0; i < split.length; i++) {
			if (i > 0 && split[i].length > 0 && !(i == 1 && split[i] == "ms")) {
				split[i] = split[i].substr(0, 1).toUpperCase() + split[i].substr(1);
			}
			output += split[i];
		}
		return output;
	}

	function jsNameToCssName(name) {
		return name.replace(/([A-Z])/g, "-$1").toLowerCase();
	}

	function toCamelCase(variable) {
		return variable.replace(/-([a-z])/g, function(str, letter) {
			return letter.toUpperCase();
		});
	}
	//https://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
	function isElement(obj) {
		try {
			//Using W3 DOM2 (works for FF, Opera and Chrome)
			return obj instanceof HTMLElement;
		} catch (e) {
			//Browsers not supporting W3 DOM2 don't have HTMLElement and
			//an exception is thrown and we end up here. Testing some
			//properties that all elements have (works on IE7)
			return (typeof obj === "object") && (obj.nodeType === 1) && (typeof obj.style === "object") && (typeof obj.ownerDocument === "object");
		}
	}

    //https://stackoverflow.com/questions/6472707/how-to-get-info-on-what-key-was-pressed-on-for-how-long
    
    /*
    var pressed = {};

window.onkeydown = function(e) {
    if ( pressed[e.which] ) return;
    pressed[e.which] = e.timeStamp;
};

window.onkeyup = function(e) {
    if ( !pressed[e.which] ) return;
    var duration = ( e.timeStamp - pressed[e.which] ) / 1000;
    // Key "e.which" was pressed for "duration" seconds
    pressed[e.which] = 0;
};
*/
	function isTouchDevice() {
		return 'ontouchstart' in window // works on most browsers 
			|| window.navigator.maxTouchPoints; // works on IE10/11 and Surface
	}
    //https://medium.com/snips-ai/make-your-next-microsite-beautifully-readable-with-this-simple-javascript-technique-ffa1a18d6de2
    function getElementOffset(el) {
        var top = 0,
            left = 0;

  // grab the offset of the element relative to it's parent,
  // then repeat with the parent relative to it's parent,
  // ... until we reach an element without parents.
  do {
    top += el.offsetTop;
    left += el.offsetLeft;
    el = el.offsetParent
  } while (el)

  return { top: top, left: left };
}

	function composer() {
		var args = _.toArray(arguments),
			//may just be creating/selecting an unadorned element
			select = args[1] ? args.splice(-1, 1)[0] : args[0];
		return _.compose.apply(null, args)(select());
	}
    
	function makeElement() {
		var el,
			args = arguments,
			ret = function() {
				return this;
			},
			add = function() {};
		return {
			init: function() {},
			add: function() {
				el = composer.apply(null, args);
				return this;
			},
			remove: function() {
				return gAlp.Util.removeNodeOnComplete(el);
			},
			get: function() {
				return el;
			}
		};
	}
	//http://adripofjavascript.com/blog/drips/using-apply-to-emulate-javascripts-upcoming-spread-operator.html
	function spreadify(fn, fnThis) {
		return function( /* accepts unlimited arguments */ ) {
			// Holds the processed arguments for use by `fn`
			var spreadArgs = [];
			// Caching length
			var length = arguments.length;
			var currentArg;
			for (var i = 0; i < length; i++) {
				currentArg = arguments[i];
				if (Array.isArray(currentArg)) {
					spreadArgs = spreadArgs.concat(currentArg);
				} else {
					spreadArgs.push(currentArg);
				}
			}
			fn.apply(fnThis, spreadArgs);
		};
	}

	function isTypeOf(typ, arg) {
		return typeof arg === typ;
	}

	function returnIndex(i, func) {
		return func.apply(func, _.rest(arguments, 2))[i];
	}

	function getElement(arg) {
		if (arg && arg.parentNode) {
			return arg;
		}
		if (isTypeOf('string', arg)) {
			return document.getElementById(arg);
		}
		return null;
	}
    
    function getElementElse(arg) {
		if(!getElement(arg)){
		throw new Error();
        }
	}

	function doPartial() {
		return _.partial(_.partial.apply(null, _.toArray(arguments)))
	}

	function spread(fn, getargs) {
		return fn.apply(null, getResult(getargs));
	}

	function bridge(fn1, fn2, a, b) {
		//spread would invoked to convert arguments object to positional arguments
		//useful if two functions required
		return _.partial(fn1(a), fn2(b));
	}

	function always(val) {
		return function() {
			return val;
		};
	}


	function reset(v, o, p) {
		o[p] = v;
	}

	function bindContext(m, o) {
		return _.bind(o[m], o);
	}
    
    function bindContext(m, o) {
        var bound,
            unbound = function(){
            return o[m].apply(o, _.toArray(arguments));
        };
        try {
           bound = _.bind(o[m], o); 
        }
        catch(e){
            bound = unbound;
        }
		return bound;
	}

	function bindSubContext(ctx, m, o) {
        var bound,
            unbound = function(){
            return o[ctx][m].apply(o[ctx], _.toArray(arguments));
        };
        try {
           bound = _.bind(o[ctx][m], o[ctx]); 
        }
        catch(e){
            bound = unbound;
            document.getElementById('report').innerHTML = e.message;
        }
		return bound;
	}

	function doContext(bound, context, fArgs) {
		bound(context).apply(context, fArgs());
		return context;
	}
	/* deferred is a wrapper around doContext, bound awaits a context to re-order args
    context = context || context = context[subproperty]
    arguments = fArgs();
   context[method].apply(null, arguments)
    */
	function deferred(action, fArgs, value, context) {
		/* both value and context are optional, they may have already been partially applied
		if exactly three arguments are supplied the third argument MAY be a primitive (a value) OR a context object
		if the latter: value SHOULD have been partially applied and it is hoped fArgs will ignore the additional argument!
		*/
		context = arguments.length === 3 ? value : context;
		return doContext(action, context, _.partial(fArgs, value));
	}

function drill(arr, o) {
		var prop = arr.shift();
		if (prop && arr.length) {
			return drill(arr, o[prop]);
		}
		return o[prop];
	}
	/*
const curry = fn => (...args) => args.length >= fn.length
  ? fn(...args)
  : (...otherArgs) => curry(fn)(...args, ...otherArgs);
    */
	function curryLeft(fn) {
		var args = _.rest(arguments);
		if (args.length >= fn.length) {
			return fn.apply(null, args);
		} else {
			return function() {
				return curryLeft.apply(null, [fn].concat(args, _.toArray(arguments)));
			}
		}
	}

	function condition1( /* validators */ ) {
		var validators = _.toArray(arguments);
		return function(fun, arg) {
			var errors = mapcat(function(isValid) {
				return isValid(arg) ? [] : [isValid.message];
			}, validators);
			if (!_.isEmpty(errors)) {
				throw new Error(errors.join(", "));
			}
			return fun(arg);
		};
	}

	function prepareListener(handler, fn, el) {
		var listener,
			wrapper = function(func) {
				var args = _.rest(arguments),
					e = _.last(arguments);
				listener.prevent(e);
				//avoid sending Event object as it may wind up as the useCapture argument in the listener
				func.apply(el || null, args.splice(-1, 1));
			},
			wrapped = _.wrap(fn, wrapper);
		//calls addHandler which calls addListener which invokes the addEventListener/attachEvent method
		listener = handler(wrapped);
		return listener;
	}

	function addHandler(type, func, el) {
		return gAlp.Eventing.init.call(gAlp.Eventing, type, func, el).addListener();
	}

	function doObject(k, v) {
		return _.object([k], [v]);
	}

	function doArgs(o) {
		return _.pairs(o)[0]
	}

	function doArray(k, v) {
		return [k, v];
	}

	function caller(args, f) {
		return f.apply(null, args);
	}
    
    function stringOp(arg, o, m){
        return o[m](arg);
    }
    
    function invokeBound(bound, arg){
        return bound(arg);
    }

	function spread() {
		return _.toArray(arguments);
	}

	function curryMethod(property) {
		return function(method) {
			return function(obj) {
				return obj[method](property);
			};
		};
	}
    
    
    	function curry2(fun) {
		return function(secondArg) {
			return function(firstArg) {
				return fun(firstArg, secondArg);
			};
		};
	}

	function curry3(fun) {
		return function(last) {
			return function(middle) {
				return function(first) {
					return fun(first, middle, last);
				};
			};
		};
	}

	function curry4(fun) {
		return function(fourth) {
			return function(third) {
				return function(second) {
					return function(first) {
						return fun(first, second, third, fourth);
					};
				};
			};
		};
	}
    
    function curry5(fun) {
		return function(fifth) {
			return function(fourth) {
				return function(third) {
					return function(second) {
                        return function(first){
						return fun(first, second, third, fourth, fifth);
					};
				};
			};
		};
        };
	}

	function curryRight(fn) {
		var args = _.rest(arguments);
		if (args.length >= fn.length) {
			return fn.apply(null, gAlp.Util.reverse(args));
		} else {
			return function() {
				return curryRight.apply(null, [fn].concat(args, gAlp.Util.reverse(arguments)));
			}
		}
	}

	function orify( /* preds */ ) {
		var preds = _.toArray(arguments);
		return function( /* args */ ) {
			var args = _.toArray(arguments);
			var something = function(ps, truth) {
				if (_.isEmpty(ps)) {
					return truth;
				} else {
					return _.some(args, _.first(ps)) || something(_.rest(ps), truth);
				}
			};
			return something(preds, false);
		};
	}

	function reverseArray(array) {
		var i,
			L = array.length,
			old;
		array = _.toArray(array);
		for (i = 0; i < Math.floor(L / 2); i += 1) {
			old = array[i];
			array[i] = array[L - 1 - i];
			array[L - 1 - i] = old;
		}
		return array;
	}

	function ignoreArgs(n, fn) {
		var args = _.rest(arguments, n)
		return fn.apply(null, args)
	}

	function cat() {
		var head = _.first(arguments);
		if (existy(head)) {
			return head.concat.apply(head, _.rest(arguments));
		} else {
			return [];
		}
	}

	function construct(head, tail) {
		return head && cat([head], _.toArray(tail));
	}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function existy(x) {
		return x != null;
	}

	function fail(thing) {
		throw new Error(thing);
	}

	function truthy(x) {
		return (x !== false) && existy(x);
	}

	function undef(x) {
		return typeof(x) === 'undefined';
	}

	function warn(thing) {
		console.log(["WARNING:", thing].join(' '));
	}

	function note(thing) {
		console.log(["NOTE:", thing].join(' '));
	}

	function noOp() {
		return function() {};
	}
    
    function gtEq(x, y){
        return getResult(x) >= getResult(y);
    }
    
    function lsEq(x, y){
        return getResult(x) <= getResult(y);
    }

	function invokeWhen(validate, action) {
		var args = _.rest(arguments, 2),
			res = validate.apply(this || null, args);
		return res && action.apply(this || null, args);
	}
    
    function retWhen(pred, opt1, opt2){
        return getResult(pred) ? getResult(opt1) : getResult(opt2)
    }

	function doWhen(cond, action) {
		if (getResult(cond)) {
			return action();
		} else {
			return undefined;
		}
	}

	function invoker(NAME, METHOD) {
		return function(target /* args ... */ ) {
			if (!existy(target)) fail("Must provide a target");
			var targetMethod = target[NAME];
			var args = _.rest(arguments);
			return doWhen((existy(targetMethod) && METHOD === targetMethod), function() {
				return targetMethod.apply(target, args);
			});
		};
	}

	function dispatch() {
		var funs = _.toArray(arguments),
			size = funs.length;
		return function(target) {
			var ret = undefined,
				args = _.rest(arguments),
				fun,
				i;
			for (i = 0; i < size; i += 1) {
				fun = funs[i];
				try {
					ret = fun.apply(null, construct(target, args));
					if (existy(ret)) {
						return ret;
					}
				} catch (e) {
					//$('report').innerHTML = e.message;
				}
			}
			return ret;
		};
	}

	function validator(message, fun) {
		var f = function() {
			return fun.apply(fun, arguments);
		};
		f.message = message;
		return f;
	}

	function checker() {
		var validators = _.toArray(arguments);
		return function(obj) {
			return _.reduce(validators, function(errs, doValidate) {
				if (doValidate(obj)) {
					return errs;
				} else {
					return _.chain(errs).push(doValidate.message).value();
				}
			}, []);
		};
	}

	function cloneNode(node, bool) {
		//con(node, bool)
		var deep = existy(bool) ? bool : false;
		return node.cloneNode(deep);
	}

    
	function render(anc, refnode, el) {
		return getResult(anc).insertBefore(getResult(el), getResult(refnode));
	}

	function getNextElement(node) {
		if (node && node.nodeType === 1) {
			return node;
		}
		if (node && node.nextSibling) {
			return getNextElement(node.nextSibling);
		}
		return null;
	}

	function getPreviousElement(node) {
		if (node && node.nodeType === 1) {
			return node;
		}
		if (node && node.previousSibling) {
			return getPreviousElement(node.previousSibling);
		}
		return null;
	}

	function getTargetNode(node, reg, dir) {
        if(!node){
            return null;
        }
        node = node.nodeType === 1 ? node : getNextElement(node);
		var res = node && node.nodeName.match(reg);
		if (!res) {
			node = node && getNextElement(node[dir]);
			return node && getTargetNode(node, reg, dir);
		}
		return node;
	}

	function getClassList(el) {
		return el && (el.classList || gAlp.ClassList(el));
	}


	function regExp(str, flag) {
		return new RegExp(str, flag);
	}

	function nested(f1, f2, item) {
		return f2(f1(item));
	}

	function isset(o, k, v) {
		return o[k] === v;
	}
	//[ovk][vko][vok][kvo][kov]
	function setter(o, k, v) {
		o[k] = v;
	}

	function getter(o, k) {
		return o[k];
	}

	function setterplus(o, k, v) {
		o[k] += v;
	}

	function setret(o, k, v) {
		o[k] = v;
		return o;
	}

	function getset1(s, g, val) {
		return undef(val) ? g() : s(val);
	}

	function getset(s, g) {
		return function(val) {
			return undef(val) ? g() : s(val);
		};
	}

	function setprop(p, o, k, v) {
		//console.log(p,o,k,v)
		o[p][k] = v;
		return o;
	}

	function setAdapter(o, v, k) {
		return setret(o, k, v);
	}

	function setpropAdapter(p, k, v, o) {
		//console.log(p,o,k,v)
		return setprop(p, o, k, v);
	}

	function simpleInvoke(o, m, arg) {
		return o[m](arg);
	}

	function prefix(p, str) {
		return str.charAt(0) === p ? str : p + str;
	}
	/*because we may want to add further optional arguments (eg context)
		we're making validate mandatory defaulting to a predicate that returns true
		as opposed to querying the length and type of arguments
		*/
	function setFromObject(validate, method, config, target) {
		var tgt = target,
			//fn = _.bind(tgt[method], tgt),
            fn,
            p;
		//fn = _.partial(invokeWhen, validate, fn);
		//_.each(_.invert(config), fn);
        for(p in config){
            if(config.hasOwnProperty(p)){
                target[method](p, config[p]);
            }
        }
		//_.each(_.invert(config), tgt[method]);
		return target;
	}

	function setFromArray(validate, method, arr, target) {
		var fn,
			tgt = getClassList(target);
		if (!tgt) {
			return target;
		}
		fn = tgt && _.partial(simpleInvoke, tgt, method);
		if (validate) {
			fn = _.partial(invokeWhen, validate, fn);
		}
        _.each(_.flatten([arr]), fn);
		return target;
	}
    //delay to allow for transitions??
    function setFromArrayAlt(target, arr, method, delay, validate) {
		var fn,
			tgt = getClassList(target);
		if (!tgt) {
			return target;
		}
		fn = tgt && _.partial(simpleInvoke, tgt, method);
		if (getResult(validate)) {
			fn = _.partial(invokeWhen, validate, fn);
        }
		//window.setTimeout(function(){
            _.each(_.flatten([arr]), fn);
        //}, delay);
		return target;
	}

	function filterTagsByClass(el, tag, cb) {
		//var byTag = _.bind(el.getElementsByTagName, el);
        var tags = _.toArray(el.getElementsByTagName(tag));
		//return _.filter(byTag(tag), cb);
		return _.filter(tags, cb);
	}

	function getPolyClass(proto, klas, el, tag) {
		var mefilter = function(el) {
				klas = klas.match(/^\./) ? klas.substring(1) : klas;
				return gAlp.Util.getClassList(el).contains(klas);
			},
            ran = false,
			pre = _.partial(prefix, '.'),
			byTag = _.partial(filterTagsByClass, el || document, tag || '*', mefilter),
			dispatcher = dispatch.apply(null, classInvokers.concat(byTag)),
			nested = function(klass) {
				var res = dispatcher(proto, klass);
				if ((!res || !res[0]) && klass && !ran) {
                      ran = true;
                    res = nested(klass.substring(1));
				}
				return res;
			};
		return nested(pre(klas));
	}

	function validateRemove(node) {
		return node && node.parentNode;
	}

	function removeElement(node) {
		return node.parentNode.removeChild(node);
	}

	function looper(i, collection) {
		return function(bool) {
			if (bool) {
				return i;
			}
			i = (i += 1) % collection.length;
			return i;
		};
	}
	//note a function that ignores any state of x or y will return the first element if true and last if false
	function best(fun, coll) {
		return _.reduce(_.toArray(coll), function(x, y) {
			return fun(x, y) ? x : y
		});
	}
    
    function proxy(method){
        if(this.subject[method] && _.isFunction(this.subject[method])){
        this[method] = function(){
            return this.subject && this.subject[method] && this.subject[method].apply(this.subject, arguments);
        };
        }
        return this;
    }
    
    function byIndex(i, arg) {
			return getResult(arg)[i];
		}
	var classInvokers = [invoker('querySelectorAll', document.querySelectorAll), invoker('getElementsByClassName', document.getElementsByClassName)],
		getNewElement = dispatch(curry2(cloneNode)(true), _.bind(document.createElement, document), _.bind(document.createDocumentFragment, document));
	return {
		curry2: curry2,
		curry3: curry3,
		curry4: curry4,
        hasFeature: (function() {
            var html = document.documentElement || document.getElementsByTagName('html')[0];
            return function(str) {
                return gAlp.Util.getClassList(html).contains(str);
            }
        }()),
		looper: looper,
		/*handlers MAY need wrapping in a function that calls prevent default, stop propagation etc..
		which needs to be cross browser see EventCache.prevent */
		addEvent: function(handler, func) {
			return function(el) {
				var partial = el ? _.partial(handler, el) : _.partial(handler);
				return prepareListener(partial, func, el);
			};
		},
		isEqual: function(x, y) {
			return getResult(x) === getResult(y);
		},
        gtThan: function(x, y, flag){
            if(flag){
                return gtEq(x,y);
            }
            return getResult(x) > getResult(y);
        },
        lsThan: function(x, y, flag){
            if(flag){
                return lsEq(x,y);
            }
            return getResult(x) < getResult(y);
        },
		getter: getter,
		setter: setter,
		setret: setret,
		setterplus: setterplus,
		isset: isset,
		//setret: setret,
		simpleInvoke: simpleInvoke,
		regEx: function(str, flag) {
			return new RegExp(str, flag);
		},
		matchStr: function(str, reg) {
			return str.match(reg);
		},
		getRandom: function(n) {
			return Math.round(Math.random() * 10) % n;
		},
        getZero: _.partial(byIndex, 0),
		invokeRest: function(m, o) {
			return o[m].apply(o, _.rest(arguments, 2));
		},
		returnIndex: function(i, func) {
			return func.apply(func, _.rest(arguments, 2))[i];
		},
		//getResult: getResult,
		byIndex: function(i, arg) {
			return getResult(arg)[i];
		},
		nested: nested,
		//invoker: invoker,
		//dispatch: dispatch,
		render: render,
		getNewElement: getNewElement,
		setAnchor: function(anchor, refnode, strategy) {
			return _.compose(_.partial(render, anchor, refnode), strategy);
		},
		addHandler: addHandler,
		getNodeByTag: curry2(regExp)('i'),
		getPreviousElement: getPreviousElement,
		getNextElement: getNextElement,
		getNext: _.partial(nested, curry2(getter)('nextSibling'), getNextElement),
		getPrevious: _.partial(nested, curry2(getter)('previousSibling'), getPreviousElement),
		getTargetNode: getTargetNode,
		getDomChild: curry3(getTargetNode)('firstChild'),
		getDomParent: curry3(getTargetNode)('parentNode'),
		invokeWhen: invokeWhen,
		doWhen: doWhen,
		doWhenWait: curry2(doWhen),
		getClassList: getClassList,
		setAttrs: _.partial(setFromObject, always(true), 'setAttribute'),
		setText: curry3(setAdapter)('innerHTML'),
		//getPolyClass: getPolyClass,
		getByClass: _.partial(getPolyClass, document),
		//getByClass: getPolyClass,
		removeNodeOnComplete: _.wrap(removeElement, function(f, node) {
			if (validateRemove(node)) {
				return f(node);
			}
		}),
		setStyle: _.partial(bindSubContext, 'style', 'setProperty'),
		bindSub: bindSubContext,
		bindContext: bindContext,
		setFromArray: setFromArray,
		setFromArrayAlt: curry5(setFromArrayAlt)(always(true))(66),
		hide: _.partial(setFromArray, always(true), 'remove', ['show']),
		show: _.partial(setFromArray, always(true), 'add', ['show']),
		addClass: _.partial(setFromArray, always(true), 'add'),
		removeClass: _.partial(setFromArray, always(true), 'remove'),
		toggleClass: _.partial(setFromArray, always(true), 'toggle'),
        lookup: function(o, k){
            return o[k];
        },
        switchClass: function(a, b, el){
            console.log(a,b, el)
           return _.compose(_.partial(this.addClass, b), _.partial(this.removeClass, a))(el);
        },
		reverse: reverseArray,
		setpropAdapter: setpropAdapter,
		getset: getset,
		getBest: best,
		getBestRight: curry2(best),
		getBestLeft: best,
		checker: checker,
		validator: validator,
		curryMethod: curryMethod,
		identity: _.partial(_.identity),
		reset: reset,
		isNull: function(arg) {
			return arg === null;
		},
        toArray: function(coll){
           return _.toArray(getResult(coll));
        },
		doGetSet: function(context, property) {
			var set = _.partial(doPartial, setter, context),
				get = _.partial(doPartial, getter, context);
			return getset(set(property), get(property));
		},
		Observer: function() {
			this.fns = [];
		},
		makeElement: makeElement,
		getElement: getElement,
		withContext: deferred,
		removeListener: function(handler) {
			//any handler can be used as way to access the loop remove method
			//essentially a static method
			return function() {
				handler.remove.apply(null, arguments);
			}
		},
		awaitingTarget: function(i, m, p) {
			var args = _.rest(arguments, i);
			return function(o) {
				if (i > 1) {
					return o[p][m].apply(o[p], args);
				}
				return o[m].apply(o, args);
			};
		},
        retWhen: curry3(retWhen),
        proxy: proxy,
		command: function() {
			//method: (execute or undo)
			function prepFactory(method) {
				//command: init, toString, whatevers
				return function(command) {
					var that = this,
						args = _.rest(arguments);
                    //rewrite execute/undo
					this[method] = function() {
						if (command && that.object && that.object[command]) {
							var newargs = args.concat(_.toArray(arguments));
							return that.object[command].apply(that.object, newargs);
						}
					}; //invoked method
					return this;
				}; //closure
			} //factory
			var ret = {
				init: function(object) {
					this.setObject(object);
					/* prepFactory returns a function as the first version of execute or undo
					This function expects at least a command as a STRING and returns the rewritten
					execute/undo which calls the method of the supplied object to init IF the STRING is not empty 
					*/
					this.execute = prepFactory('execute');
					this.undo = prepFactory('undo');
					return this;
				},
				getObject: function() {
					return this.object;
				},
                setObject: function(object) {
					this.object = object;
				},
				toString: function() {
					return 'A Command Object';
				}
			};
			//clone??
			return ret;
			//return clone(ret);
		},
        getComputedStyle: function(element, styleProperty) {
                var computedStyle = null,
                    def = document.defaultView || window;
                if (typeof element.currentStyle !== 'undefined') {
                        computedStyle = element.currentStyle;
                } else if (def && def.getComputedStyle && _.isFunction(def.getComputedStyle)) {
                        computedStyle = def.getComputedStyle(element, null);
                }
                if(computedStyle){
                    return computedStyle[styleProperty] || computedStyle[toCamelCase(styleProperty)];
                }
        }
	};
}());
gAlp.Util.Observer.prototype = {
	subscribe: function(fn) {
		this.fns.push(fn);
	},
	unsubscribe: function(fn) {
		this.fns = this.fns.filter(function(el) {
			if (el !== fn) {
				return el;
			}
		});
	},
	fire: function(o) {
		this.fns.forEach(function(el) {
			el(o);
		});
	}
};