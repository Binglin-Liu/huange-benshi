(function(root){
  'use strict';
  const normalize=value=>String(value??'').trim().toLowerCase().replace(/\s+/g,'');
  const aliases={'python编程':'python','python入门':'python','拍照':'摄影','手机摄影':'摄影','英文口语':'英语口语','英语':'英语口语','excel表格':'excel','手冲咖啡':'咖啡手冲','figma':'ui设计'};
  const skill=value=>aliases[normalize(value)]||normalize(value);
  function assess(person,profile){
    const learns=skill(person.teach)===skill(profile.learn);
    const teaches=skill(person.learn)===skill(profile.teach);
    const time=person.time===profile.time||profile.time==='灵活协商';
    const mode=person.mode===profile.mode;
    return {learns,teaches,time,mode,mutual:learns&&teaches,score:(learns?40:0)+(teaches?40:0)+(time?10:0)+(mode?10:0)};
  }
  const active=x=>['待回应','已约定'].includes(x.status);
  function advance(exchange){
    if(exchange.status==='待回应')return {...exchange,status:'已约定',checks:[false,false,false]};
    if(exchange.status==='已约定'&&exchange.checks?.every(Boolean)&&exchange.checks.length===3)return {...exchange,status:'已完成',completedAt:new Date().toISOString()};
    throw new Error('请先完成三个交换步骤');
  }
  function restore(raw,defaults){
    let saved;try{saved=JSON.parse(raw)}catch{}
    const text=(value,fallback,max=200)=>typeof value==='string'&&value.trim()?value.slice(0,max):fallback;
    const p=saved?.profile??{};
    return {profile:{...defaults,teach:text(p.teach,defaults.teach,30),learn:text(p.learn,defaults.learn,30),time:['周末下午','工作日晚上','周末上午','灵活协商'].includes(p.time)?p.time:defaults.time,mode:['线上','线下'].includes(p.mode)?p.mode:defaults.mode,level:text(p.level,defaults.level,40),goal:typeof p.goal==='string'?p.goal.slice(0,160):defaults.goal,published:p.published===true},favorites:Array.isArray(saved?.favorites)?[...new Set(saved.favorites.filter(Number.isInteger))]:[],exchanges:Array.isArray(saved?.exchanges)?saved.exchanges.filter(x=>x&&typeof x.id==='string'&&['待回应','已约定','已完成','已取消'].includes(x.status)).map(x=>({...x,name:text(x.name,'伙伴',30),teach:text(x.teach,'技能',30),learn:text(x.learn,'新技能',30),goal:text(x.goal,'完成一次入门练习',100),time:text(x.time,'灵活协商',30),mode:text(x.mode,'线上',10),duration:text(x.duration,'30 分钟',20),checks:Array.isArray(x.checks)&&x.checks.length===3?x.checks.map(Boolean):[false,false,false],note:typeof x.note==='string'?x.note.slice(0,600):'',rating:Number.isInteger(x.rating)&&x.rating>=1&&x.rating<=5?x.rating:0})):[]};
  }
  const api={normalize,skill,assess,active,advance,restore};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SwapModel=api;
})(typeof window!=='undefined'?window:globalThis);
