// P1 · CC.View —— 渲染与交互（负责人：D）
// 实现前必读：docs/接口契约.md 第二节 + docs/AI编码指令.md 的 B4 段。
// 全项目唯一碰 DOM 的模块；渲染只读 state，用户操作只通过回调上报坐标。
(function (CC) {
  'use strict';
  const View = {};

  View.mount = function (el, opts) { /* opts: { onCellClick(x,y), onDrop(from,to), flipped } */ };
  View.render = function (state) { /* 全量重绘，禁止修改 state */ };
  View.highlight = function (cells, type) { /* 'move' | 'lastMove' | 'check' | 'select' */ };
  View.animateMove = function (move, cb) { /* 走子动画，结束必须回调 */ };
  View.setFlipped = function (bool) { /* 翻转视角 */ };
  View.flashCheck = function (side) { /* 将军提示 */ };

  CC.View = View;
})(window.CC = window.CC || {});
