import assert from 'node:assert/strict';
import {sportsVenueModel,sportsVenueClient} from '../worker/sports-venues.js';
for(const kind of ['gym','table','pickle','tennis','pool']){
 const model=sportsVenueModel(kind);assert.ok(model.shapes.length>40&&model.shapes.length<400,kind+' bounded mesh budget');
 for(const shape of model.shapes){for(const key of ['x','z','w','d','h','y'])assert.ok(Number.isFinite(shape[key]),kind+' finite '+key);assert.ok(shape.w>0&&shape.d>0&&shape.h>0);assert.ok(Math.abs(shape.x)+shape.w/2<=5.1&&Math.abs(shape.z)+shape.d/2<=4.1,kind+' geometry remains in framing bounds');}
 const snapshot=JSON.stringify(model);model.shapes.pop();assert.equal(JSON.stringify(sportsVenueModel(kind)),snapshot,'re-entry does not reuse mutable geometry');
}
const {readFileSync}=await import('node:fs');const index=readFileSync(new URL('../worker/index.js',import.meta.url),'utf8');assert.match(index,/sportsVenueClient.toString/);assert.match(sportsVenueClient.toString(),/prefers-reduced-motion/);
console.log('Five venues: bounded mesh count, finite geometry, platform containment, independent re-entry models and shipped client integration passed.');
