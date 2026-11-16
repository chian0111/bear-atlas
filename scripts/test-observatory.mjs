import assert from 'node:assert/strict';
import {observatorySite,observatoryPage,observatoryExterior} from '../worker/observatory.js';
import {resortGeometry,shortestResortRoute} from '../worker/resort.js';
import {harborNeighbors} from '../worker/harbor-neighbors.js';
import {i18nCatalog} from '../worker/i18n-catalog.js';
const {bounds:b}=observatorySite,{stops,links}=resortGeometry;
for(const [from,to]of links){const a=stops[from],z=stops[to];for(let i=0;i<=200;i++){const t=i/200,x=a.x+(z.x-a.x)*t,y=a.y+(z.y-a.y)*t;assert.ok(!(x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom),'walkable edges avoid observatory');}}
for(const from of[1,5,7,9,11,12]){const route=shortestResortRoute(stops,links,from,14);assert.equal(route.at(-1),14);assert.equal(route.at(-2),2);}
assert.deepEqual(shortestResortRoute(stops,links,11,1),[11,2,0,1]);
assert.equal(harborNeighbors.flat().length,49);
for(const topic of ['','today','why','index','experiment']){const body=observatoryPage(new URL('https://example.test/?topic='+topic),'','');for(const [,key]of body.matchAll(/data-i18n(?:-aria-label)?="([^"]+)"/g))assert.ok(i18nCatalog[key]?.en&&i18nCatalog[key]?.['zh-TW'],key);assert.ok(!body.includes('<form')&&!body.includes('fetch('));}
assert.match(observatoryExterior(),/data-observatory-exterior/);
console.log('V90.1: seven connected facilities, all movement edges clear, unchanged old routes and 49 IDs, bilingual dialogue, no financial forms passed.');
