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
export function i18nClient(catalog,createTranslator){
 const manualKey='bear-atlas-language',supported=['zh-TW','en'],missing=new Map(),bindings=new WeakMap(),attrBindings=new WeakMap();
 const report=entry=>{if(missing.size<500)missing.set(JSON.stringify(entry),entry);};
 const legacy=createTranslator(catalog,report);
 let stored;try{stored=localStorage.getItem(manualKey);}catch{}
 const urlLanguage=new URL(location.href).searchParams.get('lang');
 const normalize=value=>/^en(?:-|$)/i.test(value||'')?'en':'zh-TW';
 let locale=supported.includes(urlLanguage)?urlLanguage:supported.includes(stored)?stored:document.cookie.match(/(?:^|;\s*)bear_atlas_locale=(zh-TW|en)(?:;|$)/)?.[1]||normalize(navigator.languages?.find(x=>/^(en|zh)(-|$)/i.test(x))||navigator.language);
 const t=(key,params={})=>{
  const entry=catalog[key];if(!entry){report({kind:'key',key,locale});return key;}
  let value=entry[locale];if(typeof value!=='string'){report({kind:'translation',key,locale});value=entry['zh-TW'];}
  return value.replace(/\{([A-Za-z][\w]*)\}/g,(token,name)=>{if(!Object.prototype.hasOwnProperty.call(params,name)){report({kind:'parameter',key,locale,name});return token;}return String(params[name]);});
 };
 const excluded=node=>node.closest?.('script,style,textarea,[translate="no"],[data-user-content],.idea-languages,[data-locale]');
 const translateProtected=source=>source.split(/(\uE000[^\uE001]*\uE001)/).map(part=>part.startsWith('\uE000')?part.slice(1,-1):legacy.text(part,locale).replace(locale==='en'?/^\s+(?='s\b)/:/^$/,'')).join('');
 function textNode(node){
  const parent=node.parentElement;if(!parent||excluded(parent)||parent.closest('[data-i18n]'))return;
  let entry=bindings.get(node);if(!entry||node.nodeValue!==entry.last){entry={source:parent.getAttribute('data-i18n-source-text')||legacy.source(node.nodeValue),last:node.nodeValue};bindings.set(node,entry);}
  if(parent.tagName==='OPTION'&&!parent.hasAttribute('value'))parent.setAttribute('value',parent.value);
  const value=translateProtected(entry.source);if(node.nodeValue!==value)node.nodeValue=value;entry.last=value;
 }
 function element(node){
  if(excluded(node))return;
  let params={};try{params=JSON.parse(node.dataset.i18nParams||'{}');}catch{report({kind:'invalid-parameters',key:node.dataset.i18n,locale});}
  if(node.dataset.i18n){const value=t(node.dataset.i18n,params);if(node.textContent!==value)node.textContent=value;}
  let entries=attrBindings.get(node);if(!entries){entries={};attrBindings.set(node,entries);}
  for(const attr of ['title','aria-label','placeholder','alt',...(node.matches('input[type="submit"],input[type="button"]')?['value']:[])]){
   const current=node.getAttribute(attr);if(current===null)continue;
   const key=node.getAttribute('data-i18n-'+attr),protectedSource=node.getAttribute('data-i18n-source-'+attr);
   let entry=entries[attr];if(!entry||current!==entry.last)entry=entries[attr]={source:protectedSource||legacy.source(current),last:current};
   const value=key?t(key,params):translateProtected(entry.source);if(current!==value)node.setAttribute(attr,value);entry.last=value;
  }
 }
 const bind=root=>{
  if(root.nodeType===3){textNode(root);return;}
  if(root.nodeType===1)element(root);
  if(!root.querySelectorAll)return;
  for(const node of root.querySelectorAll('*'))element(node);
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode()))textNode(node);
 };
 const refresh=()=>{document.documentElement.lang=locale;bind(document);for(const button of document.querySelectorAll('[data-locale]'))button.setAttribute('aria-pressed',String(button.dataset.locale===locale));};
 const persist=()=>{try{localStorage.setItem(manualKey,locale);}catch{}try{document.cookie='bear_atlas_locale='+locale+'; Path=/; Max-Age=31536000; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');}catch{}};
 const setLocale=value=>{if(!supported.includes(value))return;locale=value;missing.clear();persist();const url=new URL(location.href);if(url.searchParams.has('lang')){url.searchParams.delete('lang');history.replaceState(history.state,'',url);}refresh();window.dispatchEvent(new CustomEvent('bear-locale-change',{detail:{locale}}));};
 document.addEventListener('click',event=>{const button=event.target.closest?.('[data-locale]');if(button){event.preventDefault();setLocale(button.dataset.locale);}});
 const observer=new MutationObserver(records=>{for(const record of records){if(record.type==='characterData')textNode(record.target);else if(record.type==='attributes')element(record.target);else for(const node of record.addedNodes)bind(node);}});
 observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','placeholder','alt']});
 window.BearI18n={t,text:value=>legacy.text(value,locale),source:node=>bindings.get(node?.firstChild)?.source||legacy.source(node?.textContent||''),setLocale,get locale(){return locale;},getMissing:()=>[...missing.values()],bind};
 if(supported.includes(urlLanguage))persist();refresh();
}
export function i18nRuntime(){return '('+i18nClient.toString()+')('+JSON.stringify(i18nCatalog).replace(/</g,'\\u003c')+','+i18nTextTranslator.toString()+');';}

