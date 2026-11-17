import {gardenInit,gardenIssue,gardenApply} from '../worker/garden.js';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {collectionIssue,collectionApply,collectionDay} from '../worker/collection.js';
import {livingStats,livingWindow} from '../worker/character-living.js';
import {createI18nAudit} from './i18n-audit.mjs';
const worker=(await import(process.env.LIVING_BUILD==='1'?'../dist/server/index.js':'../worker/index.js')).default;
const sql=new DatabaseSync(':memory:');sql.exec('PRAGMA foreign_keys=ON');
for(const f of readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));
const alice='1'.repeat(48),bob='2'.repeat(48),visitor='3'.repeat(48);
for(const [key,name]of [[alice,'Alice'],[bob,'Bob'],[visitor,'Third']]){sql.prepare('INSERT INTO island_passports VALUES(?,?,?,?,?)').run(key,name,'rabbit','picnic',1);sql.prepare('INSERT INTO island_credentials(visitor_key) VALUES(?)').run(key);}
const original=sql.prepare('SELECT * FROM island_passports').all(),credentials=sql.prepare('SELECT * FROM island_credentials').all();
const DB={prepare(query){const p=sql.prepare(query);function bind(...args){return{first:async()=>p.get(...args),all:async()=>({results:p.all(...args)}),run:async()=>({meta:p.run(...args)}),executeBatch:()=>p.columns().length?{results:p.all(...args)}:{meta:p.run(...args)},bind}}return bind();},async batch(rows){sql.exec('BEGIN');try{const results=rows.map(s=>s.executeBatch());sql.exec('COMMIT');return results;}catch(e){sql.exec('ROLLBACK');throw e;}}};
const origin='https://collection.test',audit=createI18nAudit();
const get=async(path,key=alice)=>audit.response(await worker.fetch(new Request(origin+path,{headers:{Cookie:key?'atlas_islander='+key:''}}),{DB}),path);
const html=async(path,key=alice)=>await(await get(path,key)).text();
const post=async(fields,key=alice,foreign=false)=>audit.response(await worker.fetch(new Request(origin+'/dock/collection',{method:'POST',headers:{Cookie:key?'atlas_islander='+key:'',Origin:foreign?'https://evil.test':origin,'Sec-Fetch-Site':foreign?'cross-site':'same-origin','Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(fields)}),{DB}),'POST');
const tokens=text=>[...text.matchAll(/<form\b[^>]*>([\s\S]*?)<\/form>/g)].map(m=>({body:m[1],token:m[1].match(/name="token" value="([^"]+)"/)?.[1]})).filter(f=>f.token);
const card=(text,id)=>[...text.matchAll(/<article class="collection-card"[^>]*>([\s\S]*?)<\/article>/g)].map(m=>m[1]).find(s=>s.includes('collection.'+id+'"'));
const qty=(key,id)=>sql.prepare('SELECT quantity FROM island_collection_inventory WHERE visitor_key=? AND item_id=?').get(key,id)?.quantity||0;
const coins=key=>sql.prepare('SELECT coins FROM island_collection_wallets WHERE visitor_key=?').get(key)?.coins||0;
const ledger=key=>sql.prepare('SELECT * FROM island_collection_ledger WHERE visitor_key=?').all(key);
const apply=async token=>post({action:'apply',token});
const change=async(path,fields,key=alice,foreign=false)=>audit.response(await worker.fetch(new Request(origin+path,{method:'POST',headers:{Cookie:key?'atlas_islander='+key:'',Origin:foreign?'https://evil.test':origin,'Sec-Fetch-Site':foreign?'cross-site':'same-origin','Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(fields)}),{DB}),path+' POST');
for(const key of [alice,bob]){await get('/dock/collection',key);sql.prepare('UPDATE island_collection_wallets SET coins=500 WHERE visitor_key=?').run(key);}
const purchase=async id=>{const offer=tokens(card(await html('/dock/shop'),id))[0];assert.ok(offer,id);const r=await apply(offer.token);assert.equal(r.status,303);return offer.token;};
for(const id of ['sage_knit','sun_hat','firework_ticket','lamp','plant','clock','bread','tea','berries'])await purchase(id);
assert.ok(!card(await html('/dock/shop?category=style'),'firework_ticket'));
assert.ok(card(await html('/dock/shop?category=tickets'),'firework_ticket'));
assert.equal((await change('/world/style',{action:'equip',item:'sage_knit'},bob)).status,409);
assert.equal((await change('/world/style',{action:'equip',item:'sage_knit'},alice,true)).status,403);
assert.equal((await change('/world/style',{action:'equip',item:'sage_knit'})).status,303);
assert.equal((await change('/world/style',{action:'equip',item:'sun_hat'})).status,303);
const styledRoom=await html('/dock/cabin');assert.match(styledRoom,/data-bear-outfit="#79927e"/);assert.match(styledRoom,/data-shop-accessory="sun_hat"/);
const dressed=await html('/world/style');assert.match(dressed,/<g data-shop-outfit="sage_knit">/);assert.match(dressed,/<g data-shop-accessory="sun_hat">/);assert.match(await html('/passport'),/<g data-shop-outfit="sage_knit">/);
const routeStats=await html('/world/character');for(const species of ['bear','cat','rabbit'])assert.ok(routeStats.includes('data-growth-species="'+species+'"'));
const meal=tokens(card(await html('/dock/collection?filter=food'),'bread')).find(f=>f.body.includes('collection.eat'));
assert.equal((await apply(meal.token)).status,303);assert.equal((await apply(meal.token)).status,303);
assert.equal((await livingStats(DB,alice)).find(r=>r.species==='rabbit').health,2);
const book=await html('/dock/mba'),reading=tokens(book).find(f=>f.body.includes('value="activity"'));
assert.ok(reading);assert.equal((await change('/world/character',{action:'activity',kind:'read',token:reading.token},bob)).status,409);
assert.equal((await change('/world/character',{action:'activity',kind:'read',token:reading.token})).status,303);
assert.equal((await change('/world/character',{action:'activity',kind:'read',token:reading.token})).status,409);
const readAgain=tokens(await html('/dock/mba')).find(f=>f.body.includes('value="activity"'));
await change('/world/character',{action:'activity',kind:'read',token:readAgain.token});
assert.equal((await livingStats(DB,alice)).find(r=>r.species==='rabbit').knowledge,3);
// Species switches do not reset identities or transfer experience/style.
sql.prepare("UPDATE island_passports SET bear='cat' WHERE visitor_key=?").run(alice);
assert.ok(!(await html('/world/style')).includes('<g data-shop-outfit="sage_knit">'));
assert.equal((await livingStats(DB,alice)).find(r=>r.species==='cat').health,0);
sql.prepare("UPDATE island_collection_inventory SET quantity=12 WHERE visitor_key=? AND item_id='berries'").run(alice);
for(let n=0;n<12;n++)assert.equal((await apply(await collectionIssue(DB,alice,'sell',{item:'berries',coins:0}))).status,303);
const capped=await livingStats(DB,alice);assert.equal(capped.find(r=>r.species==='cat').health,20);assert.equal(capped.find(r=>r.species==='rabbit').health,2);
assert.ok((await livingStats(DB,bob)).every(r=>r.health===0&&r.knowledge===0));
// Furniture really reaches the cabin renderer, keeps stock reserved and returns to the bag.
for(const [n,id]of ['lamp','plant','clock'].entries()){
 assert.equal((await change('/world/furnishings',{action:'place',item:id,slot:String(n+1),position:['table','window','corner'][n]})).status,303);
 assert.equal(qty(alice,id),1);
 assert.equal((await change('/world/furnishings',{action:'place',item:id,slot:'4',position:'window'},bob)).status,409);
}
const room=await html('/dock/cabin');assert.ok(room.includes('place:table'));assert.ok(room.includes('place:window'));assert.ok(room.includes('place:corner'));
const forcedSale=await collectionIssue(DB,alice,'sell',{item:'lamp',coins:0});assert.equal((await apply(forcedSale)).status,409);
assert.equal((await apply(await collectionIssue(DB,alice,'clear',{slot:1}))).status,303);assert.equal(qty(alice,'lamp'),1);
assert.equal((await change('/world/furnishings',{action:'place',item:'lamp',slot:'5',position:'floor'})).status,400);
// Ticket access uses server Taiwan time and one transactional debit per evening.
const actualNow=Date.now;try{
 Date.now=()=>Date.parse('2026-11-17T12:59:59Z');assert.equal(livingWindow().open,false);assert.ok(!(await html('/world/fireworks')).includes('<div class="fireworks-stage" data-private-fireworks>'));
 Date.now=()=>Date.parse('2026-11-17T13:00:00Z');assert.equal(livingWindow().open,true);
 const entry=tokens(await html('/world/fireworks')).find(f=>f.body.includes('value="admit"'));assert.ok(entry);
 assert.equal((await change('/world/fireworks',{action:'admit',token:entry.token},bob)).status,409);
 assert.equal((await change('/world/fireworks',{action:'admit',token:entry.token},alice,true)).status,403);
 sql.prepare("UPDATE island_collection_inventory SET quantity=0 WHERE visitor_key=? AND item_id='firework_ticket'").run(alice);
 assert.equal((await change('/world/fireworks',{action:'admit',token:entry.token})).status,409);assert.equal(sql.prepare('SELECT count(*) n FROM island_firework_admissions WHERE visitor_key=?').get(alice).n,0);
 sql.prepare("UPDATE island_collection_inventory SET quantity=1 WHERE visitor_key=? AND item_id='firework_ticket'").run(alice);
 assert.equal((await change('/world/fireworks',{action:'admit',token:entry.token})).status,303);assert.equal(qty(alice,'firework_ticket'),0);
 assert.equal((await change('/world/fireworks',{action:'admit',token:entry.token})).status,303);assert.equal(qty(alice,'firework_ticket'),0);
 assert.match(await html('/world/fireworks'),/<div class="fireworks-stage" data-private-fireworks>/);assert.match(await html('/world'),/<div class="fireworks-stage" data-private-fireworks>/);assert.ok(!(await html('/world/fireworks',bob)).includes('<div class="fireworks-stage" data-private-fireworks>'));
 Date.now=()=>Date.parse('2026-11-17T13:10:00Z');assert.equal(livingWindow().open,false);assert.ok(!(await html('/world/fireworks')).includes('<div class="fireworks-stage" data-private-fireworks>'));
 Date.now=()=>Date.parse('2026-11-18T13:00:00Z');assert.ok(!(await html('/world/fireworks')).includes('<div class="fireworks-stage" data-private-fireworks>'));assert.equal((await change('/world/fireworks',{action:'admit',token:entry.token})).status,409);
}finally{Date.now=actualNow;}
// Water returns only one plot and summary, without issuing unrelated garden tokens.
await gardenInit(DB,alice);await gardenApply(DB,alice,await gardenIssue(DB,alice,'starter'));
const cropBefore=sql.prepare('SELECT revision FROM island_garden_plots WHERE visitor_key=? AND slot=1').get(alice);
await gardenApply(DB,alice,await gardenIssue(DB,alice,'plant',{slot:1,revision:cropBefore.revision,crop:'herb',input:'seed_herb'}));
const water=await gardenIssue(DB,alice,'water',{slot:1,revision:cropBefore.revision+1,crop:'herb',duration:300000});
const pendingBefore=sql.prepare('SELECT count(*) n FROM island_garden_operations').get().n;
const waterRequest=()=>new Request(origin+'/world/garden',{method:'POST',headers:{Cookie:'atlas_islander='+alice,Origin:origin,'Content-Type':'application/x-www-form-urlencoded','X-Atlas-Fragment':'garden-plot'},body:new URLSearchParams({action:'apply',token:water})});
const watered=await worker.fetch(waterRequest(),{DB});assert.equal(watered.status,200);assert.match(watered.headers.get('Content-Type'),/application\/json/);
const fragment=await watered.json();assert.ok(fragment.html.includes('id="garden-plot-1"'));assert.ok(!fragment.html.includes('garden-plot-2'));assert.ok(fragment.html.length<9000);assert.ok(!fragment.html.includes('/i18n/runtime'));assert.equal(sql.prepare('SELECT count(*) n FROM island_garden_operations').get().n,pendingBefore);
const readyAt=sql.prepare('SELECT ready_at FROM island_garden_plots WHERE visitor_key=? AND slot=1').get(alice).ready_at;
assert.equal((await worker.fetch(waterRequest(),{DB})).status,200);assert.equal(sql.prepare('SELECT ready_at FROM island_garden_plots WHERE visitor_key=? AND slot=1').get(alice).ready_at,readyAt);
assert.equal(sql.prepare("SELECT count(*) n FROM island_character_growth WHERE visitor_key=? AND source=?").get(alice,'water:'+water).n,1);
assert.deepEqual(audit.report().missing,[]);
console.log('V100 PASS: purchase/wear ownership, species styles and experience, daily caps, token/origin/isolation/replay guards, actual furniture placement/reservation/removal, and server-time private fireworks ticket admission/next-day boundaries.');
