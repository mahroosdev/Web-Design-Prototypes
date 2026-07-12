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

const skills=[['HTML/CSS',95,'var(--accent)'],['JavaScript',90,'var(--accent2)'],['React',82,'var(--accent3)'],['TypeScript',75,'var(--accent5)'],['Node.js',65,'var(--accent4)'],['UI/UX Design',88,'var(--accent)']];
document.getElementById('skills-wrap').innerHTML=skills.map(([s,p,c])=>`<div style="margin-bottom:12px"><div class="row between" style="margin-bottom:5px"><span style="font-size:13px;font-weight:600">${s}</span><span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:${c}">${p}%</span></div><div class="progress-bar"><div class="progress-fill" style="width:0;background:${c}" data-target="${p}"></div></div></div>`).join('');
setTimeout(()=>{document.querySelectorAll('[data-target]').forEach(el=>{el.style.width=el.dataset.target+'%';});},400);
