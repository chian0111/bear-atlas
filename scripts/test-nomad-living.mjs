import assert from 'node:assert/strict';
import {nomadSeats,nomadResidents,nomadTransition,nomadLivingModel,nomadProject,nomadNpcTask,nomadLivingMarkup,nomadLivingClient} from '../worker/nomad-living.js';
import {harborNeighbors} from '../worker/harbor-neighbors.js';
import {i18nCatalog} from '../worker/i18n-catalog.js';
const initial={seat:null,moving:false,target:null,mode:'standing'};
for(const seat of nomadSeats){
 assert.equal(nomadTransition(initial,{type:'mode',mode:'working'},nomadSeats),initial);
 let s=nomadTransition(initial,{type:'seat',id:seat.id},nomadSeats);assert.ok(s.moving);assert.equal(s.seat,null);
 assert.equal(nomadTransition(s,{type:'seat',id:seat.id},nomadSeats),s,'duplicate clicks do not start another route');
 s=nomadTransition(s,{type:'arrive'},nomadSeats);assert.equal(s.seat,seat.id);assert.ok(!s.moving);
 for(const mode of seat.modes){s=nomadTransition(s,{type:'mode',mode},nomadSeats);assert.equal(s.mode,mode);}
 assert.equal(nomadTransition(s,{type:'mode',mode:'invalid'},nomadSeats),s);
 s=nomadTransition(s,{type:'leave'},nomadSeats);assert.equal(s.seat,null);assert.ok(s.moving);
 s=nomadTransition(s,{type:'arrive'},nomadSeats);assert.deepEqual(s,initial);
}
assert.equal(nomadTransition(initial,{type:'seat',id:'forged'},nomadSeats),initial);
const model=nomadLivingModel();assert.ok(model.boxes.length<160);
for(const b of model.boxes)for(const key of ['x','z','w','d','h','y'])assert.ok(Number.isFinite(b[key]));
for(const b of model.boxes){assert.ok(b.w>0&&b.d>0&&b.h>0);for(const dx of [-1,1])for(const dz of [-1,1])for(const h of [b.y,b.y+b.h]){const p=nomadProject(b.x+dx*b.w/2,b.z+dz*b.d/2,h);assert.ok(p.x>=0&&p.x<=1000&&p.y>=0&&p.y<=600,'projected furniture/roof stays inside scene');}}
const overlaps=(x,z,o)=>Math.abs(x-o.x)<o.w/2+.4&&Math.abs(z-o.z)<o.d/2+.4;
for(const seat of nomadSeats){assert.deepEqual(seat.route[0],[0,4.6]);assert.deepEqual(seat.route.at(-1),[seat.x,seat.z]);
 for(let k=1;k<seat.route.length;k++){const a=seat.route[k-1],b=seat.route[k];for(let n=0;n<=100;n++){const t=n/100,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;
  for(const o of model.obstacles)assert.ok(!overlaps(x,z,o),seat.id+' path clears tables/bar/water');
  for(const r of nomadResidents)assert.ok(Math.hypot(x-r.x,z-r.z)>.65,seat.id+' path clears resident '+r.id);
 }}
}
assert.equal(new Set(nomadResidents.map(r=>r.id)).size,6);
for(let i=0;i<nomadResidents.length;i++){const r=nomadResidents[i],[d,n]=r.id.split('-').map(Number);assert.ok(harborNeighbors[d][n]);for(const b of nomadResidents.slice(i+1))assert.ok(Math.hypot(r.x-b.x,r.z-b.z)>1);for(const elapsed of [0,12000,24000,96000])assert.ok(r.tasks.includes(nomadNpcTask(r.tasks,elapsed,i)));}
const html=nomadLivingMarkup('<svg data-species="rabbit"></svg>',nomadResidents.map(r=>({name:r.id,portrait:'<svg></svg>'})));
for(const[,key]of html.matchAll(/data-i18n(?:-aria-label)?="([^"]+)"/g)){assert.ok(i18nCatalog[key]?.en,key);assert.ok(i18nCatalog[key]?.['zh-TW'],key);}
assert.equal((html.match(/data-nomad-player /g)||[]).length,1);assert.equal((html.match(/data-nomad-npc=/g)||[]).length,6);
assert.match(html,/src="\/town-life.js/);assert.ok(!html.includes('data-focus-start'));assert.match(html,/data-species="rabbit"/);
for(const s of nomadSeats){const p=nomadProject(s.x,s.z);assert.ok(p.x>0&&p.x<1000&&p.y>0&&p.y<600);}
console.log('V86.3: all seat/mode/leave transitions; invalid/duplicate guards; finite bounded scene; clear routes and resident spacing; original roster IDs; reversible NPC actions; bilingual UI; single player; shared cafe and no timer passed.');
