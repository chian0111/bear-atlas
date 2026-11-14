import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const text=readFileSync(new URL('../worker/index.js',import.meta.url),'utf8');
const start=text.indexOf("  form.addEventListener('submit',async event=>{");
const end=text.indexOf('\n  });',start)+6;
assert.ok(start>0&&end>start);
const block=text.slice(start,end);
function setup(fetcher,{ok=true,revision='2'}={}){
 const fields={layout:'edited-layout',revision:'1',theme:'cream'},submit={textContent:'儲存',disabled:false},status={textContent:''};let handler;
 const form={action:'/dock/cabin/bedroom',querySelector:k=>k==='[type="submit"]'?submit:{get value(){return fields.revision;},set value(v){fields.revision=v;}},addEventListener:(k,fn)=>handler=fn};
 const game={querySelector:k=>k==='[data-cabin-save-state]'?status:null};
 const FormData=class{constructor(){return Object.entries(fields);}};
 const parse=()=>({querySelector:k=>k==='[data-cabin-form] [name="revision"]'?{value:revision}:null});
 const api=new Function('form','game','fetch','parse','FormData',`let busy=false,dirty=true,savedForm='baseline',saveThenGo=false,closed=0,roomChanges=0;const close=()=>closed++,say=()=>{},walkToRoom=()=>roomChanges++;${block};return {state:()=>({busy,dirty,savedForm,closed,roomChanges})};`)(form,game,fetcher,parse,FormData);
 return {...api,fields,submit,status,save:()=>handler({preventDefault(){}})};
}
for(const fail of ['network','server','conflict']){
 let call=0;const test=setup(async()=>{call++;if(call===1&&fail==='network')throw Error('offline');return {ok:call>1||fail==='network',status:call===1&&fail==='conflict'?409:503,text:async()=>''};});
 await test.save();assert.equal(test.fields.layout,'edited-layout');assert.equal(test.fields.revision,'1');assert.ok(test.state().dirty);assert.equal(test.state().savedForm,'baseline');assert.equal(test.submit.disabled,false);assert.match(test.status.textContent,/仍保留/);
 await test.save();assert.equal(test.fields.layout,'edited-layout');assert.equal(test.fields.revision,'2');assert.equal(test.state().dirty,false);assert.equal(test.submit.disabled,false);
}
let resolve;const pending=new Promise(r=>resolve=r);const concurrent=setup(()=>pending);const first=concurrent.save();assert.ok(concurrent.submit.disabled);concurrent.fields.layout='newer-edit';resolve({ok:true,text:async()=>''});await first;
assert.equal(concurrent.fields.layout,'newer-edit');assert.ok(concurrent.state().dirty);assert.ok(concurrent.state().savedForm.includes('edited-layout'));assert.ok(!concurrent.state().savedForm.includes('newer-edit'));assert.match(concurrent.status.textContent,/再次儲存/);
console.log('Network/server/conflict failures retain edits and allow retry; edits made during an in-flight save stay dirty.');
