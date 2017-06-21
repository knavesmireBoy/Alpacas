/*function positionMessage() {
  if (!document.getElementsByTagName) return false;
  if (!document.getElementById) return false;
  if (!document.getElementById("for_sale")) return false;
 var elem = document.getElementById("for_sale");
elem.style.position = "relative";
elem.style.left = "0px";
elem.style.top = "0px";
moveElement("for_sale",-210,-70,100);
 var elem = document.getElementById("AlpacasforSale");
elem.style.position = "relative";
elem.style.left = "0px";
elem.style.top = "0px";
moveElement("AlpacasforSale",310,0,1);
     }
     */
function prepareMove() {
 if (!document.getElementsByTagName) return false;
  if (!document.getElementById) return false;
  if (!document.getElementById("for_sale")) return false;
var elem = document.getElementById("for_sale");
elem.style.position = "relative";
elem.style.left = "0px";
elem.style.top = "0px";
var link = document.getElementsByTagName("a");
link[1].onmouseover = function(){
moveElement("for_sale",220,-70,1);
};
/*link[2].onmouseover = function(){
moveElement("for_sale",210,0,1);
*/
}


//addLoadEvent(positionMessage);
//addLoadEvent(prepareMove);
