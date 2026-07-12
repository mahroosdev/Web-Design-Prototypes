/* ════════════════════════
   CORE PASSWORD ENGINE
   ════════════════════════ */
const CHARS = {
  upper:  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower:  'abcdefghijklmnopqrstuvwxyz',
  numbers:'0123456789',
  symbols:'!@#$%^&*_+-=<>?'
};
const SIMILAR   = '0Ol1I';
const AMBIGUOUS = '{}[]()/\\"\'`;:~,.<>';

const WORDS = [
  'quantum','nebula','cyber','flux','sentinel','matrix','nova','orbit',
  'pulse','vector','echo','cipher','phantom','signal','nexus','apex',
  'storm','forge','prism','zenith','delta','sigma','vortex','ghost',
  'titan','lunar','solar','atlas','rogue','swift','blade','frost'
];

let opts = {upper:true,lower:true,numbers:true,symbols:true,similar:false,ambiguous:false,passphrase:false,quantum:false};
let bulkCount = 5;
let currentPwd = '';

function buildCharset(){
  let s = '';
  // Read from whichever exclude input is currently active/visible
  const exElM = document.getElementById('excludeInput');
  const exElD = document.getElementById('excludeInputDesk');
  const ex = (exElM ? exElM.value : '') || (exElD ? exElD.value : '');
  if(opts.upper)   s += CHARS.upper;
  if(opts.lower)   s += CHARS.lower;
  if(opts.numbers) s += CHARS.numbers;
  if(opts.symbols) s += CHARS.symbols;
  if(opts.similar)   s = [...s].filter(c=>!SIMILAR.includes(c)).join('');
  if(opts.ambiguous) s = [...s].filter(c=>!AMBIGUOUS.includes(c)).join('');
  if(ex) s = [...s].filter(c=>!ex.includes(c)).join('');
  return s || CHARS.lower;
}

function generateOne(len){
  /* ── PASSPHRASE MODE ── */
  if(opts.passphrase){
    const words = [];
    const arr = new Uint32Array(4);
    crypto.getRandomValues(arr);
    for(let i=0;i<4;i++) words.push(WORDS[arr[i]%WORDS.length]);
    return words.join('-');
  }
  /* ── QUANTUM MODE: force 64 chars ── */
  if(opts.quantum) len = 64;
  const set = buildCharset();
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  return [...arr].map(n=>set[n%set.length]).join('');
}

function calcEntropy(pwd){
  if(opts.passphrase) return Math.round(4 * Math.log2(WORDS.length));
  const set = buildCharset();
  return Math.round(pwd.length * Math.log2(set.length));
}

