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
        utils = gAlp.Util,
		setText = utils.setText,
		setAttrs = utils.setAttrs,
		createDiv = _.partial(utils.getNewElement, 'div'),
		doElement = _.partial(utils.render, anchor, null, createDiv),
		doAttrs = _.partial(setAttrs, {
			id: 'tooltip'
		}),
		timeout = function(fn, delay, el) {
			return window.setTimeout(_.bind(fn, null, el), delay);
		},
		prep = function() {
			var gang = [],
				add = utils.addClass,
				a = _.partial(add, ['tip']),
				b = _.partial(utils.removeClass, ['tip']),
				c = _.partial(add, ['tb1']),
				d = _.partial(add, ['tb2']),
				git = function() {
                    if(instr[1]){
                        //$('tooltip') may not exist if cancel has been called
					var parent = $('tooltip'),
                        tgt = utils.getDomChild(utils.getNodeByTag('div'));
                          if(parent){
                              utils.makeElement(setText(instr[1]), _.partial(_.identity, tgt(parent.firstChild))).add();
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
           // console.log(count)
            if(count--){
            var tip = utils.makeElement(_.partial(_.bind(timer.run, timer), prep()), doAttrs, doElement).add().get(),
                doDiv = _.partial(utils.render, tip, null, createDiv),
                doAttr = _.partial(setAttrs, {
                    id: 'triangle'
                });
                utils.makeElement(setText(instr[0]), doDiv).add();
                utils.makeElement(doAttr, doDiv).add();
            }
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
				utils.removeNodeOnComplete($('tooltip'));
			}
		};
        return Modernizr.cssanimations ? timer : dummytimer;
};

gAlp.highLighter = {
			perform: function() {
                document.body.style.backgroundColor = 'black';
                function simpleInvoke(o, m, arg) {
                    return o[m](arg);
                }
				if (!gAlp.Util.hasFeature('nthchild')) {// utils.hasFeature('nthchild') || Modernizr.nthchild
					this.perform = function() {
						var utils = utils,
                            ptL = _.partial,
                            getBody = utils.curry3(simpleInvoke)('body')('getElementsByTagName'),
							getLinks = utils.curry3(simpleInvoke)('a')('getElementsByTagName'),
							getTerm = _.compose(utils.curry2(utils.getter)('id'), ptL(utils.byIndex, 0), getBody),
							links = _.compose(getLinks, utils.curry3(simpleInvoke)('nav')('getElementById'))(document),
							found = ptL(_.filter, _.toArray(links), function(link) {
								return new RegExp(link.innerHTML.replace(/ /gi, '_'), 'i').test(getTerm(document));
							});
						_.compose(ptL(utils.addClass, 'current'), ptL(utils.byIndex, 0), found)();
					};
				} else {
					this.perform = function() {};
				}
				this.perform();
			}
		};