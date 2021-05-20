/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global gAlp: false */
/*global _: false */
if (!window.gAlp) {
	window.gAlp = {};
}
(function (query, mq, touchevents, article, report, displayclass, linkEx, navExes) {
	"use strict";

	function noOp() {}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function hide(el) {
		gAlp.Util.hide(el);
		gAlp.Util.hide(gAlp.Util.getPrevious(el));
	}

	function equals(a, b) {
		return getResult(a) === getResult(b);
	}

	function gtThan(a, b) {
		return getResult(a) > getResult(b);
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

	function precomp(f1, f2) {
		return _.compose(f2, f1);
	}

	function doMethod(o, v, p) {
		//console.log(arguments);
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
	}
    
    function inRange(coll, i){
        return coll[i + 1];
    }
    
    function makeDisplayer(klas){
        
        return {
            show: _.partial(klasAdd, klas),
            hide: _.compose(_.partial(klasRem, klas), _.partial(utils.findByClass, klas))
        };
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
				["D.O.B.", "29.072006"],
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
		loop_captions = ['Alpacas For Sale'],
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
		eventing = utils.eventer,
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
        allow = !touchevents ? 2 : 0,
		validator = utils.validator,
		alpacas_select = sliceArray(alpacas),
		alp_len = alpacas_select.length,
        /*bit lazy but ensures each extent (one alpaca, two alpaca, more.. has some class to add, defaults to intro which it already has, saves an ugly class of undefined*/
		lookup = {
			1: 'intro',
			2: 'intro',
			3: 'intro',
			4: 'four',
			5: 'five',
			6: 'six'
		},
		nth = utils.getter(lookup, alp_len),
		curryFactory = utils.curryFactory,
		defer_once = curryFactory(1, true),
		twice = curryFactory(2),
		twicedefer = curryFactory(2, true),
		thrice = curryFactory(3),
		thriceplus = curryFactory(4),
		thricedefer = curryFactory(3, true),
		doMethodDefer = thricedefer(doMethod),
        delayMap = thrice(doCallbacks)('map'),
		deferMap = thricedefer(doCallbacks)('map'),
		deferEach = thricedefer(doCallbacks)('each'),
		deferIndex = thricedefer(doCallbacks)('findIndex'),
		deferEvery = thricedefer(doCallbacks)('every'),
		anCr = utils.append(),
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		byIndex = utils.byIndex,
		setAttrs = utils.setAttributes,
		$$ = thricedefer(lazyVal)('getElementById')(document),
		doGet = twice(utils.getter),
		getZero = doGet(0),
		getOne = doGet(1),
		getTarget = doGet(mytarget),
		getParent = doGet('parentNode'),
		doAlt = COMP(twice(invoke)(null), utils.getZero, thrice(doMethod)('reverse')(null)),
		isIMG = PTL(equals, 'IMG'),
		number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
		isDesktop = _.partial(gtThan, window.viewportSize.getWidth, threshold),
		node_from_target = utils.drillDown([mytarget, 'nodeName']),
		text_from_target = utils.drillDown([mytarget, 'innerHTML']),
		intro = utils.findByClass('intro'),
		true_captions = doMethodDefer('slice')(-alp_len)(captions),
        indexFromTab = deferIndex(true_captions()),
		gt4 = twicedefer(gtThan)(4)(alp_len),
		gt3 = twicedefer(gtThan)(3)(alp_len),
		mob4 = deferEvery([_.negate(gt4), gt3, _.negate(isDesktop)])(getResult),
		getEnvironment = (function () {
			if (mq) {
				return _.partial(Modernizr.mq, query);
			} else {
				return isDesktop;
			}
		}()),
		getUL = PTL(utils.findByTag(0), 'ul', intro),
		makeUL = COMP(invoke, PTL(utils.getBest, getUL, [getUL, COMP(PTL(setAttrs, {
			id: 'list'
		}), PTL(utils.insert()($$('sell'), intro), 'ul'))])),
		Looper = gAlp.LoopIterator,
		doCaption_cb = function (a, i) {
			var fig = twice(invokeArg)('figure'),
				caption = twice(invokeArg)('figcaption'),
				append = thrice(doMethod)('appendChild')(a),
				cap = utils.getter(captions.slice(-alp_len), i);
			_.compose(PTL(klasAdd, 'extent'), PTL(utils.climbDom, 2), utils.setText(cap), caption, anCr, doGet('parentNode'), append, fig, anCr, $$('sell'), utils.hide)(a);
		},
		undoCaption_cb = function (a, i) {
			var sell = utils.$('sell'),
				goFig = PTL(utils.findByTag(0), 'figure', sell),
				showtable = PTL(utils.findByTag(i), 'table', sell),
				when = PTL(utils.doWhen, utils.hasClass('show', a), PTL(utils.show, showtable()));
			_.compose(when, utils.getPrevious, PTL(utils.insertAfter, a), showtable, utils.removeNodeOnComplete, goFig, PTL(klasRem, 'extent'), getParent, twice(invokeArg)(sell), thrice(doMethod)('appendChild'), _.identity)(a);
		},
		tab_cb = function (pred, displayer, tgt, matcher) {
			if (getResult(pred)) {
                displayer.hide();
                displayer.show(tgt);
				Looper.onpage.visit(utils.hide);
				COMP(_.bind(Looper.onpage.set, Looper.onpage),  indexFromTab(matcher))();
				COMP(utils.show, utils.getPrevious, utils.show, doGet('value'), _.bind(Looper.onpage.current, Looper.onpage))();
			}
		},
		doLI_cb = function (caption, i, arr) {
			var li = twice(invokeArg)('li'),
				link = twice(invokeArg)('a'),
				doCurrent = PTL(utils.getBest, _.negate(ALWAYS(i)), [PTL(klasAdd, 'current'), _.identity]);
			COMP(utils.setText(caption), link, anCr, doCurrent, li, anCr, getUL)();
			/*don't add listener if only one tab, if in loop layout and only add it once so wait until last item as this is called in a loop */
			if (i && !inRange(arr, i)) {
                eventing('click', [], function (e) {
                    tab_cb(PTL(utils.findByClass, 'tab'), makeDisplayer('current'), COMP(getParent, getTarget)(e), thrice(doMethod)('match')(new RegExp(text_from_target(e), 'i')));
				}, getUL).execute();
			}
		},
		doInc = function (n) {
			return COMP(PTL(modulo, n), increment);
		},
		doLoop = function (coll) {
			Looper.onpage = Looper.from(coll, doInc(doGet('length')(coll)));
		},
		makeTabs = deferEach(true_captions)(doLI_cb),
		selldiv = COMP(PTL(setAttrs, {
			id: 'sell'
		}), PTL(anCr(intro), 'div')),
        makeToolTip = PTL(gAlp.Tooltip, article, ["click table/picture", "to toggle the display"], allow),
		checkDataLength = validator('no alpacas for sale', ALWAYS(alp_len)),
		checkJSenabled = validator('javascript is not enabled', checkDummy),
		maybeLoad = utils.silent_conditional(checkDataLength, checkJSenabled),
		renderTable_CB = COMP(anCr(selldiv), ALWAYS('table')),
		iterateTable = function (getId, getPath, doFreshRow, doSpan, doDescription, doOddRow) {
			return function (getAnchor, subject, k) {
				var table = getAnchor(), //<table></table
					render = anCr(table),
					tbody = COMP(render, PTL(_.identity))('tbody'),
					c = thriceplus(caller)('match')(/^other/i)(utils.drillDown(['innerHTML'])),
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
				getId = COMP(PTL(byIndex, 1), thrice(simpleInvoke)(' ')('split')),
				doRow = onValidation(validator('is first row', PTL(utils.isEqual, 0))),
				doColspan = PTL(setAttrs, {
					colSpan: 2 //!!!!////camelCase!!!!
				}),
				getPath = function (array) {
					return array.slice(-1)[0][1];
				},
				configTable_CB = iterateTable(getId, getPath, doRow, doColspan, PTL(klasAdd, 'description'), PTL(klasAdd, 'odd'));
			loadData(coll, cb, configTable_CB);
			klasAdd('sell', utils.getBody);
			return true;
		},
		addLoopClass = PTL(klasAdd, 'loop', makeUL),
		addTabClass = PTL(klasAdd, 'tab', makeUL),
		outcomes = [
			[gt4, addLoopClass],
			[mob4, addLoopClass],
			[ALWAYS(alp_len), addTabClass],
			[ALWAYS(true), function () {}]
		],
		addULClass = COMP(invoke, getOne, PTL(utils.getBestOnly, COMP(invoke, getZero), outcomes)),
		navoutcomes = delayMap(_.map(navExes, thrice(doMethod)('match'))),
		delayExecute = thrice(doMethod)('execute')(null),
		delayUndo = thrice(doMethod)('undo')(null),
		$toggle = eventing('click', event_actions.slice(0), PTL(utils.toggleClass, 'tog', utils.$('sell')), utils.$('sell')),
		factory = function () {
			maybeLoad(PTL(doLoad, alpacas_select, renderTable_CB));
			doLoop(utils.getByTag('a', intro));
			Looper.onpage.visit = function (cb) {
				_.each(this.group.members, cb);
				_.each(_.map(this.group.members, utils.getPrevious), cb);
			};
			var members = Looper.onpage.current().members,
				deferMembers = deferEach(members),
				deferAlt = defer_once(doAlt),
				makeCaptions = deferMembers(doCaption_cb),
				bindCurrent = _.bind(Looper.onpage.current, Looper.onpage),
				captionsORtabs = [
					[gt4, makeCaptions],
					[mob4, makeCaptions],
					[ALWAYS(alp_len), makeTabs],
					[ALWAYS(true), function () {}]
				],
				showCurrent = COMP(utils.show, utils.getPrevious, utils.show, doGet('value')),
				deferShow = COMP(showCurrent, _.bind(Looper.onpage.forward, Looper.onpage)),
				deferNext = COMP(deferShow, deferMembers(hide)),
				doFind = _.bind(Looper.onpage.find, Looper.onpage),
				goGetValue = COMP(doGet('value'), bindCurrent),
				goGetIndex = COMP(doGet('index'), bindCurrent),
				restoreCaptions = COMP(addULClass, delayExecute, twice(invoke)(utils), PTL(utils.drillDown, ['eventer', 'club', 1]), delayUndo, ALWAYS($toggle), PTL(utils.removeNodeOnComplete, $$('list')), makeCaptions, utils.hide, PTL(utils.findByClass, 'show')),
				prepLoopTabs = COMP(thrice(doMethod)('concat')('Next Alpaca'), thrice(lazyVal)('concat')(loop_captions), getterBridge, deferMap([COMP(goGetIndex, doFind), true_captions])(getResult)),
				makeLoopTabs = deferEach(prepLoopTabs)(doLI_cb),
				events = [COMP(invoke, PTL(precomp, PTL(utils.findByTag(1), 'a', $$('list'))), utils.setText, PTL(utils.getter, true_captions), goGetIndex, doFind, deferNext),
					restoreCaptions,
					noOp, noOp
                         ],
				nav_listener = COMP(invoke, getOne, PTL(utils.getBest, COMP(_.identity, getZero)), twice(_.zip)(events), navoutcomes, twice(invoke), text_from_target),
				$nav_listener = PTL(eventing, 'click', [], nav_listener, $$('list')),
				doDisplay = PTL(utils.invokeWhen, COMP(isIMG, node_from_target), COMP(ALWAYS($toggle), delayExecute, $nav_listener, makeLoopTabs, deferMembers(undoCaption_cb), PTL(klasRem, 'extent'), PTL(utils.climbDom, 2), utils.show, goGetValue, doFind, getParent, getTarget)),
				reLoop = COMP(delayExecute, $nav_listener, addULClass, makeLoopTabs, makeUL, utils.removeNodeOnComplete, $$('list')),
				reTab = COMP(addULClass, makeTabs, makeUL, utils.removeNodeOnComplete, $$('list')),
				tabCBS = getEnvironment() ? [reTab, reLoop] : [reLoop, reTab],
				reDoTabs = deferAlt(tabCBS),
				negate = function (cb) {
					if (!getEnvironment()) {
						getEnvironment = _.negate(getEnvironment);
						cb();
					}
				},
				throttler = function (callback) {
					negate(noOp);
					var pred = deferEvery([_.negate(PTL(utils.findByClass, 'extent')), PTL(utils.findByClass, 'sell')])(getResult),
						doCallback = PTL(utils.doWhen, pred, callback);
					eventing('resize', [], _.throttle(_.partial(negate, doCallback), 66), window).execute();
				},
				$displayer = eventing('click', event_actions.slice(0), function (e) {
					var $toggler = doDisplay(e);
					if ($toggler) {
						$displayer.undo();
						$toggler.execute();
					}
				}, utils.$('sell'));
			addULClass();
			klasAdd([nth], intro);
			utils.getBest(COMP(invoke, getZero), captionsORtabs)[1]();
			if (utils.findByClass('loop')) {
				$displayer.execute();
			} else {
				$toggle.execute();
			}
			throttler(reDoTabs);
            makeToolTip().init();
            //utils.highLighter.perform();
		};
	factory();
}('(min-width: 769px)', Modernizr.mq('only all'), Modernizr.touchevents, document.getElementsByTagName('article')[0], document.getElementsByTagName('h2')[0], 'show', /\/([a-z]+)\d?\.jpg$/i, [/^next/i, /sale$/i, new RegExp('^[^<]', 'i'), /^</]));