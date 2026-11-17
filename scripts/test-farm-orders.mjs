import {collectionIssue,collectionApply} from '../worker/collection.js';
import {gardenInit,gardenIssue,gardenApply} from '../worker/garden.js';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {farmOffers,farmIssue,farmApply,farmQuote,farmTemplates,farmOrderStage} from '../worker/farm-orders.js';
import {economyConfig,economyPeriod,economyMarket,economyIndices,economySnapshot,economyOfficial} from '../worker/economy-engine.js';
import {createI18nAudit} from './i18n-audit.mjs';
const worker=(await import(process.env.FARM_BUILD==='1'?'../dist/server/index.js':'../worker/index.js')).default;
const sql=new DatabaseSync(':memory:');sql.exec('PRAGMA foreign_keys=ON');for(const f of readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));
const DB={prepare(query){const p=sql.prepare(query);function bind(...args){return{first:async()=>p.get(...args),all:async()=>({results:p.all(...args)}),run:async()=>({meta:p.run(...args)}),executeBatch:()=>p.columns().length?{results:p.all(...args)}:{meta:p.run(...args)},bind}}return bind();},async batch(rows){sql.exec('BEGIN');try{const results=rows.map(s=>s.executeBatch());sql.exec('COMMIT');return results;}catch(e){sql.exec('ROLLBACK');throw e;}}};
const origin='https://economy.test',env={DB},audit=createI18nAudit();
const get=async(path,headers={})=>audit.response(await worker.fetch(new Request(origin+path,{headers}),env),path);

for(let period=0;period<16;period++)for(const template of farmTemplates){const quote=farmQuote(template,economySnapshot(period));assert.ok(quote.quantity<=4&&quote.reward<=30&&Number.isInteger(quote.unit));assert.deepEqual(quote,farmQuote(template,economySnapshot(period)));}
assert.equal(farmQuote(farmTemplates[0],economySnapshot(1)).unit,4);
assert.equal(farmQuote(farmTemplates[1],economySnapshot(2)).quantity,3);
assert.equal(farmQuote(farmTemplates[2],economySnapshot(2)).quantity,2);
const a='a'.repeat(48),b='b'.repeat(48);for(const key of[a,b]){sql.prepare('INSERT INTO island_passports VALUES(?,?,?,?,?)').run(key,'Farm tester','rabbit','picnic',1);sql.prepare('INSERT INTO island_credentials(visitor_key) VALUES(?)').run(key);}
const time=economyConfig.baseStart+economyConfig.weekMs+1000;
await farmOffers(DB,a,time);await farmOffers(DB,a,time);const offers=sql.prepare('SELECT * FROM island_farm_orders WHERE visitor_key=? ORDER BY template_id').all(a);assert.equal(offers.length,3);assert.equal(offers[0].item_id,'carrot');assert.equal(offers[0].quantity,2);assert.ok(offers.every(o=>o.reward===o.quantity*o.unit_reward&&o.reward<=30));
const carrot=offers[0];sql.prepare('INSERT INTO island_collection_inventory VALUES(?,?,?,?)').run(a,'carrot',3,time);
const before=sql.prepare('SELECT quantity FROM island_collection_inventory WHERE visitor_key=? AND item_id=?').get(a,'carrot').quantity;
const accept=await farmIssue(DB,a,carrot.id,'accept',time);assert.equal((await farmApply(DB,b,accept,time)).status,403);assert.equal((await farmApply(DB,a,accept,time)).status,303);assert.equal((await farmApply(DB,a,accept,time)).replay,true);assert.equal(sql.prepare('SELECT quantity FROM island_collection_inventory WHERE visitor_key=? AND item_id=?').get(a,'carrot').quantity,before);
const accepted=sql.prepare('SELECT * FROM island_farm_orders WHERE id=?').get(carrot.id);assert.equal(accepted.due_at,time+1209600000);
// V95 navigation projects real accepted orders and account-private stock.
const orderSummary=await(await get('/dock/adventure',{Cookie:'atlas_islander='+a})).text();assert.match(orderSummary,/id="pocket-orders"/);assert.ok(orderSummary.includes('data-pocket-order="'+carrot.id+'"'));
const bagOrder=await(await get('/dock/collection?item=carrot',{Cookie:'atlas_islander='+a})).text();assert.ok(bagOrder.includes('/world/farm-orders#order-'+carrot.id));
assert.ok(!(await(await get('/dock/adventure',{Cookie:'atlas_islander='+b})).text()).includes('data-pocket-order="'+carrot.id+'"'));

