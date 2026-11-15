import assert from 'node:assert/strict';
import {nomadSite,nomadMarkup,nomadConstructionArt} from '../worker/nomad-house.js';
import {resortGeometry,shortestResortRoute} from '../worker/resort.js';
import {i18nCatalog} from '../worker/i18n-catalog.js';
// Sample every navigable segment, including all routes from existing entrances.
const {stops,links}=resortGeometry,b=nomadSite.bounds;
const inside=(x,y)=>x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom;
for(const [from,to]of links){const a=stops[from],z=stops[to];for(let i=0;i<=200;i++){const t=i/200;assert.ok(!inside(a.x+(z.x-a.x)*t,a.y+(z.y-a.y)*t),'route stays outside fence');}}
for(const from of[1,5,7,9,11]){const route=shortestResortRoute(stops,links,from,12);assert.equal(route.at(-1),12);assert.ok(route.length>1);}
assert.deepEqual(shortestResortRoute(stops,links,11,1),[11,2,0,1]);
assert.equal(nomadSite.phase,'construction');
const markup=nomadMarkup(),art=nomadConstructionArt();
assert.match(art,/data-nomad-excavator/);assert.match(art,/data-nomad-engineer/);assert.match(art,/Coming Soon/);
for(const [,key]of markup.matchAll(/data-i18n(?:-aria-label)?="([^"]+)"/g)){assert.ok(i18nCatalog[key]?.en,key);assert.ok(i18nCatalog[key]?.['zh-TW'],key);}
assert.ok(!markup.includes('data-focus-start'));assert.ok(!markup.includes('fetch('));
assert.equal((markup.match(/<article>/g)||[]).length,4);
console.log('V86.1: all path segments outside fence; five entrances reach sign; old home/cafe route unchanged; construction props; complete semantic translations; four future-zone previews passed.');
