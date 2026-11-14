// Lightweight projected mesh scenes. Rendering only; no player records or game rules.
export function sportsVenueModel(kind){
 const shapes=[];
 const box=(x,z,w,d,h,color,y=0)=>shapes.push({x,z,w,d,h,color,y});
 const plant=(x,z)=>{box(x,z,.3,.3,.35,'#c4a482');box(x,z,.1,.1,.7,'#9c8966',.3);box(x,z,.65,.55,.55,'#8ca487',.8);box(x-.12,z,.4,.4,.4,'#a7ba98',1.2);};
 const bench=(x,z)=>{box(x,z,1.5,.55,.14,'#cbb08a',.52);for(const dx of[-.55,.55])box(x+dx,z,.1,.4,.52,'#8d8069');box(x,z-.24,1.5,.1,.45,'#dcc6a2',.6);};
 const indoor=['gym','table'].includes(kind);
 box(0,0,10,8,.4,'#b8a17e',-.4);box(0,0,9.95,7.95,.04,indoor?'#d7bc93':'#d5d8b7');
 if(indoor){
  for(let z=-3.8;z<4;z+=.38)box(0,z,9.9,.018,.012,'#bda77f',.045);
  for(let x=-4.5;x<5;x+=1.2)for(let z=-3.6;z<4;z+=1.5)box(x,z,.018,.36,.012,'#c5ae85',.046);
  box(-4.8,0,.18,8,2.35,'#e9e0cc');box(0,-3.8,9.6,.18,2.35,'#e3e3cc');
  box(.1,-3.67,7.8,.07,1.45,'#a2c4bd',.65);
  for(let x=-3.8;x<=4;x+=1.3)box(x,-3.55,.065,.13,1.55,'#f5ecda',.6);
  box(.1,-3.56,7.9,.18,.1,'#f1e8d2',.61);box(.1,-3.56,7.9,.18,.1,'#f1e8d2',2.08);
  box(-4.64,0,.1,7.5,.08,'#bba582',.15);plant(4,-2.8);plant(-3.8,2.8);
 }else{
  for(let x=-4.7;x<4.8;x+=.6)for(let z=-3.7;z<4;z+=.6)box(x,z,.57,.57,.015,(Math.round(x*10+z*10)%3)?'#e3dfc5':'#ece5cd',.05);
  plant(-4.1,-3);plant(4.1,-3);bench(3.5,2.9);
 }
 if(kind==='gym'){
  for(const x of[-1.6,1.2]){
   box(x,-.6,1.35,2.5,.2,'#71897e',.08);box(x,-.5,1.05,1.9,.025,'#3e5c54',.3);
   for(const dx of[-.58,.58]){box(x+dx,-1.45,.09,.12,1.15,'#93a297',.25);box(x+dx,-.55,.07,1.7,.08,'#728b7b',1.25);}
   box(x,-1.43,1.25,.16,.12,'#526e62',1.37);box(x,-1.5,.65,.2,.35,'#486b60',1.4);
   box(x,-1.37,.46,.03,.21,'#b2d5c2',1.48);
  }
  box(-3.6,-1,.5,2.9,.8,'#899583');box(-3.6,-1,.6,3,.09,'#d7c4a3',.9);
  for(let z=-2.1;z<.2;z+=.48){box(-3.6,z,.45,.07,.09,'#63796c',1);for(const dx of[-.2,.2])box(-3.6+dx,z,.13,.22,.22,'#50695e',.94);}
  box(.1,2.45,2.3,1.05,.04,'#b7bda3',.09);bench(3.5,1);box(3.8,1,.14,.14,.3,'#e6dec5',.75);
 }else if(kind==='table'){
  box(0,0,3.5,5.4,.14,'#4f8b85',.84);
  for(const x of[-1.45,1.45])for(const z of[-2.35,2.35]){box(x,z,.12,.12,.85,'#7b8a7b');box(x,z,.22,.22,.1,'#526f64',.06);}
  for(const x of[-1.68,0,1.68])box(x,0,.035,5.25,.018,'#f2ead5',.99);
  for(const z of[-2.62,2.62])box(0,z,3.4,.035,.018,'#f2ead5',.99);
  for(let x=-1.9;x<=1.9;x+=.19)box(x,0,.013,.015,.36,'#c8d7ca',1.02);
  for(const y of[1.04,1.15,1.26,1.38])box(0,0,3.9,.018,.013,'#d9e4d6',y);
  for(const x of[-1.95,1.95])box(x,0,.07,.07,.48,'#697e70',.97);
  bench(3.7,1);box(3.7,.9,.28,.38,.05,'#b48677',.8);
 }else if(kind==='pool'){
  box(-.5,-.2,6.4,5.5,.13,'#b2d3cd',.05);box(-.5,-.2,5.9,5.1,.08,'#70acae',.2);
  for(let x=-3.2;x<2.5;x+=.32)box(x,-.2,.016,4.9,.012,'#8fbfbc',.29);
  for(let z=-2.5;z<2.3;z+=.32)box(-.5,z,5.7,.016,.012,'#8fbfbc',.29);
  for(const x of[-3.65,2.65])box(x,-.2,.28,5.8,.22,'#f3e8cd',.1);
  box(-.5,2.65,6.5,.28,.22,'#eee0c0',.1);box(-.5,-3,6.5,.16,.14,'#d4e8df',.1);
  for(const z of[-1.8,.1]){box(3.65,z,1,1.6,.14,'#f4e8cf',.37);box(3.65,z-.7,1,.18,.45,'#d7c5a3',.45);}
  for(const x of[1.6,2.1])box(x,2.3,.06,.09,.72,'#a9bfb2',.2);
  for(const z of[2.08,2.34,2.6])box(1.85,z,.56,.08,.05,'#b5c9ba',.2);
 }else{
  const pickle=kind==='pickle';box(-.6,-.2,6.4,6.1,.03,pickle?'#79a7a2':'#9bb68c',.08);
  box(-.6,-.2,4.7,5.3,.015,pickle?'#a6c4b6':'#7d9b78',.12);
  for(const x of[-2.95,1.75])box(x,-.2,.045,5.35,.016,'#f6eed8',.15);
  for(const z of[-2.85,2.45])box(-.6,z,4.75,.045,.016,'#f6eed8',.15);
  for(const z of[-1.2,.8])box(-.6,z,4.7,.035,.016,'#f6eed8',.15);
  box(-.6,-.2,.035,5.3,.016,'#f6eed8',.15);
  for(const x of[-3.25,2.05])box(x,-.2,.08,.08,1.05,'#778978',.1);
  for(let x=-3.2;x<2.1;x+=.2)box(x,-.2,.01,.02,.73,'#bbcec0',.3);
  for(let y=.32;y<1.06;y+=.12)box(-.6,-.2,5.3,.018,.012,'#c5d7c8',y);
  box(-.6,-.2,5.4,.055,.045,'#f2e9cf',1.05);
  for(let x=-4.4;x<4.6;x+=1.1){box(x,-3.5,.065,.065,1.5,'#94a78c');box(x,-3.5,.025,.025,1.4,'#d0d8be');}
  box(0,-3.5,8.8,.04,.04,'#a1b49b',1.45);
 }
 return {kind,shapes,indoor};
}