await farmOffers(DB,a,time+economyConfig.weekMs);assert.equal(sql.prepare('SELECT reward FROM island_farm_orders WHERE id=?').get(carrot.id).reward,carrot.reward);assert.throws(()=>sql.exec('UPDATE island_farm_orders SET reward=29'),/immutable/);
// Two displayed carrots leave only one available; blocked delivery consumes nothing.
sql.prepare('INSERT INTO island_collection_displays(visitor_key,slot,item_id) VALUES(?,?,?)').run(a,1,'carrot');sql.prepare('INSERT INTO island_collection_displays(visitor_key,slot,item_id) VALUES(?,?,?)').run(a,2,'carrot');
const deliver=await farmIssue(DB,a,carrot.id,'deliver',time);assert.equal((await farmApply(DB,a,deliver,time)).status,409);assert.equal(sql.prepare('SELECT coins FROM island_collection_wallets WHERE visitor_key=?').get(a).coins,0);
sql.prepare('DELETE FROM island_collection_displays WHERE visitor_key=? AND slot=2').run(a);
sql.exec("CREATE TRIGGER farm_fixture_fail BEFORE INSERT ON island_collection_ledger WHEN NEW.kind='farm_income' BEGIN SELECT RAISE(ABORT,'fixture');END");assert.equal((await farmApply(DB,a,deliver,time)).status,409);assert.equal(sql.prepare('SELECT quantity FROM island_collection_inventory WHERE visitor_key=? AND item_id=?').get(a,'carrot').quantity,3);assert.equal(sql.prepare('SELECT coins FROM island_collection_wallets WHERE visitor_key=?').get(a).coins,0);assert.equal(sql.prepare('SELECT status FROM island_farm_orders WHERE id=?').get(carrot.id).status,'accepted');assert.equal(sql.prepare('SELECT applied_at FROM island_farm_order_operations WHERE token=?').get(deliver).applied_at,null);sql.exec('DROP TRIGGER farm_fixture_fail');
const competing=await farmIssue(DB,a,carrot.id,'deliver',time);const outcomes=await Promise.all([farmApply(DB,a,deliver,time),farmApply(DB,a,competing,time)]);assert.equal(outcomes.filter(r=>r.status===303).length,1);assert.equal((await farmApply(DB,a,deliver,time)).replay,true);assert.equal(sql.prepare('SELECT quantity FROM island_collection_inventory WHERE visitor_key=? AND item_id=?').get(a,'carrot').quantity,1);assert.equal(sql.prepare('SELECT coins FROM island_collection_wallets WHERE visitor_key=?').get(a).coins,carrot.reward);assert.equal(sql.prepare("SELECT count(*) n FROM island_collection_ledger WHERE kind IN ('farm_deliver','farm_income')").get().n,2);
const herb=offers.find(o=>o.item_id==='herb');const decline=await farmIssue(DB,a,herb.id,'decline',time);assert.equal((await farmApply(DB,a,decline,time)).status,303);assert.equal((await farmApply(DB,a,await farmIssue(DB,a,herb.id,'accept',time),time)).status,409);
const tomato=offers.find(o=>o.item_id==='tomato');assert.equal((await farmApply(DB,a,await farmIssue(DB,a,tomato.id,'accept',time),time)).status,303);assert.equal((await farmApply(DB,a,await farmIssue(DB,a,tomato.id,'cancel',time),time)).status,303);
await farmOffers(DB,b,time);const expired=sql.prepare('SELECT * FROM island_farm_orders WHERE visitor_key=? LIMIT 1').get(b);const stale=await farmIssue(DB,b,expired.id,'accept',time);assert.equal((await farmApply(DB,b,stale,time+1800001)).status,409);const afterExpiry=await farmIssue(DB,b,expired.id,'accept',expired.expires_at);assert.equal((await farmApply(DB,b,afterExpiry,expired.expires_at)).status,409);
// Bounded active orders across weeks, wallet overflow and expiry leave assets untouched.
const c='c'.repeat(48);sql.prepare('INSERT INTO island_passports VALUES(?,?,?,?,?)').run(c,'Boundary tester','rabbit','picnic',1);sql.prepare('INSERT INTO island_credentials(visitor_key) VALUES(?)').run(c);
await farmOffers(DB,c,time);const capped=sql.prepare('SELECT * FROM island_farm_orders WHERE visitor_key=?').all(c);
for(const order of capped)assert.equal((await farmApply(DB,c,await farmIssue(DB,c,order.id,'accept',time),time)).status,303);
await farmOffers(DB,c,time+economyConfig.weekMs);const fourth=sql.prepare('SELECT * FROM island_farm_orders WHERE visitor_key=? AND period=2 LIMIT 1').get(c);
assert.equal((await farmApply(DB,c,await farmIssue(DB,c,fourth.id,'accept',time+economyConfig.weekMs),time+economyConfig.weekMs)).status,409);
const target=capped.find(o=>o.item_id==='carrot');sql.prepare('INSERT INTO island_collection_inventory VALUES(?,?,?,?)').run(c,'carrot',2,time);
sql.prepare('UPDATE island_collection_wallets SET coins=999999 WHERE visitor_key=?').run(c);
assert.equal((await farmApply(DB,c,await farmIssue(DB,c,target.id,'deliver',time),time)).status,409);
assert.equal(sql.prepare('SELECT quantity FROM island_collection_inventory WHERE visitor_key=? AND item_id=?').get(c,'carrot').quantity,2);
assert.equal(sql.prepare('SELECT coins FROM island_collection_wallets WHERE visitor_key=?').get(c).coins,999999);
sql.prepare('UPDATE island_collection_wallets SET coins=0 WHERE visitor_key=?').run(c);
const escrow=await gardenIssue(DB,c,'trade_post',{item:'carrot',want:'seed_carrot',target:b,reference:crypto.randomUUID()},time);assert.equal((await gardenApply(DB,c,escrow,time)).status,303);
assert.equal((await farmApply(DB,c,await farmIssue(DB,c,target.id,'deliver',time),time)).status,409);
assert.equal(sql.prepare('SELECT quantity FROM island_collection_inventory WHERE visitor_key=? AND item_id=?').get(c,'carrot').quantity,1);
const overdue=time+1209600000;assert.equal((await farmApply(DB,c,await farmIssue(DB,c,target.id,'deliver',overdue),overdue)).status,409);
assert.equal((await farmApply(DB,c,await farmIssue(DB,c,target.id,'cancel',overdue),overdue)).status,303);
const noStock=capped.find(o=>o.item_id==='herb');assert.equal((await farmApply(DB,c,await farmIssue(DB,c,noStock.id,'deliver',time),time)).status,409);
assert.equal(sql.prepare('SELECT count(*) n FROM island_collection_ledger WHERE visitor_key=? AND kind LIKE \'farm_%\'').get(c).n,0);
const receipt=await (await get('/world/market',{Cookie:'atlas_islander='+a})).text();assert.ok(receipt.includes('8</p>'));assert.ok(receipt.includes('data-i18n="market.records"'));assert.ok(!(await (await get('/world/market',{Cookie:'atlas_islander='+b})).text()).includes('class="market-receipt"'));
assert.equal((await worker.fetch(new Request(origin+'/world/market',{method:'POST'}),env)).status,405);
assert.equal((await get('/world/market?page=0')).status,400);
assert.equal((await get('/world/market?lang=en')).status,200);
const marketBefore=sql.prepare('SELECT coins FROM island_collection_wallets WHERE visitor_key=?').get(a).coins;await get('/world/market',{Cookie:'atlas_islander='+a});assert.equal(sql.prepare('SELECT coins FROM island_collection_wallets WHERE visitor_key=?').get(a).coins,marketBefore);

