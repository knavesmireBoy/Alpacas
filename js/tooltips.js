/*jslint browser: true*/
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global _: false */
/*global gAlp: false */
if (!window.gAlp) {
	window.gAlp = {};
}
window.gAlp.Tooltip = function(anchor, instr, count) {
	//"use strict";
	var $ = function(str) {
			return document.getElementById(str);
		},
		setText = gAlp.Util.setText,
		setAttrs = gAlp.Util.setAttrs,
		createDiv = _.partial(gAlp.Util.getNewElement, 'div'),
		doElement = _.partial(gAlp.Util.render, anchor, null, createDiv),
		doAttrs = _.partial(setAttrs, {
			id: 'tooltip'
		}),
		timeout = function(fn, delay, el) {
			return window.setTimeout(_.bind(fn, null, el), delay);
		},
		prep = function() {
			var gang = [],
				add = gAlp.Util.addClass,
				a = _.partial(add, ['tip']),
				b = _.partial(gAlp.Util.removeClass, ['tip']),
				c = _.partial(add, ['tb1']),
				d = _.partial(add, ['tb2']),
				git = function() {
                    if(instr[1]){
                        //$('tooltip') may not exist if cancel has been called
					var parent = $('tooltip'),
                        tgt = gAlp.Util.getDomChild(gAlp.Util.getNodeByTag('div'));
                          if(parent){
                              gAlp.Util.makeElement(setText(instr[1]), _.partial(_.identity, tgt(parent.firstChild))).add();
                          }
                    }
				},
				wrap = function(f, el) {
					git();
					return f(el);
				};
			gang.push(_.partial(timeout, a, 1000));
			gang.push(_.partial(timeout, b, 9000));
			gang.push(_.partial(timeout, _.wrap(c, wrap), 4000));
			gang.push(_.partial(timeout, d, 6500));
			return gang;
		},
        init = function(){
            //this.cancel();
            var tip = gAlp.Util.makeElement(_.partial(_.bind(timer.run, timer), prep()), doAttrs, doElement).add().get(),
                doDiv = _.partial(gAlp.Util.render, tip, null, createDiv),
                doAttr = _.partial(setAttrs, {
                    id: 'triangle'
                });
                gAlp.Util.makeElement(setText(instr[0]), doDiv).add();
                gAlp.Util.makeElement(doAttr, doDiv).add();
            return this;
            },
        
        dummytimer = {
            init: function(){},
			run: function() {},
			ids: [],
			cancel: function() {}
		},

		timer = {
            init: init,
			run: function(gang, el) {
				var invoke = function(partial) {
					return partial(el);
				};
				this.ids = _.map(gang, invoke, this);
				return el;
			},
			ids: [],
			cancel: function() {
				_.each(this.ids, window.clearTimeout);
				this.ids = [];
				gAlp.Util.removeNodeOnComplete($('tooltip'));
			}
		};
		//init.call(timer);
	return count-- && Modernizr.cssanimations ? timer : dummytimer;
};

gAlp.highLighter = {
			perform: function() {
                document.body.style.backgroundColor = 'black';
                function simpleInvoke(o, m, arg) {
                    return o[m](arg);
                }

				if (!gAlp.Util.hasFeature('nthchild')) {
					this.perform = function() {
						var getBody = gAlp.Util.curry3(simpleInvoke)('body')('getElementsByTagName'),
							getLinks = gAlp.Util.curry3(simpleInvoke)('a')('getElementsByTagName'),
							getTerm = _.compose(gAlp.Util.curry2(gAlp.Util.getter)('id'), _.partial(gAlp.Util.byIndex, 0), getBody),
							links = _.compose(getLinks, gAlp.Util.curry3(simpleInvoke)('nav')('getElementById'))(document),
							found = _.partial(_.filter, _.toArray(links), function(link) {
								return new RegExp(link.innerHTML.replace(/ /gi, '_'), 'i').test(getTerm(document));
							});
						_.compose(_.partial(gAlp.Util.addClass, 'current'), _.partial(gAlp.Util.byIndex, 0), found)();
					};
				} else {
					this.perform = function() {};
				}
				this.perform();
			}
		};