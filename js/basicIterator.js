/*jslint browser: true*/
/*global window: false */
/*global _: false */
/*global gAlp: false */
   if (!window.gAlp) {
	window.gAlp = {};
}

gAlp.Iterator = (function(rev){
    //var count = 0;
    return function(index, coll, validate, doAdvance) {
			var loop = function(bool) {
					if (!bool) {
                        index = gAlp.Util.doWhen(validate, _.partial(doAdvance, index += 1));
					}
                        //document.getElementsByTagName('h2')[0].innerHTML = index;
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

gAlp.Composite = (function(){
    
    function noOp(){}
    
    return function(included/*, intaface*/){
        
    var intafaces = _.rest(arguments),
        comp_intaface = gAlp.Intaface('Composite', ['add', 'remove', 'get', 'find']),
        leaf = {
        add: noOp,
        remove: noOp,
        get: noOp,
        find: noOp
    },
        composite, 
        tmp,
        comp_add = function(comp) {
          intafaces.unshift(comp);
        gAlp.Intaface.ensures.apply(gAlp.Intaface, intafaces);
		included.push(intafaces.shift(comp));
            //comp.parent = this;
	},
        comp_remove = function(comp) {
		included = _.filter(included, function(n_comp) {
			if (n_comp !== comp) {
				return n_comp;
			}
		});
	},
        comp_get = function(i){
            return !isNaN(i) ? included[i] : included;
        },
        comp_find = _.partial(gAlp.Util.find, included),
        doAdd = function(comp){
            try {
                comp_add(comp);
            }
            catch(e){
                //add base interface for leves
                comp_add(_.extend(leaf, comp));
            }
        };
        
        intafaces.unshift(comp_intaface);
        
        if(included && _.isArray(included)){
            composite = {
                add: doAdd,
                remove: comp_remove,
                get: comp_get,
                find: comp_find,
                included: included
            };
            if(included.length){
                //copy and empty included; establish contents conform to interface
                tmp = included.slice();
                included = [];
                _.each(tmp, function(comp){
                    doAdd(comp);
                });
            }
        }
        return composite || leaf;
    
    };//ret func
    
}());