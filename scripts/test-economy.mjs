import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {economyConfig,economyPeriod,economyMarket,economyIndices,economySnapshot,economyOfficial} from '../worker/economy-engine.js';
import {createI18nAudit} from './i18n-audit.mjs';
const worker=(await import(process.env.ECONOMY_BUILD==='1'?'../dist/server/index.js':'../worker/index.js')).default;
const sql=new DatabaseSync(':memory:');sql.exec('PRAGMA foreign_keys=ON');for(const f of readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));
const DB={prepare(query){const p=sql.prepare(query);function bind(...args){return{first:async()=>p.get(...args),all:async()=>({results:p.all(...args)}),run:async()=>({meta:p.run(...args)}),executeBatch:()=>p.columns().length?{results:p.all(...args)}:{meta:p.run(...args)},bind}}return bind();},async batch(rows){sql.exec('BEGIN');try{const results=rows.map(s=>s.executeBatch());sql.exec('COMMIT');return results;}catch(e){sql.exec('ROLLBACK');throw e;}}};
const origin='https://economy.test',env={DB},audit=createI18nAudit();
const get=async(path,headers={})=>audit.response(await worker.fetch(new Request(origin+path,{headers}),env),path);
assert.equal(Object.values(economyConfig.weights).reduce((a,b)=>a+b,0),1);
const baseline=economySnapshot(0);assert.equal(baseline.bbi,100);assert.equal(baseline.bcpi,100);assert.equal(baseline.baseBasket,475);assert.equal(baseline.bcpiWeekly,null);
const harvest=economySnapshot(1),festival=economySnapshot(2),building=economySnapshot(3),stable=economySnapshot(4);
assert.equal(harvest.bbi,102.5);assert.equal(harvest.goods[0].price,8.4515);assert.equal(harvest.goods[0].quantity,100);assert.equal(harvest.goods[0].supply,140);assert.ok(harvest.bcpi<100);assert.ok(festival.bbi>100&&festival.bcpi>100);assert.ok(building.goods.find(g=>g.id==='wood').price>15);assert.equal(stable.bbi,100);assert.equal(stable.bcpi,100);
assert.equal(economyPeriod(economyConfig.baseStart+economyConfig.weekMs-1),0);assert.equal(economyPeriod(economyConfig.baseStart+economyConfig.weekMs),1);
for(let i=0;i<120;i++){const s=economySnapshot(i);assert.deepEqual(economySnapshot(i),s);const cost=s.goods.reduce((n,g)=>n+g.price*g.basketQty,0);assert.ok(Math.abs(s.bcpi-cost/475*100)<.0001);assert.ok(Math.abs(s.bbi-100-Object.values(s.contributions).reduce((a,b)=>a+b,0))<.001);if(i){const p=economySnapshot(i-1);assert.ok(Math.abs(s.bcpiWeekly-(s.bcpi/p.bcpi-1)*100)<.0001);}for(const g of s.goods){assert.ok(g.price>=g.basePrice*.5&&g.price<=g.basePrice*2);assert.equal(g.basketQty,economyConfig.goods.find(x=>x.id===g.id).basketQty);}if(i<53)assert.equal(s.bcpiAnnual,null);}
assert.notEqual(economySnapshot(53).bcpiAnnual,null);assert.equal(economySnapshot(53).annualReference,0);
assert.equal(economySnapshot(5).goods[0].price,harvest.goods[0].price,'events never compound');
assert.throws(()=>economyMarket('user-price'));assert.throws(()=>economyMarket('harvest',999));assert.throws(()=>economySnapshot(-1));assert.throws(()=>economySnapshot(1.1));
const strong=economyMarket('harvest',2);assert.ok(strong[0].price<harvest.goods[0].price);assert.equal(economyIndices(economyMarket('stable')).bcpi,100);
// Atomic snapshot failure cannot leave half a period or event; retry reconstructs exactly.
sql.exec("CREATE TRIGGER fixture_fail BEFORE INSERT ON island_economy_prices WHEN NEW.period=1 AND NEW.good_id='wood' BEGIN SELECT RAISE(ABORT,'fixture'); END");
await assert.rejects(()=>economyOfficial(DB,economyConfig.baseStart+economyConfig.weekMs));assert.equal(sql.prepare('SELECT count(*) n FROM island_economy_snapshots WHERE period=1').get().n,0);assert.equal(sql.prepare('SELECT count(*) n FROM island_economy_prices WHERE period=1').get().n,0);assert.equal(sql.prepare('SELECT count(*) n FROM island_economy_events WHERE period=1').get().n,0);sql.exec('DROP TRIGGER fixture_fail');
const first=await economyOfficial(DB,economyConfig.baseStart+economyConfig.weekMs*3),repeat=await economyOfficial(DB,economyConfig.baseStart+economyConfig.weekMs*3+1000);assert.deepEqual(first,repeat);assert.equal(first.history.length,4);assert.equal(sql.prepare('SELECT count(*) n FROM island_economy_events').get().n,3);assert.equal(sql.prepare('SELECT count(*) n FROM island_economy_prices').get().n,24);
for(const table of ['config','goods','snapshots','prices','events']){assert.throws(()=>sql.exec('DELETE FROM island_economy_'+table));}
assert.throws(()=>sql.exec("UPDATE island_economy_snapshots SET snapshot_json='{}'"));
// Existing identities and assets are unchanged by official data, experiments, malformed inputs or rejected writes.
const a='8'.repeat(48),b='9'.repeat(48);for(const [key,name]of [[a,'Alice'],[b,'Bob']]){sql.prepare('INSERT INTO island_passports VALUES(?,?,?,?,?)').run(key,name,'rabbit','picnic',1);sql.prepare('INSERT INTO island_credentials(visitor_key) VALUES(?)').run(key);}
sql.prepare('INSERT INTO island_collection_wallets VALUES(?,?)').run(a,123);sql.prepare('INSERT INTO island_collection_inventory VALUES(?,?,?,?)').run(a,'carrot',7,1);sql.prepare('INSERT INTO island_garden_plots(visitor_key,slot,crop_id,planted_at,watered_at,ready_at,revision) VALUES(?,?,?,?,?,?,?)').run(a,1,'carrot',1,2,9999999999999,2);
const identities=sql.prepare('SELECT * FROM island_passports').all();const assetTables=['island_collection_wallets','island_collection_inventory','island_collection_ledger','island_garden_plots','island_garden_trades'];const assets=()=>assetTables.map(t=>sql.prepare('SELECT * FROM '+t).all());const before=assets();
assert.equal(economySnapshot(52).bcpiAnnual,null);assert.notEqual(economySnapshot(53).bcpiAnnual,null);assert.equal(economySnapshot(53).annualReference,0);
assert.throws(()=>economyMarket('unknown'));assert.throws(()=>economyMarket('harvest',999));assert.throws(()=>economySnapshot(-1));
assert.deepEqual(economyMarket('harvest',0),economyMarket('stable'));
assert.ok(economyMarket('harvest',2)[0].price<economyMarket('harvest',1)[0].price);
const concurrent=await Promise.all([economyOfficial(DB),economyOfficial(DB)]);assert.deepEqual(concurrent[0],concurrent[1]);const periods=Math.max(economyPeriod()+1,4);assert.equal(sql.prepare('SELECT count(*) n FROM island_economy_snapshots').get().n,periods);assert.equal(sql.prepare('SELECT count(*) n FROM island_economy_prices').get().n,periods*6);
assert.throws(()=>sql.exec('UPDATE island_economy_prices SET price=999'),/immutable/);assert.throws(()=>sql.exec('DELETE FROM island_economy_snapshots'),/immutable/);
const officialA=await(await get('/world/economy/snapshot?bbi=999999',{Cookie:'atlas_islander='+a})).json(),officialB=await(await get('/world/economy/snapshot?period=99999',{Cookie:'atlas_islander='+b})).json();assert.deepEqual(officialA,officialB);assert.equal(officialA.current.period,economyPeriod());assert.equal(officialA.integrity.digests.length,officialA.history.length);
for(const path of ['/world','/islands']){const page=await get(path);assert.equal(page.status,200);const text=await page.text();assert.match(text,/data-economy-home/);assert.ok(text.includes(officialA.current.bbi.toFixed(2))&&text.includes(officialA.current.bcpi.toFixed(2)));assert.ok(text.indexOf('data-economy-home')<text.indexOf('id="dock-activities"'));assert.match(text,/href="\/world\/observatory#economy-desk"/);}

