import assert from 'node:assert/strict';
import {playerExperienceClient} from '../worker/player-experience.js';
const listeners={},storage=new Map();let calls=0,replaced=false,scroll,fetchOptions;
const node={style:{},setAttribute(){},removeAttribute(){},querySelector(){return null;},querySelectorAll(){return[];},prepend(){},getBoundingClientRect(){return{height:1800};},replaceWith(){replaced=true;}};
const fresh={...node,style:{}};
globalThis.location={pathname:'/dock/collection',origin:'https://test.invalid',href:'https://test.invalid/dock/collection'};
globalThis.document={documentElement:{lang:'zh-TW',style:{setProperty(){}},toggleAttribute(){}},querySelector:s=>s==='.collection-page'?node:null,querySelectorAll:()=>[],createElement:()=>({dataset:{},setAttribute(){}}),getElementById:()=>null,addEventListener:(k,f,c)=>{if(!c)(listeners[k]??=[]).push(f);}};
globalThis.sessionStorage={getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
globalThis.window={scrollY:650,scrollTo:v=>scroll=v,addEventListener(){}};
globalThis.history={replaceState(){}};
Object.defineProperty(globalThis,'navigator',{value:{onLine:true},configurable:true});
globalThis.DOMParser=class{parseFromString(){return{querySelector:s=>s==='.collection-page'?fresh:null};}};
globalThis.fetch=async(url,options)=>{calls++;fetchOptions=options;return{ok:true,url:'https://test.invalid/dock/collection?filter=material',text:async()=>''};};
playerExperienceClient();
const nav={getBoundingClientRect:()=>({top:200}),closest:()=>null,querySelector:()=>null};
const link={href:'https://test.invalid/dock/collection?filter=material',closest:()=>nav};
const event={target:{closest:()=>link},button:0,defaultPrevented:false,preventDefault(){this.defaultPrevented=true;}};
for(const fn of listeners.click)fn(event);
await new Promise(resolve=>setTimeout(resolve,0));
assert.equal(event.defaultPrevented,true);assert.equal(calls,1);assert.equal(replaced,true);assert.equal(scroll.top,650);assert.equal(fresh.style.minHeight,'1800px');assert.equal(fetchOptions.credentials,'same-origin');
// V98 bulk POST keeps page height and scroll; duplicate submits share the pending request.
globalThis.FormData=class{*[Symbol.iterator](){yield ['action','sell-batch'];yield ['token','owned-token'];yield ['quantity','3'];}};
const form={method:'post',checkValidity:()=>true,querySelector:()=>({value:'sell-batch'}),getAttribute:()=>'/dock/collection',closest:()=>nav};
const saleEvent=()=>({target:form,defaultPrevented:false,preventDefault(){this.defaultPrevented=true;}});
const before=calls;
for(let n=0;n<2;n++){const e=saleEvent();for(const fn of listeners.submit)fn(e);assert.equal(e.defaultPrevented,true);}
await new Promise(resolve=>setTimeout(resolve,0));
assert.equal(calls,before+1);assert.equal(fetchOptions.method,'POST');assert.equal(fetchOptions.body.get('quantity'),'3');assert.equal(scroll.top,650);assert.equal(fresh.style.minHeight,'1800px');
// Modified and cross-page links retain normal browser navigation.
for(const event of [{target:{closest:()=>link},button:0,ctrlKey:true},{target:{closest:()=>({...link,href:'https://test.invalid/world'})},button:0}]){
 event.preventDefault=()=>assert.fail('must retain native navigation');for(const fn of listeners.click)fn(event);
}
console.log('Pocket inline: same-page filter replacement, stable scroll/height, same-origin credentials and native modified/destination links passed.');
