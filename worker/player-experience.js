// Presentation and native form lifecycle only; settlements remain server-authoritative.
export const playerExperienceCss=`
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
