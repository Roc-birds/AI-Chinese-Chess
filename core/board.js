// P0 · CC.Board —— 坐标 / 棋子编码 / FEN（负责人：A）
// 实现前必读：docs/接口契约.md 第二节 + docs/AI编码指令.md 的 B1 段。
// 硬约定：idx = y * 9 + x；board 长度 90；空位 null；红大写 K A B N R C P，黑小写。
(function (CC) {
  'use strict';
  const Board = {};

  Board.create = function () { /* 返回标准起始局面 GameState */ };
  Board.empty = function () { /* 返回全 null 的 Array(90) */ };
  Board.idx = function (x, y) { /* 返回 y*9+x */ };
  Board.inBoard = function (x, y) { /* 是否在盘内 */ };
  Board.at = function (state, x, y) { /* 取某格棋子 */ };
  Board.set = function (state, x, y, ch) { /* 放子，返回新状态 */ };
  Board.clone = function (state) { /* 深拷贝 */ };
  Board.sideOf = function (piece) { /* 'r' | 'b' | null */ };
  Board.isRed = function (piece) { /* 是否红子 */ };
  Board.parseFEN = function (fen) { /* 解析 FEN → GameState */ };
  Board.toFEN = function (state) { /* GameState → FEN，与 parseFEN 互逆 */ };

  CC.Board = Board;
})(window.CC = window.CC || {});
