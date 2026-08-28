/* 动效精修专项验证：逐笔错落 / 揭幕 enso / 逐字题写 / 数字滚动 / 暂停态释放 */
const fs = require('fs');
const { JSDOM } = require('C:/Users/42134/.workbuddy/binaries/node/workspace/node_modules/jsdom');

const html = fs.readFileSync('fortune.html', 'utf8');
const errors = [];
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'file:///C:/fortune.html',
  virtualConsole: new (require('C:/Users/42134/.workbuddy/binaries/node/workspace/node_modules/jsdom').VirtualConsole)()
    .on('jsdomError', e => { if(/Not implemented:.*HTMLCanvasElement/i.test(e.message)) return; errors.push(e.message); }),
});

setTimeout(() => {
  const doc = dom.window.document;

  // 触发八字（含星图/雷达/时间轴/判词/数字）
  const fill = (id, v) => { const e = doc.getElementById(id); if (e) e.value = v; };
  fill('by', '1994'); fill('bm', '7'); fill('bd', '15'); fill('bh', '9');
  const btn = doc.getElementById('baziBtn');
  if (btn) btn.dispatchEvent(new dom.window.Event('click'));

  // 焚香仪式(首测约1s)结束后才创建墨滴揭幕，故先等焚香结束再检查五幕结构
  setTimeout(() => {
    const b = doc.querySelector('.ink-bloom');
    console.log('--- 揭幕瞬间：连续叙事结构 ---');
    console.log('揭幕层出现:', !!b, '| saga 模式:', b ? b.classList.contains('saga') : 'n/a');
    console.log('幕一 悬滴 .sg-drop:', b ? b.querySelectorAll('.sg-drop').length : 0, '(应为1)');
    console.log('幕二 冲击环:', b ? b.querySelectorAll('.sg-shock').length : 0, '| 溅点:', b ? b.querySelectorAll('.sg-splash').length : 0, '(应为1/6)');
    console.log('幕三 墨渍层:', b ? b.querySelectorAll('.sg-blot').length : 0, '(应为3，b1/b2/b3)');
    const bl = b ? [...b.querySelectorAll('.sg-blot')] : [];
    console.log('  墨渍轮廓为不规则曲线:', bl.length ? bl.every(p => (p.getAttribute('d') || '').includes('C')) : false);
    console.log('  三层形状互不相同:', new Set(bl.map(p => p.getAttribute('d'))).size === bl.length);
    console.log('幕四 支环:', b ? b.querySelectorAll('.sg-ring').length : 0, '| 连线:', b ? b.querySelectorAll('.sg-link').length : 0, '| 八星:', b ? b.querySelectorAll('.sg-star').length : 0, '| 日主:', b ? b.querySelectorAll('.sg-core').length : 0);
    const st = b ? [...b.querySelectorAll('.sg-star')] : [];
    console.log('  每颗星都带自身位移 --tx/--ty:', st.length ? st.every(g => g.style.getPropertyValue('--tx') && g.style.getPropertyValue('--ty')) : false);
    console.log('  星点逐颗错开 --d:', new Set(st.map(g => g.style.getPropertyValue('--d'))).size, '种');
    console.log('分幕字幕:', b ? [...b.querySelectorAll('.saga-cap span')].map(s => s.textContent).join('→') : 'n/a');
    console.log('叙事时长 dataset.dur:', b ? b.dataset.dur + 'ms' : 'n/a');
    console.log('旧 enso / 旧 spinner 已退场:', b ? (!b.querySelector('.enso') && !b.querySelector('.bloom-ring')) : 'n/a');
    console.log('结果被按住(fx-hold):', doc.querySelectorAll('.result.fx-hold').length);

    // 叙事星图坐标须与正文星图重合，否则「墨晕成图」的接续会露馅
    if (st.length) {
      const c0 = st[0].querySelector('circle');
      console.log('  首星坐标:', c0.getAttribute('cx') + ',' + c0.getAttribute('cy'),
        '| 应为 280+126cos(-108°)=' + (280 + 126 * Math.cos(-108 * Math.PI / 180)).toFixed(1)
        + ',' + (232 + 126 * Math.sin(-108 * Math.PI / 180)).toFixed(1));
    }

      // 等焚香(1s) + 淡出(330ms) + 叙事结束(2000+500ms) + 数字滚动 → 检查释放
      setTimeout(() => {
        const bazi = doc.getElementById('baziResult');
      const draws = bazi ? [...bazi.querySelectorAll('.fx-draw')] : [];
      const withDelay = draws.filter(e => e.style.getPropertyValue('--d'));
      const delays = withDelay.map(e => parseFloat(e.style.getPropertyValue('--d'))).filter(n => isFinite(n));
      const durs = new Set(draws.map(e => e.style.getPropertyValue('--dur')).filter(Boolean));

      console.log('\n--- 逐笔错落自绘 ---');
      console.log('fx-draw 总数:', draws.length);
      console.log('已设逐笔延迟 --d 的:', withDelay.length);
      console.log('延迟范围:', delays.length ? Math.min(...delays).toFixed(3) + 's ~ ' + Math.max(...delays).toFixed(3) + 's' : '无');
      console.log('唯一延迟值个数(>1 才算真错落):', new Set(delays).size);
      console.log('运笔时长档位:', [...durs].join(' / ') || '无');

      console.log('\n--- 逐字题写 ---');
      const tw = doc.querySelectorAll('.tw');
      console.log('题写元素:', tw.length, '| 拆出字数:', doc.querySelectorAll('.tw > i').length);
      if (tw[0]) console.log('首个题写内容:', tw[0].textContent.trim().slice(0, 30));
      const twDelays = [...doc.querySelectorAll('.tw > i')].slice(0, 5).map(e => e.style.getPropertyValue('--d'));
      console.log('前5字延迟:', twDelays.join(' '));

      console.log('\n--- 数字滚动 ---');
      const ln = doc.querySelector('#baziResult .lucknum');
      console.log('lucknum 存在:', !!ln, '| 最终值:', ln ? ln.textContent.trim() : 'n/a');

      console.log('\n--- 暂停态释放（关键：内容不能卡住） ---');
      console.log('仍被按住的 .fx-hold:', doc.querySelectorAll('.fx-hold').length, '(必须为 0)');
      console.log('揭幕层残留:', doc.querySelectorAll('.ink-bloom').length, '(必须为 0)');

      console.log('\n--- 视差 ---');
      console.log('--sy 已写入:', doc.documentElement.style.getPropertyValue('--sy') !== '' ? '是' : '否');

      // 重复测算应直接弹出完整解读弹窗（点击测算即生成进弹窗），
      // 且面板不再有焚香/墨滴中间叙事层（旧"二次揭幕精简"断言已废弃）。
      console.log('\n--- 重复测算：直接弹窗、无面板叙事残留 ---');
      if (btn) btn.dispatchEvent(new dom.window.Event('click'));
      setTimeout(() => {
        const modal = doc.getElementById('readModal');
        const shown = modal && modal.classList.contains('show');
        console.log('重复测算后弹窗已打开:', shown ? '✅' : '❌ 期望弹窗直接打开');
        const b2 = doc.querySelector('.ink-bloom');
        console.log('面板叙事层残留:', b2 ? '❌ 仍有 .ink-bloom' : '无 ✅ (已移除焚香/墨滴中间叙事)');

        console.log('\n===== 运行时错误 (' + errors.length + ') =====');
        errors.slice(0, 5).forEach(e => console.log('- ' + e.slice(0, 300)));
        if (!errors.length) console.log('无 ✅');
      }, 1000);
    }, 2600);
  }, 1450);
}, 1500);
