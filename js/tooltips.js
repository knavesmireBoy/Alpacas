/*jslint browser: true*/
/*global window: false */
/*global document: false */
/*global _: false */
/*global gAlp: false */
if (!window.gAlp) {
	window.gAlp = {};
}
window.gAlp.Tooltip = function(anchor, instr) {
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
                      //  try {
                            //$('tooltip') may not exit if cancel has been called
					var tgt = gAlp.Util.getDomChild(gAlp.Util.getNodeByTag('div'))($('tooltip').firstChild);
					gAlp.Util.makeElement(setText(instr[1]), _.partial(_.identity, tgt)).add();
                      //  } catch(e){}
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

		timer = {
            init: init,
			run: function(gang, el) {
                console.log(arguments);
                //if(!this.ids.length){
                   // this.init();
                //}
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
	return timer;
};