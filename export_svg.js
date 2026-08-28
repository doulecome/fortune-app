const fs=require('fs'),path=require('path');
const {JSDOM}=require('C:/Users/42134/.workbuddy/binaries/node/workspace/node_modules/jsdom');
const html=fs.readFileSync(path.join(__dirname,'fortune.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost/'});
const {window}=dom, doc=window.document;
setTimeout(()=>{
  const click=id=>{const b=doc.getElementById(id); if(b) b.dispatchEvent(new window.Event('click'));};
  click('baziBtn'); click('ziweiBtn');
  setTimeout(()=>{
    const bz=doc.getElementById('baziResult'), zw=doc.getElementById('ziweiResult');
    const out={
      baziSvg: bz.querySelector('.sc-svg') ? bz.querySelector('.sc-svg').outerHTML : '',
      baziSeal: bz.querySelector('.sc-seal') ? bz.querySelector('.sc-seal').textContent.trim() : '',
      baziVerdict: bz.querySelector('.sc-verdict') ? bz.querySelector('.sc-verdict').innerHTML : '',
      zwSvg: zw.querySelector('.sc-svg') ? zw.querySelector('.sc-svg').outerHTML : '',
      zwSeal: zw.querySelector('.sc-seal') ? zw.querySelector('.sc-seal').textContent.trim() : ''
    };
    fs.writeFileSync(path.join(__dirname,'_svg_export.json'), JSON.stringify(out), 'utf8');
    console.log('bazi svg bytes:', out.baziSvg.length);
    console.log('zw svg bytes:', out.zwSvg.length);
    console.log('seal:', out.baziSeal, '|', out.zwSeal);
  },900);
},1600);