function getStrength(pwd){
  let score = 0;
  if(opts.passphrase){ score = 3; if(pwd.split('-').length >= 4) score = 4; return score; }
  if(pwd.length >= 10) score++;
  if(pwd.length >= 16) score++;
  if(pwd.length >= 24) score++;
  if(/[A-Z]/.test(pwd)) score++;
  if(/[a-z]/.test(pwd)) score++;
  if(/[0-9]/.test(pwd)) score++;
  if(/[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(4, Math.round(score / 1.75));
}

function updateStrength(pwd){
  const s = getStrength(pwd);
  const segs = document.querySelectorAll('.s-seg');
  const colors = ['','#f85149','#f0c133','#00c97a','#00ff9d'];
  const shadows = ['','rgba(248,81,73,0.4)','rgba(240,193,51,0.4)','rgba(0,201,122,0.4)','rgba(0,255,157,0.45)'];
  const labels  = ['','Weak','Fair','Strong','Fortress'];
  segs.forEach((seg,i)=>{
    seg.style.background = i < s ? colors[s] : 'rgba(255,255,255,0.07)';
    seg.style.boxShadow  = i < s ? `0 0 6px ${shadows[s]}` : 'none';
  });
  const lbl = document.getElementById('strengthLabel');
  if(lbl){ lbl.textContent = labels[s] || '—'; lbl.style.color = colors[s] || 'var(--txt3)'; }
  const entropy = calcEntropy(pwd);
  const entropyEl = document.getElementById('entropyLabel');
  if(entropyEl) entropyEl.textContent = pwd ? `~${entropy} bits` : '';
}

function animatePwdChars(text){
  const el = document.getElementById('pwdOutput');
  el.innerHTML = '';
  el.classList.toggle('has-pwd', !!text);
  if(!text){el.textContent='Click regenerate to create a password';return;}
  [...text].forEach((ch,i)=>{
    const s = document.createElement('span');
    s.className = 'char';
    s.textContent = ch;
    s.style.animationDelay = `${i * 18}ms`;
    el.appendChild(s);
  });
}

function generate(){
  try {
    // Get length from whichever slider is visible
    const sliderM = document.getElementById('lenSlider');
    const sliderD = document.getElementById('lenSliderDesk');
    // Prefer mobile slider value if mobile, else desktop
    let activeSlider = (sliderM && sliderM.offsetParent !== null) ? sliderM : (sliderD || sliderM);
    if(opts.quantum){
      if(sliderM){ sliderM.value = 64; }
      if(sliderD){ sliderD.value = 64; }
      const lenValEl = document.getElementById('lenVal');
      if(lenValEl) lenValEl.textContent = '64';
      const lenValD = document.getElementById('lenValDesk');
      if(lenValD) lenValD.textContent = '64';
    }
    const len = activeSlider ? parseInt(activeSlider.value) : 16;
    if(!len || len < 1){ toast('Password length must be at least 1', 'warn'); return; }
    currentPwd = generateOne(len);
    animatePwdChars(currentPwd);
    updateStrength(currentPwd);
    const cb = document.getElementById('copyBtn');
    if(cb){
      cb.classList.remove('copied');
      cb.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy Password`;
    }
    saveToHistory(currentPwd);
  } catch(e) {
    toast('Failed to generate password — please try again', 'warn');
  }
}

function regenerate(){
  const btn = document.getElementById('regenBtn');
  if(btn){
    btn.classList.add('spin');
    btn.addEventListener('animationend',()=>btn.classList.remove('spin'),{once:true});
  }
  generate();
}

function copyPassword(){
  if(!currentPwd){ toast('Generate a password first', 'warn'); return; }
  _vaultClipboardCopy(currentPwd, () => {
    const btn = document.getElementById('copyBtn');
    if(btn){
      btn.classList.add('copied');
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>Copied!`;
      setTimeout(()=>{
        btn.classList.remove('copied');
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy Password`;
      }, 2000);
    }
    toast('Password copied to clipboard');
  });
}

function _vaultClipboardCopy(text, onSuccess){
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(()=>{ if(onSuccess) onSuccess(); }).catch(()=>_vaultClipboardFallback(text, onSuccess));
  } else {
    _vaultClipboardFallback(text, onSuccess);
  }
}

function _vaultClipboardFallback(text, onSuccess){
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if(ok){ if(onSuccess) onSuccess(); } else { toast('Copy failed — please copy manually', 'warn'); }
  } catch(e){
    toast('Copy failed — please copy manually', 'warn');
  }
}

function toggle(el){
  const key = el.dataset.key;
  el.classList.toggle('active');
  opts[key] = el.classList.contains('active');
  generate();
}

function onLenChange(input){
  const len = parseInt(input.value);
  if(!len || len < 1){ toast('Password length must be at least 1', 'warn'); return; }
  // Sync both displays
  const v = document.getElementById('lenVal');
  if(v){ v.textContent = input.value; v.classList.add('bump'); v.addEventListener('animationend',()=>v.classList.remove('bump'),{once:true}); }
  const vd = document.getElementById('lenValDesk');
  if(vd){ vd.textContent = input.value; }
  // Sync the other slider
  const other = input.id === 'lenSlider' ? document.getElementById('lenSliderDesk') : document.getElementById('lenSlider');
  if(other) other.value = input.value;
  generate();
}

/* ════════════════════════
   BREACH WATCH — k-Anonymity SHA-1 (password check)
   ════════════════════════ */
async function sha1(str){
  const buf = new TextEncoder().encode(str);
  const hashBuf = await crypto.subtle.digest('SHA-1', buf);
  return [...new Uint8Array(hashBuf)].map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
}

async function checkPwned(){
  var result = document.getElementById('pwnedResult');
  if(result){
    result.innerHTML = '<div class="pwned-clean" style="border-color:rgba(148,163,184,.22);background:rgba(148,163,184,.08)"><div class="pwned-clean-icon">i</div><div><div class="pwned-clean-title" style="color:var(--txt2)">Password required</div><div class="pwned-clean-sub">Enter a password to scan. Breach lookup uses internet only when you press Scan; local generation and strength scoring still work offline.</div></div></div>';
  }
  if(window.toast) toast('Breach lookup needs internet when you press Scan.');
}
function togglePwnedVisibility(){
  const input = document.getElementById('pwnedInput');
  const icon = document.getElementById('pwnedEyeIcon');
  if(!input) return;
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  if(icon) icon.innerHTML = show
    ? `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`
    : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
}

/* Mobile breach scan re-routes to checkPwned */
function scanBreach(){ checkPwned(); }
function togglePwnedEye(){ togglePwnedVisibility(); }

/* Legacy email breach check kept as alias (no-op now that we use k-anon) */
function checkBreach(){
  toast('Use the password breach scan above instead', 'warn');
}

/* ════════════════════════
   BULK — copy all + download
   ════════════════════════ */
function adjustCount(d){
  bulkCount = Math.max(1, Math.min(50, bulkCount + d));
  document.getElementById('countVal').textContent = bulkCount;
}

let _lastBulkPws = [];

function generateBulk(){
  try {
    const sliderM = document.getElementById('lenSlider');
    const sliderD = document.getElementById('lenSliderDesk');
    const activeSlider = (sliderM && sliderM.offsetParent !== null) ? sliderM : (sliderD || sliderM);
    const len = activeSlider ? parseInt(activeSlider.value) : 16;
    if(!len || len < 1){ toast('Password length must be at least 1', 'warn'); return; }
    const list = document.getElementById('bulkList');
    if(!list) return;
    list.style.display = 'flex';
    list.innerHTML = '';
    _lastBulkPws = [];
    for(let i = 0; i < bulkCount; i++){
      const p = generateOne(len);
      _lastBulkPws.push(p);
      const entry = document.createElement('div');
      entry.className = 'bulk-entry';
      entry.innerHTML = `
        <span class="bulk-idx">${String(i+1).padStart(2,'0')}</span>
        <span class="bulk-pwd">${p}</span>
        <button class="bulk-copy-btn" aria-label="Copy password ${i+1}" onclick="copyBulk(this,'${p.replace(/\\/g,'\\\\').replace(/'/g,"\\'")}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        </button>`;
      list.appendChild(entry);
      setTimeout(()=>entry.classList.add('on'), 40 + i * 55);
    }
    // Save to bulk history
    saveToBulkHistory(_lastBulkPws);
    mUpdateNavBadge && mUpdateNavBadge();
    toast(`${bulkCount} passwords generated`);
  } catch(e){
    toast('Failed to generate passwords — please try again', 'warn');
  }
}

function copyAllBulk(){
  if(!_lastBulkPws.length){ toast('Generate a batch first', 'warn'); return; }
  _vaultClipboardCopy(_lastBulkPws.join('\n'), () => toast(`Copied ${_lastBulkPws.length} passwords`));
}

function downloadBulk(){
  if(!_lastBulkPws.length){ toast('Generate a batch first', 'warn'); return; }
  const blob = new Blob([_lastBulkPws.join('\n')], {type:'text/plain'});
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = 'vault-ultra-passwords.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('Downloaded ✓');
}

function copyBulk(btn, pwd){
  _vaultClipboardCopy(pwd, () => {
    btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--g)" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    setTimeout(()=>{
      btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
    }, 1500);
    toast('Copied to clipboard');
  });
}

function toast(msg, type='ok'){
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast';
  const icon = type === 'warn'
    ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f0c133" stroke-width="2.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--g)" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  t.innerHTML = `${icon}${msg}`;
  c.appendChild(t);
  setTimeout(()=>{t.classList.add('out');t.addEventListener('animationend',()=>t.remove());},2500);
}

