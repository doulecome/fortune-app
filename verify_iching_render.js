// 抓取周易占卦面板，验证彖/大象/文言渲染
const { chromium } = require('C:/Users/42134/WorkBuddy/2026-08-05-00-54-43/wechat-miniprogram/node_modules/playwright/index.js') ;
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 900, height: 1600 } });
  const page = await ctx.newPage();
  page.on('console', msg => console.log('[console]', msg.text()));
  page.on('pageerror', err => console.log('[pageerror]', err.message));
  await page.goto('http://127.0.0.1:8181/index.html', { waitUntil: 'networkidle' });
  // 打开周易占卦
  await page.evaluate(() => {
    const all = document.querySelectorAll('button, .module-card, [data-mod]');
    for (const el of all) {
      if (el.textContent && el.textContent.includes('周易')) { el.click(); return; }
    }
  });
  await page.waitForTimeout(400);
  // 调一次金钱起卦
  const btn = await page.$('button:has-text("起卦"), button:has-text("摇一摇"), button:has-text("占")');
  if (btn) await btn.click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'shot_iching.png', fullPage: true });
  // 检查元素
  const ok = await page.evaluate(() => {
    const r = document.getElementById('ichingResult');
    if (!r) return { hit: false };
    const txt = r.innerText;
    return {
      hit: true,
      hasTuan: txt.includes('彖传'),
      hasDaxiang: txt.includes('大象传'),
      hasWenyan: txt.includes('文言传'),
      len: txt.length,
      sample: txt.slice(0, 400)
    };
  });
  console.log('ICHING:', JSON.stringify(ok, null, 2));
  // 再看梅花
  await page.evaluate(() => {
    const all = document.querySelectorAll('button, .module-card, [data-mod]');
    for (const el of all) {
      if (el.textContent && el.textContent.includes('梅花')) { el.click(); return; }
    }
  });
  await page.waitForTimeout(400);
  const mhBtn = await page.$('button:has-text("起卦"), button:has-text("占")');
  if (mhBtn) await mhBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'shot_meihua.png', fullPage: true });
  const mh = await page.evaluate(() => {
    const r = document.getElementById('meihuaResult');
    if (!r) return { hit: false };
    return { hit: true, hasDaxiang: r.innerText.includes('大象传'), hasTuan: r.innerText.includes('彖传'), len: r.innerText.length };
  });
  console.log('MEIHUA:', JSON.stringify(mh, null, 2));
  // 六爻
  await page.evaluate(() => {
    const all = document.querySelectorAll('button, .module-card, [data-mod]');
    for (const el of all) {
      if (el.textContent && el.textContent.includes('六爻')) { el.click(); return; }
    }
  });
  await page.waitForTimeout(400);
  const lyBtn = await page.$('button:has-text("起卦"), button:has-text("占"), button:has-text("摇")');
  if (lyBtn) await lyBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'shot_liuyao.png', fullPage: true });
  const ly = await page.evaluate(() => {
    // 六爻渲染区定位
    const r = document.body;
    return { hasTuan: r.innerText.includes('彖传'), hasDaxiang: r.innerText.includes('大象传') };
  });
  console.log('LIUYAO:', JSON.stringify(ly, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
