/*jslint nomen: true */
/*global window: false */
/*global gAlp: false */
/*global document: false */
/*global Modernizr: false */
/*global _: false */
if (!window.gAlp) {
	window.gAlp = {};
}

(function(mq, query, touchevents, cssanimations){ 
    "use strict";
    
    
     function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}
    
    function invokeMethod(o, m){
        return o[m]();
    }
    
    function invokeMethod2(b,a,m,o){
        return o[m](a, b);
    }
    
    function invokeArg(f, arg){
        return f(arg);
    }

	function getGreater(a, b) {
		return getResult(a) > getResult(b);
	}
    
    function getPageOffset(bool) {
		var w = window,
			d = document.documentElement || document.body.parentNode || document.body,
			x = (w.pageXOffset !== undefined) ? w.pageXOffset : d.scrollLeft,
			y = (w.pageYOffset !== undefined) ? w.pageYOffset : d.scrollTop;
		return bool ? x : y;
	}
    
    
    function replacer(str, cb, reg) {
		return str.replace(reg, cb);
	}
    
    function isBig(n) {
		return window.viewportSize.getWidth() > n;
	}
    
    
    function validate(tgt){
        return utils.hasClass('elip', tgt);
    }
    
    function F () {
        if(!utils.findByClass('show')){
            _.each(para, function(p, i){
                report(i);
                //i && utils.removeClass('elip', p);
            })
        }
        
        //report(utils.findByClass('show'))
    }
    
    var utils = gAlp.Util,
        con = function(arg){
            console.log(arg);
            return arg;
        },
         report = function(arg){
            document.querySelector('h2').innerHTML = arg;
            return arg;
        },
		ptL = _.partial,
        twice = utils.curryFactory(2),
        twicedefer = utils.curryFactory(2, true),
        quatro = utils.curryFactory(4, true),
        thrice = utils.curryFactory(3),
		eventing = utils.eventer,
        readmoretarget = utils.getByClass('read-more-target')[0],
        verbose = utils.getByClass('.verbose'),
        doElip = ptL(utils.addClass, 'elip'),
        undoElip = ptL(utils.removeClass, 'elip'),
        show = _.compose(doElip, utils.getNext, utils.getNext, ptL(utils.addClassVal, validate, 'add', 'show')),
        hide = _.compose(undoElip, utils.getNext, utils.getNext, ptL(utils.removeClass, 'show')),
        
        para = readmoretarget ? readmoretarget.getElementsByTagName('p') : [],
        handleEl = _.compose(ptL(getGreater, ptL(getPageOffset, false)), twice(utils.getScrollThreshold)(0.1)),
        display = _.compose(ptL(invokeArg), ptL(utils.getBest, handleEl, [show, hide])),
        cb = quatro(invokeMethod2)(_)('each')(para)(display),
        //invoke execute to add scroll event listener IF conditions are met, remove on resize??
        $cb = twicedefer(invokeMethod)('execute')(eventing('scroll', [], _.throttle(cb, 100), window)),
		addElip = ptL(_.every, [readmoretarget], getResult),
		enableElip = _.compose(ptL(utils.doWhen, readmoretarget, ptL(doElip, para[0]))),
		addScrollHandlers = ptL(_.every, [readmoretarget, Modernizr.ellipsis, Modernizr.touchevents], getResult),
        enableScrollHandlers = _.compose(ptL(utils.doWhen, addScrollHandlers, $cb)),
        threshold = Number(query.match(new RegExp('[^\\d]+(\\d+)[^\\d]+'))[1]),
        getPredicate = (function () {
			if (mq) {
				return ptL(Modernizr.mq, query);
			} else {
				return ptL(isBig, threshold);
			}
		}()),
        
        memoFactory = function (target, copy) {
			var hyperlinks = {},
				ran = false,
				ret = {
                    //callback for str.replace
					set: function () {
						ran = true;
						return '|';
					},
					unset: function () {
						return '<strong>$1</strong>';
					},
                    //callback for str.replace
					store: function (match, attrs, content) {
						content = content.replace(/&nbsp;/, ' ');
						hyperlinks[content] = attrs;
						return '[' + content + ']';
					},
                    //callback for str.replace
					retrieve: function (match, content) {
						return '<a' + hyperlinks[content] + '>' + content + '</a>';
					},
					revert: function (i, cb) {
						if (ran) {
							ran = false;
							target.innerHTML = copy;
							hyperlinks = {};
						}
						if (i > 0) {
							cb();
						}
					}
				};
			return ret;
		},
           
        doSplitz = function (count) {
            return function (target, copy) {
				var doReplace = thrice(replacer),
					memo = memoFactory(target, copy),
					//pipe is used to surround text that will be emphasised so <strong>Sampson</strong> becomes |Strong|
					getStrong = doReplace(new RegExp('<\\/?[^a>]+>', 'g'))(memo.set),
					//a la Markdown links take this form [linked text](link URL) so replace <a href ="/path">My Text</a> with [My Text](href ="/path")
					getLinks = doReplace(new RegExp('<a([^>]*)>([^<]+)<\\/a>', 'g'))(memo.store), //store hyperlinks attributes
					setStrong = doReplace(new RegExp('\\|(.+?)\\|', 'g'))('<strong>$1</strong>'),
					setLinks = doReplace(new RegExp('\\[(.+?)\\]', 'g'))(memo.retrieve),
					input = _.compose(getStrong,  getLinks),
					output = _.compose(setStrong, setLinks),
					exec = function () {
						var face = utils.getComputedStyle(target, 'font-family').split(',')[0],
							size = Math.round(parseFloat(utils.getComputedStyle(target, 'font-size'))),
							splitter = window.gAlp.Splitter();
						target.innerHTML = input(target.innerHTML);                      
						splitter.init(target, face.replace('\\', ''), size);
						target.innerHTML = output(splitter.output('span'));
						utils.show(target);
						count -= 1;
					};
				return {
					execute: function () {
						return memo.revert(count, exec);
					}
				};
			};
		}, //split
        
        do_split = doSplitz(2),
        paras = utils.getByClass('.intro')[0] || utils.getByTag('article', document)[0],
		// now re-check on scroll
		splitHandler = function () {
            var command = do_split.apply(null, arguments),
                handler = function () {
                    command.execute();
				};
            handler();
            eventing('resize', [], _.debounce(handler, 2000, true), window).execute();
		},
		split_handler = function (p) {
			splitHandler(p, p.innerHTML);
		};
    
	if (touchevents && cssanimations && !(_.isEmpty(verbose)) && !getPredicate()) {
		_.each(paras.getElementsByTagName('p'), split_handler);
	}
    
    enableScrollHandlers();
    window.setTimeout(enableElip, 3333);
    
}(Modernizr.mq('only all'), '(min-width: 769px)', Modernizr.touchevents, Modernizr.cssanimations));