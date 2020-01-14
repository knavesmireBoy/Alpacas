/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global gAlp: false */
/*global _: false */
(function (doc, visiblity, mq, query, cssanimations, touchevents) {
	"use strict";

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function noOp() {}

	function undef(x) {
		return typeof (x) === 'undefined';
	}

	function isPositive(x) {
		return (x >= 0) ? !undef(x) : undefined;
	}

	function lessOrEqual(i) {
		return function (x) {
			return (x <= i) ? x : undefined;
		};
	}

	function subtract(x, y) {
		return x - y;
	}

	function divideBy(n) {
		return function (i) {
			return i / n;
		};
	}

	function greaterOrEqual(a, b) {
		return getResult(a) >= getResult(b);
	}

	function modulo(n, i) {
		return i % n;
	}

	function setter(o, k, v) {
		o[k] = v;
	}

	function invokemethod(o, arg, m) {
		//con(arguments)
		return o[m](arg);
	}

	function invoke(f, arg) {
		//con(arguments)
		return f(arg);
	}

	function thunk(f) {
		return f.apply(f, _.rest(arguments));
	}

	function always(val) {
		return function () {
			return val;
		};
	}

	function failed(i) {
		return i < 0;
	}

	function doOnce() {
		return function (i) {
			return function () {
				var res = i > 0;
				i -= 1;
				return res > 0;
			};
		};
	}
	var utils = gAlp.Util,
		//con = window.console.log.bind(window),
		$ = function (str) {
			return document.getElementById(str);
		},
		ptL = _.partial,
		once = doOnce(),
		doTwice = utils.curryTwice(),
		doThrice = utils.curryThrice(),
		doQuart = utils.curryFourFold(),
		doTwiceDefer = utils.curryTwice(true),
		doThriceDefer = utils.curryThrice(true),
		drill = utils.drillDown,
		invokeWhen = utils.invokeWhen,
		renderpair = ['render', 'unrender'],
		handlerpair = ['addListener', 'remove'],
		setAttrs = utils.setAttributes,
		cssopacity = gAlp.getOpacity().getKey(),
		anCrIn = utils.insert(),
		anCr = utils.append(),
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		clicker = touchevents ? ptL(utils.addHandler, 'touchend') : ptL(utils.addHandler, 'click'),
		enterHandler = ptL(utils.addHandler, 'mouseenter'),
		makeElement = utils.machElement,
		getDomTargetList = utils.getDomParent(utils.getNodeByTag('li')),
		getDomTargetLink = utils.getDomChild(utils.getNodeByTag('a')),
		getDomTargetImg = utils.getDomChild(utils.getNodeByTag('img')),
		getControls = ptL($, 'controls'),
		getSlide = ptL($, 'slide'),
		playbuttons = ['back', 'play', 'forward'],
		thumbs = $('thumbnails'),
		livelist = thumbs.getElementsByTagName('li'),
		lis = _.toArray(livelist),
		prepIterator = doQuart(gAlp.Iterator(false)),
		getCurrentSlide = _.compose(utils.getZero, ptL(utils.getByClass, 'show', thumbs, 'li')),
		grabSource = _.compose(drill(['src']), getDomTargetImg),
		findCurrent = function (f, li) {
			return grabSource(li).match(grabSource(f()));
		},
		getNextAction = function (m) {
			return _.compose(utils.show, utils[m], utils.getZero, ptL(_.filter, lis, ptL(findCurrent, ptL($, 'slide'))));
		},
		isPortrait = ptL(function (el) {
			return utils.getClassList(el).contains('portrait');
		}),
		hideCurrent = _.compose(utils.hide, getCurrentSlide),
		doShow = function (next) {
			hideCurrent();
			utils.show(next);
		},
		stringmatch = doThrice(invokemethod)('match'),
		buttonmatch = doThrice(invokemethod)('match')(/button/i),
		validate = _.compose(buttonmatch, utils.drillDown(['target', 'nodeName'])),
		getAction = doThrice(invokemethod)(1)(null),
		prepForward = doThriceDefer(invokemethod)('forward')(null),
		prepBack = doThriceDefer(invokemethod)('back')(null),
		makeIterator = function (coll) {
			var findIndex = ptL(utils.findIndex, coll),
				doIterator = prepIterator(ptL(modulo, coll.length))(always(true))(coll);
			return _.compose(doIterator, findIndex, doTwice(utils.isEqual), getCurrentSlide);
		},
		default_iterator = makeIterator(lis),
		locator = function (iterator, forward, back) {
			var getLoc = (function (div, subtract, isGreaterEq) {
				var getThreshold = _.compose(div, subtract);
				return function (e) {
					try {
						var box = e.target.getBoundingClientRect();
						return isGreaterEq(ptL(subtract, e.clientX, box.left), ptL(getThreshold, box.right, box.left));
					} catch (er) {
						return true;
					}
				};
			}(divideBy(2), subtract, greaterOrEqual));
			return function (e) {
				return utils.getBest(function (agg) {
					return agg[0](e);
				}, _.zip([getLoc, _.negate(getLoc)], [forward, back]));
			};
		},
		makeButtons = function (tgt) {
			_.each(playbuttons, function (str) {
				var conf = {};
				conf.id = str + 'button';
				makeElement(ptL(setAttrs, conf), anCr(getResult(tgt)), always('button')).render();
			});
		},
		//curry as subject arrives last and override MAY be optional
		adaptHandlers = function (subject, adapter, allpairs, override) {
			adapter = adapter || {};
			adapter = utils.simpleAdapter(allpairs, adapter, subject);
			adapter[override] = function () {
				subject.remove(subject);
			};
			return adapter;
		},
		adapterFactory = function () {
			//fresh instance of curried function per adapter
			return doQuart(adaptHandlers)('unrender')([renderpair, handlerpair.slice(0)])(gAlp.Composite());
		},
		myrevadapter = doQuart(adaptHandlers)('render')([renderpair, handlerpair.slice(0).reverse()])(gAlp.Composite()),
		presenter = (function (inc) {
			return gAlp.Composite(inc);
		}([])),
		stage_one_comp = (function (inc) {
			var comp = gAlp.Composite(inc),
				//all arguments must be functions...hence always
				$thumbs = makeElement(ptL(klasRem, 'gallery'), always(thumbs)),
				$body = makeElement(ptL(klasAdd, 'showtime'), always(utils.getBody)),
				$wrap = makeElement(always($('wrap'))),
				$show = makeElement(ptL(utils.show), getDomTargetList, drill(['target'])),
				exitconf = {
					id: 'exit'
				},
				controlsconf = {
					id: 'controls'
				},
				$exit = makeElement(doTwice(utils.getter)('getElement'), ptL(clicker, ptL(invokemethod, presenter, null, 'unrender')), utils.setText('&#x2716'), ptL(setAttrs, exitconf), anCrIn(thumbs, $('main')), always('button')),
				$controls = makeElement(ptL(klasAdd, 'static'), ptL(setAttrs, controlsconf), anCr($('main')), always('div'));
			comp.add(_.extend(gAlp.Composite(), $thumbs, {
				unrender: ptL(klasAdd, 'gallery', thumbs)
			}));
			comp.add(_.extend(gAlp.Composite(), $body, {
				unrender: ptL(klasRem, 'showtime', utils.getBody())
			}));
			comp.add(_.extend(gAlp.Composite(), $wrap, {
				unrender: ptL(klasRem, 'inplay', $('wrap'))
			}));
			comp.add(_.extend(gAlp.Composite(), $show, {
				unrender: hideCurrent
			}));
			comp.add(_.extend(gAlp.Composite(), $exit));
			comp.add(_.extend(gAlp.Composite(), $controls));
			return comp;
		}([]));
	(function () {
		var stage_two_comp = (function (inc) {
				return gAlp.Composite(inc);
			}([])),
			stage_one_rpt = (function (inc) {
				return gAlp.Composite(inc);
			}([])),
			stage_two_rpt = (function (inc) {
				return gAlp.Composite(inc);
			}([])),
			stage_two_persist = (function (inc) {
				return gAlp.Composite(inc);
			}([])),
			allow = !touchevents ? 2 : 0,
			isImg = _.compose(doThrice(invokemethod)('match')(/^img$/i), drill(['target', 'nodeName'])),
			getsrc = _.compose(drill(['src']), getDomTargetImg),
			getalt = _.compose(drill(['alt']), getDomTargetImg),
			gethref = _.compose(drill(['href']), getDomTargetLink),
			exitShow = function (actions) {
				return function (flag) {
					var f = flag ? ptL(thunk, once(1)) : always(false);
					return utils.getBest(f, actions)();
				};
			},
			prepRoutes = function () {
				var getId = drill(['target', 'id']),
					passive = _.map([/^ba/i, /^For/i], function (reg) {
						return _.compose(stringmatch(reg), getId);
					}),
					active = _.map([/^p\w+/i], function (reg) {
						return _.compose(stringmatch(reg), getId);
					}),
					coll = [passive, active];
				return function (arg) {
					return arg ? coll.reverse()[0] : coll[0];
				};
			},
			fadeNow = function (el, i) {
				var currysetter = doThrice(setter)(i)(cssopacity);
				_.compose(currysetter, drill(['style']))(el);
				//el.style object would be returned from currysetter, need to return acutal element
				return el;
			},
			fade50 = doTwiceDefer(fadeNow)(gAlp.getOpacity(50).getValue()),
			fade100 = doTwiceDefer(fadeNow)(gAlp.getOpacity(100).getValue()),
			dofading = function (myopacity, pred, onDone, counter, i) {
				var currysetter = doThrice(utils.setter)(myopacity.getValue(i))(cssopacity);
				_.compose(currysetter, ptL(drill(['style']), getSlide()))();
				utils.invokeWhen(ptL(pred, i), ptL(onDone, counter));
			},
			swapImgCB = _.compose(_.isNumber, lessOrEqual(0)),
			countdown = function countdown(cb, x) {
				//cb === dofading
				//restarting counter is delegated to an onDone function, passed as an argument here..
				function counter() {
					if (countdown.resume) {
						countdown.resume = null;
					}
					if (countdown.progress === null) {
                        window.cancelAnimationFrame(countdown.progress);
						countdown.resume = x;
						return;
					}
					x -= 1;
					//doFadeUntil...
                    utils.invokeWhen(lessOrEqual(100), ptL(cb, counter), x);
					if (isPositive(x)) {
                        countdown.progress = window.requestAnimationFrame(counter);
					} else {
						x = 360;
					}
				}
				return counter;
			},
			baserender = function ($el, it) {
				var li = $el.get(),
					link = getDomTargetLink(li),
					img = getDomTargetImg(li),
					mysrc = _.compose(ptL(setter, img, 'src'), getsrc, it.getNext),
					myalt = _.compose(ptL(setter, img, 'alt'), getalt, it.getCurrent),
					myhref = _.compose(ptL(setter, link, 'href'), gethref, it.getCurrent);
				_.compose(myhref, myalt, mysrc)();
			},
			sliderender = function ($el, base) {
				var li = $el.get(),
					link = getDomTargetLink(li),
					img = getDomTargetImg(li),
					mysrc1 = _.compose(ptL(setter, img, 'src'), always('')),
					mysrc2 = _.compose(ptL(setter, img, 'src'), getsrc, base.get),
					myalt = _.compose(ptL(setter, img, 'alt'), getalt, base.get),
					myhref = _.compose(ptL(setter, link, 'href'), gethref, base.get);
				img.onload = fade100(li);
				//slide img gets set to base img src.
				//On first run these are the SAME. So first set src to empty string to trigger onload event
				_.compose(mysrc2, mysrc1, myhref, myalt)();
			},
			controller = function (mycountdown, cb, x) {
				var counter = mycountdown(cb, x),
					control = getControls(),
					klas = 'playing',
					pauserender = function () {
						var clone = getSlide(),
							pause = makeElement(ptL(setAttrs, {
								id: 'paused'
							}), anCr(thumbs), always(clone)).render(),
							img = getDomTargetImg(pause.get());
						img.onload = fade50(pause.get());
						img.src = isPortrait(clone) ? '../assets/pauseLong.png' : '../assets/pause.png';
						return pause;
					},
					//dummy pause
					pause = {
						unrender: noOp
					},
					init = function (t) {
						this.target = t;
					},
					$wrap = makeElement(ptL(klasAdd, 'inplay'), always($('wrap'))),
					ret = {
						state: undefined,
						init: function () {
							_.extend($wrap, {
								unrender: ptL(klasRem, 'inplay', $('wrap'))
							});
							this.states.playing.init(this);
							this.states.paused.init(this);
							this.state = this.states.playing;
						},
						render: function () {
							if (!this.state) {
								this.init();
							}
							this.state.render();
						},
						changestates: function (s) {
							this.state = s;
						},
						unrender: function () {
							mycountdown.progress = null;
							pause.unrender();
							klasRem(klas, control);
							$wrap.unrender();
							this.state = this.states.playing;
						},
						states: {
							playing: {
								init: init,
								render: function () {
									mycountdown.progress = 1;
									counter();
									pause.unrender(); //dummy pause on initial run
									klasAdd(klas, control);
									$wrap.render();
									this.target.changestates(this.target.states.paused);
								}
							},
							paused: {
								init: init,
								render: function () {
									mycountdown.progress = null;
									pause = pauserender();
									klasRem(klas, control);
									this.target.changestates(this.target.states.playing);
								}
							}
						}
					};
				return _.extend(gAlp.Composite(), ret);
			},
			mediator = (function (coll) {
				return {
					add: function (i) {
						coll[i] = [];
						coll[i].push.apply(coll[i], _.rest(arguments));
					},
					execute: function (i, arg) {
						if (arg) {
							coll.reverse();
						}
						return coll[0][i];
					}
				};
			}([
				[],
				[]
			])),
			addLocator = function (cb) {
				var adapter = adapterFactory();
				_.compose(stage_one_rpt.add, adapter, utils.addEvent(clicker, cb))(thumbs);
			},
			addRouter = function (cb) {
				var adapter = adapterFactory();
				_.compose(stage_one_rpt.add, adapter, utils.addEvent(clicker, cb))($('controls'));
			},
			play = noOp,
			initplay = ptL(invokeWhen, once(1)),
			getRoutes = prepRoutes(),
			toggle_command = (function (o, klas, cb) {
				var tog = _.compose(ptL(klasRem, klas), cb),
					clear = function () {
						window.clearTimeout(o.timer);
						o.timer = null;
					},
					untog = ptL(utils.doWhen, o.timer, _.compose(ptL(klasAdd, klas), cb)),
					ret = {
						render: function () {
							o.timer = window.setTimeout(tog, 3000);
							window.setTimeout(clear, 3500);
						},
						unrender: function () {
							_.compose(clear, untog);
						}
					};
				return _.extend(gAlp.Composite(), ret);
			}({
				timer: null
			}, 'static', getControls)),
			prepToggler = function (command) {
				var func = ptL(klasAdd, 'static', getControls);
				_.compose(stage_two_persist.add, adapterFactory(), utils.addEvent(enterHandler, func), getControls)();
				stage_two_persist.add(command);
			},
			makeToolTip = function () {
				return gAlp.Tooltip($('thumbnails'), ["move mouse in and out of footer...", "...to toggle the display of control buttons"], allow);
			},
			prepSlideElements = function () {
				var comp = stage_one_rpt.get(false);
				comp.unrender(); //remove location handler 
				stage_one_rpt.remove(comp); //remove from composite
				stage_two_comp.render();
				//true gets passed to next function, critical: _.compose(function_awaiting_flag, always(true))
				return true;
			},
			prepareNavHandlers = function () {
				var iterator = default_iterator(),
					forward = prepForward(iterator),
					back = prepBack(iterator),
					getDirection = locator(iterator, forward, back),
					getPrevEl = getNextAction('getPreviousElement'),
					getNextEl = getNextAction('getNextElement'),
					callback = _.compose(doShow, getAction, getDirection),
					doPrevious = exitShow([getPrevEl, _.compose(doShow, back)]),
					doNext = exitShow([getNextEl, _.compose(doShow, forward)]),
					handler = function (e) {
						if (!validate(e)) {
							return;
						}
						var res = _.findIndex(getRoutes(), doTwice(invoke)(e));
						if (failed(res)) {
							initplay(play); //move into stage three
							res = _.findIndex(getRoutes(true), doTwice(invoke)(e));
							//the default mediator.execute returns a callback function
							//the wrapped version invokes the function in sequence with a pre/post function
							//the true flag gets passed to the inital AND callback function
							mediator.execute(res, true);
							return;
						}
						//BUT at this point mediator.execute is unwrapped unless play has ben initialised
						//so the callback function is returned (in both wrapped and unwrapped cases) THEN invoked
						mediator.execute(res)();
					};
				mediator.add(0, doPrevious, doNext);
				addRouter(handler);
				addLocator(callback);
			};
		play = function () {
			var predicate = utils.getPredicate(getCurrentSlide(), isPortrait),
				iterator = makeIterator(_.filter(lis, predicate))(),
				$base = makeElement(ptL(klasRem, 'show'), ptL(setAttrs, {
					id: 'base'
				}), anCr(thumbs), getCurrentSlide),
				$slide = makeElement(ptL(klasRem, 'show'), ptL(setAttrs, {
					id: 'slide'
				}), anCr(thumbs), getCurrentSlide),
				$current = {
					render: hideCurrent,
					unrender: noOp
				},
				swap = function (counter) {
					_.compose(ptL(baserender, $base, iterator), ptL(sliderender, $slide, $base))();
					getDomTargetImg($base.get()).onload = counter;
				},
				fader = ptL(dofading, gAlp.getOpacity(), swapImgCB, swap),
				player = controller(countdown, fader, 101),
				tooltip_pairs = [
					['render', 'unrender'],
					['init', 'cancel']
				],
				tooltip_adapter = ptL(utils.simpleAdapter, tooltip_pairs, gAlp.Composite()),
				addEvent = utils.addEvent,
				exit = function () {
					stage_two_comp.unrender();
					player.unrender();
					var comp = stage_one_rpt.get(false);
					comp.unrender();
					stage_one_rpt.remove(comp);
					prepareNavHandlers();
				},
				prepStart = utils.doAlternate()([prepSlideElements, always(true)]),
				prepEnd = utils.doAlternate()([noOp, exit]);
			mediator.add(1, _.bind(player.render, player));
			mediator.execute = _.wrap(mediator.execute, function (f, i, bool) {
				return bool ? _.compose(prepEnd, f(i, bool), prepStart)() : f(i);
			});
			stage_two_rpt.add(_.extend(gAlp.Composite(), $base));
			stage_two_rpt.add(_.extend(gAlp.Composite(), $slide));
			prepToggler(toggle_command);
			_.compose(stage_two_persist.add, adapterFactory(), addEvent(enterHandler, ptL(klasRem, 'static', getControls)))($('footer'));
			_.compose(stage_two_persist.add, adapterFactory(), addEvent(clicker, _.bind(player.render, player)))(thumbs);
			_.compose(stage_two_persist.add, tooltip_adapter, makeToolTip)();
			stage_two_persist.add(_.extend(gAlp.Composite(), $current));
			presenter.add(stage_two_comp);
			presenter.add(player);
		};
		//init...
		(function () {
			presenter.add(stage_one_comp);
			presenter.add(stage_one_rpt);
			stage_two_comp.add(stage_two_rpt);
			stage_two_comp.add(stage_two_persist);
			//presenter->stage_one_comp stage_one_rpt stage_two_comp->stage_two_rpt stage_two_persist; ->player
			var func = _.compose(ptL(makeButtons, ptL($, 'controls')), prepareNavHandlers, stage_one_comp.render);
			_.compose(stage_one_comp.add, myrevadapter, utils.addEvent(clicker, ptL(invokeWhen, isImg, func)))(thumbs);
		}());
	}());
}(document, 'show', Modernizr.mq('only all'), '(min-width: 769px)', Modernizr.cssanimations, Modernizr.touchevents));