// P3 · CC.Check —— 合法性与终局判定（负责人：C）
// 实现前必读：docs/接口契约.md 第二节 + docs/AI编码指令.md 的 B3 段。
(function (CC) {
  'use strict';
  const Check = {};

  Check.isInCheck = function (state, side) { /* side 是否被将军 */ };
  Check.isKingsFacing = function (state) { /* 将帅照面（白脸将） */ };
  Check.legalMoves = function (state, side) { /* 过滤送将后的真·合法着法 */ };
  Check.validate = function (state, move) { /* 完整校验，返回 Result */ };
  Check.status = function (state) { /* 'playing' | 'r-win' | 'b-win' | 'draw' */ };
  Check.isCheckmate = function (state, side) { /* 被将且无解 */ };
  Check.isStalemate = function (state, side) { /* 未被将但无着可走 */ };

  CC.Check = Check;
})(window.CC = window.CC || {});
