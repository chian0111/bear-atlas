import {bedroomCatalog} from '../worker/bedroom.js';
import assert from 'node:assert/strict';
import {cabinBedroomDefaults,cabin3DClient,cabinRoomBounds,cabinFurniture,cabinLayoutDefaults,cabinLayoutProblem} from '../worker/island-life.js';
const element=()=>({hidden:true,dataset:{},textContent:'',handlers:{},classList:{add(){},remove(){}},addEventListener(type,fn){this.handlers[type]=fn;},setAttribute(k,v){this[k]=v;}});
const selected={wall:'print',desk:'books',corner:'plant'},nodes={};
for(const name of ['[data-cabin-camera]','[data-cabin-walk]','[data-cabin-activity]','[data-cabin-activity-state]','[data-cabin-mood]','[data-cabin-greet]','[data-cabin-life]','[data-cabin-gesture]','.cabin-scene'])nodes[name]=element();
const activity=nodes['[data-cabin-activity]'];activity.value='auto';activity.options=['auto','walk','read','coffee','golf','rest'].map(value=>({value,disabled:false}));Object.defineProperty(activity,'selectedOptions',{get(){return activity.options.filter(x=>x.value===activity.value);}});
nodes['[data-cabin-camera]'].querySelector=selector=>nodes[selector];
let paths=0;
const ctx=new Proxy({createRadialGradient(){return {addColorStop(){}}},beginPath(){paths++;}},{get(target,key){return target[key]||(()=>{});}});
const canvas=element();Object.assign(canvas,{clientWidth:640,clientHeight:380,width:0,height:0,getContext(){return ctx;},setPointerCapture(){}});nodes.canvas=canvas;
const display=element();display.dataset={theme:'sage'};display.querySelector=selector=>{
 const slot=/data-cabin-slot="(\w+)"/.exec(selector)?.[1];return slot?{dataset:{cabinItem:selected[slot]}}:nodes[selector];
};
const raf=new Map();let next=0;
globalThis.document={hidden:false,querySelector(){return display;}};globalThis.window={devicePixelRatio:1};globalThis.matchMedia=()=>({matches:false,addEventListener(){}});
globalThis.requestAnimationFrame=fn=>{raf.set(++next,fn);return next;};
globalThis.ResizeObserver=class{observe(){}};globalThis.MutationObserver=class{observe(){}};globalThis.IntersectionObserver=class{observe(){}};
const pump=(now=1000)=>{const queue=[...raf.values()];raf.clear();queue.forEach(fn=>fn(now));};
let clock=1000;const settle=expected=>{for(let i=0;i<150&&canvas.dataset.activity!==expected;i++)pump(clock+=100);assert.equal(canvas.dataset.activity,expected);};
cabin3DClient();pump(clock);assert.equal(canvas.hidden,false);assert.equal(nodes['.cabin-scene'].hidden,'');assert.ok(paths>100);
assert.equal(canvas.dataset.activity,'walk');
activity.value='read';activity.handlers.change();pump(clock+=100);assert.equal(canvas.dataset.activity,'walk');settle('read');
selected.desk='coffee';activity.value='coffee';activity.handlers.change();pump(clock+=100);settle('coffee');
selected.corner='golf';activity.value='golf';activity.handlers.change();pump(clock+=100);settle('golf');
nodes['[data-cabin-greet]'].handlers.click();assert.match(nodes['[data-cabin-mood]'].textContent,/揮揮手/);pump(clock+=100);assert.equal(canvas.dataset.activity,'wave');settle('golf');
selected.corner='plant';activity.handlers.change();pump();assert.equal(activity.value,'auto');assert.notEqual(canvas.dataset.activity,'golf');
nodes['[data-cabin-walk]'].handlers.click();pump();assert.equal(canvas.dataset.activity,'rest');assert.equal(nodes['[data-cabin-walk]'].textContent,'讓熊熊走走');nodes['[data-cabin-greet]'].handlers.click();pump(clock+=100);assert.equal(canvas.dataset.activity,'wave');settle('rest');
nodes['[data-cabin-walk]'].handlers.click();activity.value='read';selected.desk='books';activity.handlers.change();display.dataset.cabinGuest='liv';pump(clock+=100);settle('read');
const oldYaw=canvas.dataset.yaw;nodes['[data-cabin-camera]'].handlers.click({target:{closest(){return {dataset:{cameraAction:'right'}}}}});pump();assert.notEqual(canvas.dataset.yaw,oldYaw);
console.log('3D rendering, activity selection, furnishing requirements, visitor rendering, mood, pause and rotation passed.');
// Exercise editor commands against the renderer, including invalid placement and undo.
raf.clear();
const game=element(),layoutEvents=[];
for(const selector of ['[data-layout-controls]','[data-layout-selection]','[data-layout-feedback]'])nodes[selector]=element();
for(const id of ['desk','chair','corner','rug','door','album','bear']){const node=element();node.style={};node.dataset.gameHotspot=id;nodes['[data-game-hotspot="'+id+'"]']=node;}
game.querySelector=selector=>nodes[selector];display.closest=()=>game;display.dataset.cabinLayout='{}';
display.dispatchEvent=event=>{if(event.type==='cabin-layout-change')layoutEvents.push(event.detail);display.handlers[event.type]?.(event);};
canvas.getBoundingClientRect=()=>({left:0,top:0});
cabin3DClient();pump(clock+=100);
const command=detail=>{display.handlers['cabin-layout-command']({detail});pump(clock+=100);};
command('start');assert.equal(nodes['[data-layout-controls]'].hidden,false);
command('left');assert.match(nodes['[data-layout-feedback]'].textContent,/重疊/);assert.equal(display.dataset.cabinLayout,'{}');
command('right');assert.equal(JSON.parse(display.dataset.cabinLayout).table.x,.3);assert.equal(layoutEvents.length,1);
command('undo');assert.equal(JSON.parse(display.dataset.cabinLayout).table.x,.05);
command('rotate');assert.equal(JSON.parse(display.dataset.cabinLayout).table.r,1);
command('cancel');assert.equal(JSON.parse(display.dataset.cabinLayout).table.r,0);assert.equal(nodes['[data-layout-controls]'].hidden,true);
console.log('Editor invalid placement, move, rotation, undo, cancel and change notifications passed.');
// Regression: guest must walk in even while the owner has paused walking.
command('finish');
if(nodes['[data-cabin-walk]']['aria-pressed']==='true')nodes['[data-cabin-walk]'].handlers.click();
display.dataset.cabinGuest='ari';pump(clock+=100);
assert.equal(canvas.dataset.guestState,'entering');
const entrance=JSON.parse(canvas.dataset.guestPosition);
for(let i=0;i<220;i++)pump(clock+=100);
assert.equal(canvas.dataset.guestState,'inside');
const inside=JSON.parse(canvas.dataset.guestPosition);assert.ok(Math.hypot(inside.x-entrance.x,inside.z-entrance.z)>1);
pump(clock+=100);assert.equal(canvas.dataset.guestState,'inside');
display.dataset.cabinHeld='visit:2026-11-11:ari:aa';
nodes['[data-cabin-camera]'].handlers.click({target:{closest(){return {dataset:{cameraAction:'right'}}}}});
pump(clock+=100);assert.equal(canvas.dataset.activity,'card');
delete display.dataset.cabinHeld;
// Narrow canvas and touch pointer drag beyond each wall, rotate, cancel and save notifications.
canvas.clientWidth=390;canvas.clientHeight=500;
command('start');
game.handlers.pointerdown({pointerId:7,clientX:100,clientY:100,preventDefault(){},stopPropagation(){},target:{closest(){return {dataset:{gameHotspot:'rug'}};}}});
canvas.handlers.pointermove({pointerId:7,clientX:5000,clientY:-5000});
canvas.handlers.pointerup({type:'pointerup',pointerId:7});
let moved=JSON.parse(display.dataset.cabinLayout),rug=moved.rug;
assert.ok(rug.x-1.75>=-2.700001&&rug.x+1.75<=4.300001&&rug.z-1.25>=-2.400001&&rug.z+1.25<=3.800001);
assert.deepEqual(moved.table,{x:.05,z:.2,r:0});
command('rotate');moved=JSON.parse(display.dataset.cabinLayout);rug=moved.rug;
assert.ok(rug.x-1.25>=-2.700001&&rug.x+1.25<=4.300001&&rug.z-1.75>=-2.400001&&rug.z+1.75<=3.800001);
for(let i=0;i<25;i++)command('back');
assert.equal(JSON.parse(display.dataset.cabinLayout).rug.z,2.05);
command('finish');
for(let i=0;i<8;i++){nodes['[data-cabin-camera]'].handlers.click({target:{closest(){return {dataset:{cameraAction:'right'}}}}});pump(clock+=100);}
console.log('Ari entrance while paused, retained guest, held-card rendering, 390px touch drag, rotated rug wall clamping and other-furniture isolation passed.');

