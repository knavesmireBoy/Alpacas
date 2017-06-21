gAlp.Sales = function () {


    var $$ = gAlp.$$,
        core = gAlp.Core,
        pub = gAlp.Observer,
        iterator = gAlp.Iterator,
        slice = Array.prototype.slice,
        $ = core.$,
        bodyV, thumbsV, sellsV;


    return {

        prepareThumbs: function () {
            if (!document.getElementsByTagName) return false;
            if (!this.getId()) {
                return false;
            }
            var thumbs = this.getId("thumbnails");

            if (thumbs) {
                addEvent(thumbs, 'click', this.showPageBridge);
            }
        },


        displayModule: function() {
            //classical version

            var F = function () {
            };
            F.prototype = {
                constructor: F,
                newFunc: function(){
                }
            };

            return F;

        }(),

        createView: function(str){
            //classical version
            var args = slice.call(arguments, 1), p,
                o = this.overRides[str];
            function F(){}
            core.extend(F, this.displayModule);
            for(p in o){
                F.prototype[p] = o[p];
            }
            o = new F();//re-use o var
            o.init.apply(o, args);
            return o;
        },

        displayModule: {
            //prototype version
                init: function (inst, tag, parent) {
                    this.$el = inst.init(tag, parent);
                    return this;
                },
              /*  show: function (arg) {
                    throw new Error('Unsupported operation on an abstract class');
                },*/

            show: function (arg) {
                this.$el.show();
            },

            hide: function (arg) {
                this.$el.hide();
            },

                get$: function () {
                    return this.$el;
                },
            shout: function(){console.log(999); return this;}
            },



        createView: function(str){
            //prototype version
            var args = slice.call(arguments, 1), p,
                o = this.overRides[str],
                pub = core.clone(pub),
                obj = core.fromPrototype(pub, this.displayModule);
            for(p in o){
                obj[p] = o[p];
            }
            obj.init.apply(obj, args);
            return obj;
        },



        overRides: {
            body: {
                show: function(){ this.$el.addClass('js'); }
            },

            sell: {
                retrieve: function (el) {
                    var temp = core.clone($$), myel = el;
                    while (myel.nodeName.toLowerCase() !== 'section') {
                        myel = myel.parentNode;
                    }
                    temp.init(myel).addClass('show');
                    return temp;
                }
                }

        },


        isForSale: function (e) {

        //    http://philipwalton.com/articles/decoupling-html-css-and-javascript/

            if (!core.hasMethods()) return;
            core.cloneLoop.call(this, 'body', 'thumbs', 'sell', 'copy');

            var ev = e.type,
                copy = this.$els['copy'],
                _alpacas = $('sell', 'section');

                bodyV = this.createView('body', this.$els['body'], $(null, 'body')[0]);

                if (!bodyV.get$().classed('selling')) return;

            _alpacas = _alpacas ? core.makeIterator(_alpacas) : null;

            //if no element is found a new (copy) element is created. Use the getParent method to determine its validity
            copy.init('copy');

            if (!_alpacas || !copy.getParent()) return;

            this.$els['_alpacas'] = _alpacas;
            thumbsV = this.createView('thumbs', this.$els['thumbs'], 'div', copy);
            thumbsV.get$().setAttrs({'id': 'thumbnails'});
            sellsV = this.createView('sell', this.$els['sell'], $('sell'));

            core.makePub(thumbsV, bodyV, sellsV);

            thumbsV.on('loaded', function (iterator) {
                this.loop('append', iterator);
            }, thumbsV.get$()).on('loaded', bodyV.show, bodyV);

            sellsV.on('selected', function (el) {
                this.append(el);
            }, sellsV.get$());

            thumbsV.fire('loaded', _alpacas).get$().addEvent('click', this.showPageBridge.bind(this));
        },

        showPageBridge: function (e) {

            e.preventDefault();


            var alpacas = this.$els['_alpacas'],
                which = sellsV.retrieve(e.target);

            thumbsV.hide();
            sellsV.show();

         sellsV.fire('selected', which);


            // return this.showpage(e.target);
        },


        tablePic: function () {
            if (!document.getElementsByTagName) return false;
            var table = document.getElementsByTagName("table")[0],
                tablepic, link;
            if (!table) return;
            tablepic = makeElement("img");
            link = makeElement("a");
            link.append(tablepic.getElement());
            link = link.getElement();
            makeElement(table.parentNode).append(link, table);
            addEvent(link, 'click', showpicNew);
        },


        singular: function (thesource) {// searches for an underscore on a link to an image and assumes a hybrid name to represent more than one alpaca. It'll do for now.
            var pat = /(\w+)\/(\w+)\/(\S*)/;
            var result = thesource.match(pat);
            var pat = /[a-zA-Z]+_[a-zA-Z]+\.[a-zA-Z]+/;
            if (pat.test(result[3])) {
                var num = "us";
            }
            else {
                num = "me";
            }
            return num;
        },


        display: function (src, tgt, val, prop) {

            for (var i = 0, t; i < src.length; i++) {
                t = tgt[i] ? makeElement(tgt[i]) : null;
                if (t) {
                    t.query(prop, val);//show table
                }
            }
        },


        sortNav: function (ul, tags, El) {

            if (!ul) {
                return;
            }//or create

            return console.log('ok');

            var list, i, tgt, makeElement = this.makeElement;

            ul = makeElement(ul);
            list = makeElement(ul.getElement().firstChild);

            ul.append(list.getElement());
            list.wrapLink({'href': '.'});

            list = makeElement("li");
            ul.append(list.getElement());

            i = this.getCurrent(tags, El.getElement().parentNode);
            list.wrapLink({'className': 'next'}, El.getAttr('alt'));

            list = makeElement("li");
            ul.append(list.getElement());

            i = i + 1 === tags.length ? 0 : i + 1;

            list = makeElement("li");
            ul.append(list.getElement());
            tgt = this.getTarget(tags[i], "IMG", 'firstChild');

            tgt = makeElement(tgt);

            list.wrapLink({'href': tgt.getAttr('src'), 'className': 'next'}, tgt.getAttr('alt'));

        },

        showpage: function (whichpic) {

            var arg, src, alt, num, t, sell, swap_link, swap_pic, tables, copy, ul, thumbs, tgt, i = 0,
                makeElement = this.makeElement;
            if (!whichpic || whichpic.nodeName !== "IMG") {
                return;
            }
            sell = this.getId('sell');
            thumbs = this.getId("thumbnails");
            swap_link = sell ? sell.getElementsByTagName("a")[0] : null;
            tables = sell ? sell.getElementsByTagName("table") : null;

            copy = document.getElementById("copy");
            ul = copy ? copy.getElementsByTagName("ul")[0] : null;

            arg = makeElement(whichpic);
            src = arg.getAttr("src");
            alt = arg.getAttr("alt");
            num = this.singular(src);
            t = "Click here for a bigger picture of " + num;


            swap_pic = getTarget(swap_link, 'IMG', 'firstChild');
            thumbs = thumbs.getElementsByTagName("a");

            if (swap_pic.nodeName != "IMG") return true;

            //set attributes
            makeElement(swap_pic, {"src": src, "alt": alt});
            makeElement(swap_link, {"href": src, "title": t});

            this.display(thumbs, tables, alt, 'title');//display tables
            this.sortNav(ul, thumbs, arg);


            //addEvent(list, 'click', f);

            return;

            next_link.onclick = function () {
                if (sell_me.className != "show") {
                    var allpics = document.getElementsByTagName("img");
                    var big_pic = allpics[allpics.length - 1];//assumes last image in page
                    if (i < thumblink.length - 1) i++;
                    else (i = 0);
                    big_pic.setAttribute("src", thumblink[i].getAttribute("href"));
                    var num = singular(thumblink[i].getAttribute("href"));
                    big_pic.setAttribute("title", "Click here for information on " + num);
                    var now = thumblink[i].firstChild.getAttribute("alt");
                    txt.nodeValue = now;
                    return false;
                }
                else {
                    table[i].className = "hide";
                    if (i < thumblink.length - 1) i++;
                    else (i = 0);
                    swap_pic.setAttribute("src", thumblink[i].getAttribute("href"));
                    biglink[0].setAttribute("href", thumblink[i].getAttribute("href"));// sets link to big imageontableimage
                    var num = singular(thumblink[i].getAttribute("href"));
                    biglink[0].setAttribute("title", "Click here for a bigger picture " + num);
                    table[i].className = "hide";
                    table[i].className = "show";
                    var now = thumblink[i].firstChild.getAttribute("alt");
                    txt.nodeValue = now;
                    return false;
                }
            };

            next_link.onmouseover = function () {
                sale_link.className = "fill";
            };
            next_link.onmouseout = function () {
                sale_link.className = "";
            };
            return false;
        },

        showpicNew: function (whichpic) {
            var sale_on = document.getElementById("sell");
            var link = document.createElement("a");
            var viewpic = document.createElement("img");
            link.appendChild(viewpic);
            insertAfter(link, sale_on);//
            sale_on.className = "hide";

            var source = whichpic.getAttribute("href");
            if (viewpic.nodeName != "IMG") return true;
            viewpic.setAttribute("src", source);
            viewpic.className = "bigpic";
            link.setAttribute("href", source);
            var num = singular(source);

            link.setAttribute("title", "Click for information on " + num);

            link.onclick = function () {
                viewpic.className = "hide";
                sale_on.className = "show";
                return false;
            };
            return false;
        }

    };
}();



gAlp.Core = gAlp.Core.fromPrototype(gAlp.Core, (function() {
    var astr = '[object Array]',
        ops = Object.prototype.toString,
        inArray = function(haystack, needle) {
            if (!this.isArray(haystack)) return false;
            needle = needle || null;
            for (var i = 0, max = haystack.length; i < max; i++) {
                if (haystack[i] === needle) {
                    return i;
                }
            }
            return -1;
        },
        isArray = function(a) {
            if (!a) return false;
            return ops.call(a) === astr;
        };
    return {//becomes second arg to extend
        isArray: isArray,
        inArray: inArray
    };
}()));


gAlp.Core.addLoadEvent(gAlp.Sales.isForSale.bind(gAlp.Sales));



