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

// ── STOPWATCH ──
let swMs=0,swLapMs=0,swRun=false,swInt=null,swLaps=[];
const fmt=ms=>{const m=Math.floor(ms/60000);const s=Math.floor((ms%60000)/1000);const c=Math.floor((ms%1000)/10);return`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(c).padStart(2,'0')}`;};
function swToggle(){swRun=!swRun;document.getElementById('sw-start').textContent=swRun?'Pause':'Resume';document.getElementById('sw-start').className=swRun?'btn btn-danger':'btn btn-primary';if(swRun)swInt=setInterval(()=>{swMs+=10;const lap=swMs-swLapMs;document.getElementById('sw-disp').textContent=fmt(swMs);document.getElementById('sw-lap-disp').textContent='LAP '+fmt(lap);const p=((swMs%60000)/60000);document.getElementById('sw-ring').style.strokeDashoffset=553-(553*p);},10);else clearInterval(swInt);}
function swLap(){if(!swRun)return;const lap=swMs-swLapMs;swLapMs=swMs;swLaps.unshift({n:swLaps.length+1,t:lap,total:swMs});renderLaps();}
function swReset(){clearInterval(swInt);swRun=false;swMs=0;swLapMs=0;swLaps=[];document.getElementById('sw-disp').textContent='00:00.00';document.getElementById('sw-lap-disp').textContent='LAP 00:00.00';document.getElementById('sw-ring').style.strokeDashoffset=553;document.getElementById('sw-start').textContent='Start';document.getElementById('sw-start').className='btn btn-primary';renderLaps();}
function renderLaps(){const el=document.getElementById('sw-laps');if(!swLaps.length){el.innerHTML='';return;}const best=Math.min(...swLaps.map(l=>l.t));const worst=Math.max(...swLaps.map(l=>l.t));el.innerHTML=swLaps.map(l=>`<div class="row between align" style="padding:8px 10px;border-radius:8px;background:${l.t===best?'rgba(0,255,179,.06)':l.t===worst?'rgba(255,77,141,.06)':'var(--card2)'};margin-bottom:4px;font-family:'JetBrains Mono',monospace;font-size:13px"><span style="color:var(--muted)">Lap ${l.n}</span><span style="color:${l.t===best?'var(--accent3)':l.t===worst?'var(--accent4)':'var(--accent)'}">${fmt(l.t)}</span><span style="color:var(--dim)">${fmt(l.total)}</span></div>`).join('');}
// ── COUNTDOWN ──
let cdRemain=300,cdTotal=300,cdRun=false,cdInt=null;
function cdToggle(){cdRun=!cdRun;document.getElementById('cd-start-btn').textContent=cdRun?'Pause':'Resume';if(cdRun){if(!cdRemain)cdReset();cdInt=setInterval(()=>{cdRemain--;updCd();if(!cdRemain){clearInterval(cdInt);cdRun=false;document.getElementById('cd-start-btn').textContent='Start';document.getElementById('cd-disp').style.color='var(--accent4)';document.getElementById('cd-disp').style.animation='pulse 0.5s 6';toast('⏰ Time is up!',3000);}},1000);}else clearInterval(cdInt);}
function cdReset(){clearInterval(cdInt);cdRun=false;cdRemain=parseInt(document.getElementById('cd-min').value||0)*60+parseInt(document.getElementById('cd-sec').value||0);cdTotal=cdRemain;document.getElementById('cd-start-btn').textContent='Start';document.getElementById('cd-disp').style.color='var(--accent)';document.getElementById('cd-disp').style.animation='';updCd();}
function setPreset(m,s){document.getElementById('cd-min').value=m;document.getElementById('cd-sec').value=s;cdReset();}
function updCd(){const m=Math.floor(cdRemain/60);const s=cdRemain%60;document.getElementById('cd-disp').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;document.getElementById('cd-bar').style.width=(cdTotal?cdRemain/cdTotal*100:100)+'%';}
cdReset();
// ── WORLD CLOCK ──
const zones=[{city:'Kuwait',tz:'Asia/Kuwait',flag:'🇰🇼'},{city:'Dubai',tz:'Asia/Dubai',flag:'🇦🇪'},{city:'London',tz:'Europe/London',flag:'🇬🇧'},{city:'New York',tz:'America/New_York',flag:'🇺🇸'},{city:'Tokyo',tz:'Asia/Tokyo',flag:'🇯🇵'},{city:'Sydney',tz:'Australia/Sydney',flag:'🇦🇺'}];
document.getElementById('wc-grid').innerHTML=zones.map(z=>`<div class="card2" id="wc-${z.city.replace(' ','')}" style="text-align:center;padding:16px"><div style="font-size:28px">${z.flag}</div><div style="font-size:13px;font-weight:600;margin:6px 0">${z.city}</div><div id="wc-t-${z.city.replace(' ','')}" style="font-family:'JetBrains Mono',monospace;font-size:18px;color:var(--accent)"></div><div id="wc-d-${z.city.replace(' ','')}" style="font-size:10px;color:var(--muted);margin-top:2px"></div></div>`).join('');
function tickClocks(){zones.forEach(z=>{const now=new Date();const t=now.toLocaleTimeString('en',{timeZone:z.tz,hour:'2-digit',minute:'2-digit',second:'2-digit'});const d=now.toLocaleDateString('en',{timeZone:z.tz,weekday:'short',month:'short',day:'numeric'});const k=z.city.replace(' ','');document.getElementById('wc-t-'+k).textContent=t;document.getElementById('wc-d-'+k).textContent=d;});}
setInterval(tickClocks,1000);tickClocks();
// ── TABS ──
function showTab(t,btn){['sw','cd','wc'].forEach(id=>{const p=document.getElementById(id+'-panel');if(p)p.style.display=id===t?(id==='wc'?'block':'block'):'none';});document.querySelectorAll('#\\34 [data-tab],.btn-outline').forEach(b=>{});document.querySelectorAll('[id^="tab-"]').forEach(b=>{b.style.borderColor='var(--border)';b.style.color='var(--muted)'});btn.style.borderColor='var(--accent)';btn.style.color='var(--accent)';}