// Tap selection uses mesh hit testing; blank taps clear it and gestures do not select.
command('finish');nodes['[data-cabin-camera]'].handlers.click({target:{closest(){return {dataset:{cameraAction:'reset'}}}}});pump(clock+=100);
const selections=[];display.handlers['cabin-furniture-select']=event=>selections.push(event.detail);
for(const id of ['desk','chair','rug','corner'])assert.equal(nodes['[data-game-hotspot="'+id+'"]'].hidden,true);
const project=([x,y,z])=>{const [a,b,,d]=JSON.parse(canvas.dataset.roomFloor),u=(x+2.8)/7.2,v=(z+2.5)/6.4,scale=(b[0]-a[0])/(7.2*Math.cos(.72));return {clientX:a[0]+(b[0]-a[0])*u+(d[0]-a[0])*v,clientY:a[1]+(b[1]-a[1])*u+(d[1]-a[1])*v-(y+.35)*Math.cos(.55)*scale};};
const tapAt=(p,id=21)=>{canvas.handlers.pointerdown({...p,pointerId:id,button:0});canvas.handlers.pointerup({...p,pointerId:id,type:'pointerup'});};
tapAt(project([.05,1.16,.2]));assert.equal(selections.at(-1),'table');
tapAt({clientX:4,clientY:4});assert.equal(selections.at(-1),null);
const beforeSelections=selections.length;canvas.handlers.pointerdown({clientX:4,clientY:4,pointerId:22,button:0});canvas.handlers.pointermove({clientX:35,clientY:35,pointerId:22});canvas.handlers.pointerup({clientX:35,clientY:35,pointerId:22,type:'pointerup'});assert.equal(selections.length,beforeSelections);
command('start');assert.equal(nodes['[data-game-hotspot="rug"]'].hidden,false);assert.equal(nodes['[data-game-hotspot="chair"]'].hidden,true);command('cancel');
console.log('Default furniture labels hidden, mesh tap selection, blank dismissal, drag-versus-tap distinction and single edit label passed.');
// The same renderer/activity system supports both playable species and all shared outfits.
for(const species of ['rabbit','cat']){
 display.dataset.bearSpecies=species;display.dataset.bearFur=species==='rabbit'?'#eadfc9':'#c6aa8d';
 for(const outfit of ['explorer','sailor','picnic']){
  display.dataset.bearLook=outfit;display.dataset.bearBag='#76917a';display.dataset.bearShoes='#f0dfb8';
  nodes['[data-cabin-camera]'].handlers.click({target:{closest(){return {dataset:{cameraAction:'right'}}}}});pump(clock+=100);assert.equal(canvas.dataset.species,species);
 }
 if(nodes['[data-cabin-walk]']['aria-pressed']!=='true')nodes['[data-cabin-walk]'].handlers.click();
 activity.value='walk';activity.handlers.change();pump(clock+=100);assert.equal(canvas.dataset.activity,'walk');
 activity.value='rest';activity.handlers.change();pump(clock+=100);settle('rest');
 display.dataset.cabinHeld='visit:fixture:ari:aa';pump(clock+=100);nodes['[data-cabin-camera]'].handlers.click({target:{closest(){return {dataset:{cameraAction:'right'}}}}});pump(clock+=100);assert.equal(canvas.dataset.activity,'card');delete display.dataset.cabinHeld;
}
console.log('Rabbit/cat shared 3D walk, idle, three outfits, accessories and held-card rendering passed at 390px.');
// Bed uses the same optional layout, movement and renderer with one owner.
display.dataset.bearSpecies='bear';activity.options.push({value:'sleep',disabled:false},{value:'wake',disabled:false});
nodes['[data-game-wake]']=element();nodes['[data-game-hotspot="bed"]']=element();nodes['[data-game-hotspot="bed"]'].style={};
command('add-bed');let bedLayout=JSON.parse(display.dataset.cabinLayout);assert.ok(bedLayout.bed);assert.deepEqual(bedLayout.table,moved.table);command('finish');
activity.value='sleep';activity.handlers.change();pump(clock+=100);assert.equal(canvas.dataset.activity,'walk');settle('sleep');assert.equal(nodes['[data-game-wake]'].hidden,false);assert.equal(canvas.dataset.ownerCount,'1');
for(let i=0;i<20;i++)pump(clock+=100);assert.equal(canvas.dataset.activity,'sleep');assert.equal(canvas.dataset.guestState,'inside');
activity.value='wake';activity.handlers.change();pump(clock+=100);assert.notEqual(canvas.dataset.activity,'sleep');assert.equal(nodes['[data-game-wake]'].hidden,true);
activity.value='sleep';activity.handlers.change();settle('sleep');command('start');assert.notEqual(canvas.dataset.activity,'sleep');command('cancel');
console.log('Optional bed placement, existing furniture preservation, bedside navigation, sleep, one owner, retained Ari, wake and edit cancellation passed.');
// Expanded space is navigable, not merely a larger drawing.
activity.value='auto';activity.handlers.change();let enteredExpansion=false;
for(let i=0;i<900;i++){pump(clock+=100);const p=JSON.parse(canvas.dataset.ownerPosition);assert.ok(p.x>=cabinRoomBounds.minX&&p.x<=cabinRoomBounds.maxX&&p.z>=cabinRoomBounds.minZ&&p.z<=cabinRoomBounds.maxZ);if(p.x>2.7||p.z>2.4)enteredExpansion=true;}
assert.ok(enteredExpansion,'Patrol must reach the additional floor');
// Move the existing bed wholly into the addition, without moving old furniture.
const oldFurniture=JSON.parse(display.dataset.cabinLayout);const enlarged={...oldFurniture,bed:{x:3.3,z:2.6,r:0}};
raf.clear();display.dataset.cabinLayout=JSON.stringify(enlarged);activity.value='auto';cabin3DClient();pump(clock+=100);
activity.value='sleep';activity.handlers.change();settle('sleep');assert.equal(canvas.dataset.ownerCount,'1');
activity.value='wake';activity.handlers.change();pump(clock+=100);assert.notEqual(canvas.dataset.activity,'sleep');
command('add-bed');command('rotate');command('cancel');assert.deepEqual(JSON.parse(display.dataset.cabinLayout),enlarged);
console.log('Expanded patrol bounds, bed navigation/sleep/wake in new floor, unchanged coordinates and cancelled rotation passed.');

