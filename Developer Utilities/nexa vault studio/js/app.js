/* ══════════════════════════════════════════
   WORD LIST (curated 180 words for demo)
══════════════════════════════════════════ */
const WORDS = [
  'amber','arctic','azure','binary','blade','blaze','bolt','canyon','carbon',
  'cipher','cobalt','coral','cosmos','crater','crystal','dagger','dawn','delta',
  'diamond','dusk','eagle','echo','element','ember','emerald','falcon','fern',
  'fiber','fjord','flame','flint','flux','forest','forge','frost','gale',
  'garnet','gate','ghost','glacier','glitch','gold','granite','grove','harbor',
  'hawk','helix','horizon','hydra','impact','index','indigo','inferno','jade',
  'jasper','kaizen','karma','kindle','kinetic','krypton','lance','laser','lattice',
  'lava','lemon','logic','lotus','lunar','magma','maple','marble','matrix',
  'mesa','meteor','mint','mirage','mist','moon','mystic','nebula','nexus',
  'nimble','noble','north','nova','nylon','oak','obsidian','ocean','olive',
  'onyx','opal','orbit','order','osprey','oxide','ozone','parchment','pebble',
  'pearl','phase','photon','pine','pixel','plasma','pluto','polaris','prism',
  'proton','pulse','pyrite','quartz','quantum','quasar','quill','radar','raven',
  'realm','resin','ridge','ripple','river','rocket','root','ruby','sage',
  'sapphire','scalar','shadow','shift','sierra','signal','silicon','silver',
  'slate','snow','solar','sonic','spark','spire','spruce','static','steel',
  'stone','storm','stream','strobe','swift','talon','teal','terra','tide',
  'tiger','topaz','torch','trace','trial','turbo','turquoise','ultra','umbra',
  'unity','vault','vector','venom','vertex','violet','vision','vivid','void',
  'volt','vortex','wave','wedge','wild','willow','wind','wire','wolf','zeal',
  'zenith','zinc','zone','zoom','praxis','axiom','beacon','cipher','drift'
];

/* ══════════════════════════════════════════
   STATE
══════════════════════════════════════════ */
let currentMode = 'classic';
let currentPw = '';
let sessionPws = [];
let bulkCount = 5;
let wordCount = 3;
let separator = '-';
let toggles = { upper:true, lower:true, numbers:true, symbols:true, noSimilar:false, noAmbig:false, capitalize:false, addNumber:false, pinGroup:false };

/* ══════════════════════════════════════════
   CRYPTO
══════════════════════════════════════════ */
function cryptoRand(max) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

function buildCharset() {
  let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lower = 'abcdefghijklmnopqrstuvwxyz';
  let numbers = '0123456789';
  let symbols = '!@#$%^&*-_=+;:,.?/~';
  const similar = '0O1IlB8';
  const ambig = '{}[]()';

  if (toggles.noSimilar) {
    upper = upper.split('').filter(c=>!similar.includes(c)).join('');
    lower = lower.split('').filter(c=>!similar.includes(c)).join('');
    numbers = numbers.split('').filter(c=>!similar.includes(c)).join('');
  }
  if (toggles.noAmbig) {
    symbols = symbols.split('').filter(c=>!ambig.includes(c)).join('');
  }

  const excl = document.getElementById('excludeChars')?.value || '';
  let charset = '';
  if (toggles.upper) charset += upper;
  if (toggles.lower) charset += lower;
  if (toggles.numbers) charset += numbers;
  if (toggles.symbols) charset += symbols;
  if (excl) charset = charset.split('').filter(c=>!excl.includes(c)).join('');
  if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';
  return charset;
}

function generateClassic(length) {
  const charset = buildCharset();
  let pw = '';
  for (let i=0;i<length;i++) pw += charset[cryptoRand(charset.length)];
  return pw;
}

function generatePassphrase() {
  let words = [];
  for (let i=0;i<wordCount;i++) {
    let w = WORDS[cryptoRand(WORDS.length)];
    if (toggles.capitalize) w = w[0].toUpperCase() + w.slice(1);
    words.push(w);
  }
  let pw = words.join(separator);
  if (toggles.addNumber) pw += cryptoRand(100).toString().padStart(2,'0');
  return pw;
}

