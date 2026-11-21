# g23 依赖图

| 谜题/动作 | 需要的线索（来源动作） | 需要的物品（来源） | 前置谜题 | 解锁什么 |
|---|---|---|---|---|
| 捡散页（pick_scraps） | — | — | — | c_bill（理序线索）、散页物品 |
| 出场单理序（p_bill） | c_bill（pick_scraps） | 散页（pick_scraps） | — | bill_ok：压轴规则；挂箱线索之一 |
| 团长日程板（read_board） | — | — | — | c_board（相邻规则）、c_drawer（砝码线索） |
| 马厩备品（p_gear） | c_feed（read_feed：喂食表） | — | 喂食表 | 备用钥匙、手电；首箱规则 c_feed |
| 团长抽屉（p_drawer） | c_drawer（read_board） | 备用钥匙（take_gear） | 马厩备品 | 一公斤标准砝码；顺带 c_check |
| 吊秤校验（p_check） | c_check（open_drawer 顺带） | 标准砝码（open_drawer） | 团长抽屉 | scale_checked：台秤虚高 2kg |
| 称配重铁（weigh_blocks） | scale_checked（calibrate） | — | 吊秤校验 | c_weight：四块铁实重 20×2＋1×2 |
| 出场排程（p_order） | bill_ok＋c_board＋c_feed | — | 出场单理序＋日程板＋喂食表 | order_ok＋c_load：轨道解锁 |
| 道具箱加载（p_load） | c_load（p_order 顺带） | — | 出场排程 | load1→load2→load3（标志链） |
| 配重筐配平（p_balance） | c_weight（weigh_blocks）＋箱重标签（道具库房间描述） | — | 称配重铁 | balance_ok：差动锁退齿 |
| 暗门铜锁链（open_trap） | — | — | 道具箱加载＋配重筐配平 | trap_open：梯口出现 |
| 提货（win） | trap_open | 手电（take_gear） | 暗门铜锁链 | 终局 |

依赖为四条支线汇入终局：
1. 散页 → 理序（压轴规则）→ 排程
2. 日程板 → 相邻规则 → 排程；日程板 → 抽屉（砝码）→ 校秤 → 称铁 → 配平
3. 喂食表 → 首箱规则 → 排程；喂食表 → 钉板（钥匙＋手电）→ 抽屉；手电 → 下库房
4. 排程 → 载单 → 挂箱链（彩球→礼帽→扣件）；挂载完成＋配平完成 → 解锁链 → 下库房 → 提货

环检查：所有边单向（线索/物品 → 动作 → 新标志/新物品），标志只增不减；日程板一动作顺带两标志、排程一动作顺带 c_load 均指向下游，无任何动作依赖自身或下游标志 —— 无环，通过。