// At the default camera the full expanded floor fits a phone-sized canvas.
canvas.clientWidth=390;canvas.clientHeight=500;nodes['[data-cabin-camera]'].handlers.click({target:{closest(){return {dataset:{cameraAction:'reset'}}}}});pump(clock+=100);
for(const [x,y] of JSON.parse(canvas.dataset.roomFloor)){assert.ok(x>=0&&x<=390&&y>=0&&y<=500,'Floor must fit the phone canvas');}
console.log('390×500 default camera contains all four expanded floor corners.');

// Every optional item uses the existing add/select/move/rotate/remove history.
raf.clear();display.dataset.cabinLayout=JSON.stringify(cabinLayoutDefaults);activity.value='auto';cabin3DClient();pump(clock+=100);
for(const id of Object.keys(cabinFurniture)){
 command('add:'+id);const at=JSON.parse(display.dataset.cabinLayout);assert.ok(at[id],id+' can be placed');assert.equal(cabinLayoutProblem(at),'');
 command('finish');command('select:'+id);command('remove');assert.ok(!JSON.parse(display.dataset.cabinLayout)[id]);command('undo');assert.deepEqual(JSON.parse(display.dataset.cabinLayout)[id],at[id]);command('cancel');
}
const packed=JSON.parse(display.dataset.cabinLayout);for(const id of Object.keys(cabinFurniture))assert.ok(packed[id],id+' coexists');
for(const id of Object.keys(cabinLayoutDefaults))assert.deepEqual(packed[id],cabinLayoutDefaults[id]);
console.log('All ten core furniture types coexist without moving old furniture; select, collect, undo and cancel passed.');
// Fresh phone-size rooms isolate valid drag and rotation for each item.
for(const id of Object.keys(cabinFurniture)){
 raf.clear();display.dataset.cabinLayout=JSON.stringify({...cabinLayoutDefaults,[id]:{x:3.1,z:2.5,r:1}});activity.value='auto';cabin3DClient();pump(clock+=100);command('select:'+id);
 game.handlers.pointerdown({pointerId:83,clientX:100,clientY:100,preventDefault(){},stopPropagation(){},target:{closest(){return {dataset:{gameHotspot:id==='bed'?'bed':'extra'}};}}});
 canvas.handlers.pointermove({pointerId:83,clientX:104,clientY:104});canvas.handlers.pointerup({type:'pointerup',pointerId:83});
 const dragged=JSON.parse(display.dataset.cabinLayout);assert.ok(dragged[id]);assert.equal(cabinLayoutProblem(dragged),'');assert.notDeepEqual(dragged[id],{x:3.1,z:2.5,r:1},id+' drag updates position');
 command('rotate');assert.equal(JSON.parse(display.dataset.cabinLayout)[id].r,2,id+' rotates');command('finish');
}
console.log('390px drag and rotation passed for all ten core furniture types.');