function generateQuantum(length) {
  const charset = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
  let pw = '';
  for (let i=0;i<length;i++) pw += charset[cryptoRand(charset.length)];
  return pw;
}

function generatePin(length) {
  let digits = '';
  for (let i=0;i<length;i++) digits += cryptoRand(10).toString();
  if (toggles.pinGroup && length >= 6) {
    let groups = [];
    for (let i=0;i<digits.length;i+=3) groups.push(digits.slice(i,i+3));
    digits = groups.join('-');
  }
  return digits;
}

function generatePw() {
  try {
    let pw = '';
    if (currentMode === 'classic') {
      const lenEl = document.getElementById('classicLen');
      const len = lenEl ? parseInt(lenEl.value) : 16;
      if (!len || len < 1) { toast('Password length must be at least 1'); return; }
      pw = generateClassic(len);
    } else if (currentMode === 'passphrase') {
      pw = generatePassphrase();
    } else if (currentMode === 'quantum') {
      const lenEl = document.getElementById('quantumLen');
      const len = lenEl ? parseInt(lenEl.value) : 64;
      if (!len || len < 1) { toast('Password length must be at least 1'); return; }
      pw = generateQuantum(len);
    } else if (currentMode === 'pin') {
      const lenEl = document.getElementById('pinLen');
      const len = lenEl ? parseInt(lenEl.value) : 6;
      if (!len || len < 1) { toast('PIN length must be at least 1'); return; }
      pw = generatePin(len);
    }
    if (!pw) { toast('Failed to generate password — please try again'); return; }
    currentPw = pw;
    renderPw(pw);
    addSession(pw);
  } catch(e) {
    toast('Failed to generate password — please try again');
  }
}

/* ══════════════════════════════════════════
   ENTROPY & STRENGTH
══════════════════════════════════════════ */
function calcEntropy(pw) {
  // Unique charset heuristic
  const chars = new Set(pw.split('')).size;
  let pool = 0;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^A-Za-z0-9]/.test(pw)) pool += 32;
  if (!pool) pool = chars;
  return Math.log2(Math.pow(pool, pw.replace(/-/g,'').replace(/ /g,'').length));
}

function strengthLabel(bits) {
  if (bits < 35) return ['Weak', 1, '#e06c75'];
  if (bits < 60) return ['Fair', 2, '#e5c07b'];
  if (bits < 80) return ['Strong', 3, '#98c379'];
  if (bits < 120) return ['Excellent', 4, '#61afef'];
  return ['Unbreakable', 5, '#c678dd'];
}

function renderStrength(pw) {
  const bits = Math.round(calcEntropy(pw));
  const [label, level, color] = strengthLabel(bits);
  const bars = document.querySelectorAll('.sbar');
  bars.forEach((b,i) => {
    b.style.background = i < level ? color : 'var(--border2)';
  });
  const strengthText = document.getElementById('strengthText');
  const strengthBits = document.getElementById('strengthBits');
  const badge = document.getElementById('pwBadge');
  if (strengthText) strengthText.textContent = label;
  if (strengthBits) strengthBits.textContent = `~${bits} bits`;
  if (badge) { badge.textContent = `${label} · ~${bits} bits`; badge.style.color = color; badge.style.borderColor = color; }
}

function renderCharMap(pw) {
  const wrap = document.getElementById('charMapWrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  const unique = [...new Set(pw.split(''))].slice(0,40);
  unique.forEach(c => {
    const sp = document.createElement('span');
    sp.textContent = c === ' ' ? '·' : c;
    sp.style.cssText = `font-family:Consolas,monospace;font-size:10px;color:var(--ink2);background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:2px 5px;`;
    wrap.appendChild(sp);
  });
}

function renderPw(pw) {
  const pwDisplay = document.getElementById('pwDisplay');
  if (pwDisplay) pwDisplay.textContent = pw;
  renderStrength(pw);
  renderCharMap(pw);
}

/* ══════════════════════════════════════════
   SESSION LOG
══════════════════════════════════════════ */
function addSession(pw) {
  sessionPws.unshift(pw);
  if (sessionPws.length > 20) sessionPws.pop();
  renderSession();
}

function renderSession() {
  const log = document.getElementById('sessionLog');
  if (!log) return;
  if (!sessionPws.length) { log.innerHTML = '<div style="padding:14px;font-size:11px;color:var(--ink3);text-align:center;">No entries yet</div>'; return; }
  log.innerHTML = sessionPws.map((pw,i) =>
    `<div class="session-entry">
      <span class="session-idx">${String(i+1).padStart(2,'0')}</span>
      <span class="session-pw">${pw}</span>
      <button class="session-copy" aria-label="Copy password ${i+1}" onclick="copyStr('${pw.replace(/\\/g,'\\\\').replace(/'/g,"\\'")}')">📋</button>
    </div>`
  ).join('');
}

function clearSession() {
  sessionPws = [];
  renderSession();
  toast('Session cleared');
}

/* ══════════════════════════════════════════
   COPY / CLIPBOARD
══════════════════════════════════════════ */
function _nexaClipboardCopy(text, onSuccess) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => { if (onSuccess) onSuccess(); else toast('Copied ✓'); })
      .catch(() => _nexaClipboardFallback(text, onSuccess));
  } else {
    _nexaClipboardFallback(text, onSuccess);
  }
}

