# 给 AI 的统一指令包

> 用途：六个人各自用 AI 写代码时，**贴同一套指令**，让 AI 产出的代码天然对齐，不用事后改。
> 配套：`接口契约.md`（谁写什么函数）、`六人分工方案.md`（谁负责哪块）。

---

## 使用方式（三步）

1. **【A 通用公约】整段贴进 AI 的"项目说明 / 自定义指令 / system prompt"**，每个新会话开头贴一次（AI 会忘）。
2. **按你的代号，追加【B】里对应的那一段**，限定它只写你的文件。
3. **提需求用【C】的模板**，不要说"帮我写个象棋"，要说"实现 `CC.Rules.movesFor`，签名照契约"。

> 关键：**AI 不会主动读你的文档**，它只会照你贴进去的文字做。贴多少，它守多少。

---

## A. 通用公约（所有人必贴，原样复制）

```
【项目】中国象棋（Web 版），多人协作，原生 JavaScript，零依赖零构建。

【技术约束 · 违反即作废】
1. 不使用 ES Module：禁止 import / export / require / type="module"。所有文件用经典 <script> 引入。
2. 不引入任何第三方库、框架、CDN 脚本、TypeScript、构建工具。
3. 每个 js 文件必须是一个 IIFE，并挂到全局命名空间 CC 下的固定子命名空间，骨架如下：
   (function (CC) {
     'use strict';
     const Board = {};
     // ... 实现
     CC.Board = Board;
   })(window.CC = window.CC || {});
4. 全局唯一命名空间 CC。子命名空间固定为：CC.Board / CC.Rules / CC.Check / CC.Game / CC.AI / CC.Notation / CC.View / CC.Test。不得新增。

【坐标与棋子 · 必须严格遵守】
5. 坐标是 (x, y) 两个数字：x 为 0..8（从左到右），y 为 0..9（从上到下，y=0 是黑方底线，y=9 是红方底线）。
   全项目只允许 (x, y)，严禁出现 row/col、严禁 1..9 坐标、严禁二维数组 board[y][x]。
6. 棋盘是一维数组 Array(90)，下标 idx = y * 9 + x，空位用 null。
7. 棋子用单个字符表示：红方大写 K帅 A仕 B相 N马 R车 C炮 P兵；黑方小写 k a b n r c p。禁止用汉字、禁止用 'red-rook' 这类字符串。

【数据结构 · 一字不改】
8. GameState = { board: Array(90), turn: 'r'|'b', halfMove: number, fullMove: number }
9. Move = { from: [x, y], to: [x, y], piece: 'R', captured: 'p' | null }
10. 会失败的函数一律返回 Result，不抛异常、不返回 false：
    { ok: true, move: Move, state: GameState, status: 'playing' }
    { ok: false, reason: 'E_ILLEGAL_MOVE' }
11. 错误码只有这 8 个，不得自造：
    E_NOT_YOUR_TURN / E_EMPTY_CELL / E_OWN_PIECE / E_OPPONENT_PIECE /
    E_OUT_OF_BOARD / E_ILLEGAL_MOVE / E_SELF_CHECK / E_GAME_OVER
12. status 只有四种：'playing' | 'r-win' | 'b-win' | 'draw'

【函数约定】
13. 函数名、参数、返回类型必须与《接口契约》完全一致。禁止改名、禁止调整参数顺序、禁止加可选参数、禁止"顺手优化"接口。
14. applyMove(state, move) 必须返回**新的** GameState，绝对不允许修改入参 state（内部要逐格复制 board）。
15. 布尔函数以 is/has/can 开头，只返回 true/false，不返回 null/undefined。
16. 每个导出到 CC 的函数，上方写一行中文注释：用途 + 参数 + 返回。例：
    // 生成某方所有伪合法着法（不判送将）。state: GameState, side: 'r'|'b' → Move[]
17. 不要用 try/catch 吞异常；不要用 console.log 充当测试；不要留 TODO 或省略号代码。
18. 一次输出完整文件，不要输出 diff、片段、"其余同上"。

【模块边界】
19. 只写你负责的文件。需要别的模块的函数 → 先问"契约里有没有"，没有就提示"建议新增 XXX 到契约"，不要自己造一个。
20. 依赖单向：Rules 不调 View，View 不调 Game，AI 不碰 DOM，Board 不调任何人。

【代码风格】
21. 2 空格缩进、单引号、语句带分号、只用 const/let（不用 var）、比较用 ===。
```

