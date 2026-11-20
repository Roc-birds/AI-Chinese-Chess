// P4 · CC.Game —— 对局控制器（负责人：C）
// 实现前必读：docs/接口契约.md 第二节 + docs/AI编码指令.md 的 B3 段。
// 全项目唯一有状态的对象；事件只有 move / undo / reset / end 四个。
// AI 接线在 app.js（订阅 move → search → play），本模块不感知人机。
(function (CC) {
  'use strict';
  const Game = {};

  Game.create = function (opts) { /* opts: { mode: 'pvp'|'pve'|'eve', aiSide: 'b', onMove, onEnd } */ };

  CC.Game = Game;
})(window.CC = window.CC || {});