function _nexaClipboardFallback(text, onSuccess) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if (ok) { if (onSuccess) onSuccess(); else toast('Copied ✓'); }
    else toast('Copy failed — please copy manually');
  } catch(e) {
    toast('Copy failed — please copy manually');
  }
}

async function copyStr(str) {
  if (!str) { toast('Nothing to copy'); return; }
  _nexaClipboardCopy(str);
}
function copyPw() {
  if (!currentPw) { toast('Generate a password first'); return; }
  _nexaClipboardCopy(currentPw);
}

/* ══════════════════════════════════════════
   MODE SWITCHING
══════════════════════════════════════════ */
function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('nav-' + mode).classList.add('active');
  document.querySelectorAll('.panel-section').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + mode).classList.add('active');
  generatePw();
}

/* ══════════════════════════════════════════
   TOGGLE CARDS
══════════════════════════════════════════ */
function toggleCard(key) {
  toggles[key] = !toggles[key];
  const el = document.getElementById('tc-' + key);
  if (el) { if (toggles[key]) el.classList.add('on'); else el.classList.remove('on'); }
  generatePw();
}

/* ══════════════════════════════════════════
   SLIDERS
══════════════════════════════════════════ */
function syncLen() {
  const el = document.getElementById('classicLen');
  const val = document.getElementById('classicLenVal');
  if (el && val) val.textContent = el.value;
}
function syncQuantumLen() {
  const el = document.getElementById('quantumLen');
  const val = document.getElementById('quantumLenVal');
  if (el && val) val.textContent = el.value;
}
function syncPinLen() {
  const el = document.getElementById('pinLen');
  const val = document.getElementById('pinLenVal');
  if (el && val) val.textContent = el.value;
}

/* ══════════════════════════════════════════
   PASSPHRASE CONTROLS
══════════════════════════════════════════ */
function setWordCount(n) {
  wordCount = n;
  document.querySelectorAll('[id^="wc"]').forEach(b => b.classList.remove('active'));
  const el = document.getElementById('wc' + n);
  if (el) el.classList.add('active');
  generatePw();
}

function setSep(s) {
  separator = s;
  document.querySelectorAll('.sep-chip').forEach(b => b.classList.remove('active'));
  const el = document.getElementById('sep-' + s);
  if (el) el.classList.add('active');
  generatePw();
}

/* ══════════════════════════════════════════
   BULK
══════════════════════════════════════════ */
function adjustBulk(delta) {
  bulkCount = Math.max(1, Math.min(50, bulkCount + delta));
  const el = document.getElementById('bulkCount');
  if (el) el.textContent = bulkCount;
}

