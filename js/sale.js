/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global gAlp: false */
/*global _: false */
if (!window.gAlp) {
	window.gAlp = {};
}
(function (query, mq, touchevents, article, report, displayclass, linkEx, navExes, q468, q411, q375, q320, navtabs) {
	"use strict";

	function noOp() {}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}
    
    function existy(x) {
		return x != null;
	}

	function cat() {
		var head = _.first(arguments);
		if (existy(head)) {
			return head.concat.apply(head, _.rest(arguments));
		} else {
			return [];
		}
	}

	function makeAlternator(alts) {
		function Alternator(actions) {
			this.actions = gAlp.Util.doAlternate()(actions);
			return this;
		}
		Alternator.prototype = gAlp.Util.makeContext();
		Alternator.prototype.execute = function () {
			this.$command = this.actions.apply(this, arguments);
		};
		return new Alternator(alts);
	}
	/*   https://nullprogram.com/blog/2013/03/24/#:~:text=Generally%20to%20create%20a%20new,constructor%20function%20to%20this%20object.
	function create(constructor) {
		var Factory = constructor.bind.apply(constructor, arguments);
		return new Factory();
	}

	function partialize() {
		return _.partial.apply(null, _.rest(arguments));
	}
    
    function doReg(str) {
		return COMP(thrice(doMethod)('match'), twice(invoke)('i'), PTL(partialize, create, RegExp))(str);
	}
*/
	function equals(a, b) {
		return getResult(a) === getResult(b);
	}

	function add(a, b) {
		return a + b;
	}

	function gtThan(a, b) {
		return getResult(a) > getResult(b);
	}

	function lsThan(a, b) {
		return getResult(a) < getResult(b);
	}

	function onValidation() {
		var validators = _.toArray(arguments),
			result = 0;
		return function (fun, arg) {
			_.each(validators, function (validator) {
				if (!result) {
					//if passes set to zero
					result = Number(!validator(arg)) ? result += 1 : result;
				}
			});
			if (!result) {
				return fun(arg);
			}
			return arg;
		};
	}

	function checkDummy() {
		var val = gAlp.Util.getComputedStyle(document.getElementById("checkDummy"), "margin-top");
		return val === "1px";
		//return true;
	}

	function simpleInvoke(o, m, arg) {
		//gAlp.Util.report(o[m]);
		if (arguments.length >= 3) { //allow for superfluous arguments 
			return o[m](arg);
		}
	}

	function invoke(f) {
		return f.apply(null, _.rest(arguments));
	}

	function invokeBridge(fargs) {
		return invoke(fargs[0], fargs[1]);
	}

	function getterBridge(arr) {
		return gAlp.Util.getter(arr[1], arr[0]);
	}

	function invokeArg(f, arg) {
		return f(arg);
	}

	function caller(ctxt, ptl, arg, m) {
		return ptl(ctxt)[m](arg);
	}

	function doCallbacks(cb, coll, p) {
		return _[p](getResult(coll), cb);
	}

	function doMethod(o, v, p) {
		return o[p] && o[p](v);
	}

	function lazyVal(v, o, p) {
		return doMethod(o, v, p);
	}

	function modulo(n, i) {
		return i % n;
	}

	function increment(i) {
		return i + 1;
	}

	function sliceArray(list, end) {
		return list.slice(_.random(0, end || list.length));
		//return list.slice(0, -1);
	}
	var alpacas = [
			[
				["Granary Grace", "Price on Application"],
				["D.O.B.", "24.07.2005"],
				["Type", "Huacaya"],
				["Sex", "Female"],
				["Colour", "Fancy but mainly white"],
				["Sire", "Highlander Lad"],
				["Other Information"],
				["Grace is an assertive friendly animal, a herd leader. She is an excellent caring mother who has produced three excellent crias (one boy and two girls). She is currently empty but if required she could be covered by our own stud male Granary Carlos who has sired her two female crias. She carries the genetics of Both Highlander and Don Pedro. Price on application."],
				["alt", "Grace"],
				["src", "../images/sale/grace.jpg"]
			],
			[
				["Granary Maria", "Price on Application"],
				["D.O.B.", "12.08.2008"],
				["Type", "Huacaya"],
				["Sex", "Female (Maiden)"],
				["Colour", "Solid White"],
				["Sire", "Granary Carlos"],
				["Other Information"],
				["Unlike her mother (Grace) Maria is a gentle, curious hucaya who likes to be around humans. She is a well fleeced animal who carries the genetics of Highlander and Don Pedro. She is a maiden. Price on application."],
				["alt", "Maria"],
				["src", "../images/sale/Maria1.jpg"]
			],
			[
				["Granary Pilar", "Price on Application"],
				["D.O.B.", "26.08.2009"],
				["Type", "Huacaya"],
				["Sex", "Female"],
				["Colour", "Fancy but mainly white"],
				["Sire", "Granary Carlos"],
				["Other Information"],
				["Pilar is a strikingly marked animal, which goes well with her lively personality. She is well fleeced and good conformation. She is lively, loveable and a perfect pet a favourite with all who meet the herd. She is a maiden who carries the genes of Highlander and Don Pedro. Price on application."],
				["alt", "Pilar"],
				["src", "../images/sale/Pilar1.jpg"]
			],
			[
				["Granary Juanita", "Price on Application"],
				["D.O.B.", "29.07.2006"],
				["Type", "Huacaya"],
				["Sex", "Female"],
				["Colour", "Solid Dark Brown"],
				["Sire", "Somerset Peruvian Highlander Lad"],
				["Other Information"],
				["Juanita is a lovely natured&nbsp; huacaya who has just produced her first cria, a solid white female, born 13th July 2009. She is for sale with cria at foot and boasts background genetics of Highlander and Don Pedro."],
				["alt", "Juanita"],
				["src", "../images/sale/juanita.jpg"]
			],
			[
				["Newland Becky", "Price on Application"],
				["D.O.B.", "21.07.2004"],
				["Type", "Huacaya"],
				["Sex", "Female"],
				["Colour", "Solid  White"],
				["Sire", "Somerset Peruvian Highlander of Milend"],
				["Other Information"],
				["Becky is a proven breeding female (2) currently pregnant by Granary Carlos."],
				["alt", "Becky"],
				["src", "../images/sale/becky.jpg"]
			],
			[
				["Granary Enrico", "Price on Application"],
				["D.O.B.", "20.06.2007"],
				["Type", "Huacaya"],
				["Sex", "Male"],
				["Colour", "Solid White"],
				["Sire", "Farrlacey Ivan"],
				["Other Information"],
				["Enrico is a fine sturdy boy with a great fleece 18.5micron in 2008. Excellent stud potential."],
				["alt", "Rico"],
				["src", "../images/sale/rico.jpg"]
			]
		],
		captions = (function (coll) {
			return _.map(coll, function (sub) {
				return sub[0][0];
			});
		}(alpacas)),
		utils = gAlp.Util,
		//con = utils.con,
		PTL = _.partial,
		COMP = _.compose,
		ALWAYS = utils.always,
		event_actions = ['preventDefault', 'stopPropagation', 'stopImmediatePropagation'],
		myTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent) ? true : false,
		eventing = utils.eventer,
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
		allow = !touchevents ? 2 : 1,
		validator = utils.validator,
		alpacas_select = sliceArray(alpacas),
		alp_len = alpacas_select.length,
		/*bit lazy but ensures each extent (one alpaca, two alpaca, more.. has some class to add, defaults to intro which it already has, saves an ugly class of undefined*/
		lookup = {
			0: 'intro',
			1: 'intro',
			2: 'intro',
			3: 'intro',
			4: 'four',
			5: 'five',
			6: 'six'
		},
		nth = utils.getter(lookup, alp_len),
		curryFactory = utils.curryFactory,
		twice = curryFactory(2),
		twicedefer = curryFactory(2, true),
		thrice = curryFactory(3),
		curryfour = curryFactory(4),
		thricedefer = curryFactory(3, true),
		doMethodDefer = thricedefer(doMethod),
		delayMap = thrice(doCallbacks)('map'),
		deferMap = thricedefer(doCallbacks)('map'),
		deferEach = thricedefer(doCallbacks)('each'),
		deferIndex = thricedefer(doCallbacks)('findIndex'),
		deferEvery = thricedefer(doCallbacks)('every'),
		delayEvery = thrice(doCallbacks)('every'),
		delayExecute = thrice(doMethod)('execute')(null),
		doGet = twice(utils.getter),
		doMap = twice(utils.doMap),
		getZero = doGet(0),
		getOne = doGet(1),
		getLength = doGet('length'),
		anCr = utils.append(),
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		setAttrs = utils.setAttributes,
		$$ = thricedefer(lazyVal)('getElementById')(document),
		intro = utils.findByClass('intro'),
		getTarget = doGet(mytarget),
		getParent = doGet('parentNode'),
		isIMG = PTL(equals, 'IMG'),
		node_from_target = utils.drillDown([mytarget, 'nodeName']),
		text_from_target = utils.drillDown([mytarget, 'innerHTML']),
		number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
		isDesktop = _.partial(gtThan, window.viewportSize.getWidth, threshold),
		true_captions = doMethodDefer('slice')(-alp_len)(captions),
		delayNavListener = twice(PTL(eventing, 'click', []))($$('list')),
		deferNavListener = twicedefer(PTL(eventing, 'click', []))($$('list')),
		getTabIndex = COMP(deferIndex(PTL(utils.getByTag, 'a', $$('list'))), twice(equals)),
		reporter = PTL(utils.findByTag(0), 'h2', document),
        altWidths = [ALWAYS([[['width', '1024px']]]), ALWAYS([[['width', '600px']]])],
        simMaxWidth = gAlp.Util.doAlternate()(altWidths),
        doWrap = function () {},
		makeDisplayer = function (klas) {
			return {
				show: _.partial(klasAdd, klas),
				hide: _.compose(_.partial(klasRem, klas), _.partial(utils.findByClass, klas))
			};
		},
		makeAbbrv = function (tag, ancr, pred) {
			var split_space = thrice(doMethod)('split')(' '),
				Ab = function (el, i, j) {
					this.el = el;
					this.text = el.innerHTML;
					this.index = i;
					this.split = j;
				},
				undo = function () {
					var byTag = utils.findByTag(this.index),
						el = byTag(tag, ancr);
					el.innerHTML = this.text || el.innerHTML;
				},
				exec = function (el) {
					if (!isNaN(this.split)) {
						el = el || this.el;
						el.innerHTML = split_space(this.text)[this.split];
					}
				};
			if (_.isFunction(pred)) {
				Ab.prototype = {
					exec: exec,
					undo: undo
				};
			} else {
				Ab.prototype = {
					exec: function (el) {
						el = el || this.el;
						el.innerHTML = this.text.abbreviate();
					},
					undo: undo
				};
			}
			return function (el, i) {
				var j;
				if (_.isFunction(pred)) {
					j = pred() ? 1 : 0;
				}
				return new Ab(el, i, j);
			};
		},
		doHide = function (el) {
			utils.hide(el);
			utils.hide(utils.getPrevious(el));
		},
		getEnvironment = (function () {
			if (mq) {
				//return _.partial(Modernizr.mq, query);
				return isDesktop;
			} else {
				return isDesktop;
			}
		}()),
		gt4 = twicedefer(gtThan)(4)(alp_len),
		gt5 = twicedefer(gtThan)(5)(alp_len),
		gt3 = twicedefer(gtThan)(3)(alp_len),
		is4 = deferEvery([_.negate(gt4), gt3])(getResult),
		mob4 = deferEvery([is4, _.negate(isDesktop)])(getResult),
		reSyncCheck = deferEvery([is4, isDesktop])(getResult),
		getUL = PTL(utils.findByTag(0), 'ul', intro),
		configList = twice(utils.doMap)([
			['id', 'list']
		]),
		makeUL = COMP(invoke, PTL(utils.getBest, getUL, [getUL, COMP(configList, PTL(utils.insert()($$('sell'), intro), 'ul'))])),
		$looper = gAlp.Looper(),
		doCaption_cb = function (a, i) {
			var fig = twice(invokeArg)('figure'),
				caption = twice(invokeArg)('figcaption'),
				append = thrice(doMethod)('appendChild')(a),
				cap = utils.getter(captions.slice(-alp_len), i);
			_.compose(PTL(klasRem, 'tog'), PTL(klasAdd, 'extent'), PTL(utils.climbDom, 2), utils.setText(cap), caption, anCr, doGet('parentNode'), append, fig, anCr, $$('sell'), utils.hide)(a);
		},
		undoCaption_cb = function (a, i) {
			var sell = utils.$('sell'),
				goFig = PTL(utils.findByTag(0), 'figure', sell),
				showtable = PTL(utils.findByTag(i), 'table', sell),
				when = PTL(utils.doWhen, utils.hasClass('show', a), PTL(utils.show, showtable()));
			_.compose(when, utils.getPrevious, PTL(utils.insertAfter, a), showtable, utils.removeNodeOnComplete, goFig, PTL(klasRem, 'extent'), getParent, twice(invokeArg)(sell), thrice(doMethod)('appendChild'), _.identity)(a);
		},
		tab_cb = function (tgt) {
			var iDisplayer = gAlp.Intaface('Display', ['hide', 'show']),
				$displayer = makeDisplayer('current');
			gAlp.Intaface.ensures($displayer, iDisplayer);
			$displayer.hide();
			$displayer.show(getParent(tgt));
			//$looper.visit(COMP(utils.hide, utils.getPrevious, utils.hide));
			$looper.visit(doHide);
			COMP(_.bind($looper.set, $looper), getTabIndex(tgt))();
			COMP(utils.show, utils.getPrevious, utils.show, doGet('value'), _.bind($looper.status, $looper))();
		},
		tab_cb_bridge = PTL(COMP(delayExecute, delayNavListener), COMP(tab_cb, getTarget)),
		navBuilder = function (caption, i) {
			var li = twice(invokeArg)('li'),
				link = twice(invokeArg)('a'),
				doCurrent = PTL(utils.getBest, _.negate(ALWAYS(i)), [PTL(klasAdd, 'current'), _.identity]);
			COMP(utils.setText(caption), link, anCr, doCurrent, li, anCr, makeUL)();
			return getUL();
		},
		isLoop = doMethodDefer('findByClass')('loop')(utils),
		abbreviateTabs = function () {
			//return;
			if (!utils.findByClass('sell') || utils.findByClass('extent')) {
				return;
			}
			var finder = _.partial(utils.findByTag(0), 'ul', utils.findByTag(0)('main')),
				splitters = {
					2: '(max-width: 320px)',
					3: '(max-width: 600px)',
					4: '(max-width: 1060px)'
				},
				j = utils.findByClass('loop') ? 0 : 1,
                isLess = function (n) {
                    return window.viewportSize.getWidth() < n;
                },
                getThreshold = function (query) {
                    return Number(query.match(new RegExp('[^\\d]+(\\d+)[^\\d]+'))[1]);
                },
                doCheck = COMP(isLess, getThreshold),
                tgt = j ? q375 : q468,
				///action = Modernizr.mq(tgt) ? 'exec' : 'undo',
				action = doCheck(tgt) ? 'exec' : 'undo',
				//TEMP(?) FIX to missing id of list on UL
				//list = utils.$('list') || COMP(doMap([['id', 'list']]), getUL)(),
				list = utils.$('list'),
				tabs = list.getElementsByTagName('a'),
				factory,
				split,
				cb;
			if (!navtabs[0]) {
				factory = makeAbbrv('a', $$('list'), PTL(utils.findByClass, 'tab'));
				cb = function (el, i) {
					return factory(el, i, j);
				};
				navtabs = _.map(tabs, cb);
			}
			if (j === 0) {
				/*default is to set the abbreviation to first word (j === 0) in loop scenario
				where as alpaca name is the second (so j should be set to 1, setting to undefined does not perform abbreviation
                and we'll elect to go with this on the Alpaca name as otherwise we would need to run abbreviateTabs every time we advance which means setting a fresh array of Ab instances each time and setting split preferences. As it stands we only abbreviate on load or resize
				*/
				navtabs[0].split = doCheck(q411) ? 0 : undefined;
				navtabs[1].split = undefined; //ie isNaN so no splitting
				navtabs[2].split = doCheck(q468) ? 0 : undefined;
			} else {
				if (splitters[alp_len]) {
					split = doCheck(splitters[alp_len]) ? 1 : split;
					action = doCheck(splitters[alp_len]) ? 'exec' : 'undo';
				}
				navtabs = _.map(navtabs, function (o) {
					o.split = split;
					return o;
				});
			}
			_.each(navtabs, function (map, i) {
				navtabs[i][action](tabs[i]);
			});
		},
		doInc = function (n) {
			return COMP(PTL(modulo, n), increment);
		},
		incrementer = _.compose(doInc, getLength),
		doLoop = function (coll) {
			if (coll && typeof coll.length !== 'undefined') {
				$looper.build(coll, incrementer);
			}
		},
		selldiv = COMP(doMap([
			['id', 'sell']
		]), PTL(anCr(intro), 'div')),
		makeToolTip = PTL(gAlp.Tooltip, article, ["click table/picture", "to toggle the display"], allow, true),
		toolTipDefer = thricedefer(doMethod)('init')()(makeToolTip()),
		doToolTip = PTL(utils.doWhen, PTL(utils.findByClass, 'tab'), toolTipDefer),
		checkDataLength = validator('no alpacas for sale', ALWAYS(alp_len)),
		checkJSenabled = validator('javascript is not enabled', checkDummy),
		maybeLoad = utils.silent_conditional(checkDataLength, checkJSenabled),
		renderTable_CB = COMP(anCr(selldiv), ALWAYS('table')),
		iterateTable = function (getId, getPath, doFreshRow, doSpan, doDescription, doOddRow) {
			return function (getAnchor, subject, k) {
				var table = getAnchor(), //<table></table
					render = anCr(table),
					tbody = COMP(render, PTL(_.identity))('tbody'),
					c = curryfour(caller)('match')(/^other/i)(utils.drillDown(['innerHTML'])),
					addspan,
					doRow = COMP(anCr(tbody)),
					tableconfig = {
						cellspacing: 0
					},
					addTableAttrs = {},
					addImgAttrs = {},
					addLinkAttrs = {},
					tmp;
				_.each(subject.slice(0, -2), function (tr, j) {
					var row,
						type = !j ? 'th' : 'td',
						supportsNthChild = validator('hard coding class not required', ALWAYS(!Modernizr.nthchild)),
						isOdd = validator('is not an odd numbered row', ALWAYS(j % 2)),
						isFirstRow = PTL(validator, 'is NOT first row'),
						isTableHead = PTL(validator, 'is NOT table head'),
						dospan = PTL(COMP(PTL(utils.isEqual, 1), utils.drillDown(['length']))),
						doOdd = onValidation(supportsNthChild, isOdd),
						provisionalID,
						assignId = function (str) {
							addImgAttrs.alt = getId(str);
							addTableAttrs = PTL(setAttrs, tableconfig);
						},
						maybeClass = PTL(onValidation(validator('no match found', c), supportsNthChild), doDescription);
					_.each(tr, function (td, i, data) {
						//partially apply the RETURNED function from onValidation with (partially applied) function to invoke
						addspan = PTL(onValidation(validator('is NOT a single column row', PTL(dospan, data))), doSpan);
						row = row || doFreshRow(PTL(doRow, 'tr'), i);
						provisionalID = onValidation(isFirstRow(ALWAYS(Number(!i))), isTableHead(PTL(utils.isEqual, type, 'th')));
						provisionalID(PTL(assignId, td));
						COMP(maybeClass, addspan, utils.setText(td), anCr(row))(type);
						doOdd(COMP(doOddRow, ALWAYS(row)));
					});
				});
				render = anCr(table.parentNode);
				addLinkAttrs = _.extend(addLinkAttrs, {
					href: getPath(subject)
				});
				addLinkAttrs = PTL(setAttrs, addLinkAttrs);
				addImgAttrs = _.extend(addImgAttrs, {
					src: getPath(subject)
				});
				addImgAttrs = PTL(setAttrs, addImgAttrs);
				tmp = COMP(addLinkAttrs, render, ALWAYS('a'))();
				render = anCr(tmp);
				COMP(addImgAttrs, render, ALWAYS('img'))();
				addTableAttrs(table);
				if (!k && !gt4() && !mob4()) {
					utils.show(table);
					utils.show(tmp);
				}
			};
		},
		doLoad = function (coll, cb) {
			var loadData = function (data, render, driver) {
					_.each(data, PTL(driver, render));
				},
				getId = COMP(PTL(utils.byIndex, 1), thrice(simpleInvoke)(' ')('split')),
				doRow = onValidation(validator('is first row', PTL(utils.isEqual, 0))),
				doColspan = PTL(setAttrs, {
					colSpan: 2 //!!!!////camelCase!!!!
				}),
				doMap = twice(utils.doMap),
				getPath = function (array) {
					return array.slice(-1)[0][1];
				},
				configTable_CB = iterateTable(getId, getPath, doRow, doColspan, PTL(klasAdd, 'description'), PTL(klasAdd, 'odd'));
			loadData(coll, cb, configTable_CB);
			klasAdd('sell', utils.getBody);
			return true;
		},
		addLoopClass = PTL(klasAdd, 'loop', makeUL),
		remLoopClass = PTL(klasRem, 'loop', makeUL),
		addTabClass = PTL(klasAdd, 'tab', makeUL),
		remTabClass = PTL(klasRem, 'tab', makeUL),
		outcomes = [
			[gt4, COMP(remTabClass, addLoopClass)],
			[mob4, COMP(remTabClass, addLoopClass)],
			[ALWAYS(alp_len), COMP(remLoopClass, addTabClass)],
			[ALWAYS(true), function () {}]
		],
		addULClass = COMP(invoke, getOne, PTL(utils.getBestOnly, COMP(invoke, getZero), outcomes)),
		navoutcomes = delayMap(_.map(navExes, thrice(doMethod)('match'))),
		deleteListFromCache = thricedefer(doMethod)('erase')(false)(utils.eventCache),
		getListFromCache = thricedefer(doMethod)('getList')(true)(utils.eventCache),
		//may need a more robust version than this as a state test
		willDeleteListFromCache = PTL(utils.doWhen, PTL(equals, 3, getListFromCache), deleteListFromCache),
		$toggle = eventing('click', event_actions.slice(0), PTL(utils.toggleClass, 'tog', utils.$('sell')), utils.$('sell')),
		undoToggle = thricedefer(doMethod)('undo')(null)($toggle),
		goSetCaptions = function () {
			if (utils.findByClass('extent') && myTouch) {
				var doBest = utils.getBest,
					isLess = twice(lsThan),
					isGranary = thrice(doMethod)('match')(/^Granary|^Newland/),
					getSellWidth = COMP(Math.floor, parseFloat, PTL(utils.getComputedStyle, utils.$('sell'), 'width')),
					getCaption = PTL(utils.findByTag(0), 'figcaption'),
					lscp = isLess(430),
					ptrt = isLess(300),
					longhand = COMP(isGranary, COMP(doGet('innerHTML'), getCaption)),
					lsThan430 = deferEvery([COMP(lscp, getSellWidth), gt5, longhand])(getResult),
					gtThan430 = deferEvery([_.negate(COMP(lscp, getSellWidth)), _.negate(longhand)])(getResult),
					lsThan300 = deferEvery([COMP(ptrt, getSellWidth), gt4, longhand])(getResult),
					gtThan300 = deferEvery([_.negate(COMP(ptrt, getSellWidth)), _.negate(longhand)])(getResult),
					queryWidthExec = COMP(invoke, PTL(doBest, PTL(Modernizr.mq, '(orientation: portrait)'), [lsThan300, lsThan430])),
					queryWidthUndo = COMP(invoke, PTL(doBest, PTL(Modernizr.mq, '(orientation: portrait)'), [gtThan300, gtThan430])),
					captions = utils.getByTag('figcaption'),
					deferCaptions = deferMap(captions),
					deferTextCB = twice(_.map)(utils.setText),
					preZip = twice(_.zip)(captions),
					resetCaptions = COMP(invoke, PTL(utils.getBest, thrice(doMethod)('match')(/ecky$/), [PTL(add, 'Newland '), PTL(add, 'Granary ')])),
					deferSubString = COMP(deferTextCB, deferCaptions(COMP(thrice(doMethod)('substring')(8), doGet('innerHTML')))),
					zipSubString = COMP(preZip, deferSubString),
					zipUndo = COMP(preZip, COMP(deferTextCB, deferCaptions(COMP(resetCaptions, doGet('innerHTML'))))),
                    //a string is partially applied to utils.setText, then called with an element, we zip up the partial function and the final (element) argument
					preInvoke = COMP(twice(_.each)(invokeBridge), invoke);
				if (queryWidthExec()) {
					preInvoke(zipSubString);
				} else if (queryWidthUndo()) {
					preInvoke(zipUndo);
				}
			}
		},
		factory = function () {
			maybeLoad(PTL(doLoad, alpacas_select, renderTable_CB));
			doLoop(utils.getByTag('a', intro));
			var deferMembers = deferEach($looper.get('members')),
				makeCaptions = deferMembers(doCaption_cb),
				bindCurrent = _.bind($looper.status, $looper),
				makeTabs = COMP(tab_cb_bridge, deferEach(true_captions)(navBuilder)),
				doFind = _.bind($looper.find, $looper),
				goGetValue = COMP(doGet('value'), bindCurrent),
				goGetIndex = COMP(doGet('index'), bindCurrent),
				prepLoopTabs = COMP(thrice(doMethod)('concat')('Next Alpaca'), thrice(lazyVal)('concat')(['Alpacas For Sale']), getterBridge, deferMap([COMP(goGetIndex, doFind), true_captions])(getResult)),
				makeLoopTabs = deferEach(prepLoopTabs)(navBuilder),
				captionsORtabs = [
					[gt4, makeCaptions],
					[mob4, makeCaptions],
					[ALWAYS(alp_len), makeTabs],
					[ALWAYS(true), function () {}]
				],
				$divcontext = utils.makeContext().init(),
				showCurrent = COMP(utils.show, utils.getPrevious, utils.show, doGet('value')),
				deferShow = COMP(showCurrent, _.bind($looper.forward, $looper)),
				deferNext = COMP(deferShow, deferMembers(doHide)),
				/* restoreCaptions: exit loop mode removing listners from cache, directly through $toggle.undo, indirectly through utils.eventCache, removing toggle first as false is used as argument to target last listener object in list and we need to make sure the last listener object deals with the navigation ul*/
				//UPDATE: BUT ul needs restoring on rturn to gallery mode(makeUL)
				restoreCaptions = COMP(delayExecute, ALWAYS($divcontext), goSetCaptions, addULClass, deleteListFromCache, undoToggle, makeCaptions, utils.hide, PTL(utils.findByClass, 'show')),
				getNameTab = PTL(utils.findByTag(1), 'a', $$('list')),
				loopevents = [COMP(invoke, twice(COMP)(getNameTab), utils.setText, PTL(utils.getter, true_captions), goGetIndex, doFind, deferNext),
					restoreCaptions,
					noOp,
					noOp
                             ],
				find_onclick = COMP(goGetValue, doFind, getParent, getTarget),
				remove_extent = COMP(PTL(klasRem, 'extent'), PTL(utils.climbDom, 2), utils.show),
				loop_listener = COMP(invoke, getOne, PTL(utils.getBest, COMP(_.identity, getZero)), twice(_.zip)(loopevents), navoutcomes, twice(invoke), text_from_target),
				$loop_listener = deferNavListener(loop_listener),
				prep_loop_listener = COMP(delayExecute, $loop_listener, addLoopClass, makeLoopTabs),
				/*
				When resizing between mobile and desktop environments we need to produce the correct navigation tabs when the number of Alpacas is four (<4 tab, >4 loop, 4 alternate)
				and so it's a great case for alternating between two tab builders. IF resize takes place when in gallery mode
				the alternating strategies will be out of sync, so we must create anew. $tabcontext delegates the alternating behaviour to a class of Alternator whose execute method delegates to a two member array of strategies
				*/
				reLoop = COMP(delayExecute, $loop_listener, addULClass, makeLoopTabs, makeUL, deleteListFromCache),
				reTab = COMP(makeTabs, addULClass, makeUL, willDeleteListFromCache),
				tabFirst = [reTab, reLoop],
				tabCBS = getEnvironment() ? [reLoop, reTab] : tabFirst,
				$tabcontext = utils.makeContext().init(makeAlternator(tabCBS)),
				setTabStrategy = thrice(lazyVal)('set')($tabcontext),
				setTabContext = COMP(delayExecute, setTabStrategy, makeAlternator),
				prepTabs = PTL(utils.getBest, reSyncCheck, [PTL(setTabContext, tabFirst), prep_loop_listener]),
				doDisplay = PTL(utils.invokeWhen, COMP(isIMG, node_from_target), COMP(ALWAYS($toggle), toolTipDefer, abbreviateTabs, invoke, prepTabs, deferMembers(undoCaption_cb), remove_extent, find_onclick)),
				$selector = eventing('click', event_actions.slice(0), function (e) {
					var $toggler = doDisplay(e),
						iCommand = gAlp.Intaface('Command', ['execute', 'undo']);
					if ($toggler) { //image was clicked
						gAlp.Intaface.ensures($toggler, iCommand);
						$selector.undo();
						$toggler.execute(true); //unshift to maintain nav as LAST listener
					}
				}, utils.$('sell')),
				negate = function (cb) { /////////////
					if (!getEnvironment()) {
                        doWrap();
						getEnvironment = _.negate(getEnvironment);
						if (is4()) {
							cb(); //will only run in sell AND NOT extent mode
							//set when going from desktop to mobile, so that if exiting into gallery mode, correct listener will be restored
							$divcontext.set(utils.getBest(isLoop, [$selector, $toggle]));
							navtabs = [];
						}
					}
					goSetCaptions();
					abbreviateTabs();
				},
				throttler = function (cb) {
					negate(noOp); //onload
					var pred = deferEvery([_.negate(PTL(utils.findByClass, 'extent')), PTL(utils.findByClass, 'sell')])(getResult),
						doCallback = PTL(utils.doWhen, pred, cb);
					eventing('resize', [], _.throttle(_.partial(negate, doCallback), 66), window).execute(true);
				};
			addULClass();
			klasAdd([nth], intro);
			//$divcontext persists and DELEGATES to current $listener($selector, $toggle)
			$divcontext.set(utils.getBest(isLoop, [$selector, $toggle])).execute();
			utils.getBest(COMP(invoke, getZero), captionsORtabs)[1](); //nav listener LAST!
			throttler(_.bind($tabcontext.execute, $tabcontext)); //resize listener unshift to front of eventcache list
			doToolTip();
			utils.highLighter.perform();
			goSetCaptions();
		};
	//gAlp.Util.eventCache.triggerEvent(utils.$('sell'), 'click');
	factory();
    /*
    var ar = [],
        tmp = COMP(doGet('innerHTML'), reporter),
        doCat = COMP(twice(cat), PTL(invoke, tmp)),
        exec = COMP(thrice(lazyVal)('push')(ar), doGet(0), thrice(doMethod)('split')(' '), tmp),
        undo = COMP(utils.con, doCat, thricedefer(doMethod)('shift')(null)(ar));
        exec();
        undo();
   */
	(function () {
		var el = utils.findByTag(0)('header'),
			box = el.getBoundingClientRect(),
			w = box.width || box.right - box.left,
			home = 'url(assets/header_ipad.png)',
			other = 'url(../assets/header_ipad.png)',
			swap = utils.$('welcome') ? home : other;
		if (w > 960) {
			utils.doMap(el, [
				[
					['background-image', swap]
				]
			]);
		}
	}());
    if (alp_len && !Modernizr.inlinesvg && !Modernizr.touchevents) {
        //doWrap = COMP(PTL(utils.doMap, utils.$('wrap')), simMaxWidth);
        doWrap();
    }
}('(min-width: 769px)', Modernizr.mq('only all'), Modernizr.touchevents, document.getElementsByTagName('article')[0], document.getElementsByTagName('h2')[0], 'show', /\/([a-z]+)\d?\.jpg$/i, [/^next/i, /^alpacas/i, new RegExp('^[^<]', 'i'), /^</], '(max-width: 468px)', '(max-width: 411px)', '(max-width: 375px)', '(max-width: 320px)', []));
/*
CRUCIAL TO MANAGE EVENT LISTENERS, ADDING AND REMVOVING AS REQUIRED, THIS MAINLY AFFECTS SWITCHING FROM LOOP TO TAB SCENARIO, WHICH (CURRENTLY) ONLY AFFECTS AN EXTENT OF 4 ALPACAS, EVENT HANDLERS ARE ADDED WITH EXECUTE $listener.execute AND REMOVED WITH UNDO $listener.undo BUT CAN INDIRECTLY BE CALLED BY REMOVING FROM UTILS.EVENTCACHE CALLING DELETE WITH false ENSURES THE LAST ADDED EVENT HANDLER GETS DELETED V USEFUL IN THIS SETUP
*/