const fs = require('fs');
const { JSDOM, VirtualConsole } = require('C:/Users/42134/.workbuddy/binaries/node/workspace/node_modules/jsdom');
const html = fs.readFileSync('fortune.html', 'utf8');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => { const m = e.detail ? (e.detail.stack || e.detail.message) : e.message; if (/Not implemented:.*HTMLCanvasElement/i.test(m)) return; errors.push('[jsdomError] ' + m); });
vc.on('error', (...a) => errors.push('[console.error] ' + a.join(' ')));
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true, virtualConsole: vc,
  beforeParse(w){ w.alert=()=>{}; w.confirm=()=>true; w.prompt=()=>''; w.fetch=async()=>({ok:false,text:async()=>''});
    w.addEventListener('error', e => errors.push('[window.error] ' + (e.error?e.error.stack:e.message)));
    w.addEventListener('unhandledrejection', e => errors.push('[unhandledrejection] ' + (e.reason&&e.reason.stack?e.reason.stack:e.reason))); } });
const wait = ms => new Promise(r => setTimeout(r, ms));
const doc = () => dom.window.document;
const GZ = '甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥';
const isGZ = s => s && s.length===2 && GZ.includes(s[0]) && GZ.includes(s[1]);
const out = [];
(async () => {
  await wait(2000);
  // === #144 历法/算法校验：八字四柱有效性 + 已知样例比对 ===
  doc().querySelector('.tab[data-p="bazi"]').click(); await wait(100);
  const setVal = (id,v) => { const el=doc().getElementById(id); if(el) el.value=v; };
  setVal('birth','1990-06-15'); setVal('hour','11'); setVal('gender','男'); // 午时
  const solar=doc().getElementById('useSolar'); if(solar) solar.checked=false;
  const bb=doc().getElementById('baziBtn'); if(bb) bb.click();
  await wait(900);
  const gz=[...doc().querySelectorAll('#baziResult .gz')].map(e=>e.textContent.trim());
  const ok = gz.length===4 && gz.every(isGZ);
  // 已知正确四柱（1990-06-15 午时，男，钟表时/不校正）：庚午 壬午 丁巳 丙午
  const expect='庚午 壬午 丁巳 丙午';
  const match = gz.join(' ')===expect;
  out.push('[八字四柱] 柱数='+gz.length+' 值='+gz.join(' ')+' | 有效干支='+(ok?'✅':'❌')+' | 已知样例比对('+expect+')='+(match?'✅':'❌'));
  const dayGan = gz[2] ? gz[2][0] : '';
  out.push('[八字] 日主='+dayGan+' | 文本含日主相关判词='+(dayGan && (doc().getElementById('baziResult').textContent||'').includes(dayGan)?'✅':'❌'));
  // 独立交叉校验：直接用页面内 lunar.js 计算同日四柱，确认 app 没有接错参数（非自证）
  try{
    const w=dom.window;
    const ec=w.Solar.fromYmdHms(1990,6,15,12,0,0).getLunar().getEightChar();
    const ref=[ec.getYear(),ec.getMonth(),ec.getDay(),ec.getTime()].join(' ');
    const refOk = ref===gz.join(' ');
    out.push('[八字·交叉校验] lunar.js 直算='+ref+' | 与页面一致='+(refOk?'✅':'❌'));
  }catch(e){ out.push('[八字·交叉校验] 无法直算: '+e.message); }

  // === #145 灵数逻辑自洽：流年数 + 姓名灵数 真正计算 ===
  doc().querySelector('.tab[data-p="numerology"]').click(); await wait(100);
  setVal('numoBirth','1990-05-15'); setVal('numoName','测试');
  doc().getElementById('numoBtn').click(); await wait(500);
  const nr = doc().getElementById('numoResult').textContent||'';
  out.push('[灵数] 含流年数='+(nr.includes('流年数')?'✅':'❌')+' | 含姓名灵数='+(nr.includes('姓名灵数')?'✅':'❌')+' | 含顺势/觉察='+(nr.includes('顺势')&&nr.includes('觉察')?'✅':'❌'));
  // master 不破：生日数字恰好成 11/22/33 的情况（1990-05-15 → 1990+5+15=2010→3，非master；改测 1988-08-08）
  setVal('numoBirth','1988-08-08'); doc().getElementById('numoBtn').click(); await wait(300);
  const nr2 = doc().getElementById('numoResult').textContent||'';
  out.push('[灵数 master] 1988-08-08 → 1988+8+8=2004→6，结果含"生命灵数 6"='+(nr2.includes('生命灵数 6')?'✅':'❌'));

  // === #142 测字：笔画(cnchar) + 五行 + 81数 链路 ===
  doc().querySelector('.tab[data-p="cezi"]').click(); await wait(100);
  setVal('ceziChar','道');
  doc().getElementById('ceziBtn').click(); await wait(400);
  const cr = doc().getElementById('ceziResult').textContent||'';
  out.push('[测字] 含"画"='+(cr.includes('画')?'✅':'❌')+' | 含"五行"='+(cr.includes('五行')?'✅':'❌')+' | 含81数吉凶('+cr.includes('吉')||cr.includes('凶')||cr.includes('平')+')');
  // 缺字守卫
  setVal('ceziChar',''); doc().getElementById('ceziBtn').click(); await wait(200);
  out.push('[测字] 缺字守卫='+((doc().getElementById('ceziResult').textContent||'').includes('请写')?'✅':'❌'));

  console.log(out.join('\n'));
  console.log('\n===== 运行时错误 (' + errors.length + ') =====');
  if (!errors.length) console.log('无运行时错误 ✅'); else errors.forEach(e => console.log('- ' + e.slice(0, 400)));
  process.exit(0);
})();
