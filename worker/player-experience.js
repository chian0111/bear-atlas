// Presentation and native form lifecycle only; settlements remain server-authoritative.
export const playerExperienceCss=`
[data-inline-status]{position:fixed;bottom:max(18px,env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);z-index:1000;background:#fff4d6;color:#29483c;border:1px solid #b9c6ad;border-radius:14px;padding:12px 18px;width:max-content;max-width:calc(100vw - 32px)}
body{padding-top:var(--atlas-header-space,172px)!important;padding-bottom:max(16px,env(safe-area-inset-bottom))}
html{scroll-padding-top:var(--atlas-header-space,180px)}
.resort-topbar{padding-top:max(8px,env(safe-area-inset-top));padding-right:max(14px,env(safe-area-inset-right))}
.atlas-network{margin:0 auto 12px;max-width:720px;padding:12px 16px;border:1px solid #b9c6ad;border-radius:14px;background:#fff4d6;color:#365846;font-size:.9rem}
.atlas-network[hidden]{display:none}form[aria-busy=true] [type=submit]{opacity:.65;cursor:wait}
@media(max-width:639px){input,select,textarea{font-size:16px}dialog{max-width:calc(100vw - 20px);max-height:calc(100dvh - 24px);overflow-y:auto}button,summary{touch-action:manipulation}main{min-width:0}.resort-top-links a{min-width:44px}.resort-top-account{min-height:44px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto!important}}
html[data-atlas-background] .hb-stage *,html[data-atlas-background] .resort-scene *{animation-play-state:paused!important}
`;
export function playerExperienceClient(){
 const root=document.documentElement,bar=document.querySelector('.resort-topbar'),notice=document.querySelector('[data-atlas-network]');
 const measure=()=>{if(bar)root.style.setProperty('--atlas-header-space',Math.ceil(bar.getBoundingClientRect().height+18)+'px');};
 measure();if(bar&&typeof ResizeObserver!=='undefined')new ResizeObserver(measure).observe(bar);
 window.addEventListener('resize',measure);
 // Restore only a same-page task submission, with its expanded groups. Ordinary navigation keeps native behavior.
 if(typeof location!=='undefined'&&document.querySelector('[data-pocket-nav]')){
  const slot='bear-atlas-task-return';
  const reveal=target=>{for(let node=target;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;};
  const revealHash=()=>{try{if(location.hash)reveal(document.getElementById(decodeURIComponent(location.hash.slice(1))));}catch{}};
  revealHash();window.addEventListener('hashchange',revealHash);
  try{const saved=JSON.parse(sessionStorage.getItem(slot)||'null');sessionStorage.removeItem(slot);
   if(saved&&saved.path===location.pathname&&Date.now()-saved.at<120000){
    saved.open.forEach(id=>{const group=document.getElementById(id);if(group?.tagName==='DETAILS')group.open=true;});
    const target=saved.anchor&&document.getElementById(saved.anchor);reveal(target);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{measure();window.scrollTo({top:Math.max(0,target?window.scrollY+target.getBoundingClientRect().top-saved.offset:saved.y),behavior:'instant'});}));
   }
  }catch{/* Native forms stay usable when session storage is unavailable. */}
  document.addEventListener('submit',event=>{
   if(event.defaultPrevented||event.target.method?.toLowerCase()!=='post'||!event.target.checkValidity()||navigator.onLine===false)return;
   if(!location.pathname.startsWith('/dock/adventure')&&!location.pathname.startsWith('/dock/quests')&&location.pathname!=='/world/garden')return;
   try{const target=event.target.closest('[id]');sessionStorage.setItem(slot,JSON.stringify({path:location.pathname,at:Date.now(),y:window.scrollY,anchor:target?.id,offset:target?.getBoundingClientRect().top,open:[...document.querySelectorAll('details[id][open]')].map(d=>d.id)}));}catch{}
  });
 }
 // Garden actions update only the garden fragment: no page navigation or late anchor jump.
 if(typeof location!=='undefined'&&typeof fetch==='function'&&typeof DOMParser!=='undefined'&&location.pathname==='/world/garden'){
  const saving=new WeakSet();
  document.addEventListener('submit',async event=>{
   const form=event.target,plot=form.closest?.('[data-garden-slot]');
   if(event.defaultPrevented||!plot||form.method?.toLowerCase()!=='post'||!form.checkValidity()||navigator.onLine===false)return;
   event.preventDefault();if(saving.has(form))return;saving.add(form);
   const id=plot.id,offset=plot.getBoundingClientRect().top,buttons=[...form.querySelectorAll('button')];
   buttons.forEach(b=>b.disabled=true);form.setAttribute('aria-busy','true');
   const message=text=>{let note=plot.querySelector('[data-garden-live-status]');if(!note){note=document.createElement('p');note.dataset.gardenLiveStatus='';note.setAttribute('role','status');plot.append(note);}note.textContent=text;};
   try{
    const endpoint=new URL(form.getAttribute('action')||'/world/garden',location.href);
    if(endpoint.origin!==new URL(location.href).origin||endpoint.pathname!=='/world/garden')throw Error('garden-endpoint');
    const response=await fetch(endpoint.href,{method:'POST',body:new URLSearchParams(new FormData(form)),credentials:'same-origin',headers:{Accept:'text/html','X-Atlas-Fragment':'garden-plot'}});
    if(response.headers?.get('Content-Type')?.includes('application/json')){
     const data=await response.json();if(!response.ok)throw Error('garden-save');
     const parsed=new DOMParser().parseFromString(data.html+data.summary,'text/html'),fresh=parsed.querySelector('[data-garden-slot]');if(!fresh||fresh.id!==id)throw Error('garden-save');
     plot.replaceWith(fresh);const summary=parsed.querySelector('.garden-summary'),old=document.querySelector('.garden-summary');if(summary&&old)old.replaceWith(summary);window.BearI18n?.bind?.(fresh);window.BearI18n?.bind?.(summary);
     try{sessionStorage.removeItem('bear-atlas-task-return');}catch{}
     const url=new URL(data.url,location.href);url.hash='';history.replaceState(history.state,'',url);measure();window.scrollTo({top:Math.max(0,window.scrollY+fresh.getBoundingClientRect().top-offset),behavior:'instant'});return;
    }
    const parsed=new DOMParser().parseFromString(await response.text(),'text/html'),fresh=parsed.querySelector('.garden-page'),current=document.querySelector('.garden-page');
    if(!response.ok){const failure=Error('garden-save');failure.playerMessage=parsed.querySelector('.garden-page p')?.textContent;throw failure;}if(!fresh||new URL(response.url).pathname!=='/world/garden')throw Error('garden-save');
    current.replaceWith(fresh);window.BearI18n?.bind?.(fresh);
    const balance=parsed.querySelector('.bear-coin-balance'),oldBalance=document.querySelector('.bear-coin-balance');if(balance&&oldBalance)oldBalance.replaceWith(balance);
    try{sessionStorage.removeItem('bear-atlas-task-return');}catch{}
    const url=new URL(response.url);url.hash='';history.replaceState(history.state,'',url);
    const target=document.getElementById(id);measure();
    if(target)window.scrollTo({top:Math.max(0,window.scrollY+target.getBoundingClientRect().top-offset),behavior:'instant'});
   }catch(error){
    message(error.playerMessage||window.BearI18n?.t?.('garden.saveError')||(document.documentElement.lang==='en'?'Connection interrupted. Try this action again to confirm; items will not be issued twice.':'連線中斷，請再次操作確認；不會重複消耗或發放物品。'));
   }finally{saving.delete(form);buttons.forEach(b=>b.disabled=false);form.removeAttribute('aria-busy');}
  });
 }
 // Same-page bag/shop controls replace only their content and retain the clicked row.
 if(typeof fetch==='function'&&typeof DOMParser!=='undefined'&&['/dock/collection','/dock/shop','/dock/adventure'].includes(location.pathname)){
  let working=false;
  const update=async(endpoint,options,anchor)=>{
   if(working)return;working=true;
   const selector=document.querySelector('.collection-page')?'.collection-page':'.adventure';
   const current=document.querySelector(selector),height=Math.ceil(current.getBoundingClientRect().height),y=window.scrollY,offset=anchor?.getBoundingClientRect().top;
   const anchorId=anchor?.closest?.('[id]')?.id;
   current.setAttribute('aria-busy','true');
   let note=current.querySelector('[data-inline-status]');if(!note){note=document.createElement('p');note.dataset.inlineStatus='';note.setAttribute('role','status');current.prepend(note);}note.textContent=document.documentElement.lang==='en'?'Saving…':'正在更新…';
   try{
    const response=await fetch(endpoint,{...options,credentials:'same-origin',headers:{Accept:'text/html'}});
    const url=new URL(response.url),parsed=new DOMParser().parseFromString(await response.text(),'text/html'),fresh=parsed.querySelector(selector);
    if(!response.ok||url.pathname!==location.pathname||!fresh)throw Error('save');
    fresh.style.minHeight=height+'px';
    const opened=[...current.querySelectorAll('details[id][open]')].map(d=>d.id);
    const openItems=[...current.querySelectorAll('.collection-card')].filter(card=>card.querySelector('details[open]')).map(card=>card.id);
    current.replaceWith(fresh);
    const snack=fresh.querySelector('[data-snack-receipt]');if(snack){const card=snack.closest('.collection-card'),details=card?.querySelector('details');if(details)details.open=true;}
    openItems.forEach(id=>{const card=fresh.querySelector('#'+id),d=card?.querySelector('details');if(d)d.open=true;});opened.forEach(id=>{const d=document.getElementById(id);if(d)d.open=true;});window.BearI18n?.bind?.(fresh);
    const balance=parsed.querySelector('.bear-coin-balance'),old=document.querySelector('.bear-coin-balance');if(balance&&old)old.replaceWith(balance);
    history.replaceState(history.state,'',url.pathname+url.search);try{sessionStorage.removeItem('bear-atlas-task-return');}catch{}
    const oldLink=anchor?.querySelector?.('a[aria-current=page]');if(oldLink)fresh.querySelector('a[aria-current=page]')?.focus({preventScroll:true});
    const target=anchorId&&document.getElementById(anchorId);measure();
    window.scrollTo({top:Math.max(0,snack?window.scrollY+snack.getBoundingClientRect().top-(bar?.getBoundingClientRect().height||0)-120:target&&offset!==undefined?window.scrollY+target.getBoundingClientRect().top-offset:y),behavior:'instant'});
   }catch{note.textContent=document.documentElement.lang==='en'?'Unable to confirm. Try again; the same action cannot be charged twice.':'無法確認更新，請再試一次；同一筆操作不會重複扣款。';}
   finally{working=false;current.removeAttribute('aria-busy');}
  };
  document.addEventListener('click',event=>{
   const link=event.target.closest?.('.collection-nav a');if(!link||event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;
   const url=new URL(link.href,location.href);if(url.origin!==location.origin||url.pathname!==location.pathname||url.hash)return;
   event.preventDefault();update(url.href,{},link.closest('nav'));
  });
  document.addEventListener('submit',event=>{
   const form=event.target;if(event.defaultPrevented||form.method?.toLowerCase()!=='post'||!form.checkValidity()||navigator.onLine===false)return;
   const action=form.querySelector('[name=action]')?.value;
   if(location.pathname!=='/dock/adventure'&&action!=='apply'&&action!=='sell-batch')return;
   if(location.pathname==='/dock/adventure'&&action!=='claim'&&action!=='npc-setting')return;
   event.preventDefault();update(form.getAttribute('action')||location.pathname,{method:'POST',body:new URLSearchParams(new FormData(form))},form.closest('[id]')||form);
  });
 }
 const network=()=>{if(notice)notice.hidden=navigator.onLine!==false;};
 network();window.addEventListener('online',network);window.addEventListener('offline',network);
 const visibility=()=>root.toggleAttribute('data-atlas-background',document.hidden);
 visibility();document.addEventListener('visibilitychange',visibility);
 const pending=new Map();
 const reset=()=>{for(const [form,previous] of pending){if(previous===null)form.removeAttribute('aria-busy');else form.setAttribute('aria-busy',previous);}pending.clear();measure();network();};
 // Observe after existing handlers. Do not intercept fetch-backed forms or remove the
 // native submitter's name/value from FormData by disabling its button.
 document.addEventListener('submit',event=>{
  if(event.target.method?.toLowerCase()==='post'&&navigator.onLine===false){event.preventDefault();event.stopImmediatePropagation();network();notice?.focus();}
 },true);
 document.addEventListener('submit',event=>{
  const form=event.target;if(event.defaultPrevented||form.method?.toLowerCase()!=='post')return;
  if(pending.has(form)){event.preventDefault();return;}
  if(navigator.onLine===false){event.preventDefault();network();notice?.focus();return;}
  if(form.checkValidity&&!form.checkValidity())return;
  pending.set(form,form.getAttribute('aria-busy'));form.setAttribute('aria-busy','true');
 });
 window.addEventListener('pageshow',reset);
}
