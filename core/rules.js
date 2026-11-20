// P2 · CC.Rules —— 走法生成（负责人：B）
// 实现前必读：docs/接口契约.md 第二节 + docs/AI编码指令.md 的 B2 段。
// 只生成"符合兵种走法"的伪合法着法，不判送将、不判照面（那是 CC.Check 的职责）。
(function (CC) {
  'use strict';
  const Rules = {};

  Rules.genPseudoMoves = function (state, side) { /* Move[] */ };
  Rules.movesFor = function (state, x, y) { /* 单子着法，UI 高亮用 */ };
  Rules.isAttacked = function (state, x, y, bySide) { /* 反向扫描，禁止调 genPseudoMoves */ };
  Rules.applyMove = function (state, move) { /* 返回新 GameState，禁止修改入参 */ };
  Rules.undoMove = function (state, move) { /* applyMove 的逆运算，AI 搜索靠它提速 */ };

  CC.Rules = Rules;
})(window.CC = window.CC || {});
