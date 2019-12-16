/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global gAlp: false */
/*global _: false */
(function(doc, visiblity, mq, query, cssanimations, touchevents, report, slide_config, paused_config) {
	"use strict";

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function noOp() {}

	function doOnce() {
		return function(i) {
			return function() {
				var res = i > 0;
				i -= 1;
				return res > 0;
			};
		};
	}

	function isNumber(x) {
		return (_.isNumber(x)) ? x : undefined;
	}

	function isPositive(x) {
		return (x >= 0) ? x : undefined;
	}

	function lessOrEqual(i) {
		return function(x) {
			return (x <= i) ? x : undefined;
		};
	}

	function gtOrEq(i) {
		return function(x) {
			return (x >= i) ? x : undefined;
		};
	}
    
    function add(a, b) {
		return a + b;
	}

	function subtract(x, y) {
		return x - y;
	}

	function divideBy(n) {
		return function(i) {
			return i / n;
		};
	}

	function isEqual(x, y) {
		return x === y;
	}

	function greaterOrEqual(a, b) {
		return getResult(a) >= getResult(b);
	}

	function modulo(n, i) {
		return i % n;
	}

	function simpleinvoke(m, f, v, e) {
		return f(e)[m](v);
	}

	var enter,
        always = gAlp.Util.always,
		thumbnailsListener,
		//https://tutorialzine.com/2014/12/you-dont-need-icons-here-are-100-unicode-symbols-that-you-can-use
		//buttons_save = ['&#x25c0', '&#x25b7', '&#x25ba'],
		isFunction = function(fn, context) {
			return _.isFunction(fn) || isFunction(context[fn]) || isFunction(fn[context]);
		},
		//con = window.console.log.bind(window);
		negate = _.partial(_.negate),
		$ = function(str) {
			return document.getElementById(str);
		},
        drillDown = gAlp.Util.drillDown,
        thunk = gAlp.Util.thunk,
		event$ = drillDown(['target', 'id']),
		getNew = gAlp.Util.getNewElement,
		invokeWhen = gAlp.Util.invokeWhen,
		stringMatch = _.partial(simpleinvoke, 'match'),
		buttonRoutes = _.map([/back/i, /p\w+/i, /Forward/i], function(reg) {
			return _.partial(_.partial(stringMatch, event$), reg);
		}),
		cssopacity = gAlp.getOpacity().getKey(),
		filterSlides = function(el) {
			return !(el.id);
		},
		addingEventRet = function(handler, el) {
			return handler(el).addListener().getElement();
		},
		thumbnails = $('thumbnails'),
		display = 'show',
		playbuttons = ['back', 'play', 'forward'],
		getCurrentSlide = _.partial(gAlp.Util.byIndex, 0, _.partial(gAlp.Util.getByClass, '.show')),
		toLowerCase = _.partial(gAlp.Util.bindSub, 'nodeName', 'toLowerCase'),
		//doLO = _.partial(caller, drillDown(['nodeName', 'toLowerCase']), drillDown(['nodeName'])),
		matchUp = function(pred, f1, f2, str, el) {
			return el && pred(f1(el)(), f2(str, el)());
		},
		isNodeName = _.partial(matchUp, isEqual, toLowerCase, _.partial(gAlp.Util.bindContext, 'toLowerCase')),
		changeView = function(el, bool, klas, method) {
			//el may be a function. eg awaitng the creation of an element
			el = getResult(el);
			var drilled = drillDown(['classList']);
			///bit messy
			if ((method === 'toggle' && !bool) || method !== 'toggle') {
				drilled(el)[method](klas);
			} else {
				drilled(el)[method](klas, bool);
			}
		},
		changeViewWrap = _.wrap(changeView, gAlp.Util.wrapTarget),
		prepareView = gAlp.Util.curry4(changeView),
		getLoc = (function(div, subtract, isGreaterEq) {
			var getThreshold = _.compose(div, subtract);
			/*
            threshold = (box.right - box.left) / 2,
				clicked = e.clientX - box.left;
			return clicked >= threshold;
            */
			//tmp 
			return function(e) {
				try {
					var box = e.target.getBoundingClientRect();
					return isGreaterEq(_.partial(subtract, e.clientX, box.left), _.partial(getThreshold, box.right, box.left));
				} catch (er) {
					return true;
				}
			};
		}(divideBy(2), subtract, greaterOrEqual)),
		prepRoute = gAlp.Util.curry3(gAlp.Util.routeOnEvent)([getLoc, _.negate(getLoc)]),
		getControls = _.partial($, 'controls'),
		doHide = prepareView('remove')(display)(),
		doShow = prepareView('add')(display)(),
		togglePlaying = gAlp.Util.curry4(changeViewWrap)('toggle')('playing')(),
		isInPlay = gAlp.Util.curry4(changeViewWrap)('add')('inplay')(),
		isNotInPlay = gAlp.Util.curry4(changeViewWrap)('remove')('inplay')(),
		doInPlay = _.partial(isInPlay, $('wrap')),
		doNotInPlay = _.partial(isNotInPlay, $('wrap')),
		//use !window.addEventListener to determine early versions of ie(<=8), provides a flag to address setAttribute issues
		//setAttrs = _.partial(gAlp.Util.setAttrsFix(!window.addEventListener), always(true), 'setAttribute'),
		setAttrs = gAlp.Util.setAttributes,
		setText = gAlp.Util.setText,
		curryView = gAlp.Util.curry4(changeViewWrap),
		addMyEvent = gAlp.Util.addEvent,
		getDomTargetImg = gAlp.Util.getDomChild(gAlp.Util.getNodeByTag('img')),
		getDomTargetLink = gAlp.Util.getDomChild(gAlp.Util.getNodeByTag('a')),
		getDomTargetList = gAlp.Util.getDomParent(gAlp.Util.getNodeByTag('li')),
		anCr2Thumbs = gAlp.Util.append()(thumbnails),
		clickHandler = _.partial(gAlp.Util.addHandler, 'click'),
		touchHandler = _.partial(gAlp.Util.addHandler, 'touchend'),
		enterHandler = _.partial(gAlp.Util.addHandler, 'mouseenter'),
		iteratorBridge = function(tgt, predicate, coll) {
			predicate = predicate || always(true);
			coll = gAlp.Util.getCollection.call(_, coll, predicate);
			var index = gAlp.Util.find.call(_, coll, _.partial(isEqual, getDomTargetList(tgt)), 0);
			return gAlp.Iterator(index, coll, always(true), _.partial(modulo, coll.length), always(false));
		},
		countdown = function countdown(cb, x) {
			var doFadeUntil = _.compose(cb, lessOrEqual(100), isPositive, isNumber),
				zero = gtOrEq(0),
				//zero = gAlp.Util.curry2(greaterOrEqual)(0),
				restart = function(c) {
					countdown.progress = window.requestAnimationFrame(c);
				},
				cancel = function() {
					window.cancelAnimationFrame(countdown.progress);
				};

			function counter() {
				if (countdown.resume) {
					countdown.resume = null;
				}
				if (countdown.progress === null) {
					cancel();
					countdown.resume = x;
					return;
				}
				x -= 1;
				doFadeUntil(x);
				if (zero(x)) {
					restart(counter);
				} else {
					x = 360;
					counter();
				}
			} //nested
			return counter;
		},
		playAway = function(doProgress, hasPlayed, pause, resume, slider, doFade, onDone) {
			var pausedEvent,
				play,
				inProgress = _.partial(function(pred) {
					return pred();
				}, doProgress),
				prepPause = function(then, pred) {
					then(pred)();
				},
				handler = touchevents ? touchHandler : clickHandler,
				soPlay = function() {
					/*hasPlayed returns a reference to the function provided to requestAnimation... set below
				it is persisted as a property of the outer function or else hasPlayed returns null*/
					hasPlayed(countdown(_.partial(doFade, onDone, slider.add()), 150));
					play = _.compose(doInPlay, hasPlayed(), resume);
					pausedEvent = _.partial(prepPause, gAlp.Util.getBestRight([pause, play]), inProgress);
					addMyEvent(handler, pausedEvent)(thumbnails);
					play();
				},
				soPause = function() {
					play = _.compose(hasPlayed(), resume);
					gAlp.Util.getBestRight([pause, play])(inProgress)();
				};
			return [soPlay, soPause];
		},
		fadeUntil = function(myopacity, pred, onDone, el, i) {
			var currysetter = gAlp.Util.curry3(gAlp.Util.setter)(myopacity.getValue(i))(cssopacity);
			_.compose(currysetter, _.partial(drillDown(['style']), getDomTargetImg(el)))();
			gAlp.Util.invokeOn(_.partial(thunk, pred, i), _.partial(thunk, onDone, el));
		},
		nodematch = function(el, validator) {
			var res = gAlp.Util.checker(validator)(el),
				isNot = negate(_.isEmpty),
				action = window.alert,
				myalert = _.bind(action, window, res),
				predicate = _.partial(isNot, res);
			return gAlp.Util.getBestRight([myalert, always(res)])(predicate)();
		},
		nodematchBridge = function(validator, e) {
			return nodematch(e.target, validator);
		},
		switchView = function(pairs, deco) {
			deco = deco || _.identity;
			var els = deco(_.values(pairs)),
				klas = deco(_.keys(pairs)),
				toggle = prepareView('toggle');
			toggle(klas[0])()(els[0]);
			toggle(klas[1])()(els[1]);
		},
		prepAttrs = function(o, exclude) {
			return _.omit(o, exclude);
		},
		cloneSlide = function(attrs, deco) {
			var p_attrs = prepAttrs(attrs, 'src'),
				c_attrs = prepAttrs(attrs, 'id'),
				setsrc = _.compose(_.partial(setAttrs, c_attrs), getDomTargetImg),
				clone = gAlp.Util.makeElement(deco || _.identity, _.partial(setAttrs, p_attrs), anCr2Thumbs, getCurrentSlide);
			clone.add = _.wrap(clone.add, function(f) {
				f();
				gAlp.Util.invokeOn(_.partial(negate(_.isEmpty), c_attrs), _.partial(setsrc, clone.get()));
				return clone.get();
			});
			return clone;
		},
		listen = function(createDiv, createButton) {
			var locator = null,
				lis = _.toArray($('thumbnails').getElementsByTagName('li')),
				isImg = gAlp.Util.validator('Please click on an image', _.partial(isNodeName, 'IMG')),
				isPortrait = _.partial(function(el) {
					return gAlp.Util.getClassList(el).contains('portrait');
				}),
				checkIsButton = function(attr, regExp, el) {
					return el[attr].match(regExp);
				},
				setPlayButton = function() {
					return togglePlaying(_.partial($, 'controls'));
				},
				//we want true for touch devices but NOT false otherwise
				touchtoggle = touchevents ? true : undefined,
				toggleStatic = gAlp.Util.curry4(changeViewWrap)('toggle')('static')(touchtoggle),
				isButton = gAlp.Util.validator('Please press a button', _.partial(checkIsButton, 'nodeName', /button/i)),
				preNodeNameBridge = _.partial(nodematchBridge, isButton),
				fadeNow = function(i, el) {
					var currysetter = gAlp.Util.curry3(gAlp.Util.setret)(i)(cssopacity);
					//el.style object would be returned from currysetter, need to return acutal element
					_.compose(currysetter, gAlp.Util.drillDown(['style']))(gAlp.Util.show(el));
					return el;
				},
				fade50 = _.partial(fadeNow, gAlp.getOpacity(50).getValue()),
				//fade101 = _.partial(fadeNow, gAlp.getOpacity(101).getValue()),
				prepNextSlide = function(iterator, slide) {
                    //console.log(arguments)
					var kid = getDomTargetImg(slide.firstChild),
						link = getDomTargetLink(slide.firstChild),
						current = getDomTargetImg(iterator.getCurrent().firstChild),
						getAttrs = gAlp.Util.curry2(gAlp.Util.getter),
						fade100 = _.partial(fadeNow, gAlp.getOpacity(100).getValue());
					//if opacity is set to 1 BEFORE the new image is assigned,
					//a flash of the previous image will be witnessed, nasty
					//DOM0...
                    kid = gAlp.Util.removeNodeOnComplete(kid);
					kid.src = getAttrs('src')(current);
					kid.alt = getAttrs('alt')(current);
					_.compose(_.partial(setAttrs, {
						href: getAttrs('src')(current)
					}))(link);
                    link.appendChild(kid);
                   _.compose(fade100)(kid);
                    
				},
				makeNavListener = function(command, element) {
					//designed to remove pause, mousein, mouseout events post slideshow
					function removingListeners(remover, n) {
						//removes the LAST n listeners that were added
						while (n) {
							remover(0, 1);
							n -= 1;
						}
					}
					gAlp.Intaface.ensures(command, gAlp.Intaface('command', ['execute', 'undo']));
					var hideCurrent = _.compose(doHide, getCurrentSlide),
						advance = _.compose(doShow, command.execute, hideCurrent),
						retreat = _.compose(doShow, command.undo, hideCurrent),
						listener = prepRoute([advance, retreat]);
					locator = locator || _.compose(addMyEvent(clickHandler, listener), _.identity)(element);
					return {
						enter: _.bind(locator.addListener, locator),
						exit: _.partial(removingListeners, gAlp.Util.removeListener(locator)),
						remove: function() {
							locator.remove(locator);
						},
						advance: advance,
						retreat: retreat
					};
				},
				makeNavigator = function(iterator, element, nav) {
					_.extendOwn(nav, makeNavListener(gAlp.Util.getCommand(iterator, 'forward', 'back'), element));
					_.each(['getCurrent', 'getNext', 'getCollection'], _.partial(gAlp.Util.proxy, iterator), nav);
					return nav;
				},
				res,
				tgt;
			////////////////////////////////////////////////////////////////////////////////////
			return function(e) {
				tgt = e.target;
				res = gAlp.Util.checker(isImg)(tgt);
				//report.innerHTML = tgt;
				if (negate(_.isEmpty)(res)) {
					return window.alert(res);
				}
				// window.alert(document.documentElement.className);
				/*▲ &#9650; ► &#9658; ▼ &#9660; ◄ &#9668*/
				var iterator = iteratorBridge(tgt, always(true), lis),
					navigator = makeNavigator(iterator, this, {}),
					machSchau = function(e, bool) {
						var tooltip_timer,
							allow = !touchevents ? 2 : 0,
							enterSlideShow = function() {
								//report.innerHTML = $('controls').className+'^^';
								//dealing with more than one element...
								var stat = prepareView('add')('static')(true),
									nostat = prepareView('remove')('static')(true),
									dotooltip = _.partial(gAlp.Tooltip, $('thumbnails'), ["move mouse in and out of footer...", "...to toggle the display of control buttons"], allow),
									mouseenter = _.partial(enterHandler, _.partial(stat, getControls)),
									mouseleave = _.partial(enterHandler, _.partial(nostat, getControls));
								mouseenter(getControls()).addListener();
								mouseleave($('footer')).addListener();
								toggleStatic(getControls());
								navigator.remove();
								tooltip_timer = dotooltip();
							},
							swapImgCB = _.compose(_.isNumber, lessOrEqual(0)),
							fader = _.partial(fadeUntil, gAlp.getOpacity(), swapImgCB),
							doanime = gAlp.Util.doGetSet(countdown, 'anime'),
							doprog = gAlp.Util.doGetSet(countdown, 'progress'),
							best = gAlp.Util.getBest,
							doNull,
							once = doOnce(),
							addMouseListeners = _.partial(best, _.partial(thunk, once(1))),
							initToolTip = _.partial(best, _.partial(thunk, once(1))),
							doSlideShow = _.partial(best, _.partial(thunk, once(1)));
						machSchau = function(e, bool) { //memo
							if (!bool) {
								var predicate = gAlp.Util.getPredicate(getCurrentSlide(), isPortrait),
									playiterator = iteratorBridge(getDomTargetImg(getCurrentSlide()), predicate, lis),
									navcommand = gAlp.Util.getCommand(makeNavigator(playiterator, thumbnails, {}), 'enter', 'exit'),
									copier = _.partial(prepNextSlide, playiterator),
									showNext = _.compose(doShow, playiterator.getNext),
									next = _.compose(showNext, doHide, getCurrentSlide),
									endgame = _.compose(next, copier),
									theorient = isPortrait(getCurrentSlide()),
									pauser = cloneSlide(paused_config(theorient), fade50),
									slider = cloneSlide(slide_config(), curryView('remove')(display)(true)),
									pause = _.compose(setPlayButton, pauser.add, _.partial(doprog, null)),
									resume = _.compose(setPlayButton, pauser.remove, _.partial(doprog, 1)),
									touchStatic = _.partial(invokeWhen, always(touchevents), _.partial(toggleStatic, e.target.parentNode)),
									maybeButton = gAlp.Util.doWhenWait(setPlayButton)(doprog),
									cleanup = _.compose(touchStatic, doNotInPlay, slider.remove, pauser.remove, _.partial(doprog, null), maybeButton),
									nullify = _.compose(_.partial(doanime, null), navcommand.execute, cleanup, _.partial(navcommand.undo, 3)), //note 3 is hard coded (pause, mousein and mouseout events)
									outcomes = playAway(doprog, doanime, pause, resume, slider, fader, endgame);
								//tooltip_timer becomes an object with run and cancel methods, to enable clearTimeout
								addMouseListeners([enterSlideShow, noOp])();
								//returns 'best' options in an array...
								doSlideShow(outcomes)();
								initToolTip([tooltip_timer.init, noOp])();
								doNull = nullify;
							} else if (doNull) { //only run post-play doNull is either null or a (exit) function
								addMouseListeners = _.partial(best, _.partial(thunk, once(1)));
								doSlideShow = _.partial(best, _.partial(thunk, once(1)));
								iterator = iteratorBridge(getDomTargetImg(getCurrentSlide()), filterSlides, lis);
								navigator = makeNavigator(iterator, thumbnails, {});
								doNull();
								doNull = null;
								gAlp.Intaface.ensures(tooltip_timer, gAlp.Intaface('Timer', ['cancel']));
								tooltip_timer.cancel();
							}
							//EXIT($('boys'));
						};
						machSchau(e, bool); //run
					}, //original machSchau
					getOutcomes = function(playcommand, navcommand) {
						gAlp.Intaface.ensures(playcommand, gAlp.Intaface('command', ['execute', 'undo']));
						gAlp.Intaface.ensures(navcommand, gAlp.Intaface('command', ['execute', 'undo']));
						var back = _.compose(playcommand.undo, navcommand.undo),
							forward = _.compose(playcommand.undo, navcommand.execute);
						return [back, playcommand.execute, forward];
					},
					delegate = function(mynav) {
                        var nav = gAlp.Util.getCommand(mynav, 'advance', 'retreat');
						return function(e) {
							var play = {
								execute: _.partial(machSchau, e),
								undo: _.partial(machSchau, e, true)
							};
							gAlp.Util.routeOnEvent(e, getOutcomes(play, nav), buttonRoutes);
						};
					},
					handler = _.partial(clickHandler, _.partial(invokeWhen, preNodeNameBridge, delegate(navigator))),
					doElement = _.partial(gAlp.Util.render, this.parentNode, null, createDiv),
					doAttrs = _.partial(setAttrs, {
						id: 'controls'
					}),
					composed = gAlp.Util.makeElement(_.partial(addingEventRet, handler), toggleStatic, doAttrs, doElement).add(),
					extend = function(el, sub) {
						if (!el.subscribe) {
							_.extend(el, new gAlp.Util.Observer());
						}
						if (sub && sub.remove) {
							el.subscribe(sub.remove);
						}
						return el;
					},
					addEvent,
					els = {
						gallery: this,
						showtime: document.body
					},
					currysetter = gAlp.Util.curry3(gAlp.Util.setter);
				doElement = _.partial(gAlp.Util.render, composed.get(), null, createButton);
				gAlp.Util.compLoop('each', playbuttons, always('id'), gAlp.Util.curry2(add)('button'))(currysetter, doElement);
				/*The above is no longer required as we've had to resort to using a background image sprite
				given browser inconsistency in rendering arrows. However it is doing no harm*/
				delegate = function(e) {
					machSchau(e, true);
					_.each(['flush', 'addListener'], function(m) {
						this[m]();
					}, thumbnailsListener);
					switchView(els, gAlp.Util.reverse);
					_.each(lis, doHide);
					this.fire();
				};
				handler = _.partial(clickHandler, _.partial(invokeWhen, preNodeNameBridge, delegate));
				addEvent = _.partial(addingEventRet, handler);
				doElement = _.partial(gAlp.Util.render, this.parentNode, this.parentNode.children[0], createButton);
				doAttrs = _.partial(setAttrs, {
					id: 'exit'
				});
				composed = gAlp.Util.makeElement(gAlp.Util.curry2(extend)(composed), addEvent, doAttrs, setText('&#x2716'), doElement).add();
				gAlp.Util.curry2(extend)(composed)(composed.get());
				enter.call(this, els, navigator.getCurrent());
				/*
                                try {
addMyEvent(_.partial(gAlp.Util.addHandler, 'bolt'), navigator.retreat)($('controls'));
//thumbnails.addEventListener('build', listen1.bind(thumbnails, {target: document.getElementsByTagName('img')[2]}));
thumbnailsListener.triggerEvent($('controls'), 'bolt');
}
    catch(er){
        report.innerHTML = er.message;
    }
            */
				//console.log(navigator.advance)
			};
		}, //listen
		listen1 = listen(_.partial(getNew, 'div'), _.partial(getNew, 'button'));
	thumbnailsListener = addMyEvent(clickHandler, listen1)(thumbnails);
	enter = function(pairs, el) {
		thumbnailsListener.remove(-1, 1);
		switchView(pairs, _.identity);
		doShow(el);
	};
	/*
try {
addMyEvent(_.partial(gAlp.Util.addHandler, 'build'), listen1.bind(thumbnails, {target: document.getElementsByTagName('img')[3]}))(thumbnails);
//thumbnails.addEventListener('build', listen1.bind(thumbnails, {target: document.getElementsByTagName('img')[2]}));
thumbnailsListener.triggerEvent(thumbnails, 'build');
}
    catch(er){
        report.innerHTML = er.message;
    }
   */
}(document, 'show', Modernizr.mq('only all'), '(min-width: 769px)', Modernizr.cssanimations, Modernizr.touchevents, document.getElementsByTagName('h2')[0], function() {
	"use strict";
	return {
		id: 'slide'
	};
}, function(bool) {
	"use strict";
	return {
		id: 'paused',
		src: bool ? '../assets/pauseLong.png' : '../assets/pause.png'
	};
}));