function generateBulk() {
  try {
    const list = document.getElementById('bulkList');
    if (!list) return;
    const pws = [];
    for (let i=0;i<bulkCount;i++) {
      let pw = '';
      if (currentMode === 'classic') {
        const len = parseInt(document.getElementById('classicLen')?.value || 16);
        if (!len || len < 1) { toast('Password length must be at least 1'); return; }
        pw = generateClassic(len);
      } else if (currentMode === 'passphrase') {
        pw = generatePassphrase();
      } else if (currentMode === 'quantum') {
        pw = generateQuantum(64);
      } else if (currentMode === 'pin') {
        const len = parseInt(document.getElementById('pinLen')?.value || 6);
        pw = generatePin(len);
      } else {
        pw = generateClassic(16);
      }
      pws.push(pw);
    }
    list.innerHTML = pws.map((pw,i) =>
      `<div class="bulk-entry">
        <span class="bulk-num">${String(i+1).padStart(2,'0')}</span>
        <span class="bulk-pw">${pw}</span>
        <button class="bulk-copy-btn" aria-label="Copy password ${i+1}" onclick="copyStr('${pw.replace(/\\/g,'\\\\').replace(/'/g,"\\'")}')">📋</button>
      </div>`
    ).join('');
    toast(`${bulkCount} passwords generated`);
    window._bulkPws = pws;
  } catch(e) {
    toast('Failed to generate passwords — please try again');
  }
}

async function copyBulkAll() {
  if (!window._bulkPws?.length) { toast('Generate first'); return; }
  await copyStr(window._bulkPws.join('\n'));
}

function downloadBulk() {
  if (!window._bulkPws?.length) { toast('Generate first'); return; }
  const blob = new Blob([window._bulkPws.join('\n')], {type:'text/plain'});
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = 'nexa-vault-passwords.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('Downloaded ✓');
}

/* ══════════════════════════════════════════
   BREACH WATCH (HIBP k-Anonymity)
══════════════════════════════════════════ */
async function sha1(str) {
  const buf = new TextEncoder().encode(str);
  const hashBuf = await crypto.subtle.digest('SHA-1', buf);
  return [...new Uint8Array(hashBuf)].map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
}

async function scanBreach() {
  var res = document.getElementById('breachResult');
  if (res) {
    res.className = 'breach-result show';
    res.innerHTML = '<span class="breach-warn">Online check unavailable</span> - Breach lookup needs internet when you press Scan. Generate passwords and use the local strength meter offline.';
  }
  if (window.toast) toast('Breach lookup needs internet when you press Scan.');
}
/* ══════════════════════════════════════════
   TABS
══════════════════════════════════════════ */
function switchTab(tab) {
  document.querySelectorAll('.app-tab').forEach(t => t.classList.remove('active'));
  const tabEl = document.getElementById('tab-' + tab);
  if (tabEl) tabEl.classList.add('active');

  const secGen = document.getElementById('section-generator');
  const secBulk = document.getElementById('section-bulk');
  const secBreach = document.getElementById('section-breach');
  const secAbout = document.getElementById('section-about');

  if (secGen) secGen.style.display = 'none';
  if (secBulk) secBulk.style.display = 'none';
  if (secBreach) secBreach.style.display = 'none';
  if (secAbout) secAbout.classList.remove('active');

  if (tab === 'generator' && secGen) secGen.style.display = 'grid';
  else if (tab === 'bulk' && secBulk) secBulk.style.display = 'grid';
  else if (tab === 'breach' && secBreach) secBreach.style.display = 'grid';
  else if (tab === 'about' && secAbout) secAbout.classList.add('active');
}

/* ══════════════════════════════════════════
   THEME
══════════════════════════════════════════ */
const VAULT_THEME_LABELS = { ivory:'White', obsidian:'Black', void:'Purple', slate:'Blue', parchment:'Gold' };
const VAULT_THEME_ALIASES = { white:'ivory', black:'obsidian', purple:'void', blue:'slate', gold:'parchment', forest:'obsidian' };
function normalizeVaultTheme(theme) {
  theme = VAULT_THEME_ALIASES[theme] || theme;
  return VAULT_THEME_LABELS[theme] ? theme : 'ivory';
}
function setTheme(theme, label) {
  theme = normalizeVaultTheme(theme);
  label = label || VAULT_THEME_LABELS[theme];
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('vaultStudioTheme', theme);
  const themeLabel = document.getElementById('themeLabel');
  if (themeLabel) themeLabel.textContent = label;
  document.querySelectorAll('.theme-opt').forEach(o => o.classList.remove('active'));
  const opt = document.getElementById('opt-' + theme);
  if (opt) opt.classList.add('active');
  document.querySelectorAll('.m-theme-item').forEach(o => o.classList.remove('active'));
  const mopt = document.getElementById('mopt-' + theme);
  if (mopt) mopt.classList.add('active');
  closeThemePanel();
}

