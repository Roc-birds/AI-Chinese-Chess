# 中国象棋 · 六人协作（AI 生成代码）

原生 JavaScript 实现，双击 `index.html` 即可游玩，零依赖零构建。
初次团队协作练习：用统一的 AI 指令生成代码，用 Git/GitHub 管理合并。

## 开工前必读（按顺序）

1. [`docs/接口契约.md`](docs/接口契约.md) —— 函数签名、数据结构、错误码，**唯一事实来源**
2. [`docs/六人分工方案.md`](docs/六人分工方案.md) —— 你负责哪个模块、什么时候交什么
3. [`docs/AI编码指令.md`](docs/AI编码指令.md) —— 把【A 通用公约】+ 你的角色段贴给 AI 再开始生成

## 日常流程

```bash
git checkout main && git pull          # 1. 更新
git checkout <你的分支> && git rebase main   # 2. 同步到最新
# 3. 写代码：只改自己独占的文件（见 .github/CODEOWNERS）
# 4. 双击 test/test-kit 相关页面，确认全绿
git add <文件> && git commit -m "feat(<模块>): 做了什么"
git push origin <你的分支>              # 5. 推送并发 PR
```

## 铁律（违反 = PR 被拒）

- 只改自己独占的文件；需要别人加功能 → 提 Issue
- 函数名、参数、返回结构、错误码严格照契约，禁止改名、禁止自造
- 禁止 `import/export`、第三方库、TypeScript、TODO、用 console.log 当测试
- 接口要改：先改 `docs/接口契约.md` 并经 A 批准，再改代码
- CI（`.github/workflows/check.yml`）会自动扫描以上禁用项，红灯不能合并

## 目录结构

| 目录 | 内容 | 负责人 |
|---|---|---|
| `core/board.js` | 坐标 / 棋子编码 / FEN | A（带头人） |
| `core/rules.js` | 走法生成 | B |
| `core/validate.js` `core/game.js` | 校验 + 对局控制 | C |
| `ui/` | 渲染与交互 | D |
| `ai/engine.js` | AI 引擎 | E |
| `core/notation.js` `test/` | 棋谱 + 测试基建 | F |
| `app.js` | 总装入口 | A |

## 分支说明

`main` 受保护，**只接受 PR，且合并权集中在 A（@Roc-birds）**：
五个人只负责"推自己的分支 + 发 PR"，评审合并统一由 A 操作。
个人长期分支：`fwc / hsy / hyp / tmh / ycq / zzn`，每天开工前先 `rebase main`。
