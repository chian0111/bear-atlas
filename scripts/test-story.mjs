import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {storyPanel,storyApply,storyState,economyNews} from '../worker/economy-story.js';
import {adventureIssue} from '../worker/adventure.js';
import {economyConfig,economyPeriod,economyMarket,economyIndices,economySnapshot,economyOfficial} from '../worker/economy-engine.js';
import {createI18nAudit} from './i18n-audit.mjs';
const worker=(await import(process.env.STORY_BUILD==='1'?'../dist/server/index.js':'../worker/index.js')).default;
const sql=new DatabaseSync(':memory:');sql.exec('PRAGMA foreign_keys=ON');for(const f of readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));
const DB={prepare(query){const p=sql.prepare(query);function bind(...args){return{first:async()=>p.get(...args),all:async()=>({results:p.all(...args)}),run:async()=>({meta:p.run(...args)}),executeBatch:()=>p.columns().length?{results:p.all(...args)}:{meta:p.run(...args)},bind}}return bind();},async batch(rows){sql.exec('BEGIN');try{const results=rows.map(s=>s.executeBatch());sql.exec('COMMIT');return results;}catch(e){sql.exec('ROLLBACK');throw e;}}};
const origin='https://economy.test',env={DB},audit=createI18nAudit();
const get=async(path,headers={})=>audit.response(await worker.fetch(new Request(origin+path,{headers}),env),path);

const a='a'.repeat(48),b='b'.repeat(48);for(const key of[a,b]){sql.prepare('INSERT INTO island_passports VALUES(?,?,?,?,?)').run(key,'Story tester','cat','picnic',1);sql.prepare('INSERT INTO island_credentials(visitor_key) VALUES(?)').run(key);}
const time=economyConfig.baseStart+economyConfig.weekMs+1000;
const tokenOf=body=>body.match(/name="token" value="([^"]+)"/)[1];
let token=tokenOf(await storyPanel(DB,a,'square',time));assert.equal((await storyApply(DB,b,token,null,time)).status,409);
assert.equal((await storyApply(DB,a,token,null,time)).status,303);const pinned=(await storyState(DB,a)).snapshot_json;
assert.equal((await storyApply(DB,a,token,null,time+1)).status,303);assert.equal((await storyState(DB,a)).step,1);
const skip=await adventureIssue(DB,a,'carrot:explain',time);assert.equal((await storyApply(DB,a,skip,'supply',time)).status,409);
for(const [step,scene]of [[1,'maple'],[2,'farm'],[3,'cafe'],[4,'explain']]){
 token=tokenOf(await storyPanel(DB,a,scene,time));
 if(step===2){sql.exec("CREATE TRIGGER story_fixture_fail BEFORE INSERT ON island_adventure_events WHEN NEW.event='economy:farm' BEGIN SELECT RAISE(ABORT,'fixture');END");assert.equal((await storyApply(DB,a,token,null,time)).status,409);assert.equal((await storyState(DB,a)).step,2);assert.equal(sql.prepare('SELECT consumed_at FROM island_adventure_actions WHERE token=?').get(token).consumed_at,null);sql.exec('DROP TRIGGER story_fixture_fail');}
 assert.equal((await storyApply(DB,a,token,step===4?'demand':null,time)).status,303);
}
assert.equal((await storyState(DB,a)).step,5);assert.equal((await storyState(DB,a)).snapshot_json,pinned);
await economyOfficial(DB,time+economyConfig.weekMs*4);assert.equal((await storyState(DB,a)).snapshot_json,pinned);
const end=await storyPanel(DB,a,'maple',time);assert.match(end,/story.gentle/);token=tokenOf(end);
sql.exec("CREATE TRIGGER reward_fixture_fail BEFORE INSERT ON island_adventure_rewards WHEN NEW.quest_id='carrot-mystery' BEGIN SELECT RAISE(ABORT,'fixture');END");await assert.rejects(()=>storyApply(DB,a,token,null,time));assert.equal(sql.prepare("SELECT count(*) n FROM island_adventure_rewards WHERE quest_id='carrot-mystery'").get().n,0);sql.exec('DROP TRIGGER reward_fixture_fail');
await Promise.all([storyApply(DB,a,token,null,time),storyApply(DB,a,token,null,time)]);assert.equal(sql.prepare("SELECT count(*) n FROM island_adventure_rewards WHERE quest_id='carrot-mystery'").get().n,1);assert.match(await storyPanel(DB,a,'maple',time),/story.claimed/);
assert.throws(()=>sql.exec('UPDATE island_economy_quests SET period=5'),/pinned/);
const one=await economyOfficial(DB,time),news1=await economyNews(DB,one,'1',time);const saved=sql.prepare('SELECT article_json FROM island_economy_news WHERE period=1').get().article_json;
const later=await economyOfficial(DB,time+economyConfig.weekMs);await economyNews(DB,later,'2',time+economyConfig.weekMs);assert.equal((await economyNews(DB,later,'1')).split('<details>')[0],news1.split('<details>')[0]);assert.equal(sql.prepare('SELECT article_json FROM island_economy_news WHERE period=1').get().article_json,saved);assert.throws(()=>sql.exec("UPDATE island_economy_news SET article_json='{}'"),/immutable/);
for(const path of ['/world/observatory','/dock/economy-quest','/dock/square','/world/garden','/dock/career','/dock/collection']){const response=await get(path,{Cookie:'atlas_islander='+a});assert.equal(response.status,200,path);const content=await response.text();if(['/dock/square','/world/garden','/dock/career'].includes(path))assert.ok(!content.includes('id="carrot-story"'),path);if(path==='/world/observatory')assert.ok(content.includes('id="carrot-story"'));}
assert.equal(audit.report().missing.length,0,JSON.stringify(audit.report().missing));
const post=async(fields,key=a,foreign=false)=>worker.fetch(new Request(origin+'/dock/economy-quest',{method:'POST',headers:{Cookie:'atlas_islander='+key,Origin:foreign?'https://evil.test':origin,'Sec-Fetch-Site':foreign?'cross-site':'same-origin','Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(fields)}),env);
assert.equal((await post({token,step:5})).status,400);assert.equal((await post({token},a,true)).status,403);assert.equal((await post({token},b)).status,409);assert.equal((await post({token},'')).status,403);
console.log('V90.3 PASS: five sequential clues, account/skip/origin/forgery guards, wrong-answer completion, pinned cross-week case, atomic step rollback, badge failure/retry/concurrency, unchanged past news, bilingual facilities and backpack.');
