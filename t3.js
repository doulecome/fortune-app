const fs=require('fs');
const src=fs.readFileSync('app.js','utf8');
/* 抽取 gregorianToJD 已有函数确认 */
console.log('app.js 已有 gregorianToJD:', /function gregorianToJD/.test(src));
console.log('app.js 已有 moonSign:', /function moonSign/.test(src));
console.log('app.js 已有 sunLon/planetLon/aspects:', /sunLon/.test(src), /planetLon/.test(src), /ASPECTS/.test(src));