/* ════════════════════════
   BREACH WATCH
   ════════════════════════ */
async function checkBreach(){
  var result = document.getElementById('breachResult');
  if(result){
    result.innerHTML = '<span class="breach-scanning">Breach lookup needs internet when you press Scan.</span>';
  }
  if(window.toast) toast('Breach lookup needs internet when you press Scan.');
}
/* ════════════════════════
   SESSION LEDGER  — in-memory + localStorage mirror
   ════════════════════════ */
let _sessionHistory = [];   // in-memory single log
let _bulkHistory    = [];   // in-memory bulk log

function saveToHistory(pwd){
  if(!pwd) return;
  _sessionHistory.unshift(pwd);
  if(_sessionHistory.length > 20) _sessionHistory.pop();
  // Mirror to localStorage for persistence across mobile section switches
  try{ localStorage.setItem('vault_history', JSON.stringify(_sessionHistory)); }catch(e){}
  renderHistory();
}

function renderHistory(){
  const list = document.getElementById('historyList');
  if(!list) return;
  updateTabBadge();
  if(!_sessionHistory.length){
    list.innerHTML = `<div class="history-empty">No passwords generated yet this session.</div>`;
    return;
  }
  list.innerHTML = _sessionHistory.map((p,i)=>`
    <div class="history-entry">
      <span class="history-idx">${String(i+1).padStart(2,'0')}</span>
      <span class="history-pwd">${p}</span>
      <button class="history-copy" onclick="copyHistEntry(this,'${p.replace(/\\/g,'\\\\').replace(/'/g,"\\'")}')">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      </button>
    </div>`).join('');
}

function copyHistEntry(btn, pwd){
  _vaultClipboardCopy(pwd, () => {
    btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--g)" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    setTimeout(()=>{
      btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
    }, 1500);
    toast('Copied from history');
  });
}

function clearHistory(){
  _sessionHistory = [];
  try{ localStorage.removeItem('vault_history'); }catch(e){}
  renderHistory();
  mUpdateNavBadge && mUpdateNavBadge();
  toast('Session history cleared');
}

