/*jslint browser: true*/
/*global window: false */
/*global _: false */
/*global gAlp: false */
   if (!window.gAlp) {
	window.gAlp = {};
}

gAlp.Iterator = (function(rev){
    return function(index, coll, validate, doAdvance) {
			var loop = function(bool) {
					if (!bool) {
                        index = gAlp.Util.doWhen(validate, _.partial(doAdvance, index += 1));
					}
					return index;
				},
				switchDirection = function() {
                    coll = gAlp.Util.reverse(coll);
					index = coll.length - 1 - index;
					rev = !rev;
				},
				isReversed = function() {
					return (rev === true);
				},
				getNext = function(pred, bool) {
					gAlp.Util.doWhen(pred(), switchDirection);
					return coll[loop(bool)];
				},
				getNow = function(bool) {
					return coll[loop(bool)];
				},
				forward = _.partial(getNext, isReversed),
				back = _.partial(getNext, _.negate(isReversed)),
				invoke = function(bool) {
					return gAlp.Util.getBest(isReversed, [_.bind(back, null, bool), _.bind(forward, null, bool)])();
				},

				ret = {
					forward: forward,
					back: back,
					getCurrent: _.partial(getNow, true),
					getNext: invoke,
					getIndex: function() {
						return index;
					},
					getLength: function() {
						return coll.length;
					},
                    getCollection: function(){
                        return coll;
                    }
				};
        if(rev){
            switchDirection();

        }
        return ret;
    };
		}(false));