// P7 · 总装入口（负责人：A）
// 职责：按顺序加载各模块 → 创建 CC.Game（mode/aiSide 见契约 v1.1）→ 挂载 CC.View。
// 人机模式的接线也在这里：订阅 game 的 move 事件，轮到 aiSide 时 ai.search → game.play。
(function (CC) {
  'use strict';
  const App = {};

  App.start = function () { /* 总装：读配置 → Game.create → View.mount → 绑事件 */ };

  CC.App = App;
})(window.CC = window.CC || {});
