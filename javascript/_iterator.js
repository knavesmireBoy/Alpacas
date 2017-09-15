
if (!window.gAlp) {
    window.gAlp = {};
}

gAlp.Iterator = (function($, _, window, doc, core) {

            var slice = Array.prototype.slice,
                obj = '[object Object]',
                htm = '[object HTMLCollection]',
                ary = '[object Array]',
                ndL = '[object NodeList]',
                object = Object.prototype.toString,
                isType = function(str, arg) {
                    if (!arg) return false;
                    return object.call(arg) === str;
                },
                augment = function(aug) {
                    for (var p in aug) {
                        this[p] = aug[p];
                    }
                },
                configure = function() {
                    this.initialize();
                },
                sortData = function(data) { // ADD classname lists? ADD className ?
                    var i = 0,
                        o = {
                            isArray: isType(ary, data),
                            isSliced: isType(htm, data),
                            isNodeList: isType(ndL, data),
                            isArgument: _.isArguments(data), //UNDERSCORE
                            isObject: isType(obj, data),
                        };

                    for (i in o) {
                        if (o[i]) {
                            break;
                        } else {
                            i = null;
                        }
                    }
                    return i;
                };

            return function(data, options) {
                data = data || [];
                var index = options && options.rev ? data.length - 1 : 0,
                    keys = [],
                    type = sortData(data),
                
                    loop = {
                        hasNext: function() {
                            index = index % data.length;
                            return true;
                        },
                        hasPrevious: function() {
                            index = !index ? data.length : index;
                            return true;
                        }
                    },

                    rev = {
                        rewind: function() {
                            index = data.length - 1;
                        },
                        hasNext: function() {
                            return index >= 0;
                        },
                        getNext: function() {
                            if (!this.hasNext()) {
                                return null;
                            }
                            return data[index--];
                        },
                    },

                    augments = {
                        isObject: {
                            rev: {
                                getNext: function() {
                                    return data[keys[index--]];
                                },
                                rewind: function() {
                                    index = keys.length - 1;
                                }
                            }
                        }
                    },

                    init = function() {
                        if (options && options.loop) augment.call(this, loop);
                        if (options && options.rev) augment.call(this, rev);
                        if (options && options.rev && augments[type]) {
                            augment.call(this, augments[type].rev);
                        }
                    },

                    toArray = function() {
                        data = slice.call(data);
                        init.call(this);
                    },

                    //global
                    types = {
                        isArray: {
                            initialize: function() {
                                init.call(this);
                            },
                            toString: function() {
                                return "An Array";
                            }
                        },
                        isSliced: {
                            initialize: function() {
                                toArray.call(this);
                            },
                            toString: function() {
                                return "Slice Me";
                            }
                        },
                        isNodeList: {
                            initialize: function() {
                                toArray.call(this);
                            },
                            toString: function() {
                                return "Slice Me";
                            }
                        },

                        isArgument: {
                            initialize: function() {
                                toArray.call(this);
                            },

                            toString: function() {
                                return "Getting Mad baby";
                            }
                        },

                        //////////////////////////////////////////////////////////////////////////////////////////////////////

                        isObject: {
                            //would need to re-run should data be modified!!
                            initialize: function() {
                                var key;
                                for (key in data) {
                                    if (data.hasOwnProperty(key)) {
                                        keys.push(key); //store key, use key with data
                                    }
                                }
                                init.call(this);
                                this.rewind();
                            },

                            getData: function(i) {
                                if (typeof i !== "undefined") {
                                    if (typeof i !== "number") {
                                        return data[i];
                                    } else {
                                        return data[keys[i]];
                                    }
                                } else {
                                    return data;
                                }
                            },

                            getLength: function() {
                                return keys.length;
                            },

                            getKey: function() {
                                return keys[index]; //current key
                            },

                            getKeys: function(i) {
                                if (typeof i !== "undefined") {
                                    return keys[i];
                                }
                                return keys;
                            },

                            hasNext: function() {
                                return index < keys.length;
                            },

                            getCurrent: function() {
                                return data[keys[index]];
                            },

                            getNext: function() {
                                return data[keys[index++]];
                            },

                            getPrevious: function() {
                                return data[keys[index--]];
                            },

                            getLast: function() {
                                return data[keys[index - 1]];
                            },

                            //http://stackoverflow.com/questions/280713/elements-order-in-a-for-in-loop
                            addItem: function(el) { //default imp
                                data[el.id] = el;
                                keys.push(el.id);
                            },

                            removeItem: function(i) {
                                delete data[keys[i]];
                                keys.splice(i, L || 1);
                            },

                            indexOf: function(arg) {
                                return data[keys] === arg;
                            },

                            toString: function() {
                                return "Objectify";
                            }
                        }
                    }, //types,

                        /////////////////////subclasses////////////////////////////////////////////////////////////////////////////////

                        superClass = {

                            getData: function(i) {
                                if (i !== undefined) {
                                    return data[i];
                                }
                                return data;
                            },

                            getLength: function() {
                                return data.length;
                            },

                            getIndex: function() {
                                return index;
                            },

                            setIndex: function(indx) {
                                index = indx;
                            },

                            hasNext: function() {
                                return index < data.length;
                            },

                            hasPrevious: function() {
                                return index >= 0;
                            },

                            getCurrent: function() {
                                if (!this.hasNext()) {
                                    return null;
                                }
                                return data[index];
                            },

                            getNext: function() {
                                if (!this.hasNext()) {
                                    return null;
                                }
                                return data[index++];
                            },

                            getPrevious: function() {
                                if (!this.hasPrevious()) {
                                    return null;
                                }
                                return data[index--];
                            },

                            getLast: function() {
                                if (!loop.hasPrevious()) {
                                    return null;
                                }
                                return data[--index];
                            },

                            addItem: function(arg) {
                                this.rewind();
                                data = data.filter(function(item) {
                                    return item !== arg;
                                });
                                data.push(arg); //what if order matters
                            },

                            removeItem: function(i, L) {
                                data.splice(i || 0, L || 1);
                            },

                            indexOf: function(arg) {
                                if (arg) return this.getCurrent() === arg;
                                return false; //allows find to deal with ALL items
                            },

                            rewind: function() {
                                index = 0;
                            },

                            //http://stackoverflow.com/questions/16217333/remove-items-from-array-with-splice-in-for-loop 
                            find: function(arg) {
                                this.rewind();
                                if (arg) {
                                    while (this.hasNext()) {
                                        if (this.indexOf(arg)) {
                                            break;
                                        }
                                        this.getNext();
                                    }
                                }
                                return index;
                            },
                            
                            empty: function(arg) {
                                 this.rewind();
                                if (arg != null){
                                    this.removeItem(arg);
                                }
                                else {
                                       while (this.hasNext()) {
                                        this.removeItem(index);
                                        this.getNext();
                                    }
                                }
                            },

                            accept: function(visitor) {
                                return visitor.visit(this);
                            },

                            dummy: 'no comma required'

                        },
                        //super
                        subclass = types[type],
                        Constr,
                        key;
                        //factory
                        if (!subclass) return null;
                        Constr = core.fromPrototype(superClass, subclass);
                        configure.call(Constr);
                        return Constr;
                    }; //outer init

            }({} /*jQuery*/ , _, window, document, window.gAlp.Core)); //gAlp iterator