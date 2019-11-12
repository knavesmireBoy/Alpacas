/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global gAlp: false */
/*global _: false */
/*global setTimeout: false */
if (!window.gAlp) {
	window.gAlp = {};
}
(function(doc, mask_target, swapper, states, mq, query, cssmask, cssanimations, touchevents, report) {
	"use strict";
	/*
	var COR = {
		init: function (strategy, key, exec) {
			this.strategy = strategy;
			this.exec = exec;
			this.key = key;
			return this;
		},
		setSuccessor: function (s) {
			this.successor = s;
		},
		handle: function () {
			if (this.strategy.apply(this, arguments)) {
				return this.exec.apply(this, arguments);
			} else if (this.successor) {
				return this.successor.handle.apply(this.successor, arguments);
			}
		}
	};
    
    function setUp(invoke, vals) {
		var i,
			L = vals.length,
			collect = [];
		for (i = 0; i < L; i += 1) {
			collect.push(_.extend({}, COR).init(vals[i][0], vals[i][1], invoke));
			if (i) {
                collect[i - 1].setSuccessor(collect[i]);
            }
		}
		return collect[0];
	}
    
    function invoke1(ctxt, m, k, v) {
		if (k) {
			ctxt[m].call(ctxt, k, v);
		}
	}




	function constructValidate(drill, args, o) {
		var context = drill(o),
			checker = _.partial(invoke, context, _.head(args)),
			chain = setUp(checker, vals);
		_.each(_.invert(_.rest(args)[0]), chain.handle, chain);
	}
    */
	String.prototype.capitalize = function() {
		var res = this.split(' '),
			mapper = function(str) {
				return str.charAt(0).toUpperCase() + str.slice(1);
			};
		res = res.map(mapper);
		return res.join(' ');
	};

	function undef(x) {
		return typeof(x) === 'undefined';
	}

	function returnIndex(i, func) {
		return func.apply(func, _.rest(arguments, 2))[i];
	}

	function always(VALUE) {
		return function() {
			return VALUE;
		};
	}

	function simpleInvoke(o, m, arg) {
		return o[m](arg);
	}

	function toCamelCase(variable) {
		return variable.replace(/-([a-z])/g, function(str, letter) {
			return letter.toUpperCase();
		});
	}

	function setter(o, k, v) {
		o[k] = v;
	}

	function getDimensions(dim) {
		// dim = dim.capitalize();
		return window['inner' + dim] || document.documentElement['client' + dim] || document.body['client' + dim];
	}

	function getWidth(el) {
		if (el.getBoundingClientRect && _.isFunction(el.getBoundingClientRect)) {
			var box = el.getBoundingClientRect();
			return box.width || (box.right - box.left);
		} else {
			try {
				report.innerHTML = gAlp.Util.getComputedStyle(el, 'width');
			} catch (e) {
				report.innerHTML = e.message();
			}
			return getDimensions('Width');
		}
	}

	function setMargin(el) {
		var w = getWidth(el.parentNode.parentNode);
		el.style.marginRight = w ? "-" + w + "px" : "-100%";
		//css-101.org/negative-margin/
		//btw: increasing the value (eg -120%) has no effect in ie6/7
		el.style.marginRight = "-100%";
	}

	function awaitingTarget(m) {
		var args = _.rest(arguments);
		return function(o) {
			return o[m].apply(o, args);
		};
	}

	function curryLeft(fn) {
		var args = _.rest(arguments);
		if (args.length >= fn.length) {
			return fn.apply(null, args);
		} else {
			return function() {
				return curryLeft.apply(null, [fn].concat(args, _.toArray(arguments)));
			};
		}
	}

	function curryRight(fn) {
		var args = _.rest(arguments);
		if (args.length >= fn.length) {
			return fn.apply(null, gAlp.Util.reverse(args));
		} else {
			return function() {
				return curryRight.apply(null, [fn].concat(args, gAlp.Util.reverse(arguments)));
			};
		}
	}

	function setAnchor(anchor, refnode, strategy) {
		return _.compose(_.partial(gAlp.Util.render, anchor, refnode), strategy);
	}

	function doEachFactory(config, bound, target, bool) {
		//ie 6 & 7 have issues with setAttribute, set props instead
		if (bool) {
			return _.partial(_.extendOwn, target, config);
		}
		return function() {
			_.forEach(_.invert(config), bound);
		};
	}

	function setFromFactory(bool) {
		return function(validate, method, config, target) {
			var unbound = function() {
					target[method].apply(target, arguments);
				},
				bound;
			try {
				bound = _.bind(target[method], target);
			} catch (e) {
				bound = unbound;
				//$('report').innerHTML = '!'+e.message;
			}
			bound = unbound;
			bound = _.partial(gAlp.Util.invokeWhen, validate, bound);
			doEachFactory(config, bound, target, bool)();
			return target;
		};
	}

	function invoke(ctxt, m, k, v) {
		if (!k) {
			return;
		}
		if (!m) {
			setter(ctxt, toCamelCase(k), v);
		} else {
			ctxt[m].call(ctxt, k, v);
		}
	}

	function construct(drill, args, o) {
		var context = drill(o);
		_.each(_.invert(_.rest(args)[0]), _.partial(invoke, context, _.head(args)));
	}

	function drillDown(arr) {
		var a = arr && arr.slice && arr.slice();
		if (a && a.length > 0) {
			return function inner(o, i) {
				i = isNaN(i) ? 0 : i;
				var prop = a[i];
				if (prop && a[i += 1]) {
					return inner(o[prop], i);
				}
				return o[prop];
			};
		}
		return function(o) {
			return o;
		};
	}

	function isBig(n) {
		return window.viewportSize.getWidth() > n;
	}
	var curry2 = gAlp.Util.curry2,
		curry3 = gAlp.Util.curry3,
		$ = function(str) {
			return document.getElementById(str);
		},
		threshold = Number(query.match(/[^\d]+(\d+)[^\d]+/)[1]),
		getIndex = (function() {
			if (mq) {
				return function() {
					return Number(Modernizr.mq(query));
				};
			}
			return function() {
				return isBig(threshold) ? 1 : 0;
			};
		}()),
		getPredicate = (function() {
			if (mq) {
				return _.partial(Modernizr.mq, query);
			} else {
				return _.partial(isBig, threshold);
			}
		}()),
		switchAction = function(collection, bool) {
			var i = bool ? Number(!getIndex()) : getIndex();
			return collection[i];
		},
		prepAction = function() {
			getPredicate = _.negate(getPredicate);
			return switchAction.apply(null, arguments);
		},
		doConstruct = _.wrap(construct, function(wrapped, drill, args, o) {
			wrapped(drill, args, o);
			return o;
		}),
		prepSetStyles = function(config) {
			//ie < 9 doesn't support setProperty just as they don't support media queries (mq)
			var method = mq ? 'setProperty' : '';
			return _.partial(doConstruct, drillDown(['style']), [method, config]);
		},
		constr,
		player,
		anCr = curryRight(gAlp.Util.setAnchor)(gAlp.Util.getNewElement)(null),
		split = function(hyper, paras, target, copy) {
			var store = function(match, attrs, content) {
					content = content.replace(/&nbsp;/, ' ');
					hyper[content] = attrs;
					return '[' + content + ']';
				},
				retrieve = function(match, content) {
					return '<a' + hyper[content] + '>' + content + '</a>';
				},
				//doStrong
				revert = function() {
					target.parentNode.innerHTML = copy;
					target = gAlp.Util.getNextElement($('article').firstChild);
					paras = {};
					hyper = {};
				},
				validate = _.partial(_.negate(_.isEmpty), paras),
				//pipe is used to surround text that will be emphasised so <strong>Sampson</strong> becomes |Strong|
				getStrong = awaitingTarget('replace', /<\/?[^a>]+>/g, '|'),
				/*a la Markdown links take this form [linked text](link URL) so replace <a href ="/path">My Text</a> with [My Text](href ="/path")*/
				getLinks = awaitingTarget('replace', /<a([^>]*)>([^<]+)<\/a>/g, store), //store hyperlinks attributes
				setStrong = awaitingTarget('replace', /\|(.+?)\|/g, '<strong>$1</strong>'),
				setLinks = awaitingTarget('replace', /\[(.+?)\]/g, retrieve),
				input = _.compose(getLinks, getStrong),
				output = _.compose(setLinks, setStrong),
				exec = function(constr) {
					//restrict splitting to a single para
					if (!target || gAlp.Util.getNextElement(target.nextSibling)) {
						return;
					}
					if (Modernizr.mq(query)) {
						gAlp.Util.invokeWhen(validate, revert);
						return;
					}
					var face = gAlp.Util.getComputedStyle(target, 'font-family').split(',')[0],
						size = Math.round(parseFloat(gAlp.Util.getComputedStyle(target, 'font-size'))),
						splitter = constr();
					gAlp.Util.invokeWhen(validate, revert);
					//could be a simple boolean not a property of an object
					paras.p = paras.p || target.innerHTML;
					target.innerHTML = input(target.innerHTML);
					splitter.init(target, face.replace('\\', ''), size);
					target.innerHTML = output(splitter.output('span'));
				};
			return {
				execute: exec
			};
		}, //split
		width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
		height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
		isLandscapeMode = width > height,
		isPortraitMode = height > width,
		count = 2,
		preds = [always(isLandscapeMode), always(isPortraitMode)],
		splitHandler = function() {
			var command = split.apply(null, arguments),
				handler = function() {
					/*
                    if(preds[0]()){
                        count -= 1;
                    }
                    else {
                        preds.reverse();
                    }
					(count > 0) && command.execute(window.gAlp.Splitter);
                    */
					command.execute(window.gAlp.Splitter);
				};
			handler();
			return gAlp.Util.addHandler('resize', window, _.debounce(handler, 66));
		},
		swapimg = gAlp.Util.getByClass("swap"),
		getKid = function() {
			return gAlp.Util.getDomChild(gAlp.Util.getNodeByTag('img'))(mask_target.firstChild);
		},
		kid = getKid(),
		//https://stackoverflow.com/questions/28417056/how-to-target-only-ie-any-version-within-a-stylesheet
		ie6 = gAlp.Util.getComputedStyle(kid, 'color') === 'red' ? true : false,
		ie7 = gAlp.Util.getComputedStyle(kid, 'color') === 'blue' ? true : false,
		highLighter = {
			perform: function() {
				if (!gAlp.Util.hasFeature('nthchild')) {
					this.perform = function() {
						var getBody = curry3(simpleInvoke)('body')('getElementsByTagName'),
							getLinks = curry3(simpleInvoke)('a')('getElementsByTagName'),
							getTerm = _.compose(curry2(gAlp.Util.getter)('id'), _.partial(gAlp.Util.byIndex, 0), getBody),
							links = _.compose(getLinks, curry3(simpleInvoke)('nav')('getElementById'))(document),
							found = _.partial(_.filter, _.toArray(links), function(link) {
								return new RegExp(link.innerHTML.replace(/ /gi, '_'), 'i').test(getTerm(document));
							});
						_.compose(_.partial(gAlp.Util.addClass, 'current'), _.partial(gAlp.Util.byIndex, 0), found)();
					};
				} else {
					this.perform = function() {};
				}
				this.perform();
			}
		},
		factory = function(cond) {
			var activate = function() {
							gAlp.Util.makeElement(prepSetStyles({
								display: "block"
							}), always(mask_target)).add();
						},
                standard = function() {
					var dorender = _.partial(gAlp.Util.render, mask_target, null),
						orig = gAlp.Util.getDomChild(gAlp.Util.getNodeByTag('img'))(mask_target),
						doMask = _.compose(dorender, gAlp.Util.getNewElement),
						mask_path = ie6 ? '_mask8.png' : '_mask.png',
						config = {
							alt: '',
							src: gAlp.Util.invokeRest('replace', orig.getAttribute('src'), /\.\w+$/, mask_path)
						},
						doAttrs = _.partial(gAlp.Util.setAttrs, config),
						execSAFE = function() {
							mask_target.style.display = "block";
							var mask = mask_target.appendChild(kid.cloneNode());
							mask.src = orig.src.replace(/\.\w+$/, '_mask8.png');
							mask.style.marginRight = "-" + mask_target.currentStyle.width;
						},
						exec = function() {
							var setAttrs = setFromFactory(ie6 || ie7),
								margin = ie6 ? "-" + mask_target.currentStyle.width : "-100%";
							gAlp.Util.makeElement(prepSetStyles({
								"margin-right": margin
							}), _.partial(setAttrs, always(true), 'setAttribute', config), anCr(mask_target), always(kid)).add();
							setTimeout(activate, 500);
						};
					/*
					https://stackoverflow.com/questions/7715562/css-style-property-names-going-from-the-regular-version-to-the-js-property-ca
					Use camelCase if setting a property directly on the style object style['marginRight] = '-100%'
					but CSSStyleDeclaration.style.setProperty accepts css/hyphen type property names without conversion
					to camelCase*/
					return {
						init: function() {
							if (!getPredicate()) {
								return this.execute;
							}
							getPredicate = _.negate(getPredicate);
							return activate;
						},
						execute: function() {
							try {
								highLighter.perform();
								//window.alert(report);
								//report.innerHTML = 'from russia with love';
								exec();
							} catch (e) {
								report.innerHTML = e.message;
							}
						},
						undo: function() {
							mask_target.removeChild(gAlp.Util.getNextElement(orig.nextSibling));
						}
					};
				},
				swap = function() {
					var changeView = function(bool, klas, el) {
							var tgt = gAlp.Util.getClassList(el),
								action = _.bind(tgt.toggle, tgt);
							action(klas, bool);
						},
						config = {
							src: "../images/honcho.jpg",
							alt: "Alpacas sitting on ground"
						},
						hide = _.partial(changeView, false, 'desktop'),
						show = _.partial(changeView, true, 'desktop'),
						orig = gAlp.Util.getDomChild(gAlp.Util.getNodeByTag('img'))(mask_target),
						setAttrs = setFromFactory(ie6),
						render = _.compose(_.partial(gAlp.Util.addClass, 'swap'), _.partial(setAttrs, always(true), 'setAttribute', config), anCr(mask_target)),
						oldel;
					return {
						init: function(outcomes) {
							if (getPredicate()) {
								return prepAction(outcomes, true);
							}
							return activate;
						},
						execute: function() {
							activate();
							oldel = gAlp.Util.removeNodeOnComplete(getKid());
							render('img');
							highLighter.perform();
							report.innerHTML = mask_target.childNodes[1].src;
						},
						undo: function() {
							gAlp.Util.removeNodeOnComplete(getKid());
							anCr(mask_target)(oldel);
						}
					};
				};
			return gAlp.Util.getBest(cond, [swap, standard])();
		};
	if (!cssmask || swapimg[0]) {
		constr = function() {
			return factory(always(swapper));
		};
		player = function(command) {
				var outcomes = [command.undo, command.execute],
					handler = function() {
						if (!getPredicate()) {
                            prepAction(outcomes, true)();
						}
					};
				gAlp.Util.addHandler('resize', window, _.throttle(handler, 66));
				command.init(outcomes)();
		};
		gAlp.Util.addHandler('load', window, _.partial(player, constr()));
	} //cssmask
	if (touchevents && cssanimations) {
		var byIndex = _.partial(returnIndex, 0),
			test = $('article').getElementsByTagName('p'),
			para = test ? byIndex(always(test)) : null;
		//invokes handler and adds resize event listener
		if (para) {
			splitHandler({}, {}, para, para.parentNode.innerHTML);
		}
	}
}(document, document.getElementById('aside'), document.getElementById('about_us'), ['unmask', 'mask'], Modernizr.mq('only all'), '(min-width: 769px)', Modernizr.cssmask, Modernizr.cssanimations, Modernizr.touchevents, document.getElementsByTagName('h2')[0]));