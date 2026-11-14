import assert from 'node:assert/strict';
import {sadIslandClient,sadComfort,sadIslandMarkup,sadWalkPoint} from '../worker/sad-island.js';
const el=()=>({dataset:{},hidden:false,disabled:false,value:'',textContent:'',handlers:{},focus(){this.focused=true;},addEventListener(k,fn){this.handlers[k]=fn;}});
const root=el(),note=el(),give=el(),reply=el(),again=el(),rest=el(),stand=el(),scene=el(),stage=el(),motion=el(),choice=el();
let resting=false;scene.classList={remove(){resting=false;},add(){resting=true;}};root.dataset.comforts=JSON.stringify(sadComfort);
const nodes={'#sad-note':note,'[data-sad-give]':give,'[data-sad-reply]':reply,'[data-sad-again]':again,'[data-sad-rest]':rest,'[data-sad-stand]':stand,'.sad-scene':scene,'[data-iso]':stage,'[data-sad-motion]':motion,'input[name="sad-mood"]:checked':choice};
root.querySelector=q=>nodes[q];globalThis.document={querySelector:()=>root};const windowEvents={};globalThis.window={addEventListener(k,v){windowEvents[k]=v;}};
let callback=null,reduced=false;globalThis.matchMedia=()=>({get matches(){return reduced;},addEventListener(){}});globalThis.setTimeout=fn=>{callback=fn;return 1;};globalThis.clearTimeout=()=>callback=null;
for(const name of ['fetch','XMLHttpRequest','WebSocket','localStorage','sessionStorage','indexedDB'])Object.defineProperty(globalThis,name,{configurable:true,get(){throw Error('Private text must never use '+name);}});
const moves=[];stage.dispatchEvent=e=>moves.push(e.detail);
sadIslandClient();
for(const mood of Object.keys(sadComfort))for(const text of ['','PRIVATE_SECRET_'+mood]){
 choice.value=mood;note.value=text;give.handlers.click();assert.equal(note.value,'');assert.equal(root.dataset.phase,'offering');assert.equal(give.disabled,true);const finish=callback;give.handlers.click();assert.equal(callback,finish);finish();assert.equal(root.dataset.phase,'rest');assert.equal(reply.textContent,sadComfort[mood]);assert.ok(!reply.textContent.includes('PRIVATE_SECRET'));assert.equal(give.disabled,false);
 again.handlers.click();assert.equal(root.dataset.phase,'ready');assert.equal(note.value,'');
}
rest.handlers.click();assert.equal(moves.at(-1).key,'bench');stage.handlers['iso-arrived']({detail:'bench'});assert.ok(resting&&rest.hidden&&!stand.hidden);
stage.handlers['iso-moving']();assert.ok(!resting);stand.handlers.click();assert.equal(moves.at(-1).key,'walk');
note.value='LEAVE_PRIVATE';give.handlers.click();windowEvents.pagehide();assert.equal(callback,null);assert.equal(note.value,'');assert.equal(root.dataset.phase,'ready');note.value='BFCACHE_PRIVATE';windowEvents.pageshow();assert.equal(note.value,'');
reduced=true;give.handlers.click();callback();assert.equal(root.dataset.phase,'rest');
const markup=sadIslandMarkup('<svg data-existing-character></svg>');assert.ok(markup.includes('data-existing-character'));assert.ok(!markup.includes('<form'));assert.ok(markup.includes('maxlength="1000"'));assert.ok(!markup.includes('PRIVATE_SECRET'));
console.log('All four moods, optional text, repeated rituals, busy guard, rest/stand, reduced motion, pagehide/BFCache clearing and network/storage traps passed.');

for(const x of [-100,0,38,49,100,500])for(const y of [-100,0,40,55,68,100,500]){const p=sadWalkPoint(x,y);assert.ok(p.x>=15&&p.x<=80&&p.y>=40&&p.y<=78);assert.deepEqual(sadWalkPoint(p.x,p.y),p);}
assert.deepEqual(sadWalkPoint(38,68),{x:38,y:68});console.log('Walk bounds stay inside the island; bench remains reachable.');