function toggleThemePanel() {
  const panel = document.getElementById('themePanel');
  const wrap = document.getElementById('themeBtnWrap');
  if (panel) panel.classList.toggle('open');
  if (wrap) wrap.classList.toggle('theme-panel-open');
}

function closeThemePanel() {
  const panel = document.getElementById('themePanel');
  const wrap = document.getElementById('themeBtnWrap');
  if (panel) panel.classList.remove('open');
  if (wrap) wrap.classList.remove('theme-panel-open');
}

document.addEventListener('click', e => {
  if (!document.getElementById('themeBtnWrap').contains(e.target)) closeThemePanel();
});

/* ══════════════════════════════════════════
   TOAST
══════════════════════════════════════════ */
let tt;
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(tt);
  tt = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
generatePw();

/* ══════════════════════════════════════════
   MOBILE UI LOGIC
══════════════════════════════════════════ */

/* ── Mobile state (mirrors desktop state) ── */
let mCurrentMode = 'classic';
let mCurrentPw = '';
let mBulkCount = 5;
let mWordCount = 3;
let mSeparator = '-';
let mSessionPws = [];
let mToggles = { upper:true, lower:true, numbers:true, symbols:true, noSimilar:false, noAmbig:false, capitalize:false, addNumber:false, pinGroup:false };

/* ── Navigation ── */
function mSwitchPage(page) {
  document.querySelectorAll('.m-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.m-nav-btn').forEach(b => b.classList.remove('active'));
  const pg = document.getElementById('mpage-' + page);
  const nav = document.getElementById('mnav-' + page);
  if (pg) { pg.classList.add('active'); pg.scrollTop = 0; }
  if (nav) nav.classList.add('active');
}

/* ── Theme ── */
function mOpenTheme() {
  document.getElementById('mThemeOverlay').classList.add('open');
}
function mCloseTheme(e) {
  document.getElementById('mThemeOverlay').classList.remove('open');
}
function mSetTheme(theme, label) {
  setTheme(theme, label);
  const overlay = document.getElementById('mThemeOverlay');
  if (overlay) overlay.classList.remove('open');
}

(function initVaultStudioTheme(){
  const saved = normalizeVaultTheme(localStorage.getItem('vaultStudioTheme') || localStorage.getItem('vault-theme') || document.documentElement.getAttribute('data-theme') || 'ivory');
  setTheme(saved, VAULT_THEME_LABELS[saved]);
})();

/* ── Mode switching ── */
function mSetMode(mode) {
  mCurrentMode = mode;
  // Update mode chips
  document.querySelectorAll('.m-mode-chip').forEach(c => c.classList.remove('active'));
  const chip = document.getElementById('mchip-' + mode);
  if (chip) chip.classList.add('active');
  // Show / hide config cards — also ensure active card is open
  ['classic','passphrase','quantum','pin'].forEach(m => {
    const card = document.getElementById('mconfig-' + m);
    if (!card) return;
    if (m === mode) {
      card.style.display = '';
      if (!card.classList.contains('open')) card.classList.add('open');
    } else {
      card.style.display = 'none';
    }
  });
  mGenPw();
}

/* ── Accordion toggle ── */
function mToggleConfig(mode) {
  const card = document.getElementById('mconfig-' + mode);
  if (!card) return;
  card.classList.toggle('open');
}

/* ── Slider sync ── */
function mSyncLen() {
  const v = document.getElementById('mClassicLen')?.value;
  const el = document.getElementById('mClassicLenVal');
  if (v && el) el.textContent = v;
}
function mSyncQuantumLen() {
  const v = document.getElementById('mQuantumLen')?.value;
  const el = document.getElementById('mQuantumLenVal');
  if (v && el) el.textContent = v;
}
function mSyncPinLen() {
  const v = document.getElementById('mPinLen')?.value;
  const el = document.getElementById('mPinLenVal');
  if (v && el) el.textContent = v;
}

/* ── Toggle cards ── */
function mToggleCard(key) {
  mToggles[key] = !mToggles[key];
  const el = document.getElementById('mtc-' + key);
  if (el) el.classList.toggle('on', mToggles[key]);
  // Sync desktop toggles
  toggles[key] = mToggles[key];
  const del = document.getElementById('tc-' + key);
  if (del) del.classList.toggle('on', mToggles[key]);
  mGenPw();
}