// Bedroom reuses the renderer with only a bed, and one active owner.
raf.clear();display.dataset.cabinRoom='bedroom';display.dataset.roomTo='/dock/cabin';display.dataset.bearSpecies='bear';display.dataset.cabinLayout=JSON.stringify(cabinBedroomDefaults);activity.value='auto';
let arrivals=0;display.handlers['cabin-room-arrived']=()=>arrivals++;
cabin3DClient();pump(clock+=100);assert.equal(canvas.dataset.ownerCount,'1');assert.equal(canvas.dataset.guestState,undefined);
activity.value='sleep';activity.handlers.change();settle('sleep');assert.equal(canvas.dataset.ownerCount,'1');
display.handlers['cabin-room-walk']();for(let i=0;i<140&&arrivals===0;i++)pump(clock+=100);assert.equal(arrivals,1);assert.notEqual(canvas.dataset.activity,'sleep');
for(let i=0;i<10;i++)pump(clock+=100);assert.equal(arrivals,1);
console.log('Bed-only bedroom render, sleep, single owner, no Ari leakage and walk-before-room-arrival event passed.');

// New instances reuse the same renderer: stable IDs must survive each independent edit.
raf.clear();display.dataset.cabinInstances='1';display.dataset.cabinLayout='{}';activity.value='auto';cabin3DClient();pump(clock+=100);
command('add:double_bed');command('add:double_bed');
let instanceLayout=JSON.parse(display.dataset.cabinLayout),bedIds=Object.keys(instanceLayout);assert.equal(bedIds.length,2);assert.notEqual(bedIds[0],bedIds[1]);
const sibling=structuredClone(instanceLayout[bedIds[1]]);
command('select:'+bedIds[0]);command('rotate');assert.deepEqual(JSON.parse(display.dataset.cabinLayout)[bedIds[1]],sibling);
command('remove');instanceLayout=JSON.parse(display.dataset.cabinLayout);assert.ok(!instanceLayout[bedIds[0]]);assert.deepEqual(instanceLayout[bedIds[1]],sibling);
command('undo');command('finish');
for(const id of bedIds){display.handlers['cabin-bed-target']({detail:id});activity.value='sleep';activity.handlers.change();settle('sleep');assert.equal(canvas.dataset.sleepingBed,id);assert.equal(canvas.dataset.ownerCount,'1');activity.value='wake';activity.handlers.change();pump(clock+=100);assert.notEqual(canvas.dataset.activity,'sleep');}
// Direct instance drag uses the selected ID and clamps the complete rotated footprint.
command('select:'+bedIds[0]);const beforeSibling=JSON.parse(display.dataset.cabinLayout)[bedIds[1]],beforeDragged=JSON.parse(display.dataset.cabinLayout)[bedIds[0]];
game.handlers.pointerdown({pointerId:90,clientX:100,clientY:100,preventDefault(){},stopPropagation(){},target:{closest(){return {dataset:{gameHotspot:'extra'}};}}});
canvas.handlers.pointermove({pointerId:90,clientX:10000,clientY:10000});canvas.handlers.pointerup({type:'pointerup',pointerId:90});
assert.deepEqual(JSON.parse(display.dataset.cabinLayout)[bedIds[1]],beforeSibling);assert.notDeepEqual(JSON.parse(display.dataset.cabinLayout)[bedIds[0]],beforeDragged);
assert.equal(cabinLayoutProblem(JSON.parse(display.dataset.cabinLayout),true,'bedroom-instances'),'');
command('finish');
for(const type of ['bedside_table','rug','wardrobe','plant','plant'])command('add:'+type);
instanceLayout=JSON.parse(display.dataset.cabinLayout);assert.equal(Object.values(instanceLayout).filter(p=>p.furniture_type==='plant').length,2);assert.equal(Object.values(instanceLayout).filter(p=>p.furniture_type==='wardrobe').length,1);
command('finish');
raf.clear();display.dataset.cabinLayout='{}';activity.value='auto';cabin3DClient();pump(clock+=100);
for(let i=0;i<25;i++)command('add:plant');assert.equal(Object.keys(JSON.parse(display.dataset.cabinLayout)).length,25);command('add:plant');assert.equal(Object.keys(JSON.parse(display.dataset.cabinLayout)).length,25);assert.match(nodes['[data-layout-feedback]'].textContent,/25/);
console.log('Two bed instances, independent rotate/delete/undo, targeted sleep/wake, 390px drag, clamped footprints, core meshes and 25-item limit passed.');
// Mobile-only UX: invisible padded target, tap then drag, scroll suppression and independent data.
for(const id of ['roomdoor','extra']){const node=element();node.style={};node.dataset.gameHotspot=id;nodes['[data-game-hotspot="'+id+'"]']=node;}
raf.clear();display.dataset.cabinLayout=JSON.stringify({p1:{id:'p1',room_id:'bedroom',furniture_type:'plant',x:-1,z:1,r:0,layer:0,created_at:1,updated_at:1},p2:{id:'p2',room_id:'bedroom',furniture_type:'plant',x:3,z:2,r:0,layer:0,created_at:1,updated_at:1}});activity.value='auto';canvas.clientWidth=390;canvas.clientHeight=650;cabin3DClient();pump(clock+=100);
const target=JSON.parse(canvas.dataset.touchTargets).find(t=>t.id==='p1');assert.ok(target.w>=48&&target.h>=48);
const rendererSelect=display.handlers['cabin-furniture-select'],mobileSelections=[];display.handlers['cabin-furniture-select']=e=>{rendererSelect(e);mobileSelections.push(e.detail);};
const px=target.x-target.w/2+1,py=target.y;
canvas.handlers.pointerdown({pointerId:301,clientX:px,clientY:py,button:0});canvas.handlers.pointerup({pointerId:301,clientX:px,clientY:py,type:'pointerup'});pump(clock+=100);assert.equal(mobileSelections.at(-1),'p1');
const addClass=game.classList.add,removeClass=game.classList.remove;game.classList.add=name=>{addClass(name);if(name==='is-layout-editing')canvas.clientHeight=580;};game.classList.remove=name=>{removeClass(name);if(name==='is-layout-editing')canvas.clientHeight=650;};
let prevented=0;const siblingBefore=JSON.parse(display.dataset.cabinLayout).p2;
canvas.handlers.pointerdown({pointerId:302,clientX:px,clientY:py,button:0,preventDefault(){prevented++;}});
assert.equal(nodes['[data-layout-controls]'].hidden,false);
canvas.handlers.pointermove({pointerId:302,clientX:px,clientY:py,preventDefault(){prevented++;}});canvas.handlers.pointerup({pointerId:302,type:'pointerup'});pump(clock+=100);assert.equal(JSON.parse(display.dataset.cabinLayout).p1.x,-1);assert.equal(JSON.parse(display.dataset.cabinLayout).p1.z,1);
const movedTarget=JSON.parse(canvas.dataset.touchTargets).find(t=>t.id==='p1'),px2=movedTarget.x,py2=movedTarget.y;canvas.handlers.pointerdown({pointerId:302,clientX:px2,clientY:py2,button:0,preventDefault(){prevented++;}});
canvas.handlers.pointermove({pointerId:302,clientX:px2+35,clientY:py2+20,preventDefault(){prevented++;}});canvas.handlers.pointerup({pointerId:302,type:'pointerup'});pump(clock+=100);
assert.ok(prevented>=2);assert.notDeepEqual(JSON.parse(display.dataset.cabinLayout).p1,{id:'p1',room_id:'bedroom',furniture_type:'plant',x:-1,z:1,r:0,layer:0,created_at:1,updated_at:1});assert.deepEqual(JSON.parse(display.dataset.cabinLayout).p2,siblingBefore);
command('finish');game.classList.add=addClass;game.classList.remove=removeClass;
// Framing and labels remain inside phone canvases at short/tall sizes and camera rotations.
for(const width of [320,390,430])for(const height of [420,700]){
 canvas.clientWidth=width;canvas.clientHeight=height;nodes['[data-cabin-camera]'].handlers.click({target:{closest(){return {dataset:{cameraAction:'reset'}};}}});pump(clock+=100);
 for(let turn=0;turn<5;turn++){
  const [a,b,,d]=JSON.parse(canvas.dataset.roomFloor),yaw=Number(canvas.dataset.yaw),scale=(b[0]-a[0])/(7.2*Math.cos(yaw));
  for(const x of [-2.98,4.45])for(const z of [-2.69,3.96])for(const y of [-.35,3.6]){const u=(x+2.8)/7.2,v=(z+2.5)/6.4,px=a[0]+(b[0]-a[0])*u+(d[0]-a[0])*v,py=a[1]+(b[1]-a[1])*u+(d[1]-a[1])*v-(y+.35)*Math.cos(.55)*scale;assert.ok(px>=9&&px<=width-9&&py>=55&&py<=height-19,'Complete room frame fits');}
  const door=nodes['[data-game-hotspot="roomdoor"]'],bear=nodes['[data-game-hotspot="bear"]'];assert.ok(door&&!door.hidden);if(!bear.hidden){const dx=Math.abs(parseFloat(door.style.left)-parseFloat(bear.style.left)),dy=Math.abs(parseFloat(door.style.top)-parseFloat(bear.style.top));const dw=Math.min(width-16,Math.max(48,door.textContent.length*7+22)),bw=Math.min(width-16,Math.max(48,bear.textContent.length*7+22));assert.ok(dx>=(dw+bw)/2||dy>=48,'Door and bear labels do not overlap: '+JSON.stringify({width,height,turn,dx,dy,dw,bw}));}
  nodes['[data-cabin-camera]'].handlers.click({target:{closest(){return {dataset:{cameraAction:'right'}};}}});pump(clock+=100);
 }
}
console.log('48px transparent small-item target, tap-then-drag, scroll prevention, sibling isolation, complete mobile framing and label separation passed.');

