#!/usr/bin/env node
// 打包：把 game.json 内嵌进 engine/play.html，产出可单独打开的单文件关卡 HTML。
// 用法: node build.js <game.json> [输出.html]   （默认输出为输入同目录的 index.html）
const fs=require("fs"),path=require("path");
const gin=process.argv[2];
if(!gin){console.error("用法: node build.js <game.json> [out.html]");process.exit(2)}
const G=JSON.parse(fs.readFileSync(gin,"utf8"));
const tplPath=path.join(__dirname,"engine","play.html");
const tpl=fs.readFileSync(tplPath,"utf8");
if(!tpl.includes("<!--BUILD:GAME-->")){console.error("engine/play.html 缺少 <!--BUILD:GAME--> 标记");process.exit(2)}
// JSON 里的 < 转义为 \u003c，防止关卡文本中出现 </script> 截断页面
const payload="<script>window.__GAME__="+JSON.stringify(G).replace(/</g,"\\u003c")+";</script>";
const out=process.argv[3]||path.join(path.dirname(path.resolve(gin)),"index.html");
fs.writeFileSync(out,tpl.replace("<!--BUILD:GAME-->",payload));
const rooms=Object.keys(G.rooms||{}).length,puz=(G.puzzles||[]).length,acts=(G.acts||[]).length;
console.log("已打包: "+out+"（房间 "+rooms+"，谜题 "+puz+"，动作 "+acts+"，"+fs.statSync(out).size+" 字节）");
