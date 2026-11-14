// Bedroom-only instance catalog. Legacy meshes remain usable without changing living-room saves.
export const bedroomCatalog={
 vanity_stool:{name:'梳妝圓凳',mesh:'vanity_stool',size:[.68,.68],seat:{y:.62,z:0,facing:0}},
 vanity:{name:'梳妝台',mesh:'vanity',size:[1.3,.65]},bedside_lamp:{name:'床頭櫃＋小夜燈',mesh:'bedside_lamp',size:[.65,.65]},teddy_plush:{name:'熊熊玩偶',mesh:'teddy_plush',size:[.6,.6]},cushion:{name:'柔軟抱枕',mesh:'cushion',size:[.7,.65]},
 reading_chair:{name:'閱讀扶手椅',mesh:'reading_chair',size:[1.15,1.05],seat:{y:.72,z:.04,facing:0}},
 single_bed:{name:'單人床',mesh:'bed',size:[1.4,2.1]},double_bed:{name:'雙人床',mesh:'bed',size:[2.2,2.1]},
 bedside_table:{name:'床頭櫃',mesh:'nightstand',size:[.65,.65]},rug:{name:'地毯',mesh:'rug',size:[3.5,2.5]},wardrobe:{name:'衣櫃',mesh:'wardrobe',size:[1.35,.65]},plant:{name:'盆栽',mesh:'plant',size:[.65,.65]},
 lamp:{name:'小夜燈',mesh:'nightlight',size:[.55,.55]},sofa:{name:'小沙發',mesh:'sofa',size:[1.6,1.1]},coffee_table:{name:'茶几',mesh:'coffeetable',size:[1.1,.7]},desk:{name:'書桌',mesh:'writingdesk',size:[1.3,.8]},shelf:{name:'書架',mesh:'bookshelf',size:[1.1,.55]},display_case:{name:'展示櫃',mesh:'displaycase',size:[1.1,.6]},dining_table:{name:'小餐桌',mesh:'diningtable',size:[1.2,1.1]},legacy_table:{name:'桌子',mesh:'table',size:[1.5,1.2]},chair:{name:'一般木椅',mesh:'chair',size:[.85,.9],seat:{y:.79,z:-.1,facing:Math.PI}},legacy_corner:{name:'角落擺設',mesh:'corner',size:[.9,.9]}
};
export function bedroomProblem(layout){
 if(!layout||typeof layout!=='object'||Array.isArray(layout)||Object.keys(layout).length>25)return '臥室最多可放 25 件家具。';
 for(const [id,p] of Object.entries(layout)){
  if(!/^[a-zA-Z0-9_-]{1,64}$/.test(id)||!p||p.id!==id||p.room_id!=='bedroom'||!Object.hasOwn(bedroomCatalog,p.furniture_type)||!Number.isFinite(p.x)||!Number.isFinite(p.z)||!Number.isInteger(p.r)||p.r<0||p.r>3||!Number.isFinite(p.layer)||p.layer!== (p.furniture_type==='rug'?-.75:0)||!Number.isSafeInteger(p.created_at)||p.created_at<0||!Number.isSafeInteger(p.updated_at)||p.updated_at<0)return '家具實例資料無效。';
  const size=bedroomCatalog[p.furniture_type].size,w=size[p.r%2?1:0],d=size[p.r%2?0:1];
  if(p.x-w/2< -2.700001||p.x+w/2>4.300001||p.z-d/2< -2.400001||p.z+d/2>3.800001)return '家具超出房間了，請往裡面放一點。';
  if(p.furniture_type!=='rug'&&Math.abs(p.x+1.7)<(w+1.5)/2-.025&&Math.abs(p.z+2.2)<(d+.65)/2-.025)return '這裡要留給門口通行，請換個位置。';
 }
 return '';
}
export function bedroomFromLegacy(legacy,now){
 const result={};for(const [mesh,p] of Object.entries(legacy)){
  const type=Object.keys(bedroomCatalog).find(k=>bedroomCatalog[k].mesh===mesh);if(!type)throw Error('Unknown legacy furniture');
  const id='legacy-'+mesh;result[id]={id,room_id:'bedroom',furniture_type:type,x:p.x,z:p.z,r:p.r,layer:type==='rug'?-.75:0,created_at:now,updated_at:now};
 }if(bedroomProblem(result))throw Error('Invalid legacy bedroom');return result;
}
export async function loadBedroom(db,visitor,legacy,decoded){
 let state=await db.prepare("SELECT * FROM island_bedroom_layouts WHERE visitor_key=? AND room_id='bedroom'").bind(visitor).first();
 if(!state){
  const now=Date.now(),layout=bedroomFromLegacy(decoded,now),statements=[db.prepare("INSERT INTO island_bedroom_layouts(visitor_key,room_id,theme,revision,legacy_backup_json,write_token) VALUES(?,'bedroom',?,1,?,'') ON CONFLICT DO NOTHING").bind(visitor,legacy.theme,JSON.stringify(legacy))];
  // The transaction and migration flag make concurrent/repeated first loads idempotent.
  for(const p of Object.values(layout))statements.push(db.prepare("INSERT INTO island_bedroom_instances(visitor_key,room_id,id,furniture_type,x,y,rotation,layer,created_at,updated_at) SELECT ?,'bedroom',?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM island_bedroom_layouts WHERE visitor_key=? AND room_id='bedroom' AND migrated=0)").bind(visitor,p.id,p.furniture_type,p.x,p.z,p.r,p.layer,p.created_at,p.updated_at,visitor));
  statements.push(db.prepare("UPDATE island_bedroom_layouts SET migrated=1 WHERE visitor_key=? AND room_id='bedroom' AND migrated=0").bind(visitor));await db.batch(statements);
  state=await db.prepare("SELECT * FROM island_bedroom_layouts WHERE visitor_key=? AND room_id='bedroom'").bind(visitor).first();
 }
 if(state.migrated!==1)throw Error('Bedroom migration incomplete');
 const rows=(await db.prepare("SELECT * FROM island_bedroom_instances WHERE visitor_key=? AND room_id='bedroom' ORDER BY created_at,id").bind(visitor).all()).results;
 const layout=Object.fromEntries(rows.map(p=>[p.id,{id:p.id,room_id:p.room_id,furniture_type:p.furniture_type,x:p.x,z:p.y,r:p.rotation,layer:p.layer,created_at:p.created_at,updated_at:p.updated_at}]));if(bedroomProblem(layout))throw Error('Bedroom instance validation failed');
 return {...state,layout};
}
export async function saveBedroom(db,visitor,theme,revision,layout){
 const token=crypto.randomUUID(),now=Date.now(),existing=(await db.prepare("SELECT id,created_at FROM island_bedroom_instances WHERE visitor_key=? AND room_id='bedroom'").bind(visitor).all()).results;
 const created=new Map(existing.map(p=>[p.id,p.created_at]));
 const guard="EXISTS(SELECT 1 FROM island_bedroom_layouts WHERE visitor_key=? AND room_id='bedroom' AND write_token=?)";
 const statements=[db.prepare("UPDATE island_bedroom_layouts SET theme=?,revision=revision+1,write_token=? WHERE visitor_key=? AND room_id='bedroom' AND revision=?").bind(theme,token,visitor,revision),db.prepare("DELETE FROM island_bedroom_instances WHERE visitor_key=? AND room_id='bedroom' AND "+guard).bind(visitor,visitor,token)];
 for(const p of Object.values(layout))statements.push(db.prepare("INSERT INTO island_bedroom_instances(visitor_key,room_id,id,furniture_type,x,y,rotation,layer,created_at,updated_at) SELECT ?,'bedroom',?,?,?,?,?,?,?,? WHERE "+guard).bind(visitor,p.id,p.furniture_type,p.x,p.z,p.r,p.layer,created.get(p.id)??now,now,visitor,token));
 const result=await db.batch(statements);return Number(result[0].meta.changes)>0;
}
