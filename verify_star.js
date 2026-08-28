const fs=require('fs'),path=require('path');
const {JSDOM}=require('C:/Users/42134/.workbuddy/binaries/node/workspace/node_modules/jsdom');
const html=fs.readFileSync(path.join(__dirname,'fortune.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost/'});
const {window}=dom, doc=window.document;
const errs=[];
window.addEventListener('error',e=>errs.push(String(e.error&&e.error.stack||e.message)));
setTimeout(()=>{
  const click=id=>{const b=doc.getElementById(id); if(b) b.dispatchEvent(new window.Event('click'));};
  click('baziBtn'); click('ziweiBtn');
  setTimeout(()=>{
    const bz=doc.getElementById('baziResult');
    const zw=doc.getElementById('ziweiResult');
    const sc=bz.querySelector('.starchart');
    const svg=bz.querySelector('.sc-svg');
    console.log('=== 八字 · 命格星图 ===');
    console.log('容器 .starchart:', !!sc);
    console.log('SVG .sc-svg:', !!svg, svg?('viewBox='+svg.getAttribute('viewBox')):'');
    if(svg){
      console.log('  星尘点:', svg.querySelectorAll('.sc-dust circle').length);
      console.log('  连线 line:', svg.querySelectorAll('line').length);
      console.log('  圆形总数:', svg.querySelectorAll('circle').length);
      console.log('  文字总数:', svg.querySelectorAll('text').length);
      console.log('  中心辉光 .sc-core:', !!svg.querySelector('.sc-core'));
      console.log('  被通用自绘污染(应为0):', svg.querySelectorAll('.fx-draw').length);
    }
    const seal=bz.querySelector('.sc-seal'), vd=bz.querySelector('.sc-verdict');
    console.log('  印签:', seal?seal.textContent.trim():'无');
    console.log('  判词:', vd?vd.textContent.trim().slice(0,110)+'…':'无');
    console.log('  图例项:', bz.querySelectorAll('.sc-legend span').length);

    console.log('\n=== 紫微 · 十二宫星盘 ===');
    const zsc=zw.querySelector('.starchart'), zsvg=zw.querySelector('.sc-svg');
    console.log('容器 .starchart:', !!zsc);
    console.log('SVG .sc-svg:', !!zsvg, zsvg?('viewBox='+zsvg.getAttribute('viewBox')):'');
    if(zsvg){
      console.log('  扇区 path:', zsvg.querySelectorAll('path').length);
      console.log('  线条 line:', zsvg.querySelectorAll('line').length, '(12分隔 + 4三方四正 = 16)');
      console.log('  文字总数:', zsvg.querySelectorAll('text').length);
      console.log('  被通用自绘污染(应为0):', zsvg.querySelectorAll('.fx-draw').length);
    }
    const zseal=zw.querySelector('.sc-seal');
    console.log('  印签:', zseal?zseal.textContent.trim():'无');
    console.log('  判词:', zw.querySelector('.sc-verdict')?zw.querySelector('.sc-verdict').textContent.trim().slice(0,80)+'…':'无');

    console.log('\n=== 其它图表仍有自绘 ===');
    console.log('八字内 fx-draw 总数:', bz.querySelectorAll('.fx-draw').length);
    console.log('\n运行时错误:', errs.length);
    errs.slice(0,5).forEach(e=>console.log(' - '+e.slice(0,300)));
  },900);
},1600);
