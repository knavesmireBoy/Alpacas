/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global _: false */

   if (!window.gAlp) {
	window.gAlp = {};
}

window.gAlp.Eventing = (function (eventing) {  
    
    
    
	function triggerEvent(el, type) {
		if ('createEvent' in document) {
			// modern browsers, IE9+
			var e = document.createEvent('HTMLEvents');
			e.initEvent(type, false, true);
			el.dispatchEvent(e);
		} else {
			// IE 8
			e = document.createEventObject();
			e.eventType = type;
			el.fireEvent('on' + e.eventType, e);
		}
	}
    
    function mapper(src, tgt, method){
        if(src[method] && _.isFunction(src[method])){
        tgt[method] = function(){
            return src[method].apply(src, arguments);
        };
    }
    }
    
    
    function getEvent(e){
        var e = e || window.event;
        var src = e.target || e.srcElement;
        try {
            e.preventDefault();
        }
        catch (ex) {
            e.returnValue = false;
        }
    }

    
    function isfound(i, j) {
		return (i !== -1) ? i : j;
	}
    function isfunc(fn, context) {
        //return _.isFunction(fn) || context && isfunc(context[fn]) || context && isfunc(fn[context]);
        return _.isFunction(fn);
				}
    function isElement(el) {
        return _.isElement(el) || el === window;
				}
    
        function sortArgs(fn, el, context){
        var f = isfunc(fn, context) ? fn : el,
            element = isElement(el) ? el : fn;
            return {func: f, element: element};
    }
    
    var EventCache = function(list) {
        
		var remove = function(coll, arg) {
				return _.findIndex(coll, (function(cur) {
					return cur === arg;
				}));
			},
            
            safeAddSimple = function(tgt){
                list = _.filter(list, function(item) {
                    return item !== tgt;
                });
                list.unshift(tgt);
            },
            
            safeAddSimpleOrder = function(tgt){
            var i = remove(list, tgt);
            if(i < 0){
                list.unshift(tgt);
            }
            },
            
            getList = function(){
                return list;
            };
            
            
		return {
			listEvents: function(){
                return list;
            },
			add: function(o) {
				o && list.unshift(o);
				//list.unshift(_.toArray(arguments));
			},
			add2: safeAddSimple,
			flush: function() {
				var i;
				for (i = list.length - 1; i >= 0; i = i - 1) {
					list[i].removeListener();
				}
				list = [];
			},
			get: function(i) {
				return _.isNumber(i) ? list[i] : _.isBoolean(i) && !i ? list[list.length - 1] : list;
			},
			//rem: _.compose(curry2(splice)(0), curry2(isfound)(Infinity), _.partial(remove, list)),
			//remove: _.compose(curry2(splice)(1), curry2(isfound)(0), _.partial(remove, list)),
			remove: function(o){
                var list = getList();
                if(o && _.isObject(o)){
                    list.splice(remove(list, o), 1)[0].removeListener();
                }
                else {
                    try {
                    list.splice.apply(list, arguments)[0].removeListener();
                    }
                    catch(e){
                        true;
                    }
                }
            },
			getEventObject: function(e) {
				return e || window.event;
			},
            
            getEventTarget: function(e) {
				return e.target || e.srcElement;
			},
			prevent: function(e) {
                e.preventDefault();
				e = this.getEventObject(e);
				if (e && e.preventDefault) {
					e.preventDefault();
					e.stopPropagation();
				} else {
					e.returnValue = false;
					e.cancelBubble = true;
				}
			},
			getEventTarget: function(e) {
				e = this.getEventObject(e);
				return e.target || e.srcElement;
			},
            triggerEvent: triggerEvent
		};
	}([]);
			if (window.addEventListener) {
				eventing.init = function (type, el, fn, context) {
					var config = sortArgs(fn, el, context),
                        bound;
					this.addListener = function (el) {
                        bound = el ? _.bind(config.func, el) : config.func;
						config.element.addEventListener(type, bound, false);
						EventCache.add(this);
                        this.el = config.element+'_'+EventCache.listEvents().length;
						return this;
					};
					this.removeListener = function () {
						config.element.removeEventListener(type, bound, false);
						return this;
					};
					this.getElement = function(){
                        return config.element;
                    };
                    _.each(['prevent', 'remove', 'flush', 'listEvents', 'triggerEvent'], _.partial(mapper, EventCache, this));
					return _.extendOwn({}, this);
				};
			} else if (document.attachEvent) { // IE
                        //window.onload = function(){alert(9);}

				eventing.init = function (type, el, fn, context) {
                    var config = sortArgs(fn, el, context),
                        bound;
					this.addListener = function (el) {
                        bound = el ? _.bind(config.func, el) : config.func;
                        EventCache.add(this);
						config.element.attachEvent('on' + type, bound);
						//config.element.attachEvent('on' + type, config.func);
						return this;
					};
					this.removeListener = function () {
						el.detachEvent('on' + type, fn);
						return this;
					};
                    this.getElement = function(){
                        return config.element;
                    };
                    this.el = config.element+'_'+EventCache.listEvents().length;
                    _.each(['prevent', 'remove', 'flush', 'listEvents', 'triggerEvent'], _.partial(mapper, EventCache, this));
					return _.extendOwn({}, this);
				};
			} else { // older browsers
				eventing.init = function (type, el, fn, context) {
                     var config = sortArgs(fn, el, context),
                        bound;
					this.addListener = function (el) {
                        bound = el ? _.bind(config.func, el) : config.func;
						EventCache.add(this);
						el['on' + type] = bound;
						return this;
					};
					this.removeListener = function () {
						el['on' + type] = null;
						return this;
					};
                    this.getElement = function(){
                        return config.element;
                    };
                    this.el = config.element+'_'+EventCache.listEvents().length;
                    _.each(['prevent', 'remove', 'flush', 'listEvents', 'triggerEvent'], _.partial(mapper, EventCache, this));
					return _.extendOwn({}, this);
				};
			}
			return eventing;
		}({}));