/* ════════════════════════
   CINEMATIC ENGINE
   ════════════════════════ */

/* 1. CURTAIN — letter drop + exit */
(function(){
  const letters = document.querySelectorAll('.crt-letter');
  letters.forEach((el,i)=>{ setTimeout(()=>el.classList.add('drop'), 650 + i * 85); });
  setTimeout(()=>{
    const c = document.getElementById('curtain');
    if(c){ c.classList.add('hide'); setTimeout(()=>c.style.display='none', 1000); }
  }, 4200);
})();

/* 1b. VAULT HERO — readout typewriter */
(function(){
  const el  = document.getElementById('vhReadoutText');
  const wrap= document.getElementById('vhReadout');
  if(!el||!wrap) return;
  const MSGS = ['256-BIT AES','ZERO-TRACK','CRYPTOSECURE','LOCAL ONLY'];
  let idx = 0;
  function typeMsg(str, onDone){
    wrap.classList.add('visible');
    el.textContent = '';
    let i = 0;
    const iv = setInterval(()=>{
      el.textContent = str.slice(0, ++i);
      if(i >= str.length){ clearInterval(iv); if(onDone) setTimeout(onDone, 900); }
    }, 55);
  }
  function clearMsg(onDone){
    const str = el.textContent;
    let i = str.length;
    const iv = setInterval(()=>{
      el.textContent = str.slice(0, --i);
      if(i <= 0){ clearInterval(iv); wrap.classList.remove('visible'); if(onDone) setTimeout(onDone, 200); }
    }, 30);
  }
  function cycle(){
    typeMsg(MSGS[idx % MSGS.length], ()=>{
      idx++;
      clearMsg(()=> cycle());
    });
  }
  setTimeout(cycle, 6800);
})();

/* 2. TITLE CHAR SPLIT */
(function(){
  const el = document.getElementById('mainTitle');
  if(!el) return;
  const raw = 'Vault';
  el.innerHTML = raw.split('').map((ch,i)=>
    `<span class="ch${i>=2?' chi':''}" style="transition-delay:${i*85}ms">${ch}</span>`
  ).join('');
  setTimeout(()=>{
    el.querySelectorAll('.ch').forEach(c=>c.classList.add('on'));
    setTimeout(()=>document.getElementById('mainSub').classList.add('on'), 300);
    document.querySelectorAll('.glass-card').forEach((card,i)=>{
      setTimeout(()=>card.classList.add('on'), 500 + i * 100);
    });
    setTimeout(()=>{ generate(); renderHistory(); }, 600);
  }, 5200);
})();

/* 3. SCROLL REVEAL */
const scObs = new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('on'), i*60);
      scObs.unobserve(e.target);
    }
  });
},{threshold:0.07});
document.querySelectorAll('.glass-card').forEach(c=>scObs.observe(c));

/* 3b. Logo scroll fade-up */
(function(){
  const wrap = document.getElementById('logoScrollWrap');
  if(!wrap) return;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ setTimeout(()=>wrap.classList.add('scroll-in'),100); obs.unobserve(wrap); }
    });
  },{threshold:0.15});
  obs.observe(wrap);
})();