/* ── Word count ── */
function mSetWordCount(n) {
  mWordCount = n; wordCount = n;
  document.querySelectorAll('[id^="mwc"]').forEach(el => el.classList.remove('active'));
  const el = document.getElementById('mwc' + n);
  if (el) el.classList.add('active');
  // sync desktop
  document.querySelectorAll('[id^="wc"]').forEach(el => el.classList.remove('active'));
  const del = document.getElementById('wc' + n);
  if (del) del.classList.add('active');
  mGenPw();
}

/* ── Separator ── */
function mSetSep(s) {
  mSeparator = s; separator = s;
  document.querySelectorAll('[id^="msep-"]').forEach(el => el.classList.remove('active'));
  const safeId = s === ' ' ? 'msep-space' : ('msep-' + s);
  const el = document.getElementById(safeId);
  if (el) el.classList.add('active');
  // sync desktop
  document.querySelectorAll('[id^="sep-"]').forEach(el => el.classList.remove('active'));
  const del = document.getElementById('sep-' + s);
  if (del) del.classList.add('active');
  mGenPw();
}

/* ── Generate password (reuse desktop logic) ── */
function mGenPw() {
  // Sync desktop toggles into shared state
  toggles = { ...mToggles };
  wordCount = mWordCount;
  separator = mSeparator;
  currentMode = mCurrentMode;

  // Sync sliders
  if (mCurrentMode === 'classic') {
    const desktopSlider = document.getElementById('classicLen');
    const mSlider = document.getElementById('mClassicLen');
    if (desktopSlider && mSlider) desktopSlider.value = mSlider.value;
  } else if (mCurrentMode === 'quantum') {
    const desktopSlider = document.getElementById('quantumLen');
    const mSlider = document.getElementById('mQuantumLen');
    if (desktopSlider && mSlider) desktopSlider.value = mSlider.value;
  } else if (mCurrentMode === 'pin') {
    const desktopSlider = document.getElementById('pinLen');
    const mSlider = document.getElementById('mPinLen');
    if (desktopSlider && mSlider) desktopSlider.value = mSlider.value;
  }

  // Sync exclude
  const mExclude = document.getElementById('mExcludeChars');
  const dExclude = document.getElementById('excludeChars');
  if (mExclude && dExclude) dExclude.value = mExclude.value;

  generatePw(); // call desktop function which updates currentPw
  mCurrentPw = currentPw;
  mUpdatePwDisplay();
  mUpdateStrength();
}

/* Only call this on explicit user actions (button press / initial load) */
function mGenAndLog() {
  mGenPw();
  if (mCurrentPw) mAddToSession(mCurrentPw);
}

/* ── Update mobile display ── */
function mUpdatePwDisplay() {
  const el = document.getElementById('mPwDisplay');
  if (el) el.textContent = mCurrentPw || '—';
}

function mUpdateStrength() {
  // Read strength from desktop elements
  const badge = document.getElementById('pwBadge');
  const mbadge = document.getElementById('mPwBadge');
  if (badge && mbadge) {
    mbadge.textContent = badge.textContent;
    mbadge.style.color = badge.style.color;
    mbadge.style.borderColor = badge.style.borderColor;
  }
  // Entropy text
  const bits = document.getElementById('strengthBits');
  const mBits = document.getElementById('mEntropyText');
  if (bits && mBits) mBits.textContent = bits.textContent;
  // Sync strength bars
  for (let i = 1; i <= 5; i++) {
    const ds = document.getElementById('sb' + i);
    const ms = document.getElementById('msb' + i);
    if (ds && ms) ms.style.background = ds.style.background;
  }
}

