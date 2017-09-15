if (!window.gAlp) {
	window.gAlp = {};
}


gAlp.Presenter = (function (core, conf, tagBuilder, gallery, slideshow) {
	"use strict";
	
function getSlides(){
return document.getElementById('swapping').getElementsByTagName('img');
}

	var config = core.create(conf),
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
		
		getElementNode = function(el){
		while(el && el.nodeType !== 1){
			el = el.parentNode;
			}
			return el;
		},
		getRoute = function (el) {
		el = getElementNode(el);
			if (el && el.nodeName === "IMG") {
				return 'swap';
			} else {
			return el && el.getAttribute('id');
			}
		},
		trueClick = function(tgt){
		tgt = getElementNode(tgt);
		if(tgt && tgt.nodeName && (tgt.nodeName === 'BUTTON' || tgt.nodeName === 'IMG')){
		return tgt;
		}
		return null;
		},
		getPageX = function(e){
		if(e.pageX) { return e.pageX; }
		return e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		},
		forward = core.CommandFactory(gallery).getCommand(),
		reverse = core.CommandFactory(gallery).getCommand(),
		slide = {},
	
		presentor = {
			flag: false,
			init: function () {
				this.element = document.getElementsByTagName('body')[0];
				this.anchor = config.getContents('content');
				this.threshold = 750;
				this.classname = 'showtime';
				this.setView();
			
				//null will provide an empty array, as will [] of course
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
			
				var set,
                    unset,
                    dom,
                    play = "&#9658;",
                    pause = "&#10074;&#10074;",
                    command;

				if (!this.handler) {
					tagBuilder.build(config.getPlaceholder(), this.anchor);
					this.handler = config.getContents('place_holder');
				}
				if (!playButton.play) {
					set = core.fakeNodeMap({
						title: "start the slideshow"
					});
					unset = core.fakeNodeMap({
						title: "stop the slideshow"
					});
					
				}

				dom = this.getView(core.Conf(core.create(playButton)), config.getContents('slides').parentNode);
			
				command = core.CommandFactory(dom).getCommand();
				playButton.play = command.execute.call(command, 'updateElement', set, play);
				playButton.pause = command.undo.call(command, 'updateElement', unset, pause);
			},
			
			getView: function (Conf, anchor, attr) {
				var dom = core.create(gAlp.Element);
				core.augment(dom, core.create(core.createComponent()));
				anchor = anchor || config.getContents('slides');
				dom.fetchElement(Conf, anchor);
				if(attr) { dom.setAttributesBridge(attr); }
				return dom;
			},
						
			addView: function () {
			
				this.addChild(this.getView.apply(this, arguments));
				
				var slide = this.getChild(1),
				resume = this.getChild(2);
				playButton.play();//init on'load'
				if (resume) {
				resume.getElement().onload = playButton.play;
				} else if(slide){
				slide.getElement().onload = playButton.pause;
				}
			},
						
			setBase: function (img) {
				//http://stackoverflow.com/questions/27537677/is-javascript-array-index-a-string-or-an-integer
				this.getChild('0').setAttributesBridge(img);
				//alert(document.getElementById('swapping').innerHTML);
			},
			setSlide: function (img) {
				this.getChild(1).setAttributesBridge(img);
				this.On(this.element, 'playing');
			},
			clearView: function (flag) {
				flag = flag ? this.getChild(2) : null;
				this.Off(this.element, 'playing');
				this.removeChild(flag);
			},
			fadeView: function (options) {
				this.getChild(1).setStyle(options);
			},
			show: function (img) {
				if (!this.element) {
					this.init();
				}
				this.On(this.element, this.classname);
				if(!this.flag){
				this.bindEvents();
				}
				/*
				var that = this;
				setTimeout(function () {
					that.On(that.element, 'happy');
				}, 1);
				setTimeout(function () {
					that.Off(that.element, 'happy');
					that.On(that.element, 'happier');
				}, 1000);
				*/
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
			
				slide = core.CommandFactory(gAlp.SlideShow).getCommand();
			
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
					
					state = core.create(core.State),
					stopped = core.create(core.create(Base)),
					playing = core.create(stopped),
					paused = core.create(playing);
				try {
					stopped.method('setClickHandler', swap.execute('setClickHandler')); /*override base clickHandler*/
					stopped.method('swap', swap.execute('swap', forward.execute('forward'), reverse.execute('reverse'), this.threshold));
					stopped.method('play', slide.execute('play'));
					stopped.method('reload', reload.execute('hide').wrap(andExit));
					stopped.method('forward', forward.execute('forward'));
					stopped.method('reverse', reverse.execute('reverse'));
					
					playing.method('swap', slide.execute('pause'));
					playing.method('play', slide.execute('pause'));
					playing.method('forward', slide.execute('hide'));
					playing.method('reverse', slide.execute('hide'));
					
					paused.method('swap', slide.execute('resume'));
					paused.method('play', slide.execute('resume'));
				} catch (e) {
					window.alert(e+'_');
				}
				state.init();
				state.addState(stopped);
				state.addState(playing);
				state.addState(paused);
				//re-ASSIGN
				this.delegate = function (route, x) {
				var slides = getSlides();
				state.setState(slides.length);
				    try {

/*swap method expects a click location (x)
Have added dummy setClickHandler to Base so all states share the base interface, 
				state.route === command.execute();
				state.route() = command.object.method()
				OR >> state.route() = command.object.fire.visitSubscribers[type][i].object.method()
				*/

				        state.getState().setClickHandler(x);
				        state.execute(route);
				    } catch (e) {
					alert(e);                        
				    }
                }; //rewrite delegate
			this.delegate(route, x);
			}, //original delegate

			bindEvents: function () {
				var that = this;
					function handler(e) {
					var tgt, id;
					core.prevent(e);
					e = core.getEventObject(e);
					tgt = getElementNode(core.getEventTarget(e));
					tgt = trueClick(tgt);

						if (tgt) {
							id = getRoute(tgt);
 							that.delegate(id, getPageX(e));
						}
					}
					
				if (!this.flag) {
					core.addEvent(this.handler, 'click', handler);
					this.flag = true; //flag to prevent listener being added more than once
				}
			}

		};


	core.augment(presentor, core.create(core.createComponent({})));
	core.augment(presentor, core.create(gAlp.Element));
	return presentor;
}(gAlp.Core, gAlp.Config, gAlp.tagBuilder, gAlp.Gallery, gAlp.SlideShow));
