/*jslint nomen: true */
/*global window: false */
/*global gAlp: false */
/*global document: false */
/*global Modernizr: false */
/*global viewportSize: false */
/*global _: false */
if (!window.gAlp) {
	window.gAlp = {};
}

(function(){ 
    "use strict";
    
    function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}
    
    function invoke(o, m){
        return o[m]();
    }

	function getGreater(a, b) {
		return getResult(a) > getResult(b);
	}
    
    function getPageOffset(bool) {
		var w = window,
			d = document.documentElement || document.body.parentNode || document.body,
			x = (w.pageXOffset !== undefined) ? w.pageXOffset : d.scrollLeft,
			y = (w.pageYOffset !== undefined) ? w.pageYOffset : d.scrollTop;
		return bool ? x : y;
	}
    
    var utils = gAlp.Util,
		ptL = _.partial,
        twice = utils.curryFactory(2),
        twicedefer = utils.curryFactory(2, true),
		eventing = utils.eventer,
        readmoretarget = utils.getByClass('read-more-target')[0],
        para = readmoretarget ? readmoretarget.getElementsByTagName('p') : [],
        handleEl = _.compose(ptL(getGreater, ptL(getPageOffset, false)), twice(utils.getScrollThreshold)()),
        display = ptL(utils.getBest, handleEl, [utils.show, utils.hide]),
        cb = function(){
        _.each(para, function(p){ display(p)(); });
        },
        //invoke execute to add scroll event listener IF conditions are met, remove on resize??
        $cb = twicedefer(invoke)('execute')(eventing('scroll', [], _.throttle(cb, 100), window)),
		enableElip = _.compose(ptL(utils.doWhen, readmoretarget, ptL(utils.addClass, 'elip', para[0]))),
		addScrollHandlers = ptL(_.every, [readmoretarget, Modernizr.ellipsis, Modernizr.touchevents], getResult),
        enableScrollHandlers = _.compose(ptL(utils.doWhen, addScrollHandlers, $cb));
    
    enableScrollHandlers();
    window.setTimeout(enableElip, 3333);
    
}());