if (!window.gAlp) {
	window.gAlp = {};
}
gAlp.Presenter = (function (core, conf, tagBuilder, gallery, slideshow) {
	"use strict";
	//returns document.getElementsByClassName on all but older browsers, BUT will this be a live collection???
	var slides = gAlp.Core.getElementsByClass('slides'),
		EventCache = (function () {
			var listEvents = [];
			return {
				listEvents: listEvents,
				add: function (node, sEventName, fHandler) {
					listEvents.push(arguments);
				},
				flush: function () {
					var i, item;
					for (i = listEvents.length - 1; i >= 0; i = i - 1) {
						item = listEvents[i];
						if (item[0].removeEventListener) {
							item[0].removeEventListener(item[1], item[2], item[3]);
						}
						if (item[1].substring(0, 2) !== "on") {
							item[1] = "on" + item[1];
						}
						if (item[0].detachEvent) {
							item[0].detachEvent(item[1], item[2]);
						}
						item[0][item[1]] = null;
					}
				}
			};
		}()),
		config = core.create(conf),
		forward = core.CommandFactory(gallery).getCommand(),
		reverse = core.CommandFactory(gallery).getCommand(),
		slide = core.CommandFactory(slideshow).getCommand(),
		Base = {
			setClickHandler: function () {},
			method: function (name, func) {
				this[name] = func;
			}
		},
		playButton = {
			tag: "button",
			attrs: {
				id: "play"
			}
		},
		getRoute = function (el) {
			if (el && el.nodeName === "IMG") {
				return 'swap';
			} else {
				return el && el.id;
			}
		},
		presentor = {
			flag: false,
			init: function () {
				//this.element = document.querySelector('body');
				this.element = document.getElementsByTagName('body')[0];
				this.anchor = config.getContents('content');
				this.threshold = 750;
				this.classname = 'showtime';
				this.setView();
				this.children = gAlp.Iterator(null, {
					loop: false,
					rev: true
				});
				this.children.removeItem = function (index) {
					this.getCurrent().removeElement();
					this.getData().splice(index, 1);
				};
			},
			setView: function () {
				var flag = config.getContents('place_holder'),
					set,
                    unset,
                    dom;
				if (!flag) {
					tagBuilder.build(config.getPlaceholder(), this.anchor);
					this.handler = config.getContents('place_holder');
				}
				if (!this.playbutton) {
					set = core.fakeNodeMap({
						title: "start the slideshow"
					});
					unset = core.fakeNodeMap({
						title: "stop the slideshow"
					});
					dom = this.getView(core.Conf(core.create(playButton)), config.getContents('slides').parentNode);
					this.playbutton = core.CommandFactory(dom);
					this.playbutton2 = core.CommandFactory(dom);
					this.playbutton.setCommand('setAttributes', set);
					this.playbutton2.setCommand('setContent', "&#9658;");
					this.playbutton.setUndo('setAttributes', unset);
					this.playbutton2.setUndo('setContent', "&#10074;&#10074;");
					this.playbutton.execute();
					this.playbutton2.execute();
				}
			},
			getView: function (Conf, anchor, atr) {
				var dom = core.create(gAlp.Element),
					attr = atr || null;
				core.augment(dom, core.create(core.createComponent())); //presenter
				anchor = anchor || config.getContents('slides');
				dom.fetchElement(Conf, anchor);
				dom.setAttributes(attr);
				return dom;
			},
			addView: function () {
				function getOp() {
                    var test = this.getChild(2), tgt;
					if (test) {
				        tgt = window.getComputedStyle(this.getChild(1).getElement(), null);
						return tgt.getPropertyValue('opacity') > 0.5;
					}
				}
				var undo = this.playbutton2.undo.bind(this.playbutton2),
					el;
				this.addChild(this.getView.apply(this, arguments));
				if (this.getChild().length % 2) {
					this.playbutton2.execute(); //either adding base pic or overlay
				} else {
					setTimeout(undo, 666);
				}
			},
			setBase: function (img) {
				//http://stackoverflow.com/questions/27537677/is-javascript-array-index-a-string-or-an-integer
				this.getChild('0').setAttributes(img);
			},
			setSlide: function (img) {
				this.getChild(1).setAttributes(img);
				this.On(this.element, 'playing');
				this.playbutton.undo();
			},
			clearView: function (flag) {
				flag = flag ? this.getChild(2) : null;
				this.Off(this.element, 'playing');
				this.removeChild(flag);
				this.playbutton.execute();
				this.playbutton2.undo();
			},
			fadeView: function (options) {
				this.getChild(1).setStyle(options);
			},
			show: function () {
				if (!this.element) {
					this.init();
				}
				this.On(this.element, this.classname);
				this.bindEvents();
				var that = this;
				setTimeout(function () {
					that.On(that.element, 'happy');
				}, 1);
				setTimeout(function () {
					that.Off(that.element, 'happy');
					that.On(that.element, 'happier');
				}, 1000);
			},
			hide: function () {
				this.Off(this.element, this.classname);
			},
			$: function (selector) {
				return this.anchor.querySelector(selector);
			},
			$$: function (selector) {
				return this.anchor.querySelectorAll(selector);
			},
			delegate: function (route, x) {
				var presenter = this,
					andExit = function (original) {
						presenter.fire('exit');
						original();
					},
					swapper = { //receiver
						swap: function (F, R, threshold) {
							var command = this.location && this.location > threshold ? F : R;
							command();
						},
						setClickHandler: function (click) {
							this.location = click; //this refers to swapper NOT base
						}
					},
					swap = core.CommandFactory(swapper).getCommand(),
					reload = core.CommandFactory(presenter).getCommand(),
					base = core.create(Base),
					state = core.create(core.State),
					stopped = core.create(base),
					playing = core.create(base),
					paused = core.create(playing);
				try {
					stopped.method('setClickHandler', swap.execute('setClickHandler')); /*override base clickHandler*/
					stopped.method('swap', swap.execute('swap', forward.execute('forward'), reverse.execute('reverse'), this.threshold));
					stopped.method('play', slide.execute('play'));
					//stopped.method('reload', reload.execute('hide'));
					stopped.method('reload', reload.execute('hide').wrap(andExit));
					stopped.method('forward', forward.execute('forward'));
					stopped.method('reverse', reverse.execute('reverse'));
					playing.method('swap', slide.execute('pause'));
					playing.method('play', slide.execute('pause'));
					playing.method('reload', reload.execute('hide').wrap(andExit));
					playing.method('forward', slide.execute('hide'));
					playing.method('reverse', slide.execute('hide'));
					paused.method('forward', slide.execute('hide'));
					paused.method('reverse', slide.execute('hide'));
					paused.method('swap', slide.execute('resume'));
					paused.method('play', slide.execute('resume'));
				} catch (e) {
					window.alert(e);
				}
				state.init();
				state.addState(stopped);
				state.addState(playing);
				state.addState(paused);
				this.delegate = function (route, x) {
						/* slides.length refers to the "LIVE" node list of getElementsByClassName('slides')
						which can be 1, 2 or 3, never 0, so null is used for first member of States.states array
						http://stackoverflow.com/questions/28163033/when-is-nodelist-live-and-when-is-it-static
						*/
				    state.setState(slides.length);
				    try {
							/*swap method expects a click location (x)
							Have added dummy setClickHandler to Base so all states share the base interface, 
							    state.route === command.execute();
							    state.route() = command.object.method()
							    OR>> state.route() = command.object.fire.visitSubscribers[type][i].object.method()
							    */
				        state.getState().setClickHandler(x);
				        state.execute(route);
				    } catch (e) {
							// for (var x in e)                         
				    }
                }; //rewrite delegate
				this.delegate(route, x);
			}, //original delegate
			bindEvents: function () {
                
                /*the MOUSEOVER/OUT handlers no longer in use, they were toggling the icon for PLAY/PAUSE
                keeping around for the mo*/
                
               // http://blogs.adobe.com/adobeandjquery/2011/03/07/the-current-state-of-touch-events/
                
				var presenter = this,
                    helper = function(){
                    var el = document.getElementById('placeholder');
                    //el1 = el.getElementsByTagName('a')[0];
                    return el.getElementsByTagName('img');
                    //return presenter.$$('#placeholder a img');
                    },
					el = helper(),
					L = el.length,
					listenUp = function (e) {
						this.setAttribute('class', 'slideshow_hover');
					},
					listenDown = function (e) {
						this.setAttribute('class', '');
					},
					handler = function (e) {
						e.preventDefault();
						if (e.target !== e.currentTarget) {
							//if click is not on backgound...
							var id = getRoute(e.target);
							presenter.delegate(id, e.pageX);
						}
					};
                         
				/* this to run AFTER elements have been added to the DOM
				 http://api.jquery.com/on/ */
				if (!this.flag) {
					core.addEvent(this.handler, 'click', handler);
					while (L--) {
						core.addEvent(el[L], 'mouseover', listenUp);
						core.addEvent(el[L], 'mouseout', listenDown);
					}
					this.flag = true; //flag to prevent listener being added more than once
				}
			}
		};


	core.augment(presentor, core.create(core.createComponent({})));
	core.augment(presentor, core.create(gAlp.Element));
	return presentor;
}(gAlp.Core, gAlp.Config, gAlp.tagBuilder, gAlp.Gallery, gAlp.SlideShow));