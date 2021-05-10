/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global gAlp: false */
/*global _: false */
(function(mq, query, touchevents, pausepath, imagepath, picnum, tooltip_msg) {
	"use strict";

	function doPredicate(pred, q1, q2, arg) {
		return pred(q1(arg)) ? q2(arg) : false;
	}

	function getNativeOpacity(bool) {
		return {
			getKey: function () {
				return bool ? 'filter' : Modernizr.prefixedCSS('opacity');
			},
			getValue: function(val) {
				return bool ? 'alpha(opacity=' + val * 100 + ')' : val;
			}
		};
	}

	function viewBoxDims(s) {
		var a = s.split(' ').slice(-2);
		return {
			width: a[0],
			height: a[1]
		};
	}

	function doSvg(svg) {
		return function(str) {
			if (svg && str) {
				utils.setAttributes({
					viewBox: str
				}, svg);
				//ipod ios(6.1.6) requires height, arbitrary choice of unsupported feature
				if (!Modernizr.objectfit) {
					utils.setAttributes(viewBoxDims(str), svg);
				}
			}
		}
	}

	function doSVGview() {
		var mq = window.matchMedia("(max-width: 667px)"),
			setViewBox = doSvg(document.getElementById('logo')),
			doMobile = _.compose(execMobile, undoDesktop, ptL(setViewBox, "0 0 155 125")),
			doDesktop = _.compose(undoMobile, execDesktop, ptL(setViewBox, "2 0 340 75"));
		return function () {
			if (mq.matches) { //onload
				doMobile();
			}
			return doAltSVG([doMobile, doDesktop]);
		};
	}

	function makeDummy() {
		return {
			execute: function () {},
			undo: function () {}
		};
	}

	function invokeMethod(o) {
		return function(m) {
			return o[m] && o[m].apply(null, _.rest(arguments));
		};
	}

	function doPartial(flag, f) {
		var F = _.partial(flag, f);
		if (flag && _.isBoolean(flag)) {
			F = function(elem) {
				return _.partial(f, elem);
			};
		}
		return F;
	}

	function doubleGet(o, sub, v, p) {
		return o[sub][p](v);
	}

	function greater(a, b) {
		return a > b;
	}

	function greaterBridge(o, p1, p2) {
		return greater(o[p1], o[p2]);
	}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function equals(a, b) {
		return getResult(a) === getResult(b);
	}

	function add(a, b) {
		return a + b;
	}

	function modulo(n, i) {
		return i % n;
	}

	function increment(i) {
		return i + 1;
	}

	function equalNum(tgt, cur) {
		return cur === tgt || parseFloat(cur) === parseFloat(tgt);
	}

	function invoke(f, arg) {
		arg = _.isArray(arg) ? arg : [arg];
		return f.apply(null, arg);
	}

	function invokeCB(arg, cb) {
		arg = _.isArray(arg) ? arg : [arg];
		return cb.apply(null, arg);
	}

	function invokeBridge(arr) {
		return invoke(arr[0], arr[1]);
	}

	function invokeArgs(f) {
		var args = _.rest(arguments);
		return f.apply(null, _.map(args, getResult));
	}

	function doMethod(o, v, p) {
		return o[p] && o[p](v);
	}

	function lazyVal(v, o, p) {
		return doMethod(o, v, p);
	}

	function doCallbacks(cb, coll, p) {
		return _[p](getResult(coll), cb);
	}

	function spread(f, j, group) {
		if (!group || !group[j]) {
			return [
				[],
				[]
			];
		}
		//allow for partial
		if (j) {
			return f(group[0], group[j]);
		}
		//or curry
		return f(group[1])(group[0]);
	}
	var utils = gAlp.Util,
		con = function(arg) {
			console.log(arg);
			return arg;
		},
		ptL = _.partial,
		doComp = _.compose,
		Looper = gAlp.LoopIterator,
		curryFactory = utils.curryFactory,
		event_actions = ['preventDefault', 'stopPropagation', 'stopImmediatePropagation'],
		eventing = utils.eventer,
		once = utils.doOnce(),
		defer_once = curryFactory(1, true),
		twice = curryFactory(2),
		twicedefer = curryFactory(2, true),
		thrice = curryFactory(3),
		thricedefer = curryFactory(3, true),
		deferEach = thricedefer(doCallbacks)('each'),
		deferEvery = thrice(doCallbacks)('every'),
		anCr = utils.append(),
		anCrIn = utils.insert(),
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		klasTog = utils.toggleClass,
		cssopacity = getNativeOpacity(!window.addEventListener),
		$ = thrice(lazyVal)('getElementById')(document),
		$$ = thricedefer(lazyVal)('getElementById')(document),
		main = document.getElementsByTagName('main')[0],
		getThumbs = doComp(utils.getZero, ptL(utils.getByTag, 'ul', main)),
		getAllPics = doComp(ptL(utils.getByTag, 'img'), getThumbs),
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
		getTarget = utils.drillDown([mytarget]),
		getTargetSrc = utils.drillDown([mytarget, 'src']),
		getImgSrc = utils.drillDown(['src']),
		parser = thrice(doMethod)('match')(/gal\/big\/[^.]+\.jpe?g$/),
		doMap = utils.doMap,
		doGet = twice(utils.getter),
		doVal = doGet('value'),
		doParse = doComp(ptL(add, '../'), doGet(0), parser),
       // doParse = _.identity,
		doAlt = doComp(twice(invoke)(null), utils.getZero, thrice(doMethod)('reverse')(null)),
		unsetPortrait = ptL(klasRem, 'portrait', getThumbs),
		setPortrait = ptL(klasAdd, 'portrait', getThumbs),
		getLength = doGet('length'),
		text_from_target = doComp(doGet('id'), getTarget),
		node_from_target = doComp(doGet('nodeName'), getTarget),
		node_from_target = utils.drillDown([mytarget, 'nodeName']),
		id_from_target = doComp(doGet('id'), getTarget),
		isImg = ptL(doPredicate, ptL(equals, 'IMG'), node_from_target, getTarget),
		doClass = ptL(utils.getBest, queryOrientation, ['addClass', 'removeClass']),
		getSlideChild = doComp(utils.getChild, utils.getChild, $$('slide')),
		getBaseChild = doComp(utils.getChild, utils.getChild, $$('base')),
		getBaseSrc = doComp(utils.drillDown(['src']), getBaseChild),
		queryOrientation = thrice(greaterBridge)('clientWidth')('clientHeight'),
		getLI = utils.getDomParent(utils.getNodeByTag('li')),
		getDomTargetImg = utils.getDomChild(utils.getNodeByTag('img')),
		addElements = function () {
			return doComp(twice(invoke)('img'), anCr, twice(invoke)('a'), anCr, anCr(getThumbs))('li');
		},
		//height and width of image are compared BUT a) must invoke the comparison AFTER image loaded
		//b) must remove load listener or will intefere with slideshow
		onBase = function(img, path, promise) {
			img.src = path;
			var ev = eventing('load', event_actions.slice(0, 1), function(e) {
				promise.then(e.target);
				ev.undo();
			}, img).execute();
		},
		doInc = function(n) {
			return doComp(ptL(modulo, n), increment);
		},
		doMapLateVal = function(v, el, k) {
			return doMap(el, [
				[k, v]
			]);
		},
		doOrient = doComp(ptL(invoke), ptL(utils.getBest, queryOrientation, [setPortrait, unsetPortrait])),
		//slide and pause 
		onLoad = function(img, path, promise) {
			var ret;
			if (promise) {
				//ret = promise.then(getLI(img));
			}
			img.src = path;
			return ret;
		},
		doMapBridge = function(el, v, k) {
			return doMap(el, [
				[k, v]
			]);
		},
		getPausePath = ptL(utils.getBest, doComp(ptL(utils.hasClass, 'portrait'), getThumbs), [pausepath + 'pauseLong.png', pausepath + 'pause.png']),
		doMakeBase = function(source, target) {
			var img = addElements();
			doMap(img.parentNode, [
				['href', doParse(source)]
			]);
			doMap(img.parentNode.parentNode, [
				['id', target]
			]);
			return onBase(img, doParse(img.parentNode.href), new utils.FauxPromise(_.rest(arguments, 2)));
		},
		doMakeSlide = function(source, target) {
			var img = addElements();
			doMap(img.parentNode, [
				['href', doParse(getBaseSrc())]
			]);
			doMap(img.parentNode.parentNode, [
				['id', target]
			]);
			return onLoad(img, doParse(img.parentNode.href), new utils.FauxPromise(_.rest(arguments, 2)));
		},
		doMakePause = function(path) {
			var img = addElements();
			doMap(img.parentNode.parentNode, [
				['id', 'paused']
			]);
			doMap(img.parentNode.parentNode, [
				[
					[cssopacity.getKey(), cssopacity.getValue(0.5)]
				]
			]);
			return onLoad(img, path);
		},
		loadImage = function(getnexturl, id, promise) {
			var img = getDomTargetImg($(id));
			if (img) {
				img.onload = function(e) {
					promise.then(e.target);
				};
				img.src = doParse(getnexturl());
				img.parentNode.href = doParse(img.src);
			}
		},
		loader = function(caller, id) {
			var args = _.rest(arguments, 2);
			args = args.length ? args : [function () {}];
			loadImage(caller, id, new utils.FauxPromise(args));
		},
		makeToolTip = doComp(thrice(doMethod)('init')(null), ptL(gAlp.Tooltip, getThumbs, tooltip_msg, touchevents ? 0 : 2)),
		getValue = doComp(doVal, ptL(doubleGet, Looper, 'onpage')),
		showtime = doComp(ptL(klasRem, ['gallery'], getThumbs), ptL(klasAdd, ['showtime'], utils.getBody())),
		playtime = ptL(klasAdd, 'inplay', $('wrap')),
		playing = doComp(ptL(utils.doWhen, once(2), ptL(makeToolTip, true)), ptL(klasAdd, 'playing', main)),
		notplaying = ptL(klasRem, 'playing', main),
		exit_inplay = ptL(klasRem, 'inplay', $('wrap')),
		exitswap = ptL(klasRem, 'swap', utils.getBody()),
		exitshow = doComp(ptL(klasAdd, 'gallery', getThumbs), exitswap, ptL(klasRem, 'showtime', utils.getBody()), exit_inplay),
		undostatic = ptL(klasRem, 'static', $$('controls')),
		number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
		getEnvironment = ptL(utils.isDesktop, threshold),
		slide_player = {
			execute: function(page_index, picsrc) {
				var reordered = utils.shuffleArray(pages.getList())(page_index),
					mylscp = _.map(reordered, pages.getLscpPics),
					myptrt = _.map(reordered, pages.getPortraitPics),
					is_portrait = _.filter(myptrt, function(arr) {
						return _.find(arr, ptL(equalNum, picsrc));
					}),
					group = pages.doGroup(pages.fixPageOrder(pages.getLeadingGroup(myptrt, mylscp, !!is_portrait[0]), picsrc));
				Looper.onpage = Looper.from(_.map(group, makePath), doInc(getLength(group)));
			},
			undo: function(page_index) {
				/*restores on page iterator post slideshow
				if omitted manual navigation would cross page boundaries*/
				var page,
					gallery_pics,
					list = pages.getList();
				Looper.cross_page = Looper.from(list, doInc(getLength(list)));
				Looper.cross_page.set(page_index);
				page = Looper.cross_page.get();
				$LI.query(page);
				gallery_pics = _.filter(getAllPics(), function(img) {
					return !getLI(img).id;
				});
				_.each(gallery_pics, function(img, i) {
					populatePage(img, makePath(page[i]), 'src');
				});
				Looper.onpage = Looper.from(_.map(gallery_pics, function(img) {
					return img.src;
				}), doInc(getLength(gallery_pics)));
				Looper.onpage.find(getBaseSrc());
			}
		},
		in_play = thricedefer(doMethod)('findByClass')('inplay')(utils),
		do_page_iterator = function () {
			Looper.onpage = Looper.from(_.map(getAllPics(), function(img) {
				return img.src;
			}), doInc(getLength(getAllPics())));
		},
		get_play_iterator = function(flag) {
			/*
			//if we are inplay (ie pause or playing) we neither want to call enter or exit so a dummy object is returned
			var myint = pages.findInt(getBaseSrc),
				page_index = pages.findIndex(getBaseSrc),
				m = flag ? 'execute' : 'undo',
				slider = get_player();
			con(slider, in_play());
			slider[m](page_index, myint);
            */
		},
		setindex = function(arg) {
			if (!Looper.onpage) {
				do_page_iterator();
			}
			return Looper.onpage.find(arg);
		},
		nextcaller = twicedefer(getValue)('forward')(),
		prevcaller = twicedefer(getValue)('back')(),
		locator = function(forward, back) {
			var getLoc = function(e) {
				var box = e.target.getBoundingClientRect();
				return e.clientX - box.left > box.width / 2;
			};
			return function(e) {
				return utils.getBest(function(agg) {
					return agg[0](e);
				}, [
					[getLoc, forward],
					[utils.always(true), back]
				]);
			};
		},
		locate = eventing('click', event_actions.slice(0), function(e) {
			locator(twicedefer(loader)('base')(nextcaller), twicedefer(loader)('base')(prevcaller))(e)[1]();
			doOrient(e.target);
		}, getThumbs()),
		///slideshow...
		recur = (function(player) {
			function test() {
				return _.map([getBaseChild(), getSlideChild()], function(img) {
					return img && img.width > img.height;
				});
			}

			function doSwap() {
				var coll = test(),
					bool = coll[0] === coll[1],
					body = utils.getClassList(utils.getBody()),
					m = bool ? 'remove' : 'add';
				body[m]('swap');
				return !bool;
			}

			function doRecur() {
				player.inc();
				recur.t = window.requestAnimationFrame(recur.execute);
			}

			function doOpacity(flag) {
				var slide = $('slide'),
					val;
				if (slide) {
					val = flag ? 1 : recur.i / 100;
					val = cssopacity.getValue(val);
					doMap(slide, [
						[
							[cssopacity.getKey(), val]
						]
					]);
				}
			}

			function doSlide() {
				return loader(doComp(utils.drillDown(['src']), utils.getChild, utils.getChild, $$('base')), 'slide', doOrient);
			}
			var playmaker = (function () {
				var setPlayer = function(arg) {
						player = playmaker(arg);
						recur.execute();
					},
					doBase = function () {
						return loader(_.bind(Looper.onpage.play, Looper.onpage), 'base', setPlayer, doSwap);
					},
					fadeOut = {
						validate: function () {
							return recur.i <= -15.5;
						},
						inc: function () {
							recur.i -= 1;
						},
						reset: function () {
							doSlide();
							var body = utils.getClassList(utils.getBody());
							setPlayer(body.contains('swap'));
						}
					},
					fadeIn = {
						validate: function () {
							return recur.i >= 134.5;
						},
						inc: function () {
							recur.i += 1;
						},
						reset: function () {
							doBase();
						}
					},
					fade = {
						validate: function () {
							return recur.i <= -1;
						},
						inc: function () {
							recur.i -= 1;
						},
						reset: function () {
							recur.i = 150;
							doSlide();
							doOpacity();
							doBase();
							undostatic();
						}
					},
					actions = [fadeIn, fadeOut];
				return function(flag) {
					return flag ? actions.reverse()[0] : fade;
				};
			}());
			player = playmaker();
			return {
				execute: function () {
					if (!recur.t) {
						get_play_iterator(true);
					}
					if (player.validate()) {
						player.reset();
					} else {
						doOpacity();
						doRecur();
					}
				},
				undo: function(flag) {
					doOpacity(flag);
					window.cancelAnimationFrame(recur.t);
					recur.t = null;
				}
			};
		}({})),
		clear = _.bind(recur.undo, recur),
		doplay = _.bind(recur.execute, recur),
		go_execute = thrice(doMethod)('execute')(null),
		go_undo = thrice(doMethod)('undo')(null),
		$controller = makeDummy(),
		pages = {
			findIndex: function () {}
		},
		doExitShow = doComp(thrice(lazyVal)('undo')(slide_player), thricedefer(lazyVal)('findIndex')(pages)(getBaseSrc)),
		factory = function () {
			var remPause = doComp(utils.removeNodeOnComplete, $$('paused')),
				remSlide = doComp(utils.removeNodeOnComplete, $$('slide')),
				defer = defer_once(doAlt),
				doSlide = defer([clear, doplay]),
				doPlaying = defer([notplaying, playing]),
				doDisplay = defer([function () {}, playtime]),
				unlocate = thricedefer(doMethod)('undo')(null)(locate),
				invoke_player = deferEach([doSlide, doPlaying, doDisplay])(getResult),
				do_invoke_player = doComp(ptL(eventing, 'click', event_actions.slice(0, 2), invoke_player), getThumbs),
				relocate = ptL(lazyVal, null, locate, 'execute'),
				doReLocate = ptL(utils.doWhen, $$('base'), relocate),
				farewell = [notplaying, exit_inplay, exitswap, doComp(go_undo, utils.always($controller)), doReLocate, doExitShow, doComp(doOrient, $$('base')), deferEach([remPause, remSlide])(getResult)],
				next_driver = deferEach([get_play_iterator, defer_once(clear)(true), twicedefer(loader)('base')(nextcaller)].concat(farewell))(getResult),
				prev_driver = deferEach([get_play_iterator, defer_once(clear)(true), twicedefer(loader)('base')(prevcaller)].concat(farewell))(getResult),
				controller = function () {
					//make BOTH slide and pause but only make pause visible on NOT playing
					if (!$('slide')) {
						$controller = doMakeSlide('base', 'slide', go_execute, do_invoke_player, unlocate);
						doMakePause(getPausePath());
					}
				},
				COR = function(predicate, action) {
					var test = _.negate(ptL(equals, 'playbutton'));
					return {
						setSuccessor: function(s) {
							this.successor = s;
						},
						handle: function () {
							if (predicate.apply(this, arguments)) {
								return action.apply(this, arguments);
							} else if (this.successor) {
								return this.successor.handle.apply(this.successor, arguments);
							}
						},
						validate: function(str) {
							if (in_play() && recur.t && test(str)) {
								//return fresh instance on exiting slideshow IF in play mode
								clear();
								return factory();
							}
							return this;
						}
					};
				},
				mynext = COR(ptL(invokeArgs, equals, 'forwardbutton'), next_driver),
				myprev = COR(ptL(invokeArgs, equals, 'backbutton'), prev_driver),
				myplayer = COR(function () {
					controller();
					return true;
				}, invoke_player);
			myplayer.validate = function () {
				return this;
			};
			mynext.setSuccessor(myprev);
			myprev.setSuccessor(myplayer);
			recur.i = 50; //slide is clone of base initially, so fade can start quickly
			return mynext;
		}, //factory
		setup_val = doComp(thrice(doMethod)('match')(/img/i), node_from_target),
		$setup = {},
		setup = function(e) {
			doComp(setindex, utils.drillDown(['target', 'src']))(e);
			doComp(ptL(klasAdd, 'static'), thrice(doMapBridge)('id')('controls'), anCr(main))('section');
			doMakeBase(e.target.src, 'base', doOrient, getBaseChild, showtime);
			var buttons = ['backbutton', 'playbutton', 'forwardbutton'],
				aButton = anCr($('controls')),
				close_cb = ptL(doComp(utils.getDomParent(utils.getNodeByTag('main')), thrice(doMapBridge)('href')('.'), thrice(doMapBridge)('id')('exit'), anCrIn(getThumbs, main)), 'a'),
				dombuttons = _.map(buttons, doComp(thrice(doMapLateVal)('id'), aButton, thrice(doMethod)('slice')(-6))),
				dostatic = ptL(klasAdd, 'static', $$('controls')),
				chain = factory(),
				controls = eventing('click', event_actions.slice(0, 1), function(e) {
					var str = text_from_target(e),
						node = node_from_target(e);
					if (node.match(/button/i)) {
						//!!REPLACE the original chain reference, validate will return either the original or brand new instance
						chain = chain.validate(str);
						chain.handle(str);
					}
				}, $('controls')),
				controls_undostat = eventing('mouseover', [], undostatic, utils.getByTag('footer', document)[0]),
				controls_dostat = eventing('mouseover', [], dostatic, $('controls')),
				exit = eventing('click', event_actions.slice(0, 1), function(e) {
					//con(event_actions.slice(1, 2))
					if (e.target.id === 'exit') {
						chain = chain.validate('play');
						doExitShow();
						_.each([$('exit'), $('tooltip'), $('controls'), $('paused'), $('base'), $('slide')], utils.removeNodeOnComplete);
						exitshow();
						locate.undo();
						$setup.execute();
					}
				}, close_cb);
			//listeners...
			_.each(_.zip(dombuttons, buttons), invokeBridge);
			_.each([controls, exit, locate, controls_undostat, controls_dostat], go_execute);
			$setup.undo();
		};
	$setup = eventing('click', event_actions.slice(0, 2), ptL(utils.invokeWhen, setup_val, setup), main);
	$setup.execute();
	//cb = doComp(twice(invoke)(), ptL(utils.getBest, isImg, [doComp(setindex, getTarget), function (){}]));
	//eventing('click', event_actions.slice(0, 1), cb, getThumbs()).execute();
}(Modernizr.mq('only all'), '(min-width: 668px)', Modernizr.touchevents, '../images/resource/', /images[a-z\/]+\d+\.jpe?g$/, new RegExp('[^\\d]+\\d(\\d+)[^\\d]+$'), ["move mouse in and out of footer...", "...to toggle the display of control buttons"]));