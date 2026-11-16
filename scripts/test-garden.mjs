import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {gardenInit,gardenIssue,gardenApply} from '../worker/garden.js';
import {collectionIssue,collectionApply} from '../worker/collection.js';
import {createI18nAudit} from './i18n-audit.mjs';
const worker=(await import(process.env.GARDEN_BUILD==='1'?'../dist/server/index.js':'../worker/index.js')).default;
const sql=new DatabaseSync(':memory:');sql.exec('PRAGMA foreign_keys=ON');for(const f of readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));
const a='4'.repeat(48),b='5'.repeat(48),c='6'.repeat(48);for(const[k,n]of [[a,'Alice'],[b,'Bob'],[c,'Third']]){sql.prepare('INSERT INTO island_passports VALUES(?,?,?,?,?)').run(k,n,'cat','picnic',1);sql.prepare('INSERT INTO island_credentials(visitor_key) VALUES(?)').run(k);}
const snapshot=sql.prepare('SELECT * FROM island_passports').all();
const DB={prepare(query){const p=sql.prepare(query);function bind(...args){return{first:async()=>p.get(...args),all:async()=>({results:p.all(...args)}),run:async()=>({meta:p.run(...args)}),executeBatch:()=>p.columns().length?{results:p.all(...args)}:{meta:p.run(...args)},bind}}return bind();},async batch(ss){sql.exec('BEGIN');try{const r=ss.map(s=>s.executeBatch());sql.exec('COMMIT');return r;}catch(e){sql.exec('ROLLBACK');throw e;}}};
const audit=createI18nAudit(),origin='https://garden.test';
const get=async(path,key=a)=>audit.response(await worker.fetch(new Request(origin+path,{headers:{Cookie:key?'atlas_islander='+key:''}}),{DB}),path);
const html=async(path,key=a)=>await(await get(path,key)).text();
const post=async(fields,key=a,foreign=false)=>audit.response(await worker.fetch(new Request(origin+'/world/garden',{method:'POST',headers:{Cookie:key?'atlas_islander='+key:'',Origin:foreign?'https://evil.test':origin,'Sec-Fetch-Site':foreign?'cross-site':'same-origin','Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(fields)}),{DB}),'POST');
const qty=(key,id)=>sql.prepare('SELECT quantity FROM island_collection_inventory WHERE visitor_key=? AND item_id=?').get(key,id)?.quantity||0;
const plot=(key,slot)=>sql.prepare('SELECT * FROM island_garden_plots WHERE visitor_key=? AND slot=?').get(key,slot);
const op=(key,kind,data,now=1000000)=>gardenIssue(DB,key,kind,data,now);
const apply=(key,token,now=1000001)=>gardenApply(DB,key,token,now);
const tokens=text=>[...text.matchAll(/<form\b[^>]*>([\s\S]*?)<\/form>/g)].map(m=>({body:m[1],token:m[1].match(/name="token" value="([^"]+)"/)?.[1]})).filter(f=>f.token);
for(const key of [a,b,c])await gardenInit(DB,key);
assert.equal((await get('/world/garden','')).status,200);assert.equal((await post({action:'apply',token:'x'},'')).status,403);assert.equal((await post({action:'apply',token:'x'},a,true)).status,403);assert.equal((await post({action:'apply',token:'x',ready_at:'0'})).status,400);
const starter=await op(a,'starter');assert.equal((await apply(b,starter)).status,403);assert.equal((await apply(a,starter)).status,303);assert.equal(qty(a,'seed_herb'),2);assert.equal((await apply(a,starter)).replay,true);assert.equal(qty(a,'seed_herb'),2);
assert.equal((await apply(a,await op(a,'starter'))).status,409);assert.equal(qty(a,'seed_herb'),2);
const stalePlant=await op(a,'plant',{slot:1,revision:0,crop:'herb',input:'seed_herb'}),plant2=await op(a,'plant',{slot:1,revision:0,crop:'herb',input:'seed_herb'});
assert.equal((await apply(a,stalePlant)).status,303);assert.equal(qty(a,'seed_herb'),1);assert.equal(plot(a,1).ready_at,null);assert.equal((await apply(a,plant2)).status,409);assert.equal(qty(a,'seed_herb'),1);
assert.equal((await apply(a,await op(a,'plant',{slot:4,revision:0,crop:'herb',input:'seed_herb'}))).status,409);
const water=await op(a,'water',{slot:1,revision:1,crop:'herb',duration:300000});assert.equal((await apply(a,water)).status,303);assert.equal(plot(a,1).ready_at,1300001);
assert.equal((await apply(a,water)).replay,true);assert.equal(plot(a,1).ready_at,1300001);
const harvest=await op(a,'harvest',{slot:1,revision:2,crop:'herb',item:'herb'});assert.equal((await apply(a,harvest,1300000)).status,409);assert.equal(qty(a,'herb'),0);
// Downstream failure must undo plot clearing, inventory credit and operation consumption.
sql.exec("CREATE TRIGGER garden_fixture_fail BEFORE INSERT ON island_collection_ledger WHEN NEW.kind='harvest' BEGIN SELECT RAISE(ABORT,'fixture');END");assert.equal((await apply(a,harvest,1300001)).status,409);assert.equal(plot(a,1).crop_id,'herb');assert.equal(qty(a,'herb'),0);sql.exec('DROP TRIGGER garden_fixture_fail');
assert.equal((await apply(a,harvest,1300001)).status,303);assert.equal(qty(a,'herb'),2);assert.equal(plot(a,1).crop_id,null);assert.equal((await apply(a,harvest,1300002)).replay,true);assert.equal(qty(a,'herb'),2);
// Offline ripe crops do not wither and need no browser clock update.
const plantRice=await op(a,'plant',{slot:4,revision:0,crop:'rice',input:'seed_rice'});await apply(a,plantRice);await apply(a,await op(a,'water',{slot:4,revision:1,crop:'rice',duration:3600000}));
const muchLater=864000000;assert.equal((await gardenApply(DB,a,await gardenIssue(DB,a,'harvest',{slot:4,revision:2,crop:'rice',item:'rice'},muchLater),muchLater+1)).status,303);assert.equal(qty(a,'rice'),2);
// Fishing waits on server time, has no reflex window, respects cooldown/day limits and catches only once.
const cast=await op(a,'cast',{day:'2026-11-16',slot:1,item:'silverfish',reference:'2026-11-16:1'});assert.equal((await apply(a,cast)).status,303);
assert.equal((await apply(a,await op(a,'cast',{day:'2026-11-16',slot:2,item:'pondcarp',reference:'2026-11-16:2'}))).status,409);
const reel=await op(a,'catch',{day:'2026-11-16',slot:1,item:'silverfish',reference:'2026-11-16:1'});assert.equal((await apply(a,reel,1020000)).status,409);assert.equal((await apply(a,reel,1020001)).status,303);assert.equal(qty(a,'silverfish'),1);assert.equal((await apply(a,reel,1020002)).replay,true);
assert.equal((await apply(a,await op(a,'cast',{day:'2026-11-16',slot:2,item:'pondcarp',reference:'2026-11-16:2'}),1020002)).status,409);
// Seeds flow through the same V88 inventory and direct gifts; old balances are not reset.
assert.match(await html('/dock/catalog'),/collection.seed_sunflower/);assert.match(await html('/dock/shop'),/collection.locked/);
for(const[id,slot]of [['carrot',2],['tomato',3]]){await apply(a,await op(a,'plant',{slot,revision:0,crop:id,input:'seed_'+id}));await apply(a,await op(a,'water',{slot,revision:1,crop:id,duration:1}));await apply(a,await op(a,'harvest',{slot,revision:2,crop:id,item:id}),1000003);}
assert.ok(!(await html('/dock/shop')).includes('data-i18n="collection.locked"'));
// Recipient identity is resolved before posting; no item is taken until confirmation.
let review=await post({action:'trade-review',member:'BEAR-0002',offer:'herb',want:'seed_carrot'});assert.equal(review.status,200);let text=await review.text();assert.match(text,/Bob/);assert.match(text,/BEAR-0002/);assert.equal(qty(a,'herb'),2);
const postTrade=tokens(text)[0].token;assert.equal((await post({action:'apply',token:postTrade})).status,303);assert.equal(qty(a,'herb'),1);
const trade=sql.prepare('SELECT * FROM island_garden_trades WHERE sender_key=?').get(a);assert.equal(trade.status,'pending');assert.equal((await gardenApply(DB,a,postTrade)).replay,true);
assert.ok(!(await html('/dock/trades',c)).includes('garden.pending'));
const accept=await gardenIssue(DB,b,'trade_accept',{reference:trade.id});assert.equal((await gardenApply(DB,c,accept)).status,403);assert.equal((await gardenApply(DB,b,accept)).status,409);
await gardenApply(DB,b,await gardenIssue(DB,b,'starter'));
// Atomic bilateral exchange under a forced failure on the sender's receipt.
sql.exec("CREATE TRIGGER trade_fixture_fail BEFORE INSERT ON island_collection_ledger WHEN NEW.kind='trade_received' AND NEW.visitor_key='"+a+"' BEGIN SELECT RAISE(ABORT,'fixture');END");assert.equal((await gardenApply(DB,b,accept)).status,409);assert.equal(qty(b,'seed_carrot'),2);assert.equal(qty(b,'herb'),0);assert.equal(sql.prepare('SELECT status FROM island_garden_trades WHERE id=?').get(trade.id).status,'pending');sql.exec('DROP TRIGGER trade_fixture_fail');
assert.equal((await gardenApply(DB,b,accept)).status,303);assert.equal(qty(b,'seed_carrot'),1);assert.equal(qty(b,'herb'),1);assert.equal(qty(a,'seed_carrot'),2);assert.equal((await gardenApply(DB,b,accept)).replay,true);
const staleCancel=await gardenIssue(DB,a,'trade_cancel',{reference:trade.id});assert.equal((await gardenApply(DB,a,staleCancel)).status,409);
// Escrow return on cancellation/decline, expiry enforcement and original quantity conservation.
const make=async()=>{const reference=crypto.randomUUID(),t=await gardenIssue(DB,a,'trade_post',{item:'herb',want:'seed_carrot',target:b,reference});assert.equal((await gardenApply(DB,a,t)).status,303);return reference;};
let id=await make();assert.equal(qty(a,'herb'),0);assert.equal((await gardenApply(DB,a,await gardenIssue(DB,a,'trade_cancel',{reference:id}))).status,303);assert.equal(qty(a,'herb'),1);
id=await make();assert.equal((await gardenApply(DB,b,await gardenIssue(DB,b,'trade_decline',{reference:id}))).status,303);assert.equal(qty(a,'herb'),1);
id=await make();sql.prepare('UPDATE island_garden_trades SET expires_at=0 WHERE id=?').run(id);assert.equal((await gardenApply(DB,b,await gardenIssue(DB,b,'trade_accept',{reference:id}))).status,409);assert.equal((await gardenApply(DB,a,await gardenIssue(DB,a,'trade_cancel',{reference:id}))).status,303);assert.equal(qty(a,'herb'),1);
assert.equal((await post({action:'trade-review',member:'BEAR-0001',offer:'herb',want:'seed_carrot'})).status,400);
assert.equal((await post({action:'trade-review',member:'BEAR-0002',offer:'herb',want:'herb'})).status,400);
// Existing collection operations reserve display quantities for exchanges as well.
const display=await collectionIssue(DB,a,'display',{item:'herb',slot:1});assert.equal((await collectionApply(DB,a,display)).status,303);assert.equal((await post({action:'trade-review',member:'BEAR-0002',offer:'herb',want:'seed_carrot'})).status,409);
for(const p of ['/world/garden','/world/pond','/dock/trades','/dock/shop','/dock/catalog','/dock/collection','/dock/adventure','/world/nature'])assert.equal((await get(p)).status,200,p);
assert.equal((await get('/dock/trades?page=bad')).status,400);
assert.deepEqual(sql.prepare('SELECT * FROM island_passports').all(),snapshot);
sql.exec('ALTER TABLE island_garden_fishing RENAME TO garden_missing_fixture');assert.equal((await get('/world/garden')).status,503);assert.equal((await get('/dock/collection')).status,200);sql.exec('ALTER TABLE garden_missing_fixture RENAME TO island_garden_fishing');
assert.deepEqual(audit.report().missing,[]);
console.log('V89 PASS: starter once, account isolation, seed debit, stale plot revision, paddy restriction, server timing/offline growth, watering replay, atomic harvest rollback, fishing wait/cooldown, variety unlock, escrow bilateral trade/expiry/cancel/decline/failure rollback, display reservation, unchanged legacy identity and bilingual fallback.');