export function sportsVenueClient(modelFactory){
 const dialog=document.querySelector('[data-facility-dialog]');if(!dialog)return;
 const host=dialog.querySelector('[data-facility-scene]');let dispose=()=>{};
 const init=()=>{
  dispose();const fallback=host.querySelector('svg');if(!fallback)return;
  const kind=dialog.dataset.kind,model=modelFactory(kind),canvas=document.createElement('canvas');
  let ctx;try{ctx=canvas.getContext('2d');}catch{}if(!ctx)return;
  canvas.className='sports-venue-canvas';canvas.setAttribute('role','img');canvas.setAttribute('data-i18n-aria-label','sports.scene');canvas.setAttribute('aria-label',window.BearI18n?.t('sports.scene')||'Sports venue');
  const controls=document.createElement('div');controls.className='sports-view-controls';let angle=.68,frame=0,last=0,alive=true,resize;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  for(const[key,view]of[['sports.view_left',.38],['sports.view_front',.68],['sports.view_right',1.02]]){const button=document.createElement('button');button.type='button';button.dataset.i18n=key;button.textContent=window.BearI18n?.t(key)||key;button.setAttribute('aria-pressed',String(view===angle));button.addEventListener('click',()=>{angle=view;for(const b of controls.children)b.setAttribute('aria-pressed',String(b===button));draw(0);});controls.append(button);}
  host.append(canvas,controls);
  const person=document.querySelector('[data-sports-avatar]')?.content.querySelector('svg');let image;
  if(person){const copy=person.cloneNode(true);copy.setAttribute('xmlns','http://www.w3.org/2000/svg');copy.setAttribute('width','120');copy.setAttribute('height','176');image=new Image();image.onload=()=>{if(alive)draw(0);};image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(copy));}
  function draw(time){
   if(!alive||!canvas.isConnected)return;
   const w=host.clientWidth||700,h=Math.max(260,Math.min(440,w*.63)),dpr=Math.min(devicePixelRatio||1,1.5);if(canvas.width!==Math.round(w*dpr))canvas.width=Math.round(w*dpr);if(canvas.height!==Math.round(h*dpr))canvas.height=Math.round(h*dpr);canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
   const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#d9e6dd');bg.addColorStop(.6,'#a9c9c1');bg.addColorStop(1,'#e8dfc4');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
   const c=Math.cos(angle),s=Math.sin(angle),scale=Math.min(w/15,h/10.5),project=(x,y,z)=>({x:w/2+(x*c-z*s)*scale,y:h*.52+(x*s+z*c)*scale*.44-y*scale*.84,depth:x*s+z*c});
   const faces=[];
   const polygon=(vertices,color,order)=>{const pts=vertices.map(v=>project(...v));faces.push({pts,color,order:order??pts.reduce((sum,p)=>sum+p.depth,0)/pts.length});};
   for(const o of model.shapes){const {x,z,w:ww,d,h:hh,y,color}=o;const v=[[-ww/2,0,-d/2],[ww/2,0,-d/2],[ww/2,0,d/2],[-ww/2,0,d/2],[-ww/2,hh,-d/2],[ww/2,hh,-d/2],[ww/2,hh,d/2],[-ww/2,hh,d/2]].map(p=>[x+p[0],y+p[1],z+p[2]]);
    const shade=(hex,factor)=>{const rgb=hex.slice(1).match(/../g).map(n=>Math.round(parseInt(n,16)*factor));return 'rgb('+rgb.join(',')+')';};
    for(const[ids,k]of[[[0,1,5,4],.76],[[1,2,6,5],.84],[[2,3,7,6],.93],[[3,0,4,7],.86],[[4,5,6,7],1]])polygon(ids.map(i=>v[i]),shade(color,k),ww>=9&&d>=7?-2000+y:hh<.1&&y<.2?-1000+y:undefined);
   }
   for(const o of model.shapes)if(o.h>.3&&o.y<.2&&o.w<4&&o.d<4){const points=[];for(let i=0;i<12;i++){const a=i*Math.PI/6;points.push([o.x+Math.cos(a)*(o.w*.6+.08),.06,o.z+Math.sin(a)*(o.d*.6+.08)]);}polygon(points,'#46604a1c',-999.8);}
   faces.sort((a,b)=>a.order-b.order);for(const f of faces){ctx.beginPath();f.pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=f.color;ctx.fill();}
   const active=dialog.classList.contains('is-active'),phase=active&&!motion.matches?Math.sin(time/240):0;
   if(kind==='pool'){ctx.strokeStyle='#e2f1df88';ctx.lineWidth=2;for(let i=0;i<5;i++){const p=project(-2+i*.85,.35,-.6+phase*.12);ctx.beginPath();ctx.ellipse(p.x,p.y,scale*.4,scale*.09,0,0,Math.PI*2);ctx.stroke();}}
   const position=kind==='gym'?[-1.6,.35,-.15]:kind==='table'?[.2,0,3.3]:kind==='pool'?(active?[-.7,.25,.6]:[3.1,.08,1.8]):[-.7,.1,2.9];const p=project(...position);
   ctx.fillStyle='#355d4933';ctx.beginPath();ctx.ellipse(p.x,p.y,scale*.3,scale*.1,0,0,Math.PI*2);ctx.fill();
   if(image?.complete&&image.naturalWidth){const height=scale*(kind==='pool'&&active?.85:1.45),width=height*120/176;ctx.save();if(kind==='pool'&&active){ctx.beginPath();ctx.rect(p.x-width,p.y-height,width*2,height*.85);ctx.clip();}ctx.drawImage(image,p.x-width/2,p.y-height-Math.abs(phase)*2,width,height);ctx.restore();}
   if(['table','pickle','tennis'].includes(kind)&&active){const t=(time%1000)/1000,ball=project(-.6,.8+Math.sin(t*Math.PI)*1.2,-2+4*t);ctx.fillStyle=kind==='table'?'#fff2d1':'#e7f4a7';ctx.beginPath();ctx.arc(ball.x,ball.y,kind==='table'?3:4,0,Math.PI*2);ctx.fill();}
   canvas.dataset.renderCount=String(Number(canvas.dataset.renderCount||0)+1);canvas.dataset.venue=kind;canvas.dataset.meshes=String(model.shapes.length);canvas.dataset.view=String(angle);canvas.dataset.species=person?.dataset.species||'bear';
  }
  function tick(now){if(!alive)return;if(dialog.open&&dialog.classList.contains('is-active')&&!motion.matches&&!document.hidden){if(now-last>80){draw(now);last=now;}frame=requestAnimationFrame(tick);}else frame=0;}
  const state=new MutationObserver(()=>{draw(0);if(!frame&&dialog.open&&dialog.classList.contains('is-active'))frame=requestAnimationFrame(tick);});state.observe(dialog,{attributes:true,attributeFilter:['class','open']});
  const stop=()=>{cancelAnimationFrame(frame);frame=0;};dialog.addEventListener('close',stop);const visibility=()=>{if(document.hidden)stop();else if(dialog.open)draw(0);};document.addEventListener('visibilitychange',visibility);resize=new ResizeObserver(()=>draw(0));resize.observe(host);
  const onMotion=()=>{stop();draw(0);};motion.addEventListener('change',onMotion);
  dispose=()=>{alive=false;stop();state.disconnect();resize.disconnect();dialog.removeEventListener('close',stop);document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',onMotion);};
  draw(0);fallback.style.display='none';
 };
 // Ignore our own canvas/control additions on subsequent notifications.
 const watcher=new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeName==='svg')))init();});watcher.observe(host,{childList:true});
 window.addEventListener('pagehide',()=>{dispose();watcher.disconnect();});window.addEventListener('pageshow',e=>{if(e.persisted){watcher.observe(host,{childList:true});if(dialog.open)init();}});
}
