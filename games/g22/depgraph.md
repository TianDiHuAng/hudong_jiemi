# g22 依赖图

| 谜题/动作 | 需要的线索（来源动作） | 需要的物品（来源） | 前置谜题 | 解锁什么 |
|---|---|---|---|---|
| 听清广播（listen_pa） | — | — | — | c_broadcast（假站名＋左门提示） |
| 全线示意图（p_map） | c_broadcast（listen_pa，六号车厢） | — | — | map_read：平台在运行方向左侧（推门前置） |
| 乘务日志（read_log） | — | — | — | c_lost（失物位置）、c_return（反向折返）、c_lock（备品柜锁） |
| 座椅失物袋（p_lost） | c_lost（read_log） | — | 乘务日志 | 乘务钥匙 |
| 门楣木牌（read_chart） | — | — | — | c_chart（临3 川1 路6，按词序连拨） |
| 乘务备品柜（p_box） | c_lock（read_log） | 乘务钥匙（pick_bag） | 座椅失物袋 | 主控电钥匙、疏散摇柄；顺带 c_console |
| 主控台（p_console） | c_console（open_box 顺带） | 主控电钥匙（open_box） | 乘务备品柜 | console_on：轮盘可用 |
| 临川路站码（p_code） | c_chart（read_chart）＋console_on | — | 主控台 | code_ok：端门气锁释放 |
| 疏散端门（p_exit，终局 win） | map_read＋c_return＋code_ok | 疏散摇柄（open_box） | 临川路站码＋全线示意图＋乘务日志 | 终局 |

依赖为两条支线汇入终局：
1. 广播 → 示意图规则（map_read）→ 推门前置
2. 乘务日志 → 失物袋（乘务钥匙）→ 备品柜（电钥匙＋摇柄）→ 主控台 → 站码 316 → 推门
3. 门楣木牌（c_chart）独立汇入站码；日志（c_return）独立汇入推门

环检查：所有边单向（线索/物品 → 动作 → 新标志/新物品），标志只增不减；日志动作顺带置三标志但均指向下游动作，无任何动作依赖自身或下游标志 —— 无环，通过。
