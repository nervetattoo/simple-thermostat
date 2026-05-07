!function(){const t={DEBUG:!1};try{if(process)return process.env=Object.assign({},process.env),void Object.assign(process.env,t)}catch(t){}globalThis.process={env:t}}();var t="simple-thermostat";const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const r=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:u}=Object,p=globalThis,f=p.trustedTypes,g=f?f.emptyScript:"",m=p.reactiveElementPolyfillSupport,v=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!a(t,e),_={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);n?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const o=n.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const o=this.constructor;if(!1===s&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??$)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[v("elementProperties")]=new Map,b[v("finalized")]=new Map,m?.({ReactiveElement:b}),(p.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,x=t=>t,A=w.trustedTypes,E=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+C,O=`<${k}>`,T=document,P=()=>T.createComment(""),z=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,j="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,H=/>/g,I=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),V=/'/g,M=/"/g,D=/^(?:script|style|textarea|title)$/i,F=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),L=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),W=new WeakMap,q=T.createTreeWalker(T,129);function J(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const Y=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":3===e?"<math>":"",r=R;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,h=0;for(;h<i.length&&(r.lastIndex=h,c=r.exec(i),null!==c);)h=r.lastIndex,r===R?"!--"===c[1]?r=U:void 0!==c[1]?r=H:void 0!==c[2]?(D.test(c[2])&&(n=RegExp("</"+c[2],"g")),r=I):void 0!==c[3]&&(r=I):r===I?">"===c[0]?(r=n??R,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?I:'"'===c[3]?M:V):r===M||r===V?r=I:r===U||r===H?r=R:(r=I,n=void 0);const d=r===I&&t[e+1].startsWith("/>")?" ":"";o+=r===R?i+O:l>=0?(s.push(a),i.slice(0,l)+S+i.slice(l)+C+d):i+C+(-2===l?e:d)}return[J(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class G{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[c,l]=Y(t,e);if(this.el=G.createElement(c,i),q.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=q.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=l[o++],i=s.getAttribute(t).split(C),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?tt:"?"===r[1]?et:"@"===r[1]?it:X}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(D.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],P()),q.nextNode(),a.push({type:2,index:++n});s.append(t[e],P())}}}else if(8===s.nodeType)if(s.data===k)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:n}),t+=C.length-1}n++}}static createElement(t,e){const i=T.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,s){if(e===L)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const o=z(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=K(t,n._$AS(t,e.values),n,s)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??T).importNode(e,!0);q.currentNode=s;let n=q.nextNode(),o=0,r=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new Q(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new st(n,this,t)),this._$AV.push(e),a=i[++r]}o!==a?.index&&(n=q.nextNode(),o++)}return q.currentNode=T,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),z(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==L&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Z(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new G(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new Q(this.O(P()),this.O(P()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=K(this,t,e,0),o=!z(t)||t!==this._$AH&&t!==L,o&&(this._$AH=t);else{const s=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=K(this,s[i+r],e,r),a===L&&(a=this._$AH[r]),o||=!z(a)||a!==this._$AH[r],a===B?t=B:t!==B&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class et extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class it extends X{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??B)===L)return;const i=this._$AH,s=t===B&&i!==B||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==B&&(i===B||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(G,Q),(w.litHtmlVersions??=[]).push("3.3.2");const ot=globalThis;let rt=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new Q(e.insertBefore(P(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}};rt._$litElement$=!0,rt.finalized=!0,ot.litElementHydrateSupport?.({LitElement:rt});const at=ot.litElementPolyfillSupport;at?.({LitElement:rt}),(ot.litElementVersions??=[]).push("4.2.2");var ct=((t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)})`:host {
  --st-default-spacing: 4px;
}
ha-card {
  font-size: 14px;
  font-size: var(--ha-font-size-m, var(--body-font-size, 14px));
  line-height: 20px;
  line-height: var(--ha-line-height-normal, var(--body-line-height, 20px));
  -webkit-font-smoothing: antialiased;
  -webkit-font-smoothing: var(--ha-font-smoothing, antialiased);

  padding-bottom: calc(var(--st-spacing, var(--st-default-spacing)) * 2);

  --auto-color: green;
  --heat_cool-color: springgreen;
  --cool-color: #2b9af9;
  --heat-color: #ff8100;
  --off-color: #8a8a8a;
  --fan_only-color: #8a8a8a;
  --dry-color: #efbd07;
}

ha-card.no-header {
  padding: calc(var(--st-spacing, var(--st-default-spacing)) * 4) 0;
}

ha-icon-button ha-icon {
  display: flex;
}

.body {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(min-content, auto);
  align-items: center;
  justify-items: center;
  place-items: center;
  padding: 0 calc(var(--st-spacing, var(--st-default-spacing)) * 4);
  padding-bottom: calc(var(--st-spacing, var(--st-default-spacing)) * 2);
}

.toggle-label {
  color: var(--st-toggle-label-color, var(--primary-text-color));
  margin-right: calc(var(--st-spacing, var(--st-default-spacing)) * 2);
  font-size: 16px;
  font-size: var(--st-font-size-toggle-label, var(--ha-font-size-l, 16px));
}

.faults {
  display: flex;
  flex-direction: row;
  margin-left: calc(var(--st-spacing, var(--st-default-spacing)) * 2);
}
.fault-icon {
  padding: 2px;
  cursor: pointer;
  color: var(--st-fault-inactive-color, var(--secondary-background-color));
}
.fault-icon.active {
    color: var(--st-fault-active-color, var(--accent-color));
  }
.fault-icon.hide {
    display: none;
  }

.sensors {
  display: grid;
  grid-gap: var(--st-spacing, var(--st-default-spacing));
  gap: var(--st-spacing, var(--st-default-spacing));
  font-size: 16px;
  font-size: var(--st-font-size-sensors, var(--ha-font-size-l, 16px));
}
.sensors.as-list {
  grid-auto-flow: column;
  grid-template-columns: min-content;
}

.sensors.as-table.without-labels {
    grid: auto-flow / 100%;
    align-items: start;
    justify-items: start;
    place-items: start;
  }

.sensors.as-table.with-labels {
    grid: auto-flow / auto auto;
    align-items: start;
    justify-items: start;
    place-items: start;
  }

