/* 生成动效预览页：抽取成品的真实 CSS 与真实生成的 SVG，做成可反复重播的演示 */
const fs = require('fs');
const { JSDOM } = require('C:/Users/42134/.workbuddy/binaries/node/workspace/node_modules/jsdom');

const html = fs.readFileSync('fortune.html', 'utf8');
const css = html.slice(html.indexOf('<style>') + 7, html.indexOf('</style>'));

// 直接抽取成品里的真实揭幕叙事源码（SAGA_PIDS / blotPath / sagaSvg / inkBloom），
// 演示页复用同一份实现，杜绝「演示与实际不一致」。
const appSrc = fs.readFileSync('app.js', 'utf8');
const sagaFrom = appSrc.indexOf('const SAGA_PIDS=');
const sagaTo = appSrc.indexOf('function wrapCompute(){');
if (sagaFrom < 0 || sagaTo < 0 || sagaTo <= sagaFrom) {
  console.error('✗ 未能从 app.js 抽取揭幕叙事源码，请检查锚点');
  process.exit(1);
}
const sagaSrc = appSrc.slice(sagaFrom, sagaTo);

// 跑一次真实八字，取真实图表与判词
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'file:///C:/f.html' });

setTimeout(() => {
  const doc = dom.window.document;
  const set = (id, v) => { const e = doc.getElementById(id); if (e) e.value = v; };
  set('by', '1994'); set('bm', '7'); set('bd', '15'); set('bh', '9');
  const b = doc.getElementById('baziBtn');
  if (b) b.dispatchEvent(new dom.window.Event('click'));

  setTimeout(() => {
    const res = doc.querySelector('#baziResult .result');
    const svgs = res ? [...res.querySelectorAll('svg')] : [];
    // 取一张有辨识度的图（雷达/时间轴），去掉已注入的动画类，交给演示页重新触发
    const pick = svgs.filter(s => !s.getAttribute('data-nofx')).slice(0, 2);
    const chartHTML = pick.map(s => {
      const c = s.cloneNode(true);
      c.querySelectorAll('.fx-draw,.fx-pop').forEach(e => {
        e.classList.remove('fx-draw', 'fx-pop');
        e.style.removeProperty('--d'); e.style.removeProperty('--dur');
      });
      return c.outerHTML;
    }).join('');

    const star = res ? res.querySelector('.starchart') : null;
    const seal = star ? (star.querySelector('.sc-seal') || {}).textContent || '财随缘至' : '财随缘至';
    const vp = star ? star.querySelectorAll('.sc-verdict p') : [];
    const v1 = vp[0] ? vp[0].textContent : '癸水稀微，易被日晞——你太容易被消耗。';
    const v2 = vp[1] ? vp[1].textContent : '财星围身，机会永远比时间多。';

    const out = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>动效精修 · 效果预览</title>
<style>${css}
  .demo-h{font-family:var(--serif);font-size:15px;color:var(--gold-soft);letter-spacing:2px;margin:0 0 4px}
  .demo-d{font-size:12.5px;color:var(--muted);margin-bottom:12px;line-height:1.8}
  .stage{position:relative;min-height:150px;border:1px dashed var(--line);border-radius:12px;padding:16px;background:var(--r-subbg)}
  .bar{position:sticky;top:0;z-index:80;display:flex;gap:10px;align-items:center;flex-wrap:wrap;
    padding:12px 14px;margin-bottom:16px;border-radius:14px;
    background:var(--glass-strong);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);
    border:1px solid var(--line);box-shadow:var(--glass-shadow)}
  .bar b{font-family:var(--serif);letter-spacing:3px;color:var(--ink);font-size:15px;margin-right:auto}
</style></head>
<body class="theme-light">
<svg class="bg-taiji" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M50 2a24 24 0 0 0 0 48 24 24 0 0 1 0 48A48 48 0 0 0 50 2z" fill="currentColor"/><circle cx="50" cy="26" r="6" fill="#f7f2ea"/><circle cx="50" cy="74" r="6" fill="currentColor"/></svg>
<div class="app">
  <div class="bar">
    <b>动效精修 · 效果预览</b>
    <button class="btn mini" id="replay">↻ 重播全部</button>
    <button class="btn mini" id="thm">切换深浅</button>
  </div>

  <div class="card">
    <div class="demo-h">① 墨滴落纸 · 洇开成星图（连续叙事）</div>
    <div class="demo-d">五幕一镜到底：<b>悬滴</b>凝而未落 → <b>落纸</b>冲击环与六点溅墨 → <b>洇开</b>三层不规则墨渍（宣纸吃墨的毛边）→ <b>成象</b>支环展开、八星逐颗从墨中浮出、连线自绘 → <b>交接</b>墨渍上浮散去，正文星图同刻显影。<br>
      坐标系与正文星图完全一致（560×470 / 中心 280,232 / 星轨 r=126），所以末帧与真实星图<b>形态重合</b>——像同一张图落进了页面。<br>
      <b>本轮提速：1.88 秒 → 0.98 秒</b>（同面板重复测算跳过悬滴段，再缩到 0.72 秒）。原节奏下内容被遮挡近两秒，等待感压过了叙事感。</div>
    <div class="panel show stage" id="s1" style="min-height:300px"><div style="text-align:center;color:var(--muted);padding:34px 0">此处为结果区域</div></div>
  </div>

  <div class="card">
    <div class="demo-h">② 逐笔错落自绘 · 核心质感提升</div>
    <div class="demo-d">按顺序逐笔延迟，长轮廓运笔久、短弧收笔快，多张图之间再依次错开。<br>
      <b>本轮提速：单图铺开 700ms → 380ms、单笔 1.05s → 0.6s</b>，三张图从 1.7 秒画完压到 0.81 秒。</div>
    <div class="stage" id="s2" style="text-align:center">${chartHTML || '<p style="color:var(--muted)">图表提取失败</p>'}</div>
  </div>

  <div class="card">
    <div class="demo-h">③ 逐字题写 · 如落笔题款</div>
    <div class="demo-d">印签先落，判词后题，每字带位移、缩放与去模糊。</div>
    <div class="stage" id="s3">
      <div class="starchart" style="border:none;background:none;padding:6px 0">
        <div class="sc-seal">${seal}</div>
        <div class="sc-verdict"><p>${v1}</p><p>${v2}</p></div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="demo-h">④ 墨滴涟漪 · 点击微交互</div>
    <div class="demo-d">从 Material 风灰白圆改为墨色径向扩散，深色主题自动转奶油色。点下面的按钮试试。</div>
    <div class="stage" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;min-height:auto">
      <button class="btn">点我看墨晕</button><button class="btn mini">小按钮</button>
      <span class="tab" style="padding:8px 14px;cursor:pointer">标签也有</span>
    </div>
  </div>

  <div class="card">
    <div class="demo-h">⑤ 卡片光泽跟随 + 3D 倾斜</div>
    <div class="demo-d">鼠标在<b>任意卡片</b>上移动即可感受：柔光跟随光标、卡片轻微透视倾斜（rAF 节流）。<br>
      注：原先 <code>.card</code> 的入场动画用了 <code>fill-mode: both</code>，其 transform 在动画结束后仍占用，
      优先级高于 inline style —— 导致 3D 倾斜从未真正生效。本轮已改为 <code>backwards</code> 修复。</div>
    <div class="stage" style="min-height:auto;color:var(--muted);font-size:13px">把鼠标移到这张卡片上，注意高光与倾斜。</div>
  </div>

  <div class="card">
    <div class="demo-h">⑥ 背景视差</div>
    <div class="demo-d">向下滚动页面，右上角太极与背景墨点会以更慢的速度移动，形成景深。</div>
    <div class="stage" style="min-height:auto;color:var(--muted);font-size:13px">滚动本页即可观察。</div>
  </div>
</div>

<script>
(function(){
  var MM = (typeof window.matchMedia === 'function') ? function(q){ return window.matchMedia(q).matches; } : function(){ return false; };
  var RED = MM('(prefers-reduced-motion: reduce)');

  /* ↓↓↓ 以下为从 app.js 原样抽取的真实叙事实现，演示与成品共用同一份代码 ↓↓↓ */
${sagaSrc}
  /* ↑↑↑ 抽取结束 ↑↑↑ */

  function bloom(panel){
    // 演示页每次重播都当作首次（否则第二次起会走「负时间偏移」的精简版）
    delete panel.dataset.saga;
    var el=inkBloom(panel,'bazi');           // bazi 属 SAGA_PIDS，演到「成象」全本
    if(!el) return;
    var dur=parseInt(el.dataset.dur,10)||2000;
    setTimeout(function(){
      el.style.transition='opacity .45s cubic-bezier(.16,1,.3,1), transform .45s cubic-bezier(.16,1,.3,1)';
      el.style.opacity='0'; el.style.transform='scale(1.04)';
      setTimeout(function(){ if(el.parentNode) el.remove(); },460);
    },dur);
  }

  function drawCharts(scope){
    var si=0;
    scope.querySelectorAll('svg').forEach(function(svg){
      var els=svg.querySelectorAll('polygon,polyline,path,line,circle,rect,ellipse');
      // 与 app.js enhanceCharts 保持同一组参数（改一处务必同步另一处）
      var n=els.length||1, step=Math.min(22,380/n), base=si*90; si++;
      els.forEach(function(el,i){
        try{ el.setAttribute('pathLength','1'); }catch(e){}
        el.classList.remove('fx-draw','fx-pop');
        void el.getBoundingClientRect();
        el.style.setProperty('--d',((base+i*step)/1000).toFixed(3)+'s');
        var tag=(el.tagName||'').toLowerCase();
        el.style.setProperty('--dur',(tag==='polygon'||tag==='path'||tag==='polyline')?'0.6s':(tag==='circle'||tag==='ellipse')?'0.42s':'0.5s');
        el.classList.add('fx-draw');
        var f=el.getAttribute('fill');
        if(f&&f!=='none'&&f!=='transparent') el.classList.add('fx-pop');
      });
    });
  }

  function typeset(scope){
    scope.querySelectorAll('.sc-seal, .sc-verdict p:first-child').forEach(function(el,gi){
      var t=el.dataset.raw || el.textContent || '';
      el.dataset.raw=t; el.classList.add('tw'); el.textContent='';
      var base=0.22+gi*0.45;
      Array.prototype.forEach.call(t,function(ch,i){
        var s=document.createElement('i'); s.textContent=ch;
        s.style.setProperty('--d',(base+i*0.055).toFixed(3)+'s');
        el.appendChild(s);
      });
    });
  }

  function replay(){
    if(RED) return;
    bloom(document.getElementById('s1'));
    drawCharts(document.getElementById('s2'));
    typeset(document.getElementById('s3'));
  }
  document.getElementById('replay').onclick=replay;

  // 墨滴涟漪
  document.querySelectorAll('.btn,.tab').forEach(function(b){
    b.addEventListener('click',function(e){
      var r=b.getBoundingClientRect(); if(!r.width) return;
      var size=Math.max(r.width,r.height);
      var rip=document.createElement('span'); rip.className='ripple';
      rip.style.width=rip.style.height=size+'px';
      rip.style.left=(e.clientX-r.left-size/2)+'px';
      rip.style.top=(e.clientY-r.top-size/2)+'px';
      if(getComputedStyle(b).position==='static') b.style.position='relative';
      b.style.overflow='hidden';
      b.appendChild(rip); setTimeout(function(){rip.remove();},700);
    });
  });

  // 光泽跟随 + 倾斜
  if(MM('(hover:hover) and (pointer:fine)')){
    document.querySelectorAll('.card').forEach(function(c){
      var raf=0,mx=50,my=50,rx=0,ry=0;
      function apply(){ raf=0;
        c.style.setProperty('--mx',mx.toFixed(1)+'%'); c.style.setProperty('--my',my.toFixed(1)+'%');
        c.style.transform='perspective(1100px) rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg) translateY(-2px)';
      }
      c.addEventListener('mousemove',function(e){
        var r=c.getBoundingClientRect(); if(!r.width) return;
        var px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
        mx=px*100; my=py*100; rx=-(py-.5)*3.4; ry=(px-.5)*4.4;
        if(!raf) raf=requestAnimationFrame(apply);
      });
      c.addEventListener('mouseleave',function(){ if(raf){cancelAnimationFrame(raf);raf=0;} c.style.transform=''; });
    });
  }

  // 视差
  var praf=0;
  function upd(){ praf=0; document.documentElement.style.setProperty('--sy',String(Math.round(window.scrollY||0))); }
  window.addEventListener('scroll',function(){ if(!praf) praf=requestAnimationFrame(upd); },{passive:true});
  upd();

  // 主题
  document.getElementById('thm').onclick=function(){
    document.body.classList.toggle('theme-dark');
    document.body.classList.toggle('theme-light');
  };

  setTimeout(replay,320);
})();
</script>
</body></html>`;

    fs.writeFileSync('preview_motion.html', out, 'utf8');
    console.log('✓ preview_motion.html 已生成 ' + Math.round(out.length / 1024) + ' KB');
    console.log('  提取图表数: ' + pick.length + ' | 印签: ' + seal.trim() + ' | 判词: ' + v1.slice(0, 24));
    process.exit(0);
  }, 900);
}, 1500);
