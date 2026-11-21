# g24 依赖图

| 谜题/动作 | 需要的线索（来源动作） | 需要的物品（来源） | 前置谜题 | 解锁什么 |
|---|---|---|---|---|
| 夜班登记本（read_log） | — | — | — | c_log（故障链＋零件清单）、c_note（黑板指引） |
| 上一班的小黑板（p_board） | c_note（read_log） | — | 登记本 | board_read：配比刻度 c_scale、钥匙位置 c_peg、吸药座提示 c_suction |
| 取母液粉罐砝码盒（take_powder） | — | — | — | 母液粉罐、砝码盒 |
| 称配营养液（p_scale） | c_scale（p_board） | 母液粉罐＋砝码盒（take_powder） | 小黑板＋取粉砝 | mixed：配好的营养液壶 |
| 小林的工具袋（p_bag） | c_peg（p_board） | — | 小黑板 | bag_taken：喷雾控制柜钥匙 |
| 取阀芯管钳（take_core） | c_log（read_log 指引方向） | — | 登记本 | 备用阀芯、管钳 |
| 拆零件箱（open_kit） | c_log | — | 登记本 | 黄铜接头、硅胶垫圈 |
| 端详断口（look_mouth） | — | — | — | c_mouth（G1/2 管牙、旧阀芯碎裂） |
| 拼装应急阀（p_valve） | c_log＋c_mouth | 阀芯＋接头＋垫圈（take_core/open_kit） | 取阀芯管钳＋拆零件箱 | assembled：拼好的应急阀 |
| 换装应急阀（fit_valve） | assembled | 应急阀＋管钳 | 拼装应急阀 | valve_on：管路封闭 |
| 营养液上罐（dose_tank） | c_suction（p_board） | 营养液壶（p_scale） | 称配营养液 | dosed |
| 开控制柜（unlock_panel） | — | 控制柜钥匙（p_bag） | 小林的工具袋 | panel_open：口诀贴纸齐备 |
| 应急喷雾启动（p_spray） | panel_open（unlock_panel）＋valve_on＋dosed | — | 换装应急阀＋营养液上罐＋开控制柜 | spray_on：喷雾启动 |
| 守苗床看回落（win） | spray_on | — | 应急喷雾启动 | 终局 |

依赖为四条支线汇入终局：
1. 登记本 → 黑板（配比/钥匙/吸药座三线索）→ 称配 → 营养液壶 → 上罐
2. 登记本 → 零件清单 → 工具棚阀芯管钳＋机房接头垫圈 → 拼装 → 装阀
3. 黑板 → 工具袋 → 控制柜钥匙 → 开柜（panel_open 兼作 p_spray 的 clue）
4. 装阀＋上罐＋开柜 → 合闸 → 喷雾 → win

环检查：所有边单向（线索/物品 → 动作 → 新标志/新物品），标志只增不减；登记本一动作顺带 c_note、黑板一动作顺带三线索、开柜标志 panel_open 兼作喷雾谜题 clue，均为上游指向下游，无任何动作依赖自身或下游标志 —— 无环，通过。
