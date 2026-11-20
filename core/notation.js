// P6 · CC.Notation —— 中文记谱 / PGN / 回放（负责人：F）
// 实现前必读：docs/接口契约.md 第二节 + docs/AI编码指令.md 的 B6 段。
// 路数换算：红方路数 = 9 - x，黑方 = 1 + x；红用汉字数字，黑用阿拉伯数字。
(function (CC) {
  'use strict';
  const Notation = {};

  Notation.toChinese = function (state, move) { /* 如"炮二平五" */ };
  Notation.fromChinese = function (state, text) { /* 反向解析 */ };
  Notation.toPGN = function (moves, meta) { /* 导出棋谱 */ };
  Notation.parsePGN = function (text) { /* 导入棋谱 */ };
  Notation.replay = function (state, moves, upto) { /* 快进到第 upto 步 */ };

  CC.Notation = Notation;
})(window.CC = window.CC || {});
