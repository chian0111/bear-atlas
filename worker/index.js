import {i18nRuntime} from './i18n.js';
import {cozyDefaults,cozyValidate,cozyLoad,cozySave,cozyMarkup,cozyCss,cozyClient} from './cozy-living.js';
import {fullBody,upgradeCss,leisureArt,facilityHub,upgradeClient,resort3dClient,drinkArt} from './resort-upgrade.js';
import {golfShot,golfClient} from './golf.js';
import {shortestResortRoute,resortGeometry,resortArtwork,resortPorchArt,resortStyles} from './resort.js';
import {publicMapStyle,publicPlaceStyle,publicPlaceMarkup,publicPlaceClient} from './public-scenes.js';
import {sadMapPoint,sadMapArt,sadWalkPoint,sadComfort,sadStyles,sadIslandMarkup,sadIslandClient} from './sad-island.js';
import {bedroomCatalog,bedroomProblem,loadBedroom,saveBedroom} from './bedroom.js';
import {harborArt,harborGeometry} from './harbor-art.js';
import {harborNeighbors} from './harbor-neighbors.js';
import {residentQuests,cabinThemes,cabinCatalog,cabinDefaults,cabinRoomArt,cabin3DClient,islandLifeCalendar,cabinVisits,islandWeeklyEvents,cabinBedroomDefaults,cabinFurniture,cabinRoomBounds,cabinLayoutDefaults,cabinLayoutRects,cabinLayoutProblem,decodeCabinLayout,islandSecretClock,residentSecrets,seaPorts,bottleThemes} from './island-life.js';
const resortChromeCss=`
html{scroll-padding-top:180px}body{padding-top:172px!important}
.bear-language{display:flex;gap:4px;align-items:center;margin-left:auto}.bear-language button{min-height:44px;min-width:44px;padding:6px 10px;font-size:.8rem}.bear-language button[aria-pressed=true]{background:#315744;color:#fff}.resort-top-inner{position:relative}@media(max-width:639px){.bear-language{position:absolute;right:0;top:0}.resort-top-account{padding-right:100px}}
.resort-topbar{position:fixed;inset:0 0 auto;z-index:90;background:#fffaf1f5;border-bottom:1px solid #d4d8c5;backdrop-filter:blur(12px);padding:8px max(14px,env(safe-area-inset-left));box-shadow:0 3px 16px #294a3410}
.resort-top-inner{max-width:1120px;margin:auto;display:flex;gap:8px 24px;align-items:center;justify-content:space-between;flex-wrap:wrap}.resort-top-account{display:flex;align-items:center;gap:8px;min-width:0}.resort-top-account a{display:inline-flex;align-items:center;gap:7px;min-height:44px;text-decoration:none;font-weight:700}.resort-top-account small{display:inline;margin:0;font-size:.66rem;letter-spacing:.04em}.resort-top-links{display:flex;gap:4px;align-items:center}.resort-top-links a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:6px 14px;border-radius:12px;font-size:.86rem;text-decoration:none;white-space:nowrap}.resort-top-links a[aria-current=page]{background:#e5ecdb;color:#315744;font-weight:750}.resort-topbar a:focus-visible{outline:3px solid #a56d47;outline-offset:2px}
.hb-head .hb-identity,.hb-head .hb-account,.dock-back,.world-nav,.resort-porch>.resort-services{display:none!important}
.hb-share [data-hb-welcome-restart]{display:none}.resort-footer{display:flex;justify-content:center;padding:22px 8px 10px;font-size:.8rem}.resort-footer a{min-height:44px;display:inline-flex;align-items:center;color:#6a785e}.resort-idea{max-width:680px;margin:20px auto}.resort-idea p{line-height:1.95}.resort-idea h2{margin-top:30px;font-size:1.2rem}
@media(min-width:640px){body{padding-top:132px!important}html{scroll-padding-top:136px}}
@media(max-width:639px){.resort-top-inner{gap:0;justify-content:center}.resort-top-account{width:100%;justify-content:center}.resort-top-links{width:100%;justify-content:center}.resort-top-links a{flex:1;padding:5px 10px}.resort-top-account a{max-width:100%;overflow-wrap:anywhere}.resort-top-account small{max-width:95px}}
`;
function naturePage(profile){return html('<style>'+worldSceneCss+'</style><section class="resort-idea"><span class="trip-tag">BEAR ATLAS / SEASIDE RETREAT / TOWN / 05</span><h1>自然休憩區 · 海岸花園</h1><a class="scene-return" href="/world">← 回熊熊渡假村</a><p>花園、木棧道與面海長椅。今天不用帶著任何心事，也可以只是來看海。</p><figure class="resort-scene">'+leisureArt('nature',fullBody(profile?memberAvatar(profile,true):avatar('honey','picnic')))+'<figcaption>海風很輕，沿著木棧道慢慢走。</figcaption></figure><div class="place-actions"><button type="button" data-nature-rest>在海邊坐一會</button></div><p role="status" data-nature-status></p><details><summary>想找一個更安靜的角落？</summary><p>如果今天想整理心情，原本的傷心之島仍在。</p><a href="/world/sadness">前往安靜的心情角落</a></details></section><script src="/world-scene.js?v=resort-v83" defer></script>',200,worldSceneHeaders,{title:'海岸花園｜熊熊渡假村',brand:''});}

function resortTopbar(profile,code,path,english=false){const current=path==='/world'||path==='/islands'?'map':path.startsWith('/dock/cabin')||path.startsWith('/world/home')?'home':path.startsWith('/islands/neighbors')?'neighbors':'';return '<header class="resort-topbar"><div class="resort-top-inner"><div class="resort-top-account">'+(profile?'<a href="/passport" title="'+(english?'My passport':'我的護照')+'">'+escape(profile.nickname)+'<small>'+escape(code||'島民')+'</small></a>':'<a href="/passport?recover=1">'+(english?'Sign in':'島民登入')+'</a>')+'</div><nav class="resort-top-links" data-i18n-aria-label="nav.label" aria-label="'+(english?'Resort navigation':'渡假村主要導覽')+'">'+[['map','/world','地圖'],['neighbors',neighborPath,'找居民'],['home','/dock/cabin','回家'],['dock',harborDockPath,'碼頭']].map(([id,href,label])=>'<a data-i18n="'+({map:'nav.map',neighbors:'nav.residents',home:'nav.home',dock:'nav.dock'})[id]+'" href="'+href+'"'+(current===id?' aria-current="page"':'')+'>'+(english?({map:'Map',neighbors:'Residents',home:'Home',dock:'Dock'})[id]:label)+'</a>').join('')+'</nav><div class="bear-language" role="group" data-i18n-aria-label="language.label" aria-label="介面語言"><button type="button" data-locale="zh-TW" aria-pressed="true" lang="zh-TW">繁中</button><button type="button" data-locale="en" aria-pressed="false" lang="en">EN</button></div></div></header>';}
function resortIdea(english=false){if(english)return resortIdeaEnglish();return html('<article class="resort-idea idea-page"><nav class="idea-languages" aria-label="理念頁語言"><a href="/about" aria-current="page">繁體中文</a><a href="/about?lang=en" lang="en">English</a></nav><span class="trip-tag">A LITTLE WORLD BY KITTY</span><h1>留一個角落，給不用努力的自己。</h1><p>Bear Atlas 是一座為成年人創作的小小渡假村。在現實生活裡，我們常常忙著工作、回覆訊息、追趕進度；這裡想留下一點空白，讓人可以只是待著。</p><figure class="resort-scene">'+leisureArt('cafe')+'<figcaption>沿著海岸，給自己留一點空白。</figcaption></figure><h2>有自己的家，也有可以走走的世界</h2><p>我想創作的，是「成年人的心靈寄託小宇宙」。小屋收藏你的喜好，海岸接住短暫的疲倦；即使只來五分鐘，也能找到一件單純喜歡的小事。回小屋整理喜歡的角落，出門喝杯咖啡、推一顆球，或在海邊遇見正在散步的動物居民。每個小動作，都可以只是因為喜歡。</p><h2>朋友是陪伴，自在是前提</h2><p>你可以邀朋友來坐，也可以獨自看海。不需要天天報到，不需要比成績，更不需要為了跟上誰而留下。</p><h2>童趣，也是大人可以擁有的日常</h2><p>熊熊渡假村想保留柔軟、好奇與玩心。希望你離開時，帶走一點舒服，而不是多一張待辦清單。</p><div class="idea-gallery"><figure class="resort-scene">'+leisureArt('nature')+'<figcaption>一段不必趕路的海岸。</figcaption></figure><figure class="resort-scene">'+leisureArt('pool')+'<figcaption>一刻可以放慢的日常。</figcaption></figure></div><h2>把生活的節奏，還給自己</h2><p>早晨在咖啡街選一杯熱飲，午後到運動俱樂部動一動，傍晚沿著花園慢慢走回家。這些安排沒有標準順序，也沒有必須完成的清單。今天的你，決定今天的步調。</p><figure class="resort-scene">'+leisureArt('gym',fullBody(avatar('honey','picnic')))+'<figcaption>不是為了追上誰，單純享受身體動起來的感覺。</figcaption></figure><h2>一座慢慢長大的小世界</h2><p>從一間小屋、一段海岸，到動物居民散步的小鎮，Bear Atlas 會一點點長大。我希望每一次增加的細節，都讓這裡更容易親近：看得懂的路、可以坐下的椅子，以及隨時能回去的家。</p><p>願這裡成為你偶爾想回來的地方。你可以熱鬧，也可以安靜；不必交代理由，只要舒服地待著。</p><p>— Kitty · Bear Atlas</p><a class="cta" href="/world">回渡假村散步</a></article>',200,{}, {title:'創作理念｜Bear Atlas',brand:''});}

function resortIdeaEnglish(){const art=(kind,person='')=>leisureArt(kind,person).replace('海邊咖啡館與露台','Seaside café and terrace').replace('海岸花園與木棧道','Coastal garden and boardwalk').replace('無邊際游泳池','Infinity pool').replace('面海健身房','Seaside gym');return html('<article class="resort-idea idea-page" lang="en"><nav class="idea-languages" aria-label="Page language"><a href="/about" lang="zh-Hant">繁體中文</a><a href="/about?lang=en" aria-current="page">English</a></nav><span class="trip-tag">A LITTLE WORLD BY KITTY</span><h1>A little corner where you can simply be.</h1><p>Bear Atlas is a small seaside retreat created for grown-ups. Outside this little world, we spend our days working, replying to messages and keeping up. Here, I wanted to leave a little breathing room—a place where staying for a while is enough.</p><figure class="resort-scene">'+art('cafe')+'<figcaption>A little space for yourself, along the coast.</figcaption></figure><h2>A home of your own, and a world to wander</h2><p>I imagine Bear Atlas as a little universe of comfort for grown-ups. Your cabin holds the things you love; the coast offers a pause when you feel tired. Even a five-minute visit can hold one small, enjoyable moment. Arrange a favourite corner at home, head out for a coffee, roll a golf ball across the green, or pass an animal resident on a walk. You can do any of these things simply because you feel like it.</p><h2>Company, with room to be yourself</h2><p>Invite a friend to sit with you, or watch the sea on your own. There is no need to check in every day, compare scores or stay just to keep up with someone else.</p><h2>A little playfulness belongs in adult life, too</h2><p>This retreat makes room for softness, curiosity and play. I hope you leave feeling a little more at ease, without another to-do list to carry.</p><div class="idea-gallery"><figure class="resort-scene">'+art('nature')+'<figcaption>A coastline with no reason to hurry.</figcaption></figure><figure class="resort-scene">'+art('pool')+'<figcaption>A moment to let the day slow down.</figcaption></figure></div><h2>Find your own everyday rhythm</h2><p>Choose a warm drink on the café street in the morning, move a little at the sports club in the afternoon, and wander home through the garden at dusk. There is no set order and nothing you have to finish. You get to choose the pace of your day.</p><figure class="resort-scene">'+art('gym',fullBody(avatar('honey','picnic')))+'<figcaption>Enjoy moving, at your own pace.</figcaption></figure><h2>A small world, growing slowly</h2><p>From one cabin and a stretch of coast to a town of wandering animal residents, Bear Atlas will grow a little at a time. I hope each new detail makes it easier to feel at home: paths you can understand, chairs you can sit on, and a home you can always return to.</p><p>May this become a place you sometimes feel like coming back to. Be sociable or be quiet. You do not need a reason to stay.</p><p>— Kitty · Bear Atlas</p><a class="cta" href="/world">Take a walk around the retreat</a></article>',200,{}, {title:'Our story | Bear Atlas',brand:'',lang:'en'});}

export default {async fetch(request,env){
 const path=new URL(request.url).pathname;
 if(path==='/i18n/runtime.js'&&request.method==='GET')return new Response(i18nRuntime(),{headers:{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
 const response=path==='/about'&&request.method==='GET'?resortIdea(new URL(request.url).searchParams.get('lang')==='en'):await app.fetch(request,env);
 if(request.method!=='GET'||!response.headers.get('Content-Type')?.includes('text/html')||!/^\/(world|islands|dock|passport|about)(\/|$)/.test(path))return response;
 let profile=null,code='';try{const key=islanderOf(request);if(key){profile=await readPassportProfile(env.DB,key);if(profile){const row=await env.DB.prepare('SELECT member_no FROM island_credentials WHERE visitor_key=?').bind(key).first();if(row)code=memberLabel(row.member_no);}}}catch{}
 const at=['/world','/islands'].includes(path)?(new URL(request.url).searchParams.get('at')==='home'?11:[1,5,7,9,11].includes(Number(new URL(request.url).searchParams.get('at')))?Number(new URL(request.url).searchParams.get('at')):9):path.startsWith('/dock/cabin')||path.startsWith('/world/home')?11:path==='/dock/sports'?5:path==='/world/nature'||path==='/world/sadness'?7:['/dock/career','/dock/mba','/dock/finance','/dock/network','/dock/square'].includes(path)?1:9;let content=await response.text();if(!['/world','/islands','/about'].includes(path))content=content.replaceAll('href="/world"','href="/world?at='+at+'"');if(path==='/world/emerald')content=content.replace('<main>','<main><a class="scene-return" href="/world?at='+at+'">← 回熊熊渡假村</a>');const out=content.replace('<main>','<style>'+resortChromeCss+upgradeCss+'</style>'+resortTopbar(profile,code,path,path==='/about'&&new URL(request.url).searchParams.get('lang')==='en').replace('href="/world"','href="/world?at='+at+'"')+'<main>').replace('</main>','<footer class="resort-footer"><a data-i18n="nav.about" href="/about">'+(path==='/about'&&new URL(request.url).searchParams.get('lang')==='en'?'About Bear Atlas · 中文版':'關於 Bear Atlas · 創作理念')+'</a></footer></main>');const localizedHeaders=new Headers(response.headers);const csp=localizedHeaders.get('Content-Security-Policy');if(csp){localizedHeaders.set('Content-Security-Policy',/script-src [^;]*/.test(csp)?csp.replace(/script-src [^;]*/,"script-src 'self'"):csp+"; script-src 'self'");}return new Response(out.replace('</html>','<script src="/i18n/runtime.js" defer></script></html>'),{status:response.status,statusText:response.statusText,headers:localizedHeaders});
}};

const tokenPattern=/^[a-f0-9]{48}$/;
const harborDockPath='/islands?stop=dock';
const keyPattern=/^[a-f0-9]{64}$/;
const relayTicketLimit=6400;
const choices={yes:'我會去',maybe:'不確定',no:'不能去'};
const choiceKeys=['yes','maybe','no'];
const styles=`
:root{color:#243d34;background:#eaf0e7;font-family:system-ui,-apple-system,"Noto Sans TC",sans-serif;line-height:1.55}
*{box-sizing:border-box}body{margin:0;padding:clamp(16px,6vw,58px) 16px}main{width:min(100%,480px);margin:auto;padding:clamp(18px,6vw,34px);background:#fffaf1;border:1px solid #c9d2bf;border-radius:18px}
.brand{font-size:.78rem;letter-spacing:.15em;font-weight:750;color:#496858}h1{font-size:clamp(1.5rem,6vw,2.25rem);line-height:1.18;margin:12px 0;overflow-wrap:anywhere}p{margin:8px 0 13px}dl{margin:18px 0;padding:14px;border-radius:8px;background:#edf1e4}dt{font-size:.76rem;font-weight:700;margin-top:7px}dt:first-child{margin-top:0}dd{margin:0;overflow-wrap:anywhere}
form,label{display:grid;gap:8px}input,button{font:inherit;border:1px solid #839787;min-height:44px;border-radius:7px;padding:7px 10px;color:inherit;background:#fffdf8;min-width:0}button{font-weight:650;cursor:pointer}button:hover,button[aria-current=true]{background:#2c5546;color:white}small{display:block;color:#476254;margin-top:13px}.buttons{display:grid;gap:6px;grid-template-columns:repeat(3,minmax(0,1fr))}.notice{color:#28583e;font-weight:700}.alert{color:#8e3327}button:focus-visible,input:focus-visible{outline:3px solid #9e5934;outline-offset:2px}
`;
const headers={'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow, noarchive','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'"};
const html=(content,status=200,extra={},chrome={title:'運動邀約｜熊熊 Atlas',brand:'熊熊 ATLAS / 運動島'})=>new Response('<!doctype html><html lang="'+(chrome.lang||'zh-Hant')+'"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+chrome.title+'</title><style>'+styles+'</style><main><div class="brand">'+chrome.brand+'</div>'+content+'</main></html>',{status,headers:{...headers,'Content-Type':'text/html; charset=utf-8',...extra}});
const json=(data,status=200)=>Response.json(data,{status,headers});
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const hex=bytes=>Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
const randomToken=()=>hex(crypto.getRandomValues(new Uint8Array(24)));
const missing=()=>html('<h1>邀約已關閉或不存在</h1><p>請向邀約人確認最新的連結或活動資訊。</p>',404);
const cap=(s,n)=>typeof s==='string'&&s.trim().length>0&&s.length<=n;
const expires=(date,time)=>Date.parse(date+'T'+time+':00+08:00');
function validDetails(row){
 return cap(row.activity,45)&&cap(row.venue,160)&&typeof row.date==='string'&&/^\d{4}-\d\d-\d\d$/.test(row.date)&&typeof row.time==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(row.time)&&Number.isFinite(expires(row.date,row.time));
}
async function authorized(request,secret){
 const header=request.headers.get('X-Atlas-RSVP-Key');
 if(typeof secret!=='string'||secret.length<32||!header||header.length>180)return false;
 const encode=new TextEncoder(),digest=async s=>new Uint8Array(await crypto.subtle.digest('SHA-256',encode.encode(s)));
 const [a,b]=await Promise.all([digest(header),digest(secret)]);
 let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];return diff===0;
}
async function admin(request,env){
 if(!await authorized(request,env.SPORTS_RSVP_KEY))return json({error:'Not found'},404);
 if(request.method!=='POST')return json({error:'Method not allowed'},405);
 let row;
 try{const body=await request.text();if(body.length>2000)return json({error:'Invalid data'},400);row=JSON.parse(body);}catch{return json({error:'Invalid data'},400);}
 return organize(row,env);
}
async function organize(row,env){
 if(!row||typeof row.key!=='string'||!keyPattern.test(row.key))return json({error:'Invalid data'},400);
 const {DB:db}=env, key=row.key;
 if(row.op==='close'){
  await db.prepare("UPDATE sports_invites SET active=0, activity='', venue='', event_date='', event_time='', expires_at=0 WHERE invite_key=?").bind(key).run();
 }else if(row.op==='open'||row.op==='sync'){
  if(!validDetails(row))return json({error:'Invalid data'},400);
  const at=expires(row.date,row.time);
  if(row.op==='open'){
   if(at<=Date.now())return json({error:'邀約時間已過'},409);
   await db.prepare('INSERT INTO sports_invites(invite_key,token,activity,event_date,event_time,venue,expires_at,active) VALUES(?,?,?,?,?,?,?,1) ON CONFLICT(invite_key) DO UPDATE SET token=CASE WHEN sports_invites.active=0 OR sports_invites.expires_at<=? THEN excluded.token ELSE sports_invites.token END, activity=excluded.activity,event_date=excluded.event_date,event_time=excluded.event_time,venue=excluded.venue,expires_at=excluded.expires_at,active=1').bind(key,randomToken(),row.activity,row.date,row.time,row.venue,at,Date.now()).run();
  }else{
   await db.prepare('UPDATE sports_invites SET activity=?, event_date=?, event_time=?, venue=?, expires_at=? WHERE invite_key=? AND active=1 AND expires_at>?').bind(row.activity,row.date,row.time,row.venue,at,key,Date.now()).run();
  }
 }else if(row.op!=='read'){return json({error:'Invalid operation'},400);}
 if(row.op==='close'&&row.remove===true){
  await db.prepare('DELETE FROM sports_invites WHERE invite_key=?').bind(key).run();
  return json({ok:true});
 }
 const invite=await db.prepare('SELECT token,active,expires_at FROM sports_invites WHERE invite_key=?').bind(key).first();
 if(!invite)return json({state:'none',replies:[]});
 const {results}=await db.prepare('SELECT nickname,choice,updated_at AS updatedAt FROM sports_replies WHERE invite_key=? ORDER BY updated_at DESC LIMIT 150').bind(key).all();
 const state=invite.active!==1?'closed':invite.expires_at<=Date.now()?'expired':'open';
 return json({state,token:state==='open'?invite.token:undefined,replies:results});
}
async function redeemTicket(secret,ticket){
 if(typeof secret!=='string'||!/^[a-f0-9]{64}$/.test(secret)||typeof ticket!=='string'||ticket.length<40||ticket.length>relayTicketLimit||!/^[A-Za-z0-9_-]+$/.test(ticket))return null;
 try{
  const raw=Uint8Array.from(secret.match(/../g),pair=>parseInt(pair,16));
  const key=await crypto.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt']);
  const bytes=Uint8Array.from(atob(ticket.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0));
  const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes.slice(0,12),additionalData:new TextEncoder().encode('atlas-sports-rsvp-v1')},key,bytes.slice(12));
  return JSON.parse(new TextDecoder().decode(plain));
 }catch{return null;}
}
async function organizerRelay(request,env){
 const origin=request.headers.get('Origin');
 if(!origin||origin!==env.SPORTS_RSVP_OWNER_ORIGIN)return json({error:'Not found'},404);
 const cors={'Access-Control-Allow-Origin':origin,'Vary':'Origin'};
 const corsJson=(body,status)=>Response.json(body,{status,headers:{...headers,...cors}});
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,...cors,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});
 if(request.method!=='POST')return corsJson({error:'Method not allowed'},405);
 try{
  const body=await request.text();
  const claims=await redeemTicket(env.SPORTS_RSVP_RELAY_KEY,body);
  const now=Date.now();
  if(!claims||claims.origin!==origin||!Number.isSafeInteger(claims.expiresAt)||claims.expiresAt<=now||claims.expiresAt>now+65_000)
   return corsJson({error:'邀約操作已過期或無效，請再試一次。'},403);
  const response=await (claims.op?.startsWith('trip-')?organizeTrips(claims,env.DB):organize({...claims,remove:false},env));
  const outHeaders=new Headers(response.headers);for(const [name,value] of Object.entries(cors))outHeaders.set(name,value);
  return new Response(response.body,{status:response.status,headers:outHeaders});
 }catch{return corsJson({error:'暫時無法連上邀約回覆服務。'},503);}
}
const guestOf=request=>(request.headers.get('Cookie')||'').match(/(?:^|;\s*)atlas_guest=([a-f0-9]{48})(?:;|$)/)?.[1];
function isOwnReplyForm(request,url){
 const origin=request.headers.get('Origin');
 const site=request.headers.get('Sec-Fetch-Site');
 if(site&&site!=='same-origin')return false;
 // With Referrer-Policy: no-referrer, Chromium may send Origin: null for our form.
 // In that case require the browser's explicit same-origin signal.
 return origin===url.origin||((!origin||origin==='null')&&site==='same-origin');
}
function renderInvite(row,reply,notice='',status=200,profile=null,path=''){
 const date=row.event_date.replaceAll('-','/');
 const opts=choiceKeys.map(key=>'<button name="choice" value="'+key+'"'+(reply?.choice===key?' aria-current="true"':'')+'>'+choices[key]+'</button>').join('');
 return html('<h1>'+escape(row.activity)+'邀約</h1><dl><dt>時間（台灣）</dt><dd>'+escape(date+' · '+row.event_time)+'</dd><dt>集合地點</dt><dd>'+escape(row.venue)+'</dd></dl>'
 + (notice?'<p class="alert" role="alert">'+escape(notice)+'</p>':reply?'<p class="notice" role="status">已收到你的回覆：'+choices[reply.choice]+'。你可以在活動開始前修改。</p>':profile?'<p>選一個回覆就好。</p>':'')
 + (profile?'<form method="post"><p>以 '+escape(profile.nickname)+' 的島民證回覆</p><div class="buttons">'+opts+'</div></form><small>邀約人只會看到你的暱稱和回覆。<a href="/passport#passport-records">查看護照紀錄 ↗</a></small>':memberLinks(path)),status);
}
const app={async fetch(request,env){
 const url=new URL(request.url), path=url.pathname;
 try{
  if(path==='/world/nature'&&request.method==='GET')return naturePage(islanderOf(request)?await readPassportProfile(env.DB,islanderOf(request)):null);
  if(path==='/api/organizer')return await admin(request,env);
  if(path==='/api/organizer-relay')return await organizerRelay(request,env);
  if(path==='/world-scene.js'&&request.method==='GET')return new Response(worldSceneScript,{headers:{...headers,'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'public, max-age=300'}});
  if(path==='/islands/neighbors-chat.js'&&request.method==='GET')return new Response(neighborChatScript,{headers:{...headers,'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'public, max-age=300'}});
  if(request.method==='GET'&&(path===neighborPath||path.startsWith(neighborPath+'/')))return path===neighborPath?neighborDirectory():neighborConversation(url);
  if(path==='/sea-life.js'&&request.method==='GET')return new Response('('+seaLifeClient.toString()+')();',{headers:{...headers,'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'public, max-age=300'}});
  if(path==='/dock/secrets'||path.startsWith('/dock/secrets/')||path==='/dock/bottles'||path.startsWith('/dock/bottles/'))return await islandSeaRoutes(request,env,url);
  if(path==='/town-life.js'&&request.method==='GET')return new Response(drinkArt.toString()+';('+townLifeClient.toString()+')();',{headers:{...headers,'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'public, max-age=300'}});
  if(path==='/cozy-living.js'&&request.method==='GET')return new Response('('+cozyClient.toString()+')();',{headers:{...headers,'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'public, max-age=300'}});
  if(path==='/dock/cabin/environment'){const v=islanderOf(request),p=v?await readPassportProfile(env.DB,v):null;if(!p)return Response.json({error:'Sign in required'},{status:403});if(request.method!=='POST')return Response.json({error:'Method not allowed'},{status:405});const parsed=await dockForm(request,url,3000);if(!parsed.fields)return Response.json({error:parsed.error},{status:parsed.status});const f=parsed.fields,room=f.get('room');let state;try{state=JSON.parse(f.get('state'));}catch{}if([...f.keys()].some(k=>!['room','state','revision'].includes(k))||!['living','bedroom'].includes(room)||!cozyValidate(state)||!/^\d{1,10}$/.test(f.get('revision')||''))return Response.json({error:'Invalid environment'},{status:400});const current=await cozyLoad(env.DB,v,room);if(current.revision!==Number(f.get('revision')))return Response.json({error:'Conflict',revision:current.revision},{status:409});const saved=await cozySave(env.DB,v,room,state,current.revision);if(!saved)return Response.json({error:'Conflict',revision:(await cozyLoad(env.DB,v,room)).revision},{status:409});return Response.json({revision:current.revision+1},{headers:{'Cache-Control':'no-store'}});}
  if(path==='/cabin-life.js'&&request.method==='GET')return new Response(cabinLifeScript,{headers:{...headers,'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'public, max-age=300'}});
  if(path==='/dock/memories'||path==='/dock/visits'||path==='/dock/events'||path===questPath||path.startsWith(questPath+'/')||path===cabinPath||path===cabinPath+'/bedroom'||path.startsWith('/islands/cabins/'))return await islandLifeRoutes(request,env,url);
  if(path==='/islands'||path==='/dock'||path==='/world'||path.startsWith('/world/'))return await bearWorld(request,env,url);
  if(path.startsWith('/dock/'))return await islandDock(request,env,url);
  if(path==='/recovery-reminder.js'&&request.method==='GET')return new Response('('+recoveryReminderClient.toString()+')();',{headers:{...headers,'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'public, max-age=300'}});
  if(path==='/character-preview.js'&&request.method==='GET')return new Response('('+characterPreviewClient.toString()+')();',{headers:{...headers,'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'public, max-age=300'}});
  if(path==='/passport-image.js'&&request.method==='GET')return new Response(passportImageScript,{headers:{...headers,'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'public, max-age=300'}});
  if(path==='/jade-tour.js'&&request.method==='GET')return new Response(jadeTourScript,{headers:{...headers,'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'public, max-age=300'}});
  if(path==='/passport/founder')return await founderHandoff(request,env);
  if(path==='/passport/island'||path==='/passport/island/flight')return await founderIsland(request,env,url);
  if(path==='/passport'&&request.method==='HEAD')return await passportReadiness(env.DB);
  if(path==='/passport'||path.startsWith('/trip/'))return await passportRoutes(request,env,url);
  if(path==='/'&&request.method==='GET')return dockRedirect('/islands');
  const token=path.startsWith('/r/')?path.slice(3):'';
  if(!tokenPattern.test(token)||!['GET','POST'].includes(request.method))return missing();
  const {DB:db}=env;
  const row=await db.prepare('SELECT invite_key,activity,event_date,event_time,venue FROM sports_invites WHERE token=? AND active=1 AND expires_at>?').bind(token,Date.now()).first();
  if(!row)return missing();
  const guest=islanderOf(request),profile=guest?await readPassportProfile(db,guest):null;
  if(request.method==='GET'){
   const reply=profile?await db.prepare('SELECT nickname,choice FROM sports_replies WHERE invite_key=? AND guest_key=?').bind(row.invite_key,guest).first():null;
   return renderInvite(row,reply,'',200,profile,path);
  }
  if(!profile)return renderInvite(row,null,'請先登入島民證再回覆。',403,null,path);
  if(!isOwnReplyForm(request,url))return html('<h1>回覆尚未送出</h1><p>請重新開啟邀約頁，再填一次暱稱並選擇回覆。</p><p><a href="'+path+'">返回邀約頁</a></p>',403);
  if(!(request.headers.get('Content-Type')||'').startsWith('application/x-www-form-urlencoded'))return html('<h1>回覆格式不正確</h1>',400);
  const body=await request.text();
  if(body.length>1400)return html('<h1>回覆太長</h1>',400);
  const form=new URLSearchParams(body), nickname=profile.nickname,choice=form.get('choice');
  if(!choiceKeys.includes(choice))return renderInvite(row,null,'請選擇一個回覆。',400,profile,path);
  const legacy=guestOf(request),now=Date.now(), key=row.invite_key;
  if(legacy&&legacy!==guest)await db.prepare('UPDATE sports_replies SET guest_key=? WHERE invite_key=? AND guest_key=? AND NOT EXISTS (SELECT 1 FROM sports_replies WHERE invite_key=? AND guest_key=?)').bind(guest,key,legacy,key,guest).run();
  const saved=await db.prepare('INSERT INTO sports_replies(invite_key,guest_key,nickname,choice,updated_at) SELECT ?,?,?,?,? WHERE EXISTS (SELECT 1 FROM sports_invites WHERE invite_key=? AND token=? AND active=1 AND expires_at>?) AND (EXISTS(SELECT 1 FROM sports_replies WHERE invite_key=? AND guest_key=?) OR (SELECT COUNT(*) FROM sports_replies WHERE invite_key=?)<150) ON CONFLICT(invite_key,guest_key) DO UPDATE SET nickname=excluded.nickname,choice=excluded.choice,updated_at=excluded.updated_at').bind(key,guest,nickname,choice,now,key,token,now,key,guest,key).run();
  if(!saved.meta.changes)return renderInvite(row,null,'目前無法收下回覆，請直接聯絡邀約人。',409,profile,path);
  return dockRedirect(path);
 }catch(e){
  if(path==='/world'||path.startsWith('/world/'))return worldPage('熊熊世界暫時無法載入','<p>請稍後重新開啟。</p>',503);
  if(path.startsWith('/passport')){
   logPassportRead('passport',e);
   return harborHtml('<h1>暫時無法開啟護照</h1><p>請重開護照；若你是創辦人，可以回私人 Atlas 再開一次。</p><p><a href="/passport">重新開啟護照 ↗</a></p>',503);
  }
  return path==='/api/organizer'?json({error:'暫時無法連線'},503):html('<h1>暫時無法載入邀約</h1><p>請稍後再試。</p>',503);
 }
}};

const harborBears={
 honey:{species:'bear',label:'蜂蜜熊',fur:'#c18b60',inner:'#e7bc97',muzzle:'#f4d7b6'},
 mist:{species:'bear',label:'霧灰熊',fur:'#8c98a4',inner:'#bac6cd',muzzle:'#e1e8e9'},
 cocoa:{species:'bear',label:'可可熊',fur:'#72514b',inner:'#a57568',muzzle:'#e4b09b'},
 rabbit:{species:'rabbit',label:'奶油兔 Rabbit',fur:'#eadfc9',inner:'#d9afa8',muzzle:'#fff4df'},
 cat:{species:'cat',label:'奶茶貓 Cat',fur:'#f0e2ca',inner:'#e5b6aa',muzzle:'#fff3df'},
};
// Existing `bear` values are stable character IDs; species and appearance live in this catalog.
// Future catalog entries: dog, monkey, penguin, giraffe, polar-bear (not selectable yet).
const harborOutfits={
 explorer:{label:'探險背心',color:'#427560',trim:'#e6bc74'},
 sailor:{label:'港灣水手',color:'#42668a',trim:'#f4f3e6'},
 picnic:{label:'野餐圍巾',color:'#ab534d',trim:'#f5c4b7'},
};
const harborStyles=`
.trip-tag{display:inline-block;font-size:.78rem;letter-spacing:.1em;color:#416654}
.travel-note{white-space:pre-wrap;overflow-wrap:anywhere}
.pick-grid{display:grid;gap:7px;grid-template-columns:repeat(3,minmax(0,1fr))}
fieldset{border:0;margin:8px 0;padding:0;min-width:0}legend{font-weight:700;margin-bottom:6px}
.pick-grid label,.vote-choice{display:flex;align-items:center;gap:6px;border:1px solid #b4c5b7;border-radius:9px;padding:8px;min-width:0;background:#fffdf8}
.pick-grid label{flex-direction:column;text-align:center;min-height:90px;font-size:.8rem;justify-content:center}
.pick-grid input,.vote-choice input{min-height:0;margin:0;accent-color:#2c5546}
.pick-grid label:has(:checked),.vote-choice:has(:checked){outline:2px solid #3c7359;outline-offset:-2px;background:#eaf2e7}
.vote-choice span{overflow-wrap:anywhere}.vote-choice+.vote-choice{margin-top:7px}
.bear-art{width:100%;height:auto;max-width:110px;display:block}.pick-grid svg{max-width:47px}
.id-card{display:grid;grid-template-columns:minmax(65px,110px) minmax(0,1fr);align-items:center;gap:12px;margin-top:16px;border-radius:14px;padding:14px;background:#dfece0;border:1px solid #a2bdab}
.id-card h2,.id-card p{margin:4px 0;overflow-wrap:anywhere}.stamp{border:2px dashed #b57352;border-radius:12px;padding:10px 13px;margin:8px 0;color:#73432f;background:#fff5e7;overflow-wrap:anywhere}
.passport-recovery{margin:14px 0;padding:10px 12px;border:1px solid #b4c5b7;border-radius:8px}.passport-recovery form{margin-top:8px}.passport-recovery summary{cursor:pointer;font-weight:700}.recovery-code{font-family:monospace;width:100%;font-size:1rem;letter-spacing:.025em}
.cta{display:inline-block;border-radius:8px;background:#2c5546;color:#fff;padding:8px 12px}.closer{margin-top:12px}a{color:#2c5546}
`;
const islanderCookie=key=>'atlas_islander='+key+'; Path=/; Max-Age=15552000; Secure; HttpOnly; SameSite=Lax';
function harborHtml(body,status=200,cookie,extra={}){
 return html('<style>'+harborStyles+'</style>'+body,status,{...extra,...(cookie?{'Set-Cookie':islanderCookie(cookie)}:{})},{title:'熊熊渡假村｜Bear Atlas',brand:'BEAR ATLAS / SEASIDE RETREAT'});
}
function animalize(svg,id){
 const character=harborBears[id]||harborBears.honey,species=character.species;
 svg=svg.replace('<svg ','<svg data-character-id="'+id+'" data-species="'+species+'" ');
 if(species==='bear')return svg;
 const {fur,inner}=character;
 svg=svg.replace(/<circle cx="(?:31|89|32|87)" cy="(?:28|29)" r="(?:17|9|15|8)" fill="[^"]+"\/>/g,'');
 const ears=species==='rabbit'?'<ellipse cx="43" cy="15" rx="10" ry="27" fill="'+fur+'"/><ellipse cx="77" cy="15" rx="10" ry="27" fill="'+fur+'"/><ellipse cx="43" cy="13" rx="5.8" ry="20" fill="'+inner+'"/><ellipse cx="77" cy="13" rx="5.8" ry="20" fill="'+inner+'"/>':'<path d="M26 38Q22 13 29 5q14 0 26 22m10 0Q79 6 91 5q7 16 4 33" fill="'+fur+'"/><path d="m32 27 1-13q8 2 14 13m27 0q7-11 13-13l2 13" fill="'+inner+'"/>';
 svg=svg.replace('<ellipse cx="60" cy="51"',ears+'<ellipse cx="60" cy="51"').replace(/rx="(?:40|37)" ry="(?:33|31)"/,'rx="37" ry="32"');
 svg=svg.replace(/<ellipse cx="60" cy="6[12]" rx="(?:18|16)" ry="(?:13|11)" fill="[^"]+"\/>/,'');
 // Preserve shared garment IDs and geometry, using the reference's softer palette.
 for(const [from,to] of [['#427560','#879574'],['#42668a','#98aa94'],['#ab534d','#ba9387'],['#e6bc74','#ead9b7'],['#f5c4b7','#f3dfc8']])svg=svg.split(from).join(to);
 if(species==='cat')svg=svg.replace('<ellipse cx="60" cy="51" rx="37" ry="32" fill="'+fur+'"/>','<ellipse cx="60" cy="51" rx="37" ry="32" fill="'+fur+'"/><path d="M52 20q9-3 19 1l-3 12q-11 7-18-2z" fill="#cfae8e"/>');
 // Replace the old bear face while keeping the same avatar/accessory composition.
 svg=svg.replace(/<path d="M53 57q7-5 14 0-3 7-7 7t-7-7z"[^>]*\/>|<path d="M44 47v2m32-2v2"[^>]*\/>|<path d="M55 57q5-4 10 0-1 5-5 5t-5-5zm-11-9v2m31-2v2"[^>]*\/>/g,'');
 const face='<ellipse cx="42" cy="49" rx="6" ry="8" fill="#674b38"/><ellipse cx="78" cy="49" rx="6" ry="8" fill="#674b38"/><ellipse cx="40.5" cy="46" rx="2" ry="2.5" fill="#fff9eb"/><ellipse cx="76.5" cy="46" rx="2" ry="2.5" fill="#fff9eb"/><circle cx="44" cy="53" r="1" fill="#ead6b4"/><circle cx="80" cy="53" r="1" fill="#ead6b4"/><ellipse cx="34" cy="62" rx="7" ry="4.5" fill="#e8b5a5" opacity=".65"/><ellipse cx="86" cy="62" rx="7" ry="4.5" fill="#e8b5a5" opacity=".65"/><path d="M56 58q4-3 8 0l-4 4z" fill="#d89482"/><path d="M60 62v4q-4 5-8 0m8 0q4 5 8 0" fill="none" stroke="#a17b60" stroke-width="1.5" stroke-linecap="round"/>';
 svg=svg.replace('</svg>',face+(species==='cat'?'<path d="m33 58-9-2m9 8-10 2m64-8 9-2m-9 8 10 2" fill="none" stroke="#9b7d64" stroke-width="1.5" stroke-linecap="round"/>':'')+'</svg>');
 if(species==='rabbit')svg=svg.replace('viewBox="0 0 120 116"','viewBox="0 -16 120 132"').replace('viewBox="0 0 124 150"','viewBox="0 -16 124 166"');
 else svg=svg.replace(/(<svg[^>]+>)/,'$1<path d="M91 106q25-3 17-29-3-9-7-7" fill="none" stroke="#cfb091" stroke-width="9" stroke-linecap="round"/><path d="M107 80q-2-8-6-10" fill="none" stroke="'+fur+'" stroke-width="9" stroke-linecap="round"/>');
 return svg;
}
function characterPreviewClient(){const form=document.querySelector('#passport-form'),preview=form?.querySelector('[data-character-preview]');if(!preview)return;const submit=form.querySelector('button[type=submit]'),label=submit.textContent;let pending=false;form.addEventListener('submit',event=>{if(pending){event.preventDefault();return;}pending=true;submit.disabled=true;submit.textContent='正在保存，請稍候…';form.setAttribute('aria-busy','true');});window.addEventListener('pageshow',()=>{pending=false;submit.disabled=false;submit.textContent=label;form.removeAttribute('aria-busy');});form.addEventListener('change',()=>{const data=new FormData(form),key=data.get('bear')+'|'+data.get('outfit'),template=[...document.querySelectorAll('template[data-character-preview-key]')].find(t=>t.dataset.characterPreviewKey===key);if(template)preview.replaceChildren(template.content.cloneNode(true));});}
function avatar(bear,outfit){
 if(outfit==='dior')return coutureAvatar(bear);
 const {fur,inner,muzzle}=harborBears[bear];
 const {color,trim}=harborOutfits[outfit];
 const clothing=outfit==='picnic'?'<path d="M33 71q27 13 54 0v12q-26 12-54 0zM66 84l14 25 12-8-13-20z" fill="'+color+'"/><path d="M76 95l9-5m-6 11 9-5" stroke="'+trim+'" stroke-width="3"/>':outfit==='sailor'?'<path d="M31 77l28 22 30-22 7 30H24z" fill="'+color+'"/><path d="M31 78l28 24 30-24" fill="none" stroke="'+trim+'" stroke-width="5"/>':'<path d="M35 77l23 13 26-13 9 30H26z" fill="'+color+'"/><path d="M57 89v17m-20-7h12m22 0h12" stroke="'+trim+'" stroke-width="3" stroke-linecap="round"/>';
 return animalize('<svg class="bear-art" viewBox="0 0 120 116" aria-hidden="true"><circle cx="31" cy="28" r="17" fill="'+fur+'"/><circle cx="89" cy="28" r="17" fill="'+fur+'"/><circle cx="31" cy="28" r="9" fill="'+inner+'"/><circle cx="89" cy="28" r="9" fill="'+inner+'"/><path d="M21 106c0-19 17-32 39-32s39 13 39 32z" fill="'+fur+'"/>'+clothing+'<ellipse cx="60" cy="51" rx="40" ry="33" fill="'+fur+'"/><ellipse cx="60" cy="62" rx="18" ry="13" fill="'+muzzle+'"/><path d="M53 57q7-5 14 0-3 7-7 7t-7-7z" fill="#352d2b"/><path d="M44 47v2m32-2v2" stroke="#352d2b" stroke-width="5" stroke-linecap="round"/></svg>',bear);
}
const validDraft=/^[a-f0-9-]{36}$/;
function proposalFields(row){
 const title=typeof row.title==='string'?row.title.trim():'',context=typeof row.context==='string'?row.context.trim():'';
 if(!cap(title,85)||context.length>420||!Array.isArray(row.options)||row.options.length<2||row.options.length>4)return null;
 const options=row.options.map(x=>typeof x==='string'?x.trim():'');
 if(options.some(x=>!cap(x,90))||new Set(options.map(x=>x.toLowerCase())).size!==options.length)return null;
 return {title,context,options};
}
async function organizeTrips(row,db){
 const owner=row.key;
 if(typeof owner!=='string'||!keyPattern.test(owner))return json({error:'無法辨識提案。'},400);
 if(row.op==='trip-create'){
  const input=proposalFields(row);
  if(!input||typeof row.draft!=='string'||!validDraft.test(row.draft))return json({error:'請填提案名稱與兩到四個不同的選項。'},400);
  await db.prepare('INSERT OR IGNORE INTO trip_proposals(token,owner_key,draft_key,title,context,options_json,created_at) SELECT ?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM trip_proposals WHERE owner_key=?)<100').bind(randomToken(),owner,row.draft,input.title,input.context,JSON.stringify(input.options),Date.now(),owner).run();
  const saved=await db.prepare('SELECT token FROM trip_proposals WHERE owner_key=? AND draft_key=?').bind(owner,row.draft).first();
  if(!saved)return json({error:'目前最多可保留 100 張提案。'},409);
 }else if(row.op==='trip-close'){
  if(typeof row.token!=='string'||!tokenPattern.test(row.token))return json({error:'找不到這張提案。'},404);
  const result=await db.prepare('UPDATE trip_proposals SET closed=1 WHERE token=? AND owner_key=?').bind(row.token,owner).run();
  if(!result.meta.changes)return json({error:'找不到這張提案。'},404);
 }else if(row.op!=='trip-list')return json({error:'無法辨識提案操作。'},400);
 const {results}=await db.prepare('SELECT p.token,p.title,p.context,p.options_json,p.closed,b.option_index,COUNT(b.visitor_key) AS votes FROM trip_proposals p LEFT JOIN trip_ballots b ON p.token=b.proposal_token WHERE p.owner_key=? GROUP BY p.token,b.option_index ORDER BY p.created_at DESC,p.token').bind(owner).all();
 const output=new Map();
 for(const row of results){
  if(!output.has(row.token)){const options=JSON.parse(row.options_json);output.set(row.token,{token:row.token,title:row.title,context:row.context,options,closed:row.closed===1,counts:options.map(()=>0)});}
  if(row.option_index!==null)output.get(row.token).counts[row.option_index]=row.votes;
 }
 return json({proposals:[...output.values()]});
}
const islanderOf=request=>(request.headers.get('Cookie')||'').match(/(?:^|;\s*)atlas_islander=([a-f0-9]{48})(?:;|$)/)?.[1];
const passportRedirect=(key,path='/passport')=>new Response(null,{status:303,headers:{...headers,Location:path,...(key?{'Set-Cookie':islanderCookie(key)}:{})}});
const memberLabel=number=>number===-1?'BEAR-0000':'BEAR-'+String(number).padStart(4,'0');
const founderFor=(db,key)=>db.prepare('SELECT slot FROM island_founder WHERE visitor_key=?').bind(key).first();
async function founderHandoff(request,env){
 if(request.method!=='POST')return harborHtml('<h1>請從私人 Atlas 開啟創辦島民證</h1>',405);
 const origin=request.headers.get('Origin'), owner=env.SPORTS_RSVP_OWNER_ORIGIN;
 if(!owner||(origin!==owner&&!(origin==='null'&&request.headers.get('Sec-Fetch-Site')==='same-site'))||
    !(request.headers.get('Content-Type')||'').startsWith('application/x-www-form-urlencoded'))
  return harborHtml('<h1>請從私人 Atlas 開啟創辦島民證</h1>',403);
 const raw=await request.text();
 const claims=raw.length<=3000?await redeemTicket(env.SPORTS_RSVP_RELAY_KEY,new URLSearchParams(raw).get('ticket')):null;
 const now=Date.now();
 if(!claims||claims.op!=='founder-open'||claims.origin!==owner||typeof claims.key!=='string'||!keyPattern.test(claims.key)||
    !Number.isSafeInteger(claims.issuedAt)||!Number.isSafeInteger(claims.expiresAt)||claims.expiresAt<=now||
    claims.expiresAt-claims.issuedAt!==60000||claims.issuedAt>now+5000)
  return harborHtml('<h1>領取連結已失效</h1><p>請回私人 Atlas 再按一次。</p>',403);
 const record=await env.DB.prepare('INSERT INTO island_founder(slot,owner_key,visitor_key,last_issued) VALUES(1,?,?,?) ON CONFLICT(slot) DO UPDATE SET last_issued=excluded.last_issued WHERE island_founder.owner_key=excluded.owner_key AND island_founder.last_issued<excluded.last_issued RETURNING visitor_key').bind(claims.key,randomToken(),claims.issuedAt).first();
 if(!record)return harborHtml('<h1>請從私人 Atlas 重新開啟創辦島民證</h1>',403);
 const hasProfile=claims.destination==='island'&&await env.DB.prepare('SELECT 1 FROM island_passports WHERE visitor_key=?').bind(record.visitor_key).first();
 return passportRedirect(record.visitor_key,hasProfile?'/passport/island':'/passport');
}
const readCredential=(db,key)=>db.prepare('SELECT member_no,recovery_hash IS NOT NULL AS has_code FROM island_credentials WHERE visitor_key=?').bind(key).first();
async function ensureCredential(db,key){
 const old=await readCredential(db,key);
 if(old)return old;
 // The founder uses a separate number and does not advance the regular sequence.
 if(await founderFor(db,key))await db.prepare('INSERT INTO island_credentials (member_no,visitor_key) VALUES(-1,?) ON CONFLICT(visitor_key) DO NOTHING').bind(key).run();
 else await db.prepare('INSERT INTO island_credentials (visitor_key) SELECT p.visitor_key FROM island_passports p WHERE NOT EXISTS (SELECT 1 FROM island_credentials c WHERE c.visitor_key=p.visitor_key) AND NOT EXISTS (SELECT 1 FROM island_founder f WHERE f.visitor_key=p.visitor_key) ORDER BY p.rowid').run();
 return readCredential(db,key);
}
function recoveryNumber(){
 // Rejection sampling avoids bias when mapping random bytes to decimal digits.
 let code='';
 while(code.length<24)for(const b of crypto.getRandomValues(new Uint8Array(32))){
  if(b<250)code+=b%10;
  if(code.length===24)break;
 }
 return code;
}
async function recoveryHash(code){
 return hex(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode('bear-atlas-passport-recovery-v1:'+code))));
}
async function showNewRecovery(env,visitor,credential,replace=false,next=''){
 const {DB:db}=env;
 const code=recoveryNumber();
 const changed=await db.prepare('UPDATE island_credentials SET recovery_hash=? WHERE visitor_key=? AND (?=1 OR recovery_hash IS NULL)').bind(await recoveryHash(code),visitor,replace?1:0).run();
 if(!changed.meta.changes)return passportRedirect(visitor,next||'/passport');
 const grouped=code.match(/.{1,4}/g).join(' ');
 const profile=await readPassportProfile(db,visitor);
 return harborHtml('<style>'+dockStyles+'</style><span class="trip-tag">熊熊港城 / PASSPORT OFFICE</span><h1>'+(replace?'私人恢復碼已更新':'你的熊熊護照已就緒')+'</h1>'+
  (profile?islanderCard(profile,credential):'<p>島民編號：<strong>'+memberLabel(credential.member_no)+'</strong></p>')+
  '<section class="dock-recovery" data-recovery-setup><h2>請收好私人恢復碼</h2><p id="recovery-warning">這是你的帳號恢復碼。若未來需要恢復島民帳號，可能會用到這組代碼。請妥善保存，不要分享給其他島民。</p><label>私人恢復碼<input data-recovery-value class="recovery-code" type="text" readonly value="'+grouped+'" autocomplete="off" spellcheck="false" aria-describedby="recovery-warning"></label><p>這組碼只在這一步顯示；系統不保存可重新查看的原文。請存入密碼管理工具或其他私人、安全的位置。</p><button type="button" data-recovery-copy hidden>複製恢復碼</button><p role="status" data-recovery-status>也可以長按上方代碼，手動複製或抄寫保存。</p><form method="get" action="'+escape(next||'/passport')+'" data-recovery-confirm><label style="display:flex;align-items:center;gap:10px;min-height:48px;margin:14px 0"><input type="checkbox" required data-recovery-saved style="width:22px;min-height:22px;margin:0">我已保存恢復碼</label><button type="submit" data-recovery-continue>'+(next==='/world'||next==='/islands'?'帶我的熊熊上島':'完成保存並繼續')+'</button></form></section><script src="/recovery-reminder.js?v=71" defer></script>',200,visitor,{'Content-Security-Policy':headers['Content-Security-Policy']+"; script-src 'self'; connect-src 'none'"});
}
const choiceName=(prefix,key)=>' name="'+prefix+'" value="'+key+'"';
async function passportRoutes(request,env,url){
 const {DB:db}=env;
 if(!['GET','POST'].includes(request.method))return harborHtml('<h1>無法開啟這一頁</h1>',405);
 const visitor=islanderOf(request), fresh=visitor?undefined:randomToken(), person=visitor||fresh;
 const passport=url.pathname==='/passport';
 const founder=passport&&visitor?Boolean(await founderFor(db,visitor)):false;
 const token=passport?undefined:url.pathname.slice(6);
 const next=passport?returnPath(url.searchParams.get('next')):'';
 const profile=visitor?await readPassportProfile(db,visitor):null;
 if(!passport&&!tokenPattern.test(token))return harborHtml('<h1>找不到這張旅行提案</h1>',404);
 const row=passport?null:await db.prepare('SELECT title,context,options_json,closed FROM trip_proposals WHERE token=?').bind(token).first();
 if(!passport&&!row)return harborHtml('<h1>找不到這張旅行提案</h1>',404);
 const options=row?JSON.parse(row.options_json):[];
 let message='',recovering=passport&&url.searchParams.get('recover')==='1';
 if(request.method==='POST'){
  if(!passport&&!profile)return harborHtml('<h1>先登入再投票</h1>'+memberLinks(url.pathname),403);
  if(!isOwnReplyForm(request,url))return harborHtml('<h1>尚未送出</h1><p><a href="'+url.pathname+'">返回原頁再試一次</a></p>',403);
  if(!visitor)return harborHtml('<h1>瀏覽器未保留島民登入</h1><p>請在 Safari 或 Chrome 開啟這個連結，允許 Cookie，再回到原頁。如果你已領過護照，可用私人恢復碼找回。</p><p><a href="'+url.pathname+'">回到原頁</a></p>',400);
  if(!(request.headers.get('Content-Type')||'').startsWith('application/x-www-form-urlencoded'))return harborHtml('<h1>表單格式不正確</h1>',400);
  const raw=await request.text();
  if(raw.length>2000)return harborHtml('<h1>表單內容太長</h1>',400);
  const fields=new URLSearchParams(raw);
  if(passport){
   const action=fields.get('action')||'profile';
   if(action==='recover'){
    recovering=true;
    const code=(fields.get('recovery')||'').replace(/[\s-]/g,'');
    const matched=/^\d{24}$/.test(code)?await db.prepare('SELECT visitor_key FROM island_credentials WHERE recovery_hash=?').bind(await recoveryHash(code)).first():null;
    if(matched)return passportRedirect(matched.visitor_key,next||'/passport');
    message='恢復碼不正確。請確認你輸入的是 24 位私人恢復碼。';
   }else if(action==='issue'||action==='rotate'){
    const credential=await readCredential(db,visitor);
    if(credential)return showNewRecovery(env,visitor,credential,action==='rotate');
    message='請先領取島民證。';
   }else if(action==='profile'){
    const nickname=fields.get('nickname')?.trim(),bear=fields.get('bear'),outfit=fields.get('outfit');
    if(!cap(nickname,24)||!Object.hasOwn(harborBears,bear)||!Object.hasOwn(founder?founderLooks:harborOutfits,outfit))message='請填寫暱稱，並各選一位角色和一套衣服。';
    else{
     await db.prepare('INSERT INTO island_passports(visitor_key,nickname,bear,outfit,joined_at) VALUES(?,?,?,?,?) ON CONFLICT(visitor_key) DO UPDATE SET nickname=excluded.nickname,bear=excluded.bear,outfit=excluded.outfit').bind(visitor,nickname,bear,outfit,Date.now()).run();
     if(profile&&outfit!==profile.outfit)await db.prepare('UPDATE bear_world_looks SET active_slot=NULL WHERE visitor_key=?').bind(visitor).run();
     const credential=await ensureCredential(db,visitor);
     if(credential&&!credential.has_code)return showNewRecovery(env,visitor,credential,false,next);
     return passportRedirect(visitor,next||'/passport');
    }
   }else message='無法辨識這項護照操作。';
  }else{
   const rawOption=fields.get('option'),index=Number(rawOption);
   if(row.closed===1)message='投票已截止。';
   else if(rawOption===null||!/^[0-3]$/.test(rawOption)||index>=options.length)message='請先選一個旅行選項。';
   else{
    const saved=await db.prepare('INSERT INTO trip_ballots(proposal_token,visitor_key,option_index,cast_at) SELECT ?,?,?,? WHERE EXISTS (SELECT 1 FROM trip_proposals WHERE token=? AND closed=0) ON CONFLICT(proposal_token,visitor_key) DO UPDATE SET option_index=excluded.option_index,cast_at=excluded.cast_at').bind(token,visitor,index,Date.now(),token).run();
    if(saved.meta.changes)return new Response(null,{status:303,headers:{...headers,Location:url.pathname}});
    message='投票已截止。';
   }
  }
 }
 const error=message?'<p role="alert" class="alert">'+escape(message)+'</p>':'';
 if(!passport){
  const ballot=profile?await db.prepare('SELECT option_index FROM trip_ballots WHERE proposal_token=? AND visitor_key=?').bind(token,person).first():null;
  const voteChoices=options.map((o,i)=>'<label class="vote-choice"><input type="radio" name="option" value="'+i+'" required'+(ballot?.option_index===i?' checked':'')+'><span>'+escape(o)+'</span></label>').join('');
  return harborHtml('<span class="trip-tag">旅行提案所 / TRIP CLUB</span><h1>'+escape(row.title)+'</h1>'+(row.context?'<p class="travel-note">'+escape(row.context)+'</p>':'')+error+
   (ballot?'<p class="notice" role="status">已收到你的投票：'+escape(options[ballot.option_index])+'。</p>':'')+
   (row.closed===1?'<p>這張提案已結束投票。</p>':!profile?memberLinks(url.pathname):'<form method="post"><fieldset><legend>你最想選哪個？</legend>'+voteChoices+'</fieldset><button type="submit">'+(ballot?'更新我的選擇':'送出投票')+'</button></form>')+
   (ballot?'<p class="closer"><a class="cta" href="/passport">'+(profile?'打開我的熊熊護照':'選熊熊，領島民證')+'</a></p><small>'+(profile?'本次參與已記進護照。':'領證是選填；你也可以直接離開。')+'</small>':'<small>主辦人只會看到各選項的票數。</small>'),message?400:200,fresh);
 }
 const picks=(group,prefix,selected)=>Object.entries(group).map(([key,value])=>'<label><input type="radio"'+choiceName(prefix,key)+' required'+(key===selected?' checked':'')+'>'+(prefix==='bear'?avatar(key,founder?'explorer':profile?.outfit||'explorer'):'<span aria-hidden="true" style="width:22px;height:22px;border-radius:8px;background:'+value.color+'"></span>')+'<span>'+value.label+'</span></label>').join('');
 const recoverForm='<details id="passport-recover" class="passport-recovery"'+(recovering?' open':'')+'><summary>已有島民證？用私人恢復碼登入</summary><form method="post"><input type="hidden" name="action" value="recover"><label>24 位私人恢復碼<input name="recovery" required maxlength="40" inputmode="numeric" type="password" autocomplete="current-password" spellcheck="false"></label><button type="submit">找回我的島民證與護照</button></form></details>';

 const profileForm='<form id="passport-form" method="post" class="closer"><div data-character-preview aria-label="目前角色預覽">'+memberAvatar(profile||{bear:'honey',outfit:founder?'dior':'explorer'},true)+'</div><label>你的暱稱<input name="nickname" required maxlength="24" autocomplete="nickname" value="'+escape(profile?.nickname||(founder?'Kitty':''))+'"></label><fieldset><legend>選一位島民角色</legend><div class="pick-grid">'+picks(harborBears,'bear',profile?.bear||'honey')+'</div></fieldset>'+(founder?founderWardrobe(profile?.bear||'honey',lookKey(profile?.outfit)):'<fieldset><legend>挑一套衣服</legend><div class="pick-grid">'+picks(harborOutfits,'outfit',profile?.outfit||'explorer')+'</div></fieldset>')+'<button type="submit">'+(profile?(founder?'儲存我的造型':'更新角色和衣服'):founder?'領取創辦島民證':'領取島民證')+'</button></form>'+Object.keys(harborBears).flatMap(bear=>Object.keys(founder?founderLooks:harborOutfits).map(outfit=>'<template data-character-preview-key="'+bear+'|'+outfit+'">'+memberAvatar({bear,outfit},true)+'</template>')).join('')+'<script src="/character-preview.js?v=beta72" defer></script><small>不需真名或政府核發的身分證號。島民編號只是識別；換裝置時，請用私人恢復碼找回原本的護照。</small>';
 const styles='<style>'+dockStyles+passportBookStyles+passportImageStyles+(founder?estateStyles+founderFolioStyles:'')+'</style>';
 const title=founder?'<h1 class="folio-heading">創辦人護照</h1>':'<span class="trip-tag">熊熊港城 / PASSPORT OFFICE</span><h1>熊熊護照</h1>';
 if(!profile)return harborHtml(styles+title+error+(founder?'<p class="notice">BEAR-0000 已為你保留。選一隻熊熊與一套造型，就能領取你的私人島護照。</p>':'')+recoverForm+profileForm,message?400:200,fresh,{'Content-Security-Policy':headers['Content-Security-Policy']+"; script-src 'self'"});
 const credential=await ensureCredential(db,person);
 const recoveryStatus='<p class="passport-recovery" data-recovery-state>帳號恢復碼：'+(credential.has_code?'已設定':'尚未設定')+'</p>';
 const recoverySettings=recoveryStatus+(credential.has_code?'<details class="passport-recovery"><summary>更換私人恢復碼</summary><p>換碼後舊碼會立即失效。請先準備好保存新碼。</p><form method="post"><button name="action" value="rotate" type="submit">確認更換恢復碼</button></form></details>':'<div class="passport-recovery"><p>設定私人恢復碼後，就能在其他裝置找回這本護照。</p><form method="post"><button name="action" value="issue" type="submit">設定私人恢復碼</button></form></div>');

 const page=Math.min(100,Math.max(0,parseInt(url.searchParams.get('records'),10)||0));
 const [visits,pairs,islandVisits,records,questStamps]=await Promise.all([
  optionalPassportSection('trip-stamps',()=>tripStamps(db,person),null),
  optionalPassportSection('pair-stamps',()=>pairStamps(db,person),null),
  optionalPassportSection('island-stamps',async()=>{const {results}=await db.prepare('SELECT i.name FROM bear_world_visits v JOIN bear_world_islands i ON i.island_id=v.island_id WHERE v.visitor_key=? ORDER BY v.first_visit_at DESC LIMIT 12').bind(person).all();return results;},[]),
  optionalPassportSection('activity',()=>passportRecords(db,person,profile,page),'<p class="alert" role="status">活動紀錄暫時無法讀取。你的島民證和設定仍可使用。</p><p><a href="/passport#passport-records">重新開啟活動紀錄 ↗</a></p>'),
  optionalPassportSection('resident-quests',async()=>(await questRows(db,person)).results.filter(row=>row.step===2),[])
 ]);
 const image=passportImage(profile,credential);
 const identity=founder?founderPassportSpread(profile,passportDate(profile.joined_at),image):islanderCard(profile,credential)+image+'<div class="dock-actions"><a class="cta" href="/islands">前往熊熊島嶼 ↗</a> <a href="'+harborDockPath+'">訪客碼頭</a></div>';
 const stamps=passportStamps(founder,visits||[],pairs||[],islandVisits,questStamps)+(!visits||!pairs?'<p class="book-caption" role="status">有些護照章暫時無法讀取，請稍後再試。</p>':'');
 const book=passportBook([identity,stamps,records,'<p><a class="cta" href="/world/wardrobe">換裝與四套造型 ↗</a></p>'+profileForm+recoverySettings+recoverForm],recovering||Boolean(message));
 return harborHtml(styles+title+(founder?founderMapNav(env,'passport'):'')+error+(next?'<p><a class="cta" href="'+next+'">繼續剛才的活動 ↗</a></p>':'')+book,message?400:200,fresh,{'Content-Security-Policy':headers['Content-Security-Policy']+"; script-src 'self'; img-src data:"});
}

function logPassportRead(section,error){
 const detail=[error?.message,error?.cause?.message].filter(x=>typeof x==='string').join(' ');
 const table=/no such table:\s*(island_[a-z_]+|sports_[a-z_]+|trip_[a-z_]+)/i.exec(detail)?.[1];
 const kind=table?'missing-table:'+table:/no such column/i.test(detail)?'missing-column':/too many|limit exceeded/i.test(detail)?'query-limit':/D1|SQLITE/i.test(detail)?'database-error':error instanceof RangeError?'invalid-date':'unexpected-error';
 console.warn('[passport-read]',section,kind);
}
async function optionalPassportSection(section,read,fallback){
 try{return await read();}catch(e){logPassportRead(section,e);return fallback;}
}
async function tripStamps(db,person){
 return (await db.prepare('SELECT p.title FROM trip_ballots b JOIN trip_proposals p ON p.token=b.proposal_token WHERE b.visitor_key=? ORDER BY b.cast_at ASC LIMIT 30').bind(person).all()).results;
}
async function pairStamps(db,person){
 return (await db.prepare('SELECT token FROM island_pair_missions WHERE (owner_key=? OR partner_key=?) AND owner_answer IS NOT NULL AND partner_answer IS NOT NULL ORDER BY updated_at DESC LIMIT 30').bind(person,person).all()).results;
}
async function passportReadiness(db){
 // Read the same sections as the passport against a value that cannot be assigned to an islander.
 const probe='health-check';
 const checks=await Promise.all([
  optionalPassportSection('health-trip',()=>tripStamps(db,probe),null),
  optionalPassportSection('health-pair',()=>pairStamps(db,probe),null),
  optionalPassportSection('health-activity',()=>passportRecords(db,probe,{joined_at:0}),null)
 ]);
 return new Response(null,{status:checks.every(x=>x!==null)?204:503,headers});
}
const passportImageStyles=`
.passport-png{display:block;width:100%;height:auto;border:1px solid var(--book-line);border-radius:10px;user-select:auto;-webkit-touch-callout:default}
.passport-png[hidden],.passport-image-actions[hidden],.passport-sheet .id-card[hidden],.passport-sheet .founder-folio[hidden]{display:none}
.passport-image-actions{display:flex;flex-wrap:wrap;gap:6px 13px;align-items:center;margin:8px 0}
.passport-image-actions a,.passport-image-actions button{min-height:42px;display:inline-flex;align-items:center;color:var(--book-accent);font-size:.8rem;font-weight:700}
.passport-image-actions button{background:#fff9ec}.passport-image-actions button[hidden]{display:none}
.passport-image-tip{font-size:.76rem;color:#4f6257;margin:6px 0 0}
`;
function passportImage(profile,credential){
 const founder=credential.member_no===-1;
 return '<div id="passport-image-tools" data-founder="'+(founder?'yes':'no')+'" data-name="'+escape(profile.nickname)+'" data-member="'+memberLabel(credential.member_no)+'" data-date="'+escape(passportDate(profile.joined_at))+'">'+
  '<img class="passport-png" alt="'+escape(profile.nickname)+' 的'+(founder?'創辦人護照':'熊熊島民證')+' '+memberLabel(credential.member_no)+'" width="1200" height="780" hidden>'+
  '<p class="passport-image-tip" hidden>在手機長按上方圖片，即可儲存。也可以下載 PNG。</p>'+
  '<div class="passport-image-actions" hidden><a download>下載 PNG ↓</a><button type="button" hidden>分享／儲存圖片</button></div>'+
  '</div><script src="/passport-image.js" defer></script>';
}
const passportImageScript=String.raw`
'use strict';
(async()=>{
 const tools=document.getElementById('passport-image-tools');
 const sheet=tools?.closest('.passport-sheet');
 const original=sheet?.querySelector('.founder-folio,.id-card'),svg=original?.querySelector('svg');
 if(!svg||!original)return;
 const copy=svg.cloneNode(true);copy.setAttribute('xmlns','http://www.w3.org/2000/svg');
 const [, ,artWidth,artHeight]=copy.getAttribute('viewBox').split(/\s+/).map(Number);
 copy.setAttribute('width',artWidth);copy.setAttribute('height',artHeight);
 const picture=new Image();
 picture.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(copy));
 try{
  if(typeof picture.decode==='function')await picture.decode();
  else await new Promise((ok,fail)=>{picture.onload=ok;picture.onerror=fail;});
  const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=780;
  const ctx=canvas.getContext('2d');if(!ctx)return;
  const founder=tools.dataset.founder==='yes';
  const ink=founder?'#57383c':'#214b3b', secondary=founder?'#745153':'#3b6353';
  const edge=founder?'#b48280':'#8fa896', portrait=founder?'#f7e8de':'#f8f1da';
  const wash=ctx.createLinearGradient(0,0,1200,780);
  wash.addColorStop(0,founder?'#f7e9dd':'#f6efda');wash.addColorStop(1,founder?'#e5bdc1':'#bdd4c2');
  ctx.fillStyle=wash;ctx.fillRect(0,0,1200,780);
  ctx.strokeStyle=edge;ctx.lineWidth=2;ctx.strokeRect(30,30,1140,720);ctx.strokeRect(46,46,1108,688);
  ctx.fillStyle=portrait;ctx.fillRect(772,177,342,430);ctx.strokeRect(772,177,342,430);
  ctx.fillStyle=secondary;ctx.font='bold 23px ui-monospace,monospace';ctx.fillText('BEAR ATLAS / '+(founder?'JADE COVE':'ISLAND REGISTRY'),87,116);
  ctx.textAlign='right';ctx.fillText(founder?'PRIVATE EDITION':'HARBOR EDITION',1113,116);ctx.textAlign='left';
  const line=(y)=>{ctx.beginPath();ctx.moveTo(87,y);ctx.lineTo(1113,y);ctx.stroke();};
  line(143);line(636);
  const sans='system-ui,-apple-system,"PingFang TC","Noto Sans TC",sans-serif';
  ctx.font='650 40px '+sans;ctx.fillStyle=secondary;ctx.fillText(founder?'創辦人護照':'熊熊島民證',87,249);
  ctx.fillStyle=ink;
  const name=tools.dataset.name;
  let size=87;do{ctx.font='700 '+size+'px '+sans;size-=2;}while(size>=22&&ctx.measureText(name).width>636);
  ctx.fillText(name,84,372,636);
  ctx.font='700 45px ui-monospace,monospace';ctx.fillText(tools.dataset.member,87,461);
  ctx.font='600 30px '+sans;ctx.fillStyle=secondary;ctx.fillText('領證日 '+tools.dataset.date,87,554);
  const ratio=Math.min(278/artWidth,351/artHeight),w=artWidth*ratio,h=artHeight*ratio;
  ctx.drawImage(picture,943-w/2,380-h/2,w,h);
  ctx.font='650 21px ui-monospace,monospace';ctx.fillText(founder?'JADE COVE / FOUNDER':'JADE HARBOUR / ISLANDER',87,689);
  ctx.textAlign='right';ctx.fillText('ATLAS / 01',1113,689);
  const url=canvas.toDataURL('image/png');
  const img=tools.querySelector('img'),link=tools.querySelector('a'),share=tools.querySelector('button');
  img.src=url;
  if(typeof img.decode==='function')await img.decode();
  img.hidden=false;original.hidden=true;
  link.href=url;link.download='Atlas-'+tools.dataset.member+'.png';
  tools.querySelector('.passport-image-tip').hidden=false;
  tools.querySelector('.passport-image-actions').hidden=false;
  if(typeof navigator.canShare==='function'&&typeof navigator.share==='function'&&typeof File==='function'){
   const raw=atob(url.split(',')[1]),bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
   const file=new File([bytes],link.download,{type:'image/png'});
   if(navigator.canShare({files:[file]})){
    share.hidden=false;
    share.addEventListener('click',async()=>{try{await navigator.share({files:[file]});}catch(e){if(e.name!=='AbortError')link.click();}});
   }
  }
 }catch{ /* Keep the original card available if rendering is unsupported. */ }
})();
`;

const passportPageNames=[['passport-identity','島民證'],['passport-stamps','護照章'],['passport-records','活動紀錄'],['passport-settings','設定']];
const folioNumber=n=>String(n).padStart(2,'0');
function passportBook(sheets,openSettings=false){
 const tabs=passportPageNames.map(([id,label],i)=>'<a class="book-tab tab-'+(i+1)+'" href="#'+id+'"><small>'+folioNumber(i+1)+'</small>'+label+'</a>').join('');
 const sections=passportPageNames.map(([id,label],i)=>{
  const pageLink=(index,leading)=>index<0||index>=sheets.length?'<span></span>':'<a href="#'+passportPageNames[index][0]+'">'+(leading?'← ':'')+passportPageNames[index][1]+(leading?'':' →')+'</a>';
  return '<section class="passport-sheet sheet-'+(i+1)+'" id="'+id+'" tabindex="-1" aria-labelledby="sheet-heading-'+(i+1)+'"><header class="book-sheet-title"><h2 id="sheet-heading-'+(i+1)+'">'+label+'</h2><small>ATLAS / '+folioNumber(i+1)+'</small></header>'+sheets[i]+
   '<nav class="book-pager" aria-label="護照翻頁">'+pageLink(i-1,true)+'<span>第 '+(i+1)+' / '+sheets.length+' 頁</span>'+pageLink(i+1,false)+'</nav></section>';
 }).join('');
 return '<div class="passport-book"'+(openSettings?' data-open-settings="true"':'')+'><nav class="book-tabs" aria-label="護照目錄">'+tabs+'</nav>'+sections+'</div>';
}
function passportStamps(founder,visits,pairs,islandVisits=[],quests=[]){
 const tiles=[
  ['ARRIVAL','登島章 · 歡迎成為島民'],
  ...quests.flatMap(row=>{const q=residentQuests[row.quest_id];return q&&q.endings[row.path]?[['RESIDENT STORY',q.stamp+' · '+q.endings[row.path].title,questPath+'/'+row.quest_id]]:[];}),
  ...(founder?[['JADE COVE','私人島登記章 · 翡翠灣']]:[]),
  ...islandVisits.map(v=>['ISLAND VISIT','到訪章 · '+v.name]),
  ...visits.map((v,i)=>['TRIP CLUB',(i===0?'第一次參與提案':'旅行提案章')+' · '+v.title]),
  ...pairs.map(v=>['SEALED POSTCARD','雙人揭曉章',tokenPattern.test(v.token)?'/dock/pair/'+v.token:''])
 ];
 return '<p class="book-caption">完成一項指定活動，就會在這裡蓋章。</p><ul class="book-stamps">'+tiles.map(([code,title,link])=>'<li><small>'+code+'</small>'+(link?'<a href="'+link+'">'+escape(title)+' ↗</a>':'<strong>'+escape(title)+'</strong>')+'</li>').join('')+'</ul>';
}
const passportBookStyles=`
.passport-book{--book-line:#d7c6af;--book-accent:#2e5848;--book-paper:#fff9ee;margin:16px 0 5px}
.passport-book:has(.founder-folio){--book-line:#d8bcb6;--book-accent:#634449;--book-paper:#fff8f5}
.book-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:3px;align-items:end}
.book-tabs a{display:grid;text-align:center;place-content:center;gap:2px;min-height:46px;padding:4px 1px;border:1px solid var(--book-line);border-bottom:0;border-radius:7px 7px 0 0;background:#eee9dc;font-size:clamp(.7rem,3.2vw,.84rem);font-weight:650;line-height:1.3;color:#41584b;text-decoration:none;white-space:nowrap}
.book-tabs small,.book-sheet-title small{margin:0;font:650 .63rem/1.3 ui-monospace,monospace;letter-spacing:.07em;color:inherit}
.passport-sheet{padding:clamp(10px,4vw,20px);background:var(--book-paper);border:1px solid var(--book-line);border-radius:0 0 10px 10px;scroll-margin-top:12px}
/* A section receives focus when its page opens; the page itself is not a control. */
.passport-sheet:focus{outline:none}
.passport-book :is(a,button,input,summary):focus-visible{outline:2px solid var(--book-accent);outline-offset:2px}
.book-sheet-title{display:flex;align-items:baseline;justify-content:space-between;gap:6px;padding-bottom:8px;border-bottom:1px solid var(--book-line);margin-bottom:10px}
.book-sheet-title h2{margin:0;font-size:1.16rem}.book-sheet-title small{color:var(--book-accent);white-space:nowrap}
.book-pager{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:5px;border-top:1px solid var(--book-line);margin-top:15px;padding-top:7px;font-size:clamp(.69rem,3vw,.82rem)}
.book-pager a{min-height:40px;display:flex;align-items:center;font-weight:700;color:var(--book-accent)}.book-pager :last-child{justify-self:end}
.book-pager>span:nth-child(2){color:#5d6052;white-space:nowrap}.book-caption{font-size:.84rem;color:#4f6257}
.book-stamps{padding:0;margin:0;list-style:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
.book-stamps li{border:1px dashed #a26f59;border-radius:7px;padding:8px;background:#f9ecdc;color:#623c35;font-size:.78rem;overflow-wrap:anywhere}
.book-stamps small{margin:0 0 4px;font:.62rem/1.3 ui-monospace,monospace;letter-spacing:.045em;color:#743f32}.book-stamps a{color:#623c35;font-weight:700}
.passport-sheet .id-card{margin-top:8px}.passport-sheet .dock-section{margin-top:0}
@supports selector(:has(*)){
 .passport-sheet{display:none}
 .passport-book:not(:has(.passport-sheet:target,.passport-sheet :target)):not([data-open-settings]) .sheet-1,.passport-book[data-open-settings]:not(:has(.passport-sheet:target,.passport-sheet :target)) .sheet-4,.passport-sheet:target,.passport-sheet:has(:target){display:block}
 .passport-book:not(:has(.passport-sheet:target,.passport-sheet :target)):not([data-open-settings]) .tab-1,.passport-book[data-open-settings]:not(:has(.passport-sheet:target,.passport-sheet :target)) .tab-4,.passport-book:has(.sheet-1:target,.sheet-1 :target) .tab-1,.passport-book:has(.sheet-2:target,.sheet-2 :target) .tab-2,.passport-book:has(.sheet-3:target,.sheet-3 :target) .tab-3,.passport-book:has(.sheet-4:target,.sheet-4 :target) .tab-4{background:var(--book-accent);color:#fffaf0;border-color:var(--book-accent)}
}
`;

const dockStyles=`
.dock-actions{display:flex;flex-wrap:wrap;align-items:center;gap:9px 14px;margin:15px 0}.dock-actions a{min-height:40px;display:inline-flex;align-items:center;font-weight:650}
.dock-recovery{margin-top:15px;padding:12px;border:1px solid #b4c5b7;border-radius:9px;background:#f2f3e9}.dock-recovery h2{font-size:1rem;margin:0 0 7px}.dock-recovery p{font-size:.85rem;margin:7px 0 0}.dock-recovery input{padding-inline:7px;font-size:clamp(.74rem,3.7vw,1rem)}
.dock-banner{margin:16px 0 0;overflow:hidden;border:1px solid #cbd3be;border-radius:12px;background:#f4efe3}
.dock-banner svg{display:block;width:100%;height:auto}.dock-banner figcaption{padding:7px 10px;color:#35564d;font-size:.72rem;font-weight:650;letter-spacing:.08em}
.dock-profile{display:grid;grid-template-columns:64px minmax(0,1fr);align-items:center;gap:12px;padding:8px 11px;margin:12px 0;border-block:1px solid #d5dccb}
.dock-profile p{margin:1px 0;overflow-wrap:anywhere}.dock-profile small{margin:2px 0;font-family:ui-monospace,monospace}
.dock-section{margin:19px 0 0}.dock-section h2{font-size:1.12rem;margin:0 0 7px}
.dock-activity{padding:11px 0;border-top:1px solid #d8dccd}.dock-activity h3{font-size:.93rem;margin:0}.dock-activity p{font-size:.86rem;margin:3px 0}.dock-activity ul{margin:6px 0;padding-left:18px;overflow-wrap:anywhere}.dock-activity li+li{margin-top:4px}
.dock-map-note{font-size:.84rem;margin:0}
.dock-banner.dock-map{position:relative;margin-top:8px}.dock-map-pins{position:absolute;inset:0}
.dock-map-pin{position:absolute;left:var(--pin-x);top:var(--pin-y);transform:translate(-50%,-50%);width:clamp(28px,8vw,34px);height:clamp(28px,8vw,34px);display:grid;place-items:center;border-radius:50%;border:1px solid #35594c;background:#fff8e8;color:#234e44;font:750 .75rem/1 ui-monospace,monospace;text-decoration:none;box-shadow:0 2px 3px #254c4360}
.dock-map-pin:hover,.dock-map-pin:focus-visible{color:#fff8e8;background:#30564c;outline:2px solid #fff6e3;outline-offset:2px;z-index:1}
.dock-port-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));list-style:none;gap:6px;padding:0;margin:10px 0 0}
.dock-port-list li{min-width:0}.dock-port-list a{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:5px;align-items:center;padding:7px;min-height:56px;height:100%;border:1px solid #d5daca;border-radius:8px;background:#f8f6eb;text-decoration:none}.dock-port-list a:hover{background:#e9efdf}
.dock-port-list strong{font-size:.84rem}.dock-port-list small{font-size:.68rem;line-height:1.3;margin:0}.dock-port-number{color:#865743;font:700 .7rem/1 ui-monospace,monospace}
.dock-back{border-bottom:1px solid #d8dccd;padding-bottom:5px}.dock-back a{font-size:.84rem;min-height:44px;padding:4px 6px}
.dock-exercise{margin:13px 0;padding:13px;border:1px solid #cfd7c7;border-radius:8px;background:#eff2e7}.dock-exercise h2,.dock-activity h2{font-size:1.03rem;margin:0 0 7px}.dock-exercise summary{cursor:pointer;font-weight:650}.dock-exercise p{margin-bottom:0}
@media(max-width:345px){.dock-port-list{grid-template-columns:1fr}}
.passport-log{list-style:none;padding:0}.passport-log li{border-top:1px solid #d8dccd;padding:7px 0;overflow-wrap:anywhere}.passport-log small{margin:0}.pair-share{margin:12px 0}.pair-share input{width:100%}.dock-practice textarea,.dock-section select,main form select{font:inherit;color:inherit;background:#fffdf8;border:1px solid #839787;border-radius:7px;padding:9px;width:100%;min-width:0;scroll-margin-top:12px}
.dock-practice textarea{resize:vertical}.dock-practice textarea:focus-visible,.dock-section select:focus-visible{outline:2px solid #9e5934;outline-offset:2px}
.dock-practice small,.dock-section form small{margin:0}.dock-delete,.dock-withdraw{margin:10px 0}.dock-delete summary{font-size:.86rem;cursor:pointer}.dock-delete button{margin-top:8px}
.dock-greetings{list-style:none;margin:0 0 14px;padding:0}.dock-greetings li{display:grid;grid-template-columns:44px minmax(0,1fr);align-items:center;gap:9px;padding:6px 0;border-bottom:1px solid #d8dccd;overflow-wrap:anywhere}.dock-greetings p{margin:0;font-size:.86rem}
.dock-life-card{margin:8px 0;padding:11px;border:1px solid #d3dac9;background:#f3f4e9;border-radius:8px}.dock-life-card h3{margin:0;font-size:.96rem}.dock-life-card p,.dock-life-card a{font-size:.85rem}.dock-life-card p{margin:3px 0 7px}
.dock-activity-meta{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-top:7px}.dock-activity-meta small{margin:0}.dock-activity-meta button{min-height:38px;font-size:.83rem}
`;
const passportDate=timestamp=>{const ms=Number(timestamp);return timestamp!=null&&Number.isFinite(ms)&&Math.abs(ms)<=8640000000000000?new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(ms):'日期未記錄';};
const readPassportProfile=(db,visitor)=>db.prepare(`SELECT p.nickname,p.bear,p.joined_at,
 COALESCE(json_extract(w.slots_json,'$."'||w.active_slot||'".outfit'),p.outfit) AS outfit,
 json_extract(w.slots_json,'$."'||w.active_slot||'".shoes') AS shoes,
 json_extract(w.slots_json,'$."'||w.active_slot||'".bag') AS bag,i.name AS island_name
 FROM island_passports p LEFT JOIN bear_world_looks w ON p.visitor_key=w.visitor_key LEFT JOIN bear_world_islands i ON i.owner_key=p.visitor_key WHERE p.visitor_key=?`).bind(visitor).first();
function islanderCard(profile,credential){
 const founder=credential.member_no===-1, bear=harborBears[profile.bear]||harborBears.honey;
 const outfit=founder?founderLooks[lookKey(profile.outfit)]:(harborOutfits[profile.outfit]||harborOutfits.explorer);
 return '<section class="id-card" aria-label="我的島民證">'+memberAvatar(profile)+'<div><span class="trip-tag">'+(founder?'創辦島民 / FOUNDER':'島民證 / ISLANDER')+'</span><h2>'+escape(profile.nickname)+'</h2><p>'+bear.label+' · '+(outfit.name||outfit.label)+'</p><p><strong>'+memberLabel(credential.member_no)+'</strong></p><small>所屬島嶼：'+escape(profile.island_name||(founder?'翡翠灣':'熊熊港城'))+'<br>領證日 '+passportDate(profile.joined_at)+'</small></div></section>';
}
const dockActions=()=>'<div class="dock-actions"><a class="cta" href="/islands">前往熊熊島嶼 ↗</a><a href="/passport">查看我的護照</a><a href="'+harborDockPath+'">訪客碼頭</a></div>';
function ownerAtlasHref(env,path){
 try{
  const owner=new URL(env.SPORTS_RSVP_OWNER_ORIGIN);
  return owner.protocol==='https:'&&!owner.username&&!owner.password?escape(new URL(path,owner.origin).href):'';
 }catch{return '';}
}
function founderMapNav(env,page){
 const map=ownerAtlasHref(env,'/islands');
 const original=map?'<a class="cta" href="'+map+'">回原本的 Atlas 島嶼地圖 ↗</a>':'';
 const estate=page==='estate'?'':'<a '+(map?'':'class="cta" ')+'href="/passport/island">登上我的私人島・翡翠灣 ↗</a>';
 const passport=page==='passport'?'':'<a href="/passport">回創辦人護照</a>';
 const dock=page==='passport'?'<a href="'+harborDockPath+'">訪客碼頭 ↗</a>':'';
 return '<nav class="dock-actions" aria-label="創辦人島嶼導覽">'+original+estate+passport+dock+'</nav>';
}
const guestPorts=[
 {id:'tasks',n:'01',name:'任務港',hint:'挑一件今天想完成的事',point:[49,79],question:'今天只做一件事，會選什麼？',guide:'試著把它寫成一個 10 分鐘內就能開始的動作。例如「準備面試」可以先從「寫下三個常見題目」開始。'},
 {id:'career',n:'02',name:'港邊咖啡街',hint:'海邊咖啡館與麵包香，坐下喝杯喜歡的飲料',point:[29,38],question:'有哪一件事，因為你的參與而變得更好？',guide:'用「當時的情況 → 你做了什麼 → 後來有什麼改變」講一遍。最後補上一個可以驗證的結果。'},
 {id:'network',n:'03',name:'榕樹廣場',hint:'榕樹下歇腳，到社區看板找活動與居民留言',point:[48,43],question:'除了問「你平常都做什麼」，還可以怎麼開場？',guide:'試試：「你剛進這個產業時，哪一件事和你原本想的不一樣？」接著追問一個具體例子。'},
 {id:'mba',n:'04',name:'山丘書屋',hint:'沿山坡走進小書屋，在書櫃與窗邊閱讀桌旁停一會',point:[70,31],question:'如果一家咖啡店人變多，利潤卻變少，你會先查什麼？',guide:'把利潤拆成收入與成本。先分辨是每位客人花得更少，還是每筆訂單的成本變高，再挑一個數字驗證。'},
 {id:'english',n:'05',name:'旅人車站',hint:'帶著行李路過小車站，和旅人交換日常風景',point:[82,52],question:'What is one skill you would like to learn, and why?',guide:'Give a direct answer, add one reason, then give a specific example. Try saying it aloud in 45 seconds.'},
 {id:'sports',n:'06',name:'運動島',hint:'開啟朋友分享的揪團邀約',point:[29,69]},
 {id:'finance',n:'07',name:'潮汐市集',hint:'逛逛花店、甜點攤與手作小物，享受海風中的小確幸',point:[69,68],question:'預算有限時，你會保留哪一筆支出？',guide:'想像這個月需要少花 500 元。挑一筆最不影響生活的支出，再替它寫下一個替代方案。'},
 {id:'travel',n:'08',name:'旅行港',hint:'回看你參加過的旅行提案',point:[15,57]},
];
const privateExercises=Object.fromEntries(guestPorts.filter(p=>p.question).map(p=>[p.id,{...p}]));
for(const [id,name] of Object.entries({career:'職涯練習',network:'Coffee Chat 練習',mba:'MBA 個案練習',english:'英文口說練習',finance:'支出取捨練習'}))privateExercises[id].name=name;
const townPlaces={career:{kind:'cafe',objects:'海邊咖啡館 · 麵包店 · 戶外座椅',description:'麵包剛出爐，海風把咖啡香帶到露台。挑杯喜歡的飲料，今天不必急著談正事。',resident:'1-0'},network:{kind:'square',objects:'大榕樹 · 長椅 · 社區留言看板',description:'在樹蔭下坐一會兒。榕樹廣場的社區看板，留著居民的公開活動與留言。',resident:'2-0'},mba:{kind:'books',objects:'山坡書屋 · 書櫃 · 窗邊閱讀桌',description:'小書屋坐落在山坡上，窗邊留著一張閱讀桌。這裡歡迎每位喜歡故事的居民，不需要懂商業或管理。',resident:'3-4'},english:{kind:'station',objects:'小車站 · 行李箱 · 旅行地圖 · 明信片牆',description:'下一班車還沒到，先和旅人聊聊路上看見的風景。說中文也很好，英文練習由你自行選擇。',resident:'4-0'},finance:{kind:'market',objects:'花店 · 甜點攤 · 手作小物攤',description:'帶著海風的小攤慢慢開張。來看一束花、一塊甜點，或一件手作小物，不必先討論金錢與投資。',resident:'6-0'}};
function townProps(id){
 const house=(label,x=55,y=38)=>'<g transform="translate('+x+' '+y+')"><path d="M0 45 65 13 130 45 65 77Z" fill="#a5b59a"/><path d="M10 49v52l55 29 55-29V49L65 77Z" fill="#eee2c7"/><path d="m65 77 55-28v52l-55 29Z" fill="#d7c6a9"/><path d="M22 69v27l27 14V83Z" fill="#9fbfb0"/><path d="M78 83v29l25-13V70Z" fill="#aa8d6b"/><text x="65" y="55" text-anchor="middle" fill="#345343" font-size="11">'+label+'</text></g>';
 const bench='<path d="m35 141 37-19 35 17-37 20Z" fill="#b49771"/><path d="m42 146v13m57-12v13" stroke="#816d52" stroke-width="4"/>';
 const mug='<ellipse cx="248" cy="145" rx="24" ry="12" fill="#c4ac8b"/><path d="M246 128v11q0 7 12 7t12-7v-11" fill="#fff4db"/><ellipse cx="258" cy="128" rx="12" ry="5" fill="#94795e"/><path d="M270 130q12 0 6 9h-6" fill="none" stroke="#fff4db" stroke-width="4"/>';
 if(id==='career')return house('海邊咖啡館')+bench+mug+'<path d="m188 80 30-16 36 18-30 17Z" fill="#d6b0a0"/><path d="m194 86v31l30 15 24-13V89" fill="#f4e8cc"/><text x="223" y="111" text-anchor="middle" font-size="11" fill="#675941">麵包</text>';
 if(id==='network')return '<path d="M157 143V63m0 41-28-25m28 12 23-22" stroke="#a68b6c" stroke-width="16" stroke-linecap="round"/><g fill="#9aaf8e"><ellipse cx="157" cy="55" rx="60" ry="40"/><ellipse cx="111" cy="74" rx="37" ry="29"/><ellipse cx="199" cy="76" rx="40" ry="30"/></g><path d="m102 77-4 49m112-48 4 47" stroke="#839875" stroke-width="2"/>'+bench+'<path d="M247 132v33m45-32v32" stroke="#a78c69" stroke-width="5"/><rect x="236" y="96" width="65" height="44" rx="3" fill="#bda17a"/><rect x="242" y="102" width="53" height="30" fill="#f7eed5"/><path d="M249 110h30m-30 9h37" stroke="#8b9d7c" stroke-width="3"/>';
 if(id==='mba')return house('山丘書屋')+'<path d="M205 60v76h70V60Z" fill="#b89a73"/><path d="M211 82h58m-58 22h58m-58 22h58" stroke="#f0dabb" stroke-width="3"/><path d="M217 65v16m10-16v16m14-16v16m13-16v16m-36 7v15m14-15v15m16-15v15" stroke="#819878" stroke-width="8"/>'+bench+'<path d="m197 151 23-12 27 13-24 12Z" fill="#fff3d4"/>';
 if(id==='english')return house('旅人車站')+'<path d="m30 163 124-62m-113 73 124-62" stroke="#a49073" stroke-width="3"/><path d="M221 71h66v44h-66Z" fill="#f1e4c6"/><path d="m227 104 14-24 20 17 18-20" fill="none" stroke="#93ac98" stroke-width="3"/><rect x="238" y="132" width="32" height="25" rx="4" fill="#c3a17d"/><path d="M247 131v-7h14v7" fill="none" stroke="#987653" stroke-width="3"/><path d="m192 123 19 2-2 13-19-2Z" fill="#edd2c2"/>';
 return [40,131,222].map((x,i)=>'<g transform="translate('+x+' 65)"><path d="M0 35 33 18 65 35 33 52Z" fill="'+['#9faf8d','#d8b4a4','#c6b796'][i]+'"/><path d="M6 41v54l27 14 26-14V41" fill="#efdfc1"/><text x="33" y="78" font-size="11" text-anchor="middle" fill="#49614e">'+['花店','甜點','手作'][i]+'</text></g>').join('');
}
function townScene(id){return '<svg class="town-scene" viewBox="0 0 320 200" role="img" aria-label="'+townPlaces[id].objects+'"><path d="m12 130 145-78 151 78-151 65Z" fill="#e3d4b2"/>'+townProps(id)+'</svg>';}
function townMapProps(){return Object.keys(townPlaces).map(id=>{const i=guestPorts.findIndex(p=>p.id===id),{x,y}=harborGeometry.stops[i];return '<g data-town-scenery="'+id+'" aria-hidden="true" pointer-events="none" transform="translate('+(x-64)+' '+(y-77)+') scale(.4)">'+townProps(id)+'</g>';}).join('');}
function publicPlacePage(port,profile,legacy='',status=200){const portrait=fullBody(profile?memberAvatar(profile,true):avatar('honey','explorer'));return dockPage('TOWN / '+(port.id==='sports'?'03':port.n),port.id==='sports'?'運動俱樂部 · 海景果嶺':port.name,'<style>'+worldSceneCss+publicPlaceStyle+'</style>'+publicPlaceMarkup(port.id,portrait,neighborAvatar(port.id==='sports'?5:4,port.id==='sports'?4:0,harborNeighbors[port.id==='sports'?5:4][port.id==='sports'?4:0][2]),{tree:isoTree,house:isoHouse})+(port.id==='sports'?facilityHub(portrait)+'<p><a class="scene-return" href="/dock/square#new-meetup">＋ 找球伴・開團</a></p>':'')+legacy+'<script src="/world-scene.js?v=resort-v83" defer></script>',status,worldSceneHeaders);}
function townPlacePage(port,profile){
 if(port.id==='english')return publicPlacePage(port,profile);
 const place=townPlaces[port.id];let action='';
 if(port.id==='career')action='<section class="dock-exercise" data-town-cafe><h2>海邊咖啡館</h2><p>選一杯飲料，陪自己坐一會。</p><div class="town-drinker" aria-hidden="true">'+(profile?memberAvatar(profile,true):avatar('honey','explorer'))+'<span class="town-cup">☕</span></div><div class="town-drinks" role="group" aria-label="選擇飲料"><button type="button" data-town-drink="熱咖啡">熱咖啡</button><button type="button" data-town-drink="花草茶">花草茶</button><button type="button" data-town-drink="熱可可">熱可可</button></div><p data-town-status role="status">選好飲料後就能開始。</p><button type="button" data-town-sip hidden>喝一口</button><button type="button" data-town-again hidden>再選一杯</button></section><script src="/town-life.js?v=town81" defer></script>';
 if(port.id==='network')action='<section class="dock-exercise"><h2>社區留言看板</h2><p>在既有榕樹廣場查看公開活動與留言，登入原本的島民證後即可留言。</p><a class="cta" href="/dock/square">打開社區看板 ↗</a></section>';
 return dockPage('TOWN / '+port.n,port.name,'<style>.town-scene{display:block;width:min(100%,540px);margin:auto;background:#eef0df;border-radius:20px}.town-drinker{position:relative;width:130px;margin:14px auto}.dock-exercise .town-drinker>svg{display:block;width:130px;height:155px}.town-cup .resort-drink-art svg{width:58px;height:58px}.town-cup{position:absolute;right:10px;bottom:20px;font-size:32px}.town-drinks[hidden]{display:none}.town-drinks{display:flex;flex-wrap:wrap;gap:8px}.town-drinks button,[data-town-sip],[data-town-again]{min-height:44px}.town-drinker.is-sipping .town-cup{animation:town-sip 2s ease-in-out forwards}@keyframes town-sip{35%,70%{transform:translate(-45px,-34px) rotate(-4deg)}100%{transform:none}}@media(prefers-reduced-motion:reduce){.town-drinker.is-sipping .town-cup{animation:none;transform:translate(-45px,-34px)}}</style>'+(port.id==='career'?'<figure class="resort-scene">'+leisureArt('cafe')+'<figcaption>海景露台 · 木質咖啡屋 · 今天想喝什麼？</figcaption></figure>':townScene(port.id))+'<p>'+place.description+'</p>'+action,200,worldSceneHeaders);
}
function townLifeClient(){const root=document.querySelector('[data-town-cafe]');if(!root)return;const status=root.querySelector('[data-town-status]'),sip=root.querySelector('[data-town-sip]'),again=root.querySelector('[data-town-again]'),drinker=root.querySelector('.town-drinker'),choices=root.querySelector('.town-drinks');let chosen='';root.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;if(button.dataset.townDrink){chosen=button.dataset.townDrink;drinker.querySelector('.town-cup').innerHTML=drinkArt(chosen);choices.hidden=true;sip.hidden=false;status.textContent='你的'+chosen+'準備好了。點「喝一口」享受海風。';}else if(button===sip){drinker.classList.add('is-sipping');sip.hidden=true;again.hidden=false;status.textContent='你喝了一口'+chosen+'。海風暖暖的，這一刻留給自己。互動完成。';}else if(button===again){drinker.classList.remove('is-sipping');again.hidden=true;choices.hidden=false;status.textContent='想再喝點什麼？';}});}
const dockHeader=(tag,title)=>'<style>'+dockStyles+'</style><span class="trip-tag">BEAR ATLAS / SEASIDE RETREAT / '+tag+'</span><h1>'+title+'</h1>';
const greetings={wave:'嗨，我來登島啦！',coffee:'有人想一起喝杯咖啡、聊聊近況嗎？',practice:'今天一起練習一小步！',travel:'來交換旅行靈感吧！'};
const weeklyActivities={
 coffee:{title:'港灣咖啡桌',note:'這週找一個人聊聊近況，或到港邊咖啡街坐坐。',port:'network'},
 english:{title:'英文口說小隊',note:'想練英文時，可以從旅人車站的個人練習入口開始；也可以只聊旅行。',port:'english'},
 walk:{title:'海邊散步團',note:'挑一天散步 20 分鐘，帶回一個平常沒注意到的發現。',port:null},
};
function taipeiWeek(){
 const taipeiDate=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const monday=new Date(taipeiDate+'T00:00:00Z');
 monday.setUTCDate(monday.getUTCDate()-(monday.getUTCDay()+6)%7);
 return monday.toISOString().slice(0,10);
}
const dockNav=()=>'<nav aria-label="渡假村設施導覽" class="dock-actions dock-back"><a href="/world">← 回渡假村</a><a href="/world/home">回家</a><a href="/passport">我的護照 ↗</a></nav>';
const dockPage=(tag,title,body,status=200,extra={})=>harborHtml(dockHeader(tag,title)+dockNav()+'<a class="scene-return" href="/world">← 回熊熊渡假村</a>'+body,status,undefined,extra);
const dockRedirect=path=>new Response(null,{status:303,headers:{...headers,Location:path}});
async function dockForm(request,url,limit){
 if(!isOwnReplyForm(request,url)||!(request.headers.get('Content-Type')||'').startsWith('application/x-www-form-urlencoded'))return {status:403,error:'表單未送出，請回原頁再試一次。'};
 const raw=await request.text();
 return raw.length>limit?{status:400,error:'內容太長，請縮短後再試。'}:{fields:new URLSearchParams(raw)};
}
const dockError=message=>'<p class="alert" role="alert">'+escape(message)+'</p>';
async function islandPractice(request,db,url,visitor,port){
 const path='/dock/'+port.id+(townPlaces[port.id]?'?practice=1':'');
 const query=path.includes('?')?'&':'?';
 const previous=await db.prepare('SELECT answer FROM island_practice_answers WHERE visitor_key=? AND port=?').bind(visitor,port.id).first();
 let answer=previous?.answer||'',error='',status=200;
 if(request.method==='POST'){
  const parsed=await dockForm(request,url,12000);
  if(!parsed.fields){error=parsed.error;status=parsed.status;}
  else if(parsed.fields.get('action')==='delete'){
   await db.prepare('DELETE FROM island_practice_answers WHERE visitor_key=? AND port=?').bind(visitor,port.id).run();
   return dockRedirect(path+query+'removed=1');
  }else{
   answer=parsed.fields.get('answer')?.trim()||'';
   if(!cap(answer,800)){error='請輸入 1 到 800 個字元。';status=400;}
   else{
    await db.prepare('INSERT INTO island_practice_answers(visitor_key,port,answer,updated_at) VALUES(?,?,?,?) ON CONFLICT(visitor_key,port) DO UPDATE SET answer=excluded.answer,updated_at=excluded.updated_at').bind(visitor,port.id,answer,Date.now()).run();
    return dockRedirect(path+query+'saved=1#practice-answer');
   }
  }
 }
 const feedback=error?dockError(error):url.searchParams.has('saved')&&previous?'<p class="notice" role="status">已儲存到你的練習手帳。</p>':url.searchParams.has('removed')&&!previous?'<p class="notice" role="status">已刪除這一站的回答。</p>':'';
 return dockPage('ISLAND '+port.n,port.name,
  '<p>'+port.hint+'。</p><section class="dock-exercise"><h2>'+port.question+'</h2><details><summary>看練習提示</summary><p>'+port.guide+'</p></details></section>'+
  '<form method="post" action="'+path+'" class="dock-practice"><label for="practice-answer">我的回答</label><textarea id="practice-answer" name="answer" rows="5" maxlength="800" required placeholder="在這裡寫下你的想法…" aria-describedby="practice-private">'+escape(answer)+'</textarea>'+
  '<small id="practice-private">最多 800 字元。只有你能看見這份回答，可以隨時回來修改。</small>'+feedback+
  '<button name="action" value="save" type="submit">'+(previous?'更新回答':'儲存回答')+'</button></form>'+
  (previous?'<details class="dock-delete"><summary>管理這份回答</summary><form method="post" action="'+path+'"><button name="action" value="delete" type="submit">刪除這份回答</button></form></details>':''),status);
}
async function islandJournal(db,visitor){
 const {results}=await db.prepare('SELECT port,answer,updated_at FROM island_practice_answers WHERE visitor_key=? ORDER BY updated_at DESC').bind(visitor).all();
 const records=results.flatMap(r=>{const port=privateExercises[r.port];return port?['<article class="dock-exercise"><h2><a href="/dock/'+port.id+'?practice=1#practice-answer">'+port.name+'</a></h2><p class="dock-map-note">'+passportDate(r.updated_at)+' 更新</p><p class="travel-note">'+escape(r.answer)+'</p></article>']:[];}).join('');
 return dockPage('PRIVATE JOURNAL','我的練習手帳','<p>這裡只顯示你在島上儲存的回答。</p>'+(records||'<p>還沒有回答。<a href="/dock/mba?practice=1">MBA 個案練習</a>與<a href="/dock/english?practice=1">英文口說練習</a>仍保留在個人工具入口。</p>'));
}
const questPath='/dock/quests',cabinPath='/dock/cabin';
const lifeStyles=`
.market-badge{max-width:280px;margin:12px auto;padding:14px;border-radius:18px;background:#f3eedc;text-align:center;border:1px solid #d2c6a3}.market-badge summary{display:flex;flex-direction:column;align-items:center;cursor:pointer;list-style:none;min-height:44px}.market-badge summary::-webkit-details-marker{display:none}.market-badge summary span{font-size:.8rem;color:#637b58}.market-badge-art{display:block;width:min(100%,180px);height:auto;filter:drop-shadow(0 6px 5px #5d53382a)}.market-badge summary:focus-visible{outline:3px solid #54734b;border-radius:12px}.market-badge h3{margin:10px 0}.market-badge p{font-size:.85rem;line-height:1.7}.badge-award .market-badge-art{animation:badge-arrive .85s cubic-bezier(.2,.8,.3,1) both}@keyframes badge-arrive{0%{opacity:0;transform:translateY(22px) scale(.65) rotate(-12deg)}65%{opacity:1;transform:translateY(-5px) scale(1.08) rotate(4deg)}100%{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.badge-award .market-badge-art{animation:none}}.furniture-info[hidden]{display:none}.furniture-info{position:absolute;z-index:4;bottom:16px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;width:max-content;max-width:calc(100% - 24px);padding:9px 12px;border:1px solid #b9c8a7;border-radius:16px;background:#fff9ebf5;box-shadow:0 5px 16px #38523820}.furniture-info strong{font-size:.85rem}.furniture-info button{min-height:44px;font-size:.8rem;border-radius:10px}.is-layout-editing .furniture-info{display:none}

body{padding:12px;background:#e7ede4}main{width:min(100%,1000px);padding:clamp(14px,3vw,28px);border-color:#cbd2bf;border-radius:20px;background:#faf7ed}main>.brand{display:none}
.life-nav{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 18px}.life-nav a{display:inline-flex;align-items:center;min-height:44px;padding:6px 12px;border:1px solid #d3dac6;border-radius:999px;font-size:.8rem;text-decoration:none;background:#f4f2e4}.life-nav a[aria-current=page]{background:#2e5646;color:#fff8e7}
.life-kicker{font:700 .65rem/1.4 ui-monospace,monospace;letter-spacing:.13em;color:#7d7059}.life-heading{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}.life-heading h1{margin:5px 0 9px}.life-intro{color:#64715b;font-size:.9rem;line-height:1.8}
.life-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:20px}.life-card,.life-story,.life-reward,.cabin-tools{padding:16px;border:1px solid #d1d8c3;border-radius:17px;background:#fffbf0}
.life-card h2{font-size:1.16rem;margin:12px 0 8px;line-height:1.4}.life-card p{font-size:.87rem;line-height:1.8}.life-person{display:grid;grid-template-columns:52px minmax(0,1fr);gap:9px;align-items:center}.life-person svg{width:52px;height:52px;max-width:100%;display:block}.life-person strong{font-size:1rem}.life-person small{margin:0;font-size:.72rem}
.life-progress{font-size:.75rem;color:#53704f;font-weight:650}.life-action{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:7px 14px;border:1px solid #2e5646;border-radius:10px;background:#2e5646;color:#fff8e7;font-weight:650;text-decoration:none;font-size:.86rem}.life-card .life-action{width:100%}
.life-story{max-width:680px;margin:18px auto;line-height:1.9}.life-story h2{font-size:1.22rem;margin:8px 0}.life-story .life-person{margin-bottom:16px}.life-story p{font-size:.96rem}.life-story form{margin-top:18px;gap:10px}.life-story button{text-align:left;padding:12px 14px;border-radius:12px;background:#eef2e1;line-height:1.7}.life-story button:hover{background:#2e5646}
.life-reward{margin-top:16px;background:#eeeeda}.life-reward h3{font-size:1.07rem;margin:4px 0 10px}.life-reward p{font-size:.88rem}.life-reward small{margin-top:8px;font-size:.74rem}
.life-linkrow{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:14px 0}.life-linkrow a{min-height:44px;display:inline-flex;align-items:center;font-size:.85rem}
.cabin-layout{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(240px,1fr);gap:15px;align-items:start;margin-top:18px}
.cabin-display{margin:0;--cabin-wall:#dce4ca;--cabin-side:#b8cbb0;--cabin-floor:#d8bb90;--cabin-accent:#a8bfa5;border:1px solid #bdcbb1;border-radius:22px;overflow:hidden;background:#e8edde}
.cabin-display[data-theme=cream]{--cabin-wall:#f1e5ce;--cabin-side:#ddd1b4;--cabin-floor:#cbb18c;--cabin-accent:#d9bf98}
.cabin-display[data-theme=rose]{--cabin-wall:#eedbd3;--cabin-side:#d8bbb0;--cabin-floor:#d5bc9b;--cabin-accent:#cfa79f}
.cabin-scene{width:100%;height:auto;display:block}.cabin-scene [hidden]{display:none}.cabin-caption{padding:10px 14px;color:#596e52;font-size:.8rem;background:#f4f2e5}
.cabin-tools h2{font-size:1.15rem;margin:0 0 8px}.cabin-tools form{gap:12px}.cabin-tools label{font-size:.87rem;line-height:1.7}.cabin-tools select{font:inherit;width:100%;min-height:44px;padding:8px;border:1px solid #a8ba9c;border-radius:9px;background:#fffdf6;min-width:0}
.cabin-tools button[type=submit]{background:#2e5646;color:#fff8e7;border-radius:10px}
.cabin-sharing{display:flex;gap:8px;align-items:flex-start;padding:10px;background:#eef1e2;border-radius:10px}.cabin-sharing input{width:18px;height:18px;min-height:0;flex:none;margin:5px 0}
.cabin-share{margin-top:13px;border-top:1px solid #dde1d0;padding-top:12px}.cabin-share input{width:100%;font-size:.72rem}.cabin-share button{margin-top:7px}
.cabin-unlocks{margin-top:16px;padding:15px;border-radius:15px;background:#efefdf;border:1px dashed #bac6a7}.cabin-unlocks h2{font-size:1rem;margin:0 0 9px}.cabin-unlocks ul{margin:0;padding:0;list-style:none}.cabin-unlocks li{padding:8px 0;border-top:1px solid #d8deca;font-size:.84rem}.cabin-unlocks li a{display:inline-flex;min-height:44px;align-items:center}.cabin-unlocks li span{display:block;font-size:.73rem;color:#6c7d61}
.cabin-display [hidden]{display:none}.cabin-canvas{width:100%;height:380px;display:block;touch-action:none;cursor:grab}.cabin-canvas.is-dragging{cursor:grabbing}.cabin-canvas:focus-visible{outline:3px solid #526e52;outline-offset:-4px}.cabin-camera{display:flex;flex-wrap:wrap;justify-content:center;gap:5px;padding:6px}.cabin-camera button{min-height:44px;min-width:44px;padding:5px 10px;border-radius:9px;background:#f8f4e6;font-size:.8rem}.cabin-gesture{text-align:center;font-size:.68rem;color:#687760;margin:0 5px 5px}.cabin-preview{position:sticky;top:12px}.cabin-tabs{display:flex;gap:5px;margin:12px 0}.cabin-tabs[hidden],.cabin-tools [hidden]{display:none}.cabin-tabs button{flex:1;min-width:0;min-height:44px;padding:7px 4px;border-radius:10px;font-size:.8rem;background:#eef1e2}.cabin-tabs button[aria-pressed=true]{background:#2e5646;color:#fff8e7}.cabin-savebar{position:sticky;bottom:0;padding:8px 0 max(8px,env(safe-area-inset-bottom));background:#fffbf0;z-index:2}.cabin-savebar button{width:100%;min-height:48px}.cabin-unlocks summary{font-weight:650;cursor:pointer;min-height:44px;display:list-item;align-content:center}.cabin-daily-life{display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;padding:4px 10px;background:#f3f1e3}.cabin-daily-life label{font-size:.72rem;display:flex;gap:6px;align-items:center}.cabin-daily-life select{font:inherit;min-height:44px;max-width:180px;border:1px solid #b7c5a9;border-radius:9px;background:#fff9eb;padding:5px}.cabin-daily-life span{font-size:.72rem;color:#5c7254}.cabin-daily-life button{font-size:.72rem;min-height:44px;padding:5px 9px;border-radius:9px}.cabin-daily-life p{flex-basis:100%;font-size:.78rem;text-align:center;margin:0;line-height:1.6}.cabin-daily-life p:empty{display:none}.life-arrivals{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:16px 0}.life-arrivals article{padding:16px;border:1px solid #cbd4bd;border-radius:16px;background:#eef0df}.life-arrivals h2{font-size:1.08rem;margin:8px 0}.life-arrivals p,.life-memory p{font-size:.86rem;line-height:1.8}.life-memory{padding:14px;border:1px solid #d1d8c3;border-radius:15px;margin:15px 0}.life-memory summary{cursor:pointer;min-height:44px;align-content:center;font-weight:650}.life-memory ul{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}.life-memory li{padding:15px;margin:8px 0;border:1px solid #ded6be;background:#fffbef;border-radius:12px}.life-memory h3{font-size:1rem}.cabin-save-state{min-height:1.5em;font-size:.78rem;color:#6d7557}
@media(max-width:760px){.life-grid,.cabin-layout,.life-arrivals{grid-template-columns:1fr}.life-card{padding:15px}.cabin-tools select{font-size:16px}.cabin-layout{gap:8px}.cabin-preview{z-index:3;top:-105px;background:#faf7ed}.cabin-canvas{height:min(30dvh,250px)}.cabin-camera{gap:4px;padding:4px}.cabin-gesture{font-size:.62rem}.cabin-preview .cabin-scene{height:min(32dvh,260px);width:100%;object-fit:contain}.cabin-preview .cabin-caption{padding:5px 10px;font-size:.72rem}.cabin-tools{padding:12px}.cabin-tools form{gap:8px}.cabin-tools h2{font-size:1rem}.cabin-sharing{font-size:.75rem!important;padding:6px}.cabin-save-state{margin:0 0 6px}.cabin-tools .cabin-tabs{margin:8px 0}.life-story{padding:16px}.life-story p{font-size:.92rem}.life-nav{gap:4px}.life-nav a{font-size:.74rem;padding:5px 9px}}
`;
const lifeNav=page=>'<nav class="life-nav" aria-label="島上生活"><a href="/islands">← 島嶼地圖</a><a href="'+questPath+'"'+(page==='quests'?' aria-current="page"':'')+'>居民委託</a><a href="'+cabinPath+'"'+(page==='cabin'?' aria-current="page"':'')+'>我的小屋</a><a href="/dock/events"'+(page==='events'?' aria-current="page"':'')+'>本週事件</a><a href="/passport#passport-stamps">我的護照</a></nav>';
const lifePage=(title,body,status=200,page='quests')=>html('<style>'+harborStyles+lifeStyles+'</style>'+lifeNav(page)+body,status,{'Content-Security-Policy':worldSceneHeaders['Content-Security-Policy']+"; connect-src 'self'"},{title:escape(title)+'｜熊熊 Atlas',brand:''});
function questPerson(quest){
 const [district,slot]=quest.resident.split('-').map(Number),resident=harborNeighbors[district][slot];
 return '<div class="life-person">'+neighborAvatar(district,slot,resident[2])+'<div><strong>'+quest.name+'</strong><small>'+quest.role+'</small></div></div>';
}
const questRows=(db,visitor)=>db.prepare('SELECT quest_id,step,path,completed_at FROM resident_quests WHERE visitor_key=?').bind(visitor).all();
function questDeck(rows,profile){
 return '<span class="life-kicker">ISLAND STORIES / FIRST SEASON</span><div class="life-heading"><h1>今天，幫誰一個小忙？</h1><a class="life-action" href="'+cabinPath+'">看看我的小屋 ↗</a></div>'+
  '<p class="life-intro">走進三位居民的小故事，做兩次選擇，帶回一枚紀念章和一件小屋擺設。</p><div class="life-grid">'+
  Object.entries(residentQuests).map(([id,quest])=>{
   const row=rows.find(r=>r.quest_id===id),done=row?.step===2;
   return '<article class="life-card">'+questPerson(quest)+'<h2>'+quest.title+'</h2><p>'+quest.intro+'</p>'+
    '<p class="life-progress">'+(done?'已完成 · '+quest.endings[row.path].title:row?'進行中 · 已做 '+row.step+' 次選擇':'兩次選擇 · 四種結局')+'</p>'+
    '<small>完成可獲得 '+quest.rewardName+'</small><p><a class="life-action" href="'+questPath+'/'+id+'">'+(done?'回看我的結局':row?'繼續委託':profile?'接受委託':'看看故事')+' ↗</a></p></article>';
  }).join('')+'</div>';
}
async function residentQuestRoute(request,db,url,visitor,profile){
 const id=url.pathname.slice(questPath.length+1),quest=residentQuests[id];
 if(url.pathname===questPath){
  if(request.method!=='GET')return lifePage('居民委託','<h1>請從故事卡開始</h1>',405);
  const rows=profile?(await questRows(db,visitor)).results:[];
  return lifePage('居民委託',questDeck(rows,profile));
 }
 if(!Object.hasOwn(residentQuests,id))return lifePage('找不到委託','<h1>找不到這份委託</h1>',404);
 if(!profile)return lifePage(quest.title,'<span class="life-kicker">RESIDENT QUEST</span><h1>'+quest.title+'</h1><section class="life-story">'+questPerson(quest)+'<p>'+quest.intro+'</p>'+memberLinks(url.pathname)+'</section>',request.method==='POST'?403:200);
 let error='',status=200;
 if(request.method==='POST'){
  const parsed=await dockForm(request,url,1500);
  if(!parsed.fields){error=parsed.error;status=parsed.status;}
  else if(parsed.fields.get('action')==='start'){
   await db.prepare('INSERT INTO resident_quests(visitor_key,quest_id) VALUES(?,?) ON CONFLICT(visitor_key,quest_id) DO NOTHING').bind(visitor,id).run();
   return dockRedirect(url.pathname);
  }else if(parsed.fields.get('action')==='choose'){
   const step=parsed.fields.get('step'),path=parsed.fields.get('path'),choice=parsed.fields.get('choice');
   if(!['0','1'].includes(step)||!['a','b'].includes(choice)||typeof path!=='string'||path.length!==Number(step)||!/^[ab]*$/.test(path)){
    error='請從目前的故事段落選擇。';status=400;
   }else{
    const updated=await db.prepare('UPDATE resident_quests SET step=step+1,path=path||?,completed_at=CASE WHEN step=1 THEN ? ELSE NULL END WHERE visitor_key=? AND quest_id=? AND step=? AND path=?')
     .bind(choice,Date.now(),visitor,id,Number(step),path).run();
    if(updated.meta.changes)return dockRedirect(url.pathname);
    const current=await db.prepare('SELECT path FROM resident_quests WHERE visitor_key=? AND quest_id=?').bind(visitor,id).first();
    if(current?.path.startsWith(path+choice))return dockRedirect(url.pathname);
    error='故事進度已更新，請接著目前的段落玩。';status=409;
   }
  }else{error='請選擇一個故事行動。';status=400;}
 }
 const row=await db.prepare('SELECT step,path FROM resident_quests WHERE visitor_key=? AND quest_id=?').bind(visitor,id).first();
 let story='';
 if(!row)story='<p>'+quest.intro+'</p><form method="post"><button name="action" value="start">我來幫忙 ↗</button></form>';
 else if(row.step===2){
  const ending=quest.endings[row.path];
  story='<span class="life-kicker">YOUR ENDING</span><h2>'+ending.title+'</h2><p>'+ending.text+'</p>'+
   '<section class="life-reward"><h3>一段故事，帶回一點生活</h3><p>護照已蓋上「'+quest.stamp+'」，小屋已解鎖「'+quest.rewardName+'」。</p>'+
   '<a class="life-action" href="'+cabinPath+'">回小屋擺上紀念品 ↗</a><small>這是你第一次完成的結局，之後可以隨時回來重讀。</small></section>';
 }else{
  const branch=row.step===0?quest:quest.branches[row.path];
  story='<p class="life-progress">第 '+(row.step+1)+' 次選擇，共兩次</p><p>'+(row.step===0?quest.intro:branch.text)+'</p><h2>'+branch.question+'</h2>'+
   '<form method="post"><input type="hidden" name="action" value="choose"><input type="hidden" name="step" value="'+row.step+'"><input type="hidden" name="path" value="'+row.path+'">'+
   Object.entries(branch.choices).map(([value,label])=>'<button name="choice" value="'+value+'">'+label+'</button>').join('')+'</form>';
 }
 return lifePage(quest.title,'<span class="life-kicker">RESIDENT QUEST / '+quest.name.toUpperCase()+'</span><h1>'+quest.title+'</h1>'+
  (error?dockError(error):'')+'<section class="life-story">'+questPerson(quest)+story+'</section>',status);
}
function availableCabinItems(rows){
 const completed=new Set(rows.filter(r=>r.step===2).map(r=>r.quest_id));
 return Object.fromEntries(Object.entries(cabinCatalog).map(([slot,options])=>[slot,Object.fromEntries(Object.entries(options).filter(([,value])=>!value[1]||completed.has(value[1])))]));
}
function cabinSettings(row,available,room='living'){
 const settings={...cabinDefaults,...row,room};
 settings.layout=decodeCabinLayout(row?.layout_json||'{}',settings.corner!=='none',room)||decodeCabinLayout('{}',true,room);
 if(!Object.hasOwn(cabinThemes,settings.theme))settings.theme=cabinDefaults.theme;
 for(const slot of ['wall','desk','corner'])if(!Object.hasOwn(available[slot],settings[slot]))settings[slot]=cabinDefaults[slot];
 return settings;
}
function cabinScene(settings,available,caption,profile){
 const bear=harborBears[profile?.bear]||harborBears.honey,baseOutfit=harborOutfits[profile?.outfit]||{color:founderLooks[profile?.outfit]?.clothes.match(/fill="(#[a-fA-F0-9]+)"/)?.[1]||harborOutfits.explorer.color,trim:'#e9d6b3'},outfit=bear.species==='bear'?baseOutfit:{...baseOutfit,color:({'#427560':'#879574','#42668a':'#98aa94','#ab534d':'#ba9387'})[baseOutfit.color]||baseOutfit.color};
 return '<figure class="cabin-display" data-cabin-display data-cabin-instances="'+(settings.instances?'1':'0')+'" data-cabin-room="'+(settings.room||'living')+'" data-room-to="'+escape(settings.roomTo||'')+'" data-cabin-held="'+escape(settings.held||'')+'" data-cabin-layout="'+escape(JSON.stringify(settings.layout||cabinLayoutDefaults))+'" data-bear-species="'+bear.species+'" data-bear-look="'+escape(profile?.outfit||'explorer')+'" data-bear-trim="'+(outfit.trim||'#e6bc74')+'" data-bear-bag="'+(worldBags[profile?.bag]?.[1]||'')+'" data-bear-shoes="'+(worldShoes[profile?.shoes]?.[1]||'')+'" data-bear-fur="'+bear.fur+'" data-bear-outfit="'+outfit.color+'" data-theme="'+settings.theme+'">'+cabinRoomArt(settings,available)+'<canvas class="cabin-canvas" hidden tabindex="0" role="img" aria-label="可旋轉的 3D 小屋，使用方向鍵旋轉，加減鍵縮放，Home 回到原視角"></canvas><div class="cabin-camera" data-cabin-camera hidden role="group" aria-label="小屋視角控制"><button type="button" data-camera-action="left" aria-label="向左旋轉">↶</button><button type="button" data-camera-action="right" aria-label="向右旋轉">↷</button><button type="button" data-camera-action="out" aria-label="縮小小屋">−</button><button type="button" data-camera-action="in" aria-label="放大小屋">＋</button><button type="button" data-camera-action="reset">原視角</button><button type="button" data-cabin-walk aria-pressed="true">暫停走動</button></div><div class="cabin-daily-life" data-cabin-life hidden><label>熊熊活動<select data-cabin-activity><option value="auto">自己安排</option><option value="walk">散散步</option><option value="read">看書 · 擺上書本</option><option value="coffee">喝咖啡 · 擺上咖啡</option><option value="golf">推桿 · 擺上球袋</option><option value="rest">放空休息</option><option value="window">看看窗外</option><option value="desk">書桌前停留</option><option value="admire">欣賞收藏</option><option value="sit">坐下 · 點選座位</option><option value="sleep">上床睡覺</option><option value="wake">起床</option></select></label><span data-cabin-activity-state role="status"></span><button type="button" data-cabin-greet>和熊熊打招呼</button><p data-cabin-mood role="status"></p></div><p class="cabin-gesture" data-cabin-gesture hidden>拖曳旋轉 · 雙指縮放 · 也可以按下方按鈕</p><figcaption class="cabin-caption">'+caption+'</figcaption></figure><script src="/cabin-life.js?v=furnish83-2" defer></script>';
}

const cabinGameStyles=`
.game-wake[hidden]{display:none}.game-wake{position:absolute;top:52px;left:12px;z-index:5;min-height:48px;padding:8px 18px;border-radius:16px;background:#fff0c7;box-shadow:0 3px 10px #315b4822}

body:has(.cabin-game){padding:0;background:#dfe7dc}main:has(.cabin-game){width:min(100%,1100px);padding:0;margin:0 auto;border:0;border-radius:0;background:#e8edde}main:has(.cabin-game)>.life-nav{display:none}
.cabin-game{height:100dvh;min-height:480px;max-height:1100px;display:grid;grid-template-rows:64px auto minmax(0,1fr) auto auto;position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 30%,#fff9e9,#dce6d6);color:#29483c}
.game-top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 18px;border-bottom:1px solid #cbd5bf;background:#f8f6e9e8;z-index:3}.game-top h1{font-size:1.1rem;margin:0}.game-top small{font-size:.65rem;margin:0;letter-spacing:.06em}.game-top a{font-size:.78rem;min-height:44px;display:inline-flex;align-items:center;text-decoration:none;white-space:nowrap}.game-stage{position:relative;min-height:0;isolation:isolate}.cabin-game .cabin-display{height:100%;border:0;border-radius:0;background:none;position:relative;overflow:hidden}.cabin-game .cabin-canvas{height:100%;width:100%;background:none}.cabin-game .cabin-scene{height:100%;object-fit:contain}.cabin-game .cabin-camera,.cabin-game .cabin-daily-life,.cabin-game .cabin-gesture,.cabin-game .cabin-caption{display:none!important}
.game-tip{position:absolute;top:12px;left:50%;transform:translateX(-50%);z-index:2;max-width:88%;text-align:center;font-size:.74rem;line-height:1.5;padding:7px 13px;border-radius:999px;background:#fffcefdb;color:#5e7258;pointer-events:none;box-shadow:0 2px 12px #4661420b}.game-bubble{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);z-index:4;width:max-content;max-width:min(90%,460px);font-size:.86rem;line-height:1.7;background:#fffdf2f5;border:1px solid #ccd6bd;border-radius:18px;padding:10px 16px;box-shadow:0 6px 24px #52634118;text-align:center;pointer-events:none}.game-bubble:empty{display:none}
.game-hotspots{position:absolute;inset:0;z-index:2;pointer-events:none}.game-hotspot{position:absolute;pointer-events:auto;transform:translate(-50%,-50%);min-height:44px;min-width:44px;padding:6px 11px;background:#fffbedee;border:1px solid #b9c9a7;border-radius:999px;box-shadow:0 3px 10px #3b583526;font-size:.72rem;white-space:nowrap;transition:background .15s}.game-hotspot{touch-action:none;user-select:none;-webkit-user-select:none}.game-hotspot[data-game-hotspot=extra]{min-height:48px;min-width:96px;border-radius:14px}.game-stage{overscroll-behavior:contain}.game-hotspot:hover{background:#e6efd9}.game-hotspot[data-game-hotspot=door]{background:#f3dfadef;border-color:#cfad6b}.game-hotspot[hidden]{display:none}.game-toolbar{display:flex;justify-content:center;gap:10px;padding:10px 14px max(10px,env(safe-area-inset-bottom));background:#f8f5e8;border-top:1px solid #c7d4ba;z-index:4}.game-toolbar button{flex:1;max-width:220px;min-height:52px;padding:7px;border-radius:14px;font-size:.92rem;background:#edf0df;border:1px solid #bdcbaa;color:#294e3d}.game-toolbar button:first-child{background:#315b48;color:#fff8e6}.game-toolbar button:disabled{opacity:.55}.game-toolbar span{display:block;font-size:.64rem;font-weight:400;margin-top:2px}
.game-sheet{width:min(calc(100% - 24px),580px);max-height:80dvh;padding:0;border:1px solid #c3cbb2;border-radius:24px;background:#faf7eb;color:#29483c;box-shadow:0 22px 70px #143e3a38}.game-sheet::backdrop{background:#1e3e353e;backdrop-filter:blur(3px)}.game-sheet-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 17px;border-bottom:1px solid #d5dcc6;background:#f3f0e0;position:sticky;top:0;z-index:4}.game-sheet-head h2{font-size:1.05rem;margin:0}.game-sheet-head button{min-height:44px;min-width:44px;padding:5px 9px;border-radius:12px;background:#fffbed;font-size:.82rem}.game-sheet-body{padding:16px}.game-sheet .cabin-tools{border:0;padding:0;background:transparent}.game-sheet .cabin-tools>h2{display:none}.game-sheet .cabin-savebar{background:#faf7eb}.game-sheet .cabin-unlocks,.game-sheet .life-memory{margin:12px 0}.game-sheet .life-story{margin:0;padding:0;border:0;box-shadow:none;background:transparent}.game-sheet .life-story form button{width:100%;min-height:48px;text-align:left;background:#e8edda;border-radius:12px}.game-sheet .life-reward{background:#edeed8}.game-sheet .life-memory ul{grid-template-columns:1fr}.game-sheet .life-arrivals{grid-template-columns:1fr}.game-status{font-size:.8rem;color:#5d7253;min-height:1.6em}.game-interactions{display:grid;grid-template-columns:1fr 1fr;gap:9px}.game-interactions button{min-height:65px;padding:12px;border-radius:14px;background:#e9eedb;font-size:.86rem;text-align:left}.game-interactions small{font-size:.68rem;display:block;font-weight:400;margin-top:5px}.game-view-controls{display:flex;gap:6px;flex-wrap:wrap;margin-top:16px}.game-view-controls button{min-height:44px;flex:1;padding:6px;border-radius:10px;font-size:.78rem}.game-loading{padding:15px;color:#65755b;font-size:.9rem}.game-sheet [data-cabin-copy]{font-size:.8rem}.game-sheet label{font-size:.86rem}.game-picks{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:9px 0}.game-picks button{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:7px;min-height:92px;padding:9px 5px;border:1px solid #c5d0b7;border-radius:14px;background:#f0f0df;color:#526848}.game-picks button span{font-size:1.6rem;line-height:1.2}.game-picks button strong{font-size:.75rem;line-height:1.5}.game-picks button[aria-pressed=true]{border:2px solid #37634c;background:#dce8cf;color:#254f3a;box-shadow:inset 0 0 0 2px #f8f5e6}.game-picks button[aria-pressed=true] strong:after{content:" ✓"}.game-layout-controls[hidden]{display:none}.game-layout-controls{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px;padding:8px 12px max(8px,env(safe-area-inset-bottom));background:#f8f4e4;border-top:1px solid #bccbaa;z-index:5}.game-layout-controls div{flex-basis:100%;display:flex;gap:8px;justify-content:center;align-items:center;min-height:24px}.game-layout-controls strong{font-size:.8rem}.game-layout-controls small{font-size:.67rem;margin:0}.game-layout-controls button{min-height:44px;padding:6px 14px;font-size:.78rem;border-radius:11px;background:#e4ecd5}.game-layout-controls button:last-child{background:#315b48;color:#fff8e5}.is-layout-editing .game-toolbar{display:none}.is-layout-editing .game-bubble{display:none}.is-layout-editing .game-hotspot[data-game-hotspot=extra]{pointer-events:none}.is-layout-editing .game-hotspot{background:#eef5df;border:2px solid #8eac76}.game-move-entry{width:100%;min-height:48px;border-radius:12px;background:#dce8cf;font-size:.9rem}.game-move-note{font-size:.75rem;line-height:1.7;color:#68775f}.game-top>button{min-height:44px;min-width:44px;padding:5px;border-radius:12px;background:#eaf0df}
@media(max-width:760px){.cabin-game{grid-template-rows:58px auto minmax(0,1fr) auto auto;max-height:none}.game-top{padding:6px 12px}.game-top h1{font-size:1rem}.game-tip{font-size:.68rem;top:8px;width:max-content;max-width:88%}.game-sheet{margin:auto 0 0;width:100%;max-width:none;max-height:73dvh;border-radius:24px 24px 0 0;border-bottom:0}.game-hotspot{font-size:.66rem;padding:5px 8px}.game-toolbar{gap:7px;padding-top:8px}.game-toolbar button{min-height:52px;font-size:.85rem}.game-bubble{bottom:9px;font-size:.8rem}.game-sheet-body{padding:14px}}
`;
function cabinFurniturePicker(bedroom=false){if(bedroom)return '<p class="game-move-note">私人臥室 · 每款可重複新增 · 最多 25 件。點家具移動，長按拖曳，旋轉或收回後記得儲存。</p><div class="game-picks" role="group" aria-label="臥室家具">'+['single_bed','double_bed','bedside_table','rug','wardrobe','plant','reading_chair','chair','vanity_stool','vanity','bedside_lamp','display_case','teddy_plush','cushion'].map(id=>'<button type="button" data-game-add-furniture="'+id+'"><strong>＋ '+bedroomCatalog[id].name+'</strong></button>').join('')+'</div>'; return '<p class="game-move-note">核心家具 · 每款先一件。點已放置的家具可移動；空間不足時不會搬動舊布置。</p><div class="game-picks" role="group" aria-label="核心家具">'+Object.entries(cabinFurniture).map(([id,item])=>'<button type="button" data-game-add-furniture="'+id+'"'+(id==='bed'?' data-game-add-bed':'')+'><span aria-hidden="true">'+(({bed:'🛏',plant:'🌿',nightlight:'◉',bookshelf:'▤',displaycase:'▣',sofa:'⌑'})[id]||'◇')+'</span><strong>'+item.name+'</strong></button>').join('')+'</div>';}
function cabinGamePage({settings,available,profile,credential,environment={state:{...cozyDefaults},revision:0},editor='',extras='',rewards='',feedback='',status=200}){
 const today=lifeStoryContext('visit'),week=lifeStoryContext('event'),name=profile?escape(profile.nickname)+(settings.room==='bedroom'?' 的臥室':' 的小屋'):'熊熊的小屋',login=memberLinks(cabinPath);
 const panel=(id,title,body)=>'<dialog class="game-sheet" data-game-sheet="'+id+'" aria-labelledby="game-title-'+id+'"><header class="game-sheet-head"><h2 id="game-title-'+id+'">'+title+'</h2><button type="button" data-game-close aria-label="關閉'+title+'">完成 ✕</button></header><div class="game-sheet-body">'+body+'</div></dialog>';
 return lifePage('我的小屋','<style>'+cabinGameStyles+cozyCss+'</style><div class="cabin-game" data-cabin-game data-room-id="'+(settings.room||'living')+'" data-visit-name="'+today.story.name+'"><header class="game-top"><a href="/world?at=11">← 回熊熊渡假村</a><div><small>'+(settings.room==='bedroom'?'PRIVATE BEDROOM':'LIVING ROOM')+(credential?' · '+memberLabel(credential.member_no):' · PREVIEW')+'</small><h1>'+name+'</h1></div><button type="button" data-game-panel="menu" aria-label="開啟小屋選單">☰</button></header><div class="game-status"><p class="game-tip">點家具和熊熊互動 · 拖曳空白處轉動視角</p><button type="button" class="game-wake" data-game-wake data-game-activity="wake" hidden>☀ 起床</button></div><div class="game-stage">'+cabinScene(settings,available,'',profile)+'<div class="game-hotspots" hidden>'+(settings.roomTo?'<button type="button" class="game-hotspot" data-game-hotspot="roomdoor">'+(settings.room==='bedroom'?'回客廳':'進臥室')+'</button>':'')+'<button type="button" class="game-hotspot" data-game-hotspot="bed" hidden>床鋪</button><button type="button" class="game-hotspot" data-game-hotspot="extra" hidden>家具</button><button type="button" class="game-hotspot" data-game-hotspot="chair" hidden>椅子</button><button type="button" class="game-hotspot" data-game-hotspot="rug" hidden>地毯</button><button type="button" class="game-hotspot" data-game-hotspot="desk">看書</button><button type="button" class="game-hotspot" data-game-hotspot="corner">窗邊</button><button type="button" class="game-hotspot" data-game-hotspot="door" hidden>有人敲門</button><button type="button" class="game-hotspot" data-game-hotspot="album">翻相簿</button><button type="button" class="game-hotspot" data-game-hotspot="bear">嗨，熊熊</button></div><section class="furniture-info" data-furniture-info hidden aria-label="已選家具"><strong data-furniture-name></strong><button type="button" data-furniture-action></button><button type="button" data-cozy-admire hidden>欣賞一下</button><button type="button" data-furniture-dismiss aria-label="關閉家具資訊">✕</button></section></div><div class="game-bubble" data-game-bubble role="status">'+feedback+'</div>'+cozyMarkup(environment,settings.room||'living',Boolean(profile))+'<a class="cabin-resort-return scene-return" href="/world?at=11">← 回熊熊度假村</a>'+
 '<nav class="game-layout-controls" data-layout-controls hidden aria-label="移動家具"><div><strong data-layout-selection>選一件家具</strong><small data-layout-feedback>長按拖曳 · R 旋轉 · 方向鍵微調</small></div><button type="button" data-layout-command="rotate">旋轉 ↻</button>'+(settings.instances?'<button type="button" data-layout-command="duplicate" disabled>複製家具</button>':'')+'<button type="button" data-layout-command="undo">復原 ↶</button><button type="button" data-layout-command="remove">收回家具</button><button type="button" data-layout-command="cancel">取消</button><button type="button" data-layout-command="finish">完成</button><button type="button" data-layout-command="save">儲存</button></nav>'+
 panel('menu','小屋選單','<nav class="game-toolbar" aria-label="小屋操作"><button type="button" data-game-panel="editor">✦ 布置<span>換個喜歡的樣子</span></button><button type="button" data-game-panel="interact">☕ 互動<span>和熊熊一起生活</span></button><button type="button" data-game-panel="collection">▣ 收藏<span>禮物與島上回憶</span></button></nav><a class="scene-return" href="/world?at=11">← 回熊熊度假村</a>')+
 panel('editor','布置我的小屋',profile?editor:''+cabinFurniturePicker()+'<p class="game-move-note">可試擺與睡覺；登入島民證後才能儲存。</p><button type="button" class="game-move-entry" data-game-move>↔ 試擺看看 · 不儲存</button><p>領取或登入島民證，就能儲存自己的布置。</p>'+login)+
 panel('interact','在小屋裡做點什麼','<div class="game-interactions"><button type="button" data-game-activity="window">看看窗外<small>到窗邊安靜停留</small></button><button type="button" data-game-activity="desk">書桌前歇歇<small>走到桌邊停留</small></button><button type="button" data-game-activity="admire">看看展示櫃<small>欣賞自己的小回憶</small></button><button type="button" data-game-activity="sleep">☾ 躺下睡覺<small>走到已擺好的床鋪</small></button><button type="button" data-game-activity="sit">坐下休息<small>走到已擺好的椅子</small></button><button type="button" data-game-activity="read">📖 讀幾頁書<small>點桌上的書，也能開始</small></button><button type="button" data-game-activity="coffee">☕ 喝杯咖啡<small>需要擺上咖啡擺設</small></button><button type="button" data-game-activity="golf">⛳ 練習推桿<small>需要擺上高爾夫球袋</small></button><button type="button" data-game-activity="auto">🐾 自己安排<small>散步、休息、享受小屋</small></button><button type="button" data-game-story="event">✨ '+week.story.title+'<small>本週的島上小故事</small></button></div><div class="game-view-controls" aria-label="調整小屋視角"><button type="button" data-game-camera="left" aria-label="向左轉動房間">↶ 左轉</button><button type="button" data-game-camera="right" aria-label="向右轉動房間">↷ 右轉</button><button type="button" data-game-camera="in">＋ 放大</button><button type="button" data-game-camera="out">− 縮小</button><button type="button" data-game-camera="reset">原視角</button><button type="button" data-game-pause>暫停熊熊</button></div>')+
 panel('collection','我的島嶼收藏',profile?'<div data-game-collection>'+extras+'<details class="cabin-unlocks"><summary>居民送來的禮物</summary><ul>'+rewards+'</ul></details></div>':'<p>完成居民故事後，就能把紀念收進自己的相簿。</p>'+login)+
 panel('leave','離開房間前','<p>你有尚未儲存的布置，要先儲存再離開嗎？</p><div class="game-view-controls"><button type="button" data-room-choice="save">儲存並前往</button><button type="button" data-room-choice="discard">放棄變更</button><button type="button" data-room-choice="stay">繼續編輯</button></div>')+
 panel('story','門口有朋友來了','<div data-game-story-content></div>')+'<noscript><p>開啟 JavaScript 就能旋轉房間與點選家具。<a href="/dock/visits">今日來訪故事</a> · <a href="/dock/events">本週事件</a></p></noscript></div><script src="/cozy-living.js?v=83-2" defer></script>',status,'cabin');
}
async function cabinRoute(request,db,url,visitor,profile,room='living'){
 const bedroom=room==='bedroom',roomPath=bedroom?cabinPath+'/bedroom':cabinPath;
 if(bedroom&&!profile)return lifePage('私人臥室','<h1>請登入自己的島民證</h1>'+memberLinks(roomPath),request.method==='POST'?403:401,'cabin');
 if(bedroom&&['owner','visitor_key','member_no','owner_key'].some(k=>url.searchParams.has(k)))return lifePage('私人臥室','<h1>私人臥室僅供屋主使用</h1>',403,'cabin');

 if(!profile)return cabinGamePage({settings:cabinDefaults,available:availableCabinItems([]),feedback:'歡迎來小屋坐坐 🐻',status:request.method==='POST'?403:200});
 const rows=(await questRows(db,visitor)).results,available=availableCabinItems(rows);
 const livingRecord=await db.prepare('SELECT * FROM island_cabins WHERE visitor_key=?').bind(visitor).first();
 if(bedroom){
  // Capture the pre-bedroom living record once; later bedroom saves never overwrite it.
  await db.prepare("INSERT INTO island_cabin_rooms(visitor_key,room_id,layout_json,theme,revision,living_backup_json,created_at,updated_at) VALUES(?,'bedroom',?,'cream',1,?,?,?) ON CONFLICT(visitor_key,room_id) DO NOTHING").bind(visitor,JSON.stringify(cabinBedroomDefaults),JSON.stringify(livingRecord),Date.now(),Date.now()).run();
 }
 let record=bedroom?await db.prepare("SELECT * FROM island_cabin_rooms WHERE visitor_key=? AND room_id='bedroom'").bind(visitor).first():livingRecord;
 let instanceState;
 if(bedroom){try{const decoded=decodeCabinLayout(record.layout_json,true,'bedroom');if(!decoded)throw Error('Invalid old layout');instanceState=await loadBedroom(db,visitor,record,decoded);}catch{return lifePage('私人臥室','<h1>臥室暫時無法載入</h1><p>原本的臥室存檔仍保留，請稍後再試。</p><a href="/dock/cabin">回客廳</a>',503,'cabin');}}
 let settings=cabinSettings(bedroom?{...record,wall:'none',desk:'none',corner:'none',share_enabled:0}:record,available,room),error='',status=200;
 if(bedroom){settings={...settings,theme:instanceState.theme,revision:instanceState.revision,layout:instanceState.layout,instances:true};}
 settings.roomTo=bedroom?cabinPath:cabinPath+'/bedroom';
 if(request.method==='POST'){
  const parsed=await dockForm(request,url,bedroom?16000:4000);
  if(!parsed.fields){error=parsed.error;status=parsed.status;}
  else{
   const fields=parsed.fields,chosen={theme:fields.get('theme'),wall:fields.get('wall'),desk:fields.get('desk'),corner:fields.get('corner'),share_enabled:fields.get('share')==='1'?1:0},revision=fields.get('revision'),layout=fields.has('layout')?decodeCabinLayout(fields.get('layout'),chosen.corner!=='none',bedroom?'bedroom-instances':room):settings.layout;
   if(bedroom){chosen.wall='none';chosen.desk='none';chosen.corner='none';chosen.share_enabled=0;}
   if(['owner','visitor_key','member_no','owner_key'].some(k=>fields.has(k))||!layout||!Object.hasOwn(cabinThemes,chosen.theme)||['wall','desk','corner'].some(slot=>!Object.hasOwn(available[slot],chosen[slot]))||!/^\d{1,10}$/.test(revision||'')){
    error=!layout?'家具位置無法放置，請調整後再儲存。':'請選擇已解鎖的擺設與小屋色彩。';status=400;
   }else{
    const saved=bedroom?{meta:{changes:await saveBedroom(db,visitor,chosen.theme,Number(revision),layout)?1:0}}:await db.prepare('INSERT INTO island_cabins(visitor_key,theme,wall,desk,corner,share_enabled,layout_json,revision,updated_at) VALUES(?,?,?,?,?,?,?,1,?) ON CONFLICT(visitor_key) DO UPDATE SET theme=excluded.theme,wall=excluded.wall,desk=excluded.desk,corner=excluded.corner,share_enabled=excluded.share_enabled,layout_json=excluded.layout_json,revision=island_cabins.revision+1,updated_at=excluded.updated_at WHERE island_cabins.revision=?')
     .bind(visitor,chosen.theme,chosen.wall,chosen.desk,chosen.corner,chosen.share_enabled,JSON.stringify(layout),Date.now(),Number(revision)).run();
    if(saved.meta.changes)return dockRedirect(roomPath+'?saved=1');
    error='小屋已在另一個畫面更新，請重新整理後再布置。';status=409;
   }
  }
 }
 const credential=await ensureCredential(db,visitor);
 const shareUrl=url.origin+'/world/home/'+memberLabel(credential.member_no);
 const select=(slot,label,options)=>'<label data-cabin-control="'+slot+'">'+label+'<select name="'+slot+'">'+Object.entries(options).map(([id,value])=>'<option value="'+id+'"'+(settings[slot]===id?' selected':'')+'>'+escape(Array.isArray(value)?value[0]:value)+'</option>').join('')+'</select></label>';
 const hold=url.searchParams.get('hold');if(hold&&hold.length<100){const [kind,period,story,path]=hold.split(':');const owned=await db.prepare('SELECT step,path,story_id FROM island_life_stories WHERE visitor_key=? AND kind=? AND period=?').bind(visitor,kind,period).first();if(owned?.step===2&&owned.path===path&&owned.story_id===story)settings.held=hold;}
 let extras=await lifeCabinExtras(db,visitor);if(bedroom)extras=extras.replace(/<section class="life-arrivals"[\s\S]*?<\/section>/,'');
 const rewards=Object.entries(residentQuests).map(([id,quest])=>'<li>'+quest.rewardName+'<span>'+ (rows.some(r=>r.quest_id===id&&r.step===2)?'已解鎖 · '+quest.name+' 的委託紀念':'完成 '+quest.name+' 的委託可解鎖')+'</span><a href="'+questPath+'/'+id+'">去找 '+quest.name+' ↗</a></li>').join('');
 const editor='<section class="cabin-tools"><h2>布置我的小屋</h2>'+cabinFurniturePicker(bedroom)+'<p class="game-move-note">房間向右與前方加寬，原布置保持原位。床鋪沿用原本的儲存按鈕；熊熊、兔兔與貓咪都可以睡覺與坐下休息。</p><button type="button" class="game-move-entry" data-game-move>↔ 在房間裡移動家具</button><p class="game-move-note">長按家具拖曳，或選家具後用方向鍵移動。</p><div class="cabin-tabs" data-cabin-tabs hidden role="group" aria-label="選擇布置位置"><button type="button" data-cabin-tab="theme" aria-pressed="true">色彩</button><button type="button" data-cabin-tab="wall" aria-pressed="false">牆面</button><button type="button" data-cabin-tab="desk" aria-pressed="false">桌面</button><button type="button" data-cabin-tab="corner" aria-pressed="false">角落</button></div><form method="post" action="'+roomPath+'" data-cabin-form><input type="hidden" name="revision" value="'+settings.revision+'"><input type="hidden" name="layout" value="'+escape(JSON.stringify(settings.layout))+'">'+select('theme','小屋色彩',cabinThemes)+
  (bedroom?'<input type="hidden" name="wall" value="none"><input type="hidden" name="desk" value="none"><input type="hidden" name="corner" value="none">':select('wall','牆上的風景',available.wall)+select('desk','桌上的擺設',available.desk)+select('corner','窗邊的角落',available.corner))+
  (bedroom?'<p>私人臥室 · 僅屋主可進入</p>':'<label class="cabin-sharing"><input type="checkbox" name="share" value="1"'+(settings.share_enabled?' checked':'')+'><span>允許已登入的島民透過連結參觀</span></label>')+
  '<div class="cabin-savebar"><p class="cabin-save-state" role="status" data-cabin-save-state>儲存後，布置會跟著你的島民證保留。</p><button type="submit">儲存小屋布置</button></div></form>'+
  (!bedroom&&record?.share_enabled?'<div class="cabin-share"><label>小屋參觀連結<input readonly data-cabin-share-url value="'+escape(shareUrl)+'"></label><button type="button" data-cabin-copy>複製參觀連結</button><small role="status" data-cabin-copy-state></small><p><a href="'+escape(shareUrl)+'">看看朋友會看到的樣子 ↗</a></p></div>':'')+  '</section>';
 return cabinGamePage({settings,available,profile,credential,environment:await cozyLoad(db,visitor,room),editor,extras,rewards,feedback:error||(url.searchParams.has('saved')&&record?'小屋已儲存 ✨':''),status});
}
async function visitCabin(request,db,url,visitor,profile){
 if(url.searchParams.has('room')&&url.searchParams.get('room')!=='living')return lifePage('私人臥室','<h1>私人臥室不開放參觀</h1>',403,'cabin');
 const match=/^\/islands\/cabins\/(BEAR-\d{4,10})$/.exec(url.pathname),code=match?.[1];
 if(!code||worldMemberCode(code)!==code)return lifePage('找不到小屋','<h1>找不到這間小屋</h1>',404,'cabin');
 if(request.method!=='GET')return lifePage('小屋參觀','<h1>請從自己的小屋儲存布置</h1>',405,'cabin');
 if(!profile)return lifePage('小屋參觀','<h1>帶著你的熊熊來作客</h1>'+memberLinks(url.pathname),200,'cabin');
 const memberNo=code==='BEAR-0000'?-1:Number(code.slice(5));
 const row=await db.prepare('SELECT c.visitor_key,c.theme,c.wall,c.desk,c.corner,c.share_enabled,c.layout_json,p.nickname,p.bear,p.outfit FROM island_cabins c JOIN island_credentials i ON i.visitor_key=c.visitor_key JOIN island_passports p ON p.visitor_key=c.visitor_key WHERE i.member_no=? AND (c.share_enabled=1 OR c.visitor_key=?)').bind(memberNo,visitor).first();
 if(!row||!row.share_enabled&&row.visitor_key!==visitor)return lifePage('小屋參觀','<h1>這間小屋目前沒有開放參觀</h1><p>可以請屋主儲存開放設定，再分享連結。</p>',403,'cabin');
 const appearance=await readPassportProfile(db,row.visitor_key);Object.assign(row,appearance||{});
 const available=availableCabinItems((await questRows(db,row.visitor_key)).results),settings=cabinSettings(row,available);
 return lifePage('小屋參觀','<span class="life-kicker">A FRIEND’S LITTLE HOME / '+code+'</span><h1>'+escape(row.nickname)+' 的小屋</h1><p class="life-intro">坐一會兒，看看這間小屋收藏了什麼。</p>'+
  cabinScene(settings,Object.fromEntries(['wall','desk','corner'].map(slot=>[slot,{[settings[slot]]:available[slot][settings[slot]]}])),'來作客的熊熊，歡迎你。',row)+'<p><a class="life-action" href="'+cabinPath+'">回我的小屋 ↗</a></p>',200,'cabin');
}
async function islandLifeRoutes(request,env,url){
 const visitor=islanderOf(request),profile=visitor?await readPassportProfile(env.DB,visitor):null;
 if(!['GET','POST'].includes(request.method))return lifePage('島上生活','<h1>這個入口無法使用</h1>',405);
 if(url.pathname.startsWith('/islands/cabins/'))return visitCabin(request,env.DB,url,visitor,profile);
 if(url.pathname==='/dock/memories')return islandMemoryRoute(request,env.DB,url,visitor,profile);
 if(url.pathname==='/dock/visits'||url.pathname==='/dock/events')return islandLifeStoryRoute(request,env.DB,url,visitor,profile);
 if(url.pathname===cabinPath+'/bedroom')return cabinRoute(request,env.DB,url,visitor,profile,'bedroom');
 if(url.pathname===cabinPath)return cabinRoute(request,env.DB,url,visitor,profile);
 return residentQuestRoute(request,env.DB,url,visitor,profile);
}

function lifeStoryContext(kind,now=Date.now()){
 const calendar=islandLifeCalendar(now),id=kind==='visit'?calendar.visit:calendar.event;
 return {calendar,id,period:kind==='visit'?calendar.day:calendar.week,story:(kind==='visit'?cabinVisits:islandWeeklyEvents)[id]};
}
function memoryArt(title){return '<svg class="memory-art" viewBox="0 0 240 160" role="img" aria-label="'+escape(title)+'的紀念卡" style="display:block;width:min(100%,280px);margin:12px auto;filter:drop-shadow(0 5px 6px #273f3320)"><rect x="7" y="7" width="226" height="146" rx="12" fill="#fff1d3" stroke="#b29b76" stroke-width="2"/><rect x="20" y="20" width="200" height="94" rx="5" fill="#b7d3c5"/><circle cx="179" cy="43" r="13" fill="#ffefbb"/><path d="M20 103L80 47l48 45 36-30 56 52H20Z" fill="#799b83"/><path d="M20 106q60-22 100 0t100 0v8H20" fill="#82b1ac"/><path d="M25 130h130m-130 9h95" stroke="#a58c69" stroke-width="3" stroke-linecap="round"/><path d="m193 130 5 5 10-12" fill="none" stroke="#6c947d" stroke-width="3"/></svg>';}
function memoryHold(row){return '<a class="life-action" href="/dock/cabin?hold='+encodeURIComponent(row.kind+':'+row.period+':'+row.story_id+':'+row.path)+'" data-memory-hold="'+escape(row.kind+':'+row.period+':'+row.story_id+':'+row.path)+'" data-memory-title="'+escape((row.kind==='visit'?cabinVisits:islandWeeklyEvents)[row.story_id].endings[row.path][0])+'">讓熊熊拿起紀念卡</a>';}
function isMarketBadge(row){return row.kind==='event'&&row.story_id==='market'&&row.path==='aa';}
function marketBadge(row,animate=false){
 const earned=row.completed_at?new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(row.completed_at)):row.period;
 return '<details class="market-badge'+(animate?' badge-award':'')+'"><summary aria-label="查看市集小確幸章"><svg viewBox="0 0 160 180" role="img" aria-label="市集小確幸章徽章" class="market-badge-art"><path d="M43 110l-10 64 34-20 19 13 5-57m-3 0 17 62 17-26 25 6-23-53" fill="#9daf87" stroke="#71876a" stroke-width="2"/><circle cx="80" cy="75" r="64" fill="#bfa16c"/><circle cx="80" cy="75" r="58" fill="#f5e6bc" stroke="#fff5d8" stroke-width="3"/><circle cx="80" cy="75" r="49" fill="#e5cda2" stroke="#a98c60" stroke-width="1.5" stroke-dasharray="2 5"/><path d="M46 101V64h68v37" fill="#f3ead4"/><path d="M40 64h80l-9-21H49z" fill="#bc9075"/><path d="M49 44l-5 20m23-20-2 20m20-20 2 20m17-20 5 20" stroke="#fff0ce" stroke-width="9"/><path d="M46 91h68v12H46" fill="#9aaf8d"/><path d="M68 81h18v10H68z" fill="#faf5e4"/><path d="M86 82q10-2 8 5-2 5-8 1" fill="none" stroke="#faf5e4" stroke-width="3"/><path d="M74 77q-4-5 1-9m6 9q-4-5 1-9" fill="none" stroke="#9b8060" stroke-width="2"/><path d="m113 23 2 6 6 2-6 2-2 6-2-6-6-2 6-2" fill="#fff8dd"/></svg><span>點徽章查看紀念</span></summary><h3>市集小確幸章</h3><p>取得日期：<time datetime="'+escape(earned)+'">'+escape(earned)+'</time>'+(!row.completed_at?'（活動週起始日；舊紀錄未記錄確切時間）':'')+'</p><p>大家把小確幸寫滿了明信片，Hugo 把它們掛成一面溫柔的牆。</p></details>';
}
function storyMemoryCard(row){
 const story=(row.kind==='visit'?cabinVisits:islandWeeklyEvents)[row.story_id],ending=story?.endings[row.path];
 if(ending&&isMarketBadge(row))return '<li>'+marketBadge(row)+'</li>';
 return ending?'<li><span class="life-kicker">'+escape(row.period)+' · '+(row.kind==='visit'?'小屋來訪':'島嶼事件')+'</span><h3>'+ending[0]+'</h3>'+memoryArt(ending[0])+'<p>'+ending[1]+'</p>'+memoryHold(row)+'</li>':'';
}
async function lifeCabinExtras(db,visitor){
 const today=lifeStoryContext('visit'),week=lifeStoryContext('event');
 const {results}=await db.prepare('SELECT kind,period,story_id,step,path,completed_at FROM island_life_stories WHERE visitor_key=? ORDER BY period DESC,kind LIMIT 24').bind(visitor).all();
 const visit=results.find(r=>r.kind==='visit'&&r.period===today.period),event=results.find(r=>r.kind==='event'&&r.period===week.period),memories=results.filter(r=>r.step===2);
 return '<section class="life-arrivals" aria-label="小屋的新鮮事"><article><span class="life-kicker">KNOCK KNOCK</span><h2>'+today.story.name+(visit?.step===2?' 留下了一段回憶':' 來敲門了')+'</h2><p>'+today.story.title+'</p><a class="life-action" href="/dock/visits">'+(visit?.step===2?'回看來訪故事':visit?'繼續招待':'開門看看')+' ↗</a></article><article><span class="life-kicker">THIS WEEK · '+week.calendar.week+' — '+week.calendar.weekEnd+'</span><h2>'+week.story.title+'</h2><p>兩次選擇，留下本週的島嶼紀念。</p><a class="life-action" href="/dock/events">'+(event?.step===2?'查看本週紀念':'去參加')+' ↗</a></article></section>'+
 '<details class="life-memory"><summary>我的島嶼紀念冊 · 最近 '+memories.length+' 段回憶</summary>'+(memories.length?'<ul>'+memories.map(storyMemoryCard).join('')+'</ul><p><a href="/dock/memories">翻閱完整紀念冊 ↗</a></p>':'<p>開門招待一位居民，或參加本週事件，就能留下第一張紀念卡。</p>')+'</details>';
}
async function islandMemoryRoute(request,db,url,visitor,profile){
 if(request.method!=='GET')return lifePage('島嶼紀念冊','<h1>請從故事頁完成互動</h1>',405,'cabin');
 if(!profile)return lifePage('島嶼紀念冊','<h1>我的島嶼紀念冊</h1>'+memberLinks(url.pathname),200,'cabin');
 const raw=url.searchParams.get('page')||'1';
 if(!/^[1-9]\d{0,4}$/.test(raw))return lifePage('島嶼紀念冊','<h1>找不到這一頁</h1>',400,'cabin');
 const page=Number(raw),{results}=await db.prepare('SELECT kind,period,story_id,step,path,completed_at FROM island_life_stories WHERE visitor_key=? AND step=2 ORDER BY period DESC,kind LIMIT 13 OFFSET ?').bind(visitor,(page-1)*12).all();
 return lifePage('島嶼紀念冊','<span class="life-kicker">ISLAND MEMORIES</span><h1>'+escape(profile.nickname)+' 的島嶼紀念冊</h1><p>每次來訪與島上小故事，都留在這裡。</p><section class="life-memory"><ul>'+results.slice(0,12).map(storyMemoryCard).join('')+'</ul>'+(results.length?'':'<p>這一頁還沒有紀念。回小屋招待一位居民吧。</p>')+'</section><nav class="life-linkrow" aria-label="紀念冊分頁">'+(page>1?'<a href="/dock/memories?page='+(page-1)+'">← 上一頁</a>':'')+'<span>第 '+page+' 頁</span>'+(results.length>12?'<a href="/dock/memories?page='+(page+1)+'">下一頁 →</a>':'')+'</nav><a href="/dock/cabin">回我的小屋 ↗</a>',200,'cabin');
}
async function islandLifeStoryRoute(request,db,url,visitor,profile){
 const kind=url.pathname==='/dock/visits'?'visit':'event',current=lifeStoryContext(kind),{calendar,id,period,story}=current,page=kind==='event'?'events':'cabin';
 const intro='<span class="life-kicker">'+(kind==='visit'?'A FRIEND AT YOUR DOOR · '+period:'ISLAND WEEK · '+calendar.week+' — '+calendar.weekEnd)+'</span><h1>'+story.title+'</h1><p class="life-intro">'+(kind==='visit'?'三位居民依日期輪流來訪，不用限時搶答。已完成的故事會留在小屋紀念冊。':'島上的虛構故事活動，每週一台灣時間 00:00 輪替。紀念收藏沒有連續打卡要求。')+'</p>';
 if(!profile)return lifePage(story.title,intro+'<section class="life-story"><p>'+story.intro+'</p>'+memberLinks(url.pathname)+'</section>',request.method==='POST'?403:200,page);
 let error='',status=200;
 if(request.method==='POST'){
  const parsed=await dockForm(request,url,1500),fields=parsed.fields;
  if(!fields){error=parsed.error;status=parsed.status;}
  else if(fields.get('period')!==period||fields.get('story')!==id){error='故事已輪替，請從現在的故事重新開始。之前完成的紀念仍會保留。';status=409;}
  else if(fields.get('action')==='start'){
   await db.prepare('INSERT INTO island_life_stories(visitor_key,kind,period,story_id) VALUES(?,?,?,?) ON CONFLICT(visitor_key,kind,period) DO NOTHING').bind(visitor,kind,period,id).run();
   return dockRedirect(url.pathname);
  }else if(fields.get('action')==='choose'){
   const step=fields.get('step'),path=fields.get('path'),choice=fields.get('choice');
   if(!['0','1'].includes(step)||!['a','b'].includes(choice)||typeof path!=='string'||path.length!==Number(step)||!/^[ab]*$/.test(path)){error='請從目前的故事段落選擇。';status=400;}
   else{
    const updated=await db.prepare('UPDATE island_life_stories SET step=step+1,path=path||?,completed_at=CASE WHEN step=1 THEN ? ELSE NULL END WHERE visitor_key=? AND kind=? AND period=? AND story_id=? AND step=? AND path=?').bind(choice,Date.now(),visitor,kind,period,id,Number(step),path).run();
    if(updated.meta.changes)return dockRedirect(url.pathname+(step==='1'?'?earned=1':''));
    const existing=await db.prepare('SELECT path FROM island_life_stories WHERE visitor_key=? AND kind=? AND period=?').bind(visitor,kind,period).first();
    if(existing?.path.startsWith(path+choice))return dockRedirect(url.pathname);
    error='故事進度已更新，請接著目前的段落玩。';status=409;
   }
  }else{error='請選擇一個故事行動。';status=400;}
 }
 const row=await db.prepare('SELECT step,path,completed_at FROM island_life_stories WHERE visitor_key=? AND kind=? AND period=?').bind(visitor,kind,period).first();
 const hidden='<input type="hidden" name="period" value="'+period+'"><input type="hidden" name="story" value="'+id+'">';
 let content='',scene='';
 if(!row)content='<p>'+story.intro+'</p><form method="post">'+hidden+'<button name="action" value="start">'+(kind==='visit'?'請進，歡迎來作客':'加入這週的故事')+' ↗</button></form>';
 else if(row.step===2){const ending=story.endings[row.path];content='<span class="life-kicker">A MEMORY TO KEEP</span><h2>'+ending[0]+'</h2>'+(isMarketBadge({kind,story_id:id,path:row.path})?marketBadge({kind,period,story_id:id,path:row.path,completed_at:row.completed_at},url.searchParams.get('earned')==='1'):memoryArt(ending[0])+memoryHold({kind,period,story_id:id,path:row.path}))+'<p>'+ending[1]+'</p><section class="life-reward"><h3>'+(isMarketBadge({kind,story_id:id,path:row.path})?'徽章已收進收藏':'紀念卡已收進小屋')+'</h3><p>這是你第一次完成的結局，可以隨時回到紀念冊重讀。</p><a class="life-action" href="/dock/cabin">回小屋看看 ↗</a></section>';}
 else{const branch=row.step===0?story:story.branches[row.path];content='<p class="life-progress">第 '+(row.step+1)+' 次選擇，共兩次</p><p>'+(row.step===0?story.intro:branch.text)+'</p><h2>'+branch.question+'</h2><form method="post">'+hidden+'<input type="hidden" name="action" value="choose"><input type="hidden" name="step" value="'+row.step+'"><input type="hidden" name="path" value="'+row.path+'">'+Object.entries(branch.choices).map(([choice,label])=>'<button name="choice" value="'+choice+'">'+label+'</button>').join('')+'</form>';}
 if(kind==='visit'&&row){
  const available=availableCabinItems((await questRows(db,visitor)).results),record=await db.prepare('SELECT theme,wall,desk,corner,share_enabled,revision,layout_json FROM island_cabins WHERE visitor_key=?').bind(visitor).first();
  scene=cabinScene(cabinSettings(record,available),available,story.name+' 來到你的小屋',profile).replace('data-cabin-display','data-cabin-guest="'+id+'" data-cabin-display');
 }
 return lifePage(story.title,intro+(error?dockError(error):'')+scene+'<section class="life-story">'+questPerson(residentQuests[kind==='visit'?id:({market:'hugo',stars:'ari',lost:'liv'})[id]])+content+'</section><p><a href="/dock/cabin">← 回我的小屋</a></p>',status,page);
}
function cabinLifeClient(){
 const form=document.querySelector('[data-cabin-form]'),display=document.querySelector('[data-cabin-display]');
 if(form&&display){
  const tabs=document.querySelector('[data-cabin-tabs]');
  if(tabs){
   tabs.hidden=false;
   const activate=slot=>{
    form.querySelectorAll('[data-cabin-control]').forEach(control=>{control.hidden=control.dataset.cabinControl!==slot;});
    tabs.querySelectorAll('[data-cabin-tab]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.cabinTab===slot)));
   };
   tabs.addEventListener('click',event=>{const button=event.target.closest('[data-cabin-tab]');if(button)activate(button.dataset.cabinTab);});
   activate('theme');
  }
  form.addEventListener('change',()=>{
   const data=new FormData(form);
   display.dataset.theme=data.get('theme');
   display.querySelectorAll('[data-cabin-slot]').forEach(item=>{item.toggleAttribute('hidden',item.dataset.cabinItem!==data.get(item.dataset.cabinSlot));});
   document.querySelector('[data-cabin-save-state]').textContent='預覽已更新，按「儲存小屋布置」留下這個樣子。';
  });
 }
 const copy=document.querySelector('[data-cabin-game]')?null:document.querySelector('[data-cabin-copy]');
 copy?.addEventListener('click',async()=>{
  const input=document.querySelector('[data-cabin-share-url]'),notice=document.querySelector('[data-cabin-copy-state]');
  try{await navigator.clipboard.writeText(input.value);notice.textContent='參觀連結已複製。';}
  catch{input.focus();input.select();notice.textContent='請複製欄位中的參觀連結。';}
 });
}

function cabinGameClient(){
 const game=document.querySelector('[data-cabin-game]');if(!game)return;
 const display=game.querySelector('[data-cabin-display]'),bubble=game.querySelector('[data-game-bubble]'),form=game.querySelector('[data-cabin-form]'),activity=game.querySelector('[data-cabin-activity]');
  const furnitureInfo=game.querySelector('[data-furniture-info]');
 const selectFurniture=id=>{if(!furnitureInfo)return;furnitureInfo.hidden=!id;if(!id)return;const placed=JSON.parse(display.dataset.cabinLayout||'{}')[id],instance=display.dataset.cabinInstances==='1',type=placed?.furniture_type,template=instance?bedroomCatalog[type]:null;const slot=id==='table'?'desk':id==='corner'?'corner':null,item=slot?display.querySelector('[data-cabin-slot="'+slot+'"]:not([hidden])')?.dataset.cabinItem:null;const label=template?.name||cabinFurniture[id]?.name||({table:'桌子',chair:'椅子',rug:'地毯',corner:'角落擺設',bed:'床鋪'})[id];const action=(template?.seat||(!instance&&display.dataset.cabinRoom==='living'&&id==='chair'))?'sit':(template?.mesh==='bed'||id==='bed')?'sleep':id==='chair'||id==='rug'?'rest':({books:'read',coffee:'coffee',golf:'golf',flowers:'rest',plant:'rest',lamp:'rest'})[item]||'rest';furnitureInfo.querySelector('[data-furniture-name]').textContent=label;const admire=furnitureInfo.querySelector('[data-cozy-admire]');if(admire){admire.hidden=!(id==='displaycase'||type==='display_case'||id==='writingdesk'||type==='desk');admire.dataset.cozyAdmire=id==='displaycase'||type==='display_case'?'admire':'desk';}const button=furnitureInfo.querySelector('[data-furniture-action]');delete button.dataset.gameEditFurniture;delete button.dataset.gameActivity;delete button.dataset.gamePanel;delete button.dataset.gameLamp;if(instance&&type==='display_case'){button.dataset.gamePanel='collection';button.textContent='查看紀念卡與徽章';return;}if(instance&&type==='bedside_lamp'){button.dataset.gameLamp=id;button.textContent=JSON.parse(display.querySelector('canvas').dataset.litLamps||'[]').includes(id)?'關閉小夜燈':'開啟小夜燈';return;}if((instance||cabinFurniture[id])&&!['sleep','sit'].includes(action)){button.dataset.gameEditFurniture=id;button.textContent='移動／旋轉';return;}if(action==='sit')display.dispatchEvent(new CustomEvent('cabin-seat-target',{detail:id}));if(instance&&action==='sleep')display.dispatchEvent(new CustomEvent('cabin-bed-target',{detail:id}));button.dataset.gameActivity=action;button.textContent=({read:'讀幾頁書',coffee:'喝杯咖啡',golf:'練習推桿',rest:'放鬆一下',sit:'坐下休息',sleep:'躺下睡覺'})[action];};
 display.addEventListener('cabin-furniture-select',event=>selectFurniture(event.detail));
 let dirty=false,busy=false,storyPath='',returnFocus=null,storyRequest=0,bubbleTimer=0,savedForm=form?new URLSearchParams(new FormData(form)).toString():'';
 const say=text=>{clearTimeout(bubbleTimer);bubble.textContent=text;if(text)bubbleTimer=setTimeout(()=>{bubble.textContent='';},6500);};
 const visitorDelay=60000+Math.random()*60000;const visitorTimer=setTimeout(()=>{if(game.dataset.roomId!=='bedroom'&&!document.hidden){game.dataset.visitorArrived='true';say('叩叩，有位島上居民來拜訪。想招待時，再點門口就好。');}},visitorDelay);window.addEventListener('pagehide',()=>clearTimeout(visitorTimer),{once:true});
 const close=()=>game.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());
 const openPanel=id=>{selectFurniture(null);const panel=game.querySelector('[data-game-sheet="'+id+'"]');if(!panel)return;close();returnFocus=document.activeElement;panel.showModal();};
 game.querySelectorAll('[data-game-sheet]').forEach(dialog=>{dialog.addEventListener('close',()=>{returnFocus?.focus();});});
 const doActivity=value=>{if(value==='sit'){const layout=JSON.parse(display.dataset.cabinLayout||'{}');const seat=display.dataset.cabinInstances==='1'?Object.keys(layout).find(id=>bedroomCatalog[layout[id].furniture_type]?.seat):layout.chair?'chair':null;if(!seat){say('先擺上一張椅子，就能坐下休息。');close();return;}display.dispatchEvent(new CustomEvent('cabin-seat-target',{detail:seat}));}selectFurniture(null);
  const option=[...activity.options].find(option=>option.value===value);
  if(!option||option.disabled){say(value==='sleep'?'先放好床鋪；就能讓角色躺下休息。':value==='coffee'?'先在「布置 → 桌面」擺上咖啡，再一起喝一杯。':value==='golf'?'先在「布置 → 角落」擺上球袋，再來練習。':'先擺上書本，再一起讀幾頁。');close();return;}
  const pause=game.querySelector('[data-cabin-walk]');if(pause.getAttribute('aria-pressed')==='false')pause.click();
  activity.value=value;activity.dispatchEvent(new Event('change',{bubbles:true}));close();say(value==='auto'?'去走走吧，我就在這裡陪你。':'好，熊熊正走過去。');
 };
 let pendingRoom='',traveling=false,saveThenGo=false;
 const roomDirty=()=>Boolean(form)&&new URLSearchParams(new FormData(form)).toString()!==savedForm;
 function walkToRoom(){
  if(!['/dock/cabin','/dock/cabin/bedroom'].includes(pendingRoom))return;
  selectFurniture(null);close();traveling=true;say('熊熊正走向房門。');display.dispatchEvent(new CustomEvent('cabin-room-walk'));
 }
 function requestRoom(){if(busy||traveling)return;pendingRoom=display.dataset.roomTo||'';if(roomDirty())openPanel('leave');else walkToRoom();}
 display.addEventListener('cabin-room-arrived',()=>{if(traveling&&pendingRoom){dirty=false;location.assign(pendingRoom);}});
 display.addEventListener('cabin-room-blocked',()=>{traveling=false;pendingRoom='';});
 function discardRoomChanges(){
  if(form){const saved=new URLSearchParams(savedForm);for(const el of form.elements){if(!el.name)continue;if(el.type==='checkbox')el.checked=saved.has(el.name);else if(saved.has(el.name))el.value=saved.get(el.name);}
   form.dispatchEvent(new Event('change',{bubbles:true}));display.dispatchEvent(new CustomEvent('cabin-room-discard',{detail:saved.get('layout')}));}
  dirty=false;walkToRoom();
 }
 const parse=text=>new DOMParser().parseFromString(text,'text/html');
 function renderStory(responseDoc,ok=true){
  const container=game.querySelector('[data-game-story-content]'),story=responseDoc.querySelector('.life-story'),title=responseDoc.querySelector('h1'),completed=Boolean(responseDoc.querySelector('.life-reward'));
  game.querySelector('#game-title-story').textContent=title?.textContent||'島上的小故事';
  if(!story){container.textContent='故事暫時無法開啟，請稍後再試。';return;}
  container.replaceChildren(story);
  const error=responseDoc.querySelector('[role="alert"]');if(error)container.prepend(error);
  const guest=responseDoc.querySelector('[data-cabin-guest]');if(guest){const arriving=display.dataset.cabinGuest!==guest.dataset.cabinGuest;display.dataset.cabinGuest=guest.dataset.cabinGuest;if(arriving&&ok&&!completed){close();say(({hugo:'Hugo',liv:'Liv',ari:'Ari'})[guest.dataset.cabinGuest]+' 正從門口走進來。她會留在房裡；點門口繼續聊天。');}}
  if(completed){say('一段新回憶，已收進你的相簿 ✨');if(storyPath==='/dock/visits')game.querySelector('[data-game-hotspot="door"]').textContent='今日來訪 ✓';refreshCollection();}
  if(!ok&&!error){const p=document.createElement('p');p.className='alert';p.textContent='剛才的操作沒有完成，請接著目前的故事繼續。';container.prepend(p);}
 }
 async function refreshCollection(){if(!form)return;try{const response=await fetch('/dock/cabin',{credentials:'same-origin',cache:'no-store'});if(!response.ok)return;const node=parse(await response.text()).querySelector('[data-game-collection]'),target=game.querySelector('[data-game-collection]');if(node&&target)target.replaceChildren(...node.childNodes);}catch{}}
 async function loadStory(kind){
  const token=++storyRequest;
  storyPath=kind==='event'?'/dock/events':'/dock/visits';openPanel('story');
  const container=game.querySelector('[data-game-story-content]');container.textContent='朋友正走過來，稍等一下…';
  try{const response=await fetch(storyPath,{credentials:'same-origin',cache:'no-store'});const text=await response.text();if(token===storyRequest&&game.querySelector('[data-game-sheet="story"]').open)renderStory(parse(text),response.ok);}
  catch{container.textContent='暫時連不上島嶼，關閉後可以再試一次。';}
 }
 game.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(traveling&&!button?.dataset.gameCamera){event.preventDefault();return;}
  if(button?.dataset.roomChoice){const choice=button.dataset.roomChoice;if(busy)return;if(choice==='stay'){pendingRoom='';saveThenGo=false;close();return;}if(choice==='discard'){discardRoomChanges();return;}if(choice==='save'&&form){saveThenGo=true;form.requestSubmit();return;}}
  if(button?.dataset.cozyAdmire){doActivity(button.dataset.cozyAdmire);return;}
  if(button?.dataset.gameLamp){display.dispatchEvent(new CustomEvent('cabin-lamp-toggle',{detail:button.dataset.gameLamp}));selectFurniture(button.dataset.gameLamp);return;}
  if(button?.hasAttribute('data-furniture-dismiss')){selectFurniture(null);return;}
  const hold=event.target.closest('[data-memory-hold]');if(hold){event.preventDefault();if(display.querySelector('canvas')?.dataset.posture==='sitting'){activity.value='wake';activity.dispatchEvent(new Event('change',{bubbles:true}));}display.dataset.cabinHeld=hold.dataset.memoryHold;close();say('熊熊拿起了「'+hold.dataset.memoryTitle+'」。點熊熊可以放回收藏。');return;}
  if(button?.hasAttribute('data-cabin-copy')){const input=game.querySelector('[data-cabin-share-url]'),notice=game.querySelector('[data-cabin-copy-state]');navigator.clipboard.writeText(input.value).then(()=>notice.textContent='參觀連結已複製。').catch(()=>{input.focus();input.select();notice.textContent='請複製欄位中的參觀連結。';});return;}
  if(button?.hasAttribute('data-game-add-furniture')){selectFurniture(null);close();display.dispatchEvent(new CustomEvent('cabin-layout-command',{detail:'add:'+button.dataset.gameAddFurniture}));return;}
  if(button?.hasAttribute('data-game-edit-furniture')){const id=button.dataset.gameEditFurniture;selectFurniture(null);close();display.dispatchEvent(new CustomEvent('cabin-layout-command',{detail:'select:'+id}));return;}
  if(button?.hasAttribute('data-game-add-bed')){selectFurniture(null);close();display.dispatchEvent(new CustomEvent('cabin-layout-command',{detail:'add-bed'}));return;}
  if(button?.hasAttribute('data-game-move')){selectFurniture(null);close();display.dispatchEvent(new CustomEvent('cabin-layout-command',{detail:'start'}));return;}
  if(button?.hasAttribute('data-game-close')){close();return;}
  if(button?.dataset.gamePanel){openPanel(button.dataset.gamePanel);return;}
  if(button?.dataset.gameStory){loadStory(button.dataset.gameStory);return;}
  if(button?.dataset.gameActivity){doActivity(button.dataset.gameActivity);return;}
  if(button?.dataset.gameCamera){game.querySelector('[data-camera-action="'+button.dataset.gameCamera+'"]').click();return;}
  if(button?.hasAttribute('data-game-pause')){game.querySelector('[data-cabin-walk]').click();button.textContent=game.querySelector('[data-cabin-walk]').getAttribute('aria-pressed')==='true'?'暫停熊熊':'讓熊熊走走';return;}
  if(button?.dataset.gameHotspot){
   const spot=button.dataset.gameHotspot;
   if(spot==='roomdoor'){requestRoom();return;}
   if(spot==='door'){loadStory('visit');return;}
   if(spot==='album'){openPanel('collection');return;}
   if(spot==='bear'){if(display.dataset.cabinHeld){delete display.dataset.cabinHeld;say('紀念卡已放回收藏，隨時可以再拿起。');return;}game.querySelector('[data-cabin-greet]').click();return;}
   if(spot==='desk'){const item=display.querySelector('[data-cabin-slot="desk"]:not([hidden])')?.dataset.cabinItem;doActivity(({books:'read',coffee:'coffee',flowers:'rest'})[item]||'rest');return;}
   if(spot==='corner'){const item=display.querySelector('[data-cabin-slot="corner"]:not([hidden])')?.dataset.cabinItem;doActivity(item==='golf'?'golf':'rest');say(item==='golf'?'輕輕一推，一起慢慢練。':item==='plant'?'窗邊的綠意，讓今天慢一點。':'在喜歡的角落，休息一下。');return;}
  }
  const link=event.target.closest('a');
  if(link&&link.origin===location.origin&&['/dock/visits','/dock/events'].includes(link.pathname)){event.preventDefault();loadStory(link.pathname.endsWith('events')?'event':'visit');return;}
  if(link&&link.origin===location.origin&&link.pathname==='/dock/cabin'&&link.closest('[data-game-story-content]')){event.preventDefault();close();return;}
  if(link&&link.origin===location.origin&&link.pathname==='/dock/memories'){event.preventDefault();loadMemories(link.href);}
 });
 async function loadMemories(url){
  const target=game.querySelector('[data-game-collection]');if(!target)return;
  try{const response=await fetch(url,{credentials:'same-origin',cache:'no-store'});if(!response.ok)throw Error();const doc=parse(await response.text()),memories=doc.querySelector('.life-memory'),pages=doc.querySelector('[aria-label="紀念冊分頁"]');if(memories){const back=document.createElement('button');back.type='button';back.textContent='← 回收藏首頁';back.addEventListener('click',refreshCollection);target.replaceChildren(back,memories);if(pages)target.append(pages);}}
  catch{say('紀念冊暫時無法載入，稍後再翻翻看。');}
 }
 
 game.querySelector('[data-game-story-content]').addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;busy=true;
  const submitted=event.target,data=new FormData(submitted);if(event.submitter?.name)data.set(event.submitter.name,event.submitter.value);
  submitted.querySelectorAll('button').forEach(button=>button.disabled=true);
  try{const response=await fetch(storyPath,{method:'POST',body:new URLSearchParams(data),credentials:'same-origin',cache:'no-store'});renderStory(parse(await response.text()),response.ok);}
  catch{say('剛才沒有連上，故事進度仍會保留，可以再試一次。');submitted.querySelectorAll('button').forEach(button=>button.disabled=false);}
  finally{busy=false;}
 });
 const mood=game.querySelector('[data-cabin-mood]');new MutationObserver(()=>{if(mood.textContent)say(mood.textContent);}).observe(mood,{childList:true,subtree:true,characterData:true});
 const activityState=game.querySelector('[data-cabin-activity-state]');new MutationObserver(()=>{if(!dirty&&activityState.textContent)game.querySelector('.game-tip').textContent=activityState.textContent+' · 點家具互動';if(bubble.textContent==='好，熊熊正走過去。'&&!activityState.textContent.startsWith('正走向'))say(activityState.textContent+'。');}).observe(activityState,{childList:true,subtree:true,characterData:true});
 display.addEventListener('cabin-layout-feedback',event=>{if(!game.classList.contains('is-layout-editing'))say(event.detail);});
 display.addEventListener('cabin-layout-change',event=>{if(form){form.querySelector('[name="layout"]').value=JSON.stringify(event.detail);dirty=new URLSearchParams(new FormData(form)).toString()!==savedForm;game.querySelector('[data-cabin-save-state]').textContent=dirty?'位置預覽已更新，按儲存留下來。':'已回到原本的布置。';}});
 display.addEventListener('cabin-layout-save',()=>{if(form)form.requestSubmit();else{say('登入島民證，才能把這個布置留下來。');openPanel('editor');}});
 if(form){
  for(const select of form.querySelectorAll('select[name]')){
   const choices=document.createElement('div');choices.className='game-picks';choices.setAttribute('role','group');choices.setAttribute('aria-label',select.parentElement.childNodes[0]?.textContent||'選擇擺設');
   const icons={none:'○',print:'🌿',clock:'◷',photo:'▧',books:'📚',flowers:'✿',coffee:'☕',plant:'🌱',lamp:'☀',golf:'⛳'};
   for(const option of select.options){const pick=document.createElement('button');pick.type='button';pick.dataset.pickValue=option.value;const icon=document.createElement('span'),label=document.createElement('strong');icon.textContent=icons[option.value]||'●';if(select.name==='theme')icon.style.color=({sage:'#8fa98c',cream:'#c8b58e',rose:'#c99e94'})[option.value];label.textContent=option.textContent;pick.append(icon,label);pick.setAttribute('aria-pressed',String(select.value===option.value));pick.addEventListener('click',()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));});choices.append(pick);}
   select.hidden=true;select.after(choices);select.addEventListener('change',()=>choices.querySelectorAll('button').forEach(pick=>pick.setAttribute('aria-pressed',String(pick.dataset.pickValue===select.value))));
  }
  form.addEventListener('change',()=>{dirty=new URLSearchParams(new FormData(form)).toString()!==savedForm;say('正在預覽新布置 · 記得儲存');});
  window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
  form.addEventListener('submit',async event=>{
   event.preventDefault();if(busy)return;busy=true;const submit=form.querySelector('[type="submit"]'),label=submit.textContent;submit.disabled=true;submit.textContent='正在儲存…';
   const submitted=new URLSearchParams(new FormData(form));
   try{const response=await fetch(form.action,{method:'POST',body:submitted,credentials:'same-origin',cache:'no-store'}),doc=parse(await response.text()),revision=doc.querySelector('[data-cabin-form] [name="revision"]');
    if(!response.ok||!revision){const error=Error('儲存沒有完成');error.conflict=response.status===409;throw error;}
    form.querySelector('[name="revision"]').value=revision.value;const newShare=doc.querySelector('.cabin-share'),oldShare=game.querySelector('.cabin-share');if(oldShare)oldShare.remove();if(newShare)game.querySelector('.cabin-tools').append(newShare);submitted.set('revision',revision.value);savedForm=submitted.toString();dirty=new URLSearchParams(new FormData(form)).toString()!==savedForm;if(dirty){saveThenGo=false;say('剛才的布置已儲存；後續調整仍需再次儲存。');game.querySelector('[data-cabin-save-state]').textContent='還有新的調整尚未儲存，請再次儲存。';}else{close();say('小屋已儲存 ✨');game.querySelector('[data-cabin-save-state]').textContent='已儲存，這個樣子會跟著島民證保留。';if(saveThenGo){saveThenGo=false;walkToRoom();}}
   }catch(error){saveThenGo=false;const message=error.conflict?'另一個分頁已更新存檔。你的布置仍保留在畫面中；請先確認最新存檔，避免互相覆寫。':'儲存未完成，你的布置仍保留在畫面中。請再按儲存重試。';game.querySelector('[data-cabin-save-state]').textContent=message;say(message);}
   finally{busy=false;submit.disabled=false;submit.textContent=label;}
  });
 }
 // Keep a native, keyboard-accessible alternative to every scene hotspot.
 game.querySelector('.game-hotspots').hidden=false;
}
const cabinLifeScript='const bedroomCatalog='+JSON.stringify(bedroomCatalog)+';'+bedroomProblem.toString()+';const cabinBedroomDefaults='+JSON.stringify(cabinBedroomDefaults)+';const cabinFurniture='+JSON.stringify(cabinFurniture)+';const cabinRoomBounds='+JSON.stringify(cabinRoomBounds)+';const cabinLayoutDefaults='+JSON.stringify(cabinLayoutDefaults)+';'+cabinLayoutRects.toString()+';'+cabinLayoutProblem.toString()+';'+decodeCabinLayout.toString()+';('+cabinLifeClient.toString()+')();('+cabin3DClient.toString()+')();('+cabinGameClient.toString()+')();';


const seaStyles=`
.sea-content{max-width:840px;margin:auto}.sea-content h1{font-size:1.65rem;margin:7px 0 14px}.sea-content p{line-height:1.85}.sea-headnote{font-size:.82rem;color:#6a795f}.sea-tabs{display:flex;gap:7px;flex-wrap:wrap;margin:12px 0}.sea-tabs a{display:flex;align-items:center;min-height:44px;border:1px solid #c4d0b8;border-radius:999px;padding:5px 12px;text-decoration:none;background:#f1f2e2;font-size:.85rem}.sea-tabs a[aria-current=page]{background:#315a47;color:#fff8e7}.sea-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin:16px 0}.sea-card{padding:17px;border:1px solid #c7d1b9;background:#f1f2e1;border-radius:18px}.sea-card h2{font-size:1.12rem;margin:8px 0}.sea-card p{font-size:.86rem}.sea-card small{font-size:.73rem;color:#718063}.sea-story{padding:18px;border:1px solid #c9d2ba;border-radius:20px;background:#fffcef}.sea-story .life-person{margin-bottom:12px}.sea-story form{display:grid;gap:10px}.sea-story button,.sea-submit{min-height:48px;border-radius:12px;background:#e5edd7;text-align:left;padding:11px 14px;line-height:1.65}.sea-story button[type=submit],.sea-submit{background:#315b48;color:#fff9e7}.sea-choice{display:flex;gap:9px;align-items:flex-start;padding:12px;border:1px solid #cbd5bf;border-radius:13px;background:#f8f7e9;cursor:pointer;font-size:.9rem;line-height:1.8}.sea-choice input{flex:none;min-height:0;width:18px;height:18px;margin-top:5px}.sea-choice:has(input:checked){border:2px solid #658b56;background:#e6efd9}.sea-story select{font-size:16px;min-height:44px;border:1px solid #b7c6a7;border-radius:10px;padding:8px;background:#fffcef;width:100%}.sea-route{width:100%;height:auto;display:block;border-radius:18px;background:#d2e6dc;margin:12px 0}.sea-route text{font:700 17px system-ui;fill:#315444}.sea-lines{padding:0;list-style:none;display:grid;gap:12px}.sea-lines li{padding:14px 16px;border-left:3px solid #9eb991;border-radius:0 14px 14px 0;background:#f0f2e1}.sea-lines small{font-size:.72rem;color:#698063}.sea-lines p{margin:7px 0 0;font-size:.94rem}.sea-meter{font-size:.8rem;color:#6c7d60}.sea-collection{padding:14px;border-radius:16px;background:#ececdb}.sea-collection summary{min-height:44px;align-content:center;cursor:pointer}.sea-collection li{margin:12px 0;font-size:.88rem;line-height:1.8}.sea-empty{padding:20px;border:1px dashed #adbea0;border-radius:18px;background:#edf0df}.sea-linkrow{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:18px 0}.sea-linkrow a{min-height:44px;display:inline-flex;align-items:center}.sea-arrival{font-weight:700;color:#5e7f51}.sea-dialog{width:min(calc(100% - 24px),650px);max-height:85dvh;padding:0;border:1px solid #b6c6a5;border-radius:24px;background:#faf7e9;color:#2c4d3d}.sea-dialog::backdrop{background:#224d3b52;backdrop-filter:blur(3px)}.sea-dialog>header{position:sticky;top:0;z-index:3;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;background:#f0f1df;border-bottom:1px solid #cbd6be}.sea-dialog>header h2{font-size:1.08rem;margin:0}.sea-dialog>header button{min-height:44px;min-width:44px;border-radius:12px;font-size:.82rem;background:#fff9e7}.sea-dialog [data-sea-body]{padding:16px}.sea-dialog .sea-content>h1{display:none}.sea-dialog .sea-story{padding:14px}.sea-dialog [data-sea-status]{font-size:.8rem;margin:0;color:#6d785f}.sea-dialog .sea-cards{grid-template-columns:1fr}.sea-dialog .sea-content>nav{display:none}.hb-secret-pin,.hb-bottle-pin{position:absolute;z-index:5;left:var(--x);top:var(--y);transform:translate(-50%,-100%);display:flex;align-items:center;min-height:44px;padding:3px 9px;border:1px solid #9baa80;border-radius:999px;background:#fff0c5f2;color:#3c573c;font-size:clamp(.64rem,1.4vw,.82rem);font-weight:700;text-decoration:none;box-shadow:0 3px 8px #33534530}.hb-bottle-pin{background:#e9f2da;animation:sea-bottle 4s ease-in-out infinite}.hb-secret-pin span{font-size:.9em}.sea-map-note{display:flex;justify-content:space-between;gap:8px;align-items:center;padding:9px 12px;background:#f0efdd;font-size:.76rem;color:#66765c}.sea-map-note a{min-height:44px;display:inline-flex;align-items:center}.hb-stage .hb-secret-pin:hover,.hb-stage .hb-bottle-pin:hover{background:#315b48;color:#fff6dc}@keyframes sea-bottle{50%{translate:0 -4px}}@media(prefers-reduced-motion:reduce){.hb-bottle-pin{animation:none}}@media(max-width:760px){.sea-dialog{margin:auto 0 0;width:100%;max-width:none;max-height:82dvh;border-radius:24px 24px 0 0}.hb-secret-pin,.hb-bottle-pin{padding:2px 7px;font-size:.67rem}.sea-map-note{font-size:.7rem}.sea-content h1{font-size:1.45rem}}
`;
function seaPage(title,body,status=200){return lifePage(title,'<style>'+seaStyles+'</style><div class="sea-content"><nav class="sea-tabs" aria-label="海島探索"><a href="/islands">← 回島上</a><a href="/dock/secrets">居民動靜</a><a href="/dock/bottles">漂流瓶</a></nav>'+body+'</div>',status,'events');}
function secretMapState(){const clock=islandSecretClock();return {...clock,residents:Object.entries(residentSecrets).map(([id,resident],i)=>{const scene=resident.scenes[clock.phase],point=resortGeometry.stops[scene.stop];return {id,name:resident.name,resident:resident.resident,place:scene.place,title:scene.title,stop:scene.stop,x:point.x+(i===0?-42:i===1?39:12),y:point.y+(i===2?53:30)};})};}
async function secretRoute(request,db,url,visitor,profile){
 const clock=islandSecretClock();
 if(url.pathname==='/dock/secrets'&&url.searchParams.get('map')==='1'&&request.method==='GET')return new Response(JSON.stringify(secretMapState()),{headers:{...headers,'Content-Type':'application/json; charset=utf-8'}});
 const id=url.pathname.slice('/dock/secrets/'.length);
 if(url.pathname==='/dock/secrets'){
  if(request.method!=='GET')return seaPage('居民動靜','<h1>從居民卡片開始探索</h1>',405);
  const stopFilter=url.searchParams.get('stop');if(stopFilter!==null&&!/^[0-7]$/.test(stopFilter))return seaPage('居民動靜','<h1>找不到這座島</h1>',400);
  const rows=profile?(await db.prepare('SELECT resident,phase,choice FROM island_secret_memories WHERE visitor_key=? ORDER BY discovered_at DESC').bind(visitor).all()).results:[];
  return seaPage('居民的秘密生活','<span class="life-kicker">A LIFE BETWEEN HELLOS</span><h1>居民的秘密生活</h1><p class="sea-headnote">台灣時間 '+clock.label+'。居民在 06、11、17、22 點換一個生活片段。</p><p>走近看看，不同時候的同一位居民，也有不同的心事。</p><div class="sea-cards">'+Object.entries(residentSecrets).filter(([,resident])=>stopFilter===null||resident.scenes[clock.phase].stop===Number(stopFilter)).map(([key,resident])=>{const scene=resident.scenes[clock.phase],seen=rows.some(r=>r.resident===key&&r.phase===clock.phase);return '<article class="sea-card">'+questPerson(residentQuests[key])+'<h2>'+scene.title+'</h2><p>✦ '+scene.place+'</p><small>'+ (seen?'你們已經共享過這個片段':'一個還沒聽過的小故事')+'</small><p><a class="life-action" data-sea-open href="/dock/secrets/'+key+'">走近 '+resident.name+' ↗</a></p></article>';}).join('')+'</div><details class="sea-collection"><summary>我的偶遇收藏 · '+rows.length+' / 12</summary>'+(rows.length?'<ul>'+rows.map(r=>{const resident=residentSecrets[r.resident],scene=resident.scenes[r.phase];return '<li><strong>'+resident.name+' · '+scene.title+'</strong><br>'+scene.endings[r.choice]+'</li>';}).join('')+'</ul>':'<p>陪一位居民做一個選擇，就能留下第一段偶遇。</p>')+'</details>');
 }
 if(!Object.hasOwn(residentSecrets,id))return seaPage('找不到居民','<h1>這裡沒有這位居民</h1>',404);
 const resident=residentSecrets[id],scene=resident.scenes[clock.phase];let status=200,error='';
 if(request.method==='POST'){
  if(!profile)return seaPage(scene.title,'<h1>'+scene.title+'</h1>'+memberLinks(url.pathname),403);
  const parsed=await dockForm(request,url,1300),fields=parsed.fields;
  if(!fields){status=parsed.status;error=parsed.error;}
  else if(fields.get('phase')!==clock.phase){status=409;error='居民已換了地方，這是現在的小故事。請重新選擇。';}
  else if(!['a','b'].includes(fields.get('choice'))){status=400;error='請選一個故事中的回應。';}
  else{await db.prepare('INSERT INTO island_secret_memories(visitor_key,resident,phase,choice,discovered_at) VALUES(?,?,?,?,?) ON CONFLICT(visitor_key,resident,phase) DO NOTHING').bind(visitor,id,clock.phase,fields.get('choice'),Date.now()).run();return dockRedirect(url.pathname);}
 }
 const memory=profile?await db.prepare('SELECT choice FROM island_secret_memories WHERE visitor_key=? AND resident=? AND phase=?').bind(visitor,id,clock.phase).first():null;
 return seaPage(scene.title,'<span class="life-kicker">'+clock.label+' · '+scene.place+'</span><h1>'+scene.title+'</h1>'+(error?dockError(error):'')+'<section class="sea-story">'+questPerson(residentQuests[id])+'<p>'+scene.intro+'</p>'+(memory?'<p class="sea-arrival">'+resident.name+' 還記得你們的這次相遇。</p><p>'+scene.endings[memory.choice]+'</p><p class="notice" role="status">已收進「我的偶遇收藏」。</p>':profile?'<form method="post"><input type="hidden" name="phase" value="'+clock.phase+'">'+Object.entries(scene.choices).map(([choice,label])=>'<button name="choice" value="'+choice+'" type="submit">'+label+'</button>').join('')+'</form>':memberLinks(url.pathname))+'</section><div class="sea-linkrow"><a data-sea-open href="/dock/secrets">看看其他居民 ↗</a><a data-sea-open href="/dock/bottles">把一句話交給海風 🍾</a></div>',status);
}
function bottleRouteArt(segments){
 const points=seaPorts,arcs=segments.map((segment,i)=>{const a=points[segment.from_stop],b=points[segment.to_stop];return '<path d="M'+a.x+' '+a.y+' Q'+((a.x+b.x)/2)+' '+(Math.min(a.y,b.y)-25-i*7)+' '+b.x+' '+b.y+'" fill="none" stroke="'+(i===segments.length-1?'#bb9253':'#79a897')+'" stroke-width="3" stroke-dasharray="5 5"/>';}).join('');
 return '<svg class="sea-route" viewBox="0 0 620 250" role="img" aria-label="漂流瓶在島嶼之間的旅行路線"><rect width="620" height="250" rx="20" fill="#cce3d9"/>'+arcs+Object.entries(points).map(([id,p])=>'<g><ellipse cx="'+p.x+'" cy="'+p.y+'" rx="59" ry="24" fill="#a8c49e" stroke="#f4e5bc" stroke-width="6"/><text x="'+p.x+'" y="'+(p.y+6)+'" text-anchor="middle">'+p.name+'</text></g>').join('')+'</svg>';
}
function bottleFields(theme,from){return '<fieldset><legend>選一句接進故事裡</legend>'+bottleThemes[theme].phrases.map((phrase,i)=>'<label class="sea-choice"><input type="radio" name="phrase" value="'+i+'" required'+(i===0?' checked':'')+'><span>'+phrase+'</span></label>').join('')+'</fieldset><label>下一站，漂向哪裡？<select name="destination">'+Object.entries(seaPorts).filter(([id])=>id!==from).map(([id,p])=>'<option value="'+id+'">'+p.name+'</option>').join('')+'</select></label>';}
async function bottleRoute(request,db,url,visitor,profile){
 const base='/dock/bottles',tail=url.pathname.slice(base.length+1),clock=islandSecretClock(),day=clock.day;
 const intro='<span class="life-kicker">A STORY CARRIED BY THE SEA</span><h1>漂流瓶接力</h1><p>放出一句話，讓下一位島民接著寫。六位島民，共同完成一段小故事。</p>';
 if(!profile)return seaPage('漂流瓶接力',intro+'<section class="sea-story"><h2>一句話，漂向下一站</h2><p>只使用預設句子，不顯示你的暱稱或島民編號。故事和停靠點會讓其他已登入島民閱讀。</p>'+memberLinks(base)+'</section>',request.method==='POST'?403:200);
 let status=200,error='';
 const daily=await db.prepare('SELECT COUNT(*) AS n FROM island_bottle_segments WHERE writer_key=? AND day=?').bind(visitor,day).first();
 if(request.method==='POST'){
  const parsed=await dockForm(request,url,1800),f=parsed.fields;
  if(!f){status=parsed.status;error=parsed.error;}
  else if(f.get('action')==='create'&&tail==='new'){
   const theme=f.get('theme'),phrase=f.get('phrase'),destination=f.get('destination'),id=f.get('request_id');
   if(!Object.hasOwn(bottleThemes,theme)||!/^[0-3]$/.test(phrase||'')||!Object.hasOwn(seaPorts,destination)||destination==='dock'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id||'')){status=400;error='請從瓶子上的句子與目的地選擇。';}
   else{
    const requestBottle=await db.prepare('SELECT id,creator_key FROM island_bottles WHERE id=?').bind(id).first();if(requestBottle){if(requestBottle.creator_key===visitor)return dockRedirect(base+'/'+id);return seaPage('漂流瓶','<h1>請重新開啟一只新瓶子</h1>',400);}
    const duplicate=await db.prepare('SELECT id FROM island_bottles WHERE creator_key=? AND day=?').bind(visitor,day).first();
    if(duplicate)return dockRedirect(base+'/'+duplicate.id);
    if(daily.n>=3){status=429;error='今天已經交給海風三段故事了，明天再來接力吧。';}
    else{
     const now=Date.now(),results=await db.batch([
      db.prepare('INSERT INTO island_bottles(id,creator_key,theme,day,current_stop,created_at,updated_at) SELECT ?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM island_bottles WHERE creator_key=? AND day=?) AND (SELECT COUNT(*) FROM island_bottle_segments WHERE writer_key=? AND day=?)<3').bind(id,visitor,theme,day,destination,now,now,visitor,day,visitor,day),
      db.prepare('INSERT INTO island_bottle_segments(bottle_id,seq,writer_key,phrase,from_stop,to_stop,day,created_at) SELECT id,1,?,?,\'dock\',?,?,? FROM island_bottles WHERE id=? AND creator_key=? AND NOT EXISTS(SELECT 1 FROM island_bottle_segments WHERE bottle_id=?)').bind(visitor,Number(phrase),destination,day,now,id,visitor,id)
     ]);
     if(results[0].meta.changes)return dockRedirect(base+'/'+id);
     const existing=await db.prepare('SELECT id FROM island_bottles WHERE creator_key=? AND day=?').bind(visitor,day).first();
     if(existing)return dockRedirect(base+'/'+existing.id);
     status=429;error='今天的接力次數已用完，先看看瓶子漂到哪裡了。';
    }
   }
  }else if(f.get('action')==='relay'&&/^[0-9a-f-]{36}$/.test(tail)){
   const bottle=await db.prepare('SELECT * FROM island_bottles WHERE id=?').bind(tail).first(),revision=f.get('revision'),phrase=f.get('phrase'),destination=f.get('destination');
   if(!bottle){status=404;error='這只瓶子已不在海面上。';}
   else if(!/^[1-5]$/.test(revision||'')||!/^[0-3]$/.test(phrase||'')||!Object.hasOwn(seaPorts,destination)){status=400;error='請從目前瓶子上的選項接力。';}
   else{
    const wrote=await db.prepare('SELECT seq FROM island_bottle_segments WHERE bottle_id=? AND writer_key=?').bind(tail,visitor).first();
    if(wrote)return dockRedirect(base+'/'+tail);
    if(bottle.closed_at||bottle.revision!==Number(revision)){status=409;error='另一位島民已接續故事，請先看看新的進度。';}
    else if(destination===bottle.current_stop){status=400;error='選另一座島，讓瓶子繼續旅行。';}
    else if(daily.n>=3){status=429;error='今天已經接力三次了，明天再和海風交換故事。';}
    else{
     const now=Date.now(),seq=Number(revision)+1;
     const results=await db.batch([
      db.prepare('INSERT INTO island_bottle_segments(bottle_id,seq,writer_key,phrase,from_stop,to_stop,day,created_at) SELECT id,revision+1,?,?,current_stop,?,?,? FROM island_bottles b WHERE id=? AND revision=? AND closed_at IS NULL AND creator_key<>? AND NOT EXISTS(SELECT 1 FROM island_bottle_segments WHERE bottle_id=b.id AND writer_key=?) AND (SELECT COUNT(*) FROM island_bottle_segments WHERE writer_key=? AND day=?)<3').bind(visitor,Number(phrase),destination,day,now,tail,Number(revision),visitor,visitor,visitor,day),
      db.prepare('UPDATE island_bottles SET revision=revision+1,current_stop=?,updated_at=?,closed_at=CASE WHEN revision=5 THEN ? ELSE NULL END WHERE id=? AND revision=? AND EXISTS(SELECT 1 FROM island_bottle_segments WHERE bottle_id=? AND seq=? AND writer_key=? AND phrase=? AND created_at=?)').bind(destination,now,now,tail,Number(revision),tail,seq,visitor,Number(phrase),now)
     ]);
     if(results[0].meta.changes)return dockRedirect(base+'/'+tail);
     const existing=await db.prepare('SELECT seq FROM island_bottle_segments WHERE bottle_id=? AND writer_key=?').bind(tail,visitor).first();
     if(existing)return dockRedirect(base+'/'+tail);
     const latestDaily=await db.prepare('SELECT COUNT(*) AS n FROM island_bottle_segments WHERE writer_key=? AND day=?').bind(visitor,day).first();status=latestDaily.n>=3?429:409;error=latestDaily.n>=3?'今天已經接力三次了，先看看已參與的故事吧。':'瓶子剛被另一位島民接走了，請看看更新後的故事。';
    }
   }
  }else{status=400;error='請從漂流瓶上的按鈕開始。';}
 }
 if(tail==='new'){
  const requested=url.searchParams.get('theme')||'warm',theme=Object.hasOwn(bottleThemes,requested)?requested:'warm',own=await db.prepare('SELECT id FROM island_bottles WHERE creator_key=? AND day=?').bind(visitor,day).first();
  return seaPage('放出漂流瓶','<span class="life-kicker">A FIRST LINE</span><h1>替漂流瓶寫下第一句</h1>'+(error?dockError(error):'')+(own?'<p>你今天放出的瓶子，已經在旅行了。</p><a class="life-action" data-sea-open href="'+base+'/'+own.id+'">去看看它 ↗</a>':'<nav class="sea-tabs" aria-label="瓶中故事主題">'+Object.entries(bottleThemes).map(([id,t])=>'<a data-sea-open href="'+base+'/new?theme='+id+'"'+(id===theme?' aria-current="page"':'')+'>'+t.icon+' '+t.name+'</a>').join('')+'</nav><section class="sea-story"><form method="post" action="'+base+'/new?theme='+theme+'"><input type="hidden" name="action" value="create"><input type="hidden" name="theme" value="'+theme+'"><input type="hidden" name="request_id" value="'+crypto.randomUUID()+'">'+bottleFields(theme,'dock')+'<p class="sea-headnote">故事與停靠點會讓其他島民閱讀，不顯示你的暱稱與島民編號。</p><button type="submit">放進海裡，讓下一位島民接續 🍾</button></form></section>'),status);
 }
 if(tail&&tail!=='pick'){
  if(!/^[0-9a-f-]{36}$/.test(tail))return seaPage('找不到漂流瓶','<h1>找不到這只瓶子</h1>',404);
  const bottle=await db.prepare('SELECT * FROM island_bottles WHERE id=?').bind(tail).first();
  if(!bottle)return seaPage('找不到漂流瓶','<h1>找不到這只瓶子</h1>',404);
  const {results:segments}=await db.prepare('SELECT seq,writer_key,phrase,from_stop,to_stop FROM island_bottle_segments WHERE bottle_id=? ORDER BY seq').bind(tail).all(),theme=bottleThemes[bottle.theme],wrote=segments.some(s=>s.writer_key===visitor);
  return seaPage(theme.name,'<span class="life-kicker">MESSAGE IN A BOTTLE</span><h1>'+theme.icon+' '+theme.name+'</h1>'+(error?dockError(error):'')+'<p class="sea-meter">'+bottle.revision+' / 6 位島民接力 · '+(bottle.closed_at?'故事已完成':'目前漂向'+seaPorts[bottle.current_stop].name)+'</p>'+bottleRouteArt(segments)+'<ol class="sea-lines">'+segments.map(segment=>'<li><small>第 '+segment.seq+' 站 · '+(segment.writer_key===visitor?'你留下的句子':'一位島民留下的句子')+' · '+seaPorts[segment.from_stop].name+' → '+seaPorts[segment.to_stop].name+'</small><p>'+theme.phrases[segment.phrase]+'</p></li>').join('')+'</ol>'+(bottle.closed_at?'<p class="notice" role="status">六位島民一起完成了這段故事，已留在每位參與者的漂流瓶收藏。</p>':wrote?'<section class="sea-empty"><h2>瓶子還在漂流</h2><p>你已經接過這一瓶。等待另一位島民接續，就能看到新的句子和下一站。</p></section>':'<section class="sea-story"><h2>輪到你接續了</h2><form method="post" action="'+base+'/'+tail+'"><input type="hidden" name="action" value="relay"><input type="hidden" name="revision" value="'+bottle.revision+'">'+bottleFields(bottle.theme,bottle.current_stop)+'<button type="submit">接上這一句，再交給海風 ↗</button></form></section>')+'<div class="sea-linkrow"><a data-sea-open href="'+base+'">← 回漂流瓶海岸</a></div>',status);
 }
 if(tail==='pick'){
  const next=await db.prepare('SELECT b.id FROM island_bottles b WHERE b.closed_at IS NULL AND b.creator_key<>? AND NOT EXISTS(SELECT 1 FROM island_bottle_segments s WHERE s.bottle_id=b.id AND s.writer_key=?) ORDER BY b.updated_at,b.id LIMIT 1').bind(visitor,visitor).first();
  if(next)return dockRedirect(base+'/'+next.id);
  return seaPage('海風還在路上','<h1>海風還在路上</h1><section class="sea-empty"><p>目前沒有你還沒接過的瓶子。先放出自己的第一句，讓下一位島民來接續吧。</p><a class="life-action" data-sea-open href="'+base+'/new">放出一只漂流瓶 🍾</a></section><p><a data-sea-open href="'+base+'">回漂流瓶海岸</a></p>',status);
 }
 const raw=url.searchParams.get('page')||'1';if(!/^[1-9]\d{0,4}$/.test(raw))return seaPage('漂流瓶','<h1>找不到這一頁</h1>',400);
 const page=Number(raw),{results:mine}=await db.prepare('SELECT b.id,b.theme,b.revision,b.current_stop,b.closed_at FROM island_bottles b WHERE EXISTS(SELECT 1 FROM island_bottle_segments s WHERE s.bottle_id=b.id AND s.writer_key=?) ORDER BY b.updated_at DESC,b.id LIMIT 13 OFFSET ?').bind(visitor,(page-1)*12).all();
 return seaPage('漂流瓶接力',intro+(error?dockError(error):'')+'<p class="sea-headnote">每人每天可放出 1 瓶，放出與接續合計最多 3 次。同一瓶，每位島民只能留一句。</p><p class="sea-meter">今天已留下 '+daily.n+' / 3 段故事。</p><div class="sea-linkrow"><a class="life-action" data-sea-open href="'+base+'/pick">撿起一只漂流瓶 🍾</a><a data-sea-open href="'+base+'/new">放出我的一句話 ↗</a></div><h2>我參與的旅行</h2>'+(mine.length?'<div class="sea-cards">'+mine.slice(0,12).map(b=>'<article class="sea-card"><h3>'+bottleThemes[b.theme].icon+' '+bottleThemes[b.theme].name+'</h3><p>'+b.revision+' / 6 位島民 · '+(b.closed_at?'已完成':'漂向'+seaPorts[b.current_stop].name)+'</p><a data-sea-open href="'+base+'/'+b.id+'">翻看故事與路線 ↗</a></article>').join('')+'</div>':'<p class="sea-empty">你還沒有參與過漂流瓶故事。從一句話開始就好。</p>')+'<nav class="sea-linkrow" aria-label="漂流瓶分頁">'+(page>1?'<a data-sea-open href="'+base+'?page='+(page-1)+'">← 上一頁</a>':'')+(mine.length>12?'<a data-sea-open href="'+base+'?page='+(page+1)+'">下一頁 →</a>':'')+'</nav>');
}
async function islandSeaRoutes(request,env,url){
 if(!['GET','POST'].includes(request.method))return seaPage('海島探索','<h1>這個入口無法使用</h1>',405);
 const visitor=islanderOf(request),profile=visitor?await readPassportProfile(env.DB,visitor):null;
 return url.pathname.startsWith('/dock/secrets')?secretRoute(request,env.DB,url,visitor,profile):bottleRoute(request,env.DB,url,visitor,profile);
}
const squarePath='/dock/square';
const meetupCategories={sports:'運動',culture:'藝文・探索',food:'吃喝',learning:'共學',other:'其他'};
const meetupFeedback={created:'揪團已發佈。',joined:'報名成功。',left:'已退出揪團。',cancelled:'已取消揪團。',updated:'揪團資料已更新。'};
const meetupDate=new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Taipei',month:'long',day:'numeric',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const squareStyles=`
body{padding:12px;background:#e8eee4}
main{width:min(100%,960px);padding:clamp(12px,3vw,25px);background:#faf6e9}
main>.brand{display:none}
.sq-intro p,.sq-section p{margin:5px 0 10px}.sq-intro h1{margin:4px 0}
.sq-nav{display:flex;flex-wrap:wrap;gap:5px 14px;margin-bottom:12px}.sq-nav a{display:inline-flex;align-items:center;min-height:44px;font-weight:650}
.sq-intro .world-isometric{margin:10px 0}
.sq-intro .iso-stage{aspect-ratio:760/405;max-width:520px;margin:auto}
.sq-intro .world-isometric{background:#65887f}.sq-intro .iso-caption,.sq-intro .iso-controls{background:#e9ebd8}
.sq-layout{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(0,1fr);gap:12px;align-items:start}
.sq-section{padding:clamp(11px,2vw,17px);border:1px solid #c7d0be;border-radius:13px;background:#fffbf0;overflow-wrap:anywhere;scroll-margin-top:10px}
.sq-section h2{font-size:1.21rem;margin:0 0 4px}.sq-section h3{font-size:1.06rem;margin:2px 0}
.sq-section small{margin:3px 0}.sq-section form{margin:8px 0 0}.sq-section input,.sq-section select{min-width:0}
.sq-roster{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;list-style:none;margin:10px 0;padding:0}
.sq-roster li{display:grid;grid-template-columns:36px minmax(0,1fr);gap:6px;align-items:center;padding:5px;border-radius:8px;background:#edf0e2}
.sq-roster small,.sq-count{font-size:.73rem;color:#47604f}.sq-roster strong{font-size:.86rem}
.sq-membership{border-top:1px solid #d7dfcf;padding-top:8px}
.sq-event{margin-top:8px;padding:10px;background:#edf2e7;border-radius:9px}.sq-event p{margin:3px 0}.sq-event time{font-weight:650}.sq-event .travel-note{white-space:pre-wrap}
.sq-tag{display:inline-block;padding:2px 7px;border-radius:999px;background:#eadac6;color:#5d4130;font-size:.73rem;font-weight:700}
.sq-open{margin:10px 0}.sq-open summary{width:fit-content;cursor:pointer;min-height:44px;padding:10px 13px;font-weight:700}
.sq-open textarea{width:100%;min-height:56px}.sq-open label{min-width:0}.sq-open .sq-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.sq-pages{display:flex;gap:12px;flex-wrap:wrap}.sq-pages a{display:inline-flex;align-items:center;min-height:44px}
.sq-more{margin-top:12px}.sq-more>summary{cursor:pointer;min-height:44px;padding-top:9px;font-weight:700}
@media(max-width:650px){.sq-layout{grid-template-columns:1fr}}
@media(max-width:370px){.sq-open .sq-fields{grid-template-columns:1fr}}
body{background:#e6ece3;padding:12px}
main{width:min(100%,1060px);background:#faf7ed;border-color:#cbd1bf;border-radius:20px}
.sq-intro .trip-tag{font-size:.65rem;letter-spacing:.15em;color:#7c725c}
.sq-intro h1{font-size:clamp(1.7rem,5vw,2.4rem);letter-spacing:.02em}
.sq-intro>p{font-size:.9rem;color:#65705c}
.sq-nav{gap:5px;margin:13px 0 17px;display:flex;flex-wrap:wrap}
.sq-nav a{border:1px solid #d4d9c7;border-radius:999px;padding:6px 12px;font-size:.8rem;text-decoration:none;background:#f6f3e6}
.sq-nav a:hover{background:#e5ebda}
.sq-layout{grid-template-columns:minmax(0,1fr) minmax(220px,280px);gap:14px}
.sq-section{padding:16px;border-radius:17px;border-color:#d2d7c4}
.sq-meetups{background:#f7f5e8}
.sq-meetups>.trip-tag{font-size:.63rem;color:#7f755c;letter-spacing:.1em}
.sq-meetups>h2{margin-top:4px;font-size:1.4rem}
.sq-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;margin:14px 0 12px;padding:4px;background:#e7ecdd;border-radius:13px}
.sq-tabs a{display:flex;align-items:center;justify-content:center;min-height:44px;padding:5px;font-size:.8rem;font-weight:650;text-decoration:none;border-radius:10px;text-align:center}
.sq-tabs a[aria-current=page]{background:#2d5546;color:#fff8e7;box-shadow:0 2px 7px #254a3520}
.sq-open{margin-bottom:15px}
.sq-open>summary{border-radius:10px;padding:9px 14px;font-size:.85rem}
.sq-open[open]{padding:10px;border:1px solid #bac9ae;border-radius:12px;background:#fffbef}
.sq-open[open]>summary{background:#e7eddb;color:#2c4e3e}
.sq-open input,.sq-open select,.sq-open textarea{background:#fffdf7;border-color:#aebea2;border-radius:9px}
.sq-open form>button{background:#2d5546;color:#fff8e7;border-radius:10px}
.sq-event-grid{display:grid;gap:12px}
.sq-event{margin:0;padding:15px;border:1px solid #d7dbc8;border-radius:15px;background:#fffcf2;box-shadow:0 4px 12px #344e3207}
.sq-event-top{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:7px}
.sq-tag{font-size:.69rem;padding:3px 9px;background:#eee3cc}
.sq-state{font-size:.74rem;font-weight:700;color:#5d7458}
.sq-event h3{font-size:1.13rem;line-height:1.4;margin:4px 0 8px}
.sq-event time{font-size:.88rem;color:#35563f}
.sq-venue{font-size:.86rem;color:#607259}
.sq-event>.travel-note{font-size:.84rem;line-height:1.7;border-top:1px solid #e4e6d7;margin-top:10px;padding-top:8px}
.sq-event>small{font-size:.73rem;margin:9px 0}
.sq-event>form>button{width:100%;background:#2c5546;color:#fff8e7;border-radius:10px;margin-top:4px}
.sq-members{border-top:1px solid #e1e4d1;padding-top:4px;margin-top:8px}
.sq-members summary,.sq-stroll>summary{cursor:pointer;min-height:44px;padding:10px 0;font-size:.82rem;font-weight:650}
.sq-members ul{margin:0 0 8px;padding-left:20px;font-size:.84rem}
.sq-members li{padding:3px 0}.sq-members li small{display:inline;font-size:.68rem;color:#6e7b65}
.sq-edit-link{display:inline-flex;align-items:center;min-height:44px;font-weight:650;font-size:.83rem}
.sq-event .sq-more{margin-top:0}.sq-event .sq-more summary{font-size:.77rem;color:#7a6755}
.sq-event .sq-more p{font-size:.8rem}.sq-event .sq-more button{width:100%}
.sq-empty{padding:22px 13px;text-align:center;border:1px dashed #b8c6a8;border-radius:13px;background:#edf0df}
.sq-empty h3{font-size:1rem}.sq-empty p{font-size:.85rem}.sq-empty a{display:inline-flex;align-items:center;min-height:44px;font-size:.84rem}
.sq-stroll{margin-top:14px;border-top:1px solid #d9deca}
.sq-stroll .world-isometric{max-width:620px;margin:auto}
.sq-stroll .iso-stage{aspect-ratio:760/405}
.sq-stroll .iso-caption{font-size:.77rem}
.sq-more .dock-greetings svg,.sq-roster svg{width:36px;height:36px;max-width:100%;display:block}
@media(max-width:700px){
 body{padding:8px}.sq-layout{grid-template-columns:1fr}
 main{padding:14px 11px}.sq-section{padding:13px}
 .sq-nav a{font-size:.75rem;padding:5px 9px}
 .sq-open input,.sq-open select,.sq-open textarea{font-size:16px}
 .sq-event{padding:13px}
}

`;
function meetupInput(fields){
 const read=name=>fields.get(name)?.trim()||'';
 return {title:read('title'),category:read('category'),when:read('when'),venue:read('venue'),details:read('details'),capacity:read('capacity'),createId:read('create_id')};
}
async function changeMeetup(db,visitor,action,id){
 if(!tokenPattern.test(id||''))return false;
 if(action==='meetup-leave'){
  await db.prepare('DELETE FROM island_meetup_guests WHERE meetup_id=? AND visitor_key=?').bind(id,visitor).run();
  return true;
 }
 if(action==='meetup-cancel'){
  const result=await db.prepare('UPDATE island_meetups SET cancelled=1,revision=revision+1 WHERE id=? AND host_key=? AND cancelled=0 AND starts_at>?').bind(id,visitor,Date.now()).run();
  return Boolean(result.meta.changes);
 }
 const result=await db.prepare(`INSERT INTO island_meetup_guests(meetup_id,visitor_key)
 SELECT m.id,? FROM island_meetups m WHERE m.id=? AND m.host_key<>? AND m.cancelled=0 AND m.starts_at>?
 AND ((SELECT COUNT(*) FROM island_meetup_guests g WHERE g.meetup_id=m.id)<m.capacity-1
 OR EXISTS (SELECT 1 FROM island_meetup_guests g WHERE g.meetup_id=m.id AND g.visitor_key=?))
 ON CONFLICT(meetup_id,visitor_key) DO UPDATE SET visitor_key=excluded.visitor_key`)
  .bind(visitor,id,visitor,Date.now(),visitor).run();
 return Boolean(result.meta.changes);
}
const squarePageIndex=(url,name)=>Math.min(10000,Math.max(0,parseInt(url.searchParams.get(name),10)||0));
function squarePages(url,key,page,more,section){
 const link=(next,label)=>{
  const params=new URLSearchParams();
  const view=meetupView(url.searchParams.get('view'));if(view!=='all')params.set('view',view);
  for(const name of ['groups','residents']){
   const index=name===key?next:squarePageIndex(url,name);
   if(index)params.set(name,String(index));
  }
  return '<a href="'+squarePath+(params.size?'?'+escape(params.toString()):'')+'#'+section+'">'+label+'</a>';
 };
 return page||more?'<nav class="sq-pages" aria-label="分頁">'+(page?link(page-1,'← 上一頁'):'')+(more?link(page+1,'下一頁 →'):'')+'</nav>':'';
}
async function squareResidents(db,visitor,url){
 const page=squarePageIndex(url,'residents'), size=16;
 const [own,{results}]=await Promise.all([
  db.prepare('SELECT 1 FROM island_square_residents WHERE visitor_key=?').bind(visitor).first(),
  db.prepare(`SELECT p.nickname,p.bear,c.member_no,
   COALESCE(json_extract(w.slots_json,'$."'||w.active_slot||'".outfit'),p.outfit) outfit,
   json_extract(w.slots_json,'$."'||w.active_slot||'".shoes') shoes,
   json_extract(w.slots_json,'$."'||w.active_slot||'".bag') bag
   FROM island_square_residents r JOIN island_passports p ON p.visitor_key=r.visitor_key
   JOIN island_credentials c ON c.visitor_key=r.visitor_key LEFT JOIN bear_world_looks w ON w.visitor_key=r.visitor_key
   ORDER BY c.member_no LIMIT ? OFFSET ?`).bind(size+1,page*size).all()
 ]);
 const cards=results.slice(0,size).map(r=>'<li>'+memberAvatar(r,true)+'<div><strong>'+escape(r.nickname)+'</strong><small>'+memberLabel(r.member_no)+'</small></div></li>').join('');
 return '<section id="residents" class="sq-section"><h2>島民名冊</h2><p>認識願意在廣場亮相的熊熊。</p>'+
  (cards?'<ul class="sq-roster">'+cards+'</ul>':'<p>這一頁還沒有熊熊。</p>')+
  squarePages(url,'residents',page,results.length>size,'residents')+
  '<div class="sq-membership"><small>僅已登入的島民可看見你分享的熊熊造型、暱稱與島民編號。</small>'+
  '<form method="post" action="'+squarePath+'#residents"><button name="action" value="'+(own?'resident-hide':'resident-show')+'">'+(own?'從名冊隱藏我':'讓其他島民看見我')+'</button></form></div></section>';
}
const meetupViews={all:'全部活動',joined:'我報名的',hosting:'我發起的'};
const meetupView=value=>Object.hasOwn(meetupViews,value)?value:'all';
const meetupViewField=view=>'<input type="hidden" name="view" value="'+view+'">';
function meetupDestination(view,feedback){
 const params=new URLSearchParams();
 if(view!=='all')params.set('view',view);
 if(feedback)params.set('meetup',feedback);
 return squarePath+(params.size?'?'+params.toString():'')+'#meetups';
}
async function editableMeetup(db,visitor,id){
 if(!tokenPattern.test(id||''))return null;
 return db.prepare('SELECT id,title,category,starts_at,venue,details,capacity,revision,cancelled FROM island_meetups WHERE id=? AND host_key=?').bind(id,visitor).first();
}
function meetupLocalDate(timestamp){
 return new Date(timestamp+8*3600000).toISOString().slice(0,16);
}
async function saveMeetup(db,visitor,input,edit=null){
 const {title,category,when,venue,details,capacity}=input;
 const now=Date.now(), starts=Date.parse(when+':00+08:00');
 if(!cap(title,48)||!Object.hasOwn(meetupCategories,category)||!cap(venue,80)||details.length>280||!/^(?:[2-9]|1[0-9]|20)$/.test(capacity))
  return {error:'請填寫活動名稱、類別、集合地點和人數上限。',status:400};
 if(!/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d$/.test(when)||!Number.isFinite(starts)||
    new Date(starts+8*3600000).toISOString().slice(0,16)!==when||starts<=now||starts>now+90*86400000)
  return {error:'請選擇未來 90 天內的日期和時間（台灣時間）。',status:400};
 if(edit){
  const own=await editableMeetup(db,visitor,edit.id);
  if(!own)return {error:'只有發起人可以修改這個揪團。',status:403};
  if(!/^\d{1,10}$/.test(edit.revision))return {error:'請重新開啟編輯表單再試一次。',status:400};
  const saved=await db.prepare(`UPDATE island_meetups SET title=?,category=?,starts_at=?,venue=?,details=?,capacity=?,revision=revision+1
   WHERE id=? AND host_key=? AND revision=? AND cancelled=0 AND starts_at>?
   AND ? >= 1+(SELECT COUNT(*) FROM island_meetup_guests WHERE meetup_id=?)`)
   .bind(title,category,starts,venue,details,Number(capacity),edit.id,visitor,Number(edit.revision),now,Number(capacity),edit.id).run();
  if(!saved.meta.changes)return {error:'活動已變更、取消或開始，或人數上限小於目前團員數。請重新開啟編輯表單。',status:409};
 }else{
  if(input.createId&&!tokenPattern.test(input.createId))return {error:'請重新開啟開團表單。',status:400};
  const id=input.createId||randomToken();
  const created=await db.prepare('INSERT INTO island_meetups(id,host_key,title,category,starts_at,venue,details,capacity) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING')
   .bind(id,visitor,title,category,starts,venue,details,Number(capacity)).run();
  if(!created.meta.changes){
   const previous=await editableMeetup(db,visitor,id);
   if(!previous||previous.title!==title||previous.category!==category||previous.starts_at!==starts||previous.venue!==venue||previous.details!==details||previous.capacity!==Number(capacity))
    return {error:'這份開團表單已使用過，請重新開啟表單。',status:409};
  }
 }
 return {};
}
function meetupForm(form,edit,view){
 const val=key=>escape(form?.[key]||'');
 const categories=Object.entries(meetupCategories).map(([key,label])=>'<option value="'+key+'"'+(form?.category===key?' selected':'')+'>'+label+'</option>').join('');
 return '<details id="new-meetup" class="sq-open"'+(form?' open':'')+'><summary class="cta">'+(edit?'修改揪團':'＋ 我要開團')+'</summary>'+
  '<form method="post" action="'+squarePath+'#meetups">'+meetupViewField(view)+
  (edit?'<input type="hidden" name="meetup" value="'+escape(edit.id)+'"><input type="hidden" name="revision" value="'+escape(edit.revision)+'">':'<input type="hidden" name="create_id" value="'+(val('createId')||randomToken())+'">')+
  '<label>想約什麼？<input name="title" required maxlength="48" placeholder="例如 週六來打匹克球雙打" value="'+val('title')+'"></label>'+
  '<div class="sq-fields"><label>類別<select name="category">'+categories+'</select></label><label>人數上限（含自己）<input type="number" name="capacity" required min="2" max="20" value="'+(val('capacity')||'4')+'"></label></div>'+
  '<label>集合時間（台灣時間）<input type="datetime-local" name="when" value="'+val('when')+'" required></label>'+
  '<label>集合地點<input name="venue" required maxlength="80" placeholder="例如 信義運動中心大門" value="'+val('venue')+'"></label>'+
  '<label>給團員的備註（選填）<textarea name="details" maxlength="280" placeholder="程度、費用或要帶什麼">'+val('details')+'</textarea></label>'+
  '<small>已登入的島民可看到活動內容和你的暱稱，發起人可看到報名者的暱稱與島民編號。修改後請和團員確認新的安排。</small>'+
  '<button name="action" value="'+(edit?'meetup-update':'meetup-create')+'">'+(edit?'儲存修改':'發佈揪團')+'</button>'+
  (edit?'<a href="'+meetupDestination(view)+'">取消編輯</a>':'')+'</form></details>';
}
function meetupCard(row,view,members=[]){
 const size=row.guests+1,past=row.starts_at<=Date.now();
 const state=row.cancelled?'已取消':past?'已結束':row.own?'你發起的':row.joined?'你已報名':size>=row.capacity?'已額滿':'還有 '+(row.capacity-size)+' 位';
 const action=row.cancelled||past?'':row.own?'meetup-cancel':row.joined?'meetup-leave':size<row.capacity?'meetup-join':'';
 const labels={'meetup-cancel':'取消揪團','meetup-leave':'退出揪團','meetup-join':'我要報名'};
 const button=action?'<form method="post" action="'+squarePath+'#meetups">'+meetupViewField(view)+'<input type="hidden" name="meetup" value="'+row.id+'"><button name="action" value="'+action+'">'+labels[action]+'</button></form>':'';
 const roster=row.own?'<details class="sq-members"><summary>團員名單 · '+size+' 人</summary><ul><li>你（發起人）</li>'+
  members.map(member=>'<li>'+escape(member.nickname)+(member.member_no!=null?' <small>'+memberLabel(member.member_no)+'</small>':'')+'</li>').join('')+'</ul></details>':'';
 const edit=row.own&&!row.cancelled&&!past?'<a class="sq-edit-link" href="'+squarePath+'?view='+view+'&amp;edit='+row.id+'#new-meetup">修改活動資料 ↗</a>':'';
 return '<article class="sq-event"><div class="sq-event-top"><span class="sq-tag">'+meetupCategories[row.category]+'</span><span class="sq-state">'+state+'</span></div><h3>'+escape(row.title)+'</h3>'+
  '<p><time datetime="'+new Date(row.starts_at).toISOString()+'">'+meetupDate.format(row.starts_at)+'</time></p><p class="sq-venue">'+escape(row.venue)+'</p>'+
  (row.details?'<p class="travel-note">'+escape(row.details)+'</p>':'')+'<small>'+escape(row.host)+' 發起 · '+size+'/'+row.capacity+' 人 · '+state+'</small>'+
  roster+(row.own&&action?edit+'<details class="sq-more"><summary>取消這個揪團</summary><p>取消後，已報名的團員會看到取消狀態。</p>'+button+'</details>':button)+'</article>';
}
async function squareMeetups(db,visitor,url,draft,edit=null){
 const page=squarePageIndex(url,'groups'),size=12,view=meetupView(url.searchParams.get('view')),now=Date.now();
 const filter=view==='hosting'?'m.host_key=?':view==='joined'?'EXISTS (SELECT 1 FROM island_meetup_guests mine WHERE mine.meetup_id=m.id AND mine.visitor_key=?)':'m.starts_at>?';
 const {results}=await db.prepare(`SELECT m.id,m.title,m.category,m.starts_at,m.venue,m.details,m.capacity,m.cancelled,
  p.nickname host,(m.host_key=?) own,COUNT(g.visitor_key) guests,MAX(CASE WHEN g.visitor_key=? THEN 1 ELSE 0 END) joined
  FROM island_meetups m JOIN island_passports p ON p.visitor_key=m.host_key
  LEFT JOIN island_meetup_guests g ON g.meetup_id=m.id WHERE `+filter+`
  GROUP BY m.id HAVING m.cancelled=0 OR own=1 OR joined=1
  ORDER BY CASE WHEN m.starts_at>? AND m.cancelled=0 THEN 0 ELSE 1 END,
  CASE WHEN m.starts_at>? AND m.cancelled=0 THEN m.starts_at ELSE -m.starts_at END,m.id LIMIT ? OFFSET ?`)
  .bind(visitor,visitor,view==='all'?now:visitor,now,now,size+1,page*size).all();
 const visible=results.slice(0,size),hosted=visible.filter(row=>row.own).map(row=>row.id);
 let members=[];
 if(hosted.length){
  const guests=await db.prepare(`SELECT g.meetup_id,p.nickname,c.member_no FROM island_meetup_guests g
   JOIN island_meetups m ON m.id=g.meetup_id JOIN island_passports p ON p.visitor_key=g.visitor_key
   LEFT JOIN island_credentials c ON c.visitor_key=g.visitor_key WHERE m.host_key=? AND m.id IN (`+hosted.map(()=>'?').join(',')+') ORDER BY p.nickname,c.member_no')
   .bind(visitor,...hosted).all();
  members=guests.results;
 }
 const tabs=Object.entries(meetupViews).map(([key,label])=>'<a href="'+meetupDestination(key)+'"'+(key===view?' aria-current="page"':'')+'>'+label+'</a>').join('');
 const feedback=url.searchParams.get('meetup');
 return '<section id="meetups" class="sq-section sq-meetups"><span class="trip-tag">MEET UP / GO TOGETHER</span><h2>下一團，一起出發</h2><p>挑一場有空的活動，或發起你想做的事。</p>'+
  '<nav class="sq-tabs" aria-label="我的揪團">'+tabs+'</nav>'+
  (Object.hasOwn(meetupFeedback,feedback)?'<p class="notice" role="status">'+meetupFeedback[feedback]+'</p>':'')+
  (url.searchParams.has('draw')&&draft&&!edit?'<p class="notice">已帶入輪盤抽到的活動，補上時間與地點就能開團。</p>':'')+
  meetupForm(draft,edit,view)+'<div class="sq-event-grid">'+
  (visible.length?visible.map(row=>meetupCard(row,view,members.filter(member=>member.meetup_id===row.id))).join(''):
   '<div class="sq-empty"><h3>'+(view==='joined'?'你還沒有報名活動':view==='hosting'?'你的第一團，從這裡開始':'目前還沒有即將出發的團')+'</h3><p>從輪盤挑一個點子，或按「我要開團」約大家一起。</p><a href="/dock/wheel">轉輪盤找靈感 ↗</a></div>')+
  '</div>'+squarePages(url,'groups',page,results.length>size,'meetups')+'</section>';
}

async function islandSquare(request,db,url,visitor,profile){
 const week=taipeiWeek();
 let error='',status=200,draft=null,edit=null;
 if(request.method==='POST'){
  const parsed=await dockForm(request,url,7500);
  if(!parsed.fields){error=parsed.error;status=parsed.status;}
  else{
   const action=parsed.fields.get('action'),option=parsed.fields.get('option');
   url.searchParams.set('view',meetupView(parsed.fields.get('view')));
   if(action==='resident-show'||action==='resident-hide'){
    if(action==='resident-show'){
     await ensureCredential(db,visitor);
     await db.prepare('INSERT OR IGNORE INTO island_square_residents(visitor_key) VALUES(?)').bind(visitor).run();
    }else await db.prepare('DELETE FROM island_square_residents WHERE visitor_key=?').bind(visitor).run();
    return dockRedirect(squarePath+'#residents');
   }
   if(action==='meetup-create'||action==='meetup-update'){
    draft=meetupInput(parsed.fields);
    if(action==='meetup-update')edit={id:parsed.fields.get('meetup')||'',revision:parsed.fields.get('revision')||''};
    const result=await saveMeetup(db,visitor,draft,edit);
    if(!result.error)return dockRedirect(meetupDestination(meetupView(parsed.fields.get('view')),edit?'updated':'created'));
    error=result.error;status=result.status;
   }else if(['meetup-join','meetup-leave','meetup-cancel'].includes(action)){
    const outcome={'meetup-join':'joined','meetup-leave':'left','meetup-cancel':'cancelled'};
    if(await changeMeetup(db,visitor,action,parsed.fields.get('meetup')))return dockRedirect(meetupDestination(meetupView(parsed.fields.get('view')),outcome[action]));
    error='這個揪團已額滿、已截止，或你沒有權限進行這項操作。';status=409;
   }else if(action==='greet'&&Object.hasOwn(greetings,option)){
    await db.prepare('INSERT INTO island_board_greetings(visitor_key,greeting,nickname,bear,outfit,updated_at) VALUES(?,?,?,?,?,?) ON CONFLICT(visitor_key) DO UPDATE SET greeting=excluded.greeting,nickname=excluded.nickname,bear=excluded.bear,outfit=excluded.outfit,updated_at=excluded.updated_at').bind(visitor,option,profile.nickname,profile.bear,profile.outfit,Date.now()).run();
    return dockRedirect('/dock/square#noticeboard');
   }
   else if(action==='ungreet'){
    await db.prepare('DELETE FROM island_board_greetings WHERE visitor_key=?').bind(visitor).run();
    return dockRedirect('/dock/square#noticeboard');
   }
   else if((action==='join'||action==='leave')&&Object.hasOwn(weeklyActivities,option)){
    if(action==='join')await db.prepare('INSERT OR IGNORE INTO island_weekly_activities(week,activity,visitor_key) VALUES(?,?,?)').bind(week,option,visitor).run();
    else await db.prepare('DELETE FROM island_weekly_activities WHERE week=? AND activity=? AND visitor_key=?').bind(week,option,visitor).run();
    return dockRedirect('/dock/square#weekly-activities');
   }
   else{error='請選擇一項有效的島民活動。';status=400;}
  }
 }
 if(request.method==='GET'&&url.searchParams.has('edit')){
  const row=await editableMeetup(db,visitor,url.searchParams.get('edit'));
  if(!row){error='只有發起人可以修改這個揪團。';status=403;}
  else if(row.cancelled||row.starts_at<=Date.now()){error='活動已取消或開始，無法再修改。';status=409;}
  else{draft={...row,when:meetupLocalDate(row.starts_at),capacity:String(row.capacity)};edit={id:row.id,revision:String(row.revision)};}
 }else if(request.method==='GET'&&tokenPattern.test(url.searchParams.get('draw')||'')){
  const draw=await db.prepare('SELECT id,title,mode FROM island_wheel_draws WHERE id=? AND visitor_key=?').bind(url.searchParams.get('draw'),visitor).first();
  if(draw){
   const idea=wheelChoices[draw.mode]?.find(([title])=>title===draw.title);
   draft={title:draw.title.slice(0,48),details:idea?.[1]||'',category:/球|舞|運動/.test(draw.title)?'sports':/吃|食|菜|酒|午餐/.test(draw.title)?'food':/展|攝影|旅行/.test(draw.title)?'culture':'other',capacity:'4'};
  }else{error='這份輪盤結果無法讀取，請用原本的島民證登入或重新轉一次。';status=404;}
 }
 const ownGreeting=await db.prepare('SELECT greeting FROM island_board_greetings WHERE visitor_key=?').bind(visitor).first();
 const {results:notes}=await db.prepare(`SELECT g.greeting,COALESCE(p.nickname,g.nickname) nickname,COALESCE(p.bear,g.bear) bear,
 COALESCE(json_extract(w.slots_json,'$."'||w.active_slot||'".outfit'),p.outfit,g.outfit) outfit,
 json_extract(w.slots_json,'$."'||w.active_slot||'".shoes') shoes,json_extract(w.slots_json,'$."'||w.active_slot||'".bag') bag
 FROM island_board_greetings g LEFT JOIN island_passports p ON p.visitor_key=g.visitor_key LEFT JOIN bear_world_looks w ON w.visitor_key=g.visitor_key ORDER BY g.updated_at DESC LIMIT 12`).all();
 const {results:signups}=await db.prepare('SELECT activity,COUNT(*) AS count,MAX(CASE WHEN visitor_key=? THEN 1 ELSE 0 END) AS joined FROM island_weekly_activities WHERE week=? GROUP BY activity').bind(visitor,week).all();
 const options=Object.entries(greetings).map(([id,label])=>'<option value="'+id+'"'+(ownGreeting?.greeting===id?' selected':'')+'>'+label+'</option>').join('');
 const board=notes.filter(note=>Object.hasOwn(greetings,note.greeting)).map(note=>'<li>'+memberAvatar(note,true)+'<div><strong>'+escape(note.nickname)+'</strong><p>'+greetings[note.greeting]+'</p></div></li>').join('');
 const activities=Object.entries(weeklyActivities).map(([id,a])=>{
  const row=signups.find(s=>s.activity===id),joined=row?.joined===1;
  return '<article class="dock-life-card"><h3>'+a.title+'</h3><p>'+a.note+'</p>'+(a.port?'<a href="/dock/'+a.port+'">前往練習 ↗</a>':'')+
   '<div class="dock-activity-meta"><small>'+(row?.count||0)+' 位島民參加'+(joined?' · 你已加入':'')+'</small><form method="post"><input type="hidden" name="option" value="'+id+'"><button name="action" value="'+(joined?'leave':'join')+'" type="submit">'+(joined?'退出活動':'加入活動')+'</button></form></div></article>';
 }).join('');
 const [meetups,residents]=await Promise.all([squareMeetups(db,visitor,url,draft,edit),squareResidents(db,visitor,url)]);
 return harborHtml('<style>'+dockStyles+squareStyles+'</style><header class="sq-intro"><span class="trip-tag">JADE HARBOUR / TOWN SQUARE</span><h1>榕樹廣場</h1>'+
  '<p>認識島上的熊熊，找一團想去的活動。</p><nav class="sq-nav" aria-label="廣場導覽">'+
  '<a href="/world?at=1">← 回渡假村</a><a href="#meetups">找活動</a><a href="/dock/square?view=joined#meetups">我的揪團</a><a href="#new-meetup">＋ 我要開團</a></nav>'+
  '</header>'+
  (error?dockError(error):'')+'<div class="sq-layout">'+meetups+residents+'</div><details class="sq-stroll"><summary>到廣場散步</summary>'+worldScene(true,memberAvatar(profile,true))+'</details>'+
  '<section class="sq-section sq-more" aria-label="布告欄與本週小任務"><section id="noticeboard" class="dock-section"><h2>島民布告欄</h2>'+(board?'<ul class="dock-greetings">'+board+'</ul>':'<p>還沒有人打招呼。可以從你開始。</p>')+
  '<form method="post"><label>選一句招呼<select name="option">'+options+'</select></label><small>發佈後，你的熊熊和暱稱會顯示給已登島的島民。你可以隨時撤下。</small><button name="action" value="greet" type="submit">'+(ownGreeting?'更新招呼':'發佈招呼')+'</button></form>'+
  (ownGreeting?'<form class="dock-withdraw" method="post"><button name="action" value="ungreet" type="submit">撤下我的招呼</button></form>':'')+'</section>'+
  '<section id="weekly-activities" class="dock-section"><h2>本週島上活動</h2><p>從 '+week.replaceAll('-','/')+' 起，可自由加入、各自找時間完成。</p>'+activities+'</section></section>',status,undefined,worldSceneHeaders);
}

function returnPath(path){
 if(typeof path==='string'&&/^\/world\/home(?:\/BEAR-\d{4,10})?$/.test(path))return path;
 if(path==='/dock/cabin/bedroom')return path;
 if(typeof path==='string'&&/^\/dock\/(?:career|network|mba|english|finance)\?practice=1$/.test(path))return path;
 if(typeof path==='string'&&/^(?:\/dock\/quests(?:\/(?:hugo|liv|ari))?|\/islands\/cabins\/BEAR-\d{4,10})$/.test(path))return path;
 if(path===harborDockPath||typeof path==='string'&&/^\/dock\/square\?draw=[a-f0-9]{48}$/.test(path))return path;
 return typeof path==='string'&&/^\/(?:islands|world(?:\/(?:emerald|dock|island\/BEAR-\d{4,10}))?|r\/[a-f0-9]{48}|trip\/[a-f0-9]{48}|dock(?:\/(?:[a-z-]+|pair\/[a-f0-9]{48}))?)$/.test(path)?path:'';
}
function memberLinks(path){
 const next=returnPath(path), query=next?'&amp;next='+encodeURIComponent(next):'';
 return '<p>先登入島民證，這次的活動才會記進你的護照。</p><div class="dock-actions"><a class="cta" href="/passport?recover=1'+query+'#passport-recover">用島民證登入</a> · <a href="/passport'+(next?'?next='+encodeURIComponent(next):'')+'#passport-form">還沒有？領取島民證</a></div>';
}
const pairPrompts={
 moment:'今天有什麼小事，讓你想分享給對方？',
 color:'如果今天是一種顏色，那會是什麼？',
 treat:'今天你給了自己什麼小獎勵？'
};
const wheelChoices={
 night:[
  ['去跳一堂 Swing 社交舞','挑有零基礎體驗的場次，先去跳三首歌。'],
  ['約一場下班匹克球','約 2–4 人打一小時。先說好是輕鬆練球還是打雙打。'],
  ['逛一間沒去過的小酒館','挑一杯有興趣的無酒精特調，坐吧台吃一道小菜。'],
  ['來一場 30 分鐘夜間攝影','選一條老街，拍三張有招牌、倒影或街燈的照片。'],
  ['相約試一門下班手作課','找一場有位子的陶作、調香或花藝課。'],
  ['約朋友玩兩人桌遊','選一款 30 分鐘內能玩完的遊戲，輸家挑下次的店。'],
 ],
 weekend:[
  ['看展後互選一件想帶回家的作品','各挑一件作品，到附近咖啡店聊為什麼。'],
  ['揪一場新手高爾夫練球','到練習場各打一籃球，再互拍一段揮桿。'],
  ['抽一站捷運，來一趟半日旅行','走一條平常不會走的巷子，找間店吃午餐。'],
  ['去傳統市場挑三樣食材做午餐','每人選一樣，回家一起做一道從沒做過的菜。'],
  ['報名一堂陌生舞種的體驗課','從爵士舞、現代舞或即興律動選一個去跳。'],
  ['約一場桌球三局挑戰','找球館打三局，再交換一個對方最難接的球。'],
 ]
};
async function passportRecords(db,visitor,profile,page=0){
 // Query each source separately; hosted D1 restricts compound SELECTs.
 const limit=page*30+31;
 const queries=[
  ["SELECT 'practice' AS kind,port AS ref,'' AS label,updated_at AS happened FROM island_practice_answers WHERE visitor_key=? ORDER BY happened DESC,ref LIMIT ?",[visitor,limit]],
  ["SELECT 'greeting' AS kind,'square' AS ref,'' AS label,updated_at AS happened FROM island_board_greetings WHERE visitor_key=? ORDER BY happened DESC LIMIT ?",[visitor,limit]],
  ["SELECT 'weekly' AS kind,activity AS ref,week AS label,CAST(strftime('%s',week||' 00:00:00') AS INTEGER)*1000 AS happened FROM island_weekly_activities WHERE visitor_key=? ORDER BY happened DESC,ref LIMIT ?",[visitor,limit]],
  ["SELECT 'travel' AS kind,p.token AS ref,p.title AS label,b.cast_at AS happened FROM trip_ballots b JOIN trip_proposals p ON p.token=b.proposal_token WHERE b.visitor_key=? ORDER BY happened DESC,ref LIMIT ?",[visitor,limit]],
  ["SELECT 'sports' AS kind,i.token AS ref,i.activity||' · '||r.choice AS label,r.updated_at AS happened FROM sports_replies r JOIN sports_invites i ON i.invite_key=r.invite_key WHERE r.guest_key=? ORDER BY happened DESC,ref LIMIT ?",[visitor,limit]],
  ["SELECT 'wheel' AS kind,mode AS ref,title AS label,drawn_at AS happened FROM island_wheel_draws WHERE visitor_key=? ORDER BY happened DESC,ref,title,id LIMIT ?",[visitor,limit]],
  ["SELECT 'pair' AS kind,token AS ref,CASE WHEN owner_answer IS NOT NULL AND partner_answer IS NOT NULL THEN 'done' ELSE 'open' END AS label,updated_at AS happened FROM island_pair_missions WHERE owner_key=? OR partner_key=? ORDER BY happened DESC,ref LIMIT ?",[visitor,visitor,limit]]
 ];
 const statements=queries.map(([query,params])=>db.prepare(query).bind(...params));
 const groups=typeof db.batch==='function'?await db.batch(statements):await Promise.all(statements.map(statement=>statement.all()));
 const earlier=(x,y)=>x===y?0:x<y?-1:1;
 const results=[{kind:'arrival',ref:'',label:'',happened:profile.joined_at},...groups.flatMap(x=>x.results)]
  .sort((a,b)=>b.happened-a.happened||earlier(a.kind,b.kind)||earlier(a.ref,b.ref)||earlier(a.label,b.label))
  .slice(page*30,limit);
 const items=results.slice(0,30).map(r=>{
  let label='',link='';
  if(r.kind==='arrival')label='領取島民證';
  if(r.kind==='practice'){const port=guestPorts.find(p=>p.id===r.ref);label=(port?.name||'島上練習')+' · 儲存回答';if(port)link='/dock/'+port.id+'?practice=1#practice-answer';}
  if(r.kind==='greeting'){label='榕樹廣場 · 發佈招呼';link='/dock/square#noticeboard';}
  if(r.kind==='weekly'){label='加入活動 · '+(weeklyActivities[r.ref]?.title||'島上活動');link='/dock/square#weekly-activities';}
  if(r.kind==='travel'){label='旅行提案 · '+r.label;link='/dock/travel';}
  if(r.kind==='sports'){const suffix=r.label.match(/ · (yes|maybe|no)$/);label='運動邀約 · '+(suffix?r.label.slice(0,suffix.index)+' · '+choices[suffix[1]]:r.label);}
  if(r.kind==='wheel'){label=(r.ref==='night'?'下班輪盤':'週末輪盤')+' · '+r.label;link='/dock/wheel';}
  if(r.kind==='pair'){label=r.label==='done'?'雙人任務 · 明信片已揭曉':'雙人任務 · 進行中';if(tokenPattern.test(r.ref))link='/dock/pair/'+r.ref;}
  return '<li><small>'+(r.kind==='weekly'?escape(r.label.replaceAll('-','/')+' 當週'):passportDate(r.happened))+'</small>'+(link?'<a href="'+link+'">'+escape(label)+' ↗</a>':'<span>'+escape(label)+'</span>')+'</li>';
 }).join('');
 return '<div class="dock-section" aria-label="我的島民紀錄"><p>這裡只有你看得到。逛頁面或翻護照不會留下紀錄；更新回答或投票會顯示最新內容。</p><ul class="passport-log">'+items+'</ul>'+
  ((page>0||results.length>30)?'<nav class="dock-actions" aria-label="紀錄分頁">'+(page>0?'<a href="/passport?records='+(page-1)+'#passport-records">← 較新紀錄</a>':'')+(results.length>30&&page<100?'<a href="/passport?records='+(page+1)+'#passport-records">較早紀錄 →</a>':'')+'</nav>':'')+'</div>';
}
const wheelModeLabels={night:'下班輪盤',weekend:'週末輪盤'};
const wheelColors=['#e9b39d','#9fbe9c','#f1d68b','#abc8d6','#e1b5c8','#c2c4e6'];
const wheelStyles=`
.wheel-form{gap:12px}
.wheel-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
.wheel-options label{display:flex;align-items:center;gap:5px;min-height:44px;padding:6px;border:1px solid #b8c6ae;background:#fff9ec;border-radius:8px;font-weight:650;font-size:.85rem;cursor:pointer}
.wheel-options label:has(:checked){background:#e7efdc;border-color:#4e7463}
.wheel-options input{flex:none;min-height:0;accent-color:#315b4c;margin:1px 3px}
.wheel-frame{background:#e9e9bd;border:1px solid #d4d6ae;border-radius:13px;padding:13px 9px 8px;scroll-margin-top:12px}
.wheel-variant{display:none;margin:0}
.wheel-form:has(#wheel-night:checked) .wheel-night,.wheel-form:has(#wheel-weekend:checked) .wheel-weekend{display:block}
.wheel-graphic{width:min(92%,236px);aspect-ratio:1;position:relative;margin:8px auto 12px;isolation:isolate}
.wheel-disc{position:absolute;inset:0;border:5px solid #fff4d6;border-radius:50%;background:conic-gradient(var(--wheel-colors));box-shadow:0 0 0 1px #8e906b,0 4px 12px #514f3340}
.wheel-pointer{position:absolute;z-index:2;left:50%;top:-7px;transform:translateX(-50%);width:20px;height:22px;background:#8c372c;clip-path:polygon(0 0,100% 0,50% 100%)}
.wheel-number{position:absolute;left:var(--x);top:var(--y);transform:translate(-50%,-50%);width:25px;height:25px;border:1px solid #4b59478a;border-radius:50%;background:#fff8de;color:#263d33;display:grid;place-items:center;font:700 .72rem/1 ui-monospace,monospace}
.wheel-hub{position:absolute;inset:37%;border:1px solid #a9a57a;border-radius:50%;background:#fff4d6;color:#315444;display:grid;place-items:center;font:800 clamp(.56rem,2.7vw,.82rem)/1.15 ui-monospace,monospace;text-align:center}
.wheel-legend{list-style:none;margin:0 0 5px;padding:0;display:grid;gap:3px}
.wheel-legend li{display:flex;gap:7px;align-items:baseline;font-size:.8rem;padding:2px 4px;border-radius:4px;color:#2f463c}
.wheel-legend span{font:700 .7rem/1 ui-monospace,monospace;color:#4c5e4e}
.wheel-submit{background:#2c5546;color:#fffaf0;border-color:#2c5546}
.wheel-submit:hover{background:#22463a}
.wheel-variant.is-drawn .wheel-disc{transform:rotate(var(--stop));animation:atlas-wheel-spin 1.5s cubic-bezier(.14,.72,.15,1) both}
.wheel-variant.is-drawn li.is-winner{animation:atlas-wheel-mark .25s 1.5s both}
.wheel-result{animation:atlas-wheel-result .3s 1.5s both}
.wheel-result p{margin:0 0 4px}
@keyframes atlas-wheel-spin{from{transform:rotate(0)}to{transform:rotate(var(--stop))}}
@keyframes atlas-wheel-result{from{visibility:hidden;opacity:0;transform:translateY(5px)}to{visibility:visible;opacity:1;transform:none}}
@keyframes atlas-wheel-mark{from{background:transparent}to{background:#fff6d4;font-weight:750}}
@media(prefers-reduced-motion:reduce){.wheel-variant.is-drawn .wheel-disc,.wheel-variant.is-drawn li.is-winner,.wheel-result{animation:none}.wheel-variant.is-drawn li.is-winner{background:#fff6d4;font-weight:750}}
`;
function wheelVariant(mode,result){
 const options=wheelChoices[mode],angle=360/options.length,won=result?.mode===mode?options.findIndex(([title])=>title===result.title):-1;
 const marks=options.map((_,index)=>{
  const theta=(index+.5)*angle*Math.PI/180;
  return '<span class="wheel-number" style="--x:'+(50+34*Math.sin(theta)).toFixed(2)+'%;--y:'+(50-34*Math.cos(theta)).toFixed(2)+'%">'+(index+1)+'</span>';
 }).join('');
 const legend=options.map(([name],index)=>'<li'+(index===won?' class="is-winner"':'')+'><span>'+(index+1)+'</span>'+escape(name)+'</li>').join('');
 const colors=options.map((_,index)=>wheelColors[index]+' '+index*angle+'deg '+(index+1)*angle+'deg').join(',');
 const stop=won<0?0:1080+(360-(won+.5)*angle)%360;
 return '<figure class="wheel-variant wheel-'+mode+(won>=0?' is-drawn':'')+'" style="--wheel-colors:'+colors+';--stop:'+stop+'deg"><div class="wheel-graphic" aria-hidden="true"><div class="wheel-pointer"></div><div class="wheel-disc">'+marks+'</div><div class="wheel-hub">ATLAS</div></div><figcaption><ol class="wheel-legend" aria-label="'+wheelModeLabels[mode]+'的選項">'+legend+'</ol></figcaption></figure>';
}
function wheelPage(result=null,error='',status=200){
 const selected=result?.mode==='weekend'?'weekend':'night';
 const idea=wheelChoices[selected].find(([title])=>title===result?.title);
 const modeInputs=Object.entries(wheelModeLabels).map(([key,label])=>'<label><input type="radio" id="wheel-'+key+'" name="mode" value="'+key+'"'+(key===selected?' checked':'')+' required>'+label+'</label>').join('');
 return dockPage('ISLAND WHEEL','熊熊活動輪盤','<style>'+wheelStyles+'</style><p>今晚想換個花樣，還是週末想約人出去？選一個時段再轉。</p>'+error+
  '<form class="wheel-form" method="post" action="/dock/wheel"><fieldset><legend>選擇時段</legend><div class="wheel-options">'+modeInputs+'</div></fieldset>'+
  '<div class="wheel-frame" id="'+(result?'wheel-result':'wheel-stage')+'">'+wheelVariant('night',result)+wheelVariant('weekend',result)+'</div>'+
  '<button class="wheel-submit" type="submit">'+(result?'再轉一次':'轉動輪盤')+'</button></form>'+
  (result?'<section id="wheel-announcement" class="dock-exercise wheel-result"><p>'+wheelModeLabels[selected]+'抽到</p><h2>'+escape(result.title)+'</h2>'+(idea?'<p>'+escape(idea[1])+'</p>':'')+'<div class="dock-actions"><a class="cta" href="'+squarePath+(tokenPattern.test(result.id||'')?'?draw='+result.id+'#new-meetup':'#meetups')+'">帶這個點子去開團</a><a href="/passport#passport-records">查看護照紀錄 ↗</a></div></section>':''),
  status);
}

async function islandWheel(request,db,url,visitor){
 if(request.method==='POST'){
  const parsed=await dockForm(request,url,600),mode=parsed.fields?.get('mode');
  if(!Object.hasOwn(wheelChoices,mode))return wheelPage(null,dockError(parsed.error||'請選擇下班或週末。'),parsed.status||400);
  const last=await db.prepare('SELECT title FROM island_wheel_draws WHERE visitor_key=? AND mode=? ORDER BY drawn_at DESC LIMIT 1').bind(visitor,mode).first();
  const pool=wheelChoices[mode].filter(([title])=>title!==last?.title), [title]=pool[Math.floor(Math.random()*pool.length)], id=randomToken();
  await db.prepare('INSERT INTO island_wheel_draws(id,visitor_key,mode,title,drawn_at) VALUES(?,?,?,?,?)').bind(id,visitor,mode,title,Date.now()).run();
  return dockRedirect('/dock/wheel?draw='+id+'#wheel-result');
 }
 const id=url.searchParams.get('draw'),result=tokenPattern.test(id||'')?await db.prepare('SELECT id,title,mode FROM island_wheel_draws WHERE id=? AND visitor_key=?').bind(id,visitor).first():null;
 return wheelPage(result);
}
async function islandPair(request,db,url,visitor,token){
 const path=token?'/dock/pair/'+token:'/dock/pair';
 let error='',status=200;
 if(!token){
  if(request.method==='POST'){
   const parsed=await dockForm(request,url,600),prompt=parsed.fields?.get('prompt');
   if(!Object.hasOwn(pairPrompts,prompt)){error=dockError(parsed.error||'請選一道題目。');status=parsed.status||400;}
   else{
    const key=randomToken(),now=Date.now();
    await db.prepare('INSERT INTO island_pair_missions(token,owner_key,prompt,created_at,updated_at) VALUES(?,?,?,?,?)').bind(key,visitor,prompt,now,now).run();
    return dockRedirect(path+'/'+key);
   }
  }
  const opts=Object.entries(pairPrompts).map(([key,label])=>'<option value="'+key+'">'+label+'</option>').join('');
  return dockPage('SEALED POSTCARD','熊熊雙人任務','<p>挑一道題，把連結傳給一個朋友。兩個人各寫一句話，等雙方都交件後一起揭曉。</p>'+error+
   '<form method="post" action="'+path+'"><label>任務題目<select name="prompt">'+opts+'</select></label><button type="submit">建立雙人任務</button></form><p><a href="/passport#passport-records">回護照找我參加的任務 ↗</a></p>',status);
 }
 let row=await db.prepare('SELECT owner_key,partner_key,prompt,owner_answer,partner_answer FROM island_pair_missions WHERE token=?').bind(token).first();
 if(!row||!Object.hasOwn(pairPrompts,row.prompt)||(row.partner_key&&row.owner_key!==visitor&&row.partner_key!==visitor))return dockPage('SEALED POSTCARD','找不到可參加的任務','<p>連結可能無效，或兩個位子都有人了。</p>',404);
 if(request.method==='POST'){
  const parsed=await dockForm(request,url,3400),action=parsed.fields?.get('action');
  if(!parsed.fields){error=dockError(parsed.error);status=parsed.status;}
  else if(action==='join'&&!row.partner_key&&row.owner_key!==visitor){
   const change=await db.prepare('UPDATE island_pair_missions SET partner_key=?,updated_at=? WHERE token=? AND partner_key IS NULL AND owner_key<>?').bind(visitor,Date.now(),token,visitor).run();
   if(change.meta.changes)return dockRedirect(path);
   return dockPage('SEALED POSTCARD','這張邀請已有人接受','<p>請向朋友索取另一張邀請。</p>',409);
  }else if(action==='answer'&&(row.owner_key===visitor||row.partner_key===visitor)){
   const answer=parsed.fields.get('answer')?.trim();
   if(!cap(answer,240)){error=dockError('請寫下 1 到 240 個字元。');status=400;}
   else{
    const col=row.owner_key===visitor?'owner_answer':'partner_answer';
    await db.prepare('UPDATE island_pair_missions SET '+col+'=?,updated_at=? WHERE token=? AND (owner_key=? OR partner_key=?) AND '+col+' IS NULL').bind(answer,Date.now(),token,visitor,visitor).run();
    return dockRedirect(path);
   }
  }else{error=dockError('這次操作沒有送出，請確認任務狀態。');status=400;}
 }
 const owner=row.owner_key===visitor,member=owner||row.partner_key===visitor;
 const own=owner?row.owner_answer:row.partner_answer,other=owner?row.partner_answer:row.owner_answer;
 let body='<section class="dock-exercise"><h2>'+pairPrompts[row.prompt]+'</h2></section>'+error;
 if(!member)body+='<p>一位島民邀請你交換明信片。只有兩位參加者都交件後才會揭曉。</p><form method="post"><button name="action" value="join">接受邀請</button></form>';
 else{
  if(owner&&!row.partner_key)body+='<label class="pair-share">把邀請連結傳給一位朋友<input readonly value="'+escape(url.origin+path)+'"></label>';
  if(own&&other)body+='<p class="notice">雙人揭曉章 · 兩張明信片都到了！</p><article class="dock-exercise"><h2>我的明信片</h2><p class="travel-note">'+escape(own)+'</p></article><article class="dock-exercise"><h2>對方的明信片</h2><p class="travel-note">'+escape(other)+'</p></article><a href="/passport#passport-records">查看護照紀錄 ↗</a>';
  else if(own)body+='<p class="notice">你的明信片已封存，等對方交件後回來揭曉。</p>';
  else body+='<form method="post" class="dock-practice"><label>我的明信片<textarea name="answer" maxlength="240" rows="5" required></textarea></label><button name="action" value="answer">封存明信片</button></form>';
 }
 return dockPage('SEALED POSTCARD','熊熊雙人任務',body,status);
}

async function islandDock(request,env,url){
 const {DB:db}=env;
 const portId=url.pathname.slice(6);let port=guestPorts.find(p=>p.id===portId);
 const pairToken=/^pair\/([a-f0-9]{48})$/.exec(portId)?.[1];
 const pair=portId==='pair'||Boolean(pairToken),wheel=portId==='wheel';
 const square=portId==='square', journal=portId==='journal', method=request.method;
 if(!port&&!square&&!journal&&!wheel&&!pair)return harborHtml('<h1>找不到這座島</h1><p><a href="/dock">回訪客碼頭 ↗</a></p>',404);
 if(method!=='GET'&&!((wheel||pair||square||port?.question||port?.id==='sports')&&method==='POST'))return harborHtml('<h1>無法開啟這一頁</h1>',405);
 const visitor=islanderOf(request);
 const profile=visitor?await readPassportProfile(db,visitor):null;
 if(port?.id==='sports'&&method==='GET'&&!profile)return publicPlacePage(port,profile,'<section class="dock-exercise"><h2>朋友的運動邀約</h2><p>登入原本的島民證，就能開啟朋友分享的運動邀約。</p>'+memberLinks('/dock/sports')+'</section>');
 if(townPlaces[port?.id]&&method==='GET'&&!url.searchParams.has('practice'))return townPlacePage(port,profile);
 if(port?.question&&url.searchParams.has('practice'))port={...privateExercises[port.id]};
 if(!profile){
  if(port?.question&&method==='GET')return dockPage('ISLAND '+port.n,port.name,worldNavLink('/islands','← 回熊熊島嶼')+
   '<section class="dock-exercise"><h2>'+port.question+'</h2><details><summary>看練習提示</summary><p>'+port.guide+'</p></details></section>'+memberLinks(url.pathname+url.search));
  if(square)return harborHtml('<style>'+dockStyles+squareStyles+'</style><header class="sq-intro"><span class="trip-tag">JADE HARBOUR / TOWN SQUARE</span><h1>榕樹廣場</h1><p>認識島上的熊熊、自己開團找同伴，或轉輪盤決定下一站。</p></header>'+
   '<section class="sq-section"><h2>用島民證進廣場</h2>'+memberLinks(squarePath+(tokenPattern.test(url.searchParams.get('draw')||'')?'?draw='+url.searchParams.get('draw'):''))+'</section><p><a class="cta" href="'+neighborPath+'">先和港城熊熊聊聊 ↗</a></p>'+worldNavLink('/islands','← 回熊熊島嶼'),method==='POST'?403:200);
  return harborHtml(dockHeader('VISITOR DOCK',port?.name||(wheel?'熊熊活動輪盤':'訪客碼頭'))+
   worldNavLink('/islands','← 回熊熊島嶼')+memberLinks(url.pathname),method==='POST'?403:200);
 }
 if(wheel)return await islandWheel(request,db,url,visitor);
 if(pair)return await islandPair(request,db,url,visitor,pairToken);
 if(square)return await islandSquare(request,db,url,visitor,profile);
 if(journal)return await islandJournal(db,visitor);
 if(port?.question)return await islandPractice(request,db,url,visitor,privateExercises[port.id]||port);
 let body='', error='',status=200;
 if(port.id==='sports'){
  if(method==='POST'){
   if(!isOwnReplyForm(request,url)||!(request.headers.get('Content-Type')||'').startsWith('application/x-www-form-urlencoded'))return harborHtml('<h1>無法開啟邀約</h1><p><a href="/dock/sports">回運動島再試一次 ↗</a></p>',403);
   const raw=await request.text();
   if(raw.length>1800)return harborHtml('<h1>邀約連結太長</h1><p><a href="/dock/sports">回運動島再試一次 ↗</a></p>',400);
   try{
    const invite=new URL(new URLSearchParams(raw).get('invite')?.trim()||'');
    if(invite.origin!==url.origin||invite.username||invite.password||!invite.pathname.startsWith('/r/')||!tokenPattern.test(invite.pathname.slice(3)))throw Error();
    return new Response(null,{status:303,headers:{...headers,Location:invite.pathname}});
   }catch{status=400;error='<p class="alert" role="alert">這不是熊熊港城的運動邀約連結，請貼上朋友傳來的完整網址。</p>';}
  }
  body='<p><a class="cta" href="/dock/square#meetups">到榕樹廣場找球伴或開團 ↗</a></p><p>收到朋友的揪團邀約了嗎？貼上他分享的連結，就能查看活動時間、地點和回覆。</p>'+error+'<form method="post"><label>運動邀約連結<input name="invite" type="url" inputmode="url" placeholder="https://…" maxlength="500" required></label><button type="submit">開啟邀約</button></form>';
 }else if(port.id==='travel'){
  const {results}=await db.prepare('SELECT p.token,p.title,p.closed FROM trip_ballots b JOIN trip_proposals p ON p.token=b.proposal_token WHERE b.visitor_key=? ORDER BY b.cast_at DESC LIMIT 10').bind(visitor).all();
  const trips=results.filter(p=>tokenPattern.test(p.token)).map(p=>'<li><a href="/trip/'+p.token+'">'+escape(p.title)+'</a>'+(p.closed===1?' · 已結束':'')+'</li>').join('');
  body='<section class="dock-activity"><h2>我參加過的提案</h2>'+(trips?'<ul>'+trips+'</ul>':'<p>你還沒有參加過旅行提案。收到朋友分享的提案連結後，可以直接去投票。</p>')+'</section>';
 }
 return port.id==='sports'?publicPlacePage(port,profile,body,status):dockPage('ISLAND '+port.n,port.name,body,status);
}

const estateStyles=`
.estate-hero{display:block;width:100%;height:auto;border-radius:12px;background:#d9eee7}
.estate-kicker{letter-spacing:.13em;font-size:.75rem;font-weight:700;color:#7e5745}
.estate-deed,.estate-wardrobe,.estate-gate{margin:16px 0;padding:13px;border-radius:11px;background:#f6e6de;border:1px solid #d4b8a5;overflow-wrap:anywhere}
.estate-deed h2,.estate-wardrobe h2,.estate-gate h2{font-size:1.18rem;margin:3px 0}
.estate-wardrobe{display:grid;grid-template-columns:minmax(62px,95px) minmax(0,1fr);gap:10px;align-items:center}
.estate-wardrobe p{margin:4px 0}
.estate-destinations{display:grid;gap:7px;padding:0;list-style:none}
.estate-destinations a{display:block;padding:10px 12px;border-radius:8px;border:1px solid #b2c4b6;background:#edf3e7;text-decoration:none}
.estate-destinations strong,.estate-destinations span{display:block}.estate-destinations span{font-size:.83rem}
.estate-flight{position:relative;overflow:hidden;height:112px;border-radius:12px;background:linear-gradient(#c8e0ec,#ecf4ec);margin:12px 0}
.estate-flight:before{content:"";position:absolute;top:60px;left:10%;right:10%;border-top:2px dashed #537f7f}
.estate-plane{position:absolute;width:52px;height:37px;top:38px;left:13%;animation:estate-fly 1.35s cubic-bezier(.25,.5,.5,1) forwards}
@keyframes estate-fly{to{left:73%;top:17px}}
@media(prefers-reduced-motion:reduce){.estate-plane{animation:none;left:70%}}

`;

const founderFolioStyles=`
:root{color:#392b2e;background:#eee6e1}
main{width:min(100%,620px);background:#fffaf6;border-color:#dfcdc4;padding:clamp(15px,5vw,36px)}
.brand,.folio-label{color:#795451}.folio-heading{font-weight:550;letter-spacing:.02em;margin:12px 0 20px}
.founder-folio{border:1px solid #cfb1a4;overflow:hidden;border-radius:9px}
.folio-cover{isolation:isolate;position:relative;overflow:hidden;padding:clamp(12px,4vw,26px);background:linear-gradient(116deg,#f8e7df 3%,#e7c6c6 71%,#ead2c3)}
.folio-top,.folio-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;font:650 clamp(.55rem,2.1vw,.71rem)/1.4 ui-monospace,monospace;letter-spacing:.08em;color:#5f3f3d}
.folio-top{padding-bottom:9px;border-bottom:1px solid #ad82747d}.folio-foot{padding-top:9px;border-top:1px solid #ad82747d}
.folio-mark{position:absolute;z-index:-1;right:1%;top:7%;font:italic 260px/.85 Georgia,serif;letter-spacing:-.12em;color:#fffaf6;opacity:.33;user-select:none}
.folio-identity{display:grid;grid-template-columns:minmax(0,1fr) minmax(64px,34%);align-items:center;gap:6px;padding:17px 0}
.folio-label{font-size:.65rem;letter-spacing:.09em;font-weight:750}.folio-identity h2{margin:4px 0;font:400 clamp(1.7rem,6.6vw,3.2rem)/1.03 Georgia,"Noto Serif TC",serif;overflow-wrap:anywhere}
.folio-identity strong{font:700 clamp(.76rem,2.7vw,.93rem)/1.3 ui-monospace,monospace;letter-spacing:.045em;white-space:nowrap}.folio-identity p{font-size:.78rem;margin:7px 0 0}
.folio-portrait{display:grid;justify-items:center}.folio-portrait svg{width:100%;max-width:128px}
.folio-stamps{background:#fffbf6}.folio-stamps summary{cursor:pointer;font-size:.87rem;font-weight:650;padding:11px 15px;color:#684541}
.folio-stamps ul{list-style:none;padding:0 15px;margin:0}.folio-stamps li{border-top:1px solid #e7d7cc;display:grid;gap:2px;padding:9px 0;font-size:.86rem;overflow-wrap:anywhere}
.folio-stamps li span{color:#795451;font:650 .65rem/1.4 ui-monospace,monospace;letter-spacing:.09em}
.folio-actions{display:flex;gap:8px 16px;align-items:center;flex-wrap:wrap;margin:14px 0 26px;font-size:.88rem}.folio-actions a{color:#6b4547}.folio-actions .cta{color:#fff8f1;background:#634449}
.founder-wardrobe{margin:16px 0 8px;scroll-margin-top:14px}.founder-wardrobe legend{font-size:1.27rem;margin:0}.founder-wardrobe>p{font-size:.84rem;margin:4px 0 10px;color:#654c4b}
.founder-looks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.founder-look{position:relative;cursor:pointer;min-width:0;display:grid;align-content:start;gap:0;border:1px solid #decac1;border-radius:7px;overflow:hidden;background:#fffdfa}
.founder-look:has(:checked){border-color:#986575;outline:1px solid #986575;background:#fbefed}.founder-look:has(:focus-visible){outline:2px solid #875564;outline-offset:2px}
.founder-look input{position:absolute;top:8px;right:8px;width:15px;height:15px;min-height:0;margin:0;accent-color:#845265}
.founder-look-art{position:relative;display:grid;justify-items:center;background:var(--look-paper);padding:8px 4px 2px}.founder-look-art svg{width:min(100%,94px)}.look-number{position:absolute;left:8px;top:8px;color:#6e4946;font:650 .63rem/1 ui-monospace,monospace}
.founder-look-info{display:grid;gap:2px;padding:7px 8px 10px;font-size:.72rem;color:#624d4d;overflow-wrap:anywhere}.founder-look-info strong{font-size:.86rem;color:#392b2e;margin-bottom:2px}
@media(max-width:360px){.folio-mark{font-size:190px}.folio-top,.folio-foot{letter-spacing:.04em}}
`;
const founderLooks={
 dior:{name:'玫瑰蒙田',wear:'玫瑰色 Dior 洋裝',shoes:'象牙白瑪莉珍跟鞋',bag:'Lady Dior 菱格包',paper:'#f5dedc',
  clothes:'<path d="M42 76 60 83 78 76l-5 22 16 29q-29 15-58 0l16-29z" fill="#bf687d" stroke="#824554" stroke-width="2"/><path d="M46 99q13 7 28 0m-18 6-9 22m18-22 10 22" stroke="#f0b9c7" stroke-width="2" fill="none"/>',
  feet:'<path d="M41 134q9-3 14 2v7H36v-4zm27 2q5-5 14-2l6 5v4H68z" fill="#fff1da" stroke="#846353" stroke-width="1.5"/><path d="M45 134l7 6m22 0 5-6" stroke="#bf687d" stroke-width="2"/>',
  purse:'<path d="M91 107v-5q0-5 7-5t7 5v5" stroke="#603946" stroke-width="3" fill="none"/><rect x="87" y="106" width="24" height="21" rx="4" fill="#60404a"/><path d="m88 115 10-8 12 8m-22 6 10-8 12 8m-16-13 13 12m-17-9 14 13" stroke="#b38280" fill="none"/><circle cx="109" cy="111" r="2" fill="#efc78d"/>'},
 'harbor-navy':{name:'海港藍調',wear:'海軍藍西裝與奶油白長褲',shoes:'奶油白樂福鞋',bag:'海軍藍托特包',paper:'#dde8ec',
  clothes:'<path d="M42 103h35l2 28-13 1-6-20-5 20-14-1z" fill="#f5e4c7" stroke="#bfa58d" stroke-width="1.4"/><path d="M39 77h42l6 13-8 7-2 13H43l-2-13-8-7z" fill="#3b516b" stroke="#27364b" stroke-width="2"/><path d="m47 77 13 23 13-23z" fill="#fff0d8"/><path d="M60 99v10" stroke="#f0c68c" stroke-width="2"/>',
  feet:'<path d="M39 135h15l1 8H34v-4zm28 0h16l5 4v4H67z" fill="#fff0d8" stroke="#786457" stroke-width="1.5"/><path d="M42 137h8m21 0h8" stroke="#68748a" stroke-width="2"/>',
  purse:'<path d="M91 106v-8q0-6 8-6t8 6v8" stroke="#34475d" stroke-width="3" fill="none"/><path d="M86 104h26l-3 24H90z" fill="#3d526e" stroke="#293c55" stroke-width="1.5"/><path d="M92 107v17m14-17v17" stroke="#a0adbb"/>'},
 'runway-black':{name:'午夜登機',wear:'黑色不對稱晚裝',shoes:'金扣尖頭鞋',bag:'香檳金手拿包',paper:'#eadfe8',
  clothes:'<path d="m44 82 31-8 4 9-8 17 18 29-16 4-11-12-6 13-26-7 16-28z" fill="#433942" stroke="#30252f" stroke-width="2"/><path d="m71 79-15 23 5 17" stroke="#b499a9" stroke-width="2" fill="none"/><circle cx="72" cy="80" r="3" fill="#f0ca86"/>',
  feet:'<path d="M39 135h16v8H32zm28 0h16l7 8H67z" fill="#47363f" stroke="#271f27" stroke-width="1.5"/><path d="M45 137h4m24 0h4" stroke="#efc789" stroke-width="2"/>',
  purse:'<path d="M86 101h27v15H86z" fill="#d3a869" stroke="#826140" stroke-width="1.5"/><path d="m86 101 14 9 13-9" fill="#f0d39d" stroke="#987349"/><circle cx="100" cy="109" r="1.5" fill="#674938"/>'},
 'weekend-linen':{name:'南法週末',wear:'米白亞麻洋裝',shoes:'焦糖色平底涼鞋',bag:'藤編提籃',paper:'#eee7d8',
  clothes:'<path d="m43 76 17 8 17-8 8 13-10 6-2 7 14 25q-28 12-55 0l14-26-2-7-11-5z" fill="#f4e8cd" stroke="#a98f70" stroke-width="2"/><path d="m47 100 25 0m-20 9-5 17m22-17 5 17" stroke="#c6a482" stroke-width="1.8"/><path d="M61 100q-10 4 0 8 9-3 0-8z" fill="#a37957"/>',
  feet:'<path d="M39 137h16v6H35zm29 0h15l5 6H68z" fill="#d5a071" stroke="#795740" stroke-width="1.5"/><path d="m43 134 9 6m-8 0 7-6m19 0 9 6m-8 0 7-6" stroke="#986342" stroke-width="2"/>',
  purse:'<path d="M90 108v-6q0-7 8-7t8 7v6" fill="none" stroke="#925f41" stroke-width="3"/><path d="M84 106h29l-5 22H90z" fill="#d4aa72" stroke="#9f754c" stroke-width="1.5"/><path d="M87 112h24m-23 5h22m-20 5h18m-15-14 1 18m5-18v19m6-19-1 18" stroke="#ac8053"/>'},
};
const lookKey=key=>Object.hasOwn(founderLooks,key)?key:'dior';
function coutureAvatar(bear,outfit='dior',decorative=false){
 const {fur,inner,muzzle}=harborBears[bear]||harborBears.honey;
 const look=founderLooks[lookKey(outfit)];
 return animalize('<svg class="bear-art" viewBox="0 0 124 150" '+(decorative?'aria-hidden="true"':'role="img" aria-label="'+look.wear+'、'+look.shoes+'、'+look.bag+'"')+'><ellipse cx="61" cy="145" rx="39" ry="3" fill="#563c3b" opacity=".12"/><circle cx="32" cy="29" r="15" fill="'+fur+'"/><circle cx="87" cy="29" r="15" fill="'+fur+'"/><circle cx="32" cy="29" r="8" fill="'+inner+'"/><circle cx="87" cy="29" r="8" fill="'+inner+'"/><path d="M38 80Q29 87 24 105M83 80Q89 86 96 105" fill="none" stroke="'+fur+'" stroke-width="10" stroke-linecap="round"/><path d="M48 125v11m25-11v11" stroke="'+fur+'" stroke-width="12" stroke-linecap="round"/>'+look.clothes+look.feet+look.purse+'<ellipse cx="60" cy="51" rx="37" ry="31" fill="'+fur+'"/><ellipse cx="60" cy="61" rx="16" ry="11" fill="'+muzzle+'"/><path d="M55 57q5-4 10 0-1 5-5 5t-5-5zm-11-9v2m31-2v2" fill="#352d2b" stroke="#352d2b" stroke-width="3.5" stroke-linecap="round"/></svg>',bear);
}
function founderWardrobe(bear,selected){
 return '<fieldset id="founder-wardrobe" class="founder-wardrobe"><legend>島主衣帽間</legend><p>選一套完整造型，儲存後會顯示在護照和私人島。</p><div class="founder-looks">'+Object.entries(founderLooks).map(([key,look],i)=>'<label class="founder-look" style="--look-paper:'+look.paper+'"><input type="radio"'+choiceName('outfit',key)+' required'+(selected===key?' checked':'')+'><span class="founder-look-art"><span class="look-number" aria-hidden="true">0'+(i+1)+'</span>'+coutureAvatar(bear,key,true)+'</span><span class="founder-look-info"><strong>'+look.name+'</strong><span>'+look.wear+'</span><span>'+look.shoes+'</span><span>'+look.bag+'</span></span></label>').join('')+'</div></fieldset>';
}
function founderPassportSpread(profile,joined,image){
 const look=founderLooks[lookKey(profile.outfit)];
 return '<article class="founder-folio" aria-label="創辦護照封面"><div class="folio-cover"><div class="folio-top"><span>ATLAS / JADE COVE</span><span>PRIVATE EDITION</span></div><div class="folio-mark" aria-hidden="true">00</div><div class="folio-identity"><div><span class="folio-label">創辦島民 / FOUNDER</span><h2>'+escape(profile.nickname)+'</h2><strong>BEAR-0000</strong><p>翡翠灣 · '+look.name+'</p></div><div class="folio-portrait">'+memberAvatar(profile)+'</div></div><div class="folio-foot"><span>登島日 '+joined+'</span><span>001 / 001</span></div></div></article>'+image+'<div class="folio-actions"><a href="#founder-wardrobe">換一套造型 ↓</a></div>';
}
const jadeStops=[
 ['hotel','海崖飯店','THE COVE HOTEL','住宿',445,244,'推開海景套房的陽台，就能看到船駛進灣內。從有拱廊的中庭出發，散步兩分鐘就到泳池。','海景露台','橄欖樹中庭','客房早餐'],
 ['pool','無邊際泳池','THE HORIZON POOL','海岸',600,264,'泳池貼著海崖往外延伸。傍晚靠在池邊，水線和遠方的海平面會疊在一起。','夕陽池畔','日光躺椅','海風吧台'],
 ['beach','貝殼海灘','SHELL BEACH','海岸',790,475,'一段藏在礁石後的沙灘。沿著木棧道走下去，白色浪花會一層一層退回海裡。','木棧道','日光傘','淺水灣'],
 ['forest','雪松森林','CEDAR WOODS','步道',279,350,'小徑從海崖往林子裡彎，穿過蕨類和雪松。清晨來走，能看到樹影在地上晃。','環形林徑','林間長椅','觀景坡'],
 ['yoga','林間瑜伽教室','THE FOREST STUDIO','身體',378,453,'把瑜伽墊攤在玻璃亭裡，門一推開就是森林。早上練流動，傍晚適合做一堂慢伸展。','晨間流動','黃昏伸展','玻璃露台'],
 ['museum','潮汐美術館','TIDELINE GALLERY','藝文',650,385,'白牆展廳面向潮水，以攝影、海岸地景與當代雕塑為主題。採光天井的光會慢慢移過展牆。','海岸攝影','戶外雕塑','採光天井'],
 ['boutique','拱廊精品店','THE ARCADE','選物',514,384,'從城堡下來會經過一排拱窗。店裡陳列洋裝、皮革手袋和旅行配件；晚上櫥窗亮起暖光。','洋裝','皮革手袋','旅行選物'],
 ['castle','翡翠城堡','CHÂTEAU DE JADE','地標',554,135,'城堡坐在島的最高處，兩座圓塔之間有一座花園。天黑後走上露台，可以俯瞰海灣和燈火。','塔樓','玫瑰花園','海灣露台'],
 ['chef','暮光私廚','TABLE DU CRÉPUSCULE','餐桌',731,246,'花園深處只留一張餐桌。主廚依季節換菜，想像今晚先喝一口清湯，再等爐火端上主菜。','季節套餐','開放式廚房','花園餐桌'],
 ['omakase','潮前 Omakase','SHIOMAE COUNTER','餐桌',850,350,'面海吧台只有六席。每日魚貨決定上菜順序，從清爽的白身魚，到最後一貫微炙的握壽司。','每日魚貨','六席吧台','主廚搭配'],
];
const jadeNo=i=>String(i+1).padStart(2,'0');
const jadeTree=(x,y,s=1)=>'<use href="#jade-tree" transform="translate('+x+' '+y+') scale('+s+')"/>';
function jadeArt(){
 const woods=[[248,286,1.05],[281,273,.8],[318,291,1.05],[225,312,.76],[263,323,1.13],[313,321,.79],[342,334,1.13],[227,350,.86],[248,381,.78],[292,373,1.1],[329,386,.88],[268,406,.76],[303,429,1],[350,402,.72],[382,332,.66],[396,357,.75],[437,334,.68],[404,404,.6],[720,323,.72],[748,299,.68],[791,290,.66],[705,411,.84],[683,431,.63],[583,461,.65],[634,483,.73],[514,482,.8],[473,475,.76],[447,508,.63],[572,200,.64],[598,187,.8],[635,187,.7],[683,197,.84],[455,194,.66],[480,174,.65],[820,398,.65]];
 const windows=(xs,y)=>xs.map(x=>'<rect class="jade-window" x="'+x+'" y="'+y+'" width="10" height="14" rx="3"/>').join('');
 const arch=(x,y)=>'<path class="jade-window" d="M'+x+' '+(y+17)+'v-10a6 6 0 0 1 12 0v10z"/>';
 const tower=(x,y)=>'<g transform="translate('+x+' '+y+')"><path fill="#9b9e8d" d="M13 2 37-8v62L13 65z"/><path fill="#e8d8b5" d="M-13 0h26v65h-26z"/><path fill="#b47d6b" d="M-18 1 0-26 18 1 10 6h-24z"/><path fill="#855e55" d="M18 1 37-8 12-36 0-26z"/>'+arch(-6,24)+'<path d="M0-26v-18l15 4-15 5" fill="#a95858" stroke="#855f56"/></g>';
 return '<svg class="jade-map-art" viewBox="0 0 1080 620" role="img" aria-label="翡翠灣：森林環抱著海崖飯店，城堡在山坡上，餐廳與沙灘面向海灣"><defs>'+
 '<linearGradient id="jade-sea" x2=".85" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="#86b8ab"/><stop offset=".56" stop-color="#4f9897"/><stop offset="1" stop-color="#256f77"/></linearGradient>'+
 '<linearGradient id="jade-land" x2=".75" y2="1"><stop stop-color="#d9dbad"/><stop offset=".56" stop-color="#b4be88"/><stop offset="1" stop-color="#809c78"/></linearGradient>'+
 '<linearGradient id="jade-sand" x2="0" y2="1"><stop stop-color="#f3e2b6"/><stop offset="1" stop-color="#d6b688"/></linearGradient>'+
 '<pattern id="jade-contour" width="65" height="42" patternUnits="userSpaceOnUse"><path d="M-20 23q28-18 52-4t55-4" fill="none" stroke="#eef0c6" stroke-width="1" opacity=".35"/></pattern>'+
 '<pattern id="jade-sea-ripples" width="114" height="62" patternUnits="userSpaceOnUse"><path d="M6 24q9-4 20 0m28 25q14-4 23-1m17-35h10" fill="none" stroke="#d9f0da" stroke-linecap="round" opacity=".37"/></pattern>'+
 '<g id="jade-tree"><ellipse cx="9" cy="7" rx="15" ry="5" fill="#335a4d" opacity=".19"/><path d="M-2-13h4V7h-4z" fill="#7b6351"/><path d="M0-35 13-8 7-9 16 2H-15l7-11-5 1z" fill="#436c55"/><path d="M0-35-13-8l5-1-7 11H0z" fill="#719069"/></g>'+
 '<g id="jade-cypress"><path d="M0-19v22" stroke="#7d7258" stroke-width="2"/><ellipse cy="-12" rx="4" ry="13" fill="#466f57"/></g>'+
 '<g id="jade-umbrella"><ellipse cx="8" cy="8" rx="13" ry="4" fill="#9d7e65" opacity=".23"/><path d="M0-8v21" stroke="#8c7762" stroke-width="2"/><path d="M-16 1q16-20 32 0z" fill="#f2e9ca"/><path d="M-8 1q8-17 16 0z" fill="#ce8a79"/></g>'+
 '</defs><path class="jade-water" fill="url(#jade-sea)" d="M0 0h1080v620H0z"/><path fill="url(#jade-sea-ripples)" d="M0 0h1080v620H0z"/>'+
 '<g class="jade-tide" fill="none" stroke="#d9ecda" stroke-linecap="round"><path opacity=".24" stroke-width="2" d="M28 126q40-10 71 0m-31 351q34-8 67 0m787-305q37-9 76 0m-105 393q39-7 72 1M165 83q30-5 52 2m744 313q30-7 59 1"/><path opacity=".34" stroke-dasharray="9 20" d="M89 423C6 319 134 163 256 142M824 163q154 39 179 174m-120 159q-60 80-157 103"/></g>'+
 '<g fill="#b8cb9a" stroke="#e3ddac" stroke-width="5"><path d="M89 343q-38-12-30-34 10-25 40-21 21 3 24 27t-34 28z"/><path d="M1000 450q-29-6-22-21t30-17q28 7 20 25t-28 13z"/></g>'+jadeTree(95,318,.65)+
 '<path fill="#286f72" opacity=".55" d="M132 402Q74 328 162 242l106-48q8-80 112-96 65-10 113-45 124-23 198 33 56 41 147 49 87 18 108 91 63 44 36 111-8 38-69 73-27 61-90 91-37 38-135 35-61 46-154 30-64 27-134-2-80 8-137-36-86 3-125-56-48-5-65-36z" transform="translate(0 20)"/>'+
 '<path fill="#ceb891" stroke="#e4d5ad" stroke-width="12" stroke-linejoin="round" d="M132 402Q74 328 162 242l106-48q8-80 112-96 65-10 113-45 124-23 198 33 56 41 147 49 87 18 108 91 63 44 36 111-8 38-69 73-27 61-90 91-37 38-135 35-61 46-154 30-64 27-134-2-80 8-137-36-86 3-125-56-48-5-65-36z"/>'+
 '<path fill="url(#jade-land)" d="M139 385Q96 322 173 253l108-50q7-75 105-92 61-10 110-44 113-22 187 32 55 41 150 50 78 18 99 83 58 40 31 97-9 31-64 61-29 65-91 94-41 36-136 33-64 44-149 28-63 22-133-4-76 7-132-35-78 1-117-54-46-5-62-35z"/>'+
 '<path fill="url(#jade-contour)" d="M139 385Q96 322 173 253l108-50q7-75 105-92 61-10 110-44 113-22 187 32 55 41 150 50 78 18 99 83 58 40 31 97-9 31-64 61-29 65-91 94-41 36-136 33-64 44-149 28-63 22-133-4-76 7-132-35-78 1-117-54-46-5-62-35z"/>'+
 '<path d="M201 379q-46-83 52-121 72-22 120 39 23 72-43 129-84 53-129-47zM384 172q100-94 215-69 69 18 79 55-38 64-138 57-105-2-156-43z" fill="#78966f" opacity=".39"/>'+
 '<path d="M677 492q54-13 70-51 55-14 101-66 49-16 54 8-38 69-98 105-58 34-127 30z" fill="url(#jade-sand)"/>'+
 '<g fill="none" stroke="#fff3d6" stroke-linecap="round"><path class="jade-foam" d="M901 407q-40 72-107 101-63 25-111 18" stroke-width="4"/><path class="jade-foam foam-next" d="M911 415q-41 68-108 102-49 22-97 21" opacity=".58" stroke-width="2"/></g>'+
 '<path fill="none" stroke="#80936e" stroke-width="17" opacity=".42" d="M287 338Q360 279 437 261t131-94M443 263q71 16 155 29t127-21q79-9 129 92M293 340q-21 83 86 117 67 20 140-62 64-49 135 5t136 75"/>'+
 '<path fill="none" stroke="#eaddb6" stroke-width="12" stroke-linecap="round" d="M287 336Q360 277 437 259t131-94M443 261q71 16 155 29t127-21q79-9 129 92M293 338q-21 83 86 117 67 20 140-62 64-49 135 5t136 75"/>'+
 '<path class="jade-trail" fill="none" stroke="#ad8f62" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 9" d="M287 336Q360 277 437 259t131-94M443 261q71 16 155 29t127-21q79-9 129 92M293 338q-21 83 86 117 67 20 140-62 64-49 135 5t136 75"/>'+
 '<path d="M494 151 570 113 633 149 553 193z" fill="#e3d1a9"/><path d="M500 152 569 121 620 149 550 181z" fill="#b1ba83"/>'+
 '<g class="jade-building" aria-hidden="true"><path d="M521 126 570 100 608 124 554 150z" fill="#b7806a"/><path d="M521 126 554 143v37l-33-18z" fill="#e4d6b4"/><path d="M554 143 608 120v36l-54 24z" fill="#a9a28e"/>'+tower(521,130)+tower(583,117)+'<path d="M554 164v-10a7 7 0 0 1 14-4v10z" class="jade-window"/></g>'+
 '<g class="jade-building"><path d="M380 227 469 195 518 220 428 252z" fill="#c68f77"/><path d="M380 227v41l48 20v-36z" fill="#e8d8bb"/><path d="M428 252 518 220v34l-90 34z" fill="#c5a78b"/>'+windows([389,404],240)+'<path d="M445 271v-13a7 7 0 0 1 12-4v12m9-4v-13a7 7 0 0 1 12-4v12m9-4v-13a7 7 0 0 1 12-4v12" fill="none" stroke="#e9d5b5" stroke-width="4"/></g>'+
 '<path d="M537 278 623 239 675 263 589 307z" fill="#ead8ad"/><path d="M547 277 625 245 658 263 586 297z" fill="#328f9e" stroke="#a0ded2" stroke-width="3"/><path class="jade-pool-glint" d="m557 278 76-30m-64 40 79-31m-57 33 50-20" stroke="#d7f1db" stroke-width="2" stroke-dasharray="9 10" fill="none"/><path d="m577 300 17 7m12-14 17 7m12-14 17 7" stroke="#fff2d2" stroke-width="5" stroke-linecap="round"/>'+
 '<g class="jade-building"><path d="M684 229 737 207 781 225 724 249z" fill="#8f5e50"/><path d="M684 229v29l40 17v-26z" fill="#dfc19f"/><path d="M724 249 781 225v28l-57 22z" fill="#ba9778"/>'+arch(694,239)+arch(708,246)+'<path d="M744 215v-16h7v13" stroke="#9c7059" stroke-width="5"/><path class="jade-smoke" d="M747 194q-10-8 0-13t1-12" fill="none" stroke="#f7ebd3" stroke-width="4" stroke-linecap="round"/></g>'+
 '<g class="jade-building"><path d="M477 372 537 347 564 365 505 391z" fill="#b47466"/><path d="M477 372v28l28 15v-24z" fill="#f0d4ac"/><path d="M505 391 564 365v25l-59 25z" fill="#c9a98a"/>'+arch(485,381)+'<path d="m517 386 11-5v15l-11 5m21-9v-15l12-5v14z" class="jade-window"/></g>'+
 '<g class="jade-building"><path d="M599 374 660 344 698 361 634 391z" fill="#f4edce"/><path d="M599 374v34l35 15v-32z" fill="#e1d7bb"/><path d="M634 391 698 361v33l-64 29z" fill="#bcc3ac"/><path d="m646 392 36-16v13l-36 16z" class="jade-window"/><path d="M602 430q13-24 21-11t-14 13" fill="none" stroke="#f3e1b9" stroke-width="4"/></g>'+
 '<g class="jade-building"><path d="M340 450 381 430 417 442 374 464z" fill="#ddd6a9"/><path d="M344 451v26l30 13v-26zm30 13 39-20v24l-39 22z" fill="#a6c3a7" stroke="#526f58" stroke-width="2"/><path d="m344 457 30 13 39-19m-54 8v23m31-25v25m12-30v23" fill="none" stroke="#658875" stroke-width="2"/></g>'+
 '<g class="jade-building"><path d="M809 346 859 317 898 336 845 363z" fill="#555e51"/><path d="M809 346v31l36 12v-26z" fill="#d7be9d"/><path d="M845 363 898 336v27l-53 26z" fill="#a98d73"/><path d="m850 365 37-19v13l-37 19z" class="jade-window"/><path d="M823 359v13m8-9v13" stroke="#774c4b" stroke-width="4"/><path class="jade-lantern" d="M816 353h10v11h-10z" fill="#df9861"/></g>'+
 woods.map(([x,y,s])=>jadeTree(x,y,s)).join('')+
 '<g><use href="#jade-cypress" x="493" y="158"/><use href="#jade-cypress" x="510" y="168"/><use href="#jade-cypress" x="620" y="158"/><use href="#jade-cypress" x="605" y="166"/><use href="#jade-cypress" x="682" y="258"/><use href="#jade-cypress" x="788" y="253"/><use href="#jade-umbrella" x="758" y="467"/><use href="#jade-umbrella" x="815" y="448"/><use href="#jade-umbrella" x="851" y="415"/></g>'+
 '<path d="m433 535-30 37-35-9 3-8 31 7 25-31z" fill="#ab825e" stroke="#ebd4a6" stroke-width="2"/><path d="m172 406 63 19 54 68-16 8-58-62-51-20z" fill="#657068" stroke="#b6aa8a" stroke-width="4"/><path d="m177 413 46 15 49 60" fill="none" stroke="#e8d8ad" stroke-width="2" stroke-dasharray="5 7"/>'+
 '<g class="jade-sail"><path d="M908 104q25 6 42-2l-6 9h-29z" fill="#faedcf"/><path d="M928 63v41h-19zm3 9v30h13z" fill="#f7e9cd"/><path d="M897 117q24 8 66 0" stroke="#ecedcf" opacity=".63" fill="none"/></g>'+
 '<g class="jade-birds" fill="none" stroke="#f7efda" stroke-width="2" stroke-linecap="round"><path d="M718 80q7-3 13 3 5-7 13-4m7 18q5-3 10 2 4-5 10-4m-75 8q4-3 9 2 4-5 9-3"/></g>'+
 '<g fill="#e8ebd0" font-family="Georgia, serif"><text x="56" y="80" font-size="13" letter-spacing="5">JADE SEA</text><text x="896" y="565" font-size="10" letter-spacing="2">THE PRIVATE COAST</text></g>'+
 '<g transform="translate(73 540)" fill="none" stroke="#eaeccc" opacity=".84"><circle r="21"/><path d="M0-27 5 0 0 24-5 0zM-17 0h34"/><text x="-4" y="-34" font-size="10" fill="#f0efd6" stroke="none">N</text></g></svg>';
}
const jadeVignettes={
 hotel:'<path d="M32 91h176v85H32z" fill="#ded0ae"/><path d="m25 91 95-49 95 49" fill="#c49078"/><path d="M49 168v-37a19 19 0 0 1 38 0v37m14 0v-37a19 19 0 0 1 38 0v37m14 0v-37a19 19 0 0 1 38 0v37" fill="none" stroke="#746c59" stroke-width="7"/><path class="jade-local-light" d="M99 88h42" stroke="#fff4d8" stroke-width="4"/>',
 pool:'<path d="M23 120q79-36 198-15v56H23z" fill="#569b9c"/><path d="M20 121q88-43 204-16" fill="none" stroke="#ebdfbf" stroke-width="8"/><path class="jade-pool-glint" d="M41 130h145m-128 13h147m-167 13h111" fill="none" stroke="#f2e8c9" stroke-width="2" stroke-dasharray="12 11"/><circle class="jade-local-light" cx="171" cy="56" r="24" fill="#edcb8b"/>',
 beach:'<path d="M0 111q92-36 240 0v77H0z" fill="#ddc99c"/><path d="M0 144q75-46 240-4v48H0z" fill="#70a8a0"/><path class="jade-foam" d="M0 143q75-46 240-3" stroke="#fff4cf" stroke-width="4" fill="none"/><path d="M162 74v57" stroke="#78614e" stroke-width="3"/><path d="M126 84q37-52 73 0z" fill="#c88d77"/><path d="M149 84q13-50 27 0z" fill="#f4e5c7"/>',
 forest:'<g class="jade-local-leaves"><path d="M37 159 67 47l29 112m-15 4 46-135 39 135m-30 1 40-108 32 108" fill="#73936f" stroke="#4f715b" stroke-width="3"/><path d="M67 119v58m59-73v73m50-56v52" stroke="#6d6150" stroke-width="4"/></g><path d="M41 177q43-21 82-4t72-11" fill="none" stroke="#e8d5ac" stroke-width="6"/>',
 yoga:'<path d="M33 154V87l87-46 87 46v67z" fill="#a3b8a2" stroke="#52796a" stroke-width="4"/><path d="M75 65v89m45-113v113m45-89v89M34 92h173" stroke="#537766" stroke-width="4"/><path class="jade-local-light" d="m83 152 17-23h54l-15 23z" fill="#d78e80"/><path d="M19 159h202" stroke="#a58768" stroke-width="5"/>',
 museum:'<path d="M38 61h162v102H38z" fill="#ecdfbd" stroke="#acaa94" stroke-width="4"/><path d="M72 82h95v61H72z" fill="#fbefce" stroke="#8f826c" stroke-width="3"/><path d="M76 128q26-18 87-8v18H76z" fill="#81a7a0"/><path class="jade-local-light" d="M151 63 91 162h-39l60-99z" fill="#fff9df" opacity=".67"/>',
 boutique:'<path d="M34 166V69h172v97z" fill="#e7ceaa"/><path d="M48 156v-42a30 30 0 0 1 60 0v42m24 0v-42a30 30 0 0 1 60 0v42" fill="#f4e0aa" stroke="#8a7164" stroke-width="4"/><path d="m70 112 8 5 8-5 4 9-5 8 9 18H62l9-18-5-8z" fill="#c98882"/><path class="jade-local-light" d="M148 129h28l-3 15h-22zm7 0v-5a7 7 0 0 1 14 0v5" fill="#a77359" stroke="#715347" stroke-width="2"/>',
 castle:'<path d="M45 152V78h28v23h94V78h28v74z" fill="#e4d0ab" stroke="#988c74" stroke-width="3"/><path d="m38 80 21-37 21 37m80 0 21-37 21 37" fill="#b77d70"/><path d="M107 152v-22a13 13 0 0 1 26 0v22" fill="#8e7765"/><path class="jade-local-light" d="M181 43V25l23 6-23 7" stroke="#a77d60" fill="#c87d74"/>',
 chef:'<path d="M24 147h192m-149 0a53 53 0 0 1 106 0m-53-54V84" fill="none" stroke="#97715f" stroke-width="5"/><path d="M55 153h130" stroke="#cab58d" stroke-width="9"/><path class="jade-smoke" d="M108 76q-12-11 0-17t0-16m24 36q11-13 0-20t0-17" fill="none" stroke="#fbf2d0" stroke-width="5" stroke-linecap="round"/>',
 omakase:'<path d="M32 119h176v40H32z" fill="#b78b6d"/><path d="M51 118h138v28H51z" fill="#e1c499"/><path d="M76 121q1-17 15-17h60q14 0 15 17v9H76z" fill="#f6edd4"/><path d="M75 114q-2-23 22-25h44q24 1 27 22l-20-1-16 2-17-2-20 2z" fill="#d38d78"/><path class="jade-local-light" d="M93 96h50m-38 8h46" stroke="#f4c3a9" stroke-width="2"/><path d="M154 56h31m-31 7h31" stroke="#7d6b52" stroke-width="2"/>',
};
function jadeDetail(stop,index){
 const [key,name,en,tag,,,description,...features]=stop;
 return '<div class="jade-detail-copy"><p class="jade-kicker">STOP '+jadeNo(index)+' <span> / </span>'+escape(en)+'</p><h2>'+escape(name)+'</h2><p class="jade-description">'+escape(description)+'</p><ul class="jade-features" aria-label="這一站的特色">'+features.map(f=>'<li>'+escape(f)+'</li>').join('')+'</ul></div><svg class="jade-vignette" viewBox="0 0 240 190" aria-hidden="true"><circle cx="120" cy="94" r="77" fill="#eadfbd" opacity=".72"/><path d="M24 172h192" stroke="#c9b68e" stroke-dasharray="2 5"/>'+jadeVignettes[key]+'</svg>';
}
const jadeEntrances={
 hotel:['抵達飯店大門','走進飯店大廳','穿過拱門就到了大廳。窗外是翡翠灣，靠窗的沙發正好可以歇一下。'],
 pool:['沿著露台往前走','來到無邊際泳池','站到池邊，就能看見水線和海平面接在一起。'],
 beach:['走下木棧道','踏上貝殼海灘','鞋尖碰到細沙，浪正從海灣一層層推過來。'],
 forest:['沿雪松小徑往前走','走進雪松森林','轉過最後一棵雪松，林間小徑還在往山坡上延伸。'],
 yoga:['抵達玻璃亭','走進林間瑜伽教室','推開玻璃門，陽光落在攤好的瑜伽墊上。'],
 museum:['穿過雕塑庭院','走進潮汐美術館','從採光天井落下來的光，正沿著白牆移動。'],
 boutique:['沿拱廊走到櫥窗','走進拱廊精品店','一側是洋裝，另一側的玻璃櫃裡放著手袋。'],
 castle:['穿過玫瑰花園','走進翡翠城堡','從石拱門進來，再往上走就是能俯瞰整座海灣的露台。'],
 chef:['抵達花園餐桌','入席暮光私廚','廚房裡傳出爐火聲，花園裡那張餐桌已經擺好。'],
 omakase:['走到海邊吧台','入席潮前 Omakase','潮師傅站在吧台後，今晚從紐西蘭生蠔開始。']
};
const jadeHotelArt=`<svg class="tour-hotel-art tour-facade" viewBox="0 0 760 480" aria-hidden="true">
 <defs><linearGradient id="tour-stucco" x2="0" y2="1"><stop stop-color="#fae6c5"/><stop offset="1" stop-color="#d1a784"/></linearGradient><pattern id="tour-wall" width="48" height="27" patternUnits="userSpaceOnUse"><path d="M0 26h48m-24 0V13" fill="none" stroke="#aa7c61" opacity=".13"/></pattern></defs>
 <path d="M0 0h760v480H0z" fill="#9eb7a3"/><path d="M0 351h760v129H0z" fill="#c7b09a"/>
 <path d="M0 351h760M0 384h760M0 431h760m-760 49h760M133 480l99-129m395 129-99-129M276 480l44-129m165 129-44-129" fill="none" stroke="#e6d3b6" stroke-width="2"/>
 <path d="M47 90h666v261H47z" fill="url(#tour-stucco)"/><path d="M47 90h666v261H47z" fill="url(#tour-wall)"/>
 <path d="M22 91 113 19h535l90 72z" fill="#9d5f51"/><path d="M92 39h576M67 56h627M47 72h666" stroke="#ce8a70" stroke-width="4"/>
 <path d="M47 94h666v14H47zM47 209h666v9H47z" fill="#edd0a9"/>
 <g fill="#9d685b" stroke="#eccaa8" stroke-width="6"><path d="M88 184v-57h103v57zM221 184v-57h93v57zM448 184v-57h93v57zM569 184v-57h103v57z"/></g>
 <g fill="#47665d" stroke="#d5a997" stroke-width="3"><path d="M112 182v-50h53v50zm132 0v-50h48v50zm226 0v-50h48v50zm123 0v-50h53v50z"/></g>
 <path d="M332 126h96v40h-96z" fill="#f4dfb8" stroke="#ac8667" stroke-width="2"/>
 <text x="380" y="150" fill="#644f40" text-anchor="middle" font-family="Georgia,serif" font-size="13" letter-spacing="3">COVE HOTEL</text>
 <g fill="#546e62" stroke="#b68468" stroke-width="7"><path d="M92 341v-68a45 45 0 0 1 90 0v68zM220 341v-68a43 43 0 0 1 86 0v68zM454 341v-68a43 43 0 0 1 86 0v68zM578 341v-68a45 45 0 0 1 90 0v68z"/></g>
 <path d="M311 350v-79a69 69 0 0 1 138 0v79z" fill="#644f43" stroke="#e6c59c" stroke-width="13"/>
 <path d="M329 348v-69a51 51 0 0 1 102 0v69z" fill="#bd975e"/>
 <path d="M347 343v-70a33 33 0 0 1 66 0v70z" fill="#f2d299" opacity=".68"/>
 <g class="tour-doors" fill="#405d50" stroke="#9a7d61" stroke-width="2"><path class="tour-door-left" d="M330 346v-65a49 49 0 0 1 49-52v117z"/><path class="tour-door-right" d="M381 346V229a49 49 0 0 1 49 52v65z"/></g>
 <path d="M366 346h28l53 134H313z" fill="#a97065" opacity=".76"/>
 <g fill="#b57156"><path d="M56 323h32l-5 28H62zM672 323h32l-6 28h-20zM273 325h27l-4 28h-18zM460 325h27l-4 28h-18z"/></g>
 <g fill="#56775b"><circle cx="72" cy="308" r="22"/><circle cx="688" cy="308" r="22"/><circle cx="286" cy="311" r="18"/><circle cx="473" cy="311" r="18"/></g>
 <g fill="#f2a596"><circle cx="65" cy="296" r="5"/><circle cx="81" cy="306" r="4"/><circle cx="689" cy="294" r="5"/><circle cx="700" cy="311" r="4"/><circle cx="281" cy="306" r="4"/><circle cx="479" cy="305" r="4"/></g>
 </svg><svg class="tour-hotel-art tour-lobby" viewBox="0 0 760 480" aria-hidden="true">
 <defs><linearGradient id="tour-sky" x2="0" y2="1"><stop stop-color="#d4e5cd"/><stop offset=".5" stop-color="#a7c7bb"/><stop offset=".51" stop-color="#75a9a7"/><stop offset="1" stop-color="#42898b"/></linearGradient><clipPath id="tour-lobby-view"><path d="M275 330V167a105 105 0 0 1 210 0v163z"/></clipPath></defs>
 <path d="M0 0h760v480H0z" fill="#e9d3ab"/><path d="M0 0h760l-166 65H166z" fill="#cfac82"/>
 <path d="M0 0l166 65v261L0 480zM760 0 594 65v261l166 154z" fill="#d9ba92"/>
 <path d="M166 326h428l166 154H0z" fill="#d8c9ab"/>
 <path d="M166 326h428M125 365h510M76 410h608m-626 70 200-154m444 154L505 326m-281 154 81-154m229 154-79-154" fill="none" stroke="#f3e4c3" stroke-width="3"/>
 <path d="M275 330V167a105 105 0 0 1 210 0v163z" fill="url(#tour-sky)" stroke="#f3dfb4" stroke-width="16"/>
 <g clip-path="url(#tour-lobby-view)"><path d="M251 271q87-51 121-24t138-13v-23H251z" fill="#86a990"/><path class="tour-lobby-window" d="M275 285q45-14 104-7t109-3m-198 26q35-7 60-2m69 5 51-4" fill="none" stroke="#d1e3c2" opacity=".65" stroke-width="3"/><path d="M377 72h6v270h-6zM270 218h220v5H270z" fill="#e8d5b0"/></g>
 <path d="M171 85h35v265h-35zm383 0h35v265h-35z" fill="#f0deba"/><path d="M164 92h49m-49 248h49m334-248h49m-49 248h49" stroke="#b98f6d" stroke-width="7"/>
 <path d="M319 349h122l64 131H255z" fill="#a97567"/><path d="M334 360h92l50 106H284z" fill="none" stroke="#e3bb93" stroke-width="4"/>
 <path d="M65 350h132v69H65z" fill="#698b78"/><path d="M68 347h122v25H68z" fill="#88a38b"/><path d="M548 349h164v76H548z" fill="#916854"/><path d="M540 343h177v13H540z" fill="#b88b6a"/>
 <path d="M117 123v56m526-56v56M380 0v38" stroke="#997653" stroke-width="3"/><g fill="#f8e6a8"><circle cx="117" cy="181" r="11"/><circle cx="643" cy="181" r="11"/><ellipse cx="380" cy="44" rx="24" ry="13"/></g>
 <path d="M228 349h22l-4 25h-14zm282 0h22l-4 25h-14z" fill="#ac715b"/><g fill="#64846b"><circle cx="239" cy="339" r="14"/><circle cx="521" cy="339" r="14"/></g>
 </svg>`;
const jadeSuiteArt=`<svg class="suite-room-art" viewBox="0 0 760 480" aria-hidden="true">
 <defs>
  <linearGradient id="suite-plaster" x2="0" y2="1"><stop stop-color="#f6e9d2"/><stop offset="1" stop-color="#ddc5a1"/></linearGradient>
  <linearGradient id="suite-wood" x2=".65" y2="1"><stop stop-color="#d2af8e"/><stop offset="1" stop-color="#926a55"/></linearGradient>
  <linearGradient id="suite-bedding" x2="0" y2="1"><stop stop-color="#fff5da"/><stop offset=".66" stop-color="#eddfc5"/><stop offset="1" stop-color="#c4a994"/></linearGradient>
  <linearGradient id="suite-headboard" x2="0" y2="1"><stop stop-color="#b46e63"/><stop offset="1" stop-color="#7f4e46"/></linearGradient>
  <linearGradient id="suite-water" x2="0" y2="1"><stop stop-color="#6aa8a2"/><stop offset="1" stop-color="#3c7d81"/></linearGradient>
  <linearGradient id="suite-sky" x2="0" y2="1"><stop stop-color="#a5c8c1"/><stop offset="1" stop-color="#fbe7bb"/></linearGradient>
  <linearGradient id="suite-dawn" x2="0" y2="1"><stop stop-color="#e8aa8d"/><stop offset="1" stop-color="#f9e9b3"/></linearGradient>
  <linearGradient id="suite-silk" x2="1" y2="0"><stop stop-color="#8a5a55"/><stop offset=".23" stop-color="#b87f73"/><stop offset=".44" stop-color="#a86e64"/><stop offset=".72" stop-color="#c78c7d"/><stop offset="1" stop-color="#8a5a55"/></linearGradient>
  <radialGradient id="suite-glow"><stop stop-color="#f9ce82" stop-opacity=".82"/><stop offset="1" stop-color="#f9ce82" stop-opacity="0"/></radialGradient>
  <clipPath id="suite-vista"><path d="M463 327V148a91 91 0 0 1 182 0v179z"/></clipPath>
  <pattern id="suite-rug" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M8 1 15 8 8 15 1 8z" fill="none" stroke="#f1cca1" opacity=".26"/></pattern>
 </defs>
 <path d="M0 0h760v480H0z" fill="url(#suite-plaster)"/>
 <path d="M0 0h760v21H0z" fill="#e9d4b3"/><path d="M0 25h760m-760 7h760" stroke="#c5a485" stroke-width="2"/>
 <path d="M0 0 87 52v281L0 423zm760 0-52 46v285l52 89z" fill="#b89677" opacity=".26"/>
 <path d="M0 319h760v161H0z" fill="url(#suite-wood)"/>
 <path d="M0 318h760v9H0z" fill="#ad8971"/>
 <path d="M0 355h760m-760 43h760m-760 55h760m-708 27 154-153m-25 153 105-153m39 153 37-153m99 153-27-153m146 153-69-153m197 153-113-153" stroke="#f5d9b2" opacity=".33" stroke-width="2"/>
 <path d="M84 57h320v250H84z" fill="#efe2c6" stroke="#c1a084" stroke-width="3"/>
 <path d="M97 70h294v222H97z" fill="none" stroke="#cbae90" stroke-width="2"/>
 <path d="M207 87h74v50h-74z" fill="#ba936e" stroke="#a37b5f" stroke-width="3"/><path d="M213 93h62v38h-62z" fill="#f7e8c9"/><path d="M217 122q13-14 24-10t30-6v20h-54z" fill="#6c9d91"/><path d="M217 117q14-12 28-9t26-8" fill="none" stroke="#9aa27a" stroke-width="4"/>
 <path d="M451 334V148a103 103 0 0 1 206 0v186z" fill="#e1c4a0" stroke="#a9876c" stroke-width="5"/>
 <g clip-path="url(#suite-vista)">
  <path d="M450 46h211v291H450z" fill="url(#suite-sky)"/><path class="suite-dawn-sky" d="M450 46h211v291H450z" fill="url(#suite-dawn)"/>
  <path class="suite-stars" d="M450 46h211v291H450z" fill="#22394d"/>
  <g class="suite-stars" fill="#f5e0af"><circle cx="503" cy="111" r="2"/><circle cx="556" cy="80" r="1.5"/><circle cx="622" cy="126" r="2"/><circle cx="579" cy="149" r="2"/><path d="M544 102a13 13 0 1 0 14 16 14 14 0 0 1-14-16" fill="#f4deb0"/></g>
  <circle class="suite-sun" cx="580" cy="174" r="20" fill="#ffe8a3"/>
  <path d="M450 222q36-19 80-13t69-12l62 13v127H450z" fill="url(#suite-water)"/>
  <path d="M450 223q26-16 49-16t26 8l-75 14zm211-6q-22-17-45-17-12 0-22 10l67 13z" fill="#719480"/>
  <path class="suite-ripples" d="M466 246q18-5 37 0m26-12q18-5 34 0m16 18q17-6 37 0m-156 21q21-6 45 0m43 10q27-7 58 0m-87 13q20-5 39 0m-75 14q26-6 51 0" fill="none" stroke="#d8e8c9" stroke-width="2" stroke-linecap="round" opacity=".76"/>
  <g fill="#4c685e" opacity=".8"><path d="M461 304h184v5H461zm0 19h184v4H461zm12-16h3v20h-3zm22 0h3v20h-3zm22 0h3v20h-3zm22 0h3v20h-3zm22 0h3v20h-3zm22 0h3v20h-3zm22 0h3v20h-3zm22 0h3v20h-3z"/></g>
 </g>
 <path d="M463 327V148a91 91 0 0 1 182 0v179zM554 59v268m-91-129h182" fill="none" stroke="#f5dfb8" stroke-width="6"/>
 <path d="M438 48h232" stroke="#896d51" stroke-width="5" stroke-linecap="round"/>
 <g class="suite-curtain suite-curtain-left"><path d="M438 51h115q-9 43-6 91 4 70 6 116l1 82q-50 19-117 0l4-65q9-66 3-112z" fill="url(#suite-silk)"/><path d="M451 56q19 86 7 169t-7 108m32-278q16 99 7 160t-1 120m31-278q-7 82 1 153t4 125" fill="none" stroke="#f0bd9c" opacity=".46" stroke-width="3"/></g>
 <g class="suite-curtain suite-curtain-right"><path d="M555 51h115l-6 112q-6 46 3 112l4 65q-67 19-117 0l1-82q2-46 6-116 3-48-6-91z" fill="url(#suite-silk)"/><path d="M569 55q12 80 7 161t-3 119m34-279q-11 91-4 167t0 112m39-280q-13 90-5 170t2 109" fill="none" stroke="#f0bd9c" opacity=".46" stroke-width="3"/></g>
 <path d="M114 355h257l107 99H39z" fill="#a46961" opacity=".86"/><path d="M114 355h257l107 99H39z" fill="url(#suite-rug)"/><path d="M115 363h255l89 82H56z" fill="none" stroke="#d9aa89" stroke-width="3"/>
 <path d="M87 350h48v43H87zm271 0h51v43h-51z" fill="#7f5848"/><path d="M81 342h61v12H81zm270 0h65v12h-65z" fill="#a87a5c"/>
 <path d="M145 312V208q0-55 55-55h92q56 0 56 55v104z" fill="url(#suite-headboard)" stroke="#704b45" stroke-width="6"/>
 <path d="M158 296v-85q0-44 44-44h87q45 0 45 44v85z" fill="none" stroke="#d79681" stroke-width="3"/>
 <path d="M190 179v101m28-113v112m28-112v112m28-112v112m28-101v101" stroke="#e7a08d" opacity=".45" stroke-width="2"/>
 <path d="M139 259q98-20 207 0l52 110-15 50q-119 32-274 0l-11-44z" fill="#856051"/>
 <path d="M142 249q97-17 203 0l51 105q11 27-15 45-114 31-274 0-25-16-11-44z" fill="url(#suite-bedding)" stroke="#b49b84" stroke-width="3"/>
 <path d="M153 259q25-10 80-6l-9 39q-47 6-87 0zm106-7q60 0 75 10l18 29q-51 6-87 1z" fill="#fffae7" stroke="#dac3a8" stroke-width="3"/>
 <path d="M106 342q146 24 280 0l12 21-7 30q-123 33-291 0l-7-30z" fill="#8e9b82"/>
 <path d="M101 355q139 27 288 1m-287 26q147 28 286 1" fill="none" stroke="#d5c9a7" stroke-width="3" opacity=".7"/>
 <path d="M544 386q43-40 94-20l31 22-12 37h-93z" fill="#6f8c78"/><path d="M554 389q36-25 79-14l26 17-8 16h-85z" fill="#95a68b"/>
 <path d="M559 418l-7 14m100-14 7 14" stroke="#674a3e" stroke-width="4"/>
 <path d="M662 327h41l-6 37h-27z" fill="#ae765b"/><path d="M683 330v-52m0 33q-25-20-20-41m20 27q22-22 26-37m-26 42q-8-28-5-51" fill="none" stroke="#5d8066" stroke-width="4"/>
 <path d="M111 340v-42m272 42v-42" stroke="#795940" stroke-width="4"/>
 <path class="suite-shade" d="M92 306l8-26h22l9 26zm272 0 8-26h22l8 26z" fill="#f0d3a0" stroke="#a88661" stroke-width="2"/>
 <path d="M359 333h20v5h-20zm-262 1h17v4H97z" fill="#f3ddbb"/>
 <path class="suite-room-dark" d="M0 0h760v480H0z" fill="#193145"/>
 <g class="suite-lamps"><circle cx="111" cy="299" r="69" fill="url(#suite-glow)"/><circle cx="383" cy="299" r="67" fill="url(#suite-glow)"/><path d="M92 306l8-26h22l9 26zm272 0 8-26h22l8 26z" fill="#f6d38d"/></g>
 </svg>`;
function jadeSuiteMarkup(avatar){
 return '<div class="suite-visual" aria-hidden="true">'+jadeSuiteArt+'<div class="suite-sleeper">'+avatar+'</div><svg class="suite-duvet" viewBox="0 0 760 480"><path d="M128 303q43 7 102 8l29 0q68-1 110-9l23 57q-131 27-293-1z" fill="#e9dcc2" stroke="#b69e87" stroke-width="2"/><path d="M128 308q100 16 240 0m-246 9q95 18 249 1" fill="none" stroke="#f8edd5" stroke-width="3"/></svg><span class="suite-zzz">z<span>z</span><span>z</span></span></div>';
}
const jadeSuiteStyles=`
.tour-lobby-window{animation:suite-shimmer 5s ease-in-out infinite}
.tour-inside[data-place=hotel] .tour-lobby{animation:suite-lobby-arrive .75s ease-out both}
@keyframes suite-lobby-arrive{from{transform:scale(1.11);opacity:.3}to{transform:scale(1);opacity:1}}
.suite-actions{display:flex;flex-wrap:wrap;gap:7px;margin:12px 0 1px}
.suite-actions[hidden],.suite-actions button[hidden]{display:none}
.suite-actions button{min-height:42px;padding:6px 11px;font-size:.83rem;border:1px solid #a59b81;border-radius:8px;background:#f3ebd8;color:#274a3d}
.suite-actions button[data-suite-checkin],.suite-actions button[data-suite-sleep]{background:#2f584a;border-color:#2f584a;color:#fff8eb}
.suite-actions button:hover{background:#436d58;border-color:#436d58;color:#fffaf0}
.tour-upstairs .tour-lobby{animation:suite-lobby-out .65s ease-in both!important}
@keyframes suite-lobby-out{to{transform:scale(1.47) translateX(-6%);opacity:.12}}
.suite-floor{position:absolute;z-index:6;inset:0;display:none;place-items:center;color:#fff2d4;background:#284136;letter-spacing:.22em;text-align:center;font-size:clamp(.77rem,2.6vw,1.08rem);pointer-events:none}
.tour-upstairs .suite-floor{display:grid;animation:suite-floor .68s ease-in-out both}
@keyframes suite-floor{0%{opacity:0}65%,100%{opacity:.94}}
.suite-visual{display:none;position:absolute;inset:0;overflow:hidden;isolation:isolate;background:#d7bc97}
.tour-suite .suite-visual{display:block;animation:suite-reveal .74s cubic-bezier(.14,.69,.3,1) both}
.tour-suite .tour-hotel,.tour-suite .tour-scene-bear{visibility:hidden}
@keyframes suite-reveal{from{opacity:.15;transform:scale(1.13) translateX(1%)}to{opacity:1;transform:scale(1) translateX(0)}}
.suite-room-art,.suite-duvet{position:absolute;inset:0;width:100%;height:100%;display:block}
.suite-room-art{z-index:1}
.suite-curtain{transform-box:fill-box;transition:transform 1.1s cubic-bezier(.22,.75,.28,1)}
.suite-curtain-left{transform-origin:left center;transform:scaleX(.24)}
.suite-curtain-right{transform-origin:right center;transform:scaleX(.24)}
.suite-curtains .suite-curtain{transform:scaleX(1)}
.tour-suite:not(.suite-curtains) .suite-curtain-left{animation:suite-curtain-open .94s .31s cubic-bezier(.22,.75,.28,1) backwards}
.tour-suite:not(.suite-curtains) .suite-curtain-right{animation:suite-curtain-open 1.06s .36s cubic-bezier(.22,.75,.28,1) backwards}
@keyframes suite-curtain-open{from{transform:scaleX(1)}}
.suite-room-dark,.suite-lamps,.suite-stars,.suite-dawn-sky,.suite-sun{opacity:0;transition:opacity .9s ease}
.suite-night .suite-stars,.suite-dawn .suite-dawn-sky,.suite-dawn .suite-sun{opacity:1}
.suite-night .suite-room-dark{opacity:.62}
.suite-night.suite-lit .suite-room-dark{opacity:.41}
.suite-lit .suite-lamps{opacity:.88}
.suite-night .suite-ripples{stroke:#aac4c4;opacity:.44}
.suite-ripples{animation:suite-shimmer 4s ease-in-out infinite}
@keyframes suite-shimmer{0%,100%{transform:translateX(0);opacity:.49}50%{transform:translateX(7px);opacity:.9}}
.suite-dawn .suite-sun{animation:suite-sunrise 1.5s cubic-bezier(.22,.78,.27,1) both}
@keyframes suite-sunrise{from{transform:translateY(55px);opacity:0}to{transform:translateY(0);opacity:1}}
.suite-sleeper{position:absolute;z-index:2;width:13.6%;left:56%;top:87%;transform:translate(-50%,-94%);transition:left .74s cubic-bezier(.18,.76,.35,1),top .74s cubic-bezier(.18,.76,.35,1),transform .74s cubic-bezier(.18,.76,.35,1),filter .7s ease}
.suite-sleeper svg{display:block;width:100%;height:auto}
.suite-night .suite-sleeper,.suite-night .suite-duvet{filter:brightness(.54) saturate(.8)}
.suite-night.suite-lit .suite-sleeper,.suite-night.suite-lit .suite-duvet{filter:brightness(.78) saturate(.87)}
.suite-sleeping .suite-sleeper{left:28.2%;top:76.4%;transform:translate(-50%,-94%) rotate(-7deg) scale(.85)}
.suite-duvet{z-index:3;opacity:0;pointer-events:none;transition:opacity .25s,filter .7s ease}
.suite-sleeping .suite-duvet{opacity:1;transition-delay:.45s}
.suite-zzz{position:absolute;z-index:4;top:40%;left:29%;color:#fff0bb;display:none;gap:4px;align-items:baseline;font-family:Georgia,serif;font-weight:bold;text-shadow:0 1px 3px #243a39;font-size:clamp(.6rem,2vw,.9rem)}
.suite-zzz span:first-child{font-size:1.3em}.suite-zzz span:last-child{font-size:1.65em}
.suite-sleeping .suite-zzz{display:flex;animation:suite-dream 2.65s .65s ease-out infinite both}
@keyframes suite-dream{0%{transform:translate(-5px,5px);opacity:0}32%{opacity:1}100%{transform:translate(12px,-15px);opacity:0}}
.tour-still .suite-zzz{opacity:1}
@media(max-width:520px){.suite-actions button{min-height:44px}.suite-actions{gap:6px}.tour-story{min-height:0}}
@media(prefers-reduced-motion:reduce){.tour-visit *,.tour-suite *,.tour-upstairs *{animation:none!important;transition:none!important}.suite-sleeping .suite-zzz{opacity:1}}
`;
const jadeOmakase=[
 ['紐西蘭鑽石生蠔','oyster','#e5d9bb',1,'從生蠔開始。先嚐原味，感受海水的鮮甜。',''],
 ['北海道水魚・赤海膽・小柱','sashimi','#d99962',0,'水魚、赤海膽和小柱放在同一盤，三種口感可以分開嚐。',''],
 ['長野縣金目鯛','sashimi','#df8e86',0,'下一道是金目鯛，切片後把帶紅的魚皮朝上擺。',''],
 ['鹿耳島獅魚','sashimi','#c8a38f',0,'這一盤是獅魚。先吃魚肉，感受它和金目鯛的差異。',''],
 ['台灣野生蛤蜊・乾燥蓮藕・真丈','broth','#e1ba7e',0,'蛤蜊、乾燥蓮藕和真丈，趁湯還熱先喝一口。',''],
 ['鮑魚酥麵','noodles','#b7824e',1,'酥麵墊底，鮑魚放在上面。一口一起吃，就能吃到兩種口感。',''],
 ['北寄貝茶碗蒸','custard','#ead29c',0,'握壽司前最後一道熱菜，是北寄貝茶碗蒸。',''],
 ['軟絲','nigiri','#e4dbc6',0,'接下來進入握壽司。第一貫是軟絲。','醋飯偏乾。'],
 ['九州真鯛','nigiri','#dfad9e',1,'第二貫是九州真鯛。可以留意魚肉的清甜。','魚肉新鮮，醋飯偏乾。'],
 ['北寄貝','nigiri','#cb8a7e',0,'同樣是北寄貝，這回用握壽司的方式上桌。','醋飯依然偏硬。'],
 ['獅魚肚・柚子胡椒鹽','nigiri','#d3ab91',0,'獅魚肚上放一點柚子胡椒鹽，這一貫直接吃就好。',''],
 ['松葉蟹・赤海膽','gunkan','#c88a61',0,'松葉蟹和赤海膽放進烤過的海苔，趁剛上桌吃。','海苔有烤過，但沒有很脆。'],
 ['白鰭魚','nigiri','#d8c9b0',0,'下一貫是白鰭魚。這一口先留意魚肉的質地。',''],
 ['午魚','nigiri','#d9b5a3',0,'來試午魚，可以跟前面那貫真鯛比比看。','口感有點像真鯛。'],
 ['白鯧魚肚','nigiri','#d8b3a7',0,'這貫是白鯧魚肚，挑的是魚腹的部位。',''],
 ['黑鮪魚大腹・熟成第九天','nigiri','#bd7277',0,'這貫是熟成第九天的黑鮪魚大腹，讓油脂的香氣慢慢出來。','醋飯再濕潤一點會更好。'],
 ['鰻魚手捲','roll','#a67256',0,'鰻魚手捲包好了，從海苔開口那一頭開始吃。',''],
 ['玉子燒','egg','#e6b575',1,'接下來是玉子燒。這塊很柔軟，可以慢慢吃。','入口即化。'],
 ['立麟燒','grill','#ba875d',0,'立麟燒剛從火上拿下來，先看看魚皮，再趁熱吃。',''],
 ['味噌湯','broth','#b78b66',0,'先喝碗味噌湯，讓味道停一下。',''],
 ['星鰻（招待）','nigiri','#b88766',0,'這貫星鰻是師傅招待。',''],
 ['甜點','dessert','#d8a187',0,'最後是甜點。謝謝你坐到最後一道。','']
];
const jadeOmakasePhase=i=>i<7?'前菜':i<16?'握壽司':'手捲與收尾';
function jadeOmakaseMenu(menu,guest){
 return '<details class="sushi-menu"><summary>翻開今晚菜單 · 22 道</summary><div class="sushi-menu-body">'+(guest?'':'<p>★ 是 Kitty 標記的亮點；試吃筆記保留原本的口感觀察。</p>')+
 [[0,7],[7,16],[16,22]].map(([start,end])=>'<section><h3>'+jadeOmakasePhase(start)+'</h3><ol start="'+(start+1)+'">'+menu.slice(start,end).map(([name,,,star,,note])=>'<li><strong>'+(star?'<span class="sushi-star" aria-label="Kitty 亮點">★ </span>':'')+escape(name)+'</strong>'+(note?'<small>'+escape(note)+'</small>':'')+'</li>').join('')+'</ol></section>').join('')+'</div></details>';
}
const jadeSushiChef=`<g class="sushi-chef" aria-hidden="true">
 <ellipse cx="380" cy="305" rx="105" ry="15" fill="#9e785d" opacity=".24"/>
 <path d="M300 305l6-65q7-37 42-53h62q40 15 45 54l5 64z" fill="#f0e8d1" stroke="#a9987b" stroke-width="3"/>
 <path d="m348 195 34 47 33-48m-33 47-15 65m-53-67 26 11m103-11-26 11" fill="none" stroke="#b6a68d" stroke-width="4"/>
 <path d="M324 273h112l9 35H315z" fill="#526b5c"/><path d="M345 278q20 15 38 1l23 10" fill="none" stroke="#c9b187" stroke-width="3"/>
 <g class="sushi-chef-head"><circle cx="336" cy="110" r="24" fill="#af7b55"/><circle cx="424" cy="110" r="24" fill="#af7b55"/><circle cx="337" cy="111" r="12" fill="#d3a07b"/><circle cx="423" cy="111" r="12" fill="#d3a07b"/><ellipse cx="380" cy="147" rx="62" ry="55" fill="#c18b60"/>
 <path d="M322 136q-3-34 22-46 35-19 72-1 24 11 22 47-54-19-116 0z" fill="#f5ebd3" stroke="#b8a68a" stroke-width="3"/>
 <path d="M324 135q53-17 112 0m-86-39v21m27-25v23m26-18v20" fill="none" stroke="#d4c3a7" stroke-width="3"/>
 <ellipse cx="380" cy="168" rx="28" ry="18" fill="#e8be92"/><path d="M370 161q10-8 20 0-4 9-10 9t-10-9" fill="#4f3b34"/><path d="M374 174q6 5 12 0" fill="none" stroke="#765549" stroke-width="2" stroke-linecap="round"/>
 <path d="M352 148v4m55-4v4" stroke="#4f3b34" stroke-width="5" stroke-linecap="round"/></g>
 <g class="sushi-chef-arm"><path d="M421 230q22-7 30 11l-13 44-41 10-5-20 25-13z" fill="#f2ead4" stroke="#a9987b" stroke-width="3"/><ellipse cx="395" cy="281" rx="15" ry="11" fill="#c18b60"/><path d="m385 278-48-11 3-6 50 13z" fill="#6e7166"/></g>
 <path d="M328 233q-20-6-26 16l21 38 40-3-1-18-29-3z" fill="#f1e8d2" stroke="#a9987b" stroke-width="3"/><ellipse cx="366" cy="275" rx="13" ry="10" fill="#c18b60"/>
 </g>`;
function jadeSushiDish(type){
 const plate='<ellipse cx="380" cy="391" rx="112" ry="32" fill="#634c40" opacity=".28"/><path d="M285 368h189l30 33H255z" fill="#43554d" stroke="#758275" stroke-width="3"/><path d="M272 395q109 8 216 0" fill="none" stroke="#a29a7b" opacity=".64" stroke-width="2"/>';
 const bowl='<ellipse cx="380" cy="393" rx="88" ry="21" fill="#674b3b" opacity=".3"/><path d="M297 354h166l-15 35q-65 22-136 0z" fill="#7b6156" stroke="#4c554b" stroke-width="3"/><ellipse cx="380" cy="354" rx="83" ry="21" fill="currentColor" stroke="#e7c997" stroke-width="5"/>';
 const steam='<path class="sushi-dish-steam" d="M356 332q-15-14 0-28t1-24m43 53q13-14 0-28t1-25" fill="none" stroke="#fff0cb" stroke-width="4" stroke-linecap="round"/>';
 switch(type){
 case 'oyster':return plate+'<path d="M312 372q-22-33 23-45 50-20 109 4 35 19-8 46-73 31-124-5z" fill="#b6a389" stroke="#e4ceb0" stroke-width="6"/><path d="M333 365q-15-13 15-24 40-15 75 0 23 10-6 25-39 16-84-1z" fill="currentColor"/><path d="M426 332q24-16 33 7l-23 15z" fill="#d8bd69"/>';
 case 'sashimi':return plate+'<path d="M307 373q61-54 135-26-68 34-135 26z" fill="#82966f"/><g fill="currentColor" stroke="#e8c5a7" stroke-width="2"><path d="m316 367 24-35 54 9-22 31z"/><path d="m347 372 28-37 57 7-27 33z"/><path d="m385 375 24-35 53 8-24 32z"/></g><circle cx="446" cy="369" r="8" fill="#a3a879"/>';
 case 'broth':return bowl+'<path d="M343 360q-5-18 16-20 20 0 20 18zm43 5q-4-18 15-19 22 1 23 17z" fill="#e7d0a3"/><path d="m363 347 16 7m29-6 14 5m-66 11 12 4" stroke="#798a66" stroke-width="3"/>'+steam;
 case 'custard':return bowl+'<path d="M349 358q14-25 38-9l15 10q-28 17-53-1z" fill="#c68e77"/><path d="m366 352 12-4" stroke="#738968" stroke-width="4"/>'+steam;
 case 'noodles':return plate+'<path d="m314 373 56-43 72 45m-132-9 124 0m-104 14 95-44m-79-2 81 48m-85-39 103 13" stroke="#d1a164" stroke-width="5" fill="none"/><path d="M337 358q8-29 44-28 35 1 39 20-18 18-83 8z" fill="currentColor" stroke="#e5be8c" stroke-width="3"/>';
 case 'gunkan':return plate+'<path d="M326 349q56-25 108 0l-3 38q-52 15-102 0z" fill="#4d5e4d"/><path d="M329 348q42-36 100-8 16 14-29 23-50 6-71-15z" fill="currentColor"/><path d="m346 346 61 9m-32-16 40 4" stroke="#ecd1ac" stroke-width="3"/>';
 case 'roll':return plate+'<path d="M311 341q18-18 53-5l86 48-29 13-100-26z" fill="#4b6151" stroke="#77866a" stroke-width="3"/><ellipse cx="338" cy="347" rx="29" ry="18" fill="#e8d7ad"/><path d="M317 346q17-18 36 0-18 15-36 0z" fill="currentColor"/>';
 case 'egg':return plate+'<path d="m328 341 92-5 29 30-16 17h-95l-20-14z" fill="currentColor" stroke="#ad7d4f" stroke-width="3"/><path d="M338 356h93m-102 12 110-2m-100 10h95" stroke="#f1d6a1" stroke-width="3"/>';
 case 'grill':return plate+'<path d="M308 363q47-39 124-26l26-8-10 21 10 15-24-5q-59 28-126 3z" fill="currentColor" stroke="#8c6653" stroke-width="3"/><path d="m331 351 12 10 11-17 14 13 13-16 14 12 14-13 13 11" fill="none" stroke="#e7bb87" stroke-width="3"/>'+steam;
 case 'dessert':return plate+'<path d="M342 366q-10-29 33-33 42-6 47 23 0 19-41 24-32 4-39-14z" fill="currentColor"/><circle cx="385" cy="333" r="13" fill="#f0d9b0"/><path d="M385 324q13-14 26-7-6 11-25 10z" fill="#7d9574"/>';
 default:return plate+'<path d="M320 371q5-21 31-23h65q22 0 25 22v11q-62 18-120 0z" fill="#f4e8ca"/><path d="M314 365q4-26 34-28h65q24 2 33 27l-31-2-30 7-25-5z" fill="currentColor" stroke="#b8957a" stroke-width="2"/><path d="M335 348h78m-64 8h74" stroke="#f7d5b8" stroke-width="2" opacity=".76"/>';
 }
}
function jadeSushiDishes(){
 return Array.from(new Set(jadeOmakase.map(d=>d[1]))).map(type=>'<template data-sushi-dish="'+type+'"><svg class="sushi-dish-art" viewBox="0 0 760 480" aria-hidden="true">'+jadeSushiDish(type)+'</svg></template>').join('');
}
const jadeSushiStyles=`
.sushi-service[hidden],.sushi-controls button[hidden],.sushi-note[hidden]{display:none}
.sushi-service{margin-top:10px}
.sushi-host{border-top:1px solid #dbcfb0;padding-top:9px}
.sushi-host .jade-kicker{margin-bottom:5px}
.sushi-course{margin:0 0 4px;color:#27483c;font:650 clamp(1.05rem,4vw,1.47rem)/1.2 Georgia,"Noto Serif TC",serif}
.sushi-note{margin:8px 0 2px;border-left:2px solid #bd966e;padding-left:8px;color:#6b503d;font-size:.82rem}
.sushi-controls{display:flex;flex-wrap:wrap;gap:7px;align-items:center;margin-top:10px}
.sushi-controls button{min-height:44px;padding:6px 10px;color:#2c4b3f;background:#f3ead5;border-color:#a79d83;font-size:.83rem}
.sushi-controls button[data-sushi-next]{color:#fff8e9;background:#315747;border-color:#315747}
.sushi-controls button:hover{background:#426754;color:#fff7df}
.sushi-controls output{margin-left:auto;font-size:.76rem;color:#705440;white-space:nowrap}
.sushi-menu{margin-top:11px;border-top:1px solid #dbcfb0;padding-top:9px;color:#385548}
.sushi-menu summary{cursor:pointer;font-size:.85rem;font-weight:650;min-height:36px;padding-top:5px}
.sushi-menu-body>p{font-size:.78rem;color:#705440;margin:0 0 9px}
.sushi-menu-body h3{font-size:.89rem;color:#624b38;margin:12px 0 4px}
.sushi-menu-body ol{margin:0;padding-left:25px;font-size:.84rem}
.sushi-menu-body li{padding:4px 0;border-bottom:1px solid #e0d4b8}
.sushi-menu-body li small{font-size:.74rem;color:#765743;margin:1px 0 0}
.sushi-star{color:#96673d}.sushi-chef-head,.sushi-chef-arm{transform-box:fill-box;transform-origin:center}
.sushi-chef.sushi-preparing .sushi-chef-head{animation:sushi-nod .52s ease-in-out both}
.sushi-chef.sushi-preparing .sushi-chef-arm{animation:sushi-prep .52s ease-in-out both}
@keyframes sushi-nod{45%{transform:translateY(7px) rotate(-5deg)}}
@keyframes sushi-prep{36%{transform:translateX(-8px) rotate(17deg)}72%{transform:translate(-15px,5px) rotate(-10deg)}}
.sushi-plating{position:absolute;inset:0;pointer-events:none;z-index:2}
.sushi-dish-art{width:100%;height:100%;display:block;animation:sushi-serve .67s .17s cubic-bezier(.19,.68,.27,1) both}
@keyframes sushi-serve{from{transform:translateY(-13%) scale(.94);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}
.sushi-dish-steam{animation:x-steam 2.1s ease-out infinite}
.tour-inside[data-place=omakase] .tour-scene-bear{left:20%;top:95%;transform:translate(-50%,-100%) scale(.77)}
`;
const jadeExperiences={
 pool:[['下水游一圈','熊熊沿著池梯下水，水波在身邊散開。'],['靠到無邊際池邊','從池邊看過去，水面和遠方的海平線連在一起。'],['回到日光躺椅','熊熊回到露台，坐下來吹吹海風。']],
 beach:[['走到浪邊','熊熊走到濕沙上，浪花輕輕漫過腳邊。'],['撿一枚貝殼','浪退了，沙上露出一枚淡粉色的扇貝殼。'],['回木棧道','熊熊帶著貝殼回到木棧道。']],
 forest:[['沿雪松小徑散步','熊熊走進雪松林，光影在步道上晃動。'],['到林間空地','樹冠之間飛過一群鳥，陽光落在林間空地。'],['回到步道入口','沿著石階走回森林入口。']],
 yoga:[['開始一輪呼吸','看著光圈慢慢放大再縮小，跟著吸氣、吐氣。'],['坐下放鬆','熊熊坐在瑜伽墊旁，玻璃門外的葉影慢慢晃過。']],
 museum:[['看第一幅作品','第一幅是〈潮線〉，看海水與沙灘之間留下的紋理。'],['翻到下一幅','第二幅是〈雪松坡〉，看山徑上的光和陰影。'],['看最後一幅','第三幅是〈黃昏的灣〉，天空還亮著，岸上的燈已經亮了。']],
 boutique:[['打開精品櫥窗','暖燈亮起，第一格展出玫瑰色手袋。'],['看看晚宴款','轉到第二格：深色晚宴包配上金色提把。'],['看看旅行款','第三格是奶油色旅行包，放在面海的櫥窗裡。']],
 castle:[['走上觀景露台','熊熊穿過石拱門，走上能看見整座海灣的露台。'],['等城堡亮燈','天色轉藍，城堡塔樓和露台上的燈一盞盞亮起。'],['回到白天','晨光照進露台，遠方的船又看得見了。']],
 chef:[['入座，點亮燭台','花園裡只擺了一桌，主廚點亮燭台。'],['上第一道：南瓜濃湯','熱湯剛端上桌，湯面還冒著熱氣。'],['上主菜：香草烤魚','主廚把香草烤魚和烤檸檬端到桌上。']],
};
const jadeHorizon='<path d="M0 236h760v244H0z" fill="#6da6a1"/><path d="M0 252q150-53 276-24 144 31 237-9t247 3v41H0z" fill="#779a84"/><path class="x-water" d="M0 286q91-18 186 2t191-4 201-2 182-3M0 313q118-18 211 3t219-6 172 6 158-8M30 344q87-13 155 0m223 0q91-10 170 1m39-32 120-4" fill="none" stroke="#daebd2" stroke-width="3" opacity=".7"/><g class="x-sail"><path d="M582 278h51l-10 8h-31z" fill="#e9c89e"/><path d="M605 240v37h-19zM608 249v28h15z" fill="#fff1d1"/></g>';
const jadePine=(x,y,s=1)=>'<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M-4-74H5L9 10H-8z" fill="#796050"/><path d="M0-151 35-64h-12l23 43h-92l22-42h-12z" fill="#52765e"/><path d="M0-151v130h-46l22-42h-12z" fill="#7c9b70"/></g>';
const jadeGlows='<g class="x-fireflies" fill="#ffe6a2"><circle cx="142" cy="263" r="3"/><circle cx="275" cy="234" r="4"/><circle cx="392" cy="272" r="3"/><circle cx="524" cy="250" r="4"/><circle cx="600" cy="275" r="3"/></g>';
const jadeFlowers='<g fill="#dda090"><circle cx="52" cy="272" r="5"/><circle cx="69" cy="265" r="4"/><circle cx="92" cy="271" r="6"/><circle cx="668" cy="275" r="5"/><circle cx="710" cy="260" r="5"/><circle cx="727" cy="274" r="4"/></g>';
const jadeWindow='<path d="M450 306V150a103 103 0 0 1 206 0v156z" fill="#ced4ac" stroke="#b79677" stroke-width="11"/><path d="M459 295V150a94 94 0 0 1 188 0v145z" fill="#9bbcb0"/><path d="M459 212q65-27 188-13v96H459z" fill="#6d9f94"/><path class="x-water" d="M465 248q56-7 92-1t82 2m-155 21q25-4 45 0m44 0q28-4 53 0" fill="none" stroke="#d8e8ca" stroke-width="3"/><path d="M553 53v244m-93-102h186" stroke="#efdfb8" stroke-width="6"/>';
const jadeFloor='<path d="M0 316h760v164H0z" fill="#c0a17f"/><path d="M0 337h760M0 370h760M0 419h760M85 480l143-164m-16 164 91-164m245 164-90-164m215 164-132-164" fill="none" stroke="#efd5ad" stroke-width="2" opacity=".67"/>';
const jadeExhibit='<path d="M177 86h405v245H177z" fill="#a98262"/><path d="M188 97h383v223H188z" fill="#e2c8a3"/><path d="M208 116h343v185H208z" fill="#efe2c4"/>';
const jadeExArt={
 pool:'<path d="M0 0h760v480H0z" fill="#bfd6b7"/><circle cx="594" cy="92" r="53" fill="#f4d99e"/>'+jadeHorizon+
  '<path d="M0 286h760v194H0z" fill="#d9c19a"/><path d="M96 285h565l72 168H16z" fill="#e5d8ad"/><path d="M117 291h524l64 142H47z" fill="#4f9b9f" stroke="#e7edcc" stroke-width="6"/><path class="x-water" d="M111 320h547m-565 35h578m-595 35h608m-612 26h619" fill="none" stroke="#c4e9d0" stroke-dasharray="45 28" stroke-width="3"/><path d="M621 329v53m16-54v58m-16-22h16m-16-9h16m-16-9h16" stroke="#eeece0" stroke-width="4" fill="none"/><path d="m30 301 58 3-11 12H20zm656 0 53-3 8 14-54 3z" fill="#f3dfbb" stroke="#aa876c" stroke-width="3"/><g class="x-pool-splash" fill="none" stroke="#eef8d9" stroke-width="3"><ellipse cx="375" cy="385" rx="32" ry="9"/><ellipse cx="375" cy="385" rx="63" ry="17"/><path d="M346 375q-12-18-29-22m80 22q12-18 29-22"/></g>',
 beach:'<path d="M0 0h760v480H0z" fill="#c5d7bd"/><circle cx="137" cy="87" r="45" fill="#f2d799"/>'+jadeHorizon+
  '<path d="M0 367q143-39 263-27t218-15 279-37v192H0z" fill="#e1c79a"/><path class="x-surf" d="M0 365q143-39 263-27t218-15 279-37m-760 94q160-41 270-29t232-19 258-33" fill="none" stroke="#f8eed1" stroke-width="7"/><path d="M14 480l118-101 62 0-55 101z" fill="#a98165" stroke="#e4c197" stroke-width="3"/><path d="m31 460 116 0m-95-19 104 0m-83-18h92m-73-17h84" stroke="#e9c29b" stroke-width="3"/><path d="M634 359v72m-63-65q64-66 129 0z" stroke="#b78268" stroke-width="4" fill="#eed9b0"/><path d="M605 366q32-66 65 0z" fill="#cc8a78"/><g class="x-shell"><path d="M469 422q-38-28-11-49 24-19 51 0 25 20-13 49l-12 5z" fill="#edb0a0" stroke="#a97468" stroke-width="3"/><path d="m483 422-13-49m13 49 9-50m-10 50-30-35m32 35 25-34" fill="none" stroke="#f6d0b6" stroke-width="3"/></g>',
 forest:'<path d="M0 0h760v480H0z" fill="#a4b993"/><path d="M0 219 160 96l123 100L449 88l170 114L760 107v373H0z" fill="#76947a"/><path d="M0 285q173-70 360-22t400 11v206H0z" fill="#6c866a"/><path d="M240 480q185-117 120-147t35-60q-158 39-80 77t-219 130z" fill="#c7ad83"/>'+
  [[35,305,1.5],[118,273,1.1],[184,332,1.31],[260,282,.82],[496,296,.97],[550,341,1.35],[644,284,1.25],[725,321,1.63]].map(t=>jadePine(...t)).join('')+
  '<path class="x-rays" d="M391 0h41l-99 426-84 8zM460 0h27l-63 368-62 10z" fill="#f9eab1"/><g class="x-birds" fill="none" stroke="#f4e2bc" stroke-width="3"><path d="M430 127q10-8 20 2 11-10 20-4m23 22q8-7 16 1 10-9 20-5m-123 13q10-8 18 1 10-11 19-6"/></g>'+jadeGlows,
 yoga:'<path d="M0 0h760v480H0z" fill="#b3c29c"/><path d="M0 255h760v225H0z" fill="#96a781"/>'+[[48,307,1.6],[158,277,1.33],[305,245,1.13],[459,261,1.1],[632,286,1.37],[741,306,1.6]].map(t=>jadePine(...t)).join('')+
  '<path d="M36 337V154L380 26l344 128v183z" fill="#cce0b8" fill-opacity=".56" stroke="#567a67" stroke-width="7"/><path d="M36 156h688M155 111v226m109-264v264M380 27v310m116-265v265m110-224v224" fill="none" stroke="#618477" stroke-width="5"/>'+jadeFloor+
  '<path d="M141 363h165l-50 68H68zm229 0h149l37 68H328z" fill="#b77e75" stroke="#e5b69d" stroke-width="4"/><path d="M199 367h52m153 2h76" stroke="#e9c7a4" stroke-width="3"/><circle class="x-breath" cx="380" cy="192" r="50" fill="#f8e7b8" fill-opacity=".47" stroke="#f9e6ad" stroke-width="3"/><path class="x-rays" d="M417 80h26L260 446H137z" fill="#f8e8b6"/>',
 museum:'<path d="M0 0h760v480H0z" fill="#f0e4cb"/><path d="M0 0h760l-130 52H130zM0 0l130 52v274L0 418zM760 0 630 52v274l130 92z" fill="#d8c3a2"/>'+jadeFloor+jadeExhibit+
  '<g class="x-art x-art-a"><path d="M216 123h327v173H216z" fill="#84a9a0"/><path d="M216 246q99-74 184-38 81 24 143-21v109H216z" fill="#d9bf92"/><path class="x-water" d="M216 240q99-70 184-34 81 24 143-21" fill="none" stroke="#fff1cb" stroke-width="5"/></g><g class="x-art x-art-b"><path d="M216 123h327v173H216z" fill="#a4b18c"/><path d="M216 265q113-154 209-48 61-30 118 3v76H216z" fill="#6f8f70"/><path d="M316 296q93-77 69-86" fill="none" stroke="#d6b887" stroke-width="8"/></g><g class="x-art x-art-c"><path d="M216 123h327v173H216z" fill="#db9f85"/><circle cx="451" cy="205" r="43" fill="#f4d18e"/><path d="M216 236q164-25 327 0v60H216z" fill="#688e85"/><path d="M237 261h116m54 12h112" stroke="#d0ccad" stroke-width="3"/></g><path class="x-rays" d="M258 0h120L183 333h-99z" fill="#fff8db"/><path d="M601 334h68v52h-68z" fill="#f4e4c2"/><path d="M636 332q-53-32-9-56 39-11 32 19t-42-3" fill="none" stroke="#b18a69" stroke-width="7"/>',
 boutique:'<path d="M0 0h760v480H0z" fill="#e3c6ad"/>'+jadeFloor+
  '<path d="M88 329V157a95 95 0 0 1 190 0v172zm197 0V157a95 95 0 0 1 190 0v172zm197 0V157a95 95 0 0 1 190 0v172z" fill="#c6a585" stroke="#a78569" stroke-width="6"/><path d="M103 315V157a80 80 0 0 1 160 0v158zm197 0V157a80 80 0 0 1 160 0v158zm197 0V157a80 80 0 0 1 160 0v158z" fill="#acb59a"/><path class="x-shop-glow" d="M302 316V155a78 78 0 0 1 156 0v161z" fill="#ffdda3"/><path d="M316 277h127v47H316z" fill="#d9bc96"/><path d="m128 241 29-65-5-29 18-14 14 10 15-10 17 14-5 29 32 65z" fill="#b77774"/><path d="M518 278h119v18H518z" fill="#caac8b"/><path d="M545 251h65v27h-65z" fill="#c49a78"/><g class="x-bag"><path d="M333 214h95l-7 60h-81z" fill="currentColor" stroke="#855e4c" stroke-width="3"/><path d="M355 213v-10a26 26 0 0 1 52 0v10" fill="none" stroke="#a88358" stroke-width="6"/><path d="m340 235 80 23m-78-1 74-24m-73 32 71-8" fill="none" stroke="#e8c092" opacity=".56" stroke-width="2"/></g>',
 castle:'<path d="M0 0h760v480H0z" fill="#bfd2b8"/><circle cx="590" cy="88" r="48" fill="#f4dfaa"/>'+jadeHorizon+
  '<path d="M0 286h760v194H0z" fill="#bda383"/><path d="M0 371h760m-760 50h760m-669 59 118-167m453 167-111-167" stroke="#e2c9a0" fill="none" stroke-width="3"/><path d="M0 319h760v22H0z" fill="#b89b7c"/><path d="M23 284h64v101H23zm650 0h64v101h-64z" fill="#d8c49f"/><path d="M8 297V63h116v22h-14v215zm628 3V85h-14V63h132v234z" fill="#cbb18f"/><path d="M127 0h506l-44 42H171z" fill="#a9876b"/><path d="M125 0v121a255 255 0 0 1 510 0V0z" fill="#cdb593"/><path d="M90 0v244m580-244v244" stroke="#e7d0a6" stroke-width="10"/><path class="x-castle-night" d="M0 0h760v480H0z" fill="#233a51"/><g class="x-castle-lamps"><circle cx="89" cy="264" r="33" fill="#ffe2a1" opacity=".3"/><circle cx="671" cy="264" r="33" fill="#ffe2a1" opacity=".3"/><path d="M80 247h18v25H80zm582 0h18v25h-18z" fill="#ffe0a0"/></g>'+jadeFlowers,
 chef:'<path d="M0 0h760v480H0z" fill="#708c77"/><circle cx="652" cy="91" r="38" fill="#e0c49b"/><path d="M0 263q160-39 328-23 172 20 432-30v270H0z" fill="#809171"/>'+[[45,280,1.24],[128,264,1],[651,271,1.1],[740,284,1.4]].map(t=>jadePine(...t)).join('')+
  '<path d="M24 83q160 69 356 0 193 66 356 0" stroke="#594c40" stroke-width="3" fill="none"/><g class="x-chef-lights" fill="#ffe2a1"><circle cx="78" cy="101" r="6"/><circle cx="152" cy="114" r="6"/><circle cx="225" cy="116" r="6"/><circle cx="300" cy="105" r="6"/><circle cx="380" cy="86" r="6"/><circle cx="456" cy="105" r="6"/><circle cx="530" cy="116" r="6"/><circle cx="604" cy="113" r="6"/><circle cx="680" cy="101" r="6"/></g><path d="M137 338h486l-39 142H176z" fill="#c9a480"/><ellipse cx="380" cy="333" rx="259" ry="64" fill="#ead2a7" stroke="#be9876" stroke-width="4"/><path d="M224 313h12v36h-12zm303 0h12v36h-12z" fill="#f7e0b3"/><path class="x-flames" d="M230 311q-11-11 0-24 12 13 0 24m303 0q-11-11 0-24 12 13 0 24" fill="#f5c477"/><g class="x-course"><ellipse cx="380" cy="333" rx="111" ry="39" fill="#f4e5c4" stroke="#ae8d70" stroke-width="3"/><ellipse class="x-soup" cx="380" cy="332" rx="79" ry="25" fill="#c58957"/><path class="x-fish" d="M325 337q51-32 103-14l21-14-3 27 4 19-23-11q-53 14-102-7z" fill="#aa7857"/><path class="x-steam" d="M358 306q-13-17 0-29t-2-29m38 60q13-18 0-29t2-29" stroke="#f6dfbb" stroke-width="4" fill="none" stroke-linecap="round"/></g>'+jadeFlowers,
 omakase:'<path d="M0 0h760v480H0z" fill="#d7ba99"/>'+jadeWindow+
  '<path d="M0 0h760v51H0zM0 274h760v25H0z" fill="#aa8266"/><path d="M103 61h190v212H103z" fill="#dbc19d" stroke="#967d64" stroke-width="5"/><path d="M103 112h190m-190 53h190m-190 53h190m-128-157v212m62-212v212" stroke="#aa8d70" stroke-width="4"/><path d="M339 0v65m-27 0h54l-8 40h-39z" fill="#e3bc86" stroke="#a58163" stroke-width="4"/>'+jadeSushiChef+'<path d="M0 329 137 299h486l137 30v151H0z" fill="#b68863"/><path d="M0 329 137 299h486l137 30-89 64H89z" fill="#d0a278"/><path d="M0 429h760M0 449h760m-719-113h679m-641 23h601" fill="none" stroke="#eac69a" opacity=".66" stroke-width="3"/><path d="M504 373h123m-122 9h122" stroke="#6d5545" stroke-width="4" stroke-linecap="round"/>'
};
function jadeExperienceMarkup(){
 return Object.entries(jadeExArt).map(([key,art])=>'<template data-experience="'+key+'"><svg class="x-artwork" viewBox="0 0 760 480" aria-hidden="true">'+art+'</svg></template>').join('');
}
const jadeExperienceStyles=`
.x-actions{display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin:12px 0 0}
.x-actions[hidden]{display:none}.x-actions button{min-height:44px;background:#315747;color:#fff8e6;border-color:#315747;padding:6px 12px;text-align:left}.x-actions button:hover{background:#47745d}
.x-progress{color:#705440;font-size:.77rem;letter-spacing:.09em;white-space:nowrap}
.tour-place:has(.x-artwork){background:#b6c3a5}
.tour-place:has(.x-artwork):before{display:none}
.x-artwork{display:block;width:100%;height:100%;transform:scale(1.06);transition:transform .85s cubic-bezier(.14,.68,.31,1)}
.tour-inside .x-artwork{transform:scale(1)}
.tour-inside:not([data-place=hotel]) .tour-scene-bear{left:24%;top:95%;transform:translate(-50%,-100%) scale(.88);transition:left .7s ease,top .7s ease,transform .7s ease,clip-path .45s ease;clip-path:inset(0 0 0 0)}
.tour-inside[data-place=pool]:is([data-ex-step="1"],[data-ex-step="2"]) .tour-scene-bear{left:49%;top:89%;transform:translate(-50%,-100%) scale(.77);clip-path:inset(0 0 35% 0)}
.tour-inside[data-place=pool][data-ex-step="2"] .tour-scene-bear{left:56%;top:74%;transform:translate(-50%,-100%) scale(.65)}
.tour-inside[data-place=beach][data-ex-step="1"] .tour-scene-bear{left:48%;top:82%}
.tour-inside[data-place=beach][data-ex-step="2"] .tour-scene-bear{left:56%;top:91%;transform:translate(-50%,-100%) rotate(9deg) scale(.81)}
.tour-inside[data-place=forest][data-ex-step="1"] .tour-scene-bear{left:41%;top:88%;transform:translate(-50%,-100%) scale(.71)}
.tour-inside[data-place=forest][data-ex-step="2"] .tour-scene-bear{left:49%;top:71%;transform:translate(-50%,-100%) scale(.54)}
.tour-inside[data-place=yoga]:not([data-ex-step="0"]) .tour-scene-bear{left:58%;top:88%;transform:translate(-50%,-100%) scale(.75)}
.tour-inside[data-place=castle]:is([data-ex-step="1"],[data-ex-step="2"]) .tour-scene-bear{left:52%;top:77%;transform:translate(-50%,-100%) scale(.72)}
.tour-inside:is([data-place=chef],[data-place=omakase]):not([data-ex-step="0"]) .tour-scene-bear{left:20%;top:96%;transform:translate(-50%,-100%) scale(.71)}
.x-water{animation:x-water 4.5s ease-in-out infinite}
@keyframes x-water{50%{transform:translate(-14px,3px);opacity:.46}}
.x-sail{animation:x-sail 10s ease-in-out infinite}
@keyframes x-sail{50%{transform:translate(-45px,3px)}}
.x-surf{animation:x-surf 3.2s ease-in-out infinite}
@keyframes x-surf{0%,100%{transform:translateY(-7px);opacity:.59}50%{transform:translateY(11px);opacity:.92}}
.x-rays{animation:x-rays 6s ease-in-out infinite}
@keyframes x-rays{0%,100%{opacity:.09;transform:translateX(-14px)}50%{opacity:.36;transform:translateX(8px)}}
.x-pool-splash,.x-shell,.x-fireflies,.x-birds,.x-breath,.x-shop-glow,.x-bag,.x-art-b,.x-art-c,.x-castle-night,.x-castle-lamps,.x-chef-lights,.x-flames,.x-course,.x-soup,.x-fish,.x-sushi,.x-steam{opacity:0;transition:opacity .55s ease}
[data-place=pool]:is([data-ex-step="1"],[data-ex-step="2"]) .x-pool-splash{opacity:1;animation:x-ripple 1.65s ease-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes x-ripple{from{transform:scale(.73);opacity:1}to{transform:scale(1.22);opacity:.12}}
[data-place=beach][data-ex-step="2"] .x-shell{opacity:1;animation:x-pop .65s ease-out both}
[data-place=forest]:not([data-ex-step="0"]) .x-fireflies{opacity:1;animation:x-twinkle 3s ease-in-out infinite}
[data-place=forest][data-ex-step="2"] .x-birds{opacity:1;animation:x-birds 4.5s ease-in-out infinite}
@keyframes x-birds{from{transform:translateX(-80px)}to{transform:translate(111px,-48px)}}
@keyframes x-twinkle{0%,100%{opacity:.35}50%{opacity:.9}}
[data-place=yoga][data-ex-step="1"] .x-breath{opacity:1;animation:x-breathe 6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes x-breathe{0%,100%{transform:scale(.74);opacity:.52}50%{transform:scale(1.6);opacity:1}}
.x-art-a{transition:opacity .55s ease}
[data-place=museum][data-ex-step="2"] .x-art-b,[data-place=museum][data-ex-step="3"] .x-art-c{opacity:1}
[data-place=museum]:is([data-ex-step="2"],[data-ex-step="3"]) .x-art-a{opacity:0}
[data-place=museum][data-ex-step="1"] .x-art-a{animation:x-pop .64s ease-out both}
.x-art{transform-box:fill-box;transform-origin:center}
[data-place=boutique]:not([data-ex-step="0"]) .x-shop-glow{opacity:.67}
[data-place=boutique]:not([data-ex-step="0"]) .x-bag{opacity:1;color:#a96e72;transform-box:fill-box;transform-origin:center;transition:color .45s ease,opacity .55s ease,transform .55s ease}
[data-place=boutique][data-ex-step="2"] .x-bag{color:#4a4e55;transform:scale(.88)}
[data-place=boutique][data-ex-step="3"] .x-bag{color:#e2c699;transform:scaleX(1.17)}
[data-place=castle][data-ex-step="2"] .x-castle-night{opacity:.65}
[data-place=castle][data-ex-step="2"] .x-castle-lamps{opacity:1;animation:x-lantern 1.1s .35s ease-out both}
@keyframes x-lantern{from{opacity:.03}to{opacity:1}}
[data-place=chef]:not([data-ex-step="0"]) :is(.x-flames,.x-chef-lights){opacity:1;animation:x-twinkle 2.8s ease-in-out infinite}
[data-place=chef]:is([data-ex-step="2"],[data-ex-step="3"]) .x-course,[data-place=chef][data-ex-step="2"] .x-soup,[data-place=chef][data-ex-step="3"] .x-fish{opacity:1}
[data-place=chef]:is([data-ex-step="2"],[data-ex-step="3"]) .x-steam,[data-place=omakase][data-ex-step="3"] .x-steam{opacity:1;animation:x-steam 2.1s ease-out infinite}
@keyframes x-steam{0%{transform:translateY(4px);opacity:0}45%{opacity:.8}100%{transform:translateY(-15px);opacity:0}}
[data-place=omakase]:not([data-ex-step="0"]) .x-sushi{opacity:1;color:#ebd8b4;transition:color .45s ease,opacity .55s ease}
[data-place=omakase][data-ex-step="2"] .x-sushi{color:#bb6867}
[data-place=omakase][data-ex-step="3"] .x-sushi{color:#bf8869}
.x-pop{animation:x-pop .7s cubic-bezier(.19,.68,.27,1) both;transform-box:fill-box;transform-origin:center}
@keyframes x-pop{from{transform:translate(0,-17px) scale(.94);opacity:.18}to{transform:translate(0,0) scale(1);opacity:1}}
.jade-resort:has(#jade-pause:checked) .jade-visit *{animation:none!important;transition:none!important}
`;
function jadeTourMarkup(avatar,guest){
 const menu=guest?jadeOmakase.map(([name,dish,color,,line])=>[name,dish,color,0,line,'']):jadeOmakase;
 return '<dialog class="jade-visit" aria-labelledby="jade-visit-title"><div class="tour-sheet"><header class="tour-header"><div><p class="jade-kicker" data-tour-kicker></p><h2 id="jade-visit-title" data-tour-title>翡翠灣</h2></div><button type="button" data-tour-close>回島圖</button></header><div class="tour-scene" data-tour-scene><div class="tour-hotel">'+jadeHotelArt+'</div><div class="tour-place" aria-hidden="true"></div><div class="sushi-plating" aria-hidden="true"></div><div class="tour-scene-bear" aria-hidden="true">'+avatar+'</div><div class="suite-floor" aria-hidden="true">海景樓層　·　02</div>'+jadeSuiteMarkup(avatar)+'</div><p class="tour-story" data-tour-story aria-live="polite"></p><div class="suite-actions" role="group" aria-label="飯店房間操作" hidden><button type="button" data-suite-checkin>入住海景套房 →</button><button type="button" data-suite-sleep hidden>躺下睡覺</button><button type="button" data-suite-light hidden aria-pressed="false">打開床頭燈</button><button type="button" data-suite-back hidden>回飯店大廳</button></div><div class="x-actions" role="group" aria-label="景點互動" hidden><button type="button" data-ex-next></button><span class="x-progress" data-ex-progress></span></div><div class="sushi-service" hidden><div class="sushi-host"><p class="jade-kicker" data-sushi-stage>潮師傅 / 吧台</p><h3 class="sushi-course" data-sushi-course>今晚的 Omakase</h3><p class="sushi-note" data-sushi-note hidden></p></div><div class="sushi-controls"><button type="button" data-sushi-next>請師傅上菜</button><button type="button" data-sushi-prev hidden>上一道</button><output data-sushi-progress aria-label="上菜進度"></output></div>'+jadeOmakaseMenu(menu,guest)+'</div></div></dialog>'+jadeExperienceMarkup()+jadeSushiDishes()+'<div data-sushi-data hidden>'+escape(JSON.stringify(menu))+'</div>';
}
function jadeTourClient(experiences){
 const resort=document.querySelector('.jade-resort'),map=resort?.querySelector('.jade-map');
 if(!map)return;
 const world=map.querySelector('.jade-world'),actor=map.querySelector('.jade-bear'),status=map.querySelector('[data-tour-status]'),skip=map.querySelector('[data-tour-skip]');
 const dialog=resort.querySelector('.jade-visit'),scene=dialog.querySelector('[data-tour-scene]');
 if(typeof dialog.showModal!=='function'||!world||!actor)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),pause=resort.querySelector('#jade-pause');
 const title=dialog.querySelector('[data-tour-title]'),kicker=dialog.querySelector('[data-tour-kicker]'),story=dialog.querySelector('[data-tour-story]');
 const place=scene.querySelector('.tour-place');
 const sushiService=dialog.querySelector('.sushi-service'),sushiPlating=scene.querySelector('.sushi-plating');
 const sushi=JSON.parse(resort.querySelector('[data-sushi-data]').textContent);
 const sushiNext=dialog.querySelector('[data-sushi-next]'),sushiPrev=dialog.querySelector('[data-sushi-prev]');
 const sushiStage=dialog.querySelector('[data-sushi-stage]'),sushiCourse=dialog.querySelector('[data-sushi-course]');
 const sushiProgress=dialog.querySelector('[data-sushi-progress]'),sushiNote=dialog.querySelector('[data-sushi-note]');
 let sushiIndex=-1;
 function renderSushi(){
  const row=sushi[sushiIndex];
  sushiPrev.hidden=sushiIndex<0;
  sushiProgress.textContent=(sushiIndex+1)+' / '+sushi.length;
  sushiStage.textContent=row?'潮師傅 / '+(sushiIndex<7?'前菜':sushiIndex<16?'握壽司':'手捲與收尾'):'潮師傅 / 吧台';
  sushiCourse.textContent=row?(row[3]?'★ ':'')+row[0]:'今晚的 Omakase';
  story.textContent=row?'「'+row[4]+'」':'「晚上好，我是潮師傅。今晚有 22 道，想從生蠔開始嗎？」';
  sushiNote.hidden=!row?.[5];sushiNote.textContent=row?.[5]?'Kitty 的試吃筆記：'+row[5]:'';
  sushiNext.textContent=sushiIndex===-1?'請師傅上菜':sushiIndex===sushi.length-1?'從第一道再吃一次 ↻':'下一道 →';
  sushiPlating.replaceChildren();
  if(!row)return;
  const dish=resort.querySelector('template[data-sushi-dish="'+row[1]+'"]').content.cloneNode(true);
  dish.firstElementChild.style.color=row[2];sushiPlating.append(dish);
  const chef=place.querySelector('.sushi-chef');
  chef?.classList.remove('sushi-preparing');
  if(chef){void chef.getBoundingClientRect();chef.classList.add('sushi-preparing');}
 }
 sushiNext.addEventListener('click',()=>{if(!dialog.open||sushiService.hidden)return;sushiIndex=sushiIndex===sushi.length-1?0:sushiIndex+1;renderSushi();});
 sushiPrev.addEventListener('click',()=>{if(!dialog.open||sushiService.hidden||sushiIndex<0)return;sushiIndex--;renderSushi();if(sushiIndex<0)sushiNext.focus({preventScroll:true});});
 const exActions=dialog.querySelector('.x-actions'),exButton=dialog.querySelector('[data-ex-next]'),exProgress=dialog.querySelector('[data-ex-progress]');
 let exKey=null,exStep=0,exIntro='';
 const updateExperience=()=>{
  const steps=experiences[exKey];
  if(!steps)return;
  scene.dataset.exStep=String(exStep);
  exButton.textContent=steps[exStep]?.[0]||'再體驗一次 ↻';
  exProgress.textContent=exStep+' / '+steps.length;
  story.textContent=exStep===0?exIntro:steps[exStep-1][1];
 };
 function insidePlace(key,intro){
  scene.classList.add('tour-inside');story.textContent=intro;
  if(key==='omakase'){sushiService.hidden=false;renderSushi();return;}
  if(!Object.hasOwn(experiences,key))return;
  exKey=key;exIntro=intro;exActions.hidden=false;updateExperience();
 }
 exButton.addEventListener('click',()=>{
  if(!exKey||!dialog.open)return;
  const count=experiences[exKey].length;
  exStep=exStep===count?0:exStep+1;
  updateExperience();
  const food=exKey==='chef'?place.querySelector('.x-course'):null;
  if(food){
   food.classList.remove('x-pop');
   if(exStep>=2){void food.getBoundingClientRect();food.classList.add('x-pop');}
  }
 });
 const suiteActions=dialog.querySelector('.suite-actions');
 const checkin=dialog.querySelector('[data-suite-checkin]'),sleep=dialog.querySelector('[data-suite-sleep]');
 const lamp=dialog.querySelector('[data-suite-light]'),lobby=dialog.querySelector('[data-suite-back]');
 let suiteTimer=0, resting=false;
 const resetSuite=()=>{
  clearTimeout(suiteTimer);resting=false;
  scene.classList.remove('tour-upstairs','tour-suite','suite-night','suite-lit','suite-curtains','suite-dawn','suite-sleeping');
  suiteActions.hidden=true;
  checkin.hidden=false;checkin.disabled=false;sleep.hidden=lamp.hidden=lobby.hidden=true;
  sleep.textContent='躺下睡覺';lamp.textContent='打開床頭燈';lamp.setAttribute('aria-pressed','false');
 };
 const lampOn=on=>{
  scene.classList.toggle('suite-lit',on);lamp.setAttribute('aria-pressed',String(on));
  lamp.textContent=on?'關掉床頭燈':'打開床頭燈';
 };
 function insideHotel(focus=false){
  resetSuite();scene.classList.add('tour-inside');scene.classList.remove('tour-entering');
  title.textContent='海崖飯店';kicker.textContent='STOP 01 / THE COVE HOTEL';
  story.textContent='穿過拱門來到面海大廳。從這裡可以上樓入住海景套房。';
  suiteActions.hidden=false;
  if(focus)checkin.focus({preventScroll:true});
 }
 checkin.addEventListener('click',()=>{
  if(scene.dataset.place!=='hotel'||scene.classList.contains('tour-suite')||checkin.disabled)return;
  checkin.disabled=true;scene.classList.add('tour-upstairs');
  story.textContent='從大廳上到二樓，房門打開了。';
  const enter=()=>{
   if(!dialog.open)return;
   scene.classList.remove('tour-upstairs');
   scene.classList.add('tour-suite');
   title.textContent='海景套房';kicker.textContent='ROOM 02 / THE COVE HOTEL';
   story.textContent='窗外是翡翠灣。床已經鋪好了，想休息就讓熊熊鑽進被窩。';
   checkin.hidden=true;sleep.hidden=lamp.hidden=lobby.hidden=false;
   sleep.focus({preventScroll:true});
  };
  if(immediate())enter();else suiteTimer=setTimeout(enter,640);
 });
 sleep.addEventListener('click',()=>{
  if(!scene.classList.contains('tour-suite'))return;
  resting=!resting;
  scene.classList.toggle('suite-sleeping',resting);
  scene.classList.toggle('suite-curtains',resting);
  scene.classList.toggle('suite-night',resting);
  scene.classList.toggle('suite-dawn',!resting);
  lampOn(false);
  sleep.textContent=resting?'醒來看海':'躺下睡覺';
  story.textContent=resting?'熊熊鑽進被窩。窗簾闔上，床頭燈也熄了。':'早安！窗簾拉開，陽光正從海面照進套房。';
 });
 lamp.addEventListener('click',()=>lampOn(!scene.classList.contains('suite-lit')));
 lobby.addEventListener('click',()=>insideHotel(true));
 const nodes={
  dock:[415,526],trail:[394,480],bend:[342,431],grove:[296,382],forest:[283,337],
  yoga:[380,473],cross:[468,425],boutique:[503,404],galleryPath:[570,377],museum:[638,413],
  beachPath:[718,446],beach:[790,478],hotelWalk:[363,295],hotel:[436,273],
  ridge:[491,222],castle:[556,176],poolWalk:[533,278],pool:[580,294],
  east:[668,294],chef:[722,263],counterWalk:[783,302],omakase:[841,378]
 };
 const edges=[
  ['dock','trail'],['trail','yoga'],['trail','bend'],['yoga','cross'],['bend','grove'],['grove','forest'],['forest','hotelWalk'],
  ['hotelWalk','hotel'],['hotel','ridge'],['ridge','castle'],['hotel','poolWalk'],['poolWalk','pool'],['pool','east'],['east','chef'],
  ['east','counterWalk'],['counterWalk','omakase'],['cross','boutique'],['boutique','galleryPath'],['galleryPath','museum'],
  ['museum','beachPath'],['beachPath','beach'],['beach','omakase'],['pool','galleryPath'],['east','museum']
 ];
 let position=nodes.dock, current='dock',frame=0,reveal=0,active=null,returnLink=null,serial=0;
 const point=(p)=>{actor.style.setProperty('--bear-x',p[0]/10.8+'%');actor.style.setProperty('--bear-y',p[1]/6.2+'%');};
 point(position);resort.classList.add('tour-ready');
 const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 function route(from,to){
  const open=new Set(Object.keys(nodes)), lengths={[from]:0}, parents={};
  while(open.size){
   const next=[...open].reduce((a,b)=>(lengths[a]??Infinity)<=(lengths[b]??Infinity)?a:b);
   if(next===to)break;
   open.delete(next);
   if(lengths[next]===undefined)break;
   for(const [a,b] of edges){
    const v=a===next?b:b===next?a:null;
    if(!v||!open.has(v))continue;
    const d=lengths[next]+distance(nodes[next],nodes[v]);
    if(d<(lengths[v]??Infinity)){lengths[v]=d;parents[v]=next;}
   }
  }
  const track=[to];
  while(track[0]!==from&&parents[track[0]])track.unshift(parents[track[0]]);
  return track.map(k=>nodes[k]);
 }
 function camera(p,scale){
  const x=50-p[0]/10.8,y=50-p[1]/6.2, limit=(scale-1)*50;
  const clamp=v=>Math.max(-limit,Math.min(limit,v*scale));
  world.style.transform='translate('+clamp(x)+'%,'+clamp(y)+'%) scale('+scale+')';
 }
 function immediate(){return reduce.matches||pause.checked;}
 function arrive(key,link,instant){
  cancelAnimationFrame(frame);clearTimeout(reveal);active=null;current=key;position=nodes[key];point(position);
  actor.classList.remove('is-walking');map.classList.remove('is-travelling');
  if(instant)camera(position,1);
  const content=resort.querySelector('#jade-stop-'+key);
  resort.querySelector('.jade-detail-default')?.classList.remove('jade-detail-default');
  content.classList.add('jade-detail-default');
  resort.dataset.initial=key;
  for(const stop of resort.querySelectorAll('[data-jade-stop]')){
   if(stop.dataset.jadeStop===key)stop.setAttribute('aria-current','location');
   else stop.removeAttribute('aria-current');
  }
  const entry=link.dataset;
  const artwork=resort.querySelector('template[data-experience="'+key+'"]');
  const art=artwork?artwork.content.cloneNode(true):content.querySelector('svg').cloneNode(true);
  place.replaceChildren(art);
  returnLink=link;scene.dataset.place=key;
  exKey=null;exStep=0;scene.dataset.exStep='0';exActions.hidden=true;
  sushiIndex=-1;sushiService.hidden=true;sushiPlating.replaceChildren();sushiService.querySelector('details').open=false;
  resetSuite();
  scene.classList.remove('tour-entering','tour-inside','tour-still');
  if(instant)scene.classList.add('tour-inside','tour-still');
  title.textContent=entry.name;kicker.textContent='STOP '+entry.number+' / '+entry.english;
  story.textContent=instant?entry.inside+'。'+entry.story:entry.door+'…';
  if(!dialog.open)dialog.showModal();
  if(instant){if(key==='hotel')insideHotel();else insidePlace(key,entry.inside+'。'+entry.story);}
  if(!instant){
   void scene.offsetWidth;
   scene.classList.add('tour-entering');
   reveal=setTimeout(()=>{
    if(!dialog.open)return;
    if(key==='hotel')insideHotel();
    else insidePlace(key,entry.inside+'。'+entry.story);
   },key==='hotel'?1380:1000);
  }
 }
 function walk(link){
  const key=link.dataset.jadeStop;if(!Object.hasOwn(nodes,key))return;
  const run=++serial;cancelAnimationFrame(frame);clearTimeout(reveal);
  if(immediate()||key===current&&!active){arrive(key,link,immediate());return;}
  const from=active?Object.keys(nodes).reduce((a,b)=>distance(position,nodes[a])<=distance(position,nodes[b])?a:b):current;
  active={key,link};
  const path=[position,...route(from,key)].filter((p,i,all)=>i===0||distance(p,all[i-1])>.2);
  const segments=path.slice(1).map((p,i)=>distance(path[i],p));
  const length=segments.reduce((a,b)=>a+b,0);
  if(length<1){arrive(key,link,false);return;}
  const duration=Math.max(900,Math.min(2700,420+length*4.2));
  const bounds=map.getBoundingClientRect();
  if(bounds.top<0||bounds.bottom>innerHeight)map.scrollIntoView({block:'nearest',behavior:'instant'});
  status.textContent='熊熊正走向'+link.dataset.name;
  actor.classList.add('is-walking');map.classList.add('is-travelling');
  let start;
  function step(t){
   if(run!==serial)return;
   start??=t;
   const progress=Math.min(1,(t-start)/duration);
   let remain=progress*length,i=0;
   while(i<segments.length-1&&remain>segments[i]){remain-=segments[i];i++;}
   const a=path[i],b=path[i+1],part=Math.min(1,remain/segments[i]);
   position=[a[0]+(b[0]-a[0])*part,a[1]+(b[1]-a[1])*part];
   actor.classList.toggle('faces-left',b[0]<a[0]);
   point(position);camera(position,1+.45*Math.sin(Math.min(1,progress*1.25)*Math.PI/2));
   if(progress<1)frame=requestAnimationFrame(step);
   else arrive(key,link,false);
  }
  frame=requestAnimationFrame(step);
 }
 resort.addEventListener('click',event=>{
  const link=event.target.closest('a[data-jade-stop]');
  if(!link||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.defaultPrevented)return;
  event.preventDefault();walk(link);
 });
 skip.addEventListener('click',()=>{if(active)arrive(active.key,active.link,true);});
 function motionChange(){if(immediate()&&active)arrive(active.key,active.link,true);}
 pause.addEventListener('change',motionChange);reduce.addEventListener('change',motionChange);
 dialog.querySelector('[data-tour-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{
  clearTimeout(reveal);resetSuite();camera(position,1);map.scrollIntoView({block:'nearest',behavior:'instant'});
  if(returnLink)resort.querySelector('.jade-pin[data-jade-stop="'+returnLink.dataset.jadeStop+'"]')?.focus({preventScroll:true});
 });
}
const jadeTourScript='('+jadeTourClient.toString()+')('+JSON.stringify(jadeExperiences)+');';
const jadeTourStyles=`
.jade-map{overflow:hidden}
.jade-world{position:relative;transform-origin:center;will-change:transform}
.jade-map:not(.is-travelling) .jade-world{transition:transform 360ms ease-out}
.jade-bear{position:absolute;z-index:4;left:var(--bear-x,38.4%);top:var(--bear-y,84.8%);width:clamp(38px,6.5%,78px);transform:translate(-50%,-92%);pointer-events:none;display:none;filter:drop-shadow(0 2px 1px #203c3555)}
.tour-ready .jade-bear{display:block}
.jade-bear:after{content:"";position:absolute;left:21%;right:22%;bottom:3%;height:10%;background:#243d3573;border-radius:50%;filter:blur(2px);z-index:-1}
.jade-bear svg,.tour-scene-bear svg{display:block;width:100%;height:auto;overflow:visible}
.jade-bear.faces-left svg{scale:-1 1}
.jade-bear.is-walking svg{transform-origin:50% 90%;animation:tour-step .29s ease-in-out infinite}
@keyframes tour-step{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-11%) rotate(5deg)}}
.tour-hud{position:absolute;z-index:5;bottom:8px;left:8px;right:8px;display:none;align-items:center;justify-content:space-between;gap:8px;padding:6px 9px 6px 12px;border:1px solid #d6c6a2;background:#f9f4e4ed;border-radius:9px;color:#2d4539;font-size:clamp(.75rem,2.5vw,.95rem);box-shadow:0 3px 12px #18332737}
.jade-map.is-travelling .tour-hud{display:flex}
.tour-hud button,.tour-header button{min-height:36px;flex:none;padding:4px 10px;background:#315646;color:#fff9ed;border:1px solid #315646;border-radius:8px;font-size:.82rem}
.tour-hud button:hover,.tour-header button:hover{background:#436e57}
.jade-visit{padding:0;width:min(94vw,790px);max-width:none;max-height:94dvh;border:1px solid #c2ae8a;border-radius:15px;background:#f8f2e2;color:#243e34;overflow:auto;overscroll-behavior:contain;box-shadow:0 28px 100px #162e2a77}
.jade-visit::backdrop{background:#152d2cd1}
.tour-sheet{padding:clamp(10px,2.5vw,22px)}
.tour-header{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:0 0 12px}
.tour-header .jade-kicker{margin:0 0 5px}
.tour-header h2{margin:0;font:650 clamp(1.32rem,4.7vw,2.35rem)/1.16 Georgia,"Noto Serif TC",serif}
.tour-scene{position:relative;overflow:hidden;isolation:isolate;aspect-ratio:760/480;border-radius:10px;background:#cccead}
.tour-hotel,.tour-place,.tour-hotel-art{position:absolute;inset:0;width:100%;height:100%}
.tour-hotel,.tour-place{display:none}
.tour-scene[data-place=hotel] .tour-hotel,.tour-scene:not([data-place=hotel]) .tour-place{display:block}
.tour-facade,.tour-lobby{transition:opacity .48s ease,transform .65s ease;transform-origin:50% 63%}
.tour-lobby{opacity:0;transform:scale(1.06)}
.tour-inside .tour-lobby{opacity:1;transform:scale(1)}
.tour-inside .tour-facade{opacity:0;transform:scale(1.25)}
.tour-door-left,.tour-door-right{transform-box:fill-box}
.tour-door-left{transform-origin:left center}.tour-door-right{transform-origin:right center}
.tour-entering .tour-door-left,.tour-entering .tour-door-right{animation:tour-open .52s .37s ease-in-out both}
@keyframes tour-open{to{transform:scaleX(.1)}}
.tour-place{background:radial-gradient(ellipse at 50% 38%,#ffefba55 0%,transparent 55%),linear-gradient(#a9c6ab 0 55%,#e7d2a6 55% 100%)}
.tour-place:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,#d9d5b825 0px 2px,transparent 2px 37px);opacity:.5}
.tour-scene:is([data-place=pool],[data-place=beach],[data-place=omakase]) .tour-place{background:linear-gradient(#c3ded2 0 43%,#7eaea3 43% 64%,#e4cda0 64%)}
.tour-scene:is([data-place=forest],[data-place=yoga],[data-place=chef]) .tour-place{background:radial-gradient(ellipse at 50% 58%,#e6deb0,transparent 65%),linear-gradient(#719281,#a9b48a 58%,#d0b787 58%)}
.tour-scene:is([data-place=boutique],[data-place=museum],[data-place=castle]) .tour-place{background:radial-gradient(ellipse at 50% 45%,#f5e4b7,transparent 75%),linear-gradient(#d9c09d 0 69%,#aa9b81 69%)}
.tour-place .jade-vignette{position:absolute;width:100%;height:112%;max-height:none;top:-9%;animation:none;transform:scale(.92);transition:transform .65s ease;filter:drop-shadow(0 14px 14px #53433239)}
.tour-inside .tour-place .jade-vignette{transform:scale(1.06)}
.tour-scene-bear{position:absolute;z-index:3;width:16%;left:50%;top:94%;transform:translate(-50%,-100%);filter:drop-shadow(0 3px 3px #3a2d2566);will-change:transform}
.tour-entering .tour-scene-bear{animation:tour-approach 1.14s cubic-bezier(.2,.55,.4,1) both}
.tour-entering .tour-scene-bear svg{transform-origin:50% 92%;animation:tour-step .29s ease-in-out 4}
.tour-entering[data-place=hotel] .tour-scene-bear{animation:tour-hotel-walk 1.36s ease-in-out both}
.tour-inside .tour-scene-bear,.tour-inside[data-place=hotel] .tour-scene-bear{animation:none;left:37%;top:90%;transform:translate(-50%,-100%) scale(.74)}
@keyframes tour-approach{from{transform:translate(-150%,-86%) scale(1.2)}to{transform:translate(-70%,-135%) scale(.62)}}
@keyframes tour-hotel-walk{0%{transform:translate(-75%,-74%) scale(1.25)}72%{opacity:1}100%{transform:translate(-50%,-222%) scale(.42);opacity:0}}
.tour-story{min-height:2.8em;margin:12px 2px 3px;line-height:1.6;font-size:clamp(.86rem,2.7vw,1rem)}
.jade-resort:has(#jade-night:checked) .tour-scene{filter:brightness(.86) saturate(.9)}
.tour-still *{animation:none!important;transition:none!important}
@media(max-width:520px){.tour-header button{min-height:40px}.tour-story{min-height:3.6em}.jade-bear{width:clamp(34px,10vw,52px)}}
@media(prefers-reduced-motion:reduce){.jade-visit *{animation:none!important;transition:none!important}.jade-map:not(.is-travelling) .jade-world{transition:none}}
`;
function jadeResort(url,profile,guest=false){
 const avatar=memberAvatar(profile,true);
 const requested=url.searchParams.get('stop'),index=Math.max(0,jadeStops.findIndex(s=>s[0]===requested));
 const active=jadeStops[index][0];
 const link=(s,i,pin)=>{const entry=jadeEntrances[s[0]];return '<a data-jade-stop="'+s[0]+'" data-number="'+jadeNo(i)+'" data-name="'+escape(s[1])+'" data-english="'+escape(s[2])+'" data-door="'+escape(entry[0])+'" data-inside="'+escape(entry[1])+'" data-story="'+escape(entry[2])+'" href="#jade-stop-'+s[0]+'" '+
   (pin?'class="jade-pin" style="--x:'+s[4]/10.8+'%;--y:'+s[5]/6.2+'%" aria-label="'+jadeNo(i)+' '+escape(s[1])+'" title="'+escape(s[1])+'"':'class="jade-index-link"')+'><span class="jade-number">'+jadeNo(i)+'</span>'+
   (pin?'':'<span><strong>'+escape(s[1])+'</strong><small>'+escape(s[3])+'</small></span><span aria-hidden="true">↗</span>')+'</a>';};
 const selectedStyles=jadeStops.map(([key])=>'.jade-resort:has(#jade-stop-'+key+':target) [data-jade-stop="'+key+'"],.jade-resort:not(:has(.jade-detail:target))[data-initial="'+key+'"] [data-jade-stop="'+key+'"]').join(',')+'{background:#dce3cc}'+
  jadeStops.map(([key])=>'.jade-resort:has(#jade-stop-'+key+':target) .jade-pin[data-jade-stop="'+key+'"],.jade-resort:not(:has(.jade-detail:target))[data-initial="'+key+'"] .jade-pin[data-jade-stop="'+key+'"]').join(',')+'{background:#27493e;color:#fff6df;z-index:2}';
 return '<style>'+selectedStyles+'</style><div class="jade-resort" data-initial="'+active+'">'+
  '<div class="jade-map-bar"><span><b>FIG. 01</b> / 翡翠灣島圖</span><div class="jade-controls"><label><input type="checkbox" id="jade-night"> 夜景</label><label class="jade-motion-control"><input type="checkbox" id="jade-pause"> 暫停動畫</label></div></div>'+
  '<figure class="jade-figure"><div class="jade-map" id="jade-map"><div class="jade-world">'+jadeArt()+
  '<nav class="jade-pins" aria-label="翡翠灣地圖上的十站">'+jadeStops.map((s,i)=>link(s,i,true)).join('')+'</nav><div class="jade-bear" aria-hidden="true">'+avatar+'</div></div><div class="tour-hud"><span role="status" data-tour-status></span><button type="button" data-tour-skip>直接抵達</button></div></div>'+
  '<figcaption class="jade-map-caption">點選編號，跟著熊熊走進下一站。</figcaption></figure>'+
  '<div class="jade-details">'+jadeStops.map((s,i)=>'<section id="jade-stop-'+s[0]+'" class="jade-detail'+(i===index?' jade-detail-default':'')+'" tabindex="-1" aria-label="'+escape(s[1])+'"><div class="jade-detail-content">'+jadeDetail(s,i)+'</div><a href="#jade-map" class="jade-back">回島圖 ↑</a></section>').join('')+'</div>'+
  '<section class="jade-directory" aria-labelledby="jade-dir-title"><div class="jade-section-heading"><h2 id="jade-dir-title">選一站逛逛</h2><span>01–10</span></div><nav class="jade-index" aria-label="翡翠灣景點">'+jadeStops.map((s,i)=>link(s,i,false)).join('')+'</nav></section>'+
  '<p class="jade-note">翡翠灣是熊熊 Atlas 裡的虛擬島嶼。</p>'+jadeTourMarkup(avatar,guest)+'</div>';
}
const jadeStyles=`
:root{color:#203c35;background:#e8eee4}
body{padding:clamp(10px,4vw,48px) clamp(10px,3vw,32px)}
main{width:min(100%,1140px);border-color:#c9cfbb;border-radius:14px;background:#f8f4e8;padding:clamp(13px,3vw,32px)}
.dock-actions{display:flex;flex-wrap:wrap;gap:8px 15px;align-items:center}.dock-actions a{color:#335747;font-weight:700;font-size:.85rem}.dock-actions .cta{display:inline-flex;align-items:center;min-height:38px;padding:6px 11px;border-radius:7px;background:#2b5143;color:#fff8e8;text-decoration:none}.bear-art{width:100%;height:auto}.estate-wardrobe a{color:#335747}
.jade-head{display:flex;justify-content:space-between;align-items:end;gap:16px;margin:20px 0 14px}
.jade-head h1{font-family:Georgia,"Noto Serif TC",serif;font-size:clamp(2rem,6.7vw,4.35rem);font-weight:600;line-height:1.1;letter-spacing:.015em;margin:5px 0 0}
.jade-head .jade-kicker,.jade-kicker{font-size:.69rem;font-weight:750;letter-spacing:.15em;color:#7f5143;margin:0 0 8px}
.jade-edition{color:#476154;letter-spacing:.14em;text-align:right;font-size:.68rem;flex:none;border-left:1px solid #c8c8af;padding-left:14px}
.jade-head-note{color:#435d4f;font-size:.95rem;margin:0 0 12px}
.jade-figure{margin:0;overflow:hidden;border:1px solid #8b9d82;border-radius:12px;background:#e9ecd9}
.jade-map{position:relative;isolation:isolate;background:#518c8c}
.jade-map-art{display:block;width:100%;height:auto;transition:filter 700ms ease}
.jade-resort:has(#jade-night:checked) .jade-map-art{filter:brightness(.69) saturate(.78) hue-rotate(20deg)}
.jade-window{fill:#536e61;transition:fill 700ms ease}
.jade-resort:has(#jade-night:checked) .jade-window{fill:#ffe6a1;filter:drop-shadow(0 0 5px #ffd688)}
.jade-resort:has(#jade-night:checked) .jade-lantern{fill:#ffe6a1;filter:drop-shadow(0 0 8px #ffcd87)}
.jade-pins{position:absolute;inset:0;pointer-events:none}
.jade-pin{position:absolute;left:var(--x);top:var(--y);transform:translate(-50%,-50%);display:grid;place-items:center;pointer-events:auto;min-width:clamp(29px,3.5vw,41px);height:clamp(29px,3.5vw,41px);border:2px solid #f6eed3;border-radius:999px;background:#f8f2df;color:#213c34;box-shadow:0 3px 8px #29483c55;text-decoration:none;font-size:clamp(.65rem,1.5vw,.84rem);font-weight:800;font-variant-numeric:tabular-nums;transition:transform .2s ease,background .2s ease;z-index:1}
.jade-pin:hover,.jade-pin:focus-visible{z-index:2;transform:translate(-50%,-50%) scale(1.14);background:#27493e;color:#fff6df}
.jade-pin:focus-visible,.jade-index-link:focus-visible,.jade-controls input:focus-visible{outline:3px solid #a46149;outline-offset:2px}
.jade-map-bar,.jade-map-caption{display:flex;flex-wrap:wrap;gap:6px 12px;justify-content:space-between;align-items:center;padding:7px 10px;color:#3b574a;font-size:.76rem;letter-spacing:.06em}
.jade-map-bar{margin-top:14px;padding-inline:0}
.jade-map-bar b{font-size:.68rem;color:#795344;letter-spacing:.12em}
.jade-controls{display:flex;gap:7px}.jade-controls label{display:flex;align-items:center;gap:5px;background:#f8f5e8;color:#294638;border:1px solid #aab49e;min-height:36px;font-size:.76rem;padding:4px 9px;border-radius:999px;cursor:pointer}.jade-controls input{width:14px;height:14px;min-height:0;accent-color:#355a4a;margin:0;padding:0}
.jade-controls label:has(input:checked){background:#dce4ce;color:#254536}
.jade-detail{display:none;margin:14px 0 0;border:1px solid #d6ceb3;background:#f4ebd7;padding:clamp(13px,3vw,24px);border-radius:10px;scroll-margin:12px}
.jade-detail:target,.jade-details:not(:has(.jade-detail:target)) .jade-detail-default{display:block}
.jade-detail-content{display:grid;grid-template-columns:minmax(0,1fr) minmax(95px,25%);align-items:center;gap:10px}.jade-back{display:inline-block;margin-top:7px;padding:5px 0;font-size:.76rem;font-weight:700;color:#3d6253}.jade-detail:focus{outline:none}
.jade-detail-copy{min-width:0;animation:jade-enter 280ms ease-out both}
.jade-detail-copy h2,.jade-section-heading h2{margin:0;color:#203c35;font-family:Georgia,"Noto Serif TC",serif;line-height:1.2;font-weight:650;font-size:clamp(1.25rem,3vw,1.9rem)}
.jade-description{max-width:49ch;line-height:1.72;font-size:.94rem;margin:9px 0 11px}
.jade-features{display:flex;flex-wrap:wrap;gap:5px 12px;padding:0;margin:0;list-style:none;color:#644e3d;font-size:.76rem}
.jade-features li:before{content:"";display:inline-block;width:5px;height:5px;background:#98654e;border-radius:50%;margin-right:6px;vertical-align:.12em}
.jade-vignette{display:block;width:100%;max-height:160px;animation:jade-enter 350ms ease-out both}
.jade-directory{margin:22px 0 0}
.jade-section-heading{display:flex;align-items:baseline;justify-content:space-between;padding-bottom:9px;border-bottom:1px solid #bfc3aa}
.jade-section-heading span{font-size:.76rem;color:#795344;letter-spacing:.13em}
.jade-index{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:18px}
.jade-index-link{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:clamp(5px,1.4vw,11px);min-height:52px;align-items:center;color:#233e35;padding:6px 5px;border-bottom:1px solid #ddd7bf;text-decoration:none;font-size:.92rem}
.jade-index-link:hover{background:#e8e9d4}
.jade-index-link .jade-number{font-family:Georgia,serif;font-style:italic;color:#875342;font-size:.85rem;font-weight:700}
.jade-index-link small{font-size:.68rem;margin:2px 0 0;color:#4d6759}
.jade-note{font-size:.75rem;color:#566a5c;margin:8px 0 0}
.jade-note{margin-top:16px}
.jade-admin{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:18px}
.jade-admin>section{margin:0;background:#eef0e1;border:1px solid #d1d5bf}
.jade-admin .estate-wardrobe{grid-template-columns:minmax(42px,75px) minmax(0,1fr)}
.jade-sail{animation:jade-sail 13s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
.jade-birds{animation:jade-birds 9s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
.jade-tide{animation:jade-tide 7s ease-in-out infinite}
.jade-foam{animation:jade-foam 5s ease-in-out infinite}
.jade-foam.foam-next{animation-delay:-2.2s}
.jade-pool-glint,.jade-trail{animation:jade-dash 7s linear infinite}
.jade-smoke{animation:jade-smoke 4.2s ease-in-out infinite}
.jade-local-light,.jade-lantern{animation:jade-light 4s ease-in-out infinite}
.jade-local-leaves{animation:jade-sway 4s ease-in-out infinite;transform-origin:center bottom;transform-box:fill-box}
.jade-resort:has(#jade-pause:checked) :is(svg *, .jade-vignette){animation-play-state:paused!important}
@keyframes jade-sail{0%,100%{transform:translate(0,0) rotate(-4deg)}50%{transform:translate(-22px,3px) rotate(3deg)}}
@keyframes jade-birds{0%,100%{transform:translate(-5px,0)}50%{transform:translate(17px,-8px)}}
@keyframes jade-tide{0%,100%{transform:translateX(0);opacity:.64}50%{transform:translateX(10px);opacity:1}}
@keyframes jade-foam{0%,100%{transform:translate(-3px,-3px);opacity:.28}50%{transform:translate(4px,5px);opacity:.94}}
@keyframes jade-dash{to{stroke-dashoffset:-38}}
@keyframes jade-smoke{0%,100%{transform:translate(0,1px);opacity:.36}60%{transform:translate(4px,-6px);opacity:.92}}
@keyframes jade-light{0%,100%{opacity:.64}50%{opacity:1}}
@keyframes jade-sway{0%,100%{transform:rotate(-1.5deg)}50%{transform:rotate(1.5deg)}}
@keyframes jade-enter{from{opacity:.82;transform:translateY(3px)}to{opacity:1;transform:none}}
@media(max-width:720px){.jade-admin{grid-template-columns:minmax(0,1fr)}}
@media(max-width:520px){.jade-head{margin-top:13px}.jade-edition{display:none}.jade-map-caption{padding:6px 8px;letter-spacing:0}.jade-controls label{padding-inline:7px}.jade-detail-content{grid-template-columns:minmax(0,1fr) minmax(70px,23%)}.jade-index{gap:0 9px}.jade-index-link{font-size:.83rem}.jade-description{font-size:.88rem}.jade-pin{border-width:1px}}
@media(prefers-reduced-motion:reduce){.jade-resort *{animation:none!important;transition:none!important}.jade-controls .jade-motion-control{display:none}}
`;
const privateJet='<svg class="estate-plane" viewBox="0 0 64 42" role="img" aria-label="私人飛機起飛"><path d="M6 24h12L8 12h6l17 11 17-2 8-5h3l-3 10-11 5-16 1-11 7h-5l4-9-11-1z" fill="#fff6e0" stroke="#31515b" stroke-width="2" stroke-linejoin="round"/><path d="M31 27l18-2" stroke="#a67460" stroke-width="2" stroke-linecap="round"/></svg>';
const estateDestinations={
 sports:{name:'運動島',note:'球場與揪團邀約',path:'/sports'},
 travel:{name:'旅行港',note:'旅行提案與出發計畫',path:'/travel-club'},
 harbor:{name:'熊熊群島',note:'查看群島地圖',path:'/islands'},
};
async function founderIsland(request,env,url){
 if(request.method!=='GET')return harborHtml('<h1>這條航線不接受表單</h1>',405);
 const visitor=islanderOf(request);
 if(!visitor||!await founderFor(env.DB,visitor))return harborHtml('<h1>這是島主專用入口</h1><p>如果你收到了翡翠灣邀請，請走訪客入口，再用受邀的島民證登入。</p><p><a href="/world/emerald">前往翡翠灣訪客入口 ↗</a></p><p><a href="/passport">回熊熊護照</a></p>',403);
 const profile=await readPassportProfile(env.DB,visitor);
 if(!profile)return harborHtml('<h1>先領創辦人護照</h1><p><a class="cta" href="/passport">回去領取 BEAR-0000</a></p>',409);
 const style='<style>'+dockStyles+estateStyles+'</style>';
 if(url.pathname.endsWith('/flight')){
  const destination=url.searchParams.get('to');
  if(!Object.hasOwn(estateDestinations,destination))return harborHtml('<h1>找不到這條航線</h1><a href="/passport/island">回私人島選目的地</a>',404);
  const next=estateDestinations[destination],owner=env.SPORTS_RSVP_OWNER_ORIGIN;
  if(!owner)return harborHtml('<h1>航線暫時無法使用</h1>',503);
  const arrival=new URL(next.path,owner);
  return harborHtml(style+'<span class="estate-kicker">BEAR-0000 / PRIVATE FLIGHT</span><h1>私人飛機飛往'+next.name+'</h1><div class="estate-flight">'+privateJet+'</div><section class="estate-gate"><h2>登機名單</h2><p>'+escape(profile.nickname)+' · 隨行保鏢：松木與栗子</p><p>兩位保鏢已登機。抵達後就可以逛'+next.name+'。</p></section><p><a class="cta" href="'+escape(arrival.href)+'">抵達'+next.name+' ↗</a></p><p><a href="/passport/island">取消行程，回私人島</a></p>');
 }
 const look=founderLooks[lookKey(profile.outfit)];
 const destinations=Object.entries(estateDestinations).map(([key,d])=>'<li><a href="/passport/island/flight?to='+key+'"><strong>搭機前往'+d.name+' →</strong><span>'+d.note+'</span></a></li>').join('');
 return html('<style>'+estateStyles+jadeStyles+jadeTourStyles+jadeSuiteStyles+jadeExperienceStyles+jadeSushiStyles+'</style><header class="jade-head"><div><p class="jade-kicker">JADE COVE / PRIVATE ESTATE</p><h1>翡翠灣</h1></div><div class="jade-edition">FOUNDER EDITION<br>BEAR-0000</div></header>'+
  '<p class="jade-head-note">Kitty 的私人島。從海崖往森林走，沿途有十站可以停留。</p>'+founderMapNav(env,'estate')+
  '<div class="dock-actions"><a class="cta" href="/world/manage/emerald">邀請朋友到翡翠灣 ↗</a></div>'+jadeResort(url,profile)+'<div class="jade-admin">'+
  '<section class="estate-deed"><span class="estate-kicker">私人島島產證</span><h2>翡翠灣</h2><p>島主：'+escape(profile.nickname)+' · BEAR-0000</p><p>私人碼頭與專屬跑道</p></section>'+
  '<section class="estate-wardrobe">'+memberAvatar(profile)+'<div><h2>'+look.name+'</h2><p>'+look.wear+' · '+look.shoes+' · '+look.bag+'</p><a href="/passport#founder-wardrobe">換一套造型 ↗</a></div></section>'+
  '<section class="estate-gate"><h2>私人機庫</h2><p>松木與栗子兩位熊熊保鏢在登機口等你。</p><ul class="estate-destinations">'+destinations+'</ul></section></div><script src="/jade-tour.js?v=chef-menu-2" defer></script>',200,{'Content-Security-Policy':headers['Content-Security-Policy']+"; script-src 'self'"}, {title:'翡翠灣｜熊熊 Atlas',brand:'熊熊 ATLAS / 港城'});
}

function jadeGuestResort(url,profile,credential,extras){
 const title='翡翠灣 · 訪客導覽';
 return html('<style>'+estateStyles+jadeStyles+jadeTourStyles+jadeSuiteStyles+jadeExperienceStyles+jadeSushiStyles+
  '.jade-guest-nav{justify-content:space-between;gap:6px 14px;margin:0 0 12px}.jade-guest-nav a{min-height:44px;display:inline-flex;align-items:center}.jade-guest-extra .world-tile{padding:8px 0;border-top:1px solid #d8d5bf}.jade-guest-extra .world-tile span{font-size:.73rem;color:#496052}.jade-guest-extra .world-tile h2{margin:0;font-size:1rem}.jade-guest-extra .world-tile p{margin:3px 0 5px}</style>'+
  '<header class="jade-head"><div><p class="jade-kicker">JADE COVE / GUEST TOUR</p><h1>翡翠灣</h1></div><div class="jade-edition">訪客導覽<br>'+memberLabel(credential.member_no)+'</div></header>'+
  '<p class="jade-head-note">已取得登島授權 · '+memberLabel(credential.member_no)+'。用你的熊熊在島上走走，選一站開始探索。</p>'+
  '<nav class="dock-actions jade-guest-nav" aria-label="翡翠灣訪客導覽"><a href="/islands?stop=dock">← 回訪客碼頭</a><a href="/passport">我的護照 ↗</a></nav>'+
  jadeResort(url,profile,true)+(extras?'<section class="jade-guest-extra" aria-labelledby="jade-extra-title"><h2 id="jade-extra-title">島主另行開放的區域</h2>'+extras+'</section>':'')+
  '<script src="/jade-tour.js?v=chef-menu-2" defer></script>',200,worldSceneHeaders,{title:title+'｜熊熊 Atlas',brand:'熊熊 ATLAS / 港城'});
}

const worldDay=86400000,worldWindow=900000;
const emeraldTourDisabled=1<<4;
const emeraldTourOpen=row=>!(row.area_mask&emeraldTourDisabled);
const worldModes={private:'僅島主',invite:'邀請制',password:'密碼登島',public:'島民皆可拜訪'};
const emeraldAreas=[
 ['pier','私人碼頭','從灣內看見海岸線、木棧道和停靠的帆船。'],
 ['cottage','熊熊小屋','小屋的窗面向海灣，窗邊有一張可以休息的長椅。'],
 ['garden','翡翠花園','沿玫瑰花徑散步，經過石階與觀景台。'],
 ['collection','島主收藏室','展示翡翠灣地圖與這座島的紀念插圖。']
];
const worldStyle=`
:root{background:#e7ede2;color:#28463c}
body{padding:clamp(10px,4vw,42px) 12px}
main{width:min(100%,780px);padding:clamp(14px,4vw,30px);border-radius:16px;background:#f7f3e9}
.world-top{padding:13px 0 5px}.world-top h1{font-family:Georgia,"Noto Serif TC",serif;font-weight:650;letter-spacing:.025em;font-size:clamp(1.75rem,6vw,2.9rem)}
.world-nav{display:flex;gap:5px 14px;flex-wrap:wrap;border-block:1px solid #d9d9c7;margin:10px 0 18px;padding:4px 0}
.world-nav a,.world-link{display:inline-flex;align-items:center;min-height:44px;font-weight:650;color:#31594b}
.world-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:12px 0}
.world-tile,.world-panel{border:1px solid #d5d6bf;border-radius:10px;background:#f5efde;padding:13px;overflow-wrap:anywhere}
.world-tile a{display:block;color:#2b4f42;text-decoration:none}.world-tile a:hover{text-decoration:underline}
.world-tile h2,.world-panel h2{font-family:Georgia,"Noto Serif TC",serif;font-size:1.15rem;margin:3px 0}
.world-tile span{font-size:.7rem;color:#705744;font-weight:700;letter-spacing:.1em}
.world-tile p{font-size:.82rem;margin:3px 0 0}
.world-panel{margin:12px 0}.world-panel fieldset{border:1px solid #c9cbb7;border-radius:8px;margin:3px 0 8px;padding:8px}
.world-panel label{margin:4px 0}.world-panel textarea,.world-panel select{font:inherit;color:inherit;min-height:44px;width:100%;border:1px solid #899a88;border-radius:6px;background:#fff9eb;padding:6px 8px}
.world-panel button{justify-self:start;padding-inline:12px}.world-panel input[type=checkbox]{min-height:auto;width:18px;height:18px;accent-color:#31594b}
.world-check{display:flex;align-items:center;gap:8px;min-height:44px}
.world-art{margin:12px 0}.world-art svg{display:block;width:100%;height:auto;border-radius:9px}
.world-avatar{width:64px;flex:0 0 64px}.world-avatar svg{width:100%;height:auto;display:block}
.world-id{display:flex;align-items:center;gap:10px}.world-id p{margin:3px 0}
.world-grant{display:flex;gap:9px;align-items:center;justify-content:space-between;border-top:1px solid #d9d5be;padding:5px 0;font-size:.85rem}
.world-grant form{display:block}.world-grant button{white-space:nowrap}.world-grant small{margin:2px 0}.world-positive{color:#2e5b43;font-weight:700}
.world-primary{background:#2c5546;color:#fff9ee;border-color:#2c5546}.world-badge{display:inline-block;color:#644b39;background:#ede2c7;border-radius:5px;padding:2px 7px;font-size:.75rem;font-weight:700;margin-bottom:5px}.world-share{margin:2px 0 0}.world-settings>summary{padding:8px 0;cursor:pointer;font-weight:650}
@media(max-width:395px){.world-grid{gap:6px}.world-tile{padding:9px}}
`;
const worldPath=id=>id==='emerald'?'/world/emerald':'/world/island/'+id;
const worldNav=()=>'<nav class="world-nav" aria-label="熊熊渡假村導覽"><a href="/world">渡假村地圖</a><a href="/world/home">回家</a><a href="/passport">島民證</a><a href="/world/wardrobe">換裝</a><a href="/islands?stop=dock">抵達碼頭</a><a href="/dock/square#weekly-activities">廣場活動</a></nav>';
function worldPage(title,content,status=200,extra={}){
 return html('<style>'+worldStyle+'</style><header class="world-top"><h1>'+escape(title)+'</h1></header>'+worldNav()+content,status,extra,{title:escape(title)+'｜熊熊 Atlas',brand:'BEAR ATLAS / SEASIDE RETREAT'});
}
const worldTile=(title,tag,href,description)=>'<article class="world-tile"><a href="'+escape(href)+'"><span>'+escape(tag)+'</span><h2>'+escape(title)+' ↗</h2><p>'+escape(description)+'</p></a></article>';
const worldIsland=(db,id)=>db.prepare('SELECT island_id,owner_key,name,welcome,mode,password_hash,password_salt,password_revision,access_days,area_mask FROM bear_world_islands WHERE island_id=?').bind(id).first();
const worldGrant=(db,id,key)=>db.prepare('SELECT method,expires_at,password_revision FROM bear_world_grants WHERE island_id=? AND visitor_key=?').bind(id,key).first();
function worldAccess(row,key,grant,now=Date.now()){
 if(!row)return false;
 if(row.owner_key===key)return true;
 if(grant?.method==='blocked')return false;
 if(row.mode==='public'&&row.island_id!=='emerald')return true;
 if(!grant||grant.expires_at<=now||row.mode==='private')return false;
 if(grant.method==='invite')return row.mode==='invite'||row.mode==='password';
 return grant.method==='password'&&row.mode==='password'&&grant.password_revision===row.password_revision;
}
function worldCover(){
 return '<figure class="world-art" aria-label="翡翠灣公開封面"><svg viewBox="0 0 600 200" role="img" aria-label="海面上的翡翠灣和私人碼頭"><rect width="600" height="200" fill="#65887f"/><path d="M0 143q131-14 250 0t350-11M0 171q99-7 168 0m228 7h129" fill="none" stroke="#adc3ab" stroke-width="3"/><path d="M68 137 149 78 280 39l168 41 88 58-73 34H167z" fill="#ae9075"/><path d="M68 122 149 66l131-39 168 42 88 56-73 29H167z" fill="#b9c9ad"/><path d="m240 95 49-27 42 17-48 31z" fill="#e9bebd"/><path d="m240 95 43 21v17l-43-20zm43 21 48-31v22l-48 26z" fill="#f7f3e9"/><path d="M406 133h63v7h-63zm59 0h7v26h-7z" fill="#806b58"/><path d="m148 114 12-22 12 22zm211-22 16-32 16 32z" fill="#5c7d6c"/></svg></figure>';
}
function worldIslandDirectory(rows,visitor,dock){
 return rows.map(r=>worldTile(r.name,r.owner_key===visitor?'我的島嶼':worldModes[r.mode],dock?'/world/sail/'+r.island_id:worldPath(r.island_id),r.owner_key===visitor?'進入或管理自己的島嶼':dock?'搭船前往':'到碼頭查看登島方式')).join('');
}
async function worldPasswordHash(env,password,salt){
 const key=env.BEAR_WORLD_KEY||env.SPORTS_RSVP_RELAY_KEY;
 if(typeof key!=='string'||key.length<32)throw Error('world-password-secret-missing');
 const e=new TextEncoder();
 const pepper=await crypto.subtle.importKey('raw',e.encode(key),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const input=await crypto.subtle.sign('HMAC',pepper,e.encode('bear-world-password-v1:'+password));
 const pb=await crypto.subtle.importKey('raw',input,'PBKDF2',false,['deriveBits']);
 return hex(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:e.encode(salt),iterations:100000,hash:'SHA-256'},pb,256)));
}
function worldSameDigest(a,b){
 if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return false;
 let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0;
}
async function worldTryPassword(request,env,row,key,password){
 const db=env.DB,now=Date.now(),bucket=Math.floor(now/worldWindow);
 const ip=request.headers.get('CF-Connecting-IP')||key;
 const pepper=env.BEAR_WORLD_KEY||env.SPORTS_RSVP_RELAY_KEY;
 if(typeof pepper!=='string'||pepper.length<32)throw Error('world-password-secret-missing');
 const network=hex(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode('bear-world-net:'+pepper+':'+bucket+':'+ip))));
 const allowed=await db.prepare(`INSERT INTO bear_world_attempts(island_id,visitor_key,time_bucket,network_key,attempts)
 SELECT ?,?,?,?,1 WHERE (SELECT COALESCE(SUM(attempts),0) FROM bear_world_attempts WHERE island_id=? AND time_bucket=? AND network_key=?)<20
 ON CONFLICT(island_id,visitor_key,time_bucket) DO UPDATE SET attempts=attempts+1 WHERE attempts<5
 RETURNING attempts`).bind(row.island_id,key,bucket,network,row.island_id,bucket,network).first();
 if(!allowed)return 429;
 await db.prepare('DELETE FROM bear_world_attempts WHERE rowid IN (SELECT rowid FROM bear_world_attempts WHERE time_bucket<? LIMIT 100)').bind(bucket-96).run();
 if(!row.password_hash||!row.password_salt||!worldSameDigest(await worldPasswordHash(env,password,row.password_salt),row.password_hash))return 403;
 const result=await db.prepare(`INSERT INTO bear_world_grants(island_id,visitor_key,method,expires_at,password_revision)
 SELECT ?,?,'password',?,? WHERE EXISTS (SELECT 1 FROM bear_world_islands WHERE island_id=? AND mode='password' AND password_revision=?)
 ON CONFLICT(island_id,visitor_key) DO UPDATE SET method='password',expires_at=excluded.expires_at,password_revision=excluded.password_revision
 WHERE bear_world_grants.method<>'blocked' AND (bear_world_grants.method<>'invite' OR bear_world_grants.expires_at<=?)`).bind(row.island_id,key,now+row.access_days*worldDay,row.password_revision,row.island_id,row.password_revision,now).run();
 return result.meta.changes?303:403;
}
async function worldManage(env,row,fields){
 const db=env.DB,action=fields.get('action');
 if(action==='save'){
  const emerald=row.island_id==='emerald',mode=fields.get('mode'),password=fields.get('password')||'';
  const name=emerald?'翡翠灣 Emerald Bay':fields.get('name')?.trim(),welcome=emerald?'':fields.get('welcome')?.trim()||'';
  const days=Number(fields.get('days'));
  if(!Object.hasOwn(worldModes,mode)||(emerald&&mode==='public')||!cap(name,42)||welcome.length>420||![1,7,30].includes(days))return '請確認島名、開放方式和訪問期限。';
  if(password&&(mode!=='password'||password.length<12||password.length>128||!password.trim()))return '登島密碼請使用 12–128 個字元，並選擇密碼登島。';
  if(mode==='password'&&!password&&!row.password_hash)return '首次啟用密碼登島時，請設定登島密碼。';
  const salt=password?randomToken():mode==='password'?row.password_salt:null;
  const hash=password?await worldPasswordHash(env,password,salt):mode==='password'?row.password_hash:null;
  const tourOff=fields.has('tour-setting')?!fields.has('guest-tour'):!emeraldTourOpen(row);
  const mask=emerald?emeraldAreas.reduce((n,[id],i)=>n+(fields.getAll('area').includes(id)?1<<i:0),tourOff?emeraldTourDisabled:0):0;
  const revision=row.password_revision+Number(Boolean(password)||row.mode!==mode||row.access_days!==days);
  const update=await db.prepare('UPDATE bear_world_islands SET name=?,welcome=?,mode=?,password_hash=?,password_salt=?,password_revision=?,access_days=?,area_mask=? WHERE island_id=? AND owner_key=? AND password_revision=?').bind(name,welcome,mode,hash,salt,revision,days,mask,row.island_id,row.owner_key,row.password_revision).run();
  return update.meta.changes?'':'設定剛被更新，請重新開啟此頁。';
 }
 if(action!=='invite'&&action!=='revoke')return '找不到這項設定。';
 const code=worldMemberCode(fields.get('member'));
 if(!code)return '請輸入對方的 BEAR 編號，例如 BEAR-0006。';
 const number=Number(code.slice(5))||-1;
 const target=await db.prepare('SELECT visitor_key FROM island_credentials WHERE member_no=?').bind(number).first();
 if(!target||target.visitor_key===row.owner_key)return '找不到這位島民。請對照朋友島民證上的編號。';
 const now=Date.now();
 const upsert=`INSERT INTO bear_world_grants(island_id,visitor_key,method,expires_at,password_revision)
 SELECT island_id,?,?,CASE WHEN ?='blocked' THEN 0 ELSE ?+access_days*? END,password_revision
 FROM bear_world_islands WHERE island_id=? AND owner_key=?
 ON CONFLICT(island_id,visitor_key) DO UPDATE SET method=excluded.method,expires_at=excluded.expires_at,password_revision=excluded.password_revision`;
 const grant=db.prepare(upsert).bind(target.visitor_key,action==='revoke'?'blocked':'invite',action==='revoke'?'blocked':'invite',now,worldDay,row.island_id,row.owner_key);
 if(action==='invite'){
  // Transition from owner-only without turning other dormant invitations back on.
  await db.batch([
   db.prepare(`UPDATE bear_world_grants SET expires_at=? WHERE island_id=? AND visitor_key<>? AND method='invite' AND expires_at>?
    AND EXISTS(SELECT 1 FROM bear_world_islands WHERE island_id=? AND owner_key=? AND mode='private')`)
    .bind(now,row.island_id,target.visitor_key,now,row.island_id,row.owner_key),
   db.prepare("UPDATE bear_world_islands SET mode='invite',password_revision=password_revision+1 WHERE island_id=? AND owner_key=? AND mode='private'").bind(row.island_id,row.owner_key),
   grant
  ]);
 }else await grant.run();
 return '';
}
function worldMemberCode(raw){
 if(typeof raw!=='string')return '';
 const code=raw.trim().normalize('NFKC').toUpperCase();
 const match=/^(?:BEAR[\s-]*)?(\d{1,10})$/.exec(code);
 if(!match)return '';
 const number=Number(match[1]);
 return number===0?'BEAR-0000':memberLabel(number);
}
const worldNavLink=(href,text)=>'<a class="world-link" href="'+escape(href)+'">'+escape(text)+'</a>';
const worldError=(message)=>message?'<p class="alert" role="alert">'+escape(message)+'</p>':'';
const worldCodeField='<label>朋友的島民編號<input name="member" placeholder="例如 BEAR-0006" autocapitalize="characters" autocomplete="off" required maxlength="20"></label>';
const worldVisitDate=timestamp=>new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Taipei',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(timestamp);
const worldInviteTitle=row=>row.island_id==='emerald'?'翡翠灣':row.name;
function worldGrantStatus(row,grant){
 if(grant.method==='blocked')return '已撤銷';
 if(worldAccess(row,grant.visitor_key,grant))return '可登島 · '+(row.mode==='public'?'公開開放':'至 '+worldVisitDate(grant.expires_at)+'（台灣時間）');
 if(grant.expires_at<=Date.now())return '邀請已失效';
 return '邀請尚未生效 · 島嶼未開放';
}
function worldManager(row,grants,message='',status=200,result=''){
 const emerald=row.island_id==='emerald',visit=worldPath(row.island_id);
 const options=Object.entries(worldModes).filter(([k])=>!emerald||k!=='public').map(([k,label])=>'<option value="'+k+'"'+(row.mode===k?' selected':'')+'>'+label+'</option>').join('');
 const durations=[1,7,30].map(d=>'<option value="'+d+'"'+(row.access_days===d?' selected':'')+'>'+d+' 天</option>').join('');
 const areas=emerald?'<fieldset><legend>訪客導覽</legend><input type="hidden" name="tour-setting" value="1"><label class="world-check"><input type="checkbox" name="guest-tour" value="1"'+(emeraldTourOpen(row)?' checked':'')+'> 受邀朋友可玩十站動畫</label><small>只開給你用島民編號邀請的朋友。島主專區和私人筆記只有你看得到。</small></fieldset><fieldset><legend>額外開放的區域</legend>'+emeraldAreas.map(([id,title],i)=>'<label class="world-check"><input name="area" type="checkbox" value="'+id+'"'+(row.area_mask&(1<<i)?' checked':'')+'> '+title+'</label>').join('')+'<small>這些是獨立於十站導覽的區域，勾選才會開放給有登島權限的訪客。</small></fieldset>':'';
 const invited=grants.find(g=>memberLabel(g.member_no)===result&&g.method==='invite'&&worldAccess(row,g.visitor_key,g));
 const statusMessage=invited?'<p class="notice" role="status">'+escape(result)+' 現在可登島。把下方訪客入口給對方，請對方用同一個島民證登入。</p>':result==='revoked'?'<p class="notice" role="status">已撤銷訪客權限。</p>':result==='saved'?'<p class="notice" role="status">已儲存島嶼設定。</p>':'';
 return worldPage(emerald?'翡翠灣 · 邀請朋友':'管理我的島嶼',worldError(message)+statusMessage+
  '<section class="world-panel"><span class="world-badge">'+escape(worldModes[row.mode])+'</span><h2>邀請朋友登島</h2><p>輸入對方的島民編號。受邀者用同一個島民證登入，就能直接進訪客區，不必輸入密碼。</p>'+
  (row.mode==='private'?'<p>目前僅島主可進入。按下邀請會切換成邀請制，只開放這位朋友，其他舊邀請不會一起生效。</p>':'')+
  '<form method="post">'+worldCodeField+'<button class="world-primary" name="action" value="invite">'+(row.mode==='private'?'開放給這位朋友':'邀請朋友')+'</button></form>'+
  '<p class="world-share">'+worldNavLink(visit,emerald?'朋友使用的翡翠灣入口 ↗':'朋友使用的登島入口 ↗')+'</p></section>'+
  '<section class="world-panel" id="visitors"><h2>誰可以登島</h2>'+
  (grants.length?grants.map(g=>{
   const blocked=g.method==='blocked',active=worldAccess(row,g.visitor_key,g);
   const action=active?'revoke':'invite';
   return '<div class="world-grant"><span><strong>'+memberLabel(g.member_no)+'</strong> '+escape(g.nickname)+'<br><small class="'+(active?'world-positive':'')+'">'+worldGrantStatus(row,g)+'</small></span>'+
    '<form method="post"><input type="hidden" name="member" value="'+memberLabel(g.member_no)+'"><button name="action" value="'+action+'">'+(active?'撤銷':blocked?'重新邀請':'讓他登島')+'</button></form></div>';
  }).join(''):'<p>目前沒有訪客授權。</p>')+'</section>'+
  '<details class="world-panel world-settings"'+(message&&status===400?' open':'')+'><summary>島嶼設定 · 開放方式、期限與可見區域</summary><form method="post">'+(emerald?'':'<label>島名<input name="name" value="'+escape(row.name)+'" required maxlength="42"></label><label>島上介紹<textarea name="welcome" maxlength="420">'+escape(row.welcome)+'</textarea></label>')+
  '<label>開放方式<select name="mode">'+options+'</select></label><label>新訪客的授權期限<select name="days">'+durations+'</select></label>'+
  '<label>設定登島密碼<input name="password" type="password" autocomplete="new-password" minlength="12" maxlength="128" placeholder="'+(row.password_hash?'留空保留目前密碼':'密碼登島才需要填寫')+'"></label><small>更換密碼、模式或期限會讓原有的密碼授權失效。選「僅島主」時會關閉訪客入口。</small>'+areas+
  '<button name="action" value="save">儲存設定</button></form></details>',status);
}
async function worldRecordVisit(db,id,visitor){
 await db.prepare('INSERT INTO bear_world_visits(island_id,visitor_key,first_visit_at) VALUES(?,?,?) ON CONFLICT(island_id,visitor_key) DO NOTHING').bind(id,visitor,Date.now()).run();
}
async function bearWorld(request,env,url){
 const db=env.DB,path=url.pathname,visitor=islanderOf(request);
 if(path==='/world/dock'||path==='/dock'){
  return request.method==='GET'?dockRedirect(harborDockPath):worldPage('請從地圖選擇島嶼','',405);
 }
 if(path==='/world/home'||/^\/world\/home\/BEAR-\d{4,10}$/.test(path))return resortHome(request,env,url,visitor);
 const validMember=visitor?await readPassportProfile(db,visitor):null;
 const member=validMember?await ensureCredential(db,visitor):null;
 const valid=Boolean(member);
 const isFounder=member?.member_no===-1&&Boolean(await founderFor(db,visitor));
 const method=request.method;
 const guestEmerald=path==='/world/emerald';
 const areaMatch=/^\/world\/emerald\/area\/([a-z-]+)$/.exec(path);
 const customMatch=/^\/world\/island\/(BEAR-\d{4,10})$/.exec(path);
 const manage=path==='/world/manage'||path==='/world/manage/emerald';
 const sailing=/^\/world\/sail\/(emerald|BEAR-\d{4,10})$/.exec(path);
 const hub=path==='/world'||path==='/islands',wardrobe=path==='/world/wardrobe',sadness=path==='/world/sadness';
 if(!guestEmerald&&!areaMatch&&!customMatch&&!manage&&!hub&&!wardrobe&&!sailing&&!sadness)return worldPage('找不到這條航線',worldNavLink('/world','回世界地圖'),404);
 if(!['GET','POST'].includes(method))return worldPage('這條航線無法開啟',worldNavLink('/world','回世界地圖'),405);
 if(sadness){if(method!=='GET')return worldPage('這裡不接收心情表單','<a href="/world/sadness">回傷心之島</a>',405);const portrait=validMember?memberAvatar(validMember,true):avatar('honey','explorer');return html('<style>'+worldSceneCss+sadStyles+'</style>'+sadIslandMarkup(portrait).replace('data-sad-island data-phase','data-sad-island data-comforts="'+escape(JSON.stringify(sadComfort))+'" data-phase')+'<script src="/world-scene.js?v=resort-v83" defer></script>',200,{'Content-Security-Policy':worldSceneHeaders['Content-Security-Policy'].replace("form-action 'self'","form-action 'none'")+"; connect-src 'none'"},{title:'傷心之島｜Bear Atlas',brand:''});}
 if(hub){
  if(method!=='GET')return worldPage('請從地圖選擇島嶼','',405);
  const [invitations,dockServices]=valid?await Promise.all([harborInvitations(db,visitor),harborDockServices(db,visitor,isFounder,env)]):[[],''];
  return publicHarbor(url,validMember,member,isFounder,invitations,dockServices);
 }
 if(!valid){
  if(method==='POST'||areaMatch||manage||customMatch)return worldPage('請先登入島民證',memberLinks(guestEmerald||areaMatch?'/world/emerald':'/world'),403);
  return worldPage(guestEmerald?'翡翠灣 Emerald Bay':'歡迎來到熊熊島嶼',
   (guestEmerald?'<p>私人島嶼 · BEAR-0000</p>'+worldCover():'<p>創建你的熊熊，領取島民證，再去廣場或搭船探索。</p>'+worldTile('翡翠灣 Emerald Bay','私人島嶼','/world/emerald','查看公開封面'))+memberLinks(guestEmerald?'/world/emerald':'/world'));
 }
 if(sailing){
  if(method!=='GET')return worldPage('航線不接受表單','',405);
  const id=sailing[1],row=await worldIsland(db,id);
  if(id!=='emerald'&&(!row||row.mode==='private'&&row.owner_key!==visitor))return worldPage('找不到這條航線',worldNavLink(harborDockPath,'回訪客碼頭'),404);
  return worldPage('搭船前往 '+(row?.name||'翡翠灣 Emerald Bay'),worldVoyage(worldPath(id)),200,worldSceneHeaders);
 }
 if(wardrobe)return worldWardrobe(request,env,url,visitor,validMember,isFounder);
 if(manage){
  const emerald=path.endsWith('/emerald');
  if(emerald&&!isFounder)return worldPage('只有島主可以管理翡翠灣',worldNavLink('/world/emerald','回登島入口'),403);
  if(!emerald&&isFounder)return dockRedirect('/world/manage/emerald');
  const id=emerald?'emerald':memberLabel(member.member_no);
  let row=await worldIsland(db,id);
  if(row&&row.owner_key!==visitor)return worldPage('找不到島主權限','',403);
  let message='';
  if(method==='POST'){
   const form=await dockForm(request,url,2500);
   if(!form.fields)return worldPage('設定未送出',worldError(form.error),form.status);
   if(!row){
    if(form.fields.get('action')!=='create')return worldPage('請先建立島嶼','',409);
    const name=emerald?'翡翠灣 Emerald Bay':form.fields.get('name')?.trim();
    if(!cap(name,42))return worldPage('建立我的島嶼',worldError('島名需在 1–42 個字元之間。')+worldNavLink(path,'回到建立島嶼'),400);
    await db.prepare("INSERT INTO bear_world_islands(island_id,owner_key,name,created_at) VALUES(?,?,?,?) ON CONFLICT(island_id) DO NOTHING").bind(id,visitor,name,Date.now()).run();
    return dockRedirect(path+'?saved=1');
   }
   message=await worldManage(env,row,form.fields);
   if(!message){
    const action=form.fields.get('action');
    const result=action==='invite'?worldMemberCode(form.fields.get('member')):action==='revoke'?'revoked':'saved';
    return dockRedirect(path+'?result='+encodeURIComponent(result));
   }
  }
  if(!row)return worldPage(emerald?'啟用翡翠灣門禁':'建立我的島嶼','<p>島嶼建立後預設僅島主能進入。</p><section class="world-panel"><form method="post">'+
   (emerald?'':'<label>島名<input name="name" maxlength="42" required></label>')+'<button name="action" value="create">'+(emerald?'啟用訪客控制台':'建立私人島嶼')+'</button></form></section>');
  const {results}=await db.prepare('SELECT g.visitor_key,g.method,g.expires_at,g.password_revision,c.member_no,p.nickname FROM bear_world_grants g JOIN island_credentials c ON c.visitor_key=g.visitor_key JOIN island_passports p ON p.visitor_key=g.visitor_key WHERE g.island_id=? ORDER BY g.expires_at DESC LIMIT 100').bind(id).all();
  return worldManager(row,results,message,message?400:200,url.searchParams.get('result')||'');
 }
 const emerald=guestEmerald||Boolean(areaMatch),id=emerald?'emerald':customMatch[1];
 const row=await worldIsland(db,id);
 const grant=row?await worldGrant(db,id,visitor):null;
 const access=(emerald&&isFounder)||worldAccess(row,visitor,grant);
 if(!emerald&&(!row||row.mode==='private'&&!access))return worldPage('找不到可拜訪的島嶼',worldNavLink(harborDockPath,'回訪客碼頭'),404);
 if(areaMatch){
  if(method!=='GET')return worldPage('這個區域不接受表單','',405);
  const i=emeraldAreas.findIndex(a=>a[0]===areaMatch[1]);
  if(i<0||!isFounder&&(!access||!(row.area_mask&(1<<i))))return worldPage('這個區域尚未對你開放',worldNavLink('/world/emerald','回翡翠灣碼頭'),403);
  if(!isFounder)await worldRecordVisit(db,id,visitor);
  const [area,title,detail]=emeraldAreas[i];
  const illustration=area==='collection'?'<div class="world-art">'+jadeArt()+'</div>':worldCover();
  const visitPortrait='<div class="world-id"><div class="world-avatar">'+memberAvatar(validMember,true)+'</div><p>'+escape(validMember.nickname)+' · '+memberLabel(member.member_no)+'</p></div>';
  return worldPage(title,illustration+visitPortrait+'<section class="world-panel"><p>'+detail+'</p></section>'+worldNavLink('/world/emerald','回翡翠灣碼頭'));
 }
 if(emerald&&isFounder&&method==='GET')return worldPage('翡翠灣 Emerald Bay',worldCover()+worldNavLink('/passport/island','進入原有翡翠灣 ↗')+' · '+worldNavLink('/world/manage/emerald','管理翡翠灣門禁 ↗')+
  '<div class="world-grid">'+emeraldAreas.map(([area,title,detail])=>worldTile(title,'島主入口','/world/emerald/area/'+area,detail)).join('')+'</div>');
 let message='',status=access?200:403;
 if(method==='POST'){
  const form=await dockForm(request,url,1000);
  if(!form.fields)return worldPage('未完成登島',worldError(form.error),form.status);
  if(access)return dockRedirect(path);
  if(row?.mode!=='password'||grant?.method==='blocked'||form.fields.get('action')!=='password')return worldPage('目前無法登島',worldNavLink(harborDockPath,'回訪客碼頭'),403);
  const password=form.fields.get('password')||'';
  if(!password||password.length>128)return worldPage('請輸入有效的登島密碼',worldNavLink(path,'回登島入口'),400);
  status=await worldTryPassword(request,env,row,visitor,password);
  if(status===303)return dockRedirect(path);
  message=status===429?'嘗試次數已達上限，請稍後再試。':'密碼不正確，或這次的登島授權已失效。';
 }
 if(!access){
  const mode=row?.mode||'private';
  const denied=grant?.method==='blocked'?'島主已撤銷這個島民證的登島權限。':mode==='private'?'島主目前沒有開放訪客。請島主在你的編號旁按「讓他登島」。':grant?.method==='invite'&&grant.expires_at<=Date.now()?'這份邀請已到期，請島主重新邀請。':'這個島民證還沒有收到邀請，請島主確認邀請的編號。';
  const identity='<p>目前登入：<strong>'+memberLabel(member.member_no)+'</strong> · '+worldNavLink('/passport?recover=1&next='+encodeURIComponent(path)+'#passport-recover','切換島民證')+'</p>';
  return worldPage(emerald?'翡翠灣 Emerald Bay':row.name,worldError(message)+'<section class="world-panel"><h2>'+worldModes[mode]+'</h2>'+identity+
   (mode==='password'&&grant?.method!=='blocked'?'<form method="post"><label>登島密碼<input type="password" name="password" required maxlength="128" autocomplete="off"></label><button name="action" value="password">驗證並登島</button></form>':'<p>'+denied+'</p>')+'</section>'+
   (emerald?worldCover():''),status,status===429?{'Retry-After':'900'}:{});
 }
 if(!row)return worldPage('暫時無法載入島嶼','',503);
 if(row.owner_key!==visitor)await worldRecordVisit(db,id,visitor);
 if(emerald){
  const extras=emeraldAreas.map(([area,title,detail],i)=>row.area_mask&(1<<i)?worldTile(title,'開放區域','/world/emerald/area/'+area,detail):'').join('');
  if(grant?.method==='invite'&&emeraldTourOpen(row))return jadeGuestResort(url,validMember,member,extras);
  return worldPage('翡翠灣 · 訪客區','<p class="notice">已取得登島授權 · '+memberLabel(member.member_no)+'</p>'+worldCover()+
   (extras?'<div class="world-grid">'+extras+'</div>':'<p>島主目前只開放碼頭入口，還沒有開放其他區域。</p>'));
 }
 return worldPage(row.name,worldCover()+'<div class="world-id"><div class="world-avatar">'+memberAvatar(validMember,true)+'</div><p>'+escape(validMember.nickname)+' · '+memberLabel(member.member_no)+'</p></div><section class="world-panel"><h2>島上介紹</h2><p>'+escape(row.welcome||'歡迎登島。')+'</p></section>'+
  (row.owner_key===visitor?worldNavLink('/world/manage','管理我的島嶼 ↗'):'<p class="notice">已登島，這次到訪會保存在登島紀錄。</p>'));
}

async function harborInvitations(db,visitor){
 const {results}=await db.prepare("SELECT i.island_id,i.name,g.expires_at FROM bear_world_grants g JOIN bear_world_islands i ON i.island_id=g.island_id WHERE g.visitor_key=? AND g.method='invite' AND g.expires_at>? AND i.mode IN ('invite','password') ORDER BY g.expires_at LIMIT 20").bind(visitor,Date.now()).all();
 return results;
}
async function harborDockServices(db,visitor,isFounder,env){
 const [directory,visits]=await Promise.all([
  db.prepare("SELECT island_id,name,mode,owner_key FROM bear_world_islands WHERE island_id<>'emerald' AND (owner_key=? OR mode<>'private') ORDER BY (owner_key=?) DESC,created_at DESC LIMIT 50").bind(visitor,visitor).all(),
  db.prepare('SELECT i.name,v.first_visit_at FROM bear_world_visits v JOIN bear_world_islands i ON i.island_id=v.island_id WHERE v.visitor_key=? ORDER BY v.first_visit_at DESC LIMIT 12').bind(visitor).all()
 ]);
 const ownerMap=isFounder?ownerAtlasHref(env,'/islands'):'';
 return '<div class="hb-dock-services"><details><summary>其他航線與島嶼設定</summary>'+worldIslandDirectory(directory.results,visitor,true)+
  '<p><a class="hb-link" href="'+(isFounder?'/world/manage/emerald':'/world/manage')+'">'+(isFounder?'管理翡翠灣訪客':'管理我的島嶼')+' ↗</a></p>'+
  (ownerMap?'<a class="hb-link" href="'+ownerMap+'">回原本的 Atlas 島嶼地圖 ↗</a>':'')+'</details>'+
  '<details id="visit-log"><summary>我的登島紀錄</summary>'+(visits.results.length?'<ul>'+visits.results.map(v=>'<li>'+escape(v.name)+' · '+passportDate(v.first_visit_at)+'</li>').join('')+'</ul>':'<p>搭船拜訪後，可以回這裡看走過的島。</p>')+'</details></div>';
}
const neighborPath='/islands/neighbors';
const neighborPlaces=[
 '想暖場的話，可以先在任務港挑一件今天想完成的事。',
 '港邊咖啡街有咖啡館和麵包店，我喜歡坐在戶外看海。',
 '榕樹廣場有長椅和社區看板，可以找公開活動或看看大家的留言。',
 '山丘書屋的窗邊閱讀桌很安靜，適合帶著一本喜歡的書歇腳。',
 '旅人車站的明信片牆旁常有人停留，可以聊聊最近看見的風景。',
 '想找真人球伴的話，可以去榕樹廣場看看有沒有人開團。',
 '潮汐市集有花店、甜點攤和手作小物，沿著海邊慢慢逛就很好。',
 '我會從旅行港開始逛，再挑一個平常沒去過的街區散步。',
];
const questLinkStyles='.neighbor-quest a{display:inline-flex;align-items:center;min-height:44px;padding:6px 12px;background:#2d5546;color:#fff8e7;border-radius:10px;text-decoration:none;font-weight:650;font-size:.8rem}.neighbor-quest a:hover{background:#234739}';
const neighborStyles=questLinkStyles+`
body{padding:12px;background:#e8eee4}
main{width:min(100%,920px);padding:clamp(13px,3vw,28px);background:#faf6e9}
main>.brand{display:none}
.neighbor-nav{display:flex;gap:6px 15px;flex-wrap:wrap}.neighbor-nav a{display:inline-flex;align-items:center;min-height:44px;font-weight:650}
.neighbor-section{margin-top:18px;scroll-margin-top:10px}.neighbor-section h2{font-size:1.16rem;margin:0 0 6px}.neighbor-section h2 small{display:inline;margin:0 0 0 4px;font-size:.72rem}
.neighbor-grid{padding:0;margin:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));gap:7px}
.neighbor-grid a{display:grid;grid-template-columns:44px minmax(0,1fr);align-items:center;gap:8px;min-height:70px;padding:8px;background:#fffaf0;border:1px solid #c7d0be;border-radius:9px;text-decoration:none}
.neighbor-grid a:hover,.neighbor-grid a:focus-visible{background:#e7efe0}.neighbor-grid small{margin:1px 0 0;line-height:1.3}
.neighbor-room{max-width:600px;margin:auto}.neighbor-heading{display:grid;grid-template-columns:68px minmax(0,1fr);gap:10px;align-items:center}.neighbor-heading p,.neighbor-heading h1{margin:4px 0}
.neighbor-chat{list-style:none;padding:10px;margin:12px 0;max-height:340px;overflow-y:auto;background:#edf0e4;border:1px solid #c7d0be;border-radius:10px;display:grid;gap:7px}
.neighbor-chat li{max-width:88%;padding:8px 10px;background:#fffaf0;border-radius:8px;overflow-wrap:anywhere}.neighbor-chat li[data-you]{justify-self:end;background:#d7e7d7}.neighbor-chat b{display:block;font-size:.77rem}
.neighbor-form:not([hidden]){display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px;margin-top:8px}
.neighbor-topics:not([hidden]){display:flex;flex-wrap:wrap;gap:6px}
.neighbor-room a:focus-visible,.neighbor-grid a:focus-visible{outline:2px solid #9e5934;outline-offset:2px}
`;
function neighborAvatar(district,slot,wardrobe){
 const bears=['honey','mist','cocoa'],outfits=Object.keys(harborOutfits);
 return fullBody(avatar(bears[(district*7+slot*3)%bears.length],outfits[wardrobe%outfits.length]));
}
function neighborDirectory(){
 const nav=guestPorts.map((p,i)=>'<a href="#district-'+i+'">'+p.name+'</a>').join('');
 const sections=harborNeighbors.map((people,district)=>{
  const list=people.map(([name,role,wardrobe],slot)=>'<li><a href="'+neighborPath+'/'+district+'-'+slot+'">'+neighborAvatar(district,slot,wardrobe)+
   '<span><strong>'+escape(name)+'</strong><small>街區居民</small></span></a></li>').join('');
  return '<section class="neighbor-section" id="district-'+district+'"><h2>'+guestPorts[district].name+' <small>'+people.length+' 位</small></h2><ul class="neighbor-grid">'+list+'</ul></section>';
 }).join('');
 return html('<style>'+harborStyles+neighborStyles+'</style><nav class="neighbor-nav" aria-label="返回"><a href="/islands">← 熊熊島嶼</a><a href="/dock/square">榕樹廣場</a></nav>'+
  '<span class="trip-tag">BEAR ATLAS / HARBOR NEIGHBORS</span><h1>認識港城熊熊</h1><p>八個街區住著 49 位虛構角色。選一隻熊熊打招呼，訪客也可以聊。</p>'+
  '<nav class="neighbor-nav" aria-label="選擇街區">'+nav+'</nav>'+sections,200,undefined,{title:'認識港城熊熊｜熊熊 Atlas',brand:''});
}
function neighborConversation(url){
 const match=/^\/islands\/neighbors\/([0-7])-([0-6])$/.exec(url.pathname);
 const district=Number(match?.[1]),slot=Number(match?.[2]),neighbor=harborNeighbors[district]?.[slot];
 if(!neighbor)return harborHtml('<h1>這裡沒有這位熊熊</h1><a href="'+neighborPath+'">回港城熊熊名單 ↗</a>',404);
 const [name,role,wardrobe,story]=neighbor,port=guestPorts[district];
 const commission=Object.entries(residentQuests).find(([,quest])=>quest.resident===district+'-'+slot);
 const data=escape(JSON.stringify({name,role,story,daily:neighborPlaces[district],place:neighborPlaces[district],port:port.name}));
 return html('<style>'+harborStyles+neighborStyles+'</style><div class="neighbor-room" data-neighbor="'+data+'">'+
  '<nav class="neighbor-nav" aria-label="返回"><a href="'+neighborPath+'#district-'+district+'">← 回'+port.name+'的熊熊名單</a><a href="/islands">熊熊島嶼</a></nav>'+
  '<header class="neighbor-heading">'+neighborAvatar(district,slot,wardrobe)+'<div><span class="trip-tag">'+port.name+' / 虛構角色</span><h1>和 '+escape(name)+' 聊聊</h1><p>'+port.name+'的居民</p><details><summary>居民背景</summary><p>'+escape(role)+'</p></details></div></header>'+
  '<ol class="neighbor-chat" role="log" aria-label="聊天紀錄"><li><b>'+escape(name)+'</b>嗨！歡迎來'+port.name+'。今天想聊生活、興趣，還是附近可以去哪？</li></ol>'+
  '<div class="neighbor-topics" hidden><button type="button" data-neighbor-topic="greet">打招呼</button><button type="button" data-neighbor-topic="work">聊生活／興趣</button><button type="button" data-neighbor-topic="place">附近去哪玩？</button></div>'+
  '<form class="neighbor-form" hidden><input name="message" aria-label="輸入想聊的話" maxlength="160" autocomplete="off" placeholder="也可以自己輸入一句話" required><button type="submit">送出</button></form>'+
  '<noscript><p>'+escape(neighborPlaces[district])+'</p><p>'+escape(neighborPlaces[district])+'</p></noscript>'+
  (commission?'<p class="neighbor-quest"><a class="life-action" href="'+questPath+'/'+commission[0]+'">接受 '+name+' 的居民委託 ↗</a></p>':'')+
  '<small>角色會依話題用預先寫好的內容回覆。這段對話只留在目前頁面。</small>'+
  '<nav class="neighbor-nav" aria-label="繼續探索"><a href="/dock/'+port.id+'">前往'+port.name+' ↗</a><a href="/dock/square">找真人島民與揪團 ↗</a></nav>'+
  '</div><script src="/islands/neighbors-chat.js?v=town81" defer></script>',200,worldSceneHeaders,{title:'和 '+escape(name)+' 聊聊｜熊熊 Atlas',brand:''});
}
function neighborChatClient(target){
 const room=target||document.querySelector('.neighbor-room[data-neighbor]');
 if(!room)return;
 const {name,role,story,place,port,daily}=JSON.parse(room.dataset.neighbor);
 const log=room.querySelector('[role="log"]'),form=room.querySelector('form'),topics=room.querySelector('.neighbor-topics'),input=form.elements.message;
 const labels={greet:'嗨！很高興認識你。',work:'想聽你分享生活或興趣。',place:'附近有什麼可以玩？'};
 let last='';
 function line(speaker,message,mine=false){
  const item=document.createElement('li'),label=document.createElement('b');
  label.textContent=speaker;
  if(mine)item.dataset.you='';
  item.append(label,message);
  log.append(item);
 }
 function reply(topic,message){
  line('你',message,true);
  const answers={
   greet:'嗨，我是 '+name+'，住在'+port+'。我在日常喜歡慢慢散步。要不要聊聊附近的風景？',
   work:(daily||place)+' 你最近有什麼喜歡的小事？',
   place,
   follow:last==='place'?'你比較想一個人探索，還是約朋友一起？想找同伴，可以去榕樹廣場看看。':'我會先從一個很小的嘗試開始。你想把這個點子用在哪個情境？',
   bye:'很高興你來打招呼。下次經過'+port+'再來找我！',
   other:'這個話題我還聊不了。你可以問問我平常做什麼，或者我會去哪裡走走。',
  };
  line(name,answers[topic]);
  room.dispatchEvent(new CustomEvent('neighbor-interaction'));
  log.scrollTop=log.scrollHeight;
  last=topic;
 }
 topics.addEventListener('click',event=>{
  const topic=event.target.closest('button')?.dataset.neighborTopic;
  if(Object.hasOwn(labels,topic))reply(topic,labels[topic]);
 });
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const text=input.value.trim();
  if(!text)return;
  const topic=/謝謝|再見|thanks|bye/i.test(text)?'bye':
   /附近|去哪|景點|推薦|旅行|散步|玩什麼|where/i.test(text)?'place':
   /工作|興趣|怎麼做|策略|mba|財務|運動|高爾夫|匹克球|球|攝影|咖啡|故事|經驗|work|hobby/i.test(text)?'work':
   /^(嗨|你好|哈囉|hi\b|hello\b)|你是誰|認識/i.test(text)?'greet':
   last&&/例子|為什麼|真的|怎麼|然後|下一步|我也|我想/i.test(text)?'follow':'other';
  reply(topic,text);
  input.value='';
 });
 form.hidden=false;
 topics.hidden=false;
}
const neighborChatScript='('+neighborChatClient.toString()+')();';

const publicHarborCss=questLinkStyles+`
body{padding:0 12px 32px;background:#e8eee4}
main{width:min(100%,1180px);background:#f8f4e8;border:1px solid #c6d2c3;border-radius:0 0 20px 20px;padding:clamp(12px,2.5vw,26px)}
main>.brand{display:none}
.hb-head{display:flex;justify-content:space-between;align-items:center;gap:8px 18px;margin:2px 0 12px;flex-wrap:wrap}
.hb-head h1{margin:0;font-size:clamp(1.65rem,5.3vw,2.55rem);letter-spacing:.012em}
.hb-kicker{display:block;margin:0 0 4px;color:#624d38;font:700 .68rem/1.25 ui-monospace,monospace;letter-spacing:.15em;text-transform:uppercase}
.hb-account{display:flex;align-items:center;gap:8px 12px;flex-wrap:wrap;font-size:.86rem;color:#315649}
.hb-account a,.hb-link,.hb-panel a{color:#315649;text-underline-offset:3px}
.hb-account a,.hb-link,.hb-cta{display:inline-flex;align-items:center;min-height:44px}
.hb-account .hb-cta,.hb-panel .hb-cta{background:#2b5244;color:#fff8e7;border-radius:8px;padding:6px 12px;text-decoration:none;font-weight:700}
.hb-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,267px);gap:13px;align-items:start}
.hb-map{margin:0;border:1px solid #8ba997;border-radius:13px;overflow:hidden;background:#e9ede0;min-width:0}
.hb-stage{position:relative;isolation:isolate;aspect-ratio:940/608;background:#71a9a1;overflow:hidden;touch-action:pan-y}
.hb-stage>.atlas-harbor-city{display:block;width:100%;height:100%}
.hb-pin{position:absolute;z-index:3;left:var(--x);top:var(--y);transform:translate(-50%,-100%);display:inline-flex;align-items:center;gap:4px;min-height:44px;padding:0 7px;color:#28463c;text-decoration:none;white-space:nowrap;font-size:clamp(.67rem,1.5vw,.93rem);font-weight:750}
.hb-pin>span{display:inline-flex;align-items:center;gap:5px;min-height:25px;padding:2px 7px;border:1px solid #839779;border-radius:999px;background:#fff8e7;box-shadow:0 2px 5px #1c4c4752}
.hb-pin b{color:#785740;font:700 .71em ui-monospace,monospace}
.hb-pin[aria-current=true]>span,.hb-pin:hover>span,.hb-pin:focus-visible>span{background:#2b5244;color:#fff8e7;border-color:#2b5244}
.hb-pin[aria-current=true] b,.hb-pin:hover b,.hb-pin:focus-visible b{color:#f7ce9c}
.hb-actor{position:absolute;z-index:2;left:var(--x);top:var(--y);width:clamp(36px,7.2%,60px);transform:translate(-50%,-42%);pointer-events:none;filter:drop-shadow(2px 3px 1px #27453b7d) drop-shadow(0 0 1.5px #fff5d6)}
.hb-actor svg{display:block;width:100%;height:auto}.hb-actor.left svg{scale:-1 1}
.hb-actor.walk svg{animation:hb-step .32s ease-in-out infinite;transform-origin:center 88%}
@keyframes hb-step{0%,100%{transform:rotate(-7deg)}50%{transform:translateY(-11%) rotate(6deg)}}
.atlas-harbor-ripples{animation:hb-ripple 5s ease-in-out infinite alternate}
@keyframes hb-ripple{to{transform:translateX(16px);opacity:.55}}
.atlas-neighbor-walk{animation:hb-stroll var(--neighbor-duration) ease-in-out var(--neighbor-delay) infinite}
@keyframes hb-stroll{50%{transform:translate(var(--neighbor-x),var(--neighbor-y))}}
.hb-caption{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:5px 10px;min-height:44px;color:#395749;font-size:.77rem}
.hb-caption button,.hb-share button{min-height:44px;padding:3px 8px;background:transparent;border-color:#b2c2b1;font-size:.77rem}.hb-caption button:hover,.hb-share button:hover{background:#2b5244}
.hb-map[data-paused=true] :is(.atlas-neighbor-walk,.atlas-harbor-ripples,.hb-actor svg){animation-play-state:paused}
.hb-rail{display:grid;gap:10px;min-width:0}.hb-panel{border:1px solid #c9cbb8;border-radius:10px;padding:12px;background:#fff9ec;overflow-wrap:anywhere}
.hb-panel h2{margin:0 0 4px;font-size:1.14rem;line-height:1.28}.hb-panel p{font-size:.86rem;margin:5px 0 8px}
.hb-panel .hb-cta{margin-top:4px}
.hb-guide{background:#e5eddf;border-left:2px solid #6c8c71;padding:5px 8px;margin:8px 0;font-size:.82rem;cursor:pointer}
.hb-guide p{margin:4px 0}.hb-index{margin:0;padding:0;list-style:none}.hb-index a{display:grid;min-height:44px;align-items:center;grid-template-columns:24px 1fr auto;gap:5px;border-top:1px solid #e1dbcb;text-decoration:none;font-size:.87rem}.hb-index a:hover,.hb-index a[aria-current=true]{background:#e8eee1}.hb-index b{color:#785740;font:700 .72rem ui-monospace,monospace}
.hb-share{margin:12px 0 0;display:flex;align-items:center;gap:8px 12px;flex-wrap:wrap;color:#395749;font-size:.8rem}
.hb-count{display:inline-grid;place-items:center;min-width:17px;height:17px;padding-inline:3px;border-radius:50px;background:#8c4d39;color:#fff8e7;font:750 .67rem/1 system-ui}
.hb-dock-shortcut{gap:5px;font-weight:700}.hb-pin.hb-dock-link>span{background:#e5eddf;border-color:#3d6657}.hb-pin.hb-dock-link[aria-current=true]>span,.hb-pin.hb-dock-link:hover>span,.hb-pin.hb-dock-link:focus-visible>span{background:#2b5244}
.hb-dock-panel{background:#f1f3e7;border-color:#adc3ae;scroll-margin:12px}.hb-dock-panel:focus-visible{outline:2px solid #567c63;outline-offset:3px}
.hb-inbox{margin:10px 0 0}.hb-inbox h3{font-size:.9rem;margin:0}.hb-inbox h3 span{font-size:.75rem;color:#74523e}.hb-inbox ul{margin:0;padding:0;list-style:none}.hb-inbox small{margin:3px 0 6px;font-size:.74rem}
.hb-dock-services{margin-top:10px;display:grid;gap:4px}.hb-dock-services details{border-top:1px solid #d6d4c1}.hb-dock-services summary{cursor:pointer;padding:10px 0;min-height:44px;font-size:.83rem;font-weight:650}.hb-dock-services .world-tile{padding:6px 0}.hb-dock-services .world-tile span{color:#74523e;font-size:.72rem}.hb-dock-services .world-tile h2{font-size:1rem}
@media(max-width:760px){.hb-layout{grid-template-columns:1fr}.hb-index{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:8px}.hb-stage{aspect-ratio:1.37}.hb-pin{padding:0 2px}.hb-pin>span{padding:2px 5px;gap:3px}}
@media(prefers-reduced-motion:reduce){.hb-map *{animation:none!important}}
.hb-neighbor{cursor:pointer}.hb-neighbor g.atlas-neighbor-walk{pointer-events:none}
.hb-neighbor a:focus{outline:none}.hb-neighbor text{display:none;fill:#25483b;paint-order:stroke;stroke:#fff6e0;stroke-width:4px;stroke-linejoin:round;font:700 12px system-ui;pointer-events:none}
.hb-neighbor:is(:hover,:focus-within) text{display:block}
.hb-neighbor:is(:hover,:focus-within) rect{fill:#fff5cf66;stroke:#7a4c2a;stroke-width:1.6}
.hb-neighbor:is(:hover,:focus-within) .atlas-neighbor-walk{animation-play-state:paused}
.hb-neighbor-choices{display:flex;gap:5px;flex-wrap:wrap;margin-top:9px}
.hb-neighbor-choices a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:4px 10px;border:1px solid #b9c8ae;background:#eff2e5;border-radius:999px;text-decoration:none;font-weight:650}
.hb-neighbor-choices a[aria-expanded=true]{background:#2b5244;color:#fff8e7}
.hb-welcome{margin:10px 0 12px;padding:12px 15px;border:1px solid #aebe9f;border-radius:12px;background:#eef1dd}
.hb-welcome[hidden],.hb-chat-panel[hidden],.hb-welcome [hidden],.hb-chat-panel [hidden]{display:none!important}
.hb-welcome h2{font-size:1.15rem;margin:5px 0}.hb-welcome p{margin:4px 0 9px;font-size:.88rem}
.hb-welcome-top,.hb-chat-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
.hb-welcome-top button,.hb-chat-top button{min-height:44px;padding:5px 8px;background:transparent;font-size:.78rem}
.hb-welcome-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;padding:0;list-style:none;font-size:.78rem;margin:6px 0}.hb-welcome-steps button{width:100%;min-height:44px;padding:6px;font-size:inherit;text-align:left;background:transparent;overflow-wrap:anywhere}.hb-welcome-steps button:hover{background:#e0e8cf;color:#25483b}
.hb-welcome-steps [aria-current=step]{font-weight:750;color:#7a4b2b;background:#fff7dc;border-color:#9e7954}
.hb-welcome .hb-cta{background:#2b5244;color:#fff8e7;padding:5px 12px;border-radius:7px;text-decoration:none}
.hb-welcome-notice:empty{display:none}.hb-welcome-notice{font-size:.86rem;color:#28583e}
.hb-chat-panel{scroll-margin:10px;background:#f6f1e3}
.hb-chat-panel .neighbor-heading{display:grid;grid-template-columns:48px minmax(0,1fr);gap:8px;align-items:center;min-width:0}.hb-chat-panel .neighbor-heading>svg{display:block;width:48px;height:48px;max-width:100%;min-width:0}.hb-chat-panel .neighbor-heading>div{min-width:0;overflow-wrap:anywhere}
.hb-chat-panel h2{font-size:1.08rem;margin:3px 0}.hb-chat-panel .neighbor-heading p{font-size:.78rem}
.hb-chat-panel .neighbor-chat{list-style:none;padding:5px;display:grid;gap:6px;max-height:245px;overflow:auto;background:#e9eee0;border-radius:8px}
.hb-chat-panel .neighbor-chat li{padding:7px;background:#fffaf0;border-radius:7px;overflow-wrap:anywhere;font-size:.83rem}
.hb-chat-panel .neighbor-chat li[data-you]{background:#d5e7d3}.hb-chat-panel .neighbor-chat b{display:block;font-size:.7rem}
.hb-chat-panel .neighbor-topics:not([hidden]){display:flex;gap:4px;flex-wrap:wrap}
.hb-chat-panel .neighbor-topics button{font-size:.73rem;padding:4px 7px;min-height:44px}
.hb-chat-panel .neighbor-form:not([hidden]){display:grid;grid-template-columns:minmax(0,1fr) auto;gap:5px;margin-top:6px}
.hb-chat-panel .neighbor-form input,.hb-chat-panel .neighbor-form button{font-size:.8rem;min-width:0;padding:6px}
.hb-chat-panel .neighbor-room>small{font-size:.7rem;margin-top:8px}
.hb-chat-panel [data-hb-chat-status]:empty{display:none}

body{background:#e6ece3}
main{border-color:#c9d0bf;background:#faf7ed;box-shadow:0 12px 45px #24473b08}
.hb-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 14px;margin:0 0 10px}
.hb-head h1{font-size:clamp(1.6rem,4.3vw,2.3rem);letter-spacing:.025em}
.hb-head .hb-kicker{font-size:.6rem;letter-spacing:.12em;color:#7d725c}
.hb-identity{display:grid;justify-items:end;gap:3px;max-width:170px}
.hb-identity a{display:inline-flex;align-items:center;min-height:44px;text-decoration:none}
.hb-passport{padding:7px 13px;border:1px solid #8fa790;border-radius:12px;background:#eef1e1;color:#294a3c;font-weight:700;gap:6px;max-width:100%;overflow-wrap:anywhere}
.hb-passport small{font-size:.65rem;margin:0;color:#60715b}
.hb-identity .hb-join{background:#2d5546;color:#fff9e8;border-color:#2d5546}
.hb-identity .hb-login{font-size:.72rem;min-height:32px;text-decoration:underline;text-underline-offset:3px}
.hb-account{grid-column:1/-1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;font-size:.8rem}
.hb-account a{display:flex;align-items:center;justify-content:center;min-height:44px;padding:5px;border:1px solid #d7dbc9;border-radius:10px;background:#f6f3e6;text-decoration:none;gap:4px}
.hb-account a[aria-current=page]{background:#2b5244;color:#fff8e7;border-color:#2b5244}
.hb-account a:hover{background:#e4ebda}.hb-account a[aria-current=page]:hover{background:#274d40}
.hb-map{border-color:#94ae9a;border-radius:18px;box-shadow:0 6px 16px #3655450b}
.hb-caption{padding:7px 11px;background:#f0f2e4;font-size:.74rem}
.hb-panel{border-color:#d4d6c4;border-radius:15px;background:#fffbf0;padding:14px}
.hb-panel h2{font-size:1.14rem}.hb-panel .hb-cta,.hb-welcome .hb-cta{border-radius:10px}
.hb-welcome{margin:0 0 11px;padding:0;border-radius:12px;background:#f1f1df;border-color:#c9d0b9}
.hb-welcome>summary{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:48px;padding:9px 12px;cursor:pointer;list-style:none;color:#355441;font-size:.83rem;font-weight:700}
.hb-welcome>summary::-webkit-details-marker{display:none}
.hb-welcome>summary::after{content:'＋';font-size:1rem;flex:none}
.hb-welcome[open]>summary::after{content:'−'}
.hb-welcome>summary [data-hb-welcome-progress]{color:#6a725a;font-size:.72rem;font-weight:500}
.hb-welcome-content{padding:0 12px 12px;border-top:1px solid #d9ddcb}
.hb-welcome-top{justify-content:flex-end}
.hb-welcome .hb-welcome-steps{gap:5px;margin-top:0}
.hb-welcome h2{font-size:1.05rem}
.hb-welcome .hb-welcome-top button{min-height:36px;margin:3px 0;border:0;color:#5b6d56}
.hb-welcome .hb-welcome-steps button{border-radius:9px;font-size:.77rem}
.hb-share{padding:10px 0;border-top:1px solid #d7dccb;font-size:.76rem}
.hb-share button{border-radius:10px}
dialog.hb-chat-panel{position:static;inset:auto;margin:0;width:100%;max-width:none;max-height:none;box-sizing:border-box;color:#29483c;min-width:0}
dialog.hb-chat-panel:not([open]){display:none!important}
.hb-chat-top{padding-bottom:7px;border-bottom:1px solid #dedfcf;margin-bottom:8px}
.hb-chat-top .hb-kicker{font-size:.64rem;color:#7d725c}
.hb-chat-panel .neighbor-heading{grid-template-columns:52px minmax(0,1fr);gap:10px;margin:7px 0 11px}
.hb-chat-panel .hb-resident-note{font-size:.8rem;line-height:1.65;margin:0 0 10px;color:#64715a}.hb-chat-panel .neighbor-heading>svg{width:52px;height:52px;padding:3px;background:#eee8d7;border-radius:16px}
.hb-chat-panel .neighbor-chat{gap:8px;padding:9px;border:1px solid #d6decd;border-radius:13px;background:#edf1e5}
.hb-chat-panel .neighbor-chat li{max-width:94%;padding:9px 10px;border-radius:11px 11px 11px 3px;line-height:1.65}
.hb-chat-panel .neighbor-chat li[data-you]{justify-self:end;border-radius:11px 11px 3px 11px;background:#d8e7d1}
.hb-chat-panel .neighbor-topics button{border-radius:999px;background:#f7f6eb}
.hb-chat-panel .neighbor-form input{border-radius:10px;background:#fffdf7}
.hb-chat-panel .neighbor-form button{border-radius:10px;background:#2b5244;color:#fff8e7}
.hb-chat-panel>div[data-hb-chat-body]{min-width:0}
@media(max-width:760px){
 body{padding:0 8px 20px}
 main{padding:12px 10px 17px;border-radius:0 0 20px 20px}
 .hb-identity{max-width:145px}.hb-passport{font-size:.81rem;padding:6px 10px}.hb-passport small{display:none}
 .hb-head .hb-kicker{font-size:.52rem;letter-spacing:.09em}
 .hb-head h1{font-size:1.66rem}
 .hb-account{gap:4px;font-size:.76rem}
 .hb-stage{aspect-ratio:1.32}
 .hb-welcome>summary{font-size:.79rem}
 .hb-neighbor-choices a{font-size:.84rem}
 dialog.hb-chat-panel{position:fixed;inset:auto 0 var(--hb-keyboard-inset,0px);margin:0 auto;width:100%;max-width:560px;max-height:min(84dvh,calc(var(--hb-viewport-height,100dvh) - 12px));padding:12px 15px max(14px,env(safe-area-inset-bottom));border:1px solid #becab3;border-bottom:0;border-radius:24px 24px 0 0;overflow-y:auto;overscroll-behavior:contain;box-shadow:0 -14px 60px #24473b24}
 dialog.hb-chat-panel[open]{animation:hb-sheet-enter .24s cubic-bezier(.2,.7,.2,1)}
 dialog.hb-chat-panel::backdrop{background:#203e3459;backdrop-filter:blur(2px)}
 .hb-chat-top{position:sticky;top:-12px;padding-top:5px;background:#f6f1e3;z-index:1}
 .hb-chat-top::before{content:'';position:absolute;top:-6px;left:calc(50% - 18px);height:4px;width:36px;background:#b9c4ae;border-radius:5px}
 .hb-chat-top button{font-size:.8rem;border-radius:999px}
 .hb-chat-panel .neighbor-chat{max-height:clamp(130px,31dvh,320px);min-height:100px}
 .hb-chat-panel .neighbor-chat li{font-size:.88rem}
 .hb-chat-panel .neighbor-topics button{font-size:.79rem}
 .hb-chat-panel .neighbor-form input{font-size:16px}
 .hb-chat-panel .neighbor-form button{font-size:.85rem}
 .hb-chat-panel .neighbor-room>small{font-size:.71rem;color:#68745e}
}
@keyframes hb-sheet-enter{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@media(prefers-reduced-motion:reduce){dialog.hb-chat-panel[open]{animation:none}}

.hb-life-links{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:16px 0}
.hb-life-links a{display:grid;gap:5px;padding:15px;border:1px solid #c9d2bb;border-radius:16px;background:#eef0df;text-decoration:none;color:#31513e}
.hb-life-links a:last-child{background:#f0e8db}.hb-life-links a:hover{border-color:#6d8c68}
.hb-life-links span{font:700 .59rem/1.4 ui-monospace,monospace;letter-spacing:.1em;color:#7c715b}
.hb-life-links strong{font-size:1.12rem}.hb-life-links small{margin:0;font-size:.76rem;line-height:1.6}
@media(max-width:480px){.hb-life-links{grid-template-columns:1fr}}

`;
const harborPier={x:548,y:566};
const harborPierArt='<g aria-hidden="true"><path d="m490 503 63 44 13 19-18 14-32-20 9-11-49-32z" fill="#437871" opacity=".47" transform="translate(1 7)"/><path d="m483 503 53 35 12-7 29 20-28 21-30-18 7-7-53-35z" fill="#a48765" stroke="#715f4d" stroke-width="2"/><path d="m483 499 53 35 12-7 29 20-28 21-30-18 7-7-53-35z" fill="#e5c999" stroke="#fff0c9" stroke-width="1.8"/><path d="m486 508 7-6m5 15 7-6m5 14 7-6m5 15 7-6m5 22 17-14m-8 20 18-14m-9 19 18-13" fill="none" stroke="#a58a65" stroke-width="1.8"/><path d="m524 552 0-13m25 29v-15m24-6v-12" fill="none" stroke="#705645" stroke-width="4" stroke-linecap="round"/><path d="m564 567 27-17 11 8-26 18z" fill="#7c5c49"/><path d="m569 568 22-14 6 4-21 14z" fill="#f6e2b7"/></g>';

function seaMapPins(){
 const state=secretMapState(),{size}=harborGeometry,groups=new Map();for(const r of state.residents){if(!groups.has(r.stop))groups.set(r.stop,[]);groups.get(r.stop).push(r);}
 return '<div data-sea-resident-pins>'+[...groups].map(([stop,people])=>{const r=people[0],group=people.length>1,point=harborGeometry.stops[stop],x=group?point.x:r.x,y=group?point.y+35:r.y-27,names=people.map(p=>p.name).join('・');return '<a class="hb-secret-pin" data-sea-open data-sea-pin="'+(group?'group-'+stop:r.id)+'" href="/dock/secrets'+(group?'?stop='+stop:'/'+r.id)+'" style="--x:'+x/size.x*100+'%;--y:'+y/size.y*100+'%" aria-label="遇見 '+names+'" title="'+people.map(p=>p.place).join(' · ')+'">✦ '+names+'</a>';}).join('')+'</div>';
}
function seaMapDialog(){return '<dialog class="sea-dialog" id="sea-dialog" data-sea-dialog aria-labelledby="sea-dialog-title"><header><h2 id="sea-dialog-title">島上的新發現</h2><button type="button" data-sea-close aria-label="關閉島上故事">回地圖 ✕</button></header><div data-sea-body><p data-sea-status role="status"></p></div></dialog>';}
function seaLifeClient(){
 const dialog=document.querySelector('[data-sea-dialog]');if(!dialog)return;
 const body=dialog.querySelector('[data-sea-body]'),title=dialog.querySelector('h2');let path='',busy=false,requestId=0,trigger=null,timer=0;
 const allowed=url=>url.origin===location.origin&&(url.pathname==='/dock/secrets'||url.pathname.startsWith('/dock/secrets/')||url.pathname==='/dock/bottles'||url.pathname.startsWith('/dock/bottles/'));
 function render(text){const doc=new DOMParser().parseFromString(text,'text/html'),content=doc.querySelector('.sea-content');if(!content){body.textContent='這段故事暫時無法開啟，回地圖後可以再試一次。';return;}title.textContent=content.querySelector('h1')?.textContent||'島上的新發現';body.replaceChildren(content);}
 async function load(url,options){
  const token=++requestId;path=url.pathname+url.search;
  if(!options)body.textContent='海風把故事帶過來了，稍等一下…';
  try{const response=await fetch(path,{credentials:'same-origin',cache:'no-store',...options}),text=await response.text();if(token!==requestId||!dialog.open)return;const final=new URL(response.url);if(allowed(final))path=final.pathname+final.search;render(text);}
  catch{if(token===requestId){body.textContent='暫時沒有連上島嶼。關閉後再試，已完成的進度會保留。';}}
 }
 document.addEventListener('click',event=>{
  const a=event.target.closest('a[data-sea-open]');if(!a||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const url=new URL(a.getAttribute('href'),location.origin);if(!allowed(url))return;event.preventDefault();trigger=a;trigger.setAttribute('aria-expanded','true');if(!dialog.open)dialog.showModal();load(url);
 });
 dialog.querySelector('[data-sea-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
 dialog.addEventListener('close',()=>{requestId++;trigger?.setAttribute('aria-expanded','false');trigger?.focus();});
 dialog.addEventListener('submit',async event=>{event.preventDefault();if(busy)return;busy=true;const form=event.target,data=new FormData(form);if(event.submitter?.name)data.set(event.submitter.name,event.submitter.value);const action=new URL(form.getAttribute('action')||path,location.origin);if(!allowed(action)){busy=false;return;}form.querySelectorAll('button').forEach(b=>b.disabled=true);try{await load(action,{method:'POST',body:new URLSearchParams(data)});}finally{busy=false;}});
 const note=document.querySelector('[data-sea-clock]');
 async function refresh(){
  if(document.hidden){timer=setTimeout(refresh,60000);return;}
  try{const response=await fetch('/dock/secrets?map=1',{cache:'no-store',credentials:'same-origin'});if(!response.ok)throw Error();const state=await response.json();
   for(const r of state.residents){const person=document.querySelector('[data-sea-resident="'+r.id+'"]');if(person)person.setAttribute('transform','translate('+r.x+' '+r.y+')');}
   const pins=document.querySelector('[data-sea-resident-pins]'),groups=new Map();for(const r of state.residents){if(!groups.has(r.stop))groups.set(r.stop,[]);groups.get(r.stop).push(r);}if(pins){const links=[];for(const [stop,people] of groups){const r=people[0],many=people.length>1,a=document.createElement('a'),x=many?r.x+(r.id==='hugo'?42:r.id==='liv'?-39:-12):r.x,y=many?r.y+(r.id==='ari'?-18:5):r.y-27;a.className='hb-secret-pin';a.dataset.seaOpen='';a.dataset.seaPin=many?'group-'+stop:r.id;a.href='/dock/secrets'+(many?'?stop='+stop:'/'+r.id);a.style.setProperty('--x',x/940*100+'%');a.style.setProperty('--y',y/608*100+'%');a.textContent='✦ '+people.map(p=>p.name).join('・');a.setAttribute('aria-label','遇見 '+people.map(p=>p.name).join('・'));links.push(a);}pins.replaceChildren(...links);}
   if(note)note.textContent='台灣時間 '+state.label+' · 居民正在島上生活';schedule(state.nextChange);
  }catch{timer=setTimeout(refresh,60000);}
 }
 function schedule(next){clearTimeout(timer);timer=setTimeout(refresh,Math.max(1000,Math.min(86400000,Number(next)-Date.now()+500)));}
 if(note){schedule(note.dataset.seaNext);document.addEventListener('visibilitychange',()=>{if(!document.hidden){clearTimeout(timer);refresh();}});}
}
function interactiveHarborArt(){
 const state=secretMapState();
 return harborArt.replace('aria-hidden="true" focusable="false"','role="group" aria-label="港城居民"')
  .replace(/<g class="atlas-neighbor" data-neighbor="([0-7])-([0-6])" transform="([^"]+)"><g class="atlas-neighbor-walk" style="([^"]+)">/g,(original,district,slot,transform,walkStyle)=>{
   const resident=harborNeighbors[Number(district)]?.[Number(slot)];
   if(!resident)return original;
   const name=escape(resident[0]),secret=state.residents.find(r=>r.resident===district+'-'+slot);
   if(secret){transform='translate('+secret.x+' '+secret.y+')';walkStyle='--neighbor-x:8px;--neighbor-y:-4px;--neighbor-duration:7s;--neighbor-delay:-2s';}
   return '<g class="atlas-neighbor hb-neighbor"'+(secret?' data-sea-resident="'+secret.id+'"':'')+' transform="'+transform+'"><a class="atlas-neighbor-walk" style="'+walkStyle+'" href="'+(secret?'/dock/secrets/'+secret.id:neighborPath+'/'+district+'-'+slot)+'" '+(secret?'data-sea-open':'data-hb-neighbor')+' aria-label="和 '+name+' 聊聊" aria-controls="'+(secret?'sea-dialog':'harbor-chat')+'" aria-expanded="false">'+
    '<rect x="-15" y="-35" width="30" height="42" rx="9" fill="transparent" stroke="transparent"/><text x="0" y="-40" text-anchor="middle">'+name+'</text></a><g class="atlas-neighbor-walk" style="'+walkStyle+'">';
  }).replace(/<\/svg>$/,harborPierArt+townMapProps()+sadMapArt+'</svg>');
}
function harborWelcome(profile,memberCode){
 return '<details class="hb-welcome" data-hb-welcome data-has-passport="'+Boolean(profile)+'" data-guide-member="'+escape(memberCode||'guest')+'" hidden>'+
  '<summary><span>第一次登島的小指南</span><span data-hb-welcome-progress></span></summary><div class="hb-welcome-content">'+
  '<div class="hb-welcome-top"><button type="button" data-hb-welcome-skip>自由探索</button></div>'+
  '<ol class="hb-welcome-steps"><li><button type="button" data-hb-welcome-step="0">1. 選角色</button></li><li><button type="button" data-hb-welcome-step="1">2. 認識居民</button></li><li><button type="button" data-hb-welcome-step="2">3. 完成互動</button></li></ol>'+
  '<h2 data-hb-welcome-task></h2><p data-hb-welcome-lead></p>'+
  '<a class="hb-cta" data-hb-welcome-register href="/passport?next=%2Fislands#passport-form">選熊熊、領島民證 ↗</a>'+
  '<button type="button" data-hb-welcome-meet hidden>帶我認識 Clara</button></div></details>';
}

function resortMapArt(){
 const state=secretMapState(),paths=[[[430,430],[420,370]],[[420,370],[270,305]],[[420,370],[520,337]],[[520,337],[675,280]],[[520,337],[680,415]],[[420,370],[310,365]],[[310,365],[250,345]],[[270,305],[360,240]],[[360,240],[510,230]],[[510,230],[675,280]]];let index=0;
 const figures=harborNeighbors.map((group,d)=>group.map(([name,role,look],i)=>{const n=index++,id=d+'-'+i,secret=state.residents.find(r=>r.resident===id),[a,b]=paths[n%paths.length],t=((Math.floor(n/paths.length)+.5)/Math.ceil(49/paths.length)),x=a[0]+(b[0]-a[0])*t+(n%2?9:-9),y=a[1]+(b[1]-a[1])*t+(n%3-1)*12,portrait=neighborAvatar(d,i,look).replace('<svg','<svg x="-13" y="-43" width="26" height="43"'),target=secret?'/dock/secrets/'+secret.id:neighborPath+'/'+id;
 return '<g class="hb-neighbor resort-npc" data-resort-resident="'+id+'"'+(secret?' data-sea-resident="'+secret.id+'"':'')+' transform="translate('+x+' '+y+')"><g class="resort-stroll" style="--stroll-delay:-'+(n*1.7)+'s"><a href="'+target+'" '+(secret?'data-sea-open':'data-hb-neighbor')+' aria-label="和 '+escape(name)+' 聊聊" aria-controls="'+(secret?'sea-dialog':'harbor-chat')+'" aria-expanded="false"><title>'+escape(name)+'</title><rect x="-16" y="-45" width="32" height="48" rx="12"/>'+portrait+'</a></g></g>';
 }).join('')).join('');
 return '<canvas class="resort-webgl" data-resort-3d aria-hidden="true"></canvas>'+resortArtwork({tree:isoTree,house:isoHouse}).replace('</svg>','<g data-resort-people role="group" aria-label="49 位渡假村居民">'+figures+'</g></svg>').replace(/\n/g,'');
}

async function resortHome(request,env,url,visitor){
 if(request.method!=='GET')return worldPage('請從自己的小屋儲存布置','<a href="/world">回渡假村</a>',405);
 const profile=visitor?await readPassportProfile(env.DB,visitor):null;
 if(!profile)return worldPage('先登入自己的島民證',memberLinks(url.pathname),401);
 const credential=await ensureCredential(env.DB,visitor),ownCode=memberLabel(credential.member_no),code=url.pathname==='/world/home'?ownCode:url.pathname.split('/').at(-1);
 if(worldMemberCode(code)!==code)return worldPage('找不到這間小屋','<a href="/world">回渡假村</a>',404);
 const own=code===ownCode;if(own)return dockRedirect('/dock/cabin');
 const owner=own?profile:await env.DB.prepare('SELECT p.nickname,p.bear,p.outfit,c.visitor_key FROM island_credentials c JOIN island_passports p ON p.visitor_key=c.visitor_key WHERE c.member_no=?').bind(code==='BEAR-0000'?-1:Number(code.slice(5))).first();
 if(!owner)return worldPage('找不到這間小屋','<a href="/world">回渡假村</a>',404);
 const shared=own?null:await env.DB.prepare('SELECT share_enabled FROM island_cabins WHERE visitor_key=?').bind(owner.visitor_key).first();
 const allowed=own||shared?.share_enabled===1,entrance=own?cabinPath:'/islands/cabins/'+code;
 const portrait=memberAvatar(profile,true),title=(own?'我的家門':owner.nickname+' 的家門');
 const scene='<figure class="world-isometric"><div class="iso-stage" data-iso="porch" aria-label="'+escape(title)+'"><span hidden data-home-code="'+code+'"></span>'+resortPorchArt({tree:isoTree,house:isoHouse})+'<span class="iso-avatar" aria-hidden="true" style="--iso-x:49%;--iso-y:69%">'+portrait+'</span>'+(allowed?'<a class="iso-pin" data-resort-door href="'+entrance+'" style="--iso-x:51%;--iso-y:61%" data-x="51" data-y="54">'+(own?'走到門口，進屋 ↗':'走到門口，參觀客廳 ↗')+'</a>':'')+'</div><div class="iso-controls" hidden><span>點小徑散步，點家門進屋</span><nav aria-label="熊熊移動"><button type="button" data-move="left">←</button><button type="button" data-move="up">↑</button><button type="button" data-move="down">↓</button><button type="button" data-move="right">→</button></nav></div><figcaption class="iso-caption">門牌 '+code+' · 信箱與花園前的小徑</figcaption></figure>';
 return html('<style>'+worldSceneCss+resortStyles+'</style><section class="resort-porch"><nav class="resort-services"><a href="/world'+(own?'?at=home':'')+'">← 回渡假村</a><a href="/dock/cabin">回家</a><a href="/passport">我的護照</a></nav><h1>'+escape(title)+'</h1><p class="resort-door-info">'+(own?'原本的家具、房間與收藏都在，今天也可以什麼都不做。':allowed?'屋主已開放客廳參觀。私人臥室不開放；訪客不能修改家具。':'屋主尚未開放參觀，可以請屋主在小屋設定開啟。')+'</p>'+scene+'<p class="resort-help">這是各自探索的小屋空間，目前沒有即時共同在線功能。信箱目前只是外觀，不會傳送訊息。</p></section><script src="/world-scene.js?v=resort-v83" defer></script>',200,worldSceneHeaders,{title:escape(title)+'｜熊熊渡假村',brand:''});
}

function publicHarbor(url,profile,credential,isFounder,invitations,dockServices){
 const map='/world',dockStop=9,requested=url.searchParams.get('at'),initial=requested==='home'?11:[1,5,7,9,11].includes(Number(requested))?Number(requested):dockStop;
 const accountLinks=returnTo=>({login:'/passport?recover=1&next='+encodeURIComponent(returnTo)+'#passport-recover',join:'/passport?next='+encodeURIComponent(returnTo)+'#passport-form'});
 const {login,join}=accountLinks(initial===dockStop?harborDockPath:map);
 const dockAccount=accountLinks(harborDockPath);
 const count=invitations.length,invitedToCove=invitations.some(i=>i.island_id==='emerald');
 const badge=count?'<span class="hb-count" aria-label="'+count+' 則邀請">'+count+'</span>':'';
 const avatarSvg=fullBody(profile?memberAvatar(profile,true):avatar('honey','explorer'));
 const {stops:positions,size,links}=resortGeometry;
 const stopsConfig=[
 {i:9,n:'01',name:'抵達碼頭',to:harborDockPath},
 {i:1,n:'02',name:'海邊生活街',hint:'喝杯咖啡、逛市集，或翻一本喜歡的書',to:'/dock/career',cta:'走進咖啡館'},
 {i:5,n:'03',name:'運動俱樂部',hint:'海風裡的果嶺與伸展平台。自由練習，不用比賽或打卡',to:'/dock/sports',cta:'去果嶺練一球'},
 {i:11,n:'04',name:'我的小屋',hint:profile?'你原本的小屋與布置都在。走近家門，就能進屋休息':'先領取島民證，就能回到自己的小屋',to:'/dock/cabin',cta:'回家休息'},
 {i:7,n:'05',name:'自然休憩區',hint:'沿著海岸走走，在花園長椅上休息，或到安靜的小島整理心情',to:'/world/nature',cta:'走進海岸花園'}];
 const services={1:'<div class="resort-services"><a href="/dock/mba">山丘書屋</a><a href="/dock/finance">潮汐市集</a><a href="/dock/square">榕樹廣場</a></div>',7:'<div class="resort-services"><a href="/dock/bottles" data-sea-open>漂流瓶接力</a></div>'};
 const dockLink=(text,cls='')=>'<a'+(cls?' class="'+cls+'"':'')+' href="'+harborDockPath+'" data-stop="'+dockStop+'"'+(initial===dockStop?' aria-current="true"':'')+'>'+text+'</a>';
 const item=(port,pin)=>{
  const {x,y}=positions[port.i],isDock=port.i===dockStop;
  return '<a class="'+(pin?'hb-pin':'hb-index-link')+(isDock?' hb-dock-link':'')+'" href="'+port.to+'" data-stop="'+port.i+'"'+(port.i===initial?' aria-current="true"':'')+
   (pin?' style="--x:'+x/size.x*100+'%;--y:'+y/size.y*100+'%"':'')+
   '>'+(pin?'<span>':'')+'<b'+(isDock?' aria-hidden="true"':'')+'>'+port.n+'</b> '+port.name+(isDock?badge:'')+(pin?'</span>':isDock&&count?'':'<span aria-hidden="true">↗</span>')+'</a>';
 };
 const summaries=stopsConfig.filter(p=>p.i!==dockStop).map(p=>'<section class="hb-panel" data-destination="'+p.i+'"'+(p.i===initial?'':' hidden')+'><span class="hb-kicker">PORT '+p.n+'</span><h2>'+p.name+'</h2><p>'+p.hint+'。</p>'+
  (p.question&&!townPlaces[p.id]?'<details class="hb-guide"><summary>試玩：看島上的問題</summary><p>'+p.question+'</p></details>':'')+
  (p.i===8&&invitedToCove?dockLink('去碼頭搭船 ↗','hb-cta'):'<a class="hb-cta" href="'+p.to+'">'+p.cta+' ↗</a>')+(services[p.i]||'')+(p.i<guestPorts.length?'<div class="hb-neighbor-choices" aria-label="'+p.name+'居民">'+harborNeighbors[p.i].map(([name],slot)=>'<a href="'+neighborPath+'/'+p.i+'-'+slot+'" data-hb-neighbor aria-controls="harbor-chat" aria-expanded="false">'+escape(name)+'</a>').join('')+'</div>':'')+'</section>').join('');
 const inbox=count?'<section class="hb-inbox"><h3>收到的邀請 <span>'+count+' 則</span></h3><ul>'+invitations.map(i=>'<li><a class="hb-cta" href="/world/sail/'+i.island_id+'">搭船前往'+escape(worldInviteTitle(i))+' ↗</a><small>至 '+worldVisitDate(i.expires_at)+'（台灣時間）</small></li>').join('')+'</ul></section>':
  '<p class="hb-dock-empty">'+(profile?'目前沒有待赴的邀請。島主用你的島民編號邀請後，船票會出現在這裡。':'登入受邀的島民證，就能在這裡看船票和登島紀錄。')+'</p>';
 const dockPanel='<section class="hb-panel hb-dock-panel" id="dock-station" data-destination="'+dockStop+'" tabindex="-1"'+(initial===dockStop?'':' hidden')+'><span class="hb-kicker">Visitor Dock</span><h2>抵達碼頭</h2><p>歡迎來到熊熊渡假村。點地點就會慢慢走過去並進入；「回家」直接帶你進屋。</p><a class="hb-cta" href="/dock/square">到廣場打招呼 ↗</a><div class="resort-services"><a href="/world/emerald">私人島嶼入口</a></div>'+inbox+
  (profile?dockServices:'<a class="hb-cta" href="'+dockAccount.login+'">登入島民證 ↗</a> <a class="hb-link" href="'+dockAccount.join+'">領取島民證</a>')+'</section>';
 return html('<style>'+publicHarborCss+seaStyles+publicMapStyle+resortStyles+'</style><header class="hb-head"><div><span class="hb-kicker">Bear Atlas / Seaside Retreat</span><h1>熊熊渡假村</h1></div>'+
  '<div class="hb-identity">'+(profile?'<a class="hb-passport" href="/passport" title="'+escape(profile.nickname)+' 的護照" aria-label="'+escape(profile.nickname)+' 的護照 '+memberLabel(credential.member_no)+'"><span class="hb-player-name">'+escape(profile.nickname)+'</span><small>'+memberLabel(credential.member_no)+'</small></a>':'<a class="hb-passport hb-join" href="'+join+'">新玩家登島 ↗</a><a class="hb-login" href="'+login+'">已有島民證？登入</a>')+'</div>'+
  '<nav class="hb-account" aria-label="島嶼導覽"><a href="#dock-activities" aria-current="page">地圖</a><a href="'+neighborPath+'">找居民</a><a href="'+(profile?cabinPath:'/world/home')+'">回家</a>'+
  dockLink('碼頭 '+badge,'hb-dock-shortcut')+'</nav></header><p class="hb-town-intro">成年人的心靈寄託小宇宙。出門散步、喝杯咖啡，再沿著小徑回家。</p>'+harborWelcome(profile,credential?memberLabel(credential.member_no):'guest')+'<p class="hb-welcome-notice" role="status" data-hb-welcome-notice></p><div class="hb-layout" id="dock-activities"><figure class="hb-map resort-map"><div class="hb-stage" aria-label="熊熊渡假村園區地圖" data-public-harbor data-initial="'+initial+'" data-stops="'+escape(JSON.stringify(positions))+'" data-links="'+escape(JSON.stringify(links))+'" data-size="'+size.x+','+size.y+'">'+
  resortMapArt()+'<span class="hb-actor" aria-hidden="true" style="--x:'+positions[initial].x/size.x*100+'%;--y:'+positions[initial].y/size.y*100+'%">'+avatarSvg+'</span>'+
  stopsConfig.map(p=>item(p,true)).join('')+seaMapPins()+'</div><figcaption class="hb-caption"><span>'+(profile?'點地點直接前往，點居民打招呼。':'點地點直接前往，也可以點居民打招呼。')+'</span><a class="hb-enter" data-hb-enter href="/dock/square">到廣場打招呼 ↗</a><button type="button" data-hb-motion hidden>暫停動畫</button></figcaption><div class="sea-map-note"><span data-sea-clock data-sea-next="'+islandSecretClock().nextChange+'">台灣時間 '+islandSecretClock().label+' · 居民正在島上生活</span></div></figure>'+
  '<aside class="hb-rail" aria-label="島嶼活動"><dialog class="hb-panel hb-chat-panel" id="harbor-chat" data-hb-chat-panel hidden aria-label="和居民聊天"><div class="hb-chat-top"><span class="hb-kicker">HELLO, NEIGHBOR</span><button type="button" data-hb-chat-close>關閉聊天 ✕</button></div><p role="status" data-hb-chat-status></p><div data-hb-chat-body></div></dialog><div aria-live="polite">'+summaries+dockPanel+'</div></aside></div>'+
  seaMapDialog()+'<footer class="hb-share"><button type="button" data-hb-share="'+escape(url.origin+map)+'" hidden>分享渡假村給朋友 ↗</button><span role="status" data-hb-status></span>'+
  '<button type="button" data-hb-welcome-restart hidden>第一次來？重新看引導</button></footer><script src="/world-scene.js?v=resort-v83" defer></script>',200,{'Content-Security-Policy':worldSceneHeaders['Content-Security-Policy']+"; connect-src 'self'"},{title:'熊熊渡假村｜Bear Atlas',brand:''});
}
const worldSceneCss=`
.world-isometric{margin:14px 0;overflow:hidden;border:1px solid #8fa596;border-radius:13px;background:#e9ebd8;color:#29483e}
.iso-stage{position:relative;isolation:isolate;overflow:hidden;aspect-ratio:760/405;background:#65887f;touch-action:pan-y}
.iso-stage svg{display:block;width:100%;height:100%}
.iso-avatar{position:absolute;left:var(--iso-x,50%);top:var(--iso-y,70%);transform:translate(-50%,-89%);width:clamp(31px,7%,57px);pointer-events:none;filter:drop-shadow(2px 4px 2px #304b3960);z-index:2}
.iso-avatar.left svg{scale:-1 1}.iso-avatar.walk svg{animation:iso-step .32s ease-in-out infinite;transform-origin:center 87%}
@keyframes iso-step{0%,100%{transform:rotate(-5deg)}50%{transform:translateY(-7%) rotate(5deg)}}
.iso-sea{animation:iso-sea 7s ease-in-out infinite}.iso-cloud{animation:iso-cloud 16s ease-in-out infinite}
@keyframes iso-sea{50%{transform:translateX(14px);opacity:.47}}
@keyframes iso-cloud{50%{transform:translateX(38px)}}
.iso-pin{position:absolute;z-index:3;left:var(--iso-x);top:var(--iso-y);transform:translate(-50%,-100%);display:inline-flex;align-items:center;min-height:44px;white-space:nowrap;border:1px solid #7d8f74;border-radius:999px;padding:3px 10px;background:#f8f3e3ed;color:#233e34;text-decoration:none;font-weight:750;font-size:clamp(.71rem,2.25vw,.88rem);box-shadow:0 3px 8px #36554a40}
.iso-pin:hover,.iso-pin:focus-visible{background:#28483d;color:#fff8ea}
.iso-controls{display:flex;justify-content:space-between;align-items:center;gap:5px 12px;flex-wrap:wrap;padding:8px 11px;font-size:.83rem}
.iso-controls[hidden]{display:none}.iso-controls nav{display:flex;gap:4px}
.iso-controls button{min-height:44px;min-width:44px;padding:2px;color:#29483d;background:#f7f3e9;border-color:#9aaf98}.iso-controls button:hover{background:#325445;color:#fff8e9}
.iso-caption{margin:0;padding:7px 11px;border-top:1px solid #ced6bd;font-size:.8rem}
.iso-world-styled .world-id{margin-top:5px}
@media(prefers-reduced-motion:reduce){.world-isometric *{animation:none!important;transition:none!important}}
`;
const isoTree=(x,y,scale=1)=>'<g transform="translate('+x+' '+y+') scale('+scale+')"><ellipse rx="17" ry="7" cx="8" cy="2" fill="#5d725f" opacity=".24"/><path d="M-3-17h6V5h-6z" fill="#8e7359"/><path d="M0-45 13-25l-4 1 13 15H-21l12-15h-5z" fill="#608775"/><path d="M0-45v36h-21l12-15h-5z" fill="#819e76"/></g>';
function isoHouse(x,y,w,roof){
 return '<g transform="translate('+x+' '+y+')"><ellipse cx="13" cy="24" rx="'+(w*.82)+'" ry="13" fill="#678473" opacity=".3"/><path d="M-'+w+'-11 0 9V37l-'+w+'-20z" fill="#dcc3a4"/><path d="M0 9 '+w+'-13v28L0 37z" fill="#b98d73"/><path d="M-'+(w+6)+'-11 0-45 '+(w+6)+'-13 0 12z" fill="'+roof+'"/><path d="M0-45v57l'+(w+6)+'-25z" fill="#75483c" opacity=".16"/><path d="m-16 4 9 4v12l-9-4zm24 6 10-5v12l-10 5z" fill="#66867a"/></g>';
}
function isoLand(x,y,s){
 return '<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M-131 24Q-132 4-102-15l81-48q30-16 58-4l79 46q38 23 31 44v25q-4 16-25 27L49 113q-44 23-82 6l-76-44q-27-14-22-37z" fill="#3c6c67" opacity=".28" transform="translate(6 11)"/><path d="M-131 24Q-132 4-102-15l81-48q30-16 58-4l79 46q38 23 31 44v25q-4 16-25 27L49 113q-44 23-82 6l-76-44q-27-14-22-37z" fill="#b79779"/><path d="M-131 24Q-132 4-102-15l81-48q30-16 58-4l79 46q38 23 31 44-4 16-25 27L49 88q-44 23-82 6l-76-44q-26-15-22-26z" fill="#e1cca7"/><path d="M-122 21q-2-13 26-30l80-45q27-14 51-4l77 45q29 18 26 31-3 14-20 23L46 81q-41 21-75 5l-75-43q-20-11-18-22z" fill="#adbf9d"/></g>';
}
function isoArtwork(square){
 const sea='<rect width="760" height="405" fill="#65887f"/><path d="M0 0h760v405H0z" fill="#94b5a3" opacity=".23"/><g class="iso-sea" fill="none" stroke="#c9d9bc" stroke-width="2" opacity=".66"><path d="M22 136q24-6 52 1m37 144q26-6 55-1m-91 38q33-8 66-2m512-43q26-5 66-1m-100 62q31-7 71 0m-310 51q34-7 82-1m-409-19q43-9 90-2m481-218q36-6 57 2m-642 48q21-8 58 1"/></g><g class="iso-cloud" fill="#e3ebd6" opacity=".36"><path d="M65 48q9-16 25-9 13-24 35 4 15-4 22 9H61zm446-14q13-17 34-9 13-17 32 2 20-4 28 14H502z"/></g>';
 const base=square?isoLand(357,217,2.18):
  isoLand(560,130,1.03)+isoLand(178,209,.77)+isoLand(357,221,1.43)+isoLand(602,294,.62);
 const paths=square?'<path d="M110 276q151-55 252-67t264-45M352 109q70 92 12 124t26 110" fill="none" stroke="#ebd9ac" stroke-width="25" stroke-linecap="round"/><path d="M110 276q151-55 252-67t264-45M352 109q70 92 12 124t26 110" fill="none" stroke="#a58f6b" opacity=".6" stroke-width="2" stroke-dasharray="5 8"/>':
  '<path d="m225 237 64 4m159-57 59-29m-31 101 83 34" fill="none" stroke="#e7caa3" stroke-width="14"/><path d="m225 237 64 4m159-57 59-29m-31 101 83 34" stroke="#a88c6e" stroke-width="2" fill="none" stroke-dasharray="4 5"/><path d="M287 264q68-46 158-33" fill="none" stroke="#ecdbb4" stroke-width="14" stroke-linecap="round"/>';
 const trees=square?[[127,211,1.2],[196,250,1],[249,139,.94],[304,139,.8],[534,221,1.2],[598,256,1.13],[544,301,1.09],[258,313,.9],[465,323,.95],[634,208,.85]]:[[132,212,.72],[202,202,.67],[293,217,.9],[316,187,.71],[440,245,.94],[385,304,.84],[493,138,.8],[593,115,.88],[640,163,.74],[632,303,.54],[572,312,.54]];
 return '<svg viewBox="0 0 760 405" aria-hidden="true">'+sea+base+paths+(square?
  isoHouse(354,126,42,'#be8276')+isoHouse(546,181,38,'#ad9274')+isoHouse(190,223,34,'#6a8e7a')+'<ellipse cx="386" cy="298" rx="39" ry="19" fill="#d8be92"/><ellipse cx="386" cy="295" rx="32" ry="13" fill="#77a699"/><path d="M387 294q-9-23 0-27 9 5 0 27" fill="none" stroke="#e6ead0" stroke-width="3"/>':
  isoHouse(164,216,25,'#b98577')+isoHouse(365,205,46,'#c18d79')+isoHouse(562,130,38,'#b67c6c')+isoHouse(602,287,21,'#ce9a80'))+
  trees.map(x=>isoTree(...x)).join('')+'<g fill="#b78978"><circle cx="303" cy="263" r="5"/><circle cx="315" cy="269" r="3"/><circle cx="495" cy="200" r="4"/><circle cx="484" cy="196" r="4"/></g></svg>';
}
function worldScene(square,portrait,home){
 const pins=square?
  [[46,32,'找揪團','#meetups'],[72,47,'島民名冊','#residents'],[25,53,'活動輪盤','/dock/wheel']]:
  [[48,45,'公共廣場','/dock/square'],[23,51,'訪客碼頭',harborDockPath],[74,32,'翡翠灣 · 私人','/world/emerald'],[80,70,'我的島嶼',home]];
 return '<style>'+worldSceneCss+'</style><figure class="world-isometric"><div class="iso-stage" data-iso="'+(square?'square':'map')+'" aria-label="'+(square?'可探索的榕樹廣場':'熊熊世界島圖')+'">'+isoArtwork(square)+
  '<span class="iso-avatar" aria-hidden="true" style="--iso-x:49%;--iso-y:69%">'+portrait+'</span>'+
  pins.map(([x,y,label,link])=>'<a class="iso-pin" href="'+link+'" style="--iso-x:'+x+'%;--iso-y:'+y+'%" data-x="'+x+'" data-y="'+y+'">'+label+'</a>').join('')+
  '</div><div class="iso-controls" hidden><span>點場景移動，也可以用方向鍵</span><nav aria-label="熊熊移動"><button type="button" data-move="left" aria-label="向左">←</button><button type="button" data-move="up" aria-label="向上">↑</button><button type="button" data-move="down" aria-label="向下">↓</button><button type="button" data-move="right" aria-label="向右">→</button></nav></div><figcaption class="iso-caption">'+(square?'公共廣場 · 點建築逛揪團、名冊和活動輪盤。':'熊熊世界 · 點建築後，熊熊會走到入口。')+'</figcaption></figure><script src="/world-scene.js" defer></script>';
}
function worldSceneClient(){
 for(const stage of document.querySelectorAll('[data-iso]')){
  const actor=stage.querySelector('.iso-avatar'),ui=stage.nextElementSibling;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let x=49,y=69,timer=0;window.addEventListener('pagehide',()=>clearTimeout(timer));
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  function move(nx,ny,done){
   stage.dispatchEvent(new CustomEvent('iso-moving'));
   clearTimeout(timer);
   const ox=x;
   if(stage.dataset.iso==='sadness'){const point=sadWalkPoint(nx,ny);x=point.x;y=point.y;}else{x=clamp(nx,14,86);y=clamp(ny,27,80);}
   const duration=reduce.matches?0:Math.max(230,Math.min(690,Math.abs(x-ox)*13+270));
   actor.classList.toggle('left',x<ox);actor.classList.toggle('walk',duration>0);
   actor.style.transition=duration?'left '+duration+'ms ease, top '+duration+'ms ease':'none';
   actor.style.setProperty('--iso-x',x+'%');actor.style.setProperty('--iso-y',y+'%');
   if(!duration){done?.();return;}
   timer=setTimeout(()=>{actor.classList.remove('walk');done?.();},duration);
  }
  if(stage.dataset.iso==='sadness')stage.addEventListener('iso-move',event=>{const {x,y,key}=event.detail||{};if(Number.isFinite(x)&&Number.isFinite(y))move(x,y,()=>stage.dispatchEvent(new CustomEvent('iso-arrived',{detail:key})));});
  stage.addEventListener('click',e=>{
   const pin=e.target.closest('.iso-pin');
   if(pin){
    if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    e.preventDefault();move(Number(pin.dataset.x),Number(pin.dataset.y)+8,()=>location.assign(pin.href));return;
   }
   const b=stage.getBoundingClientRect();
   move((e.clientX-b.left)*100/b.width,(e.clientY-b.top)*100/b.height);
  });
  const steps={left:[-7,0],up:[0,-8],down:[0,8],right:[7,0]};
  ui.addEventListener('click',e=>{
   const button=e.target.closest('[data-move]');if(!button)return;
   const [dx,dy]=steps[button.dataset.move];move(x+dx,y+dy);
  });
  stage.tabIndex=0;
  stage.addEventListener('keydown',e=>{
   const delta=steps[e.key.toLowerCase().replace(/^arrow/,'')];if(!delta||e.target!==stage)return;
   e.preventDefault();move(x+delta[0],y+delta[1]);
  });
  ui.hidden=false;
 }
}
function worldWardrobeClient(){
 const character=document.querySelector('[data-character-form]');
 if(character)character.addEventListener('change',()=>{const id=new FormData(character).get('bear'),template=[...document.querySelectorAll('template[data-character-option]')].find(t=>t.dataset.characterOption===id);if(template)character.querySelector('[data-character-live]').replaceChildren(template.content.cloneNode(true));});
 for(const form of document.querySelectorAll('[data-look-form]'))form.addEventListener('change',()=>{
  const values=new FormData(form),id=['outfit','shoes','bag'].map(key=>values.get(key)).join('|');
  const template=[...document.querySelectorAll('template[data-look]')].find(node=>node.dataset.look===id);
  if(template)form.querySelector('[data-look-preview]').replaceChildren(template.content.cloneNode(true));
 });
}
function worldVoyageClient(){
 const go=document.querySelector('[data-voyage-arrive]');
 if(go)setTimeout(()=>location.assign(go.href),matchMedia('(prefers-reduced-motion: reduce)').matches?0:1100);
}
function harborArrivalClient(){
 const stage=document.querySelector('[data-public-harbor]');
 if(!stage)return;
 const shell=stage.closest('main'),panel=shell.querySelector('[data-hb-chat-panel]'),body=panel.querySelector('[data-hb-chat-body]');
 const status=panel.querySelector('[data-hb-chat-status]'),close=panel.querySelector('[data-hb-chat-close]');
 const guide=shell.querySelector('[data-hb-welcome]'),progress=guide.querySelector('[data-hb-welcome-progress]');
 const task=guide.querySelector('[data-hb-welcome-task]'),lead=guide.querySelector('[data-hb-welcome-lead]');
 const restart=shell.querySelector('[data-hb-welcome-restart]'),notice=shell.querySelector('[data-hb-welcome-notice]');
 const rooms=new Map(),storageKey='bear-harbor-welcome-v2:'+guide.dataset.guideMember,mobile=matchMedia('(max-width:760px)');
 let pageLock=null;
 function lockPage(){
  if(pageLock)return;
  const style=document.body.style;
  pageLock={x:window.scrollX,y:window.scrollY,position:style.position,top:style.top,left:style.left,width:style.width};
  style.position='fixed';style.top=-pageLock.y+'px';style.left=-pageLock.x+'px';style.width='100%';
 }
 function unlockPage(){
  if(!pageLock)return;
  const saved=pageLock;pageLock=null;
  Object.assign(document.body.style,{position:saved.position,top:saved.top,left:saved.left,width:saved.width});
  window.scrollTo(saved.x,saved.y);
 }
 function fitViewport(){
  const viewport=window.visualViewport;
  panel.style.setProperty('--hb-viewport-height',(viewport?.height||window.innerHeight)+'px');
  panel.style.setProperty('--hb-keyboard-inset',Math.max(0,window.innerHeight-(viewport?.height||window.innerHeight)-(viewport?.offsetTop||0))+'px');
 }
 function showChat(){
  fitViewport();
  if(panel.open)return;
  panel.hidden=false;
  if(mobile.matches){lockPage();panel.showModal();}else panel.show();
 }
 mobile.addEventListener('change',()=>{
  if(!panel.open)return;
  panel.close();unlockPage();showChat();
 });
 window.visualViewport?.addEventListener('resize',fitViewport);
 window.visualViewport?.addEventListener('scroll',fitViewport);
 let state={},request=null,lastTrigger=null,selected='',toast=0,manualStep=null;
 try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))state=saved;}catch{}
 function save(){try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{}}
 function refreshGuide(){
  const ready=guide.dataset.hasPassport==='true',done=ready&&state.met&&state.interacted;
  const active=manualStep??(ready?(state.met?2:1):0);
  guide.hidden=Boolean(state.dismissed||(done&&manualStep===null));
  progress.textContent='第 '+(active+1)+' 步，共 3 步';
  task.textContent=['選一位自己的動物居民','認識你的第一位居民','和熊熊完成一次互動'][active];
  lead.textContent=active===0?(ready?'你已經有島民證，也可以回去換一隻熊熊或換裝。':'選好角色、領取島民證後，再回來逛島。'):active===1?'點地圖上的熊熊，或選當區的居民名字。':'打開一位居民的聊天，按話題按鈕或送出一句話。';
  const register=guide.querySelector('[data-hb-welcome-register]');
  register.hidden=active!==0;
  register.textContent=ready?'重新選角色／換裝 ↗':'選角色、領島民證 ↗';
  guide.querySelector('[data-hb-welcome-meet]').hidden=active===0;
  const checks=[ready,Boolean(state.met),Boolean(state.interacted)];
  guide.querySelectorAll('[data-hb-welcome-step]').forEach((step,i)=>{
   step.textContent=(checks[i]?'✓ ':i+1+'. ')+['選角色','認識居民','完成互動'][i];
   step.setAttribute('aria-current',i===active?'step':'false');
  });
  restart.hidden=false;
 }
 function completedInteraction(){
  const wasComplete=guide.dataset.hasPassport==='true'&&state.met&&state.interacted;
  state.interacted=true;manualStep=null;save();refreshGuide();
  if(!wasComplete&&guide.dataset.hasPassport==='true'&&state.met&&!state.dismissed){
   notice.textContent='完成首次登島！接著自由逛逛吧。';
   clearTimeout(toast);toast=setTimeout(()=>{notice.textContent='';},4500);
  }
 }
 async function openNeighbor(trigger){
  const url=new URL(trigger.getAttribute('href'),location.origin);
  if(url.origin!==location.origin||!/^\/islands\/neighbors\/[0-7]-[0-6]$/.test(url.pathname))return;
  request?.abort();request=null;
  lastTrigger=trigger;selected=url.pathname;
  showChat();panel.setAttribute('aria-busy','true');body.replaceChildren();status.textContent='熊熊正在走過來…';
  shell.querySelectorAll('[data-hb-neighbor]').forEach(link=>link.setAttribute('aria-expanded',String(link.getAttribute('href')===url.pathname)));
  try{
   let room=rooms.get(url.pathname);
   if(!room){
    const pending=new AbortController();request=pending;
    const response=await fetch(url.pathname,{signal:pending.signal,cache:'no-store'});
    if(!response.ok)throw Error();
    const doc=new DOMParser().parseFromString(await response.text(),'text/html');
    const source=doc.querySelector('.neighbor-room[data-neighbor]');
    if(!source)throw Error();
    if(pending.signal.aborted||selected!==url.pathname)return;
    room=document.importNode(source,true);
    room.querySelectorAll('script,noscript,.neighbor-nav').forEach(node=>node.remove());
    const heading=room.querySelector('h1'),title=document.createElement('h2');
    title.textContent=heading.textContent;heading.replaceWith(title);
    const intro=document.createElement('p');
    intro.className='hb-resident-note';
    const notes=['喜歡把複雜的事情拆成能開始的一小步。','聊起工作選擇，總愛多問一句「為什麼」。','喜歡牽線，也喜歡聽人分享最近的新發現。','願意陪你把一個想法聊成一場小小的個案討論。','說錯也沒關係，先把想說的話說出來。','球技和勝負之外，更喜歡有人一起動一動。','聊數字的時候，也會想知道背後發生了什麼。','喜歡走進陌生街區，帶回一個自己的小發現。'];
    intro.textContent=notes[Number(url.pathname.split('/').at(-1).split('-')[0])];
    room.querySelector('.neighbor-heading').after(intro);
    room.addEventListener('neighbor-interaction',completedInteraction);
    neighborChatClient(room);rooms.set(url.pathname,room);
   }
   if(selected!==url.pathname)return;
   body.replaceChildren(room);status.textContent='';
   state.met=true;manualStep=null;save();refreshGuide();
   if(!mobile.matches)panel.scrollIntoView({block:'nearest',behavior:'auto'});
   close.focus({preventScroll:true});
  }catch(error){
   if(error.name==='AbortError')return;
   status.textContent='這位熊熊暫時沒走過來。再點一次名字重試，或';
   const link=document.createElement('a');link.href=url.pathname;link.textContent='開啟角色頁';status.append(' ',link);
  }finally{if(selected===url.pathname)panel.removeAttribute('aria-busy');}
 }
 shell.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-hb-neighbor]');
  if(!trigger&&event.target.closest('.hb-stage')&&!event.target.closest('a,button')){closePanel();return;}
  if(!trigger||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();void openNeighbor(trigger);
 });
 function closePanel(){
  request?.abort();request=null;selected='';panel.close();panel.hidden=true;unlockPage();panel.removeAttribute('aria-busy');
  shell.querySelectorAll('[data-hb-neighbor]').forEach(link=>link.setAttribute('aria-expanded','false'));
  lastTrigger?.focus({preventScroll:true});
 }
 close.addEventListener('click',closePanel);
 panel.addEventListener('cancel',event=>{event.preventDefault();closePanel();});
 panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();closePanel();}});
 panel.addEventListener('click',event=>{
  if(event.target!==panel||!mobile.matches)return;
  const rect=panel.getBoundingClientRect();
  if(event.clientY<rect.top||event.clientY>rect.bottom||event.clientX<rect.left||event.clientX>rect.right)closePanel();
 });
 guide.querySelectorAll('[data-hb-welcome-step]').forEach(step=>step.addEventListener('click',()=>{
  manualStep=Number(step.dataset.hbWelcomeStep);guide.open=true;refreshGuide();
 }));
 guide.querySelector('[data-hb-welcome-meet]').addEventListener('click',()=>{
  const trigger=shell.querySelector('[data-hb-neighbor][href="/islands/neighbors/0-0"]');
  if(trigger)void openNeighbor(trigger);
 });
 guide.querySelector('[data-hb-welcome-skip]').addEventListener('click',()=>{state.dismissed=true;save();refreshGuide();});
 restart.addEventListener('click',()=>{state={};manualStep=0;guide.open=true;save();refreshGuide();guide.scrollIntoView({block:'nearest'});});
 refreshGuide();
 if(!state.dismissed&&!state.interacted){guide.open=true;}
}

function publicHarborClient(){
 const stage=document.querySelector('[data-public-harbor]');
 if(!stage)return;
 const stops=JSON.parse(stage.dataset.stops),links=JSON.parse(stage.dataset.links),[width,height]=stage.dataset.size.split(',').map(Number);
 const actor=stage.querySelector('.hb-actor'),shell=stage.closest('main'),figure=stage.closest('figure');
 const motion=figure.querySelector('[data-hb-motion]'),share=shell.querySelector('[data-hb-share]'),enter=figure.querySelector('[data-hb-enter]');
 function updateEntry(){const destination=shell.querySelector('[data-destination="'+selection+'"]'),link=destination?.querySelector('a.hb-cta');enter.hidden=!link;if(link){enter.href=link.getAttribute('href');enter.textContent='走進'+destination.querySelector('h2').textContent+' ↗';}}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const dockPanel=shell.querySelector('#dock-station'),dockStop=Number(dockPanel.dataset.destination);
 let pendingEntry='';let paused=reduced.matches,current=Number(stage.dataset.initial),selection=current,walking=false,frame=0;window.addEventListener('pagehide',()=>cancelAnimationFrame(frame));
 if(location.hash==='#visit-log'&&selection===dockStop){
  const log=dockPanel.querySelector('#visit-log');if(log)log.open=true;
 }
 const points=[...shell.querySelectorAll('[data-stop]')],panels=[...shell.querySelectorAll('[data-destination]')];
 function setPosition(x,y){
  actor.style.setProperty('--x',x/width*100+'%');actor.style.setProperty('--y',y/height*100+'%');
 }
 function route(from,to){return shortestResortRoute(stops,links,from,to);}

 function arrive(stop){
  cancelAnimationFrame(frame);walking=false;current=stop;
  setPosition(stops[stop].x,stops[stop].y);actor.classList.remove('walk');
 }
 function travel(){
  if(paused||reduced.matches){arrive(selection);if(pendingEntry)location.assign(pendingEntry);return;}
  if(walking)return;if(selection===current){if(pendingEntry)location.assign(pendingEntry);return;}
  const next=route(current,selection)[1],a=stops[current],b=stops[next];
  const duration=Math.max(1000,Math.min(3400,Math.hypot(b.x-a.x,b.y-a.y)*12));
  const start=performance.now();
  walking=true;actor.classList.toggle('left',b.x<a.x);actor.classList.add('walk');
  function tick(now){
   const p=Math.min(1,(now-start)/duration);
   setPosition(a.x+(b.x-a.x)*p,a.y+(b.y-a.y)*p);
   if(p<1)frame=requestAnimationFrame(tick);
   else{arrive(next);travel();}
  }
  frame=requestAnimationFrame(tick);
 }
 for(const point of points)point.addEventListener('click',e=>{
  if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  e.preventDefault();cancelAnimationFrame(frame);walking=false;selection=Number(point.dataset.stop);pendingEntry=selection===dockStop?'':point.getAttribute('href');
  for(const p of points)if(Number(p.dataset.stop)===selection)p.setAttribute('aria-current','true');else p.removeAttribute('aria-current');
  for(const panel of panels)panel.hidden=Number(panel.dataset.destination)!==selection;
  if(selection===dockStop){
   if(location.search!=='?stop=dock')history.replaceState(null,'','/islands?stop=dock');
   dockPanel.focus({preventScroll:true});dockPanel.scrollIntoView({block:'nearest'});
  }else if(location.search==='?stop=dock')history.replaceState(null,'','/islands');
  updateEntry();travel();
 });
 updateEntry();
 function setMotion(){
  figure.dataset.paused=String(paused);
  motion.textContent=paused?'播放動畫':'暫停動畫';
  if(paused)arrive(selection);
 }
 motion.hidden=reduced.matches;setMotion();
 motion.addEventListener('click',()=>{paused=!paused;setMotion();});
 reduced.addEventListener('change',()=>{paused=reduced.matches;motion.hidden=paused;setMotion();});
 share.hidden=false;
 share.addEventListener('click',async()=>{
  const notice=shell.querySelector('[data-hb-status]'),url=share.dataset.hbShare;
  if(navigator.share)try{await navigator.share({title:'熊熊島嶼',url});return;}catch(e){if(e.name==='AbortError')return;}
  try{await navigator.clipboard.writeText(url);notice.textContent='已複製島嶼連結';}
  catch{notice.textContent=url;}
 });
}
const worldSceneScript=shortestResortRoute.toString()+';('+resort3dClient.toString()+')();('+upgradeClient.toString()+')();'+golfShot.toString()+';('+golfClient.toString()+')();'+sadWalkPoint.toString()+';'+neighborChatClient.toString()+';('+harborArrivalClient.toString()+')();('+worldSceneClient.toString()+')();('+worldWardrobeClient.toString()+')();('+worldVoyageClient.toString()+')();('+publicHarborClient.toString()+')();('+seaLifeClient.toString()+')();('+sadIslandClient.toString()+')();('+publicPlaceClient.toString()+')();';
const worldSceneHeaders={'Content-Security-Policy':headers['Content-Security-Policy']+"; script-src 'self'"};

const worldShoes={classic:['原本的鞋',''],rose:['霧粉鞋','#bc786f'],cream:['奶油白鞋','#f0dfb8'],cedar:['雪松棕鞋','#886044']};
const worldBags={classic:['原本的包',''],sage:['鼠尾草提包','#76917a'],pearl:['珍珠白手袋','#f2e3bd'],blush:['霧粉手袋','#bc7b79']};
const validAccessory=(options,key)=>typeof key==='string'&&Object.hasOwn(options,key);
function memberAvatar(profile,decorative=false){
 const founder=Object.hasOwn(founderLooks,profile.outfit);
 const base=founder?coutureAvatar(profile.bear,profile.outfit,decorative):avatar(Object.hasOwn(harborBears,profile.bear)?profile.bear:'honey',Object.hasOwn(harborOutfits,profile.outfit)?profile.outfit:'explorer');
 const shoes=worldShoes[profile.shoes]?.[1],bag=worldBags[profile.bag]?.[1];
 if(!shoes&&!bag)return base;
 const bottom=founder?139:108,bagY=founder?113:83;
 const details=(shoes?'<path d="M37 '+bottom+'q0-7 8-7h5q7 0 7 7v5H37zm28 0q0-7 8-7h5q7 0 7 7v5H65z" fill="'+shoes+'" stroke="#775c4b" stroke-width="1.5"/>':'')+
  (bag?'<g transform="translate(93 '+bagY+')"><path d="M-8 0v-5a7 7 0 0 1 14 0v5" fill="none" stroke="#70594b" stroke-width="2"/><rect x="-14" y="-1" width="25" height="18" rx="4" fill="'+bag+'" stroke="#70594b" stroke-width="1.5"/><path d="M-14 5h25m-12-1v4" fill="none" stroke="#70594b" stroke-width="1.4"/></g>':'');
 return base.replace('</svg>',details+'</svg>');
}
const worldWardrobeStyles=`
.character-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.character-options label{min-width:0;display:flex;flex-direction:column;align-items:center;text-align:center;gap:5px;padding:8px;border:1px solid #c6d2b9;border-radius:14px;background:#fff9ec;font-size:.8rem;cursor:pointer}.character-options input{width:20px;height:20px;min-height:20px}.character-options svg{width:100%;height:100px;max-width:90px}.character-options label:has(:checked){outline:2px solid #6f8e65;background:#edf1df}.character-options span{overflow-wrap:anywhere}#character-editor fieldset{padding:0;border:0}#character-editor button{min-height:48px;width:100%}[data-character-live]{width:140px;min-height:160px;margin:0 auto;display:grid;place-items:center}[data-character-live] svg{width:132px!important;height:155px;max-width:132px}#character-editor{scroll-margin-top:12px}@media(max-width:420px){.character-options{grid-template-columns:repeat(2,minmax(0,1fr))}}

.wardrobe-stage{display:flex;align-items:center;gap:14px}.wardrobe-stage .world-avatar{width:100px;flex-basis:100px}.wardrobe-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.wardrobe-options label:first-child{grid-column:1/-1}.wardrobe-submit{display:flex;gap:7px;flex-wrap:wrap}.wardrobe-submit button{white-space:nowrap}.wardrobe-slot{margin:10px 0}.wardrobe-slot summary{min-height:44px;padding:9px 0;cursor:pointer;font-weight:700}
`;
async function worldWardrobe(request,env,url,key,profile,founder){
 const db=env.DB,base=await db.prepare('SELECT outfit FROM island_passports WHERE visitor_key=?').bind(key).first();
 const options=founder?founderLooks:harborOutfits;
 const nameFor=id=>options[id]?.name||options[id]?.label||id;
 const state=await db.prepare('SELECT slots_json,active_slot FROM bear_world_looks WHERE visitor_key=?').bind(key).first();
 let slots={};try{slots=JSON.parse(state?.slots_json||'{}')}catch{}
 let message='';
 if(request.method==='POST'){
  const form=await dockForm(request,url,1500);
  if(!form.fields)return worldPage('造型未儲存',worldError(form.error),form.status);
  if(form.fields.get('action')==='character'){
   const selected=form.fields.get('bear');
   if(!Object.hasOwn(harborBears,selected))return worldPage('角色未儲存',worldError('請選擇目前開放的島民角色。'),400);
   await db.prepare('UPDATE island_passports SET bear=? WHERE visitor_key=?').bind(selected,key).run();
   return dockRedirect('/world/wardrobe?character_saved=1#character-editor');
  }
  const slot=Number(form.fields.get('slot')),outfit=form.fields.get('outfit'),shoes=form.fields.get('shoes'),bag=form.fields.get('bag'),action=form.fields.get('action');
  if(![1,2,3,4].includes(slot)||!Object.hasOwn(options,outfit)||!validAccessory(worldShoes,shoes)||!validAccessory(worldBags,bag)||!['save','equip'].includes(action))message='請重新選擇服裝、鞋子和包包。';
  else{
   const selected=JSON.stringify({outfit,shoes,bag}),jsonPath='$."'+slot+'"',active=action==='equip'?slot:null;
   await db.prepare(`INSERT INTO bear_world_looks(visitor_key,slots_json,active_slot) VALUES(?,json_set('{}',?,json(?)),?)
   ON CONFLICT(visitor_key) DO UPDATE SET slots_json=json_set(bear_world_looks.slots_json,?,json(?)),active_slot=COALESCE(excluded.active_slot,bear_world_looks.active_slot)`).bind(key,jsonPath,selected,active,jsonPath,selected).run();
   return dockRedirect('/world/wardrobe?saved=1#look-'+slot);
  }
 }
 const choose=(name,options,current,labels)=>'<select name="'+name+'">'+Object.keys(options).map(id=>'<option value="'+id+'"'+(id===current?' selected':'')+'>'+escape(labels(id))+'</option>').join('')+'</select>';
 const characterEditor='<section class="world-panel" id="character-editor"><h2>我的島民角色</h2><p>切換角色會保留目前穿著、配件與遊戲進度。</p><form method="post" data-character-form><div class="world-avatar" data-character-live aria-live="polite">'+memberAvatar(profile,true)+'</div><fieldset><legend>選擇角色</legend><div class="character-options">'+Object.entries(harborBears).map(([id,c])=>'<label><input type="radio" name="bear" value="'+id+'"'+(profile.bear===id?' checked':'')+' required>'+memberAvatar({...profile,bear:id},true)+'<span>'+c.label+'</span></label>').join('')+'</div></fieldset><button name="action" value="character" type="submit">儲存角色</button></form>'+Object.keys(harborBears).map(id=>'<template data-character-option="'+id+'">'+memberAvatar({...profile,bear:id},true)+'</template>').join('')+(url.searchParams.has('character_saved')?'<p class="notice" role="status">角色已儲存，護照與小屋會使用同一位島民。</p>':'')+'</section>';
 const formCards=[1,2,3,4].map(i=>{
  const look=slots[i]||{outfit:base.outfit,shoes:'classic',bag:'classic'};
  const live=i===state?.active_slot;
  return '<details class="world-panel wardrobe-slot" id="look-'+i+'"'+(i===(state?.active_slot||1)?' open':'')+'><summary>造型 '+i+(live?' · 穿著中':slots[i]?' · 已儲存':' · 尚未儲存')+'</summary>'+
   '<form method="post" data-look-form><input type="hidden" name="slot" value="'+i+'"><div class="wardrobe-stage"><div class="world-avatar" data-look-preview>'+memberAvatar({...profile,...look},true)+'</div><p>選擇服裝、鞋子和包包。</p></div><div class="wardrobe-options">'+
   '<label>服裝'+choose('outfit',options,look.outfit,nameFor)+'</label><label>鞋子'+choose('shoes',worldShoes,look.shoes,id=>worldShoes[id][0])+'</label><label>包包'+choose('bag',worldBags,look.bag,id=>worldBags[id][0])+'</label></div><div class="wardrobe-submit"><button name="action" value="save">儲存造型</button><button name="action" value="equip">儲存並穿上</button></div></form></details>';
 }).join('');
 const gallery=Object.keys(options).flatMap(outfit=>Object.keys(worldShoes).flatMap(shoes=>Object.keys(worldBags).map(bag=>'<template data-look="'+outfit+'|'+shoes+'|'+bag+'">'+memberAvatar({...profile,outfit,shoes,bag},true)+'</template>'))).join('');
 return worldPage('熊熊換裝','<style>'+worldWardrobeStyles+'</style>'+worldError(message)+(url.searchParams.get('saved')==='1'?'<p class="notice" role="status">造型已儲存。</p>':'')+
  characterEditor+'<p>四套造型會保存在島民帳號。穿上的造型會顯示在島民證和島上場景。</p>'+formCards+gallery+'<script src="/world-scene.js?v=resort-v83" defer></script>',message?400:200,worldSceneHeaders);
}

function worldVoyage(href){
 return '<style>.world-voyage{position:relative;background:linear-gradient(#a7c3ad 0 48%,#719f91 49%);height:144px;border-radius:10px;overflow:hidden}.world-voyage svg{position:absolute;left:10%;bottom:17px;width:68px;animation:world-sail 1s ease-in-out both}@keyframes world-sail{to{left:74%;transform:translateY(-12px)}}@media(prefers-reduced-motion:reduce){.world-voyage svg{animation:none}}</style><div class="world-voyage" aria-hidden="true"><svg viewBox="0 0 90 58"><path d="M8 42h72L65 53H20z" fill="#a97763"/><path d="M41 5v36H19zM46 11v29h24z" fill="#f4e7bd"/><path d="M4 55h76" stroke="#dce8cb" stroke-width="3"/></svg></div><p><a class="world-link" data-voyage-arrive href="'+escape(href)+'">抵達登島入口 ↗</a></p><script src="/world-scene.js?v=looks" defer></script>';
}

// This UI never sends or persists the recovery value. Native required validation is the fallback.
function recoveryReminderClient(){
 const root=document.querySelector('[data-recovery-setup]');if(!root)return;
 const value=root.querySelector('[data-recovery-value]'),copy=root.querySelector('[data-recovery-copy]'),status=root.querySelector('[data-recovery-status]'),form=root.querySelector('[data-recovery-confirm]'),saved=root.querySelector('[data-recovery-saved]'),next=root.querySelector('[data-recovery-continue]');
 copy.hidden=false;next.disabled=!saved.checked;
 saved.addEventListener('change',()=>{next.disabled=!saved.checked;});
 form.addEventListener('submit',event=>{event.preventDefault();if(!saved.checked){saved.reportValidity();return;}location.assign(form.getAttribute('action'));});
 copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(value.value.replace(/\s/g,''));status.textContent='已複製恢復碼。請貼到私人、安全的位置保存；確認保存後勾選下方選項。';}catch{value.focus();value.select();value.setSelectionRange?.(0,value.value.length);status.textContent='無法自動複製。已選取代碼，請長按或使用系統複製功能，或手動抄寫保存。';}});
}
