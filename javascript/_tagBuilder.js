/*jslint browser: true*/
/*global $, jQuery, _, alert*/
if (!window.gAlp) {
    window.gAlp = {};
}

window.gAlp.tagBuilder = (function () {
    "use strict";

    function isSibling(tag) {
        return tag.split("_");
    }

    function makeTag(open, tag, close) {
        return open + tag + close || "";
    }

    function makeJQ(arg) {
        if (arg instanceof jQuery) {
            return arg;
        }
        return $(arg);
    }

    function flush(collection) {
        var i = 0,
            c = collection,
            L = c.length;
        for (i; i < L; i++) {
            if (i) {
                c[0] = c[0].wrap(c[i]);//decorating
            }
        }
        c.splice(1);
        return c[0]();
    }

    return {

        build: function (data, $anchor) {
            
            this.$anchor = makeJQ($anchor);

            var that = this,
                gang,
                prop,
                arg,
                method,
                anchor = function (sibling) {
                    if (sibling) {
                        return that.$anchor.parent();
                    }
                    return that.$anchor;
                },

                process = {
                    tag: function (tag) {
                        return function (fn) {
                            /*see config.contents.placeholder.children
                            We need to determine whether to append to current or parent tag, "_sibling" added to config: tag to indicate status. String.split returns an array at "_", if array has length of 2 we are dealing with a sibling tag and must reset current anchor to common parent*/
                            var tg = isSibling(tag);//anchor function will be called to determine the dom element to anchor to
                            return $(makeTag("<", tg[0], "/>")).appendTo(fn(tg[1]));//tg[1] will be a string or undefined
                        };
                    },
                    attrs: function (attrs) {
                        return function (fn) {
                            return fn().attr(attrs);
                        };
                    },
                    content: function (content) {
                        var that = this;
                        return function (fn) {
                            return fn().html(content);
                        };
                    },
                    children: function (kids) {
                        var i = 0;
                        that.$anchor = flush(gang);
                        while (kids[i]) {
                            that.build(kids[i], that.$anchor);
                            i++;
                        }
                    }
                };

            gang = [anchor];

            for (prop in data) {
              if (data.hasOwnProperty(prop) || Object.getPrototypeOf(data).hasOwnProperty(prop)) {
                    method = process[prop].bind(this);
                    arg = data[prop];
                    gang.push(method(arg));
               }
            }
            //elements with no children 
            if (gang[1]) {
                flush(gang);
            }

        }
    };
}());