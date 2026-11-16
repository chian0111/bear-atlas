import {harborNeighbors} from '../worker/harbor-neighbors.js';
import {createI18nAudit} from './i18n-audit.mjs';
import {writeFileSync} from 'node:fs';
const i18nAudit=createI18nAudit();
import {bedroomFromLegacy,bedroomProblem,loadBedroom,saveBedroom} from '../worker/bedroom.js';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import worker from '../worker/index.js';
import {residentQuests,islandLifeCalendar,cabinVisits,islandWeeklyEvents,cabinFurniture,cabinLayoutDefaults,cabinLayoutProblem,decodeCabinLayout,islandSecretClock,residentSecrets} from '../worker/island-life.js';
const sql=new DatabaseSync(':memory:');
const dir=new URL('../drizzle/',import.meta.url);
const migrations=readdirSync(dir).filter(x=>x.endsWith('.sql')).sort();
const firstNew=migrations.indexOf('0006_bear_world.sql');
for(const file of migrations.slice(0,firstNew))sql.exec(readFileSync(new URL(file,dir),'utf8'));
const legacy='f'.repeat(48);
sql.prepare('INSERT INTO island_passports VALUES(?,?,?,?,?)').run(legacy,'既有島民','honey','picnic',1700000000000);
sql.prepare('INSERT INTO island_credentials(visitor_key) VALUES(?)').run(legacy);
for(const file of migrations.slice(firstNew))sql.exec(readFileSync(new URL(file,dir),'utf8'));
assert.equal(sql.prepare('SELECT nickname FROM island_passports WHERE visitor_key=?').get(legacy).nickname,'既有島民');
const DB={prepare(query){const p=sql.prepare(query);function bind(...args){return{first:async()=>p.get(...args),all:async()=>({results:p.all(...args)}),run:async()=>({meta:p.run(...args)}),executeBatch:()=>p.columns().length?{results:p.all(...args)}:{meta:p.run(...args)},bind}}return bind();},
 async batch(statements){sql.exec('BEGIN');try{const results=statements.map(s=>s.executeBatch());sql.exec('COMMIT');return results;}catch(error){sql.exec('ROLLBACK');throw error;}}};
