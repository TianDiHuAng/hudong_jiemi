# 批量生产报告 —— 文字密室逃脱关卡（30 关）

生产日期：2026-11-16 ~ 2026-11-18 · 流水线：六阶段规格全流程执行

## 一、交付总览

| 项 | 结果 |
|---|---|
| 产出关卡 | 30/30（seeds.json 全部种子，零跳过、零 BLOCKER） |
| 校验（tools/validate.js） | 30/30 exit 0（七项检查全绿） |
| 打包 | 30/30 单文件 HTML（games/<id>/index.html） |
| 试玩（谨慎型） | 30/30 通关，零卡点 |
| 试玩（乱试型） | 9/30 通关，21 个死于设计内 lose，复测后零卡点 |
| 回炉修复 | 2 关（g11、g18），修复后复测通过 |
| 评审 | 30 份 review.json，五维引用原文（程序化校验逐字命中），总分 20–25，均值 23.0 |
| 去重 | 全部对（含 reference 基线）句子重合度 <0.10（阈值 0.30），CLEAN |
| rejected/ | 空（无关卡进入 rejected） |

## 二、阶段记录

- **阶段1**：从 escape-sample.html 抽出引擎 → `engine/play.html`（读同目录 game.json / 内嵌数据双模式），`build.js` 打包单文件；`reference/game.json` 验证：validate 全绿 + 文本重放通关 + 浏览器实际点通"通关！再玩一次"（深色模式渲染正常）。引擎与 validate.js 自定稿后未再改动。
- **阶段2**：seeds.json 30 种子——场景全唯一；机制二选二满足滑动窗口唯一，且 s04–s30 亦不与 s01–s03 组合重复；难度 easy10/medium12/hard8。
- **阶段3**：试点 g01 校准规范（games/_spec/GENERATION-SPEC.md，试玩/评审反馈滚动修订 7 节）；6 批并行→串行生成 29 关，全部一轮~三轮 validate 通过；全量独立复核（30 关 validate 重跑 + 结构统计）全绿。
- **阶段4**：60 会话双风格试玩（tools/play.js 文本界面，黑盒纪律：只许界面、禁读源文件）。卡点 2 个：
  - g11 乱试型酒窖卡住（酒提拾取误绑"记账板"知识前提）→ 放开 req，复测 29 步通关；
  - g18 谨慎型丙区卡住 + 销毁陷阱无门槛 → burn_fake 加持有校验、开局任务交代补全、新增核对单提示动作，复测谨慎/乱试均通关。
- **阶段5**：3 批评审，5 维（谜题推理感/线索自然度/文字质量/主题呼应/结局回报）×1-5 分，每维逐字引用原文。
- **阶段6**：dedup.js 句子重合度比对（去标点≥6字有效句，|A∩B|/min(|A|,|B|)）全部 CLEAN；banned.md 追加本轮 4 条共性禁用项。

## 三、排行榜（评审总分，仅排序用）

1. g10 封站前的真话（25）· g15 缺角的纪年（25）· g21 封箱夜（25）
2. g04 雾锁字母闸（24）· g06 十四吨之夜（24）· g07 三更药对（24）· g09 五枚蝶纹牌（24）· g16 零点自动开播（24）· g19 摆砣的分量（24）· g26 提货单上不再有星号（24）· g27 汽压红线（24）· g28 锅炉房的秤与招牌（24）
3. 其余 19 关 20–23 分。

评审共性问题（已写入 banned.md 供后续批次禁用）：解法答案出现在动作 label、开局即死陷阱无预警、线索动作代答结论、称量谜题缺自校途径。

## 四、试玩数据要点（reports/stage4-playtest-summary.json）

- 谨慎型平均 31.5 步通关；乱试型平均 14.1 步、平均 1.7 次无效动作。
- 乱试型 21 次死亡全部来自设计内 lose 陷阱，其中多数发生在开局 1–8 步——"列表里最诱人的动作即死"是本批最大的体验短板（规格的通过条件"卡住>25步"已满足；该模式已列入 banned.md，供后续生产改进）。

## 五、文件地图

- INDEX.json —— 全部 30 关的种子/结构/指标/试玩/评审汇总（按评审总分排序）
- games/g01…g30/ —— concept.md · depgraph.md · game.json · index.html · gen-notes.md · playtest-*.json · review.json
- games/_spec/ —— GENERATION-SPEC.md（生成规范）· banned.md（禁用元素）
- rejected/ —— 空 · BLOCKERS.md —— 未触发（无同类问题三连败）
- tools/ —— validate.js（未改动）· play.js（文本试玩器）· dedup.js（去重比对）· dev-server.js（验收用）
- engine/play.html + build.js —— 引擎与打包器（阶段1定稿后未改动）
- reports/ —— stage3-sweep.txt · stage4-playtest-summary.json · dedup-report.json · 本报告

## 六、硬性规则遵守情况

- 引擎与 validate.js 零改动（仅阶段1按规格抽取/复制）；后续只新增/修改 games/ 与记录文件 ✓
- validate 重试 ≤5 轮：实际最多 3 轮（g27）✓
- 同一问题连败 3 次 → BLOCKERS.md：未触发 ✓
- 房间描述 ≤80 字：实测最大 65 字 ✓
