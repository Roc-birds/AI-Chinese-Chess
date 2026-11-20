// P5 · CC.AI —— 引擎（负责人：E）
// 实现前必读：docs/接口契约.md 第二节 + docs/AI编码指令.md 的 B5 段。
// 第一天先交付 randomMove（占位假 AI），再逐步换搜索；对外只吃 GameState、只吐 Move。
(function (CC) {
  'use strict';
  const AI = {};

  AI.create = function (opts) { /* opts: { depth=3, timeLimit=3000, seed=null } */ };
  AI.search = function (state) { /* { move, score, nodes, timeMs }，超时返回当前最优 */ };
  AI.evaluate = function (state, side) { /* side 视角估值，1 兵 = 100，红正黑负 */ };
  AI.randomMove = function (state) { /* 从合法着法随机挑一个，无着可走返回 null */ };

  CC.AI = AI;
})(window.CC = window.CC || {});
