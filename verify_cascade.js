/* CSS 层叠陷阱检查器
   jsdom 的 CSS 引擎不解析 animation/transition 等简写属性，getComputedStyle 测不出
   「简写重置 longhand」这类问题。此脚本做静态特异性分析，专查一类高频真 bug：

     某规则用 animation 简写（隐含 animation-delay:0s），
     另一规则单独设 animation-delay，
     但后者特异性更低 → delay 被静默重置，错落/序列动画全部失效且无任何报错。

   用法：node verify_cascade.js
*/
const fs = require('fs');

const html = fs.readFileSync('fortune.html', 'utf8');
const css = html.slice(html.indexOf('<style>') + 7, html.indexOf('</style>'));

/* 计算选择器特异性 (id, class, element)。够用即可：不处理 :is()/:where() 嵌套权重。 */
function specificity(sel) {
  let s = sel.trim();
  // :not(...) / :nth-child(...) 的括号内容单独计权，先摘出来
  const inner = [];
  s = s.replace(/:not\(([^)]*)\)/g, (_, g) => { inner.push(g); return ' '; });
  const a = (s.match(/#[\w-]+/g) || []).length;
  let b = (s.match(/\.[\w-]+/g) || []).length
        + (s.match(/\[[^\]]+\]/g) || []).length
        + (s.match(/:(?!:)(?:hover|focus|active|first-child|last-child|nth-child|nth-of-type|not|checked|disabled)[\w-]*/g) || []).length;
  const c = (s.match(/(?:^|[\s>+~])([a-zA-Z][\w-]*)/g) || []).length;
  // :not() 内部按最高权重计入
  inner.forEach(g => {
    const sp = specificity(g);
    b += sp[1]; // 简化：内部 class 计入 b
  });
  return [a, b, c];
}
const cmp = (x, y) => (x[0] - y[0]) || (x[1] - y[1]) || (x[2] - y[2]);

/* 解析顶层规则（跳过 @media 等 at-rule 内部的嵌套，按出现顺序编号） */
const rules = [];
const re = /([^{}]+)\{([^{}]*)\}/g;
let m, idx = 0;
while ((m = re.exec(css))) {
  const sels = m[1].trim();
  if (sels.startsWith('@') || sels.includes('%')) continue; // 跳过 at-rule 与 keyframe 帧
  const body = m[2];
  sels.split(',').forEach(sel => {
    sel = sel.trim();
    if (!sel) return;
    rules.push({ sel, body, order: idx++, spec: specificity(sel) });
  });
}

/* 找出所有「单独设 animation-delay」的规则，检查是否被简写压制 */
const delayRules = rules.filter(r => /(?:^|[;\s])animation-delay\s*:/.test(r.body));
const shorthandRules = rules.filter(r =>
  /(?:^|[;\s])animation\s*:/.test(r.body) && !/animation-delay/.test(r.body));

console.log('===== CSS 层叠陷阱检查 =====');
console.log('规则总数:', rules.length, '| 设 animation-delay 的规则:', delayRules.length,
            '| 用 animation 简写的规则:', shorthandRules.length);

/* 判断两个选择器是否可能匹配同一元素：保守做法——比较「基础部分」是否有包含关系 */
function mayOverlap(a, b) {
  const norm = s => s.replace(/:not\([^)]*\)/g, '').replace(/:nth-child\([^)]*\)/g, '').trim();
  const na = norm(a), nb = norm(b);
  return na === nb || na.startsWith(nb) || nb.startsWith(na);
}

let problems = 0;
delayRules.forEach(dr => {
  shorthandRules.forEach(sr => {
    if (!mayOverlap(dr.sel, sr.sel)) return;
    // 简写规则若特异性更高，或特异性相同但出现更晚 → delay 被重置
    const c = cmp(sr.spec, dr.spec);
    const wins = c > 0 || (c === 0 && sr.order > dr.order);
    if (wins) {
      problems++;
      console.log('\n  ⚠️  delay 被简写重置');
      console.log('     设 delay : ' + dr.sel + '   特异性(' + dr.spec.join(',') + ') 序' + dr.order);
      console.log('     被压制于 : ' + sr.sel + '   特异性(' + sr.spec.join(',') + ') 序' + sr.order);
      console.log('     后果     : animation-delay 归零，序列/错落动画静默失效');
    }
  });
});

console.log('\n===== 结论 =====');
if (problems === 0) {
  console.log('未发现 animation-delay 被简写压制的情况 ✅');
} else {
  console.log('发现 ' + problems + ' 处问题 ❌  修法：给设 delay 的选择器补足特异性（如加上同样的 :not()）');
}
process.exit(problems === 0 ? 0 : 1);
