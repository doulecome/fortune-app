const fs = require('fs');
const DIR = 'C:/Users/42134/WorkBuddy/2026-08-05-00-54-43/';
const ui = fs.readFileSync(DIR + 'ui.html', 'utf8');
const app = fs.readFileSync(DIR + 'app.js', 'utf8');
const fort = fs.readFileSync(DIR + 'fortune.html', 'utf8');

// 从旧 fortune.html 抽取已内联的库 <script>（排除 app 段）
const scripts = [...fort.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const libs = scripts.filter(s => !s.includes('真实历法接口') && !s.includes('const GAN_WU'));
if (libs.length !== 2) console.warn('⚠️ 库段数量为', libs.length, '（期望 2：lunar + cnchar）');
const libHtml = libs.map(s => '<script>' + s + '</script>').join('\n');

const out = ui.replace('<!--LIBS-->', libHtml)
              .replace('<!--APP-->', '<script>\n' + app + '\n</script>');

fs.writeFileSync(DIR + 'fortune.html', out);
fs.writeFileSync(DIR + 'index.html', out);
console.log('✓ 构建完成：库段', libs.length, '｜ app 字节', app.length, '｜ fortune.html', (out.length/1024).toFixed(0), 'KB ｜ index.html', (out.length/1024).toFixed(0), 'KB');
