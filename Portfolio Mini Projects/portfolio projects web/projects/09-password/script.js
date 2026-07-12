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

let vault=load('pw-vault')||[];
const STRENGTH=['Very Weak','Weak','Fair','Strong','Very Strong','Uncrackable'];
const S_COLORS=['#ef4444','#f97316','#eab308','#22c55e','#00e0ff','var(--accent2)'];
const CRACK_T=['Instantly','Minutes','Hours','Years','Centuries','Heat death of universe'];
function genPw(){
  let chars='';
  const up=document.getElementById('pw-up').checked;
  const lo=document.getElementById('pw-lo').checked;
  const nu=document.getElementById('pw-nu').checked;
  const sy=document.getElementById('pw-sy').checked;
  const am=document.getElementById('pw-am').checked;
  const pr=document.getElementById('pw-pr').checked;
  if(up)chars+='ABCDEFGHJKLMNPQRSTUVWXYZ'+(am?'IO':'');
  if(lo)chars+='abcdefghjkmnpqrstuvwxyz'+(am?'il':'');
  if(nu)chars+='23456789'+(am?'01':'');
  if(sy)chars+='!@#$%^&*()-_=+[]{}|;:,.?';
  if(!chars){toast('⚠ Select at least one character type');return;}
  const len=parseInt(document.getElementById('pw-len').value);
  let pw='';
  if(pr){const cons='bcdfghjklmnpqrstvwxyz';const vow='aeiou';for(let i=0;i<len;i++)pw+=i%2===0?cons[Math.floor(Math.random()*cons.length)]:vow[Math.floor(Math.random()*vow.length)];}
  else{for(let i=0;i<len;i++)pw+=chars[Math.floor(Math.random()*chars.length)];}
  document.getElementById('pw-text').textContent=pw;
  // Entropy & strength
  const entropy=Math.log2(Math.pow(chars.length||52,len));
  const score=Math.min(5,Math.floor(entropy/30));
  document.getElementById('pw-sbar').style.width=((score+1)/6*100)+'%';
  document.getElementById('pw-sbar').style.background=S_COLORS[score];
  document.getElementById('pw-strength-label').textContent=STRENGTH[score];
  document.getElementById('pw-strength-label').style.color=S_COLORS[score];
  document.getElementById('pw-entropy').textContent=entropy.toFixed(0);
  document.getElementById('pw-crack').textContent=CRACK_T[score];
}
function copyPw(){const t=document.getElementById('pw-text').textContent;if(t==='Click Generate')return;copyText(t,'Password copied!');}
function refreshPw(){genPw();}
function saveToVault(){
  const pw=document.getElementById('pw-text').textContent;if(pw==='Click Generate'){toast('⚠ Generate a password first');return;}
  const label=prompt('Label for this password:','My Account');if(!label)return;
  vault.unshift({id:Date.now(),label,pw,created:new Date().toLocaleDateString()});
  save('pw-vault',vault);renderVault();toast('🔒 Saved to vault!');}
function renderVault(){
  const el=document.getElementById('pw-vault');
  if(!vault.length){el.innerHTML='<div class="empty"><div class="empty-icon">🔒</div><p>No saved passwords yet</p></div>';return;}
  el.innerHTML=vault.map((v,i)=>`<div class="card2" style="margin-bottom:8px">
    <div class="row between align">
      <div><div style="font-size:13px;font-weight:600">${v.label}</div><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--muted);margin-top:2px">${'•'.repeat(Math.min(v.pw.length,20))}</div></div>
      <div class="row" style="gap:6px">
        <button onclick="copyText('${v.pw}','Password copied!')" class="btn btn-xs btn-outline">📋</button>
        <button onclick="vault.splice(${i},1);save('pw-vault',vault);renderVault()" class="btn btn-xs btn-danger">✕</button>
      </div>
    </div>
    <div style="font-size:10px;color:var(--dim);margin-top:6px;font-family:'JetBrains Mono',monospace">${v.created}</div>
  </div>`).join('');
}
genPw();renderVault();
