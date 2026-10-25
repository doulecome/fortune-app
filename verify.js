/* 玄机阁回归样例库：在 Node vm 沙箱加载页面内联脚本，对固定生辰矩阵做快照比对。
   用法：
     node verify.js            # 对照 verify-samples.json 快照校验
     node verify.js --update   # 重新生成快照（算法有意变更后使用） */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = path.join(__dirname, 'index.html');
const SNAP = path.join(__dirname, 'verify-samples.json');

/* ---------- DOM / 浏览器桩：让主脚本顶层接线代码零崩溃 ---------- */
function makeEl(id) {
  const el = {
    id: id || '', value: '', textContent: '', checked: false, dataset: {},
    style: new Proxy({}, { get: () => '', set: () => true }),
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    setAttribute() {}, getAttribute: () => null, removeAttribute() {},
    appendChild() {}, removeChild() {}, insertBefore() {}, remove() {},
    addEventListener() {}, removeEventListener() {},
    querySelector: () => null, querySelectorAll: () => [],
    closest: () => null, contains: () => false,
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 0, height: 0 }),
    getContext: () => new Proxy({}, { get: (t, k) => (k === 'measureText' ? () => ({ width: 0 }) : typeof k === 'string' ? (k.toLowerCase().includes('font') || k.toLowerCase().includes('color') ? '' : () => undefined) : undefined), set: () => true }),
    toDataURL: () => 'data:,', toBlob: () => {},
    focus() {}, click() {}, scrollIntoView() {},
    firstChild: null, parentNode: null, offsetParent: null, innerHTML: '', outerHTML: '',
  };
  return el;
}
function makeSandbox() {
  const noop = () => {};
  const sandbox = {
    console: { log: noop, warn: noop, error: noop, info: noop },
    setTimeout: () => 0, clearTimeout: noop, setInterval: () => 0, clearInterval: noop,
    requestAnimationFrame: () => 0, cancelAnimationFrame: noop,
    matchMedia: () => ({ matches: false, addListener: noop, removeListener: noop, addEventListener: noop }),
    localStorage: (() => { const m = {}; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; } }; })(),
    sessionStorage: (() => { const m = {}; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; } }; })(),
    location: { href: 'http://localhost/', search: '', reload: noop },
    navigator: { userAgent: 'verify', language: 'zh-CN' },
    history: { back: noop, forward: noop, pushState: noop },
    MutationObserver: class { observe() {} disconnect() {} },
    IntersectionObserver: class { observe() {} disconnect() {} unobserve() {} },
    ResizeObserver: class { observe() {} disconnect() {} },
    SpeechSynthesisUtterance: class {}, speechSynthesis: { speak: noop, cancel: noop },
    performance: { now: () => 0 },
    fetch: () => Promise.reject(new Error('verify: no network')),
    URL: { createObjectURL: () => '', revokeObjectURL: noop },
    Blob: class {}, alert: noop, confirm: () => false, prompt: () => null,
    addEventListener: noop, removeEventListener: noop, dispatchEvent: () => true,
    innerWidth: 1280, innerHeight: 720, devicePixelRatio: 1,
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  sandbox.document = {
    getElementById: id => { cache[id] = cache[id] || makeEl(id); return cache[id]; },
    querySelector: () => null, querySelectorAll: () => [],
    createElement: tag => makeEl(tag), createTextNode: t => ({ nodeValue: t }),
    createTreeWalker: () => ({ nextNode: () => null }),
    addEventListener: noop, removeEventListener: noop,
    body: makeEl('body'), documentElement: (() => { const de = makeEl('html'); de.style = new Proxy({}, { get: () => () => '', set: () => true }); return de; })(), head: makeEl('head'),
  };
  const cache = sandbox.document && {};
  sandbox.__elCache = cache;
  // getElementById 闭包引用 cache（上面字面量里 cache 未初始化前被调用会炸，改为函数式）
  sandbox.document.getElementById = id => { cache[id] = cache[id] || makeEl(id); return cache[id]; };
  return sandbox;
}

/* ---------- 加载页面脚本 ---------- */
function loadApp() {
  const html = fs.readFileSync(SRC, 'utf8');
  const re = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  const ctx = makeSandbox();
  vm.createContext(ctx);
  let mainInjected = false;
  while ((m = re.exec(html))) {
    let code = m[1];
    /* 主脚本（含 baziStrength 的最大块）：尾部追加导出行，把函数与表从词法作用域带出来 */
    if (code.includes('function baziStrength') && !mainInjected) {
      code += `\n;globalThis.__V={baziStrength,zipingSchool,shenOf,shiShen,DZ_BENQI,GAN_WU,DZ_WU,SHENG,KE,yearGZ_LC:typeof yearGZ_LC!=='undefined'?yearGZ_LC:null,TIAOHOU,zwAnXing:typeof zwAnXing!=='undefined'?zwAnXing:null,_jiShiCalc:typeof _jiShiCalc!=='undefined'?_jiShiCalc:null,wuOfNum:typeof wuOfNum!=='undefined'?wuOfNum:null,Solar:typeof Solar!=='undefined'?Solar:null};`;
      mainInjected = true;
    }
    vm.runInContext(code, ctx, { filename: 'inline-script' });
  }
  if (!ctx.__V) throw new Error('主脚本未注入成功（未找到 baziStrength）');
  return ctx.__V;
}

