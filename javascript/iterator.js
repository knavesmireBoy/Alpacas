gAlp.Iterator = {
    //factory
    make: function (data) {
        if (!data) return null;
        var core = gAlp.Core,
            slice = Array.prototype.slice,
            obj = '[object Object]',
            htm = '[object HTMLCollection]',
            ary = '[object Array]',
            object = Object.prototype.toString,
            isType = function (str, arg) {
                if (!arg) return false;
                return object.call(arg) === str;
            },
            i = 0,

            type = sortData.call(this, data),

        //global
            types = {
                isArray: {
                    init: function (data) {
                        this.data = data;
                    }
                },
                isSliced: {
                    init: function (data) {
                        this.data = slice.call(data);
                    }
                },
                isObject: {
                    //would need to re-run should data be modified!!
                    init: function (data) {
                        var keys = [],
                            key;
                        this.reWind();
                        for (key in data) {
                            if (data.hasOwnProperty(key)) {
                                keys.push(key); //store key, use key with data
                            }
                        }
                        this.data = data;
                        this.keys = keys;
                    },
                    getNext: function () {
                        var el = this.data[this.keys[i]];
                        i++;
                        return el;
                    },
                    getLast: function () {
                        return this.data[this.keys[i - 1]];
                    },
                    getCurrent: function () {
                        return this.data[this.keys[i]];
                    },
                    hasNext: function () {
                        return i < this.keys.length;
                    },

                    getKey: function () {
                        return this.keys[i];
                    },
                    getType: function () {
                        return 'object';
                    },
                    addItem: function (v, n) {
                        this.data[n] = v;
                        //http://stackoverflow.com/questions/280713/elements-order-in-a-for-in-loop
                        this.init(this.data); //re-run
                    },//fix

                    removeItem: function (child) {
                        delete this.data[child.getElement().id];
                    },
                    getItem: function (id) {
                        if (typeof id !== 'string') return null;
                        return this.getData(id);
                    },

                    getLength: function () {
                        return this.keys.length;
                    }
                },
                //object
                isArgument: {
                    init: function (data) {
                        this.data = slice.call(data);
                    }
                }

            },//types,
        //subclasses
            superClass = {
                configure: function () {
                    this.init(data);
                },

                hasNext: function () {
                    return i < this.data.length;
                },
                getNext: function () {
                    var el = this.data[i];
                    i++;
                    return el;
                },
                getLast: function () {
                    return this.data[i - 1];
                },
                getCurrent: function () {
                    return this.data[i];
                },
                reWind: function () {
                    i = 0;
                },
                isLast: function () {
                    return i === this.data.length; //?
                },
                getIndex: function () {
                    return i;
                },
                getKey: function () {
                    return null;
                },

                addItem: function (arg) {
                    this.data[this.data.length] = arg;
                },

                removeItem: function (arg) {
                    var current, inx;
                    this.reWind();
                    while (this.hasNext()) {
                        inx = this.getIndex();
                        current = this.getNext();
                        if (current === arg) {
                            this.data.splice(inx, 1);
                            break;
                        }
                    }
                },
                getItem: function (i) {
                    if (typeof i !== 'number') return null;
                    return this.getData(i);
                },
                getLength: function () {
                    return this.data.length;
                },
                accept: function (visitor) {
                    return visitor.visit(this);
                },
                indexOf: function (arg) {
                    return this.getCurrent() === arg;
                },
                getData: function (i) {
                    return this.data[i];
                }
            },
        //super
            subclass = types[type],
            Constr, key;


        //factory
        function sortData(data) { //hoisteds, ADD classname lists? ADD className ?
            if (isType(ary, data)) {
                return 'isArray';
            } else if (isType(htm, data)) {
                return 'isSliced';
            } else if (isType(obj, data)) {
                return 'isObject';
            } else if (typeof data.length !== 'undefined') {
                return 'isArgument';
            } else return null;
        };
        if (!subclass) return null;
        Constr = core.fromPrototype(superClass);
        for (key in subclass) {
            Constr[key] = subclass[key];
        }
        Constr.configure();
        return Constr;
    }
};//gAlp iterator


