/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global gAlp: false */
/*global _: false */
(function (mq, query, touchevents, pausepath, imagepath, picnum, tooltip_msg) {
	"use strict";
    
    
    function doPredicate(pred, q1, q2, arg){
        return pred(q1(arg)) ? q2(arg) : false;
    }

	function getNativeOpacity(bool) {
		return {
			getKey: function () {
				return bool ? 'filter' : Modernizr.prefixedCSS('opacity');
			},
			getValue: function (val) {
				return bool ? 'alpha(opacity=' + val * 100 + ')' : val;
			}
		};
	}
    
       function viewBoxDims(s){
        var a = s.split(' ').slice(-2);
        return {width: a[0], height: a[1]};
    }
    
    function doSvg(svg){
           return function(str){
               if(svg && str){
                   utils.setAttributes({viewBox: str}, svg);
                   //ipod ios(6.1.6) requires height, arbitrary choice of unsupported feature
                   if(!Modernizr.objectfit){
                       utils.setAttributes(viewBoxDims(str), svg);
                   }
               }
           }
       }
    
    
     function doSVGview() {
            var mq  = window.matchMedia("(max-width: 667px)"),
                setViewBox = doSvg(document.getElementById('logo')),
                doMobile = _.compose(execMobile, undoDesktop, ptL(setViewBox, "0 0 155 125")),
                doDesktop = _.compose(undoMobile, execDesktop, ptL(setViewBox, "2 0 340 75"));
         return function(){
                    if(mq.matches){//onload
                        doMobile();
                    }
                    return doAltSVG([doMobile, doDesktop]);
        };
     }

	function makeDummy() {
		return {
			render: function () {},
			unrender: function () {}
		};
	}

	function invokeMethod(o) {
		return function (m) {
			return o[m] && o[m].apply(null, _.rest(arguments));
		};
	}

	function doPartial(flag, f) {
		var F = _.partial(flag, f);
		if (flag && _.isBoolean(flag)) {
			F = function (elem) {
				return _.partial(f, elem);
			};
		}
		return F;
	}

	function doubleGet(o, sub, v, p) {
		return o[sub][p](v);
	}

	function greater(a, b) {
		return a > b;
	}

	function greaterBridge(o, p1, p2) {
		return greater(o[p1], o[p2]);
	}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function equals(a, b) {
		return getResult(a) === getResult(b);
	}

	function add(a, b) {
		return a + b;
	}

	function modulo(n, i) {
		return i % n;
	}

	function increment(i) {
		return i + 1;
	}

	function equalNum(tgt, cur) {
		return cur === tgt || parseFloat(cur) === parseFloat(tgt);
	}

	function invoke(f, arg) {
		arg = _.isArray(arg) ? arg : [arg];
		return f.apply(null, arg);
	}

	function invokeCB(arg, cb) {
		arg = _.isArray(arg) ? arg : [arg];
		return cb.apply(null, arg);
	}

	function invokeBridge(arr) {
		return invoke(arr[0], arr[1]);
	}

	function invokeArgs(f) {
		var args = _.rest(arguments);
		return f.apply(null, _.map(args, getResult));
	}

	function doMethod(o, v, p) {
		return o[p] && o[p](v);
	}

	function lazyVal(v, o, p) {
		return doMethod(o, v, p);
	}

	function doCallbacks(cb, coll, p) {
		return _[p](getResult(coll), cb);
	}

	function spread(f, j, group) {
		if (!group || !group[j]) {
			return [
				[],
				[]
			];
		}
		//allow for partial
		if (j) {
			return f(group[0], group[j]);
		}
		//or curry
		return f(group[1])(group[0]);
	}
	var utils = gAlp.Util,
		con = function(arg){
           console.log(arg);
            return arg;
        },
		ptL = _.partial,
		doComp = _.compose,
		Looper = gAlp.LoopIterator,
		curryFactory = utils.curryFactory,
		event_actions = ['preventDefault', 'stopPropagation', 'stopImmediatePropagation'],
		eventing = utils.eventer,
		once = utils.doOnce(),
		defer_once = curryFactory(1, true),
		twice = curryFactory(2),
		twicedefer = curryFactory(2, true),
		thrice = curryFactory(3),
		thricedefer = curryFactory(3, true),
		deferEach = thricedefer(doCallbacks)('each'),
		deferEvery = thrice(doCallbacks)('every'),
		anCr = utils.append(),
		anCrIn = utils.insert(),
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		klasTog = utils.toggleClass,
		cssopacity = getNativeOpacity(!window.addEventListener),
		$ = thrice(lazyVal)('getElementById')(document),
		$$ = thricedefer(lazyVal)('getElementById')(document),
		main = document.getElementsByTagName('main')[0],
		getThumbs = doComp(utils.getZero, ptL(utils.getByTag, 'ul', main)),
		getAllPics = doComp(ptL(utils.getByTag, 'img'), getThumbs),
        mytarget = !window.addEventListener ? 'srcElement' : 'target',
		getTarget = utils.drillDown([mytarget]),
		getTargetSrc = utils.drillDown([mytarget, 'src']),
		getImgSrc = utils.drillDown(['src']),
        doGet = twice(utils.getter),
		doVal = doGet('value'),
        getLength = doGet('length'),
		text_from_target = doComp(doGet('id'), getTarget),
		node_from_target = doComp(doGet('nodeName'), getTarget),
		node_from_target = utils.drillDown([mytarget, 'nodeName']),
		id_from_target = doComp(doGet('id'), getTarget),
        isImg = ptL(doPredicate, ptL(equals, 'IMG'), node_from_target, getTarget),
        doInc = function (n) {
			return doComp(ptL(modulo, n), increment);
		},
        
        do_page_iterator = function () {
			Looper.onpage = Looper.from(_.map(getAllPics(), function (img) {
				return img;
			}), doInc(getLength(getAllPics())));
		},
		setindex = function (arg) {
			if (!Looper.onpage) {
				do_page_iterator();
			}
			return Looper.onpage.find(arg);
		},
        
        red = doComp(twice(invoke)(), ptL(utils.getBest, isImg, [doComp(setindex, getTarget), function(){}]));
    /*function(e){
        var res = _.findIndex(getAllPics(), function(img){ return img === e.target;})
        con(res);
    }*/
   eventing('click', event_actions.slice(0, 1), red, getThumbs()).execute();

}(Modernizr.mq('only all'), '(min-width: 668px)', Modernizr.touchevents, '../images/resource/', /images[a-z\/]+\d+\.jpe?g$/, new RegExp('[^\\d]+\\d(\\d+)[^\\d]+$'), ["move mouse in and out of footer...", "...to toggle the display of control buttons"]));