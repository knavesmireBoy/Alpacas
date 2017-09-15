var gAlp = gAlp || {};

gAlp.Core = {


    Id: function(id) {
        if (typeof id !== 'string') return null;
        return document.getElementById(id);
    },
    Tag: function(tag) {
        return document.getElementsByTagName(tag);
    },
    El: function(id) {
        if (typeof id !== 'string') return id;
        return this.Id(id);
    },
    /**
     * @return {null}
     */
    Tags: function(id, tag) {
        var id = id ? id : document,
            id = id === document ? id : (typeof id === 'string') ? this.Id(id) : id;
        if(!tag && id === document) return null;
        if (id && tag) {
            return id.getElementsByTagName(tag);
        }
        return id;
    },


    extend: function (parent, child) {//rename
        var i, child = child || {};
        for (i in parent) {
            if (parent.hasOwnProperty(i)) {
                child[i] = parent[i];
            }
        }
        return child;
    },

    //http://yehudakatz.com/2011/08/12/understanding-prototypes-in-javascript/
    fromPrototype: function(prototype, object) {
        var newObject = Object.create(prototype),
            p, o = object || {};
        for (p in o) {
            if (o.hasOwnProperty(p)) { //important
                if (typeof o[p] === 'object') { //with amend
                    gAlp.Core.fromPrototype(prototype, o[p])
                }
                newObject[p] = object[p];
            }
        }
        return newObject;
    },
    isHTMLCollection: function(arg) {
        var astr = '[object HTMLCollection]',
            obj = Object.prototype.toString,
            p;
        return obj.call(arg) === astr;
    },
    isObject: function(arg) {
        var astr = '[object Object]',
            obj = Object.prototype.toString,
            p;
        return obj.call(arg) === astr;
    },

};


gAlp.Core = gAlp.Core.extend(gAlp.Core, (function() {
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



gAlp.Iterator = {
    make: function(data) {
        if (!data) return null;
        var core = gAlp.Core,
            slice = Array.prototype.slice,
            type = sortData.call(this, data),
            i = 0,
        //global
            types = {
                isArray: {
                    init: function(data) {
                        this.data = data;
                    }
                },
                isSliced: {
                    init: function(data) {
                        this.data = slice.call(data);
                    }
                },
                isObject: {
                    //would need to re-run should data be modified!!
                    init: function(data) {
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
                    getNext: function() {
                        var el = this.data[this.keys[i]];
                        i++;
                        return el;
                    },
                    getLast: function() {
                        return this.data[this.keys[i - 1]];
                    },
                    getCurrent: function() {
                        return this.data[this.keys[i]];
                    },
                    hasNext: function() {
                        return i < this.keys.length;
                    },
                    toString: function() {
                        if (core.isArray(this.getCurrent())) return this.getKey();
                        else return this.data.toString();
                    },
                    getKey: function() {
                        return this.keys[i];
                    },
                    getType: function() {
                        return 'object';
                    },
                    addItem: function(v, n) {
                        this.data[n] = v;
                        //http://stackoverflow.com/questions/280713/elements-order-in-a-for-in-loop
                        this.init(this.data); //re-run
                    },//fix

                    removeItem: function(child) {
                        delete this.data[child.getElement().id];
                    },
                    getItem: function(id) {
                        if (typeof id !== 'string') return null;
                        return this.getData(id);
                    },
                    getData: function(arg) {
                        if (arg) return this.data[arg];
                        return this.data;
                    },
                    getLength: function() {
                        return this.keys.length;
                    }
                },
                //object
                isArgument: {
                    init: function(data) {
                        this.data = slice.call(data);
                    }
                },

                isSelect: {
                    init: function(data) {
                        var defaultText = data.options && data.options[0].text,
                            mydata = {},
                            p, I = data.length,
                            setDefaultText = function(arg) {
                                if (arg) data.options[0].text = arg; //jquery?
                                else data.options[0].text = defaultText; //closure
                            };
                        while (i < I) {
                            var current = data[i],
                                cat = getCategory(current.parentNode, 'label');
                            if(!mydata[cat]) {
                                mydata[cat] = {};
                                mydata[cat][current.value] = current;
                            }
                            else {
                                mydata[cat][current.value] = current;
                            }
                            //mydata.push(el);
                            i++;
                        }
                        this.reWind();
                        this.setDefaultText = setDefaultText;
                        this.data = mydata;
                    },

                }

            },//types,
        //subclasses
            superClass = {
                configure: function() {
                    this.init(data);
                },

                pass: true,

                hasNext: function() {
                    return i < this.data.length;
                },
                getNext: function() {
                    var el = this.data[i];
                    i++;
                    return el;
                },
                getLast: function() {
                    return this.data[i - 1];
                },
                getCurrent: function() {
                    return this.data[i];
                },
                reWind: function() {
                    i = 0;
                },
                isLast: function() {
                    return i === this.data.length; //?
                },
                getIndex: function() {
                    return i;
                },
                getKey: function() {
                    return null;
                },
                getData: function(arg) {
                    if (arg || arg === 0) return this.data[arg];
                    return this.data;
                },
                addItem: function(arg) {
                    this.data[this.data.length] = arg;
                },

                removeItem: function(arg){
                    var current, inx;
                    this.reWind();
                    while(this.hasNext()){
                        inx = this.getIndex();
                        current = this.getNext();
                        if(current === arg) {
                            this.data.splice(inx, 1);
                            break;
                        }
                    }
                },

                getItem: function(i) {
                    if (typeof i !== 'number') return null;
                    return this.getData(i);
                },
                getType: function() {
                    return 'array';
                },
                getLength: function() {
                    return this.data.length;
                },
                reSet: function() { //tester
                    this.pass = true;
                    this.reWind();
                },
                isPassed: function(){
                    return this.pass;
                },
                accept: function(visitor) {
                    return visitor.visit(this);
                },
                indexOf: function(arg){
                    return this.getCurrent() === arg;
                }
            },
        //super
            subclass = types[type],
            Constr, key; //vars

        //factory
        function sortData(data) { //hoisteds, ADD classname lists? ADD className ?
            if (data.options !== undefined) {
                return 'isSelect';
            } else if (core.isArray(data)) {
                return 'isArray';
            } else if (core.isHTMLCollection(data)) {
                return 'isSliced';
            } else if (core.isObject(data)) {
                return 'isObject';
            } else if (typeof data.length !== 'undefined') {
                return 'isArgument';
            } else return null;
        };
        if (!subclass) return null;
        // Constr = core.clone(superClass);
        Constr = core.fromPrototype(superClass);
        for (key in subclass) {
            Constr[key] = subclass[key];
        }
        Constr.configure();
        return Constr;
    }
};



gAlp.grab = function(){
var i = gAlp.Core.Tags('sell', 'a'),
    x = gAlp.Iterator.make(i),
    t = gAlp.Core.Tags('thumbnails');
    function doit(a, b){
       console.log(a===b);
    }
    while(x.hasNext()){
        var el = x.getNext().parentNode;
        t.appendChild(el);

    }

}


window.onload = function() {gAlp.grab(); }
