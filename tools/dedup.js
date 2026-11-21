#!/usr/bin/env node
// 阶段6去重：按"句子重合度"比较各关卡文字，超过阈值（默认0.30）判为重复。
// 用法: node tools/dedup.js [阈值]   退出码 0=干净，1=存在超阈值对
// 口径：关卡文本（intro/房间名/房间描述/物品名/动作label/text）按 。！？；换行 切句，
//       去除标点空白后长度≥6 的句子才算有效句；重合度 = |A∩B| / min(|A|,|B|)。
//       reference/game.json（样板关）也纳入比较，防止新关卡照抄样板。
const fs=require("fs"),path=require("path");
const TH=parseFloat(process.argv[2]||"0.30");
const root=path.resolve(__dirname,"..");
function load(p,label){try{const g=JSON.parse(fs.readFileSync(p,"utf8"));
const raw=[];
if(g.intro)raw.push(g.intro);
Object.values(g.rooms||{}).forEach(r=>{raw.push(r.n||"");raw.push(r.d||"")});
Object.values(g.items||{}).forEach(v=>raw.push(v||""));
(g.acts||[]).forEach(a=>{raw.push(a.label||"");raw.push(a.text||"")});
const S=new Set();
raw.forEach(t=>{String(t).split(/[。！？；;\n]+/).forEach(s=>{
const n=s.replace(/[\s，、：:„""''"「」『』（）()\[\]【】《》<>《》—…·.,!?'’‘“”\-]/g,"");
if(n.length>=6)S.add(n)})});
return{label,path:p,sentences:S,count:S.size}}catch(e){return null}}
const games=[];
const gdir=path.join(root,"games");
if(fs.existsSync(gdir)){fs.readdirSync(gdir).sort().forEach(d=>{
const p=path.join(gdir,d,"game.json");
if(fs.statSync(path.join(gdir,d)).isDirectory()&&fs.existsSync(p)){const x=load(p,d);if(x&&x.count>0)games.push(x)}})}
const refPath=path.join(root,"reference","game.json");
if(fs.existsSync(refPath)){const x=load(refPath,"reference");if(x)games.push(x)}
const offenders=[];
for(let i=0;i<games.length;i++)for(let j=i+1;j<games.length;j++){
const A=games[i],B=games[j];let inter=0;const shared=[];
A.sentences.forEach(s=>{if(B.sentences.has(s)){inter++;if(shared.length<5)shared.push(s)}});
const ov=inter/Math.min(A.count,B.count);
if(ov>TH)offenders.push({a:A.label,b:B.label,overlap:+ov.toFixed(3),sharedCount:inter,minSentences:Math.min(A.count,B.count),examples:shared})}
const summary={threshold:TH,games:games.map(g=>({id:g.label,sentences:g.count})),offenders,verdict:offenders.length?"REWRITE_NEEDED":"CLEAN"};
fs.writeFileSync(path.join(root,"reports","dedup-report.json"),JSON.stringify(summary,null,1),"utf8");
if(offenders.length){
console.log("超过阈值 "+TH+" 的关卡对（需打回重写）：");
offenders.forEach(o=>console.log("  "+o.a+" <-> "+o.b+"  重合度 "+o.overlap+"（共 "+o.sharedCount+" 句）\n    例："+o.examples.join(" ／ ")));
process.exit(1)}else{
console.log("全部 "+games.length+" 个关卡（含 reference）句子重合度均 ≤ "+TH+"，通过。");
console.log("各关卡有效句数："+games.map(g=>g.label+":"+g.count).join(", "));
process.exit(0)}
