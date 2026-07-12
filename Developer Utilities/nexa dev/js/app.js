/* ═══════════════════════════════════════════════
   NexaDev — Developer Utility  |  app.js
════════════════════════════════════════════════ */

/* ── Theme ── */
(function () {
  const saved = localStorage.getItem('nexaDevTheme') || 'void';
  document.documentElement.setAttribute('data-theme', saved);
})();

/* ── Cinematic Intro ── */
const WORDS = ['NexaDev', 'Developer', 'Utility', 'Offline', 'Ready'];
let wordIdx = 0;
const crtWordEl = document.getElementById('crtWord');

function typeCrtWord() {
  if (!crtWordEl) return;
  const word = WORDS[wordIdx % WORDS.length];
  let i = 0;
  crtWordEl.textContent = '';
  const ti = setInterval(() => {
    crtWordEl.textContent += word[i++];
    if (i >= word.length) {
      clearInterval(ti);
      wordIdx++;
      if (wordIdx < WORDS.length) {
        setTimeout(() => {
          let di = word.length;
          const dt = setInterval(() => {
            crtWordEl.textContent = crtWordEl.textContent.slice(0, --di);
            if (di <= 0) { clearInterval(dt); setTimeout(typeCrtWord, 120); }
          }, 40);
        }, 500);
      } else {
        setTimeout(dismissCurtain, 600);
      }
    }
  }, 70);
}

function dismissCurtain() {
  const crt = document.getElementById('curtain');
  if (crt) {
    crt.classList.add('crt-gone');
    setTimeout(() => { crt.style.display = 'none'; revealHero(); }, 750);
  }
}

function revealHero() {
  document.querySelectorAll('.ch').forEach((ch, i) => {
    setTimeout(() => ch.classList.add('visible'), i * 80);
  });
  typeEyebrow();
  scrollReveal();
}

/* Eyebrow type effect */
const EYEBROW = 'Developer Utility';
function typeEyebrow() {
  const el = document.getElementById('eyebrowTyped');
  if (!el) return;
  let i = 0;
  const ti = setInterval(() => {
    el.textContent += EYEBROW[i++];
    if (i >= EYEBROW.length) clearInterval(ti);
  }, 55);
}

/* ── Scroll Reveal ── */
function scrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.sr').forEach(el => obs.observe(el));
}

/* ── Toast ── */
function toast(msg, type = 'ok') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => {
    t.style.transition = 'opacity .3s, transform .3s';
    t.style.opacity = '0';
    t.style.transform = 'translateX(20px)';
    setTimeout(() => t.remove(), 350);
  }, 2200);
}

/* ── Tabs ── */
function switchTab(group, panelId, btn) {
  const card = btn.closest('.glass-card, [class*="card"]') || btn.parentElement.parentElement;
  card.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  card.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}

/* ── Chips ── */
function toggleChip(el) {
  el.classList.toggle('active');
  formatUrl();
}

