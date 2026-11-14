import {bedroomCatalog,bedroomProblem} from './bedroom.js';
export const residentQuests={
 hugo:{
  name:'Hugo',role:'港口咖啡師',resident:'0-3',title:'咖啡店的第一杯新口味',
  intro:'傍晚的港口飄來咖啡香。Hugo 拿著兩張新菜單走出來：「週末想讓大家試一款新飲品，你願意陪我決定嗎？」',
  question:'第一批客人，你想怎麼邀請？',
  choices:{a:'辦一場小小的盲飲',b:'先聽客人的喝咖啡習慣'},
  branches:{
   a:{text:'三位客人把杯子喝得見底，卻選不出最喜歡的配方。Hugo 笑著說：「也許大家喜歡的，是不同的東西。」',question:'你想怎麼替這次試飲留下結果？',choices:{a:'請每人替喜歡的味道取名字',b:'找大家喜歡的共同風味'}},
   b:{text:'你們發現有人早上趕路，有人喜歡午後慢慢坐。Hugo 把菜單翻過來：「我們要先照顧哪一種時刻？」',question:'第一款新飲品，你想服務誰？',choices:{a:'帶著走的晨間客人',b:'想坐下來歇一會兒的人'}}
  },
  endings:{
   aa:{title:'有名字的風味',text:'「海風餅乾」「星期六的雲」成了黑板上的新名字。客人們約好下次再來，Hugo 決定每月留一場盲飲，把命名權交給大家。'},
   ab:{title:'找到港灣的味道',text:'你們整理出大家都喜歡的堅果香，做出第一款港灣特調。Hugo 在菜單角落寫下：「和島上的朋友一起調好的。」'},
   ba:{title:'一杯早安',text:'新飲品裝進好拿的外帶杯，配上三分鐘就能取走的早餐。Hugo 站在門口，記住了第一批晨間客人的名字。'},
   bb:{title:'留一張慢慢坐的椅子',text:'窗邊多了一杯可以慢慢喝的咖啡。Hugo 把最後一張桌子留給不趕時間的人，你們一起看港口的燈亮起。'}
  },
  reward:'coffee',rewardName:'港灣咖啡擺設',stamp:'港灣調香章'
 },
 liv:{
  name:'Liv',role:'高爾夫球社召集人',resident:'5-4',title:'第一場沒有壓力的練球日',
  intro:'Liv 把一籃球放在練習墊旁：「有個朋友第一次來，他說怕拖累大家。你想怎麼安排今天？」',
  question:'你想替第一次來的朋友安排什麼開場？',
  choices:{a:'先玩近距離的小目標',b:'請每人分享一次失誤'},
  branches:{
   a:{text:'第一球沒到目標，第二球落在附近，大家已經開始歡呼。Liv 問你：「下一段要不要換個玩法？」',question:'接下來怎麼玩？',choices:{a:'兩人合作，累積命中次數',b:'每人選一個自己的小目標'}},
   b:{text:'有人講打空，有人講忘了帶手套。剛才最緊張的朋友終於笑了：「原來你們也會這樣。」',question:'怎麼把這份輕鬆帶到練習裡？',choices:{a:'輪流當彼此的加油隊',b:'大家一起練一組半揮桿'}}
  },
  endings:{
   aa:{title:'我們這一隊',text:'合作挑戰結束，大家忘了比分，卻記得第一次一起歡呼的聲音。Liv 在球社筆記裡，把這天寫成「誰都可以加入的一場」。'},
   ab:{title:'每個人的一小步',text:'有人第一次把球打高，有人完成五次穩定擊球。Liv 替每個人留下一句自己的進步，沒有人需要和別人比。'},
   ba:{title:'有人替你歡呼',text:'每個人都輪到一次主角。最後一位新朋友收好球桿時說，下次想再帶朋友來。Liv 把下一場的空位留給了他們。'},
   bb:{title:'從半揮桿開始',text:'你們放慢節奏，看球桿碰到球的那一瞬間。最後一球穩穩飛起，Liv 說：「這個感覺，下次可以再一起找。」'}
  },
  reward:'golf',rewardName:'奶油色高爾夫球袋',stamp:'一起練球章'
 },
 ari:{
  name:'Ari',role:'旅行攝影講座嘉賓',resident:'7-4',title:'把今天的港城裝進一張照片',
  intro:'Ari 帶著相機在碼頭等你：「我想留一張今天的港城。要從人們的故事，還是光線開始找？」',
  question:'今天先追著什麼走？',
  choices:{a:'跟著夕陽找一束光',b:'聽聽島民今天的故事'},
  branches:{
   a:{text:'夕陽在窗邊留下一道金色，港口的水面也亮起來。Ari 舉起相機，又放下：「我們還缺一個選擇。」',question:'你想把哪個畫面留下？',choices:{a:'等一位島民走進光裡',b:'留一個安靜的空景'}},
   b:{text:'你們聽見新店開張、第一次登島和剛結束的一場球。Ari 說：「這些小事，好像都住在同一座港口裡。」',question:'最後用什麼方式收尾？',choices:{a:'為願意入鏡的人拍合照',b:'拍下他們手邊的一件物品'}}
  },
  endings:{
   aa:{title:'剛好走進光裡',text:'有人提著晚餐經過，剛好踏進那束金色。Ari 讓對方看過照片，得到同意後，替作品取名「回家的路」。'},
   ab:{title:'留白的港灣',text:'你們沒有急著按快門。等風把窗簾吹起，一張安靜的港城照片就完成了。Ari 說，希望每個看見它的人都能喘一口氣。'},
   ba:{title:'今天在這裡的我們',text:'願意入鏡的島民站到碼頭旁，Ari 記下每個人的名字。照片裡有人眨眼，大家卻都喜歡這一張。'},
   bb:{title:'物件裡的小故事',text:'咖啡杯、球袋和剛買的花，各自說了一小段今天。Ari 把照片排在一起，讓日常也有了被好好收藏的位置。'}
  },
  reward:'photo',rewardName:'港城旅行相框',stamp:'港城留影章'
 }
};
export const cabinThemes={sage:'翡翠綠',cream:'奶油白',rose:'奶茶粉'};
export const cabinCatalog={
 wall:{none:['留白',''],print:['植物掛畫',''],clock:['圓圓時鐘',''],photo:['港城旅行相框','ari']},
 desk:{none:['空桌面',''],books:['兩本好書',''],flowers:['一瓶小花',''],coffee:['港灣咖啡擺設','hugo']},
 corner:{none:['保留空間',''],plant:['窗邊綠植',''],lamp:['暖光立燈',''],golf:['奶油色高爾夫球袋','liv']}
};
export const cabinDefaults={theme:'sage',wall:'print',desk:'books',corner:'plant',share_enabled:0,revision:0};
const cabinPieces={
 wall:{
  print:'<path d="M133 115v68l59 28v-68z" fill="#af9677"/><path d="M138 123v56l49 24v-56z" fill="#fff5db"/><path d="m159 181 6-31m-5 18q-20-15-12-18 13 0 13 13m2 8q20-8 16-17-12-2-16 13" fill="none" stroke="#7c9572" stroke-width="4"/>',
  clock:'<ellipse cx="163" cy="157" rx="24" ry="29" transform="rotate(-22 163 157)" fill="#fff5de" stroke="#ac8b68" stroke-width="5"/><path d="M163 140v18l12 11" stroke="#63795e" stroke-width="3" fill="none"/>',
  photo:'<path d="M127 121v66l72 34v-66z" fill="#a58262"/><path d="M133 131v51l60 29v-51z" fill="#87b9ae"/><path d="m134 163 22-9 17 25 20-5v35l-59-28z" fill="#b8c99d"/><path d="m150 171 14-7 12 14-15 7z" fill="#fff4d9"/><path d="m148 169 16-13 15 22-18-2z" fill="#b78673"/>'
 },
 desk:{
  books:'<path d="m282 301 29-16 34 17-29 17z" fill="#8caa8d"/><path d="m282 301v7l34 17v-6zm34 18 29-17v7l-29 16z" fill="#e9debd"/><path d="m290 291 23-13 27 14-23 14z" fill="#cc9b88"/><path d="m290 291v6l27 14v-5zm27 15 23-14v6l-23 13z" fill="#fff4d7"/>',
  flowers:'<ellipse cx="313" cy="297" rx="16" ry="8" fill="#b1c3b1"/><path d="M301 281v15q12 10 24 0v-15z" fill="#e5c9b3"/><path d="m309 284-9-35m13 34 5-39m-3 39 15-31" stroke="#6c8f6c" stroke-width="3"/><g fill="#deb2a6"><circle cx="300" cy="248" r="8"/><circle cx="319" cy="242" r="9"/><circle cx="330" cy="252" r="7"/></g><g fill="#f5e3b7"><circle cx="301" cy="249" r="3"/><circle cx="319" cy="242" r="3"/><circle cx="330" cy="252" r="3"/></g>',
  coffee:'<path d="m288 303 20-11 26 13-21 11z" fill="#ac8565"/><ellipse cx="310" cy="296" rx="15" ry="7" fill="#eadcc0"/><path d="M300 281v12q10 10 20 0v-12" fill="#fff6de" stroke="#b49a76" stroke-width="2"/><ellipse cx="310" cy="281" rx="10" ry="5" fill="#88684f"/><path d="M321 283q13 0 6 10h-6" fill="none" stroke="#fff6de" stroke-width="4"/><path d="m307 271-2-5 3-5m7 9-2-5 3-5" fill="none" stroke="#e5dbc4" stroke-width="2"/>'
 },
 corner:{
  plant:'<ellipse cx="469" cy="346" rx="24" ry="12" fill="#729181" opacity=".23"/><path d="m452 318 5 27q12 10 25-2l3-26" fill="#c9a58a"/><ellipse cx="469" cy="317" rx="17" ry="8" fill="#8e785c"/><path d="m467 318 1-59m0 33q-40-17-25-31 22-3 25 31m0-8q27-37 39-17 0 20-37 25" fill="#7f9c74" stroke="#648263" stroke-width="3"/>',
  lamp:'<ellipse cx="468" cy="344" rx="23" ry="11" fill="#b49c7c"/><path d="M468 338v-88" stroke="#a98b66" stroke-width="5"/><path d="m447 241-10 38q30 16 60-1l-13-39z" fill="#f6e4b8" stroke="#b69c75" stroke-width="2"/><ellipse cx="466" cy="241" rx="19" ry="8" fill="#fff1cb"/>',
  golf:'<ellipse cx="470" cy="345" rx="29" ry="12" fill="#768c78" opacity=".3"/><path d="m457 266-12 65q-3 20 30 18l20-66z" fill="#ead9bc" stroke="#9f8b6c" stroke-width="2"/><ellipse cx="476" cy="274" rx="20" ry="10" fill="#8a8e72"/><path d="m466 271 9-49m0 52 13-58m-4 58 18-47" stroke="#aebbb4" stroke-width="4"/><path d="m473 223 10-5m3-1 12-4m1 16 10-3" stroke="#727e75" stroke-width="7" stroke-linecap="round"/><path d="m455 298 29 11-9 24-25-10z" fill="#d3b5a0"/><path d="m491 289 8 26-17 20" fill="none" stroke="#a68b70" stroke-width="5"/>'
 }
};
export function cabinRoomArt(settings,available){
 const items=Object.entries(available).map(([slot,options])=>Object.keys(options).filter(id=>id!=='none').map(id=>'<g filter="url(#cabin-object-shadow)" data-cabin-slot="'+slot+'" data-cabin-item="'+id+'"'+(settings[slot]===id?'':' hidden')+'>'+cabinPieces[slot][id]+'</g>').join('')).join('');
 const planks=Array.from({length:9},(_,i)=>{const y=236+i*15;return '<path d="M100 '+y+' 310 '+(y+106)+' 539 '+(y-12)+'"/>';}).join('');
 return `<svg class="cabin-scene" viewBox="0 0 640 470" role="img" aria-label="立體娃娃屋布置預覽"><defs>
 <radialGradient id="cabin-light" cx="62%" cy="20%" r="85%"><stop stop-color="#fffdf3"/><stop offset="1" stop-color="#dce5d7"/></radialGradient>
 <linearGradient id="cabin-shade"><stop stop-color="#243f37" stop-opacity=".02"/><stop offset="1" stop-color="#243f37" stop-opacity=".22"/></linearGradient>
 <linearGradient id="cabin-floor-glow" x2=".6" y2="1"><stop stop-color="#fff1cf" stop-opacity=".5"/><stop offset="1" stop-color="#6c5034" stop-opacity=".12"/></linearGradient>
 <linearGradient id="cabin-glass" x2=".3" y2="1"><stop stop-color="#d8eee3"/><stop offset=".6" stop-color="#a8cbb8"/><stop offset="1" stop-color="#729e8a"/></linearGradient>
 <linearGradient id="cabin-wood" x2="0" y2="1"><stop stop-color="#e4c59b"/><stop offset="1" stop-color="#b68e66"/></linearGradient>
 <filter id="cabin-ground-shadow" x="-40%" y="-100%" width="180%" height="300%"><feGaussianBlur stdDeviation="10"/></filter>
 <filter id="cabin-object-shadow" x="-40%" y="-30%" width="180%" height="180%"><feDropShadow dx="-5" dy="7" stdDeviation="3" flood-color="#3c5546" flood-opacity=".23"/></filter>
 <clipPath id="cabin-floor-clip"><path d="m93 226 217-113 236 101-236 122z"/></clipPath>
 </defs>
 <rect width="640" height="470" rx="24" fill="url(#cabin-light)"/>
 <ellipse cx="327" cy="404" rx="216" ry="25" fill="#526b55" opacity=".22" filter="url(#cabin-ground-shadow)"/>
 <path d="m86 225 224 112 243-125v51L310 392 86 279z" fill="#9c7d58"/>
 <path d="m310 337 243-125v51L310 392z" fill="#806547"/>
 <path d="m86 225 224-118 243 105-243 125z" fill="var(--cabin-floor)"/>
 <path d="m93 226 217-113 236 101-236 122z" fill="url(#cabin-floor-glow)"/>
 <g clip-path="url(#cabin-floor-clip)" fill="none" stroke="#8e6c47" stroke-opacity=".19" stroke-width="1.3">${planks}<path d="m180 200 210 108m-133-147 210 108m-333-30 210 108"/></g>
 <path d="M86 225V57l224 112v168z" fill="var(--cabin-wall)"/>
 <path d="M310 169 553 44v168L310 337z" fill="var(--cabin-side)"/>
 <path d="M310 169 553 44v168L310 337z" fill="url(#cabin-shade)"/>
 <path d="M86 57 96 50l214 107L543 37l10 7-243 125z" fill="#fff8e6"/>
 <path d="M86 57v168l10 5V62zm457-13v173l10-5V44" fill="#a5b49b"/>
 <path d="M98 224 309 329 542 209v9L310 342 98 234z" fill="#f1e7d1"/>
 <path d="M310 173v155" stroke="#526b50" stroke-opacity=".16" stroke-width="7"/>
 <path d="M365 146 468 93v103l-103 53z" fill="#698b79"/>
 <path d="M373 150 460 105v84l-87 45z" fill="url(#cabin-glass)"/>
 <path d="m377 197 25-23 22 3 33-34v44l-80 41z" fill="#8db69b" opacity=".55"/>
 <path d="m379 155 29-15-29 61zm42-22 15-7-15 60z" fill="#fff" opacity=".25"/>
 <path d="M370 148v91l94-48V99z" fill="none" stroke="#fff2d8" stroke-width="7"/>
 <path d="m416 125v90m-43-28 88-45" fill="none" stroke="#fff4db" stroke-width="5"/>
 <path d="m360 241 104-54 14 7-105 55z" fill="#fff1d4"/><path d="m373 249 105-55v7l-105 55z" fill="#baa886"/>
 <path d="m377 251 94-48-74 91-112 13z" fill="#fff6ce" opacity=".16"/>
 <path d="m200 320 113-61 135 70-118 64-130-67z" fill="#657e68" opacity=".2"/>
 <path d="m202 317 111-60 133 69-116 63z" fill="var(--cabin-accent)" stroke="#f0e2c5" stroke-width="4"/>
 <path d="m218 319 96-51 117 59-101 54z" fill="none" stroke="#fff6dc" stroke-width="2" opacity=".65"/>
 <g filter="url(#cabin-object-shadow)">
 <path d="m275 305 8 4v49l-8-4zm72 1 8-4v48l-8 5z" fill="#836347"/>
 <path d="m265 298 49 25 52-28v18l-52 29-49-25z" fill="#a17d57"/>
 <path d="m260 288 54-30 57 29-57 31z" fill="url(#cabin-wood)"/>
 <path d="m260 288 54 27 57-28v9l-57 31-54-28z" fill="#b08a61"/><path d="m260 288 54 27 57-28" fill="none" stroke="#f2d4aa" stroke-width="2"/>
 <path d="m199 336 9 4v25l-9-5zm48 1 8-4v26l-8 5z" fill="#7b8a69"/>
 <path d="m195 307 39-20 32 17v38l-32 20-39-19z" fill="#8f9e7e"/>
 <path d="m195 307 39 19 32-22v28l-32 21-39-19z" fill="#b4c29e"/>
 <path d="m196 307 9-38 29 15v42zm38 19v-42l30-18 2 38z" fill="#d2daba"/>
 <path d="m205 269 29 15 30-18-8-5-22 13-22-11z" fill="#e3e7cc"/>
 <path d="m200 312 33 16 27-17" fill="none" stroke="#edf0d9" stroke-width="2" opacity=".7"/>
 </g>${items}</svg>`;
}