/* ---------- 样例矩阵与快照 ---------- */
const SAMPLES = [
  ['1990-06-15', 11], ['1985-12-03', 9], ['2000-03-08', 23], ['1975-09-20', 1],
  ['2026-08-30', 11], ['1963-07-11', 15], ['2010-01-31', 7], ['1949-10-01', 19],
  ['1992-05-18', 7], /* 壬年样例：五虎遁壬年起壬寅的回归锚点 */
];
const ZH = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
/* 紫微安星快照：命宫/身宫/五行局/紫微/天府/十二宫星曜（与 iztro《全书》实现 1890 盘全量核对一致） */
function ziweiRow(V, y, m, day, h) {
  const lunar = V.Solar.fromYmd(y, m, day).getLunar();
  const hz0 = Math.floor((h + 1) / 2) % 12;
  const AX = V.zwAnXing(Math.abs(lunar.getMonth()), lunar.getDay(), hz0, lunar.getYearGan(), lunar.getYearZhi(), lunar.getMonth() < 0);
  const stars = {};
  Object.keys(AX.starMap).sort().forEach(z => { stars[z] = AX.starMap[z].trim().split(/\s+/).sort().join(' '); });
  return { ming: ZH[AX.ming], shen: ZH[AX.shen], mingGZ: AX.mingGZ, ju: AX.ju, zv: ZH[AX.zv], tf: ZH[AX.tf], stars };
}
function compute(V) {
  return SAMPLES.map(([d, h]) => {
    const [y, m, day] = d.split('-').map(Number);
    const lateZi = h === 23;
    const bs = V.baziStrength(y, m, day, h, lateZi);
    const pillars = bs.pillars;
    const dayGan = bs.dayGan;
    const ss = pillars.map(gz => V.shiShen(dayGan, gz.charAt(0)));
    const mz = pillars[1].charAt(1);
    const monthGe = V.shiShen(dayGan, V.DZ_BENQI[mz]);
    const zip = V.zipingSchool(dayGan, pillars, [ss[0], ss[1], ss[3]], mz, monthGe);
    /* 日柱神煞（以年支为基准，同 shenOf 主用法） */
    const shens = V.shenOf(dayGan, pillars[0].charAt(1), pillars[2].charAt(1));
    return {
      d, h,
      pillars: pillars.join(' '),
      dayGan,
      strength: { score: bs.score, level: bs.level, yong: bs.yongUniq },
      ziping: zip ? { geJu: zip.geJu, status: zip.status, xi: zip.xiWu, ji: zip.jiWu } : null,
      dayShens: shens,
      ziwei: ziweiRow(V, y, m, day, h),
    };
  });
}
function deepEq(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/* ---------- 吉时起法锚点（青龙起时口诀独立推得，防公式回退） ---------- */
function checkJiShi(V) {
  if (!V._jiShiCalc) throw new Error('_jiShiCalc 未导出');
  /* 口诀：子午临申、丑未戌上、寅申居子、卯酉居寅、辰戌龙位、巳亥上午；
     黄道六神青龙/明堂/金匮/天德/玉堂/司命 距青龙起时偏移 0/1/4/5/7/10 */
  const EXPECT = {
    '子': ['子','丑','卯','午','申','酉'],
    '丑': ['寅','卯','巳','申','戌','亥'],
    '寅': ['子','丑','辰','巳','未','戌'],
    '卯': ['子','寅','卯','午','未','酉'],
    '辰': ['寅','辰','巳','申','酉','亥'],
    '巳': ['丑','辰','午','未','戌','亥'],
  };
  for (const [day, want] of Object.entries(EXPECT)) {
    const got = V._jiShiCalc(day).map(t => t.charAt(0)).sort().join('');
    const exp = [...want].sort().join('');
    if (got !== exp) throw new Error('吉时锚点不符：' + day + '日 期望[' + exp + '] 实际[' + got + ']');
  }
}

/* ---------- 姓名数理五行锚点（尾数 1/2木 3/4火 5/6土 7/8金 9/0水） ---------- */
function checkWuOfNum(V) {
  if (!V.wuOfNum) throw new Error('wuOfNum 未导出');
  const EXPECT = { 1:'木',2:'木',3:'火',5:'土',7:'金',9:'水',10:'水',11:'木',20:'水',30:'水',38:'金' };
  for (const [n, w] of Object.entries(EXPECT)) {
    if (V.wuOfNum(+n) !== w) throw new Error('wuOfNum(' + n + ') 应为 ' + w + '，实际 ' + V.wuOfNum(+n));
  }
}

/* ---------- 文昌贵人锚点（庚猪辛鼠壬逢虎） ---------- */
function checkWenChang(V) {
  const hit = V.shenOf('辛', '午', '子');
  if (!hit.includes('文昌')) throw new Error('辛日文昌应在子，实际命中：' + hit.join(','));
  const wrong = V.shenOf('辛', '午', '戌');
  if (wrong.includes('文昌')) throw new Error('辛日文昌误落戌（旧表错误回归）');
}

/* ---------- 字五行字典锚点（charwu.js 外置文件：18 对康熙统一值 + 规模） ---------- */
function checkCharwu() {
  const cwPath = path.join(__dirname, 'charwu.js');
  if (!fs.existsSync(cwPath)) throw new Error('charwu.js 缺失');
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(cwPath, 'utf8'), ctx, { filename: 'charwu.js' });
  const D = ctx.window.CHAR_WU;
  if (!D) throw new Error('charwu.js 未产出 window.CHAR_WU');
  if (Object.keys(D).length < 19000) throw new Error('字五行字典键数异常：' + Object.keys(D).length);
  const UNIFIED = { '鸟':'木','动':'木','鱼':'木','绍':'木','创':'火','贵':'火','结':'火','统':'火','杨':'土','驰':'土','实':'金','宾':'金','轮':'水','庆':'水','请':'水','剧':'水','锋':'水','锐':'水' };
  for (const [k, v] of Object.entries(UNIFIED)) {
    if (D[k] !== v) throw new Error('字五行统一值回归：' + k + ' 应为 ' + v + '，实际 ' + D[k]);
  }
}