/* ── URL Formatter ── */
function formatUrl() {
  const input = document.getElementById('urlInput');
  const output = document.getElementById('urlOutput');
  const partsEl = document.getElementById('urlParts');
  const partGrid = document.getElementById('urlPartGrid');
  const paramList = document.getElementById('urlParamList');
  if (!input || !output) return;

  const raw = input.value.trim();
  if (!raw) {
    output.innerHTML = '<span class="placeholder">Formatted URL will appear here…</span>';
    if (partsEl) partsEl.style.display = 'none';
    return;
  }

  let url;
  try {
    url = new URL(raw.startsWith('http') ? raw : 'https://' + raw);
  } catch {
    output.innerHTML = '<span style="color:var(--rd)">Invalid URL</span>';
    return;
  }

  const actions = {};
  document.querySelectorAll('#urlChips .chip.active').forEach(c => { actions[c.dataset.action] = true; });

  if (actions.lowercase) url.hostname = url.hostname.toLowerCase();
  if (actions.decode) {
    try { url = new URL(decodeURIComponent(url.toString())); } catch {}
  }
  if (actions.strip_utm) {
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(k => url.searchParams.delete(k));
  }
  if (actions.strip_all) {
    url.search = '';
  }
  if (actions.sort) {
    const params = [...url.searchParams.entries()].sort(([a],[b]) => a.localeCompare(b));
    url.search = '';
    params.forEach(([k,v]) => url.searchParams.append(k, v));
  }
  if (actions.trailing) {
    if (url.pathname !== '/' && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
    }
  }

  output.textContent = url.toString();
  output.style.color = 'var(--g)';

  // Parts breakdown
  if (partsEl && partGrid && paramList) {
    partsEl.style.display = 'block';
    const parts = [
      { key: 'Protocol', val: url.protocol.replace(':','') },
      { key: 'Hostname', val: url.hostname },
      { key: 'Port', val: url.port || '(default)' },
      { key: 'Path', val: url.pathname || '/' },
    ];
    if (url.hash) parts.push({ key: 'Hash', val: url.hash });
    partGrid.innerHTML = parts.map(p =>
      `<div class="url-part-item"><div class="url-part-key">${p.key}</div><div class="url-part-val">${p.val}</div></div>`
    ).join('');
    const params = [...url.searchParams.entries()];
    paramList.innerHTML = params.length
      ? params.map(([k,v]) => `<div class="url-param-item"><span class="url-param-key">${k}</span><span class="url-param-eq">=</span><span class="url-param-val">${v}</span></div>`).join('')
      : '';
  }
}

/* ── UTM Builder ── */
function buildUtm() {
  const base = document.getElementById('utmBase')?.value.trim();
  const out = document.getElementById('utmOutput');
  if (!out) return;
  if (!base) { out.innerHTML = '<span class="placeholder">Fill fields above to build the UTM URL…</span>'; return; }

  let url;
  try { url = new URL(base.startsWith('http') ? base : 'https://' + base); }
  catch { out.innerHTML = '<span style="color:var(--rd)">Invalid base URL</span>'; return; }

  const params = [
    ['utm_source',   document.getElementById('utmSource')?.value.trim()],
    ['utm_medium',   document.getElementById('utmMedium')?.value.trim()],
    ['utm_campaign', document.getElementById('utmCampaign')?.value.trim()],
    ['utm_term',     document.getElementById('utmTerm')?.value.trim()],
    ['utm_content',  document.getElementById('utmContent')?.value.trim()],
  ];
  params.forEach(([k,v]) => { if (v) url.searchParams.set(k, v); });
  out.textContent = url.toString();
}

function clearUtm() {
  ['utmBase','utmSource','utmMedium','utmCampaign','utmTerm','utmContent'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const out = document.getElementById('utmOutput');
  if (out) out.innerHTML = '<span class="placeholder">Fill fields above to build the UTM URL…</span>';
}

/* ── Copy Output ── */
function copyOutput(outputId, btnId) {
  const el = document.getElementById(outputId);
  const btn = document.getElementById(btnId);
  if (!el) return;
  const text = el.textContent;
  if (!text || text.includes('appear here')) { toast('Nothing to copy', 'err'); return; }
  navigator.clipboard.writeText(text).then(() => {
    if (btn) {
      btn.classList.add('copied');
      const orig = btn.textContent.trim();
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.classList.remove('copied'); btn.textContent = orig; }, 1600);
    }
    toast('Copied to clipboard');
  }).catch(() => toast('Copy failed', 'err'));
}

/* ── Clear Field ── */
function clearField(inputId, outputId) {
  const input = document.getElementById(inputId);
  const output = document.getElementById(outputId);
  if (input) input.value = '';
  if (output) output.innerHTML = '<span class="placeholder">Formatted ' + (outputId.includes('url') ? 'URL' : 'JSON') + ' will appear here…</span>';
  const partsEl = document.getElementById('urlParts');
  if (partsEl) partsEl.style.display = 'none';
}

/* ── How Accordion ── */
function toggleHow(bodyId, chevronId) {
  const body = document.getElementById(bodyId);
  const chevron = document.getElementById(chevronId);
  if (!body) return;
  const open = body.classList.toggle('open');
  if (chevron) chevron.classList.toggle('open', open);
}

/* ── UUID v4 ── */
function genUUID() {
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  const out = document.getElementById('uuidOut');
  if (out) out.textContent = uuid;
  navigator.clipboard.writeText(uuid).then(() => toast('UUID copied'));
}