/* ── Session log (mobile) ── */
function mAddToSession(pw) {
  if (!pw) return;
  mSessionPws.unshift(pw);
  if (mSessionPws.length > 12) mSessionPws = mSessionPws.slice(0, 12);
  mRenderSession();
}
function mEscHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function mRenderSession() {
  const log = document.getElementById('mSessionLog');
  if (!log) return;
  if (!mSessionPws.length) {
    log.innerHTML = '<div style="padding:14px;font-size:11px;color:var(--ink3);text-align:center;letter-spacing:0.06em;">No entries yet</div>';
    return;
  }
  log.innerHTML = '';
  mSessionPws.forEach((pw, i) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:9px 14px;border-bottom:1px solid var(--border);';
    const num = document.createElement('span');
    num.style.cssText = "font-family:Consolas,monospace;font-size:9px;color:var(--ink3);min-width:18px;";
    num.textContent = String(i+1).padStart(2,'0');
    const pwEl = document.createElement('span');
    pwEl.style.cssText = "font-family:Consolas,monospace;font-size:11px;color:var(--ink2);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";
    pwEl.textContent = pw;
    const btn = document.createElement('button');
    btn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:13px;color:var(--ink3);padding:4px;-webkit-tap-highlight-color:transparent;';
    btn.setAttribute('aria-label','Copy');
    btn.textContent = '\u{1F4CB}';
    btn.onclick = () => mCopyStr(pw);
    row.appendChild(num); row.appendChild(pwEl); row.appendChild(btn);
    log.appendChild(row);
  });
}
function mClearSession() {
  mSessionPws = [];
  mRenderSession();
  toast('Session cleared');
}

/* ── Copy ── */
async function mCopyPw() {
  if (!mCurrentPw) { toast('Generate a password first'); return; }
  await mCopyStr(mCurrentPw);
}
async function mCopyStr(str) {
  if (!str) { toast('Nothing to copy'); return; }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try { await navigator.clipboard.writeText(str); toast('Copied ✓'); return; } catch(e) {}
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = str; ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    toast(ok ? 'Copied ✓' : 'Copy failed — select manually');
  } catch(e) { toast('Copy failed — please copy manually'); }
}

/* ── Bulk ── */
function mAdjustBulk(delta) {
  mBulkCount = Math.max(1, Math.min(50, mBulkCount + delta));
  const el = document.getElementById('mBulkCount');
  if (el) el.textContent = mBulkCount;
}
function mGenerateBulk() {
  try {
    const list = document.getElementById('mBulkList');
    if (!list) return;
    // sync state
    bulkCount = mBulkCount;
    currentMode = mCurrentMode;
    toggles = { ...mToggles };
    wordCount = mWordCount;
    separator = mSeparator;
    const pws = [];
    for (let i = 0; i < mBulkCount; i++) {
      let pw = '';
      if (currentMode === 'classic') {
        const len = parseInt(document.getElementById('mClassicLen')?.value || 16);
        pw = generateClassic(len);
      } else if (currentMode === 'passphrase') {
        pw = generatePassphrase();
      } else if (currentMode === 'quantum') {
        pw = generateQuantum(parseInt(document.getElementById('mQuantumLen')?.value || 64));
      } else if (currentMode === 'pin') {
        pw = generatePin(parseInt(document.getElementById('mPinLen')?.value || 6));
      } else {
        pw = generateClassic(16);
      }
      pws.push(pw);
    }
    list.innerHTML = '';
    pws.forEach((pw, i) => {
      const row = document.createElement('div');
      row.className = 'm-bulk-entry';
      const num = document.createElement('span');
      num.className = 'm-bulk-num'; num.textContent = String(i+1).padStart(2,'0');
      const pwEl = document.createElement('span');
      pwEl.className = 'm-bulk-pw'; pwEl.textContent = pw;
      const btn = document.createElement('button');
      btn.className = 'm-bulk-copy'; btn.textContent = '\u{1F4CB}';
      btn.setAttribute('aria-label','Copy'); btn.onclick = () => mCopyStr(pw);
      row.appendChild(num); row.appendChild(pwEl); row.appendChild(btn);
      list.appendChild(row);
    });
    window._mBulkPws = pws;
    toast(`${mBulkCount} passwords generated`);
  } catch(e) {
    toast('Generation failed — try again');
  }
}
async function mCopyBulkAll() {
  if (!window._mBulkPws?.length) { toast('Generate first'); return; }
  await mCopyStr(window._mBulkPws.join('\n'));
}
function mDownloadBulk() {
  if (!window._mBulkPws?.length) { toast('Generate first'); return; }
  const blob = new Blob([window._mBulkPws.join('\n')], {type:'text/plain'});
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = 'nexa-vault-passwords.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('Downloaded ✓');
}

