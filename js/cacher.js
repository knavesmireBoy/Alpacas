/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global gAlp: false */
/*global _: false */
//https://stackoverflow.com/questions/2446740/post-loading-check-if-an-image-is-in-the-browser-cache

function curry(fun) {
	return function(last) {
		return function(mid) {
			return function(first){
                return fun(first, mid, last);
		};
	};
};
}

function logCache(source) {
    var store = window.localStorage;
	if (store.cachedElements.indexOf(source, 0) < 0) {
		if (store.cachedElements !== "") {
			store.cachedElements += ";";
		}
		store.cachedElements += source;
	}
}

function isCached(source) {
	return (window.localStorage.cachedElements.indexOf(source, 0) >= 0);
}

function doMatch(str, reg, i) {
	return isNaN(i) ? str.match(reg) : str.match(reg)[i];
}

function swap (els, filterCB, cb) {
    return _.each(_.filter(els, filterCB), cb);
}

gAlp.Cacher = function(path, lo, hi) {
    
    function getHiRes(el, p) {
        return el.getAttribute(p).replace(lo, hi);
        }
    
    function setHiRes(el, p) {
        el.setAttribute(p, getHiRes(el, p));
    }
    
    function doFilter(el, p, reg) {
        return doMatch(el[p], reg);
    }
    
    function doCache (img, i, grp) {
	var image = document.createElement('img');
        image.src = getHiRes(img, 'src');
        image.onload = function() {
            logCache(doMatch(this.src, path, 1));
            //setHiRes(grp[i], 'src');
            if (!grp[i + 1]) {
                //no need to filter at this point
                swap(grp, function() { return true; }, curry(setHiRes)(null)('src'));
            }
        };
    }
   
    var regex = new RegExp(lo),
        images = _.filter(document.images, curry(doFilter)(regex)('src')),
        filter = curry(doFilter)(regex),
        doCallback = curry(setHiRes)(null),
        doSwap = function(){
            swap(images, filter('src'), doCallback('src'));
        },
        img = images.length && images[images.length - 1],
            //check if last listed image is cached
			matched = img && doMatch(img.getAttribute('src'), path, 1);
    //swap hyperlinks from small to big
    swap(document.getElementsByTagName('a'), filter('href'), doCallback('href'));
    
     if(window.localStorage) {
         if(!window.localStorage.cachedElements) {
             window.localStorage.cachedElements = "";
         }
        if(!matched) return;
		if (isCached(matched)) {
			doSwap();
		} else {
			swap(images, filter('src'), doCache);
		}
     }
    else {
        doSwap();
    }
};