/* ── Timestamp ── */
function copyTs(fmt) {
  const now = new Date();
  const tsOut = document.getElementById('tsOut');
  let val;
  if (fmt === 'unix') val = Math.floor(now.getTime() / 1000).toString();
  else if (fmt === 'iso') val = now.toISOString();
  else val = now.toLocaleString();
  if (tsOut) tsOut.textContent = val;
  navigator.clipboard.writeText(val).then(() => toast(`${fmt.toUpperCase()} timestamp copied`));
}

// Update timestamp display every second
setInterval(() => {
  const tsOut = document.getElementById('tsOut');
  if (tsOut && (tsOut.textContent === '—' || tsOut.textContent === '')) {
    tsOut.textContent = Math.floor(Date.now() / 1000);
  }
}, 1000);

/* ── Lorem Ipsum ── */
const LOREM_PARAS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.',
];
function genLorem(paras) {
  const text = LOREM_PARAS.slice(0, paras).join('\n\n');
  const out = document.getElementById('loremOut');
  if (out) out.textContent = text;
  navigator.clipboard.writeText(text).then(() => toast(`${paras} paragraph${paras > 1 ? 's' : ''} copied`));
}

/* ── Color Picker ── */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return { r, g, b };
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
}
let currentColor = '#00c97a';
function updateColor() {
  const pick = document.getElementById('colorPick');
  if (!pick) return;
  currentColor = pick.value;
  const out = document.getElementById('colorOut');
  if (out) out.textContent = currentColor;
}
function copyColor(fmt) {
  let val;
  const { r, g, b } = hexToRgb(currentColor);
  if (fmt === 'hex') val = currentColor;
  else if (fmt === 'rgb') val = `rgb(${r}, ${g}, ${b})`;
  else {
    const { h, s, l } = rgbToHsl(r, g, b);
    val = `hsl(${h}, ${s}%, ${l}%)`;
  }
  const out = document.getElementById('colorOut');
  if (out) out.textContent = val;
  navigator.clipboard.writeText(val).then(() => toast(`${fmt.toUpperCase()} copied`));
}

/* ── Base64 ── */
function doBase64(mode) {
  const input = document.getElementById('b64Input');
  const out = document.getElementById('b64Out');
  if (!input || !out) return;
  const val = input.value;
  if (!val) { toast('Enter text first', 'err'); return; }
  try {
    const result = mode === 'enc' ? btoa(unescape(encodeURIComponent(val))) : decodeURIComponent(escape(atob(val)));
    out.textContent = result;
    navigator.clipboard.writeText(result).then(() => toast(`${mode === 'enc' ? 'Encoded' : 'Decoded'} & copied`));
  } catch {
    out.textContent = 'Error: invalid input';
    toast('Conversion failed', 'err');
  }
}

/* ── Fake Email ── */
const ADJ  = ['swift','nova','dark','cyber','bright','zen','ultra','arc'];
const NOUN = ['fox','hawk','dev','coder','script','pixel','byte','node'];
const DOMS = ['test.dev','example.io','dev.local','null.io','fake.email'];
function genEmail() {
  const email = `${ADJ[Math.random()*ADJ.length|0]}.${NOUN[Math.random()*NOUN.length|0]}${Math.random()*900+100|0}@${DOMS[Math.random()*DOMS.length|0]}`;
  const out = document.getElementById('emailOut');
  if (out) out.textContent = email;
  navigator.clipboard.writeText(email).then(() => toast('Email copied'));
}

/* ── JSON Formatter ── */
let jsonMode = 'pretty';
function setJsonMode(mode) {
  jsonMode = mode;
  document.querySelectorAll('.json-mode-btn').forEach(b => b.classList.remove('active'));
  const activeId = { pretty: 'jsBtnPretty', minify: 'jsBtnMinify', sort: 'jsBtnSort' }[mode];
  const btn = document.getElementById(activeId);
  if (btn) btn.classList.add('active');
  processJson();
}

