// ── SHARED UTILITIES ──────────────────────────────────────────
let _toastT;
function toast(msg,dur=2400,type=''){
  const el=document.getElementById('toast');
  el.textContent=msg;
  el.className='show';
  clearTimeout(_toastT);
  _toastT=setTimeout(()=>el.className='',dur);
}
function toggleTheme(){
  const light=document.documentElement.dataset.theme==='light';
  document.documentElement.dataset.theme=light?'dark':'light';
  document.getElementById('theme-btn').textContent=light?'🌙':'☀️';
  localStorage.setItem('devos-theme',light?'dark':'light');
}
(function initTheme(){
  const t=localStorage.getItem('devos-theme')||'dark';
  if(t==='light'){document.documentElement.dataset.theme='light';document.getElementById('theme-btn').textContent='☀️';}
})();
function save(key,val){try{localStorage.setItem('devos-'+key,JSON.stringify(val));}catch(e){}}
function load(key,def=null){try{const v=localStorage.getItem('devos-'+key);return v!==null?JSON.parse(v):def;}catch(e){return def;}}
function animateIn(selector){document.querySelectorAll(selector).forEach((el,i)=>{el.style.opacity='0';el.style.transform='translateY(14px)';setTimeout(()=>{el.style.transition='opacity .4s ease,transform .4s ease';el.style.opacity='1';el.style.transform='none';},i*60);});}
function copyText(text,msg='Copied!'){navigator.clipboard?.writeText(text).then(()=>toast('✅ '+msg)).catch(()=>toast('⚠ Copy failed'));}
function formatNum(n){return n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e3?(n/1e3).toFixed(1)+'K':String(n);}
function formatDate(d){return new Date(d).toLocaleDateString('en',{month:'short',day:'numeric',year:'numeric'});}
function debounce(fn,ms=300){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms);};}

