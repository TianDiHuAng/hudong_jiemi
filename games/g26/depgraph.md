# g26 依赖图

| 谜题/动作 | 需要的线索（来源动作） | 需要的物品（来源） | 前置谜题 | 解锁什么 |
|---|---|---|---|---|
| 抽出旧衬板（take_liner） | — | — | — | 旧衬板；c_note（匿名字条内容） |
| 取放大镜（take_lens） | — | — | — | 放大镜 |
| 红外底片（p_ir） | — | — | — | ir_done＋c_ir（背板刻痕 C R V K＋铲改痕迹） |
| 台账比对（p_ledger） | — | 放大镜（take_lens） | 取放大镜 | ledger_done＋c_ledger（新册补写、旧册连续） |
| 电话留言机（p_phone） | — | — | — | phone_heard＋c_phone（经理主张新台账） |
| 三处说法比对（p_truth） | c_note＋c_ledger＋c_phone＋c_ir | — | 旧衬板＋台账比对＋留言机＋红外底片 | truth：锁定旧台账为真 |
| 修复手册（p_manual） | — | — | — | manual_read＋c_layer（画层自下而上排序规则） |
| 背板暗格（p_box） | c_ir（p_ir 的 solved 作 clue）＋c_layer＋truth | — | 红外底片＋修复手册＋三处说法比对 | box_open：原始鉴定书 |
| 归回夹层（win） | box_open | 原始鉴定书（p_box 产出） | 背板暗格 | 终局 |

依赖为三条支线汇入终局：
1. 画箱 → 旧衬板 → 匿名字条（c_note）→ 比对
2. 观察间 → 红外底片（c_ir）→ 比对＋暗格 clue；工具柜 → 放大镜 → 台账比对（c_ledger）→ 比对
3. 办公桌 → 留言机（c_phone）→ 比对；资料阁 → 修复手册（c_layer）→ 暗格排序
4. 四源比对 → truth；truth＋c_layer＋c_ir → 拨 2741 → 鉴定书 → 归回夹层

环检查：所有边单向（线索/物品 → 动作 → 新标志/新物品），标志只增不减；背板暗格的 clue 引用了红外底片谜题的 solved 标志 c_ir，属于规范允许的跨谜题引用（不算共用）；其余各谜题 clue 均由独立前置动作置位，无任何动作依赖自身或下游标志 —— 无环，通过。
