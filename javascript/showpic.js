function getId(id) {
   if(!document.getElementById) { return null; }
    if(!id) { return true; }
     return document.getElementById(id);
}

function showMe(el, klas) {
    el.className = klas || 'showtime';
}

function prepareGallery() {
    if (!document.getElementsByTagName) return false;
    if (!getId()) { return false; }
    var thumbs = getId("thumbnails");

    if (thumbs) {
        addEvent(thumbs, 'click', showpic);
    }
}

function setSrc(tgt, src) {
    //check out set and get attr
    tgt.setAttribute("src", src.getAttribute("href"));
}

function showpic(e){
var thumbs = getId("thumbnails"),
    thumblink = thumbs.getElementsByTagName("a"),
    body = document.getElementsByTagName("body")[0],
    i = 0, n = thumblink.length - 1,
    swap_pic = getId("swap"),
    right = getId("rightlink"),
    left = getId("leftlink"),
    forward = function (e) {//iterator?
        i = i === n ? 0 : ++i;
        setSrc(swap_pic, thumblink[i]);
        e.preventDefault();
    },
    reverse = function (e) {
        i = i > 0 ? --i : n;
        setSrc(swap_pic, thumblink[i]);
        e.preventDefault();
    };

if (!swap_pic || swap_pic.nodeName !== "IMG") {
    return;
}


if (right && left) {
    addEvent(right, 'click', forward);
    addEvent(left, 'click', reverse);
}

//rewrite left, right ev handlers and showpic hav ref to i through closure
showpic = function (e) {

    var whichpic = e.target.parentNode;//check parentNode

    setSrc(swap_pic, whichpic);//publish?
    showMe(body);

    while (thumblink[i]) {//iterator method, indexof?
        if (whichpic === thumblink[i]) {
            break;
        }
        i++;
    }
    e.preventDefault();
};

showpic(e);
}

addLoadEvent(prepareGallery);