// Selection chrome is temporary UI, never saved furniture data.
canvas.clientWidth=390;canvas.clientHeight=650;command('select:p1');assert.equal(canvas.dataset.selection,'p1');
const savedSelectionLayout=display.dataset.cabinLayout;canvas.handlers.pointerdown({pointerId:401,clientX:1,clientY:1,button:0});canvas.handlers.pointerup({pointerId:401,type:'pointerup'});pump(clock+=100);
assert.equal(canvas.dataset.selection,'');assert.equal(nodes['[data-game-hotspot="extra"]'].hidden,true);assert.equal(display.dataset.cabinLayout,savedSelectionLayout);
command('select:p1');command('finish');assert.equal(canvas.dataset.selection,'');assert.equal(nodes['[data-game-hotspot="extra"]'].hidden,true);
command('select:p1');command('save');assert.equal(canvas.dataset.selection,'');
display.dispatchEvent(new CustomEvent('cabin-furniture-select',{detail:'p1'}));pump(clock+=100);assert.equal(canvas.dataset.selection,'');assert.equal(display.dataset.cabinLayout,savedSelectionLayout);
console.log('Blank tap deselects without losing edits; finish/save and normal browsing hide selection chrome.');
// P0: one reading armchair uses the existing path and a distinct persistent seated pose.
raf.clear();display.dataset.cabinRoom='bedroom';display.dataset.cabinInstances='1';display.dataset.bearSpecies='bear';
const p0Items={seat1:{id:'seat1',room_id:'bedroom',furniture_type:'reading_chair',x:.5,z:1,r:1,layer:0,created_at:1,updated_at:1},bed1:{id:'bed1',room_id:'bedroom',furniture_type:'single_bed',x:3,z:2,r:0,layer:0,created_at:1,updated_at:1}};
display.dataset.cabinLayout=JSON.stringify(p0Items);activity.value='auto';if(!activity.options.some(o=>o.value==='sit'))activity.options.push({value:'sit',disabled:false});cabin3DClient();pump(clock+=100);
display.handlers['cabin-seat-target']({detail:'seat1'});activity.value='sit';activity.handlers.change();assert.equal(canvas.dataset.posture,'standing');settle('sit');
assert.equal(canvas.dataset.posture,'sitting');assert.equal(canvas.dataset.seatedInstance,'seat1');assert.equal(canvas.dataset.ownerCount,'1');
let owner=JSON.parse(canvas.dataset.ownerPosition);assert.ok(Math.abs(owner.x-.54)<.001&&Math.abs(owner.z-1)<.001);assert.ok(Math.abs(owner.heading-Math.PI/2)<.001);
for(let i=0;i<50;i++)pump(clock+=100);assert.equal(canvas.dataset.activity,'sit');
activity.value='wake';activity.handlers.change();pump(clock+=100);assert.equal(canvas.dataset.posture,'standing');assert.equal(canvas.dataset.seatedInstance,'');
display.handlers['cabin-seat-target']({detail:'seat1'});activity.value='sit';activity.handlers.change();settle('sit');display.handlers['cabin-bed-target']({detail:'bed1'});activity.value='sleep';activity.handlers.change();settle('sleep');assert.equal(canvas.dataset.posture,'sleeping');assert.equal(canvas.dataset.seatedInstance,'');
activity.value='sit';activity.handlers.change();settle('sit');command('select:seat1');assert.equal(canvas.dataset.posture,'standing');command('finish');assert.equal(display.dataset.cabinLayout,JSON.stringify(p0Items));
console.log('P0 armchair approach, rotated seat alignment, real sitting state, stand, sit/sleep exclusion and safe editing passed.');
// P0: blocked approaches fail safely; standing at the entry point precedes room travel.
raf.clear();display.dataset.cabinLayout=JSON.stringify({...p0Items,block:{id:'block',room_id:'bedroom',furniture_type:'wardrobe',x:1.4,z:1,r:1,layer:0,created_at:1,updated_at:1}});activity.value='auto';cabin3DClient();pump(clock+=100);display.handlers['cabin-seat-target']({detail:'seat1'});activity.value='sit';activity.handlers.change();pump(clock+=100);assert.equal(canvas.dataset.seatedInstance,'');assert.match(nodes['[data-cabin-mood]'].textContent,/沒有通道/);
raf.clear();display.dataset.cabinLayout=JSON.stringify(p0Items);activity.value='auto';cabin3DClient();pump(clock+=100);display.handlers['cabin-seat-target']({detail:'seat1'});activity.value='sit';activity.handlers.change();settle('sit');arrivals=0;display.handlers['cabin-room-walk']();for(let i=0;i<160&&arrivals===0;i++)pump(clock+=100);assert.equal(arrivals,1);assert.equal(canvas.dataset.seatedInstance,'');assert.equal(canvas.dataset.ownerCount,'1');
console.log('P0 blocked seating and safe standing before room switch passed.');