for(const scenario of ['harvest','festival','building','<img src=x onerror=alert(1)>']){const r=await get('/world/observatory?topic=experiment&scenario='+encodeURIComponent(scenario)+'&strength=2&bbi=999999');assert.equal(r.status,200);const text=await r.text();assert.ok(text.includes('economy.experimentResult'));assert.ok(!text.includes('onerror=alert'));}
for(const method of ['POST','PUT','DELETE'])for(const path of ['/world/observatory','/world/economy/snapshot'])assert.equal((await worker.fetch(new Request(origin+path,{method,body:'bbi=999999'}),env)).status,405);
assert.deepEqual(assets(),before);assert.deepEqual(sql.prepare('SELECT * FROM island_passports').all(),identities);
const i18n=audit.report();assert.equal(i18n.missing.length,0,JSON.stringify(i18n.missing));
// Deliberate corruption must be detected; simulate an administrator modifying storage, not a player API.
sql.exec('DROP TRIGGER island_economy_snapshots_update');sql.exec("UPDATE island_economy_snapshots SET snapshot_json='{}' WHERE period=0");await assert.rejects(()=>economyOfficial(DB),/integrity/);assert.equal((await get('/world/economy/snapshot')).status,503);const room=await get('/world/observatory');assert.equal(room.status,200);assert.match(await room.text(),/economy.unavailable/);const map=await get('/world');assert.equal(map.status,200);assert.match(await map.text(),/data-public-harbor/);
console.log('V90.2 PASS: fixed formulas/basket, 120 reproducible periods, period boundary, annual sufficiency, bounded expiring events, independent resettable lab, atomic failure/retry, immutable raw snapshots, shared official data, no financial POST/asset mutations, corruption fallback and bilingual UI.');
