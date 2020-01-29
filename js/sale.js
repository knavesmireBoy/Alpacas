/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global gAlp: false */
/*global _: false */
if (!window.gAlp) {
	window.gAlp = {};
}
(function(query, mq, touchevents, article, report, displayclass, linkEx, navExes, limits) {
	"use strict";

	function noOp() {}

	function doRepeat() {
		return function(i) {
			return function() {
				var res = i > 0;
				i -= 1;
				return res > 0;
			};
		};
	}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function gtThan(a, b) {
		return getResult(a) > getResult(b);
	}

	function lsThanEq(a, b) {
		return a <= b;
	}

	function callWith(m, ctxt) {
		return m.call(ctxt);
	}

	function onValidation() {
		var validators = _.toArray(arguments),
			result = 0;
		return function(fun, arg) {
			_.each(validators, function(validator) {
				if (!result) {
					//if passes set to zero
					result = Number(!validator(arg)) ? result += 1 : result;
				}
			});
			if (!result) {
				return fun(arg);
			}
			//report.innerHTML = arg && arg.innerHTML;  
			return arg;
		};
	}

	function checkDummy() {
		var val = gAlp.Util.getComputedStyle(document.getElementById("checkDummy"), "margin-top");
		return val === "1px";
		//return true;
	}

	function getProp(p, o) {
		return o[p];
	}

	function stringOp(reg, o, m) {
		return o[m](reg);
	}

	function simpleInvoke(o, m, arg) {
		//gAlp.Util.report(o[m]);
		if (arguments.length >= 3) { //allow for superfluous arguments 
			return o[m](arg);
		}
	}

	function caller(ctxt, ptl, arg, m) {
		return ptl(ctxt)[m](arg);
	}

	function capitalize(st, char) {
		var splitter = char || ' ',
			mystr = st || '',
			res = mystr.split(splitter),
			mapper = function(str) {
				return str.charAt(0).toUpperCase() + str.slice(1);
			};
		return _.map(res, mapper).join(' ');
	}

	function sortIndexFactory(index, klas, coll) {
		var drill = gAlp.Util.drillDown(['target']),
			txt = gAlp.Util.drillDown(['innerHTML']),
			finder = function(el, item) {
				return item.match(new RegExp(txt(el), 'i'));
			},
			options = {
				tab: function(e) {
					var el = drill(e);
					index = el && el.parentNode ? _.findIndex(coll, _.partial(finder, el)) : index;
					return index;
				},
				loop: function(bool) {
					index = _.isBoolean(bool) ? index : (index += 1) % coll.length;
					return index;
				}
			};
		return options[klas];
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
		sliceArray = function(list, end) {
			return list.slice(_.random(0, end || list.length));
			//return list.slice(0, 3);
		},
		alpacas_select = sliceArray(alpacas),
		alp_len = alpacas_select.length,
		number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
		isDesktop = _.partial(gtThan, window.viewportSize.getWidth, threshold),
		getEnvironment = (function() {
			if (mq) {
				return _.partial(Modernizr.mq, query);
			} else {
				return isDesktop;
			}
		}()),
		//$ = function (str) {return document.getElementById(str);},
		con = _.bind(window.console.log, window.console),
		utils = gAlp.Util,
		always = utils.always,
		reverse = utils.invoker('reverse', Array.prototype.reverse),
		repeatOnce = doRepeat()(1),
		validator = utils.validator,
		ptL = _.partial,
		idty = _.identity,
		doTwice = utils.curryTwice(),
		doTwiceDefer = utils.curryTwice(true),
		doThrice = utils.curryThrice(),
		doQuart = utils.curryFourFold(),
		anCr = utils.append(),
		anMv = utils.move(),
		anCrIn = utils.insert(),
		setAttrs = utils.setAttributes,
		doAddClass = utils.addClass,
		doDrillDown = utils.drillDown,
		byIndex = utils.byIndex,
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		getDomTargetLink = utils.getDomChild(utils.getNodeByTag('a')),
		getDomTargetImage = utils.getDomChild(utils.getNodeByTag('img')),
		clicker = ptL(utils.addHandler, 'click'),
		allow = !touchevents ? 2 : 0,
		isImg = _.compose(doThrice(simpleInvoke)('match')(/^img$/i), doDrillDown(['target', 'nodeName'])),
		eventBridge = function(action, e) {
			var getText = doDrillDown(['target', 'nodeName']),
				val = _.compose(doThrice(simpleInvoke)(/img/i)('match'), getText),
				isImg = utils.validator('Please click on an image', val);
			try {
				return utils.conditional(isImg)(action, e);
			} catch (er) {
				noOp();
			}
		},
		getNavTypeFactory = function(coll, len, limits) {
			var pop = utils.invoker('pop', Array.prototype.pop),
				shift = utils.invoker('shift', Array.prototype.shift),
				isMobile = validator('loop layout priority', _.negate(getEnvironment)),
				subHigher = validator('Data length exceeds a tab layout', doTwiceDefer(gtThan)(limits.hi)(len)),
				subLower = validator('Data length will not require a loop layout', doTwiceDefer(lsThanEq)(limits.lo)(len)),
				trials = [ptL(onValidation(subLower), pop, coll), ptL(onValidation(subHigher), shift, coll), ptL(onValidation(isMobile), reverse, coll)];
			_.each(trials, function(f) {
				return f();
			});
			return coll;
		},
		adaptHandlers = function(subject, adapter, allpairs, override) {
			adapter = adapter || {};
			adapter = utils.simpleAdapter(allpairs, adapter, subject);
			adapter[override] = function() {
				subject.remove(subject);
			};
			return adapter;
		},
		handlerpair = ['addListener', 'remove', 'triggerEvent', 'getElement'],
		renderpair = ['render', 'unrender', 'triggerEvent', 'getElement'],
		adapterFactory = function() {
			//fresh instance of curried function per adapter
			return doQuart(adaptHandlers)('unrender')([renderpair, handlerpair.slice(0)])(gAlp.Composite());
		},
		//myrevadapter = doQuart(adaptHandlers)('render')([renderpair, handlerpair.slice(0).reverse()])(gAlp.Composite()),
		checkDataLength = validator('no alpacas for sale', always(alp_len)),
		checkJSenabled = validator('javascript is not enabled', checkDummy),
		maybeLoad = utils.silent_conditional(checkDataLength, checkJSenabled),
		$sell = utils.machElement(ptL(setAttrs, {
			id: 'sell'
		}), anCr(article), always('div')),
		renderTable = _.compose(anCr($sell.render().getElement()), always('table')),
		iterateTable = function(getId, getPath, doFreshRow, doSpan, doDescription, doOddRow) {
			return function(getAnchor, subject) {
				var table = getAnchor(), //<table></table
					//optional tbody reqd for IE
					render = anCr(table),
					tbody = _.compose(render, ptL(idty))('tbody'),
					c = utils.curry4(caller)('match')(/^other/i)(doDrillDown(['innerHTML'])),
					addspan,
					doRow = _.compose(anCr(tbody)),
					tableconfig = {
						cellspacing: 0
					},
					addTableAttrs = {},
					addImgAttrs = {},
					addLinkAttrs = {},
					tmp;
				_.each(subject.slice(0, -2), function(tr, j) {
					var row,
						type = !j ? 'th' : 'td',
						supportsNthChild = validator('hard coding class not required', always(!Modernizr.nthchild)),
						isOdd = validator('is not an odd numbered row', always(j % 2)),
						isFirstRow = ptL(validator, 'is NOT first row'),
						isTableHead = ptL(validator, 'is NOT table head'),
						dospan = ptL(_.compose(ptL(utils.isEqual, 1), doDrillDown(['length']))),
						doOdd = onValidation(supportsNthChild, isOdd),
						provisionalID,
						assignId = function(str) {
							//console.log(str)
							//tableconfig.title = addImgAttrs.alt = getId(str);
							//addLinkAttrs.title = addImgAttrs.alt = getId(str);
							addImgAttrs.alt = getId(str);
							addTableAttrs = ptL(setAttrs, tableconfig);
						},
						maybeClass = ptL(onValidation(validator('no match found', c), supportsNthChild), doDescription);
					_.each(tr, function(td, i, data) {
						//partially apply the RETURNED function from onValidation with (partially applied) function to invoke
						addspan = ptL(onValidation(validator('is NOT a single column row', ptL(dospan, data))), doSpan);
						row = row || doFreshRow(ptL(doRow, 'tr'), i);
						provisionalID = onValidation(isFirstRow(always(Number(!i))), isTableHead(ptL(utils.isEqual, type, 'th')));
						provisionalID(ptL(assignId, td));
						_.compose(maybeClass, addspan, utils.setText(td), anCr(row))(type);
						doOdd(_.compose(doOddRow, always(row)));
						//$sell.style.marginTop = '-1px';
					});
				});
				render = anCr(table.parentNode);
				addLinkAttrs = _.extend(addLinkAttrs, {
					href: getPath(subject)
				});
				addLinkAttrs = ptL(setAttrs, addLinkAttrs);
				addImgAttrs = _.extend(addImgAttrs, {
					src: getPath(subject)
				});
				addImgAttrs = ptL(setAttrs, addImgAttrs);
				tmp = _.compose(addLinkAttrs, render, always('a'))();
				render = anCr(tmp);
				_.compose(addImgAttrs, render, always('img'))();
				addTableAttrs(table);
			};
		},
		doLoad = function(coll, cb) {
			var loadData = function(data, render, driver) {
					_.each(data, ptL(driver, render));
				},
				getId = _.compose(ptL(byIndex, 1), doThrice(simpleInvoke)(' ')('split')),
				doRow = onValidation(validator('is first row', ptL(utils.isEqual, 0))),
				doColspan = ptL(setAttrs, {
					colSpan: 2 //!!!!////camelCase!!!!
				}),
				getPath = function(array) {
					return array.slice(-1)[0][1];
				},
				configureTable = iterateTable(getId, getPath, doRow, doColspan, ptL(doAddClass, 'description'), ptL(doAddClass, 'odd'));
			loadData(coll, cb, configureTable);
			return true;
		},
		loaded = maybeLoad(ptL(doLoad, alpacas_select, renderTable)),
		routes = getNavTypeFactory(['tab', 'loop'], alp_len, limits),
		tooltip_pairs = [
			['render', 'unrender'],
			['init', 'cancel']
		],
		tooltip_adapter = ptL(utils.simpleAdapter, tooltip_pairs, gAlp.Composite()),
		makeToolTip = ptL(gAlp.Tooltip, article, ["click table/picture", "to toggle the display"], allow),
		makeElement = utils.machElement,
		makeComp = function(obj, inc) {
			return _.extend(gAlp.Composite(inc), obj);
		},
		stage1 = (function(extent) {
			//con(extent)
			if (!extent) {
				$sell.unrender();
				return;
			}
			var links = _.toArray($sell.getElement().getElementsByTagName('a')),
				tables = _.toArray(utils.getSiblingCollection(links, 'getPrevious')),
				mapLinktoTitle = function(link) {
					var getHref = doThrice(simpleInvoke)(linkEx)('match');
					return _.compose(ptL(callWith, ''.capitalize), ptL(byIndex, 1), getHref, doDrillDown(['href']))(link);
				},
				alpacaTitles = _.map(links, mapLinktoTitle),
				partialLinks = doTwiceDefer(utils.map)(mapLinktoTitle)(links),
				getLinkDefer = doTwiceDefer(getProp)(links), //awaits integer
				getLink = getLinkDefer( /*index*/ ),
				prepTitles = function() {
					//return ['Alpacas For Sale', mapLinktoTitle(getLink()), 'Next Alpaca'];
					return ['Alpacas For Sale', 'lowercasealpaca', 'Next Alpaca'];
				},
				prepNav = function(ancor, refnode, doKlas) {
					var h = function(e) {
						var el = doDrillDown(['target', 'innerHTML'])(e),
							i = _.findIndex(alpacaTitles, ptL(utils.isEqual, el)),
							comp = my_stage_two.get(0);
						comp.unrender();
						comp.get(0).get(i).render();
						comp.get(1).get(i).render();
					};
					return utils.machElement(doTwice(utils.getter)('getElement'), ptL(clicker, h), doKlas, ptL(setAttrs, {
						id: 'list'
					}), anCrIn(ancor, refnode), always('ul'));
				},
				doTabs = function(doLI, str) {
					var getListEl = _.compose(always, utils.getDomParent(utils.getNodeByTag('li')));
					return _.compose(makeComp, utils.machElement, getListEl, utils.setText(str.capitalize()), doLI())('a').render();
				},
				doTabsLoop = function(doLI, str, i) {
					///REMEMBER a new onValidation PER LOOP
					var v = validator('wrong link', ptL(utils.isEqual, 1, i)),
						getListEl = _.compose(always, utils.getDomParent(utils.getNodeByTag('li'))),
						doParent = _.compose(ptL(doAddClass, 'current'), doDrillDown(['parentNode'])),
						doWhen = ptL(onValidation(v), doParent);
					return _.compose(makeComp, utils.machElement, getListEl, _.compose(doWhen, utils.setText(str.capitalize())), doLI())('a').render();
				},
				doIterate = function(coll, iteratee, comp) {
					return _.each(getResult(coll), _.compose(comp.add, iteratee));
				},
				myhead = gAlp.Composite([]),
				my_stage_one = gAlp.Composite([]),
				my_stage_two = gAlp.Composite([]),
				makeBody = function() {
					var $el = makeComp(makeElement(ptL(klasAdd, 'sell'), always(utils.getBody())));
					$el.unrender = ptL(klasRem, 'sell', utils.getBody());
					return $el;
				},
				makeFigure = function(ancor, el) {
					var grabAlt = _.compose(doDrillDown(['alt']), getDomTargetImage),
						preptext = _.compose(utils.setText, grabAlt)(el),
						sibling = utils.getPrevious(el),
						find = function(e) {
							var myimg_alt = grabAlt(this.subject.getElement()),
								tgt_alt = doDrillDown(['target', 'alt'])(e);
							return myimg_alt === tgt_alt;
						};
					return {
						render: function() {
							var fig = _.compose(anCr(ancor), always('figure'))();
							this.subject = utils.machElement(ptL(idty, fig), preptext, anCr(fig), always('figcaption'), anMv(fig), ptL(idty, el)).render();
							return this;
						},
						unrender: function() {
							var link = _.compose(getDomTargetLink)(this.subject.getElement());
							utils.insertAfter(link, sibling);
							this.subject.unrender();
						},
						find: find
					};
				},
				myPresenter = (function(head) {
					_.each(links, function(lnk) {
						var elements = gAlp.Composite([]),
							tbl = utils.getPrevious(lnk),
							$lnk = makeComp(makeElement(utils.show, always(lnk))),
							$tbl = makeComp(makeElement(utils.show, always(tbl)));
						$tbl.unrender = ptL(utils.hide, tbl);
						$lnk.unrender = ptL(utils.hide, lnk);
						elements.addAll($tbl, $lnk);
						head.add(elements);
					});
					return head;
				}(gAlp.Composite([]))),
				$body = makeBody(),
				$nav = makeComp(prepNav($sell.getElement(), article, ptL(klasAdd, 'tab'), [])),
				//$nav = makeComp(prepNav($sell.getElement(), article, ptL(klasAdd, 'loop'), [])),
				getLI = function() {
					return _.compose(anCr, _.compose(anCr($nav.getElement()), always('li')))();
				},
				doTabNav = _.compose(ptL(doTabs, getLI)),
				doLoopNav = _.compose(ptL(doTabsLoop, getLI)),
				//initLoop = ptL(init, prepTitles, doLoopNav),
				listComp = gAlp.Composite([]),
				myListElements = gAlp.Composite([]),
				$lists = ptL(doIterate, partialLinks, doTabNav, listComp),
				//$lists = ptL(doIterate, prepTitles, doLoopNav, listComp),
				doCurrent = function(leaf) {
					var $el = makeComp(makeElement(ptL(klasAdd, 'current'), always(leaf.getElement())));
					$el.unrender = ptL(klasRem, 'current', leaf.getElement());
					return $el;
				},
				$displaylists = doThrice(doIterate)(myListElements)(doCurrent),
				toggleTable = ptL(utils.toggleClass, ['tog'], $sell.getElement()),
				addListener = function(comp, cb, el) {
					return _.compose(comp.add, adapterFactory(), utils.addEvent(clicker, cb))(el);
				},
				prepStageTwoBridge = function(i) {
					prepStageTwo(i < 0 ? 0 : i);
				},
				prepStageTwo = function(i) {
					var myDisplayElements = gAlp.Composite([]);
					my_stage_one.unrender();
					my_stage_one.get(0).render();
					$lists(); //appends LI NOTE does not add $LI to composite, as not individually targeting elements for append/removal
					$displaylists(ptL(listComp.get)); //displays LI insted we want to show/hide
					myDisplayElements.addAll(myPresenter, myListElements);
					my_stage_two.add(myDisplayElements);
					addListener(my_stage_two, toggleTable, $sell.getElement()); //3
					_.compose(my_stage_two.add, tooltip_adapter, makeToolTip)(); //4
					my_stage_two.render();
					myDisplayElements.unrender();
					myPresenter.get(i).render();
					myListElements.get(i).render();
				},
				prepStageOne = function() {
					var myExtent = function(head, el) {
							var $el = makeComp(makeElement(ptL(klasAdd, 'extent'), always(el)));
							$el.unrender = ptL(klasRem, 'extent', el);
							head.add($el);
						},
						myfigComp = gAlp.Composite([]),
						goFigure = ptL(makeFigure, $sell.getElement()),
						doFigures = ptL(doIterate, links, goFigure, myfigComp);
					doFigures();
					myfigComp.find = ptL(myfigComp.find, 'findIndex');
					myExtent(myfigComp, $sell.getElement());
					my_stage_one.add($nav); //0
					my_stage_one.add(myfigComp); //1
					addListener(my_stage_one, ptL(eventBridge, _.compose(prepStageTwo, myfigComp.find)), $sell.getElement()); //2
					//addListener(my_stage_one, _.compose(prepStageTwoBridge, myfigComp.find), $sell.getElement()); //2
				};
			myhead.add($body); //0
			myhead.add(my_stage_one); //0
			myhead.add(my_stage_two); //0
			prepStageOne();
			myhead.render();
			//var $el = my_stage_one.get(2).getSubject();
			//$el.triggerEvent($el.getElement(), 'click');
		}(alp_len));
}('(min-width: 769px)', Modernizr.mq('only all'), Modernizr.touchevents, document.getElementById('article'), document.getElementsByTagName('h2')[0], 'show', /\/([a-z]+)\d?\.jpg$/i, [/^next/i, /sale$/i, new RegExp('^[^<]', 'i'), /^</], {
	lo: 3,
	hi: 4
}));