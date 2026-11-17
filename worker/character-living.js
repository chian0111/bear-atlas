import {collectionArt,collectionCatalog,collectionIssue,collectionApply} from './collection.js';
import {adventureIssue,adventureRecord,adventureDay} from './adventure.js';
import {livingProducts} from './living-catalog.js';
export const livingCopy={
 title:['我的角色生活','My character life'],style:['商店換裝間','Shop dressing room'],furnish:['佈置商店家具','Arrange shop furnishings'],fireworks:['港灣星光煙火','Harbor starlight fireworks'],
 bear:['熊熊','Bear'],cat:['貓咪','Cat'],rabbit:['兔子','Rabbit'],knowledge:['知識','Knowledge'],adventure:['冒險','Adventure'],health:['健康','Health'],wealth:['財富','Wealth'],
 intro:['熊、貓、兔的經驗值分開保存，參與時使用哪一種角色，就由那一種角色累積。V100 起開始記錄，不會倒扣。','Bear, cat and rabbit keep separate experience. The character in use earns the experience. Tracking starts in V100 and never decays.'],
 rules:['閱讀／研究增加知識；探索、澆水、收成增加冒險；伸展與小食增加健康；賣出與交付訂單增加財富。每種角色、每天每項最多 20 XP。','Reading/research earns Knowledge; exploring, watering and harvests earn Adventure; stretching and snacks earn Health; sales and deliveries earn Wealth. Each character can earn up to 20 XP per attribute per Taiwan day.'],
 level:['等級','Level'],xp:['經驗值','Experience'],equip:['穿戴這件','Wear this'],clear:['換回原有造型','Use original style'],saved:['已保存，角色外觀與進度都跟著帳號。','Saved to your account.'],empty:['先到商店購買一件喜歡的服裝或配件。','Visit the shop to buy an outfit or accessory.'],
 shop:['前往海風小舖','Visit the shop'],home:['回小屋','Go home'],map:['回島嶼地圖','Island map'],read:['讀完，留下今天的閱讀記錄','Record today’s reading'],exercise:['完成伸展，記錄健康經驗','Record a stretch and earn Health'],done:['今天的活動已記錄，重複送出不會重複增加。','Today’s activity is recorded. Repeated submissions add nothing extra.'],
 ticketHint:['每日台灣時間 21:00–21:10。每張票供一個晚上使用；入場才扣票，同晚可重新進入。活動結束仍未用的票留待下次。僅持票帳號能取得煙火畫面。','Daily 21:00–21:10 Taiwan time. One ticket per evening, consumed on admission. Re-entry that evening is free. Unused tickets remain for a future evening. Only ticket holders receive the fireworks scene.'],
 enter:['使用一張票，入場看煙火','Use one ticket and enter'],waiting:['煙火尚未開場，下次台灣時間 21:00 見。','The show is closed. Join us at the next 21:00 Taiwan time.'],noTicket:['背包還沒有煙火票，到海風小舖選一張吧。','No fireworks ticket in your backpack. Pick one up at the shop.'],admitted:['今晚已入場，可以安心回來看。','Admitted for tonight. You may return freely.'],watch:['煙火在港灣上空綻放。','Fireworks bloom over the harbor.'],
 place:['放到這個位置','Place here'],shelf:['展示架','Display shelf'],window:['窗邊矮櫃','Window cabinet'],table:['客廳小桌','Living room table'],corner:['角落小台','Corner stand'],slot:['展示位置','Display slot'],
 furnishHint:['從已持有的擺設選一件，安排到小屋的展示架、窗邊、桌上或角落。每件仍佔一個展示位置；收回後回到背包，不會重複扣物品。','Choose an owned decoration for the shelf, window cabinet, table or corner stand. Each uses one display slot. Removing it returns it to your backpack without consuming another item.'],
 arrange:['在小屋擺放','Arrange in your cottage'],invalid:['操作或物品已更新，請回原頁重試。','This action or item changed. Reopen the page and try again.'],login:['請先登入島民證，讓物品與經驗值跟著你保存。','Sign in with your passport to save items and experience.'],nutrition:['享用小食也會留下角色經驗：麵包健康 +2、莓果健康 +3、花草茶知識 +1／健康 +1；受每日上限限制。','Snacks earn character experience: bread Health +2; berries Health +3; tea Knowledge +1 and Health +1, subject to daily caps.'],
};
export const livingT=(k,tag='span')=>'<'+tag+' data-i18n="living.'+k+'">'+livingCopy[k][0]+'</'+tag+'>';
export const livingSpecies=profile=>['cat','rabbit'].includes(profile?.bear)?profile.bear:'bear';
export const livingCss=`.character-life{max-width:960px;margin:auto}.character-life nav{display:flex;gap:10px;flex-wrap:wrap;margin:16px 0}.character-life a,.character-life button{display:inline-flex;align-items:center;min-height:44px;border:1px solid #b9c9a9;border-radius:14px;padding:10px 14px;background:#edf1df;color:#29483c;text-decoration:none;font:inherit}.character-life p{line-height:1.8}.character-life article{border:1px solid #cbd0b6;border-radius:20px;padding:20px;background:#faf5e7;margin:14px 0}.character-life article>svg{width:100px;height:110px}.character-life select,.character-life input{min-height:44px;max-width:100%}.character-life form{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.growth-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:14px}.growth-grid progress{width:100%;accent-color:#6d8d66}.growth-grid dl{display:grid;grid-template-columns:1fr auto;gap:12px}.growth-grid dd{margin:0}.fireworks-stage{position:relative;overflow:hidden;border-radius:26px;background:#152d42;min-height:320px}.fireworks-stage svg{display:block;width:100%}.fireworks-burst{transform-box:fill-box;transform-origin:center;animation:firework-bloom 4s ease-out infinite}.fireworks-burst:nth-child(2){animation-delay:1.3s}.fireworks-burst:nth-child(3){animation-delay:2.6s}@keyframes firework-bloom{0%{scale:.05;opacity:0}20%{opacity:1}75%,100%{scale:1.25;opacity:0}}@media(prefers-reduced-motion:reduce){.fireworks-burst{animation:none;opacity:1}}`;
export async function livingReady(db){try{return (await db.prepare("SELECT count(*) n FROM sqlite_master WHERE type='table' AND name IN ('island_character_growth','island_shop_styles','island_firework_admissions')").first())?.n===3;}catch{return false;}}
export async function livingProfile(db,key,profile){if(!profile)return profile;try{const style=await db.prepare('SELECT CASE WHEN EXISTS(SELECT 1 FROM island_collection_inventory i WHERE i.visitor_key=s.visitor_key AND i.item_id=s.outfit AND i.quantity>0) THEN outfit END shop_outfit,CASE WHEN EXISTS(SELECT 1 FROM island_collection_inventory i WHERE i.visitor_key=s.visitor_key AND i.item_id=s.accessory AND i.quantity>0) THEN accessory END shop_accessory FROM island_shop_styles s WHERE visitor_key=? AND species=?').bind(key,livingSpecies(profile)).first();return {...profile,...style};}catch{return profile;}}
export function livingDress(svg,profile){
 const item=livingProducts.find(p=>p.id===profile.shop_outfit&&p.type==='outfit'),accessory=profile.shop_accessory;
 let overlay='';if(item){svg=svg.replace('<svg ','<svg data-shop-color="'+item.color+'" ');overlay+='<g data-shop-outfit="'+item.id+'"><path d="M35 78Q60 65 85 78l4 28H31Z" fill="'+item.color+'"/><path d="M48 76q12 15 24 0" fill="none" stroke="#f6e6c2" stroke-width="4"/>'+(item.id==='lilac_apron'?'<rect x="43" y="86" width="34" height="20" rx="6" fill="#ede0cf"/>':item.id==='ocean_hoodie'?'<path d="M49 87v15m22-15v15" stroke="#f7e6ca" stroke-width="2"/>':'<path d="M35 101h54" stroke="#d4debf" stroke-width="5"/>')+'</g>';}
 if(accessory==='sun_hat')overlay+='<g data-shop-accessory="sun_hat"><ellipse cx="60" cy="28" rx="41" ry="9" fill="#e4c68b"/><path d="M34 26V15q26-17 52 0v11" fill="#e4c68b"/><path d="M34 22h52" stroke="#8f9f76" stroke-width="5"/></g>';
 if(accessory==='red_scarf')overlay+='<g data-shop-accessory="red_scarf"><path d="m32 72 28 13 28-13-7 19-21-6-15 21-8-4 12-20Z" fill="#b36c79"/></g>';
 if(accessory==='star_bag')overlay+='<g data-shop-accessory="star_bag"><path d="m35 76 54 26" stroke="#a78b5d" stroke-width="5"/><rect x="77" y="90" width="30" height="24" rx="7" fill="#ac986d"/><path d="m91 94 3 5 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1Z" fill="#fff0bf"/></g>';
 return svg.replace(/<\/svg>$/,overlay+'</svg>');
}
export async function livingStats(db,key){
 const rows=(await db.prepare(`SELECT species,SUM(knowledge) knowledge,SUM(adventure) adventure,SUM(health) health,SUM(wealth) wealth FROM (SELECT species,day,MIN(20,SUM(knowledge)) knowledge,MIN(20,SUM(adventure)) adventure,MIN(20,SUM(health)) health,MIN(20,SUM(wealth)) wealth FROM island_character_growth WHERE visitor_key=? GROUP BY species,day) GROUP BY species`).bind(key).all()).results;
 return ['bear','cat','rabbit'].map(species=>({species,knowledge:0,adventure:0,health:0,wealth:0,...rows.find(r=>r.species===species)}));
}
export function livingWindow(now=Date.now()){
 const local=new Date(now+28800000),minute=local.getUTCHours()*60+local.getUTCMinutes();return{day:adventureDay(now),open:minute>=1260&&minute<1270};
}
export function livingFireworkScene(){return '<div class="fireworks-stage" data-private-fireworks><svg viewBox="0 0 800 380" aria-hidden="true"><rect width="800" height="380" fill="#152d42"/><path d="M0 290h800v90H0Z" fill="#284b5d"/>'+[[200,120,'#f3d18a'],[430,95,'#b9d4ba'],[640,155,'#e3a8b5']].map(([x,y,color])=>'<g class="fireworks-burst">'+Array.from({length:16},(_,n)=>{const a=n*Math.PI/8;return '<path d="M'+(x+Math.cos(a)*18)+' '+(y+Math.sin(a)*18)+' '+(x+Math.cos(a)*68)+' '+(y+Math.sin(a)*68)+'" stroke="'+color+'" stroke-width="4" stroke-linecap="round"/>';}).join('')+'</g>').join('')+'<path d="M80 310h160l-25 25H105Z" fill="#ac8e6c"/><path d="M160 230v80m0-70 55 45h-55" fill="#eee0b6" stroke="#eee0b6" stroke-width="3"/></svg></div>';}
export async function livingActivity(db,key,profile,kind){const species=livingSpecies(profile),scene='growth:'+kind+':'+species;return '<form method="post" action="/world/character"><input type="hidden" name="action" value="activity"><input type="hidden" name="kind" value="'+kind+'"><input type="hidden" name="token" value="'+await adventureIssue(db,key,scene)+'"><button>'+livingT(kind==='read'?'read':'exercise')+'</button></form>';}
export async function characterRoute(request,env,url,ctx){
 const {key,profile,parse,page,redirect,avatar}=ctx,db=env.DB,now=Date.now(),species=livingSpecies(profile),path=url.pathname;
 const render=(body,status=200)=>page('<style>'+livingCss+'</style><section class="character-life">'+body+'</section>',status);
 const nav='<nav>'+[['title','/world/character'],['style','/world/style'],['furnish','/world/furnishings'],['fireworks','/world/fireworks'],['shop','/dock/shop'],['home','/dock/cabin']].map(([k,to])=>'<a href="'+to+'">'+livingT(k)+'</a>').join('')+'</nav>';
 if(!['GET','POST'].includes(request.method))return render(livingT('invalid','p'),405);
 if(!profile)return render(livingT('login','p')+'<a href="/passport">'+livingT('login')+'</a>',request.method==='POST'?403:200);
 if(!await livingReady(db))return render(livingT('invalid','p'),503);
 let feedback='';
 if(request.method==='POST'){
  const parsed=await parse(request,url,1800);if(!parsed.fields)return render(livingT('invalid','p'),parsed.status);const f=parsed.fields;
  if([...f.keys()].some(k=>!['action','item','slot','position','kind','token'].includes(k)||f.getAll(k).length!==1))return render(livingT('invalid','p'),400);
  const action=f.get('action');
  if(path==='/world/style'&&['equip','clear'].includes(action)){
   if(action==='clear')await db.prepare('DELETE FROM island_shop_styles WHERE visitor_key=? AND species=?').bind(key,species).run();
   else{const item=livingProducts.find(p=>p.id===f.get('item')&&['outfit','accessory'].includes(p.type));if(!item)return render(livingT('invalid','p'),400);
    const column=item.type==='outfit'?'outfit':'accessory';
    const result=await db.prepare('INSERT INTO island_shop_styles(visitor_key,species,'+column+') SELECT ?,?,? WHERE EXISTS(SELECT 1 FROM island_collection_inventory WHERE visitor_key=? AND item_id=? AND quantity>0) ON CONFLICT(visitor_key,species) DO UPDATE SET '+column+'=excluded.'+column).bind(key,species,item.id,key,item.id).run();if(!result.meta.changes)return render(livingT('invalid','p'),409);
   }return redirect('/world/style?saved=1');
  }
  if(path==='/world/character'&&action==='activity'&&['read','exercise'].includes(f.get('kind'))){
   const kind=f.get('kind'),scene='growth:'+kind+':'+species;
   if(!await adventureRecord(db,key,scene,f.get('token'),scene,adventureDay(now),now))return render(livingT('invalid','p'),409);return redirect('/world/character?done=1');
  }
  if(path==='/world/furnishings'&&action==='place'){
   const item=collectionCatalog.find(i=>i.id===f.get('item')&&i.type==='decor'),slot=Number(f.get('slot')),position=f.get('position');
   if(!item||![1,2,3,4].includes(slot)||!['shelf','window','table','corner'].includes(position))return render(livingT('invalid','p'),400);
   const token=await collectionIssue(db,key,'display',{item:item.id,slot,scene:'place:'+position}),result=await collectionApply(db,key,token,now);
   if(result.status!==303)return render(livingT('invalid','p'),result.status);return redirect('/world/furnishings?saved=1');
  }
  if(path==='/world/fireworks'&&action==='admit'){
   const window=livingWindow(now);if(!window.open)return render(livingT('waiting','p')+nav,409);
   if(!await db.prepare('SELECT 1 n FROM island_firework_admissions WHERE visitor_key=? AND day=?').bind(key,window.day).first()){
    const op=await db.prepare("SELECT * FROM island_collection_operations WHERE token=? AND visitor_key=? AND kind='sell' AND item_id='firework_ticket' AND coin_delta=0 AND applied_at IS NULL AND expires_at>?").bind(f.get('token'),key,now).first();
    if(!op)return render(livingT('invalid','p')+nav,409);
    try{await db.batch([db.prepare('INSERT INTO island_firework_admissions(visitor_key,day,token,admitted_at) VALUES(?,?,?,?)').bind(key,window.day,op.token,now),db.prepare('UPDATE island_collection_operations SET applied_at=? WHERE token=? AND visitor_key=? AND applied_at IS NULL').bind(now,op.token,key)]);}catch{return render(livingT('invalid','p')+nav,409);}
   }return redirect('/world/fireworks');
  }
  return render(livingT('invalid','p'),400);
 }
 if(path==='/world/character'){
  const rows=await livingStats(db,key);return render(livingT('title','h1')+livingT('intro','p')+livingT('rules','p')+(url.searchParams.has('done')?livingT('done','p'):'')+nav+'<div class="growth-grid">'+rows.map(row=>'<article data-growth-species="'+row.species+'"><h2>'+livingT(row.species)+(row.species===species?' ✓':'')+'</h2><dl>'+['knowledge','adventure','health','wealth'].map(k=>'<dt>'+livingT(k)+'</dt><dd>'+row[k]+' XP · '+livingT('level')+' '+(1+Math.floor(row[k]/20))+'</dd><progress max="20" value="'+row[k]%20+'" aria-label="'+livingCopy[k][0]+'"></progress>').join('')+'</dl></article>').join('')+'</div>'+livingT('nutrition','p'));
 }
 if(path==='/world/style'){
  const rows=(await db.prepare('SELECT item_id FROM island_collection_inventory WHERE visitor_key=? AND quantity>0').bind(key).all()).results,owned=livingProducts.filter(p=>rows.some(r=>r.item_id===p.id)&&['outfit','accessory'].includes(p.type));
  return render(livingT('style','h1')+nav+'<div class="style-preview">'+avatar+'</div>'+(url.searchParams.has('saved')?livingT('saved','p'):'')+(!owned.length?livingT('empty','p'):'')+owned.map(p=>'<article>'+collectionArt(p.id)+'<h2>'+livingT(p.id)+'</h2><form method="post"><input type="hidden" name="action" value="equip"><input type="hidden" name="item" value="'+p.id+'"><button>'+livingT('equip')+'</button></form></article>').join('')+'<form method="post"><button name="action" value="clear">'+livingT('clear')+'</button></form>');
 }
 if(path==='/world/furnishings'){
  const rows=(await db.prepare("SELECT i.item_id,i.quantity FROM island_collection_inventory i WHERE i.visitor_key=? AND i.quantity>0").bind(key).all()).results.filter(r=>collectionCatalog.find(i=>i.id===r.item_id)?.type==='decor');
  return render(livingT('furnish','h1')+livingT('furnishHint','p')+nav+(url.searchParams.has('saved')?livingT('saved','p'):'')+rows.map(r=>'<article>'+collectionArt(r.item_id)+'<h2>'+collectionArtName(r.item_id)+'</h2><form method="post"><input type="hidden" name="action" value="place"><input type="hidden" name="item" value="'+r.item_id+'"><label>'+livingT('slot')+'<select name="slot">'+[1,2,3,4].map(n=>'<option>'+n+'</option>').join('')+'</select></label><select name="position" aria-label="'+livingCopy.place[0]+'">'+['shelf','window','table','corner'].map(k=>'<option value="'+k+'" data-i18n="living.'+k+'">'+livingCopy[k][0]+'</option>').join('')+'</select><button>'+livingT('place')+'</button></form></article>').join(''));
 }
 if(path==='/world/fireworks'){
  const window=livingWindow(now),admitted=await db.prepare('SELECT 1 n FROM island_firework_admissions WHERE visitor_key=? AND day=?').bind(key,window.day).first(),tickets=(await db.prepare("SELECT quantity FROM island_collection_inventory WHERE visitor_key=? AND item_id='firework_ticket'").bind(key).first())?.quantity||0;
  let body=livingT('fireworks','h1')+livingT('ticketHint','p')+nav+'<p>'+livingT('firework_ticket')+' · '+tickets+'</p>';
  if(window.open&&admitted)body+=livingT('admitted','p')+livingT('watch','p')+livingFireworkScene();
  else if(window.open&&tickets){const token=await collectionIssue(db,key,'sell',{item:'firework_ticket',coins:0});body+='<form method="post"><input type="hidden" name="action" value="admit"><input type="hidden" name="token" value="'+token+'"><button>'+livingT('enter')+'</button></form>';}
  else body+=livingT(window.open?'noTicket':'waiting','p');
  const next=window.open?(Math.floor((now+28800000)/86400000)*86400000-28800000+1270*60000):(Math.floor((now+28800000)/86400000)*86400000-28800000+1260*60000+(new Date(now+28800000).getUTCHours()>=21?86400000:0));
  return render(body+'<span hidden data-firework-refresh-in="'+Math.max(1000,next-now)+'"></span><script src="/character-life.js" defer></script>');
 }
 return render(livingT('invalid','p'),404);
}
function collectionArtName(id){return '<span data-i18n="collection.'+id+'">'+(id==='lamp'?'暖光桌燈':id==='plant'?'雪松盆栽':id==='clock'?'木作小座鐘':id==='vase'?'奶油陶花瓶':id==='tray'?'藤編收藏盤':id==='mobile'?'海風貝殼吊飾':'落葉小相框')+'</span>';}
for(const p of livingProducts)livingCopy[p.id]=p.name;