/* 4. CURSOR GLOW */
(function(){
  const g = document.getElementById('cg');
  if(!g||'ontouchstart' in window){if(g)g.style.display='none';return;}
  let tx=innerWidth/2,ty=innerHeight/2,x=tx,y=ty;
  document.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;},{passive:true});
  function tick(){
    x+=(tx-x)*0.09; y+=(ty-y)*0.09;
    g.style.transform=`translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
    requestAnimationFrame(tick);
  }
  tick();
})();

/* 5. RIPPLE on copy btn */
document.getElementById('copyBtn').addEventListener('click',e=>{
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const sz = Math.max(rect.width,rect.height)*1.8;
  const rpl = document.createElement('span');
  rpl.className = 'ripple';
  rpl.style.cssText=`width:${sz}px;height:${sz}px;left:${e.clientX-rect.left-sz/2}px;top:${e.clientY-rect.top-sz/2}px`;
  btn.appendChild(rpl);
  rpl.addEventListener('animationend',()=>rpl.remove());
},{passive:true});

/* ════════════════════════
   TAB SWITCHER (desktop legacy — safe no-op on mobile)
   ════════════════════════ */
let activeTab = 'password';

function switchTab(name){
  // No-op on mobile (log lives in its own card now)
  if(typeof isMobile === 'function' && isMobile()) return;
  if(activeTab === name) return;
  const prev = activeTab;
  activeTab = name;

  const tabPwd = document.getElementById('tabPassword');
  const tabLog = document.getElementById('tabLog');
  if(tabPwd) tabPwd.classList.toggle('active', name === 'password');
  if(tabLog) tabLog.classList.toggle('active', name === 'log');

  const prevPanel = document.getElementById(prev === 'password' ? 'panelPassword' : 'panelLog');
  const nextPanel = document.getElementById(name === 'password' ? 'panelPassword' : 'panelLog');
  if(prevPanel){ prevPanel.classList.remove('active'); prevPanel.classList.add('hidden'); }
  if(nextPanel){
    nextPanel.classList.remove('hidden');
    nextPanel.classList.remove('slide-in','slide-in-left');
    void nextPanel.offsetWidth;
    nextPanel.classList.add('active');
    nextPanel.classList.add(name === 'log' ? 'slide-in' : 'slide-in-left');
    setTimeout(()=> nextPanel.classList.remove('slide-in','slide-in-left'), 350);
  }
  if(name === 'log') renderHistory();
}

function updateTabBadge(){
  const hist = _sessionHistory || [];
  const badge = document.getElementById('tabBadge');
  const countEl = document.getElementById('logCountBadge');
  if(badge){ badge.textContent = hist.length; badge.classList.toggle('visible', hist.length > 0); }
  if(countEl){ countEl.textContent = hist.length === 0 ? '0 entries' : `${hist.length} entr${hist.length === 1 ? 'y' : 'ies'}`; }
  const logSingleBadge = document.getElementById('logBadgeSingle');
  if(logSingleBadge){ logSingleBadge.textContent = hist.length; logSingleBadge.style.opacity = hist.length > 0 ? '1' : '0'; }
}

/* ════════════════════════
   THEME ENGINE
   ════════════════════════ */
let themePanelOpen = false;

function toggleThemePanel(){
  themePanelOpen = !themePanelOpen;
  document.getElementById('themePanel').classList.toggle('open', themePanelOpen);
}

function setTheme(name, el){
  const validThemes = {ivory:1, obsidian:1, void:1, aerium:1, jewel:1};
  if(!validThemes[name]) name = 'ivory';
  document.documentElement.setAttribute('data-theme', name);
  document.querySelectorAll('.theme-opt').forEach(o=>o.classList.remove('active'));
  const active = el || document.querySelector(`.theme-opt[data-theme="${name}"]`);
  if(active) active.classList.add('active');
  localStorage.setItem('vaultTheme', name);
  setTimeout(()=>{
    themePanelOpen = false;
    document.getElementById('themePanel').classList.remove('open');
  }, 280);
}

document.addEventListener('click', e=>{
  const sw = document.getElementById('themeSwitcher');
  if(themePanelOpen && !sw.contains(e.target)){
    themePanelOpen = false;
    document.getElementById('themePanel').classList.remove('open');
  }
},{passive:true});

(function(){
  const validThemes = {ivory:1, obsidian:1, void:1, aerium:1, jewel:1};
  const saved = localStorage.getItem('vaultTheme');
  const theme = validThemes[saved] ? saved : 'ivory';
  document.documentElement.setAttribute('data-theme', theme);
  const opt = document.querySelector(`.theme-opt[data-theme="${theme}"]`);
  if(opt){
    document.querySelectorAll('.theme-opt').forEach(o=>o.classList.remove('active'));
    opt.classList.add('active');
  }
  renderHistory();
})();

/* ════════════════════════
   PASSWORD PWNED CHECK (k-anonymity)
   ════════════════════════ */
async function sha1(str){
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
}

async function checkPwned(){
  var result = document.getElementById('pwnedResult');
  if(result){
    result.innerHTML = '<div class="pwned-clean" style="border-color:rgba(148,163,184,.22);background:rgba(148,163,184,.08)"><div class="pwned-clean-icon">i</div><div><div class="pwned-clean-title" style="color:var(--txt2)">Password required</div><div class="pwned-clean-sub">Enter a password to scan. Breach lookup uses internet only when you press Scan; local generation and strength scoring still work offline.</div></div></div>';
  }
  if(window.toast) toast('Breach lookup needs internet when you press Scan.');
}
function togglePwnedVisibility(){
  const input = document.getElementById('pwnedInput');
  const icon  = document.getElementById('pwnedEyeIcon');
  const show  = input.type === 'password';
  input.type  = show ? 'text' : 'password';
  icon.innerHTML = show
    ? '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'
    : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
}

function togglePwnedHow(){
  const body    = document.getElementById('pwnedHowBody');
  const chevron = document.getElementById('pwnedHowChevron');
  const open    = body.classList.toggle('open');
  chevron.classList.toggle('open', open);
};

/* ══════════════════════════════════
   MOBILE NAVIGATION SYSTEM v2
   ══════════════════════════════════ */
const M_SECTIONS = ['generate','bulk','scan','log'];
let mActiveSection = 'generate';
let mActiveLogTab = 'single';

function isMobile(){
  return window.matchMedia('(max-width: 640px)').matches;
}

function mSwitchSection(name){
  if(!isMobile()) return;
  mActiveSection = name;

  // Update nav buttons
  M_SECTIONS.forEach(s => {
    const btn = document.getElementById('mNav-' + s);
    if(btn) btn.classList.toggle('active', s === name);
  });

  // Cards to show per section
  const sectionMap = {
    generate: ['pwdCard'],
    bulk:     ['bulkCard'],
    scan:     ['breachCard'],
    log:      ['logCard'],
  };

  const allCards = ['pwdCard','settingsCard','bulkCard','breachCard','logCard'];
  const activeCards = sectionMap[name] || [];

  allCards.forEach(id => {
    const el = document.getElementById(id);
    if(!el) return;
    el.style.setProperty('display', activeCards.includes(id) ? 'block' : 'none', 'important');
  });

  // If log section, refresh both logs
  if(name === 'log'){
    renderHistory();
    renderBulkHistory();
  }

  mUpdateNavBadge();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Log sub-tab switcher (inside logCard) ── */
let activeLogTab = 'single';
function switchLogTab(name){
  activeLogTab = name;

  ['single','bulk'].forEach(t => {
    const btn = document.getElementById('logTab' + t.charAt(0).toUpperCase() + t.slice(1));
    const panel = document.getElementById('logPanel' + t.charAt(0).toUpperCase() + t.slice(1));
    if(btn) btn.classList.toggle('active', t === name);
    if(panel){
      panel.classList.toggle('active', t === name);
      panel.classList.toggle('hidden', t !== name);
      if(t === name){
        panel.classList.add(t === 'single' ? 'slide-in' : 'slide-in');
        setTimeout(() => panel.classList.remove('slide-in'), 350);
      }
    }
  });

  if(name === 'bulk') renderBulkHistory();
  else renderHistory();
}

/* ── Bulk History (separate from single log) ── */
function saveToBulkHistory(passwords){
  if(!passwords || !passwords.length) return;
  _bulkHistory.unshift({ ts: Date.now(), passwords: passwords });
  if(_bulkHistory.length > 10) _bulkHistory.pop();
  mUpdateNavBadge();
}

function renderBulkHistory(){
  const list = document.getElementById('bulkHistoryList');
  if(!list) return;

  const badge = document.getElementById('logBadgeBulk');
  const countEl = document.getElementById('bulkLogCountBadge');
  if(badge){ badge.textContent = _bulkHistory.length; badge.style.opacity = _bulkHistory.length > 0 ? '1' : '0'; }
  if(countEl) countEl.textContent = _bulkHistory.length === 0 ? '0 batches' : `${_bulkHistory.length} batch${_bulkHistory.length !== 1 ? 'es' : ''}`;

  if(!_bulkHistory.length){
    list.innerHTML = `<div class="history-empty">No bulk generations this session.</div>`;
    return;
  }

  list.innerHTML = _bulkHistory.map((batch, bi) => {
    const d = new Date(batch.ts);
    const timeStr = d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    const pwds = batch.passwords;
    const rows = pwds.map((p, pi) => `
      <div class="bulk-log-row">
        <span class="bulk-log-idx">${String(pi+1).padStart(2,'0')}</span>
        <span class="bulk-log-pwd">${p}</span>
        <button class="history-copy" onclick="copyBulkLogEntry(this,'${p.replace(/\\/g,'\\\\').replace(/'/g,"\\'")}')">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        </button>
      </div>`).join('');
    return `
      <div class="bulk-log-batch">
        <div class="bulk-log-batch-header">
          <span class="bulk-log-batch-label">Batch ${String(bi+1).padStart(2,'0')}</span>
          <span class="bulk-log-batch-time">${timeStr} · ${pwds.length} passwords</span>
        </div>
        <div class="bulk-log-rows">${rows}</div>
      </div>`;
  }).join('');
}

function copyBulkLogEntry(btn, pwd){
  _vaultClipboardCopy(pwd, () => {
    btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--g)" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    setTimeout(()=>{
      btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
    }, 1500);
    toast('Copied');
  });
}

function clearBulkHistory(){
  _bulkHistory = [];
  renderBulkHistory();
  toast('Bulk history cleared');
}

/* ── Nav badge (total: single + bulk) ── */
function mUpdateNavBadge(){
  const total = _sessionHistory.length + _bulkHistory.length;
  const badge = document.getElementById('mNavBadge');
  if(badge){ badge.textContent = total > 9 ? '9+' : total; badge.classList.toggle('visible', total > 0); }
  // Update single log badge
  const sBadge = document.getElementById('logBadgeSingle');
  if(sBadge){ sBadge.textContent = _sessionHistory.length; sBadge.style.opacity = _sessionHistory.length > 0 ? '1' : '0'; }
}

/* ── Desktop: sync duplicate controls ── */
function onLenChangeDesk(input){
  // Sync to mobile slider
  const mSlider = document.getElementById('lenSlider');
  if(mSlider){ mSlider.value = input.value; }
  const mVal = document.getElementById('lenVal');
  if(mVal){ mVal.textContent = input.value; }
  // Update desktop display
  const v = document.getElementById('lenValDesk');
  if(v){
    v.textContent = input.value;
    v.classList.add('bump');
    v.addEventListener('animationend', () => v.classList.remove('bump'), {once:true});
  }
  generate();
}

function toggleDesk(el){
  const key = el.dataset.key;
  el.classList.toggle('active');
  opts[key] = el.classList.contains('active');
  // Sync mobile toggle
  const mobileToggle = document.querySelector(`#toggles .toggle-item[data-key="${key}"]`);
  if(mobileToggle){
    mobileToggle.classList.toggle('active', el.classList.contains('active'));
  }
  generate();
}

