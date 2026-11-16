import assert from 'node:assert/strict';
import {playerExperienceClient} from '../worker/player-experience.js';
// A same-page reward POST must restore its expanded task and position after the header is measured.
const saved={path:'/dock/adventure',at:Date.now(),y:510,anchor:'task-welcome',offset:90,open:['completed-tasks']};
const storage=new Map([['bear-atlas-task-return',JSON.stringify(saved)]]),listeners={},frames=[];
const parent={id:'completed-tasks',tagName:'DETAILS',open:false,parentElement:null};
const task={id:'task-welcome',tagName:'DETAILS',open:false,parentElement:parent,getBoundingClientRect:()=>({top:240})};
const notice={hidden:true},bar={getBoundingClientRect:()=>({height:200})};let scroll;
globalThis.location={pathname:'/dock/adventure',hash:''};
globalThis.sessionStorage={getItem:k=>storage.get(k),removeItem:k=>storage.delete(k),setItem:(k,v)=>storage.set(k,v)};
globalThis.requestAnimationFrame=f=>frames.push(f);
globalThis.document={documentElement:{style:{setProperty(){}},toggleAttribute(){}},querySelector:s=>s==='.resort-topbar'?bar:s==='[data-pocket-nav]'?{}:notice,getElementById:id=>id===task.id?task:id===parent.id?parent:null,querySelectorAll:()=>[task,parent],addEventListener:(name,fn,capture)=>{if(!capture)(listeners[name]??=[]).push(fn);}};
globalThis.window={scrollY:500,scrollTo:v=>scroll=v,addEventListener(){}};
Object.defineProperty(globalThis,'navigator',{value:{onLine:true},configurable:true});
playerExperienceClient();while(frames.length)frames.shift()();
assert.equal(task.open,true);assert.equal(parent.open,true);assert.equal(scroll.top,650);assert.equal(scroll.behavior,'instant');assert.equal(storage.size,0);
const form={method:'post',checkValidity:()=>true,closest:()=>task,getAttribute:()=>null,setAttribute(){}};
for(const fn of listeners.submit)fn({target:form,defaultPrevented:false});
const captured=JSON.parse(storage.get('bear-atlas-task-return'));assert.equal(captured.path,location.pathname);assert.equal(captured.anchor,task.id);assert.deepEqual(captured.open,[task.id,parent.id]);
// Storage failures cannot break native submission or unrelated scene navigation.
sessionStorage.getItem=()=>{throw Error('blocked');};assert.doesNotThrow(()=>playerExperienceClient());
console.log('Task return: measured-header position, expanded groups, native form capture and blocked-storage fallback passed.');