---

## B. 按角色追加（选一段贴）

### B1 · A 架构集成（`core/board.js`、`app.js`、`test/test-kit.js`）

```
【你的文件】core/board.js、app.js、test/test-kit.js。其他文件一行都不能改。
【你实现】CC.Board：create / empty / idx / inBoard / at / set / clone / sideOf / isRed / parseFEN / toFEN
          CC.Test：eq / ok / moves / report
【重点】
- parseFEN 与 toFEN 必须互逆，用标准起始 FEN 自测：
  rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1
- FEN 的 rank 顺序是从 y=0（黑方底线）写到 y=9（红方底线），数字表示连续空位。
- clone 必须深拷贝 board，不能共享引用。
- at / set 要先做越界检查，越界返回 null 或原样返回，不抛异常。
【禁止】不要在 board.js 里写任何走子规则；不要引入棋子对象，保持字符串编码。
```

### B2 · B 规则引擎（`core/rules.js`）

```
【你的文件】core/rules.js。其他文件一行都不能改。
【你实现】CC.Rules：genPseudoMoves / movesFor / isAttacked / applyMove / undoMove
【重点】
- 只生成"符合兵种走法"的伪合法着法，**不判断送将、不判断将帅照面**（那是 CC.Check 的职责，越界会被打回）。
- 兵种细节：车直线无阻挡；炮走同车但吃子必须隔且仅隔一个子；马走日且蹩腿；象走田且塞象眼、不过河；
  士九宫斜走一步；将九宫直线一步；兵未过河只能向前，过河后可横走，永不后退。
- applyMove 返回新 state：复制 board → 移动 → 处理吃子 → 切 turn → 更新 halfMove（吃子清零，否则 +1）与 fullMove（黑方走完 +1）。
- undoMove 是 applyMove 的逆运算，两者往返后局面必须逐格相等。
【禁止】不要在 rules.js 里判断将军；不要用可变全局变量存中间状态。
```

### B3 · C 对局控制（`core/validate.js`、`core/game.js`）

```
【你的文件】core/validate.js、core/game.js。其他文件一行都不能改。
【你实现】CC.Check：isInCheck / isKingsFacing / legalMoves / validate / status / isCheckmate / isStalemate
          CC.Game：create / play / undo / reset / getState / legalTargets / isOver / status / on / off
【重点】
- isAttacked(state, x, y, bySide) 必须反向扫描该格子（沿 4 条线找车炮、8 个马位、兵位、将位），
  **绝对不允许**内部调用 genPseudoMoves 生成全集再过滤——那会让 AI 搜索慢一个数量级。
- legalMoves = genPseudoMoves 后，逐个 applyMove 再判断己方是否被将（含将帅照面），过滤掉非法着法。
- 将帅照面：两将同一列且中间无子，属于非法局面。
- status：将死 → 对方胜；困毙（无着可走但未被将）→ 按中国象棋规则判负。
- CC.Game 是全项目唯一有状态的对象，内部持 state 与 history，对外只暴露方法。
- 事件只有四个：'move'(move, state) / 'undo'(move) / 'reset'() / 'end'(status)。
【禁止】不要把 CC.Game 写成单例；不要直接暴露内部数组让外部改；不要在 game.js 里内置 AI 调用（AI 接线在 app.js，mode/aiSide 只作配置存取）。
```

### B4 · D 界面交互（`ui/board-view.js`、`index.html`）