// Compatibility adapter for the existing server HTML and native DOM scene clients.
// New features should use semantic keys; this adapter never reads form values, IDs or game data.
export function i18nTextTranslator(catalog,report=()=>{}){
 const exact=new Map(),first=new Map(),reverse=new Map(),patterns=[];
 for(const [key,entry] of Object.entries(catalog)){
  if(!entry['zh-TW']||!entry.en)continue;
  if(entry.pattern)patterns.push({...entry,regex:new RegExp(entry.pattern,'u')});
  const zh=entry['zh-TW'];exact.set(zh,{key,en:entry.en});
  if(!reverse.has(entry.en))reverse.set(entry.en,zh);
  const bucket=first.get(zh[0])||[];bucket.push({zh,en:entry.en,key});first.set(zh[0],bucket);
 }
 for(const bucket of first.values())bucket.sort((a,b)=>b.zh.length-a.zh.length);
 const source=value=>reverse.get(value)||value;
 const text=(input,locale='en')=>{
  if(locale!=='en')return input;
  const date=input.match(/^(\d{1,2})月(\d{1,2})日週([日一二三四五六]) (\d{2}:\d{2})$/);if(date){const month=new Intl.DateTimeFormat('en',{month:'short',timeZone:'UTC'}).format(new Date(Date.UTC(2000,Number(date[1])-1,1)));const day=new Intl.DateTimeFormat('en',{weekday:'short',timeZone:'UTC'}).format(new Date(Date.UTC(2000,0,2+'日一二三四五六'.indexOf(date[3]))));return month+' '+date[2]+', '+day+' '+date[4];}
  for(const pattern of patterns){const match=input.match(pattern.regex);if(match){const params=Object.fromEntries(pattern.params.map((name,i)=>[name,text(match[i+1],locale)]));const translated=pattern.en.replace(/\{(\w+)\}/g,(_,name)=>params[name]??'{'+name+'}');reverse.set(translated,input);return translated;}}
  const normalized=input.replace(/\s+/g,' ').trim(),whole=exact.get(normalized);
  if(whole)return input.replace(input.trim(),whole.en);
  if(!/[\u3400-\u9fff]/.test(input))return input;
  const chunks=[];let buffer='',unknown='';
  const flush=()=>{if(buffer){chunks.push(buffer);buffer='';}};
  for(let i=0;i<input.length;){
   const match=first.get(input[i])?.find(row=>input.startsWith(row.zh,i));
   if(match){flush();chunks.push(match.en);i+=match.zh.length;}
   else{buffer+=input[i];if(/[\u3400-\u9fff]/.test(input[i]))unknown+=input[i];i++;}
  }
  flush();let result='';for(const chunk of chunks){if(/[A-Za-z0-9]$/.test(result)&&/^[A-Za-z0-9]/.test(chunk))result+=' ';result+=chunk;}
  result=result.replace(/。/g,'. ').replace(/，/g,', ').replace(/：/g,': ').replace(/；/g,'; ').replace(/！/g,'! ').replace(/？/g,'? ').replace(/、/g,', ').replace(/（/g,' (').replace(/）/g,')').replace(/「|」|『|』/g,'"').replace(/[ ]{2,}/g,' ');
  if(unknown)report({kind:'untranslated',text:normalized,remaining:unknown});
  if(!/[\u3400-\u9fff]/.test(result))reverse.set(result,input);
  return result;
 };
 return {text,source};
}

// Markers are generated only by escapeUser(), then removed before any HTML is sent.
// Keep player text separate even when it is identical to a system label.
export function i18nProtectHtml(html){
 const start='\uE000',end='\uE001',strip=s=>s.replace(/[\uE000\uE001]/g,'');
 let raw='';
 html=html.replace(/<title>([^<]*\uE000[^<]*)<\/title>/g,(_,text)=>'<title data-i18n-source-text="'+text.replace(/"/g,'&quot;').replace(/\uE000/g,'&#57344;').replace(/\uE001/g,'&#57345;')+'">'+strip(text)+'</title>');
 return html.replace(/<!--[\s\S]*?-->|<[^>]*>|[^<]+/g,token=>{
  if(token.startsWith('<')){
   const close=token.match(/^<\/(script|style|textarea|title)\b/i);if(close)raw='';
   const open=token.match(/^<(script|style|textarea|title)\b/i);if(open)raw=open[1].toLowerCase();
   const additions=[];
   token=token.replace(/([\w:-]+)=("[^"]*"|'[^']*')/g,(all,name,value)=>{
    if(!value.includes(start))return all;
    if(['title','aria-label','placeholder','alt'].includes(name))additions.push(' data-i18n-source-'+name+'='+value.replace(/\uE000/g,'&#57344;').replace(/\uE001/g,'&#57345;'));
    return name+'='+strip(value);
   });
   if(additions.length)token=token.replace(/(\/?>)$/,additions.join('')+'$1');
   return strip(token);
  }
  if(raw)return strip(token);
  return token.replace(/\uE000([^\uE001]*)\uE001/g,'<span translate="no" data-user-content>$1</span>');
 });
}