// A small orthographic mesh renderer. All furniture is modeled in room coordinates,
// so rotating the camera reveals its sides rather than rotating a flat illustration.
export function cabin3DClient(){
 const display=document.querySelector('[data-cabin-display]');
 if(!display)return;
 const canvas=display.querySelector('canvas'),ctx=canvas?.getContext('2d');
 if(!ctx)return;
 const game=display.closest?.('[data-cabin-game]');
 const fallback=display.querySelector('.cabin-scene'),controls=display.querySelector('[data-cabin-camera]');
 let roomTransition=false;
 let yaw=.72,pitch=.55,zoom=1,frame=0;
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 let walking=!reducedMotion.matches,visible=true,walkTime=0,lastTick=0,lastPaint=0;
 const walkButton=controls.querySelector('[data-cabin-walk]');
 const updateWalk=()=>{walkButton.textContent=walking?'暫停走動':'讓熊熊走走';walkButton.setAttribute('aria-pressed',String(walking));};
 walkButton.addEventListener('click',()=>{if(sitting){planNavigation('wake');return;}walking=!walking;updateWalk();render();});
 reducedMotion.addEventListener('change',event=>{if(event.matches){walking=false;updateWalk();}});
 updateWalk();
 const activitySelect=display.querySelector('[data-cabin-activity]'),activityStatus=display.querySelector('[data-cabin-activity-state]'),mood=display.querySelector('[data-cabin-mood]');
 const room=display.dataset.cabinRoom||'living',instances=display.dataset.cabinInstances==='1',layoutRoom=instances?'bedroom-instances':room;
 const mesh=id=>instances?bedroomCatalog[layout[id]?.furniture_type]?.mesh:id;
 const itemName=id=>instances?bedroomCatalog[layout[id]?.furniture_type]?.name||'選一件家具':names[id];
 let layout=decodeCabinLayout(display.dataset.cabinLayout||'{}',true,layoutRoom)||decodeCabinLayout('{}',true,layoutRoom),previewLayout=null,editMode=false,selectedFurniture=instances?(Object.keys(layout)[0]||''):room==='bedroom'?'bed':'table',drag=null,hitFaces=[],projection=null,history=[],editBaseline=null,pressTimer=0,tap=null,inspectedFurniture=null,touchTargets=[];
 let activeBedId=instances?Object.keys(layout).find(id=>bedroomCatalog[layout[id].furniture_type]?.mesh==='bed'):'bed';
 let requestedBedId=activeBedId,requestedSeatId='',activeSeatId='',sitting=false,seatExit=null;
 const litLamps=new Set();
 display.addEventListener('cabin-environment-change',()=>{const on=display.dataset.cozyBedside==='true';for(const id of Object.keys(layout)){if(['nightlight','bedside_lamp'].includes(mesh(id))){if(on)litLamps.add(id);else litLamps.delete(id);}}render();});
 display.addEventListener('cabin-lamp-toggle',event=>{const id=event.detail;if(instances&&['lamp','bedside_lamp'].includes(layout[id]?.furniture_type)){if(litLamps.has(id))litLamps.delete(id);else litLamps.add(id);canvas.dataset.litLamps=JSON.stringify([...litLamps]);render();}});
 const seatRecord=id=>instances?bedroomCatalog[layout[id]?.furniture_type]:room==='living'&&id==='chair'?bedroomCatalog.chair:null;
 const seatTemplate=()=>seatRecord(activeSeatId)?.seat;
 display.addEventListener('cabin-seat-target',event=>{if(seatRecord(event.detail)?.seat)requestedSeatId=event.detail;});
 const bed=()=>layout[activeBedId];
 display.addEventListener('cabin-bed-target',event=>{if(instances&&bedroomCatalog[layout[event.detail]?.furniture_type]?.mesh==='bed')requestedBedId=event.detail;});
 let patrolRoute=[[-2.12,1.93,true],[1.22,1.93,true],[1.22,-1.82,true],[-2.12,-1.82,true]];
 let guestId='',guestPath=[],guestPosition={x:-1.7,z:-2.6,heading:0};
 let stretchRemaining=0;let currentActivity='walk',navigation=null,lastBear=room==='bedroom'?{x:-1.7,z:-1.75,heading:0}:{x:-2.12,z:1.93,heading:Math.PI/2},autoReturn=null,motionTime=0,reactionRemaining=0,sleeping=false;
 display.addEventListener('cabin-furniture-select',event=>{inspectedFurniture=event.detail;render();});
 const thoughts={walk:'走一走，看看今天的小屋有什麼不一樣。',read:'讀幾頁就好，喜歡的句子可以慢慢留著。',coffee:'這一口咖啡，想留給不趕時間的自己。',golf:'今天只練輕輕一推，不急著追求完美。',rest:'在自己的角落，什麼都不做也很舒服。',flowers:'這束花讓小屋多了一點今天的顏色。'};
 display.querySelector('[data-cabin-greet]').addEventListener('click',()=>{if(sitting){mood.textContent='熊熊正在座位上休息，隨時可以點「起身」。';return;}if(sleeping){mood.textContent='熊熊正在睡覺，隨時可以點「起床」。';return;}reactionRemaining=reducedMotion.matches?.7:2.6;mood.textContent='嗨！看到你來，熊熊開心地揮揮手。';render();});
 display.addEventListener('cabin-cozy-activity',event=>{if(['window','admire','desk'].includes(event.detail)){activitySelect.value=event.detail;planNavigation(event.detail);render();}});
 activitySelect.addEventListener('change',()=>{mood.textContent='';planNavigation(activitySelect.value);render();});

 function findFurniturePath(source,target){
  const rects=cabinLayoutRects(layout,selected().corner!=='none').filter(r=>r.mesh!=='rug'&&r.id!=='rug'),cells=[],free=(x,z)=>rects.every(r=>Math.abs(x-r.x)>r.w/2+.22||Math.abs(z-r.z)>r.d/2+.22);
  for(let i=0;i<26;i++)for(let j=0;j<23;j++){const x=-2.25+i*.25,z=-2+j*.25;if(free(x,z))cells.push({x,z,key:i+','+j,i,j});}
  if(!cells.length)return [{x:source.x,z:source.z}];
  const nearest=(point,list)=>list.reduce((best,c)=>Math.hypot(c.x-point.x,c.z-point.z)<Math.hypot(best.x-point.x,best.z-point.z)?c:best,list[0]);
  const start=nearest(source,cells),byKey=new Map(cells.map(c=>[c.key,c])),queue=[start],previous=new Map([[start.key,null]]);
  for(let i=0;i<queue.length;i++){const at=queue[i];for(const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1]]){const next=byKey.get((at.i+di)+','+(at.j+dj));if(next&&!previous.has(next.key)){previous.set(next.key,at.key);queue.push(next);}}}
  const end=nearest(target,queue),points=[];let key=end.key;while(key!==null){points.unshift(byKey.get(key));key=previous.get(key);}
  return points;
 }
 function makePatrol(){
  let source=lastBear;const result=[];
  for(const target of [{x:-2.12,z:3.35},{x:3.8,z:3.35},{x:3.8,z:-1.82},{x:-2.12,z:-1.82},lastBear]){
   const path=findFurniturePath(source,target);for(let i=0;i<path.length;i++){const p=path[i],last=result[result.length-1];if(!last||last[0]!==p.x||last[1]!==p.z)result.push([p.x,p.z,i===path.length-1]);else if(i===path.length-1)last[2]=true;}source=path[path.length-1];
  }
  // Collapse straight grid runs while retaining places where the bear can pause.
  const compact=result.filter((p,i)=>!i||i===result.length-1||p[2]||(result[i-1][0]!==result[i+1][0]&&result[i-1][1]!==result[i+1][1]));
  if(compact.length>1&&compact[0][0]===compact.at(-1)[0]&&compact[0][1]===compact.at(-1)[1])compact.pop();
  return compact.length>1?compact:patrolRoute;
 }
 function planNavigation(action){
  const wasSleeping=sleeping;
  if(sitting){sitting=false;walking=true;updateWalk();if(seatExit)lastBear={...seatExit};navigation=null;patrolRoute=makePatrol();walkTime=0;}

  if(action==='room'){
   sleeping=false;reactionRemaining=0;const target=room==='bedroom'?{x:-1.7,z:-1.75}:{x:3.2,z:-1.75},points=findFurniturePath(lastBear,target),end=points.at(-1);
   if(!end||Math.hypot(end.x-target.x,end.z-target.z)>.85){mood.textContent='門邊沒有通道，請先挪開附近家具。';display.dispatchEvent(new CustomEvent('cabin-room-blocked'));return;}
   walking=true;updateWalk();roomTransition=true;navigation={x:lastBear.x,z:lastBear.z,heading:lastBear.heading,points,action:'room'};return;
  }
  if(action==='wake'){stretchRemaining=wasSleeping?(reducedMotion.matches?.6:2.6):0;sleeping=false;navigation=null;autoReturn=null;activitySelect.value='auto';walking=true;updateWalk();patrolRoute=makePatrol();walkTime=0;render();return;}
  if(sleeping)sleeping=false;
  if(['window','admire','desk'].includes(action)){const id=action==='admire'?Object.keys(layout).find(id=>mesh(id)==='displaycase'):action==='desk'?Object.keys(layout).find(id=>['writingdesk','table'].includes(mesh(id))):null;if(action!=='window'&&!id){mood.textContent=action==='admire'?'先擺上展示櫃，再來看看收藏。':'先擺上書桌或桌子，就能在桌前休息。';activitySelect.value='auto';return;}const at=id?layout[id]:{x:.98,z:-1.45},target=id?{x:at.x+1,z:at.z+.8}:at,points=findFurniturePath(lastBear,target),end=points.at(-1);if(!end||Math.hypot(end.x-target.x,end.z-target.z)>.45){mood.textContent='附近暫時沒有通道，請留一點走動空間。';activitySelect.value='auto';return;}walking=true;updateWalk();navigation={x:lastBear.x,z:lastBear.z,heading:lastBear.heading,points,action};return;}
  if(action==='sit'){
   const at=layout[requestedSeatId],template=seatRecord(requestedSeatId),spec=template?.seat;
   if(!spec){mood.textContent='先擺上一張可以坐的椅子。';activitySelect.value='auto';return;}
   activeSeatId=requestedSeatId;delete display.dataset.cabinHeld;reactionRemaining=0;const facing=at.r*Math.PI/2+spec.facing,distance=template.size[1]/2+.36,target={x:at.x+Math.sin(facing)*distance,z:at.z+Math.cos(facing)*distance},points=findFurniturePath(lastBear,target),end=points.at(-1);
   if(!end||Math.hypot(end.x-target.x,end.z-target.z)>.4){mood.textContent='座位前方沒有通道，請留一點空間。';activitySelect.value='auto';return;}
   walking=true;updateWalk();navigation={x:lastBear.x,z:lastBear.z,heading:lastBear.heading,points,action:'sit'};return;
  }
  if(action==='sleep'){
   if(instances&&layout[requestedBedId]&&mesh(requestedBedId)==='bed')activeBedId=requestedBedId;
   if(!bed()){mood.textContent='先擺上一張床，就能躺下休息。';activitySelect.value='auto';return;}
   delete display.dataset.cabinHeld;reactionRemaining=0;walking=true;updateWalk();
   const b=bed(),angle=b.r*Math.PI/2,side=instances&&b.furniture_type==='double_bed'?1.42:1.02,candidates=[[-side,0],[side,0],[0,1.37],[0,-1.37]].map(([x,z])=>({x:b.x+x*Math.cos(angle)+z*Math.sin(angle),z:b.z-x*Math.sin(angle)+z*Math.cos(angle)}));
   let best=null;
   for(const at of candidates){const points=findFurniturePath(lastBear,at),end=points.at(-1);if(!end||Math.hypot(end.x-at.x,end.z-at.z)>.4)continue;const distance=points.reduce((d,p,i)=>i?d+Math.hypot(p.x-points[i-1].x,p.z-points[i-1].z):d,0);if(!best||distance<best.distance)best={points,distance};}
   if(!best){mood.textContent='床邊沒有通道，請移動床鋪或其他家具，留出一側通行。';activitySelect.value='auto';return;}
   navigation={x:lastBear.x,z:lastBear.z,heading:lastBear.heading,points:best.points,action:'sleep'};return;
  }

  if(action==='walk'){navigation=null;return;}
  if(action!=='auto'&&!autoReturn)autoReturn={...lastBear};
  const table=cabinLayoutRects(layout).find(r=>r.id==='table')||{x:lastBear.x,z:lastBear.z,w:0};
  const target=action==='auto'?(autoReturn||lastBear):action==='golf'?{x:layout.corner.x-.7,z:layout.corner.z+.6}:action==='read'||action==='coffee'?{x:table.x+table.w/2+.35,z:table.z}:{x:(layout.rug?.x??lastBear.x),z:(layout.rug?.z??lastBear.z)};
  navigation={x:lastBear.x,z:lastBear.z,heading:lastBear.heading,points:findFurniturePath(lastBear,target),action};
 }
 function movedPoint(id,[x,y,z]){
  const at=(previewLayout||layout)[id],kind=instances?bedroomCatalog[at?.furniture_type]?.mesh:id,base=cabinLayoutDefaults[kind]||{x:0,z:0},position=at||base,angle=position.r*Math.PI/2,dx=(x-base.x)*(instances&&at?.furniture_type==='double_bed'?2.2/1.4:1),dz=z-base.z;
  return [position.x+dx*Math.cos(angle)+dz*Math.sin(angle),y,position.z-dx*Math.sin(angle)+dz*Math.cos(angle)];
 }
 function advanceNavigation(dt){
  if(!navigation||!navigation.points.length)return;
  let distance=dt*1.25;
  while(distance>0&&navigation.points.length){const next=navigation.points[0],dx=next.x-navigation.x,dz=next.z-navigation.z,length=Math.hypot(dx,dz);navigation.heading=Math.atan2(dx,dz);if(length<=distance){navigation.x=next.x;navigation.z=next.z;navigation.points.shift();distance-=length;}else{navigation.x+=dx/length*distance;navigation.z+=dz/length*distance;distance=0;}}
  if(!navigation.points.length&&navigation.action==='room'&&roomTransition){roomTransition=false;display.dispatchEvent(new CustomEvent('cabin-room-arrived'));}
  if(!navigation.points.length&&navigation.action==='sit'){seatExit={x:navigation.x,z:navigation.z,heading:navigation.heading};sitting=true;sleeping=false;walking=false;updateWalk();render();}
  if(!navigation.points.length&&navigation.action==='sleep'){sleeping=true;render();}
  if(!navigation.points.length&&navigation.action==='auto'){navigation=null;autoReturn=null;}
 }

 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 const selected=()=>Object.fromEntries(['wall','desk','corner'].map(slot=>[slot,display.querySelector('[data-cabin-slot="'+slot+'"]:not([hidden])')?.dataset.cabinItem||'none']));
 const shade=(hex,factor)=>{const n=parseInt(hex.slice(1),16);return '#'+[n>>16,(n>>8)&255,n&255].map(v=>Math.round(clamp(v*factor,0,255)).toString(16).padStart(2,'0')).join('');};
 function draw(){
  frame=0;
  const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;
  const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  let scale=Math.min(w/11,h/9.5)*zoom,cx=w/2,cy=h*(game?.58:.56);
  const unit=([x,y,z])=>{const u=(x-.8)*Math.cos(yaw)-(z-.7)*Math.sin(yaw),d=(x-.8)*Math.sin(yaw)+(z-.7)*Math.cos(yaw);return [u,-(y-1.1)*Math.cos(pitch)+d*Math.sin(pitch),(y-1.1)*Math.sin(pitch)+d*Math.cos(pitch)];};
  // Fit the complete existing room, including wall caps. Only the camera changes.
  if(game&&w<=760){const corners=[];for(const x of [-2.98,4.45])for(const z of [-2.69,3.96])for(const y of [-.35,3.6])corners.push(unit([x,y,z]));
   const loX=Math.min(...corners.map(p=>p[0])),hiX=Math.max(...corners.map(p=>p[0])),loY=Math.min(...corners.map(p=>p[1])),hiY=Math.max(...corners.map(p=>p[1]));
   scale=Math.min((w-20)/(hiX-loX),(h-80)/(hiY-loY))*zoom;cx=w/2-(loX+hiX)/2*scale;
   const roomHeight=(hiY-loY)*scale,center=Math.max(56+roomHeight/2,Math.min(h-20-roomHeight/2,h*.42));cy=center-(loY+hiY)/2*scale;
  }
  const project=point=>{const [u,v,d]=unit(point);return [cx+u*scale,cy+v*scale,d];};
  const bg=ctx.createRadialGradient(w*.6,h*.2,0,w*.5,h*.5,w*.8);bg.addColorStop(0,'#fffdf2');bg.addColorStop(1,'#dce5d7');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  ctx.save();ctx.translate(w/2,cy+1.7*scale);ctx.scale(1,.22);ctx.filter='blur(12px)';ctx.fillStyle='#48604b30';ctx.beginPath();ctx.ellipse(0,0,4.7*scale,3.1*scale,0,0,Math.PI*2);ctx.fill();ctx.restore();
  const faces=[];let layer=-1,furniture=null,meshInstance=null,meshType=null;
  projection={project,w,h,scale,cx,cy};if(game?.querySelectorAll)for(const b of game.querySelectorAll('[data-cozy-target]')){const at=({main:[-.55,2.9,-2.1],curtains:[1.02,2.6,-2.1],bedside:[1.6,1.4,-2.1],window:[1.02,1.65,-2.1]})[b.dataset.cozyTarget];const p=project(at);b.style.left=Math.max(24,Math.min(w-24,p[0]))+'px';b.style.top=Math.max(24,Math.min(h-24,p[1]))+'px';b.hidden=editMode;}canvas.dataset.roomFloor=JSON.stringify([[-2.8,-.35,-2.5],[4.4,-.35,-2.5],[4.4,-.35,3.9],[-2.8,-.35,3.9]].map(project));
  const poly=(points,color)=>{const push=ps=>{if(furniture&&(meshInstance?furniture!==meshType:!(previewLayout||layout)[furniture]))return;const object=furniture?(meshInstance||furniture):null;const projected=ps.map(p=>project(object?movedPoint(object,p):p));faces.push({points:projected,color,layer,object,depth:projected.reduce((a,p)=>a+p[2],0)/ps.length});};if(Object.hasOwn(cabinFurniture,furniture)&&points.length===4&&(furniture==='bed'||points.some((p,i)=>Math.hypot(...p.map((v,k)=>v-points[(i+1)%4][k]))>1))){const at=(u,v)=>points[0].map((n,k)=>(1-u)*(1-v)*n+u*(1-v)*points[1][k]+u*v*points[2][k]+(1-u)*v*points[3][k]);for(let i=0;i<4;i++)for(let j=0;j<4;j++)push([at(i/4,j/4),at((i+1)/4,j/4),at((i+1)/4,(j+1)/4),at(i/4,(j+1)/4)]);}else push(points);};
  function box(x,y,z,a,b,c,color){
   const X=x+a,Y=y+b,Z=z+c;
   poly([[x,Y,z],[X,Y,z],[X,Y,Z],[x,Y,Z]],shade(color,1.08));
   poly([[x,y,z],[x,Y,z],[x,Y,Z],[x,y,Z]],shade(color,.82));
   poly([[X,y,Z],[X,Y,Z],[X,Y,z],[X,y,z]],shade(color,.9));
   poly([[x,y,Z],[x,Y,Z],[X,Y,Z],[X,y,Z]],color);
   poly([[X,y,z],[X,Y,z],[x,Y,z],[x,y,z]],shade(color,.77));
  }
  function cylinder(x,y,z,r,height,color,n=16){
   const top=[];for(let i=0;i<n;i++){const t=i*2*Math.PI/n,u=(i+1)*2*Math.PI/n;const a=[x+Math.cos(t)*r,y,z+Math.sin(t)*r],b=[x+Math.cos(u)*r,y,z+Math.sin(u)*r];poly([a,b,[b[0],y+height,b[2]],[a[0],y+height,a[2]]],shade(color,.8+.22*(Math.cos(t-.6)+1)/2));top.push([a[0],y+height,a[2]]);}poly(top,shade(color,1.1));
  }
  function leaf(x,y,z,dx,dy,dz,color){poly([[x,y,z],[x+dx*.4-.13,y+dy*.5,z+dz*.4],[x+dx,y+dy,z+dz],[x+dx*.4+.13,y+dy*.5,z+dz*.4]],color);}
  function plant(x,z,small=false){const f=small?.45:1;cylinder(x,.06,z,.25*f,.45*f,'#bd9577');cylinder(x,.5*f,z,.027*f,.9*f,'#728765',8);for(let i=0;i<6;i++){const a=i*2.4;leaf(x,(.7+i*.11)*f,z,Math.cos(a)*.65*f,.35*f,Math.sin(a)*.65*f,i%2?'#8da77c':'#648b67');}}
  const theme=display.dataset.theme,palette=theme==='rose'?['#ead7d0','#cbaaa1','#d6b99b','#cba69b']:theme==='cream'?['#efe4ce','#d4c6a8','#ceb18a','#d8bf96']:['#dce4ca','#afc4a6','#d8b98e','#a5b99a'];
  const items=selected();
  box(-2.8,-.35,-2.5,7.2,.35,6.4,palette[2]);
  // Separate boards retain depth sorting at every camera angle.
  for(let i=0;i<16;i++)box(-2.78,.002,-2.48+i*.3975,7.16,.02,.3795,i%2?palette[2]:shade(palette[2],1.025));
  layer=0;
  box(-2.2,.027,-1.75,1,.015,.48,'#adbc9e');box(-2.02,.05,-1.64,.18,.045,.31,'#e0c7aa');box(-1.75,.05,-1.64,.18,.045,.31,'#e0c7aa');
  const backVisible=Math.cos(yaw)>-.08,leftVisible=Math.sin(yaw)>-.08;
  if(backVisible){
   layer=-.5;
   box(-2.8,0,-2.65,7.2,3.5,.16,palette[1]);box(-2.85,3.5,-2.69,7.3,.08,.23,'#f7eedb');box(-2.7,.05,-2.47,7,.12,.07,'#f1e6cf');
   layer=0;
   if(game){box(-2.25,.05,-2.43,1.05,2.3,.09,'#ad9271');if(display.dataset.cabinGuest&&(!guestId||guestPath.length)){box(-2.17,.13,-2.32,.06,2.13,.89,'#c6ad88');cylinder(-2.08,1.1,-1.55,.055,.05,'#b49553',8);}else{box(-2.17,.13,-2.32,.89,2.13,.06,'#c6ad88');cylinder(-1.4,1.1,-2.21,.055,.05,'#b49553',8);}}
   if(game&&room!=='bedroom'&&display.dataset.roomTo){box(2.68,.05,-2.43,1.05,2.3,.09,'#ad9271');box(2.76,.13,-2.32,.89,2.13,.06,'#e2cfb1');cylinder(3.51,1.1,-2.21,.055,.05,'#b49553',8);}
   const clock=[];for(let i=0;i<12;i++)clock.push([-.65+Math.cos(i*Math.PI/6)*.2,2.7+Math.sin(i*Math.PI/6)*.2,-2.33]);poly(clock,'#dbc7a3');box(-.67,2.72,-2.23,.04,.16,.025,'#7e8469');
   box(.2,1.35,-2.46,1.65,1.55,.09,'#779e8a');box(.28,1.43,-2.35,1.49,1.39,.035,display.dataset.cozyDay==='night'?'#647b8c':display.dataset.cozyDay==='evening'?'#ddbd9c':'#b6d7c5');
   for(const x of [.16,.99,1.81])box(x,1.3,-2.29,.065,1.66,.09,'#fff0d3');
   for(const y of [1.3,2.1,2.9])box(.16,y,-2.29,1.72,.065,.09,'#fff0d3');
   box(.12,1.25,-2.24,1.82,.06,.3,'#dcc6a4');cylinder(1.62,1.32,-2.03,.07,.18,'#c6ad83',8);cylinder(1.62,1.51,-2.03,.15,.18,display.dataset.cozyBedside==='true'?'#ffdc8d':'#d5c3a0',8);box(-.65,2.8,-2.3,.22,.35,.08,display.dataset.cozyMain==='false'?'#c0b49e':'#ffe9ae');
   const curtain=Number(display.dataset.cozyCurtainProgress||0),width=.12+curtain*.72;box(.13,1.25,-2.15,width,1.72,.06,'#c6ac99');box(1.9-width,1.25,-2.15,width,1.72,.06,'#c6ac99');box(.1,3.02,-2.18,1.85,.045,.05,'#9c8068');
   box(.08,1.23,-2.44,1.9,.1,.4,'#e8d7b5');
  }
  if(leftVisible){
   layer=-.5;
   box(-2.94,0,-2.65,.16,3.5,6.55,palette[0]);box(-2.98,3.5,-2.69,.24,.08,6.65,'#fff5df');box(-2.76,.05,-2.45,.07,.12,6.3,'#f1e6cf');
   layer=0;
   if(items.wall!=='none'){
    const color=items.wall==='photo'?'#b7c9b7':items.wall==='clock'?'#f2e4c6':'#eef0d8';
    box(-2.74,1.55,-1.2,.1,1,.8,'#ab8e67');box(-2.63,1.64,-1.12,.025,.82,.64,color);
    if(items.wall==='clock'){box(-2.595,1.99,-.82,.025,.26,.025,'#5c7159');box(-2.595,1.99,-.82,.025,.025,.21,'#5c7159');}
    else if(items.wall==='photo'){box(-2.595,1.66,-1.1,.025,.26,.6,'#829b8b');box(-2.59,1.8,-1,.025,.15,.2,'#c6ac8b');}
    else{box(-2.595,1.77,-.8,.025,.43,.025,'#6c8e64');leaf(-2.56,1.9,-.8,0,.24,.24,'#78976b');leaf(-2.56,2,-.8,0,.23,-.2,'#78976b');}
   }
  }
  const fullLayout=previewLayout||layout;
  for(const entry of instances?Object.entries(fullLayout):[[null,null]]){
  meshInstance=entry[0];meshType=instances?bedroomCatalog[entry[1].furniture_type].mesh:null;
  const layout=instances?{[meshType]:entry[1]}:fullLayout;
  layer=-.75;furniture='rug';
  box(-1.6,.035,-.5,3.5,.025,2.5,palette[3]);box(-1.49,.064,-.39,3.28,.005,2.28,'#e4dfc5');box(-1.44,.071,-.34,3.18,.006,2.18,palette[3]);
  layer=0;furniture=null;
  if(game&&room!=='bedroom'){box(1.9,.03,1.3,.55,.11,.42,'#ad8462');box(1.92,.15,1.31,.51,.035,.4,'#eee2c6');box(1.9,.19,1.3,.55,.04,.42,'#748e79');}
  // Table, chair and furnishings are independent solid meshes.
  furniture='table';
  for(const x of [-.55,.55])for(const z of [-.25,.6])box(x,.08,z,.1,.9,.1,'#96744f');
  box(-.7,.95,-.4,1.5,.15,1.2,'#bb9469');box(-.73,1.1,-.43,1.56,.055,1.26,'#d9b98e');
  furniture='chair';
  for(const x of [-1.5,-.95])for(const z of [.7,1.3])box(x,.06,z,.09,.5,.09,'#7e906c');
  box(-1.6,.5,.6,.85,.2,.9,'#9aaa84');box(-1.6,.7,1.26,.85,.95,.17,'#bccba4');box(-1.65,.7,.6,.12,.33,.8,'#b4c29b');box(-.87,.7,.6,.12,.33,.8,'#b4c29b');box(-1.48,.7,.65,.58,.09,.6,'#d0d9b5');
  furniture='table';
  if(items.desk==='books'){box(-.3,1.16,-.03,.6,.09,.45,'#6c9a83');box(-.28,1.25,-.06,.57,.055,.45,'#f4ead4');box(-.32,1.305,-.04,.6,.07,.45,'#bd9075');}
  if(items.desk==='coffee'){cylinder(.1,1.16,.1,.24,.025,'#d6c5a7');cylinder(.1,1.19,.1,.14,.25,'#fff0d3');cylinder(.1,1.445,.1,.115,.006,'#77533c');box(.23,1.24,.05,.12,.12,.08,'#eadabc');}
  if(items.desk==='flowers'){cylinder(.1,1.16,.1,.12,.3,'#dbb49d');for(let i=0;i<4;i++){const x=.1+Math.sin(i)*.15,z=.1+Math.cos(i)*.13;box(x,1.4,z,.02,.35,.02,'#7a9468');cylinder(x,1.75,z,.095,.06,i%2?'#e9d1af':'#cda299',10);}}
  furniture='corner';
  if(items.corner==='plant')plant(1.95,-1.1);
  if(items.corner==='lamp'){cylinder(1.95,.03,-1.1,.32,.08,'#ac8c60');cylinder(1.95,.1,-1.1,.035,1.9,'#ad8e60',8);cylinder(1.95,1.7,-1.1,.43,.52,'#f0dbaa');cylinder(1.95,2.23,-1.1,.3,.025,'#fff1d0');}
  if(items.corner==='golf'){cylinder(1.95,.02,-1.1,.3,1.14,'#e7d5b8');cylinder(1.95,1.17,-1.1,.28,.035,'#8d9076');box(1.76,.25,-.81,.37,.45,.12,'#cba992');for(let i=0;i<4;i++){const x=1.78+i*.1; cylinder(x,1.18,-1.1,.022,.65+i*.07,'#b2bdb6',8);box(x-.02,1.82+i*.07,-1.14,.18,.08,.08,'#66766a');}}
  furniture=null;
  if(layout.bed){furniture='bed';box(-.7,.12,-1.05,1.4,.25,2.1,'#b69a75');for(const x of [-.65,.55])for(const z of [-1,.88])box(x,.02,z,.1,.22,.1,'#92795a');box(-.66,.37,-1.01,1.32,.17,2.02,'#f3e7cd');box(-.7,.37,-1.05,1.4,.68,.09,'#a7b99a');box(-.59,.56,-.94,1.18,.13,.55,'#fff4df');furniture=null;}
  // Optional furniture shares the same coordinates, hit testing and depth sorting.
  function softBox(x,y,z,w,h,d,color){const q=Math.min(.08,w/5,d/5),rim=[[x+q,z],[x+w-q,z],[x+w,z+q],[x+w,z+d-q],[x+w-q,z+d],[x+q,z+d],[x,z+d-q],[x,z+q]];poly(rim.map(([a,b])=>[a,y+h,b]),shade(color,1.06));for(let i=0;i<rim.length;i++){const a=rim[i],b=rim[(i+1)%rim.length];poly([[a[0],y,a[1]],[a[0],y+h,a[1]],[b[0],y+h,b[1]],[b[0],y,b[1]]],shade(color,.84+i*.018));}}
  function smallTable(w,d,y){for(const x of [-w/2+.12,w/2-.2])for(const z of [-d/2+.12,d/2-.2])box(x,.02,z,.08,y,.08,'#b69a77');softBox(-w/2,y,-d/2,w,.12,d,'#dbc3a0');}
  for(const id of Object.keys(cabinFurniture)){
   if(id==='bed'||!layout[id])continue;furniture=id;
   if(id==='nightstand'){box(-.22,.76,-.19,.44,.24,.35,'#bca27b');for(let i=0;i<4;i++)box(-.21+i*.1,.79,.166,.025,.17,.01,'#e5cfab');softBox(-.325,.08,-.325,.65,.65,.65,'#dcc5a5');box(-.28,.18,.332,.56,.2,.025,'#ece0c7');box(-.28,.42,.332,.56,.2,.025,'#f2e8d5');cylinder(0,.47,.365,.035,.04,'#9b8a68',8);}
   if(id==='nightlight'){cylinder(0,.02,0,.23,.08,'#cfb28e');cylinder(0,.1,0,.035,.5,'#bba17e',8);cylinder(0,.55,0,.25,.27,'#f0dfb6');cylinder(0,.83,0,.19,.025,'#fff0cf');}
   if(id==='sofa'){softBox(-.8,.2,-.55,1.6,.3,1.1,'#9aae91');softBox(-.8,.5,-.55,1.6,.68,.2,'#b6c8a8');for(const x of [-.8,.61])softBox(x,.47,-.45,.19,.37,.95,'#adc19f');for(const x of [-.57,.04])softBox(x,.5,-.25,.54,.15,.66,'#d0d9ba');softBox(-.53,.68,-.28,.36,.28,.12,'#eadac5');for(const x of [-.65,.53])for(const z of [-.42,.38])box(x,.03,z,.12,.2,.12,'#a68b69');}
   if(id==='coffeetable'){smallTable(1.1,.7,.43);box(-.18,.56,-.13,.34,.035,.24,'#9cab90');box(-.14,.6,-.1,.3,.035,.21,'#eadbc1');}
   if(id==='writingdesk'){smallTable(1.3,.8,.87);box(-.5,.3,-.28,.38,.53,.5,'#e1cfb0');box(-.46,.58,.23,.3,.14,.025,'#f0e6cf');box(.06,1,-.2,.4,.025,.3,'#fff3d8');cylinder(.44,1,-.18,.07,.17,'#b8c5a6',8);}
   if(id==='bookshelf'||id==='displaycase'){
    const w=1.1,d=id==='bookshelf'?.55:.6,h=id==='bookshelf'?1.9:1.65;box(-w/2,.06,-d/2,w,.12,d,'#baa07a');box(-w/2,.18,-d/2,.09,h-.18,d,'#d5bc97');box(w/2-.09,.18,-d/2,.09,h-.18,d,'#d5bc97');box(-w/2,.18,-d/2,w,h-.18,.065,id==='displaycase'?'#c9dccc':'#eadcc0');box(-w/2,h,-d/2,w,.1,d,'#d5bc97');
    for(const y of [.56,1.08]){box(-w/2,y,-d/2,w,.07,d,'#d5bc97');if(id==='bookshelf'){for(let i=0;i<5;i++)box(-.4+i*.17,y+.07,-.12,.12,.27+(i%2)*.09,.32,['#9cab90','#d2b4a6','#e8d9b7','#a7bdb3','#b6a28a'][i]);}else{cylinder(-.25,y+.07,0,.1,.23,'#e2cab0');box(.04,y+.07,-.08,.26,.21,.18,'#a6b69b');box(.08,y+.29,-.04,.18,.04,.12,'#f4e6ca');}}
    if(id==='displaycase'){for(const x of [-.45,0,.45])box(x,.2,.29,.025,1.4,.025,'#f4e6cf');box(-.45,.91,.29,.92,.025,.025,'#f4e6cf');}
   }
   if(id==='diningtable'){smallTable(1.2,1.1,.83);for(const x of [-.3,.25]){cylinder(x,.96,0,.13,.025,'#f7ebd1');cylinder(x,1,0,.065,.1,'#b9c7ab',10);}box(-.1,.97,-.3,.2,.025,.25,'#ead5c2');}
   if(id==='plant'){cylinder(0,.03,0,.23,.36,'#c6a386');cylinder(0,.4,0,.022,.58,'#70856a',8);for(const [x,y,z] of [[.23,.65,.07],[-.23,.78,-.04],[.13,.95,-.14],[-.12,1.04,.12]])leaf(0,y-.16,0,x,.24,z,'#93ad86');}
   furniture=null;
  }
  if(instances&&meshType==='reading_chair'){furniture='reading_chair';for(const x of [-.43,.35])for(const z of [-.35,.33])box(x,.03,z,.08,.34,.08,'#b49b78');box(-.52,.36,-.45,1.04,.29,.93,'#b3c5a5');box(-.52,.65,-.46,1.04,.83,.17,'#9fb592');for(const x of [-.575,.415])box(x,.55,-.38,.16,.34,.84,'#a7bc9a');box(-.39,.65,-.28,.78,.07,.69,'#d7dfc0');furniture=null;}
  if(instances&&meshType==='vanity_stool'){furniture=meshType;for(const x of [-.23,.15])for(const z of [-.23,.15])box(x,.03,z,.08,.49,.08,'#bda07c');cylinder(0,.49,0,.33,.13,'#dfc9bd');furniture=null;}
  if(instances&&meshType==='vanity'){furniture=meshType;smallTable(1.3,.65,.85);softBox(-.59,.48,-.28,.44,.34,.56,'#eadcc3');box(-.55,.6,.285,.36,.025,.035,'#b39975');softBox(-.44,.97,-.3,.88,.97,.09,'#bda17b');softBox(-.37,1.04,-.2,.74,.82,.025,'#c8ddd3');box(.39,.98,.02,.14,.18,.12,'#d9b9af');furniture=null;}
  if(instances&&meshType==='bedside_lamp'){furniture=meshType;softBox(-.325,.08,-.325,.65,.65,.65,'#dcc5a5');box(-.28,.23,.332,.56,.3,.025,'#f2e8d5');cylinder(0,.74,0,.17,.05,'#bfa17d');cylinder(0,.79,0,.026,.32,'#bba17e',8);cylinder(0,1.07,0,.23,.27,litLamps.has(meshInstance)?'#ffe29a':'#e4dcc4');cylinder(0,1.35,0,.18,.02,'#fff0cf');if(litLamps.has(meshInstance))poly(Array.from({length:24},(_,i)=>[Math.cos(i*Math.PI/12)*.8,.03,Math.sin(i*Math.PI/12)*.8]),'rgba(255,216,133,.38)');furniture=null;}
  if(instances&&meshType==='cushion'){furniture=meshType;softBox(-.35,.04,-.325,.7,.2,.65,'#d9b7ac');softBox(-.28,.24,-.25,.56,.035,.5,'#e8cbc0');furniture=null;}
  if(instances&&meshType==='teddy_plush'){furniture=meshType;softBox(-.21,.07,-.2,.42,.4,.39,'#bd9876');softBox(-.28,.43,-.22,.56,.43,.44,'#c7a07c');for(const x of [-.27,.13])softBox(x,.78,-.16,.14,.17,.14,'#bb9472');for(const x of [-.16,.09]){box(x,.65,.225,.06,.07,.018,'#51483b');softBox(x-.06,.03,.12,.2,.14,.2,'#c7a07c');}softBox(-.11,.49,.23,.22,.16,.04,'#ead7b7');box(-.035,.59,.275,.07,.045,.015,'#695241');box(-.19,.41,.2,.38,.07,.04,'#9eae8e');furniture=null;}
  if(instances&&meshType==='wardrobe'){furniture='wardrobe';box(-.675,.04,-.325,1.35,2.15,.65,'#c7b08a');box(-.61,.14,.334,.57,1.94,.035,'#dce4ca');box(.04,.14,.334,.57,1.94,.035,'#e9dfc7');for(const x of [-.08,.08])cylinder(x,1.05,.39,.035,.06,'#a08a64',8);furniture=null;}
  }meshInstance=null;meshType=null;layer=0;
  // Patrol routes are rebuilt around the current furniture footprints.
  const route=patrolRoute,legs=route.map((a,i)=>{const b=route[(i+1)%route.length];return Math.hypot(b[0]-a[0],b[1]-a[1])/.38+(b[2]?5.5:0);}),period=legs.reduce((a,b)=>a+b,0);
  let t=walkTime%period,segment=0;while(t>legs[segment]){t-=legs[segment];segment++;}
  const a=route[segment],b=route[(segment+1)%route.length],duration=legs[segment]-(b[2]?5.5:0),progress=duration>0?Math.min(t/duration,1):1,moving=walking&&t<duration;
  const availableActivity={read:Boolean(layout.table)&&items.desk==='books',coffee:Boolean(layout.table)&&items.desk==='coffee',golf:Boolean(layout.corner)&&items.corner==='golf',flowers:Boolean(layout.table)&&items.desk==='flowers',sleep:Boolean(bed()),sit:Object.keys(layout).some(id=>seatRecord(id)?.seat)};
  for(const option of activitySelect.options)if(Object.hasOwn(availableActivity,option.value))option.disabled=!availableActivity[option.value];
  if(activitySelect.selectedOptions[0]?.disabled){activitySelect.value='auto';planNavigation('auto');}
  const requested=activitySelect.value,automatic=availableActivity.golf&&segment===1?'golf':availableActivity.read?'read':availableActivity.coffee?'coffee':availableActivity.flowers?'flowers':'rest';
  currentActivity=!walking?'rest':requested==='auto'?(moving?'walk':automatic):requested;
  let bx=a[0]+(b[0]-a[0])*progress,bz=a[1]+(b[1]-a[1])*progress,heading=Math.atan2(b[0]-a[0],b[1]-a[1]);
  if(navigation){bx=navigation.x;bz=navigation.z;heading=navigation.points.length?navigation.heading:Math.atan2((navigation.action==='golf'?layout.corner.x:(layout.table?.x??bx))-bx,(navigation.action==='golf'?layout.corner.z:(layout.table?.z??bz))-bz);currentActivity=!walking?'rest':navigation.points.length?'walk':navigation.action==='room'?'rest':navigation.action;}
  else if(requested!=='auto'&&currentActivity!=='walk'){bx=1.22;bz=1.93;}
  if(sitting&&layout[activeSeatId]){const at=layout[activeSeatId],spec=seatTemplate(),angle=at.r*Math.PI/2;bx=at.x+spec.z*Math.sin(angle);bz=at.z+spec.z*Math.cos(angle);heading=angle+spec.facing;currentActivity='sit';}
  lastBear={x:bx,z:bz,heading};canvas.dataset.ownerPosition=JSON.stringify(lastBear);
  if(sitting)currentActivity='sit';else if(sleeping)currentActivity='sleep';
  else if(stretchRemaining>0)currentActivity='stretch';
  else if(reactionRemaining>0)currentActivity='wave';
  else if(display.dataset.cabinHeld)currentActivity='card';
  const walkingNow=currentActivity==='walk',swing=walkingNow?Math.sin(motionTime*8):0,bob=walkingNow?Math.abs(swing)*.035:0;
  const label={window:'正在窗邊看看風景',admire:'正在欣賞展示櫃裡的小回憶',desk:'正在書桌前安靜停留',stretch:'起床後伸個懶腰',sit:'正在椅子上休息 · 隨時可以起身',sleep:'正在床上安穩睡覺 · 隨時可以起床',card:'正拿著你的紀念卡',wave:'向你揮手打招呼',walk:navigation?.points.length?'正走向你點的家具':'正在小屋裡散步',read:'正在翻幾頁書',coffee:'正在慢慢喝咖啡',golf:'正在練習輕推桿',rest:'正在放空休息',flowers:'正在欣賞小花'}[currentActivity];
  if(activityStatus.textContent!==label)activityStatus.textContent=label;
  canvas.dataset.litLamps=JSON.stringify([...litLamps].filter(id=>layout[id]));canvas.dataset.activity=currentActivity;canvas.dataset.posture=sitting?'sitting':sleeping?'sleeping':'standing';canvas.dataset.seatedInstance=sitting?activeSeatId:'';
  const fur=display.dataset.bearFur||'#c18b60',outfit=display.dataset.bearOutfit||'#427560';
  function teddy(bx,bz,heading,fur,outfit,step,bob,activity,species='bear'){
  let head=false;
  const headTurn=activity==='wave'?Math.atan2(Math.sin(yaw-heading),Math.cos(yaw-heading))*.8:activity==='read'?.1*Math.sin(motionTime):0;
  const point=(x,y,z)=>{if(activity==='sit')y+=(seatTemplate()?.y||.65)-.21;if(activity==='sleep'){const b=bed(),angle=b.r*Math.PI/2,u=x,v=.5-y;return [b.x+u*Math.cos(angle)+v*Math.sin(angle),.86+z,b.z-u*Math.sin(angle)+v*Math.cos(angle)];}if(head){const u=x*Math.cos(headTurn)+z*Math.sin(headTurn);z=-x*Math.sin(headTurn)+z*Math.cos(headTurn);x=u;}return [bx+x*Math.cos(heading)+z*Math.sin(heading),y+bob,bz-x*Math.sin(heading)+z*Math.cos(heading)];};
  function round(x,y,z,rx,ry,rz,color){
   const rings=6,sides=10;
   for(let j=0;j<rings;j++)for(let i=0;i<sides;i++){
    const points=[];for(const [u,v] of [[i,j],[i+1,j],[i+1,j+1],[i,j+1]]){const lat=-Math.PI/2+v*Math.PI/rings,lon=u*Math.PI*2/sides;points.push(point(x+Math.cos(lat)*Math.cos(lon)*rx,y+Math.sin(lat)*ry,z+Math.cos(lat)*Math.sin(lon)*rz));}
    poly(points,shade(color,.78+.22*Math.sin((j+.5)*Math.PI/rings)+.08*Math.cos(i*2*Math.PI/sides-.6)));
   }
  }
  if(activity==='sit'){for(const x of [-.15,.15]){round(x,.34,.23,.13,.12,.29,fur);round(x,.12,.46,.11,.23,.11,fur);round(x,-.12,.51,.14,.09,.17,fur);}}else{round(0,.07,0,.36,.02,.28,'#9ca78a');round(-.15,.17,step*.07,.13,.16,.17,fur);round(.15,.17,-step*.07,.13,.16,.17,fur);}
  round(0,.56,0,species==='rabbit'?.255:.29,.35,.23,outfit);
  if(species==='rabbit')round(0,.42,-.26,.12,.12,.12,fur);
  if(species==='cat')for(let i=0;i<7;i++){const t=i/6;round(.21+Math.sin(t*2)*.3,.32+t*.54,-.28-t*.06,.07,.085,.07,fur);}
  const owner=activity!=='sleep'&&(species!=='bear'||fur===display.dataset.bearFur),look=owner?display.dataset.bearLook:'explorer',trim=owner?(display.dataset.bearTrim||'#e8d2aa'):'#e8d2aa';
  if(look==='sailor'){poly([point(-.23,.81,.18),point(0,.6,.25),point(.23,.81,.18),point(.16,.83,.2),point(0,.68,.26),point(-.16,.83,.2)],trim);}
  else if(look==='picnic'){poly([point(-.24,.81,.17),point(.24,.81,.17),point(.24,.73,.2),point(-.24,.73,.2)],trim);poly([point(.1,.76,.24),point(.24,.5,.24),point(.31,.55,.24),point(.18,.77,.24)],trim);}
  else{poly([point(-.012,.35,.23),point(.012,.35,.23),point(.012,.79,.2),point(-.012,.79,.2)],trim);}
  if(owner&&display.dataset.bearShoes&&activity!=='sit'){round(-.15,.14,step*.07,.14,.11,.18,display.dataset.bearShoes);round(.15,.14,-step*.07,.14,.11,.18,display.dataset.bearShoes);}
  if(owner&&display.dataset.bearShoes&&activity==='sit')for(const x of [-.15,.15])round(x,-.14,.52,.14,.09,.18,display.dataset.bearShoes);
  if(owner&&display.dataset.bearBag&&activity!=='sit'){const c=display.dataset.bearBag;poly([point(.26,.34,.03),point(.5,.34,.03),point(.5,.59,.03),point(.26,.59,.03)],c);poly([point(.3,.58,.03),point(.33,.7,.03),point(.43,.7,.03),point(.47,.58,.03),point(.44,.58,.03),point(.41,.67,.03),point(.35,.67,.03),point(.33,.58,.03)],trim);}
  if(activity==='stretch'){round(-.42,1.12,.02,.1,.32,.1,fur);round(.42,1.12,.02,.1,.32,.1,fur);}else if(activity==='sit'){round(-.33,.65,.17,.1,.18,.11,fur);round(.33,.65,.17,.1,.18,.11,fur);}else{round(-.33,.58,-step*.08,.1,.23,.11,fur);if(activity==='wave'){const wiggle=reducedMotion.matches?0:Math.sin(motionTime*10);round(.4+wiggle*.04,1.02,.04,.1,.25,.1,fur);round(.42+wiggle*.065,1.28,.05,.115,.1,.1,fur);}else round(.33,.58,step*.08,.1,.23,.11,fur);}
  head=true;
  round(0,1.02,0,species==='bear'?.34:.33,species==='cat'?.28:.31,.28,fur);
  if(species==='rabbit'){for(const x of [-.17,.17]){round(x,1.47,0,.085,.32,.085,fur);round(x,1.48,.075,.042,.23,.015,'#d9afa8');}}
  else if(species==='cat'){for(const side of [-1,1]){poly([point(side*.12,1.19,.035),point(side*.31,1.49,0),point(side*.34,1.15,.06)],fur);poly([point(side*.18,1.22,.05),point(side*.30,1.42,.025),point(side*.30,1.2,.07)],'#dfb8ab');poly([point(side*.12,1.19,.035),point(side*.31,1.49,0),point(side*.25,1.15,-.1)],fur);}}
  else{round(-.26,1.27,0,.13,.14,.09,fur);round(.26,1.27,0,.13,.14,.09,fur);round(-.26,1.27,.075,.075,.08,.025,'#e7bc97');round(.26,1.27,.075,.075,.08,.025,'#e7bc97');}
  round(0,.94,.255,species==='cat'?.145:.19,.13,.075,'#f4d7b6');
  if(species==='cat')for(const side of [-1,1])for(const y of [.91,.99])poly([point(side*.15,y,.30),point(side*.37,y+.03,.30),point(side*.37,y+.04,.30),point(side*.15,y+.01,.30)],'#846b59');round(0,.99,.323,species==='bear'?.06:.043,species==='bear'?.043:.028,.028,species==='bear'?'#463c35':'#d89482');
  const blink=activity==='sleep'?.008:!reducedMotion.matches&&Math.sin(motionTime*.9)> .995?.008:.036;
  round(-.13,1.085,.255,species==='bear'?.026:.047,species==='bear'?blink:blink===.008?.008:.062,.024,species==='bear'?'#302f2b':'#674b38');round(.13,1.085,.255,species==='bear'?.026:.047,species==='bear'?blink:blink===.008?.008:.062,.024,species==='bear'?'#302f2b':'#674b38');if(species!=='bear'){if(activity!=='sleep'){round(-.14,1.11,.279,.015,.02,.008,'#fff9eb');round(.12,1.11,.279,.015,.02,.008,'#fff9eb');}round(-.23,.96,.24,.06,.035,.013,'#e8b5a5');round(.23,.96,.24,.06,.035,.013,'#e8b5a5');if(species==='cat')round(.04,1.24,.17,.11,.065,.04,'#cfb091');}
  if(activity==='wave'){round(-.125,1.096,.278,.009,.01,.006,'#fff7e4');round(.135,1.096,.278,.009,.01,.006,'#fff7e4');poly([point(-.055,.895,.32),point(0,.877,.33),point(.055,.895,.32),point(0,.885,.33)],'#675148');}
  head=false;
  if(activity==='read'){
   poly([point(-.23,.64,.34),point(0,.6,.4),point(0,.89,.36),point(-.23,.93,.3)],'#b99475');
   poly([point(0,.6,.4),point(.23,.64,.34),point(.23,.93,.3),point(0,.89,.36)],'#f1e5cc');
   const pageAngle=reducedMotion.matches?1.2:(motionTime%3)/3*Math.PI;poly([point(0,.62,.409),point(Math.cos(pageAngle)*.22,.64+Math.sin(pageAngle)*.14,.355),point(Math.cos(pageAngle)*.22,.93+Math.sin(pageAngle)*.14,.315),point(0,.89,.369)],'#fff9e6');
   round(-.25,.73,.29,.08,.08,.08,fur);round(.25,.73,.29,.08,.08,.08,fur);
  }
  if(activity==='coffee'){
   const sip=reducedMotion.matches?.82:.72+.27*Math.pow((Math.sin(motionTime*1.8)+1)/2,2);
   const mug=[];for(let i=0;i<10;i++){const a=i*Math.PI/5,b=(i+1)*Math.PI/5;poly([point(.19+Math.cos(a)*.095,sip,.34+Math.sin(a)*.085),point(.19+Math.cos(b)*.095,sip,.34+Math.sin(b)*.085),point(.19+Math.cos(b)*.095,sip+.16,.34+Math.sin(b)*.085),point(.19+Math.cos(a)*.095,sip+.16,.34+Math.sin(a)*.085)],i<5?'#f5e6c7':'#d1bf9b');mug.push(point(.19+Math.cos(a)*.08,sip+.163,.34+Math.sin(a)*.07));}poly(mug,'#74513c');round(.3,sip+.08,.34,.07,.065,.035,'#e6d5b6');round(.27,sip-.04,.28,.1,.09,.08,fur);
  }
  if(activity==='coffee')for(let i=0;i<3;i++){const rise=reducedMotion.matches?i*.07:((motionTime*.14+i*.11)%.35);round(.19+Math.sin(i+motionTime)*.015,1.12+rise,.34,.015,.025,.015,'#e8ebdb');}
  if(activity==='golf'){
   const tilt=.13*Math.sin(motionTime*2);
   poly([point(.23,.65,.28),point(.25,.65,.28),point(.35+tilt,.1,.65),point(.32+tilt,.1,.65)],'#8e9f98');
   round(.38+tilt,.08,.65,.12,.04,.045,'#5f7166');round(.36+Math.sin(motionTime*2)*.1,.045,.85,.045,.045,.045,'#f4ecd9');
  }
  if(display.dataset.cabinHeld&&activity==='card'){poly([point(-.23,.62,.36),point(.23,.62,.36),point(.23,.95,.36),point(-.23,.95,.36)],'#fff0ce');poly([point(-.19,.69,.365),point(.19,.69,.365),point(.19,.9,.365),point(-.19,.9,.365)],'#9fbfae');poly([point(-.19,.69,.37),point(0,.85,.37),point(.19,.69,.37)],'#6d917d');round(-.25,.73,.34,.08,.08,.08,fur);round(.25,.73,.34,.08,.08,.08,fur);}
  if(activity==='flowers')round(0,.7,.33,.08,.08,.06,'#d2a38e');
  }
  teddy(bx,bz,heading,fur,outfit,swing,walkingNow?bob:0,currentActivity,display.dataset.bearSpecies||'bear');canvas.dataset.species=display.dataset.bearSpecies||'bear';canvas.dataset.ownerCount='1';canvas.dataset.sleepingBed=sleeping?activeBedId||'':'';
  for(const id of instances?Object.keys(layout).filter(id=>mesh(id)==='bed'):(bed()?['bed']:[])){meshInstance=instances?id:null;meshType=instances?'bed':null;furniture='bed';const top=sleeping&&id===activeBedId?.98+(reducedMotion.matches?0:Math.sin(motionTime*1.4)*.009):.73;box(-.64,.55,-.15,1.28,top-.55,1.14,'#a5b99a');box(-.64,top,-.15,1.28,.035,.12,'#f3e7cd');box(-.60,top+.04,.2,1.2,.018,.5,'#dcc5b0');furniture=null;meshInstance=null;meshType=null;}
  if(room==='bedroom'){delete canvas.dataset.guestState;delete canvas.dataset.guestPosition;}
  if(room!=='bedroom'&&display.dataset.cabinGuest){const guest=display.dataset.cabinGuest;if(guestId!==guest){guestId=guest;guestPosition={x:-1.7,z:-2.6,heading:0};guestPath=findFurniturePath(guestPosition,{x:1.5,z:.85});if(reducedMotion.matches){const end=guestPath.at(-1);if(end)guestPosition={...end,heading:-.6};guestPath=[];}}const colors={hugo:['#a87854','#637c6c'],liv:['#d5b592','#b48e8c'],ari:['#8797a0','#617f96']};const [coat,clothes]=colors[guest]||colors.hugo;teddy(guestPosition.x,guestPosition.z,guestPosition.heading,coat,clothes,guestPath.length?Math.sin(motionTime*8):0,guestPath.length?Math.abs(Math.sin(motionTime*8))*.035:0,'rest');canvas.dataset.guestState=guestPath.length?'entering':'inside';canvas.dataset.guestPosition=JSON.stringify(guestPosition);}
  if(editMode){layer=-.9;const rect=cabinLayoutRects(previewLayout||layout).find(r=>r.id===selectedFurniture),invalid=Boolean(previewLayout&&cabinLayoutProblem(previewLayout,items.corner!=='none',layoutRoom));if(rect){const y=.025,c=invalid?'#dc8f83':'#91b395';poly([[rect.x-rect.w/2-.04,y,rect.z-rect.d/2-.04],[rect.x+rect.w/2+.04,y,rect.z-rect.d/2-.04],[rect.x+rect.w/2+.04,y,rect.z+rect.d/2+.04],[rect.x-rect.w/2-.04,y,rect.z+rect.d/2+.04]],c);}}
  faces.sort((a,b)=>a.layer-b.layer||a.depth-b.depth);
  for(const face of faces){ctx.beginPath();face.points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=face.color;ctx.fill();ctx.strokeStyle=face.color;ctx.lineWidth=.45;ctx.stroke();}
  if(display.dataset.cozyBedside==='true'&&backVisible){const at=project([1.62,1.5,-2.03]),glow=ctx.createRadialGradient(at[0],at[1],0,at[0],at[1],Math.max(20,scale*1.3));glow.addColorStop(0,'#ffe2a04d');glow.addColorStop(1,'#ffe2a000');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);}
  hitFaces=faces.filter(face=>face.object);
  touchTargets=[];
  if(game&&w<=760){for(const rect of cabinLayoutRects(previewLayout||layout)){if(Math.max(rect.w,rect.d)>1.05)continue;const points=hitFaces.filter(f=>f.object===rect.id).flatMap(f=>f.points);if(!points.length)continue;const left=Math.min(...points.map(p=>p[0])),right=Math.max(...points.map(p=>p[0])),top=Math.min(...points.map(p=>p[1])),bottom=Math.max(...points.map(p=>p[1])),tx=(left+right)/2,ty=(top+bottom)/2;touchTargets.push({id:rect.id,x:tx,y:ty,w:Math.max(48,right-left+16),h:Math.max(48,bottom-top+16)});}}
  canvas.dataset.touchTargets=JSON.stringify(touchTargets);
  const focusId=editMode?selectedFurniture:null;canvas.dataset.selection=focusId||'';const focus=cabinLayoutRects(previewLayout||layout).find(r=>r.id===focusId);
  if(game&&focus){const pts=[[focus.x-focus.w/2,.04,focus.z-focus.d/2],[focus.x+focus.w/2,.04,focus.z-focus.d/2],[focus.x+focus.w/2,.04,focus.z+focus.d/2],[focus.x-focus.w/2,.04,focus.z+focus.d/2]].map(project);ctx.save();ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.strokeStyle='#375f48';ctx.lineWidth=2.5;ctx.setLineDash([5,4]);ctx.stroke();ctx.setLineDash([]);for(const p of pts){ctx.beginPath();ctx.arc(p[0],p[1],3.5,0,Math.PI*2);ctx.fillStyle='#fff9df';ctx.fill();ctx.stroke();}ctx.restore();}