async function mScanBreach() {
  var res = document.getElementById('mBreachResult');
  if (res) {
    res.className = 'm-breach-result show';
    res.innerHTML = '<span class="breach-warn">Online check unavailable</span> - Breach lookup needs internet when you press Scan. Generate passwords and use the local strength meter offline.';
  }
  if (window.toast) toast('Breach lookup needs internet when you press Scan.');
}
/* ── Mobile init ── */
(function initMobile() {
  // Initial password generation — also log it
  mGenPw();
  if (mCurrentPw) mAddToSession(mCurrentPw);
  // Sync toggle UI states
  Object.keys(mToggles).forEach(key => {
    const el = document.getElementById('mtc-' + key);
    if (el) el.classList.toggle('on', mToggles[key]);
  });
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
  function show(id, cls){var res=document.getElementById(id); if(!res)return; res.className=cls; res.innerHTML='<span class="breach-warn">Online check unavailable</span> - Breach lookup needs internet when you press Scan. Generate passwords and use the local strength meter offline.';}
  window.scanBreach=function(){show('breachResult','breach-result show'); if(window.toast) toast('Breach lookup needs internet when you press Scan.');};
  window.mScanBreach=function(){show('mBreachResult','m-breach-result show'); if(window.toast) toast('Breach lookup needs internet when you press Scan.');};
  ready(function(){
    var copy='Breach checks require the online edition. Offline V1.0 keeps password generation, bulk generation, copy, download, and strength scoring local.';
    ['breachPwInput','mBreachInput'].forEach(function(id){var el=document.getElementById(id); if(el) el.placeholder='Enter password to scan when internet is available';});
    document.querySelectorAll('.breach-scan-btn,.m-breach-scan-btn').forEach(function(btn){btn.textContent='Offline V1.0';btn.setAttribute('title',copy);});
    var desktop=document.querySelector('#section-breach .panel-sub'); if(desktop) desktop.textContent=copy;
    var mobile=document.querySelector('#mpage-breach .m-page-sub'); if(mobile) mobile.textContent=copy;
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
  function render(id, cls, html){
    var result = document.getElementById(id);
    if(!result) return;
    result.className = cls;
    result.innerHTML = html;
  }
  async function run(inputId, resultId, cls){
    var input = document.getElementById(inputId);
    var password = input ? input.value : '';
    if(!password){
      if(window.toast) toast('Enter a password to scan');
      render(resultId, cls, '<span class="breach-warn">Password required</span> - Enter a password before scanning.');
      return;
    }
    render(resultId, cls, '<span class="breach-warn">Scanning...</span> Checking breach database with a private hash prefix.');
    try{
      var out = await queryPwned(password);
      if(out.found){
        render(resultId, cls, '<span class="breach-warn">Found in breaches</span> - This password appears in public breach data about ' + escapeHtml(out.count.toLocaleString()) + ' times. Generate a new password.');
      } else {
        render(resultId, cls, '<span class="breach-safe">No match found</span> - This password was not found in the public breach range response.');
      }
    } catch(error){
      render(resultId, cls, '<span class="breach-warn">Online check unavailable</span> - The page still works offline. To run Breach Watch, use internet access and a browser with Web Crypto support.');
    }
  }
  window.scanBreach = function(){ return run('breachPwInput','breachResult','breach-result show'); };
  window.mScanBreach = function(){ return run('mBreachInput','mBreachResult','m-breach-result show'); };
  ready(function(){
    var copy = 'Breach Watch uses a private SHA-1 hash prefix lookup when internet is available. The password itself is never sent.';
    ['breachPwInput','mBreachInput'].forEach(function(id){
      var input = document.getElementById(id);
      if(input) input.placeholder = 'Enter password to scan...';
    });
    document.querySelectorAll('.breach-scan-btn').forEach(function(btn){btn.textContent='Scan';btn.setAttribute('title',copy);});
    document.querySelectorAll('.m-breach-scan-btn').forEach(function(btn){btn.textContent='Scan Password';btn.setAttribute('title',copy);});
    var desktop = document.querySelector('#section-breach .panel-sub');
    if(desktop) desktop.textContent = 'Breach Watch uses the Have I Been Pwned k-anonymity API when internet is available. Passwords are never sent; only the first five SHA-1 hash characters are queried.';
    var mobile = document.querySelector('#mpage-breach .m-page-sub');
    if(mobile) mobile.textContent = desktop ? desktop.textContent : copy;
  });
})();;