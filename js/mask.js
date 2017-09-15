if (!window.gAlp) {
    window.gAlp = {};
    }
    
var resizeTimeout,
 handler = function(){
 resizeTimeout = null;
gAlp.masking.mask();
 };
    
function resizeThrottler(){
if(!resizeTimeout){
resizeTimeout = setTimeout("handler()", 66);
}
}

gAlp.masking = (function(doc, core, config, builder){

function preSuffix(str, splitter, append){
var tmp = str.split(splitter);
tmp[tmp.length-2] += append;
tmp.pop();
return tmp.join(splitter);
}

function getWidth(el){
if(el.getBoundingClientRect) {
var box = el.getBoundingClientRect();
return box.width || box.right - box.left;
}
else {
return el.clientWidth;
}
}

function setMargin(el){
var w = getWidth(el.parentNode.parentNode);
el.style.marginRight = w ? "-" + w + "px" : "-100%";
//css-101.org/negative-margin/
//btw: increasing the value (eg -120%) has no effect in ie6/7
el.style.marginRight = "-100%";
}

function getNextElement(node) {
            if (node && node.nodeType === 1) {
                return node;
            }
            if (node && node.nextSibling) {
                return getNextElement(node.nextSibling);
            }
            return null;
        }
        
        function getPNG(el){
//ie6 supports png8 which will be fine for the mask. this depends on css underscore hack to assign color (red) to ie6 only
var mask = el.currentStyle && el.currentStyle.color !== 'white' ? '_mask8.png' : '_mask.png';
return preSuffix(el.src, '.', mask);
}

 function getMask(el){
return preSuffix(el.src, '.', '_mask.png');
}

function mixIn(tgt, src){
for(var p in src){ tgt[p] = src[p]; }
}

function getSRC(img){
var config = {},
res = img.alt.split("_"),
src;
if(res[1]){
src = getMask(img);
config.alt = res[1];
this.alt = res[0];
}
else {
src = getPNG(img);
}
config.src = src;
return config;
}

function setDim(str, height){
var dim = height ? 'clientHeight' : 'clientWidth';
document.getElementsByTagName('h2')[0].innerHTML = config.getId(str)[dim];
}

function doMask(img){
return img.parentNode && img.parentNode.className === 'wild';
}

return {

config: {},

getSource: getSRC,

alt: '',

count: 2,

getConfig: function(){
return this.config;
},

init: function(maskee){
//init only runs twice
//once for original mask method and once for rewriten mask method
//after that its work is done
if(!doMask(maskee) || !this.count){ return; }
this.count--;

this.config = this.getSource(maskee);

if(this.alt){
return this.alt;
}
this.config.alt = 'this mask is for '+ maskee.src;
return maskee.cloneNode();
},

mask: function(maskee) {


/*init returns null when no action required
sets member.alt for retrieval later, signals a simple swapping operation
retuns a clone to append to doc*/
var mask = this.init(maskee);

if(!mask){
this.mask = function(maskee){
setDim('content');
}();
//this.mask(maskee);
return;
}


//tagBuilder.build depends on Function.call
if(typeof Function.call === 'undefined'){

this.mask = function(maskee){
setDim('content');

var mask = this.init(maskee),
conf = this.getConfig();
this.maskee = maskee || this.maskee;
this.maskee.parentNode.style.display = 'block';

	if(this.alt) {
	mixIn(maskee, conf);
	}
	else {
	mixIn(mask, conf);
	this.maskee.parentNode.appendChild(mask);
	maskee = maskee || this.maskee;
	setMargin(core.getNextElement(maskee.nextSibling));
	}
	}//new func
	
}

else {

this.mask = function(maskee){
setDim('content');
var mask = this.init(maskee);
this.maskee = maskee || this.maskee;

var conf = this.getConfig(),
that = this,
data = function(attrs){
            return {
            tag: 'img_1',
            attrs: attrs
            };
        };

maskee.onload = function (){
   that.maskee.parentNode.style.display = 'block'; 
}

if(this.alt){
mixIn(maskee, conf);
this.maskee.parentNode.style.display = 'block';
}
	else {
if(mask) { builder.build(data(conf), this.maskee); }
this.maskee.parentNode.style.display = 'block';
//display required BEFORE setMargin (in ie6)
setMargin(core.getNextElement(this.maskee.nextSibling));
}

};//new func
}
//gAlp.Core.addEvent(window, 'resize', resizeThrottler);
this.mask(maskee);
}
};
   		
})(document, gAlp.Core, gAlp.Config, gAlp.tagBuilder);
