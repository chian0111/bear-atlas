// V87: server-owned actions and idempotent, additive quest rewards. No currency or inventory reset.
export const adventureStations=[
 {id:'dock',path:'/world?at=9',event:'dock:hello',label:'招呼港口',action:'向港口揮揮手'},
 {id:'square',path:'/dock/square',event:'square:notice',label:'榕樹廣場',action:'看看廣場布告欄'},
 {id:'home',path:'/dock/cabin',event:'home:rest',label:'我的小屋',action:'在自家小屋歇歇'},
 {id:'forest',path:'/world/forest',event:'forest:walk',label:'雪松森林',action:'沿雪松小徑散步'},
 {id:'beach',path:'/world/beach',event:'beach:listen',label:'貝殼海灘',action:'坐在木棧道聽海'}
];
export const adventureQuests=[
 {id:'welcome',kind:'main',title:'五個舒服的角落',note:'跟著 Ari 探索五站，也可以隨時自由散步。',events:adventureStations.map(s=>s.event),reward:'初次冒險紀念卡'},
 {id:'nature',kind:'side',title:'森林與海的問候',note:'散步、聽海，再觀察一位野生朋友。',events:['forest:walk','beach:listen','wildlife:common'],reward:'自然朋友紀念卡'},
 {id:'rare',kind:'hidden',title:'林間的驚喜',note:'每日下午與晚間都能相遇，白天也有補遇步道。',events:['wildlife:rare'],reward:'山羌觀察紀念卡'},
 {id:'daily',kind:'daily',title:'今天慢慢走',note:'台灣時間每天更新，錯過不扣分。',events:['forest:walk','beach:listen'],reward:'今日散步紀念卡'},
 {id:'woodland-week',kind:'side',repeat:'weekly',title:'本週的林間約定',note:'本週到森林觀察山羌，再去海邊聽海。下週仍有新的機會。',events:['wildlife:rare','beach:listen'],reward:'林海週記紀念卡'},
 {id:'visit',kind:'side',title:'留一張椅子給朋友',note:'接受一位既有居民來訪，完成一次小屋聊天。',events:['npc:conversation'],reward:'朋友來訪紀念卡'},
 {id:'garden-nature',kind:'side',title:'田園與林間的約定',note:'收成一回、觀察野生朋友，再到池邊收竿。',events:['garden:harvest','wildlife:common','pond:catch'],reward:'田園自然紀念卡'}
];
export function adventureDay(now=Date.now()){return new Date(now+28800000).toISOString().slice(0,10);}
export function adventurePeriod(q,now=Date.now()){if(q.kind==='daily')return adventureDay(now);if(q.repeat==='weekly'){const day=Math.floor((now+28800000)/86400000),monday=day-((day+3)%7+7)%7;return new Date(monday*86400000).toISOString().slice(0,10);}return '';}
export function adventureWildlife(now=Date.now()){
 const hour=new Date(now+28800000).getUTCHours();
 return {common:hour<12?'松鼠':hour<18?'藍鵲':'貓頭鷹',rare:hour>=14&&hour<21,period:adventureDay(now)};
}
export function adventureGreeting(value){
 if(typeof value!=='string')return null;
 const text=value.normalize('NFKC').trim();
 // Plain public greetings only: no links, contact harvesting, control chars or explicit abuse.
 if(!text||[...text].length>120||/[<>\p{Cc}\p{Cf}]/u.test(text)||/(https?:|www\.|\S+@\S+|去死|殺死|幹你|操你|fuck\s+you|kill\s+yourself)/iu.test(text))return null;
 return text;
}
export async function adventureReady(db){
 const r=await db.prepare("SELECT count(*) n FROM sqlite_master WHERE type='table' AND name IN ('island_adventure_preferences','island_adventure_actions','island_adventure_events','island_adventure_rewards','island_adventure_visits','island_custom_greetings')").first();return r?.n===6;
}
export async function adventureIssue(db,key,scene,now=Date.now()){
 const token=crypto.randomUUID();
 await db.prepare('INSERT INTO island_adventure_actions(visitor_key,scene,token,expires_at) VALUES(?,?,?,?) ON CONFLICT(visitor_key,scene) DO UPDATE SET token=excluded.token,expires_at=excluded.expires_at,consumed_at=NULL,event=NULL,period=\'\'').bind(key,scene,token,now+1800000).run();return token;
}
export async function adventureRecord(db,key,scene,token,event,period,now=Date.now()){
 // Event parameters come exclusively from the server's route/action allowlist.
 const result=await db.batch([
 db.prepare('UPDATE island_adventure_actions SET consumed_at=?,event=?,period=? WHERE visitor_key=? AND scene=? AND token=? AND expires_at>? AND consumed_at IS NULL').bind(now,event,period,key,scene,token,now),
 db.prepare('INSERT INTO island_adventure_events(visitor_key,event,period,happened_at) SELECT ?,event,period,consumed_at FROM island_adventure_actions WHERE visitor_key=? AND scene=? AND token=? AND consumed_at=? ON CONFLICT DO NOTHING').bind(key,key,scene,token,now)
 ]);return result[0].meta.changes===1;
}
export async function adventureProgress(db,key,now=Date.now()){
 const {results}=await db.prepare('SELECT event,period FROM island_adventure_events WHERE visitor_key=?').bind(key).all();
 const {results:claims}=await db.prepare('SELECT quest_id,period FROM island_adventure_rewards WHERE visitor_key=?').bind(key).all();
 return adventureQuests.map(q=>{const period=adventurePeriod(q,now),done=q.events.filter(e=>results.some(r=>r.event===e&&(!period||(q.repeat==='weekly'?r.period>=period&&r.period<=adventureDay(now):r.period===period)))).length;return {...q,period,done,complete:done===q.events.length,claimed:claims.some(r=>r.quest_id===q.id&&r.period===period)};});
}
export async function adventureClaim(db,key,id,now=Date.now()){
 const q=adventureQuests.find(q=>q.id===id);if(!q)return false;
 const period=adventurePeriod(q,now);
 const conditions=q.events.map(()=>"EXISTS(SELECT 1 FROM island_adventure_events WHERE visitor_key=? AND event=?"+(period?(q.repeat==='weekly'?' AND period>=? AND period<=?':' AND period=?'):'')+")").join(' AND ');
 const args=q.events.flatMap(e=>period?(q.repeat==='weekly'?[key,e,period,adventureDay(now)]:[key,e,period]):[key,e]);
 const r=await db.prepare('INSERT INTO island_adventure_rewards(visitor_key,quest_id,period,claimed_at) SELECT ?,?,?,? WHERE '+conditions+' ON CONFLICT DO NOTHING').bind(key,id,period,now,...args).run();return r.meta.changes===1;
}
export async function adventurePreference(db,key){return await db.prepare('SELECT * FROM island_adventure_preferences WHERE visitor_key=?').bind(key).first()||{tour_status:'new',npc_enabled:1};}
export function adventureEscape(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export const adventureCss='.adventure{margin:16px auto;padding:18px;border:1px solid #bacab3;border-radius:18px;background:#f7f3e4;color:#29483c;max-width:850px}.adventure nav,.adventure form{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.adventure a,.adventure button{display:inline-flex;align-items:center;min-height:44px;padding:8px 14px;border-radius:12px;background:#315b48;color:#fff8e5;text-decoration:none;border:0;font:inherit;cursor:pointer}main .adventure a:link,main .adventure a:visited{background:#e4ecd8;color:#29483c;border:1px solid #b8c8aa}main .adventure a:hover,main .adventure a:focus-visible{background:#d3e2c8;color:#29483c}main .adventure a:focus-visible{outline:3px solid #54734b;outline-offset:2px}.adventure svg{width:100%;max-height:420px;border-radius:16px}.adventure article{padding:15px 0;border-bottom:1px solid #c9d2bc}.adventure input{max-width:100%;min-height:44px}.adventure p{line-height:1.7}.adventure [role=status]{padding:10px;background:#e1ebd4;border-radius:10px}.adventure ol{padding-left:24px}.adventure li{margin:8px 0}.adventure small{display:block;margin:8px 0}';
export function adventureForm(action,token,label,extra=''){return '<form method="post" action="/dock/adventure"><input type="hidden" name="action" value="'+action+'"><input type="hidden" name="token" value="'+adventureEscape(token)+'">'+extra+'<button type="submit">'+label+'</button></form>';}
