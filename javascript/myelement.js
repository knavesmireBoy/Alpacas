
gAlp.$$ = (function(){

    var core = gAlp.Core,
        show = 'show',
        hide = 'hide',
        _append = false,

        Inter = core.Interface,


        hasClass = function(klas) {/*bool*/
            var pattern = new RegExp('(^| )' + klas + '( |$)'), el = this.element;
            return !!pattern.test(el.className);
        };

    return {

        init: function(el, parent) {
            if (typeof el === 'string') {
                this.element = document.getElementById(el);
                this.element = this.element ? this.element : document.createElement(el), this.frag = true;
            } else {
                this.element = el;
            }
            try {
                parent.append(this);
                this.frag = false;
            }
            catch(e) {
                try {
                    parent.appendChild(this.element);
                    this.frag = false;
                }
                catch (e) {
                }
            }
            return this;
        },

        frag: false,


        isFragment: function(){
            return this.frag;
        },

        addEvent: function(type, fn) {
            var add = function(el) {
                if (window.addEventListener) {
                    el.addEventListener(type, fn, false);
                }
                else if (window.attachEvent) {
                    el.attachEvent('on'+type, fn);
                }
            };
            add(this.element);
            return this;
        },

        classed: function(arg){
            return hasClass.call(this, arg);
        },

        show: function () {
            this.element.className = show;
            return this;
        },
        hide: function () {
            this.element.className = hide;
            return this;
        },
        shout: function(arg){
            console.log(arg);
            return this;
        },
        setAttr: function (attr, txt) {
            this.element[attr] = txt;
            return this;
        },
        setText: function (txt) {
            var el = this.elements[this._i];
            while (el && el.firstChild) {
                el = el.firstChild.nodeType === 1 ? el.firstChild : el;
            }
            el.appendChild(txt);
            return this;
        },
        setAttrs: function (conf) {
            for (var p in conf) {
                this.setAttr(p, conf[p])
            }
            return this;
        },

        loop: function(fn, iterator){
            var elInterface = new Inter('Iterator', ['hasNext', 'getNext']),
                fn = typeof fn === 'function' ? fn.bind(this) : this[fn].bind(this);
            Inter.ensureImplements(iterator, elInterface);

            while(iterator.hasNext()){
                fn(iterator.getNext().getElement());
            }
            iterator.reWind();

            return this;

        },

        retrieve: function(){},

        append: function(el, bool){
            var el = el.element ? el.element : el;
            if(!bool) {this.element.appendChild(el);}
            else{ el.appendChild(this.element)}
            return this;
        },

        accept: function(visitor) {
            visitor.visit(this.element);
            return this;
        },

        addClass: function(klas) {
            var el = this.element,
                str = el.className,
                concat = function(a, b){
                    return a + ' ' + b;
                };
            if (!hasClass.call(this, klas)) {
                el.className = str === '' ? klas : concat(str, klas);
            }
            return this;
        },

        removeClass: function(ele, cls) {
            if (hasClass.call(this, ele, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                ele.className = ele.className.replace(reg, ' ');
            }
        },

        insertAfter: function(newElement,targetElement) {
            var parent = targetElement.parentNode;
            if (parent.lastChild == targetElement) {
                parent.appendChild(newElement);
            } else {
                parent.insertBefore(newElement,targetElement.nextSibling);
            }
            return this;
        },

        each: function (fn) {
            var i = 0,
                els = this.elements,
                n = els.length;
            for (; i < n; i++) {
                fn.call(this, els[i]);
            }
            return this;
        },
        //don't chain
        getElement: function () {
            return this.element;
        },
        getParent: function(){
            return this.element.parentNode;
        },
        getNextElement: function(node) {
            //console.log(arguments.callee.caller.toString())
            if (node.nodeType === 1) {
                return node;
            }
            if (node.nextSibling) {
                return this.getNextElement(node.nextSibling);
            }
            return null;
        },
    };

})();
