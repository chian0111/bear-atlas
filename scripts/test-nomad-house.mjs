import assert from 'node:assert/strict';
import {nomadSite,nomadMarkup,nomadConstructionArt,nomadBuildModel} from '../worker/nomad-house.js';
import {resortGeometry,shortestResortRoute} from '../worker/resort.js';
import {i18nCatalog} from '../worker/i18n-catalog.js';
// Sample every navigable segment, including all routes from existing entrances.
const {stops,links}=resortGeometry,b=nomadSite.bounds;
const inside=(x,y)=>x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom;
for(const [from,to]of links){const a=stops[from],z=stops[to];for(let i=0;i<=200;i++){const t=i/200;assert.ok(!inside(a.x+(z.x-a.x)*t,a.y+(z.y-a.y)*t),'route stays outside fence');}}
for(const from of[1,5,7,9,11]){const route=shortestResortRoute(stops,links,from,12);assert.equal(route.at(-1),12);assert.ok(route.length>1);}
assert.deepEqual(shortestResortRoute(stops,links,11,1),[11,2,0,1]);
assert.equal(nomadSite.phase,'open');
assert.deepEqual(nomadSite.bounds,{left:414,right:530,top:164,bottom:215});
for(const phase of ['construction','structure','open']){const model=nomadBuildModel(phase);assert.equal(model.phase,phase);assert.equal(model.boxes.length>0,phase!=='construction');assert.ok(model.boxes.length<100);for(const b of model.boxes){for(const n of ['x','y','w','d','h','base'])assert.ok(Number.isFinite(b[n]));assert.ok(b.w>0&&b.d>0&&b.h>0);assert.ok(b.x>=414&&b.x<=530&&b.y>=164&&b.y<=230);}assert.match(nomadConstructionArt('',phase),new RegExp('data-nomad-parcel="'+phase+'"'));}
assert.throws(()=>nomadBuildModel('invalid'));assert.throws(()=>nomadConstructionArt('','invalid'));
assert.ok(!nomadConstructionArt().includes('data-nomad-scaffold'));assert.match(nomadConstructionArt('','structure'),/data-nomad-scaffold/);assert.match(nomadConstructionArt(),/data-nomad-tropical/);
const untouched=JSON.stringify(nomadBuildModel());nomadBuildModel().boxes.pop();assert.equal(JSON.stringify(nomadBuildModel()),untouched);
const markup=nomadMarkup(),art=nomadConstructionArt();
assert.ok(!art.includes('data-nomad-excavator'));assert.ok(!art.includes('data-nomad-engineer'));assert.ok(!art.includes('Coming Soon'));
for(const [,key]of markup.matchAll(/data-i18n(?:-aria-label)?="([^"]+)"/g)){assert.ok(i18nCatalog[key]?.en,key);assert.ok(i18nCatalog[key]?.['zh-TW'],key);}
assert.ok(!markup.includes('data-focus-start'));assert.ok(!markup.includes('fetch('));
assert.equal((markup.match(/<article>/g)||[]).length,4);
console.log('V86.3: all path segments outside fence; five entrances reach sign; old home/cafe route unchanged; construction props; complete semantic translations; four future-zone previews passed.');
