// Authoritative island simulation. No player IDs, wallets, transaction ledger or POST inputs.
const economyFreeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(economyFreeze);Object.freeze(value);}return value;};
export const economyConfig=economyFreeze({version:'bear-sim-1',source:'official-island-simulation',status:'simulated',baseStart:Date.UTC(2026,10,8,16),weekMs:604800000,priceElasticity:.5,priceFloor:.5,priceCeiling:2,weights:{trades:.4,output:.25,cafe:.2,consumption:.15},goods:[
 {id:'carrot',basePrice:10,basketQty:8,baseSupply:100,baseDemand:100},
 {id:'pumpkin',basePrice:20,basketQty:3,baseSupply:60,baseDemand:60},
 {id:'coffee',basePrice:30,basketQty:4,baseSupply:80,baseDemand:80},
 {id:'fish',basePrice:25,basketQty:3,baseSupply:70,baseDemand:70},
 {id:'wood',basePrice:15,basketQty:4,baseSupply:50,baseDemand:50},
 {id:'materials',basePrice:40,basketQty:2,baseSupply:40,baseDemand:40}
],events:[{id:'harvest',good:'carrot',supply:1.4,demand:1},{id:'festival',good:'coffee',supply:1.2,demand:1.4},{id:'building',good:'wood',supply:1,demand:1.3}]});
export function economyPeriod(now=Date.now()){if(!Number.isFinite(now))throw Error('Invalid clock');return Math.max(0,Math.floor((now-economyConfig.baseStart)/economyConfig.weekMs));}
const econRound=n=>Math.round((n+Number.EPSILON)*10000)/10000;
export function economyMarket(eventId='stable',intensity=1){
 if(!['stable',...economyConfig.events.map(e=>e.id)].includes(eventId)||![0,1,2].includes(intensity))throw Error('Unsupported scenario');
 const event=economyConfig.events.find(e=>e.id===eventId);
 return economyConfig.goods.map(g=>{const supply=g.baseSupply*(event?.good===g.id?1+(event.supply-1)*intensity:1),demand=g.baseDemand*(event?.good===g.id?1+(event.demand-1)*intensity:1),ratio=Math.max(economyConfig.priceFloor,Math.min(economyConfig.priceCeiling,(demand/supply)**economyConfig.priceElasticity));return {...g,supply:econRound(supply),demand:econRound(demand),quantity:econRound(Math.min(supply,demand)),price:econRound(g.basePrice*ratio),priceRatio:econRound(ratio)};});
}
export function economyIndices(rows){
 const sum=fn=>rows.reduce((a,g)=>a+fn(g),0),baseUnits=sum(g=>g.baseSupply),baseBasket=sum(g=>g.basePrice*g.basketQty);
 const components={trades:sum(g=>g.quantity)/baseUnits,output:sum(g=>g.supply)/baseUnits,cafe:rows.find(g=>g.id==='coffee').quantity/80,consumption:sum(g=>g.basePrice*g.quantity)/sum(g=>g.basePrice*g.baseDemand)};
 const bbi=100*Object.entries(economyConfig.weights).reduce((a,[k,w])=>a+components[k]*w,0),basketCost=sum(g=>g.price*g.basketQty);
 return {bbi:econRound(bbi),bcpi:econRound(100*basketCost/baseBasket),baseBasket,basketCost:econRound(basketCost),components:Object.fromEntries(Object.entries(components).map(([k,v])=>[k,econRound(v)])),contributions:Object.fromEntries(Object.entries(components).map(([k,v])=>[k,econRound(100*economyConfig.weights[k]*(v-1))]))};
}
export function economySnapshot(period){
 if(!Number.isSafeInteger(period)||period<0||period>5200)throw Error('Invalid period');
 const event=period===0?null:economyConfig.events[(period-1)%4]||null,start=economyConfig.baseStart+period*economyConfig.weekMs,goods=economyMarket(event?.id||'stable');
 const result={period,start,end:start+economyConfig.weekMs,version:economyConfig.version,source:economyConfig.source,status:economyConfig.status,event:event?{...event,id:economyConfig.version+':'+period+':'+event.id,kind:event.id,start,end:start+economyConfig.weekMs}:null,goods,...economyIndices(goods)};
 if(period===0)return {...result,bbiWeekly:null,bcpiWeekly:null,bbiBaseChange:0,bcpiBaseChange:0,bcpiAnnual:null,annualReference:null};
 const previous=economyIndices(economyMarket(economyConfig.events[(period-2)%4]?.id||'stable'));
 const priorYear=new Date(start);priorYear.setUTCFullYear(priorYear.getUTCFullYear()-1);const annualPeriod=Math.floor((priorYear.getTime()-economyConfig.baseStart)/economyConfig.weekMs);
 const annual=annualPeriod>=0?economyIndices(economyMarket(annualPeriod===0?'stable':economyConfig.events[(annualPeriod-1)%4]?.id||'stable')):null;
 return {...result,bbiWeekly:econRound((result.bbi/previous.bbi-1)*100),bcpiWeekly:econRound((result.bcpi/previous.bcpi-1)*100),bbiBaseChange:econRound(result.bbi-100),bcpiBaseChange:econRound(result.bcpi-100),bcpiAnnual:annual?econRound((result.bcpi/annual.bcpi-1)*100):null,annualReference:annual?annualPeriod:null};
}
async function economyHash(value){const bytes=new TextEncoder().encode(value),digest=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('');}
export async function economyOfficial(db,now=Date.now()){
 const period=economyPeriod(now);if(period>5200)throw Error('Simulation version expired');
 const config=JSON.stringify(economyConfig);const existing=await db.prepare('SELECT config_json FROM island_economy_config WHERE version=?').bind(economyConfig.version).first();
 if(existing&&existing.config_json!==config)throw Error('Economy configuration version mismatch');
 if(!existing)await db.batch([db.prepare('INSERT OR IGNORE INTO island_economy_config(version,config_json,created_at) VALUES(?,?,?)').bind(economyConfig.version,config,now),...economyConfig.goods.map(g=>db.prepare('INSERT OR IGNORE INTO island_economy_goods(version,good_id,definition_json) VALUES(?,?,?)').bind(economyConfig.version,g.id,JSON.stringify(g)))]);
 const saved=await db.prepare('SELECT period,snapshot_json,digest FROM island_economy_snapshots WHERE version=? AND period<=? ORDER BY period').bind(economyConfig.version,period).all(),found=new Map(saved.results.map(row=>[row.period,row]));
 for(let i=0;i<=period;i++){
  const snapshot=economySnapshot(i),json=JSON.stringify(snapshot),old=found.get(i);
  if(old){if(old.snapshot_json!==json||old.digest!==await economyHash(json))throw Error('Economy snapshot integrity failure');continue;}
  const digest=await economyHash(json),statements=[db.prepare('INSERT OR IGNORE INTO island_economy_snapshots(version,period,start_at,end_at,source,status,snapshot_json,digest,created_at) VALUES(?,?,?,?,?,?,?,?,?)').bind(snapshot.version,i,snapshot.start,snapshot.end,snapshot.source,snapshot.status,json,digest,now),...snapshot.goods.map(g=>db.prepare('INSERT OR IGNORE INTO island_economy_prices(version,period,good_id,price,supply,demand,quantity) VALUES(?,?,?,?,?,?,?)').bind(snapshot.version,i,g.id,g.price,g.supply,g.demand,g.quantity))];
  if(snapshot.event)statements.push(db.prepare('INSERT OR IGNORE INTO island_economy_events(id,version,period,kind,start_at,end_at,event_json) VALUES(?,?,?,?,?,?,?)').bind(snapshot.event.id,snapshot.version,i,snapshot.event.kind,snapshot.start,snapshot.end,JSON.stringify(snapshot.event)));
  await db.batch(statements);
 }
 const rows=await db.prepare('SELECT period,snapshot_json,digest FROM island_economy_snapshots WHERE version=? AND period BETWEEN ? AND ? ORDER BY period').bind(economyConfig.version,Math.max(0,period-12),period).all();
 for(const row of rows.results){if(row.snapshot_json!==JSON.stringify(economySnapshot(row.period))||row.digest!==await economyHash(row.snapshot_json))throw Error('Snapshot mismatch');}
 if(rows.results.length!==Math.min(13,period+1))throw Error('Missing snapshot');
 return {config:economyConfig,current:JSON.parse(rows.results.at(-1).snapshot_json),history:rows.results.map(row=>JSON.parse(row.snapshot_json)),integrity:{algorithm:'SHA-256',digests:rows.results.map(row=>({period:row.period,digest:row.digest}))}};
}
