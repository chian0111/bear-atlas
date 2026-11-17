import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {collectionReady,collectionInit,collectionSpawn,collectionIssue,collectionApply,collectionDay} from '../worker/collection.js';
import {createI18nAudit} from './i18n-audit.mjs';
const worker=(await import(process.env.COLLECTION_BUILD==='1'?'../dist/server/index.js':'../worker/index.js')).default;
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
assert.equal(await collectionReady(DB),true);
assert.equal((await get('/dock/collection','')).status,200);assert.equal((await post({action:'apply',token:'x'},'')).status,403);
assert.equal((await post({action:'apply',token:'x'},alice,true)).status,403);
assert.equal((await post({action:'apply',token:'x',coins:'999999'})).status,400);
assert.equal((await post({action:'apply',token:'x&token=y'})).status,403);
assert.equal((await get('/dock/collection?page=0')).status,400);
assert.match(await html('/dock/collection'),/背包還很輕/);
const beach=await html('/world/beach'),pick=tokens(beach).filter(f=>f.body.includes('collection.pick'));
assert.equal(pick.length,6);const beforeCount=sql.prepare('SELECT count(*) n FROM island_collection_spawns WHERE visitor_key=?').get(alice).n;
await html('/world/beach');assert.equal(sql.prepare('SELECT count(*) n FROM island_collection_spawns WHERE visitor_key=?').get(alice).n,beforeCount);
assert.equal((await post({action:'apply',token:pick[0].token},bob)).status,403);
assert.equal((await apply(pick[0].token)).status,303);assert.equal(qty(alice,'scallop'),1);assert.equal(qty(bob,'scallop'),0);
assert.equal((await apply(pick[0].token)).status,303);assert.equal(qty(alice,'scallop'),1);assert.equal(ledger(alice).length,1);
// Refresh-issued competing token cannot collect the same spawn twice.
const duplicate=await collectionIssue(DB,alice,'pick',{item:'scallop',reference:collectionDay()+':beach:0',scene:'beach',slot:0});assert.equal((await apply(duplicate)).status,409);
for(const p of pick.slice(1))assert.equal((await apply(p.token)).status,303);
assert.equal(qty(alice,'scallop'),3);assert.equal(qty(alice,'spiral'),1);assert.match(await html('/world/beach'),/今天的小發現都收好了/);
// Expiry at Taiwan midnight; yesterday's pending token never yields a new-day pickup.
const late=Date.parse('2026-11-16T15:59:59Z');await collectionSpawn(DB,bob,'beach',late);await collectionInit(DB,bob);
const midnight=await collectionIssue(DB,bob,'pick',{item:'scallop',reference:'2026-11-16:beach:0',scene:'beach',slot:0},late);assert.equal((await collectionApply(DB,bob,midnight,late+1001)).status,409);
await collectionSpawn(DB,bob,'beach',late+1001);assert.equal(sql.prepare('SELECT count(*) n FROM island_collection_spawns WHERE visitor_key=? AND day=?').get(bob,'2026-11-17').n,6);
let bag=await html('/dock/collection');const display=tokens(card(bag,'spiral')).find(f=>f.body.includes('collection.slot'));
assert.equal((await apply(display.token)).status,303);assert.match(await html('/dock/cabin'),/data-collection-room-shelf/);assert.match(await html('/dock/cabin'),/collection.spiral/);
assert.equal((await post({action:'gift-prepare',item:'spiral',member:'BEAR-0002'})).status,409);
const forcedSell=await collectionIssue(DB,alice,'sell',{item:'spiral',coins:3});assert.equal((await apply(forcedSell)).status,409);assert.equal(qty(alice,'spiral'),1);
// Craft input/output and receipt are atomic; displayed source materials stay reserved.
let shop=await html('/dock/shop');const craft=tokens(card(shop,'mobile'))[0];assert.ok(craft);
assert.equal((await apply(craft.token)).status,303);assert.equal(qty(alice,'scallop'),0);assert.equal(qty(alice,'mobile'),1);
assert.equal((await apply(craft.token)).status,303);assert.equal(qty(alice,'mobile'),1);assert.equal(ledger(alice).filter(r=>r.kind==='material')[0].quantity_delta,-3);
// No balance means no purchase and no negative wallet.
const poor=await collectionIssue(DB,alice,'buy',{item:'vase',coins:-12});assert.equal((await apply(poor)).status,409);assert.equal(coins(alice),0);assert.equal(qty(alice,'vase'),0);
bag=await html('/dock/collection');const clamSell=tokens(card(bag,'clam')).find(f=>f.body.includes('collection.sell'));
assert.equal((await apply(clamSell.token)).status,303);assert.equal(coins(alice),2);assert.equal(qty(alice,'clam'),1);
// Existing quest cards are not consumed and each claimed card grants one optional bonus only.
sql.prepare('INSERT INTO island_adventure_rewards VALUES(?,?,?,?)').run(alice,'welcome','',1);
bag=await html('/dock/collection');const bonus=tokens(bag).find(f=>f.body.includes('collection.claim'));
assert.equal((await apply(bonus.token)).status,303);assert.equal(coins(alice),12);assert.equal(sql.prepare('SELECT count(*) n FROM island_adventure_rewards WHERE visitor_key=?').get(alice).n,1);
const bonusAgain=await collectionIssue(DB,alice,'reward',{coins:10,reference:'welcome@'});assert.equal((await apply(bonusAgain)).status,409);assert.equal(coins(alice),12);
shop=await html('/dock/shop');const buy=tokens(card(shop,'vase'))[0];assert.ok(buy);
// Injected failure rolls back debit, item creation, token consumption and ledger.
sql.exec("CREATE TRIGGER collection_fixture_failure BEFORE INSERT ON island_collection_ledger WHEN NEW.kind='buy' BEGIN SELECT RAISE(ABORT,'fixture');END");
assert.equal((await apply(buy.token)).status,409);assert.equal(coins(alice),12);assert.equal(qty(alice,'vase'),0);assert.equal(sql.prepare('SELECT applied_at FROM island_collection_operations WHERE token=?').get(buy.token).applied_at,null);
sql.exec('DROP TRIGGER collection_fixture_failure');assert.equal((await apply(buy.token)).status,303);assert.equal(coins(alice),0);assert.equal(qty(alice,'vase'),1);
assert.equal((await apply(buy.token)).status,303);assert.equal(qty(alice,'vase'),1);
// V95: the verified purchase leads to the owned item, without accepting another account's receipt.
const receiptHtml=await html('/dock/shop?receipt='+buy.token);assert.match(receiptHtml,/data-pocket-receipt/);assert.match(receiptHtml,/item=vase/);
assert.ok(!(await html('/dock/shop?receipt='+buy.token,bob)).includes('data-pocket-receipt'));
assert.ok(!(await html('/dock/shop?receipt='+poor)).includes('data-pocket-receipt'));
const focused=await html('/dock/collection?item=vase&view=display');assert.match(focused,/id="item-vase"/);assert.match(focused,/<details class="pocket-item-actions" open>/);assert.match(focused,/<details class="pocket-more" id="display" open>/);
assert.ok(focused.indexOf('id="item-vase"')<focused.indexOf('id="display"'));
const tabs=focused.match(/<nav class="pocket-tabs">[\s\S]*?<\/nav>/)[0];assert.equal((tabs.match(/<a /g)||[]).length,4);assert.match(tabs,/aria-current="page"/);
const decor=await html('/dock/collection?filter=decor');assert.match(decor,/id="item-vase"/);assert.ok(!decor.includes('id="item-clam"'));
const materials=await html('/dock/collection?filter=material');assert.ok(!materials.includes('id="item-vase"'));
// Review exact recipient before the gift; forged identities/quantities are rejected.
assert.equal((await post({action:'gift-prepare',item:'mobile',member:'BEAR-0001'})).status,400);
const review=await post({action:'gift-prepare',item:'mobile',member:'BEAR-0002'});assert.equal(review.status,200);const reviewText=await review.text();assert.match(reviewText,/Bob/);assert.match(reviewText,/BEAR-0002/);
const gift=tokens(reviewText)[0].token;assert.equal((await post({action:'apply',token:gift,target_key:visitor})).status,400);
assert.equal(qty(alice,'mobile'),1);assert.equal(qty(bob,'mobile'),0);
assert.equal((await apply(gift)).status,303);assert.equal(qty(alice,'mobile'),0);assert.equal(qty(bob,'mobile'),1);assert.equal(ledger(bob).filter(l=>l.kind==='received').length,1);
assert.equal((await apply(gift)).status,303);assert.equal(qty(bob,'mobile'),1);
// Receiver at capacity fails without taking the sender's last item.
sql.prepare('UPDATE island_collection_inventory SET quantity=999 WHERE visitor_key=? AND item_id=?').run(bob,'mobile');sql.prepare('UPDATE island_collection_inventory SET quantity=1 WHERE visitor_key=? AND item_id=?').run(alice,'mobile');
const full=await collectionIssue(DB,alice,'gift',{item:'mobile',target:bob});assert.equal((await apply(full)).status,409);assert.equal(qty(alice,'mobile'),1);assert.equal(qty(bob,'mobile'),999);
// Forest collection and another crafting recipe use the shared inventory.
const forestTokens=tokens(await html('/world/forest')).filter(f=>f.body.includes('collection.pick'));assert.equal(forestTokens.length,3);for(const t of forestTokens)assert.equal((await apply(t.token)).status,303);
shop=await html('/dock/shop');const frame=tokens(card(shop,'frame'))[0];assert.equal((await apply(frame.token)).status,303);assert.equal(qty(alice,'leaf'),0);assert.equal(qty(alice,'frame'),1);
assert.match(await html('/dock/catalog'),/收藏圖鑑/);assert.match(await html('/dock/catalog'),/collection.discovered/);
// Account-private ledger/inventory and graceful absence of new schema.
assert.ok(!(await html('/dock/collection',visitor)).includes('奶油扇貝</span></h2>'));
assert.deepEqual(sql.prepare('SELECT * FROM island_passports').all(),original);assert.deepEqual(sql.prepare('SELECT * FROM island_credentials').all(),credentials);
sql.exec('ALTER TABLE island_collection_spawns RENAME TO collection_missing_fixture');assert.equal((await get('/dock/collection')).status,503);assert.equal((await get('/world')).status,200);assert.equal((await get('/world/beach')).status,200);
sql.exec('ALTER TABLE collection_missing_fixture RENAME TO island_collection_spawns');
// V97: new goods use the same atomic, account-owned settlement and display reservation.
sql.prepare('UPDATE island_collection_wallets SET coins=100 WHERE visitor_key=?').run(alice);
for(const id of ['bread','tea','berries','lamp','plant','clock']){
 const page=await html('/dock/shop?category='+(['bread','tea','berries'].includes(id)?'food':'decor'));
 const purchase=tokens(card(page,id))[0];assert.ok(purchase,id);
 assert.equal((await apply(purchase.token)).status,303);assert.equal(qty(alice,id),1);
 assert.equal((await apply(purchase.token)).status,303);assert.equal(qty(alice,id),1);
}
const foodBag=await html('/dock/collection?filter=food');assert.match(foodBag,/collection.bread/);assert.ok(!card(foodBag,'lamp'));
const eating=tokens(card(foodBag,'bread')).find(f=>f.body.includes('collection.eat'));
const balanceBefore=coins(alice);assert.equal((await post({action:'apply',token:eating.token},bob)).status,403);
assert.equal((await apply(eating.token)).status,303);assert.equal(qty(alice,'bread'),0);assert.equal(coins(alice),balanceBefore);
assert.equal((await apply(eating.token)).status,303);assert.equal(qty(alice,'bread'),0);
const competing=await collectionIssue(DB,alice,'sell',{item:'bread',coins:0});assert.equal((await apply(competing)).status,409);
const furnishings=await html('/dock/collection?item=lamp&view=display');
const placing=tokens(card(furnishings,'lamp')).find(f=>f.body.includes('collection.slot'));
assert.equal((await apply(placing.token)).status,303);assert.equal(sql.prepare("SELECT count(*) n FROM island_collection_displays WHERE visitor_key=? AND item_id='lamp'").get(alice).n,1);
assert.match(await html('/dock/cabin'),/collection.lamp/);
assert.ok(!(await html('/world?at=9')).includes('id="harbor-wave"'));
assert.match(await html('/world?at=9'),/atlas-destinations/);
console.log('V97 goods: six purchases, replay, food account isolation/consumption/competing tokens, unchanged balance, cottage placement/readback, harbor feedback passed.');
// V98 bulk sales: reserve display stock; reject forged quantities; settle all units or none.
sql.prepare("INSERT INTO island_collection_inventory(visitor_key,item_id,quantity,first_at) VALUES(?,'carrot',8,1) ON CONFLICT(visitor_key,item_id) DO UPDATE SET quantity=8").run(alice);
const salePage=await html('/dock/collection?filter=sell');assert.match(salePage,/data-bulk-sell/);
const sale=tokens(card(salePage,'carrot')).find(f=>f.body.includes('sell-batch'));
const batch=(token,quantity,key=alice)=>post({action:'sell-batch',token,quantity},key);
assert.equal((await batch(sale.token,'3',bob)).status,403);
for(const bad of ['0','-1','1.5','51','3e0','999'])assert.equal((await batch(sale.token,bad)).status,400);
const cashBefore=coins(alice),price=sql.prepare('SELECT coin_delta n FROM island_collection_operations WHERE token=?').get(sale.token).n;
assert.equal((await batch(sale.token,'3')).status,303);assert.equal(qty(alice,'carrot'),5);assert.equal(coins(alice),cashBefore+3*price);
assert.equal((await batch(sale.token,'5')).status,303);assert.equal(qty(alice,'carrot'),5);assert.equal(coins(alice),cashBefore+3*price);
const reserved=await collectionIssue(DB,alice,'display',{item:'carrot',slot:4});await apply(reserved);
const freshSale=tokens(card(await html('/dock/collection?filter=sell'),'carrot')).find(f=>f.body.includes('sell-batch'));
assert.equal((await batch(freshSale.token,'5')).status,400);
// Stock changed after rendering: rollback the entire transaction, including the first unit.
sql.prepare("UPDATE island_collection_inventory SET quantity=2 WHERE visitor_key=? AND item_id='carrot'").run(alice);
const cash=coins(alice);assert.equal((await batch(freshSale.token,'3')).status,409);assert.equal(qty(alice,'carrot'),2);assert.equal(coins(alice),cash);assert.equal(sql.prepare('SELECT applied_at n FROM island_collection_operations WHERE token=?').get(freshSale.token).n,null);
assert.equal((await batch(freshSale.token,'1')).status,303);assert.equal(qty(alice,'carrot'),1);
assert.equal(sql.prepare("SELECT count(*) n FROM island_collection_displays WHERE visitor_key=? AND item_id='carrot'").get(alice).n,1);
// Another independent sale of the same quantity must not collide in the ledger.
sql.prepare("UPDATE island_collection_inventory SET quantity=6 WHERE visitor_key=? AND item_id='carrot'").run(alice);
for(let n=0;n<2;n++){
 const offer=tokens(card(await html('/dock/collection?filter=sell'),'carrot')).find(f=>f.body.includes('sell-batch'));
 assert.equal((await batch(offer.token,'2')).status,303);
}
assert.equal(qty(alice,'carrot'),2);
const snackPage=await html('/dock/collection?filter=food');const tea=tokens(card(snackPage,'tea')).find(f=>f.body.includes('collection.eat'));const eatingResponse=await apply(tea.token);
const consumedTea=await html(eatingResponse.headers.get('Location'));assert.match(card(consumedTea,'tea'),/<div class="snack-moment" data-snack-receipt>/);assert.match(card(consumedTea,'tea'),/data-snack-food/);assert.match(card(consumedTea,'tea'),/data-species="rabbit"/);assert.equal(qty(alice,'tea'),0);
const map=await html('/world');assert.ok(!map.includes('id="harbor-wave"'));assert.ok(!map.includes('data-i18n="simple.home"'));assert.match(map,/留一句島嶼招呼/);
assert.match(await html('/dock/adventure'),/collection-scene-banner/);assert.match(await html('/dock/shop'),/collection-scene-banner/);
console.log('V98 bulk selling, forged/replayed quantities, atomic stock conflict rollback, display reservation, zero-stock snack animation and simplified map passed.');
// V99: actual rendered elements, not class names hidden in CSS, define the visible experience.
const cleanMap=await html('/world');assert.ok(!cleanMap.includes('<nav class="simple-directions"'));assert.match(cleanMap,/href="\/world\/living" data-stop="1"/);
const street=await html('/world/living');assert.match(street,/<section class="cozy-district" data-cozy-living>/);
for(const path of ['/dock/career','/dock/mba','/world/market','/dock/square'])assert.ok(street.includes('href="'+path+'"'));
assert.match(street,/href="\/world\?at=1"/);
const nature=await html('/world/nature');assert.match(nature,/<nav class="cozy-tiles"/);for(const icon of ['🌱','🎣','🌲'])assert.ok(nature.includes(icon));
const library=await html('/dock/mba');assert.match(library,/<svg class="cozy-library-art"/);assert.equal((library.match(/<details class="cozy-book">/g)||[]).length,3);
const market=await html('/world/market');for(const target of ['/dock/collection?filter=sell','/dock/shop','/world/farm-orders'])assert.ok(market.includes('href="'+target+'"'));
const about=await html('/about');assert.match(about,/data-i18n="cozy.ideaBody"/);assert.match(about,/data-i18n="cozy.ideaEconomy"/);
for(const path of ['/dock/collection','/dock/shop','/world/garden','/world/farm-orders']){
 const response=await get(path),text=await response.text();assert.match(text,/data-i18n="collection.coins"\]:before/);assert.match(text,/class="atlas-coin-icon"/);assert.match(response.headers.get('Content-Security-Policy'),/img-src data:/);
}
console.log('V99: actual snack receipt/food/passport actor, simplified map, grouped living district, three books, nature icon buttons, market actions, shared coin art/CSP and updated philosophy passed.');
assert.deepEqual(audit.report().missing,[]);
console.log('V88 PASS: server pickups, account isolation, duplicate/competing tokens, Taipei midnight, inventory/display reservation, atomic crafting/sale/purchase/gifts, insufficient funds, injected rollback, legacy quest bonus, bilingual routes, unchanged identities and missing-schema fallback.');

