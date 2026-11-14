import {i18nCatalog} from '../worker/i18n-catalog.js';
import {i18nTextTranslator} from '../worker/i18n.js';
const decode=s=>s.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n)=>String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n)));
export function createI18nAudit(){
 const missing=new Map(),pages=new Set();let path='';
 const translator=i18nTextTranslator(i18nCatalog,issue=>{if(issue.kind==='untranslated'){const entry=missing.get(issue.text)||{source:issue.text,remaining:issue.remaining,paths:[]};if(!entry.paths.includes(path))entry.paths.push(path);missing.set(issue.text,entry);}});
 function check(value){if(['繁中','繁體中文'].includes(value.trim()))return;if(!/[\u3400-\u9fff]/.test(value))return;for(const part of decode(value).split(/\uE000[^\uE001]*\uE001/))translator.text(part,'en');}
 return {
  async response(response,route){if(!response.headers.get('Content-Type')?.includes('text/html'))return response;path=route;pages.add(route);const source=await response.clone().text();let raw='',user=0;
   for(const match of source.matchAll(/<!--[\s\S]*?-->|<[^>]*>|[^<]+/g)){
    const token=match[0];if(token.startsWith('<!--'))continue;
    if(token.startsWith('<')){
     const closing=token.match(/^<\/([\w-]+)/)?.[1];if(closing){if(closing===raw)raw='';if(closing==='span'&&user)user--;continue;}
     const name=token.match(/^<([\w-]+)/)?.[1];if(name==='title'&&token.includes('data-i18n-source-text')){const source=token.match(/data-i18n-source-text="([^"]*)"/)?.[1];if(source)check(source);raw='title';continue;}
     if(['script','style','textarea'].includes(name)){raw=name;continue;}
     if(name==='span'&&user)user++;
     if(/\bdata-user-content(?:\s|>)/.test(token)||/\btranslate="no"/.test(token)){if(name==='span'&&!user)user=1;continue;}
     if(raw||user||/\bdata-locale=/.test(token)||/class="idea-languages"/.test(token))continue;
     for(const attr of token.matchAll(/\s(title|aria-label|placeholder|alt)=("([^"]*)"|'([^']*)')/g)){
      const protectedAttr=token.match(new RegExp('data-i18n-source-'+attr[1]+'="([^"]*)"'))?.[1];check(protectedAttr||attr[3]||attr[4]||'');
     }
    }else if(!raw&&!user)check(token);
   }
   return response;
  },
  report(){return {catalogEntries:Object.keys(i18nCatalog).length,htmlRoutes:pages.size,routes:[...pages].sort(),missing:[...missing.values()].sort((a,b)=>a.source.localeCompare(b.source))};}
 };
}
