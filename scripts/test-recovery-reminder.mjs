import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../worker/index.js',import.meta.url),'utf8'),start=source.indexOf('function recoveryReminderClient()');
const client=new Function('return ('+source.slice(start)+')')();
for(const fail of [false,true]){
 const el=()=>({handlers:{},hidden:true,checked:false,disabled:false,textContent:'',addEventListener(k,v){this.handlers[k]=v;}}),root=el(),value=el(),copy=el(),status=el(),form=el(),saved=el(),next=el();
 value.value='1111 2222 3333 4444 5555 6666';let selected=false,reported=false,target='',copied='';value.focus=()=>{};value.select=()=>selected=true;value.setSelectionRange=()=>{};saved.reportValidity=()=>reported=true;form.getAttribute=()=>'/world';
 const nodes={'[data-recovery-value]':value,'[data-recovery-copy]':copy,'[data-recovery-status]':status,'[data-recovery-confirm]':form,'[data-recovery-saved]':saved,'[data-recovery-continue]':next};root.querySelector=k=>nodes[k];globalThis.document={querySelector:()=>root};globalThis.location={assign:v=>target=v};Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{writeText:async text=>{if(fail)throw Error();copied=text;}}}});
 for(const key of ['fetch','localStorage','sessionStorage'])Object.defineProperty(globalThis,key,{configurable:true,get(){throw Error('Unexpected credential transmission/storage');}});
 client();assert.equal(next.disabled,true);form.handlers.submit({preventDefault(){}});assert.equal(target,'');assert.ok(reported);await copy.handlers.click();assert.ok(!status.textContent.includes(value.value));if(fail)assert.ok(selected);else assert.equal(copied,value.value.replace(/\s/g,''));saved.checked=true;saved.handlers.change();assert.equal(next.disabled,false);form.handlers.submit({preventDefault(){}});assert.equal(target,'/world');
}
console.log('Copy success/fallback, saved-confirmation gate, credential-free navigation and no network/storage calls passed.');
