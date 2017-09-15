
if (!window.gAlp) {
    window.gAlp = {};
}

//http://stackoverflow.com/questions/7365172/semicolon-before-self-invoking-function
gAlp.Sales = /*;*/ (function(core, iterator, gallery, tagbuilder, publisher) { //5


    function addEvent(obj, type, fn) {

        if (obj.addEventListener) {
            obj.addEventListener(type, fn, false);
            EventCache.add(obj, type, fn);
        } else if (obj.attachEvent) {
            obj["e" + type + fn] = fn;
            obj[type + fn] = function() {
                obj["e" + type + fn](window.event);
            };
            obj.attachEvent("on" + type, obj[type + fn]);
            EventCache.add(obj, type, fn);
        } else {
            obj["on" + type] = obj["e" + type + fn];
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var EventCache = function() {
            var listEvents = [];
            return {
                listEvents: listEvents,
                add: function(node, sEventName, fHandler) {
                    listEvents.push(arguments);
                },
                remove: function(i){
                   listEvents.splice(i, 1); 
                },
                 flush: function() {
                    var i = 0, item, L = listEvents.length;
                    while(L--){
                        item = listEvents[L];
                        if (item[0].removeEventListener) {
                            item[0].removeEventListener(item[1], item[2], item[3]);
                        }
                         if (item[1].substring(0, 2) !== "on") {
                            item[1] = "on" + item[1];
                        }
                        if (item[0].detachEvent) {
                            item[0].detachEvent(item[1], item[2]);
                        }
                         item[0][item[1]] = null;
                         this.remove(L);
                        }
                }
            };
        }(),


        setup = (function() {

            var onEnter = function(klas) {
                    core.show(this.element, klas);
                },

                onExit = function() {
                    core.removeClass(this.element, 'selling');
                },

                toggle = function(e) {

                    this.element = document.getElementsByTagName('body')[0];

                    if (!core.indexOf(core.getInnerHTML(e.target), 'sale')) {
                        return;
                    }
                    e.preventDefault();
                    if (core.hasClass(this.element, 'selling')) {
                       this.onExit();
                       this.init();
                        this.fire('exit');
                        
                    } else {
                        this.onEnter('selling');
                        this.init();
                        this.fire('entrer');
                    }
                };

            return {

                element: null,

                onEnter: onEnter,

                init: function() {
                    var nav;
                     EventCache.flush.apply(EventCache);
                        if (!(nav = document.getElementById('sidebar'))) {
                            return false;
                        }
                        addEvent(nav, 'click', setup.toggle.bind(setup));
                },

                term: 'data-hook', //could be id, src, href, alt, title etc...    

                onExit: onExit,

                toggle: toggle

            }
        })(),


        Mediator = function() {

            var element = document.getElementById("copy"),
                thumbs = core.getElementsByClass('thumbnails'),
                tables = document.getElementsByTagName('table'),
                enhanced = 'js',
                getNodeByData = core.searchBy("data-hook"),
                flag = 1,
                show = function() {
                    core.show.apply(core, arguments);
                },
                hide = function() {
                    core.hide.apply(core, arguments);
                },
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                thumbViews = function() {

                    var wrapper = core.decorator(core.getInnerHTML),
                        getEl = function(tgt) {
                            return core.getTarget(this.getCurrent(), tgt, 'firstChild', core.getNextElement);
                        },
                        getElWrap = function(original, el) {
                            return core.getInnerHTML(original(el));
                        },
                        getEl = getEl.wrap(getElWrap),
                        getAnchor = function(tgt) {
                            return core.getTarget(this.getCurrent(), tgt, 'firstChild', core.getNextElement);
                        };

                    return {

                        getId: getEl,

                        getAnchor: getAnchor,

                        indexOf: function(str) {
                            return this.getId('dt') === str;
                        },

                        append: function(el, child) {
                            el.appendChild(child);
                        },

                        restore: function(child) {
                            this.find(getNodeByData(child));
                            if (this.getCurrent()) {
                                this.append(this.getAnchor('dd'), child);
                            }
                        }
                    };
                },
                ///////////////////////

                viewBuilder = function() {

                    var getNodeByTitle = core.searchBy("title"),

                        wrap = function(wrp, node) {
                            return core.wrapElement(wrp, node);
                        },

                        getElement = function(flag) {
                            return function(target) {
                                if (flag) return core.getPreviousElement(target);
                                return core.getNextElement(target);
                            }
                        },

                        getTarget = function(direction, traverser) {
                            return function(anchor, strNode) {
                                core.getTarget(anchor, strNode, direction, traverser);
                            }
                        },

                        placeAll = function(target) {
                            this.section.appendChild(this.getCurrent());
                            this.section.appendChild(target);
                        },

                        placeTable = function(target) {
                            core.prependChild(this.section, this.getCurrent());
                        },

                        u1 = function() {
                            return this.getNextElement(this.section.childNodes[0]);
                        },

                        u2 = function() {
                            var tbl = this.getCurrent(),
                                el = this.getNextElement(tbl.nextSibling);
                            core.unWrapElement(tbl);
                            return el;
                        },

                        state = [{
                                place: placeAll,
                                unwrap: function() {}
                            },
                            {
                                place: placeTable,
                                unwrap: u1
                            },
                            {
                                place: placeTable,
                                unwrap: u2
                            }
                        ];

                    getNodeByData = getNodeByData.wrap(core.decorator(core.getFirstValue));
                    getNodeByTitle = getNodeByTitle.wrap(core.decorator(core.getFirstValue));

                    return {

                        wrapper: 'section',

                        display: 'chosen',

                        show: show,

                        hide: hide,

                        wrap: wrap,

                        getTarget: getTarget('firstChild'),

                        getPreviousElement: getElement(true),

                        getNextElement: getElement(),

                        indexOf: function(arg) {
                            return getNodeByTitle(this.getCurrent()) === getNodeByData(arg);
                        },

                        sort: function(tgt) {
                            if (!tgt.querySelector('img')) {
                                var attr = tgt.getAttribute('href'),
                                    term = 'img[src="' + attr + '"]';
                                tgt = this.getTarget(null, term);
                                tgt = tgt.parentNode;
                            }
                            return tgt;
                        },

                        enter: function() {
                            this.container = this.container || this.getCurrent().parentNode;
                            this.section = this.section || this.container.appendChild(this.wrap(this.wrapper));
                        },

                        init: function(tgt) {
                            this.soMatch(this.sort(tgt));
                        },

                        soMatch: function(tgt, flag) {
                            this.find(tgt);
                            if (this.getCurrent()) {
                                this.build(tgt);
                                //setTimeout(that.undoBuild, 2500);
                            }
                        },

                        place: function() {
                            var i = this.section.childNodes.length;
                            state[i].place.apply(this, arguments);
                        },

                        unwrap: function(arg) {
                            var i = this.section.childNodes.length;
                            return state[i].unwrap.apply(this, arguments);
                        },

                        build: function(target) {
                            this.show(this.container, this.display);
                            this.place(target);
                        },

                        undoBuild: function(arg) {
                            core.removeWhiteSpace(this.section);
                            var lnk = this.unwrap(arg);
                            this.hide(this.container, this.display);
                            if (lnk) return lnk;
                        }
                    };
                },



                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                isActive = function() {
                    return element.className.length;
                },

                configNav = {

                    init: function(element, data, options) {
                        if (!element) return;
                        this.element = element;
                        this.setChildren(data, options);
                        return this;
                    },

                    getIndex: function() {
                        return this.children.getIndex();
                    },

                    children: {

                        indexOf: function(arg) {
                            if (this.getCurrent()) {
                                return this.getCurrent().getElement() === arg;
                            }
                        },

                        hasNext: function() {
                            return this.getIndex() > 0;
                        },

                        addItem: function(Comp) {
                            var key = Comp.getElement().firstChild.innerHTML;
                            this.getData()[key] = Comp;
                            this.getKeys().push(key);
                        },

                        removeItem: function(index) {
                            this.getCurrent().removeElement();
                            var data = this.getData(),
                                keys = this.getKeys();
                            delete data[keys[index]];
                            keys.splice(index, 1);
                        }

                    } //children
                },

                getMenuIndex = function(lnk) {
                    this.nav.getChild(lnk.parentNode); //sets current
                    return this.nav.getIndex();
                },

                getThumbView = function() {
                    if (!thumbViews.restore) {
                        thumbViews = thumbViews();
                        core.augment(thumbViews, iterator(thumbs));
                    }
                    return thumbViews;
                },

                getDetailView = function() {
                    if (!viewBuilder.init) {
                        viewBuilder = viewBuilder();
                        core.augment(viewBuilder, iterator(tables));
                    }
                    return viewBuilder;
                },

                prepareView = function() {
                    var t = getDetailView();
                    t.enter.apply(t, arguments);
                },

                makeBase = function(obj) {
                    var base = core.create(core.Base)
                    core.augment(obj, base);
                },

                makeComp = function(Comp) {
                    var Element = core.create(gAlp.Element);
                    makeBase(Element);
                    core.augment(Element, core.create(Comp));
                    return Element;
                },

                setElement = function(Element, name, func, element) {
                    Element.method(name, func);
                    if (element) {
                        Element.init(element);
                    }
                    return Element;
                },

                prepareMenu = function(conf, flag) {

                    var o, p,
                        getNext = core.getNextElement.bind(core),
                        ul = getNext(element.firstChild),
                        initDiv = function(element, data, options) {
                            if (!element) return;
                            this.element = element;
                            this.setChildren(data, options);

                            this.children.removeItem = function(index) {
                                this.getCurrent().removeElement();
                                this.getData().splice(index, 1);
                            };

                            return this;
                        };

                    this.navContainer = setElement(makeComp(core.createComponent({})), 'init', initDiv, element);
                    this.nav = makeComp(core.createComponent({})),
                        this.navContainer.addChild(this.nav.init(ul));
                    this.navContainer.removeChild(0);

                    this.nav.fetchElement(conf, element, flag);
                    this.nav = makeComp(core.createComponent({})); //overwrite old

                    ul = getNext(element.firstChild);

                    setElement(this.nav, 'init', configNav.init);
                    setElement(this.nav, 'getIndex', configNav.getIndex);
                    this.nav.init(ul, {}, {
                        loop: false,
                        rev: true
                    });

                    o = configNav.children;
                    makeBase(this.nav.children); //mix in method method to iterator

                    for (p in o) {
                        setElement(this.nav.children, p, o[p]);
                    }

                    core.removeWhiteSpace(ul);

                    var lis = ul.childNodes,
                        i = 0,
                        L = lis.length,
                        el;

                    while (i < L) {
                        el = makeComp(core.createComponent());
                        this.nav.addChild(el.init(lis[i]));
                        i++;
                    }
                    this.navContainer.addChild(this.nav);
                    this.show();
                };


            return {

                show: function() {
                    show.call(this, element, enhanced);
                },

                hide: function() {
                    hide.call(this, element, enhanced);
                },

                prepareMenu: prepareMenu,

                getMenuIndex: getMenuIndex,

                updateNav: function() {
                    if(this.nav){
                    this.nav.removeChild();
                    this.hide();
                    }
                },

                prepareThumbs: function() {
                    if (!thumbs[0]) {
                        return false;
                    }
                    addEvent(element, 'click', viewAlpaca.listener(this).bind(viewAlpaca));
                    prepareView();
                },

                getDetailView: function() {
                    var v = getDetailView();
                    v.init.apply(v, arguments);
                },

                undo: function() {
                    var v = getDetailView(),
                        t = getThumbView(),
                        lnk = v.undoBuild.apply(v, arguments);
                    if (arguments.length) {
                        t.restore.apply(t, arguments);
                    } else { //exit
                        this.updateNav();
                        if (lnk) t.restore(lnk);
                    }
                },

                unwrap: function() {
                    var v = getDetailView();
                    v.unwrap.apply(v, arguments);
                },

                place: function() {
                    var v = getDetailView();
                    v.place.apply(v, arguments);
                },

                restore: function() {
                    var t = getThumbView();
                    t.restore.apply(t, arguments);
                }
            };

        },

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        viewAlpaca = (function() {

            var getHref = core.searchBy('href'),
                getData = core.searchBy('data-hook'),
                getDataWrap = function(original, str) {
                    return core.getFirstValue(original(str))
                },
                getList = function() {
                    return document.querySelector("#copy ul");
                },
                getListWrap = function(original) {
                    return core.getInnerHTML(original().querySelector('li a'));
                },
                getFirstVal = getData.wrap(getDataWrap),
                getCopy = getList.wrap(getListWrap),
                setTitle = function(tgt, attr) {
                    var txt = attr ? "Click for a bigger picture of " + tgt.getAttribute(attr) :
                        "Click to return to details for " + tgt.getAttribute("alt");
                    // tgt.setAttribute("title", "Click for a bigger picture of " + singular(tgt.getAttribute("src")));
                    tgt.parentNode.setAttribute("title", txt);
                };


            return {

                prepareData: function(copy, current, next) {

                    var data = {
                        /*second underscore is present so when split [ul, 0, 1] 1 is a flag to prepend rather than default to append
                        intended for opening (parent) tag only, 0 is a flag to ignore placement as sibling*/
                        tag: "ul_0_1",
                        attrs: {
                            'class': 'breadcrumb'
                        },
                        children: [{
                                tag: "li",
                                children: [{
                                    tag: "a",
                                    attrs: {
                                        href: ".",
                                    },
                                    content: copy
                                }]
                            },
                            {
                                tag: "li_1", //when string is split on underscore a positive result indicates node is sibling
                                children: [{
                                    tag: "a",
                                    attrs: {
                                        href: getHref(current),
                                        'data-hook': getData(current)
                                    },
                                    content: getFirstVal(current)
                                }]
                            },

                            {
                                tag: "li_2",
                                children: [{
                                    tag: "a",
                                    attrs: {
                                        href: getHref(next),
                                        'data-hook': getData(next)
                                    },
                                    content: 'Next Alpaca'
                                }]
                            }
                        ]
                    };

                    return data;

                },

                getDetails: function(tgt) {
                    
                    
function _round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};

                    gallery.prepareNext(tgt.querySelector('img'));

                    var quo = "  \xBB  ",
                        img = gallery.getEx(),
                        data = this.prepareData(getCopy(), tgt, gallery.getCurrent().parentNode);

                    setTitle(img, 'alt');
                    

                    this.fire('alpaga', tgt); //publish chosen alpaca
                    this.fire('menu', core.Conf(core.create(data)), true); //build new ul
                    
                    var ul = document.querySelector('ul.breadcrumb li a'),
                      tgt = window.getComputedStyle(ul, null),
                        f = tgt.getPropertyValue("font-size");
    
       // ul.innerHTML = _round(parseFloat(f),2);

                },

                listener: function(mediator) {

                    // searches for an underscore on a link to an image and assumes a hybrid name to represent more than one alpaca. It'll do for now.
                    function singular(thesource) {
                        var pat = /(\w+)\/(\w+)\/(\S*)/,
                            result = thesource.match(pat);
                        pat = /[a-zA-Z]+_[a-zA-Z]+\.[a-zA-Z]+/;
                        return pat.test(result[3]) ? 'us' : 'me';
                    }

                    var builder = core.CommandFactory(mediator).getCommand(),
                        viewer = core.CommandFactory(this).getCommand(),
                        getDetails = viewer.execute('getDetails'),
                        getMenuIndex = builder.execute('getMenuIndex'),
                        place = builder.execute('place'),
                        unwrap = builder.execute('unwrap'),
                        undo = builder.execute('undo'),

                        getRoute = function(config, lnk) {
                            var route = config[getMenuIndex(lnk)],
                                context = context || this;
                            if (typeof route !== 'undefined') {
                                return route[0].apply(context, route[1]);
                            }
                        },

                        exit = function(lnk) {
                            var flag = core.getPreviousElement(lnk.parentNode.previousSibling);
                            if (!flag) {
                                this.fire('exit');
                            }
                        }.bind(this),

                        prepareImgIn = function(img) {
                            setTitle(img);
                            unwrap(img.parentNode);
                        },
                        prepareImgOut = function(img) {
                                                        setTitle(img, 'alt');
                            place();
                        },
                        getNextDetails = function(pImg, nImg) {
                            undo(pImg.parentNode);
                            getDetailsBridge(nImg);
                        },
                        getNextPic = function(pImg, nImg) {
                            getNextDetails(pImg, nImg);
                            prepareImgIn(nImg);
                        },
                        getDetailsBridge = function(img) {
                            getDetails(img.parentNode);
                        },

                        prepareImgOutWrap = function(lnk) {
                            
                            var config = [
                                [exit, [lnk]],
                                [prepareImgOut, [gallery.getEx()]],
                                [getNextPic, [gallery.getEx(), gallery.getCurrent()]]
                            ];
                            getRoute(config, lnk);
                        },

                        getDetailsBridgeWrap = function(lnk) {
                            var config = [
                                [exit, [lnk]],
                                [prepareImgIn, [gallery.getEx()]],
                                [getNextDetails, [gallery.getEx(), gallery.getCurrent()]]
                            ];
                            getRoute(config, lnk);
                        },

                        routes = {
                            img: [getDetailsBridge, prepareImgOut, prepareImgIn],
                            a: [exit, prepareImgOutWrap, getDetailsBridgeWrap]
                        };

                    return function(e) {

                        e.preventDefault();
                        e.stopPropagation();

                        var tgt = e.target,
                            node = tgt.nodeName.toLowerCase(),
                            gang = document.getElementsByTagName('section')[0],
                            extent = gang.childNodes.length,
                            method = routes[node];

                        //ie if node && node maps to method
                        if (method) method = method[extent];
                        if (method) method(tgt);
                    } //returned
                } //l

            };
        })();

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////      

    function bindEvents() {
        
        var options = {
                rev: false,
                loop: true
            },
            mediator = Mediator();

        core.augment(gallery, iterator(document.querySelectorAll('.thumbnails img'), options));

        core.publish.call(publisher, viewAlpaca);
        core.publish.call(publisher, tagbuilder);
        core.publish.call(publisher, setup);
        core.publish.call(publisher, mediator);

        setup.on('entrer', 'prepareThumbs', mediator);
        setup.on('exit', 'undo', mediator);

        mediator.on("s'apprêter", 'toggle', mediator);
        mediator.on('menu', 'prepareMenu', mediator);
        mediator.on('retourner', 'restore', mediator);
        mediator.on('alpaga', 'getDetailView', mediator);

        setup.init();

    }
    addEvent(window, 'load', bindEvents);

})(gAlp.Core, gAlp.Iterator, gAlp.Gallery, gAlp.tagBuilder, gAlp.Publish);