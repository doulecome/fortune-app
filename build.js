/* 玄机阁构建：根目录 index.html 是唯一源，build 后生成 deploy/index.html。
   用法：node build.js   （构建后建议 node verify.js 做冒烟校验） */
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

/* 关键交互标记检查：弹窗重绑与 K 线展开必须同时在源里 */
for (const mark of ['window.bindKline=bindKline', 'klExpandBtn', "bindKline(document.getElementById('baziResult'))"]) {
  if (!html.includes(mark)) { console.error('✗ 缺少关键标记：' + mark); process.exit(1); }
}

fs.mkdirSync(DEPLOY, { recursive: true });
fs.writeFileSync(path.join(DEPLOY, 'index.html'), html);

/* sw.js 缓存版本随内容自动递增，避免线上用户命中旧缓存 */
const swPath = path.join(DEPLOY, 'sw.js');
let sw = fs.readFileSync(swPath, 'utf8');
sw = sw.replace(/const CACHE = 'xuanji-v(\d+)';/, (_, v) => "const CACHE = 'xuanji-v" + (+v + 1) + "';");
fs.writeFileSync(swPath, sw);

console.log('✓ 构建完成：内联脚本 ' + n + ' 段全部解析通过 ｜ deploy/index.html ' + (html.length / 1024).toFixed(0) + 'KB ｜ ' + sw.match(/const CACHE = '[^']+'/)[0]);
