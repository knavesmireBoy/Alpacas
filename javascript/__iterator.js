NWP.Iterator = {
    make: function(data) {
        if (!data) return null;
        var core = NWP.Core,
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
                            mydata = [],
                            p, I = data.length,
                            Opt = function(conf) {
                                for (p in conf) {
                                    this[p] = conf[p];
                                }
                            },
                            getCategory = function(el, attr) {
                                if (el.nodeName === 'OPTGROUP') {
                                    return el[attr].toLowerCase();
                                }
                                return '';
                            },
                            setDefaultText = function(arg) {
                                if (arg) data.options[0].text = arg; //jquery?
                                else data.options[0].text = defaultText; //closure
                            };
                        while (i < I) {
                            var current = data[i],
                                cat = getCategory(current.parentNode, 'label'),
                                el = new Opt({
                                    index: i,
                                    value: current.value,
                                    category: cat
                                });
                            mydata.push(el);
                            i++;
                        }
						this.reWind();
                        this.setDefaultText = setDefaultText;
                        this.data = mydata;
                    },
                    //init, doozy, working too hard, make composite?
                    indexOf: function() {
                        var found = null,
                            opt, src = this.element;
                        this.reWind();
                        while (!found && this.hasNext()) {
                            opt = this.getNext();
                            if (src.selectedIndex === opt.index) {
                                found = opt;
                            }
                        } //while
                        return found;
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
            },
            //super
            subclass = types[type],
            Constr, key; //vars

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
       // Constr = core.create(superClass);
		Constr = core.fromPrototype(superClass);
        for (key in subclass) {
            Constr[key] = subclass[key];
        }
        Constr.configure();
        return Constr;
    }
};