/* ---------- 紫微亮度表完整性检查（庙旺利陷真表，防改坏） ---------- */
function checkBrightness(V, html) {
  /* 表定义在紫微面板 onclick 作用域内，无法运行时导出——直接从源码抽取字面量 */
  const m = html.match(/const ZW_BRIGHT=(\{[^}]*\});/);
  const mz = html.match(/const ZW_ZHI='([^']+)'/);
  if (!m || !mz) throw new Error('源码中未找到 ZW_BRIGHT/ZW_ZHI 定义');
  const B = vm.runInNewContext('(' + m[1] + ')');
  const Z = mz[1];
  const stars = ['紫微','天机','太阳','武曲','天同','廉贞','天府','太阴','贪狼','巨门','天相','天梁','七杀','破军','文昌','文曲'];
  const chars = new Set(['庙','旺','得','利','平','不','陷']);
  if (Z !== '子丑寅卯辰巳午未申酉戌亥') throw new Error('ZW_ZHI 序错');
  for (const s of stars) {
    const row = B[s];
    if (!row || row.length !== 12) throw new Error('亮度表 ' + s + ' 行缺失或长度≠12');
    for (const c of row) if (!chars.has(c)) throw new Error('亮度表 ' + s + ' 含非法字符 ' + c);
  }
  if (Object.keys(B).length !== 16) throw new Error('亮度表应为 16 行，实际 ' + Object.keys(B).length);
  /* 《全书》锚点宫位 */
  const anchor = { 太阳: ['子', '陷'], 太阴: ['亥', '庙'], 天机: ['丑', '陷'], 破军: ['午', '庙'], 紫微: ['午', '庙'], 巨门: ['卯', '庙'] };
  for (const [s, [z, w]] of Object.entries(anchor)) {
    const got = B[s][Z.indexOf(z)];
    if (got !== w) throw new Error('亮度锚点不符：' + s + '在' + z + ' 应为 ' + w + '，实际 ' + got);
  }
}

/* ---------- 主流程 ---------- */
try {
  const V = loadApp();
  checkBrightness(V, fs.readFileSync(SRC, 'utf8'));
  checkJiShi(V);
  checkWuOfNum(V);
  checkWenChang(V);
  checkCharwu();
  const now = compute(V);
  if (process.argv.includes('--update')) {
    fs.writeFileSync(SNAP, JSON.stringify(now, null, 1), 'utf8');
    console.log('✓ 快照已更新：' + now.length + ' 个样例 → ' + path.basename(SNAP));
    process.exit(0);
  }
  if (!fs.existsSync(SNAP)) {
    fs.writeFileSync(SNAP, JSON.stringify(now, null, 1), 'utf8');
    console.log('✓ 首次运行已生成基线快照（' + now.length + ' 样例）。此后 node verify.js 即做回归比对。');
    process.exit(0);
  }
  const base = JSON.parse(fs.readFileSync(SNAP, 'utf8'));
  let bad = 0;
  now.forEach((row, i) => {
    if (!deepEq(row, base[i])) {
      bad++;
      console.error('✗ 样例不一致 [' + row.d + ' ' + row.h + '时]');
      ['pillars', 'dayGan', 'strength', 'ziping', 'dayShens', 'ziwei'].forEach(k => {
        if (!deepEq(row[k], base[i][k])) console.error('   ' + k + ': 期望 ' + JSON.stringify(base[i][k]) + ' → 实际 ' + JSON.stringify(row[k]));
      });
    }
  });
  if (bad) { console.error('✗ ' + bad + '/' + now.length + ' 样例与基线不符——若为有意变更，请 node verify.js --update'); process.exit(1); }
  console.log('✓ 回归通过：' + now.length + ' 个样例与基线完全一致');
} catch (e) {
  console.error('✗ verify 失败：' + e.message);
  process.exit(1);
}
