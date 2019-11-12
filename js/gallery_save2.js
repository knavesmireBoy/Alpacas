/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global gAlp: false */
/*global _: false */
/*global setTimeout: false */
(function(doc, slide_config, paused_config, visiblity, mq, query, cssanimations, touchevents) {
	"use strict";
	var con = window.console.log;

	function doHandler(){
        function Handler(thunk) {
		// the cached instance
		var instance;
		// rewrite the constructor
		Handler = function Handler() {
            con(99)
			return instance;
		};
            con(11)
		// carry over the prototype properties
		Handler.prototype = this;
		// the instance
		instance = new Handler();
		// reset the constructor pointer
		instance.constructor = Handler;
		// all the functionality
		instance.handler = thunk();
		return instance;
	}
        return Handler;
        
    }
    
	function h2(arg) {
		document.getElementsByTagName('h2')[0].innerHTML = arg;
	}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function filter(coll, pred) {
		return _.filter(_.toArray(coll), pred);
	}

	function getItem(config) {
		var pred = config.filter || _.partial(_.identity, true),
			coll = config.collection || document.getElementsByTagName('*');
		//https://stackoverflow.com/questions/2095966/document-getelementsbytagname-or-document-all
		//can be used to like this {collection: [$('myid')]} to mimic getElemntById
		return _.partial(_.identity, filter(getResult(coll), pred)[0]);
	}

	function noOp() {}

	function doOnce() {
		return function(i) {
			return function() {
				return i-- > 0;
			};
		};
	}

	function applyOn(partial, getargs, o) {
		//applies the final arguments before fulfilling the function with the supplied object
		partial.apply(null, getResult(getargs))(o);
	}

	function withContextRet(bound, context, fArgs) {
		bound(context).apply(context, fArgs());
		return context;
	}

	function withContext(bound, context, fArgs) {
		return bound(context).apply(context, fArgs());
	}
	/*deferred is a wrapper around withContext, bound awaits a context
    context = context || context = context[subproperty]
    arguments = fArgs();
   context[method].apply(null, arguments)
    */
	function deferred(action, fArgs, value, context) {
		//con(arguments)
		/* both value and context are optional, they may have already been partially applied
		if exactly three arguments are supplied the third argument MAY be a primitive (a value) OR a context object
		if the latter: value SHOULD have been partially applied and it is hoped fArgs will ignore the additional argument!
		*/
		context = arguments.length === 3 ? value : context;
		return withContextRet(action, context, _.partial(fArgs, value));
	}

	function deferred2(action, fArgs, value, context) {
		//con(arguments)
		/* both value and context are optional, they may have already been partially applied
		if exactly three arguments are supplied the third argument MAY be a primitive (a value) OR a context object
		if the latter: value SHOULD have been partially applied and it is hoped fArgs will ignore the additional argument!
		*/
		context = arguments.length === 3 ? value : context;
		return withContext(action, context, _.partial(fArgs, value));
	}

	function doArray(k, v) {
		return [k, v];
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
		}
	}

	function gtOrEq(i) {
		return function(x) {
			return (x >= i) ? x : undefined;
		}
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

	function always(VALUE) {
		return function() {
			return VALUE;
		};
	}

	function thunk(f) {
		return f.apply(f, _.rest(arguments));
	}

	function invokeOn(validater, action) {
		return validater() && action();
	}

	function curryLeft(fn) {
		var args = _.rest(arguments);
		if (args.length >= fn.length) {
			return fn.apply(null, args);
		} else {
			return function() {
				return curryLeft.apply(null, [fn].concat(args, _.toArray(arguments)));
			}
		}
	}

	function curryRight(fn) {
		var args = _.rest(arguments);
		if (args.length >= fn.length) {
			return fn.apply(null, gAlp.Util.reverse(args));
		} else {
			return function() {
				return curryRight.apply(null, [fn].concat(args, gAlp.Util.reverse(arguments)));
			}
		}
	}
	var isFunction = function(fn, context) {
			return _.isFunction(fn) || isFunction(context[fn]) || isFunction(fn[context]);
		},
		//deferred = _.partial(DoDefer, withContextRet),
		negate = _.partial(_.negate),
		$ = function(str) {
			return document.getElementById(str);
		},
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
		//https://tutorialzine.com/2014/12/you-dont-need-icons-here-are-100-unicode-symbols-that-you-can-use
		buttons = ['&#x25c0', '&#x25b7', '&#x25ba'],
		buttons = ['', '', ''],
		zippedButtonsRegEx = _.partial(_.zip, [/back/i, /Forward/i, /p\w+/i]),
		outcomes = ['', ''],
		getCurrent = _.partial(gAlp.Util.byIndex, 0, _.partial(gAlp.Util.getByClass, '.show')),
		isLowerCase = _.partial(gAlp.Util.bindSub, 'nodeName', 'toLowerCase'),
		matchUp = function(pred, f1, f2, str, el) {
			return el && pred(f1(el)(), f2(str, el)())
		},
		isNodeName = _.partial(matchUp, isEqual, isLowerCase, _.partial(gAlp.Util.bindContext, 'toLowerCase')),
		changeView = function(el, bool, klas, method) {
			var f = _.partial(gAlp.Util.bindContext, method),
				args = _.partial(_.identity, [klas, bool]);
			//el may be a function. eg awaitng the creation of an element
			el = gAlp.Util.getClassList(getResult(el));
			//we don't want to return here as it would break a loop on fading
			deferred(f, args, el);
		},
		changeViewRet = function(func, el, bool, klas, method) {
			func(el, bool, klas, method);
			return el;
		},
		changeViewWrap = _.wrap(changeView, changeViewRet),
		prepareView = gAlp.Util.curry4(changeView),
		prepDisplay = prepareView('toggle')(display),
		hide = prepDisplay(false),
		show = prepDisplay(true),
		getLoc = (function(div, subtract, isGreaterEq) {
			var getThreshold = _.compose(div, subtract);
			/*
            threshold = (box.right - box.left) / 2,
				clicked = e.clientX - box.left;
			return clicked >= threshold;
            */
			return function(e) {
				var box = e.target.getBoundingClientRect();
				return isGreaterEq(_.partial(subtract, e.clientX, box.left), _.partial(getThreshold, box.right, box.left));
			};
		}(divideBy(2), subtract, greaterOrEqual)),
		getControls = _.partial($, 'controls'),
		togglePlaying = gAlp.Util.curry4(changeViewWrap)('toggle')('playing')(),
		toggleInplay = _.partial(gAlp.Util.curry4(changeViewWrap)('toggle')('inplay')(), _.partial($, 'wrap')),
		dorender = _.partial(gAlp.Util.render, thumbnails, null),
		getNew = gAlp.Util.getNewElement,
		setAttrs = gAlp.Util.setAttrs,
		setText = gAlp.Util.setText,
		curryView = gAlp.Util.curry4(changeViewWrap),
		preSet = function(def, preBound, pArgs) {
			return _.partial(def, preBound, pArgs);
		},
		preArgs = function(args, pFunc) {
			pFunc = pFunc || _.identity;
			return _.partial(pFunc, args);
		},
		addMyEvent = gAlp.Util.addEvent,
		getDomTargetImg = gAlp.Util.getDomChild(gAlp.Util.getNodeByTag('img')),
		getDomTargetLink = gAlp.Util.getDomChild(gAlp.Util.getNodeByTag('a')),
		invokeWhen = gAlp.Util.invokeWhen,
		clickHandler = _.partial(gAlp.Util.addHandler, 'click'),
		getGallery = function(tgt, pred) {
			pred = pred || always(true);
            tgt = getDomTargetImg(tgt);
			var index,
				//CANNOT be LIVE collection, otherwise the li#slide would be added dynamically
				coll = _.toArray($('thumbnails').getElementsByTagName('li')),
				//coll = _.toArray(document.querySelectorAll('#thumbnails li')),
				getParent = gAlp.Util.getDomParent(gAlp.Util.getNodeByTag('li'));
            coll = _.filter(coll, pred);
            index = _.findIndex(coll, _.partial(isEqual, getParent(tgt)));
			return gAlp.Iterator(index, coll, always(true), _.partial(modulo, coll.length), always(false));
		},
		removingListeners = function(remover, n) {
			//removes the LAST n listeners that were added
			while (n) {
				remover(0, 1);
				n -= 1;
			}
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
					x = 300;
					counter();
				}
			} //nested
			return counter;
		},
		playAway = function(doProgress, hasPlayed, pause, resume, slider, onDone, doFade) {
			var pausedEvent,
				play,
				inProgress = _.partial(function(pred) {
					return pred();
				}, doProgress),
				prepPause = function(then, pred) {
					then(pred)();
				},
				soPlay = function() {
					/*hasPlayed returns a reference to the function provided to requestAnimation... set below
				it is persisted as a property of the outer function or else hasPlayed returns null*/
					hasPlayed(countdown(_.partial(doFade, onDone, slider.add()), 120));
					play = _.compose(toggleInplay, hasPlayed(), resume);
					pausedEvent = _.partial(prepPause, gAlp.Util.getBestRight([pause, play]), inProgress);
					addMyEvent(clickHandler, pausedEvent)(thumbnails);
					play();
				},
				soPause = function() {
					play = _.compose(hasPlayed(), resume);
					gAlp.Util.getBestRight([pause, play])(inProgress)();
				};
			return [soPlay, soPause];
		},

		fadeUntil = function(myopacity, setStyle, doFade, pred, onDone, el, i) {
			/*setStyle awaiting value i, (i/100), then calls setProperty on supplied object's style object
			until opacity reaches the limit*/
			deferred(gAlp.Util.setStyle, _.partial(doFade, myopacity.getValue(i)), getDomTargetImg(el));
			invokeOn(_.partial(thunk, pred, i), _.partial(thunk, onDone, el));
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
		getBaseElement = function(render, neu, config) {
			return _.compose(render, neu, getItem(config));
		},
		getSlide = function(getBase, attrs, deco) {
			var p_attrs = _.omit(attrs, 'src'),
				c_attrs = _.omit(attrs, 'id'),
				clone;
			return {
				add: function(decorator) {
					var precomp = _.compose(_.partial(setAttrs, c_attrs), getDomTargetImg);
					clone = _.compose(deco || decorator || _.identity, _.partial(setAttrs, p_attrs), getBase)();
					invokeOn(_.partial(negate(_.isEmpty), c_attrs), _.partial(precomp, clone));
					return clone;
				},
				remove: function() {
					return gAlp.Util.removeNodeOnComplete($(attrs.id));
				},
				get: function() {
					return clone;
				}
			};
		},
		listen = function(createDiv, createButton) {
			var isMatch = function(str, agg) {
                //agg is an array of [regEx, action]
					return str.match(agg[0]);
				},
				isImg = gAlp.Util.validator('Please click on an image', _.partial(isNodeName, 'IMG')),
				isLscp = _.partial(function(el) {
					return gAlp.Util.getClassList(el).contains('portrait');
				}),
				checkIsButton = function(attr, regExp, el) {
					return el[attr].match(regExp);
				},
				setButton = function(attr, content) {
					var toggle = _.partial(togglePlaying, _.partial($, 'controls'));
					return _.compose(toggle, _.partial(setAttrs, {
						'data-swap': attr
					}), setText(content));
				},
				setPlayButton = _.partial(applyOn, setButton, _.partial(gAlp.Util.reverse, outcomes)),
				toggleStatic = gAlp.Util.curry4(changeViewWrap)('toggle')('static')(),
				isButton = gAlp.Util.validator('Please press a button', _.partial(checkIsButton, 'nodeName', /button/i)),
				swapImgCB = _.compose(_.isNumber, lessOrEqual(0)),
				preNodeNameBridge = _.partial(nodematchBridge, isButton),
				fader = _.partial(fadeUntil, gAlp.getOpacity(), gAlp.Util.setStyle, _.partial(doArray, cssopacity), swapImgCB),
				doanime = gAlp.Util.doGetSet(countdown, 'anime'),
				doprog = gAlp.Util.doGetSet(countdown, 'progress'),
                half = gAlp.getOpacity(50).getValue(),
                full = gAlp.getOpacity(100).getValue(),
                fade50 = _.compose(preSet(deferred, gAlp.Util.setStyle, preArgs([cssopacity, half])), curryView('add')(display)(true)),
				inherit = function(iterator, slide) {
					var kid = getDomTargetImg(slide.firstChild),
						link = getDomTargetLink(slide.firstChild),
						cur = getDomTargetImg(iterator.getCurrent().firstChild),
						getAttrs = gAlp.Util.curry2(gAlp.Util.getter),
						addOpacity = _.partial(gAlp.Util.setpropAdapter, 'style', cssopacity, full),
						o = {
							src: getAttrs('src')(cur),
							alt: getAttrs('alt')(cur)
						};
					_.compose(_.partial(setAttrs, {
						href: getAttrs('src')(cur)
					}))(link);
					_.compose(_.partial(setAttrs, o), addOpacity)(kid);
				},
				enterHandler = _.partial(gAlp.Util.addHandler, 'mouseenter'),
				res,
				tgt,
				makeEvent = function(typeHandler, func, getEl) {
					return _.compose(gAlp.Util.addEvent(typeHandler, func), getEl)();
				},
				delegator = function(pred, command) {
					return function(e) {
						return gAlp.Util.getBest(_.partial(pred, e), [command.execute, command.undo])();
					};
				},
				enabler = function(handler) {
					return {
						enable: _.bind(handler.addListener, handler),
						disable: _.partial(handler.remove, handler)
					};
				},
				makeNavigator = (function(handler, predicate){
                    return function(iterator, context) {
					var hidey = _.compose(hide, getCurrent),
                        advance = _.compose(show, iterator.forward, hidey),
						retreat = _.compose(show, iterator.back, hidey),
						com = makeCommand({
							advance: advance,
							retreat: retreat
						}, 'advance', 'retreat'),
						delegateLocation = delegator(predicate, com),
						//delegateLocation = alert.bind(window, 7),
                        ret,
                        exit;
						handler = handler || makeEvent(clickHandler, delegateLocation, always(context));
                        exit = _.partial(removingListeners, gAlp.Util.removeListener(handler));
                        ret = {
						advance: advance,
						retreat: retreat,
                            next:  _.compose(show, iterator.getNext, hidey),
						get: function() {
							return iterator;
						},
                            exit: function(i){
                                var func = i ? exit : hidey;
                                func(i);
                            }
					};
                        return _.extend(ret, enabler(handler));
                    };
                }(null, getLoc)),
				makeCommand = function(object, sExec, sUndo) {
					var com = gAlp.Util.command().init(object);
					com.execute(sExec);
					com.undo(sUndo);
					return com;
				};
			////////////////////////////////////////////////////////////////////////////////////
			return function(e) {
				tgt = e.target;
				res = gAlp.Util.checker(isImg)(tgt);
				if (negate(_.isEmpty)(res)) {
					return window.alert(res);
				}
				// window.alert(document.documentElement.className);
				/*▲ &#9650; ► &#9658; ▼ &#9660; ◄ &#9668*/
				var navigator = makeNavigator(getGallery(tgt, always(true)), this),
					doElement = _.partial(gAlp.Util.render, this.parentNode, null, createDiv),
					doAttrs = _.partial(setAttrs, {
						id: 'controls'
					}),
					getPlayIterator = function(iterator, predicate, context) {
						var pass = predicate(iterator.getCurrent()),
							filterBy = pass ? predicate : _.negate(predicate);
						return makeNavigator(getGallery(iterator.getCurrent(), filterBy), context);
					},
					validate = function(el) {
						return el.innerHTML.match(/play/i);
					},
					valwrapper = function(coll, func, el, i) {
						gAlp.Util.setter(el, 'id', coll[i] + 'button');
						return func(el);
					},
                       prepareControls = function(pred, command, zipper){
                           return function(e) {
						var play = _.partial(slideshow, e),
							endplay = _.partial(slideshow, e, true),
							best = gAlp.Util.getBest,
							chosen = _.partial(best, pred(e), zipper([_.compose(endplay, command.undo), _.compose(endplay, command.execute), play])),
							action = _.partial(best, _.isFunction);
						//zip => [[regEx1, regEx2...], [func1. func2...] => [[regEx1, func1], [regEx2, func2]]
						//hooks up the method with the button (e.target.id), returns then calls the method
						_.compose(action, chosen)()();
					};
                },
                    targetBridge = function(func, prop, e){
                        return _.partial(func, e.target[prop]);
                    },
                    navCommand = makeCommand(navigator, 'advance', 'retreat'),
                    delegate = prepareControls(_.partial(targetBridge, isMatch, 'id'), navCommand, zippedButtonsRegEx),
					handler = _.partial(clickHandler, _.partial(invokeWhen, preNodeNameBridge, delegate)),
					composed = gAlp.Util.makeElement(_.partial(addingEventRet, handler), toggleStatic, doAttrs, doElement).add(),
					extend = function(el, sub) {
						if (!el.subscribe) {
							_.extend(el, new gAlp.Util.Observer);
						}
						sub && sub.remove && el.subscribe(sub.remove);
						return el;
					},
					addEvent,
					els = {
						gallery: this,
						showtime: document.body
					},
                    slideshow = function(e, bool) {
						var doButtonBound = _.partial(setPlayButton, e.target),
							tooltip_timer,
                            allow = 2,
							enterSlideShow = function() {
								//dealing with more than one element...
								var stat = prepareView('add')('static')(true),
									nostat = prepareView('remove')('static')(true),
									mouseenter = _.partial(enterHandler, _.partial(stat, getControls)),
									mouseleave = _.partial(enterHandler, _.partial(nostat, getControls)),
									dotooltip = _.partial(gAlp.Tooltip, $('thumbnails'), ["move mouse in and out of footer...", "...to toggle the display of control buttons"]);
								mouseenter(getControls()).addListener();
								mouseleave($('footer')).addListener();
								toggleStatic(getControls());
                                navigator.disable();
								tooltip_timer = invokeWhen(function() {
									return mq && !touchevents && (allow--) > 0;
								}, dotooltip);
							},
							best = gAlp.Util.getBest,
							doNull,
							once = doOnce(),
							doListeners = _.partial(best, _.partial(thunk, once(1))),
                            doTool = _.partial(best, _.partial(thunk, once(1))),
							doAni = _.partial(best, _.partial(thunk, once(1)));
						slideshow = function(e, bool) { //memo
							if (!bool) {
								navigator = getPlayIterator(navigator.get(), isLscp, thumbnails);
								var config = {
										filter: filterSlides,
										collection: function() {
											return _.partial(gAlp.Util.getByClass, display, null, 'li')();
										}
									},
									play_iterator = navigator.get(),
									copier = _.partial(inherit, play_iterator),
									next = _.compose(show, play_iterator.getNext, hide, getCurrent),
									baseEl = getBaseElement(dorender, getNew, config),
									pauser = getSlide(baseEl, paused_config, fade50),
									slider = getSlide(baseEl, slide_config, curryView('remove')(display)(true)),
									pause = _.compose(doButtonBound, pauser.add, _.partial(doprog, null)),
									resume = _.compose(doButtonBound, pauser.remove, _.partial(doprog, 1)),
									maybeButton = _.partial(gAlp.Util.doWhenWait(doButtonBound), doprog),
									cleanup = _.compose(toggleInplay, slider.remove, pauser.remove, _.partial(doprog, null), maybeButton),
									nullify = _.compose(_.partial(doanime, null), navigator.enable, cleanup, _.partial(navigator.exit, 3)),
									play = _.partial(playAway, doprog, doanime, pause, resume, slider);
								//tooltip_timer becomes an object with run and cancel methods, to enable clearTimeout
								doListeners([enterSlideShow, noOp])();
								//returns 'best' options in an array...
								doAni(play(_.compose(next, copier), fader))();
                                doTool([tooltip_timer.init, noOp])();
								doNull = nullify;
							} else if (doNull) { //only run post-play doNull is either null or a (exit) function
								doListeners = _.partial(best, _.partial(thunk, once(1)));
								doAni = _.partial(best, _.partial(thunk, once(1)));
                                //doTool = _.partial(best, _.partial(thunk, once(1)));
								doNull();
								navigator = makeNavigator(getGallery(getDomTargetImg(navigator.get().getNext(true)), filterSlides), thumbnails);
								tooltip_timer && tooltip_timer.cancel();
								doNull = null;
							}
						};
						slideshow(e, bool); //run
					}; //original slideshow
                   
				///re-use vars....
				validate = _.wrap(validate, _.partial(valwrapper, playbuttons));
				doElement = _.partial(gAlp.Util.render, composed.get(), null, createButton);
				doAttrs = _.partial(setAttrs, {
					//'data-swap': '&#9660'
					'data-swap': ''
				});
				validate = _.partial(invokeWhen, validate, doAttrs);
				//setInnerHTML from buttons array
				_.map(buttons, setText).forEach(function(fn, i) {
					//we need to pass index which is supplied as SECOND argument after incoming element
					return _.compose(gAlp.Util.curry2(validate)(i), fn, doElement)();
				});
				/*The above is no longer required as we've had to resort to using a background image sprite
				given browser inconsistency in rendering arrows. However it is doing no harm*/
				delegate = function(e) {
					slideshow(e, true);
					//ideally set up an observer, NOT PURE
					//_.each([e.target], gAlp.Util.removeNodeOnComplete);
					_.each(['flush', 'addListener'], function(m) {
						this[m]();
					}, thumbnailsListener);
					switchView(els, gAlp.Util.reverse);
                    navigator.exit();
					this.fire();
				};
				handler = _.partial(clickHandler, _.partial(invokeWhen, preNodeNameBridge, delegate));
				addEvent = _.partial(addingEventRet, handler);
				doElement = _.partial(gAlp.Util.render, this.parentNode, this.parentNode.children[0], createButton),
					doAttrs = _.partial(setAttrs, {
						id: 'exit'
					});
				composed = gAlp.Util.makeElement(gAlp.Util.curry2(extend)(composed), addEvent, doAttrs, setText('&#x2716'), doElement).add();
				gAlp.Util.curry2(extend)(composed)(composed.get());
				enter.call(this, els, navigator.get().getCurrent());
			};
		},
		listen1 = listen(_.partial(getNew, 'div'), _.partial(getNew, 'button')),
		thumbnailsListener = addMyEvent(clickHandler, listen1)(thumbnails),
		enter = function(pairs, el) {
			thumbnailsListener.remove(-1, 1);
			switchView(pairs, _.identity);
			show(el);
		};

}(document, {
	id: 'slide',
}, {
	id: 'paused',
	src: '../assets/pause.png'
}, 'show', Modernizr.mq('only all'), '(min-width: 769px)', Modernizr.cssanimations, Modernizr.touchevents));