/* ── Mobile theme panel ── */
function mOpenTheme(){
  const panel = document.getElementById('themePanel');
  const backdrop = document.getElementById('mSheetBackdrop');
  if(panel) panel.classList.add('open');
  if(backdrop) backdrop.classList.add('visible');
  themePanelOpen = true;
}

function mCloseTheme(){
  const panel = document.getElementById('themePanel');
  const backdrop = document.getElementById('mSheetBackdrop');
  if(panel) panel.classList.remove('open');
  if(backdrop) backdrop.classList.remove('visible');
  themePanelOpen = false;
}

document.addEventListener('click', function(e){
  if(!isMobile()) return;
  if(themePanelOpen && e.target.id !== 'mThemeBtn' && !document.getElementById('themePanel').contains(e.target)){
    mCloseTheme();
  }
}, { passive: true });

/* Override setTheme to close mobile sheet */
const _origSetTheme = setTheme;
setTheme = function(name, el){
  _origSetTheme(name, el);
  setTimeout(() => mCloseTheme(), 300);
};

/* ── Mobile init ── */
(function(){
  function applyMobileLayout(){
    if(!isMobile()) return;
    const sc = document.getElementById('settingsCard');
    if(sc) sc.style.setProperty('display', 'none', 'important');
    mSwitchSection('generate');
    mUpdateNavBadge();
  }

  applyMobileLayout();
  setTimeout(applyMobileLayout, 250);

  window.addEventListener('resize', () => {
    const sc = document.getElementById('settingsCard');
    if(isMobile()){
      if(sc) sc.style.setProperty('display', 'none', 'important');
      mSwitchSection(mActiveSection);
    } else {
      ['pwdCard','settingsCard','bulkCard','breachCard'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.style.removeProperty('display');
      });
      const lc = document.getElementById('logCard');
      if(lc) lc.style.setProperty('display', 'none', 'important');
    }
  }, { passive: true });
})();;

