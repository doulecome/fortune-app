const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('C:/Users/42134/.workbuddy/binaries/node/workspace/node_modules/jsdom');

const DIR = 'C:/Users/42134/WorkBuddy/2026-08-05-00-54-43/';
const html = fs.readFileSync(DIR + 'fortune.html', 'utf8');

const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => { const m = e.detail ? (e.detail.stack || e.detail.message) : e.message; if(/Not implemented:.*HTMLCanvasElement/i.test(m)) return; errors.push('[jsdomError] ' + m); });
vc.on('error', (...a) => errors.push('[console.error] ' + a.join(' ')));

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  url: 'http://localhost/',
  pretendToBeVisual: true,
  virtualConsole: vc,
  beforeParse(window) {
    window.alert = () => {};
    window.confirm = () => true;
    window.prompt = () => '';
    window.fetch = async () => ({ ok: false, status: 0, text: async () => '' });
    window.addEventListener('error', e => errors.push('[window.error] ' + (e.error ? e.error.stack : e.message)));
    window.addEventListener('unhandledrejection', e => errors.push('[unhandledrejection] ' + (e.reason && e.reason.stack ? e.reason.stack : e.reason)));
  }
});

setTimeout(() => {
  const { window } = dom;
  const doc = window.document;
  console.log('全局库: Solar=' + typeof window.Solar + ' Lunar=' + typeof window.Lunar + ' cnchar=' + typeof window.cnchar);

  // 1) 标签切换
  const tabs = [...doc.querySelectorAll('.tab')];
  console.log('标签数:', tabs.length);
  tabs.forEach(t => { try { t.click(); } catch (e) { errors.push('[tab:' + (t.dataset.p) + '] ' + e.stack); } });

  // 2) 所有按钮
  const btns = [...doc.querySelectorAll('button')];
  console.log('按钮数:', btns.length);
  btns.forEach(b => { try { b.click(); } catch (e) { errors.push('[btn:' + (b.id || b.textContent) + '] ' + e.stack); } });

  // 3) 抽查结果内容（计算同步立即生成；焚香约1s + 揭幕叙事 2000ms + 移除 460ms，故探针放到 3600ms）
  setTimeout(() => {
    const probe = [
      ['baziResult', '八字'],
      ['chengguResult', '称骨'],
      ['ziweiResult', '紫微'],
      ['qimenResult', '奇门'],
      ['tarotResult', '塔罗'],
    ];
    console.log('\n--- 结果抽查 ---');
    probe.forEach(([id, name]) => {
      const el = doc.getElementById(id);
      const txt = el ? el.innerText || el.textContent || '' : '';
      console.log(name + ' (' + id + '): ' + (txt.length > 0 ? '有内容 ' + txt.length + '字' : '空 ⚠️') + (name === '塔罗' ? ' (含SVG:' + (el && el.innerHTML.includes('<svg') ? '是' : '否') + ')' : ''));
    });
    const bazi = doc.getElementById('baziResult');
    const fxDraw = bazi ? bazi.querySelectorAll('.fx-draw').length : 0;
    console.log('图表自绘 fx-draw 数: ' + fxDraw);
    const bloom = doc.querySelector('.ink-bloom');
    console.log('揭幕层残留: ' + (bloom ? '有(异常)' : '无(已清除)'));

    // 4) 面板内主测算结果应被隐藏为弹窗源（is-source）：点击测算后只弹窗、面板下方不显示数据
    console.log('\n--- 面板内结果隐藏检查（应全部 is-source）---');
    ['bazi', 'ziwei', 'qimen', 'tarot'].forEach(pid => {
      const p = doc.getElementById(pid);
      if (!p) { console.log(pid + ': 面板缺失 ⚠️'); return; }
      const res = [...p.querySelectorAll('.result')];
      const hidden = res.filter(r => r.classList.contains('is-source')).length;
      console.log(pid + ': 结果数=' + res.length + ' 已隐藏(is-source)=' + hidden + ' ' + (res.length > 0 && hidden === res.length ? '✅' : '❌ 面板下方仍显示数据'));
    });

    // 5) 占卜异步弹窗专项：塔罗选牌后真解读应弹窗（验证修复：异步生成结果也能进弹窗，而非只弹"洗牌中"占位置）
    setTimeout(() => {
      const fan = doc.querySelector('#tarotStage .fan-card');
      if (fan) { try { fan.click(); } catch (e) { errors.push('[tarotPick] ' + e.stack); } }
      setTimeout(() => {
        const rm = doc.getElementById('readModal');
        const body = rm ? rm.querySelector('#readBody') : null;
        const t = body ? (body.textContent || '') : '';
        console.log('\n--- 占卜异步弹窗专项（塔罗选牌）---');
        console.log('选牌后弹窗打开: ' + (rm && rm.classList.contains('show') ? '✅' : '❌'));
        console.log('弹窗含塔罗真解读(正/逆位): ' + (/正位|逆位/.test(t) ? '✅' : '❌') + ' 字数=' + t.length);
        console.log('tarot 面板仍为隐藏源(is-source): ' + (doc.querySelector('#tarotResult .result.is-source') ? '✅' : '❌'));
        console.log('\n===== 运行时错误 (' + errors.length + ') =====');
        if (!errors.length) console.log('无运行时错误 ✅ 整页脚本加载与全部交互均正常');
        else errors.forEach(e => console.log('- ' + e.slice(0, 500)));
      }, 450);
    }, 200);
  }, 3600);
}, 2000);
