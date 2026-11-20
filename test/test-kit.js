// 共享测试基建 · CC.Test（负责人：A，所有人共用，禁止各自另写断言）
// 用法见 test/demo.html：页面底部自动生成汇总，只看失败数是否为 0。
(function (CC) {
  'use strict';
  const stats = { pass: 0, fail: 0, rows: [] };

  function record(pass, text) {
    stats.rows.push({ pass: pass, text: text });
    stats[pass ? 'pass' : 'fail']++;
  }

  const Test = {
    // 真值断言：ok(条件, '说明')
    ok: function (cond, label) {
      record(!!cond, label + ' → ' + (cond ? '通过' : '失败'));
    },

    // 相等断言（深度比较，适用于对象/数组）：eq(实际值, 期望值, '说明')
    eq: function (actual, expected, label) {
      const a = JSON.stringify(actual);
      const e = JSON.stringify(expected);
      const pass = a === e;
      record(pass, label + ' → ' + (pass ? '通过' : '失败 | 期望 ' + e + '，实际 ' + a));
    },

    // 着法集合比对（忽略顺序）：moves(实际着法数组, 期望着法数组, '说明')
    // 元素可以是 Move 对象 {from:[x,y],to:[x,y]}，也可以是 'x,y>x,y' 字符串
    moves: function (actual, expected, label) {
      const key = function (m) {
        if (typeof m === 'string') { return m; }
        return m.from.join(',') + '>' + m.to.join(',');
      };
      const a = (actual || []).map(key).sort();
      const e = (expected || []).map(key).sort();
      Test.eq(a, e, label + '（着法集合，忽略顺序）');
    },

    // 输出汇总到页面底部（必须在所有断言之后调用）
    report: function () {
      const box = document.createElement('div');
      box.style.cssText = 'font-family:monospace;font-size:14px;padding:16px;border-top:2px solid #999;';
      const head = document.createElement('div');
      head.style.cssText = 'font-size:16px;margin-bottom:8px;';
      head.textContent = '通过 ' + stats.pass + ' / 失败 ' + stats.fail +
        (stats.fail === 0 ? ' —— 全部通过' : ' —— 存在失败，禁止提交');
      head.style.color = stats.fail === 0 ? '#1a7f37' : '#c62828';
      box.appendChild(head);
      stats.rows.forEach(function (r) {
        const line = document.createElement('div');
        line.textContent = (r.pass ? '[通过] ' : '[失败] ') + r.text;
        line.style.color = r.pass ? '#333' : '#c62828';
        box.appendChild(line);
      });
      document.body.appendChild(box);
    }
  };

  CC.Test = Test;
})(window.CC = window.CC || {});
