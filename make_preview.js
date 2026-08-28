const fs=require('fs'),path=require('path');
const DIR=__dirname;
const full=fs.readFileSync(path.join(DIR,'fortune.html'),'utf8');
const ex=JSON.parse(fs.readFileSync(path.join(DIR,'_svg_export.json'),'utf8'));

// 抽出 fortune.html 的完整 <style>（含全部设计令牌与动效），保证预览与成品像素一致
const m=full.match(/<style[^>]*>([\s\S]*?)<\/style>/);
if(!m) throw new Error('style not found');
const css=m[1];

const page=`<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>命格星图 · 效果预览</title>
<style>${css}
  body{padding:26px 16px 60px}
  .pv-wrap{max-width:640px;margin:0 auto}
  .pv-h{font-family:var(--serif);font-size:19px;color:var(--ink);text-align:center;letter-spacing:3px;margin-bottom:4px}
  .pv-sub{text-align:center;color:var(--muted);font-size:12.5px;margin-bottom:22px;line-height:1.9}
  .pv-sec{font-family:var(--serif);font-size:14px;color:var(--gold-soft);letter-spacing:2px;margin:30px 0 6px;text-align:center}
  .pv-tip{text-align:center;color:var(--muted);font-size:12px;margin-top:26px;line-height:2}
  .pv-btn{display:block;width:max-content;margin:14px auto 0;padding:9px 22px;border:1px solid var(--line);border-radius:999px;background:var(--glass-strong);color:var(--ink);font-size:13px;cursor:pointer;font-family:inherit}
</style></head>
<body>
<div class="pv-wrap">
  <div class="pv-h">命 格 星 图</div>
  <div class="pv-sub">以下为真实推算生成的效果快照（示例命盘）<br>成品中会按你录入的生辰实时生成</div>

  <div class="pv-sec">— 八字 · 命格星图 —</div>
  <div class="starchart">
    <div class="sc-seal">${ex.baziSeal}</div>
    <div class="sc-verdict">${ex.baziVerdict}</div>
    ${ex.baziSvg}
    <div class="sc-legend"><span><i></i>同气 · 生我（比劫/印）</span><span><i class="l2"></i>我生 · 我克（食伤/财）</span><span><i class="l3"></i>克我（官杀）</span></div>
  </div>

  <div class="pv-sec">— 紫微 · 十二宫星盘 —</div>
  <div class="starchart">
    <div class="sc-seal">${ex.zwSeal}</div>
    ${ex.zwSvg}
    <div class="sc-legend"><span><i></i>三方四正（命 · 财 · 官）</span><span><i class="l3"></i>对宫冲照（迁移）</span><span>金底＝命宫 · 朱框＝流年</span></div>
  </div>

  <button class="pv-btn" id="thm">切换深色 / 浅色</button>
  <div class="pv-tip">这是静态效果预览页。<br>完整版请打开 fortune.html，录入生辰后实时生成属于你的星图。</div>
</div>
<script>
document.getElementById('thm').onclick=function(){document.body.classList.toggle('theme-dark');};
</script>
</body></html>`;

fs.writeFileSync(path.join(DIR,'preview_starchart.html'),page,'utf8');
console.log('✓ preview_starchart.html 生成：', (Buffer.byteLength(page)/1024).toFixed(1)+' KB');
