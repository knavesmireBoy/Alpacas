window.onload = styleHeaderSiblings;

function styleHeaderSiblings(){
if(!document.getElementsByTagName) return false;
var headers = document.getElementsByTagName("h3");
for (var i=0; i<headers.length; i++) {
var elem = getNextElement(headers[i].nextSibling);
elem.style.marginLeft = "175px";
}
}
function getNextElement(node) {
if(node.nodeType == 1){
return node;
}
if (node.nextSibling) {
return getNextElement(node.nextSibling);
}
return null;
}