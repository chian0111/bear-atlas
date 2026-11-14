import assert from 'node:assert/strict';
import {golfShot,golfClient,golfControls} from '../worker/golf.js';
import {publicPlaceMarkup} from '../worker/public-scenes.js';
const start={x:221,y:248};
assert.ok(golfShot(start,0,50).sunk);assert.ok(!golfShot(start,0,10).sunk);assert.ok(!golfShot(start,0,100).sunk);assert.ok(!golfShot(start,40,50).sunk);
assert.notDeepEqual(golfShot(start,-40,50).final,golfShot(start,40,50).final);
let p=start;for(let i=0;i<500;i++){
 const shot=golfShot(p,(i*17)%121-60,(i*29)%91+10);
 for(const q of shot.path){assert.ok(Number.isFinite(q.x)&&Number.isFinite(q.y));const dx=q.x-170,dy=q.y-238,u=(40*dx-80*dy)/11040,v=(68*dx+140*dy)/11040;assert.ok(u>=.04-1e-9&&u<=.96+1e-9&&v>=.06-1e-9&&v<=.94+1e-9);}
 for(let j=1;j<shot.path.length;j++)assert.ok(Math.hypot(shot.path[j].x-shot.path[j-1].x,shot.path[j].y-shot.path[j-1].y)<8,'continuous, bounded movement');p=shot.sunk?start:shot.final;
}
function run(reduced=false){
 function element(){return {dataset:{},hidden:false,disabled:false,value:'',textContent:'',attrs:{},handlers:{},style:{setProperty(k,v){this[k]=v},getPropertyValue(k){return this[k]||''}},classList:{v:new Set(),toggle(k,on){on?this.v.add(k):this.v.delete(k)},remove(k){this.v.delete(k)}},scrollIntoView(){},setAttribute(k,v){this.attrs[k]=String(v)},addEventListener(k,fn){this.handlers[k]=fn}};}
 const root=element(),nodes={};for(const key of ['.place-stage','[data-golf]','.place-ball','[data-place-player]','[data-golf-club]','[data-golf-aim]','[data-place-play]','[data-golf-reset]','[data-golf-angle]','[data-golf-power]','[data-place-result]','[data-golf-angle-value]','[data-golf-power-value]'])nodes[key]=element();root.querySelector=s=>nodes[s];
 let id=0,now=100;const frames=new Map(),events={},media={matches:reduced,addEventListener(k,fn){this.change=fn}};
 globalThis.document={querySelector:s=>s==='[data-public-place="sports"]'?root:null};globalThis.window={addEventListener(k,fn){events[k]=fn}};globalThis.matchMedia=()=>media;globalThis.requestAnimationFrame=fn=>{frames.set(++id,fn);return id};globalThis.cancelAnimationFrame=id=>frames.delete(id);
 globalThis.fetch=()=>{throw Error('No network allowed')};globalThis.localStorage={setItem(){throw Error('No storage allowed')}};
 golfClient();const play=nodes['[data-place-play]'],reset=nodes['[data-golf-reset]'],angle=nodes['[data-golf-angle]'],power=nodes['[data-golf-power]'],ball=nodes['.place-ball'];
 const pump=()=>{now+=50;const current=[...frames];frames.clear();for(const [,fn] of current)fn(now)};
 function drain(){for(let i=0;i<150&&frames.size;i++)pump();assert.equal(frames.size,0);}
 assert.equal(root.dataset.golfPhase,'ready');assert.equal(ball.attrs.cx,'221');power.value='10';power.handlers.input();assert.equal(nodes['[data-golf-power-value]'].textContent,'10%');
 play.handlers.click();if(!reduced)play.handlers.click();assert.equal(root.dataset.golfShots,'1');if(!reduced){assert.equal(root.dataset.golfPhase,'approach');assert.ok(play.disabled);for(let i=0;i<38;i++)pump();assert.equal(root.dataset.golfPhase,'rolling');assert.ok(parseFloat(nodes['[data-place-player]'].style.left)<30);assert.ok(parseFloat(nodes['[data-place-player]'].style.top)<60);const a=ball.attrs.cx;pump();assert.notEqual(ball.attrs.cx,a);}
 drain();assert.equal(root.dataset.golfPhase,'ready');assert.ok(!play.disabled);assert.ok(nodes['[data-place-result]'].textContent.includes('球停下來'));
 reset.handlers.click();play.handlers.click();drain();assert.equal(root.dataset.golfPhase,'sunk');assert.equal(ball.attrs.cx,'308');assert.ok(play.disabled);assert.ok(root.classList.v.has('golf-scored'));assert.ok(nodes['[data-place-result]'].textContent.includes('進洞'));
 reset.handlers.click();assert.equal(root.dataset.golfPhase,'ready');assert.equal(root.dataset.golfShots,'0');assert.equal(ball.attrs.cx,'221');assert.ok(!root.classList.v.has('golf-scored'));
 if(!reduced){play.handlers.click();pump();reset.handlers.click();drain();assert.equal(root.dataset.golfPhase,'ready');assert.equal(ball.attrs.cx,'221');play.handlers.click();for(let i=0;i<38;i++)pump();reset.handlers.click();drain();assert.equal(ball.attrs.cx,'221');
 play.handlers.click();pump();events.pagehide();assert.equal(frames.size,0);events.pageshow({persisted:true});assert.equal(root.dataset.golfPhase,'ready');play.handlers.click();pump();media.matches=true;media.change();assert.equal(frames.size,0);assert.equal(root.dataset.golfPhase,'sunk');}
}
run();run(true);
const fake={tree:()=>'<g/>',house:()=>'<g/>'};const sports=publicPlaceMarkup('sports','<svg data-one-player/>','<svg data-npc/>',fake),station=publicPlaceMarkup('english','<svg/>','<svg/>',fake);
assert.equal((sports.match(/data-one-player/g)||[]).length,1);assert.equal((sports.match(/data-place-play[ >]/g)||[]).length,1);assert.ok(!station.includes('data-golf-angle'));assert.ok(golfControls().includes('href="/world"'));assert.ok(sports.includes('data-golf-club'));
console.log('Golf: direction/power outcomes, capture vs overshoot, 500 bounded shots, continuous frames, approach/strike/roll, duplicate guard, miss/retry, reset during approach and roll, hole feedback, reduced motion, pagehide/BFCache cleanup, single actor, station isolation and no network/storage passed.');