.sensor-value {
  display: flex;
  align-items: center;
  padding-bottom: 4px;
}
.sensor-heading {
  font-weight: 300;
  padding-right: 8px;
  padding-bottom: 4px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.sensors:empty {
  display: none;
}
header {
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: calc(var(--st-spacing, var(--st-default-spacing)) * 6)
    calc(var(--st-spacing, var(--st-default-spacing)) * 4)
    calc(var(--st-spacing, var(--st-default-spacing)) * 4);
}
.header__clickable {
  display: flex;
}
.header__toggle {
  margin-left: auto;
}
.header__icon {
  margin-right: calc(var(--st-spacing, var(--st-default-spacing)) * 2);
  color: #44739e;
  color: var(--state-icon-color, #44739e);
}
.header__title {
  font-size: 24px;
  font-size: var(--st-font-size-title, var(--ha-card-header-font-size, 24px));
  line-height: 24px;
  line-height: var(--st-font-size-title, var(--ha-card-header-font-size, 24px));
  font-weight: normal;
  margin: 0;
  align-self: flex-start;
}
.current-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  flex-wrap: wrap;
}
.current-wrapper.row {
    flex-direction: row-reverse;
  }
.current--value {
  display: flex;
  align-items: center;
  margin: 0;
  font-weight: 400;
  line-height: max(28px, min(6vw, 34px));
  line-height: var(--st-font-size-l, max(28px, min(6vw, 34px)));
  font-size: max(28px, min(6vw, 34px));
  font-size: var(--st-font-size-l, max(28px, min(6vw, 34px)));
  cursor: pointer;
  transition: color 200ms ease;
}
@media (min-width: 768px) {
.current--value {
    font-size: max(34px, min(5vw, 45px));
    font-size: var(--st-font-size-xl, max(34px, min(5vw, 45px)));
    line-height: max(34px, min(5vw, 45px));
    line-height: var(--st-font-size-xl, max(34px, min(5vw, 45px)));
}
  }
.current--value.updating {
    color: var(--error-color);
  }
.current--value:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: 4px;
  }
.current--unit {
  font-size: 20px;
  font-size: var(--st-font-size-m, 20px);
}
.thermostat-trigger {
  padding: 0;
}
.clickable {
  cursor: pointer;
}
.modes {
  display: grid;
  grid-template-columns: auto;
  grid-auto-flow: column;
  grid-gap: 2px;
  gap: 2px;
  margin-top: calc(var(--st-spacing, var(--st-default-spacing)) * 2);
  padding: var(--st-spacing, var(--st-default-spacing));
}
.modes.heading {
    grid-template-columns: min-content;
  }
.mode-title {
  padding: 0 16px;
  align-self: center;
  justify-self: center;
  place-self: center;
  font-size: 16px;
  font-size: var(--st-font-size-sensors, var(--ha-font-size-l, 16px));
  font-weight: 300;
  white-space: nowrap;
}
.mode-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  min-height: 24px;
  padding: var(--st-spacing, var(--st-default-spacing)) 0;
  background: var(--st-mode-background, var(--secondary-background-color));
  color: var(--secondary-text-color);
  cursor: pointer;
  border-radius: var(--st-spacing, var(--st-default-spacing));
  transition: background-color 200ms ease, color 200ms ease, transform 100ms ease;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}
.mode-item:hover {
    color: var(--st-mode-active-color, var(--primary-text-color));
  }
.mode-item:active {
    transform: scale(0.97);
  }
.mode-item:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
.mode-item.active,.mode-item.active:hover {
    background: var(--st-mode-active-background, var(--primary-color));
    color: var(--st-mode-active-color, var(--text-primary-color));
  }
.mode-item.active.off {
    background: var(--st-mode-active-background, var(--off-color));
  }
.mode-item.active.heat {
    background: var(--st-mode-active-background, var(--heat-color));
  }
.mode-item.active.cool {
    background: var(--st-mode-active-background, var(--cool-color));
  }
.mode-item.active.heat_cool {
    background: var(--st-mode-active-background, var(--heat_cool-color));
  }
.mode-item.active.auto {
    background: var(--st-mode-active-background, var(--auto-color));
  }
.mode-item.active.dry {
    background: var(--st-mode-active-background, var(--dry-color));
  }
.mode-item.active.fan_only {
    background: var(--st-mode-active-background, var(--fan_only-color));
  }
.mode-icon {
  --mdc-icon-size: 24px;
  --ha-icon-display: block;
  display: block;
}
ha-switch {
  padding: 16px 6px;
}
.side-by-side {
  display: flex;
  align-items: center;
}
.side-by-side > * {
  flex: 1;
  padding-right: 4px;
}
.styles-editor {
  margin-top: 16px;
}
.styles-label {
  display: block;
  font-size: 12px;
  font-size: var(--ha-font-size-s, 12px);
  font-weight: 500;
  color: var(--secondary-text-color);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}