```
【你的文件】ui/board-view.js、ui/board.css、index.html。其他文件一行都不能改。
【你实现】CC.View：mount / render / highlight / animateMove / setFlipped / flashCheck
【重点】
- 传入 GameState 就能画出棋盘：9 条竖线、10 条横线、九宫斜线、楚河汉界、32 枚棋子。
- 棋子字符 → 汉字显示在这里转换：{K:'帅',A:'仕',B:'相',N:'马',R:'车',C:'炮',P:'兵'}，
  黑方 {k:'将',a:'士',b:'象',n:'马',r:'车',c:'炮',p:'卒'}。
- 点击只上报坐标：opts.onCellClick(x, y)；拖拽只上报 from/to。**渲染层不判断合法性**。
- render(state) 只读 state，一个字段都不能改。
- highlight(cells, type)：type 为 'move' | 'lastMove' | 'check' | 'select'。
- 动画结束必须回调 cb，否则上层状态会错乱。
【禁止】不要从 View 里调用 CC.Game 或 CC.Rules 去判断走法；不要用 canvas 之外的第三方绘图库。
```

### B5 · E AI 算法（`ai/engine.js`）

```
【你的文件】ai/engine.js。其他文件一行都不能改。
【你实现】CC.AI：create / search / evaluate / randomMove
【重点】
- randomMove(state)：从合法着法里随机挑一个，state 无着可走返回 null。这是第一天的占位实现，必须先交货。
- evaluate(state, side)：以 side 视角返回数值，正数表示己方优势，单位统一为"1 兵 = 100"。
  子力参考值：车 900、马 400、炮 450、兵 100（过河 200）、士 200、象 200、将 10000。
- search(state)：negamax + alpha-beta + 迭代加深 + 时间限制，返回 { move, score, nodes, timeMs }。
- 内部可以用可变棋盘做 make/unmake 快通道提升性能，但**对外只接受 GameState、只返回 Move**。
- 超时立即返回当前最优着法，宁浅一层也不能卡死。
【禁止】不要修改传入的 state；不要返回棋子对象；不要引入任何库；不要在 UI 线程做超过 3 秒的同步计算。
```

### B6 · F 棋谱与质量（`core/notation.js`、`test/`）

```
【你的文件】core/notation.js、test/fixtures/*.json、各模块的 test.html。其他人 js 文件不能改。
【你实现】CC.Notation：toChinese / fromChinese / toPGN / parsePGN / replay
【重点 · 中文记谱换算】
- 红方路数 = 9 - x（从红方自己的右边数，一路在屏幕右侧）；黑方路数 = 1 + x。
- 红方用汉字数字（一二三…九），黑方用阿拉伯数字（1–9）。
- 同列双子用 前/后 区分；三个以上兵卒用 前/中/后。
- 走法字：进 / 退 / 平。平用目标路数，进退用步数（车马炮士象将用步数，兵用路数需注意规则）。
- 格式示例：炮二平五、马8进7、车九平八。
【测试】
- fixture 格式统一：{ "name": "马蹩腿", "fen": "...", "side": "r", "expect": ["b1c3"] }
- 测试页统一用 CC.Test.eq / ok / moves / report，不要用 console.log 当测试。
【禁止】不要在 notation.js 里实现走子逻辑，只做"局面 + 着法 → 文字"的转换。
```

---

## C. 提需求模板（照抄，把方括号换掉）

### C1 实现一个函数
```
按【通用公约】和【Bx 角色段】的约束，实现 CC.Rules.movesFor(state, x, y)。
- 签名照契约：参数 state: GameState, x, y: number，返回 Move[]
- 返回该格棋子的所有伪合法着法；起点无子返回 []
- 只写 core/rules.js 里的这一段，输出完整函数（含 IIFE 上下文），不要省略
- 不要写测试，不要改其他函数
```

### C2 补测试
```
按【通用公约】，为刚写的 movesFor 生成 test/rules-test.html 的测试用例。
- 用 CC.Test.moves(actual, expected, label) 断言，expected 形如 ['a1a2','a1a3']
- 至少覆盖：正常走子、被己方子阻挡、吃对方子、起点无子、盘边位置
- 只输出完整 html 文件
```

### C3 修 bug
```
现象：[粘贴失败的断言和实际/期望值]
相关代码：[粘贴函数]
请只定位并修复这一个问题，不要重构、不要改动其他函数签名。
修复后说明：根因是什么、改了哪几行。
```

