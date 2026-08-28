function fmod2pi(x){ return x-Math.floor(x/360)*360; }
function toRad(d){ return d*Math.PI/180; }
function toDeg(r){ return r*180/Math.PI; }
function gregJD(y,mo,d,hh){
  var aaa=Math.floor((14-mo)/12), y2=y+4800-aaa, m2=mo+12*aaa-3;
  var jdn=d+Math.floor((153*m2+2)/5)+365*y2+Math.floor(y2/4)-Math.floor(y2/100)+Math.floor(y2/400)-32045;
  return jdn-0.5+hh/24;
}
function sunLon(jd0){
  var d=jd0-2451543.5+0.0053;
  var w=282.9404+4.70935E-5*d;
  var e=0.016709-1.151E-9*d;
  var M=toRad(356.0470+0.9856002585*d);
  var E=M+e*Math.sin(M)*(1+e*Math.cos(M));
  var xv=Math.cos(E)-e;
  var yv=Math.sqrt(1-e*e)*Math.sin(E);
  var v=toDeg(Math.atan2(yv,xv));
  var lon=toDeg(Math.atan2(Math.sin(toRad(v+w)),Math.cos(toRad(v+w))));
  return fmod2pi(lon);
}
function moonLon(jd0){
  var d=jd0-2451543.5;
  var N=toRad(125.1228-0.0529538083*d);
  var i=5.1454;
  var w=toRad(318.0634+0.1643573223*d);
  var a=60.2666;
  var e=0.0549;
  var M=toRad(115.3654+13.0649929509*d);
  var E=M+e*Math.sin(M)*(1+e*Math.cos(M));
  var xv=a*(Math.cos(E)-e);
  var yv=a*(Math.sqrt(1-e*e)*Math.sin(E));
  var v=toDeg(Math.atan2(yv,xv));
  var r=Math.sqrt(xv*xv+yv*yv);
  var xh=r*(Math.cos(N)*Math.cos(toRad(v+w))-Math.sin(N)*Math.sin(toRad(v+w))*Math.cos(i));
  var yh=r*(Math.sin(N)*Math.cos(toRad(v+w))+Math.cos(N)*Math.sin(toRad(v+w))*Math.cos(i));
  var zh=r*(Math.sin(toRad(v+w))*Math.sin(i));
  var lon=toDeg(Math.atan2(yh,xh));
  var lat=toDeg(Math.atan2(zh,Math.sqrt(xh*xh+yh*yh)));
  return fmod2pi(lon);
}
for(var yy of [1990,1995,2000,2010,2026]){
  var j=gregJD(yy,6,15,12);
  console.log(yy+' 06-15 12:00  JD='+j.toFixed(2)+'  太阳='+sunLon(j).toFixed(1)+'°  月亮='+moonLon(j).toFixed(1)+'°');
}
/* 参考核验：2000-06-16 太阳应接近双子座尾部/巨蟹座头（约95°附近） */
console.log('2000-06-21 太阳=',sunLon(gregJD(2000,6,21,12)).toFixed(1)+'°（夏至应≈90°巨蟹0°）');