// Shared seat metadata aligns all three meshes, every rotation and duplicate instances.
for(const type of ['reading_chair','chair','vanity_stool'])for(let r=0;r<4;r++){
 raf.clear();const seats={a:{...p0Items.seat1,id:'a',furniture_type:type,x:.5,z:1,r},b:{...p0Items.seat1,id:'b',furniture_type:type,x:3,z:2,r:0}};
 display.dataset.cabinLayout=JSON.stringify(seats);activity.value='auto';cabin3DClient();pump(clock+=100);
 for(const id of ['a','b']){
  display.handlers['cabin-seat-target']({detail:id});activity.value='sit';activity.handlers.change();pump(clock+=100);settle('sit');assert.equal(canvas.dataset.seatedInstance,id);assert.equal(canvas.dataset.ownerCount,'1');
  const at=seats[id],spec=bedroomCatalog[type].seat,position=JSON.parse(canvas.dataset.ownerPosition),angle=at.r*Math.PI/2;
  assert.ok(Math.abs(position.x-(at.x+Math.sin(angle)*spec.z))<.001);assert.ok(Math.abs(position.z-(at.z+Math.cos(angle)*spec.z))<.001);assert.ok(Math.abs(position.heading-(angle+spec.facing))<.001);
 }
 activity.value='wake';activity.handlers.change();pump(clock+=100);assert.equal(canvas.dataset.posture,'standing');
}
// All additions retain normal independent editor operations and shared footprint validation.
raf.clear();display.dataset.cabinLayout='{}';activity.value='auto';cabin3DClient();pump(clock+=100);
for(const type of ['reading_chair','chair','vanity_stool','vanity','bedside_lamp','display_case','teddy_plush','cushion'])command('add:'+type);
let additions=JSON.parse(display.dataset.cabinLayout);assert.equal(Object.keys(additions).length,8);assert.equal(cabinLayoutProblem(additions,true,'bedroom-instances'),'');
const lampId=Object.keys(additions).find(id=>additions[id].furniture_type==='bedside_lamp'),layoutBeforeLamp=display.dataset.cabinLayout;
display.handlers['cabin-lamp-toggle']({detail:lampId});assert.deepEqual(JSON.parse(canvas.dataset.litLamps),[lampId]);display.handlers['cabin-lamp-toggle']({detail:lampId});assert.deepEqual(JSON.parse(canvas.dataset.litLamps),[]);assert.equal(display.dataset.cabinLayout,layoutBeforeLamp);
console.log('Three seat types × four rotations, duplicate seat targeting, new meshes, footprint constraints and visible per-instance lamp state passed.');
// Living-room legacy chair: a real mesh tap must start seating, without converting the save.
for(const r of [0,1,2,3]){
 raf.clear();display.dataset.cabinRoom='living';display.dataset.cabinInstances='0';display.dataset.bearSpecies='bear';
 const legacy={...cabinLayoutDefaults,chair:{x:-1.3,z:2.3,r},bed:{x:3.5,z:2.4,r:0}};assert.equal(cabinLayoutProblem(legacy),'');
 display.dataset.cabinLayout=JSON.stringify(legacy);display.dataset.cabinGuest='ari';activity.value='auto';
 cabin3DClient();pump(clock+=100);nodes['[data-cabin-camera]'].handlers.click({target:{closest(){return {dataset:{cameraAction:'reset'}}}}});pump(clock+=100);
 tapAt(project([-1.3,.85,2.3]),61);settle('sit');
 assert.equal(canvas.dataset.posture,'sitting');assert.equal(canvas.dataset.seatedInstance,'chair');assert.equal(canvas.dataset.ownerCount,'1');
 assert.equal(display.dataset.cabinLayout,JSON.stringify(legacy));assert.equal(nodes['[data-game-wake]'].hidden,false);
 const position=JSON.parse(canvas.dataset.ownerPosition),spec=bedroomCatalog.chair.seat,angle=r*Math.PI/2;
 assert.ok(Math.abs(position.x-(-1.3+Math.sin(angle)*spec.z))<.001);assert.ok(Math.abs(position.z-(2.3+Math.cos(angle)*spec.z))<.001);
 activity.value='wake';activity.handlers.change();pump(clock+=100);assert.equal(canvas.dataset.posture,'standing');
 display.handlers['cabin-seat-target']({detail:'chair'});activity.value='sit';activity.handlers.change();settle('sit');
 activity.value='sleep';activity.handlers.change();settle('sleep');assert.equal(canvas.dataset.seatedInstance,'');
 activity.value='wake';activity.handlers.change();pump(clock+=100);command('start');tapAt(project([-1.3,.85,2.3]),62);assert.notEqual(canvas.dataset.posture,'sitting');command('cancel');
 assert.equal(display.dataset.cabinLayout,JSON.stringify(legacy));
}
console.log('Living-room mesh tap sits on the moved chair in four rotations; stand, bed transition, edit isolation and unchanged legacy layout passed.');
// P0: five consecutive independent moves, three rotations, duplicate and exact undo.
{
 raf.clear();display.dataset.cabinRoom='bedroom';display.dataset.cabinInstances='1';activity.value='auto';
 const types=['plant','lamp','chair','bedside_table','wardrobe'],positions=[[-1,0],[1,0],[3,0],[-1,2],[1,2]];
 const pieces=Object.fromEntries(types.map((type,i)=>['p'+i,{id:'p'+i,room_id:'bedroom',furniture_type:type,x:positions[i][0],z:positions[i][1],r:0,layer:0,created_at:1,updated_at:1}]));
 display.dataset.cabinLayout=JSON.stringify(pieces);cabin3DClient();pump(clock+=100);
 for(let i=0;i<5;i++){command('select:p'+i);command('right');const current=JSON.parse(display.dataset.cabinLayout);assert.equal(current['p'+i].x,pieces['p'+i].x+.25);for(let j=i+1;j<5;j++)assert.deepEqual(current['p'+j],pieces['p'+j]);}
 for(let i=0;i<3;i++){command('select:p'+i);command('rotate');assert.equal(JSON.parse(display.dataset.cabinLayout)['p'+i].r,1);}
 command('select:p0');const before=JSON.parse(display.dataset.cabinLayout);command('duplicate');const after=JSON.parse(display.dataset.cabinLayout),id=Object.keys(after).find(k=>!before[k]);
 assert.equal(Object.keys(after).length,6);assert.ok(id);assert.equal(after[id].id,id);assert.equal(after[id].r,before.p0.r);assert.equal(after[id].furniture_type,before.p0.furniture_type);assert.notEqual(after[id].x+':'+after[id].z,before.p0.x+':'+before.p0.z);for(const key of Object.keys(before))assert.deepEqual(after[key],before[key]);
 command('undo');assert.deepEqual(JSON.parse(display.dataset.cabinLayout),before);
 command('select:p0');command('duplicate');const again=JSON.parse(display.dataset.cabinLayout),copy=Object.keys(again).find(k=>!before[k]);assert.notEqual(copy,id);
 command('remove');assert.deepEqual(JSON.parse(display.dataset.cabinLayout),before);command('undo');assert.deepEqual(JSON.parse(display.dataset.cabinLayout),again);
 command('finish');assert.equal(canvas.dataset.selection,'');
 // Limit and legacy scope: copying must not exceed 25 or create living-room instances.
 raf.clear();display.dataset.cabinLayout='{}';cabin3DClient();pump(clock+=100);for(let i=0;i<25;i++)command('add:plant');const full=display.dataset.cabinLayout;command('duplicate');assert.equal(display.dataset.cabinLayout,full);
 raf.clear();display.dataset.cabinRoom='living';display.dataset.cabinInstances='0';display.dataset.cabinLayout=JSON.stringify(cabinLayoutDefaults);cabin3DClient();pump(clock+=100);command('select:chair');const old=display.dataset.cabinLayout;command('duplicate');assert.equal(display.dataset.cabinLayout,old);
 console.log('P0 five moves, three rotations, fresh duplicate IDs, preserved originals, exact undo/delete, 25 limit and unchanged living-room format passed.');
}

