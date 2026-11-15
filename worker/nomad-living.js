// Existing projected-scene vocabulary and fullBody portraits; no new engine or player writes.
export const nomadSeats=[
 {id:'work-a',zone:'work',x:-3.3,z:-.3,route:[[0,4.6],[0,-.1],[-3.3,-.1],[-3.3,-.3]],modes:['working','reading','resting']},
 {id:'work-b',zone:'work',x:-1.1,z:-.3,route:[[0,4.6],[0,-.1],[-1.1,-.1],[-1.1,-.3]],modes:['working','reading','resting']},
 {id:'coffee-a',zone:'coffee',x:3.8,z:-1.5,route:[[0,4.6],[0,-.1],[3.8,-.1],[3.8,-1.5]],modes:['resting','reading']},
 {id:'deck-a',zone:'deck',x:3.1,z:2.6,route:[[0,4.6],[4.2,4.6],[4.2,2.6],[3.1,2.6]],modes:['resting','stretching','daydreaming']},
 {id:'focus-a',zone:'focus',x:-3.3,z:2.7,route:[[0,4.6],[-3.3,4.6],[-3.3,2.7]],modes:['working','reading']}
];
// Only identity references / scene assignments. Backgrounds and portraits come from harborNeighbors.
export const nomadResidents=[
 {id:'1-3',x:-3.2,z:-3.1,tasks:['working','thinking','working'],prop:'laptop'},
 {id:'2-2',x:-1.1,z:-3.1,tasks:['drawing','thinking','drawing'],prop:'sketch'},
 {id:'0-3',x:2,z:-4,tasks:['drinking','thinking','drinking'],prop:'cup'},
 {id:'5-2',x:1,z:3.1,tasks:['resting','stretching','resting'],prop:'none'},
 {id:'7-1',x:-4.4,z:1,tasks:['reading','thinking','reading'],prop:'book'},
 {id:'1-0',x:-1.5,z:2.2,tasks:['thinking','reading','thinking'],prop:'book'}
];
export function nomadProject(x,z,h=0){return {x:500+(x-z)*38.1,y:350+(x+z)*18.5-h*37.4};}
export function nomadLivingModel(){
 const boxes=[];const box=(x,z,w,d,h,color,y=0)=>boxes.push({x,z,w,d,h,color,y});
 box(0,0,11.5,10.5,.3,'#ae916c',-.3);box(0,0,11.5,10.5,.06,'#d3b58a');
 for(let z=-5;z<=5;z+=.4)box(0,z,11.3,.018,.015,'#b99a70',.06);
 const plant=(x,z)=>{box(x,z,.45,.45,.4,'#ba9a73',.06);box(x,z,.1,.1,.65,'#9b8a5d',.4);box(x,z,.8,.55,.35,'#86a478',.9);box(x-.15,z-.1,.55,.45,.4,'#9db687',1.1);};
 for(const[x,z]of[[-5,-4.5],[4.8,-4.5],[-5,3.9],[4.9,3.8],[.2,-3.8]])plant(x,z);
 // Bamboo posts and rear roof canopy keep the view open to seats.
 for(const[x,z]of[[-5,-4.7],[.1,-4.7],[5,-4.7]]){box(x,z,.13,.13,3.3,'#bca06b',.06);box(x,z,.2,.2,.1,'#e5cb91',2.2);}
 box(0,-4.7,10.3,.17,.16,'#c8ad76',3.2);box(0,-4.1,11,2.1,.18,'#bda673',3.45);
 for(let x=-5.4;x<5.5;x+=.34)box(x,-4.1,.045,2.1,.04,'#d9c590',3.65);
 // Shared table, legs, laptops and books.
 box(-2.2,-1.8,3.6,1.25,.13,'#e0c699',.84);
 for(const x of[-3.7,-.7])for(const z of[-2.2,-1.4])box(x,z,.12,.12,.84,'#a38a62');
 for(const x of[-3.2,-1.1]){box(x,-1.8,.65,.45,.045,'#6f8e80',1);box(x,-2,.65,.06,.45,'#779c91',1);box(x,-1.965,.5,.025,.3,'#bdd7c2',1.08);}
 box(-2.1,-1.5,.5,.38,.06,'#e7e0c5',1);box(-2.2,-1.47,.025,.35,.01,'#a28b67',1.065);
 // Coffee bar, machine, cups and glass-front dessert case.
 box(2.5,-3,3,.9,1.1,'#b69a6c');box(2.5,-3,3.2,1.05,.12,'#ddc39a',1.1);
 box(1.6,-3,.65,.55,.65,'#5c786c',1.22);box(1.6,-2.7,.45,.08,.22,'#abc3b2',1.5);
 box(3.2,-3,1.05,.6,.5,'#b6d0c0',1.22);box(3.2,-2.68,1.1,.06,.07,'#e8e6cc',1.73);
 for(const x of[2.1,2.4])box(x,-2.8,.16,.16,.2,'#fcf3d9',1.22);
 for(const x of[2.9,3.2,3.5])box(x,-2.85,.19,.21,.17,'#c99579',1.25);
 // Individual focus desk and writing corner.
 box(-3.3,1.6,1.45,.7,.12,'#d9bf94',.8);for(const x of[-3.85,-2.75])box(x,1.6,.1,.6,.8,'#aa9168');
 box(-3.3,1.6,.6,.36,.05,'#d7dfca',.93);box(-3.3,1.45,.6,.06,.35,'#78978b',.93);
 box(-4.4,.2,1,.55,.12,'#ceb48c',.8);box(-1.5,1.4,1,.55,.12,'#ceb48c',.8);
 // Shallow water feature and loungers, never part of a navigation route.
 box(1.1,1.2,1.15,1.15,.18,'#b7c4a9',.06);box(1.1,1.2,.93,.93,.04,'#86b7b1',.25);
 for(const s of nomadSeats){box(s.x,s.z,.7,.65,.12,'#c5a87b',.4);box(s.x,s.z-.27,.73,.08,.55,'#dec99f',.45);for(const x of[-.23,.23])box(s.x+x,s.z,.08,.45,.4,'#ac946d');}
 box(3.1,3.25,.8,1.7,.12,'#d8c39b',.28);box(3.1,3.9,.8,.14,.45,'#e6d5ae',.4);
 return {boxes,obstacles:[{x:-2.2,z:-1.8,w:3.6,d:1.25},{x:2.5,z:-3,w:3.2,d:1.05},{x:-3.3,z:1.6,w:1.45,d:.7},{x:1.1,z:1.2,w:1.15,d:1.15}]};
}
export function nomadTransition(state,event,seats){
 const s={...state};
 if(event.type==='seat'){
  const seat=seats.find(x=>x.id===event.id);if(!seat||s.moving||s.seat)return state;
  return {...s,moving:true,target:seat.id,mode:'walking'};
 }
 if(event.type==='arrive'){
  if(!s.moving)return state;const seat=seats.find(x=>x.id===s.target);
  return {...s,moving:false,seat:seat?.id||null,target:null,mode:seat?(seat.zone==='focus'?'working':'resting'):'standing'};
 }
 if(event.type==='mode'){
  const seat=seats.find(x=>x.id===s.seat);if(s.moving||!seat?.modes.includes(event.mode))return state;return {...s,mode:event.mode};
 }
 if(event.type==='leave'&&s.seat&&!s.moving)return {...s,moving:true,target:null,seat:null,mode:'walking'};
 return state;
}
export function nomadNpcTask(tasks,elapsed,index){return tasks[Math.floor(Math.max(0,elapsed)/12000+index)%tasks.length];}
export function nomadLivingArt(){
 const {boxes}=nomadLivingModel(),faces=[];
 const shade=(hex,f)=>'#'+hex.slice(1).match(/../g).map(c=>Math.round(parseInt(c,16)*f).toString(16).padStart(2,'0')).join('');
 for(const b of boxes){const v=[[-1,0,-1],[1,0,-1],[1,0,1],[-1,0,1],[-1,1,-1],[1,1,-1],[1,1,1],[-1,1,1]].map(([x,y,z])=>[b.x+x*b.w/2,b.z+z*b.d/2,b.y+y*b.h]);
  for(const [ids,f]of[[[0,1,5,4],.8],[[1,2,6,5],.84],[[2,3,7,6],.91],[[3,0,4,7],.87],[[4,5,6,7],1]]){const pts=ids.map(i=>nomadProject(...v[i]));faces.push({depth:b.w>10?-100+b.y:b.h<.03?-90+b.y:b.x+b.z,art:'<polygon points="'+pts.map(p=>p.x+','+p.y).join(' ')+'" fill="'+shade(b.color,f)+'"/>'});}
 }
 const water=nomadProject(1.1,1.2,.3);
 return '<svg class="nomad-room-art" viewBox="0 0 1000 600" aria-hidden="true"><defs><linearGradient id="nomad-light" x2="1" y2="1"><stop stop-color="#e8ead3"/><stop offset="1" stop-color="#b3d1c4"/></linearGradient></defs><rect width="1000" height="600" fill="url(#nomad-light)"/><ellipse cx="500" cy="440" rx="340" ry="160" fill="#59755d" opacity=".1"/>'+faces.sort((a,b)=>a.depth-b.depth).map(f=>f.art).join('')+'<g class="nomad-water" fill="none" stroke="#e8f1dc" stroke-width="2"><ellipse cx="'+water.x+'" cy="'+water.y+'" rx="21" ry="8"/><ellipse cx="'+water.x+'" cy="'+water.y+'" rx="12" ry="4"/></g>'+[[-5,3.9],[4.9,3.8]].map(([x,z])=>{const p=nomadProject(x,z,1.4);return '<g class="nomad-leaves" transform="translate('+p.x+' '+p.y+')"><path d="M0 0Q-50-65-35-5Q-16-17 0 0Q15-73 24-22Q15-8 0 0Q63-49 42-3Q16-12 0 0" fill="#6f956c"/></g>';}).join('')+'</svg>';
}
export const nomadLivingCss=`
main:has([data-nomad-living]){width:min(100%,1120px)}.nomad-living{color:#365345}.nomad-living h1{margin-bottom:8px}.nomad-living button,.nomad-living summary{min-height:44px}.nomad-zone-tabs,.nomad-seat-list,.nomad-mode-list{display:flex;gap:8px;flex-wrap:wrap}.nomad-zone-tabs button[aria-pressed=true]{background:#315744;color:#fff8e7}.nomad-scroll{overflow:auto;border-radius:22px;border:1px solid #bdcbb0;margin:14px 0;overscroll-behavior-x:contain}.nomad-room{width:100%;min-width:700px;aspect-ratio:1000/600;position:relative;isolation:isolate}.nomad-room-art{width:100%;height:100%;display:block}.nomad-avatar{position:absolute;left:var(--nx);top:var(--ny);width:48px;transform:translate(-50%,-100%);pointer-events:none;z-index:3;filter:drop-shadow(1px 3px 2px #35533b30)}.nomad-avatar>svg{width:100%;height:auto;overflow:visible}.nomad-player{width:54px}.nomad-avatar[data-mode=walking] .bear-leg{animation:bear-step .4s infinite alternate}.nomad-avatar[data-mode=working] .bear-arm,.nomad-avatar[data-mode=drawing] .bear-arm-right{animation:nomad-type 1s ease-in-out infinite alternate}.nomad-avatar[data-mode=reading]>svg,.nomad-avatar[data-mode=thinking]>svg{animation:nomad-think 7s ease-in-out infinite}.nomad-avatar .bear-arm{transition:rotate 1s ease-in-out}.nomad-avatar[data-mode=drinking] .bear-arm-right{animation:nomad-npc-sip 6s ease-in-out infinite}.nomad-avatar[data-mode=drinking] .nomad-mug{animation:nomad-npc-mug 6s ease-in-out infinite}.nomad-avatar[data-mode=stretching] .bear-arm-left{rotate:125deg}.nomad-avatar[data-mode=stretching] .bear-arm-right{rotate:-125deg}.nomad-avatar[data-seated=true] .bear-leg{rotate:-65deg;transform-box:fill-box;transform-origin:50% 0}.nomad-avatar[data-mode=stretching] .bear-leg{rotate:0}.nomad-prop{position:absolute;bottom:15px;left:20px;font-size:24px;line-height:1;display:none}.nomad-avatar[data-mode=reading] .nomad-book,.nomad-avatar[data-mode=drawing] .nomad-sketch,.nomad-avatar[data-mode=working] .nomad-laptop,.nomad-avatar[data-mode=drinking] .nomad-mug{display:block}.nomad-seat-pin{position:absolute;left:var(--nx);top:var(--ny);transform:translate(-50%,8px);min-width:44px;min-height:44px;padding:5px 9px;border-radius:14px;background:#fff6ddeb;font-size:12px;z-index:6;border:1px solid #a9b89b}.nomad-seat-pin[data-nomad-seat=work-b]{transform:translate(-50%,24px)}.nomad-seat-pin[aria-pressed=true]{background:#315744;color:#fff}.nomad-seat-pin:focus-visible{outline:3px solid #a57844;outline-offset:3px}.nomad-controls{position:sticky;bottom:8px;z-index:8;padding:14px;border:1px solid #bdcbb0;border-radius:18px;background:#fff9eff7;box-shadow:0 4px 24px #31533c15}.nomad-status-line{min-height:1.8em}.nomad-panel{margin:14px 0;padding:16px;background:#f2f1e3;border-radius:18px}.nomad-panel[hidden],.nomad-living [hidden]{display:none!important}.nomad-options{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin:12px 0}.nomad-options label{display:flex;align-items:center;gap:8px;min-height:44px}.nomad-options input{min-height:22px;width:22px;height:22px}.nomad-residents{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.nomad-residents a{padding:10px;border:1px solid #c5cdb5;border-radius:12px;min-height:44px}.nomad-residents small{margin:4px 0}.nomad-leaves{animation:nomad-leaf 7s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}.nomad-water{animation:nomad-ripple 6s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}.nomad-living.is-quiet *,.nomad-living.is-hidden *{animation-play-state:paused!important;transition:none!important}.nomad-living.is-quiet .nomad-water{opacity:.6}.nomad-player .town-cup{position:absolute;right:-8px;bottom:17px;width:25px;height:25px;font-size:22px}.nomad-player .resort-drink-art{width:25px;height:25px}.nomad-player .town-cup:has(.resort-drink-art)::before{content:'';position:absolute;left:10px;top:-10px;width:5px;height:12px;border-left:2px solid #fff7dd;border-radius:50%;animation:nomad-steam 3s ease-in-out infinite;opacity:.8}.nomad-player.is-sipping .town-cup{animation:nomad-sip 2s ease-in-out both}.nomad-player:not(.is-sipping) .resort-drink-art{animation:nomad-steam 4s ease-in-out infinite}.nomad-living .town-drinks{display:flex;gap:8px;flex-wrap:wrap}.nomad-help{font-size:.85rem;color:#65765c}
@keyframes nomad-npc-sip{40%,65%{rotate:-45deg}}@keyframes nomad-npc-mug{40%,65%{translate:-10px -13px;rotate:-10deg}}@keyframes nomad-type{to{rotate:12deg;translate:0 -2px}}@keyframes nomad-think{50%{rotate:2deg}}@keyframes nomad-leaf{to{rotate:3deg}}@keyframes nomad-ripple{to{scale:1.15;opacity:.4}}@keyframes nomad-sip{35%,70%{transform:translate(-17px,-18px) rotate(-12deg)}}@keyframes nomad-steam{50%{translate:0 -2px}}
@media(max-width:600px){.nomad-zone-tabs button{flex:1 1 42%;font-size:.85rem}.nomad-residents{grid-template-columns:1fr 1fr}.nomad-controls{bottom:4px;padding:10px}.nomad-help{font-size:.78rem}.nomad-mode-list button{flex:1 1 40%}}
@media(prefers-reduced-motion:reduce){.nomad-living *{animation:none!important;transition:none!important}}
`;
export function nomadLivingMarkup(portrait,residents){
 const txt=(key,zh,tag='p')=>'<'+tag+' data-i18n="nomadLive.'+key+'">'+zh+'</'+tag.split(' ')[0]+'>';
 const labels={work:'共享工作區',coffee:'咖啡角落',deck:'放空露台',focus:'專注角落'};
 const pos=(x,z,h=0)=>{const p=nomadProject(x,z,h);return '--nx:'+p.x/10+'%;--ny:'+p.y/6+'%';};
 const props='<span class="nomad-prop nomad-book">📖</span><span class="nomad-prop nomad-sketch">🎨</span><span class="nomad-prop nomad-laptop">💻</span><span class="nomad-prop nomad-mug">☕</span>';
 return '<style>'+nomadLivingCss+'</style><section class="nomad-living" data-nomad-living data-nomad-phase="open" data-town-cafe><small>BEAR ATLAS · V86.3</small>'+txt('title','Nomad House｜熊熊遊牧工作屋','h1')+txt('welcome','工作、閱讀，或只是和大家待在一起。今天不需要完成任何事。')+'<a class="scene-return" href="/world?at=12" data-i18n="nomadLive.back">← 回渡假村</a><div class="nomad-zone-tabs" role="group" data-i18n-aria-label="nomadLive.zones" aria-label="四個生活區域">'+Object.entries(labels).map(([id,label])=>'<button type="button" data-nomad-zone="'+id+'" aria-pressed="'+(id==='work')+'" data-i18n="nomadLive.'+id+'">'+label+'</button>').join('')+'</div>'+txt('panHelp','手機可左右滑動場景，或使用區域按鈕找到座位。','p class="nomad-help"')+'<div class="nomad-scroll" tabindex="0" data-i18n-aria-label="nomadLive.scene" aria-label="熱帶共享工作屋場景"><div class="nomad-room">'+nomadLivingArt()+nomadResidents.map((slot,i)=>'<span class="nomad-avatar" data-nomad-npc="'+slot.id+'" data-npc-index="'+i+'" data-mode="'+slot.tasks[0]+'" data-seated="'+(!['5-2','1-0','0-3'].includes(slot.id))+'" style="'+pos(slot.x,slot.z,.15)+'" aria-hidden="true">'+residents[i].portrait+props+'</span>').join('')+'<span class="nomad-avatar nomad-player town-drinker" data-nomad-player data-mode="standing" data-seated="false" style="'+pos(0,4.6)+'" aria-hidden="true">'+portrait+props+'<span class="town-cup"></span></span>'+nomadSeats.map((s,i)=>'<button type="button" class="nomad-seat-pin" data-nomad-seat="'+s.id+'" data-seat-zone="'+s.zone+'" style="'+pos(s.x,s.z)+'" aria-pressed="false" data-i18n="nomadLive.seat'+i+'">'+['工作座位 A','工作座位 B','咖啡藤椅','露台躺椅','安靜座位'][i]+'</button>').join('')+'</div></div><div class="nomad-options"><label><input type="checkbox" data-nomad-quiet>'+txt('quiet','減少動畫與聲音','span')+'</label><button type="button" data-nomad-sound aria-pressed="false" data-i18n="nomadLive.soundOff">環境音：關閉</button></div><section class="nomad-controls" aria-label="Nomad House"><p class="nomad-status-line" data-nomad-status role="status" data-i18n="nomadLive.choose">選一個空位，慢慢坐下。</p><div class="nomad-seat-list">'+nomadSeats.map((s,i)=>'<button type="button" data-nomad-seat="'+s.id+'" data-seat-zone="'+s.zone+'" data-i18n="nomadLive.seat'+i+'">'+['工作座位 A','工作座位 B','咖啡藤椅','露台躺椅','安靜座位'][i]+'</button>').join('')+'</div><div class="nomad-mode-list" hidden>'+[['working','工作'],['reading','閱讀'],['resting','休息'],['stretching','伸展'],['daydreaming','放空']].map(([id,label])=>'<button type="button" data-nomad-mode="'+id+'" data-i18n="nomadLive.'+id+'">'+label+'</button>').join('')+'<button type="button" data-nomad-leave data-i18n="nomadLive.leave">起身離開座位</button></div><button type="button" data-nomad-stroll data-i18n="nomadLive.stroll">沿著走道散步</button></section>'+Object.entries(labels).map(([id,label])=>'<section class="nomad-panel" data-nomad-panel="'+id+'"'+(id==='work'?'':' hidden')+'>'+txt(id,label,'h2')+txt(id+'Note',({work:'竹屋頂下的長桌留著筆電與書本。點空位坐下，再選想做的事。',coffee:'沿用海邊咖啡館的虛擬飲品。先取一杯，想喝時再喝一口。',deck:'木露台、藤椅與小水景，陪你伸個懶腰，或什麼都不想。',focus:'獨立座位適合安靜工作或閱讀。可以開啟「減少動畫與聲音」。'})[id])+(id==='coffee'?'<div class="town-drinks" role="group" data-i18n-aria-label="nomadLive.drinks" aria-label="選擇虛擬飲品"><button type="button" data-town-drink="熱咖啡">熱咖啡</button><button type="button" data-town-drink="花草茶">花草茶</button><button type="button" data-town-drink="熱可可">熱可可</button></div><p data-town-status role="status">選好飲料後就能開始。</p><button type="button" data-town-sip hidden>喝一口</button><button type="button" data-town-again hidden>再選一杯</button>':'')+'</section>').join('')+txt('neighbours','今天在這裡的居民','h2')+'<div class="nomad-residents">'+nomadResidents.map((slot,i)=>'<a href="/islands/neighbors/'+slot.id+'"><span data-user-content>'+residents[i].name+'</span><small data-i18n="nomadLive.'+slot.tasks[0]+'" data-nomad-task="'+slot.id+'">'+({working:'工作',drawing:'畫圖',drinking:'喝咖啡',reading:'閱讀',resting:'休息',thinking:'思考'})[slot.tasks[0]]+'</small></a>').join('')+'</div><script type="application/json" data-nomad-seats>'+JSON.stringify(nomadSeats)+'</script><script type="application/json" data-nomad-residents>'+JSON.stringify(nomadResidents)+'</script><script src="/town-life.js?v=nomad863" defer></script><script src="/nomad-life.js?v=863.3" defer></script></section>';
}
export function nomadLivingClient(project,transition,npcTask){
 const root=document.querySelector('[data-nomad-living]');if(!root)return;
 const seats=JSON.parse(root.querySelector('[data-nomad-seats]').textContent),residents=JSON.parse(root.querySelector('[data-nomad-residents]').textContent),player=root.querySelector('[data-nomad-player]'),status=root.querySelector('[data-nomad-status]'),quiet=root.querySelector('[data-nomad-quiet]'),soundButton=root.querySelector('[data-nomad-sound]'),scroll=root.querySelector('.nomad-scroll'),room=root.querySelector('.nomad-room'),modes=root.querySelector('.nomad-mode-list'),seatList=root.querySelector('.nomad-seat-list'),stroll=root.querySelector('[data-nomad-stroll]'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 let state={seat:null,moving:false,target:null,mode:'standing'},position=[0,4.6],frame=0,segment=0,queue=[],start=0,from=position,active=true,zone='work',audio=null,noise=null,gain=null,sound=false,npcTimer=0,npcRunning=false,npcElapsed=0,npcStarted=performance.now();
 const translate=(key)=>window.BearI18n?.t('nomadLive.'+key)||key;
 function place(x,z){position=[x,z];const p=project(x,z,state.seat?(state.seat.startsWith('deck')?0.12:0.28):0);player.style.setProperty('--nx',p.x/10+'%');player.style.setProperty('--ny',p.y/6+'%');}
 function draw(){
  player.dataset.mode=state.mode;player.dataset.seated=String(!!state.seat);player.style.zIndex=String(30+Math.round(position[0]+position[1]));
  for(const button of root.querySelectorAll('[data-nomad-seat]')){button.disabled=state.moving||!!state.seat;button.setAttribute('aria-pressed',String(button.dataset.nomadSeat===state.seat));if(button.closest('.nomad-seat-list'))button.hidden=button.dataset.seatZone!==zone;}
  seatList.hidden=!!state.seat;modes.hidden=!state.seat;stroll.disabled=state.moving||!!state.seat;
  const seat=seats.find(s=>s.id===state.seat);for(const b of modes.querySelectorAll('[data-nomad-mode]')){b.hidden=!seat?.modes.includes(b.dataset.nomadMode);b.disabled=state.moving;b.setAttribute('aria-pressed',String(b.dataset.nomadMode===state.mode));}root.querySelector('[data-nomad-leave]').disabled=state.moving;
  status.removeAttribute('data-i18n');status.textContent=translate(state.moving?'walking':state.seat?state.mode:'choose');
 }
 function arrive(){state=transition(state,{type:'arrive'},seats);place(...position);draw();}
 function tick(now){if(!active||document.hidden)return;if(!start)start=now;const dest=queue[segment],duration=Math.max(260,Math.min(1000,Math.hypot(dest[0]-from[0],dest[1]-from[1])*210)),t=motion.matches||quiet.checked?1:Math.min(1,(now-start)/duration);place(from[0]+(dest[0]-from[0])*t,from[1]+(dest[1]-from[1])*t);if(t===1){segment++;from=[...position];start=0;if(segment===queue.length){arrive();frame=0;return;}}frame=requestAnimationFrame(tick);}
 function travel(points){cancelAnimationFrame(frame);queue=points;segment=0;from=[...position];start=0;if(motion.matches||quiet.checked){place(...points.at(-1));arrive();}else frame=requestAnimationFrame(tick);}
 function selectZone(id){zone=id;for(const b of root.querySelectorAll('[data-nomad-zone]'))b.setAttribute('aria-pressed',String(b.dataset.nomadZone===zone));for(const p of root.querySelectorAll('[data-nomad-panel]'))p.hidden=p.dataset.nomadPanel!==zone;const target=root.querySelector('[data-seat-zone="'+id+'"]');if(target){const x=Number.parseFloat(target.style.getPropertyValue('--nx'))/100*room.clientWidth;scroll.scrollTo({left:Math.max(0,x-scroll.clientWidth/2),behavior:motion.matches?'instant':'smooth'});}draw();}
 root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.nomadZone){selectZone(b.dataset.nomadZone);return;}
  if(b.dataset.nomadSeat){const next=transition(state,{type:'seat',id:b.dataset.nomadSeat},seats);if(next===state)return;const seat=seats.find(s=>s.id===next.target);state=next;selectZone(seat.zone);travel(seat.route);return;}
  if(b.dataset.nomadMode){state=transition(state,{type:'mode',mode:b.dataset.nomadMode},seats);draw();return;}
  if(b.hasAttribute('data-nomad-leave')){const seat=seats.find(s=>s.id===state.seat),next=transition(state,{type:'leave'},seats);if(next===state)return;state=next;draw();travel([...seat.route].reverse());return;}
  if(b===stroll&&!state.seat&&!state.moving){state={...state,moving:true,target:null,mode:'walking'};draw();travel([[0,4.6],[0,-.1],[0,4.6]]);}
 });
 function audioLabel(){soundButton.dataset.i18n='nomadLive.'+(sound?'soundOn':'soundOff');soundButton.textContent=translate(sound?'soundOn':'soundOff');soundButton.setAttribute('aria-pressed',String(sound));}
 function mute(){sound=false;if(audio)audio.suspend().catch(()=>{});audioLabel();}
 soundButton.addEventListener('click',async()=>{if(sound){mute();return;}if(quiet.checked||motion.matches){status.textContent=translate('quietSound');return;}try{if(!audio){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error('audio');audio=new Audio();const buffer=audio.createBuffer(1,audio.sampleRate*2,audio.sampleRate),samples=buffer.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*.3;noise=audio.createBufferSource();noise.buffer=buffer;noise.loop=true;const filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.value=340;gain=audio.createGain();gain.gain.value=.075;noise.connect(filter);filter.connect(gain);gain.connect(audio.destination);noise.start();}await audio.resume();if(!active||document.hidden||quiet.checked||motion.matches){mute();return;}sound=true;audioLabel();}catch{mute();status.textContent=translate('audioUnavailable');}});
 function stopNpc(){clearTimeout(npcTimer);npcTimer=0;if(npcRunning)npcElapsed+=performance.now()-npcStarted;npcRunning=false;}
 function updateNpcs(){if(!active||document.hidden||quiet.checked||motion.matches)return;const elapsed=npcElapsed+performance.now()-npcStarted;residents.forEach((r,i)=>{const task=npcTask(r.tasks,elapsed,i),actor=root.querySelector('[data-nomad-npc="'+r.id+'"]'),label=root.querySelector('[data-nomad-task="'+r.id+'"]');actor.dataset.mode=task;label.dataset.i18n='nomadLive.'+task;label.textContent=translate(task);});npcTimer=setTimeout(updateNpcs,4000);}
 function resumeNpc(){clearTimeout(npcTimer);npcStarted=performance.now();npcRunning=true;updateNpcs();}
 function quietChange(){stopNpc();root.classList.toggle('is-quiet',quiet.checked||motion.matches);if(quiet.checked||motion.matches){mute();player.classList.remove('is-sipping');}else resumeNpc();try{localStorage.setItem('bear-nomad-quiet',String(quiet.checked));}catch{}}
 try{quiet.checked=localStorage.getItem('bear-nomad-quiet')==='true';}catch{}if(motion.matches)quiet.checked=true;
 quiet.addEventListener('change',quietChange);motion.addEventListener('change',quietChange);
 function visibility(){root.classList.toggle('is-hidden',document.hidden);if(document.hidden){cancelAnimationFrame(frame);start=0;from=[...position];stopNpc();mute();}else if(active){if(state.moving)frame=requestAnimationFrame(tick);if(!quiet.checked&&!motion.matches)resumeNpc();}}
 document.addEventListener('visibilitychange',visibility);window.addEventListener('bear-locale-change',()=>{draw();audioLabel();});
 window.addEventListener('pagehide',()=>{active=false;cancelAnimationFrame(frame);stopNpc();mute();});window.addEventListener('pageshow',e=>{if(e.persisted){active=true;visibility();draw();}});
 root.addEventListener('animationend',e=>{if(e.animationName==='nomad-sip')player.classList.remove('is-sipping');});
 quietChange();selectZone('work');draw();
}
