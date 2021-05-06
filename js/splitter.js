/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global gAlp: false */
if (!window.gAlp) {
	window.gAlp = {};
}
gAlp.Splitter = (function(gang) {
	"use strict";
    
	var getFont = function(size, face, n) {
			return (size * n) + 'px ' + face;
		},
		getElement = function(arg) {
			if (arg && arg.parentNode) {
				return arg;
			}
			if (typeof arg === 'string') {
				return document.getElementById(arg);
			}
			return null;
		},
		getTextWidthBridge = function(textMetrics, fn) {
			//https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics
			fn = fn || 'ceil';
			var sum = Math.abs(textMetrics.actualBoundingBoxLeft) + Math.abs(textMetrics.actualBoundingBoxRight);
			//sum = textMetrics.width;
			return Math[fn](sum);
		},
		getTargetWidth = function(arg, fn) {
			var el = getElement(arg),
				copy = el.clientWidth || window.innerWidth;
			fn = fn || 'ceil';
			return Math[fn](copy);
		},
		getBreakPoint = function(str, limit) {
			var end = str.slice(0, limit);
			return Math.max(end.lastIndexOf('.'), end.lastIndexOf(' '));
		},
        orphanFactory = function(char, reg){
            return {
                char: char,
                reg: reg,
                isOrphaned: function(str){
                    var i = str.indexOf(this.char);
                    return i > -1 && (i === str.lastIndexOf(this.char));
                },
                lineEnd: function(str){
                    return str += this.char;
                },
                
                lineStart: function(str){
                    return this.char + str;
                }
            }
            
        },
		constr = function() {
			return {
				init: function(element, face, size) {
					gang = [];
					this.start = 0;
					this.end = 0;
					this.font = getFont(size, face, 1);
					this.remaining_text = element.innerText;
					this.width = getTargetWidth(element);
					this.char_per_line = this.getCharPerLine();
					this.process();
					return this;
				},
				output: function(tag) {
					var open = '<' + tag + '>',
						close = '</' + tag + '>';
					return open + gang.join(close + open) + close;
				},
				getTextWidth: function() {
					//https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/
					this.context = this.context || document.createElement("canvas").getContext("2d");
					this.context.font = this.font || this.context.font;
					return getTextWidthBridge(this.context.measureText(this.remaining_text), 'floor');
				},
				getCharPerLine: function() {
					var line = this.getTextWidth(),
						remChar = this.remaining_text.length,
						charWidth;
					if (this.width < line) {
						charWidth = line / remChar;
						return Math.floor(this.width / charWidth);
					}
					return 0;
				},
				process: function() {
					this.end = getBreakPoint(this.remaining_text.slice(0, this.char_per_line));
                    var pipe = orphanFactory('|'),
                        hyper = orphanFactory('[', /\[\S+$/);
                    
                    hyper.isOrphaned = function(str){
                        return str.search(this.reg) !== -1;
                    };
                    
                    hyper.lineEnd = function(str){
                        return str.replace(this.reg, '');
                    };
                    
                    hyper.lineStart = function(orphan, str){
                        return orphan.match(this.reg)[0] + str;
                    };
					if (this.remaining_text.length <= this.char_per_line) {
						gang.push(this.remaining_text);
						return;
					} else {
						this.saved_text = this.remaining_text.slice(0, this.end);
						this.remaining_text = this.remaining_text.slice(this.end);
                                                
						if (pipe.isOrphaned(this.remaining_text)) {
							//complete the tag on current line
							this.saved_text = pipe.lineEnd(this.saved_text);
							//open tag on next line
							this.remaining_text = pipe.lineStart(this.saved_text);
						}
						if (hyper.isOrphaned(this.saved_text)) {
                            this.remaining_text = hyper.lineStart(this.saved_text, this.remaining_text);
                            this.saved_text = hyper.lineEnd(this.saved_text);
						}
						gang.push(this.saved_text);
						this.process();
					}
				},
				getGang: function() {
					return gang;
				}
			};
		};
	return constr;
}([]));