import {i18nCatalog} from './i18n-catalog.js';
export const i18nLocales=['zh-TW','en'];
export function i18nLocale(value){return typeof value==='string'&&/^en(?:-|$)/i.test(value)?'en':'zh-TW';}
export function i18nTranslate(key,params={},locale='zh-TW',report=()=>{}){
 const entry=i18nCatalog[key];
 if(!entry){report({kind:'key',key,locale});return key;}
 let value=entry[locale];
 if(typeof value!=='string'){report({kind:'translation',key,locale});value=entry['zh-TW'];}
 return value.replace(/\{([A-Za-z][\w]*)\}/g,(token,name)=>{
  if(!Object.prototype.hasOwnProperty.call(params,name)){report({kind:'parameter',key,locale,name});return token;}
  return String(params[name]);
 });
}
export function i18nRequestLocale(request){
 const url=new URL(request.url),explicit=url.searchParams.get('lang');
 if(i18nLocales.includes(explicit))return explicit;
 const cookie=request.headers.get('Cookie')?.match(/(?:^|;\s*)bear_atlas_locale=(zh-TW|en)(?:;|$)/)?.[1];
 if(cookie)return cookie;
 const accepted=(request.headers.get('Accept-Language')||'').split(',').map((part,index)=>{const [tag,...args]=part.trim().split(';');const q=Number(args.find(x=>x.trim().startsWith('q='))?.split('=')[1]??1);return {tag,q,index};}).filter(x=>x.q>0&&/^(en|zh)(-|$)/i.test(x.tag)).sort((a,b)=>b.q-a.q||a.index-b.index);
 return i18nLocale(accepted[0]?.tag);
}
// Explicit bindings only: never infer translations from player-written text or rewrite scene roots.
export function i18nClient(catalog){
 const manualKey='bear-atlas-language',supported=['zh-TW','en'],missing=new Map();
 const normalize=value=>/^en(?:-|$)/i.test(value||'')?'en':'zh-TW';
 let stored;try{stored=localStorage.getItem(manualKey);}catch{}
 const urlLanguage=new URL(location.href).searchParams.get('lang');
 let locale=supported.includes(urlLanguage)?urlLanguage:supported.includes(stored)?stored:document.cookie.match(/(?:^|;\s*)bear_atlas_locale=(zh-TW|en)(?:;|$)/)?.[1]||normalize(navigator.languages?.find(x=>/^(en|zh)(-|$)/i.test(x))||navigator.language);
 const report=entry=>{missing.set(JSON.stringify(entry),entry);};
 const t=(key,params={})=>{
  const entry=catalog[key];if(!entry){report({kind:'key',key,locale});return key;}
  let value=entry[locale];if(typeof value!=='string'){report({kind:'translation',key,locale});value=entry['zh-TW'];}
  return value.replace(/\{([A-Za-z][\w]*)\}/g,(token,name)=>{if(!Object.prototype.hasOwnProperty.call(params,name)){report({kind:'parameter',key,locale,name});return token;}return String(params[name]);});
 };
 const bind=root=>{
  const nodes=[...(root.nodeType===1?[root]:[]),...root.querySelectorAll('[data-i18n],[data-i18n-title],[data-i18n-aria-label],[data-i18n-placeholder]')];
  for(const node of nodes){
   if(node.closest('[translate="no"],[data-user-content]'))continue;
   let params={};try{params=JSON.parse(node.dataset.i18nParams||'{}');}catch{report({kind:'invalid-parameters',key:node.dataset.i18n,locale});}
   if(node.dataset.i18n){const value=t(node.dataset.i18n,params);if(node.textContent!==value)node.textContent=value;}
   for(const attr of ['title','aria-label','placeholder']){const key=node.getAttribute('data-i18n-'+attr);if(key){const value=t(key,params);if(node.getAttribute(attr)!==value)node.setAttribute(attr,value);}}
  }
 };
 const refresh=()=>{document.documentElement.lang=locale;bind(document);for(const button of document.querySelectorAll('[data-locale]'))button.setAttribute('aria-pressed',String(button.dataset.locale===locale));};
 const persist=()=>{try{localStorage.setItem(manualKey,locale);}catch{}document.cookie='bear_atlas_locale='+locale+'; Path=/; Max-Age=31536000; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');};
 const setLocale=value=>{if(!supported.includes(value))return;locale=value;persist();refresh();window.dispatchEvent(new CustomEvent('bear-locale-change',{detail:{locale}}));};
 document.addEventListener('click',event=>{const button=event.target.closest?.('[data-locale]');if(button){event.preventDefault();setLocale(button.dataset.locale);}});
 const observer=new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1)bind(node);});
 observer.observe(document.documentElement,{childList:true,subtree:true});
 window.BearI18n={t,setLocale,get locale(){return locale;},getMissing:()=>[...missing.values()],bind};
 if(supported.includes(urlLanguage))persist();refresh();
}
export function i18nRuntime(){return '('+i18nClient.toString()+')('+JSON.stringify(i18nCatalog).replace(/</g,'\\u003c')+');';}
