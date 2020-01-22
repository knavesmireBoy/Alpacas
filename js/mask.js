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

	function always(VALUE) {
		return function () {
			return VALUE;
		};
	}

	function simpleInvoke(o, m, arg) {
		return o[m](arg);
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

	function curryRight(fn) {
		var args = _.rest(arguments);
		if (args.length >= fn.length) {
			return fn.apply(null, gAlp.Util.reverse(args));
		} else {
			return function () {
				return curryRight.apply(null, [fn].concat(args, gAlp.Util.reverse(arguments)));
			};
		}
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
	var utils = gAlp.Util,
		curry2 = utils.curryTwice(),
		curry3 = utils.curryThrice(),
		ptL = _.partial,
		$ = function (str) {
			return document.getElementById(str);
		},
        paras = $('article').getElementsByTagName('p'),
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
		readmoretarget = utils.getByClass('read-more-target')[0],
		constr,
		player,
		memoFactory = function (target, copy) {
			var hyperlinks = {},
                ran = false,
                ret = {
                    set: function(){
                        ran = true;
                        return '|';
                    },
                    unset: function(){
                        return '<strong>$1</strong>'
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
					if(ran){
                        ran = false;
                        target.innerHTML = copy;
                        hyperlinks = {};
                    }
                    if(i > 0){
                        cb();
                    }
				},
                
			};
			return ret;
		},
		anCr = curryRight(utils.setAnchor)(utils.getNewElement)(null),
		doSplitz = function(count){
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
                exec = function(){
                    var face = utils.getComputedStyle(target, 'font-family').split(',')[0],
						size = Math.round(parseFloat(utils.getComputedStyle(target, 'font-size'))),
						splitter = window.gAlp.Splitter();
					target.innerHTML = input(target.innerHTML);
					splitter.init(target, face.replace('\\', ''), size);
					target.innerHTML = output(splitter.output('span'));
                    utils.show(target);
                    count -=1;
                },
				execute = function () {
                    return memo.revert(count, exec);
				};
			return {
				execute: execute
			};
            };
		}, //split
        do_split = doSplitz(paras.length*2),
		// now re-check on scroll
		splitHandler = function () {
			var command = do_split.apply(null, arguments),
				handler = function () {
                    command.execute();
				};
			try {
				if (window.innerHeight && readmoretarget) {
					utils.setScrollHandlers(readmoretarget.getElementsByTagName('p'), curry2(utils.getScrollThreshold)(0.2));
					utils.addClass('scroll', $('main'));
				}
			} catch (er) {
				report.innerHTML = er;
			}
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
		highLighter = {
			perform: function () {
				if (!utils.hasFeature('nthchild')) {
					this.perform = function () {
						var getBody = curry3(simpleInvoke)('body')('getElementsByTagName'),
							getLinks = curry3(simpleInvoke)('a')('getElementsByTagName'),
							getTerm = _.compose(curry2(utils.getter)('id'), ptL(utils.byIndex, 0), getBody),
							links = _.compose(getLinks, curry3(simpleInvoke)('nav')('getElementById'))(document),
							found = ptL(_.filter, _.toArray(links), function (link) {
								return new RegExp(link.innerHTML.replace(/ /gi, '_'), 'i').test(getTerm(document));
							});
						_.compose(ptL(utils.addClass, 'current'), ptL(utils.byIndex, 0), found)();
					};
				} else {
					this.perform = function () {};
				}
				this.perform();
			}
		},
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
								margin = ie6 ? "-" + mask_target.currentStyle.width : "-100%";
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
								highLighter.perform();
								exec();
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
							highLighter.perform();
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
			var outcomes = [command.undo, command.execute],
				handler = function () {
					if (!getPredicate()) {
						prepAction(outcomes, true)();
					}
				};
			utils.addHandler('resize', window, _.throttle(handler, 66));
			command.init(outcomes)();
		};
		utils.addHandler('load', window, ptL(player, constr()));
	} //cssmask
    if (touchevents && cssanimations && !(_.isEmpty(verbose))) {
        
        var p = document.getElementById('article').querySelector('p');
       p.innerHTML = document.documentElement.className;
        _.each(paras, split_handler);
	}
}(document, document.getElementById('aside'), document.getElementById('about_us'), ['unmask', 'mask'], Modernizr.mq('only all'), '(min-width: 769px)', Modernizr.cssmask, Modernizr.cssanimations, Modernizr.touchevents, document.getElementsByTagName('h2')[0]));