function processJson() {
  const input = document.getElementById('jsonInput');
  const output = document.getElementById('jsonOutput');
  const valid = document.getElementById('jsonValid');
  const stats = document.getElementById('jsonStats');
  if (!input || !output) return;
  const raw = input.value.trim();
  if (!raw) {
    output.innerHTML = '<span class="placeholder">Formatted JSON will appear here…</span>';
    if (valid) { valid.textContent = ''; valid.className = 'json-valid'; }
    if (stats) stats.style.display = 'none';
    return;
  }
  try {
    let obj = JSON.parse(raw);
    if (jsonMode === 'sort') obj = sortKeys(obj);
    let result;
    if (jsonMode === 'minify') result = JSON.stringify(obj);
    else result = JSON.stringify(obj, null, 2);
    output.textContent = result;
    if (valid) { valid.textContent = '✓ Valid JSON'; valid.className = 'json-valid ok'; }
    updateJsonStats(obj, result);
  } catch (e) {
    output.innerHTML = `<span style="color:var(--rd)">${e.message}</span>`;
    if (valid) { valid.textContent = '✗ ' + e.message; valid.className = 'json-valid err'; }
    if (stats) stats.style.display = 'none';
  }
}

function sortKeys(obj) {
  if (Array.isArray(obj)) return obj.map(sortKeys);
  if (obj && typeof obj === 'object') {
    return Object.keys(obj).sort().reduce((acc, k) => { acc[k] = sortKeys(obj[k]); return acc; }, {});
  }
  return obj;
}

function countKeys(obj) {
  if (typeof obj !== 'object' || !obj) return 0;
  return Object.keys(obj).length + Object.values(obj).reduce((s, v) => s + countKeys(v), 0);
}

function getDepth(obj) {
  if (typeof obj !== 'object' || !obj) return 0;
  return 1 + Math.max(0, ...Object.values(obj).map(getDepth));
}

function updateJsonStats(obj, str) {
  const stats = document.getElementById('jsonStats');
  if (!stats) return;
  stats.style.display = 'flex';
  const keys = document.getElementById('jsKeys');
  const depth = document.getElementById('jsDepth');
  const chars = document.getElementById('jsChars');
  const size = document.getElementById('jsSize');
  if (keys)  keys.textContent  = countKeys(obj);
  if (depth) depth.textContent = getDepth(obj);
  if (chars) chars.textContent = str.length.toLocaleString();
  if (size) {
    const bytes = new TextEncoder().encode(str).length;
    size.textContent = bytes < 1024 ? bytes + 'B' : (bytes/1024).toFixed(1) + 'KB';
  }
}

function downloadJson() {
  const output = document.getElementById('jsonOutput');
  if (!output || output.querySelector('.placeholder')) { toast('No valid JSON to download', 'err'); return; }
  const text = output.textContent;
  const blob = new Blob([text], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'nexadev-export.json';
  a.click();
  URL.revokeObjectURL(a.href);
  toast('JSON downloaded');
}

function resetJsonStats() {
  const stats = document.getElementById('jsonStats');
  if (stats) stats.style.display = 'none';
  const valid = document.getElementById('jsonValid');
  if (valid) { valid.textContent = ''; valid.className = 'json-valid'; }
}

/* ── Theme System ── */
function setTheme(theme, el) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('nexaDevTheme', theme);
  document.querySelectorAll('.theme-opt').forEach(opt => opt.classList.remove('active'));
  if (el) el.classList.add('active');
}

function toggleThemePanel() {
  const panel = document.getElementById('themePanel');
  if (panel) panel.classList.toggle('open');
}

// Sync theme panel active state on load
(function () {
  const saved = localStorage.getItem('nexaDevTheme') || 'void';
  const activeOpt = document.querySelector(`.theme-opt[data-theme="${saved}"]`);
  if (activeOpt) {
    document.querySelectorAll('.theme-opt').forEach(o => o.classList.remove('active'));
    activeOpt.classList.add('active');
  }
})();

// Close theme panel on outside click
document.addEventListener('click', (e) => {
  const switcher = document.getElementById('themeSwitcher');
  if (switcher && !switcher.contains(e.target)) {
    const panel = document.getElementById('themePanel');
    if (panel) panel.classList.remove('open');
  }
});

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  typeCrtWord();
});
