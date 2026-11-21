# g25 依赖图

| 谜题/动作 | 需要的线索（来源动作） | 需要的物品（来源） | 前置谜题 | 解锁什么 |
|---|---|---|---|---|
| 值班日志（read_log） | — | — | — | c_log（复核规程）、c_keyhook（钥匙位置）、c_lamprule（头灯规矩） |
| 资料柜（p_cab） | c_keyhook（read_log） | 资料柜钥匙（take_key） | 值班日志 | cabinet_open：断代影印表；顺带 c_table |
| 头灯充电柜（p_lamp） | c_lamprule（read_log） | — | 值班日志 | 头灯（进库区前置） |
| 库架平面图（p_map） | c_log（read_log） | — | 值班日志 | map_read＋c_aisle（A/B 区分区与架位编号规则） |
| 钻孔柱状图（read_bore） | — | — | — | c_bore（南岭孔终孔 260 米） |
| 断代比对（p_date） | c_table（open_cab 顺带） | 断代影印表（open_cab） | 资料柜 | dated：实测段位与标签吻合情况 |
| 丙位架定位（p_locate） | c_aisle（read_map 顺带） | — | 库架平面图 | located：丙位架确认 |
| 指认调包芯（p_suspect） | dated（p_date）＋c_bore（read_bore） | — | 断代比对＋钻孔柱状图＋丙位架定位 | suspect：锁定丙芯 |
| 封舱复核（p_seal） | suspect（p_suspect） | — | 指认调包芯 | sealed：假芯入舱 |
| 摇键发报（win） | sealed | — | 封舱复核 | 终局 |

依赖为三条支线汇入终局：
1. 日志 → 台钩钥匙 → 资料柜 → 影印表 → 前处理间比对（dated）
2. 日志 → 库架平面图（方位规则）→ 丙位架定位；日志 → 头灯（进库区可达性）
3. 钻孔柱状图（深度上限）＋比对结果 → 抽丙芯 → 封舱 → 发报

环检查：所有边单向（线索/物品 → 动作 → 新标志/新物品），标志只增不减；日志一动作顺带三线索标志均指向下游，指认谜题引用比对谜题的 solved 标志作 clue 属于规范允许的跨谜题引用（不算共用），无任何动作依赖自身或下游标志 —— 无环，通过。
