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

let links=load('ls-links')||[];
function shortenLink(){
  const url=document.getElementById('ls-url').value.trim();
  if(!url||(!url.startsWith('http'))){toast('⚠ Enter a valid URL starting with http(s)://');return;}
  const alias=document.getElementById('ls-alias').value.trim()||Math.random().toString(36).slice(2,8);
  const short='https://dvos.io/'+alias;
  links.unshift({id:Date.now(),original:url,short,alias,clicks:0,created:new Date().toLocaleDateString()});
  links=links.slice(0,20);save('ls-links',links);
  document.getElementById('ls-result').style.display='block';
  document.getElementById('ls-short').textContent=short;
  document.getElementById('ls-url').value='';document.getElementById('ls-alias').value='';
  renderLinks();toast('✅ Link shortened!');
}
function copyShort(){copyText(document.getElementById('ls-short').textContent,'Short URL copied!');}
function shareShort(){if(navigator.share)navigator.share({url:document.getElementById('ls-short').textContent}).catch(()=>{});else copyShort();}
function renderLinks(){
  const el=document.getElementById('ls-hist');
  if(!links.length){el.innerHTML='<div class="empty"><div class="empty-icon">🔗</div><p>No links yet</p></div>';return;}
  el.innerHTML=links.map((l,i)=>`<div class="card2" style="margin-bottom:8px">
    <div class="row between align">
      <div style="flex:1;overflow:hidden;margin-right:10px">
        <div style="font-size:13px;font-weight:600;color:var(--accent);font-family:'JetBrains Mono',monospace">${l.short}</div>
        <div style="font-size:11px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px">${l.original}</div>
      </div>
      <div class="row" style="gap:6px;flex-shrink:0">
        <span class="badge">${l.clicks} clicks</span>
        <button onclick="links[${i}].clicks++;save('ls-links',links);renderLinks()" class="btn btn-xs btn-outline">Open</button>
        <button onclick="links.splice(${i},1);save('ls-links',links);renderLinks()" class="btn btn-xs btn-danger">✕</button>
      </div>
    </div>
    <div style="font-size:10px;color:var(--dim);margin-top:6px;font-family:'JetBrains Mono',monospace">${l.created}</div>
  </div>`).join('');
}
renderLinks();
