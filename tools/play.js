#!/usr/bin/env node
// 文本试玩器：驱动"打包后的单文件关卡"，只解析页面内嵌的 window.__GAME__，不读取 game.json。
// 供阶段4试玩智能体使用，也用于阶段1打包自检（--replay）。
// 用法：
//   node tools/play.js <index.html> <style>                  # 开新局，打印文本界面
//   node tools/play.js <index.html> <style> <序号|动作全文>   # 执行一步（无效动作会被计数）
//   node tools/play.js <index.html> <style> --giveup         # 放弃并结算
//   node tools/play.js <index.html> <style> --replay 动作1|动作2|...  # 自动重放（自检）
// 约定：连续 25 步没有任何状态进展（房间/物品/标志均不变）判定为"卡住"；总步数上限 150。
const fs=require("fs"),path=require("path");
const htmlPath=process.argv[2],style=process.argv[3]||"cautious",args=process.argv.slice(4);
if(!htmlPath){console.error("用法: node tools/play.js <index.html> <style> [动作|--giveup|--replay a|b|c]");process.exit(2)}
const abs=path.resolve(htmlPath),dir=path.dirname(abs);
if(!fs.existsSync(abs)){console.error("文件不存在: "+abs);process.exit(2)}
const html=fs.readFileSync(abs,"utf8");
const m=html.match(/window\.__GAME__\s*=\s*([\s\S]*?);\s*<\/script>/);
if(!m){console.error("未找到打包数据 window.__GAME__（请先用 build.js 打包）");process.exit(2)}
const G=JSON.parse(m[1]);
const STUCK=25,CAP=150;
// 引擎语义，与 engine/play.html、tools/validate.js 保持一致
const has=(s,a)=>{const r=a.req||{};return a.room===s.room&&(r.i||[]).every(x=>s.i.includes(x))&&(r.f||[]).every(x=>s.f.includes(x))&&(a.n||[]).every(x=>!s.f.includes(x))};
const avail=s=>s.end?[]:G.acts.filter(a=>has(s,a));
const ap=(s,a)=>{const e=a.eff||{},i=new Set(s.i),f=new Set(s.f);(e.i||[]).forEach(x=>i.add(x));(e.rm||[]).forEach(x=>i.delete(x));(e.f||[]).forEach(x=>f.add(x));return{room:a.go||s.room,i:[...i].sort(),f:[...f].sort(),end:a.end||null}};
const key=s=>s.room+"|"+s.i+"|"+s.f+"|"+(s.end||"");
const sessPath=path.join(dir,"play-"+style+".json");
const recPath=path.join(dir,"playtest-"+style+".json");
function fresh(){const s0={room:G.start,i:[],f:[],end:null};
return{state:s0,log:[],steps:0,invalid:0,lastKey:key(s0),progressAt:0,moves:[],done:false}}
let sess=null;
if(args[0]!=="--replay"&&fs.existsSync(sessPath)){try{sess=JSON.parse(fs.readFileSync(sessPath,"utf8"))}catch(e){sess=null}}
function logline(t){sess.log.push(t);if(sess.log.length>30)sess.log.splice(0,sess.log.length-30)}
function ui(){const s=sess.state,L=[];
L.push("=== "+(G.title||"文字密室逃脱")+" ===");
if(s.end){L.push("【结局】"+(s.end==="win"?"通关！":"失败（设计内结局）。"))}
else{L.push("【房间】"+G.rooms[s.room].n);L.push(G.rooms[s.room].d)}
L.push("【物品】"+(s.i.length?s.i.map(x=>G.items[x]||x).join("、"):"空"));
if(sess.log.length){L.push("【最近记录】");sess.log.slice(-4).forEach(t=>L.push("· "+t))}
if(!s.end){L.push("【可选动作】");avail(s).forEach((a,idx)=>L.push(" "+(idx+1)+". "+a.label))}
L.push("【步数】"+sess.steps+(sess.invalid?("（无效动作 "+sess.invalid+" 次）"):""));
return L.join("\n")}
function finish(reason){sess.done=true;const s=sess.state;
const rec={game:path.basename(dir),style:style,cleared:s.end==="win",end:s.end||null,steps:sess.steps,invalid:sess.invalid,
stuck:reason==="stuck",gaveUp:reason==="giveup",timedOut:reason==="cap",stuckRoom:(s.end?null:G.rooms[s.room].n),
reason:reason,moves:sess.moves.slice()};
fs.writeFileSync(recPath,JSON.stringify(rec,null,1),"utf8");
try{fs.unlinkSync(sessPath)}catch(e){}
return rec}
function advance(a){const s0=sess.state,pre=key(s0);const s2=ap(s0,a);
sess.state=s2;sess.steps++;sess.moves.push(a.label);
if(a.text)logline(a.text);if(a.go&&!a.text)logline("（来到"+G.rooms[s2.room].n+"）"+G.rooms[s2.room].d);else if(a.go)logline("（来到"+G.rooms[s2.room].n+"）");
if(key(s2)!==pre){sess.lastKey=key(s2);sess.progressAt=sess.steps}}
function settle(){const s=sess.state;
if(s.end){const rec=finish("ended");console.log(ui());console.log("\n== 本局结束 ==\n"+JSON.stringify({cleared:rec.cleared,steps:rec.steps,invalid:rec.invalid},null,1));return true}
if(sess.steps-sess.progressAt>=STUCK){const rec=finish("stuck");console.log("== 判定卡住 ==");
console.log("连续 "+(sess.steps-sess.progressAt)+" 步没有状态进展，当前房间："+G.rooms[s.room].n);
console.log(JSON.stringify({cleared:rec.cleared,steps:rec.steps,invalid:rec.invalid,stuck:true,stuckRoom:rec.stuckRoom},null,1));return true}
if(sess.steps>=CAP){const rec=finish("cap");console.log("== 达到步数上限 "+CAP+"，结算 ==");console.log(JSON.stringify({cleared:rec.cleared,steps:rec.steps,invalid:rec.invalid,stuck:false,reason:"cap"},null,1));return true}
return false}
// ---- --replay：自动重放，用于打包自检 ----
if(args[0]==="--replay"){
const seq=(args[1]||"").split("|").filter(x=>x.length);
sess=fresh();let failed=null;
for(const t of seq){const a=avail(sess.state).find(x=>x.label===t);
if(!a){failed=t;break}advance(a)}
const s=sess.state;
const summary={replay:{total:seq.length,applied:sess.steps,failedLabel:failed},cleared:s.end==="win",steps:sess.steps,
expectedSteps:seq.length,match:s.end==="win"&&sess.steps===seq.length};
console.log(JSON.stringify(summary,null,1));
fs.writeFileSync(path.join(dir,"replay-check.json"),JSON.stringify(summary,null,1),"utf8");
process.exit(summary.match?0:1)}
// ---- 交互模式 ----
if(!args.length){sess=fresh();fs.writeFileSync(sessPath,JSON.stringify(sess,null,1),"utf8");
console.log("（新开局，style="+style+"。执行动作：node tools/play.js "+htmlPath+" "+style+" <序号或动作全文>）\n");
console.log(ui());process.exit(0)}
if(args[0]==="--giveup"){if(!sess||sess.done){console.log("没有进行中的会话");process.exit(0)}
const rec=finish("giveup");console.log("== 放弃 ==");console.log(JSON.stringify({cleared:rec.cleared,steps:rec.steps,invalid:rec.invalid,stuckRoom:rec.stuckRoom},null,1));process.exit(0)}
if(!sess||sess.done){console.log("没有进行中的会话，请先不带动作参数运行以开新局");process.exit(0)}
const input=args.join(" ").trim();
const as=avail(sess.state);
const byIdx=/^\d+$/.test(input)?as[parseInt(input,10)-1]:null;
const a=byIdx||as.find(x=>x.label===input);
if(!a){sess.invalid++;fs.writeFileSync(sessPath,JSON.stringify(sess,null,1),"utf8");
console.log("【无效动作】\""+input+"\" 不在当前可选动作里。\n");
console.log(ui());process.exit(0)}
advance(a);
if(!settle()){fs.writeFileSync(sessPath,JSON.stringify(sess,null,1),"utf8");console.log("（执行："+a.label+"）\n");console.log(ui())}