// Cat and rabbit share the same furniture navigation and real resting posture.
for(const species of ['cat','rabbit']){
 raf.clear();display.dataset.cabinRoom='living';display.dataset.cabinInstances='0';display.dataset.bearSpecies=species;display.dataset.cabinLayout=JSON.stringify({...cabinLayoutDefaults,chair:{x:-1.3,z:2.3,r:0},bed:{x:3.5,z:2.4,r:0}});activity.value='auto';cabin3DClient();pump(clock+=100);
 display.handlers['cabin-seat-target']({detail:'chair'});activity.value='sit';activity.handlers.change();settle('sit');assert.equal(canvas.dataset.species,species);assert.equal(canvas.dataset.posture,'sitting');
 activity.value='sleep';activity.handlers.change();settle('sleep');assert.equal(canvas.dataset.posture,'sleeping');assert.equal(canvas.dataset.ownerCount,'1');assert.equal(canvas.dataset.species,species);
 activity.value='wake';activity.handlers.change();pump(clock+=100);assert.equal(canvas.dataset.posture,'standing');
}
console.log('Cat/rabbit chair approach, sit, bed approach, sleep, wake and single species-matched owner passed.');

// V83 daily actions share collision navigation and retain all species.
for(const species of ['bear','cat','rabbit']){
 raf.clear();display.dataset.cabinRoom='living';display.dataset.cabinInstances='0';display.dataset.bearSpecies=species;display.dataset.cabinLayout=JSON.stringify({...cabinLayoutDefaults,bed:{x:3.5,z:2.4,r:0},displaycase:{x:3.4,z:.3,r:0}});activity.value='auto';cabin3DClient();pump(clock+=100);
 display.handlers['cabin-cozy-activity']({detail:'window'});settle('window');assert.equal(canvas.dataset.species,species);
 display.handlers['cabin-cozy-activity']({detail:'desk'});settle('desk');
 activity.value='sleep';activity.handlers.change();settle('sleep');activity.value='wake';activity.handlers.change();pump(clock+=100);assert.equal(canvas.dataset.activity,'stretch');
 for(let i=0;i<40;i++)pump(clock+=100);assert.notEqual(canvas.dataset.activity,'stretch');
}
console.log('V83 bear/cat/rabbit window and desk navigation, sleep/wake stretch and resumed walking passed.');