### C4 让 AI 自审（重要）
```
请逐条核对以下 14 项，逐条回答"通过/不通过 + 依据"，不要跳过：
1 没有 import/export/require  2 没有第三方库  3 是 IIFE 且挂到固定 CC 子命名空间
4 只用 (x,y) 无 row/col  5 board 是一维 90 长度  6 棋子是单字符大小写编码
7 返回结构符合 Result  8 错误码在 8 个之内  9 applyMove 未修改入参
10 函数名参数与契约一致  11 没有越界做别人模块的事  12 没有 try/catch 吞异常
13 没有 TODO/省略号/半截代码  14 每个函数上方有一行中文注释
最后给出结论：可以直接提交 / 需要修改（列出需改项）。
```

---

## D. AI 最容易犯的 14 个错（评审时对着看）

| # | 典型错误 | 后果 | 一句话纠正 |
|---|---|---|---|
| 1 | 用 `import/export` | `file://` 双击打不开，全组联调失败 | 改 IIFE + 全局 `CC` |
| 2 | 用 `row/col` 或 1–9 坐标 | 和别人的代码接不上，暗病 | 只认 `(x, y)` |
| 3 | 棋子用汉字或对象 | 序列化、FEN、AI 全崩 | 单字符大小写 |
| 4 | `board[y][x]` 二维数组 | 索引全错 | 一维 `idx = y*9+x` |
| 5 | 返回 `true/false` | 上层拿不到失败原因 | 返回 `Result` |
| 6 | 自造错误码 | UI 判断不了 | 只用 8 个 |
| 7 | `applyMove` 里改入参 | 悔棋、AI 搜索全乱 | 复制后改 |
| 8 | 在 rules 里判将军 | 和 P3 职责打架，双重过滤变慢 | 越界了，删掉 |
| 9 | 在 view 里判合法性 | UI 和规则不同步 | 只上报坐标 |
| 10 | 引入 chess.js / 任何 CDN | 违背零依赖，还要联网 | 全删 |
| 11 | "顺手优化"函数名 | 别人的调用全红 | 名字就是契约 |
| 12 | `try/catch` 吞掉异常 | 出错静默，极难查 | 让它崩，崩了才看得见 |
| 13 | 输出"其余同上" | 代码根本跑不了 | 要完整文件 |
| 14 | 用 `console.log` 当测试 | 没有回归，改一次错一次 | 用 `CC.Test` |

---

## E. 精简版公约（AI 上下文有限时用，20 行内）

```
中国象棋 Web 项目，原生 JS，零依赖，禁用 ESM/import/第三方库。
每个文件 IIFE 挂到 CC.Xxx，命名空间固定八个：Board/Rules/Check/Game/AI/Notation/View/Test。
坐标 (x,y)：x 0-8 左到右，y 0-9 上到下；board 是一维 Array(90)，idx=y*9+x，空位 null。
棋子单字符：红大写 K A B N R C P，黑小写 k a b n r c p。
GameState{board,turn,halfMove,fullMove}；Move{from,[x,y] to,piece,captured}。
失败返回 {ok:false,reason:'E_XXX'}，错误码只有 E_NOT_YOUR_TURN / E_EMPTY_CELL / E_OWN_PIECE /
E_OPPONENT_PIECE / E_OUT_OF_BOARD / E_ILLEGAL_MOVE / E_SELF_CHECK / E_GAME_OVER。
applyMove 返回新 state，不改入参。函数名参数严格照契约，不许改名加参。
只写自己的文件，不越界实现别人模块的逻辑。输出完整文件，不省略、不写 TODO。
```

---

## F. 提交前 30 秒自检（你自己过，不靠 AI）

- [ ] 打开 `test.html` 是**双击**打开的（不是起服务器），页面全绿；
- [ ] 全局搜 `import `、`require(`、`row`、`col`、`console.log`、`TODO`，结果为空；
- [ ] 搜自己的文件里有没有出现别人命名空间（如 `CC.Rules` 出现在 `view.js`）；
- [ ] 函数名与契约表逐条对齐（改过名 AI 不会告诉你）；
- [ ] 一次 commit 只改自己的文件。
