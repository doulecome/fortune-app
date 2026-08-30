/* 玄机阁构建：根目录 index.html 是唯一源，build 后生成 deploy/index.html。
   用法：node build.js   （构建后建议 node verify.js 做冒烟校验）
   deploy 产物做「安全压缩」：内联 JS 经 terser 仅去注释/空白（compress/mangle 均关，
   不改名不重写逻辑），CSS 只去注释与行级空白；源文件保持人类可读。 */
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, 'index.html');
const DEPLOY = path.join(__dirname, 'deploy');

const html = fs.readFileSync(SRC, 'utf8');

/* 内联脚本语法冒烟：任一段解析失败即构建失败 */
const re = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g;
let m, n = 0;
while ((m = re.exec(html))) {
  n++;
  try { new Function(m[1]); }
  catch (e) { console.error('✗ 第 ' + n + ' 段内联脚本语法错误：' + e.message); process.exit(1); }
}

/* 关键交互标记检查：弹窗重绑与 K 线缩放必须同时在源里 */
for (const mark of ['window.bindKline=bindKline', 'klExpandBtn', 'setWindow(', "bindKline(document.getElementById('baziResult'))"]) {
  if (!html.includes(mark)) { console.error('✗ 缺少关键标记：' + mark); process.exit(1); }
}

/* —— deploy 安全压缩 —— */
async function compress(html) {
  let out = html;
  /* 1) 内联 JS：terser 只去注释与空白（compress/mangle 关闭，语义不动） */
  let terser = null;
  try { terser = require('terser'); } catch (e) { terser = null; }
  if (terser) {
    const parts = [];
    let last = 0, mm;
    const sr = /<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/g;
    while ((mm = sr.exec(out))) {
      parts.push({ pre: mm[1], code: mm[2], start: mm.index, end: mm.index + mm[0].length });
    }
    let rebuilt = '', cur = 0;
    for (const p of parts) {
      rebuilt += out.slice(cur, p.start);
      let tag = '<script' + p.pre + '>';
      try {
        const r = await terser.minify(p.code, { compress: false, mangle: false, format: { comments: false } });
        if (r.code) tag += '\n' + r.code + '\n';
        else tag += p.code;
      } catch (e) { tag += p.code; }   /* 压缩失败退回原码，宁可大不可坏 */
      rebuilt += tag + '</' + 'script>';
      cur = p.end;
    }
    rebuilt += out.slice(cur);
    out = rebuilt;
  }
  /* 2) CSS：去注释 + 去行级空白（保守，不合并声明） */
  out = out.replace(/<style([^>]*)>([\s\S]*?)<\/style>/g, (all, attrs, css) => {
    const mini = css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split('\n').map(l => l.trim()).filter(Boolean).join('\n');
    return '<style' + attrs + '>' + mini + '</style>';
  });
  return out;
}

(async () => {
  const before = html.length;
  const out = await compress(html);
  if (out.length > before * 1.02) { console.error('✗ 压缩产物异常膨胀，中止'); process.exit(1); }
  if (!out.includes('window.bindKline=bindKline')) { console.error('✗ 压缩后丢失关键标记'); process.exit(1); }
  /* 压缩产物逐段语法复检 */
  let c = 0; const re2 = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g;
  while ((m = re2.exec(out))) { c++; try { new Function(m[1]); } catch (e) { console.error('✗ 压缩后第 ' + c + ' 段脚本语法错误：' + e.message); process.exit(1); } }

  fs.mkdirSync(DEPLOY, { recursive: true });
  fs.writeFileSync(path.join(DEPLOY, 'index.html'), out);

  /* sw.js 缓存版本随内容自动递增，避免线上用户命中旧缓存 */
  const swPath = path.join(DEPLOY, 'sw.js');
  let sw = fs.readFileSync(swPath, 'utf8');
  sw = sw.replace(/const CACHE = 'xuanji-v(\d+)';/, (_, v) => "const CACHE = 'xuanji-v" + (+v + 1) + "';");
  fs.writeFileSync(swPath, sw);

  console.log('✓ 构建完成：源 ' + (html.length / 1024).toFixed(0) + 'KB → deploy ' + (out.length / 1024).toFixed(0) + 'KB（' + n + ' 段脚本已安全压缩）｜ ' + sw.match(/const CACHE = '[^']+'/)[0]);
})();

/* 构建后自动跑命理回归样例（有意变更算法后用 node verify.js --update 更新基线） */
const { execSync } = require('child_process');
try {
  const out = execSync('node verify.js', { cwd: __dirname, encoding: 'utf8' });
  console.log(out.trim().split('\n').map(l => '  ' + l).join('\n'));
} catch (e) {
  console.error(e.stdout && e.stdout.trim());
  console.error('✗ 命理回归未通过，构建产物已生成但请先核对算法变更（node verify.js）');
  process.exit(1);
}