// V93 full existing life loop: seed -> harvest -> order -> income -> shop -> shelf -> cottage.
const d='d'.repeat(48);sql.prepare('INSERT INTO island_passports VALUES(?,?,?,?,?)').run(d,'Life loop','rabbit','picnic',1);sql.prepare('INSERT INTO island_credentials(visitor_key) VALUES(?)').run(d);
await gardenInit(DB,d,time);await farmOffers(DB,d,time);
const act=async(kind,data,t=time)=>gardenApply(DB,d,await gardenIssue(DB,d,kind,data,t),t);
assert.equal((await act('starter')).status,303);assert.equal((await act('plant',{slot:1,revision:0,crop:'herb',input:'seed_herb'})).status,303);
assert.equal((await act('water',{slot:1,revision:1,crop:'herb',duration:300000})).status,303);
assert.equal((await act('harvest',{slot:1,revision:2,crop:'herb',item:'herb'},time+300000)).status,303);
const life=sql.prepare('SELECT * FROM island_farm_orders WHERE visitor_key=? AND template_id=?').get(d,'herb');assert.equal((await farmApply(DB,d,await farmIssue(DB,d,life.id,'accept',time+300000),time+300000)).status,303);assert.equal((await farmApply(DB,d,await farmIssue(DB,d,life.id,'deliver',time+300000),time+300000)).status,303);
assert.equal((await collectionApply(DB,d,await collectionIssue(DB,d,'buy',{item:'tray',coins:-8},time+300000),time+300000)).status,303);
assert.equal((await collectionApply(DB,d,await collectionIssue(DB,d,'display',{item:'tray',slot:1},time+300000),time+300000)).status,303);
const cottage=await get('/dock/cabin',{Cookie:'atlas_islander='+d});assert.equal(cottage.status,200);assert.equal(sql.prepare('SELECT item_id FROM island_collection_displays WHERE visitor_key=?').get(d).item_id,'tray');
for(const path of ['/world','/world/garden','/world/farm-orders','/dock/shop','/dock/collection'])assert.ok((await(await get(path,{Cookie:'atlas_islander='+d})).text()).includes(path==='/world'?'data-public-harbor':['/dock/shop','/dock/collection','/world/farm-orders','/world/garden'].includes(path)?'data-pocket-nav':'data-simple-next'));
const homeHtml=await(await get('/world')).text();assert.ok(!homeHtml.includes('<nav class="simple-directions"'));assert.ok(homeHtml.includes('<details class="econ-home-details">'));assert.ok(!homeHtml.includes('<details class="econ-home-details" open'));
const bagHtml=await(await get('/dock/collection',{Cookie:'atlas_islander='+d})).text();const nav=bagHtml.match(/<nav class="pocket-tabs">[\s\S]*?<\/nav>/)[0];assert.equal((nav.match(/<a /g)||[]).length,4);assert.match(nav,/href="\/dock\/collection" aria-current="page"/);
const state=await economyOfficial(DB,time);assert.equal(state.current.bbi,102.5);assert.equal(state.current.bcpi,economySnapshot(1).bcpi);
for(const path of ['/world/market','/world/farm-orders','/world/garden','/dock/collection']){const response=await get(path,{Cookie:'atlas_islander='+a});assert.equal(response.status,200,path);}
assert.equal((await get('/world/farm-orders?page=bad',{Cookie:'atlas_islander='+a})).status,400);
const post=async(fields,key=a,foreign=false)=>worker.fetch(new Request(origin+'/world/farm-orders',{method:'POST',headers:{Cookie:'atlas_islander='+key,Origin:foreign?'https://evil.test':origin,'Sec-Fetch-Site':foreign?'cross-site':'same-origin','Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(fields)}),env);
assert.equal((await post({token:deliver,quantity:999})).status,400);assert.equal((await post({token:deliver},a,true)).status,403);assert.equal((await post({token:deliver},b)).status,403);assert.equal((await post({token:deliver},'')).status,403);
// Only an accepted, unexpired order with enough unreserved stock prompts delivery in the garden.
await farmOffers(DB,b,Date.now());
const gardenOffer=sql.prepare("SELECT * FROM island_farm_orders WHERE visitor_key=? AND status='offered' ORDER BY created_at DESC LIMIT 1").get(b);
assert.ok(gardenOffer);
assert.equal((await farmApply(DB,b,await farmIssue(DB,b,gardenOffer.id,'accept',Date.now()),Date.now())).status,303);
sql.prepare('INSERT INTO island_collection_inventory(visitor_key,item_id,quantity,first_at) VALUES(?,?,?,?) ON CONFLICT(visitor_key,item_id) DO UPDATE SET quantity=excluded.quantity').run(b,gardenOffer.item_id,gardenOffer.quantity,Date.now());
const gardenReady=await(await get('/world/garden',{Cookie:'atlas_islander='+b})).text();assert.ok(gardenReady.includes('data-garden-delivery'));assert.ok(gardenReady.includes('#order-'+gardenOffer.id));
assert.ok(!(await(await get('/world/garden',{Cookie:'atlas_islander='+d})).text()).includes('#order-'+gardenOffer.id));
sql.prepare('UPDATE island_collection_inventory SET quantity=0 WHERE visitor_key=? AND item_id=?').run(b,gardenOffer.item_id);
assert.ok(!(await(await get('/world/garden',{Cookie:'atlas_islander='+b})).text()).includes('#order-'+gardenOffer.id));
assert.equal(audit.report().missing.length,0,JSON.stringify(audit.report().missing));
console.log('V91 PASS: three unique offers/week, fixed accepted terms, owner/origin/token guards, no acceptance debit, display reservation, atomic delivery rollback, competing/replayed settlement, dual ledger, cancellation/decline/expiry, independent official indices and bilingual pages. Stage='+farmOrderStage);
