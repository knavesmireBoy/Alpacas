/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global gAlp: false */
/*global _: false */
if (!window.gAlp) {
	window.gAlp = {};
}
(function (query, mq, touchevents, article, report, displayclass, linkEx, navExes, limits) {
	"use strict";

	function noOp() {}
    

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}
    
    function add(a, b) {
		return a + b;
	}
    
    function equals(a, b) {
		return getResult(a) === getResult(b);
	}

	function gtThan(a, b) {
		return getResult(a) > getResult(b);
	}

	function lsThanEq(a, b) {
		return a <= b;
	}

	function callWith(m, ctxt) {
		return m.call(ctxt);
	}

	function onValidation() {
		var validators = _.toArray(arguments),
			result = 0;
		return function (fun, arg) {
			_.each(validators, function (validator) {
				if (!result) {
					//if passes set to zero
					result = Number(!validator(arg)) ? result += 1 : result;
				}
			});
			if (!result) {
				return fun(arg);
			}
			return arg;
		};
	}

	function checkDummy() {
		var val = gAlp.Util.getComputedStyle(document.getElementById("checkDummy"), "margin-top");
		return val === "1px";
		//return true;
	}

	function stringOp(reg, o, m) {
		return o[m](reg);
	}

	function simpleInvoke(o, m, arg) {
		//gAlp.Util.report(o[m]);
		if (arguments.length >= 3) { //allow for superfluous arguments 
			return o[m](arg);
		}
	}
    
      function invoke(f){
        return f.apply(null, _.rest(arguments));
    }
    
    
     function invokeArg(f, arg){
         return f(arg);
    }

	function caller(ctxt, ptl, arg, m) {
		return ptl(ctxt)[m](arg);
	}

	function inRange(i) {
		//https://wsvincent.com/javascript-tilde/
		//var res = ~"hello world".indexOf("w") ? true : false;
		return i >= 0;
	}

	function extendFrom(sub, supa, keys, key) {
		function mapper(method) {
			if (sub[method] && _.isFunction(sub[method])) {
				supa[method] = function () {
					return supa[keys][supa[key]][method].apply(sub[key], arguments);
				};
			}
		}
		_.each(_.keys(sub), mapper);
		return supa;
	}
    
    function doCallbacks(cb, coll, p) {
		return _[p](getResult(coll), cb);
	}
    
    function partialize(f, arg){
        return _.partial(f, arg);
    }
    
    function precomp(f1, f2){
        return _.compose(f2, f1);
    }
    
    function doMethod(o, v, p) {
		//console.log(arguments);
		return o[p] && o[p](v);
	}
    
    function lazyVal(v, o, p) {
		return doMethod(o, v, p);
	}
    
    function modulo(n, i) {
		return i % n;
	}

	function increment(i) {
		return i + 1;
	}

    
     function doHref(img){
         if(img.src) {
         var a = img.parentNode;
         utils.setAttributes({href: doParse(img.src)}, a);
         if(!utils.getPrevious(a)){
             utils.show(a);
             klasAdd('sell', utils.getBody);
         }
    }
     }
    
    function undoCaption(e){
        var goFig = utils.getDomChild(utils.getNodeByTag('figure'));
        doComp(utils.removeNodeOnComplete, goFig, ptL(klasRem, 'extent'), getParent, twice(invokeArg)(utils.$('sell')), thrice(doMethod)('appendChild'), _.identity)(e);
    }
        
    function doCaption(a, i){
        var fig = twice(invokeArg)('figure'),
            caption = twice(invokeArg)('figcaption'),
            append = thrice(doMethod)('appendChild')(a),
            cap = utils.getter(captions.slice(-bonds_len), i);
        
       doComp(ptL(klasAdd, 'extent'), ptL(utils.climbDom, 2), utils.setText(cap), caption, anCr, doGet('parentNode'), append, fig, anCr, $$('sell'), utils.hide)(a);
    }
    
    function sliceArray(list, end) {
			return list.slice(_.random(0, end || list.length));
		}
    
    var alpacas = [
			[
				["Granary Grace", "Price on Application"],
				["D.O.B.", "24.07.2005"],
				["Type", "Huacaya"],
				["Sex", "Female"],
				["Colour", "Fancy but mainly white"],
				["Sire", "Highlander Lad"],
				["Other Information"],
				["Grace is an assertive friendly animal, a herd leader. She is an excellent caring mother who has produced three excellent crias (one boy and two girls). She is currently empty but if required she could be covered by our own stud male Granary Carlos who has sired her two female crias. She carries the genetics of Both Highlander and Don Pedro. Price on application."],
				["alt", "Grace"],
				["src", "../images/sale/grace.jpg"]
			],
			[
				["Granary Maria", "Price on Application"],
				["D.O.B.", "12.08.2008"],
				["Type", "Huacaya"],
				["Sex", "Female (Maiden)"],
				["Colour", "Solid White"],
				["Sire", "Granary Carlos"],
				["Other Information"],
				["Unlike her mother (Grace) Maria is a gentle, curious hucaya who likes to be around humans. She is a well fleeced animal who carries the genetics of Highlander and Don Pedro. She is a maiden. Price on application."],
				["alt", "Maria"],
				["src", "../images/sale/Maria1.jpg"]
			],
			[
				["Granary Pilar", "Price on Application"],
				["D.O.B.", "26.08.2009"],
				["Type", "Huacaya"],
				["Sex", "Female"],
				["Colour", "Fancy but mainly white"],
				["Sire", "Granary Carlos"],
				["Other Information"],
				["Pilar is a strikingly marked animal, which goes well with her lively personality. She is well fleeced and good conformation. She is lively, loveable and a perfect pet a favourite with all who meet the herd. She is a maiden who carries the genes of Highlander and Don Pedro. Price on application."],
				["alt", "Pilar"],
				["src", "../images/sale/Pilar1.jpg"]
			],
			[
				["Granary Juanita", "Price on Application"],
				["D.O.B.", "29.072006"],
				["Type", "Huacaya"],
				["Sex", "Female"],
				["Colour", "Solid Dark Brown"],
				["Sire", "Somerset Peruvian Highlander Lad"],
				["Other Information"],
				["Juanita is a lovely natured&nbsp; huacaya who has just produced her first cria, a solid white female, born 13th July 2009. She is for sale with cria at foot and boasts background genetics of Highlander and Don Pedro."],
				["alt", "Juanita"],
				["src", "../images/sale/juanita.jpg"]
			],
			[
				["Newland Becky", "Price on Application"],
				["D.O.B.", "21.07.2004"],
				["Type", "Huacaya"],
				["Sex", "Female"],
				["Colour", "Solid  White"],
				["Sire", "Somerset Peruvian Highlander of Milend"],
				["Other Information"],
				["Becky is a proven breeding female (2) currently pregnant by Granary Carlos."],
				["alt", "Becky"],
				["src", "../images/sale/becky.jpg"]
			],
			[
				["Granary Enrico", "Price on Application"],
				["D.O.B.", "20.06.2007"],
				["Type", "Huacaya"],
				["Sex", "Male"],
				["Colour", "Solid White"],
				["Sire", "Farrlacey Ivan"],
				["Other Information"],
				["Enrico is a fine sturdy boy with a great fleece 18.5micron in 2008. Excellent stud potential."],
				["alt", "Rico"],
				["src", "../images/sale/rico.jpg"]
			]
		],
       
        
        bonds = [{src: '../assets/contact.jpg'}, {src: '../assets/hb.jpg'}, {src: '../assets/ca.jpg'}, {src: '../assets/lp.jpg'},{src: '../assets/mb.jpg'}, {src: '../assets/aw.jpg'}],
        captions = ['leanne', 'honor', 'claudine', 'luciana', 'martine', 'aki'],
        utils = gAlp.Util,
        ptL = _.partial,
         con = utils.con, 
       
        mytarget = !window.addEventListener ? 'srcElement' : 'target',
		doComp = _.compose,
		Looper = gAlp.LoopIterator,
        bonds_select = sliceArray(bonds),
		bonds_len = bonds_select.length,
        
        lookup = {
			4: 'four',
			5: 'five',
			6: 'six'
		},
        
		curryFactory = utils.curryFactory,
		event_actions = ['preventDefault', 'stopPropagation', 'stopImmediatePropagation'],
		eventing = utils.eventer,
		once = utils.doOnce(),
		defer_once = curryFactory(1, true),
		twice = curryFactory(2),
		twicedefer = curryFactory(2, true),
		thrice = curryFactory(3),
		thricedefer = curryFactory(3, true),
        
        parser = thrice(doMethod)('match')(/assets\/\w+\.jpe?g$/),
		doMap = utils.doMap,
		doGet = twice(utils.getter),
        getLength = doGet('length'),
        getTarget = doGet(mytarget),
        getParent = doGet('parentNode'),
        getZero = doGet(0),
        getOne = doGet(1),
		doVal = doGet('value'),
		doParse = doComp(ptL(add, '../'), doGet(0), parser),
        
		deferMap = thricedefer(doCallbacks)('map'),
		delayMap = thrice(doCallbacks)('map'),
		deferEach = thricedefer(doCallbacks)('each'),
		deferEvery = thricedefer(doCallbacks)('every'),
		delayEach = thrice(doCallbacks)('each'),
        intro = utils.findByClass('intro'),
		anCr = utils.append(),
		anCrIn = utils.insert(),
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
        $ = thrice(lazyVal)('getElementById')(document),
		$$ = thricedefer(lazyVal)('getElementById')(document),
        
        
        number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
		isDesktop = _.partial(gtThan, window.viewportSize.getWidth, threshold),
		getEnvironment = (function () {
			if (mq) {
				return _.partial(Modernizr.mq, query);
			} else {
				return isDesktop;
			}
		}()),
		negate = function (cb) {
			if (!getEnvironment()) {
				getEnvironment = _.negate(getEnvironment);
				cb();
			}
		},
        
        doInc = function (n) {
			return doComp(ptL(modulo, n), increment);
		},
        node_from_target = utils.drillDown([mytarget, 'nodeName']),
        deferAttrs = deferMap(bonds_select)(ptL(partialize, doComp(doHref, utils.setAttributes))),
        selldiv = doComp(ptL(utils.setAttributes, {id: 'sell'}), ptL(anCr(intro), 'div')),
        ancr = doComp(twice(invokeArg)('img'), anCr, ptL(anCr(selldiv()), 'a')),
        f = delayEach(delayMap(deferAttrs)(ptL(precomp, ancr)))(getResult),
        doLoop = function(coll){
            Looper.onpage = Looper.from(coll, doInc(getLength(coll)));
			},          
        doListen = function(coll){
            Looper.listen = Looper.from(coll, doInc(getLength(coll)));
			}, 
        gt4 = twicedefer(gtThan)(4)(bonds_len),
        gt3 = twicedefer(gtThan)(3)(bonds_len),
        mob4 = deferEvery([_.negate(gt4), gt3, _.negate(isDesktop)])(getResult),
        addLoopClass = ptL(klasAdd, 'loop', intro),
        addTabClass = ptL(klasAdd, 'tab', intro),
        outcomes = [[gt4, addLoopClass], [mob4, addLoopClass], [utils.always(bonds_len), addTabClass], [utils.always(true), function(){}]],
        doOutcome = doComp(invoke, getOne, ptL(utils.getBestOnly, doComp(invoke, getZero), outcomes)),
        clear = doComp(doOutcome, deferEach(['loop', 'tab'])(twice(klasRem)(intro))),
        deferShow,
        deferMembers,
        deferNext,
        isIMG = ptL(equals, 'IMG'),
        doDisplay,
        goGet,
        doFind,
        doExec = thricedefer(doMethod)('execute')(null),
        $displayer = {};
            
        // utils.drillDown(['value']), _.bind(Looper.onpage.current, Looper.onpage),
    doLoop(utils.getByTag('a', intro));
    deferMembers = deferEach(Looper.onpage.current().members);
    doFind = _.bind(Looper.onpage.find, Looper.onpage);
    goGet = _.bind(Looper.onpage.get, Looper.onpage);

    doDisplay = ptL(utils.invokeWhen, doComp(utils.con, isIMG, node_from_target), doComp(deferEach(Looper.onpage.current().members)(undoCaption), ptL(klasRem, 'extent'), ptL(utils.climbDom, 2), utils.show, goGet, doFind, getParent, getTarget));
    
    deferMembers(doCaption)();
    deferShow = doComp(utils.show, doGet('value'), _.bind(Looper.onpage.forward, Looper.onpage));
    deferNext = doComp(doCaption, deferShow, deferEach(deferMembers)(utils.hide));
    $displayer = eventing('click', event_actions.slice(0), function(e){
        doDisplay(e);
        $displayer.undo();
        
    }, utils.$('sell')).execute();
    
    eventing('click', event_actions.slice(0), doComp((doExec)($displayer), deferMembers(doCaption)), report).execute();
    eventing('resize', [], clear, window).execute();
    doOutcome();
    
        
}('(min-width: 769px)', Modernizr.mq('only all'), Modernizr.touchevents, document.getElementsByTagName('article')[0], document.getElementsByTagName('h2')[0], 'show', /\/([a-z]+)\d?\.jpg$/i, [/^next/i, /sale$/i, new RegExp('^[^<]', 'i'), /^</], {
	lo: 3,
	hi: 4
}));