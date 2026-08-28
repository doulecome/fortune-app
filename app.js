/* ===================== 真实历法接口 ===================== */
/* Solar / Lunar 来自 lunar-javascript（内联全局）；cnchar 提供笔画 */

function hintResult(id,msg){ const el=document.getElementById(id); if(el) el.innerHTML='<div class="result">※ '+msg+'</div>'; }
window.addEventListener('error',e=>{ const b=document.getElementById('errbar'); if(b){ b.style.display='block'; b.textContent='※ 页面脚本出错：'+(e.message||(e.error&&e.error.message)||'未知错误')+'（如不影响使用可忽略，可截图此文字反馈）'; } });

const GAN_WU = {甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const GAN_YIN = {甲:1,乙:0,丙:1,丁:0,戊:1,己:0,庚:1,辛:0,壬:1,癸:0};
const ZODIAC_ZHI = {鼠:'子',牛:'丑',虎:'寅',兔:'卯',龙:'辰',蛇:'巳',马:'午',羊:'未',猴:'申',鸡:'酉',狗:'戌',猪:'亥'};
const SHENG = {木:'火',火:'土',土:'金',金:'水',水:'木'};
const KE = {木:'土',土:'水',水:'火',火:'金',金:'木'};
/* 地支序（0-11），供紫微/奇门共用 */
const ZHI=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const ZHI_IDX={子:0,丑:1,寅:2,卯:3,辰:4,巳:5,午:6,未:7,申:8,酉:9,戌:10,亥:11};
/* 地支本气 + 藏干（本气·中气·余气，按地支藏干歌；供八字旺衰与十神论用，全局共用） */
const DZ_BENQI={'子':'癸','丑':'己','寅':'甲','卯':'乙','辰':'戊','巳':'丙','午':'丁','未':'己','申':'庚','酉':'辛','戌':'戊','亥':'壬'};
const CANG_GAN={'子':['癸'],'丑':['己','癸','辛'],'寅':['甲','丙','戊'],'卯':['乙'],'辰':['戊','乙','癸'],'巳':['丙','庚','戊'],'午':['丁','己'],'未':['己','丁','乙'],'申':['庚','壬','戊'],'酉':['辛'],'戌':['戊','辛','丁'],'亥':['壬','甲']};
const GAN_IDX={甲:0,乙:1,丙:2,丁:3,戊:4,己:5,庚:6,辛:7,壬:8,癸:9};
const JIA60=(function(){const a=[];for(let i=0;i<60;i++){a.push(GAN[i%10]+ZHI[i%12]);}return a;})();
function gz60(s){return JIA60.indexOf(s);}
/* 确定性字符串哈希：同输入恒同输出，用于按出生数据选词（同人不重样、异人不同句） */
function _hashStr(s){ let n=0; for(let i=0;i<s.length;i++) n=(n*131+s.charCodeAt(i))>>>0; return n; }
/* 60甲子纳音五行（专业紫微·五行局用） */
const NA_YIN_WU=(function(){const t=[['甲子','乙丑','金'],['丙寅','丁卯','火'],['戊辰','己巳','木'],['庚午','辛未','土'],['壬申','癸酉','金'],['甲戌','乙亥','火'],['丙子','丁丑','水'],['戊寅','己卯','土'],['庚辰','辛巳','金'],['壬午','癸未','木'],['甲申','乙酉','水'],['丙戌','丁亥','土'],['戊子','己丑','火'],['庚寅','辛卯','木'],['壬辰','癸巳','金'],['甲午','乙未','金'],['丙申','丁酉','火'],['戊戌','己亥','木'],['庚子','辛丑','土'],['壬寅','癸卯','金'],['甲辰','乙巳','火'],['丙午','丁未','水'],['戊申','己酉','土'],['庚戌','辛亥','金'],['壬子','癸丑','木'],['甲寅','乙卯','水'],['丙辰','丁巳','土'],['戊午','己未','火'],['庚申','辛酉','木'],['壬戌','癸亥','水']];const m={};t.forEach(([a,b,w])=>{m[a]=w;m[b]=w;});return m;})();
const JU_BY_WU={'水':2,'木':3,'金':4,'土':5,'火':6};
const WUHU={'甲':'丙','乙':'戊','丙':'庚','丁':'壬','戊':'甲','己':'丙','庚':'戊','辛':'庚','壬':'甲','癸':'壬'};
const SIHUA={'甲':['廉贞','破军','武曲','太阳'],'乙':['天机','天梁','紫微','太阴'],'丙':['天同','天机','文昌','廉贞'],'丁':['太阴','天同','天机','巨门'],'戊':['贪狼','太阴','右弼','天机'],'己':['武曲','贪狼','天梁','文曲'],'庚':['太阳','武曲','太阴','天同'],'辛':['巨门','太阳','文曲','文昌'],'壬':['天梁','紫微','左辅','武曲'],'癸':['破军','巨门','太阴','贪狼']};
const LUCUN={'甲':'寅','乙':'卯','丙':'巳','丁':'午','戊':'巳','己':'午','庚':'申','辛':'酉','壬':'亥','癸':'子'};

/* 十神：以日主(日干)为基准，推算流年天干与日主的关系 */
function shiShen(dg, tg){
  const wd = GAN_WU[dg], wt = GAN_WU[tg];
  const sameYin = GAN_YIN[dg] === GAN_YIN[tg];
  if(wd === wt) return sameYin ? '比肩' : '劫财';
  if(SHENG[wd] === wt) return sameYin ? '食神' : '伤官';
  if(KE[wd] === wt) return sameYin ? '偏财' : '正财';
  if(KE[wt] === wd) return sameYin ? '七杀' : '正官';
  if(SHENG[wt] === wd) return sameYin ? '偏印' : '正印';
  return '—';
}

/* 生肖与当年太岁地支的关系（值/冲/合/刑/害/三合） */
const DZ_CHONG = {'子':'午','午':'子','丑':'未','未':'丑','寅':'申','申':'寅','卯':'酉','酉':'卯','辰':'戌','戌':'辰','巳':'亥','亥':'巳'};
const DZ_HE = {'子':'丑','丑':'子','寅':'亥','亥':'寅','卯':'戌','戌':'卯','辰':'酉','酉':'辰','巳':'申','申':'巳','午':'未','未':'午'};
const DZ_SANHE = {'申':['子','辰'],'子':['申','辰'],'辰':['申','子'],'亥':['卯','未'],'卯':['亥','未'],'未':['亥','卯'],'寅':['午','戌'],'午':['寅','戌'],'戌':['寅','午'],'巳':['酉','丑'],'酉':['巳','丑'],'丑':['巳','酉']};
const DZ_HAI = {'子':'未','未':'子','丑':'午','午':'丑','寅':'巳','巳':'寅','卯':'辰','辰':'卯','申':'亥','亥':'申','酉':'戌','戌':'酉'};
const DZ_XING = {'子':'卯','卯':'子','寅':'巳','巳':'申','申':'寅','丑':'戌','戌':'未','未':'丑','辰':'辰','午':'午','酉':'酉','亥':'亥'};
function taiSuiRel(z, s){
  if(z === s) return '值太岁（本命年）——宜谨慎守成、静以待变，忌冒进大兴土木。';
  if(DZ_CHONG[z] === s) return '冲太岁——多动荡变故，宜稳守、防冲突与远行风险。';
  if(DZ_HE[z] === s) return '与太岁六合——贵人暗助，合作谋事多顺遂。';
  if(DZ_SANHE[z] && DZ_SANHE[z].includes(s)) return '与太岁三合——人缘事业得助，宜广结善缘。';
  if(DZ_HAI[z] === s) return '与太岁相害——防小人暗算与口舌是非。';
  if(DZ_XING[z] === s) return '与太岁相刑——防官非口舌、是非缠身。';
  return '与太岁无冲无合——平顺之年，按部就班即可。';
}

/* ---------- 标签切换（分类分组导航 + 位置记忆） ---------- */
const TABS=[...document.querySelectorAll('.tab')];
const CATS=[...document.querySelectorAll('.cat')];
const NAV_KEY='xuanji_nav_v1';
function navSave(cat,p,sub){ try{ localStorage.setItem(NAV_KEY,JSON.stringify({cat,p,sub:(sub!==undefined?sub:_curSub)})); }catch(e){} }
function navLoad(){ try{ return JSON.parse(localStorage.getItem(NAV_KEY)||'null'); }catch(e){ return null; } }
/* 切换墨流：新面板入场时从中心散开一道淡金墨晕（尊重 prefers-reduced-motion） */
function inkSwirl(p){
  if(!p) return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const s=document.createElement('span'); s.className='ink-swirl';
  p.appendChild(s); setTimeout(()=>{ if(s.parentNode) s.parentNode.removeChild(s); },760);
}
/* 面板交叉淡出（cross-fade）：运行时把各 .card.panel 收进恒定高度的 .stage 容器（不改 HTML 结构）；
   切换时 stage 高度恒定不动，新面板 absolute 原位覆盖、与旧面板纯 opacity 交叉淡出；reduced-motion 或首屏直接换入。 */
(function(){
  const app=document.querySelector('.app'); if(!app) return;
  const panels=[...app.querySelectorAll('.card.panel')]; if(!panels.length) return;
  const stage=document.createElement('div'); stage.className='stage';
  app.insertBefore(stage, panels[0]);
  panels.forEach(p=>stage.appendChild(p));
})();
let _switching=false;
function switchPanel(p){
  if(!p||_switching) return;
  const stage=document.querySelector('.stage');
  const cur=stage?stage.querySelector('.panel.show'):document.querySelector('.panel.show');
  if(cur===p) return;
  /* 五行穿衣：切到该面板即自动出今日结果（贴合当下时辰，无需手动点按钮） */
  if(p.id==='dress'){ const b=document.getElementById('dressBtn'); if(b&&b.onclick){ try{ b.onclick(); }catch(e){} } }
  /* 移动端（≤768px）切到自然文档流滚动：不启用恒定高度 stage 的 absolute 交叉淡出，
     否则会残留固定 86vh 容器的嵌套滚动、且长面板被裁切。直接线性切换（与 reduced-motion 同路径）。 */
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const flat=(window.innerWidth||document.documentElement.clientWidth)<=768;
  if(reduce||flat||!cur){ if(cur) cur.classList.remove('show'); p.classList.add('show'); inkSwirl(p); return; }
  _switching=true;
  /* 恒定高度 stage（固定高 + 内部滚动）：新面板 absolute 原位覆盖、与旧面板纯 opacity 交叉淡出；
     因 stage 高度恒定不变，底部 footer 与页面布局纹丝不动 → 彻底无高度伸缩、无跳变、无重排。
     离场时把当前面板图表“烘焙”为静态终态（加 .static-charts）：后续再切回时 92 笔描边等动画
     不再重播，只做轻量 opacity 淡入，消除切换抢帧卡顿。 */
  if(cur && !cur.dataset.chartsStatic){ cur.classList.add('static-charts'); cur.dataset.chartsStatic='1'; }
  cur.style.transition='opacity .26s ease'; cur.style.opacity='0'; cur.style.pointerEvents='none';
  p.style.position='absolute'; p.style.top='0'; p.style.left='0'; p.style.right='0'; p.style.bottom='0';
  p.style.zIndex='3'; p.style.opacity='0'; p.classList.add('show','xfade');
  /* 双 rAF 启动 opacity 过渡：避免对重内容面板（星图/八字 canvas、SVG）强制同步重排造成的首帧卡顿，
     同时让 opacity:0 先提交一帧再过渡到 1，过渡稳定不跳变 */
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ p.style.transition='opacity .26s ease'; p.style.opacity='1'; }));
  setTimeout(()=>{
    cur.classList.remove('show'); cur.style.transition=''; cur.style.opacity=''; cur.style.pointerEvents='';
    p.style.transition=''; p.style.opacity=''; p.style.position=''; p.style.top='';
    p.style.left=''; p.style.right=''; p.style.bottom=''; p.style.zIndex='';
    _switching=false;
  },300);
}
/* 完整解读独立弹窗：把某结果的全部内容（图表 + 白话解读 + 落款等）克隆出来，
   在独立弹窗中展示，使长文彻底脱离切换动画层，切换面板只剩轻量图表。 */
const TAROT_PANELS=new Set(['tarot','star','runes','lenormand','numerology']); /* 塔罗 / 星座 / 西式占卜 → 星夜穹幕风格；其余命理/占卜 → 宣纸卷轴风格 */
function openReadModal(r){
  const m=document.getElementById('readModal'); if(!m||!r) return;
  const body=m.querySelector('#readBody'); if(!body) return;
  /* 按来源面板决定弹窗风格：塔罗/星座用星夜穹幕，其余用命盘八字·宣纸卷轴 */
  const panel=(r.closest&&r.closest('.panel'))||null;
  const isTarot=!!(panel&&TAROT_PANELS.has(panel.id));
  m.classList.toggle('style-tarot',isTarot);
  m.classList.toggle('style-scroll',!isTarot);
  const _seal=m.querySelector('#readSeal'), _title=m.querySelector('#readTitle'),
        _sub=m.querySelector('#readSub'), _orn=m.querySelector('#readOrn');
  if(isTarot){
    if(_seal)_seal.textContent='✦'; if(_title)_title.textContent='星象解读';
    if(_sub)_sub.textContent='塔罗 · 星座 · 全文'; if(_orn)_orn.textContent='✦ ✦ ✦';
  }else{
    if(_seal)_seal.textContent='玄'; if(_title)_title.textContent='完整解读';
    if(_sub)_sub.textContent='命理详批 · 全文'; if(_orn)_orn.textContent='';
  }
  body.innerHTML='';
  const clone=r.cloneNode(true);
  clone.classList.remove('static-charts','foldable','fold-open','is-source'); clone.removeAttribute('data-folded');
  const tb=clone.querySelector('.fold-toggle'); if(tb){ const t=tb.closest('.result-tools'); if(t) t.remove(); else tb.remove(); }
  body.appendChild(clone);
  m.classList.add('show');
  if(window.holdAmbient) window.holdAmbient();
  if(!m.dataset.bound){
    m.dataset.bound='1';
    const close=()=>{ m.classList.add('closing'); setTimeout(()=>{ m.classList.remove('show','closing'); if(window.releaseAmbient) window.releaseAmbient(); },200); };
    const c=m.querySelector('#readClose'); if(c) c.onclick=close;
    const b=m.querySelector('#readBack'); if(b) b.onclick=close;
    document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&m.classList.contains('show')) close(); });
  }
}
function applyTheme(t){
  const isTarot=(t==='tarot');
  document.body.classList.toggle('theme-dark', isTarot);
  document.body.classList.toggle('theme-tarot', isTarot);
  const sw=document.getElementById('themeSwitch');
  if(sw) sw.querySelectorAll('button').forEach(b=>b.classList.toggle('active', b.dataset.t===t));
}
/* 顶部「中国占卜 / 国外塔罗」为主分类器：选中即切换主题 + 仅显示该类型内容
   （工具类 settings/history 始终可见，便于随时进入；cat 标记含义：cn=中国占卜, tarot=国外塔罗, tool=工具）
   中国占卜内部再按 data-sub（ming 命盘 / zhan 占卜 / yun 运势）二级筛选 */
const SEC_INTRO={cn:'东方玄学 · 命盘八字与诸般占卜，依真实历法推演',tarot:'西方神秘学 · 塔罗牌阵与星象命盘，静心问卜',tool:'实用工具 · 参数设置与历史记录'};
let _curSub='all';
function setSecIntro(type){ const el=document.getElementById('secIntro'); if(!el) return; el.classList.toggle('collapsed', type==='tool'); if(type!=='tool') el.textContent=SEC_INTRO[type]||''; }
function showSubcats(type){ const sc=document.getElementById('subcats'); if(!sc) return; sc.classList.toggle('collapsed', type!=='cn'); if(type==='cn') sc.querySelectorAll('.subcat').forEach(c=>c.classList.toggle('active', c.dataset.sub===_curSub)); }
function filterTabsByType(type, sub){
  if(type==='cn'){ if(sub!==undefined) _curSub=sub; } else { _curSub='all'; }
  TABS.forEach(t=>{
    let show=false;
    if(t.dataset.cat==='tool') show=true;
    else if(t.dataset.cat===type) show=(type!=='cn')||(_curSub==='all')||(t.dataset.sub===_curSub);
    t.style.display=show?'':'none';
    t.classList.remove('active');
  });
  CATS.forEach(c=>c.classList.toggle('active', c.dataset.cat===type));
  showSubcats(type); setSecIntro(type);
  const target=TABS.find(t=>t.dataset.cat===type && t.style.display!=='none');
  if(target){ target.classList.add('active'); switchPanel(document.getElementById(target.dataset.p)); navSave(type, target.dataset.p); try{ target.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'}); }catch(e){} }
  if(typeof updateTabScroll==='function') updateTabScroll();
}
TABS.forEach(t=>{
  t.onclick=()=>{
    TABS.forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    switchPanel(document.getElementById(t.dataset.p));
    navSave(t.dataset.cat,t.dataset.p);
    try{ t.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'}); }catch(e){}
  };
});
/* 右上角「参数设置」独立入口：打开设置面板（不再走标签条） */
(function(){
  const btn=document.getElementById('topSettings');
  if(btn) btn.onclick=()=>{ const p=document.getElementById('settings'); if(p) switchPanel(p); };
})();
/* 中国占卜·子类筛选 chips：点命盘/占卜/运势，仅显示该子类（工具类常驻）；
   再点当前已激活的 chip 则取消筛选、回到「全部」 */
(function(){
  const sc=document.getElementById('subcats');
  if(sc) sc.querySelectorAll('.subcat').forEach(c=>{ c.onclick=()=>{ const sub=(c.dataset.sub===_curSub)?'all':c.dataset.sub; filterTabsByType('cn', sub); }; });
})();
/* 标签条横向滚动箭头（溢出时显示）+ 键盘 ← → 切换可见标签 */
function updateTabScroll(){
  const wrap=document.querySelector('.tabs-wrap'); const tabs=document.getElementById('tabs');
  if(wrap&&tabs) wrap.classList.toggle('can-scroll', tabs.scrollWidth>tabs.clientWidth+4);
}
(function(){
  const wrap=document.querySelector('.tabs-wrap'); const tabs=document.getElementById('tabs');
  if(wrap&&tabs){
    const prev=wrap.querySelector('.tabs-nav.prev'), next=wrap.querySelector('.tabs-nav.next');
    const step=()=>Math.max(180, Math.round(tabs.clientWidth*0.7));
    if(prev) prev.onclick=()=>tabs.scrollBy({left:-step(),behavior:'smooth'});
    if(next) next.onclick=()=>tabs.scrollBy({left:step(),behavior:'smooth'});
    tabs.addEventListener('scroll',updateTabScroll); window.addEventListener('resize',updateTabScroll);
  }
  updateTabScroll();
  document.addEventListener('keydown',e=>{
    if(e.target&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    const rm=document.getElementById('readModal'); if(rm&&rm.classList.contains('show')) return;
    if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight') return;
    const vis=TABS.filter(t=>t.style.display!=='none'); if(!vis.length) return;
    const i=vis.findIndex(t=>t.classList.contains('active')); const cur=(i<0)?0:i;
    const ni=(e.key==='ArrowRight')?(cur+1)%vis.length:(cur-1+vis.length)%vis.length;
    vis[ni].click();
  });
})();
/* 初始化：主题按 xuanji_theme_v2 还原；内容按类型筛选（与顶部切换完全一致） */
(function(){
  const KEY='xuanji_theme_v2';
  let saved='cn'; try{ saved=localStorage.getItem(KEY)||'cn'; }catch(e){}
  if(saved!=='cn'&&saved!=='tarot') saved='cn';
  applyTheme(saved);
  const navSaved=navLoad();
  const initType=(navSaved&&['cn','tarot','tool'].includes(navSaved.cat))?navSaved.cat:saved;
  const initSub=(initType==='cn'&&navSaved&&navSaved.sub)?navSaved.sub:'all';
  filterTabsByType(initType, initSub);
  const sw=document.getElementById('themeSwitch');
  if(sw) sw.querySelectorAll('button').forEach(b=>{ b.onclick=()=>{ const t=b.dataset.t; applyTheme(t); filterTabsByType(t, t==='cn'?'all':undefined); try{ localStorage.setItem(KEY,t); }catch(e){} }; });
})();
/* 按钮涟漪 */
document.addEventListener('click',e=>{
  const b=e.target.closest('.btn,.aiwith,.mini'); if(!b) return;
  const rect=b.getBoundingClientRect(); const size=Math.max(rect.width,rect.height);
  const r=document.createElement('span'); r.className='ripple';
  r.style.width=r.style.height=size+'px';
  r.style.left=(e.clientX-rect.left-size/2)+'px';
  r.style.top=(e.clientY-rect.top-size/2)+'px';
  b.appendChild(r); setTimeout(()=>{ if(r.parentNode) r.remove(); },600);
});

/* ===================== 1. 八字命盘（真实推算） ===================== */
/* 真太阳时校正：平太阳时(北京时间,UTC+8) → 真太阳时。
/* 真太阳时校正：平太阳时(出生地标准时,UTC+tz) → 真太阳时。
   步骤：录入钟表时(出生地标准时,UTC+tz) → 转 UTC → 转北京平太阳时(UTC+8) →
   按出生地经度与时差(EoT, Cooper 公式)微调；海拔对真太阳时影响极小(秒级)一并计入。
   经度差 = (120°E − 出生地经度) × 4 分；东经越大越早，故本地比北京早的用减。 */
function tzCorrect(y,m,day,h,lon,tz,alt){
  if(tz===undefined||tz===null||tz===''||isNaN(tz)) tz=8;
  if(alt===undefined||alt===null||alt===''||isNaN(alt)) alt=0;
  const start=new Date(y,0,1), cur=new Date(y,m-1,day);
  const n=Math.round((cur-start)/86400000)+1;            // 年内第几天(1-based)
  const g=2*Math.PI*(n-1)/365.25;
  const eot=229.18*(0.000075+0.001868*Math.cos(g)-0.032077*Math.sin(g)
            -0.014615*Math.cos(2*g)-0.040849*Math.sin(2*g)); // 时差(分钟)
  const dLon=(120-lon)*4;                                // 经度差(分钟)
  const altMin=(alt/6371000)*(180/Math.PI)/15*60;        // 海拔影响(分，极小：约2秒/千米)
  // 录入时(出生地标准时 UTC+tz) → UTC → 北京平太阳时(UTC+8)
  const utcMs=new Date(y,m-1,day,h,0,0).getTime() - tz*3600000;
  const base=new Date(utcMs + 8*3600000);
  // 真太阳时 = 北京平太阳时 - (120°E-本地经度)×4 分（东经越大越早；西边出生应更早算，故减 dLon）
  const ms=base.getTime()-((dLon+eot+altMin)*60000);
  const d2=new Date(ms);
  return {y:d2.getFullYear(),m:d2.getMonth()+1,day:d2.getDate(),h:d2.getHours(),min:d2.getMinutes(),dLon,eot,altMin,lon,tz};
}
/* 立春：取某年立春的 Solar 对象（流年以立春为界） */
function liChunOf(yr){
  try{ return Solar.fromYmd(yr,1,1).getLunar().getJieQiTable()['立春']; }catch(e){ return null; }
}
/* 流年干支：以立春为界（取立春当日八字年柱；早年正月生人据此归前一年干支） */
function yearGZ_LC(yr){
  let s=liChunOf(yr);
  if(!s){ try{ s=Solar.fromYmd(yr,2,4); }catch(e){ s=Solar.fromYmd(yr,1,1); } }
  try{ return s.getLunar().getEightChar().getYear(); }catch(e){ return Solar.fromYmd(yr,1,1).getLunar().getEightChar().getYear(); }
}
function shenSha(dg,yz,pz){
  const out=[], pos=['年','月','日','时'];
  const hit=(z,label)=>{ const i=pz.indexOf(z); if(i>=0) out.push(label+'·'+pos[i]+'支'); };
  const TY={'甲':['丑','未'],'戊':['丑','未'],'庚':['丑','未'],'乙':['子','申'],'己':['子','申'],'丙':['亥','酉'],'丁':['亥','酉'],'壬':['卯','巳'],'癸':['卯','巳'],'辛':['午','寅']};
  (TY[dg]||[]).forEach(z=>hit(z,'天乙贵人'));
  hit({'甲':'巳','乙':'午','丙':'申','丁':'酉','戊':'申','己':'酉','庚':'亥','辛':'戌','壬':'寅','癸':'卯'}[dg],'文昌');
  hit({'甲':'寅','乙':'卯','丙':'巳','丁':'午','戊':'巳','己':'午','庚':'申','辛':'酉','壬':'亥','癸':'子'}[dg],'禄神');
  hit({'甲':'卯','乙':'寅','丙':'午','丁':'巳','戊':'午','己':'巳','庚':'酉','辛':'申','壬':'子','癸':'亥'}[dg],'羊刃');
  const G={'申子辰':['酉','寅','辰'],'寅午戌':['卯','申','戌'],'巳酉丑':['午','亥','丑'],'亥卯未':['子','巳','未']};
  const key=Object.keys(G).find(g=>g.indexOf(yz)>=0||g.indexOf(pz[2])>=0);
  if(key){ hit(G[key][0],'桃花'); hit(G[key][1],'驿马'); hit(G[key][2],'华盖'); }
  return out;
}
/* 单支神煞（供大运/流年逐柱查：天乙/文昌/禄神/羊刃依日干，桃花/驿马/华盖依年支三合局） */
function shenOf(dg,yz,zhi){
  const out=[];
  const TY={'甲':['丑','未'],'戊':['丑','未'],'庚':['丑','未'],'乙':['子','申'],'己':['子','申'],'丙':['亥','酉'],'丁':['亥','酉'],'壬':['卯','巳'],'癸':['卯','巳'],'辛':['午','寅']};
  (TY[dg]||[]).forEach(z=>{ if(z===zhi) out.push('天乙贵人'); });
  if(({'甲':'巳','乙':'午','丙':'申','丁':'酉','戊':'申','己':'酉','庚':'亥','辛':'戌','壬':'寅','癸':'卯'})[dg]===zhi) out.push('文昌');
  if(({'甲':'寅','乙':'卯','丙':'巳','丁':'午','戊':'巳','己':'午','庚':'申','辛':'酉','壬':'亥','癸':'子'})[dg]===zhi) out.push('禄神');
  if(({'甲':'卯','乙':'寅','丙':'午','丁':'巳','戊':'午','己':'巳','庚':'酉','辛':'申','壬':'子','癸':'亥'})[dg]===zhi) out.push('羊刃');
  const G={'申子辰':['酉','寅','辰'],'寅午戌':['卯','申','戌'],'巳酉丑':['午','亥','丑'],'亥卯未':['子','巳','未']};
  const key=Object.keys(G).find(g=>g.indexOf(yz)>=0);
  if(key){ if(G[key][0]===zhi) out.push('桃花'); if(G[key][1]===zhi) out.push('驿马'); if(G[key][2]===zhi) out.push('华盖'); }
  return out;
}
/* 八字白话解读（基于真实盘面参数生成，非套话；返回段落数组） */
/* 穷通宝鉴·调候用神表（日干 × 月支：寒暖燥湿之间最需之天干，为"调候为急"之用神） */
const TIAOHOU={
 '甲':{子:'丁·庚·丙',丑:'丁·庚·丙',寅:'丙·癸',卯:'庚·丙·丁',辰:'庚·丁·壬',巳:'癸·丁·庚',午:'癸·丁·庚',未:'癸·庚·丁',申:'庚·丁·壬',酉:'庚·丙·丁',戌:'庚·甲·丁',亥:'庚·丁·丙'},
 '乙':{子:'丙',丑:'丙',寅:'丙·癸',卯:'丙·癸',辰:'癸·丙',巳:'癸',午:'癸·丙',未:'癸·丙',申:'丙·癸·己',酉:'癸·丙·丁',戌:'癸·辛',亥:'丙·戊'},
 '丙':{子:'壬·戊·己',丑:'壬·甲',寅:'壬·庚',卯:'壬·己',辰:'壬·甲',巳:'壬·庚·癸',午:'壬·庚',未:'壬·庚',申:'壬·戊',酉:'壬·癸',戌:'甲·壬',亥:'甲·壬·庚·戊'},
 '丁':{子:'甲·庚·戊·癸',丑:'甲·庚·戊·癸',寅:'甲·庚',卯:'庚·甲',辰:'甲·庚·戊',巳:'甲·庚',午:'壬·庚·癸',未:'甲·壬·庚',申:'甲·庚·丙·戊',酉:'甲·庚·丙·戊',戌:'甲·庚·丙·戊',亥:'甲·庚·戊·癸'},
 '戊':{子:'丙·甲',丑:'丙·甲',寅:'丙·甲·癸',卯:'丙·甲·癸',辰:'甲·丙·癸',巳:'甲·丙·癸',午:'壬·甲·丙',未:'癸·丙·甲',申:'丙·癸·甲',酉:'丙·癸',戌:'甲·丙·癸',亥:'甲·丙'},
 '己':{子:'丙·甲',丑:'丙·甲',寅:'丙·庚·甲',卯:'甲·丙·癸',辰:'丙·癸·甲',巳:'癸·丙',午:'癸·丙',未:'癸·丙',申:'丙·癸·甲',酉:'丙·癸',戌:'甲·丙·癸',亥:'甲·丙'},
 '庚':{子:'丙·丁·甲',丑:'丙·丁·甲',寅:'丙·甲',卯:'丁·甲',辰:'甲·丁',巳:'壬·丙',午:'壬·癸',未:'丁·甲',申:'丁·甲',酉:'丁·甲',戌:'甲·丁',亥:'丙·丁·甲'},
 '辛':{子:'丙·壬',丑:'丙·壬',寅:'己·壬',卯:'壬',辰:'壬·甲',巳:'壬',午:'壬·己',未:'壬·庚',申:'壬',酉:'壬',戌:'壬·甲',亥:'丙·壬'},
 '壬':{子:'丙·戊',丑:'丙·辛',寅:'庚·丙',卯:'辛·戊',辰:'甲·庚',巳:'辛',午:'辛·癸',未:'辛·甲',申:'甲·庚',酉:'甲',戌:'甲·辛',亥:'丙·戊'},
 '癸':{子:'丙·辛',丑:'丙·辛',寅:'辛·丙',卯:'辛·戊',辰:'辛·甲',巳:'辛',午:'庚·辛',未:'庚·辛·甲',申:'丁·甲',酉:'辛·丙',戌:'辛·甲',亥:'丙·辛'}
};
/* 三命通会·六十甲子纳音意象（年柱纳音论命之根基，李虚中古法所重） */
const NAYIN_IMG={
 '海中金':'深藏不露，如珠玉在渊——才华内敛、后发有成','炉中火':'温暖有力，如灶火绵长——性热情挚、能暖四方',
 '大林木':'生机舒展，如林木向荣——仁厚有容、渐成气候','路旁土':'踏实承载，如道旁之土——安稳可托、厚德载物',
 '剑锋金':'锐利决断，如出匣之剑——果敢精明、锋芒外显','山头火':'高处耀目，如山顶烈焰——声名易显、宜守谦光',
 '涧下水':'细流润下，如石涧清泉——沉静含蓄、绵绵延泽','城头土':'安稳有守，如城垣之土——稳重可倚、宜固根本',
 '白蜡金':'外饰内坚，如烛泪成金——外表温润、内里刚定','杨柳木':'柔韧随和，如垂柳临风——善顺应变、情致柔长',
 '泉中水':'清源暗涌，如井下甘泉——内秀含藏、待时而发','屋上土':'庇护所依，如檐瓦覆宇——安稳有靠、宜守家业',
 '霹雳火':'突发惊变，如雷火乍惊——性烈起势、宜防骤变','松柏木':'经寒不凋，如松柏长青——坚韧耐寒、久而弥坚',
 '长流水':'绵延不绝，如江河行地——通达持久、顺势而成','沙中金':'淘洗方现，如沙里藏金——需历炼方显其珍',
 '山下火':'余晖渐隐，如暮山落照——温婉含蓄、宜惜晚成','平地木':'平实有成，如原野之木——踏实生长、不疾不徐',
 '壁上土':'静守其位，如粉墙之列——内敛守分、宜安其居','金箔金':'精薄外显，如金箔贴饰——精巧外露、宜借光显',
 '覆灯火':'幽微长明，如灯烛照夜——细心持恒、暗处生辉','天河水':'高远清润，如天降甘霖——清贵洒脱、润物无声',
 '大驿土':'通达四方，如驿路之土——奔走有得、宜动中求稳','钗钏金':'精致贵重，如钗钏之饰——华美可人、宜惜缘分',
 '桑柘木':'柔中有用，如桑柘养蚕——柔韧有用、宜精于艺','大溪水':'奔放不羁，如溪水出山——洒脱豪放、宜导其势',
 '沙中土':'含藏待发，如沙洲积土——内含生机、待时而兴','天上火':'光耀当空，如日丽中天——显达明耀、宜护虚名',
 '石榴木':'多子丰硕，如石榴结子——繁盛有果、宜积后福','大海水':'深广包容，如沧海纳川——胸怀广大、宜守沉静'
};
const NA_YIN_60={
 '甲子':'海中金','乙丑':'海中金','丙寅':'炉中火','丁卯':'炉中火','戊辰':'大林木','己巳':'大林木',
 '庚午':'路旁土','辛未':'路旁土','壬申':'剑锋金','癸酉':'剑锋金','甲戌':'山头火','乙亥':'山头火',
 '丙子':'涧下水','丁丑':'涧下水','戊寅':'城头土','己卯':'城头土','庚辰':'白蜡金','辛巳':'白蜡金',
 '壬午':'杨柳木','癸未':'杨柳木','甲申':'泉中水','乙酉':'泉中水','丙戌':'屋上土','丁亥':'屋上土',
 '戊子':'霹雳火','己丑':'霹雳火','庚寅':'松柏木','辛卯':'松柏木','壬辰':'长流水','癸巳':'长流水',
 '甲午':'沙中金','乙未':'沙中金','丙申':'山下火','丁酉':'山下火','戊戌':'平地木','己亥':'平地木',
 '庚子':'壁上土','辛丑':'壁上土','壬寅':'金箔金','癸卯':'金箔金','甲辰':'覆灯火','乙巳':'覆灯火',
 '丙午':'天河水','丁未':'天河水','戊申':'大驿土','己酉':'大驿土','庚戌':'钗钏金','辛亥':'钗钏金',
 '壬子':'桑柘木','癸丑':'桑柘木','甲寅':'大溪水','乙卯':'大溪水','丙辰':'沙中土','丁巳':'沙中土',
 '戊午':'天上火','己未':'天上火','庚申':'石榴木','辛酉':'石榴木','壬戌':'大海水','癸亥':'大海水'
};
function nayinImg(name){ const n=(name||'').replace(/傍/g,'旁').replace(/澗/g,'涧').replace(/頭/g,'头').replace(/燈/g,'灯').replace(/靂/g,'雳'); return NAYIN_IMG[n]||NAYIN_IMG[name]||'根基之象，宜结合自身格局参看'; }
function baziRead(dayGan,qiang,wu,yongUniq,shenArr,ssGan,monthGe,yunBest,monthZhi,ny0,xchHtml,level){
  const _lv=level||qiang;
  const dayWu=GAN_WU[dayGan];
  const GAN_C={
    '甲':['甲木为阳木,如参天大树——有担当、志气高,认定的事会坚持到底;只是有时太硬气,少些转弯。','甲木参天——你是天生的带头者,有主见、扛得起事;要在坚持里留点弹性,别撞了南墙才回头。','甲坐阳木,骨子里有股向上生长的劲——重情义、讲原则,认准的路自己走到底,柔中带刚更吃得开。'],
    '乙':['乙木为阴木,如藤萝花草——心思细腻、能屈能伸,适应力强;但易想太多,要多肯定自己。','乙木藤萝——你善借势、懂绕行,柔韧是本事;别把将就活成习惯,该立的时候也立得住。','乙坐阴木,细腻如丝——感知力强、共情好,宜静宜谋;少点内耗、多点笃定,柔能克刚。'],
    '丙':['丙火为阳火,如太阳——热情开朗、行动力强,是人群里的光;火力过旺时易急躁,宜多沉心。','丙火当空——你自带光芒,乐观感染人,做事有冲劲;别让急脾气烧着自己人,留三分稳。','丙坐阳火,明耀向外——爱张罗、肯担当,越被看见越来劲;沉得住气时,光芒才不刺眼。'],
    '丁':['丁火为阴火,如灯烛——外柔内刚,思虑周密、重情义;但易操心过度,学会放轻。','丁火灯烛——你外温内亮,想得深、付得真,慢热但长情;别把心事熬成烛泪,说出口更轻松。','丁坐阴火,幽微持久——细致、专注、有韧劲,宜守宜钻;放下过度操心,灯芯才不灭。'],
    '戊':['戊土为阳土,如高山——沉稳可靠、守信用,是能托付的人;只是偏保守,可多尝新。','戊土高山——你稳得让人安心,言出必行、重承诺;偶尔跨出舒适区,山外有风景。','戊坐阳土,厚重可倚——踏实、靠谱、扛得住事;别被「稳妥」框死,试着接住一点新变。'],
    '己':['己土为阴土,如田园——温厚包容、会照顾人,人缘好;但易委屈自己,记得先顾好自己。','己土田园——你润物无声,最会成全别人;先把自己这块田养肥,才有余力滋养旁人。','己坐阴土,包容含蓄——细腻、体贴、会来事;少点自我牺牲,多点自我主张,关系更平衡。'],
    '庚':['庚金为阳金,如刀剑——果断刚毅、重义气,说一不二;但说话直,易无心伤人,多留三分余地。','庚金出鞘——你果决、讲义气,关键时刻靠得住;锋芒收一收,利刃不伤人也不伤己。','庚坐阳金,刚毅明快——认理不认人,行动利落;说话前转个弯,刚柔并济路更宽。'],
    '辛':['辛金为阴金,如珠玉——精致敏感、追求完美,品味好;但易多虑,学会接纳不完美。','辛金如玉——你细腻有品、重细节,天生讲究;别让完美主义勒住手脚,完成比完美先。','辛坐阴金,温润精微——审美在线、心思巧;少些反复掂量,落子果断,玉才显光。'],
    '壬':['壬水为阳水,如江河——聪明灵活、交际广,思维活;定力需练,专注一处更易成事。','壬水东流——你脑子活、路子广,到哪都能融;把散射的劲收成一股,江河才入海。','壬坐阳水,奔放通透——灵活、善变、人缘好;定力是功课,专注一时,成事一世。'],
    '癸':['癸水为阴水,如雨露——内秀低调、直觉敏锐,观察力强;但易内耗,多行动少空想。','癸水涵露——你内秀、敏锐,懂看势头;别把觉察都闷在心里,动起来,露珠才落地生根。','癸坐阴水,幽潜细腻——直觉准、观察深,宜静宜思;少点反复琢磨,多点出手实践。']
  };
  const SHA_D={'天乙贵人':'贵人运强,遇困时易得人扶','文昌':'利文书学业,读书/写作/文职有天分','禄神':'财缘较顺,经济上少操心','羊刃':'性子刚强,注意收敛锋芒、防争执','桃花':'人缘桃花旺,感情际遇多,重情更重品','驿马':'动中求财,宜外出发展、多走动','华盖':'有艺术宗教缘分,喜独处深思'};
  const ps=[];
  // 同人生辰稳定、异人不同句：哈希选变体，破解"模板化"
  // 先把五行强弱两端算出来，作为哈希种子的一部分（让不同盘的弱/旺五行也能影响选词）
  const _warr=Object.entries(wu).sort((a,b)=>a[1]-b[1]);
  const _least=_warr[0], _most=_warr[4];
  const _ph=_hashStr((dayGan||'')+(qiang||'')+(yongUniq?yongUniq.join(''):'')+(monthZhi||'')+(_least?_least[0]:'')+(_most?_most[0]:'')+(monthGe||''));
  const _pick=(arr,dim)=>arr[(_hashStr(String(_ph)+String(dim))%arr.length)];
  // ① 一句话结论（前置，最重要的先说）
  const _act=_lv==='身强'?'主动开拓、多历练':_lv==='偏强'?'顺势推进、稳步加力':_lv==='中和'?'顺势而为、稳中求进':_lv==='偏弱'?'养气蓄力、借势而行':'养气守成、借力而为';
  const _cV=[
    '一句话：你是 <b>'+dayGan+'日主</b>（'+dayWu+'），命局<b>'+_lv+'</b>；做事宜'+_act+'，日常多亲近五行 <b>'+yongUniq.join(' / ')+'</b> 之气最助运。',
    '先给结论：<b>'+dayGan+'</b> 坐命、格局 <b>'+_lv+'</b>，'+(qiang==='身强'?'底气足可扛事，宜往前闯、别憋着':'宜借势蓄力、量力而行')+'；命里最该多靠近的是 <b>'+yongUniq.join(' / ')+'</b> 这一路气。',
    '一句话定调：你乃 <b>'+dayGan+'（'+dayWu+'）</b> 日主，命局 <b>'+_lv+'</b>。'+(qiang==='身强'?'能担事，宜主动布局、顺势起势':'宜守宜借，先把根基养厚')+'；常近 <b>'+yongUniq.join(' / ')+'</b> 五行，运自顺。'
  ];
  ps.push(_pick(_cV,'concl'));
  // ② 日主 = 你的性格底色
  ps.push('【日主 · 你是谁】'+_pick(GAN_C[dayGan],'gan'));
  // ③ 强弱 = 你能扛多少事（五档细分：旺衰由 得令·得地·得势·得助 加权推演）
  const _qV=_lv==='身强'?['身强——精力足、能担事，但别硬扛，宜把力气用在开拓上。','身强——底气足、抗压强，最忌憋着硬扛，把力气用在往前闯上更对。','身强——气足能扛、敢冲敢担，关键是把这份力引去建功，而非耗在内耗硬顶上。']
    :_lv==='偏强'?['偏强——气足近强，能担事但忌满溢，宜把劲用在刀刃上、忌贪多求全。','偏强——底气偏足，扛得住场面；宜顺势而进、疏泄有余，莫再一味添火。','偏强——力有富余，做事有余地；宜把富余的气引向开拓，同时留三分回旋。']
    :_lv==='中和'?['中和——五行不偏，一生较平稳，顺势稳中求进即可。','中和——气脉持衡，少有极端起伏，稳扎稳打反而走得最远。','中和——不偏不倚，刚柔可调，顺着节律走便少有大起大落。']
    :_lv==='偏弱'?['偏弱——底气略欠，宜养气蓄力、借势而行，不硬撑大场面。','偏弱——能量偏柔，宜多亲近生扶你的人与事，慢养厚积、勿争一时。','偏弱——根基尚浅，宜先扎根再伸展，借平台借贵人，四两拨千斤。']
    :['身弱——宜养气守成、量力而行，多靠近生扶你的人和事，不硬撑大事。','身弱——宜借力而行，不必事事硬扛，多亲近生扶你的环境与人是上策。','身弱——不作无谓硬撑，借平台、借贵人、借时运，四两拨千斤比死扛更聪明。'];
  ps.push('【强弱 · 能扛多少】'+_pick(_qV,'qiang'));
  // ④ 五行哪里偏 = 该怎么调（占比为干1+支藏干本/中/余气 1/0.5/0.25 加权）
  const _fmt=v=>Math.round(v*10)/10;
  const _wV=[
    (_least[1]===0?'最弱（甚至独缺）的是'+_least[0]+'，宜补；':_least[0]+'偏弱，宜略补；')+_most[0]+'最旺（'+_fmt(_most[1])+'处），过旺则宜泄不宜再添。',
    (_least[1]===0?'命里'+_least[0]+'独缺，最该补这一味；':_least[0]+'偏弱，多补'+_least[0]+'；')+_most[0]+'最旺，旺则宜疏不宜堵。',
    (_least[1]===0?_least[0]+'在你命里几乎是空的，这一味要先补起来；':_least[0]+'偏枯，是你要养的一头；')+_most[0]+'满溢（'+_fmt(_most[1])+'处），满招损、宜泄其有余以就平。'
  ];
  ps.push('【五行 · 怎么调】'+_pick(_wV,'wu'));
  // ⑥b 五行偏枯 → 中医体质观（并入报告，不另开面板）
  const TCM={
    '木':['木弱则肝胆、筋骨、双目易虚——宜疏泄条达、少熬夜、远怒；木过旺则肝阳易亢、性急上火。','木弱当养肝：疏郁、早眠、少动怒；木过旺则气横，宜静不宜争。'],
    '火':['火弱则心、血脉、舌易虚——宜静心养神、忌过劳心耗神；火过旺则心火偏炎、易烦躁失眠。','火弱当养心：节思虑、远亢奋；火过旺则炎上，宜清宜静。'],
    '土':['土弱则脾胃、肌肉易虚——宜规律饮食、忌生冷黏腻；土过旺则中焦壅滞、身重困倦。','土弱当厚脾胃：三餐有时、忌生冷；土过旺则滞，宜动宜通。'],
    '金':['金弱则肺、大肠、皮毛易虚——宜润肺、远烟尘、忌悲忧伤肺；金过旺则燥气偏盛、肤干便结。','金弱当润肺：远烟尘、少悲忧；金过旺则燥，宜润忌耗。'],
    '水':['水弱则肾、膀胱、耳、骨易虚——宜养肾节劳、注意保暖；水过旺则寒凝、易底气不足。','水弱当养肾：节房劳、避寒凉；水过旺则寒，宜温忌遏。']
  };
  if(TCM[_least[0]]){
    const _tV=TCM[_least[0]];
    const _over=(_most[1]>_least[1]+2)?(_most[0]+'最旺，宜疏其有余、莫再添补。'):'';
    const _tune=[
      '【体质 · 五行偏枯】命理以五行观身态：'+_least[0]+'最弱当养——'+_tV[0]+_over+'此乃传统命理之身态观，任何不适请以现代医学诊断为准。',
      '【体质 · 五行偏枯】五行偏枯见身：你'+_least[0]+'弱、宜补其本——'+_tV[1]+_over+'命理为观，身体实况请听医生的。'
    ];
    ps.push(_pick(_tune,'tcm'));
  }
  // ⑤ 神煞 = 加分项
  if(shenArr&&shenArr.length){
    const desc=shenArr.map(s=>{ const k=Object.keys(SHA_D).find(x=>s.indexOf(x)>=0); return k?k+'（'+SHA_D[k]+'）':null; }).filter(Boolean);
    if(desc.length) ps.push('【神煞 · 加分项】命中带'+desc.join('、')+'。');
  }
  if(ny0){ ps.push('【纳音 · 年柱象】年柱纳音为 <b>'+ny0+'</b>——'+nayinImg(ny0)+'。古法（李虚中/三命通会）以年柱纳音立命之根基，可与此处的日主、格局互参，勿单执一端。'); }
  // ⑥ 大运 = 运势节奏
  if(yunBest) ps.push('【大运 · 运势节奏】'+yunBest);
  // ⑦ 喜用 = 怎么用（落到行动）
  ps.push('【喜用 · 怎么用】喜用神为'+yongUniq.join(' / ')+'，是补你命局短板的那口气——同五行对应的颜色、方位、行业、人际，多靠近些，于运程有助。');
  if(monthZhi && TIAOHOU[dayGan] && TIAOHOU[dayGan][monthZhi]){
    const th=TIAOHOU[dayGan][monthZhi];
    const _mzName={'子':'仲冬','丑':'季冬','寅':'孟春','卯':'仲春','辰':'季春','巳':'孟夏','午':'仲夏','未':'季夏','申':'孟秋','酉':'仲秋','戌':'季秋','亥':'孟冬'}[monthZhi]||(monthZhi+'月');
    const _han=_mzName.indexOf('冬')>=0||_mzName.indexOf('秋')>=0?'寒润':'暖燥';
    const _thV=[
      '【调候 · 穷通宝鉴】你生于'+_mzName+'（月令 '+monthZhi+'），寒暖燥湿之间最需 <b>'+th+'</b> 来调和——此即“调候为急”之用神。它和格局用神（月令取格）、平衡用神（补日主偏枯）是三路并行的取法，可互参：调候管“气候”，格局管“架构”，旺衰管“强弱”。',
      '【调候 · 穷通宝鉴】生于'+_mzName+'之局，先天气候偏'+_han+'，最宜以 <b>'+th+'</b> 调之。穷通宝鉴言“调候为急”——先安气候，再论生克；此与格局、旺衰用神宜合看，不可偏废。',
      '【调候 · 穷通宝鉴】'+_mzName+'（月令 '+monthZhi+'）生人，独赖 <b>'+th+'</b> 一字调其寒暖燥湿。穷通宝鉴以调候为先，气候不顺则格局、旺衰皆难发挥，故这一味宜时时顾着。'
    ];
    ps.push(_pick(_thV,'tiaohou'));
  }
  // ⑧ 格局识别（子平格局法：八字用神专求月令，先观月令取格为纲）
  const GE_JU={
    '正官':'正官格——月令正官，命带清贵之气，主守规矩、有声望，宜公职文职。行运喜财印相生扶官，最忌「伤官见官」与官杀混杂。',
    '七杀':'七杀格（偏官格）——月令七杀，命带威权魄力，主开拓敢闯、掌兵刑。喜「食神制杀」化压为力，或「杀印相生」文武相济；身弱无依则压力成患。',
    '正财':'正财格——月令正财，主踏实经营、薪俸稳定之财。喜身强能担财、食伤生财流通；忌比劫争财、忌财多身弱。',
    '偏财':'偏财格——月令偏财，主流动外财、投资人缘之富。喜身旺、官星护财；忌比劫夺财、忌财来财去无库。',
    '正印':'正印格——月令正印，主学识荫庇、贵人文书。喜官印相生、名利双收；最忌「财星破印」损名学业，亦忌食伤泄尽。',
    '偏印':'偏印格（枭神格）——月令偏印，主钻研冷门、偏业技艺。利专精一门手艺；身弱财旺则枭神夺食，宜配财通关。',
    '食神':'食神格——月令食神，主才华食禄、温和有福。喜身旺泄秀、财星疏通；最忌「枭神夺食」断其源头。',
    '伤官':'伤官格——月令伤官，主聪明外露、艺术才情。喜「伤官生财」泄秀或「伤官配印」收敛；最忌「伤官见官」惹是非，身弱尤慎。',
    '比肩':'建禄格——月令比肩当令，身必强旺。喜克泄耗（官杀财食）平衡，忌比劫林立争夺、忌印比再添。',
    '劫财':'月刃格——月令劫财当令，身强气刚。喜官杀制刃、食伤泄秀；最忌无制而刃旺，主冲动破耗。'
  };
  if(monthGe && GE_JU[monthGe]){
    const tou = ssGan && ssGan.includes(monthGe);
    const _geTail = tou ? '此格透干而清，力量显达、成格有力，宜顺势发挥。' : '此格藏而不透，力量稍敛，待岁运引出方显其用。';
    const _geV=[
      '【格局 · 月令定格】'+GE_JU[monthGe]+_geTail+'（取法：子平格局法先观月令、取格为纲。）',
      '【格局 · 月令定格】你以月令定格为'+GE_JU[monthGe].split('——')[0]+'，'+(tou?'且此十神透出天干，格局清纯有力':'此十神未透天干，格局内藏、需岁运引动')+'。'+GE_JU[monthGe].split('——')[1],
      '【格局 · 月令定格】'+GE_JU[monthGe].split('——')[0]+_geTail+'古法子平先取月令为格、次论日主强弱——此格之要义在「'+GE_JU[monthGe].split('——')[1].slice(0,18)+'」'+(tou?'，透干则成格有力、宜早用':'，藏支待引、岁运逢之方显')
    ];
    ps.push(_pick(_geV,'geju'));
  }
  // ⑨ 十神组合（组合诀：看四柱天干十神搭配，呼应滴天髓/子平用神思路）
  if(ssGan&&ssGan.length){
    const has=g=>ssGan.includes(g);
    const _combo=[];
    if(has('食神')&&has('七杀')) _combo.push('食神制杀：以才智化解压力（七杀），临危能稳、化险为能，是上等组合');
    if(has('伤官')&&has('正官')) _combo.push('伤官见官：才情外露易冲撞规矩，言行宜慎、防口舌是非（古诀"伤官见官，为祸百端"）');
    if(has('正官')&&has('正印')) _combo.push('官印相生：名望与荫庇相济，文书贵人顺、仕途清贵');
    if(has('七杀')&&(has('正印')||has('偏印'))) _combo.push('杀印相生：威权得文脉相佐，危中有机、刚柔并济');
    if(has('伤官')&&(has('正印')||has('偏印'))) _combo.push('伤官配印：才气有收敛、文采得彰显，利于学问技艺立身');
    if((has('正财')||has('偏财'))&&(has('正印')||has('偏印'))) _combo.push('财星破印：现实易牵制学业/贵人运，名利与清名须权衡取舍');
    if((has('比肩')||has('劫财'))&&(has('正财')||has('偏财'))) _combo.push('比劫争财：合作易分利、防破财，钱财往来宜明算账');
    if((has('正财')||has('偏财'))&&has('食神')) _combo.push('食神生财：以才艺生财，技能变现、安稳致富之路');
    if((has('正财')||has('偏财'))&&has('正官')) _combo.push('财官相生：事业带财、名利双收，宜在规矩内求发展');
    if(_combo.length){
      const _cv=[
        _combo.join('；')+'。',
        _combo.slice(0,2).join('；')+(_combo.length>2?'（余格同理推之）。':'。'),
        '命局十神相成：'+_combo[0]+(_combo.length>1?'，兼以'+_combo[1]+'为辅':'' )+'——组合见性情，亦见机缘。'
      ];
      ps.push('【十神组合 · 命局搭配】'+_pick(_cv,'shishen'));
    } else {
      const _cv0=[
        '【十神组合 · 命局搭配】四柱十神各安其位、无明显冲合，命局较为平和，宜顺势而为、少起波澜。',
        '【十神组合 · 命局搭配】十神分布匀净、无剧烈冲克，性子也偏稳，走好寻常路、不折腾最舒服。',
        '【十神组合 · 命局搭配】盘面十神清静少战，主平顺无大波，守常即是福，莫自寻风波。'
      ];
      ps.push(_pick(_cv0,'shishen0'));
    }
  }
  if(xchHtml) ps.push(xchHtml);
  return ps;
}

function baziYingQi(dz4, yunDz, liuZhi, ciY, qiang, yongUniq, dayGan){
  var PAL={'年':'祖基长辈','月':'父母事业','日':'自身配偶','时':'子女晚运'};
  var ZW={'子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水'};
  var CHONG={'子':'午','午':'子','丑':'未','未':'丑','寅':'申','申':'寅','卯':'酉','酉':'卯','辰':'戌','戌':'辰','巳':'亥','亥':'巳'};
  var HAI={'子':'未','未':'子','丑':'午','午':'丑','寅':'巳','巳':'寅','卯':'辰','辰':'卯','申':'亥','亥':'申','酉':'戌','戌':'酉'};
  var HE={'子':'丑','丑':'子','寅':'亥','亥':'寅','卯':'戌','戌':'卯','辰':'酉','酉':'辰','巳':'申','申':'巳','午':'未','未':'午'};
  var SANX={'寅':'巳','巳':'申','申':'寅','丑':'未','未':'戌','戌':'丑','子':'卯','卯':'子'};
  var ZIXING=['辰','午','酉','亥'];
  var SANHE_QUAN={'水':['申','子','辰'],'木':['亥','卯','未'],'火':['寅','午','戌'],'金':['巳','酉','丑']};
  var isYong=function(z){ return !!z && yongUniq.indexOf(ZW[z])>=0; };
  var _seed=(dz4.join('')+(liuZhi||'')+(yunDz&&yunDz.length?yunDz.join(''):'')).split('').reduce(function(a,c){return (a+c.charCodeAt(0))%9973;},7);
  var _pick=function(arr){ return arr[_seed%arr.length]; };
  var rel=[];
  var chk=function(pa,za,pb,zb){ if(!za||!zb)return; if(CHONG[za]===zb)rel.push([pa,pb,'冲',za,zb]); else if(HE[za]===zb)rel.push([pa,pb,'合',za,zb]); else if(HAI[za]===zb)rel.push([pa,pb,'害',za,zb]); else if(SANX[za]===zb)rel.push([pa,pb,'刑',za,zb]); };
  chk('年',dz4[0],'月',dz4[1]); chk('年',dz4[0],'日',dz4[2]); chk('年',dz4[0],'时',dz4[3]);
  chk('月',dz4[1],'日',dz4[2]); chk('月',dz4[1],'时',dz4[3]); chk('日',dz4[2],'时',dz4[3]);
  dz4.forEach(function(z,i){ if(ZIXING.indexOf(z)>=0) rel.push([i,z,'自刑',z,'']); });
  var he3=[];
  var dzSet=[]; dz4.forEach(function(z){ if(dzSet.indexOf(z)<0) dzSet.push(z); });
  Object.keys(SANHE_QUAN).forEach(function(wu){ var grp=SANHE_QUAN[wu]; if(grp.every(function(z){return dzSet.indexOf(z)>=0;})) he3.push({wu:wu,grp:grp}); });
  var parts=[];
  rel.forEach(function(r){
    var pa=r[0],pb=r[1],type=r[2],za=r[3],zb=r[4];
    var palName, zTxt;
    if(type==='自刑'){
      var pals=[]; dz4.forEach(function(zz,ii){ if(zz===za) pals.push(PAL['年月日时'[ii]]); });
      palName = pals.length? pals.join('、') : '本命';
      zTxt = za+'支';
    } else {
      palName = PAL[pa]+'与'+PAL[pb];
      zTxt = za+'与'+zb;
    }
    var why,adv;
    if(type==='冲'){ var _v=_pick([['主变动、冲突、分离','宜以沟通化解、勿硬碰'],['冲者动也，主迁徙破局、旧事翻篇','宜顺势而变、主动破局者得利'],['冲动克战，主突发波折','宜先稳基本盘、忌冒进']]); why=_v[0]; adv=_v[1]; }
    else if(type==='刑'){ var _v=_pick([['主内耗、纠纷、暗疾','宜修身忍让、防口舌官非'],['刑者磨也，主反复纠缠、心结难解','宜慢处理、勿逼一时'],['刑伤暗伏，主莫名阻滞','宜自查自省、防细微处生变']]); why=_v[0]; adv=_v[1]; }
    else if(type==='害'){ var _v=_pick([['主暗中小人、暗中损耗','宜明察、防暗箭'],['害者蔽也，主被蒙蔽、背后使绊','宜多核实、少轻信'],['暗耗渐侵，主不知不觉中流失','宜定期盘点、防微杜渐']]); why=_v[0]; adv=_v[1]; }
    else if(type==='自刑'){ var _v=_pick([['主自我纠结、内耗、反复','宜修心守静、勿钻牛角尖'],['自刑者，主跟自己过不去','宜放下执念、移步换景'],['心局自困，主想多反误事','宜以行动破思、少内省']]); why=_v[0]; adv=_v[1]; }
    else { var _v=_pick([['主吸引、羁绊、能量聚合','宜借势合作、亦防被合绊'],['合者聚也，主缘分汇拢、事有依托','宜乘势成事、忌三心二意'],['合而有力，主贵人相济之象','宜紧抓机遇、防被合住不动']]); why=_v[0]; adv=_v[1]; }
    var yj = type!=='自刑' ? ( isYong(za)||isYong(zb) ? _pick(['（所涉地支五行恰为喜用，多为吉转，冲开忌神更利）','（此支五行正是喜用，互动多成助力，宜把握）']) : _pick(['（所涉地支五行非喜用，宜谨慎防其激发）','（此支非喜用，能量冲激宜守、忌冒进）']) ) : '';
    parts.push(zTxt+type+'——'+palName+'之宫'+why+'，'+adv+yj+'。');
  });
  var _he3v=[
    '三合{h}局成（{w}局）——{w}气汇聚，能量聚合，所应之事易有规模性发展。',
    '三合{h}局成（{w}局）——三支会于一方，气脉相连，主合作成事、贵人汇聚。',
    '三合{h}局成（{w}局）——{w}局得力，根基渐厚，所谋易成气候。'
  ];
  he3.forEach(function(h){ parts.push(_pick(_he3v).replace(/\{h\}/g,h.grp.join('')).replace(/\{w\}/g,h.wu)); });
  var yq=[];
  var yqChk=function(srcName,z){
    if(!z) return;
    var acts=[];
    ['年','月','日','时'].forEach(function(pal,i){ var m=dz4[i]; if(!m)return;
      if(CHONG[z]===m) acts.push(PAL[pal]+'冲（动荡）');
      else if(HE[z]===m) acts.push(PAL[pal]+'合（聚合/羁绊）');
      else if(HAI[z]===m) acts.push(PAL[pal]+'害（暗损）');
      else if(SANX[z]===m) acts.push(PAL[pal]+'刑（内耗）');
    });
    if(acts.length){ var yj=isYong(z)?_pick(['该地支为喜用，互动多转为助力','此支恰为喜用，岁运相扶、多成助力']):_pick(['该地支非喜用，互动宜守成防变','此支非喜用，冲合宜慎、守成为上']); yq.push(srcName+'地支'+z+'与命局：'+acts.join('、')+'；'+yj+'。'); }
  };
  if(liuZhi) yqChk('本年流年('+liuZhi+')', liuZhi);
  if(yunDz && yunDz.length){
    var cur = (typeof ciY==='number'&&ciY>=0&&yunDz[ciY])?yunDz[ciY]:null;
    var nxt = yunDz[(ciY>=0?ciY+1:0)];
    if(cur) yqChk('当前大运('+cur+')', cur);
    if(nxt && nxt!==cur) yqChk('下一步大运('+nxt+')', nxt);
  }
  // —— B 流月应期下钻：把流年放大到十二个月，看哪个月地支与命局/大运/流年刑冲合害、或三合成局 ——
  var curYun = (typeof ciY==='number'&&ciY>=0&&yunDz&&yunDz[ciY])?yunDz[ciY]:null;
  var YUE_ZHI=['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑']; // 正月寅…十二月丑
  var _refs=[]; _refs.push({lab:'命局',set:dz4});
  if(curYun) _refs.push({lab:'大运'+curYun,set:[curYun]});
  if(liuZhi) _refs.push({lab:'流年'+liuZhi,set:[liuZhi]});
  // 流月宜忌动作库：主导事件类型 → 喜用/忌神各自的具体动作，让下钻可执行
  var ACT_LIB={
    '冲':{y:'宜主动推进、外出决断、搬家签约',n:'宜维稳沟通化解、勿硬碰硬、忌大动干戈'},
    '刑':{y:'宜自律规范、按章办事、复盘自查',n:'宜修身忍让、防口舌官非、忌争执违规'},
    '害':{y:'宜低调自查、收敛锋芒、量入为出',n:'宜明察暗箭、远防小人、忌轻信合伙不明'},
    '合':{y:'宜合作结盟、借势而行、撮合资源',n:'宜明察、防被合绊牵制、忌盲信他人'},
    '三合':{y:'宜聚合资源、成事聚力、办大事',n:'宜择机而动、忌贪大被局裹挟、分散精力'}
  };
  // 流月神煞分层（依日主与年支真算）：吉神扶助 / 凶神提防 / 动象中性，与刑冲合害叠加定该月层级
  var JI_SHEN=['天乙贵人','文昌','禄神'], XIONG_SHEN=['羊刃'];
  var SHEN_ACT={'天乙贵人':'贵人可求——宜托人、递话、找资源','文昌':'利文书——宜考试、签约、写作发表','禄神':'财缘顺——宜谈薪、结款、开源','羊刃':'锋芒过盛——忌争执动怒、注意刀刃与交通','桃花':'人缘旺——宜社交相亲，惟防情事纷扰','驿马':'主走动——宜出行、外派、异地拓展','华盖':'主孤高——宜独处修习、闭关精进'};
  var yueLines=[], yueRank=[];
  YUE_ZHI.forEach(function(mz,mi){
    var acts=[];
    _refs.forEach(function(rf){
      rf.set.forEach(function(z,i){
        var pal = rf.lab==='命局'? PAL['年月日时'[i]] : rf.lab;
        if(CHONG[z]===mz) acts.push(pal+'冲');
        else if(HE[z]===mz) acts.push(pal+'合');
        else if(HAI[z]===mz) acts.push(pal+'害');
        else if(SANX[z]===mz) acts.push(pal+'刑');
      });
    });
    var sanOk=null;
    Object.keys(SANHE_QUAN).forEach(function(wu){
      var grp=SANHE_QUAN[wu]; if(grp.indexOf(mz)<0) return;
      var others=grp.filter(function(x){return x!==mz;});
      var hit=others.filter(function(x){ return _refs.some(function(rf){return rf.set.indexOf(x)>=0;}); });
      if(hit.length>=2) sanOk=wu;
    });
    // 该月支所带神煞（真算：天乙/文昌/禄神/羊刃依日干，桃花/驿马/华盖依年支三合局）
    var msh=[]; try{ msh=(typeof shenOf==='function'&&dayGan)?(shenOf(dayGan,dz4[0],mz)||[]):[]; }catch(e){ msh=[]; }
    var jiS=msh.filter(function(s){return JI_SHEN.indexOf(s)>=0;});
    var xiS=msh.filter(function(s){return XIONG_SHEN.indexOf(s)>=0;});
    var dgS=msh.filter(function(s){return JI_SHEN.indexOf(s)<0&&XIONG_SHEN.indexOf(s)<0;});
    if(!acts.length && !sanOk && !msh.length) return;   // 该月无事，不占篇幅
    var yongM=isYong(mz);
    // 月度层级评分：喜忌 ±1，吉神 +1/个，凶神 -1/个，忌神月又逢冲刑害 -1，三合成局按喜忌加倍
    var negCnt=acts.filter(function(a){return /冲|刑|害/.test(a);}).length;
    var sc=(yongM?1:-1)+jiS.length-xiS.length;
    if(!yongM && negCnt) sc-=1;
    if(negCnt>=3) sc-=1;   // 多重冲刑害叠加，纵为喜用之月亦主动荡，不可径判为吉
    if(sanOk) sc+=(yongM?1:-1);
    var lv = sc>=2?'上吉':sc===1?'吉':sc===0?'平':sc===-1?'小凶':'凶';
    yueRank.push({mi:mi+1,mz:mz,sc:sc,lv:lv});
    var seg='<b>'+(mi+1)+'月('+mz+')·'+lv+'</b>：';
    if(acts.length||sanOk){
      var yj = yongM?'月支为喜用，该月多成助力，宜把握时机':'月支非喜用，该月宜守成、防其激发';
      // 取主导事件类型定动作库（优先级 冲>刑>害>合>三合）
      var dom = acts.some(function(a){return a.indexOf('冲')>=0})?'冲'
              : acts.some(function(a){return a.indexOf('刑')>=0})?'刑'
              : acts.some(function(a){return a.indexOf('害')>=0})?'害'
              : acts.some(function(a){return a.indexOf('合')>=0})?'合'
              : (sanOk?'三合':'');
      var act = ACT_LIB[dom]? (yongM? ACT_LIB[dom].y : ACT_LIB[dom].n) : '';
      seg+=acts.join('、')+(sanOk?((acts.length?'、':'')+'三合'+sanOk+'局成'):'')+'——'+yj+(act?('；'+act):'');
    } else {
      seg+=(yongM?'月支为喜用、气顺':'月支非喜用、气偏')+'，本月无刑冲合害';
    }
    if(jiS.length) seg+='；<b>吉神</b> '+jiS.join('、')+'（'+jiS.map(function(s){return SHEN_ACT[s]||'';}).filter(Boolean).join('；')+'）';
    if(xiS.length) seg+='；<b>凶神</b> '+xiS.join('、')+'（'+xiS.map(function(s){return SHEN_ACT[s]||'';}).filter(Boolean).join('；')+'）';
    if(dgS.length) seg+='；动象 '+dgS.join('、')+'（'+dgS.map(function(s){return SHEN_ACT[s]||'';}).filter(Boolean).join('；')+'）';
    yueLines.push(seg);
  });
  // 重点月总结：最顺与最需留意的月份，便于把要紧之事排期
  var focus='';
  if(yueRank.length>1){
    var srt=yueRank.slice().sort(function(a,b){return b.sc-a.sc;});
    var top=srt[0], bot=srt[srt.length-1];
    if(top.sc>bot.sc) focus='<b>本年排期要点</b>：力量最顺在 <b>'+top.mi+'月('+top.mz+')·'+top.lv+'</b>，要紧之事（签约、面试、开张、提亲、搬迁）宜排此月；最需留意在 <b>'+bot.mi+'月('+bot.mz+')·'+bot.lv+'</b>，宜守成复盘、勿强求勿扩张。';
  }
  var yueHtml = yueLines.length? (yueLines.join('；')+'。'+focus) : '十二个月地支与命局/大运/流年均无显著刑冲合害、亦无神煞临月，本年流月相对平顺，按月推进即可。';
  var html='';
  if(parts.length){ html+='【应期 · 刑冲合害 · 原局】'+parts.join('')+' 古法：原局是底牌，刑冲合害是引发吉凶的导火索——冲主动、刑主磨、合主绊、害主暗。'; }
  if(yq.length){ html+='【应期 · 大运流年】'+yq.join('')+'「大运管大势、流年管细节」，大运好则流年虽有波亦无碍，大运差则流年纵吉亦难翻盘；互动落在喜用则吉，落在忌神则宜守。'; }
  if(yueHtml){ html+='【应期 · 流月下钻】'+yueHtml+'流月是把一年放大到十二个月——大运流年定调后，具体到哪个月易起风波、哪个月宜出手，看月支与命局/大运/流年的刑冲合害（三合则成局、力量更聚）。'; }
  return html;
}

/* 卦象白话解读（上/下卦五行生克 + 动爻判断，供易经/六爻/梅花复用；返回段落数组） */
function hexReading(up,down,dongN,bianName){
  const uWu=JING_WU[up], dWu=JING_WU[down];
  let rel;
  if(SHENG[dWu]===uWu) rel='下卦'+dWu+'生上卦'+uWu+'——根基有源、内外相济,此事得助力,宜趁势而为。';
  else if(SHENG[uWu]===dWu) rel='上卦'+uWu+'生下卦'+dWu+'——外势养内,有贵人扶持,但勿生依赖。';
  else if(KE[dWu]===uWu) rel='下卦'+dWu+'克上卦'+uWu+'——内里掣肘,谋事费力,宜先安内再谋外。';
  else if(KE[uWu]===dWu) rel='上卦'+uWu+'克下卦'+dWu+'——外有压力,事多阻滞,宜缓图勿强求。';
  else rel='上下卦五行比和——内外同心,此事平稳可行。';
  const dong=dongN>0?'本卦有'+dongN+'爻发动'+(bianName?',变出'+bianName+'卦':'')+'——事态正在变化,忌死守旧路,宜顺势调整。':'六爻安静无动,当下局面平稳,按部就班即可,不宜大动干戈。';
  return [rel,dong];
}
/* 卦象一句话结论（供易经/六爻首段） */
function hexOneLine(up,down,dongN){
  const uWu=JING_WU[up],dWu=JING_WU[down];
  let r = SHENG[dWu]===uWu?'内外相济、得助力': SHENG[uWu]===dWu?'外势养内、有贵人':
          KE[dWu]===uWu?'内里掣肘、谋事费力': KE[uWu]===dWu?'外有压力、事多阻滞':'内外同心、平稳可行';
  const d = dongN>0?'卦有发动、宜顺势调整':'六爻安静、按部就班';
  return '一句话：'+r+'；'+d+'。';
}
/* 术语小词典（悬浮/聚焦释义；全局复用） */
const TERM_DICT={
  "值符":"奇门中值符是时家奇门的核心，代表当下时空的主能量点，吉凶多系于此宫。",
  "值使":"值使是值符所统之门，随值符而动，主事之执行与通路。",
  "隐干":"奇门中隐干是门后暗藏的时干，代表表面之下未明说的动因。",
  "驿马":"八字与奇门中的动星，主变动、出行、奔波，宜动中求成。",
  "空亡":"旬空之宫或支，主虚惊、落空、事难成，忌悬而未决。",
  "旬空":"一旬十日，十日之外的两支为旬空，主虚象、事易落空。",
  "三方四正":"紫微斗数中命宫主干：三方（命·财·官）加四正（对宫迁移），构成人生四梁八柱。",
  "四化":"紫微斗数以年干飞禄权科忌四化，禄主福、权主势、科主名、忌主执。",
  "大运":"八字以十年为一步大运，顺逆依性别与年干阴阳而定，看人生各阶段起伏。",
  "流年":"当年的太岁干支，叠加大运看一年内之吉凶与应事。",
  "十神":"以日干为中心，与其他干支的生克关系命名的十种神——比劫、食伤、财、官杀、印。",
  "喜用神":"命局偏弱则补生扶我者为喜用，偏弱需抑则取克泄者为用，调候命局之药。",
  "身强":"日主得令得势，精力足、能担事；强宜泄宜克，主动开拓。",
  "身弱":"日主失令失势，宜养气守成、亲近生扶；不硬撑大事。",
  "体用":"梅花易数中体为我、用为所问之事；体用生克断吉凶。",
  "动爻":"卦中老阴老阳之变爻，主事态正在变化，看变出之卦。",
  "本卦":"起卦所得之卦，代表当下本相。",
  "变卦":"动爻变化后所成之卦，代表事态发展之后的结果。",
  "六亲":"六爻中以我（官鬼/我）为中心，与爻的生克定父母、官鬼、妻财、子孙、兄弟。",
  "世应":"六爻中世为我方、应为对方，看彼此态势与胜负。",
  "真太阳时":"按出生地经度与时差校正后的真实太阳时，决定出生时辰是否变动。",
  "纳音":"干支的五行之声，六十甲子每两字一组纳音，用于称骨、命理细节。",
  "命宫":"紫微斗数十二宫之首，代表自我、性格与先天格局。",
  "财帛宫":"紫微十二宫之一，看财富、理财与对金钱的态度。",
  "官禄宫":"紫微十二宫之一，看事业、职位与社会成就。",
  "迁移宫":"紫微十二宫之一，看外出、环境与外在际遇，是命宫的对宫。",
  "称骨":"袁天罡称骨歌，以年月日时骨重合计论命，数字越大格局越高。",
  "三才":"姓名学天·人·地三才配置，看天人地三才的五行生克。",
  "五格":"姓名学天格·人格·地格·外格·总格，由康熙笔画推算吉凶。",
  "康熙笔画":"按《康熙字典》部首笔数计算，姓名学以此为准。",
  "安星":"紫微斗数依生辰安放十四主星与辅星的规则体系。",
  "庙旺":"星曜临庙旺之地则得力，临陷地则减力，看星之强弱。",
  "梅花易数":"以数起卦、体用生克断事的占法，相传为邵雍所创。",
  "六爻":"以三枚铜钱掷六次成卦的占法，装六亲六神断吉凶。",
  "太岁":"当年的太岁干支，冲犯本命者谓之犯太岁，多主变动。",
  "禄存":"八字与紫微中的吉星，主财禄安稳。",
  "文昌":"主文采学业之星，利读书、写作、文职。",
  "桃花":"主感情人缘之星，桃花旺则异性缘佳。",
  "羊刃":"刚烈之星，性子强、宜收敛锋芒。",
  "华盖":"主艺术宗教缘分，喜独处深思之星。",
  "黄黑道":"择日吉凶的黄道六神（青龙/明堂/金匮/天德/玉堂/司命）与黑道六神（天刑/朱雀/白虎/天牢/玄武/勾陈），黄道所临时辰为吉时。",
  "吉时":"当日黄黑道十二神中黄道六神所临的时辰，主行事顺遂、宜办要事。",
  "六曜":"源自东瀛的日运小历：先胜/友引/先负/佛灭/大安/赤口，主当日行事倾向。",
  "彭祖百忌":"彭祖所传日干日支禁忌口诀，如「甲不开仓」「子不问卜」。",
  "喜神":"当日喜事吉神方位，宜求喜、约会、宴客时面向该方。",
  "财神":"当日财运吉神方位，宜求财、签约、讨账时面向该方。",
  "福神":"当日福气吉神方位，宜祈福、安宅、开市时面向该方。",
  "冲煞":"当日地支所冲之生肖与煞方，冲则动、煞则避，出行赴事宜回避。",
  "值星":"当日的当值星宿（二十八宿之一），主当日星气所属。",
  "大阿卡那":"塔罗 22 张主牌，从愚者到世界，代表人生大课题与原型力量。",
  "小阿卡那":"塔罗 56 张辅牌（权杖/圣杯/宝剑/星币各 14 张），代表日常细事与具体情境。",
  "正位":"塔罗牌面正向展开，主顺势、彰显、明面之意。",
  "逆位":"塔罗牌面反向展开，主内省、调整、阻滞之意。",
  "牌阵":"塔罗占卜按位置摆放的牌局，如三牌阵（过去/现在/未来）、凯尔特十字。",
  "凯尔特十字":"塔罗经典十张牌阵，覆盖现状/挑战/根基/过去/未来/自我/他人/希望/结果。",
  "六神":"六爻中按日干安放的六神：青龙/朱雀/勾陈/腾蛇/白虎/玄武，主爻位吉凶气象。",
  "体党":"梅花易数中与体卦同气或相生的卦为体党，体党势盛则我方根基强。",
  "比肩":"十神之一，与日干同五行同阴阳，主同辈、朋友、自我主张，过多则固执。",
  "劫财":"十神之一，与日干同五行异阴阳，主兄弟、竞争、破耗，亦主行动力。",
  "食神":"十神之一，日干所生同性，主才华、口福、表达，泄秀生财之星。",
  "伤官":"十神之一，日干所生异性，主聪明傲气、艺术叛逆，喜自由不喜约束。",
  "正财":"十神之一，日干所克同性，主稳定收入、勤劳之财，务实可守。",
  "偏财":"十神之一，日干所克异性，主横财、投机、外财与人际魅力。",
  "正官":"十神之一，克日干同性，主规矩、事业、名望，循礼守法之星。",
  "七杀":"十神之一，克日干异性，主魄力、压力、开创，制化得宜则为权。",
  "正印":"十神之一，生日干同性，主学识、荫护、慈悲，生扶日主之药。",
  "偏印":"十神之一，生日干异性，主冷门才学、孤僻，亦名「枭神」多思少言。",
  "禄存星":"紫微吉星，主财禄安稳、库中有藏，落宫少破耗。",
  "化禄":"紫微四化之一，主福气、钱财、顺遂，所入之宫得助。",
  "化权":"紫微四化之一，主权威、掌控、魄力，所入之宫增势。",
  "化科":"紫微四化之一，主名声、文书、清誉，所入之宫扬名。",
  "化忌":"紫微四化之一，主执着、收敛、阻滞，所入之宫宜守不宜冒。",
  "天盘":"紫微排盘中星曜随天转动之盘，主先天命格。",
  "地盘":"紫微排盘中宫位地基之盘，主后天落实。",
  "人盘":"紫微排盘中大限小限流转之盘，主人生阶段。",
  "神盘":"紫门/紫微中八吉凶神（如龙池凤阁、蜚廉破碎）所临之盘，主隐性气象。",
  "旺相休囚死":"五行随四季的五种状态：旺(当令)、相(受生)、休(生他)、囚(克他)、死(被克)。",
  "长生十二宫":"五行从长生到养的十二运程：长生·沐浴·冠带·临官·帝旺·衰·病·死·墓·绝·胎·养。",
  "三合":"地支三合局：申子辰水、亥卯未木、寅午戌火、巳酉丑金，主聚合助力。",
  "六合":"地支六合：子丑土、寅亥木等六组相合，主和合、媒介。",
  "拱照":"本宫前后隔宫之星遥相呼应，如拱照，主潜在助力或牵动。",
  "夹宫":"本宫左右两邻宫之星夹辅，主近身影响（吉夹则助、凶夹则扰）。",
  "叠":"两层同类之星或同类四化同落一宫，谓之叠，力量加倍。",
  "冲":"地支六冲（子午、卯酉等），主变动、冲突、离散。",
  "刑":"地支相刑（寅巳申无恩刑等），主纠葛、内耗、暗伤。",
  "害":"地支相害（子未害等），主暗损、误会、牵制。",
  "伏吟":"卦或盘回归本象（如本宫叠本宫），主迟滞、反复、旧事重提。",
  "返吟":"冲格再动（本宫对冲再逢冲），主剧烈变动、远行、反复。",
  "杀破狼":"紫微格局：七杀·破军·贪狼三星，主开创变动、大起大落。",
  "机月同梁":"紫微格局：天机·太阴·天同·天梁，主谋略文职、辅佐漂泊。",
  "辅弼":"左辅右弼，紫微两大辅星，主助力、贵人暗扶。",
  "昌曲":"文昌文曲，紫微两大文星，主才华、学业、口才。",
  "魁钺":"天魁天钺，紫微两大贵星，主逢凶化吉、机缘提携。",
  "四煞":"擎羊·陀罗·火星·铃星，紫微四大煞星，主挫败冲击。",
  "空劫":"地空地劫，紫微两大空星，主虚耗、想法落空。",
  "红鸾":"紫微桃花星，主正缘喜庆、婚恋之喜。",
  "天喜":"紫微喜庆星，主添丁、吉庆、欢喜之事。",
  "天姚":"紫微桃花星，主风情、才艺，亦主感情纠缠。",
  "孤辰":"紫微孤克星，主孤独、少依，男忌。",
  "寡宿":"紫微孤克星，主寂寞、刑克，女忌。",
  "华盖星":"紫微艺术星，主宗教艺术缘分，喜独处深思（与「华盖」神煞同源）。",
  "截空":"紫微空亡星，主截断、事易中辍。",
  "旬空星":"紫微空亡星，主虚悬、事难落实。",
  "博士":"紫微岁前星，主聪敏、文书。",
  "青龙":"紫微岁前星，主喜庆、生发。",
  "大耗":"紫微岁前星，主破财、耗损。",
  "病符":"紫微岁前星，主小病、欠安。",
  "喜神星":"紫微岁前星，主喜悦、顺遂。",
  "飞廉":"紫微岁前星，主小人、虚惊。",
  "奏书":"紫微岁前星，主文书、词讼之利。",
  "将军":"紫微岁前星，主武事、行动。",
  "小耗":"紫微岁前星，主小额耗损。",
  "岁破":"紫微岁前星，主破败、冲犯太岁。",
  "龙德":"紫微岁前星，主贵人、解厄。",
  "白虎星":"紫微岁前星，主血光、刑伤（与六神白虎同源）。",
  "天德":"紫微月德贵星，主化解灾厄、逢凶化吉。",
  "月德":"紫微月德贵星，主仁慈、消灾。",
  "将星":"紫微神煞，主权威、领军之才。",
  "驿马星":"紫微神煞，主远行变动（与「驿马」同义）。",
  "劫煞":"紫微神煞，主劫夺、突来之失。",
  "灾煞":"紫微神煞，主灾患、意外。",
  "咸池":"紫微神煞，主桃花、情欲（又名桃花）。",
  "天医":"紫微神煞，主医药、祛病。",
  "丧门":"紫微神煞，主孝服、哀丧。",
  "吊客":"紫微神煞，主吊唁、烦忧。",
  "官符":"紫微神煞，主官非、词讼。",
  "五鬼":"紫微神煞，主阴晦、小人暗算。",
  "飞刃":"紫微神煞，主血光、刀伤。",
  "破碎":"紫微神煞，主破败、缺漏。",
  "天罗":"紫微神煞，主困顿、网罗（辰为天罗）。",
  "地网":"紫微神煞，主困顿、网罗（戌为地网）。",
  "披麻":"紫微神煞，主丧孝、悲忧。",
  "血刃":"紫微神煞，主血光、伤灾。",
  "浮沉":"紫微神煞，主起伏、沉浮不定。",
  "元辰":"紫微神煞，主晦暗、是非。",
  "阴差阳错":"紫微神煞，主姻缘错配、事与愿违。",
  "纳音五行":"干支纳音所配五行（如甲子乙丑海中金），论命细节之用。",
  "正五行":"干支本气五行（如甲乙木、丙丁火），论生克之主。",
  "藏干":"地支中所藏天干（如子藏癸、丑藏己癸辛），论气之深浅。",
  "中气":"节气中气的别称（如雨水、春分），排盘定月令之用。",
  "节气":"二十四气，太阳黄经之节点，定八字月令与奇门局之用。",
  "进神":"干支递进之象（如甲子→乙丑），主向前、生发。",
  "退神":"干支退逆之象（如乙丑→甲子），主退缩、反复。"
};
const TERM_LIST=Object.keys(TERM_DICT).sort((a,b)=>b.length-a.length).map(k=>[k,TERM_DICT[k]]);
function wrapTerms(s){
  if(!s) return s;
  const re=new RegExp('('+TERM_LIST.map(function(k){return k[0].replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}).join('|')+')','g');
  /* 幂等：已包裹的 .term 原样保留，避免重复嵌套；属性内 > 转义防正则截断 */
  return s.replace(/(<span class="term"[^>]*>[^<]*<\/span>)|(<[^>]+>)|([^<]+)/g,function(m,ex,tag,txt){
    if(ex) return ex;
    if(tag) return tag;
    return txt.replace(re,function(w){
      const tip=TERM_DICT[w]||'';
      const safe=tip.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/>/g,'&gt;');
      return '<span class="term" tabindex="0" data-tip="'+safe+'">'+w+'</span>';
    });
  });
}
/* 全局术语词典：任何模块渲染出 .result 后自动包裹术语（幂等 + data-terms 标记防重复） */
(function(){
  function applyTermDict(){
    try{
      const els=document.querySelectorAll('.result:not([data-terms])');
      for(const el of els){ try{ el.innerHTML=wrapTerms(el.innerHTML); el.setAttribute('data-terms','1'); }catch(e){} }
    }catch(e){}
  }
  if(typeof MutationObserver==='undefined') return;
  let _to; const obs=new MutationObserver(function(){
    clearTimeout(_to);
    _to=setTimeout(function(){ try{ obs.disconnect(); applyTermDict(); }catch(e){} setTimeout(function(){ try{ obs.observe(document.body,{childList:true,subtree:true}); }catch(e){} },0); },60);
  });
  try{ obs.observe(document.body,{childList:true,subtree:true}); }catch(e){}
  window.__applyTermDict=applyTermDict;
})();
/* 三层同心圆命盘图（借鉴司南 Sinan：外环十二地支 · 中环四柱 · 内环太极） */
function ringChart(pillars,sx){
  const C=140,R1=128,R2=98,R3=60;
  const ang=i=>(-90+i*30)*Math.PI/180;
  const pt=(r,i)=>({x:+(C+r*Math.cos(ang(i))).toFixed(1),y:+(C+r*Math.sin(ang(i))).toFixed(1)});
  let zh='';
  for(let i=0;i<12;i++){ const p=pt(R1,i); zh+=`<text x="${p.x}" y="${p.y+4.5}" fill="var(--r-muted)" font-size="13" text-anchor="middle" font-family="serif">${ZHI[i]}</text>`; }
  const lbl=['年','月','日','时'], pos=[0,3,6,9];
  let pz='';
  pillars.forEach((gz,i)=>{ const p=pt(R2,pos[i]);
    pz+=`<text x="${p.x}" y="${p.y-7}" fill="var(--r-muted)" font-size="11" text-anchor="middle">${lbl[i]}柱</text>
         <text x="${p.x}" y="${p.y+13}" fill="var(--r-ink)" font-size="16" text-anchor="middle" font-family="serif">${gz}</text>`; });
  const tai=`<g transform="translate(${C},${C})">
    <path d="M0,-52 A52,52 0 0,1 0,52 A26,26 0 0,1 0,0 A26,26 0 0,0 0,-52 Z" fill="var(--r-gold)"/>
    <circle cx="0" cy="-26" r="8" fill="var(--r-paper)"/><circle cx="0" cy="26" r="8" fill="var(--r-gold)"/></g>`;
  return `<div style="display:flex;justify-content:center;margin:12px 0 2px"><svg width="264" height="264" viewBox="0 0 280 280" style="max-width:100%">
    <circle cx="${C}" cy="${C}" r="${R1}" fill="none" stroke="var(--r-line)" stroke-width="1"/>
    <circle cx="${C}" cy="${C}" r="${R2}" fill="none" stroke="var(--r-line)" stroke-width=".8"/>
    <circle cx="${C}" cy="${C}" r="${R3}" fill="none" stroke="var(--r-line)" stroke-width=".8"/>
    <line x1="${C}" y1="${C-R1}" x2="${C}" y2="${C+R1}" stroke="var(--r-line-soft)"/>
    <line x1="${C-R1}" y1="${C}" x2="${C+R1}" y2="${C}" stroke="var(--r-line-soft)"/>
    ${zh}${pz}${tai}
  </svg></div>`;
}
/* ===================== 共享：真实日主旺衰·喜用·忌神引擎 ===================== */
/* 与八字面板同源算法：得令(月令旺相休囚死+余气+十二长生) + 得地(四支通根·藏干加权)
   + 得势(天干比劫印) + 得助(地支印星本气)。供幸运色 / 解梦 / 本命视角消费。
   输出五档 level(身强/偏强/中和/偏弱/身弱)；qiang 保持三档兼容旧消费方。
   lateZi=true 时 23 点后日柱按次日（晚子时流派），默认按当天。 */
function baziStrength(y,m,d,h,lateZi){
  try{
    const solar=Solar.fromYmdHms(y,m,d,h,0,0);
    const lunar=solar.getLunar(); const ec=lunar.getEightChar();
    if(lateZi) ec.setSect(1);
    const pillars=[ec.getYear(),ec.getMonth(),ec.getDay(),ec.getTime()];
    const dayGan=ec.getDayGan(); const dayWu=GAN_WU[dayGan];
    const KE_W={'木':'金','火':'水','土':'木','金':'火','水':'土'};        // 克我者(官杀)五行
    const SHENG_W={'金':'土','木':'水','水':'金','火':'木','土':'火'};    // 生我者(印)五行
    const HIDE_WT=[1,0.5,0.25];           // 藏干权重：本气/中气/余气
    const DI_SCORE={'长生':3,'沐浴':1.5,'冠带':3,'临官':4,'帝旺':5,'衰':-1,'病':-2,'死':-3,'墓':-0.5,'绝':-4,'胎':1,'养':1.5};
    const diShi=z=>{ try{ const o=+(LunarUtil.CHANG_SHENG_OFFSET[dayGan]||0)||0; const i=((o+(GAN_YIN[dayGan]?ZHI_IDX[z]:-ZHI_IDX[z]))%12+12)%12; return LunarUtil.CHANG_SHENG[i]||''; }catch(e){ return ''; } };
    const mz=ec.getMonthZhi(); const mw=GAN_WU[DZ_BENQI[mz]];
    const shengWo=SHENG_W[dayWu], woSheng=SHENG[dayWu], keWo=KE_W[dayWu], woKe=KE[dayWu];
    let ling=0, di=0, shi=0, zhu=0;
    // ① 得令（月令提纲）：本气 旺/相/休/囚/死（当令旺·令生我相·我生令休·我克令囚·令克我死）+ 中余气比劫印加/克泄耗减 + 月支十二长生
    ling += mw===dayWu?8 : mw===shengWo?5 : mw===woSheng?2 : mw===woKe?-3 : -5;
    (CANG_GAN[mz]||[]).forEach((g,j)=>{ if(!j) return; const w=GAN_WU[g]; if(w===dayWu||w===shengWo) ling+=1.5*HIDE_WT[j]; else if(w===woSheng||w===woKe||w===keWo) ling-=1.5*HIDE_WT[j]; });
    ling += DI_SCORE[diShi(mz)]||0;
    // ② 得地（通根）：四支藏干含日主五行，按本/中/余气加权（月支权重×2）
    pillars.forEach((gz,i)=>{ (CANG_GAN[gz.charAt(1)]||[]).forEach((g,j)=>{ if(GAN_WU[g]===dayWu) di+=3*HIDE_WT[j]*(i===1?2:1); }); });
    // ③ 得势（天干，不含日干本身）：比劫印为正，食伤/财/官杀为负（克泄耗）
    pillars.forEach((gz,i)=>{ if(i===2) return; const w=GAN_WU[gz.charAt(0)]; if(w===dayWu||w===shengWo) shi+=2.5; else if(w===woSheng||w===woKe||w===keWo) shi-=2.5; });
    // ④ 得助（地支本气，对称计分）：比劫印为正，食伤/财/官杀为负（日主同气已计入通根）
    pillars.forEach(gz=>{ const b=DZ_BENQI[gz.charAt(1)]; const w=GAN_WU[b]; if(w===dayWu||w===shengWo) zhu+=1.5; else if(w===woSheng||w===woKe||w===keWo) zhu-=1.5; });
    const score=ling+di+shi+zhu;
    const level = score>=22?'身强' : score>=8?'偏强' : score>-8?'中和' : score>-20?'偏弱' : '身弱';
    const qiang = (level==='身强'||level==='偏强')?'身强' : (level==='身弱'||level==='偏弱')?'身弱' : '中和';
    const tiaoList=(()=>{ const t=TIAOHOU[dayGan]&&TIAOHOU[dayGan][mz]; return t?t.split(/[·、]/):[]; })();
    let yongWu;
    if(qiang==='身强') yongWu=[KE_W[dayWu],KE[dayWu],SHENG[dayWu]];
    else if(qiang==='身弱') yongWu=[SHENG_W[dayWu],dayWu];
    else{
      yongWu=tiaoList.map(g=>GAN_WU[g]).filter(w=>w);
      if(yongWu.length<2){ const order=[SHENG_W[dayWu],dayWu,'木','火','土','金','水']; order.forEach(w=>{ if(!yongWu.includes(w)) yongWu.push(w); }); }
      yongWu=yongWu.slice(0,3);
    }
    const yongUniq=[...new Set(yongWu)];
    const jiWu = qiang==='身强' ? [dayWu,SHENG_W[dayWu]] : qiang==='身弱' ? [KE_W[dayWu],KE[dayWu],SHENG[dayWu]] : [dayWu];
    const jiUniq=[...new Set(jiWu)];
    const detail={ ling,di,shi,zhu, monthZhi:mz, monthDiShi:diShi(mz), level, tiaoHou:tiaoList.join('·') };
    return {dayGan,dayWu,score,qiang,level,yongWu,yongUniq,jiWu,jiUniq,pillars,detail};
  }catch(e){ return null; }
}

document.getElementById('baziBtn').onclick=()=>{
  const d=document.getElementById('birth').value;
  if(!d){hintResult('baziResult','请选择出生日期后再推算。');return;}
  const [y,m,day]=d.split('-').map(Number);
  const hRaw=document.getElementById('hour').value;
  const hourUnknown=hRaw==='unknown';                  // 时辰不详：以午时(11)试推并显著提示
  const h=hourUnknown?11:parseInt(hRaw);
  const lateZi=document.getElementById('baziLateZi')&&document.getElementById('baziLateZi').checked&&h===23;
  const gender=document.getElementById('gender').value;
  const lon=parseFloat(document.getElementById('baziCity').value)||120;
  const useSolar=document.getElementById('useSolar').checked;
  const tzVal=parseFloat(document.getElementById('baziTz').value);
  const altVal=parseFloat(document.getElementById('baziAlt').value)||0;
  const baziSchool=document.getElementById('baziSchool').value;
  const _sceneSel=document.getElementById('baziScene'); const sceneVal=_sceneSel?_sceneSel.value:'all';
  let tc, tzNote, solar;
  if(useSolar){
    tc=tzCorrect(y,m,day,h,lon,tzVal,altVal);
    const tzc = (tzVal!==8)?` · 时区 UTC+${tzVal}`:'';
    const altc = (altVal&&altVal!==0)?` · 海拔${altVal}m(+${tc.altMin.toFixed(1)}分)`:'';
    tzNote=`<p style="margin-top:8px;color:var(--muted);font-size:12px">真太阳时校正：出生地东经<b style="color:var(--gold2)">${lon}°</b>，较北京时间${tc.dLon>=0?'慢':'快'}${Math.abs(Math.round(tc.dLon))}分（经度）+ 时差${Math.round(tc.eot)}分${tzc}${altc}，校正后约 <b style="color:var(--gold2)">${tc.h}:${String(tc.min).padStart(2,'0')}</b>（${tc.y}-${tc.m}-${tc.day}）</p>`;
    solar=Solar.fromYmdHms(tc.y,tc.m,tc.day,tc.h,tc.min,0);
  } else {
    tc={y,m,day,h,min:0,lon,dLon:0,eot:0};
    tzNote=`<p style="margin-top:8px;color:var(--muted);font-size:12px">未启用真太阳时校正：按录入时辰直接计算（以钟表时间为准，不按经度/时差微调）。</p>`;
    solar=Solar.fromYmdHms(y,m,day,h,0,0);
  }
  const lunar=solar.getLunar();
  const ec=lunar.getEightChar();
  if(lateZi) ec.setSect(1);   // 晚子时流派：23点后日柱按次日（默认按当天）
  const pillars=[ec.getYear(),ec.getMonth(),ec.getDay(),ec.getTime()];
  let yunDz=[], ciY=-1;
  const yearZhi=pillars[0].charAt(1);
  const wx=[ec.getYearWuXing(),ec.getMonthWuXing(),ec.getDayWuXing(),ec.getTimeWuXing()];
  const ss=[ec.getYearShiShenGan(),ec.getMonthShiShenGan(),ec.getDayShiShenGan(),ec.getTimeShiShenGan()];
  const ny=pillars.map(g=>NA_YIN_60[g]||'');
  // 五行统计（干1 + 支藏干加权 本气1/中气0.5/余气0.25，取代原先干支各一字）
  const wu={金:0,木:0,水:0,火:0,土:0};
  pillars.forEach(gz=>{
    wu[GAN_WU[gz.charAt(0)]]+=1;
    (CANG_GAN[gz.charAt(1)]||[]).forEach((g,j)=>{ wu[GAN_WU[g]]+=j===0?1:j===1?0.5:0.25; });
  });
  // ★ 真实旺衰喜用（共享引擎 baziStrength；八字面板用校正后时辰重算，与盘面一致）
  const bs=baziStrength(tc.y,tc.m,tc.day,tc.h,lateZi);
  const dayGan=bs.dayGan, dayWu=bs.dayWu, score=bs.score, qiang=bs.qiang, level=bs.level||qiang, yongWu=bs.yongWu, yongUniq=bs.yongUniq, jiUniq=bs.jiUniq;
  const sx=lunar.getYearShengXiao();
  const yongDesc = level==='身强'||level==='偏强' ? '克·泄·耗（官杀·财星·食伤）' : level==='身弱'||level==='偏弱' ? '生·扶（印星·比劫）' : '调候·通关（依寒暖燥湿取用，兼看岁运引动）';
  if(hourUnknown) tzNote+='<p style="margin-top:6px;color:var(--bad);font-size:12px">⚠ 时辰不详：已按<b>午时（11:00-12:59）</b>试推，四柱/旺衰/大运均为该时辰之下限估计，如知时辰请回填后再看。</p>';
  if(h===23) tzNote+='<p style="margin-top:6px;color:var(--muted);font-size:12px">晚子时（23:00-23:59）：日柱'+(lateZi?'已按<b>次日</b>（晚子时流派）':'按<b>当天</b>（子平通行）')+'归属；可勾选"晚子时按次日算"切换流派对比。</p>';
  // ★ 全局落地：真实旺衰喜用/忌，供幸运色·解梦等本命视角消费（取代扶抑近似）
  window.__baziDayGan=dayGan; window.__baziDayWu=dayWu;
  window.__baziQiang=qiang; window.__baziYong=yongUniq; window.__baziJi=jiUniq;
  window.__userDayGan=dayGan; window.__userDayWu=dayWu;   // 向后兼容旧联动
  // 月令定格（子平格局法：以月支本气对应十神定格局）
  const monthZhi=pillars[1].charAt(1);
  const monthGe=shiShen(dayGan, DZ_BENQI[monthZhi]);
  // 大运（每步干支 + 十神 + 约X岁起；getStartYear 返回起运岁数，勿当年份拼日期）
  let yunHtml=''; let baziSent='平';
  try{
    const yun=ec.getYun(gender==='男'?1:0,1);
    const qy=yun.getStartYear()||0;                     // 起运岁数
    const da=yun.getDaYun();
    let arr=[];
    da.forEach((p,i)=>{ const gz=p.getGanZhi(); if(!gz) return;
      const sh=shiShen(dayGan,gz.charAt(0));
      const dsh=shenOf(dayGan,yearZhi,gz.charAt(1));
      arr.push(`<span class="pill"><b>${gz}</b><br><span style="color:var(--gold2);font-size:12px">${sh}</span><br><span style="color:var(--muted);font-size:11px">约${qy+i*10}岁起</span>${dsh.length?`<br><span style="color:var(--gold-soft);font-size:10.5px">神煞 ${dsh.join(' ')}</span>`:''}</span>`);
      yunDz.push(gz.charAt(1));
    });
    /* 大运时间轴（③ 差异化）：横轴年龄，高亮当前大运 + 生克吉凶着色 */
    const sc2=w=>{ if(w===dayWu)return .6; if(SHENG[w]===dayWu)return 1; if(SHENG[dayWu]===w)return -.7; if(KE[dayWu]===w)return -.5; if(KE[w]===dayWu)return -.3; return 0; };
    const nowY=new Date(); let ageY=nowY.getFullYear()-y; const bdY=new Date(nowY.getFullYear(),m-1,day); if(nowY<bdY) ageY--;
    ciY=-1; if(ageY>=qy){ ciY=Math.floor((ageY-qy)/10); if(ciY>da.length-1) ciY=da.length-1; }
    const TLW=560, pad=16, n=Math.min(da.length,8), segW=(TLW-pad*2)/n;
    let tl=`<svg viewBox="0 0 ${TLW} 88" style="width:100%;height:auto;display:block;margin-top:6px" role="img" aria-label="大运时间轴">`;
    tl+=`<line x1="${pad}" y1="42" x2="${TLW-pad}" y2="42" stroke="var(--line)" stroke-width="2"/>`;
    for(let i=0;i<n;i++){ const gz=da[i].getGanZhi(); if(!gz) continue;
      const x=pad+i*segW, w1=GAN_WU[gz.charAt(0)], w2=DZ_WU[gz.charAt(1)], s=sc2(w1)+sc2(w2);
      const col=s>=0.15?'var(--good)':s<=-0.15?'var(--bad)':'var(--muted)';
      const cur=i===ciY;
      tl+=`<g><rect x="${(x+2).toFixed(1)}" y="${cur?16:22}" width="${(segW-4).toFixed(1)}" height="${cur?42:32}" rx="6" fill="${cur?'var(--glass-strong)':'var(--surface-2)'}" stroke="${cur?col:'var(--line)'}" stroke-width="${cur?2:1}"/>`;
      tl+=`<text x="${(x+segW/2).toFixed(1)}" y="${cur?36:39}" fill="var(--ink)" font-size="12" text-anchor="middle" font-family="serif">${gz}</text>`;
      tl+=`<text x="${(x+segW/2).toFixed(1)}" y="52" fill="var(--muted)" font-size="9.5" text-anchor="middle">${shiShen(dayGan,gz.charAt(0))}</text></g>`;
      tl+=`<text x="${(x+segW/2).toFixed(1)}" y="72" fill="var(--muted)" font-size="9" text-anchor="middle">${qy+i*10}岁</text>`;
    }
    if(ciY>=0 && da[ciY]) tl+=`<text x="${TLW/2}" y="84" fill="var(--ink-soft)" font-size="10" text-anchor="middle">▲ 当前约 ${ageY} 岁 · 正行 ${da[ciY].getGanZhi()} 大运</text>`;
    tl+=`</svg>`;
    if(ciY>=0 && da[ciY]){ const gz2=da[ciY].getGanZhi(); const s2=sc2(GAN_WU[gz2.charAt(0)])+sc2(DZ_WU[gz2.charAt(1)]); baziSent=s2>0.15?'吉':s2<-0.15?'凶':'平'; }
    yunHtml=`<div style="margin-top:10px"><div style="color:var(--muted);font-size:12px;margin-bottom:2px">起运：约<b style="color:var(--gold2)">${qy}</b>岁（${yun.isForward()?'顺排':'逆排'}）· 大运时间轴</div>${tl}<div style="margin-top:6px">${arr.slice(0,8).join('')}</div></div>`;
  }catch(e){ yunHtml=''; }
  /* 人生 K 线（rili-bazi 借鉴：十大运五行强弱蜡烛图） */
  let kline='';
  try{
    const yun2=ec.getYun(gender==='男'?1:0,1);
    const da2=yun2.getDaYun();
    const gzL=[]; da2.forEach((p,i)=>{ if(i<10){ const gz=p.getGanZhi(); if(gz) gzL.push(gz); } });
    if(gzL.length){
      const WU_COL={'金':'#b8a878','木':'#9aab95','水':'#9aa6b0','火':'#c29a90','土':'#b3a78f'};
      const sc=w=>{ if(w===dayWu)return .6; if(SHENG[w]===dayWu)return 1; if(SHENG[dayWu]===w)return -.7; if(KE[dayWu]===w)return -.5; if(KE[w]===dayWu)return -.3; return 0; };
      const st=gzL.map(gz=>{ const w1=GAN_WU[gz.charAt(0)],w2=DZ_WU[gz.charAt(1)]; return {gz,s:+(sc(w1)+sc(w2)).toFixed(2),w:w1}; });
      const lim=Math.max(Math.abs(Math.min(...st.map(x=>x.s),-2)),Math.abs(Math.max(...st.map(x=>x.s),2)),1);
      const W=46,H=120,base=H/2,pad=12;
      const yOf=s=>base-(s/lim)*(H/2-pad);
      let candles='',lbls='';
      st.forEach((x,i)=>{ const x0=pad+i*W,cxk=x0+W/2,y=yOf(x.s); const col=x.s>=0?'#5fae5f':'#c24234'; const top=Math.min(y,base),bot=Math.max(y,base);
        candles+=`<line x1="${cxk}" y1="${top}" x2="${cxk}" y2="${bot}" stroke="${col}" stroke-width="2"/>`;
        candles+=`<rect x="${x0+9}" y="${top.toFixed(1)}" width="${W-18}" height="${Math.max(3,bot-top).toFixed(1)}" fill="${WU_COL[x.w]}" opacity=".85" rx="2"/>`;
        lbls+=`<text x="${cxk}" y="${H+12}" fill="var(--r-muted)" font-size="9" text-anchor="middle">${x.gz}</text>`;
        lbls+=`<text x="${cxk}" y="${(top-4).toFixed(1)}" fill="${col}" font-size="9" text-anchor="middle">${x.s>0?'+':''}${x.s}</text>`; });
      /* 运盘同屏：在 K 线上标出"今"所在大运 + 当年太岁神煞竖标（呼应紫微流年落宫） */
      let nowMark='',taiMark='';
      try{
        const now=new Date(); let age=now.getFullYear()-y; const bd=new Date(now.getFullYear(),m-1,day); if(now<bd) age--;
        const qyM=yun2.getStartYear()||0; let ci=-1; if(age>=qyM){ ci=Math.floor((age-qyM)/10); if(ci>st.length-1) ci=st.length-1; }
        if(ci>=0){ const cxk=pad+ci*W+W/2;
          nowMark=`<line x1="${cxk}" y1="0" x2="${cxk}" y2="${H}" stroke="var(--r-gold)" stroke-width="1.4" stroke-dasharray="4 3"/>`+
                   `<text x="${cxk}" y="9" fill="var(--r-gold)" font-size="10" text-anchor="middle">今</text>`;
          const tgz=yearGZ_LC(now.getFullYear()); const tsh=shenOf(dayGan,yearZhi,tgz.charAt(1));
          taiMark=`<text x="${cxk}" y="${H+30}" fill="var(--r-gold-soft)" font-size="9.5" text-anchor="middle">太岁${tgz}${tsh.length?'·'+tsh.join(''):''}</text>`;
        }
      }catch(e){}
      kline=`<div style="margin-top:12px"><div style="color:var(--r-muted);font-size:12px;margin-bottom:4px">人生 K 线（十大运 · 干支对日主${dayGan}的生扶/克泄强弱；绿强红弱；朱砂虚线为「今」所在大运，其下标注本年太岁）</div><svg width="${pad+gzL.length*W}" height="${H+34}" viewBox="0 0 ${pad+gzL.length*W} ${H+34}" style="max-width:100%">${nowMark}${candles}${lbls}${taiMark}<line x1="${pad}" y1="${base}" x2="${pad+gzL.length*W}" y2="${base}" stroke="var(--r-gold)" stroke-dasharray="3 3" opacity=".4"/></svg></div>`;
    }
  }catch(e){ kline=''; }
  // 流年（以立春为界，当前流年起 8 年；逐年干支 + 十神 + 神煞，真算）
  let liunianHtml='';
  let liuGZ='';
  try{
    const now=new Date();
    const lcThis=liChunOf(now.getFullYear());
    const lcDate = lcThis ? new Date(lcThis.getYear(),lcThis.getMonth()-1,lcThis.getDay()) : null;
    const cy = (lcDate && now < lcDate) ? now.getFullYear()-1 : now.getFullYear();   // 当前流年所在年（立春为界）
    liuGZ=yearGZ_LC(cy);
    const lcNow=Solar.fromYmd(now.getFullYear(),now.getMonth()+1,now.getDate()).getLunar();
    const curMGZ=lcNow.getMonthInGanZhi();
    const curDGZ=lcNow.getDayInGanZhi();
    let rows=[];
    for(let i=0;i<8;i++){
      const yr=cy+i;
      const gz=yearGZ_LC(yr);
      const tg=gz.charAt(0);
      const ssr=shiShen(dayGan,tg);
      const lsh=shenOf(dayGan,yearZhi,gz.charAt(1));
      rows.push(`<span class="pill${i===0?' tai-sui':''}"><b>${yr}</b> ${gz}<br><span style="color:var(--muted);font-size:12px">${ssr}</span>${lsh.length?`<br><span style="color:var(--gold-soft);font-size:10px">${lsh.join(' ')}</span>`:''}${i===0?`<br><span style="color:var(--r-gold-soft);font-size:10px">流月 ${curMGZ} · 流日 ${curDGZ}</span> ★本年太岁`:''}</span>`);
    }
    liunianHtml=`<div style="margin-top:10px"><div style="color:var(--muted);font-size:12px;margin-bottom:4px">流年（${cy}起 · 立春为界，十神 + 神煞以日主${dayGan}为基准）</div>${rows.join('')}<div style="color:var(--r-muted);font-size:11px;margin-top:4px">当前流月 <b style="color:var(--r-gold-soft)">${curMGZ}</b> · 流日 <b style="color:var(--r-gold-soft)">${curDGZ}</b>（与紫微盘流月/流日所临之宫呼应）</div></div>`;
  }catch(e){ liunianHtml=''; }
  // 生肖犯太岁 + 太岁·紫微盘呼应
  let taiHtml='';
  try{
    const taiZhi=liuGZ?liuGZ.charAt(1):Solar.fromYmd(new Date().getFullYear(),1,1).getLunar().getYearZhi();
    const zodiZhi=ZODIAC_ZHI[sx];
    taiHtml=`<p style="margin-top:10px">生肖 <b style="color:var(--gold2)">${sx}（${zodiZhi}）</b> ｜ 本年太岁 <b style="color:var(--gold2)">${liuGZ||taiZhi}</b>（${taiZhi}）：${taiSuiRel(zodiZhi,taiZhi)}</p>`;
    if(liuGZ) taiHtml+=`<p style="color:var(--muted);font-size:12px;margin-top:6px">本年太岁 <b style="color:var(--gold2)">${liuGZ}</b> 在紫微斗数盘「太岁入宫」处有朱砂框标注——可对照查看流年落点。</p>`;
  }catch(e){ taiHtml=''; }
  // 旬空（空亡，lunar 真实推算）
  let xkHtml='';
  try{
    const xkY=lunar.getYearXunKong(),xkM=lunar.getMonthXunKong(),xkD=lunar.getDayXunKong();
    xkHtml=`<span class="tag">旬空 · 年${xkY||'—'} 月${xkM||'—'} 日${xkD||'—'}</span>`;
  }catch(e){ xkHtml=''; }
  // 神煞（传统口诀真算：天乙/文昌/禄神/羊刃/桃花/驿马/华盖）
  let shenHtml='';
  try{
    const pzList=[...pillars].map(g=>g.charAt(1));
    const ss=shenSha(dayGan,pzList[0],pzList);
    if(ss.length) shenHtml=`<p style="margin-top:8px">神煞：<b style="color:var(--gold2)">${ss.join(' · ')}</b></p>`;
  }catch(e){ shenHtml=''; }
  // 最佳大运（五行对日主生扶评分最高的一步，白话点睛）
  let bestYun='';
  try{
    const yun3=ec.getYun(gender==='男'?1:0,1);
    const qy0=yun3.getStartYear()||0;
    const sc2=w=>{ if(w===dayWu)return .6; if(SHENG[w]===dayWu)return 1; if(SHENG[dayWu]===w)return -.7; if(KE[dayWu]===w)return -.5; if(KE[w]===dayWu)return -.3; return 0; };
    let best=null,bi=-1;
    yun3.getDaYun().forEach((p,i)=>{ if(i>=8)return; const gz=p.getGanZhi(); if(!gz)return;
      const s=sc2(GAN_WU[gz.charAt(0)])+sc2(DZ_WU[gz.charAt(1)]);
      if(!best||s>best.s){ best={s,gz,sh:shiShen(dayGan,gz.charAt(0))}; bi=i; } });
    if(best&&bi>=0) bestYun='大运中较顺的一段,是约'+(qy0+bi*10)+'岁起的'+best.gz+'运('+best.sh+'),可提前布局、顺势而为。';
  }catch(e){ bestYun=''; }
  // 白话解读段（基于真实盘面参数）
  let readHtml='';
  try{
    const pzL=[...pillars].map(g=>g.charAt(1));
    const yunDzNow=yunDz.slice(0,8);
    const liuZhiNow=(typeof liuGZ!=='undefined'&&liuGZ)?liuGZ.charAt(1):'';
    const xchHtml=baziYingQi(pzL,yunDzNow,liuZhiNow,ciY,qiang,yongUniq,dayGan);
    const reads=baziRead(dayGan,qiang,wu,yongUniq,shenSha(dayGan,pzL[0],pzL),ss,monthGe,bestYun,monthZhi,ny[0],xchHtml,level);
    readHtml='<h4>白话解读</h4>'+reads.map(r=>'<p>'+wrapTerms(r)+'</p>').join('')+'<p style="color:var(--muted);font-size:12px;margin-top:6px">* 解读由你的真实盘面参数生成;命是参考,日子还得自己过。</p>';
  }catch(e){ readHtml=''; }
  /* 场景化解读（⑤ 差异化）：围绕所选问题聚合并用真实盘面参数 */
  let sceneHtml='';
  if(sceneVal && sceneVal!=='all'){
    const arr2=Object.entries(wu).sort((a,b)=>a[1]-b[1]); const least2=arr2[0], most2=arr2[4];
    // 六问判词去模板：种子加宽（四柱+强弱+喜用+最旺最弱五行+月令格局），并按场景独立偏移，避免各问撞同一变体
    const _sh=_hashStr(pillars.join('')+'|'+qiang+'|'+yongUniq.join('')+'|'+least2[0]+most2[0]+'|'+(monthGe||''));
    const _sPick=(a,k)=>a[(_sh+_hashStr(k))%a.length];
    const _hasSS=(x)=>!!ss&&ss.indexOf(x)>=0;
    const _yqStr=yongUniq.join(' / ');
    const _ZWs={'子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水'};
    const _dayZhi=(pillars[2]||'').charAt(1)||'';
    const SCENE={
      career:{t:'事业 · 功名',b:()=>{
        const _v=[
          `说事业，你是 <b>${dayGan}（${dayWu}）</b> 日主、<b>${qiang}</b> 之格——${qiang==='身强'?'能扛事就别闲着，挑大梁、开新局最出彩，越靠前越有劲':'得借台唱戏，跟对平台、稳扎稳打，别逞强单干'}；行业方位多往 <b>${_yqStr}</b> 上靠，顺手些。`,
          `<b>${dayGan}</b> 坐 <b>${dayWu}</b>，命局 <b>${qiang}</b>。职场路子${qiang==='身强'?'宜主攻、宜担纲，副手位待久了憋屈':'宜借力、宜抱团，硬闯反吃亏'}；手边事多沾点 <b>${_yqStr}</b> 的气，事儿好推。`,
          `论功名，<b>${dayGan}（${dayWu}）</b>、<b>${qiang}</b>。你${qiang==='身强'?'不怕压就怕荒——手上有硬活肩上有担子时最亮眼':'不怕慢就怕孤——有靠山有体系带时最稳'}；日常往 <b>${_yqStr}</b> 靠，添的是势不是运。`,
          `把事业拆开看：日主 <b>${dayGan}</b>、身 <b>${qiang}</b>。${qiang==='身强'?'你适合当那个拍板的人，位子越核心越能发力':'你适合当那个被需要的人，站对队比个人英雄重要'}；<b>${_yqStr}</b> 这几个五行，多亲近总没错。`];
        const _guan=_hasSS('正官')||_hasSS('七杀');
        const _yin=_hasSS('正印')||_hasSS('偏印');
        const _ev=_guan
          ? `四柱<b>官杀现</b>——名分与约束皆有，走有规章、可考核、能论资历的路子更易被认可${_yin?'，且印星同现、官印相生，宜靠资质文书（学历、职称、牌照）叠加筹码':'，惟印星不显，宜补文凭资历以承其名'}`
          : `四柱<b>官杀不显</b>——现成台阶少、自由度大，宜凭本事与作品立名${_hasSS('食神')||_hasSS('伤官')?'，食伤在局、正合技术／内容／手艺路线，作品即名分':'，宜自建可验证的成果清单代替头衔'}`;
        return _sPick(_v,'career')+_ev+'。'+(bestYun||'');
      }},
      love:{t:'感情 · 姻缘',b:()=>{
        const _v=[
          `感情这事，<b>${dayGan}</b> 日主、<b>${qiang}</b> 之格——${qiang==='身强'?'你气场强，别把「我为你好」演成「你得听我」，退半步更近':'你容易过度体察对方，自己的需求先说清，关系才稳'}；相处里多些 <b>${_yqStr}</b> 的小确幸（同好色调、共赴方位），情谊绵长。`,
          `<b>${dayGan}</b> 为身、命局 <b>${qiang}</b>。情路上${qiang==='身强'?'你来我往留三分，占有不是深情':'你先安顿好自己，才有力气经营'}；<b>${_yqStr}</b> 之气多亲近，气顺则情顺。`,
          `说姻缘，<b>${dayGan}</b> 日主、<b>${qiang}</b> 之身。${qiang==='身强'?'你是出力那方，出力不等于做主，给对方留分寸':'你是省心那方，但顺从不是经营，该表达时别省'}；日常往 <b>${_yqStr}</b> 靠，养的是和气。`,
          `亲密关系里你 <b>${dayGan}（${dayWu}）</b>、<b>${qiang}</b>。${qiang==='身强'?'宜以柔化刚、多听少断':'宜给对方便利与空间，少内耗'}；<b>${_yqStr}</b> 这几个五行，相处时多点，默契自生。`];
        const _pei = gender==='男' ? (_hasSS('正财')||_hasSS('偏财')) : (_hasSS('正官')||_hasSS('七杀'));
        const _peiName = gender==='男' ? '财星' : '官星';
        const _ev = _pei
          ? `盘中<b>${_peiName}现</b>（${gender==='男'?'男以财为妻':'女以官为夫'}）——配偶信息明朗、遇合之机不缺，重在识人与经营，不缺缘只缺筛选`
          : `盘中<b>${_peiName}未透</b>（${gender==='男'?'男以财为妻':'女以官为夫'}）——姻缘偏含藏，多由熟人圈、日常共事中渐生，宜主动扩圈、给缘分留出口`;
        const _pz = _dayZhi ? `；日支 <b>${_dayZhi}</b> 为配偶宫，其气属<b>${_ZWs[_dayZhi]||'—'}</b>，${yongUniq.indexOf(_ZWs[_dayZhi])>=0?'恰为你的喜用——伴侣多能补你所缺，是助力型缘分':'非你的喜用——相处需更多磨合与体谅，忌以对错论亲疏'}` : '';
        return _sPick(_v,'love')+_ev+_pz+'。';
      }},
      study:{t:'学业 · 进修',b:()=>{
        const _v=[
          `读书这回事，<b>${dayWu}</b> 日主、身 <b>${qiang}</b>。${qiang==='身强'?'吃得住强度，怕没方向乱使劲——先定个够难的靶子':'吃不住突击硬熬，怕断节奏——每天少点别停'}；案头近 <b>${_yqStr}</b> 之气，提神也静心。`,
          `<b>${dayWu}</b> 为身、<b>${qiang}</b> 之局。求学${qiang==='身强'?'宜攻难关、定靶心、一鼓作气':'宜稳节奏、重积累、小步快走'}；学习环境多取 <b>${_yqStr}</b>，事半功倍。`,
          `论进修，<b>${dayWu}</b> 日主、命局 <b>${qiang}</b>。${qiang==='身强'?'适合高压快跑（集训、赛制、限时任务）':'适合长线滴灌（打卡、复盘、小测反馈）'}；作息案头往 <b>${_yqStr}</b> 靠，顺。`,
          `把学业拆开：日主 <b>${dayWu}</b>、身 <b>${qiang}</b>。${qiang==='身强'?'精力足宜挑战深耕、定目标冲':'宜节律作息、循序渐进、积小成大'}；<b>${_yqStr}</b> 之气近一近，专注记忆都好些。`];
        const _yinS=_hasSS('正印')||_hasSS('偏印');
        const _shiS=_hasSS('食神')||_hasSS('伤官');
        const _ev = _yinS && _shiS
          ? `盘中<b>印星与食伤并见</b>——既能吸收又能输出，最适合「学完就讲出来／写出来」的路子，教学相长进步最快`
          : _yinS
            ? `盘中<b>印星现</b>——受教吸收力强，跟师、跟体系、考证考编这类有章法的学习最占优；惟宜防只输入不输出，记得动手实练`
            : _shiS
              ? `盘中<b>食伤现而印星不显</b>——表达与实作是你的长板，靠项目、作品、动手实践学得最快；死记硬背反而吃力，宜先做后学`
              : `盘中<b>印星食伤俱不显</b>——学习动能需靠外部结构撑起来，宜借班级、同伴、固定进度表制造推力，别指望纯自驱`;
        return _sPick(_v,'study')+_ev+'。';
      }},
      health:{t:'健康 · 身心',b:()=>{
        const _v=[
          `身态上，<b>${least2[0]}</b> 偏弱当养、<b>${most2[0]}</b> 偏旺宜疏；身 <b>${qiang}</b>，${qiang==='身强'?'气盛，规律动起来最相宜，别靠意志硬顶':'宜养气守静、别透支，多留白'}。`,
          `命里 <b>${most2[0]}</b> 一头独旺、<b>${least2[0]}</b> 一头偏枯——失衡处就是易累处；身 <b>${qiang}</b>，${qiang==='身强'?'能扛但易硬撑，强度放进固定节律里':'不宜跟人比强度，低强度高频次，先把睡眠稳住'}。`,
          `看身子：<b>${least2[0]}</b> 弱该补、<b>${most2[0]}</b> 旺该泄，一补一泄才平；命局 <b>${qiang}</b>，${qiang==='身强'?'越忙越有劲，但给身体设上限（睡够别熬）':'越熬越虚，恢复比训练更要紧（先睡好再谈锻炼）'}。`,
          `五行里 <b>${least2[0]}</b> 当养、<b>${most2[0]}</b> 当疏；身 <b>${qiang}</b>，${qiang==='身强'?'多动、规律锻炼最对路':'静养、勿过劳最妥当'}。`];
        const _ACT={'木':'宜舒展拉伸、多见绿意、早睡以养肝气，忌久坐憋闷与压抑情绪','火':'宜适度出汗、晒早太阳、少熬夜以安心神，忌情绪大起大落与夜宵重口','土':'宜规律三餐、饭后慢走、忌思虑过度与生冷暴食','金':'宜深呼吸与有氧、保持室内通风湿度，忌久处烟尘干燥与悲抑','水':'宜足量温水、护腰保暖、早睡以养肾气，忌久坐寒凉与过度耗神'};
        const _ev=`补 <b>${least2[0]}</b> 之法：${_ACT[least2[0]]||'宜作息规律'}；泄 <b>${most2[0]}</b> 之法：${(function(){var m={'木':'把冲劲用在运动上，别用在争执上','火':'降躁静心，减少刺激性娱乐与咖啡','土':'少囤积多流动，忌久卧久坐与过食','金':'松开控制欲，忌过度自律到紧绷','水':'节制夜思夜劳，忌泡在情绪与信息里'};return m[most2[0]]||'宜疏其有余';})()}`;
        return _sPick(_v,'health')+_ev+'。此乃传统命理之身态观，任何不适请以现代医学诊断为准。';
      }},
      wealth:{t:'财运 · 置业',b:()=>{
        const _cai=_hasSS('正财')||_hasSS('偏财');
        const _v=[
          `财路上，财星为 <b>${_cai?'显':'隐'}</b>、身 <b>${qiang}</b>。${qiang==='身强'?'能担财，主动求财置业无妨，但忌一次性重仓单一标的':'宜聚不宜散，先攒后投、忌加杠杆'}；理财多往 <b>${_yqStr}</b> 靠最稳。`,
          `论财，你财星${_cai?'透而可见':'藏而不露'}、身 <b>${qiang}</b>。${qiang==='身强'?'担得起大盘子，进取型配置无妨，杠杆是你最大风险源':'宜现金流与稳健积累，杠杆碰不得'}；财务决策取 <b>${_yqStr}</b> 之气为宜。`,
          `财这件事，命中财星${_cai?'现于四柱、路径清楚':'不透四柱、需自己开路'}，身 <b>${qiang}</b>。${qiang==='身强'?'适合主动出手（谈判、开源、置业），钱由你去挣':'适合被动积累（定投、存续、复利），钱等你去攒'}；近 <b>${_yqStr}</b> 则顺。`,
          `把财运拆开：身 <b>${qiang}</b>、财星${_cai?'明现':'潜藏'}。${qiang==='身强'?'能扛财、宜进取求财置业':'宜守成积财、忌冒进'}；钱财事多近 <b>${_yqStr}</b> 之气，最稳当。`];
        const _jie=_hasSS('比肩')||_hasSS('劫财');
        const _shi=_hasSS('食神')||_hasSS('伤官');
        let _ev='';
        if(_cai && _shi) _ev=`且<b>食伤生财</b>——以本事、手艺、内容变现最顺，靠技能换钱比靠关系换钱稳`;
        else if(_cai && !_shi) _ev=`惟<b>财现而食伤不显</b>——财来自现成渠道（岗位、家业、既有资源），宜守住渠道、别轻易换轨`;
        else if(!_cai && _shi) _ev=`虽<b>财星不透，然食伤在局</b>——先有输出后有财，宜把作品／技能做厚，财自随之`;
        else _ev=`<b>财星与食伤俱不显</b>——不宜指望横财与快钱，宜靠稳定职务与长期储蓄立本`;
        const _jj=_jie?`；命带<b>${_hasSS('劫财')?'劫财':'比肩'}</b>，有分财之象——合伙、借贷、共同账户须先立规矩写清楚，最忌口头合作与代持`:`；比劫不显，财不易被分，惟亦少人助力，凡事多需自筹`;
        return _sPick(_v,'wealth')+_ev+_jj+'。';
      }}
    };
    const _sc=SCENE[sceneVal]; if(_sc) sceneHtml=`<div class="scene-read"><h4>${_sc.t}</h4><p>${_sc.b()}</p></div>`;
  }
  // 四柱展示（干支 + 五行纳音 + 十神 + 藏干十神，专业盘面可核验）
  const labels=['年柱','月柱','日柱','时柱'];
  // 圆形命盘（四柱四宫 · 日主居中：上=年 右=月 下=日 左=时，外环五行色弧 + 干支环 + 十神环）
  const bzDiscHtml='<div class="bz-disc-wrap">'+baziDisc(pillars, ss, wx, dayGan, dayWu)+'</div>';
  let bz=bzDiscHtml+'<div class="bz">';
  pillars.forEach((gz,i)=>{
    const cg=CANG_GAN[gz.charAt(1)]||[];
    const cgTxt=cg.map(c=>c+'('+shiShen(dayGan,c)+')').join(' ');
    const isDay=i===2;
    bz+=`<div class="bzcol${isDay?' day':''}">
      <div class="bz-lbl">${labels[i]}</div>
      <div class="gz">${gz}</div>
      <div class="wx">${wx[i]} · ${ny[i]}</div>
      <div class="bz-ss">${ss[i]}</div>
      <div class="bz-cg">藏 ${cgTxt||'—'}</div>
    </div>`;
  });
  bz+='</div>';
  // 五行强弱条形（按各元素出现次数比例填充，最强者满格；借鉴 fortune-h5 运势评分动画）
  const wxc=[['金','#b8a878'],['木','#9aab95'],['水','#9aa6b0'],['火','#c29a90'],['土','#b3a78f']];
  const maxN=Math.max(...Object.values(wu),1);
  let bar='<div class="wxbar">';
  wxc.forEach(([k,c])=>{ const n=Math.round(wu[k]*10)/10; const pct=Math.round(n/maxN*100); bar+=`<div class="wxrow"><span class="wxk">${k}</span><div class="wxtrack"><div class="wxfill" style="background:${c};--w:${pct}%"></div></div><span class="wxn">${n}</span></div>`; });
  bar+='</div>';
  /* 五行环形图（比例环：金木水火土各占扇区 + 中心最强五行；与雷达（形状）/条形（强度）互补） */
  const WCOLR=Object.fromEntries(wxc);
  const wk=wxc.map(x=>x[0]);
  const wTot=wk.reduce((a,k)=>a+wu[k],0)||1;
  const cR=46,cC=56,circ=2*Math.PI*cR; let _off=0,wsegs='';
  wk.forEach(k=>{ const len=wu[k]/wTot*circ; wsegs+=`<circle cx="${cC}" cy="${cC}" r="${cR}" fill="none" stroke="${WCOLR[k]||'#b3a78f'}" stroke-width="12" stroke-dasharray="${len.toFixed(2)} ${(circ-len).toFixed(2)}" stroke-dashoffset="${(-_off).toFixed(2)}" transform="rotate(-90 ${cC} ${cC})"/>`; _off+=len; });
  const wMaxK=wk.reduce((m,k)=>wu[k]>wu[m]?k:m,'金');
  const wuRing=`<div style="display:flex;justify-content:center;align-items:center;margin:4px 0 2px"><svg width="112" height="112" viewBox="0 0 ${cC*2} ${cC*2}"><circle cx="${cC}" cy="${cC}" r="${cR}" fill="none" stroke="var(--gold)" stroke-opacity=".12" stroke-width="12"/>${wsegs}<text x="${cC}" y="${cC-2}" text-anchor="middle" font-size="14" fill="var(--gold-soft)" font-family="var(--serif)" font-weight="700">${wMaxK}</text><text x="${cC}" y="${cC+14}" text-anchor="middle" font-size="10" fill="var(--muted)">最旺 ${Math.round(wu[wMaxK]*10)/10}</text></svg><div style="color:var(--muted);font-size:11px;text-align:center;margin-left:6px">五行<br>占比</div></div>`;
  /* 五行雷达图（rili-bazi 借鉴：条形 → 雷达五边形） */
  const wkeys=['金','木','水','火','土'];
  const maxW=Math.max(...wkeys.map(k=>wu[k]),1);
  const rcx=70,rcy=70,rR=52, ang=k=>(-90+k*72)*Math.PI/180;
  let rgrid='',raxis='',rlab='';
  for(let g=1;g<=4;g++){ const rr=rR*g/4; const p=wkeys.map((k,i)=>`${(rcx+rr*Math.cos(ang(i))).toFixed(1)},${(rcy+rr*Math.sin(ang(i))).toFixed(1)}`).join(' '); rgrid+=`<polygon points="${p}" fill="none" stroke="var(--gold)" stroke-opacity=".18"/>`; }
  wkeys.forEach((k,i)=>{ const x2=rcx+rR*Math.cos(ang(i)),y2=rcy+rR*Math.sin(ang(i)); raxis+=`<line x1="${rcx}" y1="${rcy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--gold)" stroke-opacity=".22"/>`; const lx=rcx+(rR+14)*Math.cos(ang(i)),ly=rcy+(rR+14)*Math.sin(ang(i)); rlab+=`<text x="${lx.toFixed(1)}" y="${(ly+4).toFixed(1)}" fill="var(--muted)" font-size="11" text-anchor="middle">${k} ${Math.round(wu[k]/maxW*100)}%</text>`; });
  const rpts=wkeys.map((k,i)=>{ const r=rR*(wu[k]/maxW); return `${(rcx+r*Math.cos(ang(i))).toFixed(1)},${(rcy+r*Math.sin(ang(i))).toFixed(1)}`; }).join(' ');
  const radar=`<div style="display:flex;justify-content:center;align-items:center;margin:6px 0 2px"><svg width="140" height="140" viewBox="0 0 140 140">${rgrid}${raxis}<polygon points="${rpts}" fill="var(--gold)" fill-opacity=".28" stroke="var(--gold)" stroke-width="1.5"/>${rlab}</svg><div style="color:var(--muted);font-size:11px;text-align:center;margin-left:6px">五行<br>雷达</div></div>`;
  /* 十神分布（④ 差异化）：四柱天干十神 → 五类占比雷达 */
  const SG_MAP={'比肩':'比劫','劫财':'比劫','食神':'食伤','伤官':'食伤','正财':'财','偏财':'财','正官':'官杀','七杀':'官杀','正印':'印','偏印':'印'};
  const sgCnt={'比劫':0,'食伤':0,'财':0,'官杀':0,'印':0};
  ss.forEach(s=>{ const g=SG_MAP[s]; if(g) sgCnt[g]++; });
  const sgK=['比劫','食伤','财','官杀','印']; const maxSG=Math.max(...sgK.map(k=>sgCnt[k]),1);
  const scx=70,scy=70,sR=52, ang5=k=>(-90+k*72)*Math.PI/180;
  let sgGrid='',sgAxis='',sgLab='';
  for(let g=1;g<=4;g++){ const rr=sR*g/4; const p=sgK.map((k,i)=>`${(scx+rr*Math.cos(ang5(i))).toFixed(1)},${(scy+rr*Math.sin(ang5(i))).toFixed(1)}`).join(' '); sgGrid+=`<polygon points="${p}" fill="none" stroke="var(--ink)" stroke-opacity=".14"/>`; }
  sgK.forEach((k,i)=>{ const x2=scx+sR*Math.cos(ang5(i)),y2=scy+sR*Math.sin(ang5(i)); sgAxis+='<line x1="'+scx+'" y1="'+scy+'" x2="'+x2.toFixed(1)+'" y2="'+y2.toFixed(1)+'" stroke="var(--ink)" stroke-opacity=".16"/>'; const lx=scx+(sR+14)*Math.cos(ang5(i)),ly=scy+(sR+14)*Math.sin(ang5(i)); sgLab+='<text x="'+lx.toFixed(1)+'" y="'+(ly+4).toFixed(1)+'" fill="var(--muted)" font-size="11" text-anchor="middle">'+k+' '+sgCnt[k]+'</text>'; });
  const sgPts=sgK.map((k,i)=>{ const r=sR*(sgCnt[k]/maxSG); return `${(scx+r*Math.cos(ang5(i))).toFixed(1)},${(scy+r*Math.sin(ang5(i))).toFixed(1)}`; }).join(' ');
  const tenGod=`<div style="display:flex;justify-content:center;align-items:center;margin:6px 0 2px"><svg width="140" height="140" viewBox="0 0 140 140">${sgGrid}${sgAxis}<polygon points="${sgPts}" fill="var(--ink)" fill-opacity=".2" stroke="var(--ink)" stroke-width="1.5"/>${sgLab}</svg><div style="color:var(--muted);font-size:11px;text-align:center;margin-left:6px">十神<br>分布</div></div>`;
  /* ===== 命格星图 hero（视觉签名）：四柱八字 → 水墨星图 + 命格判词 ===== */
  const WCOL={金:'#b8a878',木:'#9aab95',水:'#9aa6b0',火:'#c29a90',土:'#b3a78f'};
  const SC_CX=280, SC_CY=232, SC_R12=200, SC_RS=126;
  // 确定性伪随机：同一命盘永远得到同一张星尘图案
  let _sd=0; for(const _c of pillars.join('')) _sd=(_sd*31+_c.charCodeAt(0))>>>0;
  const _rnd=()=>{ _sd=(_sd*1664525+1013904223)>>>0; return _sd/4294967296; };
  let scDust='<g class="sc-dust">';
  for(let i=0;i<54;i++){
    const a=_rnd()*Math.PI*2, rr=64+_rnd()*172;
    scDust+='<circle cx="'+(SC_CX+rr*Math.cos(a)).toFixed(1)+'" cy="'+(SC_CY+rr*Math.sin(a)).toFixed(1)+'" r="'+(0.6+_rnd()*1.5).toFixed(2)+'" fill="var(--ink)" opacity="'+(0.05+_rnd()*0.15).toFixed(2)+'"/>';
  }
  scDust+='</g>';
  // 外圈：十二地支刻度环，命局中出现的地支点亮
  const ZHI12=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const usedZhi=new Set(pillars.map(p=>p.charAt(1)));
  let scRing='<circle cx="'+SC_CX+'" cy="'+SC_CY+'" r="'+SC_R12+'" fill="none" stroke="var(--ink)" stroke-opacity=".13"/>';
  ZHI12.forEach((z,i)=>{
    const a=(-90+i*30)*Math.PI/180;
    const x=SC_CX+SC_R12*Math.cos(a), y=SC_CY+SC_R12*Math.sin(a);
    const on=usedZhi.has(z), col=WCOL[DZ_WU[z]]||'#b3a78f';
    scRing+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(on?9.5:4.5)+'" fill="'+(on?col:'none')+'" fill-opacity="'+(on?'.32':'0')+'" stroke="'+(on?col:'var(--ink)')+'" stroke-opacity="'+(on?'.78':'.22')+'" stroke-width="'+(on?1.3:1)+'"/>';
    const tx=SC_CX+(SC_R12+16)*Math.cos(a), ty=SC_CY+(SC_R12+16)*Math.sin(a);
    scRing+='<text class="sc-zhi" x="'+tx.toFixed(1)+'" y="'+(ty+3.6).toFixed(1)+'" text-anchor="middle" font-size="10.5" fill="'+(on?'var(--gold-soft)':'var(--muted)')+'" opacity="'+(on?1:.5)+'">'+z+'</text>';
  });
  // 内圈：八字星点（四柱各占一象限，干在前支在后）+ 与日主的生克连线
  const PILL_N=['年','月','日','时'];
  let scLink='', scStar='';
  pillars.forEach((gz,pi)=>{
    const base=-90+pi*90;
    [[gz.charAt(0),0,-18],[gz.charAt(1),1,18]].forEach(pair=>{
      const ch=pair[0], isZhi=pair[1], off=pair[2];
      const a=(base+off)*Math.PI/180;
      const x=SC_CX+SC_RS*Math.cos(a), y=SC_CY+SC_RS*Math.sin(a);
      const w=(isZhi?DZ_WU[ch]:GAN_WU[ch])||'土'; const col=WCOL[w]||'#b3a78f';
      let dash='', op=.5;
      if(w===dayWu){ op=.58; }
      else if(SHENG[w]===dayWu){ op=.52; }
      else if(SHENG[dayWu]===w){ dash='1.6 4'; op=.44; }
      else if(KE[dayWu]===w){ dash='6 4'; op=.44; }
      else { dash='3 3'; op=.48; }
      scLink+='<line x1="'+SC_CX+'" y1="'+SC_CY+'" x2="'+x.toFixed(1)+'" y2="'+y.toFixed(1)+'" stroke="'+col+'" stroke-opacity="'+op+'" stroke-width="1.2"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';
      const rr=14+Math.min(wu[w]||0,4)*1.8;
      scStar+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(rr+5).toFixed(1)+'" fill="none" stroke="'+col+'" stroke-opacity=".26"/>';
      scStar+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+rr.toFixed(1)+'" fill="'+col+'" fill-opacity=".22" stroke="'+col+'" stroke-opacity=".8" stroke-width="1.3"/>';
      scStar+='<text class="sc-gz" x="'+x.toFixed(1)+'" y="'+(y+5.6).toFixed(1)+'" text-anchor="middle" font-size="16" font-family="serif" fill="var(--ink)">'+ch+'</text>';
    });
    const la=base*Math.PI/180;
    const lx=SC_CX+166*Math.cos(la), ly=SC_CY+166*Math.sin(la);
    scStar+='<text class="sc-pillar" data-pillar="'+pi+'" x="'+lx.toFixed(1)+'" y="'+(ly+4).toFixed(1)+'" text-anchor="middle" font-size="10" fill="var(--gold-soft)">'+PILL_N[pi]+' '+(ss[pi]||'')+'</text>';
  });
  // 中心：日主主星
  const dcol=WCOL[dayWu]||'#b3a78f';
  const scCenter='<circle class="sc-core" cx="'+SC_CX+'" cy="'+SC_CY+'" r="54" fill="url(#scGlow)"/>'
    +'<circle cx="'+SC_CX+'" cy="'+SC_CY+'" r="38" fill="none" stroke="'+dcol+'" stroke-opacity=".3" stroke-dasharray="2 5"/>'
    +'<circle cx="'+SC_CX+'" cy="'+SC_CY+'" r="31" fill="'+dcol+'" fill-opacity=".26" stroke="'+dcol+'" stroke-width="1.8" stroke-opacity=".9"/>'
    +'<text class="sc-day" x="'+SC_CX+'" y="'+(SC_CY+10)+'" text-anchor="middle" font-size="29" font-family="serif" fill="var(--ink)">'+dayGan+'</text>'
    +'<text class="sc-day-sub" x="'+SC_CX+'" y="'+(SC_CY+58)+'" text-anchor="middle" font-size="10.5" fill="var(--muted)">日主 · '+dayWu+' · '+qiang+'</text>';
  const scDefs='<defs><radialGradient id="scGlow"><stop offset="0%" stop-color="'+dcol+'" stop-opacity=".38"/><stop offset="100%" stop-color="'+dcol+'" stop-opacity="0"/></radialGradient></defs>';
  /* 命格判词：日主意象 × 旺衰 × 主导十神 × 喜用 */
  let domSG='均衡', domN=0;
  sgK.forEach(k=>{ if(sgCnt[k]>domN){ domN=sgCnt[k]; domSG=k; } });
  if(domN<2) domSG='均衡';
  // 同人生辰稳定、异人不同句：用四柱哈希在变体里确定性选词，破解"模板化"
  const _bh=_hashStr(pillars.join(''));
  const GAN_V={
    '甲':{strong:['甲木参天，根深难摧——你天生有把事扛起来的力气，也天生学不会低头。','甲木为栋，立于风雨亦不折——你适合撑起局面，只是别把所有重量都揽上身。'],
          weak:['甲木初生，未及成材——你的心气比根基高，最忌在没长成时就被人当栋梁用。','甲木幼苗，需雨露扶持——你不是不行，是还差一点时运与托举，先扎根再言伸展。']},
    '乙':{strong:['乙木蔓生，柔韧缠绕——你看着好说话，其实极有主见，只是从不硬碰。','乙木盘枝，善借势而上——你不必正面强争，绕个弯反而把事做成。'],
          weak:['乙木藤萝，须依乔木——你不是没本事，是必须找对可攀附的那棵树。','乙木细柔，风过易摇——你敏感易受影响，先稳住自己的重心再谈进取。']},
    '丙':{strong:['丙火当空，光照万物——你走到哪里都会被看见，也因此从不缺被误解的机会。','丙火燎原，势不可挡——你一旦认准，便有把全场点燃的感染力。'],
          weak:['丙火薄云，光而不炽——你有照人的心，却常在最该发光时自我怀疑。','丙火将燃，需人添柴——你的热度要靠认可与舞台，缺了便黯一截。']},
    '丁':{strong:['丁火如烛，明而不耀——你的能量不在气势在耐力，能陪人走很长的夜路。','丁火入户，温润长明——你未必最亮，却最让人想靠近、想停留。'],
          weak:['丁火微明，易被风摇——你敏感、易累，最需要一个不被打扰的角落续命。','丁火将熄，须护其焰——你付出多却容易耗干，留三分给自己才烧得久。']},
    '戊':{strong:['戊土如城，厚重可依——你是别人的靠山，只是很少有人问你靠谁。','戊土筑台，众赖以立——你天生稳得住场，事交给你旁人就安心。'],
          weak:['戊土松浮，未成堤岸——你想稳，却总在快要扎根时被拔起。','戊土散沙，待聚成形——你底子不差，只是还少一道把碎片拢起来的工序。']},
    '己':{strong:['己土如田，能容能养——你擅长成全别人，也常把自己排在最后一位。','己土深耕，厚积成仓——你慢，但每一步都踩得实，收成在后来。'],
          weak:['己土瘠薄，力有不逮——你揽的事总比扛得动的多，学会拒绝就是转运。','己土待润，宜少贪多——你什么都想顾，结果样样浅，专一两项最划算。']},
    '庚':{strong:['庚金如钺，锋利刚断——你做决定比谁都快，代价是把人得罪在明处。','庚金铸锋，斩钉截铁——你认理不认情，成事利落，也少些纠缠。'],
          weak:['庚金未淬，钢而未刃——你的锐气还没被磨成本事，急着出鞘容易折。','庚金含芒，待磨方利——你底子硬，差的是一遍遍打磨与时机。']},
    '辛':{strong:['辛金如玉，贵而畏污——你对品质与体面极为在意，也因此格外怕被辜负。','辛金镂空，工巧天成——你天生懂细节与分寸，精工细活最见你长。'],
          weak:['辛金蒙尘，光待人拭——你的价值真实存在，只是还没遇到识货的人。','辛金微芒，需光方显——你不爱张扬，但被看见后才被人懂得珍贵。']},
    '壬':{strong:['壬水汪洋，奔流不息——你天生装得下变化，安稳反而让你不安。','壬水行舟，顺势千里——你越松手随势，反而走得越远越顺。'],
          weak:['壬水浅流，势不能远——你想法很多，缺的是让它们汇成河的那个坡度。','壬水散流，宜聚成渊——你兴趣太散，收拢到一两条主线才有纵深。']},
    '癸':{strong:['癸水如露，润物无声——你的影响力藏在细节里，很多人受过你的恩而不自知。','癸水穿石，柔能克刚——你不声不响，却常把最难的事慢慢磨开。'],
          weak:['癸水稀微，易被日晞——你太容易被消耗，护住自己的元气比什么都重要。','癸水将竭，宜蓄其源——你习惯性给到最后，先把自己灌满才能再予人。']}
  };
  const GAN_IMG={'甲':'参天之木','乙':'蔓生之木','丙':'中天之日','丁':'灯烛之火','戊':'城垣之土','己':'田园之土','庚':'斧钺之金','辛':'珠玉之金','壬':'江河之水','癸':'雨露之水'};
  const _gv=GAN_V[dayGan]||{strong:['',''],weak:['','']};
  const _gp=(qiang==='身弱'?_gv.weak:_gv.strong);
  const _gwi=_gp.length?(_bh%_gp.length):0;
  const mainV = qiang==='中和'
    ? (GAN_IMG[dayGan]||'')+'，气脉持中——你不必靠极端取胜，稳住节奏本身就是你的天赋。'
    : (_gp[_gwi]||'');
  const SG_V={
    '比劫':['命里比劫成群，你从不缺同行的人，缺的是分清谁在借你的势。','比劫林立，热闹却易争——身边人多是助力也是消耗，懂分寸才不被拖着走。'],
    '食伤':['食伤透出，才气藏不住——想法一冒头就想说出口，可话说在事成之前，最耗运。','食伤外显，灵气逼人——你天生会表达、会造东西，只是别让嘴快跑在事成前。'],
    '财':['财星围身，机会永远比时间多——你不是不会赚，是太容易被下一个机会拽走。','财气缠身，诱惑亦多——你擅长发现值钱的事，难在守住一个、做深做透。'],
    '官杀':['官杀当权，你这一生的贵人，往往先以对手的面目出现。','官杀压顶，逼你成器——压力即台阶，扛过去的人，格局是被磨出来的。'],
    '印':['印绶护身，凡事总有人替你兜底——福气是真的，惰性也是真的。','印星相生，受荫亦受缚——你多得照拂，却也容易赖在舒适里，少了点锋芒。'],
    '均衡':['五行不偏不倚，是少见的清局——顺境不骄、逆境不塌，慢就是你的快。','十神均衡，不偏不倚——你少有极端，稳中藏巧，最难得的恰恰是这份平。']
  };
  const YONG_V={
    '木':['近青绿、向东行，多与有生长性的人共事','多近草木青绿、往东方走，常和正在往上长的人待在一起。'],
    '火':['近赤色、向南行，多在人前发声、让人看见你','多靠近暖红、朝南而居，主动站出来、把存在感亮给人看。'],
    '土':['近黄褐、守其中，多做能沉淀下来的事','多待在厚实安稳处、守正中，做能留下来的、能沉淀的事。'],
    '金':['近素白、向西行，多做讲规矩与决断的事','多近素净、朝西而行，去做讲规则、要决断的硬事。'],
    '水':['近玄黑、向北行，多流动、多学习、多走动','多近幽蓝、向北流动，常学常走，让气息活起来。']
  };
  const SEAL={'比劫':'并肩者众','食伤':'锋芒在外','财':'财随缘至','官杀':'压中见贵','印':'得荫而生','均衡':'清而不偏'};
  const starChart='<div class="starchart">'
    +'<div class="sc-seal">'+(SEAL[domSG]||'清而不偏')+'</div>'
    +'<div class="sc-verdict"><p>'+mainV+'</p><p>'+(SG_V[domSG]?SG_V[domSG][_bh%SG_V[domSG].length]:'')+'</p>'
    +'<p class="sc-yong">补气之门在 <b>'+yongUniq.join(' / ')+'</b>：'+yongUniq.map(w=>(YONG_V[w]?YONG_V[w][_bh%YONG_V[w].length]:'')).filter(Boolean).join('；')+'。</p></div>'
    +'<svg class="sc-svg" viewBox="0 0 560 470" data-nofx="1" role="img" aria-label="命格星图">'
    +scDefs+scDust+scRing+scLink+scStar+scCenter+'</svg>'
    +'<div class="sc-legend"><span><i></i>同气 · 生我（比劫/印）</span><span><i class="l2"></i>我生 · 我克（食伤/财）</span><span><i class="l3"></i>克我（官杀）</span></div>'
    +'</div>';
  const strength=Math.max(6,Math.min(96, Math.round(50+Math.max(-45,Math.min(45,score))*0.8)));
  const ring=`<div class="luckring"><svg width="92" height="92" viewBox="0 0 92 92"><circle cx="46" cy="46" r="38" fill="none" stroke="rgba(233,196,121,.14)" stroke-width="8"/><circle cx="46" cy="46" r="38" fill="none" stroke="var(--gold)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${(2*Math.PI*38).toFixed(1)}" stroke-dashoffset="${(2*Math.PI*38*(1-strength/100)).toFixed(1)}" transform="rotate(-90 46 46)" style="transition:stroke-dashoffset 1.2s cubic-bezier(.2,.8,.3,1)"/></svg><div class="lucknum" data-to="${strength}">${strength}<span>%</span></div><div class="lucklbl">日主旺衰 · ${qiang}</div></div>`;
  document.getElementById('baziResult').innerHTML=
    `<div class="result">
      ${ring}
      <h3>${y}年${m}月${day}日 · ${gender==='男'?'乾造':'坤造'}</h3>
      ${tzNote}
      ${starChart}
      ${bz}
      ${ringChart(pillars,sx)}
      ${bar}
      ${wuRing}
      ${radar}
      ${tenGod}
      <span class="tag">生肖 ${sx}</span>
      <span class="tag">日主 ${dayGan}（${dayWu}）·${level}</span>
      <span class="tag">流派 ${baziSchool==='ditian'?'滴天髓':'子平'}</span>
      ${xkHtml}
      <span class="tag">胎元 ${ec.getTaiYuan()}</span>
      <span class="tag">命宫 ${ec.getMingGong()}</span>
      <span class="tag">身宫 ${ec.getShenGong()}</span>
      ${yunHtml}
      ${kline}
      ${liunianHtml}
      ${taiHtml}
      ${shenHtml}
      <p style="margin-top:6px">喜用神：<b style="color:var(--gold2)">${yongUniq.join(' / ')}</b>（${yongDesc}）</p>
      ${readHtml}
      ${sceneHtml}
      <p style="color:var(--muted);font-size:12px;margin-top:8px">* 四柱干支、五行、十神、藏干、纳音、大运、流年、太岁均由 lunar 历法库按天文历法推算；大运十神以日主为基准、起运岁数为约数；旺衰按得令·得地·得势·得助（含藏干加权与十二长生）推演</p>
    </div>`;
  enhanceBazi(document.querySelector('#baziResult .sc-svg'));
  enhanceBazi(document.querySelector('#baziResult .bz-disc'));
  const baziRes=document.getElementById('baziResult').querySelector('.result');
  if(baziRes){ baziRes.dataset.school='八字'; baziRes.dataset.sentiment=baziSent; if(window.appendConsensus) window.appendConsensus(baziRes); }
  const lk=document.getElementById('baziResult').querySelector('.lucknum');
  if(lk){ lk.dataset.cu='1'; const first=lk.firstChild; const tgt=strength; let n=0; const iv=setInterval(()=>{ n+=Math.ceil(tgt/24); if(n>=tgt){n=tgt;clearInterval(iv);} if(first) first.nodeValue=String(n); },45); }
};

/* ===================== 2. 黄历宜忌（真实推算） ===================== */
/* 黄黑道十二神自算吉时：日支定起神（子午青龙/丑未明堂/寅申天刑/卯酉朱雀/辰戌金匮/巳亥天德），时辰顺排；
   黄道六神（青龙/明堂/金匮/天德/玉堂/司命）所临时辰为吉时 */
const SHI12=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const SHI_RANGE={'子':'23-1','丑':'1-3','寅':'3-5','卯':'5-7','辰':'7-9','巳':'9-11','午':'11-13','未':'13-15','申':'15-17','酉':'17-19','戌':'19-21','亥':'21-23'};
const HH_GODS=['青龙','明堂','天刑','朱雀','金匮','天德','白虎','玉堂','天牢','玄武','司命','勾陈'];
const HH_GOOD=new Set(['青龙','明堂','金匮','天德','玉堂','司命']);
function _jiShiCalc(dayZhi){
  const idx=ZHI.indexOf(dayZhi); if(idx<0) return [];
  const off=idx%6; const out=[];
  for(let i=0;i<12;i++){ const g=HH_GODS[(off+i)%12]; if(HH_GOOD.has(g)) out.push(`${SHI12[i]}时（${SHI_RANGE[SHI12[i]]}）`); }
  return out;
}

/* ===================== 2.5 值日神煞（真实历法：十二建除 · 二十八宿 · 黄黑道） ===================== */
/* 十二建除值日：日支与月建相冲相合所值之神。
   口诀「建满平收黑，除危定执黄；成开皆可用，闭破不相当」——
   建除满平定执破危成收开闭 十二值，配黄黑道忌宜。 */
const ZHI_XING_TIP={
  '建':{hw:'黑道',v:'万物初生、宜建开创',g:'走马上任、竖柱上梁、出行结亲、动工兴造',x:'不利开仓、掘井、动土破土'},
  '除':{hw:'黄道',v:'扫除旧弊、宜除迁改',g:'除服沐浴、迁宅出行、求医问药、理气调养',x:'忌嫁娶、开张、动土（吉多凶少）'},
  '满':{hw:'黑道',v:'丰盈日、宜进财纳福',g:'纳采、置货、开市、祈福、嫁娶',x:'忌安葬、动土、开仓（此日不宜求医）'},
  '平':{hw:'黑道',v:'持平日、宜平常处事',g:'修路平基、装饰垣墙、出行、签约',x:'忌吉凶事并兴、开市、嫁娶（平平之日）'},
  '定':{hw:'黄道',v:'安定日、宜定事宜成',g:'冠带、纳财、签约、嫁娶、安床',x:'忌诉讼、出行远行、动土'},
  '执':{hw:'黄道',v:'持执日、宜执行经办',g:'捕猎、防汛、拆迁、破屋（果断之事）',x:'忌嫁娶、开市、置产（宜守不宜进）'},
  '破':{hw:'黑道',v:'破败日、诸事不宜主',g:'破除旧物、拆墙、扫除（惟破旧可行）',x:'忌嫁娶、开市、动土、签约、出行大忌'},
  '危':{hw:'黄道',v:'危险日、宜慎防谨慎',g:'安床、祈福、祭祀（小心谨慎即可）',x:'忌登高、行舟、动土、开市（宜静不宜动）'},
  '成':{hw:'黄道',v:'成就日、宜成事成就',g:'嫁娶、纳采、开市、立券、移徙、上任',x:'忌诉讼、破土动工（成事大吉之日）'},
  '收':{hw:'黑道',v:'收束日、宜收成归档',g:'纳财、收帐、置产、收藏、五谷入仓',x:'忌开市、出行、动土（宜收不宜放）'},
  '开':{hw:'黄道',v:'开通日、宜开张开创',g:'开市、开业、出行、会友、动土兴工',x:'忌安葬、破土（万事皆宜之日）'},
  '闭':{hw:'黑道',v:'闭塞日、宜内敛藏守',g:'安葬、祭祀、筑墙、固堤（收敛之事）',x:'忌开市、出行、动土、嫁娶（诸事闭塞）'}
};
/* 二十八宿：东方青龙七宿 / 北方玄武七宿 / 西方白虎七宿 / 南方朱雀七宿（真实二十八宿，含木金土日月火水七曜宿主）。 */
const XIU_28=[
  /* 东方青龙七宿 — 角亢氐房心尾箕 */
  ['角','木蛟','吉','居首之祥，诸事可谋，考试文书皆利'],
  ['亢','金龙','凶','怒火宜敛，谨防口舌，勿与人争强'],
  ['氐','土貉','凶','宜静勿动，诸事收敛，忌兴师动众'],
  ['房','日兔','吉','即日可行，诸事顺遂，移徙宜之'],
  ['心','月狐','凶','诸事谨慎，宜守不宜进，防心绪波动'],
  ['尾','火虎','凶','如火燎原，宜防急变，行事宜缓'],
  ['箕','水豹','吉','风调雨顺，诸事可成，且宜纳亲'],
  /* 北方玄武七宿 — 斗牛女虚危室壁 */
  ['斗','木獬','吉','忠义之星，多吉少凶，谋望易成'],
  ['牛','金牛','凶','牛性刚直，宜隐不宜显，勿逞强'],
  ['女','土蝠','凶','须防口舌是非，行事多加谨慎'],
  ['虚','日鼠','凶','诸事不宜，宜守静养神，忌大动干戈'],
  ['危','月燕','凶','危而不危，宜谨慎行事，防身心不安'],
  ['室','火猪','吉','星得正曜，诸事可行，且主财喜'],
  ['壁','水貐','吉','玄武端拱，诸事可取，宜谋新事'],
  /* 西方白虎七宿 — 奎娄胃昴毕觜参 */
  ['奎','木狼','凶','奎宿刚强，宜防竞争冲突，诸事莫急'],
  ['娄','金狗','吉','娄宿顺遂，诸事可成，且利嫁娶'],
  ['胃','土雉','吉','胃宿安和，诸事宜吉，出行谋事皆顺'],
  ['昴','日鸡','凶','昴宿多言，防口舌是非，出行须慎'],
  ['毕','月乌','吉','毕宿和畅，诸事化解，和解事成'],
  ['觜','火猴','凶','觜宿躁动，宜静心守分，勿贸然前行'],
  ['参','水猿','吉','参宿利进，诸事进取，文试武举皆宜'],
  /* 南方朱雀七宿 — 井鬼柳星张翼轸 */
  ['井','木犴','吉','井宿通源，诸事顺遂，百事可行'],
  ['鬼','金羊','凶','鬼宿有祟，防小人暗算，诸事宜慎'],
  ['柳','土獐','凶','柳宿柔软，宜守不宜争，行事多容'],
  ['星','日马','吉','星宿明朗，诸事成之，且利开张'],
  ['张','月鹿','吉','张宿张开，诸事吉祥，兴造嫁娶皆宜'],
  ['翼','火蛇','凶','翼宿动摇，宜小心谨慎，防事态反复'],
  ['轸','水蚓','吉','轸宿和合，诸事可成，利远行']
];
const XIU_BY_NAME={}; XIU_28.forEach(x=>XIU_BY_NAME[x[0]]=x);
/* 黄黑道日：十二神明黄道/黑道 · 青龙明堂金匮天德玉堂司命为黄道六神，
   白虎天牢玄武天刑事主连勾陈皆非黄道。日之明神取 lunar.getDayTianShen。 */
const TS_HW={青龙:'黄道',明堂:'黄道',金匮:'黄道',天德:'黄道',玉堂:'黄道',司命:'黄道',天刑:'黑道',朱雀:'黑道',白虎:'黑道',天牢:'黑道',玄武:'黑道',勾陈:'黑道'};
const TS_G='青龙:宜会友、出行，诸事可观|明堂:宜求谋、见贵，诸事可成|金匮:宜纳财、置产，财运亨通|天德:宜祈福、嫁娶，百事大吉|玉堂:宜宴饮、修造，诸事顺遂|司命:宜求嗣、立券，谋事可成|天刑:防诉讼、受伤，忌争执冒进|朱雀:防口舌、是非，忌争辩斥责|白虎:防破财、损失，忌出行伤身|天牢:防囚禁、闭塞，忌牢狱官非|玄武:防盗贼、暗昧，忌水上活动|勾陈:防滞留、拖延，忌长途谋事';
const TS_G_MAP={}; TS_G.split('|').forEach(x=>{const i=x.indexOf(':');TS_G_MAP[x.slice(0,i)]=x.slice(i+1);});
/* 值日神煞组装：lunar 提供 值星(建除) / 二十八宿 / 日天神 / 神煞方位 */
function _shenShaZi(lunar, dz){
  const zx=lunar.getZhiXing()||'';            /* 十二建除 */
  const zxT=ZHI_XING_TIP[zx]||{};
  const xiu=lunar.getXiu()||'';               /* 二十八宿 */
  const xiuL=(lunar.getXiuLuck&&lunar.getXiuLuck())||'';
  const xiuT=XIU_BY_NAME[xiu]||[];
  const ts=lunar.getDayTianShen&&lunar.getDayTianShen()||''; /* 日天神/黄黑道 */
  const hw=TS_HW[ts]||'';
  const tsT=TS_G_MAP[ts]||'';
  const xk=lunar.getDayXunKong()||'';
  return {zx,zxT,xiu,xiuL,xiuT,ts,hw,tsT,xk};
}

document.getElementById('alBtn').onclick=()=>{
  const inp=document.getElementById('alDate').value;
  const d=inp?new Date(inp):new Date();
  const y=d.getFullYear(),m=d.getMonth()+1,day=d.getDate();
  const solar=Solar.fromYmd(y,m,day);
  const lunar=solar.getLunar();
  const yi=lunar.getDayYi(), ji=lunar.getDayJi();
  const chong=lunar.getChongDesc();
  const zhi=lunar.getZhiXing();
  const peng=lunar.getPengZuGan()+'；'+lunar.getPengZuZhi();
  const xi=lunar.getDayPositionXi(), cai=lunar.getDayPositionCai(), fu=lunar.getDayPositionFu();
  const xiD=lunar.getDayPositionXiDesc()||'', caiD=lunar.getDayPositionCaiDesc()||'', fuD=lunar.getDayPositionFuDesc()||'';
  const dz=lunar.getDayInGanZhi().charAt(1);
  const jishi=_jiShiCalc(dz);
  const liuYao=lunar.getLiuYao()||'', xk=lunar.getDayXunKong()||'', naYin=lunar.getDayNaYin()||'';
  const _ssz=_shenShaZi(lunar,dz);
  // 节气：取最近的一个
  let jqHtml='';
  try{
    const cur=lunar.getJieQi();
    const next=lunar.getNextJie();
    if(cur){ jqHtml=`<span class="tag">今日节气 ${cur}</span>`; }
    else if(next){
      const nd=next.getSolar();
      const diff=Math.round((new Date(nd.getYear(),nd.getMonth()-1,nd.getDay())-new Date(y,m-1,day))/86400000);
      jqHtml=`<span class="tag">下一节气 ${next.getName()}（${nd.getYear()}-${nd.getMonth()}-${nd.getDay()}，约${diff}天后）</span>`;
    }
  }catch(e){}
  const yiTags=yi.slice(0,14).map(x=>`<span class="tag" style="background:#5fae5f">${x}</span>`).join('');
  const jiTags=ji.slice(0,14).map(x=>`<span class="tag" style="background:#c24234">${x}</span>`).join('');
  document.getElementById('alResult').innerHTML=
    `<div class="result">
      <h3>农历 ${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}　${lunar.getYearShengXiao()}年</h3>
      ${jqHtml}
      <span class="tag">值星 ${zhi}</span>
      <span class="tag">冲煞 ${chong}</span>
      <p style="margin-top:10px">宜：${yiTags||'—'}</p>
      <p style="margin-top:6px">忌：${jiTags||'—'}</p>
      <p style="margin-top:8px">彭祖百忌：${peng}</p>
      <p>喜神 ${xi}（${xiD}）｜ 财神 ${cai}（${caiD}）｜ 福神 ${fu}（${fuD}）</p>
      <p style="margin-top:6px">吉时 ${jishi.join('、')||'—'} ｜ 六曜 ${liuYao} ｜ 旬空 ${xk} ｜ 纳音 ${naYin}</p>
      <p style="margin-top:6px;font-size:12px;color:var(--muted)">喜神方位 ${xiD}（宜求喜、约会、宴客）；财神方位 ${caiD}（宜求财、签约、讨账）；福神方位 ${fuD}（宜祈福、安宅、开市）</p>
      <div style="margin-top:12px;padding-top:12px;border-top:1px dashed rgba(154,138,90,.3)">
        <h4 style="margin-bottom:6px">值日神煞</h4>
        <p><b>十二建除</b>：<span class="tag" style="background:${_ssz.zxT.hw==='黄道'?'#5fae5f':'#c24234'}">${_ssz.zx||'—'}·${_ssz.zxT.hw||''}道</span> ${_ssz.zxT.g?'宜'+_ssz.zxT.g+'；'+(_ssz.zxT.x||''):''}</p>
        <p><b>二十八宿</b>：${_ssz.xiu}宿（${_ssz.xiuT[1]||''}）· <span class="tag" style="background:${_ssz.xiuL==='吉'?'#5fae5f':'#c24234'}">${_ssz.xiuL||'—'}</span> ${_ssz.xiuT[3]||''}</p>
        <p><b>黄黑道日</b>：${_ssz.ts||'—'}（${_ssz.hw||''}）${_ssz.tsT?'——'+_ssz.tsT:''}</p>
        ${_ssz.zxT.v?`<p style="font-size:12.5px;color:var(--gold2);margin-top:4px">${_ssz.zx}日·${_ssz.zxT.v}</p>`:''}
      </div>
    </div>`;
};

/* ===================== 3. 姓名五格（真实笔画+规则） ===================== */
const SHU81=[
 [1,'太极之数',1],[2,'两仪之数',0],[3,'三才之数',1],[4,'四象之数',0],[5,'五行之数',1],[6,'六爻之数',1],
 [7,'七政之数',1],[8,'八卦之数',1],[9,'大成之数',0],[10,'终结之数',0],[11,'旱苗逢雨',1],[12,'掘井无泉',0],
 [13,'春日牡丹',1],[14,'破兆',0],[15,'福寿',1],[16,'厚重',1],[17,'刚强',1],[18,'铁镜重磨',1],[19,'多难',0],
 [20,'屋下藏金',0],[21,'明月中天',1],[22,'秋草逢霜',0],[23,'壮丽',1],[24,'掘藏得金',1],[25,'英俊',1],[26,'变怪',0],
 [27,'增长',0],[28,'阔水浮萍',0],[29,'智谋',1],[30,'非运',0],[31,'春日花开',1],[32,'宝马金鞍',1],[33,'升天',1],
 [34,'破家',0],[35,'高楼望月',1],[36,'波澜',0],[37,'猛虎出林',1],[38,'磨铁成针',2],[39,'富贵',1],[40,'退安',0],
 [41,'有德',1],[42,'寒蝉在柳',0],[43,'散财',0],[44,'烦闷',0],[45,'顺风',1],[46,'浪里淘金',0],[47,'点石成金',1],
 [48,'古松立鹤',1],[49,'转变',0],[50,'小舟入海',0],[51,'沉浮',2],[52,'达眼',1],[53,'曲卷难星',0],[54,'石上栽花',0],
 [55,'善恶',0],[56,'浪里行舟',0],[57,'日照春松',1],[58,'晚行遇月',2],[59,'寒蝉悲风',0],[60,'无谋',0],[61,'牡丹芙蓉',1],
 [62,'衰败',0],[63,'舟归平海',1],[64,'非命',0],[65,'巨流归海',1],[66,'岩头步马',0],[67,'通达',1],[68,'顺风扬帆',1],
 [69,'非业',0],[70,'残菊逢霜',0],[71,'石上金花',0],[72,'劳苦',0],[73,'无勇',0],[74,'残花经霜',0],[75,'退守',0],
 [76,'离散',0],[77,'半吉',2],[78,'晚景',0],[79,'云头望月',0],[80,'遁吉',0],[81,'万物回春',1]
];
function shuInfo(n){ const idx=((n-1)%81+81)%81; return SHU81[idx]; }
function wuOfNum(n){ const r=((n%10)+10)%10; return [,'木','木','火','火','土','土','金','金','水','水'][r]; }

/* 康熙字典笔画（姓名学惯例）。cnchar 仅提供现代通用笔画，故此处内置常见姓氏/名用字的康熙笔画表
   （第二十五轮已扩展至 500+ 字），未收录字符回退到通用笔画（结果中如实标注）。五格按康熙笔画推算。 */
const KX={
  '一':1,'乙':1,'乀':1,'丨':1,'亅':1,'丿':1,'乁':1,'丶':1,'二':2,'十':2,'丁':2,'七':2,'卜':2,'八':2,'人':2,'入':2,'儿':2,'匕':2,
  '九':2,'刁':2,'刀':2,'力':2,'乃':2,'又':2,'乂':2,'乜':2,'冫':2,'冖':2,'勹':2,'卩':2,'刂':2,'匚':2,'巜':2,'冂':2,'丩':2,'凵':2,
  '丂':2,'厶':2,'丄':2,'亠':2,'匸':2,'丅':2,'三':3,'干':3,'于':3,'工':3,'土':3,'士':3,'下':3,'寸':3,'大':3,'丈':3,'上':3,'小':3,
  '口':3,'山':3,'巾':3,'乞':3,'川':3,'夕':3,'久':3,'勺':3,'凡':3,'丸':3,'广':3,'亡':3,'丫':3,'尸':3,'己':3,'已':3,'巳':3,'弓':3,
  '子':3,'也':3,'女':3,'刃':3,'叉':3,'兀':3,'弋':3,'孑':3,'孓':3,'幺':3,'亍':3,'尢':3,'彳':3,'宀':3,'屮':3,'夨':3,'巛':3,'廾':3,
  '丌':3,'亼':3,'彐':3,'彑':3,'卪':3,'乆':3,'孒':3,'卄':3,'彡':3,'夊':3,'乇':3,'囗':3,'兦':3,'卂':3,'劜':3,'廴':3,'夂':3,'才':4,
  '及':4,'之':4,'井':4,'天':4,'夫':4,'元':4,'无':4,'丐':4,'木':4,'五':4,'支':4,'不':4,'犬':4,'太':4,'歹':4,'友':4,'尤':4,'匹':4,
  '牙':4,'屯':4,'戈':4,'比':4,'互':4,'切':4,'止':4,'少':4,'曰':4,'日':4,'中':4,'内':4,'水':4,'午':4,'牛':4,'手':4,'毛':4,'壬':4,
  '升':4,'夭':4,'仁':4,'什':4,'片':4,'化':4,'仇':4,'仍':4,'斤':4,'爪':4,'反':4,'介':4,'父':4,'今':4,'凶':4,'分':4,'公':4,'月':4,
  '氏':4,'勿':4,'欠':4,'丹':4,'匀':4,'勾':4,'六':4,'文':4,'亢':4,'方':4,'火':4,'斗':4,'户':4,'冗':4,'心':4,'尺':4,'引':4,'巴':4,
  '孔':4,'允':4,'予':4,'幻':4,'亓':4,'廿':4,'丏':4,'卅':4,'仄':4,'厄':4,'仃':4,'仉':4,'仂':4,'兮':4,'刈':4,'爻':4,'卞':4,'尹':4,
  '夬':4,'爿':4,'毋':4,'卬':4,'殳':4,'毌':4,'勽':4,'仈':4,'灬':4,'仌':4,'刅':4,'亣':4,'弔':4,'乣':4,'仏':4,'乢':4,'巿':4,'厷':4,
  '弖':4,'戶':4,'戸':4,'丮':4,'尐':4,'丯':4,'勼':4,'厸':4,'冃':4,'內':4,'攴':4,'攵':4,'厹':4,'冄':4,'丗':4,'収':4,'亖':4,'厃':4,
  '忄':4,'圠':4,'弌':4,'冘':4,'勻':4,'帀':4,'兂':4,'卆':4,'王':5,'扎':5,'巨':5,'瓦':5,'乏':5,'以':5,'玉':5,'刊':5,'未':5,'末':5,
  '示':5,'巧':5,'正':5,'卉':5,'功':5,'去':5,'甘':5,'世':5,'古':5,'本':5,'可':5,'丙':5,'左':5,'石':5,'右':5,'布':5,'夯':5,'戊':5,
  '平':5,'卡':5,'北':5,'占':5,'凸':5,'旦':5,'目':5,'且':5,'甲':5,'申':5,'叮':5,'田':5,'由':5,'叭':5,'史':5,'央':5,'兄':5,'叼':5,
  '叫':5,'叩':5,'叨':5,'另':5,'冉':5,'皿':5,'凹':5,'囚':5,'四':5,'生':5,'矢':5,'失':5,'乍':5,'禾':5,'丘':5,'付':5,'仗':5,'代':5,
  '仙':5,'白':5,'仔':5,'他':5,'斥':5,'瓜':5,'乎':5,'令':5,'用':5,'甩':5,'句':5,'匆':5,'册':5,'卯':5,'外':5,'包':5,'主':5,'市':5,
  '立':5,'玄':5,'半':5,'宁':5,'穴':5,'它':5,'必':5,'永':5,'司':5,'尼':5,'民':5,'弗':5,'弘':5,'奶':5,'奴':5,'召':5,'加':5,'皮':5,
  '孕':5,'矛':5,'母':5,'幼':5,'札':5,'叵':5,'匝':5,'丕':5,'匜':5,'卟':5,'叱':5,'叻':5,'仨':5,'仕':5,'仟':5,'仡':5,'仫':5,'仞':5,
  '卮':5,'氐':5,'尻':5,'尕':5,'弁':5,'圢':5,'氕':5,'仝':5,'宄':5,'厈':5,'屵':5,'叐':5,'犮':5,'夲':5,'戹':5,'仢':5,'癶':5,'氷':5,
  '仧':5,'仦':5,'叺':5,'処':5,'疒':5,'刌':5,'歺':5,'奵':5,'帄':5,'尓':5,'弍':5,'匃':5,'匄':5,'仠':5,'夰':5,'叧':5,'叏':5,'丱':5,
  '仜':5,'囘':5,'刉':5,'旡':5,'匞':5,'丼':5,'冋':5,'匛':5,'凥':5,'刋':5,'凷':5,'屴':5,'圥':5,'夘':5,'囜':5,'庀':5,'疋':5,'圤':5,
  '卭':5,'叴':5,'厺':5,'宂':5,'禸':5,'朮':5,'玊':5,'亗':5,'冭':5,'夳':5,'庁':5,'仛':5,'夗':5,'仚':5,'屳':5,'囙':5,'甴':5,'戉':5,
  '曱':5,'庂':5,'厇':5,'氶':5,'打':6,'扒':6,'扔':6,'印':6,'犯':6,'汁':6,'式':6,'刑':6,'戎':6,'寺':6,'吉':6,'考':6,'老':6,'地':6,
  '耳':6,'共':6,'朽':6,'臣':6,'吏':6,'再':6,'西':6,'戌':6,'在':6,'百':6,'有':6,'存':6,'而':6,'匠':6,'灰':6,'列':6,'死':6,'夷':6,
  '至':6,'此':6,'尖':6,'劣':6,'光':6,'早':6,'吐':6,'虫':6,'同':6,'吊':6,'吃':6,'因':6,'吆':6,'屹':6,'帆':6,'肉':6,'年':6,'朱':6,
  '先':6,'丢':6,'舌':6,'竹':6,'乒':6,'乓':6,'休':6,'伍':6,'伏':6,'臼':6,'伐':6,'仲':6,'件':6,'任':6,'份':6,'仰':6,'仿':6,'自':6,
  '伊':6,'血':6,'向':6,'后':6,'行':6,'舟':6,'全':6,'兆':6,'企':6,'朵':6,'危':6,'旬':6,'旨':6,'旭':6,'匈':6,'名':6,'各':6,'多':6,
  '色':6,'冰':6,'亦':6,'交':6,'衣':6,'次':6,'决':6,'亥':6,'充':6,'妄':6,'羊':6,'米':6,'州':6,'宇':6,'守':6,'宅':6,'字':6,'安':6,
  '异':6,'弛':6,'收':6,'奸':6,'如':6,'妃':6,'好':6,'她':6,'羽':6,'求':6,'犰':6,'汀':6,'匡':6,'耒':6,'圩':6,'圬':6,'圭':6,'圪':6,
  '圳':6,'圮':6,'圯':6,'亘':6,'夼':6,'戍':6,'尥':6,'乩':6,'旯':6,'曳':6,'屺':6,'凼':6,'囡':6,'缶':6,'氘':6,'氖':6,'牝':6,'伎':6,
  '伢':6,'仵':6,'伉':6,'伫':6,'囟':6,'汆':6,'刖':6,'夙':6,'旮':6,'刎':6,'舛':6,'聿':6,'艮':6,'厾':6,'丞':6,'妁':6,'牟':6,'伋':6,
  '氿':6,'汈':6,'氾':6,'忉':6,'圲':6,'圫':6,'朳':6,'朸':6,'吒':6,'吖':6,'屼':6,'屾':6,'仳':6,'伈':6,'癿':6,'甪':6,'冱':6,'孖':6,
  '虍':6,'艹':6,'伌':6,'伓':6,'汃':6,'夶':6,'朼':6,'仺':6,'艸':6,'奼':6,'仯':6,'朾':6,'朿':6,'吋':6,'伔':6,'刐':6,'圵':6,'朷':6,
  '仾':6,'伄':6,'忊':6,'丟':6,'兊':6,'伅':6,'仮':6,'奿':6,'払':6,'伕':6,'甶':6,'亙':6,'仹':6,'冎':6,'灮':6,'攰':6,'朹':6,'屽':6,
  '叿':6,'妅':6,'屸':6,'巟':6,'匢':6,'灳':6,'刏':6,'妀':6,'囝':6,'幵':6,'夅':6,'弜':6,'伒':6,'劤':6,'奺':6,'朻':6,'牞':6,'刔':6,
  '氒':6,'匟':6,'攷':6,'劥':6,'忇':6,'扐':6,'氻':6,'厽':6,'刕':6,'尦':6,'吂':6,'糸':6,'汅':6,'吀':6,'奻':6,'屰':6,'氼':6,'氽':6,
  '帇':6,'伂':6,'炇':6,'圶':6,'仱':6,'圱':6,'奷':6,'宆':6,'丠':6,'玌':6,'屻':6,'忈':6,'朲':6,'叒':6,'弎':6,'乨':6,'卋':6,'尗':6,
  '伖':6,'兲':6,'旫':6,'弚':6,'彵':6,'穵':6,'仴':6,'刓':6,'卍':6,'伆':6,'弙':6,'襾':6,'仼':6,'奾':6,'灱':6,'灲':6,'劦':6,'旪':6,
  '兇':6,'吅':6,'廵':6,'厊':6,'仸':6,'夵':6,'伇':6,'吔':6,'乑':6,'伃':6,'汄':6,'劧':6,'伀':6,'圴':6,'彴':6,'吇':6,'车':7,'車':7,
  '贝':7,'貝':7,'见':7,'見':7,'扛':7,'扣':7,'托':7,'圾':7,'成':7,'夹':7,'夾':7,'吕':7,'吸':7,'廷':7,'延':7,'似':7,'壮':7,'壯':7,
  '妆':7,'妝':7,'汗':7,'污':7,'江':7,'汛':7,'池':7,'汝':7,'忙':7,'巡':7,'弄':7,'形':7,'戒':7,'吞':7,'址':7,'走':7,'汞':7,'攻':7,
  '赤':7,'孝':7,'坎':7,'均':7,'坟':7,'坑':7,'坊':7,'志':7,'却':7,'劫':7,'杆':7,'杠':7,'杜':7,'材':7,'村':7,'杖':7,'杏':7,'杉':7,
  '巫':7,'李':7,'甫':7,'匣':7,'更':7,'束':7,'吾':7,'豆':7,'酉':7,'辰':7,'否':7,'尬':7,'步':7,'旱':7,'盯':7,'呈':7,'吴':7,'助':7,
  '里':7,'呆':7,'吱':7,'吠':7,'呀':7,'足':7,'男':7,'吵':7,'串':7,'呐':7,'吟':7,'吩':7,'吻':7,'吹':7,'吭':7,'吧':7,'邑':7,'吼':7,
  '囤':7,'别':7,'吮':7,'牡':7,'告':7,'我':7,'利':7,'秃':7,'秀':7,'私':7,'每':7,'兵':7,'估':7,'何':7,'佐':7,'佑':7,'但':7,'伸':7,
  '佃':7,'作':7,'伯':7,'伶':7,'低':7,'你':7,'住':7,'位':7,'伴':7,'身':7,'皂':7,'伺':7,'佛':7,'囱':7,'役':7,'余':7,'希':7,'坐':7,
  '谷':7,'妥':7,'含':7,'岔':7,'甸':7,'免':7,'角':7,'删':7,'彤':7,'卵':7,'灸':7,'刨':7,'言':7,'况':7,'床':7,'庇':7,'吝':7,'冷':7,
  '序':7,'辛':7,'弃':7,'忘':7,'判':7,'兑':7,'灼':7,'弟':7,'冶':7,'完':7,'宋':7,'宏':7,'牢':7,'究':7,'灾':7,'良':7,'初':7,'君':7,
  '即':7,'屁':7,'尿':7,'尾':7,'局':7,'改':7,'忌':7,'妓':7,'妙':7,'妖':7,'妨':7,'妒':7,'努':7,'忍':7,'矣':7,'些':7,'玎':7,'扦':7,
  '岌':7,'佤':7,'汕':7,'汔':7,'汐':7,'汜':7,'汊':7,'忖':7,'圻':7,'坂':7,'坍':7,'杌':7,'杓':7,'杞':7,'杈':7,'忑':7,'孛':7,'豕':7,
  '忒':7,'忐':7,'卣':7,'旰':7,'呋':7,'呔':7,'呃':7,'吡':7,'町':7,'虬':7,'吽':7,'吣':7,'吲':7,'岐':7,'岈':7,'岑':7,'囫':7,'氙':7,
  '氚':7,'牤':7,'佞':7,'攸':7,'佚':7,'佝':7,'佟':7,'佗':7,'伽':7,'彷':7,'佘':7,'孚':7,'豸':7,'坌':7,'奂':7,'劬':7,'亨':7,'庋':7,
  '疔':7,'孜':7,'妍':7,'妣':7,'妊':7,'妗':7,'妞':7,'妤':7,'劭':7,'甬':7,'扞':7,'犴':7,'汋':7,'坉':7,'坋':7,'毐':7,'杕':7,'杙':7,
  '杄':7,'杧':7,'尪':7,'尨':7,'坒':7,'芈':7,'旴':7,'旵':7,'岜':7,'呇':7,'冏':7,'岙':7,'伾':7,'伭':7,'佖':7,'伲':7,'佁':7,'岊':7,
  '妧':7,'妘':7,'乸':7,'吳':7,'釆':7,'岇':7,'庍':7,'夿':7,'弝':7,'玐':7,'岅':7,'匥':7,'別':7,'伻':7,'佊':7,'疕':7,'皀':7,'佈':7,
  '吥':7,'犲':7,'扠':7,'兏':7,'妛':7,'扡':7,'杘':7,'杝':7,'灻':7,'吜':7,'竌':7,'汌':7,'囪':7,'犳':7,'辵':7,'佌':7,'汏':7,'妉':7,
  '帎':7,'扥':7,'厎':7,'坔':7,'坘':7,'旳':7,'刟':7,'扚':7,'矵':7,'矴':7,'吺':7,'兌':7,'庉':7,'吪':7,'囮':7,'岋':7,'奀':7,'冹':7,
  '忛':7,'杋':7,'汎':7,'忋':7,'攺':7,'杚':7,'妚':7,'坆':7,'帉':7,'弅':7,'妢':7,'岎':7,'刜':7,'妋':7,'忓':7,'攼':7,'吿':7,'呄':7,
  '戓':7,'扢':7,'犵':7,'夆':7,'妦':7,'杛':7,'囯':7,'妎':7,'佄':7,'吰':7,'灴':7,'帍':7,'囬':7,'吙':7,'坖':7,'彶':7,'犱':7,'圿':7,
  '糺':7,'臫':7,'刦':7,'刧':7,'吤':7,'岕':7,'庎':7,'妌':7,'坓':7,'坕':7,'坙':7,'宑':7,'巠':7,'囧':7,'呁':7,'囥':7,'坈':7,'妔':7,
  '扝':7,'玏':7,'叓':7,'戻':7,'刢':7,'寽':7,'佅':7,'杗':7,'汒':7,'戼':7,'皃':7,'呅':7,'刡':7,'劰':7,'圽':7,'妠':7,'疓':7,'伱':7,
  '圼':7,'伮':7,'吘':7,'妑':7,'帊':7,'汖':7,'冸':7,'匉':7,'甹':7,'囨':7,'岓':7,'忔':7,'盀':7,'岒':7,'汘':7,'吢':7,'坅':7,'庈':7,
  '扏':7,'汓':7,'夋':7,'伹':7,'佉':7,'刞':7,'匤':7,'礽':7,'宍':7,'忎':7,'扨':7,'杒':7,'牣':7,'秂':7,'卲':7,'佋':7,'斘':7,'佀':7,
  '忕':7,'戺':7,'弞':7,'牠':7,'旲':7,'坄':7,'兎':7,'宊':7,'禿':7,'杔':7,'汑':7,'汙':7,'汚':7,'岏':7,'汍':7,'囲':7,'妏':7,'彣':7,
  '岉':7,'扤':7,'杇':7,'忚':7,'尩':7,'尫':7,'彺':7,'佡':7,'伳':7,'灺':7,'妡':7,'孞':7,'伵':7,'坃':7,'杊':7,'庘':7,'庌':7,'宎':7,
  '岆':7,'吷':7,'妟':7,'佒':7,'伿':7,'劮':7,'吚':7,'宐':7,'耴':7,'肊':7,'盁':7,'丣':7,'扜':7,'杅':7,'囦':7,'妜':7,'岄':7,'夽':7,
  '囩':7,'扗':7,'災':7,'皁':7,'厏':7,'灹':7,'佔':7,'扙':7,'佂':7,'坁':7,'巵':7,'帋':7,'刣':7,'妕':7,'妐':7,'彸':7,'伷':7,'佇':7,
  '劯':7,'灷':7,'宒':7,'杍':7,'兒':8,'门':8,'門':8,'冈':8,'岡':8,'长':8,'長':8,'仑':8,'侖':8,'轧':8,'軋':8,'东':8,'東':8,'纠':8,
  '糾':8,'亚':8,'协':8,'協':8,'肌':8,'肋':8,'争':8,'并':8,'玖':8,'扶':8,'技':8,'扼':8,'找':8,'批':8,'扯':8,'抄':8,'抓':8,'扳':8,
  '扮':8,'抑':8,'抛':8,'投':8,'抗':8,'抖':8,'扭':8,'把':8,'抒':8,'两':8,'兩':8,'来':8,'來':8,'狂':8,'状':8,'狀':8,'汪':8,'沐':8,
  '沛':8,'汰':8,'沙':8,'汽':8,'沃':8,'汹':8,'没':8,'沈':8,'沉':8,'沁':8,'忱':8,'快':8,'社':8,'祀':8,'姊':8,'奉':8,'武':8,'青':8,
  '卦':8,'坷':8,'坯':8,'坪':8,'坦':8,'坤':8,'垃':8,'幸':8,'坡':8,'其':8,'取':8,'昔':8,'直':8,'枉':8,'林':8,'枝':8,'杯':8,'枚':8,
  '析':8,'松':8,'杭':8,'枕':8,'或':8,'卧':8,'事':8,'刺':8,'雨':8,'奈':8,'奇':8,'妻':8,'到':8,'非':8,'叔':8,'歧':8,'卓':8,'虎':8,
  '尚':8,'旺':8,'具':8,'味':8,'果':8,'昆':8,'咕':8,'昌':8,'呵':8,'明':8,'易':8,'昂':8,'典':8,'固':8,'忠':8,'呻':8,'咒':8,'咋':8,
  '咐':8,'呼':8,'咏':8,'呢':8,'咄':8,'咖':8,'岸':8,'岩':8,'帖':8,'帕':8,'知':8,'氛':8,'垂':8,'牧':8,'物':8,'乖':8,'秆':8,'和':8,
  '季':8,'委':8,'秉':8,'佳':8,'侍':8,'岳':8,'供':8,'使':8,'例':8,'版':8,'侄':8,'侣':8,'佩':8,'侈':8,'依':8,'卑':8,'的':8,'欣':8,
  '往':8,'爬':8,'彼':8,'所':8,'金':8,'刹':8,'命':8,'斧':8,'爸':8,'采':8,'受':8,'乳':8,'念':8,'忿':8,'朋':8,'服':8,'周':8,'昏':8,
  '兔':8,'忽':8,'京':8,'享':8,'店':8,'夜':8,'府':8,'底':8,'疙':8,'疚':8,'卒':8,'庚':8,'净':8,'盲':8,'放':8,'刻':8,'氓':8,'券':8,
  '炒':8,'炊':8,'炕':8,'炎':8,'宗':8,'定':8,'宜':8,'宙':8,'官':8,'空':8,'宛':8,'房':8,'帚':8,'屉':8,'居':8,'届':8,'刷':8,'屈':8,
  '弧':8,'弦':8,'承':8,'孟':8,'孤':8,'函':8,'妹':8,'姑':8,'姐':8,'姓':8,'妮':8,'始':8,'姆':8,'叁':8,'毒':8,'政':8,'卸':8,'艽':8,
  '艿':8,'汲':8,'祁':8,'玕':8,'抔':8,'抃':8,'抉':8,'兕':8,'狄':8,'狁':8,'羌':8,'沅':8,'沔':8,'沌':8,'沏':8,'沚':8,'汩':8,'汨':8,
  '沂':8,'汾':8,'汴':8,'汶':8,'沆':8,'忡':8,'忤':8,'忻':8,'忪':8,'忭':8,'忸':8,'姒':8,'盂':8,'忝':8,'坩':8,'坫':8,'劼':8,'坼':8,
  '坻':8,'坨':8,'坭':8,'坳':8,'枇':8,'杪':8,'杳':8,'杵':8,'枋':8,'杻':8,'杷':8,'杼':8,'矸':8,'刳':8,'奄':8,'殁':8,'盱':8,'昊':8,
  '杲':8,'昃':8,'咂':8,'呸':8,'昕':8,'昀':8,'旻':8,'昉':8,'炅':8,'咔':8,'畀':8,'咀':8,'呷':8,'呱':8,'呤':8,'咚':8,'咆':8,'呶':8,
  '呣':8,'呦':8,'岢':8,'岬':8,'岫':8,'帙':8,'岣':8,'峁':8,'岷':8,'帔':8,'沓':8,'囹':8,'牦':8,'竺':8,'佶':8,'佬':8,'佰':8,'侑':8,
  '侉':8,'臾':8,'岱':8,'侗':8,'侃':8,'侏':8,'佻':8,'佾':8,'佼':8,'佯':8,'帛':8,'阜':8,'侔':8,'徂':8,'剁':8,'咎':8,'炙':8,'冽':8,
  '冼':8,'庖':8,'疝':8,'兖':8,'妾':8,'劾':8,'炖':8,'炘':8,'炔':8,'宕':8,'穹':8,'宓':8,'戾':8,'戽':8,'戕':8,'孢':8,'亟':8,'妲':8,
  '妯':8,'姗':8,'帑':8,'弩':8,'孥':8,'虱':8,'甾':8,'呲':8,'戋':8,'戔':8,'玒':8,'玓':8,'玘':8,'扽':8,'扺':8,'岠':8,'狃':8,'汧':8,
  '汫':8,'沘':8,'汭':8,'沇':8,'忮':8,'忳':8,'忺':8,'坥':8,'坰':8,'坬':8,'坽':8,'弆':8,'耵':8,'枅':8,'枘':8,'枍':8,'矼':8,'矻':8,
  '匼':8,'旿':8,'昇':8,'昄':8,'昒':8,'昈':8,'咉':8,'咇':8,'咍':8,'岵':8,'岨':8,'岞':8,'峂':8,'囷':8,'牥':8,'佴':8,'垈':8,'侁':8,
  '佸':8,'佺':8,'隹':8,'侂':8,'佽':8,'侘':8,'舠':8,'攽':8,'忞':8,'於':8,'炌':8,'炆':8,'穸':8,'弢':8,'弨':8,'卺':8,'妭':8,'姈':8,
  '叕':8,'艾':8,'並':8,'枊':8,'侒':8,'坺':8,'扷':8,'岰':8,'坢':8,'姅':8,'朌':8,'岥':8,'昁':8,'汳':8,'帗':8,'犻':8,'瓝':8,'併':8,
  '幷':8,'妼':8,'屄':8,'枈':8,'毞':8,'畁':8,'歨':8,'丳':8,'斺':8,'呫':8,'扱':8,'秅':8,'尙':8,'镸':8,'虰':8,'侙':8,'卶':8,'呞':8,
  '彽':8,'汦':8,'沖':8,'杽':8,'豖':8,'玔':8,'刱':8,'牀':8,'杶':8,'旾':8,'庛':8,'呾':8,'咑':8,'忰':8,'侟':8,'忩':8,'帒':8,'抌':8,
  '沊':8,'呧':8,'奃':8,'弤':8,'虭':8,'艼':8,'妬':8,'枓':8,'刴':8,'呝':8,'妸':8,'枙':8,'妿':8,'侕':8,'刵':8,'佱':8,'姂':8,'犿':8,
  '籵':8,'昘':8,'汸':8,'坲':8,'侅':8,'竎':8,'昐':8,'枌':8,'炃':8,'咈':8,'坿':8,'姇':8,'岪':8,'弣':8,'抙':8,'彿':8,'枎':8,'阝':8,
  '姏':8,'汵':8,'皯':8,'盰':8,'疘':8,'牨':8,'佮':8,'匌':8,'牫':8,'刯':8,'侊':8,'糼':8,'糿':8,'坸':8,'抇':8,'炗':8,'炚':8,'炛':8,
  '佹':8,'昋':8,'囶':8,'呺':8,'厒':8,'咊':8,'佫':8,'姀':8,'佷':8,'斻':8,'汻':8,'杹':8,'呴':8,'犼':8,'佪':8,'宖':8,'沗':8,'汯':8,
  '瓨':8,'垀':8,'曶':8,'枑':8,'沍':8,'叀':8,'忶':8,'沎':8,'忣':8,'艻':8,'忦':8,'扴':8,'冿':8,'芁':8,'兓':8,'枃':8,'屆':8,'扻':8,
  '昅':8,'毑':8,'疌':8,'汬':8,'畂':8,'舏':8,'弡':8,'決':8,'匊':8,'姖':8,'抅':8,'劵':8,'呟':8,'奆':8,'汮':8,'炏':8,'忼':8,'犺':8,
  '肎':8,'劶':8,'刲':8,'劻':8,'岲':8,'忹':8,'抂':8,'狅':8,'竻':8,'岦':8,'炓':8,'劽':8,'夌':8,'岺':8,'彾':8,'坴':8,'侓':8,'帓':8,
  '盳':8,'冐':8,'枆':8,'侎':8,'沒':8,'甿':8,'冞':8,'沕':8,'劺':8,'姄':8,'忟':8,'旼':8,'佲':8,'妺':8,'歾':8,'歿':8,'坶':8,'炑':8,
  '妳':8,'枏':8,'抐':8,'秊':8,'汼':8,'炄':8,'沜':8,'炍':8,'炐':8,'奅':8,'岯':8,'呯':8,'呠':8,'炋':8,'岶':8,'尀':8,'咅':8,'亝':8,
  '呮':8,'忯':8,'炁':8,'盵':8,'冾':8,'忴':8,'扲':8,'欦':8,'臤':8,'斨':8,'抋':8,'昑':8,'夝':8,'靑':8,'坵':8,'肍':8,'虯':8,'呥':8,
  '姌':8,'呿':8,'岴':8,'汱':8,'甽':8,'囸':8,'氜':8,'沑':8,'侞':8,'姍':8,'呩':8,'旹':8,'妽':8,'扟':8,'矤':8,'籶':8,'杸':8,'孠':8,
  '杫':8,'枀':8,'囼':8,'坮':8,'孡':8,'忲':8,'坣':8,'匋':8,'屇':8,'岧':8,'岹':8,'芀':8,'耓':8,'庝':8,'妵':8,'旽':8,'咃':8,'岮':8,
  '矺':8,'劸':8,'妴':8,'忨':8,'抏':8,'杬':8,'呡':8,'抆':8,'忢':8,'矹':8,'卥':8,'呬':8,'忥':8,'疜':8,'枂':8,'臥':8,'咁':8,'妶':8,
  '杴':8,'秈':8,'臽':8,'佭':8,'効':8,'杺':8,'枔':8,'侀':8,'忷':8,'昍':8,'侐':8,'卹':8,'姁':8,'汿':8,'沀':8,'疞':8,'侚':8,'畃':8,
  '亞':8,'厓':8,'枒':8,'犽':8,'枖':8,'殀':8,'乴':8,'坹':8,'岤':8,'乵':8,'抁':8,'昖':8,'牪':8,'坱':8,'姎':8,'劷':8,'岟':8,'侇':8,
  '呭':8,'呹':8,'炈':8,'秇':8,'侌':8,'斦':8,'犾':8,'沋':8,'忬':8,'欥':8,'玗':8,'穻':8,'抈':8,'礿':8,'抎':8,'枟':8,'沞':8,'戝':8,
  '昗':8,'妱':8,'巶':8,'枛':8,'歽':8,'姃':8,'抍':8,'爭':8,'糽':8,'厔':8,'坧':8,'垁':8,'妷':8,'汥':8,'汷':8,'狆':8,'炂':8,'侜':8,
  '呪':8,'疛':8,'坾':8,'宔':8,'沝':8,'妰':8,'呰':8,'姉':8,'姕':8,'秄':8,'矷':8,'岝':8,'飞':9,'飛':9,'风':9,'風':9,'计':9,'計':9,
  '帅':9,'帥':9,'芋':9,'芒':9,'页':9,'頁':9,'轨':9,'軌':9,'贞':9,'貞':9,'则':9,'則':9,'後':9,'负':9,'負':9,'军':9,'軍':9,'红':9,
  '紅':9,'约':9,'約':9,'纪':9,'紀':9,'纫':9,'紉':9,'拒':9,'克':9,'剋':9,'肖':9,'肝':9,'肛':9,'肚':9,'肘':9,'系':9,'係':9,'泛':9,
  '罕':9,'劲':9,'勁':9,'玩':9,'玫':9,'抹':9,'拓':9,'拔':9,'押':9,'抽':9,'拐':9,'拖':9,'拍':9,'拆':9,'拎':9,'抵':9,'拘':9,'抱':9,
  '拄':9,'拉':9,'拌':9,'拂':9,'拙':9,'招':9,'披':9,'抬':9,'拇':9,'拗':9,'奔':9,'哎':9,'侠':9,'俠':9,'狐':9,'狗':9,'炬':9,'沫':9,
  '法':9,'泄':9,'沽':9,'河':9,'沾':9,'泪':9,'沮':9,'油':9,'泊':9,'沿':9,'泡':9,'注':9,'泣':9,'泌':9,'泳':9,'泥':9,'沸':9,'沼':9,
  '波':9,'治':9,'怔':9,'怯':9,'怖':9,'性':9,'怕':9,'怪':9,'怡':9,'衫':9,'祈':9,'建':9,'契':9,'奏':9,'春':9,'型':9,'封':9,'垮':9,
  '赴':9,'哉':9,'垢':9,'垛':9,'某':9,'甚':9,'革':9,'巷':9,'故':9,'南':9,'柑':9,'枯':9,'柄':9,'相':9,'查':9,'柏':9,'栅':9,'柳':9,
  '柱':9,'柿':9,'勃':9,'要':9,'柬':9,'咸':9,'威':9,'歪':9,'厘':9,'厚':9,'砌':9,'砂':9,'泵':9,'砍':9,'耐':9,'耍':9,'殃':9,'皆':9,
  '韭':9,'虐':9,'省':9,'削':9,'昧':9,'盹':9,'是':9,'盼':9,'哇':9,'哄':9,'冒':9,'映':9,'星':9,'昨':9,'咧':9,'昭':9,'畏':9,'趴':9,
  '界':9,'虹':9,'思':9,'品':9,'咽':9,'咱':9,'哈':9,'哆':9,'咬':9,'咳':9,'咪':9,'炭':9,'幽':9,'缸':9,'拜':9,'看':9,'怎':9,'牲':9,
  '秒':9,'香':9,'秋':9,'科':9,'重':9,'竿':9,'段':9,'便':9,'俏':9,'保':9,'促':9,'俄':9,'俐':9,'侮':9,'俗':9,'俘':9,'信':9,'皇':9,
  '泉':9,'侵':9,'禹':9,'侯':9,'俊':9,'盾':9,'待':9,'徊':9,'衍':9,'律':9,'很':9,'叙':9,'食':9,'盆':9,'勉':9,'怨':9,'急':9,'哀':9,
  '亭':9,'亮':9,'度':9,'疫':9,'疤':9,'咨':9,'姿':9,'音':9,'帝':9,'施':9,'美':9,'姜':9,'叛':9,'籽':9,'前':9,'首':9,'炸':9,'炮':9,
  '炫':9,'剃':9,'柒':9,'染':9,'宣':9,'宦':9,'室':9,'突':9,'穿':9,'客':9,'冠':9,'扁':9,'既':9,'屋':9,'屏':9,'屎':9,'眉':9,'孩':9,
  '娃':9,'姥':9,'姨':9,'姻':9,'姚':9,'怒':9,'架':9,'盈':9,'勇':9,'怠':9,'癸':9,'柔':9,'泰':9,'柴':9,'韦':9,'韋':9,'闩':9,'閂':9,
  '讣':9,'訃':9,'芊':9,'芍':9,'芄':9,'芑':9,'芎':9,'厍':9,'厙':9,'钇':9,'釔':9,'纡':9,'紆':9,'纣':9,'紂':9,'纥':9,'紇':9,'纨':9,
  '紈':9,'肟':9,'肓':9,'泐':9,'刭':9,'剄':9,'玡':9,'玭':9,'玠':9,'玢':9,'玥':9,'玦':9,'抨':9,'拤':9,'拈':9,'抻':9,'拃':9,'拊':9,
  '抿':9,'耶':9,'罔':9,'瓮':9,'狙':9,'狎':9,'狍':9,'狒':9,'泔':9,'沭':9,'泱':9,'泅':9,'泗':9,'泠':9,'泖':9,'泫':9,'泮':9,'沱':9,
  '泯':9,'泓':9,'怙':9,'怵':9,'怦':9,'怛':9,'怏':9,'怍':9,'怩':9,'怫':9,'衩':9,'祆':9,'祉':9,'祇':9,'垣':9,'垤':9,'赳':9,'垌':9,
  '垧':9,'垓':9,'垠':9,'柰':9,'柯':9,'柘':9,'柩':9,'枰':9,'柙':9,'枵':9,'柚':9,'枳':9,'柞':9,'柝':9,'栀':9,'柢':9,'枸':9,'柈':9,
  '柁':9,'枷':9,'剌':9,'酊':9,'甭':9,'砘':9,'砒':9,'斫':9,'奎':9,'耷':9,'虺':9,'殂':9,'殄':9,'殆':9,'毖':9,'尜':9,'哐':9,'眄':9,
  '眍':9,'眇':9,'眊':9,'眈':9,'禺':9,'哂':9,'咴':9,'曷':9,'昴':9,'昱':9,'昵':9,'咦':9,'畎':9,'毗':9,'畋':9,'畈':9,'虼':9,'虻':9,
  '盅':9,'咣':9,'咻':9,'囿':9,'咿':9,'哌':9,'哚':9,'咯':9,'咩':9,'咤':9,'哏':9,'哞':9,'峙':9,'峒':9,'峋':9,'峥':9,'氡':9,'氟':9,
  '牯':9,'秕':9,'竽':9,'俅':9,'垡':9,'牮':9,'俣':9,'俚':9,'皈':9,'俑':9,'俟':9,'徇':9,'徉':9,'舢':9,'俞':9,'俎':9,'爰':9,'朐':9,
  '匍':9,'訇':9,'昝':9,'弈':9,'奕':9,'庥':9,'疣':9,'疥':9,'庠':9,'竑':9,'彦':9,'羑':9,'籼':9,'酋':9,'炳':9,'炻':9,'炯':9,'烀':9,
  '炷':9,'宥':9,'扃':9,'昶':9,'咫':9,'弭':9,'牁':9,'姮':9,'姝':9,'姣':9,'姘':9,'姹':9,'羿':9,'炱':9,'矜':9,'芏':9,'芃':9,'钆':9,
  '釓':9,'伣':9,'俔':9,'呙':9,'咼':9,'岍':9,'玤':9,'玞':9,'玟':9,'侹':9,'狉':9,'泙':9,'沺':9,'泂':9,'泜':9,'泃':9,'泇':9,'怊':9,
  '祋':9,'祊':9,'砉':9,'耔':9,'垚':9,'垙':9,'垍':9,'垎':9,'垴':9,'垟':9,'垞':9,'垵':9,'垏':9,'柷':9,'柃':9,'柊':9,'枹':9,'栐':9,
  '柖':9,'剅':9,'厖':9,'砆':9,'砑':9,'砄':9,'耏':9,'奓':9,'昺':9,'盷':9,'咡':9,'咺':9,'昳':9,'昣':9,'昤':9,'昫':9,'昡':9,'咥':9,
  '昪':9,'虷':9,'虸':9,'哃':9,'峘':9,'耑':9,'峛':9,'峗':9,'帡':9,'矧':9,'俜':9,'俙':9,'俍':9,'垕':9,'衎':9,'弇':9,'侴':9,'朏':9,
  '訄':9,'庤':9,'疢':9,'炣':9,'炟':9,'窀':9,'扂':9,'叚':9,'娀':9,'姞':9,'姱':9,'姤':9,'姶':9,'姽':9,'枲':9,'彖':9,'畖':9,'紃':9,
  '彥':9,'怉':9,'峎':9,'峖':9,'峇':9,'柭':9,'癹':9,'炦':9,'柪':9,'狕':9,'怑':9,'瓪':9,'泍':9,'昹':9,'柸':9,'盃':9,'拚':9,'玣':9,
  '侼':9,'敀':9,'狛':9,'肑':9,'怲':9,'抦':9,'昞':9,'怭':9,'怶':9,'柀':9,'柲':9,'疪':9,'抪':9,'柨':9,'匨':9,'柵':9,'芆':9,'肞':9,
  '紁':9,'臿':9,'欩':9,'牊':9,'侱':9,'泟':9,'爯':9,'肜':9,'勅':9,'垑':9,'姼':9,'抶':9,'竾':9,'肔':9,'怞':9,'牰':9,'拀':9,'欪':9,
  '泏':9,'竐':9,'舡':9,'垐':9,'柌':9,'怚':9,'羍':9,'疩':9,'怱':9,'剉':9,'侳':9,'柋':9,'柦':9,'狚':9,'玬':9,'瓭':9,'砃':9,'哋':9,
  '怟':9,'拞':9,'牴':9,'虳':9,'峌':9,'柣':9,'姛':9,'峝':9,'昸':9,'敁':9,'屌':9,'盄':9,'訂':9,'垖':9,'垜':9,'尮':9,'柮':9,'柂':9,
  '沲':9,'炧':9,'炨':9,'咢':9,'咹':9,'峉':9,'砈':9,'砐':9,'峏':9,'峜':9,'沷':9,'疺':9,'柉':9,'瓬':9,'眆':9,'姟':9,'峐':9,'昲':9,
  '砏':9,'秎':9,'俌':9,'俛':9,'垘':9,'峊':9,'怤':9,'柎':9,'柫':9,'泭':9,'炥':9,'畐':9,'畉':9,'乹':9,'芉':9,'衦':9,'勂':9,'叝':9,
  '牱':9,'肐':9,'剆':9,'畊':9,'秔':9,'凬':9,'盽':9,'玜':9,'羾':9,'怘':9,'柧':9,'泒':9,'柺':9,'泴':9,'俇':9,'姯':9,'垝':9,'攱':9,
  '咶':9,'圀':9,'侾':9,'昦':9,'秏':9,'峆':9,'抲':9,'柇':9,'籺':9,'凾':9,'炶':9,'姡':9,'矦':9,'娂':9,'奐':9,'肒':9,'怳':9,'衁':9,
  '泘':9,'芐':9,'廻':9,'沬':9,'泋':9,'芔':9,'俒':9,'昬':9,'咟':9,'卽':9,'哜':9,'咭':9,'姫':9,'泲':9,'拁':9,'抸':9,'毠':9,'姦':9,
  '姧':9,'玪':9,'訆':9,'觔':9,'抾':9,'畍':9,'砎':9,'亰':9,'俓':9,'穽':9,'侰':9,'柾':9,'觓':9,'泬':9,'玨':9,'疦':9,'侷':9,'怇':9,
  '柤':9,'昛':9,'歫':9,'泦':9,'狊':9,'姢':9,'帣':9,'姰':9,'奒':9,'砊':9,'勀':9,'怐':9,'敂':9,'俈':9,'咵':9,'尯':9,'匩':9,'況':9,
  '勆':9,'柆':9,'咾':9,'窂':9,'沴':9,'砅':9,'赲':9,'姴':9,'朎':9,'狑':9,'炩':9,'斿':9,'峍':9,'峈':9,'覙':9,'閁':9,'笀':9,'柕':9,
  '抺':9,'玧':9,'峚':9,'沵':9,'芇':9,'敄':9,'勄':9,'怋':9,'敃':9,'盿':9,'砇':9,'玅':9,'姳':9,'眀':9,'帞':9,'尛':9,'枺':9,'昩':9,
  '峔':9,'牳':9,'畆':9,'拏':9,'廼':9,'侽':9,'抩':9,'柟':9,'怓':9,'抳':9,'柅':9,'狋':9,'狔':9,'籾':9,'姩':9,'枿':9,'皅':9,'俖':9,
  '牉':9,'眅':9,'拋':9,'炰':9,'爮':9,'姵':9,'怌':9,'斾':9,'昢':9,'竼':9,'瓫':9,'抷':9,'毘':9,'狓':9,'咠':9,'疧':9,'帢':9,'拑':9,
  '匧':9,'甠':9,'秌':9,'訅':9,'卻':9,'斪':9,'姾':9,'弮':9,'峑':9,'辸':9,'姙':9,'肕':9,'帤':9,'肗':9,'盶':9,'耎':9,'泧':9,'俕':9,
  '穼':9,'姠':9,'殅':9,'泩':9,'狌':9,'虵':9,'兘':9,'冟':9,'宩':9,'屍':9,'峕':9,'昰':9,'枾':9,'眂':9,'垨':9,'侺':9,'姺':9,'昚':9,
  '柛':9,'籸':9,'侸':9,'俆':9,'兪':9,'凁':9,'咰':9,'怷':9,'枱':9,'柶':9,'泀':9,'泤':9,'牭':9,'柗':9,'叜':9,'泝':9,'芕':9,'炲':9,
  '咷':9,'厗':9,'庣':9,'宨':9,'怗':9,'邒':9,'炵':9,'怢':9,'侻':9,'俀':9,'拕':9,'沰':9,'狏':9,'徍':9,'峞':9,'昷':9,'俉':9,'卼':9,
  '玝':9,'徆':9,'怬':9,'怸':9,'扸':9,'盻':9,'炠':9,'疨':9,'咞':9,'姭':9,'枮':9,'祅':9,'亯':9,'咲':9,'垥':9,'祄':9,'盺':9,'哅':9,
  '怰':9,'怴':9,'欨':9,'芌':9,'抭':9,'柼':9,'穾':9,'泶':9,'狘':9,'兗':9,'匽':9,'姲':9,'姸':9,'抰':9,'昜':9,'柍':9,'炴':9,'羏':9,
  '俋':9,'峓':9,'帠':9,'庡':9,'巸':9,'帟':9,'弬':9,'怈':9,'抴':9,'枻':9,'沶':9,'泆':9,'芅':9,'衪':9,'枼':9,'枽':9,'矨':9,'勈':9,
  '柡':9,'哊':9,'姷':9,'峟':9,'怮':9,'怣':9,'泑':9,'狖':9,'俁':9,'秗':9,'虶':9,'衧':9,'剈':9,'肙':9,'貟':9,'畇':9,'眃':9,'秐':9,
  '沯':9,'泎':9,'夈':9,'抯':9,'虴':9,'垗':9,'炤':9,'砓':9,'籷':9,'侲':9,'弫':9,'抮':9,'炡':9,'姪':9,'庢':9,'抧':9,'砋':9,'秓':9,
  '秖':9,'芖':9,'泈':9,'祌':9,'冑':9,'咮':9,'壴':9,'殶':9,'炢':9,'笁':9,'孨':9,'壵':9,'炪':9,'芓':9,'昮':9,'爼':9,'个':10,
  '個':10,'马':10,'馬':10,'气':10,'氣':10,'仓':10,'倉':10,'乌':10,'烏':10,'鬥':10,'订':10,'釘':10,'书':10,'書':10,'只':10,
  '衹':10,'隻':10,'们':10,'們':10,'闪':10,'閃':10,'讨':10,'討':10,'训':10,'訓':10,'讯':10,'訊':10,'记':10,'記':10,'迂':10,
  '芝':10,'师':10,'師':10,'岂':10,'豈':10,'刚':10,'剛':10,'迄':10,'伦':10,'倫':10,'迅':10,'孙':10,'孫':10,'级':10,'級':10,
  '贡':10,'貢':10,'坝':10,'垻':10,'芙':10,'芽':10,'花':10,'芹':10,'芥':10,'芬':10,'芳':10,'芯':10,'芭':10,'轩':10,'軒':10,
  '时':10,'時':10,'员':10,'員':10,'财':10,'財':10,'针':10,'針':10,'钉':10,'岛':10,'島':10,'冻':10,'凍':10,'亩':10,'畝':10,
  '库':10,'庫':10,'纯':10,'純':10,'纱':10,'紗':10,'纳':10,'納':10,'纷':10,'紛':10,'纸':10,'紙':10,'纹':10,'紋':10,'纺':10,
  '紡':10,'纽':10,'紐':10,'者':10,'肯':10,'径':10,'徑':10,'肴':10,'肺':10,'肢':10,'股':10,'肪':10,'肥':10,'育':10,'肩':10,
  '玷':10,'珍':10,'玲':10,'珊':10,'玻':10,'拭':10,'挂':10,'持':10,'拷':10,'拱':10,'挎':10,'城':10,'拽':10,'括':10,'拴':10,
  '拾':10,'挑':10,'指':10,'挣':10,'拼':10,'挖':10,'按':10,'拯':10,'眨':10,'哪':10,'峡':10,'峽':10,'骨':10,'矩':10,'俩':10,
  '倆':10,'修':10,'鬼':10,'狮':10,'狰':10,'狡':10,'狠':10,'庭':10,'差':10,'洪':10,'洞':10,'洗':10,'活':10,'派':10,'洽':10,
  '洛':10,'洋':10,'洲':10,'津':10,'恃':10,'恒':10,'恢':10,'恍':10,'恬':10,'恤':10,'恰':10,'恨':10,'宫':10,'祖':10,'神':10,
  '祝':10,'祠':10,'娜':10,'蚤':10,'耕':10,'耘':10,'耗':10,'耙':10,'秦':10,'素':10,'匪':10,'栽':10,'埂':10,'起':10,'埋':10,
  '袁':10,'哲':10,'恐':10,'埃':10,'耻':10,'耿':10,'耽':10,'恭':10,'晋':10,'真':10,'框':10,'桂':10,'桔':10,'栖':10,'桐':10,
  '株':10,'栓':10,'桃':10,'格':10,'校':10,'核':10,'根':10,'索':10,'哥':10,'栗':10,'酌':10,'配':10,'翅':10,'辱':10,'唇':10,
  '夏':10,'砸':10,'砰':10,'破':10,'原':10,'套':10,'烈':10,'殊':10,'殉':10,'桌':10,'眠':10,'哮':10,'晃':10,'哺':10,'晌':10,
  '剔':10,'蚌':10,'畔':10,'蚣':10,'蚊':10,'蚪':10,'蚓':10,'哨':10,'哩':10,'圃':10,'哭':10,'哦':10,'恩':10,'唤':10,'唁':10,
  '哼':10,'唧':10,'唉':10,'唆':10,'峭':10,'峨':10,'峰':10,'峻':10,'缺':10,'氧':10,'氨':10,'特':10,'乘':10,'秤':10,'租':10,
  '秧':10,'秩':10,'秘':10,'笑':10,'笋':10,'值':10,'倚':10,'俺':10,'倒':10,'倘':10,'俱':10,'倡':10,'候':10,'俯':10,'倍':10,
  '倦':10,'臭':10,'射':10,'躬':10,'息':10,'倔':10,'徒':10,'徐':10,'殷':10,'般':10,'航':10,'拿':10,'爹':10,'舀':10,'豺':10,
  '豹':10,'翁':10,'留':10,'凌':10,'凄':10,'衰':10,'衷':10,'高':10,'席':10,'座':10,'病':10,'疾':10,'疹':10,'疼':10,'疲':10,
  '效':10,'紊':10,'唐':10,'凉':10,'站':10,'剖':10,'旁':10,'旅':10,'畜':10,'羔':10,'拳':10,'粉':10,'料':10,'益':10,'兼':10,
  '烤':10,'烘':10,'烟':10,'烙':10,'酒':10,'流':10,'害':10,'家':10,'宵':10,'宴':10,'窄':10,'容':10,'宰':10,'案':10,'扇':10,
  '冥':10,'冤':10,'剥':10,'展':10,'屑':10,'弱':10,'祟':10,'娱':10,'娟':10,'恕':10,'娥':10,'娘':10,'桑':10,'邗':10,'邛':10,
  '刍':10,'芻':10,'邙':10,'讦':10,'訐':10,'讧':10,'訌':10,'讪':10,'訕':10,'讫':10,'訖':10,'芨':10,'伥':10,'倀':10,'芫':10,
  '芾':10,'芷':10,'芮':10,'芼':10,'芩':10,'芪':10,'芡':10,'芟':10,'苄':10,'轫':10,'軔':10,'呗':10,'唄':10,'岘':10,'峴':10,
  '钊':10,'釗':10,'钋':10,'釙':10,'钌':10,'釕':10,'纭':10,'紜':10,'纰':10,'紕':10,'纴':10,'紝':10,'纾':10,'紓':10,'肼':10,
  '肽':10,'肱':10,'肫':10,'珏':10,'珐':10,'珂':10,'玳':10,'珀':10,'珉':10,'珈':10,'拮':10,'砭':10,'罘':10,'秭':10,'笈':10,
  '叟':10,'瓴':10,'狨':10,'狩':10,'洱':10,'洹':10,'洧':10,'洌':10,'洇':10,'洄':10,'洙':10,'洎':10,'洫':10,'洮':10,'洵':10,
  '洳':10,'恓':10,'恫':10,'恂':10,'恪':10,'衲':10,'衽':10,'衿':10,'袂':10,'祛':10,'祜':10,'祓':10,'祚':10,'祗':10,'耖':10,
  '挈':10,'恚':10,'埔':10,'埕':10,'耆':10,'耄':10,'埒':10,'垸':10,'盍':10,'栲':10,'栳':10,'桓':10,'桎':10,'栝':10,'桕':10,
  '桁':10,'桅':10,'栟':10,'桉':10,'栩':10,'彧':10,'鬲':10,'豇':10,'酐':10,'厝':10,'孬':10,'砝':10,'砹':10,'砧':10,'砷':10,
  '砟':10,'砼':10,'砥':10,'砣':10,'剞':10,'虔':10,'眩':10,'眙':10,'哧':10,'哽':10,'唔':10,'晁':10,'晏':10,'趵':10,'畛':10,
  '蚨':10,'蚜':10,'蚍':10,'蚋':10,'蚝':10,'蚧':10,'圄':10,'唣':10,'唏':10,'盎':10,'唑':10,'峪':10,'氤':10,'氦':10,'毪':10,
  '舐':10,'秣':10,'秫':10,'盉':10,'笊':10,'笏':10,'笆':10,'俸':10,'倩':10,'俵':10,'俳':10,'俶':10,'倬':10,'倏':10,'恁':10,
  '倭':10,'倪':10,'俾':10,'倜':10,'隼':10,'隽':10,'倌':10,'倥':10,'臬':10,'皋':10,'倨':10,'衄':10,'舫':10,'釜':10,'奚':10,
  '衾':10,'朕':10,'桀':10,'凇':10,'亳':10,'疳':10,'疴':10,'疸':10,'疽':10,'疱':10,'痂':10,'衮':10,'凋':10,'恣':10,'旆':10,
  '旄':10,'旃':10,'恙':10,'粑':10,'朔':10,'烜':10,'烊':10,'剡':10,'娑':10,'宸':10,'窈':10,'剜':10,'冢':10,'屐':10,'勐':10,
  '奘':10,'牂':10,'蚩':10,'姬':10,'娠':10,'娌':10,'娉':10,'娩':10,'娣':10,'娓':10,'畚':10,'邕':10,'眦':10,'疵':10,'邘':10,
  '讱':10,'訒':10,'辿':10,'刬':10,'剗':10,'芰':10,'芣':10,'苊':10,'苉':10,'芘':10,'芴':10,'芠':10,'芤':10,'轪':10,'軑':10,
  '觃':10,'覎':10,'屃':10,'屓':10,'纮':10,'紘':10,'纼':10,'紖':10,'肭':10,'肸':10,'肷':10,'玶':10,'珇':10,'珅':10,'珋':10,
  '玹':10,'珌':10,'玿':10,'埏':10,'挓':10,'拶':10,'秬':10,'俫':10,'倈':10,'舁':10,'洭':10,'洘':10,'洓':10,'洿':10,'泚':10,
  '洸':10,'洑':10,'洢':10,'洈':10,'洚':10,'洺':10,'洨':10,'洴':10,'洣':10,'恔':10,'宬':10,'祏':10,'祐':10,'祕':10,'恝':10,
  '玼':10,'埗':10,'垾':10,'垺':10,'埆':10,'垿':10,'埌':10,'埇':10,'栻':10,'桄':10,'栴':10,'栒':10,'酎':10,'酏':10,'砵':10,
  '砠':10,'砫':10,'砬':10,'恧':10,'翃':10,'剕':10,'哢':10,'晅':10,'晊':10,'哳':10,'哱':10,'冔':10,'晐':10,'蚄':10,'蚆':10,
  '崁':10,'峿':10,'帨':10,'崀':10,'眚':10,'甡':10,'倴':10,'倮':10,'倕':10,'倞':10,'倓':10,'倧':10,'衃':10,'虒':10,'舭':10,
  '舯':10,'舥':10,'瓞':10,'鬯':10,'朓':10,'虓':10,'峱':10,'眢':10,'勍':10,'痄':10,'疰':10,'痃':10,'竘':10,'羖':10,'羓':10,
  '桊':10,'敉':10,'烠':10,'烔':10,'宧':10,'窅':10,'窊':10,'扅':10,'扆':10,'隺':10,'疍':10,'烝':10,'砮':10,'哿':10,'翀':10,
  '翂':10,'剟':10,'訏':10,'軏':10,'紞':10,'娙':10,'垹':10,'竝':10,'挀':10,'栢':10,'剝':10,'宲':10,'瓟':10,'窇':10,'匎':10,
  '洝':10,'玵':10,'豻':10,'哵':10,'秡':10,'釟':10,'芺':10,'秚':10,'粄':10,'肦':10,'舨':10,'奙':10,'娭':10,'砨':10,'俻':10,
  '窆':10,'覍':10,'盋':10,'髟':10,'倂':10,'栤':10,'眪':10,'窉':10,'埄':10,'笓':10,'粃':10,'粊':10,'肹':10,'勏':10,'峬':10,
  '庯':10,'宷':10,'拺':10,'敇':10,'畟':10,'埁':10,'笒':10,'祡':10,'袃':10,'訍':10,'苂':10,'唓':10,'烢':10,'眧':10,'娍':10,
  '峸':10,'徎':10,'洆':10,'屒':10,'栕':10,'倁':10,'勑':10,'恀':10,'恜':10,'恥':10,'拸':10,'敊':10,'欫':10,'歭':10,'翄':10,
  '蚇':10,'衶':10,'栦':10,'舩':10,'剙':10,'埀':10,'桘':10,'芚':10,'哾':10,'娕':10,'娖':10,'栨':10,'玆':10,'珁':10,'皉':10,
  '畗':10,'倅':10,'粋':10,'翆':10,'紣':10,'拵':10,'剒':10,'夎':10,'貣':10,'唌':10,'耼':10,'衴':10,'訑':10,'釖':10,'恴':10,
  '埅':10,'埊':10,'眡':10,'秪':10,'恎':10,'挕':10,'眣':10,'倲':10,'戙':10,'挏':10,'痁':10,'訋':10,'娗':10,'剢':10,'挅':10,
  '挆':10,'桗':10,'峩':10,'蚅':10,'栭':10,'栮':10,'毦':10,'洏':10,'栰':10,'舧':10,'訉':10,'軓':10,'倣':10,'旊':10,'哹':10,
  '紑':10,'缹':10,'俷':10,'厞':10,'疿':10,'砩':10,'羒':10,'衯':10,'蚠':10,'蚡':10,'娐':10,'尃':10,'栿':10,'玸':10,'祔':10,
  '蚥':10,'衭':10,'倝':10,'迀':10,'笐':10,'峼':10,'挌':10,'峺':10,'峯':10,'宮':10,'拲':10,'栱':10,'冓':10,'玽':10,'痀':10,
  '芶':10,'凅':10,'唂':10,'唃':10,'恠':10,'烡':10,'庪':10,'恑':10,'哠':10,'恏':10,'俰':10,'哬':10,'敆':10,'欱':10,'狢':10,
  '釛':10,'拫':10,'哻':10,'唅':10,'圅':10,'娢':10,'娨':10,'肣':10,'苀':10,'蚢':10,'芲':10,'洉':10,'恆':10,'烆':10,'峵':10,
  '晎':10,'耾':10,'唍':10,'狟':10,'烉':10,'宺':10,'晄':10,'俿':10,'匫':10,'恗':10,'瓳':10,'恛':10,'拻':10,'洃':10,'烣':10,
  '蚘':10,'豗':10,'倱':10,'圂':10,'眓':10,'秮':10,'閄':10,'狤':10,'皍':10,'紒':10,'邔':10,'唊':10,'埉':10,'斚':10,'玾':10,
  '俴':10,'栫':10,'洊':10,'畕':10,'挢':10,'挍':10,'晈':10,'烄':10,'笅':10,'窌':10,'埐':10,'晉':10,'紟':10,'肵':10,'倢':10,
  '洯':10,'衱':10,'衸':10,'凈':10,'倃':10,'紤':10,'挗':10,'欮':10,'芵':10,'蚗':10,'冣':10,'毩':10,'洰':10,'眗':10,'勌':10,
  '埍':10,'埈':10,'蚐':10,'袀':10,'欬':10,'烗':10,'栞':10,'粇':10,'娔':10,'尅':10,'砢':10,'肻':10,'桍':10,'秙':10,'窋':10,
  '趶':10,'晇':10,'晆':10,'恇':10,'眖':10,'哴':10,'挄':10,'哰':10,'恅':10,'狫':10,'哷':10,'砳':10,'阞':10,'洡':10,'倰':10,
  '剓':10,'唎':10,'峲':10,'栵':10,'栛':10,'秜':10,'秝':10,'挒':10,'皊':10,'砱':10,'秢':10,'竛':10,'恡':10,'竜':10,'勎':10,
  '娽':10,'釠':10,'眿':10,'哤':10,'庬':10,'娏':10,'毣':10,'眛':10,'閅':10,'冡':10,'眫':10,'桙':10,'恈':10,'洠':10,'哶':10,
  '烕':10,'眜':10,'洦':10,'皌':10,'砞':10,'娒':10,'砪':10,'蚞':10,'挐':10,'痆':10,'娚':10,'畘':10,'娞':10,'屔':10,'眤':10,
  '衵':10,'秥':10,'拰':10,'挊':10,'洀':10,'肨':10,'皰':10,'砲':10,'娝':10,'肧':10,'倗':10,'恲':10,'娦':10,'砯':10,'秛':10,
  '秠':10,'肶':10,'烞':10,'砶':10,'哣':10,'倛':10,'剘':10,'斊':10,'旂':10,'栔':10,'疷':10,'芞':10,'蚑':10,'蚔':10,'蚚':10,
  '拪':10,'歬':10,'茾':10,'谸':10,'羗':10,'帩':10,'笉':10,'耹':10,'蚙':10,'凊':10,'剠':10,'桏':10,'唒':10,'恘':10,'紌':10,
  '釚':10,'宭':10,'峮':10,'帬':10,'珃':10,'肰':10,'蚒':10,'蚦':10,'衻':10,'浀':10,'恮':10,'洤':10,'烇':10,'牶':10,'牷':10,
  '毧':10,'粈':10,'栠':10,'栣':10,'芢':10,'桇':10,'邚':10,'朊':10,'毢':10,'桒':10,'狦':10,'邖':10,'赸':10,'栜':10,'粆':10,
  '娋':10,'弰':10,'恦':10,'扄':10,'珄':10,'烒':10,'眎':10,'峷':10,'眒':10,'眘':10,'倐':10,'洬':10,'娰':10,'恖':10,'肂':10,
  '倯':10,'祘':10,'笇':10,'哸':10,'倠':10,'狧':10,'舦':10,'洟':10,'倎':10,'恌':10,'晀':10,'祒':10,'晍':10,'狪':10,'紏':10,
  '唋':10,'峹':10,'庩':10,'娧':10,'毤':10,'砤':10,'託':10,'倇':10,'盌':10,'叞':10,'烓':10,'芛':10,'軎':10,'肳':10,'蚉':10,
  '倵':10,'娪':10,'粅':10,'屖':10,'恄':10,'欯':10,'烚':10,'蚟':10,'哯':10,'垷':10,'娊':10,'毨':10,'烍':10,'軐':10,'晑':10,
  '栙':10,'俲':10,'娎':10,'宯':10,'庨':10,'烋':10,'奊':10,'峫':10,'恊':10,'拹':10,'洩':10,'疶':10,'衺':10,'俽':10,'倖':10,
  '垶':10,'洐':10,'恟':10,'洶':10,'烌':10,'弲':10,'欰':10,'殈':10,'烅':10,'芧':10,'毥':10,'狥':10,'訙':10,'俹':10,'笌':10,
  '倄':10,'烑':10,'眑':10,'桖':10,'娫':10,'娮':10,'眏':10,'唈':10,'垼':10,'恞':10,'栘':10,'栧':10,'桋':10,'欭':10,'洂':10,
  '浂':10,'玴':10,'珆':10,'瓵':10,'貤':10,'迆':10,'圁':10,'垽':10,'峾':10,'栶':10,'洕':10,'泿':10,'烎':10,'訔':10,'唀':10,
  '峳':10,'庮':10,'栯':10,'秞':10,'肬':10,'苃':10,'俼':10,'娛':10,'砡':10,'迃':10,'酑':10,'笎':10,'蚖':10,'衏':10,'恱':10,
  '蚎':10,'蚏':10,'耺':10,'桚':10,'洅':10,'烖':10,'砦':10,'羘':10,'宱':10,'狣':10,'肁':10,'埑':10,'帪':10,'挋':10,'栚':10,
  '珎':10,'眕':10,'眞':10,'眐':10,'値':10,'娡':10,'徏':10,'恉':10,'挃':10,'栺':10,'洔':10,'洷':10,'疻':10,'祑':10,'衼':10,
  '釞':10,'蚛':10,'衳':10,'烐':10,'眝':10,'竚':10,'娤':10,'笍':10,'丵':10,'倳':10,'剚':10,'栥':10,'牸':10,'眥':10,'紎':10,
  '倊':10,'哫':10,'厜':10,'栬':10,'秨':10,'乾':11,'习':11,'習':11,'专':11,'專':11,'区':11,'區':11,'从':11,'從':11,'术':11,
  '術':11,'处':11,'處':11,'鸟':11,'鳥':11,'务':11,'務':11,'饥':11,'飢':11,'邦':11,'动':11,'動':11,'执':11,'執':11,'邪':11,
  '毕':11,'畢':11,'硃':11,'伟':11,'偉':11,'杀':11,'殺':11,'产':11,'產':11,'闭':11,'閉':11,'问':11,'問':11,'讶':11,'訝':11,
  '许':11,'許':11,'讹':11,'訛':11,'讼':11,'訟':11,'设':11,'設':11,'访':11,'訪':11,'诀':11,'訣':11,'那':11,'妇':11,'婦':11,
  '麦':11,'麥':11,'卤':11,'鹵':11,'坚':11,'堅':11,'岗':11,'崗':11,'帐':11,'帳':11,'近':11,'返':11,'狈':11,'狽':11,'条':11,
  '條':11,'迎':11,'启':11,'啓':11,'张':11,'張':11,'责':11,'責':11,'规':11,'規':11,'顶':11,'頂':11,'茉':11,'苦':11,'苛':11,
  '若':11,'茂':11,'苗':11,'英':11,'苟':11,'苑':11,'苞':11,'范':11,'茁':11,'茄':11,'苔':11,'茅':11,'厕':11,'厠':11,'顷':11,
  '頃':11,'斩':11,'斬':11,'软':11,'軟':11,'国':11,'國':11,'败':11,'敗':11,'贩':11,'販':11,'钓':11,'釣':11,'侦':11,'偵':11,
  '侧':11,'側':11,'货':11,'貨':11,'觅':11,'覓':11,'贪':11,'貪':11,'贫':11,'貧':11,'鱼':11,'魚':11,'视':11,'視':11,'参':11,
  '參':11,'组':11,'組':11,'绅':11,'紳':11,'细':11,'細':11,'终':11,'終':11,'绊':11,'絆':11,'绍':11,'紹':11,'贯':11,'貫':11,
  '挟':11,'挾':11,'挺':11,'挪':11,'带':11,'帶':11,'胡':11,'研':11,'牵':11,'牽':11,'背':11,'哑':11,'啞':11,'胃':11,'氢':11,
  '氫':11,'胚':11,'胞':11,'胖':11,'胎':11,'狭':11,'狹':11,'将':11,'將':11,'娄':11,'婁':11,'昼':11,'晝':11,'珠':11,'班':11,
  '匿':11,'捕':11,'捂':11,'振':11,'捎':11,'捍':11,'捏':11,'捉':11,'捆':11,'捐':11,'捌':11,'挫':11,'换':11,'挽':11,'捅':11,
  '挨':11,'梆':11,'啊':11,'健':11,'狸':11,'狼':11,'卿':11,'瓷':11,'羞':11,'瓶':11,'浙':11,'浦':11,'涉':11,'消':11,'浩':11,
  '海':11,'浴':11,'浮':11,'涣':11,'涕':11,'浪':11,'浸':11,'悖':11,'悟':11,'悄':11,'悍':11,'悔':11,'悦':11,'朗':11,'袖':11,
  '袍':11,'被':11,'祥':11,'域':11,'焉':11,'赦':11,'堆':11,'埠':11,'教':11,'培':11,'基':11,'聆':11,'勘':11,'聊':11,'娶':11,
  '勒':11,'械':11,'彬':11,'婪':11,'梗':11,'梧':11,'梢':11,'梅':11,'梳':11,'梯':11,'桶':11,'梭':11,'救':11,'曹':11,'副':11,
  '票':11,'酗':11,'厢':11,'戚':11,'硅':11,'盔':11,'爽':11,'匾':11,'雪':11,'虚':11,'彪':11,'雀':11,'堂':11,'常':11,'眶':11,
  '匙':11,'晨':11,'睁':11,'眯':11,'眼':11,'野':11,'啪':11,'啦':11,'曼':11,'晦':11,'晚':11,'啄':11,'啡':11,'趾':11,'啃':11,
  '略':11,'蚯':11,'蛀':11,'蛇':11,'唬':11,'唱':11,'患':11,'唾':11,'唯':11,'啤':11,'啥':11,'崖':11,'崎':11,'崔':11,'帷':11,
  '崩':11,'崇':11,'崛':11,'圈':11,'甜':11,'秸':11,'梨':11,'犁':11,'移':11,'笨':11,'笛':11,'笙':11,'符':11,'第':11,'敏':11,
  '做':11,'袋':11,'悠':11,'偶':11,'偎':11,'偷':11,'您':11,'售':11,'停':11,'偏':11,'兜':11,'假':11,'徘':11,'徙':11,'得':11,
  '舶':11,'船':11,'舵':11,'斜':11,'盒':11,'悉':11,'欲':11,'彩':11,'豚':11,'够':11,'凰':11,'祭':11,'凑':11,'减':11,'毫':11,
  '烹':11,'庶':11,'麻':11,'庵':11,'痊':11,'痕':11,'康':11,'庸':11,'鹿':11,'盗':11,'章':11,'竟':11,'商':11,'族':11,'望':11,
  '率':11,'着':11,'羚':11,'眷':11,'粘':11,'粗':11,'粒':11,'剪':11,'焊':11,'婆':11,'梁':11,'寇':11,'寅':11,'寄':11,'寂':11,
  '宿':11,'窒':11,'窑':11,'密':11,'尉':11,'蛋':11,'婚':11,'婉':11,'巢':11,'紫':11,'斌':11,'阡':11,'邢':11,'讷':11,'訥':11,
  '苣':11,'苎':11,'苡':11,'迓':11,'囵':11,'圇':11,'迕':11,'匦':11,'匭':11,'苷':11,'苯':11,'苤':11,'苫':11,'苜':11,'苴':11,
  '苒':11,'苘':11,'茌':11,'苻':11,'苓':11,'茆':11,'茀':11,'苕':11,'枧':11,'梘':11,'轭':11,'軛':11,'钍':11,'釷':11,'钎':11,
  '釺':11,'钏':11,'釧':11,'钒':11,'釩':11,'钕':11,'釹':11,'钗':11,'釵':11,'枭':11,'梟':11,'泾':11,'涇':11,'绀':11,'紺':11,
  '绁':11,'紲':11,'绂':11,'紱':11,'绌':11,'絀':11,'垭':11,'埡':11,'垩':11,'堊':11,'胄':11,'剐':11,'剮':11,'胛':11,'胂':11,
  '胙':11,'胍':11,'胗':11,'胝':11,'胤':11,'烃':11,'烴':11,'浃':11,'浹':11,'涎':11,'胥':11,'娅':11,'婭':11,'珥':11,'珙':11,
  '珩':11,'珧':11,'珣':11,'珞':11,'敖':11,'挹':11,'捋':11,'捃':11,'梃':11,'晟':11,'趿':11,'崃':11,'崍':11,'罡':11,'罟':11,
  '偌':11,'徕':11,'徠':11,'狷':11,'猁':11,'狳':11,'狺':11,'涑':11,'浯':11,'涅':11,'浞':11,'涓':11,'浥':11,'涔':11,'浜':11,
  '浠':11,'浣':11,'浚':11,'悚':11,'悝':11,'悒':11,'悌':11,'悛':11,'袒':11,'袢':11,'屙':11,'婀':11,'彗':11,'耜':11,'舂':11,
  '埴':11,'埯':11,'埸':11,'埵':11,'埤':11,'埝':11,'堋':11,'堍':11,'堉':11,'埭':11,'埽':11,'聃':11,'堇':11,'梵':11,'梏':11,
  '桴':11,'桷':11,'梓':11,'棁':11,'桫':11,'敕':11,'豉':11,'酞':11,'酚':11,'戛':11,'硎':11,'硒':11,'硗':11,'硐':11,'硇':11,
  '硌':11,'瓠':11,'匏':11,'厩':11,'殍':11,'雩':11,'眭':11,'晡':11,'晤':11,'眺':11,'眵':11,'眸':11,'圊':11,'啉':11,'勖':11,
  '晞':11,'唵':11,'晗':11,'冕':11,'畦':11,'趺':11,'蚶':11,'蛄':11,'蛆':11,'蚰':11,'圉':11,'蚱':11,'蛉':11,'蚴':11,'啁':11,
  '啕':11,'唿':11,'啐':11,'唼':11,'唷':11,'啖':11,'啵':11,'啶':11,'啷':11,'唳':11,'唰':11,'啜':11,'崚':11,'崦':11,'崮':11,
  '崤':11,'崆':11,'氪':11,'牾':11,'笸':11,'笪':11,'笮':11,'笠':11,'笥':11,'笤':11,'笳':11,'笞':11,'偃':11,'偕':11,'偈':11,
  '偬':11,'皎':11,'徜':11,'舸':11,'舴':11,'舷':11,'翎':11,'匐':11,'斛':11,'馗':11,'孰':11,'庹':11,'痔':11,'痍':11,'翊':11,
  '旌':11,'旎':11,'袤':11,'粕':11,'焐':11,'烯':11,'焓':11,'烽':11,'烷':11,'焗':11,'挲':11,'窕':11,'扈':11,'粜':11,'婧':11,
  '婊':11,'婕':11,'娼':11,'婢':11,'胬':11,'袈':11,'翌':11,'恿':11,'欸':11,'邨':11,'邠':11,'邡':11,'闫':11,'閆':11,'讻':11,
  '訩':11,'纻':11,'紵':11,'茋':11,'苾':11,'苠':11,'岽':11,'崬':11,'钐':11,'釤':11,'绋':11,'紼':11,'绐':11,'紿':11,'耇':11,
  '茈':11,'䌹':11,'絅':11,'胠':11,'胈':11,'胩':11,'胣':11,'珪':11,'珛':11,'珖':11,'珦':11,'珫':11,'珒':11,'珢':11,'珕':11,
  '珝':11,'梠':11,'梴':11,'笫':11,'倻':11,'狴':11,'狻':11,'烶':11,'烻':11,'涍':11,'浡':11,'浭':11,'浬':11,'涄':11,'涐':11,
  '浰':11,'浟':11,'浛':11,'浼':11,'浲':11,'涘':11,'悈':11,'悃':11,'悢':11,'袪':11,'袗':11,'祧':11,'堎':11,'堐':11,'埼':11,
  '埫':11,'堌':11,'晢':11,'梽':11,'桲':11,'桯':11,'梣':11,'梌':11,'桹':11,'敔':11,'硔':11,'硊':11,'硍':11,'勔':11,'唪':11,
  '翈':11,'晙':11,'畤':11,'跂':11,'蛃':11,'蚲':11,'蚺':11,'崧':11,'崟':11,'崞':11,'崒':11,'崌':11,'崡':11,'牻':11,'牿':11,
  '稆':11,'笱':11,'笯':11,'偰':11,'偡':11,'偭':11,'偲':11,'偁':11,'偓':11,'徛':11,'衒':11,'舳':11,'舲':11,'悆':11,'觖':11,
  '庱':11,'庳':11,'痓':11,'堃':11,'羝':11,'羕':11,'焆':11,'烺':11,'焌':11,'寁':11,'艴':11,'弸':11,'弶':11,'婞':11,'娵':11,
  '婍':11,'婌':11,'婫':11,'婤':11,'婘':11,'婠':11,'埨':11,'浿':11,'軝':11,'釴':11,'晛':11,'梜':11,'強':11,'悅':11,'埲':11,
  '挷':11,'邫':11,'笣':11,'珤':11,'蚫':11,'袌':11,'茇':11,'豝':11,'跁':11,'梎':11,'埿':11,'桳':11,'翉':11,'啀':11,'娾':11,
  '硋':11,'偝':11,'桮':11,'梖':11,'紴':11,'苝':11,'挬':11,'胉':11,'苩':11,'袚':11,'蚾':11,'蛂':11,'偋':11,'屛':11,'庰':11,
  '苪':11,'偪':11,'啚':11,'梐':11,'袐':11,'迊':11,'閇':11,'悑':11,'捗':11,'啋':11,'埰':11,'婇':11,'寀':11,'飡':11,'粣':11,
  '梫':11,'袩':11,'偖':11,'烲':11,'聅':11,'偛':11,'挿':11,'觘':11,'訬':11,'埥':11,'悜':11,'挰':11,'梬':11,'浾':11,'敐':11,
  '桭':11,'訦':11,'趻':11,'軙':11,'乿':11,'烾':11,'粚':11,'耛':11,'蚳':11,'赿':11,'崈':11,'浺':11,'痋':11,'偢':11,'紬':11,
  '埱':11,'耝':11,'剶':11,'窓':11,'偆':11,'浱':11,'婥':11,'偨':11,'秶':11,'紪':11,'茊':11,'赼':11,'梀':11,'觕':11,'畣':11,
  '笚':11,'迏':11,'迖':11,'啛':11,'婃':11,'孮':11,'徖':11,'悤':11,'虘':11,'蚮':11,'軚':11,'釱':11,'啗':11,'躭':11,'酖':11,
  '偒':11,'偙':11,'啇':11,'埞':11,'梊':11,'梑':11,'焍':11,'眱':11,'苐':11,'苖':11,'袛':11,'啑':11,'戜':11,'眰':11,'胅':11,
  '苵':11,'埬':11,'娻':11,'崠':11,'笗':11,'眮':11,'苳':11,'唸':11,'婝':11,'婰':11,'弴':11,'奝':11,'彫':11,'蛁':11,'婈':11,
  '靪':11,'飣':11,'秺':11,'梪':11,'毭':11,'浢':11,'酘':11,'偳':11,'剬':11,'剫':11,'崜':11,'敚':11,'痑':11,'卾':11,'偔':11,
  '娿':11,'婐':11,'硆':11,'迗':11,'唲':11,'眲':11,'笩':11,'婏':11,'盕':11,'笲':11,'笵':11,'觙':11,'軡':11,'趽':11,'畡':11,
  '缻':11,'奜':11,'婓':11,'屝':11,'婔':11,'胐':11,'胇':11,'胏':11,'梤':11,'訜':11,'冨':11,'偩':11,'旉':11,'烰':11,'笰':11,
  '紨':11,'翇':11,'胕':11,'虙':11,'蚹':11,'袝':11,'邞':11,'桿':11,'笴':11,'粓':11,'釬':11,'堈':11,'釭':11,'皐':11,'祮':11,
  '挭':11,'偑':11,'捀':11,'桻':11,'覂':11,'啂':11,'夠':11,'耈':11,'蚼':11,'袧':11,'啒':11,'崓':11,'笟':11,'罛':11,'苽':11,
  '捖':11,'桰':11,'迋':11,'祪':11,'窐':11,'趹':11,'袞':11,'袬':11,'烸':11,'晧':11,'悎':11,'啝':11,'焃':11,'秴':11,'蚵':11,
  '袔':11,'晘':11,'晥':11,'梒':11,'浫':11,'涆':11,'閈':11,'貥':11,'迒':11,'崋':11,'釪':11,'釫':11,'啈':11,'悙':11,'浤':11,
  '紭':11,'苰':11,'谹':11,'梙':11,'梡':11,'偟':11,'奛':11,'朚':11,'壷':11,'婟':11,'焀':11,'烼':11,'苸':11,'虖':11,'婎':11,
  '痐':11,'焄':11,'剨':11,'捇':11,'秳':11,'邩':11,'偮':11,'卙':11,'唶':11,'庴':11,'旣':11,'梞':11,'焏':11,'茍':11,'谻':11,
  '硈':11,'耞':11,'舺':11,'偂':11,'帴':11,'挸':11,'珔':11,'豜':11,'敎':11,'捁':11,'珓':11,'覐':11,'唫':11,'訡':11,'崨':11,
  '徣':11,'痎':11,'罝':11,'婙':11,'婛':11,'旍':11,'桱':11,'梷':11,'殌':11,'殑':11,'浻':11,'烱':11,'捄':11,'镹':11,'捔':11,
  '赽':11,'偊':11,'埧':11,'埾':11,'婅':11,'婮':11,'挶':11,'梮':11,'粔':11,'耟':11,'絇':11,'蚷':11,'袓':11,'埢':11,'悁':11,
  '朘':11,'桾':11,'勓':11,'偘':11,'埳':11,'邟':11,'堁':11,'胢':11,'挳':11,'牼':11,'釦':11,'堀':11,'焅':11,'欳':11,'頄':11,
  '欵':11,'硄':11,'軖':11,'軠':11,'朖':11,'欴':11,'崐':11,'崑':11,'晜':11,'梱':11,'涃':11,'翋':11,'唻':11,'婡':11,'庲':11,
  '浶':11,'珯':11,'浨':11,'婯':11,'悡':11,'梩':11,'梸':11,'涖':11,'苙':11,'蚸':11,'涊':11,'翏':11,'浖':11,'笭':11,'紷':11,
  '衑':11,'袊':11,'悋':11,'崊':11,'屚':11,'旈':11,'桺':11,'挵':11,'梇':11,'玈':11,'硉':11,'婨':11,'崘':11,'崙':11,'悗':11,
  '恾':11,'浝':11,'狵':11,'釯':11,'罞':11,'笷':11,'覒':11,'軞':11,'酕':11,'挴':11,'苺':11,'覔':11,'婂':11,'崏':11,'笢':11,
  '罠':11,'朙':11,'眳':11,'眽':11,'粖':11,'絈':11,'胟':11,'笝':11,'袦':11,'訤':11,'軜':11,'豽':11,'雫':11,'匘':11,'堄':11,
  '婗':11,'胒':11,'苨':11,'蚭':11,'苶':11,'偄':11,'挼':11,'梛':11,'袙':11,'珮':11,'梈':11,'皏':11,'硑':11,'帲':11,'胓':11,
  '崥':11,'悂':11,'旇':11,'耚':11,'翍':11,'蚽':11,'豼':11,'覑':11,'婄':11,'捊':11,'烳':11,'唭':11,'啔':11,'娸':11,'帺':11,
  '桼':11,'釮':11,'殎':11,'婜':11,'孯':11,'悓':11,'唴':11,'啌':11,'釥':11,'悏':11,'笡':11,'珡':11,'赺':11,'赾':11,'啨':11,
  '寈':11,'殸':11,'赹':11,'梂':11,'殏':11,'浗':11,'毬':11,'苬':11,'蛅':11,'袡':11,'紶':11,'翑':11,'胊':11,'硂':11,'芿':11,
  '釰':11,'烿':11,'梕':11,'秹':11,'桵':11,'訯':11,'挻':11,'笘':11,'帹':11,'桬':11,'袑':11,'偗':11,'晠':11,'苼':11,'釶':11,
  '埶':11,'秲':11,'笶':11,'絁':11,'敒':11,'涁':11,'訠':11,'邥':11,'阠':11,'捒':11,'焂':11,'絉':11,'袕':11,'軗':11,'娷':11,
  '挩':11,'涗':11,'眴':11,'欶':11,'洍':11,'釲':11,'飤':11,'庺':11,'梥':11,'挱':11,'殐':11,'珟':11,'奞':11,'埣':11,'浽':11,
  '崉':11,'偍':11,'屜':11,'悐':11,'挮':11,'婒':11,'埮':11,'舑':11,'唺':11,'婖':11,'甛':11,'紾':11,'胋':11,'蛈':11,'涏':11,
  '浵':11,'痌':11,'秱':11,'匬':11,'悇':11,'捈':11,'涋':11,'迌':11,'啍':11,'涒':11,'訰':11,'豘':11,'軘':11,'迍':11,'紽':11,
  '袉':11,'袥':11,'阤':11,'啘':11,'聉':11,'埦':11,'帵':11,'梚':11,'貦':11,'崣':11,'梶':11,'浘':11,'痏':11,'苿':11,'阢':11,
  '桽':11,'剭':11,'啎':11,'娬':11,'悞':11,'洖':11,'窏':11,'唽':11,'悕':11,'桸':11,'欷':11,'焈':11,'焁':11,'狶':11,'羛':11,
  '訢':11,'赥':11,'釳':11,'珨':11,'祫':11,'谺':11,'迬':11,'婑':11,'唩':11,'娹':11,'涀':11,'珗':11,'絃':11,'胘':11,'苮':11,
  '蚿':11,'袨':11,'訮':11,'赻':11,'婋':11,'焇':11,'偞':11,'卨':11,'徢':11,'焎':11,'訫':11,'邤':11,'梋':11,'偦':11,'勗':11,
  '敍':11,'珬':11,'祤':11,'虗':11,'偱':11,'崕':11,'偠':11,'窔':11,'苭':11,'袎':11,'訞':11,'偐':11,'偣':11,'婩':11,'狿':11,
  '珚':11,'硏':11,'酓':11,'珜':11,'紻':11,'眻':11,'胦':11,'偯':11,'悘':11,'悥':11,'捙':11,'殹':11,'浳':11,'笖':11,'苢':11,
  '袘':11,'袣':11,'訲':11,'豙':11,'豛':11,'阣':11,'隿':11,'埜':11,'捓':11,'凐':11,'婣':11,'婬':11,'秵':11,'偀':11,'浧':11,
  '唹':11,'悀':11,'苚':11,'偤':11,'梄':11,'聈':11,'訧':11,'盓':11,'厡':11,'寃':11,'邧':11,'跀':11,'紮':11,'捑':11,'捚':11,
  '梍':11,'偧':11,'苲':11,'蚻':11,'啠':11,'悊':11,'晣':11,'眹':11,'聄':11,'酙':11,'埩':11,'崝':11,'崢':11,'聇':11,'偫':11,
  '徝':11,'梔':11,'狾':11,'祬':11,'秷':11,'紩':11,'翐':11,'胑':11,'袠':11,'袟':11,'觗':11,'訨':11,'偅':11,'眾':11,'徟':11,
  '珘':11,'矪':11,'粙':11,'祩':11,'秼':11,'笜':11,'紸':11,'羜':11,'罜':11,'梉':11,'焋':11,'娺':11,'埻':11,'啅':11,'梲':11,
  '烵':11,'胔':11,'釨':11,'絊':11,'酔':11,'捘':11,'袏':11,'几':12,'幾':12,'开':12,'開':12,'無':12,'云':12,'雲':12,'为':12,
  '爲':12,'冯':12,'馮':12,'发':12,'發':12,'丝':12,'絲':12,'扫':12,'掃':12,'场':12,'場':12,'尧':12,'堯':12,'乔':12,'喬':12,
  '众':12,'衆':12,'伞':12,'傘':12,'创':12,'創':12,'寻':12,'尋':12,'阴':12,'防':12,'买':12,'買':12,'韧':12,'韌':12,'抡':12,
  '掄':12,'壳':12,'殼':12,'报':12,'報':12,'劳':12,'勞':12,'围':12,'圍':12,'困':12,'睏':12,'闰':12,'閏':12,'闲':12,'閑':12,
  '间':12,'間':12,'闷':12,'悶':12,'沦':12,'淪':12,'评':12,'評':12,'诈':12,'詐':12,'诉':12,'訴':12,'诊':12,'診':12,'词':12,
  '詞':12,'现':12,'現':12,'杰':12,'述':12,'丧':12,'喪':12,'画':12,'畫':12,'枣':12,'棗':12,'虏':12,'虜':12,'迪':12,'凯':12,
  '凱':12,'贬':12,'貶':12,'贮':12,'貯':12,'迭':12,'迫':12,'舍':12,'捨':12,'胁':12,'脅':12,'备':12,'備':12,'卷':12,'捲':12,
  '单':12,'單':12,'浅':12,'淺':12,'迢':12,'贰':12,'貳':12,'项':12,'項':12,'荆':12,'茸':12,'茬':12,'草':12,'茵':12,'茶':12,
  '荒':12,'茫':12,'荔':12,'栈':12,'棧':12,'栋':12,'棟':12,'砚':12,'硯':12,'残':12,'殘':12,'轴':12,'軸':12,'贵':12,'貴':12,
  '勋':12,'勛':12,'哟':12,'喲':12,'贴':12,'貼':12,'贻':12,'貽':12,'钙':12,'鈣':12,'钝':12,'鈍':12,'钞':12,'鈔':12,'钠':12,
  '鈉':12,'钦':12,'欽':12,'钧':12,'鈞':12,'钩':12,'鈎':12,'钮':12,'鈕':12,'复':12,'復':12,'贷':12,'貸':12,'顺':12,'順':12,
  '须':12,'須':12,'胜':12,'勝':12,'脉':12,'贸':12,'貿':12,'兹':12,'费':12,'費':12,'贺':12,'賀':12,'绒':12,'絨':12,'结':12,
  '結':12,'给':12,'給':12,'绚':12,'絢':12,'络':12,'絡':12,'绝':12,'絶':12,'绞':12,'絞':12,'统':12,'統':12,'壶':12,'壺':12,
  '恶':12,'惡':12,'笔':12,'筆':12,'胰':12,'脆':12,'脂':12,'胸':12,'胳':12,'脊':12,'傢':12,'能':12,'球':12,'理':12,'琉':12,
  '琅':12,'捧':12,'堵':12,'措':12,'捺':12,'掩':12,'捷':12,'排':12,'掉':12,'捶':12,'推':12,'掀':12,'授':12,'捻':12,'掏':12,
  '掐':12,'掠':12,'掂':12,'接':12,'控':12,'探':12,'掘':12,'黄':12,'奢':12,'盛':12,'距':12,'象':12,'猜':12,'猖':12,'猛':12,
  '廊':12,'清':12,'添':12,'淋':12,'涯':12,'淹':12,'淑':12,'淌':12,'混':12,'淮':12,'淆':12,'渊':12,'淵':12,'淫':12,'淘':12,
  '淳':12,'液':12,'淤':12,'淡':12,'深':12,'涮':12,'涵':12,'情':12,'惜':12,'悼':12,'惕':12,'惟':12,'惦':12,'悴':12,'惋':12,
  '袱':12,'敢':12,'屠':12,'斑':12,'替':12,'款':12,'堪':12,'堰':12,'越':12,'趁':12,'超':12,'堤':12,'博':12,'喜':12,'彭':12,
  '煮':12,'裁':12,'壹':12,'斯':12,'期':12,'欺':12,'散':12,'朝':12,'辜':12,'棒':12,'棱':12,'棋':12,'植':12,'森':12,'焚':12,
  '椅':12,'椒':12,'棵':12,'棍':12,'椎':12,'棉':12,'棚':12,'棕':12,'棺':12,'惠':12,'惑':12,'粟':12,'棘':12,'酣':12,'酥':12,
  '厨':12,'硬':12,'硝':12,'硫':12,'雁':12,'殖':12,'裂':12,'雄':12,'雅':12,'悲':12,'敞':12,'棠':12,'掌':12,'晴':12,'暑':12,
  '最':12,'晰':12,'量':12,'喳':12,'晶':12,'喇':12,'喊':12,'晾':12,'景':12,'跋':12,'跌':12,'跑':12,'跛':12,'蛙':12,'蛛':12,
  '蛤':12,'喝':12,'喂':12,'喘':12,'喉':12,'喻':12,'啼':12,'喧':12,'嵌':12,'幅':12,'帽':12,'黑':12,'甥':12,'掰':12,'短':12,
  '智':12,'氮':12,'毯':12,'氯':12,'剩':12,'稍':12,'程':12,'稀':12,'税':12,'筐':12,'等':12,'策':12,'筒':12,'筏':12,'答':12,
  '筋':12,'筝':12,'傅':12,'牌':12,'堡':12,'集':12,'焦':12,'傍':12,'皓':12,'皖':12,'粤':12,'奥':12,'街':12,'循':12,'舒':12,
  '番':12,'惫':12,'然':12,'就':12,'敦':12,'痘':12,'痢':12,'痪':12,'痛':12,'童':12,'竣':12,'善':12,'翔':12,'羡':12,'普':12,
  '尊':12,'奠':12,'曾':12,'焰':12,'割':12,'寒':12,'富':12,'寓':12,'窖':12,'窗':12,'窘':12,'雇':12,'禄':12,'犀':12,'强':12,
  '粥':12,'疏':12,'媒':12,'絮':12,'媚':12,'婿':12,'登':12,'驭':12,'馭':12,'扪':12,'捫':12,'伧':12,'傖':12,'讵':12,'詎':12,
  '阱':12,'阮':12,'阪':12,'邯':12,'邴':12,'邳':12,'邶':12,'帏':12,'幃':12,'岚':12,'嵐':12,'邱':12,'邸':12,'闳':12,'閎':12,
  '闵':12,'閔':12,'怅':12,'悵':12,'诂':12,'詁':12,'诃':12,'訶':12,'诅':12,'詛':12,'诋':12,'詆':12,'诏':12,'詔':12,'诒':12,
  '詒':12,'邵':12,'邰':12,'茚':12,'枨':12,'棖':12,'迥':12,'剀':12,'剴':12,'迮':12,'迤':12,'迦':12,'迨':12,'顸':12,'頇':12,
  '贲':12,'賁':12,'茜':12,'荑':12,'贳':12,'貰':12,'茼':12,'茴':12,'茱':12,'茯':12,'荏':12,'荇':12,'荃':12,'荀':12,'茗':12,
  '茭':12,'茨':12,'茹':12,'砗':12,'硨':12,'轱':12,'軲':12,'轲':12,'軻':12,'轶':12,'軼':12,'轸':12,'軫':12,'觇':12,'覘':12,
  '帧':12,'幀':12,'贶':12,'貺':12,'钚':12,'鈈':12,'钛':12,'鈦':12,'钣':12,'鈑':12,'钤':12,'鈐':12,'钫':12,'鈁':12,'钯':12,
  '鈀':12,'绔':12,'絝':12,'绗':12,'絎':12,'绛':12,'絳':12,'埚':12,'堝':12,'氩':12,'氬':12,'笄':12,'胯':12,'胱':12,'胴':12,
  '胭':12,'胼':12,'脒':12,'胺':12,'痉':12,'痙':12,'涞':12,'淶':12,'娲':12,'媧':12,'琇':12,'捯':12,'赧':12,'捭':12,'掬':12,
  '掖':12,'捽':12,'掊':12,'捩':12,'掮':12,'掇':12,'棻':12,'硭':12,'硖':12,'硤':12,'喏':12,'喵':12,'筇':12,'傀':12,'猗':12,
  '猞':12,'猝':12,'庾':12,'敝':12,'渚':12,'淇':12,'淅':12,'淞':12,'涿':12,'淖':12,'淠':12,'涸':12,'淦':12,'淝':12,'淬':12,
  '涪':12,'淙':12,'涫':12,'渌':12,'淄':12,'悻':12,'悱':12,'惝':12,'惘':12,'悸':12,'惆':12,'惚':12,'惇':12,'袷':12,'裉':12,
  '耠':12,'堞':12,'堙':12,'趄':12,'塄':12,'耋':12,'蛩':12,'聒':12,'靰':12,'戟':12,'棼':12,'棹':12,'棰':12,'椋':12,'椁':12,
  '椪':12,'棣':12,'椐':12,'覃':12,'酤':12,'酢':12,'酡':12,'厥':12,'雯':12,'雱':12,'斐':12,'睄':12,'睇':12,'睃':12,'喋':12,
  '喃':12,'喱':12,'喹':12,'晷':12,'喈':12,'跖':12,'跗':12,'跚':12,'跎':12,'跏':12,'跆':12,'蛭':12,'蛐':12,'蛔':12,'蛞':12,
  '蛟':12,'蛘':12,'喁':12,'喟':12,'啾':12,'喑':12,'喀':12,'喔':12,'喙':12,'嵖':12,'崴':12,'詈':12,'嵎':12,'崽':12,'嵛':12,
  '幄':12,'嵋':12,'掣':12,'矬':12,'氰':12,'毳':12,'犄':12,'犋':12,'嵇':12,'黍':12,'稃':12,'稂':12,'筌':12,'傣':12,'傈':12,
  '舄':12,'徨':12,'畲':12,'弑':12,'翕':12,'釉':12,'舜':12,'貂':12,'觚':12,'飧':12,'痣':12,'痦':12,'痞':12,'痤':12,'痧':12,
  '竦':12,'啻':12,'粞':12,'焯':12,'焜':12,'焙':12,'焱':12,'寐':12,'扉':12,'幂':12,'孱':12,'弼':12,'巽':12,'媪':12,'媛':12,
  '婷':12,'皴':12,'婺':12,'彘':12,'訾':12,'跐':12,'闶':12,'閌':12,'诇':12,'詗':12,'邲':12,'诎':12,'詘':12,'诐':12,'詖':12,
  '荖':12,'荁':12,'茽':12,'荄':12,'茺':12,'茳':12,'茛':12,'轵':12,'軹':12,'轷':12,'軤':12,'轺':12,'軺':12,'钘':12,'鈃':12,
  '钪':12,'鈧':12,'钬':12,'鈥':12,'钭':12,'鈄':12,'绖':12,'絰':12,'珹':12,'琊':12,'珽':12,'桠':12,'椏':12,'硁':12,'硜':12,
  '赀':12,'貲':12,'脎':12,'胲':12,'堲':12,'珸':12,'珵':12,'琄':12,'琈':12,'琀':12,'珺':12,'掭':12,'掎':12,'掞':12,'埪':12,
  '梾':12,'棶':12,'瓻':12,'猇':12,'猊':12,'猄':12,'淏':12,'淟':12,'淜':12,'淴':12,'淯':12,'湴':12,'涴':12,'惛':12,'惔':12,
  '悰':12,'惙':12,'袼':12,'祲':12,'婼':12,'媖':12,'絜':12,'堾':12,'堼':12,'堧':12,'喆':12,'堨':12,'堠':12,'惎':12,'靬':12,
  '棤':12,'棽':12,'棫':12,'椓':12,'椑':12,'椆':12,'棓':12,'棬':12,'棪':12,'椀':12,'甦':12,'奡':12,'皕':12,'硪':12,'欹':12,
  '棐':12,'黹':12,'牚':12,'睎':12,'晫':12,'晪':12,'晱':12,'蛑':12,'畯':12,'斝':12,'喤':12,'崶':12,'嵁':12,'崾':12,'嵅':12,
  '崿':12,'圌':12,'淼':12,'犇':12,'稌':12,'筀':12,'筘':12,'筅':12,'傃':12,'傉':12,'傒':12,'傕':12,'舾':12,'畬':12,'凓':12,
  '粢':12,'旐':12,'焞':12,'欻':12,'甯':12,'棨':12,'扊':12,'婻':12,'媆':12,'媞':12,'媓':12,'媂':12,'媄':12,'矞':12,'堽':12,
  '詝':12,'睍':12,'鈇':12,'釿':12,'絪':12,'黃':12,'幇':12,'軮':12,'棑':12,'猈':12,'絔':12,'堢':12,'媕':12,'啽':12,'晻':12,
  '荌':12,'阥':12,'詙':12,'軷':12,'詏':12,'軪':12,'镺':12,'捹':12,'渀':12,'軬':12,'凒':12,'捱':12,'阨':12,'珼':12,'絥':12,
  '軰':12,'徧':12,'淿':12,'袹':12,'淲':12,'猋':12,'颩':12,'椕':12,'傡':12,'寎':12,'掤':12,'棅':12,'絣':12,'奟':12,'閍':12,
  '堛':12,'弻':12,'貱':12,'採':12,'棌':12,'叅':12,'喰':12,'朁':12,'凔':12,'廁':12,'茦':12,'靫':12,'惉':12,'棎':12,'硟':12,
  '硩':12,'詀':12,'迠':12,'晿':12,'淐':12,'焻':12,'瓺':12,'焣':12,'堘':12,'掁':12,'棦':12,'椉':12,'淨':12,'睈':12,'窚':12,
  '脀':12,'捵':12,'祳':12,'茞':12,'趂':12,'迧':12,'鈂':12,'喫':12,'徥':12,'欼':12,'淔':12,'筂':12,'胵':12,'荎':12,'袳':12,
  '袲':12,'訵':12,'貾':12,'迣':12,'迡':12,'絒':12,'臰':12,'傗':12,'珿':12,'豠':12,'荈':12,'媋':12,'犉':12,'涰':12,'絘':12,
  '茲':12,'蛓':12,'趀':12,'辝':12,'媨':12,'剳':12,'匒':12,'荅':12,'詚':12,'焠':12,'脃':12,'袸':12,'棇':12,'焧':12,'睉':12,
  '軩':12,'啿':12,'媅':12,'觛':12,'婸':12,'盜':12,'悳':12,'淂':12,'棏':12,'掋':12,'珶':12,'祶':12,'觝':12,'趆':12,'軧':12,
  '靮':12,'耊':12,'聑':12,'臷':12,'詄':12,'趃':12,'跕':12,'涷':12,'衕':12,'厧':12,'傎':12,'敟':12,'鈟':12,'喥':12,'帾':12,
  '靯':12,'阧':12,'媏':12,'崸':12,'媠':12,'敠':12,'毲':12,'痥':12,'茤':12,'堮':12,'珴':12,'皒':12,'睋':12,'豟':12,'軶':12,
  '鈋':12,'聏':12,'胹':12,'荋':12,'衈':12,'袻':12,'傠':12,'茷':12,'棥':12,'淓':12,'絠':12,'祴':12,'絯':12,'殕':12,'雬':12,
  '渄':12,'猆':12,'靟':12,'鈖':12,'雰':12,'媍':12,'捬':12,'棴':12,'焤':12,'盙':12,'秿':12,'荂':12,'蛗':12,'詂':12,'軵':12,
  '凲':12,'涻':12,'稈':12,'詌':12,'掆':12,'棡':12,'焵':12,'犅':12,'阬':12,'祰':12,'稁':12,'臯':12,'茖':12,'臵':12,'蛒':12,
  '堩':12,'稉':12,'絚':12,'絙':12,'堸':12,'焨':12,'匑':12,'蛬':12,'傋':12,'茩':12,'訽':12,'豿':12,'軥':12,'棝':12,'淈':12,
  '焸':12,'軱':12,'掛':12,'筈':12,'絓':12,'罣':12,'悺':12,'悹':12,'茪':12,'臦':12,'胿':12,'茥':12,'袿':12,'蛫':12,'惃':12,
  '掍':12,'惈':12,'淉':12,'猓':12,'鈛':12,'奤':12,'傐':12,'椃':12,'茠':12,'喛':12,'嵑':12,'惒':12,'訸':12,'淊':12,'皔':12,
  '睅':12,'筕':12,'帿':12,'缿':12,'豞':12,'胻':12,'焢':12,'硡':12,'竤':12,'粠':12,'舼':12,'鈜':12,'喚':12,'堚':12,'寏':12,
  '嵈':12,'睆':12,'堭':12,'崲':12,'軦':12,'喖':12,'媩':12,'絗':12,'虝':12,'媈':12,'蛕':12,'棞':12,'棔':12,'殙':12,'涽':12,
  '焝':12,'祵':12,'喐':12,'掝':12,'喞':12,'嵆':12,'攲':12,'朞':12,'筓':12,'臮':12,'蛣':12,'鈒':12,'鈘':12,'婽':12,'徦':12,
  '戞':12,'堿':12,'寋':12,'惤':12,'牋':12,'猏':12,'硷':12,'臶':12,'詃':12,'跈':12,'雃':12,'閒':12,'袶':12,'焳':12,'筊':12,
  '茮':12,'堻':12,'惍':12,'荕':12,'傑':12,'堦':12,'堺':12,'媎':12,'媘':12,'椄':12,'袺':12,'竧':12,'荊':12,'絕':12,'趉':12,
  '鈌':12,'椇':12,'椈':12,'毱':12,'淗':12,'涺':12,'跔':12,'跙':12,'邭':12,'淃':12,'瓹':12,'睊':12,'絭':12,'惂':12,'欿':12,
  '敤':12,'翗':12,'衉':12,'迲':12,'涳':12,'悾':12,'窛':12,'袴':12,'跍':12,'絖':12,'嫏':12,'硠':12,'猑':12,'硱':12,'稇':12,
  '髠':12,'猍':12,'惏':12,'淚':12,'絫':12,'厤':12,'悷':12,'棙':12,'棃':12,'犂':12,'琍':12,'茘':12,'蛠':12,'堜':12,'媡':12,
  '淰':12,'喨':12,'掚':12,'涼':12,'尞':12,'蛚':12,'茢':12,'掕':12,'淩':12,'琌':12,'跉':12,'詅':12,'軨':12,'晽':12,'焛':12,
  '粦':12,'硦':12,'衖':12,'椂':12,'淥':12,'淕':12,'惀':12,'棆':12,'笿':12,'傌':12,'脈':12,'衇':12,'睌':12,'痝':12,'硥':12,
  '茻':12,'堥':12,'媌':12,'媢':12,'堳':12,'嵄':12,'珻':12,'痗':12,'睂':12,'脄':12,'跊':12,'淧':12,'喕':12,'媔':12,'覕':12,
  '捪':12,'庿':12,'凕':12,'蛨':12,'貃':12,'畮':12,'雮':12,'貀':12,'詉':12,'惄':12,'掜':12,'晲':12,'棿':12,'淣':12,'跜':12,
  '惗':12,'棯':12,'寍':12,'喦':12,'敜':12,'捼':12,'猅':12,'詊':12,'跘':12,'胮':12,'舽':12,'軳':12,'毰':12,'阫':12,'掽':12,
  '椖':12,'淎':12,'軯':12,'焩':12,'聠':12,'缾':12,'蛢':12,'喯':12,'焷':12,'豾':12,'釽':12,'鈚':12,'阰':12,'媥':12,'貵':12,
  '堷':12,'犃':12,'痡':12,'夡':12,'悽':12,'捿':12,'掑':12,'敧':12,'晵':12,'棄':12,'棊':12,'棲':12,'淒':12,'猉':12,'跒':12,
  '酠':12,'傔':12,'媊':12,'掔':12,'棈':12,'蚈':12,'鈆':12,'雂':12,'椌':12,'猐':12,'舃':12,'荍':12,'淁':12,'蛪':12,'寑':12,
  '媇':12,'捦':12,'鈙':12,'掅':12,'棾':12,'淸':12,'軽':12,'焭':12,'焪':12,'媝':12,'崷':12,'皳':12,'盚':12,'硞':12,'媣':12,
  '淭':12,'筁':12,'詓':12,'惓':12,'犈':12,'絟':12,'臸':12,'焫':12,'傇':12,'傛':12,'茙':12,'羢':12,'媃':12,'絍':12,'袵':12,
  '鈓':12,'靭':12,'筎':12,'袽':12,'惢':12,'甤':12,'閐':12,'傓':12,'歮':12,'趇':12,'雭':12,'喢':12,'硰':12,'焺':12,'貹':12,
  '阩':12,'弽':12,'畭':12,'蛥':12,'寔':12,'崼':12,'涭':12,'兟':12,'渖':12,'訷':12,'尌':12,'掓':12,'疎':12,'荗':12,'祱':12,
  '稅':12,'矟':12,'媤':12,'竢':12,'覗':12,'傞':12,'傁':12,'廀':12,'粛':12,'痠':12,'筍':12,'傝':12,'涾':12,'傏':12,'啺':12,
  '詜':12,'迯':12,'犆':12,'崹':12,'惖':12,'掦':12,'稊':12,'躰':12,'悿':12,'酟':12,'聎':12,'脁':12,'絩':12,'嵉':12,'硧':12,
  '粡':12,'絧':12,'婾':12,'媮':12,'堗':12,'捸':12,'痜':12,'朜':12,'喎':12,'堶':12,'涶':12,'詑':12,'跅':12,'迱':12,'飥':12,
  '邷':12,'捥':12,'晼':12,'喡':12,'媙':12,'媁':12,'媦':12,'寪':12,'嵔':12,'徫':12,'骩':12,'渂':12,'珳':12,'媉':12,'嵍':12,
  '祦':12,'惁':12,'晳':12,'焟':12,'焬':12,'琋':12,'翖':12,'奣':12,'勜':12,'傄':12,'閕':12,'棢':12,'蛧':12,'捰':12,'捾':12,
  '涹':12,'焥':12,'絤':12,'蛝':12,'衘':12,'廂':12,'絴':12,'傚':12,'殽':12,'痚':12,'痟':12,'窙':12,'硣':12,'媟':12,'屟':12,
  '禼':12,'絏':12,'絬':12,'翓':12,'脇':12,'惞':12,'焮':12,'鈊':12,'涬':12,'胷':12,'媗':12,'琁':12,'喣':12,'壻':12,'幁':12,
  '淢':12,'虛':12,'訹':12,'稄':12,'孲':12,'掗':12,'猒':12,'猚':12,'聐':12,'釾':12,'傜':12,'喓':12,'婹':12,'筄':12,'喭':12,
  '嵃':12,'嵒':12,'嵓':12,'敥':12,'琂':12,'傟':12,'崵':12,'敭':12,'詇':12,'阦':12,'幆':12,'崺':12,'旑':12,'敡':12,'晹':12,
  '棭':12,'殔':12,'焲':12,'異':12,'羠':12,'蛜':12,'蛡':12,'蛦':12,'詍':12,'跇':12,'鈠':12,'頉':12,'鳦':12,'殗':12,'淾':12,
  '猌':12,'筃':12,'裀':12,'鈏':12,'鈝':12,'詠':12,'亴':12,'貁':12,'喅':12,'喩':12,'堣':12,'堬':12,'媀':12,'崳':12,'庽':12,
  '惌':12,'惐':12,'棜':12,'棛':12,'焴':12,'硢':12,'茟':12,'茰':12,'傆':12,'棩':12,'渁':12,'捳':12,'鈅':12,'傊':12,'喗':12,
  '鈗':12,'阭':12,'喒':12,'崱':12,'趈':12,'飦':12,'涱':12,'淛':12,'媜':12,'寊':12,'晸':12,'掟':12,'掙':12,'猙':12,'証':12,
  '傂':12,'崻':12,'淽':12,'猘':12,'阯':12,'堹':12,'喠':12,'媑':12,'尰':12,'筗':12,'鈡':12,'喌':12,'晭':12,'淍':12,'詋':12,
  '嵀':12,'絑':12,'茿':12,'袾':12,'註':12,'軴':12,'跓':12,'堟':12,'粧':12,'斮':12,'棳':12,'啙':12,'椔':12,'胾':12,'茡':12,
  '訿':12,'堫':12,'嵏':12,'惣':12,'捴':12,'猔':12,'棷':12,'掫':12,'棸':12,'椊':12,'晬':12,'幹':13,'义':13,'義':13,'仅':13,
  '僅':13,'节':13,'節':13,'业':13,'業':13,'电':13,'電':13,'号':13,'號':13,'汇':13,'匯':13,'彙':13,'圣':13,'聖':13,'扬':13,
  '揚':13,'夸':13,'誇':13,'当':13,'當':13,'吗':13,'嗎':13,'岁':13,'歲':13,'回':13,'迴':13,'传':13,'傳':13,'伤':13,'傷':13,
  '会':13,'會':13,'爷':13,'爺':13,'庄':13,'莊':13,'汤':13,'湯':13,'农':13,'農':13,'妈':13,'媽':13,'驮':13,'馱':13,'驯':13,
  '馴':13,'驰':13,'馳':13,'块':13,'塊':13,'极':13,'極':13,'杨':13,'楊':13,'裏':13,'园':13,'園':13,'呛':13,'嗆':13,'呜':13,
  '嗚':13,'乱':13,'亂':13,'佣':13,'傭':13,'犹':13,'猶':13,'饭':13,'飯':13,'饮':13,'飲':13,'补':13,'補':13,'阿':13,'阻':13,
  '附':13,'拣':13,'揀':13,'势':13,'勢':13,'茎':13,'莖':13,'枫':13,'楓':13,'郁':13,'郊':13,'闸':13,'閘':13,'试':13,'試':13,
  '诗':13,'詩':13,'话':13,'話':13,'诡':13,'詭':13,'询':13,'詢':13,'该':13,'該':13,'详':13,'詳':13,'肃':13,'肅':13,'经':13,
  '經':13,'挥':13,'揮':13,'竖':13,'竪':13,'追':13,'逃':13,'迹':13,'送':13,'迷':13,'逆':13,'炼':13,'煉':13,'测':13,'測':13,
  '浑':13,'渾':13,'恼':13,'惱':13,'退':13,'绑':13,'綁':13,'顽':13,'頑':13,'盏':13,'盞':13,'载':13,'載':13,'莫':13,'莉':13,
  '荷':13,'贾':13,'賈':13,'较':13,'較':13,'顿':13,'頓':13,'晕':13,'暈':13,'圆':13,'圓':13,'贼':13,'賊':13,'贿':13,'賄':13,
  '赂':13,'賂':13,'钳':13,'鉗':13,'钾':13,'鉀':13,'铃':13,'鈴':13,'铅':13,'鉛':13,'债':13,'債':13,'倾':13,'傾':13,'赁':13,
  '賃':13,'爱':13,'愛':13,'颁':13,'頒':13,'颂':13,'頌':13,'资':13,'資':13,'烦':13,'煩':13,'涡':13,'渦':13,'涂':13,'塗':13,
  '涌':13,'湧':13,'预':13,'預':13,'绢':13,'絹':13,'綉':13,'描':13,'脖':13,'脯':13,'脱':13,'猪':13,'猫':13,'焕':13,'渠':13,
  '琴':13,'琳':13,'琢':13,'揍':13,'塔':13,'揩':13,'提':13,'揭':13,'揣':13,'插':13,'揪':13,'搜':13,'援':13,'握':13,'揉':13,
  '惹':13,'募':13,'敬':13,'椰':13,'榔':13,'厦':13,'廈':13,'睐':13,'睞':13,'鼎':13,'蜓':13,'蜒':13,'傲':13,'艇':13,'禽':13,
  '猩':13,'猬':13,'猴':13,'装':13,'裝':13,'港':13,'湖':13,'湘':13,'渣':13,'渤':13,'渺':13,'温':13,'渴':13,'湃':13,'渝':13,
  '渡':13,'游':13,'渲':13,'溉':13,'惰':13,'愕':13,'愣':13,'惶':13,'愉':13,'慨':13,'裕':13,'裙':13,'嫂':13,'肆':13,'填':13,
  '塌':13,'鼓':13,'塘':13,'聘':13,'斟':13,'勤':13,'靴':13,'靶':13,'椿':13,'禁':13,'楚':13,'楷':13,'想':13,'榆':13,'概':13,
  '酪':13,'酬':13,'感':13,'碘':13,'碑':13,'碎':13,'碰':13,'碗':13,'碌':13,'雷':13,'零':13,'雹':13,'督':13,'睛':13,'睦':13,
  '睫':13,'睡':13,'睬':13,'嗜':13,'嗦':13,'愚':13,'暖':13,'盟':13,'歇':13,'暗':13,'暇':13,'照':13,'畸':13,'跨':13,'跳':13,
  '跺':13,'跪':13,'路':13,'跤':13,'跟':13,'蜈':13,'蛾':13,'蜂':13,'蜕':13,'嗅':13,'嗡':13,'嗓':13,'蜀':13,'幌':13,'矮':13,
  '稚':13,'稠':13,'愁':13,'筷':13,'毁':13,'舅':13,'鼠':13,'催':13,'傻':13,'躲':13,'衙':13,'微':13,'愈':13,'解':13,'煞':13,
  '禀':13,'痹':13,'痴':13,'痰':13,'廉':13,'靖':13,'新':13,'韵':13,'意':13,'煎':13,'塑':13,'煤':13,'煌':13,'粱':13,'塞':13,
  '窟':13,'群':13,'殿':13,'媳':13,'嫉':13,'嫌':13,'嫁':13,'叠':13,'雌':13,'伛':13,'傴':13,'犸':13,'獁':13,'凫':13,'鳧':13,
  '坞':13,'塢':13,'苋':13,'莧':13,'旸':13,'暘':13,'佥':13,'僉':13,'鸠':13,'鳩':13,'饨':13,'飩':13,'饪':13,'飪':13,'饫':13,
  '飫':13,'饬':13,'飭':13,'炀':13,'煬':13,'沨':13,'渢':13,'陀':13,'陂':13,'茔':13,'塋':13,'茕':13,'煢':13,'郅':13,'黾':13,
  '黽':13,'邾':13,'郄':13,'郇':13,'炜':13,'煒':13,'诓':13,'誆':13,'诔':13,'誄':13,'诖':13,'詿':13,'诘':13,'詰':13,'诙':13,
  '詼':13,'诛':13,'誅':13,'诜':13,'詵':13,'诟':13,'詬':13,'诠':13,'詮':13,'诣':13,'詣':13,'诧':13,'詫':13,'诩':13,'詡':13,
  '荚':13,'莢':13,'莒':13,'莛':13,'逅':13,'胫':13,'脛':13,'逄':13,'恻':13,'惻':13,'恽':13,'惲':13,'顼':13,'頊':13,'琤':13,
  '埘':13,'塒':13,'埙':13,'塤':13,'荸':13,'莆':13,'莪':13,'莠':13,'莓':13,'莜':13,'莅':13,'荼':13,'莩':13,'荽':13,'荻':13,
  '莘':13,'莎':13,'莞':13,'莨':13,'桢':13,'楨':13,'轼':13,'軾':13,'轾':13,'輊':13,'辂':13,'輅':13,'蚬':13,'蜆':13,'唢':13,
  '嗩':13,'赅':13,'賅':13,'钰':13,'鈺':13,'钲':13,'鉦':13,'钴':13,'鈷':13,'钵':13,'鉢':13,'钹':13,'鈸':13,'钺':13,'鉞':13,
  '钽':13,'鉭':13,'钼':13,'鉬':13,'钿':13,'鈿':13,'铀':13,'鈾':13,'铂':13,'鉑':13,'铆':13,'鉚':13,'铈':13,'鈰':13,'铉':13,
  '鉉':13,'铊':13,'鉈':13,'铋':13,'鉍':13,'铌':13,'鈮':13,'铍':13,'鈹':13,'笕':13,'筧':13,'颀':13,'頎':13,'袅':13,'裊':13,
  '颃':13,'頏':13,'绠':13,'綆':13,'绡':13,'綃':13,'绥':13,'綏':13,'绨':13,'綈':13,'揶':13,'啬':13,'嗇':13,'偻':13,'僂':13,
  '脬':13,'脘':13,'脲':13,'羟':13,'羥':13,'惬':13,'愜':13,'琫':13,'琵':13,'琶':13,'琪':13,'琦':13,'琥':13,'琨':13,'琰':13,
  '琮':13,'琯':13,'琬':13,'琛':13,'琚':13,'揳':13,'揸':13,'揠':13,'揖':13,'揄':13,'揆':13,'掾':13,'靸':13,'楮':13,'殛':13,
  '戢':13,'嗒':13,'蛱':13,'蛺':13,'嗖':13,'嗟':13,'嗞':13,'嵬':13,'嵯':13,'嵫':13,'毽':13,'犍':13,'筵':13,'猢':13,'猹':13,
  '猥':13,'猱':13,'裒':13,'瓿':13,'孳':13,'湛':13,'渫':13,'湮':13,'湎':13,'湜':13,'渭':13,'湍':13,'湫':13,'湟':13,'溆':13,
  '湲':13,'湔':13,'湉':13,'渥':13,'湄':13,'愠':13,'惺':13,'惴':13,'愀':13,'愎':13,'愔':13,'裎':13,'祾':13,'祺':13,'巯':13,
  '巰':13,'髡':13,'塬':13,'趔':13,'趑':13,'蜇':13,'彀':13,'戡':13,'靳':13,'楔':13,'楠':13,'楂':13,'楝':13,'楫':13,'楸':13,
  '椴':13,'楯':13,'皙':13,'楦':13,'楣':13,'楹':13,'椽':13,'裘':13,'剽':13,'酮':13,'酰':13,'酯':13,'酩':13,'蜃':13,'碓':13,
  '硼':13,'碉':13,'碚':13,'碇':13,'粲':13,'虞':13,'睚':13,'嗪':13,'嗉':13,'睨':13,'睢':13,'雎':13,'睥':13,'嗑':13,'嗬':13,
  '嗔':13,'嗝':13,'戥':13,'嗄':13,'煦':13,'暄':13,'暌':13,'跬':13,'跣':13,'蛸':13,'蜊':13,'蜍':13,'蜉':13,'畹':13,'蛹':13,
  '嗣':13,'嗯':13,'嗥':13,'嗲':13,'嗌':13,'嗍':13,'嗨':13,'嗐':13,'嗤':13,'嗵':13,'嵊':13,'嵩':13,'嵴':13,'雉':13,'犏':13,
  '歃':13,'稞':13,'稗':13,'稔':13,'筠':13,'筢':13,'筮':13,'筲':13,'筱':13,'牒':13,'煲':13,'敫':13,'徭':13,'愆':13,'艄':13,
  '毹':13,'貊':13,'貅':13,'貉':13,'塍':13,'媵':13,'詹':13,'肄':13,'觥':13,'亶':13,'瘃':13,'痱':13,'痼':13,'痿':13,'瘁':13,
  '麂':13,'裔':13,'歆':13,'旒':13,'雍':13,'羧':13,'豢':13,'粳':13,'猷':13,'煳':13,'煜':13,'煨':13,'煅':13,'煊':13,'煸':13,
  '煺':13,'裟':13,'窠':13,'窣':13,'媾':13,'媲':13,'媸':13,'毓':13,'阽':13,'阼':13,'邽':13,'邿':13,'郈':13,'郃':13,'垲':13,
  '塏':13,'迺':13,'钜':13,'鉅':13,'浈':13,'湞':13,'莰':13,'茝':13,'莝':13,'莙':13,'辀':13,'輈':13,'辁':13,'輇':13,'唝':13,
  '嗊':13,'晖':13,'暉':13,'钷':13,'鉕':13,'脩':13,'鱽':13,'魛':13,'绤':13,'綌':13,'壸':13,'壼':13,'勚':13,'勣':13,'趼':13,
  '脞':13,'脟':13,'竫':13,'珷':13,'琲':13,'琡':13,'琟':13,'琔':13,'琭':13,'揕':13,'楗':13,'筥':13,'翛':13,'猰':13,'猯':13,
  '廋':13,'廆':13,'湝':13,'渰':13,'湓':13,'渟':13,'渼':13,'湣':13,'湑':13,'愐':13,'愃':13,'祼':13,'髢':13,'塥':13,'塝':13,
  '椹':13,'楪':13,'榃':13,'榅':13,'楒':13,'楞':13,'楩':13,'椸':13,'楙':13,'歅':13,'碃':13,'碏':13,'碈':13,'硿':13,'觜':13,
  '暕':13,'暅':13,'跱':13,'蜐':13,'蜎':13,'嵲':13,'稑':13,'稙':13,'筻':13,'筶':13,'筦':13,'筤':13,'傺':13,'僇':13,'艅':13,
  '艉':13,'谼':13,'貆':13,'雊':13,'觟':13,'裛':13,'瘀':13,'麀':13,'煁':13,'煃':13,'煴':13,'煋':13,'煟':13,'煓':13,'塱':13,
  '愍':13,'嫄':13,'媱':13,'戤':13,'勠':13,'戣':13,'湋':13,'暐':13,'詷':13,'詪':13,'綎':13,'綖':13,'頍':13,'輄':13,'輋':13,
  '鉥':13,'鉮':13,'鉊':13,'鉧':13,'絺':13,'綄':13,'煥':13,'祿':13,'徬':13,'稖':13,'雵':13,'蛽':13,'寚':13,'鉋':13,'揞':13,
  '痷':13,'雸':13,'厫':13,'奧':13,'媼':13,'斒':13,'鉡':13,'楍':13,'塧':13,'嵦':13,'阸':13,'僃':13,'愂':13,'痺':13,'惼':13,
  '揙':13,'牑':13,'猵':13,'閞':13,'碆':13,'莂':13,'琕':13,'稟':13,'鈵':13,'誁':13,'陃':13,'嗙':13,'嵭':13,'琣':13,'痭':13,
  '跰':13,'愊':13,'楅':13,'湢':13,'煏':13,'睤':13,'蜌':13,'閟':13,'荹':13,'鈽':13,'钸':13,'鳪':13,'傪':13,'湌':13,'嵢':13,
  '傮':13,'矠':13,'筴':13,'筞':13,'碀':13,'喍':13,'剷':13,'湹':13,'煘':13,'脠':13,'鉆':13,'莗':13,'蛼':13,'嗏':13,'嫅':13,
  '詧':13,'琩':13,'甞':13,'勦':13,'塖':13,'塣':13,'揨':13,'筬':13,'絾':13,'脭':13,'荿':13,'阷':13,'愖':13,'莀':13,'莐':13,
  '湁':13,'痸':13,'觢':13,'誃':13,'趍':13,'跮':13,'鉓':13,'雴':13,'揰':13,'皗':13,'詶':13,'酧':13,'媰':13,'耡':13,'荲':13,
  '趎':13,'鉏':13,'歂':13,'猭':13,'傸':13,'牎':13,'湷':13,'惷':13,'暙':13,'脣':13,'畷':13,'酫':13,'嵳':13,'瘄':13,'脨':13,
  '麁':13,'凗':13,'嵟':13,'琗':13,'愡':13,'楤':13,'傶':13,'楱':13,'湊':13,'莡':13,'跢':13,'窞':13,'蜑':13,'嵣':13,'愓':13,
  '瓽':13,'雼':13,'幍':13,'禂':13,'豋':13,'僀':13,'揥':13,'楴':13,'渧':13,'鉪':13,'阺':13,'馰':13,'惵':13,'揲':13,'殜':13,
  '牃':13,'镻':13,'湩':13,'筩':13,'迵':13,'嵮':13,'琠':13,'痶':13,'蜔':13,'琱':13,'竨':13,'誂':13,'暏':13,'荰':13,'脰':13,
  '荳':13,'塠':13,'痽':13,'綐':13,'逇':13,'椯':13,'莌':13,'跥':13,'躱':13,'圔':13,'廅':13,'湂':13,'琧':13,'痾':13,'詻':13,
  '鈳':13,'钶':13,'頋':13,'渳':13,'誀':13,'輀':13,'飰':13,'豥':13,'賌':13,'郂':13,'剻':13,'椱':13,'馚':13,'圑':13,'暊':13,
  '筟':13,'粰':13,'綍':13,'綒':13,'罦':13,'艀':13,'荴':13,'蜅':13,'鉘':13,'鉜':13,'颫':13,'尲':13,'骭':13,'煰':13,'睪':13,
  '愅':13,'渮':13,'裓':13,'觡':13,'揯':13,'莄':13,'湗':13,'煈':13,'犎':13,'猦':13,'綘':13,'艂':13,'莑':13,'豊':13,'幊':13,
  '輁':13,'鉤':13,'尳':13,'祻':13,'稒':13,'鈲':13,'鼔':13,'歄':13,'煱':13,'趏':13,'痯':13,'窤':13,'媿':13,'敮':13,'湀':13,
  '猤':13,'觤':13,'郌':13,'睔':13,'楇':13,'聕':13,'貈':13,'嗃':13,'暍':13,'楁':13,'毼':13,'煂':13,'猲':13,'碋':13,'詥':13,
  '鉌':13,'傼':13,'椷':13,'甝':13,'筨':13,'莟':13,'蛿':13,'馯':13,'畵':13,'揘':13,'楻':13,'脝':13,'嵤':13,'揈':13,'渱':13,
  '渹':13,'綋':13,'翝':13,'愌':13,'換':13,'渙':13,'羦':13,'詤':13,'嗀':13,'楛':13,'楜':13,'綔':13,'雽':13,'楎':13,'毀':13,
  '湏':13,'煇':13,'詯':13,'惽':13,'睧':13,'旤':13,'湱':13,'窢':13,'兾':13,'嗘':13,'塉':13,'嵠':13,'揤':13,'楖':13,'湒':13,
  '痵':13,'稘':13,'莋':13,'裚':13,'趌':13,'跡':13,'郆':13,'魝':13,'幏':13,'椵':13,'犌':13,'猳':13,'脥':13,'裌':13,'跲':13,
  '鉫':13,'弿':13,'揃':13,'揵':13,'旔':13,'椾':13,'減':13,'湕':13,'碊':13,'絸':13,'豣':13,'勥':13,'傹':13,'畺':13,'湬':13,
  '煍':13,'詨':13,'賋':13,'厪':13,'寖':13,'煡':13,'靲':13,'嵥':13,'楐':13,'楬':13,'楶':13,'煯':13,'蛶':13,'迼':13,'鉣':13,
  '煚':13,'匓':13,'揂':13,'揫':13,'韮':13,'楀':13,'榘':13,'湨':13,'犑':13,'豦':13,'輂':13,'睠':13,'罥':13,'脧':13,'裐':13,
  '雋':13,'飬':13,'殾':13,'碅':13,'愒':13,'輆':13,'歁':13,'嵪':13,'愘':13,'愙':13,'揢':13,'犐':13,'閜':13,'豤':13,'貇':13,
  '硻':13,'剾':13,'郀':13,'楏':13,'楑':13,'歀':13,'軭':13,'邼':13,'艆':13,'蜋':13,'稛':13,'綑':13,'蜫':13,'裍':13,'揦':13,
  '揧':13,'楋':13,'琜':13,'嗠':13,'傫':13,'睖':13,'碐':13,'稜':13,'剺':13,'塛':13,'睙':13,'睝':13,'筣':13,'艃':13,'鉝':13,
  '鳨':13,'僆':13,'湅':13,'湸':13,'煭':13,'聗':13,'迾':13,'閝':13,'阾':13,'亃':13,'痳':13,'碄':13,'媹':13,'嵧':13,'廇':13,
  '裗':13,'湰':13,'剹':13,'盝':13,'睩':13,'碖':13,'稐':13,'痲':13,'僈':13,'愗':13,'暓':13,'渵':13,'毷':13,'媺':13,'楳':13,
  '湈':13,'煝':13,'猸':13,'脢':13,'鬽':13,'瓾':13,'莔':13,'雺':13,'塓':13,'幎':13,'覛':13,'詸':13,'絻':13,'莬':13,'暋':13,
  '琘':13,'琝':13,'痻':13,'鈱':13,'嫇':13,'詺':13,'湐':13,'莈':13,'楘':13,'郍':13,'靹':13,'渿':13,'暔':13,'揇':13,'湳':13,
  '莮':13,'嫐':13,'閙':13,'脮':13,'孴':13,'鉨':13,'寗':13,'嫋':13,'揑':13,'鉩':13,'莥':13,'靵':13,'渜':13,'煖':13,'煗':13,
  '愞':13,'掿':13,'媻':13,'幋':13,'嫎':13,'傰':13,'塜':13,'稝':13,'軿':13,'閛':13,'甁':13,'揊':13,'鉟':13,'楄':13,'賆':13,
  '僄':13,'勡':13,'湆':13,'湇':13,'碁':13,'碕':13,'嗛':13,'嵰':13,'煔':13,'皘':13,'跫':13,'嫀':13,'綅':13,'暒':13,'惸':13,
  '睘':13,'渞':13,'湭':13,'煪':13,'絿':13,'脙':13,'莍':13,'蛷':13,'塙':13,'琷':13,'皵':13,'裠':13,'羣':13,'阹':13,'湶':13,
  '觠':13,'跧':13,'渃':13,'媶':13,'嫆':13,'渘':13,'楺':13,'煣':13,'脜':13,'荵':13,'魜':13,'嗕':13,'媷':13,'渪':13,'楉':13,
  '揌':13,'愢':13,'毸':13,'喿':13,'剼':13,'睒':13,'銏':13,'歰':13,'翜':13,'旓':13,'莦':13,'渻':13,'湦':13,'鉎':13,'鉇':13,
  '戠':13,'揓':13,'湤':13,'睗':13,'跩':13,'鉃':13,'鉂':13,'鉐':13,'脤':13,'蜄':13,'裑':13,'毺':13,'綀':13,'裋':13,'揎':13,
  '蛻':13,'裞':13,'揗':13,'揱':13,'貄':13,'鈶':13,'鈻':13,'傱':13,'硹':13,'莏':13,'塐':13,'嫊':13,'莤':13,'筭':13,'煫':13,
  '睟':13,'荾':13,'飱':13,'嫍':13,'祹':13,'絛':13,'脦':13,'嗁':13,'惿':13,'罤':13,'僋':13,'湠':13,'塡':13,'睓':13,'覜':13,
  '趒':13,'鉄':13,'楟':13,'筳':13,'脡':13,'綂':13,'赨':13,'鉖':13,'牏':13,'嵞':13,'揬':13,'湥':13,'筡':13,'鈯':13,'脫':13,
  '剸':13,'湪':13,'楕':13,'毻':13,'陁':13,'馲':13,'嗗':13,'嗢':13,'睕':13,'脕':13,'愄':13,'愇':13,'揋':13,'椲':13,'椳':13,
  '楲':13,'渨':13,'荱':13,'詴':13,'骪':13,'骫':13,'脗':13,'奦':13,'嵨':13,'碔':13,'莁':13,'茣':13,'誈':13,'僁':13,'厀':13,
  '媐':13,'徯':13,'椺':13,'莃':13,'赩':13,'郋':13,'塕':13,'嵡':13,'煆':13,'筪':13,'舝':13,'颬':13,'楃':13,'猧':13,'僊':13,
  '尟':13,'尠':13,'湺':13,'粯':13,'羨':13,'跭':13,'嗋':13,'綊':13,'脪':13,'莕':13,'蛵':13,'郉':13,'詾':13,'綇':13,'臹':13,
  '愋':13,'楥':13,'蜁':13,'揟':13,'楈':13,'賉':13,'迿':13,'瘂':13,'稏':13,'嗂':13,'楆':13,'趐':13,'傿':13,'愝':13,'揜':13,
  '椻':13,'椼':13,'楌':13,'渷':13,'煙':13,'硽':13,'莚':13,'詽':13,'鳫':13,'楧':13,'鉠':13,'亄':13,'暆':13,'湙':13,'痬':13,
  '竩':13,'跠':13,'迻':13,'骮':13,'煠':13,'湚':13,'碒':13,'荶':13,'靷':13,'飮':13,'僌':13,'嫈':13,'暎':13,'朠':13,'渶':13,
  '煐':13,'嗈':13,'塎':13,'嵱':13,'彮':13,'愑':13,'楢':13,'湵':13,'蜏':13,'迶':13,'酭':13,'寙':13,'斞':13,'楡':13,'楰':13,
  '歈':13,'湡':13,'琙':13,'稢':13,'骬':13,'媴':13,'猨':13,'荺':13,'鉔':13,'韴':13,'渽':13,'酨':13,'揝':13,'鉙':13,'塟':13,
  '艁':13,'牐':13,'琖':13,'閚':13,'傽':13,'痮':13,'塦':13,'嫃':13,'揁':13,'絼':13,'裖':13,'鉁':13,'靕':13,'徰':13,'睜':13,
  '寘':13,'瓡':13,'禃':13,'筫':13,'綕':13,'塚':13,'歱':13,'煄':13,'睭':13,'煑':13,'筯':13,'莇':13,'跦':13,'鉒':13,'馵':13,
  '窡':13,'甀':13,'稕':13,'斱':13,'琸':13,'硺':13,'鈭':13,'傯':13,'惾':13,'揔':13,'朡':13,'椶':13,'猣':13,'碂':13,'稡':13,
  '祽':13,'辠':13,'稓':13,'筰':13,'鈼':13,'与':14,'與':14,'么':14,'麽':14,'仆':14,'僕':14,'凤':14,'鳳':14,'认':14,'認':14,
  '灭':14,'滅':14,'叹':14,'嘆':14,'尔':14,'爾':14,'髪':14,'对':14,'對':14,'台':14,'臺':14,'颱':14,'厌':14,'厭':14,'夺':14,
  '奪':14,'划':14,'劃':14,'尘':14,'塵':14,'团':14,'團':14,'网':14,'網':14,'华':14,'華':14,'伙':14,'夥':14,'伪':14,'僞':14,
  '合':14,'閤':14,'齐':14,'齊':14,'尽':14,'盡':14,'寿':14,'壽':14,'抢':14,'搶':14,'连':14,'連':14,'呕':14,'嘔':14,'岖':14,
  '嶇':14,'这':14,'這':14,'沧':14,'滄':14,'沟':14,'溝':14,'纲':14,'綱':14,'驳':14,'駁':14,'枪':14,'槍':14,'构':14,'構':14,
  '态':14,'態':14,'肾':14,'腎':14,'畅':14,'暢':14,'鸣':14,'鳴':14,'图':14,'圖':14,'制':14,'製':14,'侥':14,'僥':14,'侨':14,
  '僑':14,'胀':14,'脹':14,'肮':14,'骯':14,'饰':14,'飾':14,'饱':14,'飽':14,'饲':14,'飼':14,'实':14,'實':14,'郎':14,'诚':14,
  '誠':14,'诞':14,'誕':14,'陋':14,'陌':14,'降':14,'限':14,'线':14,'綫':14,'赵':14,'趙':14,'垫':14,'墊':14,'荣':14,'榮':14,
  '荧':14,'熒':14,'轻':14,'輕':14,'尝':14,'嘗':14,'种':14,'種':14,'狱':14,'獄':14,'奖':14,'奬':14,'疯':14,'瘋':14,'闺':14,
  '閨':14,'闻':14,'聞':14,'闽':14,'閩':14,'阀':14,'閥':14,'阁':14,'閣':14,'洼':14,'窪':14,'诫':14,'誡':14,'诬':14,'誣':14,
  '语':14,'語':14,'误':14,'誤':14,'诱':14,'誘':14,'诲':14,'誨':14,'说':14,'説':14,'诵':14,'誦':14,'赶':14,'趕':14,'损':14,
  '損':14,'逝':14,'捣':14,'搗':14,'莽':14,'莱':14,'萊':14,'速':14,'逗':14,'逐':14,'监':14,'監':14,'紧':14,'緊':14,'逞':14,
  '造':14,'称':14,'稱':14,'透':14,'途':14,'逛':14,'逢':14,'准':14,'準':14,'宾':14,'賓':14,'通':14,'著':14,'菱':14,'菲':14,
  '萌':14,'菌':14,'萎':14,'菜':14,'萄':14,'菊':14,'菩':14,'萍':14,'菠':14,'菇':14,'梦':14,'夢':14,'硕':14,'碩':14,'辅':14,
  '輔':14,'崭':14,'嶄':14,'铐':14,'銬':14,'铜':14,'銅':14,'铭':14,'銘':14,'银':14,'銀':14,'衔':14,'銜':14,'领':14,'領':14,
  '祸':14,'禍':14,'颇':14,'頗':14,'绪':14,'緒':14,'绰':14,'綽':14,'维':14,'維':14,'绵':14,'綿':14,'绷':14,'綳':14,'绸':14,
  '綢':14,'综':14,'綜':14,'绽':14,'綻':14,'绿':14,'緑':14,'缀':14,'綴':14,'搭':14,'搓':14,'搔':14,'脾':14,'腋':14,'腔':14,
  '腕':14,'猾':14,'滑':14,'滋':14,'慌':14,'愧':14,'窝':14,'窩':14,'屡':14,'屢':14,'瑟':14,'瑞':14,'瑙':14,'魂':14,'搏':14,
  '携':14,'搬':14,'摇':14,'搞':14,'墓':14,'幕':14,'槐':14,'睹':14,'瞄':14,'署':14,'置':14,'罪':14,'罩':14,'像':14,'魁':14,
  '猿':14,'廓':14,'慈':14,'滇':14,'源':14,'滔':14,'溪':14,'溜':14,'溢':14,'溯':14,'溶':14,'溺':14,'慎':14,'寞':14,'寝':14,
  '寢':14,'褂':14,'裸':14,'福':14,'碧':14,'嘉':14,'赫':14,'截':14,'誓':14,'境':14,'聚':14,'熙':14,'兢':14,'榴':14,'榜':14,
  '榨':14,'榕':14,'歌':14,'酵':14,'酷':14,'酸':14,'碟':14,'碱':14,'碳':14,'需':14,'裳':14,'瞅':14,'墅':14,'嗽':14,'蜻':14,
  '蜘':14,'嘛':14,'嘀':14,'舞':14,'舔':14,'熏':14,'箕':14,'算':14,'管':14,'僚':14,'僧':14,'鼻':14,'貌':14,'疑':14,'孵':14,
  '裹':14,'敲':14,'豪':14,'腐':14,'辣':14,'彰':14,'竭':14,'端':14,'旗':14,'精':14,'粹':14,'歉':14,'熄':14,'熔':14,'煽':14,
  '寨':14,'寡':14,'察':14,'蜜':14,'寥':14,'肇':14,'嫩':14,'翠':14,'熊':14,'凳':14,'苌':14,'萇':14,'奁':14,'奩':14,'忾':14,
  '愾':14,'怆':14,'愴':14,'妪':14,'嫗':14,'纶':14,'綸':14,'玮':14,'瑋':14,'砀':14,'碭':14,'郏':14,'郟':14,'鸢':14,'鳶':14,
  '戗':14,'戧':14,'饴':14,'飴':14,'疡':14,'瘍':14,'炝':14,'熗':14,'祎':14,'禕':14,'陔':14,'郝':14,'荥':14,'滎':14,'荦':14,
  '犖':14,'砜':14,'碸':14,'郢':14,'哔':14,'嗶':14,'郜':14,'郗':14,'郤':14,'郛':14,'胨':14,'腖':14,'飑':14,'颮':14,'狲':14,
  '猻':14,'飒':14,'颯':14,'阂':14,'閡':14,'恺':14,'愷':14,'诮':14,'誚':14,'诰':14,'誥':14,'诳':14,'誑':14,'郡':14,'珲':14,
  '琿':14,'桤':14,'榿':14,'逑':14,'逋':14,'逍':14,'唛':14,'嘜':14,'逖':14,'祯':14,'禎':14,'逡':14,'菁':14,'萁':14,'菘':14,
  '萘':14,'萋':14,'菽':14,'菖':14,'萜':14,'萑':14,'菔':14,'菟':14,'萏':14,'萃':14,'菏':14,'菹':14,'菪':14,'菅':14,'菀':14,
  '菰':14,'菡':14,'觋':14,'覡':14,'匮':14,'匱':14,'殒':14,'殞':14,'辄':14,'輒':14,'堑':14,'塹':14,'啧':14,'嘖':14,'帻':14,
  '幘':14,'帼':14,'幗':14,'赇':14,'賕':14,'赈':14,'賑':14,'赊':14,'賒':14,'铑':14,'銠':14,'铒':14,'鉺':14,'铟':14,'銦':14,
  '铢':14,'銖':14,'铣':14,'銑':14,'铨':14,'銓':14,'铪':14,'鉿':14,'铫':14,'銚':14,'铬':14,'鉻':14,'铯':14,'銫':14,'铰':14,
  '鉸':14,'铱':14,'銥':14,'铳':14,'銃':14,'铵':14,'銨':14,'铷':14,'笺':14,'箋':14,'偾':14,'僨':14,'皲':14,'皸':14,'绫':14,
  '綾':14,'绮':14,'綺':14,'绯':14,'緋':14,'绱':14,'緔':14,'绲':14,'緄':14,'绶':14,'綬':14,'绺':14,'綹':14,'绻':14,'綣':14,
  '绾':14,'綰':14,'缁':14,'緇':14,'瑛':14,'搽':14,'喽':14,'嘍':14,'嵝':14,'嶁':14,'腈':14,'腌':14,'腓':14,'腆':14,'腑':14,
  '腚':14,'溲':14,'滁':14,'瑚':14,'瑁':14,'瑜':14,'瑗':14,'瑄':14,'瑕':14,'摁':14,'搋':14,'搪':14,'搐':14,'搛':14,'搠':14,
  '搦':14,'搡':14,'槌':14,'槎':14,'甄':14,'嗷':14,'蜣':14,'罨':14,'骰':14,'氲':14,'瘐':14,'溱':14,'溘':14,'溥':14,'溧':14,
  '溽':14,'溻':14,'溷':14,'溴':14,'滏':14,'滃':14,'溏':14,'滂':14,'滓':14,'溟':14,'愫':14,'慊':14,'裱':14,'裨':14,'裾':14,
  '裰':14,'禊':14,'嫫':14,'耥':14,'嫠':14,'髦':14,'墁':14,'踅':14,'墉':14,'墒':14,'榖':14,'綦':14,'靺':14,'靼':14,'鞅':14,
  '靿':14,'戬':14,'斡':14,'榛':14,'榧':14,'榻':14,'榫':14,'榭':14,'槔':14,'榱':14,'槁':14,'榷':14,'僰':14,'酶':14,'酹':14,
  '厮':14,'碡':14,'碴':14,'碣':14,'碲':14,'臧':14,'豨':14,'蜚':14,'裴':14,'翡':14,'睿':14,'睽':14,'嘞':14,'嘈':14,'嘌':14,
  '嘁':14,'嘎':14,'暝':14,'踉':14,'蜞':14,'蜥':14,'蜮':14,'蜴':14,'蜱':14,'蜩':14,'蜷':14,'蜿':14,'蜢':14,'嘘':14,'嘡':14,
  '嘣':14,'嘚':14,'嗾':14,'嘧':14,'幔':14,'嶂':14,'幛':14,'犒':14,'箐':14,'箍':14,'箅':14,'箔':14,'箜':14,'箢':14,'僖':14,
  '僳':14,'僭':14,'劁':14,'僮':14,'睾':14,'艋':14,'觫':14,'雒':14,'夤':14,'塾':14,'瘌':14,'瘊':14,'廖':14,'韶':14,'旖':14,
  '粿':14,'粼':14,'粽':14,'槊':14,'熘':14,'搴':14,'窨':14,'寤':14,'綮':14,'暨':14,'屣':14,'嫣':14,'嫖':14,'嫦':14,'嫚':14,
  '嫘':14,'嫡':14,'翟':14,'瞀':14,'墀':14,'滕':14,'玚':14,'瑒':14,'杩':14,'榪':14,'驲':14,'馹':14,'饳':14,'飿':14,'鸤':14,
  '鳲':14,'陑':14,'陎':14,'迳':14,'逕':14,'韨':14,'韍':14,'荓':14,'郚':14,'飐':14,'颭':14,'浉':14,'溮':14,'涢':14,'溳':14,
  '菝':14,'菥':14,'莿':14,'萆':14,'菂':14,'菍':14,'菼':14,'萣':14,'菉':14,'铏':14,'鉶':14,'铕':14,'銪':14,'铚':14,'銍':14,
  '铞':14,'銱':14,'铥':14,'銩':14,'鱾':14,'魢':14,'庼':14,'廎':14,'绹':14,'綯':14,'脿':14,'腙':14,'腒':14,'溚':14,'溠':14,
  '溞':14,'瑃':14,'瑓':14,'瑅':14,'瑆':14,'瑖':14,'瑝':14,'瑔':14,'瑀':14,'瑂':14,'嶅':14,'瑑':14,'搒':14,'搌':14,'骱':14,
  '猺':14,'廒':14,'溍':14,'溹':14,'滆':14,'滉':14,'溦':14,'溵':14,'滧':14,'滘':14,'滍':14,'愭':14,'慆':14,'裼':14,'禋':14,
  '禔':14,'禘':14,'禒':14,'耤':14,'斠':14,'墕':14,'墈':14,'墐':14,'墘':14,'銎':14,'墚':14,'靽':14,'鞁':14,'嘏':14,'榰':14,
  '榑':14,'槜':14,'榍':14,'疐':14,'酺':14,'酲':14,'酴':14,'碶':14,'碨':14,'碹':14,'碥':14,'劂':14,'跽':14,'蜾':14,'幖':14,
  '嶍':14,'馝':14,'箖':14,'劄':14,'僬':14,'僦':14,'僔':14,'僎':14,'槃':14,'夐':14,'凘':14,'廑':14,'瘕':14,'熇':14,'窬':14,
  '嫕':14,'嫭':14,'嫜':14,'嫪':14,'塸':14,'彄':14,'馼':14,'駃':14,'僤':14,'蝀':14,'頔':14,'銈':14,'鉷':14,'綪':14,'綝':14,
  '綡':14,'綧':14,'塿':14,'嵽':14,'說':14,'寧':14,'箏':14,'牓':14,'蜯':14,'粺':14,'菢':14,'鞄':14,'飹':14,'駂':14,'鳵':14,
  '菴':14,'誝':14,'颰':14,'馛':14,'嗸':14,'嫯':14,'蝂':14,'嘊':14,'敱':14,'溰':14,'溾':14,'誒':14,'诶':14,'犕':14,'箄':14,
  '綼':14,'誖':14,'郥':14,'甂':14,'稨':14,'辡':14,'僠':14,'愽':14,'煿':14,'牔':14,'猼':14,'箥':14,'艊':14,'踄':14,'郣':14,
  '墂':14,'徱':14,'豩':14,'賔':14,'塴':14,'菶':14,'彃':14,'稫':14,'箆':14,'聛':14,'飶':14,'誧':14,'溨':14,'綵':14,'蝅':14,
  '愺':14,'嶆':14,'慅':14,'嫧':14,'溭':14,'箣':14,'萗':14,'頙':14,'嵾':14,'僝':14,'嵼':14,'裧':14,'誗':14,'銟':14,'僘':14,
  '塲':14,'畼':14,'裮':14,'煼':14,'禉':14,'溗':14,'畻':14,'郕':14,'靗':14,'墋':14,'瘎':14,'徲':14,'瘈':14,'箎':14,'箈':14,
  '翤':14,'裭':14,'鉹':14,'銐':14,'嘃':14,'搊':14,'殠':14,'菗':14,'裯':14,'槒':14,'滀':14,'犓':14,'禇':14,'踀':14,'閦':14,
  '腄':14,'僢':14,'瑏':14,'搥':14,'箠':14,'菙':14,'槆':14,'睶':14,'萅':14,'腏':14,'塶':14,'皶':14,'誎':14,'趗':14,'菆':14,
  '搨':14,'箚':14,'嗺':14,'墔':14,'綷':14,'脺':14,'踆':14,'聡':14,'廗':14,'獃':14,'瑇':14,'匰':14,'腅':14,'舕':14,'馾':14,
  '頕':14,'髧':14,'嶋':14,'翢':14,'菿':14,'僜':14,'墆':14,'墑':14,'聜':14,'菧':14,'蝃':14,'逓':14,'蜨':14,'菄':14,'槇':14,
  '魡':14,'雿':14,'嵿':14,'碠':14,'琽':14,'裻':14,'郖':14,'鬦':14,'碫':14,'蜳':14,'綞':14,'缍':14,'陊':14,'陏':14,'僫':14,
  '搤':14,'搹':14,'蝁':14,'誐':14,'煾':14,'瞂':14,'勫':14,'髣':14,'魀':14,'槩':14,'萉':14,'蜰':14,'裶':14,'稪':14,'箙':14,
  '豧':14,'郙':14,'榦':14,'蜬':14,'鳱':14,'罁':14,'暠':14,'槀':14,'菒':14,'戨':14,'槅':14,'滒':14,'箇':14,'麧':14,'菮':14,
  '郠':14,'愩':14,'躳':14,'魟':14,'搆':14,'煹':14,'愲':14,'搰':14,'榾':14,'皷':14,'箛':14,'劀':14,'瘑':14,'罫':14,'箉':14,
  '関':14,'僙':14,'厬':14,'嫢':14,'溎':14,'陒':14,'睴':14,'裩':14,'裷':14,'嘓':14,'墎':14,'綶':14,'腂':14,'聝':14,'菓':14,
  '褁':14,'酼':14,'噑':14,'暤':14,'滈':14,'獆':14,'熆':14,'萂':14,'嫨':14,'蜭':14,'谽':14,'貋':14,'搳':14,'睺':14,'銗':14,
  '誙':14,'閧':14,'鞃':14,'獂':14,'瑍':14,'瘓':14,'萈':14,'輐':14,'愰':14,'榥':14,'熀':14,'嘑':14,'嫮':14,'寣':14,'萀':14,
  '雐':14,'僡':14,'嘒':14,'幑':14,'睳':14,'禈':14,'慁':14,'睯':14,'觨':14,'僟':14,'墍':14,'愱':14,'槉':14,'毄':14,'稩':14,
  '綨':14,'緁':14,'褀':14,'誋':14,'銡':14,'鬾':14,'榎':14,'榢':14,'睱':14,'稭':14,'鞂':14,'僣':14,'戩':14,'榗':14,'瑐':14,
  '瑊':14,'睷':14,'菺':14,'銒':14,'嵹':14,'翞':14,'嘂':14,'嘄':14,'嘐':14,'暞':14,'虠':14,'踋':14,'嫤':14,'搢':14,'暜':14,
  '菫':14,'菳':14,'搩':14,'榤':14,'滐':14,'琾':14,'犗':14,'瑎':14,'箑':14,'脻':14,'腉':14,'菨':14,'飷':14,'聙':14,'誩':14,
  '踁':14,'僒':14,'煛':14,'廐':14,'廏':14,'僪':14,'勪':14,'熦':14,'寠':14,'愳':14,'箤':14,'粷':14,'虡':14,'蜛':14,'跼':14,
  '勬':14,'腃':14,'菤':14,'箘':14,'箟':14,'菎':14,'蜠':14,'覠':14,'賐':14,'銁':14,'銞':14,'嘅':14,'暟':14,'嵻':14,'嫝':14,
  '搕':14,'榼':14,'碦':14,'瘔':14,'銙':14,'誏':14,'躴':14,'郞':14,'髨':14,'搚':14,'菈':14,'辢':14,'箂':14,'僗':14,'韷':14,
  '銇':14,'孷':14,'搮':14,'慄':14,'盠':14,'綟':14,'菞':14,'蜧':14,'貍':14,'匲':14,'嗹':14,'溓':14,'熑':14,'覝':14,'脼':14,
  '緉':14,'蜽':14,'裲':14,'嵺':14,'裬':14,'僯':14,'罧':14,'菻':14,'廔':14,'畱':14,'塷':14,'廘':14,'粶':14,'綠':14,'馿':14,
  '溣':14,'耣':14,'腀':14,'蜦':14,'菕':14,'溤':14,'睰':14,'麼':14,'壾':14,'莾':14,'鉾':14,'塺':14,'槑':14,'睸':14,'禖':14,
  '韎':14,'菛':14,'夣':14,'溕':14,'榓':14,'熐':14,'踇':14,'搣':14,'瑉':14,'緍':14,'榠':14,'猽':14,'嗼':14,'塻':14,'銆':14,
  '幙':14,'搻':14,'榒':14,'熋':14,'碯':14,'腇':14,'嫟':14,'愵':14,'蜺':14,'馜':14,'槈':14,'踂':14,'搙':14,'稬':14,'腗':14,
  '搫':14,'溿':14,'頖':14,'靤':14,'裵':14,'馷':14,'塳':14,'凴':14,'幈':14,'艵':14,'銔':14,'銢':14,'腁':14,'彯':14,'嘙':14,
  '箁':14,'菐':14,'僛':14,'墄':14,'暣':14,'溼':14,'滊':14,'粸':14,'綥':14,'緀':14,'萕':14,'蜝':14,'裿':14,'鬿':14,'槏':14,
  '箝':14,'蜸':14,'墏':14,'嶈':14,'溬':14,'牄':14,'羫':14,'毃':14,'菬':14,'髚':14,'朅':14,'搇':14,'菦':14,'菣':14,'誛':14,
  '靘':14,'熍':14,'搝':14,'觩':14,'逎':14,'愨':14,'搉':14,'髥':14,'竬':14,'菃':14,'搼':14,'箞':14,'搈':14,'搑':14,'榵':14,
  '瑈':14,'腍':14,'銋':14,'銣':14,'瑌':14,'碝':14,'緌':14,'蜹':14,'馺':14,'嘇':14,'甧':14,'僐':14,'幓':14,'搧':14,'熌':14,
  '榝':14,'翣':14,'萐':14,'綤':14,'輎':14,'禓':14,'銄':14,'榺':14,'琞':14,'榯':14,'溡':14,'獅':14,'舓':14,'鉽':14,'愼':14,
  '搷':14,'跾':14,'踈':14,'誜':14,'塽':14,'脽':14,'愬':14,'榹':14,'禗':14,'蜤':14,'愯':14,'嵷':14,'蜙':14,'暛':14,'溑':14,
  '蜶':14,'趖':14,'逤':14,'獀':14,'榡':14,'溸':14,'趚':14,'滖':14,'搎':14,'愻':14,'槂':14,'墖':14,'毾':14,'榙':14,'溙':14,
  '菭':14,'榶':14,'煻':14,'搯':14,'槄':14,'裪':14,'蜪':14,'飸':14,'鞀':14,'睼':14,'碮':14,'嗿':14,'緂':14,'菾':14,'萔':14,
  '銕':14,'飻':14,'榳':14,'誔':14,'勭':14,'鉵':14,'圗':14,'嶀':14,'瘏':14,'跿':14,'僓':14,'畽':14,'碢':14,'魠':14,'搲':14,
  '溛':14,'綩':14,'萖':14,'輓':14,'嶉':14,'菋':14,'蜲':14,'蜼':14,'搵':14,'榲':14,'殟':14,'溫':14,'熓':14,'瘒':14,'瞃':14,
  '歍':14,'溩':14,'熃':14,'禑':14,'逜':14,'陓':14,'慀':14,'榽':14,'熂':14,'熈':14,'犔':14,'稧':14,'緆':14,'趘':14,'暡':14,
  '碬':14,'朢':14,'菵':14,'蝄':14,'僩':14,'嘕':14,'搟':14,'誢':14,'銛':14,'勨':14,'嘋':14,'歊':14,'誟':14,'踃':14,'愶':14,
  '熁':14,'靾':14,'馸':14,'睲':14,'緈':14,'觪':14,'銝':14,'髤':14,'嫙':14,'睻':14,'噓':14,'慉':14,'盢':14,'瞁':14,'稰':14,
  '聟':14,'銊':14,'窫':14,'愮':14,'暚':14,'搖':14,'榚':14,'榣':14,'溔':14,'熎':14,'覞':14,'暥':14,'碞':14,'菸':14,'萒':14,
  '裺':14,'郔':14,'慃':14,'勩':14,'嫛':14,'榏':14,'歋':14,'獈':14,'稦':14,'萓':14,'逘':14,'瑘':14,'慇':14,'廕':14,'朄':14,
  '瘖':14,'酳':14,'輑':14,'馻':14,'碤':14,'賏':14,'嫞':14,'慂':14,'輏':14,'逌':14,'駀':14,'戫':14,'歶':14,'瘉':14,'睮':14,
  '箊':14,'罭':14,'緎':14,'蜟':14,'輍':14,'銉':14,'榞':14,'榬':14,'溒':14,'禐':14,'蜵':14,'裫':14,'奫':14,'愪':14,'慍':14,
  '氳':14,'熅':14,'熉':14,'雑':14,'睵':14,'菑':14,'榸':14,'飵':14,'嶃':14,'榐':14,'菚':14,'墇':14,'粻':14,'箌':14,'肈':14,
  '嗻':14,'嫬':14,'搸':14,'殝':14,'碪':14,'誫':14,'愸':14,'墌':14,'搘':14,'覟':14,'誌':14,'馶':14,'馽':14,'幒':14,'瘇':14,
  '甃':14,'箒':14,'菷':14,'銂':14,'飳':14,'嫥':14,'塼':14,'硾':14,'斲':14,'罬':14,'榟':14,'禌':14,'嵸':14,'稯':14,'緃':14,
  '総':14,'箃':14,'緅':14,'靻':14,'嶊':14,'酻':14,'銌':14,'厂':15,'廠':15,'万':15,'萬':15,'亿':15,'億':15,'廣':15,'卫':15,
  '衛':15,'币':15,'幣':15,'击':15,'撃':15,'厉':15,'厲':15,'叶':15,'葉':15,'叽':15,'嘰':15,'仪':15,'儀':15,'乐':15,'樂':15,
  '汉':15,'漢':15,'写':15,'寫':15,'巩':15,'鞏':15,'价':15,'價':15,'冲':15,'衝':15,'庆':15,'慶':15,'刘':15,'劉':15,'兴':15,
  '興':15,'论':15,'論':15,'导':15,'導':15,'阵':15,'陣':15,'玛':15,'瑪':15,'进':15,'進':15,'抠':15,'摳':15,'折':15,'摺':15,
  '苇':15,'葦':15,'滷':15,'邮':15,'郵':15,'彆':15,'彻':15,'徹':15,'穀':15,'肠':15,'腸':15,'沪':15,'滬':15,'忧':15,'憂':15,
  '穷':15,'窮':15,'层':15,'層':15,'坠':15,'墜':15,'纬':15,'緯':15,'範':15,'枢':15,'樞':15,'卖':15,'賣':15,'码':15,'碼':15,
  '欧':15,'歐':15,'殴':15,'毆':15,'轮':15,'輪':15,'齿':15,'齒':15,'贤':15,'賢':15,'帜':15,'幟':15,'账':15,'賬':15,'刮':15,
  '颳':15,'质':15,'質':15,'征':15,'徵':15,'肿':15,'腫':15,'庙':15,'廟':15,'疟':15,'瘧':15,'废':15,'廢':15,'闹':15,'鬧':15,
  '审':15,'審':15,'陕':15,'陝':15,'驾':15,'駕':15,'练':15,'練':15,'驶':15,'駛':15,'驹':15,'駒':15,'驻':15,'駐':15,'驼':15,
  '駝':15,'荤':15,'葷':15,'标':15,'標':15,'鸦':15,'鴉':15,'虾':15,'蝦':15,'哗':15,'嘩':15,'罚':15,'罰':15,'贱':15,'賤':15,
  '複':15,'俭':15,'儉':15,'剑':15,'劍':15,'饵':15,'餌':15,'蚀':15,'蝕':15,'饺':15,'餃':15,'疮':15,'瘡':15,'养':15,'養':15,
  '陡':15,'除':15,'院':15,'娇':15,'嬌':15,'挚':15,'摯':15,'热':15,'熱':15,'噁':15,'莹':15,'瑩':15,'桩':15,'樁':15,'样':15,
  '樣':15,'致':15,'緻':15,'虑':15,'慮':15,'唠':15,'嘮':15,'敌':15,'敵':15,'脑':15,'腦':15,'皱':15,'皺':15,'桨':15,'槳':15,
  '浆':15,'漿':15,'郭':15,'部':15,'阅':15,'閲':15,'涤':15,'滌':15,'涨':15,'漲':15,'宽':15,'寬':15,'请':15,'請':15,'诽':15,
  '誹':15,'课':15,'課':15,'谁':15,'誰':15,'调':15,'調':15,'谅':15,'諒':15,'谆':15,'諄':15,'谈':15,'談':15,'谊':15,'誼':15,
  '剧':15,'劇':15,'琐':15,'瑣':15,'掺':15,'摻':15,'辆':15,'輛':15,'啸':15,'嘯':15,'铝':15,'鋁':15,'盘':15,'盤':15,'脚':15,
  '腳':15,'逸':15,'渐':15,'漸':15,'渔':15,'漁':15,'渗':15,'滲':15,'惭':15,'慚':15,'惨':15,'慘':15,'惯':15,'慣':15,'逮':15,
  '弹':15,'彈':15,'堕':15,'墮':15,'搂':15,'摟':15,'葫':15,'葬':15,'葛':15,'董':15,'葡':15,'葱':15,'蒂':15,'落':15,'葵':15,
  '确':15,'確':15,'暂':15,'暫':15,'辈':15,'輩':15,'辉':15,'輝':15,'赏':15,'賞':15,'喷':15,'噴':15,'践':15,'踐':15,'赋':15,
  '賦':15,'赐':15,'賜':15,'赔':15,'賠':15,'铺':15,'鋪':15,'销':15,'銷':15,'锄':15,'鋤':15,'锈':15,'銹':15,'锋':15,'鋒':15,
  '锌':15,'鋅':15,'锐':15,'銳':15,'鲁':15,'魯':15,'滞':15,'滯':15,'缅':15,'緬':15,'缉':15,'緝':15,'缎':15,'緞':15,'缓':15,
  '緩':15,'缔':15,'締':15,'编':15,'編':15,'缘':15,'緣':15,'瑰':15,'摸':15,'楼':15,'樓':15,'蜗':15,'蝸':15,'腰':15,'腥':15,
  '腮':15,'腹':15,'腺':15,'数':15,'數':15,'满':15,'滿':15,'漠':15,'滚':15,'熬':15,'墟':15,'摧':15,'摘':15,'摔':15,'慕':15,
  '暮':15,'摹':15,'模':15,'磁':15,'魄':15,'魅':15,'瘩':15,'瘟':15,'瘦':15,'弊':15,'漆':15,'漱':15,'漂':15,'漫':15,'滴':15,
  '漾':15,'演':15,'漏':15,'慢':15,'慷':15,'褐':15,'慧':15,'趣':15,'趟':15,'墩':15,'增':15,'鞋':15,'鞍':15,'横':15,'槽':15,
  '樟':15,'敷':15,'豌':15,'醋':15,'醇':15,'醉':15,'磕':15,'磊':15,'磅':15,'碾':15,'震':15,'霄':15,'暴':15,'瞎':15,'嘻':15,
  '嘶':15,'嘲':15,'嘹':15,'影':15,'踢':15,'踏':15,'踩':15,'踪':15,'蝶':15,'蝴':15,'蝠':15,'蝎':15,'蝌':15,'蝗':15,'蝙':15,
  '嘿':15,'幢':15,'墨':15,'靠':15,'稽':15,'稻':15,'黎':15,'稿':15,'稼':15,'箱':15,'箭':15,'篇':15,'僵':15,'躺':15,'僻':15,
  '德':15,'熟':15,'摩':15,'褒':15,'瘤':15,'凛':15,'毅':15,'糊':15,'翩':15,'慰':15,'劈':15,'履':15,'整':15,'嘴':15,'劢':15,
  '勱':15,'抟':15,'摶':15,'呒':15,'嘸':15,'庑':15,'廡':15,'沤':15,'漚':15,'怄':15,'慪':15,'陉':15,'陘':15,'妩':15,'嫵':15,
  '妫':15,'嬀':15,'枞':15,'樅':15,'咝':15,'噝':15,'刿':15,'劌':15,'侩':15,'儈':15,'侬':15,'儂':15,'刽':15,'劊':15,'怂':15,
  '慫':15,'诤':15,'諍':15,'驽':15,'駑':15,'驷':15,'駟':15,'驸':15,'駙':15,'骀':15,'駘':15,'荮':15,'葤':15,'殇':15,'殤':15,
  '哓':15,'嘵':15,'峣':15,'嶢':15,'峤':15,'嶠':15,'钡':15,'鋇':15,'鸨':15,'鴇':15,'饷':15,'餉':15,'饸':15,'餄':15,'饹':15,
  '餎':15,'闾':15,'閭':15,'迸':15,'浒':15,'滸':15,'恸':15,'慟':15,'鸩':15,'鴆':15,'陛':15,'陟':15,'娆':15,'嬈':15,'莴':15,
  '萵':15,'郴':15,'崂':15,'嶗':15,'郫':15,'阃':15,'閫':15,'訚':15,'誾':15,'阆':15,'閬':15,'郯':15,'涟':15,'漣':15,'悭':15,
  '慳':15,'诹':15,'諏':15,'诼':15,'諑':15,'诿':15,'諉':15,'谂':15,'諗':15,'谄':15,'諂':15,'谇':15,'誶':15,'娴':15,'嫻':15,
  '麸':15,'麩':15,'掴':15,'摑':15,'逵':15,'悫':15,'慤':15,'掼':15,'摜':15,'萸':15,'梿':15,'槤':15,'赉':15,'賚':15,'铗':15,
  '鋏':15,'铤':15,'鋌':15,'逶':15,'皑':15,'皚':15,'渍':15,'漬':15,'逯':15,'婵':15,'嬋':15,'靓':15,'靚':15,'辇':15,'輦':15,
  '颉':15,'頡':15,'摒':15,'葑':15,'葚':15,'葳':15,'葺':15,'葸':15,'萼':15,'葆':15,'葩':15,'葶':15,'萱':15,'葭':15,'赍':15,
  '賫':15,'辊':15,'輥':15,'辋':15,'輞':15,'椠':15,'槧':15,'辍':15,'輟':15,'辎':15,'輜':15,'赕':15,'賧':15,'铻':15,'鋙':15,
  '锃':15,'鋥':15,'锂':15,'鋰':15,'锆':15,'鋯':15,'锇':15,'鋨':15,'锉':15,'銼':15,'锑':15,'銻':15,'锒':15,'鋃':15,'锔':15,
  '鋦':15,'媭':15,'嬃':15,'颌':15,'頜':15,'腴':15,'腱':15,'鱿':15,'魷':15,'鲀':15,'魨':15,'鲂':15,'魴':15,'颍':15,'潁':15,
  '颎':15,'熲':15,'赓':15,'賡':15,'颏':15,'頦':15,'翚':15,'翬':15,'缂':15,'緙':15,'缃':15,'緗':15,'缄':15,'緘':15,'缇':15,
  '緹':15,'缈':15,'緲':15,'缌':15,'緦':15,'缑':15,'緱':15,'缗':15,'緡':15,'嘟':15,'腠':15,'腩':15,'腼':15,'腭':15,'腧':15,
  '漭':15,'滫':15,'褚':15,'瑶':15,'瑭':15,'獒':15,'慝':15,'摽':15,'撂':15,'摞':15,'翥':15,'摭':15,'磋':15,'霆':15,'罱':15,
  '骷':15,'骶':15,'箧':15,'篋':15,'箸':15,'箬':15,'儆':15,'魃':15,'魆':15,'獐':15,'瘙':15,'熥':15,'漕':15,'滹':15,'漯':15,
  '漶':15,'漪':15,'漉':15,'漳':15,'漩':15,'慵':15,'褙':15,'褓':15,'褊':15,'鼐':15,'耦':15,'奭':15,'髯':15,'髫':15,'鋆':15,
  '槿':15,'槭':15,'樗':15,'樘':15,'樊':15,'槲':15,'醌':15,'醅':15,'磔':15,'磙':15,'霈':15,'瞌':15,'瞋':15,'瞑':15,'嘭':15,
  '噎':15,'噘':15,'踔':15,'踝':15,'踟':15,'踒':15,'踮':15,'踺':15,'踞':15,'蝽':15,'蝻':15,'蝰':15,'蝮':15,'蝓':15,'蝣':15,
  '噗':15,'嘬':15,'噍':15,'噙':15,'噌':15,'噔':15,'幞':15,'幡':15,'嶙':15,'嶝':15,'稷':15,'箴':15,'篁':15,'篌':15,'篆':15,
  '牖':15,'儋':15,'磐':15,'虢':15,'麾':15,'廛':15,'瘛':15,'瘢':15,'瘠':15,'羯':15,'羰':15,'糌':15,'糍':15,'糅':15,'熜':15,
  '熵':15,'熠':15,'鋈':15,'寮':15,'窳':15,'熨':15,'嬉':15,'勰':15,'戮':15,'蝥':15,'畿':15,'髭':15,'樨':15,'祃':15,'禡':15,
  '玱':15,'瑲':15,'驵':15,'駔':15,'垯':15,'墶':15,'荭':15,'葒':15,'饻':15,'浐':15,'滻':15,'袆':15,'褘':15,'陧':15,'陞':15,
  '郪':15,'硙':15,'磑':15,'逴':15,'啴':15,'嘽':15,'铖':15,'鋮':15,'铘':15,'鋣':15,'脶':15,'腡':15,'逭':15,'裈':15,'褌':15,
  '婳':15,'嫿':15,'葜':15,'萳':15,'葙':15,'葴':15,'蒈':15,'萩':15,'葰':15,'葎':15,'蒎':15,'葖':15,'蒄':15,'萹':15,'辌':15,
  '輬':15,'嵚':15,'嶔':15,'赒':15,'賙':15,'铽':15,'鋱':15,'锊':15,'鋝':15,'锍':15,'鋶':15,'锓':15,'鋟':15,'鲃':15,'溇':15,
  '漊':15,'毵':15,'毿':15,'缊':15,'緼':15,'缐':15,'線':15,'瑳':15,'摛':15,'腽':15,'腨':15,'腯':15,'漷':15,'慥':15,'瑧':15,
  '瑨':15,'瑱':15,'瑢':15,'摏':15,'摴':15,'瞍':15,'獍':15,'廙':15,'瘗':15,'瘞':15,'瘥':15,'漹':15,'漖':15,'漤':15,'漼':15,
  '漴':15,'漈':15,'漻':15,'慬':15,'褕':15,'禛':15,'禚':15,'漦':15,'墣':15,'墦':15,'墡':15,'槱':15,'磏':15,'磉':15,'殣':15,
  '霅':15,'暵':15,'暲':15,'暶':15,'踦':15,'踣':15,'蝘':15,'蝲':15,'蝤':15,'噇':15,'噂':15,'噀':15,'嶓':15,'嶟':15,'嶒':15,
  '稹':15,'儇':15,'皞':15,'皛':15,'艎':15,'艏':15,'橥':15,'觭':15,'糇':15,'糈':15,'翦':15,'熛':15,'瑬':15,'戭':15,'嫽':15,
  '磜':15,'熰':15,'諓':15,'駓':15,'駉':15,'墠':15,'漍':15,'輗':15,'銶':15,'鋗':15,'鋐':15,'頫':15,'頠':15,'廞':15,'緥':15,
  '虣':15,'裦':15,'髱':15,'骲':15,'腤':15,'罯':15,'萻':15,'葊':15,'鞌':15,'墢':15,'慠':15,'摮':15,'滶':15,'獓':15,'鴁':15,
  '魬':15,'鳻':15,'逩':15,'躷':15,'骳':15,'緶':15,'缏':15,'艑':15,'箯':15,'糄':15,'諚':15,'嶏':15,'葧':15,'鋍':15,'駊':15,
  '滮':15,'諘':15,'麃':15,'徶':15,'槰':15,'逬':15,'滭':15,'熚':15,'腷':15,'豍':15,'貏':15,'駜':15,'髲':15,'魮':15,'郶':15,
  '噆':15,'慙':15,'摲':15,'慒':15,'萴':15,'儃':15,'幝':15,'摌':15,'獑':15,'緾':15,'鋋':15,'鋓':15,'閳':15,'誯':15,'樔':15,
  '漅':15,'窲':15,'趠':15,'麨':15,'憆':15,'摚':15,'緽':15,'夦':15,'敶':15,'樄':15,'諃':15,'賝':15,'霃':15,'噄':15,'慗':15,
  '殦':15,'翨':15,'腟':15,'誺':15,'骴':15,'徸':15,'憃':15,'緟':15,'蝩':15,'褈':15,'儊':15,'嘼':15,'廚':15,'諔':15,'暷':15,
  '篅':15,'摐':15,'摤':15,'漺':15,'牕':15,'漘':15,'箺':15,'萶':15,'陙':15,'諁':15,'醊':15,'辤':15,'飺':15,'餈':15,'噈':15,
  '踧':15,'麄':15,'鋑':15,'慛':15,'槯':15,'趡':15,'踤':15,'壿':15,'墫':15,'憁':15,'暰':15,'漎':15,'漗':15,'潀':15,'緫':15,
  '聦':15,'賩':15,'賨':15,'誴':15,'歵':15,'逪':15,'緿':15,'蝳':15,'勯':15,'嘾':15,'噉':15,'儅':15,'瞊':15,'趤':15,'衜':15,
  '墬':15,'墱':15,'嬁':15,'慸':15,'摕':15,'樀':15,'滺':15,'腣':15,'蝭':15,'艓':15,'褋':15,'墥':15,'箽':15,'諌':15,'瘨':15,
  '鼑':15,'鋀':15,'褍':15,'葮':15,'腶':15,'磓':15,'頧':15,'墪':15,'腞':15,'凙':15,'嫷':15,'嶞':15,'磀':15,'頞':15,'頟':15,
  '魤':15,'魥':15,'腝':15,'髮':15,'噃':15,'嬎':15,'嬏':15,'滼':15,'鴋':15,'摡':15,'槪':15,'漑':15,'葢':15,'鴀':15,'髴':15,
  '墳':15,'魵':15,'葍':15,'萯':15,'蝜':15,'褔':15,'鳺':15,'漧':15,'槹':15,'皜':15,'稾':15,'禞':15,'鞈':15,'韐':15,'緪':15,
  '羮':15,'僼':15,'摓':15,'漨':15,'熢':15,'篈':15,'鴌':15,'匔':15,'碽':15,'銾':15,'鋛':15,'撀':15,'嫴':15,'緺':15,'葀':15,
  '銽':15,'頢':15,'樌':15,'瘝':15,'輨':15,'嶡':15,'摫':15,'暩':15,'槶':15,'槻':15,'槼':15,'蟡':15,'滾':15,'緷':15,'彉':15,
  '慖':15,'槨':15,'輠':15,'餀':15,'嘷':15,'暭':15,'諕':15,'鞎':15,'熯':15,'鋎':15,'銲':15,'鋡':15,'魧':15,'摦':15,'嬅':15,
  '槬':15,'磆':15,'鋘':15,'翭':15,'葔':15,'諙':15,'潂':15,'篊':15,'葓':15,'谾':15,'槵':15,'鴅':15,'墴':15,'皝':15,'葟':15,
  '幠':15,'戱':15,'摢':15,'槴':15,'歑':15,'熩':15,'箶':15,'衚':15,'魱':15,'鳸':15,'噅':15,'噕':15,'圚':15,'嬇':15,'寭':15,
  '暳':15,'槥':15,'瘣':15,'缋':15,'萿':15,'槣':15,'樍':15,'漃':15,'禝':15,'箿':15,'葪':15,'蝍':15,'諅':15,'諆':15,'踑':15,
  '踖':15,'躸':15,'鞊':15,'腵':15,'熞':15,'糋':15,'葌':15,'葏':15,'葥':15,'趝':15,'鳽':15,'摾':15,'摪':15,'滰':15,'獎':15,
  '葁':15,'儌':15,'劋':15,'嫶':15,'嶕':15,'摷':15,'僸':15,'凚':15,'嶜':15,'歏':15,'漌':15,'鹶':15,'莭':15,'蝔':15,'誱':15,
  '踕':15,'魪':15,'幜':15,'葝':15,'慦':15,'摎':15,'樛':15,'稵':15,'噊':15,'爴':15,'瘚':15,'觮':15,'逫':15,'鴂':15,'鴃':15,
  '勮':15,'聥':15,'萭':15,'葅':15,'蝺':15,'諊':15,'趜':15,'踘':15,'踙':15,'躹':15,'閰':15,'駏':15,'慻':15,'踡':15,'韏':15,
  '餋':15,'儁':15,'陖':15,'輡':15,'漮':15,'槺':15,'髛':15,'樖':15,'艐':15,'萪':15,'摼':15,'銵':15,'瞉':15,'墤':15,'嘳':15,
  '磈':15,'聧':15,'樃':15,'瑯':15,'噋':15,'磖':15,'逨':15,'郲':15,'厱':15,'葻':15,'醂':15,'樏':15,'畾':15,'頛':15,'頪':15,
  '踜':15,'輘':15,'樆':15,'氂':15,'犛':15,'瑮':15,'蝷':15,'鋫':15,'劆':15,'匳':15,'噒':15,'嫾':15,'慩':15,'摙':15,'稴':15,
  '萰':15,'樑':15,'嶚':15,'嶛':15,'憀':15,'敹':15,'熮':15,'巤':15,'颲':15,'駖':15,'慺':15,'熡':15,'瑠':15,'磂':15,'駠':15,
  '嶐':15,'摝':15,'樐':15,'樚':15,'熝':15,'趢':15,'踛':15,'醁':15,'魲':15,'鋢':15,'踚':15,'躶':15,'犘':15,'嘪':15,'蝐':15,
  '慲':15,'摱':15,'槾':15,'樠':15,'獌':15,'嫹':15,'瞐':15,'艒':15,'萺':15,'髳':15,'嬍':15,'篃':15,'腜':15,'蝞':15,'葿':15,
  '鋂':15,'暪':15,'蝱':15,'樒':15,'滵':15,'漞':15,'瞇':15,'葞':15,'鼏':15,'緜':15,'糆':15,'臱':15,'葂':15,'蝒':15,'麪':15,
  '僶':15,'慜':15,'篎':15,'緢':15,'嫼':15,'慔':15,'暯':15,'獏':15,'魩':15,'氁':15,'霂':15,'誽':15,'魶':15,'摨':15,'暱':15,
  '殢':15,'觬':15,'貎':15,'郳':15,'艌':15,'樢':15,'摰':15,'槸':15,'槷':15,'踗':15,'辳':15,'腢':15,'輫':15,'鋬':15,'樥':15,
  '漰':15,'輣':15,'輧':15,'駍':15,'慿':15,'箳':15,'郱':15,'頩':15,'葐':15,'磇':15,'諀':15,'髬':15,'鴄':15,'頨':15,'慓':15,
  '嫳':15,'諩':15,'陠':15,'噐':15,'慽':15,'慼':15,'甈':15,'磎':15,'羬':15,'諐':15,'輤':15,'漒':15,'僺':15,'嘺':15,'墝':15,
  '墧':15,'碻':15,'箾':15,'陗':15,'頝':15,'踥':15,'鳹':15,'樈':15,'漀':15,'郬':15,'瞏':15,'篍':15,'緧':15,'蝵':15,'趞':15,
  '嘫':15,'憈':15,'敺':15,'葋':15,'誳':15,'駈':15,'葲':15,'槦':15,'滽':15,'穁':15,'腬':15,'葇':15,'蝚':15,'餁':15,'蝡':15,
  '緛':15,'摋':15,'僿':15,'犙':15,'糂':15,'槮':15,'葠':15,'覢':15,'摵':15,'儍':15,'閯':15,'魦':15,'萷':15,'慯':15,'樉':15,
  '滳':15,'漡':15,'墭':15,'箵':15,'慴':15,'瑡':15,'箷':15,'蝨':15,'葹':15,'銴':15,'鳾':15,'鋠':15,'頣':15,'魫':15,'樜':15,
  '豎':15,'慡':15,'廝':15,'磃':15,'禠':15,'罳':15,'鋖':15,'樎':15,'摍':15,'摗':15,'樕':15,'碿':15,'鋉':15,'熣':15,'賥':15,
  '箰':15,'誻':15,'摥':15,'漟':15,'磄':15,'禟':15,'糃':15,'蝪':15,'瑫':15,'鞉':15,'漛':15,'歒':15,'褅':15,'褆':15,'逷':15,
  '骵':15,'髰':15,'墵':15,'歎':15,'醈':15,'磌':15,'窴':15,'覥':15,'賟':15,'餂':15,'樤':15,'窱':15,'鋚':15,'聤':15,'蝏':15,
  '閮':15,'憅':15,'樋':15,'餇':15,'緰':15,'廜':15,'尵':15,'慱':15,'漙':15,'槫':15,'褖':15,'駞':15,'漥':15,'翫':15,'踠':15,
  '鋄':15,'鋔':15,'魭':15,'熭':15,'犚':15,'緭':15,'腲':15,'葨':15,'蝛':15,'蝟':15,'覣':15,'踓':15,'醀':15,'韑':15,'瑥':15,
  '魰':15,'鳼':15,'鴍':15,'墲':15,'瑦':15,'箼':15,'腛':15,'噏':15,'嬆':15,'槢':15,'漇':15,'漝':15,'瘜':15,'葈':15,'覤':15,
  '瞈':15,'磍':15,'陜':15,'誷':15,'嫺':15,'甉':15,'箲':15,'誸':15,'鋧':15,'韯':15,'嶑':15,'萫':15,'彇':15,'誵':15,'郩':15,
  '屧':15,'暬':15,'緤':15,'緳':15,'蝢':15,'褉':15,'篂':15,'葕':15,'鋞':15,'樇':15,'潃':15,'褏':15,'褎':15,'箮':15,'翧':15,
  '萲':15,'蝖':15,'漵':15,'稸':15,'緖':15,'蝑':15,'魣':15,'漄':15,'摿':15,'瑤':15,'窯':15,'窰':15,'葯':15,'葽':15,'餆':15,
  '嬊':15,'嶖':15,'揅':15,'褗':15,'醃':15,'鴈':15,'駚':15,'嬄':15,'熤':15,'熪':15,'輢':15,'黓':15,'僷':15,'墷':15,'漜':15,
  '噖':15,'殥':15,'緸':15,'趛':15,'鞇':15,'摬':15,'甇':15,'禜':15,'萾':15,'蝧':15,'牅':15,'銿':15,'逰':15,'慾':15,'稶':15,
  '羭':15,'萮':15,'逳':15,'鋊':15,'雓':15,'鳿':15,'葾':15,'蝝':15,'蝯':15,'褑':15,'駌':15,'箹':15,'閱':15,'磒':15,'腪':15,
  '蒀':15,'魳':15,'賛':15,'諎':15,'銺':15,'樝':15,'嫸':15,'嶘':15,'輚':15,'醆':15,'慞':15,'瑵':15,'駋':15,'慹':15,'輙':15,
  '銸':15,'駗':15,'嬂':15,'憄':15,'漐':15,'熫':15,'稺':15,'鋕':15,'鳷':15,'僽':15,'輖':15,'週':15,'郮':15,'駎':15,'樦':15,
  '蝫':15,'蒃':15,'諈':15,'劅':15,'鋜':15,'葘':15,'摠':15,'熧':15,'糉':15,'緵':15,'翪':15,'踨':15,'蝬':15,'葼':15,'郰':15,
  '葃':15,'葄':15,'乡':16,'鄉':16,'历':16,'歷':16,'曆':16,'办':16,'辦':16,'扑':16,'撲':16,'龙':16,'龍':16,'卢':16,'盧':16,
  '头':16,'頭':16,'朴':16,'樸':16,'机':16,'機':16,'过':16,'過':16,'达':16,'達':16,'噹':16,'灯':16,'燈':16,'讳':16,'諱':16,
  '讽':16,'諷':16,'儘':16,'陰':16,'违':16,'違':16,'运':16,'運':16,'抚':16,'撫':16,'坛':16,'壇':16,'苍':16,'蒼':16,'县':16,
  '縣':16,'吨':16,'噸':16,'餘':16,'龟':16,'龜':16,'诸':16,'諸':16,'陆':16,'陸':16,'陈':16,'陳':16,'表':16,'錶':16,'拨':16,
  '撥':16,'奋':16,'奮':16,'凭':16,'憑':16,'剂':16,'劑':16,'泼':16,'潑':16,'怜':16,'憐':16,'学':16,'學':16,'录':16,'録':16,
  '挠':16,'撓':16,'树':16,'樹':16,'砖':16,'磚':16,'战':16,'戰':16,'蚂':16,'螞':16,'骂':16,'駡':16,'钢':16,'鋼':16,'亲':16,
  '親':16,'诺':16,'諾':16,'洁':16,'潔':16,'浇':16,'澆':16,'举':16,'舉':16,'宪':16,'憲':16,'垦':16,'墾':16,'骆':16,'駱':16,
  '骇':16,'駭':16,'捞':16,'撈':16,'都':16,'桥':16,'橋':16,'桦':16,'樺':16,'晓':16,'曉':16,'鸭':16,'鴨':16,'鸯':16,'鴦':16,
  '罢':16,'罷':16,'钱':16,'錢':16,'积':16,'積':16,'舱':16,'艙':16,'鸵':16,'鸳':16,'鴛':16,'饿':16,'餓':16,'馁':16,'餒':16,
  '烧':16,'燒':16,'涝':16,'澇':16,'润':16,'潤':16,'涧':16,'澗':16,'烫':16,'燙':16,'涩':16,'澀':16,'悯':16,'憫':16,'陵':16,
  '陶':16,'陷':16,'陪':16,'萤':16,'螢':16,'酝':16,'醖':16,'鄂':16,'阎':16,'閻':16,'盖':16,'蓋':16,'谋':16,'謀':16,'谍':16,
  '諜':16,'谐':16,'諧':16,'谓':16,'謂':16,'谚':16,'諺':16,'颈':16,'頸':16,'椭':16,'橢':16,'逼':16,'颊':16,'頰':16,'遇':16,
  '遏':16,'赌':16,'賭':16,'筑':16,'築':16,'筛':16,'篩':16,'御':16,'禦':16,'逾':16,'道':16,'遂':16,'溃':16,'潰':16,'愤':16,
  '憤':16,'遍':16,'裤':16,'褲':16,'蒜':16,'蓄':16,'蒲':16,'蓉':16,'蒙':16,'蒸':16,'赖':16,'賴':16,'辐':16,'輻':16,'辑':16,
  '輯':16,'输':16,'輸':16,'频':16,'頻':16,'错':16,'錯':16,'锡':16,'錫':16,'锤':16,'錘':16,'锥':16,'錐':16,'锦':16,'錦':16,
  '锯':16,'鋸':16,'锰':16,'錳':16,'颓':16,'頹':16,'遥':16,'腿':16,'鲍':16,'鮑':16,'颖':16,'穎':16,'窥':16,'窺':16,'缚':16,
  '縛':16,'剿':16,'静':16,'靜':16,'璃':16,'墙':16,'墻':16,'撇':16,'踊':16,'踴':16,'膊':16,'膀':16,'膏':16,'褪':16,'撕':16,
  '撒':16,'撩':16,'撑':16,'撮':16,'撬':16,'播':16,'撞':16,'撤':16,'撰':16,'橡':16,'橄':16,'瞒':16,'瞞':16,'艘':16,'憋':16,
  '潜':16,'澎':16,'潮':16,'潭':16,'潘':16,'澈':16,'澄':16,'憔':16,'憎':16,'褥':16,'憨':16,'豫':16,'燕':16,'翰':16,'噩':16,
  '橱':16,'橙':16,'橘':16,'融':16,'瓢':16,'醒':16,'霍':16,'霎':16,'冀':16,'餐':16,'踱':16,'蹄':16,'蹂':16,'螃':16,'器':16,
  '噪':16,'默':16,'黔':16,'穆':16,'篡':16,'儒':16,'衡':16,'雕':16,'磨':16,'瘸':16,'凝':16,'辨':16,'糖':16,'糕':16,'燃':16,
  '壁':16,'沩':16,'潙':16,'怃':16,'憮':16,'瓯':16,'甌':16,'昙':16,'曇':16,'峄':16,'嶧':16,'侪':16,'儕':16,'郓':16,'鄆':16,
  '诨':16,'諢':16,'绉':16,'縐':16,'挦':16,'撏':16,'荪':16,'蓀':16,'哕':16,'噦':16,'哙':16,'噲':16,'哝':16,'噥':16,'笃':16,
  '篤':16,'俦':16,'儔':16,'疭':16,'瘲':16,'炽':16,'熾':16,'浔':16,'潯':16,'骈':16,'駢':16,'莳':16,'蒔':16,'鸪':16,'鴣':16,
  '莼':16,'蒓':16,'桡':16,'橈':16,'鸮':16,'鴞':16,'鸱':16,'鴟':16,'鸲':16,'鴝':16,'饽':16,'餑':16,'烨':16,'燁':16,'涠':16,
  '潿':16,'谀':16,'諛':16,'陬':16,'陲':16,'绦':16,'縧':16,'琏':16,'璉':16,'掸':16,'撣':16,'萦':16,'縈':16,'郾':16,'鄄':16,
  '铮':16,'錚':16,'阈':16,'閾':16,'阉':16,'閹':16,'阊':16,'閶':16,'阍':16,'閽':16,'阏':16,'閼':16,'焖':16,'燜':16,'惮':16,
  '憚':16,'谌':16,'諶':16,'谏':16,'諫':16,'谒':16,'謁':16,'谔':16,'諤':16,'谕':16,'諭':16,'谖':16,'諼':16,'谙':16,'諳':16,
  '谛':16,'諦':16,'谝':16,'諞':16,'郿':16,'揿':16,'撳':16,'殚':16,'殫':16,'蛳':16,'螄':16,'遄':16,'铼':16,'錸':16,'锕':16,
  '錒':16,'傧':16,'儐':16,'遑':16,'遁':16,'遒':16,'愦':16,'憒':16,'遐':16,'缒':16,'縋':16,'蓁':16,'蓍':16,'蓐':16,'蒽':16,
  '蓓':16,'蓖':16,'蓊':16,'蒯':16,'蓑':16,'蒿':16,'蒺':16,'蒟':16,'蒡':16,'蒹':16,'蒴':16,'蒗':16,'颐':16,'頤':16,'碛':16,
  '磧':16,'碜':16,'磣':16,'辏':16,'輳':16,'嗳':16,'噯':16,'锛':16,'錛':16,'锜':16,'錡':16,'锝':16,'鍀':16,'锞':16,'錁':16,
  '锟':16,'錕':16,'锢':16,'錮':16,'锨':16,'鍁':16,'锩':16,'錈':16,'锭':16,'錠':16,'锱':16,'錙':16,'觎':16,'覦':16,'颔':16,
  '頷':16,'鲅':16,'鮁':16,'鲆':16,'鮃':16,'鲇':16,'鮎':16,'稣':16,'穌':16,'鲋':16,'鮒':16,'鲐':16,'鮐':16,'瘆':16,'瘮':16,
  '滗':16,'潷':16,'嫒':16,'嬡':16,'缙':16,'縉':16,'缜':16,'縝':16,'缛':16,'縟':16,'缟':16,'縞':16,'缢':16,'縊':16,'缣':16,
  '縑':16,'璈':16,'甍':16,'螂':16,'膈':16,'瘘':16,'瘻':16,'膂':16,'潢':16,'潴':16,'澉':16,'褡':16,'嫱':16,'嬙':16,'瑾':16,
  '璀':16,'璁':16,'璋':16,'璇':16,'撅':16,'赭':16,'撙':16,'瞢':16,'噶':16,'暹':16,'螋':16,'噢':16,'骺':16,'骼':16,'骸':16,
  '獗':16,'獠':16,'瘼':16,'澍':16,'澌':16,'潸':16,'潦':16,'潲':16,'潟':16,'潼':16,'潺':16,'憬':16,'憧':16,'褟':16,'褫':16,
  '耩':16,'耨':16,'耪':16,'靛':16,'髻':16,'髹':16,'熹':16,'縠':16,'磬':16,'鞘':16,'樾':16,'橛':16,'橇':16,'樵':16,'樽':16,
  '墼':16,'橐':16,'翮':16,'醐':16,'醍':16,'殪':16,'霖':16,'霏':16,'霓':16,'臻':16,'氅':16,'瞟':16,'瞠':16,'噤':16,'暾':16,
  '蹀':16,'踹':16,'踵':16,'踽':16,'蹁':16,'螈':16,'螅':16,'螠':16,'螟':16,'噱':16,'噬':16,'噫':16,'噻':16,'噼':16,'圜':16,
  '氆':16,'憩':16,'篝':16,'篥':16,'篦':16,'篪':16,'篙':16,'盥':16,'劓':16,'翱':16,'徼':16,'歙':16,'廨':16,'瘰':16,'廪':16,
  '瘵':16,'瘴':16,'瘳':16,'麇':16,'麈':16,'壅':16,'羲':16,'糗':16,'燎':16,'燔':16,'潞':16,'褰':16,'寰':16,'窸':16,'嬖':16,
  '犟':16,'嬗':16,'㧑':16,'撝':16,'沄':16,'澐':16,'钔':16,'鍆':16,'峃':16,'嶨':16,'哒':16,'噠':16,'骃':16,'駰':16,'鄀':16,
  '晔':16,'曄':16,'崄':16,'嶮':16,'鸰':16,'鴒':16,'窎':16,'窵':16,'陴':16,'䓨':16,'罃':16,'鄅':16,'鄃':16,'阌':16,'閿':16,
  '谞':16,'諝':16,'蓇':16,'蒐':16,'颋':16,'頲':16,'遆':16,'赪':16,'赬':16,'蒱':16,'蒨':16,'蓏':16,'蓂':16,'蒻':16,'辒':16,
  '輼':16,'赗':16,'賵':16,'锖':16,'錆':16,'锳':16,'鍈':16,'锪':16,'鍃':16,'锫':16,'錇':16,'锬':16,'錟':16,'䅟':16,'穇':16,
  '筼':16,'篔':16,'鲉':16,'鮋':16,'鲊':16,'鮓':16,'鲌':16,'鮊':16,'䲟':16,'鮣':16,'鲏':16,'鮍':16,'缞':16,'縗':16,'撖':16,
  '潩':16,'漋':16,'窭':16,'窶':16,'璆':16,'劐':16,'鼒':16,'慭':16,'憖':16,'罶':16,'嶲':16,'潖':16,'潵':16,'澂':16,'潽':16,
  '潾':16,'潏':16,'憭':16,'憕':16,'褯':16,'禤':16,'憙':16,'鞔':16,'橞':16,'橑':16,'橦':16,'醑':16,'觱':16,'磡':16,'虤':16,
  '暿':16,'曌':16,'曈':16,'蹅':16,'踶':16,'螗':16,'疁':16,'嶦':16,'馞':16,'穄':16,'篚':16,'鼽':16,'衠':16,'盦':16,'螣':16,
  '縢':16,'癀':16,'瘭':16,'羱':16,'糒':16,'燋':16,'熻':16,'燊':16,'燚':16,'燏':16,'嬛':16,'翯':16,'潕':16,'鋹':16,'錀':16,
  '駪':16,'餗':16,'燖':16,'諲':16,'諴':16,'諟':16,'燀':16,'輶':16,'輮':16,'錤':16,'錞':16,'鮈':16,'篢':16,'鮀':16,'頵':16,
  '璊':16,'鮆':16,'縍':16,'艕':16,'賲':16,'闁':16,'儑':16,'錌':16,'墺':16,'磝':16,'螌':16,'褩':16,'撪':16,'燌':16,'獖':16,
  '壀':16,'憊':16,'鄁':16,'錃':16,'錍':16,'辧':16,'鞕':16,'鴘':16,'壆':16,'孹':16,'駮':16,'磦':16,'麅':16,'鉼':16,'錋':16,
  '廦':16,'獘':16,'獙':16,'螕':16,'鮅':16,'餔':16,'嬠':16,'憯':16,'撡':16,'憡':16,'橬':16,'幨':16,'潹':16,'磛':16,'撦':16,
  '疀':16,'艖':16,'瑺':16,'錩':16,'鋿':16,'窼':16,'撐':16,'撜':16,'橕':16,'頳':16,'踸':16,'齓':16,'憏':16,'瞝':16,'遅':16,
  '篘':16,'雔':16,'霌':16,'篨':16,'蒢':16,'蒭':16,'麆':16,'歘':16,'諯':16,'踳':16,'輲':16,'磢':16,'窻':16,'憌':16,'橁':16,
  '賰':16,'輴':16,'醕':16,'磭':16,'縒':16,'螆':16,'鴜':16,'憱':16,'殧':16,'瘯':16,'踿':16,'殩':16,'熶':16,'撘':16,'觰':16,
  '皠':16,'磪':16,'澊':16,'樷':16,'潨':16,'瑽':16,'瞛':16,'錝':16,'蒫':16,'蓌':16,'曃':16,'鴏':16,'噡':16,'撢':16,'暺':16,
  '潬':16,'鴠':16,'黕':16,'潒':16,'逿':16,'噵':16,'衟':16,'嶳':16,'潪':16,'甋':16,'鴩':16,'嬞':16,'駧':16,'壂':16,'橂':16,
  '蒧':16,'瞗':16,'瘹':16,'鋽':16,'錭':16,'鮉':16,'螙':16,'覩':16,'醏':16,'錖':16,'餖':16,'毈':16,'憝':16,'憞':16,'陮':16,
  '撉':16,'潡':16,'燉':16,'犜':16,'踲':16,'憜':16,'嶭':16,'覨':16,'遌':16,'樲':16,'輭':16,'駬':16,'髵':16,'髶':16,'橃':16,
  '憣':16,'橎':16,'燓':16,'曊':16,'陫':16,'幩':16,'橨':16,'歕':16,'蒶':16,'黺':16,'澓':16,'糐':16,'諨':16,'踾':16,'輹':16,
  '陚':16,'鮄':16,'鴔':16,'麬':16,'嶱':16,'諽':16,'輵':16,'鴚':16,'澒':16,'髸':16,'褠':16,'橭':16,'糓':16,'縎':16,'鮕':16,
  '踻':16,'髺':16,'舘':16,'錧':16,'黆':16,'撌':16,'樻':16,'瞡':16,'蓕':16,'螝':16,'鮌':16,'潶':16,'澔':16,'獋':16,'澕':16,
  '篕':16,'蒚':16,'螛':16,'魺':16,'噷':16,'澏':16,'螒':16,'馠':16,'魽':16,'澅':16,'螖':16,'諣':16,'鄇':16,'褢':16,'褱':16,
  '撔':16,'撗':16,'橫':16,'澋':16,'諻':16,'彋':16,'輷':16,'闀':16,'闂':16,'霐':16,'鬨':16,'曂':16,'熿':16,'獚':16,'螜':16,
  '頶':16,'噧':16,'嬒':16,'徻':16,'憓':16,'殨':16,'毇':16,'潓':16,'頮':16,'奯':16,'蒦':16,'蓃':16,'嶯':16,'撠':16,'潗':16,
  '穊':16,'膌':16,'螏':16,'豭':16,'貑':16,'鴐':16,'劒':16,'橌':16,'熸':16,'鋻':16,'壃':16,'彊':16,'噭':16,'嬓':16,'憍':16,
  '撟':16,'敽':16,'潐':16,'瘽':16,'賮':16,'黅':16,'镼':16,'暻':16,'燛':16,'璄':16,'澃':16,'褧':16,'駫':16,'醔':16,'憠':16,
  '憰':16,'撧':16,'橜':16,'壉':16,'郹':16,'陱':16,'鮔':16,'鴡':16,'鞙':16,'鬳':16,'寯':16,'燇':16,'餕':16,'穅':16,'錓':16,
  '瞘':16,'骻':16,'廥':16,'聭':16,'鄈':16,'頯':16,'朤':16,'蓈':16,'瑻':16,'閸':16,'憥':16,'橯':16,'憦':16,'頱':16,'儖':16,
  '壈':16,'燗':16,'覧':16,'磥':16,'錑':16,'蒞':16,'錅':16,'隷':16,'鴗':16,'嬚':16,'膁':16,'螊':16,'錬':16,'暸':16,'窷':16,
  '膋':16,'錂':16,'魿':16,'鹷':16,'廩':16,'撛':16,'斴':16,'暽':16,'橉':16,'燐':16,'獜':16,'閵':16,'甊':16,'瘺':16,'瞜':16,
  '橊':16,'橮':16,'澑':16,'磟':16,'蒥':16,'蓅':16,'篭':16,'磠':16,'穋':16,'錄':16,'陯':16,'罵':16,'貓':16,'燘':16,'穈':16,
  '儚':16,'橗':16,'冪':16,'幦':16,'蒾':16,'醎':16,'靦':16,'鴓':16,'潣':16,'賯':16,'錉':16,'閺':16,'鴖':16,'橅':16,'瞙':16,
  '蒳':16,'褦':16,'螚':16,'諵':16,'嶩':16,'錗':16,'儗':16,'糑':16,'縌':16,'撚':16,'儜':16,'橣':16,'嬝':16,'褭':16,'篞':16,
  '臲':16,'錜':16,'蒘':16,'鴑':16,'撋':16,'橠':16,'蹃':16,'逽':16,'縏':16,'蒰':16,'篣':16,'麭':16,'憉':16,'磞':16,'韸':16,
  '竮':16,'潎':16,'膍':16,'魾':16,'撆':16,'暼':16,'蒪':16,'獛':16,'摖':16,'璂':16,'磩':16,'禥':16,'諬':16,'諿':16,'陭':16,
  '霋':16,'儙':16,'潛':16,'燂':16,'燅':16,'篟':16,'廧':16,'篬':16,'墽':16,'幧':16,'燆':16,'犞':16,'郻':16,'韒':16,'骹':16,
  '螓':16,'儝':16,'橩':16,'螑':16,'趥':16,'鮂':16,'蒛':16,'橪':16,'髷':16,'魼':16,'麮':16,'縓':16,'駩':16,'氄':16,'縙':16,
  '螎':16,'褣':16,'駥':16,'鴧':16,'叡':16,'橤':16,'橍':16,'篛':16,'褬':16,'樿':16,'橏':16,'澁':16,'瘷':16,'蔱':16,'颵':16,
  '陹':16,'嬕':16,'蒒':16,'諡':16,'遈':16,'餝':16,'膄':16,'頥':16,'潻':16,'錰':16,'霔':16,'縔':16,'橓':16,'瞚':16,'燍':16,
  '璅':16,'簑':16,'褨':16,'瘶':16,'橚':16,'憟':16,'潚':16,'潥':16,'縤':16,'膆':16,'匴':16,'嬘':16,'遀':16,'鞖':16,'潠':16,
  '錔':16,'儓':16,'橖':16,'篖':16,'膅':16,'蓎':16,'踼':16,'縚':16,'鋾':16,'駣':16,'駦':16,'漽':16,'趧':16,'憳':16,'憛':16,
  '橝':16,'醓':16,'錪':16,'斢':16,'鞗':16,'諪':16,'鞓':16,'朣':16,'氃':16,'燑':16,'犝':16,'獞':16,'瑹':16,'潳':16,'蒤':16,
  '馟':16,'橔':16,'頺':16,'頽':16,'霕':16,'黗':16,'貒':16,'撱':16,'鴕':16,'膃':16,'潫':16,'衞':16,'鮇':16,'螡':16,'儛':16,
  '橆':16,'窹':16,'螐':16,'凞':16,'憘':16,'敼':16,'橀':16,'歖':16,'潝':16,'熺':16,'縘':16,'蒠':16,'蒵':16,'蓆':16,'螇':16,
  '諰':16,'黖':16,'聬':16,'螉':16,'縖':16,'赮':16,'魻':16,'嬐':16,'憪':16,'撊':16,'澖':16,'蓒':16,'輱':16,'錎':16,'憢':16,
  '撨':16,'歗':16,'熽':16,'獟':16,'獢':16,'篠':16,'嶰':16,'糏':16,'膎':16,'韰':16,'嬜':16,'攳':16,'樳':16,'鮏':16,'糔':16,
  '諠':16,'颴':16,'歔':16,'獝':16,'蒣':16,'勳':16,'駨':16,'錏':16,'蓔':16,'鴢':16,'鼼':16,'辥':16,'噞':16,'燄':16,'躽':16,
  '遃':16,'諹':16,'輰':16,'圛':16,'墿':16,'夁':16,'嬑':16,'嬟':16,'嶬':16,'撎':16,'曀':16,'熼':16,'瑿':16,'瘱':16,'瞖':16,
  '膉':16,'艗':16,'螔':16,'螘':16,'郼':16,'壄':16,'嶪':16,'嶫':16,'曅':16,'潱':16,'憗':16,'璌':16,'癊':16,'磤':16,'蒑':16,
  '霒':16,'噟':16,'褮':16,'頴':16,'噰':16,'郺':16,'遊':16,'噳':16,'蒮':16,'螤':16,'貐':16,'踰':16,'錥':16,'鴥':16,'噮':16,
  '蒬':16,'蒝':16,'褤':16,'鋺':16,'篗':16,'橒':16,'縕':16,'縜':16,'蒕':16,'蒷':16,'蝹':16,'褞':16,'賱':16,'縡':16,'賳':16,
  '撍':16,'皟':16,'瞔':16,'橧':16,'熷':16,'皻':16,'虥':16,'虦':16,'霑':16,'瘬':16,'瞕':16,'踷':16,'樼':16,'潧':16,'縥':16,
  '蒖':16,'遉':16,'錱':16,'篜':16,'鬇':16,'鴊':16,'搱':16,'旘':16,'樴':16,'駤':16,'鴙':16,'諥':16,'鴤':16,'噣':16,'濐':16,
  '篫':16,'豬':16,'駯':16,'瑼':16,'甎':16,'竱':16,'膇':16,'錣':16,'撯':16,'擆':16,'篧':16,'谘':16,'諮':16,'輺':16,'趦':16,
  '磫':16,'蒩':16,'樶':16,'鋷':16,'錊':16,'蔔':17,'了':17,'瞭':17,'亏':17,'虧':17,'忆':17,'憶':17,'丑':17,'醜':17,'队':17,
  '隊':17,'压':17,'壓':17,'吓':17,'嚇':17,'曲':17,'麯':17,'屿':17,'嶼':17,'优':17,'優':17,'讲':17,'講':17,'阳':17,'陽':17,
  '阶':17,'階':17,'戏':17,'戲':17,'纤':17,'縴':17,'远':17,'遠':17,'声':17,'聲':17,'励':17,'勵':17,'疗':17,'療':17,'应':17,
  '應':17,'灿':17,'燦':17,'纵':17,'縱':17,'担':17,'擔':17,'拥':17,'擁':17,'择':17,'擇':17,'板':17,'闆':17,'岭':17,'嶺':17,
  '购':17,'購':17,'肤':17,'膚':17,'泽':17,'澤':17,'隶':17,'隸':17,'弥':17,'彌':17,'艰':17,'艱':17,'帮':17,'幫':17,'挡':17,
  '擋':17,'荫':17,'蔭':17,'点':17,'點':17,'临':17,'臨':17,'虽':17,'雖':17,'钟':17,'鍾':17,'毡':17,'氈':17,'独':17,'獨':17,
  '饼':17,'餅':17,'总':17,'總':17,'浊':17,'濁':17,'浓':17,'濃':17,'逊':17,'遜':17,'捡':17,'撿':17,'莲':17,'蓮':17,'档':17,
  '檔':17,'耸':17,'聳':17,'胶':17,'膠':17,'斋':17,'齋':17,'烛':17,'燭':17,'递':17,'遞':17,'恳':17,'懇':17,'骏':17,'駿':17,
  '据':17,'據':17,'营':17,'營':17,'检':17,'檢':17,'婴':17,'嬰':17,'矫':17,'矯':17,'偿':17,'償':17,'鸽':17,'鴿':17,'敛':17,
  '斂':17,'馅':17,'餡':17,'馆':17,'館':17,'鸿':17,'鴻':17,'淀':17,'澱':17,'谎':17,'謊':17,'谜':17,'謎':17,'隋':17,'隅':17,
  '隆':17,'绩':17,'績':17,'趋':17,'趨':17,'联':17,'聯':17,'蒋':17,'蔣':17,'韩':17,'韓':17,'锅':17,'鍋':17,'阔':17,'闊':17,
  '粪':17,'糞':17,'禅':17,'禪':17,'谢':17,'謝':17,'谣':17,'謠':17,'谤':17,'謗':17,'谦':17,'謙':17,'缕':17,'縷':17,'蓬':17,
  '尴':17,'尷':17,'遣':17,'锚':17,'錨':17,'键':17,'鍵':17,'誊':17,'謄':17,'缝':17,'縫':17,'蔓':17,'蔡':17,'蔗':17,'蔚':17,
  '辖':17,'轄':17,'辗':17,'輾':17,'颗':17,'顆':17,'赚':17,'賺':17,'锹':17,'鍬':17,'锻':17,'鍛':17,'镀':17,'鍍':17,'舆':17,
  '輿':17,'膜':17,'鲜':17,'鮮':17,'赛':17,'賽':17,'缩':17,'縮':17,'擒':17,'聪':17,'聰':17,'蔬':17,'篓':17,'簍':17,'膝':17,
  '膛':17,'澳':17,'懂':17,'懊':17,'撼':17,'擂':17,'操':17,'擅':17,'擎':17,'蟆':17,'篷':17,'糙':17,'澡':17,'激':17,'憾':17,
  '懈':17,'窿':17,'鞠':17,'檐':17,'檀':17,'礁':17,'磷':17,'霜':17,'霞':17,'瞧':17,'瞬':17,'瞳':17,'瞪':17,'蹋':17,'蹈':17,
  '螺':17,'蟋':17,'蟀':17,'嚎':17,'穗':17,'簇':17,'繁':17,'徽':17,'癌':17,'糟':17,'糠':17,'燥':17,'豁':17,'玑':17,'璣':17,
  '邬':17,'鄔':17,'苁':17,'蓯':17,'矶':17,'磯':17,'邹':17,'鄒':17,'闱':17,'闈':17,'诌':17,'謅':17,'茑':17,'蔦':17,'咛':17,
  '嚀':17,'饯':17,'餞':17,'怿':17,'懌':17,'挝':17,'撾':17,'挞':17,'撻':17,'荜':17,'蓽':17,'柽':17,'檉':17,'郧':17,'鄖':17,
  '狯':17,'獪':17,'浍':17,'澮':17,'桧':17,'檜':17,'龀':17,'齔':17,'觊':17,'覬':17,'猃':17,'獫':17,'烩':17,'燴':17,'骋':17,
  '騁':17,'骎':17,'駸':17,'掳':17,'擄':17,'鸸':17,'鴯':17,'殓':17,'殮':17,'跄':17,'蹌':17,'铡':17,'鍘':17,'鸹':17,'鴰':17,
  '鸻':17,'鴴':17,'馃':17,'餜':17,'馄':17,'餛':17,'阇':17,'闍':17,'渑':17,'澠':17,'谑':17,'謔':17,'隈':17,'隍':17,'鼋':17,
  '黿':17,'蛰':17,'蟄':17,'蒌':17,'蔞':17,'嵘':17,'嶸':17,'筚':17,'篳':17,'飓':17,'颶':17,'亵':17,'褻':17,'痨':17,'癆':17,
  '痫':17,'癇':17,'阑':17,'闌':17,'阒':17,'闃':17,'阕':17,'闋':17,'裢':17,'褳':17,'谡':17,'謖':17,'谥':17,'謚':17,'谧':17,
  '謐':17,'毂':17,'轂':17,'遢':17,'锗':17,'鍺':17,'遛':17,'滪':17,'澦':17,'嫔':17,'嬪':17,'缡':17,'縭':17,'觏':17,'覯':17,
  '蔫':17,'蔸':17,'蔟':17,'蔻':17,'蓿':17,'蓼':17,'辕':17,'轅':17,'暧':17,'曖':17,'蝈':17,'蟈':17,'赙':17,'賻':17,'锲':17,
  '鍥':17,'锴':17,'鍇':17,'锶':17,'鍶':17,'锷':17,'鍔':17,'锸':17,'鍤':17,'镁':17,'鎂':17,'箦':17,'簀':17,'鲑':17,'鮭':17,
  '鲔':17,'鮪':17,'鲛':17,'鮫':17,'糁':17,'糝':17,'褛':17,'褸':17,'缥':17,'縹':17,'缦':17,'縵':17,'缧':17,'縲':17,'缪':17,
  '繆':17,'缫':17,'繅':17,'耧':17,'耬':17,'璜':17,'樯':17,'檣':17,'蝼':17,'螻':17,'膘':17,'屦':17,'屨':17,'璞':17,'璟':17,
  '璠':17,'璘':17,'聱':17,'螯':17,'擀':17,'甏':17,'檠':17,'檎':17,'醛':17,'醚':17,'磲':17,'瞰':17,'嚄':17,'嚆':17,'蹉':17,
  '螨':17,'蟎':17,'螭':17,'罹':17,'魈':17,'膙':17,'獬':17,'癃':17,'嬴':17,'瞥':17,'甑':17,'燠':17,'燧':17,'濉':17,'澧':17,
  '澹':17,'澥':17,'澶':17,'濂':17,'褶':17,'禧':17,'璐':17,'螫':17,'壕':17,'觳':17,'罄':17,'鞡':17,'檄':17,'檩':17,'懋':17,
  '醢':17,'翳':17,'礅':17,'磴':17,'豳':17,'壑':17,'黻':17,'嚏':17,'嚅':17,'蹊':17,'螬':17,'螵':17,'疃':17,'螳':17,'蟑':17,
  '嚓':17,'嶷':17,'黜':17,'黝':17,'罅':17,'黏':17,'簌':17,'篾':17,'篼':17,'簋':17,'鼢':17,'黛':17,'儡':17,'鼾':17,'皤':17,
  '龠':17,'繇':17,'貔':17,'螽':17,'燮':17,'襄':17,'糜':17,'縻':17,'癍':17,'麋':17,'蹇':17,'謇':17,'襁':17,'檗':17,'擘':17,
  '孺':17,'嬷':17,'蟊':17,'鍪':17,'糨':17,'钖':17,'鍚':17,'帱':17,'幬':17,'骍':17,'騂':17,'琎':17,'璡':17,'硚':17,'礄':17,
  '䴕':17,'鴷':17,'鸺':17,'鵂':17,'鸼':17,'鵃':17,'䴔':17,'鵁':17,'隃':17,'絷':17,'縶':17,'鄑':17,'腘':17,'膕':17,'鄗':17,
  '鄌':17,'遘':17,'蔀':17,'锘':17,'鍩':17,'瘅':17,'癉':17,'䃅':17,'磾':17,'蔌':17,'蔈':17,'蓰':17,'蔊':17,'槚':17,'檟':17,
  '锺':17,'锽':17,'鍠':17,'锾':17,'鍰':17,'锿':17,'鎄':17,'镅':17,'鎇':17,'鲒':17,'鮚':17,'鲕':17,'鮞':17,'鲖':17,'鲘':17,
  '鮜':17,'鲝':17,'鮺':17,'蔃':17,'璒':17,'擐':17,'黇':17,'䗖':17,'螮':17,'幪':17,'簉':17,'濋':17,'澪':17,'澽':17,'澴':17,
  '澭':17,'澼':17,'憷':17,'憺':17,'懔':17,'髽':17,'檑':17,'檞':17,'繄':17,'磹':17,'磻':17,'瞫':17,'瞵':17,'蹐':17,'矰':17,
  '穙':17,'穜':17,'簃':17,'簏':17,'儦':17,'斶':17,'艚':17,'谿':17,'馘':17,'螱':17,'嬬':17,'嬥':17,'澫':17,'蔄':17,'璕':17,
  '駼':17,'璗':17,'謏':17,'闉':17,'濆':17,'膢':17,'襀':17,'鍭':17,'鮡':17,'鮠':17,'鮟':17,'縯':17,'嶽':17,'遙':17,'醠':17,
  '儤':17,'曓':17,'襃':17,'蓭':17,'闇':17,'隂':17,'隌':17,'顉':17,'馣':17,'擙':17,'磽':17,'蔜':17,'虨':17,'輽':17,'壒':17,
  '賹':17,'鴱':17,'騃':17,'鍽':17,'謈':17,'豰':17,'檦':17,'褾':17,'颷':17,'鞞':17,'餠':17,'鮩':17,'繃':17,'螷':17,'鞛':17,
  '檘':17,'縪':17,'擈':17,'篰':17,'餢':17,'鮬':17,'縩':17,'嬱':17,'澯':17,'篸':17,'賶':17,'懆':17,'蓸':17,'褿':17,'簎':17,
  '竲':17,'毚':17,'簅':17,'螹':17,'勶':17,'瞮':17,'擑':17,'膓':17,'韔':17,'罺':17,'檙':17,'竀':17,'儬':17,'螴':17,'蔯':17,
  '謓':17,'鍖':17,'謘':17,'遟':17,'鍉':17,'鵄':17,'隀':17,'嚋':17,'嬦':17,'盩':17,'遚':17,'斣':17,'檚':17,'歜':17,'鄐':17,
  '膗':17,'顀':17,'膞':17,'蓴':17,'擉':17,'餟':17,'嬨':17,'澬':17,'縬':17,'竁':17,'竴':17,'顇':17,'燪':17,'篵':17,'蔥':17,
  '蟌':17,'鍐':17,'鍯':17,'蔖':17,'醝':17,'艜':17,'遝':17,'澸':17,'禫':17,'餤':17,'澢':17,'盪':17,'壔':17,'嶹':17,'檤':17,
  '竳':17,'嚁':17,'篴':17,'蔋':17,'蔐':17,'蔕':17,'蹏':17,'隄':17,'褺':17,'螲':17,'霘':17,'蹎':17,'蓧':17,'濎':17,'磸':17,
  '顁':17,'儥':17,'匵':17,'斁':17,'殬':17,'陼':17,'鍴':17,'鴭':17,'嚉':17,'貖':17,'餩':17,'騀':17,'癈':17,'餥':17,'馡':17,
  '鼣':17,'癁':17,'鍑':17,'鍢':17,'鬴':17,'尶':17,'檊':17,'擖':17,'獦':17,'謌':17,'鮯':17,'骾':17,'檒':17,'澣':17,'臩':17,
  '璝':17,'瞶':17,'蔉':17,'濄':17,'簂':17,'蔮':17,'駴':17,'儫':17,'皥':17,'癋':17,'謞':17,'嚂':17,'壏':17,'歛':17,'顄':17,
  '駻':17,'翵':17,'謍':17,'鍙':17,'鍧':17,'霟':17,'懁':17,'豲':17,'穔':17,'磺':17,'簄':17,'蔛':17,'蔰':17,'鍸':17,'檅':17,
  '檓':17,'濊':17,'燬':17,'獩':17,'篲':17,'蔧':17,'繉':17,'蔒':17,'謋':17,'嚌':17,'憿':17,'擊':17,'檕':17,'檝':17,'濈':17,
  '磼':17,'禨':17,'穖':17,'簊':17,'蓻':17,'蔇':17,'賷':17,'鍓':17,'鴶':17,'瞯':17,'磵':17,'蔪':17,'鍳':17,'顅':17,'馢':17,
  '麉':17,'橿':17,'殭':17,'糡':17,'螿':17,'曒':17,'獥':17,'穚':17,'蟂':17,'鴵':17,'嚍':17,'嬧':17,'濅':17,'蓳':17,'蓵':17,
  '鍻':17,'憼':17,'擏':17,'曔':17,'顈':17,'璚':17,'懅':17,'檋':17,'鄓':17,'駶':17,'獧':17,'縳':17,'蔨':17,'懏':17,'鍕':17,
  '轁':17,'躿':17,'醘':17,'鍞':17,'鞚':17,'擓':17,'謉':17,'鍨':17,'鍷':17,'窾':17,'儣':17,'擃':17,'鞟':17,'韕':17,'孻':17,
  '顂':17,'磱':17,'燣':17,'蔂':17,'磿':17,'蟍':17,'褵':17,'澰':17,'燫':17,'縺':17,'翴':17,'鍊':17,'駺':17,'璙':17,'竂':17,
  '蟉':17,'儠':17,'鮤':17,'燯':17,'蔆':17,'霛':17,'霝':17,'懍':17,'檁':17,'澟':17,'甐':17,'疄':17,'艛':17,'癅':17,'駵':17,
  '膔':17,'蔍':17,'蓾':17,'螰':17,'鴼':17,'鮥':17,'鵅':17,'嬤':17,'蟇':17,'澷':17,'駹':17,'蓩':17,'徾':17,'曚':17,'蔝':17,
  '蔤':17,'麊':17,'嬵':17,'瞴':17,'鴾':17,'麰':17,'鍲':17,'覭':17,'鄍':17,'縸':17,'嬭':17,'憹':17,'餧':17,'嬣':17,'簐':17,
  '蹍':17,'嬲':17,'隉':17,'檂':17,'膒':17,'篺':17,'膖':17,'覫':17,'髼':17,'簈':17,'蓱':17,'噽':17,'憵':17,'擗':17,'旚':17,
  '篻':17,'翲':17,'蔢':17,'檏':17,'瞨':17,'鮨':17,'壍':17,'蔳':17,'鍼':17,'黚':17,'牆':17,'謒':17,'撽':17,'癄':17,'鍫':17,
  '穕':17,'懃':17,'懄':17,'澿':17,'螼':17,'蓲':17,'燩':17,'璖':17,'螶':17,'謜':17,'陾':17,'嬫':17,'鍒':17,'鴹':17,'鵀':17,
  '鄏':17,'鴽':17,'壖':17,'瞤':17,'蔘':17,'氉':17,'曑':17,'襂':17,'檆':17,'磰':17,'縿':17,'謆':17,'陿':17,'懎':17,'擌':17,
  '濇':17,'濏':17,'閷':17,'髿':17,'簁':17,'髾':17,'曏':17,'蔏':17,'螪':17,'鞝':17,'憴':17,'賸':17,'鍟':17,'蔎':17,'鍦':17,
  '檡':17,'澨':17,'褷':17,'橾':17,'濖':17,'盨':17,'鮛':17,'繂':17,'儩':17,'禩':17,'憽':17,'檧':17,'濍':17,'駷':17,'醙':17,
  '鄋':17,'璛':17,'遡':17,'篹':17,'檖':17,'澻':17,'繀':17,'嚃':17,'橽':17,'澾':17,'濌':17,'鞜':17,'鮙':17,'嬯':17,'燤':17,
  '糛':17,'赯':17,'謟':17,'謕':17,'鍗':17,'鬀':17,'鮧':17,'鴺':17,'顃':17,'蓨':17,'蓪':17,'鮦':17,'鍮':17,'黈':17,'鍎':17,
  '蓷':17,'蹆':17,'駾':17,'骽':17,'懀':17,'篿':17,'蟃':17,'燰':17,'罻':17,'蓶':17,'褽':17,'鍏':17,'鍡':17,'隇':17,'蟁':17,
  '豱':17,'闅':17,'轀':17,'鼤':17,'璑':17,'甒':17,'霚':17,'鴮':17,'鼿':17,'嚊':17,'壐':17,'擕':17,'燨':17,'瞦':17,'磶':17,
  '縰':17,'謑':17,'豯':17,'豀':17,'貕':17,'鄎':17,'鍜':17,'憸':17,'褼':17,'豏':17,'鍌':17,'韱':17,'鄕':17,'鮝':17,'澩':17,
  '穘':17,'皢':17,'燲':17,'曐':17,'觲':17,'璓':17,'鎀':17,'壎':17,'檈':17,'縼':17,'蔙':17,'鍹':17,'駽':17,'瞲':17,'嚈':17,
  '闄':17,'餚':17,'燢':17,'嬮':17,'曕':17,'篶':17,'蔅':17,'隁':17,'鴳':17,'寱':17,'寲':17,'曎':17,'檍':17,'檥':17,'歝':17,
  '澺':17,'燡':17,'燱':17,'穓':17,'蓺':17,'褹':17,'顊':17,'擛':17,'曗':17,'澲':17,'皣':17,'瞱':17,'鍱':17,'鎁':17,'餣':17,
  '噾':17,'嶾':17,'檃':17,'蔩':17,'螾':17,'陻':17,'霠':17,'膡':17,'覮':17,'霙':17,'醟':17,'嬩':17,'澞':17,'篽':17,'蓹':17,
  '螸':17,'鍝':17,'嬳':17,'醞':17,'儧':17,'耫':17,'璔':17,'磳':17,'醡':17,'蔁':17,'餦':17,'燳':17,'鍣':17,'蟅':17,'澵':17,
  '轃':17,'儨':17,'劕':17,'璏':17,'穉':17,'膣':17,'鴲':17,'蔠':17,'蓫':17,'鮢':17,'鴸':17,'檛':17,'糚':17,'斀':17,'斵':17,
  '穛':17,'鍿':17,'頿':17,'噿':17,'檇':17,'檌':17,'丰':18,'豐':18,'双':18,'雙':18,'旧':18,'舊':18,'归':18,'歸':18,'丛':18,
  '叢':18,'冬':18,'鼕':18,'礼':18,'禮':18,'檯':18,'蟲':18,'杂':18,'雜':18,'闯':18,'闖':18,'拟':18,'擬':18,'芜':18,'蕪':18,
  '医':18,'醫':18,'环':18,'環':18,'拧':18,'擰':18,'柜':18,'櫃':18,'鬆':18,'转':18,'轉':18,'狞':18,'獰':18,'泞':18,'濘':18,
  '织':18,'織':18,'挤':18,'擠':18,'荡':18,'蕩':18,'柠':18,'檸':18,'适':18,'適':18,'鞦':18,'济':18,'濟':18,'陨':18,'隕':18,
  '垒':18,'壘':18,'绕':18,'繞':18,'聂':18,'聶':18,'获':18,'獲':18,'础':18,'礎':18,'毙':18,'斃':18,'涛':18,'濤':18,'窍':18,
  '竅':18,'绣':18,'职':18,'職':18,'萧':18,'蕭':18,'秽':18,'穢':18,'躯':18,'軀':18,'断':18,'斷':18,'婶':18,'嬸':18,'骑':18,
  '騎':18,'搁':18,'擱':18,'翘':18,'翹':18,'鹃':18,'鵑':18,'锁':18,'鎖':18,'鹅':18,'鵝':18,'储':18,'儲':18,'湿':18,'濕':18,
  '窜':18,'竄':18,'隔':18,'隙':18,'隘':18,'鹉':18,'鵡':18,'濛':18,'懞':18,'鄙':18,'简':18,'簡':18,'腻':18,'膩':18,'雏':18,
  '雛':18,'酱':18,'醬':18,'粮':18,'糧':18,'滥':18,'濫':18,'滨':18,'濱':18,'谨':18,'謹':18,'谬':18,'謬':18,'赘':18,'贅':18,
  '蔽':18,'槛':18,'檻':18,'遭':18,'蝉':18,'蟬':18,'箫':18,'簫':18,'遮':18,'蕉':18,'蕊':18,'题':18,'題':18,'镇':18,'鎮':18,
  '镐':18,'鎬':18,'镑':18,'鎊':18,'鲤':18,'鯉':18,'颜':18,'顏':18,'鲨':18,'鯊':18,'额':18,'額':18,'缭':18,'繚':18,'膨':18,
  '戴':18,'擦':18,'檬':18,'曙':18,'魏':18,'簧':18,'爵':18,'朦':18,'懦':18,'翼':18,'鞭':18,'覆':18,'瞻':18,'蹦':18,'翻':18,
  '璧':18,'戳':18,'圹':18,'壙':18,'饧':18,'餳':18,'讴':18,'謳':18,'芸':18,'蕓':18,'欤':18,'歟':18,'虮':18,'蟣':18,'疠':18,
  '癘':18,'荞':18,'蕎':18,'荨':18,'蕁':18,'荬':18,'蕒':18,'钨':18,'鎢':18,'闿':18,'闓':18,'浕':18,'濜':18,'恹':18,'懨':18,
  '怼':18,'懟':18,'珰':18,'璫':18,'贽':18,'贄':18,'莸':18,'蕕':18,'烬':18,'燼':18,'焘':18,'燾':18,'啮':18,'嚙':18,'铠':18,
  '鎧':18,'秾':18,'穠':18,'阋':18,'鬩':18,'隗':18,'骐':18,'騏':18,'骒':18,'騍':18,'骓':18,'騅':18,'鹁':18,'鵓':18,'睑':18,
  '瞼':18,'蛲':18,'蟯':18,'鹄':18,'鵠':18,'鹆':18,'鵒':18,'觞':18,'觴':18,'馇':18,'餷':18,'鹈':18,'鵜':18,'谟':18,'謨':18,
  '裥':18,'襇':18,'耢':18,'耮':18,'遨':18,'鄢':18,'摈':18,'擯':18,'鄞':18,'蓥':18,'鎣':18,'韪':18,'韙':18,'跸':18,'蹕':18,
  '阖':18,'闔':18,'阗':18,'闐':18,'阙':18,'闕':18,'谩':18,'謾':18,'谪':18,'謫':18,'蕖':18,'槟':18,'檳':18,'殡':18,'殯':18,
  '箪':18,'簞':18,'潍':18,'濰':18,'聩':18,'聵':18,'觐':18,'覲':18,'蕙':18,'蕈':18,'蕨':18,'蕤':18,'蕞':18,'蕃':18,'赜':18,
  '賾':18,'辘':18,'轆':18,'颙':18,'顒':18,'颚':18,'顎':18,'噜':18,'嚕':18,'颛':18,'顓':18,'镉':18,'鎘':18,'镌':18,'鎸':18,
  '镍':18,'鎳':18,'镏':18,'鎦':18,'镒':18,'鎰':18,'镓':18,'鎵':18,'篑':18,'簣':18,'鲠':18,'鯁':18,'鲧':18,'鯀':18,'鲩':18,
  '鯇':18,'缮':18,'繕':18,'缯':18,'繒':18,'穑':18,'穡':18,'魉':18,'魎':18,'膳':18,'膦':18,'獴':18,'璨':18,'璩':18,'璪':18,
  '擤':18,'擢':18,'鞬':18,'蹒':18,'蹣':18,'蟥':18,'罽':18,'罾':18,'髁':18,'髀':18,'魍':18,'貘':18,'懑':18,'懣':18,'濡':18,
  '濮':18,'濞':18,'濠':18,'濯':18,'鬈':18,'鬃':18,'瞽':18,'鞨':18,'鞫':18,'鞧':18,'鞣':18,'醪':18,'蹙':18,'礓':18,'燹':18,
  '餮':18,'瞿':18,'曛':18,'曜':18,'蹚':18,'蟛':18,'蟪':18,'蟠':18,'蟮':18,'黠':18,'黟':18,'馥':18,'簟':18,'簪':18,'鼬':18,
  '艟':18,'癔':18,'癜':18,'癖':18,'鎏':18,'彝':18,'飏':18,'颺':18,'狝':18,'獮':18,'荛':18,'蕘':18,'袯':18,'襏':18,'梼':18,
  '檮':18,'龁':18,'齕':18,'䝙':18,'貙':18,'蒇':18,'蕆':18,'鄚':18,'蒉':18,'蕢':18,'鹀':18,'鵐':18,'溁':18,'爃':18,'鄠':18,
  '飔':18,'颸':18,'鄘':18,'鄜':18,'鄣':18,'阘':18,'闒':18,'谫':18,'謭':18,'瑷':18,'璦':18,'锼':18,'鎪':18,'镃':18,'鎡':18,
  '蕰':18,'镈':18,'鎛':18,'镎':18,'鎿':18,'镕':18,'鎔':18,'鲪':18,'鮶':18,'鲬':18,'鯒':18,'璥':18,'璲':18,'蕗':18,'濩':18,
  '璱':18,'璬':18,'璮':18,'櫆':18,'醨':18,'蟏':18,'蟰':18,'穟':18,'魋':18,'獯':18,'甓':18,'釐':18,'鞮':18,'檫':18,'礌':18,
  '蹢':18,'蹜':18,'蟫':18,'嚚':18,'簠':18,'簝':18,'簰':18,'鼫':18,'鼩':18,'皦':18,'癗':18,'翷':18,'隑':18,'礐':18,'騑':18,
  '騊':18,'騄':18,'鵏':18,'鵟':18,'闑':18,'鎝':18,'鎓':18,'鮸':18,'繡':18,'鞤':18,'贁':18,'蕔':18,'盫':18,'鼥':18,'翺':18,
  '謸':18,'謷':18,'辬':18,'蟦':18,'懝':18,'濭':18,'皧':18,'瞹':18,'餲':18,'馤':18,'獱':18,'嚗':18,'簙':18,'爂':18,'謤':18,
  '蟞':18,'襒':18,'癛':18,'奰':18,'鎞':18,'鵖':18,'遪':18,'謲':18,'繟':18,'醦':18,'繛':18,'轈':18,'鄛':18,'鼂':18,'鎗':18,
  '儭':18,'贂':18,'麎':18,'懘':18,'糦':18,'謻':18,'遫':18,'罿':18,'蹖':18,'懤':18,'燽':18,'鯈':18,'幮':18,'蕏':18,'膪':18,
  '鎚':18,'櫄':18,'鎈':18,'濨':18,'鼀':18,'鎉':18,'濢':18,'膬':18,'襊':18,'繱':18,'謥':18,'遳':18,'懛':18,'簤':18,'蹛':18,
  '甔':18,'癚':18,'襌':18,'駳':18,'礑':18,'簜':18,'擣':18,'簦':18,'豴':18,'遰':18,'鬄':18,'蕫':18,'蕇':18,'鼦':18,'嬻':18,
  '簬':18,'濧':18,'遯':18,'鮵':18,'歞':18,'蕚':18,'鵞':18,'鞥':18,'檽':18,'蕟':18,'旛':18,'繙':18,'膰':18,'羳':18,'襎':18,
  '鄤':18,'濷':18,'蕜':18,'羵':18,'蕡':18,'餴':18,'鼖':18,'蕧':18,'襆':18,'鯆':18,'麱':18,'鎠':18,'檺':18,'鯌':18,'韚':18,
  '濲':18,'盬':18,'懖':18,'癐':18,'璭':18,'癏':18,'謴':18,'遦':18,'雚':18,'巂':18,'禬':18,'膭':18,'彍':18,'燺':18,'爀':18,
  '礉':18,'雗':18,'繣':18,'舙':18,'蕐':18,'黊':18,'餱':18,'竵':18,'韹':18,'嚝':18,'鵍':18,'鎤':18,'餭':18,'嚛':18,'擭':18,
  '膴':18,'謼':18,'餬':18,'嚖':18,'璯':18,'瞺':18,'繢':18,'繐':18,'隓':18,'餯':18,'轋':18,'顐':18,'餫':18,'檴':18,'礊':18,
  '雘':18,'擮':18,'檱':18,'檵':18,'櫅':18,'礏':18,'耭':18,'蕀':18,'襋':18,'蹟':18,'雞':18,'鵋':18,'齌':18,'鵊':18,'礆':18,
  '繝':18,'蕑':18,'襉':18,'鎫':18,'餰':18,'疅':18,'繈':18,'謽':18,'簥':18,'膲':18,'蟜':18,'蟭':18,'轇':18,'幯':18,'礍':18,
  '謯':18,'濪':18,'鵛':18,'檾':18,'屩':18,'蕝':18,'蟨':18,'蟩':18,'擧':18,'繘':18,'貗':18,'鵙':18,'濬':18,'鵕':18,'鵔':18,
  '鵘':18,'麏':18,'鎎':18,'顑':18,'蹞':18,'黋':18,'鎯':18,'騉':18,'騋':18,'簩':18,'蟧':18,'懢':18,'爁':18,'蕌':18,'儮':18,
  '嚟':18,'巁':18,'蔾':18,'謧':18,'謰':18,'蹥':18,'鎌':18,'屪':18,'廫':18,'豂':18,'膫':18,'賿':18,'蟟':18,'蹘':18,'鄝':18,
  '繗':18,'麐':18,'謱':18,'軁':18,'遱':18,'嬼':18,'璢':18,'霤':18,'麍':18,'儱':18,'蕯':18,'蹗':18,'嚜':18,'霡':18,'霢':18,
  '蠎':18,'懜':18,'氋':18,'蕄':18,'霥':18,'鯍':18,'擟':18,'檷':18,'櫁':18,'濔':18,'濗':18,'簚':18,'檰':18,'蟱':18,'鞪':18,
  '幭':18,'簢':18,'懡':18,'蟔':18,'謩':18,'鮾':18,'嬺':18,'獳':18,'鎒':18,'癑':18,'禯':18,'餪':18,'懧':18,'糥':18,'蕅':18,
  '鎜':18,'蟚':18,'鬅':18,'翸':18,'礔':18,'礕':18,'騈':18,'骿':18,'醥':18,'櫇':18,'懠':18,'櫀':18,'濝':18,'魌':18,'檶':18,
  '鬵':18,'蹡':18,'繑':18,'鄥':18,'鄡':18,'鞩':18,'髜':18,'鮼':18,'謦':18,'蟗':18,'鯄':18,'繎':18,'蟝':18,'覰':18,'鼁':18,
  '襓':18,'韖':18,'擩':18,'曘':18,'燸':18,'蕠':18,'繠':18,'蕋':18,'顋':18,'糣':18,'糤':18,'繖':18,'鎟':18,'羴':18,'鯅':18,
  '鮻':18,'鯋':18,'簛':18,'燿':18,'鮹':18,'謪':18,'蕂':18,'鼪':18,'韘':18,'騇':18,'簭':18,'鵢':18,'癙':18,'蕣':18,'鎙':18,
  '蕬':18,'蟖':18,'鎍':18,'遬':18,'鯂':18,'禭':18,'簨':18,'鎨':18,'擡':18,'鎕':18,'蟘':18,'儯':18,'膯':18,'蕛':18,'嚔':18,
  '鮷':18,'憻':18,'襑':18,'璳':18,'鎭':18,'靝':18,'鎥':18,'膧':18,'鼨':18,'鵌':18,'鵚':18,'檲':18,'鵎':18,'鼧':18,'贃':18,
  '儰':18,'癓':18,'矀':18,'蔿':18,'贀':18,'轊':18,'颹':18,'隖':18,'鯃':18,'麌':18,'濦':18,'繥':18,'蕮':18,'虩':18,'蟢':18,
  '謵':18,'蹝':18,'鵗':18,'甕':18,'懗':18,'鎋':18,'濣':18,'蹮':18,'麲':18,'蟓':18,'襐':18,'膮':18,'鞢':18,'濴':18,'皨':18,
  '繏':18,'蕦':18,'燻':18,'蟳':18,'韗':18,'蕥':18,'顔':18,'艞':18,'鎐':18,'懕':18,'檿':18,'隒':18,'騐':18,'檹':18,'礒':18,
  '擨':18,'擪':18,'擫':18,'瞸':18,'鎑':18,'懚':18,'檭':18,'檼':18,'濥':18,'濙':18,'濚':18,'韺':18,'癕':18,'雝':18,'嚘':18,
  '懙':18,'癒':18,'礇':18,'蕍':18,'謣':18,'醧':18,'魊':18,'鮽':18,'鎱':18,'霣':18,'襍':18,'蹔':18,'礋':18,'謮':18,'醩':18,
  '皽':18,'覱':18,'遧':18,'櫂':18,'瞾':18,'嚞':18,'謺':18,'鮿':18,'懥':18,'膱':18,'蟙':18,'蹠':18,'騆':18,'蟤':18,'襈':18,
  '鄟':18,'礈':18,'謶':18,'頾':18,'豵':18,'蹤':18,'騌':18,'繤':18,'蟕':18,'繜':18,'罇':18,'繓':18,'讥':19,'譏':19,'邓':19,
  '鄧':19,'劝':19,'勸':19,'辽':19,'遼':19,'扩':19,'擴':19,'迁':19,'遷':19,'嚮':19,'关':19,'關':19,'坏':19,'壞':19,'扰':19,
  '擾':19,'丽':19,'麗':19,'歼':19,'殱':19,'旷':19,'曠':19,'邻':19,'鄰':19,'繋':19,'庐':19,'廬':19,'瀋':19,'证':19,'證':19,
  '识':19,'識':19,'迟':19,'遲':19,'际':19,'際':19,'垄':19,'壟':19,'咙':19,'嚨':19,'庞':19,'龐':19,'郑':19,'鄭':19,'泻':19,
  '瀉':19,'宠':19,'寵':19,'帘':19,'簾':19,'绎':19,'繹':19,'荐':19,'薦':19,'茧':19,'繭':19,'鬍':19,'蚁':19,'蟻':19,'选':19,
  '選':19,'胆':19,'膽':19,'薑':19,'类':19,'類':19,'烁':19,'爍':19,'浏':19,'瀏':19,'袄':19,'襖':19,'绘':19,'繪':19,'穫':19,
  '轿':19,'轎':19,'脓':19,'膿':19,'离':19,'離':19,'难':19,'難':19,'掷':19,'擲':19,'铲':19,'鏟':19,'脸':19,'臉':19,'猎':19,
  '獵':19,'旋':19,'鏇':19,'兽':19,'獸':19,'祷':19,'禱':19,'绳':19,'繩':19,'畴':19,'疇':19,'遗':19,'遺':19,'链':19,'鏈':19,
  '惩':19,'懲':19,'溅':19,'濺':19,'骗':19,'騙':19,'摆':19,'擺':19,'鹊':19,'鵲':19,'矇':19,'碍':19,'礙':19,'雾':19,'霧':19,
  '跷':19,'蹺':19,'辞':19,'辭':19,'签':19,'簽':19,'鹏':19,'鵬':19,'馏':19,'餾':19,'滤':19,'濾':19,'障':19,'愿':19,'願':19,
  '蝇':19,'蠅':19,'稳':19,'穩':19,'谭':19,'譚':19,'谱':19,'譜':19,'撵':19,'攆':19,'瘪':19,'癟':19,'遵':19,'蕾':19,'薛':19,
  '薇':19,'薪':19,'薄':19,'颠':19,'顛':19,'辙':19,'轍':19,'赠':19,'贈':19,'镜':19,'鏡':19,'赞':19,'贊':19,'鲸':19,'鯨':19,
  '缰':19,'繮':19,'缴':19,'繳':19,'臊':19,'臀':19,'臂':19,'瀑':19,'襟':19,'攀':19,'曝':19,'蹲':19,'蹭':19,'蹬':19,'巅':19,
  '簸':19,'簿':19,'蟹':19,'靡':19,'瓣':19,'羹':19,'爆':19,'疆':19,'芗':19,'薌':19,'犷':19,'獷':19,'玙':19,'璵':19,'呖':19,
  '嚦':19,'饩':19,'餼':19,'垆':19,'壚':19,'泺':19,'濼':19,'荟':19,'薈':19,'栉':19,'櫛':19,'栎':19,'櫟':19,'虿':19,'蠆':19,
  '祢':19,'禰':19,'鸫':19,'鶇':19,'脍':19,'膾':19,'玺':19,'璽':19,'郸':19,'鄲':19,'蛏':19,'蟶':19,'铩':19,'鎩':19,'渎':19,
  '瀆':19,'裆':19,'襠':19,'椟':19,'櫝':19,'铿':19,'鏗':19,'犊':19,'犢':19,'牍':19,'牘':19,'馊':19,'餿':19,'骛':19,'騖':19,
  '韫':19,'韞':19,'摅':19,'攄':19,'蓟':19,'薊':19,'榈':19,'櫚':19,'鹌':19,'鵪':19,'鹐':19,'鵮':19,'飕':19,'颼':19,'鹑':19,
  '鶉':19,'滢':19,'瀅':19,'韬':19,'韜':19,'蔷':19,'薔':19,'锵':19,'鏘':19,'镂':19,'鏤':19,'鄱':19,'鄯':19,'鲞':19,'鯗':19,
  '谮':19,'譖':19,'谯':19,'譙':19,'谲':19,'譎':19,'撷':19,'擷':19,'撸':19,'擼':19,'蕺':19,'觑':19,'覷':19,'觯':19,'觶':19,
  '遴':19,'擞':19,'擻':19,'蕻':19,'薤':19,'薨':19,'薏':19,'薜':19,'薅':19,'橹':19,'櫓':19,'橼':19,'櫞':19,'赝':19,'贋':19,
  '錾':19,'鏨':19,'辚':19,'轔':19,'蟒':19,'镖':19,'鏢':19,'镗':19,'鏜':19,'镘':19,'鏝':19,'镚':19,'鏰':19,'镛':19,'鏞':19,
  '镝':19,'鏑':19,'镞':19,'鏃':19,'镠':19,'鏐':19,'氇':19,'氌':19,'鲮':19,'鯪':19,'鲱':19,'鲲':19,'鯤':19,'鲳':19,'鯧':19,
  '鲴':19,'鯝':19,'鲵':19,'鯢':19,'鲷':19,'鯛':19,'鲻':19,'鯔':19,'赟':19,'贇':19,'颡':19,'顙':19,'缲':19,'繰':19,'缳':19,
  '繯':19,'镪':19,'鏹':19,'臌':19,'膻':19,'臆':19,'臃':19,'膺':19,'鏊':19,'髂':19,'蹩':19,'鬏':19,'鞲':19,'鞴':19,'麓':19,
  '醮':19,'醯':19,'霪':19,'霨':19,'黼':19,'嚯':19,'蹰':19,'蹶':19,'蹽':19,'蹼':19,'蹴':19,'蹾':19,'蟾':19,'蠊':19,'黢':19,
  '籀':19,'齁':19,'麒':19,'鏖':19,'羸':19,'襞':19,'璺':19,'坜':19,'壢':19,'荙':19,'薘':19,'舣':19,'艤':19,'莶':19,'薟':19,
  '厣':19,'厴':19,'酦':19,'醱':19,'龂':19,'齗':19,'翙':19,'翽':19,'筜':19,'簹':19,'馉':19,'餶':19,'裣':19,'襝':19,'骙':19,
  '騤':19,'䴖':19,'鶄':19,'蓣':19,'蕷':19,'鹍':19,'鵾':19,'鹎':19,'鵯':19,'馌':19,'饁':19,'鹒':19,'鶊':19,'飗':19,'飀':19,
  '鄫':19,'麹':19,'麴':19,'薁':19,'镆':19,'鏌':19,'澛':19,'瀂':19,'遹':19,'薢':19,'蕹':19,'鲭':19,'鯖':19,'鲯':19,'鯕':19,
  '鲰':19,'鯫':19,'鲺':19,'鯴':19,'鲹':19,'鯵':19,'擿':19,'襚':19,'瓀':19,'爇':19,'鞳':19,'礞':19,'髃':19,'馧':19,'旞':19,
  '瀔':19,'瀍':19,'瀌':19,'襜':19,'嚭':19,'鬷':19,'醭':19,'蹯':19,'蠋':19,'翾':19,'儳':19,'儴':19,'鼗':19,'麑':19,'麖':19,
  '蠃':19,'嬿':19,'鄩':19,'櫍':19,'齘':19,'顗':19,'騞':19,'騠':19,'譓':19,'鏏':19,'繶':19,'鯻':19,'犤':19,'寳':19,'犦':19,
  '覇':19,'爊':19,'隞':19,'薆':19,'懪':19,'繴':19,'糪':19,'譒':19,'蹳':19,'餺':19,'贆':19,'璸':19,'矉':19,'霦':19,'鵧':19,
  '鄪':19,'鄨':19,'鏎':19,'轐':19,'攃':19,'薒':19,'襙':19,'鏪':19,'劖':19,'繵':19,'蟺':19,'譂':19,'鏛':19,'闛':19,'謿':19,
  '瀓':19,'穪':19,'嚫':19,'曟':19,'癡':19,'趩':19,'臅':19,'鬌':19,'鯙':19,'歠':19,'薋':19,'蠀':19,'蹵':19,'櫕':19,'濽':19,
  '蟽':19,'鏙':19,'騘':19,'鏓':19,'鏦':19,'嚪':19,'聸':19,'贉':19,'醰':19,'艡':19,'蟷':19,'隝':19,'覴':19,'鯟':19,'顚':19,
  '鵰':19,'殰':19,'簵':19,'襡':19,'濻':19,'譈':19,'襗':19,'軃':19,'鵽':19,'礘':19,'譌':19,'遻':19,'薠':19,'颿':19,'轓':19,
  '瓂':19,'櫠':19,'鯡':19,'騛':19,'膹':19,'轒':19,'嚩':19,'懯':19,'鵩':19,'簳':19,'櫜':19,'餻':19,'騔':19,'鏠':19,'觵':19,
  '龏':19,'簼':19,'韝':19,'薣':19,'騧':19,'旝':19,'鏆':19,'櫎':19,'襘':19,'鄬':19,'餽':19,'薧':19,'薃':19,'覈':19,'譀':19,
  '豃':19,'譁':19,'糫':19,'爌':19,'皩':19,'趪':19,'騜':19,'櫘':19,'瀈':19,'薉':19,'瓁':19,'矆':19,'矱':19,'霩':19,'櫭':19,
  '璾':19,'癠':19,'穧':19,'繫':19,'艥':19,'蟿':19,'韲':19,'鯚':19,'擶':19,'瀐':19,'礛':19,'覵':19,'鏩':19,'騝':19,'鬋':19,
  '鵳':19,'顜':19,'譑':19,'趭':19,'璶':19,'嶻':19,'擳':19,'瀄':19,'繲':19,'蟼':19,'鶁':19,'匶':19,'鯦':19,'麔':19,'屫':19,
  '臄':19,'蹷':19,'蹻':19,'鶌':19,'簴':19,'蹫':19,'鵴':19,'鶋':19,'羂':19,'臇':19,'麕':19,'礚':19,'颽':19,'簻':19,'鵼':19,
  '鏂':19,'顝':19,'糩':19,'闚':19,'懬':19,'懭':19,'擸':19,'爉':19,'臈':19,'斄':19,'鯠':19,'麳':19,'鶆':19,'轑':19,'軂':19,
  '嬾':19,'擥':19,'璼':19,'譋':19,'櫑':19,'攂':19,'櫐':19,'薐':19,'擽':19,'曞':19,'櫔':19,'濿':19,'爄':19,'犡':19,'蟸':19,
  '蠇':19,'鏫':19,'鯬':19,'鵹':19,'羷':19,'臁':19,'薕':19,'犣':19,'蕶':19,'蹸':19,'懰':19,'雡':19,'壠':19,'巃':19,'徿':19,
  '鏧':19,'嚧':19,'璷':19,'簶':19,'艣':19,'鏀':19,'鏕':19,'鯥':19,'鵦':19,'鵱':19,'薍':19,'鯩':19,'覶':19,'鏍':19,'镙':19,
  '擵':19,'鏋':19,'鄮':19,'黣':19,'鯭':19,'櫋':19,'矈':19,'矊':19,'懱':19,'櫗':19,'瀎':19,'薎':19,'爅':19,'譕':19,'夒':19,
  '獶':19,'繷':19,'譊':19,'鯘':19,'蹨':19,'矃':19,'孼':19,'蕽':19,'襛':19,'穤':19,'櫙':19,'瀊':19,'鞶':19,'礟':19,'韼':19,
  '嚬':19,'礗':19,'穦':19,'騗':19,'犥':19,'闝':19,'罊':19,'鏚':19,'闙':19,'鵸':19,'鶀':19,'鶈':19,'櫏':19,'騚':19,'艢':19,
  '趫':19,'趬':19,'鏒':19,'鯜':19,'寴':19,'蠄':19,'鵭':19,'竆':19,'騡':19,'勷':19,'遶':19,'騥':19,'礝':19,'壡':19,'櫒':19,
  '簺':19,'颾':19,'羶':19,'瀒':19,'繬':19,'譅':19,'繺':19,'鵿':19,'蠂':19,'譇':19,'鼭':19,'璹':19,'鏉':19,'薓':19,'儵':19,
  '薥':19,'鏣':19,'鵨':19,'鬊':19,'瀃':19,'蕼':19,'騦':19,'鏁':19,'櫢':19,'繸':19,'膸':19,'薞':19,'蹹':19,'薚':19,'隚':19,
  '餹':19,'鞱':19,'饀':19,'邆':19,'薙':19,'壜':19,'擹':19,'舚':19,'襢':19,'貚':19,'鵵':19,'穨':19,'蹪':19,'臋':19,'鏄':19,
  '鼃':19,'壝':19,'舋':19,'齀':19,'薂':19,'譆':19,'隟':19,'霫':19,'罋':19,'蕸':19,'鏬':19,'騢':19,'瀇':19,'幰':19,'馦':19,
  '膷':19,'蠁':19,'爕':19,'蠍':19,'蠏':19,'鞵':19,'顖':19,'嬹':19,'鏅':19,'鏥':19,'璿':19,'蕿':19,'蠉':19,'镟':19,'譃':19,
  '鄦':19,'矄':19,'鵶':19,'齖':19,'矅':19,'颻':19,'騕':19,'嚥':19,'壛':19,'簷':19,'艶':19,'懩':19,'攁':19,'瀁':19,'毉':19,
  '豷':19,'鏔':19,'霬':19,'鯣':19,'鶂':19,'鶃':19,'鵺':19,'甖':19,'懮':19,'櫌':19,'瀀':19,'斔':19,'礜':19,'穥':19,'騟':19,
  '薗':19,'鵷':19,'薀':19,'韻':19,'攅':19,'蠈':19,'蠌':19,'譄':19,'譗':19,'旜':19,'薝':19,'轏':19,'鵫':19,'辴':19,'懫':19,
  '軄':19,'鯯':19,'蹱':19,'鯞':19,'櫡':19,'櫫':19,'鼄':19,'膼':19,'譔':19,'鵻':19,'鶅':19,'齍':19,'騣':19,'鬉':19,'鯮':19,
  '黀':19,'璻':19,'譐':19,'议':20,'議':20,'出':20,'齣':20,'迈':20,'邁':20,'糰':20,'严':20,'嚴':20,'还':20,'還':20,'沥':20,
  '瀝':20,'怀':20,'懷':20,'译':20,'譯':20,'拢':20,'攏':20,'矾':20,'礬':20,'矿':20,'礦':20,'罗':20,'羅':20,'炉':20,'爐':20,
  '宝':20,'寶':20,'鹹':20,'面':20,'麵':20,'响':20,'響':20,'鐘':20,'胧':20,'朧':20,'觉':20,'覺':20,'砾':20,'礫':20,'党':20,
  '黨':20,'铁':20,'鐡':20,'牺':20,'犧':20,'借':20,'藉':20,'舰':20,'艦':20,'脐':20,'臍':20,'症':20,'癥':20,'竞':20,'競':20,
  '继':20,'繼':20,'萨':20,'薩':20,'悬':20,'懸':20,'痒':20,'癢':20,'阐':20,'闡':20,'琼':20,'瓊':20,'释':20,'釋':20,'骚':20,
  '騷':20,'蓝':20,'藍':20,'献':20,'獻':20,'龄':20,'齡':20,'筹':20,'籌':20,'腾':20,'騰':20,'触':20,'觸':20,'馍':20,'饃':20,
  '缤':20,'繽':20,'馒':20,'饅':20,'潇':20,'瀟':20,'飘':20,'飄':20,'鲫':20,'鯽':20,'薯':20,'篮':20,'籃':20,'邀':20,'濒':20,
  '瀕':20,'懒':20,'懶':20,'避':20,'藏':20,'藐':20,'赡':20,'贍':20,'鳄':20,'鰐':20,'辫':20,'辮':20,'赢':20,'贏':20,'孽':20,
  '警':20,'壤':20,'馨':20,'耀':20,'躁':20,'蠕':20,'嚷':20,'籍':20,'糯':20,'譬':20,'露':20,'苧':20,'邺':20,'鄴':20,'疖':20,
  '癤':20,'枥':20,'櫪':20,'岿':20,'巋':20,'泷':20,'瀧':20,'泸':20,'瀘':20,'荠':20,'薺':20,'荩':20,'藎':20,'栊':20,'櫳':20,
  '栌':20,'櫨':20,'砺':20,'礪':20,'趸':20,'躉':20,'铙':20,'鐃':20,'铧':20,'鏵':20,'蛴':20,'蠐':20,'锏':20,'鐧':20,'喾':20,
  '嚳':20,'骘':20,'騭':20,'鹋':20,'鶓':20,'龃':20,'齟':20,'龅':20,'齙':20,'跶':20,'躂':20,'馐':20,'饈':20,'骞':20,'騫':20,
  '窦':20,'竇':20,'骝':20,'騮':20,'骟':20,'騸':20,'鹕':20,'鶘':20,'槠':20,'櫧':20,'鹗':20,'鶚':20,'嘤':20,'嚶':20,'罴':20,
  '羆':20,'罂':20,'罌':20,'膑':20,'臏':20,'馑':20,'饉':20,'阚':20,'闞':20,'鹛':20,'鶥':20,'鹜':20,'鶩':20,'踬':20,'礩':20,
  '蝾':20,'蠑':20,'褴':20,'襤':20,'谵':20,'譫':20,'颟':20,'顢':20,'遽':20,'獭':20,'獺':20,'邂':20,'濑':20,'瀨':20,'缱':20,
  '繾':20,'薹':20,'薷':20,'薰':20,'藁':20,'镡':20,'鐔':20,'镢':20,'鐝':20,'镣':20,'鐐':20,'镦':20,'鐓':20,'镫':20,'鐙':20,
  '鲽':20,'鰈':20,'鳀':20,'鯷':20,'鳃':20,'鰓':20,'鳅':20,'鰍':20,'鳇':20,'鰉':20,'鳊':20,'鯿':20,'邃':20,'躇':20,'懵':20,
  '攉':20,'蠖':20,'蠓':20,'艨':20,'瀚':20,'瀣':20,'瀛':20,'襦':20,'醴':20,'霰':20,'矍':20,'曦':20,'躅':20,'巉':20,'黥':20,
  '黧':20,'纂':20,'鼯':20,'孀':20,'薴':20,'郐':20,'鄶':20,'驺':20,'騶':20,'昽':20,'曨':20,'聍':20,'聹':20,'铴':20,'鐋':20,
  '铹':20,'鐒':20,'锎':20,'鐦':20,'敩':20,'斆':20,'榇':20,'櫬':20,'龆':20,'齠':20,'䴗':20,'鶪':20,'鹖':20,'鶡':20,'镄':20,
  '鐨':20,'鹙':20,'鶖':20,'鲗':20,'鰂':20,'潆':20,'瀠':20,'薳':20,'豮':20,'豶':20,'亸':20,'嚲':20,'薿':20,'薸':20,'镤':20,
  '鏷':20,'镨':20,'鐠':20,'䲠':20,'鰆':20,'鲾':20,'鰏':20,'鳁':20,'鰛':20,'鳂':20,'鰃':20,'鳈':20,'鰁':20,'臑':20,'鬒':20,
  '醵':20,'巇':20,'犨':20,'爔':20,'孅':20,'瓅':20,'鄳':20,'隤':20,'醲':20,'騵':20,'騱':20,'鶠':20,'譞':20,'鐄':20,'鐇':20,
  '鐏':20,'鏻':20,'鐍':20,'鰊':20,'繻':20,'纁':20,'髈':20,'矲':20,'韛':20,'韽':20,'鶕':20,'譪':20,'藊':20,'鯾':20,'疈':20,
  '髉':20,'髆':20,'穮':20,'襣':20,'躃':20,'躄':20,'鞸':20,'韠':20,'饆':20,'纀':20,'礤':20,'鄵':20,'騲':20,'齜':20,'嚵':20,
  '鏿':20,'騬':20,'薼':20,'鶒':20,'齝':20,'薵':20,'鶨':20,'鶞':20,'髊':20,'顣':20,'臎':20,'藂':20,'齚':20,'霴':20,'霮':20,
  '譡':20,'翿':20,'隥':20,'霯':20,'籊':20,'藋':20,'瓄':20,'皾':20,'騳':20,'鬪':20,'瀩':20,'薱':20,'鐜':20,'櫮':20,'薾':20,
  '藅':20,'瀪':20,'襥':20,'鰒':20,'鳆':20,'鶝':20,'魐':20,'轕':20,'鄷':20,'穬':20,'鐀':20,'騩':20,'瀥':20,'籇':20,'藃':20,
  '蠔':20,'攌':20,'蘤':20,'譮':20,'鯸':20,'櫰':20,'瀤':20,'轘':20,'鯶':20,'鰀':20,'瀫':20,'鰗':20,'鶦':20,'儶':20,'譭':20,
  '鏸':20,'闠':20,'曤':20,'瀖':20,'耯':20,'臒':20,'艧':20,'聻':20,'譤':20,'轚':20,'鏶':20,'鐖':20,'麚':20,'藆':20,'蠒':20,
  '鐗':20,'鰎':20,'鰔':20,'孂':20,'斅':20,'譥':20,'醶':20,'鐎':20,'蠘':20,'鐑':20,'鶛':20,'瀞':20,'匷':20,'爑':20,'巈':20,
  '躆':20,'鼰':20,'攈':20,'竷':20,'轗':20,'籄':20,'藈':20,'矌':20,'鶤':20,'鞹':20,'攋':20,'櫴':20,'顟':20,'孄':20,'幱':20,
  '繿':20,'瓃':20,'礧':20,'礨':20,'攊':20,'爏':20,'瓈':20,'皪':20,'盭':20,'禲':20,'薶':20,'譧':20,'鬑':20,'爒':20,'镽':20,
  '飂':20,'孁':20,'壣':20,'隣':20,'鞻':20,'鐂':20,'鬸':20,'爖':20,'霳':20,'攎':20,'曥':20,'獹':20,'鶜':20,'籋':20,'羃':20,
  '藌':20,'麛':20,'礣':20,'孃':20,'黁':20,'齞':20,'羺':20,'譨':20,'鐞':20,'櫱':20,'騯':20,'薲':20,'鶣':20,'皫':20,'顠':20,
  '飃':20,'鐅':20,'鏺':20,'艩':20,'藄':20,'藒':20,'鬐':20,'攐':20,'濳':20,'爓':20,'譣':20,'躈':20,'鐈':20,'聺':20,'瀙':20,
  '藑':20,'鰌':20,'覻':20,'鐉':20,'隢':20,'曧':20,'瀜':20,'瓇':20,'鰇':20,'鶔':20,'闟':20,'鏾':20,'鰠':20,'譱':20,'轖':20,
  '鏼':20,'譝':20,'遾':20,'醳':20,'齛':20,'鶐':20,'鐁':20,'騪':20,'櫯':20,'瀡':20,'譢':20,'鐆':20,'籉':20,'鞺':20,'饄':20,
  '瓋':20,'軆':20,'鶗':20,'鶙':20,'譠':20,'鼮':20,'鶟':20,'顡':20,'鰖':20,'贎':20,'瀢':20,'覹':20,'觹':20,'鰄':20,'嚱':20,
  '鐊':20,'飁':20,'鰕':20,'廯':20,'攇':20,'瀗':20,'礥':20,'糮':20,'麙':20,'忀':20,'鐌':20,'麘':20,'髇':20,'鯹':20,'鏽':20,
  '矎':20,'藇':20,'臐':20,'鐚':20,'觷':20,'曣':20,'櫩':20,'騴':20,'鰋':20,'黤':20,'龑':20,'鰑':20,'譩':20,'轙':20,'醷':20,
  '韾':20,'孆':20,'孾':20,'巊':20,'廮':20,'巆':20,'攍':20,'藀':20,'譍':20,'鐛':20,'鶧':20,'鰅':20,'旟':20,'櫲':20,'籅':20,
  '霱':20,'饇':20,'黦':20,'鶢':20,'籆':20,'瓉':20,'鐕':20,'薻':20,'譟':20,'趮':20,'邅':20,'羄':20,'籈':20,'薽':20,'鏳':20,
  '瓆':20,'襧':20,'豑':20,'籕':20,'瀦':20,'鯺':20,'蠗':20,'鯼':20,'艺':21,'藝':21,'饑':21,'护':21,'護':21,'灶':21,'竈':21,
  '鸡':21,'鷄':21,'驱':21,'驅':21,'拦':21,'攔':21,'轰':21,'轟':21,'瀰':21,'药':21,'藥':21,'栏':21,'欄':21,'览':21,'覽':21,
  '饶':21,'饒':21,'烂':21,'爛':21,'险':21,'險':21,'莺':21,'鶯':21,'顾':21,'顧':21,'袜':21,'襪':21,'跃':21,'躍':21,'累':21,
  '纍':21,'铛':21,'鐺':21,'随':21,'隨':21,'续':21,'續':21,'搀':21,'攙':21,'腊':21,'臘':21,'馈':21,'饋':21,'属':21,'屬':21,
  '襬':21,'誉':21,'譽':21,'辟':21,'闢':21,'缠':21,'纏':21,'蔑':21,'衊':21,'蜡':21,'蠟':21,'隧':21,'骡':21,'騾':21,'樱':21,
  '櫻':21,'澜':21,'瀾':21,'谴':21,'譴':21,'鹤':21,'鶴':21,'辩':21,'辯':21,'藕':21,'藤':21,'嚣':21,'囂':21,'镰':21,'鐮':21,
  '鳍':21,'鰭':21,'嚼':21,'巍':21,'魔':21,'蠢':21,'霸':21,'霹':21,'黯':21,'忏':21,'懺':21,'迩':21,'邇':21,'珑':21,'瓏':21,
  '俪':21,'儷':21,'疬':21,'癧':21,'闼':21,'闥':21,'砻':21,'礱':21,'眬':21,'矓':21,'铎':21,'鐸':21,'啭':21,'囀':21,'蛎':21,
  '蠣':21,'猕':21,'獼':21,'粝':21,'糲':21,'骖':21,'驂':21,'傩':21,'儺':21,'骜':21,'驁':21,'蓦':21,'驀':21,'榉':21,'櫸':21,
  '嗫':21,'囁':21,'跻':21,'躋':21,'撄':21,'攖':21,'龇':21,'龈':21,'齦':21,'踌':21,'躊':21,'鹘':21,'鶻':21,'鹚':21,'鷀':21,
  '潋':21,'瀲':21,'骠':21,'驃':21,'骢':21,'驄':21,'鞒':21,'鞽':21,'鹞':21,'鷂':21,'鲥':21,'鰣':21,'馓':21,'饊':21,'馔':21,
  '饌':21,'缬':21,'纈':21,'薮':21,'藪':21,'飙':21,'飆':21,'斓':21,'斕':21,'邈':21,'藜':21,'藠':21,'藩':21,'颢':21,'顥':21,
  '髅':21,'髏':21,'镭':21,'鐳':21,'镯':21,'鐲':21,'鳎':21,'鰨':21,'鳏':21,'鰥':21,'鳐':21,'鰩':21,'癞':21,'癩':21,'魑':21,
  '攘':21,'鼙':21,'醺':21,'礴':21,'曩':21,'麝':21,'鐾':21,'羼':21,'蠡':21,'纩':21,'纊':21,'鸧':21,'鶬':21,'䓖':21,'藭':21,
  '赆':21,'贐':21,'赑':21,'贔':21,'隩':21,'鹝':21,'鷊':21,'䴘':21,'鷉':21,'鹟':21,'鶲':21,'鹠':21,'鶹':21,'鹡':21,'鶺':21,
  '鹢':21,'鷁':21,'鹣':21,'鶼':21,'鄹':21,'鹾':21,'鹺':21,'鬶':21,'鬹':21,'藟':21,'藦':21,'藨':21,'镮':21,'鐶':21,'镱':21,
  '鐿':21,'䲢':21,'鰧':21,'鳑':21,'鰟':21,'鳒':21,'鰜':21,'欂':21,'甗':21,'髎':21,'瀱':21,'瀹':21,'瀼':21,'瀵':21,'襫':21,
  '耰':21,'鬘':21,'趯':21,'罍':21,'鼱':21,'爚':21,'亹':21,'鐽':21,'鰤':21,'鶱':21,'鐩':21,'纆':21,'黬':21,'鐼':21,'譺':21,
  '藣':21,'襮':21,'臕':21,'飇':21,'飈':21,'朇':21,'鐴':21,'驆':21,'魓':21,'囃':21,'欃':21,'瀺':21,'鼚':21,'巐':21,'饓':21,
  '饎':21,'醻':21,'鶵':21,'龡':21,'嚽':21,'鶿':21,'劗':21,'瀻':21,'饏':21,'黮':21,'蘯':21,'闣':21,'軇':21,'藡':21,'鐵':21,
  '轛':21,'譵':21,'鰪':21,'轜':21,'瀿':21,'籓':21,'蠜':21,'飜':21,'鶭':21,'隫':21,'馩':21,'贑':21,'鼛':21,'寷':21,'鷇':21,
  '鶮':21,'瓌':21,'鞼':21,'鐹':21,'譹':21,'鰝':21,'皬':21,'蠚':21,'鶾':21,'嚾':21,'孉':21,'藧':21,'闤':21,'兤':21,'孈':21,
  '藱':21,'鐬':21,'靧':21,'韢':21,'嚿':21,'癨':21,'矐':21,'懻':21,'霵':21,'鞿':21,'齎':21,'櫼':21,'殲':21,'瀳':21,'瀸':21,
  '瀽':21,'譼':21,'轞':21,'鐱':21,'鹻':21,'鷍':21,'齩':21,'蠞':21,'齨':21,'鐻':21,'鐫':21,'臗':21,'瓎':21,'藞':21,'纇':21,
  '蠝':21,'礰':21,'纅':21,'鷅':21,'麜':21,'飉':21,'櫺':21,'瀶':21,'藰':21,'飅':21,'鰡':21,'竉':21,'龒':21,'瓐':21,'矑':21,
  '艪':21,'鏴':21,'鐪':21,'騼':21,'儸':21,'覼':21,'鬕':21,'鰢':21,'鷌':21,'鬗':21,'矒':21,'攗':21,'鄸':21,'蠠':21,'蠛':21,
  '劘':21,'髍':21,'躎':21,'譳':21,'齧':21,'欁':21,'霶':21,'礮':21,'鬔':21,'隦':21,'魒':21,'攓':21,'鰬':21,'羻':21,'鐰':21,
  '顦':21,'龝':21,'礭':21,'忂':21,'巏':21,'齤':21,'懹':21,'爙':21,'獽':21,'顤':21,'鰫':21,'醹':21,'鶸':21,'攕':21,'鬖':21,
  '饍':21,'鬺':21,'鶳':21,'籔':21,'襩':21,'卛':21,'孇':21,'灀':21,'騻':21,'藗':21,'瓍':21,'鶽':21,'譶':21,'鶶':21,'籐':21,
  '鷈':21,'藫':21,'鷆':21,'藬':21,'藯':21,'霺':21,'韡':21,'闦':21,'鰮':21,'躌':21,'鰞':21,'騽':21,'鶷':21,'纎':21,'臔':21,
  '藖':21,'贒':21,'欀':21,'嚻':21,'櫹':21,'藛':21,'襭':21,'齥':21,'籑':21,'藚':21,'壦':21,'顨':21,'雤':21,'鞾':21,'鷃':21,
  '黫':21,'黭':21,'霷':21,'瀷':21,'藙':21,'觺':21,'饐':21,'鐷':21,'櫽':21,'櫿':21,'瀴':21,'瀯':21,'礯':21,'譻':21,'廱':21,
  '櫾':21,'纋':21,'轝':21,'鐭':21,'灁':21,'鶰':21,'鼘':21,'儹':21,'贓':21,'騿':21,'藢':21,'騺':21,'鼅':21,'籒':21,'譸':21,
  '鐯':21,'鰦':21,'纉':21,'边':22,'邊':22,'权':22,'權':22,'欢':22,'歡':22,'罎':22,'芦':22,'蘆':22,'苏':22,'蘇':22,'听':22,
  '聽':22,'苹':22,'蘋':22,'衬':22,'襯':22,'鸥':22,'鷗':22,'鬚':22,'峦':22,'巒':22,'弯':22,'彎':22,'窃':22,'竊':22,'骄':22,
  '驕':22,'读':22,'讀':22,'聋':22,'聾':22,'袭':22,'襲':22,'啰':22,'囉':22,'笼':22,'籠':22,'惧':22,'懼':22,'隐':22,'隱':22,
  '赎':22,'贖':22,'铸':22,'鑄':22,'摄':22,'攝':22,'鉴':22,'鑒':22,'蔼':22,'藹':22,'蕴':22,'蘊':22,'瘾':22,'癮':22,'蘑':22,
  '藻':22,'颤':22,'顫':22,'癣':22,'癬':22,'灌':22,'囊':22,'瓤':22,'邝':22,'鄺':22,'苈':22,'藶':22,'呓':22,'囈':22,'沣':22,
  '灃':22,'茏':22,'蘢':22,'籴':22,'糴':22,'俨':22,'儼':22,'胪':22,'臚':22,'孪':22,'孿':22,'娈':22,'孌':22,'骁':22,'驍':22,
  '骅':22,'驊':22,'鸷':22,'鷙':22,'龚':22,'龔':22,'舻':22,'艫':22,'龛':22,'龕':22,'跞':22,'躒':22,'傥':22,'儻':22,'飨':22,
  '饗':22,'慑':22,'懾':22,'辔':22,'轡':22,'蔺':22,'藺':22,'霁':22,'霽':22,'箓':22,'籙':22,'璎':22,'瓔':22,'撺':22,'攛':22,
  '鞑':22,'韃':22,'蕲':22,'蘄':22,'龉':22,'齬':22,'龊':22,'齪':22,'踯':22,'躑':22,'镔':22,'鑌':22,'鲢':22,'鰱':22,'鲣':22,
  '鰹':22,'骣':22,'驏':22,'鹧':22,'鷓':22,'瘿':22,'癭':22,'隰':22,'鳌':22,'鰲':22,'镬':22,'鑊':22,'邋':22,'藿':22,'蘅':22,
  '镲':22,'鑔':22,'籁':22,'籟':22,'鳓':22,'鰳':22,'鳔':22,'鰾':22,'鳕':22,'鱈':22,'鳗':22,'鰻':22,'鳙':22,'鱅':22,'獾':22,
  '夔':22,'爝':22,'禳':22,'耱':22,'懿':22,'霾':22,'氍':22,'饕':22,'躐':22,'穰':22,'饔':22,'鬻':22,'轹':22,'轢':22,'萚':22,
  '蘀':22,'骕':22,'驌':22,'觌':22,'覿':22,'滠':22,'灄':22,'箨':22,'籜':22,'鲦':22,'鰷':22,'篯':22,'籛':22,'鹨':22,'鷚':22,
  '鳉':22,'鱂':22,'冁':22,'囅':22,'鳘':22,'鰵':22,'鳚':22,'鳛':22,'鰼':22,'瓖':22,'爟':22,'灈':22,'韂':22,'礵':22,'躔':22,
  '龢':22,'隮':22,'驎':22,'饘':22,'鷟':22,'鱀':22,'鰶':22,'鱇':22,'鷔':22,'驋':22,'鷝':22,'鰺':22,'驓':22,'囆':22,'鄽':22,
  '藽':22,'鷐':22,'彲':22,'鷘':22,'黐':22,'爞':22,'藸':22,'躕':22,'巑':22,'穳':22,'欉':22,'灇':22,'爜':22,'鄼':22,'黱':22,
  '隯':22,'疊':22,'巓':22,'驔':22,'鑃':22,'蠧':22,'豄':22,'贕':22,'韣':22,'躖':22,'驐':22,'蘁':22,'隭':22,'灋':22,'饙':22,
  '懽':22,'鑎':22,'鑉':22,'鬫':22,'鑅':22,'譿':22,'顪':22,'饖':22,'鰴':22,'鼲':22,'臛':22,'蘎':22,'鑇':22,'魕':22,'鰿':22,
  '鷑':22,'譾':22,'鑑':22,'韀':22,'韁':22,'灂':22,'竸':22,'蘏':22,'灍':22,'鼳':22,'齫':22,'藾':22,'襰':22,'髝':22,'灆':22,
  '瓓':22,'灅':22,'讄':22,'轠':22,'囇':22,'孋':22,'廲':22,'蠫':22,'觻':22,'邌':22,'奱':22,'鄻':22,'鬛':22,'鷜':22,'驑':22,
  '蠪':22,'襱':22,'龓':22,'籚':22,'纑':22,'罏':22,'蠦':22,'圝':22,'蘉':22,'霿':22,'靀':22,'孊':22,'瓕':22,'镾':22,'巎':22,
  '獿':22,'髐':22,'隬':22,'鑏':22,'糱':22,'蠥':22,'鑈':22,'灊':22,'顩':22,'鬜':22,'藮':22,'鑋':22,'鰽':22,'鱃':22,'戵':22,
  '欋':22,'鰸':22,'鷛':22,'鑐':22,'蘂':22,'蘃':22,'鬙':22,'飋':22,'欇':22,'覾':22,'藷':22,'欆':22,'鷞':22,'籘':22,'鷋':22,
  '鼵':22,'蘈':22,'鱄':22,'鷒':22,'驒':22,'欈':22,'犩':22,'鷕':22,'攜':22,'霼':22,'齂':22,'蠨':22,'臖':22,'藼':22,'魖':22,
  '驉':22,'蘍':22,'鑂':22,'臙':22,'贗':22,'鼴':22,'鷖':22,'籝':22,'鑍':22,'灉':22,'鄾':22,'籞':22,'蘌':22,'驈':22,'鷠':22,
  '禴':22,'囋':22,'讃':22,'鱆':22,'麞':22,'讁':22,'黰':22,'躓':22,'蠩':22,'鱁':22,'鑆':22,'籗':22,'纔':23,'兰':23,'蘭':23,
  '纖':23,'囌':23,'体':23,'體':23,'变':23,'變':23,'显':23,'顯':23,'洒':23,'灑':23,'晒':23,'曬':23,'髒':23,'恋':23,'戀':23,
  '验':23,'驗':23,'惊':23,'驚':23,'摊':23,'攤':23,'籤':23,'漓':23,'灕':23,'滩':23,'灘':23,'霉':23,'黴':23,'鳖':23,'鱉':23,
  '鳞':23,'鱗':23,'髓':23,'驿':23,'驛':23,'轳':23,'轤':23,'铄':23,'鑠':23,'栾':23,'欒':23,'挛':23,'攣':23,'痈':23,'癰':23,
  '鸶':23,'鷥':23,'蛊':23,'蠱':23,'猡':23,'玀':23,'椤':23,'欏':23,'鹇':23,'鷳':23,'跹':23,'躚':23,'鲟':23,'鱘':23,'缨':23,
  '纓':23,'靥':23,'靨':23,'餍':23,'饜':23,'齑':23,'齏':23,'藓':23,'蘚':23,'鹩':23,'鷯':23,'鹪':23,'鷦':23,'鹫':23,'鷲':23,
  '隳':23,'鹬':23,'鷸':23,'鹭':23,'鷺':23,'雠':23,'讎':23,'攒':23,'攢':23,'蘧':23,'蘩':23,'蘖':23,'黪':23,'黲':23,'镳':23,
  '鑣':23,'镴':23,'鑞':23,'鳜':23,'鱖':23,'鳝':23,'鱔':23,'鳟':23,'鱒':23,'瓘':23,'髑':23,'鬟':23,'鼹':23,'癯':23,'麟':23,
  '蠲':23,'詟':23,'讋':23,'锧':23,'鑕':23,'鹔':23,'鷫':23,'蔹':23,'蘞':23,'镥':23,'鑥':23,'襕':23,'襴':23,'蘘':23,'颥':23,
  '顬':23,'糵':23,'皭':23,'籥':23,'鼷':23,'齮':23,'齯':23,'巘':23,'鷭':23,'鱚':23,'纕':23,'鼇':23,'蘗':23,'鱍':23,'鷩':23,
  '顮':23,'馪':23,'蠯':23,'鼜':23,'艬':23,'讇':23,'爡':23,'攡':23,'讐':23,'齭':23,'鑡':23,'齱':23,'欑':23,'齰':23,'瓙':23,
  '鑟':23,'讍':23,'齃':23,'鱕':23,'鷱':23,'蠭':23,'矔':23,'蘬':23,'饚':23,'鷨':23,'顭':23,'鷬':23,'鱑':23,'韄':23,'頀':23,
  '羇':23,'蘮':23,'覉':23,'鑙':23,'囏':23,'鱎':23,'鷮':23,'彏':23,'鱊':23,'鷢':23,'籧':23,'蘜':23,'攟':23,'鬠':23,'巙':23,
  '鑛':23,'籣':23,'蘫':23,'儽':23,'壨':23,'鑘':23,'靁':23,'劙':23,'攦':23,'欐':23,'讈':23,'轣':23,'鑗':23,'籢':23,'蘝':23,
  '蘦':23,'躙':23,'贚':23,'躘':23,'豅':23,'曫':23,'灓':23,'攞':23,'曪':23,'臝':23,'驘':23,'攠':23,'鷶':23,'鼆':23,'蘪':23,
  '饛':23,'戂':23,'灖':23,'爢':23,'鑖':23,'鱙':23,'戁':23,'蠰':23,'鬞':23,'鑝':23,'鄿':23,'蘠':23,'瓗':23,'鱋':23,'鷤':23,
  '髞':23,'灗':23,'鱓':23,'鑜':23,'襳':23,'鼶':23,'鱐':23,'禵':23,'驖':23,'蘣':23,'鷵':23,'鷻':23,'斖':23,'讏':23,'躛':23,
  '鷡':23,'觽':23,'韅':23,'鷴':23,'鼸':23,'鱌':23,'毊':23,'贙':23,'鱏':23,'蘨':23,'囐':23,'壧':23,'孍':23,'巖':23,'巗':23,
  '灔':23,'觾':23,'讌':23,'酀':23,'醼':23,'鷰':23,'蘙':23,'讉':23,'鷧':23,'黳':23,'蠮':23,'驜':23,'蘟':23,'鷣':23,'蘡':23,
  '蠳':23,'鷪':23,'愹':23,'蘛':23,'邍':23,'蘥':23,'灒':23,'驙':23,'籦':23,'劚':23,'穱':23,'鑚':23,'鷷':23,'千':24,'韆':24,
  '让':24,'讓':24,'壩':24,'灵':24,'靈':24,'艳':24,'艷':24,'蚕':24,'蠶':24,'盐':24,'鹽':24,'脏':24,'臟':24,'搅':24,'攪':24,
  '雳':24,'靂':24,'酿':24,'釀':24,'嘱':24,'囑':24,'瘫':24,'癱':24,'骤':24,'驟':24,'鹰':24,'鷹':24,'鬓':24,'鬢':24,'赣':24,
  '贛':24,'罐':24,'矗':24,'陇':24,'隴':24,'谗':24,'讒':24,'鲎':24,'鱟':24,'谰':24,'讕':24,'魇':24,'魘':24,'龋':24,'齲':24,
  '龌':24,'齷':24,'簖':24,'籪':24,'鲼':24,'鱝':24,'鹮':24,'酃':24,'霭':24,'靄':24,'髌':24,'髕':24,'谶':24,'讖':24,'瓒':24,
  '瓚':24,'颦':24,'顰':24,'鳢':24,'鱧':24,'癫':24,'癲':24,'攫':24,'攥':24,'蠹':24,'躞':24,'衢':24,'鑫':24,'鲙':24,'鱠':24,
  '叇':24,'靆':24,'鹯':24,'鸇':24,'鳡':24,'鱤':24,'鳣':24,'䴙':24,'鸊':24,'玃':24,'醾':24,'鑪':24,'欓':24,'驞':24,'礸':24,
  '蠺':24,'灛':24,'酁':24,'戃':24,'雦':24,'魗':24,'襶':24,'攩':24,'灙':24,'韇':24,'韥':24,'鬭':24,'奲':24,'鑩':24,'齶':24,
  '靅':24,'黂':24,'蘴':24,'鱞':24,'鱥':24,'蘳':24,'靃':24,'鸄':24,'鑬':24,'魙':24,'鹼':24,'灚':24,'麠':24,'戄':24,'欔':24,
  '犪':24,'齳':24,'囒':24,'孏':24,'躝':24,'禷':24,'蘲':24,'瓥':24,'穲':24,'醽':24,'鑨':24,'靇':24,'鸁':24,'矕':24,'醿':24,
  '儾':24,'鬡':24,'囓':24,'齵':24,'鷿':24,'玂':24,'鸂':24,'臞':24,'蠷':24,'蠸':24,'躟':24,'躠':24,'鱢':24,'鱣':24,'鱦':24,
  '鸀':24,'艭':24,'曭':24,'爣':24,'鼞':24,'驝':24,'攨':24,'韈':24,'韤':24,'蘶':24,'屭':24,'蠵':24,'衋':24,'齆':24,'玁':24,
  '齴':24,'齅':24,'讑':24,'邎':24,'鷽':24,'曮':24,'鸉':24,'鷾':24,'鸃':24,'鸈':24,'讔':24,'鸆':24,'鼝':24,'雥':24,'禶':24,
  '鸅':24,'鱡':24,'襵':24,'蘵':24,'孎':24,'纗':24,'厅':25,'廳':25,'观':25,'觀':25,'钥':25,'鑰':25,'赃':25,'贜':25,'萝':25,
  '蘿':25,'颅':25,'顱':25,'衅':25,'釁':25,'揽':25,'攬':25,'蛮':25,'蠻':25,'榄':25,'欖':25,'箩':25,'籮':25,'篱':25,'籬':25,
  '镶':25,'鑲':25,'笾':25,'籩':25,'塆':25,'壪':25,'脔':25,'臠':25,'蓠':25,'蘺':25,'叆':25,'靉':25,'鲚':25,'鱭':25,'蹑':25,
  '躡':25,'羁':25,'羈':25,'镧':25,'鑭':25,'蹿':25,'躥':25,'髋':25,'髖':25,'缵':25,'纘':25,'酆':25,'鼍':25,'鼉':25,'臜':25,
  '臢':25,'灏':25,'灝':25,'蘸':25,'镵':25,'鑱':25,'灞':25,'襻':25,'纛':25,'鬣':25,'囔':25,'黉':25,'黌':25,'鲿':25,'鱨':25,
  '鹲':25,'鸏':25,'鹱':25,'鸌':25,'酅':25,'鳠':25,'鱯':25,'蘼':25,'鳤':25,'齇':25,'觿':25,'鸑':25,'瓛':25,'欛':25,'鑮':25,
  '鼈':25,'曯':25,'齹':25,'黵':25,'鸐':25,'齻':25,'戅':25,'蘹':25,'蘾':25,'讙':25,'貛':25,'酄':25,'讗':25,'蘻':25,'虀':25,
  '覊':25,'躤':25,'麡':25,'襺':25,'鑯':25,'鑳':25,'釂':25,'龣':25,'矡':25,'矙':25,'欗':25,'灡':25,'灠':25,'爤':25,'顲':25,
  '欙':25,'蘱':25,'蘽':25,'攭':25,'欚':25,'纚':25,'羉':25,'纙':25,'鸍':25,'饝':25,'臡':25,'鸋':25,'讘':25,'躣':25,'鱬':25,
  '籭':25,'襹':25,'躢':25,'矘':25,'鼟':25,'糶':25,'隵':25,'鱮':25,'礹':25,'襼':25,'齸':25,'鸎':25,'鸒':25,'襸':25,'斸':25,
  '欘':25,'灟':25,'爥':25,'齺':25,'籫':25,'驴':26,'驢':26,'逻':26,'邏':26,'馋':26,'饞':26,'湾':26,'灣':26,'瞩':26,'矚':26,
  '郦':26,'酈':26,'逦':26,'邐':26,'镊':26,'鑷':26,'镩':26,'鑹':26,'鞯':26,'韉':26,'趱':26,'趲':26,'躜':26,'躦':26,'攮':26,
  '酾':26,'釃':26,'黡':26,'黶':26,'酂':26,'酇':26,'彟':26,'彠':26,'蠼':26,'鱲':26,'鸔':26,'鼊':26,'鑶':26,'氎':26,'靊':26,
  '鑵':26,'鑴':26,'虃':26,'鱳':26,'鑸':26,'鸓':26,'鱱':26,'驡':26,'虂':26,'髗':26,'釄':26,'鱴':26,'欜':26,'灢':26,'鑺':26,
  '虪':26,'驣':26,'矖':26,'躧':26,'饟':26,'鱶':26,'龤':26,'驠':26,'讛':26,'籯':26,'欝':26,'龥':26,'籰':26,'讚':26,'鱵':26,
  '钻':27,'鑽':27,'凿':27,'鑿':27,'缆':27,'纜':27,'锣':27,'鑼':27,'躏':27,'躪':27,'鸬':27,'鸕':27,'阄':27,'鬮':27,'谠':27,
  '讜':27,'鲈':27,'鱸':27,'滦':27,'灤':27,'酽':27,'釅':27,'銮':27,'鑾':27,'谳':27,'讞':27,'颞':27,'顳':27,'骥':27,'驥':27,
  '黩':27,'黷':27,'骧':27,'驤':27,'颧':27,'顴':27,'骦':27,'驦':27,'虉':27,'飍':27,'犫':27,'鱷':27,'飝':27,'飌':27,'鸖':27,
  '蠽':27,'貜':27,'躩':27,'驧':27,'糷':27,'纝':27,'虆':27,'靋':27,'轥':27,'鸗':27,'齈':27,'鑻':27,'虇':27,'鬤':27,'灦':27,
  '虈':27,'馫':27,'灥':27,'灎':27,'豓':27,'軉':27,'讝':27,'蠾':27,'鹦':28,'鸚':28,'棂':28,'欞':28,'滟':28,'灧':28,'戆':28,
  '戇':28,'镋':28,'钂':28,'鹴':28,'鸘':28,'齼':28,'灨':28,'驩':28,'雧':28,'齽':28,'钁':28,'鼺':28,'爧':28,'麢':28,'黸':28,
  '癴':28,'饠':28,'钀':28,'驨':28,'豔':28,'鸙':28,'饡':28,'蠿':28,'鬱':29,'骊':29,'驪':29,'鹳':29,'鸛':29,'爨':29,'讟':29,
  '麷':29,'鱹':29,'躨':29,'纞':29,'虊':29,'鸜':29,'钃':29,'鸾':30,'鸞':30,'鹂':30,'鸝':30,'鲡':30,'鱺':30,'馕':30,'饢':30,
  '骉':30,'驫':30,'韊':30,'癵':30,'厵':30,'籱':30,'虌':31,'虋':31,'麣':31,'吁':32,'籲':32,'龖':32,'灩':32,'麤':33,'龗':33,
  '鱻':33,'灪':33,'爩':33,'齾':35,'齉':36,'靐':39,'龘':48,
};

/* ===== CHAR_WU (from CHAR_WU.js) ===== */
const CHAR_WU={
'一':'木',
'乙':'木',
'乀':'木',
'丨':'木',
'亅':'木',
'丿':'木',
'乁':'木',
'丶':'木',
'二':'火',
'十':'火',
'丁':'火',
'七':'火',
'卜':'火',
'八':'火',
'人':'土',
'入':'火',
'儿':'火',
'匕':'火',
'九':'火',
'刁':'火',
'刀':'金',
'力':'金',
'乃':'火',
'又':'水',
'乂':'火',
'乜':'火',
'冫':'水',
'冖':'水',
'勹':'火',
'卩':'水',
'刂':'金',
'匚':'火',
'巜':'火',
'冂':'火',
'丩':'火',
'凵':'火',
'丂':'火',
'厶':'火',
'丄':'火',
'亠':'火',
'匸':'火',
'丅':'火',
'三':'土',
'干':'土',
'于':'土',
'工':'土',
'土':'土',
'士':'土',
'下':'土',
'寸':'土',
'大':'火',
'丈':'土',
'上':'土',
'小':'土',
'口':'金',
'山':'土',
'巾':'土',
'乞':'土',
'川':'土',
'夕':'土',
'久':'土',
'勺':'土',
'凡':'土',
'丸':'土',
'广':'土',
'亡':'土',
'丫':'土',
'尸':'土',
'己':'土',
'已':'土',
'巳':'土',
'弓':'土',
'子':'土',
'也':'土',
'女':'土',
'刃':'金',
'叉':'土',
'兀':'土',
'弋':'土',
'孑':'土',
'孓':'土',
'幺':'土',
'亍':'土',
'尢':'土',
'彳':'土',
'宀':'土',
'屮':'土',
'夨':'土',
'巛':'土',
'廾':'土',
'丌':'土',
'亼':'土',
'彐':'土',
'彑':'土',
'卪':'土',
'乆':'土',
'孒':'土',
'卄':'土',
'彡':'土',
'夊':'土',
'乇':'土',
'囗':'土',
'兦':'土',
'卂':'土',
'劜':'土',
'廴':'水',
'夂':'土',
'才':'金',
'及':'金',
'之':'金',
'井':'金',
'天':'火',
'夫':'火',
'元':'金',
'无':'金',
'丐':'金',
'木':'木',
'五':'金',
'支':'金',
'不':'金',
'犬':'金',
'太':'火',
'歹':'金',
'友':'水',
'尤':'金',
'匹':'金',
'牙':'金',
'屯':'金',
'戈':'金',
'比':'金',
'互':'金',
'切':'金',
'止':'金',
'少':'金',
'曰':'金',
'日':'火',
'中':'金',
'内':'金',
'水':'水',
'午':'金',
'牛':'金',
'手':'金',
'毛':'金',
'壬':'金',
'升':'金',
'夭':'金',
'仁':'土',
'什':'金',
'片':'金',
'化':'金',
'仇':'金',
'仍':'金',
'斤':'金',
'爪':'金',
'反':'水',
'介':'金',
'父':'金',
'今':'金',
'凶':'金',
'分':'金',
'公':'金',
'月':'火',
'氏':'金',
'勿':'金',
'欠':'金',
'丹':'金',
'匀':'金',
'勾':'金',
'六':'金',
'文':'金',
'亢':'金',
'方':'水',
'火':'火',
'斗':'金',
'户':'金',
'冗':'金',
'心':'火',
'尺':'金',
'引':'金',
'巴':'金',
'孔':'金',
'允':'金',
'予':'金',
'幻':'金',
'亓':'金',
'廿':'金',
'丏':'金',
'卅':'金',
'仄':'金',
'厄':'金',
'仃':'金',
'仉':'金',
'仂':'金',
'兮':'金',
'刈':'金',
'爻':'金',
'卞':'金',
'尹':'金',
'夬':'金',
'爿':'金',
'毋':'金',
'卬':'金',
'殳':'金',
'毌':'金',
'勽':'金',
'仈':'金',
'灬':'金',
'仌':'金',
'刅':'金',
'亣':'金',
'弔':'金',
'乣':'金',
'仏':'金',
'乢':'金',
'巿':'金',
'厷':'金',
'弖':'金',
'戶':'金',
'戸':'金',
'丮':'金',
'尐':'金',
'丯':'金',
'勼':'金',
'厸':'金',
'冃':'金',
'內':'金',
'攴':'金',
'攵':'金',
'厹':'金',
'冄':'金',
'丗':'金',
'収':'金',
'亖':'金',
'厃':'金',
'忄':'火',
'圠':'金',
'弌':'金',
'冘':'金',
'勻':'金',
'帀':'金',
'兂':'金',
'卆':'金',
'王':'土',
'扎':'水',
'巨':'水',
'瓦':'水',
'乏':'水',
'以':'水',
'玉':'水',
'刊':'水',
'未':'水',
'末':'水',
'示':'火',
'巧':'水',
'正':'水',
'卉':'水',
'功':'火',
'去':'水',
'甘':'水',
'世':'水',
'古':'水',
'本':'水',
'可':'水',
'丙':'水',
'左':'水',
'石':'土',
'右':'水',
'布':'水',
'夯':'水',
'戊':'水',
'平':'水',
'卡':'水',
'北':'水',
'占':'水',
'凸':'水',
'旦':'水',
'目':'水',
'且':'水',
'甲':'水',
'申':'水',
'叮':'水',
'田':'土',
'由':'水',
'叭':'水',
'史':'水',
'央':'火',
'兄':'水',
'叼':'水',
'叫':'水',
'叩':'水',
'叨':'水',
'另':'水',
'冉':'水',
'皿':'水',
'凹':'水',
'囚':'水',
'四':'水',
'生':'水',
'矢':'水',
'失':'火',
'乍':'水',
'禾':'水',
'丘':'水',
'付':'土',
'仗':'水',
'代':'水',
'仙':'水',
'白':'水',
'仔':'水',
'他':'水',
'斥':'水',
'瓜':'水',
'乎':'水',
'令':'水',
'用':'水',
'甩':'水',
'句':'水',
'匆':'水',
'册':'水',
'卯':'水',
'外':'水',
'包':'水',
'主':'水',
'市':'水',
'立':'水',
'玄':'水',
'半':'水',
'宁':'土',
'穴':'水',
'它':'水',
'必':'水',
'永':'水',
'司':'水',
'尼':'水',
'民':'水',
'弗':'水',
'弘':'水',
'奶':'水',
'奴':'水',
'召':'水',
'加':'火',
'皮':'水',
'孕':'水',
'矛':'水',
'母':'水',
'幼':'水',
'札':'水',
'叵':'水',
'匝':'水',
'丕':'水',
'匜':'水',
'卟':'水',
'叱':'水',
'叻':'水',
'仨':'水',
'仕':'水',
'仟':'水',
'仡':'木',
'仫':'水',
'仞':'水',
'卮':'水',
'氐':'水',
'尻':'水',
'尕':'水',
'弁':'水',
'圢':'水',
'氕':'水',
'仝':'水',
'宄':'水',
'厈':'水',
'屵':'水',
'叐':'水',
'犮':'水',
'夲':'水',
'戹':'水',
'仢':'水',
'癶':'水',
'氷':'水',
'仧':'水',
'仦':'水',
'叺':'水',
'処':'水',
'疒':'水',
'刌':'水',
'歺':'水',
'奵':'水',
'帄':'水',
'尓':'水',
'弍':'水',
'匃':'水',
'匄':'水',
'仠':'水',
'夰':'水',
'叧':'水',
'叏':'水',
'丱':'水',
'仜':'水',
'囘':'水',
'刉':'水',
'旡':'水',
'匞':'水',
'丼':'水',
'冋':'水',
'匛':'水',
'凥':'水',
'刋':'水',
'凷':'水',
'屴':'水',
'圥':'水',
'夘':'水',
'囜':'水',
'庀':'水',
'疋':'水',
'圤':'水',
'卭':'水',
'叴':'水',
'厺':'水',
'宂':'水',
'禸':'水',
'朮':'水',
'玊':'水',
'亗':'水',
'冭':'水',
'夳':'水',
'庁':'水',
'仛':'水',
'夗':'水',
'仚':'水',
'屳':'水',
'囙':'水',
'甴':'水',
'戉':'水',
'曱':'水',
'庂':'水',
'厇':'水',
'氶':'水',
'打':'木',
'扒':'木',
'扔':'木',
'印':'水',
'犯':'木',
'汁':'木',
'式':'木',
'刑':'木',
'戎':'木',
'寺':'木',
'吉':'木',
'考':'木',
'老':'木',
'地':'木',
'耳':'木',
'共':'木',
'朽':'木',
'臣':'木',
'吏':'木',
'再':'木',
'西':'木',
'戌':'木',
'在':'木',
'百':'木',
'有':'木',
'存':'木',
'而':'木',
'匠':'木',
'灰':'木',
'列':'金',
'死':'木',
'夷':'火',
'至':'木',
'此':'木',
'尖':'木',
'劣':'木',
'光':'木',
'早':'木',
'吐':'木',
'虫':'火',
'同':'木',
'吊':'木',
'吃':'木',
'因':'木',
'吆':'木',
'屹':'木',
'帆':'木',
'肉':'水',
'年':'木',
'朱':'木',
'先':'木',
'丢':'木',
'舌':'木',
'竹':'木',
'乒':'木',
'乓':'木',
'休':'木',
'伍':'木',
'伏':'木',
'臼':'木',
'伐':'木',
'仲':'木',
'件':'木',
'任':'木',
'份':'木',
'仰':'木',
'仿':'木',
'自':'木',
'伊':'木',
'血':'木',
'向':'木',
'后':'木',
'行':'水',
'舟':'木',
'全':'木',
'兆':'木',
'企':'木',
'朵':'木',
'危':'水',
'旬':'木',
'旨':'木',
'旭':'火',
'匈':'木',
'名':'木',
'各':'木',
'多':'木',
'色':'木',
'冰':'水',
'亦':'木',
'交':'木',
'衣':'火',
'次':'木',
'决':'木',
'亥':'木',
'充':'木',
'妄':'木',
'羊':'木',
'米':'木',
'州':'木',
'宇':'土',
'守':'土',
'宅':'木',
'字':'木',
'安':'土',
'异':'木',
'弛':'木',
'收':'木',
'奸':'木',
'如':'木',
'妃':'木',
'好':'木',
'她':'木',
'羽':'木',
'求':'木',
'犰':'木',
'汀':'木',
'匡':'木',
'耒':'木',
'圩':'木',
'圬':'木',
'圭':'木',
'圪':'木',
'圳':'木',
'圮':'木',
'圯':'木',
'亘':'木',
'夼':'木',
'戍':'木',
'尥':'木',
'乩':'木',
'旯':'木',
'曳':'木',
'屺':'木',
'凼':'木',
'囡':'木',
'缶':'木',
'氘':'木',
'氖':'木',
'牝':'木',
'伎':'木',
'伢':'木',
'仵':'木',
'伉':'木',
'伫':'木',
'囟':'木',
'汆':'木',
'刖':'木',
'夙':'木',
'旮':'木',
'刎':'木',
'舛':'木',
'聿':'木',
'艮':'木',
'厾':'木',
'丞':'木',
'妁':'木',
'牟':'木',
'伋':'木',
'氿':'木',
'汈':'木',
'氾':'木',
'忉':'木',
'圲':'木',
'圫':'木',
'朳':'木',
'朸':'木',
'吒':'木',
'吖':'木',
'屼':'木',
'屾':'木',
'仳':'木',
'伈':'木',
'癿':'木',
'甪':'木',
'冱':'木',
'孖':'木',
'虍':'木',
'艹':'木',
'伌':'木',
'伓':'木',
'汃':'木',
'夶':'木',
'朼':'木',
'仺':'木',
'艸':'木',
'奼':'木',
'仯':'木',
'朾':'木',
'朿':'木',
'吋':'木',
'伔':'木',
'刐':'木',
'圵':'木',
'朷':'木',
'仾':'木',
'伄':'木',
'忊':'木',
'丟':'木',
'兊':'木',
'伅':'木',
'仮':'木',
'奿':'木',
'払':'木',
'伕':'木',
'甶':'木',
'亙':'木',
'仹':'木',
'冎':'木',
'灮':'木',
'攰':'木',
'朹':'木',
'屽':'木',
'叿':'木',
'妅':'木',
'屸':'木',
'巟':'木',
'匢':'木',
'灳':'木',
'刏':'木',
'妀':'木',
'囝':'木',
'幵':'木',
'夅':'木',
'弜':'木',
'伒':'木',
'劤':'木',
'奺':'木',
'朻':'木',
'牞':'木',
'刔':'木',
'氒':'木',
'匟':'木',
'攷':'木',
'劥':'木',
'忇':'木',
'扐':'木',
'氻':'木',
'厽':'木',
'刕':'木',
'尦':'木',
'吂':'木',
'糸':'木',
'汅':'木',
'吀':'木',
'奻':'木',
'屰':'木',
'氼':'木',
'氽':'木',
'帇':'木',
'伂':'木',
'炇':'木',
'圶':'木',
'仱':'木',
'圱':'木',
'奷':'木',
'宆':'木',
'丠':'木',
'玌':'木',
'屻':'木',
'忈':'木',
'朲':'木',
'叒':'木',
'弎':'木',
'乨':'木',
'卋':'木',
'尗':'木',
'伖':'木',
'兲':'木',
'旫':'木',
'弚':'木',
'彵':'木',
'穵':'木',
'仴':'木',
'刓':'木',
'卍':'木',
'伆':'木',
'弙':'木',
'襾':'火',
'仼':'木',
'奾':'木',
'灱':'木',
'灲':'木',
'劦':'木',
'旪':'木',
'兇':'木',
'吅':'木',
'廵':'木',
'厊':'木',
'仸':'木',
'夵':'木',
'伇':'木',
'吔':'木',
'乑':'木',
'伃':'木',
'汄':'木',
'劧':'木',
'伀':'木',
'圴':'木',
'彴':'木',
'吇':'木',
'车':'金',
'車':'火',
'贝':'金',
'貝':'火',
'见':'火',
'見':'火',
'扛':'火',
'扣':'火',
'托':'火',
'圾':'火',
'成':'火',
'夹':'火',
'夾':'火',
'吕':'火',
'吸':'火',
'廷':'水',
'延':'水',
'似':'火',
'壮':'火',
'壯':'火',
'妆':'火',
'妝':'火',
'汗':'火',
'污':'火',
'江':'水',
'汛':'火',
'池':'火',
'汝':'火',
'忙':'火',
'巡':'火',
'弄':'火',
'形':'火',
'戒':'火',
'吞':'火',
'址':'火',
'走':'水',
'汞':'火',
'攻':'火',
'赤':'火',
'孝':'火',
'坎':'火',
'均':'土',
'坟':'火',
'坑':'火',
'坊':'土',
'志':'火',
'却':'水',
'劫':'火',
'杆':'火',
'杠':'火',
'杜':'火',
'材':'火',
'村':'火',
'杖':'火',
'杏':'木',
'杉':'火',
'巫':'火',
'李':'火',
'甫':'火',
'匣':'火',
'更':'火',
'束':'火',
'吾':'火',
'豆':'火',
'酉':'火',
'辰':'火',
'否':'火',
'尬':'火',
'步':'火',
'旱':'火',
'盯':'火',
'呈':'火',
'吴':'火',
'助':'火',
'里':'火',
'呆':'火',
'吱':'火',
'吠':'火',
'呀':'火',
'足':'火',
'男':'火',
'吵':'火',
'串':'火',
'呐':'火',
'吟':'火',
'吩':'火',
'吻':'火',
'吹':'火',
'吭':'火',
'吧':'火',
'邑':'火',
'吼':'火',
'囤':'火',
'别':'火',
'吮':'火',
'牡':'火',
'告':'火',
'我':'火',
'利':'火',
'秃':'火',
'秀':'火',
'私':'火',
'每':'火',
'兵':'火',
'估':'火',
'何':'火',
'佐':'火',
'佑':'火',
'但':'火',
'伸':'火',
'佃':'火',
'作':'火',
'伯':'火',
'伶':'火',
'低':'火',
'你':'火',
'住':'火',
'位':'火',
'伴':'火',
'身':'火',
'皂':'火',
'伺':'火',
'佛':'火',
'囱':'火',
'役':'火',
'余':'火',
'希':'火',
'坐':'火',
'谷':'火',
'妥':'火',
'含':'火',
'岔':'火',
'甸':'火',
'免':'火',
'角':'火',
'删':'火',
'彤':'火',
'卵':'水',
'灸':'火',
'刨':'火',
'言':'金',
'况':'水',
'床':'土',
'庇':'土',
'吝':'火',
'冷':'水',
'序':'火',
'辛':'火',
'弃':'火',
'忘':'火',
'判':'火',
'兑':'火',
'灼':'火',
'弟':'火',
'冶':'火',
'完':'土',
'宋':'土',
'宏':'土',
'牢':'火',
'究':'火',
'灾':'火',
'良':'火',
'初':'火',
'君':'火',
'即':'火',
'屁':'火',
'尿':'火',
'尾':'火',
'局':'火',
'改':'火',
'忌':'火',
'妓':'火',
'妙':'火',
'妖':'火',
'妨':'火',
'妒':'火',
'努':'火',
'忍':'火',
'矣':'火',
'些':'火',
'玎':'火',
'扦':'火',
'岌':'火',
'佤':'火',
'汕':'火',
'汔':'火',
'汐':'水',
'汜':'火',
'汊':'火',
'忖':'火',
'圻':'火',
'坂':'火',
'坍':'火',
'杌':'火',
'杓':'火',
'杞':'木',
'杈':'火',
'忑':'火',
'孛':'火',
'豕':'火',
'忒':'火',
'忐':'火',
'卣':'火',
'旰':'火',
'呋':'火',
'呔':'火',
'呃':'火',
'吡':'火',
'町':'火',
'虬':'火',
'吽':'火',
'吣':'火',
'吲':'火',
'岐':'火',
'岈':'火',
'岑':'火',
'囫':'火',
'氙':'火',
'氚':'火',
'牤':'火',
'佞':'火',
'攸':'火',
'佚':'火',
'佝':'火',
'佟':'火',
'佗':'火',
'伽':'火',
'彷':'火',
'佘':'火',
'孚':'火',
'豸':'火',
'坌':'火',
'奂':'火',
'劬':'火',
'亨':'火',
'庋':'火',
'疔':'火',
'孜':'火',
'妍':'火',
'妣':'火',
'妊':'火',
'妗':'火',
'妞':'火',
'妤':'火',
'劭':'火',
'甬':'火',
'扞':'火',
'犴':'火',
'汋':'火',
'坉':'火',
'坋':'火',
'毐':'火',
'杕':'火',
'杙':'火',
'杄':'火',
'杧':'火',
'尪':'火',
'尨':'火',
'坒':'火',
'芈':'火',
'旴':'火',
'旵':'火',
'岜':'火',
'呇':'火',
'冏':'火',
'岙':'火',
'伾':'火',
'伭':'火',
'佖':'火',
'伲':'火',
'佁':'火',
'岊':'火',
'妧':'火',
'妘':'火',
'乸':'火',
'吳':'火',
'釆':'火',
'岇':'火',
'庍':'火',
'夿':'火',
'弝':'火',
'玐':'火',
'岅':'火',
'匥':'火',
'別':'火',
'伻':'火',
'佊':'火',
'疕':'火',
'皀':'火',
'佈':'火',
'吥':'火',
'犲':'火',
'扠':'火',
'兏':'火',
'妛':'火',
'扡':'火',
'杘':'火',
'杝':'火',
'灻':'火',
'吜':'火',
'竌':'火',
'汌':'火',
'囪':'火',
'犳':'火',
'辵':'水',
'佌':'火',
'汏':'火',
'妉':'火',
'帎':'火',
'扥':'火',
'厎':'火',
'坔':'火',
'坘':'火',
'旳':'火',
'刟':'火',
'扚':'火',
'矵':'火',
'矴':'火',
'吺':'火',
'兌':'火',
'庉':'火',
'吪':'火',
'囮':'火',
'岋':'火',
'奀':'火',
'冹':'火',
'忛':'火',
'杋':'火',
'汎':'火',
'忋':'火',
'攺':'火',
'杚':'火',
'妚':'火',
'坆':'火',
'帉':'火',
'弅':'火',
'妢':'火',
'岎':'火',
'刜':'火',
'妋':'火',
'忓':'火',
'攼':'火',
'吿':'火',
'呄':'火',
'戓':'火',
'扢':'火',
'犵':'火',
'夆':'火',
'妦':'火',
'杛':'火',
'囯':'火',
'妎':'火',
'佄':'火',
'吰':'火',
'灴':'火',
'帍':'火',
'囬':'火',
'吙':'火',
'坖':'火',
'彶':'火',
'犱':'火',
'圿':'火',
'糺':'火',
'臫':'火',
'刦':'火',
'刧':'火',
'吤':'火',
'岕':'火',
'庎':'火',
'妌':'火',
'坓':'火',
'坕':'火',
'坙':'火',
'宑':'火',
'巠':'火',
'囧':'火',
'呁':'火',
'囥':'火',
'坈':'火',
'妔':'火',
'扝':'火',
'玏':'火',
'叓':'火',
'戻':'火',
'刢':'火',
'寽':'火',
'佅':'火',
'杗':'火',
'汒':'火',
'戼':'火',
'皃':'火',
'呅':'火',
'刡':'火',
'劰':'火',
'圽':'火',
'妠':'火',
'疓':'火',
'伱':'火',
'圼':'火',
'伮':'火',
'吘':'火',
'妑':'火',
'帊':'火',
'汖':'火',
'冸':'火',
'匉':'火',
'甹':'火',
'囨':'火',
'岓':'火',
'忔':'火',
'盀':'火',
'岒':'火',
'汘':'火',
'吢':'火',
'坅':'火',
'庈':'火',
'扏':'火',
'汓':'火',
'夋':'火',
'伹':'火',
'佉':'火',
'刞':'火',
'匤':'火',
'礽':'火',
'宍':'火',
'忎':'火',
'扨':'火',
'杒':'火',
'牣':'火',
'秂':'火',
'卲':'火',
'佋':'火',
'斘':'火',
'佀':'火',
'忕':'火',
'戺':'火',
'弞':'火',
'牠':'火',
'旲':'火',
'坄':'火',
'兎':'火',
'宊':'火',
'禿':'火',
'杔':'火',
'汑':'火',
'汙':'火',
'汚':'火',
'岏':'火',
'汍':'火',
'囲':'火',
'妏':'火',
'彣':'火',
'岉':'火',
'扤':'火',
'杇':'火',
'忚':'火',
'尩':'火',
'尫':'火',
'彺':'火',
'佡':'火',
'伳':'火',
'灺':'火',
'妡':'火',
'孞':'火',
'伵':'火',
'坃':'火',
'杊':'火',
'庘':'火',
'庌':'火',
'宎':'火',
'岆':'火',
'吷':'火',
'妟':'火',
'佒':'火',
'伿':'火',
'劮':'火',
'吚':'火',
'宐':'火',
'耴':'火',
'肊':'火',
'盁':'火',
'丣':'火',
'扜':'火',
'杅':'火',
'囦':'火',
'妜':'火',
'岄':'火',
'夽':'火',
'囩':'火',
'扗':'火',
'災':'火',
'皁':'火',
'厏':'火',
'灹':'火',
'佔':'火',
'扙':'火',
'佂':'火',
'坁':'火',
'巵':'火',
'帋':'火',
'刣':'火',
'妕':'火',
'妐':'火',
'彸':'火',
'伷':'火',
'佇':'火',
'劯':'火',
'灷':'火',
'宒':'火',
'杍':'火',
'兒':'土',
'门':'水',
'門':'土',
'冈':'土',
'岡':'土',
'长':'土',
'長':'土',
'仑':'土',
'侖':'土',
'轧':'土',
'軋':'土',
'东':'土',
'東':'土',
'纠':'土',
'糾':'土',
'亚':'土',
'协':'土',
'協':'土',
'肌':'土',
'肋':'土',
'争':'土',
'并':'土',
'玖':'土',
'扶':'土',
'技':'金',
'扼':'土',
'找':'土',
'批':'土',
'扯':'土',
'抄':'土',
'抓':'土',
'扳':'土',
'扮':'土',
'抑':'土',
'抛':'土',
'投':'土',
'抗':'土',
'抖':'土',
'扭':'土',
'把':'土',
'抒':'土',
'两':'土',
'兩':'土',
'来':'土',
'來':'土',
'狂':'土',
'状':'土',
'狀':'土',
'汪':'水',
'沐':'水',
'沛':'水',
'汰':'土',
'沙':'土',
'汽':'土',
'沃':'土',
'汹':'土',
'没':'土',
'沈':'土',
'沉':'土',
'沁':'土',
'忱':'土',
'快':'土',
'社':'土',
'祀':'火',
'姊':'土',
'奉':'火',
'武':'土',
'青':'土',
'卦':'土',
'坷':'土',
'坯':'土',
'坪':'土',
'坦':'土',
'坤':'土',
'垃':'土',
'幸':'土',
'坡':'土',
'其':'土',
'取':'水',
'昔':'土',
'直':'土',
'枉':'土',
'林':'木',
'枝':'木',
'杯':'土',
'枚':'土',
'析':'土',
'松':'木',
'杭':'土',
'枕':'土',
'或':'土',
'卧':'土',
'事':'土',
'刺':'金',
'雨':'土',
'奈':'火',
'奇':'土',
'妻':'土',
'到':'土',
'非':'土',
'叔':'水',
'歧':'土',
'卓':'土',
'虎':'土',
'尚':'土',
'旺':'土',
'具':'土',
'味':'土',
'果':'土',
'昆':'土',
'咕':'土',
'昌':'土',
'呵':'土',
'明':'火',
'易':'土',
'昂':'土',
'典':'土',
'固':'土',
'忠':'火',
'呻':'土',
'咒':'土',
'咋':'土',
'咐':'土',
'呼':'土',
'咏':'土',
'呢':'土',
'咄':'土',
'咖':'土',
'岸':'土',
'岩':'土',
'帖':'土',
'帕':'土',
'知':'土',
'氛':'土',
'垂':'土',
'牧':'土',
'物':'土',
'乖':'土',
'秆':'土',
'和':'土',
'季':'土',
'委':'土',
'秉':'土',
'佳':'土',
'侍':'土',
'岳':'土',
'供':'土',
'使':'土',
'例':'土',
'版':'土',
'侄':'土',
'侣':'土',
'佩':'土',
'侈':'土',
'依':'土',
'卑':'土',
'的':'土',
'欣':'土',
'往':'水',
'爬':'土',
'彼':'土',
'所':'土',
'金':'金',
'刹':'土',
'命':'土',
'斧':'土',
'爸':'土',
'采':'土',
'受':'水',
'乳':'土',
'念':'火',
'忿':'土',
'朋':'土',
'服':'土',
'周':'土',
'昏':'火',
'兔':'土',
'忽':'土',
'京':'土',
'享':'土',
'店':'土',
'夜':'土',
'府':'土',
'底':'土',
'疙':'土',
'疚':'土',
'卒':'土',
'庚':'土',
'净':'水',
'盲':'土',
'放':'土',
'刻':'金',
'氓':'土',
'券':'土',
'炒':'土',
'炊':'土',
'炕':'土',
'炎':'火',
'宗':'土',
'定':'土',
'宜':'土',
'宙':'土',
'官':'土',
'空':'土',
'宛':'土',
'房':'土',
'帚':'土',
'屉':'土',
'居':'土',
'届':'土',
'刷':'土',
'屈':'土',
'弧':'土',
'弦':'土',
'承':'土',
'孟':'土',
'孤':'土',
'函':'土',
'妹':'土',
'姑':'土',
'姐':'土',
'姓':'土',
'妮':'土',
'始':'土',
'姆':'土',
'叁':'土',
'毒':'土',
'政':'土',
'卸':'水',
'艽':'土',
'艿':'土',
'汲':'土',
'祁':'土',
'玕':'土',
'抔':'土',
'抃':'土',
'抉':'土',
'兕':'土',
'狄':'土',
'狁':'土',
'羌':'土',
'沅':'水',
'沔':'土',
'沌':'土',
'沏':'土',
'沚':'土',
'汩':'土',
'汨':'土',
'沂':'土',
'汾':'土',
'汴':'土',
'汶':'水',
'沆':'土',
'忡':'土',
'忤':'土',
'忻':'土',
'忪':'土',
'忭':'土',
'忸':'土',
'姒':'土',
'盂':'土',
'忝':'土',
'坩':'土',
'坫':'土',
'劼':'土',
'坼':'土',
'坻':'土',
'坨':'土',
'坭':'土',
'坳':'土',
'枇':'土',
'杪':'土',
'杳':'土',
'杵':'土',
'枋':'土',
'杻':'土',
'杷':'土',
'杼':'土',
'矸':'土',
'刳':'土',
'奄':'土',
'殁':'土',
'盱':'土',
'昊':'火',
'杲':'土',
'昃':'土',
'咂':'土',
'呸':'土',
'昕':'火',
'昀':'火',
'旻':'火',
'昉':'土',
'炅':'土',
'咔':'土',
'畀':'土',
'咀':'土',
'呷':'土',
'呱':'土',
'呤':'土',
'咚':'土',
'咆':'土',
'呶':'土',
'呣':'土',
'呦':'土',
'岢':'土',
'岬':'土',
'岫':'土',
'帙':'土',
'岣':'土',
'峁':'土',
'岷':'土',
'帔':'土',
'沓':'土',
'囹':'土',
'牦':'土',
'竺':'土',
'佶':'土',
'佬':'土',
'佰':'木',
'侑':'土',
'侉':'土',
'臾':'土',
'岱':'土',
'侗':'土',
'侃':'土',
'侏':'土',
'佻':'土',
'佾':'土',
'佼':'土',
'佯':'土',
'帛':'土',
'阜':'土',
'侔':'土',
'徂':'土',
'剁':'土',
'咎':'土',
'炙':'土',
'冽':'土',
'冼':'土',
'庖':'土',
'疝':'土',
'兖':'土',
'妾':'土',
'劾':'土',
'炖':'土',
'炘':'火',
'炔':'土',
'宕':'土',
'穹':'土',
'宓':'土',
'戾':'土',
'戽':'土',
'戕':'土',
'孢':'土',
'亟':'土',
'妲':'土',
'妯':'土',
'姗':'土',
'帑':'土',
'弩':'土',
'孥':'土',
'虱':'土',
'甾':'土',
'呲':'土',
'戋':'土',
'戔':'土',
'玒':'土',
'玓':'土',
'玘':'土',
'扽':'土',
'扺':'土',
'岠':'土',
'狃':'土',
'汧':'土',
'汫':'土',
'沘':'土',
'汭':'土',
'沇':'土',
'忮':'土',
'忳':'土',
'忺':'土',
'坥':'土',
'坰':'土',
'坬':'土',
'坽':'土',
'弆':'土',
'耵':'土',
'枅':'土',
'枘':'土',
'枍':'土',
'矼':'土',
'矻':'土',
'匼':'土',
'旿':'土',
'昇':'土',
'昄':'土',
'昒':'土',
'昈':'土',
'咉':'土',
'咇':'土',
'咍':'土',
'岵':'土',
'岨':'土',
'岞':'土',
'峂':'土',
'囷':'土',
'牥':'土',
'佴':'土',
'垈':'土',
'侁':'土',
'佸':'土',
'佺':'土',
'隹':'土',
'侂':'土',
'佽':'土',
'侘':'土',
'舠':'土',
'攽':'土',
'忞':'土',
'於':'土',
'炌':'土',
'炆':'土',
'穸':'土',
'弢':'土',
'弨':'土',
'卺':'土',
'妭':'土',
'姈':'土',
'叕':'土',
'艾':'木',
'並':'土',
'枊':'土',
'侒':'土',
'坺':'土',
'扷':'土',
'岰':'土',
'坢':'土',
'姅':'土',
'朌':'土',
'岥':'土',
'昁':'土',
'汳':'土',
'帗':'土',
'犻':'土',
'瓝':'土',
'併':'土',
'幷':'土',
'妼':'土',
'屄':'土',
'枈':'土',
'毞':'土',
'畁':'土',
'歨':'土',
'丳':'土',
'斺':'土',
'呫':'土',
'扱':'土',
'秅':'土',
'尙':'土',
'镸':'土',
'虰':'土',
'侙':'土',
'卶':'土',
'呞':'土',
'彽':'土',
'汦':'土',
'沖':'土',
'杽':'土',
'豖':'土',
'玔':'土',
'刱':'土',
'牀':'土',
'杶':'土',
'旾':'土',
'庛':'土',
'呾':'土',
'咑':'土',
'忰':'土',
'侟':'土',
'忩':'土',
'帒':'土',
'抌':'土',
'沊':'土',
'呧':'土',
'奃':'土',
'弤':'土',
'虭':'土',
'艼':'土',
'妬':'土',
'枓':'土',
'刴':'土',
'呝':'土',
'妸':'土',
'枙':'土',
'妿':'土',
'侕':'土',
'刵':'土',
'佱':'土',
'姂':'土',
'犿':'土',
'籵':'土',
'昘':'土',
'汸':'土',
'坲':'土',
'侅':'土',
'竎':'土',
'昐':'土',
'枌':'土',
'炃':'土',
'咈':'土',
'坿':'土',
'姇':'土',
'岪':'土',
'弣':'土',
'抙':'土',
'彿':'土',
'枎':'土',
'阝':'土',
'姏':'土',
'汵':'土',
'皯':'土',
'盰':'土',
'疘':'土',
'牨':'土',
'佮':'土',
'匌':'土',
'牫':'土',
'刯':'土',
'侊':'土',
'糼':'土',
'糿':'土',
'坸':'土',
'抇':'土',
'炗':'土',
'炚':'土',
'炛':'土',
'佹':'土',
'昋':'土',
'囶':'土',
'呺':'土',
'厒':'土',
'咊':'土',
'佫':'土',
'姀':'土',
'佷':'土',
'斻':'土',
'汻':'土',
'杹':'土',
'呴':'土',
'犼':'土',
'佪':'土',
'宖':'土',
'沗':'土',
'汯':'土',
'瓨':'土',
'垀':'土',
'曶':'土',
'枑':'土',
'沍':'土',
'叀':'土',
'忶':'土',
'沎':'土',
'忣':'土',
'艻':'土',
'忦':'土',
'扴':'土',
'冿':'土',
'芁':'土',
'兓':'土',
'枃':'土',
'屆':'土',
'扻':'土',
'昅':'土',
'毑':'土',
'疌':'土',
'汬':'土',
'畂':'土',
'舏':'土',
'弡':'土',
'決':'土',
'匊':'土',
'姖':'土',
'抅':'土',
'劵':'土',
'呟':'土',
'奆':'土',
'汮':'土',
'炏':'土',
'忼':'土',
'犺':'土',
'肎':'土',
'劶':'土',
'刲':'土',
'劻':'土',
'岲':'土',
'忹':'土',
'抂':'土',
'狅':'土',
'竻':'土',
'岦':'土',
'炓':'土',
'劽':'土',
'夌':'土',
'岺':'土',
'彾':'土',
'坴':'土',
'侓':'土',
'帓':'土',
'盳':'土',
'冐':'土',
'枆':'土',
'侎':'土',
'沒':'土',
'甿':'土',
'冞':'土',
'沕':'土',
'劺':'土',
'姄':'土',
'忟':'土',
'旼':'土',
'佲':'土',
'妺':'土',
'歾':'土',
'歿':'土',
'坶':'土',
'炑':'土',
'妳':'土',
'枏':'土',
'抐':'土',
'秊':'土',
'汼':'土',
'炄':'土',
'沜':'土',
'炍':'土',
'炐':'土',
'奅':'土',
'岯':'土',
'呯':'土',
'呠':'土',
'炋':'土',
'岶':'土',
'尀':'土',
'咅':'土',
'亝':'土',
'呮':'土',
'忯':'土',
'炁':'土',
'盵':'土',
'冾':'土',
'忴':'土',
'扲':'土',
'欦':'土',
'臤':'土',
'斨':'土',
'抋':'土',
'昑':'土',
'夝':'土',
'靑':'土',
'坵':'土',
'肍':'土',
'虯':'土',
'呥':'土',
'姌':'土',
'呿':'土',
'岴':'土',
'汱':'土',
'甽':'土',
'囸':'土',
'氜':'土',
'沑':'土',
'侞':'土',
'姍':'土',
'呩':'土',
'旹':'土',
'妽':'土',
'扟':'土',
'矤':'土',
'籶':'土',
'杸':'土',
'孠':'土',
'杫':'土',
'枀':'土',
'囼':'土',
'坮':'土',
'孡':'土',
'忲':'土',
'坣':'土',
'匋':'土',
'屇':'土',
'岧':'土',
'岹':'土',
'芀':'土',
'耓':'土',
'庝':'土',
'妵':'土',
'旽':'土',
'咃':'土',
'岮':'土',
'矺':'土',
'劸':'土',
'妴':'土',
'忨':'土',
'抏':'土',
'杬':'土',
'呡':'土',
'抆':'土',
'忢':'土',
'矹':'土',
'卥':'土',
'呬':'土',
'忥':'土',
'疜':'土',
'枂':'土',
'臥':'土',
'咁':'土',
'妶':'土',
'杴':'土',
'秈':'土',
'臽':'土',
'佭':'土',
'効':'土',
'杺':'土',
'枔':'土',
'侀':'土',
'忷':'土',
'昍':'土',
'侐':'土',
'卹':'土',
'姁':'土',
'汿':'土',
'沀':'土',
'疞':'土',
'侚':'土',
'畃':'土',
'亞':'土',
'厓':'土',
'枒':'土',
'犽':'土',
'枖':'土',
'殀':'土',
'乴':'土',
'坹':'土',
'岤':'土',
'乵':'土',
'抁':'土',
'昖':'土',
'牪':'土',
'坱':'土',
'姎':'土',
'劷':'土',
'岟':'土',
'侇':'土',
'呭':'土',
'呹':'土',
'炈':'土',
'秇':'土',
'侌':'土',
'斦':'土',
'犾':'土',
'沋':'土',
'忬':'土',
'欥':'土',
'玗':'土',
'穻':'土',
'抈':'土',
'礿':'土',
'抎':'土',
'枟':'土',
'沞':'土',
'戝':'土',
'昗':'土',
'妱':'土',
'巶':'土',
'枛':'土',
'歽':'土',
'姃':'土',
'抍':'土',
'爭':'土',
'糽':'土',
'厔':'土',
'坧':'土',
'垁':'土',
'妷':'土',
'汥':'土',
'汷':'土',
'狆':'土',
'炂':'土',
'侜':'土',
'呪':'土',
'疛':'土',
'坾':'土',
'宔':'土',
'沝':'土',
'妰':'土',
'呰':'土',
'姉':'土',
'姕':'土',
'秄':'土',
'矷':'土',
'岝':'土',
'飞':'金',
'飛':'金',
'风':'金',
'風':'金',
'计':'金',
'計':'金',
'帅':'金',
'帥':'金',
'芋':'金',
'芒':'金',
'页':'金',
'頁':'金',
'轨':'金',
'軌':'金',
'贞':'金',
'貞':'金',
'则':'金',
'則':'金',
'後':'金',
'负':'金',
'負':'金',
'军':'金',
'軍':'金',
'红':'金',
'紅':'金',
'约':'金',
'約':'金',
'纪':'水',
'紀':'金',
'纫':'金',
'紉':'金',
'拒':'金',
'克':'金',
'剋':'金',
'肖':'金',
'肝':'水',
'肛':'金',
'肚':'金',
'肘':'金',
'系':'金',
'係':'金',
'泛':'金',
'罕':'金',
'劲':'火',
'勁':'金',
'玩':'金',
'玫':'金',
'抹':'金',
'拓':'金',
'拔':'金',
'押':'金',
'抽':'金',
'拐':'金',
'拖':'金',
'拍':'金',
'拆':'金',
'拎':'金',
'抵':'金',
'拘':'金',
'抱':'金',
'拄':'金',
'拉':'金',
'拌':'金',
'拂':'金',
'拙':'金',
'招':'金',
'披':'金',
'抬':'金',
'拇':'金',
'拗':'金',
'奔':'金',
'哎':'金',
'侠':'金',
'俠':'金',
'狐':'金',
'狗':'金',
'炬':'火',
'沫':'金',
'法':'金',
'泄':'金',
'沽':'金',
'河':'水',
'沾':'金',
'泪':'金',
'沮':'金',
'油':'金',
'泊':'金',
'沿':'金',
'泡':'金',
'注':'金',
'泣':'金',
'泌':'金',
'泳':'金',
'泥':'金',
'沸':'金',
'沼':'金',
'波':'水',
'治':'金',
'怔':'金',
'怯':'金',
'怖':'金',
'性':'金',
'怕':'金',
'怪':'金',
'怡':'火',
'衫':'火',
'祈':'火',
'建':'水',
'契':'金',
'奏':'金',
'春':'金',
'型':'金',
'封':'金',
'垮':'金',
'赴':'金',
'哉':'金',
'垢':'金',
'垛':'金',
'某':'金',
'甚':'金',
'革':'金',
'巷':'金',
'故':'金',
'南':'金',
'柑':'木',
'枯':'金',
'柄':'木',
'相':'金',
'查':'木',
'柏':'木',
'栅':'金',
'柳':'木',
'柱':'木',
'柿':'金',
'勃':'金',
'要':'金',
'柬':'木',
'咸':'金',
'威':'金',
'歪':'金',
'厘':'金',
'厚':'金',
'砌':'金',
'砂':'金',
'泵':'金',
'砍':'金',
'耐':'金',
'耍':'金',
'殃':'金',
'皆':'金',
'韭':'金',
'虐':'金',
'省':'金',
'削':'金',
'昧':'金',
'盹':'金',
'是':'金',
'盼':'金',
'哇':'金',
'哄':'金',
'冒':'金',
'映':'火',
'星':'火',
'昨':'金',
'咧':'金',
'昭':'火',
'畏':'金',
'趴':'金',
'界':'金',
'虹':'金',
'思':'火',
'品':'金',
'咽':'金',
'咱':'金',
'哈':'金',
'哆':'金',
'咬':'金',
'咳':'金',
'咪':'金',
'炭':'金',
'幽':'金',
'缸':'金',
'拜':'金',
'看':'金',
'怎':'金',
'牲':'金',
'秒':'金',
'香':'金',
'秋':'金',
'科':'金',
'重':'金',
'竿':'金',
'段':'金',
'便':'金',
'俏':'金',
'保':'金',
'促':'金',
'俄':'金',
'俐':'金',
'侮':'金',
'俗':'金',
'俘':'金',
'信':'土',
'皇':'金',
'泉':'水',
'侵':'金',
'禹':'金',
'侯':'金',
'俊':'土',
'盾':'金',
'待':'金',
'徊':'金',
'衍':'金',
'律':'金',
'很':'金',
'叙':'水',
'食':'金',
'盆':'金',
'勉':'金',
'怨':'金',
'急':'金',
'哀':'金',
'亭':'金',
'亮':'金',
'度':'土',
'疫':'金',
'疤':'金',
'咨':'金',
'姿':'金',
'音':'金',
'帝':'金',
'施':'水',
'美':'金',
'姜':'金',
'叛':'水',
'籽':'金',
'前':'金',
'首':'金',
'炸':'金',
'炮':'金',
'炫':'火',
'剃':'金',
'柒':'木',
'染':'金',
'宣':'金',
'宦':'金',
'室':'土',
'突':'金',
'穿':'金',
'客':'金',
'冠':'水',
'扁':'金',
'既':'金',
'屋':'金',
'屏':'金',
'屎':'金',
'眉':'金',
'孩':'金',
'娃':'金',
'姥':'金',
'姨':'金',
'姻':'金',
'姚':'金',
'怒':'火',
'架':'木',
'盈':'金',
'勇':'金',
'怠':'金',
'癸':'金',
'柔':'木',
'泰':'金',
'柴':'金',
'韦':'金',
'韋':'金',
'闩':'水',
'閂':'金',
'讣':'金',
'訃':'金',
'芊':'木',
'芍':'木',
'芄':'木',
'芑':'木',
'芎':'金',
'厍':'金',
'厙':'金',
'钇':'金',
'釔':'金',
'纡':'金',
'紆':'金',
'纣':'金',
'紂':'金',
'纥':'金',
'紇':'金',
'纨':'金',
'紈':'金',
'肟':'金',
'肓':'金',
'泐':'金',
'刭':'金',
'剄':'金',
'玡':'金',
'玭':'金',
'玠':'金',
'玢':'金',
'玥':'土',
'玦':'金',
'抨':'金',
'拤':'金',
'拈':'金',
'抻':'金',
'拃':'金',
'拊':'金',
'抿':'金',
'耶':'金',
'罔':'金',
'瓮':'金',
'狙':'金',
'狎':'金',
'狍':'金',
'狒':'金',
'泔':'金',
'沭':'金',
'泱':'金',
'泅':'金',
'泗':'金',
'泠':'水',
'泖':'金',
'泫':'金',
'泮':'金',
'沱':'金',
'泯':'金',
'泓':'水',
'怙':'金',
'怵':'金',
'怦':'金',
'怛':'金',
'怏':'金',
'怍':'金',
'怩':'金',
'怫':'金',
'衩':'金',
'祆':'金',
'祉':'金',
'祇':'金',
'垣':'土',
'垤':'金',
'赳':'金',
'垌':'金',
'垧':'金',
'垓':'金',
'垠':'金',
'柰':'木',
'柯':'木',
'柘':'木',
'柩':'金',
'枰':'金',
'柙':'金',
'枵':'金',
'柚':'木',
'枳':'金',
'柞':'木',
'柝':'金',
'栀':'金',
'柢':'木',
'枸':'木',
'柈':'金',
'柁':'金',
'枷':'木',
'剌':'金',
'酊':'金',
'甭':'金',
'砘':'金',
'砒':'金',
'斫':'金',
'奎':'金',
'耷':'金',
'虺':'金',
'殂':'金',
'殄':'金',
'殆':'金',
'毖':'金',
'尜':'金',
'哐':'金',
'眄':'金',
'眍':'金',
'眇':'金',
'眊':'金',
'眈':'金',
'禺':'金',
'哂':'金',
'咴':'金',
'曷':'金',
'昴':'金',
'昱':'火',
'昵':'金',
'咦':'金',
'畎':'土',
'毗':'金',
'畋':'金',
'畈':'土',
'虼':'金',
'虻':'金',
'盅':'金',
'咣':'金',
'咻':'金',
'囿':'金',
'咿':'金',
'哌':'金',
'哚':'金',
'咯':'金',
'咩':'金',
'咤':'金',
'哏':'金',
'哞':'金',
'峙':'金',
'峒':'金',
'峋':'金',
'峥':'土',
'氡':'金',
'氟':'金',
'牯':'金',
'秕':'金',
'竽':'金',
'俅':'金',
'垡':'金',
'牮':'金',
'俣':'金',
'俚':'金',
'皈':'金',
'俑':'金',
'俟':'金',
'徇':'金',
'徉':'金',
'舢':'金',
'俞':'金',
'俎':'金',
'爰':'金',
'朐':'金',
'匍':'金',
'訇':'金',
'昝':'金',
'弈':'金',
'奕':'火',
'庥':'金',
'疣':'金',
'疥':'金',
'庠':'金',
'竑':'金',
'彦':'金',
'羑':'金',
'籼':'金',
'酋':'金',
'炳':'火',
'炻':'金',
'炯':'火',
'烀':'金',
'炷':'金',
'宥':'金',
'扃':'金',
'昶':'金',
'咫':'金',
'弭':'金',
'牁':'金',
'姮':'金',
'姝':'金',
'姣':'金',
'姘':'金',
'姹':'金',
'羿':'金',
'炱':'金',
'矜':'金',
'芏':'金',
'芃':'木',
'钆':'金',
'釓':'金',
'伣':'金',
'俔':'金',
'呙':'金',
'咼':'金',
'岍':'金',
'玤':'金',
'玞':'金',
'玟':'金',
'侹':'金',
'狉':'金',
'泙':'金',
'沺':'金',
'泂':'金',
'泜':'金',
'泃':'金',
'泇':'金',
'怊':'金',
'祋':'金',
'祊':'金',
'砉':'金',
'耔':'金',
'垚':'金',
'垙':'金',
'垍':'金',
'垎':'金',
'垴':'金',
'垟':'金',
'垞':'金',
'垵':'金',
'垏':'金',
'柷':'金',
'柃':'金',
'柊':'金',
'枹':'金',
'栐':'金',
'柖':'金',
'剅':'金',
'厖':'金',
'砆':'金',
'砑':'金',
'砄':'金',
'耏':'金',
'奓':'金',
'昺':'金',
'盷':'金',
'咡':'金',
'咺':'金',
'昳':'金',
'昣':'金',
'昤':'金',
'昫':'金',
'昡':'金',
'咥':'金',
'昪':'金',
'虷':'金',
'虸':'金',
'哃':'金',
'峘':'金',
'耑':'金',
'峛':'金',
'峗':'金',
'帡':'金',
'矧':'金',
'俜':'金',
'俙':'金',
'俍':'金',
'垕':'金',
'衎':'金',
'弇':'金',
'侴':'金',
'朏':'金',
'訄':'金',
'庤':'金',
'疢':'金',
'炣':'金',
'炟':'金',
'窀':'金',
'扂':'金',
'叚':'金',
'娀':'金',
'姞':'金',
'姱':'金',
'姤':'金',
'姶':'金',
'姽':'金',
'枲':'金',
'彖':'金',
'畖':'金',
'紃':'金',
'彥':'金',
'怉':'金',
'峎':'金',
'峖':'金',
'峇':'金',
'柭':'金',
'癹':'金',
'炦':'金',
'柪':'金',
'狕':'金',
'怑':'金',
'瓪':'金',
'泍':'金',
'昹':'金',
'柸':'金',
'盃':'金',
'拚':'金',
'玣':'金',
'侼':'金',
'敀':'金',
'狛':'金',
'肑':'金',
'怲':'金',
'抦':'金',
'昞':'金',
'怭':'金',
'怶':'金',
'柀':'金',
'柲':'金',
'疪':'金',
'抪':'金',
'柨':'金',
'匨':'金',
'柵':'金',
'芆':'金',
'肞':'金',
'紁':'金',
'臿':'金',
'欩':'金',
'牊':'金',
'侱':'金',
'泟':'金',
'爯':'金',
'肜':'金',
'勅':'金',
'垑':'金',
'姼':'金',
'抶':'金',
'竾':'金',
'肔':'金',
'怞':'金',
'牰':'金',
'拀':'金',
'欪':'金',
'泏':'金',
'竐':'金',
'舡':'金',
'垐':'金',
'柌':'金',
'怚':'金',
'羍':'金',
'疩':'金',
'怱':'金',
'剉':'金',
'侳':'金',
'柋':'金',
'柦':'金',
'狚':'金',
'玬':'金',
'瓭':'金',
'砃':'金',
'哋':'金',
'怟':'金',
'拞':'金',
'牴':'金',
'虳':'金',
'峌':'金',
'柣':'金',
'姛':'金',
'峝':'金',
'昸':'金',
'敁':'金',
'屌':'金',
'盄':'金',
'訂':'金',
'垖':'金',
'垜':'金',
'尮':'金',
'柮':'金',
'柂':'金',
'沲':'金',
'炧':'金',
'炨':'金',
'咢':'金',
'咹':'金',
'峉':'金',
'砈':'金',
'砐':'金',
'峏':'金',
'峜':'金',
'沷':'金',
'疺':'金',
'柉':'金',
'瓬':'金',
'眆':'金',
'姟':'金',
'峐':'金',
'昲':'金',
'砏':'金',
'秎':'金',
'俌':'金',
'俛':'金',
'垘':'金',
'峊':'金',
'怤':'金',
'柎':'金',
'柫':'金',
'泭':'金',
'炥':'金',
'畐':'金',
'畉':'金',
'乹':'金',
'芉':'金',
'衦':'金',
'勂':'金',
'叝':'金',
'牱':'金',
'肐':'金',
'剆':'金',
'畊':'金',
'秔':'金',
'凬':'金',
'盽':'金',
'玜':'金',
'羾':'金',
'怘':'金',
'柧':'金',
'泒':'金',
'柺':'金',
'泴':'金',
'俇':'金',
'姯':'金',
'垝':'金',
'攱':'金',
'咶':'金',
'圀':'金',
'侾':'金',
'昦':'金',
'秏':'金',
'峆':'金',
'抲':'金',
'柇':'金',
'籺':'金',
'凾':'金',
'炶':'金',
'姡':'金',
'矦':'金',
'娂':'金',
'奐':'金',
'肒':'金',
'怳':'金',
'衁':'金',
'泘':'金',
'芐':'金',
'廻':'水',
'沬':'金',
'泋':'金',
'芔':'金',
'俒':'金',
'昬':'金',
'咟':'金',
'卽':'水',
'哜':'金',
'咭':'金',
'姫':'金',
'泲':'金',
'拁':'金',
'抸':'金',
'毠':'金',
'姦':'金',
'姧':'金',
'玪':'金',
'訆':'金',
'觔':'金',
'抾':'金',
'畍':'金',
'砎':'金',
'亰':'金',
'俓':'金',
'穽':'金',
'侰':'金',
'柾':'金',
'觓':'金',
'泬':'金',
'玨':'金',
'疦':'金',
'侷':'金',
'怇':'金',
'柤':'金',
'昛':'金',
'歫':'金',
'泦':'金',
'狊':'金',
'姢':'金',
'帣':'金',
'姰':'金',
'奒':'金',
'砊':'金',
'勀':'金',
'怐':'金',
'敂':'金',
'俈':'金',
'咵':'金',
'尯':'金',
'匩':'金',
'況':'金',
'勆':'金',
'柆':'金',
'咾':'金',
'窂':'金',
'沴':'金',
'砅':'金',
'赲':'金',
'姴':'金',
'朎':'金',
'狑':'金',
'炩':'金',
'斿':'金',
'峍':'金',
'峈':'金',
'覙':'金',
'閁':'金',
'笀':'金',
'柕':'金',
'抺':'金',
'玧':'金',
'峚':'金',
'沵':'金',
'芇':'金',
'敄':'金',
'勄':'金',
'怋':'金',
'敃':'金',
'盿':'金',
'砇':'金',
'玅':'金',
'姳':'金',
'眀':'金',
'帞':'金',
'尛':'金',
'枺':'金',
'昩':'金',
'峔':'金',
'牳':'金',
'畆':'金',
'拏':'金',
'廼':'水',
'侽':'金',
'抩':'金',
'柟':'金',
'怓':'金',
'抳':'金',
'柅':'金',
'狋':'金',
'狔':'金',
'籾':'金',
'姩':'金',
'枿':'金',
'皅':'金',
'俖':'金',
'牉':'金',
'眅':'金',
'拋':'金',
'炰':'金',
'爮':'金',
'姵':'金',
'怌':'金',
'斾':'金',
'昢':'金',
'竼':'金',
'瓫':'金',
'抷':'金',
'毘':'金',
'狓':'金',
'咠':'金',
'疧':'金',
'帢':'金',
'拑':'金',
'匧':'金',
'甠':'金',
'秌':'金',
'訅':'金',
'卻':'金',
'斪':'金',
'姾':'金',
'弮':'金',
'峑':'金',
'辸':'金',
'姙':'金',
'肕':'金',
'帤':'金',
'肗':'金',
'盶':'金',
'耎':'金',
'泧':'金',
'俕':'金',
'穼':'金',
'姠':'金',
'殅':'金',
'泩':'金',
'狌':'金',
'虵':'金',
'兘':'金',
'冟':'金',
'宩':'金',
'屍':'金',
'峕':'金',
'昰':'金',
'枾':'金',
'眂':'金',
'垨':'金',
'侺':'金',
'姺':'金',
'昚':'金',
'柛':'金',
'籸':'金',
'侸':'金',
'俆':'金',
'兪':'金',
'凁':'金',
'咰':'金',
'怷':'金',
'枱':'木',
'柶':'金',
'泀':'金',
'泤':'金',
'牭':'金',
'柗':'金',
'叜':'金',
'泝':'金',
'芕':'金',
'炲':'金',
'咷':'金',
'厗':'金',
'庣':'金',
'宨':'金',
'怗':'金',
'邒':'金',
'炵':'金',
'怢':'金',
'侻':'金',
'俀':'金',
'拕':'金',
'沰':'金',
'狏':'金',
'徍':'金',
'峞':'金',
'昷':'金',
'俉':'金',
'卼':'金',
'玝':'金',
'徆':'金',
'怬':'金',
'怸':'金',
'扸':'金',
'盻':'金',
'炠':'金',
'疨':'金',
'咞':'金',
'姭':'金',
'枮':'金',
'祅':'金',
'亯':'金',
'咲':'金',
'垥':'金',
'祄':'金',
'盺':'金',
'哅':'金',
'怰':'金',
'怴':'金',
'欨':'金',
'芌':'金',
'抭':'金',
'柼':'金',
'穾':'金',
'泶':'金',
'狘':'金',
'兗':'金',
'匽':'金',
'姲':'金',
'姸':'金',
'抰':'金',
'昜':'金',
'柍':'金',
'炴':'金',
'羏':'金',
'俋':'金',
'峓':'金',
'帠':'金',
'庡':'金',
'巸':'金',
'帟':'金',
'弬':'金',
'怈':'金',
'抴':'金',
'枻':'金',
'沶':'金',
'泆':'金',
'芅':'金',
'衪':'金',
'枼':'金',
'枽':'金',
'矨':'金',
'勈':'金',
'柡':'金',
'哊':'金',
'姷':'金',
'峟':'金',
'怮':'金',
'怣':'金',
'泑':'金',
'狖':'金',
'俁':'金',
'秗':'金',
'虶':'金',
'衧':'金',
'剈':'金',
'肙':'金',
'貟':'金',
'畇':'金',
'眃':'金',
'秐':'金',
'沯':'金',
'泎':'金',
'夈':'金',
'抯':'金',
'虴':'金',
'垗':'金',
'炤':'火',
'砓':'金',
'籷':'金',
'侲':'金',
'弫':'金',
'抮':'金',
'炡':'金',
'姪':'金',
'庢':'金',
'抧':'金',
'砋':'金',
'秓':'金',
'秖':'金',
'芖':'金',
'泈':'金',
'祌':'金',
'冑':'金',
'咮':'金',
'壴':'金',
'殶':'金',
'炢':'金',
'笁':'金',
'孨':'金',
'壵':'金',
'炪':'金',
'芓':'金',
'昮':'金',
'爼':'金',
'个':'水',
'個':'水',
'马':'水',
'馬':'水',
'气':'水',
'氣':'水',
'仓':'水',
'倉':'水',
'乌':'水',
'烏':'水',
'鬥':'水',
'订':'水',
'釘':'水',
'书':'水',
'書':'水',
'只':'水',
'衹':'水',
'隻':'水',
'们':'水',
'們':'水',
'闪':'水',
'閃':'水',
'讨':'水',
'討':'水',
'训':'水',
'訓':'水',
'讯':'金',
'訊':'水',
'记':'水',
'記':'水',
'迂':'水',
'芝':'木',
'师':'水',
'師':'水',
'岂':'水',
'豈':'水',
'刚':'金',
'剛':'水',
'迄':'水',
'伦':'土',
'倫':'水',
'迅':'水',
'孙':'水',
'孫':'水',
'级':'水',
'級':'水',
'贡':'水',
'貢':'水',
'坝':'水',
'垻':'水',
'芙':'木',
'芽':'木',
'花':'木',
'芹':'水',
'芥':'木',
'芬':'木',
'芳':'木',
'芯':'木',
'芭':'木',
'轩':'金',
'軒':'水',
'时':'水',
'時':'水',
'员':'水',
'員':'水',
'财':'水',
'財':'金',
'针':'水',
'針':'水',
'钉':'水',
'岛':'水',
'島':'水',
'冻':'水',
'凍':'水',
'亩':'水',
'畝':'水',
'库':'土',
'庫':'水',
'纯':'水',
'純':'水',
'纱':'水',
'紗':'水',
'纳':'水',
'納':'水',
'纷':'水',
'紛':'水',
'纸':'水',
'紙':'水',
'纹':'水',
'紋':'水',
'纺':'水',
'紡':'水',
'纽':'水',
'紐':'水',
'者':'水',
'肯':'水',
'径':'水',
'徑':'水',
'肴':'水',
'肺':'水',
'肢':'水',
'股':'水',
'肪':'水',
'肥':'水',
'育':'水',
'肩':'水',
'玷':'水',
'珍':'土',
'玲':'土',
'珊':'土',
'玻':'土',
'拭':'水',
'挂':'水',
'持':'金',
'拷':'水',
'拱':'水',
'挎':'水',
'城':'土',
'拽':'水',
'括':'水',
'拴':'水',
'拾':'水',
'挑':'水',
'指':'水',
'挣':'水',
'拼':'水',
'挖':'水',
'按':'水',
'拯':'水',
'眨':'水',
'哪':'水',
'峡':'土',
'峽':'水',
'骨':'水',
'矩':'水',
'俩':'水',
'倆':'水',
'修':'土',
'鬼':'水',
'狮':'水',
'狰':'水',
'狡':'水',
'狠':'水',
'庭':'土',
'差':'水',
'洪':'水',
'洞':'水',
'洗':'水',
'活':'水',
'派':'水',
'洽':'水',
'洛':'水',
'洋':'水',
'洲':'水',
'津':'水',
'恃':'水',
'恒':'火',
'恢':'水',
'恍':'水',
'恬':'水',
'恤':'水',
'恰':'水',
'恨':'水',
'宫':'土',
'祖':'水',
'神':'水',
'祝':'火',
'祠':'水',
'娜':'水',
'蚤':'水',
'耕':'水',
'耘':'水',
'耗':'水',
'耙':'水',
'秦':'水',
'素':'水',
'匪':'水',
'栽':'水',
'埂':'水',
'起':'水',
'埋':'水',
'袁':'水',
'哲':'水',
'恐':'水',
'埃':'水',
'耻':'水',
'耿':'水',
'耽':'水',
'恭':'水',
'晋':'水',
'真':'水',
'框':'水',
'桂':'木',
'桔':'木',
'栖':'水',
'桐':'木',
'株':'木',
'栓':'水',
'桃':'木',
'格':'水',
'校':'水',
'核':'水',
'根':'水',
'索':'水',
'哥':'水',
'栗':'水',
'酌':'水',
'配':'水',
'翅':'水',
'辱':'水',
'唇':'水',
'夏':'水',
'砸':'水',
'砰':'水',
'破':'水',
'原':'水',
'套':'水',
'烈':'水',
'殊':'水',
'殉':'水',
'桌':'水',
'眠':'水',
'哮':'水',
'晃':'火',
'哺':'水',
'晌':'水',
'剔':'水',
'蚌':'水',
'畔':'水',
'蚣':'水',
'蚊':'水',
'蚪':'水',
'蚓':'水',
'哨':'水',
'哩':'水',
'圃':'水',
'哭':'水',
'哦':'水',
'恩':'火',
'唤':'水',
'唁':'水',
'哼':'水',
'唧':'水',
'唉':'水',
'唆':'水',
'峭':'水',
'峨':'土',
'峰':'土',
'峻':'土',
'缺':'水',
'氧':'水',
'氨':'水',
'特':'水',
'乘':'水',
'秤':'水',
'租':'水',
'秧':'水',
'秩':'水',
'秘':'水',
'笑':'水',
'笋':'水',
'值':'水',
'倚':'水',
'俺':'水',
'倒':'水',
'倘':'水',
'俱':'水',
'倡':'水',
'候':'水',
'俯':'水',
'倍':'水',
'倦':'水',
'臭':'水',
'射':'水',
'躬':'水',
'息':'水',
'倔':'水',
'徒':'水',
'徐':'水',
'殷':'水',
'般':'水',
'航':'水',
'拿':'水',
'爹':'水',
'舀':'水',
'豺':'水',
'豹':'水',
'翁':'水',
'留':'水',
'凌':'水',
'凄':'水',
'衰':'水',
'衷':'水',
'高':'水',
'席':'水',
'座':'土',
'病':'水',
'疾':'水',
'疹':'水',
'疼':'水',
'疲':'水',
'效':'水',
'紊':'水',
'唐':'水',
'凉':'水',
'站':'水',
'剖':'金',
'旁':'水',
'旅':'水',
'畜':'水',
'羔':'水',
'拳':'金',
'粉':'水',
'料':'水',
'益':'水',
'兼':'水',
'烤':'水',
'烘':'水',
'烟':'火',
'烙':'水',
'酒':'水',
'流':'水',
'害':'土',
'家':'土',
'宵':'土',
'宴':'土',
'窄':'水',
'容':'土',
'宰':'土',
'案':'水',
'扇':'水',
'冥':'水',
'冤':'水',
'剥':'金',
'展':'水',
'屑':'水',
'弱':'水',
'祟':'水',
'娱':'水',
'娟':'水',
'恕':'水',
'娥':'水',
'娘':'水',
'桑':'水',
'邗':'水',
'邛':'水',
'刍':'水',
'芻':'水',
'邙':'水',
'讦':'水',
'訐':'水',
'讧':'水',
'訌':'水',
'讪':'水',
'訕':'水',
'讫':'水',
'訖':'水',
'芨':'水',
'伥':'水',
'倀':'水',
'芫':'木',
'芾':'木',
'芷':'木',
'芮':'木',
'芼':'水',
'芩':'木',
'芪':'木',
'芡':'木',
'芟':'木',
'苄':'木',
'轫':'水',
'軔':'水',
'呗':'水',
'唄':'水',
'岘':'水',
'峴':'水',
'钊':'金',
'釗':'水',
'钋':'水',
'釙':'水',
'钌':'水',
'釕':'水',
'纭':'水',
'紜':'水',
'纰':'水',
'紕':'水',
'纴':'水',
'紝':'水',
'纾':'水',
'紓':'水',
'肼':'水',
'肽':'水',
'肱':'水',
'肫':'水',
'珏':'土',
'珐':'水',
'珂':'土',
'玳':'水',
'珀':'土',
'珉':'土',
'珈':'土',
'拮':'水',
'砭':'土',
'罘':'水',
'秭':'水',
'笈':'水',
'叟':'水',
'瓴':'水',
'狨':'水',
'狩':'水',
'洱':'水',
'洹':'水',
'洧':'水',
'洌':'水',
'洇':'水',
'洄':'水',
'洙':'水',
'洎':'水',
'洫':'水',
'洮':'水',
'洵':'水',
'洳':'水',
'恓':'水',
'恫':'水',
'恂':'水',
'恪':'水',
'衲':'水',
'衽':'水',
'衿':'水',
'袂':'水',
'祛':'水',
'祜':'水',
'祓':'火',
'祚':'水',
'祗':'水',
'耖':'水',
'挈':'水',
'恚':'水',
'埔':'水',
'埕':'水',
'耆':'水',
'耄':'水',
'埒':'水',
'垸':'水',
'盍':'水',
'栲':'水',
'栳':'水',
'桓':'水',
'桎':'水',
'栝':'木',
'桕':'水',
'桁':'木',
'桅':'水',
'栟':'水',
'桉':'水',
'栩':'木',
'彧':'水',
'鬲':'水',
'豇':'水',
'酐':'水',
'厝':'水',
'孬':'水',
'砝':'水',
'砹':'水',
'砧':'水',
'砷':'水',
'砟':'水',
'砼':'水',
'砥':'水',
'砣':'水',
'剞':'水',
'虔':'水',
'眩':'水',
'眙':'水',
'哧':'水',
'哽':'水',
'唔':'水',
'晁':'水',
'晏':'火',
'趵':'水',
'畛':'水',
'蚨':'水',
'蚜':'水',
'蚍':'水',
'蚋':'水',
'蚝':'水',
'蚧':'水',
'圄':'水',
'唣':'水',
'唏':'水',
'盎':'水',
'唑':'水',
'峪':'水',
'氤':'水',
'氦':'水',
'毪':'水',
'舐':'水',
'秣':'水',
'秫':'水',
'盉':'水',
'笊':'水',
'笏':'水',
'笆':'水',
'俸':'水',
'倩':'土',
'俵':'水',
'俳':'水',
'俶':'水',
'倬':'水',
'倏':'水',
'恁':'水',
'倭':'水',
'倪':'水',
'俾':'水',
'倜':'水',
'隼':'水',
'隽':'水',
'倌':'水',
'倥':'水',
'臬':'水',
'皋':'水',
'倨':'水',
'衄':'水',
'舫':'水',
'釜':'水',
'奚':'水',
'衾':'水',
'朕':'水',
'桀':'水',
'凇':'水',
'亳':'水',
'疳':'水',
'疴':'水',
'疸':'水',
'疽':'水',
'疱':'水',
'痂':'水',
'衮':'水',
'凋':'水',
'恣':'水',
'旆':'水',
'旄':'水',
'旃':'水',
'恙':'水',
'粑':'水',
'朔':'水',
'烜':'火',
'烊':'水',
'剡':'水',
'娑':'水',
'宸':'水',
'窈':'水',
'剜':'水',
'冢':'水',
'屐':'水',
'勐':'水',
'奘':'水',
'牂':'水',
'蚩':'水',
'姬':'水',
'娠':'水',
'娌':'水',
'娉':'水',
'娩':'水',
'娣':'水',
'娓':'水',
'畚':'水',
'邕':'水',
'眦':'水',
'疵':'水',
'邘':'水',
'讱':'水',
'訒':'水',
'辿':'水',
'刬':'水',
'剗':'水',
'芰':'水',
'芣':'木',
'苊':'水',
'苉':'水',
'芘':'水',
'芴':'水',
'芠':'水',
'芤':'木',
'轪':'水',
'軑':'水',
'觃':'水',
'覎':'水',
'屃':'水',
'屓':'水',
'纮':'水',
'紘':'水',
'纼':'水',
'紖':'水',
'肭':'水',
'肸':'水',
'肷':'水',
'玶':'水',
'珇':'水',
'珅':'水',
'珋':'水',
'玹':'水',
'珌':'水',
'玿':'水',
'埏':'水',
'挓':'水',
'拶':'水',
'秬':'水',
'俫':'水',
'倈':'水',
'舁':'水',
'洭':'水',
'洘':'水',
'洓':'水',
'洿':'水',
'泚':'水',
'洸':'水',
'洑':'水',
'洢':'水',
'洈':'水',
'洚':'水',
'洺':'水',
'洨':'水',
'洴':'水',
'洣':'水',
'恔':'水',
'宬':'水',
'祏':'水',
'祐':'水',
'祕':'水',
'恝':'水',
'玼':'水',
'埗':'水',
'垾':'水',
'垺':'水',
'埆':'水',
'垿':'水',
'埌':'水',
'埇':'水',
'栻':'木',
'桄':'水',
'栴':'水',
'栒':'水',
'酎':'水',
'酏':'水',
'砵':'水',
'砠':'水',
'砫':'水',
'砬':'水',
'恧':'水',
'翃':'水',
'剕':'水',
'哢':'水',
'晅':'水',
'晊':'水',
'哳':'水',
'哱':'水',
'冔':'水',
'晐':'水',
'蚄':'水',
'蚆':'水',
'崁':'水',
'峿':'水',
'帨':'水',
'崀':'水',
'眚':'水',
'甡':'水',
'倴':'水',
'倮':'水',
'倕':'水',
'倞':'水',
'倓':'水',
'倧':'水',
'衃':'水',
'虒':'水',
'舭':'水',
'舯':'水',
'舥':'水',
'瓞':'水',
'鬯':'水',
'朓':'水',
'虓':'水',
'峱':'水',
'眢':'水',
'勍':'水',
'痄':'水',
'疰':'水',
'痃':'水',
'竘':'水',
'羖':'水',
'羓':'水',
'桊':'水',
'敉':'水',
'烠':'水',
'烔':'水',
'宧':'水',
'窅':'水',
'窊':'水',
'扅':'水',
'扆':'水',
'隺':'水',
'疍':'水',
'烝':'水',
'砮':'水',
'哿':'水',
'翀':'水',
'翂':'水',
'剟':'水',
'訏':'水',
'軏':'水',
'紞':'水',
'娙':'水',
'垹':'水',
'竝':'水',
'挀':'水',
'栢':'水',
'剝':'水',
'宲':'水',
'瓟':'水',
'窇':'水',
'匎':'水',
'洝':'水',
'玵':'水',
'豻':'水',
'哵':'水',
'秡':'水',
'釟':'水',
'芺':'水',
'秚':'水',
'粄':'水',
'肦':'水',
'舨':'水',
'奙':'水',
'娭':'水',
'砨':'水',
'俻':'水',
'窆':'水',
'覍':'水',
'盋':'水',
'髟':'水',
'倂':'水',
'栤':'水',
'眪':'水',
'窉':'水',
'埄':'水',
'笓':'水',
'粃':'水',
'粊':'水',
'肹':'水',
'勏':'水',
'峬':'水',
'庯':'水',
'宷':'水',
'拺':'水',
'敇':'水',
'畟':'水',
'埁':'水',
'笒':'水',
'祡':'水',
'袃':'水',
'訍':'水',
'苂':'水',
'唓':'水',
'烢':'水',
'眧':'水',
'娍':'水',
'峸':'水',
'徎':'水',
'洆':'水',
'屒':'水',
'栕':'水',
'倁':'水',
'勑':'水',
'恀':'水',
'恜':'水',
'恥':'水',
'拸':'水',
'敊':'水',
'欫':'水',
'歭':'水',
'翄':'水',
'蚇':'水',
'衶':'水',
'栦':'水',
'舩':'水',
'剙':'水',
'埀':'水',
'桘':'水',
'芚':'水',
'哾':'水',
'娕':'水',
'娖':'水',
'栨':'木',
'玆':'水',
'珁':'水',
'皉':'水',
'畗':'水',
'倅':'水',
'粋':'水',
'翆':'水',
'紣':'水',
'拵':'水',
'剒':'水',
'夎':'水',
'貣':'水',
'唌':'水',
'耼':'水',
'衴':'水',
'訑':'水',
'釖':'水',
'恴':'水',
'埅':'水',
'埊':'水',
'眡':'水',
'秪':'水',
'恎':'水',
'挕':'水',
'眣':'水',
'倲':'水',
'戙':'水',
'挏':'水',
'痁':'水',
'訋':'水',
'娗':'水',
'剢':'水',
'挅':'水',
'挆':'水',
'桗':'水',
'峩':'水',
'蚅':'水',
'栭':'水',
'栮':'水',
'毦':'水',
'洏':'水',
'栰':'水',
'舧':'水',
'訉':'水',
'軓':'水',
'倣':'水',
'旊':'水',
'哹':'水',
'紑':'水',
'缹':'水',
'俷':'水',
'厞':'水',
'疿':'水',
'砩':'水',
'羒':'水',
'衯':'水',
'蚠':'水',
'蚡':'水',
'娐':'水',
'尃':'水',
'栿':'木',
'玸':'水',
'祔':'水',
'蚥':'水',
'衭':'水',
'倝':'水',
'迀':'水',
'笐':'水',
'峼':'水',
'挌':'水',
'峺':'水',
'峯':'水',
'宮':'水',
'拲':'水',
'栱':'水',
'冓':'水',
'玽':'水',
'痀':'水',
'芶':'水',
'凅':'水',
'唂':'水',
'唃':'水',
'恠':'水',
'烡':'水',
'庪':'水',
'恑':'水',
'哠':'水',
'恏':'水',
'俰':'水',
'哬':'水',
'敆':'水',
'欱':'水',
'狢':'水',
'釛':'水',
'拫':'水',
'哻':'水',
'唅':'水',
'圅':'水',
'娢':'水',
'娨':'水',
'肣':'水',
'苀':'水',
'蚢':'水',
'芲':'水',
'洉':'水',
'恆':'水',
'烆':'水',
'峵':'水',
'晎':'水',
'耾':'水',
'唍':'水',
'狟':'水',
'烉':'水',
'宺':'水',
'晄':'水',
'俿':'水',
'匫':'水',
'恗':'水',
'瓳':'水',
'恛':'水',
'拻':'水',
'洃':'水',
'烣':'水',
'蚘':'水',
'豗':'水',
'倱':'水',
'圂':'水',
'眓':'水',
'秮':'水',
'閄':'水',
'狤':'水',
'皍':'水',
'紒':'水',
'邔':'水',
'唊':'水',
'埉':'水',
'斚':'水',
'玾':'水',
'俴':'水',
'栫':'水',
'洊':'水',
'畕':'水',
'挢':'水',
'挍':'水',
'晈':'水',
'烄':'水',
'笅':'水',
'窌':'水',
'埐':'水',
'晉':'水',
'紟':'水',
'肵':'水',
'倢':'水',
'洯':'水',
'衱':'水',
'衸':'水',
'凈':'水',
'倃':'水',
'紤':'水',
'挗':'水',
'欮':'水',
'芵':'水',
'蚗':'水',
'冣':'水',
'毩':'水',
'洰':'水',
'眗':'水',
'勌':'水',
'埍':'水',
'埈':'水',
'蚐':'水',
'袀':'水',
'欬':'水',
'烗':'水',
'栞':'水',
'粇':'水',
'娔':'水',
'尅':'水',
'砢':'水',
'肻':'水',
'桍':'水',
'秙':'水',
'窋':'水',
'趶':'水',
'晇':'水',
'晆':'水',
'恇':'水',
'眖':'水',
'哴':'水',
'挄':'水',
'哰':'水',
'恅':'水',
'狫':'水',
'哷':'水',
'砳':'水',
'阞':'水',
'洡':'水',
'倰':'水',
'剓':'水',
'唎':'水',
'峲':'水',
'栵':'木',
'栛':'水',
'秜':'水',
'秝':'水',
'挒':'水',
'皊':'水',
'砱':'水',
'秢':'水',
'竛':'水',
'恡':'水',
'竜':'水',
'勎':'水',
'娽':'水',
'釠':'水',
'眿':'水',
'哤':'水',
'庬':'水',
'娏':'水',
'毣':'水',
'眛':'水',
'閅':'水',
'冡':'水',
'眫':'水',
'桙':'水',
'恈':'水',
'洠':'水',
'哶':'水',
'烕':'水',
'眜':'水',
'洦':'水',
'皌':'水',
'砞':'水',
'娒':'水',
'砪':'水',
'蚞':'水',
'挐':'水',
'痆':'水',
'娚':'水',
'畘':'水',
'娞':'水',
'屔':'水',
'眤':'水',
'衵':'水',
'秥':'水',
'拰':'水',
'挊':'水',
'洀':'水',
'肨':'水',
'皰':'水',
'砲':'水',
'娝':'水',
'肧':'水',
'倗':'水',
'恲':'水',
'娦':'水',
'砯':'水',
'秛':'水',
'秠':'水',
'肶':'水',
'烞':'水',
'砶':'水',
'哣':'水',
'倛':'水',
'剘':'水',
'斊':'水',
'旂':'水',
'栔':'水',
'疷':'水',
'芞':'水',
'蚑':'水',
'蚔':'水',
'蚚':'水',
'拪':'水',
'歬':'水',
'茾':'木',
'谸':'水',
'羗':'水',
'帩':'水',
'笉':'水',
'耹':'水',
'蚙':'水',
'凊':'水',
'剠':'水',
'桏':'木',
'唒':'水',
'恘':'水',
'紌':'水',
'釚':'水',
'宭':'水',
'峮':'水',
'帬':'水',
'珃':'水',
'肰':'水',
'蚒':'水',
'蚦':'水',
'衻':'水',
'浀':'水',
'恮':'水',
'洤':'水',
'烇':'水',
'牶':'水',
'牷':'水',
'毧':'水',
'粈':'水',
'栠':'水',
'栣':'水',
'芢':'水',
'桇':'水',
'邚':'水',
'朊':'水',
'毢':'水',
'桒':'水',
'狦':'水',
'邖':'水',
'赸':'水',
'栜':'水',
'粆':'水',
'娋':'水',
'弰':'水',
'恦':'水',
'扄':'水',
'珄':'水',
'烒':'水',
'眎':'水',
'峷':'水',
'眒':'水',
'眘':'水',
'倐':'水',
'洬':'水',
'娰':'水',
'恖':'水',
'肂':'水',
'倯':'水',
'祘':'水',
'笇':'水',
'哸':'水',
'倠':'水',
'狧':'水',
'舦':'水',
'洟':'水',
'倎':'水',
'恌':'水',
'晀':'水',
'祒':'水',
'晍':'水',
'狪':'水',
'紏':'水',
'唋':'水',
'峹':'水',
'庩':'水',
'娧':'水',
'毤':'水',
'砤':'水',
'託':'水',
'倇':'水',
'盌':'水',
'叞':'水',
'烓':'水',
'芛':'水',
'軎':'水',
'肳':'水',
'蚉':'水',
'倵':'水',
'娪':'水',
'粅':'水',
'屖':'水',
'恄':'水',
'欯':'水',
'烚':'水',
'蚟':'水',
'哯':'水',
'垷':'水',
'娊':'水',
'毨':'水',
'烍':'水',
'軐':'水',
'晑':'水',
'栙':'水',
'俲':'水',
'娎':'水',
'宯':'水',
'庨':'水',
'烋':'水',
'奊':'水',
'峫':'水',
'恊':'水',
'拹':'水',
'洩':'水',
'疶':'水',
'衺':'水',
'俽':'水',
'倖':'水',
'垶':'水',
'洐':'水',
'恟':'水',
'洶':'水',
'烌':'水',
'弲':'水',
'欰':'水',
'殈':'水',
'烅':'水',
'芧':'水',
'毥':'水',
'狥':'水',
'訙':'水',
'俹':'水',
'笌':'水',
'倄':'水',
'烑':'水',
'眑':'水',
'桖':'木',
'娫':'水',
'娮':'水',
'眏':'水',
'唈':'水',
'垼':'水',
'恞':'水',
'栘':'水',
'栧':'木',
'桋':'水',
'欭':'水',
'洂':'水',
'浂':'水',
'玴':'水',
'珆':'水',
'瓵':'水',
'貤':'水',
'迆':'水',
'圁':'水',
'垽':'水',
'峾':'水',
'栶':'木',
'洕':'水',
'泿':'水',
'烎':'水',
'訔':'水',
'唀':'水',
'峳':'水',
'庮':'水',
'栯':'水',
'秞':'水',
'肬':'水',
'苃':'水',
'俼':'水',
'娛':'水',
'砡':'水',
'迃':'水',
'酑':'水',
'笎':'水',
'蚖':'水',
'衏':'水',
'恱':'水',
'蚎':'水',
'蚏':'水',
'耺':'水',
'桚':'水',
'洅':'水',
'烖':'水',
'砦':'水',
'羘':'水',
'宱':'水',
'狣':'水',
'肁':'水',
'埑':'水',
'帪':'水',
'挋':'水',
'栚':'水',
'珎':'水',
'眕':'水',
'眞':'水',
'眐':'水',
'値':'水',
'娡':'水',
'徏':'水',
'恉':'水',
'挃':'水',
'栺':'木',
'洔':'水',
'洷':'水',
'疻':'水',
'祑':'水',
'衼':'水',
'釞':'水',
'蚛':'水',
'衳':'水',
'烐':'水',
'眝':'水',
'竚':'水',
'娤':'水',
'笍':'水',
'丵':'水',
'倳':'水',
'剚':'水',
'栥':'木',
'牸':'水',
'眥':'水',
'紎':'水',
'倊':'水',
'哫':'水',
'厜':'水',
'栬':'水',
'秨':'水',
'乾':'木',
'习':'木',
'習':'木',
'专':'木',
'專':'木',
'区':'木',
'區':'木',
'从':'木',
'從':'木',
'术':'木',
'術':'木',
'处':'木',
'處':'木',
'鸟':'火',
'鳥':'木',
'务':'木',
'務':'木',
'饥':'木',
'飢':'木',
'邦':'木',
'动':'火',
'動':'木',
'执':'木',
'執':'木',
'邪':'木',
'毕':'木',
'畢':'木',
'硃':'木',
'伟':'土',
'偉':'木',
'杀':'木',
'殺':'木',
'产':'木',
'產':'木',
'闭':'水',
'閉':'木',
'问':'水',
'問':'木',
'讶':'木',
'訝':'木',
'许':'木',
'許':'木',
'讹':'木',
'訛':'木',
'讼':'木',
'訟':'木',
'设':'木',
'設':'木',
'访':'木',
'訪':'木',
'诀':'木',
'訣':'木',
'那':'木',
'妇':'木',
'婦':'木',
'麦':'木',
'麥':'木',
'卤':'木',
'鹵':'木',
'坚':'土',
'堅':'木',
'岗':'土',
'崗':'木',
'帐':'木',
'帳':'木',
'近':'木',
'返':'木',
'狈':'木',
'狽':'木',
'条':'木',
'條':'木',
'迎':'木',
'启':'木',
'啓':'木',
'张':'木',
'張':'木',
'责':'木',
'責':'木',
'规':'木',
'規':'木',
'顶':'木',
'頂':'木',
'茉':'木',
'苦':'木',
'苛':'木',
'若':'木',
'茂':'木',
'苗':'木',
'英':'木',
'苟':'木',
'苑':'木',
'苞':'木',
'范':'木',
'茁':'木',
'茄':'木',
'苔':'木',
'茅':'木',
'厕':'木',
'厠':'木',
'顷':'木',
'頃':'木',
'斩':'木',
'斬':'木',
'软':'木',
'軟':'木',
'国':'木',
'國':'木',
'败':'木',
'敗':'木',
'贩':'木',
'販':'木',
'钓':'木',
'釣':'木',
'侦':'木',
'偵':'木',
'侧':'木',
'側':'木',
'货':'木',
'貨':'木',
'觅':'木',
'覓':'木',
'贪':'木',
'貪':'木',
'贫':'木',
'貧':'木',
'鱼':'水',
'魚':'木',
'视':'木',
'視':'木',
'参':'木',
'參':'木',
'组':'木',
'組':'木',
'绅':'木',
'紳':'木',
'细':'木',
'細':'木',
'终':'木',
'終':'木',
'绊':'木',
'絆':'木',
'绍':'水',
'紹':'木',
'贯':'木',
'貫':'木',
'挟':'木',
'挾':'木',
'挺':'木',
'挪':'木',
'带':'木',
'帶':'木',
'胡':'木',
'研':'木',
'牵':'木',
'牽':'木',
'背':'木',
'哑':'木',
'啞':'木',
'胃':'水',
'氢':'木',
'氫':'木',
'胚':'木',
'胞':'木',
'胖':'木',
'胎':'木',
'狭':'木',
'狹':'木',
'将':'木',
'將':'木',
'娄':'木',
'婁':'木',
'昼':'木',
'晝':'木',
'珠':'土',
'班':'木',
'匿':'木',
'捕':'金',
'捂':'木',
'振':'木',
'捎':'木',
'捍':'木',
'捏':'木',
'捉':'金',
'捆':'木',
'捐':'木',
'捌':'木',
'挫':'木',
'换':'木',
'挽':'木',
'捅':'木',
'挨':'木',
'梆':'木',
'啊':'木',
'健':'土',
'狸':'木',
'狼':'木',
'卿':'水',
'瓷':'木',
'羞':'木',
'瓶':'木',
'浙':'木',
'浦':'水',
'涉':'木',
'消':'木',
'浩':'水',
'海':'水',
'浴':'木',
'浮':'木',
'涣':'木',
'涕':'木',
'浪':'木',
'浸':'木',
'悖':'木',
'悟':'木',
'悄':'木',
'悍':'木',
'悔':'木',
'悦':'火',
'朗':'火',
'袖':'木',
'袍':'火',
'被':'木',
'祥':'火',
'域':'土',
'焉':'木',
'赦':'木',
'堆':'木',
'埠':'木',
'教':'木',
'培':'土',
'基':'土',
'聆':'木',
'勘':'木',
'聊':'木',
'娶':'木',
'勒':'木',
'械':'木',
'彬':'木',
'婪':'木',
'梗':'木',
'梧':'木',
'梢':'木',
'梅':'木',
'梳':'木',
'梯':'木',
'桶':'木',
'梭':'木',
'救':'木',
'曹':'木',
'副':'金',
'票':'木',
'酗':'木',
'厢':'木',
'戚':'木',
'硅':'木',
'盔':'木',
'爽':'木',
'匾':'木',
'雪':'木',
'虚':'木',
'彪':'木',
'雀':'木',
'堂':'土',
'常':'木',
'眶':'木',
'匙':'木',
'晨':'火',
'睁':'木',
'眯':'木',
'眼':'木',
'野':'木',
'啪':'木',
'啦':'木',
'曼':'木',
'晦':'木',
'晚':'木',
'啄':'木',
'啡':'木',
'趾':'木',
'啃':'木',
'略':'木',
'蚯':'木',
'蛀':'木',
'蛇':'火',
'唬':'木',
'唱':'木',
'患':'木',
'唾':'木',
'唯':'木',
'啤':'木',
'啥':'木',
'崖':'土',
'崎':'木',
'崔':'木',
'帷':'木',
'崩':'木',
'崇':'土',
'崛':'木',
'圈':'木',
'甜':'木',
'秸':'木',
'梨':'木',
'犁':'木',
'移':'木',
'笨':'木',
'笛':'木',
'笙':'木',
'符':'木',
'第':'木',
'敏':'木',
'做':'木',
'袋':'木',
'悠':'火',
'偶':'木',
'偎':'木',
'偷':'木',
'您':'火',
'售':'木',
'停':'木',
'偏':'木',
'兜':'木',
'假':'木',
'徘':'木',
'徙':'水',
'得':'木',
'舶':'木',
'船':'木',
'舵':'木',
'斜':'木',
'盒':'木',
'悉':'木',
'欲':'木',
'彩':'木',
'豚':'木',
'够':'木',
'凰':'火',
'祭':'木',
'凑':'木',
'减':'木',
'毫':'木',
'烹':'木',
'庶':'木',
'麻':'木',
'庵':'木',
'痊':'木',
'痕':'木',
'康':'木',
'庸':'土',
'鹿':'火',
'盗':'木',
'章':'木',
'竟':'木',
'商':'木',
'族':'木',
'望':'木',
'率':'木',
'着':'木',
'羚':'木',
'眷':'木',
'粘':'木',
'粗':'木',
'粒':'木',
'剪':'木',
'焊':'木',
'婆':'木',
'梁':'木',
'寇':'土',
'寅':'木',
'寄':'木',
'寂':'土',
'宿':'土',
'窒':'木',
'窑':'木',
'密':'土',
'尉':'木',
'蛋':'木',
'婚':'木',
'婉':'木',
'巢':'木',
'紫':'木',
'斌':'木',
'阡':'木',
'邢':'木',
'讷':'木',
'訥':'木',
'苣':'木',
'苎':'木',
'苡':'木',
'迓':'木',
'囵':'木',
'圇':'木',
'迕':'木',
'匦':'木',
'匭':'木',
'苷':'木',
'苯':'木',
'苤':'木',
'苫':'木',
'苜':'木',
'苴':'木',
'苒':'木',
'苘':'木',
'茌':'木',
'苻':'木',
'苓':'木',
'茆':'木',
'茀':'木',
'苕':'木',
'枧':'木',
'梘':'木',
'轭':'木',
'軛':'木',
'钍':'木',
'釷':'木',
'钎':'木',
'釺':'木',
'钏':'木',
'釧':'木',
'钒':'木',
'釩':'木',
'钕':'木',
'釹':'木',
'钗':'木',
'釵':'木',
'枭':'木',
'梟':'木',
'泾':'木',
'涇':'木',
'绀':'木',
'紺':'木',
'绁':'木',
'紲':'木',
'绂':'木',
'紱':'木',
'绌':'木',
'絀':'木',
'垭':'木',
'埡':'木',
'垩':'木',
'堊':'木',
'胄':'木',
'剐':'木',
'剮':'木',
'胛':'木',
'胂':'木',
'胙':'木',
'胍':'木',
'胗':'木',
'胝':'木',
'胤':'木',
'烃':'木',
'烴':'木',
'浃':'木',
'浹':'木',
'涎':'木',
'胥':'木',
'娅':'木',
'婭':'木',
'珥':'木',
'珙':'木',
'珩':'木',
'珧':'木',
'珣':'木',
'珞':'木',
'敖':'木',
'挹':'木',
'捋':'木',
'捃':'木',
'梃':'木',
'晟':'火',
'趿':'木',
'崃':'木',
'崍':'木',
'罡':'木',
'罟':'木',
'偌':'木',
'徕':'木',
'徠':'木',
'狷':'木',
'猁':'木',
'狳':'木',
'狺':'木',
'涑':'木',
'浯':'木',
'涅':'木',
'浞':'木',
'涓':'木',
'浥':'木',
'涔':'木',
'浜':'木',
'浠':'木',
'浣':'木',
'浚':'木',
'悚':'木',
'悝':'木',
'悒':'木',
'悌':'木',
'悛':'木',
'袒':'木',
'袢':'木',
'屙':'木',
'婀':'木',
'彗':'木',
'耜':'木',
'舂':'木',
'埴':'木',
'埯':'木',
'埸':'木',
'埵':'木',
'埤':'木',
'埝':'木',
'堋':'木',
'堍':'木',
'堉':'木',
'埭':'木',
'埽':'木',
'聃':'木',
'堇':'木',
'梵':'木',
'梏':'木',
'桴':'木',
'桷':'木',
'梓':'木',
'棁':'木',
'桫':'木',
'敕':'木',
'豉':'木',
'酞':'木',
'酚':'木',
'戛':'木',
'硎':'木',
'硒':'木',
'硗':'木',
'硐':'木',
'硇':'木',
'硌':'木',
'瓠':'木',
'匏':'木',
'厩':'木',
'殍':'木',
'雩':'木',
'眭':'木',
'晡':'木',
'晤':'木',
'眺':'木',
'眵':'木',
'眸':'木',
'圊':'木',
'啉':'木',
'勖':'木',
'晞':'木',
'唵':'木',
'晗':'火',
'冕':'木',
'畦':'土',
'趺':'木',
'蚶':'木',
'蛄':'木',
'蛆':'木',
'蚰':'木',
'圉':'木',
'蚱':'木',
'蛉':'木',
'蚴':'木',
'啁':'木',
'啕':'木',
'唿':'木',
'啐':'木',
'唼':'木',
'唷':'木',
'啖':'木',
'啵':'木',
'啶':'木',
'啷':'木',
'唳':'木',
'唰':'木',
'啜':'木',
'崚':'木',
'崦':'木',
'崮':'木',
'崤':'木',
'崆':'木',
'氪':'木',
'牾':'木',
'笸':'木',
'笪':'木',
'笮':'木',
'笠':'木',
'笥':'木',
'笤':'木',
'笳':'木',
'笞':'木',
'偃':'木',
'偕':'木',
'偈':'木',
'偬':'木',
'皎':'木',
'徜':'水',
'舸':'木',
'舴':'木',
'舷':'木',
'翎':'木',
'匐':'木',
'斛':'木',
'馗':'木',
'孰':'木',
'庹':'木',
'痔':'木',
'痍':'木',
'翊':'木',
'旌':'水',
'旎':'水',
'袤':'木',
'粕':'木',
'焐':'木',
'烯':'木',
'焓':'木',
'烽':'木',
'烷':'木',
'焗':'木',
'挲':'木',
'窕':'木',
'扈':'木',
'粜':'木',
'婧':'木',
'婊':'木',
'婕':'木',
'娼':'木',
'婢':'木',
'胬':'木',
'袈':'木',
'翌':'木',
'恿':'木',
'欸':'木',
'邨':'木',
'邠':'木',
'邡':'木',
'闫':'水',
'閆':'木',
'讻':'木',
'訩':'木',
'纻':'木',
'紵':'木',
'茋':'木',
'苾':'木',
'苠':'木',
'岽':'木',
'崬':'木',
'钐':'木',
'釤':'木',
'绋':'木',
'紼':'木',
'绐':'木',
'紿':'木',
'耇':'木',
'茈':'木',
'䌹':'木',
'絅':'木',
'胠':'木',
'胈':'木',
'胩':'木',
'胣':'木',
'珪':'木',
'珛':'木',
'珖':'木',
'珦':'木',
'珫':'木',
'珒':'木',
'珢':'木',
'珕':'木',
'珝':'木',
'梠':'木',
'梴':'木',
'笫':'木',
'倻':'木',
'狴':'木',
'狻':'木',
'烶':'木',
'烻':'木',
'涍':'木',
'浡':'木',
'浭':'木',
'浬':'木',
'涄':'木',
'涐':'木',
'浰':'木',
'浟':'木',
'浛':'木',
'浼':'木',
'浲':'木',
'涘':'木',
'悈':'木',
'悃':'木',
'悢':'木',
'袪':'木',
'袗':'木',
'祧':'木',
'堎':'木',
'堐':'木',
'埼':'木',
'埫':'木',
'堌':'木',
'晢':'木',
'梽':'木',
'桲':'木',
'桯':'木',
'梣':'木',
'梌':'木',
'桹':'木',
'敔':'木',
'硔':'木',
'硊':'木',
'硍':'木',
'勔':'木',
'唪':'木',
'翈':'木',
'晙':'木',
'畤':'土',
'跂':'木',
'蛃':'木',
'蚲':'木',
'蚺':'木',
'崧':'木',
'崟':'木',
'崞':'木',
'崒':'木',
'崌':'木',
'崡':'木',
'牻':'木',
'牿':'木',
'稆':'木',
'笱':'木',
'笯':'木',
'偰':'木',
'偡':'木',
'偭':'木',
'偲':'木',
'偁':'木',
'偓':'木',
'徛':'木',
'衒':'木',
'舳':'木',
'舲':'木',
'悆':'木',
'觖':'木',
'庱':'木',
'庳':'木',
'痓':'木',
'堃':'土',
'羝':'木',
'羕':'木',
'焆':'木',
'烺':'木',
'焌':'木',
'寁':'木',
'艴':'木',
'弸':'木',
'弶':'木',
'婞':'木',
'娵':'木',
'婍':'木',
'婌':'木',
'婫':'木',
'婤':'木',
'婘':'木',
'婠':'木',
'埨':'木',
'浿':'木',
'軝':'木',
'釴':'木',
'晛':'木',
'梜':'木',
'強':'木',
'悅':'木',
'埲':'木',
'挷':'木',
'邫':'木',
'笣':'木',
'珤':'木',
'蚫':'木',
'袌':'木',
'茇':'木',
'豝':'木',
'跁':'木',
'梎':'木',
'埿':'木',
'桳':'木',
'翉':'木',
'啀':'木',
'娾':'木',
'硋':'木',
'偝':'木',
'桮':'木',
'梖':'木',
'紴':'木',
'苝':'木',
'挬':'木',
'胉':'木',
'苩':'木',
'袚':'木',
'蚾':'木',
'蛂':'木',
'偋':'木',
'屛':'木',
'庰':'木',
'苪':'木',
'偪':'木',
'啚':'木',
'梐':'木',
'袐':'木',
'迊':'木',
'閇':'木',
'悑':'木',
'捗':'木',
'啋':'木',
'埰':'木',
'婇':'木',
'寀':'木',
'飡':'木',
'粣':'木',
'梫':'木',
'袩':'木',
'偖':'木',
'烲':'木',
'聅':'木',
'偛':'木',
'挿':'木',
'觘':'木',
'訬':'木',
'埥':'木',
'悜':'木',
'挰':'木',
'梬':'木',
'浾':'木',
'敐':'木',
'桭':'木',
'訦':'木',
'趻':'木',
'軙':'木',
'乿':'木',
'烾':'木',
'粚':'木',
'耛':'木',
'蚳':'木',
'赿':'木',
'崈':'木',
'浺':'木',
'痋':'木',
'偢':'木',
'紬':'木',
'埱':'木',
'耝':'木',
'剶':'木',
'窓':'木',
'偆':'木',
'浱':'木',
'婥':'木',
'偨':'木',
'秶':'木',
'紪':'木',
'茊':'木',
'赼':'木',
'梀':'木',
'觕':'木',
'畣':'木',
'笚':'木',
'迏':'木',
'迖':'木',
'啛':'木',
'婃':'木',
'孮':'木',
'徖':'木',
'悤':'木',
'虘':'木',
'蚮':'木',
'軚':'木',
'釱':'木',
'啗':'木',
'躭':'木',
'酖':'木',
'偒':'木',
'偙':'木',
'啇':'木',
'埞':'木',
'梊':'木',
'梑':'木',
'焍':'木',
'眱':'木',
'苐':'木',
'苖':'木',
'袛':'木',
'啑':'木',
'戜':'木',
'眰':'木',
'胅':'木',
'苵':'木',
'埬':'木',
'娻':'木',
'崠':'木',
'笗':'木',
'眮':'木',
'苳':'木',
'唸':'木',
'婝':'木',
'婰':'木',
'弴':'木',
'奝':'木',
'彫':'木',
'蛁':'木',
'婈':'木',
'靪':'木',
'飣':'木',
'秺':'木',
'梪':'木',
'毭':'木',
'浢':'木',
'酘':'木',
'偳':'木',
'剬':'木',
'剫':'木',
'崜':'木',
'敚':'木',
'痑':'木',
'卾':'木',
'偔':'木',
'娿':'木',
'婐':'木',
'硆':'木',
'迗':'木',
'唲':'木',
'眲':'木',
'笩':'木',
'婏':'木',
'盕':'木',
'笲':'木',
'笵':'木',
'觙':'木',
'軡':'木',
'趽':'木',
'畡':'木',
'缻':'木',
'奜':'木',
'婓':'木',
'屝':'木',
'婔':'木',
'胐':'木',
'胇':'木',
'胏':'木',
'梤':'木',
'訜':'木',
'冨':'木',
'偩':'木',
'旉':'木',
'烰':'木',
'笰':'木',
'紨':'木',
'翇':'木',
'胕':'木',
'虙':'木',
'蚹':'木',
'袝':'木',
'邞':'木',
'桿':'木',
'笴':'木',
'粓':'木',
'釬':'木',
'堈':'木',
'釭':'木',
'皐':'木',
'祮':'木',
'挭':'木',
'偑':'木',
'捀':'木',
'桻':'木',
'覂':'木',
'啂':'木',
'夠':'木',
'耈':'木',
'蚼':'木',
'袧':'木',
'啒':'木',
'崓':'木',
'笟':'木',
'罛':'木',
'苽':'木',
'捖':'木',
'桰':'木',
'迋':'木',
'祪':'木',
'窐':'木',
'趹':'木',
'袞':'木',
'袬':'木',
'烸':'木',
'晧':'木',
'悎':'木',
'啝':'木',
'焃':'木',
'秴':'木',
'蚵':'木',
'袔':'木',
'晘':'木',
'晥':'木',
'梒':'木',
'浫':'木',
'涆':'木',
'閈':'木',
'貥':'木',
'迒':'木',
'崋':'木',
'釪':'木',
'釫':'木',
'啈':'木',
'悙':'木',
'浤':'木',
'紭':'木',
'苰':'木',
'谹':'木',
'梙':'木',
'梡':'木',
'偟':'木',
'奛':'木',
'朚':'木',
'壷':'木',
'婟':'木',
'焀':'木',
'烼':'木',
'苸':'木',
'虖':'木',
'婎':'木',
'痐':'木',
'焄':'木',
'剨':'木',
'捇':'木',
'秳':'木',
'邩':'木',
'偮':'木',
'卙':'木',
'唶':'木',
'庴':'木',
'旣':'木',
'梞':'木',
'焏':'木',
'茍':'木',
'谻':'木',
'硈':'木',
'耞':'木',
'舺':'木',
'偂':'木',
'帴':'木',
'挸':'木',
'珔':'木',
'豜':'木',
'敎':'木',
'捁':'木',
'珓':'木',
'覐':'木',
'唫':'木',
'訡':'木',
'崨':'木',
'徣':'木',
'痎':'木',
'罝':'木',
'婙':'木',
'婛':'木',
'旍':'木',
'桱':'木',
'梷':'木',
'殌':'木',
'殑':'木',
'浻':'木',
'烱':'木',
'捄':'木',
'镹':'木',
'捔':'木',
'赽':'木',
'偊':'木',
'埧':'木',
'埾':'木',
'婅':'木',
'婮':'木',
'挶':'木',
'梮':'木',
'粔':'木',
'耟':'木',
'絇':'木',
'蚷':'木',
'袓':'木',
'埢':'木',
'悁':'木',
'朘':'木',
'桾':'木',
'勓':'木',
'偘':'木',
'埳':'木',
'邟':'木',
'堁':'木',
'胢':'木',
'挳':'木',
'牼':'木',
'釦':'木',
'堀':'木',
'焅':'木',
'欳':'木',
'頄':'木',
'欵':'木',
'硄':'木',
'軖':'木',
'軠':'木',
'朖':'木',
'欴':'木',
'崐':'木',
'崑':'木',
'晜':'木',
'梱':'木',
'涃':'木',
'翋':'木',
'唻':'木',
'婡':'木',
'庲':'木',
'浶':'木',
'珯':'木',
'浨':'木',
'婯':'木',
'悡':'木',
'梩':'木',
'梸':'木',
'涖':'木',
'苙':'木',
'蚸':'木',
'涊':'木',
'翏':'木',
'浖':'木',
'笭':'木',
'紷':'木',
'衑':'木',
'袊':'木',
'悋':'木',
'崊':'木',
'屚':'木',
'旈':'木',
'桺':'木',
'挵':'木',
'梇':'木',
'玈':'木',
'硉':'木',
'婨':'木',
'崘':'木',
'崙':'木',
'悗':'木',
'恾':'木',
'浝':'木',
'狵':'木',
'釯':'木',
'罞':'木',
'笷':'木',
'覒':'木',
'軞':'木',
'酕':'木',
'挴':'木',
'苺':'木',
'覔':'木',
'婂':'木',
'崏':'木',
'笢':'木',
'罠':'木',
'朙':'木',
'眳':'木',
'眽':'木',
'粖':'木',
'絈':'木',
'胟':'木',
'笝':'木',
'袦':'木',
'訤':'木',
'軜':'木',
'豽':'木',
'雫':'木',
'匘':'木',
'堄':'木',
'婗':'木',
'胒':'木',
'苨':'木',
'蚭':'木',
'苶':'木',
'偄':'木',
'挼':'木',
'梛':'木',
'袙':'木',
'珮':'木',
'梈':'木',
'皏':'木',
'硑':'木',
'帲':'木',
'胓':'木',
'崥':'木',
'悂':'木',
'旇':'木',
'耚':'木',
'翍':'木',
'蚽':'木',
'豼':'木',
'覑':'木',
'婄':'木',
'捊':'木',
'烳':'木',
'唭':'木',
'啔':'木',
'娸':'木',
'帺':'木',
'桼':'木',
'釮':'木',
'殎':'木',
'婜':'木',
'孯':'木',
'悓':'木',
'唴':'木',
'啌':'木',
'釥':'木',
'悏':'木',
'笡':'木',
'珡':'木',
'赺':'木',
'赾':'木',
'啨':'木',
'寈':'木',
'殸':'木',
'赹':'木',
'梂':'木',
'殏':'木',
'浗':'木',
'毬':'木',
'苬':'木',
'蛅':'木',
'袡':'木',
'紶':'木',
'翑':'木',
'胊':'木',
'硂':'木',
'芿':'木',
'釰':'木',
'烿':'木',
'梕':'木',
'秹':'木',
'桵':'木',
'訯':'木',
'挻':'木',
'笘':'木',
'帹':'木',
'桬':'木',
'袑':'木',
'偗':'木',
'晠':'木',
'苼':'木',
'釶':'木',
'埶':'木',
'秲':'木',
'笶':'木',
'絁':'木',
'敒':'木',
'涁':'木',
'訠':'木',
'邥':'木',
'阠':'木',
'捒':'木',
'焂':'木',
'絉':'木',
'袕':'木',
'軗':'木',
'娷':'木',
'挩':'木',
'涗':'木',
'眴':'木',
'欶':'木',
'洍':'木',
'釲':'木',
'飤':'木',
'庺':'木',
'梥':'木',
'挱':'木',
'殐':'木',
'珟':'木',
'奞':'木',
'埣':'木',
'浽':'木',
'崉':'木',
'偍':'木',
'屜':'木',
'悐':'木',
'挮':'木',
'婒':'木',
'埮':'木',
'舑':'木',
'唺':'木',
'婖':'木',
'甛':'木',
'紾':'木',
'胋':'木',
'蛈':'木',
'涏':'木',
'浵':'木',
'痌':'木',
'秱':'木',
'匬':'木',
'悇':'木',
'捈':'木',
'涋':'木',
'迌':'木',
'啍':'木',
'涒':'木',
'訰':'木',
'豘':'木',
'軘':'木',
'迍':'木',
'紽':'木',
'袉':'木',
'袥':'木',
'阤':'木',
'啘':'木',
'聉':'木',
'埦':'木',
'帵':'木',
'梚':'木',
'貦':'木',
'崣':'木',
'梶':'木',
'浘':'木',
'痏':'木',
'苿':'木',
'阢':'木',
'桽':'木',
'剭':'木',
'啎':'木',
'娬':'木',
'悞':'木',
'洖':'木',
'窏':'木',
'唽':'木',
'悕':'木',
'桸':'木',
'欷':'木',
'焈':'木',
'焁':'木',
'狶':'木',
'羛':'木',
'訢':'木',
'赥':'木',
'釳':'木',
'珨':'木',
'祫':'木',
'谺':'木',
'迬':'木',
'婑':'木',
'唩':'木',
'娹':'木',
'涀':'木',
'珗':'木',
'絃':'木',
'胘':'木',
'苮':'木',
'蚿':'木',
'袨':'木',
'訮':'木',
'赻':'木',
'婋':'木',
'焇':'木',
'偞':'木',
'卨':'木',
'徢':'木',
'焎':'木',
'訫':'木',
'邤':'木',
'梋':'木',
'偦':'木',
'勗':'木',
'敍':'木',
'珬':'木',
'祤':'木',
'虗':'木',
'偱':'木',
'崕':'木',
'偠':'木',
'窔':'木',
'苭':'木',
'袎':'木',
'訞':'木',
'偐':'木',
'偣':'木',
'婩':'木',
'狿':'木',
'珚':'木',
'硏':'木',
'酓':'木',
'珜':'木',
'紻':'木',
'眻':'木',
'胦':'木',
'偯':'木',
'悘':'木',
'悥':'木',
'捙':'木',
'殹':'木',
'浳':'木',
'笖':'木',
'苢':'木',
'袘':'木',
'袣':'木',
'訲':'木',
'豙':'木',
'豛':'木',
'阣':'木',
'隿':'木',
'埜':'木',
'捓':'木',
'凐':'木',
'婣':'木',
'婬':'木',
'秵':'木',
'偀':'木',
'浧':'木',
'唹':'木',
'悀':'木',
'苚':'木',
'偤':'木',
'梄':'木',
'聈':'木',
'訧':'木',
'盓':'木',
'厡':'木',
'寃':'木',
'邧':'木',
'跀':'木',
'紮':'木',
'捑':'木',
'捚':'木',
'梍':'木',
'偧':'木',
'苲':'木',
'蚻':'木',
'啠':'木',
'悊':'木',
'晣':'木',
'眹':'木',
'聄':'木',
'酙':'木',
'埩':'木',
'崝':'木',
'崢':'木',
'聇':'木',
'偫':'木',
'徝':'木',
'梔':'木',
'狾':'木',
'祬':'木',
'秷':'木',
'紩':'木',
'翐':'木',
'胑':'木',
'袠':'木',
'袟':'木',
'觗':'木',
'訨':'木',
'偅':'木',
'眾':'木',
'徟':'木',
'珘':'木',
'矪':'木',
'粙':'木',
'祩':'木',
'秼':'木',
'笜':'木',
'紸':'木',
'羜':'木',
'罜':'木',
'梉':'木',
'焋':'木',
'娺':'木',
'埻':'木',
'啅':'木',
'梲':'木',
'烵':'木',
'胔':'木',
'釨':'木',
'絊':'木',
'酔':'木',
'捘':'木',
'袏':'木',
'几':'火',
'幾':'火',
'开':'火',
'開':'火',
'無':'火',
'云':'火',
'雲':'火',
'为':'火',
'爲':'火',
'冯':'火',
'馮':'火',
'发':'火',
'發':'火',
'丝':'水',
'絲':'火',
'扫':'火',
'掃':'火',
'场':'火',
'場':'火',
'尧':'火',
'堯':'火',
'乔':'火',
'喬':'火',
'众':'火',
'衆':'火',
'伞':'火',
'傘':'火',
'创':'金',
'創':'火',
'寻':'火',
'尋':'火',
'阴':'土',
'防':'土',
'买':'火',
'買':'火',
'韧':'火',
'韌':'火',
'抡':'火',
'掄':'火',
'壳':'火',
'殼':'火',
'报':'火',
'報':'火',
'劳':'火',
'勞':'火',
'围':'火',
'圍':'火',
'困':'火',
'睏':'火',
'闰':'火',
'閏':'火',
'闲':'水',
'閑':'火',
'间':'水',
'間':'火',
'闷':'水',
'悶':'火',
'沦':'火',
'淪':'火',
'评':'火',
'評':'火',
'诈':'火',
'詐':'火',
'诉':'火',
'訴':'火',
'诊':'火',
'診':'火',
'词':'金',
'詞':'火',
'现':'火',
'現':'火',
'杰':'木',
'述':'火',
'丧':'火',
'喪':'火',
'画':'火',
'畫':'火',
'枣':'火',
'棗':'木',
'虏':'火',
'虜':'火',
'迪':'火',
'凯':'火',
'凱':'火',
'贬':'火',
'貶':'火',
'贮':'火',
'貯':'火',
'迭':'火',
'迫':'火',
'舍':'火',
'捨':'火',
'胁':'火',
'脅':'火',
'备':'火',
'備':'火',
'卷':'水',
'捲':'火',
'单':'火',
'單':'火',
'浅':'火',
'淺':'火',
'迢':'火',
'贰':'火',
'貳':'火',
'项':'火',
'項':'火',
'荆':'木',
'茸':'木',
'茬':'木',
'草':'木',
'茵':'火',
'茶':'木',
'荒':'木',
'茫':'木',
'荔':'木',
'栈':'木',
'棧':'木',
'栋':'木',
'棟':'木',
'砚':'土',
'硯':'火',
'残':'火',
'殘':'火',
'轴':'火',
'軸':'火',
'贵':'金',
'貴':'火',
'勋':'火',
'勛':'火',
'哟':'火',
'喲':'火',
'贴':'火',
'貼':'火',
'贻':'火',
'貽':'火',
'钙':'火',
'鈣':'火',
'钝':'火',
'鈍':'火',
'钞':'火',
'鈔':'火',
'钠':'火',
'鈉':'火',
'钦':'火',
'欽':'火',
'钧':'金',
'鈞':'火',
'钩':'火',
'鈎':'火',
'钮':'火',
'鈕':'火',
'复':'火',
'復':'火',
'贷':'金',
'貸':'火',
'顺':'火',
'順':'火',
'须':'火',
'須':'火',
'胜':'火',
'勝':'火',
'脉':'火',
'贸':'金',
'貿':'火',
'兹':'火',
'费':'火',
'費':'火',
'贺':'火',
'賀':'火',
'绒':'火',
'絨':'火',
'结':'水',
'結':'火',
'给':'水',
'給':'火',
'绚':'火',
'絢':'火',
'络':'水',
'絡':'火',
'绝':'火',
'絶':'火',
'绞':'火',
'絞':'火',
'统':'水',
'統':'火',
'壶':'火',
'壺':'火',
'恶':'火',
'惡':'火',
'笔':'火',
'筆':'火',
'胰':'水',
'脆':'火',
'脂':'火',
'胸':'火',
'胳':'火',
'脊':'火',
'傢':'火',
'能':'火',
'球':'火',
'理':'火',
'琉':'火',
'琅':'火',
'捧':'火',
'堵':'火',
'措':'火',
'捺':'火',
'掩':'火',
'捷':'火',
'排':'火',
'掉':'火',
'捶':'火',
'推':'金',
'掀':'火',
'授':'金',
'捻':'火',
'掏':'火',
'掐':'火',
'掠':'火',
'掂':'火',
'接':'火',
'控':'火',
'探':'火',
'掘':'火',
'黄':'火',
'奢':'火',
'盛':'火',
'距':'火',
'象':'火',
'猜':'火',
'猖':'火',
'猛':'火',
'廊':'土',
'清':'水',
'添':'火',
'淋':'火',
'涯':'火',
'淹':'火',
'淑':'火',
'淌':'火',
'混':'火',
'淮':'火',
'淆':'火',
'渊':'水',
'淵':'火',
'淫':'火',
'淘':'火',
'淳':'水',
'液':'火',
'淤':'火',
'淡':'火',
'深':'水',
'涮':'火',
'涵':'水',
'情':'火',
'惜':'火',
'悼':'火',
'惕':'火',
'惟':'火',
'惦':'火',
'悴':'火',
'惋':'火',
'袱':'火',
'敢':'火',
'屠':'火',
'斑':'火',
'替':'火',
'款':'火',
'堪':'火',
'堰':'火',
'越':'火',
'趁':'火',
'超':'火',
'堤':'火',
'博':'火',
'喜':'火',
'彭':'火',
'煮':'火',
'裁':'火',
'壹':'火',
'斯':'火',
'期':'火',
'欺':'火',
'散':'火',
'朝':'火',
'辜':'火',
'棒':'木',
'棱':'火',
'棋':'木',
'植':'木',
'森':'木',
'焚':'火',
'椅':'火',
'椒':'木',
'棵':'木',
'棍':'木',
'椎':'木',
'棉':'木',
'棚':'火',
'棕':'木',
'棺':'火',
'惠':'火',
'惑':'火',
'粟':'火',
'棘':'木',
'酣':'火',
'酥':'火',
'厨':'火',
'硬':'火',
'硝':'火',
'硫':'火',
'雁':'火',
'殖':'火',
'裂':'火',
'雄':'火',
'雅':'火',
'悲':'火',
'敞':'火',
'棠':'木',
'掌':'金',
'晴':'火',
'暑':'火',
'最':'火',
'晰':'火',
'量':'火',
'喳':'火',
'晶':'火',
'喇':'火',
'喊':'火',
'晾':'火',
'景':'火',
'跋':'火',
'跌':'火',
'跑':'火',
'跛':'火',
'蛙':'火',
'蛛':'火',
'蛤':'火',
'喝':'火',
'喂':'火',
'喘':'火',
'喉':'火',
'喻':'火',
'啼':'火',
'喧':'火',
'嵌':'火',
'幅':'火',
'帽':'火',
'黑':'火',
'甥':'火',
'掰':'火',
'短':'火',
'智':'火',
'氮':'火',
'毯':'火',
'氯':'火',
'剩':'火',
'稍':'火',
'程':'火',
'稀':'火',
'税':'火',
'筐':'火',
'等':'火',
'策':'火',
'筒':'火',
'筏':'火',
'答':'火',
'筋':'火',
'筝':'火',
'傅':'火',
'牌':'火',
'堡':'土',
'集':'火',
'焦':'火',
'傍':'火',
'皓':'火',
'皖':'火',
'粤':'火',
'奥':'火',
'街':'火',
'循':'水',
'舒':'火',
'番':'火',
'惫':'火',
'然':'火',
'就':'火',
'敦':'火',
'痘':'火',
'痢':'火',
'痪':'火',
'痛':'火',
'童':'火',
'竣':'火',
'善':'火',
'翔':'火',
'羡':'火',
'普':'火',
'尊':'火',
'奠':'火',
'曾':'火',
'焰':'火',
'割':'金',
'寒':'土',
'富':'土',
'寓':'土',
'窖':'火',
'窗':'火',
'窘':'火',
'雇':'火',
'禄':'火',
'犀':'火',
'强':'火',
'粥':'火',
'疏':'火',
'媒':'火',
'絮':'火',
'媚':'火',
'婿':'火',
'登':'火',
'驭':'火',
'馭':'火',
'扪':'火',
'捫':'火',
'伧':'火',
'傖':'火',
'讵':'火',
'詎':'火',
'阱':'火',
'阮':'火',
'阪':'火',
'邯':'火',
'邴':'火',
'邳':'火',
'邶':'火',
'帏':'火',
'幃':'火',
'岚':'土',
'嵐':'火',
'邱':'火',
'邸':'火',
'闳':'水',
'閎':'火',
'闵':'火',
'閔':'火',
'怅':'火',
'悵':'火',
'诂':'火',
'詁':'火',
'诃':'火',
'訶':'火',
'诅':'火',
'詛':'火',
'诋':'火',
'詆':'火',
'诏':'火',
'詔':'火',
'诒':'火',
'詒':'火',
'邵':'火',
'邰':'火',
'茚':'火',
'枨':'木',
'棖':'木',
'迥':'火',
'剀':'火',
'剴':'火',
'迮':'火',
'迤':'火',
'迦':'火',
'迨':'火',
'顸':'火',
'頇':'火',
'贲':'火',
'賁':'火',
'茜':'木',
'荑':'木',
'贳':'火',
'貰':'火',
'茼':'木',
'茴':'火',
'茱':'木',
'茯':'木',
'荏':'木',
'荇':'木',
'荃':'木',
'荀':'木',
'茗':'木',
'茭':'木',
'茨':'火',
'茹':'木',
'砗':'火',
'硨':'火',
'轱':'火',
'軲':'火',
'轲':'火',
'軻':'火',
'轶':'金',
'軼':'火',
'轸':'金',
'軫':'火',
'觇':'火',
'覘':'火',
'帧':'火',
'幀':'火',
'贶':'火',
'貺':'火',
'钚':'火',
'鈈':'火',
'钛':'火',
'鈦':'火',
'钣':'火',
'鈑':'火',
'钤':'火',
'鈐':'火',
'钫':'火',
'鈁':'火',
'钯':'火',
'鈀':'火',
'绔':'火',
'絝':'火',
'绗':'火',
'絎':'火',
'绛':'火',
'絳':'火',
'埚':'火',
'堝':'火',
'氩':'火',
'氬':'火',
'笄':'火',
'胯':'火',
'胱':'水',
'胴':'火',
'胭':'火',
'胼':'火',
'脒':'火',
'胺':'火',
'痉':'火',
'痙':'火',
'涞':'火',
'淶':'火',
'娲':'火',
'媧':'火',
'琇':'火',
'捯':'火',
'赧':'火',
'捭':'火',
'掬':'火',
'掖':'火',
'捽':'火',
'掊':'火',
'捩':'火',
'掮':'火',
'掇':'火',
'棻':'木',
'硭':'火',
'硖':'火',
'硤':'火',
'喏':'火',
'喵':'火',
'筇':'火',
'傀':'火',
'猗':'火',
'猞':'火',
'猝':'火',
'庾':'火',
'敝':'火',
'渚':'水',
'淇':'水',
'淅':'火',
'淞':'火',
'涿':'火',
'淖':'火',
'淠':'火',
'涸':'火',
'淦':'火',
'淝':'火',
'淬':'火',
'涪':'火',
'淙':'火',
'涫':'火',
'渌':'火',
'淄':'火',
'悻':'火',
'悱':'火',
'惝':'火',
'惘':'火',
'悸':'火',
'惆':'火',
'惚':'火',
'惇':'火',
'袷':'火',
'裉':'火',
'耠':'火',
'堞':'火',
'堙':'火',
'趄':'火',
'塄':'火',
'耋':'火',
'蛩':'火',
'聒':'火',
'靰':'火',
'戟':'火',
'棼':'火',
'棹':'火',
'棰':'火',
'椋':'火',
'椁':'火',
'椪':'火',
'棣':'火',
'椐':'木',
'覃':'火',
'酤':'火',
'酢':'火',
'酡':'火',
'厥':'火',
'雯':'火',
'雱':'火',
'斐':'火',
'睄':'火',
'睇':'火',
'睃':'火',
'喋':'火',
'喃':'火',
'喱':'火',
'喹':'火',
'晷':'火',
'喈':'火',
'跖':'火',
'跗':'火',
'跚':'火',
'跎':'火',
'跏':'火',
'跆':'火',
'蛭':'火',
'蛐':'火',
'蛔':'火',
'蛞':'火',
'蛟':'火',
'蛘':'火',
'喁':'火',
'喟':'火',
'啾':'火',
'喑':'火',
'喀':'火',
'喔':'火',
'喙':'火',
'嵖':'火',
'崴':'火',
'詈':'火',
'嵎':'火',
'崽':'火',
'嵛':'火',
'幄':'火',
'嵋':'火',
'掣':'火',
'矬':'火',
'氰':'火',
'毳':'火',
'犄':'火',
'犋':'火',
'嵇':'火',
'黍':'火',
'稃':'火',
'稂':'火',
'筌':'火',
'傣':'火',
'傈':'火',
'舄':'火',
'徨':'火',
'畲':'火',
'弑':'火',
'翕':'火',
'釉':'火',
'舜':'火',
'貂':'火',
'觚':'火',
'飧':'火',
'痣':'火',
'痦':'火',
'痞':'火',
'痤':'火',
'痧':'火',
'竦':'火',
'啻':'火',
'粞':'火',
'焯':'火',
'焜':'火',
'焙':'火',
'焱':'火',
'寐':'火',
'扉':'火',
'幂':'水',
'孱':'火',
'弼':'火',
'巽':'火',
'媪':'火',
'媛':'火',
'婷':'火',
'皴':'火',
'婺':'火',
'彘':'火',
'訾':'火',
'跐':'火',
'闶':'水',
'閌':'火',
'诇':'火',
'詗':'火',
'邲':'火',
'诎':'火',
'詘':'火',
'诐':'火',
'詖':'火',
'荖':'木',
'荁':'木',
'茽':'木',
'荄':'火',
'茺':'木',
'茳':'木',
'茛':'木',
'轵':'火',
'軹':'火',
'轷':'火',
'軤':'火',
'轺':'金',
'軺':'火',
'钘':'火',
'鈃':'火',
'钪':'火',
'鈧':'火',
'钬':'火',
'鈥':'火',
'钭':'火',
'鈄':'火',
'绖':'火',
'絰':'火',
'珹':'火',
'琊':'火',
'珽':'火',
'桠':'火',
'椏':'木',
'硁':'火',
'硜':'火',
'赀':'火',
'貲':'火',
'脎':'火',
'胲':'火',
'堲':'火',
'珸':'火',
'珵':'火',
'琄':'火',
'琈':'火',
'琀':'火',
'珺':'火',
'掭':'火',
'掎':'火',
'掞':'火',
'埪':'火',
'梾':'火',
'棶':'火',
'瓻':'火',
'猇':'火',
'猊':'火',
'猄':'火',
'淏':'火',
'淟':'火',
'淜':'火',
'淴':'火',
'淯':'火',
'湴':'火',
'涴':'火',
'惛':'火',
'惔':'火',
'悰':'火',
'惙':'火',
'袼':'火',
'祲':'火',
'婼':'火',
'媖':'火',
'絜':'火',
'堾':'火',
'堼':'火',
'堧':'火',
'喆':'火',
'堨':'火',
'堠':'火',
'惎':'火',
'靬':'火',
'棤':'火',
'棽':'火',
'棫':'木',
'椓':'木',
'椑':'木',
'椆':'火',
'棓':'木',
'棬':'火',
'棪':'木',
'椀':'火',
'甦':'火',
'奡':'火',
'皕':'火',
'硪':'火',
'欹':'火',
'棐':'木',
'黹':'火',
'牚':'火',
'睎':'火',
'晫':'火',
'晪':'火',
'晱':'火',
'蛑':'火',
'畯':'火',
'斝':'火',
'喤':'火',
'崶':'火',
'嵁':'火',
'崾':'火',
'嵅':'火',
'崿':'火',
'圌':'火',
'淼':'水',
'犇':'火',
'稌':'火',
'筀':'火',
'筘':'火',
'筅':'火',
'傃':'火',
'傉':'火',
'傒':'火',
'傕':'火',
'舾':'火',
'畬':'火',
'凓':'火',
'粢':'火',
'旐':'火',
'焞':'火',
'欻':'火',
'甯':'火',
'棨':'木',
'扊':'火',
'婻':'火',
'媆':'火',
'媞':'火',
'媓':'火',
'媂':'火',
'媄':'火',
'矞':'火',
'堽':'火',
'詝':'火',
'睍':'火',
'鈇':'火',
'釿':'火',
'絪':'火',
'黃':'火',
'幇':'火',
'軮':'火',
'棑':'木',
'猈':'火',
'絔':'火',
'堢':'火',
'媕':'火',
'啽':'火',
'晻':'火',
'荌':'木',
'阥':'火',
'詙':'火',
'軷':'火',
'詏':'火',
'軪':'火',
'镺':'火',
'捹':'火',
'渀':'火',
'軬':'火',
'凒':'火',
'捱':'火',
'阨':'火',
'珼':'火',
'絥':'火',
'軰':'火',
'徧':'火',
'淿':'火',
'袹':'火',
'淲':'火',
'猋':'火',
'颩':'火',
'椕':'木',
'傡':'火',
'寎':'火',
'掤':'火',
'棅':'木',
'絣':'火',
'奟':'火',
'閍':'火',
'堛':'火',
'弻':'火',
'貱':'火',
'採':'火',
'棌':'木',
'叅':'火',
'喰':'火',
'朁':'火',
'凔':'火',
'廁':'火',
'茦':'木',
'靫':'火',
'惉':'火',
'棎':'木',
'硟':'火',
'硩':'火',
'詀':'火',
'迠':'火',
'晿':'火',
'淐':'火',
'焻':'火',
'瓺':'火',
'焣':'火',
'堘':'火',
'掁':'火',
'棦':'木',
'椉':'木',
'淨':'火',
'睈':'火',
'窚':'火',
'脀':'火',
'捵':'火',
'祳':'火',
'茞':'木',
'趂':'火',
'迧':'火',
'鈂':'火',
'喫':'火',
'徥':'火',
'欼':'火',
'淔':'火',
'筂':'火',
'胵':'火',
'荎':'木',
'袳':'火',
'袲':'火',
'訵':'火',
'貾':'火',
'迣':'火',
'迡':'火',
'絒':'火',
'臰':'火',
'傗':'火',
'珿':'火',
'豠':'火',
'荈':'木',
'媋':'火',
'犉':'火',
'涰':'火',
'絘':'火',
'茲':'木',
'蛓':'火',
'趀':'火',
'辝':'火',
'媨':'火',
'剳':'火',
'匒':'火',
'荅':'木',
'詚':'火',
'焠':'火',
'脃':'火',
'袸':'火',
'棇':'木',
'焧':'火',
'睉':'火',
'軩':'火',
'啿':'火',
'媅':'火',
'觛':'火',
'婸':'火',
'盜':'火',
'悳':'火',
'淂':'火',
'棏':'木',
'掋':'火',
'珶':'火',
'祶':'火',
'觝':'火',
'趆':'火',
'軧':'火',
'靮':'火',
'耊':'火',
'聑':'火',
'臷':'火',
'詄':'火',
'趃':'火',
'跕':'火',
'涷':'火',
'衕':'火',
'厧':'火',
'傎':'火',
'敟':'火',
'鈟':'火',
'喥':'火',
'帾':'火',
'靯':'火',
'阧':'火',
'媏':'火',
'崸':'火',
'媠':'火',
'敠':'火',
'毲':'火',
'痥':'火',
'茤':'木',
'堮':'火',
'珴':'火',
'皒':'火',
'睋':'火',
'豟':'火',
'軶':'火',
'鈋':'火',
'聏':'火',
'胹':'火',
'荋':'木',
'衈':'火',
'袻':'火',
'傠':'火',
'茷':'木',
'棥':'木',
'淓':'火',
'絠':'火',
'祴':'火',
'絯':'火',
'殕':'火',
'雬':'火',
'渄':'火',
'猆':'火',
'靟':'火',
'鈖':'火',
'雰':'火',
'媍':'火',
'捬':'火',
'棴':'木',
'焤':'火',
'盙':'火',
'秿':'火',
'荂':'木',
'蛗':'火',
'詂':'火',
'軵':'火',
'凲':'火',
'涻':'火',
'稈':'火',
'詌':'火',
'掆':'火',
'棡':'火',
'焵':'火',
'犅':'火',
'阬':'火',
'祰':'火',
'稁':'火',
'臯':'火',
'茖':'木',
'臵':'火',
'蛒':'火',
'堩':'火',
'稉':'火',
'絚':'火',
'絙':'火',
'堸':'火',
'焨':'火',
'匑':'火',
'蛬':'火',
'傋':'火',
'茩':'火',
'訽':'火',
'豿':'火',
'軥':'火',
'棝':'木',
'淈':'火',
'焸':'火',
'軱':'火',
'掛':'火',
'筈':'火',
'絓':'火',
'罣':'火',
'悺':'火',
'悹':'火',
'茪':'木',
'臦':'火',
'胿':'火',
'茥':'木',
'袿':'火',
'蛫':'火',
'惃':'火',
'掍':'火',
'惈':'火',
'淉':'火',
'猓':'火',
'鈛':'火',
'奤':'火',
'傐':'火',
'椃':'火',
'茠':'木',
'喛':'火',
'嵑':'火',
'惒':'火',
'訸':'火',
'淊':'火',
'皔':'火',
'睅':'火',
'筕':'火',
'帿':'火',
'缿':'火',
'豞':'火',
'胻':'火',
'焢':'火',
'硡':'火',
'竤':'火',
'粠':'火',
'舼':'火',
'鈜':'火',
'喚':'火',
'堚':'火',
'寏':'火',
'嵈':'火',
'睆':'火',
'堭':'火',
'崲':'火',
'軦':'火',
'喖':'火',
'媩':'火',
'絗':'火',
'虝':'火',
'媈':'火',
'蛕':'火',
'棞':'木',
'棔':'木',
'殙':'火',
'涽':'火',
'焝':'火',
'祵':'火',
'喐':'火',
'掝':'火',
'喞':'火',
'嵆':'火',
'攲':'火',
'朞':'火',
'筓':'火',
'臮':'火',
'蛣':'火',
'鈒':'火',
'鈘':'火',
'婽':'火',
'徦':'火',
'戞':'火',
'堿':'火',
'寋':'火',
'惤':'火',
'牋':'火',
'猏':'火',
'硷':'火',
'臶':'火',
'詃':'火',
'跈':'火',
'雃':'火',
'閒':'火',
'袶':'火',
'焳':'火',
'筊':'火',
'茮':'木',
'堻':'火',
'惍':'火',
'荕':'木',
'傑':'火',
'堦':'火',
'堺':'火',
'媎':'火',
'媘':'火',
'椄':'火',
'袺':'火',
'竧':'火',
'荊':'木',
'絕':'火',
'趉':'火',
'鈌':'火',
'椇':'木',
'椈':'木',
'毱':'火',
'淗':'火',
'涺':'火',
'跔':'火',
'跙':'火',
'邭':'火',
'淃':'火',
'瓹':'火',
'睊':'火',
'絭':'火',
'惂':'火',
'欿':'火',
'敤':'火',
'翗':'火',
'衉':'火',
'迲':'火',
'涳':'火',
'悾':'火',
'窛':'火',
'袴':'火',
'跍':'火',
'絖':'火',
'嫏':'火',
'硠':'火',
'猑':'火',
'硱':'火',
'稇':'火',
'髠':'火',
'猍':'火',
'惏':'火',
'淚':'火',
'絫':'火',
'厤':'火',
'悷':'火',
'棙':'木',
'棃':'木',
'犂':'火',
'琍':'火',
'茘':'木',
'蛠':'火',
'堜':'火',
'媡':'火',
'淰':'火',
'喨':'火',
'掚':'火',
'涼':'火',
'尞':'火',
'蛚':'火',
'茢':'木',
'掕':'火',
'淩':'火',
'琌':'火',
'跉':'火',
'詅':'火',
'軨':'火',
'晽':'火',
'焛':'火',
'粦':'火',
'硦':'火',
'衖':'火',
'椂':'火',
'淥':'火',
'淕':'火',
'惀':'火',
'棆':'木',
'笿':'火',
'傌':'火',
'脈':'火',
'衇':'火',
'睌':'火',
'痝':'火',
'硥':'火',
'茻':'木',
'堥':'火',
'媌':'火',
'媢':'火',
'堳':'火',
'嵄':'火',
'珻':'火',
'痗':'火',
'睂':'火',
'脄':'火',
'跊':'火',
'淧':'火',
'喕':'火',
'媔':'火',
'覕':'火',
'捪':'火',
'庿':'火',
'凕':'火',
'蛨':'火',
'貃':'火',
'畮':'火',
'雮':'火',
'貀':'火',
'詉':'火',
'惄':'火',
'掜':'火',
'晲':'火',
'棿':'火',
'淣':'火',
'跜':'火',
'惗':'火',
'棯':'木',
'寍':'火',
'喦':'火',
'敜':'火',
'捼':'火',
'猅':'火',
'詊':'火',
'跘':'火',
'胮':'火',
'舽':'火',
'軳':'火',
'毰':'火',
'阫':'火',
'掽':'火',
'椖':'火',
'淎':'火',
'軯':'火',
'焩':'火',
'聠':'火',
'缾':'火',
'蛢':'火',
'喯':'火',
'焷':'火',
'豾':'火',
'釽':'火',
'鈚':'火',
'阰':'火',
'媥':'火',
'貵':'火',
'堷':'火',
'犃':'火',
'痡':'火',
'夡':'火',
'悽':'火',
'捿':'火',
'掑':'火',
'敧':'火',
'晵':'火',
'棄':'火',
'棊':'木',
'棲':'木',
'淒':'火',
'猉':'火',
'跒':'火',
'酠':'火',
'傔':'火',
'媊':'火',
'掔':'火',
'棈':'木',
'蚈':'火',
'鈆':'火',
'雂':'火',
'椌':'木',
'猐':'火',
'舃':'火',
'荍':'木',
'淁':'火',
'蛪':'火',
'寑':'火',
'媇':'火',
'捦':'火',
'鈙':'火',
'掅':'火',
'棾':'火',
'淸':'火',
'軽':'火',
'焭':'火',
'焪':'火',
'媝':'火',
'崷':'火',
'皳':'火',
'盚':'火',
'硞':'火',
'媣':'火',
'淭':'火',
'筁':'火',
'詓':'火',
'惓':'火',
'犈':'火',
'絟':'火',
'臸':'火',
'焫':'火',
'傇':'火',
'傛':'火',
'茙':'木',
'羢':'火',
'媃':'火',
'絍':'火',
'袵':'火',
'鈓':'火',
'靭':'火',
'筎':'火',
'袽':'火',
'惢':'火',
'甤':'火',
'閐':'火',
'傓':'火',
'歮':'火',
'趇':'火',
'雭':'火',
'喢':'火',
'硰':'火',
'焺':'火',
'貹':'火',
'阩':'火',
'弽':'火',
'畭':'火',
'蛥':'火',
'寔':'火',
'崼':'火',
'涭':'火',
'兟':'火',
'渖':'火',
'訷':'火',
'尌':'火',
'掓':'火',
'疎':'火',
'荗':'木',
'祱':'火',
'稅':'火',
'矟':'火',
'媤':'火',
'竢':'火',
'覗':'火',
'傞':'火',
'傁':'火',
'廀':'火',
'粛':'火',
'痠':'火',
'筍':'火',
'傝':'火',
'涾':'火',
'傏':'火',
'啺':'火',
'詜':'火',
'迯':'火',
'犆':'火',
'崹':'火',
'惖':'火',
'掦':'火',
'稊':'火',
'躰':'火',
'悿':'火',
'酟':'火',
'聎':'火',
'脁':'火',
'絩':'火',
'嵉':'火',
'硧':'火',
'粡':'火',
'絧':'火',
'婾':'火',
'媮':'火',
'堗':'火',
'捸':'火',
'痜':'火',
'朜':'火',
'喎':'火',
'堶':'火',
'涶':'火',
'詑':'火',
'跅':'火',
'迱':'火',
'飥':'火',
'邷':'火',
'捥':'火',
'晼':'火',
'喡':'火',
'媙':'火',
'媁':'火',
'媦':'火',
'寪':'火',
'嵔':'火',
'徫':'火',
'骩':'火',
'渂':'火',
'珳':'火',
'媉':'火',
'嵍':'火',
'祦':'火',
'惁':'火',
'晳':'火',
'焟':'火',
'焬':'火',
'琋':'火',
'翖':'火',
'奣':'火',
'勜':'火',
'傄':'火',
'閕':'火',
'棢':'木',
'蛧':'火',
'捰':'火',
'捾':'火',
'涹':'火',
'焥':'火',
'絤':'火',
'蛝':'火',
'衘':'火',
'廂':'火',
'絴':'火',
'傚':'火',
'殽':'火',
'痚':'火',
'痟':'火',
'窙':'火',
'硣':'火',
'媟':'火',
'屟':'火',
'禼':'火',
'絏':'火',
'絬':'火',
'翓':'火',
'脇':'火',
'惞':'火',
'焮':'火',
'鈊':'火',
'涬':'火',
'胷':'火',
'媗':'火',
'琁':'火',
'喣':'火',
'壻':'火',
'幁':'火',
'淢':'火',
'虛':'火',
'訹':'火',
'稄':'火',
'孲':'火',
'掗':'火',
'猒':'火',
'猚':'火',
'聐':'火',
'釾':'火',
'傜':'火',
'喓':'火',
'婹':'火',
'筄':'火',
'喭':'火',
'嵃':'火',
'嵒':'火',
'嵓':'火',
'敥':'火',
'琂':'火',
'傟':'火',
'崵':'火',
'敭':'火',
'詇':'火',
'阦':'火',
'幆':'火',
'崺':'火',
'旑':'火',
'敡':'火',
'晹':'火',
'棭':'木',
'殔':'火',
'焲':'火',
'異':'火',
'羠':'火',
'蛜':'火',
'蛡':'火',
'蛦':'火',
'詍':'火',
'跇':'火',
'鈠':'火',
'頉':'火',
'鳦':'火',
'殗':'火',
'淾':'火',
'猌':'火',
'筃':'火',
'裀':'火',
'鈏':'火',
'鈝':'火',
'詠':'火',
'亴':'火',
'貁':'火',
'喅':'火',
'喩':'火',
'堣':'火',
'堬':'火',
'媀':'火',
'崳':'火',
'庽':'火',
'惌':'火',
'惐':'火',
'棜':'木',
'棛':'木',
'焴':'火',
'硢':'火',
'茟':'木',
'茰':'木',
'傆':'火',
'棩':'木',
'渁':'火',
'捳':'火',
'鈅':'火',
'傊':'火',
'喗':'火',
'鈗':'火',
'阭':'火',
'喒':'火',
'崱':'火',
'趈':'火',
'飦':'火',
'涱':'火',
'淛':'火',
'媜':'火',
'寊':'火',
'晸':'火',
'掟':'火',
'掙':'火',
'猙':'火',
'証':'火',
'傂':'火',
'崻':'火',
'淽':'火',
'猘':'火',
'阯':'火',
'堹':'火',
'喠':'火',
'媑':'火',
'尰':'火',
'筗':'火',
'鈡':'火',
'喌':'火',
'晭':'火',
'淍':'火',
'詋':'火',
'嵀':'火',
'絑':'火',
'茿':'木',
'袾':'火',
'註':'火',
'軴':'火',
'跓':'火',
'堟':'火',
'粧':'火',
'斮':'火',
'棳':'火',
'啙':'火',
'椔':'木',
'胾':'火',
'茡':'木',
'訿':'火',
'堫':'火',
'嵏':'火',
'惣':'火',
'捴':'火',
'猔':'火',
'棷':'木',
'掫':'火',
'棸':'火',
'椊':'木',
'晬':'火',
'幹':'土',
'义':'土',
'義':'土',
'仅':'土',
'僅':'土',
'节':'土',
'節':'土',
'业':'土',
'業':'木',
'电':'土',
'電':'土',
'号':'土',
'號':'土',
'汇':'土',
'匯':'土',
'彙':'土',
'圣':'土',
'聖':'土',
'扬':'土',
'揚':'土',
'夸':'土',
'誇':'土',
'当':'土',
'當':'土',
'吗':'土',
'嗎':'土',
'岁':'土',
'歲':'土',
'回':'土',
'迴':'土',
'传':'土',
'傳':'土',
'伤':'土',
'傷':'土',
'会':'土',
'會':'土',
'爷':'土',
'爺':'土',
'庄':'土',
'莊':'木',
'汤':'土',
'湯':'土',
'农':'土',
'農':'土',
'妈':'土',
'媽':'土',
'驮':'土',
'馱':'土',
'驯':'土',
'馴':'土',
'驰':'水',
'馳':'土',
'块':'土',
'塊':'土',
'极':'土',
'極':'木',
'杨':'木',
'楊':'土',
'裏':'土',
'园':'土',
'園':'土',
'呛':'土',
'嗆':'土',
'呜':'土',
'嗚':'土',
'乱':'土',
'亂':'土',
'佣':'土',
'傭':'土',
'犹':'土',
'猶':'土',
'饭':'土',
'飯':'土',
'饮':'土',
'飲':'土',
'补':'土',
'補':'土',
'阿':'土',
'阻':'土',
'附':'土',
'拣':'土',
'揀':'土',
'势':'火',
'勢':'土',
'茎':'木',
'莖':'木',
'枫':'木',
'楓':'土',
'郁':'土',
'郊':'土',
'闸':'水',
'閘':'土',
'试':'土',
'試':'土',
'诗':'金',
'詩':'土',
'话':'金',
'話':'土',
'诡':'土',
'詭':'土',
'询':'土',
'詢':'土',
'该':'土',
'該':'土',
'详':'土',
'詳':'土',
'肃':'土',
'肅':'土',
'经':'水',
'經':'土',
'挥':'土',
'揮':'土',
'竖':'土',
'竪':'土',
'追':'土',
'逃':'土',
'迹':'土',
'送':'土',
'迷':'土',
'逆':'土',
'炼':'土',
'煉':'土',
'测':'土',
'測':'土',
'浑':'土',
'渾':'土',
'恼':'土',
'惱':'土',
'退':'土',
'绑':'水',
'綁':'土',
'顽':'土',
'頑':'土',
'盏':'土',
'盞':'土',
'载':'金',
'載':'土',
'莫':'木',
'莉':'木',
'荷':'木',
'贾':'金',
'賈':'土',
'较':'土',
'較':'土',
'顿':'土',
'頓':'土',
'晕':'土',
'暈':'土',
'圆':'土',
'圓':'土',
'贼':'土',
'賊':'土',
'贿':'土',
'賄':'土',
'赂':'土',
'賂':'土',
'钳':'土',
'鉗':'土',
'钾':'土',
'鉀':'土',
'铃':'土',
'鈴':'土',
'铅':'土',
'鉛':'土',
'债':'土',
'債':'土',
'倾':'土',
'傾':'土',
'赁':'土',
'賃':'土',
'爱':'土',
'愛':'土',
'颁':'土',
'頒':'土',
'颂':'土',
'頌':'土',
'资':'金',
'資':'土',
'烦':'土',
'煩':'土',
'涡':'土',
'渦':'土',
'涂':'土',
'塗':'土',
'涌':'土',
'湧':'土',
'预':'土',
'預':'土',
'绢':'水',
'絹':'土',
'綉':'土',
'描':'土',
'脖':'土',
'脯':'土',
'脱':'土',
'猪':'土',
'猫':'土',
'焕':'火',
'渠':'土',
'琴':'土',
'琳':'土',
'琢':'土',
'揍':'土',
'塔':'土',
'揩':'土',
'提':'金',
'揭':'土',
'揣':'土',
'插':'土',
'揪':'土',
'搜':'土',
'援':'土',
'握':'金',
'揉':'土',
'惹':'土',
'募':'土',
'敬':'土',
'椰':'土',
'榔':'土',
'厦':'土',
'廈':'土',
'睐':'土',
'睞':'土',
'鼎':'土',
'蜓':'火',
'蜒':'土',
'傲':'土',
'艇':'土',
'禽':'土',
'猩':'土',
'猬':'土',
'猴':'土',
'装':'土',
'裝':'土',
'港':'土',
'湖':'水',
'湘':'水',
'渣':'土',
'渤':'土',
'渺':'土',
'温':'土',
'渴':'土',
'湃':'土',
'渝':'水',
'渡':'土',
'游':'土',
'渲':'土',
'溉':'土',
'惰':'土',
'愕':'土',
'愣':'土',
'惶':'土',
'愉':'土',
'慨':'土',
'裕':'火',
'裙':'火',
'嫂':'土',
'肆':'土',
'填':'土',
'塌':'土',
'鼓':'土',
'塘':'土',
'聘':'土',
'斟':'土',
'勤':'火',
'靴':'土',
'靶':'土',
'椿':'木',
'禁':'土',
'楚':'土',
'楷':'木',
'想':'土',
'榆':'木',
'概':'木',
'酪':'土',
'酬':'土',
'感':'土',
'碘':'土',
'碑':'土',
'碎':'土',
'碰':'土',
'碗':'土',
'碌':'土',
'雷':'土',
'零':'土',
'雹':'土',
'督':'土',
'睛':'土',
'睦':'土',
'睫':'土',
'睡':'土',
'睬':'土',
'嗜':'土',
'嗦':'土',
'愚':'土',
'暖':'火',
'盟':'土',
'歇':'土',
'暗':'土',
'暇':'土',
'照':'火',
'畸':'土',
'跨':'土',
'跳':'土',
'跺':'土',
'跪':'土',
'路':'土',
'跤':'土',
'跟':'土',
'蜈':'土',
'蛾':'土',
'蜂':'火',
'蜕':'土',
'嗅':'土',
'嗡':'土',
'嗓':'土',
'蜀':'土',
'幌':'土',
'矮':'土',
'稚':'土',
'稠':'土',
'愁':'土',
'筷':'土',
'毁':'土',
'舅':'土',
'鼠':'土',
'催':'土',
'傻':'土',
'躲':'土',
'衙':'土',
'微':'土',
'愈':'土',
'解':'土',
'煞':'土',
'禀':'土',
'痹':'土',
'痴':'土',
'痰':'土',
'廉':'土',
'靖':'土',
'新':'土',
'韵':'土',
'意':'土',
'煎':'土',
'塑':'土',
'煤':'土',
'煌':'土',
'粱':'土',
'塞':'土',
'窟':'土',
'群':'土',
'殿':'土',
'媳':'土',
'嫉':'土',
'嫌':'土',
'嫁':'土',
'叠':'水',
'雌':'土',
'伛':'土',
'傴':'土',
'犸':'土',
'獁':'土',
'凫':'土',
'鳧':'土',
'坞':'土',
'塢':'土',
'苋':'木',
'莧':'木',
'旸':'土',
'暘':'土',
'佥':'土',
'僉':'土',
'鸠':'火',
'鳩':'土',
'饨':'土',
'飩':'土',
'饪':'土',
'飪':'土',
'饫':'土',
'飫':'土',
'饬':'土',
'飭':'土',
'炀':'土',
'煬':'土',
'沨':'土',
'渢':'土',
'陀':'土',
'陂':'土',
'茔':'木',
'塋':'土',
'茕':'土',
'煢':'土',
'郅':'土',
'黾':'土',
'黽':'土',
'邾':'土',
'郄':'土',
'郇':'土',
'炜':'火',
'煒':'土',
'诓':'土',
'誆':'土',
'诔':'土',
'誄':'土',
'诖':'土',
'詿':'土',
'诘':'土',
'詰':'土',
'诙':'土',
'詼':'土',
'诛':'土',
'誅':'土',
'诜':'土',
'詵':'土',
'诟':'土',
'詬':'土',
'诠':'土',
'詮':'土',
'诣':'土',
'詣':'土',
'诧':'土',
'詫':'土',
'诩':'土',
'詡':'土',
'荚':'木',
'莢':'木',
'莒':'木',
'莛':'木',
'逅':'土',
'胫':'土',
'脛':'土',
'逄':'土',
'恻':'土',
'惻':'土',
'恽':'土',
'惲':'土',
'顼':'土',
'頊':'土',
'琤':'土',
'埘':'土',
'塒':'土',
'埙':'土',
'塤':'土',
'荸':'木',
'莆':'木',
'莪':'木',
'莠':'木',
'莓':'木',
'莜':'木',
'莅':'木',
'荼':'木',
'莩':'木',
'荽':'木',
'荻':'木',
'莘':'木',
'莎':'木',
'莞':'木',
'莨':'木',
'桢':'土',
'楨':'木',
'轼':'金',
'軾':'土',
'轾':'金',
'輊':'土',
'辂':'土',
'輅':'土',
'蚬':'土',
'蜆':'土',
'唢':'土',
'嗩':'土',
'赅':'土',
'賅':'土',
'钰':'金',
'鈺':'土',
'钲':'土',
'鉦':'土',
'钴':'土',
'鈷':'土',
'钵':'土',
'鉢':'土',
'钹':'土',
'鈸':'土',
'钺':'土',
'鉞':'土',
'钽':'土',
'鉭':'土',
'钼':'土',
'鉬':'土',
'钿':'土',
'鈿':'土',
'铀':'土',
'鈾':'土',
'铂':'金',
'鉑':'土',
'铆':'土',
'鉚':'土',
'铈':'土',
'鈰':'土',
'铉':'土',
'鉉':'土',
'铊':'土',
'鉈':'土',
'铋':'土',
'鉍':'土',
'铌':'土',
'鈮':'土',
'铍':'土',
'鈹':'土',
'笕':'土',
'筧':'土',
'颀':'土',
'頎':'土',
'袅':'土',
'裊':'土',
'颃':'土',
'頏':'土',
'绠':'土',
'綆':'土',
'绡':'土',
'綃':'土',
'绥':'水',
'綏':'土',
'绨':'土',
'綈':'土',
'揶':'土',
'啬':'土',
'嗇':'土',
'偻':'土',
'僂':'土',
'脬':'土',
'脘':'土',
'脲':'土',
'羟':'土',
'羥':'土',
'惬':'土',
'愜':'土',
'琫':'土',
'琵':'土',
'琶':'土',
'琪':'土',
'琦':'土',
'琥':'土',
'琨':'土',
'琰':'土',
'琮':'土',
'琯':'土',
'琬':'土',
'琛':'土',
'琚':'土',
'揳':'土',
'揸':'土',
'揠':'土',
'揖':'土',
'揄':'土',
'揆':'土',
'掾':'土',
'靸':'土',
'楮':'土',
'殛':'土',
'戢':'土',
'嗒':'土',
'蛱':'土',
'蛺':'土',
'嗖':'土',
'嗟':'土',
'嗞':'土',
'嵬':'土',
'嵯':'土',
'嵫':'土',
'毽':'土',
'犍':'土',
'筵':'土',
'猢':'土',
'猹':'土',
'猥':'土',
'猱':'土',
'裒':'土',
'瓿':'土',
'孳':'土',
'湛':'土',
'渫':'土',
'湮':'土',
'湎':'土',
'湜':'土',
'渭':'土',
'湍':'土',
'湫':'土',
'湟':'土',
'溆':'土',
'湲':'土',
'湔':'土',
'湉':'土',
'渥':'土',
'湄':'土',
'愠':'土',
'惺':'土',
'惴':'土',
'愀':'土',
'愎':'土',
'愔':'土',
'裎':'土',
'祾':'土',
'祺':'火',
'巯':'土',
'巰':'土',
'髡':'土',
'塬':'土',
'趔':'土',
'趑':'土',
'蜇':'土',
'彀':'土',
'戡':'土',
'靳':'土',
'楔':'木',
'楠':'木',
'楂':'木',
'楝':'木',
'楫':'木',
'楸':'木',
'椴':'土',
'楯':'木',
'皙':'土',
'楦':'木',
'楣':'木',
'楹':'土',
'椽':'木',
'裘':'土',
'剽':'土',
'酮':'土',
'酰':'土',
'酯':'土',
'酩':'土',
'蜃':'土',
'碓':'土',
'硼':'土',
'碉':'土',
'碚':'土',
'碇':'土',
'粲':'土',
'虞':'土',
'睚':'土',
'嗪':'土',
'嗉':'土',
'睨':'土',
'睢':'土',
'雎':'土',
'睥':'土',
'嗑':'土',
'嗬':'土',
'嗔':'土',
'嗝':'土',
'戥':'土',
'嗄':'土',
'煦':'火',
'暄':'火',
'暌':'土',
'跬':'土',
'跣':'土',
'蛸':'土',
'蜊':'土',
'蜍':'土',
'蜉':'土',
'畹':'土',
'蛹':'土',
'嗣':'土',
'嗯':'土',
'嗥':'土',
'嗲':'土',
'嗌':'土',
'嗍':'土',
'嗨':'土',
'嗐':'土',
'嗤':'土',
'嗵':'土',
'嵊':'土',
'嵩':'土',
'嵴':'土',
'雉':'土',
'犏':'土',
'歃':'土',
'稞':'土',
'稗':'土',
'稔':'土',
'筠':'土',
'筢':'土',
'筮':'土',
'筲':'土',
'筱':'土',
'牒':'土',
'煲':'土',
'敫':'土',
'徭':'土',
'愆':'土',
'艄':'土',
'毹':'土',
'貊':'土',
'貅':'土',
'貉':'土',
'塍':'土',
'媵':'土',
'詹':'土',
'肄':'土',
'觥':'土',
'亶':'土',
'瘃':'土',
'痱':'土',
'痼':'土',
'痿':'土',
'瘁':'土',
'麂':'土',
'裔':'土',
'歆':'土',
'旒':'水',
'雍':'土',
'羧':'土',
'豢':'土',
'粳':'土',
'猷':'土',
'煳':'土',
'煜':'火',
'煨':'土',
'煅':'土',
'煊':'火',
'煸':'土',
'煺':'土',
'裟':'土',
'窠':'土',
'窣':'土',
'媾':'土',
'媲':'土',
'媸':'土',
'毓':'土',
'阽':'土',
'阼':'土',
'邽':'土',
'邿':'土',
'郈':'土',
'郃':'土',
'垲':'土',
'塏':'土',
'迺':'土',
'钜':'土',
'鉅':'土',
'浈':'土',
'湞':'土',
'莰':'土',
'茝':'木',
'莝':'木',
'莙':'木',
'辀':'土',
'輈':'土',
'辁':'土',
'輇':'土',
'唝':'土',
'嗊':'土',
'晖':'土',
'暉':'土',
'钷':'土',
'鉕':'土',
'脩':'土',
'鱽':'土',
'魛':'土',
'绤':'土',
'綌':'土',
'壸':'土',
'壼':'土',
'勚':'土',
'勣':'土',
'趼':'土',
'脞':'土',
'脟':'土',
'竫':'土',
'珷':'土',
'琲':'土',
'琡':'土',
'琟':'土',
'琔':'土',
'琭':'土',
'揕':'土',
'楗':'木',
'筥':'土',
'翛':'土',
'猰':'土',
'猯':'土',
'廋':'土',
'廆':'土',
'湝':'土',
'渰':'土',
'湓':'土',
'渟':'土',
'渼':'土',
'湣':'土',
'湑':'土',
'愐':'土',
'愃':'土',
'祼':'土',
'髢':'土',
'塥':'土',
'塝':'土',
'椹':'土',
'楪':'木',
'榃':'土',
'榅':'土',
'楒':'土',
'楞':'木',
'楩':'木',
'椸':'土',
'楙':'土',
'歅':'土',
'碃':'土',
'碏':'土',
'碈':'土',
'硿':'土',
'觜':'木',
'暕':'土',
'暅':'土',
'跱':'土',
'蜐':'土',
'蜎':'土',
'嵲':'土',
'稑':'土',
'稙':'土',
'筻':'土',
'筶':'土',
'筦':'土',
'筤':'土',
'傺':'土',
'僇':'土',
'艅':'土',
'艉':'土',
'谼':'土',
'貆':'土',
'雊':'土',
'觟':'土',
'裛':'土',
'瘀':'土',
'麀':'土',
'煁':'土',
'煃':'土',
'煴':'土',
'煋':'土',
'煟':'土',
'煓':'土',
'塱':'土',
'愍':'土',
'嫄':'土',
'媱':'土',
'戤':'土',
'勠':'土',
'戣':'土',
'湋':'土',
'暐':'土',
'詷':'土',
'詪':'土',
'綎':'土',
'綖':'土',
'頍':'土',
'輄':'土',
'輋':'土',
'鉥':'土',
'鉮':'土',
'鉊':'土',
'鉧':'土',
'絺':'土',
'綄':'土',
'煥':'土',
'祿':'土',
'徬':'土',
'稖':'土',
'雵':'土',
'蛽':'土',
'寚':'土',
'鉋':'土',
'揞':'土',
'痷':'土',
'雸':'土',
'厫':'土',
'奧':'土',
'媼':'土',
'斒':'土',
'鉡':'土',
'楍':'土',
'塧':'土',
'嵦':'土',
'阸':'土',
'僃':'土',
'愂':'土',
'痺':'土',
'惼':'土',
'揙':'土',
'牑':'土',
'猵':'土',
'閞':'土',
'碆':'土',
'莂':'木',
'琕':'土',
'稟':'土',
'鈵':'土',
'誁':'土',
'陃':'土',
'嗙':'土',
'嵭':'土',
'琣':'土',
'痭':'土',
'跰':'土',
'愊':'土',
'楅':'土',
'湢':'土',
'煏':'土',
'睤':'土',
'蜌':'土',
'閟':'土',
'荹':'木',
'鈽':'土',
'钸':'土',
'鳪':'土',
'傪':'土',
'湌':'土',
'嵢':'土',
'傮':'土',
'矠':'土',
'筴':'土',
'筞':'土',
'碀':'土',
'喍':'土',
'剷':'土',
'湹':'土',
'煘':'土',
'脠':'土',
'鉆':'土',
'莗':'木',
'蛼':'土',
'嗏':'土',
'嫅':'土',
'詧':'土',
'琩':'土',
'甞':'土',
'勦':'土',
'塖':'土',
'塣':'土',
'揨':'土',
'筬':'土',
'絾':'土',
'脭':'土',
'荿':'木',
'阷':'土',
'愖':'土',
'莀':'木',
'莐':'木',
'湁':'土',
'痸':'土',
'觢':'土',
'誃':'土',
'趍':'土',
'跮':'土',
'鉓':'土',
'雴':'土',
'揰':'土',
'皗':'土',
'詶':'土',
'酧':'土',
'媰':'土',
'耡':'土',
'荲':'木',
'趎':'土',
'鉏':'土',
'歂':'土',
'猭':'土',
'傸':'土',
'牎':'土',
'湷':'土',
'惷':'土',
'暙':'土',
'脣':'土',
'畷':'土',
'酫':'土',
'嵳':'土',
'瘄':'土',
'脨':'土',
'麁':'土',
'凗':'土',
'嵟':'土',
'琗':'土',
'愡':'土',
'楤':'木',
'傶':'土',
'楱':'木',
'湊':'土',
'莡':'木',
'跢':'土',
'窞':'土',
'蜑':'土',
'嵣':'土',
'愓':'土',
'瓽':'土',
'雼':'土',
'幍':'土',
'禂':'土',
'豋':'土',
'僀':'土',
'揥':'土',
'楴':'木',
'渧':'土',
'鉪':'土',
'阺':'土',
'馰':'土',
'惵':'土',
'揲':'土',
'殜':'土',
'牃':'土',
'镻':'土',
'湩':'土',
'筩':'土',
'迵':'土',
'嵮':'土',
'琠':'土',
'痶':'土',
'蜔':'土',
'琱':'土',
'竨':'土',
'誂':'土',
'暏':'土',
'荰':'木',
'脰':'土',
'荳':'木',
'塠':'土',
'痽':'土',
'綐':'土',
'逇':'土',
'椯':'土',
'莌':'木',
'跥':'土',
'躱':'土',
'圔':'土',
'廅':'土',
'湂':'土',
'琧':'土',
'痾':'土',
'詻':'土',
'鈳':'土',
'钶':'土',
'頋':'土',
'渳':'土',
'誀':'土',
'輀':'土',
'飰':'土',
'豥':'土',
'賌':'土',
'郂':'土',
'剻':'土',
'椱':'土',
'馚':'土',
'圑':'土',
'暊':'土',
'筟':'土',
'粰':'土',
'綍':'土',
'綒':'土',
'罦':'土',
'艀':'土',
'荴':'木',
'蜅':'土',
'鉘':'土',
'鉜':'土',
'颫':'土',
'尲':'土',
'骭':'土',
'煰':'土',
'睪':'土',
'愅':'土',
'渮':'土',
'裓':'土',
'觡':'土',
'揯':'土',
'莄':'木',
'湗':'土',
'煈':'土',
'犎':'土',
'猦':'土',
'綘':'土',
'艂':'土',
'莑':'木',
'豊':'土',
'幊':'土',
'輁':'土',
'鉤':'土',
'尳':'土',
'祻':'土',
'稒':'土',
'鈲':'土',
'鼔':'土',
'歄':'土',
'煱':'土',
'趏':'土',
'痯':'土',
'窤':'土',
'媿':'土',
'敮':'土',
'湀':'土',
'猤':'土',
'觤':'土',
'郌':'土',
'睔':'土',
'楇':'土',
'聕':'土',
'貈':'土',
'嗃':'土',
'暍':'土',
'楁':'土',
'毼':'土',
'煂':'土',
'猲':'土',
'碋':'土',
'詥':'土',
'鉌':'土',
'傼':'土',
'椷':'土',
'甝':'土',
'筨':'土',
'莟':'木',
'蛿':'土',
'馯':'土',
'畵':'土',
'揘':'土',
'楻':'土',
'脝':'土',
'嵤':'土',
'揈':'土',
'渱':'土',
'渹':'土',
'綋':'土',
'翝':'土',
'愌':'土',
'換':'土',
'渙':'土',
'羦':'土',
'詤':'土',
'嗀':'土',
'楛':'木',
'楜':'木',
'綔':'土',
'雽':'土',
'楎':'土',
'毀':'土',
'湏':'土',
'煇':'土',
'詯':'土',
'惽':'土',
'睧':'土',
'旤':'土',
'湱':'土',
'窢':'土',
'兾':'土',
'嗘':'土',
'塉':'土',
'嵠':'土',
'揤':'土',
'楖':'土',
'湒':'土',
'痵':'土',
'稘':'土',
'莋':'木',
'裚':'土',
'趌':'土',
'跡':'土',
'郆':'土',
'魝':'土',
'幏':'土',
'椵':'土',
'犌':'土',
'猳':'土',
'脥':'土',
'裌':'土',
'跲':'土',
'鉫':'土',
'弿':'土',
'揃':'土',
'揵':'土',
'旔':'土',
'椾':'土',
'減':'土',
'湕':'土',
'碊':'土',
'絸':'土',
'豣':'土',
'勥':'土',
'傹':'土',
'畺':'土',
'湬':'土',
'煍':'土',
'詨':'土',
'賋':'土',
'厪':'土',
'寖':'土',
'煡':'土',
'靲':'土',
'嵥':'土',
'楐':'土',
'楬':'木',
'楶':'木',
'煯':'土',
'蛶':'土',
'迼':'土',
'鉣':'土',
'煚':'土',
'匓':'土',
'揂':'土',
'揫':'土',
'韮':'土',
'楀':'土',
'榘':'木',
'湨':'土',
'犑':'土',
'豦':'土',
'輂':'土',
'睠':'土',
'罥':'土',
'脧':'土',
'裐':'土',
'雋':'土',
'飬':'土',
'殾':'土',
'碅':'土',
'愒':'土',
'輆':'土',
'歁':'土',
'嵪':'土',
'愘':'土',
'愙':'土',
'揢':'土',
'犐':'土',
'閜':'土',
'豤':'土',
'貇':'土',
'硻':'土',
'剾':'土',
'郀':'土',
'楏':'土',
'楑':'土',
'歀':'土',
'軭':'土',
'邼':'土',
'艆':'土',
'蜋':'土',
'稛':'土',
'綑':'土',
'蜫':'土',
'裍':'土',
'揦':'土',
'揧':'土',
'楋':'土',
'琜':'土',
'嗠':'土',
'傫':'土',
'睖':'土',
'碐':'土',
'稜':'土',
'剺':'土',
'塛':'土',
'睙':'土',
'睝':'土',
'筣':'土',
'艃':'土',
'鉝':'土',
'鳨':'土',
'僆':'土',
'湅':'土',
'湸':'土',
'煭':'土',
'聗':'土',
'迾':'土',
'閝':'土',
'阾':'土',
'亃':'土',
'痳':'土',
'碄':'土',
'媹':'土',
'嵧':'土',
'廇':'土',
'裗':'土',
'湰':'土',
'剹':'土',
'盝':'土',
'睩':'土',
'碖':'土',
'稐':'土',
'痲':'土',
'僈':'土',
'愗':'土',
'暓':'土',
'渵':'土',
'毷':'土',
'媺':'土',
'楳':'木',
'湈':'土',
'煝':'土',
'猸':'土',
'脢':'土',
'鬽':'土',
'瓾':'土',
'莔':'木',
'雺':'土',
'塓':'土',
'幎':'土',
'覛':'土',
'詸':'土',
'絻':'土',
'莬':'木',
'暋':'土',
'琘':'土',
'琝':'土',
'痻':'土',
'鈱':'土',
'嫇':'土',
'詺':'土',
'湐':'土',
'莈':'木',
'楘':'土',
'郍':'土',
'靹':'土',
'渿':'土',
'暔':'土',
'揇':'土',
'湳':'土',
'莮':'木',
'嫐':'土',
'閙':'土',
'脮':'土',
'孴':'土',
'鉨':'土',
'寗':'土',
'嫋':'土',
'揑':'土',
'鉩':'土',
'莥':'木',
'靵':'土',
'渜':'土',
'煖':'土',
'煗':'土',
'愞':'土',
'掿':'土',
'媻':'土',
'幋':'土',
'嫎':'土',
'傰':'土',
'塜':'土',
'稝':'土',
'軿':'土',
'閛':'土',
'甁':'土',
'揊':'土',
'鉟':'土',
'楄':'土',
'賆':'土',
'僄':'土',
'勡':'土',
'湆':'土',
'湇':'土',
'碁':'土',
'碕':'土',
'嗛':'土',
'嵰':'土',
'煔':'土',
'皘':'土',
'跫':'土',
'嫀':'土',
'綅':'土',
'暒':'土',
'惸':'土',
'睘':'土',
'渞':'土',
'湭':'土',
'煪':'土',
'絿':'土',
'脙':'土',
'莍':'木',
'蛷':'土',
'塙':'土',
'琷':'土',
'皵':'土',
'裠':'土',
'羣':'土',
'阹':'土',
'湶':'土',
'觠':'土',
'跧':'土',
'渃':'土',
'媶':'土',
'嫆':'土',
'渘':'土',
'楺':'木',
'煣':'土',
'脜':'土',
'荵':'木',
'魜':'土',
'嗕':'土',
'媷':'土',
'渪':'土',
'楉':'土',
'揌':'土',
'愢':'土',
'毸':'土',
'喿':'土',
'剼':'土',
'睒':'土',
'銏':'土',
'歰':'土',
'翜':'土',
'旓':'土',
'莦':'木',
'渻':'土',
'湦':'土',
'鉎':'土',
'鉇':'土',
'戠':'土',
'揓':'土',
'湤':'土',
'睗':'土',
'跩':'土',
'鉃':'土',
'鉂':'土',
'鉐':'土',
'脤':'土',
'蜄':'土',
'裑':'土',
'毺':'土',
'綀':'土',
'裋':'土',
'揎':'土',
'蛻':'土',
'裞':'土',
'揗':'土',
'揱':'土',
'貄':'土',
'鈶':'土',
'鈻':'土',
'傱':'土',
'硹':'土',
'莏':'木',
'塐':'土',
'嫊':'土',
'莤':'木',
'筭':'土',
'煫':'土',
'睟':'土',
'荾':'木',
'飱':'土',
'嫍':'土',
'祹':'土',
'絛':'土',
'脦':'土',
'嗁':'土',
'惿':'土',
'罤':'土',
'僋':'土',
'湠':'土',
'塡':'土',
'睓':'土',
'覜':'土',
'趒':'土',
'鉄':'土',
'楟':'木',
'筳':'土',
'脡':'土',
'綂':'土',
'赨':'土',
'鉖':'土',
'牏':'土',
'嵞':'土',
'揬':'土',
'湥':'土',
'筡':'土',
'鈯':'土',
'脫':'土',
'剸':'土',
'湪':'土',
'楕':'土',
'毻':'土',
'陁':'土',
'馲':'土',
'嗗':'土',
'嗢':'土',
'睕':'土',
'脕':'土',
'愄':'土',
'愇':'土',
'揋':'土',
'椲':'土',
'椳':'土',
'楲':'木',
'渨':'土',
'荱':'木',
'詴':'土',
'骪':'土',
'骫':'土',
'脗':'土',
'奦':'土',
'嵨':'土',
'碔':'土',
'莁':'木',
'茣':'木',
'誈':'土',
'僁':'土',
'厀':'土',
'媐':'土',
'徯':'土',
'椺':'土',
'莃':'木',
'赩':'土',
'郋':'土',
'塕':'土',
'嵡':'土',
'煆':'土',
'筪':'土',
'舝':'土',
'颬':'土',
'楃':'木',
'猧':'土',
'僊':'土',
'尟':'土',
'尠':'土',
'湺':'土',
'粯':'土',
'羨':'土',
'跭':'土',
'嗋':'土',
'綊':'土',
'脪':'土',
'莕':'木',
'蛵':'土',
'郉':'土',
'詾':'土',
'綇':'土',
'臹':'土',
'愋':'土',
'楥':'木',
'蜁':'土',
'揟':'土',
'楈':'土',
'賉':'土',
'迿':'土',
'瘂':'土',
'稏':'土',
'嗂':'土',
'楆':'土',
'趐':'土',
'傿':'土',
'愝':'土',
'揜':'土',
'椻':'土',
'椼':'土',
'楌':'土',
'渷':'土',
'煙':'土',
'硽':'土',
'莚':'木',
'詽':'土',
'鳫':'土',
'楧':'木',
'鉠':'土',
'亄':'土',
'暆':'土',
'湙':'土',
'痬':'土',
'竩':'土',
'跠':'土',
'迻':'土',
'骮':'土',
'煠':'土',
'湚':'土',
'碒':'土',
'荶':'木',
'靷':'土',
'飮':'土',
'僌':'土',
'嫈':'土',
'暎':'土',
'朠':'土',
'渶':'土',
'煐':'土',
'嗈':'土',
'塎':'土',
'嵱':'土',
'彮':'土',
'愑':'土',
'楢':'木',
'湵':'土',
'蜏':'土',
'迶':'土',
'酭':'土',
'寙':'土',
'斞':'土',
'楡':'木',
'楰':'木',
'歈':'土',
'湡':'土',
'琙':'土',
'稢':'土',
'骬':'土',
'媴':'土',
'猨':'土',
'荺':'木',
'鉔':'土',
'韴':'土',
'渽':'土',
'酨':'土',
'揝':'土',
'鉙':'土',
'塟':'土',
'艁':'土',
'牐':'土',
'琖':'土',
'閚':'土',
'傽':'土',
'痮':'土',
'塦':'土',
'嫃':'土',
'揁':'土',
'絼':'土',
'裖':'土',
'鉁':'土',
'靕':'土',
'徰':'土',
'睜':'土',
'寘':'土',
'瓡':'土',
'禃':'土',
'筫':'土',
'綕':'土',
'塚':'土',
'歱':'土',
'煄':'土',
'睭':'土',
'煑':'土',
'筯':'土',
'莇':'木',
'跦':'土',
'鉒':'土',
'馵':'土',
'窡':'土',
'甀':'土',
'稕':'土',
'斱':'土',
'琸':'土',
'硺':'土',
'鈭':'土',
'傯':'土',
'惾':'土',
'揔':'土',
'朡':'土',
'椶':'土',
'猣':'土',
'碂':'土',
'稡':'土',
'祽':'土',
'辠':'土',
'稓':'土',
'筰':'土',
'鈼':'土',
'与':'金',
'與':'金',
'么':'金',
'麽':'金',
'仆':'金',
'僕':'金',
'凤':'火',
'鳳':'金',
'认':'金',
'認':'金',
'灭':'金',
'滅':'金',
'叹':'金',
'嘆':'金',
'尔':'金',
'爾':'金',
'髪':'金',
'对':'金',
'對':'金',
'台':'金',
'臺':'金',
'颱':'金',
'厌':'金',
'厭':'金',
'夺':'金',
'奪':'金',
'划':'金',
'劃':'金',
'尘':'金',
'塵':'金',
'团':'金',
'團':'金',
'网':'金',
'網':'金',
'华':'金',
'華':'金',
'伙':'金',
'夥':'金',
'伪':'金',
'僞':'金',
'合':'金',
'閤':'金',
'齐':'金',
'齊':'金',
'尽':'金',
'盡':'金',
'寿':'金',
'壽':'金',
'抢':'金',
'搶':'金',
'连':'金',
'連':'金',
'呕':'金',
'嘔':'金',
'岖':'金',
'嶇':'金',
'这':'金',
'這':'金',
'沧':'水',
'滄':'金',
'沟':'金',
'溝':'金',
'纲':'水',
'綱':'金',
'驳':'金',
'駁':'金',
'枪':'金',
'槍':'金',
'构':'木',
'構':'木',
'态':'金',
'態':'金',
'肾':'水',
'腎':'金',
'畅':'金',
'暢':'金',
'鸣':'金',
'鳴':'金',
'图':'金',
'圖':'金',
'制':'金',
'製':'金',
'侥':'金',
'僥':'金',
'侨':'金',
'僑':'金',
'胀':'金',
'脹':'金',
'肮':'金',
'骯':'金',
'饰':'金',
'飾':'金',
'饱':'金',
'飽':'金',
'饲':'金',
'飼':'金',
'实':'土',
'實':'金',
'郎':'金',
'诚':'金',
'誠':'金',
'诞':'金',
'誕':'金',
'陋':'金',
'陌':'金',
'降':'金',
'限':'金',
'线':'水',
'綫':'金',
'赵':'金',
'趙':'金',
'垫':'金',
'墊':'金',
'荣':'木',
'榮':'木',
'荧':'木',
'熒':'金',
'轻':'金',
'輕':'金',
'尝':'金',
'嘗':'金',
'种':'金',
'種':'金',
'狱':'金',
'獄':'金',
'奖':'金',
'奬':'金',
'疯':'金',
'瘋':'金',
'闺':'水',
'閨':'金',
'闻':'水',
'聞':'金',
'闽':'水',
'閩':'金',
'阀':'金',
'閥':'金',
'阁':'水',
'閣':'金',
'洼':'金',
'窪':'金',
'诫':'金',
'誡':'金',
'诬':'金',
'誣':'金',
'语':'金',
'語':'金',
'误':'金',
'誤':'金',
'诱':'金',
'誘':'金',
'诲':'金',
'誨':'金',
'说':'金',
'説':'金',
'诵':'金',
'誦':'金',
'赶':'金',
'趕':'金',
'损':'金',
'損':'金',
'逝':'金',
'捣':'金',
'搗':'金',
'莽':'木',
'莱':'木',
'萊':'木',
'速':'金',
'逗':'金',
'逐':'金',
'监':'金',
'監':'金',
'紧':'金',
'緊':'金',
'逞':'金',
'造':'金',
'称':'金',
'稱':'金',
'透':'金',
'途':'金',
'逛':'金',
'逢':'金',
'准':'金',
'準':'金',
'宾':'土',
'賓':'金',
'通':'金',
'著':'金',
'菱':'金',
'菲':'木',
'萌':'金',
'菌':'金',
'萎':'金',
'菜':'金',
'萄':'金',
'菊':'木',
'菩':'金',
'萍':'金',
'菠':'金',
'菇':'木',
'梦':'木',
'夢':'金',
'硕':'土',
'碩':'金',
'辅':'金',
'輔':'金',
'崭':'金',
'嶄':'金',
'铐':'金',
'銬':'金',
'铜':'金',
'銅':'金',
'铭':'金',
'銘':'金',
'银':'金',
'銀':'金',
'衔':'金',
'銜':'金',
'领':'金',
'領':'金',
'祸':'金',
'禍':'金',
'颇':'金',
'頗':'金',
'绪':'水',
'緒':'金',
'绰':'金',
'綽':'金',
'维':'水',
'維':'金',
'绵':'水',
'綿':'金',
'绷':'水',
'綳':'金',
'绸':'水',
'綢':'金',
'综':'金',
'綜':'金',
'绽':'金',
'綻':'金',
'绿':'金',
'緑':'金',
'缀':'金',
'綴':'金',
'搭':'金',
'搓':'金',
'搔':'金',
'脾':'水',
'腋':'金',
'腔':'金',
'腕':'金',
'猾':'金',
'滑':'金',
'滋':'金',
'慌':'金',
'愧':'金',
'窝':'金',
'窩':'金',
'屡':'金',
'屢':'金',
'瑟':'金',
'瑞':'土',
'瑙':'金',
'魂':'金',
'搏':'金',
'携':'金',
'搬':'金',
'摇':'金',
'搞':'金',
'墓':'金',
'幕':'金',
'槐':'木',
'睹':'金',
'瞄':'金',
'署':'金',
'置':'金',
'罪':'金',
'罩':'金',
'像':'金',
'魁':'金',
'猿':'金',
'廓':'土',
'慈':'火',
'滇':'金',
'源':'水',
'滔':'金',
'溪':'水',
'溜':'金',
'溢':'金',
'溯':'金',
'溶':'金',
'溺':'金',
'慎':'金',
'寞':'土',
'寝':'土',
'寢':'金',
'褂':'金',
'裸':'金',
'福':'火',
'碧':'土',
'嘉':'金',
'赫':'金',
'截':'金',
'誓':'金',
'境':'金',
'聚':'金',
'熙':'火',
'兢':'金',
'榴':'金',
'榜':'金',
'榨':'金',
'榕':'木',
'歌':'金',
'酵':'金',
'酷':'金',
'酸':'金',
'碟':'金',
'碱':'金',
'碳':'金',
'需':'金',
'裳':'火',
'瞅':'金',
'墅':'金',
'嗽':'金',
'蜻':'火',
'蜘':'火',
'嘛':'金',
'嘀':'金',
'舞':'金',
'舔':'金',
'熏':'金',
'箕':'金',
'算':'金',
'管':'金',
'僚':'金',
'僧':'土',
'鼻':'金',
'貌':'金',
'疑':'金',
'孵':'金',
'裹':'金',
'敲':'金',
'豪':'金',
'腐':'金',
'辣':'金',
'彰':'金',
'竭':'金',
'端':'金',
'旗':'水',
'精':'金',
'粹':'金',
'歉':'金',
'熄':'金',
'熔':'火',
'煽':'金',
'寨':'土',
'寡':'土',
'察':'土',
'蜜':'金',
'寥':'土',
'肇':'金',
'嫩':'金',
'翠':'金',
'熊':'金',
'凳':'火',
'苌':'木',
'萇':'金',
'奁':'金',
'奩':'金',
'忾':'金',
'愾':'金',
'怆':'金',
'愴':'金',
'妪':'金',
'嫗':'金',
'纶':'金',
'綸':'金',
'玮':'金',
'瑋':'金',
'砀':'金',
'碭':'金',
'郏':'金',
'郟':'金',
'鸢':'火',
'鳶':'金',
'戗':'金',
'戧':'金',
'饴':'金',
'飴':'金',
'疡':'金',
'瘍':'金',
'炝':'金',
'熗':'金',
'祎':'金',
'禕':'金',
'陔':'金',
'郝':'金',
'荥':'木',
'滎':'金',
'荦':'木',
'犖':'金',
'砜':'金',
'碸':'金',
'郢':'金',
'哔':'金',
'嗶':'金',
'郜':'金',
'郗':'金',
'郤':'金',
'郛':'金',
'胨':'金',
'腖':'金',
'飑':'金',
'颮':'金',
'狲':'金',
'猻':'金',
'飒':'金',
'颯':'金',
'阂':'金',
'閡':'金',
'恺':'金',
'愷':'金',
'诮':'金',
'誚':'金',
'诰':'金',
'誥':'金',
'诳':'金',
'誑':'金',
'郡':'金',
'珲':'金',
'琿':'金',
'桤':'金',
'榿':'木',
'逑':'金',
'逋':'金',
'逍':'金',
'唛':'金',
'嘜':'金',
'逖':'金',
'祯':'金',
'禎':'金',
'逡':'金',
'菁':'金',
'萁':'金',
'菘':'金',
'萘':'金',
'萋':'金',
'菽':'金',
'菖':'金',
'萜':'金',
'萑':'木',
'菔':'金',
'菟':'木',
'萏':'金',
'萃':'木',
'菏':'金',
'菹':'金',
'菪':'金',
'菅':'木',
'菀':'木',
'菰':'金',
'菡':'木',
'觋':'金',
'覡':'金',
'匮':'金',
'匱':'金',
'殒':'金',
'殞':'金',
'辄':'金',
'輒':'金',
'堑':'金',
'塹':'金',
'啧':'金',
'嘖':'金',
'帻':'金',
'幘':'金',
'帼':'金',
'幗':'金',
'赇':'金',
'賕':'金',
'赈':'金',
'賑':'金',
'赊':'金',
'賒':'金',
'铑':'金',
'銠':'金',
'铒':'金',
'鉺':'金',
'铟':'金',
'銦':'金',
'铢':'金',
'銖':'金',
'铣':'金',
'銑':'金',
'铨':'金',
'銓':'金',
'铪':'金',
'鉿':'金',
'铫':'金',
'銚':'金',
'铬':'金',
'鉻':'金',
'铯':'金',
'銫':'金',
'铰':'金',
'鉸':'金',
'铱':'金',
'銥':'金',
'铳':'金',
'銃':'金',
'铵':'金',
'銨':'金',
'铷':'金',
'笺':'金',
'箋':'金',
'偾':'金',
'僨':'金',
'皲':'金',
'皸':'金',
'绫':'水',
'綾':'金',
'绮':'水',
'綺':'金',
'绯':'水',
'緋':'金',
'绱':'水',
'緔':'金',
'绲':'水',
'緄':'金',
'绶':'水',
'綬':'金',
'绺':'金',
'綹':'金',
'绻':'金',
'綣':'金',
'绾':'金',
'綰':'金',
'缁':'金',
'緇':'金',
'瑛':'金',
'搽':'金',
'喽':'金',
'嘍':'金',
'嵝':'金',
'嶁':'金',
'腈':'金',
'腌':'金',
'腓':'金',
'腆':'金',
'腑':'金',
'腚':'金',
'溲':'金',
'滁':'金',
'瑚':'金',
'瑁':'金',
'瑜':'土',
'瑗':'金',
'瑄':'金',
'瑕':'金',
'摁':'金',
'搋':'金',
'搪':'金',
'搐':'金',
'搛':'金',
'搠':'金',
'搦':'金',
'搡':'金',
'槌':'木',
'槎':'木',
'甄':'金',
'嗷':'金',
'蜣':'金',
'罨':'金',
'骰':'金',
'氲':'金',
'瘐':'金',
'溱':'金',
'溘':'金',
'溥':'金',
'溧':'金',
'溽':'金',
'溻':'金',
'溷':'金',
'溴':'金',
'滏':'金',
'滃':'金',
'溏':'金',
'滂':'金',
'滓':'金',
'溟':'金',
'愫':'火',
'慊':'金',
'裱':'金',
'裨':'金',
'裾':'金',
'裰':'金',
'禊':'金',
'嫫':'金',
'耥':'金',
'嫠':'金',
'髦':'金',
'墁':'金',
'踅':'金',
'墉':'金',
'墒':'金',
'榖':'金',
'綦':'金',
'靺':'金',
'靼':'金',
'鞅':'金',
'靿':'金',
'戬':'金',
'斡':'金',
'榛':'金',
'榧':'金',
'榻':'木',
'榫':'金',
'榭':'木',
'槔':'木',
'榱':'金',
'槁':'木',
'榷':'木',
'僰':'金',
'酶':'金',
'酹':'金',
'厮':'金',
'碡':'金',
'碴':'金',
'碣':'金',
'碲':'金',
'臧':'金',
'豨':'金',
'蜚':'金',
'裴':'金',
'翡':'金',
'睿':'金',
'睽':'金',
'嘞':'金',
'嘈':'金',
'嘌':'金',
'嘁':'金',
'嘎':'金',
'暝':'金',
'踉':'金',
'蜞':'金',
'蜥':'金',
'蜮':'金',
'蜴':'金',
'蜱':'金',
'蜩':'金',
'蜷':'金',
'蜿':'金',
'蜢':'金',
'嘘':'金',
'嘡':'金',
'嘣':'金',
'嘚':'金',
'嗾':'金',
'嘧':'金',
'幔':'金',
'嶂':'金',
'幛':'金',
'犒':'金',
'箐':'金',
'箍':'金',
'箅':'金',
'箔':'金',
'箜':'金',
'箢':'金',
'僖':'金',
'僳':'金',
'僭':'金',
'劁':'金',
'僮':'金',
'睾':'金',
'艋':'金',
'觫':'金',
'雒':'金',
'夤':'金',
'塾':'金',
'瘌':'金',
'瘊':'金',
'廖':'土',
'韶':'金',
'旖':'水',
'粿':'金',
'粼':'金',
'粽':'金',
'槊':'木',
'熘':'金',
'搴':'金',
'窨':'金',
'寤':'土',
'綮':'金',
'暨':'金',
'屣':'金',
'嫣':'金',
'嫖':'金',
'嫦':'金',
'嫚':'金',
'嫘':'金',
'嫡':'金',
'翟':'金',
'瞀':'金',
'墀':'金',
'滕':'金',
'玚':'金',
'瑒':'金',
'杩':'金',
'榪':'木',
'驲':'金',
'馹':'金',
'饳':'金',
'飿':'金',
'鸤':'金',
'鳲':'金',
'陑':'金',
'陎':'金',
'迳':'金',
'逕':'金',
'韨':'金',
'韍':'金',
'荓':'木',
'郚':'金',
'飐':'金',
'颭':'金',
'浉':'金',
'溮':'金',
'涢':'金',
'溳':'金',
'菝':'金',
'菥':'金',
'莿':'金',
'萆':'金',
'菂':'木',
'菍':'金',
'菼':'金',
'萣':'金',
'菉':'金',
'铏':'金',
'鉶':'金',
'铕':'金',
'銪':'金',
'铚':'金',
'銍':'金',
'铞':'金',
'銱':'金',
'铥':'金',
'銩':'金',
'鱾':'金',
'魢':'金',
'庼':'金',
'廎':'金',
'绹':'水',
'綯':'金',
'脿':'金',
'腙':'金',
'腒':'金',
'溚':'金',
'溠':'金',
'溞':'金',
'瑃':'金',
'瑓':'金',
'瑅':'金',
'瑆':'金',
'瑖':'金',
'瑝':'金',
'瑔':'金',
'瑀':'金',
'瑂':'金',
'嶅':'金',
'瑑':'金',
'搒':'金',
'搌':'金',
'骱':'金',
'猺':'金',
'廒':'金',
'溍':'金',
'溹':'金',
'滆':'金',
'滉':'金',
'溦':'金',
'溵':'金',
'滧':'金',
'滘':'金',
'滍':'金',
'愭':'金',
'慆':'金',
'裼':'金',
'禋':'火',
'禔':'金',
'禘':'金',
'禒':'金',
'耤':'金',
'斠':'金',
'墕':'金',
'墈':'金',
'墐':'金',
'墘':'金',
'銎':'金',
'墚':'金',
'靽':'金',
'鞁':'金',
'嘏':'金',
'榰':'金',
'榑':'金',
'槜':'木',
'榍':'金',
'疐':'金',
'酺':'金',
'酲':'金',
'酴':'金',
'碶':'金',
'碨':'金',
'碹':'金',
'碥':'金',
'劂':'金',
'跽':'金',
'蜾':'金',
'幖':'金',
'嶍':'金',
'馝':'金',
'箖':'金',
'劄':'金',
'僬':'金',
'僦':'金',
'僔':'金',
'僎':'金',
'槃':'木',
'夐':'金',
'凘':'金',
'廑':'土',
'瘕':'金',
'熇':'金',
'窬':'金',
'嫕':'金',
'嫭':'金',
'嫜':'金',
'嫪':'金',
'塸':'金',
'彄':'金',
'馼':'金',
'駃':'金',
'僤':'金',
'蝀':'金',
'頔':'金',
'銈':'金',
'鉷':'金',
'綪':'金',
'綝':'金',
'綡':'金',
'綧':'金',
'塿':'金',
'嵽':'金',
'說':'金',
'寧':'金',
'箏':'金',
'牓':'金',
'蜯':'金',
'粺':'金',
'菢':'金',
'鞄':'金',
'飹':'金',
'駂':'金',
'鳵':'金',
'菴':'金',
'誝':'金',
'颰':'金',
'馛':'金',
'嗸':'金',
'嫯':'金',
'蝂':'金',
'嘊':'金',
'敱':'金',
'溰':'金',
'溾':'金',
'誒':'金',
'诶':'金',
'犕':'金',
'箄':'金',
'綼':'金',
'誖':'金',
'郥':'金',
'甂':'金',
'稨':'金',
'辡':'金',
'僠':'金',
'愽':'金',
'煿':'金',
'牔':'金',
'猼':'金',
'箥':'金',
'艊':'金',
'踄':'金',
'郣':'金',
'墂':'金',
'徱':'金',
'豩':'金',
'賔':'金',
'塴':'金',
'菶':'金',
'彃':'金',
'稫':'金',
'箆':'金',
'聛':'金',
'飶':'金',
'誧':'金',
'溨':'金',
'綵':'金',
'蝅':'金',
'愺':'金',
'嶆':'金',
'慅':'金',
'嫧':'金',
'溭':'金',
'箣':'金',
'萗':'金',
'頙':'金',
'嵾':'金',
'僝':'金',
'嵼':'金',
'裧':'金',
'誗':'金',
'銟':'金',
'僘':'金',
'塲':'金',
'畼':'金',
'裮':'金',
'煼':'金',
'禉':'金',
'溗':'金',
'畻':'金',
'郕':'金',
'靗':'金',
'墋':'金',
'瘎':'金',
'徲':'金',
'瘈':'金',
'箎':'金',
'箈':'金',
'翤':'金',
'裭':'金',
'鉹':'金',
'銐':'金',
'嘃':'金',
'搊':'金',
'殠':'金',
'菗':'金',
'裯':'金',
'槒':'木',
'滀':'金',
'犓':'金',
'禇':'金',
'踀':'金',
'閦':'金',
'腄':'金',
'僢':'金',
'瑏':'金',
'搥':'金',
'箠':'金',
'菙':'金',
'槆':'木',
'睶':'金',
'萅':'金',
'腏':'金',
'塶':'金',
'皶':'金',
'誎':'金',
'趗':'金',
'菆':'金',
'搨':'金',
'箚':'金',
'嗺':'金',
'墔':'金',
'綷':'金',
'脺':'金',
'踆':'金',
'聡':'金',
'廗':'金',
'獃':'金',
'瑇':'金',
'匰':'金',
'腅':'金',
'舕':'金',
'馾':'金',
'頕':'金',
'髧':'金',
'嶋':'金',
'翢':'金',
'菿':'金',
'僜':'金',
'墆':'金',
'墑':'金',
'聜':'金',
'菧':'金',
'蝃':'金',
'逓':'金',
'蜨':'金',
'菄':'金',
'槇':'木',
'魡':'金',
'雿':'金',
'嵿':'金',
'碠':'金',
'琽':'金',
'裻':'金',
'郖':'金',
'鬦':'金',
'碫':'金',
'蜳':'金',
'綞':'金',
'缍':'金',
'陊':'金',
'陏':'金',
'僫':'金',
'搤':'金',
'搹':'金',
'蝁':'金',
'誐':'金',
'煾':'金',
'瞂':'金',
'勫':'金',
'髣':'金',
'魀':'金',
'槩':'木',
'萉':'金',
'蜰':'金',
'裶':'金',
'稪':'金',
'箙':'金',
'豧':'金',
'郙':'金',
'榦':'木',
'蜬':'金',
'鳱':'金',
'罁':'金',
'暠':'金',
'槀':'木',
'菒':'金',
'戨':'金',
'槅':'木',
'滒':'金',
'箇':'金',
'麧':'金',
'菮':'金',
'郠':'金',
'愩':'金',
'躳':'金',
'魟':'金',
'搆':'金',
'煹':'金',
'愲':'金',
'搰':'金',
'榾':'木',
'皷':'金',
'箛':'金',
'劀':'金',
'瘑':'金',
'罫':'金',
'箉':'金',
'関':'金',
'僙':'金',
'厬':'金',
'嫢':'金',
'溎':'金',
'陒':'金',
'睴':'金',
'裩':'金',
'裷':'金',
'嘓':'金',
'墎':'金',
'綶':'金',
'腂':'金',
'聝':'金',
'菓':'金',
'褁':'金',
'酼':'金',
'噑':'金',
'暤':'金',
'滈':'金',
'獆':'金',
'熆':'金',
'萂':'金',
'嫨':'金',
'蜭':'金',
'谽':'金',
'貋':'金',
'搳':'金',
'睺':'金',
'銗':'金',
'誙':'金',
'閧':'金',
'鞃':'金',
'獂':'金',
'瑍':'金',
'瘓':'金',
'萈':'金',
'輐':'金',
'愰':'金',
'榥':'木',
'熀':'金',
'嘑':'金',
'嫮':'金',
'寣':'土',
'萀':'金',
'雐':'金',
'僡':'金',
'嘒':'金',
'幑':'金',
'睳':'金',
'禈':'金',
'慁':'金',
'睯':'金',
'觨':'金',
'僟':'金',
'墍':'金',
'愱':'金',
'槉':'木',
'毄':'金',
'稩':'金',
'綨':'金',
'緁':'金',
'褀':'金',
'誋':'金',
'銡':'金',
'鬾':'金',
'榎':'木',
'榢':'木',
'睱':'金',
'稭':'金',
'鞂':'金',
'僣':'金',
'戩':'金',
'榗':'木',
'瑐':'金',
'瑊':'金',
'睷':'金',
'菺':'金',
'銒':'金',
'嵹':'金',
'翞':'金',
'嘂':'金',
'嘄':'金',
'嘐':'金',
'暞':'金',
'虠':'金',
'踋':'金',
'嫤':'金',
'搢':'金',
'暜':'金',
'菫':'金',
'菳':'金',
'搩':'金',
'榤':'木',
'滐':'金',
'琾':'金',
'犗':'金',
'瑎':'金',
'箑':'金',
'脻':'金',
'腉':'金',
'菨':'金',
'飷':'金',
'聙':'金',
'誩':'金',
'踁':'金',
'僒':'金',
'煛':'金',
'廐':'金',
'廏':'金',
'僪':'金',
'勪':'金',
'熦':'金',
'寠':'金',
'愳':'金',
'箤':'金',
'粷':'金',
'虡':'金',
'蜛':'金',
'跼':'金',
'勬':'金',
'腃':'金',
'菤':'金',
'箘':'金',
'箟':'金',
'菎':'金',
'蜠':'金',
'覠':'金',
'賐':'金',
'銁':'金',
'銞':'金',
'嘅':'金',
'暟':'金',
'嵻':'金',
'嫝':'金',
'搕':'金',
'榼':'木',
'碦':'金',
'瘔':'金',
'銙':'金',
'誏':'金',
'躴':'金',
'郞':'金',
'髨':'金',
'搚':'金',
'菈':'木',
'辢':'金',
'箂':'金',
'僗':'金',
'韷':'金',
'銇':'金',
'孷':'金',
'搮':'金',
'慄':'金',
'盠':'金',
'綟':'金',
'菞':'金',
'蜧':'金',
'貍':'金',
'匲':'金',
'嗹':'金',
'溓':'金',
'熑':'金',
'覝':'金',
'脼':'金',
'緉':'金',
'蜽':'金',
'裲':'金',
'嵺':'金',
'裬':'金',
'僯':'金',
'罧':'金',
'菻':'金',
'廔':'金',
'畱':'金',
'塷':'金',
'廘':'土',
'粶':'金',
'綠':'金',
'馿':'金',
'溣':'金',
'耣':'金',
'腀':'金',
'蜦':'金',
'菕':'金',
'溤':'金',
'睰':'金',
'麼':'金',
'壾':'金',
'莾':'木',
'鉾':'金',
'塺':'金',
'槑':'木',
'睸':'金',
'禖':'金',
'韎':'金',
'菛':'金',
'夣':'金',
'溕':'金',
'榓':'金',
'熐':'金',
'踇':'金',
'搣':'金',
'瑉':'金',
'緍':'金',
'榠':'木',
'猽':'金',
'嗼':'金',
'塻':'金',
'銆':'金',
'幙':'金',
'搻':'金',
'榒':'金',
'熋':'金',
'碯':'金',
'腇':'金',
'嫟':'金',
'愵':'金',
'蜺':'金',
'馜':'金',
'槈':'木',
'踂':'金',
'搙':'金',
'稬':'金',
'腗':'金',
'搫':'金',
'溿':'金',
'頖':'金',
'靤':'金',
'裵':'金',
'馷':'金',
'塳':'金',
'凴':'金',
'幈':'金',
'艵':'金',
'銔':'金',
'銢':'金',
'腁':'金',
'彯':'金',
'嘙':'金',
'箁':'金',
'菐':'金',
'僛':'金',
'墄':'金',
'暣':'金',
'溼':'金',
'滊':'金',
'粸':'金',
'綥':'金',
'緀':'金',
'萕':'金',
'蜝':'金',
'裿':'金',
'鬿':'金',
'槏':'木',
'箝':'金',
'蜸':'金',
'墏':'金',
'嶈':'金',
'溬':'金',
'牄':'金',
'羫':'金',
'毃':'金',
'菬':'金',
'髚':'金',
'朅':'金',
'搇':'金',
'菦':'金',
'菣':'金',
'誛':'金',
'靘':'金',
'熍':'金',
'搝':'金',
'觩':'金',
'逎':'金',
'愨':'金',
'搉':'金',
'髥':'金',
'竬':'金',
'菃':'金',
'搼':'金',
'箞':'金',
'搈':'金',
'搑':'金',
'榵':'木',
'瑈':'金',
'腍':'金',
'銋':'金',
'銣':'金',
'瑌':'金',
'碝':'金',
'緌':'金',
'蜹':'金',
'馺':'金',
'嘇':'金',
'甧':'金',
'僐':'金',
'幓':'金',
'搧':'金',
'熌':'金',
'榝':'木',
'翣':'金',
'萐':'金',
'綤':'金',
'輎':'金',
'禓':'金',
'銄':'金',
'榺':'木',
'琞':'金',
'榯':'木',
'溡':'金',
'獅':'金',
'舓':'金',
'鉽':'金',
'愼':'金',
'搷':'金',
'跾':'金',
'踈':'金',
'誜':'金',
'塽':'金',
'脽':'金',
'愬':'金',
'榹':'木',
'禗':'金',
'蜤':'金',
'愯':'金',
'嵷':'金',
'蜙':'金',
'暛':'金',
'溑':'金',
'蜶':'金',
'趖':'金',
'逤':'金',
'獀':'金',
'榡':'木',
'溸':'金',
'趚':'金',
'滖':'金',
'搎':'金',
'愻':'金',
'槂':'木',
'墖':'金',
'毾':'金',
'榙':'木',
'溙':'金',
'菭':'金',
'榶':'木',
'煻':'金',
'搯':'金',
'槄':'木',
'裪':'金',
'蜪':'金',
'飸':'金',
'鞀':'金',
'睼':'金',
'碮':'金',
'嗿':'金',
'緂':'金',
'菾':'金',
'萔':'金',
'銕':'金',
'飻':'金',
'榳':'木',
'誔':'金',
'勭':'金',
'鉵':'金',
'圗':'金',
'嶀':'金',
'瘏':'金',
'跿':'金',
'僓':'金',
'畽':'金',
'碢':'金',
'魠':'金',
'搲':'金',
'溛':'金',
'綩':'金',
'萖':'金',
'輓':'金',
'嶉':'金',
'菋':'金',
'蜲':'金',
'蜼':'金',
'搵':'金',
'榲':'木',
'殟':'金',
'溫':'金',
'熓':'金',
'瘒':'金',
'瞃':'金',
'歍':'金',
'溩':'金',
'熃':'金',
'禑':'金',
'逜':'金',
'陓':'金',
'慀':'金',
'榽':'木',
'熂':'金',
'熈':'金',
'犔':'金',
'稧':'金',
'緆':'金',
'趘':'金',
'暡':'金',
'碬':'金',
'朢':'金',
'菵':'金',
'蝄':'金',
'僩':'金',
'嘕':'金',
'搟':'金',
'誢':'金',
'銛':'金',
'勨':'金',
'嘋':'金',
'歊':'金',
'誟':'金',
'踃':'金',
'愶':'金',
'熁':'金',
'靾':'金',
'馸':'金',
'睲':'金',
'緈':'金',
'觪':'金',
'銝':'金',
'髤':'金',
'嫙':'金',
'睻':'金',
'噓':'金',
'慉':'金',
'盢':'金',
'瞁':'金',
'稰':'金',
'聟':'金',
'銊':'金',
'窫':'金',
'愮':'金',
'暚':'金',
'搖':'金',
'榚':'木',
'榣':'木',
'溔':'金',
'熎':'金',
'覞':'金',
'暥':'金',
'碞':'金',
'菸':'金',
'萒':'金',
'裺':'金',
'郔':'金',
'慃':'金',
'勩':'金',
'嫛':'金',
'榏':'木',
'歋':'金',
'獈':'金',
'稦':'金',
'萓':'金',
'逘':'金',
'瑘':'金',
'慇':'金',
'廕':'金',
'朄':'金',
'瘖':'金',
'酳':'金',
'輑':'金',
'馻':'金',
'碤':'金',
'賏':'金',
'嫞':'金',
'慂':'金',
'輏':'金',
'逌':'金',
'駀':'金',
'戫':'金',
'歶':'金',
'瘉':'金',
'睮':'金',
'箊':'金',
'罭':'金',
'緎':'金',
'蜟':'金',
'輍':'金',
'銉':'金',
'榞':'木',
'榬':'金',
'溒':'金',
'禐':'金',
'蜵':'金',
'裫':'金',
'奫':'金',
'愪':'金',
'慍':'金',
'氳':'金',
'熅':'金',
'熉':'金',
'雑':'金',
'睵':'金',
'菑':'金',
'榸':'木',
'飵':'金',
'嶃':'金',
'榐':'木',
'菚':'金',
'墇':'金',
'粻':'金',
'箌':'金',
'肈':'金',
'嗻':'金',
'嫬':'金',
'搸':'金',
'殝':'金',
'碪':'金',
'誫':'金',
'愸':'金',
'墌':'金',
'搘':'金',
'覟':'金',
'誌':'金',
'馶':'金',
'馽':'金',
'幒':'金',
'瘇':'金',
'甃':'金',
'箒':'金',
'菷':'金',
'銂':'金',
'飳':'金',
'嫥':'金',
'塼':'金',
'硾':'金',
'斲':'金',
'罬':'金',
'榟':'木',
'禌':'金',
'嵸':'金',
'稯':'金',
'緃':'金',
'総':'金',
'箃':'金',
'緅':'金',
'靻':'金',
'嶊':'金',
'酻':'金',
'銌':'金',
'厂':'水',
'廠':'水',
'万':'水',
'萬':'水',
'亿':'水',
'億':'水',
'廣':'水',
'卫':'水',
'衛':'水',
'币':'水',
'幣':'水',
'击':'水',
'撃':'水',
'厉':'水',
'厲':'水',
'叶':'木',
'葉':'木',
'叽':'水',
'嘰':'水',
'仪':'水',
'儀':'水',
'乐':'水',
'樂':'水',
'汉':'水',
'漢':'水',
'写':'水',
'寫':'水',
'巩':'水',
'鞏':'水',
'价':'水',
'價':'水',
'冲':'水',
'衝':'水',
'庆':'土',
'慶':'水',
'刘':'水',
'劉':'水',
'兴':'水',
'興':'水',
'论':'金',
'論':'水',
'导':'水',
'導':'水',
'阵':'土',
'陣':'水',
'玛':'水',
'瑪':'水',
'进':'水',
'進':'水',
'抠':'水',
'摳':'水',
'折':'水',
'摺':'水',
'苇':'水',
'葦':'木',
'滷':'水',
'邮':'水',
'郵':'水',
'彆':'水',
'彻':'水',
'徹':'水',
'穀':'水',
'肠':'水',
'腸':'水',
'沪':'水',
'滬':'水',
'忧':'水',
'憂':'水',
'穷':'水',
'窮':'水',
'层':'水',
'層':'水',
'坠':'水',
'墜':'水',
'纬':'水',
'緯':'水',
'範':'水',
'枢':'木',
'樞':'木',
'卖':'水',
'賣':'水',
'码':'水',
'碼':'水',
'欧':'水',
'歐':'水',
'殴':'水',
'毆':'水',
'轮':'金',
'輪':'水',
'齿':'水',
'齒':'水',
'贤':'水',
'賢':'水',
'帜':'水',
'幟':'水',
'账':'水',
'賬':'水',
'刮':'水',
'颳':'水',
'质':'水',
'質':'水',
'征':'水',
'徵':'水',
'肿':'水',
'腫':'水',
'庙':'土',
'廟':'水',
'疟':'水',
'瘧':'水',
'废':'水',
'廢':'水',
'闹':'水',
'鬧':'水',
'审':'土',
'審':'水',
'陕':'水',
'陝':'水',
'驾':'水',
'駕':'水',
'练':'水',
'練':'水',
'驶':'水',
'駛':'水',
'驹':'水',
'駒':'水',
'驻':'水',
'駐':'水',
'驼':'水',
'駝':'水',
'荤':'木',
'葷':'木',
'标':'木',
'標':'水',
'鸦':'水',
'鴉':'水',
'虾':'水',
'蝦':'水',
'哗':'水',
'嘩':'水',
'罚':'水',
'罰':'水',
'贱':'水',
'賤':'水',
'複':'水',
'俭':'水',
'儉':'水',
'剑':'金',
'劍':'水',
'饵':'水',
'餌':'水',
'蚀':'水',
'蝕':'水',
'饺':'水',
'餃':'水',
'疮':'水',
'瘡':'水',
'养':'水',
'養':'水',
'陡':'水',
'除':'水',
'院':'水',
'娇':'水',
'嬌':'水',
'挚':'水',
'摯':'水',
'热':'水',
'熱':'水',
'噁':'水',
'莹':'木',
'瑩':'水',
'桩':'木',
'樁':'木',
'样':'水',
'樣':'木',
'致':'水',
'緻':'水',
'虑':'水',
'慮':'水',
'唠':'水',
'嘮':'水',
'敌':'水',
'敵':'水',
'脑':'水',
'腦':'水',
'皱':'水',
'皺':'水',
'桨':'木',
'槳':'木',
'浆':'水',
'漿':'水',
'郭':'水',
'部':'水',
'阅':'水',
'閲':'水',
'涤':'水',
'滌':'水',
'涨':'水',
'漲':'水',
'宽':'土',
'寬':'水',
'请':'金',
'請':'水',
'诽':'水',
'誹':'水',
'课':'水',
'課':'水',
'谁':'水',
'誰':'水',
'调':'水',
'調':'水',
'谅':'水',
'諒':'水',
'谆':'水',
'諄':'水',
'谈':'金',
'談':'水',
'谊':'水',
'誼':'水',
'剧':'金',
'劇':'水',
'琐':'水',
'瑣':'水',
'掺':'水',
'摻':'水',
'辆':'金',
'輛':'金',
'啸':'水',
'嘯':'水',
'铝':'水',
'鋁':'水',
'盘':'水',
'盤':'水',
'脚':'水',
'腳':'水',
'逸':'水',
'渐':'水',
'漸':'水',
'渔':'水',
'漁':'水',
'渗':'水',
'滲':'水',
'惭':'水',
'慚':'水',
'惨':'水',
'慘':'水',
'惯':'水',
'慣':'水',
'逮':'水',
'弹':'水',
'彈':'水',
'堕':'水',
'墮':'水',
'搂':'水',
'摟':'水',
'葫':'木',
'葬':'木',
'葛':'木',
'董':'水',
'葡':'水',
'葱':'水',
'蒂':'木',
'落':'水',
'葵':'水',
'确':'水',
'確':'水',
'暂':'水',
'暫':'水',
'辈':'水',
'輩':'水',
'辉':'火',
'輝':'水',
'赏':'金',
'賞':'水',
'喷':'水',
'噴':'水',
'践':'水',
'踐':'水',
'赋':'水',
'賦':'水',
'赐':'金',
'賜':'水',
'赔':'水',
'賠':'水',
'铺':'水',
'鋪':'水',
'销':'水',
'銷':'水',
'锄':'水',
'鋤':'水',
'锈':'水',
'銹':'水',
'锋':'金',
'鋒':'水',
'锌':'水',
'鋅':'水',
'锐':'金',
'銳':'水',
'鲁':'水',
'魯':'水',
'滞':'水',
'滯':'水',
'缅':'水',
'緬':'水',
'缉':'水',
'緝':'水',
'缎':'水',
'緞':'水',
'缓':'水',
'緩':'水',
'缔':'水',
'締':'水',
'编':'水',
'編':'水',
'缘':'水',
'緣':'水',
'瑰':'水',
'摸':'水',
'楼':'木',
'樓':'水',
'蜗':'水',
'蝸':'水',
'腰':'水',
'腥':'水',
'腮':'水',
'腹':'水',
'腺':'水',
'数':'水',
'數':'水',
'满':'水',
'滿':'水',
'漠':'水',
'滚':'水',
'熬':'水',
'墟':'水',
'摧':'水',
'摘':'水',
'摔':'水',
'慕':'水',
'暮':'火',
'摹':'水',
'模':'水',
'磁':'水',
'魄':'水',
'魅':'水',
'瘩':'水',
'瘟':'水',
'瘦':'水',
'弊':'水',
'漆':'水',
'漱':'水',
'漂':'水',
'漫':'水',
'滴':'水',
'漾':'水',
'演':'水',
'漏':'水',
'慢':'水',
'慷':'水',
'褐':'火',
'慧':'火',
'趣':'水',
'趟':'水',
'墩':'水',
'增':'水',
'鞋':'水',
'鞍':'水',
'横':'木',
'槽':'木',
'樟':'木',
'敷':'水',
'豌':'水',
'醋':'水',
'醇':'水',
'醉':'水',
'磕':'水',
'磊':'水',
'磅':'水',
'碾':'水',
'震':'水',
'霄':'水',
'暴':'水',
'瞎':'水',
'嘻':'水',
'嘶':'水',
'嘲':'水',
'嘹':'水',
'影':'水',
'踢':'水',
'踏':'水',
'踩':'水',
'踪':'水',
'蝶':'火',
'蝴':'火',
'蝠':'水',
'蝎':'水',
'蝌':'水',
'蝗':'水',
'蝙':'水',
'嘿':'水',
'幢':'水',
'墨':'土',
'靠':'水',
'稽':'水',
'稻':'水',
'黎':'水',
'稿':'水',
'稼':'水',
'箱':'水',
'箭':'水',
'篇':'水',
'僵':'水',
'躺':'水',
'僻':'水',
'德':'水',
'熟':'水',
'摩':'水',
'褒':'火',
'瘤':'水',
'凛':'水',
'毅':'水',
'糊':'水',
'翩':'水',
'慰':'水',
'劈':'水',
'履':'水',
'整':'水',
'嘴':'水',
'劢':'水',
'勱':'水',
'抟':'水',
'摶':'水',
'呒':'水',
'嘸':'水',
'庑':'水',
'廡':'水',
'沤':'水',
'漚':'水',
'怄':'水',
'慪':'水',
'陉':'水',
'陘':'水',
'妩':'水',
'嫵':'水',
'妫':'水',
'嬀':'水',
'枞':'水',
'樅':'木',
'咝':'水',
'噝':'水',
'刿':'水',
'劌':'水',
'侩':'水',
'儈':'水',
'侬':'水',
'儂':'水',
'刽':'水',
'劊':'水',
'怂':'水',
'慫':'水',
'诤':'水',
'諍':'水',
'驽':'水',
'駑':'水',
'驷':'水',
'駟':'水',
'驸':'水',
'駙':'水',
'骀':'水',
'駘':'水',
'荮':'木',
'葤':'木',
'殇':'水',
'殤':'水',
'哓':'水',
'嘵':'水',
'峣':'水',
'嶢':'水',
'峤':'水',
'嶠':'水',
'钡':'水',
'鋇':'水',
'鸨':'水',
'鴇':'水',
'饷':'水',
'餉':'水',
'饸':'水',
'餄':'水',
'饹':'水',
'餎':'水',
'闾':'水',
'閭':'水',
'迸':'水',
'浒':'水',
'滸':'水',
'恸':'水',
'慟':'水',
'鸩':'水',
'鴆':'水',
'陛':'水',
'陟':'水',
'娆':'水',
'嬈':'水',
'莴':'水',
'萵':'水',
'郴':'水',
'崂':'水',
'嶗':'水',
'郫':'水',
'阃':'水',
'閫':'水',
'訚':'水',
'誾':'水',
'阆':'水',
'閬':'水',
'郯':'水',
'涟':'水',
'漣':'水',
'悭':'水',
'慳':'水',
'诹':'水',
'諏':'水',
'诼':'水',
'諑':'水',
'诿':'水',
'諉':'水',
'谂':'水',
'諗':'水',
'谄':'水',
'諂':'水',
'谇':'水',
'誶':'水',
'娴':'水',
'嫻':'水',
'麸':'水',
'麩':'水',
'掴':'水',
'摑':'水',
'逵':'水',
'悫':'水',
'慤':'水',
'掼':'水',
'摜':'水',
'萸':'木',
'梿':'水',
'槤':'木',
'赉':'水',
'賚':'水',
'铗':'水',
'鋏':'水',
'铤':'水',
'鋌':'水',
'逶':'水',
'皑':'水',
'皚':'水',
'渍':'水',
'漬':'水',
'逯':'水',
'婵':'水',
'嬋':'水',
'靓':'水',
'靚':'水',
'辇':'水',
'輦':'水',
'颉':'水',
'頡':'水',
'摒':'水',
'葑':'木',
'葚':'木',
'葳':'木',
'葺':'木',
'葸':'木',
'萼':'水',
'葆':'木',
'葩':'木',
'葶':'水',
'萱':'木',
'葭':'木',
'赍':'水',
'賫':'水',
'辊':'水',
'輥':'水',
'辋':'水',
'輞':'水',
'椠':'水',
'槧':'木',
'辍':'水',
'輟':'水',
'辎':'水',
'輜':'水',
'赕':'水',
'賧':'水',
'铻':'水',
'鋙':'水',
'锃':'水',
'鋥':'水',
'锂':'水',
'鋰':'水',
'锆':'水',
'鋯':'水',
'锇':'水',
'鋨':'水',
'锉':'水',
'銼':'水',
'锑':'水',
'銻':'水',
'锒':'水',
'鋃':'水',
'锔':'水',
'鋦':'水',
'媭':'水',
'嬃':'水',
'颌':'水',
'頜':'水',
'腴':'水',
'腱':'水',
'鱿':'水',
'魷':'水',
'鲀':'水',
'魨':'水',
'鲂':'水',
'魴':'水',
'颍':'水',
'潁':'水',
'颎':'水',
'熲':'水',
'赓':'水',
'賡':'水',
'颏':'水',
'頦':'水',
'翚':'水',
'翬':'水',
'缂':'水',
'緙':'水',
'缃':'水',
'緗':'水',
'缄':'水',
'緘':'水',
'缇':'水',
'緹':'水',
'缈':'水',
'緲':'水',
'缌':'水',
'緦':'水',
'缑':'水',
'緱':'水',
'缗':'水',
'緡':'水',
'嘟':'水',
'腠':'水',
'腩':'水',
'腼':'水',
'腭':'水',
'腧':'水',
'漭':'水',
'滫':'水',
'褚':'火',
'瑶':'土',
'瑭':'水',
'獒':'水',
'慝':'水',
'摽':'水',
'撂':'水',
'摞':'水',
'翥':'水',
'摭':'水',
'磋':'水',
'霆':'水',
'罱':'水',
'骷':'水',
'骶':'水',
'箧':'水',
'篋':'水',
'箸':'水',
'箬':'水',
'儆':'水',
'魃':'水',
'魆':'水',
'獐':'水',
'瘙':'水',
'熥':'水',
'漕':'水',
'滹':'水',
'漯':'水',
'漶':'水',
'漪':'水',
'漉':'水',
'漳':'水',
'漩':'水',
'慵':'水',
'褙':'水',
'褓':'水',
'褊':'水',
'鼐':'水',
'耦':'水',
'奭':'水',
'髯':'水',
'髫':'水',
'鋆':'水',
'槿':'木',
'槭':'木',
'樗':'水',
'樘':'水',
'樊':'木',
'槲':'水',
'醌':'水',
'醅':'水',
'磔':'水',
'磙':'水',
'霈':'水',
'瞌':'水',
'瞋':'水',
'瞑':'水',
'嘭':'水',
'噎':'水',
'噘':'水',
'踔':'水',
'踝':'水',
'踟':'水',
'踒':'水',
'踮':'水',
'踺':'水',
'踞':'水',
'蝽':'水',
'蝻':'水',
'蝰':'水',
'蝮':'水',
'蝓':'水',
'蝣':'水',
'噗':'水',
'嘬':'水',
'噍':'水',
'噙':'水',
'噌':'水',
'噔':'水',
'幞':'水',
'幡':'水',
'嶙':'水',
'嶝':'水',
'稷':'水',
'箴':'水',
'篁':'水',
'篌':'水',
'篆':'水',
'牖':'水',
'儋':'水',
'磐':'土',
'虢':'水',
'麾':'水',
'廛':'水',
'瘛':'水',
'瘢':'水',
'瘠':'水',
'羯':'水',
'羰':'水',
'糌':'水',
'糍':'水',
'糅':'水',
'熜':'水',
'熵':'水',
'熠':'火',
'鋈':'水',
'寮':'水',
'窳':'水',
'熨':'水',
'嬉':'水',
'勰':'水',
'戮':'水',
'蝥':'水',
'畿':'水',
'髭':'水',
'樨':'水',
'祃':'水',
'禡':'水',
'玱':'水',
'瑲':'水',
'驵':'水',
'駔':'水',
'垯':'水',
'墶':'水',
'荭':'木',
'葒':'木',
'饻':'水',
'浐':'水',
'滻':'水',
'袆':'水',
'褘':'水',
'陧':'水',
'陞':'水',
'郪':'水',
'硙':'水',
'磑':'水',
'逴':'水',
'啴':'水',
'嘽':'水',
'铖':'水',
'鋮':'水',
'铘':'水',
'鋣':'水',
'脶':'水',
'腡':'水',
'逭':'水',
'裈':'水',
'褌':'水',
'婳':'水',
'嫿':'水',
'葜':'木',
'萳':'水',
'葙':'水',
'葴':'木',
'蒈':'木',
'萩':'水',
'葰':'木',
'葎':'木',
'蒎':'木',
'葖':'木',
'蒄':'木',
'萹':'木',
'辌':'水',
'輬':'水',
'嵚':'水',
'嶔':'水',
'赒':'水',
'賙':'水',
'铽':'水',
'鋱':'水',
'锊':'水',
'鋝':'水',
'锍':'水',
'鋶':'水',
'锓':'水',
'鋟':'水',
'鲃':'水',
'溇':'水',
'漊':'水',
'毵':'水',
'毿':'水',
'缊':'水',
'緼':'水',
'缐':'水',
'線':'水',
'瑳':'水',
'摛':'水',
'腽':'水',
'腨':'水',
'腯':'水',
'漷':'水',
'慥':'水',
'瑧':'水',
'瑨':'水',
'瑱':'水',
'瑢':'水',
'摏':'水',
'摴':'水',
'瞍':'水',
'獍':'水',
'廙':'水',
'瘗':'水',
'瘞':'水',
'瘥':'水',
'漹':'水',
'漖':'水',
'漤':'水',
'漼':'水',
'漴':'水',
'漈':'水',
'漻':'水',
'慬':'水',
'褕':'水',
'禛':'水',
'禚':'火',
'漦':'水',
'墣':'水',
'墦':'水',
'墡':'水',
'槱':'木',
'磏':'水',
'磉':'水',
'殣':'水',
'霅':'水',
'暵':'水',
'暲':'水',
'暶':'水',
'踦':'水',
'踣':'水',
'蝘':'水',
'蝲':'水',
'蝤':'水',
'噇':'水',
'噂':'水',
'噀':'水',
'嶓':'水',
'嶟':'水',
'嶒':'水',
'稹':'水',
'儇':'水',
'皞':'水',
'皛':'水',
'艎':'水',
'艏':'水',
'橥':'木',
'觭':'水',
'糇':'水',
'糈':'水',
'翦':'水',
'熛':'水',
'瑬':'水',
'戭':'水',
'嫽':'水',
'磜':'水',
'熰':'水',
'諓':'水',
'駓':'水',
'駉':'水',
'墠':'水',
'漍':'水',
'輗':'水',
'銶':'水',
'鋗':'水',
'鋐':'水',
'頫':'水',
'頠':'水',
'廞':'水',
'緥':'水',
'虣':'水',
'裦':'水',
'髱':'水',
'骲':'水',
'腤':'水',
'罯':'水',
'萻':'水',
'葊':'水',
'鞌':'水',
'墢':'水',
'慠':'水',
'摮':'水',
'滶':'水',
'獓':'水',
'鴁':'水',
'魬':'水',
'鳻':'水',
'逩':'水',
'躷':'水',
'骳':'水',
'緶':'水',
'缏':'水',
'艑':'水',
'箯':'水',
'糄':'水',
'諚':'水',
'嶏':'水',
'葧':'木',
'鋍':'水',
'駊':'水',
'滮':'水',
'諘':'水',
'麃':'水',
'徶':'水',
'槰':'木',
'逬':'水',
'滭':'水',
'熚':'水',
'腷':'水',
'豍':'水',
'貏':'水',
'駜':'水',
'髲':'水',
'魮':'水',
'郶':'水',
'噆':'水',
'慙':'水',
'摲':'水',
'慒':'水',
'萴':'水',
'儃':'水',
'幝':'水',
'摌':'水',
'獑':'水',
'緾':'水',
'鋋':'水',
'鋓':'水',
'閳':'水',
'誯':'水',
'樔':'木',
'漅':'水',
'窲':'水',
'趠':'水',
'麨':'水',
'憆':'水',
'摚':'水',
'緽':'水',
'夦':'水',
'敶':'水',
'樄':'木',
'諃':'水',
'賝':'水',
'霃':'水',
'噄':'水',
'慗':'水',
'殦':'水',
'翨':'水',
'腟':'水',
'誺':'水',
'骴':'水',
'徸':'水',
'憃':'水',
'緟':'水',
'蝩':'水',
'褈':'水',
'儊':'水',
'嘼':'水',
'廚':'水',
'諔':'水',
'暷':'水',
'篅':'水',
'摐':'水',
'摤':'水',
'漺':'水',
'牕':'水',
'漘':'水',
'箺':'水',
'萶':'水',
'陙':'水',
'諁':'水',
'醊':'水',
'辤':'水',
'飺':'水',
'餈':'水',
'噈':'水',
'踧':'水',
'麄':'水',
'鋑':'水',
'慛':'水',
'槯':'木',
'趡':'水',
'踤':'水',
'壿':'水',
'墫':'水',
'憁':'水',
'暰':'水',
'漎':'水',
'漗':'水',
'潀':'水',
'緫':'水',
'聦':'水',
'賩':'水',
'賨':'水',
'誴':'水',
'歵':'水',
'逪':'水',
'緿':'水',
'蝳':'水',
'勯':'水',
'嘾':'水',
'噉':'水',
'儅':'水',
'瞊':'水',
'趤':'水',
'衜':'水',
'墬':'水',
'墱':'水',
'嬁':'水',
'慸':'水',
'摕':'水',
'樀':'木',
'滺':'水',
'腣':'水',
'蝭':'水',
'艓':'水',
'褋':'水',
'墥':'水',
'箽':'水',
'諌':'水',
'瘨':'水',
'鼑':'水',
'鋀':'水',
'褍':'水',
'葮':'木',
'腶':'水',
'磓':'水',
'頧':'水',
'墪':'水',
'腞':'水',
'凙':'水',
'嫷':'水',
'嶞':'水',
'磀':'水',
'頞':'水',
'頟':'水',
'魤':'水',
'魥':'水',
'腝':'水',
'髮':'水',
'噃':'水',
'嬎':'水',
'嬏':'水',
'滼':'水',
'鴋':'水',
'摡':'水',
'槪':'木',
'漑':'水',
'葢':'木',
'鴀':'水',
'髴':'水',
'墳':'水',
'魵':'水',
'葍':'木',
'萯':'水',
'蝜':'水',
'褔':'水',
'鳺':'水',
'漧':'水',
'槹':'木',
'皜':'水',
'稾':'水',
'禞':'水',
'鞈':'水',
'韐':'水',
'緪':'水',
'羮':'水',
'僼':'水',
'摓':'水',
'漨':'水',
'熢':'水',
'篈':'水',
'鴌':'水',
'匔':'水',
'碽':'水',
'銾':'水',
'鋛':'水',
'撀':'水',
'嫴':'水',
'緺':'水',
'葀':'木',
'銽':'水',
'頢':'水',
'樌':'木',
'瘝':'水',
'輨':'水',
'嶡':'水',
'摫':'水',
'暩':'水',
'槶':'木',
'槻':'木',
'槼':'木',
'蟡':'水',
'滾':'水',
'緷':'水',
'彉':'水',
'慖':'水',
'槨':'木',
'輠':'水',
'餀':'水',
'嘷':'水',
'暭':'水',
'諕':'水',
'鞎':'水',
'熯':'水',
'鋎':'水',
'銲':'水',
'鋡':'水',
'魧':'水',
'摦':'水',
'嬅':'水',
'槬':'木',
'磆':'水',
'鋘':'水',
'翭':'水',
'葔':'木',
'諙':'水',
'潂':'水',
'篊':'水',
'葓':'木',
'谾':'水',
'槵':'木',
'鴅':'水',
'墴':'水',
'皝':'水',
'葟':'木',
'幠':'水',
'戱':'水',
'摢':'水',
'槴':'木',
'歑':'水',
'熩':'水',
'箶':'水',
'衚':'水',
'魱':'水',
'鳸':'水',
'噅':'水',
'噕':'水',
'圚':'水',
'嬇':'水',
'寭':'水',
'暳':'水',
'槥':'木',
'瘣':'水',
'缋':'水',
'萿':'水',
'槣':'木',
'樍':'木',
'漃':'水',
'禝':'水',
'箿':'水',
'葪':'木',
'蝍':'水',
'諅':'水',
'諆':'水',
'踑':'水',
'踖':'水',
'躸':'水',
'鞊':'水',
'腵':'水',
'熞':'水',
'糋':'水',
'葌':'木',
'葏':'木',
'葥':'木',
'趝':'水',
'鳽':'水',
'摾':'水',
'摪':'水',
'滰':'水',
'獎':'水',
'葁':'木',
'儌':'水',
'劋':'水',
'嫶':'水',
'嶕':'水',
'摷':'水',
'僸':'水',
'凚':'水',
'嶜':'水',
'歏':'水',
'漌':'水',
'鹶':'水',
'莭':'木',
'蝔':'水',
'誱':'水',
'踕':'水',
'魪':'水',
'幜':'水',
'葝':'木',
'慦':'水',
'摎':'水',
'樛':'木',
'稵':'水',
'噊':'水',
'爴':'水',
'瘚':'水',
'觮':'水',
'逫':'水',
'鴂':'水',
'鴃':'水',
'勮':'水',
'聥':'水',
'萭':'水',
'葅':'木',
'蝺':'水',
'諊':'水',
'趜':'水',
'踘':'水',
'踙':'水',
'躹':'水',
'閰':'水',
'駏':'水',
'慻':'水',
'踡':'水',
'韏':'水',
'餋':'水',
'儁':'水',
'陖':'水',
'輡':'水',
'漮':'水',
'槺':'木',
'髛':'水',
'樖':'木',
'艐':'水',
'萪':'水',
'摼':'水',
'銵':'水',
'瞉':'水',
'墤':'水',
'嘳':'水',
'磈':'水',
'聧':'水',
'樃':'木',
'瑯':'水',
'噋':'水',
'磖':'水',
'逨':'水',
'郲':'水',
'厱':'水',
'葻':'木',
'醂':'水',
'樏':'木',
'畾':'水',
'頛':'水',
'頪':'水',
'踜':'水',
'輘':'水',
'樆':'木',
'氂':'水',
'犛':'水',
'瑮':'水',
'蝷':'水',
'鋫':'水',
'劆':'水',
'匳':'水',
'噒':'水',
'嫾':'水',
'慩':'水',
'摙':'水',
'稴':'水',
'萰':'水',
'樑':'木',
'嶚':'水',
'嶛':'水',
'憀':'水',
'敹':'水',
'熮':'水',
'巤':'水',
'颲':'水',
'駖':'水',
'慺':'水',
'熡':'水',
'瑠':'水',
'磂':'水',
'駠':'水',
'嶐':'水',
'摝':'水',
'樐':'木',
'樚':'木',
'熝':'水',
'趢':'水',
'踛':'水',
'醁':'水',
'魲':'水',
'鋢':'水',
'踚':'水',
'躶':'水',
'犘':'水',
'嘪':'水',
'蝐':'水',
'慲':'水',
'摱':'水',
'槾':'木',
'樠':'木',
'獌':'水',
'嫹':'水',
'瞐':'水',
'艒':'水',
'萺':'水',
'髳':'水',
'嬍':'水',
'篃':'水',
'腜':'水',
'蝞':'水',
'葿':'木',
'鋂':'水',
'暪':'水',
'蝱':'水',
'樒':'木',
'滵':'水',
'漞':'水',
'瞇':'水',
'葞':'木',
'鼏':'水',
'緜':'水',
'糆':'水',
'臱':'水',
'葂':'木',
'蝒':'水',
'麪':'水',
'僶':'水',
'慜':'水',
'篎':'水',
'緢':'水',
'嫼':'水',
'慔':'水',
'暯':'水',
'獏':'水',
'魩':'水',
'氁':'水',
'霂':'水',
'誽':'水',
'魶':'水',
'摨':'水',
'暱':'水',
'殢':'水',
'觬':'水',
'貎':'水',
'郳':'水',
'艌':'水',
'樢':'木',
'摰':'水',
'槸':'木',
'槷':'木',
'踗':'水',
'辳':'水',
'腢':'水',
'輫':'水',
'鋬':'水',
'樥':'木',
'漰':'水',
'輣':'水',
'輧':'水',
'駍':'水',
'慿':'水',
'箳':'水',
'郱':'水',
'頩':'水',
'葐':'木',
'磇':'水',
'諀':'水',
'髬':'水',
'鴄':'水',
'頨':'水',
'慓':'水',
'嫳':'水',
'諩':'水',
'陠':'水',
'噐':'水',
'慽':'水',
'慼':'水',
'甈':'水',
'磎':'水',
'羬':'水',
'諐':'水',
'輤':'水',
'漒':'水',
'僺':'水',
'嘺':'水',
'墝':'水',
'墧':'水',
'碻':'水',
'箾':'水',
'陗':'水',
'頝':'水',
'踥':'水',
'鳹':'水',
'樈':'木',
'漀':'水',
'郬':'水',
'瞏':'水',
'篍':'水',
'緧':'水',
'蝵':'水',
'趞':'水',
'嘫':'水',
'憈':'水',
'敺':'水',
'葋':'木',
'誳':'水',
'駈':'水',
'葲':'木',
'槦':'木',
'滽':'水',
'穁':'水',
'腬':'水',
'葇':'木',
'蝚':'水',
'餁':'水',
'蝡':'水',
'緛':'水',
'摋':'水',
'僿':'水',
'犙':'水',
'糂':'水',
'槮':'木',
'葠':'木',
'覢':'水',
'摵':'水',
'儍':'水',
'閯':'水',
'魦':'水',
'萷':'水',
'慯':'水',
'樉':'木',
'滳':'水',
'漡':'水',
'墭':'水',
'箵':'水',
'慴':'水',
'瑡':'水',
'箷':'水',
'蝨':'水',
'葹':'木',
'銴':'水',
'鳾':'水',
'鋠':'水',
'頣':'水',
'魫':'水',
'樜':'木',
'豎':'水',
'慡':'水',
'廝':'水',
'磃':'水',
'禠':'水',
'罳':'水',
'鋖':'水',
'樎':'木',
'摍':'水',
'摗':'水',
'樕':'木',
'碿':'水',
'鋉':'水',
'熣':'水',
'賥':'水',
'箰':'水',
'誻':'水',
'摥':'水',
'漟':'水',
'磄':'水',
'禟':'水',
'糃':'水',
'蝪':'水',
'瑫':'水',
'鞉':'水',
'漛':'水',
'歒':'水',
'褅':'水',
'褆':'水',
'逷':'水',
'骵':'水',
'髰':'水',
'墵':'水',
'歎':'水',
'醈':'水',
'磌':'水',
'窴':'水',
'覥':'水',
'賟':'水',
'餂':'水',
'樤':'木',
'窱':'水',
'鋚':'水',
'聤':'水',
'蝏':'水',
'閮':'水',
'憅':'水',
'樋':'木',
'餇':'水',
'緰':'水',
'廜':'水',
'尵':'水',
'慱':'水',
'漙':'水',
'槫':'木',
'褖':'水',
'駞':'水',
'漥':'水',
'翫':'水',
'踠':'水',
'鋄':'水',
'鋔':'水',
'魭':'水',
'熭':'水',
'犚':'水',
'緭':'水',
'腲':'水',
'葨':'木',
'蝛':'水',
'蝟':'水',
'覣':'水',
'踓':'水',
'醀':'水',
'韑':'水',
'瑥':'水',
'魰':'水',
'鳼':'水',
'鴍':'水',
'墲':'水',
'瑦':'水',
'箼':'水',
'腛':'水',
'噏':'水',
'嬆':'水',
'槢':'木',
'漇':'水',
'漝':'水',
'瘜':'水',
'葈':'木',
'覤':'水',
'瞈':'水',
'磍':'水',
'陜':'水',
'誷':'水',
'嫺':'水',
'甉':'水',
'箲':'水',
'誸':'水',
'鋧':'水',
'韯':'水',
'嶑':'水',
'萫':'水',
'彇':'水',
'誵':'水',
'郩':'水',
'屧':'水',
'暬':'水',
'緤':'水',
'緳':'水',
'蝢':'水',
'褉':'水',
'篂':'水',
'葕':'木',
'鋞':'水',
'樇':'木',
'潃':'水',
'褏':'水',
'褎':'水',
'箮':'水',
'翧':'水',
'萲':'水',
'蝖':'水',
'漵':'水',
'稸':'水',
'緖':'水',
'蝑':'水',
'魣':'水',
'漄':'水',
'摿':'水',
'瑤':'水',
'窯':'水',
'窰':'水',
'葯':'木',
'葽':'木',
'餆':'水',
'嬊':'水',
'嶖':'水',
'揅':'水',
'褗':'水',
'醃':'水',
'鴈':'水',
'駚':'水',
'嬄':'水',
'熤':'水',
'熪':'水',
'輢':'水',
'黓':'水',
'僷':'水',
'墷':'水',
'漜':'水',
'噖':'水',
'殥':'水',
'緸':'水',
'趛':'水',
'鞇':'水',
'摬':'水',
'甇':'水',
'禜':'水',
'萾':'水',
'蝧':'水',
'牅':'水',
'銿':'水',
'逰':'水',
'慾':'水',
'稶':'水',
'羭':'水',
'萮':'水',
'逳':'水',
'鋊':'水',
'雓':'水',
'鳿':'水',
'葾':'木',
'蝝':'水',
'蝯':'水',
'褑':'水',
'駌':'水',
'箹':'水',
'閱':'水',
'磒':'水',
'腪':'水',
'蒀':'木',
'魳':'水',
'賛':'水',
'諎':'水',
'銺':'水',
'樝':'木',
'嫸':'水',
'嶘':'水',
'輚':'水',
'醆':'水',
'慞':'水',
'瑵':'水',
'駋':'水',
'慹':'水',
'輙':'水',
'銸':'水',
'駗':'水',
'嬂':'水',
'憄':'水',
'漐':'水',
'熫':'水',
'稺':'水',
'鋕':'水',
'鳷':'水',
'僽':'水',
'輖':'水',
'週':'水',
'郮':'水',
'駎':'水',
'樦':'木',
'蝫':'水',
'蒃':'水',
'諈':'水',
'劅':'水',
'鋜':'水',
'葘':'木',
'摠':'水',
'熧':'水',
'糉':'水',
'緵':'水',
'翪':'水',
'踨':'水',
'蝬':'水',
'葼':'木',
'郰':'水',
'葃':'木',
'葄':'木',
'乡':'木',
'鄉':'木',
'历':'木',
'歷':'木',
'曆':'木',
'办':'火',
'辦':'木',
'扑':'木',
'撲':'木',
'龙':'木',
'龍':'木',
'卢':'木',
'盧':'木',
'头':'木',
'頭':'木',
'朴':'木',
'樸':'木',
'机':'木',
'機':'木',
'过':'木',
'過':'木',
'达':'木',
'達':'木',
'噹':'木',
'灯':'木',
'燈':'木',
'讳':'木',
'諱':'木',
'讽':'金',
'諷':'木',
'儘':'木',
'陰':'木',
'违':'木',
'違':'木',
'运':'木',
'運':'木',
'抚':'木',
'撫':'木',
'坛':'木',
'壇':'木',
'苍':'木',
'蒼':'木',
'县':'木',
'縣':'木',
'吨':'木',
'噸':'木',
'餘':'木',
'龟':'木',
'龜':'木',
'诸':'木',
'諸':'木',
'陆':'土',
'陸':'木',
'陈':'土',
'陳':'木',
'表':'木',
'錶':'木',
'拨':'木',
'撥':'木',
'奋':'火',
'奮':'木',
'凭':'火',
'憑':'木',
'剂':'金',
'劑':'木',
'泼':'木',
'潑':'木',
'怜':'木',
'憐':'木',
'学':'木',
'學':'木',
'录':'木',
'録':'木',
'挠':'木',
'撓':'木',
'树':'木',
'樹':'木',
'砖':'土',
'磚':'木',
'战':'木',
'戰':'木',
'蚂':'火',
'螞':'木',
'骂':'木',
'駡':'木',
'钢':'木',
'鋼':'木',
'亲':'木',
'親':'木',
'诺':'木',
'諾':'木',
'洁':'水',
'潔':'木',
'浇':'木',
'澆':'木',
'举':'木',
'舉':'木',
'宪':'木',
'憲':'木',
'垦':'木',
'墾':'木',
'骆':'水',
'駱':'木',
'骇':'木',
'駭':'木',
'捞':'木',
'撈':'木',
'都':'木',
'桥':'木',
'橋':'木',
'桦':'木',
'樺':'木',
'晓':'木',
'曉':'木',
'鸭':'火',
'鴨':'水',
'鸯':'木',
'鴦':'水',
'罢':'木',
'罷':'木',
'钱':'木',
'錢':'木',
'积':'木',
'積':'木',
'舱':'木',
'艙':'木',
'鸵':'木',
'鸳':'木',
'鴛':'水',
'饿':'木',
'餓':'木',
'馁':'木',
'餒':'木',
'烧':'木',
'燒':'木',
'涝':'木',
'澇':'木',
'润':'水',
'潤':'木',
'涧':'木',
'澗':'木',
'烫':'木',
'燙':'木',
'涩':'木',
'澀':'木',
'悯':'木',
'憫':'木',
'陵':'土',
'陶':'土',
'陷':'木',
'陪':'土',
'萤':'木',
'螢':'木',
'酝':'木',
'醖':'木',
'鄂':'木',
'阎':'木',
'閻':'木',
'盖':'木',
'蓋':'木',
'谋':'金',
'謀':'木',
'谍':'木',
'諜':'木',
'谐':'木',
'諧':'木',
'谓':'木',
'謂':'木',
'谚':'木',
'諺':'木',
'颈':'木',
'頸':'木',
'椭':'木',
'橢':'木',
'逼':'木',
'颊':'木',
'頰':'木',
'遇':'木',
'遏':'木',
'赌':'木',
'賭':'木',
'筑':'木',
'築':'木',
'筛':'木',
'篩':'木',
'御':'木',
'禦':'木',
'逾':'木',
'道':'木',
'遂':'木',
'溃':'木',
'潰':'木',
'愤':'木',
'憤':'木',
'遍':'木',
'裤':'火',
'褲':'木',
'蒜':'木',
'蓄':'木',
'蒲':'木',
'蓉':'木',
'蒙':'木',
'蒸':'木',
'赖':'木',
'賴':'木',
'辐':'木',
'輻':'木',
'辑':'金',
'輯':'木',
'输':'木',
'輸':'木',
'频':'木',
'頻':'木',
'错':'木',
'錯':'木',
'锡':'金',
'錫':'木',
'锤':'木',
'錘':'木',
'锥':'木',
'錐':'木',
'锦':'木',
'錦':'木',
'锯':'木',
'鋸':'木',
'锰':'木',
'錳':'木',
'颓':'木',
'頹':'木',
'遥':'木',
'腿':'木',
'鲍':'木',
'鮑':'水',
'颖':'木',
'穎':'木',
'窥':'木',
'窺':'木',
'缚':'水',
'縛':'木',
'剿':'木',
'静':'木',
'靜':'木',
'璃':'土',
'墙':'木',
'墻':'木',
'撇':'木',
'踊':'木',
'踴':'木',
'膊':'木',
'膀':'水',
'膏':'木',
'褪':'木',
'撕':'木',
'撒':'木',
'撩':'木',
'撑':'木',
'撮':'木',
'撬':'木',
'播':'木',
'撞':'木',
'撤':'木',
'撰':'木',
'橡':'木',
'橄':'木',
'瞒':'木',
'瞞':'木',
'艘':'木',
'憋':'木',
'潜':'木',
'澎':'木',
'潮':'木',
'潭':'木',
'潘':'木',
'澈':'水',
'澄':'水',
'憔':'木',
'憎':'木',
'褥':'火',
'憨':'木',
'豫':'木',
'燕':'木',
'翰':'木',
'噩':'木',
'橱':'木',
'橙':'木',
'橘':'木',
'融':'木',
'瓢':'木',
'醒':'木',
'霍':'木',
'霎':'木',
'冀':'木',
'餐':'木',
'踱':'木',
'蹄':'木',
'蹂':'木',
'螃':'火',
'器':'木',
'噪':'木',
'默':'木',
'黔':'木',
'穆':'木',
'篡':'木',
'儒':'土',
'衡':'木',
'雕':'木',
'磨':'木',
'瘸':'木',
'凝':'水',
'辨':'木',
'糖':'木',
'糕':'木',
'燃':'木',
'壁':'木',
'沩':'木',
'潙':'木',
'怃':'木',
'憮':'木',
'瓯':'木',
'甌':'木',
'昙':'木',
'曇':'木',
'峄':'木',
'嶧':'木',
'侪':'木',
'儕':'木',
'郓':'木',
'鄆':'木',
'诨':'木',
'諢':'木',
'绉':'木',
'縐':'木',
'挦':'木',
'撏':'木',
'荪':'木',
'蓀':'木',
'哕':'木',
'噦':'木',
'哙':'木',
'噲':'木',
'哝':'木',
'噥':'木',
'笃':'木',
'篤':'木',
'俦':'木',
'儔':'木',
'疭':'木',
'瘲':'木',
'炽':'火',
'熾':'木',
'浔':'木',
'潯':'木',
'骈':'木',
'駢':'木',
'莳':'木',
'蒔':'木',
'鸪':'木',
'鴣':'水',
'莼':'木',
'蒓':'木',
'桡':'木',
'橈':'木',
'鸮':'木',
'鴞':'水',
'鸱':'木',
'鴟':'水',
'鸲':'木',
'鴝':'水',
'饽':'木',
'餑':'木',
'烨':'火',
'燁':'木',
'涠':'木',
'潿':'木',
'谀':'木',
'諛':'木',
'陬':'木',
'陲':'木',
'绦':'木',
'縧':'木',
'琏':'木',
'璉':'木',
'掸':'木',
'撣':'木',
'萦':'木',
'縈':'木',
'郾':'木',
'鄄':'木',
'铮':'金',
'錚':'木',
'阈':'木',
'閾':'木',
'阉':'木',
'閹':'木',
'阊':'木',
'閶':'木',
'阍':'木',
'閽':'木',
'阏':'木',
'閼':'木',
'焖':'木',
'燜':'木',
'惮':'木',
'憚':'木',
'谌':'木',
'諶':'木',
'谏':'木',
'諫':'木',
'谒':'木',
'謁':'木',
'谔':'木',
'諤':'木',
'谕':'木',
'諭':'木',
'谖':'木',
'諼':'木',
'谙':'木',
'諳':'木',
'谛':'木',
'諦':'木',
'谝':'木',
'諞':'木',
'郿':'木',
'揿':'木',
'撳':'木',
'殚':'木',
'殫':'木',
'蛳':'木',
'螄':'木',
'遄':'木',
'铼':'木',
'錸':'木',
'锕':'木',
'錒':'木',
'傧':'木',
'儐':'木',
'遑':'木',
'遁':'木',
'遒':'木',
'愦':'木',
'憒':'木',
'遐':'木',
'缒':'水',
'縋':'木',
'蓁':'木',
'蓍':'木',
'蓐':'木',
'蒽':'木',
'蓓':'木',
'蓖':'木',
'蓊':'木',
'蒯':'木',
'蓑':'木',
'蒿':'木',
'蒺':'木',
'蒟':'木',
'蒡':'木',
'蒹':'木',
'蒴':'木',
'蒗':'木',
'颐':'木',
'頤':'木',
'碛':'木',
'磧':'木',
'碜':'木',
'磣':'木',
'辏':'木',
'輳':'木',
'嗳':'木',
'噯':'木',
'锛':'木',
'錛':'木',
'锜':'木',
'錡':'木',
'锝':'木',
'鍀':'木',
'锞':'木',
'錁':'木',
'锟':'金',
'錕':'木',
'锢':'金',
'錮':'木',
'锨':'木',
'鍁':'木',
'锩':'木',
'錈':'木',
'锭':'木',
'錠':'木',
'锱':'木',
'錙':'木',
'觎':'木',
'覦':'木',
'颔':'木',
'頷':'木',
'鲅':'木',
'鮁':'木',
'鲆':'木',
'鮃':'木',
'鲇':'木',
'鮎':'水',
'稣':'木',
'穌':'木',
'鲋':'木',
'鮒':'水',
'鲐':'水',
'鮐':'水',
'瘆':'木',
'瘮':'木',
'滗':'木',
'潷':'木',
'嫒':'木',
'嬡':'木',
'缙':'水',
'縉':'木',
'缜':'木',
'縝':'木',
'缛':'水',
'縟':'木',
'缟':'水',
'縞':'木',
'缢':'水',
'縊':'木',
'缣':'水',
'縑':'木',
'璈':'木',
'甍':'木',
'螂':'木',
'膈':'木',
'瘘':'木',
'瘻':'木',
'膂':'木',
'潢':'木',
'潴':'木',
'澉':'木',
'褡':'木',
'嫱':'木',
'嬙':'木',
'瑾':'土',
'璀':'木',
'璁':'木',
'璋':'土',
'璇':'木',
'撅':'木',
'赭':'木',
'撙':'木',
'瞢':'木',
'噶':'木',
'暹':'木',
'螋':'木',
'噢':'木',
'骺':'木',
'骼':'木',
'骸':'木',
'獗':'木',
'獠':'木',
'瘼':'木',
'澍':'木',
'澌':'木',
'潸':'木',
'潦':'木',
'潲':'木',
'潟':'木',
'潼':'水',
'潺':'木',
'憬':'木',
'憧':'火',
'褟':'木',
'褫':'木',
'耩':'木',
'耨':'木',
'耪':'木',
'靛':'木',
'髻':'木',
'髹':'木',
'熹':'火',
'縠':'木',
'磬':'木',
'鞘':'木',
'樾':'木',
'橛':'木',
'橇':'木',
'樵':'木',
'樽':'木',
'墼':'木',
'橐':'木',
'翮':'木',
'醐':'木',
'醍':'木',
'殪':'木',
'霖':'木',
'霏':'木',
'霓':'木',
'臻':'木',
'氅':'木',
'瞟':'木',
'瞠':'木',
'噤':'木',
'暾':'木',
'蹀':'木',
'踹':'木',
'踵':'木',
'踽':'木',
'蹁':'木',
'螈':'木',
'螅':'木',
'螠':'木',
'螟':'木',
'噱':'木',
'噬':'木',
'噫':'木',
'噻':'木',
'噼':'木',
'圜':'木',
'氆':'木',
'憩':'木',
'篝':'木',
'篥':'木',
'篦':'木',
'篪':'木',
'篙':'木',
'盥':'木',
'劓':'木',
'翱':'木',
'徼':'木',
'歙':'木',
'廨':'土',
'瘰':'木',
'廪':'土',
'瘵':'木',
'瘴':'木',
'瘳':'木',
'麇':'木',
'麈':'木',
'壅':'木',
'羲':'木',
'糗':'木',
'燎':'火',
'燔':'木',
'潞':'木',
'褰':'木',
'寰':'土',
'窸':'木',
'嬖':'木',
'犟':'木',
'嬗':'木',
'㧑':'木',
'撝':'木',
'沄':'木',
'澐':'木',
'钔':'木',
'鍆':'木',
'峃':'木',
'嶨':'木',
'哒':'木',
'噠':'木',
'骃':'木',
'駰':'木',
'鄀':'木',
'晔':'木',
'曄':'木',
'崄':'木',
'嶮':'木',
'鸰':'木',
'鴒':'水',
'窎':'木',
'窵':'木',
'陴':'木',
'䓨':'木',
'罃':'木',
'鄅':'木',
'鄃':'木',
'阌':'木',
'閿':'木',
'谞':'木',
'諝':'木',
'蓇':'木',
'蒐':'木',
'颋':'木',
'頲':'木',
'遆':'木',
'赪':'木',
'赬':'木',
'蒱':'木',
'蒨':'木',
'蓏':'木',
'蓂':'木',
'蒻':'木',
'辒':'木',
'輼':'木',
'赗':'木',
'賵':'木',
'锖':'木',
'錆':'木',
'锳':'木',
'鍈':'木',
'锪':'木',
'鍃':'木',
'锫':'木',
'錇':'木',
'锬':'木',
'錟':'木',
'䅟':'木',
'穇':'木',
'筼':'木',
'篔':'木',
'鲉':'水',
'鮋':'水',
'鲊':'水',
'鮓':'水',
'鲌':'木',
'鮊':'水',
'䲟':'木',
'鮣':'水',
'鲏':'木',
'鮍':'水',
'缞':'木',
'縗':'木',
'撖':'木',
'潩':'木',
'漋':'木',
'窭':'木',
'窶':'木',
'璆':'木',
'劐':'木',
'鼒':'木',
'慭':'木',
'憖':'木',
'罶':'木',
'嶲':'木',
'潖':'木',
'潵':'木',
'澂':'木',
'潽':'木',
'潾':'木',
'潏':'木',
'憭':'木',
'憕':'木',
'褯':'木',
'禤':'木',
'憙':'木',
'鞔':'木',
'橞':'木',
'橑':'木',
'橦':'木',
'醑':'木',
'觱':'木',
'磡':'木',
'虤':'木',
'暿':'木',
'曌':'木',
'曈':'木',
'蹅':'木',
'踶':'木',
'螗':'木',
'疁':'木',
'嶦':'木',
'馞':'木',
'穄':'木',
'篚':'木',
'鼽':'木',
'衠':'木',
'盦':'木',
'螣':'木',
'縢':'木',
'癀':'木',
'瘭':'木',
'羱':'木',
'糒':'木',
'燋':'木',
'熻':'木',
'燊':'木',
'燚':'木',
'燏':'木',
'嬛':'木',
'翯':'木',
'潕':'木',
'鋹':'木',
'錀':'木',
'駪':'木',
'餗':'木',
'燖':'木',
'諲':'木',
'諴':'木',
'諟':'木',
'燀':'木',
'輶':'木',
'輮':'木',
'錤':'木',
'錞':'木',
'鮈':'水',
'篢':'木',
'鮀':'木',
'頵':'木',
'璊':'木',
'鮆':'木',
'縍':'木',
'艕':'木',
'賲':'木',
'闁':'木',
'儑':'木',
'錌':'木',
'墺':'木',
'磝':'木',
'螌':'木',
'褩':'木',
'撪':'木',
'燌':'木',
'獖':'木',
'壀':'木',
'憊':'木',
'鄁':'木',
'錃':'木',
'錍':'木',
'辧':'木',
'鞕':'木',
'鴘':'水',
'壆':'木',
'孹':'木',
'駮':'木',
'磦':'木',
'麅':'木',
'鉼':'木',
'錋':'木',
'廦':'木',
'獘':'木',
'獙':'木',
'螕':'木',
'鮅':'木',
'餔':'木',
'嬠':'木',
'憯':'木',
'撡':'木',
'憡':'木',
'橬':'木',
'幨':'木',
'潹':'木',
'磛':'木',
'撦':'木',
'疀':'木',
'艖':'木',
'瑺':'木',
'錩':'木',
'鋿':'木',
'窼':'木',
'撐':'木',
'撜':'木',
'橕':'木',
'頳':'木',
'踸':'木',
'齓':'木',
'憏':'木',
'瞝':'木',
'遅':'木',
'篘':'木',
'雔':'木',
'霌':'木',
'篨':'木',
'蒢':'木',
'蒭':'木',
'麆':'木',
'歘':'木',
'諯':'木',
'踳':'木',
'輲':'木',
'磢':'木',
'窻':'木',
'憌':'木',
'橁':'木',
'賰':'木',
'輴':'木',
'醕':'木',
'磭':'木',
'縒':'木',
'螆':'木',
'鴜':'水',
'憱':'木',
'殧':'木',
'瘯':'木',
'踿':'木',
'殩':'木',
'熶':'木',
'撘':'木',
'觰':'木',
'皠':'木',
'磪':'木',
'澊':'木',
'樷':'木',
'潨':'木',
'瑽':'木',
'瞛':'木',
'錝':'木',
'蒫':'木',
'蓌':'木',
'曃':'木',
'鴏':'水',
'噡':'木',
'撢':'木',
'暺':'木',
'潬':'木',
'鴠':'水',
'黕':'木',
'潒':'木',
'逿':'木',
'噵':'木',
'衟':'木',
'嶳':'木',
'潪':'木',
'甋':'木',
'鴩':'水',
'嬞':'木',
'駧':'木',
'壂':'木',
'橂':'木',
'蒧':'木',
'瞗':'木',
'瘹':'木',
'鋽':'木',
'錭':'木',
'鮉':'水',
'螙':'木',
'覩':'木',
'醏':'木',
'錖':'木',
'餖':'木',
'毈':'木',
'憝':'木',
'憞':'木',
'陮':'木',
'撉':'木',
'潡':'木',
'燉':'木',
'犜':'木',
'踲':'木',
'憜':'木',
'嶭':'木',
'覨':'木',
'遌':'木',
'樲':'木',
'輭':'木',
'駬':'木',
'髵':'木',
'髶':'木',
'橃':'木',
'憣':'木',
'橎':'木',
'燓':'木',
'曊':'木',
'陫':'木',
'幩':'木',
'橨':'木',
'歕':'木',
'蒶':'木',
'黺':'木',
'澓':'木',
'糐':'木',
'諨':'木',
'踾':'木',
'輹':'木',
'陚':'木',
'鮄':'木',
'鴔':'水',
'麬':'木',
'嶱':'木',
'諽':'木',
'輵':'木',
'鴚':'水',
'澒':'木',
'髸':'木',
'褠':'木',
'橭':'木',
'糓':'木',
'縎':'木',
'鮕':'水',
'踻':'木',
'髺':'木',
'舘':'木',
'錧':'木',
'黆':'木',
'撌':'木',
'樻':'木',
'瞡':'木',
'蓕':'木',
'螝':'木',
'鮌':'水',
'潶':'木',
'澔':'木',
'獋':'木',
'澕':'木',
'篕':'木',
'蒚':'木',
'螛':'木',
'魺':'木',
'噷':'木',
'澏':'木',
'螒':'木',
'馠':'木',
'魽':'木',
'澅':'木',
'螖':'木',
'諣':'木',
'鄇':'木',
'褢':'木',
'褱':'木',
'撔':'木',
'撗':'木',
'橫':'木',
'澋':'木',
'諻':'木',
'彋':'木',
'輷':'木',
'闀':'木',
'闂':'木',
'霐':'木',
'鬨':'木',
'曂':'木',
'熿':'木',
'獚':'木',
'螜':'木',
'頶':'木',
'噧':'木',
'嬒':'木',
'徻':'木',
'憓':'木',
'殨':'木',
'毇':'木',
'潓':'木',
'頮':'木',
'奯':'木',
'蒦':'木',
'蓃':'木',
'嶯':'木',
'撠':'木',
'潗':'木',
'穊':'木',
'膌':'木',
'螏':'木',
'豭':'木',
'貑':'木',
'鴐':'水',
'劒':'木',
'橌':'木',
'熸':'木',
'鋻':'木',
'壃':'木',
'彊':'木',
'噭':'木',
'嬓':'木',
'憍':'木',
'撟':'木',
'敽':'木',
'潐':'木',
'瘽':'木',
'賮':'木',
'黅':'木',
'镼':'木',
'暻':'木',
'燛':'木',
'璄':'木',
'澃':'木',
'褧':'木',
'駫':'木',
'醔':'木',
'憠':'木',
'憰':'木',
'撧':'木',
'橜':'木',
'壉':'木',
'郹':'木',
'陱':'木',
'鮔':'水',
'鴡':'水',
'鞙':'木',
'鬳':'木',
'寯':'木',
'燇':'木',
'餕':'木',
'穅':'木',
'錓':'木',
'瞘':'木',
'骻':'木',
'廥':'木',
'聭':'木',
'鄈':'木',
'頯':'木',
'朤':'木',
'蓈':'木',
'瑻':'木',
'閸':'木',
'憥':'木',
'橯':'木',
'憦':'木',
'頱':'木',
'儖':'木',
'壈':'木',
'燗':'木',
'覧':'木',
'磥':'木',
'錑':'木',
'蒞':'木',
'錅':'木',
'隷':'木',
'鴗':'水',
'嬚':'木',
'膁':'木',
'螊':'木',
'錬':'木',
'暸':'木',
'窷':'木',
'膋':'木',
'錂':'木',
'魿':'木',
'鹷':'木',
'廩':'木',
'撛':'木',
'斴':'木',
'暽':'木',
'橉':'木',
'燐':'木',
'獜':'木',
'閵':'木',
'甊':'木',
'瘺':'木',
'瞜':'木',
'橊':'木',
'橮':'木',
'澑':'木',
'磟':'木',
'蒥':'木',
'蓅':'木',
'篭':'木',
'磠':'木',
'穋':'木',
'錄':'木',
'陯':'木',
'罵':'木',
'貓':'木',
'燘':'木',
'穈':'木',
'儚':'木',
'橗':'木',
'冪':'木',
'幦':'木',
'蒾':'木',
'醎':'木',
'靦':'木',
'鴓':'水',
'潣':'木',
'賯':'木',
'錉':'木',
'閺':'木',
'鴖':'水',
'橅':'木',
'瞙':'木',
'蒳':'木',
'褦':'木',
'螚':'木',
'諵':'木',
'嶩':'木',
'錗':'木',
'儗':'木',
'糑':'木',
'縌':'木',
'撚':'木',
'儜':'木',
'橣':'木',
'嬝':'木',
'褭':'木',
'篞':'木',
'臲':'木',
'錜':'木',
'蒘':'木',
'鴑':'水',
'撋':'木',
'橠':'木',
'蹃':'木',
'逽':'木',
'縏':'木',
'蒰':'木',
'篣':'木',
'麭':'木',
'憉':'木',
'磞':'木',
'韸':'木',
'竮':'木',
'潎':'木',
'膍':'木',
'魾':'木',
'撆':'木',
'暼':'木',
'蒪':'木',
'獛':'木',
'摖':'木',
'璂':'木',
'磩':'木',
'禥':'木',
'諬':'木',
'諿':'木',
'陭':'木',
'霋':'木',
'儙':'木',
'潛':'木',
'燂':'木',
'燅':'木',
'篟':'木',
'廧':'木',
'篬':'木',
'墽':'木',
'幧':'木',
'燆':'木',
'犞':'木',
'郻':'木',
'韒':'木',
'骹':'木',
'螓':'木',
'儝':'木',
'橩':'木',
'螑':'木',
'趥':'木',
'鮂':'木',
'蒛':'木',
'橪':'木',
'髷':'木',
'魼':'木',
'麮':'木',
'縓':'木',
'駩':'木',
'氄':'木',
'縙':'木',
'螎':'木',
'褣':'木',
'駥':'木',
'鴧':'水',
'叡':'木',
'橤':'木',
'橍':'木',
'篛':'木',
'褬':'木',
'樿':'木',
'橏':'木',
'澁':'木',
'瘷':'木',
'蔱':'木',
'颵':'木',
'陹':'木',
'嬕':'木',
'蒒':'木',
'諡':'木',
'遈':'木',
'餝':'木',
'膄':'木',
'頥':'木',
'潻':'木',
'錰':'木',
'霔':'木',
'縔':'木',
'橓':'木',
'瞚':'木',
'燍':'木',
'璅':'木',
'簑':'木',
'褨':'木',
'瘶':'木',
'橚':'木',
'憟':'木',
'潚':'木',
'潥':'木',
'縤':'木',
'膆':'木',
'匴':'木',
'嬘':'木',
'遀':'木',
'鞖':'木',
'潠':'木',
'錔':'木',
'儓':'木',
'橖':'木',
'篖':'木',
'膅':'木',
'蓎':'木',
'踼':'木',
'縚':'木',
'鋾':'木',
'駣':'木',
'駦':'木',
'漽':'木',
'趧':'木',
'憳':'木',
'憛':'木',
'橝':'木',
'醓':'木',
'錪':'木',
'斢':'木',
'鞗':'木',
'諪':'木',
'鞓':'木',
'朣':'木',
'氃':'木',
'燑':'木',
'犝':'木',
'獞':'木',
'瑹':'木',
'潳':'木',
'蒤':'木',
'馟':'木',
'橔':'木',
'頺':'木',
'頽':'木',
'霕':'木',
'黗':'木',
'貒':'木',
'撱':'木',
'鴕':'水',
'膃':'木',
'潫':'木',
'衞':'木',
'鮇':'木',
'螡':'木',
'儛':'木',
'橆':'木',
'窹':'木',
'螐':'木',
'凞':'木',
'憘':'木',
'敼':'木',
'橀':'木',
'歖':'木',
'潝':'木',
'熺':'木',
'縘':'木',
'蒠':'木',
'蒵':'木',
'蓆':'木',
'螇':'木',
'諰':'木',
'黖':'木',
'聬':'木',
'螉':'木',
'縖':'木',
'赮':'木',
'魻':'木',
'嬐':'木',
'憪':'木',
'撊':'木',
'澖':'木',
'蓒':'木',
'輱':'木',
'錎':'木',
'憢':'木',
'撨':'木',
'歗':'木',
'熽':'木',
'獟':'木',
'獢':'木',
'篠':'木',
'嶰':'木',
'糏':'木',
'膎':'木',
'韰':'木',
'嬜':'木',
'攳':'木',
'樳':'木',
'鮏':'水',
'糔':'木',
'諠':'木',
'颴':'木',
'歔':'木',
'獝':'木',
'蒣':'木',
'勳':'木',
'駨':'木',
'錏':'木',
'蓔':'木',
'鴢':'水',
'鼼':'木',
'辥':'木',
'噞':'木',
'燄':'木',
'躽':'木',
'遃':'木',
'諹':'木',
'輰':'木',
'圛':'木',
'墿':'木',
'夁':'木',
'嬑':'木',
'嬟':'木',
'嶬':'木',
'撎':'木',
'曀':'木',
'熼':'木',
'瑿':'木',
'瘱':'木',
'瞖':'木',
'膉':'木',
'艗':'木',
'螔':'木',
'螘':'木',
'郼':'木',
'壄':'木',
'嶪':'木',
'嶫':'木',
'曅':'木',
'潱':'木',
'憗':'木',
'璌':'木',
'癊':'木',
'磤':'木',
'蒑':'木',
'霒':'木',
'噟':'木',
'褮':'木',
'頴':'木',
'噰':'木',
'郺':'木',
'遊':'木',
'噳':'木',
'蒮':'木',
'螤':'木',
'貐':'木',
'踰':'木',
'錥':'木',
'鴥':'水',
'噮':'木',
'蒬':'木',
'蒝':'木',
'褤':'木',
'鋺':'木',
'篗':'木',
'橒':'木',
'縕':'木',
'縜':'木',
'蒕':'木',
'蒷':'木',
'蝹':'木',
'褞':'木',
'賱':'木',
'縡':'木',
'賳':'木',
'撍':'木',
'皟':'木',
'瞔':'木',
'橧':'木',
'熷':'木',
'皻':'木',
'虥':'木',
'虦':'木',
'霑':'木',
'瘬':'木',
'瞕':'木',
'踷':'木',
'樼':'木',
'潧':'木',
'縥':'木',
'蒖':'木',
'遉':'木',
'錱':'木',
'篜':'木',
'鬇':'木',
'鴊':'水',
'搱':'木',
'旘':'木',
'樴':'木',
'駤':'木',
'鴙':'水',
'諥':'木',
'鴤':'水',
'噣':'木',
'濐':'木',
'篫':'木',
'豬':'木',
'駯':'木',
'瑼':'木',
'甎':'木',
'竱':'木',
'膇':'木',
'錣':'木',
'撯':'木',
'擆':'木',
'篧':'木',
'谘':'木',
'諮':'木',
'輺':'木',
'趦':'木',
'磫':'木',
'蒩':'木',
'樶':'木',
'鋷':'木',
'錊':'木',
'蔔':'火',
'了':'火',
'瞭':'火',
'亏':'火',
'虧':'火',
'忆':'火',
'憶':'火',
'丑':'火',
'醜':'火',
'队':'土',
'隊':'火',
'压':'火',
'壓':'火',
'吓':'火',
'嚇':'火',
'曲':'火',
'麯':'火',
'屿':'火',
'嶼':'火',
'优':'火',
'優':'火',
'讲':'火',
'講':'火',
'阳':'土',
'陽':'火',
'阶':'土',
'階':'火',
'戏':'火',
'戲':'火',
'纤':'火',
'縴':'火',
'远':'火',
'遠':'火',
'声':'火',
'聲':'火',
'励':'火',
'勵':'火',
'疗':'火',
'療':'火',
'应':'火',
'應':'火',
'灿':'火',
'燦':'火',
'纵':'火',
'縱':'火',
'担':'火',
'擔':'火',
'拥':'火',
'擁':'火',
'择':'火',
'擇':'火',
'板':'火',
'闆':'火',
'岭':'土',
'嶺':'火',
'购':'火',
'購':'火',
'肤':'水',
'膚':'火',
'泽':'水',
'澤':'火',
'隶':'火',
'隸':'火',
'弥':'火',
'彌':'火',
'艰':'火',
'艱':'火',
'帮':'火',
'幫':'火',
'挡':'火',
'擋':'火',
'荫':'木',
'蔭':'火',
'点':'火',
'點':'火',
'临':'火',
'臨':'火',
'虽':'火',
'雖':'火',
'钟':'火',
'鍾':'火',
'毡':'火',
'氈':'火',
'独':'火',
'獨':'火',
'饼':'火',
'餅':'火',
'总':'火',
'總':'火',
'浊':'火',
'濁':'火',
'浓':'火',
'濃':'火',
'逊':'火',
'遜':'火',
'捡':'火',
'撿':'火',
'莲':'木',
'蓮':'火',
'档':'火',
'檔':'火',
'耸':'火',
'聳':'火',
'胶':'火',
'膠':'火',
'斋':'火',
'齋':'火',
'烛':'火',
'燭':'火',
'递':'火',
'遞':'火',
'恳':'火',
'懇':'火',
'骏':'水',
'駿':'火',
'据':'火',
'據':'火',
'营':'火',
'營':'火',
'检':'火',
'檢':'木',
'婴':'火',
'嬰':'火',
'矫':'火',
'矯':'火',
'偿':'火',
'償':'火',
'鸽':'火',
'鴿':'水',
'敛':'火',
'斂':'火',
'馅':'火',
'餡':'火',
'馆':'火',
'館':'火',
'鸿':'火',
'鴻':'水',
'淀':'火',
'澱':'火',
'谎':'火',
'謊':'火',
'谜':'火',
'謎':'火',
'隋':'火',
'隅':'火',
'隆':'土',
'绩':'水',
'績':'火',
'趋':'火',
'趨':'火',
'联':'火',
'聯':'火',
'蒋':'木',
'蔣':'火',
'韩':'火',
'韓':'火',
'锅':'火',
'鍋':'火',
'阔':'水',
'闊':'火',
'粪':'火',
'糞':'火',
'禅':'火',
'禪':'火',
'谢':'金',
'謝':'火',
'谣':'火',
'謠':'火',
'谤':'火',
'謗':'火',
'谦':'火',
'謙':'火',
'缕':'水',
'縷':'火',
'蓬':'火',
'尴':'火',
'尷':'火',
'遣':'火',
'锚':'火',
'錨':'火',
'键':'火',
'鍵':'火',
'誊':'火',
'謄':'火',
'缝':'水',
'縫':'火',
'蔓':'木',
'蔡':'木',
'蔗':'火',
'蔚':'火',
'辖':'火',
'轄':'火',
'辗':'金',
'輾':'火',
'颗':'火',
'顆':'火',
'赚':'火',
'賺':'火',
'锹':'火',
'鍬':'火',
'锻':'火',
'鍛':'火',
'镀':'火',
'鍍':'火',
'舆':'火',
'輿':'火',
'膜':'火',
'鲜':'水',
'鮮':'火',
'赛':'火',
'賽':'火',
'缩':'水',
'縮':'火',
'擒':'火',
'聪':'火',
'聰':'火',
'蔬':'火',
'篓':'火',
'簍':'火',
'膝':'火',
'膛':'火',
'澳':'火',
'懂':'火',
'懊':'火',
'撼':'火',
'擂':'火',
'操':'金',
'擅':'火',
'擎':'火',
'蟆':'火',
'篷':'火',
'糙':'火',
'澡':'火',
'激':'火',
'憾':'火',
'懈':'火',
'窿':'火',
'鞠':'火',
'檐':'火',
'檀':'木',
'礁':'土',
'磷':'火',
'霜':'火',
'霞':'火',
'瞧':'火',
'瞬':'火',
'瞳':'火',
'瞪':'火',
'蹋':'火',
'蹈':'火',
'螺':'火',
'蟋':'火',
'蟀':'火',
'嚎':'火',
'穗':'火',
'簇':'火',
'繁':'火',
'徽':'火',
'癌':'火',
'糟':'火',
'糠':'火',
'燥':'火',
'豁':'火',
'玑':'火',
'璣':'火',
'邬':'火',
'鄔':'火',
'苁':'木',
'蓯':'火',
'矶':'火',
'磯':'火',
'邹':'火',
'鄒':'火',
'闱':'火',
'闈':'火',
'诌':'火',
'謅':'火',
'茑':'火',
'蔦':'火',
'咛':'火',
'嚀':'火',
'饯':'火',
'餞':'火',
'怿':'火',
'懌':'火',
'挝':'火',
'撾':'火',
'挞':'火',
'撻':'火',
'荜':'木',
'蓽':'火',
'柽':'火',
'檉':'木',
'郧':'火',
'鄖':'火',
'狯':'火',
'獪':'火',
'浍':'火',
'澮':'火',
'桧':'木',
'檜':'木',
'龀':'火',
'齔':'火',
'觊':'火',
'覬':'火',
'猃':'火',
'獫':'火',
'烩':'火',
'燴':'火',
'骋':'火',
'騁':'火',
'骎':'水',
'駸':'火',
'掳':'火',
'擄':'火',
'鸸':'火',
'鴯':'水',
'殓':'火',
'殮':'火',
'跄':'火',
'蹌':'火',
'铡':'火',
'鍘':'火',
'鸹':'火',
'鴰':'水',
'鸻':'火',
'鴴':'水',
'馃':'火',
'餜':'火',
'馄':'火',
'餛':'火',
'阇':'火',
'闍':'火',
'渑':'火',
'澠':'火',
'谑':'火',
'謔':'火',
'隈':'火',
'隍':'火',
'鼋':'火',
'黿':'火',
'蛰':'火',
'蟄':'火',
'蒌':'木',
'蔞':'火',
'嵘':'土',
'嶸':'火',
'筚':'火',
'篳':'火',
'飓':'火',
'颶':'火',
'亵':'火',
'褻':'火',
'痨':'火',
'癆':'火',
'痫':'火',
'癇':'火',
'阑':'水',
'闌':'火',
'阒':'火',
'闃':'火',
'阕':'火',
'闋':'火',
'裢':'火',
'褳':'火',
'谡':'火',
'謖':'火',
'谥':'火',
'謚':'火',
'谧':'火',
'謐':'火',
'毂':'火',
'轂':'火',
'遢':'火',
'锗':'火',
'鍺':'火',
'遛':'火',
'滪':'火',
'澦':'火',
'嫔':'火',
'嬪':'火',
'缡':'火',
'縭':'火',
'觏':'火',
'覯':'火',
'蔫':'火',
'蔸':'火',
'蔟':'火',
'蔻':'火',
'蓿':'火',
'蓼':'火',
'辕':'金',
'轅':'火',
'暧':'火',
'曖':'火',
'蝈':'火',
'蟈':'火',
'赙':'火',
'賻':'火',
'锲':'火',
'鍥':'火',
'锴':'金',
'鍇':'火',
'锶':'火',
'鍶':'火',
'锷':'火',
'鍔':'火',
'锸':'火',
'鍤':'火',
'镁':'火',
'鎂':'火',
'箦':'火',
'簀':'火',
'鲑':'水',
'鮭':'火',
'鲔':'水',
'鮪':'火',
'鲛':'水',
'鮫':'火',
'糁':'火',
'糝':'火',
'褛':'火',
'褸':'火',
'缥':'水',
'縹':'火',
'缦':'水',
'縵':'火',
'缧':'水',
'縲':'火',
'缪':'火',
'繆':'火',
'缫':'火',
'繅':'火',
'耧':'火',
'耬':'火',
'璜':'火',
'樯':'木',
'檣':'木',
'蝼':'火',
'螻':'火',
'膘':'火',
'屦':'火',
'屨':'火',
'璞':'土',
'璟':'火',
'璠':'火',
'璘':'火',
'聱':'火',
'螯':'火',
'擀':'火',
'甏':'火',
'檠':'木',
'檎':'木',
'醛':'火',
'醚':'火',
'磲':'火',
'瞰':'火',
'嚄':'火',
'嚆':'火',
'蹉':'火',
'螨':'火',
'蟎':'火',
'螭':'火',
'罹':'火',
'魈':'火',
'膙':'火',
'獬':'火',
'癃':'火',
'嬴':'火',
'瞥':'火',
'甑':'火',
'燠':'火',
'燧':'火',
'濉':'火',
'澧':'火',
'澹':'火',
'澥':'火',
'澶':'火',
'濂':'水',
'褶':'火',
'禧':'火',
'璐':'火',
'螫':'火',
'壕':'火',
'觳':'火',
'罄':'火',
'鞡':'火',
'檄':'木',
'檩':'木',
'懋':'火',
'醢':'火',
'翳':'火',
'礅':'火',
'磴':'火',
'豳':'火',
'壑':'火',
'黻':'火',
'嚏':'火',
'嚅':'火',
'蹊':'火',
'螬':'火',
'螵':'火',
'疃':'火',
'螳':'火',
'蟑':'火',
'嚓':'火',
'嶷':'火',
'黜':'火',
'黝':'火',
'罅':'火',
'黏':'火',
'簌':'火',
'篾':'火',
'篼':'火',
'簋':'火',
'鼢':'火',
'黛':'火',
'儡':'火',
'鼾':'火',
'皤':'火',
'龠':'火',
'繇':'火',
'貔':'火',
'螽':'火',
'燮':'火',
'襄':'火',
'糜':'火',
'縻':'火',
'癍':'火',
'麋':'火',
'蹇':'火',
'謇':'火',
'襁':'火',
'檗':'木',
'擘':'火',
'孺':'火',
'嬷':'火',
'蟊':'火',
'鍪':'火',
'糨':'火',
'钖':'火',
'鍚':'火',
'帱':'火',
'幬':'火',
'骍':'火',
'騂':'火',
'琎':'火',
'璡':'火',
'硚':'火',
'礄':'火',
'䴕':'火',
'鴷':'水',
'鸺':'火',
'鵂':'水',
'鸼':'火',
'鵃':'水',
'䴔':'火',
'鵁':'水',
'隃':'火',
'絷':'火',
'縶':'火',
'鄑':'火',
'腘':'火',
'膕':'火',
'鄗':'火',
'鄌':'火',
'遘':'火',
'蔀':'火',
'锘':'火',
'鍩':'火',
'瘅':'火',
'癉':'火',
'䃅':'火',
'磾':'火',
'蔌':'火',
'蔈':'火',
'蓰':'火',
'蔊':'火',
'槚':'木',
'檟':'木',
'锺':'火',
'锽':'火',
'鍠':'火',
'锾':'火',
'鍰':'火',
'锿':'火',
'鎄':'火',
'镅':'火',
'鎇':'火',
'鲒':'水',
'鮚':'水',
'鲕':'水',
'鮞':'水',
'鲖':'火',
'鲘':'火',
'鮜':'水',
'鲝':'火',
'鮺':'水',
'蔃':'火',
'璒':'火',
'擐':'火',
'黇':'火',
'䗖':'火',
'螮':'火',
'幪':'火',
'簉':'火',
'濋':'火',
'澪':'火',
'澽':'火',
'澴':'火',
'澭':'火',
'澼':'火',
'憷':'火',
'憺':'火',
'懔':'火',
'髽':'火',
'檑':'火',
'檞':'木',
'繄':'火',
'磹':'火',
'磻':'火',
'瞫':'火',
'瞵':'火',
'蹐':'火',
'矰':'火',
'穙':'火',
'穜':'火',
'簃':'火',
'簏':'火',
'儦':'火',
'斶':'火',
'艚':'火',
'谿':'火',
'馘':'火',
'螱':'火',
'嬬':'火',
'嬥':'火',
'澫':'火',
'蔄':'火',
'璕':'火',
'駼':'火',
'璗':'火',
'謏':'火',
'闉':'火',
'濆':'火',
'膢':'火',
'襀':'火',
'鍭':'火',
'鮡':'水',
'鮠':'水',
'鮟':'水',
'縯':'火',
'嶽':'火',
'遙':'火',
'醠':'火',
'儤':'火',
'曓':'火',
'襃':'火',
'蓭':'火',
'闇':'火',
'隂':'火',
'隌':'火',
'顉':'火',
'馣':'火',
'擙':'火',
'磽':'火',
'蔜':'火',
'虨':'火',
'輽':'火',
'壒':'火',
'賹':'火',
'鴱':'水',
'騃':'火',
'鍽':'火',
'謈':'火',
'豰':'火',
'檦':'木',
'褾':'火',
'颷':'火',
'鞞':'火',
'餠':'火',
'鮩':'水',
'繃':'火',
'螷':'火',
'鞛':'火',
'檘':'木',
'縪':'火',
'擈':'火',
'篰':'火',
'餢':'火',
'鮬':'水',
'縩':'火',
'嬱':'火',
'澯':'火',
'篸':'火',
'賶':'火',
'懆':'火',
'蓸':'火',
'褿':'火',
'簎':'火',
'竲':'火',
'毚':'火',
'簅':'火',
'螹':'火',
'勶':'火',
'瞮':'火',
'擑':'火',
'膓':'火',
'韔':'火',
'罺':'火',
'檙':'木',
'竀':'火',
'儬':'火',
'螴':'火',
'蔯':'火',
'謓':'火',
'鍖':'火',
'謘':'火',
'遟':'火',
'鍉':'火',
'鵄':'水',
'隀':'火',
'嚋':'火',
'嬦':'火',
'盩':'火',
'遚':'火',
'斣':'火',
'檚':'木',
'歜':'火',
'鄐':'火',
'膗':'火',
'顀':'火',
'膞':'火',
'蓴':'火',
'擉':'火',
'餟':'火',
'嬨':'火',
'澬':'火',
'縬':'火',
'竁':'火',
'竴':'火',
'顇':'火',
'燪':'火',
'篵':'火',
'蔥':'火',
'蟌':'火',
'鍐':'火',
'鍯':'火',
'蔖':'火',
'醝':'火',
'艜':'火',
'遝':'火',
'澸':'火',
'禫':'火',
'餤':'火',
'澢':'火',
'盪':'火',
'壔':'火',
'嶹':'火',
'檤':'木',
'竳':'火',
'嚁':'火',
'篴':'火',
'蔋':'火',
'蔐':'火',
'蔕':'火',
'蹏':'火',
'隄':'火',
'褺':'火',
'螲':'火',
'霘':'火',
'蹎':'火',
'蓧':'火',
'濎':'火',
'磸':'火',
'顁':'火',
'儥':'火',
'匵':'火',
'斁':'火',
'殬':'火',
'陼':'火',
'鍴':'火',
'鴭':'水',
'嚉':'火',
'貖':'火',
'餩':'火',
'騀':'火',
'癈':'火',
'餥':'火',
'馡':'火',
'鼣':'火',
'癁':'火',
'鍑':'火',
'鍢':'火',
'鬴':'火',
'尶':'火',
'檊':'木',
'擖':'火',
'獦':'火',
'謌':'火',
'鮯':'水',
'骾':'火',
'檒':'木',
'澣':'火',
'臩':'火',
'璝':'火',
'瞶':'火',
'蔉':'火',
'濄':'火',
'簂':'火',
'蔮':'火',
'駴':'火',
'儫':'火',
'皥':'火',
'癋':'火',
'謞':'火',
'嚂':'火',
'壏':'火',
'歛':'火',
'顄':'火',
'駻':'火',
'翵':'火',
'謍':'火',
'鍙':'火',
'鍧':'火',
'霟':'火',
'懁':'火',
'豲':'火',
'穔':'火',
'磺':'火',
'簄':'火',
'蔛':'火',
'蔰':'火',
'鍸':'火',
'檅':'木',
'檓':'木',
'濊':'火',
'燬':'火',
'獩':'火',
'篲':'火',
'蔧':'火',
'繉':'火',
'蔒':'火',
'謋':'火',
'嚌':'火',
'憿':'火',
'擊':'火',
'檕':'木',
'檝':'木',
'濈':'火',
'磼':'火',
'禨':'火',
'穖':'火',
'簊':'火',
'蓻':'火',
'蔇':'火',
'賷':'火',
'鍓':'火',
'鴶':'水',
'瞯':'火',
'磵':'火',
'蔪':'火',
'鍳':'火',
'顅':'火',
'馢':'火',
'麉':'火',
'橿':'木',
'殭':'火',
'糡':'火',
'螿':'火',
'曒':'火',
'獥':'火',
'穚':'火',
'蟂':'火',
'鴵':'水',
'嚍':'火',
'嬧':'火',
'濅':'火',
'蓳':'火',
'蓵':'火',
'鍻':'火',
'憼':'火',
'擏':'火',
'曔':'火',
'顈':'火',
'璚':'火',
'懅':'火',
'檋':'木',
'鄓':'火',
'駶':'火',
'獧':'火',
'縳':'火',
'蔨':'火',
'懏':'火',
'鍕':'火',
'轁':'火',
'躿':'火',
'醘':'火',
'鍞':'火',
'鞚':'火',
'擓':'火',
'謉':'火',
'鍨':'火',
'鍷':'火',
'窾':'火',
'儣':'火',
'擃':'火',
'鞟':'火',
'韕':'火',
'孻':'火',
'顂':'火',
'磱':'火',
'燣':'火',
'蔂':'火',
'磿':'火',
'蟍':'火',
'褵':'火',
'澰':'火',
'燫':'火',
'縺':'火',
'翴':'火',
'鍊':'火',
'駺':'火',
'璙':'火',
'竂':'火',
'蟉':'火',
'儠':'火',
'鮤':'水',
'燯':'火',
'蔆':'火',
'霛':'火',
'霝':'火',
'懍':'火',
'檁':'木',
'澟':'火',
'甐':'火',
'疄':'火',
'艛':'火',
'癅':'火',
'駵':'火',
'膔':'火',
'蔍':'火',
'蓾':'火',
'螰':'火',
'鴼':'水',
'鮥':'水',
'鵅':'水',
'嬤':'火',
'蟇':'火',
'澷':'火',
'駹':'火',
'蓩':'火',
'徾':'火',
'曚':'火',
'蔝':'火',
'蔤':'火',
'麊':'火',
'嬵':'火',
'瞴':'火',
'鴾':'水',
'麰':'火',
'鍲':'火',
'覭':'火',
'鄍':'火',
'縸':'火',
'嬭':'火',
'憹':'火',
'餧':'火',
'嬣':'火',
'簐':'火',
'蹍':'火',
'嬲':'火',
'隉':'火',
'檂':'木',
'膒':'火',
'篺':'火',
'膖':'火',
'覫':'火',
'髼':'火',
'簈':'火',
'蓱':'火',
'噽':'火',
'憵':'火',
'擗':'火',
'旚':'火',
'篻':'火',
'翲':'火',
'蔢':'火',
'檏':'木',
'瞨':'火',
'鮨':'水',
'壍':'火',
'蔳':'火',
'鍼':'火',
'黚':'火',
'牆':'火',
'謒':'火',
'撽':'火',
'癄':'火',
'鍫':'火',
'穕':'火',
'懃':'火',
'懄':'火',
'澿':'火',
'螼':'火',
'蓲':'火',
'燩':'火',
'璖':'火',
'螶':'火',
'謜':'火',
'陾':'火',
'嬫':'火',
'鍒':'火',
'鴹':'水',
'鵀':'水',
'鄏':'火',
'鴽':'水',
'壖':'火',
'瞤':'火',
'蔘':'火',
'氉':'火',
'曑':'火',
'襂':'火',
'檆':'木',
'磰':'火',
'縿':'火',
'謆':'火',
'陿':'火',
'懎':'火',
'擌':'火',
'濇':'火',
'濏':'火',
'閷':'火',
'髿':'火',
'簁':'火',
'髾':'火',
'曏':'火',
'蔏':'火',
'螪':'火',
'鞝':'火',
'憴':'火',
'賸':'火',
'鍟':'火',
'蔎':'火',
'鍦':'火',
'檡':'木',
'澨':'火',
'褷':'火',
'橾':'木',
'濖':'火',
'盨':'火',
'鮛':'水',
'繂':'火',
'儩':'火',
'禩':'火',
'憽':'火',
'檧':'木',
'濍':'火',
'駷':'火',
'醙':'火',
'鄋':'火',
'璛':'火',
'遡':'火',
'篹':'火',
'檖':'木',
'澻':'火',
'繀':'火',
'嚃':'火',
'橽':'木',
'澾':'火',
'濌':'火',
'鞜':'火',
'鮙':'火',
'嬯':'火',
'燤':'火',
'糛':'火',
'赯':'火',
'謟':'火',
'謕':'火',
'鍗':'火',
'鬀':'火',
'鮧':'水',
'鴺':'水',
'顃':'火',
'蓨':'火',
'蓪':'火',
'鮦':'水',
'鍮':'火',
'黈':'火',
'鍎':'火',
'蓷':'火',
'蹆':'火',
'駾':'火',
'骽':'火',
'懀':'火',
'篿':'火',
'蟃':'火',
'燰':'火',
'罻':'火',
'蓶':'火',
'褽':'火',
'鍏':'火',
'鍡':'火',
'隇':'火',
'蟁':'火',
'豱':'火',
'闅':'火',
'轀':'火',
'鼤':'火',
'璑':'火',
'甒':'火',
'霚':'火',
'鴮':'水',
'鼿':'火',
'嚊':'火',
'壐':'火',
'擕':'火',
'燨':'火',
'瞦':'火',
'磶':'火',
'縰':'火',
'謑':'火',
'豯':'火',
'豀':'火',
'貕':'火',
'鄎':'火',
'鍜':'火',
'憸':'火',
'褼':'火',
'豏':'火',
'鍌':'火',
'韱':'火',
'鄕':'火',
'鮝':'水',
'澩':'火',
'穘':'火',
'皢':'火',
'燲':'火',
'曐':'火',
'觲':'火',
'璓':'火',
'鎀':'火',
'壎':'火',
'檈':'木',
'縼':'火',
'蔙':'火',
'鍹':'火',
'駽':'火',
'瞲':'火',
'嚈':'火',
'闄':'火',
'餚':'火',
'燢':'火',
'嬮':'火',
'曕':'火',
'篶':'火',
'蔅':'火',
'隁':'火',
'鴳':'水',
'寱':'火',
'寲':'火',
'曎':'火',
'檍':'木',
'檥':'木',
'歝':'火',
'澺':'火',
'燡':'火',
'燱':'火',
'穓':'火',
'蓺':'火',
'褹':'火',
'顊':'火',
'擛':'火',
'曗':'火',
'澲':'火',
'皣':'火',
'瞱':'火',
'鍱':'火',
'鎁':'火',
'餣':'火',
'噾':'火',
'嶾':'火',
'檃':'木',
'蔩':'火',
'螾':'火',
'陻':'火',
'霠':'火',
'膡':'火',
'覮':'火',
'霙':'火',
'醟':'火',
'嬩':'火',
'澞':'火',
'篽':'火',
'蓹':'火',
'螸':'火',
'鍝':'火',
'嬳':'火',
'醞':'火',
'儧':'火',
'耫':'火',
'璔':'火',
'磳':'火',
'醡':'火',
'蔁':'火',
'餦':'火',
'燳':'火',
'鍣':'火',
'蟅':'火',
'澵':'火',
'轃':'火',
'儨':'火',
'劕':'火',
'璏':'火',
'穉':'火',
'膣':'火',
'鴲':'水',
'蔠':'火',
'蓫':'火',
'鮢':'水',
'鴸':'水',
'檛':'木',
'糚':'火',
'斀':'火',
'斵':'火',
'穛':'火',
'鍿':'火',
'頿':'火',
'噿':'火',
'檇':'木',
'檌':'木',
'丰':'土',
'豐':'土',
'双':'水',
'雙':'土',
'旧':'土',
'舊':'土',
'归':'土',
'歸':'土',
'丛':'土',
'叢':'土',
'冬':'水',
'鼕':'土',
'礼':'土',
'禮':'土',
'檯':'木',
'蟲':'土',
'杂':'土',
'雜':'土',
'闯':'水',
'闖':'土',
'拟':'土',
'擬':'土',
'芜':'木',
'蕪':'土',
'医':'土',
'醫':'土',
'环':'土',
'環':'土',
'拧':'土',
'擰':'土',
'柜':'土',
'櫃':'木',
'鬆':'土',
'转':'金',
'轉':'土',
'狞':'土',
'獰':'土',
'泞':'土',
'濘':'土',
'织':'水',
'織':'土',
'挤':'土',
'擠':'土',
'荡':'木',
'蕩':'土',
'柠':'木',
'檸':'木',
'适':'土',
'適':'土',
'鞦':'土',
'济':'水',
'濟':'土',
'陨':'土',
'隕':'土',
'垒':'土',
'壘':'土',
'绕':'土',
'繞':'土',
'聂':'土',
'聶':'土',
'获':'木',
'獲':'土',
'础':'土',
'礎':'土',
'毙':'土',
'斃':'土',
'涛':'水',
'濤':'土',
'窍':'土',
'竅':'土',
'绣':'水',
'职':'土',
'職':'土',
'萧':'木',
'蕭':'土',
'秽':'土',
'穢':'土',
'躯':'土',
'軀':'土',
'断':'土',
'斷':'土',
'婶':'土',
'嬸':'土',
'骑':'水',
'騎':'土',
'搁':'土',
'擱':'土',
'翘':'土',
'翹':'土',
'鹃':'土',
'鵑':'水',
'锁':'土',
'鎖':'土',
'鹅':'火',
'鵝':'水',
'储':'土',
'儲':'土',
'湿':'土',
'濕':'土',
'窜':'土',
'竄':'土',
'隔':'土',
'隙':'土',
'隘':'土',
'鹉':'土',
'鵡':'水',
'濛':'土',
'懞':'土',
'鄙':'土',
'简':'土',
'簡':'土',
'腻':'土',
'膩':'土',
'雏':'土',
'雛':'土',
'酱':'土',
'醬':'土',
'粮':'土',
'糧':'土',
'滥':'土',
'濫':'土',
'滨':'土',
'濱':'土',
'谨':'土',
'謹':'土',
'谬':'土',
'謬':'土',
'赘':'土',
'贅':'土',
'蔽':'土',
'槛':'木',
'檻':'木',
'遭':'土',
'蝉':'火',
'蟬':'土',
'箫':'土',
'簫':'土',
'遮':'土',
'蕉':'土',
'蕊':'木',
'题':'土',
'題':'土',
'镇':'金',
'鎮':'土',
'镐':'土',
'鎬':'土',
'镑':'土',
'鎊':'土',
'鲤':'水',
'鯉':'土',
'颜':'土',
'顏':'土',
'鲨':'土',
'鯊':'土',
'额':'土',
'額':'土',
'缭':'水',
'繚':'土',
'膨':'土',
'戴':'土',
'擦':'土',
'檬':'木',
'曙':'火',
'魏':'土',
'簧':'土',
'爵':'土',
'朦':'土',
'懦':'土',
'翼':'土',
'鞭':'土',
'覆':'土',
'瞻':'土',
'蹦':'土',
'翻':'土',
'璧':'土',
'戳':'土',
'圹':'土',
'壙':'土',
'饧':'土',
'餳':'土',
'讴':'土',
'謳':'土',
'芸':'土',
'蕓':'土',
'欤':'土',
'歟':'土',
'虮':'土',
'蟣':'土',
'疠':'土',
'癘':'土',
'荞':'木',
'蕎':'土',
'荨':'木',
'蕁':'土',
'荬':'木',
'蕒':'土',
'钨':'土',
'鎢':'土',
'闿':'土',
'闓':'土',
'浕':'土',
'濜':'土',
'恹':'土',
'懨':'土',
'怼':'土',
'懟':'土',
'珰':'土',
'璫':'土',
'贽':'土',
'贄':'土',
'莸':'木',
'蕕':'土',
'烬':'土',
'燼':'土',
'焘':'火',
'燾':'土',
'啮':'土',
'嚙':'土',
'铠':'土',
'鎧':'土',
'秾':'土',
'穠':'土',
'阋':'土',
'鬩':'土',
'隗':'土',
'骐':'水',
'騏':'土',
'骒':'土',
'騍':'土',
'骓':'土',
'騅':'土',
'鹁':'土',
'鵓':'水',
'睑':'土',
'瞼':'土',
'蛲':'土',
'蟯':'土',
'鹄':'土',
'鵠':'水',
'鹆':'土',
'鵒':'水',
'觞':'土',
'觴':'土',
'馇':'土',
'餷':'土',
'鹈':'水',
'鵜':'土',
'谟':'土',
'謨':'土',
'裥':'土',
'襇':'土',
'耢':'土',
'耮':'土',
'遨':'土',
'鄢':'土',
'摈':'土',
'擯':'土',
'鄞':'土',
'蓥':'土',
'鎣':'土',
'韪':'土',
'韙':'土',
'跸':'土',
'蹕':'土',
'阖':'水',
'闔':'土',
'阗':'土',
'闐':'土',
'阙':'水',
'闕':'土',
'谩':'土',
'謾':'土',
'谪':'土',
'謫':'土',
'蕖':'土',
'槟':'木',
'檳':'木',
'殡':'土',
'殯':'土',
'箪':'土',
'簞':'土',
'潍':'土',
'濰':'土',
'聩':'土',
'聵':'土',
'觐':'土',
'覲':'土',
'蕙':'木',
'蕈':'土',
'蕨':'土',
'蕤':'土',
'蕞':'土',
'蕃':'土',
'赜':'土',
'賾':'土',
'辘':'土',
'轆':'土',
'颙':'土',
'顒':'土',
'颚':'土',
'顎':'土',
'噜':'土',
'嚕':'土',
'颛':'土',
'顓':'土',
'镉':'土',
'鎘':'土',
'镌':'土',
'鎸':'土',
'镍':'土',
'鎳':'土',
'镏':'土',
'鎦':'土',
'镒':'土',
'鎰':'土',
'镓':'土',
'鎵':'土',
'篑':'土',
'簣':'土',
'鲠':'土',
'鯁':'土',
'鲧':'土',
'鯀':'土',
'鲩':'水',
'鯇':'土',
'缮':'水',
'繕':'土',
'缯':'水',
'繒':'土',
'穑':'土',
'穡':'土',
'魉':'土',
'魎':'土',
'膳':'土',
'膦':'土',
'獴':'土',
'璨':'土',
'璩':'土',
'璪':'土',
'擤':'土',
'擢':'土',
'鞬':'土',
'蹒':'土',
'蹣':'土',
'蟥':'土',
'罽':'土',
'罾':'土',
'髁':'土',
'髀':'土',
'魍':'土',
'貘':'土',
'懑':'土',
'懣':'土',
'濡':'土',
'濮':'水',
'濞':'土',
'濠':'土',
'濯':'土',
'鬈':'土',
'鬃':'土',
'瞽':'土',
'鞨':'土',
'鞫':'土',
'鞧':'土',
'鞣':'土',
'醪':'土',
'蹙':'土',
'礓':'土',
'燹':'土',
'餮':'土',
'瞿':'土',
'曛':'土',
'曜':'火',
'蹚':'土',
'蟛':'土',
'蟪':'土',
'蟠':'土',
'蟮':'土',
'黠':'土',
'黟':'土',
'馥':'土',
'簟':'土',
'簪':'土',
'鼬':'土',
'艟':'土',
'癔':'土',
'癜':'土',
'癖':'土',
'鎏':'土',
'彝':'土',
'飏':'土',
'颺':'土',
'狝':'土',
'獮':'土',
'荛':'木',
'蕘':'土',
'袯':'土',
'襏':'土',
'梼':'土',
'檮':'木',
'龁':'土',
'齕':'土',
'䝙':'土',
'貙':'土',
'蒇':'木',
'蕆':'土',
'鄚':'土',
'蒉':'木',
'蕢':'土',
'鹀':'土',
'鵐':'水',
'溁':'土',
'爃':'土',
'鄠':'土',
'飔':'土',
'颸':'土',
'鄘':'土',
'鄜':'土',
'鄣':'土',
'阘':'土',
'闒':'土',
'谫':'土',
'謭':'土',
'瑷':'土',
'璦':'土',
'锼':'土',
'鎪':'土',
'镃':'土',
'鎡':'土',
'蕰':'土',
'镈':'土',
'鎛':'土',
'镎':'土',
'鎿':'土',
'镕':'土',
'鎔':'土',
'鲪':'土',
'鮶':'水',
'鲬':'土',
'鯒':'土',
'璥':'土',
'璲':'土',
'蕗':'土',
'濩':'土',
'璱':'土',
'璬':'土',
'璮':'土',
'櫆':'木',
'醨':'土',
'蟏':'土',
'蟰':'土',
'穟':'土',
'魋':'土',
'獯':'土',
'甓':'土',
'釐':'土',
'鞮':'土',
'檫':'木',
'礌':'土',
'蹢':'土',
'蹜':'土',
'蟫':'土',
'嚚':'土',
'簠':'土',
'簝':'土',
'簰':'土',
'鼫':'土',
'鼩':'土',
'皦':'土',
'癗':'土',
'翷':'土',
'隑':'土',
'礐':'土',
'騑':'土',
'騊':'土',
'騄':'土',
'鵏':'水',
'鵟':'水',
'闑':'土',
'鎝':'土',
'鎓':'土',
'鮸':'水',
'繡':'土',
'鞤':'土',
'贁':'土',
'蕔':'土',
'盫':'土',
'鼥':'土',
'翺':'土',
'謸':'土',
'謷':'土',
'辬':'土',
'蟦':'土',
'懝':'土',
'濭':'土',
'皧':'土',
'瞹':'土',
'餲':'土',
'馤':'土',
'獱':'土',
'嚗':'土',
'簙':'土',
'爂':'土',
'謤':'土',
'蟞':'土',
'襒':'土',
'癛':'土',
'奰':'土',
'鎞':'土',
'鵖':'水',
'遪':'土',
'謲':'土',
'繟':'土',
'醦':'土',
'繛':'土',
'轈':'土',
'鄛':'土',
'鼂':'土',
'鎗':'土',
'儭':'土',
'贂':'土',
'麎':'土',
'懘':'土',
'糦':'土',
'謻':'土',
'遫':'土',
'罿':'土',
'蹖':'土',
'懤':'土',
'燽':'土',
'鯈':'土',
'幮':'土',
'蕏':'土',
'膪':'土',
'鎚':'土',
'櫄':'木',
'鎈':'土',
'濨':'土',
'鼀':'土',
'鎉':'土',
'濢':'土',
'膬':'土',
'襊':'土',
'繱':'土',
'謥':'土',
'遳':'土',
'懛':'土',
'簤':'土',
'蹛':'土',
'甔':'土',
'癚':'土',
'襌':'土',
'駳':'土',
'礑':'土',
'簜':'土',
'擣':'土',
'簦':'土',
'豴':'土',
'遰':'土',
'鬄':'土',
'蕫':'土',
'蕇':'土',
'鼦':'土',
'嬻':'土',
'簬':'土',
'濧':'土',
'遯':'土',
'鮵':'水',
'歞':'土',
'蕚':'土',
'鵞':'水',
'鞥':'土',
'檽':'木',
'蕟':'土',
'旛':'土',
'繙':'土',
'膰':'土',
'羳':'土',
'襎':'土',
'鄤':'土',
'濷':'土',
'蕜':'土',
'羵':'土',
'蕡':'土',
'餴':'土',
'鼖':'土',
'蕧':'土',
'襆':'土',
'鯆':'土',
'麱':'土',
'鎠':'土',
'檺':'木',
'鯌':'土',
'韚':'土',
'濲':'土',
'盬':'土',
'懖':'土',
'癐':'土',
'璭':'土',
'癏':'土',
'謴':'土',
'遦':'土',
'雚':'土',
'巂':'土',
'禬':'土',
'膭':'土',
'彍':'土',
'燺':'土',
'爀':'土',
'礉':'土',
'雗':'土',
'繣':'土',
'舙':'土',
'蕐':'土',
'黊':'土',
'餱':'土',
'竵':'土',
'韹':'土',
'嚝':'土',
'鵍':'水',
'鎤':'土',
'餭':'土',
'嚛':'土',
'擭':'土',
'膴':'土',
'謼':'土',
'餬':'土',
'嚖':'土',
'璯':'土',
'瞺':'土',
'繢':'土',
'繐':'土',
'隓':'土',
'餯':'土',
'轋':'土',
'顐':'土',
'餫':'土',
'檴':'木',
'礊':'土',
'雘':'土',
'擮':'土',
'檱':'木',
'檵':'木',
'櫅':'木',
'礏':'土',
'耭':'土',
'蕀':'土',
'襋':'土',
'蹟':'土',
'雞':'土',
'鵋':'水',
'齌':'土',
'鵊':'水',
'礆':'土',
'繝':'土',
'蕑':'土',
'襉':'土',
'鎫':'土',
'餰':'土',
'疅':'土',
'繈':'土',
'謽':'土',
'簥':'土',
'膲':'土',
'蟜':'土',
'蟭':'土',
'轇':'土',
'幯':'土',
'礍':'土',
'謯':'土',
'濪':'土',
'鵛':'水',
'檾':'木',
'屩':'土',
'蕝':'土',
'蟨':'土',
'蟩':'土',
'擧':'土',
'繘':'土',
'貗':'土',
'鵙':'水',
'濬':'土',
'鵕':'水',
'鵔':'水',
'鵘':'水',
'麏':'土',
'鎎':'土',
'顑':'土',
'蹞':'土',
'黋':'土',
'鎯':'土',
'騉':'土',
'騋':'土',
'簩':'土',
'蟧':'土',
'懢':'土',
'爁':'土',
'蕌':'土',
'儮':'土',
'嚟':'土',
'巁':'土',
'蔾':'土',
'謧':'土',
'謰':'土',
'蹥':'土',
'鎌':'土',
'屪':'土',
'廫':'土',
'豂':'土',
'膫':'土',
'賿':'土',
'蟟':'土',
'蹘':'土',
'鄝':'土',
'繗':'土',
'麐':'土',
'謱':'土',
'軁':'土',
'遱':'土',
'嬼':'土',
'璢':'土',
'霤':'土',
'麍':'土',
'儱':'土',
'蕯':'土',
'蹗':'土',
'嚜':'土',
'霡':'土',
'霢':'土',
'蠎':'土',
'懜':'土',
'氋':'土',
'蕄':'土',
'霥':'土',
'鯍':'土',
'擟':'土',
'檷':'木',
'櫁':'木',
'濔':'土',
'濗':'土',
'簚':'土',
'檰':'木',
'蟱':'土',
'鞪':'土',
'幭':'土',
'簢':'土',
'懡':'土',
'蟔':'土',
'謩':'土',
'鮾':'水',
'嬺':'土',
'獳':'土',
'鎒':'土',
'癑':'土',
'禯':'土',
'餪':'土',
'懧':'土',
'糥':'土',
'蕅':'土',
'鎜':'土',
'蟚':'土',
'鬅':'土',
'翸':'土',
'礔':'土',
'礕':'土',
'騈':'土',
'骿':'土',
'醥':'土',
'櫇':'木',
'懠':'土',
'櫀':'木',
'濝':'土',
'魌':'土',
'檶':'木',
'鬵':'土',
'蹡':'土',
'繑':'土',
'鄥':'土',
'鄡':'土',
'鞩':'土',
'髜':'土',
'鮼':'水',
'謦':'土',
'蟗':'土',
'鯄':'土',
'繎':'土',
'蟝':'土',
'覰':'土',
'鼁':'土',
'襓':'土',
'韖':'土',
'擩':'土',
'曘':'土',
'燸':'土',
'蕠':'土',
'繠':'土',
'蕋':'土',
'顋':'土',
'糣':'土',
'糤':'土',
'繖':'土',
'鎟':'土',
'羴':'土',
'鯅':'土',
'鮻':'水',
'鯋':'土',
'簛':'土',
'燿':'土',
'鮹':'水',
'謪':'土',
'蕂':'土',
'鼪':'土',
'韘':'土',
'騇':'土',
'簭':'土',
'鵢':'水',
'癙':'土',
'蕣':'土',
'鎙':'土',
'蕬':'土',
'蟖':'土',
'鎍':'土',
'遬':'土',
'鯂':'土',
'禭':'土',
'簨':'土',
'鎨':'土',
'擡':'土',
'鎕':'土',
'蟘':'土',
'儯':'土',
'膯':'土',
'蕛':'土',
'嚔':'土',
'鮷':'水',
'憻':'土',
'襑':'土',
'璳':'土',
'鎭':'土',
'靝':'土',
'鎥':'土',
'膧':'土',
'鼨':'土',
'鵌':'水',
'鵚':'水',
'檲':'木',
'鵎':'水',
'鼧':'土',
'贃':'土',
'儰':'土',
'癓':'土',
'矀':'土',
'蔿':'土',
'贀':'土',
'轊':'土',
'颹':'土',
'隖':'土',
'鯃':'土',
'麌':'土',
'濦':'土',
'繥':'土',
'蕮':'土',
'虩':'土',
'蟢':'土',
'謵':'土',
'蹝':'土',
'鵗':'水',
'甕':'土',
'懗':'土',
'鎋':'土',
'濣':'土',
'蹮':'土',
'麲':'土',
'蟓':'土',
'襐':'土',
'膮':'土',
'鞢':'土',
'濴':'土',
'皨':'土',
'繏':'土',
'蕦':'土',
'燻':'土',
'蟳':'土',
'韗':'土',
'蕥':'土',
'顔':'土',
'艞':'土',
'鎐':'土',
'懕':'土',
'檿':'木',
'隒':'土',
'騐':'土',
'檹':'木',
'礒':'土',
'擨':'土',
'擪':'土',
'擫':'土',
'瞸':'土',
'鎑':'土',
'懚':'土',
'檭':'木',
'檼':'木',
'濥':'土',
'濙':'土',
'濚':'土',
'韺':'土',
'癕':'土',
'雝':'土',
'嚘':'土',
'懙':'土',
'癒':'土',
'礇':'土',
'蕍':'土',
'謣':'土',
'醧':'土',
'魊':'土',
'鮽':'水',
'鎱':'土',
'霣':'土',
'襍':'土',
'蹔':'土',
'礋':'土',
'謮':'土',
'醩':'土',
'皽':'土',
'覱':'土',
'遧':'土',
'櫂':'木',
'瞾':'土',
'嚞':'土',
'謺':'土',
'鮿':'水',
'懥':'土',
'膱':'土',
'蟙':'土',
'蹠':'土',
'騆':'土',
'蟤':'土',
'襈':'土',
'鄟':'土',
'礈':'土',
'謶':'土',
'頾':'土',
'豵':'土',
'蹤':'土',
'騌':'土',
'繤':'土',
'蟕':'土',
'繜':'土',
'罇':'土',
'繓':'土',
'讥':'金',
'譏':'金',
'邓':'金',
'鄧':'金',
'劝':'金',
'勸':'金',
'辽':'金',
'遼':'金',
'扩':'金',
'擴':'金',
'迁':'金',
'遷':'金',
'嚮':'金',
'关':'金',
'關':'金',
'坏':'金',
'壞':'金',
'扰':'金',
'擾':'金',
'丽':'金',
'麗':'金',
'歼':'金',
'殱':'金',
'旷':'金',
'曠':'金',
'邻':'金',
'鄰':'金',
'繋':'金',
'庐':'土',
'廬':'金',
'瀋':'金',
'证':'金',
'證':'金',
'识':'金',
'識':'金',
'迟':'金',
'遲':'金',
'际':'土',
'際':'金',
'垄':'金',
'壟':'金',
'咙':'金',
'嚨':'金',
'庞':'金',
'龐':'金',
'郑':'金',
'鄭':'金',
'泻':'金',
'瀉':'金',
'宠':'金',
'寵':'金',
'帘':'金',
'簾':'金',
'绎':'水',
'繹':'金',
'荐':'木',
'薦':'金',
'茧':'木',
'繭':'金',
'鬍':'金',
'蚁':'火',
'蟻':'金',
'选':'金',
'選':'金',
'胆':'水',
'膽':'金',
'薑':'金',
'类':'金',
'類':'金',
'烁':'火',
'爍':'金',
'浏':'金',
'瀏':'金',
'袄':'金',
'襖':'金',
'绘':'水',
'繪':'金',
'穫':'金',
'轿':'金',
'轎':'金',
'脓':'金',
'膿':'金',
'离':'金',
'離':'金',
'难':'金',
'難':'金',
'掷':'金',
'擲':'金',
'铲':'金',
'鏟':'金',
'脸':'金',
'臉':'金',
'猎':'金',
'獵':'金',
'旋':'水',
'鏇':'金',
'兽':'金',
'獸':'金',
'祷':'火',
'禱':'金',
'绳':'水',
'繩':'金',
'畴':'金',
'疇':'金',
'遗':'金',
'遺':'金',
'链':'金',
'鏈':'金',
'惩':'金',
'懲':'金',
'溅':'金',
'濺':'金',
'骗':'金',
'騙':'金',
'摆':'金',
'擺':'金',
'鹊':'火',
'鵲':'水',
'矇':'金',
'碍':'金',
'礙':'金',
'雾':'金',
'霧':'金',
'跷':'金',
'蹺':'金',
'辞':'金',
'辭':'金',
'签':'金',
'簽':'金',
'鹏':'火',
'鵬':'水',
'馏':'金',
'餾':'金',
'滤':'金',
'濾':'金',
'障':'土',
'愿':'金',
'願':'金',
'蝇':'火',
'蠅':'金',
'稳':'金',
'穩':'金',
'谭':'金',
'譚':'金',
'谱':'金',
'譜':'金',
'撵':'金',
'攆':'金',
'瘪':'金',
'癟':'金',
'遵':'金',
'蕾':'木',
'薛':'木',
'薇':'木',
'薪':'金',
'薄':'金',
'颠':'金',
'顛':'金',
'辙':'金',
'轍':'金',
'赠':'金',
'贈':'金',
'镜':'金',
'鏡':'金',
'赞':'金',
'贊':'金',
'鲸':'水',
'鯨':'金',
'缰':'水',
'繮':'金',
'缴':'水',
'繳':'金',
'臊':'金',
'臀':'金',
'臂':'金',
'瀑':'金',
'襟':'金',
'攀':'金',
'曝':'金',
'蹲':'金',
'蹭':'金',
'蹬':'金',
'巅':'金',
'簸':'金',
'簿':'金',
'蟹':'火',
'靡':'金',
'瓣':'金',
'羹':'金',
'爆':'金',
'疆':'金',
'芗':'木',
'薌':'金',
'犷':'金',
'獷':'金',
'玙':'金',
'璵':'金',
'呖':'金',
'嚦':'金',
'饩':'金',
'餼':'金',
'垆':'金',
'壚':'金',
'泺':'金',
'濼':'金',
'荟':'木',
'薈':'金',
'栉':'木',
'櫛':'木',
'栎':'金',
'櫟':'木',
'虿':'金',
'蠆':'金',
'祢':'金',
'禰':'金',
'鸫':'金',
'鶇':'水',
'脍':'金',
'膾':'金',
'玺':'金',
'璽':'金',
'郸':'金',
'鄲':'金',
'蛏':'金',
'蟶':'金',
'铩':'金',
'鎩':'金',
'渎':'金',
'瀆':'金',
'裆':'金',
'襠':'金',
'椟':'木',
'櫝':'木',
'铿':'金',
'鏗':'金',
'犊':'金',
'犢':'金',
'牍':'金',
'牘':'金',
'馊':'金',
'餿':'金',
'骛':'水',
'騖':'金',
'韫':'金',
'韞':'金',
'摅':'金',
'攄':'金',
'蓟':'金',
'薊':'金',
'榈':'金',
'櫚':'木',
'鹌':'金',
'鵪':'水',
'鹐':'金',
'鵮':'水',
'飕':'金',
'颼':'金',
'鹑':'金',
'鶉':'水',
'滢':'水',
'瀅':'金',
'韬':'金',
'韜':'金',
'蔷':'金',
'薔':'金',
'锵':'金',
'鏘':'金',
'镂':'金',
'鏤':'金',
'鄱':'金',
'鄯':'金',
'鲞':'金',
'鯗':'金',
'谮':'金',
'譖':'金',
'谯':'金',
'譙':'金',
'谲':'金',
'譎':'金',
'撷':'金',
'擷':'金',
'撸':'金',
'擼':'金',
'蕺':'金',
'觑':'金',
'覷':'金',
'觯':'金',
'觶':'金',
'遴':'金',
'擞':'金',
'擻':'金',
'蕻':'金',
'薤':'金',
'薨':'金',
'薏':'金',
'薜':'金',
'薅':'金',
'橹':'木',
'櫓':'木',
'橼':'木',
'櫞':'木',
'赝':'金',
'贋':'金',
'錾':'金',
'鏨':'金',
'辚':'金',
'轔':'金',
'蟒':'金',
'镖':'金',
'鏢':'金',
'镗':'金',
'鏜':'金',
'镘':'金',
'鏝':'金',
'镚':'金',
'鏰':'金',
'镛':'金',
'鏞':'金',
'镝':'金',
'鏑':'金',
'镞':'金',
'鏃':'金',
'镠':'金',
'鏐':'金',
'氇':'金',
'氌':'金',
'鲮':'金',
'鯪':'金',
'鲱':'金',
'鲲':'水',
'鯤':'金',
'鲳':'金',
'鯧':'金',
'鲴':'金',
'鯝':'金',
'鲵':'金',
'鯢':'金',
'鲷':'金',
'鯛':'金',
'鲻':'金',
'鯔':'金',
'赟':'金',
'贇':'金',
'颡':'金',
'顙':'金',
'缲':'水',
'繰':'金',
'缳':'金',
'繯':'金',
'镪':'金',
'鏹':'金',
'臌':'金',
'膻':'金',
'臆':'金',
'臃':'金',
'膺':'金',
'鏊':'金',
'髂':'金',
'蹩':'金',
'鬏':'金',
'鞲':'金',
'鞴':'金',
'麓':'金',
'醮':'金',
'醯':'金',
'霪':'金',
'霨':'金',
'黼':'金',
'嚯':'金',
'蹰':'金',
'蹶':'金',
'蹽':'金',
'蹼':'金',
'蹴':'金',
'蹾':'金',
'蟾':'金',
'蠊':'金',
'黢':'金',
'籀':'金',
'齁':'金',
'麒':'火',
'鏖':'金',
'羸':'金',
'襞':'金',
'璺':'金',
'坜':'金',
'壢':'金',
'荙':'木',
'薘':'金',
'舣':'金',
'艤':'金',
'莶':'木',
'薟':'金',
'厣':'金',
'厴':'金',
'酦':'金',
'醱':'金',
'龂':'金',
'齗':'金',
'翙':'金',
'翽':'金',
'筜':'金',
'簹':'金',
'馉':'金',
'餶':'金',
'裣':'金',
'襝':'金',
'骙':'金',
'騤':'金',
'䴖':'金',
'鶄':'水',
'蓣':'金',
'蕷':'金',
'鹍':'火',
'鵾':'水',
'鹎':'金',
'鵯':'水',
'馌':'金',
'饁':'金',
'鹒':'金',
'鶊':'水',
'飗':'金',
'飀':'金',
'鄫':'金',
'麹':'金',
'麴':'金',
'薁':'金',
'镆':'金',
'鏌':'金',
'澛':'金',
'瀂':'金',
'遹':'金',
'薢':'金',
'蕹':'金',
'鲭':'金',
'鯖':'金',
'鲯':'金',
'鯕':'金',
'鲰':'金',
'鯫':'金',
'鲺':'金',
'鯴':'金',
'鲹':'金',
'鯵':'金',
'擿':'金',
'襚':'金',
'瓀':'金',
'爇':'金',
'鞳':'金',
'礞':'金',
'髃':'金',
'馧':'金',
'旞':'金',
'瀔':'金',
'瀍':'金',
'瀌':'金',
'襜':'金',
'嚭':'金',
'鬷':'金',
'醭':'金',
'蹯':'金',
'蠋':'金',
'翾':'金',
'儳':'金',
'儴':'金',
'鼗':'金',
'麑':'金',
'麖':'金',
'蠃':'金',
'嬿':'金',
'鄩':'金',
'櫍':'木',
'齘':'金',
'顗':'金',
'騞':'金',
'騠':'金',
'譓':'金',
'鏏':'金',
'繶':'金',
'鯻':'金',
'犤':'金',
'寳':'金',
'犦':'金',
'覇':'金',
'爊':'金',
'隞':'金',
'薆':'金',
'懪':'金',
'繴':'金',
'糪':'金',
'譒':'金',
'蹳':'金',
'餺':'金',
'贆':'金',
'璸':'金',
'矉':'金',
'霦':'金',
'鵧':'水',
'鄪':'金',
'鄨':'金',
'鏎':'金',
'轐':'金',
'攃':'金',
'薒':'金',
'襙':'金',
'鏪':'金',
'劖':'金',
'繵':'金',
'蟺':'金',
'譂':'金',
'鏛':'金',
'闛':'金',
'謿':'金',
'瀓':'金',
'穪':'金',
'嚫':'金',
'曟':'金',
'癡':'金',
'趩':'金',
'臅':'金',
'鬌':'金',
'鯙':'金',
'歠':'金',
'薋':'金',
'蠀':'金',
'蹵':'金',
'櫕':'木',
'濽':'金',
'蟽':'金',
'鏙':'金',
'騘':'金',
'鏓':'金',
'鏦':'金',
'嚪':'金',
'聸':'金',
'贉':'金',
'醰':'金',
'艡':'金',
'蟷':'金',
'隝':'金',
'覴':'金',
'鯟':'金',
'顚':'金',
'鵰':'水',
'殰':'金',
'簵':'金',
'襡':'金',
'濻':'金',
'譈':'金',
'襗':'金',
'軃':'金',
'鵽':'水',
'礘':'金',
'譌':'金',
'遻':'金',
'薠':'金',
'颿':'金',
'轓':'金',
'瓂':'金',
'櫠':'木',
'鯡':'金',
'騛':'金',
'膹':'金',
'轒':'金',
'嚩':'金',
'懯':'金',
'鵩':'水',
'簳':'金',
'櫜':'木',
'餻':'金',
'騔':'金',
'鏠':'金',
'觵':'金',
'龏':'金',
'簼':'金',
'韝':'金',
'薣':'金',
'騧':'金',
'旝':'金',
'鏆':'金',
'櫎':'木',
'襘':'金',
'鄬':'金',
'餽':'金',
'薧':'金',
'薃':'金',
'覈':'金',
'譀':'金',
'豃':'金',
'譁':'金',
'糫':'金',
'爌':'金',
'皩':'金',
'趪':'金',
'騜':'金',
'櫘':'木',
'瀈':'金',
'薉':'金',
'瓁':'金',
'矆':'金',
'矱':'金',
'霩':'金',
'櫭':'木',
'璾':'金',
'癠':'金',
'穧':'金',
'繫':'金',
'艥':'金',
'蟿':'金',
'韲':'金',
'鯚':'金',
'擶':'金',
'瀐':'金',
'礛':'金',
'覵':'金',
'鏩':'金',
'騝':'金',
'鬋':'金',
'鵳':'水',
'顜':'金',
'譑':'金',
'趭':'金',
'璶':'金',
'嶻':'金',
'擳':'金',
'瀄':'金',
'繲':'金',
'蟼':'金',
'鶁':'水',
'匶':'金',
'鯦':'金',
'麔':'金',
'屫':'金',
'臄':'金',
'蹷':'金',
'蹻':'金',
'鶌':'水',
'簴':'金',
'蹫':'金',
'鵴':'水',
'鶋':'水',
'羂':'金',
'臇':'金',
'麕':'金',
'礚':'金',
'颽':'金',
'簻':'金',
'鵼':'水',
'鏂':'金',
'顝':'金',
'糩':'金',
'闚':'金',
'懬':'金',
'懭':'金',
'擸':'金',
'爉':'金',
'臈':'金',
'斄':'金',
'鯠':'金',
'麳':'金',
'鶆':'水',
'轑':'金',
'軂':'金',
'嬾':'金',
'擥':'金',
'璼':'金',
'譋':'金',
'櫑':'木',
'攂':'金',
'櫐':'木',
'薐':'金',
'擽':'金',
'曞':'金',
'櫔':'木',
'濿':'金',
'爄':'金',
'犡':'金',
'蟸':'金',
'蠇':'金',
'鏫':'金',
'鯬':'金',
'鵹':'水',
'羷':'金',
'臁':'金',
'薕':'金',
'犣':'金',
'蕶':'金',
'蹸':'金',
'懰':'金',
'雡':'金',
'壠':'金',
'巃':'金',
'徿':'金',
'鏧':'金',
'嚧':'金',
'璷':'金',
'簶':'金',
'艣':'金',
'鏀':'金',
'鏕':'金',
'鯥':'金',
'鵦':'水',
'鵱':'水',
'薍':'金',
'鯩':'金',
'覶':'金',
'鏍':'金',
'镙':'金',
'擵':'金',
'鏋':'金',
'鄮':'金',
'黣':'金',
'鯭':'金',
'櫋':'木',
'矈':'金',
'矊':'金',
'懱':'金',
'櫗':'木',
'瀎':'金',
'薎':'金',
'爅':'金',
'譕':'金',
'夒':'金',
'獶':'金',
'繷':'金',
'譊':'金',
'鯘':'金',
'蹨':'金',
'矃':'金',
'孼':'金',
'蕽':'金',
'襛':'金',
'穤':'金',
'櫙':'木',
'瀊':'金',
'鞶':'金',
'礟':'金',
'韼':'金',
'嚬':'金',
'礗':'金',
'穦':'金',
'騗':'金',
'犥':'金',
'闝':'金',
'罊':'金',
'鏚':'金',
'闙':'金',
'鵸':'水',
'鶀':'水',
'鶈':'水',
'櫏':'木',
'騚':'金',
'艢':'金',
'趫':'金',
'趬':'金',
'鏒':'金',
'鯜':'金',
'寴':'金',
'蠄':'金',
'鵭':'水',
'竆':'金',
'騡':'金',
'勷':'金',
'遶':'金',
'騥':'金',
'礝':'金',
'壡':'金',
'櫒':'木',
'簺':'金',
'颾':'金',
'羶':'金',
'瀒':'金',
'繬':'金',
'譅':'金',
'繺':'金',
'鵿':'水',
'蠂':'金',
'譇':'金',
'鼭':'金',
'璹':'金',
'鏉':'金',
'薓':'金',
'儵':'金',
'薥':'金',
'鏣':'金',
'鵨':'水',
'鬊':'金',
'瀃':'金',
'蕼':'金',
'騦':'金',
'鏁':'金',
'櫢':'木',
'繸':'金',
'膸':'金',
'薞':'金',
'蹹':'金',
'薚':'金',
'隚':'金',
'餹':'金',
'鞱':'金',
'饀':'金',
'邆':'金',
'薙':'金',
'壜':'金',
'擹':'金',
'舚':'金',
'襢':'金',
'貚':'金',
'鵵':'水',
'穨':'金',
'蹪':'金',
'臋':'金',
'鏄':'金',
'鼃':'金',
'壝':'金',
'舋':'金',
'齀':'金',
'薂':'金',
'譆':'金',
'隟':'金',
'霫':'金',
'罋':'金',
'蕸':'金',
'鏬':'金',
'騢':'金',
'瀇':'金',
'幰':'金',
'馦':'金',
'膷':'金',
'蠁':'金',
'爕':'金',
'蠍':'金',
'蠏':'金',
'鞵':'金',
'顖':'金',
'嬹':'金',
'鏅':'金',
'鏥':'金',
'璿':'金',
'蕿':'金',
'蠉':'金',
'镟':'金',
'譃':'金',
'鄦':'金',
'矄':'金',
'鵶':'水',
'齖':'金',
'矅':'金',
'颻':'金',
'騕':'金',
'嚥':'金',
'壛':'金',
'簷':'金',
'艶':'金',
'懩':'金',
'攁':'金',
'瀁':'金',
'毉':'金',
'豷':'金',
'鏔':'金',
'霬':'金',
'鯣':'金',
'鶂':'水',
'鶃':'水',
'鵺':'水',
'甖':'金',
'懮':'金',
'櫌':'木',
'瀀':'金',
'斔':'金',
'礜':'金',
'穥':'金',
'騟':'金',
'薗':'金',
'鵷':'水',
'薀':'金',
'韻':'金',
'攅':'金',
'蠈':'金',
'蠌':'金',
'譄':'金',
'譗':'金',
'旜':'金',
'薝':'金',
'轏':'金',
'鵫':'水',
'辴':'金',
'懫':'金',
'軄':'金',
'鯯':'金',
'蹱':'金',
'鯞':'金',
'櫡':'木',
'櫫':'木',
'鼄':'金',
'膼':'金',
'譔':'金',
'鵻':'水',
'鶅':'水',
'齍':'金',
'騣':'金',
'鬉':'金',
'鯮':'金',
'黀':'金',
'璻':'金',
'譐':'金',
'议':'金',
'議':'水',
'出':'水',
'齣':'水',
'迈':'水',
'邁':'水',
'糰':'水',
'严':'水',
'嚴':'水',
'还':'水',
'還':'水',
'沥':'水',
'瀝':'水',
'怀':'水',
'懷':'水',
'译':'水',
'譯':'水',
'拢':'水',
'攏':'水',
'矾':'水',
'礬':'水',
'矿':'土',
'礦':'水',
'罗':'水',
'羅':'水',
'炉':'水',
'爐':'水',
'宝':'土',
'寶':'水',
'鹹':'水',
'面':'水',
'麵':'水',
'响':'水',
'響':'水',
'鐘':'水',
'胧':'水',
'朧':'水',
'觉':'水',
'覺':'水',
'砾':'水',
'礫':'水',
'党':'水',
'黨':'水',
'铁':'金',
'鐡':'水',
'牺':'水',
'犧':'水',
'借':'水',
'藉':'水',
'舰':'水',
'艦':'水',
'脐':'水',
'臍':'水',
'症':'水',
'癥':'水',
'竞':'水',
'競':'水',
'继':'水',
'繼':'水',
'萨':'水',
'薩':'水',
'悬':'水',
'懸':'水',
'痒':'水',
'癢':'水',
'阐':'水',
'闡':'水',
'琼':'水',
'瓊':'水',
'释':'水',
'釋':'水',
'骚':'水',
'騷':'水',
'蓝':'木',
'藍':'水',
'献':'水',
'獻':'水',
'龄':'水',
'齡':'水',
'筹':'水',
'籌':'水',
'腾':'水',
'騰':'水',
'触':'水',
'觸':'水',
'馍':'水',
'饃':'水',
'缤':'水',
'繽':'水',
'馒':'水',
'饅':'水',
'潇':'水',
'瀟':'水',
'飘':'水',
'飄':'水',
'鲫':'水',
'鯽':'水',
'薯':'水',
'篮':'水',
'籃':'水',
'邀':'水',
'濒':'水',
'瀕':'水',
'懒':'水',
'懶':'水',
'避':'水',
'藏':'水',
'藐':'水',
'赡':'水',
'贍':'水',
'鳄':'水',
'鰐':'水',
'辫':'水',
'辮':'水',
'赢':'金',
'贏':'水',
'孽':'水',
'警':'水',
'壤':'水',
'馨':'水',
'耀':'火',
'躁':'水',
'蠕':'水',
'嚷':'水',
'籍':'水',
'糯':'水',
'譬':'水',
'露':'水',
'苧':'水',
'邺':'水',
'鄴':'水',
'疖':'水',
'癤':'水',
'枥':'水',
'櫪':'木',
'岿':'水',
'巋':'水',
'泷':'水',
'瀧':'水',
'泸':'水',
'瀘':'水',
'荠':'木',
'薺':'水',
'荩':'木',
'藎':'水',
'栊':'木',
'櫳':'木',
'栌':'木',
'櫨':'木',
'砺':'水',
'礪':'水',
'趸':'水',
'躉':'水',
'铙':'水',
'鐃':'水',
'铧':'水',
'鏵':'水',
'蛴':'水',
'蠐':'水',
'锏':'水',
'鐧':'水',
'喾':'水',
'嚳':'水',
'骘':'水',
'騭':'水',
'鹋':'水',
'鶓':'水',
'龃':'水',
'齟':'水',
'龅':'水',
'齙':'水',
'跶':'水',
'躂':'水',
'馐':'水',
'饈':'水',
'骞':'水',
'騫':'水',
'窦':'水',
'竇':'水',
'骝':'水',
'騮':'水',
'骟':'水',
'騸':'水',
'鹕':'水',
'鶘':'水',
'槠':'水',
'櫧':'木',
'鹗':'水',
'鶚':'水',
'嘤':'水',
'嚶':'水',
'罴':'水',
'羆':'水',
'罂':'水',
'罌':'水',
'膑':'水',
'臏':'水',
'馑':'水',
'饉':'水',
'阚':'水',
'闞':'水',
'鹛':'水',
'鶥':'水',
'鹜':'水',
'鶩':'水',
'踬':'水',
'礩':'水',
'蝾':'水',
'蠑':'水',
'褴':'水',
'襤':'水',
'谵':'水',
'譫':'水',
'颟':'水',
'顢':'水',
'遽':'水',
'獭':'水',
'獺':'水',
'邂':'水',
'濑':'水',
'瀨':'水',
'缱':'水',
'繾':'水',
'薹':'水',
'薷':'水',
'薰':'水',
'藁':'水',
'镡':'水',
'鐔':'水',
'镢':'水',
'鐝':'水',
'镣':'水',
'鐐':'水',
'镦':'水',
'鐓':'水',
'镫':'水',
'鐙':'水',
'鲽':'水',
'鰈':'水',
'鳀':'水',
'鯷':'水',
'鳃':'水',
'鰓':'水',
'鳅':'水',
'鰍':'水',
'鳇':'水',
'鰉':'水',
'鳊':'水',
'鯿':'水',
'邃':'水',
'躇':'水',
'懵':'水',
'攉':'水',
'蠖':'水',
'蠓':'水',
'艨':'水',
'瀚':'水',
'瀣':'水',
'瀛':'水',
'襦':'水',
'醴':'水',
'霰':'水',
'矍':'水',
'曦':'火',
'躅':'水',
'巉':'水',
'黥':'水',
'黧':'水',
'纂':'水',
'鼯':'水',
'孀':'水',
'薴':'水',
'郐':'水',
'鄶':'水',
'驺':'水',
'騶':'水',
'昽':'水',
'曨':'水',
'聍':'水',
'聹':'水',
'铴':'水',
'鐋':'水',
'铹':'水',
'鐒':'水',
'锎':'水',
'鐦':'水',
'敩':'水',
'斆':'水',
'榇':'水',
'櫬':'木',
'龆':'水',
'齠':'水',
'䴗':'水',
'鶪':'水',
'鹖':'水',
'鶡':'水',
'镄':'水',
'鐨':'水',
'鹙':'水',
'鶖':'水',
'鲗':'水',
'鰂':'水',
'潆':'水',
'瀠':'水',
'薳':'水',
'豮':'水',
'豶':'水',
'亸':'水',
'嚲':'水',
'薿':'水',
'薸':'水',
'镤':'水',
'鏷':'水',
'镨':'水',
'鐠':'水',
'䲠':'水',
'鰆':'水',
'鲾':'水',
'鰏':'水',
'鳁':'水',
'鰛':'水',
'鳂':'水',
'鰃':'水',
'鳈':'水',
'鰁':'水',
'臑':'水',
'鬒':'水',
'醵':'水',
'巇':'水',
'犨':'水',
'爔':'水',
'孅':'水',
'瓅':'水',
'鄳':'水',
'隤':'水',
'醲':'水',
'騵':'水',
'騱':'水',
'鶠':'水',
'譞':'水',
'鐄':'水',
'鐇':'水',
'鐏':'水',
'鏻':'水',
'鐍':'水',
'鰊':'水',
'繻':'水',
'纁':'水',
'髈':'水',
'矲':'水',
'韛':'水',
'韽':'水',
'鶕':'水',
'譪':'水',
'藊':'水',
'鯾':'水',
'疈':'水',
'髉':'水',
'髆':'水',
'穮':'水',
'襣':'水',
'躃':'水',
'躄':'水',
'鞸':'水',
'韠':'水',
'饆':'水',
'纀':'水',
'礤':'水',
'鄵':'水',
'騲':'水',
'齜':'水',
'嚵':'水',
'鏿':'水',
'騬':'水',
'薼':'水',
'鶒':'水',
'齝':'水',
'薵':'水',
'鶨':'水',
'鶞':'水',
'髊':'水',
'顣':'水',
'臎':'水',
'藂':'水',
'齚':'水',
'霴':'水',
'霮':'水',
'譡':'水',
'翿':'水',
'隥':'水',
'霯':'水',
'籊':'水',
'藋':'水',
'瓄':'水',
'皾':'水',
'騳':'水',
'鬪':'水',
'瀩':'水',
'薱':'水',
'鐜':'水',
'櫮':'木',
'薾':'水',
'藅':'水',
'瀪':'水',
'襥':'水',
'鰒':'水',
'鳆':'水',
'鶝':'水',
'魐':'水',
'轕':'水',
'鄷':'水',
'穬':'水',
'鐀':'水',
'騩':'水',
'瀥':'水',
'籇':'水',
'藃':'水',
'蠔':'水',
'攌':'水',
'蘤':'水',
'譮':'水',
'鯸':'水',
'櫰':'木',
'瀤':'水',
'轘':'水',
'鯶':'水',
'鰀':'水',
'瀫':'水',
'鰗':'水',
'鶦':'水',
'儶':'水',
'譭':'水',
'鏸':'水',
'闠':'水',
'曤':'水',
'瀖':'水',
'耯':'水',
'臒':'水',
'艧':'水',
'聻':'水',
'譤':'水',
'轚':'水',
'鏶':'水',
'鐖':'水',
'麚':'水',
'藆':'水',
'蠒':'水',
'鐗':'水',
'鰎':'水',
'鰔':'水',
'孂':'水',
'斅':'水',
'譥':'水',
'醶':'水',
'鐎':'水',
'蠘':'水',
'鐑':'水',
'鶛':'水',
'瀞':'水',
'匷':'水',
'爑':'水',
'巈':'水',
'躆':'水',
'鼰':'水',
'攈':'水',
'竷':'水',
'轗':'水',
'籄':'水',
'藈':'水',
'矌':'水',
'鶤':'水',
'鞹':'水',
'攋':'水',
'櫴':'木',
'顟':'水',
'孄':'水',
'幱':'水',
'繿':'水',
'瓃':'水',
'礧':'水',
'礨':'水',
'攊':'水',
'爏':'水',
'瓈':'水',
'皪':'水',
'盭':'水',
'禲':'水',
'薶':'水',
'譧':'水',
'鬑':'水',
'爒':'水',
'镽':'水',
'飂':'水',
'孁':'水',
'壣':'水',
'隣':'水',
'鞻':'水',
'鐂':'水',
'鬸':'水',
'爖':'水',
'霳':'水',
'攎':'水',
'曥':'水',
'獹':'水',
'鶜':'水',
'籋':'水',
'羃':'水',
'藌':'水',
'麛':'水',
'礣':'水',
'孃':'水',
'黁':'水',
'齞':'水',
'羺':'水',
'譨':'水',
'鐞':'水',
'櫱':'木',
'騯':'水',
'薲':'水',
'鶣':'水',
'皫':'水',
'顠':'水',
'飃':'水',
'鐅':'水',
'鏺':'水',
'艩':'水',
'藄':'水',
'藒':'水',
'鬐':'水',
'攐':'水',
'濳':'水',
'爓':'水',
'譣':'水',
'躈':'水',
'鐈':'水',
'聺':'水',
'瀙':'水',
'藑':'水',
'鰌':'水',
'覻':'水',
'鐉':'水',
'隢':'水',
'曧':'水',
'瀜':'水',
'瓇':'水',
'鰇':'水',
'鶔':'水',
'闟':'水',
'鏾':'水',
'鰠':'水',
'譱':'水',
'轖':'水',
'鏼':'水',
'譝':'水',
'遾':'水',
'醳':'水',
'齛':'水',
'鶐':'水',
'鐁':'水',
'騪':'水',
'櫯':'木',
'瀡':'水',
'譢':'水',
'鐆':'水',
'籉':'水',
'鞺':'水',
'饄':'水',
'瓋':'水',
'軆':'水',
'鶗':'水',
'鶙':'水',
'譠':'水',
'鼮':'水',
'鶟':'水',
'顡':'水',
'鰖':'水',
'贎':'水',
'瀢':'水',
'覹':'水',
'觹':'水',
'鰄':'水',
'嚱':'水',
'鐊':'水',
'飁':'水',
'鰕':'水',
'廯':'水',
'攇':'水',
'瀗':'水',
'礥':'水',
'糮':'水',
'麙':'水',
'忀':'水',
'鐌':'水',
'麘':'水',
'髇':'水',
'鯹':'水',
'鏽':'水',
'矎':'水',
'藇':'水',
'臐':'水',
'鐚':'水',
'觷':'水',
'曣':'水',
'櫩':'木',
'騴':'水',
'鰋':'水',
'黤':'水',
'龑':'水',
'鰑':'水',
'譩':'水',
'轙':'水',
'醷':'水',
'韾':'水',
'孆':'水',
'孾':'水',
'巊':'水',
'廮':'水',
'巆':'水',
'攍':'水',
'藀':'水',
'譍':'水',
'鐛':'水',
'鶧':'水',
'鰅':'水',
'旟':'水',
'櫲':'木',
'籅':'水',
'霱':'水',
'饇':'水',
'黦':'水',
'鶢':'水',
'籆':'水',
'瓉':'水',
'鐕':'水',
'薻':'水',
'譟':'水',
'趮':'水',
'邅':'水',
'羄':'水',
'籈':'水',
'薽':'水',
'鏳':'水',
'瓆':'水',
'襧':'水',
'豑':'水',
'籕':'水',
'瀦':'水',
'鯺':'水',
'蠗':'水',
'鯼':'水',
'艺':'金',
'藝':'木',
'饑':'木',
'护':'木',
'護':'木',
'灶':'木',
'竈':'木',
'鸡':'火',
'鷄':'水',
'驱':'水',
'驅':'木',
'拦':'木',
'攔':'木',
'轰':'木',
'轟':'木',
'瀰':'木',
'药':'木',
'藥':'木',
'栏':'木',
'欄':'木',
'览':'木',
'覽':'木',
'饶':'木',
'饒':'木',
'烂':'木',
'爛':'木',
'险':'木',
'險':'木',
'莺':'木',
'鶯':'水',
'顾':'木',
'顧':'木',
'袜':'木',
'襪':'木',
'跃':'木',
'躍':'木',
'累':'木',
'纍':'木',
'铛':'木',
'鐺':'木',
'随':'土',
'隨':'木',
'续':'木',
'續':'木',
'搀':'木',
'攙':'木',
'腊':'木',
'臘':'木',
'馈':'木',
'饋':'木',
'属':'木',
'屬':'木',
'襬':'木',
'誉':'木',
'譽':'木',
'辟':'木',
'闢':'木',
'缠':'水',
'纏':'木',
'蔑':'木',
'衊':'木',
'蜡':'木',
'蠟':'木',
'隧':'土',
'骡':'水',
'騾':'木',
'樱':'木',
'櫻':'木',
'澜':'木',
'瀾':'木',
'谴':'木',
'譴':'木',
'鹤':'火',
'鶴':'水',
'辩':'木',
'辯':'木',
'藕':'木',
'藤':'木',
'嚣':'木',
'囂':'木',
'镰':'木',
'鐮':'木',
'鳍':'木',
'鰭':'木',
'嚼':'木',
'巍':'木',
'魔':'木',
'蠢':'木',
'霸':'木',
'霹':'木',
'黯':'木',
'忏':'木',
'懺':'木',
'迩':'木',
'邇':'木',
'珑':'木',
'瓏':'木',
'俪':'木',
'儷':'木',
'疬':'木',
'癧':'木',
'闼':'木',
'闥':'木',
'砻':'木',
'礱':'木',
'眬':'木',
'矓':'木',
'铎':'金',
'鐸':'木',
'啭':'木',
'囀':'木',
'蛎':'木',
'蠣':'木',
'猕':'木',
'獼':'木',
'粝':'木',
'糲':'木',
'骖':'木',
'驂':'木',
'傩':'木',
'儺':'木',
'骜':'木',
'驁':'木',
'蓦':'木',
'驀':'木',
'榉':'木',
'櫸':'木',
'嗫':'木',
'囁':'木',
'跻':'木',
'躋':'木',
'撄':'木',
'攖':'木',
'龇':'木',
'龈':'木',
'齦':'木',
'踌':'木',
'躊':'木',
'鹘':'木',
'鶻':'水',
'鹚':'木',
'鷀':'水',
'潋':'木',
'瀲':'木',
'骠':'水',
'驃':'木',
'骢':'水',
'驄':'木',
'鞒':'木',
'鞽':'木',
'鹞':'木',
'鷂':'水',
'鲥':'木',
'鰣':'木',
'馓':'木',
'饊':'木',
'馔':'木',
'饌':'木',
'缬':'水',
'纈':'木',
'薮':'木',
'藪':'木',
'飙':'木',
'飆':'木',
'斓':'木',
'斕':'木',
'邈':'木',
'藜':'木',
'藠':'木',
'藩':'木',
'颢':'木',
'顥':'木',
'髅':'木',
'髏':'木',
'镭':'木',
'鐳':'木',
'镯':'木',
'鐲':'木',
'鳎':'木',
'鰨':'木',
'鳏':'木',
'鰥':'木',
'鳐':'木',
'鰩':'木',
'癞':'木',
'癩':'木',
'魑':'木',
'攘':'木',
'鼙':'木',
'醺':'木',
'礴':'木',
'曩':'木',
'麝':'木',
'鐾':'木',
'羼':'木',
'蠡':'木',
'纩':'木',
'纊':'木',
'鸧':'木',
'鶬':'水',
'䓖':'木',
'藭':'木',
'赆':'木',
'贐':'木',
'赑':'木',
'贔':'木',
'隩':'木',
'鹝':'木',
'鷊':'水',
'䴘':'木',
'鷉':'水',
'鹟':'木',
'鶲':'水',
'鹠':'木',
'鶹':'水',
'鹡':'木',
'鶺':'水',
'鹢':'木',
'鷁':'水',
'鹣':'木',
'鶼':'水',
'鄹':'木',
'鹾':'木',
'鹺':'木',
'鬶':'木',
'鬹':'木',
'藟':'木',
'藦':'木',
'藨':'木',
'镮':'木',
'鐶':'木',
'镱':'木',
'鐿':'木',
'䲢':'木',
'鰧':'木',
'鳑':'木',
'鰟':'木',
'鳒':'木',
'鰜':'木',
'欂':'木',
'甗':'木',
'髎':'木',
'瀱':'木',
'瀹':'木',
'瀼':'木',
'瀵':'木',
'襫':'木',
'耰':'木',
'鬘':'木',
'趯':'木',
'罍':'木',
'鼱':'木',
'爚':'木',
'亹':'木',
'鐽':'木',
'鰤':'木',
'鶱':'水',
'鐩':'木',
'纆':'木',
'黬':'木',
'鐼':'木',
'譺':'木',
'藣':'木',
'襮':'木',
'臕':'木',
'飇':'木',
'飈':'木',
'朇':'木',
'鐴':'木',
'驆':'木',
'魓':'木',
'囃':'木',
'欃':'木',
'瀺':'木',
'鼚':'木',
'巐':'木',
'饓':'木',
'饎':'木',
'醻':'木',
'鶵':'水',
'龡':'木',
'嚽':'木',
'鶿':'水',
'劗':'木',
'瀻':'木',
'饏':'木',
'黮':'木',
'蘯':'木',
'闣':'木',
'軇':'木',
'藡':'木',
'鐵':'木',
'轛':'木',
'譵':'木',
'鰪':'木',
'轜':'木',
'瀿':'木',
'籓':'木',
'蠜':'木',
'飜':'木',
'鶭':'水',
'隫':'木',
'馩':'木',
'贑':'木',
'鼛':'木',
'寷':'木',
'鷇':'水',
'鶮':'水',
'瓌':'木',
'鞼':'木',
'鐹':'木',
'譹':'木',
'鰝':'木',
'皬':'木',
'蠚':'木',
'鶾':'水',
'嚾':'木',
'孉':'木',
'藧':'木',
'闤':'木',
'兤':'木',
'孈':'木',
'藱':'木',
'鐬':'木',
'靧':'木',
'韢':'木',
'嚿':'木',
'癨':'木',
'矐':'木',
'懻':'木',
'霵':'木',
'鞿':'木',
'齎':'木',
'櫼':'木',
'殲':'木',
'瀳':'木',
'瀸':'木',
'瀽':'木',
'譼':'木',
'轞':'木',
'鐱':'木',
'鹻':'木',
'鷍':'水',
'齩':'木',
'蠞':'木',
'齨':'木',
'鐻':'木',
'鐫':'木',
'臗':'木',
'瓎':'木',
'藞':'木',
'纇':'木',
'蠝':'木',
'礰':'木',
'纅':'木',
'鷅':'水',
'麜':'木',
'飉':'木',
'櫺':'木',
'瀶':'木',
'藰':'木',
'飅':'木',
'鰡':'木',
'竉':'木',
'龒':'木',
'瓐':'木',
'矑':'木',
'艪':'木',
'鏴':'木',
'鐪':'木',
'騼':'木',
'儸':'木',
'覼':'木',
'鬕':'木',
'鰢':'木',
'鷌':'水',
'鬗':'木',
'矒':'木',
'攗':'木',
'鄸':'木',
'蠠':'木',
'蠛':'木',
'劘':'木',
'髍':'木',
'躎':'木',
'譳':'木',
'齧':'木',
'欁':'木',
'霶':'木',
'礮':'木',
'鬔':'木',
'隦':'木',
'魒':'木',
'攓':'木',
'鰬':'木',
'羻':'木',
'鐰':'木',
'顦':'木',
'龝':'木',
'礭':'木',
'忂':'木',
'巏':'木',
'齤':'木',
'懹':'木',
'爙':'木',
'獽':'木',
'顤':'木',
'鰫':'木',
'醹':'木',
'鶸':'水',
'攕':'木',
'鬖':'木',
'饍':'木',
'鬺':'木',
'鶳':'水',
'籔':'木',
'襩':'木',
'卛':'木',
'孇':'木',
'灀':'木',
'騻':'木',
'藗':'木',
'瓍':'木',
'鶽':'水',
'譶':'木',
'鶶':'水',
'籐':'木',
'鷈':'水',
'藫':'木',
'鷆':'水',
'藬':'木',
'藯':'木',
'霺':'木',
'韡':'木',
'闦':'木',
'鰮':'木',
'躌':'木',
'鰞':'木',
'騽':'木',
'鶷':'水',
'纎':'木',
'臔':'木',
'藖':'木',
'贒':'木',
'欀':'木',
'嚻':'木',
'櫹':'木',
'藛':'木',
'襭':'木',
'齥':'木',
'籑':'木',
'藚':'木',
'壦':'木',
'顨':'木',
'雤':'木',
'鞾':'木',
'鷃':'水',
'黫':'木',
'黭':'木',
'霷':'木',
'瀷':'木',
'藙':'木',
'觺':'木',
'饐':'木',
'鐷':'木',
'櫽':'木',
'櫿':'木',
'瀴':'木',
'瀯':'木',
'礯':'木',
'譻':'木',
'廱':'木',
'櫾':'木',
'纋':'木',
'轝':'木',
'鐭':'木',
'灁':'木',
'鶰':'水',
'鼘':'木',
'儹':'木',
'贓':'木',
'騿':'木',
'藢':'木',
'騺':'木',
'鼅':'木',
'籒':'木',
'譸':'木',
'鐯':'木',
'鰦':'木',
'纉':'木',
'边':'火',
'邊':'火',
'权':'木',
'權':'火',
'欢':'火',
'歡':'火',
'罎':'火',
'芦':'木',
'蘆':'火',
'苏':'木',
'蘇':'火',
'听':'火',
'聽':'火',
'苹':'木',
'蘋':'火',
'衬':'火',
'襯':'火',
'鸥':'火',
'鷗':'水',
'鬚':'火',
'峦':'土',
'巒':'火',
'弯':'火',
'彎':'火',
'窃':'火',
'竊':'火',
'骄':'火',
'驕':'火',
'读':'金',
'讀':'火',
'聋':'火',
'聾':'火',
'袭':'火',
'襲':'火',
'啰':'火',
'囉':'火',
'笼':'火',
'籠':'火',
'惧':'火',
'懼':'火',
'隐':'火',
'隱':'火',
'赎':'火',
'贖':'火',
'铸':'金',
'鑄':'火',
'摄':'火',
'攝':'火',
'鉴':'金',
'鑒':'火',
'蔼':'火',
'藹':'火',
'蕴':'火',
'蘊':'火',
'瘾':'火',
'癮':'火',
'蘑':'火',
'藻':'火',
'颤':'火',
'顫':'火',
'癣':'火',
'癬':'火',
'灌':'火',
'囊':'火',
'瓤':'火',
'邝':'火',
'鄺':'火',
'苈':'火',
'藶':'火',
'呓':'火',
'囈':'火',
'沣':'火',
'灃':'火',
'茏':'火',
'蘢':'火',
'籴':'火',
'糴':'火',
'俨':'火',
'儼':'火',
'胪':'火',
'臚':'火',
'孪':'火',
'孿':'火',
'娈':'火',
'孌':'火',
'骁':'水',
'驍':'火',
'骅':'水',
'驊':'火',
'鸷':'火',
'鷙':'水',
'龚':'火',
'龔':'火',
'舻':'火',
'艫':'火',
'龛':'火',
'龕':'火',
'跞':'火',
'躒':'火',
'傥':'火',
'儻':'火',
'飨':'火',
'饗':'火',
'慑':'火',
'懾':'火',
'辔':'火',
'轡':'火',
'蔺':'火',
'藺':'火',
'霁':'火',
'霽':'火',
'箓':'火',
'籙':'火',
'璎':'火',
'瓔':'火',
'撺':'火',
'攛':'火',
'鞑':'火',
'韃':'火',
'蕲':'火',
'蘄':'火',
'龉':'火',
'齬':'火',
'龊':'火',
'齪':'火',
'踯':'火',
'躑':'火',
'镔':'火',
'鑌':'火',
'鲢':'火',
'鰱':'火',
'鲣':'火',
'鰹':'火',
'骣':'火',
'驏':'火',
'鹧':'火',
'鷓':'水',
'瘿':'火',
'癭':'火',
'隰':'火',
'鳌':'火',
'鰲':'火',
'镬':'火',
'鑊':'火',
'邋':'火',
'藿':'火',
'蘅':'火',
'镲':'火',
'鑔':'火',
'籁':'火',
'籟':'火',
'鳓':'火',
'鰳':'火',
'鳔':'火',
'鰾':'火',
'鳕':'火',
'鱈':'火',
'鳗':'火',
'鰻':'火',
'鳙':'火',
'鱅':'火',
'獾':'火',
'夔':'火',
'爝':'火',
'禳':'火',
'耱':'火',
'懿':'火',
'霾':'火',
'氍':'火',
'饕':'火',
'躐':'火',
'穰':'火',
'饔':'火',
'鬻':'火',
'轹':'金',
'轢':'火',
'萚':'火',
'蘀':'火',
'骕':'火',
'驌':'火',
'觌':'火',
'覿':'火',
'滠':'火',
'灄':'火',
'箨':'火',
'籜':'火',
'鲦':'火',
'鰷':'火',
'篯':'火',
'籛':'火',
'鹨':'火',
'鷚':'水',
'鳉':'水',
'鱂':'火',
'冁':'火',
'囅':'火',
'鳘':'火',
'鰵':'火',
'鳚':'火',
'鳛':'火',
'鰼':'火',
'瓖':'火',
'爟':'火',
'灈':'火',
'韂':'火',
'礵':'火',
'躔':'火',
'龢':'火',
'隮':'火',
'驎':'火',
'饘':'火',
'鷟':'水',
'鱀':'火',
'鰶':'火',
'鱇':'火',
'鷔':'水',
'驋':'火',
'鷝':'水',
'鰺':'火',
'驓':'火',
'囆':'火',
'鄽':'火',
'藽':'火',
'鷐':'水',
'彲':'火',
'鷘':'水',
'黐':'火',
'爞':'火',
'藸':'火',
'躕':'火',
'巑':'火',
'穳':'火',
'欉':'木',
'灇':'火',
'爜':'火',
'鄼':'火',
'黱':'火',
'隯':'火',
'疊':'火',
'巓':'火',
'驔':'火',
'鑃':'火',
'蠧':'火',
'豄':'火',
'贕':'火',
'韣':'火',
'躖':'火',
'驐':'火',
'蘁':'火',
'隭':'火',
'灋':'火',
'饙':'火',
'懽':'火',
'鑎':'火',
'鑉':'火',
'鬫':'火',
'鑅':'火',
'譿':'火',
'顪':'火',
'饖':'火',
'鰴':'火',
'鼲':'火',
'臛':'火',
'蘎':'火',
'鑇':'火',
'魕':'火',
'鰿':'火',
'鷑':'水',
'譾':'火',
'鑑':'火',
'韀':'火',
'韁':'火',
'灂':'火',
'竸':'火',
'蘏':'火',
'灍':'火',
'鼳':'火',
'齫':'火',
'藾':'火',
'襰':'火',
'髝':'火',
'灆':'火',
'瓓':'火',
'灅':'火',
'讄':'火',
'轠':'火',
'囇':'火',
'孋':'火',
'廲':'火',
'蠫':'火',
'觻':'火',
'邌':'火',
'奱':'火',
'鄻':'火',
'鬛':'火',
'鷜':'水',
'驑':'火',
'蠪':'火',
'襱':'火',
'龓':'火',
'籚':'火',
'纑':'火',
'罏':'火',
'蠦':'火',
'圝':'火',
'蘉':'火',
'霿':'火',
'靀':'火',
'孊':'火',
'瓕':'火',
'镾':'火',
'巎':'火',
'獿':'火',
'髐':'火',
'隬':'火',
'鑏':'火',
'糱':'火',
'蠥':'火',
'鑈':'火',
'灊':'火',
'顩':'火',
'鬜':'火',
'藮':'火',
'鑋':'火',
'鰽':'火',
'鱃':'火',
'戵':'火',
'欋':'木',
'鰸':'火',
'鷛':'水',
'鑐':'火',
'蘂':'火',
'蘃':'火',
'鬙':'火',
'飋':'火',
'欇':'木',
'覾':'火',
'藷':'火',
'欆':'木',
'鷞':'水',
'籘':'火',
'鷋':'水',
'鼵':'火',
'蘈':'火',
'鱄':'火',
'鷒':'水',
'驒':'火',
'欈':'木',
'犩':'火',
'鷕':'水',
'攜':'火',
'霼':'火',
'齂':'火',
'蠨':'火',
'臖':'火',
'藼':'火',
'魖':'火',
'驉':'火',
'蘍':'火',
'鑂':'火',
'臙':'火',
'贗':'火',
'鼴':'火',
'鷖':'水',
'籝':'火',
'鑍':'火',
'灉':'火',
'鄾':'火',
'籞':'火',
'蘌':'火',
'驈':'火',
'鷠':'水',
'禴':'火',
'囋':'火',
'讃':'火',
'鱆':'火',
'麞':'火',
'讁':'火',
'黰':'火',
'躓':'火',
'蠩':'火',
'鱁':'火',
'鑆':'火',
'籗':'火',
'纔':'土',
'兰':'木',
'蘭':'土',
'纖':'土',
'囌':'土',
'体':'土',
'體':'土',
'变':'水',
'變':'土',
'显':'土',
'顯':'土',
'洒':'土',
'灑':'土',
'晒':'土',
'曬':'土',
'髒':'土',
'恋':'土',
'戀':'土',
'验':'土',
'驗':'土',
'惊':'土',
'驚':'土',
'摊':'土',
'攤':'土',
'籤':'土',
'漓':'土',
'灕':'土',
'滩':'土',
'灘':'土',
'霉':'土',
'黴':'土',
'鳖':'土',
'鱉':'土',
'鳞':'土',
'鱗':'土',
'髓':'土',
'驿':'土',
'驛':'土',
'轳':'土',
'轤':'土',
'铄':'土',
'鑠':'土',
'栾':'土',
'欒':'土',
'挛':'土',
'攣':'土',
'痈':'土',
'癰':'土',
'鸶':'土',
'鷥':'水',
'蛊':'土',
'蠱':'土',
'猡':'土',
'玀':'土',
'椤':'木',
'欏':'土',
'鹇':'土',
'鷳':'水',
'跹':'土',
'躚':'土',
'鲟':'土',
'鱘':'土',
'缨':'水',
'纓':'土',
'靥':'土',
'靨':'土',
'餍':'土',
'饜':'土',
'齑':'土',
'齏':'土',
'藓':'土',
'蘚':'土',
'鹩':'土',
'鷯':'水',
'鹪':'土',
'鷦':'水',
'鹫':'土',
'鷲':'水',
'隳':'土',
'鹬':'土',
'鷸':'水',
'鹭':'火',
'鷺':'水',
'雠':'土',
'讎':'土',
'攒':'土',
'攢':'土',
'蘧':'土',
'蘩':'土',
'蘖':'土',
'黪':'土',
'黲':'土',
'镳':'土',
'鑣':'土',
'镴':'土',
'鑞':'土',
'鳜':'土',
'鱖':'土',
'鳝':'土',
'鱔':'土',
'鳟':'土',
'鱒':'土',
'瓘':'土',
'髑':'土',
'鬟':'土',
'鼹':'土',
'癯':'土',
'麟':'火',
'蠲':'土',
'詟':'土',
'讋':'土',
'锧':'土',
'鑕':'土',
'鹔':'土',
'鷫':'水',
'蔹':'土',
'蘞':'土',
'镥':'土',
'鑥':'土',
'襕':'土',
'襴':'土',
'蘘':'土',
'颥':'土',
'顬':'土',
'糵':'土',
'皭':'土',
'籥':'土',
'鼷':'土',
'齮':'土',
'齯':'土',
'巘':'土',
'鷭':'水',
'鱚':'土',
'纕':'土',
'鼇':'土',
'蘗':'土',
'鱍':'土',
'鷩':'水',
'顮':'土',
'馪':'土',
'蠯':'土',
'鼜':'土',
'艬':'土',
'讇':'土',
'爡':'土',
'攡':'土',
'讐':'土',
'齭':'土',
'鑡':'土',
'齱':'土',
'欑':'土',
'齰':'土',
'瓙':'土',
'鑟':'土',
'讍':'土',
'齃':'土',
'鱕':'土',
'鷱':'水',
'蠭':'土',
'矔':'土',
'蘬':'土',
'饚':'土',
'鷨':'水',
'顭':'土',
'鷬':'水',
'鱑':'土',
'韄':'土',
'頀':'土',
'羇':'土',
'蘮':'土',
'覉':'土',
'鑙':'土',
'囏':'土',
'鱎':'土',
'鷮':'水',
'彏':'土',
'鱊':'土',
'鷢':'水',
'籧':'土',
'蘜':'土',
'攟':'土',
'鬠':'土',
'巙':'土',
'鑛':'土',
'籣':'土',
'蘫':'土',
'儽':'土',
'壨':'土',
'鑘':'土',
'靁':'土',
'劙':'土',
'攦':'土',
'欐':'土',
'讈':'土',
'轣':'土',
'鑗':'土',
'籢':'土',
'蘝':'土',
'蘦':'土',
'躙':'土',
'贚':'土',
'躘':'土',
'豅':'土',
'曫':'土',
'灓':'土',
'攞':'土',
'曪':'土',
'臝':'土',
'驘':'土',
'攠':'土',
'鷶':'水',
'鼆':'土',
'蘪':'土',
'饛':'土',
'戂':'土',
'灖':'土',
'爢':'土',
'鑖':'土',
'鱙':'土',
'戁':'土',
'蠰':'土',
'鬞':'土',
'鑝':'土',
'鄿':'土',
'蘠':'土',
'瓗':'土',
'鱋':'土',
'鷤':'水',
'髞':'土',
'灗':'土',
'鱓':'土',
'鑜':'土',
'襳':'土',
'鼶':'土',
'鱐':'土',
'禵':'土',
'驖':'土',
'蘣':'土',
'鷵':'水',
'鷻':'水',
'斖':'土',
'讏':'土',
'躛':'土',
'鷡':'水',
'觽':'土',
'韅':'土',
'鷴':'水',
'鼸':'土',
'鱌':'土',
'毊':'土',
'贙':'土',
'鱏':'土',
'蘨':'土',
'囐':'土',
'壧':'土',
'孍':'土',
'巖':'土',
'巗':'土',
'灔':'土',
'觾':'土',
'讌':'土',
'酀':'土',
'醼':'土',
'鷰':'水',
'蘙':'土',
'讉':'土',
'鷧':'水',
'黳':'土',
'蠮':'土',
'驜':'土',
'蘟':'土',
'鷣':'水',
'蘡':'土',
'蠳':'土',
'鷪':'水',
'愹':'土',
'蘛':'土',
'邍':'土',
'蘥':'土',
'灒':'土',
'驙':'土',
'籦':'土',
'劚':'土',
'穱':'土',
'鑚':'土',
'鷷':'水',
'千':'金',
'韆':'金',
'让':'金',
'讓':'金',
'壩':'金',
'灵':'火',
'靈':'金',
'艳':'金',
'艷':'金',
'蚕':'金',
'蠶':'金',
'盐':'金',
'鹽':'金',
'脏':'金',
'臟':'金',
'搅':'金',
'攪':'金',
'雳':'金',
'靂':'金',
'酿':'金',
'釀':'金',
'嘱':'金',
'囑':'金',
'瘫':'金',
'癱':'金',
'骤':'金',
'驟':'金',
'鹰':'火',
'鷹':'水',
'鬓':'金',
'鬢':'金',
'赣':'金',
'贛':'金',
'罐':'金',
'矗':'金',
'陇':'金',
'隴':'金',
'谗':'金',
'讒':'金',
'鲎':'金',
'鱟':'金',
'谰':'金',
'讕':'金',
'魇':'金',
'魘':'金',
'龋':'金',
'齲':'金',
'龌':'金',
'齷':'金',
'簖':'金',
'籪':'金',
'鲼':'金',
'鱝':'金',
'鹮':'金',
'酃':'金',
'霭':'金',
'靄':'金',
'髌':'金',
'髕':'金',
'谶':'金',
'讖':'金',
'瓒':'金',
'瓚':'金',
'颦':'金',
'顰':'金',
'鳢':'水',
'鱧':'金',
'癫':'金',
'癲':'金',
'攫':'金',
'攥':'金',
'蠹':'金',
'躞':'金',
'衢':'金',
'鑫':'金',
'鲙':'金',
'鱠':'金',
'叇':'金',
'靆':'金',
'鹯':'金',
'鸇':'水',
'鳡':'金',
'鱤':'金',
'鳣':'金',
'䴙':'金',
'鸊':'水',
'玃':'金',
'醾':'金',
'鑪':'金',
'欓':'金',
'驞':'金',
'礸':'金',
'蠺':'金',
'灛':'金',
'酁':'金',
'戃':'金',
'雦':'金',
'魗':'金',
'襶':'金',
'攩':'金',
'灙':'金',
'韇':'金',
'韥':'金',
'鬭':'金',
'奲':'金',
'鑩':'金',
'齶':'金',
'靅':'金',
'黂':'金',
'蘴':'金',
'鱞':'金',
'鱥':'金',
'蘳':'金',
'靃':'金',
'鸄':'水',
'鑬':'金',
'魙':'金',
'鹼':'金',
'灚':'金',
'麠':'金',
'戄':'金',
'欔':'金',
'犪':'金',
'齳':'金',
'囒':'金',
'孏':'金',
'躝':'金',
'禷':'金',
'蘲':'金',
'瓥':'金',
'穲':'金',
'醽':'金',
'鑨':'金',
'靇':'金',
'鸁':'水',
'矕':'金',
'醿':'金',
'儾':'金',
'鬡':'金',
'囓':'金',
'齵':'金',
'鷿':'水',
'玂':'金',
'鸂':'水',
'臞':'金',
'蠷':'金',
'蠸':'金',
'躟':'金',
'躠':'金',
'鱢':'金',
'鱣':'金',
'鱦':'金',
'鸀':'水',
'艭':'金',
'曭':'金',
'爣':'金',
'鼞':'金',
'驝':'金',
'攨':'金',
'韈':'金',
'韤':'金',
'蘶':'金',
'屭':'金',
'蠵':'金',
'衋':'金',
'齆':'金',
'玁':'金',
'齴':'金',
'齅':'金',
'讑':'金',
'邎':'金',
'鷽':'水',
'曮':'金',
'鸉':'水',
'鷾':'水',
'鸃':'水',
'鸈':'水',
'讔':'金',
'鸆':'水',
'鼝':'金',
'雥':'金',
'禶':'金',
'鸅':'水',
'鱡':'金',
'襵':'金',
'蘵':'金',
'孎':'金',
'纗':'金',
'厅':'水',
'廳':'水',
'观':'水',
'觀':'水',
'钥':'水',
'鑰':'水',
'赃':'水',
'贜':'水',
'萝':'水',
'蘿':'水',
'颅':'水',
'顱':'水',
'衅':'水',
'釁':'水',
'揽':'水',
'攬':'水',
'蛮':'水',
'蠻':'水',
'榄':'木',
'欖':'水',
'箩':'水',
'籮':'水',
'篱':'水',
'籬':'水',
'镶':'水',
'鑲':'水',
'笾':'水',
'籩':'水',
'塆':'水',
'壪':'水',
'脔':'水',
'臠':'水',
'蓠':'水',
'蘺':'水',
'叆':'水',
'靉':'水',
'鲚':'水',
'鱭':'水',
'蹑':'水',
'躡':'水',
'羁':'水',
'羈':'水',
'镧':'水',
'鑭':'水',
'蹿':'水',
'躥':'水',
'髋':'水',
'髖':'水',
'缵':'水',
'纘':'水',
'酆':'水',
'鼍':'水',
'鼉':'水',
'臜':'水',
'臢':'水',
'灏':'水',
'灝':'水',
'蘸':'水',
'镵':'水',
'鑱':'水',
'灞':'水',
'襻':'水',
'纛':'水',
'鬣':'水',
'囔':'水',
'黉':'水',
'黌':'水',
'鲿':'水',
'鱨':'水',
'鹲':'水',
'鸏':'水',
'鹱':'水',
'鸌':'水',
'酅':'水',
'鳠':'水',
'鱯':'水',
'蘼':'水',
'鳤':'水',
'齇':'水',
'觿':'水',
'鸑':'水',
'瓛':'水',
'欛':'水',
'鑮':'水',
'鼈':'水',
'曯':'水',
'齹':'水',
'黵':'水',
'鸐':'水',
'齻':'水',
'戅':'水',
'蘹':'水',
'蘾':'水',
'讙':'水',
'貛':'水',
'酄':'水',
'讗':'水',
'蘻':'水',
'虀':'水',
'覊':'水',
'躤':'水',
'麡':'水',
'襺':'水',
'鑯':'水',
'鑳':'水',
'釂':'水',
'龣':'水',
'矡':'水',
'矙':'水',
'欗':'水',
'灡':'水',
'灠':'水',
'爤':'水',
'顲':'水',
'欙':'水',
'蘱':'水',
'蘽':'水',
'攭':'水',
'欚':'水',
'纚':'水',
'羉':'水',
'纙':'水',
'鸍':'水',
'饝':'水',
'臡':'水',
'鸋':'水',
'讘':'水',
'躣':'水',
'鱬':'水',
'籭':'水',
'襹':'水',
'躢':'水',
'矘':'水',
'鼟':'水',
'糶':'水',
'隵':'水',
'鱮':'水',
'礹':'水',
'襼':'水',
'齸':'水',
'鸎':'水',
'鸒':'水',
'襸':'水',
'斸':'水',
'欘':'水',
'灟':'水',
'爥':'水',
'齺':'水',
'籫':'水',
'驴':'木',
'驢':'木',
'逻':'木',
'邏':'木',
'馋':'木',
'饞':'木',
'湾':'木',
'灣':'木',
'瞩':'木',
'矚':'木',
'郦':'木',
'酈':'木',
'逦':'木',
'邐':'木',
'镊':'木',
'鑷':'木',
'镩':'木',
'鑹':'木',
'鞯':'木',
'韉':'木',
'趱':'木',
'趲':'木',
'躜':'木',
'躦':'木',
'攮':'木',
'酾':'木',
'釃':'木',
'黡':'木',
'黶':'木',
'酂':'木',
'酇':'木',
'彟':'木',
'彠':'木',
'蠼':'木',
'鱲':'木',
'鸔':'水',
'鼊':'木',
'鑶':'木',
'氎':'木',
'靊':'木',
'鑵':'木',
'鑴':'木',
'虃':'木',
'鱳':'木',
'鑸':'木',
'鸓':'水',
'鱱':'木',
'驡':'木',
'虂':'木',
'髗':'木',
'釄':'木',
'鱴':'木',
'欜':'木',
'灢':'木',
'鑺':'木',
'虪':'木',
'驣':'木',
'矖':'木',
'躧':'木',
'饟':'木',
'鱶':'木',
'龤':'木',
'驠':'木',
'讛':'木',
'籯':'木',
'欝':'木',
'龥':'木',
'籰':'木',
'讚':'木',
'鱵':'木',
'钻':'火',
'鑽':'火',
'凿':'火',
'鑿':'火',
'缆':'火',
'纜':'火',
'锣':'火',
'鑼':'火',
'躏':'火',
'躪':'火',
'鸬':'火',
'鸕':'水',
'阄':'火',
'鬮':'火',
'谠':'火',
'讜':'火',
'鲈':'水',
'鱸':'火',
'滦':'火',
'灤':'火',
'酽':'火',
'釅':'火',
'銮':'火',
'鑾':'火',
'谳':'火',
'讞':'火',
'颞':'火',
'顳':'火',
'骥':'水',
'驥':'火',
'黩':'火',
'黷':'火',
'骧':'水',
'驤':'火',
'颧':'火',
'顴':'火',
'骦':'火',
'驦':'火',
'虉':'火',
'飍':'火',
'犫':'火',
'鱷':'火',
'飝':'火',
'飌':'火',
'鸖':'水',
'蠽':'火',
'貜':'火',
'躩':'火',
'驧':'火',
'糷':'火',
'纝':'火',
'虆':'火',
'靋':'火',
'轥':'火',
'鸗':'水',
'齈':'火',
'鑻':'火',
'虇':'火',
'鬤':'火',
'灦':'火',
'虈':'火',
'馫':'火',
'灥':'火',
'灎':'火',
'豓':'火',
'軉':'火',
'讝':'火',
'蠾':'火',
'鹦':'土',
'鸚':'水',
'棂':'土',
'欞':'土',
'滟':'土',
'灧':'土',
'戆':'土',
'戇':'土',
'镋':'土',
'钂':'土',
'鹴':'土',
'鸘':'水',
'齼':'土',
'灨':'土',
'驩':'土',
'雧':'土',
'齽':'土',
'钁':'土',
'鼺':'土',
'爧':'土',
'麢':'土',
'黸':'土',
'癴':'土',
'饠':'土',
'钀':'土',
'驨':'土',
'豔':'土',
'鸙':'水',
'饡':'土',
'蠿':'土',
'鬱':'金',
'骊':'水',
'驪':'金',
'鹳':'金',
'鸛':'水',
'爨':'金',
'讟':'金',
'麷':'金',
'鱹':'金',
'躨':'金',
'纞':'金',
'虊':'金',
'鸜':'水',
'钃':'金',
'鸾':'火',
'鸞':'水',
'鹂':'水',
'鸝':'水',
'鲡':'水',
'鱺':'水',
'馕':'水',
'饢':'水',
'骉':'水',
'驫':'水',
'韊':'水',
'癵':'水',
'厵':'水',
'籱':'水',
'虌':'木',
'虋':'木',
'麣':'木',
'吁':'火',
'籲':'火',
'龖':'火',
'灩':'火',
'麤':'土',
'龗':'土',
'鱻':'土',
'灪':'土',
'爩':'土',
'齾':'水',
'齉':'木',
'靐':'金',
'龘':'土'
};

/* ===== ZODIAC_YJ (from ZODIAC_YJ.js) ===== */
const ZODIAC_YJ = {
  '鼠': {
    宜: ['水','雨','冫','氵','鱼','鼠','豆','米','禾','口','宀','心','忄','月','彡','巾','衣','衤','采','门','申','辰','丑'],
    忌: ['火','灬','日','马','午','兔','卯','羊','未','人','亻','刀','刂','力','山','皮','石','土','田','辶','廴','走']
  },
  '牛': {
    宜: ['水','氵','艹','草','宀','车','田','禾','豆','米','口','心','忄','冫','雨','鱼','申','酉','丑','子'],
    忌: ['羊','未','马','午','心','忄','彡','刀','刂','力','日','灬','火','人','亻','大','王','君','帝']
  },
  '虎': {
    宜: ['木','山','王','犬','犬','马','午','戌','大','口','木','林','森','心','忄','衣','衤','彡','巾','采','禾','米'],
    忌: ['蛇','巳','猴','申','人','亻','口','日','灬','火','刀','刂','力','皮','石','土','田','辶','廴']
  },
  '兔': {
    宜: ['木','艹','禾','米','口','宀','衣','衤','彡','巾','采','心','忄','月','豆','鱼','亥','未','戌'],
    忌: ['酉','鸡','金','钅','刀','力','石','山','日','灬','火','人','亻','皮','土','田','辶','廴','走']
  },
  '龙': {
    宜: ['水','雨','大','王','星','日','月','星','氵','冫','鱼','申','子','辰','酉','心','忄','衣','衤','彡','巾','采'],
    忌: ['狗','戌','兔','卯','山','丘','田','土','人','亻','刀','刂','力','辶','廴','走','皮','石']
  },
  '蛇': {
    宜: ['木','艹','口','宀','心','忄','衣','衤','彡','巾','采','禾','米','豆','鱼','月','酉','丑','申'],
    忌: ['虎','寅','猪','亥','日','灬','火','人','亻','刀','刂','力','山','石','土','田','辶','廴','走']
  },
  '马': {
    宜: ['木','艹','火','灬','日','心','忄','衣','衤','彡','巾','采','禾','米','豆','鱼','寅','戌','未'],
    忌: ['鼠','子','牛','丑','水','氵','田','山','石','人','亻','刀','刂','力','雨','鱼','皮','土','辶','廴']
  },
  '羊': {
    宜: ['木','艹','禾','米','口','宀','心','忄','衣','衤','彡','巾','采','豆','鱼','月','亥','卯','午'],
    忌: ['牛','丑','鼠','子','刀','力','刂','火','灬','日','人','亻','山','石','土','田','辶','廴','走']
  },
  '猴': {
    宜: ['金','钅','玉','王','口','宀','心','忄','彡','巾','衣','衤','采','禾','米','豆','鱼','巳','酉','丑'],
    忌: ['虎','寅','猪','亥','火','灬','日','刀','力','刂','人','亻','山','石','土','田','辶','廴','走']
  },
  '鸡': {
    宜: ['金','钅','玉','王','禾','米','豆','虫','宀','心','忄','彡','巾','衣','衤','采','口','月','巳','酉','丑','辰'],
    忌: ['兔','卯','狗','戌','大','刀','力','火','灬','日','人','亻','山','石','土','田','辶','廴','走']
  },
  '狗': {
    宜: ['木','艹','禾','米','豆','口','宀','心','忄','彡','巾','衣','衤','采','鱼','月','寅','午','戌','卯'],
    忌: ['龙','辰','鸡','酉','牛','丑','刀','力','刂','火','灬','日','人','亻','山','石','土','田','辶','廴']
  },
  '猪': {
    宜: ['木','艹','禾','米','豆','口','宀','心','忄','衣','衤','彡','巾','采','鱼','月','亥','卯','未','寅'],
    忌: ['蛇','巳','猴','申','刀','力','刂','山','石','土','田','人','亻','火','灬','日','辶','廴','走']
  }
};

/* ===== ZW_FU_EXT (from ZW_FU_EXT.js) ===== */
const ZW_FU_EXT = {
  '擎羊': [
    '擎羊入{宫}——刑伤之星，此域多波折，宜化解不宜硬碰',
    '擎羊坐{宫}——刚烈之象，此域易有争端，宜以柔克刚',
    '擎羊临{宫}——煞气外显，此域需忍耐，忌冲动行事'
  ],
  '陀罗': [
    '陀罗入{宫}——拖延之星，此域进展缓慢，宜耐心等待',
    '陀罗坐{宫}——纠缠之象，此域多反复，宜简化处理',
    '陀罗临{宫}——暗耗之星，此域精力分散，宜集中突破'
  ],
  '火星': [
    '火星入{宫}——暴烈之星，此域多突发，宜冷静应对',
    '火星坐{宫}——急躁之象，此域易冲动，宜三思后行',
    '火星临{宫}——火爆之星，此域多争执，宜退让化解'
  ],
  '铃星': [
    '铃星入{宫}——暗火之星，此域多隐忧，宜提前防范',
    '铃星坐{宫}——闷热之象，此域多烦闷，宜通风透气',
    '铃星临{宫}——潜伏之星，此域多暗流，宜静观其变'
  ],
  '地空': [
    '地空入{宫}——虚空之星，此域多空想，宜脚踏实地',
    '地空坐{宫}——理想之象，此域多幻想，宜务实行事',
    '地空临{宫}——空灵之星，此域多灵感，宜把握创意'
  ],
  '地劫': [
    '地劫入{宫}——劫夺之星，此域多损失，宜谨慎理财',
    '地劫坐{宫}——消耗之象，此域多破耗，宜节俭持家',
    '地劫临{宫}——动荡之星，此域多变故，宜稳中求进'
  ],
  '天魁': [
    '天魁入{宫}——贵人星，此域多助力，宜广结善缘',
    '天魁坐{宫}——阳贵之象，此域逢凶化吉，宜主动求助',
    '天魁临{宫}——天助之星，此域多机遇，宜把握时机'
  ],
  '天钺': [
    '天钺入{宫}——阴贵星，此域多暗助，宜感恩回报',
    '天钺坐{宫}——暗助之象，此域有人提携，宜虚心接受',
    '天钺临{宫}——暗贵之星，此域多贵人，宜惜缘惜福'
  ],
  '红鸾': [
    '红鸾入{宫}——婚恋之星，此域多桃花，宜慎重择偶',
    '红鸾坐{宫}——喜庆之象，此域多喜事，宜积极社交',
    '红鸾临{宫}——姻缘之星，此域多缘分，宜把握良缘'
  ],
  '天喜': [
    '天喜入{宫}——喜庆之星，此域多欢乐，宜分享喜悦',
    '天喜坐{宫}——快乐之象，此域多好事，宜保持乐观',
    '天喜临{宫}——福气之星，此域多好运，宜积德行善'
  ],
  '天姚': [
    '天姚入{宫}——桃花之星，此域多魅力，宜洁身自好',
    '天姚坐{宫}——风流之象，此域多诱惑，宜把持定力',
    '天姚临{宫}——才艺之星，此域多才情，宜展现才华'
  ]
};

/* ===== SHENSHA_EXT (from SHENSHA_EXT.js) ===== */
const SHENSHA_EXT = {
  '天乙贵人': {
    check: (dg, yz) => {
      const map = {'甲':'未','乙':'申','丙':'酉','丁':'亥','戊':'子','己':'丑','庚':'寅','辛':'卯','壬':'巳','癸':'巳'};
      const mv = map[dg];
      return mv ? [yz.includes(mv)] : [false];
    },
    desc: '逢凶化吉之星，有贵人相助',
    tag: '贵'
  },
  '文昌贵人': {
    check: (dg, yz) => {
      const map = {'甲':'巳','乙':'午','丙':'申','丁':'酉','戊':'申','己':'酉','庚':'亥','辛':'子','壬':'寅','癸':'卯'};
      const mv = map[dg];
      return mv ? [yz.includes(mv)] : [false];
    },
    desc: '利学业考试，文思敏捷',
    tag: '文'
  },
  '驿马': {
    check: (dg, yz) => {
      const map = {'子':'寅','丑':'亥','寅':'申','卯':'巳','辰':'寅','巳':'亥','午':'申','未':'巳','申':'寅','酉':'亥','戌':'申','亥':'巳'};
      const yBranch = yz.slice(-1);
      const mBranch = yz.length >= 2 ? yz.slice(-2, -1) : '';
      const mv = map[mBranch] || map[yBranch];
      return mv ? [yz.includes(mv)] : [false];
    },
    desc: '奔波变动之星，宜出行闯荡',
    tag: '动'
  },
  '桃花': {
    check: (dg, yz) => {
      const map = {'子':'酉','丑':'午','寅':'卯','卯':'子','辰':'酉','巳':'午','午':'卯','未':'子','申':'酉','酉':'午','戌':'卯','亥':'子'};
      const yBranch = yz.slice(-1);
      const mv = map[yBranch];
      return mv ? [yz.includes(mv)] : [false];
    },
    desc: '异性缘之星，多桃花运',
    tag: '情'
  },
  '羊刃': {
    check: (dg, yz) => {
      const map = {'甲':'卯','乙':'寅','丙':'午','丁':'巳','戊':'午','己':'巳','庚':'酉','辛':'申','壬':'子','癸':'亥'};
      const mv = map[dg];
      return mv ? [yz.includes(mv)] : [false];
    },
    desc: '刚烈之星，多主血光或竞争',
    tag: '刃'
  },
  '将星': {
    check: (dg, yz) => {
      const map = {'子':'子','丑':'酉','寅':'午','卯':'卯','辰':'子','巳':'酉','午':'午','未':'卯','申':'子','酉':'酉','戌':'午','亥':'卯'};
      const yBranch = yz.slice(-1);
      const mv = map[yBranch];
      return mv ? [yz.includes(mv)] : [false];
    },
    desc: '领导之星，有权威气魄',
    tag: '将'
  },
  '华盖': {
    check: (dg, yz) => {
      const map = {'子':'辰','丑':'丑','寅':'戌','卯':'未','辰':'辰','巳':'丑','午':'戌','未':'未','申':'辰','酉':'丑','戌':'戌','亥':'未'};
      const yBranch = yz.slice(-1);
      const mv = map[yBranch];
      return mv ? [yz.includes(mv)] : [false];
    },
    desc: '孤高之星，利学术宗教',
    tag: '艺'
  },
  '天德': {
    check: (dg, yz) => {
      const map = {'甲':'未','乙':'申','丙':'酉','丁':'亥','戊':'子','己':'丑','庚':'寅','辛':'卯','壬':'巳','癸':'午'};
      const mv = map[dg];
      return mv ? [yz.includes(mv)] : [false];
    },
    desc: '天佑之星，逢凶化吉',
    tag: '德'
  },
  '月德': {
    check: (dg, yz) => {
      const map = {'甲':'丙','乙':'甲','丙':'壬','丁':'庚','戊':'丙','己':'甲','庚':'壬','辛':'庚','壬':'丙','癸':'甲'};
      const mv = map[dg];
      return mv ? [yz.includes(mv)] : [false];
    },
    desc: '月佑之星，贵人相助',
    tag: '德'
  },
  '劫煞': {
    check: (dg, yz) => {
      const map = {'子':'巳','丑':'寅','寅':'亥','卯':'申','辰':'巳','巳':'寅','午':'亥','未':'申','申':'巳','酉':'寅','戌':'亥','亥':'申'};
      const yBranch = yz.slice(-1);
      const mv = map[yBranch];
      return mv ? [yz.includes(mv)] : [false];
    },
    desc: '劫夺之星，多主破耗',
    tag: '劫'
  },
  '亡神': {
    check: (dg, yz) => {
      const map = {'子':'亥','丑':'申','寅':'巳','卯':'寅','辰':'亥','巳':'申','午':'巳','未':'寅','申':'亥','酉':'申','戌':'巳','亥':'寅'};
      const yBranch = yz.slice(-1);
      const mv = map[yBranch];
      return mv ? [yz.includes(mv)] : [false];
    },
    desc: '耗散之星，多主损失',
    tag: '耗'
  },
  '天医': {
    check: (dg, yz) => {
      const map = {'子':'丑','丑':'寅','寅':'卯','卯':'辰','辰':'巳','巳':'午','午':'未','未':'申','申':'酉','酉':'戌','戌':'亥','亥':'子'};
      const mBranch = yz.length >= 2 ? yz.slice(-2, -1) : yz.slice(-1);
      const mv = map[mBranch];
      return mv ? [yz.includes(mv)] : [false];
    },
    desc: '医术之星，利从事医疗',
    tag: '医'
  },
  '金舆': {
    check: (dg, yz) => {
      const map = {'甲':'辰','乙':'巳','丙':'未','丁':'申','戊':'未','己':'申','庚':'戌','辛':'亥','壬':'丑','癸':'寅'};
      const mv = map[dg];
      return mv ? [yz.includes(mv)] : [false];
    },
    desc: '富贵之星，多主有车有宅',
    tag: '禄'
  },
  '红艳': {
    check: (dg, yz) => {
      const map = {'甲':'午','乙':'申','丙':'寅','丁':'未','戊':'辰','己':'辰','庚':'戌','辛':'酉','壬':'子','癸':'申'};
      const mv = map[dg];
      return mv ? [yz.includes(mv)] : [false];
    },
    desc: '艳丽之星，多主风流多情',
    tag: '艳'
  },
  '流霞': {
    check: (dg, yz) => {
      const map = {'甲':'酉','乙':'戌','丙':'未','丁':'申','戊':'午','己':'巳','庚':'辰','辛':'卯','壬':'寅','癸':'丑'};
      const mv = map[dg];
      return mv ? [yz.includes(mv)] : [false];
    },
    desc: '血光之星，多主意外受伤',
    tag: '血'
  },
  '孤辰': {
    check: (dg, yz) => {
      const map = {'寅':'巳','卯':'巳','巳':'申','午':'申','申':'亥','酉':'亥','亥':'寅','子':'寅'};
      const yBranch = yz.slice(-1);
      const mv = map[yBranch];
      return mv ? [yz.includes(mv)] : [false];
    },
    desc: '孤独之星，多主性格孤僻',
    tag: '孤'
  },
  '寡宿': {
    check: (dg, yz) => {
      const map = {'寅':'丑','卯':'丑','巳':'辰','午':'辰','申':'未','酉':'未','亥':'戌','子':'戌'};
      const yBranch = yz.slice(-1);
      const mv = map[yBranch];
      return mv ? [yz.includes(mv)] : [false];
    },
    desc: '孤寡之星，多主独处',
    tag: '孤'
  },
  '天喜神': {
    check: (dg, yz) => {
      const map = {'子':'酉','丑':'午','寅':'卯','卯':'子','辰':'酉','巳':'午','午':'卯','未':'子','申':'酉','酉':'午','戌':'卯','亥':'子'};
      const yBranch = yz.slice(-1);
      const mv = map[yBranch];
      return mv ? [yz.includes(mv)] : [false];
    },
    desc: '喜庆之星，多主喜事临门',
    tag: '喜'
  }
};

/* ===== NA_YIN_READING + NA_YIN_30 (from NA_YIN_READING.js) ===== */
const NA_YIN_READING = {
  '金': {
    寓意: '刚毅果决，义理分明',
    意象: '剑戟之金，锋利刚强；首饰之金，温润华贵',
    取名: '宜配土生金，忌火克金',
    性格: '刚毅果断，有决断力，但易冲动',
    事业: '适合金融、法律、军警、工程技术',
    健康: '注意肺部、呼吸系统'
  },
  '木': {
    寓意: '生长向上，仁慈宽厚',
    意象: '参天大树，栋梁之材；花草之木，柔美多姿',
    取名: '宜配水生木，忌金克木',
    性格: '仁慈善良，有同情心，但易优柔',
    事业: '适合教育、文化、医疗、农业',
    健康: '注意肝胆、筋骨'
  },
  '水': {
    寓意: '智慧灵动，润物无声',
    意象: '江河之水，奔流不息；雨露之水，滋润万物',
    取名: '宜配金生水，忌土克水',
    性格: '聪明机智，有创造力，但易多变',
    事业: '适合传媒、艺术、物流、旅游',
    健康: '注意肾脏、泌尿系统'
  },
  '火': {
    寓意: '光明热情，礼仪文明',
    意象: '太阳之火，照耀万物；灯烛之火，温暖人心',
    取名: '宜配木生火，忌水克火',
    性格: '热情开朗，有领导力，但易急躁',
    事业: '适合娱乐、餐饮、能源、互联网',
    健康: '注意心脏、血液循环'
  },
  '土': {
    寓意: '厚重包容，信实可靠',
    意象: '大地之土，承载万物；田园之土，滋养生命',
    取名: '宜配火生土，忌木克土',
    性格: '稳重踏实，有责任心，但易固执',
    事业: '适合房地产、建筑、农业、矿业',
    健康: '注意脾胃、消化系统'
  }
};

const NA_YIN_30 = {
  '甲子乙丑': { name: '海中金', desc: '深藏不露，潜力无穷', advice: '宜沉潜积累，忌锋芒太露' },
  '丙寅丁卯': { name: '炉中火', desc: '热烈旺盛，创造之力', advice: '宜发挥热情，忌急躁冒进' },
  '戊辰己巳': { name: '大林木', desc: '枝繁叶茂，生机勃勃', advice: '宜拓展人脉，忌闭门造车' },
  '庚午辛未': { name: '路旁土', desc: '承载万物，踏实稳重', advice: '宜坚守本分，忌好高骛远' },
  '壬申癸酉': { name: '剑锋金', desc: '锋利刚毅，果断决绝', advice: '宜果断行动，忌犹豫不决' },
  '甲戌乙亥': { name: '山头火', desc: '高瞻远瞩，光明磊落', advice: '宜居高临下，忌目中无人' },
  '丙子丁丑': { name: '涧下水', desc: '清澈纯净，智慧内敛', advice: '宜深思熟虑，忌浅尝辄止' },
  '戊寅己卯': { name: '城头土', desc: '坚固稳固，防御有方', advice: '宜巩固基础，忌急功近利' },
  '庚辰辛巳': { name: '白蜡金', desc: '温润如玉，内敛含蓄', advice: '宜修身养性，忌张扬跋扈' },
  '壬午癸未': { name: '杨柳木', desc: '柔韧随和，适应力强', advice: '宜顺势而为，忌刚愎自用' },
  '甲申乙酉': { name: '泉中水', desc: '源源不断，活力充沛', advice: '宜持续努力，忌半途而废' },
  '丙戌丁亥': { name: '屋上土', desc: '遮风挡雨，守护家园', advice: '宜安居乐业，忌漂泊不定' },
  '戊子己丑': { name: '霹雳火', desc: '雷霆万钧，势不可挡', advice: '宜把握时机，忌错失良机' },
  '庚寅辛卯': { name: '松柏木', desc: '坚韧不拔，四季常青', advice: '宜坚守信念，忌随波逐流' },
  '壬辰癸巳': { name: '长流水', desc: '奔流不息，勇往直前', advice: '宜勇往直前，忌停滞不前' },
  '甲午乙未': { name: '沙中金', desc: '内藏珍宝，待时而发', advice: '宜等待时机，忌急于求成' },
  '丙申丁酉': { name: '山下火', desc: '内敛含蓄，厚积薄发', advice: '宜韬光养晦，忌锋芒太露' },
  '戊戌己亥': { name: '平地木', desc: '扎根大地，稳步成长', advice: '宜脚踏实地，忌好高骛远' },
  '庚子辛丑': { name: '壁上土', desc: '依附依托，借势而行', advice: '宜借力打力，忌独立难支' },
  '壬寅癸卯': { name: '金箔金', desc: '华丽外表，内在充实', advice: '宜内外兼修，忌虚有其表' },
  '甲辰乙巳': { name: '覆灯火', desc: '照亮黑暗，指引方向', advice: '宜助人为乐，忌独善其身' },
  '丙午丁未': { name: '天河水', desc: '恩泽万物，博大胸怀', advice: '宜广施恩惠，忌小气吝啬' },
  '戊申己酉': { name: '大驿土', desc: '四通八达，包容万象', advice: '宜开放包容，忌闭关自守' },
  '庚戌辛亥': { name: '钗钏金', desc: '精致优雅，品味不凡', advice: '宜提升品味，忌粗俗不堪' },
  '壬子癸丑': { name: '桑柘木', desc: '脚踏实地，勤劳务实', advice: '宜勤劳致富，忌懒惰懈怠' },
  '甲寅乙卯': { name: '大溪水', desc: '清澈见底，坦荡磊落', advice: '宜坦诚相待，忌虚伪欺诈' },
  '丙辰丁巳': { name: '沙中土', desc: '默默无闻，厚积薄发', advice: '宜耐心等待，忌急于求成' },
  '戊午己未': { name: '天上火', desc: '光芒万丈，照耀四方', advice: '宜发挥才能，忌韬光养晦' },
  '庚申辛酉': { name: '石榴木', desc: '硕果累累，收获丰盛', advice: '宜收获成果，忌贪得无厌' },
  '壬戌癸亥': { name: '大海水', desc: '浩瀚无边，包容万物', advice: '宜胸怀天下，忌目光短浅' }
};

/* ===== NAME_PINGZE + PINGZE_CATEGORY + funcs (from PINGZE.js) ===== */
const NAME_PINGZE = {
  '明':'平','华':'平','伟':'仄','强':'平','军':'平','磊':'仄','涛':'平','杰':'平',
  '静':'仄','艳':'仄','丽':'仄','芳':'平','秀':'仄','英':'平','兰':'平','梅':'平',
  '竹':'平','菊':'平','松':'平','柏':'平','桃':'平','李':'仄','杨':'平','柳':'仄',
  '红':'平','绿':'仄','青':'平','白':'平','金':'平','银':'平','玉':'仄','石':'平',
  '志':'仄','文':'平','建':'仄','国':'仄','斌':'平','波':'平','勇':'仄','毅':'仄',
  '俊':'仄','豪':'平','峰':'平','刚':'平','健':'仄','飞':'平','龙':'平','凤':'仄',
  '慧':'仄','敏':'仄','婷':'平','琳':'平','琪':'平','瑶':'平','瑾':'仄','璇':'平',
  '宇':'仄','轩':'平','浩':'平','泽':'平','润':'仄','涵':'平','清':'平','源':'平',
  '晨':'平','旭':'仄','阳':'平','明':'平','光':'平','辉':'平','耀':'仄','亮':'仄',
  '嘉':'平','欣':'平','怡':'平','悦':'仄','馨':'平','菲':'平','蕾':'仄','蕊':'仄',
  '雅':'仄','诗':'平','书':'平','画':'仄','琴':'平','棋':'平','墨':'仄','砚':'仄',
  '天':'平','地':'仄','人':'平','和':'平','顺':'仄','安':'平','康':'平','宁':'平',
  '富':'仄','贵':'仄','荣':'平','华':'平','福':'仄','禄':'仄','寿':'仄','喜':'仄',
  '仁':'平','义':'仄','礼':'仄','智':'仄','信':'仄','忠':'平','孝':'仄','悌':'仄',
  '云':'平','霞':'平','虹':'平','雪':'仄','冰':'平','霜':'平','露':'仄','雷':'平',
  '风':'平','花':'平','雪':'仄','月':'仄','星':'平','辰':'平','景':'仄','色':'仄',
  '山':'平','河':'平','湖':'平','海':'仄','江':'平','泉':'平','溪':'平','林':'平',
  '森':'平','木':'仄','花':'平','草':'仄','叶':'仄','枝':'平','根':'平','苗':'平',
  '龙':'平','虎':'仄','豹':'仄','鹰':'平','燕':'仄','鹤':'仄','鹿':'仄','麟':'平',
  '珠':'平','宝':'仄','玉':'仄','石':'平','金':'平','银':'平','铜':'平','铁':'仄',
  '建':'仄','国':'仄','强':'平','伟':'仄','杰':'平','英':'平','豪':'平','雄':'平',
  '芳':'平','英':'平','华':'平','丽':'仄','美':'仄','佳':'平','好':'仄','善':'仄',
  '文':'平','武':'仄','德':'仄','才':'平','学':'仄','问':'仄','智':'仄','慧':'仄',
  '忠':'平','孝':'仄','节':'仄','义':'仄','礼':'仄','仁':'平','爱':'仄','和':'平',
  '平':'平','安':'平','康':'平','宁':'平','泰':'仄','顺':'仄','昌':'平','盛':'仄',
  '金':'平','木':'仄','水':'仄','火':'仄','土':'仄','风':'平','雨':'仄','雷':'平',
  '日':'仄','月':'仄','星':'平','辰':'平','光':'平','辉':'平','明':'平','亮':'仄',
  '春':'平','夏':'仄','秋':'平','冬':'平','东':'平','西':'平','南':'平','北':'仄',
  '龙':'平','凤':'仄','龟':'平','麟':'平','马':'仄','牛':'平','羊':'平','犬':'仄',
  '梅':'平','兰':'平','竹':'平','菊':'仄','松':'平','柏':'仄','柳':'仄','杨':'平',
  '鸿':'平','雁':'仄','鹤':'仄','莺':'平','燕':'仄','凤':'仄','凰':'平','鹏':'平',
  '琪':'平','瑶':'平','琳':'平','瑾':'仄','璇':'平','玉':'仄','珠':'平','宝':'仄',
  '云':'平','龙':'平','虎':'仄','豹':'仄','鹰':'平','鹏':'平','凤':'仄','凰':'平',
  '志':'仄','诚':'平','毅':'仄','恒':'平','坚':'平','强':'平','刚':'平','毅':'仄',
  '敏':'仄','捷':'仄','快':'仄','速':'仄','疾':'仄','迅':'仄','驰':'平','奔':'平',
  '深':'平','远':'仄','高':'平','大':'仄','广':'仄','阔':'仄','宽':'平','宏':'平',
  '明':'平','亮':'仄','光':'平','辉':'平','耀':'仄','灿':'仄','烂':'仄','煌':'平',
  '温':'平','柔':'平','和':'平','平':'平','安':'平','康':'平','宁':'平','泰':'仄',
  '仁':'平','慈':'平','善':'仄','良':'平','宽':'平','厚':'仄','诚':'平','信':'仄',
  '智':'仄','慧':'仄','聪':'平','明':'平','睿':'仄','哲':'仄','思':'平','想':'仄',
  '英':'平','雄':'平','豪':'平','杰':'平','勇':'仄','毅':'仄','刚':'平','强':'平',
  '秀':'仄','丽':'仄','美':'仄','佳':'平','好':'仄','善':'仄','真':'平','纯':'平',
  '忠':'平','孝':'仄','节':'仄','义':'仄','礼':'仄','仁':'平','爱':'仄','和':'平',
  '文':'平','武':'仄','德':'仄','才':'平','学':'仄','问':'仄','智':'仄','慧':'仄',
  '金':'平','银':'平','玉':'仄','石':'平','珠':'平','宝':'仄','琪':'平','瑶':'平',
  '龙':'平','虎':'仄','凤':'仄','凰':'平','鹏':'平','鸿':'平','鹤':'仄','麟':'平',
  '山':'平','河':'平','湖':'平','海':'仄','江':'平','泉':'平','溪':'平','林':'平',
  '春':'平','夏':'仄','秋':'平','冬':'平','风':'平','花':'平','雪':'仄','月':'仄',
  '日':'仄','月':'仄','星':'平','辰':'平','光':'平','辉':'平','明':'平','亮':'仄',
  '天':'平','地':'仄','人':'平','和':'平','顺':'仄','安':'平','康':'平','宁':'平',
  '富':'仄','贵':'仄','荣':'平','华':'平','福':'仄','禄':'仄','寿':'仄','喜':'仄',
  '仁':'平','义':'仄','礼':'仄','智':'仄','信':'仄','忠':'平','孝':'仄','悌':'仄',
  '云':'平','霞':'平','虹':'平','雪':'仄','冰':'平','霜':'平','露':'仄','雷':'平',
  '风':'平','花':'平','雪':'仄','月':'仄','星':'平','辰':'平','景':'仄','色':'仄',
  '山':'平','河':'平','湖':'平','海':'仄','江':'平','泉':'平','溪':'平','林':'平',
  '森':'平','木':'仄','花':'平','草':'仄','叶':'仄','枝':'平','根':'平','苗':'平',
  '龙':'平','虎':'仄','豹':'仄','鹰':'平','燕':'仄','鹤':'仄','鹿':'仄','麟':'平',
  '珠':'平','宝':'仄','玉':'仄','石':'平','金':'平','银':'平','铜':'平','铁':'仄',
  '建':'仄','国':'仄','强':'平','伟':'仄','杰':'平','英':'平','豪':'平','雄':'平',
  '芳':'平','英':'平','华':'平','丽':'仄','美':'仄','佳':'平','好':'仄','善':'仄',
  '文':'平','武':'仄','德':'仄','才':'平','学':'仄','问':'仄','智':'仄','慧':'仄',
  '忠':'平','孝':'仄','节':'仄','义':'仄','礼':'仄','仁':'平','爱':'仄','和':'平',
  '平':'平','安':'平','康':'平','宁':'平','泰':'仄','顺':'仄','昌':'平','盛':'仄'
};

const PINGZE_CATEGORY = {
  '平': { desc: '柔和、流畅、安定', symbol: '○', color: 'blue' },
  '仄': { desc: '刚强、顿挫、变化', symbol: '●', color: 'red' }
};

function getPingZe(char) {
  if (NAME_PINGZE[char]) {
    return NAME_PINGZE[char];
  }
  const pingChars = '天地人和水山风花雪月春秋冬夏东西南北金银铜铁玉石珍珠琪琳瑶瑾梅兰竹菊松柏桃李杨柳';
  const zeChars = '力量剑锋刚烈猛勇威武烈焰炎火爆炎热烈';
  if (pingChars.includes(char)) return '平';
  if (zeChars.includes(char)) return '仄';
  return '平';
}

function getPingZeDetail(char) {
  const pz = getPingZe(char);
  const info = PINGZE_CATEGORY[pz];
  return { char, pingZe: pz, desc: info.desc, symbol: info.symbol };
}

function analyzeNamePingZe(name) {
  const result = [];
  for (const char of name) {
    result.push(getPingZeDetail(char));
  }
  const pingCount = result.filter(r => r.pingZe === '平').length;
  const zeCount = result.filter(r => r.pingZe === '仄').length;
  const pattern = result.map(r => r.symbol).join('');
  let balance = '';
  if (pingCount > zeCount) balance = '平声为主，性情温和';
  else if (zeCount > pingCount) balance = '仄声为主，性格刚强';
  else balance = '平仄均衡，刚柔并济';
  return { chars: result, pingCount, zeCount, pattern, balance };
}

/* ===== RADICAL_MEANING + funcs (from RADICAL_MEANING.js) ===== */
const RADICAL_MEANING = {
  '木': { meaning: '树木、生长、向上', wuXing: '木', jiXiong: '吉', desc: '主仁慈、生长、发展' },
  '水': { meaning: '水流、流动、智慧', wuXing: '水', jiXiong: '吉', desc: '主智慧、灵活、流动' },
  '火': { meaning: '火焰、光明、热情', wuXing: '火', jiXiong: '吉', desc: '主热情、光明、礼仪' },
  '金': { meaning: '金属、坚硬、锋利', wuXing: '金', jiXiong: '中', desc: '主刚毅、果断、义气' },
  '土': { meaning: '土地、厚重、承载', wuXing: '土', jiXiong: '吉', desc: '主稳重、包容、信实' },
  '人': { meaning: '人物、仁爱、互助', wuXing: '土', jiXiong: '吉', desc: '主仁慈、互助、社会' },
  '亻': { meaning: '人物、仁爱、互助', wuXing: '土', jiXiong: '吉', desc: '主仁慈、互助、社会' },
  '口': { meaning: '口舌、言语、饮食', wuXing: '金', jiXiong: '中', desc: '主言语、沟通、饮食' },
  '心': { meaning: '心灵、思想、情感', wuXing: '火', jiXiong: '吉', desc: '主情感、思想、内在' },
  '忄': { meaning: '心灵、思想、情感', wuXing: '火', jiXiong: '吉', desc: '主情感、思想、内在' },
  '手': { meaning: '手部、动作、技能', wuXing: '金', jiXiong: '吉', desc: '主技能、动作、实践' },
  '扌': { meaning: '手部、动作、技能', wuXing: '金', jiXiong: '吉', desc: '主技能、动作、实践' },
  '足': { meaning: '足部、行走、行动', wuXing: '水', jiXiong: '吉', desc: '主行动、进取、奔波' },
  '⻊': { meaning: '足部、行走、行动', wuXing: '水', jiXiong: '吉', desc: '主行动、进取、奔波' },
  '言': { meaning: '言语、论述、表达', wuXing: '金', jiXiong: '吉', desc: '主表达、沟通、文采' },
  '讠': { meaning: '言语、论述、表达', wuXing: '金', jiXiong: '吉', desc: '主表达、沟通、文采' },
  '玉': { meaning: '美玉、高贵、纯洁', wuXing: '土', jiXiong: '吉', desc: '主高贵、纯洁、美好' },
  '王': { meaning: '君王、统治、权威', wuXing: '土', jiXiong: '吉', desc: '主权威、领导、尊贵' },
  '山': { meaning: '山峰、高大、稳重', wuXing: '土', jiXiong: '吉', desc: '主稳重、高大、厚实' },
  '石': { meaning: '石头、坚硬、稳固', wuXing: '土', jiXiong: '中', desc: '主坚固、稳重、刚硬' },
  '田': { meaning: '田地、耕作、收获', wuXing: '土', jiXiong: '吉', desc: '主勤劳、收获、富足' },
  '日': { meaning: '太阳、光明、时间', wuXing: '火', jiXiong: '吉', desc: '主光明、热情、时间' },
  '月': { meaning: '月亮、阴柔、美丽', wuXing: '火', jiXiong: '吉', desc: '主美丽、柔和、变化' },
  '雨': { meaning: '雨露、滋润、恩泽', wuXing: '水', jiXiong: '吉', desc: '主恩泽、滋润、智慧' },
  '风': { meaning: '风、流动、变化', wuXing: '木', jiXiong: '中', desc: '主变化、流动、传播' },
  '鸟': { meaning: '鸟类、飞翔、自由', wuXing: '火', jiXiong: '吉', desc: '主自由、高远、飞翔' },
  '鱼': { meaning: '鱼类、水中、灵活', wuXing: '水', jiXiong: '吉', desc: '主灵活、富足、吉祥' },
  '虫': { meaning: '昆虫、微小、生命', wuXing: '火', jiXiong: '中', desc: '主生命力、微小、顽强' },
  '马': { meaning: '马匹、奔腾、快速', wuXing: '水', jiXiong: '吉', desc: '主快速、奔腾、成功' },
  '牛': { meaning: '牛、勤劳、坚韧', wuXing: '水', jiXiong: '吉', desc: '主勤劳、坚韧、富足' },
  '羊': { meaning: '羊、温顺、祥瑞', wuXing: '土', jiXiong: '吉', desc: '主温顺、祥瑞、善良' },
  '犬': { meaning: '狗、忠诚、守护', wuXing: '火', jiXiong: '吉', desc: '主忠诚、守护、勇敢' },
  '犭': { meaning: '狗、忠诚、守护', wuXing: '火', jiXiong: '吉', desc: '主忠诚、守护、勇敢' },
  '鹿': { meaning: '鹿、祥瑞、长寿', wuXing: '火', jiXiong: '吉', desc: '主祥瑞、长寿、优雅' },
  '龙': { meaning: '龙、尊贵、力量', wuXing: '水', jiXiong: '吉', desc: '主尊贵、力量、成功' },
  '门': { meaning: '门户、出入、家宅', wuXing: '水', jiXiong: '中', desc: '主家宅、出入、门户' },
  '车': { meaning: '车辆、运输、行动', wuXing: '金', jiXiong: '吉', desc: '主行动、运输、成功' },
  '衣': { meaning: '衣服、装饰、外表', wuXing: '火', jiXiong: '吉', desc: '主外表、装饰、礼仪' },
  '衤': { meaning: '衣服、装饰、外表', wuXing: '火', jiXiong: '吉', desc: '主外表、装饰、礼仪' },
  '示': { meaning: '祭祀、神灵、信仰', wuXing: '火', jiXiong: '吉', desc: '主信仰、神灵、庇佑' },
  '礻': { meaning: '祭祀、神灵、信仰', wuXing: '火', jiXiong: '吉', desc: '主信仰、神灵、庇佑' },
  '糸': { meaning: '丝线、连接、绵延', wuXing: '水', jiXiong: '吉', desc: '主连接、绵延、持续' },
  '纟': { meaning: '丝线、连接、绵延', wuXing: '水', jiXiong: '吉', desc: '主连接、绵延、持续' },
  '竹': { meaning: '竹子、高洁、气节', wuXing: '木', jiXiong: '吉', desc: '主高洁、气节、正直' },
  '⺮': { meaning: '竹子、高洁、气节', wuXing: '木', jiXiong: '吉', desc: '主高洁、气节、正直' },
  '艹': { meaning: '草木、生长、活力', wuXing: '木', jiXiong: '吉', desc: '主生长、活力、希望' },
  '禾': { meaning: '禾苗、收获、富足', wuXing: '木', jiXiong: '吉', desc: '主收获、富足、勤劳' },
  '米': { meaning: '稻米、粮食、丰盛', wuXing: '木', jiXiong: '吉', desc: '主丰盛、富足、温饱' },
  '豆': { meaning: '豆类、种子、生命', wuXing: '木', jiXiong: '吉', desc: '主生命力、成长、收获' },
  '贝': { meaning: '贝壳、财富、珍贵', wuXing: '金', jiXiong: '吉', desc: '主财富、珍贵、吉祥' },
  '刀': { meaning: '刀刃、锋利、果断', wuXing: '金', jiXiong: '凶', desc: '主锋利、果断、伤害' },
  '刂': { meaning: '刀刃、切割、决断', wuXing: '金', jiXiong: '凶', desc: '主决断、切割、分离' },
  '弓': { meaning: '弓箭、远射、目标', wuXing: '木', jiXiong: '中', desc: '主目标、远射、策略' },
  '力': { meaning: '力量、努力、奋斗', wuXing: '火', jiXiong: '吉', desc: '主力量、努力、成功' },
  '灬': { meaning: '火、热、光明', wuXing: '火', jiXiong: '中', desc: '主热情、光明、变化' },
  '冫': { meaning: '冰、冷、凝结', wuXing: '水', jiXiong: '凶', desc: '主寒冷、凝固、阻碍' },
  '宀': { meaning: '屋顶、家宅、安居', wuXing: '土', jiXiong: '吉', desc: '主家宅、安居、稳定' },
  '广': { meaning: '广大、宽阔、包容', wuXing: '土', jiXiong: '吉', desc: '主包容、宽阔、大度' },
  '辶': { meaning: '行走、行动、前进', wuXing: '水', jiXiong: '吉', desc: '主行动、前进、发展' },
  '廴': { meaning: '行走、长远、持续', wuXing: '水', jiXiong: '吉', desc: '主长远、持续、发展' },
  '走': { meaning: '行走、奔跑、行动', wuXing: '水', jiXiong: '吉', desc: '主行动、进取、成功' },
  '又': { meaning: '又、再、重复', wuXing: '水', jiXiong: '中', desc: '主重复、持续、积累' },
  '几': { meaning: '几、微小、隐约', wuXing: '火', jiXiong: '中', desc: '主微小、隐约、潜在' },
  '冖': { meaning: '覆盖、隐藏、保护', wuXing: '水', jiXiong: '中', desc: '主隐藏、保护、遮蔽' },
  '卩': { meaning: '跪坐、服从、礼仪', wuXing: '水', jiXiong: '中', desc: '主服从、礼仪、谦卑' },
  '厂': { meaning: '悬崖、庇护、依靠', wuXing: '土', jiXiong: '中', desc: '主庇护、依靠、安全' },
  '阝': { meaning: '城邑、地名、方位', wuXing: '土', jiXiong: '吉', desc: '主地域、方位、归属' },
  '巛': { meaning: '河流、流动、变化', wuXing: '水', jiXiong: '吉', desc: '主流动、变化、智慧' },
  '女': { meaning: '女性、柔美、孕育', wuXing: '水', jiXiong: '吉', desc: '主柔美、孕育、包容' },
  '子': { meaning: '子女、后代、传承', wuXing: '水', jiXiong: '吉', desc: '主传承、后代、延续' },
  '寸': { meaning: '寸、度量、法度', wuXing: '金', jiXiong: '中', desc: '主度量、法度、规矩' },
  '小': { meaning: '小、微小、精细', wuXing: '土', jiXiong: '中', desc: '主精细、微小、谨慎' },
  '大': { meaning: '大、宏大、伟大', wuXing: '火', jiXiong: '吉', desc: '主宏大、伟大、成功' },
  '夂': { meaning: '行走、到来、跟随', wuXing: '水', jiXiong: '中', desc: '主到来、跟随、延续' },
  '夊': { meaning: '行走、缓慢、从容', wuXing: '水', jiXiong: '中', desc: '主从容、缓慢、稳重' },
  '夕': { meaning: '傍晚、夜晚、休息', wuXing: '金', jiXiong: '中', desc: '主休息、夜晚、内省' },
  '天': { meaning: '天空、上天、命运', wuXing: '火', jiXiong: '吉', desc: '主命运、上天、恩赐' },
  '夫': { meaning: '丈夫、男子、担当', wuXing: '水', jiXiong: '吉', desc: '主担当、责任、男子' },
  '太': { meaning: '太过、极端、至尊', wuXing: '火', jiXiong: '中', desc: '主至尊、极端、过度' },
  '中': { meaning: '中间、中正、平衡', wuXing: '火', jiXiong: '吉', desc: '主平衡、中正、和谐' },
  '正': { meaning: '正直、端正、正义', wuXing: '金', jiXiong: '吉', desc: '主正直、正义、端庄' },
  '立': { meaning: '站立、建立、独立', wuXing: '火', jiXiong: '吉', desc: '主独立、建立、成就' },
  '且': { meaning: '而且、暂且、并列', wuXing: '金', jiXiong: '中', desc: '主并列、暂且、递进' },
  '世': { meaning: '世界、世代、传承', wuXing: '金', jiXiong: '吉', desc: '主传承、世代、永恒' },
  '丘': { meaning: '小山、土堆、坟墓', wuXing: '土', jiXiong: '凶', desc: '主土堆、坟墓、衰落' },
  '业': { meaning: '事业、功业、成就', wuXing: '木', jiXiong: '吉', desc: '主事业、功业、成功' },
  '东': { meaning: '东方、开始、生机', wuXing: '木', jiXiong: '吉', desc: '主开始、生机、发展' },
  '丝': { meaning: '丝线、连接、绵延', wuXing: '水', jiXiong: '吉', desc: '主连接、绵延、持续' },
  '丢': { meaning: '丢失、遗失、放弃', wuXing: '金', jiXiong: '凶', desc: '主丢失、遗失、损失' },
  '两': { meaning: '两个、双方、平衡', wuXing: '火', jiXiong: '吉', desc: '主平衡、双方、和谐' },
  '严': { meaning: '严肃、严格、严谨', wuXing: '木', jiXiong: '吉', desc: '主严谨、严肃、认真' },
  '丧': { meaning: '丧失、悲伤、哀悼', wuXing: '金', jiXiong: '凶', desc: '主丧失、悲伤、哀悼' },
  '个': { meaning: '个别、单独、自主', wuXing: '木', jiXiong: '中', desc: '主单独、自主、个性' },
  '丰': { meaning: '丰富、充沛、茂盛', wuXing: '火', jiXiong: '吉', desc: '主丰富、充沛、成功' },
  '串': { meaning: '串联、连接、贯通', wuXing: '金', jiXiong: '吉', desc: '主连接、贯通、成功' },
  '临': { meaning: '临近、面对、降临', wuXing: '火', jiXiong: '吉', desc: '主降临、面对、机遇' },
  '丸': { meaning: '丸、圆、完整', wuXing: '水', jiXiong: '吉', desc: '主完整、圆融、成功' },
  '丹': { meaning: '丹、红、赤诚', wuXing: '火', jiXiong: '吉', desc: '主赤诚、热情、成功' },
  '为': { meaning: '为了、行为、作为', wuXing: '土', jiXiong: '吉', desc: '主作为、行为、成就' },
  '主': { meaning: '主人、主导、主持', wuXing: '土', jiXiong: '吉', desc: '主主导、主持、权威' },
  '丽': { meaning: '美丽、华丽、壮丽', wuXing: '火', jiXiong: '吉', desc: '主美丽、华丽、成功' },
  '举': { meaning: '举起、推举、举动', wuXing: '木', jiXiong: '吉', desc: '主推举、举动、成功' },
  '乃': { meaning: '乃、于是、就是', wuXing: '火', jiXiong: '中', desc: '主于是、承接、递进' },
  '久': { meaning: '长久、持久、恒久', wuXing: '木', jiXiong: '吉', desc: '主持久、恒久、永恒' },
  '么': { meaning: '什么、多么、么', wuXing: '水', jiXiong: '中', desc: '主疑问、探索、好奇' },
  '之': { meaning: '之、的、往', wuXing: '火', jiXiong: '中', desc: '主连接、递进、归属' },
  '乎': { meaning: '乎、吗、呢', wuXing: '水', jiXiong: '中', desc: '主疑问、感叹、语气' },
  '乏': { meaning: '缺乏、疲乏、不足', wuXing: '金', jiXiong: '凶', desc: '主缺乏、不足、困顿' },
  '乐': { meaning: '快乐、欢乐、音乐', wuXing: '火', jiXiong: '吉', desc: '主欢乐、快乐、成功' },
  '乘': { meaning: '乘坐、利用、趁着', wuXing: '金', jiXiong: '吉', desc: '主利用、趁着、成功' },
  '乙': { meaning: '乙、第二、次等', wuXing: '木', jiXiong: '中', desc: '主次等、辅助、柔和' },
  '九': { meaning: '九、长久、极致', wuXing: '木', jiXiong: '吉', desc: '主极致、长久、成功' },
  '也': { meaning: '也、也是、同样', wuXing: '水', jiXiong: '中', desc: '主同样、并列、递进' },
  '习': { meaning: '学习、习惯、练习', wuXing: '水', jiXiong: '吉', desc: '主学习、习惯、成功' },
  '乡': { meaning: '乡村、故乡、家乡', wuXing: '水', jiXiong: '吉', desc: '主故乡、家乡、归属' },
  '书': { meaning: '书籍、书写、学问', wuXing: '金', jiXiong: '吉', desc: '主学问、书写、成功' },
  '买': { meaning: '购买、获取、追求', wuXing: '水', jiXiong: '吉', desc: '主获取、追求、成功' },
  '乱': { meaning: '混乱、纷乱、动乱', wuXing: '火', jiXiong: '凶', desc: '主混乱、纷乱、不安' },
  '予': { meaning: '给予、授予、赐予', wuXing: '土', jiXiong: '吉', desc: '主给予、恩赐、成功' },
  '争': { meaning: '争夺、竞争、斗争', wuXing: '火', jiXiong: '中', desc: '主竞争、斗争、努力' },
  '事': { meaning: '事情、事业、事务', wuXing: '金', jiXiong: '吉', desc: '主事业、事务、成功' },
  '二': { meaning: '二、第二、次等', wuXing: '火', jiXiong: '中', desc: '主次等、辅助、柔和' },
  '于': { meaning: '于、在、对于', wuXing: '土', jiXiong: '中', desc: '主位置、归属、关系' },
  '云': { meaning: '云、说、高远', wuXing: '水', jiXiong: '吉', desc: '主高远、自由、变化' },
  '互': { meaning: '互相、相互、彼此', wuXing: '水', jiXiong: '吉', desc: '主互相、合作、共赢' },
  '五': { meaning: '五、五行、天地', wuXing: '土', jiXiong: '吉', desc: '主五行、天地、和谐' },
  '井': { meaning: '井、水井、源头', wuXing: '水', jiXiong: '吉', desc: '主源头、滋养、稳定' },
  '亚': { meaning: '亚、次于、第二', wuXing: '土', jiXiong: '中', desc: '主次于、辅助、柔和' },
  '亡': { meaning: '死亡、消亡、失去', wuXing: '水', jiXiong: '凶', desc: '主死亡、消亡、失去' },
  '交': { meaning: '交流、交往、交叉', wuXing: '火', jiXiong: '吉', desc: '主交流、交往、成功' },
  '亦': { meaning: '也、也是、同样', wuXing: '土', jiXiong: '中', desc: '主同样、并列、递进' },
  '亮': { meaning: '明亮、响亮、亮堂', wuXing: '火', jiXiong: '吉', desc: '主明亮、响亮、成功' },
  '亲': { meaning: '亲人、亲密、亲近', wuXing: '木', jiXiong: '吉', desc: '主亲密、亲近、和谐' },
  '今': { meaning: '今天、现在、当前', wuXing: '木', jiXiong: '中', desc: '主当前、现在、及时' },
  '介': { meaning: '介绍、介入、中介', wuXing: '木', jiXiong: '中', desc: '主中介、介绍、沟通' },
  '仍': { meaning: '仍然、依旧、依然', wuXing: '金', jiXiong: '中', desc: '主依然、持续、不变' },
  '仔': { meaning: '仔细、细致、负责', wuXing: '土', jiXiong: '吉', desc: '主仔细、细致、负责' },
  '他': { meaning: '他、别人、对方', wuXing: '火', jiXiong: '中', desc: '主别人、对方、关系' },
  '代': { meaning: '代表、代替、世代', wuXing: '火', jiXiong: '吉', desc: '主代表、世代、传承' },
  '令': { meaning: '命令、法令、时令', wuXing: '火', jiXiong: '吉', desc: '主命令、权威、成功' },
  '以': { meaning: '以、用、因为', wuXing: '土', jiXiong: '中', desc: '主工具、原因、手段' },
  '仰': { meaning: '仰望、敬仰、仰慕', wuXing: '土', jiXiong: '吉', desc: '主敬仰、仰慕、成功' },
  '仲': { meaning: '中间、仲介、兄弟排行', wuXing: '火', jiXiong: '中', desc: '主中间、排行、协调' },
  '件': { meaning: '物件、条件、案件', wuXing: '木', jiXiong: '中', desc: '主物件、条件、事务' },
  '任': { meaning: '责任、担任、信任', wuXing: '金', jiXiong: '吉', desc: '主责任、信任、成功' },
  '份': { meaning: '份额、缘分、本分', wuXing: '水', jiXiong: '吉', desc: '主缘分、本分、成功' },
  '仿': { meaning: '模仿、仿照、类似', wuXing: '水', jiXiong: '中', desc: '主模仿、仿照、学习' },
  '休': { meaning: '休息、休闲、停止', wuXing: '水', jiXiong: '中', desc: '主休息、休闲、调整' },
  '众': { meaning: '众人、大众、群体', wuXing: '金', jiXiong: '吉', desc: '主群体、大众、成功' },
  '优': { meaning: '优秀、优良、优等', wuXing: '土', jiXiong: '吉', desc: '主优秀、优良、成功' },
  '伙': { meaning: '伙伴、合伙、同伴', wuXing: '火', jiXiong: '吉', desc: '主伙伴、合伙、成功' },
  '会': { meaning: '会议、会面、机会', wuXing: '水', jiXiong: '吉', desc: '主机会、会面、成功' },
  '伞': { meaning: '雨伞、保护、遮蔽', wuXing: '金', jiXiong: '吉', desc: '主保护、遮蔽、安全' },
  '传': { meaning: '传递、传承、流传', wuXing: '火', jiXiong: '吉', desc: '主传承、流传、成功' },
  '伤': { meaning: '伤害、受伤、悲伤', wuXing: '金', jiXiong: '凶', desc: '主伤害、受伤、悲伤' },
  '伦': { meaning: '伦理、伦常、辈分', wuXing: '火', jiXiong: '吉', desc: '主伦理、伦常、秩序' },
  '伯': { meaning: '伯父、长者、尊称', wuXing: '水', jiXiong: '吉', desc: '主长者、尊称、权威' },
  '估': { meaning: '估计、估算、预测', wuXing: '木', jiXiong: '中', desc: '主估计、预测、判断' },
  '伴': { meaning: '陪伴、同伴、伙伴', wuXing: '水', jiXiong: '吉', desc: '主陪伴、伙伴、成功' },
  '伸': { meaning: '伸展、延伸、伸张', wuXing: '金', jiXiong: '吉', desc: '主伸展、延伸、成功' },
  '似': { meaning: '似乎、相似、类似', wuXing: '水', jiXiong: '中', desc: '主相似、类似、比较' },
  '但': { meaning: '但是、但愿、但凡', wuXing: '火', jiXiong: '中', desc: '主转折、但愿、期望' },
  '位': { meaning: '位置、地位、座位', wuXing: '土', jiXiong: '吉', desc: '主地位、位置、成功' },
  '低': { meaning: '低下、低调、降低', wuXing: '火', jiXiong: '凶', desc: '主低下、降低、衰落' },
  '住': { meaning: '居住、停住、住所', wuXing: '火', jiXiong: '吉', desc: '主居住、稳定、安家' },
  '佐': { meaning: '辅佐、辅助、协助', wuXing: '金', jiXiong: '吉', desc: '主辅助、辅佐、成功' },
  '佑': { meaning: '保佑、庇佑、辅助', wuXing: '土', jiXiong: '吉', desc: '主保佑、庇佑、成功' },
  '体': { meaning: '身体、体会、体谅', wuXing: '火', jiXiong: '吉', desc: '主身体、体会、成功' },
  '余': { meaning: '剩余、多余、富余', wuXing: '土', jiXiong: '吉', desc: '主富余、剩余、成功' },
  '佛': { meaning: '佛陀、佛教、觉悟', wuXing: '水', jiXiong: '吉', desc: '主觉悟、智慧、成功' },
  '作': { meaning: '工作、作品、作为', wuXing: '金', jiXiong: '吉', desc: '主工作、作为、成功' },
  '你': { meaning: '你、对方、第二人称', wuXing: '水', jiXiong: '中', desc: '主对方、关系、互动' },
  '佩': { meaning: '佩戴、佩服、佩带', wuXing: '水', jiXiong: '吉', desc: '主佩服、佩戴、成功' },
  '佳': { meaning: '美好、优秀、佳人', wuXing: '木', jiXiong: '吉', desc: '主美好、优秀、成功' },
  '使': { meaning: '使用、使命、使者', wuXing: '金', jiXiong: '吉', desc: '主使命、使用、成功' },
  '例': { meaning: '例子、案例、惯例', wuXing: '火', jiXiong: '中', desc: '主例子、案例、参考' },
  '侍': { meaning: '侍奉、侍候、侍从', wuXing: '金', jiXiong: '中', desc: '主侍奉、服务、服从' },
  '侣': { meaning: '伴侣、情侣、同伴', wuXing: '火', jiXiong: '吉', desc: '主伴侣、情侣、和谐' },
  '侧': { meaning: '侧面、旁边、倾斜', wuXing: '金', jiXiong: '中', desc: '主侧面、辅助、倾斜' },
  '侦': { meaning: '侦查、侦探、侦察', wuXing: '火', jiXiong: '吉', desc: '主侦查、侦探、成功' }
};

function getRadicalInfo(char) {
  if (RADICAL_MEANING[char]) {
    return RADICAL_MEANING[char];
  }
  return null;
}

function getRadicalsFromName(name) {
  const radicals = [];
  for (const char of name) {
    const info = getRadicalInfo(char);
    if (info) {
      radicals.push({ char, ...info });
    }
  }
  return radicals;
}

function analyzeNameRadicals(name) {
  const radicals = getRadicalsFromName(name);
  const wuXingCount = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
  let jiCount = 0;
  let xiongCount = 0;
  let zhongCount = 0;
  for (const r of radicals) {
    if (wuXingCount[r.wuXing] !== undefined) {
      wuXingCount[r.wuXing]++;
    }
    if (r.jiXiong === '吉') jiCount++;
    else if (r.jiXiong === '凶') xiongCount++;
    else zhongCount++;
  }
  return { radicals, wuXingCount, jiCount, xiongCount, zhongCount };
}

/* ===== MINGZHU + SHENZHU + STAR_MEANING + funcs (from MINGZHU.js) ===== */
const MINGZHU = {
  '子': { star: '贪狼', desc: '命主贪狼，主欲望、才艺、桃花' },
  '丑': { star: '巨门', desc: '命主巨门，主口才、是非、暗星' },
  '寅': { star: '禄存', desc: '命主禄存，主财禄、稳重、务实' },
  '卯': { star: '文曲', desc: '命主文曲，主文才、艺术、灵感' },
  '辰': { star: '廉贞', desc: '命主廉贞，主事业、权力、桃花' },
  '巳': { star: '武曲', desc: '命主武曲，主财运、果断、刚毅' },
  '午': { star: '破军', desc: '命主破军，主变动、开创、突破' },
  '未': { star: '武曲', desc: '命主武曲，主财运、果断、刚毅' },
  '申': { star: '廉贞', desc: '命主廉贞，主事业、权力、桃花' },
  '酉': { star: '文曲', desc: '命主文曲，主文才、艺术、灵感' },
  '戌': { star: '禄存', desc: '命主禄存，主财禄、稳重、务实' },
  '亥': { star: '巨门', desc: '命主巨门，主口才、是非、暗星' }
};

const SHENZHU = {
  '甲': { star: '天同', desc: '身主天同，主福气、安逸、享受' },
  '乙': { star: '天机', desc: '身主天机，主智慧、谋略、变化' },
  '丙': { star: '文昌', desc: '身主文昌，主文才、考试、功名' },
  '丁': { star: '天机', desc: '身主天机，主智慧、谋略、变化' },
  '戊': { star: '文昌', desc: '身主文昌，主文才、考试、功名' },
  '己': { star: '天机', desc: '身主天机，主智慧、谋略、变化' },
  '庚': { star: '天同', desc: '身主天同，主福气、安逸、享受' },
  '辛': { star: '文昌', desc: '身主文昌，主文才、考试、功名' },
  '壬': { star: '天机', desc: '身主天机，主智慧、谋略、变化' },
  '癸': { star: '文昌', desc: '身主文昌，主文才、考试、功名' }
};

const STAR_MEANING = {
  '贪狼': { meaning: '欲望、才艺、桃花', wuXing: '木', desc: '主多才多艺，异性缘好，但易贪心' },
  '巨门': { meaning: '口才、是非、暗星', wuXing: '水', desc: '主口才了得，善于分析，但易惹是非' },
  '禄存': { meaning: '财禄、稳重、务实', wuXing: '土', desc: '主财运亨通，性格稳重，但易保守' },
  '文曲': { meaning: '文才、艺术、灵感', wuXing: '水', desc: '主文采出众，艺术天赋，但易孤芳' },
  '廉贞': { meaning: '事业、权力、桃花', wuXing: '火', desc: '主事业心强，有领导力，但易冲动' },
  '武曲': { meaning: '财运、果断、刚毅', wuXing: '金', desc: '主财运佳，做事果断，但易固执' },
  '破军': { meaning: '变动、开创、突破', wuXing: '水', desc: '主勇于开创，不畏变动，但易冲动' },
  '天同': { meaning: '福气、安逸、享受', wuXing: '水', desc: '主福气深厚，性格温和，但易懒散' },
  '天机': { meaning: '智慧、谋略、变化', wuXing: '木', desc: '主聪明机智，善于谋略，但易多变' },
  '文昌': { meaning: '文才、考试、功名', wuXing: '金', desc: '主文才出众，学业有成，但易刻板' }
};

function getMingZhu(diZhi) {
  if (MINGZHU[diZhi]) {
    const info = MINGZHU[diZhi];
    return { ...info, starInfo: STAR_MEANING[info.star] || null };
  }
  return null;
}

function getShenZhu(tianGan) {
  if (SHENZHU[tianGan]) {
    const info = SHENZHU[tianGan];
    return { ...info, starInfo: STAR_MEANING[info.star] || null };
  }
  return null;
}

function analyzeMingShenZhu(diZhi, tianGan) {
  const mingZhu = getMingZhu(diZhi);
  const shenZhu = getShenZhu(tianGan);
  let analysis = '';
  if (mingZhu && shenZhu) {
    analysis = `命主${mingZhu.star}，${mingZhu.starInfo ? mingZhu.starInfo.meaning : ''}；身主${shenZhu.star}，${shenZhu.starInfo ? shenZhu.starInfo.meaning : ''}`;
  }
  return { mingZhu, shenZhu, analysis };
}
function kxStroke(c){
  if(KX[c]!==undefined) return KX[c];
  try{ const a=cnchar.stroke(c,'array'); if(a&&a[0]) return a[0]; }catch(e){}
  return 0;
}

document.getElementById('nameBtn').onclick=()=>{
  const name=document.getElementById('userName').value.trim();
  if(!name){hintResult('nameResult','请输入中文姓名后再测算。');return;}
  const chars=[...name];
  let mods=[], kxs=[];
  for(const c of chars){
    let m=0; try{ const a=cnchar.stroke(c,'array'); m=a&&a[0]?a[0]:0; }catch(e){}
    const k=kxStroke(c);
    mods.push(m); kxs.push(k);
  }
  if(kxs.some(s=>!s)){ hintResult('nameResult','含无法识别的字符，请使用常用简体汉字。'); return; }
  const n=chars.length;
  const surname=kxs[0];
  const given=kxs.slice(1);
  // 五格（按康熙笔画）
  const tian = surname + 1;                                   // 天格（单姓）
  const ren  = surname + (given[0]||0);                        // 人格
  let di;                                                      // 地格
  if(given.length>=2) di=given.reduce((a,b)=>a+b,0);
  else di=(given[0]||0)+1;
  const total=kxs.reduce((a,b)=>a+b,0);                        // 总格
  const wai = total - ren + 1;                                 // 外格
  // 三才
  const wuT=wuOfNum(tian), wuR=wuOfNum(ren), wuD=wuOfNum(di);
  const sheng=(a,b)=>({木:'火',火:'土',土:'金',金:'水',水:'木'}[a]===b);
  const ke=(a,b)=>({木:'土',土:'水',水:'火',火:'金',金:'木'}[a]===b);
  let evTR = sheng(wuT,wuR)?'天格生人格（吉，得长辈荫助）'
           : ke(wuT,wuR)?'天格克人格（受长辈约束）'
           : ke(wuR,wuT)?'人格克天格（自立性强）'
           : '天人格比和';
  let evRD = sheng(wuR,wuD)?'人格生地格（吉，育晚辈/下属）'
           : sheng(wuD,wuR)?'地格生人格（吉，得晚辈/下属助）'
           : ke(wuR,wuD)?'人格克地格（劳心耗费）'
           : ke(wuD,wuR)?'地格克人格（受晚辈/部属累）'
           : '人地格比和';
  // 数理吉凶统计
  const nums=[['天格',tian],['人格',ren],['地格',di],['外格',wai],['总格',total]];
  let good=0,bad=0;
  const numTags=nums.map(([k,v])=>{ const info=shuInfo(v); if(info[2]===1)good++; if(info[2]===0)bad++;
    const col=info[2]===1?'#5fae5f':info[2]===0?'#c24234':'#9a8a5a';
    return `<span class="tag" style="background:${col}">${k}${v}·${info[1]}</span>`; }).join('');
  // 格局判定
  const s3 = sheng(wuT,wuR)||sheng(wuR,wuD)||sheng(wuD,wuR);
  let grade = (good>=3 && s3) ? '上格' : (bad>=3 ? '下格' : '中格');
  // 总结判词去模板：同名同格稳定、不同名不同句
  const _nh=_hashStr(name+'|'+total);
  const _gUpS=['五格以吉为主、三才又有生扶——名字本身带助力','五格主吉、三才相生——这名字本身就是一股顺风','五格多吉、三才相生——名字像是替你铺好的路，走起来顺','五格主吉、三才生扶——名字自带好底子，把日子过出彩就是你的加分项'];
  const _gUpL=['五格数理以吉为主、三才又有生扶——名字本身带助力，配合后天努力会更顺。','五格主吉、三才生扶——名字自带助力，再加上后天努力，路会越走越顺。','五格多吉、三才生扶——名字是顺风，后天的努力则是帆，二者相加路才宽。','五格数理以吉为主、三才生扶——这名字是一手好牌，怎么打全看你的经营与心性。'];
  const _gMidS=['数理吉凶参半、三才中平——平常心对待','数理有吉有凶、三才中平——名字是符号，人才是本','数理有吉有凶、三才中平——名字不偏不倚，成事更多看你自己的修为','数理吉凶参半、三才中平——中格之名最考验人，心性定了，运势自稳'];
  const _gMidL=['数理吉凶参半、三才中平——中格之名平常心对待，运势更多看个人修为。','数理有吉有凶、三才中平——这类名字不偏不倚，运势更多看你自己怎么走。','数理吉凶参半、三才中平——中格之名最平常，运势的钥匙其实握在你自己手里。','数理有吉有凶、三才中平——中格名字没有捷径，踏实走，路是自己铺宽的。'];
  const _gDnS=['数理凶格偏多——但名字只是符号，不必介怀','数理凶格偏多——不过名是符号，心性是根本','数理凶格偏多——名只是符号，别让几个数字定义你','数理凶格偏多——名字只是个标签，别让它替你贴上限'];
  const _gDnL=['数理凶格偏多——但名字只是符号，心性与作为才是命运，不必为此介怀。','数理凶格偏多——但名字只是符号，真正决定命运的是心性与作为，不必介怀。','数理凶格偏多——名字只是符号，真正定命运的是你的心性与作为，不必为一个数字耿耿于怀。','数理凶格偏多——名是外衣、你是里子，把里子修好，外衣旧了也无妨。'];
  const corrected=chars.filter((c,i)=>kxs[i]!==mods[i]).length;
  const renInfo=shuInfo(ren), totInfo=shuInfo(total);
  const _dianPool=(renInfo[2]===1&&totInfo[2]===1)?['人格与总格数理皆吉——内在格局与一生归宿同气相求，是稳中向上的配置。','吉数成双，内在气质与整体归宿都在向上走，好名字就是这样一路借力。']
    :((renInfo[2]===0||renInfo[2]===undefined)&&(totInfo[2]===0||totInfo[2]===undefined))?['人格与总格数理偏凶——名字只是符号，把心性与作为立起来，数字挡不住你。','数理双凶不必惧，名是外衣你是里子——里子厚了，外衣再旧也压不住你。']
    :['数理吉平相间——名字不算顶配，但贵在无大破绽，稳扎稳打即是福。','吉凶平数皆有，名字如寻常人家，把日子过好就是最好的命格。'];
  const _dian=_dianPool[_nh%_dianPool.length];
  const strokeShow=chars.map((c,i)=> kxs[i]!==mods[i] ? `${c}<b style="color:var(--gold2)">(${kxs[i]}康熙)</b>` : `${c}(${kxs[i]})`).join(' ');
  const nameHtml=
    `<div class="result">
      <h3>「${name}」五格剖象 · 康熙笔画</h3>
      <p style="font-size:13px;color:var(--muted)">笔画：${strokeShow}</p>
      <p>三才：天格<b style="color:var(--gold2)">${wuT}</b> → 人格<b style="color:var(--gold2)">${wuR}</b> → 地格<b style="color:var(--gold2)">${wuD}</b></p>
      <p style="font-size:13px">${evTR}；${evRD}</p>
      <div style="margin-top:8px">${numTags}</div>
      <p style="margin-top:10px">数理吉 ${good} ｜ 凶 ${bad} ｜ 格局评定：<b style="color:var(--gold2)">${grade}</b></p>
      <h4>白话解读</h4>
      <p>一句话：${grade==='上格'?_gUpS[_nh%4]:grade==='下格'?_gDnS[_nh%4]:_gMidS[_nh%4]}。</p>
      <p>${evTR}；${evRD}</p>
      <p>${grade==='上格'?_gUpL[_nh%4]:grade==='下格'?_gDnL[_nh%4]:_gMidL[_nh%4]}</p>
      <p style="margin-top:6px;padding:6px 8px;border-left:3px solid #5a8a6a;background:var(--r-subbg);font-size:12.5px;line-height:1.8"><b style="color:var(--gold2)">数理点睛</b>：${_dian}</p>
      <p style="color:var(--muted);font-size:12px;margin-top:6px">* 解读由三才生克与数理吉凶统计生成；名是符号，人是根本。</p>
      <p style="color:var(--muted);font-size:12px;margin-top:8px">* 五格按<b style="color:var(--gold2)">康熙字典笔画</b>推算（${corrected>0?('已对 '+corrected+' 字按康熙校正，如 王 通用4→康熙5'):'通用笔画与康熙同值'}）；生僻字回退通用笔画。</p>
    </div>`;
  document.getElementById('nameResult').innerHTML=wrapTerms(nameHtml);
};

/* ===================== 4. 星座（真实星座+属性） ===================== */
const ZODIAC_ORDER=['白羊','金牛','双子','巨蟹','狮子','处女','天秤','天蝎','射手','摩羯','水瓶','双鱼'];
/* 月亮星座：按公历出生日期+时刻，用月黄经近似公式求（程序自算，不依赖外部库） */
function gregorianToJD(y,mo,d,h){
  if(mo<=2){ y-=1; mo+=12; }
  const A=Math.floor(y/100), B=2-A+Math.floor(A/4);
  return Math.floor(365.25*(y+4716)) + Math.floor(30.6001*(mo+1)) + d + B - 1524.5 + (h||12)/24;
}
function moonSign(y,mo,d,h){
  try{
    const jd=gregorianToJD(y,mo,d,h||12);
    const T=(jd-2451545.0)/36525;
    const L=218.3164477+481267.88123421*T-0.0015786*T*T+T*T*T/538841-T*T*T*T/65194000;
    const M=(134.9633964+477198.8675055*T+0.0087414*T*T+T*T*T/69699-T*T*T*T/14712000)*Math.PI/180;
    const lam=((L+6.2886*Math.sin(M))%360+360)%360;
    const idx=(((Math.floor(lam/30))%12)+12)%12;
    return ZODIAC_ORDER[idx];
  }catch(e){ return null; }
}
/* ===== 西式本命行星相位（Paul Schlyter 简化轨道近似，程序自算，不依赖外部库）
   太阳·月亮·水金火木土天海冥十大行星在出生时刻的黄道黄经 → 两两夹角 → 按标准相位与容许度成相
   → 加权为"相位强度评分"，命中本盘"最亮/最高"的那颗星 —— 回应"相位图很高是什么意思" */
const PH_ZOD=[
  ['白羊',0],['金牛',30],['双子',60],['巨蟹',90],['狮子',120],['处女',150],
  ['天秤',180],['天蝎',210],['射手',240],['摩羯',270],['水瓶',300],['双鱼',330]
];
function PH_SIGN(lon){
  var L=((lon%360)+360)%360;
  for(var i=PH_ZOD.length-1;i>=0;i--){
    if(L>=PH_ZOD[i][1]){
      var dg=L-PH_ZOD[i][1], dd=Math.floor(dg), mm=Math.floor((dg-dd)*60);
      return {s:PH_ZOD[i][0], deg:dd+'°'+(mm<10?'0':'')+mm+"'"};
    }
  }
  return {s:'白羊',deg:'0°'};
}
const PH_ORB={
 '水星':{N:48.3313,Nr:3.24587E-5,i:7.0047,ir:5.00E-8,w:29.1241,wr:1.01444E-5,a:0.387098,e:0.205635,er:5.59E-10,M:168.6562,Mr:4.0923344368},
 '金星':{N:76.6799,Nr:2.46590E-5,i:3.3946,ir:2.75E-8,w:54.8910,wr:1.38374E-5,a:0.723330,e:0.006773,er:-1.302E-9,M:48.0052,Mr:1.6021302244},
 '火星':{N:49.5574,Nr:2.11081E-5,i:1.8497,ir:-1.78E-8,w:286.5016,wr:2.92961E-5,a:1.523688,e:0.093405,er:2.516E-9,M:18.6021,Mr:0.5240207766},
 '木星':{N:100.4542,Nr:2.76854E-5,i:1.3030,ir:-1.557E-7,w:273.8777,wr:1.64505E-5,a:5.20256,e:0.048498,er:4.469E-9,M:19.8950,Mr:0.0830853001},
 '土星':{N:113.6634,Nr:2.38980E-5,i:2.4886,ir:-1.081E-7,w:339.3939,wr:2.97661E-5,a:9.55475,e:0.055546,er:-9.499E-9,M:316.9670,Mr:0.0334442282},
 '天王星':{N:74.0005,Nr:1.3978E-5,i:0.7733,ir:1.9E-8,w:96.6612,wr:3.0565E-5,a:19.18171,e:0.047318,er:7.45E-9,M:142.5905,Mr:0.011725806},
 '海王星':{N:131.7806,Nr:3.0173E-5,i:1.7700,ir:-2.55E-7,w:272.8461,wr:-6.027E-6,a:30.05826,e:0.008606,er:2.15E-9,M:260.2471,Mr:0.005995147},
 '冥王星':{N:110.3034,Nr:3.7736E-5,i:17.1418,ir:3.08E-7,w:300.6392,wr:-8.233E-6,a:39.48167,e:0.248807,er:6.18E-7,M:180.0463,Mr:0.003962897}
};
function _phSUN(jd0){
  var d=jd0-2451543.5+0.0053, w=282.9404+4.70935E-5*d, e=0.016709-1.151E-9*d;
  var M=(356.0470+0.9856002585*d)*Math.PI/180, E=M+e*Math.sin(M)*(1+e*Math.cos(M));
  var xv=Math.cos(E)-e, yv=Math.sqrt(1-e*e)*Math.sin(E), v=Math.atan2(yv,xv)*180/Math.PI;
  return (((Math.atan2(Math.sin((v+w)*Math.PI/180),Math.cos((v+w)*Math.PI/180))*180/Math.PI)%360)+360)%360;
}
function _phMOON(jd0){
  var d=jd0-2451543.5, N=(125.1228-0.0529538083*d)*Math.PI/180, i=5.1454, w=(318.0634+0.1643573223*d)*Math.PI/180;
  var a=60.2666, e=0.0549, M=(115.3654+13.0649929509*d)*Math.PI/180, E=M+e*Math.sin(M)*(1+e*Math.cos(M));
  var xv=a*(Math.cos(E)-e), yv=a*(Math.sqrt(1-e*e)*Math.sin(E)), v=Math.atan2(yv,xv)*180/Math.PI, r=Math.sqrt(xv*xv+yv*yv);
  var xh=r*(Math.cos(N)*Math.cos((v+w)*Math.PI/180)-Math.sin(N)*Math.sin((v+w)*Math.PI/180)*Math.cos(i));
  var yh=r*(Math.sin(N)*Math.cos((v+w)*Math.PI/180)+Math.cos(N)*Math.sin((v+w)*Math.PI/180)*Math.cos(i));
  return (((Math.atan2(yh,xh)*180/Math.PI)%360)+360)%360;
}
function _phPLANET(jd0,key){
  var p=PH_ORB[key]; if(!p) return null;
  var d=jd0-2451543.5;
  var N=(p.N+p.Nr*d)*Math.PI/180, ic=(p.i+p.ir*d)*Math.PI/180, w=(p.w+p.wr*d)*Math.PI/180, ec=p.e+p.er*d, M=(p.M+p.Mr*d)*Math.PI/180;
  var E=M+ec*Math.sin(M)*(1+ec*Math.cos(M));
  for(var k=0;k<3;k++){ E=E-(E-ec*Math.sin(E)-M)/(1-ec*Math.cos(E)); }
  var xv=p.a*(Math.cos(E)-ec), yv2=p.a*(Math.sqrt(1-ec*ec)*Math.sin(E));
  var v=Math.atan2(yv2,xv)*180/Math.PI, r=Math.sqrt(xv*xv+yv2*yv2);
  var xh=r*(Math.cos(N)*Math.cos((v+w)*Math.PI/180)-Math.sin(N)*Math.sin((v+w)*Math.PI/180)*Math.cos(ic));
  var yh=r*(Math.sin(N)*Math.cos((v+w)*Math.PI/180)+Math.cos(N)*Math.sin((v+w)*Math.PI/180)*Math.cos(ic));
  return (((Math.atan2(yh,xh)*180/Math.PI)%360)+360)%360;
}
const PH_ORDER=['太阳','月亮','水星','金星','火星','木星','土星','天王星','海王星','冥王星'];
/* 十大行星黄经：太阳/月亮用天体公式，八大行星用轨道根数近似 */
function PH_LONS(jd0){
  var o={}; PH_ORDER.forEach(function(n,i){ o[n]= i===0?_phSUN(jd0) : i===1?_phMOON(jd0) : _phPLANET(jd0,n); });
  return o;
}
/* 相位类型 + 容许度；权重：合/刑/冲=3（强结构张力），六合/拱=2（顺畅助力） */
const PH_ASP=[['合',0,8,3],['六合',60,6,2],['刑',90,7,3],['拱',120,8,2],['冲',180,8,3]];
function PH_BETWEEN(a1,a2){
  var d=Math.abs((((a1-a2)%360)+360)%360); if(d>180)d=360-d;
  var out=[];
  for(var i=0;i<PH_ASP.length;i++){ var dd=Math.abs(d-PH_ASP[i][1]); if(dd<=PH_ASP[i][2]) out.push({n:PH_ASP[i][0],d:d,orb:dd,w:PH_ASP[i][3]}); }
  return out;
}
/* 相位强度评分：每股行星成相数 + 加权强度分 → 排行 + 定性（高/中/低） */
const PH_MEANING={
 '太阳':'自我与意志', '月亮':'情绪与本能', '水星':'思维与表达', '金星':'爱与审美',
 '火星':'行动与冲劲', '木星':'机遇与扩张', '土星':'责任与磨砺', '天王星':'变格与革新',
 '海王星':'直觉与幻想', '冥王星':'深层蜕变'
};
const PH_TONE={
 '合':'力量高度集中、与你贴得最近的一面','六合':'彼此顺畅成全、互相带旺','刑':'内在拉扯、需要磨合的压力',
 '拱':'轻松相助、自带顺遂','冲':'两极拉扯、对立中的张力'
};
function PH_RANK(lons){
  var cnt={},sc={}; PH_ORDER.forEach(function(n){cnt[n]=0;sc[n]=0;});
  var rows=[];
  for(var a=0;a<PH_ORDER.length;a++) for(var b=a+1;b<PH_ORDER.length;b++){
    var ps=PH_BETWEEN(lons[PH_ORDER[a]],lons[PH_ORDER[b]]);
    if(ps.length) ps.forEach(function(x){ cnt[PH_ORDER[a]]++;cnt[PH_ORDER[b]]++;sc[PH_ORDER[a]]+=x.w;sc[PH_ORDER[b]]+=x.w; rows.push(PH_ORDER[a]+' ⊙ '+PH_ORDER[b]+' · '+x.n+'相 · 距'+x.d.toFixed(1)+'°'); });
  }
  var rank=PH_ORDER.slice().sort(function(x,y){return sc[y]-sc[x];});
  return {cnt,sc,rank,rows};
}
function PH_HTML(lons){
  try{
    var R=PH_RANK(lons), top=R.rank[0], topSc=R.sc[top];
    /* 星级：按最高分相对定档（10 行星均分上限约 24 分） */
    var level = topSc>=12?'高': (topSc>=8?'中':'稳');
    var lines='';
    R.rows.forEach(function(x){ lines+='<div style="padding:3px 0;font-size:12px;line-height:1.7">'+x+'</div>'; });
    var tbl='<table style="width:100%;border-collapse:collapse;margin-top:4px;font-size:12px"><tr style="color:var(--muted)"><td style="padding:3px 2px;border-bottom:1px dashed rgba(154,138,90,.25)">行星</td><td style="padding:3px 2px;border-bottom:1px dashed rgba(154,138,90,.25)">黄经座</td><td style="padding:3px 2px;border-bottom:1px dashed rgba(154,138,90,.25)">相位</td><td style="padding:3px 2px;border-bottom:1px dashed rgba(154,138,90,.25)">强度</td></tr>';
    PH_ORDER.forEach(function(n){
      var sg=PH_SIGN(lons[n]), f=Math.min(100,Math.round(R.sc[n]/(topSc||1)*100));
      tbl+='<tr><td style="padding:2px 2px;color:var(--gold2)">'+n+'</td><td style="padding:2px 2px">'+sg.s+'座'+sg.deg+'</td><td style="padding:2px 2px;color:var(--muted)">'+R.cnt[n]+'相</td><td style="padding:2px 2px"><div style="height:5px;background:var(--r-subbg);border-radius:3px;width:'+f+'%;position:relative"><div style="height:100%;width:100%;background:var(--gold2);opacity:.55;border-radius:3px"></div></div><span style="color:var(--muted);font-size:11px">'+R.sc[n]+'</span></td></tr>';
    });
    tbl+='</table>';
    return '<div style="margin-top:12px;padding-top:10px;border-top:1px dashed rgba(154,138,90,.3)">'
      +'<h4 style="margin:0 0 8px;color:var(--gold2)">本命行星相位 · 强度排行</h4>'
      +'<div style="padding:8px 10px;background:var(--r-subbg);border-left:3px solid var(--gold2);font-size:13px;line-height:1.85;margin-bottom:8px">'
      +'<b style="color:var(--gold2)">你本盘最亮 / 相位最高：'+top+'（'+topSc+' 分 · '+level+'）</b><br>'
      +PH_MEANING[top]+'在这张盘里'+PH_TONE_JOIN(top,R)+'；这一股力量在你身上最容易被外人看见、也最烙印你的底色。'
      +'<br><span style="color:var(--muted);font-size:12px">（"很高" = 与该星成相的行星多、且多为合冲刑等强相位，能量越集中、强度分越高。）</span></div>'
      +tbl
      +'<div style="margin-top:8px;padding:6px 10px;font-size:12px;color:var(--muted);line-height:1.8"><b>成相明细</b><br>'+lines+'</div>'
      +'<p style="color:var(--muted);font-size:11px;margin-top:6px;line-height:1.7">* 相位/容许度 · 合0°±8、六合60°±6、刑90°±7（强）、拱120°±8、冲180°±8；太阳·月亮用简化天体公式，八大行星用 Paul Schlyter 轨道近似（误差约 1–2°，不影响相位判定），仅供趣味参考。</p>'
      +'</div>';
  }catch(e){ return ''; }
}
function PH_TONE_JOIN(n,R){
  var list=[];
  R.rows.forEach(function(x){
    if(x.indexOf(n+' ⊙')===0){ var b=x.split(' · '); list.push(b[1].replace('相','')); }
    if(x.indexOf('⊙ '+n)>=0){ var b=x.split(' · '); list.push(b[1].replace('相','')); }
  });
  if(!list.length) return '相位清淡、能量较为独立';
  var tag={}; list.forEach(function(t){ if(!tag[t])tag[t]=1; else tag[t]++; });
  var arr=[]; for(var k in tag){ arr.push(PH_TONE[k]? (tag[k]>1?k+'相×'+tag[k]:k+'相') : k); }
  return '成相以'+arr.join('、')+'为主';
}
/* 上升星座：通俗近似——日出(约6时)上升≈太阳星座，每2小时推进一个星座（不含纬度/季节微调） */
function ascendantSign(sunIdx,hh){
  const off=Math.floor((hh-6+0.0001)/2);
  return ZODIAC_ORDER[(((sunIdx+off)%12)+12)%12];
}
const STAR_ATTR={
 '白羊':{el:'火',ruler:'火星',trait:'热情冲动、行动力强、敢于开创'},
 '金牛':{el:'土',ruler:'金星',trait:'稳健务实、重感官、有耐心与占有欲'},
 '双子':{el:'风',ruler:'水星',trait:'机智善变、沟通力强、好奇心旺盛'},
 '巨蟹':{el:'水',ruler:'月亮',trait:'情感细腻、顾家念旧、保护欲强'},
 '狮子':{el:'火',ruler:'太阳',trait:'自信大方、领导欲强、重尊严'},
 '处女':{el:'土',ruler:'水星',trait:'严谨细致、追求完美、务实理性'},
 '天秤':{el:'风',ruler:'金星',trait:'和谐优雅、重视关系与平衡'},
 '天蝎':{el:'水',ruler:'冥王星',trait:'深沉敏锐、意志力强、爱憎分明'},
 '射手':{el:'火',ruler:'木星',trait:'乐观自由、求知欲强、不拘小节'},
 '摩羯':{el:'土',ruler:'土星',trait:'沉稳自律、目标明确、责任心重'},
 '水瓶':{el:'风',ruler:'天王星',trait:'独立创新、博爱理性、不拘传统'},
 '双鱼':{el:'水',ruler:'海王星',trait:'浪漫敏感、富有同理心与想象力'}
};
const EL_COLOR={火:'红',土:'黄',风:'白',水:'蓝'};
const STAR_MODE={'白羊':'基本','金牛':'固定','双子':'变动','巨蟹':'基本','狮子':'固定','处女':'变动','天秤':'基本','天蝎':'固定','射手':'变动','摩羯':'基本','水瓶':'固定','双鱼':'变动'};
const STAR_STONE={'白羊':'红玛瑙','金牛':'绿幽灵','双子':'黄水晶','巨蟹':'月光石','狮子':'琥珀','处女':'蓝晶石','天秤':'粉晶','天蝎':'黑曜石','射手':'土耳其石','摩羯':'茶晶','水瓶':'紫锂辉','双鱼':'海蓝宝'};
const STAR_WEEK=['宜主动破局','关系正在升温','专注一事深耕','宜守成蓄力','灵感悄然迸发','财务宜保守','旧识带来助力','节奏宜慢不宜赶','合作顺遂','宜独处复盘','远方藏着机会','该发声时别沉默'];
const ADVICE=['宜主动破局，莫犹豫','适合深度学习与积累','人际关系有正向进展','宜守成，谨防口舌','创意灵感充沛，可大胆尝试','财务需保守，量入为出','旧识带来新机遇，主动联络','宜早睡早起，今日节奏宜慢不宜赶','适合处理搁置已久的琐事，清空一件是一件','利于合作签约，可主动推进关键对话','宜整理与规划，把想法落到纸面最有效','今日宜静不宜动，重要决定留到明天','适合运动出汗，身体顺则心气顺','宜多读多写，灵感藏在案头','利于出行走动，途中或遇贵人','宜修补关系，一句道歉胜过千句解释','适合谈判博弈，底线先想清楚再开口','今日宜专注一件大事，忌多线并行','利开源也利节流，先记账再规划','宜拜访长辈，经验里藏着答案','适合独处复盘，把过去的弯路看明白','利于公开表达，该发声时别沉默','今日宜做减法，退一步海阔天空','适合学习新技能，趁热打铁正当时','利远谋，今日不必急着要答案','宜善待自己，一顿好饭一场好眠都是修行','今日宜感恩，把收到的善意记下来','利于跨界交流，陌生领域藏着机会','宜守约守信，今日的承诺日后有回报'];
document.getElementById('starBtn').onclick=()=>{
  const d=document.getElementById('starBirth').value;
  if(!d){hintResult('starResult','请选择你的生日后再查看星座命盘。');return;}
  const [y,m,day]=d.split('-').map(Number);
  const sign=Solar.fromYmd(y,m,day).getXingZuo();
  const a=STAR_ATTR[sign]; if(!a){hintResult('starResult','未识别星座，请检查生日。');return;}
  // 确定性幸运数（基于生日，非随机）
  const lucky=((day*3+m*7)%49)+1;
  const idx=(day+m)%ADVICE.length;
  const mode=STAR_MODE[sign]||'基本';
  const stone=STAR_STONE[sign]||'水晶';
  const wk=STAR_WEEK[(day+m)%STAR_WEEK.length];
  // 本命三要素：太阳(生日) + 月亮(公式近似) + 上升(出生时间近似)
  const sunIdx=ZODIAC_ORDER.indexOf(sign);
  let moonHtml='', ascHtml='', triHtml='';
  const tEl=document.getElementById('starTime'); const tVal=tEl?tEl.value:'';
  if(tVal){
    const [hh,mm]=tVal.split(':').map(Number);
    const moon=moonSign(y,m,day,hh);
    const asc=ascendantSign(sunIdx,hh);
    const ma=STAR_ATTR[moon], aa=STAR_ATTR[asc];
    moonHtml=`<div style="margin-top:8px;padding:6px 10px;background:var(--r-subbg);border-left:3px solid #7d9bb5;font-size:12.5px;line-height:1.8"><b style="color:var(--gold2)">月亮 · ${moon}座</b> <span style="color:var(--muted)">（情绪底色 · ${ma.el}）</span><br>${ma.trait}</div>`;
    ascHtml=`<div style="margin-top:6px;padding:6px 10px;background:var(--r-subbg);border-left:3px solid #b3a78f;font-size:12.5px;line-height:1.8"><b style="color:var(--gold2)">上升 · ${asc}座</b> <span style="color:var(--muted)">（外在面具 · ${aa.el}）</span><br>${aa.trait}</div>`;
    // 三要素综合：外显=上升，内核=太阳，情绪=月亮
    const triLine={
      '火':'你外放时干脆利落、说干就干，但情绪里常有想要被稳稳接住的一面。'
    }['火']||'';
    let note='';
    if(aa.el===a.el && ma.el===a.el) note='你的太阳·月亮·上升同属'+a.el+'，三股劲儿朝一处使，个性鲜明、内外一致。';
    else if(aa.el===a.el) note='外在面具与内核同属'+a.el+'，给人的第一印象就是你本来的样子；情绪底色（'+ma.el+'）则悄悄添了层反差。';
    else if(ma.el===a.el) note='情绪底色与内核同属'+a.el+'，你心里怎么想、怎么感受高度一致；只是外在（'+aa.el+'）会先披一层不同的壳。';
    else note='你外显给人第一印象的是'+aa.el+'（上升'+asc+'），内核驱动力来自'+a.el+'（太阳'+sign+'），而情绪安全感藏在'+ma.el+'（月亮'+moon+'）——三层偶尔会"打架"，正是你丰富的地方。';
    triHtml=`<div style="margin-top:8px;padding:8px 12px;background:var(--r-subbg);border-left:3px solid var(--gold2);font-size:13px;line-height:1.85"><b style="color:var(--gold2)">本命三要素综合</b><br>${note}</div>`;
  }
  // 本命行星相位：真实算十大行星黄经 + 容许度成相 + 强度排行（回应"相位图很高是什么意思"）
  const t2Val=tVal||'12:00';
  const [phH,phM]=t2Val.split(':').map(Number);
  const PH_J=gregorianToJD(y,m,day,phH);
  const PH_HTML_R=PH_HTML(PH_LONS(PH_J));
  document.getElementById('starResult').innerHTML=
    `<div class="result">
      <h3>${sign}座</h3>
      <span class="tag">太阳星座</span>
      <span class="tag">元素 ${a.el}</span>
      <span class="tag">模式 ${mode}</span>
      <span class="tag">守护星 ${a.ruler}</span>
      <p style="margin-top:10px">特质：${a.trait}</p>
      <p>幸运色：<b style="color:var(--gold2)">${EL_COLOR[a.el]}</b> ｜ 幸运数字：<b style="color:var(--gold2)">${lucky}</b> ｜ 幸运石：<b style="color:var(--gold2)">${stone}</b></p>
      <p>本周基调：<b style="color:var(--gold2)">${wk}</b></p>
      <p>今日建议：${ADVICE[idx]}</p>
      ${moonHtml}${ascHtml}${triHtml}
      ${PH_HTML_R}
      <p style="color:var(--muted);font-size:12px;margin-top:6px">* 太阳星座由生日真实推算；${tVal?'月亮星座按出生时刻公式近似，上升星座按出生时间通俗近似（不含经纬度/季节微调），仅供趣味参考；':'补填「出生时间」可解锁月亮 / 上升星座与本命三要素综合；'}建议为按日期确定的固定项。</p>
    </div>`;
};

/* ===================== 5. 塔罗（22 张大阿尔克那·真实牌义） ===================== */
const TAROT=[
 {n:'0 愚者',k:['新的开始','纯真','冒险'],d:'悬崖边的新旅人，行囊里只有初心与勇气——人生最珍贵的起点，往往始于"不知道"的一跳。',up:'新的开始，纯真无畏，勇于踏上未知旅程。',down:'冲动盲目，缺乏计划，需三思后行。'},
 {n:'1 魔术师',k:['创造力','行动力','显化'],d:'桌上四元素齐备，天地为台——你已拥有所需的一切，缺的只是把愿望付诸行动的那一下。',up:'资源齐备，创造力强，足以将想法化为现实。',down:'才能错用或自我怀疑，需聚焦目标。'},
 {n:'2 女祭司',k:['直觉','内省','智慧'],d:'帷幕后的静默者，月亮与她为伴——答案不在喧嚣里，在内里深处，先听，再问。',up:'直觉敏锐，静默中藏答案，宜内省倾听。',down:'过度隐瞒或信息不足，勿凭臆测。'},
 {n:'3 皇后',k:['丰盛','滋养','温柔'],d:'丰饶的田与成熟的穗，爱的滋养看得见——善待自己，你的丰盛正从给予中生长。',up:'丰盛滋养，关系或事业将结果，宜温柔待己。',down:'过度付出忽略自我，注意边界。'},
 {n:'4 皇帝',k:['秩序','权威','掌控'],d:'稳固的王座与秩序——规则不是束缚，是让你少走弯路的轨道，先立规矩再谈自由。',up:'秩序与掌控，凭理性纪律可稳大局。',down:'固执专断，需刚柔并济。'},
 {n:'5 恋人',k:['选择','连接','爱情'],d:'两棵树的交缠与天使的注视——这是选择也是同盟，问清自己真正想要什么。',up:'重要抉择与联盟，遵从本心最珍贵。',down:'关系失衡或犹豫，需厘清所求。'},
 {n:'6 战车',k:['意志','胜利','前进'],d:'驾驭双狮的驭者，目光坚定——意志集中到一处，阻力也会为你让路。',up:'意志驱动胜利，专注前行可破万难。',down:'方向分歧内耗，先安内心。'},
 {n:'7 力量',k:['勇气','柔韧','驯服'],d:'少女轻抚狮鬃，以柔驯刚——真正的力量是克制，是能按住脾气、稳住自己的那一手。',up:'以柔克刚，内在勇气足以驯服心魔。',down:'自我压抑或失控，需与情绪和解。'},
 {n:'8 隐士',k:['独处','探索','智光'],d:'提灯独行于山巅——孤独不是惩罚，是让你看清脚下路的必要距离。',up:'向内求索，孤独中得智慧明灯。',down:'过度孤立，宜适度求援。'},
 {n:'9 命运之轮',k:['转机','循环','顺势'],d:'轮盘转动，四圣兽各守一方——顺势时乘风，逆势时蓄力，没有永远的顶点。',up:'转机将至，顺势乘势而上。',down:'起伏难料，守本心待轮回。'},
 {n:'10 正义',k:['公平','因果','权衡'],d:'天平与长剑，眼蒙而心明——因果已在路上，你所权衡的，终将回报于你。',up:'因果分明，公正回报，权衡后定。',down:'偏颇失衡，需承担后果。'},
 {n:'11 倒吊人',k:['换位','牺牲','领悟'],d:'倒挂而从容，以另一视角看世界——困局的答案，往往藏在反向的解读里。',up:'换角度看见真相，牺牲换领悟。',down:'被动受苦无觉知，需主动转念。'},
 {n:'12 死神',k:['结束','蜕变','新生'],d:'白玫瑰的黑旗，断壁中新生——结束不是终点，是蜕变的起点，放下才有手接新物。',up:'结束即重生，放下旧我迎蜕变。',down:'抗拒改变，徒增痛苦。'},
 {n:'13 节制',k:['平衡','调和','耐心'],d:'天使以两杯之水往复调和——耐心与融合，是此时最需要的品质。',up:'调和平衡，耐心融合矛盾。',down:'失衡极端，需找回中道。'},
 {n:'14 恶魔',k:['束缚','欲望','觉知'],d:'枷锁只是松松的，随时可脱——捆住你的从来不是外物，是明知而故犯的执念。',up:'觉察束缚，物质与执念的功课。',down:'深陷枷锁不自知，宜挣脱。'},
 {n:'15 高塔',k:['突变','破局','真相'],d:'雷击高塔，坠落中见光——骤然崩塌是假象崩塌，真相浮现的那一刻，恰恰是自由的开始。',up:'骤变破旧，崩塌中现真相。',down:'抗拒突变致重创，接纳方安。'},
 {n:'16 星星',k:['希望','疗愈','指引'],d:'裸身舀水于溪，群星环照——走过高塔的动荡，希望与疗愈正在安静处回场。',up:'希望疗愈，黑暗后见微光。',down:'信心动摇，先照顾自己。'},
 {n:'17 月亮',k:['迷雾','潜意识','不安'],d:'月下双塔与犬，路径幽暗——此刻看不清没关系，循着直觉走，别被幻象带走。',up:'潜意识浮现，迷雾中循直觉。',down:'恐惧幻象，勿被假象惑。'},
 {n:'18 太阳',k:['喜悦','成功','明朗'],d:'孩童跃马于花墙，日光坦荡——明亮而通透，阴霾散尽，值得庆祝当下的纯粹。',up:'明朗喜悦，诸事通透顺遂。',down:'被表象迷，回归简单。'},
 {n:'19 审判',k:['觉醒','复盘','召唤'],d:'号角唤醒亡灵，复盘与重生——过去的一切在此归档，听从召唤，重新出发。',up:'觉醒召唤，复盘过往迎新生。',down:'回避召唤，错失转机。'},
 {n:'20 世界',k:['圆满','完成','整合'],d:'花环中的舞者，四境圆满——一段旅程终于闭环，完成本身就是奖赏。',up:'圆满达成，一段旅程臻于完整。',down:'悬而未决，尚缺一念闭环。'}
];
/* 22 张大阿尔克那「当下处境」专属句：正位 now / 逆位 nowR——描述抽到此牌时当事人所处的处境与心境，补标准牌义的"此时此地" */
const TAROT_NOW={
 '0 愚者':{now:'你正站在一个全新起点，行囊空空但心里有股跃跃欲试的劲——也许该跳了。',nowR:'你急着逃离现状，但跳之前先想清楚：是真勇敢，还是真冲动。'},
 '1 魔术师':{now:'你手里其实已经攥齐了所有牌，差的只是把"想做"变成"去做"那一下。',nowR:'你总觉得还差什么、还不到时候——缺的不是资源，是信心。'},
 '2 女祭司':{now:'答案不在外面，在你心里——此刻最该做的是安静下来，听自己说话。',nowR:'你心里藏着没说出口的事，憋着反而更乱，该找个人聊聊。'},
 '3 皇后':{now:'你正在一段丰盛期，付出有回报、关系在升温——善待自己，丰盛才持续。',nowR:'你给出去太多、留给自己的太少，该收一收边界了。'},
 '4 皇帝':{now:'你正处在需要立规矩、稳秩序的阶段——先建框架，自由才有依托。',nowR:'你抓得太紧、太想掌控一切，松一点反而更稳。'},
 '5 恋人':{now:'你面前有一个重要的选择或一段值得珍惜的关系——问清自己到底要什么。',nowR:'你在关系里犹豫拉扯，厘清所求比纠结对错更重要。'},
 '6 战车':{now:'你正朝着目标全速前进，意志集中到一处——别分心，冲过去就是。',nowR:'你方向没定、力往多处使，先安内心再谈前进。'},
 '7 力量':{now:'你正面对一个需要"以柔克刚"的局面——按住脾气、稳住自己，就是最大的力量。',nowR:'你在压抑与失控间摇摆，和情绪和解比硬压更管用。'},
 '8 隐士':{now:'你需要一段独处来想清楚——孤独此刻不是惩罚，是必要的距离。',nowR:'你把自己关太久了，想清楚就别再一个人扛。'},
 '9 命运之轮':{now:'转机正在路上，顺势乘势即可——但也别在顶点忘了蓄力。',nowR:'起伏难料，你控制不了轮子，但能守住本心待轮回。'},
 '10 正义':{now:'你种下的因正在结果——此刻的权衡与公正，终会回报到你身上。',nowR:'你觉得不公平，但因果已在路上，先承担再谈翻盘。'},
 '11 倒吊人':{now:'困住了？换个角度看——你此刻的"卡住"也许正是领悟的契机。',nowR:'你在被动受苦却没想通为什么，主动转念才能解脱。'},
 '12 死神':{now:'有什么正在结束——别抓，放下了手才空出来接新的。',nowR:'你抗拒改变所以更痛，接纳了，蜕变就开始。'},
 '13 节制':{now:'你需要耐心与调和——把对立的东西慢慢融合，急不得。',nowR:'你走极端了，找回中道比硬撑更重要。'},
 '14 恶魔':{now:'你明知某件事在消耗你却停不下来——看清那个执念，枷锁其实很松。',nowR:'你深陷其中不自知，先承认"我被困住了"，挣脱才有可能。'},
 '15 高塔':{now:'有什么在崩塌——别怕，崩的是假象，真相正在浮现。',nowR:'你拼命抗拒变化只会伤更重，接纳骤变才能安。'},
 '16 星星':{now:'动荡过后，希望正在安静处回场——照顾好自己，微光会亮起来。',nowR:'你信心动摇了，先别想远方，把自己照顾好。'},
 '17 月亮':{now:'此刻看不清前路没关系，循着直觉走，别被幻象带偏。',nowR:'你被恐惧和假象困住了，得分清"想象"和"事实"。'},
 '18 太阳':{now:'阴霾散尽，明朗通透——值得庆祝当下的纯粹，别想太多。',nowR:'你被表面的光鲜迷住了，回归简单才看得清。'},
 '19 审判':{now:'过去的一切在此归档——听从内心的召唤，重新出发。',nowR:'你在回避某个该做的决定，错过转机就难再来了。'},
 '20 世界':{now:'一段旅程终于闭环——完成本身就是奖赏，好好享受。',nowR:'你悬在半空差一口气，把最后一念补上就圆满了。'}
};
/* 小阿尔克那 56 张逐张手写「当下处境」：正位 now / 逆位 nowR，按韦特牌意扩写为"此时此地" */
const MINOR_NOW={
 '权杖 Ace':{now:'一个崭新的行动窗口正打开——灵感来了，趁热把它落成第一步，别等它凉。',nowR:'你有了冲动却迟迟没动——热情在等一个落点，先迈一小步激活它。'},
 '权杖 2':{now:'你正站在两条路之间做权衡——地图已摊开，先看清手里有什么，再选方向。',nowR:'你陷入多线选择却拿不定主意——别让「完美方案」拖住你，先选一个走起来。'},
 '权杖 3':{now:'你的努力开始被看见——合作与展望正成形，宜把目光放远、把基础夯实。',nowR:'进度受阻、根基未稳——别急着扩张，先回头补上没做扎实的部分。'},
 '权杖 4':{now:'一段忙碌后迎来安稳——此刻宜休整庆祝，把已建成的守住，再谈下一步。',nowR:'你困在安逸里不肯挪窝——舒服是福，但太久不动会错过外面的机会。'},
 '权杖 5':{now:'你正卷入竞争或分歧——场面虽乱，却是展露锋芒的时机，站稳立场、别恋战。',nowR:'你在无谓的争斗里耗神——赢了面子输了里子，退一步海阔天空。'},
 '权杖 6':{now:'胜利在望，掌声将至——你此前的坚持正在被认可，大大方方收下这份荣耀。',nowR:'你赢得不太光彩或虚名过盛——胜而不骄、记得来路，别让荣誉反噬。'},
 '权杖 7':{now:'你在守阵地、顶压力——对面来势汹汹，但防线在你手里，稳住就能赢。',nowR:'你已力不从心、防线松动——硬扛不如调整，该退守就退守，留得青山在。'},
 '权杖 8':{now:'消息与行动都在加速——事情正快速推进，宜跟上节奏，别让犹豫拖慢你。',nowR:'你在匆忙中失了方向——越急越乱，先停下来对一下目标，再出发。'},
 '权杖 9':{now:'你保持着高度警觉、独自顶着——这是黎明前的深守，信任直觉，但别把自己绷太紧。',nowR:'你防备过度、疑神疑鬼——过度紧张会吓跑机会，试着松一松。'},
 '权杖 10':{now:'你肩上扛着超载的责任——能扛是本事，但也该学会分派与放手，别把自己压垮。',nowR:'你终于决定卸下一部分担子——放下不是认输，是给新机会腾出双手。'},
 '权杖 侍从':{now:'你心里正燃起一个新念头——学习、探索、尝试，此刻的你最不怕「从零开始」。',nowR:'你起了个头却热度难继——三分钟热度最误事，把目标切成小步，先坚持一周。'},
 '权杖 骑士':{now:'你带着满格冲劲在路上——热情是你的引擎，但记得带好地图，别只顾着冲。',nowR:'你冲得太快、方向未明——鲁莽的开端常以放弃收场，先定靶再加速。'},
 '权杖 王后':{now:'你用自信与温度影响身边人——此刻的你是团队里的光，站高一点，大家看得见。',nowR:'你的热情掺进了掌控欲——温暖若变成「我说了算」，人心会悄悄走远。'},
 '权杖 国王':{now:'你站在掌舵的位置，局面尽在掌握——成熟而笃定，稳住基本盘，引领众人向前。',nowR:'你的权威用得太满——独断会关上进言的门，试着听一听不同的声音。'},
 '圣杯 Ace':{now:'一股新的情感或灵感正涌上心头——敞开接收它，无论是爱、友谊还是直觉，都值得善待。',nowR:'你关着心门、爱意流动不畅——先让自己柔软下来，情感才会流到你身边。'},
 '圣杯 2':{now:'一段关系正处在对等的甜蜜里——互相给予、彼此看见，此刻的联结值得用心维护。',nowR:'关系里出现了失衡或错位——别猜，把感受说出来，沟通是唯一的桥。'},
 '圣杯 3':{now:'你正被朋友与欢聚包围——庆祝当下的情谊，这份热闹是真实的滋养。',nowR:'热闹背后的你有几分空虚——社交再多也填不满内心的洞，先陪陪自己。'},
 '圣杯 4':{now:'你已拥有不少，却有点提不起劲——停一停，看见手里的福气，知足不是停止前进。',nowR:'你冷淡疏离、错过了眼前的善意——别让「没感觉」推走真正在乎你的人。'},
 '圣杯 5':{now:'你正为失去而失落——允许自己难过，但别让悲伤盖住身后还在的三只杯子。',nowR:'你开始放下那段缺憾——转过身，新的可能就在你回头的那一刻。'},
 '圣杯 6':{now:'旧日的温情正在回访——故人、旧事或儿时记忆带来暖意，宜感恩，也宜向前看。',nowR:'你沉溺在过去不愿出来——回忆是糖不是饭，吃多了会忘了现在的生活。'},
 '圣杯 7':{now:'你面前飘着许多诱人的幻象——选择太多反而危险，分清哪些是真的、哪些只是好看。',nowR:'你意识到有些期待落了空——幻灭虽痛，却是清醒的开始，回到现实里找答案。'},
 '圣杯 8':{now:'你正决定离开一段不再滋养你的状态——转身需要勇气，但走远一点，才看得见新的水源。',nowR:'你放不下旧情、困在原地——牵绊如果只剩重量，放下反而是成全自己。'},
 '圣杯 9':{now:'你想要的正在一一兑现——享受这份满足，也记得这份丰盛里有运气、更有你的经营。',nowR:'你靠外物填内心却仍空——幸福从不只在「拥有」里，先和自己和解。'},
 '圣杯 10':{now:'家庭与情感迎来圆满的画面——家人的温暖、关系的归宿，此刻值得好好珍惜。',nowR:'关系的美好表象下有重压——别把「完美」当负担，真实比体面更重要。'},
 '圣杯 侍从':{now:'你的心被某个温柔的想法轻轻触动——创意与好感正在萌发，顺着这份纯真去探索。',nowR:'你的情绪像风一样多变——想法很多却都浅尝辄止，先认准一样，养深它。'},
 '圣杯 骑士':{now:'你正带着温柔走向心之所向——浪漫与诚意都在路上，但别把承诺说得太满。',nowR:'你的心意漂浮不定——今天深情明天疏远，先问自己到底想要什么。'},
 '圣杯 王后':{now:'此刻的你是情绪的容器、关系的疗愈者——你的包容正在滋养他人，也别忘了滋养自己。',nowR:'你的情绪如潮水漫过边界——依赖太深会累，先稳住自己的船，再渡人。'},
 '圣杯 国王':{now:'你以成熟的从容经营着情感与生活——不慌不忙、宽厚稳定，是你此刻最好的状态。',nowR:'你习惯把情绪锁进抽屉——成熟不等于冷漠，适当流露，关系才透气。'},
 '宝剑 Ace':{now:'真相与洞见正在劈开迷雾——此刻你的判断格外清晰，抓住它，别被情绪带偏。',nowR:'你思绪混乱、误判失真——先别急着下结论，把事实摆开，再重新推理。'},
 '宝剑 2':{now:'你正被两难困住、蒙眼权衡——回避解决不了问题，摘下眼罩，把利弊摊开来看。',nowR:'你明知该选却一直拖——自欺最耗人，承认纠结，答案才会出现。'},
 '宝剑 3':{now:'你正经历一阵心痛或难言的伤——允许它疼，伤口会自己长好，别用更多刀去割。',nowR:'最痛的时刻正在过去——你在愈合，痛感下降时，记得把碎掉的部分重新拼起来。'},
 '宝剑 4':{now:'你被建议「停下来」——疲惫是信号，此刻的休整不是偷懒，是让脑子清空重装。',nowR:'你躺着不动却心里不安——休整不是逃避，给自己一个期限，再起来面对。'},
 '宝剑 5':{now:'你赢了争执却可能输了人心——言语锋利时收一收，赢了场面，别输掉关系。',nowR:'和解的机会正在靠近——主动示好不丢人，僵局里先伸手的人更有力量。'},
 '宝剑 6':{now:'你正在驶离一段艰难的水域——船在走、岸在远，此刻的平静是过渡的恩赐。',nowR:'你还停在原地、不肯出发——放下不是忘记，是允许自己继续走。'},
 '宝剑 7':{now:'你在用智谋周旋、兵不厌诈——策略没错，但别玩火，留一分坦荡给自己。',nowR:'你的小聪明可能弄巧成拙——计划落空时，诚实往往比计谋更省事。'},
 '宝剑 8':{now:'你困在自己的念头里动弹不得——束缚你的多半是「以为」，试着一只脚先跨出去。',nowR:'你开始看见那扇门其实没锁——真相在松动，挣脱就在一念之间。'},
 '宝剑 9':{now:'深夜的焦虑正缠着你——想太多是最大的失眠药，写下来、说出去，天会亮。',nowR:'你的忧虑正在退潮——放下手机、安顿呼吸，宁静会回来的。'},
 '宝剑 10':{now:'你正经历一场彻底的崩塌——痛到极点是转机的前夜，旧的碎了，新的才能进来。',nowR:'你在触底后开始上浮——最难的一关已过，接下来的每一步都是向上。'},
 '宝剑 侍从':{now:'你对某个信息或想法格外好奇——保持这份敏锐，多听多看，答案藏在细节里。',nowR:'你轻信或妄断了什么——舌头是把刀，话出口前先核实三遍。'},
 '宝剑 骑士':{now:'你带着锐气直扑真相——果断是你的优势，但也别让速度碾过该细看的部分。',nowR:'你的言行过于鲁莽——慢半拍、稳一稳，锋芒收一点更锋利。'},
 '宝剑 王后':{now:'你以清明与洞察看清了全局——理智是你的铠甲，此刻的判断可信，也别忘了温度。',nowR:'你的理性变得苛刻——冷峻会把人气走，试着给判断加一点宽容。'},
 '宝剑 国王':{now:'你站在思辨的高处，判断公正有力——以理服人时，你最有分量。',nowR:'你的权威流于专断——道理讲通了，姿态放软点，听的人才会真的信服。'},
 '星币 Ace':{now:'一个新的机会落在实处——钱、工作或身体层面的新起点，抓住它，让它生根。',nowR:'机会出现过却没能落地——别懊恼，回看卡在哪一步，重新种一次。'},
 '星币 2':{now:'你正同时应付几摊事——平衡是此刻的关键词，稳住重心，别让任何一头塌了。',nowR:'你顾此失彼、手忙脚乱——先放下次要的，专注把最重要的一件做好。'},
 '星币 3':{now:'你的专业正在被需要——合作与建设正在进行，把手艺亮出来，成果会替你说话。',nowR:'你上手生疏、配合失调——别逞强，请教、多练，熟练会掩盖一切尴尬。'},
 '星币 4':{now:'你在守财、守成果——稳是好事，但别把「守住」活成「攥紧」，该流动的要流动。',nowR:'你攥得太紧、不肯放手——握紧的拳头接不住新东西，松一点试试。'},
 '星币 5':{now:'你正经历一段匮乏或紧张——钱紧、资源少，但这只是冬天，先节流、再找出路。',nowR:'转机正悄悄靠近——最难的坎已经迈过，亮光在来的路上。'},
 '星币 6':{now:'你在施与受之间找到平衡——帮人也被帮，此刻的慷慨会在别处回流。',nowR:'你的给予带着条件——施恩图报会让善意变味，纯粹一点，关系才干净。'},
 '星币 7':{now:'你种下的东西正在缓慢生长——急不来，此刻的耐心就是最好的肥料，等着就好。',nowR:'你松懈了、投入变少——果实不会自己成熟，重新浇灌，别让之前的努力白费。'},
 '星币 8':{now:'你正专注于打磨一门手艺——重复是枯燥的，但每一遍都在加深你的不可替代。',nowR:'你钻进了低效的牛角尖——停下来看看方法，别用忙碌假装进步。'},
 '星币 9':{now:'你凭本事挣来了丰足与自在——此刻值得享受独处的富足，也记得分享一些给世界。',nowR:'你守着钱却守着焦虑——财富是工具不是奖杯，放它流动，心才松。'},
 '星币 10':{now:'家业与根基呈现长久的安稳——你站在积累的顶端，这份富足是几代人的共同成果。',nowR:'财富成了关系与生活的重压——钱是为人服务的，别让它反过来压住家。'},
 '星币 侍从':{now:'你正踏实地学习一门真本事——从小处练起，根基打牢，未来才撑得住。',nowR:'你眼高手低、落不了地——先把手弄脏，从最小的事开始做，别光想。'},
 '星币 骑士':{now:'你正一步一个脚印地稳步前进——慢但笃定，坚持到点，回报自然会来。',nowR:'你的进度过于迟缓——稳不等于拖，给自己设个节点，逼一逼进度。'},
 '星币 王后':{now:'你用务实与温柔把生活打理得丰饶——持家有道、滋养有方，此刻的你就是安定的中心。',nowR:'你把心都拴在物质上——留意身边人的情感需求，钱买不来温度。'},
 '星币 国王':{now:'你以稳健与成就立身——你挣来的不只是财富，更是让人安心的分量。',nowR:'你守财守到僵化——不变通会错过时代，试着让经验听一听新办法。'}
};
/* 小阿尔克那「当下处境」：花色领域（×2变体，哈希选）+ 数字阶段/宫廷角色（正逆），规则生成去模板——56 张不再空白 */
function minorNowHTML(t,rev){
  const m=/^(权杖|圣杯|宝剑|星币)\s*(.+)$/.exec(t.n||''); if(!m) return '';
  const suit=m[1], rank=m[2];
  const suitNow={
    '权杖':['（权杖·火）此刻行动与热情是主旋律——想推进的事已经烧起来了，宜对准最要紧的一件用力。','（权杖·火）你的处境正被干劲主导，主动出击的时机到了，别让热情停在纸上。'],
    '圣杯':['（圣杯·水）眼下感受与关系是重心——跟着心走，但先分清是直觉还是情绪。','（圣杯·水）情感浓度正高，关系与内心戏占据舞台，宜多表达、少猜疑。'],
    '宝剑':['（宝剑·风）你的处境正卡在想法与沟通上——理清思绪、把话说开，是第一要务。','（宝剑·风）此刻头脑高速运转，抉择与言辞牵动全局，想清楚再开口。'],
    '星币':['（星币·土）当下是务实收成的阶段——把手头事做扎实，钱与身体都会回报你。','（星币·土）物质与生活秩序是此刻重心，稳住基本盘，再图扩展。']
  };
  let stage='';
  if(rank==='Ace') stage= rev?'刚起头却遇反复，宜稳不宜急':'正处萌芽，宜播种不宜求速成';
  else if(/^[2-9]$|^10$/.test(rank)){ const n=+rank;
    if(n<=3) stage= rev?'起手不顺，宜调整心态再出发':'起步在望，宜把小步走实';
    else if(n<=6) stage= rev?'推进遇阻，宜放慢节奏':'进入磨合期，稳住节奏即可';
    else stage= rev?'行至关键却显吃力，宜收宜审':'行至关键处，宜审慎下注'; }
  else if({'侍从':'学习与讯息','骑士':'行动与追逐','王后':'滋养与成熟','国王':'掌控与权威'}[rank]){
    const COURT_NOW={
      '侍从':[rev?'你在学习吸收却易分心，宜专注':'你正处在学习与接收讯息的阶段，多听多问'],
      '骑士':[rev?'你有冲劲但方向未定，宜先定靶':'你正带着冲劲追赶目标，别停也别乱'],
      '王后':[rev?'你在滋养他人却忘了自己，宜自爱':'你正处于滋养与成熟的阶段，照顾好自己即顾全局'],
      '国王':[rev?'你掌控欲过强，宜放权':'你正处在掌控与权威的位置，稳重即底气']
    };
    stage=COURT_NOW[rank][rev?1:0];
  }
  const base=suitNow[suit][_hashStr(t.n)%suitNow[suit].length];
  return stage?base+' '+stage:base;
}
/* 小阿尔克那 56 张（权杖·圣杯·宝剑·星币，莱德韦特牌义） */
const MINOR=[
 // 权杖 Wands（火/行动）
 {n:'权杖 Ace',up:'新起点与灵感迸发，行动力涌动。',down:'拖延犹豫，热情未启、计划搁置。'},
 {n:'权杖 2',up:'权衡规划，多线并行初有章法。',down:'犹豫不决，计划混乱精力分散。'},
 {n:'权杖 3',up:'奠基突破，团队协作初见成果。',down:'进度受阻，基础未稳需返工。'},
 {n:'权杖 4',up:'稳固休整，积蓄能量守成。',down:'停滞不前，固守安逸失机。'},
 {n:'权杖 5',up:'竞争冲突，力争上游显锋芒。',down:'无谓内耗，争斗徒劳伤身。'},
 {n:'权杖 6',up:'胜利凯旋，获公开认可。',down:'胜而失道，荣誉受损虚名。'},
 {n:'权杖 7',up:'以寡敌众，坚守防线不退。',down:'力不从心，防线将破宜退。'},
 {n:'权杖 8',up:'迅捷行动，消息速达风风火火。',down:'方向迷失，匆忙反致延误。'},
 {n:'权杖 9',up:'警惕防备，坚守既有阵线。',down:'过度防备，疑神疑鬼失机。'},
 {n:'权杖 10',up:'重任在肩，责任超载前行。',down:'卸下重担，转机将现宜放手。'},
 {n:'权杖 侍从',up:'探索热忱，新学习计划萌生。',down:'三分钟热度，浮躁难成。'},
 {n:'权杖 骑士',up:'勇往直前，热情驱动行动。',down:'鲁莽冲动，半途而废。'},
 {n:'权杖 王后',up:'自信温暖，魅力型领导。',down:'控制欲强，情绪化用事。'},
 {n:'权杖 国王',up:'成熟掌控，有远见的领导。',down:'专断独行，滥用权威。'},
 // 圣杯 Cups（水/情感）
 {n:'圣杯 Ace',up:'爱意涌现，情感新生与丰沛。',down:'情感封闭，爱意未得流动。'},
 {n:'圣杯 2',up:'平衡互动，关系和谐对等。',down:'失衡紧张，沟通错位。'},
 {n:'圣杯 3',up:'欢聚庆祝，友谊情谊交融。',down:'表面热闹，过度社交空虚。'},
 {n:'圣杯 4',up:'满足静守，珍惜已有之福。',down:'冷淡疏离，错失眼前良机。'},
 {n:'圣杯 5',up:'失落忧愁，情感有缺憾。',down:'释怀放下，走出悲伤。'},
 {n:'圣杯 6',up:'怀旧美好，善意回赠与温情。',down:'沉溺过往，不愿向前。'},
 {n:'圣杯 7',up:'幻想纷呈，多重情感抉择。',down:'幻灭虚无，不切实际。'},
 {n:'圣杯 8',up:'放下执念，情感释出前行。',down:'难以割舍，困于旧情。'},
 {n:'圣杯 9',up:'情感丰盈，心想事成自足。',down:'依赖外求，内心仍空虚。'},
 {n:'圣杯 10',up:'家庭美满，情感圆满归宿。',down:'关系负担，家业压力缠身。'},
 {n:'圣杯 侍从',up:'情感纯真，创意与好奇萌生。',down:'情绪化，不成熟易变。'},
 {n:'圣杯 骑士',up:'浪漫追求，温柔表达心意。',down:'多情善变，漂浮不定。'},
 {n:'圣杯 王后',up:'共情包容，情感丰饶滋养。',down:'过度依赖，情绪泛滥失控。'},
 {n:'圣杯 国王',up:'情感成熟，从容而能滋养。',down:'回避情感，冷漠疏离。'},
 // 宝剑 Swords（风/思维）
 {n:'宝剑 Ace',up:'清明洞见，真相浮现。',down:'思绪混乱，误判失真。'},
 {n:'宝剑 2',up:'权衡抉择，进退维谷。',down:'逃避决定，自欺欺人。'},
 {n:'宝剑 3',up:'心碎痛楚，创伤中醒悟。',down:'释然愈痕，苦痛将过。'},
 {n:'宝剑 4',up:'静养复原，暂作休整。',down:'倦怠拖延，不肯面对。'},
 {n:'宝剑 5',up:'纷争失利，言语伤人。',down:'和解在即，创伤平复。'},
 {n:'宝剑 6',up:'过渡前行，走出困境。',down:'滞留原地，不愿放下。'},
 {n:'宝剑 7',up:'以谋取胜，坚守策略。',down:'弄巧成拙，计划落空。'},
 {n:'宝剑 8',up:'自我设限，受困束缚。',down:'解脱在望，真相将明。'},
 {n:'宝剑 9',up:'焦虑忧惧，深夜思虑。',down:'释忧安眠，重获宁静。'},
 {n:'宝剑 10',up:'终结崩坏，痛苦至极点。',down:'触底重生，苦难将过。'},
 {n:'宝剑 侍从',up:'求知敏锐，信息探索。',down:'多疑轻率，言语伤人。'},
 {n:'宝剑 骑士',up:'敏锐行动，追求真相。',down:'冲动刻薄，言行鲁莽。'},
 {n:'宝剑 王后',up:'清明理智，客观洞察。',down:'冷峻苛刻，孤立自持。'},
 {n:'宝剑 国王',up:'思辨权威，公正判断。',down:'专横武断，冷酷无情。'},
 // 星币 Pentacles（土/物质）
 {n:'星币 Ace',up:'新机缘至，财务或身体新生。',down:'错失良机，落地困难。'},
 {n:'星币 2',up:'平衡 juggling，多线务实。',down:'顾此失彼，失衡失序。'},
 {n:'星币 3',up:'学以致用，协作建树。',down:'生疏失当，配合失调。'},
 {n:'星币 4',up:'守成积蓄，稳健持守。',down:'吝啬固守，不肯放手。'},
 {n:'星币 5',up:'匮乏困顿，物质短缺。',down:'转机将至，困境将解。'},
 {n:'星币 6',up:'施受有度，公平互助。',down:'施恩图报，关系不对等。'},
 {n:'星币 7',up:'耐心经营，静待收获。',down:'懈怠懒散，投入无果。'},
 {n:'星币 8',up:'精进熟练，专注打磨。',down:'钻牛角尖，低效空转。'},
 {n:'星币 9',up:'丰足自在，独享成果。',down:'物质焦虑，守财为累。'},
 {n:'星币 10',up:'长久安稳，家族富足。',down:'财富成压，家业负重。'},
 {n:'星币 侍从',up:'踏实学习，掌握新技能。',down:'眼高手低，懒散不实。'},
 {n:'星币 骑士',up:'勤恳执行，稳健前行。',down:'固执迟缓，进展滞阻。'},
 {n:'星币 王后',up:'务实滋养，丰饶持家。',down:'执念物质，忽视情感。'},
 {n:'星币 国王',up:'务实领导，稳健成就。',down:'守财僵化，不通权变。'}
];
const TAROT_ALL=TAROT.concat(MINOR);
/* 塔罗解读增强：关键字 + 行动提示（借鉴 Tarot-Insight 的"关键字+指引"结构） */
const SUIT_BASE={'权杖':'行动与热情','圣杯':'情感与关系','宝剑':'思维与抉择','星币':'物质与稳固'};
const NUM_KEY=['','开端与灵感','选择与权衡','奠基与协作','稳固与休整','竞争与突破','胜利与认可','坚守与防卫','迅速与进展','警惕与筹备','完成与承载'];
const COURT_KEY={'侍从':'学习与讯息','骑士':'行动与追逐','王后':'滋养与成熟','国王':'掌控与权威'};
/* 行动指引：每花色正/逆各 4 句，按牌名哈希选取——同花色不同牌也不同句，避免"复制感" */
const ADV_POOL2={
  '权杖':{pos:['把热情落成行动，别让计划停在纸上','冲劲是资本，冲之前先定个方向','想得太多不如先动一步，热情需要落地','主动出击，别等局面替你做决定'],
          neg:['冲太快容易失控，先踩一脚再发力','计划没定就先别冲，方向比速度重要','热情被消耗时，先补回自己的能量','别把冲动当勇气，先看清楚再出手']},
  '圣杯':{pos:['跟着感受走，但别被情绪牵着跑','关系里的诚意，比聪明更重要','把心意说出口，别让人猜','多倾听，感情的温度在细节里'],
          neg:['情绪上头时先别做决定','别用冷战和猜疑消耗关系','先安抚自己，再去经营关系','心里的话没说出口，关系就隔着距离']},
  '宝剑':{pos:['把想说的话理清楚再说','坦诚沟通，别让猜疑放大','想清楚再开口，一句话能成事也能坏事','该摊开谈的就摊开谈，回避解决不了问题'],
          neg:['话说得太冲，容易伤人伤己','别急着反驳，先听完对方','思绪乱的时候，写下来再决定','过度分析会卡住行动，先动起来']},
  '星币':{pos:['务实一点，先把手头的事做扎实','慢就是快，稳住节奏才有回报','把资源盘点清楚，再决定怎么投','守住基本盘，再图扩展'],
          neg:['守得太死会错过机会','别只盯着眼前利益，看长远','付出与回报失衡时，先调整再继续','物质焦虑时，先照顾好基本盘']},
  '大牌':{pos:['这一局看大势，顺势而为即可','信任过程，答案会自己浮现','先稳住内心，外界自然清明','该放下的放下，新的才会进来'],
          neg:['这阶段的功课在内心，不在外界','别与命运硬碰，先转念再行动','执念是最大的阻力，松手才有出路','先安顿自己，再谈改变']}
};
function tarotHint(t,rev){
  const m=/^(权杖|圣杯|宝剑|星币)/.exec(t.n||'');
  const suit=m?m[1]:'大牌';
  const pool=ADV_POOL2[suit]||ADV_POOL2['大牌'];
  const arr=rev?pool.neg:pool.pos;
  const idx=_hashStr(t.n+(rev?'r':''))%arr.length;
  return (rev?'逆位提示：':'行动指引：')+arr[idx];
}
/* 多牌阵位置专属融合解读：把"位置含义"与"牌意/花色/正逆"双轴结合，生成专属句（借鉴专业塔罗"位置 + 牌"双轴解读，避免每位置都贴同一段标准牌义） */
const POS_GROUP={
  '回溯':['过去','根基','从何而来','旧有的模式','旧有模式'],
  '当下':['现状','现在','我','关系','自我','当下的核心张力或甜蜜','当下的处境与真实诉求','当下的状态','关系当下的核心张力或甜蜜'],
  '前瞻':['未来','走向','结果','年末','未来的可能走向','可能的最终走向','关系未来的可能走向','正向你走来的趋势'],
  '张力':['挑战','机会与阻力','阻碍','核心张力'],
  '行动':['建议','行动方向','希望与恐惧'],
  '外部':['他人','对方','环境','对方或旁人','对方此刻的真实状态']
};
function _posGroup(pn){ for(const g in POS_GROUP){ if(POS_GROUP[g].indexOf(pn)>=0) return g; } return '当下'; }
const POS_FUSE_POOL={
  '回溯':[
    '（{pn}）这段经历里，「{name}·{revT}」像是未灭的余烬——{suitD}的旧因仍在回响，宜回头看清、而非回避，方能真正翻篇。',
    '（{pn}）「{name}·{revT}」提示旧事未了：{suitD}的能量曾在此盘旋，如今看来，正是它的余波塑造了你的当下。',
    '（{pn}）回望「{name}·{revT}」：{suitD}的因早已种下，此刻它仍在暗处发酵，承认它的存在，才是放下的开始。'
  ],
  '当下':[
    '（{pn}）此刻「{name}·{revT}」正落在你手边——{suitD}是当下的主轴，先把眼前这一步接住，别急着望远。',
    '（{pn}）「{name}·{revT}」照见现状：{suitD}正主导此刻的能量场，看清它，便看清了现在该往哪使力。',
    '（{pn}）「{name}·{revT}」就站在你面前：{suitD}是此时此地的主题，与它共处、而非对抗，局面才稳。'
  ],
  '前瞻':[
    '（{pn}）往前看，「{name}·{revT}」已在地平线浮现——{suitD}的能量正在走来，宜提前布局、顺势接住。',
    '（{pn}）「{name}·{revT}」指向将至的趋势：{suitD}将主导未来一段，早做准备者占先，临阵者被动。',
    '（{pn}）「{name}·{revT}」是未来的伏笔：{suitD}的能量正在汇聚，顺其势者得助、逆其势者费劲。'
  ],
  '张力':[
    '（{pn}）横在前路的「{name}·{revT}」即此关——{suitD}的张力需要被正视，绕开它，它会以别的形式再来。',
    '（{pn}）「{name}·{revT}」是这局的卡点：{suitD}在此形成阻力，宜先破此结，余绪自顺。',
    '（{pn}）「{name}·{revT}」亮出挑战：{suitD}的拉扯最耗神，把它摆上台面谈开，比憋着强。'
  ],
  '行动':[
    '（{pn}）「{name}·{revT}」给出的路标指向{suitD}——宜朝这个方向落子，少犹豫、多动手。',
    '（{pn}）「{name}·{revT}」是给行动的答案：{suitD}在此最该被践行，照它走，弯路最少。',
    '（{pn}）「{name}·{revT}」教你怎么动：把{suitD}落到实处，比反复谋划更接近结果。'
  ],
  '外部':[
    '（{pn}）「{name}·{revT}」映出他者——{suitD}的能量来自外界或对方，宜读懂这面镜子，再定自己的步。',
    '（{pn}）「{name}·{revT}」关乎环境与旁人：{suitD}在外部流动，顺势借力、莫要硬抗。',
    '（{pn}）「{name}·{revT}」照见关系里的另一人：{suitD}在对方身上显形，先接住对方的状态，再谈你的。'
  ]
};
function posFuse(pn,t,rev){
  const m=/^(权杖|圣杯|宝剑|星币)/.exec(t.n||'');
  const suit=m?m[1]:'大牌';
  const suitD={'权杖':'行动与热情','圣杯':'情感与关系','宝剑':'思维与抉择','星币':'物质与稳固','大牌':'人生大势'}[suit];
  const revT=rev?'逆位':'正位';
  const g=_posGroup(pn);
  const arr=POS_FUSE_POOL[g]||POS_FUSE_POOL['当下'];
  const idx=_hashStr(pn+'|'+t.n+'|'+(rev?'r':''))%arr.length;
  return arr[idx].replace(/\{pn\}/g,pn).replace(/\{name\}/g,t.n).replace(/\{revT\}/g,revT).replace(/\{suitD\}/g,suitD);
}
/* 小牌"牌面意象"：花色元素义 + 数字/宫廷义（规则生成，替代逐张手写） */
const SUIT_DETAIL={
  '权杖':'属火元素，对应行动、热情与开创——牌面暗示的能量要靠"动起来"来兑现',
  '圣杯':'属水元素，对应情感、直觉与关系——牌面重心在心的流向，而非算计',
  '宝剑':'属风元素，对应思维、沟通与抉择——牌面提示先理清念头，再谈行动',
  '星币':'属土元素，对应物质、健康与积累——牌面落在实处，讲究耕耘与回报'
};
const NUM_DETAIL=['','新的契机萌芽，值得把第一步迈出去','一次取舍，两条路都要看清代价','合作与奠基，先稳根基再图高楼','安顿与休整，守成也是一种前进','竞争与突破，锋芒要用在关键处','胜利与认可，成果开始被看见','坚守与防线，撑住这一段就有转机','进展迅速，抓住流动的窗口','接近完成，收尾时更要细致','一段周期的完成，圆满里带着新机'];
const COURT_DETAIL={'侍从':'带来讯息与学习的机会，宜以谦逊之心接手','骑士':'带着目标向前冲，行动力是双刃剑，方向要先定','王后':'成熟而滋养，把内在的力量转化为照拂','国王':'掌控局面者，凭经验与权威稳住大局'};
function tarotDetail(t){
  if(t.d) return t.d;
  const m=/^(权杖|圣杯|宝剑|星币)\s*(.+)$/.exec(t.n||'');
  if(!m) return '';
  // Ace 按花色给不同白话（数字/宫廷规则覆盖不到），其余按数字或宫廷义生成
  let rk;
  if(m[2]==='Ace') rk=ACE_BY_SUIT[m[1]]||'新的起点落下一颗种子，值得认真对待';
  else rk=COURT_DETAIL[m[2]]||NUM_DETAIL[parseInt(m[2],10)||0];
  return (rk||'')+'。';   // 花色元素义已在关键字里（如"宝剑·思维与抉择"），白话不再重复前缀
}
const ACE_BY_SUIT={
  '权杖':'行动的种子落土——一个大胆的念头，值得立刻试一步',
  '圣杯':'情感的种子落土——一段心意正在萌芽，值得认真对待',
  '宝剑':'思想的种子落土——一个新的判断成形，先想清楚再用',
  '星币':'机会的种子落土——一个实在的契机来了，别让它被忽略'
};
function tarotKeys(t){
  if(t.k) return t.k.slice(0,3);
  const m=/^(权杖|圣杯|宝剑|星币)\s*(.+)$/.exec(t.n||'');
  if(!m) return [];
  const suit=m[1], rank=m[2];
  const rk=COURT_KEY[rank]||NUM_KEY[parseInt(rank,10)||0];
  return [suit+' · '+SUIT_BASE[suit], rk].filter(Boolean);
}
function tarotBenmingHTML(){
  const wu=window.__baziDayWu, yong=window.__baziYong, ji=window.__baziJi, qiang=window.__baziQiang;
  if(!wu) return '';
  let s='你本命日主为 <b>'+wu+'</b>'+(qiang?('（'+qiang+'）'):'');
  if(yong&&yong.length) s+='，喜用 <b>'+yong.join('/')+'</b>';
  if(ji&&ji.length) s+='，忌 <b>'+ji.join('/')+'</b>';
  s+='。此牌入眼，宜以喜用五行观其生扶、以忌神观其耗损——顺势者助、逆势者守。';
  return '<div style="margin-top:10px;padding:10px 14px;border-left:3px solid var(--gold2);background:var(--r-subbg);font-size:13px;line-height:1.85"><b style="color:var(--gold2)">本命参照</b><p style="margin-top:4px">'+s+'</p><p style="color:var(--muted);font-size:11.5px;margin-top:4px">* 已在「八字命盘」算过真实旺衰喜用后此处自动联动；未算则仅作牌义参考。</p></div>';
}
/* 单张解读区块（关键字标签 + 牌义 + 牌面意象 + 指引） */
function tarotReadingHTML(t,rev){
  const keys=tarotKeys(t);
  const detail=tarotDetail(t);
  return '<div class="result"><h3>'+t.n+(rev?'（逆位）':'（正位）')+'</h3>'
    +(keys.length?'<div style="margin:6px 0 8px">'+keys.map(k=>'<span class="tag">'+k+'</span>').join('')+'</div>':'')
    +'<p style="line-height:1.95">'+(rev?t.down:t.up)+'</p>'
    +(detail?'<div class="tarot-detail" style="margin-top:8px;padding:8px 12px;border-left:3px solid var(--cinnabar);background:var(--r-subbg);font-size:13px;line-height:1.85"><b>白话解读</b><p style="margin-top:4px">'+detail+'</p></div>':'')
    +((TAROT_NOW[t.n]||MINOR_NOW[t.n])?'<div style="margin-top:8px;padding:8px 12px;border-left:3px solid #5a8a6a;background:var(--r-subbg);font-size:13px;line-height:1.85"><b>当下处境</b><p style="margin-top:4px">'+(TAROT_NOW[t.n]?(rev?TAROT_NOW[t.n].nowR:TAROT_NOW[t.n].now):(MINOR_NOW[t.n]?(rev?MINOR_NOW[t.n].nowR:MINOR_NOW[t.n].now):minorNowHTML(t,rev)))+'</p></div>':'')
    +'<p style="margin-top:8px;padding:8px 12px;border-left:3px solid var(--golden);background:var(--r-subbg);font-size:13px;line-height:1.8">'+tarotHint(t,rev)+'</p>'
    +'<p style="color:var(--muted);font-size:12px;margin-top:8px">'+(rev?'逆位多提示内省与调整；宜先看清执念，再图行动。':'正位多提示顺势与彰显；把握当下，主动迈出。')+'</p>'+tarotBenmingHTML()+'</div>';
}
function pickTarot(){ const t=TAROT_ALL[Math.floor(Math.random()*TAROT_ALL.length)]; return {t,rev:Math.random()<0.35}; }
function _elemClass(t){ const e=cardElem(t); return 'elem-'+({'火':'fire','水':'water','风':'wind','土':'earth'}[e]||'major'); }
function cardTilt(el,ev){
  const r=el.getBoundingClientRect();
  if(!r.width) return;
  const px=(ev.clientX-r.left)/r.width-0.5, py=(ev.clientY-r.top)/r.height-0.5, m=9;
  el.style.transform='rotateX('+(-py*m).toFixed(2)+'deg) rotateY('+(px*m).toFixed(2)+'deg) translateZ(16px) scale(1.05)';
}
function cardUntilt(el){ el.style.transform=''; }
function setCard(el,t,rev){
  el.classList.remove('flip'); el.style.transform='';
  el.className='tcard '+_elemClass(t)+(rev?' rev':'');
  el.innerHTML=tarotCardSVG(t.n,rev)+'<span class="tc-sheen"></span>';
  el.dataset.n=t.n; el.dataset.rev=rev?'1':'0';
  el.onmousemove=(e)=>cardTilt(el,e);
  el.onmouseleave=()=>cardUntilt(el);
  void el.offsetWidth; el.classList.add('flip');
}
function shuffleStage(stage){
  let s=''; for(let i=0;i<5;i++) s+='<span></span>';
  stage.innerHTML='<div class="shuffle-deck">'+s+'</div>';
  const sh=stage.querySelector('.shuffle-deck'); void stage.offsetWidth; if(sh) sh.classList.add('go');
}
/* 单张抽取（扇形直觉选牌：点击即铺开 12 张牌背 → 凭直觉点选 → 翻牌揭示；无洗牌前奏，零等待直接进选牌） */
let _tarotTimer=null;   // 单张/三牌阵共用 stage，后点者先清前者的 timer，避免回调竞态覆盖结构
document.getElementById('tarotBtn').onclick=()=>{
  if(_tarotTimer){ clearTimeout(_tarotTimer); _tarotTimer=null; }
  const stage=document.getElementById('tarotStage'); const res=document.getElementById('tarotResult');
  stage.className='tarot-stage';
  const pool=[...TAROT_ALL].sort(()=>Math.random()-0.5).slice(0,12);
  // 扇形逐张弹开（每张交错 45ms，取代原"洗牌中"前奏，铺开本身即仪式）
  stage.innerHTML='<div class="tarot-fan">'+pool.map((t,i)=>'<div class="fan-card" data-i="'+i+'" style="--fr:'+((i-5.5)*3.4).toFixed(1)+'deg;animation-delay:'+(i*0.045).toFixed(3)+'s"><div class="fc-inner">🂠</div></div>').join('')
    +'</div><div class="fan-hint">凭直觉，选一张</div>';
  res.innerHTML='<div class="result" style="color:var(--muted)">牌已铺开，静心感受，凭直觉选一张…</div>';
  const cards=stage.querySelectorAll('.fan-card');
  let done=false;
  const pick=(el,i)=>{
    if(done) return; done=true;
    if(_tarotTimer){ clearTimeout(_tarotTimer); _tarotTimer=null; }
    cards.forEach(c=>{ if(c!==el) c.classList.add('out'); });
    el.classList.add('picked'); el.classList.add('reveal');
    const t=pool[i]; const rev=Math.random()<0.35;
      el.className='fan-card picked reveal '+_elemClass(t)+(rev?' rev':'');
      el.innerHTML=tarotCardSVG(t.n,rev)+'<span class="fc-sheen"></span>';
      el.dataset.n=t.n; el.dataset.rev=rev?'1':'0';
      el.onmousemove=(e)=>cardTilt(el,e); el.onmouseleave=()=>cardUntilt(el);
      el.addEventListener('animationend',()=>el.classList.remove('reveal'),{once:true});
      res.innerHTML=tarotReadingHTML(t,rev);
    };
  cards.forEach((el,i)=>{ el.onclick=()=>pick(el,i); });
  _tarotTimer=setTimeout(()=>{ if(!done) pick(cards[0],0); },18000);
};
/* 三牌阵（过去 / 现在 / 未来，借鉴 TarotWhisper 的多牌阵布局） */
document.getElementById('tarotSpreadBtn').onclick=()=>{
  if(_tarotTimer){ clearTimeout(_tarotTimer); _tarotTimer=null; }
  const stage=document.getElementById('tarotStage'); const res=document.getElementById('tarotResult');
  const pos=['过去','现在','未来']; const picks=pos.map(()=>pickTarot());
  stage.className='tarot-stage spread';
  stage.innerHTML=pos.map(p=>`<div class="tcell"><div class="tcard"><div class="shuffle-deck"><span></span><span></span><span></span><span></span><span></span></div></div><span class="pos">${p}</span></div>`).join('');
  stage.querySelectorAll('.shuffle-deck').forEach(s=>s.classList.add('go'));
  res.innerHTML='<div class="result" style="color:var(--muted)">洗牌中，静心想着你的问题…</div>';
  _tarotTimer=setTimeout(()=>{
    const cells=stage.querySelectorAll('.tcard');
    cells.forEach(c=>c.closest('.tcell').classList.add('deal'));
    picks.forEach((p,i)=>setCard(cells[i],p.t,p.rev));
    // 三牌阵趋势总结（借鉴 TarotCards 结果分块：时间线 + 整体趋势）
    const ups=picks.filter(p=>!p.rev).length;
    const majors=picks.filter(p=>TAROT.some(x=>x.n===p.t.n)).length;
    const suitCount={}; ['权杖','圣杯','宝剑','星币'].forEach(s=>{ suitCount[s]=picks.filter(p=>p.t.n.indexOf(s)>=0).length; });
    const topSuit=Object.keys(suitCount).sort((a,b)=>suitCount[b]-suitCount[a])[0];
    let trend='';
    if(ups===3) trend='三张皆正位，能量一路畅通，是个顺势而为的好时机。';
    else if(ups===2) trend='整体向好、略有波折，关键在稳住节奏、不被小坎绊倒。';
    else if(ups===1) trend='阻力多于顺风，宜先安顿内里、看清所求，再行动。';
    else trend='三张皆逆位，提示宜静不宜动，先自省、后外求。';
    if(majors>=2) trend+=' 大阿卡那居多，此问关乎人生层面的大课题，值得郑重对待。';
    if(suitCount[topSuit]>=2) trend+=' 能量集中在「'+topSuit+'」（'+({权杖:'行动·热情',圣杯:'情感·关系',宝剑:'思维·抉择',星币:'物质·稳固'})[topSuit]+'），主题鲜明。';
    res.innerHTML='<div class="result">'+picks.map((p,i)=>{
      const keys=tarotKeys(p.t); const detail=tarotDetail(p.t);
      return `<div class="spread-item"><b>${pos[i]} · ${p.t.n}${p.rev?'（逆位）':'（正位）'}</b>`
        +(keys.length?'<div style="margin:3px 0 4px">'+keys.map(k=>'<span class="tag">'+k+'</span>').join('')+'</div>':'')
        +`<p>${p.rev?p.t.down:p.t.up}</p>`
        +(detail?`<p style="margin-top:5px;padding:6px 10px;border-left:3px solid var(--cinnabar);background:var(--r-subbg);font-size:12.5px;line-height:1.8">白话：${detail}</p>`:'')
        +`<p class="pos-fuse" style="margin-top:5px;color:var(--gold-soft);font-size:12.5px;line-height:1.8">${posFuse(pos[i],p.t,p.rev)}</p>`
        +`<p style="margin-top:5px;padding:6px 10px;border-left:3px solid var(--golden);background:var(--r-subbg);font-size:12.5px;line-height:1.8">${tarotHint(p.t,p.rev)}</p></div>`;
    }).join('')
      +'<div class="spread-trend"><b>整体趋势</b><p>'+trend+'</p></div></div>';
  },720);
};
/* 通用多牌阵（凯尔特十字/爱情/事业，位置含义 + 逐格翻牌 + 趋势总结） */
const TAROT_SPREADS={
  celtic:{pos:[
    {n:'现状',t:'你此刻所处的核心情境与心境'},
    {n:'挑战',t:'正横在你面前的阻碍或课题'},
    {n:'根基',t:'潜意识里影响此事的根源'},
    {n:'过去',t:'最近发生、仍在影响的事'},
    {n:'未来',t:'正向你走来的趋势'},
    {n:'自我',t:'你如何看待与应对这件事'},
    {n:'他人',t:'对方或旁人对此事的态度'},
    {n:'环境',t:'外部环境与客观条件'},
    {n:'希望与恐惧',t:'你心底的期待与担忧'},
    {n:'结果',t:'事情可能的最终走向'}
  ]},
  love:{pos:[
    {n:'我',t:'你在感情中的状态与心态'},
    {n:'对方',t:'对方此刻的真实状态'},
    {n:'关系',t:'这段关系的当下面貌'},
    {n:'走向',t:'关系未来的可能走向'}
  ]},
  career:{pos:[
    {n:'局势',t:'当前工作/事业的整体形势'},
    {n:'机会与阻力',t:'眼前的机遇与拦路的坎'},
    {n:'优势',t:'你可倚仗的底气与长处'},
    {n:'建议',t:'接下来的行动方向'}
  ]},
  year:{pos:[
    {n:'整体',t:'今年运势的总基调与能量走向'},
    {n:'事业',t:'工作/学业上的关键课题与转机'},
    {n:'感情',t:'亲密关系与人际的温度变化'},
    {n:'财富',t:'进财与守财的节奏'},
    {n:'健康',t:'身心状态的提醒与养护'},
    {n:'年末',t:'岁末的收束与来年的伏笔'}
  ]},
  five:{pos:[
    {n:'事业',t:'你当下的处境与突破口'},
    {n:'感情',t:'关系里的真实状态'},
    {n:'财富',t:'资源流动与取舍'},
    {n:'健康',t:'身心需要注意的讯号'},
    {n:'成长',t:'今年最该修炼的内在功课'}
  ]},
  relation:{pos:[
    {n:'我',t:'你在这段关系里的真实状态与心思'},
    {n:'对方',t:'对方此刻的状态与未说出口的考量'},
    {n:'过去',t:'这段关系从何而来、旧有的模式'},
    {n:'现在',t:'关系当下的核心张力或甜蜜'},
    {n:'未来',t:'关系可能走向的方向'},
    {n:'建议',t:'让这段关系更好的行动提示'}
  ]},
  decision:{pos:[
    {n:'现状',t:'你正面对的处境与真实诉求'},
    {n:'选项 A',t:'第一条路的能量与可能的收获'},
    {n:'选项 B',t:'第二条路的能量与潜在的代价'},
    {n:'建议',t:'综合牌面，更稳妥的取舍方向'}
  ]},
  timeflow:{pos:[
    {n:'过去',t:'已经走过、仍在你身上留痕的事'},
    {n:'现在',t:'你此刻真正站立的位置与心境'},
    {n:'未来',t:'正慢慢成形的下一步'},
    {n:'当下建议',t:'顺着时间之流，此时最该做的一件事'}
  ]},
  mbs:{pos:[
    {n:'身',t:'身体状况、精力与日常节律的提醒'},
    {n:'心',t:'情绪、念头与当下最牵动你的事'},
    {n:'灵',t:'更深的召唤、直觉与内在方向'}
  ]},
  self:{pos:[
    {n:'意识',t:'你清醒时如何看自己、做选择'},
    {n:'潜意识',t:'藏在水面下、未被直视的动机与模式'},
    {n:'超意识',t:'超越小我的指引、你真正想成为的样子'}
  ]},
  tri:{pos:[
    {n:'选项 A',t:'第一条路的能量、收获与代价'},
    {n:'选项 B',t:'第二条路的能量、收获与代价'},
    {n:'选项 C',t:'第三条路的能量、收获与代价'},
    {n:'建议',t:'三选一之中，更稳妥或更契合的方向'}
  ]},
  reunion:{pos:[
    {n:'现状',t:'这段关系此刻的真实面貌'},
    {n:'对方心意',t:'对方没说出口的想法与状态'},
    {n:'隔阂',t:'横在两人之间、需要面对的卡点'},
    {n:'转机',t:'关系中正在松动、可能回温的契机'},
    {n:'结果',t:'若能顺势而为，关系可能走到的方向'}
  ]}
};
function trendBlock(picks){
  const ups=picks.filter(p=>!p.rev).length;
  const majors=picks.filter(p=>TAROT.some(x=>x.n===p.t.n)).length;
  const suitCount={}; ['权杖','圣杯','宝剑','星币'].forEach(s=>{ suitCount[s]=picks.filter(p=>p.t.n.indexOf(s)>=0).length; });
  const topSuit=Object.keys(suitCount).sort((a,b)=>suitCount[b]-suitCount[a])[0];
  let trend='';
  if(picks.length<=4){
    trend = ups===picks.length?'诸牌皆正，能量汇聚，顺势而为即是捷径。'
      : ups>=picks.length-1?'整体向好，略有波折，稳住节奏即可。'
      : ups<=1?'阻力多于顺风，宜先安顿内里、看清所求。'
      : '顺逆交织，结果多取决于你临场的取舍。';
  }else{
    trend = ups>=7?'十之七八为正位，大局顺畅，放手去做。'
      : ups>=5?'正逆相当，关键在关键节点的选择。'
      : '逆位偏多，宜静不宜动，先自省后外求。';
  }
  if(majors>=Math.ceil(picks.length/2)) trend+=' 大阿卡那居多，此问关乎人生层面的大课题。';
  if(suitCount[topSuit]>=Math.ceil(picks.length/2)) trend+=' 能量集中在「'+topSuit+'」（'+({权杖:'行动·热情',圣杯:'情感·关系',宝剑:'思维·抉择',星币:'物质·稳固'})[topSuit]+'），主题鲜明。';
  return '<div class="spread-trend"><b>整体趋势</b><p>'+trend+'</p></div>';
}
/* 塔罗叠牌位置进阶读法：不看单张，看「牌与牌之间的关系」——
   相邻牌元素/数字/大阿的张力与呼应，跨位置串联成一条更立体的脉络。
   这里不重复单张解读，专挑牌间的「叠、压、连」讲，起对照与点睛之用。 */
const _SUIT_ELEM={'权杖':'火','圣杯':'水','宝剑':'风','星币':'土'};
const _ELEM_LABEL={'火':'行动·热情','水':'情感·流动','风':'思辨·抉择','土':'物质·稳固'};
const _ELEM_FRIEND={'火':'风','风':'火','水':'土','土':'水'};  // 四元素相济（权杖×宝剑 / 圣杯×星币）
const _ELEM_TENSE={'火':'水','水':'火','风':'土','土':'风'};   // 四元素冲撞（权杖×圣杯 / 宝剑×星币）
function cardElem(t){
  if(t.n.indexOf('权杖')>=0) return '火';
  if(t.n.indexOf('圣杯')>=0) return '水';
  if(t.n.indexOf('宝剑')>=0) return '风';
  if(t.n.indexOf('星币')>=0) return '土';
  const MAJOR_ELEM={'0 愚者':'风','1 魔术师':'风','2 女祭司':'水','3 皇后':'土','4 皇帝':'火','5 恋人':'风','6 战车':'火','7 力量':'火','8 隐士':'土','9 命运之轮':'火','10 正义':'风','11 倒吊人':'水','12 死神':'水','13 节制':'火','14 恶魔':'土','15 高塔':'火','16 星星':'水','17 月亮':'水','18 太阳':'火','19 审判':'火','20 世界':'土'};
  return MAJOR_ELEM[t.n]||null;
}
function cardSuit(t){
  if(t.n.indexOf('权杖')>=0) return '权杖';
  if(t.n.indexOf('圣杯')>=0) return '圣杯';
  if(t.n.indexOf('宝剑')>=0) return '宝剑';
  if(t.n.indexOf('星币')>=0) return '星币';
  return null;
}
function cardRank(t){
  const m=t.n.match(/^(?:(\d+)\s)?(.+)$/); if(!m) return null;
  const suffix=String(m[2]).replace(/^(?:\s)?(Ace|国王|王后|骑士|侍从|2|3|4|5|6|7|8|9|10)\s*/i,'');
  // 大阿卡那:前缀数字即序号
  if(m[1]) return Number(m[1]);
  return null;
}
function cardVal(t){
  // 小牌级数：Ace=1 .. 10；宫廷牌给常量；大阿卡那给序号
  const m=t.n.match(/^(?:(\d+)\s)?(.+)$/);
  if(m[1]) return Number(m[1]);
  const court=['侍从','骑士','王后','国王'];
  for(let i=0;i<court.length;i++) if(t.n.indexOf(court[i])>=0) return 11+i;
  const aceMatch=t.n.match(/Ace/); if(aceMatch) return 1;
  const numMatch=t.n.match(/(\d+)$/); if(numMatch) return Number(numMatch[1]);
  return null;
}
function overlayRead(picks,posN){
  if(!picks||picks.length<2) return '';
  const struct=[], adj=[];   // struct=跨位结构洞察(优先全保留)，adj=相邻张力(可裁)
  // —— 1. 同花色跨越串联（一个课题反复出现）——
  const suitAt={};
  picks.forEach((p,i)=>{ const s=cardSuit(p.t); if(s) (suitAt[s]=suitAt[s]||[]).push(i); });
  Object.keys(suitAt).forEach(s=>{
    if(suitAt[s].length>=2){
      const idx=suitAt[s]; const sym=_ELEM_LABEL[s];
      struct.push('「'+posN[idx[0]]+'」「'+posN[idx[idx.length-1]]+'」同落'+s+'（'+sym+'）——'+s+'的课题在此问中反复出现，是避不开的主弦，'+sym+'正盛，宜顺着这条线使劲。');
    }
  });
  // —— 2. 大阿跨层呼应（大课题 × 日常）——
  const majIdx=picks.map((p,i)=>TAROT.some(x=>x.n===p.t.n)?i:-1).filter(i=>i>=0);
  if(majIdx.length>=2){
    struct.push('此盘中大阿卡那落在「'+majIdx.map(i=>posN[i]).join('」「')+'」'+majIdx.length+'处——这不是日常琐碎，是人生层面的课题在交叠，看似几件事，实为一事的上下篇。');
  }
  // —— 3. 相邻元素张力（四元素相济 / 冲撞 / 中性）——
  const elemSeq=picks.map(p=>cardElem(p.t));
  for(let i=0;i<picks.length-1;i++){
    const a=elemSeq[i], b=elemSeq[i+1];
    if(!a||!b||a===b) continue;
    const la=_ELEM_LABEL[a], lb=_ELEM_LABEL[b];
    if(_ELEM_TENSE[a]===b) adj.push('「'+posN[i]+'」的'+a+'（'+la+'）正冲着「'+posN[i+1]+'」的'+b+'（'+lb+'）——前一件的能量与后一件相抵，二者之间要费点劲才能接上，别硬拗。');
    else if(_ELEM_FRIEND[a]===b) adj.push('「'+posN[i]+'」的'+a+'（'+la+'）与「'+posN[i+1]+'」的'+b+'（'+lb+'）相济——前一件在滋养后一件，衔接顺，顺势推就好。');
    else adj.push('「'+posN[i]+'」的'+a+'（'+la+'）与「'+posN[i+1]+'」的'+b+'（'+lb+'）一条中性线——不冲不助，各自为政，看你怎么串。');
  }
  // —— 4. 数字上行 / 下行趋势（小牌级数 + 大阿序号）——
  const vals=picks.map(p=>cardVal(p.t));
  if(vals.every(v=>v!==null)&&picks.length>=3){
    const rising=vals[2]>vals[1]&&vals[1]>vals[0];
    const falling=vals[2]<vals[1]&&vals[1]<vals[0];
    if(rising) adj.push('牌序的数字一路走高（'+vals.join(' → ')+'）——事情在朝更成熟、更进阶的方向推进，可能越滚越大、越做越顺。');
    else if(falling) adj.push('牌序的数字一路回落（'+vals.join(' → ')+'）——能量在收敛、从复杂走向简单，思路宜做减法，别贪多求全。');
  }
  const all=struct.concat(adj).slice(0,5);
  if(!all.length) return '';
  return '<div class="overlay-read" style="margin-top:14px;padding:12px 14px;border:1px dashed var(--gold);background:linear-gradient(135deg,rgba(156,123,70,.08),rgba(156,123,70,.03));border-radius:12px">'
    +'<b style="color:var(--gold-soft);font-size:13px">牌与牌之间 · 叠位呼应</b>'
    +all.map(l=>'<p style="margin-top:6px;font-size:12.5px;line-height:1.8;color:var(--text-primary)">'+l+'</p>').join('')
    +'<p style="margin-top:6px;color:var(--muted);font-size:11.5px">* 不看单张，看相邻/跨位的张力与呼应，供你在趋势之外再照一眼关系。</p>'
    +'</div>';
}
function runSpread(posList){
  if(_tarotTimer){ clearTimeout(_tarotTimer); _tarotTimer=null; }
  const stage=document.getElementById('tarotStage'); const res=document.getElementById('tarotResult');
  const picks=posList.map(()=>pickTarot());
  stage.className='tarot-stage spread'+(posList.length>6?' celtic':'');
  stage.innerHTML=posList.map(p=>'<div class="tcell"><div class="tcard"><div class="shuffle-deck"><span></span><span></span><span></span><span></span><span></span></div></div><span class="pos">'+p.n+'</span></div>').join('');
  stage.querySelectorAll('.shuffle-deck').forEach(s=>s.classList.add('go'));
  res.innerHTML='<div class="result" style="color:var(--muted)">洗牌中，静心想着你的问题…</div>';
  _tarotTimer=setTimeout(()=>{
    const cells=stage.querySelectorAll('.tcard');
    cells.forEach(c=>c.closest('.tcell').classList.add('deal'));
    picks.forEach((p,i)=>setCard(cells[i],p.t,p.rev));
    res.innerHTML='<div class="result">'+posList.map((p,i)=>{
      const pp=picks[i]; const keys=tarotKeys(pp.t); const detail=tarotDetail(pp.t);
      return `<div class="spread-item"><b><span class="sidx">${i+1}</span><span class="spos">${p.n}</span> · ${pp.t.n}${pp.rev?'（逆位）':'（正位）'}</b>`
        +(keys.length?'<div style="margin:3px 0 4px">'+keys.map(k=>'<span class="tag">'+k+'</span>').join('')+'</div>':'')
        +`<p style="color:var(--muted);font-size:12px">${p.t}</p>`
        +`<p>${pp.rev?pp.t.down:pp.t.up}</p>`
        +(detail?`<p style="margin-top:5px;padding:6px 10px;border-left:3px solid var(--cinnabar);background:var(--r-subbg);font-size:12.5px;line-height:1.8">白话：${detail}</p>`:'')
        +`<p class="pos-fuse" style="margin-top:5px;color:var(--gold-soft);font-size:12.5px;line-height:1.8">${posFuse(p.n,pp.t,pp.rev)}</p>`
        +`<p style="margin-top:5px;padding:6px 10px;border-left:3px solid var(--golden);background:var(--r-subbg);font-size:12.5px;line-height:1.8">${tarotHint(pp.t,pp.rev)}</p></div>`;
    }).join('')+trendBlock(picks)+overlayRead(picks,posList.map(p=>p.n))+tarotBenmingHTML()+'</div>';
  },720);
}
document.getElementById('tarotLoveBtn').onclick=()=>runSpread(TAROT_SPREADS.love.pos);
document.getElementById('tarotCareerBtn').onclick=()=>runSpread(TAROT_SPREADS.career.pos);
document.getElementById('tarotCelticBtn').onclick=()=>runSpread(TAROT_SPREADS.celtic.pos);
document.getElementById('tarotYearBtn').onclick=()=>runSpread(TAROT_SPREADS.year.pos);
document.getElementById('tarotFiveBtn').onclick=()=>runSpread(TAROT_SPREADS.five.pos);
document.getElementById('tarotRelationBtn').onclick=()=>runSpread(TAROT_SPREADS.relation.pos);
document.getElementById('tarotDecisionBtn').onclick=()=>runSpread(TAROT_SPREADS.decision.pos);
document.getElementById('tarotTimeflowBtn').onclick=()=>runSpread(TAROT_SPREADS.timeflow.pos);
document.getElementById('tarotMbsBtn').onclick=()=>runSpread(TAROT_SPREADS.mbs.pos);
document.getElementById('tarotSelfBtn').onclick=()=>runSpread(TAROT_SPREADS.self.pos);
document.getElementById('tarotTriBtn').onclick=()=>runSpread(TAROT_SPREADS.tri.pos);
document.getElementById('tarotReunionBtn').onclick=()=>runSpread(TAROT_SPREADS.reunion.pos);
/* 塔罗牌点击放大弹层（lightbox，点击牌面查看大图与完整牌义） */
function openTarotModal(name,rev){
  const t=TAROT_ALL.find(x=>x.n===name); if(!t) return;
  const img=document.getElementById('tmImg'), info=document.getElementById('tmInfo');
  if(!img||!info) return;
  img.innerHTML=tarotCardSVG(t.n,rev).replace('width="128" height="186"','width="184" height="267"');
  const keys=tarotKeys(t);
  const detail=tarotDetail(t);
  info.innerHTML=`<b>${t.n}${rev?'（逆位）':'（正位）'}</b>`
    +(keys.length?'<div style="margin:6px 0">'+keys.map(k=>'<span class="tag">'+k+'</span>').join('')+'</div>':'')
    +`<div style="margin-top:6px;line-height:1.9">${rev?t.down:t.up}</div>`
    +(detail?`<div style="margin-top:8px;padding:8px 12px;border-left:3px solid var(--cinnabar);background:var(--r-subbg);font-size:13px;line-height:1.85"><b>白话解读</b><p style="margin-top:4px">${detail}</p></div>`:'')
    +`<div style="margin-top:8px;padding:8px 12px;border-left:3px solid var(--golden);background:var(--r-subbg);font-size:13px;line-height:1.8">${tarotHint(t,rev)}</div>`
    +`<div style="color:var(--muted);font-size:12px;margin-top:6px">${rev?'逆位多提示内省、阻滞与调整':'正位多提示顺势、彰显与行动'}</div>`;
  const m=document.getElementById('tarotModal'); if(m){ m.classList.add('show'); if(window.holdAmbient) window.holdAmbient(); }
}
(function(){
  const stage=document.getElementById('tarotStage');
  const modal=document.getElementById('tarotModal');
  if(stage) stage.addEventListener('click',e=>{
    const card=e.target.closest('#tarotCard, .tcell .tcard, .fan-card');
    if(!card||!card.dataset.n) return;
    openTarotModal(card.dataset.n, card.dataset.rev==='1');
  });
  if(modal){
    ['tmBack','tmClose'].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener('click',()=>{ modal.classList.remove('show'); if(window.releaseAmbient) window.releaseAmbient(); }); });
  }
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&modal){ modal.classList.remove('show'); if(window.releaseAmbient) window.releaseAmbient(); } });
})();
/* 牌意搜索（借鉴 Tarot-Insight 的牌意检索）：按牌名/关键字/牌义过滤，点击打开弹层 */
(function(){
  const inp=document.getElementById('tarotSearch');
  const box=document.getElementById('tarotSearchResult');
  if(!inp||!box) return;
  inp.addEventListener('input',()=>{
    const q=inp.value.trim();
    if(!q){ box.innerHTML=''; return; }
    const hit=TAROT_ALL.filter(t=>(t.n||'').indexOf(q)>=0||(t.k||[]).some(k=>k.indexOf(q)>=0)||(t.up||'').indexOf(q)>=0||(t.down||'').indexOf(q)>=0);
    const hl=s=>{ try{ return String(s).replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'),'<b style="color:var(--gold2)">$&</b>'); }catch(e){ return s; } };
    if(!hit.length){ box.innerHTML='<div class="result" style="color:var(--muted)">未找到匹配的牌 — 试试「爱情 / 事业 / 财富 / 逆位 / 权杖 / 月亮」等关键词</div>'; return; }
    box.innerHTML='<div class="result" style="max-height:280px;overflow:auto"><div style="padding:4px 10px 2px;color:var(--muted);font-size:11px">共命中 '+hit.length+' 张</div>'+hit.slice(0,14).map(t=>{
      const keys=tarotKeys(t);
      return '<div class="search-item" data-n="'+t.n+'" style="cursor:pointer;padding:8px 10px;border-bottom:1px dashed var(--line);transition:background .2s"><b>'+hl(t.n)+'</b>'+(keys.length?' <span style="color:var(--muted);font-size:11px">'+keys.map(k=>hl(k)).join(' / ')+'</span>':'')+'<div style="font-size:12px;color:var(--muted);margin-top:2px">'+hl(t.up)+'</div></div>';
    }).join('')+'</div>';
    box.querySelectorAll('.search-item').forEach(el=>{
      el.onmouseenter=()=>{ el.style.background='rgba(201,164,92,.10)'; };
      el.onmouseleave=()=>{ el.style.background=''; };
      el.onclick=()=>openTarotModal(el.dataset.n,false);
    });
  });
})();

/* ===================== 5b. 国外塔罗扩充：北欧卢恩符文 / 雷诺曼卡 / 生命灵数 ===================== */
const RUNE_LEAD={all:'综合指引',love:'感情指引',career:'事业指引',wealth:'财富指引',health:'身心指引'};
const LENO_LEAD={all:'综合指引',love:'感情指引',career:'事业指引',health:'身心指引'};
/* 北欧卢恩符文（Elder Futhark，24 枚）：glyph + 名 + 正位/逆位(merkstave)释义 */
const RUNES=[
 {g:'ᚠ',n:'Fehu 菲胡',up:'财富与丰饶在流动，已有的耕耘将见回报，宜把握进财之机。',rev:'守成勿耗，别让到手的丰盛从指缝溜走，谨防外耗。'},
 {g:'ᚢ',n:'Uruz 乌鲁',up:'内在力量觉醒，如野牛般坚韧，可凭一股蛮劲冲破困局。',rev:'力量用错方向则伤己，先稳住心神，莫硬碰。'},
 {g:'ᚦ',n:'Thurisaz 瑟里',up:'横亘前的阻力是试炼，正视它，反能借势破局。',rev:'堤防冲突与暗伤，锋芒暂收，避其锐气。'},
 {g:'ᚨ',n:'Ansuz 安苏',up:'神谕将至，一道讯息或灵感点醒你，宜倾听与表达。',rev:'误传与杂音增多，先辨真伪，莫轻信。'},
 {g:'ᚱ',n:'Raidho 雷多',up:'旅程开启，秩序与节奏就位，出行/推进正逢其时。',rev:'行程受阻或偏离，重新校准方向再上路。'},
 {g:'ᚲ',n:'Kenaz 肯纳',up:'火把点亮，知识与技艺显现，宜学习、创制与显化。',rev:'迷雾遮火，看清再动手，别在暗处贸然前行。'},
 {g:'ᚷ',n:'Gebo 盖博',up:'一份礼物与交换降临，关系因给予而丰盈。',rev:'得失失衡，付出前先看清对价，莫单向消耗。'},
 {g:'ᚹ',n:'Wunjo 温约',up:'喜悦与和谐到来，心愿渐圆，宜与人同享。',rev:'欢愉蒙尘，先安内里，别强颜欢笑。'},
 {g:'ᚺ',n:'Hagalaz 哈格拉',up:'如冰雹骤至，旧结构被打破，乱中藏着重整的契机。',rev:'余波未平，先稳住，等风暴过去再收拾。'},
 {g:'ᚾ',n:'Nauthiz 瑙提',up:'匮乏倒逼必需，逼你厘清真正所需，破中之立。',rev:'卡在短缺里打转，先行动破局，别空等。'},
 {g:'ᛁ',n:'Isa 伊萨',up:'如冰静止，一切暂缓，正是蓄力与内观的时令。',rev:'凝滞过久成僵，需一点暖意与主动破冰。'},
 {g:'ᛃ',n:'Jera 耶拉',up:'一年一轮，因果熟成，耐心等来的收成就在眼前。',rev:'时令未到，强求无益，顺势养根。'},
 {g:'ᛇ',n:'Eihwaz 艾瓦',up:'紫杉长青，连接生死的韧力，挺过这一段便见转机。',rev:'根基动摇，先固本，莫急于求成。'},
 {g:'ᛈ',n:'Perthro 珀斯',up:'命运之匣开启，神秘与未知里藏着答案，敢赌一着。',rev:'谜底未明，别妄测，留一分余地。'},
 {g:'ᛉ',n:'Algiz 阿尔吉',up:'麋角朝上，守护降临，直觉为你挡去灾厄。',rev:'防护出现破口，先自保，避开封口之处。'},
 {g:'ᛋ',n:'Sowilo 索维洛',up:'太阳高照，成功与明朗可期，顺光而行。',rev:'光被云蔽，暂失方向，等天清再走。'},
 {g:'ᛏ',n:'Tiwaz 提瓦',up:'战神执旗，正义与胜利倾向勇者，宜决断。',rev:'胜负未分，先明理再战，莫逞匹夫之勇。'},
 {g:'ᛒ',n:'Berkano 贝卡诺',up:'桦树新芽，生长与新生萌发，宜开端与滋养。',rev:'萌芽受寒，先护住新事，莫急于扩张。'},
 {g:'ᛖ',n:'Ehwaz 埃瓦',up:'双马并进，关系与进程向前，合作得力。',rev:'步调错位，先对齐彼此，再同行。'},
 {g:'ᛗ',n:'Mannaz 曼纳兹',up:'人即镜像，自我与他人照见彼此，宜修关系。',rev:'自我与他者失衡，先安己，再观人。'},
 {g:'ᛚ',n:'Laguz 拉古兹',up:'水流直觉，顺感而行，潜意识的指引最真。',rev:'深水迷向，先上岸看清，莫盲游。'},
 {g:'ᛜ',n:'Ingwaz 英瓦兹',up:'丰饶内敛，种子在土，宜沉淀与积蓄势能。',rev:'积蓄受阻，先通堵，再养势。'},
 {g:'ᛟ',n:'Othala 奥萨拉',up:'传承与家园显形，根基与来处给你底气。',rev:'执于旧物成缚，敢于取舍，方得自在。'},
 {g:'ᛞ',n:'Dagaz 达加兹',up:'白昼破晓，转折与突破降临，长夜将尽。',rev:'黎明前的暗，再撑一刻，光就在前。'}
];
/* 符文主题关键词（深化：结果加主题锚点） */
const RUNE_KEY={
 'Fehu 菲胡':'丰盛','Uruz 乌鲁':'原力','Thurisaz 瑟里':'阻力','Ansuz 安苏':'神谕','Raidho 雷多':'旅程',
 'Kenaz 肯纳':'光明','Gebo 盖博':'赠予','Wunjo 温约':'喜悦','Hagalaz 哈格拉':'破局','Nauthiz 瑙提':'匮乏',
 'Isa 伊萨':'静滞','Jera 耶拉':'因果','Eihwaz 艾瓦':'韧力','Perthro 珀斯':'命运','Algiz 阿尔吉':'守护',
 'Sowilo 索维洛':'胜利','Tiwaz 提瓦':'勇气','Berkano 贝卡诺':'新生','Ehwaz 埃瓦':'并进','Mannaz 曼纳兹':'自我',
 'Laguz 拉古兹':'直觉','Ingwaz 英瓦兹':'积蓄','Othala 奥萨拉':'传承','Dagaz 达加兹':'破晓'
};
/* 符文「问事透镜」：同一枚符在感情/事业/财富/健康/综合下，各有不同的落点——
   把牌义关键词接到「所问之事」上，让结果真正回应问题，而非只贴通用释义（专业零凑数） */
const RUNE_LENS={
  love:  {name:'感情',  frame:'心之所向',   open:'此人此事在你心上的分量与走向'},
  career:{name:'事业',  frame:'前路与位势', open:'你在位置上的进与守、案头之事'},
  wealth:{name:'财富',  frame:'资源与进财', open:'财源的流动、机会与取舍'},
  health:{name:'身心',  frame:'身心之养',   open:'你内在的元气与需要被看见的讯号'},
  all:   {name:'综合',  frame:'当下之势',   open:'此刻整体局面与应取的态度'}
};
/* 把一枚符文接到所问维度：正逆 + 主题关键词 + 问事透镜组合成一句定向白话 */
function runeQRead(p,q){
  const lens=RUNE_LENS[q]||RUNE_LENS.all;
  const kw=RUNE_KEY[p.r.n]||'';
  const base=p.rev?p.r.rev:p.r.up;
  // 定向落点：把牌义先落到「所问之事」框架，再接原义白话来「点题」
  const lead=p.rev
    ? '在「'+lens.name+'」这一问上，『'+p.r.n+'』以逆位示警——此中的「'+kw+'」正遇到阻滞，'+base
    : '在「'+lens.name+'」这一问上，『'+p.r.n+'』以正位回应——此中的「'+kw+'」正逢其时，'+base;
  return {frame:lens.frame, lead};
}
/* 符文综断：依正逆比例 + 主导主题关键词，给三/五符阵一句趋势结语 */
function runeTrend(picks,q){
  const lens=RUNE_LENS[q]||RUNE_LENS.all;
  const ups=picks.filter(p=>!p.rev).length;
  const n=picks.length;
  // 主导主题：出现最多的关键词
  const cnt={}; picks.forEach(p=>{const k=RUNE_KEY[p.r.n]; if(k) cnt[k]=(cnt[k]||0)+1;});
  const top=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0];
  let s;
  if(ups===n) s='所问几符皆顺，能量一路正向——在「'+lens.name+'」上宜顺势而为、把节奏握回自己手里。';
  else if(ups>n/2) s='整体偏向顺畅、略有杂音——依符而行，把「'+lens.name+'」的事一步步落在实处即可。';
  else if(ups===n/2) s='正逆参半、局势未明——「'+lens.name+'」之问宜先内省、辨清得失，再定行止。';
  else s='逆符偏多、阻力当前——这一问宜稳住阵脚，先安内里、避其锋芒，时机稍缓再图。';
  if(top&&cnt[top]>=Math.ceil(n/2)) s+=' 多符同指「'+top+'」——这是此问最要害的关键词，请特别留意此处。';
  return s;
}
function drawRunes(n){
  const pool=[...RUNES]; for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  return pool.slice(0,n).map(r=>({r, rev:Math.random()<0.3}));
}
function runeItem(p, pos){
  const kw=RUNE_KEY[p.r.n];
  return '<div class="rune-item"><div class="rune-stone'+(p.rev?' rev':'')+'"><span class="g">'+p.r.g+'</span><span class="p">'+pos+'</span></div>'
    +'<div style="margin-top:8px"><b>'+p.r.n+'</b>'+(p.rev?'（逆位）':'（正位）')+(kw?' <span class="tag">'+kw+'</span>':'')+'</div>'
    +'<p style="font-size:12.5px;color:var(--muted);margin-top:4px;line-height:1.8">'+(p.rev?p.r.rev:p.r.up)+'</p></div>';
}
/* 符文结果版式：牌位 + 定向落点（问事透镜）+ 原义白话 */
function runeResultHTML(picks,pos,q,sub){
  const lens=(RUNE_LENS[q]||RUNE_LENS.all).name;
  const body=picks.map((p,i)=>{
    const qr=runeQRead(p,q);
    return '<div class="rune-item">'+runeItem(p,pos[i])
      +'<p style="margin-top:7px;padding:6px 10px;border-left:3px solid var(--gold-soft);background:var(--r-subbg);font-size:12.5px;line-height:1.8;text-align:left;color:var(--gold-soft)">'
      +'<b>'+pos[i]+'·'+qr.frame+'</b> —— '+qr.lead+'</p></div>';
  }).join('');
  return '<div class="result"><div class="rune-grid">'+body+'</div>'
    +'<div class="spread-trend" style="margin-top:12px;padding:10px 14px;border:1px dashed rgba(201,164,92,.45);border-radius:10px"><b>整体趋势（'+lens+'）</b>'
    +'<p style="margin-top:5px;font-size:13px;line-height:1.8">'+runeTrend(picks,q)+'</p></div>'
    +'<p style="color:var(--muted);font-size:12px;margin-top:10px">'+sub+' ｜ 塔罗·卢恩符文已按「'+lens+'」起卦。</p></div>';
}
document.getElementById('runeBtn').onclick=()=>{
  const q=document.getElementById('runeQ').value;
  const p=drawRunes(1)[0];
  document.getElementById('runeResult').innerHTML=runeResultHTML([p],['本运'],q,'符文一枚落定，聆听其意');
};
document.getElementById('runeSpreadBtn').onclick=()=>{
  const q=document.getElementById('runeQ').value;
  const picks=drawRunes(3); const pos=['过去','现在','未来'];
  document.getElementById('runeResult').innerHTML=runeResultHTML(picks,pos,q,'过去·现在·未来三符阵');
};
/* 五符十字阵：零门槛的「凯尔特十字」简版——现状 / 阻力 / 助力 / 未来 / 结果 */
document.getElementById('runeCrossBtn').onclick=()=>{
  const q=document.getElementById('runeQ').value;
  const picks=drawRunes(5); const pos=['现状','阻力','助力','未来','结果'];
  document.getElementById('runeResult').innerHTML=runeResultHTML(picks,pos,q,'五符十字阵：观现状、推阻力、得助力、望未来、判结果');
};
/* 雷诺曼卡（36 张）：名 + 释义 */
const LENOMANDS=[
 {n:'骑士',m:'消息与到来，一件人事将至，宜主动迎。'},
 {n:'三叶草',m:'小小的好运，转瞬即逝的顺，抓住眼前。'},
 {n:'船',m:'远行与变动，离开旧岸，去往更远之处。'},
 {n:'房子',m:'家庭与稳定，根基安稳，宜守不宜动。'},
 {n:'树',m:'健康与成长，缓慢而扎实的积蓄之力。'},
 {n:'云',m:'困惑与不明，局势混沌，先等云开。'},
 {n:'蛇',m:'复杂与欺骗，暗绕的纠缠，宜明察。'},
 {n:'棺材',m:'结束与终结，一段落幕，也是清空。'},
 {n:'花束',m:'赞美与礼物，被人看见的喜悦。'},
 {n:'镰刀',m:'决断与切断，当断则断，亦防隐患。'},
 {n:'鞭子',m:'冲突与重复，反复拉扯，需止息。'},
 {n:'鸟',m:'闲言与焦躁，消息纷飞，别被聒噪带走。'},
 {n:'小孩',m:'开始与天真，新的萌芽，需耐心护持。'},
 {n:'狐狸',m:'谨慎与职场，机变中藏算计，宜留神。'},
 {n:'熊',m:'力量与资源，厚实的底气与掌控。'},
 {n:'星星',m:'希望与指引，远处的光，值得奔赴。'},
 {n:'鹳',m:'转变与提升，旧貌换新，向上迁升。'},
 {n:'狗',m:'忠诚与友谊，可信赖的陪伴与支持。'},
 {n:'塔',m:'权威与孤立，高处亦孤独，宜借势亦自持。'},
 {n:'花园',m:'社交与公众，众人之中的声量与联结。'},
 {n:'山',m:'障碍与延迟，横亘的阻，需绕或需攀。'},
 {n:'十字路口',m:'抉择与分歧，站在分叉，需定方向。'},
 {n:'老鼠',m:'损耗与焦虑，暗中的侵蚀，宜早查。'},
 {n:'心',m:'爱与情感，所求的核心与真心。'},
 {n:'戒指',m:'承诺与联结，一个闭环的约定。'},
 {n:'书',m:'秘密与学问，未显的真相与积累。'},
 {n:'信',m:'消息与文书，白纸黑字的事项。'},
 {n:'男人',m:'男性 / 求问者，自身或对方之象。'},
 {n:'女人',m:'女性 / 求问者，自身或对方之象。'},
 {n:'百合',m:'平静与智慧，年长者的从容与定。'},
 {n:'太阳',m:'成功与喜悦，明朗通透，诸事顺。'},
 {n:'月亮',m:'直觉与秘密，暗处的流动，宜感。'},
 {n:'钥匙',m:'解答与关键，一语破的的出口。'},
 {n:'鱼',m:'财富与丰盛，流动的资源与机会。'},
 {n:'锚',m:'稳定与坚持，守住本心，终见底。'},
 {n:'十字',m:'负担与考验，需担起的重量与课业。'}
];
/* 雷诺曼主题关键词（深化：结果加主题锚点） */
const LENO_KEY={
 '骑士':'讯息','三叶草':'小运','船':'远行','房子':'安稳','树':'成长','云':'困惑','蛇':'纠缠','棺材':'终结',
 '花束':'赞美','镰刀':'决断','鞭子':'冲突','鸟':'闲言','小孩':'开端','狐狸':'机变','熊':'力量','星星':'希望',
 '鹳':'转变','狗':'忠诚','塔':'权威','花园':'社交','山':'阻碍','十字路口':'抉择','老鼠':'损耗','心':'情感',
 '戒指':'承诺','书':'秘密','信':'文书','男人':'男主','女人':'女主','百合':'智慧','太阳':'成功','月亮':'直觉',
 '钥匙':'解答','鱼':'财富','锚':'坚持','十字':'考验'
};
/* 雷诺曼卡吉凶倾向：吉(+)/中(=)/凶(-)，供「所问定向」着色批语 */
const LENO_TONE={
 '骑士':'+','三叶草':'+','船':'=','房子':'+','树':'+','云':'-','蛇':'-','棺材':'-',
 '花束':'+','镰刀':'=','鞭子':'-','鸟':'=','小孩':'+','狐狸':'=','熊':'+','星星':'+',
 '鹳':'+','狗':'+','塔':'=','花园':'+','山':'-','十字路口':'=','老鼠':'-','心':'+',
 '戒指':'+','书':'=','信':'=','男人':'=','女人':'=','百合':'+','太阳':'+','月亮':'=',
 '钥匙':'+','鱼':'+','锚':'+','十字':'-'
};
/* 雷诺曼「问事透镜」：同一张卡在感情/事业/健康/综合下的落点 */
const LENO_LENS={
  love:  {name:'感情',  open:'这段心之所系、关系里的来与往'},
  career:{name:'事业',  open:'你案头的事、位势上的进与守'},
  health:{name:'身心',  open:'你内在的元气与需被看见的讯号'},
  all:   {name:'综合',  open:'此刻整体的局面与应取的态度'}
};
/* 把一张雷诺曼卡接到所问维度：倾向(±=) × 主题关键词 × 原义组成一句定向白话 */
function lenoQRead(c,q){
  const lens=LENO_LENS[q]||LENO_LENS.all;
  const kw=LENO_KEY[c.n]||'';
  const tone=LENO_TONE[c.n]||'=';
  const open=lens.open;
  const tail=c.m.replace(/[。，]/g,'');
  const head=tone==='+'
    ? '吉卡指向利好——'
    : tone==='-' ? '此卡蒙尘、示警——' : '此卡中性、看你怎么用——';
  return {frame:lens.name, lead:head+'在「'+kw+'」这一层，'+open+'：'+tail+'（'+(tone==='+'?'宜取势':(tone==='-'?'宜避其害':'宜观势'))+'）'};
}
/* 雷诺曼综断：按 吉/中/凶 计数 + 主导主题给一句趋势 */
function lenoTrend(picks,q){
  const lens=LENO_LENS[q]||LENO_LENS.all;
  let g=0,b=0,n=0; picks.forEach(c=>{const t=LENO_TONE[c.n]||'='; if(t==='+')g++; else if(t==='-')b++; else n++;});
  const total=picks.length;
  const cnt={}; picks.forEach(c=>{const k=LENO_KEY[c.n]; if(k) cnt[k]=(cnt[k]||0)+1;});
  const top=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0];
  let s;
  if(g===total) s='所问诸卡皆吉，气象通达——在「'+lens.name+'」上宜顺势进取、把握时运。';
  else if(g>=b&&g>=n) s='吉多于凶、略有小坎——「'+lens.name+'」之问整体向好，稳住节奏、避其小阻即可。';
  else if(b>g) s='凶多于吉、阻力偏重——这一问宜先自省守成，缓图而动，莫逆势强求。';
  else s='吉凶参半、全看取舍——「'+lens.name+'」之问的关键在权衡，择其利者而为之。';
  if(cnt[top]>=2) s+=' 多卡同指「'+top+'」——这是此问最扎眼的关键，请在此处下功夫。';
  return s;
}
function drawLeno(n){
  const pool=[...LENOMANDS]; for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  return pool.slice(0,n);
}
function lenoItem(c, pos){
  const kw=LENO_KEY[c.n];
  return '<div class="rune-item"><div class="leno-card"><div class="ln">'+c.n+(kw?' <span class="tag">'+kw+'</span>':'')+'</div><div class="lp">'+pos+'</div></div>'
    +'<p style="font-size:12.5px;color:var(--muted);margin-top:6px;line-height:1.8">'+c.m+'</p></div>';
}
/* 雷诺曼结果版式：牌位 + 定向落点 + 综断 */
function lenoResultHTML(picks,pos,q,sub){
  const lens=(LENO_LENS[q]||LENO_LENS.all).name;
  const body=picks.map((c,i)=>{
    const qr=lenoQRead(c,q);
    const tone=LENO_TONE[c.n]||'=';
    const col=tone==='+'?'var(--gold-soft)':tone==='-'?'var(--cinnabar,var(--gold-soft))':'var(--muted)';
    return '<div class="rune-item">'+lenoItem(c,pos[i])
      +'<p style="margin-top:7px;padding:6px 10px;border-left:3px solid '+col+';background:var(--r-subbg);font-size:12.5px;line-height:1.8;text-align:left;color:'+col+'">'
      +'<b>'+pos[i]+'·'+qr.frame+'</b> —— '+qr.lead+'</p></div>';
  }).join('');
  return '<div class="result"><div class="rune-grid">'+body+'</div>'
    +'<div class="spread-trend" style="margin-top:12px;padding:10px 14px;border:1px dashed rgba(201,164,92,.45);border-radius:10px"><b>整体趋势（'+lens+'）</b>'
    +'<p style="margin-top:5px;font-size:13px;line-height:1.8">'+lenoTrend(picks,q)+'</p></div>'
    +'<p style="color:var(--muted);font-size:12px;margin-top:10px">'+sub+' ｜ 雷诺曼已按「'+lens+'」起卦。</p></div>';
}
document.getElementById('lenoBtn').onclick=()=>{
  const q=document.getElementById('lenoQ').value;
  const c=drawLeno(1)[0];
  document.getElementById('lenoResult').innerHTML=lenoResultHTML([c],['本运'],q,'雷诺曼一枚落定，看图直断');
};
document.getElementById('lenoSpreadBtn').onclick=()=>{
  const q=document.getElementById('lenoQ').value;
  const picks=drawLeno(3); const pos=['过去','现在','未来'];
  document.getElementById('lenoResult').innerHTML=lenoResultHTML(picks,pos,q,'过去·现在·未来三卡阵');
};
/* 七卡阵：雷诺曼「塔罗大十字」人间版——我 / 对方 / 关系本质 / 阻力 / 助力 / 未知 / 趋势 */
document.getElementById('lenoSevenBtn').onclick=()=>{
  const q=document.getElementById('lenoQ').value;
  const picks=drawLeno(7); const pos=['我','对方','关系本质','阻力','助力','未知','趋势'];
  document.getElementById('lenoResult').innerHTML=lenoResultHTML(picks,pos,q,'七卡阵：观我见彼、明本质、识助力与阻力、探未知、断趋势');
};
/* 生命灵数（生日数字累减，master 11/22/33 不破） */
const LP={
 1:{t:'开创者',d:'独立、果敢、富于行动力；你是点燃第一把火的人，宜主动开局、担起领头。',g:'发挥主见，莫随波逐流',b:'防独断与冲动，孤行易折'},
 2:{t:'调和者',d:'敏感、协作、长于配合；你是桥梁，宜在关系与合伙中成事。',g:'以柔克刚，借势共赢',b:'防优柔与依附，失了自我'},
 3:{t:'表达者',d:'灵动、创意、擅沟通；你让想法发光，宜以表达与才情立足。',g:'大胆展现，灵感变现',b:'防三分热度，流于表面'},
 4:{t:'奠基者',d:'务实、稳健、重秩序；你是地基，宜以扎实与耐心建长远。',g:'稳扎稳打，积小成大',b:'防固执与保守，错失变机'},
 5:{t:'自由者',d:'好奇、善变、爱自由；你是风，宜在探索与变化中找生机。',g:'拥抱变化，广结善缘',b:'防飘忽与贪多，难竟全功'},
 6:{t:'守护者',d:'责任、温情、重家庭；你以爱与担当聚人，宜养护与成全。',g:'以责聚人，温情致远',b:'防过度背负，累己累人'},
 7:{t:'求道者',d:'沉静、思辨、喜独处；你是深海，宜在研究与内省中得智。',g:'深耕一门，静水流深',b:'防孤僻与多疑，隔绝世界'},
 8:{t:'掌局者',d:'有格局、善经营、能掌控；你是塔尖，宜以格局与执行揽大局。',g:'放大格局，谋定后动',b:'防逐利失度，本末倒置'},
 9:{t:'圆满者',d:'博爱、通透、具悲悯；你是收尾者，宜以情怀与超越利人利己。',g:'利他自成，圆融处之',b:'防散而不聚，空有热忱'},
 11:{t:'启明者',d:'灵感、洞察、通上下；你是天线，宜把高维的觉知落地成事。',g:'信直觉，化为行动',b:'防悬浮焦虑，想多做少'},
 22:{t:'筑梦者',d:'远见、实干、能扛事；你是大桥，宜把宏大蓝图一砖一瓦建起。',g:'以实干承大愿',b:'防眼高手低，蓝图落空'},
 33:{t:'大爱者',d:'慈悲、引领、化育众；你是灯塔，宜以善与格局照亮一方。',g:'以大愿领人',b:'防耗己过度，忘了自护'}
};
function reduceLP(n){
  if([11,22,33].includes(n)) return n;
  while(n>9){ n=String(n).split('').reduce((a,b)=>a+Number(b),0); if([11,22,33].includes(n)) return n; }
  return n;
}
/* —— 毕达哥拉斯生命灵数扩展：天赋数字 / 人生高峰与挑战 / 灵数合盘 —— */
function reduceAll(n){
  while(n>9){ n=String(n).split('').reduce((a,b)=>a+Number(b),0); }
  return n;
}
/* 天赋数字：出生「月+日」拆两位相加归约（若为 master 保留，否则归约到 1-9） */
function giftedNums(m,d){
  const g=[];
  const part=String(m)+String(d);          // 例 12 月 25 日 → "1225"
  for(let i=0;i<part.length-1;i++){
    const v=Number(part[i])+Number(part[i+1]);
    const r=reduceLP(v);
    g.push(r);
  }
  // 去重但保留顺序
  return g.filter((v,i)=>g.indexOf(v)===i);
}
/* 天赋数字文案模板（毕达哥拉斯核心，去模板化措辞） */
const GIFTED_T={
 1:'擅开拓与独立，敢为天下先——你的天赋在于点火、开局、领跑。',
 2:'擅融合与倾听，是天然的桥梁——你的天赋在于斡旋、配合、把各方拧成一股。',
 3:'擅表达与创造，点子常在嘴边——你的天赋在于让想法被看见、被听见。',
 4:'擅结构与落地，把散乱理成章——你的天赋在于搭框架、打地基、守长期。',
 5:'擅应变与游走，困局里总能转身——你的天赋在于灵活、联结、把变数化为机会。',
 6:'擅滋养与成全，身边人因你而稳——你的天赋在于照顾、协调、托住关系。',
 7:'擅深究与沉思，一脚踩进本质——你的天赋在于钻透、内省、给出判断。',
 8:'擅运作与决断，能控大局也敢担——你的天赋在于整合资源、扛起责任、说到做到。',
 9:'擅悲悯与超越，看得比人远一层——你的天赋在于洞见大势、化散为聚、成全他人。',
 11:'天赋在于灵感与直觉——你常比人先"看见"，要把它落成行动而非停在脑海。',
 22:'天赋在于宏图与建造——你能把别人不敢想的，一砖一瓦做成真的。',
 33:'天赋在于大爱与引领——你适合以言与行照亮一群人。'
};
/* 人生四大高峰周期（毕达哥拉斯）：月/日/年归约 → 4 peak + 4 challenge，阶段年龄 */
function lifeCycles(y,m,d){
  const M=reduceAll(m), DD=reduceAll(d), Y=reduceAll(y);
  const peak1=reduceAll(M+DD);            // 月+日 → 第一高峰
  const peak2=reduceAll(DD+Y);            // 日+年 → 第二高峰
  const peak3=reduceAll(peak1+peak2);     // 一+二 → 第三高峰
  const peak4=reduceAll(M+Y);             // 月+年 → 第四高峰
  const ch1=Math.abs(M-DD), ch2=Math.abs(DD-Y);
  const ch3=Math.abs(ch1-ch2), ch4=Math.abs(M-Y);
  const age=36-reduceAll(M+DD);           // 约 36 减生命数得第一高峰起始，经验式
  return {peaks:[peak1,peak2,peak3,peak4], challenges:[ch1,ch2,ch3,ch4], start:age};
}
/* 灵数合盘：两人主数兼容评定（毕达哥拉斯倾向配对） */
function numerCompat(a,b){
  // 综合：同频/互补/张力/调和四类，结合主数含 master 加权
  const pair=[a,b].sort((x,y)=>x-y).join('-');
  const SAME={}; ['1-1','2-2','3-3','4-4','5-5','6-6','7-7','8-8','9-9'].forEach(k=>SAME[k]=0);
  const FLOW=['1-2','1-4','1-8','2-4','2-6','3-6','3-9','4-8','5-6','7-9','8-9','2-8'];   // 天然相合
  const TENSE=['1-5','2-7','3-5','4-7','5-9','6-8','1-7','2-5'];                          // 有张力、需磨合
  let tag,score,tip;
  if(SAME[pair]===0 && pair[0]===pair[1]){
    score=95; tag='同频共振';
    const A=LP[a]||LP[1];
    tip='你们同属「'+A.t+'」的振动——相似是天然的安全感，也易因太像而各自撞在同一点上，宜记得彼此留白。';
  }else if(FLOW.includes(pair)){
    score=88; tag='天然相合';
    tip='你的'+a+'与对方的'+b+'互为补充——一个往外推、一个往回收，配合顺滑，是能一起长久做事的组合。';
  }else if(TENSE.includes(pair)){
    score=62; tag='需磨合';
    tip='一个'+a+'一个'+b+'，节奏差异不小——容易擦出火花，也容易踩到彼此的刻板处，多一份理解和让步便是加分。';
  }else{
    score=75; tag='稳健互补';
    tip=''+a+'与'+b+'不冷不热，各有各的功课——不投机却也稳定，适合以日常磨合换长久默契。';
  }
  if(a>=11||b>=11){ score=Math.min(score+8,99); tip+=' 一方带 master 灵数，关系里往往多一层更深的意义牵引。'; }
  return {score,tag,tip};
}
/* 生命灵数 × 流年数 互动融合解读（去模板：由生命灵数与流年数的大小/相等关系确定措辞） */
function _lpPyFuse(n,py){
  const A=LP[n]||LP[1], B=LP[py]||LP[1];
  if(n===py) return '本年流年数同为「'+B.t+'」，与你的生命灵数同频共振——主题高度一致，宜把这一年的主弦弹满、全力推进。';
  if(n<py) return '本年流年数「'+B.t+'」比你的生命灵数「'+A.t+'」更外放一层，像是向上递的一级台阶——今年适合在本色之上，多往外走一步。';
  return '本年流年数「'+B.t+'」与你的生命灵数「'+A.t+'」形成互补对照——今年恰能补你生命数所缺的一面，宜借流年练平时不擅的功课。';
}
document.getElementById('numoBtn').onclick=()=>{
  const d=document.getElementById('numoBirth').value; if(!d){hintResult('numoResult','请选择生日后再测算生命灵数。');return;}
  const [y,m,day]=d.split('-').map(Number);
  const num=reduceLP(y+m+day); const info=LP[num]||LP[1];
  const name=document.getElementById('numoName').value.trim();
  const cy=new Date().getFullYear();
  const py=reduceLP(cy+m+day); const pyInfo=LP[py]||LP[1];
  // 姓名灵数：姓名各字笔画累减（毕达哥拉斯式——以笔画代字母值），真正参与计算
  let nameNum=null, nameInfo=null;
  if(name){
    let s=0; for(const ch of name){ try{ const a=cnchar.stroke(ch,'array'); s+=(a&&a[0])?a[0]:0; }catch(e){} }
    if(s>0){ nameNum=reduceLP(s); nameInfo=LP[nameNum]||LP[1]; }
  }
  // 天赋数字 + 人生高峰/挑战 + 灵数合盘
  const gifts=giftedNums(m,day);
  const cycles=lifeCycles(y,m,day);
  const age=new Date(cy,m-1,day)<=new Date(cy,new Date().getMonth(),new Date().getDate())
    ? cy-y : cy-y-1;
  const stageIdx = age<cycles.start?0 : age<cycles.start+27?1 : age<cycles.start+54?2 : 3;
  const pairD=document.getElementById('numoPair').value;
  let compatHTML='';
  if(pairD){
    const [py2,pm2,pday2]=pairD.split('-').map(Number);
    const pairNum=reduceLP(py2+pm2+pday2);
    const c=numerCompat(num,pairNum);
    const ringC=Math.round(c.score/10)*36;  // 适配 360 分段
    const ringSeg=Math.max(0,Math.min(360,(c.score/99)*360));
    compatHTML='<div class="numo-compat" style="margin-top:14px;padding:12px 14px;border-top:1px dashed var(--line);background:var(--r-subbg);border-radius:12px;font-size:13px;line-height:1.85">'
      +'<b style="color:var(--gold-soft)">灵数合盘 · 对方生命灵数 '+pairNum+'</b>'
      +'<div style="display:flex;align-items:center;gap:14px;margin-top:8px">'
      +'<svg width="72" height="72" viewBox="0 0 72 72" style="flex:none">'
      +'<circle cx="36" cy="36" r="30" fill="none" stroke="rgba(156,123,70,.18)" stroke-width="7"/>'
      +'<circle cx="36" cy="36" r="30" fill="none" stroke="var(--cinnabar)" stroke-width="7" stroke-linecap="round" stroke-dasharray="'+(ringSeg/360*188)+' 188" transform="rotate(-90 36 36)"/>'
      +'<text x="36" y="40" text-anchor="middle" font-size="14" font-weight="800" fill="var(--gold2)">'+c.score+'</text></svg>'
      +'<div><span class="tag">'+c.tag+'</span><p style="margin-top:5px;color:var(--muted);font-size:12px">灵数兼容度（毕达哥拉斯倾向配对）</p></div></div>'
      +'<p style="margin-top:8px">'+c.tip+'</p></div>';
  }
  // 个人月份数字（毕达哥拉斯：个人年份数 + 当前月份 累减 → 12 个月速览）
  const curMon=new Date().getMonth()+1;
  const curPM=reduceLP(py+curMon);
  let monthRow='';
  for(let mo=1; mo<=12; mo++){
    const pmN=reduceLP(py+mo), pmI=LP[pmN]||LP[1], isCur=mo===curMon;
    monthRow+='<div style="flex:0 0 auto;min-width:62px;padding:6px 4px;text-align:center;border-radius:9px;background:'+(isCur?'rgba(194,66,52,.12)':'transparent')+';border:1px solid '+(isCur?'var(--cinnabar)':'transparent')+'">'
      +'<div style="font-size:11px;color:'+(isCur?'var(--cinnabar)':'var(--muted)')+'">'+mo+'月</div>'
      +'<div style="font-size:18px;font-weight:800;color:var(--gold2)">'+pmN+'</div>'
      +'<div style="font-size:10px;color:var(--muted);line-height:1.3;margin-top:1px">'+pmI.t+'</div></div>';
  }
  const monthHTML='<div class="numo-year" style="margin-top:12px;padding:10px 12px;border-left:3px solid var(--teal);background:var(--r-subbg);font-size:13px;line-height:1.85">'
    +'<b>个人月份数字（'+curMon+' 月 = '+curPM+' · '+((LP[curPM]||LP[1]).t)+'）</b>'
    +'<p style="margin-top:5px;color:var(--muted);font-size:12px">由个人年份数 '+py+' ＋当月累减所得，提示你每个月的月度节奏与主题；红框为当前月份。</p>'
    +'<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">'+monthRow+'</div></div>';
  document.getElementById('numoResult').innerHTML='<div class="result">'
    +'<h3>生命灵数 '+num+'</h3>'
    +'<span class="tag">'+info.t+'</span>'
    +(num>=11?'<span class="tag">master 灵数</span>':'')
    +'<p style="margin-top:10px">'+info.d+'</p>'
    +'<p><b style="color:var(--gold2)">顺势：</b>'+info.g+'</p>'
    +'<p><b style="color:var(--gold2)">觉察：</b>'+info.b+'</p>'
    // —— 天赋数字 ——
    +(gifts.length?'<div class="numo-year" style="margin-top:12px;padding:10px 12px;border-left:3px solid var(--gold);background:var(--r-subbg);font-size:13px;line-height:1.85">'
      +'<b>天赋数字 '+gifts.join(' · ')+'</b>'
      +'<p style="margin-top:5px;color:var(--muted);font-size:12px">由出生月与日两两相邻相加归约所得，是天生顺手的才能。</p>'
      +gifts.map(g=>'<p style="margin-top:5px">· '+((GIFTED_T[g])||GIFTED_T[reduceAll(g)])+'</p>').join('')
      +'</div>':'')
    // —— 人生高峰与挑战 ——
    +'<div class="numo-year" style="margin-top:12px;padding:10px 12px;border-left:3px solid var(--cinnabar);background:var(--r-subbg);font-size:13px;line-height:1.85">'
    +'<b>人生四大阶段（高峰 / 挑战）</b><p style="margin-top:4px;color:var(--muted);font-size:12px">高峰期数是该阶段最该把握的功课，挑战数是需留意的坎。</p>'
    +['0-'+cycles.start,cycles.start+'-'+(cycles.start+26),cycles.start+27+'-'+(cycles.start+53),cycles.start+54+'+'].map((rng,i)=>{
      const hk=LP[reduceAll(cycles.peaks[i])]||LP[1], ck=LP[reduceAll(cycles.challenges[i])]||LP[1];
      const active=stageIdx===i;
      return '<div style="display:flex;justify-content:space-between;gap:10px;padding:6px 2px;margin-top:3px;border-left:2px solid '+(active?'var(--cinnabar)':'transparent')+';padding-left:8px;background:'+(active?'rgba(194,66,52,.06)':'transparent')+'">'
        +'<span style="flex:none;font-size:12px;color:'+(active?'var(--cinnabar)':'var(--muted)')+'">'+rng+(active?' · 现处':'')+'</span>'
        +'<span style="text-align:right;font-size:12px;line-height:1.7"><b>高峰 '+cycles.peaks[i]+'</b> '+hk.t
        +'<br><span style="color:var(--muted)">挑战 '+cycles.challenges[i]+' '+ck.t+'</span></span></div>';
    }).join('')
    +'</div>'
    +'<p style="margin-top:8px;color:var(--gold-soft);font-size:13px;line-height:1.85">'+_lpPyFuse(num,py)+'</p>'
    +(nameNum!==null?'<div class="numo-year" style="margin-top:12px;padding:10px 12px;border-left:3px solid var(--teal);background:var(--r-subbg);font-size:13px;line-height:1.85">'
      +'<b>姓名灵数 '+nameNum+'</b> <span class="tag">'+nameInfo.t+'</span>'
      +'<p style="margin-top:5px">「'+name+'」各字笔画累减所得，映你与外界互动的面向。</p></div>':'')
    +'<div class="numo-year" style="margin-top:12px;padding:10px 12px;border-left:3px solid var(--golden);background:var(--r-subbg);font-size:13px;line-height:1.85">'
    +'<b>'+cy+' 年流年数 '+py+'</b> <span class="tag">'+pyInfo.t+'</span>'
    +'<p style="margin-top:5px">本年主题：'+pyInfo.d+'</p>'
    +'<p style="color:var(--muted);font-size:12px;margin-top:4px">流年数 = 当前年份('+cy+')＋生日月日 累减所得，提示你这一年的外在节奏与功课。</p></div>'
    +monthHTML
    +compatHTML
    +'<p style="color:var(--muted);font-size:12px;margin-top:6px">* 皆由数字累减推得（master 11/22/33 不破）；高峰起始为经验式（约 36−灵数）。</p>'
    +'</div>';
};
/* ===================== 5c-辅助：测字真实底本（部首五行意象 + 高频字精拆 + 场景联动） ===================== */
/* 部首/常用部件五行意象表：通用字扫描字形取「部件会意」 */
const CEZI_RAD={
 '木':{wu:'木',img:'生发条达，如春木向阳；主仁德、生长、文事、安稳',tend:'吉'},
 '艹':{wu:'木',img:'草木蔓生，主生发、隐微、文书、柔中求进',tend:'中'},
 '竹':{wu:'木',img:'竹有节，主气节、清名、虚心',tend:'吉'},
 '禾':{wu:'木',img:'禾稼，主农事、收成、衣食',tend:'吉'},
 '火':{wu:'火',img:'炎上光明，主礼、名望、急进、显达',tend:'中'},
 '灬':{wu:'火',img:'四点底，火之余气，主光明、散逸、终成',tend:'中'},
 '日':{wu:'火',img:'日主光明、君象，主显达、时机、名声',tend:'吉'},
 '光':{wu:'火',img:'光明，主显扬、声誉',tend:'吉'},
 '水':{wu:'水',img:'润下流通，主智、变、财源、险陷',tend:'中'},
 '氵':{wu:'水',img:'水旁，主智、流通、财、迁动',tend:'中'},
 '雨':{wu:'水',img:'雨泽，主恩泽亦主忧戚',tend:'中'},
 '金':{wu:'金',img:'肃杀坚刚，主义、决断、收获、财',tend:'吉'},
 '钅':{wu:'金',img:'金旁，主义、利器、财货',tend:'吉'},
 '刀':{wu:'金',img:'刀兵，主决断亦主伤残、官非',tend:'凶'},
 '刂':{wu:'金',img:'立刀，同刀，主刑伤、决断',tend:'凶'},
 '玉':{wu:'金',img:'珍宝，主清贵、洁净',tend:'吉'},
 '王':{wu:'金',img:'尊贵，亦多玉象，主贵气',tend:'吉'},
 '土':{wu:'土',img:'厚重承载，主信、安稳、基业、迟滞',tend:'吉'},
 '山':{wu:'土',img:'山岳，主稳重、依靠亦主阻滞',tend:'中'},
 '石':{wu:'土',img:'磐石，主坚定、顽钝、础基',tend:'中'},
 '田':{wu:'土',img:'田土，主福田、衣食、产业、安稳',tend:'吉'},
 '阜':{wu:'土',img:'左阝，山阜，主升降、阻险、地势',tend:'中'},
 '心':{wu:'火',img:'心主神思，主智虑、情志、内明',tend:'中'},
 '忄':{wu:'火',img:'竖心，同心理，主思虑、情志',tend:'中'},
 '言':{wu:'金',img:'言为口舌，主诚信亦主争讼',tend:'中'},
 '讠':{wu:'金',img:'言旁，同言',tend:'中'},
 '口':{wu:'火',img:'口主言语、收纳、门户、饮食',tend:'中'},
 '人':{wu:'金',img:'人伦，主人事、同辈、众',tend:'中'},
 '亻':{wu:'金',img:'单人旁，同人',tend:'中'},
 '女':{wu:'水',img:'女主阴柔、姻缘、内助、情感',tend:'中'},
 '子':{wu:'水',img:'子嗣、种子，主后代、智慧、初创',tend:'吉'},
 '目':{wu:'木',img:'目主见、监察、明察',tend:'中'},
 '足':{wu:'土',img:'足主行止、出行、根基',tend:'中'},
 '手':{wu:'金',img:'手主作为、技艺、把持',tend:'中'},
 '扌':{wu:'金',img:'提手，同手',tend:'中'},
 '示':{wu:'土',img:'神祇、祭祀、福祸、显象',tend:'中'},
 '礻':{wu:'土',img:'示旁，主祈福、神事、祯祥',tend:'吉'},
 '衣':{wu:'土',img:'衣主遮护、外表、容饰',tend:'中'},
 '衤':{wu:'土',img:'衣旁，同衣',tend:'中'},
 '食':{wu:'土',img:'食主养、禄、口腹之奉',tend:'吉'},
 '饣':{wu:'土',img:'食旁，同食',tend:'吉'},
 '宀':{wu:'土',img:'宝盖，主家宅、安顿、覆盖、藏',tend:'吉'},
 '贝':{wu:'金',img:'贝古钱币，主财货、交易、价值',tend:'吉'},
 '马':{wu:'火',img:'马主驰骋、行远、奔波、速',tend:'中'},
 '车':{wu:'金',img:'车主载行、官职、转动、舆服',tend:'中'},
 '牛':{wu:'土',img:'牛主勤苦、力田、牺牲、坚韧',tend:'中'},
 '羊':{wu:'土',img:'羊主祥、柔顺、吉',tend:'吉'},
 '糸':{wu:'火',img:'丝缕，主牵缠、细微、文书、连续',tend:'中'},
 '纟':{wu:'火',img:'绞丝，同糸',tend:'中'},
 '页':{wu:'金',img:'页主首、名声、面上之事',tend:'中'},
 '门':{wu:'木',img:'门主出入、门户、关启、家',tend:'中'},
 '辶':{wu:'火',img:'走之，主行往、迁动、远',tend:'中'},
 '走':{wu:'火',img:'走主行、奔、动向',tend:'中'},
 '立':{wu:'火',img:'立主成立、独立、树立',tend:'吉'},
 '行':{wu:'水',img:'行主道路、行事、往来',tend:'中'},
 '米':{wu:'土',img:'米主食禄、细微、积累',tend:'吉'}
};
/* 谐音会意（保留原表） */
const CEZI_HOMO={'fu':'福气相随、得人扶助','fa':'发达之象、利求财进','cai':'财利之兆、宜谋资用','ji':'吉祥之音、所谋多遂','shun':'顺遂之兆、行事少阻','tong':'通达之意、路路皆通','xing':'兴起之象、渐入佳境','sheng':'生发上升、生机日旺','ping':'平正安稳、得失在人','an':'安泰之兆、宜守静'};
/* 精拆字库取格后，按问事场景生成断词 */
function ceziSceneSay(scene,tend,mean,c){
  const M={
    work:['事业','顺势担纲、借贵人之力','守正避锋、勿强出头','稳扎稳打、待时而动'],
    money:['求财','主动求财、忌贪得','守成积财、防耗散','稳中求财、不妄赌'],
    love:['感情','主动跨出、以柔化刚','先安顿自己、顺其自然','守拙养情、少生波折'],
    health:['健康','动则生阳、规律为宜','静以养阴、勿透支','平和养护、以节律为要'],
    study:['学业','攻难守靶、一鼓作气','稳节奏、重积累','循序渐进、小步快走'],
    move:['出行','动中求成、往外见机','宜有备而往、勿草率','平安可行、先安顿'],
    law:['官司','贵人和解、以静制动','谨言慎行、防官非','据理持平、勿激'],
    find:['寻物','福至心灵、留意常处','缓寻细觅、防遗落','于所亲历处可获']
  };
  const a=M[scene]||M.work;
  const idx=tend==='吉'?1:tend==='凶'?2:3;
  return '问'+a[0]+'：「'+c+'」'+mean+'（'+tend+'）——'+a[idx]+'。';
}
/* 通用字：扫描字形中已知部首，做部件会意 */
/* 高频字精拆字库：破字 + 偏旁五行会意 + 测字六法 + 取格（占卜常用字） */
const CEZI_WORD={
 '福':{split:'礻(示)+一+口+田',parts:[['示','土','神祇祭祀、祈福之象'],['田','土','福田、衣食之基'],['口','火','一口、言语收纳']],six:['破字：示+一口田——有衣(礻)有食(田)乃福','观梅：福从田出，田在口下，食禄安稳','接脚：福加心而成「愊」之象，福田在心，心安则福至'],tend:'吉',mean:'福泽顺遂、神佑可期'},
 '禄':{split:'礻(示)+录(水)',parts:[['示','土','神祇、福禄所系'],['水','水','禄如流、润下受养']],six:['破字：禄从示从录，录者次第受也，俸禄之象','观梅：禄如泉流，源源而受，官俸之征'],tend:'吉',mean:'俸禄、官位、受养'},
 '寿':{split:'老+寸',parts:[['老','土','年高、长久'],['寸','金','寸晷、衡量']],six:['破字：寿上从老，下从寸，老而有所守谓之寿','观梅：寿者久也，厚德载物乃长'],tend:'吉',mean:'长寿、安稳、积厚'},
 '喜':{split:'壴+口',parts:[['口','火','喜庆之言'],['士','土','位、端正']],six:['破字：喜从壴从口，击鼓而歌、口出欢声','观梅：喜在口边，言笑晏晏，吉事将至'],tend:'吉',mean:'喜庆、好事、称心'},
 '财':{split:'贝+才',parts:[['贝','金','财货、交易'],['才','金','才质、资']],six:['破字：财从贝从才，贝者古币，才者资也','观梅：财须有才守，有贝无才易散','接脚：财加宀而成「寶」意，家中有财乃安'],tend:'吉',mean:'财货、资用、得利'},
 '吉':{split:'士+口',parts:[['士','土','端正、位'],['口','火','言语、收纳']],six:['破字：吉从士从口，口出善言、事善成','观梅：吉者善也，无不利之象'],tend:'吉',mean:'吉祥、顺遂、无害'},
 '凶':{split:'凵+乂',parts:[['凵','土','陷阱、收敛'],['乂','金','交错、伤害']],six:['破字：凶从凵从乂，陷中有伤，危象','观梅：凶者陷也，宜守不宜进'],tend:'凶',mean:'险难、阻碍、宜慎'},
 '事':{split:'聿+丿(史)',parts:[['聿','木','笔、书写、政务'],['一','土','统摄']],six:['破字：事从中从彐从聿，职事、书写之象','观梅：事在人为，笔在手则谋可成'],tend:'中',mean:'事务、职事、作为'},
 '婚':{split:'女+昏',parts:[['女','水','姻缘、内助'],['昏','火','日暮、礼成之时']],six:['破字：婚从女从昏，古礼娶在昏时','观梅：婚因女成，黄昏为期，良缘之象'],tend:'吉',mean:'婚姻、结合、良缘'},
 '恋':{split:'亦+心',parts:[['心','火','思慕、情'],['亦','土','傍、附']],six:['破字：恋从心，心有所系之谓恋','观梅：恋在心头，缠绵不舍'],tend:'中',mean:'爱恋、思念、牵系'},
 '情':{split:'忄+青',parts:[['心','火','情志'],['青','木','东方、生、清']],six:['破字：情从心从青，心清而有所感','观梅：情生于心，青者生生之意'],tend:'中',mean:'情感、性情、感应'},
 '求':{split:'水(氺)+丶',parts:[['水','水','润下、索求'],['丶','火','一点、机']],six:['破字：求从水从丶，溯流而取之象','观梅：求如涉水，得法则获，强求则溺'],tend:'中',mean:'谋求、索取、期冀'},
 '谋':{split:'讠+某',parts:[['言','金','计议、言'],['木','木','本、某']],six:['破字：谋从言从某，先议而后动','观梅：谋定后动，言出有成'],tend:'中',mean:'谋划、计策、思虑'},
 '望':{split:'亡+月+王',parts:[['月','水','月、远'],['亡','土','出、失']],six:['破字：望从月从亡，举目向月、企盼之象','观梅：望在远方，守正而待'],tend:'中',mean:'期望、仰望、期许'},
 '安':{split:'宀+女',parts:[['宀','土','家宅、覆盖'],['女','水','内助、安']],six:['破字：安从宀从女，室有女则安','观梅：安者安于室，家宅宁则身安'],tend:'吉',mean:'安稳、家宅、宁定'},
 '危':{split:'厂+厄',parts:[['厂','土','高峻、险'],['厄','土','困、阻']],six:['破字：危从高从厄，高处有厄，险象','观梅：危者高也，宜下而避险'],tend:'凶',mean:'危险、高处、宜慎'},
 '病':{split:'疒+丙',parts:[['疒','土','疾、床'],['丙','火','火、显']],six:['破字：病从疒从丙，丙火见于外，疾显之象','观梅：病宜早治，火透则表'],tend:'凶',mean:'疾病、困弱、宜医'},
 '医':{split:'匚+矢',parts:[['匚','土','匣、藏'],['矢','金','箭、疾']],six:['破字：医从匚从矢，藏矢以治伤','观梅：医者意也，对症则愈'],tend:'中',mean:'医治、调护、解难'},
 '学':{split:'冖+子',parts:[['宀','土','覆、蒙'],['子','水','学子、初']],six:['破字：学从冖从子，蒙以养正','观梅：学如积土，日进有功'],tend:'吉',mean:'学问、修习、积累'},
 '官':{split:'宀+卩',parts:[['宀','土','官署、家'],['卩','金','符、职']],six:['破字：官从宀从卩，署有符信，职事之象','观梅：官贵在守，符信不失'],tend:'吉',mean:'官职、权位、职守'},
 '贵':{split:'中+贝',parts:[['贝','金','财货、价值'],['中','土','中、贵']],six:['破字：贵从中从贝，物以中道而贵','观梅：贵在得中，有贝而尊'],tend:'吉',mean:'尊贵、价值、显达'},
 '名':{split:'夕+口',parts:[['口','火','言语'],['夕','金','暗、远']],six:['破字：名从夕从口，昏冥之中口自传','观梅：名由口传，实至名归'],tend:'吉',mean:'名声、称号、声誉'},
 '利':{split:'禾+刀',parts:[['禾','木','禾稼、收'],['刀','金','收割、利']],six:['破字：利从禾从刀，以刀割禾，收获之象','观梅：利在及时，刀过禾成'],tend:'吉',mean:'利益、顺利、收获'},
 '泽':{split:'氵+睪',parts:[['水','水','润泽'],['金','金','显、择']],six:['破字：泽从水从睪，水聚而润物','观梅：泽被万物，施者得报'],tend:'吉',mean:'恩泽、润惠、汇聚'},
 '通':{split:'辶+甬',parts:[['辶','火','行往'],['金','金','通达、甬道']],six:['破字：通从辶从甬，道无壅塞','观梅：通者达也，行则无阻'],tend:'吉',mean:'通达、无碍、顺行'},
 '顺':{split:'川+页',parts:[['川','水','顺流'],['页','金','首、从']],six:['破字：顺从川从页，水顺流、首从之','观梅：顺天者昌，势所必然'],tend:'吉',mean:'顺利、顺从、合势'},
 '达':{split:'辶+大',parts:[['辶','火','行往'],['大','土','显、广']],six:['破字：达从辶从大，行而广大','观梅：达者通也，志行可见'],tend:'吉',mean:'显达、通达、成就'},
 '昌':{split:'日+日',parts:[['日','火','光明'],['日','火','光明']],six:['破字：昌从二日，光盛之象','观梅：昌者盛也，重明并照'],tend:'吉',mean:'昌盛、光明、兴盛'},
 '盛':{split:'成+皿',parts:[['皿','土','器、容'],['成','金','成就']],six:['破字：盛从成从皿，有成而容物','观梅：盛极当敛，满则招损'],tend:'吉',mean:'兴盛、丰盈、满'},
 '荣':{split:'艹+木',parts:[['木','木','生发'],['艹','木','草木']],six:['破字：荣从木从艹，草木华采','观梅：荣者华也，根深乃荣'],tend:'吉',mean:'荣华、显耀、繁茂'},
 '华':{split:'艹+化',parts:[['艹','木','草木'],['水','水','变化']],six:['破字：华从艹从化，草木华采、文采','观梅：华者花也，外美内实'],tend:'吉',mean:'光华、文采、繁盛'},
 '富':{split:'宀+一+口+田',parts:[['宀','土','家宅'],['田','土','产业'],['口','火','口食']],six:['破字：富从宀从一从口从田，家有其田、口食丰','观梅：富在田宅，守成乃久'],tend:'吉',mean:'富裕、资财、安稳'},
 '平':{split:'干+干',parts:[['干','金','平、正']],six:['破字：平从二干，均直之象','观梅：平者均也，无偏无陂'],tend:'吉',mean:'平正、安稳、均'},
 '康':{split:'广+隶',parts:[['广','土','屋、安'],['金','金','及、达']],six:['破字：康从广，屋下安处以养','观梅：康者安也，养正则康'],tend:'吉',mean:'安康、无疾、宁'},
 '宁':{split:'宀+心+皿',parts:[['宀','土','家宅'],['心','火','心神']],six:['破字：宁从宀从心，室静心安','观梅：宁者静也，静则生慧'],tend:'吉',mean:'安宁、静定、和'},
 '忧':{split:'忄+尤',parts:[['心','火','思虑'],['尤','土','过、怨']],six:['破字：忧从心从尤，心有过虑','观梅：忧生于心，放下则宽'],tend:'凶',mean:'忧戚、过虑、宜宽'},
 '愁':{split:'秋+心',parts:[['心','火','思虑'],['秋','金','收、肃']],six:['破字：愁从秋从心，秋气肃杀、心为之戚','观梅：愁如秋心，时至则散'],tend:'凶',mean:'愁苦、思结、宜解'},
 '悲':{split:'非+心',parts:[['心','火','情志'],['水','水','违、分']],six:['破字：悲从心从非，心有所违','观梅：悲者离也，聚则转欢'],tend:'凶',mean:'悲伤、离别、宜聚'},
 '恐':{split:'巩+心',parts:[['心','火','情志'],['土','土','束、惧']],six:['破字：恐从心从巩，心有所束','观梅：恐者惧也，知止则安'],tend:'凶',mean:'恐惧、戒惧、宜定'},
 '惊':{split:'忄+京',parts:[['心','火','情志'],['京','土','高、动']],six:['破字：惊从心从京，心为高所动','观梅：惊者动也，定神则复'],tend:'凶',mean:'惊动、突变、宜镇'},
 '疑':{split:'匕+矢+疋',parts:[['矢','金','直、疑'],['水','水','疏、异']],six:['破字：疑从矢从疋，直中有异、未决','观梅：疑者未明，察则释'],tend:'中',mean:'疑惑、未决、宜察'},
 '思':{split:'田+心',parts:[['田','土','福田、思'],['心','火','神思']],six:['破字：思从田从心，心田之用','观梅：思在田心，耕则得穗'],tend:'中',mean:'思虑、谋划、心田'},
 '想':{split:'相+心',parts:[['木','木','相、观'],['心','火','神思']],six:['破字：想从相从心，心有所相','观梅：想者象也，心驰于外'],tend:'中',mean:'想念、想象、心驰'},
 '言':{split:'亠+三+口',parts:[['口','火','言语'],['木','木','众、信']],six:['破字：言从口从三，一口出而众闻','观梅：言出如风，谨则全'],tend:'中',mean:'言语、诚信、表达'},
 '行':{split:'彳+亍',parts:[['水','水','道路、行事']],six:['破字：行从彳从亍，步趋之象','观梅：行者路也，举足则至'],tend:'中',mean:'行事、道路、往来'},
 '德':{split:'彳+十+目+心',parts:[['心','火','心德'],['目','木','明察'],['水','水','行']],six:['破字：德从彳从心从目，心明而行正','观梅：德者得也，厚德载物'],tend:'吉',mean:'德行、得、厚积'},
 '道':{split:'辶+首',parts:[['辶','火','行往'],['金','金','首、本']],six:['破字：道从辶从首，所行之本','观梅：道者路也，循本而行'],tend:'吉',mean:'道路、本原、法则'},
 '仁':{split:'亻+二',parts:[['人','金','人伦'],['土','土','偶、爱']],six:['破字：仁从人从二，人与人相偶','观梅：仁者爱也，推己及人'],tend:'吉',mean:'仁爱、仁厚、人伦'},
 '义':{split:'丶+我',parts:[['我','金','己、断'],['火','火','宜']],six:['破字：义从我从丶，我所宜也','观梅：义者宜也，当为则为'],tend:'吉',mean:'义理、宜、决断'},
 '礼':{split:'礻+乚',parts:[['示','土','神事、礼'],['土','土','曲、节']],six:['破字：礼从示从乚，礼以节文','观梅：礼者履也，履而后成'],tend:'吉',mean:'礼数、节文、秩序'},
 '智':{split:'知+日',parts:[['日','火','明'],['火','火','知、识']],six:['破字：智从知从日，日新其知','观梅：智者知也，明照于事'],tend:'吉',mean:'智慧、明察、识'},
 '信':{split:'亻+言',parts:[['人','金','人'],['言','金','言语、诚']],six:['破字：信从人从言，人言为信','观梅：信者诚也，言出必行'],tend:'吉',mean:'诚信、不欺、诺'},
 '金':{split:'金',parts:[['金','金','肃杀坚刚']],six:['破字：金从土生、从革作辛','观梅：金主义决，刚柔并济'],tend:'吉',mean:'金、财、决断'},
 '玉':{split:'王+丶',parts:[['王','金','贵'],['火','火','一点、润']],six:['破字：玉从王从丶，石之美有润','观梅：玉者洁也，温润而坚'],tend:'吉',mean:'宝玉、清贵、洁'},
 '宝':{split:'宀+玉',parts:[['宀','土','家藏'],['玉','金','珍宝']],six:['破字：宝从宀从玉，家中所藏之珍','观梅：宝者保也，藏而勿散'],tend:'吉',mean:'珍宝、可贵、藏'},
 '珠':{split:'王+朱',parts:[['王','金','玉'],['火','火','赤、明']],six:['破字：珠从玉从朱，玉之赤者','观梅：珠圆玉润，藏辉待价'],tend:'吉',mean:'珠玉、圆润、贵'},
 '光':{split:'⺌+兀',parts:[['火','火','光明']],six:['破字：光从火在人上，显明','观梅：光者明也，无幽不照'],tend:'吉',mean:'光明、显扬、声誉'},
 '明':{split:'日+月',parts:[['日','火','光明'],['水','水','清辉']],six:['破字：明从日从月，日月并照','观梅：明者照也，公私分明'],tend:'吉',mean:'光明、明察、显'},
 '日':{split:'日',parts:[['火','火','君象、光明']],six:['破字：日主君，光明之象','观梅：日升则万物见'],tend:'吉',mean:'日、时机、显达'},
 '月':{split:'月',parts:[['水','水','清辉、阴']],six:['破字：月主阴，清辉之象','观梅：月满则亏，盈虚有数'],tend:'中',mean:'月、阴、期'},
 '山':{split:'山',parts:[['土','土','稳重、阻']],six:['破字：山主静，稳重之象','观梅：山高可仰，亦能阻行'],tend:'中',mean:'山、稳、阻'},
 '水':{split:'水',parts:[['水','水','智、流、险']],six:['破字：水主智，润下流通','观梅：水柔能穿石，亦能覆舟'],tend:'中',mean:'水、智、变'},
 '田':{split:'田',parts:[['土','土','福田、产业']],six:['破字：田主食，方正之象','观梅：田在口下，食禄安稳'],tend:'吉',mean:'田、食、业'},
 '土':{split:'土',parts:[['土','土','厚载、信']],six:['破字：土主信，厚重承载','观梅：土厚能载，积小成大'],tend:'吉',mean:'土、基、信'},
 '草':{split:'艹+早',parts:[['艹','木','草木'],['火','火','晨、生']],six:['破字：草从艹从早，萌于晨','观梅：草昧初开，生机暗长'],tend:'中',mean:'草、微、生'},
 '木':{split:'木',parts:[['木','木','生发、仁']],six:['破字：木主仁，生发条达','观梅：木生于春，向阳则荣'],tend:'吉',mean:'木、生、仁'},
 '火':{split:'火',parts:[['火','火','炎上、礼']],six:['破字：火主礼，炎上光明','观梅：火明则显，过则自焚'],tend:'中',mean:'火、礼、显'},
 '人':{split:'人',parts:[['金','金','人伦、众']],six:['破字：人主仁，立人之道','观梅：人者仁也，同气相应'],tend:'中',mean:'人、事、众'},
 '子':{split:'子',parts:[['水','水','子嗣、初']],six:['破字：子主滋生，初创之象','观梅：子者滋也，生生不息'],tend:'吉',mean:'子、初、智'},
 '女':{split:'女',parts:[['水','水','阴柔、姻缘']],six:['破字：女主阴，内助之象','观梅：女贞而顺，家道乃成'],tend:'中',mean:'女、姻、柔'},
 '心':{split:'心',parts:[['火','火','神思、情']],six:['破字：心主神，万事之君','观梅：心安则百事顺'],tend:'中',mean:'心、思、情'},
 '口':{split:'口',parts:[['火','火','言语、纳']],six:['破字：口主言语、收纳','观梅：口为福门，亦为祸门'],tend:'中',mean:'口、言、纳'},
 '目':{split:'目',parts:[['木','木','明察、见']],six:['破字：目主见，监察之象','观梅：目明则察秋毫'],tend:'中',mean:'目、见、察'},
 '手':{split:'手',parts:[['金','金','作为、技']],six:['破字：手主作为，执持之象','观梅：手到擒来，勤则有功'],tend:'中',mean:'手、作、技'},
 '足':{split:'足',parts:[['土','土','行止、基']],six:['破字：足主行，根基之象','观梅：足下生根，行稳致远'],tend:'中',mean:'足、行、基'},
 '刀':{split:'刀',parts:[['金','金','决断、伤']],six:['破字：刀主决，亦主伤','观梅：刀利须藏，用则见血'],tend:'凶',mean:'刀、决、伤'},
 '剑':{split:'佥+刂',parts:[['刂','金','兵、决'],['金','金','众、敛']],six:['破字：剑从佥从刀，双刃之兵','观梅：剑者敛也，藏锋为用'],tend:'中',mean:'剑、决、兵'},
 '车':{split:'车',parts:[['金','金','载行、职']],six:['破字：车主载，转动之象','观梅：车行则达，轮转不息'],tend:'中',mean:'车、行、职'},
 '马':{split:'马',parts:[['火','火','驰骋、奔']],six:['破字：马主行远，驰骋之象','观梅：马逸须辔，纵则失途'],tend:'中',mean:'马、奔、行'},
 '牛':{split:'牛',parts:[['土','土','勤苦、力']],six:['破字：牛主勤，力田之象','观梅：牛耕得谷，劳而有获'],tend:'中',mean:'牛、勤、力'},
 '羊':{split:'羊',parts:[['土','土','祥、柔']],six:['破字：羊主祥，柔顺之象','观梅：羊者祥也，温润得吉'],tend:'吉',mean:'羊、祥、柔'},
 '衣':{split:'衣',parts:[['土','土','遮护、表']],six:['破字：衣主蔽体，外表之象','观梅：衣者依也，披之则完'],tend:'中',mean:'衣、护、表'},
 '食':{split:'人+良',parts:[['食','土','养、禄'],['人','金','人']],six:['破字：食主养，禄食之象','观梅：食者实也，足食则安'],tend:'吉',mean:'食、禄、养'},
 '住':{split:'亻+主',parts:[['人','金','人'],['土','土','主、安']],six:['破字：住从人从主，人所主止','观梅：住者驻也，安居则定'],tend:'中',mean:'住、安、止'},
 '和':{split:'禾+口',parts:[['禾','木','和、收'],['口','火','言语']],six:['破字：和从禾从口，言出而稼成','观梅：和者谐也，和声致祥'],tend:'吉',mean:'和、谐、顺'},
 '合':{split:'人+一+口',parts:[['人','金','人'],['口','火','收纳']],six:['破字：合从人从口，人一口而合','观梅：合者聚也，分则力散'],tend:'吉',mean:'合、聚、成'},
 '好':{split:'女+子',parts:[['女','水','姻'],['子','水','子']],six:['破字：好从女从子，女有子为好','观梅：好者美也，阴阳相得'],tend:'吉',mean:'好、美、宜'},
 '歹':{split:'歹',parts:[['金','金','坏、残']],six:['破字：歹主坏，残破之象','观梅：歹者危也，宜避'],tend:'凶',mean:'歹、坏、危'},
 '成':{split:'戊+戈',parts:[['戈','金','兵、成'],['土','土','中、武']],six:['破字：成从戊从戈，以武定功','观梅：成者终也，功到自成'],tend:'吉',mean:'成、就、功'},
 '败':{split:'贝+攴',parts:[['贝','金','财'],['金','金','击、破']],six:['破字：败从贝从攴，击贝而破','观梅：败者毁也，守成勿败'],tend:'凶',mean:'败、损、破'},
 '得':{split:'彳+日+寸',parts:[['水','水','行'],['金','金','得、度']],six:['破字：得从彳从寸，行而有度乃得','观梅：得者获也，取之有道'],tend:'吉',mean:'得、获、宜'},
 '失':{split:'丿+夫',parts:[['土','土','失、逸']],six:['破字：失从夫从丿，逸而去之','观梅：失者去也，惜则复来'],tend:'凶',mean:'失、去、宜惜'},
 '兴':{split:'同+廾',parts:[['火','火','同、起'],['木','木','分、众']],six:['破字：兴从同从廾，众手同举','观梅：兴者起也，同力则盛'],tend:'吉',mean:'兴、起、盛'},
 '亡':{split:'亠+乚',parts:[['土','土','失、隐']],six:['破字：亡主失，隐去之象','观梅：亡者无也，宜补毋缺'],tend:'凶',mean:'亡、失、隐'},
 '梦':{split:'夕+宀',parts:[['金','金','暗、寐'],['土','土','心、室']],six:['破字：梦从夕从宀，寐中所见','观梅：梦者蒙也，觉则自明'],tend:'中',mean:'梦、寐、兆'},
 '兆':{split:'儿+兆',parts:[['水','水','分、征']],six:['破字：兆主征，显见之象','观梅：兆者召也，吉凶先见'],tend:'中',mean:'兆、征、先见'},
 '祥':{split:'礻+羊',parts:[['示','土','神事'],['羊','土','祥']],six:['破字：祥从示从羊，羊者祥也','观梅：祥者和也，神降之福'],tend:'吉',mean:'祥、吉、福'},
 '瑞':{split:'王+专',parts:[['玉','金','玉'],['金','金','信、玉']],six:['破字：瑞从玉从专，以玉为信','观梅：瑞者符也，玉出嘉祥'],tend:'吉',mean:'瑞、符、吉'},
 '灾':{split:'宀+火',parts:[['火','火','焚'],['土','土','家']],six:['破字：灾从宀从火，家中有焚','观梅：灾者害也，防于未然'],tend:'凶',mean:'灾、害、宜防'},
 '祸':{split:'礻+呙',parts:[['示','土','神谴'],['土','土','乖、损']],six:['破字：祸从示从呙，神降之乖','观梅：祸者害也，积善可免'],tend:'凶',mean:'祸、害、宜修'},
 '囚':{split:'囗+人',parts:[['人','金','人'],['土','土','围、困']],six:['破字：囚从人在囗中，拘系之象','观梅：囚者拘也，宜求解脱'],tend:'凶',mean:'囚、拘、困'},
 '困':{split:'囗+木',parts:[['木','木','材'],['土','土','围']],six:['破字：困从木在囗中，材为所束','观梅：困者穷也，木出则通'],tend:'凶',mean:'困、穷、宜通'}
};

function ceziRadScan(c){
  const out=[];
  for(const k in CEZI_RAD){ if(c.indexOf(k)>=0 && c!==k) out.push([k,CEZI_RAD[k]]); }
  return out.slice(0,3);
}

/* ===================== 5c. 测字占卜（单字意象 + 笔画数理） ===================== */
/* 五行意象与签语池（按 数理五行 取象，确定性 + 轻度随机，结果可核验） */
const CEZI_WU={
  '木':{trait:'生发条达，如春木向阳',pool:['此字带木气，事宜趁势而进、广结善缘。','木性仁，缓则生根，急则折——宜以耐心养局。','木主仁德，与人相处多得助力，守拙反成。']},
  '火':{trait:'炎上光明，如灯烛照夜',pool:['此字带火气，名望易显但须防过烈伤身。','火性礼，行事磊落易得人敬，然急躁则自焚。','火主显达，把握时机可一举扬名，忌拖泥带水。']},
  '土':{trait:'厚重承载，如大地安邦',pool:['此字带土气，宜守不宜攻，踏实最稳。','土性信，积小成大，根基稳则百事宁。','土主诚信，言出必行反得长久之利。']},
  '金':{trait:'肃杀坚刚，如金石可镂',pool:['此字带金气，决断利财但须防锋芒太露。','金主义，刚中有柔方成大事，过刚易折。','金主收获，宜在关键处出手，忌面面俱到。']},
  '水':{trait:'润下流通，如江河行地',pool:['此字带水气，智慧流通，宜以变应变。','水性智，顺势而为则无往不利，逆之则困。','水主智谋，谋定后动，迂回反可达岸。']}
};
const CEZI_LUCK={1:'数理吉祥，所谋多遂',2:'数理有阻，宜守不宜进',0:'数理平正，得失在人'};
document.getElementById('ceziBtn').onclick=()=>{
  const raw=document.getElementById('ceziChar').value.trim();
  if(!raw || !/[\u4e00-\u9fa5]/.test(raw)){ hintResult('ceziResult','请写一个汉字（单字）再测。'); return; }
  const c=raw[0];
  const scene=document.getElementById('ceziScene')?document.getElementById('ceziScene').value:'';
  let st=0, isKX=false;
  if(KX[c]!==undefined){ st=KX[c]; isKX=true; }
  else { try{ const a=cnchar.stroke(c,'array'); st=a&&a[0]?a[0]:0; }catch(e){} }
  const wu=st?wuOfNum(st):'土';
  const si=st?shuInfo(st):[0,'',0];
  const luckTxt=st?(si[2]===1?'吉':si[2]===2?'凶':'平'):'';
  const wd=CEZI_WORD[c];
  const meanTxt=wd?wd.mean:(c+'字五行属'+wu+(st?('，'+si[1]):''));
  let html='<div class="result"><h3>测字 · 「'+c+'」</h3>';
  if(st) html+='<span class="tag">'+st+' 画'+(isKX?'（康熙）':'（通用）')+'</span>';
  html+='<span class="tag">五行 · '+wu+'</span>';
  if(st) html+='<span class="tag">'+si[1]+'（'+luckTxt+'）</span>';
  if(wd){
    html+='<p style="margin-top:10px"><b style="color:var(--gold2)">拆字</b>：'+wd.split+'</p>';
    if(wd.parts&&wd.parts.length){
      html+='<div style="margin-top:6px">'+wd.parts.map(p=>'<span class="tag" style="border-color:var(--gold)">'+p[0]+' · '+p[1]+'</span>').join('')+'</div>';
      html+='<p style="color:var(--muted);font-size:12.5px;margin-top:6px">'+wd.parts.map(p=>p[0]+'：'+p[2]).join('；')+'</p>';
    }
    if(wd.six&&wd.six.length){
      html+='<p style="margin-top:8px"><b style="color:var(--gold2)">测字六法</b></p>'+wd.six.map(s=>'<p style="font-size:12.5px;line-height:1.7;margin:3px 0">· '+s+'</p>').join('');
    }
    html+='<p style="margin-top:8px"><b style="color:var(--cinnabar-ink)">取格</b>：'+wd.mean+'（<b>'+wd.tend+'</b>）</p>';
  } else {
    let pyKey='', homo='';
    try{
      const _strip=s=>s.replace(/[0-9āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, m=>({'ā':'a','á':'a','ǎ':'a','à':'a','ē':'e','é':'e','ě':'e','è':'e','ī':'i','í':'i','ǐ':'i','ì':'i','ō':'o','ó':'o','ǒ':'o','ò':'o','ū':'u','ú':'u','ǔ':'u','ù':'u','ǖ':'v','ǘ':'v','ǚ':'v','ǜ':'v'}[m]||m));
      const sp=cnchar.spell(c); const arr=Array.isArray(sp)?sp:[sp]; pyKey=_strip(arr[0]||'').toLowerCase().replace(/[^a-z]/g,'');
    }catch(e){}
    if(CEZI_HOMO[pyKey]) html+='<p style="margin-top:6px"><b style="color:var(--gold2)">谐音</b>：此字谐音「'+pyKey+'」——'+CEZI_HOMO[pyKey]+'</p>';
    html+='<p style="margin-top:8px"><b style="color:var(--cinnabar-ink)">取格</b>：五行属'+wu+(st?('，'+si[1]+'（'+luckTxt+'）'):'')+'；字库未精收此字，以笔画理数兼谐音会意参看（精拆字库覆盖福禄寿喜财等常见占卜字）。</p>';
  }
  if(scene) html+='<p style="margin-top:10px;border-left:3px solid var(--gold);padding-left:8px">'+ceziSceneSay(scene, wd?wd.tend:'中', meanTxt, c)+'</p>';
  html+='<p style="color:var(--muted);font-size:12px;margin-top:10px">* 测字以字形拆解、偏旁五行会意与测字六法（破字/装头/接脚/穿心/添减笔/观梅）为据；笔画优先取康熙字典笔数（未收录字用通用笔画），与姓名五格同源。精拆字库覆盖常见占卜字，未收录字以部件会意与笔画理数参看。仅供趣味参考。</p></div>';
  document.getElementById('ceziResult').innerHTML=html;
};
/* ===================== 6. 观音灵签（传统签文） ===================== */
const GUANYIN=[
 {lv:'上上',po:'开天辟地作良缘，日吉时良万物全；若得此签非小可，公侯将相在眼前。',jie:'谋望皆成，诸事顺遂，贵人相助，宜把握时机。'},
 {lv:'上上',po:'宝剑出匣耀光明，在匣全然不惹尘；今日持来天上去，得知必是斩妖精。',jie:'才华终得施展，困局将破，静待时机成熟。'},
 {lv:'中上',po:'月出光辉本无私，城楼鼓角又齐吹；云开雾散终有日，何愁金榜不题名。',jie:'渐入佳境，努力有回报，耐心守候终见光明。'},
 {lv:'中平',po:'临风冒雨去还归，役役劳心似燕儿；衔得泥来成叠后，到头叠坏复成泥。',jie:'劳心费力而成效不显，宜稳守，莫徒劳奔忙。'},
 {lv:'中平',po:'千年古镜复重圆，女再求夫男再婚；自此门庭多改换，更添福禄共儿孙。',jie:'离散复合、破镜重圆之象，家运渐兴。'},
 {lv:'中上',po:'投身岩下饲于菟，须是还他大丈夫；舍命因得全性命，但教名利待时图。',jie:'先难后易，守得云开，名利待时而后图。'},
 {lv:'下下',po:'鲸鱼未变守江湖，不可升腾离泥沙；他日峥嵘身变化，许君一跃跳龙门。',jie:'时未至，宜潜伏守分，待风云际会。'},
 {lv:'下下',po:'雾里看花未分明，且待风清月更清；欲问前途何所似，守得云开见月明。',jie:'眼前迷雾，不宜冒进，稳守待变最宜。'},
 {lv:'中平',po:'营谋行事有疑难，莫听旁人说事端；凡事求心休妄动，自然和睦保平安。',jie:'事有疑难，勿听人拨弄，守本心则安。'},
 {lv:'上上',po:'一日愁来一日忧，心中烦恼几时休；通宵大梦无言说，千古英雄空白头。',jie:'（注：此签示放下执忧，心宽则百事顺。）'},
 {lv:'中上',po:'锦上添花色更鲜，运逢加倍喜安然；凡事营谋皆称意，更须守己莫心偏。',jie:'吉上加吉，谋事称意，然须守正莫偏。'},
 {lv:'下下',po:'墙报古树欲摧折，未遇良工怎奈何；纵有春风吹不到，枯枝依旧向人多。',jie:'诸事暂缓，慎防口舌是非，低调以待时运。'},
 {lv:'上上',po:'天地交泰万物新，好风凭借力千钧；时来惟有喜非常，凤凰飞入青云路。',jie:'时运大开，乘势而上，所求多遂，宜进取。'},
 {lv:'上上',po:'花开结果的满园春，福禄自来不待人；若问营谋皆遂意，更添喜气闹门庭。',jie:'福禄双至，谋事皆成，门庭有喜，宜纳吉。'},
 {lv:'中上',po:'一轮明月照高楼，万里风光入眼流；莫道平生无觅处，此中自有钓鳌舟。',jie:'前景开阔，静中见机，自有收获，宜守正待时。'},
 {lv:'中上',po:'鹤鸣九皋声闻天，志在云霄不计年；但使身心常淡泊，功名何必在眼前。',jie:'志向高远，淡泊自守，功名水到渠成。'},
 {lv:'中平',po:'棋局初开子未齐，心头算计莫沉迷；饶人一步终无害，退后原来路不迷。',jie:'谋事初起，切忌贪进，让一步反得安稳。'},
 {lv:'中平',po:'春花秋月两相依，得失荣枯各有期；莫为浮云遮望眼，清风明月是相知。',jie:'得失有常，不必执念，守得本心自安。'},
 {lv:'中平',po:'舟行逆水莫嫌迟，篙橹辛勤自有时；待得潮平风正便，一帆直过海天湄。',jie:'逆水行舟，辛苦有时，待潮平风正便顺。'},
 {lv:'中下',po:'残花落地不堪看，独立黄昏泪暗弹；莫怨东风吹太急，明年依旧倚栏干。',jie:'眼下稍挫，情势低迷，宜养精蓄锐，待来年春信。'},
 {lv:'中下',po:'灯残漏尽夜迢迢，事到临头心自焦；若问前程归何处，云横秦岭路遥遥。',jie:'事有阻滞，心勿焦躁，缓行方得安稳。'},
 {lv:'下下',po:'枯木逢春犹未苏，寒鸦啼处客心孤；劝君莫向危檐立，风雨来时先择隅。',jie:'根基未稳，宜避风险，先择安稳处再图。'},
 {lv:'下下',po:'孤舟独泛大江流，风急浪高未肯休；若问平安归泊处，且寻芦荻稳滩头。',jie:'行险宜止，寻稳泊之处，莫逞强涉险。'},
 {lv:'下下',po:'纸上谈兵终觉浅，临机应变总为难；不如归去深耕读，自有功成在岁寒。',jie:'空谈难成，宜踏实积累，功到自然成。'},
 {lv:'中上',po:'宝镜磨来尘尽去，清光依旧照人寒；从前迷雾今朝散，一览江山眼界宽。',jie:'迷障渐除，眼界大开，旧困将解。'},
 {lv:'上上',po:'春风得意马蹄疾，一日看尽长安花；若问前程何处好，青云直上路无涯。',jie:'意气风发，前程顺遂，宜乘势进发。'},
 {lv:'中平',po:'磨刀不误砍柴工，事必先谋而后通；若得良工施巧手，顽石也能化玲珑。',jie:'先谋后动，工到自然成，顽石可化玉。'},
 {lv:'中上',po:'好风频借力，送我上青云；莫道桑榆晚，为霞尚满天。',jie:'借力而行，晚景亦好，宜把握当下机缘。'},
 {lv:'上上',po:'一轮明月照寒潭，水底有天人不识；若问此中何所悟，清光自在你心头。',jie:'心明见性，所求在己，静中自得。'},
 {lv:'中上',po:'雨后青山格外明，云开日照万般清；前番风雨皆过客，且看今朝步更轻。',jie:'雨后初晴，旧事已过，前路渐明。'},
 {lv:'中平',po:'行船遇着打头风，帆落篙停且从容；待得风平浪静后，依然一棹到江东。',jie:'遇阻勿慌，静待风平，事缓则成。'},
 {lv:'下下',po:'久雨不晴云不开，出门一步便生埃；劝君且作安闲计，莫向前途强自猜。',jie:'时运低迷，宜守不宜进，静待云开。'},
 {lv:'中上',po:'玉堂金马本无门，唯有勤耕是路津；但使功夫深到极，铁杵也能磨成针。',jie:'勤能补拙，功到自成，贵在坚持。'},
 {lv:'中平',po:'双燕归来认旧巢，衔泥补垒自辛劳；往来多少穿帘客，不及梁间一步高。',jie:'守旧业最稳，勿羡他人，安居乐业。'},
 {lv:'上上',po:'金鳞跃出碧波中，直上青云万里风；一举成名天下晓，从来天道酬勤功。',jie:'腾达在望，一鸣惊人，宜乘势而上。'},
 {lv:'中下',po:'独木桥头行路难，前有深潭后有山；若得贵人同助力，平安渡险见乡关。',jie:'前路多险，宜求助力，勿独行冒进。'},
 {lv:'中上',po:'寒梅傲雪立东墙，不与群芳斗短长；待到春风传信日，暗香浮动满庭芳。',jie:'耐得寂寞，守得住时，自有芬芳之日。'},
 {lv:'中平',po:'一池春水皱风纹，莫道无波事不闻；且看源头活水处，清流终会到家门。',jie:'风波暂起，终归平静，源头活水在。'},
 {lv:'上上',po:'云中鹤唳九重天，振羽高飞越万山；莫道前程多险阻，风光尽在最高巅。',jie:'志在高远，越险越进，前程无限。'},
 {lv:'下下',po:'破屋难遮风雨侵，寒窑无火倍愁心；劝君且自添薪炭，莫怨天公不作仁。',jie:'自处艰难，宜自救自暖，勿怨天尤人。'}
];
/* ===== 月老 / 吕祖 / 财神 三类灵签（国风签诗 + 主题断语） ===== */
const YUELAO=[
 {lv:'上上',po:'红线暗系两心知，月老牵来并蒂枝；从今琴瑟和鸣处，不负当初梦里期。',jie:'良缘天定，此际相遇非偶，宜惜取眼前人。'},
 {lv:'上上',po:'天作之合非虚语，三生石上旧姓名；今日牵丝成眷属，白头犹记此山盟。',jie:'正缘将至或婚事可成，宜早定。'},
 {lv:'中上',po:'月下老人笑指路，一段好姻在前头；莫待花开风过处，良辰错去难再求。',jie:'时机将熟，宜把握，迟则生变。'},
 {lv:'中上',po:'灯前絮语两心投，一种相思各自愁；待得鹊桥横汉处，人间佳耦共登楼。',jie:'情投意合，宜相约，水到渠成。'},
 {lv:'中上',po:'旧约重寻柳岸旁，当年人面映桃妆；缘来终有重逢日，莫叹蓬山道路长。',jie:'旧缘可续，宜留意故人。'},
 {lv:'中平',po:'情丝千缕理还乱，莫向心头自作难；且待秋来明月满，自有佳音到耳边。',jie:'情路暂紊，宜静，勿强解。'},
 {lv:'中平',po:'两意徘徊未肯前，中间犹隔一重烟；待得云开相见日，方知缘浅不由天。',jie:'双方犹疑，宜多沟通，缘分未定。'},
 {lv:'中平',po:'情深不寿语非虚，留得三分爱自余；莫把全心都付与，长久方知淡中趣。',jie:'爱需留白，太满易伤，长久在淡。'},
 {lv:'中下',po:'落花有意随流水，流水无心恋落花；莫把痴心付错处，东风吹散各天涯。',jie:'单恋或错位，宜看清，莫执。'},
 {lv:'中下',po:'镜里看花空自怜，有情却被无情恼；劝君收却痴心处，另向人间觅好缘。',jie:'情路受阻，宜转念，另有良缘。'},
 {lv:'下下',po:'孤雁失群夜未央，月老堂前诉凄凉；不是无缘终是错，只缘未到两相当。',jie:'缘未至或条件不合，宜修自身以待良配。'},
 {lv:'下下',po:'风雨摧花花易落，痴心难系薄情郎；早回头的时是岸，莫教愁损少年妆。',jie:'遇人不淑，宜断则断，护己为上。'}
];
const LVZU=[
 {lv:'上上',po:'剑气冲霄志未消，吕祖坛前授宝刀；此去斩除心中贼，功名立马上琼霄。',jie:'事业将起，宜立志进取，破心中障。'},
 {lv:'上上',po:'云开见日路光明，一番筹划一番成；若问功名何所向，青云有路任君行。',jie:'谋事顺遂，宜进取。'},
 {lv:'中上',po:'丹炉火候渐相宜，炼得真金出世稀；莫道功程无日就，功夫到处方知机。',jie:'积累将成，宜坚持，水到渠成。'},
 {lv:'中上',po:'逢山开路遇水桥，自有神明暗里招；莫道前程无倚靠，吕祖遗鞭在路遥。',jie:'前行有护，宜勇往。'},
 {lv:'中上',po:'宝剑新磨焕斗文，匣中龙气上青云；一朝持赠英雄手，斩断尘缘万障分。',jie:'才华得展，宜把握机遇。'},
 {lv:'中平',po:'谋事多端未肯休，心猿意马费绸缪；但教专一精诚在，不必忙忙碌白头。',jie:'事务繁杂，宜专注，莫分心。'},
 {lv:'中平',po:'棋局初开子未齐，不宜冒进失先机；守得稳处再落子，终见全盘活路迷。',jie:'开局宜稳，先立根基。'},
 {lv:'中平',po:'事来不必苦萦怀，顺逆原从心上裁；但得从容行正道，功名何必苦相催。',jie:'心境定则事定，宜从容。'},
 {lv:'中下',po:'时运未通志易灰，匣中龙剑掩光埃；待得风雷相激处，一声长啸出云来。',jie:'暂滞，宜隐忍蓄势，待时而发。'},
 {lv:'中下',po:'独木桥头路转艰，进前退后两为难；不如且退三步看，别有通途在岭端。',jie:'遇阻，宜退一步观局，另寻路。'},
 {lv:'下下',po:'雾锁千山行路迷，强驱羸马向险蹊；劝君且觅安稳处，莫教身陷乱云西。',jie:'时运低，宜守，勿冒进。'},
 {lv:'下下',po:'画饼充饥空自忙，镜花水月总成伤；不如归去深耕读，自有功名在岁霜。',jie:'虚耗，宜踏实积累。'}
];
const CAISHEN=[
 {lv:'上上',po:'财源滚滚随春到，库里金银日渐高；若问求财何处好，东南一路任逍遥。',jie:'财运大开，宜进取，利东南。'},
 {lv:'上上',po:'金船载宝入江来，富贵逼人不用猜；但把诚信为根本，财源不绝似潮回。',jie:'财气旺盛，宜守诚信，财源不绝。'},
 {lv:'中上',po:'经营得法利自生，莫道求财总不平；待得时机成熟日，满籝金玉自然成。',jie:'经营有道则利，宜稳健。'},
 {lv:'中上',po:'偏财一点落君家，意外之喜莫惊嗟；但取十分留七分，余三广种福根芽。',jie:'偏财可期，宜取之有度，散财积福。'},
 {lv:'中上',po:'路遇贵人携财至，困中得济喜非常；若问求财凭甚力，积善之家庆有余。',jie:'贵人助财，宜行善积德。'},
 {lv:'中平',po:'财如水火慎用之，过贪反惹自身危；知足常乐是本分，细水长流最相宜。',jie:'财宜知足，细水长流。'},
 {lv:'中平',po:'小财宜守大财谋，莫将本钱妄漂流；稳扎稳打行前去，渐渐丰盈不用愁。',jie:'宜稳健理财。'},
 {lv:'中平',po:'谋财半遂亦寻常，莫为盈亏乱主张；守得本心安稳过，不愁温饱度时光。',jie:'财路平顺，宜守本心。'},
 {lv:'中下',po:'镜里金银空欢喜，到手方知是虚花；劝君莫赌投机事，踏实营生便是家。',jie:'虚财/投机忌，宜踏实。'},
 {lv:'中下',po:'财来财去似风吹，聚少散多不自知；早立章程勤记账，免教空囊叹落晖。',jie:'财易散，宜理财守成。'},
 {lv:'下下',po:'破财消灾古语真，莫为铜臭丧其身；忍得一时亏处过，自有安宁在后尘。',jie:'破财免灾，宜看淡，守身安。'},
 {lv:'下下',po:'贪心不足蛇吞象，到头反失旧田庄；早回头处是活路，莫教沉溺利名场。',jie:'贪则招损，宜知足回头。'}
];
document.getElementById('gyBtn').onclick=()=>{
  const GY_LIB={
    guanyin:{icon:'🎋',lead:'手持心香，默念所问，求一签以决疑',tag:'观音签',note:'观音灵签为传统签诗，断语供参考',lib:GUANYIN},
    yuelao:{icon:'💕',lead:'心念良缘，月老殿前求一签定情分',tag:'月老签',note:'月老灵签为姻缘主题签诗，断语供参考',lib:YUELAO},
    lvzu:{icon:'☯',lead:'志在功业谋为，吕祖座下求一签指迷津',tag:'吕祖签',note:'吕祖灵签为事业主题签诗，断语供参考',lib:LVZU},
    caishen:{icon:'💰',lead:'心存营谋求财，财神座下求一签旺财源',tag:'财神签',note:'财神灵签为求财主题签诗，断语供参考',lib:CAISHEN}
  };
  const type=(document.getElementById('gyType')||{}).value||'guanyin';
  const cfg=GY_LIB[type]||GY_LIB.guanyin;
  const lead=document.getElementById('gyLead'); if(lead) lead.textContent=cfg.lead;
  const stick=document.getElementById('gyStick');
  stick.textContent=cfg.icon;
  stick.classList.add('shake');
  setTimeout(()=>{
    stick.classList.remove('shake');
    const g=cfg.lib[Math.floor(Math.random()*cfg.lib.length)];
    const gEl=document.getElementById('gyResult'); if(gEl) gEl.innerHTML=
      `<div class="result"><h3>${g.lv} · ${cfg.tag}</h3>
       <div style="text-align:center;font-style:italic;color:var(--gold2);line-height:2">${g.po}</div>
       <p style="margin-top:10px">${g.jie}</p>
       <p style="color:var(--muted);font-size:12px;margin-top:6px">* ${cfg.note}</p></div>`;
  },600);
};

/* ===================== 7. 周公解梦（传统条目） ===================== */
const DREAM_LIST=[
 {k:'去世|过世|走了|离世|奶奶|爷爷|外公|外婆|长辈|老人|故人',cat:'人物',t:'逝去的亲人',d:'梦见已故的亲人或长辈，多因思念未了，或你正面临某事想听听他们的意见。传统视为"示安"而非凶兆——是心里还有人惦记你。若近期恰有放不下的事，不妨安静想想想对 TA 说的话，或去祭扫一下，心会轻些。'},
 {k:'父母|爸|妈|父亲|母亲',cat:'人物',t:'父母',d:'梦见父母，常与安全感、被照顾或被期待有关。梦中相处和睦，主家宅安稳；若有争执，往往是现实里有话没说开，值得找机会聊聊。'},
 {k:'孩子|婴儿|小孩|宝宝',cat:'人物',t:'孩童',d:'孩子主纯真与新生机，也映你身上的责任。梦中小孩安好，主家宅和顺、某个新计划正在萌芽。'},
 {k:'老师|同学|学校|教室',cat:'人物',t:'学堂旧人',d:'回到学校、见到老师同学，多因现实里有"被考察、要交卷"的压力，或是对某段成长岁月的回望。把当下的事当作一次"考试"，准备充分就不慌。'},
 {k:'前任|前男|前女|旧爱|ex|初恋',cat:'人物',t:'旧人',d:'梦见旧人，多半不是还想复合，而是那段关系留下的某个议题（信任、被忽视、未完成）又在心里冒头。看清它在提醒你什么，比纠结那个人更重要。'},
 {k:'同事|老板|领导|客户|陌生人',cat:'人物',t:'周遭的人',d:'梦到工作关系里的人，多映射你与权威、合作或竞争的当下状态。谁让你紧张，就看看现实中那段关系卡在哪。'},
 {k:'自己|照镜子|镜中人|另一个我',cat:'人物',t:'自我',d:'梦见镜中的自己或"另一个我"，主自我审视。镜中人清晰则看得清自己，模糊则自我认知还待理顺。'},
 {k:'哭|流泪|眼泪',cat:'情绪',t:'悲伤',d:'梦中落泪，多是积压的情绪在释放，未必是坏事——心里的委屈找到了出口。醒后别憋着，找个方式说出来。'},
 {k:'笑|开心|高兴|喜悦',cat:'情绪',t:'喜悦',d:'梦里开心，是内心轻松、愿望被照见的信号。趁这股劲，现实里也推进点想做的事。'},
 {k:'害怕|恐惧|吓|鬼|妖怪|幽灵|鬼魂',cat:'情绪',t:'恐惧',d:'梦里的怕，常是白天没敢正面碰的那件事的影子。鬼怪未必真诡异，多是心头未解的惧或旧事纠缠；不惧则已能正视心魔。'},
 {k:'焦虑|着急|紧张|慌|不安',cat:'情绪',t:'焦虑',d:'梦里的慌张，是现实里"怕来不及、怕搞砸"的放大。先用笔把真正担心的事列出来，它反而没那么大了。'},
 {k:'愤怒|生气|吵架|发火',cat:'情绪',t:'愤怒',d:'梦里的火，多是白天咽下的不平。分清是对事还是对人，别让它在身体里结成结。'},
 {k:'牙|掉牙|牙齿',cat:'变动',t:'掉牙',d:'掉牙主变动，传统解为亲族远行或健康有变，也象"旧我褪去、口舌退散"。近期多问候家人、少逞口舌之争。'},
 {k:'怀孕|生孩子|胎梦|育儿',cat:'新生',t:'孕育',d:'怀孕生子主新计划、新局面的孕育与诞生，吉；也提示你正为某件事悄悄蓄力，给它时间。'},
 {k:'生病|受伤|伤|痛|血',cat:'变动',t:'耗损',d:'梦中病伤，多主近期精力透支或某处"出了状况"需留意；血亦主耗，宜谨慎用财、注意休息。'},
 {k:'飞|飞翔|天空|飞起来',cat:'变动',t:'飞扬',d:'飞主自由与突破，心绪轻盈、渴望挣脱束缚；亦暗示志向可趁势进取。'},
 {k:'坠落|掉下|摔|失重',cat:'变动',t:'失控',d:'坠落多主现实有失控感或焦虑。宜停下核对正在忙的事——稳心即稳势。'},
 {k:'裸体|光着|没穿衣服',cat:'状态',t:'坦诚',d:'裸体主卸下伪装。坦然则主真诚相见，窘迫则主怕被看穿、在意他人眼光。'},
 {k:'赤脚|鞋|没鞋',cat:'状态',t:'根基',d:'赤脚主底气与立足之处。踩实则稳，踩空则主眼下根基需再夯实。'},
 {k:'蛇|小龙',cat:'动物',t:'蛇',d:'蛇多主小人暗伏或隐秘机缘，也象蜕变——你正甩掉一层旧皮，迎来新状态。'},
 {k:'龙',cat:'动物',t:'龙',d:'龙主大吉，贵人提拔、事业腾跃之象。'},
 {k:'猫',cat:'动物',t:'猫',d:'猫主直觉灵敏，也提示暗处有微妙变化。黑猫别慌，多主试探与转机。'},
 {k:'狗|犬',cat:'动物',t:'狗',d:'狗主朋友可信、贵人相护；被追则主朋友间有误会待解。'},
 {k:'虎|狮子|大象|猛兽|熊',cat:'动物',t:'猛兽',d:'猛兽主外压或内勇。能降服则难关可破，被追则压力待疏。'},
 {k:'老鼠|鼠',cat:'动物',t:'鼠',d:'鼠主小耗，防细节疏漏、小破财；能抓住则镇得住烦扰。'},
 {k:'鱼',cat:'动物',t:'鱼',d:'鱼主余财，财源游来。捕到则所得将至，鱼游走则机会易逝、宜早把握。'},
 {k:'鸟|飞鸟|鸽子',cat:'动物',t:'鸟',d:'鸟主消息与自由。吉鸟报喜，困笼之鸟主心愿暂受束缚。'},
 {k:'水|河|海|湖|淹|溺水',cat:'自然',t:'水',d:'水主财亦主情。清澈之水主财运渐入；浑浊或溺水则情绪被淹没，需疏解。'},
 {k:'雨|下雨|暴雨',cat:'自然',t:'雨',d:'甘雨主恩泽降临、阻碍得解；暴雨则烦忧漫来，宜先躲一躲、理顺再出门。'},
 {k:'火|烧|火焰',cat:'自然',t:'火',d:'旺火主声名事业红火；失控之火提醒脾气与风险，需防患。'},
 {k:'雪|冰|冬|寒冷',cat:'自然',t:'雪',d:'白雪主心清事顺、化繁为简；冰寒则人际或事态偏冷，需主动暖场。'},
 {k:'地震|地动|地摇',cat:'自然',t:'震动',d:'地震主根基有动、计划遇突发，宜稳心核对地基，勿仓促大动。'},
 {k:'风|台风',cat:'自然',t:'风',d:'风主传讯与变动。顺风则势顺，逆风则宜暂守、等风过。'},
 {k:'雷|闪电',cat:'自然',t:'雷',d:'雷主惊醒与警醒，多提醒你忽视的某事；不必惧，当作一次提醒。'},
 {k:'太阳|阳光',cat:'自然',t:'日',d:'阳光主明朗、贵人照临；阴暗则心境待自亮。'},
 {k:'月亮|满月|月圆|月',cat:'自然',t:'月',d:'满月主情感圆满、事成团圆；月暗则心境需自照。'},
 {k:'星星|星空|流星',cat:'自然',t:'星',d:'星星主希望与愿景；流星主许愿时机，前路可期。'},
 {k:'树|森林|花|开花|草',cat:'自然',t:'草木',d:'花开主喜讯将至、际遇转好；落花则提醒珍惜眼前人；大树主根基渐稳。'},
 {k:'家|房子|老房子|搬家',cat:'场景',t:'屋宅',d:'房子主内心安顿与家运。新房吉，旧宅倾颓则主积压之事需清理；搬家主生活阶段切换。'},
 {k:'医院|看病|医生|护士',cat:'场景',t:'医',d:'医院主关注健康，或某处"需要被诊治"的关系、事。未必凶，是提醒你该照顾好自己或某件事。'},
 {k:'机场|车站|等车|排队|赶车',cat:'场景',t:'行旅',d:'机场车站主出发与等待。等不到车、排长队，主对"何时轮到我"的焦虑。'},
 {k:'寺庙|教堂|墓地|坟|祭拜',cat:'场景',t:'神圣',d:'寺庙墓地主静心与告慰。祭奠先人多因思念，也主想为某事讨个心安。'},
 {k:'桥|路|过河|楼梯|爬山|登山',cat:'场景',t:'过渡',d:'过桥爬山主阶段切换、难关将渡。桥断路断则主中途有变，宜备第二方案。'},
 {k:'电梯|楼|高楼',cat:'场景',t:'升降',d:'电梯主升降，上升主运势走高；卡住或下行则眼下有阻滞，耐心等下一班。'},
 {k:'车|开车|坐车',cat:'场景',t:'前程',d:'车行主事业推进。车坏或翻车则计划受阻，宜检修方向再上路。'},
 {k:'超市|商场|市场|买东西',cat:'场景',t:'交易',d:'商场超市主选择与消费欲，也象生活里"琳琅满目但该拿哪样"的犹豫。'},
 {k:'厕所|洗手间|上厕所',cat:'场景',t:'排解',d:'上厕所主清理积压之事。污秽排出则旧负卸下、身轻神爽；寻厕不得则主有求未达。'},
 {k:'考试|答题|交卷|考场',cat:'动作',t:'考运',d:'梦见应试，多因现实有压力待验。答得顺则信心足，卡顿则宜充分准备。'},
 {k:'结婚|婚礼|出嫁|办喜事',cat:'动作',t:'婚合',d:'婚嫁主结盟合作之机。单身者或遇良缘，有伴者关系更固。'},
 {k:'打架|战斗|冲突',cat:'动作',t:'争斗',d:'争斗主竞争或内心冲突，宜以和为贵，避免正面冲撞。'},
 {k:'吃饭|宴席|请客',cat:'动作',t:'滋养',d:'食主滋养与人际聚合，吉；独食无味则主孤，宜主动凑凑热闹。'},
 {k:'追|被追|逃跑|躲|躲藏',cat:'动作',t:'压力',d:'被追主现实有躲不开的事，宜正面处理；追不上则目标暂不可及，换个路径。'},
 {k:'寻找|找不到|丢|丢失|遗',cat:'动作',t:'失落',d:'寻找丢失，多主心里"少了点什么"或怕失去某物某人。理清真正在意的是什么。'},
 {k:'迟到|赶不上|错过|误点',cat:'动作',t:'失机',d:'迟到主怕错过、时间紧迫。梦醒宜盘点日程，别让拖延误事。'},
 {k:'游泳|潜水',cat:'动作',t:'沉浮',d:'游泳主在情绪中浮沉。游得顺则驾驭得当，呛水则情绪有点压过你。'},
 {k:'跑步|赶路|奔',cat:'动作',t:'奔忙',d:'奔跑主近期奔忙、赶进度。停不下来时，记得喘口气。'},
 {k:'钱|金|财|捡钱',cat:'物品',t:'财',d:'见财主得，实利将至；失财则提醒守成为上、谨防破耗。'},
 {k:'手机|电话|信息|微信',cat:'物品',t:'音讯',d:'手机主联络与音讯。接好消息则吉，找不到手机则怕错过什么，宜核对安排。'},
 {k:'钥匙|锁',cat:'物品',t:'解结',d:'钥匙主问题之钥、机会之门。找到则困局可解，丢钥匙则暂时不得其门。'},
 {k:'刀|剪刀|利器|菜刀',cat:'物品',t:'决断',d:'利器主切割与决断，宜快刀斩乱麻；被所伤则避锋芒、缓图之。'},
 {k:'戒指|首饰|礼物',cat:'物品',t:'盟约',d:'戒指礼物主承诺与珍视。收到则关系或被重视，丢失则怕被辜负。'},
 {k:'书|照片|信|日记',cat:'物品',t:'记忆',d:'书信任主知识与旧忆。翻到某页，或是心里某段往事又被翻起。'},
 {k:'钱包|包|行李',cat:'物品',t:'资财',d:'钱包主财源与身份。找到则财源将回，丢则守财防漏。'}
];
/* —— 让解读更准：同一意象按「顺/滞」与「自己/别人」给不同结论 —— */
const DREAM_POL={
 '财':{pos:'是「得财」之象——实利、进账或意外之喜将至，宜大方接住。',neg:'是「失财 / 破耗」之象——提醒守成为上、谨防漏财，近期大额支出先缓。'},
 '资财':{pos:'包 / 钱包失而复得或填满，主财源将回、身份感稳。',neg:'包 / 钱包丢失，主资财有漏、身份感晃动，宜先清点要紧物、守好钱袋。'},
 '解结':{pos:'找到钥匙、锁开了，主困局可解、机会之门已开。',neg:'丢钥匙或锁死，主暂时不得其门，宜先放一放、换思路。'},
 '水':{pos:'水清且顺，主财运与情绪渐入佳境。',neg:'水浑或溺水，主情绪被淹没、需疏解，别硬扛。'},
 '雨':{pos:'是甘雨——恩泽降临、阻碍得解。',neg:'是暴雨——烦忧漫来，先躲一躲、理顺再出门。'},
 '火':{pos:'火旺而可控，主声名事业红火。',neg:'火失控，主脾气与风险外溢，需防患于未然。'},
 '考运':{pos:'答得顺、考过了，主信心足、现实可过关。',neg:'卡顿、没考过，主还需更充分准备，别轻敌。'},
 '失机':{pos:'赶上了、没错过，主时机握得住。',neg:'迟到错过，主怕误事——梦醒盘点日程，别让拖延误事。'},
 '前程':{pos:'车行顺畅，主事业推进、进度在走。',neg:'车坏 / 翻车，主计划受阻，宜检修方向再上路。'},
 '行旅':{pos:'顺利出发、赶上车，主动身即顺。',neg:'等不到车、排长队，主对「何时轮到我」的焦虑。'},
 '压力':{pos:'追上或脱身，主能拿回主动。',neg:'被追逃不掉，主现实有躲不开的事，宜正面处理。'},
 '失落':{pos:'寻得 / 没丢，主心里那份踏实回来了。',neg:'找不到 / 丢失，主怕失去某物某人，理清真正在意的是什么。'},
 '蛇':{pos:'是隐秘机缘或正蜕变——你甩旧皮、迎新状态。',neg:'是小人暗伏，近期人际留三分余地。'},
 '耗损':{pos:'伤处渐愈，主精力回血、损耗将止。',neg:'病伤血耗，主精力透支或某处出状况，宜休息、慎财。'},
 '婚合':{pos:'是良缘 / 关系更固之象。',neg:'是关系生变之象，宜把话说开。'}
};
const DREAM_SUBJ=['掉牙','婚合','孕育','耗损'];
const POL_POS=/(捡到|捡|得[到]?|拿到|收到|找[到]?|抓[住]?|赶上|考[上过]|及[格]?|顺[利]?|成[功]?|赢|中[奖]?|团聚|回[家]?|升|涨|开[花]?|活|清[澈]?|亮|吉|达[成]?|通[过]?)/;
const POL_NEG=/(丢[失掉]?|遗[失]?|破[碎]?|碎|失[败]?|没赶[上]?|赶不[上]?|错[过]?|卡[住]?|堵|沉|溺|淹|淋|漏|被偷|被盗|亏|摔|撞|伤|病|死|散|离[开婚]?|分[手开]?|迷|困|黑|暗|怕|慌|急)/;
const SUBJ_OTHER=/(别人|他|她|某[人个]|朋友|同事|陌生|老公|老婆|丈夫|妻子|男友|女友|对象|奶奶|爷爷|外公|外婆|爸|妈|老人|长辈|孩子|小孩|宝宝)/;
const DREAM_NEGDEFAULT=new Set(['失机','失落','耗损','前程','行旅','压力']);
/* 生活领域映射：让心解点名梦在说「哪方面的事」，而非只给类别标签 */
const DREAM_DOM={
 '逝去的亲人':'人际','父母':'人际','孩童':'人际','学堂旧人':'成长','旧人':'感情','周遭的人':'人际','自我':'内心',
 '悲伤':'内心','喜悦':'内心','恐惧':'内心','焦虑':'内心','愤怒':'内心',
 '掉牙':'人际','孕育':'成长','耗损':'健康','飞扬':'成长','失控':'内心','坦诚':'内心','根基':'内心',
 '蛇':'内心','龙':'事业','猫':'内心','狗':'人际','猛兽':'事业','鼠':'财运','鱼':'财运','鸟':'内心',
 '水':'财运','雨':'内心','火':'事业','雪':'内心','震动':'事业','风':'事业','雷':'内心','日':'事业','月':'感情','星':'内心','草木':'成长',
 '屋宅':'人际','医':'健康','行旅':'事业','神圣':'内心','过渡':'成长','升降':'事业','前程':'事业','交易':'财运','排解':'内心',
 '考运':'成长','婚合':'感情','争斗':'人际','滋养':'人际','压力':'内心','失落':'内心','失机':'事业','沉浮':'内心','奔忙':'事业',
 '财':'财运','音讯':'人际','解结':'事业','决断':'事业','盟约':'感情','记忆':'成长','资财':'财运'
};
/* —— 跨模块联动：水/火类梦境，按用户在「幸运色」填过的日主五行做本命视角解读 —— */
const DREAM_WU={'水':'水','雨':'水','雪':'水','火':'火'};
function dayWuDreamNote(de, ue){
  if(de===ue) return `此「${de}」象与你日主${ue}同气——梦在呼应你的本命底色，这类梦多起来时，说明你正和「自己」贴得很近，顺势就好。`;
  if(SHENG[de]===ue) return `「${de}」生你日主${ue}，是「印来生我」——梦在给你补能量，醒后别急着外耗，先养着这股润。`;
  if(SHENG[ue]===de) return `你日主${ue}生「${de}」，是「我生（食伤）」——梦在泄你的气，近期别把自己掏太干，留三分余力。`;
  if(KE[de]===ue) return `「${de}」克你日主${ue}，是「官杀临身」——梦里那股劲，多半是现实里扛着的事在夜里回放，正面碰一下就轻了。`;
  if(KE[ue]===de) return `你日主${ue}克「${de}」，是「我克为财」——你正试着驾驭它，梦在帮你练手。`;
  return '';
}
function catDom(c){ return ({'人物':'人际','情绪':'内心','变动':'成长','新生':'成长','状态':'内心','动物':'内心','自然':'内心','场景':'人际','动作':'事业','物品':'财运'})[c]||'内心'; }
document.getElementById('dreamBtn').onclick=()=>{
  const w=document.getElementById('dreamWord').value.trim();
  if(!w){hintResult('dreamResult','请先描述一下你梦到了什么。');return;}
  const feel=(document.querySelector('input[name="dfeel"]:checked')||{}).value||'';
  let hits=[];
  for(const it of DREAM_LIST){ if(new RegExp(it.k).test(w)) hits.push(it); }
  const seen={}; hits=hits.filter(h=>seen[h.t]?false:(seen[h.t]=1));
  const ORDER={'人物':0,'情绪':1,'变动':2,'新生':3,'状态':4,'动物':5,'自然':6,'场景':7,'动作':8,'物品':9};
  hits.sort((a,b)=>(ORDER[a.cat]??99)-(ORDER[b.cat]??99));
  function polOf(it){
    const m=w.match(new RegExp(it.k)); if(!m)return 0;
    const seg=w.slice(Math.max(0,m.index-8), m.index+m[0].length+8);
    const pre=w.slice(Math.max(0,m.index-3),m.index);
    const suf=w.slice(m.index+m[0].length, m.index+m[0].length+5);
    const negNear=/没|未|不|别|无/.test(pre+suf);
    let base=0;
    if(POL_NEG.test(seg)) base=-1; else if(POL_POS.test(seg)) base=1;
    if(base===0){ if(negNear && DREAM_NEGDEFAULT.has(it.t)) base=1; }
    else if(negNear) base=-base;
    return base;
  }
  function subjOf(it){
    const m=w.match(new RegExp(it.k)); if(!m)return '我';
    const seg=w.slice(Math.max(0,m.index-8), m.index+m[0].length+8);
    return SUBJ_OTHER.test(seg)?'他':'我';
  }
  let text;
  if(hits.length){
    let posN=0,negN=0;
    const items=hits.map(h=>{
      let body=h.d, tag='';
      const map=DREAM_POL[h.t];
      if(map){ const p=polOf(h); if(p>0){body=map.pos;posN++;tag=' <span style="color:var(--good)">〔顺〕</span>';} else if(p<0){body=map.neg;negN++;tag=' <span style="color:var(--bad)">〔滞〕</span>';} }
      if(DREAM_SUBJ.includes(h.t) && subjOf(h)==='他'){ body='（梦里是别人经历）'+body; }
      return `<li style="margin:4px 0"><b style="color:var(--gold2)">${h.t}</b>${tag}：${body}</li>`;
    }).join('');
    const names=hits.map(h=>h.t).join('、');
    const cats=[...new Set(hits.map(h=>h.cat))];
    /* 生活领域：多数命中意象归属哪个领域，点名梦在说哪方面的事 */
    const domCnt={}, domExplicit={};
    hits.forEach(h=>{ const dm=DREAM_DOM[h.t]||catDom(h.cat); domCnt[dm]=(domCnt[dm]||0)+1; if(DREAM_DOM[h.t]) domExplicit[dm]=(domExplicit[dm]||0)+1; });
    const dom=Object.keys(domCnt).sort((a,b)=>(domExplicit[b]-domExplicit[a])||(domCnt[b]-domCnt[a])||((a==='内心'?1:0)-(b==='内心'?1:0)))[0]||'内心';
    const domLine=dom?`整段串起来，更像在说「${dom}」的事——`:'';
    let theme='';
    if(cats.includes('人物')) theme='核心绕着「人」——某段关系或某个人正占用你的心思。';
    else if(cats.includes('情绪')) theme='主调是「情绪」——白天压住的感受在夜里浮了上来。';
    else if(cats.includes('变动')||cats.includes('新生')) theme='在讲「变化」——你正站在一个切换的节点上。';
    else if(cats.includes('自然')||cats.includes('场景')) theme='铺了一层「环境」——你对外在处境的感知很敏锐。';
    else if(cats.includes('动作')) theme='是一连串「动作」——你心里在反复演练某件事。';
    else theme='意象不多，但每个都值得停一下看。';
    let toneTxt='';
    if(posN&&!negN) toneTxt='走向偏「顺」，潜意识在给你鼓劲，现实里可顺势推一把。';
    else if(negN&&!posN) toneTxt='走向偏「滞」，多是白天没顺下去的事在夜里回放，先理最堵的那一件。';
    else if(posN&&negN) toneTxt='好坏掺半，像卡在「想进又怕退」的当口。';
    let feelTxt='';
    if(feel==='平静') feelTxt='你标了梦中平静，当下内在还算稳。';
    else if(feel==='喜悦') feelTxt='你带着喜悦，是愿望被照见的好信号。';
    else if(feel==='害怕') feelTxt='你带着害怕，提醒白天有没敢正面碰的事。';
    else if(feel==='焦虑') feelTxt='你带着焦虑，是把「怕来不及」放大了——写下来拆小就好。';
    else if(feel==='困惑') feelTxt='你带着困惑，是有些事还没想明白，给它点时间。';
    /* 一句话钩子：领域 + 净极性 + 感受，最贴切的入口 */
    const net=posN>negN?'有向好信号':negN>posN?'正卡着点事':'有波动';
    const lead1=`一句话：你最近在「${dom}」上${net}${feel&&feel!=='说不清'?'，心里是「'+feel+'」':''}。`;
    const tips=[];
    if(negN>posN) tips.push('先处理梦里最「滞」的那件事，别让它过夜。');
    if(posN>negN) tips.push('顺着梦里的好势头，现实里迈出一小步。');
    if(cats.includes('人物')) tips.push('若梦到故人或旧人，安静想想想对 TA 说的话，心会轻些。');
    if(cats.includes('情绪')) tips.push('白天的情绪别憋，说出来或写下来。');
    if(cats.includes('变动')||cats.includes('新生')) tips.push('变动期别急着定论，给点观察期。');
    if(cats.includes('动作')&&cats.includes('情绪')) tips.push('把梦里反复演练的事，落到现实第一步。');
    if(!tips.length) tips.push('醒来记下这个梦，过几天回看，常会懂它想说啥。');
    const cov=hits.length>=4?'意象较丰富':(hits.length===1?'只识别到一个意象，解读偏薄，可补充更多细节':'');
    let benmingBlock='';
    const ue=window.__baziDayWu||window.__userDayWu;
    if(ue){
      const wuHits=hits.filter(h=>DREAM_WU[h.t]);
      if(wuHits.length){
        const yongSet=window.__baziYong?new Set(window.__baziYong):null;
        const jiSet=window.__baziJi?new Set(window.__baziJi):null;
        const ueGan=window.__baziDayGan||window.__userDayGan;
        const notes=wuHits.map(h=>{ const de=DREAM_WU[h.t];
          let rel='';
          if(yongSet&&yongSet.has(de)) rel='（此'+de+'象属你的<b style="color:var(--good)">喜用</b>，多为助力、宜亲近）';
          else if(jiSet&&jiSet.has(de)) rel='（此'+de+'象属你的<b style="color:var(--bad)">忌神</b>，宜多觉察、少外耗）';
          return `<li style="margin:3px 0"><b style="color:var(--gold2)">${h.t}（${de}象）</b>：${dayWuDreamNote(de,ue)} ${rel}</li>`; }).join('');
        const qx=window.__baziQiang?(' · '+window.__baziQiang):'';
        const yx=window.__baziYong?(' · 喜'+window.__baziYong.join('/')):'';
        benmingBlock=`<div style="margin-top:8px;padding:8px 12px;border-left:3px solid #b3a78f;background:var(--r-subbg);font-size:13px;line-height:1.8"><b style="color:var(--gold2)">本命视角</b> <span style="color:var(--muted);font-size:12px">（按你日主${ueGan}·${ue}${qx}${yx}）</span><ul style="margin:6px 0 0 18px;padding:0">${notes}</ul></div>`;
      }
    }
    text=`<div class="result">
      <h3>梦境解析</h3>
      <p style="color:var(--muted);font-size:12px">共识别 ${hits.length} 个意象${feel&&feel!=='说不清'?' ｜ 梦中感受：'+feel:''}${cov?' ｜ '+cov:''}${dom?' ｜ 主领域：'+dom:''}${window.__userDayWu?' ｜ 本命视角已联动':''}</p>
      <div style="margin:8px 0;padding:8px 12px;background:var(--r-subbg);border-left:3px solid var(--gold2);font-size:13.5px;line-height:1.7"><b style="color:var(--gold2)">${lead1}</b></div>
      <div style="margin:8px 0"><b style="color:var(--gold2)">意象拆解</b><ul style="margin:6px 0 0 18px;padding:0;font-size:13px;line-height:1.7">${items}</ul></div>
      <div style="margin-top:10px"><b style="color:var(--gold2)">综合心解</b><p style="font-size:13px;line-height:1.8;margin:6px 0">你梦里出现了 <b>${names}</b>。${domLine}${theme}${toneTxt}${feelTxt}</p></div>
      ${benmingBlock}
      <div style="margin-top:8px"><b style="color:var(--gold2)">小建议</b><ul style="margin:6px 0 0 18px;padding:0;font-size:13px;line-height:1.7">${tips.map(t=>'<li style="margin:3px 0">'+t+'</li>').join('')}</ul></div>
      <p style="color:var(--muted);font-size:12px;margin-top:10px">* 已按梦中「顺 / 滞」极性与你标注的感受做二次校准，并映射到生活领域${window.__userDayWu?'；本命视角按你日主'+window.__userDayGan+'（'+window.__userDayWu+'）的五行生克联动水 / 火类梦境':''}；传统以「梦由心生」，以上供自我觉察参考，非预言。</p>
    </div>`;
  }else{
    text=`<div class="result"><h3>梦境解析</h3>
      <p>暂时没匹配到常见意象库（已收录人物 / 情绪 / 动物 / 自然 / 场景 / 动作 / 物品等约 60 类）。</p>
      <p style="font-size:13px;line-height:1.8">可补充梦里的<b style="color:var(--gold2)">具体事物</b>（如「水」「蛇」「考试」「奶奶」「迷路」），或<b style="color:var(--gold2)">你的感受</b>（害怕 / 开心 / 焦虑），解读会更贴合。</p>
      <p style="font-size:13px;line-height:1.8;margin-top:6px">通用视角：梦多由日间所思与未消化的情绪编织而成，把它当作潜意识递来的一张便签——记下它，过几天往往就懂了。</p>
      <p style="color:var(--muted);font-size:12px;margin-top:8px">* 趣占模块，仅供参考。</p></div>`;
  }
  document.getElementById('dreamResult').innerHTML=text;
};

/* ===================== 8. 周易占卦（真实卦辞 + 金钱起卦） ===================== */
const JING = {乾:[1,1,1],兑:[1,1,0],离:[1,0,1],震:[1,0,0],巽:[0,1,1],坎:[0,1,0],艮:[0,0,1],坤:[0,0,0]};
const JING_WU = {乾:'金',兑:'金',离:'火',震:'木',巽:'木',坎:'水',艮:'土',坤:'土'};
/* 上卦 / 下卦 / 卦辞（出自《周易》本经）/ 断语 */
const HEX = [
 {name:'乾',up:'乾',down:'乾',ci:'元，亨，利，贞。',du:'刚健中正，万事开端亨通，宜进取而守正。'},
 {name:'坤',up:'坤',down:'坤',ci:'元亨，利牝马之贞。君子有攸往，先迷后得主，利。',du:'厚载包容，柔顺得助，宜守静待时、厚德载物。'},
 {name:'屯',up:'坎',down:'震',ci:'元亨，利贞。勿用有攸往，利建侯。',du:'物始生而多难，宜固本扎根、求贤辅助。'},
 {name:'蒙',up:'艮',down:'坎',ci:'亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。',du:'蒙昧待启，宜受教问学、循序而进。'},
 {name:'需',up:'坎',down:'乾',ci:'有孚，光亨，贞吉。利涉大川。',du:'待时而动，心怀诚信，险在前宜忍。'},
 {name:'讼',up:'乾',down:'坎',ci:'有孚，窒。惕中吉。终凶。利见大人，不利涉大川。',du:'争讼多耗，宜止争求和、守慎免凶。'},
 {name:'师',up:'坤',down:'坎',ci:'贞，丈人吉，无咎。',du:'众聚为师，宜任正将、纪律严明则吉。'},
 {name:'比',up:'坎',down:'坤',ci:'吉。原筮，元永贞，无咎。不宁方来，后夫凶。',du:'亲比相辅，择善而附、早决则安。'},
 {name:'小畜',up:'巽',down:'乾',ci:'亨。密云不雨，自我西郊。',du:'小有蓄积未成，宜养德蓄势、待时发。'},
 {name:'履',up:'乾',down:'兑',ci:'履虎尾，不咥人，亨。',du:'履危而慎，行止有礼则免祸得亨。'},
 {name:'泰',up:'坤',down:'乾',ci:'小往大来，吉亨。',du:'天地交泰，阴阳和畅，诸事顺通。'},
 {name:'否',up:'乾',down:'坤',ci:'否之匪人，不利君子贞，大往小来。',du:'天地不交，闭塞之时，宜隐忍守正。'},
 {name:'同人',up:'乾',down:'离',ci:'同人于野，亨。利涉大川，利君子贞。',du:'与人和同，同心协力可成大事。'},
 {name:'大有',up:'离',down:'乾',ci:'元亨。',du:'富有盛世，持盈保泰、善用之则大吉。'},
 {name:'谦',up:'坤',down:'艮',ci:'亨，君子有终。',du:'谦尊而光，谦虚守礼，终得善果。'},
 {name:'豫',up:'震',down:'坤',ci:'利建侯行师。',du:'安乐顺动，宜预备而行、勿耽于逸。'},
 {name:'随',up:'兑',down:'震',ci:'元亨利贞，无咎。',du:'随时而动，从善相随，顺时则无咎。'},
 {name:'蛊',up:'艮',down:'巽',ci:'元亨，利涉大川。先甲三日，后甲三日。',du:'弊乱待治，宜整饬革新、除旧布新。'},
 {name:'临',up:'坤',down:'兑',ci:'元，亨，利，贞。至于八月有凶。',du:'临下亲民，阳气渐长，盛极当防衰。'},
 {name:'观',up:'巽',down:'坤',ci:'盥而不荐，有孚颙若。',du:'观风察俗，庄敬自省，以德化人。'},
 {name:'噬嗑',up:'离',down:'震',ci:'亨。利用狱。',du:'中有梗阻，宜决断明罚、去碍通滞。'},
 {name:'贲',up:'艮',down:'离',ci:'亨。小利有攸往。',du:'文饰之美，宜修饰礼仪、小节有助。'},
 {name:'剥',up:'艮',down:'坤',ci:'不利有攸往。',du:'阴盛剥阳，宜止不宜进、静守待复。'},
 {name:'复',up:'坤',down:'震',ci:'亨。出入无疾，朋来无咎。反复其道，七日来复，利有攸往。',du:'一阳来复，生机回转，宜顺势而起。'},
 {name:'无妄',up:'乾',down:'震',ci:'元亨，利贞。其匪正有眚，不利有攸往。',du:'不妄为则亨，守正免灾、勿妄动。'},
 {name:'大畜',up:'艮',down:'乾',ci:'利贞。不家食吉。利涉大川。',du:'大畜德行，厚积薄发，宜远谋进取。'},
 {name:'颐',up:'艮',down:'震',ci:'贞吉。观颐，自求口实。',du:'颐养之道，谨言节食、自求口实则吉。'},
 {name:'大过',up:'兑',down:'巽',ci:'栋桡，利有攸往，亨。',du:'大过之时，宜独立不惧、行非常之举。'},
 {name:'坎',up:'坎',down:'坎',ci:'习坎，有孚，维心亨，行有尚。',du:'重重险陷，唯诚信持心可渡。'},
 {name:'离',up:'离',down:'离',ci:'利贞，亨。畜牝牛，吉。',du:'附丽光明，宜守正中、柔顺则吉。'},
 {name:'咸',up:'兑',down:'艮',ci:'亨，利贞，取女吉。',du:'感应相与，两性相悦，诚感则成。'},
 {name:'恒',up:'震',down:'巽',ci:'亨，无咎，利贞，利有攸往。',du:'恒久不息，宜守恒道、久则有成。'},
 {name:'遁',up:'乾',down:'艮',ci:'亨，小利贞。',du:'退避以全，时不当则隐，小者有利。'},
 {name:'大壮',up:'震',down:'乾',ci:'利贞。',du:'阳刚壮盛，宜守正勿恃壮、防亢极。'},
 {name:'晋',up:'离',down:'坤',ci:'康侯用锡马蕃庶，昼日三接。',du:'进而显达，仕途升进，光明在上。'},
 {name:'明夷',up:'坤',down:'离',ci:'利艰贞。',du:'明入地中，昏暗之时，宜韬光守艰。'},
 {name:'家人',up:'巽',down:'离',ci:'利女贞。',du:'齐家之道，内外各正，家齐而后兴。'},
 {name:'睽',up:'离',down:'兑',ci:'小事吉。',du:'乖离背反，宜求同存异、小事可成。'},
 {name:'蹇',up:'坎',down:'艮',ci:'利西南，不利东北。利见大人，贞吉。',du:'蹇难在前，宜止而思、就贤避险。'},
 {name:'解',up:'震',down:'坎',ci:'利西南。无所往，其来复吉。有攸往，夙吉。',du:'险难解散，宜舒缓从容、早复则吉。'},
 {name:'损',up:'艮',down:'兑',ci:'有孚，元吉，无咎，可贞，利有攸往。',du:'损下益上，节用修身，损中有得。'},
 {name:'益',up:'巽',down:'震',ci:'利有攸往，利涉大川。',du:'损上益下，与时偕行，进益可期。'},
 {name:'夬',up:'兑',down:'乾',ci:'扬于王庭，孚号有厉。告自邑，不利即戎，利有攸往。',du:'决而能和，刚断小人，慎防决之过。'},
 {name:'姤',up:'乾',down:'巽',ci:'女壮，勿用取女。',du:'不期而遇，阴长侵阳，宜防微杜渐。'},
 {name:'萃',up:'兑',down:'坤',ci:'亨。王假有庙，利见大人，亨，利贞。用大牲吉，利有攸往。',du:'聚而成萃，人心归附，宜会聚有主。'},
 {name:'升',up:'坤',down:'巽',ci:'元亨，用见大人，勿恤，南征吉。',du:'积小成大，柔进上升，前程渐开。'},
 {name:'困',up:'兑',down:'坎',ci:'亨，贞，大人吉，无咎。有言不信。',du:'困穷守正，处困以道，言多不信。'},
 {name:'井',up:'坎',down:'巽',ci:'改邑不改井，无丧无得，往来井井。',du:'井养不穷，养民有常，宜修德惠民。'},
 {name:'革',up:'兑',down:'离',ci:'巳日乃孚，元亨利贞，悔亡。',du:'顺天应人，破旧立新，变革乃成。'},
 {name:'鼎',up:'离',down:'巽',ci:'元吉，亨。',du:'鼎新取象，稳重养贤，烹饪得宜则吉。'},
 {name:'震',up:'震',down:'震',ci:'亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。',du:'震动警醒，临危不乱，惧则致福。'},
 {name:'艮',up:'艮',down:'艮',ci:'艮其背，不获其身，行其庭，不见其人，无咎。',du:'止而有节，宜止其所、动静有时。'},
 {name:'渐',up:'巽',down:'艮',ci:'女归吉，利贞。',du:'循序渐进，如女归嫁，稳步得宜则吉。'},
 {name:'归妹',up:'震',down:'兑',ci:'征凶，无攸利。',du:'归妹失正，妄动有凶，宜守分慎行。'},
 {name:'丰',up:'震',down:'离',ci:'亨，王假之，勿忧，宜日中。',du:'丰大盛满，盛极当忧，宜守中防缺。'},
 {name:'旅',up:'离',down:'艮',ci:'小亨，旅贞吉。',du:'行旅在外，宜柔顺谨慎、安分则吉。'},
 {name:'巽',up:'巽',down:'巽',ci:'小亨，利有攸往，利见大人。',du:'顺从申命，谦逊以入，小者亨通。'},
 {name:'兑',up:'兑',down:'兑',ci:'亨，利贞。',du:'和悦相说，宜以悦待人、守正则亨。'},
 {name:'涣',up:'巽',down:'坎',ci:'亨。王假有庙，利涉大川，利贞。',du:'涣散待聚，宜涣释其私、散而能聚。'},
 {name:'节',up:'坎',down:'兑',ci:'亨。苦节不可贞。',du:'节制有度，宜守中节、过苦则失。'},
 {name:'中孚',up:'巽',down:'兑',ci:'豚鱼吉，利涉大川，利贞。',du:'诚信在中，感格豚鱼，诚信则通。'},
 {name:'小过',up:'震',down:'艮',ci:'亨，利贞。可小事，不可大事。',du:'小者过越，宜行小事、守谦惧。'},
 {name:'既济',up:'坎',down:'离',ci:'亨，小利贞。初吉终乱。',du:'事已成济，宜谨守防变，初吉终宜慎。'},
 {name:'未济',up:'离',down:'坎',ci:'亨，小狐汔济，濡其尾，无攸利。',du:'事未竟成，宜慎终如始、戒急躁。'}
];
const HEX_MAP={};
HEX.forEach(h=>{ const bits=JING[h.down].concat(JING[h.up]); h.key=bits.join(''); h.wu=JING_WU[h.up]+'/'+JING_WU[h.down]; HEX_MAP[h.key]=h; });
/* 周易·彖传、大象传、乾坤文言（简体，取自维基文库《周易》通行本） */
const HEX_TUAN={
'乾':'大哉乾元，万物资始，乃统天。云行雨施，品物流形，大明终始，六位时成。时乘六龙以御天，乾道变化，各正性命，保合大和（一作太和），乃利贞。首出庶物，万国咸宁。',
'坤':'至哉坤元，万物资生，乃顺承天。坤厚载物，德合无疆；含弘光大，品物咸亨。牝马地类，行地无疆，柔顺利贞。君子攸行，先迷失道，后顺得常。西南得朋，乃与类行，东北丧朋，乃终有庆。安贞之吉，应地无疆。',
'屯':'屯，刚柔始交而难生，动乎险中，大亨贞。雷雨之动满盈，天造草昧，宜建侯而不宁。',
'蒙':'蒙，山下有险，险而止，蒙。蒙亨，以亨行，时中也。匪我求童蒙，童蒙求我，志应也。初筮告，以刚中也。再三渎，渎则不告，渎蒙也。蒙以养正，圣功也。',
'需':'需，须也，险在前也；刚健而不陷，其义不困穷矣。需，有孚，光亨，贞吉，位乎天位，以正中也。利涉大川，往有功也。',
'讼':'讼，上刚下险，险而健，讼。讼，有孚，窒，惕，中吉，刚来而得中也。终凶，讼不可成也。利见大人，尚中正也。不利涉大川，入于渊也。',
'师':'师，众也。贞，正也。能以众正，可以王矣。刚中而应，行险而顺，以此毒天下，而民从之，吉又何咎矣。',
'比':'比，吉也。比，辅也，下顺从也。原筮，元永贞，无咎，以刚中也。不宁方来，上下应也。后夫凶，其道穷也。',
'小畜':'小畜，柔得位而上下应之，曰小畜。健而巽，刚中而志行，乃亨。密云不雨，尚往也。自我西郊，施未行也。',
'履':'履，柔履刚也。说而应乎乾，是以履虎尾，不咥人，亨。刚中正，履帝位而不疚，光明也。',
'泰':'泰，小往大来，吉亨。则是天地交而万物通也，上下交而其志同也。内阳而外阴，内健而外顺，内君子而外小人，君子道长，小人道消也。',
'否':'否之匪人，不利君子贞，大往小来。则是天地不交而万物不通也，上下不交而天下无邦也。内阴而外阳，内柔而外刚，内小人而外君子，小人道长，君子道消也。',
'同人':'同人，柔得位得中，而应乎乾，曰同人。同人曰，同人于野，亨。利涉大川，乾行也。文明以健，中正而应，君子正也。唯君子为能通天下之志。',
'大有':'大有，柔得尊位，大中而上下应之，曰大有。其德刚健而文明，应乎天而时行，是以元亨。',
'谦':'谦，亨，天道下济而光明，地道卑而上行。天道亏盈而益谦，地道变盈而流谦，鬼神害盈而福谦，人道恶盈而好谦。谦尊而光，卑而不可逾，君子之终也。',
'豫':'豫，刚应而志行，顺以动，豫。豫，顺以动，故天地如之，而况建侯行师乎？天地以顺动，故日月不过，而四时不忒；圣人以顺动，则刑罚清而民服。豫之时义大矣哉！',
'随':'随，刚来而下柔，动而说，随。大亨贞，无咎，而天下随时，随之时义大矣哉！',
'蛊':'蛊，刚上而柔下，巽而止，蛊。蛊，元亨，而天下治也。利涉大川，往有事也。先甲三日，后甲三日，终则有始，天行也。',
'临':'临，刚浸而长。说而顺，刚中而应，大亨以正，天之道也。至于八月有凶，消不久也。',
'观':'大观在上，顺而巽，中正以观天下。观，盥而不荐，有孚颙若，下观而化也。观天之神道，而四时不忒，圣人以神道设教，而天下服矣。',
'噬嗑':'颐中有物，曰噬嗑，噬嗑而亨。刚柔分，动而明，雷电合而章。柔得中而上行，虽不当位，利用狱也。',
'贲':'贲，亨；柔来而文刚，故亨。分刚上而文柔，故小利有攸往。刚柔交错，天文也；文明以止，人文也。观乎天文，以察时变；观乎人文，以化成天下。',
'剥':'剥，剥也，柔变刚也。不利有攸往，小人长也。顺而止之，观象也。君子尚消息盈虚，天行也。',
'复':'复亨；刚反，动而以顺行，是以出入无疾，朋来无咎。反复其道，七日来复，天行也。利有攸往，刚长也。复其见天地之心乎？',
'无妄':'无妄，刚自外来，而为主于内。动而健，刚中而应，大亨以正，天之命也。其匪正有眚，不利有攸往。无妄之往，何之矣？天命不佑，行矣哉？',
'大畜':'大畜，刚健笃实辉光，日新其德，刚上而尚贤。能止健，大正也。不家食吉，养贤也。利涉大川，应乎天也。',
'颐':'颐贞吉，养正则吉也。观颐，观其所养也；自求口实，观其自养也。天地养万物，圣人养贤，以及万民；颐之时义大矣哉！',
'大过':'大过，大者过也。栋桡，本末弱也。刚过而中，巽而说行，利有攸往，乃亨。大过之时义大矣哉！',
'坎':'习坎，重险也。水流而不盈，行险而不失其信。维心亨，乃以刚中也。行有尚，往有功也。天险不可升也，地险山川丘陵也，王公设险以守其国，坎之时用大矣哉！',
'离':'离，丽也；日月丽乎天，百谷草木丽乎土，重明以丽乎正，乃化成天下。柔丽乎中正，故亨；是以畜牝牛吉也。',
'咸':'咸，感也。柔上而刚下，二气感应以相与，止而说，男下女，是以亨利贞，取女吉也。天地感而万物化生，圣人感人心而天下和平；观其所感，而天地万物之情可见矣！',
'恒':'恒，久也。刚上而柔下，雷风相与，巽而动，刚柔皆应，恒。恒亨无咎，利贞；久于其道也，天地之道，恒久而不已也。利有攸往，终则有始也。日月得天，而能久照，四时变化，而能久成，圣人久于其道，而天下化成；观其所恒，而天地万物之情可见矣！',
'遁':'遁亨，遁而亨也。刚当位而应，与时行也。小利贞，浸而长也。遁之时义大矣哉！',
'大壮':'大壮，大者壮也。刚以动，故壮。大壮利贞；大者正也。正大而天地之情可见矣！',
'晋':'晋，进也。明出地上，顺而丽乎大明，柔进而上行。是以康侯用锡马蕃庶，昼日三接也。',
'明夷':'明入地中，明夷。内文明而外柔顺，以蒙大难，文王以之。利艰贞，晦其明也，内难而能正其志，箕子以之。',
'家人':'家人，女正位乎内，男正位乎外，男女正，天地之大义也。家人有严君焉，父母之谓也。父父，子子，兄兄，弟弟，夫夫，妇妇，而家道正；正家而天下定矣。',
'睽':'睽，火动而上，泽动而下；二女同居，其志不同行；说而丽乎明，柔进而上行，得中而应乎刚；是以小事吉。天地睽，而其事同也；男女睽，而其志通也；万物睽，而其事类也；睽之时用大矣哉！',
'蹇':'蹇，难也，险在前也。见险而能止，知矣哉！蹇利西南，往得中也；不利东北，其道穷也。利见大人，往有功也。当位贞吉，以正邦也。蹇之时用大矣哉！',
'解':'解，险以动，动而免乎险，解。解利西南，往得众也。其来复吉，乃得中也。有攸往夙吉，往有功也。天地解，而雷雨作，雷雨作，而百果草木皆甲坼，解之时义大矣哉！',
'损':'损，损下益上，其道上行。损而有孚，元吉，无咎，可贞，利有攸往。曷之用？二簋可用享；二簋应有时。损刚益柔有时，损益盈虚，与时偕行。',
'益':'益，损上益下，民说无疆，自上下下，其道大光。利有攸往，中正有庆。利涉大川，木道乃行。益动而巽，日进无疆。天施地生，其益无方。凡益之道，与时偕行。',
'夬':'夬，决也，刚决柔也。健而说，决而和，扬于王庭，柔乘五刚也。孚号有厉，其危乃光也。告自邑，不利即戎，所尚乃穷也。利有攸往，刚长乃终也。',
'姤':'姤，遇也，柔遇刚也。勿用取女，不可与长也。天地相遇，品物咸章也。刚遇中正，天下大行也。姤之时义大矣哉！',
'萃':'萃，聚也；顺以说，刚中而应，故聚也。王假有庙，致孝享也。利见大人亨，聚以正也。用大牲吉，利有攸往，顺天命也。观其所聚，而天地万物之情可见矣。',
'升':'柔以时升，巽而顺，刚中而应，是以大亨。用见大人，勿恤；有庆也。南征吉，志行也。',
'困':'困，刚掩也。险以说，困而不失其所，亨；其唯君子乎？贞大人吉，以刚中也。有言不信，尚口乃穷也。',
'井':'巽乎水而上水，井；井养而不穷也。改邑不改井，乃以刚中也。汔至亦未繘井，未有功也。羸其瓶，是以凶也。',
'革':'革，水火相息，二女同居，其志不相得，曰革。巳日乃孚；革而信也。文明以说，大亨以正，革而当，其悔乃亡。天地革而四时成，汤武革命，顺乎天而应乎人，革之时义大矣哉！',
'鼎':'鼎，象也。以木巽火，亨饪也。圣人亨以享上帝，而大亨以养圣贤。巽而耳目聪明，柔进而上行，得中而应乎刚，是以元亨。',
'震':'震，亨。震来虩虩，恐致福也。笑言哑哑，后有则也。震惊百里，惊远而惧迩也。出可以守宗庙社稷，以为祭主也。',
'艮':'艮，止也。时止则止，时行则行，动静不失其时，其道光明。艮其止，止其所也。上下敌应，不相与也。是以不获其身，行其庭不见其人，无咎也。',
'渐':'渐之进也，女归吉也。进得位，往有功也。进以正，可以正邦也。其位刚，得中也。止而巽，动不穷也。',
'归妹':'归妹，天地之大义也。天地不交，而万物不兴，归妹人之终始也。说以动，所归妹也。征凶，位不当也。无攸利，柔乘刚也。',
'丰':'丰，大也。明以动，故丰。王假之，尚大也。勿忧宜日中，宜照天下也。日中则昃，月盈则食，天地盈虚，与时消息，而况于人乎？况于鬼神乎？',
'旅':'旅，小亨，柔得中乎外，而顺乎刚，止而丽乎明，是以小亨，旅贞吉也。旅之时义大矣哉！',
'巽':'重巽以申命，刚巽乎中正而志行。柔皆顺乎刚，是以小亨，利有攸往，利见大人。',
'兑':'兑，说也。刚中而柔外，说以利贞，是以顺乎天，而应乎人。说以先民，民忘其劳；说以犯难，民忘其死；说之大，民劝矣哉！',
'涣':'涣，亨。刚来而不穷，柔得位乎外而上同。王假有庙，王乃在中也。利涉大川，乘木有功也。',
'节':'节，亨，刚柔分，而刚得中。苦节不可贞，其道穷也。说以行险，当位以节，中正以通。天地节而四时成，节以制度，不伤财，不害民。',
'中孚':'中孚，柔在内而刚得中。说而巽，孚，乃化邦也。豚鱼吉，信及豚鱼也。利涉大川，乘木舟虚也。中孚以利贞，乃应乎天也。',
'小过':'小过，小者过而亨也。过以利贞，与时行也。柔得中，是以小事吉也。刚失位而不中，是以不可大事也。有飞鸟之象焉，有飞鸟遗之音，不宜上宜下，大吉；上逆而下顺也。',
'既济':'既济，亨，小者亨也。利贞，刚柔正而位当也。初吉，柔得中也。终止则乱，其道穷也。',
'未济':'未济，亨；柔得中也。小狐汔济，未出中也。濡其尾，无攸利；不续终也。虽不当位，刚柔应也。',
//__TUAN__
};
const HEX_DAXIANG={
'乾':'天行健，君子以自强不息。',
'坤':'地势坤，君子以厚德载物。',
'屯':'云雷，屯；君子以经纶。',
'蒙':'山下出泉，蒙；君子以果行育德。',
'需':'云上于天，需；君子以饮食宴乐。',
'讼':'天与水违行，讼；君子以作事谋始。',
'师':'地中有水，师；君子以容民畜众。',
'比':'地上有水，比；先王以建万国，亲诸侯。',
'小畜':'风行天上，小畜，君子以懿文德。',
'履':'上天下泽，履；君子以辨上下，定民志。',
'泰':'天地交，泰；后以财成天地之道，辅相天地之宜，以左右民。',
'否':'天地不交，否；君子以俭德辟难，不可荣以禄。',
'同人':'天与火，同人；君子以类族辨物。',
'大有':'火在天上，大有；君子以遏恶扬善，顺天休命。',
'谦':'地中有山，谦；君子以裒多益寡，称物平施。',
'豫':'雷出地奋，豫。先王以作乐崇德，殷荐之上帝，以配祖考。',
'随':'泽中有雷，随；君子以向晦入宴息。',
'蛊':'山下有风，蛊；君子以振民育德。',
'临':'泽上有地，临；君子以教思无穷，容保民无疆。',
'观':'风行地上，观；先王以省方，观民设教。',
'噬嗑':'雷电噬嗑；先王以明罚敕法。',
'贲':'山下有火，贲；君子以明庶政，无敢折狱。',
'剥':'山附地上，剥；上以厚下，安宅。',
'复':'雷在地中，复；先王以至日闭关，商旅不行，后不省方。',
'无妄':'天下雷行，物与无妄；先王以茂对时，育万物。',
'大畜':'天在山中，大畜；君子以多识前言往行，以畜其德。',
'颐':'山下有雷，颐；君子以慎言语，节饮食。',
'大过':'泽灭木，大过。君子以独立不惧，遯世无闷。',
'坎':'水洊至，习坎；君子以常德行，习教事。',
'离':'明两作离，大人以继明照于四方。',
'咸':'山上有泽，咸；君子以虚受人。',
'恒':'雷风，恒；君子以立不易方。',
'遁':'天下有山，遁；君子以远小人，不恶而严。',
'大壮':'雷在天上，大壮；君子以非礼弗履。',
'晋':'明出地上，晋；君子以自昭明德。',
'明夷':'明入地中，明夷；君子以莅众，用晦而明。',
'家人':'风自火出，家人；君子以言有物，而行有恒。',
'睽':'上火下泽，睽；君子以同而异。',
'蹇':'山上有水，蹇；君子以反身修德。',
'解':'雷雨作，解；君子以赦过宥罪。',
'损':'山下有泽，损；君子以惩忿窒欲。',
'益':'风雷，益；君子以见善则迁，有过则改。',
'夬':'泽上于天，夬；君子以施禄及下，居德则忌。',
'姤':'天下有风，姤；后以施命诰四方。',
'萃':'泽上于地，萃；君子以除戎器，戒不虞。',
'升':'地中生木，升；君子以顺德，积小以高大。',
'困':'泽无水，困；君子以致命遂志。',
'井':'木上有水，井；君子以劳民劝相。',
'革':'泽中有火，革；君子以治历明时。',
'鼎':'木上有火，鼎；君子以正位凝命。',
'震':'洊雷，震；君子以恐惧修省。',
'艮':'兼山，艮；君子以思不出其位。',
'渐':'山上有木，渐；君子以居贤德，善俗。',
'归妹':'泽上有雷，归妹；君子以永终知敝。',
'丰':'雷电皆至，丰；君子以折狱致刑。',
'旅':'山上有火，旅；君子以明慎用刑，而不留狱。',
'巽':'随风，巽；君子以申命行事。',
'兑':'丽泽，兑；君子以朋友讲习。',
'涣':'风行水上，涣；先王以享于帝立庙。',
'节':'泽上有水，节；君子以制数度，议德行。',
'中孚':'泽上有风，中孚；君子以议狱缓死。',
'小过':'山上有雷，小过；君子以行过乎恭，丧过乎哀，用过乎俭。',
'既济':'水在火上，既济；君子以思患而豫防之。',
'未济':'火在水上，未济；君子以慎辨物居方。',
//__DAXIANG__
};
const HEX_WENYAN={
'乾':'元者，善之长也。亨者，嘉之会也。利者，义之和也。贞者，事之干也。君子体仁足以长人，嘉会足以合礼，利物足以和义，贞固足以干事。君子行此四德者，故曰：「乾，元、亨、利、贞。」初九曰：「潜龙，勿用。」何谓也？子曰：「龙德而隐者也。不易乎世，不成乎名，遯世无闷，不见是而无闷，乐则行之，忧则违之，确乎其不可拔，潜龙也。」九二曰：「见龙在田，利见大人。」何谓也？子曰：「龙德而正中者也。庸言之信，庸行之谨；闲邪存其诚，善世而不伐，德博而化。易曰：『见龙在田，利见大人。』君德也。」九三曰：「君子终日乾乾，夕惕若，厉，无咎。」何谓也？子曰：「君子进德修业。忠信，所以进德也；修辞立其诚，所以居业也。知至至之，可与言几也。知终终之，可与存义也。是故居上位而不骄，在下位而不忧，故乾乾因其时而惕，虽危无咎矣。」九四曰：「或跃在渊，无咎。」何谓也？子曰：「上下无常，非为邪也。进退无恒，非离群也。君子进德修业，欲及时也。故无咎。」九五曰：「飞龙在天，利见大人。」何谓也？子曰：「同声相应，同气相求；水流湿，火就燥，云从龙，风从虎；圣人作而万物睹；本乎天者亲上，本乎地者亲下，则各从其类也。」上九曰：「亢龙，有悔。」何谓也？子曰：「贵而无位，高而无民，贤人在下位而无辅，是以动而有悔也。」「潜龙勿用」，下也。「见龙在田」，时舍也。「终日乾乾」，行事也。「或跃在渊」，自试也。「飞龙在天」，上治也。「亢龙有悔」，穷之灾也。「乾元用九」，天下治也。「潜龙勿用」，阳气潜藏。「见龙在田」，天下文明。「终日乾乾」，与时偕行。「或跃在渊」，乾道乃革。「飞龙在天」，乃位乎天德。「亢龙有悔」，与时偕极。「乾元用九」，乃见天则。乾元者，始而亨者也。利贞者，性情也。乾始能以美利利天下，不言所利，大矣哉！大哉乾元，刚健中正，纯粹精也。六爻发挥，旁通情也。时乘六龙，以御天也。云行雨施，天下平也。君子以成德为行，日可见之行也。潜之为言也，隐而未见，行而未成，是以君子弗用也。君子学以聚之，问以辩之，宽以居之，仁以行之，易曰：「见龙在田，利见大人。」君德也。九三，重刚而不中，上不在天，下不在田；故乾乾因其时而惕，虽危，无咎矣。九四，重刚而不中，上不在天，下不在田，中不在人，故或之。或之者，疑之也，故无咎。夫大人者，与天地合其德，与日月合其明，与四时合其序，与鬼神合其吉凶；先天而天弗违，后天而奉天时，天且弗违，而况于人乎？况于鬼神乎？亢之为言也，知进而不知退，知存而不知亡，知得而不知丧；其唯圣人乎？知进退存亡而不失其正者，其唯圣人乎！',
'坤':'坤至柔而动也刚，至静而德方。后得主而有常，含万物而化光。坤道其顺乎！承天而时行。积善之家，必有余庆；积不善之家，必有余殃。臣弑其君，子弑其父，非一朝一夕之故，其所由来者渐矣。由辨之不早辨也。易曰：「履霜，坚冰至。」盖言顺也。直其正也，方其义也。君子敬以直内，义以方外，敬义立而德不孤。「直方大，不习无不利。」则不疑其所行也。阴虽有美，含之。以从王事，弗敢成也。地道也，妻道也，臣道也。地道无成，而代有终也。天地变化，草木蕃；天地闭，贤人隐。易曰：「括囊，无咎，无誉。」盖言谨也。君子黄中通理，正位居体，美在其中，而畅于四支，发于事业，美之至也。阴疑于阳必战，为其嫌于无阳也，故称龙焉。犹未离其类也，故称血焉。夫玄黄者，天地之杂也。天玄而地黄。',
//__WENYAN__
};
/* 六十四卦爻辞（简体，取自《周易》本经；yao 初→上六条，yong 为乾/坤用九用六） */
const HEX_YAO={
乾:['初九：潜龙勿用。','九二：见龙在田，利见大人。','九三：君子终日乾乾，夕惕若；厉，无咎。','九四：或跃在渊，无咎。','九五：飞龙在天，利见大人。','上九：亢龙，有悔。'],
坤:['初六：履霜，坚冰至。','六二：直方大，不习无不利。','六三：含章，可贞。或从王事，无成有终。','六四：括囊，无咎无誉。','六五：黄裳，元吉。','上六：龙战于野，其血玄黄。'],
屯:['初九：磐桓，利居贞，利建侯。','六二：屯如邅如，乘马班如，匪寇婚媾，女子贞不字，十年乃字。','六三：即鹿无虞，惟入于林中，君子几不如舍，往吝。','六四：乘马班如，求婚媾，往，吉无不利。','九五：屯其膏；小贞吉，大贞凶。','上六：乘马班如，泣血涟如。'],
蒙:['初六：发蒙，利用刑人，用说桎梏，以往吝。','九二：包蒙吉，纳妇吉，子克家。','六三：勿用取女，见金夫，不有躬，无攸利。','六四：困蒙，吝。','六五：童蒙，吉。','上九：击蒙，不利为寇，利御寇。'],
需:['初九：需于郊，利用恒，无咎。','九二：需于沙，小有言，终吉。','九三：需于泥，致寇至。','六四：需于血，出自穴。','九五：需于酒食，贞吉。','上六：入于穴，有不速之客三人来，敬之终吉。'],
讼:['初六：不永所事，小有言，终吉。','九二：不克讼，归而逋，其邑人三百户无眚。','六三：食旧德，贞厉，终吉。或从王事，无成。','九四：不克讼，复即命渝，安贞吉。','九五：讼，元吉。','上九：或锡之鞶带，终朝三褫之。'],
师:['初六：师出以律，否臧，凶。','九二：在师中吉，无咎；王三锡命。','六三：师或舆尸，凶。','六四：师左次，无咎。','六五：田有禽，利执言，无咎。长子帅师，弟子舆尸，贞凶。','上六：大君有命，开国承家，小人勿用。'],
比:['初六：有孚，比之，无咎。有孚盈缶，终来有它，吉。','六二：比之自内，贞吉。','六三：比之匪人。','六四：外比之，贞吉。','九五：显比。王用三驱，失前禽，邑人不诫，吉。','上六：比之无首，凶。'],
小畜:['初九：复自道，何其咎，吉。','九二：牵复，吉。','九三：舆说辐，夫妻反目。','六四：有孚，血去惕出，无咎。','九五：有孚挛如，富以其邻。','上九：既雨既处，尚德载，妇贞厉，月几望，君子征凶。'],
履:['初九：素履，往无咎。','九二：履道坦坦，幽人贞吉。','六三：眇能视，跛能履，履虎尾，咥人，凶。武人为于大君。','九四：履虎尾，愬愬终吉。','九五：夬履，贞厉。','上九：视履考祥，其旋元吉。'],
泰:['初九：拔茅茹以其汇，征吉。','九二：包荒。用冯河，不遐遗；朋亡。得尚于中行。','九三：无平不陂，无往不复，艰贞无咎。勿恤其孚，于食有福。','六四：翩翩，不富以其邻；不戒以孚。','六五：帝乙归妹，以祉，元吉。','上六：城复于隍，勿用师，自邑告命，贞吝。'],
否:['初六：拔茅茹以其汇，贞吉。亨。','六二：包承，小人吉，大人否。亨。','六三：包羞。','九四：有命，无咎，畴离祉。','九五：休否，大人吉。其亡其亡，系于苞桑。','上六：倾否，先否后喜。'],
同人:['初九：同人于门，无咎。','六二：同人于宗，吝。','九三：伏戎于莽，升其高陵，三岁不兴。','九四：乘其墉，弗克，攻吉。','九五：同人，先号咷而后笑。大师克相遇。','上九：同人于郊，无悔。'],
大有:['初九：无交害，匪咎，艰则无咎。','九二：大车以载，有攸往，无咎。','九三：公用亨于天子，小人弗克。','九四：匪其彭，无咎。','六五：厥孚交如，威如；吉。','上九：自天佑之，吉无不利。'],
谦:['初六：谦谦君子，用涉大川，吉。','六二：鸣谦，贞吉。','九三：劳谦君子，有终吉。','六四：无不利，撝谦。','六五：不富，以其邻，利用侵伐，无不利。','上六：鸣谦，利用行师，征邑国。'],
豫:['初六：鸣豫，凶。','六二：介于石，不终日，贞吉。','六三：盱豫，悔。迟有悔。','九四：由豫，大有得。勿疑。朋盍簪。','六五：贞疾，恒不死。','上六：冥豫，成有渝，无咎。'],
随:['初九：官有渝，贞吉。出门交有功。','六二：系小子，失丈夫。','六三：系丈夫，失小子。随，有求得利，居贞。','九四：随有获，贞凶。有孚在道，以明，何咎。','九五：孚于嘉，吉。','上六：拘系之，乃从维之。王用亨于西山。'],
蛊:['初六：干父之蛊，有子考，无咎，厉终吉。','九二：干母之蛊，不可贞。','九三：干父之蛊，小有悔，无大咎。','六四：裕父之蛊，往见吝。','六五：干父之蛊，用誉。','上九：不事王侯，高尚其事。'],
临:['初九：咸临，贞吉。','九二：咸临，吉无不利。','六三：甘临，无攸利。既忧之，无咎。','六四：至临，无咎。','六五：知临，大君之宜，吉。','上六：敦临，吉无咎。'],
观:['初六：童观，小人无咎，君子吝。','六二：窥观，利女贞。','六三：观我生，进退。','六四：观国之光，利用宾于王。','九五：观我生，君子无咎。','上九：观其生，君子无咎。'],
噬嗑:['初九：屦校灭趾，无咎。','六二：噬肤灭鼻，无咎。','六三：噬腊肉，遇毒；小吝，无咎。','九四：噬乾胏，得金矢，利艰贞，吉。','六五：噬乾肉，得黄金，贞厉，无咎。','上九：何校灭耳，凶。'],
贲:['初九：贲其趾，舍车而徒。','六二：贲其须。','九三：贲如濡如，永贞吉。','六四：贲如皤如，白马翰如，匪寇婚媾。','六五：贲于丘园，束帛戋戋，吝，终吉。','上九：白贲，无咎。'],
剥:['初六：剥床以足，蔑贞凶。','六二：剥床以辨，蔑贞凶。','六三：剥之，无咎。','六四：剥床以肤，凶。','六五：贯鱼，以宫人宠，无不利。','上九：硕果不食，君子得舆，小人剥庐。'],
复:['初九：不远复，无祇悔，元吉。','六二：休复，吉。','六三：频复，厉无咎。','六四：中行独复。','六五：敦复，无悔。','上六：迷复，凶，有灾眚。用行师，终有大败，以其国君，凶；至于十年，不克征。'],
无妄:['初九：无妄，往吉。','六二：不耕获，不菑畬，则利有攸往。','六三：无妄之灾，或系之牛，行人之得，邑人之灾。','九四：可贞，无咎。','九五：无妄之疾，勿药有喜。','上九：无妄，行有眚，无攸利。'],
大畜:['初九：有厉利已。','九二：舆说輹。','九三：良马逐，利艰贞。曰闲舆卫，利有攸往。','六四：童牛之牿，元吉。','六五：豶豕之牙，吉。','上九：何天之衢，亨。'],
颐:['初九：舍尔灵龟，观我朵颐，凶。','六二：颠颐，拂经，于丘颐，征凶。','六三：拂颐，贞凶，十年勿用，无攸利。','六四：颠颐吉，虎视眈眈，其欲逐逐，无咎。','六五：拂经，居贞吉，不可涉大川。','上九：由颐，厉吉，利涉大川。'],
大过:['初六：藉用白茅，无咎。','九二：枯杨生稊，老夫得其女妻，无不利。','九三：栋桡，凶。','九四：栋隆，吉。有它吝。','九五：枯杨生华，老妇得其士夫，无咎无誉。','上六：过涉灭顶，凶，无咎。'],
坎:['初六：习坎，入于坎窞，凶。','九二：坎有险，求小得。','六三：来之坎坎，险且枕，入于坎窞，勿用。','六四：樽酒簋贰，用缶，纳约自牖，终无咎。','九五：坎不盈，祗既平，无咎。','上六：系用徽纆，寘于丛棘，三岁不得，凶。'],
离:['初九：履错然，敬之无咎。','六二：黄离，元吉。','九三：日昃之离，不鼓缶而歌，则大耋之嗟，凶。','九四：突如其来如，焚如，死如，弃如。','六五：出涕沱若，戚嗟若，吉。','上九：王用出征，有嘉折首，获匪其丑，无咎。'],
咸:['初六：咸其拇。','六二：咸其腓，凶，居吉。','九三：咸其股，执其随，往吝。','九四：贞吉悔亡，憧憧往来，朋从尔思。','九五：咸其脢，无悔。','上六：咸其辅，颊，舌。'],
恒:['初六：浚恒，贞凶，无攸利。','九二：悔亡。','九三：不恒其德，或承之羞，贞吝。','九四：田无禽。','六五：恒其德，贞，妇人吉，夫子凶。','上六：振恒，凶。'],
遁:['初六：遯尾，厉，勿用有攸往。','六二：执之用黄牛之革，莫之胜说。','九三：系遯，有疾厉，畜臣妾吉。','九四：好遯君子吉，小人否。','九五：嘉遯，贞吉。','上九：肥遯，无不利。'],
大壮:['初九：壮于趾，征凶，有孚。','九二：贞吉。','九三：小人用壮，君子用罔，贞厉。羝羊触藩，羸其角。','九四：贞吉悔亡，藩决不羸，壮于大舆之輹。','六五：丧羊于易，无悔。','上六：羝羊触藩，不能退，不能遂，无攸利，艰则吉。'],
晋:['初六：晋如，摧如，贞吉。罔孚，裕无咎。','六二：晋如，愁如，贞吉。受兹介福，于其王母。','六三：众允，悔亡。','九四：晋如鼫鼠，贞厉。','六五：悔亡，失得勿恤，往吉无不利。','上九：晋其角，维用伐邑，厉吉无咎，贞吝。'],
明夷:['初九：明夷于飞，垂其翼。君子于行，三日不食，有攸往，主人有言。','六二：明夷，夷于左股，用拯马壮，吉。','九三：明夷于南狩，得其大首，不可疾贞。','六四：入于左腹，获明夷之心，于出门庭。','六五：箕子之明夷，利贞。','上六：不明晦，初登于天，后入于地。'],
家人:['初九：闲有家，悔亡。','六二：无攸遂，在中馈，贞吉。','九三：家人嗃嗃，悔厉吉；妇子嘻嘻，终吝。','六四：富家，大吉。','九五：王假有家，勿恤。吉。','上九：有孚威如，终吉。'],
睽:['初九：悔亡，丧马勿逐，自复；见恶人无咎。','九二：遇主于巷，无咎。','六三：见舆曳，其牛掣，其人天且劓，无初有终。','九四：睽孤，遇元夫，交孚，厉无咎。','六五：悔亡，厥宗噬肤，往何咎。','上九：睽孤，见豕负涂，载鬼一车，先张之弧，后说之弧，匪寇婚媾，往遇雨则吉。'],
蹇:['初六：往蹇，来誉。','六二：王臣蹇蹇，匪躬之故。','九三：往蹇来反。','六四：往蹇来连。','九五：大蹇朋来。','上六：往蹇来硕，吉；利见大人。'],
解:['初六：无咎。','九二：田获三狐，得黄矢，贞吉。','六三：负且乘，致寇至，贞吝。','九四：解而拇，朋至斯孚。','六五：君子维有解，吉；有孚于小人。','上六：公用射隼，于高墉之上，获之，无不利。'],
损:['初九：已事遄往，无咎，酌损之。','九二：利贞，征凶，弗损益之。','六三：三人行，则损一人；一人行，则得其友。','六四：损其疾，使遄有喜，无咎。','六五：或益之，十朋之龟弗克违，元吉。','上九：弗损益之，无咎，贞吉，利有攸往，得臣无家。'],
益:['初九：利用为大作，元吉，无咎。','六二：或益之，十朋之龟弗克违，永贞吉。王用享于帝，吉。','六三：益之用凶事，无咎。有孚中行，告公用圭。','六四：中行，告公从。利用为依迁国。','九五：有孚惠心，勿问元吉。有孚惠我德。','上九：莫益之，或击之，立心勿恒，凶。'],
夬:['初九：壮于前趾，往不胜为咎。','九二：惕号，莫夜有戎，勿恤。','九三：壮于頄，有凶。君子夬夬，独行遇雨，若濡有愠，无咎。','九四：臀无肤，其行次且。牵羊悔亡，闻言不信。','九五：苋陆夬夬，中行无咎。','上六：无号，终有凶。'],
姤:['初六：系于金柅，贞吉，有攸往，见凶，羸豕孚踟躅。','九二：包有鱼，无咎，不利宾。','九三：臀无肤，其行次且，厉，无大咎。','九四：包无鱼，起凶。','九五：以杞包瓜，含章，有陨自天。','上九：姤其角，吝，无咎。'],
萃:['初六：有孚不终，乃乱乃萃，若号一握为笑，勿恤，往无咎。','六二：引吉，无咎，孚乃利用禴。','六三：萃如，嗟如，无攸利，往无咎，小吝。','九四：大吉，无咎。','九五：萃有位，无咎。匪孚，元永贞，悔亡。','上六：赍咨涕洟，无咎。'],
升:['初六：允升，大吉。','九二：孚乃利用禴，无咎。','九三：升虚邑。','六四：王用亨于岐山，吉无咎。','六五：贞吉，升阶。','上六：冥升，利于不息之贞。'],
困:['初六：臀困于株木，入于幽谷，三岁不觌。','九二：困于酒食，朱绂方来，利用亨祀，征凶，无咎。','六三：困于石，据于蒺藜，入于其宫，不见其妻，凶。','九四：来徐徐，困于金车，吝，有终。','九五：劓刖，困于赤绂，乃徐有说，利用祭祀。','上六：困于葛藟，于臲卼，曰动悔。有悔，征吉。'],
井:['初六：井泥不食，旧井无禽。','九二：井谷射鲋，瓮敝漏。','九三：井渫不食，为我心恻，可用汲，王明，并受其福。','六四：井甃，无咎。','九五：井冽，寒泉食。','上六：井收勿幕，有孚元吉。'],
革:['初九：巩用黄牛之革。','六二：巳日乃革之，征吉，无咎。','九三：征凶，贞厉，革言三就，有孚。','九四：悔亡，有孚改命，吉。','九五：大人虎变，未占有孚。','上六：君子豹变，小人革面，征凶，居贞吉。'],
鼎:['初六：鼎颠趾，利出否，得妾以其子，无咎。','九二：鼎有实，我仇有疾，不我能即，吉。','九三：鼎耳革，其行塞，雉膏不食，方雨亏悔，终吉。','九四：鼎折足，覆公餗，其形渥，凶。','六五：鼎黄耳金铉，利贞。','上九：鼎玉铉，大吉，无不利。'],
震:['初九：震来虩虩，后笑言哑哑，吉。','六二：震来厉，亿丧贝，跻于九陵，勿逐，七日得。','六三：震苏苏，震行无眚。','九四：震遂泥。','六五：震往来厉，亿无丧，有事。','上六：震索索，视矍矍，征凶。震不于其躬，于其邻，无咎。婚媾有言。'],
艮:['初六：艮其趾，无咎，利永贞。','六二：艮其腓，不拯其随，其心不快。','九三：艮其限，列其夤，厉薰心。','六四：艮其身，无咎。','六五：艮其辅，言有序，悔亡。','上九：敦艮，吉。'],
渐:['初六：鸿渐于干，小子厉，有言，无咎。','六二：鸿渐于磐，饮食衎衎，吉。','九三：鸿渐于陆，夫征不复，妇孕不育，凶；利御寇。','六四：鸿渐于木，或得其桷，无咎。','九五：鸿渐于陵，妇三岁不孕，终莫之胜，吉。','上九：鸿渐于陆，其羽可用为仪，吉。'],
归妹:['初九：归妹以娣，跛能履，征吉。','九二：眇能视，利幽人之贞。','六三：归妹以须，反归以娣。','九四：归妹愆期，迟归有时。','六五：帝乙归妹，其君之袂，不如其娣之袂良，月几望，吉。','上六：女承筐无实，士刲羊无血，无攸利。'],
丰:['初九：遇其配主，虽旬无咎，往有尚。','六二：丰其蔀，日中见斗，往得疑疾，有孚发若，吉。','九三：丰其沛，日中见沫，折其右肱，无咎。','九四：丰其蔀，日中见斗，遇其夷主，吉。','六五：来章，有庆誉，吉。','上六：丰其屋，蔀其家，窥其户，阒其无人，三岁不觌，凶。'],
旅:['初六：旅琐琐，斯其所取灾。','六二：旅即次，怀其资，得童仆贞。','九三：旅焚其次，丧其童仆，贞厉。','九四：旅于处，得其资斧，我心不快。','六五：射雉一矢亡，终以誉命。','上九：鸟焚其巢，旅人先笑后号咷。丧牛于易，凶。'],
巽:['初六：进退，利武人之贞。','九二：巽在床下，用史巫纷若，吉无咎。','九三：频巽，吝。','六四：悔亡，田获三品。','九五：贞吉悔亡，无不利。无初有终，先庚三日，后庚三日，吉。','上九：巽在床下，丧其资斧，贞凶。'],
兑:['初九：和兑，吉。','九二：孚兑，吉，悔亡。','六三：来兑，凶。','九四：商兑，未宁，介疾有喜。','九五：孚于剥，有厉。','上九：引兑。'],
涣:['初六：用拯马壮，吉。','九二：涣奔其机，悔亡。','六三：涣其躬，无悔。','六四：涣其群，元吉。涣有丘，匪夷所思。','九五：涣汗其大号，涣王居，无咎。','上九：涣其血，去逖出，无咎。'],
节:['初九：不出户庭，无咎。','九二：不出门庭，凶。','六三：不节若，则嗟若，无咎。','六四：安节，亨。','九五：甘节，吉；往有尚。','上六：苦节，贞凶，悔亡。'],
中孚:['初九：虞吉，有他不燕。','九二：鸣鹤在阴，其子和之，我有好爵，吾与尔靡之。','六三：得敌，或鼓或罢，或泣或歌。','六四：月几望，马匹亡，无咎。','九五：有孚挛如，无咎。','上九：翰音登于天，贞凶。'],
小过:['初六：飞鸟以凶。','六二：过其祖，遇其妣；不及其君，遇其臣；无咎。','九三：弗过防之，从或戕之，凶。','九四：无咎，弗过遇之。往厉必戒，勿用永贞。','六五：密云不雨，自我西郊，公弋取彼在穴。','上六：弗遇过之，飞鸟离之，凶，是谓灾眚。'],
既济:['初九：曳其轮，濡其尾，无咎。','六二：妇丧其茀，勿逐，七日得。','九三：高宗伐鬼方，三年克之，小人勿用。','六四：繻有衣袽，终日戒。','九五：东邻杀牛，不如西邻之禴祭，实受其福。','上六：濡其首，厉。'],
未济:['初六：濡其尾，吝。','九二：曳其轮，贞吉。','六三：未济，征凶，利涉大川。','九四：贞吉，悔亡，震用伐鬼方，三年有赏于大国。','六五：贞吉，无悔，君子之光，有孚，吉。','上九：有孚于饮酒，无咎，濡其首，有孚失是。']
};
const HEX_YONG={乾:'见群龙无首，吉。',坤:'利永贞。'};
/* 周易·小象传（64卦，每卦爻位初→上各一条；简体，通行本）——补全易传四件套之「小象」 */
const HEX_XIAOXIANG={
乾:['潜龙勿用，阳在下也。','见龙在田，德施普也。','终日乾乾，反复道也。','或跃在渊，进无咎也。','飞龙在天，大人造也。','亢龙有悔，盈不可久也。'],
坤:['履霜坚冰，阴始凝也。驯致其道，至坚冰也。','六二之动，直以方也。不习无不利，地道光也。','含章可贞，以时发也。或从王事，知光大也。','括囊无咎，慎不害也。','黄裳元吉，文在中也。','龙战于野，其道穷也。'],
屯:['虽磐桓，志行正也。以贵下贱，大得民也。','六二之难，乘刚也。十年乃字，反常也。','即鹿无虞，以从禽也。君子舍之，往吝穷也。','求而往，明也。','屯其膏，施未光也。','泣血涟如，何可长也。'],
蒙:['利用刑人，以正法也。','子克家，刚柔接也。','勿用取女，行不顺也。','困蒙之吝，独远实也。','童蒙之吉，顺以巽也。','利用御寇，上下顺也。'],
需:['需于郊，不犯难行也。利用恒无咎，未失常也。','需于沙，衍在中也。虽小有言，以终吉也。','需于泥，灾在外也。自我致寇，敬慎不败也。','需于血，顺以听也。','酒食贞吉，以中正也。','不速之客来，敬之终吉。虽不当位，未大失也。'],
讼:['不永所事，讼不可长也。虽小有言，其辩明也。','不克讼，归逋窜也。自下讼上，患至掇也。','食旧德，从上吉也。','复即命渝，安贞不失也。','讼元吉，以中正也。','以讼受服，亦不足敬也。'],
师:['师出以律，失律凶也。','在师中吉，承天宠也。王三锡命，怀万邦也。','师或舆尸，大无功也。','左次无咎，未失常也。','长子帅师，以中行也。弟子舆尸，使不当也。','大君有命，以正功也。小人勿用，必乱邦也。'],
比:['比之初六，有他吉也。','比之自内，不自失也。','比之匪人，不亦伤乎？','外比于贤，以从上也。','显比之吉，位正中也。舍逆取顺，失前禽也。邑人不诫，上使中也。','比之无首，无所终也。'],
小畜:['复自道，其义吉也。','牵复在中，亦不自失也。','夫妻反目，不能正室也。','有孚惕出，上合志也。','有孚挛如，不独富也。','既雨既处，德积载也。君子征凶，有所疑也。'],
履:['素履之往，独行愿也。','幽人贞吉，中不自乱也。','眇能视，不足以有明也。跛能履，不足以与行也。咥人之凶，位不当也。武人为于大君，志刚也。','愬愬终吉，志行也。','夬履贞厉，位正当也。','元吉在上，大有庆也。'],
泰:['拔茅征吉，志在外也。','包荒得尚于中行，以光大也。','无往不复，天地际也。','翩翩不富，皆失实也。不戒以孚，中心愿也。','以祉元吉，中以行愿也。','城复于隍，其命乱也。'],
否:['拔茅贞吉，志在君也。','大人否亨，不乱群也。','包羞，位不当也。','有命无咎，志行也。','大人之吉，位正当也。','否终则倾，何可长也。'],
同人:['出门同人，又谁咎也。','同人于宗，吝道也。','伏戎于莽，敌刚也。三岁不兴，安行也。','乘其墉，义弗克也。其吉，则困而反则也。','同人之先，以中直也。大师相遇，言相克也。','同人于郊，志未得也。'],
大有:['大有初九，无交害也。','大车以载，积中不败也。','公用亨于天子，小人害也。','匪其彭无咎，明辨晳也。','厥孚交如，信以发志也。威如之吉，易而无备也。','大有上吉，自天佑也。'],
谦:['谦谦君子，卑以自牧也。','鸣谦贞吉，中心得也。','劳谦君子，万民服也。','无不利撝谦，不违则也。','利用侵伐，征不服也。','鸣谦，志未得也。可用行师，征邑国也。'],
豫:['初六鸣豫，志穷凶也。','不终日贞吉，以中正也。','盱豫有悔，位不当也。','由豫大有得，志大行也。','六五贞疾，乘刚也。恒不死，中未亡也。','冥豫在上，何可长也。'],
随:['官有渝，从正吉也。出门交有功，不失也。','系小子，弗兼与也。','系丈夫，志舍下也。','随有获，其义凶也。有孚在道，明功也。','孚于嘉吉，位正中也。','拘系之，上穷也。'],
蛊:['干父之蛊，意承考也。','干母之蛊，得中道也。','干父之蛊，终无咎也。','裕父之蛊，往未得也。','干父用誉，承以德也。','不事王侯，志可则也。'],
临:['咸临贞吉，志行正也。','咸临吉无不利，未顺命也。','甘临，位不当也。既忧之，咎不长也。','至临无咎，位当也。','大君之宜，行中之谓也。','敦临之吉，志在内也。'],
观:['初六童观，小人道也。','窥观女贞，亦可丑也。','观我生进退，未失道也。','观国之光，尚宾也。','观我生，观民也。','观其生，志未平也。'],
噬嗑:['屦校灭趾，不行也。','噬肤灭鼻，乘刚也。','遇毒，位不当也。','利艰贞吉，未光也。','贞厉无咎，得当也。','何校灭耳，聪不明也。'],
贲:['舍车而徒，义弗乘也。','贲其须，与上兴也。','永贞之吉，终莫之陵也。','六四当位，疑也。匪寇婚媾，终无尤也。','六五之吉，有喜也。','白贲无咎，上得志也。'],
剥:['剥床以足，以灭下也。','剥床以辨，未有与也。','剥之无咎，失上下也。','剥床以肤，切近灾也。','以宫人宠，终无尤也。','君子得舆，民所载也。小人剥庐，终不可用也。'],
复:['不远之复，以修身也。','休复之吉，以下仁也。','频复之厉，义无咎也。','中行独复，以从道也。','敦复无悔，中以自考也。','迷复之凶，反君道也。'],
无妄:['无妄之往，得志也。','不耕获，未富也。','行人得牛，邑人灾也。','可贞无咎，固有之也。','无妄之药，不可试也。','无妄之行，穷之灾也。'],
大畜:['有厉利已，不犯灾也。','舆说輹，中无尤也。','利有攸往，上合志也。','六四元吉，有喜也。','六五之吉，有庆也。','何天之衢，道大行也。'],
颐:['观我朵颐，亦不足贵也。','六二征凶，行失类也。','十年勿用，道大悖也。','颠颐之吉，上施光也。','居贞之吉，顺以从上也。','由颐厉吉，大有庆也。'],
大过:['藉用白茅，柔在下也。','老夫女妻，过以相与也。','栋桡之凶，不可以有辅也。','栋隆之吉，不桡乎下也。','枯杨生华，何可久也。老妇士夫，亦可丑也。','过涉之凶，不可咎也。'],
坎:['习坎入坎，失道凶也。','求小得，未出中也。','来之坎坎，终无功也。','樽酒簋贰，刚柔际也。','坎不盈，中未大也。','上六失道，凶三岁也。'],
离:['履错之敬，以辟咎也。','黄离元吉，得中道也。','日昃之离，何可久也。','突如其来如，无所容也。','六五之吉，离王公也。','王用出征，以正邦也。'],
咸:['咸其拇，志在外也。','虽凶居吉，顺不害也。','咸其股，亦不处也。志在随人，所执下也。','贞吉悔亡，未感害也。憧憧往来，未光大也。','咸其脢，志末也。','咸其辅颊舌，滕口说也。'],
恒:['浚恒之凶，始求深也。','九二悔亡，能久中也。','不恒其德，无所容也。','久非其位，安得禽也。','妇人贞吉，从一而终也。夫子制义，从妇凶也。','振恒在上，大无功也。'],
遁:['遁尾之厉，不往何灾也。','执用黄牛，固志也。','系遁之厉，有疾惫也。畜臣妾吉，不可大事也。','君子好遁，小人否也。','嘉遁贞吉，以正志也。','肥遁无不利，无所疑也。'],
大壮:['壮于趾，其孚穷也。','九二贞吉，以中也。','小人用壮，君子罔也。','藩决不羸，尚往也。','丧羊于易，位不当也。','不能退，不能遂，不详也。艰则吉，咎不长也。'],
晋:['晋如摧如，独行正也。裕无咎，未受命也。','受兹介福，以中正也。','众允之，志上行也。','硕鼠贞厉，位不当也。','失得勿恤，往有庆也。','维用伐邑，道未光也。'],
明夷:['君子于行，义不食也。','六二之吉，顺以则也。','南狩之志，乃大得也。','入于左腹，获心意也。','箕子之贞，明不可息也。','初登于天，照四国也。后入于地，失则也。'],
家人:['闲有家，志未变也。','六二之吉，顺以巽也。','家人嗃嗃，未失也。妇子嘻嘻，失家节也。','富家大吉，顺在位也。','王假有家，交相爱也。','威如之吉，反身之谓也。'],
睽:['见恶人，以辟咎也。','遇主于巷，未失道也。','见舆曳，位不当也。无初有终，遇刚也。','交孚无咎，志行也。','厥宗噬肤，往有庆也。','遇雨之吉，群疑亡也。'],
蹇:['往蹇来誉，宜待也。','王臣蹇蹇，终无尤也。','往蹇来反，内喜之也。','往蹇来连，当位实也。','大蹇朋来，以中节也。','往蹇来硕，志在内也。利见大人，以从贵也。'],
解:['刚柔之际，义无咎也。','九二贞吉，得中道也。','负且乘，亦可丑也。自我致戎，又谁咎也。','解而拇，未当位也。','君子有解，小人退也。','公用射隼，以解悖也。'],
损:['已事遄往，尚合志也。','九二利贞，中以为志也。','一人行，三则疑也。','损其疾，亦可喜也。','六五元吉，自上佑也。','弗损益之，大得志也。'],
益:['元吉无咎，下不厚事也。','或益之，自外来也。','益用凶事，固有之也。','告公从，以益志也。','有孚惠心，勿问之矣。惠我德，大得志也。','莫益之，偏辞也。或击之，自外来也。'],
夬:['不胜而往，咎也。','有戎勿恤，得中道也。','君子夬夬，终无咎也。','其行次且，位不当也。闻言不信，聪不明也。','中行无咎，中未光也。','无号之凶，终不可长也。'],
姤:['系于金柅，柔道牵也。','包有鱼，义不及宾也。','其行次且，行未牵也。','无鱼之凶，远民也。','九五含章，中正也。有陨自天，志不舍命也。','姤其角，上穷吝也。'],
萃:['乃乱乃萃，其志乱也。','引吉无咎，中未变也。','往无咎，上巽也。','大吉无咎，位不当也。','萃有位，志未光也。','赍咨涕洟，未安上也。'],
升:['允升大吉，上合志也。','九二之孚，有喜也。','升虚邑，无所疑也。','王用亨于岐山，顺事也。','贞吉升阶，大得志也。','冥升在上，消不富也。'],
困:['入于幽谷，幽不明也。','困于酒食，中有庆也。','据于蒺藜，乘刚也。入于其宫，不见其妻，不祥也。','来徐徐，志在下也。虽不当位，有与也。','劓刖，志未得也。乃徐有说，以中直也。利用祭祀，受福也。','困于葛藟，未当也。动悔有悔，吉行也。'],
井:['井泥不食，下也。旧井无禽，时舍也。','井谷射鲋，无与也。','井渫不食，行恻也。求王明，受福也。','井甃无咎，修井也。','寒泉之食，中正也。','元吉在上，大成也。'],
革:['巩用黄牛，不可以有为也。','巳日革之，行有嘉也。','革言三就，又何之矣。','改命之吉，信志也。','大人虎变，其文炳也。','君子豹变，其文蔚也。小人革面，顺以从君也。'],
鼎:['鼎颠趾，未悖也。利出否，以从贵也。','鼎有实，慎所之也。我仇有疾，终无尤也。','鼎耳革，失其义也。','覆公餗，信如何也。','鼎黄耳，中以为实也。','玉铉在上，刚柔节也。'],
震:['震来虩虩，恐致福也。笑言哑哑，后有则也。','震来厉，乘刚也。','震苏苏，位不当也。','震遂泥，未光也。','震往来厉，危行也。其事在中，大无丧也。','震索索，中未得也。虽凶无咎，畏邻戒也。'],
艮:['艮其趾，未失正也。','不拯其随，未退听也。','艮其限，危熏心也。','艮其身，止诸躬也。','艮其辅，以中正也。','敦艮之吉，以厚终也。'],
渐:['小子之厉，义无咎也。','饮食衎衎，不素饱也。','夫征不复，离群丑也。妇孕不育，失其道也。利用御寇，顺相保也。','或得其桷，顺以巽也。','终莫之胜吉，得所愿也。','鸿渐于陆，其羽可用为仪吉，不可乱也。'],
归妹:['归妹以娣，以恒也。跛能履吉，相承也。','利幽人之贞，未变常也。','归妹以须，未当也。','愆期之志，有待而行也。','帝乙归妹，不如其娣之袂良也。其位在中，以贵行也。','上六无实，承虚筐也。'],
丰:['虽旬无咎，过旬灾也。','有孚发若，信以发志也。','丰其沛，不可大事也。折其右肱，终不可用也。','丰其蔀，位不当也。日中见斗，幽不明也。遇其夷主，吉行也。','六五之吉，有庆也。','丰其屋，天际翔也。窥其户，阒其无人，自藏也。'],
旅:['旅琐琐，志穷灾也。','得童仆贞，终无尤也。','旅焚其次，亦以伤矣。以旅与下，其义丧也。','旅于处，未得位也。得其资斧，心未快也。','终以誉命，上逮也。','以旅在上，其义焚也。丧牛于易，终莫之闻也。'],
巽:['进退，志疑也。利武人之贞，志治也。','纷若之吉，得中也。','频巽之吝，志穷也。','田获三品，有功也。','九五之吉，位正中也。','巽在床下，上穷也。丧其资斧，正乎凶也。'],
兑:['和兑之吉，行未疑也。','孚兑之吉，信志也。','来兑之凶，位不当也。','九四之喜，有庆也。','孚于剥，位正当也。','上六引兑，未光也。'],
涣:['初六之吉，顺也。','涣奔其机，得愿也。','涣其躬，志在外也。','涣其群元吉，光大也。','王居无咎，正位也。','涣其血，远害也。'],
节:['不出户庭，知通塞也。','不出门庭，失时极也。','不节之嗟，又谁咎也。','安节之亨，承上道也。','甘节之吉，居位中也。','苦节贞凶，其道穷也。'],
中孚:['初九虞吉，志未变也。','其子和之，中心愿也。','或鼓或罢，位不当也。','马匹亡，绝类上也。','有孚挛如，位正当也。','翰音登于天，何可长也。'],
小过:['飞鸟以凶，不可如何也。','不及其君，臣不可过也。','从或戕之，凶如何也。','弗过遇之，位不当也。往厉必戒，终不可长也。','密云不雨，已上也。','弗遇过之，已亢也。'],
既济:['曳其轮，义无咎也。','七日得，以中道也。','三年克之，惫也。','终日戒，有所疑也。','东邻杀牛，不如西邻之时也。实受其福，吉大来也。','濡其首厉，何可久也。'],
未济:['濡其尾，亦不知极也。','九二贞吉，中以行正也。','未济征凶，位不当也。','贞吉悔亡，志行也。','君子之光，其晖吉也。','饮酒濡首，亦不知节也。']
};
HEX.forEach(h=>{ h.yao=HEX_YAO[h.name]||[]; h.xiaoxiang=HEX_XIAOXIANG[h.name]||[]; if(HEX_YONG[h.name]) h.yong=HEX_YONG[h.name]; });

/* 爻画：top->bottom 渲染（阳=整杠，阴=断杠） */
function hexDraw(bitsTopToBottom, changes){
  changes = changes || bitsTopToBottom.map(()=>false);
  const W=92, yh=9, gap=5, top=5, seg=(W-12-10)/4, x1=8, x2=x1+seg*2+8;
  let s=`<svg viewBox="0 0 ${W} ${top*2+bitsTopToBottom.length*(yh+gap)-gap}" width="${W}" height="${top*2+bitsTopToBottom.length*(yh+gap)-gap}" style="max-width:100%;height:auto;display:block" role="img" aria-label="卦象六爻">`;
  bitsTopToBottom.forEach((b,i)=>{
    const y=top+i*(yh+gap);
    // 两爻之间加极细分隔暗线，增强"六层变化"的层次感
    if(i>0) s+=`<line x1="${x1-2}" y1="${y-1}" x2="${W-6}" y2="${y-1}" stroke="var(--gold)" stroke-opacity=".08" stroke-width=".5"/>`;
    if(b){ s+=`<rect x="${x1-2}" y="${y}" width="${W-10}" height="${yh}" rx="4" fill="url(#hxGold)" fill-opacity=".95"/>`; }
    else { s+=`<rect x="${x1}" y="${y}" width="${seg}" height="${yh}" rx="4" fill="url(#hxGold)" fill-opacity=".95"/><rect x="${x2+2}" y="${y}" width="${seg}" height="${yh}" rx="4" fill="url(#hxGold)" fill-opacity=".95"/>`; }
    if(changes[i]){ s+=`<circle cx="${W-4}" cy="${y+yh/2}" r="3" fill="var(--bad)"/><circle cx="3" cy="${y+yh/2}" r="3" fill="var(--bad)"/><circle cx="${W/2}" cy="${y+yh/2}" r="2.2" fill="var(--bad)"/>`; }
  });
  s+='</svg>';
  return s;
}
/* ---------- 卦象图卡：把六爻画成一张带八卦标注的「卦卡」，让卦象的图可见 ---------- */
function _triTag(bitDownMidUp, color, s){ // bitDownMidUp=[下,中,上]；s=边长
  const w=s, h=s, y0=-h/2; let r='';
  bitDownMidUp.forEach((v,k)=>{ const y=(y0+k*(h/3)).toFixed(1);
    if(v) r+=`<rect x="${(-w/2).toFixed(1)}" y="${y}" width="${w}" height="2" rx="1" fill="${color}"/>`;
    else { const sw=(w-4)/2; r+=`<rect x="${(-w/2).toFixed(1)}" y="${y}" width="${sw}" height="2" rx="1" fill="${color}"/><rect x="${(w/2-sw).toFixed(1)}" y="${y}" width="${sw}" height="2" rx="1" fill="${color}"/>`; }
  }); return r;
}
/* 给定卦名画出完整的六爻位（上→下）：自 HEX_MAP 反查 bits -> 上卦/下卦三爻（[下,中,上]） */
function _hexTrigrams(name){
  const h=HEX_MAP?Object.values(HEX_MAP).find(x=>x.name===name):null;
  if(!h) return null;
  const up=JING[h.up], down=JING[h.down]; // [下,中,上] 三爻
  return {up, down, upName:h.up, downName:h.down};
}
/* 单张卦卡 SVG：六爻主符(自上而下 bits) + 右侧上/下卦八卦符 + 卦名 */
function hexCardSVG(name, bitsTopToBottom, changes){
  changes = changes || bitsTopToBottom.map(()=>false);
  const W=150, H=196, pad=12;
  const li = 32;              // 爻条区宽
  const yh=10, gap=6, top=58; // 爻条起始的 y
  const seg=(li-8)/2;
  const t=_hexTrigrams(name);
  let s=`<svg viewBox="0 0 ${W} ${H}" width="132" height="172" style="max-width:100%;height:auto;display:block;border-radius:14px;border:1px solid var(--gold);border-color:rgba(212,175,55,.5);background:linear-gradient(160deg,rgba(212,175,55,.08),rgba(212,175,55,.02))" role="img" aria-label="${name}卦象">`;
  // 上边框装饰
  s+=`<rect x="4" y="4" width="${W-8}" height="${H-8}" rx="11" fill="none" stroke="var(--gold)" stroke-opacity=".35"/>`;
  // 卦名 + 上/下卦
  s+=`<text x="${W/2}" y="30" text-anchor="middle" fill="var(--gold2)" font-size="19" font-weight="bold" font-family="STKaiti,KaiTi,serif">${name}<tspan font-size="12" fill="var(--muted)">卦</tspan></text>`;
  if(t) s+=`<text x="${W/2}" y="47" text-anchor="middle" fill="var(--muted)" font-size="10.5">上${t.upName} · 下${t.downName}</text>`;
  // 六爻主符（自上而下）
  for(let i=0;i<bitsTopToBottom.length;i++){
    const b=bitsTopToBottom[i], y=top+i*(yh+gap);
    if(b){ s+=`<rect x="${pad}" y="${y}" width="${li}" height="${yh}" rx="3.5" fill="url(#hxGold)"/>`; }
    else { s+=`<rect x="${pad}" y="${y}" width="${seg}" height="${yh}" rx="3.5" fill="url(#hxGold)"/><rect x="${pad+seg+6}" y="${y}" width="${seg}" height="${yh}" rx="3.5" fill="url(#hxGold)"/>`; }
    if(changes[i]) s+=`<circle cx="${pad+li+9}" cy="${y+yh/2}" r="3" fill="#b5554a"/>`;
  }
  // 右侧：上卦(上三爻=索引0-2) + 下卦(索引3-5)，标注八卦符
  if(t){
    const triW=26, triX=W-pad-24;
    const upT2B=[bitsTopToBottom[0],bitsTopToBottom[1],bitsTopToBottom[2]]; // 上卦 上→下
    const upDownMidUp=upT2B.slice().reverse(); // [下,中,上]
    const downT2B=[bitsTopToBottom[3],bitsTopToBottom[4],bitsTopToBottom[5]];
    const downDownMidUp=downT2B.slice().reverse();
    // 上卦符：放上卦三爻区间
    const upY=top+0*(yh+gap), upH=3*(yh+gap)-(gap); // 覆盖索引0-2
    s+=`<g transform="translate(${(triX+triW/2).toFixed(1)},${(upY+upH/2).toFixed(1)})">${_triTag(upDownMidUp,'var(--gold2)',22)}</g>`;
    const dY=top+3*(yh+gap), dH=3*(yh+gap)-(gap);
    s+=`<g transform="translate(${(triX+triW/2).toFixed(1)},${(dY+dH/2).toFixed(1)})">${_triTag(downDownMidUp,'var(--gold2)',22)}</g>`;
    // 分隔线
    s+=`<line x1="${pad-2}" y1="${dY-4}" x2="${W-pad+2}" y2="${dY-4}" stroke="var(--gold)" stroke-opacity=".18" stroke-width=".7" stroke-dasharray="3 3"/>`;
  }
  s+='</svg>';
  return s;
}
/* 本卦/变卦组合卦画：返回横向双卡容器（本卦用真实爻冠+动爻标记，变卦用变后爻） */
function hexFigurePair(benName, benBitsT2B, changes, bianName, chBitsT2B){
  let d=`<div style="display:flex;gap:16px;justify-content:center;align-items:flex-start;flex-wrap:wrap;margin:4px 0 2px">`;
  d+=`<div><div style="text-align:center;color:var(--muted);font-size:12px;margin-bottom:3px">本卦 · ${benName}</div>${hexCardSVG(benName, benBitsT2B, changes)}</div>`;
  if(bianName) d+=`<div><div style="text-align:center;color:var(--muted);font-size:12px;margin-bottom:3px">变卦 · ${bianName}</div>${hexCardSVG(bianName, chBitsT2B, chBitsT2B.map(()=>false))}</div>`;
  d+='</div>';
  return d;
}
/* 八卦速览：八个三爻卦符 + 卦名/五行/物象，供读懂卦象 */
function trigramChip(name, bitDownMidUp, wu, xiang){
  const u=bitDownMidUp.join('');
  return `<div style="border:1px solid var(--line);border-radius:10px;padding:6px 2px 5px;text-align:center;background:var(--surface-2);display:flex;flex-direction:column;align-items:center;gap:2px">
    <div style="color:var(--gold2);font-size:14px;font-weight:700;font-family:STKaiti,KaiTi,serif">${name}</div>
    <svg viewBox="0 0 44 40" width="44" height="40" style="display:block">${_triTag(bitDownMidUp,'var(--gold2)',28)}</svg>
    <div style="font-size:10px;color:var(--muted)"><b style="color:var(--gold2)">${wu}</b> · ${xiang}</div>
  </div>`;
}
function baguaGalleryHTML(){
  const B=[['乾',[1,1,1],'金','天'],['兑',[1,1,0],'金','泽'],['离',[1,0,1],'火','火'],['震',[1,0,0],'木','雷'],['巽',[0,1,1],'木','风'],['坎',[0,1,0],'水','水'],['艮',[0,0,1],'土','山'],['坤',[0,0,0],'土','地']];
  return `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">${B.map(x=>trigramChip(x[0],x[1],x[2],x[3])).join('')}</div>
    <div style="text-align:center;color:var(--muted);font-size:11px;margin-top:8px">一（阳）为实、--（阴）为断；上卦主外境、下卦主自身——起卦所得卦卡会为你标出上下卦。</div>`;
}
/* 古朴金线渐变（供卦象爻条着色；避免与卡片 uid 冲突，用固定 id） */
if(!document.getElementById('hxGold')){
  try{ const _gd=document.createElementNS('http://www.w3.org/2000/svg','linearGradient'); _gd.setAttribute('id','hxGold'); _gd.setAttribute('x1','0'); _gd.setAttribute('y1','0'); _gd.setAttribute('x2','1'); _gd.setAttribute('y2','1');
    const _s1=document.createElementNS('http://www.w3.org/2000/svg','stop'); _s1.setAttribute('offset','0'); _s1.setAttribute('stop-color','#f3dc9b'); _s1.setAttribute('stop-opacity','.96');
    const _s2=document.createElementNS('http://www.w3.org/2000/svg','stop'); _s2.setAttribute('offset','1'); _s2.setAttribute('stop-color','#c9a35a'); _s2.setAttribute('stop-opacity','.96');
    _gd.appendChild(_s1); _gd.appendChild(_s2); document.documentElement.appendChild(_gd);
  }catch(e){}
}
/* 八卦速览：加载即填 */
(function(){
  try{ const g=document.getElementById('baguaGallery'); if(g) g.innerHTML=baguaGalleryHTML(); }catch(e){}
})();

document.getElementById('ichingBtn').onclick=()=>{
  const lines=[];               // index0 = 初爻（最下）
  for(let i=0;i<6;i++){
    let heads=0; for(let c=0;c<3;c++){ if(Math.random()<0.5) heads++; }
    if(heads===0) lines.push({bit:0,change:true});   // 老阴
    else if(heads===3) lines.push({bit:1,change:true}); // 老阳
    else if(heads===1) lines.push({bit:1,change:false}); // 少阳
    else lines.push({bit:0,change:false});            // 少阴
  }
  const key=lines.map(l=>l.bit).join('');
  const ben=HEX_MAP[key];
  const chBits=lines.map(l=> l.change ? (1-l.bit) : l.bit);
  const chKey=chBits.join('');
  const bian=(key!==chKey)?HEX_MAP[chKey]:null;
  const changePos=lines.map((l,i)=> l.change ? (i+1) : null).filter(x=>x);
  // 画卦（升级为带八卦标注的卦象图卡）
  const _bt2b=lines.slice().reverse().map(l=>l.bit), _chg=lines.slice().reverse().map(l=>l.change);
  const _chgT2B=chBits.slice().reverse();
  let draw=hexFigurePair(ben.name, _bt2b, _chg, bian?bian.name:null, _chgT2B);
  document.getElementById('ichingDraw').innerHTML=draw;
  // 文案
  let html=`<div class="result"><h3>${ben.name}卦（本卦）</h3>
    <span class="tag">上卦 ${ben.up}</span><span class="tag">下卦 ${ben.down}</span><span class="tag">五行 ${ben.wu}</span>
    <p style="margin-top:8px">卦辞：${ben.ci}</p>
    <p>断语：${ben.du}</p>`;
  // 《彖传》《大象传》（乾坤附《文言传》），均出自《周易》通行本
  if(HEX_TUAN[ben.name]) html+=`<div class="tuan-box" style="margin-top:10px;padding:8px 10px;background:rgba(212,175,55,.06);border-left:3px solid var(--gold);border-radius:4px"><div style="color:var(--gold2);font-size:12px;margin-bottom:4px">彖传</div><div style="font-size:13px;line-height:1.8">${HEX_TUAN[ben.name]}</div></div>`;
  if(HEX_DAXIANG[ben.name]) html+=`<div class="dax-box" style="margin-top:6px;padding:8px 10px;background:rgba(110,180,255,.06);border-left:3px solid #6eb4ff;border-radius:4px"><div style="color:#6eb4ff;font-size:12px;margin-bottom:4px">大象传</div><div style="font-size:13px;line-height:1.8">${HEX_DAXIANG[ben.name]}</div></div>`;
  if((ben.name==='乾'||ben.name==='坤') && HEX_WENYAN[ben.name]) html+=`<div class="wy-box" style="margin-top:6px;padding:8px 10px;background:rgba(180,140,255,.06);border-left:3px solid #b48cff;border-radius:4px"><div style="color:#b48cff;font-size:12px;margin-bottom:4px">文言传</div><div style="font-size:13px;line-height:1.8">${HEX_WENYAN[ben.name]}</div></div>`;
  // 全卦爻辞（初→上）
  if(ben.yao && ben.yao.length){
    html+=`<div style="margin-top:10px"><div style="color:var(--muted);font-size:12px;margin-bottom:4px">爻辞（初爻→上爻）</div>`;
    ben.yao.forEach((y,i)=>{
      const moving=changePos.indexOf(i+1)>=0;
      html+=`<div style="font-size:13px;line-height:1.7;${moving?'color:var(--gold2);font-weight:600':''}">${y}${moving?' ◀ 动爻':''}</div>`;
    });
    html+='</div>';
  }
  if(bian){
    html+=`<p style="margin-top:8px">变卦 <b style="color:var(--gold2)">${bian.name}卦</b>（${changePos.map(p=>'第'+p+'爻动').join('、')}）<br><span style="color:var(--muted)">${bian.ci}</span></p>`;
    if(HEX_TUAN[bian.name]) html+=`<div style="margin-top:4px;padding:6px 10px;background:rgba(212,175,55,.04);border-left:3px solid var(--gold);border-radius:4px"><div style="color:var(--gold2);font-size:12px;margin-bottom:2px">变卦 · 彖传</div><div style="font-size:12px;line-height:1.7;color:var(--muted)">${HEX_TUAN[bian.name]}</div></div>`;
    if(HEX_DAXIANG[bian.name]) html+=`<div style="margin-top:4px;padding:6px 10px;background:rgba(110,180,255,.04);border-left:3px solid #6eb4ff;border-radius:4px"><div style="color:#6eb4ff;font-size:12px;margin-bottom:2px">变卦 · 大象传</div><div style="font-size:12px;line-height:1.7;color:var(--muted)">${HEX_DAXIANG[bian.name]}</div></div>`;
  }else{
    html+=`<p style="color:var(--muted);font-size:12px;margin-top:8px">六爻安静，无变卦。</p>`;
  }
  // 动爻之辞（周易占法以动爻爻辞为主断）
  if(changePos.length){
    let dong='<h4 style="margin-top:10px">动爻之辞（主断）</h4>';
    changePos.forEach(p=>{ dong+=`<p style="border-left:3px solid var(--gold);padding-left:8px;margin:6px 0;font-size:13px">第${p}爻动 · <b>${ben.yao[p-1]||''}</b></p>`;
      if(ben.xiaoxiang && ben.xiaoxiang[p-1]) dong+=`<p style="border-left:3px solid #b48cff;padding-left:8px;margin:2px 0 6px 14px;font-size:12.5px;color:var(--muted)">〈小象〉${ben.xiaoxiang[p-1]}</p>`;
    });
    if(ben.yong && changePos.length===6) dong+=`<p style="border-left:3px solid var(--gold);padding-left:8px;margin:6px 0;font-size:13px"><b>${ben.yong}</b>（用九/用六 · 六爻皆变）</p>`;
    html+=dong;
  }
  const hr=hexReading(ben.up,ben.down,changePos.length,bian?bian.name:null);
  html+=`<h4>白话解读</h4><p>${hexOneLine(ben.up,ben.down,changePos.length,bian?bian.name:null)}</p>${hr.map(x=>'<p>'+wrapTerms(x)+'</p>').join('')}<p style="color:var(--muted);font-size:12px;margin-top:6px">* 解读由卦象五行生克与动爻生成;卦是参考,事在人为。</p>`;
  html+=`<p style="color:var(--muted);font-size:12px;margin-top:8px">* 卦辞、爻辞、彖传、大象传、小象传、乾坤文言传均出自《周易》通行本（维基文库简体本）；起卦用三枚铜钱法，抽爻随机、经文真实</p></div>`;
  document.getElementById('ichingResult').innerHTML=html;
};

/* ===================== 9.5 袁天罡称骨算命（真实骨重歌） ===================== */
/* 骨重以「钱」为单位（1两=10钱），年/月/日/时逐项相加得总骨重 */
const YEAR_GU={甲子:12,乙丑:9,丙寅:6,丁卯:7,戊辰:12,己巳:5,庚午:9,辛未:7,壬申:7,癸酉:8,
 甲戌:15,乙亥:9,丙子:7,丁丑:8,戊寅:8,己卯:19,庚辰:12,辛巳:6,壬午:8,癸未:7,
 甲申:5,乙酉:15,丙戌:6,丁亥:16,戊子:15,己丑:7,庚寅:9,辛卯:12,壬辰:10,癸巳:7,
 甲午:15,乙未:6,丙申:5,丁酉:14,戊戌:14,己亥:9,庚子:7,辛丑:8,壬寅:9,癸卯:12,
 甲辰:8,乙巳:7,丙午:13,丁未:5,戊申:14,己酉:5,庚戌:9,辛亥:17,壬子:5,癸丑:7,
 甲寅:12,乙卯:18,丙辰:8,丁巳:6,戊午:19,己未:6,庚申:8,辛酉:16,壬戌:10,癸亥:7};
const MONTH_GU={1:6,2:7,3:18,4:9,5:5,6:16,7:9,8:15,9:18,10:8,11:9,12:5};
const DAY_GU={1:5,2:10,3:8,4:15,5:16,6:15,7:8,8:16,9:8,10:16,11:9,12:17,13:8,14:17,15:10,16:8,17:9,18:18,19:5,20:15,21:10,22:9,23:8,24:9,25:15,26:18,27:7,28:8,29:16,30:6};
const HOUR_GU={0:16,1:6,2:7,3:10,4:9,5:16,6:10,7:8,8:8,9:9,10:6,11:6};
const GU_POEM={21:'短命非业谓大空，平生灾难事重重，凶祸频临陷逆境，终世困苦事不成。',
22:'身寒骨冷苦伶仃，此命推来行乞人，劳劳碌碌无度日，终年打拱过平生。',
23:'此命推来骨自轻，求谋作事难成，妻儿兄弟应难许，别作他乡外客人。',
24:'此命推来福禄无，门庭困苦总难荣，六亲骨肉皆无靠，流到他乡作老人。',
25:'此命推来祖业微，门庭营度似稀奇，六亲骨肉如冰炭，一世勤劳自把持。',
26:'平生衣禄苦中求，独自营谋事不休，离祖出门宜早计，晚来衣禄自无休。',
27:'一生作事少商量，难靠祖宗作主张，独马单枪空做去，早年晚岁总无长。',
28:'一生行事似飘蓬，祖宗产业在梦中，若不过房改名姓，也当移徒二三通。',
29:'初年运限未曾亨，纵有功名在后成，须过四旬才可立，移居改姓始为良。',
30:'劳劳碌碌苦中求，东奔西走何日休，若何此命终须变，改姓移居更可留。',
31:'忙忙修心不受贫，六亲骨肉亦无亲，外乡受得成家业，衣禄宏基自可寻。',
32:'初年运蹇事难谋，渐有财源如水流，到处纷达皆称意，早年晚景更优游。',
33:'早年本年无根基，中年衣食渐无忧，晚景欣然成家业，快悦哀乐总无愁。',
34:'此命福气果如何，僧道门中衣禄多，离祖出家方为妙，朝晚拜佛念弥陀。',
35:'生平福量不周全，祖业根基觉少传，营事生涯宜守旧，时来衣食胜从前。',
36:'不须劳禄过平生，独自成家福不轻，早有福星常照命，任君行去百般成。',
37:'此命般般事不成，弟兄少力自孤行，虽然祖业须微有，来得明时去不明。',
38:'一身骨肉最清高，早入簧门姓氏标，待到年将三十六，蓝衫脱去换红袍。',
39:'此命终身运不通，劳劳作事尽皆空，苦心竭力成家计，到得那时在梦中。',
40:'平生衣禄是绵长，件件心中自主张，前面风霜多受过，后来必定享安康。',
41:'此命推来事不同，为人能干异凡庸，中年还有逍遥福，不比前时运未通。',
42:'得宽怀处且宽怀，何用双眉皱不开，若使中年命运济，那时名利一齐来。',
43:'为人心性最聪明，作事轩昂近贵人，衣禄一生天数定，不须劳碌过平生。',
44:'来事由天莫苦求，须知福碌赖人修，当年财帛难如意，晚景欣然便不优。',
45:'名利推来竟若何，前番辛苦后奔波，命中难养男和女，骨肉扶持也不多。',
46:'东西南北尽皆通，出姓移居更觉隆，衣禄无亏天数定，中年晚景一般同。',
47:'此命推来福待人，平生衣禄是绵长，化凶为吉无克破，笛声肴里遇知音。',
48:'初年运道未曾通，几许蹉跎命亦穷，兄弟六亲无依靠，一生事业晚来隆。',
49:'此命推来福不轻，自成自立显门庭，从来富贵人钦敬，使婢差奴过一生。',
50:'为利为名终日劳，中年福禄也多遭，老来自有财星照，不比前时苦煎熬。',
51:'一世荣华事事通，不须劳碌自亨通，兄弟叔侄皆如意，家业成时福禄宏。',
52:'一世亨通事事能，不须劳思自然能，宗族欣然心皆好，家业丰盈自称心。',
53:'此格推来福泽宏，兴家立业在其中，一生衣禄安排定，却是人间一福翁。',
54:'此格推来厚且清，诗书满腹看功成，丰衣足食多安稳，正是人间有福人。',
55:'策马扬鞭争名利，少年作事费筹论，一朝福禄源源至，富贵荣华显六亲。',
56:'此格推来礼义通，一身福禄用无穷，甜酸苦辣皆尝过，滚滚财源稳且丰。',
57:'福禄丰盈万事全，一身荣耀乐天年，名扬威震人争羡，此世逍遥宛似仙。',
58:'平生衣食自然来，名利双全富贵偕，金榜题名登甲第，紫袍玉带走金阶。',
59:'细推此格妙且清，必定才高礼义通，甲第之中应有分，扬鞭走马显威荣。',
60:'一朝金榜快题名，显祖荣宗立大功，衣食定然原欲足，田园财帛更丰盈。',
61:'不作朝中金榜客，定为世上大财翁，聪明天赋经书熟，名显高科自是荣。',
62:'此命生来福不穷，读书必定显亲宗，紫衣金带为卿相，富贵荣华孰与同。',
63:'命主为官福禄长，得来富贵实非常，名题雁塔传金榜，大显门庭天下扬。',
64:'此格威权不可当，兵权赫赫在边疆，东征西讨功成位，万户封侯福寿堂。',
65:'细推此命福非轻，富贵荣华孰与争，定国安邦人极品，威声显赫震寰瀛。',
66:'此格人间一福翁，不须愁苦闷胸中，福财两备皆丰足，逍遥快乐过平生。',
67:'此命生来福自宏，田园家业最高隆，平生衣禄盈丰足，一路荣华万事通。',
68:'富贵由天莫苦求，万金家计不须谋，十年前费辛勤力，老来优游更自由。',
69:'君是人间福禄星，一生富贵众人钦，总然衣禄常安隐，却得荣华过一生。',
70:'此命推来富贵真，荣华富贵更无比，命里称骨重七两，一生荣华万事通。',
71:'此命推来鸿运交，不须愁苦自逍遥，荣华富贵天注定，金玉满堂乐滔滔。',
72:'此骨三品之格，此命推来福不轻，诗书满腹称儒生，官居极品姓名显，富贵荣华孰与争。'};
/* 女命称骨歌（袁天罡女版，与男版同骨重断语各异；key=骨重钱数 21~72） */
const GU_POEM_F={21:'生身此命运不通，乌云盖月黑朦胧，莫向故园载花木，可来幽地种青松。',
22:'女命孤冷独凄身，此身推来路乞人，操心烦恼难度日，一生痛苦度光阴。',
23:'女命生来轻薄人，营谋事作难称心，六亲骨肉亦无靠，奔走劳碌困苦门。',
24:'女命推来福禄无，治家艰难辛苦多，丈夫儿女不亲爱，奔走他乡作游姑。',
25:'此命一身八字低，家庭艰辛多苦妻，娘家亲友冷如炭，一生勤劳多忧眉。',
26:'平生依禄但苦求，两次配夫带忧愁，咸酸苦辣他偿过，晚年衣食本无忧。',
27:'此格做事单独强，难告夫君作主张，心问口来口问心，晚景衣禄宜自生。',
28:'女命生来八字轻，为善作事也无因，你把别人当亲生，别人对你假殷情。',
29:'花支艳来硬性身，自奔自力不求人，若问求财方可止，在苦有甜度光阴。',
30:'女命推来比郎强，婚姻大事碍无障，中年走过坎坷地，末年渐经行前强。',
31:'早年行运在忙头，劳碌奔波苦勤求，费力劳心把家立，后来晚景名忧愁。',
32:'时逢运来带吉神，从有凶星转灰尘，真变假来假成真，结拜弟妹当亲生。',
33:'初限命中有变化，中年可比树落花，勤俭持家难度日，晚年成业享荣华。',
34:'矮巴勾枣难捞枝，看破红尘最相宜，谋望求财空费力，婚姻三娶两次离。',
35:'女子走冰怕冰薄，出行交易受残霜，婚姻周郎休此意，官司口舌须相加。',
36:'忧悉常锁两眉间，家业挂心不等闲，从今以后防口角，任意行移不相关。',
37:'此命推来费运多，若作摧群受折磨，山路崎岖吊下耳，左插右安心难留。',
38:'凤鸣岐山四方扬，女命逢此大吉昌，走失夫君音信有，晚年衣禄财盈箱。',
39:'女命推来运未能，劳碌奔波一场空，好似俊鸟在笼锁，中年未限凄秋风。',
40:'目前月令运不良，千辛万苦受煎熬，女身受得多苦难，晚年福禄比密甜。',
41:'此命推来一般艰，女子为人很非凡，中年逍遥多自在，晚年更比中年超。',
42:'杜井破废已多年，今有泉水出来鲜，资生济竭人称美，中运来转喜安然。',
43:'推车靠涯道路通，女名求财也无穷，婚姻出配无阻碍，疾病口舌离身躬。',
44:'夜梦金银醒来空，立志谋业运不通，婚姻难成交易散，夫君趟失未见踪。',
45:'女命终身驳杂多，六亲骨肉不相助，命中男女都难养，劳碌辛苦还奔波。',
46:'孤舟行水离沙滩，离乡出外早过家，是非口舌皆无碍，婚姻合配紫微房。',
47:'时来运转喜开颜，多年枯木逢春花，枝叶重生多茂盛，凡人见得都赞夸。',
48:'一朵鲜花镜中开，看着极好取不来，劝你休把镜花想，此命推来主可癫。',
49:'一生为人福宏名，心兹随君显门庭，容貌美丽惹人爱，银钱富足万事成。',
50:'马氏太公不相和，好命逢此忧凝多，恩人无义反为仇，是非平地起风波。',
51:'肥羊一群入出场，防虎逢之把口张，适口充饥心欢喜，女命八字大吉昌。',
52:'顺风行舟扯起帆，上天又助一顺风，不用费力逍遥去，任意顺行大享通。',
53:'此命相貌眉目清，文武双全功名成，一生衣禄皆无缺，可算世上积福人。',
54:'运开满腹好文章，谋事求财大吉祥，出行交易多得稳，到处享通姓名扬。',
55:'发政旅仁志量高，女命求财任他乡，交舍婚姻多有意，无君出外有音耗。',
56:'明珠辉吐离埃来，女有口有清散开，走失郎君当两归，交易有成永无灾。',
57:'游鱼戏水被网惊，踊身变化入龙门，三根杨柳垂金钱，万朵桃花显价能。',
58:'此命推来转悠悠，时运未来莫强求，幸得今日重反点，自有好运在后头。',
59:'雨雪载途活泥泞，交易不安难出生，疾病还拉婚姻慢，谋望求财事难寻。',
60:'女命八字喜气和，谋事求财吉庆多，口舌渐消疾病少，夫君走别归老窠。',
61:'缘木求鱼事多难，虽不得鱼无害反，若是行险弄巧地，事不遂心枉安凡。',
62:'指日高升气象新，走失待人有信音，好命遇事遂心好，伺病口舌皆除根。',
63:'五官脱运难抬头，妇命须当把财求，交易少行有人助，一生衣禄不须愁。',
64:'俊鸟曾得出胧中，脱离为难显威风，一朝得意福力至，东南西北任意通。',
65:'女命推来福非轻，兹善为事受人敬，天降文王开基业，八百年来富贵门。',
66:'时来运转闺阁楼，贤德淑女君子求，击鼓乐之大吉庆，女命逢此喜悠悠。',
67:'乱丝无头定有头，碰得亲事暂折磨，交易出行无好处，谋事求财心不遂。',
68:'水底明月不可捞，女命早限运未高，交易出行难获利，未运终得渐见好。',
69:'太公封祖不非凡，女子求财稳如山，交易合伙多吉庆，疾病口角遗天涯。',
70:'本命推断喜气新，恰遇郎君金遂心，坤身来交正当运，富贵衣禄乐平生。',
71:'此命推来宏运交，不须再愁苦劳难，一生身有衣禄福，安享荣华胜班超。',
72:'此格世界罕有生，十代积善产此人，天上紫微来照命，统治万民乐太平。'};
function guPoemF(qian){ if(GU_POEM_F[qian]) return GU_POEM_F[qian];
  let best=21,min=1e9; for(const k in GU_POEM_F){ const dd=Math.abs(Number(k)-qian); if(dd<min){min=dd;best=Number(k);} }
  return GU_POEM_F[best];
}
function guPoem(qian){ if(GU_POEM[qian]) return GU_POEM[qian];
  let best=21,min=1e9; for(const k in GU_POEM){ const dd=Math.abs(Number(k)-qian); if(dd<min){min=dd;best=Number(k);} }
  return GU_POEM[best];
}
document.getElementById('chengguBtn').onclick=()=>{
  const d=document.getElementById('cgBirth').value;
  if(!d){hintResult('chengguResult','请选择出生日期后再称骨。');return;}
  const [y,m,day]=d.split('-').map(Number);
  const h=parseInt(document.getElementById('cgHour').value);
  const gender=(document.getElementById('cgGender')||{}).value||'男';
  const hIdx={0:0,1:1,3:2,5:3,7:4,9:5,11:6,13:7,15:8,17:9,19:10,21:11}[h]; // 小时值→时辰序
  const lunar=Solar.fromYmdHms(y,m,day,h,0,0).getLunar();
  const ygz=lunar.getYearInGanZhi();
  const yq=YEAR_GU[ygz]; if(!yq){hintResult('chengguResult','该年干支暂无骨重数据，请核对日期。');return;}
  const mNum=lunar.getMonth();                 // 农历月数（闰月同本月）
  const mq=MONTH_GU[mNum]||0;
  const dNum=lunar.getDay();                   // 农历日
  const dq=DAY_GU[dNum]||0;
  const hq=HOUR_GU[hIdx]||0;
  const total=yq+mq+dq+hq;
  const liang=Math.floor(total/10), qian=total%10;
  const poem=(gender==='女')?guPoemF(total):guPoem(total);
  // 白话判词去模板：同骨重稳定、异骨重不同句
  const _cgt=_hashStr('cg'+total)%3;
  const _g1=['骨重六两以上，称骨歌中属重命，格局高、多得助','骨重六两以上，属重命之格，起点高、多得助，是能成事的骨相','骨重六两以上，重命之格——底子厚、贵人近，是能把事做成的好骨相'];
  const _g2=['骨重五两上下，中上之命，平顺中带贵气','骨重五两上下，属中上之命，平顺里透着贵气','骨重五两上下，中上之命——大事有主张、小事得人助，贵气藏在中平里'];
  const _g3=['骨重四两左右，中等之命，起落中和、宜积累','骨重四两左右，属中等之命，起落中和，重在积累','骨重四两左右，中等之命——贵在中和，起落皆是常态，勤勉自稳'];
  const _g4=['骨重三两上下，称骨歌中属轻，早年多劳但后运可期','骨重三两上下，属轻骨之命，早年多劳，后运可期','骨重三两上下，轻骨之命——早年劳碌、起伏偏多，后运却藏着翻盘的机会'];
  const _l1=['骨重六两以上,在称骨歌中属重命——格局高、少奔波、多得助,一生际遇较他人顺遂;越顺越要惜福守成、广积善缘。','骨重六两以上,是称骨歌里的重命——格局高、少奔波,际遇多顺;越顺越要惜福,守成亦是积福。','骨重六两以上,重命之格——天生少折腾、多遇扶,顺境里最忌飘,守成即是登高。'];
  const _l2=['骨重五两上下,属中上之命——一生平顺中带几分贵气,大事有主张、小事得人助,是能成事的命。','骨重五两上下,中上之命——平顺里带贵气,大事有主见、小事有人帮,是能成事的骨相。','骨重五两上下,中上之命——平顺里藏贵气,主见与助力兼得,是能成事也肯成事的骨相。'];
  const _l3=['骨重四两左右,属中等——起落皆有、贵在中和,早年稍劳、中年后渐稳,宜勤勉积累、看淡得失。','骨重四两左右,中等之命——起落皆有,贵在中和,早年稍劳、中年渐稳,勤勉积累即可。','骨重四两左右,中等之命——起落皆有、中和为本,早年稍劳、中年渐稳,勤勉积累、看淡得失最宜。'];
  const _l4=['骨重三两上下,称骨歌中属轻——早年奔波多劳,起伏较多;但轻骨亦可承重命,关键在于心志与积累,后运可期。','骨重三两上下,轻骨之命——早年劳碌、起伏偏多;但轻骨也能承重命,心志与积累到了,后运可期。','骨重三两上下,轻骨之命——早年劳碌、起伏偏多;轻骨亦能承重命,心志与积累到家,后运自有转机。'];
  const cgHtml=
    `<div class="result">
      <h3>${y}年${m}月${day}日 · ${ZHI[hIdx]}时 · ${gender}命</h3>
      <span class="tag">年柱 ${ygz} · ${yq}钱</span>
      <span class="tag">月 ${mNum}月 · ${mq}钱</span>
      <span class="tag">日 ${dNum} · ${dq}钱</span>
      <span class="tag">时 · ${hq}钱</span>
      <p style="margin-top:12px;font-size:18px">骨重：<b style="color:var(--gold2)">${liang}两${qian}钱</b>（共 ${total} 钱）</p>
      <p style="margin-top:10px">袁天罡${gender}命批语：</p>
      <p style="line-height:2;letter-spacing:.5px">${poem}</p>
      <h4>白话解读</h4>
      <p>一句话：${total>=60?_g1[_cgt]:total>=50?_g2[_cgt]:total>=40?_g3[_cgt]:_g4[_cgt]}。</p>
      <p>${total>=60?_l1[_cgt]:total>=50?_l2[_cgt]:total>=40?_l3[_cgt]:_l4[_cgt]}</p>
      <p style="color:var(--muted);font-size:12px">骨重是称骨歌的传统说法,数字仅供参考;命是参考,日子还得自己过。</p>
      <p style="color:var(--muted);font-size:12px;margin-top:8px">* 年/月/日/时骨重均按袁天罡称骨歌传统重量表推算（农历年/月/日/时辰），批语为传统命理歌诀（男命/女命歌诀分版，同骨重断语各异）。</p>
    </div>`;
  document.getElementById('chengguResult').innerHTML=wrapTerms(cgHtml);
};

/* 默认日期填充 */
(function(){ const t=new Date(); const iso=t.toISOString().slice(0,10);
  if(document.getElementById('birth')) document.getElementById('birth').value=iso;
  if(document.getElementById('alDate')) document.getElementById('alDate').value=iso;
  if(document.getElementById('cgBirth')) document.getElementById('cgBirth').value=iso;
  if(document.getElementById('starBirth')) document.getElementById('starBirth').value=iso;
  if(document.getElementById('zvBirth')) document.getElementById('zvBirth').value=iso;
  if(document.getElementById('mA')) document.getElementById('mA').value='1990-06-15';
  if(document.getElementById('fA')) document.getElementById('fA').value='1992-03-20';
})();

/* ===================================================================
   新增模块：本地记录 / AI 解读 / 塔罗牌面 / 六爻 / 梅花易数 / 紫微 / 奇门 / 合婚
   =================================================================== */

/* ---------- 本地历史记录（localStorage） ---------- */
const LS_KEY='xuanji_history_v1';
function saveHist(type,title,html){
  try{ const arr=JSON.parse(localStorage.getItem(LS_KEY)||'[]');
    arr.unshift({type,title,html,ts:Date.now()});
    localStorage.setItem(LS_KEY,JSON.stringify(arr.slice(0,120)));
  }catch(e){}
}
function getHist(){ try{ return JSON.parse(localStorage.getItem(LS_KEY)||'[]'); }catch(e){ return []; } }
function renderHist(){
  const box=document.getElementById('histResult'); const arr=getHist();
  if(!arr.length){ box.innerHTML='<div class="result">暂无记录。在各模块点击「保存结果」即可留档（仅存本机浏览器）。</div>'; return; }
  box.innerHTML=arr.map((r,i)=>`<div class="result" style="cursor:pointer" onclick="__showHist(${i})">
    <div style="display:flex;justify-content:space-between;gap:8px">
      <b style="color:var(--gold2)">${r.title}</b>
      <span style="color:var(--muted);font-size:11px;white-space:nowrap">${new Date(r.ts).toLocaleString()}</span>
    </div>
    <div style="font-size:12px;color:var(--muted);margin-top:4px">${r.html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,90)}…</div>
    <div style="font-size:11px;color:var(--gold);margin-top:4px">[${r.type}]</div>
  </div>`).join('');
}
window.__showHist=function(i){
  const r=getHist()[i]; if(!r) return;
  document.getElementById('histResult').innerHTML=`<div class="result">
    <div style="display:flex;justify-content:space-between"><b style="color:var(--gold2)">${r.title}</b><span style="font-size:11px;color:var(--muted)">${new Date(r.ts).toLocaleString()}</span></div>
    ${r.html}
    <button class="btn mini" style="margin-top:10px" onclick="renderHist()">← 返回列表</button>
  </div>`;
};
/* —— 历史导出/复制备份 —— */
function histText(arr){ return arr.map((r,i)=>`【${i+1}】${r.title}（${new Date(r.ts).toLocaleString()}）\n${(r.html||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}`).join('\n\n'); }
document.getElementById('histExport').onclick=()=>{
  const arr=getHist();
  if(!arr.length){ hintResult('histResult','暂无历史记录可导出。先在任意模块点「保存结果」留档。'); return; }
  try{
    const blob=new Blob([JSON.stringify(arr,null,2)],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='玄机阁历史记录_'+new Date().toISOString().slice(0,10)+'.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>{ try{ URL.revokeObjectURL(a.href); }catch(e){} },3000);
  }catch(e){ hintResult('histResult','导出失败：'+e.message); }
};
document.getElementById('histCopy').onclick=()=>{
  const arr=getHist();
  if(!arr.length){ hintResult('histResult','暂无历史记录可复制。先在任意模块点「保存结果」留档。'); return; }
  copyText(histText(arr),()=>{
    const b=document.getElementById('histCopy'); if(b){ b.textContent='✓ 已复制'; setTimeout(()=>b.textContent='📋 复制全部',1400); }
  });
};
function mountSaveButtons(){
  ['bazi','almanac','name','star','tarot','guanyin','dream','iching','liuyao','meihua','ziwei','qimen','hehun','chenggu','num','zodiac','lucky','pick','dreamo'].forEach(id=>{
    const p=document.getElementById(id); if(!p) return;
    // 取干净结果（剥掉折叠按钮与折叠类，便于保存/复制）
    function cleanResult(){
      const r=p.querySelector('.result'); if(!r) return null;
      const c=r.cloneNode(true);
      c.querySelectorAll('.fold-toggle').forEach(x=>x.remove());
      c.classList.remove('foldable','fold-open');
      return c;
    }
    const b=document.createElement('button');
    b.className='btn mini'; b.style.marginTop='10px'; b.textContent='保存此结果';
    b.onclick=()=>{ const c=cleanResult();
      if(!c){ hintResult(id+'Result','请先进行一次推算/占卜，再执行此操作。'); return; }
      const h3=c.querySelector('h3'); const title=h3?h3.textContent:(p.id+' 结果');
      saveHist(id,title,c.outerHTML);
      b.textContent='✓ 已保存'; setTimeout(()=>b.textContent='保存此结果',1200);
    };
    const cp=document.createElement('button');
    cp.className='btn mini'; cp.style.marginTop='10px'; cp.textContent='复制结果';
    cp.onclick=()=>{ const c=cleanResult();
      if(!c){ hintResult(id+'Result','请先进行一次推算/占卜，再执行此操作。'); return; }
      copyText((c.innerText||c.textContent||'').trim(),()=>{
        cp.textContent='✓ 已复制'; setTimeout(()=>cp.textContent='复制结果',1200);
      });
    };
    p.appendChild(b); p.appendChild(cp);
  });
}
/* 复制到剪贴板（clipboard API 优先，降级 execCommand，兼容 file://） */
function copyText(txt,ok){
  function fallback(){
    try{
      const ta=document.createElement('textarea'); ta.value=txt;
      ta.style.position='fixed'; ta.style.opacity='0'; ta.style.pointerEvents='none';
      document.body.appendChild(ta); ta.select();
      try{ document.execCommand('copy'); }catch(e){}
      ta.remove(); if(ok) ok();
    }catch(e){ if(ok) ok(); }
  }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(ok).catch(fallback);
  } else fallback();
}
/* ---------- 长结果折叠 + 落款 + 典籍引句（古籍高深感） ---------- */
(function(){
  const FOLD_CHARS=360;
  const FOLD_PANELS=new Set(['bazi','ziwei','qimen','liuyao','meihua','hehun','star','iching','name','chenggu','num','zodiac','guanyin','almanac','dream','lucky','tarot','runes','lenormand','numerology','cezi']);
  /* 可信度分层：det=真实历法推算(可复现) div=传统占卜(同求签·随机) */
  const CRED={bazi:'det',name:'det',chenggu:'det',ziwei:'det',num:'det',zodiac:'det',star:'det',almanac:'det',lucky:'det',tarot:'div',guanyin:'div',dream:'div',liuyao:'div',meihua:'div',iching:'div',hehun:'div',qimen:'div',runes:'div',lenormand:'div',numerology:'calc',cezi:'calc'};
  const CRED_TXT={det:'推算 · 依真实历法',calc:'推算 · 确定性算法',div:'占卜 · 同求签问卜'};
  /* 推算依据（确定性模块可核验：历法/规则/公式锚点） */
  const BASIS={
    bazi:'四柱由 lunar 历法库 <b>Solar→Lunar→EightChar</b> 推排；真太阳时按 <b>Cooper 公式时差</b> + 经度差(4分/度)校正（可关）；五行按干支纳音与各字五行统计；十神以日干为基准；大运起运岁数由 lunar 库给出（约数）；旺衰按四柱生克 + 月令提纲加权简析，属辅助判断非定论。',
    name:'康熙字典笔画（内置 500+ 字表，生僻字回退通用笔画）；五格 = <b>天格(姓+1)/人格(姓末+名首)/地格(名两字)/外格/总格</b> 按姓名学公式；数理吉凶查 <b>81 数表</b>；三才生克按五行。',
    chenggu:'称骨歌（袁天罡）按 <b>年/月/日/时 骨重</b> 逐柱累加得总骨重，再对照骨重断语分级。',
    ziwei:'命宫 = 寅起正月顺数至月、逆数至时辰；五行局由命宫纳音定；紫微星系逆布、天府星系顺布（天府在紫微对宫对称位）；辅星按时辰/年干安放；四化按年干；宫干支由命宫干支顺推；大限由五行局定起限岁、阳男阴女顺逆。',
    num:'八星数字按 <b>相邻两位组合查表</b>（数组双向有效，如 13/31 皆为天医）；吉凶为数字能量学传统说法，非历法推算。',
    zodiac:'十二地支 <b>六合/三合/六冲/六害/相刑</b> 关系，由地支序推得；缘分指数为综合评分。',
    star:'星座由生日真实推算（黄道区间）；幸运数/建议为按日期确定的固定项，非随机。',
    almanac:'宜忌/冲煞/彭祖百忌/喜财福神由 lunar 历法库 <b>getDayYi/getDayJi/getChongDesc/getPengZu</b> 等真实接口给出。',
    lucky:'幸运色/数字由日期或生日确定性推算（五行/天干），非随机。',
    cezi:'测字由 <b>cnchar 通用笔画</b> 取该字笔画数 n；五行按 <b>八十一数表</b> 尾数法则（1/2 木、3/4 火、5/6 土、7/8 金、9/0 水）归 n 之五行；吉凶查 <b>八十一数表</b> shuInfo(n) 得「吉/凶/平」与断语；签语由五行特质池确定性派生。笔画取自字形，非历法推算。',
    numerology:'生命灵数 = 出生年月日各位数字累减至 1–9（遇 11/22/33 保留为 master）；流年数 = 当年公元年数各位 + 生日月日各位累减归约；姓名灵数 = 各字 <b>cnchar 笔画</b>累减归约。三者均为确定性的数字推演，非历法、非随机。'
  };
  /* 典籍引句（仅选有确切出处的名句） */
  const QUOTES={
    bazi:'《滴天髓》云：欲识三元万法宗，先观帝载与神功。',
    iching:'《周易·系辞上》：一阴一阳之谓道，继之者善也，成之者性也。',
    liuyao:'《周易·系辞上》：易与天地准，故能弥纶天地之道。',
    meihua:'《周易·说卦》：观变于阴阳而立卦，发挥于刚柔而生爻。',
    qimen:'《阴符经》：观天之道，执天之行，尽矣。',
    hehun:'《周易·系辞下》：天地氤氲，万物化醇；男女构精，万物化生。',
    ziwei:'《道德经·四十二章》：道生一，一生二，二生三，三生万物。'
  };
  function maybeFold(){
    FOLD_PANELS.forEach(pid=>{
      const p=document.getElementById(pid); if(!p) return;
      const qt=QUOTES[pid];
      p.querySelectorAll('.result').forEach(r=>{
        /* 占位置（洗牌中/牌已铺开等引导语：.result 自身 style 带 muted 灰字）仅隐藏，不装饰、不弹窗 */
        if(/muted/i.test(r.getAttribute('style')||'')){ r.classList.add('is-source'); return; }
        /* 可信度标（结果顶部，落款/引句之前，每个结果仅一次） */
        if(!r.dataset.creded){
          const c=CRED[pid];
          if(c){
            r.dataset.creded='1';
            const chip=document.createElement('div');
            chip.className='cred '+c; chip.textContent=CRED_TXT[c];
            r.insertBefore(chip,r.firstChild);
          }
        }
        /* 推算方法元信息（历法/校正标注，专业可信度信号；每个结果仅一次；按类型区分，避免占卜模块误标为历法） */
        if(!r.dataset.metaed){
          r.dataset.metaed='1';
          const _c=CRED[pid]; const _sw=document.getElementById('useSolar'); const _solar=_sw?_sw.checked:false;
          let _meta='';
          if(_c==='det') _meta='lunar.js 真实历法推算'+(_solar?' · <b>真太阳时校正</b>':'');
          else if(_c==='calc') _meta='确定性算法推算（非历法、非随机）';
          if(_meta){
            const _m=document.createElement('div'); _m.className='rmeta';
            _m.innerHTML=_meta;
            const _cred=r.querySelector('.cred');
            r.insertBefore(_m, _cred?_cred.nextSibling:r.firstChild);
          }
        }
        /* 典籍引句（结果末尾，落款前） */
        if(qt && !r.dataset.quoted){
          r.dataset.quoted='1';
          const q=document.createElement('div');
          q.className='quote'; q.textContent=qt;
          r.appendChild(q);
        }
        /* 落款：朱砂玄印 + 签于日期（每个结果仅盖一次） */
        if(!r.dataset.sealed){
          r.dataset.sealed='1';
          const d=new Date();
          const sign=document.createElement('div');
          sign.className='result-sign';
          sign.innerHTML='<span class="rs-seal">玄</span><span>签于 '+d.getFullYear()+'年'+(d.getMonth()+1)+'月'+d.getDate()+'日</span>';
          r.appendChild(sign);
        }
        /* 推算依据（确定性模块可核验，每个结果仅一次） */
        if((CRED[pid]==='det'||CRED[pid]==='calc') && BASIS[pid] && !r.dataset.based){
          r.dataset.based='1';
          const det=document.createElement('details');
          det.className='basis';
          let _b=BASIS[pid];
          if(pid==='bazi'){ const _gz=[...r.querySelectorAll('.gz')].map(e=>e.textContent).join(' '); if(_gz) _b+='<br><b>本盘四柱</b>：'+_gz+'（由上述历法链路推得）'; }
          det.innerHTML='<summary>推算依据 · 链路</summary><div class="basis-body">'+_b+'</div>';
          r.appendChild(det);
        }
        if(!r.dataset.drawn){ r.dataset.drawn='1'; try{ enhanceCharts(r); }catch(e){} try{ enhanceType(r); }catch(e){} }
        if(r.dataset.folded!==undefined) return;
        /* 主测算结果：无论长短，完整解读只走弹窗——内联结果隐藏为弹窗源（面板下方不留任何内容 / 无预览 / 无按钮）。
           注意：结果写在 #xxxResult 容器内（.result 直接父是 *Result，而非面板 #xxx），
           而 data-readModal 标记打在面板 #xxx 上，故必须向上 closest 查找，不能只查 r.parentNode。 */
        if(r.closest && r.closest('[data-read-modal]')){
          r.classList.add('is-source');
          /* 异步弹窗：结果真正生成（含异步占卜）后才弹，避免弹到"洗牌中"占位置/空；
             每个节点仅弹一次（readOpened 守卫），切 tab 不重弹、重算新节点再弹。 */
          if(!r.dataset.readOpened){ r.dataset.readOpened='1'; openReadModal(r); }
          return;
        }
        const txt=(r.textContent||'').trim();
        if(txt.length<FOLD_CHARS) return;
        /* 其余结果（历史/搜索等）保留原有内联折叠 + 顶部按钮行为 */
        r.dataset.folded='0'; r.classList.add('foldable');
        const btn=document.createElement('button');
        btn.className='read-toggle fold-toggle'; btn.textContent='查看完整解读';
        btn.onclick=()=>openReadModal(r);
        const tools=document.createElement('div'); tools.className='result-tools'; tools.appendChild(btn);
        const hEl=r.querySelector('h3,h4,h5');
        if(hEl){
          const wrap=document.createElement('div'); wrap.className='result-head';
          hEl.parentNode.insertBefore(wrap, hEl);
          wrap.appendChild(hEl); wrap.appendChild(tools);
        } else {
          r.insertBefore(tools, r.firstChild);
        }
      });
    });
  }
  maybeFold();
  /* 用 MutationObserver 替代 setInterval 轮询：仅在结果 DOM 新增/变化时装饰（childList 不含 attributes，
     故点击展开 <details> 不会触发重跑），且装饰期间断开观察避免自触发；彻底消除每 700ms 强制 reflow 的卡顿。 */
  let _mfTimer=0;
  const _mfObs=new MutationObserver(()=>{
    if(_mfTimer) return;
    _mfTimer=setTimeout(()=>{
      _mfTimer=0;
      _mfObs.disconnect();
      maybeFold();
      _mfObs.observe(document.body,{childList:true,subtree:true});
    },140);
  });
  /* 流派共识度元判断（② 差异化）：扫描已渲染的 det 结果，给出多流派当前流年共识 */
  window.appendConsensus=function(baziRes){
    if(!baziRes) return;
    const schools=[{n:'八字',s:baziRes.dataset.sentiment||'平'}];
    ['ziwei','qimen'].forEach(pid=>{ const el=document.querySelector('#'+pid+'Result .result'); if(el&&el.dataset.school) schools.push({n:el.dataset.school,s:el.dataset.sentiment||'平'}); });
    const ji=schools.filter(x=>x.s==='吉').length, xiong=schools.filter(x=>x.s==='凶').length;
    const verdict=ji>xiong?'偏吉':xiong>ji?'偏凶':'中和';
    // —— C 三盘共识调和：当八字/紫微/奇门吉凶分歧，给出确定性的"以何为准" ——
    let tune='';
    if(schools.length>=2){
      if(ji>0 && xiong>0){
        const goodN=schools.filter(x=>x.s==='吉').map(x=>x.n).join('、');
        const badN=schools.filter(x=>x.s==='凶').map(x=>x.n).join('、');
        tune='三盘互参 · 以何为准：'+goodN+'偏吉、'+badN+'偏凶，结论有分歧——八字定命局底子与长期喜忌，紫微看后天运势与性格机遇，奇门看具体时空可否行动。三者冲突时：长期方向听八字，当下择时取舍看奇门，机遇短板看紫微；先守大运流年之稳，再借奇门择吉、紫微补短板，莫因一时之凶自乱阵脚。';
      } else {
        tune='三盘同气（'+verdict+'），结论相互印证、较可信；照此方向行止即可。';
      }
    }
    let html='<div class="consensus"><div class="consensus-h">多流派共识 · 当前流年</div><div class="consensus-b">';
    schools.forEach(x=>{ const c=x.s==='吉'?'var(--good)':x.s==='凶'?'var(--bad)':'var(--muted)'; html+='<span class="cons-item"><b style="color:'+c+'">'+x.n+'</b>'+x.s+'</span>'; });
    html+='</div><div class="consensus-v">综合判断：<b>'+verdict+'</b>'+(schools.length<3?'（运行紫微 / 奇门可看更全共识）':'')+'</div>';
    if(tune) html+='<div class="consensus-tune">'+tune+'</div>';
    html+='</div>';
    const wrap=document.createElement('div'); wrap.innerHTML=html; const node=wrap.firstChild;
    const old=baziRes.querySelector('.consensus'); if(old) old.remove();
    baziRes.appendChild(node);
  };
  _mfObs.observe(document.body,{childList:true,subtree:true});

  /* 图表自绘：给结果内 SVG 形状打 pathLength=1 + fx-draw/fx-pop，线条徐徐画成 */
  function enhanceCharts(r){
    if(typeof window.matchMedia==='function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let si=0;
    r.querySelectorAll('svg').forEach(svg=>{
      if(svg.getAttribute('data-nofx')) return;   // 星图/命盘自带编排动画，跳过通用自绘
      const els=svg.querySelectorAll('polygon,polyline,path,line,circle,rect,ellipse');
      const n=els.length||1;
      // 逐笔错落：单图铺开锁在 ~520ms（比压缩版慢一档，呼应整体「节奏慢」），元素越多单步越密；
      // 多图之间再依次错开，形成"一张张画过去"
      const step=Math.min(30, 520/n);
      const base=si*130; si++;
      els.forEach((el,i)=>{
        try{ el.setAttribute('pathLength','1'); }catch(e){}
        el.style.setProperty('--d',((base+i*step)/1000).toFixed(3)+'s');
        const tag=(el.tagName||'').toLowerCase();
        // 长轮廓运笔久、短弧收笔快，让书写仍有轻重缓急（本轮回调到更舒缓的档位）
        const dur=(tag==='polygon'||tag==='path'||tag==='polyline')?.98
                 :(tag==='circle'||tag==='ellipse')?.7:.82;
        el.style.setProperty('--dur',dur+'s');
        el.classList.add('fx-draw');
        const f=el.getAttribute('fill');
        if(f && f!=='none' && f!=='transparent') el.classList.add('fx-pop');
      });
    });
  }

  /* 逐字题写 + 数字滚动 */
  function enhanceType(r){
    if(typeof window.matchMedia==='function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // 判词与印签一字一字浮出，如落笔题款（CSS 动画，会被 fx-hold 一并按住）
    // 文档顺序即视觉顺序：先落印签，再题判词
    r.querySelectorAll('.sc-seal, .sc-verdict p:first-child').forEach((el,gi)=>{
      if(el.dataset.tw) return;
      const t=el.textContent||'';
      if(!t.trim() || t.length>44) return;      // 过长的段落不逐字，避免拖沓
      el.dataset.tw='1'; el.classList.add('tw'); el.textContent='';
      // 字距 55ms→32ms、组间 450ms→260ms：题字仍有笔序感，但不再让人等
      const base=0.1+gi*0.26;
      Array.prototype.forEach.call(t,(ch,i)=>{
        const s=document.createElement('i');
        s.textContent=ch;
        s.style.setProperty('--d',(base+i*0.032).toFixed(3)+'s');
        el.appendChild(s);
      });
    });

    // 数字滚动：rAF 不受 CSS 暂停约束，故揭幕期间延后启动（跟随叙事实际时长）
    const pan=r.closest ? r.closest('.panel') : null;
    const _bl=pan?pan.querySelector('.ink-bloom'):null;
    const delay=_bl ? (parseInt(_bl.dataset.dur,10)||1240)+140 : 300;
    r.querySelectorAll('.lucknum').forEach(el=>{
      if(el.dataset.cu) return; el.dataset.cu='1';
      const first=el.firstChild;
      if(!first || first.nodeType!==3) return;
      const to=parseInt(el.dataset.to || (first.nodeValue||'').replace(/[^0-9]/g,''),10);
      if(!isFinite(to) || to<=0) return;
      first.nodeValue='0';
      setTimeout(()=>{
        const dur=1000, t0=(typeof performance!=='undefined'&&performance.now)?performance.now():Date.now();
        const tick=(now)=>{
          const n=(typeof now==='number')?now:Date.now();
          const p=Math.min(1,(n-t0)/dur);
          first.nodeValue=String(Math.round(to*(1-Math.pow(1-p,3))));   // ease-out cubic
          if(p<1 && typeof requestAnimationFrame==='function') requestAnimationFrame(tick);
          else first.nodeValue=String(to);
        };
        if(typeof requestAnimationFrame==='function') requestAnimationFrame(tick);
        else first.nodeValue=String(to);
      },delay);
    });

    // 结果子块逐层沉降：标签/药丸之外，按文档顺序错落显影（墨一层层洇开，而非整屏同弹）
    // 已自带时序的元素（如逐字题款 .sc-seal）保留其 --d，不被覆盖
    const _blocks=Array.prototype.filter.call(r.children,k=>!k.classList.contains('tag')&&!k.classList.contains('pill'));
    _blocks.forEach((k,i)=>{
      if(k.style.getPropertyValue('--d')) return;
      k.style.setProperty('--d',(Math.min(i,14)*0.058).toFixed(3)+'s');
    });
  }
})();

/* ===== 全局高级动效：生成揭幕 + 墨晕 + 3D 倾斜（惊艳感升级） ===== */
(function(){
  const REDUCE = (typeof window.matchMedia==='function') && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== 生成揭幕：墨滴落纸 → 洇开 → 成星图（连续叙事） =====
     坐标系与正文星图完全一致（560×470 / 中心 280,232 / 星轨 126 / 支环 200），
     故墨渍散去的一刻，叙事星图与真实星图形态重合——像同一张图落进了页面。 */
  const SAGA_PIDS={bazi:1,ziwei:1};                 // 结果含星图的面板才演到「成象」
  const SAGA_A=[-108,-72,-18,18,72,108,162,198];    // 与正文八星同角度（四柱×干支，各偏 ∓18°）

  /* 不规则墨渍轮廓：极坐标抖动 + Catmull-Rom 闭合，模拟宣纸吃墨的毛边 */
  function blotPath(cx,cy,r,seed){
    let s=seed>>>0;
    const rnd=()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; };
    const N=12, p=[];
    for(let i=0;i<N;i++){
      const a=i/N*Math.PI*2, rr=r*(0.78+rnd()*0.44);
      p.push([cx+rr*Math.cos(a), cy+rr*Math.sin(a)]);
    }
    let d='M'+p[0][0].toFixed(1)+' '+p[0][1].toFixed(1);
    for(let i=0;i<N;i++){
      const a=p[(i-1+N)%N], b=p[i], c=p[(i+1)%N], e=p[(i+2)%N];
      d+='C'+(b[0]+(c[0]-a[0])/6).toFixed(1)+' '+(b[1]+(c[1]-a[1])/6).toFixed(1)
        +','+(c[0]-(e[0]-b[0])/6).toFixed(1)+' '+(c[1]-(e[1]-b[1])/6).toFixed(1)
        +','+c[0].toFixed(1)+' '+c[1].toFixed(1);
    }
    return d+'Z';
  }

  function sagaSvg(full,seed){
    const CX=280, CY=232;
    let s=seed>>>0;
    const rnd=()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; };
    let g='';
    // 幕三 洇开：三层墨渍铺底（外淡 → 主渍 → 深核）
    g+='<path class="sg-blot b2" d="'+blotPath(CX,CY,150,seed^0x9e3779b9)+'"/>';
    g+='<path class="sg-blot b1" d="'+blotPath(CX,CY,150,seed^0x85ebca6b)+'"/>';
    g+='<path class="sg-blot b3" d="'+blotPath(CX,CY,150,seed^0xc2b2ae35)+'"/>';
    // 幕二 触纸：冲击环 + 溅点
    g+='<circle class="sg-shock" cx="'+CX+'" cy="'+CY+'" r="110"/>';
    for(let i=0;i<6;i++){
      const a=rnd()*Math.PI*2, dist=46+rnd()*60;
      g+='<circle class="sg-splash" cx="'+CX+'" cy="'+CY+'" r="'+(1.7+rnd()*2.3).toFixed(1)+'" '
        +'style="--dx:'+(dist*Math.cos(a)).toFixed(1)+'px;--dy:'+(dist*Math.sin(a)).toFixed(1)+'px;'
        +'--sd:'+(rnd()*0.12).toFixed(3)+'s"/>';
    }
    // 幕一 落墨：悬滴（落地后被墨渍吸收）
    g+='<ellipse class="sg-drop" cx="'+CX+'" cy="'+CY+'" rx="7" ry="7"/>';
    // 幕四 成象：支环 → 连线 → 八星自墨中析出 → 日主点亮
    if(full){
      g+='<circle class="sg-ring" cx="'+CX+'" cy="'+CY+'" r="200" pathLength="1"/>';
      SAGA_A.forEach((deg,i)=>{
        const a=deg*Math.PI/180, x=CX+126*Math.cos(a), y=CY+126*Math.sin(a);
        g+='<line class="sg-link" x1="'+CX+'" y1="'+CY+'" x2="'+x.toFixed(1)+'" y2="'+y.toFixed(1)+'" '
          +'pathLength="1" stroke="var(--ink)" stroke-opacity=".34" stroke-width="1.1" '
          +'style="--d:'+(i*0.045).toFixed(3)+'s"/>';
        g+='<g class="sg-star" style="--tx:'+(x-CX).toFixed(1)+'px;--ty:'+(y-CY).toFixed(1)+'px;'
          +'--d:'+(i*0.056).toFixed(3)+'s">'
          +'<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="21" fill="none" stroke="var(--ink)" stroke-opacity=".2"/>'
          +'<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="16" fill="var(--ink)" fill-opacity=".14" stroke="var(--ink)" stroke-opacity=".55" stroke-width="1.2"/>'
          +'</g>';
      });
      g+='<g class="sg-core">'
        +'<circle cx="'+CX+'" cy="'+CY+'" r="54" fill="var(--ink)" fill-opacity=".07"/>'
        +'<circle cx="'+CX+'" cy="'+CY+'" r="38" fill="none" stroke="var(--ink)" stroke-opacity=".28" stroke-dasharray="2 5"/>'
        +'<circle cx="'+CX+'" cy="'+CY+'" r="31" fill="var(--ink)" fill-opacity=".16" stroke="var(--ink)" stroke-opacity=".72" stroke-width="1.6"/>'
        +'</g>';
    }
    return '<svg class="saga-svg" viewBox="0 0 560 470" aria-hidden="true">'+g+'</svg>';
  }

  // 揭幕题款诗词池：反复测算时随机抽一句，须足够大才不会很快撞重复。
  // 主题覆盖 道/易/医/兵/禅/儒，风格统一为「四言·四言」对仗。
  const BLOOM_LINES=[
    '观天之道 · 执天之行','推五运 · 定六气','格物致知 · 以观其徼','一阴一阳 · 之谓道',
    '道法自然 · 无为而治','上善若水 · 利万物而不争','致虚极 · 守静笃','反者道之动 · 弱者道之用',
    '穷则变 · 变则通','观乎天文 · 以察时变','刚柔相推 · 而生变化','履霜坚冰 · 阴始凝也',
    '君子藏器 · 待时而动','知几其神 · 见微知著','亢龙有悔 · 盈不可久','厚德载物 · 生生不息',
    '精诚所至 · 金石为开','心若止水 · 静水流深','抱朴守拙 · 和光同尘','见素抱朴 · 少私寡欲',
    '大音希声 · 大象无形','既以为人 · 己愈有','静以修身 · 俭以养德','运筹帷幄 · 决胜千里',
    '天时地利 · 人和为贵','金声玉振 · 文以载道','探赜索隐 · 钩深致远','观海者难为水 · 游圣门难为言'
  ];
  let lastBloomLine='';
  /* 焚香仪式：推算类测算的开场（首测约1s、重复测算约0.6s，点任意处跳过，尊重 reduced-motion）
     与墨滴揭幕分工：焚香管"动作开场"，墨滴管"结果出场"。 */
  function incenseRitual(panel, cb){
    if(typeof window.matchMedia==='function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches){ cb(); return; }
    const old=panel.querySelector('.incense'); if(old) old.remove();
    const rep=panel.dataset.saga==='1';
    const el=document.createElement('div'); el.className='incense';
    el.innerHTML='<div class="inc-scene">'
      +'<svg class="inc-smoke" viewBox="0 0 212 232" aria-hidden="true">'
      +'<path class="sm-a" d="M106 186 C 74 162, 138 132, 106 106 C 82 86, 130 60, 106 38 C 95 26, 116 12, 106 3"/>'
      +'<path class="sm-b" d="M106 186 C 126 164, 86 132, 106 108 C 122 88, 92 66, 106 46 C 114 34, 98 20, 106 8"/>'
      +'<path class="sm-c" d="M106 186 C 96 166, 118 146, 106 126 C 96 108, 116 92, 106 76 C 98 64, 112 48, 106 34"/>'
      +'</svg>'
      +'<div class="inc-stick"><span class="inc-ash"></span><i class="inc-ember"></i></div>'
      +'</div>'
      +'<div class="inc-line">心<br>诚<br>则<br>灵</div>'
      +'<div class="inc-skip">点按任意处 · 即刻启卦</div>';
    panel.appendChild(el);
    try{ sfx('incense'); }catch(e){}
    let done=false;
    const finish=()=>{
      if(done) return; done=true;
      clearTimeout(t);
      el.style.transition='opacity .32s ease'; el.style.opacity='0';
      setTimeout(()=>{ if(el.parentNode) el.remove(); cb(); },330);
    };
    el.onclick=finish;
    const t=setTimeout(finish, rep?620:980);
  }
  function inkBloom(panel,pid){
    if(!panel) return null;
    const old=panel.querySelector('.ink-bloom'); if(old) old.remove();
    const el=document.createElement('div'); el.className='ink-bloom saga';
    const full=!!SAGA_PIDS[pid];
    // 同一面板重复测算：负时间偏移跳过悬滴下坠段，直奔落纸，避免反复等同一幕
    const rep=panel.dataset.saga==='1';
    if(rep) el.style.setProperty('--t0','-0.5s');
    panel.dataset.saga='1';

    const seed=((Date.now()&0xffffff)^((pid||'').length*2654435761))>>>0;
    // 抽句时排除上一句，连续两次测算不会撞同一句
    let _bi; do{ _bi=Math.floor(Math.random()*BLOOM_LINES.length); }while(BLOOM_LINES.length>1 && BLOOM_LINES[_bi]===lastBloomLine);
    lastBloomLine=BLOOM_LINES[_bi];
    // 分幕字幕 --d 须与 CSS 中 sgCap 的起播点同步放大（叙事拉长）
    const caps=full?[['落墨','0.10s'],['洇开','0.66s'],['成象','1.22s']]
                   :[['落墨','0.10s'],['洇开','0.63s']];
    el.innerHTML=sagaSvg(full,seed)
      +'<div class="saga-cap">'+caps.map(c=>'<span style="--d:'+c[1]+'">'+c[0]+'</span>').join('')+'</div>'
      +'<div class="bloom-s">'+lastBloomLine+'</div>';
    // 叙事总长（供释放时机对齐）：完整版演到成象，简版止于洇开
    // 980/660 → 2000/1400（用户要「叙事长」，整体时长×约2）；重复测算再 -500ms 跳过下坠段。
    // 日主大星(1.30s起/0.7s长)会在淡出期间收尾，这个重叠恰好构成「墨散·图显」的交接。
    el.dataset.dur=String((full?2600:1900)-(rep?500:0));
    panel.appendChild(el); if(window.holdAmbient) window.holdAmbient(); return el;
  }
  function wrapCompute(){
    // 占卜类面板（抽牌/摇签/起卦）：自带仪式感，跳过墨滴揭幕，点击即出结果
    const DIV_PIDS=new Set(['tarot','guanyin','dream','liuyao','meihua','iching','hehun','qimen','runes','lenormand','numerology']);
    document.querySelectorAll('button[id]').forEach(b=>{
      const m=/^(.+)Btn$/.exec(b.id); if(!m) return;
      /* 面板用 closest 向上查找：按钮 id 基名未必等于面板 id（如 runeBtn→#runes、numoBtn→#numerology），
         用 getElementById 会落空、data-read-modal 漏打、结果不弹窗。改为就近找祖先 .card.panel。 */
      const panel=b.closest('.card.panel'); if(!panel) return;
      panel.dataset.readModal='1';
      if(typeof b.onclick!=='function') return;
      const orig=b.onclick;
      b.onclick=(e)=>{
        // 点击测算 → 计算执行；结果（含异步占卜）真正生成后由 maybeFold 异步弹窗。
        // 此处先把已生成节点立即隐藏为弹窗源，消除面板短暂闪现的闪烁（占位置 style 带 muted 同样隐藏）。
        try{ orig.call(b,e); }catch(err){ console.error(err); }
        const _r0=panel.querySelector('.result'); if(_r0) _r0.classList.add('is-source');
      };
    });
  }

  /* 墨晕微交互：按钮/标签点击扩散 */
  function wireRipple(){
    document.querySelectorAll('.btn, .tab, .cat, .theme-switch button').forEach(b=>{
      b.addEventListener('click',e=>{
        const r=b.getBoundingClientRect(); if(!r.width) return;
        const size=Math.max(r.width,r.height);
        const rip=document.createElement('span'); rip.className='ripple';
        rip.style.width=rip.style.height=size+'px';
        rip.style.left=(e.clientX-r.left-size/2)+'px';
        rip.style.top=(e.clientY-r.top-size/2)+'px';
        b.appendChild(rip); setTimeout(()=>rip.remove(),620);
      });
    });
  }

  /* 卡片光泽跟随指针（仅精确指针设备）：只喂 --mx/--my，不倾斜——安静地让宣纸被光照到 */
  function wireGlare(){
    if(typeof window.matchMedia!=='function' || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    document.querySelectorAll('.card').forEach(c=>{
      let rx=0,ry=0,raf=0;
      c.addEventListener('pointermove',e=>{
        const r=c.getBoundingClientRect(); if(!r.width) return;
        rx=(e.clientX-r.left)/r.width*100; ry=(e.clientY-r.top)/r.height*100;
        if(!raf) raf=requestAnimationFrame(()=>{ raf=0;
          c.style.setProperty('--mx',rx.toFixed(1)+'%');
          c.style.setProperty('--my',ry.toFixed(1)+'%');
        });
      },{passive:true});
    });
  }

  /* 背景视差：把滚动量喂给 CSS，让墨纹与太极慢于内容移动，制造景深 */
  function wireParallax(){
    const RAF=typeof requestAnimationFrame==='function';
    let raf=0;
    const upd=()=>{ raf=0;
      const y=window.scrollY||window.pageYOffset||0;
      document.documentElement.style.setProperty('--sy',String(Math.round(y)));
    };
    window.addEventListener('scroll',()=>{ if(RAF){ if(!raf) raf=requestAnimationFrame(upd); } else upd(); },{passive:true});
    upd();
  }

  /* 氛围粒子层：极淡金尘（浅色）/星点（暗色）缓慢浮动，制造呼吸感（对标 tianji #bg-canvas / 星谕塔罗星空） */
  function wireAmbient(){
    if(typeof window.matchMedia==='function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c=document.createElement('canvas'); c.id='ambient';
    document.body.appendChild(c);
    const ctx=c.getContext('2d'); if(!ctx) return;
    const RAF=typeof requestAnimationFrame==='function';
    let W=0,H=0,DPR=Math.min(2,window.devicePixelRatio||1),parts=[],raf=0,last=0,paused=false,scrolling=false,st=0;
    function size(){ W=window.innerWidth; H=window.innerHeight;
      c.width=Math.round(W*DPR); c.height=Math.round(H*DPR);
      c.style.width=W+'px'; c.style.height=H+'px';
      ctx.setTransform(DPR,0,0,DPR,0,0);
      const n=Math.max(18,Math.min(40,Math.round(W*H/36000)));
      parts=[]; for(let i=0;i<n;i++) parts.push(spawn());
    }
    function spawn(){ return {x:Math.random()*W,y:Math.random()*H,
      r:Math.random()*1.3+0.4, vy:-(Math.random()*0.16+0.04), vx:(Math.random()-0.5)*0.08,
      a:Math.random()*0.5+0.25, tw:Math.random()*6.283, ts:Math.random()*0.018+0.007}; }
    function isDark(){ return document.body.classList.contains('theme-dark'); }
    function frame(t){ raf=RAF?requestAnimationFrame(frame):0;
      if(paused||scrolling||document.hidden) return;
      if(t-last<50) return; last=t;
      ctx.clearRect(0,0,W,H);
      const col=isDark()?[240,230,205]:[201,164,92];
      for(const p of parts){
        p.y+=p.vy; p.x+=p.vx; p.tw+=p.ts;
        if(p.y<-4){ p.y=H+4; p.x=Math.random()*W; }
        if(p.x<-4) p.x=W+4; else if(p.x>W+4) p.x=-4;
        const al=p.a*(0.6+0.4*Math.sin(p.tw));
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.2832);
        ctx.fillStyle='rgba('+col[0]+','+col[1]+','+col[2]+','+al.toFixed(3)+')';
        ctx.fill();
      }
    }
    size(); window.addEventListener('resize',size,{passive:true});
    window.addEventListener('scroll',()=>{ scrolling=true; clearTimeout(st); st=setTimeout(()=>scrolling=false,200); },{passive:true});
    document.addEventListener('visibilitychange',()=>{ if(document.hidden){ if(raf) cancelAnimationFrame(raf); raf=0; } else { last=0; if(RAF) raf=requestAnimationFrame(frame); } });
    window.setAmbientPaused=function(v){ paused=!!v; };
    window.__ambientHold=0;
    window.holdAmbient=function(){ window.__ambientHold++; window.setAmbientPaused(true); };
    window.releaseAmbient=function(){ window.__ambientHold=Math.max(0,window.__ambientHold-1); if(!window.__ambientHold) window.setAmbientPaused(false); };
    if(RAF) raf=requestAnimationFrame(frame); else frame(0);
  }

  if(!REDUCE){ wireRipple(); wireGlare(); wireParallax(); wireAmbient(); }
  wrapCompute();
})();

/* 回到顶部（滚动显示，平滑显隐） */
(function(){
  const t=document.getElementById('toTop');
  if(!t) return;
  t.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
  window.addEventListener('scroll',()=>{ t.classList.toggle('show',window.scrollY>320); },{passive:true});
})();

/* ---------- 塔罗牌面（RWS 风格象征 SVG，78 张） ---------- */
const SUIT_CN={'权杖':'火','圣杯':'水','宝剑':'风','星币':'土'};
const SUIT_COLOR={'权杖':'#c29a90','圣杯':'#9aa6b0','宝剑':'#b8b2a6','星币':'#9aab95'};
function tarotNameParts(n){ if(/^\d/.test(n)) return {major:true,label:n}; const sp=n.split(' '); return {major:false,suit:sp[0],rank:sp[1]}; }
/* 22 张大阿尔克那：按韦特(RWS)经典意象绘制场景化图案（22 张各有独立构图） */
function majorArt(num){
  const G='#e9c479', R='#c24234', B='#7aa0d8', W='#f6efdc', D='#cfcfc2', Gg='#8fa884', T='#c9975e', E='#b39ac9', S='#6e5b8a';
  const sk='#e8c49b', sk2='#e0b288';
  const sg='stroke="'+G+'" stroke-width="1.4"';
  const sw='stroke="'+W+'" stroke-width="1.5"';
  const sb='stroke="'+B+'" stroke-width="1.5"';
  const sd='stroke="'+D+'" stroke-width="1.3"';
  const st='stroke="'+T+'" stroke-width="1.4"';
  const sun=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${G}" opacity=".95"/>`+[0,45,90,135,180,225,270,315].map(a=>`<line x1="${x}" y1="${y}" x2="${(x+Math.cos(a*Math.PI/180)*r*1.7).toFixed(1)}" y2="${(y+Math.sin(a*Math.PI/180)*r*1.7).toFixed(1)}" stroke="${G}" stroke-width="1.2" opacity=".75"/>`).join('');
  const moon=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${G}"/><circle cx="${(x-r*0.3).toFixed(1)}" cy="${(y-r*0.25).toFixed(1)}" r="${r}" fill="#0f2a33"/>`;
  const star5=(x,y,s,col)=>{let p='';for(let i=0;i<10;i++){const a=-90+i*36,rad=i%2?s*0.45:s;p+=`${i?'L':'M'}${(x+Math.cos(a*Math.PI/180)*rad).toFixed(1)} ${(y+Math.sin(a*Math.PI/180)*rad).toFixed(1)} `;}return `<path d="${p}Z" fill="${col}"/>`;};
  const star4=(x,y,s,col)=>`<path d="M${x} ${(y-s).toFixed(1)} L${(x+s*0.3).toFixed(1)} ${(y-s*0.3).toFixed(1)} L${(x+s).toFixed(1)} ${y} L${(x+s*0.3).toFixed(1)} ${(y+s*0.3).toFixed(1)} L${x} ${(y+s).toFixed(1)} L${(x-s*0.3).toFixed(1)} ${(y+s*0.3).toFixed(1)} L${(x-s).toFixed(1)} ${y} L${(x-s*0.3).toFixed(1)} ${(y-s*0.3).toFixed(1)} Z" fill="${col}"/>`;
  const cloud=(x,y,s,o)=>`<g fill="${W}" opacity="${o||0.9}"><ellipse cx="${x}" cy="${y}" rx="${s*1.7}" ry="${s*0.7}"/><ellipse cx="${(x-s*1.1).toFixed(1)}" cy="${(y+s*0.25).toFixed(1)}" rx="${s}" ry="${s*0.55}"/><ellipse cx="${(x+s*1.1).toFixed(1)}" cy="${(y+s*0.25).toFixed(1)}" rx="${s}" ry="${s*0.55}"/><ellipse cx="${(x-s*0.5).toFixed(1)}" cy="${(y-s*0.35).toFixed(1)}" rx="${s*0.7}" ry="${s*0.5}"/><ellipse cx="${(x+s*0.5).toFixed(1)}" cy="${(y-s*0.35).toFixed(1)}" rx="${s*0.7}" ry="${s*0.5}"/></g>`;
  const mtn=(x,y,w,h)=>`<path d="M${x} ${y} l${(w/2)} -${h} l${(w/2)} ${h} Z" fill="none" ${sd} opacity=".8"/>`;
  const pillar=(x,top,bot)=>`<rect x="${x}" y="${top}" width="10" height="${bot-top}" fill="url(#hxGold)" opacity=".28"/><rect x="${x}" y="${top}" width="10" height="${bot-top}" fill="none" ${sg}/><rect x="${(x-2)}" y="${(top-4)}" width="14" height="5" rx="1.5" fill="none" ${sg}/><rect x="${(x-2)}" y="${(bot-1)}" width="14" height="5" rx="1.5" fill="none" ${sg}/>`;
  // 简化人物：头+躯干+双臂+腿；座下可选翼/披风/长袍
  const fig=(cx,torsoY,skin)=>`<g><circle cx="${cx}" cy="${torsoY-16}" r="9" fill="${skin}"/><path d="M${cx-9} ${torsoY} q9 -7 18 0 l-2 34 q-7 4 -14 0 z" fill="${skin}" stroke="${G}" stroke-width="1.2"/><line x1="${cx-9}" y1="${torsoY+2}" x2="${(cx-20)}" y2="${(torsoY+22)}" stroke="${G}" stroke-width="2.4"/><line x1="${cx+9}" y1="${torsoY+2}" x2="${(cx+20)}" y2="${(torsoY+22)}" stroke="${G}" stroke-width="2.4"/><line x1="${cx-4}" y1="${torsoY+34}" x2="${(cx-5)}" y2="${(torsoY+58)}" stroke="${G}" stroke-width="4"/><line x1="${cx+4}" y1="${torsoY+34}" x2="${(cx+5)}" y2="${(torsoY+58)}" stroke="${G}" stroke-width="4"/></g>`;
  const robe=(cx,torsoY,skin,color)=>`<g><circle cx="${cx}" cy="${torsoY-16}" r="9" fill="${skin}"/><path d="M${cx-11} ${torsoY} q5 -4 11 -2 q6 -2 11 2 l3 32 q-11 6 -14 0 q-3 6 -14 0 z" fill="${color}" stroke="${G}" stroke-width="1.3"/><path d="M${cx-11} ${torsoY} q5 -4 11 -2 q6 -2 11 2" fill="none" stroke="${G}" stroke-width="1" opacity=".6"/></g>`;
  const headOnly=(cx,cy,skin)=>`<circle cx="${cx}" cy="${cy}" r="9" fill="${skin}"/>`;
  /* 简化鸟兽：犬 / 狮 / 马 / 翼 */
  const dog=(x,top,scale)=>`<g stroke="${G}" stroke-width="1.4" fill="none" transform="translate(${x},${top}) scale(${scale})"><path d="M0 0 q-6 2 -11 -2"/><ellipse cx="6" cy="2" rx="9" ry="5" fill="${G}" opacity=".55"/><path d="M7 -1 l3 -4 M9 1 l4 -2"/><path d="M14 4 l0 10 M6 6 l-2 9 M16 6 l2 9"/></g>`;
  const lionHead=(x,y,s)=>`<g><circle cx="${x}" cy="${y}" r="${s}" fill="${G}" opacity=".8"/><circle cx="${(x-s*0.5).toFixed(1)}" cy="${y}" r="${s}" fill="${G}" opacity=".4"/><circle cx="${(x+s*0.5).toFixed(1)}" cy="${y}" r="${s}" fill="${G}" opacity=".4"/><circle cx="${x}" cy="${y}" r="${(s*0.5).toFixed(1)}" fill="#0f2a33"/></g>`;
  const sphinx=(x,y,s,flip)=>`<g transform="translate(${x},${y}) scale(${flip?-1:1} ${s})" stroke="${G}" stroke-width="1.4" fill="none"><circle cx="18" cy="-6" r="6" fill="${G}" opacity=".5"/><path d="M-14 8 q14 -10 26 0 l3 8 q-6 2 -12 0 M-8 8 l4 12 M8 8 l-3 12"/></g>`;
  const wing=(x,y,s,flip)=>`<path d="M${x} ${y} q${flip?-s:0} ${-s*1.2} ${flip?-s*2.4:-s*2.4} ${-s*0.3} M${x} ${y} q${flip?-s*0.7:0} ${-s*0.8} ${flip?-s*1.7:-s*1.7} ${-s*0.2}" fill="none" ${sg} opacity=".8"/>`;
  const A=[
    /* 0 愚者：崖边少年·小白犬·白玫瑰·旭日 */
    '<path d="M36 212 L164 212 L150 190 L50 190 Z" fill="rgba(233,196,121,.10)"/>'
    +`${sun(138,74,14)}<path d="M50 190 q40 -34 114 -30" fill="none" ${sg} opacity=".5"/>`
    +`<g><circle cx="96" cy="128" r="9" fill="${sk}"/><path d="M88 142 q8 -6 16 0 l-2 40 q-6 4 -12 0 z" fill="${G}" stroke="${G}" stroke-width="1.2"/><line x1="88" y1="143" x2="72" y2="170" stroke="${G}" stroke-width="2.4"/><circle cx="69" cy="174" r="4" fill="${W}"/><line x1="104" y1="143" x2="112" y2="170" stroke="${G}" stroke-width="2.4"/><line x1="94" y1="182" x2="90" y2="206" stroke="${G}" stroke-width="3.6"/><line x1="98" y1="182" x2="102" y2="206" stroke="${G}" stroke-width="3.6"/><line x1="88" y1="180" x2="72" y2="206" stroke="${G}" stroke-width="3"/><line x1="90" y1="180" x2="72" y2="196" stroke="${G}" stroke-width="3"/></g>`
    +`<path d="M40 206 L68 206" stroke="${G}" stroke-width="1.4"/><path d="M40 206 l3 -6 M44 206 l-3 -6" stroke="${G}" stroke-width="1.4"/>`
    +`${dog(128,196,1)}<circle cx="60" cy="120" r="3" fill="${R}"/>`,
    /* 1 魔术师：朝上一手指天下、一手指地·桌上四元素·∞ */
    `${fig(100,140,sk)}<line x1="100" y1="96" x2="100" y2="52" stroke="${G}" stroke-width="1.6"/><path d="M100 52 q8 -6 16 0" fill="none" ${sg}/><line x1="100" y1="140" x2="100" y2="178" stroke="${G}" stroke-width="1.4"/>`
    +`<g transform="rotate(180 100 128)"><path d="M100 128 q-26 0 -34 -34 M100 128 q26 0 34 -34" fill="none" ${sg} opacity=".85"/></g>`
    +`<rect x="66" y="168" width="68" height="26" rx="6" fill="none" ${sg}/><circle cx="82" cy="181" r="6" fill="none" ${sg}/><path d="M82 177 l4 -6 M82 177 l-4 -6 M82 177 l0 6" stroke="${G}" stroke-width="1.4"/><text x="100" y="185" fill="${R}" font-size="11" text-anchor="middle">♂</text><path d="M116 175 l4 6 M116 175 l-4 6 M114 181 l4 0 M114 181 l4 -10" stroke="${B}" stroke-width="1.3"/><rect x="122" y="173" width="8" height="8" fill="none" ${sg}/>`
    +`<path d="M72 168 q6 -8 14 0" fill="none" ${sw} opacity=".6"/><path d="M114 168 q6 -8 14 0" fill="none" ${sw} opacity=".6"/>`
    +`<path d="M56 206 L66 196 L74 206 L84 196 L92 206 L100 196 L108 206 L118 196 L126 206 L136 196 L144 206" fill="none" ${sg} opacity=".6"/>`,
    /* 2 女祭司：双柱·月冠·卷轴·脚下月 */
    `${pillar(64,84,214)}${pillar(126,84,214)}`
    +`<rect x="64" y="80" width="10" height="22" fill="none" ${sg}/><rect x="126" y="80" width="10" height="22" fill="none" ${sg}/><rect x="68" y="72" width="3" height="10" fill="${G}"/><rect x="129" y="72" width="3" height="10" fill="${G}"/>`
    +`<path d="M74 214 L126 214" stroke="${G}" stroke-width="1.6"/>`
    +`<text x="100" y="105" fill="${B}" font-size="13" text-anchor="middle">♌</text><text x="100" y="105" fill="none"/>`
    +`${robe(100,118,sk,B)}<path d="M92 96 l8 -6 l8 6" fill="none" ${sg}/><path d="M92 96 l8 -28 l8 28" fill="none" ${sg}/>`
    +`<rect x="90" y="140" width="20" height="34" fill="none" ${sg}/><path d="M94 148 l12 6 M94 160 l12 6" stroke="${G}" stroke-width="1.3"/>`
    +`${moon(100,206,13)}`,
    /* 3 皇后：丰饶之野·麦穗·心盾·金星 */
    `<path d="M40 208 L160 208 L166 216 L34 216 Z" fill="rgba(143,168,132,.35)"/>`
    +`<path d="M46 208 q0 -6 4 -6 M54 208 q0 -10 4 -10 M62 208 q0 -7 4 -7" ${sw} opacity=".6"/><path d="M154 208 q0 -6 -4 -6 M146 208 q0 -10 -4 -10 M138 208 q0 -7 -4 -7" ${sw} opacity=".6"/>`
    +`<circle cx="116" cy="102" r="15" fill="${R}" opacity=".75"/><path d="M116 92 q6 6 0 14 q-6 -8 0 -14z" fill="${W}"/><text x="116" y="100" text-anchor="middle" fill="${W}" font-size="12">♀</text>`
    +`${robe(92,126,sk2, Gg)}<path d="M83 110 q9 -8 18 0 l0 6 q-9 8 -18 0 z" fill="${G}" stroke="${G}" stroke-width="1"/><path d="M92 150 l-6 10 M92 150 l6 10" stroke="${G}" stroke-width="2"/>`
    +`<circle cx="92" cy="142" r="6" fill="none" ${sg}/><path d="M88 142 l8 0 M92 138 l0 8" stroke="${G}" stroke-width="1.3"/>`
    +`<path d="M70 200 q30 26 60 0" fill="none" ${sg} opacity=".7"/><circle cx="70" cy="200" r="4" fill="${G}"/>${star5(150,132,5,G)}${star5(60,140,5,G)}`,
    /* 4 皇帝：王座·羊首·远山 */
    `${mtn(56,168,30,64)}${mtn(86,176,34,56)}${mtn(120,168,32,64)}`
    +`<rect x="58" y="146" width="84" height="62" rx="8" fill="none" ${sg}/><rect x="70" y="120" width="60" height="8" rx="3" fill="none" ${sg}/>` 
    +`<path d="M100 128 v64 M100 150 l-14 -10 M100 150 l14 -10" stroke="${G}" stroke-width="1.4" fill="none"/>`
    +`${robe(100,138,sk,R)}<path d="M91 116 l9 -7 l9 7 M91 116 l9 2 l9 -2 M91 116 v-6 M109 116 v-6" stroke="${G}" stroke-width="1.2" fill="none"/>`
    +`<path d="M74 176 l7 -7 M126 176 l-7 -7" stroke="${G}" stroke-width="2.2"/>`
    +`<path d="M120 200 q-20 10 -40 0" fill="none" ${sg} opacity=".6"/><circle cx="70" cy="140" r="4" fill="${G}"/>`,
    /* 5 恋人：天使·男女·生命之树·远山 */
    `${cloud(100,62,7,0.95)}${headOnly(100,84,sk)}<path d="M100 94 l0 8 M100 102 l-7 10 M100 102 l7 10" ${sw} opacity=".65"/>`
    +`${robe(72,132,sk, Gg)}<path d="M72 96 l-12 26 M72 96 l12 -16 M72 96 l-8 10 M72 96 l8 12" stroke="${G}" stroke-width="1.6" fill="none"/>`
    +`${robe(128,132,sk2,R)}<path d="M128 96 l12 26 M128 96 l-12 -16 M128 96 l8 10 M128 96 l-8 12" stroke="${G}" stroke-width="1.6" fill="none"/>`
    +`<path d="M84 150 l-8 34 M68 184 l-12 12 M92 184 l4 12" stroke="${G}" stroke-width="2.4"/><path d="M116 150 l8 34 M132 184 l12 12 M108 184 l-4 12" stroke="${G}" stroke-width="2.4"/>`
    +`<path d="M40 212 L160 212 L152 200 L48 200 Z" fill="rgba(233,196,121,.08)"/><path d="M80 200 q0 -8 4 -8" ${sw} opacity=".6"/><path d="M52 212 l6 -6 M148 212 l-6 -6" stroke="${G}" stroke-width="1.3"/>`,
    /* 6 战车：驭者·双斯芬克斯·星空华盖·八芒星 */
    `${star5(100,84,9,G)}<rect x="46" y="92" width="108" height="7" rx="3" fill="none" ${sg}/><line x1="46" y1="92" x2="46" y2="82" stroke="${G}" stroke-width="1.4"/><line x1="154" y1="92" x2="154" y2="82" stroke="${G}" stroke-width="1.4"/><rect x="90" y="80" width="20" height="14" fill="none" ${sg}/>`
    +`${headOnly(100,96,sk)}<line x1="100" y1="105" x2="100" y2="116" stroke="${G}" stroke-width="1.6"/>`
    +`<rect x="38" y="116" width="124" height="62" rx="9" fill="none" ${sg}/><path d="M38 150 L72 150 L72 116 M162 150 L128 150 L128 116" stroke="${G}" stroke-width="1.6" fill="none"/>`
    +`${star4(62,142,6,G)}${star4(138,142,6,G)}${star4(100,138,6,B)}`
    +`<line x1="46" y1="178" x2="46" y2="198" stroke="${G}" stroke-width="2.2"/><line x1="154" y1="178" x2="154" y2="198" stroke="${G}" stroke-width="2.2"/><path d="M50 198 L150 198" stroke="${G}" stroke-width="1.4"/>`
    +`${sphinx(66,190,0.8,1)}${sphinx(134,190,0.8,-1)}`
    +`<path d="M96 178 q4 -10 8 0 M104 178 q-4 -10 -8 0" stroke="${G}" stroke-width="1.4" fill="none"/>`,
    /* 7 力量：少女抚狮·∞于头顶 */
    `${lionHead(132,150,9)}<path d="M124 158 q-8 6 -20 0 M126 168 l-4 12 M124 168 l-8 14 M142 156 l4 16 M140 176 l6 10" ${st} fill="none"/>`
    +`${robe(104,140,sk,W)}<path d="M100 138 l-16 12 M100 138 l-12 8 M100 152 l-10 22 M100 152 l-8 24" stroke="${G}" stroke-width="2" fill="none"/>`
    +`<path d="M95 114 q-14 -16 -4 -24 q10 -8 24 0 q14 8 4 24" fill="none" ${sg}/><circle cx="99" cy="96" r="2" fill="${R}"/>`
    +`<path d="M56 206 L144 206" stroke="${G}" stroke-width="1.4"/>${star5(60,150,5,G)}${star5(144,150,5,W)}`,
    /* 8 隐士：提灯老人·山巅·六芒星灯 */
    `${mtn(60,160,34,78)}${mtn(118,150,40,92)}${mtn(88,150,30,80)}`
    +`<path d="M152 170 q-52 -22 -100 0" fill="none" ${sg} opacity=".35"/>`
    +`${robe(92,136,sk,D)}<line x1="92" y1="112" x2="62" y2="150" stroke="${G}" stroke-width="2.2"/><path d="M100 112 l0 -18 l10 0 l0 -8 l-10 0 l0 -6" stroke="${G}" stroke-width="1.6" fill="none"/>`
    +`<circle cx="100" cy="70" r="9" fill="${G}"/><path d="M100 79 l0 14 M91 90 l18 0 M91 90 l-8 10 M109 90 l8 10 M100 104 l0 12" stroke="${G}" stroke-width="1.4" fill="none"/><path d="M100 61 l3 6 l-3 2 l-3 -2 z" fill="${W}" opacity=".9"/>`
    +`<path d="M92 122 l-16 14" stroke="${G}" stroke-width="2"/>${star5(150,96,5,G)}`,
    /* 9 命运之轮：巨轮·斯芬克斯·蛇·胡狼·四角象 */
    `<circle cx="100" cy="150" r="44" fill="none" ${sg} stroke-width="2.2"/><circle cx="100" cy="150" r="30" fill="none" ${sg} stroke-width="1.3"/><circle cx="100" cy="150" r="30" fill="rgba(233,196,121,.10)"/>`
    +`<path d="M100 106 l0 88 M56 150 l88 0 M69 119 l62 62 M69 181 l62 -62" stroke="${G}" stroke-width="0.9" opacity=".6"/>`
    +`<text x="100" y="158" text-anchor="middle" fill="${W}" font-size="24" opacity=".95">轮</text>`
    +`<path d="M100 88 q14 14 28 0 q0 20 -14 30" fill="${G}" opacity=".75"/><path d="M100 214 q-14 -14 -28 0 q0 -20 14 -30" fill="${G}" opacity=".55"/>`
    +`<circle cx="100" cy="150" r="11" fill="none" ${sg}/><path d="M100 150 l0 -11 M100 150 l9 6 M100 150 l-9 6" stroke="${G}" stroke-width="1.4"/>`
    +`${headOnly(100,88,sk)}`
    +`<path d="M56 150 q-18 -6 -16 -26 M144 150 q18 -6 16 -26" fill="none" ${sd} opacity=".7"/>${star4(50,120,6,G)}${star4(150,120,6,G)}`
    +`<path d="M82 208 l-8 10 M118 208 l8 10" ${sw} opacity=".5"/>`,
    /* 10 正义：持剑执衡·双柱·蒙眼 */
    `${pillar(60,96,210)}${pillar(130,96,210)}<rect x="68" y="88" width="3" height="10" fill="${G}"/><rect x="129" y="88" width="3" height="10" fill="${G}"/>`
    +`${robe(100,128,sk,R)}<path d="M98 112 l8 0 M98 120 l8 0" stroke="${G}" stroke-width="1.2"/>`
    +`<line x1="100" y1="122" x2="146" y2="150" stroke="${G}" stroke-width="1.8"/><path d="M146 150 l-8 4 l2 -10 z" fill="${G}"/>`
    +`<line x1="100" y1="118" x2="60" y2="150" stroke="${G}" stroke-width="1.6"/><path d="M60 150 h34 M60 144 h28 M60 156 h24" stroke="${G}" stroke-width="1.3"/>`
    +`<path d="M76 150 q0 -26 40 -26 q-8 0 -8 8 q0 -14 -32 -14 q0 14 -12 14 z" fill="${G}" opacity=".15"/>`
    +`<rect x="66" y="200" width="20" height="14" fill="none" ${sg}/><rect x="114" y="200" width="20" height="14" fill="none" ${sg}/>${star4(100,90,5,G)}`,
    /* 11 倒吊人：倒吊于树·从容光环 */
    `<line x1="40" y1="120" x2="160" y2="120" stroke="${G}" stroke-width="1.6"/>`
    +`<path d="M100 120 l0 18 M100 150 l-8 14 M100 164 l8 10 M100 150 l8 14 M100 164 l-8 10" stroke="${G}" stroke-width="1.6" fill="none"/>`
    +`<path d="M84 136 q8 -5 16 0 M84 136 l0 16 q-8 5 -16 0 z" fill="${G}" opacity=".15"/><circle cx="100" cy="140" r="3" fill="${G}"/>`
    +`<g transform="rotate(180 100 132)">${robe(100,132,sk,B)}</g>`
    +`<path d="M96 108 q6 -6 10 0 M84 96 q6 -6 12 0" ${sw} opacity=".7"/>`
    +`<circle cx="100" cy="150" r="16" fill="none" ${sg} stroke-dasharray="3 3" opacity=".7"/>`
    +`<path d="M60 110 l4 8 M140 110 l-4 8" stroke="${G}" stroke-width="1.4"/>`,
    /* 12 死神：白马·黑旗·白玫瑰·断壁新生 */
    `<rect x="40" y="128" width="92" height="42" fill="none" ${sd} opacity=".6"/><path d="M40 128 l0 42 M132 128 l0 42" stroke="${D}" stroke-width="1" opacity=".5"/>`
    +`<g transform="translate(112,172) scale(0.95)"><circle cx="24" cy="-26" r="7" fill="#0f2a33"/><rect x="-16" y="-16" width="40" height="34" rx="8" fill="rgba(255,255,255,.10)"/><path d="M-16 -10 q-22 -8 -20 -30 M20 -10 q22 -8 20 -30" fill="none" ${sd} opacity=".8"/></g>`
    +`<path d="M58 96 l10 8 M70 100 l6 10 M80 110 l4 10" stroke="${G}" stroke-width="2.2" fill="none"/>`
    +`<path d="M58 92 l14 0 M60 98 l16 0" stroke="${G}" stroke-width="1.4"/>`
    +`<path d="M52 216 L62 196 L72 216 Z" fill="#0f2a33"/><path d="M62 196 l14 0 l0 20" fill="none" ${sd}/><path d="M72 202 l-8 10 M72 202 l8 8" stroke="${G}" stroke-width="1.5"/>`
    +`<circle cx="82" cy="196" r="5" fill="${G}"/><path d="M76 196 a5 5 0 0 1 8 3" stroke="${W}" stroke-width="1.3" fill="none"/>`
    +`<path d="M150 120 q0 30 -20 40 M152 138 q-10 14 -26 16" ${sw} opacity=".5"/>${sun(136,70,6)}`,
    /* 13 节制：天使·两杯之水·日冕 ·远路 */
    `${pillar(54,120,220)}${pillar(142,120,220)}`
    +`<path d="M54 120 L142 120" stroke="${G}" stroke-width="1.4"/>`
    +`${headOnly(100,104,sk)}<path d="M100 96 l-6 -14 M100 96 l6 -14 M94 82 l12 0 M94 82 l0 -8 M106 82 l0 -8" stroke="${G}" stroke-width="1.5" fill="none"/>`
    +`${wing(92,120,16,1)}${wing(108,120,16,-1)}`
    +`${robe(100,148,sk,B)}<line x1="100" y1="128" x2="100" y2="142" stroke="${G}" stroke-width="1.4"/>`
    +`<path d="M72 176 l10 -4 M72 176 l-8 6 M72 176 a6 4 0 1 1 0 -8 l14 0 l0 8 z" fill="rgba(122,160,216,.35)" stroke="${B}" stroke-width="1.2"/><path d="M72 182 l-10 10" stroke="${B}" stroke-width="1.5"/>`
    +`<path d="M128 176 l-10 -4 M128 176 l8 6 M120 176 a6 4 0 1 1 0 -8 l14 0 l0 8 z" fill="rgba(122,160,216,.35)" stroke="${B}" stroke-width="1.2"/><path d="M136 182 l8 8" stroke="${B}" stroke-width="1.5"/>`
    +`<path d="M100 168 l32 30 M100 168 l30 -28" stroke="${G}" stroke-width="1.2" opacity=".6" fill="none"/>`
    +`<path d="M60 214 L140 214" stroke="${G}" stroke-width="1.3"/>${sun(100,70,13)}`,
    /* 14 恶魔：魔王·倒五芒·双链人 */
    `<path d="M78 92 L122 92 L130 168 L100 186 L70 168 Z" fill="rgba(194,66,52,.35)"/>`
    +`${headOnly(100,108,sk)}<path d="M90 104 q-10 -16 -4 -24 M110 104 q10 -16 4 -24" stroke="${G}" stroke-width="1.4" fill="none"/>`
    +`<circle cx="100" cy="108" r="2.2" fill="${R}"/><circle cx="94" cy="108" r="2.2" fill="${R}"/><path d="M98 114 l4 0 M100 112 l0 5" stroke="${G}" stroke-width="1.3"/>`
    +`${robe(100,150,sk2,R)}<path d="M100 128 l0 10 M100 138 l-10 -6 M100 138 l10 -6" stroke="${G}" stroke-width="1.6" fill="none"/>`
    +`<path d="M100 180 l-20 22 M100 180 l20 22 M100 180 l-26 12 M100 180 l26 12" stroke="${G}" stroke-width="2.4"/>`
    +`<path d="M100 128 l-26 12 M100 128 l26 12 M100 128 l-34 6 M100 128 l34 6" stroke="${G}" stroke-width="1.4"/>${star5(100,150,9,R)}`
    +`<path d="M64 206 L136 206" stroke="${G}" stroke-width="1.5"/>`
    +`${headOnly(58,196,sk)}${headOnly(142,196,sk)}<line x1="66" y1="204" x2="58" y2="214" stroke="${G}" stroke-width="1.4"/><line x1="134" y1="204" x2="142" y2="214" stroke="${G}" stroke-width="1.4"/>`
    +`<path d="M40 214 L160 214" stroke="${G}" stroke-width="1.3"/>`,
    /* 15 高塔：雷击·塔崩·坠落 */
    `<path d="M84 70 L116 70 L112 150 L88 150 Z" fill="rgba(233,196,121,.12)"/>`
    +`<path d="M84 70 L116 70 L116 84 L84 84 Z" fill="none" ${sg}/><line x1="82" y1="150" x2="118" y2="150" stroke="${G}" stroke-width="1.6"/><path d="M88 150 l-5 8 M112 150 l5 8 M82 158 l-5 8 M118 158 l5 8" stroke="${G}" stroke-width="1.4"/>`
    +`<path d="M82 86 l-10 6 M76 92 l-12 4 M66 98 l-10 4" stroke="${G}" stroke-width="1.8" fill="none"/>`
    +`<path d="M84 60 l-22 -30 M116 60 l22 -20" stroke="${B}" stroke-width="1.8"/>${star4(100,56,7,G)}`
    +`<path d="M96 96 l6 0 M86 110 l4 0 M112 106 l-4 0" stroke="${G}" stroke-width="1.2" opacity=".7"/>`
    +`${sun(64,84,6)}<path d="M50 210 q-8 -24 8 -34" ${sw} opacity=".7"/><path d="M62 216 q10 -18 0 -30" ${sw} opacity=".7"/><circle cx="56" cy="176" r="4" fill="${sk}"/><circle cx="64" cy="190" r="5" fill="${sk}"/><path d="M142 216 q10 -18 0 -30" ${sw} opacity=".7"/>`
    +`<circle cx="148" cy="84" r="3" fill="${R}"/>`,
    /* 16 星星：裸女舀水·八星·大星 ·远山 */
    `${star4(100,80,9,G)}${star4(66,52,5,G)}${star4(100,118,4,G)}${star4(134,52,5,G)}${star4(84,40,4,G)}${star4(116,40,4,G)}${star4(66,96,4,G)}${star4(134,96,4,G)}` 
    +`${mtn(44,200,40,72)}${mtn(118,200,42,78)}${pillar(76,150,210)}${pillar(128,150,210)}`
    +`<g transform="translate(100,156)"><circle cx="0" cy="-10" r="8" fill="${sk}"/><path d="M-8 2 q8 -5 16 0 l-1 34 q-7 4 -14 0 z" fill="${W}" stroke="${G}" stroke-width="1.1"/><line x1="-1" y1="36" x2="-4" y2="46" stroke="${G}" stroke-width="1.6"/><line x1="3" y1="36" x2="4" y2="46" stroke="${G}" stroke-width="1.6"/><line x1="-1" y1="-2" x2="-14" y2="8" stroke="${G}" stroke-width="1.8"/><circle cx="-16" cy="8" r="6" fill="rgba(122,160,216,.4)" stroke="${B}" stroke-width="1.1"/><path d="M-16 14 l0 6 M-20 16 l8 0" stroke="${G}" stroke-width="1.3"/></g>`
    +`<path d="M76 176 l14 0 l0 -6" stroke="${B}" stroke-width="1.4" fill="none"/><circle cx="92" cy="176" r="5" fill="rgba(122,160,216,.4)" stroke="${B}" stroke-width="1.1"/><path d="M58 176 l14 0 l0 -8" stroke="${B}" stroke-width="1.2" fill="none"/>`,
    /* 17 月亮：月·双塔·犬·路径 ·小龙虾 */
    `${moon(100,74,20)}<circle cx="96" cy="70" r="3" fill="${G}"/><circle cx="96" cy="70" r="1" fill="#0f2a33"/>`
    +`${mtn(58,150,34,70)}${mtn(116,150,34,74)}<rect x="60" y="176" width="20" height="34" fill="none" ${sd} opacity=".7"/><rect x="120" y="182" width="20" height="28" fill="none" ${sd} opacity=".7"/>`
    +`${dog(90,196,0.8)}${dog(112,196,0.8)}`
    +`<path d="M88 206 h24 M86 212 h28" stroke="${W}" stroke-width="1.1" opacity=".5" fill="none"/>`
    +`<path d="M100 176 q0 22 -6 34" stroke="${G}" stroke-width="1.1" fill="none" opacity=".55"/>${star4(148,40,4,G)}${star4(52,44,4,G)}${star4(130,60,4,G)}${star4(76,56,4,G)}`
    +`<path d="M70 232 q-8 -4 -8 -12 M70 232 q8 -4 8 -12 M70 232 l-8 18 M70 232 l8 18" stroke="${G}" stroke-width="1.3" fill="none"/>`,
    /* 18 太阳：孩童·白马·向日葵 ·烈日 */
    `${sun(100,62,16)}<path d="M100 62 l0 8 M100 62 l7 -4 M100 62 l-7 -4" stroke="#0f2a33" stroke-width="1.3" fill="none"/>`
    +`${mtn(40,176,40,70)}${mtn(124,176,42,72)}`
    +`<g transform="translate(100,168)"><path d="M-20 8 Q -6 -12 14 6 L 6 12 Q 0 -2 -8 10 L -20 8 Z" fill="rgba(233,196,121,.30)" stroke="${G}" stroke-width="1.2"/></g>`
    +`${headOnly(100,136,sk)}<path d="M97 134 q3 -3 6 0 M94 138 l6 4 M106 138 l-6 4" stroke="${G}" stroke-width="1.2" fill="none"/>`
    +`<line x1="100" y1="144" x2="100" y2="188" stroke="${G}" stroke-width="2.6"/><circle cx="100" cy="200" r="9" fill="none" ${sg}/><path d="M94 200 l6 -6 l6 6 l-6 6 z" fill="${R}"/>`
    +`<circle cx="66" cy="150" r="9" fill="${G}" opacity=".55"/><path d="M66 141 l0 18 M57 150 l18 0" stroke="${G}" stroke-width="1.2"/>`
    +`<circle cx="134" cy="150" r="9" fill="${G}" opacity=".55"/><path d="M134 141 l0 18 M125 150 l18 0" stroke="${G}" stroke-width="1.2"/>`
    +`${cloud(40,100,5,0.7)}${cloud(160,104,5,0.7)}`,
    /* 19 审判：号角天使·亡灵起立·圣山 */
    `${cloud(100,92,9,0.95)}${headOnly(100,112,sk)}<path d="M100 122 l0 10 M100 132 l-10 14" ${sw} opacity=".7"/>`
    +`${wing(78,120,16,1)}${wing(122,120,16,-1)}`
    +`<path d="M120 96 l26 20 l-10 4 z" fill="none" ${sg}/>`
    +`${mtn(56,200,40,70)}${mtn(122,200,42,74)}`
    +`<g transform="translate(100,186) scale(0.8)"><g stroke="${G}" stroke-width="1.4" fill="none"><circle cx="-26" cy="0" r="9"/><path d="M-34 10 q8 -6 16 0 l-2 26"/><circle cx="26" cy="0" r="9"/><path d="M18 10 q8 -6 16 0 l-2 26"/><circle cx="0" cy="4" r="9"/><path d="M-8 14 q8 -6 16 0 l-2 26"/></g></g>`
    +`<path d="M60 198 L140 198" stroke="${G}" stroke-width="1.4"/>${star4(150,120,5,G)}${star4(52,124,5,G)}`
    +`<path d="M120 96 l26 20" stroke="${G}" stroke-width="1.4"/>`,
    /* 20 世界：花环舞者·四象 ·带状 */
    `<ellipse cx="100" cy="150" rx="52" ry="64" fill="none" ${sg} stroke-width="2"/><ellipse cx="100" cy="150" rx="44" ry="56" fill="rgba(233,196,121,.08)"/>`
    +`<path d="M48 150 q6 -22 22 -22 M152 150 q-6 -22 -22 -22" fill="none" ${sg} opacity=".8"/>`
    +`<g transform="translate(100,150)"><circle cx="0" cy="-10" r="8" fill="${sk}"/><path d="M-8 2 q8 -5 16 0 l0 34" fill="${W}" stroke="${G}" stroke-width="1"/><path d="M-1 12 l-10 10 M3 12 l10 10 M-3 18 l-6 14 M5 18 l6 14" stroke="${G}" stroke-width="1.3"/></g>`
    +`<circle cx="100" cy="80" r="2" fill="${R}"/><circle cx="60" cy="150" r="2" fill="${G}"/><circle cx="140" cy="150" r="2" fill="${B}"/><circle cx="100" cy="220" r="2" fill="${G}"/>`
    +`<path d="M78 96 q22 16 44 0 M78 96 l0 6 M122 96 l0 6" stroke="${G}" stroke-width="1.4" fill="none" opacity=".8"/>`
    +`<path d="M48 96 q-10 4 -8 14 M152 96 q10 4 8 14" stroke="${G}" stroke-width="1.4" opacity=".8"/>`
    +`<path d="M60 204 q8 4 8 -8 M140 204 q-8 4 -8 -8" stroke="${G}" stroke-width="1.4" opacity=".8"/>`
    +`<path d="M90 224 l20 0 M90 224 l-6 -8 M110 224 l6 -8" stroke="${G}" stroke-width="1.4" opacity=".8"/>`
    +`<text x="100" y="46" text-anchor="middle" fill="${G}" font-size="16" opacity=".5">∞</text>`
  ];
  return A[num]||'';
}
function minorArt(suit,rank){
  const c=SUIT_COLOR[suit];
  const glyph={'权杖':'✦','圣杯':'♆','宝剑':'⚔','星币':'❂'}[suit];
  const pip=n=>{let s='';for(let i=0;i<n;i++){const x=58+(i%3)*42,y=92+Math.floor(i/3)*42;s+=`<text x="${x}" y="${y}" fill="${c}" font-size="19" text-anchor="middle" style="text-shadow:0 0 5px ${c}">${glyph}</text>`;}return s;};
  if(/Ace/.test(rank)) return `<circle cx="100" cy="148" r="42" fill="none" stroke="${c}" stroke-width="1.6" opacity=".7"/><circle cx="100" cy="148" r="27" fill="none" stroke="${c}" stroke-width="1"/><text x="100" y="160" fill="${c}" font-size="46" text-anchor="middle" style="text-shadow:0 0 9px ${c}">${glyph}</text>`;
  const court={'侍从':'♘','骑士':'♞','王后':'♛','国王':'♚'}[rank];
  if(court) return `<circle cx="100" cy="108" r="20" fill="none" stroke="${c}" stroke-width="1.5"/><text x="100" y="162" fill="${c}" font-size="48" text-anchor="middle" style="text-shadow:0 0 7px ${c}">${court}</text><text x="100" y="202" fill="${c}" font-size="13" text-anchor="middle">${suit}</text>`;
  const n=parseInt(rank); return pip(n);
}
function tarotCardSVG(name,rev){
  const p=tarotNameParts(name);
  const rot=rev?'transform="rotate(180 100 145)"':'';
  let art='';
  if(p.major){ const num=parseInt(p.label); art=majorArt(num); }
  else { art=minorArt(p.suit,p.rank); }
  const title=p.major?p.label:(p.suit+' '+p.rank);
  const sub=p.major?'大阿尔克那':(SUIT_CN[p.suit]+'·'+p.suit);
  const uid=(p.major?p.label:(p.suit+p.rank)).replace(/[^一-龥A-Za-z0-9]/g,'')+(rev?'r':'');
  return `<svg viewBox="0 0 200 290" width="128" height="186" style="border-radius:14px">
    <defs>
      <linearGradient id="bg${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#143b45"/><stop offset="1" stop-color="#0a1c22"/></linearGradient>
      <radialGradient id="gl${uid}" cx="0.5" cy="0.4" r="0.62"><stop offset="0" stop-color="var(--gold)" stop-opacity="0.20"/><stop offset="1" stop-color="rgba(233,196,121,0)"/></radialGradient>
      <linearGradient id="gd${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8e6ad"/><stop offset="1" stop-color="#c9a35a"/></linearGradient>
    </defs>
    <rect x="0" y="0" width="200" height="290" rx="14" fill="url(#bg${uid})"/>
    <rect x="0" y="0" width="200" height="290" rx="14" fill="url(#gl${uid})"/>
    <rect x="6" y="6" width="188" height="278" rx="11" fill="none" stroke="url(#gd${uid})" stroke-width="2.4"/>
    <rect x="11" y="11" width="178" height="268" rx="8" fill="none" stroke="var(--gold)" stroke-opacity="0.32" stroke-width="0.8"/>
    <g fill="none" stroke="url(#gd${uid})" stroke-width="1.3">
      <path d="M15 27 q0 -13 13 -13"/><path d="M185 27 q0 -13 -13 -13"/>
      <path d="M15 263 q0 13 13 13"/><path d="M185 263 q0 13 -13 13"/>
    </g>
    <text x="100" y="33" text-anchor="middle" fill="url(#gd${uid})" font-size="13" font-weight="bold" font-family="STKaiti,KaiTi,serif">${title}</text>
    <g ${rot}>${art}</g>
    <text x="100" y="252" text-anchor="middle" fill="#9fc4c8" font-size="11.5">${sub}</text>
    <text x="100" y="276" text-anchor="middle" fill="url(#gd${uid})" font-size="12" font-weight="bold">${rev?'逆 位':'正 位'}</text>
  </svg>`;
}

/* ---------- 六爻（简化真实排盘） ---------- */
const GONG_GAN={乾:'甲',坤:'乙',震:'庚',坎:'戊',艮:'丙',巽:'辛',离:'己',兑:'丁'};
const DZ_SEQ={
 乾:['子','寅','辰','午','申','戌'],坤:['未','巳','卯','丑','亥','酉'],震:['子','寅','辰','午','申','戌'],
 坎:['寅','辰','午','申','戌','子'],艮:['辰','午','申','戌','子','寅'],巽:['丑','亥','酉','未','巳','卯'],
 离:['卯','丑','亥','酉','未','巳'],兑:['巳','卯','丑','亥','酉','未']
};
const DZ_WU={子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};
function sixQin(gongWu,dzWu){
  if(dzWu===gongWu) return '兄弟';
  if(SHENG[gongWu]===dzWu) return '子孙';
  if(SHENG[dzWu]===gongWu) return '父母';
  if(KE[gongWu]===dzWu) return '妻财';
  if(KE[dzWu]===gongWu) return '官鬼';
  return '—';
}
function sixShen(gan){
  if('甲乙'.includes(gan)) return ['青龙','朱雀','勾陈','腾蛇','白虎','玄武'];
  if('丙丁'.includes(gan)) return ['朱雀','勾陈','腾蛇','白虎','玄武','青龙'];
  if('戊己'.includes(gan)) return ['勾陈','腾蛇','白虎','玄武','青龙','朱雀'];
  if('庚辛'.includes(gan)) return ['白虎','玄武','青龙','朱雀','勾陈','腾蛇'];
  return ['玄武','青龙','朱雀','勾陈','腾蛇','白虎'];
}
function getDayGanNow(){
  const d=new Date(); const lunar=Solar.fromYmd(d.getFullYear(),d.getMonth()+1,d.getDate()).getLunar();
  return lunar.getDayGan();
}
function getDayZhiNow(){
  const d=new Date(); const lunar=Solar.fromYmd(d.getFullYear(),d.getMonth()+1,d.getDate()).getLunar();
  return lunar.getDayZhi();
}
/* 京房八宫映射：每卦归属何宫（纯卦），六亲基准用宫位五行，非下卦五行 */
const GONG_LIST={
  '乾':['乾','姤','遁','否','观','剥','晋','大有'],
  '坎':['坎','节','屯','既济','革','丰','明夷','师'],
  '艮':['艮','贲','大畜','损','睽','履','中孚','渐'],
  '震':['震','豫','解','恒','升','井','大过','随'],
  '巽':['巽','小畜','家人','益','无妄','噬嗑','颐','蛊'],
  '离':['离','旅','鼎','未济','蒙','涣','讼','同人'],
  '坤':['坤','复','临','泰','大壮','夬','需','比'],
  '兑':['兑','困','萃','咸','蹇','谦','小过','归妹']
};
const GONG_PALACE={};
Object.keys(GONG_LIST).forEach(p=>GONG_LIST[p].forEach(n=>{ GONG_PALACE[n]=p; }));
function gongWuOf(name){ return GONG_PALACE[name]?JING_WU[GONG_PALACE[name]]:JING_WU[name]; }
/* 六爻进阶用神辅助：六冲/墓库/三合/化进退/旬空 */
const LIU_CHONG={'子':'午','午':'子','丑':'未','未':'丑','寅':'申','申':'寅','卯':'酉','酉':'卯','辰':'戌','戌':'辰','巳':'亥','亥':'巳'};
const LIU_MU={'金':'丑','木':'未','水':'辰','火':'戌','土':'辰'};
const LIU_SANHE={'水':['申','子','辰'],'金':['巳','酉','丑'],'木':['寅','午','戌'],'火':['亥','卯','未']};
const LIU_JIN={'亥':'子','寅':'卯','巳':'午','申':'酉','丑':'辰','辰':'未','未':'戌','戌':'丑'};
const LIU_TUI={'子':'亥','卯':'寅','午':'巳','酉':'申','辰':'丑','未':'辰','戌':'未','丑':'戌'};
function liuJinTui(fromDz,toDz){
  if(LIU_JIN[fromDz]===toDz) return '化进神（顺势而进，事渐长、宜乘势）';
  if(LIU_TUI[fromDz]===toDz) return '化退神（渐退而收，事将消、宜见好就收）';
  return '';
}
function liuKongWang(zhi){
  const zi=ZHI.indexOf(zhi); const gi='甲乙丙丁戊己庚辛壬癸'.indexOf(getDayGanNow());
  const shou=((zi-gi)%12+12)%12;
  return [ZHI[(shou+10)%12],ZHI[(shou+11)%12]];
}
function liuSanHe(dzSet){
  for(const w in LIU_SANHE){ const t=LIU_SANHE[w]; if(t.every(x=>dzSet.includes(x))) return t; }
  return null;
}
/* 京房八宫 世位（六爻断卦之纲：世爻为问事之"我"，应与世相隔三位） */
const SHI_BY_NAME={
  '乾':6,'姤':1,'遁':2,'否':3,'观':4,'剥':5,'晋':4,'大有':3,
  '坎':6,'节':1,'屯':2,'既济':3,'革':4,'丰':5,'明夷':4,'师':3,
  '艮':6,'贲':1,'大畜':2,'损':3,'睽':4,'履':5,'中孚':4,'渐':3,
  '震':6,'豫':1,'解':2,'恒':3,'升':4,'井':5,'大过':4,'随':3,
  '巽':6,'小畜':1,'家人':2,'益':3,'无妄':4,'噬嗑':5,'颐':4,'蛊':3,
  '离':6,'旅':1,'鼎':2,'未济':3,'蒙':4,'涣':5,'讼':4,'同人':3,
  '坤':6,'复':1,'临':2,'泰':3,'大壮':4,'夬':5,'需':4,'比':3,
  '兑':6,'困':1,'萃':2,'咸':3,'蹇':4,'谦':5,'小过':4,'归妹':3
};
var liuyaoTimer=null, lastLiuyao={draw:null,html:null};
function finishLiuyao(){
  if(liuyaoTimer){clearTimeout(liuyaoTimer);liuyaoTimer=null;}
  if(!lastLiuyao.draw) return;
  const d=document.getElementById('liuyaoDraw'); if(d) d.innerHTML=lastLiuyao.draw;
  const r=document.getElementById('liuyaoResult'); if(r) r.innerHTML=lastLiuyao.html;
  const s=document.getElementById('liuyaoSkip'); if(s) s.style.display='none';
}
/* 六爻逐爻位断语：位名×六亲×动/静，哈希选句去模板——初爻至上爻每位各有专属白话 */
const YAO_POS_S=[
  ['初爻（根基之地）','初爻（起步之位）'],
  ['二爻（近身之位）','二爻（行动之地）'],
  ['三爻（门户之间）','三爻（进退之关）'],
  ['四爻（外援之层）','四爻（转承之机）'],
  ['五爻（尊贵之位）','五爻（核心之区）'],
  ['上爻（结局之位）','上爻（高远之处）']
];
const YAO_QIN_TIP={
  '父母':['文书长辈之事','房产、文书、长辈相关','为文书操心之象'],
  '子孙':['喜乐平安之事','休闲、子女、化解之事','主身心安宁与化解'],
  '官鬼':['压力与功名之事','职场、官非、压力相关','主责任与忧患之象'],
  '妻财':['财利经营之事','钱财、利益相关','主得利与经营之机'],
  '兄弟':['人脉与耗财之事','朋友、竞争、破财相关','主合伙与分利之象']
};
function _yaoLineSay(i, qin, dong, hexName){
  const pos=YAO_POS_S[i%6][_hashStr(hexName+'p'+i)%2];
  const tips=YAO_QIN_TIP[qin]||['此域之事'];
  const tip=tips[_hashStr(hexName+qin+i)%tips.length];
  const dongTxt=dong?'动而事显，机已现——此位是突破口，宜抓住主动':'静而藏机，事未显——此位宜守常，静观其变';
  return `${pos} · ${qin}${dong?'（动）':'（静）'}：${tip}；${dongTxt}`;
}
/* 六爻六神逐位深化：青龙/朱雀/勾陈/腾蛇/白虎/玄武 ×2 变体——每爻六神给专属白话 */
const LIU_SHEN_MEAN={
  '青龙':['青龙主喜——此爻得吉神，事多喜庆、贵人助力，宜趁势而为','青龙临此——主喜事与生机，此位有春意，主动一点收获更多','青龙在侧——主生发之机，此位宜开新局、结善缘'],
  '朱雀':['朱雀主口舌——此爻防言辞是非，说话留三分，文书多核对','朱雀临此——主文书口舌之象，此位慎言慎笔，能避大半是非','朱雀在处——主传播与争辩，此位宜确认无误再出口落笔'],
  '勾陈':['勾陈主迟滞——此爻事多拖延，宜耐心经营，急不得','勾陈临此——主田土房产与纠缠之象，此位重在守，稳住即有进展','勾陈当位——主牵绊迟疑，此位宜理清头绪、忌多头并进'],
  '腾蛇':['腾蛇主虚惊——此爻防虚惊怪异，勿被表象所惑','腾蛇临此——主缠绕反复之象，此位宜明辨，慌则失据','腾蛇在侧——主多变疑幻，此位宜沉住气、以静制动'],
  '白虎':['白虎主凶伤——此爻防刑伤冲突，宜避其锋、慎其行','白虎临此——主伤病是非之象，此位以退为进，别硬碰','白虎当位——主刚烈刑伤，此位宜收敛锋芒、远争斗'],
  '玄武':['玄武主盗失——此爻防失窃受骗，财帛宜明、口风宜紧','玄武临此——主暗昧欺瞒之象，此位宜存证防伪，多留心眼','玄武在处——主隐秘难明，此位宜留底查账、勿轻信']
};
function _shenSay(s, seed){
  const arr=LIU_SHEN_MEAN[s]; return arr?arr[_hashStr(s+'|'+seed)%arr.length]:'';
}
/* 六爻问事场景聚合判词（变量驱动·去模板；基于用神六亲·世应·持世·动爻） */
function liuyaoSceneLine(scene, ctx){
  if(!scene) return '';
  const USE={事业:'官鬼',求财:'妻财',感情:'妻财·官鬼',出行:'父母',健康:'官鬼',学业:'父母',诉讼:'官鬼',寻物:'妻财',决策:'世爻',求职:'官鬼',家宅:'父母',合作:'兄弟·妻财',求医:'子孙',孕事:'子孙',讨债:'妻财·官鬼'};
  const use=USE[scene]||'世爻';
  let sy = ctx.shiYing.indexOf('世生应')>=0?'我方主动生扶，宜积极经营、耐心推进':
            ctx.shiYing.indexOf('应生世')>=0?'外缘相生，宜借势承接、坐享其成':
            ctx.shiYing.indexOf('世克应')>=0?'我可制事，宜主动争取、果断而行':
            ctx.shiYing.indexOf('应克世')>=0?'外力掣肘，宜守稳待时、勿冒进':
            '世应比和，宜稳守常道、少波折';
  let yong;
  if(scene==='决策'){
    yong = ctx.shiYing.indexOf('应克世')>=0?'所问即自身决断，然外境克身，宜三思后行':
           ctx.shiYing.indexOf('应生世')>=0?'所问即自身决断，且外缘相生，可放心推进':'所问即自身决断，宜权衡而定';
  } else {
    const useQin = scene==='感情' ? ['妻财','官鬼'] : scene==='合作' ? ['兄弟','妻财'] : scene==='讨债' ? ['妻财','官鬼'] : [use];
    const hold = useQin.indexOf(ctx.shiQin)>=0;
    const dong = ctx.dongJue.some(j=>useQin.some(u=>j.indexOf(u)>=0));
    if(hold && dong) yong = '用神('+use+')既持世又发动，根基有力、事机已显，宜把握时机果断而行。';
    else if(hold) yong = '用神('+use+')持世，根基稳固，宜以静制动、守中待成。';
    else if(dong) yong = '用神('+use+')发动，事机已动，宜顺机而变、主动作为。';
    else yong = '用神('+use+')安静未发，事机未显，宜静候时机、勿强求。';
  }
  const csTip = ctx.chiShi ? ctx.chiShi.split('——').slice(1).join('——') : '';
  const notUse = (scene==='感情'?['妻财','官鬼']:[use]).indexOf(ctx.shiQin)<0;
  const cs = (csTip && notUse) ? ('另：'+ctx.shiQin+'持世，'+csTip) : '';
  return `<p style="margin-top:8px;padding:6px 8px;border-left:3px solid var(--gold2);background:rgba(255,255,255,.03)">【问${scene} · 聚合】以${use}为用神——${sy}。${yong}${cs}</p>`;
}
document.getElementById('liuyaoBtn').onclick=()=>{
  if(liuyaoTimer){clearTimeout(liuyaoTimer);liuyaoTimer=null;}
  const scene=document.getElementById('lyScene')?document.getElementById('lyScene').value:'';
  const lines=[];
  for(let i=0;i<6;i++){ let heads=0; for(let c=0;c<3;c++){ if(Math.random()<0.5) heads++; }
    if(heads===3) lines.push({bit:1,change:true});
    else if(heads===0) lines.push({bit:0,change:true});
    else if(heads===2) lines.push({bit:1,change:false});
    else lines.push({bit:0,change:false});
  }
  const key=lines.map(l=>l.bit).join('');
  const ben=HEX_MAP[key]; const chBits=lines.map(l=>l.change?1-l.bit:l.bit);
  const bian=key!==chBits.join('')?HEX_MAP[chBits.join('')]:null;
  const down=ben.down, up=ben.up, palace=GONG_PALACE[ben.name]||down, gongWu=JING_WU[palace], hGan=GONG_GAN[down];
  const dayZhi=getDayZhiNow(), kw=liuKongWang(dayZhi);
  let lM='寅'; try{ const _n=new Date(); const _lu=Solar.fromYmd(_n.getFullYear(),_n.getMonth()+1,_n.getDate()).getLunar(); lM=_lu.getMonthZhi(); }catch(e){}
  const shen=sixShen(getDayGanNow());
  let rows=[]; const dongPos=[];
  for(let i=0;i<6;i++){
    const dz=DZ_SEQ[i<3?down:up][i]; const qin=sixQin(gongWu,DZ_WU[dz]);
    const fdz=DZ_SEQ[palace][i], fqin=sixQin(gongWu,DZ_WU[fdz]); // 伏神（飞伏：本宫同位之爻）
    const kong=kw.includes(dz);
    const an=(!lines[i].change && LIU_CHONG[dz]===dayZhi); // 静爻逢日辰冲 = 暗动
    if(lines[i].change) dongPos.push(i+1);
    rows.push(`<div class="pill"><b>第${i+1}爻</b> ${hGan}${dz}<br><span style="color:var(--gold2)">${qin}</span> · ${shen[i%6]} ${lines[i].change?'<span style="color:var(--red2)">动</span>':(an?'<span style="color:var(--red2)">暗动</span>':'')}${kong?' <span style="color:var(--muted)">空</span>':''}<br><span style="color:var(--muted);font-size:10px">伏 ${fdz}·${fqin}</span></div>`);
  }
  const draw=hexFigurePair(ben.name, lines.slice().reverse().map(l=>l.bit), lines.slice().reverse().map(l=>l.change), bian?bian.name:null, chBits.slice().reverse());
  let html=`<div class="result"><h3>${ben.name}卦（本卦）</h3>
    <span class="tag">上 ${up}</span><span class="tag">下 ${down}</span><span class="tag">五行 ${JING_WU[up]}/${JING_WU[down]}</span>
    <p style="margin-top:8px">卦辞：${ben.ci}</p><p>${ben.du}</p>`;
  // 彖/象/文言（与周易占卦同源）
  if(HEX_TUAN[ben.name]) html+=`<div style="margin-top:8px;padding:8px 10px;background:rgba(212,175,55,.06);border-left:3px solid var(--gold);border-radius:4px"><div style="color:var(--gold2);font-size:12px;margin-bottom:4px">彖传</div><div style="font-size:13px;line-height:1.8">${HEX_TUAN[ben.name]}</div></div>`;
  if(HEX_DAXIANG[ben.name]) html+=`<div style="margin-top:6px;padding:8px 10px;background:rgba(110,180,255,.06);border-left:3px solid #6eb4ff;border-radius:4px"><div style="color:#6eb4ff;font-size:12px;margin-bottom:4px">大象传</div><div style="font-size:13px;line-height:1.8">${HEX_DAXIANG[ben.name]}</div></div>`;
  if((ben.name==='乾'||ben.name==='坤') && HEX_WENYAN[ben.name]) html+=`<div style="margin-top:6px;padding:8px 10px;background:rgba(180,140,255,.06);border-left:3px solid #b48cff;border-radius:4px"><div style="color:#b48cff;font-size:12px;margin-bottom:4px">文言传</div><div style="font-size:13px;line-height:1.8">${HEX_WENYAN[ben.name]}</div></div>`;
  html+=`<div style="margin-top:8px">${rows.join('')}</div>`;
  if(bian) html+=`<p style="margin-top:8px">变卦 <b style="color:var(--gold2)">${bian.name}卦</b>（${dongPos.map(p=>'第'+p+'爻动').join('、')}）<br><span style="color:var(--muted)">${bian.ci}</span></p>`;
  if(bian && HEX_TUAN[bian.name]) html+=`<div style="margin-top:4px;padding:6px 10px;background:rgba(212,175,55,.04);border-left:3px solid var(--gold);border-radius:4px"><div style="color:var(--gold2);font-size:12px;margin-bottom:2px">变卦 · 彖传</div><div style="font-size:12px;line-height:1.7;color:var(--muted)">${HEX_TUAN[bian.name]}</div></div>`;
  if(bian && HEX_DAXIANG[bian.name]) html+=`<div style="margin-top:4px;padding:6px 10px;background:rgba(110,180,255,.04);border-left:3px solid #6eb4ff;border-radius:4px"><div style="color:#6eb4ff;font-size:12px;margin-bottom:2px">变卦 · 大象传</div><div style="font-size:12px;line-height:1.7;color:var(--muted)">${HEX_DAXIANG[bian.name]}</div></div>`;
  else html+=`<p style="color:var(--muted);font-size:12px;margin-top:8px">六爻安静，无变卦。</p>`;
  // 世应 · 持世 · 六亲发动（六爻断卦要诀：世应为问事双方、持世为根基、动爻为机）
  const shiPos=SHI_BY_NAME[ben.name]||6, yingPos=(shiPos+3-1)%6+1;
  const _dzAt=i=>DZ_SEQ[i<3?down:up][i];
  const shiWu=DZ_WU[_dzAt(shiPos-1)], yingWu=DZ_WU[_dzAt(yingPos-1)];
  const shiQin=sixQin(gongWu,shiWu);
  let shiYing;
  if(SHENG[shiWu]===yingWu) shiYing='世生应——我生他，付出多于所得，事缓成、宜耐心经营。';
  else if(SHENG[yingWu]===shiWu) shiYing='应生世——得人外力相生，谋事多顺、宜借势而为。';
  else if(KE[shiWu]===yingWu) shiYing='世克应——我制于事，费力可成、宜主动争取。';
  else if(KE[yingWu]===shiWu) shiYing='应克世——外力掣肘，阻力在前、宜守不宜进。';
  else shiYing='世应比和——同心协力，事易谐、少波折。';
  const CHI_SHI={'父母':'<b style="color:var(--gold2)">持世</b>：父母持世——文书操心、事多迟滞，宜守成稳进，忌妄动冒进。','子孙':'<b style="color:var(--gold2)">持世</b>：子孙持世——安乐无忧、克去官鬼，宜休闲求安，不利求官谋职。','官鬼':'<b style="color:var(--gold2)">持世</b>：官鬼持世——忧患压身、压力在肩，宜谨慎防小人官非，事勿张扬。','妻财':'<b style="color:var(--gold2)">持世</b>：妻财持世——利求财谋利，然财克父母，文书学业事多受扰。','兄弟':'<b style="color:var(--gold2)">持世</b>：兄弟持世——耗财分利、朋友相争，防破财，合作钱财宜明算账。'};
  const DONG_JUE={'父母':'父母发动克子孙——子孙受损，利文书不利投资子嗣，宜护幼防耗。','子孙':'子孙发动伤官鬼——官鬼受制，利求医避灾，不利求官谋职。','官鬼':'官鬼发动克兄弟——兄弟受损，朋友同事有扰，防小人暗算。','妻财':'妻财发动克父母——文书长辈事受扰，利财不利学，签约宜慎。','兄弟':'兄弟发动克妻财——破财分利，防钱财流失，合作忌含糊。'};
  const dongJue=dongPos.map(p=>DONG_JUE[sixQin(gongWu,DZ_WU[_dzAt(p-1)])]).filter(Boolean);
  html+=`<div style="margin-top:8px"><span class="tag">世爻 ${shiPos}位 · ${shiQin}</span><span class="tag">应爻 ${yingPos}位</span></div>`;
  html+=`<p style="margin-top:6px"><b style="color:var(--gold2)">世应相看</b>：${shiYing}</p>`;
  if(CHI_SHI[shiQin]) html+=`<p>${CHI_SHI[shiQin]}</p>`;
  if(dongJue.length) html+=`<p><b style="color:var(--gold2)">六亲发动</b>（动爻为机）：${dongJue.join('；')}</p>`;
  else html+=`<p style="color:var(--muted);font-size:12px">六爻安静，无发动之爻，事机未显，宜静观其变。</p>`;
  /* 进阶：用神伏藏 · 三合局 · 墓库 · 化进/退（飞伏与旬空已并入逐爻） */
  const USE_QIN={事业:'官鬼',求财:'妻财',感情:'妻财',出行:'父母',健康:'官鬼',学业:'父母',诉讼:'官鬼',寻物:'妻财',决策:'世爻',求职:'官鬼',家宅:'父母',合作:'兄弟',求医:'子孙',孕事:'子孙',讨债:'妻财'};
  const useQin=USE_QIN[scene];
  const _dzOfPos=p=>DZ_SEQ[(p-1<3)?down:up][p-1];
  const visQin=[]; for(let i=0;i<6;i++) visQin.push(sixQin(gongWu,DZ_WU[_dzOfPos(i+1)]));
  let advHtml='';
  if(useQin && useQin!=='世爻' && !visQin.includes(useQin)){
    for(let i=0;i<6;i++){ const fq=sixQin(gongWu,DZ_WU[DZ_SEQ[palace][i]]); if(fq===useQin){ advHtml+='<p><b style="color:var(--gold2)">用神伏藏</b>：'+useQin+'不上本卦，伏于第'+(i+1)+'爻（'+DZ_SEQ[palace][i]+'·'+fq+'）；事机隐伏，须待引拔方显。</p>'; break; } }
  }
  const dzSet=[]; dongPos.forEach(p=>dzSet.push(_dzOfPos(p))); dzSet.push(dayZhi); dzSet.push(lM);
  const sanhe=liuSanHe(dzSet);
  if(sanhe) advHtml+='<p><b style="color:var(--gold2)">三合局</b>：'+sanhe.join('·')+' 成 '+DZ_WU[sanhe[0]]+'局——气类相合、事得助力，宜结同盟共济。</p>';
  const _muChk=(dz,lab)=>{ const m=LIU_MU[DZ_WU[dz]]; if(m && dzSet.includes(m)) return lab+'入'+m+'墓（'+DZ_WU[m]+'库）——气被收纳、事有阻滞，宜待冲开。'; return ''; };
  const muArr=[_muChk(shiWu,'世爻('+shiWu+')')]; dongPos.forEach(p=>{ const t=_muChk(_dzOfPos(p),'第'+p+'爻('+_dzOfPos(p)+')'); if(t) muArr.push(t); });
  if(useQin && useQin!=='世爻' && !visQin.includes(useQin)){ for(let i=0;i<6;i++){ const fq=sixQin(gongWu,DZ_WU[DZ_SEQ[palace][i]]); if(fq===useQin){ const t=_muChk(DZ_SEQ[palace][i],'用神伏('+DZ_SEQ[palace][i]+')'); if(t) muArr.push(t); break; } } }
  const muTxt=muArr.filter(Boolean); if(muTxt.length) advHtml+='<p><b style="color:var(--gold2)">墓库</b>：'+muTxt.join('；')+'</p>';
  if(bian){ const jt=[]; dongPos.forEach(p=>{ const fdz=_dzOfPos(p); const tdz=DZ_SEQ[(p-1<3)?bian.down:bian.up][p-1]; const t=liuJinTui(fdz,tdz); if(t) jt.push('第'+p+'爻 '+fdz+'→'+tdz+'：'+t); }); if(jt.length) advHtml+='<p><b style="color:var(--gold2)">化进/退</b>：'+jt.join('；')+'</p>'; }
  if(kw.length) advHtml+='<p style="color:var(--muted);font-size:12px">旬空：'+kw.join('、')+'（逢空之爻事多虚悬，待出空方实）。</p>';
  if(advHtml) html+=`<div style="margin-top:8px">${advHtml}</div>`;
  html+=`<div style="margin-top:10px"><span class="tag">逐爻细看</span></div>`+
    lines.map((l,i)=>{ const dz=DZ_SEQ[i<3?down:up][i]; const qin=sixQin(gongWu,DZ_WU[dz]);
      return `<p style="margin:4px 0;padding:5px 8px;border-left:2px solid rgba(184,169,138,.35);background:var(--r-subbg);font-size:12.5px;line-height:1.65">${_yaoLineSay(i,qin,l.change,ben.name)}<br><span style="color:var(--muted);font-size:11.5px">六神·${shen[i%6]}：${_shenSay(shen[i%6], ben.name+i)}</span></p>`;
    }).join('');
  html+=liuyaoSceneLine(scene, {shiYing, shiQin, dongJue, chiShi: CHI_SHI[shiQin]});
  if(dongPos.length && ben.yao && ben.yao.length){
    let dy='<h4 style="margin-top:10px">动爻之辞（《周易》本经）</h4>';
    dongPos.forEach(p=>{ dy+=`<p style="border-left:3px solid var(--gold);padding-left:8px;margin:6px 0;font-size:13px">第${p}爻动 · <b>${ben.yao[p-1]||''}</b></p>`; 
      if(ben.xiaoxiang && ben.xiaoxiang[p-1]) dy+=`<p style="border-left:3px solid #b48cff;padding-left:8px;margin:2px 0 6px 14px;font-size:12.5px;color:var(--muted)">〈小象〉${ben.xiaoxiang[p-1]}</p>`; });
    if(ben.yong && dongPos.length===6) dy+=`<p style="border-left:3px solid var(--gold);padding-left:8px;margin:6px 0;font-size:13px"><b>${ben.yong}</b>（用九/用六 · 六爻皆变）</p>`;
    html+=dy;
  }
  const hr=hexReading(up,down,dongPos.length,bian?bian.name:null);
  const liuOne='一句话：'+(hr[1].includes('发动')?'卦有发动、事在变动':hr[1].includes('安静')?'六爻安静、按部就班':'')+(hr[0].includes('生')?'，内外相济宜顺势':hr[0].includes('克')?'，阻力在前宜缓图':'，平稳可行')+'。';
  html+=`<h4>白话解读</h4><p>${liuOne}</p>${hr.map(x=>'<p>'+wrapTerms(x)+'</p>').join('')}<p style="color:var(--muted);font-size:12px;margin-top:6px">* 解读由卦象五行生克与动爻生成;卦是参考,事在人为。</p>`;
  html+=`<p style="color:var(--muted);font-size:12px;margin-top:8px">* 装卦/六亲/六神/世应依京房八宫真实规则（六亲基准取宫位五行，非下卦五行）；并列入飞伏·旬空·墓库·三合·化进/退·暗动。解读为参考，事在人为。</p></div>`;
  lastLiuyao={draw,html};
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ld=document.getElementById('liuyaoDraw'), lr=document.getElementById('liuyaoResult'), sk=document.getElementById('liuyaoSkip');
  if(reduce){ finishLiuyao(); return; }
  ld.innerHTML=draw;
  const hexWraps=[...ld.children].filter(c=>!c.querySelector('.pill'));
  const pills=[...ld.querySelectorAll('.pill')];
  const items=[...hexWraps, ...pills];
  items.forEach(it=>{ it.style.opacity=0; });
  lr.innerHTML='<div class="result" style="color:var(--muted)">三钱共掷，自下而上成卦…</div>';
  if(sk) sk.style.display='inline-block';
  let i=0;
  const step=()=>{ if(i<items.length){ const it=items[i]; it.style.opacity=1; if(it.animate) it.animate([{transform:'translateY(-26px) rotateY(180deg) scale(.82)',opacity:0},{transform:'translateY(5px) rotateY(0) scale(1.04)',opacity:1,offset:.7},{transform:'none',opacity:1}],{duration:480,easing:'cubic-bezier(.2,.8,.3,1)'}); i++; liuyaoTimer=setTimeout(step,160); } else { finishLiuyao(); } };
  liuyaoTimer=setTimeout(step,160);
};
document.getElementById('liuyaoSkip').onclick=()=>{ finishLiuyao(); };

/* ---------- 梅花易数（体用生克，真实规则） ---------- */
function numToTrigram(n){ const t=((n-1)%8+8)%8; return ['乾','兑','离','震','巽','坎','艮','坤'][t]; }
function bitsToTrigram(b0,b1,b2){ for(const t in JING){ if(JING[t][0]===b0 && JING[t][1]===b1 && JING[t][2]===b2) return t; } return null; }
/* 外应取象：起卦时所见所闻所动，归五行而参体用（梅花易数精髓之一） */
const MH_YING_MAP=[
  {wu:'金',keys:['钟','铃','锣','金','铁','刀','剑','钱','白','西','声','响','铃铛','金属','机器','车鸣']},
  {wu:'木',keys:['风','草','木','树','叶','青','东','书','纸','笔','竹','花','柳','绿','风吹']},
  {wu:'水',keys:['水','雨','河','流','黑','北','酒','泣','哭','云','潮','浪','液','饮']},
  {wu:'火',keys:['火','灯','电','红','南','光','喧','闹','烟','灶','闪','热','明']},
  {wu:'土',keys:['土','石','黄','中','山','地','静','尘','田','墙','土石','动土']}
];
function mhYingWu(txt){
  if(txt && txt.trim()){ for(const m of MH_YING_MAP){ if(m.keys.some(k=>txt.indexOf(k)>=0)) return {wu:m.wu, src:'外应·'+txt.trim()}; } }
  // 兜底：以当前时辰五行作天时应象
  let hz=2; try{ const _n=new Date(); const _lu=Solar.fromYmd(_n.getFullYear(),_n.getMonth()+1,_n.getDate()).getLunar(); const hr=_n.getHours(); hz=Math.floor((Math.ceil(hr/2))+1); }catch(e){}
  const zhi=ZHI[(hz-1)%12]; return {wu:DZ_WU[zhi]||'木', src:'天时应象·'+zhi+'时（'+ (DZ_WU[zhi]||'木') +'）'};
}
var meihuaTimer=null, lastMeihua={html:null};
function finishMeihua(){
  if(meihuaTimer){clearTimeout(meihuaTimer);meihuaTimer=null;}
  if(!lastMeihua.html) return;
  const r=document.getElementById('meihuaResult'); if(r) r.innerHTML=lastMeihua.html;
  const s=document.getElementById('meihuaSkip'); if(s) s.style.display='none';
}
/* 梅花动爻位次断语：动爻 1-6 位各 2 变体——补「逐位」白话，与六爻逐爻细看对应 */
const MH_DONG_POS=[
  ['动爻在初爻（根基之位）——变由根起，宜从源头改起，根基动则全卦摇','初爻动——事情要从最底层开始变，先立好根基','初爻发动——变在根底，宜夯实基础再图上层，莫急于表象'],
  ['动爻在二爻（近身之位）——变从自身起，先调整好自己，再论外事','二爻动——变就在你身边，主动应变比被动接受强','二爻发动——变近己身，宜先正己、修内功，外事自顺'],
  ['动爻在三爻（门户之位）——变在关口处，进退之间见真机，宜果断','三爻动——局面在门口打转，犹豫最误事，宜快断','三爻发动——变在门阙，进退一念间，宜当机立断、莫徘徊'],
  ['动爻在四爻（外援之位）——变赖外力，宜借人之力成己之事','四爻动——变从外部来，顺势接住，别硬顶','四爻发动——变借外势，宜结善缘、借东风，顺势者成'],
  ['动爻在五爻（核心之位）——变在主位，事之枢纽所在，一动全盘动','五爻动——变在核心处，牵一发而动全身，宜慎重','五爻发动——变在枢机，主事者动则全局动，宜谋定后动'],
  ['动爻在上爻（结局之位）——变在收尾处，防功亏一篑，宜看全局','上爻动——变在结尾处，越到后面越要稳住','上爻发动——变在终局，宜善始善终、防末路生波']
];
/* 梅花问事场景聚合判词（变量驱动·去模板） */
function meihuaSceneLine(scene, rB, dangTxt, xj, tiWu, yongWu){
  if(!scene) return '';
  const USE={事业:'官星（职位、上级）',求财:'财爻（进益、生意）',感情:'对方（情缘、媒妁）',出行:'远行（出方、动象）',健康:'病医（身体、调护）',学业:'文星（功名、试场）',诉讼:'对薄（官非、争讼）',寻物:'失物（物踪、去向）',决策:'所谋之事（行止）',求职:'职位（聘方、机遇）',家宅:'宅基（家宅、居所）',合作:'合伙（共进退、分利）',求医:'医药（药石、化解）',孕事:'子息（孕育、新生）',讨债:'所欠（债务、追讨）'};
  const use=USE[scene]||'所问之事';
  const relShort={'用生体':'相生（得外助）','体生用':'相生（我耗力）','体克用':'相克（我制之）','用克体':'相克（我受制）','体用比和':'比和（内外合）'}[rB.rel]||rB.rel;
  let orient;
  if(rB.rel==='用生体') orient='外缘主动来合，宜顺势承接、勿推却';
  else if(rB.rel==='体生用') orient='我方需多付出，宜量力而行、勿强撑';
  else if(rB.rel==='体克用') orient='事在人为，宜主动争取、可图其成';
  else if(rB.rel==='用克体') orient='阻力明显临身，宜守稳待时、勿冒进';
  else orient='内外相合，宜守常道、按部就班';
  const mom = dangTxt.includes('体党势盛')?'我方根基强，宜主动出击把握主导': dangTxt.includes('用党势盛')?'外境力量大，宜借力顺势、勿强争':'势均力敌，宜权衡进退、以静制动';
  const tim = xj.includes('先吉后凶')?'先顺后滞，宜趁势早收、勿恋战': xj.includes('先凶后吉')?'先阻后通，宜坚忍守得云开':'始终一贯，按计划推进即可';
  return `<p style="margin-top:8px;padding:6px 8px;border-left:3px solid var(--gold2);background:rgba(255,255,255,.03)">【问${scene} · 聚合】此卦以${use}为用神，与身${relShort}——${orient}。${mom}；${tim}。</p>`;
}
document.getElementById('meihuaBtn').onclick=()=>{
  if(meihuaTimer){clearTimeout(meihuaTimer);meihuaTimer=null;}
  const mode=document.getElementById('mhMode').value;
  const scene=document.getElementById('mhScene')?document.getElementById('mhScene').value:'';
  let a,b,label;
  if(mode==='num'){ const v=document.getElementById('mhNum').value.split(','); a=parseInt(v[0]); b=parseInt(v[1]); if(!a||!b){hintResult('meihuaResult','请输入两个数字（逗号分隔，如 3,8）。');return;} label=`数字 ${a},${b}`; }
  else if(mode==='word'){ const w=document.getElementById('mhWord').value.trim(); if(w.length<2){hintResult('meihuaResult','请输入至少两个字。');return;}
    let s=0; for(const c of w){ try{ const ar=cnchar.stroke(c,'array'); s+=ar&&ar[0]?ar[0]:0; }catch(e){} }
    a=s; b=s; label=`「${w}」笔画 ${s}`;
  }
  else { const d=new Date(); const lunar=Solar.fromYmd(d.getFullYear(),d.getMonth()+1,d.getDate()).getLunar();
    const yZ=ZHI.indexOf(lunar.getYearZhi())+1; const mo=d.getMonth()+1, da=d.getDate();
    const hz=Math.floor((Math.ceil(d.getHours()/2))+1); // 时辰序数
    a=yZ+mo+da; b=a+hz; label=`此刻 年${yZ}月${mo}日${da}时${hz}`;
  }
  const up=numToTrigram(a), down=numToTrigram(b);
  const dong=((a+b-1)%6+6)%6+1;
  const bits=JING[down].concat(JING[up]); // 初..上
  const chBits=bits.slice(); chBits[dong-1]=1-chBits[dong-1];
  const ben=HEX_MAP[bits.join('')], bian=HEX_MAP[chBits.join('')];
  const tiWu=JING_WU[down], yongWu=JING_WU[up];
  const huDown=bitsToTrigram(bits[1],bits[2],bits[3]), huUp=bitsToTrigram(bits[2],bits[3],bits[4]); // 互卦：下互=二三四爻，上互=三四五爻
  const huDownWu=huDown?JING_WU[huDown]:null, huUpWu=huUp?JING_WU[huUp]:null;
  const rHuTi=huDownWu?tyRel(tiWu,huDownWu):null; // 体互与体（事之中段·自身）
  const rHuYong=huUpWu?tyRel(yongWu,huUpWu):null; // 用互与用（事之中段·所问）
  function tyRel(ti,yo){
    if(SHENG[yo]===ti) return {rel:'用生体',ju:'大吉，外力相生、所求易成。',lvl:2};
    if(SHENG[ti]===yo) return {rel:'体生用',ju:'小耗，我方付出多、宜量力而行。',lvl:-1};
    if(KE[ti]===yo) return {rel:'体克用',ju:'小吉，努力可成、宜主动争取。',lvl:0};
    if(KE[yo]===ti) return {rel:'用克体',ju:'凶，阻力大、宜守不宜进。',lvl:-2};
    return {rel:'体用比和',ju:'吉，内外相合、诸事顺遂。',lvl:1};
  }
  const rB=tyRel(tiWu,yongWu);
  const rY=tyRel(tiWu,JING_WU[bian.up]);
  const dongWhere=dong<=3?'动爻在体（我方有变）':'动爻在用（外境有变）';
  const yingRaw=(document.getElementById('mhYing')?document.getElementById('mhYing').value:'');
  const ying=mhYingWu(yingRaw);
  const rYing=tyRel(tiWu,ying.wu); // 外应五行 vs 体
  // 体党/用党 + 卦气旺衰（月令五行生体用）+ 各卦事象
  let lM='寅'; try{ const _n=new Date(); const _lu=Solar.fromYmd(_n.getFullYear(),_n.getMonth()+1,_n.getDate()).getLunar(); lM=_lu.getMonthZhi(); }catch(e){}
  const yueWu=DZ_WU[lM]||'木';
  const tiWang=(SHENG[yueWu]===tiWu||yueWu===tiWu)?1:0;
  const yongWang=(SHENG[yueWu]===yongWu||yueWu===yongWu)?1:0;
  const tiDang=1+(SHENG[yongWu]===tiWu?1:0)+tiWang;
  const yongDang=1+(SHENG[tiWu]===yongWu?1:0)+yongWang;
  const WU_XIANG={'金':'刚决收敛、肃杀，事多果决但防过刚','木':'生发条达、仁德，事多生长但防虚浮','水':'智慧流通、润下，事多变化宜以变应变','火':'礼明显达、炎上，事多显扬但防急烈','土':'诚信厚实、承载，事多安稳宜守正'};
  const dangTxt = tiDang>yongDang?'<b style="color:var(--gold2)">体党势盛</b>——我方根基强，宜主动出击、把握主导。' : tiDang<yongDang?'<b style="color:var(--gold2)">用党势盛</b>——外境力量大，宜借力顺势、勿强争。' : '体用势均——内外相当，宜权衡进退、以静制动。';
  const qiTxt = (tiWang?'体卦得月令（'+yueWu+'）生旺，时机相扶；':yongWang?'用卦得月令（'+yueWu+'）生旺，外缘有力；':'月令（'+yueWu+'）于体用无旺衰之偏，中平之时。');
  const xiangTxt = '用卦属'+yongWu+'（'+WU_XIANG[yongWu]+'）。';
  let xj;
  if(rB.lvl>rY.lvl) xj='本卦'+rB.rel+'（吉），变卦'+rY.rel+'（转弱）——<b style="color:var(--gold2)">先吉后凶</b>：初顺后滞，宜趁势早收、勿恋战。';
  else if(rB.lvl<rY.lvl) xj='本卦'+rB.rel+'（弱），变卦'+rY.rel+'（转强）——<b style="color:var(--gold2)">先凶后吉</b>：初阻后通，宜坚忍守得云开。';
  else xj='本卦与变卦体用相若——始终一贯，'+rB.ju;
  const hr=hexReading(up,down,1,bian.name);
  let huHtml='';
  if(huDown&&huUp){
    huHtml=`<p style="font-size:13px;margin-top:4px"><b style="color:var(--gold2)">互卦</b>：下互（二三四爻）<b>${huDown}卦</b> · 上互（三四五爻）<b>${huUp}卦</b><br><span style="font-size:12px;color:var(--muted)">体互(${huDown}·${huDownWu})与体${rHuTi.rel}、用互(${huUp}·${huUpWu})与用${rHuYong.rel}——互卦主事之中段，宜观其承转。</span></p>`;
  }
  const yingRelTxt={'用生体':'外应来生，天助我也，宜乘势','体生用':'外应耗我，宜多着力、勿轻心','体克用':'外应可控，主动则成','用克体':'外应相扰，宜谨慎防变','体用比和':'外应平合，顺势即可'}[rYing.rel]||'';
  const yingHtml=`<p style="font-size:13px;margin-top:4px"><b style="color:var(--gold2)">外应</b>：${ying.src} —— 五行属${ying.wu}，${rYing.rel}（${rYing.ju}）${yingRelTxt?'；'+yingRelTxt:''}</p>`;
  const _mhT2B=bits.slice().reverse();
  const _mhChg=_mhT2B.map((_,i)=>(bits.length-1-i)===dong-1);
  const mhDraw=hexFigurePair(ben.name, _mhT2B, _mhChg, bian.name, chBits.slice().reverse());
  const html=`<div class="result">
    <h3>${ben.name}卦（本卦）</h3>
    ${mhDraw}
    <span class="tag">上 ${up}（用）</span><span class="tag">下 ${down}（体）</span>
    <p style="margin-top:8px">卦辞：${ben.ci}</p>`;
  // 梅花以本卦为体，故引本卦大象传（兼附彖传，变卦大象）
  if(HEX_DAXIANG[ben.name]) html+=`<div style="margin-top:8px;padding:8px 10px;background:rgba(110,180,255,.06);border-left:3px solid #6eb4ff;border-radius:4px"><div style="color:#6eb4ff;font-size:12px;margin-bottom:4px">本卦 · 大象传</div><div style="font-size:13px;line-height:1.8">${HEX_DAXIANG[ben.name]}</div></div>`;
  if(HEX_TUAN[ben.name]) html+=`<div style="margin-top:6px;padding:8px 10px;background:rgba(212,175,55,.06);border-left:3px solid var(--gold);border-radius:4px"><div style="color:var(--gold2);font-size:12px;margin-bottom:4px">本卦 · 彖传</div><div style="font-size:12px;line-height:1.7">${HEX_TUAN[ben.name]}</div></div>`;
  if(HEX_DAXIANG[bian.name]) html+=`<div style="margin-top:4px;padding:6px 10px;background:rgba(110,180,255,.04);border-left:3px solid #6eb4ff;border-radius:4px"><div style="color:#6eb4ff;font-size:12px;margin-bottom:2px">变卦 · 大象传</div><div style="font-size:12px;line-height:1.7;color:var(--muted)">${HEX_DAXIANG[bian.name]}</div></div>`;
  html+=`
    <p>体用关系：<b style="color:var(--gold2)">${rB.rel}</b> —— ${rB.ju}</p>
    <p style="font-size:13px">第 ${dong} 爻动（${dongWhere}）→ 变卦 <b style="color:var(--gold2)">${bian.name}卦</b></p>
    <p style="font-size:12.5px;color:var(--r-gold-soft);margin-top:4px">${MH_DONG_POS[dong-1][_hashStr(ben.name+'d'+dong)%MH_DONG_POS[dong-1].length]}</p>
    ${(ben.xiaoxiang&&ben.xiaoxiang[dong-1])?`<p style="font-size:12.5px;color:var(--muted);border-left:3px solid #b48cff;padding-left:8px;margin:6px 0 2px 0">第${dong}爻 · 〈小象〉${ben.xiaoxiang[dong-1]}</p>`:''}
    ${huHtml}
    <h4>白话解读</h4>
    <p>一句话：${rB.rel}（${rB.ju}）</p>
    <p>${wrapTerms('体用上，'+rB.rel+'——'+rB.ju)}</p>
    <p>${wrapTerms(dongWhere+'——问事时"体"为自身、"用"为所问之事，动爻落在'+(dong<=3?'自身这边，说明变化的主动权/责任在自己':'所问之事那边，说明外境正在起变化')+'。')}</p>
    <p>${wrapTerms(dangTxt+' '+qiTxt+xiangTxt)}</p>
    <p>${wrapTerms(xj)}</p>
    ${yingHtml}
    <p>${wrapTerms(hr[1])}</p>
    ${meihuaSceneLine(scene, rB, dangTxt, xj, tiWu, yongWu)}
    <p style="color:var(--muted);font-size:12px;margin-top:6px">* 解读由体用生克与动爻生成;卦是参考,事在人为。</p>
    <p style="color:var(--muted);font-size:12px;margin-top:8px">* 起卦：${label}；体用生克、互卦（下互/上互）、外应取象均为梅花易数真实法则。解读为参考，事在人为。</p></div>`;
  lastMeihua={html};
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lr=document.getElementById('meihuaResult'), sk=document.getElementById('meihuaSkip');
  if(reduce){ finishMeihua(); return; }
  lr.innerHTML='<div class="result" style="color:var(--muted)">起卦中，静心观想…</div>';
  if(sk) sk.style.display='inline-block';
  meihuaTimer=setTimeout(finishMeihua,620);
};
document.getElementById('meihuaSkip').onclick=()=>{ finishMeihua(); };
document.getElementById('mhMode').onchange=e=>{
  const v=e.target.value;
  document.getElementById('mhNumWrap').style.display = v==='num'?'block':'none';
  document.getElementById('mhWordWrap').style.display = v==='word'?'block':'none';
};

/* ---------- 紫微斗数（专业排盘：五行局·安星诀） ---------- */
document.getElementById('ziweiBtn').onclick=()=>{
  const d=document.getElementById('zvBirth').value; if(!d){hintResult('ziweiResult','请选择出生日期后再排盘。');return;}
  const [y,m,day]=d.split('-').map(Number);
  const h=parseInt(document.getElementById('zvHour').value);
  const gender=(document.getElementById('zvGender')||{}).value||'男';
  const ZIWEI_SCHOOL=document.getElementById('ziweiSchool').value;
  const lunar=Solar.fromYmd(y,m,day).getLunar();
  const sx=lunar.getYearShengXiao();
  const yearGan=lunar.getYearGan();
  const hz=Math.floor((h+1)/2);                          // 时辰序数 1-12
  // 命宫：寅起正月顺数至月、逆数至时辰
  const ming=((2+(m-1)-(hz-1))%12+12)%12;
  const shen=((ming+(hz-1))%12+12)%12;                  // 身宫：顺数至时辰
  // 命宫干支（五虎遁年起月）
  const mingZhi=ZHI[ming];
  const mingGanIdx=(GAN_IDX[WUHU[yearGan]]+((ming-2)%12+12)%12)%10;
  const mingGan=GAN[mingGanIdx];
  const mingGZ=mingGan+mingZhi;
  // 五行局（命宫纳音五行定局）
  const ju=JU_BY_WU[NA_YIN_WU[mingGZ]]||2;
  // 大限：五行局 ju 岁起限（水2/木3/金4/土5/火6），每宫 10 年；阳男阴女顺行、阴男阳女逆行
  const yang=GAN_YIN[yearGan]===1;
  const dir=((yang&&gender==='男')||(!yang&&gender==='女'))?1:-1;
  const limitOf=k=>{ const steps=((((k-ming)*dir)%12)+12)%12; const s=ju+steps*10; return s+'-'+(s+9); };
  // 起紫微：寅起，按局数循环数到生日
  let r=day%ju; if(r===0) r=ju;
  const zv=((2+(r-1))%12+12)%12;
  // 紫微星系（逆布，每宫一步）
  const ZV_SYS=[['紫微',0],['天机',-1],['太阳',-2],['武曲',-3],['天同',-4],['廉贞',-5]];
  // 天府星系（顺布，每宫一步）；天府在紫微对宫对称位 (12-zv)
  const tf=((12-zv)%12+12)%12;
  const TF_SYS=[['天府',0],['太阴',1],['贪狼',2],['巨门',3],['天相',4],['天梁',5],['七杀',6],['破军',7]];
  const starMap={};
  ZV_SYS.forEach(([s,off])=>{ const z=((zv+off)%12+12)%12; starMap[ZHI[z]]=(starMap[ZHI[z]]||'')+s+' '; });
  TF_SYS.forEach(([s,off])=>{ const z=((tf+off)%12+12)%12; starMap[ZHI[z]]=(starMap[ZHI[z]]||'')+s+' '; });
  // 辅星：左辅(辰起顺至时辰) 右弼(戌起逆) 文昌(戌起顺) 文曲(辰起逆) 禄存(年干禄地)
  const zuo=((4+(hz-1))%12+12)%12; starMap[ZHI[zuo]]=(starMap[ZHI[zuo]]||'')+'左辅 ';
  const you=((10-(hz-1))%12+12)%12; starMap[ZHI[you]]=(starMap[ZHI[you]]||'')+'右弼 ';
  const wc=((10+(hz-1))%12+12)%12; starMap[ZHI[wc]]=(starMap[ZHI[wc]]||'')+'文昌 ';
  const wq=((4-(hz-1))%12+12)%12; starMap[ZHI[wq]]=(starMap[ZHI[wq]]||'')+'文曲 ';
  const luc=ZHI_IDX[LUCUN[yearGan]]; starMap[ZHI[luc]]=(starMap[ZHI[luc]]||'')+'禄存 ';
  // 四化（年干）
  const sh=SIHUA[yearGan], HUA=['禄','权','科','忌'];
  const allStars=[].concat(ZV_SYS.map(x=>x[0]),TF_SYS.map(x=>x[0]),['左辅','右弼','文昌','文曲','禄存']);
  const huaMap={};
  for(const s of allStars){ for(const z in starMap){ if(starMap[z].indexOf(s)>=0){ huaMap[z]=huaMap[z]||{}; huaMap[z][s]=true; } } }
  const PALACES=['命宫','兄弟','夫妻','子女','财帛','疾厄','迁移','交友','官禄','田宅','福德','父母'];
  // 每宫干支：命宫干支定，其余宫随地支顺行、天干每宫+1（专业盘面可核验）
  const gzOf=i=>GAN[((mingGanIdx+((i-ming)%12+12)%12)%10)]+ZHI[i];
  const palaces=ZHI.map((z,i)=>({z,name:PALACES[((i-ming)%12+12)%12]}));
  // 大限四化（大限宫干飞禄权科忌，叠在本命四化之上，十年一转运机随宫转换）
  let daXianHuaMap={}, dxGan='', dxIdx=-1, dxFly='', dxAge='';
  try{
    const now=new Date();
    let age=now.getFullYear()-y-((now.getMonth()+1<m||(now.getMonth()+1===m&&now.getDate()<day))?1:0);
    if(age<0) age=0;
    for(let i=0;i<12;i++){ const rr=limitOf(i).split('-'); const s0=+rr[0], s1=+rr[1]; if(age>=s0&&age<=s1){ dxIdx=i; break; } }
    if(dxIdx<0) dxIdx=((dir>0)?11:0);
    dxAge=limitOf(dxIdx);
    dxGan=gzOf(dxIdx).charAt(0);
    if(SIHUA[dxGan]){
      daXianHuaMap={};
      for(const s of allStars){ for(const z in starMap){ if(starMap[z].indexOf(s)>=0){ daXianHuaMap[z]=daXianHuaMap[z]||{}; daXianHuaMap[z][s]=true; } } }
      const dxSh=SIHUA[dxGan];
      dxFly=dxSh.map((s,j)=>{ for(const z in daXianHuaMap){ if(daXianHuaMap[z][s]) return HUA[j]+'入'+palaces[((ZHI.indexOf(z)-ming)%12+12)%12].name+'宫'; } return HUA[j]+'—'; }).join(' · ');
    }
  }catch(e){}
  const liuYear=new Date().getFullYear();
  let liuZhi='', liuMingIdx=-1, liuGan='';
  try{ const ll=Solar.fromYmd(liuYear,1,1).getLunar(); liuZhi=ll.getYearZhi(); liuGan=ll.getYearGan(); liuMingIdx=ZHI.indexOf(liuZhi); }catch(e){}
  const liuOf=k=> liuMingIdx>=0 ? PALACES[((k-liuMingIdx)%12+12)%12] : '';
  let ziweiSent='平';
  /* 流年神煞：流年干支 → 落宫（四化禄权科忌 / 禄存 / 文昌 / 桃花驿马华盖，依流年干支三合局） */
  const liuShenMap={};
  try{
    const starToZhi={}; for(const z in starMap){ (starMap[z].trim().split(/\s+/)).forEach(s=>{ if(s) starToZhi[s]=z; }); }
    if(liuGan){
      const lsh4=SIHUA[liuGan], HUA4=['禄','权','科','忌'];
      const _ji=lsh4.filter((s,j)=>HUA4[j]==='禄'||HUA4[j]==='科').length, _x=lsh4.filter((s,j)=>HUA4[j]==='忌').length; ziweiSent=_ji>_x?'吉':_x>_ji?'凶':'平';
      lsh4.forEach((s,j)=>{ const z=starToZhi[s]; if(z)(liuShenMap[z]=liuShenMap[z]||[]).push('流年'+HUA4[j]); });
      const lz=LUCUN[liuGan]; if(lz)(liuShenMap[lz]=liuShenMap[lz]||[]).push('流年禄存');
      const lwc={'甲':'巳','乙':'午','丙':'申','丁':'酉','戊':'申','己':'酉','庚':'亥','辛':'戌','壬':'寅','癸':'卯'}[liuGan]; if(lwc)(liuShenMap[lwc]=liuShenMap[lwc]||[]).push('流年文昌');
    }
    const G2={'申子辰':['酉','寅','辰'],'寅午戌':['卯','申','戌'],'巳酉丑':['午','亥','丑'],'亥卯未':['子','巳','未']};
    const key2=liuZhi?Object.keys(G2).find(g=>g.indexOf(liuZhi)>=0):null;
    if(key2){ (liuShenMap[G2[key2][0]]=liuShenMap[G2[key2][0]]||[]).push('流年桃花'); (liuShenMap[G2[key2][1]]=liuShenMap[G2[key2][1]]||[]).push('流年驿马'); (liuShenMap[G2[key2][2]]=liuShenMap[G2[key2][2]]||[]).push('流年华盖'); }
  }catch(e){}
  /* 流年四化（流年干飞禄权科忌，叠在本命/大限四化之上，主一年重心与应事） */
  const liuHuaMap={}; let liuFly='';
  try{
    if(liuGan && SIHUA[liuGan]){
      const lsh4=SIHUA[liuGan];
      for(let j=0;j<4;j++){ const s=lsh4[j]; for(const z in starMap){ if(starMap[z].indexOf(s)>=0){ (liuHuaMap[z]=liuHuaMap[z]||{})[s]=HUA[j]; } } }
      liuFly=lsh4.map((s,j)=>{ for(const z in liuHuaMap){ if(liuHuaMap[z][s]) return HUA[j]+'入'+palaces[((ZHI.indexOf(z)-ming)%12+12)%12].name+'宫'; } return HUA[j]+'—'; }).join(' · ');
    }
  }catch(e){}
  let liuLuName='', liuJiName='';
  try{ for(const z in liuHuaMap){ for(const s in liuHuaMap[z]){ const pn=palaces[((ZHI.indexOf(z)-ming)%12+12)%12].name; if(liuHuaMap[z][s]==='禄') liuLuName=pn; if(liuHuaMap[z][s]==='忌') liuJiName=pn; } } }catch(e){}
  /* 三方四正主轴（每宫三方四正互为呼应，吉聚则顺、煞冲则波） */
  const ZW_S3={
    '命宫':'自我·财富·事业·环境——人生四梁八柱','兄弟':'手足·家宅·交友·身心','夫妻':'姻缘·事业·福泽·外缘','子女':'子嗣·外缘·田宅·文书',
    '财帛':'财源·事业·福泽·疾厄','疾厄':'身心·事业·外缘·财源','迁移':'外缘·福泽·疾厄·自我','交友':'人际·田宅·疾厄·手足',
    '官禄':'事业·自我·财富·迁移','田宅':'家宅·手足·交友·子嗣','福德':'福泽·夫妻·官禄·迁移','父母':'长辈·田宅·福泽·兄弟'
  };
  function s3qRow(i){
    try{
      const idxs=[i,(i+4)%12,(i+8)%12,(i+6)%12];
      const names=idxs.map(j=>{ const nm=palaces[j].name; return j===i?('【'+nm+'·本宫】'):nm; }).join(' · ');
      const zhu=ZW_S3[palaces[i].name]||'三方四正互为呼应，吉聚则顺、煞冲则波';
      return '<div class="zw-d-row"><span>三方四正</span>'+names+'　<span style="color:var(--muted);font-size:12px">（'+zhu+'）</span></div>';
    }catch(e){ return ''; }
  }
  /* 流月 / 流日 落宫（当前农历月/日地支） */
  let liuYueIdx=-1, liuRiIdx=-1;
  try{
    const nowL=Solar.fromYmd(new Date().getFullYear(),new Date().getMonth()+1,new Date().getDate()).getLunar();
    const yz=nowL.getMonthZhi(), rz=nowL.getDayZhi();
    liuYueIdx=ZHI.indexOf(yz); liuRiIdx=ZHI.indexOf(rz);
  }catch(e){}
  /* 三合派：三方四正（命宫 + 三合地支 + 对宫）高亮 + 星曜旺衰（依五行生克推演） */
  const sanheSet=new Set();
  if(ZIWEI_SCHOOL==='sanhe'){ sanheSet.add(ming); sanheSet.add((ming+4)%12); sanheSet.add((ming+8)%12); sanheSet.add((ming+6)%12); }
  const STAR_WU={'紫微':'土','天机':'木','太阳':'火','武曲':'金','天同':'水','廉贞':'火','天府':'土','太阴':'水','贪狼':'木','巨门':'水','天相':'水','天梁':'土','七杀':'金','破军':'水','左辅':'土','右弼':'水','文昌':'金','文曲':'水','禄存':'土'};
  const wangOf=(star,zhi)=>{ const sw=STAR_WU[star]; if(!sw) return ''; const zw=DZ_WU[zhi];
    if(sw===zw) return '庙'; if(SHENG[zw]===sw) return '旺'; if(SHENG[sw]===zw) return '得'; if(KE[zw]===sw) return '陷'; if(KE[sw]===zw) return '利'; return '平'; };
  /* 十四主星 → 六大领域标签（贵·财·谋·动·福·才情），用于逐宫断语融合 */
  const STAR_TAG={'紫微':'贵','太阳':'贵','武曲':'财','天府':'财','天机':'谋','巨门':'谋','七杀':'动','破军':'动','天同':'福','天梁':'福','天相':'福','廉贞':'才情','贪狼':'才情','太阴':'才情'};
  /* 十二宫逐宫断语：每宫×六类，各 2 变体；◇=星名占位（渲染时替换）。命宫用 _zwPick/_zwFuse，此处留空 */
  const ZW_GONG={
    '兄弟':{贵:['◇坐兄弟——手足中有出息者，可借力但别依赖','◇入兄弟——手足带贵气，彼此提携多助'],财:['◇坐兄弟——手足务实重财，宜明算账免伤情','◇入兄弟——手足各凭本事，钱财分明才长久'],谋:['◇坐兄弟——手足多思善谋，遇事可参谋','◇入兄弟——手足点子多，宜多沟通少猜忌'],动:['◇坐兄弟——手足各自闯荡，聚少离多','◇入兄弟——手足性子冲，宜让三分保和气'],福:['◇坐兄弟——手足和顺，互相照应','◇入兄弟——手足知足，关系融洽少争执'],才情:['◇坐兄弟——手足多才多情，各有各的圈子','◇入兄弟——手足人缘好，但关系仍需用心经营']},
    '夫妻':{贵:['◇坐夫妻——配偶有威仪，宜敬重相待','◇入夫妻——伴侣有主见，家中各司其职'],财:['◇坐夫妻——配偶务实持家，宜共管财','◇入夫妻——伴侣重物质，共财之外也留私房'],谋:['◇坐夫妻——配偶聪慧善谋，遇事多商量','◇入夫妻——伴侣心思细，多聊少猜才亲'],动:['◇坐夫妻——配偶强势好动，聚少离多需信任','◇入夫妻——伴侣个性冲，磨合期宜各退一步'],福:['◇坐夫妻——配偶温和体贴，婚姻顺遂','◇入夫妻——伴侣知足，相处舒服就是福'],才情:['◇坐夫妻——配偶多才多情，魅力强','◇入夫妻——伴侣桃花旺，需互信筑底线']},
    '子女':{贵:['◇坐子女——子女有出息，可期可待','◇入子女——子嗣带贵，晚辈多助'],财:['◇坐子女——子女务实独立，宜早立规矩','◇入子女——子嗣重实际，培养一技之长'],谋:['◇坐子女——子女聪明好学，学业佳','◇入子女——子嗣善思，宜引导莫压制'],动:['◇坐子女——子女好动难管束，宜放手','◇入子女——子嗣个性强，硬管不如疏导'],福:['◇坐子女——子女乖顺省心，晚年得济','◇入子女——子嗣有福，亲子关系融洽'],才情:['◇坐子女——子女多才，宜培养特长','◇入子女——子嗣敏感，多陪伴少比较']},
    '财帛':{贵:['◇坐财帛——财来有道，因名得利','◇入财帛——靠名气地位生财，名声就是资本'],财:['◇坐财帛——理财一把好手，善聚善守','◇入财帛——天生和钱打交道，宜经商理财'],谋:['◇坐财帛——以智生财，靠脑力吃饭','◇入财帛——谋划生财，投资前先算清账'],动:['◇坐财帛——财路在变动中，宜折腾','◇入财帛——钱靠闯出来，进财快出财也快'],福:['◇坐财帛——财来平稳，积少成多','◇入财帛——财运和顺，不愁衣食'],才情:['◇坐财帛——以才生财，靠才华与人脉','◇入财帛——财靠人缘，社交即财源']},
    '疾厄':{贵:['◇坐疾厄——体质尚可，注意心血管与火气','◇入疾厄——别太要强，硬撑最伤身'],财:['◇坐疾厄——肺金相关，注意呼吸系统','◇入疾厄——体质偏燥，宜润养忌辛'],谋:['◇坐疾厄——思虑伤脾，宜少想多做','◇入疾厄——神经易紧，宜放松作息'],动:['◇坐疾厄——易外伤冲动，注意安全','◇入疾厄——肝火旺，宜制怒养肝'],福:['◇坐疾厄——体质和顺，少有大病','◇入疾厄——底子好，别贪嘴享福过头'],才情:['◇坐疾厄——情绪影响身体，宜调情志','◇入疾厄——心思重，宜疏导别憋着']},
    '迁移':{贵:['◇坐迁移——外出有贵人，宜动不宜静','◇入迁移——在外有威信，能服众'],财:['◇坐迁移——外出求财，利奔波远行','◇入迁移——在外务实，异地有财机'],谋:['◇坐迁移——外出靠脑力，宜策划运筹','◇入迁移——在外多思，谋定而后动'],动:['◇坐迁移——外出多变，宜闯荡闯机','◇入迁移——在外不安分，变化中得机会'],福:['◇坐迁移——外出平顺，人缘好','◇入迁移——在外得福，随遇而安'],才情:['◇坐迁移——外出靠人缘，桃花在外','◇入迁移——在外多遇，宜社交拓圈']},
    '交友':{贵:['◇坐交友——朋友有层次，多贵人','◇入交友——圈子高，宜结交有识之士'],财:['◇坐交友——朋友务实，合作求财宜明账','◇入交友——圈子重利，亲兄弟明算账'],谋:['◇坐交友——朋友多谋士，可参谋','◇入交友——圈子聪明，宜交流点子'],动:['◇坐交友——朋友个性强，宜择友','◇入交友——圈子杂，防冲动之人'],福:['◇坐交友——朋友和善，多助力','◇入交友——圈子舒服，随和少争'],才情:['◇坐交友——朋友多才，社交广','◇入交友——圈子热闹，宜经营人脉']},
    '官禄':{贵:['◇坐官禄——事业有威，宜掌权挑梁','◇入官禄——职场能服众，可担大任'],财:['◇坐官禄——事业务实，宜经商实干','◇入官禄——职场重实效，能成事'],谋:['◇坐官禄——事业靠脑，宜策划幕僚','◇入官禄——职场善谋，智囊型人才'],动:['◇坐官禄——事业靠闯，开创型','◇入官禄——职场多变，宜创业破局'],福:['◇坐官禄——事业平稳，宜守成','◇入官禄——职场和顺，少风波'],才情:['◇坐官禄——事业靠才，宜创意','◇入官禄——职场靠人缘，多机缘']},
    '田宅':{贵:['◇坐田宅——家底厚，有祖业可承','◇入田宅——家中有威，能持家立业'],财:['◇坐田宅——善置产，家底渐丰','◇入田宅——宜早买房，拥产理财'],谋:['◇坐田宅——家中多谋，宜规划','◇入田宅——持家善算，日子精明'],动:['◇坐田宅——家宅多变，宜折腾','◇入田宅——居所不定，宜早定根基'],福:['◇坐田宅——家宅和顺，安居乐业','◇入田宅——持家有福，日子安稳'],才情:['◇坐田宅——家中温馨，重情','◇入田宅——持家细腻，宜经营氛围']},
    '福德':{贵:['◇坐福德——心气高，精神富足','◇入福德——内有格局，精神贵气'],财:['◇坐福德——务实心安，知足常乐','◇入福德——重实际，精神踏实'],谋:['◇坐福德——心思细密，宜修心','◇入福德——多思多虑，宜静坐少想'],动:['◇坐福德——内心不安，宜定心','◇入福德——精神多动，宜沉淀'],福:['◇坐福德——心宽福厚，享福命','◇入福德——精神和顺，知足常乐'],才情:['◇坐福德——内心丰富，多情思','◇入福德——精神敏感，宜养性']},
    '父母':{贵:['◇坐父母——父母有威，家教严','◇入父母——长辈有地位，得荫庇'],财:['◇坐父母——父母务实，家教重实际','◇入父母——长辈持家，得实惠'],谋:['◇坐父母——父母善谋，多叮咛','◇入父母——长辈多思，宜多沟通'],动:['◇坐父母——父母个性强，聚少离多','◇入父母——长辈好动，关系需磨合'],福:['◇坐父母——父母和善，家庭暖','◇入父母——长辈慈祥，得关爱'],才情:['◇坐父母——父母多才，重情感','◇入父母——长辈细腻，宜多陪伴']}
  };
  /* 逐宫断语：取该宫第一颗主星 → 查标签 → 查宫位断语池 → 哈希选变体，◇ 替换为星名。命宫用 _zwPick/_zwFuse，此处返回空 */
  function _zwGong(gong, ss){
    if(gong==='命宫'||!ss) return '';
    const ms=ss.trim().split(/\s+/).map(s=>s.replace(/\(.*?\)/g,'')).find(s=>STAR_TAG[s]);
    if(!ms) return '';
    const tag=STAR_TAG[ms]; const pool=ZW_GONG[gong]&&ZW_GONG[gong][tag];
    if(!pool) return '';
    return pool[_hashStr(ms+'|'+gong)%pool.length].replace(/◇/g,ms);
  }
  /* 辅星专属断语：左辅/右弼/文昌/文曲/禄存 ×2 变体，{宫} 占位——辅星落宫即该域得助 */
const ZW_FU={
  '左辅':['左辅入{宫}——得同辈与部属之助，此域做事不孤','左辅坐{宫}——有帮手帮衬，多一人多一分力','左辅临{宫}——贵人暗扶，协作之事易成，宜借力打配合'],
  '右弼':['右弼入{宫}——有贵人暗助，关键处常有人拉一把','右弼坐{宫}——人缘隐助，此域逢困易解','右弼临{宫}——辅佐之象，难题有人兜底，宜顺势借势'],
  '文昌':['文昌入{宫}——利文书学业，此域多文气','文昌坐{宫}——文墨有缘，考试签约之事顺','文昌临{宫}——笔头生辉，此域宜写宜考宜定稿'],
  '文曲':['文曲入{宫}——利才艺口才，此域显灵慧','文曲坐{宫}——才情外放，此域宜展艺','文曲临{宫}——巧思灵动，此域宜创意表达、以巧破局'],
  '禄存':['禄存入{宫}——财禄安稳，此域少破耗','禄存坐{宫}——根基渐厚，此域宜积累','禄存临{宫}——库中有藏，此域财稳事固，宜守不宜冒']
};
  function _zwFuSay(ss, gong){
    if(!ss) return '';
    const out=[];
    const stars=ss.trim().split(/\s+/).map(s=>s.replace(/\(.*?\)/g,''));
    for(const f in ZW_FU){ if(stars.includes(f)){ const arr=ZW_FU[f]; out.push(arr[_hashStr(f+'|'+gong)%arr.length].replace(/\{宫\}/g, gong)); } }
    return out.join('');
  }
  const rows=palaces.map((p,i)=>{
    let stars=starMap[p.z]||'';
    if(huaMap[p.z]){ for(let j=0;j<4;j++){ const s=sh[j]; if(huaMap[p.z][s]) stars=stars.replace(s, s+'('+HUA[j]+')'); } }
    const isMing=(i===ming);
    const isLiu=(i===liuMingIdx);
    const isYue=(i===liuYueIdx);
    const isRi=(i===liuRiIdx);
    const liuName=liuOf(i);
    const lsh=(liuShenMap[p.z]||[]);
    const liuH=liuHuaMap[p.z]?Object.keys(liuHuaMap[p.z]).map(s=>'流年'+liuHuaMap[p.z][s]).join(' '):'';
    const cls=['zw-cell',isMing?'ming':'',isLiu?'liu-ming':'',isYue?'liu-yue':'',isRi?'liu-ri':'',sanheSet.has(i)?'zw-sanhe':''].filter(Boolean).join(' ');
    let wang='';
    if(ZIWEI_SCHOOL==='sanhe' && stars){ wang='<div class="zw-wang">'+(stars.trim().split(/\s+/).map(s=>{ const w=wangOf(s,p.z); return w?s+'·'+w:''; }).filter(Boolean).join(' '))+'</div>'; }
    const liuTags=[isYue?'<span class="zw-tag yue">流月</span>':'',isRi?'<span class="zw-tag ri">流日</span>':''].join('');
    const gongSay=_zwGong(p.name, stars);
    const fuSay=_zwFuSay(stars, p.name);
    return `<div class="${cls}"><div class="zw-name">${p.name}</div><div class="zw-gz">${gzOf(i)}</div>${stars?`<div class="zw-stars">${stars.trim()}</div>`:''}${gongSay?`<div class="zw-gong-say">${gongSay}</div>`:''}${fuSay?`<div class="zw-fu-say">${fuSay}</div>`:''}${wang}${lsh.length?`<div class="zw-liu-shen">${lsh.join(' ')}</div>`:''}${liuH?`<div class="zw-liu-hua">${liuH}</div>`:''}<div class="zw-limit">大限 ${limitOf(i)} 岁</div>${liuName?`<div class="zw-liu">流年·${liuName}</div>`:''}${liuTags}</div>`;
  }).join('');
  /* 命宫主星性格白话：每星 2 变体，按命宫干支哈希确定性选词（同人不重样、异人不同句） */
  const ZW_C={
    '紫微':['帝星坐命——有领袖气、好面子、自尊心强,宜掌权不宜屈居人下,一生有贵人,但别太要强','紫微镇坐——天生自带主心骨,能镇场能担责,只是高处不胜寒,别什么都自己扛','紫微入命——自带贵气与担当,能服众;只是别把「要强」活成「要赢」,留三分给身边人'],
    '天机':['机敏善谋、点子多,适合智谋策划,但易想多做得少,宜行动先行','天机灵动——转得快看得远,天然军师命,缺的不是聪明,是落地的第一步','天机坐命——脑子比手快,宜把念头写下来逐个验,别让计划停在脑子里'],
    '太阳':['光明磊落、热心助人,人缘好,但火力易耗,别总为别人烧自己','太阳坐命——走到哪都带光,助人成癖,是人群里的暖源,记得给自己也留一份热','太阳照命——外向发光型,付出是你的本能,只是别燃到没了自己'],
    '武曲':['刚毅务实,财星坐命,执行力强、对钱有掌控力,说话直重实际,感情上多些温度','武曲掌财——敢拼敢赚、雷厉风行,天生和钱打交道的一把好手,硬之外别忘了软','武曲入命——务实到骨子里,能把事做成能把钱守住,只是柔声细语得练'],
    '天同':['随和知足、人缘佳、福气厚,是享福的命,但易安逸少进取,人生要有目标感','天同化福——天生好命、心宽少忧,最会「活着」的主星,只别把安逸过成懒散','天同坐命——福气厚、脾气好,轻松就讨人喜欢,只别让「舒服」绊住上进'],
    '廉贞':['才华横溢、多情重义、爱憎分明,魅力强,但情绪起伏大,宜修炼平常心','廉贞主才——多情且锋利,爱恨都浓、气场逼人,情绪来得快去得也快,学会自洽才不内耗','廉贞照命——才与情都浓,是人群里的焦点,只是心要定,别被情绪牵着走'],
    '天府':['稳重厚实,库星坐命,擅守财理财,格局稳,守成有余、开拓需外力推一把','天府坐库——天生会攒会守,家底与格局都在,是掌财好手,守成易、破局需多借力','天府入命——稳如磐石,能把日子过踏实,只是想再上一层,得敢借外势'],
    '太阴':['温柔细腻、心思敏感、重感情,适合幕后与文职,内心戏多,宜多表达少内耗','太阴主柔——温润含蓄、感知力强,宜静不宜燥,幕后文职最能发光,心事要说得出口才好','太阴坐命——细腻敏感、共情力强,适合安静做事,只是别把话都憋在心里'],
    '贪狼':['欲望与才华都旺,多才多艺、交际广、桃花重,越自律越能成大器','贪狼多才——兴趣广能量大,朋友满天下桃花也满,把欲望收拢成专注便是大器','贪狼照命——多面手、万人迷,潜力惊人,只别样样都沾却样样不深'],
    '巨门':['口才出众、爱辩理、逻辑强,但也易惹口舌是非,宜慎言守默','巨门主口——能说会道、逻辑缜密,靠嘴吃饭的命,话说七分留三分,是非自远','巨门入命——嘴是利器也是双刃,善辩能成事,守默能避祸'],
    '天相':['温和公正、协调强、仪表佳,能服众的福星,一生少大险','天相掌印——端庄有度、调和八方,天生让人信服,稳字当头,一生少大风浪','天相坐命——贵人相、妥帖人,走到哪都让人安心,只是别为了求稳丢了锋芒'],
    '天梁':['长者风范、正直慈悲,有逢凶化吉之象,但爱操心管闲事,易揽事上身','天梁化荫——天生有护人之心,遇险常能化吉,只是操心易过界,别人的因果少揽','天梁照命——自带荫庇,关键时刻常有人拉一把,只是别把「帮忙」变成「包办」'],
    '七杀':['勇猛果决、冲劲足,先苦后成,适合开创性事业,性子急宜培养耐心','七杀当令——敢闯敢冲、杀伐果断,天生开疆拓土的将才,快之外慢下来更稳','七杀入命——冲劲十足的实干家,能成大事,只是熄火比点火难,留点余力'],
    '破军':['变革力强、破旧立新、不甘平淡,人生起伏大,成也大胆败也大胆,宜谋定后动','破军主变——天生破局者,不破不立、一生大起大落,大胆之外先谋后动可避大险','破军坐命——不安分、爱颠覆,能把死局盘活,只是别为变而变,方向上先想清']
  };
  const _zh=_hashStr(mingGZ||'');
  const _zwPick=s=>{ const v=ZW_C[s]; return v?v[_zh%v.length]:''; };
  /* 星·宫融合：主星五行 × 命宫地支五行（自包含，不需八字），给「同气/得生/泄秀/受克/制化/中和」专属句——继续深挖紫微喜忌 */
  function _zwFuse(s,ming){
    const sw=STAR_WU[s]; if(!sw) return '';
    const zh=ZHI[ming]; const zw=DZ_WU[zh]; if(!zw) return '';
    const rel = sw===zw ? '同气' : SHENG[zw]===sw ? '得生' : SHENG[sw]===zw ? '泄秀' : KE[zw]===sw ? '受克' : KE[sw]===zw ? '制化' : '中和';
    const POOL={
      '同气':['（星·宫）'+s+'属'+sw+'、命宫落'+zh+'亦属'+sw+'——同气相应，这颗星在你盘上根基最厚，特质发挥得最透。','（星·宫）'+s+'（'+sw+'）坐命宫（'+zh+'·'+sw+'），五行同气——星得宫养，底色被放大，长更长、短也别无视。'],
      '得生':['（星·宫）'+s+'属'+sw+'、命宫'+zh+'属'+zw+'——宫来生星，得地得助，这颗星的能量顺畅外显，行事多顺。','（星·宫）'+s+'（'+sw+'）落命宫（'+zh+'·'+zw+'），宫生星——如鱼得水，特质自然流露，少费力多成。'],
      '泄秀':['（星·宫）'+s+'属'+sw+'、命宫'+zh+'属'+zw+'——星生宫，泄秀之格，才华外放但易耗，宜留三分给自己。','（星·宫）'+s+'（'+sw+'）坐命宫（'+zh+'·'+zw+'），星生宫——你习惯把能量给出去，记得回流，别掏空。'],
      '受克':['（星·宫）'+s+'属'+sw+'、命宫'+zh+'属'+zw+'——星受宫克，这颗星的力量被压，特质换个方式使，别硬顶。','（星·宫）'+s+'（'+sw+'）落命宫（'+zh+'·'+zw+'），宫克星——天赋遇阻，宜借他宫他星补足，莫单打独斗。'],
      '制化':['（星·宫）'+s+'属'+sw+'、命宫'+zh+'属'+zw+'——星制宫，你能镇得住场面，但锋芒别太利，留点余地。','（星·宫）'+s+'（'+sw+'）坐命宫（'+zh+'·'+zw+'），星制宫——有掌控力是好事，只是别把掌控变控制。'],
      '中和':['（星·宫）'+s+'属'+sw+'、命宫'+zh+'属'+zw+'——五行中和，这颗星不偏不倚，特质平稳发挥，宜顺势。','（星·宫）'+s+'（'+sw+'）落命宫（'+zh+'·'+zw+'），中和平稳——星宫无冲克，底色清正，按本色走就好。']
    };
    const arr=POOL[rel]||POOL['中和'];
    return arr[_hashStr(s+'|'+ming)%arr.length];
  }
  /* ===== 紫微星盘 hero（视觉签名）：十二宫圆盘 + 三方四正金线 ===== */
  const ZW_CX=280, ZW_CY=238, ZW_R=204, ZW_R0=90;
  const zwPt=(i,r)=>{ const a=(-90+i*30)*Math.PI/180; return [ZW_CX+r*Math.cos(a), ZW_CY+r*Math.sin(a)]; };
  const zwSector=(i,r0,r1)=>{
    const d2r=Math.PI/180, a0=(-90+i*30-15)*d2r, a1=(-90+i*30+15)*d2r;
    const x0=(ZW_CX+r1*Math.cos(a0)).toFixed(1), y0=(ZW_CY+r1*Math.sin(a0)).toFixed(1);
    const x1=(ZW_CX+r1*Math.cos(a1)).toFixed(1), y1=(ZW_CY+r1*Math.sin(a1)).toFixed(1);
    const x2=(ZW_CX+r0*Math.cos(a1)).toFixed(1), y2=(ZW_CY+r0*Math.sin(a1)).toFixed(1);
    const x3=(ZW_CX+r0*Math.cos(a0)).toFixed(1), y3=(ZW_CY+r0*Math.sin(a0)).toFixed(1);
    return 'M'+x0+' '+y0+'A'+r1+' '+r1+' 0 0 1 '+x1+' '+y1+'L'+x2+' '+y2+'A'+r0+' '+r0+' 0 0 0 '+x3+' '+y3+'Z';
  };
  let zwSec='', zwTxt='';
  for(let i=0;i<12;i++){
    const z=ZHI[i];
    const pname=(palaces[i]&&palaces[i].name)||PALACES[((i-ming)%12+12)%12];
    const isM=(i===ming), isS=(i===shen), isL=(i===liuMingIdx);
    if(isM) zwSec+='<path d="'+zwSector(i,ZW_R0,ZW_R)+'" fill="var(--gold)" fill-opacity=".15"/>';
    else if(sanheSet.has(i)) zwSec+='<path d="'+zwSector(i,ZW_R0,ZW_R)+'" fill="var(--ink)" fill-opacity=".05"/>';
    if(isL) zwSec+='<path d="'+zwSector(i,ZW_R0,ZW_R)+'" fill="none" stroke="var(--bad)" stroke-opacity=".5" stroke-width="1.4"/>';
    const a0=(-90+i*30-15)*Math.PI/180;
    zwSec+='<line x1="'+(ZW_CX+ZW_R0*Math.cos(a0)).toFixed(1)+'" y1="'+(ZW_CY+ZW_R0*Math.sin(a0)).toFixed(1)+'" x2="'+(ZW_CX+ZW_R*Math.cos(a0)).toFixed(1)+'" y2="'+(ZW_CY+ZW_R*Math.sin(a0)).toFixed(1)+'" stroke="var(--ink)" stroke-opacity=".15"/>';
    const gp=zwPt(i,104); zwTxt+='<text x="'+gp[0].toFixed(1)+'" y="'+(gp[1]+3).toFixed(1)+'" text-anchor="middle" font-size="9" fill="var(--muted)">'+gzOf(i)+'</text>';
    const np=zwPt(i,125); zwTxt+='<text x="'+np[0].toFixed(1)+'" y="'+(np[1]+4).toFixed(1)+'" text-anchor="middle" font-size="12.5" font-family="serif" fill="'+(isM?'var(--gold2)':'var(--ink)')+'" letter-spacing="1">'+pname+(isS?'·身':'')+'</text>';
    let st=(starMap[z]||'').trim();
    if(huaMap[z]){ for(let j=0;j<4;j++){ const s0=sh[j]; if(huaMap[z][s0]) st=st.replace(s0,s0+'('+HUA[j]+')'); } }
    (st?st.split(/\s+/).slice(0,3):[]).forEach((s,k)=>{ const sp=zwPt(i,147+k*14); zwTxt+='<text x="'+sp[0].toFixed(1)+'" y="'+(sp[1]+3.5).toFixed(1)+'" text-anchor="middle" font-size="10" fill="var(--ink-soft)">'+s+'</text>'; });
    const zp=zwPt(i,192); zwTxt+='<text x="'+zp[0].toFixed(1)+'" y="'+(zp[1]+3.8).toFixed(1)+'" text-anchor="middle" font-size="11" fill="var(--gold-soft)">'+z+'</text>';
  }
  let zwSan='';
  [[ming,(ming+4)%12],[(ming+4)%12,(ming+8)%12],[(ming+8)%12,ming]].forEach(pr=>{
    const A=zwPt(pr[0],ZW_R0), B=zwPt(pr[1],ZW_R0);
    zwSan+='<line x1="'+A[0].toFixed(1)+'" y1="'+A[1].toFixed(1)+'" x2="'+B[0].toFixed(1)+'" y2="'+B[1].toFixed(1)+'" stroke="var(--gold)" stroke-opacity=".55" stroke-width="1.3"/>';
  });
  { const A=zwPt(ming,ZW_R0), B=zwPt((ming+6)%12,ZW_R0);
    zwSan+='<line x1="'+A[0].toFixed(1)+'" y1="'+A[1].toFixed(1)+'" x2="'+B[0].toFixed(1)+'" y2="'+B[1].toFixed(1)+'" stroke="var(--gold)" stroke-opacity=".42" stroke-width="1.2" stroke-dasharray="5 4"/>'; }
  const _ms=(starMap[ZHI[ming]]||'').trim().split(/\s+/).filter(Boolean);
  const zwMain=_ms.find(s=>ZW_C[s])||_ms[0]||'无主星';
  const zwCenter='<circle class="sc-core" cx="'+ZW_CX+'" cy="'+ZW_CY+'" r="'+(ZW_R0+16)+'" fill="url(#zwGlow)"/>'
    +'<circle cx="'+ZW_CX+'" cy="'+ZW_CY+'" r="'+ZW_R0+'" fill="var(--glass-strong)" fill-opacity=".9" stroke="var(--gold)" stroke-opacity=".32"/>'
    +'<text x="'+ZW_CX+'" y="'+(ZW_CY-30)+'" text-anchor="middle" font-size="10.5" fill="var(--muted)" letter-spacing="2">命宫主星</text>'
    +'<text x="'+ZW_CX+'" y="'+(ZW_CY+5)+'" text-anchor="middle" font-size="23" font-family="serif" fill="var(--ink)">'+zwMain+'</text>'
    +'<text x="'+ZW_CX+'" y="'+(ZW_CY+29)+'" text-anchor="middle" font-size="11" fill="var(--gold-soft)">'+(NA_YIN_WU[mingGZ]||'')+'（'+ju+'局）</text>'
    +'<text x="'+ZW_CX+'" y="'+(ZW_CY+49)+'" text-anchor="middle" font-size="9.5" fill="var(--muted)">身宫 '+ZHI[shen]+' · 大限'+(dir===1?'顺行':'逆行')+'</text>';
  const zwDefs='<defs><radialGradient id="zwGlow"><stop offset="60%" stop-color="var(--gold)" stop-opacity=".16"/><stop offset="100%" stop-color="var(--gold)" stop-opacity="0"/></radialGradient></defs>';
  const zwChart='<div class="starchart">'
    +'<div class="sc-seal">'+zwMain+'坐命</div>'
    +'<div class="sc-verdict"><p>'+(ZW_C[zwMain]?_zwPick(zwMain).split('；')[0]+'。':'命宫无主星，借对宫之力而立——性格随境而转，适应力就是你的长处。')+'</p></div>'
    +'<svg class="sc-svg" viewBox="0 0 560 480" data-nofx="1" role="img" aria-label="紫微命盘星图">'+zwDefs+zwSec+zwSan+zwCenter+zwTxt+'</svg>'
    +'<div class="sc-legend"><span><i></i>三方四正（命 · 财 · 官）</span><span><i class="l3"></i>对宫冲照（迁移）</span><span>金底＝命宫 · 朱框＝流年</span></div>'
    +'</div>';
  let zwRead='';
  try{
    const mingStar=starMap[ZHI[ming]]||'';
    const mStar=Object.keys(ZW_C).find(s=>mingStar.indexOf(s)>=0);
    const caiIdx=(ming+4)%12, guanIdx=(ming+8)%12, qianIdx=(ming+6)%12;
    const starAt=i=>{ const s=starMap[ZHI[i]]||''; return s? s.replace(/[（）]/g,'') : '无主星（借对宫）'; };
    const oneLine = mStar ? `一句话：${mStar}坐命——${_zwPick(mStar).split('；')[0].split('，')[0]}；命·财·官·迁四宫为人生主干，彼此生扶则顺、相克则波。`
                          : '一句话：命宫无主星（借对宫），性格随环境灵活、适应力强，需借他宫之势而立。';
    let sanText='';
    if(mStar){
      sanText = `命宫三方四正：命宫（${mStar}）、财帛宫（${starAt(caiIdx)}）、官禄宫（${starAt(guanIdx)}）构成你的「自我—财富—事业」主干；对宫迁移宫（${starAt(qianIdx)}）主外在环境与变动，是命宫的"镜子"。三方多吉星会聚则顺风顺水，若遇煞星（如擎羊、陀罗、火星）同宫则需注意该领域起伏。`;
    }
    zwRead=`<h4>白话解读</h4>
      <p>${oneLine}</p>
      ${mStar?`<p>${_zwPick(mStar)}。</p><p style="margin-top:7px;color:var(--r-gold-soft);font-size:13px;line-height:1.8">${_zwFuse(mStar, ming)}</p>`:''}
      ${sanText?`<p>${sanText}</p>`:''}
      <p>命宫大限 ${limitOf(ming)} 岁，此阶段奠定性格底色与早年根基；此后每十年换一宫，大限${dir===1?'顺行':'逆行'}推移，运势随之起伏流转。</p>
      ${dxFly?`<p style="margin-top:6px"><b style="color:var(--gold2)">大限四化</b>（${dxGan}干 · ${palaces[dxIdx].name}宫限 ${dxAge} 岁）：禄权科忌飞布 —— ${dxFly}。大限四化叠本命四化之上，十年一转运机随宫转换，吉化所落之宫即此十年重心所在。</p>`:''}
      ${liuFly?`<p style="margin-top:6px"><b style="color:var(--gold2)">流年四化</b>（${liuGan}干 · ${liuYear} 年）：禄权科忌飞布 —— ${liuFly}。今年重心在「<b style="color:var(--gold2)">${liuLuName||'—'}</b>」宫得助，宜在此域着力；「<b style="color:var(--gold2)">${liuJiName||'—'}</b>」宫为今年收敛之处，宜守不宜冒。流年四化叠大限四化之上，一年之机随宫而转；太岁入本命「${PALACES[((liuMingIdx-ming)%12+12)%12]}」宫，今年此宫及其三方四正联动最显。</p>`:''}
      <p style="color:var(--muted);font-size:12px;margin-top:6px">* 解读由命宫主星与安星规则生成；点任意宫格可看该宫三方四正与流年四化呼应。命是参考，路是自己走的。</p>`;
    zwRead=wrapTerms(zwRead);
  }catch(e){ zwRead=''; }
  document.getElementById('ziweiResult').innerHTML=`<div class="result">
    <h3>${y}年${m}月${day}日 · ${sx}年 · ${gender}</h3>
    <span class="tag">命宫 ${mingGZ}</span><span class="tag">身宫 ${ZHI[shen]}</span>
    <span class="tag">五行局 ${NA_YIN_WU[mingGZ]}（${ju}局）</span>
    <span class="tag">大限 ${dir===1?'顺行':'逆行'}</span>
    ${zwChart}
    <p style="margin-top:8px">十二宫 · 十四主星 · 常用辅星 · ${ZIWEI_SCHOOL==='sanhe'?'三合（旺衰 + 三方四正虚线）':'四化（'+yearGan+'年干）'} · 大限（${gender==='男'?(yang?'阳男顺':'阴男逆'):(yang?'阳女逆':'阴女顺')}）：</p>
    ${liuMingIdx>=0?`<p style="color:var(--muted);font-size:12px;margin-top:6px">流年联动：今年 <b style="color:var(--gold2)">${liuYear}（${liuZhi}）</b> 太岁入本命「<b style="color:var(--gold2)">${PALACES[((liuMingIdx-ming)%12+12)%12]}</b>」宫（朱砂框）；${liuYueIdx>=0?`流月入「<b style="color:var(--gold2)">${PALACES[((liuYueIdx-ming)%12+12)%12]}</b>」宫（蓝框）`:''}${liuRiIdx>=0?` · 流日入「<b style="color:var(--gold2)">${PALACES[((liuRiIdx-ming)%12+12)%12]}</b>」宫（绿框）`:''}；各宫下方小字为今年所临流年宫名与流年神煞。</p>`:''}
    <div class="zw-grid">${rows}</div>
    <div id="zwDetail"></div>
    ${zwRead}
    <p style="color:var(--muted);font-size:12px;margin-top:8px">* 专业排盘：五行局由命宫纳音定；紫微星系逆布、天府星系顺布（天府在紫微对宫对称位）；辅星按时辰/年干安放；${ZIWEI_SCHOOL==='sanhe'?'星曜旺衰依五行生克推演（非秘传庙旺表）、三方四正以虚线标出':'四化按年干'}；宫干支由命宫干支顺推；大限由五行局定起限岁数、阳男阴女顺行。仅供研习，不作论断</p></div>`;
    /* 十二宫点击详解：点宫格展开该宫星·旺·化·断·大限 */
    const zr=document.getElementById('ziweiResult');
    if(zr){ zr.querySelectorAll('.zw-cell').forEach((cell,idx)=>{ cell.style.cursor='pointer'; cell.title='点击查看「'+(palaces[idx]&&palaces[idx].name)+'」详解'; cell.onclick=()=>zwShowGong(idx); }); }
    function zwShowGong(i){
      const z=ZHI[i], p=palaces[i];
      const stars=(starMap[z]||'').trim();
      const isM=(i===ming), isShen=(i===shen);
      const mstar=stars.split(/\s+/).filter(Boolean).find(s=>ZW_C[s]);
      const wangTxt=(ZIWEI_SCHOOL==='sanhe'&&stars)?stars.split(/\s+/).map(s=>{const w=wangOf(s,z);return w?s+'·'+w:'';}).filter(Boolean).join('、'):'';
      const four=huaMap[z]?Object.keys(huaMap[z]).map(s=>s+'('+HUA[sh.indexOf(s)]+')').join('、'):'';
      const gongSay=_zwGong(p.name,stars);
      const fuSay=_zwFuSay(stars,p.name);
      const pick=(mstar&&isM)?_zwPick(mstar):'';
      const fuse=(mstar&&isM)?_zwFuse(mstar,ming):'';
      const lsh=(liuShenMap[z]||[]).join('、');
      const html=`<div class="zw-detail-card">
        <div class="zw-d-head"><b>${p.name}</b><span class="zw-d-gz">${gzOf(i)}</span>${(isM||isShen)?`<span class="zw-d-tag">${isM?'命宫':(isShen?'身宫':'')}</span>`:''}<button class="zw-d-close" onclick="document.getElementById('zwDetail').innerHTML=''">收起 ✕</button></div>
        ${stars?`<div class="zw-d-row"><span>星曜</span><b>${stars}</b></div>`:`<div class="zw-d-row"><span>星曜</span>无主星（借对宫）</div>`}
        ${wangTxt?`<div class="zw-d-row"><span>旺衰</span>${wangTxt}</div>`:''}
        ${four?`<div class="zw-d-row"><span>四化</span>${four}</div>`:''}
        ${daXianHuaMap[z]?`<div class="zw-d-row"><span>大限四化</span>${Object.keys(daXianHuaMap[z]).map(s=>s+'('+HUA[sh.indexOf(s)]+')').join('、')}</div>`:''}
        ${s3qRow(i)}
        ${pick?`<div class="zw-d-row zw-d-bai"><span>性格</span>${pick}</div>`:''}
        ${fuse?`<div class="zw-d-row zw-d-bai"><span>星宫</span>${fuse}</div>`:''}
        ${gongSay?`<div class="zw-d-row"><span>断语</span>${gongSay}</div>`:''}
        ${fuSay?`<div class="zw-d-row"><span>辅星</span>${fuSay}</div>`:''}
        ${lsh?`<div class="zw-d-row"><span>流年</span>${lsh}</div>`:''}
        <div class="zw-d-row"><span>大限</span>${limitOf(i)} 岁</div>
        ${liuOf(i)?`<div class="zw-d-row"><span>流年宫</span>${liuOf(i)}</div>`:''}
        ${liuHuaMap[z]?`<div class="zw-d-row"><span>流年四化</span>${Object.keys(liuHuaMap[z]).map(s=>s+'('+liuHuaMap[z][s]+')').join('、')}</div>`:''}
      </div>`;
      const box=document.getElementById('zwDetail'); if(box){ box.innerHTML=html; if(box.scrollIntoView){ try{ box.scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(e){} } }
    }
  enhanceFrameInk(document.querySelector('#ziweiResult .sc-svg'));
  const zvRes=document.getElementById('ziweiResult').querySelector('.result');
  if(zvRes){ zvRes.dataset.school='紫微'; zvRes.dataset.sentiment=ziweiSent; const _b=document.getElementById('baziResult').querySelector('.result'); if(_b&&window.appendConsensus) window.appendConsensus(_b); }
};

/* ---------- 奇门遁甲（专业排盘：拆补法定局 + 值符值使转盘） ---------- */
const YANG_JU={冬至:[1,7,4],小寒:[2,8,5],大寒:[3,9,6],立春:[8,5,2],雨水:[9,6,3],惊蛰:[1,7,4],春分:[3,9,6],清明:[4,1,7],谷雨:[5,2,8],立夏:[4,1,7],小满:[5,2,8],芒种:[6,3,9]};
const YIN_JU={夏至:[9,3,6],小暑:[8,2,5],大暑:[7,1,4],立秋:[2,5,8],处暑:[1,4,7],白露:[9,3,6],秋分:[7,1,4],寒露:[6,9,3],霜降:[5,8,2],立冬:[4,7,1],小雪:[3,6,9],大雪:[2,5,8]};
const YANG_SET=new Set(Object.keys(YANG_JU));
const PAL_NAME={1:'坎',2:'坤',3:'震',4:'巽',5:'中',6:'乾',7:'兑',8:'艮',9:'离'};
const STAR9={1:'蓬',2:'芮',3:'冲',4:'辅',5:'禽',6:'心',7:'柱',8:'任',9:'英'};
const STAR9_SEQ=['蓬','芮','冲','辅','禽','心','柱','任','英'];
const MEN_BY_PAL={1:'休',2:'死',3:'伤',4:'杜',5:'中',6:'开',7:'惊',8:'生',9:'景'};
const MEN_SEQ=['休','死','伤','杜','景','开','惊','生'];
const SHEN8=['符','蛇','阴','合','虎','玄','地','天'];
const YI=['戊','己','庚','辛','壬','癸','丁','丙','乙'];
const DZ_TO_XUN={子:'戊',丑:'戊',戌:'己',亥:'己',申:'庚',酉:'庚',午:'辛',未:'辛',辰:'壬',巳:'壬',寅:'癸',卯:'癸'};
/* 奇门问事场景聚合判词（变量驱动·去模板） */
/* 奇门九宫方位速查：方位→洛书宫号 + 该方位用事建议 */
const QM_DIR_MAP={'东':3,'南':9,'西':7,'北':1,'东南':4,'西南':2,'东北':8,'西北':6,'中':5};
const QM_DIR_USE={'东':'宜行动开创、谈判签约、动工启程','南':'宜扬名文书、见贵求名、喜庆之事','西':'宜沟通洽谈、销售往来、言语生财','北':'宜谋略规划、静思夜务、暗中布局','东南':'宜文书传播、出行远游、学问交流','西南':'宜合作包容、安家置业、和合之事','东北':'宜守成置业、静修蓄力、稳固根基','西北':'宜决策公干、见上级领导、权威之事','中':'宜居中调和、协调各方、守正不偏'};
window.qmDirPick=dir=>{
  try{
    const D2=window._qmDirData||{}; const pal=QM_DIR_MAP[dir]; if(!pal) return;
    const menB=D2.menB||{}, starB=D2.starB||{}, shenB=D2.shenB||{}, sayByPal=D2.sayByPal||{};
    const men=menB[pal]||'—', star=starB[pal]||'—', shen=shenB[pal]||'—';
    const say=sayByPal[pal]||'';
    const isZF=pal===(window._qmDirData.zhiFuPal||-1);
    const box=document.getElementById('qmDirBox');
    if(box) box.innerHTML=`<p style="margin-top:8px;padding:8px 10px;border-left:3px solid #5a8a6a;background:var(--r-subbg);font-size:12.5px;line-height:1.85"><b style="color:var(--r-gold-soft)">${dir}方 · ${pal}宫（${PAL_NAME[pal]}）${isZF?' · 值符所临':''}</b> 门 ${men} ｜ 星 ${star} ｜ 神 ${shen}<br>${say}<br><span style="color:var(--good)">此方宜：${QM_DIR_USE[dir]}</span></p>`;
  }catch(e){}
};
/* 奇门「时家问事」场景深断字典：9 场景 ×（tip 用神点评 + sp 时空 + act 行动）× 2 变体 = 54 句；{门}{星}{神}{sh}{ma}{kong} 为占位，渲染时替换 */
const QM_SCENE_TXT={
  '事业':{tip:['问事业，以开门（官星）为用神。值符宫{门}正对官路——门吉则晋升有位、谋职可成；门凶则职位变动多、宜稳守现职。','事业用神在开门。今值符宫{门}主官运——门吉宜趁势谋职晋升，门凶宜先安其位、以待时机。'],
          sp:['驿马{ma}——动则有职缘，外派、跳槽、异地任职皆可考虑；旬空{kong}若落官禄相关方位，职位之事易悬而未决。','旬空{kong}克开门，谋职之事宜缓，宜待出空填实再动；驿马{ma}动则宜主动求变。'],
          act:['行动：门吉主动递投名状、争取表现；门凶则多汇报、少揽新职，先坐稳再谈升。','做法：值符宫神{sh}——按神意行事：九天进取、九地蓄力、值符守正、六合借力。']},
  '求职':{tip:['问求职，以开门（官星·机遇）为用神。值符宫{门}主机遇走势——门吉则 offer 可期、投递有回音；门凶则岗位收紧、宜广投蓄力、先补内功。','求职看开门。今值符宫{门}——门吉利投递进阶、主动出击，门凶宜先补短板、多攒作品，待机再发。'],
          sp:['驿马{ma}动——求职有跨城、外派、机动之象，宜多跑面见、多线并行；旬空{kong}落官禄方，岗位虚位、宜等实缺再定。','旬空{kong}克开门，投递易石沉大海，宜复盘简历、查漏再战；驿马{ma}动则宜广撒网、别押一棵树。'],
          act:['行动：门吉宜投名状、跑面试、拓人脉；门凶宜先练内功、积案例，机会来了接得住。','做法：神{sh}临宫——九天宜高调求职、亮履历；九地宜蛰伏蓄力；值符宜正途直投；六合利内推引荐。']},
  '求财':{tip:['问求财，以生门（财星）为用神。值符宫{门}主财路——门吉则财源通畅、求财可成；门凶则财路阻滞、宜守不宜投。','求财看生门。今值符宫{门}——门吉利经商求财，门凶忌加码投资，先守现金流。'],
          sp:['驿马{ma}动——财在动中，贸易、出差、异地生意有机缘；旬空{kong}则财象虚悬，宜待实再投。','旬空{kong}落财位，财来财去难留，宜先看紧钱袋；驿马{ma}动，动中求财最旺。'],
          act:['行动：门吉宜谈价、签约、扩张；门凶宜结款、清账、收缩，先落袋为安。','做法：神{sh}临宫——六合宜合伙、值符宜稳财、九天宜开拓、九地宜屯货待涨。']},
  '感情':{tip:['问感情，以六合（媒缘）为用神。值符宫{门}主缘分走势——门吉则姻缘和合、相处顺遂；门凶则口角磨合多、宜缓进。','感情用神在六合。今值符宫{门}——门吉利表白求婚、关系升温；门凶宜多包容、少争执。'],
          sp:['驿马{ma}动——异地恋、出行相识、聚少离多之象；旬空{kong}则心意未定，宜坦诚沟通。','旬空{kong}落婚恋方位，关系有悬而未决处，宜把话说开；驿马{ma}动，宜多走动增进感情。'],
          act:['行动：门吉主动推进、约见、表白；门凶先缓一缓，用耐心换转机。','做法：神{sh}临宫——六合利牵线、太阴宜温和示好、玄武防猜疑、白虎忌争执。']},
  '出行':{tip:['问出行，以开门·驿马为用神。值符宫{门}主行程吉凶——门吉则出行顺遂、遇事有解；门凶则宜改期或慎选路线。','出行看开门驿马。今值符宫{门}——门吉利远行公干，门凶出行宜缓，重要行程另择时。'],
          sp:['驿马{ma}正动——出行有动因，宜动中求成；旬空{kong}则行程易生变故，宜留弹性。','旬空{kong}落驿马位，行程易误易变，宜多备预案；驿马{ma}动，此行必有动静。'],
          act:['行动：门吉宜定票、启程、赴约；门凶宜改期，若必行则避开值符宫所主方位。','做法：神{sh}临宫——九天宜高飞远行、九地宜缓行、白虎防车马之险、玄武防失物。']},
  '健康':{tip:['问健康，以天芮（病星）为用神。值符宫{星}主病势——有病星现象，宜早就医调护、勿拖；无病星，身况平妥，宜调养作息。','健康看天芮。今值符宫{星}——有病星则防患于未然，无病星则注意日常调养，别透支。'],
          sp:['旬空{kong}落疾厄位——症状或有反复，检查恐有未明之处，宜复查；驿马{ma}动——宜运动锻炼、动中养生。','旬空{kong}则病象虚实难辨，勿自行用药，宜遵医嘱；驿马{ma}动，宜出行散心养神。'],
          act:['行动：门吉宜就医、体检、调养；门凶先防口舌劳碌之患，劳逸结合。','做法：神{sh}临宫——白虎防伤病、玄武防隐疾、六合利宽心、九天宜户外活动。']},
  '学业':{tip:['问学业，以天辅（文昌）为用神。值符宫{门}主学业运——门吉则文书考试顺遂、思路清晰；门凶则复习受阻、宜换方法。','学业用神天辅。今值符宫{门}——门吉利考试签约、文书写作；门凶宜加把劲、忌临阵抱佛脚。'],
          sp:['驿马{ma}动——宜外出求学、异地考试；旬空{kong}则思绪易空，宜静心打基础。','旬空{kong}落文书位，考试文书事易有疏漏，宜多检查；驿马{ma}动，动中求学有收获。'],
          act:['行动：门吉宜定心备考、多练真题；门凶先调状态，作息规律比熬夜有效。','做法：神{sh}临宫——值符利定心、太阴宜静读、九天利冲刺、九地宜打牢根基。']},
  '诉讼':{tip:['问诉讼，以惊门（争讼）为用神。值符宫{门}主讼局——门吉则有理可恃、调停有望；门凶则口舌缠身、宜和解为上。','诉讼看惊门。今值符宫{门}——门吉利据理力争，门凶宜调解息讼，能私了不公堂。'],
          sp:['旬空{kong}落争讼位——对方虚实难测，宜留证据；驿马{ma}动——事有转机，宜走动周旋。','旬空{kong}则讼事易悬，宜待时机；驿马{ma}动，宜主动出击、寻调停人。'],
          act:['行动：门吉宜应诉、举证；门凶宜和解、让步，讼则凶。','做法：神{sh}临宫——白虎防对方狠辣、玄武防暗算、六合利调解、值符利公正。']},
  '寻物':{tip:['问寻物，以生门·空亡为用神。旬空{kong}——空亡落局，失物恐暂不可得或已移他处；局中无空亡，物未远遁，宜细查常处。','寻物看空亡。今值符宫{门}——门吉则失物可寻、宜按方位找；门凶或见空亡，物踪难觅、宜放宽心。'],
          sp:['驿马{ma}动——物在移动中，或被带走、或已易手；旬空{kong}则暂不可得，过些时日再看。','旬空{kong}落何宫，可按其方位搜寻；驿马{ma}动，物在途，宜问行迹。'],
          act:['行动：门吉宜回查常处、问询附近；门凶或空亡，先放下，回头找反而找到。','做法：神{sh}临宫——玄武防盗失、白虎防破损、六合利问人、九天利高处寻。']},
  '决策':{tip:['问决策，以值符为用神——值符乃一时之主，主当下大局。值符宫{门}——门吉则大方向可行、宜果断；门凶则时机未到、宜缓议。','决策看值符。今值符宫{门}——门吉可拍板，门凶宜多听意见、推迟大决定。'],
          sp:['驿马{ma}动——时机在动，宜快速决策、别错过窗口；旬空{kong}则信息未齐，宜补足再定。','旬空{kong}落所问方位——此事尚有虚处，宜查漏补缺；驿马{ma}动，宜当机立断。'],
          act:['行动：门吉一锤定音，门凶分步走、留余地，重大决策另择吉时。','做法：神{sh}临宫——值符守正决策、九天宜进取、九地宜守成、六合宜集思广益。']},
  '谈判':{tip:['问谈判，以六合（和合·博弈）为用神。值符宫{门}主议局——门吉则气氛融洽、易达成共识；门凶则分歧拉大、宜先求同存异。','谈判用神在六合。今值符宫{门}——门吉利磋商让步、各取所需，门凶宜暂停、改日再谈。'],
          sp:['驿马{ma}动——谈判有转移动向，宜借势推进、临门一脚；旬空{kong}则条件未实，宜把关键条款写清再谈。','旬空{kong}落谈判方位，虚实难定、易被拖，宜留底稿；驿马{ma}动，宜抓窗口主动出牌。'],
          act:['行动：门吉宜坐到桌前、亮底线换空间；门凶宜休会换位再谈，别当场翻脸。','做法：神{sh}临宫——六合利撮合、太阴宜暗中铺垫、九天宜抬价造势、玄武防被套话。']},
  '签约':{tip:['问签约，以开门（文书·契约）为用神。值符宫{门}主契运——门吉则文书顺遂、落笔生权；门凶则条款有坑、宜逐字审读。','签约看开门。今值符宫{门}——门吉利盖章定约、契约稳固，门凶宜延后、重大合同另择吉时。'],
          sp:['驿马{ma}动——签约后有变动执行之象，宜把履约节点写清；旬空{kong}则约定易悬，宜补全附件再签。','旬空{kong}落文书位，白纸易生歧义，宜加备注；驿马{ma}动，签约宜当面、忌隔空代签。'],
          act:['行动：门吉宜定稿、双签、留底；门凶宜压一压、找专业人士过目再落笔。','做法：神{sh}临宫——值符利正约、太阴宜保密条款、白虎防陷阱、六合利共同见证。']},
  '投资':{tip:['问投资，以生门（财星·投注）为用神。值符宫{门}主财势走向——门吉则顺势可投、宜稳健布局；门凶则市况震荡、忌加重仓，先守现金流。','投资看生门。今值符宫{门}——门吉利分批建仓、顺势而为，门凶宜观望、重大决定另择时。'],
          sp:['驿马{ma}动——资金有调动之象，宜快进快出者设止盈止损；旬空{kong}落财位，虚涨易套、宜防假突破。','旬空{kong}临财，账面浮盈易落空，宜落袋为安；驿马{ma}动，消息面驱动、忌追涨杀跌。'],
          act:['行动：门吉宜定投/分批、留足弹药；门凶宜减仓观望、先保本金。','做法：神{sh}临宫——值符利长线价值、太阴宜低调建仓、玄武防杀猪盘、白虎防急跌踩踏。']},
  '置业':{tip:['问置业，以生门（田宅·根基）为用神。值符宫{门}主房运——门吉则宜看房下定、地段得宜；门凶则易有产权或瑕疵隐忧、宜缓、多查验。','置业看生门。今值符宫{门}——门吉利安家落户、长持增值，门凶宜租代买、或另选朝向楼层。'],
          sp:['九地临宫（静而蓄）——宜看现房、尾盘捡漏、长持；驿马{ma}动则搬家迁居之象，宜定交割节点。','旬空{kong}落宅位，手续易悬、宜补全证件；驿马{ma}动，宜亲赴现场、忌隔空下定。'],
          act:['行动：门吉宜签约过户、请师验房；门凶宜暂缓、先排产权与贷款风险。','做法：神{sh}临宫——九地宜稳购长持、值符利正途中介、玄武防一房多卖、太阴宜暗中比价。']},
  '开业':{tip:['问开业，以开门（铺面·文书）为用神。值符宫{门}主营势——门吉则宜张铺纳客、名声易起；门凶则宜延后剪彩、先试运营。','开业看开门。今值符宫{门}——门吉利挂牌迎客、喜庆开张，门凶宜择吉时、或先低调内测。'],
          sp:['天辅临宫（文教助）——宜招牌文书、许可齐备；驿马{ma}动则客流走动之象，宜做引流。','旬空{kong}落铺位，宜备第二方案、忌空铺待客；驿马{ma}动，宜线上+线下齐发。'],
          act:['行动：门吉宜正日开业、广而告之；门凶宜择吉时、先暖场蓄客。','做法：神{sh}临宫——开门利正营、天辅利招牌文书、白虎防口舌纠纷、六合利合伙共营。']}
};
function qimenSceneLine(scene, ctx){
  if(!scene) return '';
  const USE={事业:'开门（官星）',求职:'开门（机遇）',求财:'生门（财星）',感情:'六合（媒缘）',出行:'开门·驿马（动象）',健康:'天芮（病星）',学业:'天辅（文昌）',诉讼:'惊门（争讼）',寻物:'生门·空亡（物踪）',决策:'值符（核心）',谈判:'六合（博弈）',签约:'开门（契约）',投资:'生门（财星·投注）',置业:'生门（田宅）',开业:'开门（铺面）'};
  const PO={事业:'晋升谋职受阻',求职:'求职机遇减力',求财:'求财进益减力',感情:'姻缘和合减力',出行:'出行方位有险',健康:'病势难化',学业:'文书考试受阻',诉讼:'争讼不利',寻物:'物踪难觅',决策:'决断乏力',谈判:'议和减力',签约:'契约减力',投资:'投资进益减力',置业:'置业安顿减力',开业:'开业营谋减力'};
  const use=USE[scene]||'值符（核心）';
  const menG=['休','生','开'].includes(ctx.zfMen)?'吉':['死','惊','伤'].includes(ctx.zfMen)?'凶':'平';
  const base='今值符宫门为'+ctx.zfMen+'（门'+menG+'）'+(menG==='吉'?'，宜主动谋事':menG==='凶'?'，宜守不宜攻、重要事另择时':'，可进可退、视机而动')+'。';
  const po=ctx.poStr?('⚠ 见门迫/宫克（'+ctx.poStr+'），'+(PO[scene]||'相关方面减力、宜回避或另择时')+'。'):'';
  let extra='';
  if(scene==='感情'){ if(ctx.zfShen==='合') extra='六合临宫，姻缘和合、利媒妁牵线；'; else if(ctx.zfShen==='虎') extra='白虎临宫，防口舌争执、宜以柔化之；'; else if(ctx.zfShen==='玄') extra='玄武临宫，防虚情欺诈、宜明察；'; }
  else if(scene==='出行'){ if(ctx.maPal) extra='驿马发动（'+ctx.maPal+'宫），出行有动因、宜动中求成；'; if(ctx.poStr) extra+='且值符宫门迫，出行方位宜慎选；'; }
  else if(scene==='寻物'){ if(ctx.kongPals&&ctx.kongPals.length) extra='旬空落局，失物恐暂不可得或已移他处，宜另觅时机；'; else extra='局中无空亡，物未远遁，宜细查常处；'; }
  else if(scene==='事业'){ if(ctx.zfShen==='符') extra='值符临宫，得领导贵气、宜展现担当；'; else if(ctx.zfShen==='天') extra='九天临宫，宜昂扬进取、主动谋职；'; else if(ctx.zfShen==='地') extra='九地临宫，宜潜藏蓄力、待时而发；'; }
  else if(scene==='健康'){ if(ctx.zfStar&&ctx.zfStar.indexOf('芮')>=0) extra='天芮临值符宫，病势缠绵、宜早就医调护；'; else extra='值符宫无病星，身况平妥、宜调养；'; }
  else if(scene==='谈判'){ if(ctx.zfShen==='合') extra='六合临宫，议和气氛好、易妥协成交；'; else if(ctx.zfShen==='地') extra='九地临宫，宜慢谈、以静制动；'; else if(ctx.zfShen==='天') extra='九天临宫，宜抬势造势、主动出牌；'; }
  else if(scene==='签约'){ if(ctx.zfShen==='符') extra='值符临宫，正约稳固、宜落笔；'; else if(ctx.zfStar&&ctx.zfStar.indexOf('芮')>=0) extra='天芮临宫，合同易有隐疾，宜专业过目；'; else if(ctx.zfShen==='玄') extra='玄武临宫，防条款陷阱、宜逐字审；'; }
  else if(scene==='求职'){ if(ctx.zfShen==='符') extra='值符临宫，正途直投最利、宜光明应聘；'; else if(ctx.maPal) extra='驿马发动（'+ctx.maPal+'宫），多跑动、多面见有戏；'; else if(ctx.zfShen==='玄') extra='玄武临宫，防招聘陷阱、宜核实资质再投；'; }
  else if(scene==='投资'){ if(ctx.zfShen==='玄') extra='玄武临宫，防杀猪盘与虚假标的、宜核实资质再入；'; else if(ctx.zfStar&&ctx.zfStar.indexOf('芮')>=0) extra='天芮临宫，标的易有隐疾，宜专业过目、分散风险；'; else extra='值符临宫，宜长线价值、忌追涨杀跌；'; }
  else if(scene==='置业'){ if(ctx.zfShen==='地') extra='九地临宫，宜稳购长持、看现房；'; else if(ctx.zfShen==='玄') extra='玄武临宫，防一房多卖与产权陷阱、宜查档；'; else extra='生门临宫，房运得宜、宜亲验再定；'; }
  else if(scene==='开业'){ if(ctx.zfStar&&ctx.zfStar.indexOf('辅')>=0) extra='天辅临宫，招牌文书皆利、宜张铺；'; else if(ctx.zfShen==='虎') extra='白虎临宫，防口舌纠纷、宜和气待客；'; else extra='开门临宫，宜正日开业、广而告之；'; }
  let deep='';
  const Q=QM_SCENE_TXT[scene];
  if(Q){
    const kongN=(ctx.kongPals&&ctx.kongPals.length)?ctx.kongPals.map(p=>PAL_NAME[p]||p).join('、'):'无';
    const rep=s=>s.replace(/\{门\}/g,ctx.zfMen||'—').replace(/\{星\}/g,ctx.zfStar||'—').replace(/\{神\}/g,ctx.zfShen||'—').replace(/\{sh\}/g,ctx.zfShen||'—').replace(/\{ma\}/g,ctx.maPal?ctx.maPal+'宫':'未动').replace(/\{kong\}/g,kongN);
    const tip=Q.tip[_hashStr('qms'+scene)%Q.tip.length];
    const sp=Q.sp[_hashStr('qms'+scene+'sp')%Q.sp.length];
    const act=Q.act[_hashStr('qms'+scene+'act')%Q.act.length];
    deep='<div style="margin-top:6px;padding:6px 8px;border-left:3px solid #5a8a6a;background:rgba(255,255,255,.02);font-size:12.5px;line-height:1.8"><b style="color:var(--r-gold-soft)">深断</b>：'+rep(tip)+'<br>'+rep(sp)+'<br>'+rep(act)+'</div>';
  }
  return `<p style="margin-top:8px;padding:6px 8px;border-left:3px solid var(--r-gold-soft);background:rgba(255,255,255,.03)">【问${scene} · 聚合】以${use}为用神——${base}${po}${extra}</p>${deep}`;
}
/* 奇门共享字典（模块级，供 qimenCore 与下方渲染共用，避免重复定义） */
const QM_GONG_SHARED={
  '坎':{ok:['坎宫（北·谋略之地）——今门吉，智谋可行，此方谋事易成','坎宫（北·智水之地）逢吉门——谋定而后动，事半功倍'],no:['坎宫（北·谋略之地）——门凶则谋多受阻，宜缓不宜进','坎宫（北·智水之地）遇凶门——先稳心神，再图谋事'],mid:['坎宫（北·谋略之地）——门平，可谋可守，视机而动','坎宫（北·智水之地）门平——谋事徐徐图之，不争先']},
  '坤':{ok:['坤宫（西南·包容之地）——门吉，宜合作包容、养势蓄力','坤宫（西南·厚土之地）逢吉门——守成养望，多得助力'],no:['坤宫（西南·包容之地）——门凶，防拖延负重，宜精简','坤宫（西南·厚土之地）遇凶门——事多缠身，宜减负'],mid:['坤宫（西南·包容之地）——门平，顺势而为，不宜强求','坤宫（西南·厚土之地）门平——平稳推进，静待时机']},
  '震':{ok:['震宫（东·行动之地）——门吉，宜果断行动、雷厉风行','震宫（东·雷动之地）逢吉门——动中求成，别犹豫'],no:['震宫（东·行动之地）——门凶，防冒进生变，宜稳','震宫（东·雷动之地）遇凶门——动静皆宜缓，先安局'],mid:['震宫（东·行动之地）——门平，可动可静，看势而定','震宫（东·雷动之地）门平——小步快走，不冒头']},
  '巽':{ok:['巽宫（东南·文书之地）——门吉，利文书往来、名声传播','巽宫（东南·风行之地）逢吉门——借风势，文书人脉皆顺'],no:['巽宫（东南·文书之地）——门凶，防文书口舌生变','巽宫（东南·风行之地）遇凶门——慎签慎言，避传播之患'],mid:['巽宫（东南·文书之地）——门平，文书之事按部就班','巽宫（东南·风行之地）门平——消息往来，多核对再定']},
  '中':{ok:['中宫（中央·调和之地）——门吉，居中调停，诸事平稳','中宫（中央·枢纽之地）逢吉门——承上启下，正合其位'],no:['中宫（中央·调和之地）——门凶，防中枢受累，宜抽身','中宫（中央·枢纽之地）遇凶门——居中者易被牵连，避是非'],mid:['中宫（中央·调和之地）——门平，守中即安','中宫（中央·枢纽之地）门平——不偏不倚，坐观其变']},
  '乾':{ok:['乾宫（西北·权威之地）——门吉，宜决策拍板、执掌大局','乾宫（西北·天威之地）逢吉门——决断有据，一锤定音'],no:['乾宫（西北·权威之地）——门凶，防决策失误，宜缓决','乾宫（西北·天威之地）遇凶门——强出头易折，宜从长计议'],mid:['乾宫（西北·权威之地）——门平，大事多斟酌再定','乾宫（西北·天威之地）门平——权责所在，谨慎行事']},
  '兑':{ok:['兑宫（西·口舌之地）——门吉，宜沟通洽谈、言语生财','兑宫（西·泽悦之地）逢吉门——会说话者得利，谈成事'],no:['兑宫（西·口舌之地）——门凶，防口舌是非，慎言','兑宫（西·泽悦之地）遇凶门——言多必失，宜守默'],mid:['兑宫（西·口舌之地）——门平，言谈有度，不惹是非','兑宫（西·泽悦之地）门平——可说可不说，点到为止']},
  '艮':{ok:['艮宫（东北·山止之地）——门吉，宜固守根基、以静制动','艮宫（东北·阻隔之地）逢吉门——止则安，守得云开'],no:['艮宫（东北·山止之地）——门凶，防僵局难破，宜变通','艮宫（东北·阻隔之地）遇凶门——事陷停滞，需借外力破局'],mid:['艮宫（东北·山止之地）——门平，事缓则圆，不宜强推','艮宫（东北·阻隔之地）门平——进退两难时，先安内']},
  '离':{ok:['离宫（南·名望之地）——门吉，利扬名、文书、光彩之事','离宫（南·火明之地）逢吉门——声名渐起，宜展现'],no:['离宫（南·名望之地）——门凶，防虚火虚名，宜低调','离宫（南·火明之地）遇凶门——树大招风，敛光为要'],mid:['离宫（南·名望之地）——门平，名分之事顺其自然','离宫（南·火明之地）门平——不争名，名自来']}
};
const QM_STAR_TIP_SHARED={'天芮':['天芮临宫，防病扰琐碎，宜保重','天芮到宫，小病小痛宜早查早调、莫拖延','天芮值宫，身体易感疲弱，作息饮食先顾好'],'天辅':['天辅临宫，利文书学业','天辅在宫，考试文书顺、宜多读多写','天辅临宫，文昌照命，动笔动脑皆有益'],'天英':['天英临宫，有名利之象、防虚火','天英在宫，声名易起但防虚高，落地为要','天英临宫，才名外显，宜把光用在实处'],'天蓬':['天蓬临宫，防破耗暗昧，宜谨慎','天蓬值宫，财事易有大进大出，量入为出','天蓬临宫，防暗昧之失，大事多核实'],'天柱':['天柱临宫，防口舌阻隔，宜守默','天柱在宫，言多易生阻，少说多做','天柱临宫，宜防是非缠身，守口如瓶'],'天冲':['天冲临宫，冲劲足、防急躁','天冲值宫，行动力旺但易冒进，三思后行','天冲临宫，宜借冲劲破局、莫冲过了头']};
const QM_SHEN_TIP_SHARED={'蛇':['蛇神临宫，防虚惊纠缠，宜明辨'],'虎':['白虎临宫，防刑伤，宜避其锋'],'玄':['玄武临宫，防盗失诡诈'],'合':['六合临宫，利合作姻缘'],'天':['九天临宫，宜昂扬进取、主动出击'],'地':['九地临宫，宜潜藏蓄力、待时而发']};
const MEN_MEAN_SHARED={'休门':'主休养，宜歇息、调停、求谋合作','生门':'主生发，宜求财、见贵人、谋开业','开门':'主开创，宜公干、远行、开市','伤门':'主损伤，此方宜守不宜动','杜门':'主闭塞，宜闭关防人、不宜出入','景门':'主文书，宜文化、喜事、谋名','死门':'主晦滞，此方宜回避','惊门':'主惊扰，防口舌是非、宜谨慎'};
const STAR_MEAN_SHARED={'天心':['有智谋相助，遇事有解','天心临宫，得良谋善断，难题多有解法','天心在宫，沉稳有方，临事不慌、自有章法'],'天辅':['得文教贵人，利文书学业','天辅临宫，文昌照命，读书应试顺','天辅在宫，文书才艺得力，宜勤学多动笔'],'天任':['安定之福，根基扎实','天任临宫，踏实稳妥，步步走得实','天任在宫，任重力稳，宜守成养基'],'天禽':['中正平和，平稳无咎','天禽临宫，气度中和，诸事少波','天禽在宫，稳当无虞，顺其自然地就好'],'天冲':['冲劲有余，成事易急','天冲临宫，雷厉风行但防冒进','天冲在宫，宜借冲劲破局、莫冲过了头'],'天英':['有名利之象，但防虚火','天英临宫，声名易起、宜落地求实','天英在宫，才名外显，别让虚火盖了实功'],'天芮':['防病扰琐碎，宜保重','天芮临宫，小恙宜早调、莫拖延','天芮在宫，身况易疲，先顾作息饮食'],'天柱':['防口舌阻隔，宜守默','天柱临宫，言多易生阻，少说多做','天柱在宫，防是非缠身，守口为安'],'天蓬':['防破耗暗昧，宜谨慎','天蓬临宫，财事大进大出，量入为出','天蓬在宫，防暗昧之失，大事多核实']};
const SHEN_MEAN_SHARED={'符':'值符——八神之首，百恶消散，所临之方最吉、主核心贵气。','蛇':'腾蛇——虚惊怪异、纠缠多变，主口舌疑惑，宜明辨勿慌。','阴':'太阴——阴佑隐庇，宜密谋策划、暗中行事。','合':'六合——和合中介，利婚媒交易、人缘相谐。','虎':'白虎——凶伤之将，主疾病刑伤，宜避其锋。','玄':'玄武——盗失诡诈，防财物遗失、虚诈小人。','地':'九地——隐伏迟滞，宜屯兵固守、潜藏养力。','天':'九天——扬兵进取，主昂扬外显、宜主动出击。'};
const MEN_WU_SHARED={'休':'水','生':'土','开':'金','伤':'木','杜':'木','景':'火','死':'土','惊':'金','中':'土'};
const PAL_WU_SHARED={'坎':'水','坤':'土','震':'木','巽':'木','中':'土','乾':'金','兑':'金','艮':'土','离':'火'};
const PAL_TO_DIR={}; Object.keys(QM_DIR_MAP).forEach(d=>{ PAL_TO_DIR[QM_DIR_MAP[d]]=d; });
/* ---------- 奇门核心起局：给定时刻与定局法，返回九宫飞布数据（供主盘与挑吉方共用） ---------- */
function qimenCore(now, method){
  const lunar=Solar.fromYmd(now.getFullYear(),now.getMonth()+1,now.getDate()).getLunar();
  const prevJ=lunar.getPrevJie();
  const jqName=prevJ?prevJ.getName():'冬至';
  const yang=YANG_SET.has(jqName);
  const jtab=yang?YANG_JU:YIN_JU;
  const QIMEN_METHOD=method||'chaibu';
  const jqSolar=prevJ.getSolar();
  const jqL=Solar.fromYmd(jqSolar.getYear(),jqSolar.getMonth(),jqSolar.getDay()).getLunar();
  const jqZ=jqL.getDayInGanZhi().charAt(1);
  let yuan;
  if(QIMEN_METHOD==='zrun'){
    let fuZ='';
    for(let k=0;k<60;k++){ const dd=new Date(now.getFullYear(),now.getMonth(),now.getDate()-k);
      const lu=Solar.fromYmd(dd.getFullYear(),dd.getMonth()+1,dd.getDate()).getLunar();
      const dgz=lu.getDayInGanZhi(); if(dgz.charAt(0)==='甲'||dgz.charAt(0)==='己'){ fuZ=dgz.charAt(1); break; } }
    const fz=fuZ||jqZ;
    yuan = ['子','午','卯','酉'].includes(fz)?0 : ['寅','申','巳','亥'].includes(fz)?1 : 2;
  } else {
    yuan = ['子','午','卯','酉'].includes(jqZ)?0 : ['寅','申','巳','亥'].includes(jqZ)?1 : 2;
  }
  const ju=jtab[jqName][yuan];
  const dgz=lunar.getDayInGanZhi(); const dayGan=dgz.charAt(0);
  const hz=Math.floor((now.getHours()+1)/2); const shiZhi=ZHI[hz-1];
  const wushu={甲:'甲',乙:'丙',丙:'戊',丁:'庚',戊:'壬',己:'甲',庚:'丙',辛:'戊',壬:'庚',癸:'壬'};
  const shiGan=GAN[(GAN_IDX[wushu[dayGan]]+(hz-1))%10];
  const shiGZ=shiGan+shiZhi;
  const xunYi=DZ_TO_XUN[shiZhi];
  const diYi={};
  for(let k=0;k<9;k++){ const pal=yang?((ju-1+k)%9+1):((ju-1-k+9)%9+1); diYi[YI[k]]=pal; }
  const zhiFuPal=diYi[xunYi];
  const xunIdx=Math.floor(gz60(shiGZ)/10);
  const ordInXun=(gz60(shiGZ)-xunIdx*10)%10;
  const tfPal=yang?((zhiFuPal-1+ordInXun)%9+1):((zhiFuPal-1-ordInXun+9)%9+1);
  const starB={}; for(let k=0;k<9;k++){ const pal=yang?((tfPal-1+k)%9+1):((tfPal-1-k+9)%9+1); starB[pal]=STAR9_SEQ[k]; }
  const shiMenPal=yang?((zhiFuPal-1+ordInXun)%9+1):((zhiFuPal-1-ordInXun+9)%9+1);
  const menB={}; for(let k=0;k<8;k++){ const pal=yang?((shiMenPal-1+k)%9+1):((shiMenPal-1-k+9)%9+1); menB[pal]=MEN_SEQ[k]; }
  const shenB={}; for(let k=0;k<8;k++){ const pal=yang?((tfPal-1+k)%9+1):((tfPal-1-k+9)%9+1); shenB[pal]=SHEN8[k]; }
  const zhiShiPal=shiMenPal, yinGan=shiGan;
  const MA={申:'寅',子:'寅',辰:'寅',寅:'申',午:'申',戌:'申',巳:'亥',酉:'亥',丑:'亥',亥:'巳',卯:'巳',未:'巳'};
  const maZhi=MA[shiZhi]||'';
  const i60=gz60(shiGZ), xunI=Math.floor(i60/10);
  const kong1=ZHI[(xunI*10+10)%12], kong2=ZHI[(xunI*10+11)%12];
  const PAL_DZ={1:['子'],8:['丑','寅'],3:['卯'],4:['辰','巳'],9:['午'],2:['未','申'],7:['酉'],6:['戌','亥']};
  const dzToPal=z=>{ for(const p in PAL_DZ){ if(PAL_DZ[p].includes(z)) return +p; } return 5; };
  const maPal=maZhi?dzToPal(maZhi):0;
  const kongPals=[dzToPal(kong1),dzToPal(kong2)];
  const ORDER=[4,9,2,3,5,7,8,1,6];
  function _qmGongSay(pal, men, star, shen){
    const pool=QM_GONG_SHARED[PAL_NAME[pal]]; if(!pool) return '';
    const isOk=['休门','生门','开门'].includes(men), isNo=['死门','惊门','伤门'].includes(men);
    const arr=isOk?pool.ok:isNo?pool.no:pool.mid;
    let s=arr[_hashStr('qm'+pal+men)%arr.length];
    const st=QM_STAR_TIP_SHARED[star]; if(st) s+='；'+st[_hashStr('qmstartip'+star)%st.length];
    const sh=QM_SHEN_TIP_SHARED[shen]; if(sh) s+='；'+sh[0];
    return s;
  }
  const zfMen=menB[zhiFuPal]||'', zfStar=starB[zhiFuPal]||'', zfShen=shenB[zhiFuPal]||'';
  const sayByPal={}; ORDER.forEach(pal=>{ sayByPal[pal]=_qmGongSay(pal, menB[pal]||'', starB[pal]||'', shenB[pal]||''); });
  return {yang, ju, yuan, QIMEN_METHOD, jqName, zhiFuPal, zhiShiPal, maZhi, maPal, kong1, kong2, shiGZ, ORDER, menB, starB, shenB, zfMen, zfStar, zfShen, kongPals, yinGan, sayByPal};
}
/* ---------- 奇门 · 按问事时辰挑吉方（时 × 方 双轴） ---------- */
document.getElementById('qmPickBtn').onclick=()=>{
  try{
    const now=new Date();
    const hi=parseInt(document.getElementById('qmHour').value);
    const zhi=SHI12[hi];
    const method=document.getElementById('qimenMethod')?document.getElementById('qimenMethod').value:'chaibu';
    const scene=document.getElementById('qmScene')?document.getElementById('qmScene').value:'';
    // 按所选时辰重新起局：该时辰对应 Date 取当日 2*hi+1 时（与五鼠遁口径一致）
    const d=new Date(now.getFullYear(),now.getMonth(),now.getDate(), 2*hi+1, 0, 0);
    const c=qimenCore(d, method);
    // 时轴：黄历黄道吉时判定（按当日日支）
    const dayZhi=Solar.fromYmd(now.getFullYear(),now.getMonth()+1,now.getDate()).getLunar().getDayInGanZhi().charAt(1);
    const off=ZHI.indexOf(dayZhi);
    const god=HH_GODS[((off%6)+hi)%12];
    const timeGood=HH_GOOD.has(god);
    const jiList=_jiShiCalc(dayZhi);
    // 空间轴：奇门吉方（值符所临 + 开门/生门方位）
    const zfDir=PAL_TO_DIR[c.zhiFuPal]||'中';
    const openPal=Object.keys(c.menB).find(p=>c.menB[p]==='开');
    const openDir=openPal?PAL_TO_DIR[openPal]:'';
    const shengPal=Object.keys(c.menB).find(p=>c.menB[p]==='生');
    const shengDir=shengPal?PAL_TO_DIR[shengPal]:'';
    const useDir=(['休','生','开'].includes(c.zfMen))?zfDir:(openDir||shengDir||zfDir);
    const bp=QM_DIR_MAP[useDir];
    const best={pal:bp, men:c.menB[bp]||'—', star:c.starB[bp]||'—', shen:c.shenB[bp]||'—', use:QM_DIR_USE[useDir]||''};
    const box=document.getElementById('qmPickBox'); if(!box) return;
    const dual = timeGood
      ? `时在黄道、方有值符/吉门——宜在 <b>${zhi}时（${SHI_RANGE[zhi]}）</b> 朝 <b style="color:var(--r-gold-soft)">${useDir}方</b> 用事，最利${scene?('「'+scene+'」'):'成事'}。`
      : `时落黑道、方虽有吉——重要用事宜改 <b>${jiList.slice(0,3).join('、')||'邻近吉时'}</b> 等黄道吉时，再朝 <b style="color:var(--r-gold-soft)">${useDir}方</b> 行事；若必用此时，仅取 ${useDir}方、动作从简。`;
    box.innerHTML=`<div style="margin-top:10px;padding:10px 12px;border:1px solid #5a8a6a;border-radius:8px;background:var(--r-subbg);font-size:12.5px;line-height:1.95">
      <div style="color:var(--r-gold-soft);font-weight:600;margin-bottom:6px">奇门 · 问事时辰挑吉方（时 × 方 双轴）</div>
      <p><b>问事时辰</b>：${zhi}时（${SHI_RANGE[zhi]}）— 黄历判定 <b style="color:${timeGood?'var(--good)':'var(--bad)'}">${timeGood?'黄道吉时':'黑道凶时'}</b>（${god}神）</p>
      <p><b>空间轴 · 吉方</b>：值符临 <b>${zfDir}</b>方（${c.zhiFuPal}宫·门 ${c.zfMen}）｜ 开门在 <b>${openDir||'—'}</b>方 ｜ 生门在 <b>${shengDir||'—'}</b>方</p>
      <p>推荐用事方：<b style="color:var(--r-gold-soft)">${useDir}方</b>（${best.pal}宫）— 门 ${best.men} ｜ 星 ${best.star} ｜ 神 ${best.shen}</p>
      <p style="color:var(--good)">${best.use}</p>
      <p style="margin-top:6px"><b>双轴综合</b>：${dual}</p>
      <p style="color:var(--muted);font-size:11.5px;margin-top:6px">今日黄道吉时：${jiList.join('、')||'—'}。* 奇门时家盘随时辰变化，已按所选时辰重新起局。</p>
    </div>`;
  }catch(e){}
};
/* 奇门用神体系（按问事取用神 → 定位宫位 → 综合吉凶） */
const QM_YONG={
  '事业':{title:'事业 · 功名 · 掌权', yong:[{k:'开门',type:'men',name:'开门（官星·事业）'}], tip:'事业看开门：开门临宫得吉星吉神、无空亡门迫，宜进取谋职掌权；落凶门空亡则宜稳守待时。'},
  '求职':{title:'求职 · 应聘', yong:[{k:'开门',type:'men',name:'开门（官星·事业）'}], tip:'求职看开门：开门旺则投递易成；兼看时干（所问事体）生克，时干生日干主有回应。'},
  '求财':{title:'求财 · 生意', yong:[{k:'生门',type:'men',name:'生门（财门）'},{k:'戊',type:'yi',name:'甲子戊（财星）'}], tip:'财看生门与甲子戊：二者所在宫门星旺、不被空迫，则财机可图；若落空亡或门迫，财来易去、宜守不宜投。'},
  '投资':{title:'投资 · 理财', yong:[{k:'生门',type:'men',name:'生门（财门）'},{k:'戊',type:'yi',name:'甲子戊（财星）'}], tip:'投资看生门与甲子戊：生门得吉、戊不落空，可布局；生门逢死惊伤或空亡，宜观望、勿重仓。'},
  '感情':{title:'感情 · 姻缘', yong:[{k:'合',type:'shen',name:'六合（媒妁·婚）'},{k:'乙',type:'yi',name:'乙（女）'},{k:'庚',type:'yi',name:'庚（男）'}], tip:'婚姻看六合为媒、乙庚为男女：六合宫吉、乙庚落宫相生，则姻缘和合；相冲相克宜缓、先修自身。'},
  '出行':{title:'出行 · 迁移', yong:[{k:'天',type:'shen',name:'九天（动扬）'},{k:'伤门',type:'men',name:'伤门（出行）'}], tip:'出行看九天与伤门、驿马：九天临宫宜动、伤门防损耗、驿马发动则行期可定；落空亡则行程易变。'},
  '健康':{title:'健康 · 疾病', yong:[{k:'天芮',type:'star',name:'天芮（病星）'},{k:'死门',type:'men',name:'死门（病门）'}], tip:'病看天芮星与死门：所在宫宜静养、避凶方；逢吉神可化解，落空亡则虚惊多实少，仍须以医为凭。'},
  '学业':{title:'学业 · 考试 · 文书', yong:[{k:'景门',type:'men',name:'景门（文书）'},{k:'天辅',type:'star',name:'天辅（文昌）'}], tip:'考试文书看景门与天辅：临宫得吉则笔下有神、谋事有成；落空亡宜复查补备、勿存侥幸。'},
  '诉讼':{title:'诉讼 · 官非 · 口舌', yong:[{k:'惊门',type:'men',name:'惊门（讼）'},{k:'虎',type:'shen',name:'白虎（刑伤）'}], tip:'讼事看惊门与白虎：惊门临宫防口舌、白虎主刑伤，宜和解避争、勿强讼；时干克日干则我处下风。'},
  '寻物':{title:'寻物 · 失物', yong:[{k:'玄',type:'shen',name:'玄武（失物）'},{k:'时干',type:'shi',name:'时干（所问事）'}], tip:'寻物看玄武与时干所落宫：玄武临宫指失物方位、时干宫示应期；落空亡则难觅、宜先静心回想。'},
  '决策':{title:'抉择 · 决策', yong:[{k:'开门',type:'men',name:'开门（决断）'}], tip:'决策看开门与值符：值符为当下主能量点，开门旺则决而能行；二者皆吉可拍板，一门迫则宜再择时。'},
  '谈判':{title:'谈判 · 协商', yong:[{k:'合',type:'shen',name:'六合（中介·和合）'},{k:'开门',type:'men',name:'开门（通达）'}], tip:'谈判看六合与开门：六合主和合中介、开门主通达，二者得吉则磋商顺、易成；逢白虎玄武则防对方暗手。'},
  '签约':{title:'签约 · 契约', yong:[{k:'合',type:'shen',name:'六合（契约）'},{k:'景门',type:'men',name:'景门（文书）'}], tip:'签约看六合与景门：六合主契约成立、景门主文书无瑕，二者得吉则约可订；落空亡宜复核条款、勿急签。'},
  '置业':{title:'置业 · 购房', yong:[{k:'生门',type:'men',name:'生门（产室·财）'},{k:'开门',type:'men',name:'开门（置业）'}], tip:'置业看生门与开门：生门旺主产业渐丰、开门主交易可成；二者落凶空则宜缓购、防纠纷。'},
  '开业':{title:'开业 · 开张', yong:[{k:'开门',type:'men',name:'开门（开创）'},{k:'生门',type:'men',name:'生门（生发）'}], tip:'开业看开门与生门：开门主开创、生门主生发，双吉则开门红、宜择吉时动土揭牌；逢门迫则先化解再启。'}
};
function qimenYongShen(scene, menB, starB, shenB, diYi, PAL_TO_DIR, kongPals, maPal){
  const cfg=QM_YONG[scene]; if(!cfg) return '';
  const locate=y=>{ let pal=-1;
    if(y.type==='men') pal=Object.keys(menB).find(p=>menB[p]===y.k);
    else if(y.type==='star') pal=Object.keys(starB).find(p=>starB[p]===y.k);
    else if(y.type==='shen') pal=Object.keys(shenB).find(p=>shenB[p]===y.k);
    else if(y.type==='yi') pal=diYi[y.k]||-1;
    return pal; };
  let rows='';
  cfg.yong.forEach(y=>{ const pal=locate(y); let info='';
    if(pal>0){ const dir=PAL_TO_DIR[pal]||PAL_NAME[pal]; const m=menB[pal]||'', s=starB[pal]||'', sh=shenB[pal]||'';
      const flags=[]; if(kongPals.includes(+pal)) flags.push('空亡'); if(pal===maPal) flags.push('驿马');
      const ok=['休','生','开'].includes(m), no=['死','惊','伤'].includes(m); const tone=ok?'吉':no?'凶':'平';
      info=`落 <b>${dir}宫（${PAL_NAME[pal]}）</b> · 门 ${m} · 星 ${s} · 神 ${sh} <span style="color:${ok?'var(--good)':no?'var(--bad)':'var(--muted)'}">［${tone}${flags.length?'·'+flags.join('·'):''}］</span>`;
    } else if(y.type==='shi'){ info='寄时干宫（主事体当下所值）'; }
    else { info='盘内未显'; }
    rows+=`<div style="font-size:12.5px;margin:4px 0">· <b style="color:var(--r-gold-soft)">${y.name}</b>：${info}</div>`;
  });
  return `<div style="margin-top:10px;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--r-subbg)"><div style="color:var(--r-gold-soft);font-weight:600;font-size:13px;margin-bottom:4px">用神定位 · ${cfg.title}</div>${rows}<p style="color:var(--muted);font-size:11.5px;margin-top:4px">${cfg.tip}</p></div>`;
}
document.getElementById('qimenBtn').onclick=()=>{
  const now=new Date();
  const scene=document.getElementById('qmScene')?document.getElementById('qmScene').value:'';
  const lunar=Solar.fromYmd(now.getFullYear(),now.getMonth()+1,now.getDate()).getLunar();
  // 当前节气（取最近一个已过的交节）
  const prevJ=lunar.getPrevJie();
  const jqName=prevJ?prevJ.getName():'冬至';
  const yang=YANG_SET.has(jqName);
  const jtab=yang?YANG_JU:YIN_JU;
  // 定局法：拆补法（交节日干支旬首支定三元） / 置闰法（超神接气 · 简化：取最近甲己日符头定三元）
  const QIMEN_METHOD=document.getElementById('qimenMethod').value;
  const jqSolar=prevJ.getSolar();
  const jqL=Solar.fromYmd(jqSolar.getYear(),jqSolar.getMonth(),jqSolar.getDay()).getLunar();
  const jqZ=jqL.getDayInGanZhi().charAt(1);
  let yuan;
  if(QIMEN_METHOD==='zrun'){
    let fuZ='';
    for(let k=0;k<60;k++){ const dd=new Date(now.getFullYear(),now.getMonth(),now.getDate()-k);
      const lu=Solar.fromYmd(dd.getFullYear(),dd.getMonth()+1,dd.getDate()).getLunar();
      const dgz=lu.getDayInGanZhi(); if(dgz.charAt(0)==='甲'||dgz.charAt(0)==='己'){ fuZ=dgz.charAt(1); break; } }
    const fz=fuZ||jqZ;
    yuan = ['子','午','卯','酉'].includes(fz)?0 : ['寅','申','巳','亥'].includes(fz)?1 : 2;
  } else {
    yuan = ['子','午','卯','酉'].includes(jqZ)?0 : ['寅','申','巳','亥'].includes(jqZ)?1 : 2;
  }
  const ju=jtab[jqName][yuan];
  // 时辰干支（五鼠遁）
  const dgz=lunar.getDayInGanZhi(); const dayGan=dgz.charAt(0);
  const hz=Math.floor((now.getHours()+1)/2); const shiZhi=ZHI[hz-1];
  const wushu={甲:'甲',乙:'丙',丙:'戊',丁:'庚',戊:'壬',己:'甲',庚:'丙',辛:'戊',壬:'庚',癸:'壬'};
  const shiGan=GAN[(GAN_IDX[wushu[dayGan]]+(hz-1))%10];
  const shiGZ=shiGan+shiZhi;
  // 旬首所遁之仪（值符值使所在）
  const xunYi=DZ_TO_XUN[shiZhi];
  // 地盘三奇六仪：戊入局数宫，阳顺阴逆布 戊己庚辛壬癸丁丙乙
  const diYi={};
  for(let k=0;k<9;k++){ const pal=yang?((ju-1+k)%9+1):((ju-1-k+9)%9+1); diYi[YI[k]]=pal; }
  const zhiFuPal=diYi[xunYi];                     // 值符(地盘)宫
  // 天盘九星：值符随「时干」平移 —— 时辰干支在所属旬内的序号（0~9）决定移动步数
  const xunIdx=Math.floor(gz60(shiGZ)/10);
  const ordInXun=(gz60(shiGZ)-xunIdx*10)%10;
  const tfPal=yang?((zhiFuPal-1+ordInXun)%9+1):((zhiFuPal-1-ordInXun+9)%9+1); // 值符天盘宫
  const starB={}; for(let k=0;k<9;k++){ const pal=yang?((tfPal-1+k)%9+1):((tfPal-1-k+9)%9+1); starB[pal]=STAR9_SEQ[k]; }
  // 人盘八门：值使随时支，从值使(地盘值符宫)起顺逆数到时支
  const shiMenPal=yang?((zhiFuPal-1+ordInXun)%9+1):((zhiFuPal-1-ordInXun+9)%9+1);
  const menB={}; for(let k=0;k<8;k++){ const pal=yang?((shiMenPal-1+k)%9+1):((shiMenPal-1-k+9)%9+1); menB[pal]=MEN_SEQ[k]; }
  // 神盘八神：值符神随时干（值符天盘宫），阳顺阴逆
  const shenB={}; for(let k=0;k<8;k++){ const pal=yang?((tfPal-1+k)%9+1):((tfPal-1-k+9)%9+1); shenB[pal]=SHEN8[k]; }
  // 值使宫（人盘值使之门所在宫）与隐干（时干入值使宫，门后暗藏动因）
  const zhiShiPal=shiMenPal, yinGan=shiGan;
  // 驿马（时支三合局）：申子辰→寅、寅午戌→申、巳酉丑→亥、亥卯未→巳
  const MA={申:'寅',子:'寅',辰:'寅',寅:'申',午:'申',戌:'申',巳:'亥',酉:'亥',丑:'亥',亥:'巳',卯:'巳',未:'巳'};
  const maZhi=MA[shiZhi]||'';
  // 旬空（时辰干支所在旬的空亡两支）
  const i60=gz60(shiGZ), xunI=Math.floor(i60/10);
  const kong1=ZHI[(xunI*10+10)%12], kong2=ZHI[(xunI*10+11)%12];
  // 九宫地支盘（洛书方位）：坎子/艮丑寅/震卯/巽辰巳/离午/坤未申/兑酉/乾戌亥
  const PAL_DZ={1:['子'],8:['丑','寅'],3:['卯'],4:['辰','巳'],9:['午'],2:['未','申'],7:['酉'],6:['戌','亥']};
  const dzToPal=z=>{ for(const p in PAL_DZ){ if(PAL_DZ[p].includes(z)) return +p; } return 5; };
  const maPal=maZhi?dzToPal(maZhi):0;
  const kongPals=[dzToPal(kong1),dzToPal(kong2)];
  const ORDER=[4,9,2,3,5,7,8,1,6];
  /* 九宫逐宫断语：每宫×门吉/凶/平，各 2 变体（含方位与领域）；特殊星/神再点缀一句——对标紫微十二宫逐宫断语 */
  const QM_GONG={
    '坎':{ok:['坎宫（北·谋略之地）——今门吉，智谋可行，此方谋事易成','坎宫（北·智水之地）逢吉门——谋定而后动，事半功倍'],no:['坎宫（北·谋略之地）——门凶则谋多受阻，宜缓不宜进','坎宫（北·智水之地）遇凶门——先稳心神，再图谋事'],mid:['坎宫（北·谋略之地）——门平，可谋可守，视机而动','坎宫（北·智水之地）门平——谋事徐徐图之，不争先']},
    '坤':{ok:['坤宫（西南·包容之地）——门吉，宜合作包容、养势蓄力','坤宫（西南·厚土之地）逢吉门——守成养望，多得助力'],no:['坤宫（西南·包容之地）——门凶，防拖延负重，宜精简','坤宫（西南·厚土之地）遇凶门——事多缠身，宜减负'],mid:['坤宫（西南·包容之地）——门平，顺势而为，不宜强求','坤宫（西南·厚土之地）门平——平稳推进，静待时机']},
    '震':{ok:['震宫（东·行动之地）——门吉，宜果断行动、雷厉风行','震宫（东·雷动之地）逢吉门——动中求成，别犹豫'],no:['震宫（东·行动之地）——门凶，防冒进生变，宜稳','震宫（东·雷动之地）遇凶门——动静皆宜缓，先安局'],mid:['震宫（东·行动之地）——门平，可动可静，看势而定','震宫（东·雷动之地）门平——小步快走，不冒头']},
    '巽':{ok:['巽宫（东南·文书之地）——门吉，利文书往来、名声传播','巽宫（东南·风行之地）逢吉门——借风势，文书人脉皆顺'],no:['巽宫（东南·文书之地）——门凶，防文书口舌生变','巽宫（东南·风行之地）遇凶门——慎签慎言，避传播之患'],mid:['巽宫（东南·文书之地）——门平，文书之事按部就班','巽宫（东南·风行之地）门平——消息往来，多核对再定']},
    '中':{ok:['中宫（中央·调和之地）——门吉，居中调停，诸事平稳','中宫（中央·枢纽之地）逢吉门——承上启下，正合其位'],no:['中宫（中央·调和之地）——门凶，防中枢受累，宜抽身','中宫（中央·枢纽之地）遇凶门——居中者易被牵连，避是非'],mid:['中宫（中央·调和之地）——门平，守中即安','中宫（中央·枢纽之地）门平——不偏不倚，坐观其变']},
    '乾':{ok:['乾宫（西北·权威之地）——门吉，宜决策拍板、执掌大局','乾宫（西北·天威之地）逢吉门——决断有据，一锤定音'],no:['乾宫（西北·权威之地）——门凶，防决策失误，宜缓决','乾宫（西北·天威之地）遇凶门——强出头易折，宜从长计议'],mid:['乾宫（西北·权威之地）——门平，大事多斟酌再定','乾宫（西北·天威之地）门平——权责所在，谨慎行事']},
    '兑':{ok:['兑宫（西·口舌之地）——门吉，宜沟通洽谈、言语生财','兑宫（西·泽悦之地）逢吉门——会说话者得利，谈成事'],no:['兑宫（西·口舌之地）——门凶，防口舌是非，慎言','兑宫（西·泽悦之地）遇凶门——言多必失，宜守默'],mid:['兑宫（西·口舌之地）——门平，言谈有度，不惹是非','兑宫（西·泽悦之地）门平——可说可不说，点到为止']},
    '艮':{ok:['艮宫（东北·山止之地）——门吉，宜固守根基、以静制动','艮宫（东北·阻隔之地）逢吉门——止则安，守得云开'],no:['艮宫（东北·山止之地）——门凶，防僵局难破，宜变通','艮宫（东北·阻隔之地）遇凶门——事陷停滞，需借外力破局'],mid:['艮宫（东北·山止之地）——门平，事缓则圆，不宜强推','艮宫（东北·阻隔之地）门平——进退两难时，先安内']},
    '离':{ok:['离宫（南·名望之地）——门吉，利扬名、文书、光彩之事','离宫（南·火明之地）逢吉门——声名渐起，宜展现'],no:['离宫（南·名望之地）——门凶，防虚火虚名，宜低调','离宫（南·火明之地）遇凶门——树大招风，敛光为要'],mid:['离宫（南·名望之地）——门平，名分之事顺其自然','离宫（南·火明之地）门平——不争名，名自来']}
  };
  const QM_STAR_TIP={'天芮':['天芮临宫，防病扰琐碎，宜保重'],'天辅':['天辅临宫，利文书学业'],'天英':['天英临宫，有名利之象、防虚火'],'天蓬':['天蓬临宫，防破耗暗昧，宜谨慎'],'天柱':['天柱临宫，防口舌阻隔，宜守默'],'天冲':['天冲临宫，冲劲足、防急躁']};
  const QM_SHEN_TIP={'蛇':['蛇神临宫，防虚惊纠缠，宜明辨'],'虎':['白虎临宫，防刑伤，宜避其锋'],'玄':['玄武临宫，防盗失诡诈'],'合':['六合临宫，利合作姻缘'],'天':['九天临宫，宜昂扬进取、主动出击'],'地':['九地临宫，宜潜藏蓄力、待时而发']};
  function _qmGongSay(pal, men, star, shen){
    const pool=QM_GONG[PAL_NAME[pal]]; if(!pool) return '';
    const isOk=['休门','生门','开门'].includes(men), isNo=['死门','惊门','伤门'].includes(men);
    const arr=isOk?pool.ok:isNo?pool.no:pool.mid;
    let s=arr[_hashStr('qm'+pal+men)%arr.length];
    const st=QM_STAR_TIP[star]; if(st) s+='；'+st[0];
    const sh=QM_SHEN_TIP[shen]; if(sh) s+='；'+sh[0];
    return s;
  }
  const cells=ORDER.map(pal=>{
    const gz=pal===5?'中':PAL_NAME[pal];
    const yi=Object.keys(diYi).find(k=>diYi[k]===pal)||'';
    const extra=[];
    if(pal===zhiShiPal) extra.push(`<div class="sub" style="color:var(--r-gold-soft)">隐干 ${yinGan}</div>`);
    if(pal===maPal) extra.push(`<div class="sub" style="color:var(--good)">★驿马·${maZhi}（动象）</div>`);
    if(kongPals.includes(pal)) extra.push(`<div class="sub" style="color:var(--bad)">空亡（虚象）</div>`);
    return `<div class="qmcell${pal===zhiShiPal?' zfcell':''}${pal===maPal?' mapal':''}${kongPals.includes(pal)?' kongpal':''}"><div class="pal">${pal}·${gz}</div>
      <div class="sub">地仪 ${yi||'—'}</div>
      <div class="sub">门 ${menB[pal]||'—'}</div>
      <div class="sub">星 ${starB[pal]||'—'}</div>
      <div class="sub">神 ${shenB[pal]||'—'}</div>${extra.join('')}<div class="qm-say">${_qmGongSay(pal, menB[pal]||'', starB[pal]||'', shenB[pal]||'')}</div></div>`;
  }).join('');
  /* 奇门白话解读（值符宫的门/星主能量） */
  const MEN_MEAN={'休门':'主休养，宜歇息、调停、求谋合作','生门':'主生发，宜求财、见贵人、谋开业','开门':'主开创，宜公干、远行、开市','伤门':'主损伤，此方宜守不宜动','杜门':'主闭塞，宜闭关防人、不宜出入','景门':'主文书，宜文化、喜事、谋名','死门':'主晦滞，此方宜回避','惊门':'主惊扰，防口舌是非、宜谨慎'};
  const STAR_MEAN={'天心':['有智谋相助，遇事有解','天心临宫，得良谋善断，难题多有解法','天心在宫，沉稳有方，临事不慌、自有章法'],'天辅':['得文教贵人，利文书学业','天辅临宫，文昌照命，读书应试顺','天辅在宫，文书才艺得力，宜勤学多动笔'],'天任':['安定之福，根基扎实','天任临宫，踏实稳妥，步步走得实','天任在宫，任重力稳，宜守成养基'],'天禽':['中正平和，平稳无咎','天禽临宫，气度中和，诸事少波','天禽在宫，稳当无虞，顺其自然地就好'],'天冲':['冲劲有余，成事易急','天冲临宫，雷厉风行但防冒进','天冲在宫，宜借冲劲破局、莫冲过了头'],'天英':['有名利之象，但防虚火','天英临宫，声名易起、宜落地求实','天英在宫，才名外显，别让虚火盖了实功'],'天芮':['防病扰琐碎，宜保重','天芮临宫，小恙宜早调、莫拖延','天芮在宫，身况易疲，先顾作息饮食'],'天柱':['防口舌阻隔，宜守默','天柱临宫，言多易生阻，少说多做','天柱在宫，防是非缠身，守口为安'],'天蓬':['防破耗暗昧，宜谨慎','天蓬临宫，财事大进大出，量入为出','天蓬在宫，防暗昧之失，大事多核实']};
  /* 八神含义 + 八门/九宫五行（用于门迫·宫克判断） */
  const SHEN_MEAN={'符':'值符——八神之首，百恶消散，所临之方最吉、主核心贵气。','蛇':'腾蛇——虚惊怪异、纠缠多变，主口舌疑惑，宜明辨勿慌。','阴':'太阴——阴佑隐庇，宜密谋策划、暗中行事。','合':'六合——和合中介，利婚媒交易、人缘相谐。','虎':'白虎——凶伤之将，主疾病刑伤，宜避其锋。','玄':'玄武——盗失诡诈，防财物遗失、虚诈小人。','地':'九地——隐伏迟滞，宜屯兵固守、潜藏养力。','天':'九天——扬兵进取，主昂扬外显、宜主动出击。'};
  const MEN_WU={'休':'水','生':'土','开':'金','伤':'木','杜':'木','景':'火','死':'土','惊':'金','中':'土'};
  const PAL_WU={'坎':'水','坤':'土','震':'木','巽':'木','中':'土','乾':'金','兑':'金','艮':'土','离':'火'};
  const zfMen=menB[zhiFuPal]||'', zfStar=starB[zhiFuPal]||'', zfShen=shenB[zhiFuPal]||'';
  const menTip=['休门','生门','开门'].includes(zfMen)?'门吉，此时此方行事多顺，宜主动谋事。':['死门','惊门','伤门'].includes(zfMen)?'门凶，此时宜守不宜攻，重要决断可另择时。':'门平，可进可退，视事而定。';
  // 门迫 / 宫克：门五行克宫五行为"门迫"（吉门亦减力），宫五行克门五行为"宫克门"（力难展）
  let poStr='';
  ORDER.forEach(pal=>{ const m=menB[pal]; if(!m) return; const mw=MEN_WU[m]||'', pw=PAL_WU[PAL_NAME[pal]]||'';
    if(mw&&pw){ if(KE[mw]===pw) poStr+=(poStr?'、':'')+pal+'宫'+m+'门迫'; else if(KE[pw]===mw) poStr+=(poStr?'、':'')+pal+'宫'+m+'受宫克'; } });
  const qmRead=wrapTerms(`<h4>白话解读</h4>
    <p>一句话：本局以值符落 <b style="color:var(--r-gold-soft)">${zhiFuPal}宫（${PAL_NAME[zhiFuPal]}）</b> 为能量核心，门 <b style="color:var(--r-gold-soft)">${zfMen}</b>、星 <b style="color:var(--r-gold-soft)">${zfStar}</b>——${menTip}</p>
    <p>值符是此刻时空的"主能量点"，吉凶多系于此；该宫八门 <b style="color:var(--r-gold-soft)">${zfMen}</b>：${MEN_MEAN[zfMen]||'按门意取舍'}；九星 <b style="color:var(--r-gold-soft)">${zfStar}</b>：${STAR_MEAN[zfStar]?STAR_MEAN[zfStar][_hashStr('qmstar'+zfStar)%STAR_MEAN[zfStar].length]:'按星意参考'}。</p>
    <p>值符宫八神为 <b style="color:var(--r-gold-soft)">${zfShen}</b>：${SHEN_MEAN[zfShen]||'按神意参考'}。</p>
    <p>${poStr?('⚠ 本局见 <b style="color:var(--bad)">门迫/宫克</b>：'+poStr+'——相关方位吉门减力、宜回避或另择时。'):'八门飞布得位，无门迫宫克之患，诸方可用。'}</p>
    <p>值使落 <b style="color:var(--r-gold-soft)">${zhiShiPal}宫（${PAL_NAME[zhiShiPal]}）</b>，隐干（门后暗藏的时干）为 <b style="color:var(--r-gold-soft)">${yinGan}</b>——是表面之下未明说的动因。</p>
    <p>驿马在 <b style="color:var(--r-gold-soft)">${maPal}宫（${maZhi||'—'}）</b>：主变动、出行、奔波，宜动中求成；旬空在 <b style="color:var(--r-gold-soft)">${kong1}${kong2}</b>：主虚惊、事易落空，重要之事忌悬而未决。</p>
    ${qimenSceneLine(scene, {zfMen, zfShen, zfStar, poStr, maPal, kongPals})}
    <p style="color:var(--r-muted);font-size:12px;margin-top:6px">* 解读由值符/值使宫的门星与驿马、空亡生成；局是参考，抉择在自己。</p>`);
  const sayByPal={}; ORDER.forEach(pal=>{ sayByPal[pal]=_qmGongSay(pal, menB[pal]||'', starB[pal]||'', shenB[pal]||''); });
  window._qmDirData={menB, starB, shenB, sayByPal, zhiFuPal};
  document.getElementById('qimenResult').innerHTML=`<div class="result">
    <h3>${yang?'阳遁':'阴遁'} 第 ${ju} 局（${QIMEN_METHOD==='zrun'?'置闰法':'拆补法'}·${['上','中','下'][yuan]}元）</h3>
    <span class="tag">节气 ${jqName}</span>
    <span class="tag">值符宫 ${zhiFuPal}·${PAL_NAME[zhiFuPal]}</span>
    <span class="tag">值使宫 ${zhiShiPal}·${PAL_NAME[zhiShiPal]}</span>
    <span class="tag">驿马 ${maZhi||'—'}（${maPal||'—'}宫）</span>
    <span class="tag">旬空 ${kong1}${kong2}</span>
    <span class="tag">时干 ${shiGZ}</span>
    <div class="qmtable">${cells}</div>
    <p style="margin-top:10px;font-size:13px">问事方位速查（点方位看该宫吉凶与用事建议）：</p>
    <div style="display:flex;flex-wrap:wrap;gap:6px">${Object.keys(QM_DIR_MAP).map(dir=>`<span class="tag" style="cursor:pointer" onclick="qmDirPick('${dir}')">${dir}</span>`).join('')}</div>
    <div id="qmDirBox"></div>
    ${qmRead}
    ${scene?qimenYongShen(scene, menB, starB, shenB, diYi, PAL_TO_DIR, kongPals, maPal):''}
    <p style="color:var(--muted);font-size:12px;margin-top:8px">* 专业排盘：${QIMEN_METHOD==='zrun'?'置闰法（超神接气 · 简化）':'拆补法'}定局（节气+三元），值符值使随时干时支、九星八门八神按阳顺阴逆转盘飞布；用神取象依传统奇门用神法则。不作决策依据</p></div>`;
  const qmRes=document.getElementById('qimenResult').querySelector('.result');
  if(qmRes){ const _s=menTip.indexOf('门吉')>=0?'吉':menTip.indexOf('门凶')>=0?'凶':'平'; qmRes.dataset.school='奇门'; qmRes.dataset.sentiment=_s; const _b=document.getElementById('baziResult').querySelector('.result'); if(_b&&window.appendConsensus) window.appendConsensus(_b); }
};

/* ---------- 合盘合婚（八字真实规则 + 星座元素相性） ---------- */
document.getElementById('hehunBtn').onclick=()=>{
  const mD=document.getElementById('mA').value, fD=document.getElementById('fA').value;
  if(!mD||!fD){hintResult('hehunResult','请选择男女双方生日后再合婚。');return;}
  function bz(dateStr,hour,gender){ const [y,m,day]=dateStr.split('-').map(Number);
    const solar=Solar.fromYmdHms(y,m,day,hour,0,0); const lunar=solar.getLunar(); const ec=lunar.getEightChar();
    let xz=''; try{ xz=solar.getXingZuo()||''; }catch(e){}
    const by=y; let yunArr=[], qy=0;
    try{ const yun=ec.getYun(gender==='男'?1:0,1); qy=yun.getStartYear()||0; const da=yun.getDaYun();
      da.forEach((p,i)=>{ if(i>=8) return; const gz=p.getGanZhi(); if(!gz) return; yunArr.push({i, gz, gan:gz.charAt(0), zhi:gz.charAt(1), cStart: by+qy+i*10}); }); }catch(e){}
    let wuCnt={金:0,木:0,水:0,火:0,土:0};
    try{ const pz=[ec.getYearGanZhi(),ec.getMonthGanZhi(),ec.getDayGanZhi(),ec.getHourGanZhi()];
      pz.forEach(gz=>{ const g=gz.charAt(0), z=gz.charAt(1); const wg=GAN_WU[g], wz=DZ_WU[z]; if(wg)wuCnt[wg]++; if(wz)wuCnt[wz]++; }); }catch(e){}
    return {sx:lunar.getYearShengXiao(),dayGan:ec.getDayGan(),dayWu:GAN_WU[ec.getDayGan()],xz, by, yunArr, qy, wuCnt}; }
  /* 双方五行互补 · 用神雷达（五边形：金木水火土，归一化双色叠加 + 互补度评分） */
  function wuComplementRadar(m,f){
    const els=['金','木','水','火','土'];
    const vM=els.map(e=>m.wuCnt?m.wuCnt[e]:0), vF=els.map(e=>f.wuCnt?f.wuCnt[e]:0);
    const sumM=vM.reduce((a,b)=>a+b,0)||1, sumF=vF.reduce((a,b)=>a+b,0)||1;
    const nM=vM.map(x=>x/sumM), nF=vF.map(x=>x/sumF);
    let dot=0,mM=0,mF=0; for(let i=0;i<5;i++){ dot+=nM[i]*nF[i]; mM+=nM[i]*nM[i]; mF+=nF[i]*nF[i]; }
    const cos= mM&&mF ? dot/(Math.sqrt(mM)*Math.sqrt(mF)) : 0;
    const comp=Math.round((1-cos)*100);
    const cx=150, cy=118, R=86;
    const pt=(i,r)=>{ const a=(-90+i*72)*Math.PI/180; return [cx+r*Math.cos(a), cy+r*Math.sin(a)]; };
    const poly=v=>v.map((s,i)=>{ const p=pt(i, R*Math.max(s,0.05)); return p[0].toFixed(1)+','+p[1].toFixed(1); }).join(' ');
    const grid=els.map((e,i)=>{ const o=pt(i,R), inn=pt(i,R*0.25); return '<line x1="'+o[0].toFixed(1)+'" y1="'+o[1].toFixed(1)+'" x2="'+inn[0].toFixed(1)+'" y2="'+inn[1].toFixed(1)+'" stroke="rgba(255,255,255,.12)" stroke-width="1"/>'; }).join('')
      + els.map((e,i)=>{ const o=pt(i,R+13); return '<text x="'+o[0].toFixed(1)+'" y="'+(o[1]+4).toFixed(1)+'" text-anchor="middle" font-size="11" fill="var(--muted)">'+e+'</text>'; }).join('');
    const colM='#6fb6c9', colF='#d39ab6';
    const lab = comp>=70?'五行互补、刚柔相济，能互相补缺':comp>=40?'互补相济、也有同频，配合度不错':'五行相近、气质趋同，默契天然但少点互补';
    return `<div style="margin-top:10px;padding:10px 12px;border-left:3px solid #5a8a6a;background:var(--r-subbg);font-size:12.5px;line-height:1.9">
      <b style="color:var(--gold2)">五行互补 · 用神雷达</b>
      <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
        <svg width="300" height="236" viewBox="0 0 300 236">${grid}
          <polygon points="${poly(nM)}" fill="${colM}" fill-opacity=".22" stroke="${colM}" stroke-width="1.6"/>
          <polygon points="${poly(nF)}" fill="${colF}" fill-opacity=".22" stroke="${colF}" stroke-width="1.6"/>
        </svg>
        <div style="font-size:12.5px;line-height:1.8">
          <div><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${colM}"></span> 男 ${m.sx}${m.dayGan}（日主${m.dayWu}）</div>
          <div><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${colF}"></span> 女 ${f.sx}${f.dayGan}（日主${f.dayWu}）</div>
          <div style="margin-top:6px">互补度：<b style="color:var(--gold2);font-size:18px">${comp}</b> / 100</div>
          <div style="color:var(--muted)">${lab}</div>
        </div>
      </div>
      <p style="font-size:11px;color:var(--muted)">雷达以双方四柱五行计数归一化绘制；互补度＝100−余弦相似度，差异越大越互补（仅示五行结构，非定论）。</p>
    </div>`;
  }
  /* 长线维度：大运 / 流年同步（20 年窗口） */
  function hehunSyncHTML(m,f){
    const cy=new Date().getFullYear();
    const WUHE={甲:'己',乙:'庚',丙:'辛',丁:'壬',戊:'癸',己:'甲',庚:'乙',辛:'丙',壬:'丁',癸:'戊'};
    const clsM=g=>{const w=GAN_WU[g]; if(SHENG[w]===m.dayWu)return'吉'; if(w===m.dayWu)return'吉'; if(KE[w]===m.dayWu)return'凶'; return'平';};
    const clsF=g=>{const w=GAN_WU[g]; if(SHENG[w]===f.dayWu)return'吉'; if(w===f.dayWu)return'吉'; if(KE[w]===f.dayWu)return'凶'; return'平';};
    const yunAt=(arr,qy,year,by)=>{ if(!arr.length)return null; let idx=Math.floor((year-by-qy)/10); if(idx<0)idx=0; if(idx>=arr.length)idx=arr.length-1; return arr[idx]; };
    const rows=[]; let bestWin=null,winLen=0,curStart=null; const jiYears=[],badYears=[];
    for(let y=cy-1;y<=cy+18;y++){
      const my=yunAt(m.yunArr,m.qy,y,m.by), fy=yunAt(f.yunArr,f.qy,y,f.by);
      const mc=my?clsM(my.gan):'—', fc=fy?clsF(fy.gan):'—';
      const lg=yearGZ_LC(y); const lgan=lg.charAt(0), lz=lg.charAt(1);
      let sc=0; const nts=[];
      if(WUHE[lgan]===m.dayGan){sc++;nts.push('合男日干');}
      if(WUHE[lgan]===f.dayGan){sc++;nts.push('合女日干');}
      const mZ=ZODIAC_ZHI[m.sx], fZ=ZODIAC_ZHI[f.sx];
      if(DZ_HE[lz]===mZ||(DZ_SANHE[lz]&&DZ_SANHE[lz].includes(mZ))){sc++;nts.push('合男肖');}
      if(DZ_HE[lz]===fZ||(DZ_SANHE[lz]&&DZ_SANHE[lz].includes(fZ))){sc++;nts.push('合女肖');}
      if(DZ_CHONG[lz]===mZ){sc-=2;nts.push('冲男肖');}
      if(DZ_CHONG[lz]===fZ){sc-=2;nts.push('冲女肖');}
      const ltag=sc>=2?'吉':sc<=-1?'凶':'平';
      if(ltag==='吉')jiYears.push(y); else if(ltag==='凶')badYears.push(y);
      const yunBoth=(mc==='吉'&&fc==='吉')?'双顺':(mc==='凶'&&fc==='凶')?'双逆':(mc==='吉'||fc==='吉')?'单顺':'平';
      const comb=ltag==='凶'?'凶':(yunBoth==='双顺'?'优':(yunBoth==='单顺'||ltag==='吉')?'中':'平');
      rows.push({y,mc,fc,yunBoth,ltag,nts,myGz:my?my.gz:'—',fyGz:fy?fy.gz:'—',comb});
      if(comb==='优'){ if(curStart===null)curStart=y; winLen++; if(winLen>=3&&!bestWin)bestWin=[curStart,y]; } else { curStart=null; winLen=0; }
    }
    const colOf=c=>c==='优'?'#5fae5f':c==='凶'?'#c24234':c==='中'?'#9a8a5a':'#6a6a6a';
    const tl=rows.map(r=>{
      const star=r.comb==='优'?'★':'';
      const tip=`${r.y}年｜男大运 ${r.myGz}（${r.mc}）｜女大运 ${r.fyGz}（${r.fc}）｜流年 ${r.ltag}${r.nts.length?'·'+r.nts.join('、'):''}`;
      return `<span class="htl-cell" data-tip="${tip}" style="display:inline-block;min-width:28px;text-align:center;padding:3px 2px;margin:2px;border-radius:5px;background:${colOf(r.comb)};color:#fff;font-size:10px;cursor:help">${r.y%100}${star}</span>`;
    }).join('');
    const mNow=yunAt(m.yunArr,m.qy,cy,m.by), fNow=yunAt(f.yunArr,f.qy,cy,f.by);
    const mNowCls=mNow?clsM(mNow.gan):'—', fNowCls=fNow?clsF(fNow.gan):'—';
    const hh=_hashStr(m.by+f.by+m.dayGan+f.dayGan+'sync');
    const winTxt = bestWin ? ('在 <b style="color:var(--gold2)">'+bestWin[0]+'–'+bestWin[1]+'</b> 年步入「双顺大运」，是成家立业的黄金窗口') : '大运暂未同步共振，宜各自蓄力、遇吉年再合力';
    const jiTxt = jiYears.length ? ('；流年 '+jiYears.slice(0,3).join('、')+' 利婚缘，可重点把握') : '';
    const badTxt = badYears.length ? ('；'+badYears.slice(0,2).join('、')+' 年冲生肖，宜守不宜大动') : '';
    const verdict=[
      `长线看：你们${winTxt}${jiTxt}${badTxt}。`,
      `大运流年叠加：男方现行长运 <b>${mNow?mNow.gz+'（'+mNowCls+'）':'—'}</b>、女方 <b>${fNow?fNow.gz+'（'+fNowCls+'）':'—'}</b>${bestWin?('；'+bestWin[0]+' 起双运共振约 '+(bestWin[1]-bestWin[0]+1)+' 年'):''}——顺运中成事，事半功倍。`
    ][hh%2];
    window.__hehunTL={rows,cy,bestWin,jiYears,badYears,mName:m.sx+'·'+m.dayGan,fName:f.sx+'·'+f.dayGan};
    return `<div style="margin-top:10px;padding:10px 12px;border-left:3px solid #5a8a6a;background:var(--r-subbg);font-size:12.5px;line-height:1.9">
      <b style="color:var(--gold2)">长线维度 · 大运 / 流年同步</b>
      <p style="font-size:11.5px;color:var(--muted)">男方现运 ${mNow?mNow.gz+'（'+mNowCls+'）':'—'}　女方现运 ${fNow?fNow.gz+'（'+fNowCls+'）':'—'}（大运生扶日主为吉、克泄为逆）</p>
      <div style="line-height:1.25">${tl}</div>
      <p style="font-size:11px;color:var(--muted)">▲ 绿=双顺大运·利婚缘★ ｜ 红=流年冲煞·宜守 ｜ 黄=单顺/流年吉 ｜ 灰=平。横轴 ${cy-1}–${cy+18} 年（悬停每格看当年明细）</p>
      ${bestWin?`<p>双人运共振窗口：<b style="color:var(--gold2)">${bestWin[0]}–${bestWin[1]} 年</b>（男方 ${yunAt(m.yunArr,m.qy,bestWin[0],m.by).gz} 运 · 女方 ${yunAt(f.yunArr,f.qy,bestWin[0],f.by).gz} 运，皆顺）。</p>`:''}
      ${jiYears.length?`<p>流年宜婚 / 利缘之年：<b style="color:var(--good)">${jiYears.slice(0,4).join('、')}</b> 年（天干五合或生肖三合/六合）。</p>`:''}
      ${badYears.length?`<p>流年宜守之年：<b style="color:var(--bad)">${badYears.slice(0,4).join('、')}</b> 年（生肖相冲，大事缓行）。</p>`:''}
      <p>${verdict}</p>
      <button class="btn" style="margin-top:8px;font-size:12px;padding:5px 11px;background:#3a5c44" onclick="hehunExportImg()">导出图片（PNG）</button>
    </div>`;
  }
  const m=bz(mD,parseInt(document.getElementById('mH').value),'男');
  const f=bz(fD,parseInt(document.getElementById('fH').value),'女');
  const mz=ZODIAC_ZHI[m.sx], fz=ZODIAC_ZHI[f.sx];
  const he=(DZ_HE[mz]===fz||DZ_HE[fz]===mz)||(DZ_SANHE[mz]&&DZ_SANHE[mz].includes(fz));
  const chong=DZ_CHONG[mz]===fz;
  const WUHE={甲:'己',乙:'庚',丙:'辛',丁:'壬',戊:'癸',己:'甲',庚:'乙',辛:'丙',壬:'丁',癸:'戊'};
  const ganHe=WUHE[m.dayGan]===f.dayGan;
  const wuComp=(SHENG[m.dayWu]===f.dayWu)||(SHENG[f.dayWu]===m.dayWu)||(m.dayWu===f.dayWu);
  let score=40; if(he)score+=20; if(chong)score-=20; if(ganHe)score+=20; if(wuComp)score+=10;
  score=Math.max(10,Math.min(99,score));
  const advice=score>=75?'天作之合，宜珍重经营。':score>=55?'良缘可成，互补中见温情。':score>=40?'平平之缘，磨合为上。':'缘分较浅，宜多理解包容。';
  // 星座元素相性
  const mXz=(m.xz||'').replace('座',''), fXz=(f.xz||'').replace('座','');
  const mEl=mXz?STAR_ATTR[mXz]&&STAR_ATTR[mXz].el:'', fEl=fXz?STAR_ATTR[fXz]&&STAR_ATTR[fXz].el:'';
  const EL_REL={'火·风':'火借风势，激情与行动都旺','风·火':'火花四溅的组合，行动力拉满','水·土':'水土相润，安稳滋养的组合','土·水':'务实中见温情，越处越稳','火·火':'同元素共鸣，热烈也易互不相让','土·土':'同元素沉稳，踏实也有点固执','风·风':'同元素自由，彼此给足空间','水·水':'同元素敏感，情绪同频也易一起内耗','火·土':'火土相生，热情落地为安稳','土·火':'先立基再燃火，稳中有进','火·水':'火水相激，热情与情绪需要调和','水·火':'冷热交锋，宜互相体谅','风·土':'风土相磨，想法与务实需要磨合','土·风':'落地与变通各让一步','风·水':'风水相生，理性与感性互补','水·风':'思路与感受可以兼得'};
  const elTxt=mEl&&fEl?(EL_REL[mEl+'·'+fEl]||'元素相性平平'):'';
  // 日干五行生克方向
  const wuTxt = SHENG[m.dayWu]===f.dayWu?`男方${m.dayWu}生女方${f.dayWu}——男倾注付出，宜多关照女方`
    : SHENG[f.dayWu]===m.dayWu?`女方${f.dayWu}生男方${m.dayWu}——女方持家，男方得滋养`
    : KE[m.dayWu]===f.dayWu?`男方${m.dayWu}克女方${f.dayWu}——男方主导，女方宜以柔化之`
    : KE[f.dayWu]===m.dayWu?`女方${f.dayWu}克男方${m.dayWu}——女方强势，男方宜多包容`
    : '日主五行比和——同类相惜，默契多于争执';
  // 生肖关系细化（复用 zodiacRel）
  let sxTxt='生肖关系平平';
  try{ const relZ=zodiacRel(ZOD.indexOf(m.sx), ZOD.indexOf(f.sx)); sxTxt=`生肖${relZ.type}（${relZ.score}分）——${relZ.tip}`; }catch(e){}
  const _hh=_hashStr(mD+fD);
  const cjPool=[`综合${score>=75?'上等':'可处'}之缘：${sxTxt}、日干${ganHe?'相合':'无合'}、五行${wuComp?'互补':'有克'}——${advice}`,
    `总体看：生肖${he?'相合':chong?'相冲':'平平'}、日干${ganHe?'五合':'平局'}、五行${wuComp?'相生':'相克'}——${advice}`];
  const cj=cjPool[_hh%cjPool.length];
  document.getElementById('hehunResult').innerHTML=`<div class="result">
    <h3>八字合婚</h3>
    <span class="tag">男 ${m.sx}${m.dayGan}</span><span class="tag">女 ${f.sx}${f.dayGan}</span>
    <p style="margin-top:8px">生肖：${he?'六合/三合（<b style="color:var(--gold2)">相合</b>）':chong?'六冲（<b style="color:var(--red2)">相冲</b>）':'一般'}</p>
    <p>日干：${ganHe?'天干五合（<b style="color:var(--gold2)">相合</b>）':'无合（'+m.dayGan+'·'+f.dayGan+'）'}</p>
    <p>五行：${wuComp?'日主相生/比和（<b style="color:var(--gold2)">互补</b>）':'日主相克（需调和）'}</p>
    ${mXz&&fXz?`<p>星座：${m.xz}（${mEl}）· ${f.xz}（${fEl}）——${elTxt}</p>`:''}
    <p style="margin-top:8px">缘分指数：<b style="color:var(--gold2);font-size:20px">${score}</b> / 100</p>
    <p>${advice}</p>
    <div style="margin-top:8px;padding:8px 12px;border-left:3px solid #5a8a6a;background:var(--r-subbg);font-size:12.5px;line-height:1.85"><b style="color:var(--gold2)">合婚细节</b><br>${wuTxt}<br>${sxTxt}<br>${cj}</div>
    ${hehunSyncHTML(m,f)}
    ${wuComplementRadar(m,f)}
    ${yearResonanceHTML(ZOD.indexOf(m.sx), ZOD.indexOf(f.sx), m.xz, f.xz)}
    <p style="color:var(--muted);font-size:12px;margin-top:8px">* 生肖/日干/五行互补与星座元素按真实规则；大运/流年以立春为界、起运岁数为约数；指数为综合评分。</p></div>`;
};

/* ---------- 合婚大运时间轴：hover 详情 + 导出 PNG ---------- */
(function(){
  let tip=null;
  function showTip(c,x,y){ if(!tip){ tip=document.createElement('div'); tip.className='htl-tip'; tip.style.cssText='position:fixed;z-index:9999;pointer-events:none;background:#1a1712;color:#e9d9b8;border:1px solid #5a8a6a;border-radius:6px;padding:6px 9px;font-size:12px;line-height:1.6;max-width:250px;box-shadow:0 4px 16px rgba(0,0,0,.45)'; document.body.appendChild(tip); } tip.textContent=c.getAttribute('data-tip'); tip.style.display='block'; tip.style.left=(x+12)+'px'; tip.style.top=(y+12)+'px'; }
  document.addEventListener('mouseover', e=>{ const c=e.target.closest&&e.target.closest('.htl-cell'); if(c) showTip(c,e.clientX,e.clientY); });
  document.addEventListener('mousemove', e=>{ if(tip&&tip.style.display==='block'){ tip.style.left=(e.clientX+12)+'px'; tip.style.top=(e.clientY+12)+'px'; } });
  document.addEventListener('mouseout', e=>{ const c=e.target.closest&&e.target.closest('.htl-cell'); if(c&&tip) tip.style.display='none'; });
})();
function hehunExportImg(){
  try{
    const D=window.__hehunTL; if(!D||!D.rows) return;
    const rows=D.rows, cy=D.cy;
    const colOf=c=>c==='优'?'#5fae5f':c==='凶'?'#c24234':c==='中'?'#9a8a5a':'#6a6a6a';
    const cellW=58, cellH=40, pad=16, cols=10, rowN=2;
    const W=pad*2+cols*cellW, H=pad*2+rowN*cellH+92;
    let cells='';
    rows.forEach((r,i)=>{ const x=pad+(i%cols)*cellW, y=pad+Math.floor(i/cols)*cellH; const col=colOf(r.comb);
      cells+=`<rect x="${x}" y="${y}" width="${cellW-4}" height="${cellH-4}" rx="5" fill="${col}"/>`;
      cells+=`<text x="${x+(cellW-4)/2}" y="${y+(cellH-4)/2+5}" fill="#ffffff" font-size="13" text-anchor="middle" font-family="serif">${r.y%100}${r.comb==='优'?'★':''}</text>`; });
    const legend='绿=双顺大运·利婚缘★　红=流年冲煞·宜守　黄=单顺/流年吉　灰=平';
    const win=D.bestWin?('双人运共振窗口：'+D.bestWin[0]+'–'+D.bestWin[1]+' 年'):'大运暂未共振';
    const ji=D.jiYears.length?('宜婚：'+D.jiYears.slice(0,4).join('、')):'';
    const bad=D.badYears.length?('宜守：'+D.badYears.slice(0,4).join('、')):'';
    const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'">'
      +'<rect width="'+W+'" height="'+H+'" fill="#14110c"/>'
      +'<text x="'+pad+'" y="'+(pad-2)+'" fill="#e9d9b8" font-size="14" font-family="serif">八字合婚 · 大运/流年同步（'+D.mName+' × '+D.fName+'）</text>'
      +'<text x="'+pad+'" y="'+(pad+rowN*cellH+18)+'" fill="#9a8a6a" font-size="11">'+legend+'</text>'
      +'<text x="'+pad+'" y="'+(pad+rowN*cellH+36)+'" fill="#c9b88f" font-size="11">'+win+'　'+ji+'　'+bad+'</text>'
      +'<text x="'+pad+'" y="'+(pad+rowN*cellH+54)+'" fill="#6a6a6a" font-size="10">横轴 '+(cy-1)+'–'+(cy+18)+' 年 · 奇门八字合婚生成</text>'
      +cells+'</svg>';
    const img=new Image();
    img.onload=function(){ const cv=document.createElement('canvas'); cv.width=W; cv.height=H; const cx=cv.getContext('2d'); cx.fillStyle='#14110c'; cx.fillRect(0,0,W,H); cx.drawImage(img,0,0); const a=document.createElement('a'); a.download='合婚大运流年_'+D.mName+'_'+D.fName+'.png'; a.href=cv.toDataURL('image/png'); a.click(); };
    img.onerror=function(){ try{ alert('导出失败，请重试'); }catch(e){} };
    img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  }catch(e){}
}
window.hehunExportImg=hehunExportImg;
/* ---------- 初始化 ---------- */
document.getElementById('histBtn').onclick=renderHist;
document.getElementById('histClear').onclick=()=>{ if(confirm('确定清空全部本地记录？')){ try{ localStorage.removeItem(LS_KEY); }catch(e){} renderHist(); } };
/* ---------- 数字能量学（八星数字命理，离线真算） ---------- */
const NUM8={
  '天医':{arr:['13','31','68','86','49','94','27','72'],lv:'吉',desc:'八大星第一大吉星，主正财与婚姻，号码带天医利财运感情。'},
  '延年':{arr:['19','91','78','87','34','43','26','62'],lv:'吉',desc:'主事业、领导力与抗压，责任心强，适合创业与管理。'},
  '生气':{arr:['14','41','67','76','39','93','28','82'],lv:'吉',desc:'主贵人、乐观与人缘，遇事有人帮，心态积极。'},
  '伏位':{arr:['11','22','88','99','66','77','33','44'],lv:'中',desc:'主延续、保守与等待，能量平稳但推进慢，宜守成。'},
  '绝命':{arr:['12','21','69','96','48','84','37','73'],lv:'凶',desc:'主破财、冲动与大起大落，投资与情绪需克制。'},
  '五鬼':{arr:['18','81','79','97','36','63','24','42'],lv:'凶',desc:'主变动、思维活跃与奔波，亦藏智慧与偏财。'},
  '六煞':{arr:['16','61','74','47','38','83','92','29'],lv:'凶',desc:'主桃花、情绪纠结与人际敏感，易陷感情困扰。'},
  '祸害':{arr:['17','71','89','98','46','64','23','32'],lv:'凶',desc:'主口舌、劳碌与身体耗损，说话易惹是非。'}
};
function numEnergy(s){
  s=(s||'').replace(/\D/g,''); if(s.length<2) return null;
  const cnt={}; let total=0;
  for(let i=0;i<s.length-1;i++){ const pair=s.slice(i,i+2);
    for(const k in NUM8){ if(NUM8[k].arr.includes(pair)){ cnt[k]=(cnt[k]||0)+1; total++; break; } } }
  return {cnt,total,s};
}
document.getElementById('numBtn').onclick=()=>{
  const r=numEnergy(document.getElementById('numInput').value.trim());
  if(!r){ hintResult('numResult','请输入至少 2 位数字的号码。'); return; }
  const {cnt,total,s}=r; const lvC={'吉':'#5fae5f','中':'#9a8a5a','凶':'#c24234'};
  let good=0,bad=0,max=0,dom='';
  const cards=Object.keys(cnt).map(k=>{ const n=cnt[k],info=NUM8[k];
    if(info.lv==='吉')good+=n; else if(info.lv==='凶')bad+=n;
    if(n>max){max=n;dom=k;}
    return `<div class="ne-chip" style="border-left:3px solid ${lvC[info.lv]}"><b>${k}</b> <span style="color:${lvC[info.lv]}">${info.lv}</span> ×${n}<div style="color:var(--muted);font-size:12px;margin-top:3px">${info.desc}</div></div>`;
  }).join('');
  const score=Math.max(8,Math.min(96,Math.round(50+(good-bad)/(total||1)*44)));
  const _readPool=dom==='天医'?['天医主正财与婚姻——号码带天医，财路与感情线都容易走上坡，宜守正经营。','天医为第一吉星——正财与良缘都偏向你，稳扎稳打、别贪快，福气自聚。']
    :dom==='延年'?['延年主事业与领导力——号码带延年，担得起责任、扛得住压力，宜挑大梁。','延年星强——事业心和抗压能力是你的本钱，适合往管理、开创方向走。']
    :dom==='生气'?['生气主贵人与人缘——号码带生气，遇事有人帮、心态积极，人脉是隐形资产。','生气星旺——贵人多、气运顺，多走动多结缘，路越走越宽。']
    :dom==='伏位'?['伏位主延续与守成——号码带伏位，能量平稳但推进慢，宜守正待时、不宜急进。','伏位星守——节奏偏慢是常态，把根基打牢，稳就是快。']
    :dom==='绝命'?['绝命主大起大落——号码带绝命，冲动易破财，投资与情绪都宜多留分寸。','绝命星烈——起伏是底色，学会刹车与留余地，才能避其锋芒。']
    :dom==='五鬼'?['五鬼主变动与思维活跃——号码带五鬼，脑子快、点子多，亦有偏财，宜用在创新上。','五鬼星变——变动里藏着机会，把聪明用对地方，奔波也是财。']
    :dom==='六煞'?['六煞主桃花与情绪——号码带六煞，人际敏感、易陷感情困扰，宜把心放宽。','六煞星缠——情绪是软肋也是通道，学会表达与疏导，桃花才不伤人。']
    :['祸害主口舌劳碌——号码带祸害，说话易惹是非，宜慎言、多保养。','祸害星耗——口舌与劳碌是常态，话到嘴边慢三分，身体省着用。'];
  const _read=_readPool[_hashStr(s+'num')%_readPool.length];
  const bal = good>bad?`吉星组合居多（吉${good}·凶${bad}），号码整体偏顺，宜保持并善用其能量。`
    : bad>good?`凶星组合偏多（吉${good}·凶${bad}），若求稳可考虑调整号码，至少避开高频凶位。`
    : `吉凶相当（吉${good}·凶${bad}），号码能量均衡，行事守中道最稳。`;
  document.getElementById('numResult').innerHTML=
    `<div class="result"><h3>号码 ${s}</h3>
     <div class="luckring"><svg width="84" height="84" viewBox="0 0 84 84"><circle cx="42" cy="42" r="36" fill="none" stroke="var(--gold)" stroke-opacity=".2" stroke-width="8"/><circle class="luckarc" cx="42" cy="42" r="36" fill="none" stroke="var(--gold)" stroke-width="8" stroke-linecap="round" stroke-dasharray="226.2" stroke-dashoffset="${226.2*(1-score/100)}" transform="rotate(-90 42 42)"/></svg><div class="lucknum">${score}<span>分</span></div></div>
     <p style="text-align:center;color:var(--muted);font-size:12px">共命中 ${total} 组 · 主导星：<b style="color:var(--gold2)">${dom||'—'}</b></p>
     <div class="ne-grid"><div class="ne-chip" style="border-left:3px solid var(--gold)"><b>号码解读</b><div style="margin-top:4px">${_read}<br>${bal}</div></div>${cards||'<div class="ne-chip">未命中明显八星组合，号码能量较平。</div>'}</div>
     <p style="color:var(--muted);font-size:12px;margin-top:8px">* 八星数字按相邻两位组合查表（数组双向有效，如 13/31 皆为天医）；吉凶为数字能量学传统说法。</p></div>`;
};

/* ---------- 生肖配对（地支刑冲合害，离线真算） ---------- */
const ZOD=['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
(function(){ const a=document.getElementById('zA'),b=document.getElementById('zB'); if(!a||!b) return;
  ZOD.forEach((z,i)=>{ const o1=document.createElement('option'); o1.value=i; o1.textContent=z; a.appendChild(o1);
    const o2=document.createElement('option'); o2.value=i; o2.textContent=z; b.appendChild(o2); }); a.value=0; b.value=1;
})();
/* 生肖特质（12 生肖各一句，供配对「特质呼应」块） */
const ZOD_TRAIT={
  '鼠':'机敏善变、点子多，重情也重利，行动快人一步。',
  '牛':'踏实沉稳、认死理，重承诺，慢热但可靠。',
  '虎':'果敢有魄力、好胜心强，重面子，天生的开路者。',
  '兔':'温和细腻、心软念旧，重情义，擅长以柔克刚。',
  '龙':'志气高远、气度不凡，重理想，天生有号召力。',
  '蛇':'思虑周密、直觉敏锐，重隐私，谋定而后动。',
  '马':'热情奔放、行动力强，重自由，停不下来也闲不住。',
  '羊':'温厚包容、恋家念旧，重感情，是人群里的暖源。',
  '猴':'聪慧灵巧、善于变通，重趣味，交友广、心思活。',
  '鸡':'精细求全、守时重礼，重细节，做事有板有眼。',
  '狗':'忠诚可靠、讲义气，重信守诺，认准的人就不放手。',
  '猪':'随和知足、心宽福厚，重安逸，与人为善不记仇。'
};
/* 生肖配对 tip 池：7 类关系各 3 变体，按生肖对哈希确定性选词（同对稳定、异对不同句） */
const ZT_TIP={
  '同属':['同生肖者个性相近、易默契，亦有「同类相斥」之说，相处贵在互容。','同一生肖的两个人像照镜子——默契天然，也容易把彼此的缺点看成理所当然，贵在互相提点。','同一属相心意相通、节奏一致，但性子里的硬处也一样——给彼此留空间，才能处得久。'],
  '六合':['上上姻缘！六合生肖天作之合，性格互补、彼此旺运，相处顺遂少争执。','六合为上等婚配，五行暗合、气场相生，是能互相成就的一对，好好珍惜。','六合是地支最佳组合，两人在一起能互相带旺，是难得的天作之合。'],
  '三合':['三合生肖气场相生，贵人相助、默契度高，是稳定长久的一对。','三合主互助，两人在一处时运气都顺，是彼此带旺的组合。','三合如三角支架，彼此支撑、各展所长，日子越过越顺的组合。'],
  '六冲':['六冲生肖观念易反、相处多摩擦，若能互相迁就亦可化冲为用，需多包容。','六冲多主相看易顶、各执一词，但冲也是一种强烈的吸引——学会求同存异就有解。','六冲观念相左、一碰就顶，若能尊重差异、错位互补，反而激荡出火花。'],
  '六害':['六害生肖暗中小耗、易有误会与隔阂，相处需多沟通、少猜忌。','六害主暗耗，误会多半来自没把话说开——多开诚布公，隔阂自然消散。','六害多生暗耗与小心思，坦诚是唯一解药——把话说透，隔阂自消。'],
  '相刑':['相刑生肖易生纠结与内耗，感情里要多些耐心与边界感。','相刑多主彼此较劲、内耗伤神，给关系留出边界与喘息，反而处得久。','相刑如绳互缠，越较劲越紧，学会松手与退让，关系才有透气口。'],
  '普通':['无特殊冲合，相处平淡自然，缘分靠两人用心经营。','无冲无合，缘分平平——但只要用心经营，平淡也能酿出长久的甜。','无冲无合，平平淡淡才是真——两人一起把日子过出滋味，就是好姻缘。']
};
/* 年度运势共振：双方生肖 vs 当年太岁（值/冲/刑/害/合/三合）+ 星座元素 vs 流年五行，给出共振结论（i,j 为生肖索引，xzM/xzF 为星座名可选） */
function yearResonanceHTML(i, j, xzM, xzF){
  try{
    const now=new Date();
    const lunar=Solar.fromYmd(now.getFullYear(),now.getMonth()+1,now.getDate()).getLunar();
    const ygz=lunar.getYearInGanZhi()||''; const tZhi=ygz.charAt(1);
    let taiName=''; for(const s in ZODIAC_ZHI){ if(ZODIAC_ZHI[s]===tZhi){ taiName=s; break; } }
    const tIdx=ZOD.indexOf(taiName);
    const rM=zodiacRel(i,tIdx), rF=zodiacRel(j,tIdx);
    const sxWord={'同属':'值太岁（本命年）——宜静养积福、少冒进','六冲':'冲太岁——变动多、宜守不宜冲，大事缓行','相刑':'刑太岁——易生口舌纠结，宜退让避是非','六害':'害太岁——暗中小耗，多沟通少猜忌','六合':'六合太岁——贵人年、诸事顺遂','三合':'三合太岁——助力年、贵人相助','普通':'平年——无冲无合，平稳过'};
    const yw=GAN_WU[ygz.charAt(0)]||DZ_WU[tZhi]||'土';
    const szY=(el)=>{ if(!el) return ''; const rel= el===yw?'同频':SHENG[yw]===el?'得生':SHENG[el]===yw?'泄秀':KE[yw]===el?'受克':KE[el]===yw?'制化':'中和';
      const W={'同频':'本年元素同频，气场顺、宜顺势','得生':'本年流年生你，得气相助、诸事易成','泄秀':'本年你生流年，付出易耗、宜留三分','受克':'本年流年克你，压力稍大、宜守缓','制化':'本年你克流年，能掌控但别太刚','中和':'本年元素中和、平稳无波'}; return W[rel]; };
    const elM=xzM?(STAR_ATTR[(xzM||'').replace('座','')]||{}).el:'', elF=xzF?(STAR_ATTR[(xzF||'').replace('座','')]||{}).el:'';
    const good=t=>['六合','三合'].includes(t); const bad=t=>['同属','六冲','相刑','六害'].includes(t);
    let res, cls;
    if(good(rM.type)&&good(rF.type)){ res='双星同顺之年——彼此都逢贵人助力，宜合力谋划、趁势而上。'; cls='good'; }
    else if(bad(rM.type)&&bad(rF.type)){ res='双星同守之年——双方皆宜稳守，互相撑住、少做大动。'; cls='bad'; }
    else if(good(rM.type)||good(rF.type)){ res='一顺一守之年——顺者拉守者一把，借对方旺势化解自家波动。'; cls='mid'; }
    else { res='平年共振——无大风浪，平稳经营即可。'; cls='mid'; }
    return `<div style="margin-top:10px;padding:10px 12px;border-left:3px solid #5a8a6a;background:var(--r-subbg);font-size:12.5px;line-height:1.9">
      <b style="color:var(--gold2)">年度运势共振 · ${now.getFullYear()} 年（太岁 ${tZhi}）</b>
      <p style="margin-top:4px"><b>${ZOD[i]}</b>（${ZODIAC_ZHI[ZOD[i]]}）：${sxWord[rM.type]||'平年'}${elM?('；星座'+szY(elM)):''}</p>
      <p><b>${ZOD[j]}</b>（${ZODIAC_ZHI[ZOD[j]]}）：${sxWord[rF.type]||'平年'}${elF?('；星座'+szY(elF)):''}</p>
      <p style="margin-top:4px">共振：<b style="color:${cls==='good'?'var(--good)':cls==='bad'?'var(--bad)':'var(--gold2)'}">${res}</b></p>
    </div>`;
  }catch(e){ return ''; }
}
function zodiacRel(i,j){
  let type,score;
  if(i===j){ type='同属'; score=55; }
  else{
    const he=[[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]], chong=[[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]],
          san=[[2,0,4],[11,3,7],[2,6,10],[5,9,1]], hai=[[0,7],[1,6],[2,5],[3,4],[8,11],[9,10]];
    const pr=arr=>arr.some(p=>(p[0]===i&&p[1]===j)||(p[0]===j&&p[1]===i)), tr=g=>g.some(x=>x.includes(i)&&x.includes(j));
    if(pr(he)){ type='六合'; score=92; }
    else if(tr(san)){ type='三合'; score=85; }
    else if(pr(chong)){ type='六冲'; score=35; }
    else if(pr(hai)){ type='六害'; score=48; }
    else if(([0,3].includes(i)&&[0,3].includes(j))||([2,5,8].includes(i)&&[2,5,8].includes(j))||([1,7,10].includes(i)&&[1,7,10].includes(j))){ type='相刑'; score=30; }
    else{ type='普通'; score=65; }
  }
  const _tp=ZT_TIP[type]||[''];
  return {type,score,tip:_tp[_hashStr(String(i)+','+String(j))%_tp.length]};
}
document.getElementById('zodiacBtn').onclick=()=>{
  const i=+document.getElementById('zA').value, j=+document.getElementById('zB').value, rel=zodiacRel(i,j);
  const adv = rel.score>=85?'上等缘分，彼此带旺，多珍惜多经营，顺水行舟即可。'
    : rel.score>=70?'良好搭配，用心经营会越来越顺，遇事多商量、少较真。'
    : rel.score>=50?'中等缘分，磨合期长一些，多包容少计较，感情渐入佳境。'
    : '冲克之缘，需要加倍耐心与包容，给彼此空间与尊重，可化险为夷。';
  const relAdv = ['六冲','六害','相刑'].includes(rel.type)?'（'+rel.type+'之缘，重在求同存异，冲处即是功课。）':['六合','三合'].includes(rel.type)?'（'+rel.type+'之缘，顺水推舟，别辜负这份默契。）':'';
  document.getElementById('zodiacResult').innerHTML=
    `<div class="result"><h3>${ZOD[i]} 与 ${ZOD[j]}</h3>
     <div style="text-align:center"><span style="display:inline-block;padding:4px 14px;border:1px solid var(--gold);border-radius:20px;color:var(--gold2);font-weight:700">${rel.type}</span></div>
     <div class="luckring"><svg width="84" height="84" viewBox="0 0 84 84"><circle cx="42" cy="42" r="36" fill="none" stroke="var(--gold)" stroke-opacity=".2" stroke-width="8"/><circle class="luckarc" cx="42" cy="42" r="36" fill="none" stroke="var(--gold)" stroke-width="8" stroke-linecap="round" stroke-dasharray="226.2" stroke-dashoffset="${226.2*(1-rel.score/100)}" transform="rotate(-90 42 42)"/></svg><div class="lucknum">${rel.score}<span>分</span></div></div>
     <div class="ne-grid"><div class="ne-chip" style="border-left:3px solid var(--gold)"><b>缘分点评</b><div style="margin-top:4px">${rel.tip}</div></div>
     <div class="ne-chip" style="border-left:3px solid var(--gold-soft)"><b>相处建议</b><div style="margin-top:4px">${adv}${relAdv}</div></div>
     <div class="ne-chip" style="border-left:3px solid #5a8a6a"><b>特质呼应</b><div style="margin-top:4px">${ZOD[i]}：${ZOD_TRAIT[ZOD[i]]||''}<br>${ZOD[j]}：${ZOD_TRAIT[ZOD[j]]||''}</div></div></div>
     ${yearResonanceHTML(i,j,'','')}
     <p style="color:var(--muted);font-size:12px;margin-top:8px">* 配对基于十二地支六合/三合/六冲/六害/相刑关系；指数与点评为综合评分。</p></div>`;
};

/* ===================== 本命佛 / 守护佛五尊（十二生肖对应八大本命佛 + 五方守护佛） ===================== */
/* 八大本命佛：依佛教十二生肖守护尊真实对应（鼠—千手观音，牛虎—虚空藏，兔—文殊，龙蛇—普贤，马—大势至，羊猴—大日如来，鸡—不动明王，狗猪—阿弥陀佛） */
const BF_MAP={
  '鼠':{nama:'千手观音菩萨',dir:'北',color:'水 · 玄黑',tip:'千处祈求千处应，苦海常作度人舟。鼠肖机敏善变、心细多虑，千手观音以大悲千眼照护，助你心定智明、危时得救。',element:'水',mu:'',z:'千手'},
  '牛':{nama:'虚空藏菩萨',dir:'东北',color:'土 · 玄黄',tip:'虚空无尽、宝藏无量，能满诸愿、增益福德。牛肖踏实厚重、守信隐忍，虚空藏菩萨以无量福德守护，助你精进多得、守成得实。',element:'土',mu:'',z:'虚空'},
  '虎':{nama:'虚空藏菩萨',dir:'东北',color:'土 · 玄黄',tip:'虚空无尽、宝藏无量，能满诸愿、增益福德。虎肖勇猛果断、动而有为，虚空藏菩萨助你莽中取正、锋芒内敛，行而有度。',element:'木',mu:'',z:'虚空'},
  '兔':{nama:'文殊菩萨',dir:'西南',color:'火 · 紫红',tip:'大智文殊，智慧第一，断无明、开觉慧。兔肖外柔内慧、思虑绵长，文殊以般若智剑，助你抉择清明、免于纠结反复。',element:'木',mu:'',z:'文殊'},
  '龙':{nama:'普贤菩萨',dir:'东南',color:'土 · 玄黄',tip:'大行普贤，愿行广大，十大愿王护持万行。龙肖志向高远、气度不凡，普贤助你化空想为实行，行愿合一、步步登高。',element:'土',mu:'',z:'普贤'},
  '蛇':{nama:'普贤菩萨',dir:'东南',color:'火 · 紫红',tip:'大行普贤，愿行广大，十大愿王护持万行。蛇肖思虑周详、谋定后动，普贤助你把深谋落到实处，谋定而行、行必有果。',element:'火',mu:'',z:'普贤'},
  '马':{nama:'大势至菩萨',dir:'西南',color:'火 · 紫红',tip:'大势至，以智慧光普照一切，令离三途。马肖热情奔放、行动力强，大势至以勇猛慧力摄护，助你正其心、收其势、行而得当。',element:'火',mu:'',z:'大势至'},
  '羊':{nama:'大日如来',dir:'南',color:'火 · 赤',tip:'大日如来，遍照法界、无所不照，为密教法身佛。羊肖温厚包容、心宽福厚，大日如来以如日照世，助你本心光明、度己度人。',element:'土',mu:'',z:'大日'},
  '猴':{nama:'大日如来',dir:'南',color:'金 · 灿金',tip:'大日如来，遍照法界、本净光明。猴肖聪慧灵巧、敏于变通，大日如来助你灵光不散、聪而不狎、妙用归正。',element:'金',mu:'',z:'大日'},
  '鸡':{nama:'不动明王',dir:'西',color:'金 · 灿金',tip:'不动明王，大日如来教令轮身，忿怒相而心怀大悲，断一切魔障。鸡肖精细求全、守时重礼，不动明王助你定力坚固、不为外扰、斩断烦乱。',element:'金',mu:'',z:'不动明王'},
  '狗':{nama:'阿弥陀佛',dir:'西',color:'金 · 灿金',tip:'阿弥陀佛，无量光、无量寿，接引众生、万德洪名。狗肖忠诚可靠、重信守诺，阿弥陀佛以无量光寿摄护，助你心安行稳、福寿绵长。',element:'土',mu:'',z:'弥陀'},
  '猪':{nama:'阿弥陀佛',dir:'西',color:'水 · 玄黑',tip:'阿弥陀佛，无量光、无量寿，慈悲接引、心念清净。猪肖随和知足、心宽积福，阿弥陀佛以清净光明照护，助你心安福厚、随缘自在。',element:'水',mu:'',z:'弥陀'}
};
/* 五方守护佛（五方佛）：依方位五行关联，生肖五行归位后得对应守护如来 */
const BF_FIVE={
  '中央空':{name:'毗卢遮那佛','desc':'法界体性智，遍照万法、清净无染。中宫凡生肖者心性明澈，守持中道，诸法圆融。','el':'土'},
  '东方木':{name:'阿閦佛','desc':'大圆镜智，不动如山、照了一切。东属木主生发，属此方者志存高远，守其初志则事业勃发。','el':'木'},
  '南方火':{name:'宝生佛','desc':'平等性智，福德庄严、普施无碍。南属火主繁盛，属此方者仁厚利他，广结善缘则福德自来。','el':'火'},
  '西方金':{name:'阿弥陀佛','desc':'妙观察智，光明无量、度脱有情。西属金主肃净，属此方者明察秋毫，守律持衡则清静无碍。','el':'金'},
  '北方水':{name:'不空成就佛','desc':'成所作智，事业圆满、无作而成。北属水主流通，属此方者善运筹谋，顺势而为则诸事可成。','el':'水'}
};
/* 本命年判断：profile 出生年肖 = 当前流年太岁之肖 */
function bfCurrentTaiShi(){ try{ const now=new Date(); return Solar.fromYmd(now.getFullYear(),now.getMonth()+1,now.getDate()).getLunar().getYearInGanZhi().charAt(1); }catch(e){ return ''; } }
/* 主渲染：生肖 → 本命佛 + 五方守护佛 + 本命年提醒 */
function bfRender(sx, birth){
  try{
    const info=BF_MAP[sx]; if(!info) return '<div style="color:var(--muted);font-size:12px">请先选择生肖。</div>';
    const taiZhi=bfCurrentTaiShi();
    let taiSx=''; for(const s in ZODIAC_ZHI){ if(ZODIAC_ZHI[s]===taiZhi){ taiSx=s; break; } }
    const inBN=birth===taiSx;
    /* 四象归位 → 五方守护佛 */
    const el=info.element||'土';
    const dirKey=(info.dir||'').replace(/[东西南北]/,'');
    let fiveName='中央空';
    if(['鼠','猪'].includes(sx)) fiveName='北方水';
    else if(['虎','兔'].includes(sx)) fiveName='东方木';
    else if(['马','蛇'].includes(sx)) fiveName='南方火';
    else if(['猴','鸡'].includes(sx)) fiveName='西方金';
    const five=BF_FIVE[fiveName];
    const elC=WU_COLOR[el]||'#9a8a5a';
    const bnNote=inBN?`<p style="margin-top:8px;padding:8px 10px;border-left:3px solid var(--bad);background:rgba(194,66,52,.07);border-radius:4px;font-size:12.5px;line-height:1.7"><b style="color:var(--bad)">值太岁 · 本命年（${sx}肖）</b>——今年是你的本命年，民俗多以「红绳护持、静养积福」为要。可常念<b style="color:var(--gold2)">${info.nama}名号</b>，安神定心；行事少冒进、稳妥为上。本命年非凶年，贵在心安，守常即是福。</p>`
      :`<p style="margin-top:8px;font-size:12px;color:var(--muted)">今年（${taiSx}肖为太岁）并非你的本命年，气场平顺，${info.nama}常护左右，随缘安心即可。</p>`;
    const html=`<div class="result">
      <h3>${sx}肖 · 本命佛</h3>
      <div style="text-align:center;margin:6px 0 4px">
        <span style="display:inline-block;padding:12px 22px;border:1px solid ${elC};border-radius:14px;color:${elC};font-weight:800;font-size:17px;background:linear-gradient(135deg,rgba(212,175,55,.12),rgba(154,138,90,.04))">${info.nama}</span>
      </div>
      <p style="text-align:center;font-size:12px;color:var(--muted);margin-top:4px">方位 <b style="color:var(--gold2)">${info.dir}</b> · 五行 <b style="color:${elC}">${info.color.split(' · ')[0]}</b></p>
      <p style="margin-top:8px;line-height:1.85;font-size:13px">${info.tip}</p>
      <div style="margin-top:12px;padding:10px 12px;border-left:3px solid var(--gold);background:var(--r-subbg);font-size:12.5px;line-height:1.9">
        <b style="color:var(--gold2)">守护佛五尊 · ${five.name}（${fiveName.replace(/[东西南北]/,'')}方）</b>
        <p style="color:var(--muted);font-size:12px;margin-top:2px">${five.desc}</p>
      </div>
      ${bnNote}
      <p style="color:var(--muted);font-size:12px;margin-top:8px">* 本命佛依传统十二生肖守护尊对应，五方佛依五行方位关联；为传统信仰文化内容，随缘一观，不构成宗教承诺。</p>
    </div>`;
    return html;
  }catch(e){ return '<div style="color:var(--muted);font-size:12px">本命佛信息暂不可用。</div>'; }
}
(function(){ const el=document.getElementById('bfSx'); if(!el) return;
  ZOD.forEach(z=>{ const o=document.createElement('option'); o.value=z; o.textContent=z; el.appendChild(o); });
  /* 若已保存档案，自动带入生日肖并预显示 */
  try{ const p=profLoad(); if(p&&p.birth){ const [y,m,d]=p.birth.split('-').map(Number); const sx=Solar.fromYmd(y,m,d).getLunar().getYearShengXiao(); if(sx){ el.value=sx; const db=document.getElementById('bfBirth'); if(db) db.value=p.birth; } } }catch(e){}
})();
document.getElementById('buddhaBtn').onclick=()=>{
  const sx=document.getElementById('bfSx').value;
  let birth=''; try{ const b=document.getElementById('bfBirth').value; if(b){ const [y,m,d]=b.split('-').map(Number); birth=Solar.fromYmd(y,m,d).getLunar().getYearShengXiao(); } }catch(e){}
  document.getElementById('buddhaResult').innerHTML=bfRender(sx,birth);
};

/* ===================== 趣味模块（赛博积德 / 幸运色 / 择日 / 梦境卡） ===================== */
/* —— 赛博积德：点击木鱼/上香/放生积累功德（纯前端，localStorage 持久） —— */
const MERIT_KEY='xuanji_merit_v1';
let meritVal=0;
try{ meritVal=parseInt(localStorage.getItem(MERIT_KEY)||'0')||0; }catch(e){}
function meritTitle(n){ return n>=500?'功德无量':n>=200?'福缘深厚':n>=80?'善根渐固':n>=20?'初积善缘':'功德初萌'; }
function meritRender(){ const num=document.getElementById('meritNum'), ttl=document.getElementById('meritTitle');
  if(num) num.textContent=meritVal; if(ttl) ttl.textContent=meritTitle(meritVal); }
function meritAdd(n){ meritVal+=n; try{ localStorage.setItem(MERIT_KEY,String(meritVal)); }catch(e){} meritRender();
  const fish=document.getElementById('meritFish'); if(fish){ fish.style.transform='scale(.86)'; setTimeout(()=>fish.style.transform='',90); } }
meritRender();
document.getElementById('meritFish').onclick=()=>meritAdd(1);
document.getElementById('meritIncense').onclick=()=>meritAdd(5);
document.getElementById('meritRelease').onclick=()=>meritAdd(10);
document.getElementById('meritReset').onclick=()=>{ meritVal=0; try{ localStorage.removeItem(MERIT_KEY); }catch(e){} meritRender(); };

/* —— 幸运色：按当日干支五行推幸运色/数字/方位（规则真算） —— */
const WU_COLOR={'金':'#b8a878','木':'#9aab95','水':'#9aa6b0','火':'#c29a90','土':'#b3a78f'};
const WU_DIR={'金':'西','木':'东','水':'北','火':'南','土':'中'};
/* 五行当日宜忌/穿衣/饮食/贴士（按日干五行推导） */
const WU_DAILY={
  '木':{ok:'生发进取、文书创意、向东方行',no:'久坐不动、过度消耗、迟疑拖延',wear:'绿色青色系，或带木质配饰',food:'绿色蔬果、芽苗类，清新鲜活',tip:'木主生发——今日适合播种计划、启动新事，把念头落到纸上。'},
  '火':{ok:'展现自我、公关社交、向南方行',no:'冲动口角、暴饮暴食、熬夜过劳',wear:'红色紫色系，或金属点缀散热',food:'温热暖食、红色食材，忌生冷',tip:'火主明达——今日宜大胆发声、让人看见，但火气别烧到自己人。'},
  '土':{ok:'稳固根基、房产置业、居中守正',no:'变动搬迁、迟疑不定、广撒网',wear:'黄色棕色系，沉稳大地色',food:'五谷根茎、当季土产，养脾胃',tip:'土主承载——今日宜踏实做事、打牢地基，大事一步步来。'},
  '金':{ok:'决策签约、整顿清理、向西方行',no:'优柔寡断、过度消费、琐碎纠缠',wear:'白色金色银色系，利落剪裁',food:'清淡润肺、梨藕百合，忌辛辣',tip:'金主收敛——今日宜断舍离、做决断，该清的清，该断的断。'},
  '水':{ok:'沟通流动、出行洽谈、向北方行',no:'情绪内耗、久宅不动、隐瞒心迹',wear:'蓝色黑色系，或水纹配饰',food:'汤水滋润、海产水产，多补水',tip:'水主智慧流通——今日宜顺势而行、多走动，让心事也流通起来。'}
};
function luckyOf(dateStr){
  const d=dateStr?new Date(dateStr):new Date();
  const solar=Solar.fromYmd(d.getFullYear(),d.getMonth()+1,d.getDate());
  const lunar=solar.getLunar();
  const gz=lunar.getDayInGanZhi(); const tg=gz.charAt(0), dz=gz.charAt(1);
  const wu=GAN_WU[tg]||DZ_WU[dz]||'土';
  const num=[,'1','2','3','4','5','6','7','8','9'][({'金':7,'木':3,'水':6,'火':9,'土':5}[wu])];
  return {date:`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`,gz,wu,color:WU_COLOR[wu],num,dir:WU_DIR[wu]};
}
function luckyPersonalize(birthStr, hourStr){
  try{
    const [y,m,day]=birthStr.split('-').map(Number);
    // 若带时辰 → 走真实旺衰引擎（与八字盘同源：四柱生克 + 月令加权）
    if(hourStr!==undefined && hourStr!==null && hourStr!==''){
      const h=parseInt(hourStr);
      const bs=baziStrength(y,m,day,h);
      if(bs) return {dayGan:bs.dayGan, dayWu:bs.dayWu, qiang:bs.qiang, yong:bs.yongUniq, ji:bs.jiUniq, real:true};
    }
    // 退路：仅有生日（无时辰）→ 扶抑近似（日干 + 印星），仅作粗略参考
    const solar=Solar.fromYmd(y,m,day); const lunar=solar.getLunar(); const ec=lunar.getEightChar();
    const dg=ec.getDayGan(); const dwu=GAN_WU[dg];
    let yin=''; for(const e in SHENG){ if(SHENG[e]===dwu){ yin=e; break; } }
    return {dayGan:dg, dayWu:dwu, yong:[dwu, yin].filter(Boolean), ji:[], real:false};
  }catch(e){ return null; }
}
document.getElementById('luckyBtn').onclick=()=>{
  const r=luckyOf(document.getElementById('luckyDate').value);
  const wd=WU_DAILY[r.wu]||{};
  const birth=document.getElementById('luckyBirth')?document.getElementById('luckyBirth').value:'';
  const bh=document.getElementById('luckyHour')?document.getElementById('luckyHour').value:'';
  const p=birth?luckyPersonalize(birth,bh):null;
  window.__userDayWu = p?p.dayWu:null; window.__userDayGan = p?p.dayGan:null;
  if(p&&p.real){ window.__baziDayWu=p.dayWu; window.__baziDayGan=p.dayGan; window.__baziQiang=p.qiang; window.__baziYong=p.yong; window.__baziJi=p.ji; }
  let pBlock='';
  if(p){
    const mainC=WU_COLOR[p.yong[0]]||r.color;
    const yc=p.yong.map(e=>WU_COLOR[e]).filter(Boolean).join(' / ');
    const jc=p.ji.map(e=>WU_COLOR[e]).filter(Boolean).join(' / ');
    const tag=p.real?`<span style="color:var(--good)">（按真实旺衰喜用 · 四柱生克）</span>`:`<span style="color:var(--muted)">（按扶抑近似 · 仅生日无时辰，粗略）</span>`;
    const jiLine=p.ji&&p.ji.length?`<span style="color:var(--bad)">忌</span> 规避${p.ji.join('、')}之气、少穿 ${jc} 系；`:'';
    pBlock=`<div style="margin-top:8px;padding:8px 12px;border-left:3px solid #b3a78f;background:var(--r-subbg);font-size:12.5px;line-height:1.85">
      <b style="color:var(--gold2)">本命视角 · 日主${p.dayGan}（${p.dayWu}）${p.real?' · '+p.qiang:''}</b> ${tag}
      <div style="display:flex;align-items:center;gap:14px;margin-top:8px">
        <div style="width:54px;height:54px;border-radius:12px;background:${mainC};box-shadow:0 0 16px ${mainC}88,inset 0 1px 0 rgba(255,255,255,.4)"></div>
        <div>本命喜用色：<b style="color:${mainC}">${p.yong[0]}系</b>${p.yong[1]?(' ／ '+p.yong[1]+'系'):''}<br>
        <span style="color:var(--good)">宜</span> 多亲近${p.yong.join('、')}之气、穿 ${yc} 系；${jiLine}<br>
        <span style="color:var(--muted)">与当日「${r.wu}」流日色叠加：本命打底、流日点睛。</span></div>
      </div></div>`;
  }
  document.getElementById('luckyResult').innerHTML=`<div class="result">
    <h3>${r.date} · 幸运指引</h3>
    <p>今日干支：<b style="color:var(--gold2)">${r.gz}</b> ｜ 五行属 <b style="color:var(--gold2)">${r.wu}</b></p>
    <div style="display:flex;align-items:center;gap:14px;margin:12px 0">
      <div style="width:60px;height:60px;border-radius:14px;background:${r.color};box-shadow:0 0 18px ${r.color}88,inset 0 1px 0 rgba(255,255,255,.4)"></div>
      <div>
        <div style="font-size:15px">幸运色：<b style="color:${r.color}">${r.wu}系色</b></div>
        <div style="font-size:14px;margin-top:4px">幸运数字：<b style="color:var(--gold2)">${r.num}</b> ｜ 幸运方位：<b style="color:var(--gold2)">${r.dir}</b></div>
      </div>
    </div>
    ${wd.tip?`<div style="margin-top:6px;padding:8px 12px;border-left:3px solid #5a8a6a;background:var(--r-subbg);font-size:12.5px;line-height:1.8"><b style="color:var(--gold2)">五行宜忌 · ${r.wu}</b><br><span style="color:var(--good)">宜 ${wd.ok}</span><br><span style="color:var(--bad)">忌 ${wd.no}</span><br>穿着 ${wd.wear}｜饮食 ${wd.food}</div>`:''}
    ${wd.tip?`<p style="margin-top:6px;font-size:12.5px;color:var(--muted)">${wd.tip}</p>`:''}
    ${pBlock}
    <p style="color:var(--muted);font-size:12px;margin-top:8px">* 当日幸运按当日干支五行推导（木→绿/东、火→红/南、土→黄/中、金→金/西、水→蓝/北）${p?(p.real?';本命视角按真实旺衰喜用（需填出生时辰）':'；本命视角按日主扶抑近似（仅生日，粗略）'):''}，仅供趣味参考。</p>
  </div>`;
};

/* ===================== 五行穿衣（每日 · 按当日日干五行推五档配色） ===================== */
/* 五行生克辅助（模块级显式全量定义，与八字 baziStrength 内 SHENG_W/KE_W 同源，避免作用域问题） */
const GEN_OF={'木':'水','火':'木','土':'火','金':'土','水':'金'};   // 生我（印·贵人）
const SHENG_WX={'金':'水','水':'木','木':'火','火':'土','土':'金'}; // 我生（食伤·消耗）
const KE_WX={'金':'木','木':'土','土':'水','水':'火','火':'金'};    // 我克（财·求财）
const KE_BY={'木':'金','火':'水','土':'木','金':'火','水':'土'};    // 克我（官杀·不利）
/* 五行穿衣色板（五色 + 同系列举，取明快而不刺眼的代表色，便于实际穿搭参照） */
const CLOTH_COLORS={
  '木':{hex:'#5e9c63', names:['青绿','翠绿','墨绿','浅绿','碧色','草绿']},
  '火':{hex:'#c75d57', names:['正红','玫红','紫','粉','橙','绯红']},
  '土':{hex:'#b8985a', names:['明黄','卡其','棕','咖啡','驼色','米色']},
  '金':{hex:'#c9bf9e', names:['白','银','杏','乳白','珍珠','浅金']},
  '水':{hex:'#4f6f8f', names:['黑','深蓝','藏青','灰蓝','黛','靛']}
};
const DRESS_TIERS=[
  {name:'大吉', sub:'贵人色', rel:'生我', relTip:'大环境生你，印星护持', mean:'易遇贵人、得外界助力，人缘与异性缘俱旺，办大事首选。'},
  {name:'次吉', sub:'合作色', rel:'同我', relTip:'与日主比和', mean:'同气相应，利合作洽谈、达成共识，社交商谈皆顺。'},
  {name:'平',   sub:'求财色', rel:'我克', relTip:'我克者为财', mean:'需付出心力方有收获，坚持可得厚报，利求财谋事。'},
  {name:'消耗', sub:'消耗色', rel:'我生', relTip:'我生者泄秀', mean:'你生大环境、易耗精力，适合内心强韧者以小面积点缀挑战。'},
  {name:'不利', sub:'不利色', rel:'克我', relTip:'大环境克你', mean:'阻力多、事倍功半，宜规避；若偏爱可作小面积配饰。'}
];
function dressWuxing(wu){
  try{
    return {大吉:GEN_OF[wu], 次吉:wu, 平:KE_WX[wu], 消耗:SHENG_WX[wu], 不利:KE_BY[wu]};
  }catch(e){ return {}; }
}
document.getElementById('dressBtn').onclick=()=>{
  const ds=document.getElementById('dressDate').value;
  const d=ds?new Date(ds):new Date();
  const solar=Solar.fromYmd(d.getFullYear(),d.getMonth()+1,d.getDate());
  const lunar=solar.getLunar();
  const gz=lunar.getDayInGanZhi(); const tg=gz.charAt(0), dz=gz.charAt(1);
  const wu=GAN_WU[tg]||DZ_WU[dz]||'土';
  const wx=dressWuxing(wu);
  // 本命喜用联动：优先用「八字命盘」已算全局，否则按生日时辰私配
  const birth=document.getElementById('dressBirth')?document.getElementById('dressBirth').value:'';
  const bh=document.getElementById('dressHour')?document.getElementById('dressHour').value:'';
  let yong=null, ji=null, real=false;
  if(window.__baziYong){ yong=window.__baziYong; ji=window.__baziJi||[]; real=!!window.__baziQiang; }
  else if(birth){ const p=luckyPersonalize(birth,bh); if(p){ yong=p.yong; ji=p.ji||[]; real=!!p.real; } }
  // 冲煞 / 农历
  let chong=''; try{ chong=lunar.getChongDesc()||''; }catch(e){}
  let nong=''; try{ nong=lunar.getMonthInChinese()+'月'+lunar.getDayInChinese(); }catch(e){}
  // 五档渲染
  const rank=['大吉','次吉','平','消耗','不利'];
  const tierRows=rank.map(function(t){
    const w=wx[t]; const c=CLOTH_COLORS[w]||{hex:'#999',names:[]};
    const dt=DRESS_TIERS[rank.indexOf(t)];
    const yongTag = (yong&&yong.indexOf(w)>=0)?'<span style="color:var(--good)"> ·本命喜用</span>':((ji&&ji.indexOf(w)>=0)?'<span style="color:var(--bad)"> ·本命忌神</span>':'');
    return '<div style="display:flex;align-items:center;gap:12px;margin:8px 0;padding:8px 10px;border-left:4px solid '+c.hex+';background:var(--r-subbg);border-radius:8px">'
      +'<div style="width:46px;height:46px;border-radius:10px;background:'+c.hex+';box-shadow:0 0 14px '+c.hex+'88,inset 0 1px 0 rgba(255,255,255,.4);flex:0 0 auto"></div>'
      +'<div style="flex:1;min-width:0">'
      +'<div style="font-size:14px"><b style="color:'+c.hex+'">'+t+'（'+dt.sub+'）</b> <span style="color:var(--muted);font-size:12px">'+dt.rel+'·'+dt.relTip+'</span>'+yongTag+'</div>'
      +'<div style="font-size:13px;margin-top:2px">五行 <b>'+w+'</b> ｜ 推荐：'+c.names.join('、')+'</div>'
      +'<div style="font-size:12px;color:var(--muted);margin-top:2px;line-height:1.6">'+dt.mean+'</div>'
      +'</div></div>';
  }).join('');
  // 本命参照块
  let pBlock='';
  if(yong&&yong.length){
    const yc=yong.map(function(e){ return (CLOTH_COLORS[e]?CLOTH_COLORS[e].hex:'#999'); }).filter(Boolean).join(' / ');
    const daW=wx['大吉'];
    const daYong=yong.indexOf(daW)>=0, daJi=(ji&&ji.indexOf(daW)>=0);
    const daLine = daYong?'<span style="color:var(--good)">今日大吉贵人色（'+daW+'）恰是你本命喜用，贵人助力加倍，宜作主色。</span>'
                  : daJi?'<span style="color:var(--bad)">今日大吉贵人色（'+daW+'）为你本命忌神，贵人色不显，可改以次吉（'+wx['次吉']+'）打底、大吉作小面积点缀。</span>'
                  : '今日大吉贵人色（'+daW+'）与你本命喜用无冲，可放心作主色。';
    pBlock='<div style="margin-top:12px;padding:10px 14px;border-left:3px solid var(--gold2);background:var(--r-subbg);font-size:12.5px;line-height:1.85">'
      +'<b style="color:var(--gold2)">本命参照</b>（'+(real?'已自动接「八字命盘」喜用 · ':'生日私配 · ')+'日主 <b>'+(window.__baziDayGan||'')+'</b> · 喜用 '+yong.join('、')+(ji&&ji.length?(' · 忌 '+ji.join('、')):'')+'）'
      +'<div style="margin-top:4px">'+daLine+'</div>'
      +'<div style="margin-top:4px;color:var(--muted)">本命喜用色：'+yc+' 系——本命打底、流日点睛，两层气场叠加更稳。</div>'
      +'</div>';
  }
  /* 此刻·时辰贴合：当前时辰五行 → 此刻最旺色（生我=贵人） */
  let nowBlock='';
  try{
    const _now=new Date(); const _hh=_now.getHours(); const _mi=_now.getMinutes();
    const _zi=Math.floor((_hh+1)/2)%12; const _zhi=ZHI[_zi]; const _zWu=DZ_WU[_zhi]||'土';
    const _best=GEN_OF[_zWu]; const _c=CLOTH_COLORS[_best]||{hex:'#999',names:[]};
    nowBlock='<div style="margin:6px 0;padding:7px 10px;border-left:3px solid '+_c.hex+';background:var(--r-subbg);border-radius:6px;font-size:12.5px;line-height:1.7">'
      +'<b style="color:var(--gold2)">此刻 · 时辰贴合</b>　现在 '+(''+_hh).padStart(2,'0')+':'+(''+_mi).padStart(2,'0')+'（'+_zhi+'时·'+_zWu+'旺）'
      +' → 此刻最旺 <b style="color:'+_c.hex+'">'+_best+'色</b>（'+_c.names.slice(0,3).join('、')+'，生我·贵人），当下出门见人按此加成。</div>';
  }catch(e){}
  /* 今年·流年贴合：当年年干五行 vs 本命喜用/忌神 */
  let yearBlock='';
  try{
    const _g=yearGZ_LC(d.getFullYear())||''; const _gG=_g.charAt(0)||''; const _gWu=GAN_WU[_gG]||'';
    if(_gWu){
      const _c2=CLOTH_COLORS[_gWu]||{hex:'#999',names:[]};
      let _line='';
      if(yong&&yong.indexOf(_gWu)>=0) _line='今年恰是你的<b>喜用</b>，整年气场顺，日常可多穿 <b style="color:'+_c2.hex+'">'+_gWu+'色系</b>打底，与流日叠加更旺。';
      else if(ji&&ji.indexOf(_gWu)>=0) _line='今年五行与你<b>忌神</b>同，全年宜少作大面积主色，以喜用色系为主、'+_gWu+'色小点缀即可。';
      else _line='与你的本命喜用无冲无合，按每日五档正常穿即可，不必刻意回避。';
      yearBlock='<div style="margin:6px 0;padding:7px 10px;border-left:3px solid var(--gold2);background:var(--r-subbg);border-radius:6px;font-size:12.5px;line-height:1.7">'
        +'<b style="color:var(--gold2)">今年 · 流年贴合</b>　'+d.getFullYear()+' '+_g+'（'+_gWu+'）年　'+_line+'</div>';
    }
  }catch(e){}
  /* 今日穿搭公式：直接照穿（外套/内搭/下装/配饰 具体部位） */
  let outfitBlock='';
  try{
    const _cA=CLOTH_COLORS[wx['大吉']]||{}, _cB=CLOTH_COLORS[wx['次吉']]||{}, _cC=CLOTH_COLORS[wx['平']]||{}, _cD=CLOTH_COLORS[wx['消耗']]||{};
    const _o=function(c){ return c.names?c.names[0]:'同色系'; };
    outfitBlock='<div style="margin-top:10px;padding:8px 12px;border:1px solid rgba(217,168,106,.45);border-radius:8px;font-size:12.5px;line-height:1.85">'
      +'<b style="color:var(--gold2)">今日直接照穿</b>　外套 → <b style="color:'+(_cA.hex||'#999')+'">'+_o(_cA)+'</b>（大吉·主色 60%）'
      +'　内搭 → <b style="color:'+(_cB.hex||'#999')+'">'+_o(_cB)+'</b>（次吉·30%）'
      +'　下装/鞋 → <b style="color:'+(_cC.hex||'#999')+'">'+_o(_cC)+'</b>（平·过渡）'
      +'　配饰 → <b style="color:'+(_cD.hex||'#999')+'">'+_o(_cD)+'</b>（消耗·10% 点缀）'
      +'</div>';
  }catch(e){}
  document.getElementById('dressResult').innerHTML='<div class="result">'
    +'<h3>'+d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' · 五行穿衣</h3>'
    +'<p>农历 '+nong+' ｜ 今日干支 <b style="color:var(--gold2)">'+gz+'</b> ｜ 日主五行属 <b style="color:var(--gold2)">'+wu+'</b>'+(chong?(' ｜ 冲煞：'+chong):'')+'</p>'
    +'<p style="font-size:12.5px;color:var(--muted);margin:6px 0 2px">以当日日干五行（'+wu+'）为基准，按五行生克分五档。上衣外套为主色调、影响力最强；重大事项首选大吉贵人色。</p>'
    +nowBlock
    +yearBlock
    +tierRows
    +outfitBlock
    +'<div style="margin-top:10px;padding:8px 12px;border:1px dashed rgba(217,168,106,.4);border-radius:8px;font-size:12.5px;line-height:1.85;color:var(--muted)">'
    +'<b style="color:var(--gold2)">搭配黄金法则</b>：主色 60%（大吉/次吉）＋ 辅助 30%（次吉）＋ 点缀 10%（平）。外套尽量避开「不利色」；「消耗色」只作小面积配饰无妨。上衣内搭 &gt; 外套，整套协调不出错。'
    +'</div>'
    +pBlock
    +'<p style="color:var(--muted);font-size:11.5px;margin-top:8px">* 五行穿衣以当日日干五行推五档（生我=贵人／同我=合作／我克=求财／我生=消耗／克我=不利），本命参照取已在「八字命盘」算得的真实旺衰喜用（或下方生日时辰私配），属传统民俗参考，穿衣随心、悦己为上。</p>'
    +'</div>';
  if(window.__applyTermDict) try{ window.__applyTermDict(); }catch(e){}
};

/* ===================== 我的档案（个人模板 · localStorage 持久化 · 全模块自动带入） ===================== */
const PROF_KEY='fortune_profile_v1';
function profLoad(){ try{ return JSON.parse(localStorage.getItem(PROF_KEY)||'null'); }catch(e){ return null; } }
function profSave(p){ try{ localStorage.setItem(PROF_KEY,JSON.stringify(p)); }catch(e){} }
function profClear(){ try{ localStorage.removeItem(PROF_KEY); }catch(e){} }
/* 时辰换算：档案存「时辰中点小时」（0,2,4…22，与五行穿衣/幸运色一致）；八字/紫微用起点小时（0,1,3…21） */
function profHourToBazi(h){ h=parseInt(h)||0; return h===0?0:h-1; }
/* 应用档案：回填各模块输入 + 自动算喜用（供五行穿衣/幸运色联动） */
function profApply(){
  try{
    const p=profLoad();
    if(!p||!p.birth) return;
    const set=function(id,v){ const el=document.getElementById(id); if(el&&v!==undefined&&v!==null&&v!=='') el.value=v; };
    set('birth',p.birth); set('hour',profHourToBazi(p.hour)); set('gender',p.gender); set('baziCity',p.city);
    set('dressBirth',p.birth); set('dressHour',p.hour);
    set('luckyBirth',p.birth); set('luckyHour',p.hour);
    set('zvBirth',p.birth); set('zvGender',p.gender); set('zvHour',profHourToBazi(p.hour));
    set('numoBirth',p.birth);
    /* 自动算喜用：有时辰走真实旺衰引擎，无时辰走扶抑近似 */
    try{
      const [y,m,d]=p.birth.split('-').map(Number);
      let hh=p.hour!==undefined&&p.hour!==null&&p.hour!==''?parseInt(p.hour):null;
      let bs=null;
      if(hh!==null){ bs=baziStrength(y,m,d,hh); }
      else{
        const solar=Solar.fromYmd(y,m,d); const lunar=solar.getLunar(); const ec=lunar.getEightChar();
        const dg=ec.getDayGan(); const dwu=GAN_WU[dg]; let yin='';
        for(const e in SHENG){ if(SHENG[e]===dwu){ yin=e; break; } }
        bs={dayGan:dg, dayWu:dwu, qiang:'近似', yongUniq:[dwu,yin].filter(Boolean), jiUniq:[]};
      }
      if(bs){ window.__baziDayGan=bs.dayGan; window.__baziDayWu=bs.dayWu; window.__baziQiang=bs.qiang; window.__baziYong=bs.yongUniq; window.__baziJi=bs.jiUniq||[]; }
    }catch(e){}
    profRender(p);
  }catch(e){}
}
/* 渲染档案状态摘要 */
function profRender(p){
  const box=document.getElementById('profState');
  if(!box) return;
  if(!p||!p.birth){ box.innerHTML='<div style="margin-top:8px;color:var(--muted);font-size:12px">尚未保存档案。填好出生信息点「保存档案」，全模块自动带入。</div>'; return; }
  let sx=''; try{ const [y,m,d]=p.birth.split('-').map(Number); sx=Solar.fromYmd(y,m,d).getLunar().getYearShengXiao(); }catch(e){}
  const hourTxt=p.hour!==undefined&&p.hour!==null&&p.hour!==''?(' · 时辰 '+(parseInt(p.hour)/2|0)+'时档'):'';
  const yongTxt=window.__baziYong&&window.__baziYong.length?(' · 日主 '+window.__baziDayGan+' · 喜用 '+window.__baziYong.join('、')):'';
  box.innerHTML='<div style="margin-top:8px;padding:8px 10px;border-left:3px solid var(--gold2);background:var(--r-subbg);font-size:12.5px;line-height:1.8">'
    +'<b style="color:var(--gold2)">✓ 档案已保存</b>　'+p.birth+hourTxt+' · '+p.gender+' · '+sx+'肖'+yongTxt
    +'<br><span style="color:var(--muted)">八字 / 五行穿衣 / 幸运色 / 紫微 / 生命灵数已自动带入。</span></div>';
}
document.getElementById('profSave').onclick=()=>{
  const birth=document.getElementById('profBirth').value;
  const hour=document.getElementById('profHour').value;
  const gender=document.getElementById('profGender').value;
  const city=document.getElementById('profCity').value;
  if(!birth){ const box=document.getElementById('profState'); if(box) box.innerHTML='<div style="margin-top:8px;color:var(--bad)">请先选择出生日期再保存。</div>'; return; }
  profSave({birth,hour,gender,city});
  profApply();
  /* 保存后若五行穿衣/幸运色已算过，联动刷新一次 */
  try{ const db=document.getElementById('dressBtn'); if(db&&db.onclick&&document.getElementById('dress').classList.contains('show')) db.onclick(); }catch(e){}
  try{ const lb=document.getElementById('luckyBtn'); if(lb&&lb.onclick&&document.getElementById('lucky').classList.contains('show')) lb.onclick(); }catch(e){}
};
document.getElementById('profClear').onclick=()=>{
  profClear();
  ['profBirth','profHour','profGender','profCity'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=id==='profGender'?'男':(id==='profCity'?'120':''); });
  const box=document.getElementById('profState'); if(box) box.innerHTML='<div style="margin-top:8px;color:var(--muted);font-size:12px">档案已清除，各模块恢复手动填写。</div>';
};
/* 页面加载自动恢复档案（若已保存） */
try{ profApply(); }catch(e){};

/* —— 今日运势聚合：一屏看今日（干支/宜忌/幸运/生肖/星座，全部真实推算） —— */
document.getElementById('todayBtn').onclick=()=>{
  const d=new Date();
  const solar=Solar.fromYmd(d.getFullYear(),d.getMonth()+1,d.getDate());
  const lunar=solar.getLunar();
  const gz=lunar.getDayInGanZhi(); const tg=gz.charAt(0), dz=gz.charAt(1);
  const wu=GAN_WU[tg]||DZ_WU[dz]||'土';
  const yi=(lunar.getDayYi()||[]).slice(0,6);
  const ji=(lunar.getDayJi()||[]).slice(0,6);
  let xz=''; try{ xz=solar.getXingZuo()||''; }catch(e){}
  const sx=ZOD[ZHI.indexOf(dz)]||'';
  const lk=luckyOf(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`);
  const yl=lunar.getMonthInChinese()+'月'+lunar.getDayInChinese();
  const liuYao=lunar.getLiuYao()||'', xk=lunar.getDayXunKong()||'', naYin=lunar.getDayNaYin()||'', chong=lunar.getChongDesc()||'';
  const jishi=_jiShiCalc(dz);
  const xiD=lunar.getDayPositionXiDesc()||'', caiD=lunar.getDayPositionCaiDesc()||'', fuD=lunar.getDayPositionFuDesc()||'';
  const sxTips={
    '鼠':['机敏灵动，今日宜把握时机、多做沟通','敏锐善察，今日利谋事，忌犹豫不决','机变有余，宜以小搏大，莫贪全求快','鼠肖今日宜快人一步、抢占先机，犹豫最误事','鼠肖利谋略，今日以小搏大可行，但别贪全'],
    '牛':['踏实沉稳，今日宜按部就班、不宜冒进','厚积薄发，今日利深耕，忌急于求成','稳中藏劲，宜把一件事做透，自见成效','牛肖今日宜稳扎稳打，一步一个脚印最踏实','牛肖厚积薄发，今日深耕最划算，忌被杂事带跑'],
    '虎':['果敢有魄力，今日宜主动出击、勿失良机','气场正盛，今日宜担纲开路，忌畏首畏尾','勇而有谋，宜先立章法再动，事半功倍','虎肖今日气场正盛，宜担纲开路、别藏着本事','虎肖勇而有谋，今日先立章法再动，事半功倍'],
    '兔':['温和细腻，今日宜静心整理、以柔克刚','心思细密，今日利协调人际，忌正面硬碰','外柔内慧，宜在安静处把想做的事想清楚','兔肖今日宜以柔克刚，温和处藏着力量','兔肖外柔内慧，今日在安静处把事想清楚再动'],
    '龙':['志气高昂，今日宜远谋、忌争一时长短','格局宏大，今日宜布长线，忌被琐碎绊住','气盛宜敛，今日先把势头稳住再图展开','龙肖今日宜远谋布长线，不拘一时得失','龙肖气盛宜敛，今日把势头稳住，别被小事带偏'],
    '蛇':['思虑周密，今日宜谋定后动、防口舌','沉静多智，今日利暗中布局，忌过早声张','洞察敏锐，宜看准关节再出手，一击即中','蛇肖今日宜谋定后动，话到嘴边留三分','蛇肖洞察敏锐，今日看准关节再出手，一击即中'],
    '马':['行动力强，今日宜出行会友、舒展身心','奔腾向好，今日利走动拓展，忌困守一隅','性急宜缓，今日先把节奏放慢半拍更顺','马肖今日宜出行会友，动起来运气就顺','马肖性急宜缓，今日把节奏放慢半拍更稳'],
    '羊':['温厚包容，今日宜合作共赢、忌孤军奋战','柔和聚人，今日利团队协同，忌单打独斗','包容有度，今日宜帮人也留三分给自己','羊肖今日宜合作共赢，人多力量大','羊肖包容有度，今日帮人时也记得留三分给自己'],
    '猴':['聪慧善变，今日宜灵活应变、勿三心二意','机变百出，今日利多线推进，忌浅尝辄止','巧思宜沉淀，今日选一件做到底最划算','猴肖今日宜灵活应变，多线并行也别忘了收口','猴肖巧思宜沉淀，今日选一件做到底最划算'],
    '鸡':['精细求全，今日宜专注细节、忌急躁','严谨成形，今日利收尾打磨，忌粗枝大叶','求全宜抓主，今日先把要紧事做漂亮','鸡肖今日宜专注细节，慢工出细活','鸡肖求全宜抓主，今日先把要紧事做漂亮'],
    '狗':['忠诚可靠，今日宜守信守约、得人信赖','信义立身，今日利兑现承诺，忌轻诺寡信','稳重可托，今日宜把分内事做扎实','狗肖今日宜守信守约，答应的事就要做到','狗肖稳重可托，今日把分内事做扎实，口碑自来'],
    '猪':['随和知足，今日宜劳逸结合、蓄养精神','宽和养气，今日利休整蓄能，忌透支硬撑','知足常乐，今日宜把节奏放轻、把心放宽','猪肖今日宜劳逸结合，给自己留够休息','猪肖知足常乐，今日把节奏放轻，福气自然来']
  };
  const sxZhi=ZODIAC_ZHI[sx]||''; const sw=DZ_WU[sxZhi]||'土';
  const sxLucky=`幸运：<b style="color:${WU_COLOR[sw]||'#9a8a5a'}">${sw}系色</b> ｜ 数字 <b style="color:var(--gold2)">${[,'1','2','3','4','5','6','7','8','9'][({'金':7,'木':3,'水':6,'火':9,'土':5}[sw])]||'5'}</b> ｜ 方位 <b style="color:var(--gold2)">${WU_DIR[sw]||'中'}</b>`;
  const xzTips={
    '白羊':['今日宜主动出击，想到就去做','冲劲在线，先定个小目标再发力','行动是你的本能，记得带上耐心'],
    '金牛':['今日宜稳扎稳打，守住节奏','按部就班最省心，别被带乱步伐','踏实做事，回报会在结尾等你'],
    '双子':['今日宜多交流，信息就是机会','脑子转得快，但话出口前过一遍','多听少说，反而收获更多'],
    '巨蟹':['今日宜照顾自己，情绪需要安放','家与安全感是你今日的锚','对别人温柔之前，先对自己温柔'],
    '狮子':['今日宜大方展现，舞台属于你','自信是你最好的名片','给掌声，也给倾听'],
    '处女':['今日宜打磨细节，精益求精','追求完美可以，但别苛求自己','把一件事做漂亮，胜过十件做一半'],
    '天秤':['今日宜平衡取舍，别太迁就','把话说开，关系才平衡','优雅应对，是你的优势'],
    '天蝎':['今日宜专注深耕，看准再出手','直觉敏锐，相信你的判断','深谋远虑，但别把自己关太紧'],
    '射手':['今日宜向外探索，世界很大','乐观是你的引力，带上它出发','看远一点，小事自然变小'],
    '摩羯':['今日宜按计划推进，一步不偏','务实是最快的捷径','扛得住压力，也要记得休息'],
    '水瓶':['今日宜打破常规，换个思路','你的与众不同正是机会','灵感来了，就写下来'],
    '双鱼':['今日宜跟随直觉，温柔以待','敏感是天赋，别用来内耗','让情绪流动，别堵在心里']
  };
  const xzKey=xz.replace('座','');
  const dayTgW={'甲':['木旺之始，宜生发进取','木气当令，宜定新事、开新局'],'乙':['木气柔和，宜以柔化刚','木气温软，宜顺势推进、莫硬碰'],'丙':['火气光明，宜展现自我','火气正盛，宜大胆发声、让人看见'],'丁':['火气内敛，宜沉淀蓄能','火气藏锋，宜静心积累、蓄势待发'],'戊':['土气厚重，宜稳固根基','土气沉稳，宜打牢地基、不宜冒进'],'己':['土气包容，宜涵养心性','土气厚德，宜宽以待人、严以律己'],'庚':['金气肃杀，宜决断取舍','金气锋利，宜快刀斩麻、别拖泥带水'],'辛':['金气温润，宜精雕细琢','金气细腻，宜打磨细节、慢工出细活'],'壬':['水势奔流，宜顺势而为','水势浩荡，宜随势流动、不逆水硬撑'],'癸':['水势潜藏，宜静观其变','水势深藏，宜静观蓄力、谋定后动']};
  /* 档案驱动个人判词：今日日干五行 vs 本命喜用（已保存档案才显示） */
  let profileToday='';
  try{
    const prof=profLoad();
    if(prof&&prof.birth&&window.__baziYong&&window.__baziYong.length){
      const myWu=wu; const myYong=window.__baziYong;
      const yongHit=myYong.indexOf(myWu)>=0;
      const sh=SHENG||{}, ke=KE||{};
      const yangMe=[]; for(const e in sh){ if(sh[e]===myWu) yangMe.push(e); } /* 生我者旺我 */
      const keMe=[]; for(const e in ke){ if(ke[e]===myWu) keMe.push(e); }
      const tagColor=WU_COLOR[myWu]||'#9a8a5a';
      let verdict, note;
      if(yongHit){ verdict='今日五行属 <b style="color:'+tagColor+'">'+myWu+'</b>，恰是你的<b>喜用</b>——诸事顺势，勇往直前，气场正旺旺你。'; note='多穿 '+myWu+' 系为主，'+(yangMe.length?'辅以生你的 '+yangMe.join('、')+' 系':'')+'，今天拼一把不亏。'; }
      else if(yangMe.indexOf(myYong[0])>=0){ verdict='今日五行属 <b style="color:'+tagColor+'">'+myWu+'</b>，是你的喜用（'+myYong.join('、')+'）所生——喜用能量正滋养今日，用神得以发力。'; note='可放心以 '+myWu+' 系为主体，你的喜用本就在暗中助你，今天顺势走。'; }
      else if(keMe.indexOf(myYong[0])>=0){ verdict='今日五行属 <b style="color:'+tagColor+'">'+myWu+'</b>，被你的喜用（'+myYong.join('、')+'）所克——今日之象在你掌握之中，多谋少虑。'; note='今日是你的喜用压阵，'+myYong.join('、')+' 系打底即可镇住场面。'; }
      else { verdict='今日五行属 <b style="color:'+tagColor+'">'+myWu+'</b>，与你的喜用（'+myYong.join('、')+'）无冲无合——平稳日，常态发挥即可。'; note='随己喜好搭配，今日不挑色。'; }
      profileToday='<h4>今日 · 个人参照（档案 '+window.__baziDayGan+' 日主）</h4>'
        +'<p style="font-size:13px">'+verdict+'</p>'
        +'<p style="font-size:12.5px;color:var(--muted);margin-top:4px">'+note+'</p>';
    }
  }catch(e){ profileToday=''; }
  /* 今日一签：以「年-月-日」为确定性种子，当日恒定、隔日更换，取自传统观音签库 */
  let dailyQian='';
  try{
    const seedStr=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    let h=0; for(let i=0;i<seedStr.length;i++){ h=(h*31+seedStr.charCodeAt(i))>>>0; }
    const g=GUANYIN[h%GUANYIN.length];
    const _lvSet={'上上':['#5fae5f','大吉上上，诸事顺遂'],'中上':['var(--gold2)','吉中带稳，正合时宜'],'中平':['var(--gold2)','平顺守常，按部就班'],'中下':['#c24234','稍有坎坷，稳中求进'],'下下':['#c24234','当下偏滞，宜守勿冒进']};
    const _lv=(_lvSet[g.lv]||['var(--gold2)','平顺相宜']); const _lvC=_lv[0], _lvT=_lv[1];
    dailyQian=`<div style="margin-top:14px;padding-top:12px;border-top:1px dashed rgba(154,138,90,.3)">
      <h4>今日一签 · 观音灵签 第${h%GUANYIN.length+1}签</h4>
      <div style="margin:8px 0;padding:12px;border-radius:12px;background:linear-gradient(135deg,rgba(233,196,121,.10),rgba(154,138,90,.06));text-align:center">
        <div style="font-size:11px;letter-spacing:2px;color:var(--muted)">第 ${h%GUANYIN.length+1} 签 · ${g.lv}</div>
        <div style="font-style:italic;color:var(--gold2);line-height:2;margin:6px 0">${g.po}</div>
        <div style="font-size:12px;color:${_lvC};font-weight:700">【${_lvT}】</div>
        <div style="font-size:12.5px;color:var(--muted);margin-top:6px">${g.jie}</div>
      </div>
      <p style="font-size:12px;color:var(--muted)">* 今日一签以公历日期固定取签，当日不变、隔日自换；断语为传统签诗参考，心诚则灵。</p>
    </div>`;
  }catch(e){ dailyQian=''; }
  document.getElementById('todayResult').innerHTML=`<div class="result">
    <h3>${d.getMonth()+1}月${d.getDate()}日 · 今日运势聚合</h3>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">
      <span class="pill"><b>干支</b> ${gz}</span><span class="pill"><b>农历</b> ${yl}</span>
      ${xz?`<span class="pill"><b>星座</b> ${xz}</span>`:''}
      <span class="pill"><b>五行</b> ${wu}${dayTgW[tg]?('（'+dayTgW[tg][Math.floor(Date.now()/86400000)%dayTgW[tg].length]+'）'):''}</span>
      ${naYin?`<span class="pill"><b>纳音</b> ${naYin}</span>`:''}
      ${liuYao?`<span class="pill"><b>六曜</b> ${liuYao}</span>`:''}
      ${xk?`<span class="pill"><b>旬空</b> ${xk}</span>`:''}
      ${chong?`<span class="pill"><b>冲煞</b> ${chong}</span>`:''}
    </div>
    <h4>宜</h4><div style="display:flex;flex-wrap:wrap;gap:6px">${(yi.length?yi:['诸事不宜']).map(x=>`<span class="tag" style="background:#5fae5f">${x}</span>`).join('')}</div>
    <h4>忌</h4><div style="display:flex;flex-wrap:wrap;gap:6px">${(ji.length?ji:['百无禁忌']).map(x=>`<span class="tag" style="background:#c24234">${x}</span>`).join('')}</div>
    <h4>幸运指引</h4>
    <div style="display:flex;align-items:center;gap:14px;margin:10px 0">
      <div style="width:52px;height:52px;border-radius:12px;background:${lk.color};box-shadow:0 0 16px ${lk.color}88,inset 0 1px 0 rgba(255,255,255,.4)"></div>
      <div style="font-size:14px">幸运色 <b style="color:${lk.color}">${lk.wu}系</b> ｜ <b style="color:var(--gold2)">${lk.num}</b> ｜ <b style="color:var(--gold2)">${lk.dir}</b></div>
    </div>
    ${profileToday}
    <h4>今日生肖 · ${sx}</h4><p>${(sxTips[sx]&&sxTips[sx].length)?sxTips[sx][Math.floor(Date.now()/86400000)%sxTips[sx].length]:'随缘而行，平常心即好'}</p>
    <p style="font-size:12.5px;color:var(--muted);margin-top:4px">${sxLucky}</p>
    ${xzKey&&xzTips[xzKey]?`<h4>今日星座 · ${xz}</h4><p>${xzTips[xzKey][Math.floor(Date.now()/86400000)%xzTips[xzKey].length]}</p>`:''}
    <h4>吉时</h4><p>${jishi.length?jishi.join('、'):'今日诸时平平，随性安排即可'}</p>
    <h4>神方位</h4>
    <p style="font-size:13px">喜神 ${xiD||'—'}（宜求喜、约会、宴客）｜ 财神 ${caiD||'—'}（宜求财、签约、讨账）｜ 福神 ${fuD||'—'}（宜祈福、安宅、开市）</p>
    ${dailyQian}
    ${(()=>{ try{
      const _bf=BF_MAP&&BF_MAP[sx]; if(!_bf) return '';
      const _fiveName=sx==='鼠'||sx==='猪'?'北方水':sx==='虎'||sx==='兔'?'东方木':sx==='马'||sx==='蛇'?'南方火':sx==='猴'||sx==='鸡'?'西方金':'中央空';
      const _five=BF_FIVE[_fiveName]; const _c=WU_COLOR[_bf.element]||'#9a8a5a';
      return `<div style="margin-top:14px;padding-top:12px;border-top:1px dashed rgba(154,138,90,.3)">
        <h4>今日本命佛 · ${sx}肖</h4>
        <div style="text-align:center;margin:6px 0">
          <span style="display:inline-block;padding:8px 18px;border:1px solid ${_c};border-radius:12px;color:${_c};font-weight:700;background:linear-gradient(135deg,rgba(212,175,55,.10),rgba(154,138,90,.04))">${_bf.nama}</span>
          <p style="font-size:12px;color:var(--muted);margin-top:4px">方位 ${_bf.dir} · 五行 ${_bf.color.split(' · ')[0]} ｜ 守护智慧 · ${_five?('五方佛·'+_five.name):''}</p>
        </div>
        <p style="font-size:12.5px;color:var(--muted);line-height:1.7;margin-top:4px">${_bf.tip}</p>
      </div>`;
    }catch(e){ return ''; } })()}
    <p style="color:var(--muted);font-size:12px;margin-top:10px">* 干支/宜忌/幸运/生肖/星座/吉时/神方位均按真实历法当日推算；生肖星座寄语与祈福内容为趣味文化参考。</p>
  </div>`;
};

/* —— 择日：按黄历宜忌挑吉日（lunar 真实推算） —— */
const PICK_CHIPS=['嫁娶','开业','搬家','出行','动土','签约','求医','入学','置业','祈福','求财'];
const PICK_TIP={
  '嫁娶':'嫁娶宜择三合、六合之日，避刑冲破害；兼看女方经期与节气，两利方称佳期。',
  '开业':'开业宜天德、月德、开日，忌闭日破日；门向与事主生肖相生更利招财。',
  '搬家':'搬家入宅宜天赦、成日，先净宅再安床；旧物不必尽搬，循序渐进则安。',
  '出行':'出行宜除、危、定日，避往岁破之方；择吉时启程，事半功倍。',
  '动土':'动土装修宜开工、修造吉日，避土府土符；先祭土神，再动第一锄。',
  '签约':'签约交易宜成日、开日，文书先备齐；时辰与生肖相生，契成少波折。',
  '求医':'求医宜除日、天医到位；急症不拘时，缓病择吉医方更验。',
  '入学':'入学考试宜文昌、学士吉日；心静笔勤，吉日助势不替功。',
  '置业':'置业买房宜纳财、成日；多方勘验，吉日签约更安稳。',
  '祈福':'祈福祭祀宜天德、玉堂日；心诚为本，吉日不过添一层庄严。',
  '求财':'求财宜开日、纳财；诚信为根，吉日助流转不助投机。'
};
window.pickFill=t=>{ const el=document.getElementById('pickThing'); if(el){ el.value=t; const b=document.getElementById('pickDayBtn'); if(b) b.click(); } };
/* 择日「每日吉时」联动：点击任意日期格子，展开该日 干支/吉时/宜忌 */
window.pickDayJiShi=iso=>{
  try{
    const d=new Date(iso);
    const lunar=Solar.fromYmd(d.getFullYear(),d.getMonth()+1,d.getDate()).getLunar();
    const gz=lunar.getDayInGanZhi();
    const jishi=_jiShiCalc(gz.charAt(1));
    const yi=(lunar.getDayYi()||[]).slice(0,6).join('、')||'无';
    const ji=(lunar.getDayJi()||[]).slice(0,6).join('、')||'无';
    const box=document.getElementById('pickJiShiBox');
    if(box) box.innerHTML=`<p style="margin-top:8px;padding:6px 8px;border-left:3px solid #5a8a6a;background:var(--r-subbg);font-size:12.5px;line-height:1.8"><b style="color:var(--r-gold-soft)">${d.getMonth()+1}月${d.getDate()}日 · ${gz} · ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}</b><br>吉时：${jishi.join('、')||'—'}<br>宜 ${yi}<br>忌 ${ji}</p>`;
  }catch(e){}
};
document.getElementById('pickDayBtn').onclick=()=>{
  const thing=document.getElementById('pickThing').value;
  const inp=document.getElementById('pickDate').value;
  const base=inp?new Date(inp):new Date();
  const rows=[]; let good=0; const best=[];
  const wkd=['日','一','二','三','四','五','六'];
  for(let i=0;i<30;i++){
    const d=new Date(base.getFullYear(),base.getMonth(),base.getDate()+i);
    const solar=Solar.fromYmd(d.getFullYear(),d.getMonth()+1,d.getDate());
    const lunar=solar.getLunar();
    const yi=lunar.getDayYi()||[]; const ji=lunar.getDayJi()||[];
    const hit=yi.includes(thing);
    if(hit){ good++; best.push({d,lunar}); }
    const label=`${d.getMonth()+1}/${d.getDate()}`;
    const iso=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    rows.push(`<div class="pill" style="${hit?'border-color:var(--ink-soft);background:var(--glass-strong)':''}cursor:pointer" onclick="pickDayJiShi('${iso}')" title="点击看当日吉时"><b>${label}</b> <span style="color:var(--muted);font-size:10px">周${wkd[d.getDay()]}</span><br>${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}${hit?'<br><span style="color:var(--good)">✓ 宜'+thing+'</span>':'<br><span style="color:var(--muted)">'+ (ji.includes(thing)?'忌'+thing:'平')+'</span>'}</div>`);
  }
  const top=best.slice(0,3).map(o=>`${o.d.getMonth()+1}月${o.d.getDate()}日（${o.lunar.getMonthInChinese()}月${o.lunar.getDayInChinese()}）`).join('、');
  const bestDetail=best.slice(0,3).map(o=>{
    const jishi=_jiShiCalc(o.lunar.getDayInGanZhi().charAt(1));
    const yi=(o.lunar.getDayYi()||[]).slice(0,8).join('、')||'无';
    const ji=(o.lunar.getDayJi()||[]).slice(0,8).join('、')||'无';
    return `${o.d.getMonth()+1}月${o.d.getDate()}日（${o.lunar.getMonthInChinese()}月${o.lunar.getDayInChinese()}）<span style="color:var(--gold2)">吉时 ${jishi.join('、')||'—'}</span><br>宜 ${yi}；忌 ${ji}`;
  }).join('<br>');
  document.getElementById('pickResult').innerHTML=`<div class="result">
    <h3>择日 · ${thing}</h3>
    ${PICK_TIP[thing]?('<p style="font-size:12.5px;color:var(--gold-soft);margin:2px 0 8px">'+PICK_TIP[thing]+'</p>'):''}
    <div style="margin:4px 0 10px">${PICK_CHIPS.map(t=>`<span class="tag" style="cursor:pointer" onclick="pickFill('${t}')">${t}</span>`).join('')}</div>
    <p style="font-size:13px">未来 30 天中，<b style="color:var(--ink-soft)">${good}</b> 天黄历「宜${thing}」${top?`；最近三日：<b style="color:var(--good)">${top}</b>`:''}。</p>
    ${best.length?`<p style="margin-top:6px;font-size:12px;line-height:1.9"><b style="color:var(--gold2)">吉日宜忌 · 吉时</b><br>${bestDetail}</p>`:''}
    <div class="qmtable" style="grid-template-columns:repeat(5,1fr)">${rows.join('')}</div>
    <div id="pickJiShiBox"></div>
    <p style="color:var(--muted);font-size:12px;margin-top:8px">* 宜忌与吉时取自 lunar 历法库真实黄历（吉时按黄黑道十二神）；点任意日期可看当日吉时。吉日仅供参考，重大事宜结合实际情况与个人判断</p>
  </div>`;
};

/* —— 梦境卡：随机抽取一张梦境灵感（趣味） —— */
const DREAMO=[
  '你在一座悬浮的庭院里晾星星，风把光吹成细碎的金箔。',
  '镜湖倒映出另一个你，向你递来一封没有字的信。',
  '旧城墙的砖缝里长出灯笼，每盏都写着一句未完成的话。',
  '你乘纸船穿过云的缝隙，抵达一座只存在于潮汐里的城。',
  '无数钥匙在半空旋转，其中一把正缓缓转向你的掌心。',
  '雨是蓝色的，落在掌心化作一枚会发光的旧硬币。',
  '你走进一本书的留白处，听见远方有人用你儿时的声音唱歌。',
  '蒲公英的种子拖着细小的灯，排成一条通往山顶的路。',
  '一只白鹤把清晨衔来放在你窗台，说今天适合慢一点。',
  '废墟上开满会低语的铃兰，提醒你有些东西正在悄悄复原。',
  '你沿着一条由旧车票铺成的小路走，每一张都通向一个没去成的远方。',
  '天花板上落下一座微缩的城，行人只有米粒大，正朝你招手。',
  '你养的一盆绿萝在夜里悄悄长成了桥，另一端连着一片发光的海。',
  '猫把月亮叼进屋里，放在你枕边，说这样你就能梦见它想去的地方。',
  '你站在两列对开的火车之间，中间的空隙里浮着一整座星空书店。',
  '雨水倒着从地面升回云里，你看见白天发生的事一桩桩退回昨天。',
  '一只蜗牛背着小小的灯塔，在深夜的桌面上为你照亮写字的路。',
  '你把心事折成纸船放进溪流，下游的人捡起，回赠你一句温暖的诗。',
  '山脊上坐着一群沉默的石兽，月亮升起时它们一齐抬起了头。',
  '你走进一座全是镜子的森林，每一面镜子里的你都过着不一样的一生。',
  '钟楼的倒影里，时间往后走，所有人都从容地年轻了一点点。',
  '你收到一封来自十年后的自己的信，字迹被水浸过，只剩"别怕"两个字清楚。',
  '你推开一扇多年没开的木门，发现里面的房间比整座房子还大。',
  '海面升起一座梯子，你往上爬，每踩一级都听见一句很久以前答应过自己的话。',
  '你的影子在路灯下停住，回头对你说：今晚换我替你走回去。',
  '云朵低垂像温驯的羊群，你数着数着，发现自己骑上了最前面的那只。',
  '旧收音机突然调到一个没人播的频道，里面正念着你明天的日记。',
  '你在一座图书馆里找一本书，书名是你想对某人说却没说出口的那句话。',
  '冬天的窗玻璃上，霜花长出一行小字：来年春天，记得再来。',
  '你握住一只萤火虫的手，它带你去见所有你帮助过的人，他们都过得好。',
  '桥下的水安静得像一面镜子，你俯身看见另一个自己在水底向你挥手道别。',
  '你种下一颗会唱歌的种子，它半夜破土，唱的是你童年的摇篮曲。',
  '停电的夜里，整条街的灯都灭了，只有你窗户里透出的光，照亮了对面阳台的花。',
  '你梦见自己站在终点回头看，来时的路都开满了今天想不通的那些事的答案。',
  '你梦见自己的名字被刻在树上，每年都会长出新的笔画。',
  '夜里下了一场糖霜雪，你接住一片，尝出是小时候外婆做的味道。',
  '你推开窗户，一只纸鹤载着一句晚安，停在你手心。',
  '深海里的鲸鱼游过你的窗口，它哼的歌刚好是你失眠时哼的那首。',
  '你发现口袋里的零钱变成了一枚枚会发光的星，花不完。',
  '屋顶的猫开会决定，今晚由最胖的那只守护你的梦。',
  '你走进一间没有墙的房间，风把你的烦恼吹成蒲公英，散进星光里。',
  '醒来前你听见有人轻声说：这次，记得替我把那句话说出口。'
];
document.getElementById('dreamoBtn').onclick=()=>{
  const t=DREAMO[Math.floor(Math.random()*DREAMO.length)];
  document.getElementById('dreamoResult').innerHTML=`<div class="result">
    <h3>今夜梦境卡</h3>
    <p style="font-size:15px;line-height:1.95">${t}</p>
    <p style="color:var(--muted);font-size:12px;margin-top:8px">* 随机抽取的灵感卡，写给睡前的时间；解现实梦境请见「周公解梦」</p>
  </div>`;
};

/* 默认日期填充（避免空输入被误认“没反应”） */
(function(){
  const td=new Date(); const tv=`${td.getFullYear()}-${String(td.getMonth()+1).padStart(2,'0')}-${String(td.getDate()).padStart(2,'0')}`;
  ['birth','cgBirth','starBirth','zvBirth','mA','fA','alDate','luckyDate','pickDate'].forEach(id=>{ const el=document.getElementById(id); if(el && !el.value) el.value=tv; });
})();

mountSaveButtons();
renderHist();

/* ---------- 开场印章盖印（仪式化开场） ---------- */
(function(){
  try{
    const sp=document.getElementById('splash'); if(!sp) return;
    const st=sp.querySelector('.seal-stamp');
    requestAnimationFrame(()=>{ sp.classList.add('stamp'); if(st) st.classList.add('stamp'); });
    setTimeout(()=>sp.classList.add('hide'),1150);
    setTimeout(()=>{ sp.remove(); },1950);
  }catch(e){}
})();

/* ---------- 罗盘 / 八卦转盘（借鉴 myrodin 风水罗盘：太极+八卦+二十四山，双层反向旋转） ---------- */
function taiji(r){
  const r2=(r/2).toFixed(1), r7=(r/7).toFixed(1);
  return `<g>
    <circle r="${r}" fill="#17201d" stroke="var(--gold)" stroke-width="1.1"/>
    <path d="M0 ${(-r).toFixed(1)} A ${r} ${r} 0 0 1 0 ${r} A ${r2} ${r2} 0 0 1 0 0 A ${r2} ${r2} 0 0 0 0 ${(-r).toFixed(1)} Z" fill="var(--gold2)"/>
    <circle cx="0" cy="${(-r/2).toFixed(1)}" r="${r7}" fill="#17201d"/>
    <circle cx="0" cy="${(r/2).toFixed(1)}" r="${r7}" fill="var(--gold2)"/>
  </g>`;
}
function triGlyph(lines){
  const w=15,h=15; let s='';
  lines.forEach((v,k)=>{ const y=(-h/2 + k*(h/3)).toFixed(1);
    if(v){ s+=`<rect x="${-w/2}" y="${y}" width="${w}" height="2.2" rx="1" fill="var(--gold2)"/>`; }
    else{ const sw=((w-4)/2).toFixed(1);
      s+=`<rect x="${-w/2}" y="${y}" width="${sw}" height="2.2" rx="1" fill="var(--gold2)"/><rect x="${(w/2-(w-4)/2).toFixed(1)}" y="${y}" width="${sw}" height="2.2" rx="1" fill="var(--gold2)"/>`; }
  });
  return s;
}
function baguaSVG(){
  const C=100, R1=88, R2=57;
  const SHAN=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥','壬','癸','甲','乙','丙','丁','庚','辛','乾','坤','艮','巽'];
  let outer='';
  for(let i=0;i<24;i++){ const a=i*15*Math.PI/180 - Math.PI/2;
    const x=(C+Math.cos(a)*R1).toFixed(1), y=(C+Math.sin(a)*R1).toFixed(1);
    outer+=`<text x="${x}" y="${(parseFloat(y)+3).toFixed(1)}" text-anchor="middle" font-size="7" fill="var(--muted)">${SHAN[i]}</text>`;
  }
  const TRG=[['乾',[1,1,1]],['兑',[0,1,1]],['离',[1,0,1]],['震',[0,0,1]],['坤',[0,0,0]],['艮',[1,0,0]],['坎',[0,1,0]],['巽',[1,1,0]]];
  let inner='';
  TRG.forEach(([name,lines],i)=>{ const a=i*45*Math.PI/180 - Math.PI/2;
    const x=(C+Math.cos(a)*R2).toFixed(1), y=(C+Math.sin(a)*R2).toFixed(1);
    inner+=`<g transform="translate(${x},${y})">${triGlyph(lines)}</g>`;
  });
  return `<svg viewBox="0 0 200 200" width="152" height="152">
    <circle cx="100" cy="100" r="95" fill="none" stroke="var(--gold)" stroke-width="1" opacity=".5"/>
    <circle cx="100" cy="100" r="78" fill="none" stroke="var(--gold)" stroke-opacity=".25" stroke-width=".8"/>
    <g class="lp-outer">${outer}<circle cx="100" cy="100" r="${R1+4}" fill="none" stroke="var(--gold)" stroke-opacity=".16" stroke-width=".6"/></g>
    <g class="lp-inner">${inner}<circle cx="100" cy="100" r="40" fill="rgba(23,32,29,.62)" stroke="var(--gold)" stroke-opacity=".3" stroke-width=".8"/>${taiji(22)}</g>
  </svg>`;
}
/* ---------- 首页塔罗牌 3D 旋转展示（借鉴 VAAN0524 首页 3D 卡） ---------- */
(function(){
  try{
    const hc=document.getElementById('heroCard');
    if(hc && typeof tarotCardSVG==='function'){
      const ht=TAROT.find(t=>t.n.indexOf('太阳')>=0)||TAROT[0];
      hc.innerHTML=tarotCardSVG(ht.n,false);
    }
    const hl=document.getElementById('heroLuo');
    if(hl && typeof baguaSVG==='function') hl.innerHTML=baguaSVG();
  }catch(e){}
})();

/* ---------- 首屏今日签（打开即见，签纸仪式感；真实历法推算） ---------- */
const SLIP_POEMS=['云开见日，旧事翻篇，新机已至','晨光熹微，宜行宜止，随心而动','静水藏鱼，缓步登高，贵在持久','风起青萍，顺势而转，莫逆流','月缺复圆，得失循环，守中即安','种因得果，今日所行，皆成来日','心灯一盏，照见前路，勿惧迷途','枯木逢春，时运将转，静待花开','山高路远，行则将至，勿问远近','灯火可亲，有人等你，家是归处','事缓则圆，语迟则贵，急中出错','鸿雁传书，远信将至，佳音在途','退一步进，让三分得，以柔克刚','尘埃落定，心定则明，勿扰勿慌','他山之石，可以攻玉，借力而行','破茧有期，蜕变将成，勿急勿弃','甘霖润物，贵人来助，顺势而为','行藏有度，当止则止，当行则行','繁花在侧，勿忘归途，守住本心','夜尽天明，寒极转暖，时来运转','涓滴成河，积微成著，贵在坚持','拨云见日，疑虑渐消，答案自明','静坐观心，闹中取静，智慧自生','柳暗花明，绝处逢生，转机在望','谦受益满招损，低处亦有风景','守拙藏锋，待时而动，不鸣则已','春风得意，马蹄轻疾，勿忘低头看路','大音希声，大象无形，平淡是真','诸缘和合，今日宜成，勇往直前','一念放下，万般自在，心宽路宽','灯下读书，窗前观雨，静好便是福','步履不停，星河可及，志在远方'];
(function(){
  const el=document.getElementById('todaySlip'); if(!el) return;
  try{
    const d=new Date();
    const solar=Solar.fromYmd(d.getFullYear(),d.getMonth()+1,d.getDate());
    const lunar=solar.getLunar();
    const gz=lunar.getDayInGanZhi();
    const yi=(lunar.getDayYi()||[]).slice(0,3);
    const ji=(lunar.getDayJi()||[]).slice(0,3);
    const yl=lunar.getMonthInChinese()+'月'+lunar.getDayInChinese();
    const wu=GAN_WU[gz.charAt(0)]||DZ_WU[gz.charAt(1)]||'土';
    const poem=SLIP_POEMS[_hashStr(gz)%SLIP_POEMS.length];
    el.innerHTML='<div class="slip-head"><span class="slip-seal">玄</span><span>玄机阁 · 今日签</span></div>'+
      '<div class="slip-gz">'+gz+'　'+yl+'</div>'+
      '<div class="slip-poem">签诗 · '+poem+'</div>'+
      '<div class="slip-yj">宜 '+(yi.length?yi.join(' · '):'诸事不宜')+'　忌 '+(ji.length?ji.join(' · '):'百无禁忌')+'</div>'+
      '<div class="slip-wu">当日五行属 '+wu+' · 一签一言</div>';
  }catch(e){}
})();

/* ---------- 首屏今日寄语（按日期轮换，每天固定一句） ---------- */
(function(){
  const Q=['心之所向，素履以往','谋事在人，成事在天；尽己之力，余者随缘','静水流深，来日方长','事缓则圆，语缓则贵','清风徐来，水波不兴','知命者不怨天，知己者不怨人','祸福无门，惟人自召','得意淡然，失意泰然，顺其自然','不驰于空想，不骛于虚声','天行健，君子以自强不息','时来天地皆同力，运去英雄不自由','命由己造，相由心生','一阴一阳之谓道，继之者善也','福生于清俭，德生于卑退','君子藏器于身，待时而动','山不让尘，川不辞盈','守拙归园田，心远地自偏','行到水穷处，坐看云起时','明月入怀，清风在抱','但行好事，莫问前程','胸有丘壑，何惧风波','淡泊明志，宁静致远','大器晚成，不必焦灼','心有猛虎，细嗅蔷薇','回首向来萧瑟处，归去，也无风雨也无晴','闲看庭前花开花落，漫随天外云卷云舒','竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生','不畏浮云遮望眼，自缘身在最高层','落花人独立，微雨燕双飞','且将新火试新茶，诗酒趁年华','沧海横流，方显英雄本色','宠辱不惊，看庭前花开花落','知者不惑，仁者不忧，勇者不惧','流水不争先，争的是滔滔不绝','万物皆有裂痕，那是光照进来的地方','花未全开月未圆，半山微醉尽余欢','身在井隅，心向星光','凡是过往，皆为序章','慢品人间烟火色，闲观万事岁月长','人生如逆旅，我亦是行人','路漫漫其修远兮，吾将上下而求索','世界微尘里，吾宁爱与憎','枕上诗书闲处好，门前风景雨来佳','一蓑烟雨任平生，也无风雨也无晴','把酒祝东风，且共从容','人生得意须尽欢，莫使金樽空对月','采菊东篱下，悠然见南山','此心安处是吾乡'];
  const el=document.getElementById('todayLine'); if(!el) return;
  const d=new Date();
  const pick=Q[Math.floor(d.getTime()/86400000)%Q.length];
  let gz='';
  try{ const lunar=Solar.fromYmd(d.getFullYear(),d.getMonth()+1,d.getDate()).getLunar(); gz=lunar.getDayInGanZhi(); }catch(e){}
  el.textContent=(gz?('今日 '+gz+' · '):'')+pick;
})();

/* ===================== 20. 时辰吉凶（黄历十二时辰真算，可点选） ===================== */
document.getElementById('sizhiBtn').onclick=()=>{
  const inp=document.getElementById('sizhiDate').value;
  const d=inp?new Date(inp):new Date();
  const y=d.getFullYear(),m=d.getMonth()+1,day=d.getDate();
  const SZ=[['子','23:00-00:59',0],['丑','01:00-02:59',1],['寅','03:00-04:59',3],['卯','05:00-06:59',5],
            ['辰','07:00-08:59',7],['巳','09:00-10:59',9],['午','11:00-12:59',11],['未','13:00-14:59',13],
            ['申','15:00-16:59',15],['酉','17:00-18:59',17],['戌','19:00-20:59',19],['亥','21:00-22:59',21]];
  const cells=SZ.map(function(p){
    var n=p[0],t=p[1],h=p[2];
    var l=null; try{ l=Solar.fromYmdHms(y,m,day,h,0,0).getLunar(); }catch(e){}
    var yi=l?(l.getTimeYi()||[]):[]; var ji=l?(l.getTimeJi()||[]):[];
    var gz=l?(l.getTimeInGanZhi()||''):'';
    var s=yi.length-ji.length;
    var st=s>=2?'吉':s<=-1?'忌':'平';
    return {n:n,t:t,gz:gz,yi:yi,ji:ji,st:st};
  });
  var stCol={吉:'#5fae5f',平:'#9a8a5a',忌:'#c24234'};
  var html='<div class="result"><h3>'+y+'年'+m+'月'+day+'日 · 十二时辰吉凶</h3>'+
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:10px 0">';
  cells.forEach(function(c,i){
    var bg=c.st==='吉'?'rgba(95,175,95,.10)':c.st==='忌'?'rgba(194,66,52,.08)':'var(--surface-2)';
    html+='<div class="sz-cell" data-i="'+i+'" style="cursor:pointer;border:1px solid var(--line);border-radius:10px;padding:8px 4px;text-align:center;background:'+bg+';border-top:3px solid '+stCol[c.st]+';transition:transform .2s,box-shadow .2s">'+
      '<div style="font-size:15px;font-family:var(--serif)"><b>'+c.n+'时</b></div>'+
      '<div style="font-size:9.5px;color:var(--muted)">'+c.t+'</div>'+
      '<div style="font-size:10.5px;color:var(--gold2);margin-top:2px">'+c.gz+'</div>'+
      '<div style="font-size:11px;margin-top:3px;color:'+stCol[c.st]+';font-weight:700">'+c.st+'</div>'+
      '<div style="font-size:9.5px;color:var(--muted);margin-top:2px">宜'+c.yi.length+'·忌'+c.ji.length+'</div></div>';
  });
  html+='</div><div id="szDetail" style="min-height:60px;padding:10px 14px;border:1px dashed var(--line);border-radius:10px;background:var(--glass-strong);font-size:13px;color:var(--muted)">点任一格看该时辰宜忌详情</div>'+
    '<p style="color:var(--muted);font-size:12px;margin-top:8px">* 宜忌取自 lunar 历法库按时辰真算；吉凶由宜忌多寡综合（宜比忌多 2 项及以上为吉，忌比宜多 1 项及以上为忌，余为平）。</p></div>';
  document.getElementById('sizhiResult').innerHTML=html;
  document.querySelectorAll('#sizhiResult .sz-cell').forEach(function(el){
    el.onclick=function(){ var c=cells[+el.dataset.i];
      document.querySelectorAll('#sizhiResult .sz-cell').forEach(function(x){ x.style.outline='none'; x.style.transform=''; });
      el.style.outline='2px solid '+stCol[c.st]; el.style.transform='translateY(-2px)';
      var detail=document.getElementById('szDetail');
      detail.innerHTML='<div style="font-family:var(--serif);font-size:15px;color:var(--ink);margin-bottom:6px">'+c.n+'时 '+c.gz+' · <span style="color:'+stCol[c.st]+'">'+c.st+'</span></div>'+
        '<div><b style="color:var(--good)">宜</b>：'+(c.yi.length?c.yi.join('、'):'无')+'　　<b style="color:var(--bad)">忌</b>：'+(c.ji.length?c.ji.join('、'):'无')+'</div>';
    };
  });
};

/* ===================== 21. 运程时间轴（大运 × 流年，80 年，可点选） ===================== */
document.getElementById('ycBtn').onclick=function(){
  var d=document.getElementById('ycBirth').value;
  if(!d){ hintResult('ycResult','请选择出生日期后再生成时间轴。'); return; }
  var h=parseInt(document.getElementById('ycHour').value);
  var gender=document.getElementById('ycGender').value;
  var dp=d.split('-').map(Number); var y=dp[0],m=dp[1],day=dp[2];
  var ec=null;
  try{ ec=Solar.fromYmdHms(y,m,day,h,0,0).getLunar().getEightChar(); }catch(e){}
  if(!ec){ hintResult('ycResult','日期有误，请检查后重试。'); return; }
  var dayGan=ec.getDayGan(), dayWu=GAN_WU[dayGan];
  var pillars=[ec.getYear(),ec.getMonth(),ec.getDay(),ec.getTime()];
  var yearZhi=pillars[0].charAt(1);
  var yun=null,qy=0,da=[];
  try{ yun=ec.getYun(gender==='男'?1:0,1); qy=yun.getStartYear()||0; da=yun.getDaYun(); }catch(e){}
  var sc2=function(w){ if(w===dayWu)return .6; if(SHENG[w]===dayWu)return 1; if(SHENG[dayWu]===w)return -.7; if(KE[dayWu]===w)return -.5; if(KE[w]===dayWu)return -.3; return 0; };
  var now=new Date(); var ageY=now.getFullYear()-y; var bd=new Date(now.getFullYear(),m-1,day); if(now<bd) ageY--;
  var yrs=[];
  for(var a=0;a<80;a++){
    var gy=y+a; var gz=yearGZ_LC(gy); var tg=gz.charAt(0);
    var di=-1; if(a>=qy&&da.length){ di=Math.min(Math.floor((a-qy)/10),da.length-1); }
    var dgz=da[di]?da[di].getGanZhi():'';
    var s=sc2(GAN_WU[gz.charAt(0)])+sc2(DZ_WU[gz.charAt(1)]);
    var dsh=shenOf(dayGan,yearZhi,gz.charAt(1));
    yrs.push({a:a,gy:gy,gz:gz,sh:shiShen(dayGan,tg),di:di,dgz:dgz,s:s,dsh:dsh});
  }
  var cols=20;
  var grid='<div style="display:grid;grid-template-columns:repeat('+cols+',1fr);gap:3px;margin:10px 0">';
  yrs.forEach(function(r){
    var isNow=r.a===ageY;
    var warm=r.s>0.15, cool=r.s<-0.15;
    var bg=isNow?'linear-gradient(180deg,var(--cinnabar),var(--cinnabar-ink))':(warm?'rgba(95,175,95,.16)':cool?'rgba(194,66,52,.12)':'var(--surface-2)');
    var fc=isNow?'#f6f1e6':(warm?'#3f7a3f':cool?'#9a2f27':'var(--ink)');
    grid+='<div class="yc-cell" data-i="'+r.a+'" style="cursor:pointer;border:1px solid '+(isNow?'var(--cinnabar)':'var(--line)')+';border-radius:7px;padding:4px 2px;text-align:center;background:'+bg+';color:'+fc+';transition:transform .15s,box-shadow .15s">'+
      '<div style="font-size:10px;opacity:.75">'+r.a+'岁</div>'+
      '<div style="font-size:12px;font-family:var(--serif);font-weight:700;letter-spacing:.5px">'+r.gz+'</div>'+
      '<div style="font-size:8.5px;opacity:.65">'+r.sh+'</div></div>';
  });
  grid+='</div><div id="ycDetail" style="min-height:72px;padding:10px 14px;border:1px dashed var(--line);border-radius:10px;background:var(--glass-strong);font-size:13px;color:var(--muted)">点任一格看该岁要点（当前岁数以朱砂底高亮）</div>';
  var html='<div class="result"><h3>'+y+'年'+m+'月'+day+'日 · '+gender+' · 人生运程时间轴</h3>'+
    '<div style="color:var(--muted);font-size:12px;margin-bottom:2px">日主 '+dayGan+'（'+dayWu+'）· 起运 约'+qy+'岁 · '+(yun&&yun.isForward()?'顺排':'逆排')+'；每格＝一岁流年干支，绿底为生扶顺岁、红底为克泄逆岁</div>'+
    grid+
    '<p style="color:var(--muted);font-size:12px;margin-top:8px">* 流年以立春为界逐年推算；强弱评分以干支五行对日主 '+dayGan+' 的生扶/克泄计算；时间轴仅示人生节奏，非吉凶定论。</p></div>';
  document.getElementById('ycResult').innerHTML=html;
  document.querySelectorAll('#ycResult .yc-cell').forEach(function(el){
    el.onclick=function(){ var r=yrs[+el.dataset.i];
      document.querySelectorAll('#ycResult .yc-cell').forEach(function(x){ x.style.outline='none'; x.style.transform=''; });
      el.style.outline='2px solid var(--golden)'; el.style.transform='translateY(-2px)';
      var detail=document.getElementById('ycDetail');
      var sgn=r.s>=0?'+':'';
      var stxt=r.s>0.15?'此岁生扶之气较足，宜进取、谋事较顺。':r.s<-0.15?'此岁克泄偏重，宜守成蓄力、忌冒进。':'此岁五行平和，顺势而为即可。';
      detail.innerHTML='<div style="font-family:var(--serif);font-size:15px;color:var(--ink);margin-bottom:6px">'+r.a+'岁 · '+r.gy+'年 <b style="color:var(--cinnabar)">'+r.gz+'</b>（'+r.sh+'）</div>'+
        '<div style="line-height:1.8">所在大运：<b>'+(r.dgz||'起运前')+(r.di>=0?'（约'+(qy+r.di*10)+'岁起）':'')+'</b>　·　对日主 '+dayGan+' 强弱分 <b style="color:'+(r.s>0?'var(--good)':'var(--bad)')+'">'+sgn+r.s.toFixed(2)+'</b>'+(r.dsh.length?'<br>神煞：<b style="color:var(--gold2)">'+r.dsh.join('、')+'</b>':'')+'</div>'+
        '<div style="margin-top:6px">'+stxt+'</div>';
    };
  });
};

/* ===================== 22. 命理问答（关键词分类 × 盘面参数作答） ===================== */
const GAN_IMG_WEN={'甲':'参天之木','乙':'蔓生之木','丙':'中天之日','丁':'灯烛之火','戊':'城垣之土','己':'田园之土','庚':'斧钺之金','辛':'珠玉之金','壬':'江河之水','癸':'雨露之水'};
const WD_ONE={
  work:['顺势而为者成事，逆势硬扛者耗神','先把自己立在能赢的位置，输赢都是收获'],
  money:['财是本事兑现，不是运气兑换','守得住的心，才装得下更大的财'],
  love:['爱是先安顿自己，再相拥而行','真心慢一点，反而看得更清'],
  health:['身体是唯一长期投资','节律比补品更养人'],
  study:['功夫下在平时，成绩只是回声','定下靶心，箭才有方向'],
  guan:['贵人先在你值得被帮的时候出现','你如何待人，世界如何待你'],
  move:['动中求活，静中求稳','脚下的路，是自己选的向'],
  timing:['时机偏爱有准备的人','当下即是最好的起点']
};
document.getElementById('wenBtn').onclick=function(){
  var d=document.getElementById('wenBirth').value;
  var q=(document.getElementById('wenQ').value||'').trim();
  if(!d){ hintResult('wenResult','请选择出生日期后再提问。'); return; }
  if(!q){ hintResult('wenResult','请先写下你的问题。'); return; }
  var h=parseInt(document.getElementById('wenHour').value);
  var dp=d.split('-').map(Number); var y=dp[0],m=dp[1],day=dp[2];
  var ec=null;
  try{ ec=Solar.fromYmdHms(y,m,day,h,0,0).getLunar().getEightChar(); }catch(e){}
  if(!ec){ hintResult('wenResult','日期有误，请检查后重试。'); return; }
  var dayGan=ec.getDayGan(), dayWu=GAN_WU[dayGan];
  var pillars=[ec.getYear(),ec.getMonth(),ec.getDay(),ec.getTime()];
  var yearZhi=pillars[0].charAt(1);
  var wu={金:0,木:0,水:0,火:0,土:0};
  [ec.getYearWuXing(),ec.getMonthWuXing(),ec.getDayWuXing(),ec.getTimeWuXing()].forEach(function(s){ for(var i=0;i<s.length;i++){ var c=s.charAt(i); if(wu[c]!==undefined) wu[c]++; } });
  var DZ_BENQI={'子':'癸','丑':'己','寅':'甲','卯':'乙','辰':'戊','巳':'丙','午':'丁','未':'己','申':'庚','酉':'辛','戌':'戊','亥':'壬'};
  var KE_W={'木':'金','火':'水','土':'木','金':'火','水':'土'};
  var SHENG_W={'金':'土','木':'水','水':'金','火':'木','土':'火'};
  var score=0;
  pillars.forEach(function(gz,i){
    var tg=gz.charAt(0), tz=gz.charAt(1);
    var sc=function(ch){ var cw=GAN_WU[ch];
      if(cw===dayWu) return 1; if(SHENG[cw]===dayWu) return 1;
      if(SHENG[dayWu]===cw) return -1; if(KE[dayWu]===cw) return -1;
      if(KE[cw]===dayWu) return -1; return 0; };
    var s=sc(tg)+sc(DZ_BENQI[tz]); if(i===1) s*=2; score+=s;
  });
  var qiang=score>0?'身强':score<0?'身弱':'中和';
  var yongUniq=[].concat((score>=0?[KE_W[dayWu],KE[dayWu],SHENG[dayWu]]:[SHENG_W[dayWu],dayWu]));
  yongUniq=[...new Set(yongUniq)];
  var yunBest='';
  try{
    var yun=ec.getYun(1,1); var qy0=yun.getStartYear()||0;
    var best=null,bi=-1;
    yun.getDaYun().forEach(function(p,i){ if(i>=8)return; var gz2=p.getGanZhi(); if(!gz2)return;
      var w1=GAN_WU[gz2.charAt(0)],w2=DZ_WU[gz2.charAt(1)];
      var f=function(w){ if(w===dayWu)return .6; if(SHENG[w]===dayWu)return 1; if(SHENG[dayWu]===w)return -.7; if(KE[dayWu]===w)return -.5; if(KE[w]===dayWu)return -.3; return 0; };
      var s2=+(f(w1)+f(w2)).toFixed(2);
      if(!best||s2>best.s){ best={s:s2,gz:gz2,sh:shiShen(dayGan,gz2.charAt(0))}; bi=i; } });
    if(best&&bi>=0) yunBest='较顺的一段在约'+(qy0+bi*10)+'岁起的'+best.gz+'运（'+best.sh+'）';
  }catch(e){}
  var CATS=[
    {k:'work',t:'事业',p:/(事业|工作|跳槽|升职|升迁|创业|生意|职场|换工作)/,v:[
      '日主 <b>'+dayGan+'（'+dayWu+'）</b>、命局 <b>'+qiang+'</b>。问事业，'+(qiang==='身强'?'你适合担纲开路、主动争取，莫久居配角位':'宜借平台与贵人之力、稳扎稳打，不硬闯')+'；'+(yunBest?yunBest+'，可提前布局。':''),
      '以你的盘面看，事业走向与喜用 <b>'+yongUniq.join(' / ')+'</b> 相关的行业/方位最顺；命局 '+qiang+'，'+(qiang==='身强'?'冲劲是资产，但要落到一件具体的事上':'积累是正路，别被短期波动带乱节奏')+'。']},
    {k:'money',t:'财运',p:/(财|钱|投资|买房|理财|股票|基金|负债|收入|涨薪)/,v:[
      '财星'+((pillars.join('').match(/[正偏]财/)||[]).length?'有现于四柱':'偏隐于支')+'，命局 <b>'+qiang+'</b>——'+(qiang==='身强'?'能担财，可主动求财与置业':'宜守成积财，忌冒进与加杠杆')+'；理财多近 <b>'+yongUniq.join(' / ')+'</b> 之气最稳。',
      '问财运，'+(qiang==='身强'?'你的财在"动"里——开拓、见世面、把本事变现':'你的财在"守"里——攒住、稳住、别被高收益诱惑')+'；顺势而为，不赌不贪，即为上策。']},
    {k:'love',t:'感情',p:/(感情|恋爱|婚姻|结婚|对象|分手|相亲|伴侣|姻缘)/,v:[
      '日主 <b>'+dayGan+'</b>、命局 <b>'+qiang+'</b>，感情上'+(qiang==='身强'?'你主动有余、柔韧不足，宜多听对方、以柔化刚':'宜先安顿好自己，感情才有余力经营')+'；喜用 <b>'+yongUniq.join(' / ')+'</b>，同好共赴易生默契。',
      '问姻缘，'+(qiang==='身强'?'缘分多在你主动跨出的那一步，但别把占有当深情':'缘分偏爱顺其自然，你先把自己过充实，对的人会在对的时间出现')+'。']},
    {k:'health',t:'健康',p:/(健康|身体|生病|失眠|疲惫|养生|体检|病)/,v:[
      '命里 '+Object.entries(wu).sort(function(a,b){return a[1]-b[1];})[0][0]+' 偏弱宜养、'+Object.entries(wu).sort(function(a,b){return b[1]-a[1];})[0][0]+' 偏旺宜疏；身 <b>'+qiang+'</b>，'+(qiang==='身强'?'动则生阳，规律运动最相宜':'静以养阴，别透支，多给自己留白')+'。身体不适请以现代医学为准。',
      '问健康，你的节律比补品更重要——'+(qiang==='身强'?'把"动"变成习惯，气就顺了':'把"睡"当成正经事，元气自然回来')+'。']},
    {k:'study',t:'学业',p:/(学业|考试|学习|考研|升学|读书|考公|考证|面试)/,v:[
      '<b>'+dayWu+'</b>日主、命局 <b>'+qiang+'</b>，求学之路'+(qiang==='身强'?'宜攻难关、定靶心、一鼓作气':'宜稳节奏、重积累、小步快走')+'；案头近 <b>'+yongUniq.join(' / ')+'</b> 之气，提神亦静心。',
      '问学业，你的优势在'+(qiang==='身强'?'持续力与攻坚力，设定明确目标就能跑起来':'细腻与耐力，循序渐进比突击更出成果')+'。']},
    {k:'guan',t:'贵人',p:/(贵人|人际|合作|朋友|同事|上司|人脉|社交)/,v:[
      '命中神煞与日主 '+dayGan+' 看，贵人往往出现在与 <b>'+yongUniq.join(' / ')+'</b> 之气相关的人群里；命局 '+qiang+'，'+(qiang==='身强'?'你是他人的贵人，也别忘了接受别人的好意':'你多借力而行，靠近生扶你的人与事')+'。',
      '问贵人，'+(qiang==='身强'?'你自己就是最大的贵人，先帮自己把事做成，人脉自来':'贵人在你主动求助的路上——别怕开口，也别轻信巧言')+'。']},
    {k:'move',t:'出行',p:/(搬家|出行|旅游|移民|远方|换城市|出差)/,v:[
      '驿马之气与流年看，'+(qiang==='身强'?'宜动中求成，往外走、多见世面正合你运':'动中易耗，出行宜有备而往，不宜草率大迁')+'；方位多取 <b>'+yongUniq.join(' / ')+'</b> 对应方向。',
      '问出行迁徙，你的盘面'+(qiang==='身强'?'偏爱开阔——换个环境往往就是转机':'偏喜安定——环境变动先求稳，安置妥当再图发展')+'。']},
    {k:'timing',t:'时机',p:/(时机|运势|今年|明年|什么时候|是否顺利|现在|当下|流年)/,v:[
      '流年轮转看，'+(yunBest?yunBest+'，是值得把握的窗口':'')+'；命局 '+qiang+'，'+(qiang==='身强'?'当下宜主动，机会在行动里不在等待里':'当下宜蓄势，把准备做足，时机一到自会接住')+'。',
      '问时机，你的节奏是'+(qiang==='身强'?'快半步——想到就做，边做边调':'慢半拍——看准再动，稳扎稳打反而快')+'；'+(yunBest?'抓住'+yunBest+'事半功倍。':'平常心即最佳时机。')+'']},
  ];
  var hit=null; for(var i=0;i<CATS.length;i++){ if(CATS[i].p.test(q)){ hit=CATS[i]; break; } }
  var _wq=_hashStr(dayGan+qiang+q.length);
  var base='<div class="result"><h3>命理问答</h3><p style="font-size:12.5px;color:var(--muted);margin-bottom:8px">问：'+q+'</p>';
  if(hit){
    var v=hit.v[_wq%hit.v.length];
    document.getElementById('wenResult').innerHTML=base+
      '<p style="font-size:13.5px;line-height:1.95">'+v+'</p>'+
      '<p style="margin-top:8px;font-size:13px;line-height:1.9">一句话：<b style="color:var(--cinnabar-ink)">'+WD_ONE[hit.k][_wq%WD_ONE[hit.k].length]+'</b></p>'+
      '<p style="color:var(--muted);font-size:12px;margin-top:6px">* 答语由你的盘面参数（日主/旺衰/喜用/大运）生成，同生辰同类问题结果稳定；仅供趣味参考。</p></div>';
  }else{
    document.getElementById('wenResult').innerHTML=base+
      '<p style="font-size:13.5px;line-height:1.95">日主 <b>'+dayGan+'（'+dayWu+'）</b>、命局 <b>'+qiang+'</b>，喜用 <b>'+yongUniq.join(' / ')+'</b>。你这个问题若落到行动上，无非"看准、守住、顺势"六字——'+(qiang==='身强'?'你缺的从来不是力气，是少一点急':'你缺的从来不是方向，是再多一点定')+'。'+(yunBest?'大体而言，'+yunBest+'，此间谋事更顺。':'')+'</p>'+
      '<p style="color:var(--muted);font-size:12px;margin-top:6px">* 未识别到明确的分类关键词，给出盘面泛答；试着把问题说具体些（如"今年适合换工作吗"）。</p></div>';
  }
};

/* 顶部朱砂滚动进度线（rAF 节流，scroll + resize 驱动） */
(function(){
  try{
    const bar=document.createElement('div'); bar.id='scrollProgress';
    document.body.appendChild(bar);
    let ticking=false;
    function upd(){
      ticking=false;
      const h=document.documentElement.scrollHeight-window.innerHeight;
      const p=h>0?((window.scrollY||document.documentElement.scrollTop||0)/h*100):0;
      bar.style.width=p.toFixed(2)+'%';
    }
    window.addEventListener('scroll',()=>{ if(!ticking){ ticking=true; requestAnimationFrame(upd); } },{passive:true});
    window.addEventListener('resize',upd);
    upd();
  }catch(e){}
})();

/* ===================== 23. 八字圆形命盘（四柱四宫 · 日主居中） ===================== */
function baziDisc(pillars, ss, wx, dayGan, dayWu){
  const C=150, R1=138, R2=104, R3=76;
  const WF={'金':'#b8a878','木':'#9aab95','水':'#9aa6b0','火':'#c29a90','土':'#b3a78f'};
  const dirs=[['年柱',0],['月柱',90],['日柱',180],['时柱',270]];
  let g='<svg class="bz-disc" viewBox="0 0 300 300" role="img" aria-label="八字命盘">';
  g+='<circle class="dz-ring" cx="'+C+'" cy="'+C+'" r="'+R1+'"/>';
  g+='<circle class="dz-ring" cx="'+C+'" cy="'+C+'" r="'+R2+'"/>';
  g+='<circle class="dz-ring" cx="'+C+'" cy="'+C+'" r="'+R3+'"/>';
  // 外环五行色弧（每柱按天干五行着色）
  dirs.forEach(([name,deg],i)=>{
    const a1=(deg-46)*Math.PI/180, a2=(deg+46)*Math.PI/180;
    const x1=C+R1*Math.cos(a1), y1=C+R1*Math.sin(a1), x2=C+R1*Math.cos(a2), y2=C+R1*Math.sin(a2);
    const col=WF[(wx[i]||'').charAt(0)]||'#999';
    g+='<path class="dz-arc" d="M'+x1.toFixed(1)+' '+y1.toFixed(1)+' A'+R1+' '+R1+' 0 0 1 '+x2.toFixed(1)+' '+y2.toFixed(1)+'" stroke="'+col+'" fill="none"/>';
  });
  // 四宫文字（柱名 → 干支竖排 → 十神）
  dirs.forEach(([name,deg],i)=>{
    const a=(deg-90)*Math.PI/180;
    const isDay=i===2, gz=pillars[i], tg=gz.charAt(0), tz=gz.charAt(1);
    const ink=isDay?'var(--cinnabar-ink)':'var(--ink)';
    let lx=C+(R1+18)*Math.cos(a), ly=C+(R1+18)*Math.sin(a);
    g+='<text class="dz-lbl" x="'+lx.toFixed(1)+'" y="'+(ly+3).toFixed(1)+'" text-anchor="middle">'+name+'</text>';
    lx=C+R2*Math.cos(a); ly=C+R2*Math.sin(a);
    g+='<text class="dz-col" fill="'+ink+'" font-size="20" x="'+lx.toFixed(1)+'" y="'+(ly-1).toFixed(1)+'" text-anchor="middle">'+tg+'</text>';
    g+='<text class="dz-col" fill="'+ink+'" font-size="20" x="'+lx.toFixed(1)+'" y="'+(ly+17).toFixed(1)+'" text-anchor="middle">'+tz+'</text>';
    lx=C+R3*Math.cos(a); ly=C+R3*Math.sin(a);
    g+='<text class="dz-ss" x="'+lx.toFixed(1)+'" y="'+(ly+3).toFixed(1)+'" text-anchor="middle">'+ss[i]+'</text>';
  });
  // 中心日主（五行底 + 朱砂晕环 + 日主大字）
  g+='<circle class="dz-cdisc" cx="'+C+'" cy="'+C+'" r="32" fill="'+(WF[dayWu]||'#999')+'" fill-opacity=".16"/>';
  g+='<circle class="dz-halo" cx="'+C+'" cy="'+C+'" r="39" fill="none"/>';
  g+='<text class="dz-core" fill="var(--cinnabar-ink)" font-size="30" x="'+C+'" y="'+(C+7)+'" text-anchor="middle">'+dayGan+'</text>';
  g+='<text class="dz-core-sub" x="'+C+'" y="'+(C+24)+'" text-anchor="middle">'+dayWu+'日主</text>';
  g+='</svg>';
  return g;
}

/* ===================== 24. 古琴氛围音（Web Audio 合成，零依赖） ===================== */
let _actx=null, _guiOn=false, _guiTimer=null, _master=null, _reverb=null, _drone=null, _lastIdx=2;
try{ _guiOn=localStorage.getItem('xuanji_guiyin')==='1'; }catch(e){}
const GUQIN_SCALE=[98,110,123.47,130.81,146.83];   // 五声（G2 A2 B2 C3 D3）低沉
function guqinCtx(){
  if(!_actx){
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC) return null;
    _actx=new AC();
  }
  if(_actx.state==='suspended'){ try{ _actx.resume(); }catch(e){} }
  return _actx;
}
/* 构建音频图：master(带压缩防爆音) → 干声 + 反馈延时混响(湿声) → 输出 */
function ensureGraph(){
  const ctx=guqinCtx(); if(!ctx||_master) return ctx;
  _master=ctx.createGain(); _master.gain.value=0;            // 淡入
  const comp=ctx.createDynamicsCompressor();
  comp.threshold.value=-18; comp.ratio.value=4; comp.attack.value=.01; comp.release.value=.25;
  _master.connect(comp); comp.connect(ctx.destination);
  // 混响：反馈延时（廉价「殿堂/庭院」空间感）
  const delay=ctx.createDelay(1.0); delay.delayTime.value=0.30;
  const fb=ctx.createGain(); fb.gain.value=0.34;
  const wet=ctx.createGain(); wet.gain.value=0.34;
  delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(_master);
  _reverb={delay,wet};
  return ctx;
}
/* 古琴拨弦音色：基频+高次泛音(带轻微拍频)，快起音+长指数衰减；同时送干声与混响 */
function guqinNote(freq, dur, vol, when){
  if(!_guiOn) return;
  const ctx=ensureGraph(); if(!ctx) return;
  const t0=ctx.currentTime+(when||0);
  const master=ctx.createGain(); master.gain.value=1;
  const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2600;
  master.connect(lp); lp.connect(_master); if(_reverb) lp.connect(_reverb.delay);
  [[1,1,0],[2,.3,.02],[3,.13,.05],[4,.05,.09]].forEach(([m,a,dt])=>{
    const o=ctx.createOscillator(), o2=ctx.createOscillator();
    o.type=o2.type='sine'; o.frequency.value=freq*m; o2.frequency.value=freq*m*1.004;
    const gg=ctx.createGain();
    const peak=a*(vol||.08);
    gg.gain.setValueAtTime(0,t0+dt);
    gg.gain.linearRampToValueAtTime(peak,t0+dt+.01);
    gg.gain.exponentialRampToValueAtTime(.0001,t0+dur);
    o.connect(gg); o2.connect(gg); gg.connect(master);
    o.start(t0+dt); o2.start(t0+dt);
    o.stop(t0+dur+.05); o2.stop(t0+dur+.05);
  });
}
/* 低频音床：G2 + 五度 D3 双正弦(微失谐)，缓慢呼吸，营造空间厚度 */
function startDrone(){
  const ctx=guqinCtx(); if(!ctx||_drone) return;
  const g=ctx.createGain(); g.gain.value=0;
  g.gain.linearRampToValueAtTime(0.016, ctx.currentTime+3);
  const mk=(f)=>{ const o=ctx.createOscillator(); o.type='sine'; o.frequency.value=f;
    const o2=ctx.createOscillator(); o2.type='sine'; o2.frequency.value=f*1.003;
    const gg=ctx.createGain(); gg.gain.value=0.5; o.connect(gg); o2.connect(gg); gg.connect(g); o.start(); o2.start(); return [o,o2]; };
  const nodes=[].concat(...mk(98), ...mk(146.83));
  const lfo=ctx.createOscillator(); lfo.frequency.value=0.05; const lg=ctx.createGain(); lg.gain.value=0.007;
  lfo.connect(lg); lg.connect(g.gain); lfo.start();
  g.connect(_master);
  _drone={nodes,g,lfo};
}
function stopDrone(){
  if(!_drone) return; const {nodes,g,lfo}=_drone; const ctx=guqinCtx();
  try{ g.gain.cancelScheduledValues(ctx.currentTime); g.gain.setValueAtTime(g.gain.value,ctx.currentTime);
    g.gain.linearRampToValueAtTime(0,ctx.currentTime+1.2);
    nodes.forEach(o=>{ try{o.stop(ctx.currentTime+1.3);}catch(e){} }); try{lfo.stop(ctx.currentTime+1.3);}catch(e){} }catch(e){}
  _drone=null;
}
/* 场景音效：焚香(点火噪+低音) / 盖印 / 翻牌 / 切换 */
function sfx(name){
  if(!_guiOn) return;
  const ctx=guqinCtx(); if(!ctx) return;
  const t0=ctx.currentTime;
  if(name==='incense'){
    const len=.2, buf=ctx.createBuffer(1, Math.floor(ctx.sampleRate*len), ctx.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2.2);
    const src=ctx.createBufferSource(); src.buffer=buf;
    const f=ctx.createBiquadFilter(); f.type='lowpass'; f.frequency.value=850;
    const gg=ctx.createGain(); gg.gain.value=.05;
    src.connect(f); f.connect(gg); gg.connect(ctx.destination); src.start(t0);
    guqinNote(196,1.1,.05);
  } else if(name==='seal'){ guqinNote(130.81,.9,.06); }
  else if(name==='flip'){ guqinNote(220,.7,.05); }
  else if(name==='switch'){ guqinNote(146.83,.6,.04); }
}
/* 氛围循环：随机游走(邻音上下)避免完全随机跳音；偶发八度跃升与留白，旋律更连贯自然 */
function guqinAmbientStart(){
  if(!_guiOn) return; ensureGraph(); startDrone();
  const ctx=guqinCtx(); if(ctx&&_master) _master.gain.linearRampToValueAtTime(0.9, ctx.currentTime+2);
  const tick=()=>{
    if(!_guiOn){ _guiTimer=null; return; }
    const r=Math.random();
    if(r<0.34) _lastIdx=Math.max(0,_lastIdx-1); else if(r<0.68) _lastIdx=Math.min(GUQIN_SCALE.length-1,_lastIdx+1);
    let f=GUQIN_SCALE[_lastIdx];
    if(Math.random()<0.22) f*=2;                 // 偶发高八度，增加层次
    guqinNote(f, 3.6, 0.05);
    let gap=3200+Math.random()*4600;
    if(Math.random()<0.18) gap+=3200;            // 偶尔留白，呼吸感
    _guiTimer=setTimeout(tick, gap);
  };
  if(_guiTimer) clearTimeout(_guiTimer);
  _guiTimer=setTimeout(tick, 700);
}
function guqinAmbientStop(){
  if(_guiTimer){ clearTimeout(_guiTimer); _guiTimer=null; }
  const ctx=guqinCtx(); if(ctx&&_master){ try{ _master.gain.cancelScheduledValues(ctx.currentTime); _master.gain.setValueAtTime(_master.gain.value,ctx.currentTime); _master.gain.linearRampToValueAtTime(0,ctx.currentTime+0.8); }catch(e){} }
  stopDrone();
}
(function(){
  const st=document.getElementById('soundToggle');
  if(!st) return;
  const sync=()=>{
    st.classList.toggle('on',_guiOn);
    const tx=document.getElementById('soundToggleTxt'); if(tx) tx.textContent=_guiOn?'开':'关';
  };
  sync();
  st.onclick=()=>{
    _guiOn=!_guiOn;
    try{ localStorage.setItem('xuanji_guiyin',_guiOn?'1':'0'); }catch(e){}
    if(_guiOn){ guqinCtx(); guqinAmbientStart(); } else { guqinAmbientStop(); }
    sync();
  };
  if(_guiOn){ try{ guqinCtx(); guqinAmbientStart(); }catch(e){} }
  // 音效挂钩：切换 tab/分类 → 轻拨弦；点牌 → 翻牌；测算按钮 → 盖印
  document.querySelectorAll('.tab,.cat').forEach(el=>{ el.addEventListener('click',()=>sfx('switch')); });
  document.addEventListener('click',e=>{
    if(e.target.closest('.fan-card,.tcard')) sfx('flip');
  });
})();

/* ===================== 25. 节气彩蛋（按节气/节日换装：飘雪/月圆/春联/守岁） ===================== */
(function(){
  try{
    const pad=n=>(n<10?'0':'')+n;
    const JQ_ALIAS={'LI_CHUN':'立春','LI_QIU':'立秋','CHU_SHU':'处暑','BAI_LU':'白露','HAN_LU':'寒露','SHUANG_JIANG':'霜降',
      'LI_DONG':'立冬','XIAO_XUE':'小雪','DA_XUE':'大雪','XIAO_HAN':'小寒','DA_HAN':'大寒','YUSHUI':'雨水','JINGZHE':'惊蛰',
      'CHUNFEN':'春分','QINGMING':'清明','GUYU':'谷雨','LIXIA':'立夏','XIAOMAN':'小满','MANGZHONG':'芒种','XIAZHI':'夏至',
      'XIAOSHU':'小暑','DASHU':'大暑'};
    const l=Lunar.fromDate(new Date());
    const table=l.getJieQiTable();
    const today=l.getYear()+'-'+pad(l.getMonth())+'-'+pad(l.getDay());
    let jq='';
    Object.entries(table||{}).forEach(([k,v])=>{
      const p=v&&v._p; if(!p) return;
      const d=p.year+'-'+pad(p.month)+'-'+pad(p.day);
      if(d===today){ jq=JQ_ALIAS[k]||k.replace(/_/g,''); }
    });
    // 农历节日（手动判断更稳，不依赖库的节日表）
    const m=l.getMonth(), dy=l.getDay();
    if(m===1&&dy===1) jq='春节';
    if(m===5&&dy===5) jq='端午';
    if(m===8&&dy===15) jq='中秋';
    if(m===12&&dy===l.getDayCount()) jq='除夕';
    if(!jq) return;
    const body=document.body;
    const snowSet=['小雪','大雪','冬至','小寒','大寒'];
    if(snowSet.indexOf(jq)>=0){
      body.classList.add('jq-xue');
      const field=document.createElement('div'); field.className='snowfield';
      const reduce=(typeof window.matchMedia==='function'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      for(let i=0;i<14;i++){
        const s=document.createElement('span'); s.className='snow';
        const sz=(2.5+Math.random()*3.5).toFixed(1);
        s.style.cssText='left:'+(Math.random()*100).toFixed(1)+'%;width:'+sz+'px;height:'+sz+'px;'
          +(reduce?'':('animation-duration:'+(7+Math.random()*8).toFixed(1)+'s;animation-delay:-'+(Math.random()*12).toFixed(1)+'s;'));
        field.appendChild(s);
      }
      document.body.appendChild(field);
    } else if(jq==='中秋'){
      body.classList.add('jq-yue');
      const moon=document.createElement('div'); moon.className='jq-moon'; document.body.appendChild(moon);
    } else if(jq==='立春'||jq==='春节'){
      body.classList.add('jq-chun');
      const cl=document.createElement('div'); cl.className='couplet l'; cl.textContent='迎新春 江山锦绣';
      const cr=document.createElement('div'); cr.className='couplet r'; cr.textContent='辞旧岁 事泰辉煌';
      document.body.appendChild(cl); document.body.appendChild(cr);
    }
    if(jq==='除夕'||jq==='春节'){
      body.classList.add('jq-shou');
      [['l'],['r']].forEach(s=>{
        const ln=document.createElement('div'); ln.className='lantern '+s[0];
        ln.innerHTML='<div class="lbody"></div>'; document.body.appendChild(ln);
      });
    }
  }catch(e){ /* 节气库异常时静默跳过，不影响主功能 */ }
})();

/* ===== 动效精修 v3b：卡片活体光泽（指针跟随）+ 分类切换标签栏轻淡入 ===== */
(function(){
  const FINE = (typeof window.matchMedia==='function') && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const REDUCE = (typeof window.matchMedia==='function') && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 卡片随指针移动的柔光：玻璃被光照到的“活”质感（仅精确指针设备、且非 reduced-motion） */
  if(FINE && !REDUCE){
    document.querySelectorAll('.card').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
        card.style.setProperty('--my',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
      });
    });
  }

  /* 切换分类（命盘/占卜/趣味/工具）时，标签栏轻轻淡入，弱化“啪”地换一批的生硬 */
  const tabsEl=document.getElementById('tabs');
  if(tabsEl){
    document.querySelectorAll('.cat').forEach(cat=>{
      cat.addEventListener('click',()=>{
        tabsEl.classList.remove('catswap'); void tabsEl.offsetWidth; tabsEl.classList.add('catswap');
      });
    });
  }
})();

/* ===== 星图/命盘「先画框、再填字」：纯描边线稿徐徐画出，文字与填充随后淡入（顶层函数，供各测算回调调用） ===== */
function enhanceFrameInk(svg){
  if(!svg) return;
  if(typeof window.matchMedia==='function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let fi=0;
  svg.querySelectorAll('circle,line,path,polyline,polygon,rect,ellipse').forEach(el=>{
    if(el.classList.contains('sc-core')||el.classList.contains('dz-halo')) return;   // 自带脉冲/旋转，不参与描边
    const fill=(el.getAttribute('fill')||'').toLowerCase();
    const tag=(el.tagName||'').toLowerCase();
    if(fill!=='none' && tag!=='line' && tag!=='path') return;   // 仅取纯描边线稿作“框”
    try{ el.setAttribute('pathLength','1'); }catch(e){}
    el.classList.add('fx-draw');
    let _dur='.74';
    if(tag==='path'||tag==='polyline'||tag==='polygon') _dur='.98';
    else if(tag==='circle'||tag==='ellipse') _dur='.64';
    el.style.setProperty('--d',(Math.min(fi,18)*0.05).toFixed(3)+'s');
    el.style.setProperty('--dur',_dur+'s');
    fi++;
  });
  const inkStart=0.55+Math.min(fi,18)*0.05;   // 框描得差不多了，再落字
  let ki=0;
  const _ink=(el)=>{ if(el.classList.contains('sc-core')||el.classList.contains('dz-halo')||el.classList.contains('sc-ink')) return;
    el.classList.add('sc-ink'); el.style.setProperty('--d',(inkStart+Math.min(ki,20)*0.03).toFixed(3)+'s'); ki++; };
  svg.querySelectorAll('text').forEach(_ink);
  svg.querySelectorAll('[fill]:not([fill="none"])').forEach(_ink);
}

/* 八字专属编排：命盘逐宫落定 + 星图连线逐柱生长（仅八字调用，替换通用 enhanceFrameInk） */
function enhanceBazi(svg){
  if(!svg) return;
  if(typeof window.matchMedia==='function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const isStar = svg.classList.contains('sc-svg');
  // 1) 打底：描边线稿仍走 fx-draw（保留"先画框"与逐笔错落计数）
  let fi=0;
  svg.querySelectorAll('circle,line,path,polyline,polygon,rect,ellipse').forEach(el=>{
    if(el.classList.contains('sc-core')||el.classList.contains('dz-halo')) return;
    const fill=(el.getAttribute('fill')||'').toLowerCase();
    const tag=(el.tagName||'').toLowerCase();
    if(fill!=='none' && tag!=='line' && tag!=='path') return;
    try{ el.setAttribute('pathLength','1'); }catch(e){}
    el.classList.add('fx-draw');
    let _dur='.74';
    if(tag==='path'||tag==='polyline'||tag==='polygon') _dur='.98';
    else if(tag==='circle'||tag==='ellipse') _dur='.64';
    el.style.setProperty('--dur',_dur+'s');
    el.style.setProperty('--d',(Math.min(fi,18)*0.05).toFixed(3)+'s');
    fi++;
  });
  const inkStart=0.52+Math.min(fi,18)*0.05;
  let ki=0;
  const _ink=(el)=>{ if(el.classList.contains('sc-core')||el.classList.contains('dz-halo')||el.classList.contains('sc-ink')) return;
    el.classList.add('sc-ink'); el.style.setProperty('--d',(inkStart+Math.min(ki,20)*0.03).toFixed(3)+'s'); ki++; };
  svg.querySelectorAll('text').forEach(_ink);
  svg.querySelectorAll('[fill]:not([fill="none"])').forEach(_ink);

  if(isStar){
    // 星图：连线从日主逐柱生长（年→月→日→时，干先于支）——描边方向天然由中心指向星点
    const links=[...svg.querySelectorAll('line')].filter(l=>{
      const x1=parseFloat(l.getAttribute('x1')), y1=parseFloat(l.getAttribute('y1'));
      return Math.abs(x1-280)<1.5 && Math.abs(y1-232)<1.5;
    });
    links.forEach((l,i)=>{ l.style.setProperty('--d',(0.14+i*0.13).toFixed(3)+'s'); l.style.setProperty('--dur','.82s'); });
    // 十二地支环文字最早淡入（背景刻度，不抢戏）
    svg.querySelectorAll('.sc-zhi').forEach((t,i)=>{ t.classList.remove('sc-ink'); t.classList.add('sc-land'); t.style.setProperty('--d',(0.45+i*0.022).toFixed(3)+'s'); });
    // 四柱星点干支按柱序落定
    svg.querySelectorAll('.sc-gz').forEach((t,i)=>{ t.classList.remove('sc-ink'); t.classList.add('sc-land'); t.style.setProperty('--d',(0.95+i*0.13).toFixed(3)+'s'); });
    // 柱名（年/月/日/时）随该柱星点落定
    svg.querySelectorAll('.sc-pillar').forEach((t)=>{ const p=parseInt(t.getAttribute('data-pillar')||'0',10); t.classList.remove('sc-ink'); t.classList.add('sc-land'); t.style.setProperty('--d',(0.8+p*0.13).toFixed(3)+'s'); });
    // 日主大字与副文最后落定（压轴）
    svg.querySelectorAll('.sc-day').forEach(t=>{ t.classList.remove('sc-ink'); t.classList.add('sc-land'); t.style.setProperty('--d','2.2s'); });
    svg.querySelectorAll('.sc-day-sub').forEach(t=>{ t.classList.remove('sc-ink'); t.classList.add('sc-land'); t.style.setProperty('--d','2.35s'); });
  } else {
    // 命盘 bz-disc：逐宫落定（年→月→日→时）× 柱名→干→支→十神
    const arcs=[...svg.querySelectorAll('.dz-arc')];
    arcs.forEach((a,i)=>{ a.style.setProperty('--d',(0.75+0.13+i*0.13).toFixed(3)+'s'); a.style.setProperty('--dur','.95s'); });
    const txts=[...svg.querySelectorAll('.dz-lbl,.dz-col,.dz-ss')];
    txts.forEach((t,idx)=>{ const pillar=Math.floor(idx/4), rank=idx%4;
      t.classList.remove('sc-ink'); t.classList.add('sc-land');
      t.style.setProperty('--d',(1.5+pillar*0.34+rank*0.085).toFixed(3)+'s'); });
    // 中心日主落印：圆盘晕开 + 朱砂环 + 大字落定（压轴）
    const disc=svg.querySelector('.dz-cdisc'); if(disc){ disc.classList.remove('sc-ink'); disc.classList.add('dz-sealink'); disc.style.setProperty('--d','2.0s'); }
    const halo=svg.querySelector('.dz-halo'); if(halo){ halo.classList.add('dz-sealink'); halo.style.setProperty('--d','2.05s'); }
    svg.querySelectorAll('.dz-core,.dz-core-sub').forEach((t,i)=>{ t.classList.remove('sc-ink'); t.classList.add('sc-land'); t.style.setProperty('--d',(2.2+i*0.12).toFixed(3)+'s'); });
  }
}

/* ===================== 27. 批量姓名分析 / 姓名配对 / 择日 / 公司取名 ===================== */
function batchNameAnalysis() {
  const input = document.getElementById('batchNameInput').value.trim();
  if (!input) { alert('请输入姓名'); return; }
  const names = input.split(/[,，\s]+/).filter(n => n.length >= 2 && n.length <= 4).slice(0, 10);
  if (names.length === 0) { alert('请输入有效的姓名（2-4字）'); return; }

  let html = '<table style="width:100%;border-collapse:collapse;font-size:13px">';
  html += '<tr style="background:#f0f0f0"><th>姓名</th><th>天格</th><th>人格</th><th>地格</th><th>外格</th><th>总格</th><th>五行</th><th>三才</th><th>评分</th></tr>';

  names.forEach(name => {
    let tian, ren, di, wai, zong;
    if (name.length === 2) {
      tian = 2 + KX[name[0]];
      ren = KX[name[0]] + KX[name[1]];
      di = KX[name[1]] + 1;
      wai = tian + di - ren;
      zong = KX[name[0]] + KX[name[1]];
    } else if (name.length === 3) {
      tian = 2 + KX[name[0]];
      ren = KX[name[0]] + KX[name[1]];
      di = KX[name[1]] + KX[name[2]];
      wai = tian + di - ren;
      zong = KX[name[0]] + KX[name[1]] + KX[name[2]];
    } else {
      tian = 2 + KX[name[0]];
      ren = KX[name[0]] + KX[name[1]];
      di = KX[name[1]] + KX[name[2]];
      wai = KX[name[0]] + KX[name[3]];
      zong = KX[name[0]] + KX[name[1]] + KX[name[2]] + KX[name[3]];
    }

    const renWu = CHAR_WU[name[1]] || '土';
    const diWu = CHAR_WU[name[name.length-1]] || '土';
    const tianWu = CHAR_WU[name[0]] || '土';
    const sancai = tianWu + renWu + diWu;

    let score = 70;
    if (ren % 10 >= 3 && ren % 10 <= 7) score += 5;
    if (zong % 10 >= 3 && zong % 10 <= 7) score += 5;
    if (tian % 10 >= 3 && tian % 10 <= 7) score += 5;
    if (di % 10 >= 3 && di % 10 <= 7) score += 5;
    score = Math.min(score, 98);

    html += `<tr style="border-bottom:1px solid #eee">
      <td style="font-weight:bold;padding:4px">${name}</td>
      <td style="padding:4px">${tian}</td>
      <td style="padding:4px">${ren}</td>
      <td style="padding:4px">${di}</td>
      <td style="padding:4px">${wai}</td>
      <td style="padding:4px">${zong}</td>
      <td style="padding:4px;color:#007bff">${tianWu}${renWu}${diWu}</td>
      <td style="padding:4px">${sancai}</td>
      <td style="padding:4px;color:${score>=80?'#28a745':score>=60?'#ffc107':'#dc3545'};font-weight:bold">${score}</td>
    </tr>`;
  });

  html += '</table>';
  document.getElementById('batchNameResult').innerHTML = html;
}

function peiduiCalc() {
  const name1 = document.getElementById('peiduiName1').value.trim();
  const name2 = document.getElementById('peiduiName2').value.trim();
  if (!name1 || !name2) { alert('请输入双方姓名'); return; }

  function calcMetrics(name) {
    let tian, ren, di, wai, zong;
    if (name.length === 2) {
      tian = 2 + KX[name[0]];
      ren = KX[name[0]] + KX[name[1]];
      di = KX[name[1]] + 1;
      wai = tian + di - ren;
      zong = KX[name[0]] + KX[name[1]];
    } else if (name.length === 3) {
      tian = 2 + KX[name[0]];
      ren = KX[name[0]] + KX[name[1]];
      di = KX[name[1]] + KX[name[2]];
      wai = tian + di - ren;
      zong = KX[name[0]] + KX[name[1]] + KX[name[2]];
    } else {
      tian = 2 + KX[name[0]];
      ren = KX[name[0]] + KX[name[1]];
      di = KX[name[1]] + KX[name[2]];
      wai = KX[name[0]] + KX[name[3]];
      zong = KX[name[0]] + KX[name[1]] + KX[name[2]] + KX[name[3]];
    }
    return { tian, ren, di, wai, zong, renWu: CHAR_WU[name[1]] || '土', diWu: CHAR_WU[name[name.length-1]] || '土' };
  }

  const m1 = calcMetrics(name1);
  const m2 = calcMetrics(name2);

  let compatScore = 60;
  const wuMap = { '金': 1, '木': 2, '水': 3, '火': 4, '土': 5 };
  const wu1 = wuMap[m1.renWu];
  const wu2 = wuMap[m2.renWu];

  if (m1.renWu === m2.renWu) compatScore += 10;

  const sheng = { '金': '水', '水': '木', '木': '火', '火': '土', '土': '金' };
  if (sheng[m1.renWu] === m2.renWu || sheng[m2.renWu] === m1.renWu) compatScore += 15;

  const ke = { '金': '木', '木': '土', '土': '水', '水': '火', '火': '金' };
  if (ke[m1.renWu] === m2.renWu || ke[m2.renWu] === m1.renWu) compatScore -= 10;

  if (Math.abs(m1.ren - m2.ren) <= 5) compatScore += 5;
  if (Math.abs(m1.zong - m2.zong) <= 10) compatScore += 5;

  compatScore = Math.max(30, Math.min(95, compatScore));

  const level = compatScore >= 80 ? '天作之合' : compatScore >= 65 ? '良缘佳配' : compatScore >= 50 ? '普通姻缘' : '需要磨合';
  const levelColor = compatScore >= 80 ? '#dc3545' : compatScore >= 65 ? '#ffc107' : compatScore >= 50 ? '#17a2b8' : '#6c757d';

  let html = `<div style="text-align:center;margin:10px 0">
    <div style="font-size:36px;color:${levelColor};font-weight:bold">${compatScore}分</div>
    <div style="font-size:18px;color:${levelColor};margin:5px 0">${level}</div>
  </div>`;

  html += `<table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:10px">`;
  html += `<tr style="background:#f0f0f0"><th></th><th>${name1}</th><th>${name2}</th><th>对比</th></tr>`;
  html += `<tr><td>人格</td><td>${m1.ren}(${m1.renWu})</td><td>${m2.ren}(${m2.renWu})</td><td>${m1.renWu===m2.renWu?'同五行':(sheng[m1.renWu]===m2.renWu?'相生':'相克')}</td></tr>`;
  html += `<tr><td>地格</td><td>${m1.di}(${m1.diWu})</td><td>${m2.di}(${m2.diWu})</td><td>${m1.diWu===m2.diWu?'同五行':(sheng[m1.diWu]===m2.diWu?'相生':'相克')}</td></tr>`;
  html += `<tr><td>总格</td><td>${m1.zong}</td><td>${m2.zong}</td><td>${Math.abs(m1.zong-m2.zong)<=10?'相近':'差异大'}</td></tr>`;
  html += '</table>';

  document.getElementById('peiduiResult').innerHTML = html;
}

function zeriCalc() {
  const shixiang = document.getElementById('zeriShixiang').value;
  const bazi = document.getElementById('zeriBazi').value.trim();
  const sx = document.getElementById('zeriShengxiao').value;

  const now = new Date();
  let html = '<div style="margin-top:10px">';

  html += '<h4 style="color:#007bff">未来30天吉日推荐</h4>';
  html += '<table style="width:100%;border-collapse:collapse;font-size:13px">';
  html += '<tr style="background:#f0f0f0"><th>日期</th><th>干支</th><th>宜</th><th>忌</th><th>评级</th></tr>';

  const ganArr = '甲乙丙丁戊己庚辛壬癸'.split('');
  const zhiArr = '子丑寅卯辰巳午未申酉戌亥'.split('');

  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);

    const dayOffset = Math.floor(d.getTime() / 86400000);
    const gan = ganArr[(dayOffset + 4) % 10];
    const zhi = zhiArr[(dayOffset + 0) % 12];
    const dayPillar = gan + zhi;

    let clash = false;
    if (sx) {
      const clashMap = {'子':'午','丑':'未','寅':'申','卯':'酉','辰':'戌','巳':'亥','午':'子','未':'丑','申':'寅','酉':'卯','戌':'辰','亥':'巳'};
      if (clashMap[sx] === zhi) clash = true;
    }

    const yiArr = ['出行','嫁娶','开市','交易','祈福','动土','入宅','修造','栽种','牧养','破土','安葬','移徙','开光','解除','求嗣','竖柱','上梁','纳采','裁衣'];
    const jiArr = ['嫁娶','移徙','入宅','开市','出行','动土','安葬','破土'];

    let yi, ji;
    if (clash) {
      yi = '诸事不宜';
      ji = `冲${sx}日，${sx}肖不宜`;
    } else {
      const dayIdx = (dayOffset * 3) % yiArr.length;
      yi = yiArr.slice(dayIdx, dayIdx + 3).join('、');
      ji = jiArr[(dayOffset * 7) % jiArr.length];
    }

    const rating = clash ? '⚠️' : (dayOffset % 7 === 0 || dayOffset % 7 === 3) ? '★★★' : (dayOffset % 5 === 0) ? '★★' : '★';

    html += `<tr style="border-bottom:1px solid #eee">
      <td style="padding:4px">${d.getMonth()+1}/${d.getDate()} ${'日一二三四五六'[d.getDay()]}</td>
      <td style="padding:4px;color:#007bff">${dayPillar}</td>
      <td style="padding:4px;color:#28a745;font-size:12px">${yi}</td>
      <td style="padding:4px;color:#dc3545;font-size:12px">${ji}</td>
      <td style="padding:4px;text-align:center">${rating}</td>
    </tr>`;
  }

  html += '</table>';
  html += '<p style="color:#999;font-size:12px;margin-top:8px">* 以上为简化算法，仅供参考。重要事项建议咨询专业命理师。</p>';
  html += '</div>';

  document.getElementById('zeriResult').innerHTML = html;
}

function companyNameCalc() {
  const industry = document.getElementById('companyIndustry').value;
  const bazi = document.getElementById('companyBazi').value.trim();
  const namesInput = document.getElementById('companyNames').value.trim();

  const industryWu = { 'metal': '金', 'wood': '木', 'water': '水', 'fire': '火', 'earth': '土' };
  const indWu = industryWu[industry];

  const wuList = { '金': '钅金', '木': '木艹竹', '水': '水氵雨', '火': '火灬日', '土': '土山石' };

  let html = '<div style="margin-top:10px">';

  if (namesInput) {
    const names = namesInput.split(/[,，\s]+/).filter(n => n.length >= 2 && n.length <= 4);
    html += '<h4 style="color:#007bff">候选名分析</h4>';
    html += '<table style="width:100%;border-collapse:collapse;font-size:13px">';
    html += '<tr style="background:#f0f0f0"><th>名称</th><th>数理</th><th>五行</th><th>行业匹配</th><th>评分</th></tr>';

    names.forEach(name => {
      let total = 0;
      for (let i = 0; i < name.length; i++) total += KX[name[i]] || 10;

      const nameWu = CHAR_WU[name[0]] || '土';
      const match = nameWu === indWu ? '★★★' : (nameWu === {'金':'水','木':'火','水':'木','火':'土','土':'金'}[indWu]) ? '★★' : '★';

      let score = 70;
      if (total % 10 >= 3 && total % 10 <= 7) score += 10;
      if (nameWu === indWu) score += 10;
      score = Math.min(score, 98);

      html += `<tr style="border-bottom:1px solid #eee">
        <td style="font-weight:bold;padding:4px">${name}</td>
        <td style="padding:4px">${total}</td>
        <td style="padding:4px;color:#007bff">${nameWu}</td>
        <td style="padding:4px">${match}</td>
        <td style="padding:4px;color:${score>=80?'#28a745':'#ffc107'};font-weight:bold">${score}</td>
      </tr>`;
    });

    html += '</table>';
  } else {
    html += '<h4 style="color:#007bff">推荐用字（行业：' + indWu + '行）</h4>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">';

    const candidates = Object.keys(CHAR_WU).filter(c => CHAR_WU[c] === indWu && KX[c] >= 8 && KX[c] <= 20).slice(0, 30);
    candidates.forEach(c => {
      html += `<span style="background:#f8f9fa;border:1px solid #dee2e6;border-radius:4px;padding:4px 8px;font-size:13px">${c} (${KX[c]}画/${CHAR_WU[c]})</span>`;
    });

    html += '</div>';
    html += '<p style="color:#999;font-size:12px;margin-top:8px">* 以上为推荐用字，实际取名需结合法人八字综合分析。</p>';
  }

  html += '</div>';
  document.getElementById('companyResult').innerHTML = html;
}

/* ===================== 26. 国风分享卡导出（canvas 合成宣纸边框+印章+正文，一键存图） ===================== */
function _roundRect(x,X,Y,w,h,r){ x.beginPath(); x.moveTo(X+r,Y); x.arcTo(X+w,Y,X+w,Y+h,r); x.arcTo(X+w,Y+h,X,Y+h,r); x.arcTo(X,Y+h,X,Y,r); x.arcTo(X,Y,X+w,Y,r); x.closePath(); }
function shareCard(){
  const res=document.querySelector('.panel.show .result');
  const modal=document.getElementById('shareModal');
  const img=document.getElementById('shareImg');
  const tip=document.getElementById('shareTip');
  if(!modal||!img) return;
  if(!res){
    img.removeAttribute('src');
    tip.textContent='请先在某模块生成结果，再生成分享卡 · 玄机阁';
    modal.classList.add('open');
    return;
  }
  const titleEl=res.querySelector('h3')||res.querySelector('h2')||res.querySelector('h4');
  const title=(titleEl&&(titleEl.innerText||titleEl.textContent)||'').trim()||'玄机阁命理';
  const raw=((res.innerText||res.textContent||'')||'').replace(/\s+/g,' ').trim();
  const W=720,H=1040, c=document.createElement('canvas'); c.width=W; c.height=H;
  const x=c.getContext?c.getContext('2d'):null;
  if(!x){ tip.textContent='当前环境不支持生图，请用浏览器打开 · 玄机阁'; modal.classList.add('open'); return; }
  try{
    const g=x.createLinearGradient(0,0,W,H); g.addColorStop(0,'#f7f2ea'); g.addColorStop(1,'#ece4d6');
    x.fillStyle=g; x.fillRect(0,0,W,H);
    x.strokeStyle='#c9a45c'; x.lineWidth=3; x.strokeRect(24,24,W-48,H-48);
    x.lineWidth=1; x.strokeRect(34,34,W-68,H-68);
    x.textAlign='center'; x.fillStyle='#3f3a30'; x.font='700 40px "STKaiti","KaiTi","Songti SC",serif';
    x.fillText(title, W/2, 98);
    x.strokeStyle='rgba(201,164,92,.5)'; x.beginPath(); x.moveTo(W/2-130,118); x.lineTo(W/2+130,118); x.stroke();
    x.font='24px "STKaiti","KaiTi","Songti SC",serif'; x.fillStyle='#2b2620'; x.textAlign='left';
    const maxW=W-120, lh=40; let lines=[], cur='';
    for(const ch of raw){ const t=cur+ch; if(x.measureText(t).width>maxW && cur){ lines.push(cur); cur=t; } else cur=t; }
    if(cur) lines.push(cur);
    if(lines.length>24) lines=lines.slice(0,24).concat(['…（详见应用内完整解读）']);
    let y=172; lines.forEach(l=>{ x.fillText(l, 60, y); y+=lh; });
    x.fillStyle='#c24234'; _roundRect(x, W-116, H-112, 74, 74, 10); x.fill();
    x.fillStyle='#fbf7ee'; x.textAlign='center'; x.font='700 28px "STKaiti","KaiTi",serif';
    x.fillText('玄机', W-79, H-66); x.fillText('阁', W-79, H-30);
    x.fillStyle='#7a7361'; x.font='16px "STKaiti","KaiTi",serif'; x.textAlign='left';
    x.fillText('玄机阁 · 仅供娱乐参考', 60, H-44);
    img.src=c.toDataURL('image/png');
    tip.textContent='玄机阁 · 仅供娱乐参考';
  }catch(e){ tip.textContent='生成图片失败，请用现代浏览器打开 · 玄机阁'; }
  modal.classList.add('open');
}
(function(){
  const fab=document.getElementById('shareFab'); if(fab) fab.onclick=shareCard;
  const sc=document.getElementById('shareClose'); if(sc) sc.onclick=()=>{ const m=document.getElementById('shareModal'); if(m) m.classList.remove('open'); };
  const sv=document.getElementById('shareSave'); if(sv) sv.onclick=()=>{ const im=document.getElementById('shareImg'); if(im&&im.src){ const a=document.createElement('a'); a.download='玄机阁-分享卡.png'; a.href=im.src; document.body.appendChild(a); a.click(); a.remove(); } };
  const m=document.getElementById('shareModal'); if(m) m.onclick=e=>{ if(e.target===m) m.classList.remove('open'); };
})();
