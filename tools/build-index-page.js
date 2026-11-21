#!/usr/bin/env node
// 从 INDEX.json 生成交付目录页 index.html（静态单文件，相对链接指向各关 index.html）。
// 用法: node tools/build-index-page.js
const fs=require("fs"),path=require("path");
const root=path.resolve(__dirname,"..");
const IDX=JSON.parse(fs.readFileSync(path.join(root,"INDEX.json"),"utf8"));
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const difColor={easy:"#1E7A4F",medium:"#8a6d1f",hard:"#B3362B"};
const cards=IDX.games.map(g=>{
const r=g.review,pt=g.playtest||{};
const score=r?r.total+"/25":"未评";
const dims=r?Object.entries(r.scores).map(([k,v])=>`<span class="dim">${esc(k)} ${v}</span>`).join(""):"";
const ptLine=pt.cautious?`试玩：谨慎型${pt.cautious.cleared?"✓通关":"✗"+(pt.cautious.end||"")}（${pt.cautious.steps}步） · 乱试型${pt.chaotic&&pt.chaotic.cleared?"✓通关":"✗"+((pt.chaotic&&pt.chaotic.end)||"")}（${pt.chaotic?pt.chaotic.steps:"?"}步）`:"";
return `<div class="card">
<div class="head"><a class="play" href="games/${esc(g.id)}/index.html">▶ ${esc(g.title)}</a>
<span class="diff" style="background:${difColor[g.seed.difficulty]||"#555"}">${esc(g.seed.difficulty)}</span>
<span class="score">${esc(score)}</span></div>
<div class="meta">${esc(g.id)} · 场景：${esc(g.seed.scene)}</div>
<div class="theme">${esc(g.seed.theme)}</div>
<div class="mech">${g.seed.mechanics.map(esc).join(" + ")} · ${g.structure.rooms}房 ${g.structure.puzzles}谜 · 最短${g.metrics.shortest}步</div>
<div class="dims">${dims}</div>
<div class="pt">${esc(ptLine)}</div>
<div class="links"><a href="games/${esc(g.id)}/concept.md">设定</a> · <a href="games/${esc(g.id)}/review.json">评审</a> · <a href="games/${esc(g.id)}/game.json">数据</a></div>
</div>`}).join("\n");
const html=`<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>文字密室逃脱 · 关卡目录（${IDX.count}关）</title>
<style>
:root{--bg:#0E1320;--card:#161D30;--ink:#E3E8F4;--mute:#9AA6C2;--line:#2A3452;--acc:#8FA8F0;color-scheme:dark}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.7 "Noto Sans SC",system-ui,sans-serif}
main{max-width:1080px;margin:0 auto;padding:32px 16px 80px}
h1{font-size:30px;margin:0 0 6px}.sub{color:var(--mute);margin-bottom:24px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:14px}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px}
.head{display:flex;align-items:center;gap:10px}.play{color:var(--acc);font-weight:700;font-size:17px;text-decoration:none}
.play:hover{text-decoration:underline}.diff{font-size:12px;color:#fff;border-radius:4px;padding:1px 8px}
.score{margin-left:auto;font-weight:700}
.meta,.mech,.pt{color:var(--mute);font-size:13px;margin-top:4px}
.theme{font-size:14px;margin-top:6px}
.dims{margin-top:6px}.dim{display:inline-block;font-size:12px;border:1px solid var(--line);border-radius:4px;padding:0 6px;margin:2px 4px 0 0;color:var(--mute)}
.links{margin-top:8px;font-size:13px}.links a{color:var(--acc);text-decoration:none}
</style></head><body><main>
<h1>文字密室逃脱 · 关卡目录</h1>
<div class="sub">${IDX.count} 关 · 每关为单文件 HTML，点击标题直接开玩 · 生成于 ${esc(IDX.generated)} · 通过标准：${esc(IDX.passCriteria)}</div>
<div class="grid">
${cards}
</div>
</main></body></html>`;
fs.writeFileSync(path.join(root,"index.html"),html);
console.log("index.html written:",IDX.count,"games");
