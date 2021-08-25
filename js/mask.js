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
		return window.viewportSize.getWidth() > n;
	}
    
    
    function invokeRest(m, o) {
        return o[m].apply(o, _.rest(arguments, 2));
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
					return Modernizr.mq(query) ? 1 : 0;
				};
			}
			return function () {
				return isBig(threshold) ? 1 : 0;
			};
		}()),
        
		getPredicate = (function () {
			if (mq) {
                return ptL(isBig, threshold);
				return ptL(Modernizr.mq, query);//fails in Opera < 10
			} else {
				return ptL(isBig, threshold);
			}
		}()),
	
		switchAction = function (collection, bool) {
			var i = bool ? 0 : 1;
			return collection[i];
		},
		prepAction = function () {
			getPredicate = _.negate(getPredicate);
			return switchAction.apply(null, arguments);
		},
		constr,
		player,
        anCr = utils.append(),
		swapimg = utils.getByClass("swap"),
		getKid = function () {
			return utils.getDomChild(utils.getNodeByTag('img'))(mask_target.firstChild);
		},
		kid = getKid(),
		//https://stackoverflow.com/questions/28417056/how-to-target-only-ie-any-version-within-a-stylesheet
		ie6 = utils.getComputedStyle(kid, 'color') === 'red' ? true : false,
		factory = function (cond) {
			var activate = ptL(utils.doMap, mask_target, [[['display', 'block']]]),
				standard = function () {
					var orig = utils.getDomChild(utils.getNodeByTag('img'))(mask_target),
						mask_path = ie6 ? '_mask8.png' : '_mask.png',
                        src = invokeRest('replace', orig.getAttribute('src'), /\.\w+$/, mask_path),
						exec = function () {
                            _.compose(twice(utils.doMap)([['alt', ''], ['src', src], [["margin-right", "-100%"]]]), anCr(mask_target), getKid)();
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
			return utils.getBestOnly(cond, [swap, standard])();//return command
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
}(document, document.getElementsByTagName('aside')[0], document.getElementById('about_us'), ['unmask', 'mask'], Modernizr.mq('only all'), "(min-width: 769px)", Modernizr.cssmask, Modernizr.cssanimations, Modernizr.touchevents, document.getElementsByTagName('h2')[0]));
//document.getElementById('article').getElementsByTagName('p')[0].innerHTML = document.documentElement.className;