// ── CALCULATOR CORE ──
let expr='',mem=0,sci=false,ans=0;
const STD=[
  ['C','±','%','÷'],
  ['7','8','9','×'],
  ['4','5','6','−'],
  ['1','2','3','+'],
  ['MC','MR','MS','='],
  ['0','.','ANS','⌫']
];
const SCI=[
  ['sin','cos','tan','log','ln','e'],
  ['x²','x³','√','∛','xʸ','1/x'],
  ['π','(',')',',','EXP','!'],
  ['C','±','%','÷','×'],
  ['7','8','9','−','+'],
  ['4','5','6','=','⌫'],
  ['1','2','3','0','.']
];
const BTN_STYLE = {
  fn:'background:var(--card3);color:var(--muted)',
  op:'background:rgba(124,111,255,.15);color:var(--accent2)',
  eq:'background:linear-gradient(135deg,var(--accent),var(--accent2));color:#000;font-weight:700',
  num:'background:var(--card2);color:var(--text)',
  mem:'background:rgba(0,255,179,.08);color:var(--accent3)',
  del:'background:rgba(255,77,141,.08);color:var(--accent4)'
};
function btnStyle(k){
  if(['='].includes(k))return BTN_STYLE.eq;
  if(['÷','×','−','+','xʸ'].includes(k))return BTN_STYLE.op;
  if(['C','±','%','sin','cos','tan','log','ln','√','∛','x²','x³','1/x','EXP','!','π','e'].includes(k))return BTN_STYLE.fn;
  if(['MC','MR','MS'].includes(k))return BTN_STYLE.mem;
  if(k==='⌫')return BTN_STYLE.del;
  return BTN_STYLE.num;
}
function makeBtn(k){
  const b=document.createElement('button');
  b.textContent=k;
  b.style.cssText=`${btnStyle(k)};padding:16px 8px;border:none;font-size:${sci?12:16}px;font-family:'Syne',sans-serif;cursor:pointer;transition:opacity .1s,transform .1s;touch-action:manipulation;-webkit-tap-highlight-color:transparent;min-height:${sci?44:52}px`;
  b.addEventListener('pointerdown',()=>{b.style.opacity='.6';b.style.transform='scale(.93)'});
  b.addEventListener('pointerup',()=>{b.style.opacity='1';b.style.transform='scale(1)';calcBtn(k)});
  b.addEventListener('pointerleave',()=>{b.style.opacity='1';b.style.transform='scale(1)'});
  return b;
}
function buildPad(){
  const sp=document.getElementById('calc-std-pad');const xp=document.getElementById('calc-sci-pad');
  sp.innerHTML='';xp.innerHTML='';
  STD.flat().forEach(k=>sp.appendChild(makeBtn(k)));
  SCI.flat().forEach(k=>xp.appendChild(makeBtn(k)));
}
function setMode(m){
  sci=m==='sci';
  document.getElementById('calc-std-pad').style.display=sci?'none':'grid';
  document.getElementById('calc-sci-pad').style.display=sci?'grid':'none';
  document.getElementById('mode-std').style.background=sci?'transparent':'rgba(0,229,255,.08)';
  document.getElementById('mode-std').style.color=sci?'var(--muted)':'var(--accent)';
  document.getElementById('mode-sci').style.background=sci?'rgba(0,229,255,.08)':'transparent';
  document.getElementById('mode-sci').style.color=sci?'var(--accent)':'var(--muted)';
  document.getElementById('calc-mode-label').textContent=sci?'SCIENTIFIC MODE':'STANDARD MODE';
  save('calc-mode',m);
  buildPad();
}
let history=load('calc-history')||[];
function calcBtn(k){
  const d=document.getElementById('calc-disp');
  const h=document.getElementById('calc-hist');
  // Memory
  if(k==='MC'){mem=0;document.getElementById('calc-mem').textContent='';toast('Memory cleared');return}
  if(k==='MR'){expr=String(mem);d.textContent=mem;return}
  if(k==='MS'){try{mem=eval(expr.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-'));document.getElementById('calc-mem').textContent='M='+mem;toast('Saved to memory');}catch{}return}
  if(k==='ANS'){expr+=String(ans);d.textContent=expr;return}
  if(k==='C'){expr='';d.textContent='0';h.textContent='';return}
  if(k==='⌫'){expr=expr.slice(0,-1);d.textContent=expr||'0';return}
  if(k==='±'){try{const v=eval(expr.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-'));expr=String(-v);d.textContent=expr;}catch{}return}
  if(k==='%'){try{const v=eval(expr.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-'));expr=String(v/100);d.textContent=expr;}catch{}return}
  // Scientific
  const sciMap={sin:'Math.sin(',cos:'Math.cos(',tan:'Math.tan(',log:'Math.log10(',ln:'Math.log(',sqrt:'Math.sqrt(','√':'Math.sqrt(',ln:'Math.log(',};
  if(k==='sin'||k==='cos'||k==='tan'||k==='log'||k==='ln'){expr+=sciMap[k];d.textContent=expr;return}
  if(k==='√'){expr='Math.sqrt('+expr+')';try{const r=parseFloat(eval(expr).toFixed(10));_addHistory(expr,r);expr=String(r);d.textContent=r;}catch{d.textContent='Error';expr='';}return}
  if(k==='∛'){try{const v=eval(expr.replace(/×/g,'*').replace(/÷/g,'/'));const r=parseFloat(Math.cbrt(v).toFixed(10));_addHistory(expr+'∛',r);expr=String(r);d.textContent=r;}catch{d.textContent='Error';expr='';}return}
  if(k==='x²'){try{const v=eval(expr.replace(/×/g,'*').replace(/÷/g,'/'));const r=v*v;_addHistory(expr+'²',r);expr=String(r);d.textContent=r;}catch{}return}
  if(k==='x³'){try{const v=eval(expr.replace(/×/g,'*').replace(/÷/g,'/'));const r=v*v*v;_addHistory(expr+'³',r);expr=String(r);d.textContent=r;}catch{}return}
  if(k==='1/x'){try{const v=eval(expr.replace(/×/g,'*').replace(/÷/g,'/'));const r=1/v;_addHistory('1/('+expr+')',r);expr=String(r);d.textContent=r;}catch{}return}
  if(k==='xʸ'){expr+='**';d.textContent=expr;return}
  if(k==='π'){expr+=Math.PI;d.textContent=expr;return}
  if(k==='e'){expr+=Math.E;d.textContent=expr;return}
  if(k==='!'){try{const v=parseInt(expr);let f=1;for(let i=2;i<=v;i++)f*=i;_addHistory(expr+'!',f);expr=String(f);d.textContent=f;}catch{}return}
  if(k==='EXP'){expr+='e';d.textContent=expr;return}
  if(k==='='){
    try{
      let raw=expr.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
      // close unclosed parens
      const opens=(raw.match(/\(/g)||[]).length-(raw.match(/\)/g)||[]).length;
      raw+=')'.repeat(Math.max(0,opens));
      let result=Function('"use strict";return('+raw+')')();
      result=parseFloat(result.toFixed(10));
      if(!isFinite(result)){d.textContent='Error';h.textContent='';expr='';return}
      _addHistory(expr,result);
      h.textContent=expr+'=';
      ans=result;expr=String(result);d.textContent=result;
      d.style.color='var(--accent3)';
      setTimeout(()=>d.style.color='var(--accent)',600);
    }catch{d.textContent='Error';h.textContent='';expr='';}
    return;
  }
  // Append
  const charMap={'÷':'/','×':'*','−':'-'};
  expr+=(charMap[k]||k);
  try{let r=Function('"use strict";return('+expr.replace(/[+\-×÷*]$/,'')+')')();d.textContent=parseFloat(r.toFixed(10));}catch{d.textContent=expr;}
}
function _addHistory(ex,res){
  history.unshift({expr:ex,result:res,time:new Date().toLocaleTimeString()});
  history=history.slice(0,20);
  save('calc-history',history);
  renderHistory();
}
function renderHistory(){
  const el=document.getElementById('calc-history-list');
  if(!history.length){el.innerHTML='<div class="empty"><div class="empty-icon">📋</div><p>No calculations yet</p></div>';return}
  el.innerHTML=history.map((h,i)=>`<div class="card2" style="margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;cursor:pointer" onclick="expr='${h.result}';document.getElementById('calc-disp').textContent='${h.result}'">
    <div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted)">${h.expr} =</div>
      <div style="font-size:16px;font-weight:700;color:var(--accent)">${h.result}</div>
    </div>
    <div style="font-size:10px;color:var(--dim)">${h.time}</div>
  </div>`).join('');
}
// Keyboard
document.addEventListener('keydown',e=>{
  const map={Enter:'=',Backspace:'⌫',Escape:'C','/'  :'÷','*':'×','-':'−'};
  const k=map[e.key]||e.key;
  if('0123456789.+÷×−=C%⌫()'.includes(k))calcBtn(k);
});
// Init
buildPad();
setMode(load('calc-mode')||'std');
renderHistory();