const origin='https://guest.test',env={DB,SPORTS_RSVP_RELAY_KEY:'integration-test-local-only-secret-value'};
const get=async(path,cookie='')=>i18nAudit.response(await worker.fetch(new Request(origin+path,{headers:{Cookie:cookie}}),env),path);
const post=async(path,cookie,body,site=origin)=>i18nAudit.response(await worker.fetch(new Request(origin+path,{method:'POST',headers:{Cookie:cookie,Origin:site,'Sec-Fetch-Site':site===origin?'same-origin':'cross-site','Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(body)}),env),path+' [POST]');
const cookie=res=>res.headers.get('Set-Cookie').split(';')[0];
const content=async(path,who,pattern,status=200)=>{const r=await get(path,who);assert.equal(r.status,status,path);assert.match(await r.text(),pattern,path)};
async function signup(name,id,next='/world'){
 const entry='/passport?next='+encodeURIComponent(next);
 const c=cookie(await get(entry));
 const form=await post(entry,c,{nickname:name,bear:'honey',outfit:'picnic'});
 assert.equal(form.status,200);
 const text=await form.text();assert.match(text,new RegExp(id));assert.match(text,/帶我的熊熊上島/);assert.ok(text.includes('action="'+next+'"'));
 assert.ok(text.includes('我已保存恢復碼')&&text.includes('不要分享給其他島民'));assert.match(form.headers.get('Cache-Control'),/no-store/);assert.match(form.headers.get('Content-Security-Policy'),/connect-src 'none'/);
 return [c,text.match(/readonly value="([0-9 ]+)"/)[1]];
}
const founderKey='a'.repeat(48),founder='atlas_islander='+founderKey;
sql.prepare('INSERT INTO island_founder VALUES(1,?,?,?)').run('test-owner',founderKey,Date.now());
const founderResult=await post('/passport',founder,{nickname:'Kitty',bear:'honey',outfit:'dior'});assert.equal(founderResult.status,200);
const [friend,recovery]=await signup('小茶熊','BEAR-0002','/islands');
const [other]=await signup('海鹽熊','BEAR-0003');
const [third]=await signup('薄荷熊','BEAR-0004');
const dock='/islands?stop=dock';
const beforeReminder=sql.prepare('SELECT recovery_hash FROM island_credentials WHERE visitor_key=?').get(friend.split('=')[1]).recovery_hash;
for(let i=0;i<2;i++){const page=await (await get('/passport',friend)).text();assert.ok(page.includes('帳號恢復碼：已設定'));assert.ok(!page.includes(recovery)&&!page.includes('data-recovery-value'));}
assert.equal(sql.prepare('SELECT recovery_hash FROM island_credentials WHERE visitor_key=?').get(friend.split('=')[1]).recovery_hash,beforeReminder);
assert.ok(!(await (await get('/passport')).text()).includes('帳號恢復碼：已設定'));
assert.ok((await (await get('/passport','atlas_islander='+legacy)).text()).includes('帳號恢復碼：尚未設定'));
new Function(await (await get('/recovery-reminder.js')).text());
console.log('One-time private reminder, native confirmation, private real credential status and unchanged existing hash passed.');
// Beta UI changes must not create a second identity or alter saved recovery credentials.
{
 const key=friend.split('=')[1],before=sql.prepare('SELECT * FROM island_credentials WHERE visitor_key=?').get(key);
 const count=sql.prepare('SELECT COUNT(*) n FROM island_passports').get().n;
 const fields={nickname:'AlexandriaExplorerFriend',bear:'honey',outfit:'explorer'};
 for(let i=0;i<2;i++)assert.equal((await post('/passport?next=%2Fworld',friend,fields)).status,303);
 assert.equal(sql.prepare('SELECT COUNT(*) n FROM island_passports').get().n,count);
 assert.deepEqual(sql.prepare('SELECT * FROM island_credentials WHERE visitor_key=?').get(key),before);
 const page=await (await get('/world',friend)).text();
 assert.ok(page.includes('class="hb-player-name"><span translate="no" data-user-content>'+fields.nickname));
 assert.ok(page.includes('title="'+fields.nickname+' 的護照"'));
 assert.ok(page.includes('data-guide-member="BEAR-0002"'));
 assert.ok(page.includes('data-hb-enter href="/dock/square"'));
 const guest=await (await get('/world','')).text();assert.ok(guest.includes('新玩家登島')&&guest.includes('已有島民證？登入')&&guest.includes('data-guide-member="guest"'));
 const script=await (await get('/world-scene.js','')).text();new Function(script);
 assert.ok(script.includes('bear-harbor-welcome-v2:'));
 await post('/passport',friend,{...fields,nickname:'小茶熊'});
 console.log('Beta long-name/full-name access, guest/member guide isolation, repeated profile submit identity preservation and unchanged credentials passed.');
}

for(const path of ['/islands','/world',dock]){
 const res=await get(path),body=await res.text();
 assert.equal(res.status,200);
 assert.ok(body.includes('點地點直接前往，也可以點居民打招呼。')&&body.includes('class="atlas-harbor-city"')&&body.includes('data-resort-facility="home"'));
 assert.equal([...body.matchAll(/class="hb-pin[ "]/g)].length,6);
 assert.ok(!body.includes('小茶熊')&&!body.includes('收到的邀請'));
 assert.match(res.headers.get('Content-Security-Policy'),/script-src 'self'/);
}
assert.equal((await get('/')).headers.get('Location'),'/islands');
const harborResponse=await get('/islands');
assert.match(harborResponse.headers.get('Content-Security-Policy'),/connect-src 'self'/);
const harborMap=await harborResponse.text();
assert.equal((harborMap.match(/class="hb-neighbor resort-npc"/g)||[]).length,49);
assert.ok(harborMap.includes('role="group" aria-label="49 位渡假村居民"'));
assert.ok(harborMap.includes('data-has-passport="false"'));
assert.ok((await (await get('/islands',friend)).text()).includes('data-has-passport="true"'));
new Function(await (await get('/world-scene.js')).text());
// Sadness island is a read-only scene, preserving all saved data and stable map stops.
const beforeSad=JSON.stringify(sql.prepare('SELECT * FROM island_passports ORDER BY visitor_key').all());
for(const who of ['',friend,founder]){
 const r=await get('/world/sadness',who),page=await r.text();assert.equal(r.status,200);
 for(const label of ['傷心之島','傷心不需要立刻消失，這座島會先替你保管。','想念','委屈','疲憊','說不清楚','把傷心交給小島','月光淨化樹','擁抱玩偶'])assert.ok(page.includes(label));
 assert.match(r.headers.get('Content-Security-Policy'),/connect-src 'none'/);assert.match(r.headers.get('Content-Security-Policy'),/form-action 'none'/);assert.ok(!page.includes('<form'));
 assert.equal((page.match(/class="iso-avatar"/g)||[]).length,1);
}
assert.equal((await post('/world/sadness',friend,{note:'PRIVATE_TEST_DO_NOT_STORE'})).status,405);
assert.equal(JSON.stringify(sql.prepare('SELECT * FROM island_passports ORDER BY visitor_key').all()),beforeSad);
assert.match(harborMap,/data-stop="7"/);assert.ok(harborMap.includes('href="/world/nature"'));assert.equal((harborMap.match(/class="hb-neighbor resort-npc"/g)||[]).length,49);
console.log('Sadness map entry, read-only guest/member scene, private CSP, unchanged identities and 49 residents passed.');


await content('/dock/mba?practice=1','',/如果一家咖啡店人變多/);
for(const [id,name] of Object.entries({career:'港邊咖啡街',network:'榕樹廣場',mba:'山丘書屋',english:'旅人車站',finance:'潮汐市集'})){const page=await (await get('/dock/'+id)).text();assert.match(page,new RegExp(name));assert.ok(page.includes(id==='english'?'data-public-place="english"':id==='career'?'海邊咖啡館與露台':'town-scene'));assert.ok(!page.includes('name="answer"'));}
assert.ok((await (await get('/islands')).text()).includes('data-town-scenery="career"'));
new Function(await (await get('/town-life.js')).text());
// Public scene examples preserve existing practice and invitation entry points.
for(const id of ['sports','english'])for(const who of ['',friend]){const r=await get('/dock/'+id,who),page=await r.text();assert.equal(r.status,200);assert.ok(page.includes('data-public-place="'+id+'"')&&page.includes('data-place-play')&&page.includes('data-place-npc'));if(id==='sports')assert.ok(page.includes('/dock/square#new-meetup')&&!page.includes('和島上居民聊聊'));if(id==='sports'&&who)assert.ok(page.includes('name="invite"'));if(id==='english')assert.ok(!page.includes('<summary>個人練習工具與歷史回答</summary>')); }
const labels=await (await get('/world')).text();assert.ok(labels.includes('[data-sea-resident-pins]{display:none!important}'));assert.ok(labels.includes('.hb-pin{font-size:10px'));assert.equal((labels.match(/class="hb-pin[ " ]/g)||[]).length,6);
console.log('Compact map labels, hidden default resident names, two public scenes and retained sport/practice links passed.');

assert.match((await get('/dock/career')).headers.get('Content-Security-Policy'),/script-src 'self'/);
assert.equal((await post('/dock/mba',friend,{answer:'原本的私人 MBA 回答'})).status,303);
await content('/dock/mba?practice=1',friend,/原本的私人 MBA 回答/);
assert.ok((await (await get('/dock/journal',friend)).text()).includes('/dock/mba?practice=1#practice-answer'));
assert.equal((await post('/dock/mba?practice=1',friend,{answer:'更新後仍保留的回答'})).status,303);
await content('/dock/mba?practice=1',friend,/更新後仍保留的回答/);
console.log('Five public places, stable links/scenery, optional private exercises, old POST and saved answer update passed.');
assert.equal((await post('/dock/mba','',{answer:'not signed in'})).status,403);
await content('/islands',friend,/小茶熊/);
await content('/world',friend,/小茶熊/);
await content('/dock/square',friend,/島民布告欄/);
const square='/dock/square';
await content(square,'',/用島民證進廣場/);
assert.equal((await post(square,'',{action:'resident-show'})).status,403);
assert.equal((await post(square,friend,{action:'resident-show'},'https://evil.test')).status,403);
assert.equal((await post(square,friend,{action:'resident-show'})).status,303);
await content(square,other,/島民名冊.*小茶熊.*BEAR-0002/);
assert.ok(!(await (await get(square,other)).text()).includes('既有島民'));
assert.ok(!(await (await get(square)).text()).includes('小茶熊'));
assert.equal((await post(square,friend,{action:'resident-hide'})).status,303);
assert.ok(!(await (await get(square,other)).text()).includes('小茶熊'));
const when=new Date(Date.now()+86400000+8*3600000).toISOString().slice(0,16);
const event={action:'meetup-create',title:'<匹克球>雙打',category:'sports',when,venue:'信義運動中心',capacity:'2'};
assert.equal((await post(square,friend,{...event,when:'2020-02-31T18:00'})).status,400);
assert.equal((await post(square,friend,event)).status,303);
const meetup=sql.prepare('SELECT id FROM island_meetups').get().id;
await content(square,friend,/&lt;匹克球&gt;雙打.*信義運動中心.*1\/2 人.*你發起的/);
assert.ok(!(await (await get(square)).text()).includes('信義運動中心'));
assert.equal((await post(square,friend,{action:'meetup-join',meetup})).status,409);
assert.equal((await post(square,other,{action:'meetup-cancel',meetup})).status,409);
const seats=await Promise.all([other,third].map(person=>post(square,person,{action:'meetup-join',meetup})));
assert.deepEqual(seats.map(r=>r.status).sort(),[303,409]);
const winner=seats[0].status===303?other:third, next=winner===other?third:other;
await content(square,winner,/2\/2 人.*你已報名/);
assert.equal((await post(square,winner,{action:'meetup-join',meetup})).status,303);
assert.equal((await post(square,winner,{action:'meetup-leave',meetup})).status,303);
assert.equal((await post(square,next,{action:'meetup-join',meetup})).status,303);

await content(square+'?edit='+meetup,friend,/修改揪團.*name="revision" value="0"/);
await content(square+'?edit='+meetup,other,/只有發起人可以修改/,403);
const update={...event,action:'meetup-update',meetup,revision:'0',view:'hosting',capacity:'3',venue:'台北球館'};
assert.equal((await post(square,other,update)).status,403);
const edited=await post(square,friend,update);
assert.equal(edited.status,303);
assert.ok(edited.headers.get('Location').includes('view=hosting'));
assert.equal((await post(square,friend,update)).status,409);
assert.equal(sql.prepare('SELECT revision FROM island_meetups WHERE id=?').get(meetup).revision,1);
assert.equal((await post(square,winner,{action:'meetup-join',meetup})).status,303);
assert.equal((await post(square,friend,{...update,revision:'1',capacity:'2'})).status,409);
await content(square+'?view=hosting',friend,/台北球館.*團員名單 · 3 人.*海鹽熊.*薄荷熊/);
await content(square+'?view=joined',winner,/台北球館/);
assert.ok(!(await (await get(square+'?view=hosting',winner)).text()).includes('台北球館'));
assert.ok(!(await (await get(square,winner)).text()).includes('團員名單'));
assert.equal((await post(square,friend,{action:'meetup-cancel',meetup})).status,303);
await content(square,next,/已取消/);
await content(square+'?view=joined',winner,/已取消/);
assert.equal((await post(square,winner,{action:'meetup-join',meetup})).status,409);
const wheel='/dock/wheel';
await content(wheel,friend,/Swing 社交舞.*抽一站捷運/);
const draw=await post(wheel,friend,{mode:'weekend'});
assert.equal(draw.status,303);
await content(draw.headers.get('Location'),friend,/週末輪盤抽到.*帶這個點子去開團/);
assert.ok(!(await (await get(draw.headers.get('Location'),other)).text()).includes('週末輪盤抽到'));
const drawnId=new URL(draw.headers.get('Location'),origin).searchParams.get('draw');
const drawnTitle=sql.prepare('SELECT title FROM island_wheel_draws WHERE id=?').get(drawnId).title;
const prefilled=await (await get(square+'?draw='+drawnId,friend)).text();
assert.ok(prefilled.includes('value="'+drawnTitle+'"')&&prefilled.includes('已帶入輪盤抽到的活動'));
await content(square+'?draw='+drawnId,other,/這份輪盤結果無法讀取/,404);
assert.ok((await (await get(square+'?draw='+drawnId)).text()).includes(encodeURIComponent(square+'?draw='+drawnId)));

const retryId='d'.repeat(48),retryEvent={...event,create_id:retryId,title:'週末新手練球'};
assert.equal((await post(square,friend,retryEvent)).status,303);
assert.equal((await post(square,friend,retryEvent)).status,303);
assert.equal(sql.prepare('SELECT COUNT(*) count FROM island_meetups WHERE id=?').get(retryId).count,1);
assert.equal((await post(square,other,retryEvent)).status,409);
sql.prepare('UPDATE island_meetups SET starts_at=1 WHERE id=?').run(retryId);
await content(square+'?view=hosting',friend,/週末新手練球.*已結束/);
assert.ok(!(await (await get(square,friend)).text()).includes('<h3>週末新手練球</h3>'));
const oldDraw='c'.repeat(48);
sql.prepare('INSERT INTO island_wheel_draws(id,visitor_key,mode,title,drawn_at) VALUES(?,?,?,?,?)').run(oldDraw,friend.split('=')[1],'night','一筆舊輪盤紀錄',Date.now());
await content(wheel+'?draw='+oldDraw,friend,/一筆舊輪盤紀錄/);

for(const path of ['/world/dock','/dock'])for(const who of ['',friend]){
 const redirect=await get(path,who);
 assert.equal(redirect.status,303);
 assert.equal(redirect.headers.get('Location'),dock);
}
await content(dock,friend,/<h1>熊熊渡假村<\/h1>.*data-initial="9".*id="dock-station" data-destination="9" tabindex="-1">/s);
await content('/islands',friend,/id="dock-station" data-destination="9" tabindex="-1"/);
assert.equal((await get('/world/manage/emerald',friend)).status,403);
assert.equal((await get('/world/emerald/area/garden',friend)).status,403);
assert.equal((await get('/passport/island',friend)).status,403);
assert.equal((await post('/world/manage/emerald',founder,{action:'create'},'https://evil.test')).status,403);
assert.equal((await post('/world/manage/emerald',founder,{action:'create'})).status,303);
await content('/world/manage/emerald',founder,/設定登島密碼/);
for(const who of [friend,other])sql.prepare("INSERT INTO bear_world_grants(island_id,visitor_key,method,expires_at,password_revision) VALUES('emerald',?,'invite',?,0)").run(who.split('=')[1],Date.now()+86400000);
await content('/world/emerald',friend,/目前登入：<strong>BEAR-0002<\/strong>.*沒有開放訪客/,403);
await content('/world/manage/emerald',founder,/邀請尚未生效/);
const invitation=await post('/world/manage/emerald',founder,{action:'invite',member:'ｂｅａｒ－０００２'});
assert.equal(invitation.status,303);
await content(invitation.headers.get('Location'),founder,/BEAR-0002 現在可登島/);
await content('/world/emerald',friend,/已取得登島授權 · BEAR-0002/);
const guestTour=await (await get('/world/emerald',friend)).text();
assert.equal([...guestTour.matchAll(/class="jade-pin" /g)].length,10);
assert.ok(guestTour.includes('data-suite-checkin')&&guestTour.includes('data-sushi-next')&&guestTour.includes('紐西蘭鑽石生蠔'));
assert.ok(!guestTour.includes('醋飯偏乾')&&!guestTour.includes('私人機庫')&&!guestTour.includes('私人島島產證'));
await content('/passport/island',founder,/私人機庫/);
const sailingTour=await get('/world/sail/emerald',friend);
assert.ok((await sailingTour.text()).includes('href="/world/emerald"'));
for(const [who,status] of [[other,403],['',200]]){
 const denied=await get('/world/emerald?stop=omakase',who);
 assert.equal(denied.status,status);
 assert.ok(!(await denied.text()).includes('data-sushi-data'));
}
assert.equal((await post('/world/manage/emerald',founder,{action:'save',mode:'invite',days:'1','tour-setting':'1'})).status,303);
assert.ok(!(await (await get('/world/emerald',friend)).text()).includes('data-sushi-data'));
assert.equal((await post('/world/manage/emerald',founder,{action:'save',mode:'invite',days:'1','tour-setting':'1','guest-tour':'1'})).status,303);
await content('/world/emerald',friend,/data-sushi-data/);
await content('/world',friend,/收到的邀請/);
await content('/islands',friend,/收到的邀請/);
await content(dock,friend,/aria-label="1 則邀請".*收到的邀請.*搭船前往翡翠灣/);
await content('/islands',friend,/class="hb-pin hb-dock-link".*aria-label="1 則邀請"/);
await content('/world/emerald',other,/這份邀請已到期/,403);
assert.ok(!(await (await get(dock,other)).text()).includes('收到的邀請'));
await content('/passport/island',friend,/href="\/world\/emerald"/,403);
assert.equal((await get('/world/emerald/area/garden',friend)).status,403);
sql.exec('UPDATE bear_world_grants SET expires_at=0');
const pass='test access phrase, long enough';
const settings={action:'save',mode:'password',days:'7',password:pass,area:'garden'};
assert.equal((await post('/world/manage/emerald',founder,settings)).status,303);
const stored=sql.prepare('SELECT password_hash,password_salt FROM bear_world_islands').get();
assert.match(stored.password_hash,/^[a-f0-9]{64}$/);assert.notEqual(stored.password_hash,pass);
await content('/world/emerald',friend,/驗證並登島/,403);
assert.equal((await post('/world/emerald',friend,{action:'password',password:pass},'https://evil.test')).status,403);
assert.equal((await post('/world/emerald',friend,{action:'password',password:pass})).status,303);
assert.ok(!(await (await get('/world/emerald',friend)).text()).includes('data-sushi-data'));
await content('/world/emerald/area/garden',friend,/玫瑰花徑/);
assert.equal((await get('/world/emerald/area/collection',friend)).status,403);
assert.equal((await get('/passport/island',friend)).status,403);
const newBrowser=cookie(await get('/passport?recover=1&next=%2Fworld'));
const recovered=await post('/passport?recover=1&next=%2Fworld',newBrowser,{action:'recover',recovery});
assert.equal(cookie(recovered),friend);assert.equal(recovered.headers.get('Location'),'/world');
await content('/world',cookie(recovered),/我的登島紀錄/);
const restoredFromMap=await post('/passport?recover=1&next=%2Fislands',newBrowser,{action:'recover',recovery});
assert.equal(cookie(restoredFromMap),friend);
assert.equal(restoredFromMap.headers.get('Location'),'/islands');
const restoredFromDock=await post('/passport?recover=1&next='+encodeURIComponent(dock),newBrowser,{action:'recover',recovery});
assert.equal(restoredFromDock.headers.get('Location'),dock);
await content('/passport',friend,/到訪章 · 翡翠灣 Emerald Bay/);
assert.equal((await post('/world/manage/emerald',founder,{...settings,password:'new long phrase for guest'})).status,303);
assert.equal((await get('/world/emerald/area/garden',friend)).status,403);
assert.equal((await post('/world/manage/emerald',founder,{action:'invite',member:'BEAR-0002'})).status,303);
await content('/world/emerald/area/garden',friend,/玫瑰花徑/);
sql.prepare("UPDATE bear_world_grants SET expires_at=? WHERE method='invite'").run(Date.now()-10000);
assert.equal((await get('/world/emerald/area/garden',friend)).status,403);
assert.equal((await post('/world/manage/emerald',founder,{action:'revoke',member:'BEAR-0002'})).status,303);
const revoked=await get('/world/emerald?stop=hotel',friend);
assert.equal(revoked.status,403);
assert.ok(!(await revoked.text()).includes('data-suite-checkin'));
assert.ok(!(await (await get(dock,friend)).text()).includes('搭船前往翡翠灣'));
assert.equal((await post('/world/emerald',friend,{action:'password',password:'new long phrase for guest'})).status,403);
for(let i=0;i<5;i++)assert.equal((await post('/world/emerald',other,{action:'password',password:'wrong wrong wrong'})).status,403);
assert.equal((await post('/world/emerald',other,{action:'password',password:'new long phrase for guest'})).status,429);
assert.equal((await post('/world/manage',friend,{action:'create',name:'茶熊島'})).status,303);
await content('/world/island/BEAR-0002',friend,/茶熊島/);
assert.equal((await get('/world/island/BEAR-0002',third)).status,404);
assert.equal((await post('/world/manage',friend,{action:'save',name:'茶熊島',welcome:'海邊茶桌',mode:'public',days:'1'})).status,303);
await content(dock,third,/href="\/world\/sail\/BEAR-0002"/);
await content('/world/sail/BEAR-0002',third,/href="\/world\/island\/BEAR-0002"/);
await content('/world/island/BEAR-0002',third,/海邊茶桌/);
assert.equal((await get('/world/island/BEAR-0002')).status,403);
const suit={outfit:'sailor',shoes:'rose',bag:'sage'};
for(let slot=1;slot<=4;slot++)assert.equal((await post('/world/wardrobe',friend,{slot:String(slot),action:slot===4?'equip':'save',...suit})).status,303);
const looks=sql.prepare('SELECT slots_json,active_slot FROM bear_world_looks').get();
assert.equal(looks.active_slot,4);assert.deepEqual(Object.keys(JSON.parse(looks.slots_json)),['1','2','3','4']);
for(const path of ['/world','/dock/square','/passport','/world/island/BEAR-0002']){
 const h=await (await get(path,cookie(recovered))).text();
 assert.match(h,/fill="#bc786f"/,path);assert.match(h,/fill="#76917a"/,path);
}
await content('/passport',friend,/所屬島嶼：<span translate="no" data-user-content>茶熊島<\/span>/);
assert.equal((await post('/world/wardrobe',friend,{slot:'5',action:'equip',...suit})).status,400);
assert.equal((await post('/world/wardrobe',friend,{slot:'4',action:'equip',...suit},'https://evil.test')).status,403);
const escapeProbe=await post('/passport?next=%2F%2Fevil.test',newBrowser,{action:'recover',recovery});
assert.notEqual(escapeProbe.headers.get('Location'),'//evil.test');

const questHub='/dock/quests',cabin='/dock/cabin';
await content(questHub,'',/Hugo.*Liv.*Ari/);
await content(questHub+'/hugo','',/用島民證登入/);
assert.ok((await (await get('/islands')).text()).includes('我的小屋'));
assert.equal((await post(questHub+'/hugo','',{action:'start'})).status,403);
assert.equal((await get(questHub+'/unknown',friend)).status,404);
assert.equal((await post(questHub+'/hugo',friend,{action:'start'},'https://evil.test')).status,403);
assert.equal((await post(questHub+'/hugo',friend,{action:'choose',step:'1',path:'a',choice:'a'})).status,409);
const basicRoom={theme:'sage',wall:'print',desk:'books',corner:'plant',revision:'0'};
assert.equal((await post(cabin,friend,{...basicRoom,desk:'coffee'})).status,400);
assert.equal((await post(cabin,friend,basicRoom,'https://evil.test')).status,403);
assert.equal((await post(cabin,friend,basicRoom)).status,303);
assert.equal((await post(cabin,friend,basicRoom)).status,409);
await content('/islands/cabins/BEAR-0002',other,/目前沒有開放參觀/,403);
await content('/islands/cabins/BEAR-0002','',/帶著你的熊熊來作客/);
let storyUser=9000;
for(const [questId,quest] of Object.entries(residentQuests))for(const path of ['aa','ab','ba','bb']){
 const key=(storyUser++).toString(16).padStart(48,'0'),who='atlas_islander='+key,route=questHub+'/'+questId;
 sql.prepare('INSERT INTO island_passports VALUES(?,?,?,?,?)').run(key,'故事測試熊','honey','picnic',Date.now());
 sql.prepare('INSERT INTO island_credentials(visitor_key) VALUES(?)').run(key);
 assert.equal((await post(route,who,{action:'start'})).status,303);
 assert.equal((await post(route,who,{action:'choose',step:'0',path:'',choice:path[0]})).status,303);
 assert.ok((await (await get(route,who)).text()).includes(quest.branches[path[0]].question));
 const finish={action:'choose',step:'1',path:path[0],choice:path[1]};
 assert.equal((await post(route,who,finish)).status,303);
 assert.equal((await post(route,who,finish)).status,303);
 assert.ok((await (await get(route,who)).text()).includes(quest.endings[path].title));
 assert.equal((await post(route,who,{action:'start'})).status,303);
 assert.equal(sql.prepare('SELECT path FROM resident_quests WHERE visitor_key=? AND quest_id=?').get(key,questId).path,path);
}
for(const [questId,quest] of Object.entries(residentQuests)){
 const route=questHub+'/'+questId;
 assert.equal((await post(route,friend,{action:'start'})).status,303);
 const first={action:'choose',step:'0',path:'',choice:'a'};
 const parallel=await Promise.all([post(route,friend,first),post(route,friend,first)]);
 assert.deepEqual(parallel.map(x=>x.status),[303,303]);
 assert.equal(sql.prepare('SELECT step FROM resident_quests WHERE visitor_key=? AND quest_id=?').get(friend.split('=')[1],questId).step,1);
 assert.equal((await post(route,friend,{action:'choose',step:'0',path:'',choice:'b'})).status,409);
 assert.equal((await post(route,friend,{action:'choose',step:'1',path:'a',choice:'b'})).status,303);
 assert.ok((await (await get('/passport',friend)).text()).includes(quest.stamp+' · '+quest.endings.ab.title));
}
const decorated={theme:'rose',wall:'photo',desk:'coffee',corner:'golf',revision:'1',share:'1'};
assert.equal((await post(cabin,friend,decorated)).status,303);
assert.equal(sql.prepare('SELECT revision FROM island_cabins WHERE visitor_key=?').get(friend.split('=')[1]).revision,2);
const visitorRoom=await (await get('/islands/cabins/BEAR-0002',other)).text();
assert.ok(visitorRoom.includes('data-user-content>小茶熊</span> 的小屋')&&visitorRoom.includes('data-cabin-item="coffee"')&&visitorRoom.includes('data-cabin-item="photo"'));
assert.ok(!visitorRoom.includes('name="revision"')&&!visitorRoom.includes('港灣調香章'));
assert.equal((await post('/islands/cabins/BEAR-0002',other,decorated)).status,405);
assert.equal((await post(cabin,other,{...decorated,revision:'0'})).status,400);
const races=await Promise.all(['sage','cream'].map(theme=>post(cabin,friend,{...decorated,theme,revision:'2',share:'0'})));
assert.deepEqual(races.map(x=>x.status).sort(),[303,409]);
await content('/islands/cabins/BEAR-0002',other,/目前沒有開放參觀/,403);
assert.ok((await (await get(cabin,cookie(recovered))).text()).includes('data-cabin-item="golf"'));
assert.ok((await (await get('/passport?next='+encodeURIComponent(questHub+'/liv'),friend)).text()).includes('href="'+questHub+'/liv"'));
new Function(await (await get('/cabin-life.js')).text());
assert.match((await get(cabin,friend)).headers.get('Content-Security-Policy'),/connect-src 'self'/);
const guestCabin=await (await get(cabin)).text();assert.ok(guestCabin.includes('data-game-add-bed')&&guestCabin.includes('登入島民證後才能儲存'));assert.ok(!(guestCabin.includes('data-cabin-form')));
const gameHtml=await (await get(cabin,friend)).text();assert.ok(gameHtml.includes('data-game-add-bed'));assert.ok(gameHtml.includes('data-cabin-game')&&gameHtml.includes('data-game-sheet="editor"')&&gameHtml.includes('data-game-hotspot="door"')&&gameHtml.includes('data-game-sheet="story"'));
assert.equal((gameHtml.match(/data-cabin-display /g)||[]).length,1);

// Taipei daily/weekly rollover and persisted story choices.
assert.equal(islandLifeCalendar(Date.parse('2026-11-15T15:59:59Z')).week,'2026-11-09');
assert.equal(islandLifeCalendar(Date.parse('2026-11-15T16:00:00Z')).week,'2026-11-16');
assert.equal(islandLifeCalendar(Date.parse('2026-11-11T15:59:59Z')).day,'2026-11-11');
assert.equal(islandLifeCalendar(Date.parse('2026-11-11T16:00:00Z')).day,'2026-11-12');
const realNow=Date.now;
try{
 const base=Date.parse('2026-11-11T04:00:00Z');
 for(const kind of ['visit','event']){
  const seen=new Set();
  for(let index=0;index<3;index++){
   Date.now=()=>base+index*(kind==='visit'?1:7)*86400000;
   const calendar=islandLifeCalendar(),id=kind==='visit'?calendar.visit:calendar.event,period=kind==='visit'?calendar.day:calendar.week,route=kind==='visit'?'/dock/visits':'/dock/events',story=(kind==='visit'?cabinVisits:islandWeeklyEvents)[id];
   seen.add(id);
   await content(route,'',new RegExp(story.title));
   assert.equal((await post(route,'',{action:'start',period,story:id})).status,403);
   for(const [i,path] of ['aa','ab','ba','bb'].entries()){
    const who=[founder,friend,other,third][i],key=who.split('=')[1],common={period,story:id};
    assert.equal((await post(route,who,{...common,action:'start'},'https://evil.test')).status,403);
    assert.equal((await post(route,who,{...common,action:'start'})).status,303);
    assert.equal((await post(route,who,{...common,action:'start'})).status,303);
    assert.equal((await post(route,who,{...common,action:'choose',step:'0',path:'',choice:'z'})).status,400);
    const same=await Promise.all([1,2].map(()=>post(route,who,{...common,action:'choose',step:'0',path:'',choice:path[0]})));
    assert.deepEqual(same.map(r=>r.status),[303,303]);
    assert.equal(sql.prepare('SELECT step FROM island_life_stories WHERE visitor_key=? AND kind=? AND period=?').get(key,kind,period).step,1);
    if(kind==='visit')await content(route,who,new RegExp('data-cabin-guest="'+id+'"'));
    const finish=await post(route,who,{...common,action:'choose',step:'1',path:path[0],choice:path[1]});assert.equal(finish.status,303);
    if(kind==='event'&&id==='market'&&path==='aa'){
     assert.equal(finish.headers.get('Location'),route+'?earned=1');
     await content(route+'?earned=1',who,/class="market-badge badge-award"/);
     const records=JSON.stringify(sql.prepare('SELECT * FROM island_life_stories WHERE visitor_key=?').all(key));
     const collection=await (await get('/dock/memories',who)).text();assert.match(collection,/aria-label="市集小確幸章徽章"/);assert.match(collection,/取得日期：<time datetime="2026-11-11"/);
     await get('/dock/cabin',who);assert.equal(JSON.stringify(sql.prepare('SELECT * FROM island_life_stories WHERE visitor_key=?').all(key)),records);
     const repeat=await post(route,who,{...common,action:'choose',step:'1',path:path[0],choice:path[1]});assert.equal(repeat.headers.get('Location'),route);
    }
    await content(route,who,new RegExp(story.endings[path][0]));
    await content(route,who,/class="memory-art"|class="market-badge/);
    const held=kind+':'+period+':'+id+':'+path;
    await content('/dock/cabin?hold='+encodeURIComponent(held),who,new RegExp('data-cabin-held="'+held+'"'));
    const denied=await (await get('/dock/cabin?hold='+encodeURIComponent(held),'')).text();assert.ok(!denied.includes('data-cabin-held="'+held+'"'));
    assert.equal((await post(route,who,{...common,action:'choose',step:'1',path:path[0],choice:path[1]})).status,303);
    assert.equal(sql.prepare('SELECT path FROM island_life_stories WHERE visitor_key=? AND kind=? AND period=?').get(key,kind,period).path,path);
    assert.equal((await post(route,who,{...common,period:'1900-01-01',action:'start'})).status,409);
   }
  }
  assert.equal(seen.size,3);
 }
 const myMemories=await (await get('/dock/memories',friend)).text();assert.ok(myMemories.includes('data-user-content>小茶熊</span> 的島嶼紀念冊')&&!myMemories.includes('data-user-content>Kitty</span> 的島嶼紀念冊'));
 assert.equal((await get('/dock/memories?page=-1',friend)).status,400);
 assert.equal((await post('/dock/memories',friend,{})).status,405);
 await content('/dock/cabin',friend,/我的島嶼紀念冊/);
 const before=sql.prepare('SELECT count(*) AS n FROM island_life_stories').get().n;
 await get('/dock/visits',other);await get('/dock/events',other);assert.equal(sql.prepare('SELECT count(*) AS n FROM island_life_stories').get().n,before);
}finally{Date.now=realNow;}

const cloneLayout=()=>JSON.parse(JSON.stringify(cabinLayoutDefaults));
assert.equal(cabinLayoutProblem(cloneLayout()),'');
const moved=cloneLayout();moved.chair={x:-1.75,z:1.25,r:1};moved.table.r=1;assert.equal(cabinLayoutProblem(moved),'');
const outside=cloneLayout();outside.table.x=9;assert.match(cabinLayoutProblem(outside),/超出/);
const overlap=cloneLayout();overlap.chair={...overlap.table};assert.match(cabinLayoutProblem(overlap),/重疊/);
const blocked=cloneLayout();blocked.chair={x:-1.7,z:-1.95,r:0};assert.match(cabinLayoutProblem(blocked),/門口/);
assert.equal(decodeCabinLayout('{broken'),null);assert.equal(decodeCabinLayout('{"table":{"x":0}}'),null);
const badAngle=cloneLayout();badAngle.table.r=1.5;assert.equal(decodeCabinLayout(badAngle),null);
const key=friend.split('=')[1],beforeLayout=sql.prepare('SELECT * FROM island_cabins WHERE visitor_key=?').get(key);
const roomFields={theme:beforeLayout.theme,wall:beforeLayout.wall,desk:beforeLayout.desk,corner:beforeLayout.corner,share:'1',revision:String(beforeLayout.revision),layout:JSON.stringify(moved)};
assert.equal((await post(cabin,friend,roomFields)).status,303);
const savedLayout=sql.prepare('SELECT * FROM island_cabins WHERE visitor_key=?').get(key);assert.deepEqual(JSON.parse(savedLayout.layout_json),moved);
assert.equal((await post(cabin,friend,roomFields)).status,409);
assert.equal((await post(cabin,friend,{...roomFields,revision:String(savedLayout.revision),layout:JSON.stringify(overlap)})).status,400);
const visitLayout=await (await get('/islands/cabins/BEAR-0002',other)).text();assert.ok(visitLayout.includes('data-cabin-layout=')&&visitLayout.includes('&quot;x&quot;:-1.75'));
const {layout:omittedLayout,...legacyRoomFields}=roomFields;assert.equal((await post(cabin,friend,{...legacyRoomFields,revision:String(savedLayout.revision)})).status,303);
assert.deepEqual(JSON.parse(sql.prepare('SELECT layout_json FROM island_cabins WHERE visitor_key=?').get(key).layout_json),moved);
assert.ok((await (await get(cabin,friend)).text()).includes('name="layout"'));
// Optional bed persists through existing revision-guarded saves without changing old furniture.
let bedRoom=null;for(const r of [0,1])for(let x=-2;x<=2&&!bedRoom;x+=.25)for(let z=-1.5;z<=1.5&&!bedRoom;z+=.25){const candidate={...moved,bed:{x,z,r}};if(!cabinLayoutProblem(candidate))bedRoom=candidate;}
assert.ok(bedRoom);const bedRevision=sql.prepare('SELECT revision FROM island_cabins WHERE visitor_key=?').get(key).revision;
assert.equal((await post(cabin,friend,{...roomFields,revision:String(bedRevision),layout:JSON.stringify(bedRoom)})).status,303);
assert.deepEqual(JSON.parse(sql.prepare('SELECT layout_json FROM island_cabins WHERE visitor_key=?').get(key).layout_json),bedRoom);
assert.ok((await (await get(cabin,friend)).text()).includes('&quot;bed&quot;'));
assert.deepEqual(decodeCabinLayout('{}'),cabinLayoutDefaults);
assert.equal(decodeCabinLayout({...bedRoom,bed:{x:9,z:0,r:0}}),null);
console.log('Bed save/readback, invalid bed rejection and unchanged legacy defaults passed.');
const extendedRoom={...bedRoom,bed:{x:3.3,z:2.6,r:0}};assert.equal(cabinLayoutProblem(extendedRoom),'');
for(const bed of [{x:3.3,z:2.6,r:0},{x:3.1,z:2.5,r:1}]){const before=sql.prepare('SELECT revision FROM island_cabins WHERE visitor_key=?').get(key);const next={...extendedRoom,bed};assert.equal((await post(cabin,friend,{...roomFields,revision:String(before.revision),layout:JSON.stringify(next)})).status,303);assert.deepEqual(JSON.parse(sql.prepare('SELECT layout_json FROM island_cabins WHERE visitor_key=?').get(key).layout_json),next);for(const id of ['table','chair','corner','rug'])assert.deepEqual(next[id],moved[id]);}
assert.equal(decodeCabinLayout({...extendedRoom,bed:{x:4,z:3.5,r:0}}),null);
console.log('New floor bed placement, rotation, durable save/readback and old furniture preservation passed.');
// All core furniture uses the existing cabin JSON and revision checks.
let furnished={...extendedRoom};
for(const id of Object.keys(cabinFurniture)){
 if(!furnished[id]){let fit=null;for(const r of [0,1])for(let x=-2.45;x<=4.05&&!fit;x+=.25)for(let z=-2.15;z<=3.55&&!fit;z+=.25){const next={...furnished,[id]:{x,z,r}};if(!cabinLayoutProblem(next))fit=next;}assert.ok(fit,id+' fits');furnished=fit;}
 const revision=sql.prepare('SELECT revision FROM island_cabins WHERE visitor_key=?').get(key).revision;
 const fields={...roomFields,revision:String(revision),layout:JSON.stringify(furnished)};assert.ok(new URLSearchParams(fields).toString().length<4000);
 assert.equal((await post(cabin,friend,fields)).status,303,id+' saved');assert.deepEqual(JSON.parse(sql.prepare('SELECT layout_json FROM island_cabins WHERE visitor_key=?').get(key).layout_json),furnished);
}
for(const id of ['table','chair','corner','rug'])assert.deepEqual(furnished[id],moved[id]);
assert.equal(decodeCabinLayout({...furnished,unknown:{x:0,z:0,r:0}}),null);
const corePage=await (await get(cabin,friend)).text();for(const [id,item] of Object.entries(cabinFurniture))assert.ok(corePage.includes('data-game-add-furniture="'+id+'"')&&corePage.includes(item.name));
assert.ok((await (await get(cabin)).text()).includes('data-game-add-furniture="sofa"'));
console.log('All ten furniture types saved/read back through existing JSON; legacy coordinates, picker and unknown-type rejection passed.');


console.log('Furniture boundaries, collision, door clearance, rotation, persistence, stale saves, shared viewing and legacy save compatibility passed.');
if(process.env.CABIN_QA_DIR){
 const fs=await import('node:fs/promises');await fs.mkdir(process.env.CABIN_QA_DIR,{recursive:true});
 const page=await (await get('/dock/cabin',founder)).text();
 await fs.writeFile(process.env.CABIN_QA_DIR+'/collection.html',await (await get('/dock/memories',founder)).text());
 await fs.writeFile(process.env.CABIN_QA_DIR+'/index.html',page.replace('<body>','<body>').replace('data-cabin-display ', 'data-cabin-display data-cabin-guest="ari" ').replace('data-cabin-held=""','data-cabin-held="visit:fixture:ari:aa"'));
 await fs.writeFile(process.env.CABIN_QA_DIR+'/cabin-life.js',await (await get('/cabin-life.js',friend)).text());
}
console.log('Resident visits, all 24 story endings, weekly rotation, duplicate requests, private memories and Taipei rollover passed.');
console.log('Phase 1: existing profile, independent registration, recovery, world/dock, all island access modes, rate limit, expiry, revocation and founder isolation passed.');

const realSeaNow=Date.now;
try{
 assert.equal(islandSecretClock(Date.parse('2026-11-11T02:59:59Z')).phase,'morning');
 assert.equal(islandSecretClock(Date.parse('2026-11-11T03:00:00Z')).phase,'afternoon');
 assert.equal(islandSecretClock(Date.parse('2026-11-11T14:00:00Z')).phase,'night');
 assert.equal(islandSecretClock(Date.parse('2026-11-11T15:59:59Z')).nextChange,Date.parse('2026-11-11T22:00:00Z'));
 const positions=new Set();
 for(const hour of [0,6,12,16]){
  Date.now=()=>Date.parse('2026-11-11T'+String(hour).padStart(2,'0')+':00:00Z');const phase=islandSecretClock().phase;
  const state=await (await get('/dock/secrets?map=1')).json();assert.equal(state.residents.length,3);positions.add(state.residents[0].stop);
  for(const id of Object.keys(residentSecrets)){
   const path='/dock/secrets/'+id;await content(path,'',new RegExp(residentSecrets[id].scenes[phase].title));
   assert.equal((await post(path,'',{phase,choice:'a'})).status,403);
   assert.equal((await post(path,friend,{phase,choice:'a'},'https://evil.test')).status,403);
   assert.equal((await post(path,friend,{phase:'expired',choice:'a'})).status,409);
   assert.equal((await post(path,friend,{phase,choice:'evil'})).status,400);
   assert.equal((await post(path,friend,{phase,choice:'a'})).status,303);
   assert.equal((await post(path,friend,{phase,choice:'b'})).status,303);
   const saved=sql.prepare('SELECT choice FROM island_secret_memories WHERE visitor_key=? AND resident=? AND phase=?').get(friend.split('=')[1],id,phase);assert.equal(saved.choice,'a');
   await content(path,friend,/還記得你們的這次相遇/);
  }
 }
 assert.ok(positions.size>=2);await content('/dock/secrets',friend,/12 \/ 12/);await content('/dock/secrets',other,/0 \/ 12/);
 assert.equal((await get('/dock/secrets/not-a-resident',friend)).status,404);
 const liveMap=await (await get('/islands',friend)).text();assert.ok(liveMap.includes('data-sea-resident="hugo"')&&liveMap.includes('data-sea-pin="ari"')&&liveMap.includes('hb-bottle-pin'));
 new Function(await (await get('/world-scene.js')).text());

new Function(await (await get('/sea-life.js')).text());
 Date.now=()=>Date.parse('2026-11-12T04:00:00Z');
 const players=Array.from({length:6},(_,i)=>{const key=(0xb000+i).toString(16).padStart(48,'0');sql.prepare('INSERT INTO island_passports VALUES(?,?,?,?,?)').run(key,'接力測試熊'+i,'honey','picnic',Date.now());return 'atlas_islander='+key;});
 const newForm=async who=>{const html=await (await get('/dock/bottles/new',who)).text();return {action:'create',theme:'warm',phrase:'0',destination:'travel',request_id:html.match(/name="request_id" value="([a-f0-9-]+)"/)[1]};};
 await content('/dock/bottles/pick',players[0],/目前沒有你還沒接過的瓶子/);
 const first=await newForm(players[0]);assert.equal((await post('/dock/bottles/new','',first)).status,403);assert.equal((await post('/dock/bottles/new',players[0],first,'https://evil.test')).status,403);
 assert.equal((await post('/dock/bottles/new',players[0],{...first,phrase:'9'})).status,400);
 const another=await newForm(players[0]);const creates=await Promise.all([post('/dock/bottles/new',players[0],first),post('/dock/bottles/new',players[0],another)]);assert.deepEqual(creates.map(r=>r.status),[303,303]);assert.equal(creates[0].headers.get('Location'),creates[1].headers.get('Location'));
 assert.equal((await post('/dock/bottles/new',players[0],first)).status,303);
 const path=creates[0].headers.get('Location'),id=path.split('/').at(-1);assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM island_bottle_segments WHERE bottle_id=?').get(id).n,1);
 assert.equal((await post('/dock/bottles/new',players[1],{...first,request_id:id})).status,400);
 assert.equal((await get('/dock/bottles/pick',players[1])).headers.get('Location'),path);
 const races=await Promise.all([post(path,players[1],{action:'relay',revision:'1',phrase:'1',destination:'sports'}),post(path,players[2],{action:'relay',revision:'1',phrase:'2',destination:'mba'})]);assert.deepEqual(races.map(r=>r.status).sort(),[303,409]);
 assert.equal(sql.prepare('SELECT revision FROM island_bottles WHERE id=?').get(id).revision,2);
 const second=sql.prepare('SELECT * FROM island_bottle_segments WHERE bottle_id=? AND seq=2').get(id),winner='atlas_islander='+second.writer_key;
 assert.equal((await post(path,winner,{action:'relay',revision:'1',phrase:'3',destination:'dock'})).status,303);assert.equal(sql.prepare('SELECT phrase FROM island_bottle_segments WHERE bottle_id=? AND seq=2').get(id).phrase,second.phrase);
 for(const who of players.slice(1)){
  if(sql.prepare('SELECT seq FROM island_bottle_segments WHERE bottle_id=? AND writer_key=?').get(id,who.split('=')[1]))continue;
  const row=sql.prepare('SELECT * FROM island_bottles WHERE id=?').get(id);assert.equal((await post(path,who,{action:'relay',revision:String(row.revision),phrase:'1',destination:row.current_stop==='sports'?'mba':'sports'})).status,303);
 }
 const complete=sql.prepare('SELECT * FROM island_bottles WHERE id=?').get(id);assert.equal(complete.revision,6);assert.ok(complete.closed_at);
 assert.equal((await post(path,friend,{action:'relay',revision:'5',phrase:'0',destination:'dock'})).status,409);
 const story=(await (await get(path,players[0])).text()).replace(/<header class="resort-topbar">[\s\S]*?<\/header>/,'');assert.ok(story.includes('六位島民一起完成了')&&story.includes('第 6 站')&&!story.includes('接力測試熊')&&!story.includes(players[1].split('=')[1]));
 assert.ok((await (await get('/dock/bottles',players[0])).text()).includes(id));assert.ok(!(await (await get('/dock/bottles',friend)).text()).includes(id));
 const donations=[];for(const donor of players.slice(1,4)){const fields=await newForm(donor),r=await post('/dock/bottles/new',donor,fields);assert.equal(r.status,303);donations.push(r.headers.get('Location'));}
 const capped=await Promise.all(donations.map(route=>post(route,players[0],{action:'relay',revision:'1',phrase:'2',destination:'sports'})));assert.deepEqual(capped.map(r=>r.status).sort(),[303,303,429]);
 assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM island_bottle_segments WHERE writer_key=? AND day=?').get(players[0].split('=')[1],islandSecretClock().day).n,3);
 Date.now=()=>Date.parse('2026-11-13T04:00:00Z');assert.equal((await post('/dock/bottles/new',players[0],await newForm(players[0]))).status,303);
 assert.equal((await get('/dock/bottles/pick',players[5])).status,303);
}finally{Date.now=realSeaNow;}
console.log('Secret schedules, twelve discoveries, bottle creation, six-person completion, privacy, idempotency, concurrent relays and atomic daily limits passed.');
// V3: compatible character IDs, wardrobe persistence and effective appearance across surfaces.
{
 const layoutBefore=sql.prepare('SELECT layout_json FROM island_cabins WHERE visitor_key=?').get(friend.split('=')[1]).layout_json;
 const originalPeople=await (await get('/islands/neighbors')).text();
 for(const [who,species,nickname] of [[friend,'rabbit','奶油兔測試'],[other,'cat','奶茶貓測試']]){
  const key=who.split('=')[1],identityBefore=sql.prepare('SELECT * FROM island_credentials WHERE visitor_key=?').get(key),progressBefore=sql.prepare('SELECT count(*) n FROM island_life_stories WHERE visitor_key=?').get(key).n;
  assert.equal((await post('/passport',who,{action:'profile',nickname,bear:species,outfit:'explorer'})).status,303);
  if(!sql.prepare('SELECT visitor_key FROM island_cabins WHERE visitor_key=?').get(key))assert.equal((await post('/dock/cabin',who,{theme:'sage',wall:'print',desk:'books',corner:'plant',revision:'0',share:'1'})).status,303);
  for(const outfit of ['sailor','picnic']){
   assert.equal((await post('/world/wardrobe',who,{slot:'3',action:'equip',outfit,shoes:'cream',bag:'sage'})).status,303);
   for(const route of ['/passport','/islands','/world','/dock/square','/world/wardrobe','/world/nomad'])await content(route,who,new RegExp('data-character-id="'+species+'" data-species="'+species+'"'));
   const room=await (await get('/dock/cabin',who)).text();assert.ok(room.includes('data-bear-species="'+species+'"')&&room.includes('data-bear-look="'+outfit+'"')&&room.includes('data-bear-bag="#76917a"'));
   const no=identityBefore.member_no,label='BEAR-'+String(no).padStart(4,'0');
   const visit=await (await get('/islands/cabins/'+label,who)).text();assert.ok(visit.includes('data-bear-species="'+species+'"')&&visit.includes('data-bear-look="'+outfit+'"'));
  }
  if(species==='cat'){const visit=await (await get('/islands/cabins/BEAR-'+String(identityBefore.member_no).padStart(4,'0'),friend)).text();assert.match(visit,/data-bear-species="cat"/);assert.match(visit,/data-bear-look="picnic"/);}
  assert.deepEqual(sql.prepare('SELECT * FROM island_credentials WHERE visitor_key=?').get(key),identityBefore);
  assert.equal(sql.prepare('SELECT count(*) n FROM island_life_stories WHERE visitor_key=?').get(key).n,progressBefore);
 }
 const recoveredSpecies=await post('/passport',cookie(await get('/passport?recover=1')),{action:'recover',recovery});assert.equal(recoveredSpecies.status,303);
 await content('/dock/cabin',cookie(recoveredSpecies),/data-bear-species="rabbit"/);await content('/dock/cabin',cookie(recoveredSpecies),/data-bear-look="picnic"/);
 assert.equal(sql.prepare('SELECT layout_json FROM island_cabins WHERE visitor_key=?').get(friend.split('=')[1]).layout_json,layoutBefore);
 assert.equal(await (await get('/islands/neighbors')).text(),originalPeople);
 assert.equal((await post('/passport',friend,{action:'profile',nickname:'bad',bear:'dog',outfit:'picnic'})).status,400);
 new Function(await (await get('/character-preview.js')).text());
 for(const species of ['rabbit','cat']){const fresh=cookie(await get('/passport'));const result=await post('/passport',fresh,{nickname:'新'+species,bear:species,outfit:'sailor'});assert.equal(result.status,200);assert.equal(sql.prepare('SELECT bear FROM island_passports WHERE visitor_key=?').get(fresh.split('=')[1]).bear,species);}
 // Founder outfits also use the same species renderer; revert the isolated test profile afterward.
 assert.equal((await post('/passport',founder,{action:'profile',nickname:'Kitty',bear:'rabbit',outfit:'dior'})).status,303);await content('/passport',founder,/data-character-id="rabbit" data-species="rabbit"/);
 assert.equal((await post('/passport',founder,{action:'profile',nickname:'Kitty',bear:'honey',outfit:'dior'})).status,303);
 if(process.env.CABIN_QA_DIR){
  const fs=await import('node:fs/promises');
  for(const [who,species] of [[friend,'rabbit'],[other,'cat']]){
   let page=await (await get('/dock/cabin',who)).text();page=page.replace('<main>','<body><main>').replace('</html>','</body></html>').replace('</style>','main:has(.cabin-game){width:390px!important;max-width:390px!important}.cabin-game{height:780px!important}</style>');
   await fs.writeFile(process.env.CABIN_QA_DIR+'/'+species+'.html',page);
  }
  await fs.writeFile(process.env.CABIN_QA_DIR+'/character.html',(await (await get('/passport',friend)).text()).replace('<main>','<body><main>').replace('</html>','</body></html>'));
  await fs.writeFile(process.env.CABIN_QA_DIR+'/wardrobe.html',(await (await get('/world/wardrobe',friend)).text()).replace('<main>','<body><main>').replace('</html>','</body></html>'));
  await fs.writeFile(process.env.CABIN_QA_DIR+'/world-scene.js',await (await get('/world-scene.js')).text());
  await fs.writeFile(process.env.CABIN_QA_DIR+'/character-preview.js',await (await get('/character-preview.js')).text());
  await fs.writeFile(process.env.CABIN_QA_DIR+'/cabin-life.js',await (await get('/cabin-life.js')).text());
 }
}
console.log('Rabbit/cat selection, three outfits, accessories, profile/map/cabin/visitor parity, recovery, stable identities, old resident roster and saved layout passed.');

assert.match((await get('/passport')).headers.get('Content-Security-Policy'),/script-src 'self'/);
// Existing-player character selector changes only the legacy character ID.
{
 for(const [who,species] of [[friend,'rabbit'],[other,'cat'],[friend,'honey'],[friend,'rabbit']]){
  const key=who.split('=')[1],before=sql.prepare('SELECT * FROM island_passports WHERE visitor_key=?').get(key),looks=JSON.stringify(sql.prepare('SELECT * FROM bear_world_looks WHERE visitor_key=?').get(key));
  const r=await post('/world/wardrobe',who,{action:'character',bear:species});assert.equal(r.status,303);assert.equal(r.headers.get('Location'),'/world/wardrobe?character_saved=1#character-editor');
  assert.deepEqual({...sql.prepare('SELECT * FROM island_passports WHERE visitor_key=?').get(key)},{...before,bear:species});assert.equal(JSON.stringify(sql.prepare('SELECT * FROM bear_world_looks WHERE visitor_key=?').get(key)),looks);
  await content('/world/wardrobe',who,new RegExp('name="bear" value="'+species+'" checked'));
  await content('/passport',who,new RegExp('data-character-id="'+species+'"'));
  await content('/dock/cabin',who,new RegExp('data-bear-species="'+(species==='honey'?'bear':species)+'"'));
 }
 const key=friend.split('=')[1],before=sql.prepare('SELECT bear FROM island_passports WHERE visitor_key=?').get(key).bear;
 assert.equal((await post('/world/wardrobe',friend,{action:'character',bear:'dog'})).status,400);
 assert.equal((await post('/world/wardrobe',friend,{action:'character',bear:'cat'},'https://evil.test')).status,403);
 assert.equal(sql.prepare('SELECT bear FROM island_passports WHERE visitor_key=?').get(key).bear,before);
 const newSession=cookie(await get('/passport?recover=1')),relogin=await post('/passport',newSession,{action:'recover',recovery});assert.equal(relogin.status,303);
 await content('/world/wardrobe',cookie(relogin),/name="bear" value="rabbit" checked/);
 await content('/dock/cabin',cookie(relogin),/data-bear-look="picnic"/);
 console.log('Existing-player wardrobe selector, save/refresh/relogin, preserved clothing/accessories/identity, old-bear selection and forged request rejection passed.');
}
// Bedroom instance conversion, transaction safety and authorization; living remains unchanged.
{
 const privatePath='/dock/cabin/bedroom',k=friend.split('=')[1],otherKey=other.split('=')[1];
 const livingBefore=sql.prepare('SELECT * FROM island_cabins WHERE visitor_key=?').get(k),identities=JSON.stringify(sql.prepare('SELECT * FROM island_passports ORDER BY visitor_key').all());
 assert.equal((await get(privatePath)).status,401);assert.equal((await post(privatePath,'',{layout:'{}'})).status,403);
 assert.equal((await get(privatePath+'?owner=BEAR-0002',other)).status,403);
 const page=await (await get(privatePath,friend)).text();assert.ok(page.includes('data-cabin-instances="1"')&&page.includes('data-game-add-furniture="double_bed"'));
 const oldBedroom=sql.prepare("SELECT * FROM island_cabin_rooms WHERE visitor_key=? AND room_id='bedroom'").get(k);
 assert.deepEqual(JSON.parse(oldBedroom.living_backup_json),{...livingBefore});
 const before=await loadBedroom(DB,k,oldBedroom,JSON.parse(oldBedroom.layout_json));
 assert.equal(Object.keys(before.layout).length,Object.keys(JSON.parse(oldBedroom.layout_json)).length);
 assert.deepEqual(JSON.parse(before.legacy_backup_json),{...oldBedroom});
 for(let i=0;i<3;i++)await get(privatePath,friend);
 assert.deepEqual((await loadBedroom(DB,k,oldBedroom,{})).layout,before.layout);
 const furniture={};const add=(id,type,x,z,r=0)=>furniture[id]={id,room_id:'bedroom',furniture_type:type,x,z,r,layer:type==='rug'?-.75:0,created_at:1,updated_at:1};
 add('bed-a','double_bed',-.2,.3);add('bed-b','double_bed',2.5,1.4,1);add('green-a','plant',3.8,-1.8);add('green-b','plant',-2,3.1);
 assert.equal(bedroomProblem(furniture),'');
 let fields={theme:'rose',wall:'none',desk:'none',corner:'none',revision:String(before.revision),layout:JSON.stringify(furniture)};
 assert.equal((await post(privatePath,friend,fields)).status,303);
 let state=await loadBedroom(DB,k,oldBedroom,{});assert.equal(Object.keys(state.layout).length,4);assert.equal(state.layout['bed-b'].r,1);
 assert.deepEqual(sql.prepare('SELECT * FROM island_cabins WHERE visitor_key=?').get(k),livingBefore);
 assert.deepEqual(sql.prepare("SELECT * FROM island_cabin_rooms WHERE visitor_key=? AND room_id='bedroom'").get(k),oldBedroom);
 const snapshot=JSON.stringify(state);assert.equal((await post(privatePath,friend,fields)).status,409);assert.equal(JSON.stringify(await loadBedroom(DB,k,oldBedroom,{})),snapshot);
 furniture['bed-a'].x=.1;delete furniture['green-a'];fields={...fields,revision:String(state.revision),layout:JSON.stringify(furniture)};
 assert.equal((await post(privatePath,friend,fields)).status,303);state=await loadBedroom(DB,k,oldBedroom,{});assert.equal(state.layout['bed-a'].x,.1);assert.equal(state.layout['bed-b'].x,2.5);assert.ok(!state.layout['green-a']);assert.ok(state.layout['green-b']);
 // Deleting one identical bed must not remove its sibling.
 delete furniture['bed-a'];assert.equal((await post(privatePath,friend,{...fields,revision:String(state.revision),layout:JSON.stringify(furniture)})).status,303);state=await loadBedroom(DB,k,oldBedroom,{});assert.ok(!state.layout['bed-a']);assert.ok(state.layout['bed-b']);
 const bad={...state.layout,'too-far':{...state.layout['bed-b'],id:'too-far',x:20}};assert.equal((await post(privatePath,friend,{...fields,revision:String(state.revision),layout:JSON.stringify(bad)})).status,400);
 const many={};for(let i=0;i<26;i++)many['p'+i]={id:'p'+i,room_id:'bedroom',furniture_type:'plant',x:1,z:1,r:0,layer:0,created_at:1,updated_at:1};
 assert.equal((await post(privatePath,friend,{...fields,revision:String(state.revision),layout:JSON.stringify(many)})).status,400);delete many.p25;
 assert.equal((await post(privatePath,friend,{...fields,revision:String(state.revision),layout:JSON.stringify(many)})).status,303);state=await loadBedroom(DB,k,oldBedroom,{});assert.equal(Object.keys(state.layout).length,25);
 // Empty is a deliberate layout, never a trigger to re-import old furniture.
 assert.equal((await post(privatePath,friend,{...fields,revision:String(state.revision),layout:'{}'})).status,303);await get(privatePath,friend);state=await loadBedroom(DB,k,oldBedroom,{});assert.deepEqual(state.layout,{});
 // Restore useful browser fixture with two independently targetable beds.
 add('bed-a','double_bed',-.2,.3);fields={...fields,revision:String(state.revision),layout:JSON.stringify(furniture)};assert.equal((await post(privatePath,friend,fields)).status,303);state=await loadBedroom(DB,k,oldBedroom,{});
 assert.equal((await post(privatePath,other,{...fields,owner_key:k})).status,400);
 assert.equal((await get('/islands/cabins/BEAR-0002/bedroom',other)).status,404);assert.equal((await get('/islands/cabins/BEAR-0002?room=bedroom',other)).status,403);assert.equal((await post('/islands/cabins/BEAR-0002/bedroom',other,fields)).status,404);
 assert.ok(!(await (await get(privatePath,other)).text()).includes('bed-b'));
 const freshSession=cookie(await get('/passport?recover=1')),restored=await post('/passport',freshSession,{action:'recover',recovery});
 const reloaded=await (await get(privatePath,cookie(restored))).text();assert.ok(reloaded.includes('bed-b')&&reloaded.includes('&quot;x&quot;:2.5'));
 assert.deepEqual((await loadBedroom(DB,k,oldBedroom,{})).layout,state.layout);
 // V68 additions save through the same private instance endpoint; no living-room writes.
 const newTypes=['reading_chair','chair','vanity_stool','vanity','bedside_lamp','display_case','teddy_plush','cushion'];
 for(let i=0;i<newTypes.length;i++)add('new-'+i,newTypes[i],i%2?3:0,i%3*.9, i%4);
 add('another-chair','chair',-1,2);
 assert.equal((await post(privatePath,friend,{...fields,revision:String(state.revision),layout:JSON.stringify(furniture)})).status,303);
 state=await loadBedroom(DB,k,oldBedroom,{});await get(privatePath,friend);assert.deepEqual((await loadBedroom(DB,k,oldBedroom,{})).layout,state.layout);
 const restoredAgain=await post('/passport',cookie(await get('/passport?recover=1')),{action:'recover',recovery});
 const additionsHTML=await (await get(privatePath,cookie(restoredAgain))).text();for(const type of newTypes)assert.ok(additionsHTML.includes(type));
 assert.deepEqual(sql.prepare('SELECT * FROM island_cabins WHERE visitor_key=?').get(k),livingBefore);
 assert.deepEqual(sql.prepare("SELECT * FROM island_cabin_rooms WHERE visitor_key=? AND room_id='bedroom'").get(k),oldBedroom);
 // Inject a database failure after statements execute: batch must roll back all writes.
 const failDB={...DB,batch:statements=>DB.batch([...statements,DB.prepare('INSERT INTO missing_test_table VALUES(1)')])};
 await assert.rejects(()=>saveBedroom(failDB,k,'cream',state.revision,{}));assert.deepEqual(await loadBedroom(DB,k,oldBedroom,{}),state);
 sql.prepare("DELETE FROM island_bedroom_instances WHERE visitor_key=?").run(otherKey);sql.prepare("DELETE FROM island_bedroom_layouts WHERE visitor_key=?").run(otherKey);
 const otherOld=sql.prepare("SELECT * FROM island_cabin_rooms WHERE visitor_key=?").get(otherKey);
 await assert.rejects(()=>loadBedroom(failDB,otherKey,otherOld,JSON.parse(otherOld.layout_json)));
 assert.equal(sql.prepare('SELECT COUNT(*) n FROM island_bedroom_layouts WHERE visitor_key=?').get(otherKey).n,0);
 assert.deepEqual(sql.prepare('SELECT * FROM island_cabin_rooms WHERE visitor_key=?').get(otherKey),otherOld);
 assert.equal((await get(privatePath,other)).status,200);
 assert.deepEqual(sql.prepare('SELECT * FROM island_cabins WHERE visitor_key=?').get(k),livingBefore);
 assert.deepEqual(sql.prepare("SELECT * FROM island_cabin_rooms WHERE visitor_key=?").get(k),oldBedroom);
 assert.equal(JSON.stringify(sql.prepare('SELECT * FROM island_passports ORDER BY visitor_key').all()),identities);
 console.log('Instance conversion is idempotent and atomic; two beds, independent move/delete/save, 25-item limit, refresh/relogin, immutable old rooms and visitor denial passed.');
}
// P0 persistence sequence: five moves, three rotations and one copied instance survive recovery.
{
 const k=friend.split('=')[1],old=sql.prepare("SELECT * FROM island_cabin_rooms WHERE visitor_key=? AND room_id='bedroom'").get(k),state=await loadBedroom(DB,k,old,{}),living=sql.prepare('SELECT * FROM island_cabins WHERE visitor_key=?').get(k);
 const positions=[[-1,0],[1,0],[3,0],[-1,2],[1,2]],layout=Object.fromEntries(positions.map(([x,z],i)=>['p'+i,{id:'p'+i,room_id:'bedroom',furniture_type:'plant',x:x+.25,z,r:i<3?1:0,layer:0,created_at:1,updated_at:1}]));
 layout.copy={...layout.p0,id:'copy',x:-1,z:3};
 const fields={theme:'cream',wall:'none',desk:'none',corner:'none',revision:String(state.revision),layout:JSON.stringify(layout)};
 assert.equal((await post('/dock/cabin/bedroom',friend,fields)).status,303);
 const saved=await loadBedroom(DB,k,old,{});for(const [id,p] of Object.entries(layout))for(const field of ['id','furniture_type','x','z','r','layer'])assert.equal(saved.layout[id][field],p[field]);
 await get('/dock/cabin',friend);await get('/dock/cabin/bedroom',friend);
 const restored=await post('/passport',cookie(await get('/passport?recover=1')),{action:'recover',recovery});
 await get('/dock/cabin/bedroom',cookie(restored));assert.deepEqual((await loadBedroom(DB,k,old,{})).layout,saved.layout);
 assert.deepEqual(sql.prepare('SELECT * FROM island_cabins WHERE visitor_key=?').get(k),living);
 assert.equal((await post('/islands/cabins/BEAR-0002',other,fields)).status,405);
 assert.equal((await post('/dock/cabin/bedroom',friend,fields)).status,409);assert.deepEqual((await loadBedroom(DB,k,old,{})).layout,saved.layout);
 console.log('P0 five moved/three rotated pieces plus copy persist after refresh, room switch and recovery; living room unchanged, stale save and visitor writes rejected.');
}
// Resort P0: home/porch routes reuse existing rooms and enforce sharing before interior reads.
{
 const k=friend.split('=')[1],before=JSON.stringify(sql.prepare('SELECT * FROM island_cabins ORDER BY visitor_key').all()),rooms=JSON.stringify(sql.prepare('SELECT * FROM island_cabin_rooms ORDER BY visitor_key,room_id').all()),pieces=JSON.stringify(sql.prepare('SELECT * FROM island_bedroom_instances ORDER BY visitor_key,id').all()),identities=JSON.stringify(sql.prepare('SELECT * FROM island_passports ORDER BY visitor_key').all());
 const shared=sql.prepare('SELECT share_enabled FROM island_cabins WHERE visitor_key=?').get(k).share_enabled;
 const park=await (await get('/world?at=home',friend)).text();assert.ok(park.includes('data-initial="11"')&&park.includes('href="/dock/cabin">回家')&&park.includes('連貫的海岸渡假村'));assert.equal((park.match(/class="hb-pin[ "]/g)||[]).length,6);
 assert.ok(!park.includes('data-venue="pickleball"'));
 const golf=await (await get('/dock/sports',friend)).text();assert.ok(golf.includes('data-golf-angle')&&golf.includes('data-golf-power')&&golf.includes('離開果嶺'));assert.equal((golf.match(/data-place-player /g)||[]).length,1);
 const own=await get('/world/home',friend);assert.equal(own.status,303);assert.equal(own.headers.get('Location'),'/dock/cabin');
 assert.equal((await get('/world/home')).status,401);assert.equal((await post('/world/home',friend,{})).status,405);
 sql.prepare('UPDATE island_cabins SET share_enabled=0 WHERE visitor_key=?').run(k);
 const closed=await (await get('/world/home/BEAR-0002',other)).text();assert.ok(closed.includes('尚未開放')&&!closed.includes('data-resort-door')&&!closed.includes('data-cabin-layout'));
 assert.equal((await get('/islands/cabins/BEAR-0002',other)).status,403);
 sql.prepare('UPDATE island_cabins SET share_enabled=1 WHERE visitor_key=?').run(k);
 const porch=await (await get('/world/home/BEAR-0002',other)).text();assert.ok(porch.includes('data-resort-door href="/islands/cabins/BEAR-0002"')&&!porch.includes('data-cabin-layout'));
 assert.equal((await get('/islands/cabins/BEAR-0002',other)).status,200);assert.equal((await post('/islands/cabins/BEAR-0002',other,{layout:'{}'})).status,405);assert.equal((await get('/islands/cabins/BEAR-0002?room=bedroom',other)).status,403);
 const home=await (await get('/dock/cabin',friend)).text();assert.ok(home.includes('href="/world?at=11">← 回熊熊渡假村'));
 await get('/world/home',friend);await get('/world?at=home',friend);await get('/dock/cabin',friend);await get('/dock/cabin/bedroom',friend);
 const restored=await post('/passport?next=%2Fworld%2Fhome',cookie(await get('/passport')),{action:'recover',recovery});assert.equal(restored.headers.get('Location'),'/world/home');
 for(const route of ['/dock/tasks','/dock/career','/dock/network','/dock/mba','/dock/english','/dock/sports','/dock/finance','/dock/travel','/world/sadness','/dock/bottles','/dock/secrets'])assert.equal((await get(route,friend)).status,200,route);
 sql.prepare('UPDATE island_cabins SET share_enabled=? WHERE visitor_key=?').run(shared,k);
 assert.equal(JSON.stringify(sql.prepare('SELECT * FROM island_cabins ORDER BY visitor_key').all()),before);assert.equal(JSON.stringify(sql.prepare('SELECT * FROM island_cabin_rooms ORDER BY visitor_key,room_id').all()),rooms);assert.equal(JSON.stringify(sql.prepare('SELECT * FROM island_bedroom_instances ORDER BY visitor_key,id').all()),pieces);assert.equal(JSON.stringify(sql.prepare('SELECT * FROM island_passports ORDER BY visitor_key').all()),identities);
 console.log('Resort P0: five areas, one avatar, own home/exit, friend porch permission, private-room denial, stable legacy routes and unchanged saves after recovery passed.');
}

// V83.1: isolated owner environment persistence, CAS, room isolation and privacy.
const cozyBefore=sql.prepare('SELECT * FROM island_cabins WHERE visitor_key=?').get(friend.split('=')[1]);
const cozyState={main:false,bedside:true,nightlight:true,curtains:true,day:'night',rain:true,music:false,ambience:false};
assert.equal((await post('/dock/cabin/environment','',{room:'living',revision:'0',state:JSON.stringify(cozyState)})).status,403);
const envFirst=await post('/dock/cabin/environment',friend,{room:'living',revision:'0',state:JSON.stringify(cozyState)});assert.equal(envFirst.status,200);assert.equal((await envFirst.json()).revision,1);
assert.equal((await post('/dock/cabin/environment',friend,{room:'living',revision:'0',state:JSON.stringify(cozyState)})).status,409);
assert.equal((await post('/dock/cabin/environment',friend,{room:'living',revision:'1',state:JSON.stringify(cozyState)},'https://other.test')).status,403);
assert.equal((await post('/dock/cabin/environment',friend,{owner:legacy,room:'living',revision:'1',state:JSON.stringify(cozyState)})).status,400);
assert.equal((await post('/dock/cabin/environment',friend,{room:'living',revision:'1',state:JSON.stringify({...cozyState,main:'false'})})).status,400);
const cozyPage=await (await get('/dock/cabin',friend)).text();assert.ok(cozyPage.includes('data-cozy-revision="1"'));assert.ok(cozyPage.includes('"curtains":true'));assert.ok(!(await (await get('/dock/cabin/bedroom',friend)).text()).includes('data-cozy-revision="1"'));
assert.deepEqual(sql.prepare('SELECT * FROM island_cabins WHERE visitor_key=?').get(friend.split('=')[1]),cozyBefore);
console.log('V83.1 environment persistence, separate room state, stale-write rejection, cross-origin/forged owner denial and unchanged furniture passed.');

// Local-only browser QA uses the same Worker with the isolated in-memory DB above.
// This server is never part of the deployed Worker or production routes.
if(process.env.CABIN_QA_SERVER==='1'){
 const {createServer}=await import('node:http');let failSave=false;
 const server=createServer(async(req,res)=>{try{
  const url=new URL(req.url,'http://'+req.headers.host);
  if(url.pathname==='/__qa/fail-save'){failSave=true;res.writeHead(200,{'Content-Type':'text/plain'});res.end('Next isolated bedroom save will fail once.');return;}
  if(failSave&&req.method==='POST'&&url.pathname==='/dock/cabin/bedroom'){failSave=false;res.writeHead(503,{'Content-Type':'text/html'});res.end('<p>Isolated save failure</p>');return;}
  if(url.pathname==='/__qa/p0'){
   const k=friend.split('=')[1],old=sql.prepare("SELECT * FROM island_cabin_rooms WHERE visitor_key=? AND room_id='bedroom'").get(k),state=await loadBedroom(DB,k,old,{});
   const layout=Object.fromEntries([[-1.2,0],[0,0],[1.2,0],[-1.2,2.2],[1.2,2.2]].map(([x,z],i)=>['p'+i,{id:'p'+i,room_id:'bedroom',furniture_type:'plant',x,z,r:0,layer:0,created_at:1,updated_at:1}]));
   await saveBedroom(DB,k,'cream',state.revision,layout);res.writeHead(303,{'Set-Cookie':friend+'; Path=/; HttpOnly; SameSite=Lax',Location:'/dock/cabin/bedroom?__qa_narrow=1'});res.end();return;
  }
  if(url.pathname==='/__qa/living-seat'||url.pathname==='/__qa/cat-cabin'){
   const k=friend.split('=')[1];sql.prepare('UPDATE island_cabins SET layout_json=? WHERE visitor_key=?').run(JSON.stringify({...cabinLayoutDefaults,bed:{x:3.5,z:2.4,r:0}}),k);sql.prepare("UPDATE island_passports SET bear=? WHERE visitor_key=?").run(url.pathname==='/__qa/cat-cabin'?'cat':'honey',k);
   res.writeHead(303,{'Set-Cookie':friend+'; Path=/; HttpOnly; SameSite=Lax',Location:'/dock/cabin?__qa_narrow=1'});res.end();return;
  }
  if(url.pathname==='/__qa/seating'){
   const k=friend.split('=')[1],old=sql.prepare("SELECT * FROM island_cabin_rooms WHERE visitor_key=?").get(k),state=await loadBedroom(DB,k,old,JSON.parse(old.layout_json));
   const piece=(id,type,x,z,r=0)=>({id,room_id:'bedroom',furniture_type:type,x,z,r,layer:0,created_at:1,updated_at:1});
   const type=['reading_chair','chair','vanity_stool'].includes(url.searchParams.get('type'))?url.searchParams.get('type'):'reading_chair';await saveBedroom(DB,k,'cream',state.revision,{seat:piece('seat',type,-1.7,0,type==='chair'?0:2),bed:piece('bed','single_bed',3,2),lamp:piece('lamp','bedside_lamp',1,0),cabinet:piece('cabinet','display_case',3,-1)});
   sql.prepare("UPDATE island_passports SET bear=? WHERE visitor_key=?").run(url.pathname==='/__qa/cat-cabin'?'cat':'honey',k);
   res.writeHead(303,{'Set-Cookie':friend+'; Path=/; HttpOnly; SameSite=Lax',Location:'/dock/cabin/bedroom?__qa_narrow=1'});res.end();return;
  }
  if(url.pathname==='/__qa/cat'){sql.prepare("UPDATE island_passports SET bear='cat',outfit='explorer' WHERE visitor_key=?").run(friend.split('=')[1]);res.writeHead(303,{'Set-Cookie':friend+'; Path=/; HttpOnly; SameSite=Lax',Location:'/dock/sports'});res.end();return;}
  if(url.pathname==='/__qa/start'){res.writeHead(303,{'Set-Cookie':friend+'; Path=/; HttpOnly; SameSite=Lax',Location:'/world/wardrobe'});res.end();return;}
  if(url.pathname==='/__qa/clear'){res.writeHead(303,{'Set-Cookie':'atlas_islander=; Path=/; Max-Age=0',Location:'/passport?recover=1'});res.end();return;}
  const chunks=[];for await(const chunk of req)chunks.push(chunk);
  const init={method:req.method,headers:req.headers};if(!['GET','HEAD'].includes(req.method))init.body=Buffer.concat(chunks);
  const result=await worker.fetch(new Request(url,init),env);res.writeHead(result.status,Object.fromEntries(result.headers));if(url.searchParams.has('__qa_narrow')&&(result.headers.get('Content-Type')||'').includes('text/html'))res.end((await result.text()).replace('</main>','</main><style>main{max-width:390px!important}</style>'));else res.end(Buffer.from(await result.arrayBuffer()));
 }catch(error){res.writeHead(500);res.end(String(error));}});
 server.listen(Number(process.env.PORT||4173),'0.0.0.0',()=>console.log('Isolated Worker QA ready'));
}

// Clean resort chrome is available on each destination, including the member identity.
for(const path of ['/world','/dock/sports','/dock/cabin','/islands/neighbors','/passport','/about']){
 const r=await get(path,friend),page=await r.text();assert.equal(r.status,200,path);
 assert.equal((page.match(/class="resort-topbar"/g)||[]).length,1,path);
 assert.match(page,/aria-label="渡假村主要導覽"/);assert.match(page,/position:fixed/);
 assert.match(page,/href="\/about"/);
}
const cleanMap=await (await get('/world',friend)).text();
assert.ok(!cleanMap.includes('看看動靜 ✦')&&!cleanMap.includes('其他活動與舊工具')&&!cleanMap.includes('下班／週末輪盤'));
assert.equal((cleanMap.match(/class="resort-stroll"/g)||[]).length,49);
assert.equal((await get('/dock/journal',friend)).status,200);
console.log('Shared fixed resort navigation, clean map, resident stroll and preserved journal route passed.');

// Resort visual upgrade: all residents, separate nature destination, facilities and images.
const upgradedMap=await (await get('/world',friend)).text();
assert.equal(new Set([...upgradedMap.matchAll(/data-resort-resident="([^"]+)"/g)].map(m=>m[1])).size,49);
assert.match(upgradedMap,/data-resort-3d/);assert.match(upgradedMap,/bear-leg-left/);
const facilities=await (await get('/dock/sports',friend)).text();
for(const id of ['gym','table','pickle','tennis','pool'])assert.ok(facilities.includes('data-facility="'+id+'"'));
const nature=await (await get('/world/nature',friend)).text();assert.match(nature,/<h1>自然休憩區 · 海岸花園<\/h1>/);assert.ok(!nature.includes('data-sad-island'));
assert.ok((await (await get('/dock/career',friend)).text()).includes('海邊咖啡館與露台'));
const about=await (await get('/about')).text();assert.equal((about.match(/<figure class="resort-scene">/g)||[]).length,4);
assert.match(nature,/TOWN \/ 05/);assert.ok(!nature.includes('看看漂流瓶'));assert.ok(!upgradedMap.includes('class="hb-bottle-pin"'));
const cabin81=await (await get('/dock/cabin',friend)).text();assert.match(cabin81,/data-game-sheet="menu"/);assert.match(cabin81,/cabin-resort-return/);assert.ok(!cabin81.includes('叩叩！'));
const englishAbout=await (await get('/about?lang=en')).text();assert.match(englishAbout,/src="\/i18n\/runtime.js\?release=v87\.3"/);assert.match(englishAbout,/有自己的家，也有可以走走的世界/);assert.match(englishAbout,/data-locale="en"/);assert.ok(!cabin81.includes('熊熊限定'));assert.match(cabin81,/class="game-status"/);
console.log('49 distinct residents, WebGL fallback, five facility prototypes, nature garden and illustrated philosophy passed.');

for(const [path,at]of [['/dock/career',1],['/dock/sports',5],['/world/nature',7],['/dock/cabin',11]]){const page=await (await get(path,friend)).text();assert.ok(page.includes('href="/world?at='+at+'"'),path);const map=await (await get('/world?at='+at,friend)).text();assert.ok(map.includes('data-initial="'+at+'"'));}
assert.equal((await get('/world/home',friend)).headers.get('Location'),'/dock/cabin');
for(const id of ['career','mba','finance','network'])assert.ok(!(await (await get('/dock/'+id,friend)).text()).includes('在這裡遇見居民'));
console.log('Facility return positions retained, direct own-home entry and quiet leisure pages passed.');

for(const who of ['',friend]){const before=sql.prepare('SELECT count(*) n FROM island_passports').get().n;const page=await (await get('/world/nomad',who)).text();assert.match(page,/data-nomad-phase="open"/);assert.match(page,/nomadLive.focusNote/);assert.ok(!page.includes('data-focus-start'));assert.equal((page.match(/data-nomad-npc="/g)||[]).length,6);assert.equal((page.match(/data-nomad-player /g)||[]).length,1);assert.match(page,/data-town-cafe/);assert.match(page,/data-nomad-mode="working"/);assert.equal(sql.prepare('SELECT count(*) n FROM island_passports').get().n,before);assert.match(await (await get('/world?at=12',who)).text(),/data-initial="12"/);}
console.log('V86.3 guest/member open house, return stop, no premature interactions and unchanged identity count passed.');
for(let district=0;district<harborNeighbors.length;district++)for(let slot=0;slot<harborNeighbors[district].length;slot++){const response=await get('/islands/neighbors/'+district+'-'+slot,friend);assert.equal(response.status,200);}
if(process.env.I18N_AUDIT_REPORT){const report=i18nAudit.report();writeFileSync(process.env.I18N_AUDIT_REPORT,JSON.stringify(report,null,2)+'\n');console.log('I18N audit: '+report.htmlRoutes+' HTML routes; '+report.missing.length+' incomplete source strings.');assert.equal(report.missing.length,0,'Untranslated built-in strings; inspect the report.');}
