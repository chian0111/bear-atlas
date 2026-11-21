import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {createI18nAudit} from './i18n-audit.mjs';
import {supperIssue,supperState,supperPrice,supperScene} from '../worker/hugo-supper.js';
const worker=(await import(process.env.SUPPER_BUILD==='1'?'../dist/server/index.js':'../worker/index.js')).default;
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

const change=async(path,fields,key=alice,foreign=false)=>audit.response(await worker.fetch(new Request(origin+path,{method:'POST',headers:{Cookie:key?'atlas_islander='+key:'',Origin:foreign?'https://evil.test':origin,'Sec-Fetch-Site':foreign?'cross-site':'same-origin','Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(fields)}),{DB}),path+' POST');
const sceneState=key=>supperState(DB,key);
const formFor=(text,action,label)=>tokens(text).find(f=>f.body.includes('name="action" value="'+action+'"')&&(!label||f.body.includes('supper.'+label+'"')));
const send=(token,action,extra={},key=alice,foreign=false)=>change('/world/hugo-supper',{action,token,...extra},key,foreign);
const story=key=>html('/world/hugo-supper',key);
const count=table=>sql.prepare('SELECT count(*) n FROM '+table).get().n;
assert.equal((await get('/world/hugo-supper','')).status,200);assert.ok(!(await story('')).includes('name="token"'));
assert.equal((await send('x','start',{},'')).status,403);
const startA=formFor(await story(alice),'start'),startB=formFor(await story(alice),'start');assert.ok(startA&&startB);assert.equal(await sceneState(alice),undefined);
assert.equal((await send(startA.token,'start',{},bob)).status,403);
assert.equal((await send(startA.token,'start',{},alice,true)).status,403);
assert.equal((await send(startA.token,'start',{coins:'9999'})).status,400);
assert.equal((await send(startA.token,'start')).status,303);assert.equal((await sceneState(alice)).step,1);assert.equal(coins(alice),0);
assert.equal((await send(startA.token,'start')).status,303);assert.equal((await send(startB.token,'start')).status,409);
const noLook=await supperIssue(DB,alice,'listen',(await sceneState(alice)).revision);assert.equal((await send(noLook,'listen')).status,409);
async function reachDecision(key){
 if(!await sceneState(key)){const start=formFor(await story(key),'start');assert.equal((await send(start.token,'start',{},key)).status,303);}
 const chair=formFor(await story(key),'clue','chair');assert.ok(chair);const looked=await send(chair.token,'clue',{},key);assert.equal(looked.status,303);assert.ok(looked.headers.get('Location').endsWith('#supper-observation'));
 const observed=await story(key);assert.match(observed,/data-i18n="supper.chairClue"/);const listen=formFor(observed,'listen');assert.equal((await send(listen.token,'listen',{},key)).status,303);assert.equal((await sceneState(key)).step,2);
}
await reachDecision(alice);
// The existing display reservation remains intact while two available carrots are used.
sql.prepare("INSERT INTO island_collection_inventory(visitor_key,item_id,quantity,first_at) VALUES(?,'carrot',3,1)").run(alice);
sql.prepare("INSERT INTO island_collection_displays(visitor_key,slot,item_id) VALUES(?,1,'carrot')").run(alice);
assert.match(await story(alice),/name="source" value="hugo" checked/);
let decide=formFor(await story(alice),'decide');assert.ok(decide);assert.equal(supperPrice(),8);
assert.equal((await send(decide.token,'decide',{choice:'sell',source:'own',quantity:'1'})).status,400);
assert.equal((await send(decide.token,'decide',{choice:'bad',source:'own'})).status,400);
assert.equal((await send(decide.token,'decide',{choice:'sell',source:'own'})).status,303);
assert.equal(qty(alice,'carrot'),1);assert.equal(coins(alice),8);assert.equal((await sceneState(alice)).choice,'sell');
assert.equal(sql.prepare('SELECT count(*) n FROM island_collection_displays WHERE visitor_key=?').get(alice).n,1);
assert.equal((await send(decide.token,'decide',{choice:'share',source:'hugo'})).status,303);assert.equal(qty(alice,'carrot'),1);assert.equal(coins(alice),8);assert.equal((await sceneState(alice)).choice,'sell');
assert.equal(sql.prepare("SELECT SUM(quantity_delta) n FROM island_collection_ledger WHERE visitor_key=? AND kind='supper_use'").get(alice).n,-2);
assert.equal(sql.prepare("SELECT SUM(coin_delta) n FROM island_collection_ledger WHERE visitor_key=? AND kind='supper_sale'").get(alice).n,8);
// A simultaneous stale decision token cannot select another branch or issue another payment.
const stale=await supperIssue(DB,alice,'decide',2);assert.equal((await send(stale,'decide',{choice:'sell',source:'own'})).status,409);assert.equal(coins(alice),8);
async function finish(key,detail){const middle=await story(key),f=formFor(middle,'finish',detail);assert.ok(f);assert.equal((await send(f.token,'finish',{detail},key)).status,303);assert.equal((await sceneState(key)).step,4);const last=formFor(await story(key),'return');assert.equal((await send(last.token,'return',{},key)).status,303);assert.equal((await sceneState(key)).step,5);}
await finish(alice,'seeds');assert.match(await story(alice),/data-i18n="supper.farewellSell"/);
// Cook and share change the scene without inventing money or consuming a displayed item.
for(const [key,choice,detail]of [[bob,'cook','door'],[visitor,'share','sea']]){
 await reachDecision(key);sql.prepare("INSERT INTO island_collection_inventory(visitor_key,item_id,quantity,first_at) VALUES(?,'carrot',2,1)").run(key);
 const f=formFor(await story(key),'decide');assert.equal((await send(f.token,'decide',{choice,source:'own'},key)).status,303);assert.equal(qty(key,'carrot'),0);assert.equal(coins(key),0);
 const wrong=formFor(await story(key),'finish');assert.equal((await send(wrong.token,'finish',{detail:'seeds'},key)).status,409);
 await finish(key,detail);assert.match(await html('/world/market',key),new RegExp('data-supper-choice="'+choice+'"'));assert.match(await story(key),new RegExp('data-i18n="supper.farewell'+choice[0].toUpperCase()+choice.slice(1)+'"'));
}
assert.notEqual(supperScene({step:5,choice:'sell',detail:'seeds'}),supperScene({step:5,choice:'share',detail:'sea'}));
// First-time players can play all the way through without farming or receiving free sale income.
const newcomer='4'.repeat(48);sql.prepare('INSERT INTO island_passports VALUES(?,?,?,?,?)').run(newcomer,'Newcomer','cat','picnic',1);sql.prepare('INSERT INTO island_credentials(visitor_key) VALUES(?)').run(newcomer);
await reachDecision(newcomer);const gifted=formFor(await story(newcomer),'decide');assert.equal((await send(gifted.token,'decide',{choice:'sell',source:'hugo'},newcomer)).status,303);assert.equal(qty(newcomer,'carrot'),0);assert.equal(coins(newcomer),0);await finish(newcomer,'room');
// Feedback is optional, owner-scoped and has no currency or XP reward.
const finale=await story(alice),rating=formFor(finale,'feedback','yes'),money=coins(alice),growth=count('island_character_growth');assert.ok(rating);
assert.equal((await send(rating.token,'feedback',{detail:'yes'},bob)).status,403);assert.equal((await send(rating.token,'feedback',{detail:'yes'})).status,303);assert.equal((await sceneState(alice)).feedback,'yes');assert.equal(coins(alice),money);assert.equal(count('island_character_growth'),growth);
const before=count('island_collection_ledger');await story(alice);await html('/world/market',alice);await html('/world',alice);assert.equal(count('island_collection_ledger'),before);
assert.match(await html('/world',alice),/data-supper-choice="sell"/);assert.ok(!(await html('/world/market',newcomer)).includes('data-supper-choice="share"'));
// Stock changes and ledger failures roll back token, progress, items and wallet together.
const retry='5'.repeat(48);sql.prepare('INSERT INTO island_passports VALUES(?,?,?,?,?)').run(retry,'Retry','honey','picnic',1);sql.prepare('INSERT INTO island_credentials(visitor_key) VALUES(?)').run(retry);await reachDecision(retry);
sql.prepare("INSERT INTO island_collection_inventory(visitor_key,item_id,quantity,first_at) VALUES(?,'carrot',2,1)").run(retry);const risky=formFor(await story(retry),'decide');sql.prepare("UPDATE island_collection_inventory SET quantity=1 WHERE visitor_key=? AND item_id='carrot'").run(retry);
assert.equal((await send(risky.token,'decide',{choice:'sell',source:'own'},retry)).status,409);assert.equal((await sceneState(retry)).step,2);assert.equal(qty(retry,'carrot'),1);assert.equal(coins(retry),0);
sql.prepare("UPDATE island_collection_inventory SET quantity=2 WHERE visitor_key=? AND item_id='carrot'").run(retry);
sql.exec("CREATE TRIGGER supper_fixture_failure BEFORE INSERT ON island_collection_ledger WHEN NEW.kind='supper_sale' BEGIN SELECT RAISE(ABORT,'fixture');END");
assert.equal((await send(risky.token,'decide',{choice:'sell',source:'own'},retry)).status,409);assert.equal(qty(retry,'carrot'),2);assert.equal(coins(retry),0);assert.equal((await sceneState(retry)).step,2);assert.equal(sql.prepare('SELECT applied_at t FROM island_supper_actions WHERE token=?').get(risky.token).t,null);
sql.exec('DROP TRIGGER supper_fixture_failure');assert.equal((await send(risky.token,'decide',{choice:'sell',source:'own'},retry)).status,303);assert.equal(qty(retry,'carrot'),0);assert.equal(coins(retry),8);
// Expired actions leave the persistent story untouched and can be refreshed.
const expired=await supperIssue(DB,retry,'finish',(await sceneState(retry)).revision,0,1);assert.equal((await send(expired,'finish',{detail:'room'},retry)).status,409);assert.equal((await sceneState(retry)).step,3);
assert.deepEqual(sql.prepare('SELECT * FROM island_passports WHERE visitor_key IN (?,?,?) ORDER BY visitor_key').all(alice,bob,visitor),original.sort((a,b)=>a.visitor_key.localeCompare(b.visitor_key)));
assert.deepEqual(audit.report().missing,[]);
console.log('V101 PASS: three persistent endings, ingredient consent/reservation, no-farming story basket, fixed one-time settlement, replay/stale/expiry/origin/account guards, atomic rollback/retry, visible market/map memory, reward-free feedback and unchanged legacy identities.');