if(sleeping&&bed()){const [x,y]=project(movedPoint(activeBedId,[.35,1.35,-.65]));ctx.fillStyle='#627c5b';ctx.font='600 18px system-ui';ctx.fillText('Zzz',x,y);}
  if(game){const duplicate=game.querySelector('[data-layout-command="duplicate"]');if(duplicate)duplicate.disabled=!instances||!editMode||!layout[selectedFurniture]||Object.keys(layout).length>=25;const wake=game.querySelector('[data-game-wake]');if(wake){wake.hidden=!(sitting||navigation?.action==='sit'||sleeping||navigation?.action==='sleep');wake.textContent=sitting||navigation?.action==='sit'?'↟ 起身':'☀ 起床';}}
  if(game){
   const removeButton=game.querySelector('[data-layout-command="remove"]');if(removeButton)removeButton.hidden=!(instances?Boolean(layout[selectedFurniture]):Object.hasOwn(cabinFurniture,selectedFurniture));
   const extraButton=game.querySelector('[data-game-hotspot="extra"]');if(extraButton)extraButton.hidden=true;const extra=(instances?Boolean(layout[selectedFurniture]):Object.hasOwn(cabinFurniture,selectedFurniture))&&(!instances&&selectedFurniture!=='bed'||instances)&&layout[selectedFurniture]?movedPoint(selectedFurniture,[cabinLayoutDefaults[mesh(selectedFurniture)]?.x||0,1,cabinLayoutDefaults[mesh(selectedFurniture)]?.z||0]):null;
   const anchors={...(display.dataset.roomTo?{roomdoor:room==='bedroom'?[-1.7,1.7,-2.25]:[3.2,1.7,-2.25]}:{}),...(extra?{extra}:{}),...(!instances&&bed()?{bed:movedPoint(activeBedId,[0,1,0])}:{}),desk:movedPoint('table',[0,1.5,.05]),chair:movedPoint('chair',[-1.175,1.6,1.05]),rug:movedPoint('rug',[.15,.12,.75]),corner:movedPoint('corner',[1.95,1,-1.1]),door:[-1.7,1.7,-2.25],album:[2.17,.4,1.5],bear:[bx,display.dataset.bearSpecies==='rabbit'?2.65:display.dataset.bearSpecies==='cat'?2.3:1.75,bz]};
   const labels=editMode?{extra:(itemName(selectedFurniture)||'家具')+' ↔ 拖曳',bed:'床鋪 ↔ 拖曳',desk:'桌子 ↔',chair:'椅子 ↔',rug:'地毯 ↔',corner:'角落擺設 ↔'}:{desk:items.desk==='books'?'📖 看書':items.desk==='coffee'?'☕ 咖啡':items.desk==='flowers'?'✿ 小花':'桌面',corner:items.corner==='golf'?'⛳ 推桿':items.corner==='plant'?'🌿 綠植':'窗邊'};
   for(const [id,anchor] of Object.entries(anchors)){const button=game.querySelector('[data-game-hotspot="'+id+'"]');if(!button)continue;const [x,y]=project(anchor);button.style.left=Math.max(28,Math.min(w-28,x))+'px';button.style.top=Math.max(65,Math.min(h-65,y))+'px';if(labels[id])button.textContent=labels[id];if(id==='bear')button.textContent=display.dataset.bearSpecies==='rabbit'?'嗨，兔兔':display.dataset.bearSpecies==='cat'?'嗨，貓咪':'嗨，熊熊';if(id==='roomdoor')button.textContent=room==='bedroom'?'回客廳 ↗':'進臥室 ↗';button.hidden=id==='roomdoor'?false:room==='bedroom'&&['door','album','desk','chair','rug','corner'].includes(id)?true:id==='bear'&&(sleeping||sitting)?true:editMode?['door','album','bear'].includes(id)||(id==='extra'?selectedFurniture:({bed:'bed',desk:'table',chair:'chair',rug:'rug',corner:'corner'})[id])!==selectedFurniture||id==='corner'&&items.corner==='none':['extra','desk','corner','chair','rug','bed'].includes(id)||id==='door'&&(!backVisible||game.dataset.visitorArrived!=='true')||id==='desk'&&items.desk==='none'||id==='corner'&&items.corner==='none';}
   const occupied=[];
   for(const id of ['roomdoor','door','album','extra','bed','desk','chair','rug','corner','bear']){const button=game.querySelector('[data-game-hotspot="'+id+'"]');if(!button||button.hidden)continue;
    const bw=Math.min(w-16,button.offsetWidth||Math.max(48,button.textContent.length*7+22)),bh=button.offsetHeight||48,rawX=parseFloat(button.style.left),rawY=parseFloat(button.style.top),gap=8;
    const candidates=[[0,0],[0,-56],[0,56],[72,0],[-72,0],[72,-56],[-72,-56],[72,56],[-72,56]];
    let best=null;for(const [dx,dy] of candidates){const x=clamp(rawX+dx,bw/2+8,w-bw/2-8),y=clamp(rawY+dy,bh/2+56,h-bh/2-16),r={x,y,w:bw,h:bh};if(occupied.every(q=>Math.abs(q.x-x)>=(q.w+bw)/2+gap||Math.abs(q.y-y)>=(q.h+bh)/2+gap)){best=r;break;}}
    if(!best)best={x:clamp(rawX,bw/2+8,w-bw/2-8),y:clamp(rawY,bh/2+56,h-bh/2-16),w:bw,h:bh};occupied.push(best);button.style.left=best.x+'px';button.style.top=best.y+'px';
   }
   for(const button of game.querySelectorAll?.('[data-cozy-target]')||[]){if(button.hidden)continue;const rawX=parseFloat(button.style.left),rawY=parseFloat(button.style.top);let best=null;for(const [dx,dy]of [[0,0],[56,0],[-56,0],[0,-56],[0,56],[56,-56],[-56,-56],[56,56],[-56,56],[0,112],[-112,0],[112,0]]){const x=clamp(rawX+dx,30,w-30),y=clamp(rawY+dy,30,h-30);if(occupied.every(q=>Math.abs(q.x-x)>=(q.w+44)/2+8||Math.abs(q.y-y)>=(q.h+44)/2+8)){best={x,y,w:44,h:44};break;}}if(best){occupied.push(best);button.style.left=best.x+'px';button.style.top=best.y+'px';}else button.hidden=true;}

  }
  canvas.dataset.yaw=yaw.toFixed(3);canvas.dataset.zoom=zoom.toFixed(2);
 }
 const render=()=>{if(!frame)frame=requestAnimationFrame(draw);};
 const change=(action)=>{if(action==='left')yaw-=.3;if(action==='right')yaw+=.3;if(action==='in')zoom=clamp(zoom+.15,.65,1.7);if(action==='out')zoom=clamp(zoom-.15,.65,1.7);if(action==='reset'){yaw=.72;pitch=.55;zoom=1;}render();};
 controls.addEventListener('click',event=>{const button=event.target.closest('[data-camera-action]');if(button)change(button.dataset.cameraAction);});
 canvas.addEventListener('keydown',event=>{const action={ArrowLeft:'left',ArrowRight:'right','+':'in','=':'in','-':'out',Home:'reset'}[event.key];if(action){event.preventDefault();change(action);}if(event.key==='ArrowUp'||event.key==='ArrowDown'){event.preventDefault();pitch=clamp(pitch+(event.key==='ArrowUp'?.08:-.08),.25,1.1);render();}});

 const pointers=new Map();let previousDistance=0,wasWalking=true,pressStart=null;
 const clone=value=>JSON.parse(JSON.stringify(value)),names={table:'桌子',chair:'椅子',corner:'角落擺設',rug:'地毯',...Object.fromEntries(Object.entries(cabinFurniture).map(([id,v])=>[id,v.name]))};
 function layoutMessage(message){if(game){game.querySelector('[data-layout-feedback]').textContent=message;display.dispatchEvent(new CustomEvent('cabin-layout-feedback',{detail:message}));}}
 function rebuildPatrol(){navigation=null;autoReturn=null;patrolRoute=makePatrol();walkTime=0;}
 function clampRug(next){if(instances){for(const r of cabinLayoutRects(next)){const p=next[r.id];p.x=Math.round(clamp(p.x,cabinRoomBounds.minX+r.w/2,cabinRoomBounds.maxX-r.w/2)*1000)/1000;p.z=Math.round(clamp(p.z,cabinRoomBounds.minZ+r.d/2,cabinRoomBounds.maxZ-r.d/2)*1000)/1000;}return;}const r=cabinLayoutRects(next).find(r=>r.id==='rug');if(!r)return;next.rug.x=clamp(next.rug.x,cabinRoomBounds.minX+r.w/2,cabinRoomBounds.maxX-r.w/2);next.rug.z=clamp(next.rug.z,cabinRoomBounds.minZ+r.d/2,cabinRoomBounds.maxZ-r.d/2);next.rug.x=Math.round(next.rug.x*1000)/1000;next.rug.z=Math.round(next.rug.z*1000)/1000;}
 function commitLayout(next,remember=true){
  clampRug(next);
  const problem=cabinLayoutProblem(next,selected().corner!=='none',layoutRoom);if(problem){layoutMessage(problem);return false;}
  if(JSON.stringify(next)===JSON.stringify(layout)){previewLayout=null;render();return true;}
  if(remember){history.push(clone(layout));if(history.length>30)history.shift();}
  layout=clone(next);if(instances&&!bed()){activeBedId=Object.keys(layout).find(id=>mesh(id)==='bed');sleeping=false;}if(!layout[selectedFurniture])selectedFurniture=Object.keys(layout)[0]||'table';if(game)game.querySelector('[data-layout-selection]').textContent=itemName(selectedFurniture);previewLayout=null;display.dataset.cabinLayout=JSON.stringify(layout);rebuildPatrol();
  display.dispatchEvent(new CustomEvent('cabin-layout-change',{detail:clone(layout)}));layoutMessage('位置已更新，記得儲存。');render();return true;
 }
 function beginEditing(id){
  if(!game)return;
  if(!editMode){if(sitting||navigation?.action==='sit'||sleeping||navigation?.action==='sleep')planNavigation('wake');display.dispatchEvent(new CustomEvent('cabin-furniture-select',{detail:null}));editBaseline=clone(layout);wasWalking=walking;walking=false;updateWalk();editMode=true;game.classList.add('is-layout-editing');game.querySelector('[data-layout-controls]').hidden=false;}
  if(id)selectedFurniture=id;
  game.querySelector('[data-layout-selection]').textContent=itemName(selectedFurniture);layoutMessage('拖曳移動 · 旋轉按鈕轉向 · 方向鍵微調');render();
 }
 function finishEditing(cancel=false){
  if(cancel&&editBaseline)commitLayout(editBaseline);
  editMode=false;inspectedFurniture=null;display.dispatchEvent(new CustomEvent('cabin-furniture-select',{detail:null}));previewLayout=null;drag=null;game.classList.remove('is-layout-editing');game.querySelector('[data-layout-controls]').hidden=true;walking=wasWalking;updateWalk();rebuildPatrol();render();
 }
 function layoutCommand(command){
  if(typeof command==='string'&&command.startsWith('select:')){const id=command.slice(7);if(layout[id])beginEditing(id);return;}
  if(instances&&(command==='duplicate'||typeof command==='string'&&command.startsWith('add:'))){
   const original=command==='duplicate'?layout[selectedFurniture]:null;if(command==='duplicate'&&!original){layoutMessage('請先選取要複製的家具。');return;}
   const type=original?.furniture_type||command.slice(4);if(!Object.hasOwn(bedroomCatalog,type))return;if(Object.keys(layout).length>=25){layoutMessage('臥室最多可放 25 件家具。');return;}
   const id=crypto.randomUUID(),now=Date.now();let found=null;
   const spots=[];for(let x=-2.25;x<=4;x+=.25)for(let z=-1.75;z<=3.5;z+=.25)spots.push({x,z});if(original)spots.sort((a,b)=>Math.hypot(a.x-original.x,a.z-original.z)-Math.hypot(b.x-original.x,b.z-original.z));
   for(const {x,z} of spots){const p={id,room_id:'bedroom',furniture_type:type,x,z,r:original?.r||0,layer:type==='rug'?-.75:0,created_at:now,updated_at:now},next={...clone(layout),[id]:p};if(bedroomProblem(next))continue;const rects=cabinLayoutRects(next),q=rects.find(r=>r.id===id);if(original){const source=rects.find(r=>r.id===selectedFurniture);if(Math.abs(source.x-q.x)<(source.w+q.w)/2+.03&&Math.abs(source.z-q.z)<(source.d+q.d)/2+.03)continue;}if(type!=='rug'&&rects.some(r=>r.id!==id&&r.mesh!=='rug'&&Math.abs(r.x-q.x)<(r.w+q.w)/2+.03&&Math.abs(r.z-q.z)<(r.d+q.d)/2+.03))continue;found=next;break;}
   if(!found){layoutMessage('目前沒有空位，請先挪開或收回家具。');return;}beginEditing();commitLayout(found);beginEditing(id);return;
  }
  if(command==='add-bed'||typeof command==='string'&&command.startsWith('add:')){
   const id=command==='add-bed'?'bed':command.slice(4);if(!Object.hasOwn(cabinFurniture,id))return;
   if(layout[id]){beginEditing(id);return;}
   let found=null;for(const r of [0,1])for(let x=cabinRoomBounds.minX+.25;x<=cabinRoomBounds.maxX-.25&&!found;x+=.25)for(let z=cabinRoomBounds.minZ+.25;z<=cabinRoomBounds.maxZ-.25&&!found;z+=.25){const next=clone(layout);next[id]={x,z,r};if(!cabinLayoutProblem(next,selected().corner!=='none',layoutRoom))found=next;}
   if(!found){layoutMessage('目前空間不足，請先移動或收回一件家具，再加入；原布置沒有變更。');return;}
   beginEditing(id);commitLayout(found);return;
  }

  if(command==='start'){beginEditing();return;}
  if(!editMode)return;
  if(command==='finish'||command==='save'||command==='cancel'){finishEditing(command==='cancel');if(command==='save')display.dispatchEvent(new CustomEvent('cabin-layout-save'));return;}
  if(command==='remove'){if(!(instances?Boolean(layout[selectedFurniture]):Object.hasOwn(cabinFurniture,selectedFurniture)))return;const next=clone(layout);delete next[selectedFurniture];commitLayout(next);return;}
  if(command==='undo'){const previous=history.pop();if(previous)commitLayout(previous,false);else layoutMessage('目前沒有可復原的移動。');return;}
  const next=clone(layout),item=next[selectedFurniture];if(!item)return;
  if(command==='rotate')item.r=(item.r+1)%4;
  else if(command==='left')item.x-=.25;else if(command==='right')item.x+=.25;else if(command==='forward')item.z-=.25;else if(command==='back')item.z+=.25;else return;
  clampRug(next);item.x=Math.round(item.x*1000)/1000;item.z=Math.round(item.z*1000)/1000;commitLayout(next);
 }
 if(game){
  display.addEventListener('cabin-room-discard',event=>{const saved=decodeCabinLayout(event.detail,true,layoutRoom);if(saved){layout=saved;previewLayout=null;history=[];rebuildPatrol();render();}});
  display.addEventListener('cabin-room-walk',()=>{if(editMode)finishEditing();planNavigation('room');render();});
  display.addEventListener('cabin-layout-command',event=>layoutCommand(event.detail));
  game.addEventListener('click',event=>{const command=event.target.closest('[data-layout-command]');if(command){event.preventDefault();event.stopImmediatePropagation();layoutCommand(command.dataset.layoutCommand);return;}if(editMode){const hotspot=event.target.closest('[data-game-hotspot]')?.dataset.gameHotspot,id=hotspot==='extra'?selectedFurniture:({bed:'bed',desk:'table',chair:'chair',corner:'corner',rug:'rug'})[hotspot];if(id){event.preventDefault();event.stopImmediatePropagation();beginEditing(id);}}},true);
  game.addEventListener('keydown',event=>{if(!editMode||game.querySelector('dialog[open]'))return;const command=({ArrowLeft:'left',ArrowRight:'right',ArrowUp:'forward',ArrowDown:'back',r:'rotate',R:'rotate',Escape:'finish'})[event.key]||((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'?'undo':'');if(command){event.preventDefault();event.stopImmediatePropagation();layoutCommand(command);}},true);
 }
 function screenPoint(event){const rect=canvas.getBoundingClientRect();return {x:event.clientX-rect.left,y:event.clientY-rect.top};}
 function hitFurniture(at){
  for(let i=hitFaces.length-1;i>=0;i--){const face=hitFaces[i];let inside=false;for(let a=0,b=face.points.length-1;a<face.points.length;b=a++){const p=face.points[a],q=face.points[b];if((p[1]>at.y)!==(q[1]>at.y)&&at.x<(q[0]-p[0])*(at.y-p[1])/(q[1]-p[1])+p[0])inside=!inside;}if(inside)return face.object;}
  const near=touchTargets.filter(t=>Math.abs(t.x-at.x)<=t.w/2&&Math.abs(t.y-at.y)<=t.h/2).sort((a,b)=>Math.hypot(a.x-at.x,a.y-at.y)-Math.hypot(b.x-at.x,b.y-at.y));
  return near[0]?.id||null;
 }
 function floorPoint(at){const {w,scale,cx,cy}=projection,u=(at.x-(cx??w/2))/scale,d=((at.y-cy)/scale-1.1*Math.cos(pitch))/Math.sin(pitch);return {x:.8+u*Math.cos(yaw)+d*Math.sin(yaw),z:.7-u*Math.sin(yaw)+d*Math.cos(yaw)};}
 function startDrag(event,id){
  if(!projection||!id||!layout[id])return;event.preventDefault?.();beginEditing(id);if(projection.w!==canvas.clientWidth||projection.h!==canvas.clientHeight)draw();const at=floorPoint(screenPoint(event));drag={pointer:event.pointerId,before:clone(layout),offsetX:at.x-layout[id].x,offsetZ:at.z-layout[id].z};canvas.setPointerCapture(event.pointerId);
 }
 canvas.addEventListener('pointerdown',event=>{
  if(event.button!==undefined&&event.button!==0)return;
  const point=screenPoint(event),hit=hitFurniture(point);pressStart={x:event.clientX,y:event.clientY};tap={pointer:event.pointerId,x:event.clientX,y:event.clientY,hit,moved:pointers.size>0};if(pointers.size>0)tap.moved=true;
  if(editMode){if(hit)startDrag(event,hit);else{selectedFurniture='';inspectedFurniture=null;game.querySelector('[data-layout-selection]').textContent='點選一件家具';layoutMessage('點選家具後可拖曳、旋轉或收回。');render();}return;}
  if(game&&pointers.size===0&&inspectedFurniture&&hit===inspectedFurniture){startDrag(event,hit);return;}
  pointers.set(event.pointerId,[event.clientX,event.clientY]);canvas.setPointerCapture(event.pointerId);previousDistance=0;canvas.classList.add('is-dragging');
  if(pointers.size>1&&pressTimer){clearTimeout(pressTimer);pressTimer=0;}
  if(game&&hit&&pointers.size===1)pressTimer=setTimeout(()=>{pressTimer=0;startDrag(event,hit);pointers.clear();},450);
 });
 if(game)game.addEventListener('pointerdown',event=>{if(!editMode)return;const hotspot=event.target.closest('[data-game-hotspot]')?.dataset.gameHotspot,id=hotspot==='extra'?selectedFurniture:({bed:'bed',desk:'table',chair:'chair',corner:'corner',rug:'rug'})[hotspot];if(id){event.preventDefault();event.stopPropagation();startDrag(event,id);}});
 canvas.addEventListener('pointermove',event=>{
  if(tap&&Math.hypot(event.clientX-tap.x,event.clientY-tap.y)>8)tap.moved=true;
  if(pressTimer&&pressStart&&Math.hypot(event.clientX-pressStart.x,event.clientY-pressStart.y)>8){clearTimeout(pressTimer);pressTimer=0;}
  if(editMode){if(!drag||drag.pointer!==event.pointerId)return;event.preventDefault?.();const at=floorPoint(screenPoint(event));previewLayout=clone(layout);previewLayout[selectedFurniture].x=Math.round((at.x-drag.offsetX)*4)/4;previewLayout[selectedFurniture].z=Math.round((at.z-drag.offsetZ)*4)/4;clampRug(previewLayout);layoutMessage(cabinLayoutProblem(previewLayout,selected().corner!=='none',layoutRoom)||'這裡可以放，鬆開完成。');render();return;}
  const previous=pointers.get(event.pointerId);if(!previous)return;pointers.set(event.pointerId,[event.clientX,event.clientY]);if(pointers.size===2){if(pressTimer){clearTimeout(pressTimer);pressTimer=0;}const [a,b]=[...pointers.values()],distance=Math.hypot(a[0]-b[0],a[1]-b[1]);if(previousDistance)zoom=clamp(zoom*distance/previousDistance,.65,1.7);previousDistance=distance;}else{yaw+=(event.clientX-previous[0])*.009;pitch=clamp(pitch+(event.clientY-previous[1])*.006,.25,1.1);}render();
 });
 const release=event=>{
  if(event.type==='pointerup'&&!editMode&&!drag&&tap&&tap.pointer===event.pointerId&&!tap.moved&&game){if(!instances&&room==='living'&&tap.hit==='chair'){requestedSeatId='chair';display.dispatchEvent(new CustomEvent('cabin-furniture-select',{detail:null}));planNavigation('sit');render();}else display.dispatchEvent(new CustomEvent('cabin-furniture-select',{detail:tap.hit||null}));}
  tap=null;
  if(pressTimer){clearTimeout(pressTimer);pressTimer=0;}
  if(drag&&drag.pointer===event.pointerId){if(event.type==='pointerup'&&previewLayout){const next=previewLayout;previewLayout=null;commitLayout(next);}else previewLayout=null;drag=null;render();}
  pointers.delete(event.pointerId);previousDistance=0;if(!pointers.size)canvas.classList.remove('is-dragging');
 };
 canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
 canvas.addEventListener('wheel',event=>{if(event.ctrlKey){event.preventDefault();zoom=clamp(zoom*Math.exp(-event.deltaY*.005),.65,1.7);render();}},{passive:false});
 new ResizeObserver(render).observe(canvas);new MutationObserver(render).observe(display,{attributes:true,subtree:true,attributeFilter:['data-theme','hidden','data-cabin-guest','data-cabin-held','data-cabin-layout']});
 const tick=now=>{if(lastTick&&(walking||reactionRemaining>0||guestPath.length>0)&&visible&&!document.hidden){const dt=Math.min((now-lastTick)/1000,.1);motionTime+=dt;if(guestPath.length){const next=guestPath[0],dx=next.x-guestPosition.x,dz=next.z-guestPosition.z,d=Math.hypot(dx,dz),step=.85*dt;guestPosition.heading=Math.atan2(dx,dz);if(d<=step){guestPosition.x=next.x;guestPosition.z=next.z;guestPath.shift();if(!guestPath.length)render();}else{guestPosition.x+=dx/d*step;guestPosition.z+=dz/d*step;}}if(stretchRemaining>0){stretchRemaining=Math.max(0,stretchRemaining-dt);if(stretchRemaining===0)render();}else if(reactionRemaining>0){reactionRemaining=Math.max(0,reactionRemaining-dt);if(reactionRemaining===0)render();}else{if(!sleeping){if(activitySelect.value==='auto'&&!navigation)walkTime+=dt;advanceNavigation(dt);}}}lastTick=now;if((walking||reactionRemaining>0||guestPath.length>0)&&visible&&!document.hidden&&now-lastPaint>40){render();lastPaint=now;}requestAnimationFrame(tick);};
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(canvas);
 patrolRoute=makePatrol();
 requestAnimationFrame(tick);
 canvas.hidden=false;controls.hidden=false;display.querySelector('[data-cabin-life]').hidden=false;fallback.setAttribute('hidden','');display.querySelector('[data-cabin-gesture]').hidden=false;render();
}


export function islandLifeCalendar(now=Date.now()){
 const day=Math.floor((now+8*3600000)/86400000),monday=day-((day+3)%7+7)%7,week=Math.floor((monday-20766)/7);
 const date=n=>new Date(n*86400000).toISOString().slice(0,10);
 return {day:date(day),week:date(monday),weekEnd:date(monday+6),visit:['hugo','liv','ari'][((day%3)+3)%3],event:['market','stars','lost'][((week%3)+3)%3]};
}
export const cabinVisits={
 hugo:{name:'Hugo',title:'門口的咖啡香',intro:'叩叩！Hugo 帶著兩小包咖啡來了。「今天想找個地方試新口味，可以進來坐坐嗎？」',question:'你想怎麼招待 Hugo？',choices:{a:'一起試試帶來的咖啡',b:'先帶他看看我的小屋'},branches:{a:{text:'你們把杯子排好。Hugo 說這款咖啡讓他想到雨後的港口。',question:'你想替它取什麼名字？',choices:{a:'慢慢醒來的早晨',b:'不趕時間的午後'}},b:{text:'Hugo 看著你挑的色彩：「原來每個角落都能說一個故事。」',question:'你想和他聊什麼？',choices:{a:'這間小屋最喜歡的角落',b:'下次想邀來的朋友'}}},endings:{aa:['晨光咖啡卡','Hugo 把「慢慢醒來」寫在包裝上，留了一包給你的下一個早晨。'],ab:['午後咖啡卡','你們決定把這款咖啡留給不趕時間的人。Hugo 說下次要帶餅乾來。'],ba:['角落速寫卡','Hugo 畫下你的小屋角落。「下次在店裡，也留一個這樣的位置吧。」'],bb:['下一次的邀請卡','你們一起列出下一場小聚的名單。小屋好像又多了一點期待。']}},
 liv:{name:'Liv',title:'帶球桿來串門',intro:'叩叩！Liv 背著小球袋站在門口。「剛練完球，要不要一起放鬆一下？」',question:'今天想陪 Liv 做什麼？',choices:{a:'來一場迷你推桿挑戰',b:'泡杯茶，聊聊今天的練習'},branches:{a:{text:'Liv 在空地放好小目標。「不用比遠，只要慢慢推過去。」',question:'你想怎麼玩？',choices:{a:'合作，兩人一起累積三次命中',b:'挑戰最慢、最輕的一球'}},b:{text:'Liv 笑著說自己今天也打了好多顆歪球。「不過有一球，手感特別好。」',question:'你想接著聊？',choices:{a:'今天最好玩的一個瞬間',b:'下次一起練球的計畫'}}},endings:{aa:['默契推桿卡','第三次命中時，你們一起歡呼。Liv 說合作比算分有趣多了。'],ab:['輕輕一推卡','球停在目標旁邊，剛剛好。Liv 把這一球叫作「不著急」。'],ba:['練球小確幸卡','你們交換今天最開心的小事，才發現值得記住的遠比失誤多。'],bb:['下次練球卡','你們約好下次先熱身，再各自選一個小目標。期待被留在了這間小屋。']}},
 ari:{name:'Ari',title:'旅行相片的下一頁',intro:'叩叩！Ari 帶著一疊旅行相片。「我在整理港城的回憶，想聽聽你會怎麼選。」',question:'你想先看哪一疊？',choices:{a:'路上遇見的人',b:'沒有計畫的風景'},branches:{a:{text:'一張相片裡，兩位陌生人在碼頭交換便當。Ari 還記得那天的笑聲。',question:'相片背面要寫什麼？',choices:{a:'有人分享，旅程就不孤單',b:'下一次，換我先打招呼'}},b:{text:'雨讓原本的路線取消，卻帶 Ari 走進一間小書店。',question:'如果是你會怎麼選？',choices:{a:'留一點空白給偶然',b:'找一個喜歡的角落慢慢看'}}},endings:{aa:['旅途相遇卡','Ari 把你寫的字夾進相簿。「這頁要留給路上遇見的人。」'],ab:['勇敢招呼卡','你們約好下次在島上遇見新面孔，先說一聲嗨。'],ba:['偶然風景卡','一張沒有排進行程的風景，被你們選成了封面。'],bb:['慢旅行卡','Ari 留下一張書店相片。你的小屋也像旅途中可以歇腳的角落。']}}
};
export const islandWeeklyEvents={
 market:{name:'Hugo',title:'港灣週末市集',intro:'碼頭搭起了小攤位。Hugo 想把這週的市集辦成一場小小的相遇，邀你一起準備。',question:'你想負責哪個攤位？',choices:{a:'咖啡與故事交換攤',b:'旅行小物交換攤'},branches:{a:{text:'一位居民帶著空白明信片走來，想換一個今天值得記住的瞬間。',question:'你想邀大家分享？',choices:{a:'最近的一件小確幸',b:'一個還沒實現的小願望'}},b:{text:'桌上有貝殼、書籤和一張舊車票，每件小物都有自己的旅程。',question:'你想替攤位加什麼？',choices:{a:'寫下每件小物的來歷',b:'留一句話給下一位主人'}}},endings:{aa:['市集小確幸章','大家把小確幸寫滿了明信片，Hugo 把它們掛成一面溫柔的牆。'],ab:['願望交換章','一張張小願望被帶回家，市集留下的不只是咖啡香。'],ba:['小物旅程章','每件小物都找到了願意聽故事的新主人。'],bb:['下一位主人章','你們在包裝裡放進一句祝福，讓故事繼續旅行。']}},
 stars:{name:'Ari',title:'翡翠灣流星夜',intro:'今晚的島上故事是觀星小聚。Ari 邀大家帶著毯子，到港口想像一片沒有城市燈光的星空。',question:'你想先準備什麼？',choices:{a:'給大家一張星空小卡',b:'準備一壺溫熱的茶'},branches:{a:{text:'Ari 拿出兩種空白卡片：「今晚想留住什麼？」',question:'你選哪一張？',choices:{a:'寫給未來的自己',b:'送給此刻想到的人'}},b:{text:'杯子在大家手中傳遞，夜晚慢了下來。',question:'你想開啟哪個話題？',choices:{a:'今年最想感謝的一件事',b:'下一次想一起去的地方'}}},endings:{aa:['未來星光章','你把想說的話折進星空卡，留給未來某個需要鼓勵的自己。'],ab:['想念星光章','那個名字被輕輕寫在卡片上，今晚多了一份溫柔的牽掛。'],ba:['感謝星光章','每個人的小小感謝，讓這個夜晚亮了起來。'],bb:['下一站星光章','你們把下一段旅程說給星空聽，期待成了今晚的紀念。']}},
 lost:{name:'Liv',title:'碼頭失物小隊',intro:'一只沒有署名的小布包落在碼頭長椅上。Liv 想在天黑前找到主人，邀你加入失物小隊。',question:'你想先怎麼找？',choices:{a:'問問附近的居民',b:'查看布包外側的線索'},branches:{a:{text:'咖啡攤老闆說，剛才有位旅人一路拍攝港口的老招牌。',question:'接下來去哪裡？',choices:{a:'到老招牌旁找找',b:'請老闆幫忙留下尋物訊息'}},b:{text:'布包外側掛著一枚紙製書籤，上面畫著港口的書店。',question:'你想怎麼做？',choices:{a:'和 Liv 到書店問問',b:'在碼頭服務台留下線索'}}},endings:{aa:['熱心尋人章','你們在老招牌旁找到焦急的旅人。布包裡原來裝著寫給家人的明信片。'],ab:['接力尋物章','老闆幫忙傳話，旅人很快回到碼頭領回布包。幫忙的人比想像中多。'],ba:['書店線索章','書店老闆認出了書籤，陪你們把布包送回主人手中。'],bb:['安心保管章','服務台替布包做好登記，旅人回來時，終於鬆了一口氣。']}}
};


export const cabinFurniture={bed:{name:'單人床',size:[1.4,2.1]},nightstand:{name:'床頭櫃',size:[.65,.65]},nightlight:{name:'小夜燈',size:[.55,.55]},sofa:{name:'小沙發',size:[1.6,1.1]},coffeetable:{name:'茶几',size:[1.1,.7]},writingdesk:{name:'書桌',size:[1.3,.8]},bookshelf:{name:'書架',size:[1.1,.55]},displaycase:{name:'展示櫃',size:[1.1,.6]},diningtable:{name:'小餐桌',size:[1.2,1.1]},plant:{name:'盆栽',size:[.65,.65]}};
export const cabinBedroomDefaults={bed:{x:.4,z:.2,r:0}};
export const cabinRoomBounds={minX:-2.7,maxX:4.3,minZ:-2.4,maxZ:3.8};
export const cabinLayoutDefaults={table:{x:.05,z:.2,r:0},chair:{x:-1.175,z:1.05,r:0},corner:{x:1.95,z:-1.1,r:0},rug:{x:.15,z:.75,r:0}};
export function cabinLayoutRects(layout,hasCorner=true){
 const sizes={table:[1.5,1.2],chair:[.85,.9],corner:[.9,.9],rug:[3.5,2.5],...Object.fromEntries(Object.entries(cabinFurniture).map(([id,v])=>[id,v.size]))};
 return Object.entries(layout).filter(([id])=>id!=='corner'||hasCorner).map(([id,p])=>{const [w,d]=p.furniture_type?bedroomCatalog[p.furniture_type].size:sizes[id];return {id,mesh:p.furniture_type?bedroomCatalog[p.furniture_type].mesh:id,x:p.x,z:p.z,w:p.r%2?d:w,d:p.r%2?w:d};});
}
export function cabinLayoutProblem(layout,hasCorner=true,room='living'){
 if(room==='bedroom-instances')return bedroomProblem(layout);
 if(!layout||typeof layout!=='object'||Array.isArray(layout)||room!=='bedroom'&&!Object.keys(cabinLayoutDefaults).every(id=>Object.hasOwn(layout,id))||Object.keys(layout).some(id=>!Object.hasOwn(cabinLayoutDefaults,id)&&!Object.hasOwn(cabinFurniture,id)))return '布置資料不完整。';
 for(const p of Object.values(layout))if(!p||typeof p!=='object'||Array.isArray(p)||Object.keys(p).sort().join(',')!=='r,x,z'||!Number.isFinite(p.x)||!Number.isFinite(p.z)||Math.abs(p.x)>10||Math.abs(p.z)>10||!Number.isInteger(p.r)||p.r<0||p.r>3)return '請使用有效的家具位置與角度。';
 const rects=cabinLayoutRects(layout,hasCorner),allRects=cabinLayoutRects(layout,true),overlap=(a,b)=>Math.abs(a.x-b.x)<(a.w+b.w)/2-.025&&Math.abs(a.z-b.z)<(a.d+b.d)/2-.025;
 for(const a of allRects){
  if(a.x-a.w/2<cabinRoomBounds.minX||a.x+a.w/2>cabinRoomBounds.maxX||a.z-a.d/2<cabinRoomBounds.minZ||a.z+a.d/2>cabinRoomBounds.maxZ)return '家具超出房間了，請往裡面放一點。';
  if(a.id==='rug'||a.id==='corner'&&!hasCorner)continue;
  if(overlap(a,{x:-1.7,z:-2.2,w:1.5,d:.65}))return '這裡要留給門口通行，請換個位置。';
  if(room!=='bedroom'&&overlap(a,{x:2.17,z:1.5,w:.6,d:.5}))return '這裡放著相簿，請留一點空間。';
  for(const b of rects)if(a.id!==b.id&&b.id!=='rug'&&overlap(a,b))return '家具重疊了，請留一點空間。';
 }
 return '';
}
export function decodeCabinLayout(raw,hasCorner=true,room='living'){
 try{let layout=typeof raw==='string'?JSON.parse(raw):raw;if(layout&&typeof layout==='object'&&!Array.isArray(layout)&&Object.keys(layout).length===0&&room==='living')layout=JSON.parse(JSON.stringify(room==='bedroom'?cabinBedroomDefaults:cabinLayoutDefaults));return cabinLayoutProblem(layout,hasCorner,room)?null:layout;}catch{return null;}
}


export function islandSecretClock(now=Date.now()){
 const shifted=now+28800000,day=Math.floor(shifted/86400000),hour=new Date(shifted).getUTCHours(),phase=hour<6||hour>=22?'night':hour<11?'morning':hour<17?'afternoon':'evening';
 const nextHour=hour<6?6:hour<11?11:hour<17?17:hour<22?22:30;
 return {day:new Date(day*86400000).toISOString().slice(0,10),phase,label:({morning:'早晨 · 06–11 點',afternoon:'午後 · 11–17 點',evening:'傍晚 · 17–22 點',night:'深夜 · 22–06 點'})[phase],nextChange:day*86400000+nextHour*3600000-28800000};
}
export const residentSecrets={
 hugo:{name:'Hugo',resident:'0-3',scenes:{
 morning:{stop:0,place:'任務港的咖啡攤',title:'開店前的第一杯',intro:'Hugo 還沒掛上營業牌，正對著兩杯咖啡發呆。「今天想先替自己挑一杯，要幫我選嗎？」',choices:{a:'留一杯溫柔的奶咖',b:'選一杯清爽的黑咖啡'},endings:{a:'Hugo 捧著奶咖笑了。「先照顧好自己，才有力氣迎接大家。」',b:'Hugo 打開窗，讓海風和咖啡香一起進來。「今天也慢慢開始吧。」'}},
 afternoon:{stop:7,place:'旅行港的長椅',title:'咖啡師也有休息時間',intro:'你在旅行港遇見沒穿工作圍裙的 Hugo。他拿著一本空白筆記本：「店裡太忙，反而忘了想喝什麼。」',choices:{a:'畫下今天的海面',b:'記一個下次想試的新口味'},endings:{a:'你們畫出兩種完全不同的藍色。Hugo 把這頁叫作「休息也是正事」。',b:'Hugo 在筆記本寫下柑橘與蜂蜜。「下次來店裡，也許就喝得到。」'}},
 evening:{stop:0,place:'任務港的打烊攤位',title:'打烊後的小儀式',intro:'最後一位客人離開了，Hugo 正把椅子倒扣上桌。「你覺得，今天要怎麼收尾才好？」',choices:{a:'留下今天最好的一句話',b:'把最喜歡的杯子擦乾淨'},endings:{a:'Hugo 把「謝謝你今天也來了」貼在櫃檯邊。這是只在打烊後看得到的留言。',b:'杯子在燈下亮了一點，Hugo 說明天想把它留給第一位來客。'}},
 night:{stop:2,place:'榕樹廣場的夜燈旁',title:'沒說出口的小願望',intro:'Hugo 仰頭看著夜燈。「其實我一直想開一間，不點咖啡也能坐一會兒的店。」',choices:{a:'那就先留一張不用消費的椅子',b:'替這個願望寫一張小卡'},endings:{a:'Hugo 點點頭。「不必一下子做到全部，先從一張椅子開始。」',b:'你們寫下「給想歇腳的人」。Hugo 小心地把卡片放進口袋。'}}}},
 liv:{name:'Liv',resident:'5-4',scenes:{
 morning:{stop:5,place:'運動島的練習角落',title:'第一球不算分',intro:'Liv 只有一籃球，卻沒急著揮桿。「今天第一球，我想試試不算距離。」',choices:{a:'只注意舒服的節奏',b:'先一起伸展，再開始'},endings:{a:'球飛得不遠，但 Liv 說這次握桿沒有那麼緊了。',b:'你們先活動肩膀，笑說熱身也可以算今天的一個小勝利。'}},
 afternoon:{stop:7,place:'旅行港的步道',title:'離開球場的練習',intro:'Liv 把球袋留在球場，走到海邊。「有時候一直練，反而忘了怎麼放鬆。」',choices:{a:'聽一分鐘的海浪',b:'找一片形狀特別的葉子'},endings:{a:'你們沒有急著說話。Liv 說，下次揮桿前也想記得這種節奏。',b:'Liv 撿起一片彎彎的葉子。「原來不完美的形狀，也很有意思。」'}},
 evening:{stop:5,place:'運動島的最後一盞燈',title:'只再推最後一球',intro:'燈快熄了，Liv 蹲在練習墊邊。「這球不進也沒關係，你要幫它取個名字嗎？」',choices:{a:'叫它「今天到這裡」',b:'叫它「下次見」'},endings:{a:'球停在洞口旁。Liv 收起球桿：「好，今天到這裡。」',b:'Liv 把球放回袋子。「那就把期待留給下一次。」'}},
 night:{stop:6,place:'潮汐市集的安靜小路',title:'把比較放在一邊',intro:'Liv 看著遠處的燈。「我以前總覺得，要比別人打得好，才算喜歡這件事。」',choices:{a:'問她現在最喜歡什麼',b:'分享一件只為自己做的小事'},endings:{a:'她想了一下：「現在喜歡的，是球飛出去那一下的感覺。」',b:'你們交換了兩件不需要成績證明的小事。這條夜路變得輕了一點。'}}}},
 ari:{name:'Ari',resident:'7-4',scenes:{
 morning:{stop:7,place:'旅行港的登船口',title:'出發前的一張照片',intro:'Ari 正收起相機。「每次出發前，我都會留一張不拍自己的照片。今天要拍什麼？」',choices:{a:'拍一張還沒離岸的船',b:'拍等朋友的空長椅'},endings:{a:'Ari 說這張照片裡，裝的是還沒發生的故事。',b:'Ari 留下長椅旁的一角陽光。「也許下一次回來，這裡會坐著新朋友。」'}},
 afternoon:{stop:1,place:'港邊咖啡街的樹蔭下',title:'不在行程上的停留',intro:'Ari 坐在樹蔭下整理車票。「今天本來排滿了行程，但我決定少去一個地方。」',choices:{a:'留時間看一個地方久一點',b:'把空白留給偶然的相遇'},endings:{a:'你們在同一棵樹下，看見光影換了好幾次形狀。',b:'一位路過的居民推薦了小書店。Ari 在地圖上添了一個沒有時間表的圓圈。'}},
 evening:{stop:7,place:'旅行港的潮線旁',title:'海邊的一只空瓶',intro:'Ari 在潮線邊找到一只乾淨的空瓶。「如果一段故事可以漂到別人手上，你想送出什麼？」',choices:{a:'一句給陌生人的鼓勵',b:'一個還沒完成的小願望'},endings:{a:'Ari 把瓶口朝向海面。「一句話很小，但也許剛好有人需要。」',b:'Ari 說，願望被別人接住時，也許會長出新的形狀。'}},
 night:{stop:3,place:'山丘書屋的觀景平台',title:'寄給未來的風景',intro:'Ari 正在夜景旁寫明信片。「這張不寄給別人，我想寄給未來的自己。」',choices:{a:'提醒自己還有很多地方能去',b:'提醒自己也可以選擇留下'},endings:{a:'Ari 寫下：「別忘了，你還有很多好奇。」',b:'Ari 寫下：「停下來，也是一種抵達。」'}}}}
};
export const seaPorts={dock:{name:'訪客碼頭',x:310,y:195},travel:{name:'旅行港',x:100,y:85},sports:{name:'運動島',x:310,y:42},mba:{name:'山丘書屋',x:520,y:85}};
export const bottleThemes={warm:{name:'給陌生人的鼓勵',icon:'☀',phrases:['海風帶來一句話：今天也辛苦了。','下一站，有人替疲憊的旅人留了一張椅子。','一杯溫熱的茶，讓這段路慢了下來。','故事還沒結束，希望下一位也能被溫柔接住。']},explore:{name:'未知的旅程',icon:'⛵',phrases:['一張沒有目的地的船票，躺在瓶子裡。','沿著海邊的小路，大家發現一座沒見過的橋。','橋的另一端，有人畫了一張新的地圖。','地圖留著一塊空白，等下一位旅人添上風景。']},wish:{name:'小小願望',icon:'✦',phrases:['有人把一個還沒說出口的小願望放進瓶裡。','一位島民替它畫上星星，說不妨先試一小步。','這一小步，意外遇見了願意同行的朋友。','大家把新的期待交給海風，讓願望繼續旅行。']}};
