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

	function toCamelCase(variable) {
		return variable.replace(/-([a-z])/g, function (str, letter) {
			return letter.toUpperCase();
		});
	}

	function setter(o, k, v) {
		o[k] = v;
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
		ptL = _.partial,
        /*
        con = function(a){
            console.log(a);
            return a;
        },
        */
		//getPredicate = utils.getBest(always(mq), [ptL(Modernizr.mq, query), ptL(isBig, threshold)]),
		//con = window.console.log.bind(window),
        //event_actions = ['preventDefault', 'stopPropagation', 'stopImmediatePropagation'],
		eventing = utils.eventer,
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
        anCr = utils.append(),
		swapimg = utils.getByClass("swap"),
		getKid = function () {
			return utils.getDomChild(utils.getNodeByTag('img'))(mask_target.firstChild);
		},
		kid = getKid(),
		//https://stackoverflow.com/questions/28417056/how-to-target-only-ie-any-version-within-a-stylesheet
		ie6 = utils.getComputedStyle(kid, 'color') === 'red' ? true : false,
		factory = function (cond) {
			var activate = function () {
                
					utils.makeElement(prepSetStyles({
						display: "block"
					}), always(mask_target)).add();
                
                
                //utils.doMap(mask_target, [['display', 'block']]);
				},
                
				standard = function () {
					var orig = utils.getDomChild(utils.getNodeByTag('img'))(mask_target),
						mask_path = ie6 ? '_mask8.png' : '_mask.png',
						config = {
							alt: '',
							src: utils.invokeRest('replace', orig.getAttribute('src'), /\.\w+$/, mask_path)
						},
						exec = function () {
							var setAttrs = utils.setAttrsFix(ie6),
								//margin = ie6 ? "-" + mask_target.currentStyle.width : "-100%";
								margin = "-100%";
                            
							utils.makeElement(prepSetStyles({
								"margin-right": margin
							}), ptL(setAttrs, always(true), 'setAttribute', config), anCr(mask_target), always(kid)).add();
                            
                           // utils.doMap(mask_target, [[["margin-right", "-100%"]]]);
                            
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
            eventing('resize', [], _.throttle(handler, 66), window).execute();
			command.init(outcomes)();
		};
        eventing('load', [], ptL(player, constr()), window).execute();

	} //cssmask
}(document, document.getElementsByTagName('aside')[0], document.getElementById('about_us'), ['unmask', 'mask'], Modernizr.mq('only all'), '(min-width: 769px)', Modernizr.cssmask, Modernizr.cssanimations, Modernizr.touchevents, document.getElementsByTagName('h2')[0]));
//document.getElementById('article').getElementsByTagName('p')[0].innerHTML = document.documentElement.className;