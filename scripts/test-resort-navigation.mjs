import assert from 'node:assert/strict';
import {resortGeometry,shortestResortRoute} from '../worker/resort.js';
import {fullBody} from '../worker/resort-upgrade.js';
const {stops,links}=resortGeometry;
assert.deepEqual(shortestResortRoute(stops,links,11,1),[11,2,0,1]);
for(const a of [1,5,7,11])for(const b of [1,5,7,11])if(a!==b)assert.ok(!shortestResortRoute(stops,links,a,b).includes(9));
// Choose the shorter road distance, even when it has more junctions.
const pts=[{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:1,y:100},{x:3,y:0}];
assert.deepEqual(shortestResortRoute(pts,[[0,3],[3,4],[0,1],[1,2],[2,4]],0,4),[0,1,2,4]);
for(const species of ['cat','rabbit','bear']){const svg=fullBody('<svg data-species="'+species+'"><ellipse cx="60" cy="51" fill="#f0e2ca"/></svg>');assert.ok(svg.includes('data-body-species="'+species+'"'));assert.ok(svg.includes('bear-leg-left')&&svg.includes('bear-arm-right'));assert.ok(!svg.includes('#a77b5a'));}
console.log('Weighted route avoids reception detours, handles more but shorter junctions; species-matched body and paws passed.');
