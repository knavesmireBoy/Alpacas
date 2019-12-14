/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global gAlp: false */
/*global _: false */
if (!window.gAlp) {
	window.gAlp = {};
}
(function(query, mq, article, report, displayclass, linkEx, navExes, limits) {
	/*
	(function() {
	    'use strict';
	   
	    var start,
	        end,
	        delta,
	        node = document.getElementById("aside");
	    node.addEventListener("mousedown", function() {
	        start = new Date();
	    });
	    node.addEventListener("mouseup", function() {
	        end = new Date();
	        delta = (end - start) / 1000.0;
	        ///alert("Button held for " + delta + " seconds." )
	        Len = Math.ceil(delta);
	    });
	}());
	*/
	function undef(x) {
		return typeof(x) === 'undefined';
	}

	function existy(x) {
		return x != null;
	}

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

	function callWith(m, ctxt) {
		return m.call(ctxt);
	}

	function decorateWhen( /* validators */ ) {
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
	}

	function noOp() {}

	function always(val) {
		return function() {
			return val;
		};
	}

	function getProp(p, o) {
		//con(p, o, o[p])
		return o[p];
	}

	function stringOp(reg, o, m) {
		return o[m](reg);
	}

	function simpleInvoke(o, m, arg) {
		if (arguments.length >= 3) { //allow for superfluous arguments 
			return o[m](arg);
		}
	}

	function gtThan(a, b) {
		return getResult(a) > getResult(b);
	}

	function lsThanEq(a, b) {
		return a <= b;
	}

	function caller1(ctxt, ptl, arg, m) {
		return ptl(ctxt)[m](arg);
	}

	function sortIndexFactory(index, klas, coll) {
		var drill = doDrillDown(['target']),
			txt = doDrillDown(['innerHTML']),
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
					return index = _.isBoolean(bool) ? index : (index += 1) % coll.length;
				},
				solo: noOp
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
		},
		alpacas_select = sliceArray(alpacas),
		alp_len = alpacas_select.length,
		threshold = Number(query.match(/[^\d]+(\d+)[^\d]+/)[1]),
		isDesktop = _.partial(gtThan, window.viewportSize.getWidth, threshold),
		getEnvironment = (function() {
			if (mq) {
				return _.partial(Modernizr.mq, query);
			} else {
				return isDesktop
			}
		}()),
		$ = function(str) {
			return document.getElementById(str);
		},
		reverse = gAlp.Util.invoker('reverse', Array.prototype.reverse),
		repeatOnce = doRepeat()(1),
		validator = gAlp.Util.validator,
		getNavTypeFactory = function(coll, len, limits) {
			var pop = gAlp.Util.invoker('pop', Array.prototype.pop),
				shift = gAlp.Util.invoker('shift', Array.prototype.shift),
				//reverse = gAlp.Util.invoker('reverse', Array.prototype.reverse),
				isMobile = validator('loop layout priority', _.negate(getEnvironment)),
				subHigher = validator('Data length exceeds a tab layout', doTwiceDefer(gtThan)(limits.hi)(len)),
				subLower = validator('Data length will not require a loop layout', doTwiceDefer(lsThanEq)(limits.lo)(len)),
				trials = [ptL(decorateWhen(subLower), pop, coll), ptL(decorateWhen(subHigher), shift, coll), ptL(decorateWhen(isMobile), reverse, coll)];
			_.each(trials, function(f) {
				return f();
			});
			return coll;
		},
		ptL = _.partial,
		idty = _.identity,
		//con = _.bind(window.console.log, window.console),
		doTwice = gAlp.Util.curryTwice(),
		doTwiceDefer = gAlp.Util.curryTwice(true),
		doThrice = gAlp.Util.curryThrice(),
		anCr = gAlp.Util.append(),
		anMv = gAlp.Util.move(),
		anCrIn = gAlp.Util.insert(),
		setAttrs = gAlp.Util.setAttributes,
		doAddClass = gAlp.Util.addClass,
		doDrillDown = gAlp.Util.drillDown,
		byIndex = gAlp.Util.byIndex,
		getPerformer = function() {
			return ptL(gAlp.Util.apply, gAlp.Util.partialSetFromArray.apply(gAlp.Util, arguments));
		},
		sellDiv = _.compose(ptL(setAttrs, {
			id: 'sell'
		}), anCr(article), always('div'))(),
		renderTable = _.compose(anCr(sellDiv), always('table')),
		iterateTable = function(getId, getPath, doFreshRow, doSpan, doDescription, doOddRow) {
			return function(getAnchor, subject) {
				var table = getAnchor(), //<table></table
					//optional tbody reqd for IE
					render = anCr(table),
					tbody = _.compose(render, ptL(idty))('tbody'),
					c = gAlp.Util.curry4(caller1)('match')(/^other/i)(doDrillDown(['innerHTML'])),
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
						dospan = ptL(_.compose(ptL(gAlp.Util.isEqual, 1), doDrillDown(['length']))),
						doOdd = decorateWhen(supportsNthChild, isOdd),
						provisionalID,
						assignId = function(str) {
							//console.log(str)
							//tableconfig.title = addImgAttrs.alt = getId(str);
							addLinkAttrs.title = addImgAttrs.alt = getId(str);
							addTableAttrs = ptL(setAttrs, tableconfig);
						},
						maybeClass = ptL(decorateWhen(validator('no match found', c), supportsNthChild), doDescription);
					_.each(tr, function(td, i, data) {
						//partially apply the RETURNED function from decorateWhen with (partially applied) function to invoke
						//addspan = ptL(decorateWhen(validator('is NOT a single column row', ptL(dospan, data))), doSpan);
						addspan = ptL(decorateWhen(validator('is NOT a single column row', ptL(dospan, data))), doSpan);
						row = row || doFreshRow(ptL(doRow, 'tr'), i);
						provisionalID = decorateWhen(isFirstRow(always(Number(!i))), isTableHead(ptL(gAlp.Util.isEqual, type, 'th')));
						provisionalID(ptL(assignId, td));
						_.compose(maybeClass, addspan, gAlp.Util.setText(td), anCr(row))(type);
						doOdd(_.compose(doOddRow, always(row)));
					});
				});
				//report.innerHTML = document.getElementsByTagName('td')[10].getAttribute('colspan');
				//report.innerHTML = window.addEventListener; 
				render = anCr(table.parentNode),
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
		loadData = function(data, driver, render) {
			_.each(data, ptL(driver, render));
		};
	/* only load the javascript if css enabled, a dummy element is placed in html,
	a property applied in css, which will not be accessible if path to css is missing */
	if (!alp_len || !checkDummy()) {
		return;
	}
	var getId = _.compose(ptL(byIndex, 1), doThrice(simpleInvoke)(' ')('split')),
		doRow = decorateWhen(validator('is first row', ptL(gAlp.Util.isEqual, 0))),
		doColspan = ptL(setAttrs, {
			colspan: 2
		}),
		getPath = function(array) {
			return array.slice(-1)[0][1];
		},
		configureTable = iterateTable(getId, getPath, doRow, doColspan, ptL(doAddClass, 'description'), ptL(doAddClass, 'odd'));
	loadData(alpacas_select, configureTable, renderTable);
	var routes = getNavTypeFactory(['tab', 'loop'], alp_len, limits),
		myconfig = {
			shower: getPerformer(always(true), 'add'),
			hider: getPerformer(always(true), 'remove'),
			klas: 'show',
			intaface: gAlp.Intaface('Display', ['show', 'hide'])
		},
		links = _.toArray(sellDiv.getElementsByTagName('a')),
		display_elements = _.map(links, function(el) {
			return [el, gAlp.Util.getPrevious(el)];
		}),
		tables = _.map(links, function(el) {
			return gAlp.Util.getPrevious(el);
		}),
		mapLinktoTitle = function(link) {
			var getHref = doThrice(simpleInvoke)(linkEx)('match');
			return _.compose(ptL(callWith, ''.capitalize), ptL(byIndex, 1), getHref, doDrillDown(['href']))(link);
		},
		alpacaTitles = _.map(links, mapLinktoTitle),
		getAlpacaTitles = doTwice(getProp)(alpacaTitles),
		partialLinks = doTwiceDefer(gAlp.Util.map)(mapLinktoTitle)(links),
		getLinkDefer = doTwiceDefer(getProp)(links), //awaits integer
		getDomTargetLink = gAlp.Util.getDomChild(gAlp.Util.getNodeByTag('a')),
		getDomTargetImage = gAlp.Util.getDomChild(gAlp.Util.getNodeByTag('img')),
		tooltip = gAlp.Tooltip(article, ["click here...", "to toggle table and picture"], 2),
		doToolTip = ptL(gAlp.Util.doWhen, repeatOnce, _.bind(tooltip.init, tooltip)),
		mynav = (function() {
			function prepNav(ancor, refnode) {
				return gAlp.Util.makeElement(ptL(setAttrs, {
					id: 'list'
				}), anCrIn(ancor, refnode), always('ul'));
			}
			return {
				init: function() {
					this.subject = this.subject || prepNav(sellDiv, article);
					return this;
				},
				add: function() {
					//throttler();
					return this.subject.add();
				},
				remove: function() {
					//this.handle && this.handle.remove(this.handle);
					return this.subject.remove();
				},
				get: function() {
					var el = this.subject.get();
					if (el) {
						return el;
					} else {
						//this.init();
						return this.add().get();
					}
				}
			};
		}()),
		makeLeaf = function(comp, config, el) {
			var leaf = gAlp.Composite(null, config.intaface);
			leaf.hide = ptL(config.hider, config.klas, el);
			leaf.show = ptL(config.shower, config.klas, el);
			leaf.get = always(el);
			comp.add(leaf);
		},
		makeDisplayer = function(inc, conf, bool) {
            
			function setDisplays(inc, comp) {
				comp.hide = function() {
					_.each(inc, function(leaf) {
						leaf.hide();
					});
				};
				comp.show = function(j) {
					comp.hide();
					_.each(inc, function(leaf, i) {
						if (!isNaN(j) && j === i) {
							leaf.show(); //show pair
						} else if (isNaN(j)) {
							leaf.show();
						}
					});
				};
                return bool ? _.extend(comp, new gAlp.Util.Observer()) : comp;
			}
            
			return setDisplays(inc, gAlp.Composite(inc, conf.intaface));
		},
		simpleComp = function(coll, config) {
			var comp = makeDisplayer([], config),
				doLeaf = ptL(makeLeaf, comp, config);
			_.each(coll, doLeaf);
			return comp;
		},
		machDisplayComp = function(coll, config) {
			var headcomp = makeDisplayer([], config, true),
				mycomp = headcomp,
				recur = function(gang) {
					_.each(gang, function(arg) {
						if (_.isArray(arg)) {
							mycomp = makeDisplayer([], config);
							headcomp.add(mycomp);
							recur(arg);
						} else {
							makeLeaf(mycomp, config, arg);
						}
					});
				};
			headcomp.handle = function(e) {
				var i = this.strategy(e);
				if (i >= 0) {
					this.show(i);
					this.fire(i);
				}
			};
			headcomp.getIndex = function() {
				return this.strategy && this.strategy(true) || 0;
			};
			recur(coll);
			headcomp.subscribe(doToolTip);
			return headcomp;
		},
		getDisplayComp = ptL(machDisplayComp, display_elements, myconfig),
		tabFactory = function(gallery, index) {
			if (isNaN(index)) {
				return;
			}

			function prepTitles() {
				return ['Alpacas For Sale', mapLinktoTitle(getLink()), 'Next Alpaca'];
			}

			function getLI() {
				return _.compose(anCr, _.compose(anCr($nav.get()), always('li')))();
			}

			function doTabs(doLI, str) {
				return _.compose(gAlp.Util.setText(str.capitalize()), doLI())('a');
			}

			function doTabsLoop(doLI, str, i) {
				///REMEMBER a new decorateWhen PER LOOP
				var v = validator('wrong link', ptL(gAlp.Util.isEqual, 1, i)),
					doParent = _.compose(ptL(doAddClass, 'current'), doDrillDown(['parentNode'])),
					doWhen = ptL(decorateWhen(v), doParent);
				return _.compose(doWhen, gAlp.Util.setText(str.capitalize()), doLI())('a');
			}

			function throttler(callback) {
				if (!getEnvironment()) {
					getEnvironment = _.negate(getEnvironment);
				}
				var handler = function() {
					if (!getEnvironment() && $nav.get()) {
						//con('ch...')
						getEnvironment = _.negate(getEnvironment);
						callback();
					}
				};
				return gAlp.Util.addHandler('resize', window, _.throttle(handler, 66));
			}

			function addHandler(id, cb) {
				return _.compose(_.identity, ptL(prepHandle, cb), ptL(doAddClass, id))($nav.get());
			}

			function doAddHandler(f) {
				this.handle = f();
				//this.handle = gAlp.Util.addHandler('click', window.alert.bind(window, 'bond'), mynav);
			}
			var I = 0,
				$nav = mynav.init(),
				ctxt = getDisplayComp(index),
				getLink = getLinkDefer(index),
				resizerinc = [],
				resizercomp = makeDisplayer(resizerinc, myconfig, true),
				doTabNav = _.compose(ptL(doTabs, getLI)),
				doLoopNav = _.compose(ptL(doTabsLoop, getLI)),
				prepHandle = ptL(gAlp.Util.addHandler, 'click'),
				init = function(coll, iteratee) {
					_.each(coll(), iteratee);
				},
				hide = function() {
					$nav.remove();
				},
				doExit = function(i) {
					$nav.remove();
					ctxt.fire(i);
				},
				exiting = function(subject, i) {
					ctxt.unsubscribe(subject);
					doExit(i);
				},
				prepLoop = function() {
					var handler = function(e) {
							var events = [ctxt.handle.bind(ctxt), _.compose(_.bind(gallery.execute, gallery), _.bind($nav.remove, $nav)), noOp, noOp],
								composed = _.compose(doThrice(stringOp)('match'), doDrillDown(['target', 'innerHTML']))(e),
								best = ptL(gAlp.Util.getBest, function(arr) {
									return composed(arr[0]);
								}, _.zip(navExes, events));
							_.compose(gAlp.Util.getDefaultAction, best)()();
						},
						nextLoop = function() {
							var fromClass = _.compose(getDomTargetLink, ptL(byIndex, 0), ptL(gAlp.Util.getByClass, 'current')),
								pre_prepped = _.compose(ptL(gAlp.Util.setter, fromClass, 'innerHTML'), getAlpacaTitles),
								isNotEmpty = function(arg) {
									return arg;
								},
								prepped = _.compose(ptL(gAlp.Util.invokeWhen, _.compose(isNotEmpty, fromClass), pre_prepped)),
								exit = ptL(exiting, prepped);
							return function(i) {
								this.exit = exit;
								ctxt.subscribe(prepped);
								ctxt.fire(i);
							};
						},
						looper = {
							init: ptL(init, prepTitles, doLoopNav),
							id: 'loop',
							addHandler: ptL(doAddHandler, ptL(addHandler, 'loop', handler)),
							hide: hide,
							doNext: nextLoop(),
							delegate: ptL(simpleInvoke, ctxt, 'handle', false)
						};
					return looper;
				},
				prepTab = function() {
					var nextTab = function(i) {
							var navbar = simpleComp($nav.get().childNodes, _.extend(myconfig, {
									klas: 'current'
								})),
								boundNav = _.bind(navbar.show, navbar);
							ctxt.subscribe(boundNav);
							ctxt.fire(i);
							this.exit = function(i) {
								ctxt.unsubscribe(boundNav);
								doExit(i);
							};
						},
						tabber = {
							init: ptL(init, partialLinks, doTabNav),
							id: 'tab',
							addHandler: ptL(doAddHandler, ptL(addHandler, 'tab', ctxt.handle.bind(ctxt))),
							hide: hide,
							doNext: nextTab,
							delegate: ptL(simpleInvoke, ctxt, 'handle')
						};
					return tabber;
				},
				layouts = {
					loop: prepLoop(),
					tab: prepTab(),
				},
				prepareLayout = function(comp) {
					if (!comp) {
						return;
					}
					_.extend(comp, gAlp.Composite([], myconfig.intaface));
					comp.show = function(j) {
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
				mecallback = function() {
					return function() {
						resizerinc[I].exit(ctxt.getIndex());
						I = (I += 1) % resizerinc.length;
						resizerinc[I].show(ctxt.getIndex());
					};
				},
				prepHandler = function(cb) {
					this.handle = throttler(cb);
				},
				resize_callback = mecallback(I),
				sortLayouts = function() {
					var mylayouts = [layouts[routes[0]]],
						alt = layouts[routes[1]],
						action = _.compose(ptL(prepHandler, resize_callback), ptL(simpleInvoke, mylayouts, 'push', alt)),
						deferred = ptL(gAlp.Util.invokeWhen, always(alt), _.bind(action, resizercomp));
					deferred();
					_.each(mylayouts, prepareLayout);
					mylayouts = [];
				};
			sortLayouts();
			//memoize...
			tabFactory = function(gallery, index) {
				if (isNaN(index)) {
					return;
				}
				//$nav = mynav.init();
				getLink = getLinkDefer(index);
				//IF user resizes while in gallery mode, we CHOOSE NOT to update the predicate until this moment...
				if (!getEnvironment()) {
					getEnvironment = _.negate(getEnvironment);
					resize_callback();
				} else {
					resizercomp.get(I).show(index);
				}
			};
			resizercomp.get(0).show(index);
		}, //orig tabFactory
		makeFigure = function(ancor, el) {
			var grabAlt = _.compose(doDrillDown(['alt']), getDomTargetImage),
				preptext = _.compose(gAlp.Util.setText, grabAlt)(el);
			return {
				execute: function() {
					doAddClass('extent', ancor);
					var fig = _.compose(anCr(ancor), always('figure'))();
					this.subject = gAlp.Util.makeElement(ptL(idty, fig), preptext, anCr(fig), always('figcaption'), anMv(fig), ptL(idty, el)).add();
					return this;
				},
				find: function(e) {
					var myimg_alt = _.compose(doDrillDown(['alt']), getDomTargetImage)(this.subject.get()),
						tgt_alt = doDrillDown(['target', 'alt'])(e);
					return (myimg_alt === tgt_alt);
				},
				undo: function(i) {
					gAlp.Util.removeClass('extent', ancor);
					var link = _.compose(getDomTargetLink)(this.subject.get());
					gAlp.Util.insertAfter(link, tables[i]);
					this.subject.remove();
				}
			};
		},
		loader = function(coll, layout, target_node, proxy) {
			_.compose(ptL(doAddClass, 'sell'), always(document.body))();
			var goFigure = ptL(makeFigure, target_node),
				getFigs = function() {
					return _.map(coll, function(el) {
						return goFigure(el).execute();
					});
				},
				toggleTable = function() {
					var f = ptL(gAlp.Util.toggleClass, ['tog'], target_node);
					//f = window.confirm.bind(window, 'proceed');
					return gAlp.Util.addEvent(ptL(gAlp.Util.addHandler, 'click'), f)(target_node);
				},
				delBridge = function(action, e) {
					var getText = doDrillDown(['target', 'nodeName']),
						val = _.compose(doThrice(simpleInvoke)(/img/i)('match'), getText),
						isImg = gAlp.Util.validator('Please click on an image', val);
					try {
						return gAlp.Util.conditional(isImg)(action, e);
					} catch (e) {
						//report.innerHTML = e.message;
						true;
					}
				},
				delegate = function(coll, ctxt, e) {
					var j;
					_.each(getResult(coll), function($el, i) {
						if ($el.find(e)) {
							j = i;
						}
						$el.undo(i);
					});
					ctxt.handler && ctxt.handler.remove(ctxt.handler);
					ctxt.handler = toggleTable();
					return j;
				},
				execs = function(base) {
					var layouts = {
						loop: {
							execute: function() {
								base.handler && base.handler.remove(base.handler);
								var figs = getFigs(),
									pred = ptL(delBridge, ptL(delegate, figs, base)),
									action = ptL(tabFactory, proxy),
									pred_action = _.compose(action, pred);
								//pred_action = doTwice(gAlp.Util.doWhen)(action);
								//pred_action = _.compose(pred_action, pred);                                
								base.handler = gAlp.Util.addEvent(ptL(gAlp.Util.addHandler, 'click'), pred_action)(target_node);
							}
						},
						tab: {
							execute: function() {
								base.handler && base.handler.remove(base.handler);
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
			execute: function() {
				this.subject && this.subject.handler.remove(this.subject.handler);
				this.subject = loader(links, routes[0], sellDiv, this);
				this.subject.execute();
			}
		};
	myloader.execute();
}('(min-width: 769px)', Modernizr.mq('only all'), document.getElementById('article'), document.getElementsByTagName('h2')[0], 'show', /\/([a-z]+)\d?\.jpg$/i, [/^next/i, /sale$/i, /^[^<]/i, /^</], {
	lo: 3,
	hi: 4
}));