(function(){
  function ready(fn){if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fn,{once:true});}else{fn();}}
  function clean(s){return (s||'').replace(/\s+/g,' ').trim();}
  function labelFor(el){
    if(el.id){var explicit=document.querySelector('label[for="'+CSS.escape(el.id)+'"]');if(explicit)return clean(explicit.textContent);}
    var wrap=el.closest('label'); if(wrap) return clean(wrap.textContent);
    var group=el.closest('.field,.field-group,.mob-field,.control,.setting,.input-wrap,.pwned-input-wrap,.breach-field-wrap');
    if(group){var lab=group.querySelector('label,.field-label,.label'); if(lab) return clean(lab.textContent);}
    return clean(el.getAttribute('placeholder')||el.getAttribute('title')||el.textContent);
  }
  ready(function(){
    document.querySelectorAll('button:not([aria-label])').forEach(function(btn){var text=clean(btn.textContent||btn.title); if(text) btn.setAttribute('aria-label',text);});
    document.querySelectorAll('input:not([aria-label]),textarea:not([aria-label]),select:not([aria-label])').forEach(function(el){var text=labelFor(el); if(text) el.setAttribute('aria-label',text);});
    document.querySelectorAll('a[target="_blank"]').forEach(function(a){ if(!a.rel) a.rel='noopener noreferrer'; });
  });
})();;

