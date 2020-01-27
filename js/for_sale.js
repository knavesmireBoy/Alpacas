/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global gAlp: false */
/*global _: false */
if (!window.gAlp) {
	window.gAlp = {};
}
(function (query, mq, article, report, displayclass, linkEx, navExes, limits) {
	"use strict";

	function noOp() {}

	function doRepeat() {
		return function (i) {
			return function () {
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
			mapper = function (str) {
				return str.charAt(0).toUpperCase() + str.slice(1);
			};
		return _.map(res, mapper).join(' ');
	}

	function sortIndexFactory(index, klas, coll) {
		var drill = gAlp.Util.drillDown(['target']),
			txt = gAlp.Util.drillDown(['innerHTML']),
			finder = function (el, item) {
				return item.match(new RegExp(txt(el), 'i'));
			},
			options = {
				tab: function (e) {
					var el = drill(e);
					index = el && el.parentNode ? _.findIndex(coll, _.partial(finder, el)) : index;
					return index;
				},
				loop: function (bool) {
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
		sliceArray = function (list, end) {
			//return list.slice(_.random(0, end || list.length));
			return list.slice(0, 3);
		},
		alpacas_select = sliceArray(alpacas),
		alp_len = alpacas_select.length,
		number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
		isDesktop = _.partial(gtThan, window.viewportSize.getWidth, threshold),
		getEnvironment = (function () {
			if (mq) {
				return _.partial(Modernizr.mq, query);
			} else {
				return isDesktop;
			}
		}()),
		//$ = function (str) {return document.getElementById(str);},
		//con = _.bind(window.console.log, window.console),
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
		anCr = utils.append(),
		anMv = utils.move(),
		anCrIn = utils.insert(),
		setAttrs = utils.setAttributes,
		doAddClass = utils.addClass,
		doDrillDown = utils.drillDown,
		byIndex = utils.byIndex,
		getNavTypeFactory = function (coll, len, limits) {
			var pop = utils.invoker('pop', Array.prototype.pop),
				shift = utils.invoker('shift', Array.prototype.shift),
				//reverse = utils.invoker('reverse', Array.prototype.reverse),
				isMobile = validator('loop layout priority', _.negate(getEnvironment)),
				subHigher = validator('Data length exceeds a tab layout', doTwiceDefer(gtThan)(limits.hi)(len)),
				subLower = validator('Data length will not require a loop layout', doTwiceDefer(lsThanEq)(limits.lo)(len)),
				trials = [ptL(onValidation(subLower), pop, coll), ptL(onValidation(subHigher), shift, coll), ptL(onValidation(isMobile), reverse, coll)];
			_.each(trials, function (f) {
				return f();
			});
			return coll;
		},
		checkDataLength = validator('no alpacas for sale', always(alp_len)),
		checkJSenabled = validator('javascript is not enabled', checkDummy),
		maybeLoad = utils.silent_conditional(checkDataLength, checkJSenabled),
		getPerformer = function () {
			return ptL(utils.apply, utils.partialSetFromArray.apply(utils, arguments));
		},
		sellDiv = _.compose(ptL(setAttrs, {
			id: 'sell'
		}), anCr(article), always('div'))(),
		renderTable = _.compose(anCr(sellDiv), always('table')),
		iterateTable = function (getId, getPath, doFreshRow, doSpan, doDescription, doOddRow) {
			return function (getAnchor, subject) {
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
				_.each(subject.slice(0, -2), function (tr, j) {
					var row,
						type = !j ? 'th' : 'td',
						supportsNthChild = validator('hard coding class not required', always(!Modernizr.nthchild)),
						isOdd = validator('is not an odd numbered row', always(j % 2)),
						isFirstRow = ptL(validator, 'is NOT first row'),
						isTableHead = ptL(validator, 'is NOT table head'),
						dospan = ptL(_.compose(ptL(utils.isEqual, 1), doDrillDown(['length']))),
						doOdd = onValidation(supportsNthChild, isOdd),
						provisionalID,
						assignId = function (str) {
							//console.log(str)
							//tableconfig.title = addImgAttrs.alt = getId(str);
							//addLinkAttrs.title = addImgAttrs.alt = getId(str);
							addImgAttrs.alt = getId(str);
							addTableAttrs = ptL(setAttrs, tableconfig);
						},
						maybeClass = ptL(onValidation(validator('no match found', c), supportsNthChild), doDescription);
					_.each(tr, function (td, i, data) {
						//partially apply the RETURNED function from onValidation with (partially applied) function to invoke
						addspan = ptL(onValidation(validator('is NOT a single column row', ptL(dospan, data))), doSpan);
						row = row || doFreshRow(ptL(doRow, 'tr'), i);
						provisionalID = onValidation(isFirstRow(always(Number(!i))), isTableHead(ptL(utils.isEqual, type, 'th')));
						provisionalID(ptL(assignId, td));
						_.compose(maybeClass, addspan, utils.setText(td), anCr(row))(type);
						doOdd(_.compose(doOddRow, always(row)));
						sellDiv.style.marginTop = '-1px';
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
		doLoad = function (coll, cb) {
			var loadData = function (data, render, driver) {
					_.each(data, ptL(driver, render));
				},
				getId = _.compose(ptL(byIndex, 1), doThrice(simpleInvoke)(' ')('split')),
				doRow = onValidation(validator('is first row', ptL(utils.isEqual, 0))),
				doColspan = ptL(setAttrs, {
					colSpan: 2 //!!!!////camelCase!!!!
				}),
				getPath = function (array) {
					return array.slice(-1)[0][1];
				},
				configureTable = iterateTable(getId, getPath, doRow, doColspan, ptL(doAddClass, 'description'), ptL(doAddClass, 'odd'));
			loadData(coll, cb, configureTable);
			return true;
		},
		loaded = maybeLoad(ptL(doLoad, alpacas_select, renderTable)),
		routes = getNavTypeFactory(['tab', 'loop'], alp_len, limits),
		myconfig = {
			shower: getPerformer(always(true), 'add'),
			hider: getPerformer(always(true), 'remove'),
			klas: 'show',
			intaface: gAlp.Intaface('Display', ['show', 'hide'])
		},
		links = _.toArray(sellDiv.getElementsByTagName('a')),
		display_elements = _.map(links, function (el) {
			return [el, utils.getPrevious(el)];
		}),
		tables = _.map(links, function (el) {
			return utils.getPrevious(el);
		}),
		mapLinktoTitle = function (link) {
			var getHref = doThrice(simpleInvoke)(linkEx)('match');
			return _.compose(ptL(callWith, ''.capitalize), ptL(byIndex, 1), getHref, doDrillDown(['href']))(link);
		},
		alpacaTitles = _.map(links, mapLinktoTitle),
		getAlpacaTitles = doTwice(getProp)(alpacaTitles),
		partialLinks = doTwiceDefer(utils.map)(mapLinktoTitle)(links),
		getLinkDefer = doTwiceDefer(getProp)(links), //awaits integer
		getDomTargetLink = utils.getDomChild(utils.getNodeByTag('a')),
		getDomTargetImage = utils.getDomChild(utils.getNodeByTag('img')),
		tooltip = gAlp.Tooltip(article, ["click table/picture", "to toggle the display"], 2),
		doToolTip = ptL(utils.doWhen, repeatOnce, _.bind(tooltip.init, tooltip)),
		mynav = (function () {
			function prepNav(ancor, refnode) {
				return utils.makeElement(ptL(setAttrs, {
					id: 'list'
				}), anCrIn(ancor, refnode), always('ul'));
			}

			function throttler(callback) {
				if (!getEnvironment()) {
					getEnvironment = _.negate(getEnvironment);
				}
				var handler = function () {
					if (!getEnvironment()) {
						//con('ch...')
						getEnvironment = _.negate(getEnvironment);
						callback();
					}
				};
				return utils.addHandler('resize', window, _.throttle(handler, 66));
			}
			return {
				init: function (cb) {
					this.subject = this.subject || prepNav(sellDiv, article);
					this.handle = throttler(ptL(utils.doWhen, _.bind(this.subject.get, this.subject), cb));
					return this;
				},
				add: function () {
					return this.subject.add();
				},
				remove: function () {
					//this.handle && this.handle.remove(this.handle);
					return this.subject.remove();
				},
				get: function () {
					var el = this.subject.get();
					if (el) {
						return el;
					} else {
						return this.add().get();
					}
				}
			};
		}()),
		makeLeaf = function (comp, config, el) {
			var leaf = gAlp.Composite(null, config.intaface);
			leaf.hide = ptL(config.hider, config.klas, el);
			leaf.show = ptL(config.shower, config.klas, el);
			leaf.get = always(el);
			comp.add(leaf);
		},
		makeDisplayer = function (inc, conf, bool) {
			function setDisplays(inc, comp) {
				comp.hide = function () {
					_.each(inc, function (leaf) {
						leaf.hide();
					});
				};
				comp.show = function (j) {
					comp.hide();
					_.each(inc, function (leaf, i) {
						if (!isNaN(j) && j === i) {
							leaf.show(); //show pair
						} else if (isNaN(j)) {
							leaf.show();
						}
					});
				};
				return bool ? _.extend(comp, new utils.Observer()) : comp;
			}
			return setDisplays(inc, gAlp.Composite(inc, conf.intaface));
		},
		simpleComp = function (coll, config, bool) {
			var comp = makeDisplayer([], config),
				doLeaf = ptL(makeLeaf, comp, config);
			_.each(coll, doLeaf);
			return bool ? _.extend(comp, new utils.Observer()) : comp;
		},
		machDisplayComp = function (coll, config) {
			var headcomp = makeDisplayer([], config, true),
				mycomp = headcomp,
				recur = function (gang) {
					_.each(gang, function (arg) {
						if (_.isArray(arg)) {
							mycomp = makeDisplayer([], config);
							headcomp.add(mycomp);
							recur(arg);
						} else {
							makeLeaf(mycomp, config, arg);
						}
					});
				};
			headcomp.handle = function (e) {
				var i = this.strategy(e);
				if (i >= 0) {
					this.show(i);
					this.fire(i);
				}
			};
			headcomp.getIndex = function () {
				return this.strategy && (this.strategy(true) || 0);
			};
			recur(coll);
			headcomp.subscribe(doToolTip);
			//headcomp.subscribe(tooltip_command.execute);
			return headcomp;
		},
		getDisplayComp = ptL(machDisplayComp, display_elements, myconfig),
		tabFactory = function (gallery, index) {
			if (isNaN(index)) {
				return;
			}

			function doTabs(doLI, str) {
				return _.compose(utils.setText(str.capitalize()), doLI())('a');
			}

			function doTabsLoop(doLI, str, i) {
				///REMEMBER a new onValidation PER LOOP
				var v = validator('wrong link', ptL(utils.isEqual, 1, i)),
					doParent = _.compose(ptL(doAddClass, 'current'), doDrillDown(['parentNode'])),
					doWhen = ptL(onValidation(v), doParent);
				return _.compose(doWhen, utils.setText(str.capitalize()), doLI())('a');
			}
			var I = 0,
				resizerinc = [],
				ctxt = getDisplayComp(index),
				mecallback = function () {
					return function () {
						resizerinc[I].exit(ctxt.getIndex());
						I = (I += 1) % resizerinc.length;
						resizerinc[I].show(ctxt.getIndex());
					};
				},
				$nav = mynav.init(mecallback(I)),
				getLI = function () {
					return _.compose(anCr, _.compose(anCr($nav.get()), always('li')))();
				},
				prepHandle = ptL(utils.addHandler, 'click'),
				addHandler = function (id, cb) {
					this.handle = _.compose(_.identity, ptL(prepHandle, cb), ptL(doAddClass, id))($nav.get());
				},
				getLink = getLinkDefer(index),
				prepTitles = function () {
					return ['Alpacas For Sale', mapLinktoTitle(getLink()), 'Next Alpaca'];
				},
				resizercomp = makeDisplayer(resizerinc, myconfig, true),
				doTabNav = _.compose(ptL(doTabs, getLI)),
				doLoopNav = _.compose(ptL(doTabsLoop, getLI)),
				init = function (coll, iteratee) {
					_.each(coll(), iteratee);
				},
				hide = function () {
					$nav.remove();
				},
				doExit = function (i) {
					$nav.remove();
					ctxt.fire(i);
				},
				exiting = function (subject, i) {
					ctxt.unsubscribe(subject);
					doExit(i);
				},
				prepLoop = function () {
					var handler = function (e) {
							var events = [ctxt.handle.bind(ctxt), _.compose(_.bind(gallery.execute, gallery), _.bind($nav.remove, $nav)), noOp, noOp],
								composed = _.compose(doThrice(stringOp)('match'), doDrillDown(['target', 'innerHTML']))(e),
								best = ptL(utils.getBest, function (arr) {
									return composed(arr[0]);
								}, _.zip(navExes, events));
							_.compose(utils.getDefaultAction, best)()();
							//this.fire();
						},
						nextLoop = function () {
							var fromClass = _.compose(getDomTargetLink, ptL(byIndex, 0), ptL(utils.getByClass, 'current')),
								pre_prepped = _.compose(ptL(utils.setter, fromClass, 'innerHTML'), getAlpacaTitles),
								isNotEmpty = function (arg) {
									return arg;
								},
								prepped = _.compose(ptL(utils.invokeWhen, _.compose(isNotEmpty, fromClass), pre_prepped)),
								exit = ptL(exiting, prepped);
							return function (i) {
								this.exit = exit;
								ctxt.subscribe(prepped);
								ctxt.fire(i);
							};
						},
						looper = {
							init: ptL(init, prepTitles, doLoopNav),
							id: 'loop',
							addHandler: function () {
								//this.subscribe(tooltip_command.undo);
								_.compose(_.identity, ptL(prepHandle, _.bind(handler, this)), ptL(doAddClass, this.id))($nav.get());
							},
							hide: hide,
							doNext: nextLoop(),
							delegate: ptL(simpleInvoke, ctxt, 'handle', false)
						};
					return _.extend(looper, new utils.Observer());
					//return looper;
				},
				prepTab = function () {
					var nextTab = function (i) {
							var navbar = simpleComp($nav.get().childNodes, _.extend(myconfig, {
									klas: 'current'
								})),
								boundNav = _.bind(navbar.show, navbar);
							ctxt.subscribe(boundNav);
							ctxt.fire(i);
							this.exit = function (i) {
								ctxt.unsubscribe(boundNav);
								doExit(i);
							};
						},
						tabber = {
							init: ptL(init, partialLinks, doTabNav),
							id: 'tab',
							addHandler: ptL(addHandler, 'tab', _.bind(ctxt.handle, ctxt)),
							//addHandler: _.bind(addHandler, this, 'tab', _.bind(ctxt.handle, ctxt)),
							hide: hide,
							doNext: nextTab,
							delegate: ptL(simpleInvoke, ctxt, 'handle')
						};
					return tabber;
				},
				layouts = {
					loop: prepLoop(),
					tab: prepTab()
				},
				prepareLayout = function (comp) {
					if (!comp) {
						return;
					}
					_.extend(comp, gAlp.Composite([], myconfig.intaface));
					comp.show = function (j) {
						var i = isNaN(j) ? index : j;
						this.init(i);
						ctxt.strategy = sortIndexFactory(i, this.id, alpacaTitles);
						this.addHandler();
						this.delegate(i); //ie show current
						this.doNext(i); //prep observers
					};
					comp.add(ctxt);
					resizercomp.add(comp);
					return comp;
				},
				sortLayouts = function () {
					var mylayouts = [layouts[routes[0]]],
						alt = layouts[routes[1]];
					if (alt) {
						mylayouts.push(alt);
					}
					_.each(mylayouts, prepareLayout);
					mylayouts = [];
				};
			sortLayouts();
			//memoize...
			tabFactory = function (gallery, index) {
				if (isNaN(index)) {
					return;
				}
				getLink = getLinkDefer(index);
				resizercomp.get(I).show(index);
			};
			resizercomp.get(0).show(index);
		}, //orig tabFactory
		makeFigure = function (ancor, el) {
			var grabAlt = _.compose(doDrillDown(['alt']), getDomTargetImage),
				preptext = _.compose(utils.setText, grabAlt)(el);
			return {
				execute: function () {
					doAddClass('extent', ancor);
					var fig = _.compose(anCr(ancor), always('figure'))();
					this.subject = utils.makeElement(ptL(idty, fig), preptext, anCr(fig), always('figcaption'), anMv(fig), ptL(idty, el)).add();
					return this;
				},
				find: function (e) {
					var myimg_alt = _.compose(doDrillDown(['alt']), getDomTargetImage)(this.subject.get()),
						tgt_alt = doDrillDown(['target', 'alt'])(e);
					return (myimg_alt === tgt_alt);
				},
				undo: function (i) {
					utils.removeClass('extent', ancor);
					var link = _.compose(getDomTargetLink)(this.subject.get());
					utils.insertAfter(link, tables[i]);
					this.subject.remove();
				}
			};
		},
		loader = function (coll, layout, target_node, proxy) {
			_.compose(ptL(doAddClass, 'sell'), always(document.body))();
			var goFigure = ptL(makeFigure, target_node),
				getFigs = function () {
					return _.map(coll, function (el) {
						return goFigure(el).execute();
					});
				},
				toggleTable = function () {
					var f = ptL(utils.toggleClass, ['tog'], target_node);
					//f = window.confirm.bind(window, 'proceed');
					return utils.addEvent(ptL(utils.addHandler, 'click'), f)(target_node);
				},
				delBridge = function (action, e) {
					var getText = doDrillDown(['target', 'nodeName']),
						val = _.compose(doThrice(simpleInvoke)(/img/i)('match'), getText),
						isImg = utils.validator('Please click on an image', val);
					try {
						return utils.conditional(isImg)(action, e);
					} catch (er) {
						//true;
					}
				},
				delegate = function (coll, ctxt, e) {
					var j;
					_.each(getResult(coll), function ($el, i) {
						if ($el.find(e)) {
							j = i;
						}
						$el.undo(i);
					});
					if (ctxt.handler) {
						ctxt.handler.remove(ctxt.handler);
					}
					ctxt.handler = toggleTable();
					return j;
				},
				execs = function (base) {
					var layouts = {
						loop: {
							execute: function () {
								if (base.handler) {
									base.handler.remove(base.handler);
								}
								var figs = getFigs(),
									pred = ptL(delBridge, ptL(delegate, figs, base)),
									action = ptL(tabFactory, proxy),
									pred_action = _.compose(action, pred);
								base.handler = utils.addEvent(ptL(utils.addHandler, 'click'), pred_action)(target_node);
							}
						},
						tab: {
							execute: function () {
								if (base.handler) {
									base.handler.remove(base.handler);
								}
								tabFactory(layouts.loop, 0);
								base.handler = toggleTable();
							}
						}
					};
					return _.extend(base, layouts[layout]);
				};
			return execs({});
		}, //loader
		myloader = { // a proxy that persists and is responsible for instatiating subjects
			execute: function () {
				if (this.subject) {
					this.subject.handler.remove(this.subject.handler);
				}
				this.subject = loader(links, routes[0], sellDiv, this);
				this.subject.execute();
			}
		};
	if (loaded) {
		utils.highLighter.perform();
      
        try {
            myloader.execute();
        }
        catch(e){
         utils.report(e);
        }
	}
}('(min-width: 769px)', Modernizr.mq('only all'), document.getElementById('article'), document.getElementsByTagName('h2')[0], 'show', /\/([a-z]+)\d?\.jpg$/i, [/^next/i, /sale$/i, new RegExp('^[^<]', 'i'), /^</], {
	lo: 3,
	hi: 4
}));