// Optional, isolated local UI review. No QA endpoints are shipped with the Worker.
if(process.env.COLLECTION_QA_SERVER==='1'){
 const {createServer}=await import('node:http');
 const server=createServer(async(req,res)=>{try{
  const url=new URL(req.url,'http://'+req.headers.host);
  if(url.pathname==='/__qa/start'){res.writeHead(303,{'Set-Cookie':'atlas_islander='+alice+'; Path=/; HttpOnly; SameSite=Lax',Location:'/dock/collection'});res.end();return;}
  const chunks=[];for await(const part of req)chunks.push(part);
  const init={method:req.method,headers:req.headers};if(!['GET','HEAD'].includes(req.method))init.body=Buffer.concat(chunks);
  const response=await worker.fetch(new Request(url,init),{DB});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){res.writeHead(500,{'Content-Type':'text/plain'});res.end('Isolated preview error');console.error(error);}});
 server.listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Isolated collection preview: http://localhost:'+Number(process.env.PORT||4173)+'/__qa/start'));
}

const balancePage=await html('/dock/shop');
const top=balancePage.match(/<header class="resort-topbar">[\s\S]*?<\/header>/)[0];
assert.match(top,/class="bear-coin-balance"/);assert.ok(top.indexOf('bear-coin-balance')<top.indexOf('data-locale="zh-TW"'));assert.ok(top.includes('<svg viewBox="0 0 40 40"'));assert.ok(top.includes('<strong translate="no" data-user-content>'+coins(alice)+'</strong>'));
const foreignTop=(await html('/dock/shop',bob)).match(/<header class="resort-topbar">[\s\S]*?<\/header>/)[0];assert.ok(foreignTop.includes('<strong translate="no" data-user-content>'+coins(bob)+'</strong>'));
assert.ok(!(await html('/dock/shop','')).includes('class="bear-coin-balance"'));assert.equal((await get('/dock/shop')).headers.get('Cache-Control'),'private, no-store');
