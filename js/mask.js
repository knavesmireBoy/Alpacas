/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global gAlp: false */
/*global _: false */
/*global setTimeout: false */
/*global viewportSize: false */
if (!window.gAlp) {
	window.gAlp = {};
}
(function (doc, mask_target, swapper, states, mq, query, cssmask, cssanimations, touchevents, report) {
	"use strict";

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function always(VALUE) {
		return function () {
			return VALUE;
		};
	}

	function toCamelCase(variable) {
		return variable.replace(/-([a-z])/g, function (str, letter) {
			return letter.toUpperCase();
		});
	}

	function setter(o, k, v) {
		o[k] = v;
	}

	function replacer(str, replacement, reg) {
		return str.replace(reg, replacement);
	}

	function invoke(ctxt, m, k, v) {
		if (!k) {
			return;
		}
		if (!m) {
			setter(ctxt, toCamelCase(k), v);
			//setter(ctxt, k.toCamelCase('-'), v);
		} else {
			ctxt[m].call(ctxt, k, v);
		}
	}

	function construct(drill, args, o) {
		var context = drill(o);
		_.each(_.invert(_.rest(args)[0]), _.partial(invoke, context, _.head(args)));
	}

	function isBig(n) {
		return window.viewportSize.getWidth() > n;
	}

	function helper(el, node, klas) {
		var p = el.getElementsByTagName(node);
		return _.filter(p, function (para) {
			return !gAlp.Util.getClassList(para).contains(klas);
		})[0];
	}

	function handlerwrap(ptlHandler, ptl, el) {
		var res = helper(el, 'p', 'show');
		gAlp.Util.addClass('elip', res);
		return ptlHandler(el, _.compose(_.partial(handlerwrap, ptlHandler, ptl, el), _.partial(ptl, res)));
	}
	var utils = gAlp.Util,
		curry2 = utils.curryTwice(),
		curry3 = utils.curryThrice(),
		ptL = _.partial,
		$ = function (str) {
			return document.getElementById(str);
		},
		//paras = $('article').getElementsByTagName('p'),
		paras = utils.getByClass('.intro')[0] || utils.getByTag('article', document)[0],
        verbose = utils.getByClass('.verbose'),
		//con = window.console.log.bind(window),
		threshold = Number(query.match(new RegExp('[^\\d]+(\\d+)[^\\d]+'))[1]),
		getIndex = (function () {
			if (mq) {
				return function () {
					return Number(Modernizr.mq(query));
				};
			}
			return function () {
				return isBig(threshold) ? 1 : 0;
			};
		}()),
		getPredicate = (function () {
			if (mq) {
				return ptL(Modernizr.mq, query);
			} else {
				return ptL(isBig, threshold);
			}
		}()),
		noScrollBars = ptL(gAlp.Util.gtThan, viewportSize.getHeight, always(document.body.clientHeight)),
		//getPredicate = utils.getBest(always(mq), [ptL(Modernizr.mq, query), ptL(isBig, threshold)]),
		switchAction = function (collection, bool) {
			var i = bool ? Number(!getIndex()) : getIndex();
			return collection[i];
		},
		prepAction = function () {
			getPredicate = _.negate(getPredicate);
			return switchAction.apply(null, arguments);
		},
		doConstruct = _.wrap(construct, function (wrapped, drill, args, o) {
			wrapped(drill, args, o);
			return o;
		}),
		prepSetStyles = function (config) {
			//ie < 9 doesn't support setProperty and they don't support media queries (mq)
			var method = mq ? 'setProperty' : '';
			return ptL(doConstruct, utils.drillDown(['style']), [method, config]);
		},
		constr,
		player,
        memoFactory = function (target, copy) {
			var hyperlinks = {},
				ran = false,
				ret = {
					set: function () {
						ran = true;
						return '|';
					},
					unset: function () {
						return '<strong>$1</strong>';
					},
					store: function (match, attrs, content) {
						content = content.replace(/&nbsp;/, ' ');
						hyperlinks[content] = attrs;
						return '[' + content + ']';
					},
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
		//anCr = curryRight(utils.setAnchor)(utils.getNewElement)(null),
        anCr = utils.append(),
		doSplitz = function (count) {
			return function (target, copy) {
				var doReplace = curry3(replacer),
					memo = memoFactory(target, copy),
					//pipe is used to surround text that will be emphasised so <strong>Sampson</strong> becomes |Strong|
					getStrong = doReplace(new RegExp('<\\/?[^a>]+>', 'g'))(memo.set),
					/*a la Markdown links take this form [linked text](link URL) so replace <a href ="/path">My Text</a> with [My Text](href ="/path")*/
					getLinks = doReplace(new RegExp('<a([^>]*)>([^<]+)<\\/a>', 'g'))(memo.store), //store hyperlinks attributes
					setStrong = doReplace(new RegExp('\\|(.+?)\\|', 'g'))('<strong>$1</strong>'),
					setLinks = doReplace(new RegExp('\\[(.+?)\\]', 'g'))(memo.retrieve),
					input = _.compose(getStrong, getLinks),
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
					},
					execute = function () {
						return memo.revert(count, exec);
					};
				return {
					execute: execute
				};
			};
		}, //split
        do_split = doSplitz(paras.length * 2),
        readmoretarget = utils.getByClass('read-more-target')[0],
		parag = readmoretarget ? readmoretarget.getElementsByTagName('p') : [],
		ellipsis_handler = ptL(handlerwrap, ptL(utils.addHandler, 'touchend'), utils.show),
		addElip = ptL(_.every, [readmoretarget], getResult),
		enableElip = _.compose(ptL(utils.doWhen, addElip, ptL(utils.addClass, 'elip', parag[0])));
        
		var addElipHandler = ptL(_.every, [noScrollBars, readmoretarget, Modernizr.ellipsis, Modernizr.touchevents], getResult),
		addScrollHandlers = ptL(_.every, [readmoretarget, Modernizr.ellipsis, Modernizr.touchevents], getResult),
		enableElipHandler = _.compose(ptL(utils.doWhen, addElipHandler, ptL(ellipsis_handler, readmoretarget))),
		scroller = function (percent) {
			var setScrollHandlers = ptL(utils.setScrollHandlers, parag, curry2(utils.getScrollThreshold)(percent)),
				enableScrollHandlers = _.compose(ptL(utils.doWhen, addScrollHandlers, setScrollHandlers));
			enableScrollHandlers();
			enableElipHandler();
			enableElip();
			//parag[0].innerHTML = document.documentElement.className;
		},
		// now re-check on scroll
		splitHandler = function () {
            var command = do_split.apply(null, arguments),
                handler = function () {
                    command.execute();
                    //scroller(0.2);
                    setTimeout(ptL(scroller, 0.2), 3333);
				};
            handler();
			return utils.addHandler('resize', window, _.debounce(handler, 2000, true));
		},
		split_handler = function (p) {
			splitHandler(p, p.innerHTML);
		},
		swapimg = utils.getByClass("swap"),
		getKid = function () {
			return utils.getDomChild(utils.getNodeByTag('img'))(mask_target.firstChild);
		},
		kid = getKid(),
		//https://stackoverflow.com/questions/28417056/how-to-target-only-ie-any-version-within-a-stylesheet
		ie6 = utils.getComputedStyle(kid, 'color') === 'red' ? true : false,
		ie7 = utils.getComputedStyle(kid, 'color') === 'blue' ? true : false,
		factory = function (cond) {
			var activate = function () {
					utils.makeElement(prepSetStyles({
						display: "block"
					}), always(mask_target)).add();
				},
				standard = function () {
					var orig = utils.getDomChild(utils.getNodeByTag('img'))(mask_target),
						mask_path = ie6 ? '_mask8.png' : '_mask.png',
						config = {
							alt: '',
							src: utils.invokeRest('replace', orig.getAttribute('src'), /\.\w+$/, mask_path)
						},
						exec = function () {
							var setAttrs = utils.setAttrsFix(ie6 || ie7),
								//margin = ie6 ? "-" + mask_target.currentStyle.width : "-100%";
								margin = "-100%";
							utils.makeElement(prepSetStyles({
								"margin-right": margin
							}), ptL(setAttrs, always(true), 'setAttribute', config), anCr(mask_target), always(kid)).add();
							setTimeout(activate, 500);
						};
					/*
					https://stackoverflow.com/questions/7715562/css-style-property-names-going-from-the-regular-version-to-the-js-property-ca
					Use camelCase if setting a property directly on the style object style['marginRight] = '-100%'
					but CSSStyleDeclaration.style.setProperty accepts css/hyphen type property names without conversion
					to camelCase*/
					return {
						init: function () {
							if (getPredicate()) {
								return this.execute;
							}
							getPredicate = _.negate(getPredicate);
							return activate;
						},
						execute: function () {
							try {
								utils.highLighter.perform();
								exec();
                                //report.innerHTML = mask_target.childNodes.length;
							} catch (e) {
								report.innerHTML = e.message;
							}
						},
						undo: function () {
							mask_target.removeChild(utils.getNextElement(orig.nextSibling));
						}
					};
				},
				swap = function () {
					var config = {
							src: "../images/honcho.jpg",
							alt: "Alpacas sitting on ground"
						},
						setAttrs = utils.setAttrsFix(ie6 || ie7),
						render = _.compose(ptL(utils.addClass, 'swap'), ptL(setAttrs, always(true), 'setAttribute', config), anCr(mask_target)),
						oldel;
					return {
						init: function (outcomes) {
							if (!getPredicate()) {
								return prepAction(outcomes, true);
							}
							return activate;
						},
						execute: function () {
							activate();
							oldel = utils.removeNodeOnComplete(getKid());
							render('img');
							utils.highLighter.perform();
						},
						undo: function () {
							utils.removeNodeOnComplete(getKid());
							anCr(mask_target)(oldel);
						}
					};
				};
			return utils.getBest(cond, [swap, standard])();
		};
	if (!cssmask || swapimg[0]) {
		constr = function () {
			return factory(always(swapper));
		};
		player = function (command) {
			var outcomes = swapimg[0] ? [command.undo, command.execute] : [command.execute, command.undo],
				handler = function () {
					if (!getPredicate()) {
						prepAction(outcomes, true)();
					}
				};
			utils.addHandler('resize', window, _.throttle(handler, 66));
			command.init(outcomes)();
		};
		//document.getElementById('article').getElementsByTagName('p')[0].innerHTML = document.documentElement.className;
        
		utils.addHandler('load', window, ptL(player, constr()));
	} //cssmask
	if (touchevents && cssanimations && !(_.isEmpty(verbose)) && !getPredicate()) {
		//var p = document.getElementById('article').querySelector('p');
		//p.innerHTML = document.documentElement.className;
		_.each(paras, split_handler);
	}
}(document, document.getElementsByTagName('aside')[0], document.getElementById('about_us'), ['unmask', 'mask'], Modernizr.mq('only all'), '(min-width: 769px)', Modernizr.cssmask, Modernizr.cssanimations, Modernizr.touchevents, document.getElementsByTagName('h2')[0]));