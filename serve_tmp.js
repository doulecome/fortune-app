const http=require('http'),fs=require('fs'),path=require('path');
const root=path.join(__dirname,'deploy');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split('?')[0]); if(p==='/')p='/index.html';
  const f=path.join(root,p);
  if(!f.startsWith(root)||!fs.existsSync(f)){res.statusCode=404;res.end('nf');return;}
  res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');
  fs.createReadStream(f).pipe(res);
}).listen(8931,()=>console.log('UP'));