(function(){
  function ready(fn){if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fn,{once:true});}else{fn();}}
  function resultHtml(){return '<div class="pwned-clean" style="border-color:rgba(148,163,184,.22);background:rgba(148,163,184,.08)"><div class="pwned-clean-icon">i</div><div><div class="pwned-clean-title" style="color:var(--txt2)">Online check unavailable</div><div class="pwned-clean-sub">Breach lookup needs internet when you press Scan. Local generation and strength scoring still work offline.</div></div></div>';}
  window.checkPwned=function(){var r=document.getElementById('pwnedResult'); if(r) r.innerHTML=resultHtml(); if(window.toast) toast('Breach lookup needs internet when you press Scan.');};
  window.scanBreach=function(){window.checkPwned();};
  window.checkBreaches=function(){var r=document.getElementById('breachResult'); if(r) r.innerHTML='<span class="breach-scanning">Breach lookup needs internet when you press Scan.</span>'; if(window.toast) toast('Breach lookup needs internet when you press Scan.');};
  ready(function(){
    var input=document.getElementById('pwnedInput'); if(input) input.placeholder='Enter password to scan when internet is available';
    var btn=document.getElementById('pwnedScanBtn'); if(btn){btn.textContent='OFFLINE V1';btn.setAttribute('title','Breach checks require the online edition.');}
    var intro=document.querySelector('.pwned-intro'); if(intro) intro.textContent='Offline V1.0 keeps password generation and strength checks local. Online breach lookups are reserved for the future online edition.';
    document.querySelectorAll('.pwned-how a').forEach(function(a){a.removeAttribute('href');a.textContent='online edition';});
  });
})();;

(function(){
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); }
  function escapeHtml(value){
    return String(value).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});
  }
  async function sha1Text(value){
    if(!window.crypto || !crypto.subtle) throw new Error('crypto-unavailable');
    var bytes = new TextEncoder().encode(value);
    var hash = await crypto.subtle.digest('SHA-1', bytes);
    return Array.from(new Uint8Array(hash)).map(function(b){return b.toString(16).padStart(2,'0');}).join('').toUpperCase();
  }
  async function queryPwned(password){
    if(navigator.onLine === false) throw new Error('offline');
    var hash = await sha1Text(password);
    var prefix = hash.slice(0,5);
    var suffix = hash.slice(5);
    var controller = new AbortController();
    var timer = setTimeout(function(){controller.abort();},9000);
    try{
      var response = await fetch('https://api.pwnedpasswords.com/range/' + prefix, {
        signal: controller.signal,
        headers: {'Add-Padding':'true'}
      });
      if(!response.ok) throw new Error('network-' + response.status);
      var text = await response.text();
      var count = 0;
      text.split(/\r?\n/).some(function(line){
        var parts = line.split(':');
        if(parts[0] === suffix){
          count = Number(parts[1] || 0);
          return true;
        }
        return false;
      });
      return {found: count > 0, count: count};
    } finally {
      clearTimeout(timer);
    }
  }
  function render(html){
    var result = document.getElementById('pwnedResult');
    if(result) result.innerHTML = html;
  }
  window.checkPwned = async function(){
    var input = document.getElementById('pwnedInput');
    var password = input ? input.value : '';
    if(!password){
      if(window.toast) toast('Enter a password to scan','warn');
      render('<div class="pwned-clean" style="border-color:rgba(148,163,184,.22);background:rgba(148,163,184,.08)"><div class="pwned-clean-icon">i</div><div><div class="pwned-clean-title" style="color:var(--txt2)">Password required</div><div class="pwned-clean-sub">Enter a password before scanning.</div></div></div>');
      return;
    }
    render('<div class="pwned-scanning-wrap"><span class="pwned-spinner"></span><span class="pwned-scanning-text">Checking breach database with a private hash prefix...</span></div>');
    try{
      var out = await queryPwned(password);
      if(out.found){
        render('<div class="pwned-found"><div class="pwned-found-icon">!</div><div><div class="pwned-found-title">Found in breaches</div><div class="pwned-found-count">' + escapeHtml(out.count.toLocaleString()) + ' appearances</div><div class="pwned-found-sub">This password appears in public breach data. Generate a new one.</div></div></div>');
      } else {
        render('<div class="pwned-clean"><div class="pwned-clean-icon">OK</div><div><div class="pwned-clean-title">No match found</div><div class="pwned-clean-sub">This password was not found in the public breach range response.</div></div></div>');
      }
    } catch(error){
      render('<div class="pwned-clean" style="border-color:rgba(148,163,184,.22);background:rgba(148,163,184,.08)"><div class="pwned-clean-icon">i</div><div><div class="pwned-clean-title" style="color:var(--txt2)">Online check unavailable</div><div class="pwned-clean-sub">The page still works offline. To run the breach lookup, use internet access and a browser with Web Crypto support.</div></div></div>');
    }
  };
  window.scanBreach = function(){ return window.checkPwned(); };
  ready(function(){
    var input=document.getElementById('pwnedInput');
    if(input) input.placeholder='Enter a password to check...';
    var btn=document.getElementById('pwnedScanBtn');
    if(btn){btn.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" style="display:inline;vertical-align:middle;margin-right:7px"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Scan';btn.setAttribute('title','Run online breach check when internet is available.');}
    var intro=document.querySelector('.pwned-intro');
    if(intro) intro.textContent='Breach Check uses the Have I Been Pwned k-anonymity API when internet is available. Passwords are never sent; only the first five SHA-1 hash characters are queried.';
  });
})();;