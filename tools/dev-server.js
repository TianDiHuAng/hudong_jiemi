#!/usr/bin/env node
// 开发用静态服务器（仅用于本地浏览器验收打包页面）。
// 用法: node tools/dev-server.js [根目录] [端口=8899]
const http=require("http"),fs=require("fs"),path=require("path");
const root=path.resolve(process.argv[2]||"."),port=+process.argv[3]||8899;
const mime={".html":"text/html; charset=utf-8",".json":"application/json; charset=utf-8",".js":"text/javascript; charset=utf-8",".md":"text/plain; charset=utf-8"};
http.createServer((req,res)=>{
let p=decodeURIComponent(new URL(req.url,"http://x").pathname);
if(p.endsWith("/"))p+="index.html";
const f=path.join(root,p);
if(!f.startsWith(root)){res.writeHead(403);return res.end("403")}
fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);res.end("404")}
else{res.writeHead(200,{"Content-Type":mime[path.extname(f).toLowerCase()]||"application/octet-stream"});res.end(d)}})
}).listen(port,"127.0.0.1",()=>console.log("serving "+root+" at http://127.0.0.1:"+port));