.styles-hint {
  font-size: 12px;
  font-size: var(--ha-font-size-s, 12px);
  color: var(--secondary-text-color);
  margin: 0 0 8px;
}
.styles-hint code {
  font-family: monospace;
  font-family: var(--code-font-family, monospace);
  background: var(--secondary-background-color);
  padding: 1px 4px;
  border-radius: 3px;
}
`;function lt(t,e,i,s={}){i=null==i?{}:i;const n=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return n.detail=i,t.dispatchEvent(n),n}!function(t,e){void 0===e&&(e={});var i=e.insertAt;if(t&&"undefined"!=typeof document){var s=document.head||document.getElementsByTagName("head")[0],n=document.createElement("style");n.type="text/css","top"===i&&s.firstChild?s.insertBefore(n,s.firstChild):s.appendChild(n),n.styleSheet?n.styleSheet.cssText=t:n.appendChild(document.createTextNode(t))}}(ct);const ht=[0,1],dt=[.5,1],ut=["column","row"],pt=["decimals","step_size"],ft=["climate"],gt={header:{},layout:{mode:{}}},mt=t=>JSON.parse(JSON.stringify(t));function vt(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const yt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$},$t=(t=yt,e,i)=>{const{kind:s,metadata:n}=i;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function _t(t){return function(t){return(e,i)=>"object"==typeof i?$t(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}({...t,state:!0,attribute:!1})}const bt=(t,e,i,s)=>{if("length"===i||"prototype"===i)return;if("arguments"===i||"caller"===i)return;const n=Object.getOwnPropertyDescriptor(t,i),o=Object.getOwnPropertyDescriptor(e,i);!wt(n,o)&&s||Object.defineProperty(t,i,o)},wt=function(t,e){return void 0===t||t.configurable||t.writable===e.writable&&t.enumerable===e.enumerable&&t.configurable===e.configurable&&(t.writable||t.value===e.value)},xt=(t,e)=>`/* Wrapped ${t}*/\n${e}`,At=Object.getOwnPropertyDescriptor(Function.prototype,"toString"),Et=Object.getOwnPropertyDescriptor(Function.prototype.toString,"name");function St(t,e,{ignoreNonConfigurable:i=!1}={}){const{name:s}=t;for(const s of Reflect.ownKeys(e))bt(t,e,s,i);return((t,e)=>{const i=Object.getPrototypeOf(e);i!==Object.getPrototypeOf(t)&&Object.setPrototypeOf(t,i)})(t,e),((t,e,i)=>{const s=""===i?"":`with ${i.trim()}() `,n=xt.bind(null,s,e.toString());Object.defineProperty(n,"name",Et);const{writable:o,enumerable:r,configurable:a}=At;Object.defineProperty(t,"toString",{value:n,writable:o,enumerable:r,configurable:a})})(t,e,s),t}const Ct=(t,e={})=>{if("function"!=typeof t)throw new TypeError(`Expected the first argument to be a function, got \`${typeof t}\``);const{wait:i=0,maxWait:s=Number.POSITIVE_INFINITY,before:n=!1,after:o=!0}=e;if(i<0||s<0)throw new RangeError("`wait` and `maxWait` must not be negative.");if(!n&&!o)throw new Error("Both `before` and `after` are false, function wouldn't be called.");let r,a,c;const l=function(...e){const l=this,h=()=>{a=void 0,r&&(clearTimeout(r),r=void 0),o&&(c=t.apply(l,e))},d=n&&!r;return clearTimeout(r),r=setTimeout(()=>{r=void 0,a&&(clearTimeout(a),a=void 0),o&&(c=t.apply(l,e))},i),s>0&&s!==Number.POSITIVE_INFINITY&&!a&&(a=setTimeout(h,s)),d&&(c=t.apply(l,e)),c};return St(l,t),l.cancel=()=>{r&&(clearTimeout(r),r=void 0),a&&(clearTimeout(a),a=void 0)},l};function kt(t,{decimals:e=1,fallback:i="N/A"}={}){if(null===t||""===t||["boolean","undefined"].includes(typeof t))return i;const s=Number(t);return Number.isNaN(s)?i:s.toFixed(e)}function Ot({header:t,toggleEntityChanged:e,entity:i,openEntityPopover:s}){if(!1===t)return B;const n=i.attributes.hvac_action||i.state;let o=t.icon;"object"==typeof t.icon&&(o=o?.[n]??!1);const r=t?.name??!1;return F`
    <header>
      <div
        class="clickable header__clickable"
        @click=${()=>s()}
      >
        ${function(t){return t?F` <ha-icon class="header__icon" .icon=${t}></ha-icon> `:B}(o)} ${function(t){return t?F`<h2 class="header__title">${t}</h2>`:B}(r)}
      </div>
      ${function(t,e){if(!t?.length)return B;const i=t.map(({icon:t,hide_inactive:i,state:s})=>F` <ha-icon
      class="fault-icon ${"on"===s?.state?"active":i?"hide":""}"
      .icon=${t||s?.attributes?.icon}
      @click="${()=>e(s?.entity_id)}"
    ></ha-icon>`);return F` <div class="faults">${i}</div>`}(t.faults,s)}
      ${function(t,e,i){return t?F`
    <div class="header__toggle">
      <span
        class="clickable toggle-label"
        @click=${()=>e(t.entity.entity_id)}
        >${t.label}
      </span>
      <ha-switch
        .checked=${"on"===t.entity?.state}
        @change=${i}
      ></ha-switch>
    </div>
  `:B}(t.toggle,s,e)}
    </header>
  `}var Tt,Pt={exports:{}};function zt(){return Tt||(Tt=1,function(t){function e(t){var i,s,n=new Error(t);return i=n,s=e.prototype,Object.setPrototypeOf?Object.setPrototypeOf(i,s):i.__proto__=s,n}function i(t,i,s){var n=i.slice(0,s).split(/\n/),o=n.length,r=n[o-1].length+1;throw e(t+=" at line "+o+" col "+r+":\n\n  "+i.split(/\n/)[o-1]+"\n  "+Array(r).join(" ")+"^")}e.prototype=Object.create(Error.prototype,{name:{value:"Squirrelly Error",enumerable:!1}});var s=new Function("return this")().Promise,n=!1;try{n=new Function("return (async function(){}).constructor")()}catch(t){if(!(t instanceof SyntaxError))throw t}function o(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function r(t,e,i){for(var s in e)o(e,s)&&(null==e[s]||"object"!=typeof e[s]||"storage"!==s&&"prefixes"!==s||i?t[s]=e[s]:t[s]=r({},e[s]));return t}var a=/^async +/,c=/`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g,l=/'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g,h=/"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g,d=/[.*+\-?^${}()|[\]\\]/g;function u(t){return d.test(t)?t.replace(d,"\\$&"):t}function p(t,s){s.rmWhitespace&&(t=t.replace(/[\r\n]+/g,"\n").replace(/^\s+|\s+$/gm,"")),c.lastIndex=0,l.lastIndex=0,h.lastIndex=0;var n=s.prefixes,o=[n.h,n.b,n.i,n.r,n.c,n.e].reduce(function(t,e){return t&&e?t+"|"+u(e):e?u(e):t},""),r=new RegExp("([|()]|=>)|('|\"|`|\\/\\*)|\\s*((\\/)?(-|_)?"+u(s.tags[1])+")","g"),d=new RegExp("([^]*?)"+u(s.tags[0])+"(-|_)?\\s*("+o+")?\\s*","g"),p=0,f=!1;function g(e,n){var o,u={f:[]},g=0,m="c";function v(e){var n=t.slice(p,e),o=n.trim();if("f"===m)"safe"===o?u.raw=!0:s.async&&a.test(o)?(o=o.replace(a,""),u.f.push([o,"",!0])):u.f.push([o,""]);else if("fp"===m)u.f[u.f.length-1][1]+=o;else if("err"===m){if(o){var r=n.search(/\S/);i("invalid syntax",t,p+r)}}else u[m]=o;p=e+1}for("h"===n||"b"===n||"c"===n?m="n":"r"===n&&(u.raw=!0,n="i"),r.lastIndex=p;null!==(o=r.exec(t));){var y=o[1],$=o[2],_=o[3],b=o[4],w=o[5],x=o.index;if(y)"("===y?(0===g&&("n"===m?(v(x),m="p"):"f"===m&&(v(x),m="fp")),g++):")"===y?0===--g&&"c"!==m&&(v(x),m="err"):0===g&&"|"===y?(v(x),m="f"):"=>"===y&&(v(x),p+=1,m="res");else if($)if("/*"===$){var A=t.indexOf("*/",r.lastIndex);-1===A&&i("unclosed comment",t,o.index),r.lastIndex=A+2}else"'"===$?(l.lastIndex=o.index,l.exec(t)?r.lastIndex=l.lastIndex:i("unclosed string",t,o.index)):'"'===$?(h.lastIndex=o.index,h.exec(t)?r.lastIndex=h.lastIndex:i("unclosed string",t,o.index)):"`"===$&&(c.lastIndex=o.index,c.exec(t)?r.lastIndex=c.lastIndex:i("unclosed string",t,o.index));else if(_)return v(x),p=x+o[0].length,d.lastIndex=p,f=w,b&&"h"===n&&(n="s"),u.t=n,u}return i("unclosed tag",t,e),u}var m=function o(r,c){r.b=[],r.d=[];var l,h=!1,u=[];function m(t,e){t&&(t=function(t,e,i,s){var n,o;return"string"==typeof e.autoTrim?n=o=e.autoTrim:Array.isArray(e.autoTrim)&&(n=e.autoTrim[1],o=e.autoTrim[0]),(i||!1===i)&&(n=i),(s||!1===s)&&(o=s),"slurp"===n&&"slurp"===o?t.trim():("_"===n||"slurp"===n?t=String.prototype.trimLeft?t.trimLeft():t.replace(/^[\s\uFEFF\xA0]+/,""):"-"!==n&&"nl"!==n||(t=t.replace(/^(?:\n|\r|\r\n)/,"")),"_"===o||"slurp"===o?t=String.prototype.trimRight?t.trimRight():t.replace(/[\s\uFEFF\xA0]+$/,""):"-"!==o&&"nl"!==o||(t=t.replace(/(?:\n|\r|\r\n)$/,"")),t)}(t,s,f,e))&&(t=t.replace(/\\|'/g,"\\$&").replace(/\r\n|\n|\r/g,"\\n"),u.push(t))}for(;null!==(l=d.exec(t));){var v,y=l[1],$=l[2],_=l[3]||"";for(var b in n)if(n[b]===_){v=b;break}m(y,$),p=l.index+l[0].length,v||i("unrecognized tag type: "+_,t,p);var w=g(l.index,v),x=w.t;if("h"===x){var A=w.n||"";s.async&&a.test(A)&&(w.a=!0,w.n=A.replace(a,"")),w=o(w),u.push(w)}else if("c"===x){if(r.n===w.n)return h?(h.d=u,r.b.push(h)):r.d=u,r;i("Helper start and end don't match",t,l.index+l[0].length)}else if("b"===x){h?(h.d=u,r.b.push(h)):r.d=u;var E=w.n||"";s.async&&a.test(E)&&(w.a=!0,w.n=E.replace(a,"")),h=w,u=[]}else if("s"===x){var S=w.n||"";s.async&&a.test(S)&&(w.a=!0,w.n=S.replace(a,"")),u.push(w)}else u.push(w)}if(!c)throw e('unclosed helper "'+r.n+'"');return m(t.slice(p,t.length),!1),r.d=u,r}({f:[]},!0);if(s.plugins)for(var v=0;v<s.plugins.length;v++){var y=s.plugins[v];y.processAST&&(m.d=y.processAST(m.d,s))}return m.d}function f(t,e){var i=p(t,e),s="var tR='';"+(e.useWith?"with("+e.varName+"||{}){":"")+$(i,e)+"if(cb){cb(null,tR)} return tR"+(e.useWith?"}":"");if(e.plugins)for(var n=0;n<e.plugins.length;n++){var o=e.plugins[n];o.processFnString&&(s=o.processFnString(s,e))}return s}function g(t,e){for(var i=0;i<e.length;i++){var s=e[i][0],n=e[i][1];t=(e[i][2]?"await ":"")+"c.l('F','"+s+"')("+t,n&&(t+=","+n),t+=")"}return t}function m(t,e,i,s,n,o){var r="{exec:"+(n?"async ":"")+y(i,e,t)+",params:["+s+"]";return o&&(r+=",name:'"+o+"'"),n&&(r+=",async:true"),r+"}"}function v(t,e){for(var i="[",s=0;s<t.length;s++){var n=t[s];i+=m(e,n.res||"",n.d,n.p||"",n.a,n.n),s<t.length&&(i+=",")}return i+"]"}function y(t,e,i){return"function("+e+"){var tR='';"+$(t,i)+"return tR}"}function $(t,e){for(var i=0,s=t.length,n="";i<s;i++){var o=t[i];if("string"==typeof o)n+="tR+='"+o+"';";else{var r=o.t,a=o.c||"",c=o.f,l=o.n||"",h=o.p||"",d=o.res||"",u=o.b,p=!!o.a;if("i"===r){e.defaultFilter&&(a="c.l('F','"+e.defaultFilter+"')("+a+")");var f=g(a,c);!o.raw&&e.autoEscape&&(f="c.l('F','e')("+f+")"),n+="tR+="+f+";"}else if("h"===r)if(e.storage.nativeHelpers.get(l))n+=e.storage.nativeHelpers.get(l)(o,e);else{var y=(p?"await ":"")+"c.l('H','"+l+"')("+m(e,d,o.d,h,p);y+=u?","+v(u,e):",[]",n+="tR+="+g(y+=",c)",c)+";"}else"s"===r?n+="tR+="+g((p?"await ":"")+"c.l('H','"+l+"')({params:["+h+"]},[],c)",c)+";":"e"===r&&(n+=a+"\n")}}return n}var _=function(){function t(t){this.cache=t}return t.prototype.define=function(t,e){this.cache[t]=e},t.prototype.get=function(t){return this.cache[t]},t.prototype.remove=function(t){delete this.cache[t]},t.prototype.reset=function(){this.cache={}},t.prototype.load=function(t){r(this.cache,t,!0)},t}();function b(t,i,s,n){if(i&&i.length>0)throw e((n?"Native":"")+"Helper '"+t+"' doesn't accept blocks");if(s&&s.length>0)throw e((n?"Native":"")+"Helper '"+t+"' doesn't accept filters")}var w={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function x(t){return w[t]}var A=new _({}),E=new _({each:function(t,e){var i="",s=t.params[0];if(b("each",e,!1),t.async)return new Promise(function(e){!function t(e,i,s,n,o){s(e[i],i).then(function(r){n+=r,i===e.length-1?o(n):t(e,i+1,s,n,o)})}(s,0,t.exec,i,e)});for(var n=0;n<s.length;n++)i+=t.exec(s[n],n);return i},foreach:function(t,e){var i=t.params[0];if(b("foreach",e,!1),t.async)return new Promise(function(e){!function t(e,i,s,n,o,r){n(i[s],e[i[s]]).then(function(a){o+=a,s===i.length-1?r(o):t(e,i,s+1,n,o,r)})}(i,Object.keys(i),0,t.exec,"",e)});var s="";for(var n in i)o(i,n)&&(s+=t.exec(n,i[n]));return s},include:function(t,i,s){b("include",i,!1);var n=s.storage.templates.get(t.params[0]);if(!n)throw e('Could not fetch template "'+t.params[0]+'"');return n(t.params[1],s)},extends:function(t,i,s){var n=t.params[1]||{};n.content=t.exec();for(var o=0;o<i.length;o++){var r=i[o];n[r.name]=r.exec()}var a=s.storage.templates.get(t.params[0]);if(!a)throw e('Could not fetch template "'+t.params[0]+'"');return a(n,s)},useScope:function(t,e){return b("useScope",e,!1),t.exec(t.params[0])}}),S=new _({if:function(t,e){b("if",!1,t.f,!0);var i="if("+t.p+"){"+$(t.d,e)+"}";if(t.b)for(var s=0;s<t.b.length;s++){var n=t.b[s];"else"===n.n?i+="else{"+$(n.d,e)+"}":"elif"===n.n&&(i+="else if("+n.p+"){"+$(n.d,e)+"}")}return i},try:function(t,i){if(b("try",!1,t.f,!0),!t.b||1!==t.b.length||"catch"!==t.b[0].n)throw e("native helper 'try' only accepts 1 block, 'catch'");var s="try{"+$(t.d,i)+"}",n=t.b[0];return s+"catch"+(n.res?"("+n.res+")":"")+"{"+$(n.d,i)+"}"},block:function(t,e){return b("block",t.b,t.f,!0),"if(!"+e.varName+"["+t.p+"]){tR+=("+y(t.d,"",e)+")()}else{tR+="+e.varName+"["+t.p+"]}"}}),C=new _({e:function(t){var e=String(t);return/[&<>"']/.test(e)?e.replace(/[&<>"']/g,x):e}}),k={varName:"it",autoTrim:[!1,"nl"],autoEscape:!0,defaultFilter:!1,tags:["{{","}}"],l:function(t,i){if("H"===t){var s=this.storage.helpers.get(i);if(s)return s;throw e("Can't find helper '"+i+"'")}if("F"===t){var n=this.storage.filters.get(i);if(n)return n;throw e("Can't find filter '"+i+"'")}},async:!1,storage:{helpers:E,nativeHelpers:S,filters:C,templates:A},prefixes:{h:"@",b:"#",i:"",r:"*",c:"/",e:"!"},cache:!1,plugins:[],useWith:!1};function O(t,e){var i={};return r(i,k),e&&r(i,e),t&&r(i,t),i.l.bind(i),i}function T(t,i){var s=O(i||{}),o=Function;if(s.async){if(!n)throw e("This environment doesn't support async/await");o=n}try{return new o(s.varName,"c","cb",f(t,s))}catch(i){throw i instanceof SyntaxError?e("Bad template syntax\n\n"+i.message+"\n"+Array(i.message.length+1).join("=")+"\n"+f(t,s)):i}}function P(t,e){var i;return e.cache&&e.name&&e.storage.templates.get(e.name)?e.storage.templates.get(e.name):(i="function"==typeof t?t:T(t,e),e.cache&&e.name&&e.storage.templates.define(e.name,i),i)}k.l.bind(k),t.compile=T,t.compileScope=$,t.compileScopeIntoFunction=y,t.compileToString=f,t.defaultConfig=k,t.filters=C,t.getConfig=O,t.helpers=E,t.nativeHelpers=S,t.parse=p,t.render=function(t,i,n,o){var r=O(n||{});if(!r.async)return P(t,r)(i,r);if(!o){if("function"==typeof s)return new s(function(e,s){try{e(P(t,r)(i,r))}catch(t){s(t)}});throw e("Please provide a callback function, this env doesn't support Promises")}try{P(t,r)(i,r,o)}catch(t){return o(t)}},t.templates=A,Object.defineProperty(t,"__esModule",{value:!0})}(Pt.exports)),Pt.exports}var Nt=zt();const jt=2;class Rt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}class Ut extends Rt{constructor(t){if(super(t),this.it=B,t.type!==jt)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===B||null==t)return this._t=void 0,this.it=t;if(t===L)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}}Ut.directiveName="unsafeHTML",Ut.resultType=1;const Ht=(t=>(...e)=>({_$litDirective$:t,values:e}))(Ut),It=t=>`<ha-icon icon="${t}"></ha-icon>`;function Vt(t,e){const i=t?.layout?.sensors?.type??"table";return F` <div class="sensors ${[t?.layout?.sensors?.labels??!0?"with-labels":"without-labels","list"===i?"as-list":"as-table"].join(" ")}">${e}</div> `}function Mt({hide:t=!1,hass:e,state:i,details:s,localize:n,openEntityPopover:o}){if(t||void 0===i)return;const{type:r,heading:a,icon:c,unit:l,decimals:h}=s;let d;if(process.env.DEBUG&&console.log("ST: infoItem",{state:i,details:s}),"relativetime"===r)d=F`
      <div class="sensor-value">
        <ha-relative-time .datetime=${i} .hass=${e}></ha-relative-time>
      </div>
    `;else if("object"==typeof i){const[t]=i.entity_id.split("."),s=["component",t,"state",i.attributes?.device_class??"_",""].join("."),r=e.formatEntityState?.(i);let a=r??n?.(i.state,s)??i.state;r||"number"!=typeof h||(a=kt(a,{decimals:h})),d=F`
      <div
        class="sensor-value clickable"
        @click="${()=>o?.(i.entity_id)}"
      >
        ${a} ${l||i.attributes?.unit_of_measurement||""}
      </div>
    `}else{let t="number"==typeof h?kt(i,{decimals:h}):i;d=F` <div class="sensor-value">${t}${l}</div> `}if(!1===a)return d;const u=c?F` <ha-icon .icon=${c}></ha-icon> `:F` ${a}: `;return F`
    <div class="sensor-heading">${u}</div>
    ${d}
  `}var Dt;function Ft({state:t,mode:e,modeOptions:i,localize:s,setMode:n}){const{type:o,hide_when_off:r,mode:a="none",list:c,name:l}=e;if(0===c.length||r&&t===Dt.OFF)return null;const h=l||s(`ui.card.climate.${"hvac"===o?"operation":`${o}_mode`}`),d=i?.headings??!0;return F`
    <div class="modes ${d?"heading":""}" role="group" aria-label=${h}>
      ${d?F` <div class="mode-title">${h}</div> `:""}
      ${c.map(({value:t,icon:e,name:r})=>F`
          <div
            class="mode-item ${t===a?"active "+a:""}"
            role="button"
            tabindex="0"
            aria-pressed=${t===a?"true":"false"}
            aria-label=${r||t}
            @click=${()=>n(o,t)}
            @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),n(o,t))}}
          >
            ${(t=>t?!1===i?.icons?null:F` <ha-icon class="mode-icon" .icon=${t}></ha-icon> `:null)(e)} ${(t=>!1===t||!1===i?.names?null:"hvac"===o?s(t,"component.climate.state._."):s(t,`component.climate.entity_component._.state_attributes.${o}_mode.state.`)||s(t,`state_attributes.climate.${o}_mode.`))(r)}
          </div>
        `)}
    </div>
  `}Nt.defaultConfig.autoEscape=!1,Nt.filters.define("icon",It),Nt.filters.define("join",(t,e=", ")=>t.join(e)),Nt.filters.define("css",(t,e)=>`<span style="${Object.entries(e).reduce((t,[e,i])=>`${t}${e}:${i};`,"")}">${t}</span>`),Nt.filters.define("debug",t=>{try{return JSON.stringify(t)}catch{return`Not able to read valid JSON object from: ${t}`}}),function(t){t.OFF="off",t.HEAT="heat",t.COOL="cool",t.HEAT_COOL="heat_cool",t.AUTO="auto",t.DRY="dry",t.FAN_ONLY="fan_only"}(Dt||(Dt={}));const Lt={auto:"mdi:radiator",cooling:"mdi:snowflake",fan:"mdi:fan",heating:"mdi:radiator",idle:"mdi:radiator-disabled",off:"mdi:radiator-off"},Bt={auto:"hass:autorenew",cool:"hass:snowflake",dry:"hass:water-percent",fan_only:"hass:fan",heat_cool:"hass:autorenew",heat:"hass:fire",off:"hass:power"};function Wt(t,e){const i=e.states[t.entity];if(!i)return null;let s="";return s=!0===t?.name?i.attributes.friendly_name:t?.name??"",{entity:i,label:s}}function qt(t,e){return Array.isArray(t)?t.filter(({entity:t})=>Boolean(e.states?.[t])).map(({entity:t,...i})=>({...i,state:e.states[t],entity:t})):[]}const Jt="dual";function Yt(t,e){return!1===t?{}:t?Object.entries(t).reduce((t,[i,s])=>(s?.hide||(t[i]=e?.[i]),t),{}):function(t){return"number"==typeof t.target_temp_high&&"number"==typeof t.target_temp_low?Jt:"single"}(e)===Jt?{target_temp_low:e.target_temp_low,target_temp_high:e.target_temp_high}:{temperature:e.temperature}}var Gt;!function(t){t.HVAC="hvac",t.FAN="fan",t.PRESET="preset",t.SWING="swing"}(Gt||(Gt={}));const Kt=Object.values(Gt),Zt=[Gt.HVAC,Gt.PRESET],Qt="hass:chevron-up",Xt="hass:chevron-down",te="mdi:plus",ee="mdi:minus",ie={temperature:!1,state:!1};function se(t,e,i={}){return e[`${t}_modes`].filter(t=>function(t,e){if("object"==typeof e[t])return!1!==e[t].include;return e?.[t]??!0}(t,i)).map(t=>{const e="object"==typeof i[t]?i[t]:{};return{icon:Bt[t],value:t,name:t,...e}})}class ne extends rt{constructor(){super(...arguments),this.modes=[],this._hass={},this.sensors=[],this.showSensors=!0,this.stepSize=.5,this._values={},this._updatingValues=!1,this._hide=ie,this._updatingValuesTimeout=null,this._needsRecompute=!0,this._debouncedSetTemperature=Ct(t=>{const{domain:e,service:i,data:s={}}=this.service;this._callAction(`${e}.${i}`,{entity_id:this.config.entity,...s,...t})},{wait:500}),this.localize=(t,e="")=>{const i=`${e}${t}`;return this._hass.localize(i)||t},this.toggleEntityChanged=t=>{if(!this.header?.toggle)return;const e=t.target;this._callAction(e.checked?"homeassistant.turn_on":"homeassistant.turn_off",{entity_id:this.header?.toggle?.entity?.entity_id})},this.setMode=(t,e)=>{t&&e?(this._callAction(`climate.set_${t}_mode`,{entity_id:this.config.entity,[`${t}_mode`]:e}),lt(this,"haptic","light")):lt(this,"haptic","failure")},this.openEntityPopover=(t=null)=>{lt(this,"hass-more-info",{entityId:t||this.config.entity})}}static get styles(){return ct}_callAction(t,e){if(this._hass.performAction)this._hass.performAction({action:t,data:e});else{const[i,s]=t.split(".");this._hass.callService(i,s,e)}}static getConfigElement(){return window.document.createElement(`${t}-editor`)}static getStubConfig(t){return{entity:Object.keys(t.states).find(t=>t.startsWith("climate."))??"climate.my_thermostat"}}setConfig(t){if(!t?.entity)throw new Error("simple-thermostat: entity is required");this.config={decimals:1,...t},this.service=function(t){return t||{domain:"climate",service:"set_temperature"}}(this.config.service??!1),this._needsRecompute=!0}disconnectedCallback(){super.disconnectedCallback(),this._updatingValuesTimeout&&(clearTimeout(this._updatingValuesTimeout),this._updatingValuesTimeout=null),this._debouncedSetTemperature?.cancel?.()}updated(t){super.updated(t);const e=Array.from(this.renderRoot.querySelectorAll("[with-hass]"));for(const t of Array.from(e))Array.from(t.attributes).forEach(e=>{e.name.startsWith("fwd-")&&(t[e.name.replace("fwd-","")]=e.value)}),t.hass=this._hass}set hass(t){if(!this.config?.entity||!t?.states)return;this._hass=t;const e=t.states[this.config.entity];if(!e)return void(void 0!==this.entity&&(this.entity=void 0));if(this.entity===e&&!this._needsRecompute)return;this._needsRecompute=!1,this.entity=e,this.header=function(t,e,i){if(!1===t)return!1;let s;s="string"==typeof t?.name?t.name:!1!==t?.name&&e.attributes.friendly_name;let n=e.attributes.hvac_action?Lt:Bt;return void 0!==t?.icon&&(n=t.icon),{name:s,icon:n,toggle:t?.toggle?Wt(t.toggle,i):null,faults:qt(t?.faults,i)}}(this.config.header,e,t);const i=e.attributes;let s=Yt(this.config.setpoints,i);this._updatingValues&&function(t,e){const i=Object.keys(t);return i.length===Object.keys(e).length&&!i.some(i=>t?.[i]!==e?.[i])}(s,this._values)?(this._updatingValues=!1,this._updatingValuesTimeout&&(clearTimeout(this._updatingValuesTimeout),this._updatingValuesTimeout=null)):this._updatingValues||(this._values=s);const n=t=>Kt.includes(t)&&i[`${t}_modes`],o=t=>t.filter(n).map(t=>({type:t,hide_when_off:!1,list:se(t,i)}));let r=[];if(!1===this.config.control)r=[];else if(Array.isArray(this.config.control))r=o(this.config.control);else if("object"==typeof this.config.control){const t=Object.entries(this.config.control);r=t.length>0?t.filter(([t])=>n(t)).map(([t,e])=>{const{_name:s,_hide_when_off:n,...o}=e;return{type:t,hide_when_off:n,name:s,list:se(t,i,o)}}):o(Zt)}else r=o(Zt);if(this.modes=r.map(t=>{if(t.type===Gt.HVAC){const i=Object.values(Dt),s=[],n=[];return t.list.forEach(t=>{const e=i.indexOf(t.value);e>=0?s[e]=t:n.push(t)}),{...t,list:[...s.filter(Boolean),...n],mode:e.state}}const s=i[`${t.type}_mode`];return{...t,mode:s}}),this.config.step_size&&(this.stepSize=+this.config.step_size),this._hide={...ie,...this.config.hide},!1===this.config.sensors)this.showSensors=!1;else if(3===this.config.version){this.sensors=[];const t=this.config.sensors??[],i=this.config.entity,s=t.map((t,s)=>{const n=t?.entity??i;let o=e;return t?.entity&&(o=this._hass.states[t.entity]),{id:t?.id??String(s),label:t?.label,template:t.template,show:!1!==t?.show,entityId:n,context:o}}),n=s.map(t=>t.id),o=[];n.includes("state")||o.push({id:"state",label:"{{ui.operation}}",template:"{{state.text}}",entityId:i,context:e}),n.includes("temperature")||o.push({id:"temperature",label:"{{ui.currently}}",template:"{{current_temperature|formatNumber}}",entityId:i,context:e}),this.sensors=[...o,...s]}else this.config.sensors&&(this.sensors=this.config.sensors.map(({name:e,entity:s,attribute:n,unit:o="",...r})=>{let a;const c=[e];return s?(a=t.states[s],c.push(a?.attributes?.friendly_name),n&&(a=a?.attributes?.[n])):n&&n in i&&(a=i[n],c.push(n)),c.push(s),{...r,name:c.find(t=>!!t),state:a,entity:s,unit:o}}))}render({_hide:t,_values:e,_updatingValues:i,config:s,entity:n}=this){const o=[];if(this.stepSize<1&&0===this.config.decimals&&o.push(F`
        <ha-alert alert-type="warning">
          Decimals is set to 0 and step_size is lower than 1. Decrementing a
          setpoint will likely not work. Change one of the settings to clear
          this warning.
        </ha-alert>
      `),!n)return F`
        <ha-alert alert-type="error">
          Entity not available: ${s.entity}
        </ha-alert>
      `;const{attributes:{min_temp:r=null,max_temp:a=null,hvac_action:c}}=n,l=this.getUnit(),h=this.config?.layout?.step??"column",d="row"===h,u=[!this.header&&"no-header",c].filter(t=>!!t);let p;return 3===this.config.version?(p=this.sensors.filter(t=>!1!==t.show).map(t=>function({context:t,entityId:e,template:i="{{state.text}}",label:s,hass:n,variables:o={},config:r,localize:a,openEntityPopover:c}){if(!t)return null;const{state:l,attributes:h}=t,[d]=e.split("."),u=Object.fromEntries(["currently","operation","fan_mode","swing_mode","preset_mode","humidity"].map(t=>[t,n.localize?.(`ui.card.climate.${t}`)??t])),p={...h,state:{raw:l,text:a(l,`component.${d}.state._.`)},ui:u,v:o};Nt.filters.define("formatNumber",(t,e={decimals:r.decimals})=>String(kt(t,e))),Nt.filters.define("relativetime",t=>`<ha-relative-time fwd-datetime=${t} with-hass></ha-relative-time>`),Nt.filters.define("translate",(t,e="")=>a(t,e||"climate"!==d&&"humidifier"!==d?e:`state_attributes.${d}.${t}`));const f=t=>{try{return Nt.render(t,p,{useWith:!0})}catch{return`[template error: ${t}]`}},g=f(i);if(!1===s||!1===r?.layout?.sensors?.labels)return F`<div class="sensor-value">${Ht(g)}</div>`;const m=s||"{{friendly_name}}",v=m.match(/^(mdi|hass):.*/)?It(m):f(m);return F`
    <div class="sensor-heading">${Ht(v)}</div>
    <div class="sensor-value">${Ht(g)}</div>
  `}({...t,variables:this.config.variables,hass:this._hass,config:this.config,localize:this.localize,openEntityPopover:this.openEntityPopover})),p=Vt(this.config,p)):p=this.showSensors?function({_hide:t,entity:e,unit:i,hass:s,sensors:n,config:o,localize:r,openEntityPopover:a}){const{state:c,attributes:{hvac_action:l,current_temperature:h}}=e,d=o?.layout?.sensors?.labels??!0;let u=s.formatEntityState?.(e)??r(c,"component.climate.state._.");l&&(u=[r(l,"component.climate.entity_component._.state_attributes.hvac_action.state.")||r(l,"state_attributes.climate.hvac_action."),` (${u})`].join(""));const p=[Mt({hide:t.temperature,state:`${kt(h,o)}${i||""}`,hass:s,details:{heading:!!d&&(o?.label?.temperature??r("ui.card.climate.currently"))}}),Mt({hide:t.state,state:u,hass:s,details:{heading:!!d&&(o?.label?.state??r("ui.panel.lovelace.editor.card.generic.state"))}}),...n.map(({name:t,state:e,...i})=>Mt({state:e,hass:s,localize:r,openEntityPopover:a,details:{...i,heading:d&&t}}))].filter(Boolean);return Vt(o,p)}({_hide:t,unit:l,hass:this._hass,entity:n,sensors:this.sensors,config:this.config,localize:this.localize,openEntityPopover:this.openEntityPopover}):"",F`
      <ha-card class="${u.join(" ")}">
        ${this.config.styles?F`<style>
              ${this.config.styles}
            </style>`:B}
        ${o}
        ${Ot({header:this.header,toggleEntityChanged:this.toggleEntityChanged,entity:n,openEntityPopover:this.openEntityPopover})}
        <section class="body">
          ${p}
          ${Object.entries(e).map(([t,e])=>{const n=["string","number"].includes(typeof e),o=!1!==l&&n;return F`
              <div class="current-wrapper ${h}">
                <ha-icon-button
                  ?disabled=${null!==a&&e>=a}
                  class="thermostat-trigger"
                  aria-label="Increase ${t}"
                  .label=${`Increase ${t}`}
                  @click="${()=>this.setTemperature(this.stepSize,t)}"
                >
                  <ha-icon .icon=${d?te:Qt}></ha-icon>
                </ha-icon-button>

                <h3
                  @click=${()=>this.openEntityPopover()}
                  @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this.openEntityPopover())}}
                  role="button"
                  tabindex="0"
                  aria-label=${`${t}: ${kt(e,s)}${o?` ${l}`:""}`}
                  class=${i?"current--value updating":"current--value"}
                >
                  ${kt(e,s)}
                  ${o?F`<span class="current--unit">${l}</span>`:B}
                </h3>
                <ha-icon-button
                  ?disabled=${null!==r&&e<=r}
                  class="thermostat-trigger"
                  aria-label="Decrease ${t}"
                  .label=${`Decrease ${t}`}
                  @click="${()=>this.setTemperature(-this.stepSize,t)}"
                >
                  <ha-icon .icon=${d?ee:Xt}></ha-icon>
                </ha-icon-button>
              </div>
            `})}
        </section>

        ${this.modes.map(t=>Ft({state:n.state,mode:t,localize:this.localize,modeOptions:this.config?.layout?.mode??{},setMode:this.setMode}))}
      </ha-card>
    `}setTemperature(t,e){this._updatingValues=!0,this._updatingValuesTimeout&&clearTimeout(this._updatingValuesTimeout),this._updatingValuesTimeout=setTimeout(()=>{this._updatingValues=!1,this._updatingValuesTimeout=null},1e4);const i=this._values[e],s=Number(i)+t,{decimals:n}=this.config;this._values={...this._values,[e]:+kt(s,{decimals:n})},this._debouncedSetTemperature(this._values)}getCardSize(){let t=2;return!1!==this.config?.header&&(t+=1),!1!==this.config?.control&&(t+=1),t}getLayoutOptions(){return{grid_columns:2,grid_rows:2+(!1!==this.config?.header?1:0)+(!1!==this.config?.control?1:0),grid_min_rows:2,grid_max_rows:5}}getUnit(){return void 0!==this.config.unit?this.config.unit:this._hass.config?.unit_system?.temperature??!1}}vt([_t()],ne.prototype,"config",void 0),vt([_t()],ne.prototype,"header",void 0),vt([_t()],ne.prototype,"service",void 0),vt([_t()],ne.prototype,"modes",void 0),vt([_t()],ne.prototype,"entity",void 0),vt([_t()],ne.prototype,"sensors",void 0),vt([_t()],ne.prototype,"showSensors",void 0),vt([_t()],ne.prototype,"_values",void 0),vt([_t()],ne.prototype,"_updatingValues",void 0),vt([_t()],ne.prototype,"_hide",void 0),customElements.define(t,ne),customElements.define(`${t}-editor`,class extends rt{static get styles(){return ct}static get properties(){return{hass:{},config:{}}}setConfig(t){this.config=t||mt(gt)}_openLink(){window.open("https://github.com/duczz/simple-thermostat/blob/master/README.md")}render(){return this.hass?F`
      <div class="card-config">
        <div class="overall-config">
          <div class="side-by-side">
            <ha-entity-picker
              label="Entity (required)"
              .hass=${this.hass}
              .value="${this.config.entity}"
              .configValue=${"entity"}
              .includeDomains=${ft}
              @change="${this.valueChanged}"
              allow-custom-entity
            ></ha-entity-picker>
          </div>

          <ha-formfield label="Show header?">
            <ha-switch
              .checked=${!1!==this.config.header}
              @change=${this.toggleHeader}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield label="Show mode names?">
            <ha-switch
              .checked=${!1!==this.config?.layout?.mode?.names}
              .configValue="${"layout.mode.names"}"
              @change=${this.valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield label="Show mode icons?">
            <ha-switch
              .checked=${!1!==this.config?.layout?.mode?.icons}
              .configValue="${"layout.mode.icons"}"
              @change=${this.valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield label="Show mode headings?">
            <ha-switch
              .checked=${!1!==this.config?.layout?.mode?.headings}
              .configValue="${"layout.mode.headings"}"
              @change=${this.valueChanged}
            ></ha-switch>
          </ha-formfield>

          ${!1!==this.config.header?F`
                <div class="side-by-side">
                  <ha-textfield
                    label="Name (optional)"
                    .value="${this.config.header?.name??""}"
                    .configValue="${"header.name"}"
                    @change="${this.valueChanged}"
                  ></ha-textfield>

                  <ha-icon-picker
                    label="Icon (optional)"
                    .value="${this.config.header?.icon??""}"
                    .configValue=${"header.icon"}
                    @value-changed=${this.valueChanged}
                  ></ha-icon-picker>
                </div>

                <div class="side-by-side">
                  <ha-entity-picker
                    label="Toggle Entity (optional)"
                    .hass=${this.hass}
                    .value="${this.config?.header?.toggle?.entity}"
                    .configValue=${"header.toggle.entity"}
                    @change="${this.valueChanged}"
                    allow-custom-entity
                  ></ha-entity-picker>

                  <ha-textfield
                    label="Toggle entity label"
                    .value="${this.config?.header?.toggle?.name??""}"
                    .configValue="${"header.toggle.name"}"
                    @change="${this.valueChanged}"
                  ></ha-textfield>
                </div>
              `:""}

          <div class="side-by-side">
            <ha-textfield
              label="Fallback Text (optional)"
              .value="${this.config.fallback??""}"
              .configValue="${"fallback"}"
              @change="${this.valueChanged}"
            ></ha-textfield>
          </div>

          <div class="side-by-side">
            <ha-select
              label="Decimals (optional)"
              .configValue=${"decimals"}
              .value=${String(this.config.decimals??1)}
              @value-changed="${this.valueChanged}"
            >
              ${ht.map(t=>F`<mwc-list-item .value=${String(t)}
                    >${t}</mwc-list-item
                  >`)}
            </ha-select>

            <ha-textfield
              label="Unit (optional)"
              .value="${this.config.unit??""}"
              .configValue="${"unit"}"
              @change="${this.valueChanged}"
            ></ha-textfield>
          </div>

          <div class="side-by-side">
            <ha-select
              label="Step Layout (optional)"
              .configValue=${"layout.step"}
              .value=${this.config.layout?.step??"column"}
              @value-changed="${this.valueChanged}"
            >
              ${ut.map(t=>F`<mwc-list-item .value=${t}>${t}</mwc-list-item>`)}
            </ha-select>

            <ha-select
              label="Step Size (optional)"
              .configValue=${"step_size"}
              .value=${String(this.config.step_size??.5)}
              @value-changed="${this.valueChanged}"
            >
              ${dt.map(t=>F`<mwc-list-item .value=${String(t)}
                    >${t}</mwc-list-item
                  >`)}
            </ha-select>
          </div>

          <div class="side-by-side">
            <ha-button @click=${this._openLink}>
              Configuration Options
            </ha-button>

            Settings for label, control, sensors, faults and hiding UI elements
            can only be configured in the code editor
          </div>

          <div class="styles-editor">
            <label class="styles-label">Custom CSS</label>
            <p class="styles-hint">
              Applied directly to the card. Use CSS custom properties
              (<code>--st-*</code>) or target any selector inside the card.
            </p>
            <ha-code-editor
              .value=${this.config.styles??""}
              .configValue=${"styles"}
              mode="css"
              autofocus="false"
              @value-changed=${this.valueChanged}
            ></ha-code-editor>
          </div>
        </div>
      </div>
    `:F``}valueChanged(t){if(!this.config||!this.hass)return;const{target:e}=t,i=mt(this.config);if(e.configValue){let s=void 0!==e.checked?e.checked:void 0!==t.detail?.value?t.detail.value:e.value;if(""===s||void 0===s)!function(t,e){const i=e.split(".");let s=t;for(;i.length>1;){const t=i.shift();if(!s[t])return;s=s[t]}delete s[i[0]]}(i,e.configValue);else{if("string"==typeof s&&pt.includes(e.configValue)){const t=Number(s);Number.isNaN(t)||(s=t)}!function(t,e,i){const s=e.split(".");let n=t;for(;s.length-1;){const t=s.shift();Object.hasOwn(n,t)||(n[t]={}),n=n[t]}n[s[0]]=i}(i,e.configValue,s)}}lt(this,"config-changed",{config:i})}toggleHeader(t){const e=mt(this.config);e.header=!!t.target.checked&&{},lt(this,"config-changed",{config:e})}}),console.info(`%c${t}: 2.3.0`,"font-weight: bold"),window.customCards=window.customCards||[],window.customCards.push({type:t,name:"Simple Thermostat",preview:!1,description:"A different take on the thermostat card",documentationURL:"https://github.com/duczz/simple-thermostat"});
