/*jslint browser: true*/
/*global window: false */
/*global _: false */
/*global gAlp: false */
if (!window.gAlp) {
	window.gAlp = {};
}
gAlp.Iterator = function(rev) {
	return function(index, coll, validate, doAdvance) {
		var loop = function(bool) {
				if (!bool) {
					index = gAlp.Util.doWhen(validate, _.partial(doAdvance, index += 1));
				}
				//document.getElementsByTagName('h2')[0].innerHTML = index;
				return index;
			},
			switchDirection = function() {
                //console.log('sw..')
                //console.log(coll[0].firstChild.href)
				coll = gAlp.Util.reverse(coll);
                //coll.reverse();
				index = coll.length - 1 - index;
                //console.log(coll[0].firstChild.href)
				rev = !rev;
			},
			isReversed = function() {
				return (rev === true);
			},
			getnext = function(isRev, bool) {
                //console.log('next..')
				gAlp.Util.doWhen(isRev(), switchDirection);
				return coll[loop(bool)];
			},
			getNow = function(bool) {
				return coll[loop(bool)];
			},
			forward = _.partial(getnext, isReversed),
			back = _.partial(getnext, _.negate(isReversed)),
			invoke = function(bool) {
                //console.log('invoke..')
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
				setIndex: function(i) {
					index = i;
				},
				getLength: function() {
					return coll.length;
				},
				getCollection: function() {
					return coll;
				}
			};
		if (rev) {
			switchDirection();
		}
		return ret;
	};
};

gAlp.Composite = (function() {
	function noOp() {}
	return function(included /*, intaface*/ ) {
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
            getOutcomes = function(key, i){
                var outcomes =  {
                   intg: included[i],
                    pos: included[0],
                    neg: included[included.length-1],
                    all: included
                };
                return outcomes[key];
            },
			comp_add = function(comp) {
				intafaces.unshift(comp);
				gAlp.Intaface.ensures.apply(gAlp.Intaface, intafaces);
				included.push(intafaces.shift(comp));
				//safeAdd(intafaces.shift(comp));
				comp.parent = this;
			},
			comp_remove = function(comp) {
                if(!comp){
                    included = [];
                }
                else {
				included = _.filter(included, function(n_comp) {
					if (n_comp !== comp) {
						return n_comp;
					}
				});
                    return comp;
			}
            },            
			comp_get = function(i) {
                //DON'T FORGET isNaN will cast a boolean to a number ONLY supplying undefined will return a NaN
                var str = i && _.isBoolean(i) ? 'pos' : !i && _.isBoolean(i) ? 'neg' : !isNaN(i) ? 'intg' : 'all',
                    ret = getOutcomes(str, i);
                return ret;
				//return !isNaN(i) ? included[i] : included;
			},
			comp_find = _.partial(gAlp.Util.find, included),
			doAdd = function(comp) {
				try {
					comp_add.call(composite, comp);
				} catch (e) {
					comp_add(_.extend(leaf, comp));
				}
			},
            render = function(){
               var args = arguments;
			_.each(included, function(member) {
				member.render && member.render.apply(member, args);
			}); 
            },
            unrender = function(){
               var args = arguments;
			_.each(included, function(member) {
				member.unrender && member.unrender.apply(member, args);
			}); 
            };
		intafaces.unshift(comp_intaface);
		if (included && _.isArray(included)) {
			composite = {
				add: doAdd,
				remove: comp_remove,
				get: comp_get,
				find: comp_find,
				included: included,
				render: render,
				unrender: unrender
			};
			if (included.length) {
				//copy and empty included; establish contents conform to interface
				tmp = included.slice();
				included = [];
				_.each(tmp, function(comp) {
					doAdd(comp);
				});
			}
		}
		return composite || leaf;
	}; //ret func
}());