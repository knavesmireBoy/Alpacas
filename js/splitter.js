/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global gAlp: false */
if (!window.gAlp) {
	window.gAlp = {};
}
gAlp.Splitter = (function (gang) {
	"use strict";
	var getFont = function (size, face, n) {
			return (size * n) + 'px ' + face;
		},
		getElement = function (arg) {
			if (arg && arg.parentNode) {
				return arg;
			}
			if (typeof arg === 'string') {
				return document.getElementById(arg);
			}
			return null;
		},
		getTextWidthBridge = function (textMetrics, fn) {
			//https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics
			fn = fn || 'ceil';
			var sum = Math.abs(textMetrics.actualBoundingBoxLeft) + Math.abs(textMetrics.actualBoundingBoxRight);
			sum = sum || textMetrics.width;//issue with actualBoundingBoxRight ipod
			return Math[fn](sum);
		},
		getTargetWidth = function (arg, fn) {
			var el = getElement(arg),
				copy = el.clientWidth || window.innerWidth;
			fn = fn || 'ceil';
			return Math[fn](copy);
		},
		getBreakPoint = function (str, limit) {
			var end = str.slice(0, limit);
			return Math.max(end.lastIndexOf('.'), end.lastIndexOf(' '));
		},
		orphanFactory = function (char, reg) {
			return {
				char: char,
				reg: reg,
				isOrphaned: function (str) {
					var i = str.indexOf(this.char);
					return i > -1 && (i === str.lastIndexOf(this.char));
				},
				lineEnd: function (str) {
					return str + this.char;
				},
				lineStart: function (str) {
					return this.char + str;
				}
			};
		},
		constr = function () {
			var pipe = orphanFactory('|'),
				hyper = orphanFactory('[', /\[\S+$/),
                getCharPerLine = function (l, w, remChar) {
					var charWidth = l / remChar;
					if (w < l) {
						return Math.floor(w / charWidth);
					}
					return Math.floor(remChar);
				};
			hyper.isOrphaned = function (str) {
				return str.search(this.reg) !== -1;
			};
			hyper.lineEnd = function (str) {
				return str.replace(this.reg, '');
			};
			hyper.lineStart = function (orphan, str) {
				return orphan.match(this.reg)[0] + str;
			};
                
			return {
				init: function (element, face, size) {
					gang = [];
					this.remaining_text = element.innerText;
					//https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/
					this.context = document.createElement("canvas").getContext("2d");
					this.context.font = getFont(size, face, 1);
					var total_width = getTextWidthBridge(this.context.measureText(this.remaining_text), 'floor'),
                        element_width = getTargetWidth(element),
                        char_per_line = getCharPerLine(total_width, element_width, this.remaining_text.length);
                    
					this.process(char_per_line);
					return this;
				},
				output: function (tag) {
					var open = '<' + tag + '>',
						close = '</' + tag + '>';
					return open + gang.join(close + open) + close;
				},
				
				process: function (char_per_line) {
					var end = getBreakPoint(this.remaining_text.slice(0, char_per_line)),
                        saved_text;
					if (this.remaining_text.length <= char_per_line) {
						gang.push(this.remaining_text);
						return;
					} else {
						saved_text = this.remaining_text.slice(0, end);
						this.remaining_text = this.remaining_text.slice(end);
						if (pipe.isOrphaned(this.remaining_text)) {
							//complete the tag on current line
							saved_text = pipe.lineEnd(saved_text);
							//open tag on next line
							this.remaining_text = pipe.lineStart(saved_text);
						}
						if (hyper.isOrphaned(saved_text)) {
							this.remaining_text = hyper.lineStart(saved_text, this.remaining_text);
							saved_text = hyper.lineEnd(saved_text);
						}
                        saved_text +='&nbsp;';
						gang.push(saved_text);
						this.process(char_per_line);
					}
				},
				getGang: function () {
					return gang;
				}
			};
		};
	return constr;
}([]));