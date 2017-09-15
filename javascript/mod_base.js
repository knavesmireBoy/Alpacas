//[^v\s]*var\s+([^;]+);

//[^v\s]*var\s+([^;]+);


;(function(window, document, undefined){
  var classes = []; var docElement = document.documentElement; var isSVG = docElement.nodeName.toLowerCase() === 'svg'; var tests = [];
 
  var ModernizrProto = {
    _version: '3.5.0',

    _config: {
      'classPrefix': '',
      'enableClasses': true,
      'enableJSClass': true,
      'usePrefixes': true
    },

    _q: [],

    on: function(test, cb) {

      var self = this;
      setTimeout(function() {
        cb(self[test]);
      }, 0);
    },

    addTest: function(name, fn, options) {
      tests.push({name: name, fn: fn, options: options});
    },

    addAsyncTest: function(fn) {
      tests.push({name: null, fn: fn});
    }
  };
    
  var Modernizr = function() {};
  Modernizr.prototype = ModernizrProto;

  Modernizr = new Modernizr();

  function setClasses(classes) {
    var className = docElement.className;
    var classPrefix = Modernizr._config.classPrefix || '';

    if (isSVG) {
      className = className.baseVal;
    }

    if (Modernizr._config.enableJSClass) {
      var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
      className = className.replace(reJS, '$1' + classPrefix + 'js$2');
    }

    if (Modernizr._config.enableClasses) {
      className += ' ' + classPrefix + classes.join(' ' + classPrefix);
      if (isSVG) {
        docElement.className.baseVal = className;
      } else {
        docElement.className = className;
      }
    }

  }

  function is(obj, type) {
    return typeof obj === type;
  }

  function testRunner() {
    var featureNames;
    var feature;
    var aliasIdx;
    var result;
    var nameIdx;
    var featureName;
    var featureNameSplit;

    for (var featureIdx in tests) {
      if (tests.hasOwnProperty(featureIdx)) {
        featureNames = [];
        feature = tests[featureIdx];
        if (feature.name) {
          featureNames.push(feature.name.toLowerCase());

          if (feature.options && feature.options.aliases && feature.options.aliases.length) {
            for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
              featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
            }
          }
        }
        result = is(feature.fn, 'function') ? feature.fn() : feature.fn;

        for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
          featureName = featureNames[nameIdx];
       
          featureNameSplit = featureName.split('.');

          if (featureNameSplit.length === 1) {
            Modernizr[featureNameSplit[0]] = result;
          } else {
            // cast to a Boolean, if not one already
            if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
              Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
            }
            Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
          }

          classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
        }
      }
    }
  }
  testRunner();
  setClasses(classes);

  delete ModernizrProto.addTest;
  delete ModernizrProto.addAsyncTest;
  for (var i = 0; i < Modernizr._q.length; i++) {
    Modernizr._q[i]();
  }
  window.Modernizr = Modernizr;
    
    var a = 2, b = 3;
    
    alert(a ^ b);

})(window, document);
function bang(){
 var inter = "var classes = []; var docElement = document.documentElement; var isSVG = docElement.nodeName.toLowerCase() === 'svg'; var tests = [];".replace(/\s*[^v]*var\s+([^;]+);/g, '$1, ');
 //return inter.replace(/(.+),/, "var $1;");
return inter.replace(/([^,]+,)/, "var $1\n");

}
console.log(bang());

