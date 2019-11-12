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
(function(article, mq, mobile, desktop) {
    var Len;
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
    var slice = Array.prototype.slice,
        con = _.bind(window.console.log, window.console);

    function checkDummy() {
        var val = gAlp.Util.getComputedStyle(document.getElementById("checkDummy"), "margin-top");
        return val === "1px";
    }
    String.prototype.capitalize = function() {
        var res = this.split(' '),
            mapper = function(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
        res = res.map(mapper);
        return res.join(' ');
    };

    function noOp() {}

    function existy(x) {
        return x != null;
    }

    function always(val) {
        return function() {
            return val;
        };
    }

    function stringOp(reg, o, m) {
        return o[m](reg);
    }

    function fallback(def, arg) {
        return arg || def;
    }

    function fromMethod(method, coll, it) {
        return _[method](coll, it);
    }

    function zipping(iteratee, byIndex, coll) {
        return iteratee(byIndex(coll));
    }

    function fnull(fun /*, defaults */ ) {
        var defaults = _.rest(arguments);
        return function( /* args */ ) {
            var args = _.map(arguments, function(e, i) {
                return existy(e) ? e : defaults[i];
            });
            return fun.apply(null, args);
        };
    }

    function defaults(d) {
        return function(o, k) {
            var val = fnull(idty, d[k]);
            return o && val(o[k]);
        };
    }

    function drill(arr, o) {
        var prop = arr.shift();
        if (prop && arr.length) {
            return drill(arr, o[prop]);
        }
        return o[prop];
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

    function invoke(f) {
        return f();
    }

    function getMethod(m, o) {
        o = getResult(o);
        //return _.bind(o[m], o, _.rest(arguments, 2));
        return o[m].bind(o);
    }

    function simpleInvoke(o, m, arg) {
        if (arguments.length === 3) {
            return o[m](arg);
        }
    }

    function simplewrap(f) {
        return f.apply(null, _.rest(arguments))
    }

    function invokeBridge(arg, m, o) {
        return simpleInvoke(o, m, arg);
    }

    function invokeThen(validate, action) {
        var args = _.rest(arguments, 2),
            res = validate.apply(this || null, args);
        return !undef(res) && action.call(this || null, res);
    }

    function getProp(p, o) {
        return o[p];
    }

    function curryLeft(fn) {
        var args = slice.call(arguments, 1);
        if (args.length >= fn.length) {
            return fn.apply(null, args);
        } else {
            return function() {
                return curryLeft.apply(null, [fn].concat(args, slice.call(arguments)));
            }
        }
    }

    function getResult(arg) {
        return _.isFunction(arg) ? arg() : arg;
    }

    function undef(x) {
        return typeof(x) === 'undefined';
    }

    function pass(action, arg) {
        return !undef(arg) ? action(arg) : null;
    }

    function run() {
        var f = _.first(arguments),
            rest = _.rest(arguments);
        return f.apply(null, rest);
    }

    function gtThan(a, b) {
        return a > b;
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
    var $ = function(str) {
            return document.getElementById(str);
        },
        ptL = _.partial,
        idty = _.identity,
        threshold = Number(desktop.query.match(/[^\d]+(\d+)[^\d]+/)[1]),
        anCr = curryRight(gAlp.Util.setAnchor)(gAlp.Util.getNewElement)(null),
        getNewElement = ptL(gAlp.Util.getNewElement),
        clickHandler = ptL(gAlp.Util.addHandler, 'click'),
        setAnchor = gAlp.Util.setAnchor,
        setFromArray = ptL(gAlp.Util.setFromArray, always(true)),
        curry2 = gAlp.Util.curry2,
        getter = gAlp.Util.getter,
        setText = gAlp.Util.setText,
        exceedsThreshold = ptL(gAlp.Util.gtThan, window.viewportSize.getWidth),
        addClassCurry = gAlp.Util.setFromArrayAlt('add'),
        removeClassCurry = gAlp.Util.setFromArrayAlt('remove'),
        pIdentity = function() {
            return ptL(idty, _.rest(arguments));
        },
        alpacas = [
            [
                ["Granary Grace", "Price on Application"],
                ["D.O.B:", "24.07.2005"],
                ["Type:", "Huacaya"],
                ["Sex:", "Female"],
                ["Colour:", "Fancy but mainly white", ]["Sire:", "Highlander Lad"],
                ["Other info:"],
                ["Grace is an assertive friendly animal, a herd leader. She is an excellent caring mother who has produced three excellent crias (one boy and two girls). She is currently empty but if required she could be covered by our own stud male Granary Carlos who has sired her two female crias. She carries the genetics of Both Highlander and Don Pedro. Price on application."],
                ["alt", "Grace"],
                ["src", "../images/sale/grace.jpg"]
            ],
            [
                ["Granary Maria", "Price on Application"],
                ["D.O.B:", "12.08.2008"],
                ["Type:", "Huacaya"],
                ["Sex:", "Female (Maiden)"],
                ["Colour:", "Solid White"],
                ["Sire:", "Granary Carlos"],
                ["Other info:"],
                ["Unlike her mother (Grace) Maria is a gentle, curious hucaya who likes to be around humans. She is a well fleeced animal who carries the genetics of Highlander and Don Pedro. She is a maiden. Price on application."],
                ["alt", "Maria"],
                ["src", "../images/sale/Maria1.jpg"]
            ],
            [
                ["Granary Pilar", "Price on Application"],
                ["D.O.B:", "26.08.2009"],
                ["Type:", "Huacaya"],
                ["Sex:", "Female"],
                ["Colour:", "Fancy but mainly white"],
                ["Sire:", "Granary Carlos"],
                ["Other info:"],
                ["Pilar is a strikingly marked animal, which goes well with her lively personality. She is well fleeced and good conformation. She is lively, loveable and a perfect pet a favourite with all who meet the herd. She is a maiden who carries the genes of Highlander and Don Pedro. Price on application."],
                ["alt", "Pilar"],
                ["src", "../images/sale/Pilar1.jpg"]
            ]
        ],
        querySizeOutcomes = [_.partial(Modernizr.mq, desktop.query), _.partial(exceedsThreshold, threshold)],
        myQuery = gAlp.Util.getBest(always(mq), querySizeOutcomes),
        matchNode = curry2(gAlp.Util.regEx)('i'),
        getOtherFactory = function(pairs) {
            return _.compose(gAlp.Util.getZero, _.partial(_.without, pairs));
        },
        Presenter = function(coll, display) {
            var enable = ptL(gAlp.Util.addClass, display),
                disable = ptL(gAlp.Util.removeClass, display),
                collection = getResult(_.toArray(coll)),
                load = function() {
                    _.each(collection, disable);
                };
            return {
                enable: function(i) {
                    if (!isNaN(i)) {
                        this.load();
                        enable(collection[i]);
                        //pass index to other potential 'Presenters'
                        return i;
                    }
                },
                disable: function(el) {
                    disable(el);
                },
                load: load
            };
        },
        componentComp = function(data, display, flag, iterator) {
            var func = flag ? componentComp : componentLeaf;
            data = _.map(_.toArray(getResult(data)), function(element) {
                return func(element, display);
            });
            return {
                remove: function(arg) {
                    data = _.filter(data, function(comp) {
                        return comp !== arg;
                    });
                },
                add: function(arg) {
                    this.remove(arg);
                    return data.push(arg);
                },
                get: function(i) {
                    return isNaN(i) ? data : data[i] ? data[i] : null;
                },
                enable: function() {
                    _.each(data, function(comp) {
                        comp.enable();
                    });
                },
                disable: function() {
                    _.each(data, function(comp) {
                        comp.disable();
                    });
                },
                show: function(i) {
                    i = isNaN(i) ? 0 : i;
                    this.disable();
                    this.get(i).enable();
                },
                hide: function(i) {
                    i = isNaN(i) ? 0 : i;
                    this.get(i).disable();
                },
                navigator: function(bool) {
                    if (!iterator) {
                        return;
                    }
                    this.iterator = this.iterator || iterator(this.get());
                    return this.iterator(bool);
                },
                getIndex: function(bool) {
                    return this.navigator(bool);
                },
                getTarget: function(bool) {
                    var i = this.navigator(bool);
                    return this.get(i);
                },
                getNext: function() {
                    this.getTarget(true).disable();
                    this.getTarget().enable();
                    return this.getTarget(true);
                }
            };
        },
        componentLeaf = function(el, display) {
            var enable = ptL(gAlp.Util.addClass, display),
                disable = ptL(gAlp.Util.removeClass, display);
            return {
                enable: function() {
                    return enable(el);
                },
                disable: function() {
                    return disable(el);
                },
                add: noOp,
                remove: noOp,
                get: function() {
                    return el;
                }
            };
        },
        sellDiv = _.compose(ptL(gAlp.Util.setAttrs, {
            id: 'sell'
        }), anCr(article), ptL(idty, 'div'))(),
        renderTable = _.compose(anCr(sellDiv), ptL(idty, 'table')),
        matchFromTable = curry2(gAlp.Util.matchStr)(matchNode('table')),
        getImages = ptL(curryRight(simpleInvoke)('img')('getElementsByTagName'), sellDiv),
        iterateTable = function(getAnchor, subject /*, config*/ ) {
            var table = getAnchor(), //<table></table
                //optional tbody reqd for IE
                render = anCr(table),
                tbody = _.compose(render, ptL(idty))('tbody'),
                //
                getHeadOrData = function(pred, arg, options) {
                    return gAlp.Util.getBest(ptL(pred, arg), options)();
                },
                doColspan = ptL(gAlp.Util.setAttrs, {
                    colspan: 2 //HARD CODE
                }),
                matchLength = ptL(_.compose(ptL(gAlp.Util.isEqual, 1), ptL(getProp, 'length'))),
                getOption = function(pred, arg, op1, op2, o) {
                    //execute chosen function and return object
                    gAlp.Util.getBest(ptL(pred, arg), [ptL(op1, o), ptL(op2, o)])();
                    return o;
                },
                //if !nth-child
                doClass = ptL(gAlp.Util.addClass, 'description'), //HARD CODE
                doOdd = ptL(gAlp.Util.addClass, 'odd'), //HARD CODE
                domatch = ptL(invokeBridge, /^other/i, 'match'), //HARD CODE
                //
                doRow = _.compose(anCr(tbody)),
                addTableAttrs,
                addImgAttrs,
                addLinkAttrs,
                tmp;
            _.each(subject.slice(0, -2), function(tr, j) {
                var row,
                    addclass,
                    addcolspan,
                    type = getHeadOrData(ptL(gAlp.Util.isEqual, 0), j, [ptL(idty, 'th'), ptL(idty, 'td')]);
                _.each(tr, function(td, i, data) {
                    if (i === 0) { //create new row
                        addclass = ptL(getOption, domatch, td, doClass, pIdentity);
                        addcolspan = ptL(getOption, matchLength, data, doColspan, pIdentity);
                        row = _.compose(addclass, doRow)('tr');
                    }
                    if (type === 'th' && !i) {
                        addTableAttrs = ptL(gAlp.Util.setAttrs, {
                            cellspacing: 0,
                            title: td.split(' ')[1]
                        });
                        addImgAttrs = {
                            alt: td.split(' ')[1]
                        };
                    }
                    
                  if(!(gAlp.Util.hasFeature('nthchild')) && j % 2){
                      doOdd(row);
                   }
                    
                    _.compose(addcolspan, gAlp.Util.setText(td), anCr(row))(type);
                });
            });
            render = anCr(table.parentNode),
                addLinkAttrs = _.extend({}, {
                    href: subject.slice(-1)[0][1]
                });
            addLinkAttrs = ptL(gAlp.Util.setAttrs, addLinkAttrs);
            addImgAttrs = _.extend(addImgAttrs, {
                src: subject.slice(-1)[0][1]
            });
            addImgAttrs = ptL(gAlp.Util.setAttrs, addImgAttrs);
            tmp = _.compose(addLinkAttrs, render, ptL(idty))('a');
            render = anCr(tmp);
            _.compose(addImgAttrs, render, ptL(idty))('img');
            addTableAttrs(table);
        },
        loadData = function(data, driver, render) {
            _.each(data, ptL(driver, render));
        },
        displayData = function(coll, display, nav) {
            var sibling = function(el) {
                    return gAlp.Util.getPreviousElement(el.parentNode.previousSibling);
                },
                parent = function(el) {
                    return el.parentNode;
                },
                i = _.map(getResult(coll), parent),
                t = _.map(getResult(coll), sibling),
                zipped = _.zip(i, t),
                zipper = componentComp([], display, true, nav),
                mapper = function(zipped) {
                    return _.map(zipped, function(zip) {
                        return zipper.add(componentComp(zip, display));
                    });
                };
            mapper(zipped);
            return zipper;
        },
        makeTabs = function() {
            var deferText = function(tag, f1, f2, text) {
                    return _.compose(f1(text), f2)(tag);
                },
                doSubstring = function(n, str) {
                    return str.substring(0, str.length - n);
                },
                doSub4 = curryLeft(doSubstring)(4),
                split = function(strategy, str) {
                    var res = str.split('/'),
                        ret = res[res.length - 1];
                    return strategy(ret.replace(/\d/, ''));
                },
                output = function(splitter, arg) {
                    return splitter(arg).capitalize();
                },
                doSplit = curryLeft(split)(doSub4),
                doOutput = curryLeft(output)(doSplit),
                iteratee = function(p, f1, f2, tgt) {
                    return f1(f2(tgt[p]));
                },
                doGang = function(thunk) {
                    return _.toArray(thunk());
                },
                doIterate = function(converter, it) {
                    return _.each(converter, it);
                },
                list = makeElCommand(article, sellDiv, 'ul', 'list').execute(),
                dorenderList = anCr(list.getElement()),
                doRenderLink = anCr(ptL(dorenderList, 'li')),
                fulfill = curryLeft(deferText)('a')(gAlp.Util.setText)(doRenderLink);
            curryLeft(doIterate)(curryLeft(doGang)(getImages))(curryLeft(iteratee)('src')(fulfill)(doOutput));
            return list;
        },
        presentTabList = function(comp) {
            var list = makeTabs(),
                finder = ptL(fromMethod, 'findIndex', list.getChildren('a')),
                isEq = ptL(gAlp.Util.isEqual),
                getTgt = ptL(getProp, 'target'),
                soFind = function(f1, f2, f3, e) {
                    return f1(ptL(f2, f3(e)));
                },
                validator = function(arg) {
                    return arg >= 0 ? arg : undefined;
                },
                tabs = Presenter(list.getChildren('li'), 'current'),
                onload = _.compose(_.bind(tabs.enable, tabs)),
                doShow = _.compose(invoke, ptL(getMethod, 'enable'), comp.get, onload),
                //doShow = _.compose(invoke, ptL(getMethod, 'show'), comp.show, onload),
                maybe = _.compose(validator, ptL(soFind, finder, isEq, getTgt)),
                showEvent = _.wrap(doShow, function(f, res) {
                    comp.disable();
                    f(res);
                });
            tabs.enable(0);
            gAlp.Util.addHandler('click', ptL(invokeThen, maybe, showEvent), list.getElement());
            return list;
        },
        delegateListEvents = function(e, regexs, functions) {
            var strMatch = function(reg, o, m) {
                    return o[m](reg);
                },
                getBest = function(iteratee, byIndex, coll) {
                    return iteratee(byIndex(coll));
                },
                zipped = _.zip(regexs, functions),
                doMatch = gAlp.Util.curry3(strMatch)('match')(drill(['target', 'innerHTML'], e)),
                run = ptL(getBest, doMatch, gAlp.Util.getZero);
            /*NOTE not validating e.target;
            just obtaining the innerHTML and have a noOp on the UL and actions on the links */
            getResult(gAlp.Util.byIndex(1, gAlp.Util.getBest(run, zipped)));
        },
        getCurrentSubjectIndex = function(target, coll, matcher) {
            var doMatch = ptL(gAlp.Util.nested, curry2(getter)('nodeName'), matcher),
                byClass = ptL(gAlp.Util.getByClass, 'show', target),
                getIndex = function(klas) {
                    return _.filter(byClass(klas), function(el) {
                        return doMatch(el);
                    });
                },
                andIndex = ptL(gAlp.Util.byIndex, 0),
                equals = ptL(gAlp.Util.isEqual, andIndex(ptL(getIndex, 'show'))),
                i = _.findIndex(coll, function(el) {
                    return equals(el);
                }),
                nav = ptL(gAlp.Util.looper, i),
                comp = componentComp([], 'show', true, nav);
            _.each(coll, function(el) {
                comp.add(componentLeaf(el, 'show'));
            });
            return comp;
        },
        makeElCommand = function(anchor, target, tag, id) {
            return {
                execute: function() {
                    var dorender = setAnchor(anchor, target, getNewElement),
                        doAttrs = ptL(gAlp.Util.setAttrs, {
                            id: id
                        });
                    this.el = _.compose(doAttrs, dorender)(tag);
                    return this;
                },
                undo: function() {
                    gAlp.Util.removeNodeOnComplete(this.el);
                    this.el = null;
                },
                getElement: function() {
                    return this.el;
                },
                getChildren: function(tag) {
                    return this.el.getElementsByTagName(tag);
                }
            };
        },
        presentAdvanceList = function(comp, command) {
            var tables = _.toArray(gAlp.Util.invokeRest('getElementsByTagName', sellDiv, 'table')),
                regexs = [/sale$/i, /^next/i, /^[^<]/i, /^</],
                events,
                doAttrs = ptL(gAlp.Util.setAttrs, {
                    id: 'current'
                }),
                get_prop = curry2(getter)('title'),
                list = makeElCommand(article, sellDiv, 'ul', 'list').execute(),
                current = getCurrentSubjectIndex(sellDiv, tables, matchFromTable),
                setCaption = ptL(setText(get_prop(current.getTarget(true).get()))),
                dorenderList = setAnchor(list.getElement(), null, getNewElement),
                //create li on the fly..
                doRenderLink = setAnchor(ptL(dorenderList, 'li'), null, getNewElement),
                prepCurrent = _.compose(setCaption, doAttrs, doRenderLink),
                prepClear = _.compose(setText('Alpacas For Sale'), doRenderLink),
                prepNext = _.compose(setText('Next Alpaca'), doRenderLink);
            _.each([prepClear, prepCurrent, prepNext], function(subject) {
                return subject('a');
            });
            events = prepEvents(comp, list, command);
            ptL(clickHandler, gAlp.Util.curry3(delegateListEvents)(events)(regexs), list.getElement())();
            return list;
        },
        toggleClass = function() {
            return setFromArray('toggle', ['tog'], sellDiv);
        },
        toggleTable = gAlp.Util.addEvent(ptL(clickHandler), toggleClass),
        prepEvents = function(comp, list, command) {
            var delegate = function() {
                    var tbl = comp.getNext().get(1).get();
                    setText(curry2(getter)('title')(tbl))($('current'));
                },
                wrapup = function() {
                    list.undo();
                    comp.getTarget(true).disable();
                    this.execute();
                };
            return [_.bind(wrapup, command), delegate, toggleClass, noOp];
        },
        makeFigure = function(listener, link) {
            var dorender = setAnchor(listener.getElement(), null, getNewElement),
                get_prop = curry2(getter)('alt'),
                fig = dorender('figure'),
                img = gAlp.Util.getTargetNode(link, matchNode('img'), 'firstChild'),
                setCaption = ptL(setText(get_prop(img)));
            setAnchor(fig, null, idty)(link);
            dorender = setAnchor(fig, null, getNewElement);
            _.compose(setCaption, dorender)('figcaption');
        },
        makeFakeFigure = function(listener, link) {
            var dorender = setAnchor(listener.getElement(), null, getNewElement),
                get_prop = curry2(getter)('alt'),
                fakeFig = ptL(setFromArray, 'add', 'figure'),
                fig = _.compose(fakeFig, dorender)('div'),
                img = gAlp.Util.getTargetNode(link, matchNode('img'), 'firstChild'),
                setCaption = ptL(setText(get_prop(img)));
            setAnchor(fig, null, idty)(link);
            dorender = setAnchor(fig, null, getNewElement);
            _.compose(setCaption, dorender)('div');
        },
        link2move = ptL(gAlp.Util.invokeRest, 'getElementsByTagName', article, 'a'),
        oldanchor = ptL(gAlp.Util.invokeRest, 'getElementsByTagName', article, 'table'),
        getLinks = ptL(gAlp.Util.toArray, link2move),
        getTables = ptL(gAlp.Util.toArray, oldanchor),
        prepGalleryCommand = function(makeFigure) {
            var count = 2,
                tooltip = _.partial(gAlp.Tooltip, $('article'), ["click here...", "...to toggle table and picture"])();
            return {
                execute: function(loader) {
                    var dorender = setAnchor(article, null, getNewElement),
                        isImg = ptL(gAlp.Util.nested, curry2(getter)('nodeName'), curry2(gAlp.Util.matchStr)(matchNode('img'))),
                        config = {
                            id: 'extent'
                        },
                        that = this,
                        delegate = function(e) {
                            if (isImg(e.target)) {
                                var link = gAlp.Util.getTargetNode(e.target, matchNode('a'), 'parentNode'),
                                    doDisplay = ptL(setFromArray, 'add', ['show']),
                                    comp;
                                that.undo();
                                doDisplay(link);
                                doDisplay(gAlp.Util.getPrevious(link));
                                gAlp.Util.removeNodeOnComplete($('extent'));
                                comp = getCurrentSubjectIndex(sellDiv, getTables(), matchFromTable);
                                loader.sub.load(comp.getIndex(true));
                            }
                        },
                        listener = _.compose(gAlp.Util.addEvent(clickHandler, delegate), ptL(gAlp.Util.setAttrs, config), dorender)('div');
                    _.each(getLinks(), ptL(makeFigure, listener));
                    removeClassCurry('loop')(article);
                },
                undo: function() {
                    var cb = function(coll, el, i) {
                        gAlp.Util.render(sellDiv, coll[i].nextSibling, el);
                    };
                    if (count-- > 0) {
                        tooltip.init();
                    }
                    _.each(getLinks(), ptL(cb, getTables()));
                }
            };
        },
        setup = function() {
            // desktop.validate = _.compose(alert.bind(window), desktop.validate);
            var navLayout = ['loop', 'tab'],
                //last reg (/^$/) not required after refactor Kept as a reminder of how to test for an empty string
                navReg = [/^l/, /^t/, /^$/],
                getOther = getOtherFactory(navLayout),
                //q1 = '(max-width: 600px), (min-width: 769px) and (max-width: 860px)',
                getCopy = function(list) {
                    return !isNaN(list) ? list : list.slice(_.random(0, list.length));
                },
                getCopy2 = function(list) {
                    var n = Len >= 5 ? 3 : Len >= 3 ? 2 : Len >= 1 ? 1 : 0;
                    return list.slice(0, n);
                },
                data = getCopy(alpacas),
                getThreshold = function(getLimit, getMethod, pred) {
                    return _.compose(getLimit, getMethod)(pred());
                },
                getMath = function(hi, lo, method) {
                    return Math[method](hi, lo);
                },
                getMathMethod = function(flag) {
                    return flag ? 'max' : 'min';
                },
                prepThreshold = ptL(getThreshold, ptL(getMath, desktop.limit, mobile.limit), ptL(getMathMethod), ptL(Modernizr.mq, desktop.query)),
                validators = [gAlp.Util.curry2(gtThan)(0), gAlp.Util.curry2(gtThan)(1)],
                getOutcome = function(validators, post, a, b) {
                    var res = _.every(validators, gAlp.Util.curry2(run)(getResult(a)));
                    if (res) {
                        return post(getResult(a), getResult(b));
                    }
                },
                getLen = _.compose(ptL(getProp, 'length'), ptL(idty, data))(),
                doBest = function(partial, list, a, b) {
                    return gAlp.Util.getBest(ptL(partial, a, b), list);
                },
                doSale = function() {
                    return setFromArray('add', 'sell', document.body);
                    /*return something other than null/indef as
                    signal that we have at least one item to sell as a precondition to considering more sale items*/
                },
                selling = ptL(gAlp.Util.invokeWhen, ptL(validators.slice(0, 1)[0], getLen), doSale),
                makeSale = ptL(getOutcome, [selling].concat(validators.slice(1)), ptL(doBest, ptL(gtThan), navLayout), getLen, prepThreshold),
                getLayout = _.compose(ptL(fallback, ''), makeSale),
                navSuper = {
                    init: function() {
                        this.ul = this.ul || this.attach();
                        this.el = this.ul.el;
                    },
                    detach: function() {
                        this.ul = null;
                        this.ul.undo();
                    },
                    attach: function() {},
                    toString: function() {
                        return this.ul.el.className;
                    }
                },
                navfactory = function(o, regexs, functions, str) {
                    var doMatch = gAlp.Util.curry3(stringOp)('match')(str),
                        run = ptL(zipping, doMatch, gAlp.Util.getZero);
                    o.attach = gAlp.Util.byIndex(1, gAlp.Util.getBest(run, _.zip(regexs, functions)));
                    o.id = str;
                    return o;
                },
                initNav = function(nav) {
                    nav.init();
                    addClassCurry(nav.id)(nav.el.parentNode);
                    return nav;
                },
                getWindowState = function() {
                    return Number(gAlp.Util.getBest(always(mq), querySizeOutcomes)());
                },
                test = getWindowState() ? getWindowState : _.negate(getWindowState),
                handlerFactory = gAlp.Util.retWhen(desktop)(mobile),
                getList = gAlp.Util.getDomChild(gAlp.Util.getNodeByTag('ul')),
                removeList = _.compose(ptL(gAlp.Util.removeNodeOnComplete), getList),
                handler = function() {
                    var myquery;
                    if (!test()) {
                        test = _.negate(test);
                        myquery = handlerFactory(myQuery());
                        gAlp.Util.invokeWhen(ptL(myquery.validate, this.sub.type), _.bind(this.exit, this));
                    }
                },
                unload = function(flag) {
                    var type = flag ? getOther(this.type) : this.type;
                    _.compose(removeList, removeClassCurry([type, 'solo']))(article);
                },
                doLoad1 = function(i) {
                    //a scenario where loop layout is in gallery mode
                    //could do with a refactor, restoring state to loop mode
                    //
                    if (i !== -1) {
                        this.comp = displayData(getImages, 'show', ptL(gAlp.Util.looper, i));
                        this.comp.show(i);
                        return true;
                    }
                },
                doLoad2 = function(bool) {
                    if (bool) {
                        if (this.nav) {
                            this.nav.ul = null;
                        } else {
                            unload.call(this, true);
                        }
                        this.getNav();
                    }
                },
                init = function() {
                    toggleTable(sellDiv);
                    loadData(data, iterateTable, renderTable);
                    gAlp.Util.addHandler('resize', window, _.debounce(_.bind(handler, this.sup), 66));
                },
                init1 = function(command) {
                    command.execute = ptL(command.execute, this.sup);
                    this.command = command;
                },
                initLoop = ptL(init1, prepGalleryCommand(ptL(makeFigure))),
                soOnLoad = function() {
                    this.type = getLayout();
                    this.onload();
                },
                onload = function() {
                    this.doLoad();
                },
                getNav = function() {
                    var doNav = ptL(navfactory, navSuper, navReg, [ptL(presentAdvanceList, this.comp, this.command), ptL(presentTabList, this.comp)]);
                    this.nav = initNav(doNav(this.type));
                },
                deliverExit = function() {
                    unload.call(this);
                    var comp = getCurrentSubjectIndex(sellDiv, getTables(), matchFromTable);
                    this.type = getOther(this.type);
                    this.load(comp.getIndex(true));
                },
                doExit = function() {
                    if (this.nav) {
                        deliverExit.call(this);
                    }
                },
                exitTab = function() {
                    //desktop to mobile direction 
                    //if sale quantity does not exceed limit don't switch
                    if (!myQuery() && (getLen <= mobile.limit)) {
                        return;
                    } else {
                        //provides a command object required for running an exit routine see wrapup
                        initLoop.call(this);
                    }
                    doExit.call(this);
                },
                exitLoop = function() {
                    //mobile to desktop direction
                    //if sale quantity exceeds limit don't switch
                    if (myQuery() && (getLen >= desktop.limit)) {
                        return;
                    }
                    doExit.call(this);
                },
                nosale = {
                    init: ptL(gAlp.Util.removeNodeOnComplete, sellDiv)
                },
                solo = {
                    init: _.compose(soOnLoad, init),
                    onload: function() {
                        this.load(0);
                        setFromArray('add', 'solo', article);
                    },
                    load: doLoad1
                },
                tab = {
                    init: _.compose(soOnLoad, init),
                    onload: onload,
                    doLoad: function(i) {
                        this.load(i);
                    },
                    load: _.compose(doLoad2, doLoad1),
                    getNav: getNav,
                    exit: exitTab
                },
                loop = {
                    init: _.compose(soOnLoad, initLoop, init),
                    onload: onload,
                    doLoad: function() {
                        this.command.execute();
                    },
                    load: _.compose(doLoad2, doLoad1),
                    getNav: getNav,
                    exit: exitLoop
                },
                getSubLoader = function(i) {
                    var options1 = [nosale, solo],
                        options2 = [tab, loop],
                        options3 = [],
                        dt = myQuery(),
                        d = i <= desktop.limit,
                        m = i <= mobile.limit,
                        t = options1[i],
                        x = dt ? d : m,
                        res = t ? t : x ? options2[0] : options2[1],
                        op = getOtherFactory(options2)(res);
                    if (t) {
                        options3.push(t, t);
                    } else {
                        options3.push(res, op);
                    }
                    return options3;
                },
                prepSuperLoader = function(sup, sub) {
                    var p,
                        func = function(m) {
                            return function() {
                                return this.sub[m].apply(this.sub, arguments);
                            }
                        }
                    for (p in sub) {
                        if (sub.hasOwnProperty(p)) {
                            sup[p] = func(p);
                        }
                    }
                    sup.sub = sub;
                    return sup;
                },
                meLoader = function(i) {
                    var subs = getSubLoader(i),
                        sup = prepSuperLoader({}, subs[0]);
                    subs[0].sup = sup;
                    subs[1].sup = sup;
                    sup.exit = function() {
                        //force switch to tab layout in order to maintain state
                        if (!this.sub.nav) {
                            this.sub = subs[1];
                            unload.call(this.sub, true);
                            this.sub.type = getLayout();
                        }
                        //normal switch back to loop
                        this.sub.exit();
                    };
                    sup.sub = subs[0];
                    return sup;
                };
            return meLoader(getLen);
        };
    /* only load the javascript if css enabled, a dummy element is placed in html,
    a property applied in css, which will not be accessible if path to css is wrong */
    if (checkDummy()) {
        /*
        var f = function(){
          var loader = setup();
            loader.init();   
        };
        setTimeout(f, 10000);
        */
        var loader = setup();
        loader.init();
        window.loader = loader;
    }
}(document.getElementById('article'), Modernizr.mq('only all'), {
    query: '(max-width: 768px)',
    validate: _.partial(function(x, y) {
			return x === y;
		}, 'loop'),
    limit: 2
}, {
    query: '(min-width: 769px)',
    validate: _.partial(function(x, y) {
			return x === y;
		}, 'tab'),
    limit: 5
}));