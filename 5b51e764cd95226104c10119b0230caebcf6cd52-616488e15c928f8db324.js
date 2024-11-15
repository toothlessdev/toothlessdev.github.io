(self.webpackChunkblog=self.webpackChunkblog||[]).push([[462],{2729:function(e){"use strict";const t=/[\p{Lu}]/u,r=/[\p{Ll}]/u,n=/^[\p{Lu}](?![\p{Lu}])/gu,a=/([\p{Alpha}\p{N}_]|$)/u,s=/[_.\- ]+/,i=new RegExp("^"+s.source),o=new RegExp(s.source+a.source,"gu"),c=new RegExp("\\d+"+a.source,"gu"),l=(e,a)=>{if("string"!=typeof e&&!Array.isArray(e))throw new TypeError("Expected the input to be `string | string[]`");if(a={pascalCase:!1,preserveConsecutiveUppercase:!1,...a},0===(e=Array.isArray(e)?e.map((e=>e.trim())).filter((e=>e.length)).join("-"):e.trim()).length)return"";const s=!1===a.locale?e=>e.toLowerCase():e=>e.toLocaleLowerCase(a.locale),l=!1===a.locale?e=>e.toUpperCase():e=>e.toLocaleUpperCase(a.locale);if(1===e.length)return a.pascalCase?l(e):s(e);return e!==s(e)&&(e=((e,n,a)=>{let s=!1,i=!1,o=!1;for(let c=0;c<e.length;c++){const l=e[c];s&&t.test(l)?(e=e.slice(0,c)+"-"+e.slice(c),s=!1,o=i,i=!0,c++):i&&o&&r.test(l)?(e=e.slice(0,c-1)+"-"+e.slice(c-1),o=i,i=!1,s=!0):(s=n(l)===l&&a(l)!==l,o=i,i=a(l)===l&&n(l)!==l)}return e})(e,s,l)),e=e.replace(i,""),e=a.preserveConsecutiveUppercase?((e,t)=>(n.lastIndex=0,e.replace(n,(e=>t(e)))))(e,s):s(e),a.pascalCase&&(e=l(e.charAt(0))+e.slice(1)),((e,t)=>(o.lastIndex=0,c.lastIndex=0,e.replace(o,((e,r)=>t(r))).replace(c,(e=>t(e)))))(e,l)};e.exports=l,e.exports.default=l},4353:function(e){e.exports=function(){"use strict";var e=1e3,t=6e4,r=36e5,n="millisecond",a="second",s="minute",i="hour",o="day",c="week",l="month",u="quarter",d="year",h="date",f="Invalid Date",g=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,m=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,p={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(e){var t=["th","st","nd","rd"],r=e%100;return"["+e+(t[(r-20)%10]||t[r]||t[0])+"]"}},y=function(e,t,r){var n=String(e);return!n||n.length>=t?e:""+Array(t+1-n.length).join(r)+e},b={s:y,z:function(e){var t=-e.utcOffset(),r=Math.abs(t),n=Math.floor(r/60),a=r%60;return(t<=0?"+":"-")+y(n,2,"0")+":"+y(a,2,"0")},m:function e(t,r){if(t.date()<r.date())return-e(r,t);var n=12*(r.year()-t.year())+(r.month()-t.month()),a=t.clone().add(n,l),s=r-a<0,i=t.clone().add(n+(s?-1:1),l);return+(-(n+(r-a)/(s?a-i:i-a))||0)},a:function(e){return e<0?Math.ceil(e)||0:Math.floor(e)},p:function(e){return{M:l,y:d,w:c,d:o,D:h,h:i,m:s,s:a,ms:n,Q:u}[e]||String(e||"").toLowerCase().replace(/s$/,"")},u:function(e){return void 0===e}},$="en",v={};v[$]=p;var w="$isDayjsObject",E=function(e){return e instanceof M||!(!e||!e[w])},S=function e(t,r,n){var a;if(!t)return $;if("string"==typeof t){var s=t.toLowerCase();v[s]&&(a=s),r&&(v[s]=r,a=s);var i=t.split("-");if(!a&&i.length>1)return e(i[0])}else{var o=t.name;v[o]=t,a=o}return!n&&a&&($=a),a||!n&&$},x=function(e,t){if(E(e))return e.clone();var r="object"==typeof t?t:{};return r.date=e,r.args=arguments,new M(r)},O=b;O.l=S,O.i=E,O.w=function(e,t){return x(e,{locale:t.$L,utc:t.$u,x:t.$x,$offset:t.$offset})};var M=function(){function p(e){this.$L=S(e.locale,null,!0),this.parse(e),this.$x=this.$x||e.x||{},this[w]=!0}var y=p.prototype;return y.parse=function(e){this.$d=function(e){var t=e.date,r=e.utc;if(null===t)return new Date(NaN);if(O.u(t))return new Date;if(t instanceof Date)return new Date(t);if("string"==typeof t&&!/Z$/i.test(t)){var n=t.match(g);if(n){var a=n[2]-1||0,s=(n[7]||"0").substring(0,3);return r?new Date(Date.UTC(n[1],a,n[3]||1,n[4]||0,n[5]||0,n[6]||0,s)):new Date(n[1],a,n[3]||1,n[4]||0,n[5]||0,n[6]||0,s)}}return new Date(t)}(e),this.init()},y.init=function(){var e=this.$d;this.$y=e.getFullYear(),this.$M=e.getMonth(),this.$D=e.getDate(),this.$W=e.getDay(),this.$H=e.getHours(),this.$m=e.getMinutes(),this.$s=e.getSeconds(),this.$ms=e.getMilliseconds()},y.$utils=function(){return O},y.isValid=function(){return!(this.$d.toString()===f)},y.isSame=function(e,t){var r=x(e);return this.startOf(t)<=r&&r<=this.endOf(t)},y.isAfter=function(e,t){return x(e)<this.startOf(t)},y.isBefore=function(e,t){return this.endOf(t)<x(e)},y.$g=function(e,t,r){return O.u(e)?this[t]:this.set(r,e)},y.unix=function(){return Math.floor(this.valueOf()/1e3)},y.valueOf=function(){return this.$d.getTime()},y.startOf=function(e,t){var r=this,n=!!O.u(t)||t,u=O.p(e),f=function(e,t){var a=O.w(r.$u?Date.UTC(r.$y,t,e):new Date(r.$y,t,e),r);return n?a:a.endOf(o)},g=function(e,t){return O.w(r.toDate()[e].apply(r.toDate("s"),(n?[0,0,0,0]:[23,59,59,999]).slice(t)),r)},m=this.$W,p=this.$M,y=this.$D,b="set"+(this.$u?"UTC":"");switch(u){case d:return n?f(1,0):f(31,11);case l:return n?f(1,p):f(0,p+1);case c:var $=this.$locale().weekStart||0,v=(m<$?m+7:m)-$;return f(n?y-v:y+(6-v),p);case o:case h:return g(b+"Hours",0);case i:return g(b+"Minutes",1);case s:return g(b+"Seconds",2);case a:return g(b+"Milliseconds",3);default:return this.clone()}},y.endOf=function(e){return this.startOf(e,!1)},y.$set=function(e,t){var r,c=O.p(e),u="set"+(this.$u?"UTC":""),f=(r={},r[o]=u+"Date",r[h]=u+"Date",r[l]=u+"Month",r[d]=u+"FullYear",r[i]=u+"Hours",r[s]=u+"Minutes",r[a]=u+"Seconds",r[n]=u+"Milliseconds",r)[c],g=c===o?this.$D+(t-this.$W):t;if(c===l||c===d){var m=this.clone().set(h,1);m.$d[f](g),m.init(),this.$d=m.set(h,Math.min(this.$D,m.daysInMonth())).$d}else f&&this.$d[f](g);return this.init(),this},y.set=function(e,t){return this.clone().$set(e,t)},y.get=function(e){return this[O.p(e)]()},y.add=function(n,u){var h,f=this;n=Number(n);var g=O.p(u),m=function(e){var t=x(f);return O.w(t.date(t.date()+Math.round(e*n)),f)};if(g===l)return this.set(l,this.$M+n);if(g===d)return this.set(d,this.$y+n);if(g===o)return m(1);if(g===c)return m(7);var p=(h={},h[s]=t,h[i]=r,h[a]=e,h)[g]||1,y=this.$d.getTime()+n*p;return O.w(y,this)},y.subtract=function(e,t){return this.add(-1*e,t)},y.format=function(e){var t=this,r=this.$locale();if(!this.isValid())return r.invalidDate||f;var n=e||"YYYY-MM-DDTHH:mm:ssZ",a=O.z(this),s=this.$H,i=this.$m,o=this.$M,c=r.weekdays,l=r.months,u=r.meridiem,d=function(e,r,a,s){return e&&(e[r]||e(t,n))||a[r].slice(0,s)},h=function(e){return O.s(s%12||12,e,"0")},g=u||function(e,t,r){var n=e<12?"AM":"PM";return r?n.toLowerCase():n};return n.replace(m,(function(e,n){return n||function(e){switch(e){case"YY":return String(t.$y).slice(-2);case"YYYY":return O.s(t.$y,4,"0");case"M":return o+1;case"MM":return O.s(o+1,2,"0");case"MMM":return d(r.monthsShort,o,l,3);case"MMMM":return d(l,o);case"D":return t.$D;case"DD":return O.s(t.$D,2,"0");case"d":return String(t.$W);case"dd":return d(r.weekdaysMin,t.$W,c,2);case"ddd":return d(r.weekdaysShort,t.$W,c,3);case"dddd":return c[t.$W];case"H":return String(s);case"HH":return O.s(s,2,"0");case"h":return h(1);case"hh":return h(2);case"a":return g(s,i,!0);case"A":return g(s,i,!1);case"m":return String(i);case"mm":return O.s(i,2,"0");case"s":return String(t.$s);case"ss":return O.s(t.$s,2,"0");case"SSS":return O.s(t.$ms,3,"0");case"Z":return a}return null}(e)||a.replace(":","")}))},y.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},y.diff=function(n,h,f){var g,m=this,p=O.p(h),y=x(n),b=(y.utcOffset()-this.utcOffset())*t,$=this-y,v=function(){return O.m(m,y)};switch(p){case d:g=v()/12;break;case l:g=v();break;case u:g=v()/3;break;case c:g=($-b)/6048e5;break;case o:g=($-b)/864e5;break;case i:g=$/r;break;case s:g=$/t;break;case a:g=$/e;break;default:g=$}return f?g:O.a(g)},y.daysInMonth=function(){return this.endOf(l).$D},y.$locale=function(){return v[this.$L]},y.locale=function(e,t){if(!e)return this.$L;var r=this.clone(),n=S(e,t,!0);return n&&(r.$L=n),r},y.clone=function(){return O.w(this.$d,this)},y.toDate=function(){return new Date(this.valueOf())},y.toJSON=function(){return this.isValid()?this.toISOString():null},y.toISOString=function(){return this.$d.toISOString()},y.toString=function(){return this.$d.toUTCString()},p}(),k=M.prototype;return x.prototype=k,[["$ms",n],["$s",a],["$m",s],["$H",i],["$W",o],["$M",l],["$y",d],["$D",h]].forEach((function(e){k[e[1]]=function(t){return this.$g(t,e[0],e[1])}})),x.extend=function(e,t){return e.$i||(e(t,M,x),e.$i=!0),x},x.locale=S,x.isDayjs=E,x.unix=function(e){return x(1e3*e)},x.en=v[$],x.Ls=v,x.p={},x}()},2532:function(e,t,r){"use strict";r.d(t,{L:function(){return g},M:function(){return E},P:function(){return w},S:function(){return R},_:function(){return o},a:function(){return i},b:function(){return u},g:function(){return d},h:function(){return c}});var n=r(6540),a=(r(2729),r(5556)),s=r.n(a);function i(){return i=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},i.apply(this,arguments)}function o(e,t){if(null==e)return{};var r,n,a={},s=Object.keys(e);for(n=0;n<s.length;n++)t.indexOf(r=s[n])>=0||(a[r]=e[r]);return a}const c=()=>"undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype;function l(e,t,r){const n={};let a="gatsby-image-wrapper";return"fixed"===r?(n.width=e,n.height=t):"constrained"===r&&(a="gatsby-image-wrapper gatsby-image-wrapper-constrained"),{className:a,"data-gatsby-image-wrapper":"",style:n}}function u(e,t,r,n,a){return void 0===a&&(a={}),i({},r,{loading:n,shouldLoad:e,"data-main-image":"",style:i({},a,{opacity:t?1:0})})}function d(e,t,r,n,a,s,o,c){const l={};s&&(l.backgroundColor=s,"fixed"===r?(l.width=n,l.height=a,l.backgroundColor=s,l.position="relative"):("constrained"===r||"fullWidth"===r)&&(l.position="absolute",l.top=0,l.left=0,l.bottom=0,l.right=0)),o&&(l.objectFit=o),c&&(l.objectPosition=c);const u=i({},e,{"aria-hidden":!0,"data-placeholder-image":"",style:i({opacity:t?0:1,transition:"opacity 500ms linear"},l)});return u}const h=["children"],f=function(e){let{layout:t,width:r,height:a}=e;return"fullWidth"===t?n.createElement("div",{"aria-hidden":!0,style:{paddingTop:a/r*100+"%"}}):"constrained"===t?n.createElement("div",{style:{maxWidth:r,display:"block"}},n.createElement("img",{alt:"",role:"presentation","aria-hidden":"true",src:`data:image/svg+xml;charset=utf-8,%3Csvg%20height='${a}'%20width='${r}'%20xmlns='http://www.w3.org/2000/svg'%20version='1.1'%3E%3C/svg%3E`,style:{maxWidth:"100%",display:"block",position:"static"}})):null},g=function(e){let{children:t}=e,r=o(e,h);return n.createElement(n.Fragment,null,n.createElement(f,i({},r)),t,null)},m=["src","srcSet","loading","alt","shouldLoad"],p=["fallback","sources","shouldLoad"],y=function(e){let{src:t,srcSet:r,loading:a,alt:s="",shouldLoad:c}=e,l=o(e,m);return n.createElement("img",i({},l,{decoding:"async",loading:a,src:c?t:void 0,"data-src":c?void 0:t,srcSet:c?r:void 0,"data-srcset":c?void 0:r,alt:s}))},b=function(e){let{fallback:t,sources:r=[],shouldLoad:a=!0}=e,s=o(e,p);const c=s.sizes||(null==t?void 0:t.sizes),l=n.createElement(y,i({},s,t,{sizes:c,shouldLoad:a}));return r.length?n.createElement("picture",null,r.map((e=>{let{media:t,srcSet:r,type:s}=e;return n.createElement("source",{key:`${t}-${s}-${r}`,type:s,media:t,srcSet:a?r:void 0,"data-srcset":a?void 0:r,sizes:c})})),l):l};var $;y.propTypes={src:a.string.isRequired,alt:a.string.isRequired,sizes:a.string,srcSet:a.string,shouldLoad:a.bool},b.displayName="Picture",b.propTypes={alt:a.string.isRequired,shouldLoad:a.bool,fallback:a.exact({src:a.string.isRequired,srcSet:a.string,sizes:a.string}),sources:a.arrayOf(a.oneOfType([a.exact({media:a.string.isRequired,type:a.string,sizes:a.string,srcSet:a.string.isRequired}),a.exact({media:a.string,type:a.string.isRequired,sizes:a.string,srcSet:a.string.isRequired})]))};const v=["fallback"],w=function(e){let{fallback:t}=e,r=o(e,v);return t?n.createElement(b,i({},r,{fallback:{src:t},"aria-hidden":!0,alt:""})):n.createElement("div",i({},r))};w.displayName="Placeholder",w.propTypes={fallback:a.string,sources:null==($=b.propTypes)?void 0:$.sources,alt:function(e,t,r){return e[t]?new Error(`Invalid prop \`${t}\` supplied to \`${r}\`. Validation failed.`):null}};const E=function(e){return n.createElement(n.Fragment,null,n.createElement(b,i({},e)),n.createElement("noscript",null,n.createElement(b,i({},e,{shouldLoad:!0}))))};E.displayName="MainImage",E.propTypes=b.propTypes;const S=["as","className","class","style","image","loading","imgClassName","imgStyle","backgroundColor","objectFit","objectPosition"],x=["style","className"],O=e=>e.replace(/\n/g,""),M=function(e,t,r){for(var n=arguments.length,a=new Array(n>3?n-3:0),i=3;i<n;i++)a[i-3]=arguments[i];return e.alt||""===e.alt?s().string.apply(s(),[e,t,r].concat(a)):new Error(`The "alt" prop is required in ${r}. If the image is purely presentational then pass an empty string: e.g. alt="". Learn more: https://a11y-style-guide.com/style-guide/section-media.html`)},k={image:s().object.isRequired,alt:M},N=["as","image","style","backgroundColor","className","class","onStartLoad","onLoad","onError"],L=["style","className"],C=new Set;let D,j;const T=function(e){let{as:t="div",image:a,style:s,backgroundColor:u,className:d,class:h,onStartLoad:f,onLoad:g,onError:m}=e,p=o(e,N);const{width:y,height:b,layout:$}=a,v=l(y,b,$),{style:w,className:E}=v,S=o(v,L),x=(0,n.useRef)(),O=(0,n.useMemo)((()=>JSON.stringify(a.images)),[a.images]);h&&(d=h);const M=function(e,t,r){let n="";return"fullWidth"===e&&(n=`<div aria-hidden="true" style="padding-top: ${r/t*100}%;"></div>`),"constrained"===e&&(n=`<div style="max-width: ${t}px; display: block;"><img alt="" role="presentation" aria-hidden="true" src="data:image/svg+xml;charset=utf-8,%3Csvg%20height='${r}'%20width='${t}'%20xmlns='http://www.w3.org/2000/svg'%20version='1.1'%3E%3C/svg%3E" style="max-width: 100%; display: block; position: static;"></div>`),n}($,y,b);return(0,n.useEffect)((()=>{D||(D=r.e(108).then(r.bind(r,1108)).then((e=>{let{renderImageToString:t,swapPlaceholderImage:r}=e;return j=t,{renderImageToString:t,swapPlaceholderImage:r}})));const e=x.current.querySelector("[data-gatsby-image-ssr]");if(e&&c())return e.complete?(null==f||f({wasCached:!0}),null==g||g({wasCached:!0}),setTimeout((()=>{e.removeAttribute("data-gatsby-image-ssr")}),0)):(null==f||f({wasCached:!0}),e.addEventListener("load",(function t(){e.removeEventListener("load",t),null==g||g({wasCached:!0}),setTimeout((()=>{e.removeAttribute("data-gatsby-image-ssr")}),0)}))),void C.add(O);if(j&&C.has(O))return;let t,n;return D.then((e=>{let{renderImageToString:r,swapPlaceholderImage:o}=e;x.current&&(x.current.innerHTML=r(i({isLoading:!0,isLoaded:C.has(O),image:a},p)),C.has(O)||(t=requestAnimationFrame((()=>{x.current&&(n=o(x.current,O,C,s,f,g,m))}))))})),()=>{t&&cancelAnimationFrame(t),n&&n()}}),[a]),(0,n.useLayoutEffect)((()=>{C.has(O)&&j&&(x.current.innerHTML=j(i({isLoading:C.has(O),isLoaded:C.has(O),image:a},p)),null==f||f({wasCached:!0}),null==g||g({wasCached:!0}))}),[a]),(0,n.createElement)(t,i({},S,{style:i({},w,s,{backgroundColor:u}),className:`${E}${d?` ${d}`:""}`,ref:x,dangerouslySetInnerHTML:{__html:M},suppressHydrationWarning:!0}))},_=(0,n.memo)((function(e){return e.image?(0,n.createElement)(T,e):null}));_.propTypes=k,_.displayName="GatsbyImage";const I=["src","__imageData","__error","width","height","aspectRatio","tracedSVGOptions","placeholder","formats","quality","transformOptions","jpgOptions","pngOptions","webpOptions","avifOptions","blurredOptions","breakpoints","outputPixelDensities"];function A(e){return function(t){let{src:r,__imageData:a,__error:s}=t,c=o(t,I);return s&&console.warn(s),a?n.createElement(e,i({image:a},c)):(console.warn("Image not loaded",r),null)}}const W=A((function(e){let{as:t="div",className:r,class:a,style:s,image:c,loading:h="lazy",imgClassName:f,imgStyle:m,backgroundColor:p,objectFit:y,objectPosition:b}=e,$=o(e,S);if(!c)return console.warn("[gatsby-plugin-image] Missing image prop"),null;a&&(r=a),m=i({objectFit:y,objectPosition:b,backgroundColor:p},m);const{width:v,height:M,layout:k,images:N,placeholder:L,backgroundColor:C}=c,D=l(v,M,k),{style:j,className:T}=D,_=o(D,x),I={fallback:void 0,sources:[]};return N.fallback&&(I.fallback=i({},N.fallback,{srcSet:N.fallback.srcSet?O(N.fallback.srcSet):void 0})),N.sources&&(I.sources=N.sources.map((e=>i({},e,{srcSet:O(e.srcSet)})))),n.createElement(t,i({},_,{style:i({},j,s,{backgroundColor:p}),className:`${T}${r?` ${r}`:""}`}),n.createElement(g,{layout:k,width:v,height:M},n.createElement(w,i({},d(L,!1,k,v,M,C,y,b))),n.createElement(E,i({"data-gatsby-image-ssr":"",className:f},$,u("eager"===h,!1,I,h,m)))))})),H=function(e,t){for(var r=arguments.length,n=new Array(r>2?r-2:0),a=2;a<r;a++)n[a-2]=arguments[a];return"fullWidth"!==e.layout||"width"!==t&&"height"!==t||!e[t]?s().number.apply(s(),[e,t].concat(n)):new Error(`"${t}" ${e[t]} may not be passed when layout is fullWidth.`)},q=new Set(["fixed","fullWidth","constrained"]),P={src:s().string.isRequired,alt:M,width:H,height:H,sizes:s().string,layout:e=>{if(void 0!==e.layout&&!q.has(e.layout))return new Error(`Invalid value ${e.layout}" provided for prop "layout". Defaulting to "constrained". Valid values are "fixed", "fullWidth" or "constrained".`)}};W.displayName="StaticImage",W.propTypes=P;const R=A(_);R.displayName="StaticImage",R.propTypes=P},3278:function(e,t,r){"use strict";r.d(t,{o:function(){return i}});var n=r(6540),a=r(4810),s=r(2532);const i={Link:a.N_,h1:e=>n.createElement("h1",Object.assign({className:"text-2xl font-bold"},e)),h2:e=>n.createElement("h2",Object.assign({className:"text-xl font-bold"},e)),h3:e=>n.createElement("h3",Object.assign({className:"text-lg font-bold"},e)),h4:e=>n.createElement("h4",Object.assign({className:"text-md font-bold"},e)),h5:e=>n.createElement("h5",Object.assign({className:"text-sm font-bold"},e)),h6:e=>n.createElement("h6",Object.assign({className:"text-xs font-bold"},e)),p:e=>n.createElement("p",Object.assign({className:"text-[#8f97a0]"},e)),a:e=>n.createElement("a",Object.assign({className:"text-blue-500"},e)),ul:e=>n.createElement("ul",Object.assign({className:"list-inside list-disc"},e)),ol:e=>n.createElement("ol",Object.assign({className:"list-inside list-decimal"},e)),li:e=>n.createElement("li",Object.assign({className:"text-[#8f97a0]"},e)),blockquote:e=>n.createElement("blockquote",Object.assign({className:"border-l-4 border-blue-500 pl-2"},e)),pre:e=>n.createElement("pre",Object.assign({className:"rounded-[8px] bg-gray-800 p-4"},e)),code:e=>n.createElement("code",Object.assign({className:"rounded-[6px] bg-gray-800 p-1 text-sm"},e)),img:e=>n.createElement("img",e),table:e=>n.createElement("table",Object.assign({className:"table-auto"},e)),th:e=>n.createElement("th",Object.assign({className:"border px-4 py-2"},e)),td:e=>n.createElement("td",Object.assign({className:"border px-4 py-2"},e)),tr:e=>n.createElement("tr",Object.assign({className:"border px-4 py-2"},e)),wrapper:e=>{let{children:t}=e;return n.createElement("div",{style:{width:"100%"}},t)},StaticImage:s.S}},8453:function(e,t,r){"use strict";r.d(t,{RP:function(){return s},xA:function(){return o}});var n=r(6540);const a=n.createContext({});function s(e){const t=n.useContext(a);return n.useMemo((()=>"function"==typeof e?e(t):{...t,...e}),[t,e])}const i={};function o({components:e,children:t,disableParentContext:r}){let o;return o=r?"function"==typeof e?e({}):e||i:s(e),n.createElement(a.Provider,{value:o},t)}}}]);
//# sourceMappingURL=5b51e764cd95226104c10119b0230caebcf6cd52-616488e15c928f8db324.js.map