export function characterLivingClient(){const timer=document.querySelector('[data-firework-refresh-in]');if(timer){const delay=Number(timer.dataset.fireworkRefreshIn);if(Number.isFinite(delay)&&delay>0&&delay<=86400000)setTimeout(()=>{document.querySelector('[data-private-fireworks]')?.remove();location.reload();},delay);}}
export async function livingHarbor(db,key,now=Date.now()){
 if(!await livingReady(db))return {notice:'',scene:''};
 const window=livingWindow(now),admitted=window.open&&await db.prepare('SELECT 1 n FROM island_firework_admissions WHERE visitor_key=? AND day=?').bind(key,window.day).first();
 const end=Math.floor((now+28800000)/86400000)*86400000-28800000+1270*60000;
 return {notice:'<style>'+livingCss+'.hb-stage>.fireworks-stage{position:absolute;inset:0;z-index:6;min-height:0;pointer-events:none;background:#152d42db}</style><section class="adventure" data-harbor-fireworks><h2>'+livingT('fireworks')+'</h2>'+livingT('ticketHint','p')+'<a href="/world/fireworks">'+livingT(window.open?'fireworks':'waiting')+'</a><a href="/dock/shop?category=tickets">'+livingT('firework_ticket')+'</a>'+(admitted?'<span hidden data-firework-refresh-in="'+Math.max(1000,end-now)+'"></span><script src="/character-life.js" defer></script>':'')+'</section>',scene:admitted?livingFireworkScene():''};
}
