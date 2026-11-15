// Explicit release phase; no date-based unlocks or player-data writes.
export const nomadSite=Object.freeze({phase:'structure',bounds:Object.freeze({left:414,right:530,top:164,bottom:215}),approach:Object.freeze({x:470,y:240})});
export function nomadBuildModel(phase='structure'){
 if(!['construction','structure'].includes(phase))throw Error('Unsupported Nomad House phase');
 const boxes=[],roof=[],palms=[];
 const add=(x,y,w,d,h,color,base=9)=>boxes.push({x,y,w,d,h,color,base});
 if(phase==='structure'){
  add(472,190,65,61,5,'ba9565');add(472,190,64,60,1,'d1b286',14);
  for(let i=-3;i<=3;i++)add(472+i*7,190,1,59,.5,'ad8e62',15);
  // Screen-space centers follow the same projection as existing buildings.
  for(const[x,y]of[[432,190],[472,171],[512,190],[472,209]]){add(x,y,3,3,44,'c2a36c',15);add(x,y,4,4,2,'e3cc97',32);}
  add(452,181,48,3,3,'cbb077',56);add(492,181,3,48,3,'cbb077',56);
  add(452,200,3,48,3,'bda06a',56);add(492,200,48,3,3,'bda06a',56);
  // One finished thatch slope, one exposed bamboo roof frame.
  roof.push({x:472,y:190,base:59,width:72,depth:66,rise:18});
  // A walkway is visible but remains closed at the existing fence.
  for(let i=0;i<3;i++)add(472,218+i*6,13,8,2,'c7a77a',7);
  // Staged rattan seating: wrapped seat and an unfinished shared table.
  add(481,194,22,12,3,'d8bc8c',28);for(const dx of[-7,7])add(481+dx,194,2,7,16,'a89163',12);
  for(const[x,y]of[[452,199],[496,193]]){add(x,y,11,10,3,'c2a273',22);add(x-3,y-2,11,2,10,'ddc292',25);add(x,y,2,2,10,'9f8b61',12);}
  // Scaffolding and cross rails stay inside the original parcel.
  for(const[x,y]of[[424,188],[444,178],[444,198],[464,188]])add(x,y,2,2,55,'9b9375');
  for(const level of[28,47]){add(434,183,28,2,2,'c0b597',level);add(434,193,2,28,2,'b4aa8b',level);}
  add(434,188,24,20,2,'c9ba98',31);
  for(let i=0;i<4;i++)add(513,198,17,3,2,'c5a077',9+i*2);
  palms.push({x:417,y:192,height:44},{x:524,y:194,height:47});
 }
 return {phase,boxes,roof,palms};
}
export function nomadStructureArt(){
 return `<g data-nomad-structure="bamboo-frame"><ellipse cx="472" cy="201" rx="57" ry="20" fill="#526b4c" opacity=".16"/><path d="m422 190 50-24 50 24-50 25z" fill="#d1b286" stroke="#aa8558" stroke-width="2"/><path d="m422 190 50 25 50-25v6l-50 25-50-25z" fill="#aa8558"/>
 <path d="M432 189v-45m40 64v-45m40 26v-45m-40 25v-45" stroke="#c9aa73" stroke-width="4"/>
 <path d="m425 143 47-23 47 23-47 23z" fill="none" stroke="#d4b780" stroke-width="4"/><path d="m425 143 47-40 47 40-47 23z" fill="#bda777"/><path d="m472 103 47 40-47 23z" fill="#d6c28e"/>
 <path d="m430 144 42-35m-29 41 29-29m-15 36 15-24m0-30v62" fill="none" stroke="#dfca92" stroke-width="2"/><path d="m425 143 47-40 47 40M472 103v63" fill="none" stroke="#a78e60" stroke-width="2"/>
 <g data-nomad-scaffold stroke="#a69b7c" stroke-width="2" fill="none"><path d="M422 194v-58m23 48v-58m-23 27 23-11m-23 31 23-11m-23 32 23-58m-23 10 23 48"/><path d="m419 172 26-12 8 4-27 13z" fill="#c3b28b"/></g>
 <path d="m455 191 22-11 19 9-22 11z" fill="#dcc494"/><path d="M459 195v12m32-13v12" stroke="#9c865a" stroke-width="2"/><g fill="#cfb184" stroke="#a38b60"><path d="m449 195 10 5v6l-10-5zm48-11 10 5v6l-10-5z"/></g>
 <g data-nomad-tropical fill="#6e936d" stroke="#769570" stroke-width="2"><path d="M418 198q9-22 4-48m102 49q-9-22-4-48" fill="none" stroke="#ae9467" stroke-width="4"/><path d="M422 151q-23-15-26 0 17-5 26 0-8-24 3-25 8 11-3 25 22-18 28-3-17-3-28 3zm98 1q-23-15-26 0 17-5 26 0-8-24 3-25 8 11-3 25 22-18 28-3-17-3-28 3z"/></g></g>`;
}
export const nomadStyles=`
.hb-stage[data-3d-ready] [data-nomad-engineer],.hb-stage[data-3d-ready] [data-nomad-engineer] *,.hb-stage[data-3d-ready] .nomad-arm,.hb-stage[data-3d-ready] .nomad-arm *{visibility:visible}
main:has(.nomad-copy){width:min(100%,900px)}.nomad-preview figcaption{padding:10px 14px;font-size:.85rem}
.nomad-arm{transform-box:fill-box;transform-origin:12% 80%;animation:nomad-dig 9s ease-in-out infinite}.nomad-preview{margin:0;background:#d5dfc6;border-radius:18px;overflow:hidden}.nomad-preview svg{display:block;width:100%;height:auto}.nomad-copy{max-width:760px;margin:auto}.nomad-copy p{line-height:1.9}.nomad-zones{display:grid;grid-template-columns:1fr 1fr;gap:12px}.nomad-zones article{padding:15px;background:#f7f1df;border:1px solid #c8cfb7;border-radius:14px}.nomad-zones h2{font-size:1rem}.nomad-status{padding:12px;border-left:4px solid #b79754;background:#f4ebcf}.nomad-copy a{min-height:44px;display:inline-flex;align-items:center}.nomad-stop{animation-play-state:paused!important}
@keyframes nomad-dig{0%,35%,100%{transform:rotate(0)}55%,72%{transform:rotate(9deg)}}
.resort-map[data-paused=true] .nomad-arm,.resort-map:has(dialog[open]) .nomad-arm{animation-play-state:paused}
@media(max-width:540px){.nomad-zones{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.nomad-arm{animation:none}}
`;
export function nomadConstructionArt(portrait='',phase=nomadSite.phase){
 if(!['construction','structure'].includes(phase))throw Error('Unsupported Nomad House phase');
 const art= `<g data-nomad-parcel="construction"><ellipse cx="474" cy="202" rx="63" ry="24" fill="#53694d" opacity=".18"/><path d="m414 190 58-28 58 28-58 28z" fill="#c9ad7d"/><path d="m414 190 58 28 58-28v6l-58 28-58-28z" fill="#a78a61"/>
 <g stroke="#a98a60" stroke-width="3" fill="none"><path d="M416 187v-15m28 1v-15m28 1v-15m29 29v-15m27 29v-15M416 177l56-27 56 27M416 183l56-27 56 27"/></g>
 <g fill="#b49166"><path d="m483 186 23-11 14 7-23 12z"/><path d="m483 190 23-11 14 7-23 12z"/></g><g stroke="#7e9a69" stroke-width="3"><path d="m481 202 25-12m-22 16 25-12m-22 16 25-12"/></g><path d="m447 202 13-13 17 15-15 7z" fill="#b4aa90"/><path d="m503 200 11-5 10 5v8l-11 5-10-5z" fill="#a76d52"/><path d="M507 198v-5h9v4" fill="none" stroke="#735e49" stroke-width="2"/>
 <g data-nomad-excavator transform="translate(444 183)"><ellipse cy="11" rx="19" ry="7" fill="#77745a" opacity=".3"/><path d="m-18 4 24 8 13-7-24-8z" fill="#5c6254" stroke="#414d46" stroke-width="3"/><path d="m-13-8 17 5v12l-17-5z" fill="#edc55a"/><path d="m-7-24 14 5v17l-14-5z" fill="#e4b847"/><path d="m-4-21 8 3v10l-8-3z" fill="#719a91"/><g class="nomad-arm"><path d="m8-6 13-17 17 12" stroke="#e5b548" stroke-width="6" fill="none" stroke-linejoin="round"/><path d="m33-13 10 4-1 9-11-5z" fill="#bb9140"/><path d="m12-9 9-12 12 9" stroke="#f7da81" stroke-width="2" fill="none"/></g></g>
 <g data-nomad-engineer transform="translate(486 177)">${portrait?portrait.replace('<svg','<svg x="-10" y="-27" width="20" height="28"'):'<ellipse cy="-5" rx="7" ry="9" fill="#ae845d"/><circle cy="-17" r="7" fill="#bd9468"/><circle cx="-5" cy="-22" r="3" fill="#bd9468"/><circle cx="5" cy="-22" r="3" fill="#bd9468"/><path d="M-6-9 0-5 6-9v10H-6z" fill="#e8af54"/><circle cx="-2" cy="-17" r=".8"/><circle cx="2" cy="-17" r=".8"/>'}<path d="M-9-24q0-12 9-12t9 12z" fill="#f2cc57"/><path d="M-11-24h22" stroke="#c59a35" stroke-width="3"/></g>
 <g fill="#ceb084" stroke="#9b7c54" stroke-width="1.5"><path d="M416 193v-15m28 29v-15m28 29v-15m28 1v-15m28 1v-15M416 184l56 27 56-27M416 190l56 27 56-27"/></g>
 <path d="M471 228v-17" stroke="#836f50" stroke-width="3"/><path d="m455 207 32-2v17l-32 2z" fill="#f8ebc6" stroke="#a78e5d"/><text x="458" y="212" font-size="4" fill="#66563e">Nomad House</text><text x="458" y="219" font-size="3.5" fill="#66563e">Coming Soon</text></g>`;
 return phase==='construction'?art:art.replace('data-nomad-parcel="construction"','data-nomad-parcel="structure"').replace('<g data-nomad-excavator','<g style="display:none" data-nomad-excavator').replace('<g data-nomad-engineer transform="translate(486 177)"',nomadStructureArt()+'<g data-nomad-engineer transform="translate(504 206)"');
}
export function nomadPreview(){
 return `<svg viewBox="0 0 760 430" role="img" data-i18n-aria-label="nomad.preview" aria-label="Nomad House 建築概念預覽"><rect width="760" height="430" fill="#c2d7c4"/><path d="m57 250 325-159 322 158-325 163z" fill="#afc09c"/><path d="m174 254 208-101 207 101v15L382 371 174 269z" fill="#9e805a"/><path d="m174 254 208-101 207 101-207 102z" fill="#d0ad7d"/><g stroke="#eed2a0" stroke-width="2">${Array.from({length:9},(_,i)=>`<path d="m${192+i*21} ${254-i*10} 190 95"/>`).join('')}</g><g stroke="#b18c56" stroke-width="10"><path d="M220 260V157M380 335V232M542 261V158M380 181V87"/></g><path d="m168 162 213-108 212 108-213 110z" fill="#aa9969"/><path d="m168 162 212 110v12L168 174zm212 110 213-110v12L380 284" fill="#8e8155"/><path d="m185 161 196-94 194 94-195 100z" fill="#b9a879"/><g stroke="#d3bd87" stroke-width="3">${Array.from({length:9},(_,i)=>`<path d="m${205+i*20} ${151-i*9} 170 94"/>`).join('')}</g><path d="m288 272 92-45 92 45-92 46z" fill="#e0c89d"/><path d="M300 278v36m162-36v36" stroke="#88764f" stroke-width="6"/><path d="m350 268 26-13 22 11-25 13v-16l25-12" fill="#7f9c8d" stroke="#596e60" stroke-width="2"/><g fill="#6f936b">${[[145,246],[588,248],[520,329],[262,316]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="24" ry="12"/><path d="M${x} ${y}q-45-67 0-23 45-44 0 23"/>`).join('')}</g></svg>`;
}
export function nomadMarkup(portrait=''){
 const t=(key,zh,tag='p')=>`<${tag} data-i18n="nomad.${key}">${zh}</${tag.split(" ")[0]}>`;
 return `<style>${nomadStyles}</style><section class="nomad-copy" data-nomad-phase="${nomadSite.phase}"><small>BEAR ATLAS · V86.2</small>${t('title','Nomad House｜熊熊遊牧工作屋','h1')}<a href="/world?at=12" data-i18n="nomad.back">← 回施工告示旁</a>${t('structureStatus','屋架施工中 · 尚未開放入內','p class="nomad-status"')}<figure class="nomad-preview nomad-progress"><svg viewBox="390 85 165 155" role="img" data-i18n-aria-label="nomad.progressImage" aria-label="Nomad House 屋架施工進度"><rect x="390" y="85" width="165" height="155" fill="#cadcc1"/>${nomadConstructionArt()}</svg><figcaption data-i18n="nomad.progressCaption">竹屋架與部分茅草屋頂已成形，木平台、藤椅與熱帶綠植正在準備中。</figcaption></figure>${t('progressSafety','步道已連接至施工告示；圍籬內仍在施工，尚未公布開幕日期。')}<details><summary data-i18n="nomad.futureConcept">看看未來空間概念</summary><figure class="nomad-preview">${nomadPreview()}<figcaption data-i18n="nomad.concept">建築概念預覽；四個生活區域尚未開放。</figcaption></figure></details>${t('intro','即使需要工作，也可以在一個溫暖、自在的小世界裡完成。烏布雨林的自然感，與長谷共享工作的自在節奏。')}${t('safe','請留在木圍籬外的步道。工程熊熊正在整理竹材與木平台。')}<div class="nomad-zones">${[['work','Work Lounge｜共享工作區','竹木長桌、藤椅與筆電。以後可以在這裡工作或閱讀。'],['coffee','Coffee Corner｜咖啡角落','一杯虛擬咖啡，陪你放慢腳步。'],['deck','Slow Deck｜放空露台','海風、躺椅與綠植，留一個不用努力的角落。'],['focus','Focus Nook｜專注角落','安靜工作或閱讀；可選的陪伴計時將於後續階段加入。']].map(([key,title,copy])=>`<article>${t(key,title,'h2')}${t(key+'Copy',copy)}</article>`).join('')}</div>${t('promise','這裡不需要打卡、排名或完成任務。你也可以只是來待一會。')}</section>`;
}
