export const gardenCrops=[
 {id:'herb',minutes:5,price:2,sell:3},
 {id:'carrot',minutes:15,price:2,sell:4},
 {id:'tomato',minutes:30,price:3,sell:6},
 {id:'rice',minutes:60,price:3,sell:8,paddy:true},
 {id:'sunflower',minutes:45,price:3,sell:6,unlock:true},
];
export const natureItemCopy={
 seed:['種子','Seed'],produce:['田園收成','Garden produce'],fish:['池邊發現','Pond find'],sourceGarden:['來源：自己的花園或稻田','Source: your garden or rice paddy'],sourcePond:['來源：池邊釣魚','Source: pond fishing'],
 seed_herb:['香草種子','Herb seeds'],seed_herbNote:['種下後澆一次水，五分鐘後可收成。','Plant and water once. Ready to harvest in five minutes.'],
 seed_carrot:['胡蘿蔔種子','Carrot seeds'],seed_carrotNote:['種下後澆一次水，十五分鐘後可收成。','Plant and water once. Ready to harvest in fifteen minutes.'],
 seed_tomato:['番茄種子','Tomato seeds'],seed_tomatoNote:['種下後澆一次水，三十分鐘後可收成。','Plant and water once. Ready to harvest in thirty minutes.'],
 seed_rice:['稻種','Rice seeds'],seed_riceNote:['種在第四格稻田，灌水後六十分鐘可收成。','Plant in paddy plot four. Ready sixty minutes after watering.'],
 seed_sunflower:['向日葵種子','Sunflower seeds'],seed_sunflowerNote:['收成過香草、胡蘿蔔與番茄後解鎖；澆水後四十五分鐘開花。','Unlock after harvesting herbs, carrots and tomatoes. Blooms forty-five minutes after watering.'],
 herb:['新鮮香草','Fresh herbs'],herbNote:['自己種出的清香，可展示、換島幣、交換或送朋友。','Homegrown fragrance to display, sell, trade or give to a friend.'],
 carrot:['田園胡蘿蔔','Garden carrot'],carrotNote:['一顆種子收成兩份，讓小小菜圃有真實的回饋。','One seed yields two carrots, a little reward from your garden.'],
 tomato:['紅潤番茄','Ripe tomato'],tomatoNote:['成熟後會一直等你，不會因晚登入而腐壞。','Ripe tomatoes wait for you and never spoil because you signed in late.'],
 rice:['金色稻穗','Golden rice'],riceNote:['從小小稻田收成的稻穗，可帶回小屋展示。','Harvested from your little paddy, ready for a cottage display.'],
 sunflower:['小小向日葵','Little sunflower'],sunflowerNote:['種過三種蔬菜後的新發現，替小屋留一束陽光。','A discovery after growing three crops, a little sunshine for your cottage.'],
 silverfish:['銀色小溪魚','Silver stream fish'],silverfishNote:['池邊的遊戲收藏，可展示、交換或贈送，不含真實交易。','A virtual pond keepsake to display, trade or gift, with no real-world transaction.'],
 pondcarp:['池塘小鯉魚','Little pond carp'],pondcarpNote:['釣起後收進共用背包；養殖與繁殖尚未開放。','A catch for your shared backpack. Breeding and aquaculture are not available yet.'],
 garden:['我的花園','My garden'],trades:['物物交換','Item exchange'],locked:['收成香草、胡蘿蔔、番茄後解鎖。','Unlock by harvesting herbs, carrots and tomatoes.'],
 starterAction:['領取種子包','Starter seeds'],starter_seedAction:['種子包入袋','Starter seed credit'],plantAction:['種植','Planted'],plant_seedAction:['種植耗用種子','Seed used'],waterAction:['澆水','Watered'],harvestAction:['收成','Harvested'],castAction:['池邊下竿','Cast a line'],catchAction:['池邊收竿','Reeled in'],trade_postAction:['交換暫存物品','Item held for exchange'],trade_acceptAction:['確認交換','Exchange accepted'],trade_cancelAction:['撤回交換','Exchange cancelled'],trade_declineAction:['婉拒交換','Exchange declined'],trade_receivedAction:['交換取得物品','Exchange item received'],trade_paidAction:['交換交出物品','Exchange item sent'],trade_returnedAction:['交換物品退回','Exchange item returned'],
};
export const natureItems=[
 ...gardenCrops.map(c=>({id:'seed_'+c.id,source:'shop',type:'seed',rarity:'ordinary',price:c.price,display:false,unlock:c.unlock})),
 ...gardenCrops.map(c=>({id:c.id,source:'garden',type:'produce',rarity:c.unlock?'unusual':'ordinary',sell:c.sell})),
 {id:'silverfish',source:'pond',type:'fish',rarity:'ordinary',sell:3},
 {id:'pondcarp',source:'pond',type:'fish',rarity:'unusual',sell:4},
];
export function natureItemArt(id){
 const seed=id.startsWith('seed_'),crop=seed?id.slice(5):id;
 const leaf='<path d="M60 57V26m0 14q-27-25-31-8 7 17 31 8m0-7q26-26 31-8-8 16-31 8" fill="#86a36e" stroke="#5d8058" stroke-width="3"/>';
 const art={herb:leaf+'<path d="M44 67q-22-29-30-10 4 20 30 10m0 0 16 21 18-23q25 0 24-20-20-7-24 20" fill="#73996a"/><path d="M60 55v48" stroke="#597d51" stroke-width="4"/>',carrot:leaf+'<path d="m43 49 37 3-25 55Q33 84 43 49Z" fill="#e0a36b" stroke="#b27b4e" stroke-width="3"/><path d="m43 65 20 4m-15 14 11 3" stroke="#f1c292" stroke-width="3"/>',tomato:'<circle cx="60" cy="74" r="32" fill="#cf8e77" stroke="#a56b57" stroke-width="3"/><path d="m60 34 8 15 15-2-14 11 3 13-13-10-16 6 8-15-7-11 14 6Z" fill="#78996a"/>',rice:'<path d="M44 108 61 25m-8 51 27-32M49 90 29 57" fill="none" stroke="#9d985b" stroke-width="4"/><g fill="#d5ba75">'+[[62,30],[58,45],[55,60],[70,58],[78,48],[36,70],[31,59]].map(([x,y])=>'<ellipse cx="'+x+'" cy="'+y+'" rx="6" ry="10" transform="rotate(30 '+x+' '+y+')"/>').join('')+'</g>',sunflower:'<path d="M60 105V48" stroke="#78986a" stroke-width="5"/><g fill="#ddbf72">'+Array.from({length:8},(_,i)=>'<ellipse cx="60" cy="28" rx="10" ry="17" transform="rotate('+(i*45)+' 60 49)"/>').join('')+'</g><circle cx="60" cy="49" r="17" fill="#9c8057"/>'+leaf};
 const fish='<path d="M24 65 8 47v36Zm0 0q28-39 74 0-46 39-74 0Z" fill="'+(id==='pondcarp'?'#cba87e':'#a6c6c3')+'" stroke="#779694" stroke-width="3"/><circle cx="82" cy="61" r="3" fill="#344c43"/><path d="m45 53 16-15 8 15m-21 26 16 13 4-14" fill="#9caf9d"/>';
 if(seed)return '<rect x="27" y="18" width="66" height="88" rx="8" fill="#eee2bd" stroke="#b3a17a" stroke-width="3"/><path d="M27 37h66" stroke="#b3a17a" stroke-width="2"/><g transform="translate(25 31) scale(.58)">'+(art[crop]||leaf)+'</g>';
 return art[crop]||fish;
}
