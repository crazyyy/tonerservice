window.Modernizr=function(e,t,n){function r(e){u.cssText=e}function o(e,t){return typeof e===t}var a,i,c={},l=t.documentElement,s="modernizr",d=t.createElement(s),u=d.style,m=" -webkit- -moz- -o- -ms- ".split(" "),f={},p=[],h=p.slice,v=function(e,n,r,o){var a,i,c,d,u=t.createElement("div"),m=t.body,f=m||t.createElement("body");if(parseInt(r,10))for(;r--;)c=t.createElement("div"),c.id=o?o[r]:s+(r+1),u.appendChild(c);return a=["&#173;",'<style id="s',s,'">',e,"</style>"].join(""),u.id=s,(m?u:f).innerHTML+=a,f.appendChild(u),m||(f.style.background="",f.style.overflow="hidden",d=l.style.overflow,l.style.overflow="hidden",l.appendChild(f)),i=n(u,e),m?u.parentNode.removeChild(u):(f.parentNode.removeChild(f),l.style.overflow=d),!!i},y={}.hasOwnProperty;i=o(y,"undefined")||o(y.call,"undefined")?function(e,t){return t in e&&o(e.constructor.prototype[t],"undefined")}:function(e,t){return y.call(e,t)},Function.prototype.bind||(Function.prototype.bind=function(e){var t=this;if("function"!=typeof t)throw new TypeError;var n=h.call(arguments,1),r=function(){if(this instanceof r){var o=function(){};o.prototype=t.prototype;var a=new o,i=t.apply(a,n.concat(h.call(arguments)));return Object(i)===i?i:a}return t.apply(e,n.concat(h.call(arguments)))};return r}),f.touch=function(){var n;return"ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch?n=!0:v(["@media (",m.join("touch-enabled),("),s,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(e){n=9===e.offsetTop}),n},f.video=function(){var e=t.createElement("video"),n=!1;try{(n=!!e.canPlayType)&&(n=new Boolean(n),n.ogg=e.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),n.h264=e.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),n.webm=e.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,""))}catch(e){}return n};for(var g in f)i(f,g)&&(a=g.toLowerCase(),c[a]=f[g](),p.push((c[a]?"":"no-")+a));return c.addTest=function(e,t){if("object"==typeof e)for(var r in e)i(e,r)&&c.addTest(r,e[r]);else{if(e=e.toLowerCase(),c[e]!==n)return c;t="function"==typeof t?t():t,l.className+=" w-mod-"+(t?"":"no-")+e,c[e]=t}return c},r(""),d=null,function(e,t){function n(e,t){var n=e.createElement("p"),r=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",r.insertBefore(n.lastChild,r.firstChild)}function r(){var e=v.elements;return"string"==typeof e?e.split(" "):e}function o(e){var t=h[e[f]];return t||(t={},p++,e[f]=p,h[p]=t),t}function a(e,n,r){if(n||(n=t),s)return n.createElement(e);r||(r=o(n));var a;return!(a=r.cache[e]?r.cache[e].cloneNode():m.test(e)?(r.cache[e]=r.createElem(e)).cloneNode():r.createElem(e)).canHaveChildren||u.test(e)||a.tagUrn?a:r.frag.appendChild(a)}function i(e,t){t.cache||(t.cache={},t.createElem=e.createElement,t.createFrag=e.createDocumentFragment,t.frag=t.createFrag()),e.createElement=function(n){return v.shivMethods?a(n,e,t):t.createElem(n)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+r().join().replace(/[\w\-]+/g,function(e){return t.createElem(e),t.frag.createElement(e),'c("'+e+'")'})+");return n}")(v,t.frag)}function c(e){e||(e=t);var r=o(e);return v.shivCSS&&!l&&!r.hasCSS&&(r.hasCSS=!!n(e,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),s||i(e,r),e}var l,s,d=e.html5||{},u=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,m=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,f="_html5shiv",p=0,h={};!function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>",l="hidden"in e,s=1==e.childNodes.length||function(){t.createElement("a");var e=t.createDocumentFragment();return void 0===e.cloneNode||void 0===e.createDocumentFragment||void 0===e.createElement}()}catch(e){l=!0,s=!0}}();var v={elements:d.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:"3.7.0",shivCSS:!1!==d.shivCSS,supportsUnknownElements:s,shivMethods:!1!==d.shivMethods,type:"default",shivDocument:c,createElement:a,createDocumentFragment:function(e,n){if(e||(e=t),s)return e.createDocumentFragment();for(var a=(n=n||o(e)).frag.cloneNode(),i=0,c=r(),l=c.length;i<l;i++)a.createElement(c[i]);return a}};e.html5=v,c(t)}(this,t),c._version="2.7.1",c._prefixes=m,c.testStyles=v,l.className=l.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+" w-mod-js w-mod-"+p.join(" w-mod-"),c}(this,this.document),Modernizr.addTest("ios",/(ipod|iphone|ipad)/i.test(navigator.userAgent));
//# sourceMappingURL=maps/modernizer.js.map
