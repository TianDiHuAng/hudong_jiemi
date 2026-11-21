#!/usr/bin/env node
// 用法: node tools/validate.js game.json   退出码0=通过, 1=有问题
const fs=require("fs");const G=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));
const out={errors:[],checks:[]};const add=(n,ok,t)=>{out.checks.push({n,ok,t});if(!ok)out.errors.push(n+": "+t)};
// 结构检查：引用的房间、物品必须存在
const bad=[];G.acts.forEach(a=>{if(!G.rooms[a.room])bad.push(a.id+" 房间不存在");if(a.go&&!G.rooms[a.go])bad.push(a.id+" 目标房间不存在");
const r=a.req||{},e=a.eff||{};[...(r.i||[]),...(e.i||[]),...(e.rm||[])].forEach(x=>{if(!G.items[x])bad.push(a.id+" 物品不存在:"+x)})});
if(new Set(G.acts.map(a=>a.id)).size!==G.acts.length)bad.push("动作ID重复");
if((G.flagLimit||20)<new Set(G.acts.flatMap(a=>[...(a.eff?.f||[]),...(a.req?.f||[]),...(a.n||[])])).size)bad.push("状态标志过多（限制"+(G.flagLimit||20)+"）");
add("结构完整",!bad.length,bad.join("；")||"引用与ID均有效");
const has=(s,a)=>{const r=a.req||{};return a.room===s.room&&(r.i||[]).every(x=>s.i.includes(x))&&(r.f||[]).every(x=>s.f.includes(x))&&(a.n||[]).every(x=>!s.f.includes(x))};
const avail=s=>s.end?[]:G.acts.filter(a=>has(s,a));
const ap=(s,a)=>{const e=a.eff||{},i=new Set(s.i),f=new Set(s.f);(e.i||[]).forEach(x=>i.add(x));(e.rm||[]).forEach(x=>i.delete(x));(e.f||[]).forEach(x=>f.add(x));return{room:a.go||s.room,i:[...i].sort(),f:[...f].sort(),end:a.end||null}};
const key=s=>s.room+"|"+s.i+"|"+s.f+"|"+(s.end||"");
const s0={room:G.start,i:[],f:[],end:null},M={[key(s0)]:{s:s0,p:null,via:null}},Q=[s0],rev={},used={};
for(let q=0;q<Q.length;q++){if(Q.length>200000){add("状态规模",false,"状态数超过20万，请简化关卡");break}
const s=Q[q],ks=key(s);for(const a of avail(s)){used[a.id]=1;const t=ap(s,a),kt=key(t);(rev[kt]=rev[kt]||[]).push(ks);if(!M[kt]){M[kt]={s:t,p:ks,via:a};Q.push(t)}}}
const keys=Object.keys(M),win=keys.filter(k=>M[k].s.end==="win"),can={},st=[...win];win.forEach(k=>can[k]=1);
while(st.length){const k=st.pop();(rev[k]||[]).forEach(p=>{if(!can[p]){can[p]=1;st.push(p)}})}
const lock=keys.filter(k=>!M[k].s.end&&!can[k]);
let path=[];if(win.length){let c=win[0];while(M[c].via){path.unshift(M[c].via.label);c=M[c].p}}
add("可通关",win.length>0,win.length?"最短"+path.length+"步":"无法到达胜利结局");
add("无死局与软锁",!lock.length,lock.length?lock.length+"个状态无法再通关，例："+JSON.stringify(M[lock[0]].s)+"，到达方式："+(()=>{let c=lock[0],p=[];while(M[c].via){p.unshift(M[c].via.label);c=M[c].p}return p.join(" → ")})():"共"+keys.length+"个可达状态均安全");
const unused=G.acts.filter(a=>!used[a.id]).map(a=>a.label),gi={},sr={};keys.forEach(k=>{M[k].s.i.forEach(x=>gi[x]=1);sr[M[k].s.room]=1});
const mi=Object.keys(G.items).filter(x=>!gi[x]),mr=Object.keys(G.rooms).filter(x=>!sr[x]);
add("无孤儿内容",!unused.length&&!mi.length&&!mr.length,[...unused.map(x=>"动作未用到:"+x),...mi.map(x=>"物品未获得:"+x),...mr.map(x=>"房间不可达:"+x)].join("；")||"全部用到");
const nc=(G.puzzles||[]).filter(p=>!keys.some(k=>{const s=M[k].s;return s.f.includes(p.clue)&&!s.f.includes(p.solved)&&!s.end})).map(p=>p.id);
add("线索先于谜题",!nc.length&&(G.puzzles||[]).length>0,nc.length?"缺少先行线索："+nc.join("、"):"每个谜题都有先行线索（须声明puzzles）");
const sol=(G.puzzles||[]).filter(p=>{const w=G.acts.filter(a=>a.eff?.f?.includes(p.solved));return w.length!==1}).map(p=>p.id);
add("解法唯一",!sol.length,sol.length?"这些谜题的解法动作数不为1："+sol.join("、"):"每个谜题恰有一个解法动作");
let br=0,n=0;keys.forEach(k=>{if(!M[k].s.end){br+=avail(M[k].s).length;n++}});
const lim=G.difficulty||{minSteps:5,maxSteps:60,maxBranch:6},avg=br/n;
add("难度区间",path.length>=lim.minSteps&&path.length<=lim.maxSteps&&avg<=lim.maxBranch,"最短"+path.length+"步，平均分支"+avg.toFixed(1)+"（允许"+lim.minSteps+"-"+lim.maxSteps+"步，分支≤"+lim.maxBranch+"）");
out.metrics={states:keys.length,shortest:path.length,avgBranch:+avg.toFixed(2),path};
console.log(JSON.stringify(out,null,1));process.exit(out.errors.length?1:0);
