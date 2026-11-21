# 文字密室逃脱关卡库（48 关）

每关是一个 `game.json` 数据文件 + 引擎渲染的可玩单文件 HTML。点击目录页里的标题即开玩。

引擎为可视化界面：舞台区（房间名 + emoji 场景条 + 叙事日志 + 分组动作）、自动地图（走过实心 / 当前高亮 / 相邻虚线，**节点可拖拽**，布局按关卡自动存档，"重置布局"恢复）、物品图标栏、谜题进度条；通关结算会给出"本局步数 vs 理论最短步数"评级。语义层与 game.json 格式不受影响；旧版纯文字引擎备份在 `engine/play-classic.html`。

## 怎么玩
- **最快**：打开根目录 [index.html](index.html)（关卡目录页），点任意关卡标题。
- 或直接双击 `games/<关卡ID>/index.html`——单文件、无需服务器、支持深色模式。
- 若直接打开 `engine/play.html`（file://）浏览器会拦截读取 game.json，请用打包后的 index.html，或经 `node tools/dev-server.js . 8899` 走 http。

## 目录结构
```
INDEX.json            全部 48 关的种子/结构/指标/试玩/评审汇总（按评审总分排序）
index.html            关卡目录页（由 tools/build-index-page.js 生成）
engine/play.html      引擎（读同目录 game.json 或内嵌数据；定稿后未改动）
build.js              打包器：node build.js <game.json> [out.html]
seeds.json            48 个种子（场景/主题/双机制/难度带）
games/g01..g48/       每关：concept.md · depgraph.md · game.json · index.html ·
                      gen-notes.md · playtest-*.json · review.json
games/_spec/          GENERATION-SPEC.md（生成规范）· banned.md（禁用元素）
reference/            样板关（game.json + 打包自检产物）
tools/                validate.js（校验器，未改动）· play.js（文本试玩器）·
                      dedup.js（句子重合度去重）· build-index-page.js · dev-server.js
reports/              各阶段报告与总账
rejected/             校验 5 轮仍失败的关卡（当前为空）
```

## 质量门（每关全过才入目录）
1. `node tools/validate.js games/<id>/game.json` 退出码 0（可通关/无软锁/无孤儿内容/线索先于谜题/解法唯一/难度区间/结构完整）
2. 双风格试玩（谨慎型/乱试型）：谨慎型必须通关；卡住（连续 25 步无状态进展）必须回炉补线索
3. 句子重合度 ≤0.30（tools/dedup.js，含 reference 基线）
4. 评审五维（谜题推理感/线索自然度/文字质量/主题呼应/结局回报）引用原文打分，缺陷回炉至收敛

## 新增一关
1. 在 seeds.json 按窗口规则追加种子（机制组合不得与前三个重复、场景唯一）
2. 按 games/_spec/GENERATION-SPEC.md 走：concept → 依赖图（查环）→ game.json → validate（≤5 轮）→ build.js → gen-notes
3. 生成前必读 games/_spec/banned.md

## 当前水位（2026-11-21）
- 48 关全部 validate 全绿；谨慎型试玩 48/48 通关、零卡点
- 评审均分 23.67/25，满分关 13 个
- 去重：全库句子重合度 <0.30（实测最大 <0.10）
