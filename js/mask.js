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
(function (doc, mask_target, swapper, states, mq, query, cssmask, cssanimations, touchevents, report) {
	"use strict";

	function always(VALUE) {
		return function () {
			return VALUE;
		};
	}

	function isBig(n) {
		return window.viewportSize.getWidth() >= n;
	}

	function invokeRest(m, o) {
		return o[m].apply(o, _.rest(arguments, 2));
	}

	function applyArg(f, arg) {
		arg = _.isArray(arg) ? arg : [arg];
		return f.apply(null, arg);
	}

	function add(a, b) {
		return a + b;
	}

	function doMethod(o, v, p) {
		//console.log(arguments);
		return o[p] && o[p](v);
	}

	var utils = gAlp.Util,
		ptL = _.partial,
		//getPredicate = utils.getBest(always(mq), [ptL(Modernizr.mq, query), ptL(isBig, threshold)]),
		//con = window.console.log.bind(window),
		curryFactory = utils.curryFactory,
		twice = curryFactory(2),
		eventing = utils.eventer,
		threshold = Number(query.match(new RegExp('[^\\d]+(\\d+)[^\\d]+'))[1]),
		getIndex = (function () {
			if (mq) {
				return function () {
					return isBig(threshold) ? 1 : 0;
					//return Modernizr.mq(query) ? 1 : 0
				};
			}
			return function () {
				return isBig(threshold) ? 1 : 0;
			};
		}()),
		getPredicate = (function () {
			if (mq) {
				return ptL(isBig, threshold);
				//return ptL(Modernizr.mq, query);//fails in Opera < 10
			} else {
				return ptL(isBig, threshold);
			}
		}()),
		switchAction = function (collection, bool) {
			var i = bool ? Number(!getIndex()) : getIndex();
			return collection[i];
		},
		prepAction = function () {
			getPredicate = _.negate(getPredicate);
			return switchAction.apply(null, arguments);
		},
		constr,
		player,
		anCr = utils.append(),
		anCrIn = utils.insert(),
		swapimg = utils.getByClass("swap"),
		getKid = function () {
			return utils.getDomChild(utils.getNodeByTag('img'))(mask_target.firstChild);
		},
		kid = getKid(),
		//https://stackoverflow.com/questions/28417056/how-to-target-only-ie-any-version-within-a-stylesheet
		ie6 = utils.getComputedStyle(kid, 'color') === 'red' ? true : false,
		intro = "Having worked together on a number of print projects I was approached by Sylvia Sharpe of the <a href= 'https://yorkminster.org/get-involved/donate/york-minster-fund/' target='_blank'>York Minster Fund</a> to work on a website that would support her post-retirement venture, breeding and rearing Alpacas. For this site learning javascript was a requirement as navigating a picture gallery was firmly on the wish list. Jeremy Keith's recently published <a href='https://domscripting.com/book/' target='_blank'>Dom Scripting</a> was simply the right book at the right time. It was a bible of best practice and remains a great introduction for crafting bespoke websites. The Alpacas were packed off elsewhere so the original site is sadly no longer hosted at www.granaryalpacas.co.uk, but it would have looked like this the last time I worked on it in <a href='https://knavesmireboy.github.io/legacy_alpacas/' target='_blank'>2011</a>. This responsive version has been a great playground for a exploring newer css techniques.",
		factory = function (cond) {
			var activate = ptL(utils.doMap, mask_target, [
					[
						['display', 'block']
					]
				]),
				standard = function () {
					var orig = utils.getDomChild(utils.getNodeByTag('img'))(mask_target),
						mask_path = ie6 ? '_mask8.png' : '_mask.png',
						src = invokeRest('replace', orig.getAttribute('src'), /\.\w+$/, mask_path),
						exec = function () {
							_.compose(twice(utils.doMap)([
								['alt', ''],
								['src', src],
								[
									["margin-right", "-100%"]
								]
							]), anCr(mask_target), getKid)();
							window.setTimeout(activate, 500);
						};
					/*
					https://stackoverflow.com/questions/7715562/css-style-property-names-going-from-the-regular-version-to-the-js-property-ca
					Use camelCase if setting a property directly on the style object style['marginRight] = '-100%'
					but CSSStyleDeclaration.style.setProperty accepts css/hyphen type property names without conversion
					to camelCase*/
					return {
						init: function (outcomes) {
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
								//report.innerHTML = mask_target.children.length;
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
					var src = ['src', "../images/honcho.jpg"],
						alt = ['alt', "Alpacas sitting on ground"],
						render = _.compose(ptL(utils.addClass, 'swap'), twice(utils.doMap)([src, alt]), anCr(mask_target)),
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
			return utils.getBestOnly(cond, [swap, standard])(); //return command
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
			eventing('resize', [], _.throttle(handler, 66), window).execute();
			command.init(outcomes)();
		};
		eventing('load', [], ptL(player, constr()), window).execute();
	} //cssmask
	(function () {
		var el = utils.findByTag(0)('header'),
			box = el.getBoundingClientRect(),
			w = box.width || box.right - box.left,
			home = 'url(assets/header_ipad.png)',
			other = 'url(../assets/header_ipad.png)',
			swap = utils.$('welcome') ? home : other,
            params = utils.getUrlParameter();

		if (w > 960) {
			utils.doMap(el, [
				[
					['background-image', swap]
				]
			]);
		}
		if (params.has('cv')) {
			var href = ['href', '.'],
				exit = ['id', 'exit'],
				cross = ['txt', 'close'],
                ancr = utils.findByClass('intro'),
                ref = utils.getChild(ancr);
			_.compose(twice(utils.doMap)([
				['txt', intro]
			]), twice(applyArg)('p'), anCr, _.partial(utils.climbDom, 1), twice(utils.doMap)([href, exit, cross]), twice(applyArg)('a'), anCr, twice(utils.doMap)([
				['id', 'intro']
			]), anCrIn(ref, ancr))('div');            
		}
	}());
}(document, document.getElementsByTagName('aside')[0], document.getElementById('about_us'), ['unmask', 'mask'], Modernizr.mq('only all'), "(min-width: 769px)", Modernizr.cssmask, Modernizr.cssanimations, Modernizr.touchevents, document.getElementsByTagName('h2')[0]));
//document.getElementById('article').getElementsByTagName('p')[0].innerHTML = document.documentElement.className;