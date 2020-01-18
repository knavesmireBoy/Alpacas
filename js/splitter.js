/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global gAlp: false */
/*global _: false */
if (!window.gAlp) {
	window.gAlp = {};
}
gAlp.Splitter = (function (gang) {
	"use strict";

	function existy(x) {
		return (x != null) ? x : null;
	}

	function modulo(n, i) {
		return i % n;
	}

	function getProp(p, o) {
		return o && o[p];
	}

	function curryLeft(fn) {
		var args = _.rest(arguments);
		if (args.length >= fn.length) {
			return fn.apply(null, args);
		} else {
			return function () {
				return curryLeft.apply(null, [fn].concat(args, _.toArray(arguments)));
			};
		}
	}
	var global_strong = /\|/g,
		link = /\[([\S]+)$/,
		getFont = function (size, face, n) {
			return (size * n) + 'px ' + face;
		},
		isTypeOf = function (typ, arg) {
			return typeof arg === typ;
		},
		getElement = function (arg) {
			if (arg && arg.parentNode) {
				return arg;
			}
			if (isTypeOf('string', arg)) {
				return document.getElementById(arg);
			}
			return null;
		},
		getTextWidth = function () {
			//https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/
			this.context = this.context || document.createElement("canvas").getContext("2d");
			this.context.font = this.font || this.context.font;
			var metric = this.context.measureText(this.remaining_text);
			//return Math.floor(metric.width);
			return Math.ceil(metric.width);
		},
		getEndIndex = function () {
			var max = getTextWidth.call(this),
				remChar = this.remaining_text.length,
				charWidth,
				char_per_line;
			if (this.line < max) {
				charWidth = max / remChar;
				char_per_line = this.line / charWidth;
				return Math.floor(char_per_line);
			}
			return 0;
		},
		hasIndex = function (i) {
			return i && i !== -1;
		},
		spaceOrStop = function (num, percent) {
			var string = this.remaining_text.slice(0, num),
				L = string.length,
				end = string.lastIndexOf('.') + 1; //ie 0 ie false
			if (!end || end < (L * percent)) {
				end = string.lastIndexOf(' ');
			}
			return end;
		},
		fixLink = function (expr, match) {
			//prevent splitting a two word link over two lines. return blank to saved text and add first word to remaining text
			this.remaining_text = '[' + match + this.remaining_text;
			return '';
		},
		getTargetWidth = function (arg) {
			var dim = 'clientWidth',
				el = getElement(arg),
				copy = el[dim] || window.innerWidth;
			return Math.ceil(copy);
		},
		hasLength = curryLeft(getProp, 'length'),
		isOdd = curryLeft(modulo, 2),
		orphan_tags = _.compose(isOdd, hasLength, existy),
		process = function (num) {
			//this.end = this.remaining_text.slice(0, num).lastIndexOf(' ');
			this.end = spaceOrStop.call(this, num, 1);
			if (!hasIndex(this.end)) {
				gang.push(this.remaining_text);
			} else {
				this.saved_text = this.remaining_text.substring(0, this.end);
				this.remaining_text = this.remaining_text.substring(this.end);
				if (orphan_tags(this.saved_text.match(global_strong))) {
					//complete the tag on current line
					this.saved_text += '|';
					//open tag on next line
					this.remaining_text = '|' + this.remaining_text;
				}
				if (hasIndex(this.saved_text.search(link))) {
					//note earlier browsers don't support a function as second arg
					this.saved_text = this.saved_text.replace(link, fixLink.bind(this));
				}
				gang.push(this.saved_text);
				process.call(this, getEndIndex.call(this));
			}
		},
		constr = function () {
			return {
				init: function (element, face, size) {
					gang = [];
					this.start = 0;
					this.end = 0;
					this.font = getFont(size, face, 1);
					this.remaining_text = element.innerText;
					this.line = getTargetWidth(element);
					process.call(this, getEndIndex.call(this));
					return this;
				},
				output: function (tag) {
					var open = '<' + tag + '>',
						close = '</' + tag + '>';
					return open + gang.join(close + open) + close;
				}
			};
		};
	return constr;
}([]));