/*nomen: true*/
if (!window.gAlp) {
    window.gAlp = {};
}

(function(core){
    
    var tabs = function(){
        
     function show(el, klas){
          core.addClass(el, klas || current);
    }
    
     function hide(el, klas){
          core.removeClass(el, klas || current);
    }
        
        function reveal (i){
           show(containers[i]);
           show(navs[i]);  
        }
        
         function conceal (){
                 _.each(containers, function(el){
                    hide(el);
    });
        
            _.each(navs, function(el){
                    hide(el);
    }); 
        }
    
          function find(el){//adapter
              var L = navs.length;
              while(L--){
                  if(navs[L] === el){
                      break;
                  }
              }
              return L;
    }
   
   
   
    function handler(tgt){        
      
    var selector = tgt.hash && tgt.hash[0], res, index;
                
    if(selector){
       res = _.find(containers, function(el, i){
        index = i;
        return el === document.querySelector(tgt.hash);               
        });
        
    }
    if(res){
        reveal(index);
    }
        
        
        
        else {
            reveal(find(tgt));
        }
    }
    
      
    function handlerBridge(e){
        
        if(!e){
          conceal(); 
          reveal(0);
            return;
        }
         
         e.preventDefault;
        if(e.target.nodeName !== 'A'){ return;}
         conceal(); 
         handler(e.target);
    }
    
   var index = 0,
       current = 'is-active',
       containers = document.querySelectorAll(".c-tab"),
       navs = document.querySelectorAll(".c-tabs-nav a"),
       flag = false;

    return function(){
      /*  if(!flag){
        core.addEvent(document.querySelector("#tabs"), 'click', handlerBridge);
        flag = true;
        handlerBridge();
        }*/
       var b = document.querySelector('body'),
           p = _.toArray(document.querySelectorAll('p')).slice(0, 4),
           l = _.toArray(document.querySelectorAll('label')).slice(0, 1),
           y = _.toArray(document.querySelectorAll('#yag')).slice(0, 1),
           r = _.toArray(document.querySelectorAll('.read-more-target p')).slice();
        
       _.each(p.concat(l).concat(y).concat(r), function(el){
             show(el, 'welcome');
        });
              //  show(document.getElementById("_carlos"), 'welcome');
                show(document.querySelector(".wild img"), 'welcome');
                core.removeClass(b, 'no-js');
    };
    };
    
   window.gAlp.tabs = tabs();
    
}(window.gAlp.Core));


window.gAlp.Core.addEvent(window, 'load', window.gAlp.tabs);