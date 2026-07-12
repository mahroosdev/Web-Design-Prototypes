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

let stats=load('rps-stats')||{w:0,d:0,l:0,streak:0,best:0};
let history=load('rps-history')||[];
let vsMode='cpu';
const beats={'✊':'✌️','✋':'✊','✌️':'✋'};
const moves=['✊','✋','✌️'];
const names={'✊':'Rock','✋':'Paper','✌️':'Scissors'};
function play(p){
  const c=vsMode==='cpu'?moves[Math.floor(Math.random()*3)]:null;
  const pp=document.getElementById('p-pick'),cp=document.getElementById('c-pick');
  pp.style.transform='scale(1.2)';cp.style.transform='scale(1.2)';
  pp.textContent='⏳';cp.textContent=c?'⏳':'⏳';
  setTimeout(()=>{
    pp.textContent=p;cp.textContent=c||'?';
    pp.style.transform='scale(1)';cp.style.transform='scale(1)';
    if(!c){toast('Player 2: choose your move!');return;}
    let msg,col;
    if(p===c){msg='🤝 DRAW';col='var(--muted)';stats.d++;stats.streak=0;}
    else if(beats[p]===c){msg='🎉 WIN!';col='var(--accent3)';stats.w++;stats.streak++;if(stats.streak>stats.best)stats.best=stats.streak;}
    else{msg='💀 LOSS';col='var(--accent4)';stats.l++;stats.streak=0;}
    const r=document.getElementById('rps-res');r.textContent=msg;r.style.color=col;
    document.getElementById('sc-w').textContent=stats.w;document.getElementById('sc-d').textContent=stats.d;document.getElementById('sc-l').textContent=stats.l;document.getElementById('sc-s').textContent=stats.best;document.getElementById('cur-streak').textContent=stats.streak;
    history.unshift({you:p,cpu:c,result:msg,time:new Date().toLocaleTimeString()});history=history.slice(0,20);
    save('rps-stats',stats);save('rps-history',history);renderHistory();
  },500);
}
function renderHistory(){
  const el=document.getElementById('rps-hist');
  if(!history.length){el.innerHTML='<div class="empty"><div class="empty-icon">🎮</div><p>No matches yet</p></div>';return;}
  el.innerHTML=history.slice(0,10).map(h=>`<div class="card2" style="margin-bottom:6px;display:flex;justify-content:space-between;align-items:center"><span style="font-size:22px">${h.you}</span><span style="font-size:12px;font-weight:700;color:${h.result.includes('WIN')?'var(--accent3)':h.result.includes('LOSS')?'var(--accent4)':'var(--muted)'}">${h.result}</span><span style="font-size:22px">${h.cpu}</span><span style="font-size:10px;color:var(--dim);font-family:'JetBrains Mono',monospace">${h.time}</span></div>`).join('');
}
function resetGame(){stats={w:0,d:0,l:0,streak:0,best:0};history=[];save('rps-stats',stats);save('rps-history',history);document.getElementById('sc-w').textContent=0;document.getElementById('sc-d').textContent=0;document.getElementById('sc-l').textContent=0;document.getElementById('sc-s').textContent=0;document.getElementById('cur-streak').textContent=0;document.getElementById('rps-res').textContent='';document.getElementById('p-pick').textContent='❓';document.getElementById('c-pick').textContent='❓';renderHistory();toast('Stats reset');}
function toggleMode(){vsMode=vsMode==='cpu'?'2p':'cpu';document.getElementById('mode-btn').textContent='Mode: '+(vsMode==='cpu'?'vs CPU':'2 Player');toast('Mode: '+(vsMode==='cpu'?'vs CPU':'2 Player'));}
// restore stats
document.getElementById('sc-w').textContent=stats.w;document.getElementById('sc-d').textContent=stats.d;document.getElementById('sc-l').textContent=stats.l;document.getElementById('sc-s').textContent=stats.best;
renderHistory();
